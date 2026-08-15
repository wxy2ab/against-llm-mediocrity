import type { Lang, MismatchId, Regime } from "./types";

export interface PipelineNode {
  sym: string; // language-neutral symbol
  name: string;
}

export interface MismatchCopy {
  index: string;
  name: string;
  station: string; // pipeline station, e.g. "S_world → O → Z"
  question: string;
  definition: string;
  symptom: string;
  repair: string;
  aha: string;
}

export interface RegimeCopy {
  name: string;
  tag: string;
  desc: string;
  insight: string;
}

export interface MethodCopy {
  tag: string;
  name: string;
  desc: string;
}

export interface LabContent {
  meta: { title: string; description: string };
  header: {
    brand: string;
    nav: Record<"pipeline" | "sampling" | "mismatch" | "regimes" | "governance", string>;
    switchLabel: string;
    status: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    copy: string;
    cta: string;
  };
  legend: { prob: string; value: string };
  loading: string;
  fallbackNote: string;
  pipeline: {
    eyebrow: string;
    title: string;
    copy: string;
    nodes: PipelineNode[]; // 7
    operators: string[]; // 6 edge labels
    release: string;
    governedOff: string;
    governedOn: string;
    ideal: string;
    real: string;
    loss: string;
    aha: string;
  };
  sampling: {
    eyebrow: string;
    title: string;
    copy: string;
    expected: string;
    actual: string;
    repeated: string;
    closeable: string;
    irreducible: string;
    sample: string;
    burst: string;
    train: string;
    reset: string;
    causeLabel: string;
    causes: Record<"support" | "specification" | "observation", string>;
    causeExpl: Record<"support" | "specification" | "observation", string>;
    trueValueMeter: string;
    closeableMeter: string;
    aha: string;
  };
  mismatch: {
    eyebrow: string;
    title: string;
    copy: string;
    stationLabel: string;
    questionLabel: string;
    definitionLabel: string;
    symptomLabel: string;
    repairLabel: string;
    items: Record<MismatchId, MismatchCopy>;
  };
  regimes: {
    eyebrow: string;
    title: string;
    copy: string;
    boundary: string;
    items: Record<Regime, RegimeCopy>;
  };
  governance: {
    eyebrow: string;
    title: string;
    copy: string;
    methods: MethodCopy[]; // 4
    before: string;
    after: string;
    flow: string[];
    aha: string;
  };
  footer: { brand: string; tagline: string; home: string };
}

