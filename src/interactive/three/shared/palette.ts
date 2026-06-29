import { Color } from "three";

// Mirror of the CSS design tokens, for use in WebGL materials.
export const COLORS = {
  mint: new Color("#50d3b8"), // value U
  mintHot: new Color("#eafff8"),
  orange: new Color("#ff745c"), // probability p_θ / proxy
  amber: new Color("#ffb45c"),
  ink: new Color("#eef3f2"),
  muted: new Color("#5b6b66"),
  line: new Color("#2a3a35"),
  surface: new Color("#101d19"),
  bg: new Color("#09110f"),
  // regime triad
  mediocre: new Color("#d45d4c"),
  local: new Color("#f2cc5d"),
  extraordinary: new Color("#6fb3a8"),
} as const;
