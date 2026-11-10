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

// Keys the three "regime" cards to a color block by their unique Tag copy.
// NOTE: coupled to the exact tag strings in content/{en,zh}/home.md and
// content/{en,zh}/framework.md — keep in sync.
function regimeClass(tag: string): string {
  if (/probability-value mismatch|probability peak misses value peak|概率与价值错位|概率峰值偏离价值峰值/i.test(tag))
    return " regime-mediocre";
  if (/common real-world regime|common practical state|最常见的现实区间|最常见的实际状态/i.test(tag)) return " regime-local";
  if (/probability and value align|probability and value rise together|概率与价值同向/i.test(tag))
    return " regime-extraordinary";
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

// Papers index. A `:::paper-docs` block is a catalogue of documents:
//
//   Group: Core Theory Layer      optional; opens a group of entries
//
//   ### Title
//   Tag: kind of document         optional
//
//   Abstract, any Markdown.
//
//   [Read it: English](url) / [中文](url)
//
// An entry's link group is an explicit `Link:` line and/or the run of
// link-only lines that closes it. The first link is the title link. Every link
// is also listed under the title as an edition, labelled by the language its
// file name declares (`x.md` English, `x.zh-CN.md` Chinese); a link to anything
// else keeps the text the author gave it. A link whose text is more than a
// language name opens a new set of editions (a companion report, say); once an
// entry has more than one set, each is labelled with that text.
//
// Entries are numbered through the block. When the block has groups it opens
// with a contents list that gives each group's range.
function renderPaperDocs(block: string, lang: Lang, blockIndex: number): string {
  const zh = lang === "zh";

  const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const inline = (value: string) => marked.parseInline(value.trim()) as string;

  const stripMarkdown = (value: string) =>
    value
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

  type DocLink = { text: string; href: string; lang: Lang | null };
  type LinkSet = { label: string; links: DocLink[] };

  const markdownLink = /\[([^\]]+)\]\(([^)]+)\)/g;
  const languageName = /^(?:中文|简体中文|English|Chinese)$/i;
  const languageSuffix = /\s*(?:[:：]\s*(?:中文|简体中文|English|Chinese)|[（(]\s*(?:中文|English|Chinese)\s*[)）])$/i;

  const docLang = (href: string): Lang | null => {
    const path = href.split(/[?#]/)[0];
    if (/\.zh(?:-CN)?\.md$/i.test(path)) return "zh";
    if (/\.md$/i.test(path)) return "en";
    return null;
  };

  const parseLinks = (value: string): DocLink[] =>
    Array.from(value.matchAll(markdownLink), (match) => {
      const href = match[2].trim();
      return { text: match[1].trim(), href, lang: docLang(href) };
    });

  // Nothing but links, optionally as a list item, separated by " / ", " · "
  // or similar punctuation.
  const isLinkLine = (line: string) =>
    parseLinks(line).length > 0 &&
    !line
      .replace(/^\s*[-*+]\s+/, "")
      .replace(markdownLink, "")
      .replace(/[\s/／·•|｜、]/g, "");

  const splitTrailingLinks = (body: string) => {
    const lines = body.split("\n");
    let start = lines.length;
    while (start > 0 && (!lines[start - 1].trim() || isLinkLine(lines[start - 1]))) start -= 1;
    return {
      body: lines.slice(0, start).join("\n").trim(),
      links: parseLinks(lines.slice(start).join("\n")),
    };
  };

  // "Read the V1–V25 synthesis: English" names its set "V1–V25 synthesis".
  const setLabel = (text: string) => {
    const label = text.replace(languageSuffix, "").replace(/^(?:阅读|Read(?:\s+the)?)\s*/i, "");
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const linkSets = (links: DocLink[]): LinkSet[] => {
    const sets: LinkSet[] = [];
    for (const link of links) {
      const opensSet = link.lang !== null && !languageName.test(link.text);
      if (opensSet || !sets.length) sets.push({ label: opensSet ? setLabel(link.text) : "", links: [] });
      sets[sets.length - 1].links.push(link);
    }
    return sets;
  };

  // ---- Split the block into groups of entries ------------------------------
  type Group = { title: string; entries: string[] };
  const groups: Group[] = [];
  let entryLines: string[] | null = null;

  const openGroup = (title: string) => {
    groups.push({ title, entries: [] });
  };
  const closeEntry = () => {
    if (!entryLines) return;
    if (!groups.length) openGroup("");
    groups[groups.length - 1].entries.push(entryLines.join("\n"));
    entryLines = null;
  };

  for (const line of block.split(/\r?\n/)) {
    const group = line.match(/^Group[：:]\s*(.+?)\s*$/i);
    if (group) {
      closeEntry();
      openGroup(group[1]);
    } else if (/^###\s+/.test(line)) {
      closeEntry();
      entryLines = [line.replace(/^###\s+/, "")];
    } else {
      entryLines?.push(line);
    }
  }
  closeEntry();

  const filled = groups.filter((group) => group.entries.length);
  const total = filled.reduce((sum, group) => sum + group.entries.length, 0);
  const grouped = filled.some((group) => group.title);
  const pad = (value: number) => String(value).padStart(2, "0");
  const idPrefix = blockIndex === 0 ? "papers" : `papers-${blockIndex + 1}`;
  const entryTag = grouped ? "h4" : "h3";

  const renderEntry = (chunk: string, number: number) => {
    const [rawTitle = "", ...rawBodyLines] = chunk.split("\n");
    const rawBody = rawBodyLines.join("\n").trim();
    const linkMatch = rawBody.match(/(?:^|\n)(?:Link|链接|阅读)[：:]\s*(.+)(?:\n|$)/i);
    const trailing = splitTrailingLinks(linkMatch ? rawBody.replace(linkMatch[0], "\n").trim() : rawBody);
    const links = [...(linkMatch ? parseLinks(linkMatch[1]) : []), ...trailing.links];
    const tagMatch = trailing.body.match(/^Tag[：:]\s*(.+)$/im);
    const abstract = tagMatch ? trailing.body.replace(tagMatch[0], "").trim() : trailing.body;

    const titleText = stripMarkdown(rawTitle);
    // A range such as "V1–V25" must not break at its dash when the title wraps.
    const title = inline(rawTitle.replace(/[\w.]+(?:–[\w.]+)+/g, '<span class="paper-entry-range">$&</span>'));
    const linkedTitle = links.length ? `<a href="${escapeHtml(links[0].href)}">${title}</a>` : title;
    const kind = tagMatch ? `<span class="paper-entry-kind">${inline(tagMatch[1])}</span>` : "";

    const sets = linkSets(links);
    const labelled = sets.length > 1;
    const editions = sets.map((set) => {
      const context = (labelled && stripMarkdown(set.label)) || titleText;
      const label = labelled && set.label ? `<span class="paper-entry-linklabel">${inline(set.label)}</span>` : "";
      const items = set.links.map((link) => {
        const text = link.lang === "zh" ? "中文" : link.lang === "en" ? "English" : stripMarkdown(link.text);
        const langAttr = link.lang ? ` hreflang="${link.lang === "zh" ? "zh-CN" : "en"}" lang="${link.lang === "zh" ? "zh-CN" : "en"}"` : "";
        return `<a href="${escapeHtml(link.href)}"${langAttr} aria-label="${escapeHtml(`${context} · ${text}`)}">${escapeHtml(text)}</a>`;
      });
      return `<li>${label}<span class="paper-entry-editions">${items.join("")}</span></li>`;
    });
    const editionList = editions.length
      ? `\n<ul class="paper-entry-links" aria-label="${zh ? "全文链接" : "Full text"}">\n${editions.join("\n")}\n</ul>`
      : "";

    return `<li class="paper-entry">
<p class="paper-entry-meta"><span class="paper-entry-num">${pad(number)}</span>${kind}</p>
<${entryTag} class="paper-entry-title">${linkedTitle}</${entryTag}>
<div class="paper-entry-body">${abstract ? (marked.parse(abstract, { async: false }) as string) : ""}</div>${editionList}
</li>`;
  };

  let number = 0;
  const sections = filled.map((group, index) => {
    const first = number + 1;
    const entries = group.entries.map((chunk) => renderEntry(chunk, (number += 1)));
    const range = first === number ? pad(first) : `${pad(first)}–${pad(number)}`;
    const id = `${idPrefix}-g${index + 1}`;
    const title = group.title ? inline(group.title) : "";
    const head = title
      ? `\n<header class="paper-group-head">\n<h3 id="${id}-title">${title}</h3>\n<p class="paper-group-range">${range}</p>\n</header>`
      : "";
    return {
      id,
      title,
      range,
      html: `<section class="paper-group${title ? "" : " paper-group--plain"}"${title ? ` id="${id}" aria-labelledby="${id}-title"` : ""}>${head}
<ol class="paper-list" start="${first}">
${entries.join("\n")}
</ol>
</section>`,
    };
  });

  const titled = sections.filter((section) => section.title);
  const contents = grouped
    ? `<nav class="paper-contents" aria-label="${zh ? "分组索引" : "Index of groups"}">
<p class="paper-contents-label">${
        zh ? `索引 · ${total} 篇文稿 · ${titled.length} 组` : `Index · ${total} documents · ${titled.length} groups`
      }</p>
<ol>
${titled
  .map(
    (section) =>
      `<li><a href="#${section.id}" data-toc="${section.id}"><span class="paper-contents-name">${section.title}</span><span class="paper-contents-leader" aria-hidden="true"></span><span class="paper-contents-range">${section.range}</span></a></li>`,
  )
  .join("\n")}
</ol>
</nav>\n`
    : "";

  return `<div class="paper-docs">
${contents}${sections.map((section) => section.html).join("\n")}
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

function renderMarkdown(markdown: string, lang: Lang): string {
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
  let paperBlocks = 0;
  const withPaperDocs = withDocumentMaps.replace(
    /^(:{3,})paper-docs[ \t]*\r?\n([\s\S]*?)^\1[ \t]*\r?$/gm,
    (_match, _fence: string, block: string) => renderPaperDocs(block, lang, paperBlocks++),
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
      html: renderMarkdown(body, frontmatter.lang),
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
