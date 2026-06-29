import {
  CylinderGeometry,
  DoubleSide,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import type { AppContext, SceneParams } from "../../../types";
import { BaseScene } from "../../Scene";
import { COLORS } from "../../shared/palette";
import { gaussAniso, HeightSurface } from "../../shared/surface";
import type { LabelHandle } from "../../shared/labels";

const H1 = { x: -3, z: 0 };
const H2 = { x: 3, z: 0 };
const Z_POS = new Vector3(0, 0.4, -4.6);

/**
 * ④ State. One bright representation point Z forks into two superimposed value
 * worlds (h1, h2) whose peaks sit in different places, and into two
 * incompatible optimal actions. Without discriminating evidence they flicker in
 * superposition; "Evidence" collapses to the true state, "Toggle true state"
 * flips which world is real — the same action's value inverts.
 */
export class StateScene extends BaseScene {
  private s1!: HeightSurface;
  private s2!: HeightSurface;
  private zMark!: Mesh;
  private arm1!: Mesh;
  private arm2!: Mesh;
  private evidence = 0; // animated 0..1
  private evidenceTarget = 0;
  private trueState = 0; // 0 → h1 real, 1 → h2 real
  private lZ!: LabelHandle;
  private l1!: LabelHandle;
  private l2!: LabelHandle;

  protected orbitRadius = 14;
  protected orbitHeight = 8;
  protected orbitSpeed = 0.18;
  protected orbitSway = 0.4;
  protected target = new Vector3(0, 1.4, -0.5);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  private mat() {
    return new MeshStandardMaterial({
      color: COLORS.mint,
      emissive: COLORS.mint,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
      side: DoubleSide,
      flatShading: true,
    });
  }

  protected build(): void {
    this.s1 = new HeightSurface(11, 40, this.mat());
    this.s1.setHeight((x, z) => 0.4 + 4 * gaussAniso(x, z, H1.x, H1.z, 1.3, 1.3));
    this.scene.add(this.s1.mesh);

    this.s2 = new HeightSurface(11, 40, this.mat());
    this.s2.setHeight((x, z) => 0.4 + 4 * gaussAniso(x, z, H2.x, H2.z, 1.3, 1.3));
    this.scene.add(this.s2.mesh);

    this.zMark = new Mesh(
      new SphereGeometry(0.32, 22, 22),
      new MeshStandardMaterial({ color: COLORS.ink, emissive: COLORS.mint, emissiveIntensity: 1.4 }),
    );
    this.zMark.position.copy(Z_POS);
    this.scene.add(this.zMark);

    this.arm1 = this.makeArm(new Vector3(H1.x, 4.4, H1.z));
    this.arm2 = this.makeArm(new Vector3(H2.x, 4.4, H2.z));
    this.scene.add(this.arm1, this.arm2);

    this.lZ = this.labels.add(new Vector3(Z_POS.x, Z_POS.y + 0.9, Z_POS.z));
    this.l1 = this.labels.add(new Vector3(H1.x, 5, H1.z));
    this.l2 = this.labels.add(new Vector3(H2.x, 5, H2.z));
  }

  private makeArm(to: Vector3): Mesh {
    const dir = to.clone().sub(Z_POS);
    const len = dir.length();
    const geo = new CylinderGeometry(0.05, 0.05, len, 8);
    const mesh = new Mesh(
      geo,
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 0.8 }),
    );
    mesh.position.copy(Z_POS).add(dir.clone().multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  protected relabel(): void {
    const zh = this.lang === "zh";
    this.lZ.setText(zh ? "表征 Z" : "Representation Z", "Z");
    this.l1.setText(zh ? "状态 h₁" : "State h₁", "h₁");
    this.l2.setText(zh ? "状态 h₂" : "State h₂", "h₂");
  }

  setParams(p: SceneParams): void {
    if (p.evidence !== undefined) this.evidenceTarget = p.evidence ? 1 : 0;
    if (p.trueState !== undefined) this.trueState = p.trueState;
  }

  protected tick(dt: number, elapsed: number): void {
    this.evidence = MathUtils.damp(this.evidence, this.evidenceTarget, 4, dt);
    const flicker = 0.5 + 0.5 * Math.sin(elapsed * 4);
    const realIs1 = this.trueState === 0;

    // opacity: in superposition both ~flicker; with evidence, real→solid, ghost→faint
    const o1 = MathUtils.lerp(0.35 + 0.35 * flicker, realIs1 ? 0.95 : 0.12, this.evidence);
    const o2 = MathUtils.lerp(0.35 + 0.35 * (1 - flicker), realIs1 ? 0.12 : 0.95, this.evidence);
    (this.s1.mesh.material as MeshStandardMaterial).opacity = o1;
    (this.s2.mesh.material as MeshStandardMaterial).opacity = o2;

    const a1 = this.arm1.material as MeshStandardMaterial;
    const a2 = this.arm2.material as MeshStandardMaterial;
    a1.color.copy(realIs1 ? COLORS.mint : COLORS.orange);
    a1.emissive.copy(a1.color);
    a2.color.copy(realIs1 ? COLORS.orange : COLORS.mint);
    a2.emissive.copy(a2.color);
    a1.emissiveIntensity = MathUtils.lerp(0.6, realIs1 ? 1.2 : 0.3, this.evidence);
    a2.emissiveIntensity = MathUtils.lerp(0.6, realIs1 ? 0.3 : 1.2, this.evidence);
  }

  dispose(): void {
    this.s1.dispose();
    this.s2.dispose();
    super.dispose();
  }
}
