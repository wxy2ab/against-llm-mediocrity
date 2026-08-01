---
key: papers
lang: zh
path: /zh/papers
title: 文章与工作稿
navTitle: 工作稿
kicker: 把这套框架正式写清楚
summary: 这里收集与LLM 平庸、LLM卓越、六类原始失配的发现脉络、知识治理、硬状态 Agent 治理、治理式协作和 AI 认知纪律相关的当前工作稿与后续实证方向。
order: 7
heroPoints:
  - 当前总稿：价值保存结构理论、六类原始失配总图，以及六类失配如何被工程实践一步步逼出来的发现脉络稿。
  - 工作稿：面向受治理 LLM 系统的形式化机制层、诊断-机制桥接、机制驱动训练、受治理 LLM 对象模型、审计工程、Oracle 分类与引擎路由、状态治理智能体范式、Agent Hardness Framework、多尺度聚合失配、通道治理、状态治理、能力路由、控制空间搜索、组合治理、目标治理与 Human-Assist Operational Mismatches。
  - 延伸与实现：治理式协作、硬状态 Agent 治理、AI 认知纪律、人类学习与由研究议程直接推导的工具方向。
---

这一页是整个项目的正式写作索引。这里集中列出当前工作稿、仍保留作参考的旧版本、站点里的实践延伸，以及还没关上的实证问题。你可以把它当成一张总目录：一方面快速找到该读的文档，另一方面看清公开站点和正式工作稿是怎么接起来的。

## 文档地图

站点正文属于公开解释层，顺序是直觉、机制、实践。文章与工作稿则是形式化层：把概念定义、诊断分类、治理对象、运行时体制和研究议程写成可以引用、比较、继续扩展的文稿。

这页不只是“先读哪篇、后读哪篇”的阅读顺序，更像一张五层文档关系图：每份文稿在框架里负责什么，它和别的文稿怎么衔接，都放在这里看。

:::document-map
### 核心理论层
Tag: 说明为什么会失败

**作用**：说明为什么会出现 LLM 平庸、局部对齐和价值保存失败，给整个框架提供最上层解释。

**对应内容**：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)、[六类原始失配总图](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)

### 诊断机制层
Tag: 把失败定位清楚

**作用**：把失败定位到价值保存管线站点、机制轴和修复层，回答“到底坏在什么地方、该从哪一层修”。

**对应内容**：[形式化机制层](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer-for-governed-llm-systems.zh-CN.md)、[诊断-机制桥接](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md)、[机制驱动训练](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/mechanism-driven-training-for-governed-llm-systems.zh-CN.md)

### 治理对象层
Tag: 把控制写成对象

**作用**：定义 GKO、GExO、GEsO、Audit Finding、Control Delta、Regression Guard、State Record 等对象，让治理从抽象原则变成可提交、可写回、可回归检查的实体。

**对应内容**：[对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)、[审计工程](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)

### 运行时层
Tag: 把进展写入硬状态

**作用**：说明 agent 的进展怎样进入硬状态，哪些动作算有效推进，哪些动作必须经过 gate、审计和状态转移才能被承认。

**对应内容**：[SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)、[Oracle / Audit / SGAR routing](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)、[Agent Hardness Framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-hardness-framework.zh-CN.md)、[多尺度聚合失配](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.zh-CN.md)

### 人机协作层
Tag: 只在人该管的地方问人

**作用**：定义哪些变量必须由人治理，以及怎样把人类打断压缩到最小，同时保证 AI 在拿到答案后能恢复自治推进。

**对应内容**：[Human-Assist Operational Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)、[治理式人机协作](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)、[AI 的认知纪律](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/cognitive-discipline-for-ai.zh-CN.md)、[AI 的协作姿态](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/ai-collaborative-posture-calibrated-friction-constructive-firmness.zh-CN.md)
:::

**如果你只读站点，重点是拿到一条能实际使用的判断链；如果你往文章里走，重点就变成检查这五层分别怎样定义问题、定位失败、承载治理、提交状态和组织协作。** 这页的作用，就是把公开解释层和正式工作稿放到同一张地图里。

## 当前工作稿

:::paper-docs
### LLM 系统中价值保存的结构理论
Tag: 结构理论工作稿

