# 对抗 LLM 平庸

> 识别 LLM 的结构性天花板，并找到能落地的工程解法。

模型在持续迭代，能力也在持续增强。但有一个更值得反过来问的问题：模型训练迭代，真的能解决所有问题吗？

对于今天 LLM 仍然解决不好的问题，我们究竟应该继续等待下一轮训练、下一代模型、下一次 scaling，还是应该承认一个更基础的事实——LLM 的一些能力边界，尤其是由算法与架构共同决定的那部分，本来就存在结构性的天花板？

这个站点给出的答案很明确：**有些问题确实属于 LLM 的结构性天花板，不能指望仅靠继续训练自动消失。** 更有意义的工作，是识别这些天花板究竟是什么，以及如何用工程手段绕开、约束、补偿或重构它们。

## 阅读这个站点，你会获得什么

- **识别 LLM 的结构性缺陷**，不在训练迭代难以奏效的地方继续浪费时间；
- **找到应对结构性缺陷的工程思路**，在模型之外补上关键能力；
- **理解下一代 agent 范式**为什么必须走向治理、状态与控制对象。

`against-llm-mediocrity` 试图把这套判断落成一门共同的工程语言：用一小组术语来命名结构性天花板出现在哪里，并判断修复应该放在模型内、模型外，还是人机边界上。

## 核心词汇表

下面先给出这套词汇表，每个术语配一句话定义（更完整的解释见后文「核心概念」）：

- **LLM 平庸**：模型最容易生成的方向和任务真正高价值的方向不一致，于是继续采样或润色只会让答案更顺，却不会更对。
- **局部对齐**：模型的局部操作（压缩、改写、比较）只与*部分*任务价值对齐，这种一致是有条件的，撑不起整条任务。这也是现实中最常见的区间。
- **LLM 卓越**：流畅性和习得表征在整条任务链上与任务价值同向发力，此时自回归反而成为优势。
- **六类原始失配**：一套诊断分类，命名价值保存管线失效的六种结构性原因——聚合、支持、状态、规格、拟合边界、观测-表征。
- **知识治理**：把经过验证的、任务特定的控制知识从生成中分离出来，存成可复用的对象。
- **受治理知识对象（GKO）**：一份经过验证的控制知识，让下游生成从它出发，而不是从模型默认概率出发。
- **受治理执行对象（GExO）**：一类需要被显式跟踪的任务、计划、行动或工作流执行对象。
- **受治理升级对象（GEsO）**：一条存下来的规则，规定什么时候该问人、问什么、问谁。
- **审计工程**：把审计当成独立的一层，用来定位失败并把修复回写进控制对象，而不是当成事后的打分器。
- **状态治理智能体范式（SGAR）**：一种 agent 设计，把长程执行搬到外部硬状态层，让计划、行动、验证、升级都成为受治理的状态转移。
- **治理式人机协作**：围绕控制变量组织协作（AI 推进可搜索的部分，人治理价值、偏好与责任），而不是围绕任务分工。

术语说明：为避免 `GEO` 同时表示执行对象与升级对象，本站后续统一使用 `GExO` 表示受治理执行对象，`GEsO` 表示受治理升级对象。

> **该怎么读这些材料**
>
> 这些内容源自工程实践和工程直觉，再被提炼成能反过来指导实践的理论框架。因此衡量标准是工程上的实际收益，而不是数学上的完备性。请把其中的理论部分当作可能随时调整的思维脚手架，而不是已经定稿的理论研究。

站点地址：<https://wxy2ab.github.io/against-llm-mediocrity/>

---

## 1. 项目想解决什么

LLM 已经很擅长写代码、写邮件、做总结、解释概念、起草方案。但当任务需要长程协调、隐藏状态、稀有结构、真实世界约束、显式价值判断或责任承担时，仅靠「再来一版」或「换个 prompt」通常会越改越稳，却未必越改越对。

本项目不与任何具体模型绑定。它关心三件事：

1. 哪些失败不是暂时能力不足，而是结构性天花板在起作用；
2. 如何把局部对齐转化为可验证、可治理、可复用的工程修复；
3. 当结构性天花板无法被训练直接抹平时，agent 与人的协作范式应当如何重构。

---

## 2. 核心概念

### 三种对齐区间

- **LLM 平庸**：模型最易生成的方向和任务真正高价值的方向不同。继续采样或润色只会让答案更顺、更完整，但不会变得更有价值。
- **局部对齐**：模型的局部操作（压缩、改写、列举、比较、生成结构）与任务价值的某些部分对齐，但这种一致是局部的、有条件的，还不足以保证全局成功。这也是现实中最常见的区间。
- **LLM 卓越**：局部续写倾向、流畅性、习得的语义表征与任务价值在整条任务链上同向发力。自回归不再拖后腿，反而成为优势。上下文压缩、语义映射、语体迁移、结构化转换等任务经常属于这一区间。

