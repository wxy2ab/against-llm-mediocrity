import {
  BoxGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import type { AppContext, SceneParams } from "../../../types";
import { BaseScene } from "../../Scene";
import { COLORS } from "../../shared/palette";
import type { LabelHandle } from "../../shared/labels";

const GRID = 6;
const GAP = 1.15;

interface Tile {
  mesh: Mesh;
  gx: number;
  gz: number;
  offY: number;
  rotX: number;
  rotZ: number;
}

/**
 * ⑦ Aggregation (the home of autoregressive mediocrity). Individually perfect
 * mint tiles refuse to tile: their seams buckle into a broken surface, and a
 * long-range dependency thread snaps red. "Polish" each tile and the whole gets
 * worse; "Global constraint" snaps them to shared edges into one mint plane.
 */
export class AggregationScene extends BaseScene {
  private tiles: Tile[] = [];
  private depLine!: Line;
  private depA!: Vector3;
  private depB!: Vector3;
  private polish = 0;
  private constraint = 0; // animated
  private constraintTarget = 0;
  private lLocal!: LabelHandle;
  private lGlobal!: LabelHandle;

  protected orbitRadius = 12;
  protected orbitHeight = 9;
  protected orbitSpeed = 0.16;
  protected orbitSway = 0.5;
  protected target = new Vector3(0, 0.5, 0);

  constructor(overlay: HTMLElement, ctx: AppContext) {
    super(overlay, ctx);
    this.init();
  }

  protected build(): void {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const mesh = new Mesh(
          new BoxGeometry(GAP * 0.92, 0.16, GAP * 0.92),
          new MeshStandardMaterial({ color: COLORS.mint, emissive: COLORS.mint, emissiveIntensity: 0.3, flatShading: true }),
        );
        const gx = (i - (GRID - 1) / 2) * GAP;
        const gz = (j - (GRID - 1) / 2) * GAP;
        this.tiles.push({
          mesh,
          gx,
          gz,
          offY: (rnd() - 0.5) * 2.2,
          rotX: (rnd() - 0.5) * 0.7,
          rotZ: (rnd() - 0.5) * 0.7,
        });
        this.scene.add(mesh);
      }
    }

    // long-range dependency thread between two far tiles (setup ↔ payoff)
    this.depA = new Vector3();
    this.depB = new Vector3();
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
    this.depLine = new Line(g, new LineBasicMaterial({ color: COLORS.mediocre, linewidth: 2 }));
    this.scene.add(this.depLine);

    this.lLocal = this.labels.add(new Vector3(0, 3.4, 0), "is-value");
    this.lGlobal = this.labels.add(new Vector3(0, -1.6, 0), "is-prob");
  }

  protected relabel(): void {
    const zh = this.lang === "zh";
    this.lLocal.setText(zh ? "局部价值满分" : "Local value: perfect");
    this.lGlobal.setText(zh ? "全局价值：低" : "Global value: low");
  }

  setParams(p: SceneParams): void {
    if (p.polish !== undefined) this.polish = p.polish / 100;
    if (p.constraint !== undefined) this.constraintTarget = p.constraint ? 1 : 0;
  }

  protected tick(dt: number): void {
    this.constraint = MathUtils.damp(this.constraint, this.constraintTarget, 3, dt);
    // polishing each tile amplifies its local offset (global worse); constraint flattens
    const buckle = (0.6 + this.polish) * (1 - this.constraint);
    for (const t of this.tiles) {
      t.mesh.position.set(t.gx, t.offY * buckle, t.gz);
      t.mesh.rotation.set(t.rotX * buckle, 0, t.rotZ * buckle);
      const m = t.mesh.material as MeshStandardMaterial;
      m.emissiveIntensity = 0.3 + this.polish * 0.6; // tiles get "shinier"
    }
    const a = this.tiles[1];
    const b = this.tiles[this.tiles.length - 2];
    this.depA.copy(a.mesh.position);
    this.depB.copy(b.mesh.position);
    const pos = this.depLine.geometry.attributes.position;
    pos.setXYZ(0, this.depA.x, this.depA.y, this.depA.z);
    pos.setXYZ(1, this.depB.x, this.depB.y, this.depB.z);
    pos.needsUpdate = true;
    const lm = this.depLine.material as LineBasicMaterial;
    lm.color.copy(COLORS.mediocre).lerp(COLORS.mint, this.constraint);

    const zh = this.lang === "zh";
    this.lGlobal.setText(
      this.constraint > 0.6
        ? zh
          ? "全局价值：高"
          : "Global value: high"
        : zh
          ? "全局价值：低"
          : "Global value: low",
    );
  }
}
