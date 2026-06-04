import "./interactive.css";

type Regime = "mediocre" | "local" | "extraordinary";
type Mismatch = "aggregation" | "support" | "state" | "specification";

const lab = document.querySelector<HTMLDivElement>("#lab");
if (!lab) throw new Error("Lab root not found");

const regimes: Record<Regime, { name: string; label: string; copy: string; insight: string }> = {
  mediocre: {
    name: "自回归平庸",
    label: "容易续写 ≠ 真正有价值",
    copy: "模型每一步都选择更顺、更常见、更容易解释的 token，最后稳定抵达一个流畅但普通的答案。",
    insight: "局部概率持续上升，真实价值却没有随之累积。",
  },
  local: {
    name: "局部对齐",
    label: "局部有用，整体未必成功",
    copy: "大多数局部选择确实有价值，但一个远距离依赖、隐藏状态或隐性标准会在后段改变结果。",
    insight: "前半程概率与价值同向，越过边界后开始分叉。",
  },
  extraordinary: {
    name: "自回归卓越",
    label: "容易续写 = 更接近高价值",
    copy: "当任务结构、表示方式和成功标准都适合模型时，每一个自然的下一步都会把整体推向更好的结果。",
    insight: "局部改进能够组合成全局质量，自回归成为优势。",
  },
};

const mismatchData: Record<
  Mismatch,
  {
    index: string;
    name: string;
    question: string;
    trap: string;
    irreducible: string;
    intervention: string;
    candidates: [string, string];
  }
> = {
  aggregation: {
    index: "01",
    name: "聚合失配",
    question: "每一步都更好，为什么整体仍然失败？",
    trap: "训练能奖励每个局部的清晰、顺滑与正确，却看不到跨越全文的承诺、依赖和组合效果。",
    irreducible: "若训练信号只评估局部片段，就不存在能指向全局组合关系的梯度。把局部奖励练到满分，也不能推出整体最优。",
    intervention: "外化全局结构：依赖图、长期约束、整体评分器。",
    candidates: ["逐段都漂亮", "保留关键伏笔"],
  },
  support: {
    index: "02",
    name: "支持集失配",
    question: "答案存在，为什么采样再多也碰不到？",
    trap: "真正高价值的结构位于模型几乎不访问的尾部；训练只会加强已经被采到、被标注过的候选。",
    irreducible: "若高价值结构从未进入训练与搜索的支持集，它就不会产生学习信号。零曝光乘以更多训练，仍然是零曝光。",
    intervention: "主动拉入尾部结构：检索、反常规搜索、反例与重组。",
    candidates: ["常见合理答案", "罕见关键洞察"],
  },
  state: {
    index: "03",
    name: "状态失配",
    question: "同一个回答，为什么此刻对、彼时错？",
    trap: "真实价值取决于不可见或变化中的状态；输入相同，但最佳行动会随用户、环境或阶段翻转。",
    irreducible: "没有状态信息时，同一输入对应相互冲突的最优标签。训练只能学到平均策略，无法同时为两个状态给出唯一正确答案。",
    intervention: "显式建模状态：情景矩阵、诊断问题、条件策略。",
    candidates: ["立刻给方案", "先确认状态"],
  },
  specification: {
    index: "04",
    name: "规格失配",
    question: "分数越来越高，为什么用户越来越不满意？",
    trap: "模型优化的是可见代理目标，而真正价值包含未写出的品味、后果、边界或专家判断。",
    irreducible: "训练只会更忠实地优化它收到的目标。若代理目标与真实目标排序相反，训练越成功，真实结果可能越差。",
    intervention: "外化价值函数：对比样例、失败条件、动态 rubric。",
    candidates: ["高代理分答案", "高真实价值答案"],
  },
};

let regime: Regime = "local";
let step = 0;
let mismatch: Mismatch = "aggregation";
let epochs = 0;
let actualState = 0;
let timer: number | undefined;

