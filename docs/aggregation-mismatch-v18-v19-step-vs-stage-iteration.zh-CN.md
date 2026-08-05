# 聚合失配 Artifact-v18/v19：Step 迭代与 Stage 迭代

日期：2026-08-01

文档类型：理论、实验、数据、推论与 Agent 工程应用的公开证据报告

状态：**V18/V19 DeepSeek confirmatory 均为 144/144 完成；四个预注册主 claim
均未通过；反方向的 Stage 优势在两种预算协议下重复出现；整体证据等级
`share_with_caveats`**

Study：`aggregation_mismatch_v18_plan_iteration_benefit` / `artifact-v18`；
`aggregation_mismatch_v19_plan_iteration_call_budget` / `artifact-v19`

**English:** [Aggregation Mismatch Artifacts v18/v19: Step Iteration versus
Stage Iteration](./aggregation-mismatch-v18-v19-step-vs-stage-iteration.md)

证据范围：两版冻结设计、各 48 个正式实例 × 3 臂、各 144 条完整 LLM episodes、
配对 bootstrap、exact two-sided sign-flip、逐事件账本与独立复算。原始材料保存在
`llm_dealer/exp/aggregation_mismatch_experiment/` 的 v18/v19 设计、结果与分析目录中。

## 技术摘要

V18/V19 没有证明原先预注册的“STEP 优于 STAGE”。实验观察到的方向恰好相反：

- V18 在每臂最多 3 次 plan revision 下，`STAGE_ITER` 为 **30/48（62.5%）**，
  `STEP_ITER` 与 `NO_ITER` 均为 **0/48**。
- V19 把预算改成 STEP/STAGE 共享最多 8 次 provider turn 后，`STEP_ITER` 提升至
  **5/48（10.4%）**，但 `STAGE_ITER` 仍为 **33/48（68.8%）**。
- V19 中 STEP−STAGE 为 **−0.583**，95% CI **[−0.729, −0.438]**；Stage 使用的
  provider turns 反而更少，均值约 **3.69**，STEP 约 **6.67**。

因此，当前最稳妥的工程结论是：

> 对本实验这类具有全局依赖和精确全局 verifier 的任务，先完成整程物化，再依据完整
> residual 做 Stage 级 replan，比在信息尚不完整时连续消耗预算做 Step 级局部修订更可靠。

这个结论值得挂载，因为它直接约束 Agent 的外循环设计；但它是**重复出现的反向
secondary / post-hoc 证据**，不是预注册 primary pass，也不是“Stage 永远优于 Step”
的普遍定律。

## 1. 理论问题：反馈频率不等于修复信息量

把任务表示为有向依赖图 (G=(V,E))。第 (i) 个 step 只能看到当前前缀状态、局部
结果与截至当前的 residual；Stage 完成后才能看到完整产物 (Y) 与全局验证结果
(R(Y))。两种策略分别近似为：

```text
STEP_ITER:
plan -> step_i -> local/global-so-far residual -> revise remaining plan -> ...

STAGE_ITER:
plan -> materialize all indexed layers -> global residual -> full replan -> rerun
```

如果后层约束依赖前层决定，早期局部 residual 可能既不完整，也不能判断一个局部修复
是否会破坏后续约束。此时更频繁的反馈会带来两个风险：

1. **信息不完整时消耗稀缺调用。**早期 revision 可能修的是局部症状，而不是全局根因。
2. **修复作用域不足。**只改剩余 plan 或很少 rollback，难以清除已物化的错误前缀。
3. **全局机会成本。**预算在前几个 step 用尽后，模型失去基于完整 residual 重构整图的
   机会。

反过来，如果每一步具有充分局部验收、依赖弱、回滚便宜且错误不会跨步传播，STEP
仍可能更好。V18/V19 检验的是前一种全局耦合情形，并不从理论上排除后一种情况。

## 2. 实验设计

### 2.1 共同协议

