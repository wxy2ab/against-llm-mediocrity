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
      ? ["Default basin", "Control space", "Governed output"]
      : ["默认盆地", "控制空间", "治理输出"];

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
      <figure class="system-visual" aria-label="Task transformation diagram">
        <div class="visual-grid">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="path path-low"></div>
        <div class="path path-high"></div>
        <div class="node node-a">${visualLabels[0]}</div>
        <div class="node node-b">${visualLabels[1]}</div>
        <div class="node node-c">${visualLabels[2]}</div>
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
