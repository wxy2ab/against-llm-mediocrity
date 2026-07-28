# 聚合失配 Artifact-v5：稳定编辑 Agent、Patch 交付与规划瓶颈

**副标题：正确计划已知后，原生 Patch 优于完整对象 Rewrite；但只替换写工具不足以解决端到端 Agent 任务**<br>
**状态：研究证据报告 v1.0**<br>
**数据截点：2026 年 7 月 28 日**<br>
**证据范围：DeepSeek-V4-Flash 单一部署配置；中文提示；48 个合成 GF(2) 修复实例；288 个 evaluated Agent arms**<br>
**English:** [Aggregation Mismatch Artifact-v5: Stable Editing Agents, Patch Delivery, and the Planning Bottleneck](./aggregation-mismatch-v5-stable-editing-agent.md)<br>
**双语同步规则：** 两个版本的条件名称、样本量、统计结果、证据质量限制与结论边界必须同步。

---

## 技术摘要

Artifact-v5 检验早期文本接口实验中观察到的 Patch 优势，能否在原生工具调用 Agent 中继续成立。

每个配对条件共享同一 candidate、plan、verifier、300 秒 episode budget 和最多一次 delivery repair，只替换写工具：

- Patch arm：原生 `file_edit_batch`
- Rewrite arm：原生 `file_write`

288-arm 正式矩阵给出一个分层裁决：

| 对比 | Patch | Rewrite | Patch − Rewrite | 裁决 |
|---|---:|---:|---:|---|
| 推断计划，端到端 | 2/96（2.1%） | 0/96（0%） | +2.1 pp，95% CI [0, +6.25] | **V5-C1 未通过** |
| Oracle 计划，仅交付 | 46/48（95.8%） | 26/48（54.2%） | **+41.7 pp，95% CI [+27.1, +56.25]** | **V5-C2 通过** |

Oracle 对比中有 21 个正向实例对、1 个反向实例对和 26 个持平实例，exact sign-flip 为 \(p=1.10\times10^{-5}\)。Infer-plan 效应没有达到预注册的 +10 个百分点最小实际效应，区间包含 0，sign-flip 为 \(p=1\)。

正确结论是：

> **在冻结的 DeepSeek-V4-Flash artifact-v5 协议下，正确计划已给定时，受测 cells 中的原生 batch Patch 预算内交付可靠性高于完整对象 Rewrite。**

实验没有证明：

> **端到端 Agent-level Patch superiority。**

Planning stage 几乎完全贴地。更可靠的写接口可以减少正确计划之后的交付损失，却不能修复错误计划。

---

## 1. v5 要回答的问题

早期实验留下了一个外部效度缺口。Artifact-v3 比较严格文本 Patch 与完整对象 Rewrite，并在 Patch arm 使用确定性 executor。它建立了 DeepSeek 配置内优势，但还不是使用原生工具的稳定编辑 Agent。

Artifact-v5 因此拆分两个问题：

1. **端到端问题：** Agent 必须先推断计划再交付修改时，Patch 是否优于 Rewrite？
2. **交付问题：** 正确计划已经已知时，原生 Patch 工具是否优于原生完整对象 Rewrite？

对应的估计量是：

\[
\Delta_I =
P(\text{final exact success}\mid I\text{-}P\text{-}A)
-
P(\text{final exact success}\mid I\text{-}R\text{-}A)
\]

以及

\[
\Delta_O =
P(\text{final exact success}\mid O\text{-}P\text{-}A)
-
P(\text{final exact success}\mid O\text{-}R\text{-}A).
\]

事前冻结的互斥裁决层级是：

```text
single_configuration_agent
delivery_only
insufficient_evidence
```

Artifact-v5 最终落在 `delivery_only`。

---

## 2. 实验设计

### 2.1 条件

| 条件 | Plan 来源 | 写接口 | 测量对象 |
|---|---|---|---|
| I-P-A | 模型推断；分叉前共享 | `file_edit_batch` | 端到端 Patch Agent |
| I-R-A | 与 I-P-A 相同的共享推断计划 | `file_write` | 端到端 Rewrite Agent |
| O-P-A | 正确 oracle plan | `file_edit_batch` | 正确计划给定后的 Patch 交付 |
| O-R-A | 同一正确 oracle plan | `file_write` | 正确计划给定后的 Rewrite 交付 |

Infer 条件在每个 repeat 中只生成一次计划，再把同一个计划分叉给两种交付 arm。Delivery repair 可以修复工具提交，但不能改变 `plan_hash`。这个约束非常重要：它防止某个失败的 delivery arm 暗中改做另一个 planning 问题。

