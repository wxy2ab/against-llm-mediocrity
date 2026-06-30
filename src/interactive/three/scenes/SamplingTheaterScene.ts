import {
  BoxGeometry,
  CircleGeometry,
  DoubleSide,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { content } from "../../content";
import type { AppContext, SamplingCause, SceneParams } from "../../types";
import { BaseScene } from "../Scene";
import { COLORS } from "../shared/palette";
import { gauss, gaussAniso, HeightSurface } from "../shared/surface";
import type { LabelHandle } from "../shared/labels";

const PEAK = { x: 3.6, z: 0 }; // true value peak Y*
const PLATEAU = { x: -2.4, z: 0 }; // comfortable low-value plateau
const PROXY = { x: 1.0, z: 3.4 }; // false proxy peak Ũ (specification)
const SIZE = 13;
const MAX_POINTS = 500;

interface Particle {
  x: number;
  z: number;
  y: number;
  vy: number;
  targetY: number;
  active: boolean;
}

/**
 * Scene ② — the Sampling Theater. Makes five things spatially obvious:
 * expected (mint peak Y*), actual (orange p_θ mass on the low plateau),
 * repeated (points raining into the same wrong basin), trainable (overlap that
 * grows as training pours probability onto reachable value), and irreducible
 * (a glowing wall at the foot of Y* that training can never cross).
 */
export class SamplingTheaterScene extends BaseScene {
  private value!: HeightSurface;
  private prob!: HeightSurface;
  private points!: InstancedMesh;
  private wall!: Mesh;
  private overlap!: Mesh;
  private peakMarker!: Mesh;
  private proxyMarker!: Mesh;
  private particles: Particle[] = [];
  private dummy = new Matrix4();

  private train = 0; // 0..1
  private cause: SamplingCause = "support";
  private lastSample = 0;
  private lastBurst = 0;
  private lastReset = 0;

  private lExpected!: LabelHandle;
  private lActual!: LabelHandle;
  private lRepeated!: LabelHandle;
  private lWall!: LabelHandle;

  protected orbitRadius = 15;
  protected orbitHeight = 11;
  protected orbitSpeed = 0.18;
  protected orbitSway = 0.4;
  protected baseAngle = Math.PI * 0.5;
  protected target = new Vector3(0, 1.2, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  private valueH = (x: number, z: number): number =>
    1.15 * gauss(x, z, PLATEAU.x, PLATEAU.z, 5) + 4.8 * gaussAniso(x, z, PEAK.x, PEAK.z, 0.85, 0.85);

  private probH = (x: number, z: number): number => {
    const t = this.train;
    const spread = 3.0 - 1.4 * t;
    // several "easy" hills of probability mass (multi-modal) — all in the
    // low-value region, none reaching the true-value peak Y*
    let h =
      2.4 * gauss(x, z, PLATEAU.x, PLATEAU.z, spread) * (1 + 0.4 * t) +
      1.5 * gauss(x, z, -4.6, -1.8, 2.2) +
      1.2 * gauss(x, z, -1.0, 2.6, 2.0) +
      1.0 * gauss(x, z, -3.4, 2.2, 1.6) +
      0.9 * gauss(x, z, 0.2, -2.8, 1.8);
    if (this.cause === "specification") {
      h += (0.5 + 3.6 * t) * gaussAniso(x, z, PROXY.x, PROXY.z, 1.1, 1.1);
    }
    return h;
  };

  protected build(): void {
    // value terrain (mint)
    this.value = new HeightSurface(
      SIZE,
      48,
      new MeshStandardMaterial({
        color: COLORS.mint,
        emissive: COLORS.mint,
        emissiveIntensity: 0.22,
        roughness: 0.5,
        metalness: 0.1,
        transparent: true,
        opacity: 0.94,
        side: DoubleSide,
        flatShading: true,
      }),
    );
    this.value.setHeight(this.valueH);
    this.scene.add(this.value.mesh);

    // probability surface (orange, translucent, over the value terrain)
    this.prob = new HeightSurface(
      SIZE,
      48,
      new MeshStandardMaterial({
        color: COLORS.orange,
        emissive: COLORS.orange,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.4,
        side: DoubleSide,
        depthWrite: false,
      }),
    );
    this.prob.setHeight(this.probH);
    this.prob.mesh.position.y = 0.05;
    this.scene.add(this.prob.mesh);

    // sample points
    this.points = new InstancedMesh(
      new SphereGeometry(0.11, 8, 8),
      new MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 0.9 }),
      MAX_POINTS,
    );
    this.points.count = MAX_POINTS;
    this.hideAllPoints();
    this.scene.add(this.points);

    // irreducible wall at the foot of Y*
    this.wall = new Mesh(
      new BoxGeometry(0.12, 5.2, SIZE),
      new MeshStandardMaterial({
        color: COLORS.orange,
        emissive: COLORS.orange,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.32,
        side: DoubleSide,
      }),
    );
    this.wall.position.set(1.5, 2.4, 0);
    this.scene.add(this.wall);

    // trainable-overlap glow patch on the plateau
    this.overlap = new Mesh(
      new CircleGeometry(2.2, 32),
      new MeshStandardMaterial({
        color: COLORS.mintHot,
        emissive: COLORS.mintHot,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0,
        side: DoubleSide,
      }),
    );
    this.overlap.rotation.x = -Math.PI / 2;
    this.overlap.position.set(PLATEAU.x, this.valueH(PLATEAU.x, PLATEAU.z) + 0.08, PLATEAU.z);
    this.scene.add(this.overlap);

    // peak markers
    this.peakMarker = new Mesh(
      new SphereGeometry(0.26, 20, 20),
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 1.3 }),
    );
    this.peakMarker.position.set(PEAK.x, this.valueH(PEAK.x, PEAK.z) + 0.3, PEAK.z);
    this.scene.add(this.peakMarker);

    this.proxyMarker = new Mesh(
      new SphereGeometry(0.22, 18, 18),
      new MeshStandardMaterial({
        color: COLORS.orange,
        emissive: COLORS.orange,
        emissiveIntensity: 1.1,
        transparent: true,
        opacity: 0,
      }),
    );
    this.proxyMarker.position.set(PROXY.x, 1.6, PROXY.z);
    this.scene.add(this.proxyMarker);

    // labels
    this.lExpected = this.labels.add(new Vector3(PEAK.x, this.valueH(PEAK.x, PEAK.z) + 0.9, PEAK.z), "is-value");
    this.lActual = this.labels.add(new Vector3(PLATEAU.x, 3.1, PLATEAU.z), "is-prob");
    this.lRepeated = this.labels.add(new Vector3(PLATEAU.x, 0.4, PLATEAU.z + 2.4), "is-prob");
    this.lWall = this.labels.add(new Vector3(1.5, 5.2, 0), "is-wall");
  }

  protected relabel(): void {
    const s = content(this.lang).sampling;
    this.lExpected.setText(s.expected, "Y*");
    this.lActual.setText(s.actual, "p_θ");
    this.lRepeated.setText(s.repeated);
    this.lWall.setText(s.irreducible);
  }

  setParams(p: SceneParams): void {
    let dirty = false;
    if (p.train !== undefined) {
      this.train = p.train / 100;
      dirty = true;
    }
    if (p.cause !== undefined && p.cause !== this.cause) {
      this.cause = p.cause;
      dirty = true;
      (this.proxyMarker.material as MeshStandardMaterial).opacity =
        this.cause === "specification" ? 1 : 0;
    }
    if (dirty) this.prob.setHeight(this.probH);

    if (p.sampleNonce !== undefined && p.sampleNonce !== this.lastSample) {
      this.lastSample = p.sampleNonce;
      this.spawn(8);
    }
    if (p.burstNonce !== undefined && p.burstNonce !== this.lastBurst) {
      this.lastBurst = p.burstNonce;
      this.spawn(120);
    }
    if (p.resetNonce !== undefined && p.resetNonce !== this.lastReset) {
      this.lastReset = p.resetNonce;
      this.train = 0;
      this.particles = [];
      this.hideAllPoints();
      this.prob.setHeight(this.probH);
    }
  }

  private basin(): { x: number; z: number } {
    return this.cause === "specification" ? PROXY : PLATEAU;
  }

  private spawn(n: number): void {
    const c = this.basin();
    for (let i = 0; i < n && this.particles.length < MAX_POINTS; i++) {
      const ang = (i / n) * Math.PI * 2 + this.particles.length;
      const r = 0.4 + 1.8 * Math.abs(Math.sin(i * 1.7));
      const x = c.x + Math.cos(ang) * r * 0.7;
      const z = c.z + Math.sin(ang) * r * 0.7;
      this.particles.push({
        x,
        z,
        y: 8 + Math.random() * 2,
        vy: 0,
        targetY: this.valueH(x, z) + 0.12,
        active: true,
      });
    }
  }

  private hideAllPoints(): void {
    this.dummy.makeScale(0, 0, 0);
    for (let i = 0; i < MAX_POINTS; i++) this.points.setMatrixAt(i, this.dummy);
    this.points.instanceMatrix.needsUpdate = true;
  }

  protected tick(dt: number, elapsed: number): void {
    // falling particles
    for (let i = 0; i < MAX_POINTS; i++) {
      const p = this.particles[i];
      if (!p) {
        this.dummy.makeScale(0, 0, 0);
      } else {
        if (p.y > p.targetY) {
          p.vy -= 14 * dt;
          p.y += p.vy * dt;
          if (p.y <= p.targetY) {
            p.y = p.targetY;
            p.vy = 0;
          }
        }
        this.dummy.makeTranslation(p.x, p.y, p.z);
      }
      this.points.setMatrixAt(i, this.dummy);
    }
    this.points.instanceMatrix.needsUpdate = true;

    // trainable overlap grows with training; never crosses the wall to Y*
    const om = this.overlap.material as MeshStandardMaterial;
    om.opacity = 0.55 * this.train;
    this.overlap.scale.setScalar(0.6 + 0.7 * this.train);

    // wall shimmer (a hard limit, not a temporary obstacle)
    const wm = this.wall.material as MeshStandardMaterial;
    wm.opacity = 0.28 + 0.12 * (0.5 + 0.5 * Math.sin(elapsed * 3));

    // observation: the true peak's coordinate is undefined → flicker it
    const pm = this.peakMarker.material as MeshStandardMaterial;
    if (this.cause === "observation") {
      pm.emissiveIntensity = 0.4 + 1.2 * Math.abs(Math.sin(elapsed * 5));
      this.peakMarker.position.x = PEAK.x + Math.sin(elapsed * 7) * 0.5;
    } else {
      pm.emissiveIntensity = 1.3;
      this.peakMarker.position.x = PEAK.x;
    }
  }

  dispose(): void {
    this.value.dispose();
    this.prob.dispose();
    this.points.geometry.dispose();
    (this.points.material as MeshStandardMaterial).dispose();
    super.dispose();
  }
}
