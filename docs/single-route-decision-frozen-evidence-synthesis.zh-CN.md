# 单路由决策：RR1–RR7 与 RR-v2 冻结证据综合

日期：2026-07-31

状态：`evidence synthesis`（不改写任何冻结 Stage、分母或 Freeze SHA）

范围：Task 到单个 Skill、Action path、DeliveryMode、Recovery action，以及单个候选的
Top-1 / Rank-Pick / Abstain 判断

**English:** [Single-Route Decisions: A Synthesis of Frozen RR1–RR7 and RR-v2 Evidence](./single-route-decision-frozen-evidence-synthesis.md)

**权威来源：** 本文同步自 `llm_dealer` 的冻结 Routing Reliability 证据线；所有原始
数字、分母与 claim 状态仍以[上游决策版综合](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/SINGLE_ROUTE_DECISION_SYNTHESIS.md)、对应 Stage 和机器结果为准。

## 技术总结

这一轮实验没有找到一个可以全局默认开启的“智能 Router”。它支持的是一组条件化边界：

1. **只有一个经外部证书确认的合法候选时，直接执行。** CSP-2R 在 complete registry、
   validated filter 和 single eligible 同时成立的 6 个独立 holdout base cases 上，跳过
   picker 后 e2e/wrong 与 rank-pick 完全相同，picker 调用下降 100%。
2. **多个候选或候选可能缺失时，不能用 raw Top-1 取代语义选择与拒绝。** CSP-1 中
   BM25 Top-1 e2e=0.583、wrong=0.417，而 Top-5→live picker/abstain e2e=1.000；但
   CSP-2R 又显示当前 picker 在 lexical trap 上 e2e=0/12、wrong=10/12，在 soft absence
   上也不稳定。因此 Rank-Pick 是保守 fallback，不是已经证明安全的普适默认。
3. **分数和 margin 不是生产证书。** CSP-2R 的 score gate 放行 12/36 个 base cases，
   观察 wrong=0，但 coverage=0.333 低于 0.40，单侧 Clopper–Pearson upper≈0.221 高于
   0.20；按预注册停止规则，不再开放搜索 BM25 score/margin Top-1 阈值。
4. **Typed abstain 有真实 LLM 证据，但只到 narrow canary。** P0-A-ood 中
   DeepSeek V4 Flash + abstain 在 36 个 lexical-OOD holdout case、每例 3 次重复上为
   106/108 成功、wrong=2/108、legal coverage=1.000；它支持保留并 canary 该接口，
   不支持默认全开或自然 OOD 外推。
5. **路径等价时不要路由；路径不等价时才值得条件化选择。** RR4 中冗余
   route+compile+重复 invoke 把平均动作数从 1 增到 4，成功率仍为 1.0；P1-D 的种植
   非等价层则为条件规则 D3=1.000、固定臂最低 D1=0.250。
6. **Delivery 和 Failure 仍不能改生产默认。** P0-B-real 打通真实写入+pytest，但
   always-EXACT 与 sparsity-aware 都为 1.0；P0-C-exec 打通可执行恢复算子，但 C3/C4
   实际使用同一策略。当前只能保留实验 harness 和隔离 TRIAGE。

因此，当前最稳健的单路由策略不是“永远 Top-1”或“永远 Rank-Pick”，而是：

```text
外部认证唯一合法候选                         → direct / Top-1
多个合法候选                                 → Top-K + picker + explicit abstain
候选存在性不确定、soft absence、lexical trap → verifier / confirm / safe stop
仅有 raw score 或 margin                     → 不作为 production fast-path 证书
已知动作路径等价                             → 关闭冗余 router
动作路径确实不等价                           → 使用受约束条件规则
plan error                                   → bounded replan
未知 delivery error                          → stop / escalate；不 blind re-emit
```

## 1. 本文只总结单路由，不讨论 Workflow

单路由是一次局部选择：

```text
R_skill:    task/context → one skill (+ allowlisted tool)
R_action:   observation → one action path
R_delivery: verified plan + runtime signals → one DeliveryMode
R_failure:  classified failure → one recovery action class
```

本文明确不裁决：

- Task 是否被正确分解成多阶段 Workflow；
- Skill1→Bridge1→Skill2 的依赖图、顺序或中间状态；
- 动态 re-routing、并行 DAG、join 或补偿事务；
- SGAR / SGARX 是否优于普通 Agent；
- 多 Skill 编排的端到端可靠性。