这份工作稿把框架重写为世界到输出管线中的价值保存问题：任务价值必须穿过观测、表征、状态识别、能力路由、候选支持、聚合与评估。它从管线站点推出六类原始失配，并解释修复算子耦合和超加性复合失败。最后它把知识治理、审计工程和状态治理智能体范式统一为价值保存机制。

[阅读价值保存结构理论工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)

### LLM 系统中的六类原始失配
Tag: 管线推导分类法工作稿

这份工作稿把观测-表征、状态、拟合边界、支持、聚合和规格六类原始失配收束为一张从价值保存管线推导出的总图。然后它把每类失配映射到诊断问题、修复目标、审计发现、控制增量、受治理知识对象（GKO）、回归护栏和 SGAR 提交。

[阅读六类原始失配总图](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)

### 六类原始失配的工程来源
Tag: 发现脉络工作稿

这份工作稿不再从定义出发，而是回到概念真正长出来的工程现场。它记录六类原始失配如何从大规模量化采样、对抗自回归引力、故事生成复现、金融任务和日常复杂问题中的连续挫败里一步步被逼出来，也解释为什么这套框架首先是工程发现，再被整理成理论语言。

[阅读六类原始失配的工程来源](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/engineering-origins-of-six-primitive-mismatches.zh-CN.md)

### 受治理 LLM 对象模型与接口规范
Tag: 实现规范工作稿

这份配套规范定义受治理 LLM 系统的对象契约与接口语义。它把 GKO、受治理执行对象（GExO）、审计发现、控制增量、回归护栏、缺陷账本、状态记录、转移契约、验证器对象和证据对象统一到一个生命周期中，用于审计写回、回归防护和硬状态提交。

[阅读对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)

### 面向受治理 LLM 系统的审计工程
Tag: 技术报告工作稿

这份技术报告把审计工程定义为把失败转化为持久控制改进的循环。它覆盖失败定位、审计发现、控制增量、回归护栏、缺陷账本、验证器权威、失配特定审计模式、反模式、风险分层审计强度和审计关闭标准。

[阅读审计工程技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)

### Oracle、Audit Agent 与 SGAR
Tag: oracle 路由工作稿

这份工作稿把 audit、SGAR、gate hardening 与 No-Go 收束到同一个 oracle 分类与引擎路由框架里。它解释系统什么时候应使用高带宽失败定位，什么时候应依赖高保真边界 gate，以及什么时候真正负责任的进展不是盲目迭代，而是先去获取新的 fidelity source。

[阅读 oracle 分类与引擎路由工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md) / [English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.md)

### 面向受治理 LLM 系统的状态治理智能体范式
Tag: 运行时治理工作稿

这份工作稿把 SGAR 定义为运行时层：进展只有通过已验证硬状态转移才被准入。它覆盖上下文降权、状态表面、转移契约、验证器分层、运行时循环、记忆写入、完成治理、多 agent 权限、回滚、撤销和从状态渲染上下文。

[阅读 SGAR 受治理系统工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)

### Agent Hardness Framework
Tag: 运行时科学工作稿

这份工作稿把 Agent Engineering 从“经验上的 harness 配方”往“可量化的运行时科学”推进了一步。它区分模型条件能力前沿、Bridge 与 Action-Space Optimization，提出系统残差与执行残差的双重视角，并给出量化 Bridge 子机制、接口设计、组件交互与跨模型迁移的实验路线。

[阅读 Agent Hardness Framework：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-hardness-framework.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-hardness-framework.zh-CN.md)

### 聚合失配：从单次推理到 Agent 轨迹的多尺度局部最优坍缩
Tag: 运行时桥接工作稿

这份工作稿把聚合失配从单次调用扩展到 Agent 轨迹，区分语义前缀锁定与因果路径锁定，并说明外部 Plan、Candidate、Audit、Hard State、Patch、Rollback 与 Replan 何时不再只是重复 reasoning，而成为跨阶段持续生效的控制面与搜索前沿。

[阅读多尺度聚合失配工作稿：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.zh-CN.md)

### LLM 系统中的观测-表征失配与通道治理
Tag: 通道治理技术报告

这份技术报告把观测-表征失配展开为第一类原始失配，并把通道治理定义为知识治理之前的前治理修复：确保变量进入、保留、绑定、可区分，并能用于路由、搜索、审计、渲染、验证和状态更新。

[阅读通道治理技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)

### LLM 系统中的状态失配与状态治理
Tag: 状态治理技术报告