| 项 | 冻结设置 |
|---|---|
| 模型 | `SimpleDeepSeekClientChat` / `deepseek-v4-flash` |
| 推理配置 | 中文；temperature=0；`thinking=False`；每 turn 最多 32k tokens |
| 任务 | 合成有向无环 GF(2) DAG；step 为 topological layer |
| 规模 | (N\in\{16,24\})，frontier \(\in\{2,4\}\)；每 cell 12 个正式实例 |
| Formal | 48 个共享实例 × 3 臂 = 144 episodes / artifact |
| Pilot | 12 个独立实例 × 3 臂 = 36 episodes / artifact |
| 初始条件 | 每个实例三臂共享同一个冻结错误计划 (P_0) |
| 反馈 | verifier-guided residual / failed constraint IDs |
| 交付 | indexed layer submission；runtime 只检查 readiness，不替模型计算值 |
| Endpoint | `final_system_exact_success_within_budget` |
| 统计 | task 配对；10,000 次 bootstrap；exact two-sided sign-flip；双 primary Holm |
| 安全门 | coverage 完整；`unsafe_commit=0`；非全臂 floor/ceiling |

三臂只改变迭代政策：

| Condition | 行为 |
|---|---|
| `NO_ITER` | 执行共享 (P_0)，禁止修订 |
| `STEP_ITER` | 每个拓扑 layer 后读取 residual，可 keep、revise 或 rollback-replan |
| `STAGE_ITER` | 完整执行后做全局验证；失败则 full replan、重置 ledger 并重跑 |

### 2.2 V18 与 V19 的预算消融

| 协议 | 预算单位 | STEP / STAGE 上限 | 仍存在的不对称 |
|---|---|---:|---|
| V18 | plan revision 次数 | (R=3) | 一次 STEP revise 与一次整图 STAGE replan 的工作量不同 |
| V19 | provider turn 次数 | (K=8) | 调用数相同上限，但 STAGE 仍可在一次调用后整图重跑 |

V19 复用 V18 的同种子实例族，只改变预算计数协议。因此它是**预算协议消融**，不是一组
独立任务上的外部复现。V19 修复了“STEP 只能改 3 次”的主要批评，但没有对齐完整执行
遍数、layer apply 数、token、wall time 或总执行计算量。

### 2.3 预注册方向

两版都把以下方向注册为 primary，并要求最小效应 (+0.15)、bootstrap CI 下界大于 0、
Holm 后 (p<0.05)：

- V18-1 / V19-1：STEP − STAGE；
- V18-2 / V19-2：STEP − NO。

因此，观察到显著的负 STEP−STAGE 不能在事后改写成“原 primary 通过”。合法表述是：
原假设被反向数据否定，Stage 优势作为 secondary / post-hoc 工程证据报告。

## 3. 数据与结果

### 3.1 完整性

| Artifact | Formal coverage | 独立 task | 重复 run key | Unsafe commit |
|---|---:|---:|---:|---:|
| V18 | 144/144 | 48 | 0 | 0 |
| V19 | 144/144 | 48 | 0 | 0 |

冻结数据、manifest hash、三臂平衡和共享 (P_0) 检查均通过；v18/v19 数据冻结与迭代
状态机测试合计 **18 passed**。

### 3.2 两种预算协议都观察到 Stage 优势

| Artifact | NO_ITER | STEP_ITER | STAGE_ITER | STEP−STAGE |
|---|---:|---:|---:|---:|
| V18：(R=3) | 0/48（0%） | 0/48（0%） | **30/48（62.5%）** | **−0.625** |
| V19：(K=8) | 0/48（0%） | 5/48（10.4%） | **33/48（68.8%）** | **−0.583** |

这张联合表比两个分离柱图更适合本报告：它同时保留 exact numerator/denominator、预算
协议与效应方向，避免把跨 artifact 的相邻展示误读为合并样本。

### 3.3 预注册裁决与 secondary