这些问题的 route object 是完整 Workflow，而不是一个 Skill 名，必须另开协议。

## 2. 证据层级、分母与权威顺序

### 2.1 权威顺序

发生表述差异时，本文采用以下顺序：

1. 各 Stage 的冻结结果区、claim table 和 Freeze 区；
2. 机器结果 JSON；
3. 后验 Decisive 证据审计对外推范围的修订；
4. Roadmap 与总览性文字。

后验审计不修改冻结数字，但会降低不被实验设计识别的 headline claim。例如：

- P0-B-real 的 B4=1.0 不能解释为优于 always-EXACT，因为 B3 同样为 1.0；
- P0-C-exec 的 C4=1.0 不能解释为 stage-aware router 优于 C3，因为两臂实际调用同一策略；
- `unsafe_commit=0` 不能解释为生产事故率上界，因为实验没有开放真实生产 commit。

### 2.2 不同实验不得合并分母

| 证据组 | 独立单位 | 主要用途 | 不得怎样使用 |
|---|---:|---|---|
| RR1–RR7 | 8–12 个 planted/stub cases；RR7 为 8 个 holdout scenarios | 仪器、边界与 policy skeleton | 不作为真实 LLM 或生产成功率 |
| P0-A-ood | 36 holdout cases；每例 3 reps | live chooser + typed abstain | 108 reps 不能当 108 个独立任务 |
| P0-B-real | 24 holdout cases；底层仅 2 个 workspace 模板 | 真实写入+pytest harness | 不外推自然仓库分布 |
| P0-C-exec | 30 holdout incidents | 可执行恢复 wiring | 不外推自然日志或 LLM diagnosis |
| CSP-1 | 36 holdout tasks；每臂 3 reps | Candidate Sort→Pick | ceiling 下不声称可靠性提升 |
| CSP-2 | 72 holdout cases | 首轮 adaptive gate；暴露 instrument defect | 不用其失败估计干净 gate 机制 |
| CSP-2R | 36 holdout base cases；72 paired risk views | 修复 instrument 后的决定性复验 | risk views 和 reps 不扩大独立 n |

各 Stage 的 endpoint、证据等级和分母不同，因此不能把 mode agreement、stub accuracy、
真实 e2e 和 selective risk 放在同一纵轴形成虚假的“成功率排名”。

## 3. 从 Name Lookup 到真实 Skill Chooser

### 3.1 Lookup 只解决“名字存在吗”，不解决“应该选谁”

RR1 先验证基础仪器：8/8 oracle name lookup 成功；空 registry、错误名和 near-miss typo
的 refuse rate 都为 1.0，wrong accept=0。这个结论只说明**未注册名会被拒绝**。

RR2 随后把错误 Skill 也注册进 registry：固定选择错误但存在的 confusable Skill 时，
wrong accept=1.0；random accuracy=0.5，关键词/LCP heuristic≈0.833。于是风险边界变成：

> Registry lookup 可以阻止不存在的名字，却不会阻止“存在但语义错误”的 Skill 被执行。

RR3 的 stub rule table 在同一 12-case confusion pack 上 accuracy=0.917，相对 random
提升 0.417，但相对 oracle 仍差 0.083；其 `Stub-LLM` 与规则表相同，只验证 wiring，
不能作为真实 LLM 证据。

### 3.2 Typed abstain 是最强的 live Skill 结论

P0-A-ood 移除了 `UNAVAILABLE`、`gold_skill` 等直接答案标签，在相同四域和 registry、
不同短语库的 holdout 上得到：

| 臂 | e2e | wrong | abstain / coverage | 解释 |
|---|---:|---:|---:|---|
| A1 random | 0.222 | — | — | 下界 |
| A2 heuristic | 0.250 | — | — | 弱规则不足 |
| A3 强制选择 | 0.630 | 0.370 | 不允许 abstain | 缺失 Skill 时被迫误执行 |
| A4 live chooser + abstain | 0.981 | 0.019 | abstain=0.324；legal coverage=1.000 | 当前最强 live 结果 |

A4−A1 的 case-level 配对均值为 0.759，95% CI [0.611, 0.880]；clear/confusable/absent
分别为 1.000/0.972/0.972，infra skip=0。

**允许解释：** 在同 registry、短语换写 lexical-OOD fixture 上，DeepSeek V4 Flash
能够遵守受约束的 `skill | abstain` 协议；正确 Skill 可能缺失时，typed abstain 显著
降低 wrong execution。