const zh: LabContent = {
  meta: {
    title: "价值保存实验室",
    description:
      "用 Three.js 真 3D 交互理解价值保存理论：价值如何穿过观测、表征、路由、支持、聚合、评价六个站点，以及六类原始失配为什么训练也无法自动消除。",
  },
  header: {
    brand: "Against LLM Mediocrity",
    nav: {
      pipeline: "价值流水线",
      sampling: "采样剧场",
      mismatch: "六类失配",
      regimes: "三种区制",
      governance: "治理转化",
    },
    switchLabel: "English",
    status: "交互模型",
  },
  hero: {
    eyebrow: "价值保存实验室 / VALUE PRESERVATION LAB",
    title: "模型不是一次写出答案。<br><em>价值要活着穿过一整条流水线。</em>",
    copy:
      "任务价值必须穿过观测、表征、路由、支持、聚合、评价而不被破坏。每一个转换都可能保存、压缩或丢掉它。下面用真 3D 动手验证：你期待的采样、模型实际采样、重复采样、训练能优化的部分，以及训练永远无法优化的部分。",
    cta: "进入价值流水线",
  },
  legend: { prob: "概率 p_θ", value: "价值 U" },
  loading: "正在装载 3D 场景…",
  fallbackNote:
    "你的环境关闭了动画或不支持 WebGL，下面以静态示意图呈现同样的原理。",
  pipeline: {
    eyebrow: "01 / 价值流水线",
    title: "价值是一件易碎的载荷，<br>必须穿过七个站点而不掉出去",
    copy:
      "LLM 系统不直接作用于世界，而是经过一连串转换工作：S_world → O → Z → C → K → Y → 评价。高价值系统必须让任务相关的价值结构穿过这条管线并被保存。恰好有六处可能掉出去——就是六类原始失配。",
    nodes: [
      { sym: "S_world", name: "世界状态" },
      { sym: "O", name: "观测" },
      { sym: "Z", name: "表征" },
      { sym: "C", name: "能力" },
      { sym: "K", name: "候选集" },
      { sym: "Y", name: "产物" },
      { sym: "Ũ", name: "评价" },
    ],
    operators: ["φ 观测", "ψ 表征", "ρ 路由", "p_θ,B 采样", "A 聚合", "Ũ 评价"],
    release: "放行价值",
    governedOff: "无治理",
    governedOn: "受治理",
    ideal: "理想载荷",
    real: "实际载荷",
    loss: "价值损失",
    aha: "价值不是在终点产生的——它要活着穿过一条线，而恰好有六处会掉出去。",
  },
  sampling: {
    eyebrow: "02 / 采样剧场",
    title: "模型最容易生成的方向，<br>是否也是价值真正上升的方向？",
    copy:
      "地面是输出空间，每一点是一个可能的产物；高度是真实价值 U；橙色亮度是模型概率 p_θ。看着采样落在哪里，训练能把概率倒向价值到什么程度，又在哪里撞上一堵永远越不过的墙。",
    expected: "你期待的采样结果 · Y*",
    actual: "LLM 实际采样 · p_θ 峰",
    repeated: "重复采样 · 同一个盆地",
    closeable: "训练可优化的重叠",
    irreducible: "训练永远无法优化的部分",
    sample: "采样",
    burst: "连采 ×100",
    train: "训练",
    reset: "重置",
    causeLabel: "墙的成因",
    causes: {
      support: "支持失配",
      specification: "规格失配",
      observation: "观测失配",
    },
    causeExpl: {
      support:
        "高价值峰 Y* 就在那里，但概率质量为零——训练无法制造它从不采样的质量。零曝光 × 更多训练，仍是零曝光。",
      specification:
        "别处冒出第二座假峰 Ũ（代理目标）。训练高高兴兴爬那一座，越成功离真值峰越远。rank_Ũ ≠ rank_U。",
      observation:
        "真值峰的坐标在地面上根本没定义——决定性变量在进入表征前就被投影掉了。采样器没有可瞄准的坐标。",
    },
    trueValueMeter: "真实价值",
    closeableMeter: "可优化重叠",
    aha:
      "训练是真的、有用——你看它把概率倒向价值——但倒到一堵永远越不过、且有名字的墙。",
  },
  mismatch: {
    eyebrow: "03 / 六类原始失配",
    title: "为什么继续训练，<br>也无法自动对齐？",
    copy:
      "六类失配对应价值保存管线上的六个结构站点。它们不是“模型还不够努力”，而是任务价值在某一站点结构性地丢失。每一类都有不同的症状和不同的修复目标——切换标签，亲手扰动那一站。",
    stationLabel: "管线站点",
    questionLabel: "核心问题",
    definitionLabel: "定义",
    symptomLabel: "典型症状",
    repairLabel: "修复目标",
    items: {
      observation: {
        index: "01",
        name: "观测-表征失配",
        station: "S_world → O → Z",
        question: "决定性变量是否进入了操作表征 Z？",
        definition:
          "世界中决定任务成败的变量，在进入 Z 之前被丢失、混叠、压缩或变得不可访问。两个真实价值不同的世界状态，在表征里却几乎相同。",
        symptom:
          "模型从不完整的输入流畅地推理；补上原始日志、数据库值、schema 细节后失败就消失；系统说不出真正解释错误的那个变量。",
        repair: "通道 / 表征修复：补测量、原始数据、工具访问、schema 抽取、变量进入。",
        aha: "不是推理差，是决定性区分在进入前就被抹掉了——再多推理也找不回被投影掉的维度。",
      },
      state: {
        index: "02",
        name: "状态失配",
        station: "Z → 潜在状态",
        question: "给定表征，我们是否知道自己处于哪个隐藏状态？",
        definition:
          "正确策略依赖某个潜在状态，而该状态不能从当前表征识别。P(h|Z) 歧义，且不同状态要求不同最优动作。",
        symptom:
          "同一个答案在一种隐藏解释下合理、在另一种下错误；一点点澄清信息就翻转正确策略；多轮对话因状态过期而失败。",
        repair: "状态判别 / 分支：枚举状态、构造判别器、澄清问题、条件策略。",
        aha: "同输入同答案，价值随隐藏状态翻转。修的不是更好的答案，而是先确认自己在哪个世界。",
      },
      fitting: {
        index: "03",
        name: "拟合边界失配",
        station: "Z → C",
        question: "正确的能力是否在正确的领域被激活？",
        definition:
          "已学得能力的实际激活域 M_X 偏离真实适用域 T_X：要么过触发（用在不该用的地方），要么欠触发（该用时没激活）。",
        symptom:
          "明确要求时模型能做这个操作，却不会自发调用；在需要别的程序时套用熟悉模板；安全/谨慎模式过度触发。",
        repair: "路由治理：触发条件审计、激活/抑制规则、能力适用性测试。",
        aha: "工具没错，也好用——只是被指向了房间里错误的区域。修的是路由，不是补知识。",
      },
      support: {
        index: "04",
        name: "支持失配",
        station: "p_θ,B → K",
        question: "高价值结构能否在当前策略与预算下成为活候选？",
        definition:
          "高价值结构在模型策略、搜索流程和推断预算下概率质量过低或不可达：P_θ(Y*|Z,B) 很低，或 Y* 根本不在可达候选集里。",
        symptom:
          "大量采样只产出同一种缺陷模式的变体；正确结构只在被显式枚举时出现；看到答案能认出，却几乎从不自己生成。",
        repair: "控制空间搜索：候选枚举、约束解码、检索增强、对中间结构搜索。",
        aha: "答案存在且可识别，只是直接采样从不去那。不是采样更狠，是给它搭一架梯子。",
      },
      aggregation: {
        index: "05",
        name: "聚合失配",
        station: "K → Y",
        question: "局部好的 parts 能否组合成全局有价值的产物？",
        definition:
          "局部合理、局部正确的组件无法组合成全局有价值的 artifact。这正是自回归平庸的精确结构位置：局部价值没有组合式忠于全局价值。",
        symptom:
          "每段都合理，整篇论证失败；每条 SQL 子句都说得通，整条查询语义错误；答案越来越流畅却失去结构正确性；跨部件依赖维持不住。",
        repair: "组合治理：依赖图、全局不变量、约束传播、跨部件验证、集成测试。",
        aha: "每块都完美而整体崩——逐块打磨甚至让全局更糟。全局价值是 parts 之间的关系，不是它们的和。",
      },
      specification: {
        index: "06",
        name: "规格失配",
        station: "Y → Ũ vs U",
        question: "我们优化的是不是正确的目标？",
        definition:
          "系统用偏离真实任务效用 U 的可访问目标 Ũ 来优化、验证或选择。对任务相关候选，rank_Ũ ≠ rank_U：代理排序与真实排序相反。",
        symptom:
          "输出满足提示词却辜负真实需求；benchmark 分数升而语义质量没升；系统学会满足 rubric 而不解决任务；验证器接受了人类会拒绝的产物。",
        repair: "目标治理：rubric 修订、反例驱动的规格修复、代理风险审计、验证器层级。",
        aha: "系统优化得完美——只是爬错了山。失配不是错误，是对着代理目标的成功。",
      },
    },
  },
  regimes: {
    eyebrow: "04 / 三种对齐区制",
    title: "不是三个模型，<br>是“易”与“好”的三种关系",
    copy:
      "同一套 p_θ 与 U 的关系，可以处在三种配置里。训练在它们之间移动你——但不保证抹平所有结构性失配。",
    boundary: "对齐边界 · 流畅不再预测价值",
    items: {
      mediocre: {
        name: "LLM 平庸",
        tag: "概率峰偏离价值峰",
        desc:
          "LLM 给出的答案在某些时候未必是高价值高质量的，可能是很平庸的答复，而非你期望的答案。",
        insight: "橙色质量远离 mint 峰——更多采样只是更充分地暴露失配。",
      },
      local: {
        name: "局部对齐",
        tag: "最常见的实际状态",
        desc:
          "对于一个复杂问题，LLM 擅长处理其中的一部分，但是另外一部分给出的答案是平庸且无价值的。",
        insight: "前半程概率与价值同向，越过对齐边界脊后开始分叉。",
      },
      extraordinary: {
        name: "LLM 卓越",
        tag: "概率与价值同向",
        desc:
          "模型擅长处理此类问题，给出的答案往往就是你期待和需要的。",
        insight: "橙被正坐在 mint 峰上——自回归生成本身成为优势。",
      },
    },
  },
  governance: {
    eyebrow: "05 / 治理与转化",
    title: "不是停止自回归，<br>而是改变它正在解决的问题",
    copy:
      "保留模型已经局部对齐的能力，把高失配的最终输出任务转化成低失配、可搜索、可验证的中间控制对象，再渲染。平庸→卓越是搜索空间之变，不是更强模型。",
    methods: [
      {
        tag: "支持失配 / 突破局部最优",
        name: "高密度采样、拆分、重组",
        desc:
          "先海量采样得到候选，挑出局部最有潜力的，拆成片段、结构、转折，跨样本重组，把尾部高价值结构从低支持区域打捞出来，变成新的控制资源。",
      },
      {
        tag: "把平庸任务改写成卓越任务",
        name: "先写控制空间，再生成输出",
        desc:
          "先写出优秀结果需满足的元素、节奏、约束、风格边界、伏笔回收与验收标准，让模型在这些子任务上发挥，再用相对可靠的评价检查成品。不合格就改控制空间本身。",
      },
      {
        tag: "最通用的方法",
        name: "在控制空间搜索",
        desc:
          "切断“原始语义→直接输出”的默认路径，构造更易搜索的控制空间：状态矩阵、评分规约、依赖图、查询计划、失败模式清单，在其中搜索扰动比较，再投影回输出验证。",
      },
      {
        tag: "先粗后细，抑制复杂度",
        name: "分层控制空间",
        desc:
          "控制空间不是越大越好。先做粗粒度搜索锁定大方向与关键约束，再逐层细化局部策略与实现，每层设不同验证器与回滚点，把组合爆炸切开。",
      },
    ],
    before: "治理 关",
    after: "治理 开",
    flow: [
      "原始任务",
      "构造控制空间",
      "在控制空间搜索 / 重组",
      "投影回输出空间",
      "评价与验证",
    ],
    aha: "把搜索移到概率与价值已经对齐的层，再让模型渲染——这就是从平庸走向卓越的核心路径。",
  },
  footer: {
    brand: "Against LLM Mediocrity",
    tagline: "从 LLM 平庸，经由局部对齐，走向 LLM 卓越。",
    home: "返回主页",
  },
};