这份技术报告把状态失配展开为第二类原始失配：当多个潜在任务状态仍然可行、且行动价值会随状态改变时，系统却像状态已经已知一样行动。它定义状态假设、证据绑定、判别器、信念记录、状态条件化策略、转移护栏、状态回归护栏和与 SGAR 的集成规则。

[阅读状态治理技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-mismatch-state-governance-llm-systems.zh-CN.md)

### LLM 系统中的拟合边界失配与能力路由
Tag: 能力路由技术报告

这份技术报告把拟合边界失配展开为能力路由失败：有用能力可能在适用时没有激活，也可能在真实领域之外过度激活。它定义触发证据、抑制器、吸引子、路由 GKO、路由增量和边界回归护栏。

[阅读能力路由技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md)

### 单路由决策：RR1–RR7 与 RR-v2 决定性冻结证据
Tag: 路由可靠性研究证据

这份双语证据综合汇总 RR1–RR7 与两轮 RR-v2 decisive 结果。A-EXT 把 typed abstain
与 Top-5 shortlist 推进到独立受控 Skill 生态和真实 tempfile executor；B-XOVER 在可信
runtime edit-scope hint 已给定时识别出明显 PATCH/EXACT crossover；C-BLIND 中机械签名
优于当前 live LLM recovery 配置，同时明确保留 47/60 infra timeout 的解释限制。生产
默认仍不变，Workflow、SGAR 与复杂编排继续排除在单路由 claim 之外。

[阅读单路由证据综合：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/single-route-decision-frozen-evidence-synthesis.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/single-route-decision-frozen-evidence-synthesis.zh-CN.md)

### LLM 系统中的支持失配与控制空间搜索
Tag: 控制空间搜索技术报告

这份技术报告把支持失配展开为候选可达性失败：一个高价值结构可能原则上可表达且有价值，却在已部署策略、搜索算子、剪枝规则、识别机制和预算下获得太少有效支持。它定义控制空间搜索、支持提升、support map、search warrant、coverage ledger、support delta 和支持回归护栏。

[阅读控制空间搜索技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.zh-CN.md)

### LLM 系统中的聚合失配与组合治理
Tag: 组合治理技术报告

这份技术报告把聚合失配展开为局部到全局的组合失败：局部合理、局部有用或局部改进的 parts，可能无法在组合算子下保存全局任务效用。它定义 dependency graph、interface contract、invariant registry、binding record、claim-support map、integration ledger 和 composition audit 等组合治理对象。

[阅读组合治理技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)

### 聚合失配与生成—验证不对称：受控实验证据
Tag: 聚合失配研究证据

这份研究说明不展开运行管线细节，而是集中回答“通过什么实验、证明了什么”：相同局部 XOR 规则下，开边界生成与周期闭合生成出现巨大差距；给定完整候选后的全量审计显著恢复；复制、局部检查、长度与锚点对照进一步限定了聚合失配和生成—审计不对称的解释边界。

[阅读聚合失配与生成—验证不对称研究证据](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-generation-verification-asymmetry-evidence.zh-CN.md)

### 聚合失配 Artifact-v11：地址漂移与配置交付
Tag: 聚合失配研究证据

这份双语报告验证了 production-shaped 合成 JSON 配置上的 256 个 DeepSeek 交付 episode 与 1,024 个离线执行器案例。Relocation × (ID−INDEX) interaction 以 +21.875 个百分点通过，差异全部集中于 \(N=48\)。Patch 与 Rewrite 的可靠性均达到 ceiling，但 Patch 明显减少 token、延迟和响应字节。

[阅读 artifact-v11 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v11-config-delivery-transfer.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v11-config-delivery-transfer.zh-CN.md)

### 聚合失配 Artifact-v12：漂移剂量与交付尺度路由
Tag: 聚合失配研究证据

这份双语报告验证 240 个 DeepSeek episodes 与 768 个离线执行器案例。预注册的漂移
剂量交互未通过；稀疏 verified-plan Patch 相对 Full Rewrite 提高 300 秒预算内严格
成功率 29.17 个百分点。Regional Rewrite 仍为探索性且表现异质。

[阅读 artifact-v12 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v12-scale-routing-transfer.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)

### 聚合失配 Artifact-v14：Post-Compile Drift 与 Exact Recovery
Tag: 聚合失配研究证据

