---
key: papers
lang: zh
path: /zh/papers
title: 文章与工作稿
navTitle: 文章
kicker: 把这套框架正式写清楚
summary: 这里收集与LLM 平庸、LLM卓越、知识治理、硬状态 Agent 治理、治理式协作和 AI 认知纪律相关的当前工作稿与后续实证方向。
order: 7
heroPoints:
  - 主文：Knowledge Governance for Large Language Model Systems。
  - 工作稿：价值保存结构理论、受治理 LLM 对象模型、审计工程、状态治理型 Agent 体制、通道治理、能力路由、控制空间搜索、Observation-Representation Mismatch 与 Human-Assist Operational Mismatches。
  - 延伸与实现：治理式协作、硬状态 Agent 治理、AI 认知纪律、人类学习与由研究议程直接推导的工具方向。
---

## 深水区怎么读

站点正文是公开解释层：先讲直觉，再讲机制，再讲实践。文章与工作稿则是深水区，用来把概念定义、诊断分类、治理对象和后续研究问题写得更完整。

建议阅读顺序：

1. 先读站点的"为什么重要"和"案例"页，按案例索引建立从控制空间治理到分层治理的直觉。
2. 再读"机制"和主文，理解三种对齐区间、六类原始失配，以及知识治理如何把中间控制知识外化、验证和复用。
3. 然后读协作补充稿，理解能自主推进任务的 AI agent 什么时候应该问人，以及如何构造最小充分人类问题。
4. 再读"状态治理型 Agent 体制（SGAR）"，理解长程 agent 为什么需要硬状态，而不是只依赖上下文维持连续性。
5. 再读"审计工程"，理解系统如何把生成后的失败信号路由回控制空间，并用回归治理防止退化。
6. 然后读"AI 的认知纪律"，理解个人使用 AI 时如何管理情绪投射、抽象失控、自我确认和现实反馈。
7. 最后读站点中的协作、学习和项目页，理解这些手稿如何转化为实践和实现方向。

如果只读站点，重点是获得一条可操作的判断链；如果进入文章，重点是检查这条链的定义、边界和可验证性。文章页的作用就是把公开解释层和正式工作稿接起来。

## 当前工作稿

:::cards
### Knowledge Governance for Large Language Model Systems
Tag: 主文

主文提出三种区间：LLM 平庸、局部对齐、LLM卓越；用聚合、支持、状态、规格、拟合边界、观测-表征六类原始失配解释为什么普通输出空间搜索会进入平台期；并提出知识治理、解耦控制空间和受治理知识对象（GKO）。

