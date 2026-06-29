import { WebGLRenderer } from "three";
import { isCoarsePointer } from "../dom";
import type { LabScene } from "./Scene";

interface Registered {
  id: string;
  scene: LabScene;
  stage: HTMLElement;
  canvas: HTMLCanvasElement; // visible 2D canvas in the frame
  ctx: CanvasRenderingContext2D;
}

const CLEAR = 0x0a1411; // solid dark backdrop matching the page surface

/**
 * One shared WebGLRenderer renders each scene into an OFFSCREEN canvas; the
 * result is blitted into each frame's own visible 2D <canvas> via drawImage.
 * A single WebGL context avoids the multi-context compositing failures that left
 * GPU-rendered content out of the displayed page; 2D canvases always composite
 * and screenshot reliably. One rAF loop; visibility checked per-frame via
 * getBoundingClientRect; loop pauses when the tab is hidden.
 */
export class SceneManager {
  private scenes = new Map<string, Registered>();
  private renderer: WebGLRenderer;
  private gl: HTMLCanvasElement;
  private running = false;
  private last = 0;
  private elapsed = 0;
  private rafId = 0;
  private dpr: number;
  private glW = 0;
  private glH = 0;

  constructor() {
    const coarse = isCoarsePointer();
    this.dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    this.gl = document.createElement("canvas");
    this.renderer = new WebGLRenderer({
      canvas: this.gl,
      antialias: !coarse,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true, // required so drawImage reads the rendered frame
    });
    this.renderer.setClearColor(CLEAR, 1);
    this.renderer.setPixelRatio(this.dpr);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  register(id: string, scene: LabScene, stage: HTMLElement): void {
    const canvas = document.createElement("canvas");
    canvas.className = "scene-canvas";
    stage.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    this.scenes.set(id, { id, scene, stage, canvas, ctx });
  }

  unregister(id: string): void {
    const r = this.scenes.get(id);
    if (!r) return;
    r.scene.dispose();
    r.canvas.remove();
    this.scenes.delete(id);
  }

  get(id: string): LabScene | undefined {
    return this.scenes.get(id)?.scene;
  }

  forEach(fn: (scene: LabScene) => void): void {
    for (const r of this.scenes.values()) fn(r.scene);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    this.elapsed += dt;
    const vh = window.innerHeight;
    const ratio = this.dpr;
    for (const r of this.scenes.values()) {
      const rect = r.canvas.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh || rect.width < 2 || rect.height < 2) continue;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      // size the shared renderer to this scene
      if (w !== this.glW || h !== this.glH) {
        this.renderer.setSize(w, h, false);
        this.glW = w;
        this.glH = h;
      }
      r.scene.resize(w, h);
      r.scene.update(dt, this.elapsed);
      this.renderer.render(r.scene.scene, r.scene.camera);

      // blit the rendered frame into the visible 2D canvas
      const bw = Math.round(w * ratio);
      const bh = Math.round(h * ratio);
      if (r.canvas.width !== bw || r.canvas.height !== bh) {
        r.canvas.width = bw;
        r.canvas.height = bh;
      }
      r.ctx.drawImage(this.gl, 0, 0, bw, bh);
    }
    this.rafId = requestAnimationFrame(this.loop);
  };

  private onVisibility = (): void => {
    if (document.hidden) this.stop();
    else this.start();
  };

  dispose(): void {
    this.stop();
    document.removeEventListener("visibilitychange", this.onVisibility);
    for (const id of [...this.scenes.keys()]) this.unregister(id);
    this.renderer.dispose();
  }
}