### 六类原始失配

它们不是给失败贴标签，而是用来预测普通输出空间搜索何时会进入平台期：

- **聚合失配**：局部好片段组合不出全局价值。
- **支持失配**：高价值结构位于低概率或低支持区域。
- **状态失配**：真实价值依赖隐藏、动态或部分可观测的状态。
- **规格失配**：系统能优化的代理目标偏离真实目标。
- **拟合边界失配**：模型已学能力的隐式触发边界与它的真实适用边界不一致，因而同时出现过触发与欠触发。
- **观测-表征失配**：决定性世界变量没有通过观测、编码、上下文、工具或控制表征通道进入模型可操作表征。

### 知识治理

把任务特定的控制知识从生成过程中分离出来，验证之后存为**受治理知识对象（GKO）**，把任务、计划和动作的执行约束存为**受治理执行对象（GExO）**，把「什么时候该问人、问什么、问谁」存为**受治理升级对象（GEsO）**。这样，下游生成可以从受治理状态出发，而不是从模型默认概率出发。

### 审计工程

不把审计当成生成之后的打分器，而是当成发现真实目标、定位失配、回写控制对象、保留失败轨迹并防止下一轮退化的独立工程层。审计循环的产物是可执行的控制增量，而不是语言评论。

### 治理式协作

不再围绕「任务分工」组织协作，而围绕「控制变量」组织协作。AI 推进可处理、可搜索、可验证的部分；人治理价值、偏好、授权、品味和责任；系统把可复用判断沉淀为 GKO/GEsO。

### 状态治理智能体范式（SGAR）

把长程 agent 的运行基础从上下文叙事转移到外部硬状态：LLM 负责理解、提案、探索和执行；硬状态层负责定位、约束、验证、提交、恢复和审计。这样，计划、行动、验证、升级和审计发现都进入受治理状态转移，而不是只停留在聊天记录里。

---

## 3. 仓库结构

```text
against-llm-mediocrity/
├── content/
│   ├── en/                    # 英文站点正文（VitePress 路由 /en/*）
│   └── zh/                    # 中文站点正文（VitePress 路由 /zh/*）
├── docs/
│   ├── *.md                   # 英文工作稿
│   └── *.zh-CN.md             # 中文工作稿（论文与实践稿）
├── public/                    # 静态资源
├── src/                       # 站点源码与 VitePress 自定义
├── scripts/                   # 构建与同步脚本
├── .github/                   # Pages 部署工作流
├── package.json
└── README.zh.md               # 本文件
```

---

## 4. 站点与文档

### 站点正文（[content/zh](./content/zh)）

按读者路径分层的解释层：

