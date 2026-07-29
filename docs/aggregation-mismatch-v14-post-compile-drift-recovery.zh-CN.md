# 聚合失配 Artifact-v14：Post-Compile Drift 与 Exact Recovery

**文档类型：** 理论—实验—数据—工程验证报告

**证据截止：** 2026-07-29

**总体判断：** **安全机制成立；预注册的 +20% token-cost interaction 未通过**

**研究族：** `aggregation_mismatch_v14_post_compile_drift_recovery`

**Schema：** `artifact-v14`

**English:** [Aggregation Mismatch Artifact-v14: Post-Compile Drift and Exact Recovery](./aggregation-mismatch-v14-post-compile-drift-recovery.md)

**双语同步规则：** 两个版本的样本量、估计值、裁决、局限与工程规则必须保持一致。

## 一句话结论

在 provider 已根据旧状态生成并封存工具 payload、随后权威状态才发生 compatible drift
的严格 TOCTOU 时序下，Exact payload 24/24 被安全地判为 stale，并在同一预算内经一次
located recovery 全部完成；Intent 24/24 一次提交。Exact recovery 的配对
log-token interaction 为 0.1765（几何成本比约 1.193），方向稳定但略低于预注册
\(\log(1.20)=0.1823\)，因此 V14-A1 为 `failed_pre_registered_gate`。

## 技术摘要

| 项目 | 结果 |
|---|---:|
| Formal / pilot / offline | **96/96** / **12/12** / **768/768** |
| Formal tasks / conditions | 24 / 4 |
| Formal raw events | **1,416** |
| Provider turns / transport attempts | **120 / 120** |
| Endpoint reconstruction mismatch | 0 |
| Offline false accept / reject / mutation | 0 / 0 / 0 |
| Initial post-state leak | 0 |
| Seal before drift | 96/96 |
| Compatible Exact first attempt | 0/24 commit；24/24 `STALE_OLD_VALUE` |
| Compatible Exact final success | 24/24 |
| Compatible Intent first-attempt commit | 24/24 |
| 四臂 final success | 各 24/24 |
| V14-A1 | **0.176459**；95% CI **[0.168331, 0.184575]** |
| Exact sign-flip | \(2/2^{24}=1.1921\times10^{-7}\) |
| Minimum effect | \(\log(1.20)=0.182322\) |
| Claim state | **`failed_pre_registered_gate`** |
| Formal tokens | **1,571,142** |
| Unsafe / over-budget success | 0 / 0 |
| V14 tests | **24 passed** |

## 1. 理论

### 1.1 V14 检验的是真正的 post-compile drift

冻结时序为：

\[
S_0
\rightarrow Q_0
\rightarrow Seal(Q_0)
\rightarrow D
\rightarrow S_1
\rightarrow Execute(Q_0,S_1).
\]

模型初始 provider turn 只能看到 \(S_0\)。只有当工具参数 \(Q_0\) 已被捕获、校验并
封存后，harness 才注入 drift。若模型先看到 \(S_1\)，实验测到的只是“针对新状态重新
生成”，而不是已编译 payload 的陈旧性。

### 1.2 Intent 与 Exact 拥有不同的时间语义

- **Exact** payload 承诺某个 old value / precondition 仍成立。compatible drift 改变
  目标字段后，安全 executor 必须拒绝旧 payload。
- **Intent** 描述目标谓词，由 runtime 针对当前权威状态解释。只要目标语义仍兼容，
  它可以在漂移后继续执行。

这不推出“Intent 永远优于 Exact”。Exact 提供更窄的写入权限、更强的可审计性和明确
的并发冲突语义；Intent 需要可信的解释器和接受边界。

### 1.3 Primary 是成本交互，不是成功率差

四臂为：

- DI：Disjoint Intent；
- DE：Disjoint Exact；
- CI：Compatible Intent；
- CE：Compatible Exact + located recovery。

任务级配对统计量：

\[
d_i=
[\log T_{CE,i}-\log T_{CI,i}]
-
[\log T_{DE,i}-\log T_{DI,i}],
\qquad
\Delta_{A1}=\frac{1}{24}\sum_i d_i.
\]

通过门不仅要求 \(\Delta>0\)，还要求：

\[
\Delta\ge\log(1.20),
\]

且 bootstrap CI 下界大于 0、exact two-sided sign-flip \(p<0.05\)、四臂最终成功率
至少 0.75、安全与数据质量 gate 全部通过。最小效应门是工程承诺，不得在看到结果后
下调。

## 2. 实验