| Claim / contrast | Δ | 95% CI | Holm p | 冻结状态 |
|---|---:|---|---:|---|
| V18-1 STEP−STAGE | −0.625 | [−0.750, −0.479] | (3.73\times10^{-9}) | `failed_pre_registered_gate` |
| V18-2 STEP−NO | 0.000 | [0, 0] | 1.0 | `failed_pre_registered_gate` |
| V19-1 STEP−STAGE | −0.583 | [−0.729, −0.438] | (1.49\times10^{-8}) | `failed_pre_registered_gate` |
| V19-2 STEP−NO | +0.104 | [+0.021, +0.188] | 0.0625 | `failed_pre_registered_gate` |
| V18 secondary STAGE−NO | +0.625 | [+0.479, +0.750] | 未纳入 primary Holm | secondary |
| V19 secondary STAGE−NO | +0.688 | [+0.563, +0.813] | 未纳入 primary Holm | secondary |

V19-2 的经验 CI 下界大于 0，但它既未达到预注册 (+0.15) 最小效应，也未通过 Holm
(p<0.05)，所以仍必须记为失败，不能只挑有利条件升格。

### 3.4 调用使用与失败层

| Artifact / arm | Mean provider turns | 成功 | 主要失败层 |
|---|---:|---:|---|
| V18 STEP | 3.00 / 3 | 0/48 | `verifier_fail` 48/48 |
| V18 STAGE | 2.08 / 3 | 30/48 | `budget_exhausted` 18/48 |
| V19 STEP | 6.67 / 8 | 5/48 | `verifier_fail` 43/48 |
| V19 STAGE | 3.69 / 8 | 33/48 | `budget_exhausted` 15/48 |

将 call 上限从 3 类修订扩到 8 个 provider turns 后，STEP 从 0% 恢复到 10.4%，说明
预算确实解释了一部分 V18 floor；但 STAGE 仍以更少平均调用取得更高成功率，剩余差异
不能只归因于“STEP 次数太少”。

## 4. 实验支持的推论

### 4.1 直接支持

- 在冻结的合成全局依赖任务和单一 DeepSeek 配置中，Stage-style full replan 的预算内
  exact success 明显高于 Step-style local revision。
- 将 STEP 的调用预算放宽后会产生小幅收益；“STEP 完全无用”不是合法结论。
- 决策时获得完整 global residual，并允许整图重构，是当前差异的合理机制解释。
- 反馈价值取决于**信息完整性、修复作用域和剩余预算**，而不只取决于反馈频率。

### 4.2 仍未证明

- “Stage 普遍优于 Step”，或真实代码、研究、浏览、工具编排任务都应禁止 step loop；
- 预注册的 V18/V19 primary 通过；四个 primary 实际均失败；
- V19 已做到完全公平的计算预算；full-pass、layer apply、token 与 wall-clock 未对齐；
- 差异是纯模型能力效应；policy state machine、verifier 和允许的 repair scope 共同决定结果；
- V18 与 V19 是两个独立样本复制；它们共享同一实例种子族；
- 全局 residual 是唯一机制；rollback 使用稀少、prompt 结构和整图重执行也可能贡献差异。

### 4.3 证据等级

本报告适合标为 **`share_with_caveats`**：方向大、配对区间远离 0、两种预算口径同向、
覆盖与安全门完整；但关键方向不是预注册目标，任务和模型单一，V19 也没有消除所有执行
不对称。它足以指导受控 Agent 设计和下一轮实验，不足以作为跨域默认定律。

## 5. 对 Agent 开发的工程意义

### 5.1 全局依赖任务默认采用 Stage 外循环

```text
propose typed plan
-> materialize complete indexed artifacts
-> run global verifier
-> emit structured residual / failed constraints
-> full replan or bounded global repair
-> reset affected ledger and rerun
-> commit only after final verification
```

这里的 “complete” 不是要求模型一次自由生成最终答案，而是要求 runtime 先收集一份可索引、
可验证的完整中间产物，再把全局失败见证交给下一次决策。

### 5.2 Step gate 可以保留，但默认作为诊断而非主修复器

