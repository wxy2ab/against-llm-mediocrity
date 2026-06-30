import { content, type LabContent } from "./content";
import { createStore, initialState, type Store } from "./state";
import { applyDocumentLang, persistLang, resolveLang } from "./i18n";
import { prefersReducedMotion, supportsWebGL } from "./dom";
import {
  MISMATCH_ORDER,
  type AppContext,
  type AppState,
  type Lang,
  type MismatchId,
  type Regime,
  type SamplingCause,
  type SectionId,
} from "./types";
import { fallbackSVG } from "./fallback/static";
import { startHero } from "./hero";

export interface SectionFrame {
  stage: HTMLElement;
  overlay: HTMLElement;
  fallback: HTMLElement;
}

export interface ShellHandle {
  ctx: AppContext;
  store: Store;
  root: HTMLElement;
  frames: Record<SectionId, SectionFrame>;
  renderFallbacks(): void;
}

const SECTIONS: SectionId[] = ["pipeline", "sampling", "mismatch", "regimes", "governance"];
const REGIMES: Regime[] = ["mediocre", "local", "extraordinary"];
const SAMPLING_CAUSES: SamplingCause[] = ["support", "specification", "observation"];

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function mountShell(): ShellHandle {
  const rootEl = document.querySelector<HTMLElement>("#lab");
  if (!rootEl) throw new Error("Lab root #lab not found");
  const root: HTMLElement = rootEl;

  const lang = resolveLang();
  const store = createStore(initialState(lang));
  const ctx: AppContext = {
    lang,
    prefersReducedMotion: prefersReducedMotion(),
    supports3D: supportsWebGL(),
  };

  root.innerHTML = skeleton();
  const opt = <T extends Element>(sel: string): T | null => root.querySelector<T>(sel);
  const must = <T extends Element>(sel: string): T => {
    const node = root.querySelector<T>(sel);
    if (!node) throw new Error(`Missing ${sel}`);
    return node;
  };

  const frames = Object.fromEntries(
    SECTIONS.map((id) => [
      id,
      {
        stage: must<HTMLElement>(`[data-stage="${id}"]`),
        overlay: must<HTMLElement>(`[data-overlay="${id}"]`),
        fallback: must<HTMLElement>(`[data-fallback="${id}"]`),
      },
    ]),
  ) as Record<SectionId, SectionFrame>;

  // ---- painting -------------------------------------------------------------
  const c = (): LabContent => content(store.get().lang);

  function paintHeader(): void {
    const t = c();
    must("[data-i18n='brand']").textContent = t.header.brand;
    must("[data-i18n='switch']").textContent = t.header.switchLabel;
    must("[data-i18n='status']").textContent = t.header.status;
    must("[data-nav]").innerHTML = SECTIONS.map(
      (id) => `<a href="#sec-${id}">${esc(t.header.nav[id])}</a>`,
    ).join("");
  }

  function paintIntro(): void {
    const t = c();
    must("[data-intro]").innerHTML = `
      <p class="eyebrow">${esc(t.hero.eyebrow)}</p>
      <h1>${t.hero.title}</h1>
      <p class="intro-copy">${esc(t.hero.copy)}</p>
      <div class="intro-actions">
        <a class="primary" href="#sec-pipeline">${esc(t.hero.cta)} <span>↓</span></a>
        <span class="legend"><i class="sw-prob"></i>${esc(t.legend.prob)} <i class="sw-value"></i>${esc(t.legend.value)}</span>
      </div>`;
  }

  function paintHead(id: SectionId): void {
    const t = c();
    const s = t[id];
    must(`[data-head="${id}"]`).innerHTML = `
      <p class="eyebrow">${esc(s.eyebrow)}</p>
      <h2>${s.title}</h2>
      <p class="section-copy">${esc(s.copy)}</p>`;
  }

  function paintPanel(id: SectionId): void {
    must(`[data-panel="${id}"]`).innerHTML = panelHTML(id, c(), store.get());
  }

  function paintFooter(): void {
    const t = c();
    must("[data-footer]").innerHTML = `
      <b>${esc(t.footer.brand)}</b>
      <span>${esc(t.footer.tagline)}</span>
      <a href="./">${esc(t.footer.home)} ↗</a>`;
  }

  function paintAll(): void {
    paintHeader();
    paintIntro();
    paintFooter();
    for (const id of SECTIONS) {
      paintHead(id);
      paintPanel(id);
    }
  }

  // ---- sync control state into the (already painted) DOM --------------------
  function sync(): void {
    const s = store.get();
    const setVal = (sel: string, v: number) => {
      const eln = opt<HTMLInputElement>(sel);
      if (eln) eln.value = String(v);
    };
    const press = (sel: string, on: boolean) => {
      const eln = opt<HTMLElement>(sel);
      if (eln) eln.classList.toggle("on", on);
    };
    const meter = (sel: string, pct: number) => {
      const eln = opt<HTMLElement>(sel);
      if (eln) eln.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    };

    // active tabs
    root.querySelectorAll<HTMLElement>("[data-mismatch]").forEach((b) =>
      b.classList.toggle("active", b.dataset.mismatch === s.activeMismatch),
    );
    root.querySelectorAll<HTMLElement>("[data-regime]").forEach((b) =>
      b.classList.toggle("active", b.dataset.regime === s.regime),
    );
    root.querySelectorAll<HTMLElement>("[data-method]").forEach((b) =>
      b.classList.toggle("active", Number(b.dataset.method) === s.governanceMethod),
    );

    // pipeline
    press("[data-action='governed']", s.governed);

    // sampling
    setVal("[data-action='train']", s.samplingTrain);
    const cs = opt<HTMLSelectElement>("[data-action='cause']");
    if (cs) cs.value = s.samplingCause;
    const ce = opt<HTMLElement>("[data-cause-expl]");
    if (ce) ce.textContent = content(s.lang).sampling.causeExpl[s.samplingCause];
    meter("[data-meter='closeable']", s.samplingTrain * 0.65);
    meter("[data-meter='truevalue']", 18 + s.samplingTrain * 0.3);

    // mismatch scene-local controls
    press("[data-action='keep-variable']", s.keepVariable);
    press("[data-action='evidence']", s.evidence);
    press("[data-action='ladder']", s.ladder);
    press("[data-action='constraint']", s.constraint);
    press("[data-action='counterexample']", s.counterexample);
    setVal("[data-action='routing']", s.routing);
    setVal("[data-action='budget']", s.budget);
    setVal("[data-action='polish']", s.polish);
    setVal("[data-action='optimizeProxy']", s.optimizeProxy);
    const st = opt<HTMLElement>("[data-action='state-toggle'] span");
    if (st) st.textContent = s.trueState ? "S₂" : "S₁";

    // governance
    press("[data-action='gov-toggle']", s.governanceOn);
  }

  function applyLang(): void {
    const lng = store.get().lang;
    persistLang(lng);
    applyDocumentLang(lng, content(lng).meta.title);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", content(lng).meta.description);
    paintAll();
    sync();
    if (fallbackActive) renderFallbacks();
  }

  // ---- events (delegated once on root) -------------------------------------
  root.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!target) return;
    const a = target.dataset.action!;
    const s = store.get();
    switch (a) {
      case "lang":
        store.set({ lang: s.lang === "zh" ? "en" : "zh" });
        break;
      case "release":
        store.set({ releaseNonce: s.releaseNonce + 1 });
        break;
      case "governed":
        store.set({ governed: !s.governed });
        break;
      case "sample":
        store.set({ sampleNonce: s.sampleNonce + 1 });
        break;
      case "burst":
        store.set({ burstNonce: s.burstNonce + 1 });
        break;
      case "sampling-reset":
        store.set({
          samplingTrain: 0,
          samplingResetNonce: s.samplingResetNonce + 1,
        });
        break;
      case "mismatch":
        store.set({ activeMismatch: target.dataset.mismatch as MismatchId });
        break;
      case "regime":
        store.set({ regime: target.dataset.regime as Regime });
        break;
      case "method":
        store.set({ governanceMethod: Number(target.dataset.method) });
        break;
      case "gov-toggle":
        store.set({ governanceOn: !s.governanceOn });
        break;
      case "invoke":
        store.set({ invokeNonce: s.invokeNonce + 1 });
        break;
      case "state-toggle":
        store.set({ trueState: s.trueState ? 0 : 1 });
        break;
      case "keep-variable":
        store.set({ keepVariable: !s.keepVariable });
        break;
      case "evidence":
        store.set({ evidence: !s.evidence });
        break;
      case "ladder":
        store.set({ ladder: !s.ladder });
        break;
      case "constraint":
        store.set({ constraint: !s.constraint });
        break;
      case "counterexample":
        store.set({ counterexample: !s.counterexample });
        break;
    }
  });

  const onRange = (e: Event) => {
    const target = (e.target as HTMLElement).closest<HTMLInputElement>("[data-action]");
    if (!target) return;
    const v = Number(target.value);
    switch (target.dataset.action) {
      case "train":
        store.set({ samplingTrain: v });
        break;
      case "routing":
        store.set({ routing: v });
        break;
      case "budget":
        store.set({ budget: v });
        break;
      case "polish":
        store.set({ polish: v });
        break;
      case "optimizeProxy":
        store.set({ optimizeProxy: v });
        break;
    }
  };
  root.addEventListener("input", onRange);

  root.addEventListener("change", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLSelectElement>("[data-action='cause']");
    if (!target) return;
    store.set({ samplingCause: target.value as SamplingCause });
  });

  // ---- store → DOM ----------------------------------------------------------
  store.subscribe((s, prev) => {
    if (s.lang !== prev.lang) {
      applyLang();
      return;
    }
    if (s.activeMismatch !== prev.activeMismatch) paintPanel("mismatch");
    if (s.regime !== prev.regime) paintPanel("regimes");
    if (s.governanceMethod !== prev.governanceMethod) paintPanel("governance");
    sync();
  });

  // ---- fallback (no WebGL / reduced motion) --------------------------------
  let fallbackActive = false;
  function renderFallbacks(): void {
    fallbackActive = true;
    root.classList.add("is-fallback");
    const t = c();
    for (const id of SECTIONS) {
      const f = frames[id].fallback;
      f.hidden = false;
      f.innerHTML = fallbackSVG(id, t, store.get());
    }
    const note = opt<HTMLElement>("[data-fallback-note]");
    if (note) {
      note.textContent = t.fallbackNote;
      note.hidden = false;
    }
  }

  // initial paint
  applyDocumentLang(lang, content(lang).meta.title);
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", content(lang).meta.description);
  paintAll();
  sync();

  // hero animation (pure Canvas 2D — always displays, independent of WebGL)
  const heroCanvas = opt<HTMLCanvasElement>("[data-hero-canvas]");
  if (heroCanvas) startHero(heroCanvas, ctx.prefersReducedMotion);

  return { ctx, store, root, frames, renderFallbacks };
}

