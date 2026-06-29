import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
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

const U_PEAK = -2.5;
const PROXY_PEAK0 = 2.6;

/**
 * ⑧ Specification. Two value surfaces over the same floor: true utility U (mint)
 * and accessible proxy Ũ (orange), with peaks in different places. A climber
 * ascends Ũ confidently while a drop-line shows that point is only mid-slope on
 * U — the better it optimizes the proxy, the further from the true peak. A
 * counterexample bends Ũ toward U until the peaks converge.
 */
export class SpecificationScene extends BaseScene {
  private uSurf!: HeightSurface;
  private proxySurf!: HeightSurface;
  private climber!: Mesh;
  private dropLine!: Line;
  private optimize = 0; // 0..1
  private counter = 0; // animated
  private counterTarget = 0;
  private lU!: LabelHandle;
  private lProxy!: LabelHandle;

  protected orbitRadius = 14;
  protected orbitHeight = 9;
  protected orbitSpeed = 0.17;
  protected orbitSway = 0.4;
  protected target = new Vector3(0, 1.4, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  private uHeight = (x: number, z: number): number => 0.3 + 4.6 * gaussAniso(x, z, U_PEAK, 0, 3, 4);
  private proxyPeakX = (): number => MathUtils.lerp(PROXY_PEAK0, U_PEAK + 0.4, this.counter);
  private proxyHeight = (x: number, z: number): number =>
    0.3 + 4.2 * gaussAniso(x, z, this.proxyPeakX(), 0, 3, 4);

  protected build(): void {
    this.uSurf = new HeightSurface(
      13,
      44,
      new MeshStandardMaterial({
        color: COLORS.mint,
        emissive: COLORS.mint,
        emissiveIntensity: 0.22,
        transparent: true,
        opacity: 0.85,
        side: DoubleSide,
        flatShading: true,
      }),
    );
    this.uSurf.setHeight(this.uHeight);
    this.scene.add(this.uSurf.mesh);

    this.proxySurf = new HeightSurface(
      13,
      44,
      new MeshStandardMaterial({
        color: COLORS.orange,
        emissive: COLORS.orange,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.4,
        side: DoubleSide,
        depthWrite: false,
      }),
    );
    this.proxySurf.setHeight(this.proxyHeight);
    this.proxySurf.mesh.position.y = 0.05;
    this.scene.add(this.proxySurf.mesh);

    this.climber = new Mesh(
      new SphereGeometry(0.28, 22, 22),
      new MeshStandardMaterial({ color: COLORS.ink, emissive: COLORS.orange, emissiveIntensity: 1.2 }),
    );
    this.scene.add(this.climber);

    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
    this.dropLine = new Line(
      g,
      new LineBasicMaterial({ color: COLORS.orange, transparent: true, opacity: 0.8 }),
    );
    this.scene.add(this.dropLine);

    this.lU = this.labels.add(new Vector3(U_PEAK, 5, 0), "is-value");
    this.lProxy = this.labels.add(new Vector3(PROXY_PEAK0, 4.6, 0), "is-prob");
  }

  protected relabel(): void {
    const zh = this.lang === "zh";
    this.lU.setText(zh ? "真实效用 U" : "True utility U", "U");
    this.lProxy.setText(zh ? "代理目标 Ũ" : "Proxy objective Ũ", "Ũ");
  }

  setParams(p: SceneParams): void {
    if (p.optimizeProxy !== undefined) this.optimize = p.optimizeProxy / 100;
    if (p.counterexample !== undefined) this.counterTarget = p.counterexample ? 1 : 0;
  }

  protected tick(dt: number): void {
    const moving = this.counterTarget !== this.counter;
    this.counter = MathUtils.damp(this.counter, this.counterTarget, 2.5, dt);
    if (moving) this.proxySurf.setHeight(this.proxyHeight);

    // climber walks up the proxy surface toward its peak
    const cx = MathUtils.lerp(0.2, this.proxyPeakX(), this.optimize);
    const cyProxy = this.proxyHeight(cx, 0) + 0.25;
    this.climber.position.set(cx, cyProxy, 0);

    // drop-line shows the TRUE value at the climber's location
    const cyTrue = this.uHeight(cx, 0);
    const pos = this.dropLine.geometry.attributes.position;
    pos.setXYZ(0, cx, cyProxy, 0);
    pos.setXYZ(1, cx, cyTrue, 0);
    pos.needsUpdate = true;

    // proxy label follows its moving peak
    this.lProxy.anchor.set(this.proxyPeakX(), 4.6, 0);
  }

  dispose(): void {
    this.uSurf.dispose();
    this.proxySurf.dispose();
    super.dispose();
  }
}
