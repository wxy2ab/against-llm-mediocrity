import { WebGLRenderer } from "three";
import { isCoarsePointer } from "../dom";
import type { LabScene } from "./Scene";

interface Registered {
  id: string;
  scene: LabScene;
  stage: HTMLElement;
  active: boolean;
}

/**
 * One WebGLRenderer for the whole page. Each on-screen scene is rendered into
 * its stage element's rect via setViewport/setScissor (scissor multiplexing),
 * so we never spin up 8+ WebGL contexts. Off-screen scenes are skipped via an
 * IntersectionObserver; the loop pauses entirely when the tab is hidden.
 */
export class SceneManager {
  private renderer: WebGLRenderer;
  private scenes = new Map<string, Registered>();
  private io: IntersectionObserver;
  private running = false;
  private last = 0;
  private elapsed = 0;
  private rafId = 0;
  private canvas: HTMLCanvasElement;
  private vw = 1;
  private vh = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const coarse = isCoarsePointer();
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !coarse,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
    this.renderer.setScissorTest(true);
    this.resizeCanvas();

    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          for (const r of this.scenes.values()) {
            if (r.stage === e.target) r.active = e.isIntersecting;
          }
        }
      },
      { threshold: 0.02 },
    );

    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  register(id: string, scene: LabScene, stage: HTMLElement): void {
    this.io.observe(stage);
    this.scenes.set(id, { id, scene, stage, active: false });
  }

  unregister(id: string): void {
    const r = this.scenes.get(id);
    if (!r) return;
    this.io.unobserve(r.stage);
    r.scene.dispose();
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
    this.renderFrame(dt);
    this.rafId = requestAnimationFrame(this.loop);
  };

  private renderFrame(dt: number): void {
    const viewH = this.vh;
    for (const r of this.scenes.values()) {
      if (!r.active) continue;
      const rect = r.stage.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewH || rect.width < 2 || rect.height < 2) continue;
      // WebGL viewport origin is bottom-left; CSS rect is top-left.
      const x = rect.left;
      const y = viewH - rect.bottom;
      this.renderer.setViewport(x, y, rect.width, rect.height);
      this.renderer.setScissor(x, y, rect.width, rect.height);
      r.scene.resize(rect.width, rect.height);
      r.scene.update(dt, this.elapsed);
      this.renderer.render(r.scene.scene, r.scene.camera);
    }
  }

  private resizeCanvas(): void {
    // documentElement.clientWidth/Height exclude the scrollbar and match the
    // coordinate space of getBoundingClientRect (viewport-relative). updateStyle
    // = true so three sets explicit CSS px on the canvas — without it the
    // <canvas> (a replaced element) would adopt its drawing-buffer size.
    this.vw = document.documentElement.clientWidth;
    this.vh = document.documentElement.clientHeight;
    this.renderer.setSize(this.vw, this.vh, true);
  }

  private onResize = (): void => {
    this.resizeCanvas();
  };

  private onVisibility = (): void => {
    if (document.hidden) this.stop();
    else this.start();
  };

  dispose(): void {
    this.stop();
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.io.disconnect();
    for (const id of [...this.scenes.keys()]) this.unregister(id);
    this.renderer.dispose();
  }
}