**不允许解释：** 自然 OOD、跨 registry/domain、真实 Skill executor、跨模型或生产
默认已验证。当前 executor 只写 marker，absent 任务也比真实相邻能力缺口更容易拒绝。

## 4. Candidate Sort→Pick 的价值主要是成本，不是新的可靠性跃迁

CSP-1 把单次 Skill 判断扩展为候选生成、排序、Top-K、live picker 和 abstain，但仍然是
“从候选中选一个”的单路由：

| 臂 | e2e | wrong | tokens≈ | 冻结解释 |
|---|---:|---:|---:|---|
| S0 full-shuffle pick | 1.000 | 0.000 | 632 | 强 picker baseline 已 ceiling |
| S1 sorted-all pick | 0.991 | 0.009 | 632 | ordering effect unsupported |
| S2 Top-5→pick | 1.000 | 0.000 | 144 | 与 S0 非劣，tokens↓77% |
| S3 oracle Top-K→pick | 1.000 | 0.000 | 124 | retrieval ceiling |
| S4 ranker Top-1 | 0.583 | 0.417 | 0 | 无 picker 时错误明显 |

由此支持：

- Recall@5=1.0 时，Top-K 可以在不降低 e2e 的情况下减少约 77% picker tokens；
- picker+abstain 相对 raw ranker Top-1 有明确价值；
- 先排序再把全部候选交给 picker 没有识别出顺序收益。

它没有证明 Top-K 比完整候选更可靠，因为 S0/S2 同时 ceiling；也没有证明该 K、ranker
或 token 比例能跨模型和 registry 迁移。

## 5. Top-1 与 Rank-Pick 的边界是结构证书，不是分数阈值

### 5.1 CSP-2 首轮失败首先暴露了 instrument 问题

CSP-2 的 Recall@5 legal=0.684、hard-filter false exclusion=0.458。Adaptive G4 相对
safe rank-pick G1 e2e 下降 0.023，wrong 增加 0.074；selective Top-1 coverage=0.167，
wrong=0.5。因此 A1–A4 全部 unsupported。

这轮结果足以拒绝当时的 gate，却不能回答一个干净的“Top-1 是否永远不可用”，因为
candidate filter 已经把正确候选排除。

### 5.2 CSP-2R 修复 instrument 后，只保留了 certified-unique 边界

CSP-2R 将 legal gold retention、conditional Recall@5 和 end-to-end candidate recall
全部修复为 1.000，false exclusion=0。正式 holdout 结果为：

| 臂 | e2e | wrong | picker-call | 结论 |
|---|---:|---:|---:|---|
| E0 raw Top-1 | 0.667 | 0.333 | 0.000 | 无 certificate，不可默认 |
| E1 safe rank-pick | 0.806 | 0.167 | 0.833 | 保守参考，但仍会错 |
| E2 certified unique | 0.806 | 0.167 | 0.667 | single-eligible 上 picker↓100% |
| E3 score gate | 0.806 | 0.167 | 0.500 | 描述性信号；R2 未过门 |
| E4 risk-aware gate | 0.806 | 0.167 | 0.667 | picker↓20%；R4 门为 25% |
| E5 route oracle | 0.833 | 0.139 | 0.167 | 配置内上界 |
| E6 retrieval oracle | 0.806 | 0.167 | 0.833 | 与 E1 完全相同 |

确认性支持的是：

```text
complete registry receipt
+ validated filter receipt
+ eligible_candidate_count == 1
→ direct / Top-1
```

不支持的是：

- 用 BM25 score/margin 作为生产 fast-path 证书；
- risk context 本身能产生可测的增量安全；
- E4 达到预注册 reliability/cost Pareto；
- typed abstain 在 soft absence 上已稳定复现；
- Top-1 或 Rank-Pick 是普适默认。

R2 的 12 个放行 base cases 确实没有观察到 wrong，但 coverage=0.333、单侧风险上界约
0.221，未达到预注册的 coverage≥0.40、upper≤0.20。R4 也不是可靠性退化：E4 与 E1
的 e2e/wrong 配对差均为 0，只是 picker 调用下降 20%，低于 25% 最小效应门。

### 5.3 当前主要残余错误发生在 Picker，而不是 Retrieval

