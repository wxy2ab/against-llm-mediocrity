import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

async function readMarkdownRoutes(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...(await readMarkdownRoutes(fullPath)));
      continue;
    }
    if (!entry.name.endsWith(".md")) continue;

    const raw = await readFile(fullPath, "utf8");
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
      throw new Error(`Missing frontmatter in ${fullPath}`);
    }

    const frontmatter = YAML.parse(match[1]);
    if (typeof frontmatter.path !== "string") {
      throw new Error(`Missing path in ${fullPath}`);
    }

    const route = frontmatter.path.replace(/^\/+|\/+$/g, "");
    if (route) {
      routes.push(route);
    }
  }

  return routes;
}

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const contentDir = fileURLToPath(new URL("../content/", import.meta.url));
const index = await readFile(join(distDir, "index.html"), "utf8");
const routes = await readMarkdownRoutes(contentDir);

await Promise.all(
  routes.map(async (route) => {
    const target = join(distDir, route, "index.html");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, index);
  }),
);
