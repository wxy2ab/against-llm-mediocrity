import {
  CircleGeometry,
  ConeGeometry,
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RingGeometry,
  SpotLight,
  TorusGeometry,
  Vector3,
} from "three";
import type { AppContext, SceneParams } from "../../../types";
import { BaseScene } from "../../Scene";
import { COLORS } from "../../shared/palette";
import type { LabelHandle } from "../../shared/labels";

const TX = 2.4; // true applicability region centre (x)
const X_MIN = -2.6;

/**
 * ⑤ Fitting-Boundary. A capability spotlight marks where the capability
 * actually fires (M_X); a dashed ring marks where it should fire (T_X). The
 * drama is the offset. The routing handle drags the spotlight onto T_X;
 * "Invoke" proves the capability works when aimed explicitly.
 */
export class FittingScene extends BaseScene {
  private cone!: Mesh;
  private litDisc!: Mesh;
  private spot!: SpotLight;
  private mxRing!: Mesh;
  private routing = 0.3; // 0..1
  private invokePulse = 0;
  private lastInvoke = 0;
  private lMx!: LabelHandle;
  private lTx!: LabelHandle;

  protected orbitRadius = 12;
  protected orbitHeight = 9;
  protected orbitSpeed = 0.16;
  protected orbitSway = 0.5;
  protected target = new Vector3(0, 0, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  protected build(): void {
    // floor
    const floor = new Mesh(
      new PlaneGeometry(13, 9),
      new MeshStandardMaterial({ color: COLORS.surface, roughness: 0.9, side: DoubleSide }),
    );
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);

    // low-value (red) region left, high-value (mint) region right under T_X
    const red = new Mesh(
      new CircleGeometry(1.8, 36),
      new MeshStandardMaterial({ color: COLORS.mediocre, emissive: COLORS.mediocre, emissiveIntensity: 0.3, transparent: true, opacity: 0.4, side: DoubleSide }),
    );
    red.rotation.x = -Math.PI / 2;
    red.position.set(X_MIN, 0.01, 0);
    this.scene.add(red);

    const good = new Mesh(
      new CircleGeometry(1.8, 36),
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 0.3, transparent: true, opacity: 0.35, side: DoubleSide }),
    );
    good.rotation.x = -Math.PI / 2;
    good.position.set(TX, 0.01, 0);
    this.scene.add(good);

    // T_X dashed ring (true applicability)
    const tx = new Mesh(
      new TorusGeometry(1.85, 0.05, 8, 48),
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 0.9 }),
    );
    tx.rotation.x = -Math.PI / 2;
    tx.position.set(TX, 0.05, 0);
    this.scene.add(tx);

    // M_X spotlight cone + lit disc (actual activation)
    this.cone = new Mesh(
      new ConeGeometry(1.6, 6, 32, 1, true),
      new MeshBasicMaterial({ color: COLORS.mint, transparent: true, opacity: 0.12, side: DoubleSide, depthWrite: false }),
    );
    this.cone.position.set(0, 3, 0);
    this.scene.add(this.cone);

    this.litDisc = new Mesh(
      new RingGeometry(0, 1.5, 36),
      new MeshBasicMaterial({ color: COLORS.mint, transparent: true, opacity: 0.4, side: DoubleSide, depthWrite: false }),
    );
    this.litDisc.rotation.x = -Math.PI / 2;
    this.litDisc.position.y = 0.06;
    this.scene.add(this.litDisc);

    this.mxRing = new Mesh(
      new TorusGeometry(1.5, 0.04, 8, 40),
      new MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 0.9 }),
    );
    this.mxRing.rotation.x = -Math.PI / 2;
    this.mxRing.position.y = 0.07;
    this.scene.add(this.mxRing);

    this.spot = new SpotLight(COLORS.mint, 30, 14, Math.PI / 6, 0.4, 1.2);
    this.spot.position.set(0, 6, 0);
    this.scene.add(this.spot, this.spot.target);

    this.lMx = this.labels.add(new Vector3(0, 4.4, 0), "is-prob");
    this.lTx = this.labels.add(new Vector3(TX, 1.4, 0), "is-value");
  }

  protected relabel(): void {
    const zh = this.lang === "zh";
    this.lMx.setText(zh ? "实际激活域 M_X" : "Activated M_X", "M_X");
    this.lTx.setText(zh ? "真实适用域 T_X" : "Applicable T_X", "T_X");
  }

  setParams(p: SceneParams): void {
    if (p.routing !== undefined) this.routing = p.routing / 100;
    if (p.invokeNonce !== undefined && p.invokeNonce !== this.lastInvoke) {
      this.lastInvoke = p.invokeNonce;
      this.invokePulse = 1;
    }
  }

  protected tick(dt: number, elapsed: number): void {
    const x = MathUtils.lerp(X_MIN, TX, this.routing);
    this.cone.position.x = x;
    this.litDisc.position.x = x;
    this.mxRing.position.x = x;
    this.spot.position.x = x;
    this.spot.target.position.set(x, 0, 0);

    this.invokePulse = Math.max(0, this.invokePulse - dt * 1.5);
    const aligned = 1 - Math.min(1, Math.abs(x - TX) / Math.abs(X_MIN - TX));
    const glow = 0.3 + 0.4 * aligned + this.invokePulse;
    (this.litDisc.material as MeshBasicMaterial).opacity = glow * 0.6;
    this.spot.intensity = 18 + 40 * aligned + this.invokePulse * 30;
    this.cone.rotation.y = elapsed * 0.2;
  }
}