- DeepSeek-V4-Flash；中文；`thinking=False`；temperature 0；top_p 1；
- 最大 32k tokens；每个 semantic episode 共享 300 秒预算；
- 24 个正式任务，\(N\in\{96,144,216\}\)，每档 8 个；
- 每个任务进入 DI、DE、CI、CE 四臂；
- Initial provider output 先 seal，再注入 compatible 或 disjoint drift；
- 只有 CE 在 typed stale 后允许一次 `RECOVER-EXACT-LOCATED`；
- old-value precondition、lock、atomic apply、global verifier、commit/rollback；
- bootstrap seed 20260814，10,000 resamples；单一 primary，无 Holm。

V14 隔离的是 verified goal/plan 之后的 payload 时间语义与恢复成本。它不检验自主
plan inference、检索、真实多人仓库合并或开放式代码正确性。

## 3. 数据完整性与分析审计

Formal 共有 96 个唯一 run key 和 1,416 条 append-only events；missing、extra、
duplicate key 均为 0。每个 run 的 event index 连续，终态唯一，96/96 满足
`initial_payload_sealed` 早于 `drift_injected`，endpoint 可由 events 零错配重建。

768 个 offline executor case 覆盖有效和变异 payload；false accept、false reject、
input mutation 与 payload mutation 均为 0。96 个 formal endpoint 的
`input_tokens + output_tokens = total_tokens` 全部成立。

初版 analyzer 在 \(n=24\) 时误用了 1,000,000 次 Monte Carlo sign-flip，而冻结方案
要求 exact test。由于 24/24 配对差值同号，精确双侧值可闭式计算为
\(2/2^{24}=1.1921\times10^{-7}\)。实现与派生产物已修复；effect、CI、
minimum-effect 判断和最终 claim state 均未改变。

## 4. 数据与结果

### 4.1 机制结果

![V14 首次尝试与最终成功](./assets/aggregation-mismatch-experiment/v14-first-vs-final.png)

| 条件 | 首次 commit | Final success | Recovery |
|---|---:|---:|---:|
| Disjoint Intent | 24/24 | 24/24 | 0 |
| Disjoint Exact | 24/24 | 24/24 | 0 |
| Compatible Intent | 24/24 | 24/24 | 0 |
| Compatible Exact + recovery | **0/24** | **24/24** | **24/24** |

CE 的 24 个第一次提交全部返回 `STALE_OLD_VALUE`，权威状态没有被旧 payload 部分修改；
随后 24 个任务都在同一 run key 和共享预算内完成 located recovery。Expected stale
是正确的安全拒绝，不是 terminal failure。

### 4.2 V14-A1 未通过预注册最小效应门

![V14 配对 token 成本交互](./assets/aggregation-mismatch-experiment/v14-token-interaction.png)

\[
\Delta_{A1}=0.176459,
\qquad
\exp(\Delta)=1.19299,
\qquad
95\%\ CI=[0.168331,0.184575].
\]

24/24 task interaction 为正，exact \(p=1.1921\times10^{-7}\)。但是：

\[
0.176459 < \log(1.20)=0.182322.
\]

因此确认性裁决是 `failed_pre_registered_gate`。可以说“本协议中存在稳定的正成本
交互，点估计约 +19.3%”，不能说“通过了至少 +20% 的成本门”，也不能把 failed gate
写成零效应或反向效应。

按 \(N\) 的探索性几何成本比为 1.210、1.186、1.183（各 8 个任务）。该分层没有
预注册为 primary，不能写成随规模单调下降的定律。

### 4.3 成本

![V14 provider turns 与 wall time](./assets/aggregation-mismatch-experiment/v14-turns-wall.png)

| 条件 | Median tokens | P90 tokens | Median wall | Provider turns |
|---|---:|---:|---:|---:|
| Disjoint Intent | 14,606.5 | 21,526.3 | 6.96 s | 24 |
| Disjoint Exact | 15,187.5 | 22,300.3 | 8.84 s | 24 |
| Compatible Intent | 14,606.5 | 21,526.3 | 6.41 s | 24 |
| Compatible Exact + recovery | 18,112.5 | 26,551.1 | 14.62 s | 48 |

DI 与 CI 在 24/24 配对任务上的 initial prompt、tool arguments 和 token 完全相同。
这是 seal-before-drift 设计的预期结果；CE 的第二个 provider turn 构成恢复增量。

## 5. 结论与 claim 边界

### 支持

- 严格 post-seal drift 时序已实现且可从 event ledger 复核。
- Compatible drift 后，sealed Exact payload 24/24 被安全判 stale。
- Typed located recovery 在本冻结协议和共享预算内 24/24 完成。
- Intent 在受测单调谓词中可由 runtime 针对当前状态解释并一次提交。
- Offline executor 和正式 commit path 没有 unsafe commit 或状态污染。
- Exact recovery 的相对 token 成本交互方向稳定且 CI 下界大于 0。

