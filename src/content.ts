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
        kicker: "A reader journey from intuition to mechanism to practice",
        summary:
          "LLMs can produce fluent answers long before they produce truly valuable answers. This project starts from that everyday experience, explains the mechanism behind it, and turns the theory into practical ways to use and build AI systems with less wasted effort.",
        heroPoints: [
          "When statistical probability and task value rise together, autoregression can be extraordinary.",
          "When probability and value point to different regions, fluent generation becomes mediocre.",
          "Most real tasks are locally aligned: some subtasks are extraordinary, while others need governance.",
        ],
        sections: [
          {
            eyebrow: "Why this exists",
            title: "The hard limit is not always intelligence. Sometimes it is task shape.",
            body:
              "A user asks for a strategy, a diagnosis, a design, a proof, or a plan. The model gives something clear, coherent, and even improved after several revisions. But the decisive variable is still missing. That is the phenomenon this project calls autoregressive mediocrity: not stupidity, not randomness, but a mismatch between the statistically likely continuation and the task's true value.",
          },
          {
            eyebrow: "What changes",
            title: "Once you understand the mechanism, you stop fighting the model in the wrong place.",
            cards: [
              {
                title: "Stop treating every failure as a prompt failure",
                body:
                  "Some failures are not fixed by asking for more depth, more creativity, or a cleaner style. The task may need a different representation before generation becomes useful.",
                tag: "Fewer blind retries",
              },
              {
                title: "Use LLMs where they are naturally strong",
                body:
                  "LLMs can be extraordinary at compression, transformation, comparison, edge-case generation, and rendering from a good structure. The point is to move more work into those regimes.",
                tag: "Positive alignment",
              },
              {
                title: "Know what humans must govern",
                body:
                  "Humans should not merely proofread fluent drafts. They should set values, choose tradeoffs, authorize risk, and supply missing control variables.",
                tag: "Better collaboration",
              },
            ],
          },
          {
            eyebrow: "Where this is going",
            title: "The site is a public explanation layer for future papers and open systems.",
            bullets: [
              "The public layer explains the problem without requiring readers to begin with the paper.",
              "The theory layer develops autoregressive mediocrity, extraordinary regimes, four primitive mismatches, and Knowledge Governance.",
              "The engineering layer will grow into open-source tools for GKO-style control objects, validation loops, and human escalation protocols.",
            ],
          },
        ],
      },
      science: {
        key: "science",
        path: "/science",
        title: "Why It Matters",
        navTitle: "Why It Matters",
        kicker: "A plain-language entry point",
        summary:
          "The important point is not that LLMs are useless or doomed. The point is that fluent generation can hide the difference between an answer that sounds good and an answer that reaches the structure the task actually needs.",
        heroPoints: [
          "A model can improve surface quality while staying inside the same wrong abstraction.",
          "Repeated refinement can make a mediocre answer more convincing.",
          "Understanding the hard limit tells you when to prompt, when to restructure, and when to ask a human or a tool.",
        ],
        sections: [
          {
            title: "The everyday version of the problem",
            body:
              "You ask an LLM to solve a hard task. It gives a plausible answer. You ask it to improve the answer. It becomes smoother, clearer, more complete, maybe even more persuasive. But the decisive missing thing remains missing: the hidden assumption, the rare option, the real constraint, the state change, the wrong objective, or the structure that makes the answer actually work.",
          },
          {
            title: "Why more iteration can still fail",
            body:
              "Iteration helps when each local improvement points toward the real goal. It fails when local polish is not the bottleneck. If the task depends on a hidden state, a low-probability insight, a global dependency, or a value criterion that was never made explicit, another fluent draft may simply decorate the same mistake.",
          },
          {
            title: "Where understanding saves time",
            cards: [
              {
                title: "Do not polish the wrong abstraction",
                body:
                  "If the model represented the task incorrectly, style improvements are cosmetic. First identify the variables, constraints, states, and success conditions.",
              },
              {
                title: "Do not confuse missing state with missing intelligence",
                body:
                  "If the right answer depends on a user preference, market regime, legal boundary, or physical context, the system needs observation, validation, or a targeted human answer.",
              },
              {
                title: "Do not vote your way into the default answer",
                body:
                  "When the best answer is rare, majority agreement can reinforce the common answer. You need tail search, perturbation, retrieval, or structural validation.",
              },
            ],
          },
        ],
      },
      framework: {
        key: "framework",
        path: "/framework",
        title: "Mechanism",
        navTitle: "Mechanism",
        kicker: "The paper-facing theory behind the public explanation",
        summary:
          "The theory treats autoregressive mediocrity as a task- and budget-dependent regime. It appears when the reachable distribution of fluent outputs is poorly aligned with the task's true value landscape.",
        heroPoints: [
          "Autoregressive mediocrity: fluent, plausible outputs remain concentrated away from high-value regions.",
          "Autoregressive extraordinary: local continuation and task value reinforce each other.",
          "Four primitive mismatches explain when the first regime is likely to appear.",
        ],
        sections: [
          {
            title: "From output fluency to value alignment",
            body:
              "The central scientific question is not whether a model can generate good text. It is whether the generation process exposes and preserves the variables that determine task value. In many tasks, the fluent output space is too close to the proxy objective and too far from the real one.",
          },
          {
            title: "The four primitive mismatches",
            cards: [
              {
                title: "Aggregation",
                body:
                  "Local improvements do not reliably compose into global value. The task depends on long-range coordination, delayed payoff, or coupled constraints.",
              },
              {
                title: "Support",
                body:
                  "Near-optimal solutions are low probability or hard to reach under the available inference budget and search operators.",
              },
              {
                title: "State",
                body:
                  "The ranking of outputs depends on hidden, changing, or underspecified states that are not fully contained in the prompt.",
              },
              {
                title: "Specification",
                body:
                  "The accessible proxy objective diverges from the true objective: the answer can satisfy the prompt while missing what actually matters.",
              },
            ],
          },
          {
            title: "Why extraordinary regimes matter",
            body:
              "The framework is not anti-autoregression. It also names the opposite regime: autoregressive extraordinary. When the model's local continuation tendencies align with value, tasks such as context compression, taxonomy generation, edge-case enumeration, register transfer, query formulation, and semantic decompression can become unusually effective.",
          },
          {
            title: "Derivative patterns should be explained, not endlessly renamed",
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
        title: "Governance",
        navTitle: "Governance",
        kicker: "Concrete engineering practice based on the mechanism",
        summary:
          "The engineering move is to stop asking the model to solve every hard task directly in final-answer space. Instead, build intermediate control objects that make the task easier to generate, verify, reuse, and revise.",
        heroPoints: [
          "Reparameterize hard tasks into lower-mismatch subtasks.",
          "Represent task-specific control knowledge outside the final prose.",
          "Validate, prioritize, weaken, and revoke that knowledge over time.",
        ],
        sections: [
          {
            title: "What to do differently tomorrow",
            body:
              "Before asking for another final answer, ask what intermediate object would change the task shape: a state matrix, rubric, dependency graph, failure-mode list, edge-case set, query plan, construal extraction, or structural outline. These are often tasks where LLMs are strong, and they give the final renderer something better to render from.",
          },
          {
            title: "Knowledge Governance",
            body:
              "Knowledge Governance separates final rendering from the acquisition and management of task-specific control knowledge. The goal is not to make a heavier prompt. The goal is to create a control layer where important assumptions, constraints, preferences, and failure conditions can be tested and revised.",
          },
          {
            title: "Governed Knowledge Objects in practice",
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
        kicker: "从直觉问题，到机制解释，再到实践方法",
        summary:
          "LLM 可以很早就生成流畅答案，但很晚才真正生成高价值答案。本项目先从日常可感知的问题讲起，再解释背后的机制，最后把理论转化成更少走弯路的 AI 使用与工程方法。",
        heroPoints: [
          "当统计概率与任务价值同向上升时，自回归可以带来卓越。",
          "当概率与价值指向不同区域时，流畅生成会变成平庸。",
          "绝大多数真实任务是局部对齐：部分子任务卓越，部分子任务需要治理。",
        ],
        sections: [
          {
            eyebrow: "为什么要做",
            title: "硬局限不总是“智能不够”，有时是任务形状不对。",
            body:
              "用户让模型做战略、诊断、设计、证明或计划。模型给出清楚、连贯、甚至多轮修改后更好的答案，但决定价值的变量仍然缺失。这里说的自回归平庸，不是笨，也不是随机，而是统计上容易生成的延续与任务真正奖励的价值发生了错配。",
          },
          {
            eyebrow: "理解之后会改变什么",
            title: "理解机制后，就不会在错误的位置和模型较劲。",
            cards: [
              {
                title: "不再把每次失败都当成 prompt 失败",
                body:
                  "有些失败不是靠“更深入一点”“更有创意一点”“语气更好一点”解决的。任务可能需要先换一种表示方式。",
                tag: "减少盲目重试",
              },
              {
                title: "把 LLM 用在它天然强的地方",
                body:
                  "LLM 在压缩、转换、比较、边界情况生成、从好结构渲染文本等任务上可能非常强。关键是把更多工作转移到这些正向对齐的任务形态里。",
                tag: "利用正向对齐",
              },
              {
                title: "知道人类到底要治理什么",
                body:
                  "人不只是校对流畅草稿的人。人要设定价值、选择取舍、授权风险，并提供系统无法可靠推断的控制变量。",
                tag: "有意识地协作",
              },
            ],
          },
          {
            eyebrow: "项目会往哪里走",
            title: "这个网站是未来论文和开源系统的公共解释层。",
            bullets: [
              "公共解释层先让不读论文的人也能理解这个问题。",
              "理论层继续展开自回归平庸、自回归卓越、四类 primitive mismatch 与 Knowledge Governance。",
              "工程层会逐步加入基于 GKO 原理的开源工具，实现控制对象、验证循环和人类升级协议。",
            ],
          },
        ],
      },
      science: {
        key: "science",
        path: "/zh/science",
        title: "为什么重要",
        navTitle: "为什么重要",
        kicker: "通俗解释入口",
        summary:
          "关键不是说 LLM 没用，也不是说 LLM 注定失败。关键是：流畅生成会掩盖“听起来好”和“真正到达任务结构”之间的差距。",
        heroPoints: [
          "模型可能在表面质量上进步，却仍停留在同一个错误抽象里。",
          "多轮修改可能让平庸答案更有说服力。",
          "理解硬局限后，才知道什么时候该提示，什么时候该重构任务，什么时候该问人或调用工具。",
        ],
        sections: [
          {
            title: "日常版本的问题",
            body:
              "你让 LLM 做一个困难任务。它给出一个合理答案。你让它改进，它变得更顺、更清楚、更完整，甚至更有说服力。但真正缺失的东西仍然缺失：隐藏假设、稀有选项、真实约束、状态变化、错误目标，或让答案真正成立的结构。",
          },
          {
            title: "为什么多轮修改仍会失败",
            body:
              "当每个局部改进都指向真实目标时，多轮迭代很有用。但如果瓶颈不是局部润色，而是隐藏状态、低概率洞察、全局依赖或没有外化的价值标准，那么另一个流畅草稿可能只是把同一个错误装饰得更漂亮。",
          },
          {
            title: "理解之后能少走哪些弯路",
            cards: [
              {
                title: "不要润色错误抽象",
                body:
                  "如果模型对任务的表示方式错了，风格改进只是表层变化。要先识别变量、约束、状态和成功条件。",
              },
              {
                title: "不要把缺状态误判成缺智能",
                body:
                  "如果正确答案取决于用户偏好、市场状态、法律边界或物理环境，系统需要观察、验证或向人提出有针对性的问题。",
              },
              {
                title: "不要用投票强化默认答案",
                body:
                  "当最好答案很罕见时，多数一致可能强化常见答案。此时需要尾部搜索、扰动、检索或结构验证。",
              },
            ],
          },
        ],
      },
      framework: {
        key: "framework",
        path: "/zh/framework",
        title: "机制",
        navTitle: "机制",
        kicker: "公共解释背后的论文式理论",
        summary:
          "理论上，自回归平庸是一种与任务、表示和预算有关的状态：在可达的流畅输出分布与任务真实价值景观之间，存在系统性错配。",
        heroPoints: [
          "自回归平庸：流畅、合理的输出仍集中在远离高价值区域的位置。",
          "自回归卓越：局部延续倾向与任务价值相互强化。",
          "四类 primitive mismatch 解释第一种状态何时容易出现。",
        ],
        sections: [
          {
            title: "从输出流畅性到价值对齐",
            body:
              "核心科学问题不是模型能不能生成好看的文本，而是生成过程是否暴露并保留了决定任务价值的变量。很多任务里，流畅输出空间离 proxy 很近，却离真实目标很远。",
          },
          {
            title: "四类 primitive mismatch",
            cards: [
              {
                title: "Aggregation",
                body:
                  "局部改进不能可靠组合成全局价值。任务依赖长程协调、延迟回报或耦合约束。",
              },
              {
                title: "Support",
                body:
                  "近似最优答案在当前推理预算和搜索算子下概率很低，或者很难到达。",
              },
              {
                title: "State",
                body:
                  "输出排序依赖隐藏、变化或未说明的状态，而这些状态没有完整包含在 prompt 里。",
              },
              {
                title: "Specification",
                body:
                  "可访问代理目标偏离真实目标：答案可以满足 prompt，却错过真正重要的标准。",
              },
            ],
          },
          {
            title: "为什么自回归卓越同样重要",
            body:
              "这个框架并不是反对自回归。它也命名了相反状态：自回归卓越。当模型的局部延续倾向与价值对齐时，上下文压缩、分类生成、边界情况枚举、语气转换、查询构造和语义解压都可能非常有效。",
          },
          {
            title: "复合现象应该被解释，而不是无限命名",
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
        title: "治理方法",
        navTitle: "治理方法",
        kicker: "基于机制的具体工程应用",
        summary:
          "工程上的关键动作，是不要让模型把所有困难任务都直接在最终答案空间里解决，而是构造中间控制对象，让任务更容易生成、验证、复用和修订。",
        heroPoints: [
          "把高错配任务重参数化为低错配子任务。",
          "把任务特定控制知识表示在最终文本之外。",
          "对这些知识进行验证、排序、弱化和撤销。",
        ],
        sections: [
          {
            title: "明天就可以改变的做法",
            body:
              "在要求模型再给一个最终答案之前，先问：什么中间对象会改变任务形状？状态矩阵、rubric、依赖图、失败模式列表、边界情况集合、查询计划、场景抽取或结构提纲，往往都是 LLM 更擅长的任务，也能给最终渲染提供更好的依据。",
          },
          {
            title: "Knowledge Governance",
            body:
              "Knowledge Governance 把最终渲染与任务特定控制知识的获取和管理分开。它不是把 prompt 写得更长，而是建立一个控制层，让重要假设、约束、偏好和失败条件可以被测试、修订和复用。",
          },
          {
            title: "Governed Knowledge Objects 的实践形态",
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
