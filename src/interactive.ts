import "./interactive/styles/index.css";
import { mountShell } from "./interactive/app";

// Paint the styled DOM shell synchronously — the page is interactive before any
// WebGL byte arrives. Then, only when the environment supports it, dynamically
// import the heavy three.js layer (its own chunk). Three gates guard the import:
// WebGL support, reduced-motion preference, and a .catch for chunk-load failure.
const shell = mountShell();

if (shell.ctx.supports3D && !shell.ctx.prefersReducedMotion) {
  import("./interactive/three/bootstrap")
    .then((m) => m.start(shell))
    .catch((err) => {
      console.warn("[lab] 3D init failed — using static fallback", err);
      shell.renderFallbacks();
    });
} else {
  shell.renderFallbacks();
}