// ============================================================================
// Markup builders
// ============================================================================

function skeleton(): string {
  return `
  <header class="lab-header">
    <a class="lab-brand" href="./"><span class="brand-dot"></span><span data-i18n="brand"></span></a>
    <nav data-nav></nav>
    <div class="header-tools">
      <button data-action="lang" data-i18n="switch"></button>
      <span class="status-pill"><i></i><span data-i18n="status"></span></span>
    </div>
  </header>
  <p class="fallback-note" data-fallback-note hidden></p>
  <main>
    <section class="intro">
      <div class="intro-text" data-intro></div>
      <div class="hero-visual" aria-hidden="true"><canvas class="hero-canvas" data-hero-canvas></canvas></div>
    </section>
    ${SECTIONS.map(sectionSkeleton).join("")}
  </main>
  <footer class="lab-footer" data-footer></footer>`;
}

function sectionSkeleton(id: SectionId): string {
  return `
  <section class="scene-section" id="sec-${id}" data-section="${id}">
    <div class="section-head" data-head="${id}"></div>
    <div class="scene-frame">
      <div class="scene-stage" data-stage="${id}"></div>
      <div class="scene-overlay" data-overlay="${id}"></div>
      <div class="scene-fallback" data-fallback="${id}" hidden></div>
    </div>
    <div class="scene-panel" data-panel="${id}"></div>
  </section>`;
}

