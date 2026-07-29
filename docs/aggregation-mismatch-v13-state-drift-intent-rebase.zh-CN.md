# 聚合失配 Artifact-v13：状态漂移与 Intent Rebase

**文档类型：** 理论—实验—数据—工程核验报告

**证据截止：** 2026-07-29

**总裁决：** **已归档的方法开发 artifact；Primary V13-A1 因四臂 ceiling 未裁决**

**合成状态：** 不进入 V1–V12 + V14 证据合成。V14 替换的是时序设计，不删除本历史记录。

**Study：** `aggregation_mismatch_v13_state_drift_intent_rebase`

**Schema：** `artifact-v13`

**English：** [Aggregation Mismatch Artifact-v13: State Drift and Intent Rebase](./aggregation-mismatch-v13-state-drift-intent-rebase.md)

**双语同步规则：** 样本数、效应、CI、p、claim state 与边界必须一致。

## 一句话结论

在冻结 DeepSeek repository-shaped 协议中，四臂 Disjoint/Compatible × Intent/Exact
均 **24/24**。预注册交互
\((INTENT-EXACT)_{\mathrm{compatible}}-(INTENT-EXACT)_{\mathrm{disjoint}}\) 为
**0.0**，但四臂同处 ceiling（≥0.90），故 V13-A1 为
**`not_adjudicated_floor_or_ceiling`**。Ceiling 不等于等价，也不否定 Intent rebase
方向。

## 技术摘要

| 项 | 结果 |
|---|---:|
| Formal / pilot / offline | **96/96** / **12/12** / **768/768** |
| Formal tasks | 24 |
| Provider turns / transport attempts | 96 / 96 |
| Endpoint 重建 mismatch | 0 |
| Offline FA / FR / mismatch | 0 / 0 / 0 |
| V13 tests | **21/21 passed** |
| 四臂成功率 | 各 **24/24** |
| V13-A1 interaction | **0.0**，95% CI **[0.0, 0.0]** |
| V13-A1 sign-flip \(p\) | 1.0 (`no_nonzero_pairs`) |
| V13-A1 state | **`not_adjudicated_floor_or_ceiling`** |
| Formal tokens | **967,252** |
| Over-budget success | **0** |

## 1. 理论

计划冻结后权威状态可能漂移。runtime 解释的 Intent（`at_least`/`at_most`）应对
**兼容目标字段**变化更耐 rebase；**无关字段**变化下 Intent 与 Exact 应更接近。

\[
\Delta_{A1}
=
(P_{\text{INTENT}}-P_{\text{EXACT}})_{\text{compatible}}
-
(P_{\text{INTENT}}-P_{\text{EXACT}})_{\text{disjoint}}
\]

通过门：\(\Delta\ge +0.15\)；bootstrap CI 下界 \(>0\)；sign-flip \(p<0.05\)；
四臂不同时 floor/ceiling；data/event/offline gates 通过。单一 primary，无 Holm。

## 2. 实验

- DeepSeek-v4-flash；thinking=False；T=0；max_tokens=32k；zh；300s；单轮；无 repair
- 24 clusters；\(N\in\{72,96,144\}\)×8；\(k=N/12\)
- Intent 仅 `apply_intent_operations`；Exact 仅 `apply_exact_patch`
- Bootstrap seed=20260813；10,000 次

## 3. 数据完整性

冻结 SHA/preflight `errors=[]`；prior overlap=0；offline FA/FR=0；pilot 机械审计通过；
formal missing/extra/dup=0；endpoint↔event 重建 ok；arm matching ok；21 tests passed。

## 4. Primary

![状态漂移×操作契约](./assets/aggregation-mismatch-experiment/v13-a-drift-contract-success.png)

\[
\Delta_{A1}=(1.0-1.0)_{\text{compatible}}-(1.0-1.0)_{\text{disjoint}}=0.0
\]

state=`not_adjudicated_floor_or_ceiling`（reason=`ceiling`）。

若 A1 通过，只允许写：在冻结 DeepSeek repository-shaped 协议中，目标字段发生兼容
状态变化时，runtime-interpreted Intent 相对 Exact Patch 的预算内严格成功优势，比只
发生无关状态变化时更大。本次**不许可**该表述。

## 5. Secondary / failure / cost

两漂移下 Intent−Exact 简单差均为 0（exploratory）。正式 96 终态皆 `success`。
Offline 768 仍拒绝 stale Exact、locked、错误阈值与错目标。median wall ≈4.3–6.0s。

## 6. Claim 审计

- **支持：** 冻结完整性；event 可重建；offline 安全合同；pilot 机械审计
- **不支持：** V13-A1 通过；Intent 永远优于 Exact
- **未裁决：** V13-A1（四臂 ceiling）
- **不可推广：** 单 DeepSeek；合成仓库；外生 plan；offline 768≠生产 100%；不得删除
  precondition/lock/verifier；不否定 Full Rewrite；非真实生产验证

## 7. 工程含义

可实现 runtime Intent 解释与 Exact stale/lock 检查；不可把本 ceiling 矩阵当“永远选
Intent”的路由证据。下一步需要离开 ceiling 的难度梯，且不得事后改 threshold。

## 来源

- [Artifact-v14 Post-Compile Drift 与 Exact Recovery](./aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)
- [V1–V12 + V14 实验总览](./aggregation-mismatch-v1-v12-v14-experiment-summary.zh-CN.md)
- [冻结设计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V13_STATE_DRIFT_INTENT_REBASE_DESIGN.md)
- [正式报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V13_STATE_DRIFT_INTENT_REBASE_REPORT.md)
- [独立核验](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V13_STATE_DRIFT_INTENT_REBASE_VALIDATION.md)
