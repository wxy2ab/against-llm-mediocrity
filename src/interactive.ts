import "./interactive.css";

type Lang = "zh" | "en";
type Regime = "mediocre" | "local" | "extraordinary";
type Mismatch = "aggregation" | "support" | "state" | "specification";

const lab = document.querySelector<HTMLDivElement>("#lab");
if (!lab) throw new Error("Lab root not found");
const app = lab;

const copy = {
  zh: {
    nav: ["路径实验", "四种失配", "如何转化"],
    switchLabel: "English",
    introEyebrow: "LLM MEDIOCRITY LAB / LLM 平庸实验室",
    introTitle: "模型不是一次写出答案。<br><em>它一步一步走向答案。</em>",
    introCopy: "问题在于：每一步最容易走的方向，是否也是最终最有价值的方向？亲手改变路径、训练与隐藏条件，观察概率和真实价值何时同行，何时分叉。",
    start: "开始路径实验",
    probability: "模型概率",
    value: "真实价值",
    orbit: ["流畅", "局部正确", "全局价值"],
    pathTitle: "同样是“下一个 token”，<br>会走向三种完全不同的结果",
    pathCopy: "点击生成，观察每一步的局部概率如何累积。切换对齐状态后，路径本身不再改变，但“容易走”与“值得走”的关系会改变。",
    current: "当前状态",
    next: "生成下一步",
    cumulativeProbability: "累积模型置信",
    cumulativeValue: "累积真实价值",
    mismatchTitle: "为什么继续训练，<br>也无法自动对齐？",
    mismatchCopy: "训练只能优化它能够看到、采到、标注和测量的信号。四种失配不是“模型还不够努力”，而是学习信号与真实价值之间缺了一座桥。",
    proxyScore: "训练可见分",
    trueValue: "真实价值",
    train: "继续训练",
    toggleState: "切换真实状态",
    reset: "重置实验",
    trap: "训练陷阱",
    irreducible: "无法仅靠训练消除的原因",
    intervention: "正确干预",
    transformTitle: "不是停止自回归，<br>而是改变它正在解决的问题",
    transformCopy: "保留模型已经擅长的局部生成，把失配部分转化成显式、可验证、低失配的中间对象。",
    flow: ["高失配输入", "直接生成最终答案", "流畅输出空间", "任务重参数化", "聚合", "依赖图 / 全局约束", "支持", "反例 / 检索 / 稀有结构", "状态", "情景矩阵 / 条件策略", "规格", "评分规约 / 对比偏好", "验证后渲染", "低失配子任务", "LLM卓越", "局部改进 → 全局价值"],
    footer: "从 LLM 平庸，经由局部对齐，走向LLM卓越。",
    home: "返回主页",
    high: "高",
    low: "低",
  },
  en: {
    nav: ["Path Experiment", "Four Mismatches", "Transformation"],
    switchLabel: "中文",
    introEyebrow: "LLM MEDIOCRITY LAB",
    introTitle: "A model does not write an answer at once.<br><em>It walks toward one token by token.</em>",
    introCopy: "The question is whether the easiest next step is also the most valuable one. Change the path, training, and hidden conditions to see when probability and true value travel together, and when they diverge.",
    start: "Start path experiment",
    probability: "Model probability",
    value: "True value",
    orbit: ["Fluent", "Locally correct", "Global value"],
    pathTitle: "The same “next token” process<br>can produce three different regimes",
    pathCopy: "Generate one step at a time and watch local probability accumulate. Switch regimes to change the relationship between what is easy to generate and what is valuable.",
    current: "Current regime",
    next: "Generate next step",
    cumulativeProbability: "Cumulative confidence",
    cumulativeValue: "Cumulative true value",
    mismatchTitle: "Why can more training<br>still fail to align?",
    mismatchCopy: "Training can optimize only signals it can observe, sample, label, and measure. These mismatches are not a lack of effort; they are missing bridges between learning signals and true value.",
    proxyScore: "Training-visible score",
    trueValue: "True value",
    train: "Continue training",
    toggleState: "Switch true state",
    reset: "Reset experiment",
    trap: "Training trap",
    irreducible: "Why training alone cannot eliminate it",
    intervention: "Correct intervention",
    transformTitle: "Do not stop autoregression.<br>Change the problem it is solving.",
    transformCopy: "Preserve locally aligned generation, then transform mismatched parts into explicit, verifiable, lower-mismatch intermediate objects.",
    flow: ["High-mismatch input", "Generate final answer directly", "Fluent output space", "Reparameterize task", "Aggregation", "Dependency graph / global constraints", "Support", "Counterexamples / retrieval / rare structures", "State", "Scenario matrix / conditional policy", "Specification", "Rubric / contrastive preferences", "Render after validation", "Low-mismatch subtasks", "Autoregressive extraordinary", "Local improvement → global value"],
    footer: "From LLM mediocrity through local alignment to autoregressive extraordinary.",
    home: "Back to home",
    high: "High",
    low: "Low",
  },
};

