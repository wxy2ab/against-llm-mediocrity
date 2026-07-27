# 聚合失配 Artifact-v4：实验证据、理论差距与 Agent 工程含义

**副标题：哪些机制得到支持，哪些只在数学上成立但尚未被模型实验识别**<br>
**状态：研究证据报告 v1.1**<br>
**数据核验：2026-07-28；已挂载 V5 后续证据**<br>
**证据范围：单个 DeepSeek-V4-Flash 部署配置；中文提示；18 个 GF(2) holdout**<br>
**English:** [Aggregation Mismatch Artifact-v4: Experimental Evidence, Theory Gaps, and Agent Implications](./aggregation-mismatch-v4-claims-theory-gap.md)<br>
**双语同步规则：** 两个版本的数字、裁决、证据边界和工程含义必须同步更新。

---

## 技术摘要

Artifact-v4 在 18 个全新 holdout、3 档长度、12 个 300 秒条件和
3 个独立预算点上完成 756/756 个预分配 run key。实验得到四个主要裁决：

1. **足够的正确答案 bits 会大幅恢复周期完整构造。** 完整 cut-set 相对无锚点
   提高 74.1 个百分点，95% instance-bootstrap 区间为 [57.4, 87.0]。
2. **恢复不具有已识别的结构位置特异性。** 等量随机位置的正确答案 bits 为
   54/54，完整 cut-set 为 53/54；结构−随机差为 −1.9 个百分点
   [−5.6, 0.0]。
3. **候选本身不会自动改善完整重写。** Five-bit candidate 的 full rewrite
   相对无候选为 −11.1 个百分点 [−22.2, −1.9]；random candidate 没有明确
   收益。Audit 相对同候选 rewrite 高 79.6–87.0 个百分点，但它同时改变了
   操作语义和输出，不能称为纯验证效应。
4. **增加预算只能部分恢复，并强烈依赖长度。** 无锚点构造在独立
   300/900/1800 秒调用中为 24.1%/37.0%/46.3%；\(N=24\) 在 1800 秒达到
   94.4%，\(N=32,48\) 仍仅为 27.8%/16.7%。

输出顺序条件在自然序和逆序两端都接近满分，受 ceiling 限制，无法裁决顺序效应。
Artifact-v4 没有运行 MiniMax，因此所有新裁决都必须限定为单配置。

后续 artifact-v5 原生 Agent 实验进一步收紧了 patch 的边界：给定同一权威 plan 时，
patch 相对完整重写高 41.7 个百分点 [27.1, 56.3]；模型自行推断 plan 时，差异只有
2.1 个百分点 [0.0, 6.3]。因此 V5 支持正确计划下的交付优势，不支持普遍的端到端
patch 优势。

最稳健的总括是：

> **周期完整构造对可见答案信息、操作接口、长度和预算高度敏感；足够正确 bits
> 可以近乎恢复，但当前实验没有识别出 cut-set 位置本身的额外收益。候选只有在任务
> 被改写为 audit 时才出现巨大完成优势，它本身不会自动改善全文重写。**

---

## 1. 实验与运行账本

冻结身份：

- study：`aggregation_mismatch_v4_p0`
- schema：`artifact-v4`
- dataset：`dataset/artifact-v4/3111d6e9e329e798`
- prompt set：`promptset/artifact-v4/8dd27dd8d7c50c0a`
- model：`SimpleDeepSeekClient::deepseek-v4-flash`

运行规模：

| 区块 | 分解 | runs |
|---|---:|---:|
| 12 条件 @300s | 18 instances × 12 × 3 repeats | 648 |
| A0 @900s | 18 × 3 | 54 |
| A0 @1800s | 18 × 3 | 54 |
| **合计** | | **756** |

长度为 \(N\in\{24,32,48\}\)，每档 6 个实例。三个预算点是独立预分配调用，
不是同一调用的 survival curve。

### 1.1 条件组