### 2.2 矩阵与配置

| 项目 | 数值 |
|---|---:|
| 对象长度 \(N\) | 96、384 |
| Edit 数 \(k\) | 1、10、20 |
| \(N\times k\) cells | 6 |
| 每 cell 实例数 | 8 |
| 正式实例 | 48 |
| Infer repeats | 2 |
| Oracle repeats | 1 |
| Infer arms | 192 |
| Oracle arms | 96 |
| **Evaluated arms 合计** | **288/288** |

配置：

- `SimpleDeepSeekClientChat / deepseek-v4-flash`
- `thinking=False`
- temperature=0、top_p=1、max_tokens=64000
- 中文提示
- 300 秒 episode budget
- 最多一次 delivery repair

设计期 canonical payload-ratio 预检覆盖 0.045–1.785，包含 Patch payload 远小于、接近和大于完整对象 Rewrite 的三种区间。这些是 canonical plan 的设计值，不是从正式运行恢复的逐 run tool-payload 观测值。

### 2.3 严格成功

只有最终 workspace 对象在 episode budget 内与 ground truth 完全一致，才算成功。格式、陈旧状态、工具错误和 verifier 拒绝全部计为失败。

推断单位是实例：

- infer 条件先在每个实例内平均 repeats；
- 在 48 个实例上计算配对 Patch-minus-Rewrite；
- 使用固定种子、10,000 次实例 bootstrap；
- 非零实例数不超过 24 时，枚举全部 sign flips。

V5-C1 和 V5-C2 都必须同时满足三个门槛：

1. 平均差至少 +10 个百分点；
2. 95% 区间排除 0；
3. sign-flip \(p<0.05\)。

---

## 3. 结果

### 3.1 端到端 Agent superiority 未成立

I-P-A 为 2/96；I-R-A 为 0/96。实例级差为：

\[
\Delta_I=+0.0208,\qquad 95\%\ \mathrm{CI}=[0,0.0625],\qquad p=1.
\]

48 个配对实例中，只有 1 个有利于 Patch，47 个持平。V5-C1 没有通过任何实际效应或统计门槛。

这不等于写接口效果相同。它是一个受 floor 限制的端到端比较：共享 plan 错误时，两种写工具都无法产生正确最终对象。

### 3.2 计划正确时，Patch 交付明显更强

O-P-A 为 46/48；O-R-A 为 26/48。配对结果为：

\[
\Delta_O=+0.4167,\qquad
95\%\ \mathrm{CI}=[0.2708,0.5625],\qquad
p=1.0967\times10^{-5}.
\]

它通过预注册的最小实际效应、区间和 sign-flip 三个门槛。

失败类型也与交付解释一致：

| 条件 | ok | verifier fail | format invalid | stale hash | tool error |
|---|---:|---:|---:|---:|---:|
| I-P-A | 2 | 93 | 0 | 1 | 0 |
| I-R-A | 0 | 86 | 10 | 0 | 0 |
| O-P-A | 46 | 1 | 0 | 1 | 0 |
| O-R-A | 26 | 10 | 11 | 0 | 1 |

计划固定后，Rewrite 既会因为完整对象格式无效而损失，也会因为对象语义错误被 verifier 拒绝；Patch 在这些 cells 中基本避免了两类损失。

### 3.3 Oracle cell 探索性分层

每个 cell 有 8 个 oracle 实例；payload ratio 是设计期 canonical 值。

| \(N\) | \(k\) | Canonical payload ratio | Patch | Rewrite | 差值 |
|---:|---:|---:|---:|---:|---:|
| 96 | 1 | 0.179 | 8/8 | 4/8 | +50.0 pp |
| 96 | 10 | 0.938 | 8/8 | 8/8 | 0 |
| 96 | 20 | 1.785 | 7/8 | 7/8 | 0 |
| 384 | 1 | 0.045 | 8/8 | 3/8 | +62.5 pp |
| 384 | 10 | 0.237 | 8/8 | 2/8 | +75.0 pp |
| 384 | 20 | 0.451 | 7/8 | 2/8 | +62.5 pp |

这些 cells 与“长对象中 Patch 可能具有优势”一致，但没有识别普遍 edit-density 或 payload crossover。长度、edit 数和 payload ratio 同时变化；每个 cell 只有 8 个实例；而且预注册 crossover claim 针对的是受 floor 限制的 infer 条件。

### 3.4 Repair 与 Crossover Claim 仍受限