E6 retrieval oracle 与 E1 完全相同，说明当前 fixture 的残余误差不能由继续提高候选召回
解释。分层结果是：

| 条件（E1/E6 policy views） | e2e | wrong | 诊断 |
|---|---:|---:|---|
| lexical trap legal | 0/12 | 10/12 | gold 已存在，但 picker 被表面相似性误导 |
| soft absent | 10/12 | 2/12 | 没有合法候选时拒绝不稳定 |
| hard absent / separated / single / tied | 12/12 | 0/12 | 本 fixture 中已可靠处理 |

所以“Rank-Pick”不能被简化成“多花一次 LLM 调用就安全”。它仍需要候选存在性判断、
contract verifier、confirm 或 execution guard。

## 6. Action Router 只在路径真正不等价时有价值

RR4 的 8 个 oracle workspace case 表明：单次 `invoke_skill`、单次 `invoke_tool` 和混合
规则全部 success=1.0；冗余 route+compile+两次 invoke 也为 1.0，却把平均动作数从 1
增加到 4。

P1-D 的 planted 48-case 对照进一步引入权限、信息和 side-effect 路径不等价：条件规则
D3 e2e=1.000，固定臂 D1=0.250；在等价层仍保持 success≈1.0、动作数≤1。

因此当前边界是：

```text
path_equivalence_known == true       → direct simplest path；router DISABLE
permission/information/effect differs → restricted conditional route
```

P1-D 仍是 planted stub 且没有 live LLM action chooser，不能推出“默认全开 Action
Router”。它支持的是**路径不等价性应成为启用条件**。

## 7. Delivery Router 已证明“模式会影响结果”，尚未证明新的默认策略

RR5 的小型 planted pack 中 SparseStub mode agreement=1.0，Default=0.5；P0-B-real
进一步在隔离 workspace 真实写文件并运行 pytest：

| 策略 | sparse | dense | 审计后解释 |
|---|---:|---:|---|
| Default INTENT | 0 | 0 | payload 被预设为错误/不完整，不能估计生产 Default 能力 |
| always PATCH | 1.0 | 0 | 当前 dense payload 覆盖不足 |
| always EXACT | 1.0 | 1.0 | 与 sparsity-aware 同顶 |
| sparsity-aware | 1.0 | 1.0 | fixture 内成功，但没有击败 always-EXACT |

实验支持：DeliveryMode 的选择会造成真实可观察差异；局部 PATCH payload 在单文件任务可
成功，在预设多文件任务会因覆盖不足失败；真实落盘评价链已经打通。

实验不支持：把 sparsity/density 写入 `DefaultDeliveryRouter`、sparsity-aware 优于
always-EXACT、或当前 PATCH 是真实 hunk editor。底层只有两个 workspace 模板，且
changed-lines、rollback、retry、token 与 unintended surface 不足以裁决 Pareto。

## 8. Failure Router 必须区分“选对动作”与“动作真的能恢复”

RR6 的 stub 结果为：plan error 上 stage-aware replan 相对 generic retry 从 0 提高到 1.0；
delivery error 上 re-emit 和 stage-aware 均为 0。这支持 plan-error 受界 replan，明确拒绝
把 generic retry 当修复。

P0-C-exec 将 recovery operator 推进到真实文件写入+pytest：20/20 planted positive
被预映射算子恢复，10/10 negative 正确 stop。但后验审计确认：

- C3 与 C4 实际调用同一个 `policy_from_error_text`，没有识别独立 router 增益；
- error text 和 workspace 结构高度重复；
- negative 含显式 fatal marker；
- operator 从 `EXPECTED` 文件读取目标内容；
- 没有真实 LLM diagnosis、噪声日志、组合故障或多步恢复。

因此当前策略应是：

```text
plan_error                    → bounded replan + re-verify
known mapped delivery subtype → isolated deterministic TRIAGE + verifier
unknown/noisy delivery error  → stop / escalate
blind retry or blind re-emit  → DISABLE
```

## 9. RR7 是 Policy Skeleton，不是生产收益证明

RR7 只用 runtime-visible features，在 8 个 holdout scenarios 上得到
NB(B0 all-disable)=0、B1=0.570、B2 budgeted=0.463、B3 random≈0.224，并强制
delivery-error recovery DISABLE。它证明冻结边界可以编码为 ENABLE/TRIAGE/DISABLE
决策骨架。