const regimes = {
  zh: {
    mediocre: ["LLM 平庸", "容易续写 ≠ 真正有价值", "四类失配会让模型稳定抵达流畅但价值密度不足的答案；其中聚合失配对应自回归平庸。", "局部概率持续上升，真实价值却没有随之累积。"],
    local: ["局部对齐", "局部有用，整体未必成功", "大多数局部选择确实有价值，但一个远距离依赖、隐藏状态或隐性标准会在后段改变结果。", "前半程概率与价值同向，越过边界后开始分叉。"],
    extraordinary: ["LLM卓越", "容易续写 = 更接近高价值", "当任务结构、表示方式和成功标准都适合模型时，每一个自然的下一步都会把整体推向更好的结果。", "局部改进能够组合成全局质量，自回归成为优势。"],
  },
  en: {
    mediocre: ["LLM mediocrity", "Easy to continue ≠ truly valuable", "The four mismatches can make the model reach smooth but low-density answers; autoregressive mediocrity is the aggregation-mismatch subcase.", "Local probability keeps rising while true value fails to accumulate."],
    local: ["Local alignment", "Locally useful, globally unstable", "Most local choices are valuable, but a long-range dependency, hidden state, or tacit criterion changes the result later.", "Probability and value move together early, then diverge past a boundary."],
    extraordinary: ["Autoregressive extraordinary", "Easy to continue = closer to high value", "When task structure, representation, and success criteria fit the model, each natural next step pushes the whole toward a better result.", "Local improvements compose into global quality; autoregression becomes an advantage."],
  },
} satisfies Record<Lang, Record<Regime, [string, string, string, string]>>;

const mismatches = {
  zh: {
    aggregation: ["01", "聚合失配", "每一步都更好，为什么整体仍然失败？", "训练能奖励每个局部的清晰、顺滑与正确，却看不到跨越全文的承诺、依赖和组合效果。", "若训练信号只评估局部片段，就不存在能指向全局组合关系的梯度。把局部奖励练到满分，也不能推出整体最优。", "外化全局结构：依赖图、长期约束、整体评分器。", "逐段都漂亮", "保留关键伏笔"],
    support: ["02", "支持失配", "答案存在，为什么采样再多也碰不到？", "真正高价值的结构位于模型几乎不访问的低支持区域；训练只会加强已经被采到、被标注过的候选。", "若高价值结构从未进入训练与搜索的支持区域，它就不会产生学习信号。零曝光乘以更多训练，仍然是零曝光。", "主动拉入尾部结构：检索、反常规搜索、反例与重组。", "常见合理答案", "罕见关键洞察"],
    state: ["03", "状态失配", "同一个回答，为什么此刻对、彼时错？", "真实价值取决于不可见或变化中的状态；输入相同，但最佳行动会随用户、环境或阶段翻转。", "没有状态信息时，同一输入对应相互冲突的最优标签。训练只能学到平均策略，无法同时为两个状态给出唯一正确答案。", "显式建模状态：情景矩阵、诊断问题、条件策略。", "立刻给方案", "先确认状态"],
    specification: ["04", "规格失配", "分数越来越高，为什么用户越来越不满意？", "模型优化的是可见代理目标，而真正价值包含未写出的品味、后果、边界或专家判断。", "训练只会更忠实地优化它收到的目标。若代理目标与真实目标排序相反，训练越成功，真实结果可能越差。", "外化价值函数：对比样例、失败条件、动态评分规约。", "高代理分答案", "高真实价值答案"],
  },
  en: {
    aggregation: ["01", "Aggregation mismatch", "Why does every better step still produce a failing whole?", "Training can reward clarity, fluency, and correctness in each part, yet cannot see commitments, dependencies, and composition across the whole artifact.", "If the training signal evaluates only local fragments, no gradient points toward the global relationship. Perfect local rewards cannot imply a global optimum.", "Externalize global structure: dependency graphs, long-range constraints, whole-artifact evaluators.", "Beautiful local sections", "Preserve the key setup"],
    support: ["02", "Support mismatch", "Why can the answer exist yet remain unreachable by more sampling?", "The truly valuable structure lies in a tail region the model almost never visits; training reinforces only candidates that were sampled and labeled.", "If a high-value structure never enters the support of training or search, it produces no learning signal. Zero exposure times more training is still zero exposure.", "Pull tail structures into context: retrieval, unconventional search, counterexamples, and recombination.", "Common reasonable answer", "Rare decisive insight"],
    state: ["03", "State mismatch", "Why is the same answer right now but wrong later?", "True value depends on invisible or changing state; with the same input, the best action flips across users, environments, or phases.", "Without state information, one input maps to conflicting optimal labels. Training can learn only an average policy, not one uniquely correct answer for both states.", "Model state explicitly: scenario matrices, diagnostic questions, and conditional policies.", "Give a solution now", "Diagnose the state first"],
    specification: ["04", "Specification mismatch", "Why does the score rise while the user becomes less satisfied?", "The model optimizes a visible proxy, while true value includes unstated taste, consequences, boundaries, or expert judgment.", "Training becomes more faithful to the objective it receives. If proxy and true value rank candidates differently, more successful training can make the real outcome worse.", "Externalize the value function: contrastive examples, disqualifying failures, and dynamic rubrics.", "High proxy-score answer", "High true-value answer"],
  },
} satisfies Record<Lang, Record<Mismatch, [string, string, string, string, string, string, string, string]>>;

