export type Lang = "en" | "zh";

export type PageKey =
  | "home"
  | "science"
  | "framework"
  | "engineering"
  | "collaboration"
  | "learning"
  | "papers"
  | "projects";

export type Section = {
  eyebrow?: string;
  title: string;
  body?: string;
  bullets?: string[];
  cards?: Array<{
    title: string;
    body: string;
    tag?: string;
  }>;
};

export type Page = {
  key: PageKey;
  path: string;
  title: string;
  navTitle: string;
  kicker: string;
  summary: string;
  heroPoints?: string[];
  sections: Section[];
};

type SiteCopy = {
  languageName: string;
  switchLabel: string;
  repoLabel: string;
  repoUrl: string;
  footer: string;
  pages: Record<PageKey, Page>;
};

export const navOrder: PageKey[] = [
  "home",
  "science",
  "framework",
  "engineering",
  "collaboration",
  "learning",
  "papers",
  "projects",
];

export const content: Record<Lang, SiteCopy> = {
  en: {
    languageName: "English",
    switchLabel: "中文",
    repoLabel: "GitHub",
    repoUrl: "https://github.com/wxy2ab/against-llm-mediocrity",
    footer:
      "Against LLM Mediocrity is an English-first bilingual project about Knowledge Governance, autoregressive mediocrity, and human-AI collaboration.",
    pages: {
      home: {
        key: "home",
        path: "/",
        title: "Against LLM Mediocrity",
        navTitle: "Home",
        kicker: "A science-to-engineering map for better AI use",
        summary:
          "LLMs often sound coherent before they are actually correct, useful, or extraordinary. This project explains why that happens, when it does not happen, and how to design workflows that turn fluent defaults into governed knowledge.",
        heroPoints: [
          "Name the hard limits instead of treating every failure as a prompt problem.",
          "Separate tasks where autoregression is powerful from tasks where it hides value.",
          "Build control spaces, validation loops, and human escalation protocols.",
        ],
        sections: [
          {
            eyebrow: "Problem",
            title: "Fluent output is not the same as high task value.",
            body:
              "Modern LLM systems can sample, critique, revise, retrieve, plan, and use tools. Yet many high-value tasks still plateau in answers that are locally reasonable and globally mediocre. The failure is not random. It often comes from structural mismatches between the distribution the model can easily generate and the value function the task actually rewards.",
          },
          {
            eyebrow: "Why it matters",
            title: "Understanding the hard limits saves effort.",
            cards: [
              {
                title: "Avoid prompt superstition",
                body:
                  "If a task has hidden state, rare high-value structures, or nonlocal constraints, asking for another polished draft may only produce smoother mediocrity.",
                tag: "Use fewer blind retries",
              },
              {
                title: "Use models where they are extraordinary",
                body:
                  "Compression, transformation, taxonomy generation, edge-case enumeration, and semantic decompression often align with LLM strengths.",
                tag: "Exploit positive alignment",
              },
              {
                title: "Know when humans must govern",
                body:
                  "Humans should not merely proofread. They should set values, choose tradeoffs, authorize risk, and supply the missing control variables that tools cannot infer.",
                tag: "Collaborate deliberately",
              },
            ],
          },
          {
            eyebrow: "Project path",
            title: "From public explanation to open systems.",
            bullets: [
              "Start with a bilingual knowledge base that makes the problem understandable.",
              "Add papers that formalize autoregressive mediocrity, extraordinary regimes, and Knowledge Governance.",
              "Add open-source projects that implement GKO-style control objects, validation loops, and escalation protocols.",
            ],
          },
        ],
      },
      science: {
        key: "science",
        path: "/science",
        title: "Popular Science: Why LLMs Become Mediocre",
        navTitle: "Science",
        kicker: "A plain-language introduction",
        summary:
          "The core issue is not that LLMs are useless or doomed. The issue is that some tasks reward exactly what LLMs generate easily, while other tasks reward structures that are rare, hidden, delayed, or underspecified.",
        heroPoints: [
          "Autoregressive mediocrity is a task regime, not a moral judgment.",
          "Autoregressive extraordinary is the opposite regime, where local generation compounds into value.",
          "The practical question is how to move a task from the first regime into the second.",
        ],
        sections: [
          {
            title: "What is autoregressive mediocrity?",
            body:
              "It is the condition where a model keeps producing plausible, fluent, incrementally improved outputs while staying far from what the task truly needs. The answers may be diverse and polished, but they remain inside the same low-value basin.",
          },
          {
            title: "What is autoregressive extraordinary?",
            body:
              "Some tasks naturally fit the model's strengths. Summarizing a dense context, turning notes into a structured memo, translating register, generating candidate edge cases, or expanding a good outline can become better through ordinary continuation and revision. In these cases, autoregression is not a bottleneck. It is the engine.",
          },
          {
            title: "Where people waste effort",
            cards: [
              {
                title: "Asking for more polish when the abstraction is wrong",
                body:
                  "A better tone cannot fix a wrong problem model. First extract variables, states, constraints, and success conditions.",
              },
              {
                title: "Treating missing state as missing intelligence",
                body:
                  "If utility depends on a hidden user preference, market regime, legal boundary, or physical affordance, the system needs state discovery or a human answer.",
              },
              {
                title: "Using output voting when the high-value answer is rare",
                body:
                  "Majority agreement can reinforce the default basin. Tail search, perturbation, retrieval, or structural validation may be needed.",
              },
            ],
          },
        ],
      },
      framework: {
        key: "framework",
        path: "/framework",
        title: "Scientific Framework: Four Primitive Mismatches",
        navTitle: "Framework",
        kicker: "A diagnostic theory for when fluent generation diverges from value",
        summary:
          "The framework explains susceptibility to autoregressive mediocrity through four primitive mismatch axes: aggregation, support, state, and specification.",
        heroPoints: [
          "Aggregation: local improvements do not compose into global value.",
          "Support: near-optimal solutions are low probability or hard to reach.",
          "State: the right answer depends on hidden or changing conditions.",
          "Specification: the accessible proxy diverges from true utility.",
        ],
        sections: [
          {
            title: "Aggregation mismatch",
            body:
              "Global task value cannot be recovered by adding up local improvements. This appears in narrative payoff, strategic coherence, software architecture, multi-step reasoning, and any task where one local choice changes the meaning of another.",
          },
          {
            title: "Support mismatch",
            body:
              "The best answer may exist in the model's distribution but be too rare under practical budgets. More samples may improve the average while still missing the decisive structure.",
          },
          {
            title: "State mismatch",
            body:
              "The same output can be right under one latent state and wrong under another. Useful systems therefore need explicit state hypotheses, state checks, and revocation triggers.",
          },
          {
            title: "Specification mismatch",
            body:
              "The proxy objective is not the real objective. A response can satisfy the prompt, benchmark, rubric, or evaluator while missing the tacit criterion that actually matters.",
          },
          {
            title: "Compound patterns are not always new primitives",
            bullets: [
              "Order-sensitive trajectories, noisy-context construal, corpus-prior dominance, and emergent specification are important patterns.",
              "They are usually better diagnosed as interactions among the four primitive mismatches, representation choice, inference budget, and control policy.",
              "This keeps the taxonomy useful: every diagnosis should imply a different intervention.",
            ],
          },
        ],
      },
      engineering: {
        key: "engineering",
        path: "/engineering",
        title: "Engineering Playbook: Knowledge Governance",
        navTitle: "Engineering",
        kicker: "Turn high-mismatch tasks into governed lower-mismatch workflows",
        summary:
          "Knowledge Governance separates final rendering from the acquisition, validation, deployment, and revision of task-specific control knowledge.",
        heroPoints: [
          "Do not search only over final answers.",
          "Search over intermediate control objects.",
          "Validate, prioritize, weaken, and revoke what the system learns.",
        ],
        sections: [
          {
            title: "Mediocrity-to-Extraordinary Transformation",
            body:
              "The central engineering move is to reparameterize a hard final-output task into subtasks where the model is strong: compression, rubric generation, state enumeration, edge-case discovery, outline construction, failure-mode analysis, query formulation, and semantic decompression.",
          },
          {
            title: "Decoupled control space",
            body:
              "Instead of asking the model to directly render the final answer from an underspecified prompt, construct a control space containing variables, constraints, invariants, states, rubrics, dependencies, and validation signals.",
          },
          {
            title: "Governed Knowledge Objects",
            cards: [
              {
                title: "Condition",
                body:
                  "When does this piece of knowledge apply? A useful rule should not silently become universal.",
              },
              {
                title: "Strength and evidence",
                body:
                  "Was it inferred from one example, multiple failures, a test, a tool result, or expert validation?",
              },
              {
                title: "Priority and revocation",
                body:
                  "How should conflicts be resolved, and what observation should weaken or retire the rule?",
              },
            ],
          },
          {
            title: "A practical loop",
            bullets: [
              "Diagnose mismatch profile before choosing the workflow.",
              "Construct the task model and control space.",
              "Generate candidate GKOs from evidence, perturbations, and failures.",
              "Validate the GKOs against the strongest available signal.",
              "Render the final output from governed control knowledge, then monitor and revise.",
            ],
          },
        ],
      },
      collaboration: {
        key: "collaboration",
        path: "/collaboration",
        title: "Human-AI Collaboration: Govern the Missing Variable",
        navTitle: "Collaboration",
        kicker: "From chat-style use to governed collaboration",
        summary:
          "The best collaboration is not a fixed division of labor. It is variable governance: let AI process, search, simulate, and verify, while humans set values, supply preferences, authorize risk, and own responsibility.",
        heroPoints: [
          "AI should move the task forward until a human-governed variable blocks reliable continuation.",
          "The human should answer the smallest sufficient question, not take the whole task back.",
          "Reusable judgments should become governed escalation or knowledge objects.",
        ],
        sections: [
          {
            title: "Minimal Sufficient Human Query",
            body:
              "A good agent should not ask, 'What should I do?' It should ask the smallest question whose answer restores autonomous progress: a fact, preference, boundary, authorization, validation signal, resource, or stopping criterion.",
          },
          {
            title: "Operational mismatches",
            cards: [
              {
                title: "Observability",
                body:
                  "The agent lacks a task-critical real-world fact or state and cannot infer it reliably.",
              },
              {
                title: "Preference weight",
                body:
                  "Several options are plausible, but the ranking depends on human priorities such as speed, cost, risk, taste, or identity.",
              },
              {
                title: "Authority",
                body:
                  "The agent can prepare an action but should not publish, send, delete, buy, commit, or promise without authorization.",
              },
              {
                title: "Verification",
                body:
                  "The agent can generate a candidate but lacks tests, examples, evidence, expert review, or acceptance criteria.",
              },
            ],
          },
          {
            title: "Human role",
            bullets: [
              "Set the value function and unacceptable boundaries.",
              "Judge taste, timing, budget, and responsibility.",
              "Identify wrong abstractions when fluent output feels misdirected.",
              "Authorize external actions and own consequences.",
            ],
          },
        ],
      },
      learning: {
        key: "learning",
        path: "/learning",
        title: "Human Learning in the AI Era",
        navTitle: "Learning",
        kicker: "From skill execution to insight, feedback, and narrative",
        summary:
          "When AI becomes the default information-processing core, human learning should not abandon knowledge. It should move from shallow execution toward deep structure, feedback quality, insight, judgment, and long-term narrative.",
        heroPoints: [
          "AI makes shallow knowledge cheaper and deep knowledge more necessary.",
          "The scarce human capability is not doing every standard task by hand.",
          "The scarce capability is controlling, judging, validating, and meaningfully directing AI work.",
        ],
        sections: [
          {
            title: "Knowledge still matters",
            body:
              "Without domain structure, a person cannot see whether AI output is merely plausible, violates boundaries, optimizes the wrong proxy, misses hidden state, or improves locally while failing globally.",
          },
          {
            title: "The new learning target",
            bullets: [
              "Construct better problems.",
              "Recognize what counts as good.",
              "Guide search beyond default answers.",
              "Give feedback that changes structure, not only surface.",
              "Validate with evidence and accept responsibility for tradeoffs.",
            ],
          },
          {
            title: "Five core capacities",
            cards: [
              {
                title: "Knowledge base",
                body:
                  "Deep principles, mechanisms, and domain constraints that make judgment possible.",
              },
              {
                title: "Feedback ability",
                body:
                  "The ability to identify what failed, why it failed, and what variable should change next.",
              },
              {
                title: "Insight",
                body:
                  "Low-probability, high-value connections that exceed the default distribution.",
              },
              {
                title: "Value judgment",
                body:
                  "The ability to decide priorities, risk, identity, and acceptable tradeoffs.",
              },
              {
                title: "Narrative",
                body:
                  "The ability to organize knowledge, experience, and action into a long-term direction.",
              },
            ],
          },
        ],
      },
      papers: {
        key: "papers",
        path: "/papers",
        title: "Papers and Working Manuscripts",
        navTitle: "Papers",
        kicker: "Formalizing the framework",
        summary:
          "This section will collect papers, working drafts, notes, and empirical studies related to autoregressive mediocrity, autoregressive extraordinary, and Knowledge Governance.",
        heroPoints: [
          "Initial working manuscript: Knowledge Governance for Large Language Model Systems.",
          "Supplement: Human-Assist Operational Mismatches.",
          "Future work: empirical comparisons, ablations, and GKO system implementations.",
        ],
        sections: [
          {
            title: "Current working paper",
            body:
              "The initial manuscript argues that autoregressive mediocrity is predictable from four primitive mismatches and that the practical intervention is to transform difficult final-output tasks into lower-mismatch, positively aligned subtasks.",
          },
          {
            title: "Future empirical agenda",
            bullets: [
              "Compare Knowledge Governance against strong output-space search baselines under matched compute budgets.",
              "Measure when generated rubrics, edge cases, state matrices, and GKOs correlate with expert judgment.",
              "Study positive-alignment profiles for compression, semantic decompression, query formulation, and structured transformation.",
            ],
          },
        ],
      },
      projects: {
        key: "projects",
        path: "/projects",
        title: "Open-Source Projects",
        navTitle: "Projects",
        kicker: "Implementing GKO principles",
        summary:
          "Future projects will turn Knowledge Governance into reusable tools: GKO stores, validation loops, escalation protocols, task-control workbenches, and domain-specific governance templates.",
        heroPoints: [
          "GKO lifecycle tooling: create, validate, prioritize, weaken, revoke.",
          "Human escalation protocols based on Minimal Sufficient Human Queries.",
          "Benchmarks for detecting when output-space search plateaus.",
        ],
        sections: [
          {
            title: "Planned project types",
            cards: [
              {
                title: "GKO registry",
                body:
                  "A local or server-backed store for governed knowledge objects with conditions, strength, lifespan, and revocation rules.",
              },
              {
                title: "Escalation workbench",
                body:
                  "A tool that turns operational blockers into concise human questions with defaults and continuation plans.",
              },
              {
                title: "Mismatch diagnostics",
                body:
                  "A workflow that classifies tasks by aggregation, support, state, and specification mismatch before choosing an inference strategy.",
              },
            ],
          },
        ],
      },
    },
  },
  zh: {
    languageName: "中文",
    switchLabel: "English",
    repoLabel: "GitHub",
    repoUrl: "https://github.com/wxy2ab/against-llm-mediocrity",
    footer:
      "Against LLM Mediocrity 是一个英文优先、中文镜像的双语项目，关注 Knowledge Governance、自回归平庸与人机治理式协作。",
    pages: {
      home: {
        key: "home",
        path: "/zh/",
        title: "对抗 LLM 自回归平庸",
        navTitle: "首页",
        kicker: "从科普到科学，再到工程实践",
        summary:
          "LLM 很容易生成流畅、连贯、看起来合理的答案，但这不等于答案真正正确、有价值或卓越。本项目解释这种平庸如何产生、什么时候不会产生，以及怎样把默认生成改造成可治理的知识工作流。",
        heroPoints: [
          "把硬局限说清楚，而不是把每次失败都归因于 prompt 没写好。",
          "区分 LLM 原生擅长的任务与容易隐藏价值的任务。",
          "构造控制空间、验证循环和最小充分人类问题。",
        ],
        sections: [
          {
            eyebrow: "问题",
            title: "流畅输出不等于高任务价值。",
            body:
              "现在的 LLM 系统可以采样、批判、修订、检索、规划和调用工具。但在许多高价值任务中，系统仍会停留在局部合理、全局平庸的答案上。问题并不随机，往往来自模型容易生成的分布与任务真实价值函数之间的结构性错配。",
          },
          {
            eyebrow: "为什么重要",
            title: "理解硬局限，才能少走弯路。",
            cards: [
              {
                title: "减少 prompt 迷信",
                body:
                  "如果任务包含隐藏状态、低概率高价值结构或非局部约束，反复要求“再优化一版”可能只会得到更顺滑的平庸。",
                tag: "少做盲目重试",
              },
              {
                title: "在 LLM 卓越区使用 LLM",
                body:
                  "压缩、转换、分类、边界情况枚举、语义解压和提纲扩写常常与模型能力正向一致。",
                tag: "利用正向对齐",
              },
              {
                title: "知道人应该治理什么",
                body:
                  "人不只是校对员。人要设定价值、选择取舍、授权风险，并提供工具无法可靠推断的控制变量。",
                tag: "有意识地协作",
              },
            ],
          },
          {
            eyebrow: "项目路径",
            title: "从公开解释到开源系统。",
            bullets: [
              "先建立双语知识库，让问题本身可理解、可讨论。",
              "继续加入论文，形式化自回归平庸、自回归卓越与 Knowledge Governance。",
              "加入基于 GKO 原理的开源项目，实现控制对象、验证循环和人类升级协议。",
            ],
          },
        ],
      },
      science: {
        key: "science",
        path: "/zh/science",
        title: "科普：为什么 LLM 会平庸",
        navTitle: "科普",
        kicker: "用普通语言解释问题",
        summary:
          "核心不是 LLM 无用，也不是 LLM 注定失败。核心是：有些任务奖励模型容易生成的东西，有些任务奖励罕见、隐藏、延迟或未说明的结构。",
        heroPoints: [
          "自回归平庸是一种任务状态，不是道德评价。",
          "自回归卓越是相反状态：局部生成会复合成真实价值。",
          "实践问题是如何把任务从前者转化到后者。",
        ],
        sections: [
          {
            title: "什么是自回归平庸？",
            body:
              "它指的是模型不断生成合理、流畅、逐步改进的输出，但仍然离任务真正需要的答案很远。答案可以很多样、很漂亮，却仍停留在同一个低价值盆地里。",
          },
          {
            title: "什么是自回归卓越？",
            body:
              "有些任务天然符合模型优势：总结长上下文，把笔记变成结构化备忘录，转换语气，生成边界情况，或从好提纲扩写文本。此时自回归不是瓶颈，而是优势机制。",
          },
          {
            title: "常见弯路",
            cards: [
              {
                title: "抽象错了却继续润色",
                body:
                  "更好的语气不能修复错误的问题模型。要先抽取变量、状态、约束和成功条件。",
              },
              {
                title: "把缺状态误判成缺智能",
                body:
                  "如果价值取决于隐藏偏好、市场状态、法律边界或物理可供性，系统需要发现状态或询问人。",
              },
              {
                title: "高价值答案很罕见时还用投票",
                body:
                  "多数一致可能强化默认答案。此时需要尾部搜索、扰动、检索或结构验证。",
              },
            ],
          },
        ],
      },
      framework: {
        key: "framework",
        path: "/zh/framework",
        title: "科学框架：四类 primitive mismatch",
        navTitle: "框架",
        kicker: "解释为什么流畅生成会偏离真实价值",
        summary:
          "这个框架用四类原始错配解释自回归平庸：aggregation、support、state 和 specification mismatch。",
        heroPoints: [
          "Aggregation：局部改进不能组合成全局价值。",
          "Support：近似最优答案位于低概率或难到达区域。",
          "State：正确答案依赖隐藏或变化的状态。",
          "Specification：可访问代理目标偏离真实效用。",
        ],
        sections: [
          {
            title: "Aggregation mismatch",
            body:
              "全局价值不能通过局部改进相加得到。它常出现在叙事铺垫、战略一致性、软件架构、多步推理和任何一个局部选择会改变其他选择意义的任务中。",
          },
          {
            title: "Support mismatch",
            body:
              "最佳答案也许存在于模型分布中，但在实际预算下太罕见。更多采样可能提高平均质量，却仍错过决定性结构。",
          },
          {
            title: "State mismatch",
            body:
              "同一个输出在一种潜在状态下正确，在另一种状态下错误。因此系统需要显式状态假设、状态检查和撤销触发器。",
          },
          {
            title: "Specification mismatch",
            body:
              "代理目标不等于真实目标。答案可能满足 prompt、benchmark、rubric 或 evaluator，却漏掉真正重要的隐性标准。",
          },
          {
            title: "复合现象不一定是新 primitive",
            bullets: [
              "顺序敏感轨迹、噪声上下文构造失败、语料先验支配和动态规格浮现都很重要。",
              "但它们通常可以拆解为四类错配与表示方式、推理预算、控制策略之间的相互作用。",
              "保持分类克制很重要：每个诊断都应该导向不同干预。",
            ],
          },
        ],
      },
      engineering: {
        key: "engineering",
        path: "/zh/engineering",
        title: "工程实践：Knowledge Governance",
        navTitle: "工程",
        kicker: "把高错配任务转成可治理的低错配流程",
        summary:
          "Knowledge Governance 把最终渲染与任务特定控制知识的获取、验证、部署和修订分开。",
        heroPoints: [
          "不要只在最终答案空间里搜索。",
          "也要搜索中间控制对象。",
          "对系统学到的东西进行验证、排序、弱化和撤销。",
        ],
        sections: [
          {
            title: "从平庸到卓越的任务转化",
            body:
              "核心工程动作是把困难的最终输出任务重参数化为模型擅长的子任务：压缩、rubric 生成、状态枚举、边界情况发现、提纲构造、失败模式分析、查询生成和语义解压。",
          },
          {
            title: "解耦控制空间",
            body:
              "不要让模型直接从欠规格 prompt 渲染最终答案，而是先构造控制空间：变量、约束、不变量、状态、rubric、依赖关系和验证信号。",
          },
          {
            title: "Governed Knowledge Objects",
            cards: [
              {
                title: "适用条件",
                body:
                  "这条知识什么时候适用？有效规则不应该悄悄变成普遍真理。",
              },
              {
                title: "强度与证据",
                body:
                  "它来自一个样例、多次失败、测试、工具结果，还是专家验证？",
              },
              {
                title: "优先级与撤销",
                body:
                  "冲突如何解决？什么观察会削弱或废止这条规则？",
              },
            ],
          },
          {
            title: "一个实践循环",
            bullets: [
              "先诊断 mismatch profile，再选择工作流。",
              "构造任务模型和控制空间。",
              "从证据、扰动和失败中生成候选 GKO。",
              "用最强可得信号验证 GKO。",
              "从治理后的控制知识渲染最终输出，然后监控并修订。",
            ],
          },
        ],
      },
      collaboration: {
        key: "collaboration",
        path: "/zh/collaboration",
        title: "人机协作：治理缺失变量",
        navTitle: "协作",
        kicker: "从聊天式使用到治理式协作",
        summary:
          "最佳协作不是固定分工，而是变量治理：AI 负责处理、搜索、模拟和验证，人负责设定价值、提供偏好、授权风险并承担责任。",
        heroPoints: [
          "AI 应把任务推进到只剩人类变量阻塞可靠继续的位置。",
          "人应回答最小充分问题，而不是把整个任务接回来。",
          "可复用判断应沉淀为 GKO 或 GEO。",
        ],
        sections: [
          {
            title: "最小充分人类问题",
            body:
              "好 agent 不应该问“我该怎么办？”。它应该问能恢复自治的最小问题：一个事实、偏好、边界、授权、验证信号、资源或停止标准。",
          },
          {
            title: "执行层错配",
            cards: [
              {
                title: "Observability",
                body:
                  "agent 缺少任务关键的现实事实或状态，且无法可靠推断。",
              },
              {
                title: "Preference weight",
                body:
                  "多个方案都合理，但排序取决于速度、成本、风险、品味或身份等人类优先级。",
              },
              {
                title: "Authority",
                body:
                  "agent 可以准备动作，但不应在没有授权时发布、发送、删除、购买、承诺或签署。",
              },
              {
                title: "Verification",
                body:
                  "agent 能生成候选答案，但缺少测试、样例、证据、专家审查或验收标准。",
              },
            ],
          },
          {
            title: "人的角色",
            bullets: [
              "设定价值函数和不可接受边界。",
              "判断品味、时机、预算和责任。",
              "在流畅输出跑偏时识别错误抽象。",
              "授权外部动作并承担后果。",
            ],
          },
        ],
      },
      learning: {
        key: "learning",
        path: "/zh/learning",
        title: "AI 时代的人类学习",
        navTitle: "学习",
        kicker: "从技能执行转向洞察、反馈与叙事",
        summary:
          "当 AI 成为默认信息处理核心，人类学习不应该放弃知识，而应从浅层执行转向深层结构、反馈质量、洞察、判断和长期叙事。",
        heroPoints: [
          "AI 让浅知识更便宜，也让深知识更必要。",
          "稀缺能力不是亲手完成所有标准任务。",
          "稀缺能力是控制、判断、验证并有意义地引导 AI 工作。",
        ],
        sections: [
          {
            title: "知识仍然重要",
            body:
              "没有领域结构，人无法判断 AI 输出是否只是表面合理、是否违反边界、是否优化了错误 proxy、是否漏掉隐藏状态，或是否局部改进但全局失败。",
          },
          {
            title: "新的学习目标",
            bullets: [
              "构造更好的问题。",
              "识别什么才叫好。",
              "引导搜索走出默认答案。",
              "给出改变结构而不只是改变表面的反馈。",
              "用证据验证，并为取舍承担责任。",
            ],
          },
          {
            title: "五个核心能力",
            cards: [
              {
                title: "知识底座",
                body:
                  "让判断成为可能的深层原理、机制和领域约束。",
              },
              {
                title: "反馈能力",
                body:
                  "识别哪里失败、为什么失败、下一步应该改变哪个变量。",
              },
              {
                title: "洞察",
                body:
                  "超过默认分布的低概率、高价值连接。",
              },
              {
                title: "价值判断",
                body:
                  "决定优先级、风险、身份和可接受取舍。",
              },
              {
                title: "叙事",
                body:
                  "把知识、经验和行动组织成长期方向。",
              },
            ],
          },
        ],
      },
      papers: {
        key: "papers",
        path: "/zh/papers",
        title: "论文与工作稿",
        navTitle: "论文",
        kicker: "形式化框架",
        summary:
          "这里会收集与自回归平庸、自回归卓越和 Knowledge Governance 相关的论文、工作稿、研究笔记和实证研究。",
        heroPoints: [
          "初始工作稿：Knowledge Governance for Large Language Model Systems。",
          "补充稿：Human-Assist Operational Mismatches。",
          "未来工作：实证比较、消融实验和 GKO 系统实现。",
        ],
        sections: [
          {
            title: "当前工作论文",
            body:
              "初始论文主张：自回归平庸可以由四类 primitive mismatch 预测；实际干预是把困难最终输出任务转化为低错配、正向对齐的子任务。",
          },
          {
            title: "未来实证方向",
            bullets: [
              "在匹配推理预算下比较 Knowledge Governance 与强输出空间搜索 baseline。",
              "衡量生成的 rubric、edge cases、state matrix 和 GKO 是否与专家判断相关。",
              "研究压缩、语义解压、查询构造和结构化转换的正向对齐 profile。",
            ],
          },
        ],
      },
      projects: {
        key: "projects",
        path: "/zh/projects",
        title: "开源项目",
        navTitle: "项目",
        kicker: "实现 GKO 原理",
        summary:
          "未来项目会把 Knowledge Governance 变成可复用工具：GKO 存储、验证循环、升级协议、任务控制工作台和领域治理模板。",
        heroPoints: [
          "GKO 生命周期工具：创建、验证、排序、弱化、撤销。",
          "基于最小充分人类问题的人类升级协议。",
          "检测输出空间搜索何时 plateau 的 benchmark。",
        ],
        sections: [
          {
            title: "计划中的项目类型",
            cards: [
              {
                title: "GKO registry",
                body:
                  "用于保存治理知识对象的本地或服务端存储，包含条件、强度、寿命和撤销规则。",
              },
              {
                title: "Escalation workbench",
                body:
                  "把执行阻塞转化为简洁人类问题的工具，并附带默认动作和继续计划。",
              },
              {
                title: "Mismatch diagnostics",
                body:
                  "在选择推理策略前，先按 aggregation、support、state 和 specification mismatch 诊断任务。",
              },
            ],
          },
        ],
      },
    },
  },
};

export function normalizePath(pathname: string): { lang: Lang; key: PageKey } {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const lang: Lang = clean === "/zh" || clean.startsWith("/zh/") ? "zh" : "en";
  const segment = clean
    .replace(/^\/zh/, "")
    .replace(/^\//, "")
    .split("/")[0];

  const found = navOrder.find((key) => {
    const path = content.en.pages[key].path.replace(/^\//, "");
    return segment === path || (key === "home" && segment === "");
  });

  return { lang, key: found ?? "home" };
}

export function pagePath(lang: Lang, key: PageKey): string {
  return content[lang].pages[key].path;
}

export function alternatePath(lang: Lang, key: PageKey): string {
  return pagePath(lang === "en" ? "zh" : "en", key);
}