const en: LabContent = {
  meta: {
    title: "Value Preservation Lab",
    description:
      "A Three.js interactive of the value-preservation theory: how task value must survive observation, representation, routing, support, aggregation and evaluation — and why the six primitive mismatches cannot be trained away.",
  },
  header: {
    brand: "Against LLM Mediocrity",
    nav: {
      pipeline: "Value Pipeline",
      sampling: "Sampling Theater",
      mismatch: "Six Mismatches",
      regimes: "Three Regimes",
      governance: "Governance",
    },
    switchLabel: "中文",
    status: "Interactive model",
  },
  hero: {
    eyebrow: "VALUE PRESERVATION LAB",
    title: "A model doesn't write an answer at once.<br><em>Value has to survive a whole pipeline.</em>",
    copy:
      "Task value must pass through observation, representation, routing, support, aggregation and evaluation without being destroyed. Every transformation can preserve, compress or drop it. Try it in real 3D: what you expect to sample, what the model actually samples, repeated sampling, what training can optimize, and what training can never optimize.",
    cta: "Enter the value pipeline",
  },
  legend: { prob: "probability p_θ", value: "value U" },
  loading: "Loading 3D scenes…",
  fallbackNote:
    "Your environment disabled animation or lacks WebGL — the same principles are shown below as static diagrams.",
  pipeline: {
    eyebrow: "01 / VALUE PIPELINE",
    title: "Value is a fragile payload that<br>must survive seven stations intact",
    copy:
      "An LLM system never acts on the world directly; it works through a chain of transformations: S_world → O → Z → C → K → Y → evaluation. A high-value system must carry the task-relevant value structure through this pipeline and preserve it. There are exactly six places it can fall out — the six primitive mismatches.",
    nodes: [
      { sym: "S_world", name: "World state" },
      { sym: "O", name: "Observation" },
      { sym: "Z", name: "Representation" },
      { sym: "C", name: "Capability" },
      { sym: "K", name: "Candidates" },
      { sym: "Y", name: "Artifact" },
      { sym: "Ũ", name: "Evaluation" },
    ],
    operators: ["φ observe", "ψ represent", "ρ route", "p_θ,B sample", "A aggregate", "Ũ evaluate"],
    release: "Release value",
    governedOff: "Ungoverned",
    governedOn: "Governed",
    ideal: "Ideal payload",
    real: "Actual payload",
    loss: "Value loss",
    aha: "Value isn't produced at the end — it has to survive a line, and there are exactly six places it can fall out.",
  },
  sampling: {
    eyebrow: "02 / SAMPLING THEATER",
    title: "Is the easiest direction to generate<br>also the direction value rises?",
    copy:
      "The floor is output space — every point is a possible artifact. Height is true value U. Orange brightness is model probability p_θ. Watch where sampling lands, how far training can pour probability onto value, and where it hits a wall it can never cross.",
    expected: "Expected sample · Y*",
    actual: "Actual p_θ mass",
    repeated: "Repeated → same basin",
    closeable: "Trainable overlap",
    irreducible: "What training can never optimize",
    sample: "Sample",
    burst: "Repeat ×100",
    train: "Train",
    reset: "Reset",
    causeLabel: "Wall caused by",
    causes: {
      support: "Support mismatch",
      specification: "Specification mismatch",
      observation: "Observation mismatch",
    },
    causeExpl: {
      support:
        "The high-value peak Y* is right there, but its probability mass is zero — training cannot manufacture mass it never samples. Zero exposure × more training is still zero exposure.",
      specification:
        "A second false peak Ũ (the proxy objective) appears elsewhere. Training happily climbs that one, getting further from the true peak the better it does. rank_Ũ ≠ rank_U.",
      observation:
        "The true peak's coordinate is undefined on the floor — the decisive variable was projected away before it entered the representation. The sampler has no coordinate to aim at.",
    },
    trueValueMeter: "True value",
    closeableMeter: "Closeable overlap",
    aha:
      "Training is real and it works — you watch it pour probability onto value — but only up to a wall it can never cross, and the wall has a name.",
  },
  mismatch: {
    eyebrow: "03 / SIX PRIMITIVE MISMATCHES",
    title: "Why can more training<br>still fail to align?",
    copy:
      "The six mismatches correspond to six structural stations on the value-preservation pipeline. They are not a lack of effort — they are task value lost structurally at one station. Each has distinct symptoms and a distinct repair target. Switch tabs and perturb that station by hand.",
    stationLabel: "Pipeline station",
    questionLabel: "Core question",
    definitionLabel: "Definition",
    symptomLabel: "Symptoms",
    repairLabel: "Repair target",
    items: {
      observation: {
        index: "01",
        name: "Observation–Representation",
        station: "S_world → O → Z",
        question: "Did the decisive variable enter the operational representation Z?",
        definition:
          "A variable that decides task success in the world is lost, aliased, compressed or made inaccessible before entering Z. Two world states with different true value look nearly identical in the representation.",
        symptom:
          "The model reasons fluently from incomplete inputs; failures vanish when raw logs, database values or schema details are supplied; the system cannot name the variable that actually explains the error.",
        repair: "Channel / representation repair: measurement, raw data, tool access, schema extraction, variable introduction.",
        aha: "It isn't bad reasoning — the decisive distinction was erased before arrival. No amount of thinking recovers a projected-away dimension.",
      },
      state: {
        index: "02",
        name: "State",
        station: "Z → latent state",
        question: "Given the representation, do we know which latent state we are in?",
        definition:
          "The correct policy depends on a latent state that is not identifiable from the current representation. P(h|Z) is ambiguous, and different states require different optimal actions.",
        symptom:
          "The same answer is reasonable under one hidden interpretation and wrong under another; small clarifying info flips the correct policy; multi-turn settings fail on stale state.",
        repair: "State discrimination / branching: enumerate states, build discriminators, ask clarifying questions, conditional policies.",
        aha: "Same input, same answer — yet its value flips with a hidden state. The fix isn't a better answer, it's resolving which world you're in.",
      },
      fitting: {
        index: "03",
        name: "Fitting-Boundary",
        station: "Z → C",
        question: "Is the right capability being activated under the right conditions?",
        definition:
          "A learned capability's actual activation domain M_X differs from its true applicability domain T_X: it either over-triggers (fires where it shouldn't) or under-triggers (fails to fire when needed).",
        symptom:
          "The model can perform the operation when asked explicitly but won't invoke it spontaneously; it reuses a familiar template where a different procedure is required; a safety/caution mode over-fires.",
        repair: "Routing governance: trigger-condition audit, activation/suppression rules, capability applicability tests.",
        aha: "The tool is right and it works — it's just pointed at the wrong part of the room. Repair the routing, don't add facts.",
      },
      support: {
        index: "04",
        name: "Support",
        station: "p_θ,B → K",
        question: "Can the high-value structure become a live candidate under the current policy and budget?",
        definition:
          "High-value structure has too little probability mass or reachability under the policy, search procedure and budget: P_θ(Y*|Z,B) is low, or Y* is simply not in the reachable candidate set.",
        symptom:
          "Many samples produce variations of the same flawed pattern; the correct structure appears only when explicitly enumerated; the model recognizes a correct answer but rarely generates it.",
        repair: "Control-space search: candidate enumeration, constraint-guided decoding, retrieval, search over intermediate structures.",
        aha: "The answer exists and is recognizable — direct sampling just never goes there. Don't sample harder; build a ladder.",
      },
      aggregation: {
        index: "05",
        name: "Aggregation",
        station: "K → Y",
        question: "Do the locally good parts compose into a globally valuable whole?",
        definition:
          "Locally plausible, locally correct components fail to compose into a globally valuable artifact. This is the exact structural location of autoregressive mediocrity: local value is not compositionally faithful to global value.",
        symptom:
          "Every section looks reasonable but the whole argument fails; every SQL clause is plausible but the query is semantically wrong; fluency rises while structural correctness is lost; cross-part dependencies break.",
        repair: "Composition governance: dependency graphs, global invariants, constraint propagation, cross-part validators, integration tests.",
        aha: "Every part is perfect and the whole is broken — polishing parts makes it worse. Global value is a relationship between parts, not their sum.",
      },
      specification: {
        index: "06",
        name: "Specification",
        station: "Y → Ũ vs U",
        question: "Are we optimizing the right target?",
        definition:
          "The system optimizes, verifies or selects with an accessible objective Ũ that diverges from true task utility U. For task-relevant candidates, rank_Ũ ≠ rank_U: the proxy ranks them opposite to the truth.",
        symptom:
          "Output satisfies the written prompt but disappoints the real need; the benchmark rises while semantic quality doesn't; the system learns to satisfy a rubric without solving the task; the verifier accepts what humans reject.",
        repair: "Objective governance: rubric revision, counterexample-driven repair, proxy-risk audit, verifier hierarchy.",
        aha: "The system optimizes perfectly — just the wrong mountain. Misalignment isn't error; it's success aimed at a proxy.",
      },
    },
  },
  regimes: {
    eyebrow: "04 / THREE ALIGNMENT REGIMES",
    title: "Not three models —<br>three relationships between easy and good",
    copy:
      "The same p_θ–U relationship can sit in three configurations. Training moves you between them — but it does not guarantee flattening every structural mismatch.",
    boundary: "Alignment boundary · fluency stops predicting value",
    items: {
      mediocre: {
        name: "LLM mediocrity",
        tag: "probability peak misses value peak",
        desc:
          "Candidates reachable within budget cluster in a region that is fluent, plausible and locally improvable, yet far from the high-value solution. More sampling or polishing raises average quality but never reaches the decisive structure.",
        insight: "Orange mass pooled far from the mint peak — more sampling just exposes the mismatch.",
      },
      local: {
        name: "Local alignment",
        tag: "the most common real state",
        desc:
          "The model's local continuation tendency aligns with part of task value: it can compress, rewrite, enumerate, compare, outline. But global success still depends on hidden state, long-range dependency, the true objective or verification.",
        insight: "Probability and value rise together early, then diverge past the alignment-boundary ridge.",
      },
      extraordinary: {
        name: "LLM excellence",
        tag: "probability and value rise together",
        desc:
          "High-value output is no longer a low-probability tail event but an easy-to-reach region. When task structure, representation and success criteria fit the model, each natural next step pushes the whole toward a better result.",
        insight: "The orange duvet sits right on the mint peak — autoregression itself becomes an advantage.",
      },
    },
  },
  governance: {
    eyebrow: "05 / GOVERNANCE & TRANSFORMATION",
    title: "Don't stop autoregression —<br>change the problem it is solving",
    copy:
      "Preserve what the model is already locally aligned at; transform the high-mismatch final-output task into low-mismatch, searchable, verifiable intermediate control objects, then render. Mediocrity → excellence is a change of search space, not a stronger model.",
    methods: [
      {
        tag: "Support mismatch / escape local optima",
        name: "Dense-sample, split, recombine",
        desc:
          "Mass-sample to get candidates, pick the locally most promising, split them into fragments, structures and turns, recombine across samples — dredging tail high-value structure out of the low-support region into a new control resource.",
      },
      {
        tag: "Rewrite a mediocre task into excellent ones",
        name: "Write the control space first",
        desc:
          "First write the elements, rhythm, constraints, style boundaries, setup-payoffs and acceptance criteria an excellent result must satisfy; let the model excel on those subtasks; then check the result with a more reliable evaluation. If it fails, revise the control space itself.",
      },
      {
        tag: "The most general method",
        name: "Search the control space",
        desc:
          "Cut the default 'raw semantics → direct output' path and build a more searchable control space: state matrices, rubrics, dependency graphs, query plans, failure-mode lists. Search, perturb and compare there, then project back to output for verification.",
      },
      {
        tag: "Coarse-to-fine, contain complexity",
        name: "Hierarchical control space",
        desc:
          "Bigger control space isn't better. Do a coarse search to lock direction and key constraints, then refine local strategy and implementation layer by layer, each with its own validators and rollback points — cutting the combinatorial explosion open.",
      },
    ],
    before: "Governance off",
    after: "Governance on",
    flow: [
      "Original task",
      "Build control space",
      "Search / recombine in control space",
      "Project back to output",
      "Evaluate & verify",
    ],
    aha: "Move the search to a layer where probability and value already align, then let the model render — that is the core path from mediocrity to excellence.",
  },
  footer: {
    brand: "Against LLM Mediocrity",
    tagline: "From LLM mediocrity, through local alignment, to LLM excellence.",
    home: "Back to home",
  },
};

export const CONTENT: Record<Lang, LabContent> = { zh, en };

export const content = (lang: Lang): LabContent => CONTENT[lang];
