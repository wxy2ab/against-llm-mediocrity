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
  private payload!: Mesh;
  private ghost!: Mesh;
  private gates: Mesh[] = [];
  private leaks: Mesh[] = [];
  private nodeLabels: LabelHandle[] = [];
  private t = 0;
  private governed = false;

  protected orbitRadius = 15;
  protected orbitHeight = 4.5;
  protected orbitSpeed = 0.22;
  protected orbitSway = 0.22;
  protected baseAngle = Math.PI * 0.5;
  protected target = new Vector3(0, 0, 0);

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

    // payload (mint) + ideal ghost on a parallel rail
    this.payload = new Mesh(
      new SphereGeometry(0.4, 28, 28),
      new MeshStandardMaterial({
        color: COLORS.mint,
        emissive: COLORS.mint,
        emissiveIntensity: 1.1,
      }),
    );
    this.scene.add(this.payload);

    this.ghost = new Mesh(
      new SphereGeometry(0.34, 24, 24),
      new MeshStandardMaterial({
        color: COLORS.mint,
        emissive: COLORS.mint,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.4,
      }),
    );
    this.scene.add(this.ghost);

    // node labels
    for (let i = 0; i < N; i++) {
      this.nodeLabels.push(this.labels.add(new Vector3(X0 + i * STEP, 1.15, 0)));
    }
  }

  protected relabel(): void {
    const nodes = content(this.lang).pipeline.nodes;
    this.nodeLabels.forEach((lab, i) => {
      const n = nodes[i];
      if (n) lab.setText(n.name, n.sym);
    });
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
    this.payload.position.set(x, 0, 0);
    this.ghost.position.set(x, 0, -1.4);

    // how many mismatch gates the payload has passed
    let passed = 0;
    for (let i = 0; i < this.gates.length; i++) {
      const gx = X0 + i * STEP + STEP / 2;
      if (x >= gx) passed++;
      // leak pulse near the gate (ungoverned only)
      const leak = this.leaks[i];
      const m = leak.material as MeshStandardMaterial;
      const near = Math.abs(x - gx);
      if (!this.governed && near < 0.5) {
        const k = 1 - near / 0.5;
        m.opacity = k * 0.9;
        leak.scale.setScalar(0.2 + k * 0.5);
        leak.position.set(gx, -k * 1.4, 0);
      } else {
        m.opacity *= 0.9;
        leak.scale.multiplyScalar(0.96);
      }
    }

    const loss = this.governed ? 0.08 : 0.62;
    const frac = passed / this.gates.length;
    const pm = this.payload.material as MeshStandardMaterial;
    pm.emissiveIntensity = 1.1 * (1 - loss * frac);
    this.payload.scale.setScalar(1 - loss * frac * 0.5);

    // gentle spin on gates
    for (const g of this.gates) g.rotation.z += dt * 0.4;
  }
}