let lang: Lang = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
let regime: Regime = "local";
let mismatch: Mismatch = "aggregation";
let step = 0;
let epochs = 0;
let actualState = 0;
let timer: number | undefined;

const q = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;

function renderApp() {
  const t = copy[lang];
  const f = t.flow;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = lang === "zh" ? "LLM 平庸实验室" : "LLM Mediocrity Lab";
  app.innerHTML = `
    <header class="lab-header"><a class="lab-brand" href="./"><span class="brand-dot"></span><span>Against LLM Mediocrity</span></a>
      <nav><a href="#trajectory">${t.nav[0]}</a><a href="#mismatch">${t.nav[1]}</a><a href="#transform">${t.nav[2]}</a></nav>
      <div class="header-tools"><button id="language-switch">${t.switchLabel}</button><span class="status-pill"><i></i> Interactive model</span></div>
    </header>
    <main>
      <section class="intro"><div><p class="eyebrow">${t.introEyebrow}</p><h1>${t.introTitle}</h1><p class="intro-copy">${t.introCopy}</p><div class="intro-actions"><a class="primary" href="#trajectory">${t.start} <span>↓</span></a><span class="legend"><i class="prob"></i>${t.probability} <i class="value"></i>${t.value}</span></div></div>
        <div class="hero-orbit" aria-hidden="true"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div><div class="orbit-core"><b>P</b><span>next token</span></div><span class="orbit-label label-a">${t.orbit[0]}</span><span class="orbit-label label-b">${t.orbit[1]}</span><span class="orbit-label label-c">${t.orbit[2]}</span></div>
      </section>
      <section class="trajectory section-shell" id="trajectory"><div class="section-heading"><div><p class="eyebrow"><b>01</b> / PATH</p><h2>${t.pathTitle}</h2></div><p>${t.pathCopy}</p></div>
        <div class="regime-tabs" role="tablist">${(Object.keys(regimes[lang]) as Regime[]).map(key => `<button data-regime="${key}"><span>${regimes[lang][key][0]}</span><small>${regimes[lang][key][1]}</small></button>`).join("")}</div>
        <div class="trajectory-stage"><div class="stage-top"><div><span class="stage-kicker">${t.current}</span><h3 id="regime-name"></h3><p id="regime-copy"></p></div><button class="generate-button" id="generate">${t.next} <kbd>→</kbd></button></div><svg id="path-svg" viewBox="0 0 1000 360" role="img"></svg>
          <div class="meters"><div><span>${t.cumulativeProbability}</span><b id="prob-score">0</b><div class="meter"><i id="prob-meter"></i></div></div><div><span>${t.cumulativeValue}</span><b id="value-score">0</b><div class="meter value"><i id="value-meter"></i></div></div><p id="regime-insight"></p></div></div>
      </section>
      <section class="mismatch section-shell" id="mismatch"><div class="section-heading"><div><p class="eyebrow"><b>02</b> / FOUR PRIMITIVE MISMATCHES</p><h2>${t.mismatchTitle}</h2></div><p>${t.mismatchCopy}</p></div>
        <div class="mismatch-layout"><aside class="mismatch-tabs">${(Object.keys(mismatches[lang]) as Mismatch[]).map(key => `<button data-mismatch="${key}"><span>${mismatches[lang][key][0]}</span><b>${mismatches[lang][key][1]}</b><i>↗</i></button>`).join("")}</aside>
          <article class="mismatch-lab"><div class="mismatch-title"><span id="mismatch-index"></span><div><h3 id="mismatch-name"></h3><p id="mismatch-question"></p></div></div>
            <div class="training-console"><div class="console-head"><span><i></i> ALIGNMENT TRAINING</span><b>epoch <output id="epoch">0</output></b></div><div class="candidate-grid">
              ${["a", "b"].map(x => `<div class="candidate candidate-${x}"><span>${x.toUpperCase()}</span><h4 id="candidate-${x}"></h4><div class="score-row">${t.proxyScore} <b id="${x}-proxy"></b></div><div class="score-track proxy"><i id="${x}-proxy-bar"></i></div><div class="score-row">${t.trueValue} <b id="${x}-true"></b></div><div class="score-track true"><i id="${x}-true-bar"></i></div></div>`).join("")}</div>
              <div class="console-actions"><button id="train">${t.train} <span>+10 epochs</span></button><button id="state-toggle">${t.toggleState} <span id="state-label">S₁</span></button><button id="reset">${t.reset}</button></div></div>
            <div class="diagnosis"><div><span>${t.trap}</span><p id="mismatch-trap"></p></div><div class="irreducible"><span>${t.irreducible}</span><p id="mismatch-irreducible"></p></div></div><div class="intervention"><span>${t.intervention}</span><b id="mismatch-intervention"></b></div>
          </article></div>
      </section>
      <section class="transform section-shell" id="transform"><div class="section-heading"><div><p class="eyebrow"><b>03</b> / TRANSFORMATION</p><h2>${t.transformTitle}</h2></div><p>${t.transformCopy}</p></div>
        <div class="transform-flow"><div class="flow-node bad"><span>${f[0]}</span><b>${f[1]}</b><small>${f[2]}</small></div><div class="flow-arrow"><i></i><span>${f[3]}</span></div><div class="flow-stack">${[[4,5],[6,7],[8,9],[10,11]].map(([a,b]) => `<div><span>${f[a]}</span><b>${f[b]}</b></div>`).join("")}</div><div class="flow-arrow"><i></i><span>${f[12]}</span></div><div class="flow-node good"><span>${f[13]}</span><b>${f[14]}</b><small>${f[15]}</small></div></div>
      </section>
    </main><footer><b>Against LLM Mediocrity</b><span>${t.footer}</span><a href="./">${t.home} ↗</a></footer>`;
  bindEvents();
  renderRegime();
  renderMismatch();
}

