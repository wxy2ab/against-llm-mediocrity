# 对抗 LLM 平庸

> 在最常见的挫败里发现 LLM 的真实边界。

`against-llm-mediocrity` 是一个关于"为什么 LLM 经常给出流畅但平庸的答案"的研究与开源项目。我们把这种现象归为 **LLM 平庸**——模型表面表现很好，却一直无法真正完成高价值任务。围绕它，我们提出了 **局部对齐**、**LLM卓越**、**六类原始失配**、**知识治理**、**受治理知识对象（GKO）/ 受治理升级对象（GEO）**、**审计工程**、**状态治理型 Agent 体制（SGAR）** 和 **治理式人机协作** 这套语言，并把它落到故事生成、金融策略和因子框架再生等案例里。

站点地址：<https://wxy2ab.github.io/against-llm-mediocrity/>

---

## 1. 项目想解决什么

LLM 已经很擅长写代码、写邮件、做总结、解释概念、起草方案。但当任务需要长程协调、隐藏状态、稀有结构、真实状态、显式价值判断或责任承担时，仅靠"再来一版"或"换个 prompt"通常越改越稳，却越改越平庸。

本项目不与任何具体模型绑定。它关心三件事：

- 为什么 LLM 会停在看似合理却次优的输出区域；
- 如何把局部对齐转化为LLM卓越；
- 在哪些条件下，AI 与人的分工应该从"任务切分"走向"变量治理"。

---

## 2. 核心概念

### 三种对齐区间

- **LLM 平庸**：模型最易生成的方向和任务真正高价值的方向不同。继续采样或润色只会让答案更顺、更完整，但不会变得更有价值。
- **局部对齐**：模型的局部操作（压缩、改写、列举、比较、生成结构）与任务价值的某些部分对齐，但这种一致是局部的、有条件的，还不足以保证全局成功。这也是现实中最常见的区间。
- **LLM卓越**：局部续写倾向、流畅性、习得的语义表征与任务价值在整条任务链上同向发力。自回归不再拖后腿，反而成为优势。上下文压缩、语义映射、语体迁移、结构化转换等任务经常属于这一区间。

### 六类原始失配

它们不是给失败贴标签，而是用来预测普通输出空间搜索何时会进入平台期：

- **聚合失配**：局部好片段组合不出全局价值。
- **支持失配**：高价值结构位于低概率或低支持区域。
- **状态失配**：真实价值依赖隐藏、动态或部分可观测的状态。
- **规格失配**：系统能优化的代理目标偏离真实目标。
- **拟合边界失配**：模型已学能力的隐式触发边界与它的真实适用边界不一致，因而同时出现过触发与欠触发。
- **观测-表征失配**：决定性世界变量没有通过观测、编码、上下文、工具或控制表征通道进入模型可操作表征。

### 知识治理

把任务特定的控制知识从生成过程中分离出来，验证之后存为 **受治理知识对象（GKO）**，把"什么时候该问人、问什么、问谁"存为 **受治理升级对象（GEO）**。这样，下游生成可以从受治理状态出发，而不是从模型默认概率出发。

### 审计工程

不把审计当成生成之后的打分器，而是当成发现真实目标、定位失配、回写控制对象、保留失败轨迹并防止下一轮退化的独立工程层。审计循环的产物是可执行的控制增量，而不是语言评论。

### 治理式协作

不再围绕"任务分工"组织协作，而围绕"控制变量"组织协作。AI 推进可处理、可搜索、可验证的部分；人治理价值、偏好、授权、品味和责任；系统把可复用判断沉淀为 GKO/GEO。

