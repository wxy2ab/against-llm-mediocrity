import "./styles.css";
import {
  alternatePath,
  content,
  normalizePath,
  navOrder,
  pagePath,
  type Lang,
  type Page,
} from "./content-loader";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

const appRoot = app;
const githubDocsBase = "https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs";

type ImageLang = "en" | "zh";

type InfographicArticle = {
  imageKey: string;
  enTitle: string;
  zhTitle: string;
  enDoc: string;
  zhDoc: string;
};

const rawInfographicImages = import.meta.glob("../docs/images/*", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

const infographicImages = Object.fromEntries(
  Object.entries(rawInfographicImages).map(([path, url]) => [path.split("/").pop() ?? path, url]),
) as Record<string, string>;

const infographicArticles: InfographicArticle[] = [
  {
    imageKey: "value_keep",
    enTitle: "A Structural Theory of Value Preservation in LLM Systems",
    zhTitle: "LLM 系统中价值保存的结构理论",
    enDoc: "structural-theory-value-preservation-llm-systems.md",
    zhDoc: "structural-theory-value-preservation-llm-systems.zh-CN.md",
  },
  {
    imageKey: "six_mismatch",
    enTitle: "Six Primitive Mismatches in LLM Systems",
    zhTitle: "LLM 系统中的六类原始失配",
    enDoc: "six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md",
    zhDoc: "six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md",
  },
  {
    imageKey: "formal_layer",
    enTitle: "Formal Mechanism Layer for Governed LLM Systems",
    zhTitle: "面向受治理 LLM 系统的形式化机制层",
    enDoc: "formal-mechanism-layer-for-governed-llm-systems.md",
    zhDoc: "formal-mechanism-layer-for-governed-llm-systems.zh-CN.md",
  },
  {
    imageKey: "bridge",
    enTitle: "Diagnostic–Mechanism Bridge for Governed LLM Systems",
    zhTitle: "面向受治理 LLM 系统的诊断-机制桥接",
    enDoc: "diagnostic-mechanism-bridge-for-governed-llm-systems.md",
    zhDoc: "diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md",
  },
  {
    imageKey: "train",
    enTitle: "Mechanism-Driven Training for Governed LLM Systems",
    zhTitle: "面向受治理 LLM 系统的机制驱动训练",
    enDoc: "mechanism-driven-training-for-governed-llm-systems.md",
    zhDoc: "mechanism-driven-training-for-governed-llm-systems.zh-CN.md",
  },
  {
    imageKey: "interface",
    enTitle: "Governed LLM Object Model and Interface Specification",
    zhTitle: "受治理 LLM 对象模型与接口规范",
    enDoc: "governed-llm-object-model-interface-specification.md",
    zhDoc: "governed-llm-object-model-interface-specification.zh-CN.md",
  },
  {
    imageKey: "audit",
    enTitle: "Audit Engineering for Governed LLM Systems",
    zhTitle: "面向受治理 LLM 系统的审计工程",
    enDoc: "audit-engineering-failure-localization-control-space-writeback.md",
    zhDoc: "audit-engineering-failure-localization-control-space-writeback.zh-CN.md",
  },
  {
    imageKey: "oracle",
    enTitle: "Oracle, Audit Agent, and SGAR: A Unified Framework from Hard Feedback to Engine Routing",
    zhTitle: "Oracle、Audit Agent 与 SGAR：从硬反馈到引擎路由的统一框架",
    enDoc: "oracle-classification-audit-agent-sgar-engine-routing.md",
    zhDoc: "oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md",
  },
  {
    imageKey: "sgar",
    enTitle: "State-Governed Agent Regime for Governed LLM Systems",
    zhTitle: "面向受治理 LLM 系统的状态治理型 Agent 体制",
    enDoc: "state-governed-agent-regime-for-governed-llm-systems.md",
    zhDoc: "state-governed-agent-regime-for-governed-llm-systems.zh-CN.md",
  },
  {
    imageKey: "observe_represent",
    enTitle: "Observation-Representation Mismatch and Channel Governance in LLM Systems",
    zhTitle: "LLM 系统中的观测-表征失配与通道治理",
    enDoc: "observation-representation-mismatch-channel-governance-llm-systems.md",
    zhDoc: "observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md",
  },
  {
    imageKey: "state_mismatch",
    enTitle: "State Mismatch and State Governance in LLM Systems",
    zhTitle: "LLM 系统中的状态失配与状态治理",
    enDoc: "state-mismatch-state-governance-llm-systems.md",
    zhDoc: "state-mismatch-state-governance-llm-systems.zh-CN.md",
  },
  {
    imageKey: "fit_mismatch",
    enTitle: "Fitting-Boundary Mismatch and Capability Routing in LLM Systems",
    zhTitle: "LLM 系统中的拟合边界失配与能力路由",
    enDoc: "fitting-boundary-mismatch-capability-routing-llm-systems.md",
    zhDoc: "fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md",
  },
  {
    imageKey: "support_mismatch",
    enTitle: "Support Mismatch and Control-Space Search in LLM Systems",
    zhTitle: "LLM 系统中的支持失配与控制空间搜索",
    enDoc: "support-mismatch-control-space-search-llm-systems.md",
    zhDoc: "support-mismatch-control-space-search-llm-systems.zh-CN.md",
  },
  {
    imageKey: "aggregation",
    enTitle: "Aggregation Mismatch and Compositional Governance in LLM Systems",
    zhTitle: "LLM 系统中的聚合失配与组合治理",
    enDoc: "aggregation-mismatch-compositional-governance-llm-systems.md",
    zhDoc: "aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md",
  },
  {
    imageKey: "specification_mismatch",
    enTitle: "Specification Mismatch and Objective Governance in LLM Systems",
    zhTitle: "LLM 系统中的规格失配与目标治理",
    enDoc: "specification-mismatch-objective-governance-llm-systems.md",
    zhDoc: "specification-mismatch-objective-governance-llm-systems.zh-CN.md",
  },
];

function routeTo(path: string) {
  window.history.pushState({}, "", withBase(path));
  render();
}

function getBasePath() {
  const base = import.meta.env.BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function withoutBase(pathname: string) {
  const base = getBasePath();
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || "/";
  }
  return pathname || "/";
}

function withBase(path: string) {
  const base = getBasePath();
  if (!base || path.startsWith(base)) return path;
  return `${base}${path}`;
}

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

function link(path: string, text: string, className = "") {
  const href = isExternal(path) ? path : withBase(path);
  const attrs = isExternal(path) ? ' target="_blank" rel="noreferrer"' : "";
  return `<a class="${className}" href="${href}"${attrs}>${text}</a>`;
}

function articleUrl(article: InfographicArticle, lang: ImageLang) {
  return `${githubDocsBase}/${lang === "zh" ? article.zhDoc : article.enDoc}`;
}

function infographicImageUrl(article: InfographicArticle, lang: ImageLang) {
  return infographicImages[`${article.imageKey}.${lang}.png`] ?? "";
}

function renderArticleLink(article: InfographicArticle, lang: ImageLang, label: string, className = "") {
  return `<a class="${className}" href="${articleUrl(article, lang)}" target="_blank" rel="noreferrer">${label}</a>`;
}

function renderNav(lang: Lang, current: Page) {
  const site = content[lang];
  const overviewPath = pagePath(lang, "overview");
  const overviewActive = current.key === "overview" ? " active" : "";
  const guidelinesUrl = `${githubDocsBase}/guidelines/${
    lang === "zh" ? "guidelines.zh-CN.md" : "guidelines.md"
  }`;
  return `
    <header class="site-header">
      <a class="brand" href="${withBase(pagePath(lang, "home"))}" data-route="${pagePath(lang, "home")}">
        <span class="brand-mark" aria-hidden="true">AM</span>
        <span>Against LLM Mediocrity</span>
      </a>
      <nav class="nav" aria-label="Main navigation">
        ${navOrder
          .map((key) => {
            const page = site.pages[key];
            const active = page.key === current.key ? "active" : "";
            return `<a class="${active}" href="${withBase(page.path)}" data-route="${page.path}">${page.navTitle}</a>`;
          })
          .join("")}
        ${link(guidelinesUrl, lang === "zh" ? "指南" : "Guidelines")}
      </nav>
      <div class="header-actions">
        ${link(`/interactive.html?lang=${lang}`, lang === "zh" ? "交互实验" : "Interactive Lab", "ghost-button")}
        <a class="ghost-button${overviewActive}" href="${withBase(overviewPath)}" data-route="${overviewPath}">${lang === "zh" ? "一览" : "Overview"}</a>
        ${link(alternatePath(lang, current.key), site.switchLabel, "ghost-button")}
        ${link(site.repoUrl, site.repoLabel, "solid-button")}
      </div>
    </header>
  `;
}

// Small filled-triangle arrowhead whose tip sits at (x, y), pointing `dir`.
// Colored via the class modifier (teal / violet / warm), default neutral ink.
type ArrowDir = "right" | "left" | "up" | "down";
function arrowHead(x: number, y: number, dir: ArrowDir, cls = "") {
  const s = 8;
  const w = 5;
  const d =
    dir === "right"
      ? `M${x} ${y} L${x - s} ${y - w} L${x - s} ${y + w} Z`
      : dir === "left"
        ? `M${x} ${y} L${x + s} ${y - w} L${x + s} ${y + w} Z`
        : dir === "up"
          ? `M${x} ${y} L${x - w} ${y + s} L${x + w} ${y + s} Z`
          : `M${x} ${y} L${x - w} ${y - s} L${x + w} ${y - s} Z`;
  return `<path class="visual-arrow-head ${cls}" d="${d}" />`;
}

// A short rounded label chip with centered text, used to lift a word off the
// curves/strokes behind it so it stays legible.
function pill(cx: number, cy: number, w: number, h: number, text: string, textCls = "visual-caption", pillCls = "visual-pill") {
  return `<rect class="${pillCls}" x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" /><text class="${textCls}" x="${cx}" y="${cy + 4}">${text}</text>`;
}

// Home hero: the three probability-vs-value regimes as three readable
// mini-charts on a shared horizontal "answer space" axis. Each chart is
// annotated with the ONE feature that distinguishes it (shared peak / gap /
// aligned band) so the picture teaches the idea without the page text.
function renderAlignmentVisual(page: Page) {
  const v = page.alignmentLabels!;
  const zh = page.lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);
  const cue = {
    same: t("same peak", "峰值重合"),
    gap: t("the gap", "错位"),
    aligned: t("aligned here", "此处对齐"),
    axis: t("Horizontal axis = the space of possible answers", "横轴 = 所有可能答案"),
  };

  const extraordinary = `
    <svg viewBox="0 0 240 150" role="img" aria-label="${v.aligned}">
      <path class="axis" d="M18 118H222" />
      <path class="curve probability" d="M24 114 C60 106 96 58 120 42 C144 58 180 106 216 114" />
      <path class="curve value" d="M42 116 C74 108 102 68 120 54 C138 68 166 108 198 116" />
      <path class="peak-drop" d="M120 46V118" />
      <circle class="peak-dot teal" cx="120" cy="42" r="5" />
      <text class="chart-cue teal-ink" x="120" y="24">✓ ${cue.same}</text>
    </svg>`;

  const mediocre = `
    <svg viewBox="0 0 240 150" role="img" aria-label="${v.misaligned}">
      <path class="axis" d="M18 118H222" />
      <path class="peak-drop warm" d="M78 40V118" />
      <path class="peak-drop cool" d="M170 48V118" />
      <path class="curve probability" d="M24 114 C44 104 60 52 78 40 C98 54 116 104 144 114" />
      <path class="curve value" d="M108 116 C140 108 156 62 170 48 C188 64 204 108 216 114" />
      <circle class="peak-dot warm" cx="78" cy="40" r="4.5" />
      <circle class="peak-dot cool" cx="170" cy="48" r="4.5" />
      ${arrowHead(78, 134, "left")}
      ${arrowHead(170, 134, "right")}
      <path class="gap-measure" d="M86 134H109" />
      <path class="gap-measure" d="M139 134H162" />
      ${pill(124, 134, 34, 16, cue.gap)}
    </svg>`;

  const local = `
    <svg viewBox="0 0 240 150" role="img" aria-label="${v.partial}">
      <path class="axis" d="M18 118H222" />
      <rect class="aligned-zone" x="52" y="30" width="66" height="88" rx="6" />
      <path class="curve probability" d="M24 114 C46 104 70 54 86 44 C104 56 128 100 150 110 C176 116 200 116 216 114" />
      <path class="curve value" d="M26 116 C48 106 72 56 86 46 C108 58 126 92 150 82 C178 70 200 56 216 42" />
      <circle class="peak-dot warm" cx="216" cy="114" r="4.5" />
      <circle class="peak-dot cool" cx="216" cy="42" r="4.5" />
      <text class="chart-cue teal-ink" x="85" y="24">${cue.aligned}</text>
    </svg>`;

  const cards: Array<[string, string, string, string]> = [
    ["is-extraordinary", extraordinary, v.extraordinary, v.aligned],
    ["is-mediocre", mediocre, v.mediocre, v.misaligned],
    ["is-local", local, v.local, v.partial],
  ];

  return `
    <figure class="system-visual" aria-label="Probability and task value alignment diagram">
      <div class="legend">
        <span class="probability-line">${v.probability}</span>
        <span class="value-line">${v.value}</span>
      </div>
      <div class="alignment-panels">
        ${cards
          .map(
            ([cls, svg, title, caption]) => `
        <article class="alignment-card ${cls}">
          ${svg}
          <div class="alignment-card-text">
            <h3>${title}</h3>
            <p>${caption}</p>
          </div>
        </article>`,
          )
          .join("")}
      </div>
      <p class="alignment-axis-note">${cue.axis}</p>
    </figure>
  `;
}