function legendChips(t: LabContent): string {
  return `<div class="legend-row">
    <span class="legend"><i class="sw-prob"></i>${esc(t.legend.prob)}</span>
    <span class="legend"><i class="sw-value"></i>${esc(t.legend.value)}</span>
  </div>`;
}

function panelHTML(id: SectionId, t: LabContent, s: AppState): string {
  switch (id) {
    case "pipeline":
      return `
        ${legendChips(t)}
        <div class="control-row">
          <button class="primary" data-action="release">${esc(t.pipeline.release)} ▸</button>
          <button class="toggle" data-action="governed"><span class="dot"></span>${esc(t.pipeline.governedOff)} / ${esc(t.pipeline.governedOn)}</button>
        </div>
        <p class="aha">${esc(t.pipeline.aha)}</p>`;

    case "sampling": {
      const sm = t.sampling;
      return `
        <div class="theater-legend">
          <span class="tl tl-value"><i></i>${esc(sm.expected)}</span>
          <span class="tl tl-prob"><i></i>${esc(sm.actual)}</span>
          <span class="tl tl-prob soft"><i></i>${esc(sm.repeated)}</span>
          <span class="tl tl-hot"><i></i>${esc(sm.closeable)}</span>
          <span class="tl tl-wall"><i></i>${esc(sm.irreducible)}</span>
        </div>
        <div class="control-row">
          <button class="primary" data-action="sample">${esc(sm.sample)}</button>
          <button data-action="burst">${esc(sm.burst)}</button>
          <button data-action="sampling-reset">${esc(sm.reset)}</button>
        </div>
        <label class="slider-row"><span>${esc(sm.train)}</span>
          <input type="range" min="0" max="100" value="${s.samplingTrain}" data-action="train" />
        </label>
        <label class="select-row"><span>${esc(sm.causeLabel)}</span>
          <select data-action="cause">
            ${SAMPLING_CAUSES.map((k) => `<option value="${k}">${esc(sm.causes[k])}</option>`).join("")}
          </select>
        </label>
        <p class="cause-expl" data-cause-expl>${esc(sm.causeExpl[s.samplingCause])}</p>
        <div class="meters">
          <div><span>${esc(sm.closeableMeter)}</span><div class="meter hot"><i data-meter="closeable"></i></div></div>
          <div><span>${esc(sm.trueValueMeter)}</span><div class="meter value"><i data-meter="truevalue"></i></div></div>
        </div>
        <p class="aha">${esc(sm.aha)}</p>`;
    }

    case "mismatch": {
      const mm = t.mismatch;
      const item = mm.items[s.activeMismatch];
      const tabs = MISMATCH_ORDER.map((k) => {
        const it = mm.items[k];
        return `<button data-action="mismatch" data-mismatch="${k}"><span>${it.index}</span><b>${esc(it.name)}</b></button>`;
      }).join("");
      return `
        <div class="mismatch-tabs">${tabs}</div>
        <article class="mismatch-detail">
          <div class="mm-title"><span class="mm-index">${item.index}</span>
            <div><h3>${esc(item.name)}</h3><code>${esc(item.station)}</code></div></div>
          <div class="mm-field"><span>${esc(mm.questionLabel)}</span><p>${esc(item.question)}</p></div>
          <div class="mm-field"><span>${esc(mm.definitionLabel)}</span><p>${esc(item.definition)}</p></div>
          <div class="mm-field"><span>${esc(mm.symptomLabel)}</span><p>${esc(item.symptom)}</p></div>
          <div class="mm-field repair"><span>${esc(mm.repairLabel)}</span><p>${esc(item.repair)}</p></div>
          <div class="mm-controls">${mismatchControls(s.activeMismatch, s.lang)}</div>
          <p class="aha">${esc(item.aha)}</p>
        </article>`;
    }

    case "regimes": {
      const rg = t.regimes;
      const item = rg.items[s.regime];
      const tabs = REGIMES.map(
        (k) =>
          `<button data-action="regime" data-regime="${k}" class="regime-tab rt-${k}"><span>${esc(rg.items[k].name)}</span><small>${esc(rg.items[k].tag)}</small></button>`,
      ).join("");
      return `
        <div class="regime-tabs">${tabs}</div>
        <article class="regime-detail rt-${s.regime}">
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.desc)}</p>
          <p class="insight">${esc(item.insight)}</p>
          <p class="boundary">${esc(rg.boundary)}</p>
        </article>`;
    }

    case "governance": {
      const gv = t.governance;
      const item = gv.methods[s.governanceMethod] ?? gv.methods[0];
      const tabs = gv.methods
        .map(
          (m, i) =>
            `<button data-action="method" data-method="${i}"><span>0${i + 1}</span><b>${esc(m.name)}</b></button>`,
        )
        .join("");
      const flow = gv.flow
        .map(
          (step, i) =>
            `<span class="flow-step">${esc(step)}</span>${i < gv.flow.length - 1 ? '<span class="flow-arrow">→</span>' : ""}`,
        )
        .join("");
      return `
        <div class="method-tabs">${tabs}</div>
        <article class="method-detail">
          <span class="method-tag">${esc(item.tag)}</span>
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.desc)}</p>
        </article>
        <div class="control-row">
          <button class="toggle" data-action="gov-toggle"><span class="dot"></span>${esc(gv.before)} / ${esc(gv.after)}</button>
        </div>
        <div class="flow-diagram">${flow}</div>
        <p class="aha">${esc(gv.aha)}</p>`;
    }
  }
}

