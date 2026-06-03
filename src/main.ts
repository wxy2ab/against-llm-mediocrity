import "./styles.css";
import { alternatePath, content, normalizePath, navOrder, pagePath, type Lang, type Page } from "./content";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

const appRoot = app;

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

function renderNav(lang: Lang, current: Page) {
  const site = content[lang];
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
        ${link(alternatePath(lang, current.key), site.switchLabel, "ghost-button")}
        ${link(site.repoUrl, site.repoLabel, "solid-button")}
      </div>
    </header>
  `;
}

function renderHero(page: Page, lang: Lang) {
  const visualLabels =
    lang === "en"
      ? {
          probability: "statistical probability",
          value: "task value",
          extraordinary: "Autoregressive extraordinary",
          mediocre: "Autoregressive mediocrity",
          local: "Local alignment",
          aligned: "probability and value rise together",
          misaligned: "probability peak misses value peak",
          partial: "some regions align, others diverge",
        }
      : {
          probability: "统计概率",
          value: "任务价值",
          extraordinary: "自回归卓越",
          mediocre: "自回归平庸",
          local: "局部对齐",
          aligned: "概率与价值同向",
          misaligned: "概率峰值偏离价值峰值",
          partial: "部分同向，部分背离",
        };

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
    </section>
  `;
}

function renderSection(section: Page["sections"][number]) {
  return `
    <section class="content-section">
      ${section.eyebrow ? `<p class="section-eyebrow">${section.eyebrow}</p>` : ""}
      <h2>${section.title}</h2>
      ${section.body ? `<p>${section.body}</p>` : ""}
      ${
        section.bullets
          ? `<ul class="bullet-list">${section.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`
          : ""
      }
      ${
        section.cards
          ? `<div class="card-grid">${section.cards
              .map(
                (card) => `
                  <article class="info-card">
                    ${card.tag ? `<span>${card.tag}</span>` : ""}
                    <h3>${card.title}</h3>
                    <p>${card.body}</p>
                  </article>
                `,
              )
              .join("")}</div>`
          : ""
      }
    </section>
  `;
}

function render() {
  const route = normalizePath(withoutBase(window.location.pathname));
  const site = content[route.lang];
  const page = site.pages[route.key];
  document.documentElement.lang = route.lang;
  document.title = `${page.title} | Against LLM Mediocrity`;
  appRoot.innerHTML = `
    ${renderNav(route.lang, page)}
    <main>
      ${renderHero(page, route.lang)}
      <div class="page-shell">
        ${page.sections.map(renderSection).join("")}
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
