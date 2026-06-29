import {
  AmbientLight,
  DirectionalLight,
  Material,
  Mesh,
  type Object3D,
  PerspectiveCamera,
  PointLight,
  Scene as ThreeScene,
  Vector3,
} from "three";
import type { AppContext, Lang, SceneParams } from "../types";
import { LabelLayer } from "./shared/labels";
import { COLORS } from "./shared/palette";

export interface LabScene {
  readonly scene: ThreeScene;
  readonly camera: PerspectiveCamera;
  setParams(p: SceneParams): void;
  setLang(lang: Lang): void;
  update(dt: number, elapsed: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

/** Recursively dispose GPU resources — three does not GC them automatically. */
export function disposeObject(obj: Object3D): void {
  obj.traverse((o) => {
    const mesh = o as Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) (mat as Material).dispose();
  });
}

/**
 * Common scene scaffolding: a slow auto-orbit camera (no OrbitControls, so the
 * shared fixed canvas needs no pointer routing — all interaction is via the DOM
 * panel), standard lighting, a label layer, and lifecycle plumbing.
 */
export abstract class BaseScene implements LabScene {
  readonly scene = new ThreeScene();
  readonly camera: PerspectiveCamera;
  protected labels: LabelLayer;
  protected lang: Lang;
  protected reduced: boolean;

  // Camera is a gentle sinusoidal sway around baseAngle — never a full orbit,
  // so long/asymmetric scenes are never seen edge-on. Subclasses tune these.
  protected autoOrbit = true;
  protected orbitRadius = 11;
  protected orbitHeight = 6;
  protected orbitSpeed = 0.3; // sway frequency
  protected orbitSway = 0.5; // sway amplitude (radians)
  protected baseAngle = Math.PI * 0.5;
  protected target = new Vector3(0, 0.5, 0);

  private w = 1;
  private h = 1;

  constructor(overlay: HTMLElement, ctx: AppContext) {
    this.lang = ctx.lang;
    this.reduced = ctx.prefersReducedMotion;
    this.camera = new PerspectiveCamera(45, 1, 0.1, 200);
    this.labels = new LabelLayer(overlay);

    const ambient = new AmbientLight(COLORS.ink, 0.85);
    const key = new DirectionalLight(COLORS.ink, 1.5);
    key.position.set(6, 12, 8);
    const mintFill = new PointLight(COLORS.mint, 0.8, 80);
    mintFill.position.set(-8, 6, 6);
    const orangeFill = new PointLight(COLORS.orange, 0.6, 80);
    orangeFill.position.set(8, 3, -6);
    this.scene.add(ambient, key, mintFill, orangeFill);
  }

  /** Subclasses build geometry here, then must call relabel(). */
  protected abstract build(): void;
  protected abstract relabel(): void;

  /** Call once after construction (subclass fields are initialized by then). */
  protected init(): void {
    this.build();
    this.relabel();
  }

  setParams(_p: SceneParams): void {}

  setLang(lang: Lang): void {
    this.lang = lang;
    this.relabel();
  }

  update(dt: number, elapsed: number): void {
    const sway = this.autoOrbit && !this.reduced ? Math.sin(elapsed * this.orbitSpeed) * this.orbitSway : 0;
    const a = this.baseAngle + sway;
    this.camera.position.set(
      Math.cos(a) * this.orbitRadius,
      this.orbitHeight,
      Math.sin(a) * this.orbitRadius,
    );
    this.camera.lookAt(this.target);
    this.tick(dt, elapsed);
    this.labels.project(this.camera, this.w, this.h);
  }

  /** Per-frame hook for subclasses. */
  protected tick(_dt: number, _elapsed: number): void {}

  resize(width: number, height: number): void {
    this.w = width;
    this.h = height;
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.labels.dispose();
    disposeObject(this.scene);
    this.scene.clear();
  }
}
