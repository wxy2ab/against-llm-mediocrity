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
    },
  },
});
