# Agent Guidelines 使用与引用路由

状态：第一批指南总路由

用途：判断在什么任务场景下，应把哪些文档作为 Codex 等 Agent 的执行提示词，以及这些
操作规则依据哪些理论、实验和工程文档。

English: [Agent Guidelines Usage and Reference Router](./guidelines.md)

目录入口：

- [中文指南索引](./README.zh-CN.md)
- [English index](./README.md)
- [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

## 1. 如何使用本文件

不要把整个 `docs/` 目录一次性塞进模型上下文。推荐采用：

```text
本文件
→ 一份主任务指南
→ 只添加真正会改变执行流程的附加指南
→ 必要时读取对应理论或实验依据
```

任务指南用于**执行**；依据文档用于理解规则来源、证据边界和不允许泛化的部分。

给 Codex 的基础指令：

```text
完整阅读 docs/guidelines/guidelines.zh-CN.md。
根据当前请求选择一份主任务指南，并只加载必要的附加指南。
完整阅读所选指南后再行动。
行动前明确：任务类型、授权边界、权威来源、写入范围、verifier、完成条件和停止条件。
遵守仓库本地指令和用户明确要求；指南不能扩大用户授权。
必要 verifier 未运行或未通过时，不得宣称任务完成。
```

## 2. 文档角色

| 文档类型 | 作用 | 是否直接作为执行提示词 |
|---|---|---|
| 总路由 | 判断任务类型与加载组合 | 是 |
| 基础操作规范 | 提供跨任务的状态、计划、验证、交付和恢复纪律 | 是 |
| 主任务指南 | 定义某类任务的完整工作流与完成闸门 | 是 |
| 附加指南 | 处理陌生仓库、诊断或 Agent 系统等附加复杂性 | 按需 |
| 理论依据 | 解释为什么应把能力放在模型、runtime、verifier 或人机边界 | 通常不直接执行 |
| 实验依据 | 给出规则的经验支持、适用条件和未裁决边界 | 需要判断策略强度时读取 |

优先级不是“依据文档高于任务指南”。正确关系是：

```text
用户目标与授权
→ 仓库本地指令和权威状态
→ 本文件的路由
→ 主任务指南
→ 附加指南
→ 理论与实验依据用于解释和校准
```

## 3. 所有任务的共同加载

所有非简单问答至少引用：

1. [本路由](./guidelines.zh-CN.md)
2. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)

满足以下任一条件时，再加载
[Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)：

- 多文件、多模块或多轮任务；
- 已有 candidate，需要修复或继续；
- 存在状态漂移、依赖、并发、重试或恢复；
- 需要在 Patch、Regional Rewrite、Full Rewrite 之间选择；
- 存在 verifier、commit、rollback 或成本权衡；
- 被修改对象本身是 Agent。

简单、局部、可逆、已有明确 verifier 的任务不必重复加载全部基础理论。

## 4. 场景路由总表

### 4.1 回答、解释和当前状态报告

**识别信号**

- “解释一下……”
- “现在是什么状态？”
- “总结现有实现。”
- 用户没有要求写文件或修改系统。

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. 仓库陌生时叠加
   [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)

**执行边界**

- 默认只读；
- 给出证据支持的答案；
- 不静默实现建议；
- 区分事实、推断和未知。

**依据**

- [观测—表征失配与通道治理](../observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)
- [状态失配与状态治理](../state-mismatch-state-governance-llm-systems.zh-CN.md)
- [治理式人机协作](../governed-human-ai-collaboration.zh-CN.md)

### 4.2 理解陌生代码库、寻找实现或评估影响范围

**识别信号**