### 状态治理型 Agent 体制（SGAR）

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
| 学习 | [/zh/learning](https://wxy2ab.github.io/against-llm-mediocrity/zh/learning) | 想重新理解"人该学什么"的人 |
| 论文 | [/zh/papers](https://wxy2ab.github.io/against-llm-mediocrity/zh/papers) | 想看工作稿与研究议程的人 |
| 项目 | [/zh/projects](https://wxy2ab.github.io/against-llm-mediocrity/zh/projects) | 想把它落到工具的人 |

### 案例详情

- [Story Insight V4](/zh/case-study-v4)：把故事拆成 `LogicSpace`（逻辑空间），把生成、改写、攻击、修复、回归治理构成完整闭环。
- [Story Insight V6](/zh/case-study-v6)：在高阈值下把失败路由到元空间、逻辑空间、文本、连续性、评价契约，并识别平台期。
- [Stock Rec V3](/zh/case-study-stock-rec-v3)：在金融策略生产中让 LLM 仅参与发现，不赋予生产权；所有影响策略的对象都必须经过 shadow、promotion、active 生命周期。
- [FW-Insight V3](/zh/case-study-fwinsight-v3)：从大量已生成因子框架样本中提取能改变下一轮再生的硬经验。

### 工作稿（[docs](./docs)）

- [Knowledge Governance for Large Language Model Systems](./docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)：主文。
- [LLM 系统中价值保存的结构理论](./docs/structural-theory-value-preservation-llm-systems.zh-CN.md)：新的结构理论工作稿。
- [LLM 系统中的六类原始失配](./docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)：从价值保存管线推导六类原始失配的总览工作稿。
- [受治理 LLM 对象模型与接口规范](./docs/governed-llm-object-model-interface-specification.zh-CN.md)：价值保存结构理论的配套实现规范。
- [面向受治理 LLM 系统的审计工程](./docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)：失败定位、控制空间写回与回归治理的配套技术报告。
- [面向受治理 LLM 系统的状态治理型 Agent 体制](./docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)：硬状态权威、转移契约与运行时治理的新工作稿。
- [LLM 系统中的观测-表征失配与通道治理](./docs/observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)：变量进入、表征上限与前治理修复的配套技术报告。
- [LLM 系统中的状态失配与状态治理](./docs/state-mismatch-state-governance-llm-systems.zh-CN.md)：潜在状态、状态判别与状态条件化控制的配套技术报告。
- [LLM 系统中的拟合边界失配与能力路由](./docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md)：能力领域、触发边界与路由治理的配套技术报告。
- [LLM 系统中的支持失配与控制空间搜索](./docs/support-mismatch-control-space-search-llm-systems.zh-CN.md)：可达性、候选支持与搜索治理的配套技术报告。
- [LLM 系统中的聚合失配与组合治理](./docs/aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)：局部价值、全局失败与组合关系治理的配套技术报告。
- [LLM 系统中的规格失配与目标治理](./docs/specification-mismatch-objective-governance-llm-systems.zh-CN.md)：代理目标、隐性效用与反例驱动规格修复的配套技术报告。
- [拟合边界失配](./docs/fitting-boundary-mismatch.zh-CN.md)：第五类原始失配的专题。
- [观测-表征失配](./docs/observation-representation-mismatch.zh-CN.md)：第六类原始失配的专题。
- [LLM 失败的形式化机制层](./docs/formal-mechanism-layer.zh-CN.md)：八类可干预机制。
- [Human-Assist Operational Mismatches](./docs/human-assist-operational-mismatches.zh-CN.md)：协作层失配与升级协议。
- [Audit Engineering](./docs/audit-engineering.zh-CN.md)：从生成-验证不对称到 Agent 治理。
- [状态治理型 Agent 体制（SGAR）](./docs/state-governed-agent-regime.zh-CN.md)：长程 Agent 的硬状态治理。
- [治理式人机协作](./docs/governed-human-ai-collaboration.zh-CN.md)：从聊天式使用到变量治理。
- [AI 的认知纪律](./docs/cognitive-discipline-for-ai.zh-CN.md)：AI 使用侧的认知框架。
- [模型最高价格](./docs/maximum-price-of-llms.zh-CN.md)：LLM 定价与商品化的数学。

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

这个项目欢迎一切能让"对抗 LLM 平庸"变得更可操作、更可证伪的贡献。

特别欢迎这几类内容：

- **真实任务案例**：哪些任务里 LLM 表面表现很好，但最终价值不稳定。
- **工程模式**：你如何把任务拆成控制对象、验证对象、评分规约或人类决策点。
- **失败样本**：哪些 prompt、agent 或 workflow 看起来合理，但最后被证明不可控。
- **概念修正**：对 "LLM 平庸""局部对齐""失配""控制空间" 等概念的反例、补充或更清晰的表达。
- **工具实现**：能把这些治理动作落到代码、模板、评估器或工作流里的最小组件。

贡献不一定一开始就完整。一个具体失败案例、一段可复现流程、一个更准确的术语、一次有证据的反驳，都比泛泛而谈更有价值。

---

## 7. 项目定位

这组工作稿目前更像研究框架与开源宣言，而不是已经封闭完成的理论。它们的目标，是提供一套可讨论、可实现、可验证的语言，用来描述 LLM 什么时候会平庸、什么时候会卓越，以及人与系统应当怎样把局部能力转化为稳定的任务价值。

我们不认为这一框架是唯一可能的描述，也不认为它必须被全盘接受。它最大的价值，是把"继续改 prompt"这种直觉升级为可审计、可回归、可撤销的工程过程。

如果它对你的真实任务有用，那它就值得被继续打磨；如果它在某些场景里失效，那它也正需要你的反例。

---

## 8. 许可与致谢

本仓库的内容以 MIT 协议发布。引用其中的工作稿、案例、框架与术语时，请注明来源。

如果你在论文、产品或内部项目里使用了其中概念，欢迎在 Issues 或 Discussions 中留言，这能帮助我们持续完善框架与案例。