Infer first-attempt 与 final 的 Patch-minus-Rewrite 都是 +2.1 个百分点。没有观察到 repair 衰减或恢复，但比较几乎完全贴地，只能描述。

V5-C4 是**未裁决**，不是已证伪：

- 6 个 infer cells 中 5 个双臂成功率均为 0；
- 唯一非零 cell 的区间仍包含 0；
- 正式逐 run payload telemetry 未保留。

“没有观察到 crossover”不能改写成“没有 crossover”。

---

## 4. 为什么理论与端到端测量会分离

Patch 的条件性理论假设正确 edit plan 已经存在。把 Agent 成功简化为：

\[
P(\text{success})
\approx
P(\text{plan correct})
\times
P(\text{delivery succeeds}\mid\text{plan correct}).
\]

Artifact-v5 直接支持第二项存在巨大差异：

```text
正确 plan
→ Patch 交付：95.8%
→ Rewrite 交付：54.2%
```

但 infer 条件还要求第一项成立。当 planning 几乎总是失败时，下游交付优势会被一个接近 0 的上游概率压缩。

由此得到三个结论：

1. **条件性理论没有被推翻。** 它的正确计划假设正对应 oracle 正结果。
2. **端到端 claim 没有成立。** 真实 Agent 还需要 planning 与 plan validation，而不只是更好的 editor。
3. **工具替换不等于架构。** Patch 工具可以更忠实地执行错误计划，却不能让计划变正确。

---

## 5. 与 Artifact-v3、v4 的关系

| Artifact | 接口与区间 | 结果 | Claim 上限 |
|---|---|---|---|
| v3 | One-shot 文本；单点稀疏 edit；长对象 | Infer +21.7 pp；oracle +40.8 pp | DeepSeek 冻结协议内 Patch superiority |
| v4 | 较短对象；five-edit candidate | +1.9 pp，区间含 0 | 不能无条件外推到短对象或更高 edit count |
| v5 | 原生 tool Agent；共享 plan | Infer +2.1 pp 未过；oracle +41.7 pp 通过 | 仅正确计划后的交付优势 |

这些结果不矛盾。它们共同支持一条条件性路由规律：

> 当计划正确、修改足够稀疏、对象相对地址开销足够长、executor 可靠且 verifier 能治理提交时，Patch 更值得优先。

超出这些条件时，区域或完整 Rewrite 可能更合适。实验只校准了规律的一部分，没有把它变成普遍定律。

---

## 6. 对 Agent 开发的工程含义

### 6.1 在授予写权限前验证 Plan

推荐状态机：

```text
权威 candidate
→ planner
→ plan schema 与语义验证
→ delivery router
→ Patch / 区域 Rewrite / 完整 Rewrite
→ post-write verifier
→ commit 或 rollback
```

Plan 没有证据支持或内部不一致时，系统应 replan、检索证据、扩大搜索或升级，而不是期待另一种写工具修复 planning failure。

### 6.2 把 Patch 做成受治理的原生事务

生产级 Patch 路径应提供：

- 权威 baseline 与 `expected_hash`；
- batch 原子性；
- old/new precondition；
- 确定性 validation；
- checkpoint 与 rollback；
- 幂等 run identity；
- apply、verify 与 commit 分离。

Artifact-v5 复用了 `core/cc/editing` 的 hash、checkpoint、atomic-write 与 validation 组件。Batch editor 仍留在实验目录；本研究没有基准完整生产 `CcAgentRunner`。

### 6.3 按失败层路由 Repair

| 失败层 | 正确响应 |
|---|---|
| 错误或无证据支持的 plan | Replan、retrieve 或 expand search |
| Plan 正确、tool arguments 无效 | 重发参数 |
| stale hash 或 precondition 失败 | 重新加载权威状态并重新规划 |
| executor/tool failure | Rollback，修复工具或前置条件 |
| verifier failure | 返回 failure witness；局部修复或扩大 repair radius |
| 密集或整体结构变化 | 区域/完整 Rewrite + 全量验证 |

Artifact-v5 在 delivery repair 期间冻结 `plan_hash`，所以 delivery repair 不能隐藏 planning failure。

### 6.4 保留三路编辑 Router

| 任务状态 | 默认接口 |
|---|---|
| 稀疏、局部、低耦合、plan 已验证 | Patch + incremental verification |
| 中等密度、影响集中在一个区域 | function/subtree/section Rewrite |
| 高密度、schema 改变或整体重构 | Full Rewrite + full verification |

