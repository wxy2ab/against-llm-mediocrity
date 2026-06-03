import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const routes = [
  "science",
  "framework",
  "engineering",
  "collaboration",
  "learning",
  "papers",
  "projects",
  "zh",
  "zh/science",
  "zh/framework",
  "zh/engineering",
  "zh/collaboration",
  "zh/learning",
  "zh/papers",
  "zh/projects",
];

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const index = await readFile(join(distDir, "index.html"), "utf8");

await Promise.all(
  routes.map(async (route) => {
    const target = join(distDir, route, "index.html");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, index);
  }),
);
