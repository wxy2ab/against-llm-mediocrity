import { WebGLRenderer } from "three";
import { isCoarsePointer } from "../dom";
import type { LabScene } from "./Scene";

interface Registered {
  id: string;
  scene: LabScene;
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  w: number;
  h: number;
}

const CLEAR = 0x0a1411; // solid dark backdrop matching the page surface

/**
 * Each scene renders into its own in-flow <canvas> filling its frame — directly
 * visible, no fixed-canvas-behind-content compositing. One rAF loop drives them
 * all; visibility is checked per-frame via getBoundingClientRect (cheap, and
 * robust where IntersectionObserver is throttled). The loop pauses when the tab
 * is hidden. ~5 contexts (mismatch reuses its slot) is well within limits.
 */
export class SceneManager {
  private scenes = new Map<string, Registered>();
  private running = false;
  private last = 0;
  private elapsed = 0;
  private rafId = 0;
  private dpr: number;
  private antialias: boolean;

  constructor() {
    const coarse = isCoarsePointer();
    this.dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    this.antialias = !coarse;
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  register(id: string, scene: LabScene, stage: HTMLElement): void {
    const canvas = document.createElement("canvas");
    canvas.className = "scene-canvas";
    stage.appendChild(canvas);
    const renderer = new WebGLRenderer({
      canvas,
      antialias: this.antialias,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(CLEAR, 1);
    renderer.setPixelRatio(this.dpr);
    const entry: Registered = { id, scene, stage, canvas, renderer, w: 0, h: 0 };
    this.sync(entry);
    this.scenes.set(id, entry);
  }

  unregister(id: string): void {
    const r = this.scenes.get(id);
    if (!r) return;
    r.scene.dispose();
    r.renderer.dispose();
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

  private sync(r: Registered): boolean {
    const w = r.canvas.clientWidth;
    const h = r.canvas.clientHeight;
    if (w < 2 || h < 2) return false;
    if (w !== r.w || h !== r.h) {
      r.w = w;
      r.h = h;
      r.renderer.setSize(w, h, false);
      r.scene.resize(w, h);
    }
    return true;
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    this.elapsed += dt;
    const vh = window.innerHeight;
    for (const r of this.scenes.values()) {
      const rect = r.canvas.getBoundingClientRect();
      // only render scenes whose canvas is on screen
      if (rect.bottom < 0 || rect.top > vh || rect.width < 2 || rect.height < 2) continue;
      if (!this.sync(r)) continue;
      r.scene.update(dt, this.elapsed);
      r.renderer.render(r.scene.scene, r.scene.camera);
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
  }
}