lab.innerHTML = `
  <header class="lab-header">
    <a class="lab-brand" href="./">
      <span class="brand-dot"></span>
      <span>Against LLM Mediocrity</span>
    </a>
    <nav>
      <a href="#trajectory">路径实验</a>
      <a href="#mismatch">四种失配</a>
      <a href="#transform">如何转化</a>
    </nav>
    <span class="status-pill"><i></i> Interactive model</span>
  </header>

  <main>
    <section class="intro">
      <div>
        <p class="eyebrow">AUTOREGRESSIVE ALIGNMENT LAB / 自回归对齐实验室</p>
        <h1>模型不是一次写出答案。<br><em>它一步一步走向答案。</em></h1>
        <p class="intro-copy">问题在于：每一步最容易走的方向，是否也是最终最有价值的方向？亲手改变路径、训练与隐藏条件，观察概率和真实价值何时同行，何时分叉。</p>
        <div class="intro-actions">
          <a class="primary" href="#trajectory">开始路径实验 <span>↓</span></a>
          <span class="legend"><i class="prob"></i>模型概率 <i class="value"></i>真实价值</span>
        </div>
      </div>
      <div class="hero-orbit" aria-hidden="true">
        <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div>
        <div class="orbit-core"><b>P</b><span>next token</span></div>
        <span class="orbit-label label-a">流畅</span><span class="orbit-label label-b">局部正确</span><span class="orbit-label label-c">全局价值</span>
      </div>
    </section>

    <section class="trajectory section-shell" id="trajectory">
      <div class="section-heading">
        <div><p class="eyebrow">01 / PATH</p><h2>同样是“下一个 token”，<br>会走向三种完全不同的结果</h2></div>
        <p>点击生成，观察每一步的局部概率如何累积。切换对齐状态后，路径本身不再改变，但“容易走”与“值得走”的关系会改变。</p>
      </div>
      <div class="regime-tabs" role="tablist">
        ${Object.entries(regimes).map(([key, item]) => `<button data-regime="${key}"><span>${item.name}</span><small>${item.label}</small></button>`).join("")}
      </div>
      <div class="trajectory-stage">
        <div class="stage-top">
          <div><span class="stage-kicker">当前状态</span><h3 id="regime-name"></h3><p id="regime-copy"></p></div>
          <button class="generate-button" id="generate">生成下一步 <kbd>→</kbd></button>
        </div>
        <svg id="path-svg" viewBox="0 0 1000 360" role="img" aria-label="自回归生成路径"></svg>
        <div class="meters">
          <div><span>累积模型置信</span><b id="prob-score">0</b><div class="meter"><i id="prob-meter"></i></div></div>
          <div><span>累积真实价值</span><b id="value-score">0</b><div class="meter value"><i id="value-meter"></i></div></div>
          <p id="regime-insight"></p>
        </div>
      </div>
    </section>

    <section class="mismatch section-shell" id="mismatch">
      <div class="section-heading mismatch-heading">
        <div><p class="eyebrow">02 / STRUCTURAL MISMATCH</p><h2>为什么继续训练，<br>也无法自动对齐？</h2></div>
        <p>训练只能优化它能够看到、采到、标注和测量的信号。四种失配不是“模型还不够努力”，而是学习信号与真实价值之间缺了一座桥。</p>
      </div>
      <div class="mismatch-layout">
        <aside class="mismatch-tabs">
          ${Object.entries(mismatchData).map(([key, item]) => `<button data-mismatch="${key}"><span>${item.index}</span><b>${item.name}</b><i>↗</i></button>`).join("")}
        </aside>
        <article class="mismatch-lab">
          <div class="mismatch-title"><span id="mismatch-index"></span><div><h3 id="mismatch-name"></h3><p id="mismatch-question"></p></div></div>
          <div class="training-console">
            <div class="console-head"><span><i></i> ALIGNMENT TRAINING</span><b>epoch <output id="epoch">0</output></b></div>
            <div class="candidate-grid">
              <div class="candidate candidate-a"><span>A</span><h4 id="candidate-a"></h4><div class="score-row">训练可见分 <b id="a-proxy"></b></div><div class="score-track proxy"><i id="a-proxy-bar"></i></div><div class="score-row">真实价值 <b id="a-true"></b></div><div class="score-track true"><i id="a-true-bar"></i></div></div>
              <div class="candidate candidate-b"><span>B</span><h4 id="candidate-b"></h4><div class="score-row">训练可见分 <b id="b-proxy"></b></div><div class="score-track proxy"><i id="b-proxy-bar"></i></div><div class="score-row">真实价值 <b id="b-true"></b></div><div class="score-track true"><i id="b-true-bar"></i></div></div>
            </div>
            <div class="console-actions">
              <button id="train">继续训练 <span>+10 epochs</span></button>
              <button id="state-toggle">切换真实状态 <span id="state-label">S₁</span></button>
              <button id="reset">重置实验</button>
            </div>
          </div>
          <div class="diagnosis">
            <div><span>训练陷阱</span><p id="mismatch-trap"></p></div>
            <div class="irreducible"><span>无法仅靠训练消除的原因</span><p id="mismatch-irreducible"></p></div>
          </div>
          <div class="intervention"><span>正确干预</span><b id="mismatch-intervention"></b></div>
        </article>
      </div>
    </section>

    <section class="transform section-shell" id="transform">
      <div class="section-heading">
        <div><p class="eyebrow">03 / TRANSFORMATION</p><h2>不是停止自回归，<br>而是改变它正在解决的问题</h2></div>
        <p>保留模型已经擅长的局部生成，把失配部分转化成显式、可验证、低失配的中间对象。</p>
      </div>
      <div class="transform-flow">
        <div class="flow-node bad"><span>高失配输入</span><b>直接生成最终答案</b><small>流畅输出空间</small></div>
        <div class="flow-arrow"><i></i><span>任务重参数化</span></div>
        <div class="flow-stack">
          <div><span>聚合</span><b>依赖图 / 全局约束</b></div>
          <div><span>支持集</span><b>反例 / 检索 / 稀有结构</b></div>
          <div><span>状态</span><b>情景矩阵 / 条件策略</b></div>
          <div><span>规格</span><b>Rubric / 对比偏好</b></div>
        </div>
        <div class="flow-arrow"><i></i><span>验证后渲染</span></div>
        <div class="flow-node good"><span>低失配子任务</span><b>自回归卓越</b><small>局部改进 → 全局价值</small></div>
      </div>
    </section>
  </main>
  <footer><b>Against LLM Mediocrity</b><span>从自回归平庸，经由局部对齐，走向自回归卓越。</span><a href="./">返回主页 ↗</a></footer>
`;