| 入口 | 路径 | 适合读者 |
| --- | --- | --- |
| 首页 | [/zh/](https://wxy2ab.github.io/against-llm-mediocrity/zh/) | 第一次接触项目的人 |
| 为什么重要 | [/zh/science](https://wxy2ab.github.io/against-llm-mediocrity/zh/science) | 想理解现象而非术语的人 |
| 案例 | [/zh/case-study](https://wxy2ab.github.io/against-llm-mediocrity/zh/case-study) | 想看真实系统的人 |
| 机制 | [/zh/framework](https://wxy2ab.github.io/against-llm-mediocrity/zh/framework) | 想看理论定义的人 |
| 治理 | [/zh/engineering](https://wxy2ab.github.io/against-llm-mediocrity/zh/engineering) | 想把理论用于工程的人 |
| 协作 | [/zh/collaboration](https://wxy2ab.github.io/against-llm-mediocrity/zh/collaboration) | 想用 AI agent 推进任务的人 |
| 学习 | [/zh/learning](https://wxy2ab.github.io/against-llm-mediocrity/zh/learning) | 想重新理解「人该学什么」的人 |
| 工作稿 | [/zh/papers](https://wxy2ab.github.io/against-llm-mediocrity/zh/papers) | 想看工作稿与研究议程的人 |
| 项目 | [/zh/projects](https://wxy2ab.github.io/against-llm-mediocrity/zh/projects) | 想把它落到工具的人 |

### 案例详情

- [Story Insight V4](/zh/case-study-v4)：把故事拆成 `LogicSpace`（逻辑空间），把生成、改写、攻击、修复、回归治理构成完整闭环。
- [Story Insight V6](/zh/case-study-v6)：在高阈值下把失败路由到元空间、逻辑空间、文本、连续性、评价契约，并识别平台期。
- [Stock Rec V3](/zh/case-study-stock-rec-v3)：在金融策略生产中让 LLM 仅参与发现，不赋予生产权；所有影响策略的对象都必须经过 shadow、promotion、active 生命周期。
- [FW-Insight V3](/zh/case-study-fwinsight-v3)：从大量已生成因子框架样本中提取能改变下一轮再生的硬经验。

### 工作稿（[docs](./docs)）

这些都是工作稿，每篇提供中英双语。链接后的一句话说明它讲什么、值不值得读。

- [LLM 系统中价值保存的结构理论](./docs/structural-theory-value-preservation-llm-systems.zh-CN.md)：新的结构理论工作稿。
- [LLM 系统中的六类原始失配](./docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)：从价值保存管线推导六类原始失配的总览工作稿。
- [六类原始失配的工程来源](./docs/engineering-origins-of-six-primitive-mismatches.zh-CN.md)：记录六类失配如何从量化采样、故事生成、金融任务与日常工程挫败中一步步长出来。
- [受治理 LLM 对象模型与接口规范](./docs/governed-llm-object-model-interface-specification.zh-CN.md)：价值保存结构理论的配套实现规范。
- [面向受治理 LLM 系统的审计工程](./docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)：失败定位、控制空间写回与回归治理的配套技术报告。
- [Oracle、Audit Agent 与 SGAR：从硬反馈到引擎路由的统一框架](./docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)：把 oracle 分类、audit、SGAR 与 No-Go 统一到同一引擎路由判断链中的工作稿。
- [面向受治理 LLM 系统的状态治理智能体范式](./docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)：硬状态权威、转移契约与运行时治理的新工作稿。
- [LLM 系统中的观测-表征失配与通道治理](./docs/observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)：变量进入、表征上限与前治理修复的配套技术报告。
- [LLM 系统中的状态失配与状态治理](./docs/state-mismatch-state-governance-llm-systems.zh-CN.md)：潜在状态、状态判别与状态条件化控制的配套技术报告。
- [LLM 系统中的拟合边界失配与能力路由](./docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md)：能力领域、触发边界与路由治理的配套技术报告。
- [LLM 系统中的支持失配与控制空间搜索](./docs/support-mismatch-control-space-search-llm-systems.zh-CN.md)：可达性、候选支持与搜索治理的配套技术报告。
- [LLM 系统中的聚合失配与组合治理](./docs/aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)：局部价值、全局失败与组合关系治理的配套技术报告。
- [聚合失配与生成—验证不对称：受控实验证据](./docs/aggregation-mismatch-generation-verification-asymmetry-evidence.zh-CN.md)：用边界拓扑、候选审计、长度与排除性对照说明局部规则能力为何不自动组成全局构造能力。
- 聚合失配 artifact-v4 裁决：[English](./docs/aggregation-mismatch-v4-claims-theory-gap.md) · [中文](./docs/aggregation-mismatch-v4-claims-theory-gap.zh-CN.md)：汇总已完成 756 次边界状态、候选/接口、独立预算与顺序实验，区分实验能证明的结论、尚未兑现的理论预测，以及对应的 Agent 调整。
- 聚合失配 artifact-v5 稳定编辑 Agent：[English](./docs/aggregation-mismatch-v5-stable-editing-agent.md) · [中文](./docs/aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)：汇总 288-arm 原生工具实验；正确计划后的 Patch 交付优势成立，端到端 Agent claim 因 planning floor 未通过，crossover 仍未裁决。
- Patch 与完整重写：稀疏修复交付接口的受控实验：[English](./docs/patch-vs-full-rewrite-controlled-experiment.md) · [中文](./docs/patch-vs-full-rewrite-controlled-experiment.zh-CN.md)：用 DeepSeek artifact-v3、oracle edit-plan、纯复制与独立 900 秒对照，确认稀疏修复中 patch + 确定性执行器的预算内严格可靠性优势。
- 聚合失配：可推导命题、证明条件与 Agent 工程含义：[English](./docs/aggregation-mismatch-theoretical-claims-agent-engineering.md) · [中文](./docs/aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)：区分可由信息量、依赖图和程序语义推出的结论与必须实验校准的命题，并把 patch、边界状态、验证闸门、增量验证、并行合并和权威状态转化为 agent 设计原则。
- [LLM 系统中的规格失配与目标治理](./docs/specification-mismatch-objective-governance-llm-systems.zh-CN.md)：代理目标、隐性效用与反例驱动规格修复的配套技术报告。
- 面向受治理 LLM 系统的形式化机制层：[English](./docs/formal-mechanism-layer-for-governed-llm-systems.md) · [中文](./docs/formal-mechanism-layer-for-governed-llm-systems.zh-CN.md)：把结构性诊断接到八条可干预机制轴。
- 面向受治理 LLM 系统的诊断-机制桥接：[English](./docs/diagnostic-mechanism-bridge-for-governed-llm-systems.md) · [中文](./docs/diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md)：把六类原始失配翻译成修复定位与修复层选择。
- 面向受治理 LLM 系统的机制驱动训练：[English](./docs/mechanism-driven-training-for-governed-llm-systems.md) · [中文](./docs/mechanism-driven-training-for-governed-llm-systems.zh-CN.md)：把反复出现的学习组件失败提升为可摊销的训练信号。
- [Human-Assist Operational Mismatches](./docs/human-assist-operational-mismatches.zh-CN.md)：协作层失配与升级协议。
- [治理式人机协作](./docs/governed-human-ai-collaboration.zh-CN.md)：从聊天式使用到变量治理。
- [AI 的认知纪律](./docs/cognitive-discipline-for-ai.zh-CN.md)：AI 使用侧的认知框架。
- [模型最高价格](./docs/maximum-price-of-llms.zh-CN.md)：LLM 定价与商品化的数学。

### 旧版本

保留下来供参考的早期草稿，已被上面的新版取代，但仍被引用。

- LLM 失败的形式化机制层：[English](./docs/formal-mechanism-layer.md) · [中文](./docs/formal-mechanism-layer.zh-CN.md)：机制层最初的写法。
- Knowledge Governance for Large Language Model Systems：[English](./docs/knowledge-governance-llm-systems-local-alignment.md) · [中文](./docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)：知识治理与局部对齐的首次完整表述。
- 观测-表征失配专题：[English](./docs/observation-representation-mismatch.md) · [中文](./docs/observation-representation-mismatch.zh-CN.md)：观测-表征失配的独立专题。
- 拟合边界失配专题：[English](./docs/fitting-boundary-mismatch.md) · [中文](./docs/fitting-boundary-mismatch.zh-CN.md)：拟合边界失配的独立专题。
- Audit Engineering：[English](./docs/audit-engineering.md) · [中文](./docs/audit-engineering.zh-CN.md)：早期的审计与写回工程笔记。
- 状态治理智能体范式（SGAR）：[English](./docs/state-governed-agent-regime.md) · [中文](./docs/state-governed-agent-regime.zh-CN.md)：早期的 SGAR 草稿。

---

## 5. 本地开发

仓库使用 [VitePress](https://vitepress.dev/) 构建双语站点。

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:5173）
npm run dev

# 构建静态站点
npm run build

# 预览构建结果
npm run preview
```

部署到 GitHub Pages 的工作流位于 `.github/workflows/`。`main` 分支上的提交会触发自动构建与发布。

---

## 6. 贡献方向

这个项目欢迎一切能让「对抗 LLM 平庸」变得更可操作、更可证伪的贡献。

特别欢迎这几类内容：

- **真实任务案例**：哪些任务里 LLM 表面表现很好，但最终价值不稳定。
- **工程模式**：你如何把任务拆成控制对象、验证对象、评分规约或人类决策点。
- **失败样本**：哪些 prompt、agent 或 workflow 看起来合理，但最后被证明不可控。
- **概念修正**：对「LLM 平庸」「局部对齐」「失配」「控制空间」等概念的反例、补充或更清晰的表达。
- **工具实现**：能把这些治理动作落到代码、模板、评估器或工作流里的最小组件。

贡献不一定一开始就完整。一个具体失败案例、一段可复现流程、一个更准确的术语、一次有证据的反驳，都比泛泛而谈更有价值。

---

## 7. 项目定位

这组工作稿目前更像研究框架与开源宣言，而不是已经封闭完成的理论。它们的目标，是提供一套可讨论、可实现、可验证的语言，用来描述 LLM 什么时候会平庸、什么时候会卓越，以及人与系统应当怎样把局部能力转化为稳定的任务价值。

我们不认为这一框架是唯一可能的描述，也不认为它必须被全盘接受。它最大的价值，是把「继续改 prompt」这种直觉升级为可审计、可回归、可撤销的工程过程。

如果它对你的真实任务有用，那它就值得被继续打磨；如果它在某些场景里失效，那它也正需要你的反例。

---

## 8. 许可与致谢

本仓库的内容以 MIT 协议发布。引用其中的工作稿、案例、框架与术语时，请注明来源。

如果你在论文、产品或内部项目里使用了其中概念，欢迎在 Issues 或 Discussions 中留言，这能帮助我们持续完善框架与案例。
