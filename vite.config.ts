import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/against-llm-mediocrity/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        interactive: resolve(__dirname, "interactive.html"),
      },
      output: {
        // Split three.js into its own long-cache vendor chunk. Only the
        // interactive entry dynamically imports three, so this chunk is never
        // referenced by the main-site bundle (main.ts links the lab via <a href>,
        // never an import). Verify with: grep -L three dist/assets/main-*.js
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
        },
      },
    },
  },
});
