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
  showInNav: boolean;
  heroPoints?: string[];
  heroVisual?: "alignment";
  alignmentLabels?: AlignmentLabels;
  html: string;
};

type PageFrontmatter = Omit<Page, "html">;
type RawPageFrontmatter = Partial<PageFrontmatter> & Record<string, unknown>;

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
      "Against LLM Mediocrity studies how to turn local model capability into stable task value.",
  },
  zh: {
    languageName: "中文",
    switchLabel: "English",
    repoLabel: "GitHub",
    repoUrl: "https://github.com/wxy2ab/against-llm-mediocrity",
    footer:
      "Against LLM Mediocrity 研究如何把模型的局部能力转化为稳定的任务价值。",
  },
};

const rawPages = import.meta.glob("../content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function coerceText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => coerceText(item)).join(", ");
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 1) {
      const [key, nestedValue] = entries[0];
      return `${key}: ${coerceText(nestedValue)}`;
    }
  }

  return String(value ?? "");
}

function normalizePageFrontmatter(frontmatter: RawPageFrontmatter): PageFrontmatter {
  return {
    key: coerceText(frontmatter.key),
    lang: frontmatter.lang === "zh" ? "zh" : "en",
    path: coerceText(frontmatter.path),
    title: coerceText(frontmatter.title),
    navTitle: coerceText(frontmatter.navTitle),
    kicker: coerceText(frontmatter.kicker),
    summary: coerceText(frontmatter.summary),
    order: typeof frontmatter.order === "number" ? frontmatter.order : Number(frontmatter.order ?? 0),
    showInNav: frontmatter.showInNav !== false,
    heroPoints: Array.isArray(frontmatter.heroPoints)
      ? frontmatter.heroPoints.map((item) => coerceText(item))
      : undefined,
    heroVisual: frontmatter.heroVisual === "alignment" ? "alignment" : undefined,
    alignmentLabels: frontmatter.alignmentLabels
      ? {
          probability: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).probability),
          value: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).value),
          extraordinary: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).extraordinary),
          mediocre: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).mediocre),
          local: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).local),
          aligned: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).aligned),
          misaligned: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).misaligned),
          partial: coerceText((frontmatter.alignmentLabels as Record<string, unknown>).partial),
        }
      : undefined,
  };
}

function parseMarkdownFile(raw: string): { frontmatter: PageFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Markdown page is missing frontmatter.");
  }

  const frontmatter = normalizePageFrontmatter(YAML.parse(match[1]) as RawPageFrontmatter);
  return { frontmatter, body: match[2] };
}

// Keys the three home "regime" cards to a color block by their unique Tag copy.
// NOTE: coupled to the exact tag strings in content/{en,zh}/home.md — keep in sync.
function regimeClass(tag: string): string {
  if (/probability-value mismatch|概率与价值错位/i.test(tag)) return " regime-mediocre";
  if (/common real-world regime|最常见的现实区间/i.test(tag)) return " regime-local";
  if (/probability and value align|概率与价值同向/i.test(tag)) return " regime-extraordinary";
  return "";
}

function renderTakeaway(block: string): string {
  const body = marked.parse(block.trim(), { async: false }) as string;
  return `<aside class="takeaway">
${body}
</aside>`;
}

// Turns ```text fences that contain `->` arrows into styled flow-diagram callouts.
// A single fence may hold several pipelines separated by blank lines; each becomes
// its own row. Non-arrow text fences are left as plain <pre> blocks.
function styleFlowDiagrams(html: string): string {
  return html.replace(
    /<pre><code class="language-text">([\s\S]*?)<\/code><\/pre>/g,
    (whole, inner: string) => {
      if (!inner.includes("-&gt;")) return whole;
      const groups = inner
        .split(/\n[ \t]*\n/)
        .map((group) =>
          group
            .replace(/\r?\n/g, " ")
            .split(/\s*-&gt;\s*/)
            .map((step) => step.trim())
            .filter(Boolean),
        )
        .filter((steps) => steps.length >= 2);
      if (!groups.length) return whole;
      return groups
        .map(
          (steps) =>
            `<div class="flow-diagram" role="group">${steps
              .map((step) => `<span class="flow-step">${step}</span>`)
              .join('<span class="flow-arrow" aria-hidden="true">&rarr;</span>')}</div>`,
        )
        .join("");
    },
  );
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

    return `<article class="info-card${regimeClass(tag)}">
${tag ? `<span>${tag}</span>` : ""}
<h3>${title}</h3>
${bodyHtml}
</article>`;
  });

  return `<div class="card-grid cards-${cards.length}">
${cards.join("\n")}
</div>`;
}