这份双语报告在严格 seal-before-drift 时序下验证 96 个正式 DeepSeek episodes、
768 个离线执行器案例与 1,416 条可重建事件。Compatible Exact 24/24 被安全判 stale
并恢复；+19.3% token interaction 为正，但未达到预注册 +20% 最小效应门。

[阅读 artifact-v14 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v14-post-compile-drift-recovery.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)

### 聚合失配 Artifact-v15：Intent 冲突治理
Tag: 聚合失配研究证据

这份双语报告验证 96 个正式 DeepSeek episodes、768 个离线执行器案例和 1,594 条
可重建事件。冲突首提交 0/72；受治理的 Intent/Exact Rebase 恢复 48/48，Naive
终止 0/24。机器主检验通过，但冻结文字与可执行 Pilot Gate 不一致，整体裁决为
`share_with_caveats`。

[阅读 artifact-v15 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v15-intent-conflict-governance.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v15-intent-conflict-governance.zh-CN.md)

### 聚合失配 Artifact-v16：匹配冲突恢复
Tag: 聚合失配研究证据

这份双语报告验证 96 个正式 DeepSeek episodes、768 个离线执行器案例和 1,752 条
可重建事件。匹配第二 turn 后，Generic/Reread 仍锁定为 0/24，runtime
Unlock + Rebase 为 24/24。机器主检验通过；authority/state/info 组合与冻结
manifest 的 Pilot 元数据偏差要求整体裁决为 `share_with_caveats`。

[阅读 artifact-v16 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v16-matched-conflict-recovery.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v16-matched-conflict-recovery.zh-CN.md)

### 聚合失配 Artifact-v17：Unlock 信息与不可解除升级
Tag: 聚合失配研究证据

这份双语报告验证 192 个正式 DeepSeek episodes、1,536 个离线案例与 3,840 条可重建
事件。四个 unlock 后信息臂均为 24/24，因此预注册 superiority claim 在 ceiling 下
未通过；完整旧态比 receipt-only 多 74.9% 中位 token。不可解除锁下 typed Escalate
达到 24/24 合法 non-commit 终态。后者是 endpoint 不同的治理终态对比，不是任务
完成优势。

[阅读 artifact-v17 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v17-unlock-info-escalate.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v17-unlock-info-escalate.zh-CN.md)

### 聚合失配 V1–V12、V14–V17：证据合成与 Agent 工程
Tag: 实验总览与工程指南

双语实验总览把每个 artifact 映射到已支持、未支持和不可推广的 claim，并明确排除
已归档 V13。工程经验文档把证据转化为参考架构、路由策略、telemetry、governed
commit、冲突治理、最小上下文披露、typed 终态、落地顺序和应用映射。

[阅读实验总览：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v1-v12-v14-v17-experiment-summary.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v1-v12-v14-v17-experiment-summary.zh-CN.md)

[阅读工程经验：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v17.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v17.zh-CN.md)

### 聚合失配 Artifact-v4：实验证据、理论差距与 Agent 工程含义
Tag: 聚合失配研究证据

这份双语报告裁决已完成的 756 次 DeepSeek 边界状态、候选/接口、独立 300/900/1800 秒预算与输出顺序实验；披露并修正 7 条 legacy evaluator 误评分，区分“足够答案信息恢复”与“结构 cut-set 位置特异性”，并把理论—证据差距转化为 Agent 路由、执行器、验证器和遥测要求。

[阅读 artifact-v4 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.zh-CN.md)

### 聚合失配 Artifact-v5：稳定编辑 Agent 与规划瓶颈
Tag: 聚合失配研究证据

这份双语报告裁决已完成的 288-arm 原生工具 DeepSeek 实验。正确 oracle plan 给定后，batch Patch 为 46/48，完整对象 Rewrite 为 26/48，交付层优势为 +41.7 个百分点；推断计划下的端到端比较为 2/96 对 0/96，没有通过门槛。报告解释为什么最终裁决是 `delivery_only`、为什么 crossover 仍未裁决，以及为什么 Agent 必须在写接口路由之前增加 plan verification。

[阅读 artifact-v5 报告：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v5-stable-editing-agent.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)

### Patch 与完整重写：稀疏修复交付接口的受控实验
Tag: 聚合失配研究证据