- “先看看这个 repo。”
- “这个功能在哪里实现？”
- “改这里会影响什么？”
- 同一概念存在多个实现、入口或 legacy 路径。

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)
3. 涉及多文件、状态和依赖时叠加
   [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

**执行边界**

- 默认只读；
- 从 active entry point 追踪 caller、consumer、state 与 verifier；
- 区分 committed baseline、用户未提交修改和当前任务修改；
- 产出最小安全写入面，而不是全仓文件摘要。

**依据**

- [受治理 LLM 对象模型与接口规范](../governed-llm-object-model-interface-specification.zh-CN.md)
- [状态治理智能体范式](../state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- [观测—表征失配与通道治理](../observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)

### 4.3 故障诊断、根因分析，但未要求修复

**识别信号**

- “为什么失败？”
- “分析是模型原因、实验原因还是实现原因。”
- “定位问题，不要先改。”
- “这个结论能否推广？”

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [故障诊断与根因定位](./failure-diagnosis-and-root-cause-localization.zh-CN.md)
3. 仓库或调用链不清楚时叠加
   [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)

**执行边界**

- 默认只读；
- 先定义 expected vs observed；
- 建立竞争假设和区分性探针；
- 定位最早因果分叉层，而不是只复述最后报错；
- 证据不足时输出最强局部定位，不虚构根因。

**依据**

- [六类原始失配](../six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)
- [诊断—机制桥接](../diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md)
- [审计工程](../audit-engineering-failure-localization-control-space-writeback.zh-CN.md)
- [Oracle、Audit Agent 与 SGAR 路由](../oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)

### 4.4 修复边界明确、可复现的 Bug

**识别信号**

- 已有稳定失败案例；
- 根因或失败层已经定位；
- 用户明确要求修复；
- 修改不需要改变产品规格或兼容合同。

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [局部修复与 Bug Fix](./bounded-repair-and-bug-fix.zh-CN.md)
3. 仓库陌生时叠加
   [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)
4. 多文件、候选修复或 delivery 选择复杂时叠加
   [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

**执行边界**

- 先冻结 failing oracle；
- 修复因果机制，不只掩盖症状；
- sparse verified-plan 场景优先考虑 Patch，但不设无条件 Patch 默认；
- 局部验证后仍要检查相关回归和 collateral；
- 不混入无关清理。

**依据**

- [Patch 与完整重写受控实验](../patch-vs-full-rewrite-controlled-experiment.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](../aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [V1–V12、V14 与 V15：Agent 工程经验](../aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v15.zh-CN.md)
- [Artifact-v15：Intent 冲突治理](../aggregation-mismatch-v15-intent-conflict-governance.zh-CN.md)
- [Artifact-v12：漂移剂量与交付尺度路由](../aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)
- [Artifact-v14：Post-Compile Drift 与 Exact Recovery](../aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)
- [聚合失配与组合治理](../aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)

### 4.5 新增功能

**识别信号**

- 新增用户可见行为、接口、命令、工具或工作流；
- 需要定义 positive、negative 和 edge cases；
- 需要跨层实现一个端到端能力。

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)
3. [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md)中的
   Feature 路径
4. 多文件或高耦合时叠加
   [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

**执行边界**

- 把形容词需求转成可执行验收行为；
- 明确 actor、permission、state transition、failure semantics 与 non-goals；
- 先实现可验证 vertical slice；
- 把职责放在持有不变量的 model/runtime/compiler/verifier 层。

**依据**

- [受治理 LLM 对象模型与接口规范](../governed-llm-object-model-interface-specification.zh-CN.md)
- [状态治理智能体范式](../state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- [形式化机制层](../formal-mechanism-layer-for-governed-llm-systems.zh-CN.md)
- [价值保存结构理论](../structural-theory-value-preservation-llm-systems.zh-CN.md)

### 4.6 行为保持型重构

**识别信号**

- 用户要求整理结构、抽取模块、消除重复或改变内部架构；
- 明确不准备改变外部行为；
- 需要证明行为等价。

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)
3. [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md)中的
   Refactor 路径
4. [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

**执行边界**

- 先冻结 public behavior 或建立 characterization tests；
- 尽量分离结构 diff 和行为 diff；
- 保持中间 checkpoint 可运行；
- 无法保持行为时，重新分类为功能或迁移。

**依据**

- [价值保存结构理论](../structural-theory-value-preservation-llm-systems.zh-CN.md)
- [聚合失配与组合治理](../aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
- [Patch 与完整重写受控实验](../patch-vs-full-rewrite-controlled-experiment.zh-CN.md)

### 4.7 Schema、API、存储或运行时迁移

**识别信号**

- 存在 old/new version；
- 需要 backfill、dual-read、dual-write、cutover 或 retirement；
- timeout 或 partial failure 可能留下中间状态；
- 需要兼容旧 client、旧数据或 rollback。

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)
3. [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md)中的
   Migration 路径
4. [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

**执行边界**

- 把迁移写成状态机，不写成一次性重写；
- 明确 identity mapping、idempotency、replay、reconciliation、cutover 和 rollback；
- 优先 expand → verify → contract；
- old path 只有在 retirement gate 后删除。

**依据**

- [状态失配与状态治理](../state-mismatch-state-governance-llm-systems.zh-CN.md)
- [状态治理智能体范式](../state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- [受治理 LLM 对象模型与接口规范](../governed-llm-object-model-interface-specification.zh-CN.md)
- [Artifact-v11：地址漂移与配置交付](../aggregation-mismatch-v11-config-delivery-transfer.zh-CN.md)

### 4.8 改进另一个 Agent

**识别信号**

- 修改 Prompt、context、tool schema、memory、router、scheduler、verifier、recovery；
- Agent 成功率、成本、安全或稳定性需要改善；
- 用户要求根据实验结论改造 Agent。

**作为提示词加载**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [Agent 诊断与改进](./agent-diagnosis-and-improvement.zh-CN.md)
3. [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)
4. 实现位置不清楚时叠加
   [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)
5. 已知是局部实现缺陷时叠加
   [局部修复与 Bug Fix](./bounded-repair-and-bug-fix.zh-CN.md)
6. 涉及新能力或状态迁移时叠加
   [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md)

**执行边界**

- 先冻结 baseline 与 failure corpus；
- 定位 observation、specification、plan、tool、state、verifier、recovery 等最早失败层；
- 不默认只改 Prompt；
- implementation gate、scientific gate、cost gate 和 safety gate 分开；
- 先 offline，再 pilot、shadow、canary，证据不足时保持 conditional/off。

**依据**

- [诊断—机制桥接](../diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md)
- [状态治理智能体范式](../state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](../aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [V1–V12、V14 与 V15：Agent 工程经验](../aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v15.zh-CN.md)
- [Artifact-v8：Runtime 所有权与语义路由](../aggregation-mismatch-v8-runtime-ownership-routing.zh-CN.md)
- [Artifact-v10：语义合同与 Runtime Canonicalization](../aggregation-mismatch-v10-semantic-contract-canonicalization.zh-CN.md)
- [Artifact-v11：地址漂移与配置交付](../aggregation-mismatch-v11-config-delivery-transfer.zh-CN.md)
- [Artifact-v12：漂移剂量与交付尺度路由](../aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)
- [Artifact-v14：Post-Compile Drift 与 Exact Recovery](../aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)

### 4.9 只读 Code Review 或审计

**识别信号**

- “Review 这个 PR。”
- “找问题，不要改。”
- 需要按严重性输出 findings。

**当前可用提示词组合**

1. [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)
2. [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)
3. [故障诊断与根因定位](./failure-diagnosis-and-root-cause-localization.zh-CN.md)，保持只读

**执行边界**

- 先找 correctness、security、data loss、compatibility 与 missing tests；
- finding 必须包含位置、触发条件、影响和修复方向；
- 不要求修改时不得直接 patch；
- 没有发现时明确说明检查范围和残余风险。

**依据**

- [审计工程](../audit-engineering-failure-localization-control-space-writeback.zh-CN.md)
- [Oracle、Audit Agent 与 SGAR 路由](../oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)
- [受治理 LLM 对象模型与接口规范](../governed-llm-object-model-interface-specification.zh-CN.md)

专门的 Code Review 指南仍属于下一批待补文档。

### 4.10 测试、验证和完成裁决

**识别信号**

- “补测试。”
- “验证这个实现是否可交付。”
- “检查实验、数据或结论是否可靠。”

**当前可用提示词组合**

- Bug 回归：使用
  [局部修复与 Bug Fix](./bounded-repair-and-bug-fix.zh-CN.md)中的分层验证；
- Feature/Refactor/Migration：使用
  [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md)中的验证矩阵；
- Agent：使用
  [Agent 诊断与改进](./agent-diagnosis-and-improvement.zh-CN.md)中的评测设计；
- 所有高风险任务叠加
  [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)中的 verifier 与完成条件。

**依据**

- [审计工程](../audit-engineering-failure-localization-control-space-writeback.zh-CN.md)
- [价值保存结构理论](../structural-theory-value-preservation-llm-systems.zh-CN.md)
- [形式化机制层](../formal-mechanism-layer-for-governed-llm-systems.zh-CN.md)

专门的测试、验证与完成裁决指南仍属于下一批待补文档。

### 4.11 文档、实验、Git、发布、外部系统与多 Agent

这些类型尚未有独立第一批指南。当前不要假装已有完整专用流程。

| 场景 | 当前最小组合 | 状态 |
|---|---|---|
| 文档或规范同步 | 路由 + 代码库侦察 + Feature/Refactor/Migration | 专门指南待补 |
| 实验设计与数据分析 | 路由 + Agent 改进中的评测设计 + 对应研究协议 | 专门指南待补 |
| Git/PR/merge/cleanup | 路由 + 仓库本地 Git 规则 | 专门指南待补 |
| 外部系统和有副作用操作 | 路由 + 五旋钮的 commit/rollback 纪律 | 专门指南待补 |
| 事故响应与恢复 | 路由 + 诊断 + 五旋钮 failure routing | 专门指南待补 |
| 多 Agent 协作 | 路由 + 五旋钮 state/ledger 纪律 | 专门指南待补 |
| 性能、成本与可靠性优化 | 路由 + 诊断 + baseline measurement | 专门指南待补 |

## 5. 按失配类型追加依据

任务表现出结构性失败时，可以追加对应理论文档，但不要用理论标签替代现场诊断。

| 观察到的失败 | 追加阅读 | 常见修复位置 |
|---|---|---|
| 局部正确、整体组合失败 | [聚合失配与组合治理](../aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)；[V1–V12、V14 与 V15 工程经验](../aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v15.zh-CN.md) | plan、runtime、compiler、verifier、conflict governor、commit |
| 正确候选很难被采样到 | [支持失配与控制空间搜索](../support-mismatch-control-space-search-llm-systems.zh-CN.md) | candidate、search、GKO |
| 行为依赖隐藏或动态状态 | [状态失配与状态治理](../state-mismatch-state-governance-llm-systems.zh-CN.md) | observation、state authority、router |
| 优化代理目标却伤害真实结果 | [规格失配与目标治理](../specification-mismatch-objective-governance-llm-systems.zh-CN.md) | specification、verifier、human gate |
| 能力在错误场景触发或没有触发 | [拟合边界失配与能力路由](../fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md) | router、derived features、holdout |
| 关键变量未进入可操作表征 | [观测—表征失配与通道治理](../observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md) | sensor、retrieval、representation |

## 6. 可直接复制的场景 Prompt

### 6.1 通用任务

```text
请先完整阅读：
1. docs/guidelines/guidelines.zh-CN.md
2. docs/guidelines/task-intake-and-guideline-routing.zh-CN.md
3. <根据 guidelines.zh-CN.md 选择的主任务指南>
4. <必要的附加指南>

根据这些指南执行当前任务。行动前先确认任务类型、授权边界、权威来源、写入范围、
verifier、完成条件和停止条件。只在用户授权范围内写入。保持仓库已有无关修改。
最后按指南的 completion gate 验证，并报告结果、证据、残余风险和交付状态。
```

### 6.2 改进 Agent

```text
请完整阅读：
1. docs/guidelines/guidelines.zh-CN.md
2. docs/guidelines/task-intake-and-guideline-routing.zh-CN.md
3. docs/guidelines/agent-diagnosis-and-improvement.zh-CN.md
4. docs/guidelines/agent-five-knob-operating-guidelines.zh-CN.md
5. <与实际实现任务对应的侦察、Bug Fix 或 Feature/Migration 指南>

先冻结 baseline 和失败语料，定位最早因果失败层，再提出干预。
不要默认只修改 Prompt，也不要把 tool success 当成 task success。
分别报告 implementation、scientific、cost、safety 和 external-validity gate。
```

### 6.3 只诊断、不修改

```text
请完整阅读：
1. docs/guidelines/guidelines.zh-CN.md
2. docs/guidelines/task-intake-and-guideline-routing.zh-CN.md
3. docs/guidelines/failure-diagnosis-and-root-cause-localization.zh-CN.md
4. 必要时读取 docs/guidelines/codebase-reconnaissance-and-impact-analysis.zh-CN.md

本任务只授权检查和诊断，不授权修改。
请给出 expected vs observed、复现状态、最早失败层、竞争假设、区分证据、影响边界和
残余不确定性。证据不足时不要虚构根因。
```

## 7. 引用规则

在任务记录、PR 或 Agent 改进报告中，建议区分：

```text
Operating rule:
  实际遵守的 guidelines 文档

Theoretical basis:
  解释机制与系统边界的理论文档

Empirical basis:
  支持条件性工程策略的实验文档

Repository authority:
  当前代码、schema、测试、manifest 和本地指令
```

不得把：

- 理论推导写成已经完成的模型实证；
- 单模型、合成任务效应写成跨模型固定 SLA；
- offline property test 写成生产错误率为零；
- ceiling 或 floor 结果写成两种策略等价；
- 安全工程不变量写成已经确认的性能增益；
- 尚未完成的专门指南写成已经存在。

## 8. 路由完成检查表

```text
[ ] 已确认用户要求的是回答、诊断、修改、验证、操作还是交付
[ ] 已确认读、写和发布授权
[ ] 已选择一份主任务指南
[ ] 只加载了必要附加指南
[ ] 已知道每条重要规则的理论或实验依据
[ ] 已区分执行规则与证据边界
[ ] 已定义 verifier 与完成条件
[ ] 已明确停止、回滚或人工升级条件
[ ] 尚无专门指南的场景已标明“待补”，没有伪造流程
```