[阅读主文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

### LLM 系统中价值保存的结构理论
Tag: 结构理论工作稿

这份工作稿把框架重写为世界到输出管线中的价值保存问题：任务价值必须穿过观测、表征、状态识别、能力路由、候选支持、聚合与评估。它从管线站点推出六类原始失配，解释修复算子耦合和超加性复合失败，并把知识治理、审计工程和状态治理型 Agent 体制统一为价值保存机制。

[阅读价值保存结构理论工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)

### 受治理 LLM 对象模型与接口规范
Tag: 实现规范工作稿

这份配套规范定义受治理 LLM 系统的对象契约与接口语义。它把 GKO、GEO、审计发现、控制增量、回归护栏、缺陷账本、状态记录、转移契约、验证器对象和证据对象统一到一个生命周期中，用于审计写回、回归防护和硬状态提交。

[阅读对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)

### 面向受治理 LLM 系统的审计工程
Tag: 技术报告工作稿

这份技术报告把审计工程定义为把失败转化为持久控制改进的循环。它覆盖失败定位、审计发现、控制增量、回归护栏、缺陷账本、验证器权威、失配特定审计模式、反模式、风险分层审计强度和审计关闭标准。

[阅读审计工程技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)

### 面向受治理 LLM 系统的状态治理型 Agent 体制
Tag: 运行时治理工作稿

这份工作稿把 SGAR 定义为运行时层：进展只有通过已验证硬状态转移才被准入。它覆盖上下文降权、状态表面、转移契约、验证器分层、运行时循环、记忆写入、完成治理、多 agent 权限、回滚、撤销和从状态渲染上下文。

[阅读 SGAR 受治理系统工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)

### LLM 系统中的观测-表征失配与通道治理
Tag: 通道治理技术报告

这份技术报告把观测-表征失配展开为第一类原始失配，并把通道治理定义为知识治理之前的前治理修复：确保变量进入、保留、绑定、可区分，并能用于路由、搜索、审计、渲染、验证和状态更新。

[阅读通道治理技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)

### LLM 系统中的拟合边界失配与能力路由
Tag: 能力路由技术报告

这份技术报告把拟合边界失配展开为能力路由失败：有用能力可能在适用时没有激活，也可能在真实领域之外过度激活。它定义触发证据、抑制器、吸引子、路由 GKO、路由增量和边界回归护栏。

[阅读能力路由技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md)

### LLM 系统中的支持失配与控制空间搜索
Tag: 控制空间搜索技术报告

这份技术报告把支持失配展开为候选可达性失败：高价值结构可能原则上可表达且有价值，却在已部署策略、搜索算子、剪枝规则、识别机制和预算下获得太少有效支持。它定义控制空间搜索、支持提升、support map、search warrant、coverage ledger、support delta 和支持回归护栏。

[阅读控制空间搜索技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.zh-CN.md)

### 观测-表征失配
Tag: 第六类原始失配专题

这份专题工作稿展开第六类失配：决定性世界变量可能在进入模型可访问表征之前就被观测、编码、tokenization、上下文、工具或控制表征通道丢失。它区分通道不足、状态不确定和能力路由错误，并给出补测量、原始证据、工具、日志、传感器、环境查询和更丰富控制表征等干预方式。

[阅读观测-表征失配专题](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch.zh-CN.md)

### 拟合边界失配
Tag: 第五类原始失配专题

这份专题工作稿专门展开第五类失配：模型过度绑定局部证据链、代理指标、话术、角色期待或用户反馈，导致答案在当前场景里看似合理，却无法通过相邻场景、指标、审计协议或机制切换。它进一步拆分证据链过拟合、代理指标过拟合、场景默认值过拟合、解法路径过拟合、话术/角色过拟合、对齐偏好过拟合、用户反馈过拟合等子模式。

[阅读拟合边界失配专题](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch.zh-CN.md)

### LLM 失败的形式化机制层
Tag: 干预定位工作稿

这份工作稿把 LLM 系统写成部分可观测环境中的近似决策系统，并用八类可干预组件定位失败：规格 / 奖励、观测可得性、信念 / 表征、动态 / 世界模型、行动 / 接口、策略先验 / 能力支持、拟合边界 / 能力路由，以及搜索 / 执行。它不替代六类原始失配，而是把"为什么失败"进一步转化为"该改哪个组件"。

[阅读形式化机制层](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer.zh-CN.md)

### Human-Assist Operational Mismatches
Tag: 协作补充稿

补充稿不增加新的原始失配，而是把执行阻塞收紧为五个操作域，定义硬治理与预期损失升级门槛，并展开最小充分人类问题（MSHQ）、受治理升级对象（GEO）、回答验证和自治恢复。

[阅读技术补充稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)

### Audit Engineering
Tag: 审计—回写—治理工程

这份工作稿把生成—验证不对称提升为独立工程范式：候选产物负责暴露问题，独立审计器负责定位失配，修复路由器把发现写回 Prompt、Context、Control Space、工具、评价器或人工治理边界，回归审计则防止旧缺陷复发。它关注的不是"打多少分"，而是失败信号如何变成显式、可执行、可撤销的控制增量。

[阅读审计工程工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.zh-CN.md)

### 状态治理型 Agent 体制（SGAR）
Tag: 硬状态 Agent 治理

这份工作稿把 SGAR 命名为一种 agent 体制：agent 的状态被外部化为可验证、可恢复、可审计并具有治理权威的硬状态，而不是只存在于 LLM 上下文叙事中。它说明长程 agent 为什么必须把计划、行动、观测、验证、升级和审计发现组织成受治理状态转移。

[阅读 SGAR 工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.zh-CN.md)

### 治理式人机协作
Tag: 公开实践框架

这份实践框架把文章理论转化为协作方法：AI 先问环境、学反馈、构造试炼场，只有当剩余变量确实由人类治理时，才提出最小充分问题。

[阅读实践框架](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)

### AI 的认知纪律
Tag: 认知框架工作稿

这份工作稿把 AI 使用从风险提醒推进到认知纪律：AI 不是人格主体但会制造人格感；流畅不等于真实；AI 容易顺着用户前提放大自我确认；真正的收益必须通过现实行动、作品、关系和长期判断来检验。

[阅读认知框架](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/cognitive-discipline-for-ai.zh-CN.md)

### 模型最高价格
Tag: AI 经济学与定价工作稿

这份工作稿建立了 LLM 产品定价的最高价格包络：长期支付意愿同时受可靠性、残余稀缺性、价值捕获份额与总成本约束，并进一步对软件、法律、医疗、金融、客服、内容、教育与科研等行业给出量级估算。

[阅读定价工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/maximum-price-of-llms.zh-CN.md)
:::

## 延伸与实现方向

::::cards
### AI 时代的人类学习
Tag: 站点延伸

学习页展开治理式协作中的人类角色上移：人从普通处理者转向问题构造、价值判断、反馈、验证、授权和治理记忆的治理者。它是主框架在人类能力侧的实践延伸。

### 开源项目
Tag: 实现路线图

项目页只整理当前工作稿已经提出的实现与评估方向：GKO 生命周期、GEO 升级协议、硬状态 agent ledger 和六类原始失配诊断。它不是当前工作稿之外的新理论主张。
::::

## 后续实证方向

- 在相同计算预算下，比较知识治理与强输出空间搜索基线。
- 衡量自动生成的评分规约、边界情况、状态矩阵和 GKO，什么时候与专家判断相关。
- 研究上下文压缩、语义解压、查询构造和结构化转换这些正向对齐任务的画像。
- 测量嘈杂自然场景与干净抽象形式之间的建模缺口。
- 比较普通人机问答与 MSHQ/GEO 协作协议在中断次数、回答质量和自治恢复率上的差异。
- 评估 GKO/GEO 存储是否能提高复用，同时避免过期治理、过度升级或习得性无助。
- 评估 SGAR 式硬状态是否能减少长程 agent 的虚假完成、状态漂移、中断后不可恢复和不可审计行动循环。

## 项目定位

这些工作稿目前更像研究框架与开源宣言，而不是已经封闭完成的理论。它们的目标是提出一套可讨论、可实现、可验证的语言：用来描述 LLM 什么时候会平庸，什么时候会卓越，以及人和系统应该怎样把局部能力转化为稳定的任务价值。