这份证据说明把 edit discovery 与 repair delivery 分开：在 160 个全新 holdout 和 1,920 条完整 DeepSeek 运行中，patch + 确定性执行相对完整重写提高了预算内严格可靠性；oracle-plan、纯复制、同次回答、长度、失败类型和独立预分配 900 秒对照共同限定了结论及其边界。

[阅读受控实验：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.zh-CN.md)

### 聚合失配：可推导命题、证明条件与 Agent 工程含义
Tag: 理论—工程桥接

这份工作稿区分三类结论：在明确假设下可证明的接口与状态性质、只能推出结构预测但仍需测量 LLM 的命题，以及完全依赖模型和任务分布的经验问题。它给出 patch 提交面、边界状态、依赖顺序、验证闸门、局部失效传播、无冲突并行、提交安全包络与可回放状态的推导，并把它们转换为可实施的 agent 架构。

[阅读理论命题与 Agent 工程含义：English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)

### LLM 系统中的规格失配与目标治理
Tag: 目标治理技术报告

这份技术报告把规格失配展开为目标保存失败：即使观测、状态、路由、支持和聚合都足够，可访问代理目标仍可能偏离真实任务效用。它定义 scoped objective objects、代理风险审计、优先级规则、验证器契约、规格审计、控制增量和回归护栏。

[阅读目标治理技术报告](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/specification-mismatch-objective-governance-llm-systems.zh-CN.md)

### 面向受治理 LLM 系统的形式化机制层
Tag: 干预定位工作稿

这份工作稿定义了受治理 LLM 系统的形式化机制层。它把修复定位拆成八条可干预轴，把诊断单位从单一标签改为机制画像，并说明机制级定位如何接入审计工程、控制增量、回归护栏、缺陷台账与 SGAR 硬状态转移。

[阅读受治理系统版形式化机制层](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer-for-governed-llm-systems.zh-CN.md) / [English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer-for-governed-llm-systems.md)

### 面向受治理 LLM 系统的诊断-机制桥接
Tag: 诊断桥接工作稿

这份工作稿把六类原始失配与八条机制轴接到同一诊断与修复链路里。它定义从价值失败诊断走向修复定位的桥：机制画像、修复层选择、审计写回、受治理对象、SGAR 提交，以及由机制驱动的训练提升。

[阅读诊断-机制桥接](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md) / [English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.md)

### 面向受治理 LLM 系统的机制驱动训练
Tag: 训练侧治理工作稿

这份工作稿定义了运行时治理在训练侧的对应层。它说明哪些反复出现的失败不应长期停留在运行时补丁，而应被提升为机制特定的训练干预，例如表征训练、边界数据、grounding 数据、奖励纠偏和能力支持训练。

[阅读机制驱动训练工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/mechanism-driven-training-for-governed-llm-systems.zh-CN.md) / [English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/mechanism-driven-training-for-governed-llm-systems.md)

### Human-Assist Operational Mismatches
Tag: 协作补充稿

补充稿不增加新的原始失配，而是把执行阻塞收紧为五个操作域，定义硬治理与预期损失升级门槛，并展开 MSHQ、GEsO、回答验证和自治恢复。

[阅读技术补充稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)

### 治理式人机协作
Tag: 公开实践框架

这份实践框架把文章理论转化为协作方法：AI 先问环境、学反馈、构造试炼场，只有当剩余变量确实由人类治理时，才提出最小充分问题。

[阅读实践框架](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)

### AI 的认知纪律
Tag: 认知框架工作稿

这份工作稿把 AI 使用从风险提醒推进到认知纪律：AI 不是人格主体但会制造人格感；流畅不等于真实；AI 容易顺着用户前提放大自我确认；真正的收益必须通过现实行动、作品、关系和长期判断来检验。

[阅读认知框架](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/cognitive-discipline-for-ai.zh-CN.md)

### AI 的协作姿态：校准摩擦与建设性强硬
Tag: 协作姿态工作稿

这份工作稿是《AI 的认知纪律》的 AI 侧对偶。它主张 AI 不应最大化顺从，而应通过校准摩擦与建设性强硬来保护人的判断回路：在硬 oracle 处强硬，在人类治理变量占主导时退让并追问，在不可逆动作前设置闸门，并在学习与判断任务中保留人的生成劳动。

[阅读协作姿态工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/ai-collaborative-posture-calibrated-friction-constructive-firmness.zh-CN.md)