const q = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const pathSvg = q<SVGElement>("#path-svg");

function curvePoints(activeRegime: Regime) {
  const probability = [16, 30, 45, 60, 76, 91];
  const values: Record<Regime, number[]> = {
    mediocre: [13, 20, 24, 28, 31, 34],
    local: [15, 29, 44, 54, 57, 62],
    extraordinary: [15, 31, 48, 65, 80, 96],
  };
  return { probability, value: values[activeRegime] };
}

function renderPath() {
  const { probability, value } = curvePoints(regime);
  const xs = [70, 240, 410, 580, 750, 920];
  const y = (v: number) => 310 - v * 2.55;
  const line = (arr: number[]) => arr.slice(0, step + 1).map((v, i) => `${xs[i]},${y(v)}`).join(" ");
  const branches = xs.slice(0, -1).map((x, i) => `
    <path class="ghost-branch" d="M${x},${y(probability[i])} Q${x + 80},${y(probability[i]) - 50} ${xs[i + 1]},${y(probability[i]) + 36}" />
    <circle class="ghost-node" cx="${xs[i + 1]}" cy="${y(probability[i]) + 36}" r="7" />
  `).join("");
  const nodes = xs.slice(0, step + 1).map((x, i) => `<g class="path-node" style="--delay:${i * 80}ms"><circle cx="${x}" cy="${y(probability[i])}" r="15"/><text x="${x}" y="${y(probability[i]) + 5}">${i + 1}</text></g>`).join("");
  pathSvg.innerHTML = `
    <defs><linearGradient id="probGrad" x1="0" x2="1"><stop stop-color="#ff745c"/><stop offset="1" stop-color="#ffb45c"/></linearGradient><linearGradient id="valueGrad" x1="0" x2="1"><stop stop-color="#50d3b8"/><stop offset="1" stop-color="#a6e66e"/></linearGradient></defs>
    <g class="grid">${[55, 120, 185, 250, 315].map(n => `<path d="M40 ${n}H960"/>`).join("")}</g>
    <text class="axis-label" x="42" y="32">高</text><text class="axis-label" x="42" y="338">低</text>
    ${branches}
    <polyline class="path-line probability" points="${line(probability)}"/>
    <polyline class="path-line value" points="${line(value)}"/>
    ${nodes}
    <g class="end-labels"><text x="${xs[step] - 12}" y="${y(probability[step]) - 28}">P</text><text x="${xs[step] - 12}" y="${y(value[step]) + 38}">V</text></g>
  `;
  const p = probability[step];
  const v = value[step];
  q("#prob-score").textContent = String(p);
  q("#value-score").textContent = String(v);
  q<HTMLElement>("#prob-meter").style.width = `${p}%`;
  q<HTMLElement>("#value-meter").style.width = `${v}%`;
}

