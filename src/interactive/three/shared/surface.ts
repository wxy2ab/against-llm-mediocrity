import {
  type Material,
  Mesh,
  PlaneGeometry,
} from "three";

export type HeightFn = (x: number, z: number) => number;

/**
 * A parametric height-field surface over the X-Z plane (Y = up = value/prob).
 * Shared by the Sampling Theater, Support, Aggregation, Specification, Regimes
 * and Governance scenes — built once, fed different height functions.
 */
export class HeightSurface {
  readonly mesh: Mesh;
  private geo: PlaneGeometry;

  constructor(
    public readonly size: number,
    public readonly seg: number,
    material: Material,
  ) {
    this.geo = new PlaneGeometry(size, size, seg, seg);
    this.geo.rotateX(-Math.PI / 2); // XY plane → XZ plane, Y up
    this.mesh = new Mesh(this.geo, material);
  }

  /** Recompute every vertex height from fn; recompute normals for lighting. */
  setHeight(fn: HeightFn): void {
    const pos = this.geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, fn(pos.getX(i), pos.getZ(i)));
    }
    pos.needsUpdate = true;
    this.geo.computeVertexNormals();
  }

  dispose(): void {
    this.geo.dispose();
    (this.mesh.material as Material).dispose();
  }
}

/** Isotropic gaussian bump. */
export const gauss = (
  x: number,
  z: number,
  cx: number,
  cz: number,
  spread: number,
): number => Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / spread);

/** Anisotropic (narrower) gaussian — for sharp peaks. */
export const gaussAniso = (
  x: number,
  z: number,
  cx: number,
  cz: number,
  sx: number,
  sz: number,
): number => Math.exp(-((x - cx) ** 2 / sx + (z - cz) ** 2 / sz));