function renderDocumentMap(block: string): string {
  const chunks = block
    .trim()
    .replace(/^###\s+/, "")
    .split(/\n###\s+/)
    .filter(Boolean);

  const nodes = chunks.map((chunk, index) => {
    const [rawTitle = "", ...rawBodyLines] = chunk.split("\n");
    const title = marked.parseInline(rawTitle.trim()) as string;
    const lines = rawBodyLines.join("\n").trim().split("\n");
    const tagMatch = lines[0]?.match(/^Tag:\s*(.+)$/i);
    const tag = tagMatch ? marked.parseInline(tagMatch[1].trim()) : "";
    const body = tagMatch ? lines.slice(1).join("\n").trim() : lines.join("\n").trim();
    const roleMatch = body.match(/\*\*(?:Role|作用)\*\*[：:]\s*([\s\S]*?)(?=\n\n\*\*(?:Corresponding documents|对应内容)\*\*[：:]|$)/i);
    const docsMatch = body.match(/\*\*(?:Corresponding documents|对应内容)\*\*[：:]\s*([\s\S]*)$/i);
    const role = marked.parseInline((roleMatch?.[1] ?? body).trim()) as string;
    const docs = docsMatch ? (marked.parseInline(docsMatch[1].trim()) as string) : "";
    const number = String(index + 1).padStart(2, "0");

    return `<li class="document-map-node">
<div class="document-map-marker" aria-hidden="true">${number}</div>
<div class="document-map-copy">
${tag ? `<p class="document-map-tag">${tag}</p>` : ""}
<h3>${title}</h3>
<p>${role}</p>
${docs ? `<p class="document-map-docs">${docs}</p>` : ""}
</div>
</li>`;
  });

  return `<figure class="document-map">
<ol class="document-map-nodes">
${nodes.join("\n")}
</ol>
</figure>`;
}

function renderPaperDocs(block: string): string {
  const chunks = block
    .trim()
    .replace(/^###\s+/, "")
    .split(/\n###\s+/)
    .filter(Boolean);

  const fieldClass = (label: string) => {
    if (/status|状态/i.test(label)) return " paper-doc-field--status";
    if (/terms|术语|对象/i.test(label)) return " paper-doc-field--terms";
    if (/empirical|实证|implementation|实现/i.test(label)) return " paper-doc-field--empirical";
    return "";
  };

  const stripMarkdown = (value: string) =>
    value
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

  const firstParagraph = (value: string) =>
    value
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .find((part) => part && !/^\[.+\]\(.+\)/.test(part)) ?? value.trim();

  const extractTerms = (text: string, zh: boolean) => {
    const terms = [
      "GKO",
      "GEO",
      "GExO",
      "GEsO",
      "Audit Finding",
      "Control Delta",
      "Regression Guard",
      "State Record",
      "Transition Contract",
      "Verifier Object",
      "Evidence Object",
      "Defect Ledger",
      "SGAR",
      "Oracle",
      "No-Go",
      "MSHQ",
      "support map",
      "search warrant",
      "coverage ledger",
      "support delta",
      "dependency graph",
      "interface contract",
      "invariant registry",
      "binding record",
      "claim-support map",
      "integration ledger",
      "composition audit",
      "scoped objective object",
    ];
    const found = terms.filter((term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text));
    if (found.length) return found.slice(0, 7);
    if (/观测|observation/i.test(text)) return zh ? ["观测-表征失配", "通道治理", "变量绑定"] : ["observation-representation mismatch", "channel governance", "variable binding"];
    if (/状态|state/i.test(text)) return zh ? ["状态假设", "证据绑定", "状态治理"] : ["state hypothesis", "evidence binding", "state governance"];
    if (/能力|routing|boundary/i.test(text)) return zh ? ["拟合边界", "能力路由", "边界护栏"] : ["fitting boundary", "capability routing", "boundary guard"];
    if (/目标|objective|specification/i.test(text)) return zh ? ["规格失配", "目标治理", "代理目标"] : ["specification mismatch", "objective governance", "proxy objective"];
    return zh ? ["文档角色", "治理机制", "验证假设"] : ["document role", "governance mechanism", "validation hypothesis"];
  };

  const inferStatus = (title: string, tag: string, zh: boolean) => {
    const source = `${title} ${tag}`;
    if (/旧版|legacy/i.test(source)) return "legacy";
    if (/对象模型|interface|implementation specification|实现规范/i.test(source)) return "implementation-backed";
    if (/价值保存|six primitive|六类原始|structural theory/i.test(source)) return "canonical";
    if (/price|pricing|价格|实证|empirical/i.test(source)) return "active draft / empirical pending";
    if (/实践|project|open-source|协作|collaboration/i.test(source)) return "implementation-backed";
    return zh ? "active draft" : "active draft";
  };

  const generatedFields = (title: string, tag: string, body: string, zh: boolean) => {
    const plainSummary = stripMarkdown(firstParagraph(body));
    const terms = extractTerms(`${title}\n${tag}\n${body}`, zh);
    const labels = zh
      ? {
          positioning: "一句话定位",
          contribution: "核心贡献",
          prerequisites: "前置阅读",
          terms: "引入对象 / 术语",
          status: "当前状态",
          empirical: "实证与实现",
          required: "必读",
          optional: "可选",
          cases: "已有案例",
          pending: "待验证",
        }
      : {
          positioning: "One-line positioning",
          contribution: "Core contribution",
          prerequisites: "Prerequisite reading",
          terms: "Introduced objects / terms",
          status: "Current status",
          empirical: "Empirical and implementation",
          required: "Required",
          optional: "Optional",
          cases: "Existing cases",
          pending: "Pending validation",
        };
    const required = zh
      ? "[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md), [六类原始失配总图](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)"
      : "[A Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md), [Six Primitive Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)";
    const optional = zh ? "同层或相邻层的机制、对象、运行时文稿。" : "Mechanism, object, or runtime drafts in the same or adjacent layer.";
    const contribution = zh
      ? `- 提出 / 整理：${stripMarkdown(tag) || title}。\n- 推进：${plainSummary}`
      : `- Introduces / organizes: ${stripMarkdown(tag) || title}.\n- Advances: ${plainSummary}`;

    return [
      [labels.positioning, plainSummary],
      [labels.contribution, contribution],
      [labels.prerequisites, `- ${labels.required}: ${required}\n- ${labels.optional}: ${optional}`],
      [labels.terms, terms.map((term) => `- ${term}`).join("\n")],
      [labels.status, `- ${inferStatus(title, tag, zh)}`],
      [
        labels.empirical,
        `- ${labels.cases}: Story Insight V6 / Stock Rec V3 / FW-Insight V3\n- ${labels.pending}: ${zh ? "将该文档的机制假设转成可测指标，并与强 baseline 对照。" : "Turn this document's mechanism claims into measurable indicators and compare them with strong baselines."}`,
      ],
    ];
  };

  const docs = chunks.map((chunk) => {
    const [rawTitle = "", ...rawBodyLines] = chunk.split("\n");
    const rawBody = rawBodyLines.join("\n").trim();
    const linkMatch = rawBody.match(/(?:^|\n)(?:Link|链接|阅读)[：:]\s*(.+)(?:\n|$)/i);
    const trailingLinkMatch = rawBody.match(/(?:^|\n)(\[[^\]]+\]\([^)]+\))(?:\s*\/\s*\[[^\]]+\]\([^)]+\))*\s*$/);
    const titleLink = (linkMatch?.[1] ?? trailingLinkMatch?.[1])?.trim();
    const titleLinkParts = titleLink?.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    const title = marked.parseInline(rawTitle.trim()) as string;
    const titleText = stripMarkdown(rawTitle.trim());
    const linkedTitle = titleLinkParts ? `<a href="${titleLinkParts[2]}">${title}</a>` : title;
    const bodyWithoutExplicitLink = linkMatch ? rawBody.replace(linkMatch[0], "\n").trim() : rawBody;
    const bodyWithoutLink = trailingLinkMatch ? bodyWithoutExplicitLink.replace(trailingLinkMatch[0], "\n").trim() : bodyWithoutExplicitLink;
    const fieldMatches = Array.from(
      bodyWithoutLink.matchAll(/^([^：:\n]+)[：:][ \t]*(?:\r?\n)?([\s\S]*?)(?=^[^：:\n]+[：:][ \t]*(?:\r?\n)?|\s*$)/gm),
    );
    const templateFieldPattern =
      /^(一句话定位|核心贡献|前置阅读|引入对象\s*\/\s*术语|当前状态|实证与实现|One-line positioning|Core contribution|Prerequisite reading|Introduced objects\s*\/\s*terms|Current status|Empirical and implementation)$/i;
    const tagMatch = bodyWithoutLink.match(/^Tag:\s*(.+)$/im);
    const fallbackBody = tagMatch ? bodyWithoutLink.replace(tagMatch[0], "").trim() : bodyWithoutLink;
    const zh = /[\u3400-\u9fff]/.test(`${titleText}\n${bodyWithoutLink}`);
    const templateFields = fieldMatches
      .map((match) => [match[1].trim(), match[2].trim()] as [string, string])
      .filter(([label]) => templateFieldPattern.test(label));
    const fieldEntries = templateFields.length
      ? templateFields
      : generatedFields(titleText, tagMatch?.[1].trim() ?? "", fallbackBody, zh);

    const fields = fieldEntries.map(([label, value]) => {
      if (!value) return "";
      return `<section class="paper-doc-field${fieldClass(label)}">
<h4>${marked.parseInline(label) as string}</h4>
<div>${marked.parse(value, { async: false }) as string}</div>
</section>`;
    });

    return `<article class="paper-doc">
<header class="paper-doc-header">
<h3>${linkedTitle}</h3>
</header>
<div class="paper-doc-fields">
${fields.join("\n")}
</div>
</article>`;
  });

  return `<div class="paper-docs">
${docs.join("\n")}
</div>`;
}

function withBasePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedPath}`;
}

function rewriteRootRelativeHref(path: string, hash = ""): string {
  const normalizedPath = path.replace(/^\/+/, "");

  // Docs live in the repo, not in the generated site routes. Rewrite these
  // links to the canonical GitHub document URL so markdown references stay valid.
  if (/^docs\/.+\.md$/i.test(normalizedPath)) {
    return `https://github.com/wxy2ab/against-llm-mediocrity/blob/main/${normalizedPath}${hash}`;
  }

  return `${withBasePath(normalizedPath)}${hash}`;
}

function prefixInternalLinks(html: string): string {
  return html.replace(/\shref="\/(?!\/)([^"#]*)(#[^"]*)?"/g, (_match, path: string, hash = "") => {
    return ` href="${rewriteRootRelativeHref(path, hash)}"`;
  });
}

function renderMarkdown(markdown: string): string {
  // Takeaway fence first (disjoint from cards), then custom maps/cards, then
  // parse, then post-process the parsed HTML (flow diagrams + internal links).
  const withTakeaways = markdown.replace(
    /^(:{3,})takeaway[ \t]*\r?\n([\s\S]*?)^\1[ \t]*\r?$/gm,
    (_match, _fence: string, block: string) => renderTakeaway(block),
  );
  const withDocumentMaps = withTakeaways.replace(
    /^(:{3,})document-map[ \t]*\r?\n([\s\S]*?)^\1[ \t]*\r?$/gm,
    (_match, _fence: string, block: string) => renderDocumentMap(block),
  );
  const withPaperDocs = withDocumentMaps.replace(
    /^(:{3,})paper-docs[ \t]*\r?\n([\s\S]*?)^\1[ \t]*\r?$/gm,
    (_match, _fence: string, block: string) => renderPaperDocs(block),
  );
  const withCards = withPaperDocs.replace(
    /^(:{3,})cards[ \t]*\r?\n([\s\S]*?)^\1[ \t]*\r?$/gm,
    (_match, _fence: string, block: string) => renderCards(block),
  );
  const html = marked.parse(withCards, { async: false }) as string;
  return prefixInternalLinks(styleFlowDiagrams(html));
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
  .filter((page) => page.showInNav)
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