| 组 | 条件 | 操纵 |
|---|---|---|
| Boundary | A0/A1/A2/A3 | 无锚点、半 cut-set、完整 cut-set、等量随机正确 bits |
| Compact state | A4 | 模型提交 boundary seed，程序确定性展开 |
| Candidate/interface | C1–C5 | five/random candidate × rewrite/patch/audit |
| Order | O1/O2 | 因果任务的自然序/逆序提交 |
| Budget | A0@300/900/1800 | 独立 wall-clock 预算 |

Primary metric 是 `system_exact_success`。推断先在实例内平均 3 次重复，再对
18 个实例做固定种子 10,000 次 bootstrap。

---

## 2. 数据质量修正

运行覆盖本身完整：

```text
expected = 756
observed_unique = 756
missing = 0
unexpected = 0
duplicates = 0
```

对原始 JSONL 的进一步审计发现，一个早期 worker shard 的 7 行仍带 legacy evaluator
字段：可见输出存在，但 `condition_id/schema_version` 缺失，并被误记为
`format_invalid`。冻结 artifact-v4 evaluator 能严格解析这 7 行，且全部与真值一致。

分析器现对**全部 756 条响应**统一确定性重评分：

- 7 行从 `format_invalid` 修正为 `ok`；
- 7 行恢复 v4 condition/schema 元数据；
- 其余 749 行的成功状态与失败类型不变；
- 没有增加调用、best-of 或结果选择。

重评分后的失败类型为：

| ok | timeout | returned wrong | format invalid |
|---:|---:|---:|---:|
| 478 | 271 | 7 | 0 |

这一区分很重要：coverage 证明“每个 run key 有记录”；确定性重评分才证明
“该记录按正确版本的评分语义被解释”。

---

## 3. 结果

### 3.1 300 秒成功率

| condition | strict success |
|---|---:|
| A0 no anchor, full construction | 13/54（24.1%） |
| A1 half cut-set | 53/54（98.1%） |
| A2 full cut-set | 53/54（98.1%） |
| A3 equal-count random correct bits | 54/54（100%） |
| A4 compact boundary seed + executor | 21/54（38.9%） |
| C1 five-bit candidate + rewrite | 7/54（13.0%） |
| C2 five-bit candidate + patch | 8/54（14.8%） |
| C3 five-bit candidate + audit | 54/54（100%） |
| C4 random candidate + rewrite | 10/54（18.5%） |
| C5 random candidate + audit | 53/54（98.1%） |
| O1 causal natural order | 54/54（100%） |
| O2 causal reverse order | 53/54（98.1%） |

### 3.2 主要对比

| 对比 | 实例级差 | 95% bootstrap interval | 裁决 |
|---|---:|---:|---|
| A2−A0 | +0.741 | [0.574, 0.870] | 足够正确 bits 强恢复 |
| A2−A3 | −0.019 | [−0.056, 0.000] | 不支持结构位置特异收益 |
| A4−A0 | +0.148 | [0.037, 0.259] | compact state 有正收益但恢复有限 |
| C1−A0 | −0.111 | [−0.222, −0.019] | five-bit candidate rewrite 反而更差 |
| C2−C1 | +0.019 | [−0.037, 0.074] | v4 不支持 five-bit patch 优势 |
| C3−C1 | +0.870 | [0.722, 0.981] | audit/rewrite 组合差异巨大 |
| C4−A0 | −0.056 | [−0.148, 0.037] | random candidate rewrite 无明确收益 |
| C5−C4 | +0.796 | [0.648, 0.926] | audit/rewrite 组合差异巨大 |
| O1−O2 | +0.019 | [0.000, 0.056] | ceiling，无法有意义裁决 |

### 3.3 独立预算

| budget | all N | \(N=24\) | \(N=32\) | \(N=48\) |
|---:|---:|---:|---:|---:|
| 300s | 13/54 | 9/18 | 3/18 | 1/18 |
| 900s | 20/54 | 12/18 | 6/18 | 2/18 |
| 1800s | 25/54 | 17/18 | 5/18 | 3/18 |

\(N=32\) 的 1800 秒点低于 900 秒点并不矛盾：它们是独立随机调用，不要求
逐实例单调。

---

