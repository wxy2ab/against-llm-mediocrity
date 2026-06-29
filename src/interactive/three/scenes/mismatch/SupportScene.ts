import {
  BoxGeometry,
  ConeGeometry,
  DoubleSide,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import type { AppContext, SceneParams } from "../../../types";
import { BaseScene } from "../../Scene";
import { COLORS } from "../../shared/palette";
import { gauss, HeightSurface } from "../../shared/surface";
import type { LabelHandle } from "../../shared/labels";

const FOOT = { x: -2.2, z: 0 };
const SPIRE = { x: 3.2, z: 0 };
const SPIRE_H = 5.6;
const N_FLIES = 90;

/**
 * ⑥ Support. A tall thin value spire Y* stands alone in a dark valley where the
 * probability fog is ~0. The sampler (fireflies) only drifts over the bright
 * foothills under a budget dome and never reaches the spire — until "Control
 * ladder" builds a path of intermediate structures they can climb.
 */
export class SupportScene extends BaseScene {
  private flies!: InstancedMesh;
  private dome!: Mesh;
  private spire!: Mesh;
  private ladder: Mesh[] = [];
  private fly: { ang: number; rad: number; phase: number; climb: number }[] = [];
  private dummy = new Matrix4();
  private budget = 0.35;
  private ladderOn = 0; // animated
  private ladderTarget = 0;
  private lSpire!: LabelHandle;
  private lFog!: LabelHandle;

  protected orbitRadius = 14;
  protected orbitHeight = 8;
  protected orbitSpeed = 0.17;
  protected orbitSway = 0.45;
  protected target = new Vector3(0.5, 1.6, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  protected build(): void {
    const surf = new HeightSurface(
      13,
      40,
      new MeshStandardMaterial({
        color: COLORS.mint,
        emissive: COLORS.mint,
        emissiveIntensity: 0.16,
        transparent: true,
        opacity: 0.6,
        side: DoubleSide,
        flatShading: true,
      }),
    );
    surf.setHeight((x, z) => 1.1 * gauss(x, z, FOOT.x, FOOT.z, 6));
    this.scene.add(surf.mesh);

    // the spire Y*
    this.spire = new Mesh(
      new ConeGeometry(0.45, SPIRE_H, 20),
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 1.1 }),
    );
    this.spire.position.set(SPIRE.x, SPIRE_H / 2, SPIRE.z);
    this.scene.add(this.spire);

    // budget dome (firefly ceiling)
    this.dome = new Mesh(
      new SphereGeometry(4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new MeshBasicMaterial({ color: COLORS.orange, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    this.dome.position.set(FOOT.x, 0, FOOT.z);
    this.scene.add(this.dome);

    // fireflies (the sampler)
    this.flies = new InstancedMesh(
      new SphereGeometry(0.08, 6, 6),
      new MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 1 }),
      N_FLIES,
    );
    for (let i = 0; i < N_FLIES; i++) {
      this.fly.push({
        ang: Math.random() * Math.PI * 2,
        rad: 0.6 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        climb: 0,
      });
    }
    this.scene.add(this.flies);

    // control-space ladder (intermediate structures), hidden until built
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const step = new Mesh(
        new BoxGeometry(0.7, 0.18, 0.7),
        new MeshStandardMaterial({ color: COLORS.mintHot, emissive: COLORS.mint, emissiveIntensity: 0.7, transparent: true, opacity: 0 }),
      );
      step.position.set(MathUtils.lerp(FOOT.x + 1.5, SPIRE.x, t), 0.5 + t * (SPIRE_H - 1), MathUtils.lerp(0, 0, t));
      this.scene.add(step);
      this.ladder.push(step);
    }

    this.lSpire = this.labels.add(new Vector3(SPIRE.x, SPIRE_H + 0.6, SPIRE.z), "is-value");
    this.lFog = this.labels.add(new Vector3(FOOT.x, 3.6, FOOT.z), "is-prob");
  }

  protected relabel(): void {
    const zh = this.lang === "zh";
    this.lSpire.setText(zh ? "高价值尖塔 Y*" : "High-value spire Y*", "Y*");
    this.lFog.setText(zh ? "采样预算 B" : "Sampling budget B", "B");
  }

  setParams(p: SceneParams): void {
    if (p.budget !== undefined) this.budget = p.budget / 100;
    if (p.ladder !== undefined) this.ladderTarget = p.ladder ? 1 : 0;
  }

  protected tick(dt: number, elapsed: number): void {
    this.ladderOn = MathUtils.damp(this.ladderOn, this.ladderTarget, 3, dt);
    const ceiling = 1 + this.budget * 2.4;
    this.dome.scale.set(1, ceiling / 4, 1);

    for (let i = 0; i < this.ladder.length; i++) {
      (this.ladder[i].material as MeshStandardMaterial).opacity = this.ladderOn * 0.85;
    }

    for (let i = 0; i < N_FLIES; i++) {
      const f = this.fly[i];
      f.ang += dt * (0.3 + (i % 5) * 0.05);
      // ladder routes a portion of the fireflies up to the spire
      const wantsClimb = this.ladderOn > 0.2 && i % 3 === 0 ? 1 : 0;
      f.climb = MathUtils.damp(f.climb, wantsClimb * this.ladderOn, 2, dt);
      const footX = FOOT.x + Math.cos(f.ang) * f.rad;
      const footZ = FOOT.z + Math.sin(f.ang) * f.rad;
      const footY = Math.min(ceiling, 0.6 + 0.4 * Math.sin(elapsed + f.phase) + f.rad * 0.15);
      const x = MathUtils.lerp(footX, SPIRE.x, f.climb);
      const y = MathUtils.lerp(footY, SPIRE_H * 0.85, f.climb);
      const z = MathUtils.lerp(footZ, SPIRE.z, f.climb);
      this.dummy.makeTranslation(x, y, z);
      this.flies.setMatrixAt(i, this.dummy);
    }
    this.flies.instanceMatrix.needsUpdate = true;
    this.spire.rotation.y = elapsed * 0.4;
  }

  dispose(): void {
    this.flies.geometry.dispose();
    (this.flies.material as MeshStandardMaterial).dispose();
    super.dispose();
  }
}