但 RR7 的效用来自 planted scenario 和手工定义的 λ=0.1，不包含完整 token、latency、
rollback、changed surface 或自然流量错误矩阵。它不能解释为“该 policy 在生产带来
0.570 收益”，P1-E 因此继续暂缓。

## 10. 当前可执行的单路由默认

### 10.1 决策表

| 路由层 | 条件 | 当前动作 | 证据等级 |
|---|---|---|---|
| Skill | registry≤1 或调用方已持有认证 Skill ID | 不启用 chooser；按名 direct | RR1 instrument + RR7 skeleton |
| Skill | 多个合法候选、正确候选可能缺失 | Top-K→picker，接口支持 typed abstain | CSP-1 efficiency；P0-A-ood live canary |
| Skill | complete registry + validated filter + 唯一合法候选 | 跳过 picker，direct | CSP-2R R1 supported |
| Skill | 仅 score/margin 高 | 不作为 direct 证书 | CSP-2R R2 unsupported + stop rule |
| Skill | lexical trap / soft absence / high risk | picker 后加 verifier/confirm；可 safe stop | CSP-2R residual failures |
| Action | 路径等价 | 走最短直接路径；关闭冗余 route | RR4 supported |
| Action | 权限、信息或 side effect 不等价 | 受约束条件规则；暂不默认 live LLM | P1-D fixture-supported |
| Delivery | 当前生产路径 | 保持 `DefaultDeliveryRouter` | P0-B-real 未建立替代策略 Pareto |
| Failure | plan error | bounded replan + re-verify | RR6 supported in stub |
| Failure | 已映射 delivery subtype | 隔离 TRIAGE；执行后 verifier | P0-C-exec fixture-supported |
| Failure | 未知 delivery error | stop/escalate；不 blind re-emit | RR6 + P0-C audit |

### 10.2 参考伪代码

```text
route_skill(task, registry, receipts, risk):
    if receipts.complete_registry
       and receipts.validated_filter
       and eligible_count == 1:
        return DIRECT(unique_candidate)

    if eligible_count == 0 and hard_absence_is_certified:
        return ABSTAIN

    candidates = retrieve_top_k(task)
    if candidate_recall_not_validated:
        return TRIAGE("instrument/retrieval uncertain")

    choice = picker(candidates, allow_none=true)
    if choice.none or risk.high or verifier.weak:
        return CONFIRM_OR_SAFE_STOP(choice)
    return EXECUTE_WITH_GUARD(choice)

route_action(context):
    if path_equivalence_is_certified:
        return SHORTEST_DIRECT_PATH
    return RESTRICTED_RULE_ROUTE

route_failure(failure):
    if failure.layer == PLAN_ERROR:
        return BOUNDED_REPLAN
    if failure.subtype in VALIDATED_ISOLATED_OPS:
        return TRIAGE_WITH_POST_VERIFY
    return STOP_AND_ESCALATE
```

这个伪代码是证据综合，不是已提交的生产实现；尤其 `receipts`、candidate recall verifier、
execution guard 和自然任务错误矩阵仍需产品化。

## 11. 已支持、部分支持与明确未升格

### 11.1 已支持

- 未注册 Skill 名会被拒识；错误但已注册的 confusable Skill 可能被执行；
- live typed abstain 在当前 lexical-OOD fixture 中显著降低 wrong execution；
- Recall@5 已验证时，Top-K 可以显著降低 picker token 而不降低当前 e2e；
- raw ranker Top-1 不能取代 picker/abstain；
- 外部认证唯一合法候选可以跳过 picker；
- 路径等价时冗余 Action route 无益；
- 路径不等价时条件规则可在 planted fixture 内产生价值；
- Delivery/Recovery 的真实落盘+pytest 评价链已经打通；
- plan-error 与 delivery-error 必须使用不同恢复边界。

### 11.2 部分支持或仅限 Fixture

- typed abstain 可进入 shadow/canary，但不能默认全开；
- Top-K→picker 是成本优化，不是本轮已确认的可靠性跃迁；
- score gate 有 12/36、0 wrong 的描述性信号，但未过确认门；
- risk-aware gate 有 20% picker reduction，但未达到 25% 最小效应；
- DeliveryMode 受任务结构影响，但 sparsity-aware 还没有击败强固定 EXACT；
- 五类 delivery recovery operator 可执行，但只适合隔离 TRIAGE。

### 11.3 明确禁止声称