## 4. 实验能证明什么

### 当前证据支持

- 给出大量正确答案 bits 可以在当前配置中近乎恢复周期完整构造。
- Compact state + deterministic executor 相对完全无锚点有正收益。
- Candidate-conditioned audit 的预算内严格完成率远高于同候选 full rewrite。
- 候选本身不是可靠的 full-rewrite 支架；five-bit candidate 甚至产生负效应。
- 更多预算总体改善 A0，但恢复主要发生在较短实例。
- Patch 优势具有条件性：v4 的 five-bit、短对象条件没有复现 v3 的单点稀疏长对象优势。

### 当前证据不支持

- 结构 cut-set 位置相对等量随机正确 bits 有额外 LLM 收益；
- “audit−rewrite = 纯 verification ability”；
- patch 在所有 edit density 和长度上优于 rewrite；
- 1800 秒会普遍恢复周期构造；
- 自然序相对逆序存在已识别的模型收益；
- 跨模型、跨语言或跨真实领域的普遍规律。

---

## 5. 理论与实验之间的差距

### 5.1 充分边界状态

若把变量分为 \(C\) 与 \(R\)：

\[
H_Cx_C+H_Rx_R=c,
\]

给定正确 \(x_C\)，且 \(H_R\) 满列秩并一致，则 \(x_R\) 唯一确定。这是代数事实。

实验确认了“足够答案信息有用”，却没有确认“结构位置特别有用”。A3 不弱于 A2，
说明 observed recovery 也可能来自答案泄漏量、搜索空间缩小或通用支架。理论证明
state sufficiency；它不证明真实 LLM 会对某类 state 产生更大收益。

### 5.2 候选与 residual

给定候选 \(y\)，验证变成：

\[
r=Hy\oplus c.
\]

这证明候选把找解职责改写为 residual 计算。它不证明候选会帮助模型输出完整正确对象。
v4 恰好显示：candidate + rewrite 没有收益，candidate + audit 才大幅恢复。

### 5.3 Patch 的条件性

稀疏修改时：

\[
L_{\text{patch}}
=c_0+k(c_p+\lceil\log_2N\rceil)
\]

可以小于 \(L_{\text{rewrite}}=Nc_r\)。在正确 plan、可靠 executor 和交付风险随
提交面增加的条件下，patch 的交付优势可以推出。

Artifact-v3 的单点稀疏、\(N=96\)–384 条件与该理论一致；v4 的 five-bit、
\(N=24\)–48 条件差异为零附近。两者不冲突，而是共同限定 crossover：
edit density、长度、地址开销、耦合和 timeout floor 都会改变最优接口。

Artifact-v5 加入原生工具执行，并复现理论要求的分层：oracle-plan patch 为
46/48，rewrite 为 26/48；infer-plan patch 为 2/96，rewrite 为 0/96。
工具减少交付暴露，但不保证找到正确 plan。V5 也没有定位 density crossover：
6 个 infer-plan cell 中有 5 个共同为零，且未保留实际逐 run payload telemetry。

### 5.4 预算与顺序

数学可解性不能推出托管模型在给定 wall-clock 内完成，也不能推出成功率随独立预算点
单调。依赖图理论可以推出拓扑序减少未决前驱，但 O1/O2 的 ceiling 使本实验无法测得
模型效应幅度。

---

## 6. 对 Agent 开发的工程含义

| 发现 | Agent 调整 | 边界 |
|---|---|---|
| 足够答案信息强恢复 | 外部化可验证状态，允许 compact-state delivery | 必须用 ablation 检查 state 是否只是答案泄漏 |
| Compact seed 只部分恢复 | 由程序计算或校验 hard state，再确定性展开 | 不把“模型能推断 seed”当成保证 |
| Candidate rewrite 不改善 | 候选后接 verifier、failure witness 和最小修复 | 不只把旧对象附到 prompt 后要求全文重写 |
| v3 patch 正、v4 patch null | 用 edit density、长度、耦合和地址开销路由 | 不硬编码 `patch > rewrite` |
| v5 oracle patch 正、infer-plan 对照接近 floor | 写入前先验证 plan，再优化交付接口 | 不把稳定编辑器当作规划能力替代品 |
| 预算恢复不完整 | 使用 checkpoint、算法工具、预算升级和 fallback | 不无条件加 timeout |
| 顺序实验无裁决 | 内部依赖顺序与最终展示顺序分离 | 不宣称本实验量化了顺序收益 |