每步仍应检查 schema、权限、安全不变量和不可逆副作用。局部 gate 的首要职责是：

- 阻止 unsafe commit；
- 记录局部证据与 provenance；
- 发现必须立即停止的 fatal condition；
- 为 Stage verifier 生成结构化账本。

除非局部 oracle 足以决定正确修复，否则不要让每个非致命告警都消耗一次 plan-revision
调用。可以收集 residual，到边界点统一 replan。

### 5.3 把预算从“总次数”改成分层预算

建议显式保留：

```text
step_safety_budget      # 只处理安全阻断或确定性局部修复
stage_replan_budget     # 留给完整 residual 后的全局重规划
final_verification_budget
escalation_budget
```

至少保留一次全局复核和一次合法终止机会，避免早期局部修订把调用预算耗尽。

### 5.4 什么时候更适合 Step，什么时候更适合 Stage

| 运行时证据 | 默认策略 |
|---|---|
| 强跨步依赖、全局约束、错误可污染后缀 | Stage replan |
| 只有完整产物才能得到高保真 verifier | Stage replan |
| 修复必须重写多个 assignments 或重置 ledger | Stage replan |
| 每步有充分局部 oracle，错误不跨步传播 | Step repair 可作为候选 |
| 动作不可逆或安全风险必须立即阻断 | Step gate / stop；不等 Stage |
| rollback 很便宜且状态转移完全可审计 | 可测试 hybrid |
| 无法判断耦合程度 | 先记录依赖图与 residual，再以 Stage 为保守默认 |

### 5.5 建议的 Hybrid，而不是二选一教条

最有前景的后续政策是：**Step 负责 gate、记账和 fatal stop；Stage 负责语义 replan。**
这保留了局部安全性，又避免把每个局部偏差都升级成一次昂贵且信息不足的模型修订。

## 6. 可能的应用

- **代码 Agent：**按文件或模块物化候选改动，运行完整测试/静态检查后再 replan；编译失败、
  权限错误等 fatal gate 仍即时停止。
- **研究 Agent：**先完成来源表、claim-evidence map 和冲突账本，再根据全局缺口重排研究
  计划，而不是每读一条材料就重写大纲。
- **数据/分析流水线：**完成可审计中间表和全局不变量检查后再修复 pipeline；避免局部
  行数或 schema 修正掩盖跨表约束。
- **多 Skill Workflow：**执行完整的已验证 workflow stage，记录每个 Skill receipt，
  再在 stage boundary 依据全局 residual 调整后续编排。
- **配置与迁移：**先生成并验证完整目标态、依赖和 drift ledger，再决定 patch、regional
  rewrite 或 full replan。

这些都是由当前机制推导出的工程候选，不是 V18/V19 已经直接验证过的生产场景。

## 7. 后续实测与剩余实验

### 7.1 Early Global Closure：已经实测，获得条件性支持

V18/V19 启发了一个尚未被这两版实验直接检验的长文本写作命题：

> 对全局依赖的超长写作任务，在相同 Plan、Control Space、最终篇幅和总预算约束下，
> `Full Skeleton → MVP Full Story → Full Story` 这种覆盖全文、逐级提高保真度的路径，
> 可能比直接进入 Full Story 或按局部前缀顺序扩写获得更高全局质量，并减少无效 token。

这个命题可以称为 **Early Global Closure（早期全局闭合）**。它不是“阶段越多越好”，
而是要求每个低保真中间对象已经覆盖全文：Skeleton 固定章节、claim-evidence binding、
转折和结尾；MVP 已经能从头读到尾并完成全部核心论证；Full Story 再增加细节与文体
完成度。高完成度的局部前缀不算全局闭合。

建议把质量和成本拆成独立 claim：

1. 在相同 provider-turn 和 episode token ceiling 下，progressive-fidelity ladder 是否
   提高最终 `global_pass`；
