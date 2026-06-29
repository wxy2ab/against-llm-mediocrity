import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  Vector3,
} from "three";
import { content } from "../../../content";
import type { AppContext, SceneParams } from "../../../types";
import { BaseScene } from "../../Scene";
import { COLORS } from "../../shared/palette";
import type { LabelHandle } from "../../shared/labels";

interface WP {
  mesh: Mesh;
  proj: Mesh;
  x: number;
  y: number;
  z: number; // z = decisive variable V*
}

/**
 * ③ Observation–Representation. A 3D world cloud is projected onto the
 * representation plane Z; the decisive depth axis (V*) is flattened, so two
 * points of very different value land on the same spot. "Keep V*" rotates the
 * projection to preserve the axis, separating them.
 */
export class ObservationScene extends BaseScene {
  private pts: WP[] = [];
  private plane!: Mesh;
  private beams!: LineSegments;
  private keep = 0; // animated 0..1
  private keepTarget = 0;
  private lWorld!: LabelHandle;
  private lZ!: LabelHandle;

  protected orbitRadius = 13;
  protected orbitHeight = 5;
  protected orbitSpeed = 0.2;
  protected orbitSway = 0.45;
  protected target = new Vector3(-0.5, 1.5, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  protected build(): void {
    // representation plane Z (right)
    this.plane = new Mesh(
      new PlaneGeometry(0.15, 6, 1, 1),
      new MeshStandardMaterial({
        color: COLORS.ink,
        emissive: COLORS.mint,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.5,
        side: DoubleSide,
      }),
    );
    this.plane.position.set(4, 1.8, 0);
    this.scene.add(this.plane);

    const beamPos: number[] = [];
    for (let i = 0; i < 22; i++) {
      const x = -5 + Math.random() * 2.4;
      const y = 0.4 + Math.random() * 3.4;
      const z = (Math.random() * 2 - 1) * 2.4; // decisive variable
      const col = z >= 0 ? COLORS.mint : COLORS.orange;
      const mesh = new Mesh(
        new SphereGeometry(0.16, 14, 14),
        new MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.8 }),
      );
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      const proj = new Mesh(
        new SphereGeometry(0.13, 12, 12),
        new MeshStandardMaterial({ color: COLORS.muted, emissive: COLORS.muted, emissiveIntensity: 0.5 }),
      );
      this.scene.add(proj);
      this.pts.push({ mesh, proj, x, y, z });
      beamPos.push(x, y, z, 4, y, 0);
    }
    const bg = new BufferGeometry();
    bg.setAttribute("position", new Float32BufferAttribute(beamPos, 3));
    this.beams = new LineSegments(
      bg,
      new LineBasicMaterial({ color: COLORS.line, transparent: true, opacity: 0.35 }),
    );
    this.scene.add(this.beams);

    this.lWorld = this.labels.add(new Vector3(-4, 4.2, 0));
    this.lZ = this.labels.add(new Vector3(4, 4, 0), "is-value");
  }

  protected relabel(): void {
    const lang = this.lang;
    this.lWorld.setText(lang === "zh" ? "决定性变量 V*" : "Decisive variable V*", "V*");
    this.lZ.setText(lang === "zh" ? "表征 Z" : "Representation Z", "Z");
  }

  setParams(p: SceneParams): void {
    if (p.keepVariable !== undefined) this.keepTarget = p.keepVariable ? 1 : 0;
  }

  protected tick(dt: number): void {
    this.keep = MathUtils.damp(this.keep, this.keepTarget, 4, dt);
    const pos = this.beams.geometry.attributes.position;
    for (let i = 0; i < this.pts.length; i++) {
      const p = this.pts[i];
      // collapsed (keep=0): z→0, gray; preserved (keep=1): z kept, colored
      const z = p.z * this.keep;
      p.proj.position.set(4, p.y, z);
      const m = p.proj.material as MeshStandardMaterial;
      const target = p.z >= 0 ? COLORS.mint : COLORS.orange;
      m.color.copy(COLORS.muted).lerp(target, this.keep);
      m.emissive.copy(m.color);
      pos.setXYZ(i * 2 + 1, 4, p.y, z);
    }
    pos.needsUpdate = true;
    // plane tilts to signal the preserved axis
    this.plane.rotation.y = this.keep * Math.PI * 0.5;
  }
}