### 模型最高价格
Tag: AI 经济学与定价工作稿

这份工作稿建立了 LLM 产品定价的最高价格包络：长期支付意愿同时受可靠性、残余稀缺性、价值捕获份额与总成本约束，并进一步对软件、法律、医疗、金融、客服、内容、教育与科研等行业给出量级估算。

[阅读定价工作稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/maximum-price-of-llms.zh-CN.md)
:::

## 旧版本

下面是保留下来供参考的早期稿。每一份都已经被上方当前工作稿中的某个文档承接，每张卡片也都指向它的替代版本。

:::paper-docs
### LLM 失败的形式化机制层
Tag: 旧版干预定位稿

这份早期机制层工作稿首次把失败拆成八类可干预组件，并服务于更早一版主文栈。当前版本已经由上方当前工作稿中的面向受治理 LLM 系统的形式化机制层承接。

[阅读旧版形式化机制层](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer.zh-CN.md) / [English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer.md)

### Knowledge Governance for Large Language Model Systems
Tag: 旧版主文

这份早期主文提出三种区间、第一版六失配框架、知识治理、解耦控制空间和 GKO。当前总稿已经由上方的价值保存结构理论、六类原始失配总图、对象模型和受治理系统技术报告承接。

[阅读旧版主文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

### 观测-表征失配
Tag: 旧版原始失配专题

这份早期专题把观测-表征失配作为独立原始失配展开。当前版本是上方当前工作稿中的通道治理技术报告。

[阅读旧版观测-表征失配专题](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch.zh-CN.md)

### 拟合边界失配
Tag: 旧版原始失配专题

这份早期专题把拟合边界失配作为独立原始失配展开。当前版本是上方当前工作稿中的能力路由技术报告。

[阅读旧版拟合边界失配专题](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch.zh-CN.md)

### Audit Engineering
Tag: 旧版审计工程稿

这份早期稿从生成—验证不对称展开审计—回写—治理工程。当前版本是上方当前工作稿中的面向受治理 LLM 系统的审计工程技术报告。

[阅读旧版审计工程稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.zh-CN.md)

### 状态治理智能体范式（SGAR）
Tag: 旧版硬状态 Agent 治理稿

这份早期 SGAR 稿命名了硬状态 Agent 治理。当前版本是上方当前工作稿中的面向受治理 LLM 系统的 SGAR 工作稿。

[阅读旧版 SGAR 稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.zh-CN.md)
:::

## 延伸与实现方向

下面这些站点页把框架往实践里推。它们不负责提出新理论，而是把工作稿分别落到人类能力和开源实现两个方向。

::::cards
### AI 时代的人类学习
Tag: 站点延伸

学习页展开治理式协作中的人类角色上移：人从普通处理者转向问题构造、价值判断、反馈、验证、授权和治理记忆的治理者。它是主框架在人类能力侧的实践延伸。

### 开源项目
Tag: 实现路线图

项目页只整理当前工作稿已经提出的实现与评估方向：GKO 生命周期、GEsO 升级协议、硬状态 agent ledger 和六类原始失配诊断。它不是当前工作稿之外的新理论主张。
::::

## 后续实证方向

这套框架不是只拿来论证的，它本来就是为检验而写。下面这些问题，都是它主动留下来的实证入口：

- 在相同计算预算下，比较知识治理与强输出空间搜索基线。
- 衡量自动生成的评分规约、边界情况、状态矩阵和 GKO，什么时候与专家判断相关。
- 研究上下文压缩、语义解压、查询构造和结构化转换这些正向对齐任务的画像。
- 测量嘈杂自然场景与干净抽象形式之间的建模缺口。
- 比较普通人机问答与 MSHQ/GEsO 协作协议在中断次数、回答质量和自治恢复率上的差异。
- 评估 GKO/GEsO 存储是否能提高复用，同时避免过期治理、过度升级或习得性无助。
- 评估 SGAR 式硬状态是否能减少长程 agent 的虚假完成、状态漂移、中断后不可恢复和不可审计行动循环。

## 项目定位

这些工作稿目前更像一套研究框架和开源宣言，还不是已经封口的定论。它想先把语言搭起来：让人能更清楚地讨论 LLM 什么时候会平庸，什么时候会卓越，以及人和系统怎样把局部能力慢慢变成稳定的任务价值。