// Two centered lines of text stacked at (cx, cy).
function twoLine(cx: number, cy: number, l1: string, l2: string, cls = "visual-text") {
  return `<text class="${cls}" x="${cx}" y="${cy - 3}">${l1}</text><text class="${cls}" x="${cx}" y="${cy + 16}">${l2}</text>`;
}

// Meaningful per-page diagram. `t` picks the language; each visual teaches one
// idea. Color law is strict: red=probability, blue=value, teal=validated/good,
// gold=local, violet=human, ink=neutral structure.
function topicSvg(key: string, t: (en: string, zh: string) => string, title: string) {
  const open = `<svg viewBox="0 0 520 420" role="img" aria-label="${title}"><rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />`;
  const close = `</svg>`;

  switch (key) {
    // Why It Matters — a fluent answer scores high on quality yet lands off the target.
    case "science":
      return `${open}
        <text class="visual-caption" x="252" y="52">${t("A fluent answer can miss the real target", "流畅的答案也可能脱靶")}</text>
        <circle class="target-ring faint" cx="188" cy="232" r="98" />
        <circle class="target-ring" cx="188" cy="232" r="64" />
        <circle class="target-ring" cx="188" cy="232" r="32" />
        <circle class="visual-dot cool" cx="188" cy="232" r="10" />
        <text class="chart-label cool-ink" x="188" y="352">${t("what's needed", "真正需要的")}</text>
        <path class="visual-gap" d="M188 232 L232 194" />
        <circle class="visual-node warm" cx="232" cy="194" r="12" />
        <text class="chart-label warm-ink" x="286" y="176">${t("fluent answer", "流畅答案")}</text>
        <rect class="gauge-track" x="420" y="150" width="30" height="176" rx="15" />
        <rect class="gauge-fill" x="420" y="176" width="30" height="150" rx="15" />
        <text class="visual-caption" x="435" y="138">${t("Quality", "质量")}</text>
        <text class="chart-label warm-ink" x="435" y="348">${t("reads high", "读数很高")}</text>
      ${close}`;

    // Mechanism — the likely peak (red) misses the value peak (blue); diagnose which of six mismatches.
    case "framework":
      return `${open}
        <text class="visual-caption" x="210" y="46">${t("Likely peak misses value peak", "概率峰偏离价值峰")}</text>
        <path class="axis" d="M56 150 H364" />
        <path class="peak-drop warm" d="M130 82 V150" />
        <path class="peak-drop cool" d="M290 82 V150" />
        <path class="curve probability" d="M60 146 C86 136 110 94 130 80 C150 94 174 136 200 146" />
        <path class="curve value" d="M220 146 C246 136 270 94 290 80 C310 94 334 136 360 146" />
        <circle class="peak-dot warm" cx="130" cy="80" r="4.5" />
        <circle class="peak-dot cool" cx="290" cy="80" r="4.5" />
        <text class="chart-label warm-ink" x="130" y="70">${t("likely", "最可能")}</text>
        <text class="chart-label cool-ink" x="290" y="70">${t("needed", "所需要")}</text>
        ${arrowHead(130, 168, "left")}${arrowHead(290, 168, "right")}
        <path class="gap-measure" d="M138 168 H195" /><path class="gap-measure" d="M225 168 H282" />
        ${pill(210, 168, 46, 17, t("gap", "错位"))}
        <text class="visual-caption" x="428" y="120">${t("diagnose", "诊断")}</text>
        ${arrowHead(428, 150, "down")}<path class="visual-flow" d="M428 128 V148" />
        ${["Aggregation", "Support", "State", "Specification", "Fitting", "Observation"]
          .map((en, i) => {
            const zh = ["聚合", "支持", "状态", "规格", "拟合", "观测"][i];
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = 40 + col * 152;
            const y = 214 + row * 90;
            const cx = x + 68;
            return `<rect class="visual-card" x="${x}" y="${y}" width="136" height="74" rx="14" /><text class="visual-text" x="${cx}" y="${y + 44}">${t(en, zh)}</text>`;
          })
          .join("")}
      ${close}`;

    // Governance — build a control space, then validate and write experience back.
    case "engineering": {
      const stages: Array<[number, number, string, string, boolean]> = [
        [30, 70, t("Input", "输入"), "", false],
        [114, 96, t("Task model", "任务模型"), "", false],
        [224, 128, "", "", true],
        [366, 76, t("Validate", "验证"), "", false],
      ];
      const cardsSvg = stages
        .map(([x, w, label, , accent]) => {
          const cx = x + w / 2;
          const cardCls = accent ? "visual-card accent" : "visual-card";
          const inner = accent
            ? twoLine(cx, 150, t("Control", "控制"), t("objects", "对象"))
            : `<text class="visual-text" x="${cx}" y="${160}">${label}</text>`;
          return `<rect class="${cardCls}" x="${x}" y="${112}" width="${w}" height="84" rx="18" />${inner}`;
        })
        .join("");
      return `${open}
        <text class="visual-caption" x="252" y="50">${t("Build a control space, then validate — not one more sample", "先搭控制空间再验证，而不是再采样一次")}</text>
        ${cardsSvg}
        <path class="visual-flow" d="M100 154 H110" />${arrowHead(114, 154, "right")}
        <path class="visual-flow" d="M210 154 H220" />${arrowHead(224, 154, "right")}
        <path class="visual-flow" d="M352 154 H362" />${arrowHead(366, 154, "right")}
        <path class="visual-flow" d="M442 154 H446" />${arrowHead(474, 154, "right")}
        <path class="visual-flow" d="M446 154 H470" />
        <circle class="visual-node teal" cx="474" cy="154" r="20" />
        <path class="visual-check on-fill" d="M465 154 l6 7 11 -14" />
        <text class="chart-label teal-ink" x="474" y="196">${t("answer", "答案")}</text>
        <path class="visual-loop" d="M404 196 V236 Q404 250 390 250 H302 Q288 250 288 236 V202" />
        ${arrowHead(288, 198, "up", "teal")}
        ${pill(346, 250, 150, 22, t("validate & write back", "验证并写回"), "visual-caption teal-ink", "visual-pill teal")}
      ${close}`;
    }

    // Collaboration — AI runs until a human-only variable; the human supplies just that.
    case "collaboration":
      return `${open}
        <text class="visual-caption" x="252" y="50">${t("AI runs until it needs a human-only variable", "AI 一直推进，直到需要只有人能给的变量")}</text>
        <path class="visual-track" d="M70 178 H286" />
        <circle class="visual-node cool" cx="70" cy="178" r="22" />
        <text class="visual-text-strong" x="70" y="184" style="fill:var(--surface);font-size:16px">AI</text>
        <rect class="visual-gate" x="292" y="120" width="42" height="116" rx="10" />
        <text class="visual-text-strong violet-ink" x="313" y="172" style="font-size:34px">?</text>
        <text class="chart-label violet-ink" x="313" y="258">${t("missing variable", "缺失变量")}</text>
        <path class="visual-loop violet" d="M313 320 V232" />${arrowHead(313, 228, "up", "violet")}
        <circle class="visual-human" cx="313" cy="336" r="14" />
        <path class="visual-human-body" d="M295 366 Q313 346 331 366" />
        <text class="chart-label violet-ink" x="313" y="392">${t("human", "人类")}</text>
        ${pill(418, 336, 122, 24, t("minimal question", "最小充分问题"), "visual-caption violet-ink")}
        <path class="visual-track" d="M334 178 H418" />
        <circle class="visual-node teal" cx="446" cy="178" r="24" />
        <path class="visual-check on-fill" d="M436 178 l7 8 12 -16" />
        <text class="chart-label teal-ink" x="446" y="220">${t("done", "完成")}</text>
      ${close}`;

    // Learning — AI makes execution cheap; scarce human value climbs to judgment, feeding back.
    case "learning": {
      const steps: Array<[number, number, string, string]> = [
        [88, 300, t("Execution", "执行"), "mute-ink"],
        [192, 254, t("Structure", "结构"), "mute-ink"],
        [296, 208, t("Feedback", "反馈"), "gold-ink"],
        [400, 162, t("Judgment", "判断"), "teal-ink"],
      ];
      const stepsSvg = steps
        .map(([x, y, label, ink]) => {
          const cx = x + 48;
          return `<rect class="visual-card" x="${x}" y="${y}" width="96" height="48" rx="12" /><text class="visual-text ${ink}" x="${cx}" y="${y + 30}" style="font-size:15px">${label}</text>`;
        })
        .join("");
      return `${open}
        <text class="visual-caption" x="252" y="48">${t("AI makes execution cheap; human value climbs", "AI 让执行变廉价，人的价值向上走")}</text>
        <path class="visual-flow" d="M62 358 V104" />${arrowHead(62, 100, "up")}
        <text class="chart-label mute-ink" x="62" y="88">${t("value", "价值")}</text>
        <path class="visual-flow" style="stroke:rgba(34,40,49,0.28)" d="M136 300 V278 H240 V232 H344 V186" />
        ${stepsSvg}
        <text class="chart-label mute-ink" x="136" y="378">${t("AI: cheap & abundant", "AI：廉价且充裕")}</text>
        <path class="visual-loop violet" d="M412 168 C300 96 150 108 112 262" />${arrowHead(112, 268, "down", "violet")}
        ${pill(238, 108, 118, 22, t("learning loop", "学习回路"), "visual-caption violet-ink")}
        <circle class="visual-human" cx="450" cy="140" r="12" />
        <path class="visual-human-body" d="M435 166 Q450 150 465 166" />
        <text class="chart-label violet-ink" x="450" y="124">${t("human", "人类")}</text>
      ${close}`;
    }

    // Papers — working drafts consolidate into one synthesis, heading toward empirics.
    case "papers":
      return `${open}
        <text class="visual-caption" x="252" y="48">${t("Drafts consolidate into a synthesis, then empirics", "草稿汇聚成综述，再走向实证")}</text>
        <text class="chart-label mute-ink" x="150" y="104">${t("working drafts", "工作草稿")}</text>
        <rect class="visual-paper" x="88" y="150" width="138" height="182" rx="12" transform="rotate(-17 157 241)" opacity="0.55" />
        <rect class="visual-paper" x="106" y="134" width="138" height="182" rx="12" transform="rotate(-9 175 225)" opacity="0.75" />
        <rect class="visual-paper" x="124" y="120" width="138" height="182" rx="12" transform="rotate(-3 193 211)" />
        <rect class="visual-card" x="214" y="140" width="152" height="204" rx="14" />
        <rect x="214" y="140" width="152" height="34" rx="14" fill="var(--regime-extraordinary)" />
        <circle cx="234" cy="157" r="6" fill="var(--surface)" />
        <path class="visual-stack" d="M234 208 H346 M234 232 H330 M234 256 H346 M234 280 H322 M234 304 H340" />
        <text class="chart-label teal-ink" x="290" y="366">${t("Current synthesis", "当前综述")}</text>
        <path class="visual-flow" d="M370 242 H404" />${arrowHead(410, 242, "right")}
        <circle cx="452" cy="242" r="40" fill="none" stroke="var(--regime-extraordinary)" stroke-width="2.5" stroke-dasharray="6 6" />
        <circle class="target-ring" cx="452" cy="242" r="20" style="stroke:var(--regime-extraordinary)" />
        <circle class="visual-dot teal" cx="452" cy="242" r="8" />
        <text class="chart-label teal-ink" x="452" y="316">${t("empirics", "实证")}</text>
      ${close}`;

    // Projects — sgar: a runnable coding agent whose runs flow through a governed pipeline into a state ledger.
    case "projects": {
      const chips: Array<[number, string, string, boolean]> = [
        [40, t("Edit", "编辑"), "", false],
        [118, t("Repair", "修复"), "", false],
        [196, t("Audit", "审计"), "", true],
        [274, t("Trace", "追踪"), "", false],
      ];
      const chipsSvg = chips
        .map(([x, label, , accent]) => {
          const cx = x + 29;
          const cls = accent ? "visual-card accent" : "visual-card";
          return `<rect class="${cls}" x="${x}" y="${256}" width="58" height="46" rx="12" /><text class="visual-text ${accent ? "teal-ink" : ""}" x="${cx}" y="${284}" style="font-size:15px">${label}</text>`;
        })
        .join("");
      return `${open}
        <text class="visual-caption" x="252" y="46">${t("sgar — governance made into a runnable tool", "sgar — 把治理做成可运行的工具")}</text>
        <rect class="visual-window" x="40" y="76" width="286" height="150" rx="14" />
        <path class="visual-flow" style="stroke:rgba(34,40,49,0.12);stroke-width:1.5" d="M40 106 H326" />
        <circle cx="62" cy="91" r="5" fill="var(--regime-mediocre)" /><circle cx="80" cy="91" r="5" fill="var(--regime-local)" /><circle cx="98" cy="91" r="5" fill="var(--regime-extraordinary)" />
        <text class="visual-mono" x="270" y="96" style="fill:var(--ink-500)">sgar</text>
        <text class="visual-mono teal-ink" x="62" y="142">$</text><text class="visual-mono" x="78" y="142">sgar run</text>
        <text class="visual-mono" x="62" y="170" style="fill:var(--ink-500)">${t("· editing 3 files", "· 编辑 3 个文件")}</text>
        <text class="visual-mono teal-ink" x="62" y="198">${t("· audit passed ✓", "· 审计通过 ✓")}</text>
        ${chipsSvg}
        <path class="visual-flow" d="M98 279 H110" />${arrowHead(114, 279, "right")}
        <path class="visual-flow" d="M176 279 H188" />${arrowHead(192, 279, "right")}
        <path class="visual-flow" d="M254 279 H266" />${arrowHead(270, 279, "right")}
        <rect class="visual-panel" x="344" y="76" width="158" height="286" rx="16" />
        <text class="visual-caption" x="423" y="102">${t("State Ledger", "状态账本")}</text>
        <text class="visual-mono" x="360" y="140" style="fill:var(--ink-500)">12:04</text><path class="visual-stack" d="M360 150 H486" />
        <text class="visual-mono" x="360" y="176" style="fill:var(--ink-500)">12:07</text><path class="visual-stack" d="M360 186 H486" />
        <text class="visual-mono" x="360" y="212" style="fill:var(--ink-500)">12:10</text><path class="visual-stack" d="M360 222 H486" />
        <rect class="visual-card accent" x="352" y="244" width="142" height="34" rx="8" />
        <text class="visual-mono teal-ink" x="362" y="266">12:12 ✓</text>
        <path class="visual-loop" d="M332 279 C346 279 344 261 350 261" />${arrowHead(352, 261, "right", "teal")}
      ${close}`;
    }

    // Case studies (default) — every case runs one dossier: diagnose, build, validate, deliver.
    default: {
      const cards: Array<[string, string]> = [
        [t("Diagnose", "诊断"), ""],
        [t("Build", "构建"), ""],
        [t("Validate", "验证"), ""],
        [t("Deliver", "交付"), "teal"],
      ];
      const cardsSvg = cards
        .map(([label, accent], i) => {
          const x = 32 + i * 118;
          const cx = x + 51;
          const cardCls = accent ? "visual-card accent" : "visual-card";
          let glyph = "";
          if (i === 0) {
            glyph = `<circle class="visual-dot warm" cx="${cx - 13}" cy="188" r="6" /><circle class="visual-dot cool" cx="${cx + 13}" cy="188" r="6" /><circle class="visual-lens" cx="${cx}" cy="185" r="20" style="fill:none" /><path class="visual-lens" d="M${cx + 15} 200 L${cx + 26} 211" />`;
          } else if (i === 1) {
            glyph = `<rect class="visual-card" x="${cx - 26}" y="164" width="52" height="46" rx="8" /><path class="visual-stack" d="M${cx - 16} 178 H${cx + 16} M${cx - 16} 192 H${cx + 8}" />`;
          } else if (i === 2) {
            glyph = `<path class="visual-threshold" d="M${cx - 30} 198 H${cx + 30}" /><path class="visual-check" d="M${cx - 16} 184 l9 11 18 -24" />`;
          } else {
            glyph = `<circle class="visual-node teal" cx="${cx}" cy="186" r="22" /><path class="visual-check on-fill" d="M${cx - 11} 186 l8 9 14 -18" />`;
          }
          return `<rect class="${cardCls}" x="${x}" y="110" width="102" height="210" rx="18" />
            <rect class="visual-tab" x="${x + 12}" y="122" width="26" height="26" rx="8" /><text class="visual-tab-num" x="${x + 25}" y="140">${i + 1}</text>
            ${glyph}
            <text class="visual-text" x="${cx}" y="298" style="font-size:16px">${label}</text>`;
        })
        .join("");
      return `${open}
        <text class="visual-caption" x="252" y="52">${t("Every case: diagnose → build → validate → deliver", "每个案例：诊断 → 构建 → 验证 → 交付")}</text>
        ${cardsSvg}
        <path class="visual-flow" d="M134 214 H146" />${arrowHead(150, 214, "right")}
        <path class="visual-flow" d="M252 214 H264" />${arrowHead(268, 214, "right")}
        <path class="visual-flow" d="M370 214 H382" />${arrowHead(386, 214, "right")}
      ${close}`;
    }
  }
}

