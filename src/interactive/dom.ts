// Tiny DOM helpers — carried over from the old interactive.ts house style.

export const q = <T extends Element>(sel: string, root: ParentNode = document): T =>
  root.querySelector<T>(sel)!;

export const qa = <T extends Element>(sel: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

/** Build a single element from an HTML string. */
export const el = (html: string): HTMLElement => {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild as HTMLElement;
};

/** Detect WebGL support without keeping a context around. */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = (): boolean =>
  window.matchMedia("(pointer: coarse)").matches;
