import {
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  Vector3,
} from "three";
import type { AppContext, SceneParams } from "../../types";
import { BaseScene } from "../Scene";
import { COLORS } from "../shared/palette";
import { gauss, gaussAniso, HeightSurface } from "../shared/surface";
import type { LabelHandle } from "../shared/labels";

const PLATEAU = { x: -2.6, z: 0 };
const PEAK = { x: 3, z: 0 };
const LATTICE_Y = 6.4;
const METHOD_COLORS = [COLORS.mint, COLORS.amber, COLORS.extraordinary, COLORS.local];

/**
 * ⑩ Governance & transformation. The mediocre output landscape sits at the
 * bottom; an orderly control-space lattice floats above. With governance on, the
 * value payload is lifted into the control layer, recombined, and projected back
 * down onto the true peak Y* — instead of being stuck in the wrong basin.
 */
export class GovernanceScene extends BaseScene {
  private payload!: Mesh;
  private lattice!: Mesh;
  private governanceOn = false;
  private method = 0;
  private phase = 0;
  private lOut!: LabelHandle;
  private lCtrl!: LabelHandle;
  private pBasin = new Vector3();
  private pPeak = new Vector3();

  protected orbitRadius = 15;
  protected orbitHeight = 9;
  protected orbitSpeed = 0.16;
  protected orbitSway = 0.4;
  protected target = new Vector3(0, 3, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  private valueH = (x: number, z: number): number =>
    1.0 * gauss(x, z, PLATEAU.x, PLATEAU.z, 6) + 4.5 * gaussAniso(x, z, PEAK.x, PEAK.z, 1, 1);

  protected build(): void {
    const surf = new HeightSurface(
      13,
      44,
      new MeshStandardMaterial({
        color: COLORS.mint,
        emissive: COLORS.mint,
        emissiveIntensity: 0.16,
        transparent: true,
        opacity: 0.7,
        side: DoubleSide,
        flatShading: true,
      }),
    );
    surf.setHeight(this.valueH);
    this.scene.add(surf.mesh);

    // control-space lattice (orderly, searchable) floating above
    this.lattice = new Mesh(
      new PlaneGeometry(12, 9, 12, 9),
      new MeshBasicMaterial({ color: COLORS.mint, wireframe: true, transparent: true, opacity: 0.5 }),
    );
    this.lattice.rotation.x = -Math.PI / 2;
    this.lattice.position.y = LATTICE_Y;
    this.scene.add(this.lattice);

    this.payload = new Mesh(
      new SphereGeometry(0.34, 24, 24),
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 1.2 }),
    );
    this.scene.add(this.payload);

    this.pBasin.set(PLATEAU.x, this.valueH(PLATEAU.x, PLATEAU.z) + 0.4, 0);
    this.pPeak.set(PEAK.x, this.valueH(PEAK.x, PEAK.z) + 0.4, 0);
    this.payload.position.copy(this.pBasin);

    this.lOut = this.labels.add(new Vector3(0, -1, 0), "is-prob");
    this.lCtrl = this.labels.add(new Vector3(0, LATTICE_Y + 1, 0), "is-value");
  }

  protected relabel(): void {
    const zh = this.lang === "zh";
    this.lOut.setText(zh ? "输出空间" : "Output space");
    this.lCtrl.setText(zh ? "控制空间" : "Control space");
  }

  setParams(p: SceneParams): void {
    if (p.governanceOn !== undefined) this.governanceOn = p.governanceOn;
    if (p.governanceMethod !== undefined) {
      this.method = p.governanceMethod;
      const col = METHOD_COLORS[this.method] ?? COLORS.mint;
      (this.lattice.material as MeshBasicMaterial).color.copy(col);
    }
  }

  protected tick(dt: number, elapsed: number): void {
    if (this.governanceOn) {
      this.phase = (this.phase + dt * 0.22) % 1;
      const t = this.phase;
      const pos = new Vector3();
      if (t < 0.3) {
        // rise from basin into the control layer
        const k = t / 0.3;
        pos.set(this.pBasin.x, MathUtils.lerp(this.pBasin.y, LATTICE_Y, k), 0);
      } else if (t < 0.7) {
        // search / recombine across the lattice
        const k = (t - 0.3) / 0.4;
        pos.set(MathUtils.lerp(this.pBasin.x, this.pPeak.x, k), LATTICE_Y + Math.sin(k * Math.PI) * 0.6, Math.sin(k * Math.PI * 2) * 1.2);
      } else {
        // project back down onto Y*
        const k = (t - 0.7) / 0.3;
        pos.set(this.pPeak.x, MathUtils.lerp(LATTICE_Y, this.pPeak.y, k), 0);
      }
      this.payload.position.copy(pos);
      (this.lattice.material as MeshBasicMaterial).opacity = 0.5;
    } else {
      // stuck oscillating in the wrong basin
      this.payload.position.set(
        this.pBasin.x + Math.sin(elapsed * 1.5) * 0.8,
        this.pBasin.y + Math.abs(Math.sin(elapsed * 3)) * 0.3,
        Math.cos(elapsed * 1.5) * 0.8,
      );
      (this.lattice.material as MeshBasicMaterial).opacity = 0.12;
    }
    this.lattice.position.y = LATTICE_Y + Math.sin(elapsed * 0.5) * 0.1;
  }
}