function mismatchControls(id: MismatchId, lang: Lang): string {
  const L: Record<Lang, Record<string, string>> = {
    zh: {
      keep: "保留 V*",
      evidence: "判别证据",
      toggle: "切换真实状态",
      routing: "路由对齐",
      invoke: "显式调用",
      budget: "采样预算",
      ladder: "控制空间梯子",
      polish: "逐块打磨",
      constraint: "全局约束",
      proxy: "优化代理",
      counter: "反例",
    },
    en: {
      keep: "Keep V*",
      evidence: "Evidence",
      toggle: "Toggle true state",
      routing: "Routing",
      invoke: "Invoke",
      budget: "Budget",
      ladder: "Control ladder",
      polish: "Polish",
      constraint: "Global constraint",
      proxy: "Optimize proxy",
      counter: "Counterexample",
    },
  };
  const x = L[lang];
  const tog = (action: string, label: string) =>
    `<button class="toggle" data-action="${action}"><span class="dot"></span>${esc(label)}</button>`;
  const sld = (action: string, label: string, val: number) =>
    `<label class="slider-row sm"><span>${esc(label)}</span><input type="range" min="0" max="100" value="${val}" data-action="${action}"/></label>`;
  switch (id) {
    case "observation":
      return tog("keep-variable", x.keep);
    case "state":
      return `${tog("evidence", x.evidence)}<button class="toggle" data-action="state-toggle">${esc(x.toggle)} <span>S₁</span></button>`;
    case "fitting":
      return `${sld("routing", x.routing, 30)}${tog("invoke", x.invoke)}`;
    case "support":
      return `${sld("budget", x.budget, 35)}${tog("ladder", x.ladder)}`;
    case "aggregation":
      return `${sld("polish", x.polish, 0)}${tog("constraint", x.constraint)}`;
    case "specification":
      return `${sld("optimizeProxy", x.proxy, 0)}${tog("counterexample", x.counter)}`;
  }
}