推荐默认闭环：

```text
authoritative state
→ model proposes plan / compact state / patch
→ deterministic executor
→ incremental checks
→ global verifier gate
→ commit or rollback
```

最小遥测应区分：

- `plan_correct`
- `delivery_correct_given_plan`
- `edit_density`
- `candidate_quality`
- `dependency_frontier`
- `verifier_failures`
- `budget_s`、latency、token usage
- `failure_class`

---

## 7. 下一步最有判别力的工作

1. 跨配置复现 v4，而不是继续堆叠同一配置实例。
2. 做 candidate information × operation × output 的 matched factorial。
3. 匹配答案 bits 数量、熵与位置覆盖，解开 cut-set 与通用答案支架。
4. 扫描 edit-density crossover，比较 patch、区域重写和全文重写。
5. 提高依赖前沿或长度，重做不受 ceiling 限制的顺序实验。
6. 在代码、配置、数据库和结构化文档中用可执行 verifier 做领域复现。
7. 在保留完整原生事件的条件下复现 V5，并加入提升 plan accuracy 的干预，
   继续分离 planning 与 delivery。

---

## 8. 可复现来源

- [原始 v4 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V4_P0_REPORT.md)
- [Claim–Evidence–Theory 原始审计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V4_P0_CLAIMS_THEORY_GAP.md)
- [机器可读 summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v4_p0/confirmatory/analysis/summary.json)
- [覆盖审计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v4_p0/confirmatory/analysis/coverage.json)
- [冻结设计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V4_P0_DESIGN_FREEZE.md)
- [完整论文](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/PAPER.md)
- [Artifact-v5 原生 Agent 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_STABLE_EDITING_AGENT_REPORT.md)
- [Artifact-v5 机器可读 summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/summary.json)

原始 `merged_runs.jsonl` 保留 legacy evaluator 产物以维持审计链。正式汇总必须通过
`analyze_v4_p0.py` 的统一重评分，不能直接聚合原始成功字段。

V5 的原始正式 `merged_runs.jsonl` 与完整事件 payload 在一次分支切换中未被保留。
当前 288 行 endpoint 表由完整 `run.log` 的完成记录按冻结 spec 对齐重建。最终成功、
failure class、condition、instance、\(N\)、\(k\) 与配对 endpoint 效应可以引用；
精确 repair-call 总数、latency/token、实际逐 run payload ratio 和 event-level
arm exclusivity 不可引用。

---

## 9. 结论

理论告诉我们，充分状态、residual、稀疏 patch 和拓扑执行会减少系统必须承担的职责；
实验告诉我们，一个真实 LLM 是否能兑现这些结构优势，以及优势在哪些长度、密度、接口
和预算下消失。

Artifact-v4 的主要贡献正是收窄二者之间的距离：

> **可证明的任务简化不等于可保证的模型收益。Agent 必须用权威状态、确定性执行器、
> verifier gate、可配置路由和遥测，把结构优势转化为可靠的端到端行为。**

Artifact-v5 增加了实际边界条件：正确 plan 已知时，稳定编辑工具能兑现 patch 的
交付优势；但它不会消除上游 plan-inference bottleneck。

---

## 相关文档

- [聚合失配与生成—验证不对称：受控实验证据](./aggregation-mismatch-generation-verification-asymmetry-evidence.zh-CN.md)
- [聚合失配：可推导命题、证明条件与 Agent 工程含义](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [Patch 与完整重写：稀疏修复交付接口的受控实验](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)
- [聚合失配 Artifact-v5：稳定编辑 Agent、规划瓶颈与条件性 Patch 优势](./aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)
- [LLM 系统中的聚合失配与组合治理](./aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