- LLM Skill Router 已可生产默认开启；
- Top-1 或 Rank-Pick 是普适最佳策略；
- raw BM25 score/margin 足以证明 Top-1 安全；
- typed abstain 在真实相邻能力缺口或 soft absence 上普遍可靠；
- risk context 在所有高风险任务中无用；
- density 应写入 `DefaultDeliveryRouter`；
- PATCH 或 sparsity-aware 已在真实仓库普遍优于 EXACT；
- C4 stage-aware recovery 优于 C3，或 delivery error 已普遍可修；
- `unsafe_commit=0` 是生产事故率上界；
- 单模型、单 fixture 结论可以跨 registry、domain、模型和工具直接迁移；
- 单路由实验已经验证 Task decomposition、Workflow、SGAR 或复杂编排。

## 12. 局限、稳健性与尚未回答的问题

### 12.1 主要局限

- Live 证据只有 DeepSeek V4 Flash；没有跨模型确认。
- P0-A-ood 是短语换写，不是新 registry、domain 或真实 Skill 语义。
- P0-A 的 Skill executor 是 marker，不是真实工具链。
- P0-B-real 只有两个底层 workspace 模板，payload 质量由 fixture 预设。
- P0-C-exec 带显式 failure clues 和 `EXPECTED` oracle 内容。
- CSP-1/CSP-2R 是种植 candidate fixture；当前 picker 的 lexical trap 失败可能依赖 prompt、
  registry 和模型配置。
- 多处成本不完整；无法做统一生产净收益或预算 calibration。
- 多数 `unsafe=0` 来自隔离路径与未开放生产 commit，不是足够大的风险样本。

### 12.2 最有价值的后续单路由研究

1. **Picker robustness：** 固定正确候选已在集合内，专门研究 lexical trap、pairwise
   contrast、claim-evidence 与 verifier-assisted selection。
2. **Candidate existence：** 把“有没有合法候选”和“选哪个”拆开，重点处理 soft
   absence 与相邻能力缺口。
3. **真实 Skill executor：** 新 registry、新 domain、真实工具副作用和错误矩阵下复现
   typed abstain。
4. **公平 Delivery 比较：** 由同一 planner/editor 生成 PATCH/EXACT/INTENT payload，
   使用真实历史 diff，补齐 rollback、unintended surface、token 和 latency。
5. **真实 Failure diagnosis：** 移除 fatal marker/`EXPECTED`，使用噪声日志、组合故障和
   真 plan artifact，令 deterministic mapping、LLM diagnosis 与 stage-aware route 真正不同。
6. **独立模型复现：** 只复现经过上述真实性升级后仍保留的效应。

Workflow 与复杂编排不属于这份后续列表；它们应有独立 task population、workflow verifier
和 endpoint，不能并入当前单路由分母。

## 13. 冻结证据索引

| 证据 | Freeze / commit | 主要结论入口 |
|---|---|---|
| RR1 | `8d591e264` | [name-router baseline](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR1_protocol_baseline.md) |
| RR2 | `ed41d1925` | [registered confusion](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR2_skill_confusion.md) |
| RR3 | `4b7371b91` | [stub chooser](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR3_skill_chooser.md) |
| RR4 | `9458045d3` | [action equivalence](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR4_action_sequence.md) |
| RR5 | `ce4c6be58` | [delivery mode stub](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR5_delivery_mode.md) |
| RR6 | `917af9fbf` | [failure layer](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR6_failure_layer.md) |
| RR7 | `721efc573` | [enable policy skeleton](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR7_enable_policy.md) |
| P0-A-live | `8a7659f6c` | [live Skill routing](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_P0A_live_llm.md) |
| Decisive P0-A/B/C | `77aac4660` | [evidence audit](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/RRV2_DECISIVE_EVIDENCE_AUDIT.md) |
| CSP-1 | `828a86d73` | [Candidate Sort→Pick](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_CSP1_candidate_sort_pick.md) |
| CSP-2 | `2f409ead3` | [Adaptive Gate](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_CSP2_candidate_adaptive_gate.md) |
| CSP-2R | `499d9f645`；record `2a99430a1` | [Instrument Repair](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_CSP2R_instrument_repair.md) · [结果分析](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/RRV2_CSP2R_RESULT_ANALYSIS.md) |

本文是决策版综合；它不把 stub pilot 升格为生产默认，也不把单路由证据并入 Workflow、
SGAR、S/CF/G/AA 或聚合失配 V6 的 claim。