function renderTopicVisual(page: Page) {
  const zh = page.lang === "zh";
  const t = (en: string, cn: string) => (zh ? cn : en);

  const meta = (() => {
    if (page.lang === "zh") {
      switch (page.key) {
        case "science":
          return {
            label: "直觉层",
            tags: ["流畅失败", "错抽象", "控制变量"],
          };
        case "framework":
          return {
            label: "机制层",
            tags: ["概率与价值", "六类失配", "控制空间"],
          };
        case "engineering":
          return {
            label: "治理层",
            tags: ["中间对象", "验证循环", "GKO / GExO / GEsO"],
          };
        case "collaboration":
          return {
            label: "协作层",
            tags: ["最小充分问题", "升级协议", "人类变量"],
          };
        case "learning":
          return {
            label: "学习层",
            tags: ["深知识", "反馈", "长期叙事"],
          };
        case "papers":
          return {
            label: "研究层",
            tags: ["主文", "补充稿", "实证方向"],
          };
        case "projects":
          return {
            label: "实现层",
            tags: ["工具化", "工作台", "基准测试"],
          };
        default:
          return {
            label: "案例层",
            tags: ["诊断", "验证", "交付"],
          };
      }
    }

    switch (page.key) {
      case "science":
        return {
          label: "Intuition Layer",
          tags: ["Fluent failure", "Bad abstraction", "Control variables"],
        };
      case "framework":
        return {
          label: "Mechanism Layer",
          tags: ["Probability-value", "Primitive mismatches", "Control space"],
        };
      case "engineering":
        return {
          label: "Governance Layer",
          tags: ["Intermediate objects", "Validation loop", "GKO / GExO / GEsO"],
        };
      case "collaboration":
        return {
          label: "Collaboration Layer",
          tags: ["MSHQ", "Escalation", "Human variables"],
        };
      case "learning":
        return {
          label: "Learning Layer",
          tags: ["Deep knowledge", "Feedback", "Long-term narrative"],
        };
      case "papers":
        return {
          label: "Research Layer",
          tags: ["Manuscripts", "Supplements", "Empirics"],
        };
      case "projects":
        return {
          label: "Implementation Layer",
          tags: ["Tooling", "Workbench", "Benchmarks"],
        };
      default:
        return {
          label: "Case Layer",
          tags: ["Diagnose", "Validate", "Deliver"],
        };
    }
  })();

  const visual = topicSvg(page.key, t, page.title);

  return `
    <figure class="system-visual topic-visual visual-${page.key}" aria-label="${page.title}">
      <div class="topic-visual-header">
        <p class="topic-visual-label">${meta.label}</p>
        <p class="topic-visual-title">${page.title}</p>
      </div>
      <div class="topic-visual-canvas">
        ${visual}
      </div>
      <figcaption class="topic-visual-footer">
        ${meta.tags.map((tag) => `<span class="topic-visual-tag">${tag}</span>`).join("")}
      </figcaption>
    </figure>
  `;
}

