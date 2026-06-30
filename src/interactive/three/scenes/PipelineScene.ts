import {
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { content } from "../../content";
import type { SceneParams } from "../../types";
import { BaseScene } from "../Scene";
import { COLORS } from "../shared/palette";
import type { LabelHandle } from "../shared/labels";

const N = 7; // nodes
const X0 = -7;
const X1 = 7;
const STEP = (X1 - X0) / (N - 1);

/**
 * Scene ① — value as a fragile payload travelling a conduit through seven
 * stations. Ungoverned, it sheds an orange fragment and dims at each of the six
 * mismatch gates; a parallel ghost stays full-bright. Governed → gates turn
 * mint and the payload arrives nearly whole.
 */
export class PipelineScene extends BaseScene {
  private payload!: Mesh; // actual value (shrinks)
  private ghost!: Mesh; // ideal value (stays full)
  private gates: Mesh[] = [];
  private leaks: Mesh[] = [];
  private nodeLabels: LabelHandle[] = [];
  private lIdeal!: LabelHandle;
  private lActual!: LabelHandle;
  private t = 0;
  private governed = false;

  protected orbitRadius = 15.5;
  protected orbitHeight = 5.5;
  protected orbitSpeed = 0.22;
  protected orbitSway = 0.2;
  protected baseAngle = Math.PI * 0.5;
  protected target = new Vector3(0, 0.7, 0);

  constructor(overlay: HTMLElement, ctx: ConstructorParameters<typeof BaseScene>[1]) {
    super(overlay, ctx);
    this.init();
  }

  protected build(): void {
    // conduit
    const conduit = new Mesh(
      new CylinderGeometry(0.18, 0.18, X1 - X0, 12, 1, true),
      new MeshStandardMaterial({
        color: COLORS.line,
        emissive: COLORS.line,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.5,
      }),
    );
    conduit.rotation.z = Math.PI / 2;
    this.scene.add(conduit);

    // nodes
    for (let i = 0; i < N; i++) {
      const node = new Mesh(
        new SphereGeometry(0.46, 24, 24),
        new MeshStandardMaterial({
          color: COLORS.mint,
          emissive: COLORS.mint,
          emissiveIntensity: 0.8,
        }),
      );
      node.position.set(X0 + i * STEP, 0, 0);
      this.scene.add(node);
    }

    // gates (between nodes) + leak fragments
    for (let i = 0; i < N - 1; i++) {
      const x = X0 + i * STEP + STEP / 2;
      const gate = new Mesh(
        new TorusGeometry(0.55, 0.06, 12, 32),
        new MeshStandardMaterial({
          color: COLORS.orange,
          emissive: COLORS.orange,
          emissiveIntensity: 0.7,
        }),
      );
      gate.position.set(x, 0, 0);
      gate.rotation.y = Math.PI / 2;
      this.scene.add(gate);
      this.gates.push(gate);

      const leak = new Mesh(
        new SphereGeometry(0.16, 12, 12),
        new MeshStandardMaterial({
          color: COLORS.orange,
          emissive: COLORS.orange,
          emissiveIntensity: 1,
          transparent: true,
          opacity: 0,
        }),
      );
      leak.position.set(x, 0, 0);
      leak.scale.setScalar(0.01);
      this.scene.add(leak);
      this.leaks.push(leak);
    }

    // two value spheres travel together above the pipeline:
    // ghost = ideal value (full, bright), payload = actual value (shrinks/dims)
    this.ghost = new Mesh(
      new SphereGeometry(0.42, 28, 28),
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 1.2 }),
    );
    this.scene.add(this.ghost);

    this.payload = new Mesh(
      new SphereGeometry(0.42, 28, 28),
      new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 1.2 }),
    );
    this.scene.add(this.payload);

    // node labels
    for (let i = 0; i < N; i++) {
      this.nodeLabels.push(this.labels.add(new Vector3(X0 + i * STEP, -1.1, 0)));
    }
    this.lIdeal = this.labels.add(new Vector3(0, 0, 0), "is-value");
    this.lActual = this.labels.add(new Vector3(0, 0, 0), "is-prob");
  }

  protected relabel(): void {
    const nodes = content(this.lang).pipeline.nodes;
    this.nodeLabels.forEach((lab, i) => {
      const n = nodes[i];
      if (n) lab.setText(n.name, n.sym);
    });
    const zh = this.lang === "zh";
    this.lIdeal.setText(zh ? "理想价值" : "Ideal value", "U*");
    this.lActual.setText(zh ? "实际价值" : "Actual value", "U");
  }

  setParams(p: SceneParams): void {
    if (p.governed !== undefined) {
      this.governed = p.governed;
      const col = this.governed ? COLORS.mint : COLORS.orange;
      for (const g of this.gates) {
        const m = g.material as MeshStandardMaterial;
        m.color.copy(col);
        m.emissive.copy(col);
      }
    }
    if (p.releaseNonce !== undefined) this.t = 0;
  }

  protected tick(dt: number): void {
    this.t = (this.t + dt * 0.11) % 1.08; // small pause past the end
    const tt = Math.min(this.t, 1);
    const x = X0 + tt * (X1 - X0);
    const yBall = 1.7;
    this.ghost.position.set(x, yBall, 0.95); // ideal
    this.payload.position.set(x, yBall, -0.95); // actual
    this.lIdeal.anchor.set(x, yBall + 0.75, 0.95);
    this.lActual.anchor.set(x, yBall + 0.75, -0.95);

    // how many mismatch gates the payload has passed
    let passed = 0;
    for (let i = 0; i < this.gates.length; i++) {
      const gx = X0 + i * STEP + STEP / 2;
      if (x >= gx) passed++;
      // leak pulse near the gate (ungoverned only)
      const leak = this.leaks[i];
      const m = leak.material as MeshStandardMaterial;
      const near = Math.abs(x - gx);
      if (!this.governed && near < 0.6) {
        const k = 1 - near / 0.6;
        m.opacity = k * 0.9;
        leak.scale.setScalar(0.2 + k * 0.6);
        // fragments shed from the actual-value ball and fall away
        leak.position.set(gx, yBall - k * 2.2, -0.95);
      } else {
        m.opacity *= 0.9;
        leak.scale.multiplyScalar(0.96);
      }
    }

    // actual value shrinks + dims as it passes gates; ideal stays full
    const loss = this.governed ? 0.06 : 0.82;
    const frac = passed / this.gates.length;
    const scale = Math.max(0.16, 1 - loss * frac);
    const pm = this.payload.material as MeshStandardMaterial;
    pm.emissiveIntensity = 1.2 * Math.max(0.25, scale);
    this.payload.scale.setScalar(scale);
    this.ghost.scale.setScalar(1);

    // gentle spin on gates
    for (const g of this.gates) g.rotation.z += dt * 0.4;
  }
}