### 不支持

- V14-A1 达到预注册至少 +20% 的 token interaction。
- Intent 永远比 Exact 便宜、可靠或安全。
- Exact precondition、lock、verifier 可以删除。
- 任意自然语言 Intent 都能安全自动 merge。
- 该成本比可跨模型、对象类型和生产并发直接复用。

### 未测量或不可推广

- 单模型、中文提示、合成 repository-shaped 状态；
- 外生 verified goal/plan，单调 replicas/timeout 字段；
- 没有真实 Git merge、非单调语义、多人并发、网络副作用或长事务；
- 768/768 offline 是实现采用证据，不是生产总体 100% 保证。

## 6. 理论—实验差距

| 理论或设计主张 | V14 证据 | 剩余缺口 |
|---|---|---|
| Exact precondition 应阻止陈旧写入 | 24/24 stale、unsafe=0 | 真实文件、数据库和多 writer |
| Intent 可在当前状态重新解释 | Compatible Intent 24/24 | 冲突、非单调与含糊 Intent |
| Recovery 增加模型交付负担 | +19.3%，CI 下界 >0 | 未达冻结 +20% 门；第二模型 |
| Typed receipt 支持局部恢复 | located recovery 24/24 | 与 generic/causal receipt 的随机对比 |
| Event ledger 可重建语义 episode | 96/96 mismatch=0 | crash/replay 与分布式事务 |

## 7. 工程意义

1. **把 payload seal 作为正式状态转移。** 记录 payload hash、plan hash、pre-state hash
   和 seal event；“模型已经回答”不足以定义已编译操作。
2. **执行时重验权威状态。** old value、version、lock 和目标身份必须在 atomic apply
   前检查，不能依赖 prompt 时的快照。
3. **把 stale 变成 typed receipt。** 返回 failed target、observed value、current
   version 和允许的恢复动作；不要 generic retry。
4. **恢复属于原 semantic episode。** 共享 run key、预算和 event ledger，避免把一次
   失败后的第二 turn 伪装成独立样本。
5. **Intent / Exact 是条件路由。** 高冲突风险或窄权限使用 Exact；可验证、单调、
   可解释的目标可考虑 Intent；两条路径都必须经过 verifier 与 commit gate。
6. **科学门和产品策略分离。** V14-A1 failed gate 不要求删除 recovery，也不授权宣称
   固定成本优势；应以 shadow/canary telemetry 校准路由。

## 8. 可能的应用

- **代码 Agent：** patch 生成后文件变化时，拒绝旧 hunk，重读 symbol/region 并局部
  rebase，再运行 format/type/test 与全局 diff audit。
- **配置系统：** 使用 stable entity ID、old-value/version precondition 与 atomic
  batch；对“保证至少 k 个副本”等单调 Intent 由 runtime 解释。
- **数据库迁移：** 在 seal 后执行前重验 schema version 和 lock；冲突时重编译 migration。
- **表格与财务模型：** 以 row key/semantic column 解析最新坐标，拒绝绑定旧 cell 的写入。
- **多 Agent 合并：** 每个子任务提交 sealed plan + base hash；冲突进入 typed rebase，
  禁止 last-writer-wins 覆盖。
- **长事务与工具调用：** provider response 与真实 side effect 之间建立明确的
  prepare/seal/validate/commit 边界。

## 9. 下一步

1. 用第二模型原样复现冻结 cost interaction，不改 +20% 门。
2. 将任务迁移到真实 repository conflict、JSON schema migration 和数据库 DDL。
3. 加入非单调或互斥 Intent，测量 runtime interpreter 的 false accept/reject。
4. 比较 located、causal 与 full-replan recovery 的成功—token—latency—风险前沿。
5. 注入 crash/replay、多 writer 与长事务，验证幂等、rollback 和 ledger 完整性。

## 相关文档

- [V1–V12 与 V14 实验总览](./aggregation-mismatch-v1-v12-v14-experiment-summary.zh-CN.md)
- [V1–V12 与 V14：Agent 工程经验](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14.zh-CN.md)
- [聚合失配：可推导命题、证明条件与 Agent 工程含义](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [聚合失配与 LLM 系统的组合治理](./aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
- [Artifact-v12：漂移剂量与交付尺度路由](./aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)

## 原始 Artifact

- [冻结设计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V14_POST_COMPILE_DRIFT_RECOVERY_DESIGN.md)
- [正式报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V14_POST_COMPILE_DRIFT_RECOVERY_REPORT.md)
- [独立核验](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V14_POST_COMPILE_DRIFT_RECOVERY_VALIDATION.md)
- [机器汇总](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v14_post_compile_drift_recovery/confirmatory/analysis/summary.json)