function curvePoints() {
  return { probability: [16, 30, 45, 60, 76, 91], value: { mediocre: [13, 20, 24, 28, 31, 34], local: [15, 29, 44, 54, 57, 62], extraordinary: [15, 31, 48, 65, 80, 96] }[regime] };
}

function renderPath() {
  const { probability, value } = curvePoints();
  const xs = [70, 240, 410, 580, 750, 920];
  const y = (v: number) => 310 - v * 2.55;
  const line = (arr: number[]) => arr.slice(0, step + 1).map((v, i) => `${xs[i]},${y(v)}`).join(" ");
  const branches = xs.slice(0, -1).map((x, i) => `<path class="ghost-branch" d="M${x},${y(probability[i])} Q${x + 80},${y(probability[i]) - 50} ${xs[i + 1]},${y(probability[i]) + 36}"/><circle class="ghost-node" cx="${xs[i + 1]}" cy="${y(probability[i]) + 36}" r="7"/>`).join("");
  const nodes = xs.slice(0, step + 1).map((x, i) => `<g class="path-node"><circle cx="${x}" cy="${y(probability[i])}" r="15"/><text x="${x}" y="${y(probability[i]) + 5}">${i + 1}</text></g>`).join("");
  q<SVGElement>("#path-svg").innerHTML = `<defs><linearGradient id="probGrad"><stop stop-color="#ff745c"/><stop offset="1" stop-color="#ffb45c"/></linearGradient><linearGradient id="valueGrad"><stop stop-color="#50d3b8"/><stop offset="1" stop-color="#a6e66e"/></linearGradient></defs><g class="grid">${[55,120,185,250,315].map(n=>`<path d="M40 ${n}H960"/>`).join("")}</g><text class="axis-label" x="42" y="32">${copy[lang].high}</text><text class="axis-label" x="42" y="338">${copy[lang].low}</text>${branches}<polyline class="path-line probability" points="${line(probability)}"/><polyline class="path-line value" points="${line(value)}"/>${nodes}`;
  const p = probability[step], v = value[step];
  q("#prob-score").textContent = String(p); q("#value-score").textContent = String(v);
  q<HTMLElement>("#prob-meter").style.width = `${p}%`; q<HTMLElement>("#value-meter").style.width = `${v}%`;
}

