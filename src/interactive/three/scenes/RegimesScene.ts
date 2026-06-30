import {
  Color,
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RingGeometry,
  Vector3,
} from "three";
import { content } from "../../content";
import type { AppContext, Regime, SceneParams } from "../../types";
import { BaseScene } from "../Scene";
import { COLORS } from "../shared/palette";
import { gaussAniso, HeightSurface } from "../shared/surface";
import type { LabelHandle } from "../shared/labels";

const VALUE_PEAK = 2.4;
const PROB_PEAK: Record<Regime, number> = { mediocre: -2.8, local: 0.3, extraordinary: 2.4 };
const ACCENT: Record<Regime, Color> = {
  mediocre: COLORS.mediocre,
  local: COLORS.local,
  extraordinary: COLORS.extraordinary,
};

/**
 * ⑨ Three regimes. The same p_θ–U relationship in three configurations. The
 * orange probability duvet morphs between sitting far from the mint value peak
 * (mediocrity), overlapping then diverging (local alignment), and sitting right
 * on the peak (excellence). Regime triad colors tint the base.
 */
export class RegimesScene extends BaseScene {
  private value!: HeightSurface;
  private prob!: HeightSurface;
  private ring!: Mesh;
  private regime: Regime = "mediocre";
  private peakX = PROB_PEAK.mediocre; // animated
  private lValue!: LabelHandle;
  private lProb!: LabelHandle;

  protected orbitRadius = 14;
  protected orbitHeight = 10;
  protected orbitSpeed = 0.17;
  protected orbitSway = 0.4;
  protected target = new Vector3(0, 1.2, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  private valueH = (x: number, z: number): number =>
    0.3 + 4.4 * gaussAniso(x, z, VALUE_PEAK, 0, 2.2, 5);
  private probH = (x: number, z: number): number =>
    0.3 + 3.2 * gaussAniso(x, z, this.peakX, 0, 2.2, 5);

  protected build(): void {
    this.value = new HeightSurface(
      13,
      44,
      new MeshStandardMaterial({
        color: COLORS.mint,
        emissive: COLORS.mint,
        emissiveIntensity: 0.22,
        transparent: true,
        opacity: 0.9,
        side: DoubleSide,
        flatShading: true,
      }),
    );
    this.value.setHeight(this.valueH);
    this.scene.add(this.value.mesh);

    // probability as an orange WIREFRAME draped over the value terrain, so both
    // surfaces are always visible (a translucent sheet hides one or the other)
    this.prob = new HeightSurface(
      13,
      30,
      new MeshStandardMaterial({
        color: COLORS.orange,
        emissive: COLORS.orange,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.85,
        wireframe: true,
      }),
    );
    this.prob.setHeight(this.probH);
    this.prob.mesh.position.y = 0.08;
    this.scene.add(this.prob.mesh);

    this.ring = new Mesh(
      new RingGeometry(6, 6.6, 64),
      new MeshBasicMaterial({ color: ACCENT.mediocre, transparent: true, opacity: 0.6, side: DoubleSide }),
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = 0.02;
    this.scene.add(this.ring);

    this.lValue = this.labels.add(new Vector3(VALUE_PEAK, 5, 0), "is-value");
    this.lProb = this.labels.add(new Vector3(PROB_PEAK.mediocre, 4, 0), "is-prob");
  }

  protected relabel(): void {
    const zh = this.lang === "zh";
    this.lValue.setText(zh ? "价值峰 U" : "Value peak U", "U");
    this.lProb.setText(zh ? "概率峰 p_θ" : "Probability p_θ", "p_θ");
  }

  setParams(p: SceneParams): void {
    if (p.regime !== undefined) {
      this.regime = p.regime;
      (this.ring.material as MeshBasicMaterial).color.copy(ACCENT[this.regime]);
    }
  }

  protected tick(dt: number): void {
    const targetX = PROB_PEAK[this.regime];
    const moving = Math.abs(this.peakX - targetX) > 0.001;
    this.peakX = MathUtils.damp(this.peakX, targetX, 3, dt);
    if (moving) this.prob.setHeight(this.probH);
    this.lProb.anchor.set(this.peakX, 4, 0);

    // when probability sits on the value peak, the overlap glows toward white
    const aligned = 1 - Math.min(1, Math.abs(this.peakX - VALUE_PEAK) / 5.2);
    const pm = this.prob.mesh.material as MeshStandardMaterial;
    pm.emissive.copy(COLORS.orange).lerp(COLORS.mintHot, aligned * 0.8);
    pm.emissiveIntensity = 0.35 + aligned * 0.5;
  }

  dispose(): void {
    this.value.dispose();
    this.prob.dispose();
    super.dispose();
  }
}
