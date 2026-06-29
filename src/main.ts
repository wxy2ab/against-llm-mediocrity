import "./styles.css";
import {
  alternatePath,
  content,
  normalizePath,
  navOrder,
  pagePath,
  type AlignmentLabels,
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

function renderAlignmentVisual(visualLabels: AlignmentLabels) {
  return `
    <figure class="system-visual" aria-label="Probability and task value alignment diagram">
      <div class="legend">
        <span class="probability-line">${visualLabels.probability}</span>
        <span class="value-line">${visualLabels.value}</span>
      </div>
      <div class="alignment-panels">
        <article class="alignment-card is-extraordinary">
          <svg viewBox="0 0 220 120" role="img" aria-label="${visualLabels.aligned}">
            <path class="axis" d="M18 102H204" />
            <path class="curve probability" d="M20 96 C52 86 78 44 108 27 C138 44 164 86 202 96" />
            <path class="curve value" d="M22 99 C54 88 80 48 108 30 C139 47 166 88 202 99" />
          </svg>
          <h3>${visualLabels.extraordinary}</h3>
          <p>${visualLabels.aligned}</p>
        </article>
        <article class="alignment-card is-mediocre">
          <svg viewBox="0 0 220 120" role="img" aria-label="${visualLabels.misaligned}">
            <path class="axis" d="M18 102H204" />
            <path class="curve probability" d="M20 96 C44 70 64 28 92 23 C122 28 144 72 164 96" />
            <path class="curve value" d="M72 98 C102 90 132 60 158 31 C178 49 190 78 202 96" />
          </svg>
          <h3>${visualLabels.mediocre}</h3>
          <p>${visualLabels.misaligned}</p>
        </article>
        <article class="alignment-card is-local">
          <svg viewBox="0 0 220 120" role="img" aria-label="${visualLabels.partial}">
            <path class="axis" d="M18 102H204" />
            <path class="curve probability" d="M20 96 C42 82 52 50 76 41 C98 34 116 54 132 68 C150 83 174 87 202 96" />
            <path class="curve value" d="M20 98 C42 84 54 53 76 42 C100 31 116 55 132 73 C152 48 178 36 202 29" />
            <rect class="aligned-zone" x="45" y="22" width="72" height="86" />
          </svg>
          <h3>${visualLabels.local}</h3>
          <p>${visualLabels.partial}</p>
        </article>
      </div>
    </figure>
  `;
}

function renderTopicVisual(page: Page) {
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
            tags: ["概率与价值", "四类失配", "控制空间"],
          };
        case "engineering":
          return {
            label: "治理层",
            tags: ["中间对象", "验证循环", "GKO / GEO"],
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
            label: "研究图版",
            tags: ["结构", "约束", "验证"],
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
          tags: ["Intermediate objects", "Validation loop", "GKO / GEO"],
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
          label: "Research Diagram",
          tags: ["Structure", "Constraints", "Validation"],
        };
    }
  })();

  const visual = (() => {
    switch (page.key) {
      case "science":
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <circle class="visual-ring ring-a" cx="170" cy="208" r="118" />
            <circle class="visual-ring ring-b" cx="170" cy="208" r="78" />
            <circle class="visual-ring ring-c" cx="170" cy="208" r="36" />
            <circle class="visual-dot warm" cx="170" cy="208" r="12" />
            <path class="visual-track" d="M78 274 C120 236, 154 206, 194 170 S290 122, 350 146 S428 214, 446 244" />
            <path class="visual-track accent" d="M90 294 C140 248, 186 226, 238 188 S330 148, 388 164 S440 220, 454 260" />
            <circle class="visual-node warm" cx="92" cy="292" r="13" />
            <circle class="visual-node cool" cx="238" cy="188" r="15" />
            <circle class="visual-node gold" cx="454" cy="260" r="18" />
            <rect class="visual-card" x="306" y="86" width="140" height="70" rx="18" />
            <rect class="visual-chip" x="326" y="106" width="58" height="12" rx="6" />
            <rect class="visual-chip chip-alt" x="326" y="128" width="90" height="12" rx="6" />
            <rect class="visual-card" x="286" y="272" width="168" height="84" rx="22" />
            <circle class="visual-dot cool" cx="320" cy="314" r="16" />
            <path class="visual-mini" d="M350 328 L382 296 L414 310 L440 286" />
            <path class="visual-mini faint" d="M350 304 L374 318 L404 284 L440 300" />
          </svg>
        `;
      case "framework":
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <circle class="visual-hub" cx="260" cy="210" r="74" />
            <circle class="visual-node warm" cx="150" cy="122" r="28" />
            <circle class="visual-node cool" cx="370" cy="122" r="28" />
            <circle class="visual-node gold" cx="150" cy="300" r="28" />
            <circle class="visual-node dark" cx="370" cy="300" r="28" />
            <path class="visual-link" d="M172 138 L214 172" />
            <path class="visual-link" d="M348 138 L306 172" />
            <path class="visual-link" d="M172 284 L214 248" />
            <path class="visual-link" d="M348 284 L306 248" />
            <path class="visual-orbit" d="M106 210 C106 118, 180 64, 260 64 C340 64, 414 118, 414 210 C414 302, 340 356, 260 356 C180 356, 106 302, 106 210 Z" />
            <path class="visual-track" d="M88 252 C142 220, 178 152, 236 124 C292 98, 356 118, 432 182" />
            <path class="visual-track accent" d="M100 286 C156 250, 210 216, 268 212 C334 208, 388 230, 432 252" />
          </svg>
        `;
      case "engineering":
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <rect class="visual-stage" x="58" y="90" width="116" height="78" rx="20" />
            <rect class="visual-stage" x="202" y="90" width="116" height="78" rx="20" />
            <rect class="visual-stage" x="346" y="90" width="116" height="78" rx="20" />
            <path class="visual-arrow" d="M174 129 H202" />
            <path class="visual-arrow" d="M318 129 H346" />
            <rect class="visual-panel" x="88" y="238" width="344" height="112" rx="24" />
            <rect class="visual-card" x="116" y="260" width="90" height="68" rx="16" />
            <rect class="visual-card accent" x="216" y="246" width="100" height="82" rx="16" />
            <rect class="visual-card" x="326" y="260" width="78" height="68" rx="16" />
            <path class="visual-stack" d="M132 286 H190 M232 274 H300 M232 294 H288 M342 286 H388" />
            <circle class="visual-dot warm" cx="264" cy="224" r="20" />
            <path class="visual-link faint" d="M264 204 V170" />
          </svg>
        `;
      case "collaboration":
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <circle class="visual-node dark" cx="124" cy="156" r="44" />
            <circle class="visual-node warm" cx="396" cy="156" r="44" />
            <rect class="visual-hub hub-rect" x="198" y="118" width="124" height="78" rx="24" />
            <path class="visual-link" d="M168 156 H198" />
            <path class="visual-link" d="M322 156 H352" />
            <path class="visual-link faint" d="M124 200 C140 252, 180 292, 260 318" />
            <path class="visual-link faint" d="M396 200 C380 252, 340 292, 260 318" />
            <rect class="visual-panel" x="134" y="286" width="252" height="78" rx="22" />
            <circle class="visual-dot cool" cx="194" cy="325" r="18" />
            <circle class="visual-dot gold" cx="260" cy="325" r="18" />
            <circle class="visual-dot warm" cx="326" cy="325" r="18" />
            <path class="visual-arrow" d="M214 325 H240" />
            <path class="visual-arrow" d="M280 325 H306" />
          </svg>
        `;
      case "learning":
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <path class="visual-stairs" d="M88 314 H168 V258 H246 V202 H324 V146 H408" />
            <circle class="visual-node warm" cx="126" cy="314" r="20" />
            <circle class="visual-node gold" cx="206" cy="258" r="20" />
            <circle class="visual-node cool" cx="284" cy="202" r="20" />
            <circle class="visual-node dark" cx="362" cy="146" r="20" />
            <path class="visual-track accent" d="M108 118 C174 74, 248 78, 316 116 C364 142, 398 190, 414 248" />
            <path class="visual-arrow loop" d="M414 248 C422 292, 398 328, 354 338" />
            <rect class="visual-card" x="86" y="82" width="122" height="42" rx="18" />
            <rect class="visual-card accent" x="228" y="74" width="112" height="42" rx="18" />
          </svg>
        `;
      case "papers":
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <rect class="visual-paper shadow-paper" x="124" y="96" width="206" height="152" rx="18" transform="rotate(-6 227 172)" />
            <rect class="visual-paper" x="162" y="110" width="206" height="152" rx="18" />
            <rect class="visual-paper accent-paper" x="198" y="134" width="206" height="152" rx="18" transform="rotate(6 301 210)" />
            <path class="visual-stack" d="M192 146 H318 M192 170 H334 M192 194 H304 M226 236 H352" />
            <circle class="visual-node cool" cx="122" cy="302" r="18" />
            <circle class="visual-node gold" cx="260" cy="328" r="18" />
            <circle class="visual-node warm" cx="398" cy="302" r="18" />
            <path class="visual-link" d="M140 304 H242" />
            <path class="visual-link" d="M278 328 H380" />
          </svg>
        `;
      case "projects":
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <rect class="visual-panel" x="70" y="86" width="380" height="248" rx="28" />
            <rect class="visual-card" x="96" y="114" width="144" height="88" rx="18" />
            <rect class="visual-card accent" x="258" y="114" width="166" height="88" rx="18" />
            <rect class="visual-card" x="96" y="220" width="100" height="88" rx="18" />
            <rect class="visual-card" x="214" y="220" width="96" height="88" rx="18" />
            <rect class="visual-card accent" x="328" y="220" width="96" height="88" rx="18" />
            <path class="visual-mini" d="M116 168 L144 144 L168 156 L204 132" />
            <path class="visual-stack" d="M278 142 H388 M278 164 H366 M112 250 H180 M228 250 H292 M342 250 H406" />
            <circle class="visual-dot gold" cx="392" cy="92" r="22" />
            <path class="visual-link faint" d="M392 114 V146" />
          </svg>
        `;
      default:
        return `
          <svg viewBox="0 0 520 420" role="img" aria-label="${page.title}">
            <rect class="visual-bg" x="18" y="18" width="484" height="384" rx="28" />
            <path class="visual-track" d="M78 286 C140 220, 210 136, 302 142 C362 146, 410 196, 442 258" />
            <circle class="visual-node warm" cx="108" cy="284" r="18" />
            <circle class="visual-node cool" cx="286" cy="144" r="18" />
            <circle class="visual-node gold" cx="442" cy="258" r="18" />
          </svg>
        `;
    }
  })();

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
      ? renderAlignmentVisual(page.alignmentLabels)
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
      sectionCopy: "Each card pairs the English and Chinese infographic generated for the corresponding working draft.",
      englishImage: "English infographic",
      chineseImage: "中文图版",
      readEnglish: "Read English",
      readChinese: "阅读中文",
      missingImage: "Image unavailable",
    },
    zh: {
      sectionEyebrow: "当前工作稿",
      sectionTitle: "文章图版索引",
      sectionCopy: "每张卡片对应一篇当前工作稿，并同时展示英文与中文 infographic 图版。",
      englishImage: "English infographic",
      chineseImage: "中文图版",
      readEnglish: "Read English",
      readChinese: "阅读中文",
      missingImage: "图片暂缺",
    },
  }[lang];

  const cards = infographicArticles
    .map((article, index) => {
      const title = lang === "zh" ? article.zhTitle : article.enTitle;
      const titleLang: ImageLang = lang === "zh" ? "zh" : "en";
      const panels = (["en", "zh"] as const)
        .map((imageLang) => {
          const src = infographicImageUrl(article, imageLang);
          const imageLabel = imageLang === "zh" ? labels.chineseImage : labels.englishImage;
          const altTitle = imageLang === "zh" ? article.zhTitle : article.enTitle;

          return `
            <a class="overview-image-panel" href="${articleUrl(article, imageLang)}" target="_blank" rel="noreferrer" aria-label="${imageLabel}: ${altTitle}">
              <span>${imageLabel}</span>
              ${
                src
                  ? `<img src="${src}" alt="${imageLabel}: ${altTitle}" loading="lazy" />`
                  : `<div class="overview-image-missing">${labels.missingImage}</div>`
              }
            </a>
          `;
        })
        .join("");

      return `
        <article class="overview-card">
          <div class="overview-card-heading">
            <p>${String(index + 1).padStart(2, "0")}</p>
            <h2>${renderArticleLink(article, titleLang, title)}</h2>
          </div>
          <div class="overview-image-pair">
            ${panels}
          </div>
          <div class="overview-card-actions">
            ${renderArticleLink(article, "en", labels.readEnglish, "ghost-button")}
            ${renderArticleLink(article, "zh", labels.readChinese, "solid-button")}
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
  appRoot.innerHTML = `
    ${renderNav(route.lang, page)}
    <main>
      ${renderHero(page)}
      <div class="page-shell">
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