function renderRegime() {
  document.querySelectorAll<HTMLButtonElement>("[data-regime]").forEach(button => button.classList.toggle("active", button.dataset.regime === regime));
  q("#regime-name").textContent = regimes[regime].name;
  q("#regime-copy").textContent = regimes[regime].copy;
  q("#regime-insight").textContent = regimes[regime].insight;
  renderPath();
}

function scores() {
  const t = Math.min(epochs / 100, 1);
  if (mismatch === "aggregation") return { ap: 62 + 35 * t, at: 43 + 3 * t, bp: 34 + 8 * t, bt: 90 };
  if (mismatch === "support") return { ap: 70 + 27 * t, at: 48 + 4 * t, bp: 4, bt: 98 };
  if (mismatch === "state") {
    return actualState === 0
      ? { ap: 62 + 32 * t, at: 88, bp: 46 - 12 * t, bt: 36 }
      : { ap: 62 + 32 * t, at: 28, bp: 46 - 12 * t, bt: 92 };
  }
  return { ap: 64 + 34 * t, at: 55 - 24 * t, bp: 38 - 15 * t, bt: 91 };
}

function setScore(id: string, value: number) {
  q(`#${id}`).textContent = `${Math.round(value)}`;
  q<HTMLElement>(`#${id}-bar`).style.width = `${value}%`;
}

function renderMismatch() {
  const data = mismatchData[mismatch];
  document.querySelectorAll<HTMLButtonElement>("[data-mismatch]").forEach(button => button.classList.toggle("active", button.dataset.mismatch === mismatch));
  q("#mismatch-index").textContent = data.index;
  q("#mismatch-name").textContent = data.name;
  q("#mismatch-question").textContent = data.question;
  q("#candidate-a").textContent = data.candidates[0];
  q("#candidate-b").textContent = data.candidates[1];
  q("#mismatch-trap").textContent = data.trap;
  q("#mismatch-irreducible").textContent = data.irreducible;
  q("#mismatch-intervention").textContent = data.intervention;
  q("#epoch").textContent = String(epochs);
  q("#state-toggle").classList.toggle("visible", mismatch === "state");
  q("#state-label").textContent = actualState === 0 ? "S₁" : "S₂";
  const s = scores();
  setScore("a-proxy", s.ap); setScore("a-true", s.at); setScore("b-proxy", s.bp); setScore("b-true", s.bt);
}

document.querySelectorAll<HTMLButtonElement>("[data-regime]").forEach(button => button.addEventListener("click", () => {
  regime = button.dataset.regime as Regime; step = 0; renderRegime();
}));
document.querySelectorAll<HTMLButtonElement>("[data-mismatch]").forEach(button => button.addEventListener("click", () => {
  mismatch = button.dataset.mismatch as Mismatch; epochs = 0; actualState = 0; renderMismatch();
}));
q("#generate").addEventListener("click", () => {
  if (step >= 5) step = 0; else step += 1;
  renderPath();
});
q("#train").addEventListener("click", () => {
  epochs = Math.min(epochs + 10, 100); renderMismatch();
});
q("#reset").addEventListener("click", () => { epochs = 0; actualState = 0; renderMismatch(); });
q("#state-toggle").addEventListener("click", () => { actualState = actualState ? 0 : 1; renderMismatch(); });
window.addEventListener("keydown", event => { if (event.key === "ArrowRight") q<HTMLButtonElement>("#generate").click(); });

renderRegime();
renderMismatch();
timer = window.setInterval(() => {
  if (!document.hidden && window.scrollY < 1200) {
    step = step >= 5 ? 0 : step + 1;
    renderPath();
  }
}, 2800);
window.addEventListener("beforeunload", () => window.clearInterval(timer));