function renderRegime() {
  document.querySelectorAll<HTMLButtonElement>("[data-regime]").forEach(b => b.classList.toggle("active", b.dataset.regime === regime));
  q(".meters").className = `meters ${regime}`;
  const r = regimes[lang][regime]; q("#regime-name").textContent = r[0]; q("#regime-copy").textContent = r[2]; q("#regime-insight").textContent = r[3]; renderPath();
}

function scores() {
  const t = Math.min(epochs / 100, 1);
  if (mismatch === "aggregation") return { ap:62+35*t, at:43+3*t, bp:34+8*t, bt:90 };
  if (mismatch === "support") return { ap:70+27*t, at:48+4*t, bp:4, bt:98 };
  if (mismatch === "state") return actualState === 0 ? { ap:62+32*t, at:88, bp:46-12*t, bt:36 } : { ap:62+32*t, at:28, bp:46-12*t, bt:92 };
  return { ap:64+34*t, at:55-24*t, bp:38-15*t, bt:91 };
}
function setScore(id: string, value: number) { q(`#${id}`).textContent = `${Math.round(value)}`; q<HTMLElement>(`#${id}-bar`).style.width = `${value}%`; }
function renderMismatch() {
  document.querySelectorAll<HTMLButtonElement>("[data-mismatch]").forEach(b => b.classList.toggle("active", b.dataset.mismatch === mismatch));
  const m = mismatches[lang][mismatch]; q("#mismatch-index").textContent=m[0]; q("#mismatch-name").textContent=m[1]; q("#mismatch-question").textContent=m[2]; q("#mismatch-trap").textContent=m[3]; q("#mismatch-irreducible").textContent=m[4]; q("#mismatch-intervention").textContent=m[5]; q("#candidate-a").textContent=m[6]; q("#candidate-b").textContent=m[7]; q("#epoch").textContent=String(epochs); q("#state-toggle").classList.toggle("visible",mismatch==="state"); q("#state-label").textContent=actualState?"S₂":"S₁";
  const s=scores(); setScore("a-proxy",s.ap);setScore("a-true",s.at);setScore("b-proxy",s.bp);setScore("b-true",s.bt);
}
function bindEvents() {
  q("#language-switch").addEventListener("click",()=>{lang=lang==="zh"?"en":"zh";history.replaceState({}, "", `${location.pathname}?lang=${lang}${location.hash}`);renderApp();});
  document.querySelectorAll<HTMLButtonElement>("[data-regime]").forEach(b=>b.addEventListener("click",()=>{regime=b.dataset.regime as Regime;step=0;renderRegime();}));
  document.querySelectorAll<HTMLButtonElement>("[data-mismatch]").forEach(b=>b.addEventListener("click",()=>{mismatch=b.dataset.mismatch as Mismatch;epochs=0;actualState=0;renderMismatch();}));
  q("#generate").addEventListener("click",()=>{step=step>=5?0:step+1;renderPath();});
  q("#train").addEventListener("click",()=>{epochs=Math.min(epochs+10,100);renderMismatch();});
  q("#reset").addEventListener("click",()=>{epochs=0;actualState=0;renderMismatch();});
  q("#state-toggle").addEventListener("click",()=>{actualState=actualState?0:1;renderMismatch();});
}
window.addEventListener("keydown",e=>{if(e.key==="ArrowRight") q<HTMLButtonElement>("#generate")?.click();});
renderApp();
timer=window.setInterval(()=>{if(!document.hidden&&scrollY<1200){step=step>=5?0:step+1;renderPath();}},2800);
window.addEventListener("beforeunload",()=>clearInterval(timer));