function renderHero(page: Page) {
  const heroVisual =
    page.heroVisual === "alignment" && page.alignmentLabels
      ? renderAlignmentVisual(page)
      : page.key !== "home"
        ? renderTopicVisual(page)
        : "";

  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="kicker">${page.kicker}</p>
        <h1>${page.title}</h1>
        <p class="summary">${page.summary}</p>
      ${
        page.heroPoints
          ? `<ul class="hero-points">${page.heroPoints.map((point) => `<li>${point}</li>`).join("")}</ul>`
          : ""
      }
      </div>
      ${heroVisual}
    </section>
  `;
}

function renderMarkdownSections(html: string) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const sections: string[] = [];
  let current: HTMLElement | null = null;

  for (const child of Array.from(wrapper.children)) {
    if (child.tagName === "H2" || current === null) {
      if (current) {
        sections.push(current.outerHTML);
      }
      current = document.createElement("section");
      current.className = "content-section";
    }
    current.appendChild(child);
  }

  if (current) {
    sections.push(current.outerHTML);
  }

  return sections.join("");
}

function renderOverviewGallery(lang: Lang) {
  const labels = {
    en: {
      sectionEyebrow: "Current working manuscripts",
      sectionTitle: "Article infographics",
      sectionCopy: "Each card shows the English infographic generated for the corresponding working draft.",
      englishImage: "English infographic",
      readArticle: "Read article",
      missingImage: "Image unavailable",
    },
    zh: {
      sectionEyebrow: "当前工作稿",
      sectionTitle: "文章图版索引",
      sectionCopy: "每张卡片对应一篇当前工作稿，并展示对应的中文 infographic 图版。",
      chineseImage: "中文图版",
      readArticle: "阅读文章",
      missingImage: "图片暂缺",
    },
  }[lang];

  const cards = infographicArticles
    .map((article, index) => {
      const title = lang === "zh" ? article.zhTitle : article.enTitle;
      const titleLang: ImageLang = lang === "zh" ? "zh" : "en";
      const src = infographicImageUrl(article, titleLang);
      const imageLabel = titleLang === "zh" ? labels.chineseImage : labels.englishImage;

      return `
        <article class="overview-card">
          <div class="overview-card-heading">
            <p>${String(index + 1).padStart(2, "0")}</p>
            <h2>${renderArticleLink(article, titleLang, title)}</h2>
          </div>
          <a class="overview-image-panel" href="${articleUrl(article, titleLang)}" target="_blank" rel="noreferrer" aria-label="${imageLabel}: ${title}">
            <span>${imageLabel}</span>
            ${
              src
                ? `<img src="${src}" alt="${imageLabel}: ${title}" loading="lazy" />`
                : `<div class="overview-image-missing">${labels.missingImage}</div>`
            }
          </a>
          <div class="overview-card-actions">
            ${renderArticleLink(article, titleLang, labels.readArticle, "solid-button")}
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="overview-section">
      <div class="overview-section-heading">
        <p class="section-eyebrow">${labels.sectionEyebrow}</p>
        <h2>${labels.sectionTitle}</h2>
        <p>${labels.sectionCopy}</p>
      </div>
      <div class="overview-grid">
        ${cards}
      </div>
    </section>
  `;
}

function render() {
  const route = normalizePath(withoutBase(window.location.pathname));
  const site = content[route.lang];
  const page = site.pages[route.key];
  const pageBody = page.key === "overview" ? renderOverviewGallery(route.lang) : renderMarkdownSections(page.html);
  document.documentElement.lang = route.lang;
  document.title = `${page.title} | Against LLM Mediocrity`;
  const pageShellClass = `page-shell${page.key === "glossary" ? " page-shell--glossary" : ""}`;
  appRoot.innerHTML = `
    ${renderNav(route.lang, page)}
    <main>
      ${renderHero(page)}
      <div class="${pageShellClass}">
        ${pageBody}
      </div>
    </main>
    <footer class="footer">
      <p>${site.footer}</p>
      <p>${link(site.repoUrl, "github.com/wxy2ab/against-llm-mediocrity")}</p>
    </footer>
  `;
}

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  const anchor = target?.closest<HTMLAnchorElement>("a[data-route]");
  if (!anchor) return;
  event.preventDefault();
  routeTo(anchor.dataset.route ?? "/");
});

window.addEventListener("popstate", render);

render();