2. 只有质量至少 non-inferior 时，才裁决总 token 是否降低；
3. 同时加入等调用的 `DIRECT-FULL` 与 `PREFIX-STEP`，避免把“更多调用”误当成中间表示
   的价值。

V18/V19 只为这个推论提供“完整 residual + 全局修复作用域”的机制依据，**没有直接证明
Skeleton/MVP 有效，也没有证明 token 必然减少**。详细草案记录在
`llm_dealer/exp/aggregation_mismatch_experiment/docs/V20_EARLY_GLOBAL_CLOSURE_WRITING_DESIGN.md`。

后续 V20–V25 已经检验这项命题，结果是一条边界而非普遍胜出：V20 未过主门；V20R
在低负荷任务上观察到质量下降与编排税；V21 因 Ladder treatment 存在工程缺陷而无法作
因果裁决；clean-tree V22-r6 则在 9 个 high-load 故事上得到
`Ladder − Direct = +9.74 [6.32, 13.67]`，在 6 个 low-load 故事上近似为零。后续
Stage 实验建立了修复能力，但 V25 对 Stage 相对 Fixed 的平均质量仍为 inconclusive。
完整结论见双语 [V20–V25 写作与 Stage 综合](./aggregation-mismatch-v20-v25-writing-and-stage-repair.zh-CN.md)。

### 7.2 仍需完成的后续验证

1. **Hybrid primary：**预注册 `STEP_GATE + STAGE_REPLAN` 对纯 STEP 与纯 STAGE，区分
   局部安全 gate 和语义修订。
2. **完全预算对齐：**同时限制 provider turns、token、wall-clock、layer applies、full
   passes 和 verifier cost，报告 reliability–cost Pareto。
3. **耦合强度梯度：**系统改变 dependency density、error locality 与 rollback cost，找出
   Step/Stage crossover，而不是继续争论绝对赢家。
4. **独立任务与模型：**用新的 seed family、至少第二个模型和真实代码/配置任务复现。
5. **机制消融：**分别移除 global residual、ledger reset、full rewrite scope 和 rollback，
   判断 Stage 收益到底来自哪一项。

## 8. 最终结论

V18/V19 最重要的结果不是“预注册 claim 成立”，而是预注册方向被稳定地反转了：在这类
全局依赖任务中，局部、高频、早期的 plan revision 没有胜过整程后的全局 replan；即使
统一到 8 次 provider-turn 预算，Stage 仍从 10.4% 拉开到 68.8%。

因此，当前可采用的工程原则是：

> **局部 gate 用于安全与记账；全局 residual 用于语义重规划。对高耦合任务，先物化完整
> 可验证对象，再在 Stage 边界修复。**

采用这条原则时必须同时保留 claim ceiling：单模型、合成 DAG、反向 secondary 证据、
预算尚未完全对齐。下一步应寻找 Step/Stage 的 crossover 条件，而不是把本结果升级成
无条件默认。

## 9. 权威证据位置

- `exp/aggregation_mismatch_experiment/docs/V18_PLAN_ITERATION_BENEFIT_DESIGN.md`
- `exp/aggregation_mismatch_experiment/docs/V18_PLAN_ITERATION_BENEFIT_REPORT.md`
- `exp/aggregation_mismatch_experiment/docs/V19_PLAN_ITERATION_CALL_BUDGET_DESIGN.md`
- `exp/aggregation_mismatch_experiment/docs/V19_PLAN_ITERATION_CALL_BUDGET_REPORT.md`
- `exp/aggregation_mismatch_experiment/docs/V18_V19_GLOBAL_THEN_ITERATE_LESSON.md`
- `exp/aggregation_mismatch_experiment/results/v18_plan_iteration_benefit/confirmatory/`
- `exp/aggregation_mismatch_experiment/results/v19_plan_iteration_call_budget/confirmatory/`

本文不重定义冻结 claim、阈值或分母；如公开摘要与原始机器结果发生冲突，以
`analysis/summary.json`、`coverage.json` 和冻结 design manifest 为准。
