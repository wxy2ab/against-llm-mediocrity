import { marked } from "marked";
import YAML from "yaml";

export type Lang = "en" | "zh";

export type PageKey = string;

export type AlignmentLabels = {
  probability: string;
  value: string;
  extraordinary: string;
  mediocre: string;
  local: string;
  aligned: string;
  misaligned: string;
  partial: string;
};

export type Page = {
  key: PageKey;
  lang: Lang;
  path: string;
  title: string;
  navTitle: string;
  kicker: string;
  summary: string;
  order: number;
  heroPoints?: string[];
  heroVisual?: "alignment";
  alignmentLabels?: AlignmentLabels;
  html: string;
};

type PageFrontmatter = Omit<Page, "html">;

type Site = {
  languageName: string;
  switchLabel: string;
  repoLabel: string;
  repoUrl: string;
  footer: string;
  pages: Record<string, Page>;
};

const siteMeta: Record<Lang, Omit<Site, "pages">> = {
  en: {
    languageName: "English",
    switchLabel: "中文",
    repoLabel: "GitHub",
    repoUrl: "https://github.com/wxy2ab/against-llm-mediocrity",
    footer:
      "Against LLM Mediocrity is an English-first bilingual project about Knowledge Governance, autoregressive mediocrity, and human-AI collaboration.",
  },
  zh: {
    languageName: "中文",
    switchLabel: "English",
    repoLabel: "GitHub",
    repoUrl: "https://github.com/wxy2ab/against-llm-mediocrity",
    footer:
      "Against LLM Mediocrity 是一个英文优先、中文镜像的双语项目，关注 Knowledge Governance、自回归平庸与人机治理式协作。",
  },
};

const rawPages = import.meta.glob("../content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseMarkdownFile(raw: string): { frontmatter: PageFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Markdown page is missing frontmatter.");
  }

  const frontmatter = YAML.parse(match[1]) as PageFrontmatter;
  return { frontmatter, body: match[2] };
}

function renderCards(block: string): string {
  const chunks = block
    .trim()
    .replace(/^###\s+/, "")
    .split(/\n###\s+/)
    .filter(Boolean);

  const cards = chunks.map((chunk) => {
    const [rawTitle = "", ...rawBodyLines] = chunk.split("\n");
    const title = marked.parseInline(rawTitle.trim()) as string;
    const lines = rawBodyLines.join("\n").trim().split("\n");
    const tagMatch = lines[0]?.match(/^Tag:\s*(.+)$/i);
    const tag = tagMatch ? tagMatch[1].trim() : "";
    const body = tagMatch ? lines.slice(1).join("\n").trim() : lines.join("\n").trim();
    const bodyHtml = marked.parse(body, { async: false }) as string;

    return `<article class="info-card">
${tag ? `<span>${tag}</span>` : ""}
<h3>${title}</h3>
${bodyHtml}
</article>`;
  });

  return `<div class="card-grid">
${cards.join("\n")}
</div>`;
}

function renderMarkdown(markdown: string): string {
  const withCards = markdown.replace(/:::cards\n([\s\S]*?)\n:::/g, (_match, block: string) =>
    renderCards(block),
  );
  return marked.parse(withCards, { async: false }) as string;
}

function loadPages(): Record<Lang, Site> {
  const loadedPages = Object.values(rawPages).map((raw) => {
    const { frontmatter, body } = parseMarkdownFile(raw);
    return {
      ...frontmatter,
      html: renderMarkdown(body),
    };
  });

  const pagesByLang = { en: {}, zh: {} } as Record<Lang, Record<string, Page>>;
  for (const page of loadedPages) {
    pagesByLang[page.lang][page.key] = page;
  }

  const sites = {
    en: {
      ...siteMeta.en,
      pages: pagesByLang.en,
    },
    zh: {
      ...siteMeta.zh,
      pages: pagesByLang.zh,
    },
  };

  for (const lang of ["en", "zh"] as const) {
    if (!sites[lang].pages.home) {
      throw new Error(`Missing Markdown home page for ${lang}.`);
    }
  }

  return sites;
}

export const content = loadPages();

export const navOrder = Object.values(content.en.pages)
  .sort((a, b) => a.order - b.order)
  .map((page) => page.key);

export function normalizePath(pathname: string): { lang: Lang; key: PageKey } {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const lang: Lang = clean === "/zh" || clean.startsWith("/zh/") ? "zh" : "en";
  const segment = clean
    .replace(/^\/zh/, "")
    .replace(/^\//, "")
    .split("/")[0];

  const found = Object.values(content[lang].pages).find((page) => {
    const path = page.path.replace(/^\/zh/, "").replace(/^\//, "");
    return segment === path || (page.key === "home" && segment === "");
  })?.key;

  return { lang, key: found ?? "home" };
}

export function pagePath(lang: Lang, key: PageKey): string {
  return content[lang].pages[key]?.path ?? content[lang].pages.home.path;
}

export function alternatePath(lang: Lang, key: PageKey): string {
  return pagePath(lang === "en" ? "zh" : "en", key);
}
