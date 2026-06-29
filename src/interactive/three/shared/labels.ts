import type { Camera, Vector3 } from "three";

/**
 * DOM-overlay label layer. Each label is a real <span> projected from a world
 * anchor through the camera each frame. Crisp at any DPR, bilingual via
 * textContent, and accessible — vs. blurry, hard-to-localize in-canvas sprites.
 */
export interface LabelHandle {
  el: HTMLElement;
  anchor: Vector3;
  setText(primary: string, sym?: string): void;
}

export class LabelLayer {
  private items: LabelHandle[] = [];

  constructor(private overlay: HTMLElement) {}

  add(anchor: Vector3, cls = ""): LabelHandle {
    const el = document.createElement("div");
    el.className = `scene-label ${cls}`.trim();
    const main = document.createElement("span");
    main.className = "main";
    const sym = document.createElement("span");
    sym.className = "sym";
    el.append(main, sym);
    this.overlay.appendChild(el);
    const handle: LabelHandle = {
      el,
      anchor,
      setText(primary, symbol) {
        main.textContent = primary;
        if (symbol === undefined) {
          sym.style.display = "none";
        } else {
          sym.style.display = "block";
          sym.textContent = symbol;
        }
      },
    };
    this.items.push(handle);
    return handle;
  }

  project(camera: Camera, width: number, height: number): void {
    for (const it of this.items) {
      const v = it.anchor.clone().project(camera);
      const behind = v.z > 1;
      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-v.y * 0.5 + 0.5) * height;
      it.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      it.el.style.opacity = behind ? "0" : "1";
    }
  }

  clear(): void {
    this.overlay.innerHTML = "";
    this.items = [];
  }

  dispose(): void {
    this.clear();
  }
}