Router 应观测 plan confidence、edit count/density、对象长度、地址开销、dependency frontier、executor/verifier 可靠性、预算和配置内历史成功率。

### 6.5 保存阶段级 Telemetry

v5 的 artifact 丢失本身也是一条工程教训。Agent 评估应持久保存：

- 不可变 run 与 prompt identity；
- plan 与 plan hash；
- 每个 tool name 与 argument hash；
- state hash before/after；
- first-attempt 与 repaired outcome；
- repair count；
- 实际 Patch/Rewrite payload；
- latency 与 token usage；
- verifier witness；
- commit 或 rollback 结果。

Endpoint 日志足以支持当前交付裁决，但不足以做完整过程机制分析。

---

## 7. 证据质量与 Claim 边界

正式 API 运行后，原始正式 `merged_runs.jsonl` 与完整 tool-event payload 因一次分支切换丢失。当前 288 行表由完整 `run.log` 的全部 288 条 `done` 记录对齐冻结 run spec 重建。

### 可以安全引用

- 288/288 coverage；
- condition、instance、\(N\)、\(k\) 与 repeat 数；
- final success；
- failure class；
- native-event count（506）；
- 最终 I-P/I-R 与 O-P/O-R 配对效应。

同一 infer prompt 内的 repeat 编号交换不会改变每实例两重复均值。

### 不应作为精确过程 Telemetry 引用

- 完整 tool arguments 或事件顺序；
- 精确 delivery-repair API-call 数；
- 逐 run latency 或 token usage；
- 实际逐 run payload ratio；
- 事后事件级 arm-exclusivity 证明。

机器可读 summary 因此把精确 repair 与 total API 数设为 `null`，并把 V5-C4 标为 `not_adjudicated_floor_or_missing_payload_telemetry`。

这是一个有实质意义的 artifact 弱点，但不会反转 endpoint 计数。如果要把 v5 从支持性证据提升为论文决定性结果，最高价值的复现是沿用同一冻结设计并持久保存原生事件流。

---

## 8. v5 已经证明与尚未证明的内容

**已支持**

- 正确 plan 给定后，原生 Patch 交付可以相对完整对象 Rewrite 保留巨大优势。
- Planning bottleneck 可以在端到端 Agent 成功率中遮蔽下游接口优势。
- Agent 评估应报告阶段条件可靠性，而不只是一个最终成功率。
- Plan validation 与写接口路由是两个不同的工程职责。

**未支持**

- Patch 永远优于 Rewrite。
- 端到端 Patch Agent 跨任务或跨模型更强。
- edit-density crossover 已经识别。
- 一次 delivery repair 在一般情况下无效。
- 结果可以直接迁移到生产代码编辑。
- 效应与语言、模型、预算、executor 或 verifier 无关。

---

## 9. 可复现来源

- [v5 设计冻结](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_AGENT_PATCH_REWRITE_DESIGN_FREEZE.md)
- [v5 完整报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_STABLE_EDITING_AGENT_REPORT.md)
- [机器可读 summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/summary.json)
- [Coverage audit](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/coverage.json)
- [恢复版 endpoint rows](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/merged_runs.jsonl)
- [完整 run log](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/run.log)
- [完整实验仓库](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment)

---

## 10. 结论

Artifact-v5 给出了一个比“Patch 优于 Rewrite”更窄、也更有用的结论：

> **稳定的原生 Patch 路径可以显著提高正确计划的交付可靠性；但 Agent 仍需要可靠 planner 与 plan-verification gate，才能把这种优势转化为端到端收益。**

工程处方因此是：

```text
验证 plan
+ 最小化模型承担的提交面
+ 通过事务性 executor 应用
+ 验证结果状态
+ commit 或 rollback
```

Patch 是条件性交付优势；planning governance 决定这种优势能否成为 Agent 优势。

---

## 相关文档

- [Aggregation Mismatch Artifact-v5: English](./aggregation-mismatch-v5-stable-editing-agent.md)
- [Artifact-v8 后续：运行时所有权与语义寻址](./aggregation-mismatch-v8-runtime-ownership-routing.zh-CN.md)
- [Artifact-v7 后续：机制恢复与确定性交付](./aggregation-mismatch-v7-mechanism-recovery.zh-CN.md)
- [Patch 与完整重写：稀疏修复受控实验](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)
- [聚合失配 Artifact-v4：证据、理论差距与 Agent 含义](./aggregation-mismatch-v4-claims-theory-gap.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [聚合失配与组合治理](./aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
