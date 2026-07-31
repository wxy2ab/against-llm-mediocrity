# 单路由决策：RR1–RR7 与 RR-v2 决定性冻结证据综合

日期：2026-08-01

状态：`evidence synthesis`（不改写任何冻结 Stage、分母或 Freeze SHA）

范围：Task 到单个 Skill、Action path、DeliveryMode、Recovery action，以及单个候选的
Top-1 / Rank-Pick / Abstain 判断

**English:** [Single-Route Decisions: Frozen Evidence from RR1–RR7 and RR-v2 Decisive Rounds](./single-route-decision-frozen-evidence-synthesis.md)

**权威来源：** 本文同步自 `llm_dealer` 的冻结 Routing Reliability 证据线；所有原始
数字、分母与 claim 状态仍以[上游决策版综合](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/SINGLE_ROUTE_DECISION_SYNTHESIS.md)、对应 Stage 和机器结果为准。

## 技术总结

RR-v2 decisive round-2 仍没有找到一个可以全局默认开启的“智能 Router”。它把原有
条件化边界推进到独立 Skill 生态、同任务 Delivery crossover 和盲态 Failure diagnosis：

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
4. **Typed abstain 已从 lexical-OOD marker fixture 推进到独立 Skill 生态与真实
   executor，但仍只到 canary。** A-EXT 在 32 个 holdout task families（64 个配对
   registry views、4 个整域）上，将 forced LLM 的 wrong=0.500 降到 A1
   LLM+abstain 的 0.219，present false-abstain=0，eventual completion 从 0.500 提到
   0.781；效应覆盖 4/4 domains。非 LLM similarity+abstain A2 的 wrong=0.062，说明
   最硬结论是“候选缺失必须成为一等状态”，不是“必须使用 LLM”。
5. **Top-5 shortlist 的确认性价值仍主要是成本。** A-EXT A3 保持 complete-view
   recall=1.000，wrong=0.203，与 A1 接近，而每 family token 从约 485 降到 319；这与
   CSP-1 的 shortlist 成本结论同向，不构成普适 picker 可靠性证明。
6. **路径等价时不要路由；路径不等价时才值得条件化选择。** RR4 中冗余
   route+compile+重复 invoke 把平均动作数从 1 增到 4，成功率仍为 1.0；P1-D 的种植
   非等价层则为条件规则 D3=1.000、固定臂最低 D1=0.250。
7. **Delivery 出现了真实的 hint-based crossover，但仍不能自动改生产默认。**
   B-XOVER 在 24 个 holdout tasks、3 个结构独立 repo families 的同任务交叉中，
   always-PATCH 与 always-EXACT 都为 0.625，读取 runtime `edit_scope_hint` 的 B2
   adaptive 为 1.000；policy×density interaction=1.500，95% CI [1.167, 1.833]。
   这支持受信 hint 下的条件 PATCH/EXACT 路由，不证明模型能从自然语言推断 density。
8. **盲态 LLM recovery 没有超过机械签名；默认应保留机械分类与 stop。** C-BLIND
   在 60 个独立 incidents（40 recoverable、20 unrecovered）上得到 C3 mechanical
   recovered=0.750、C4 live LLM=0.275，差值 −0.475，95% CI [−0.625, −0.325]；C4
   correct-stop=0.950。但 C4 同时出现 47/60 infra timeouts，因此该结果足以否决当前
   配置默认启用 LLM recovery，不足以归因为模型诊断能力的普遍下界。

因此，当前最稳健的单路由策略不是“永远 Top-1”或“永远 Rank-Pick”，而是：

```text
外部认证唯一合法候选                         → direct / Top-1
多个合法候选                                 → Top-K + picker + explicit abstain
候选存在性不确定、soft absence、lexical trap → verifier / confirm / safe stop
仅有 raw score 或 margin                     → 不作为 production fast-path 证书
已知动作路径等价                             → 关闭冗余 router
动作路径确实不等价                           → 使用受约束条件规则
可信 edit_scope_hint=sparse/dense             → 实验性 PATCH/EXACT 条件路由
缺少可信 delivery hint                        → 保持 DefaultDeliveryRouter
plan error                                   → bounded replan
已知机械 failure signature                    → isolated TRIAGE + verifier
blind LLM failure diagnosis                   → 默认关闭；仅受控实验
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
3. 后验[Decisive 证据审计](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/RRV2_DECISIVE_EVIDENCE_AUDIT.md)
   对 round-1 外推范围的修订；
4. [Decisive round-2 Roadmap](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/RRV2_DECISIVE_ROADMAP.md)；
5. 其他 Roadmap 与总览性文字。

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
| A-EXT | 32 holdout families；64 paired registry views；4 holdout domains | independent Skill ecosystem + real tempfile executor | 不把 64 views 当 64 个独立 family；不声称 LLM 胜过 A2 |
| B-XOVER | 48 frozen tasks；正式 holdout 24 tasks / 3 repo families；每 task 三臂 crossover | fair PATCH/EXACT + hint-based adaptive | 不把 3 arms 当独立任务；不外推设计中的 drift 比例 |
| C-BLIND | 60 incident families；40 recoverable + 20 unrecovered | blind diagnosis + executable recovery | 47/60 C4 infra timeout 必须与模型错误分开 |

由于各 Stage 的 endpoint、证据等级和分母不同，本文使用表格而不绘制统一“成功率排名图”；
把 mode agreement、stub accuracy、真实 e2e 和 selective risk 画在同一纵轴会制造虚假可比性。

## 3. 从 Name Lookup 到真实 Skill Chooser

### 3.1 Lookup 只解决“名字存在吗”，不解决“应该选谁”

RR1 先验证了基础仪器：8/8 oracle name lookup 成功；空 registry、错误名和 near-miss
typo 的 refuse rate 都为 1.0，wrong accept=0。这个结论只说明**未注册名会被拒绝**。

RR2 随后把错误 Skill 也注册进 registry：固定选择错误但存在的 confusable Skill 时，
wrong accept=1.0；random accuracy=0.5，关键词/LCP heuristic≈0.833。于是风险边界变成：

> Registry lookup 可以阻止不存在的名字，却不会阻止“存在但语义错误”的 Skill 被执行。

RR3 的 stub rule table 在同一 12-case confusion pack 上 accuracy=0.917，相对 random
提升 0.417，但相对 oracle 仍差 0.083；其 `Stub-LLM` 与规则表相同，只验证 wiring，
不能作为真实 LLM 证据。

### 3.2 P0-A-ood 首先建立了 lexical-OOD typed abstain 证据

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
默认已验证。该轮 executor 只写 marker，absent 任务也比真实相邻能力缺口更容易拒绝。

### 3.3 A-EXT 把正结果推进到独立生态与真实 executor，但没有证明 LLM 最优

A-EXT 不复用 P0/CSP 的 domain 或 Skill 名，按整域切分 dev/holdout，并把 complete 与
ablated registry view 配对到同一个 task family。正式 holdout 为 4 domains、32 families、
64 views；每个 Skill 在 tempfile 中产生真实读写效果并由 verifier 检查。

| 臂 | 策略 | wrong | eventual completion | tokens / family≈ |
|---|---|---:|---:|---:|
| A0 | forced LLM choice | 0.500 | 0.500 | 495 |
| A1 | LLM + typed abstain | 0.219 | 0.781 | 485 |
| A2 | similarity threshold + abstain | 0.062 | 0.938 | 0 |
| A3 | Top-5 BM25 → LLM pick/abstain | 0.203 | 0.797 | 319 |
| A4 | oracle | 0.000 | 1.000 | 0 |

A0−A1 wrong 的 family-level 配对均值为 0.281，95% CI [0.188, 0.359]；A1−A0
eventual completion 也是 0.281，95% CI [0.203, 0.359]。A1 在 present 侧
false-abstain=0，且 wrong reduction 覆盖 4/4 holdout domains。A3 的 complete-view
Top-5 gold recall=1.000，token 低于 A1。

**升级后的允许解释：** 在全新受控 Skill 生态、相邻能力缺口和真实 tempfile executor
中，显式 `abstain → clarification/fallback` 显著优于强制 LLM 选择；Top-5 shortlist
保留 recall 并降低 picker 成本。

**仍不允许解释：** LLM 是最佳 router、A1 优于非 LLM A2、自然多组织 registry、跨模型
或生产默认已验证。A2 在本 fixture 上优于 A1，present 任务又能被 token overlap 完全
分开，因此证据支持的是接口和候选存在性建模，而不是 LLM 必要性。

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

A-EXT 在独立生态中给出同向复核：A3 complete-view Top-5 recall=1.000，wrong=0.203
与 A1 的 0.219 接近，而 tokens/family 从约 485 降至 319。由于它没有预注册 A3 相对
A1 的端到端可靠性优越门，合法升级仍是**shortlist efficiency**，不是“排序本身提高
正确率”。

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
path_equivalence_known == true  → direct simplest path；router DISABLE
permission/information/effect differs → restricted conditional route
```

P1-D 仍是 planted stub 且没有 live LLM action chooser，不能推出“默认全开 Action
Router”。它支持的是**路径不等价性应成为启用条件**。

## 7. Delivery Router 已识别 hint-based crossover，但尚未验证自然 density routing

RR5 的小型 planted pack 中 SparseStub mode agreement=1.0，Default=0.5；P0-B-real
进一步在隔离 workspace 真实写文件并运行 pytest：

| 策略 | sparse | dense | 审计后解释 |
|---|---:|---:|---|
| Default INTENT | 0 | 0 | payload 被预设为错误/不完整，不能估计生产 Default 能力 |
| always PATCH | 1.0 | 0 | 当前 dense payload 覆盖不足 |
| always EXACT | 1.0 | 1.0 | 与 sparsity-aware 同顶 |
| sparsity-aware | 1.0 | 1.0 | fixture 内成功，但没有击败 always-EXACT |

这一 round-1 结果只打通了执行链，没有识别独立 policy 效应。B-XOVER 随后使用 6 个
结构独立 repo families、同一冻结目标态派生的公平 unified diff / full-file payload，
并从相同初始 snapshot 对三臂做同任务 crossover。正式 holdout 为 24 tasks、3 families：

| 策略 | overall | sparse | dense | 主要失败模式 |
|---|---:|---:|---:|---|
| B0 always-PATCH | 0.625 | 1.000 | 0.250 | dense reflow 下 patch context 失配 |
| B1 always-EXACT | 0.625 | 0.250 | 1.000 | sparse local modification 被整文件覆盖 |
| B2 adaptive | 1.000 | 1.000 | 1.000 | 无观察失败 |

policy×density interaction=1.500，95% CI [1.167, 1.833]；B2−B1 在 sparse 上为
0.750，95% CI [0.500, 1.000]，dense 上为 0。三臂 `unsafe=0`，B2 不产生 rollback、
patch-apply failure 或 regression failure。

**允许解释：** 当 runtime 已提供可信、离散的 `edit_scope_hint=sparse|dense`，在该
multi-family tempfile harness 上用 PATCH 处理 sparse、EXACT 处理 dense，击败两个固定
策略并消除其互补失败模式。

**不允许解释：** 模型能从自然语言学习 density、设计中的 3/4 drift 比例代表生产流量、
严格 zero-fuzz applier 的边界能迁移到 3-way/fuzzy patch，或应直接修改
`DefaultDeliveryRouter`。B-XOVER 无 LLM 调用，识别的是**显式 hint 的决策价值**，不是
自然任务上的 hint acquisition 能力。

## 8. Failure Router 的新增结论是“机械签名优先”，不是“LLM 不会诊断”

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

C-BLIND 移除了 `EXPECTED`、fatal marker、gold subtype/action，并让 C3 机械签名与 C4
live LLM 真正成为不同策略。60 个 incident families 包含 40 个 recoverable 和 20 个
unrecovered，operator 不读取 evaluator answer key，恢复由真实 pytest 判定：

| 臂 | diagnosis | recovered（40） | correct stop（20） | secondary damage | infra |
|---|---:|---:|---:|---:|---:|
| C1 generic retry | 0.083 | 0.000 | 0.000 | 0.000 | 0 |
| C2 oracle | 1.000 | 1.000 | 1.000 | 0.000 | 0 |
| C3 mechanical signature | 0.750 | 0.750 | 1.000 | 0.033 | 0 |
| C4 blind live LLM | 0.283 | 0.275 | 0.950 | 0.000 | 47/60 |

C4−C3 recovered=−0.475，95% CI [−0.625, −0.325]；在 non-mechanical evidence
子集上仍为 −0.400，95% CI [−0.600, −0.200]。C4 超过 generic retry 且 correct-stop
通过 0.90 门，但未通过相对 C3 的 primary，infra gate G6 也失败。

因此当前策略应是：

```text
plan_error                         → bounded replan + re-verify
known mechanical delivery signature → isolated deterministic TRIAGE + verifier
blind LLM diagnosis                 → DISABLE by default；可在独立、受控环境复验
unknown/noisy delivery error       → stop / escalate
blind retry or blind re-emit       → DISABLE
```

这足以说明当前系统不应为 fixture 中已被机械签名覆盖的错误增加默认 LLM router；但
47/60 infra timeout 使 C4 数值混合了模型输出与服务可用性。不得把它推广成“LLM 的纯
诊断能力上限”或跨模型负结论。若业务决策只问默认策略，结果已经足够；若要研究模型能力，
则需在匹配可用性/预算后单独复验。

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
| Skill | 多个合法候选、正确候选可能缺失 | Top-K→picker，接口支持 typed abstain + fallback | A-EXT live real-executor canary；CSP-1 efficiency |
| Skill | complete registry + validated filter + 唯一合法候选 | 跳过 picker，direct | CSP-2R R1 supported |
| Skill | 仅 score/margin 高 | 不作为 direct 证书 | CSP-2R R2 unsupported + stop rule |
| Skill | lexical trap / soft absence / high risk | picker 后加 verifier/confirm；可 safe stop | CSP-2R residual failures |
| Action | 路径等价 | 走最短直接路径；关闭冗余 route | RR4 supported |
| Action | 权限、信息或 side effect 不等价 | 受约束条件规则；暂不默认 live LLM | P1-D fixture-supported |
| Delivery | 可信 `edit_scope_hint` 明确 sparse/dense | PATCH/EXACT 条件路由仅做隔离 canary | B-XOVER adaptive_wins；hint-based |
| Delivery | hint 未验证、需从自然语言推断或生产流量未校准 | 保持 `DefaultDeliveryRouter` | B-XOVER acquisition/transfer untested |
| Failure | plan error | bounded replan + re-verify | RR6 supported in stub |
| Failure | 已验证机械 signature | 隔离 TRIAGE；执行后 verifier | C-BLIND C3=0.750；fixture-supported |
| Failure | blind LLM diagnosis | 默认关闭；仅受控复验 | C-BLIND C4<C3；infra gate failed |
| Failure | 未知 delivery error | stop/escalate；不 blind re-emit | RR6 + C-BLIND |

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

route_delivery(plan, runtime):
    if runtime.edit_scope_hint_is_validated:
        return PATCH if runtime.edit_scope_hint == "sparse" else EXACT
    return DEFAULT_DELIVERY_ROUTER

route_failure(failure):
    if failure.layer == PLAN_ERROR:
        return BOUNDED_REPLAN
    if failure.mechanical_signature in VALIDATED_ISOLATED_OPS:
        return TRIAGE_WITH_POST_VERIFY
    return STOP_AND_ESCALATE
```

这个伪代码是证据综合，不是已提交的生产实现；尤其 `receipts`、candidate recall verifier、
`edit_scope_hint` 的来源/校验、execution guard 和自然任务错误矩阵仍需产品化。

## 11. 已支持、部分支持与明确未升格

### 11.1 已支持

- 未注册 Skill 名会被拒识；错误但已注册的 confusable Skill 可能被执行；
- live typed abstain 在 lexical-OOD 及 A-EXT 独立受控生态中均显著降低 forced-choice
  wrong execution；A-EXT 使用真实 tempfile executor；
- Recall@5 已验证时，Top-K 在 CSP-1 和 A-EXT 中均降低 picker token，且未触发当前
  预注册可靠性退化门；
- raw ranker Top-1 不能取代 picker/abstain；
- 外部认证唯一合法候选可以跳过 picker；
- 路径等价时冗余 Action route 无益；
- 路径不等价时条件规则可在 planted fixture 内产生价值；
- fair PATCH/EXACT 在 B-XOVER 中表现出由显式 edit-scope hint 调节的交叉效应；
- C-BLIND 的机械签名 C3 在当前盲态 fixture 中显著优于 live LLM C4；
- plan-error 与 delivery-error 必须使用不同恢复边界。

### 11.2 部分支持或仅限 Fixture

- typed abstain 可进入 shadow/canary，但不能默认全开；
- Top-K→picker 是成本优化，不是本轮已确认的可靠性跃迁；
- score gate 有 12/36、0 wrong 的描述性信号，但未过确认门；
- risk-aware gate 有 20% picker reduction，但未达到 25% 最小效应；
- B-XOVER adaptive 在受控 crossover 中击败固定 PATCH/EXACT，但只读取显式
  `edit_scope_hint`，尚未验证 hint 获取、生产分布或 Default replacement；
- C4 超过 generic retry 且 correct-stop=0.950，但未超过 C3，且 47/60 infra timeout；
- 五类 delivery recovery operator 可执行，机械签名只适合隔离 TRIAGE。

### 11.3 明确禁止声称

- LLM Skill Router 已可生产默认开启；
- Top-1 或 Rank-Pick 是普适最佳策略；
- raw BM25 score/margin 足以证明 Top-1 安全；
- typed abstain 在自然多组织 registry、所有相邻能力缺口或 soft absence 上普遍可靠；
- A-EXT 证明 LLM router 优于非 LLM similarity baseline；
- risk context 在所有高风险任务中无用；
- density 应写入 `DefaultDeliveryRouter`；
- 模型能从自然语言稳定推断 `edit_scope_hint`，或 B-XOVER 的 drift 比例代表生产分布；
- PATCH、EXACT 或 adaptive 任一策略已在真实仓库普遍最优；
- C4 blind LLM recovery 优于 C3，或 delivery error 已普遍可修；
- C-BLIND 证明 LLM 诊断能力普遍不足；
- `unsafe_commit=0` 是生产事故率上界；
- 单模型、单 fixture 结论可以跨 registry、domain、模型和工具直接迁移；
- 单路由实验已经验证 Task decomposition、Workflow、SGAR 或复杂编排。

## 12. 局限、稳健性与尚未回答的问题

### 12.1 主要局限

- Live 证据只有 DeepSeek V4 Flash；没有跨模型确认。
- A-EXT 虽更换 domain/Skill 并使用真实 tempfile executor，仍是合成生态；present 侧可由
  token overlap 完全分开，且非 LLM A2 优于 A1。
- B-XOVER 正效应来自冻结的 `edit_scope_hint`、设计内 3/4 drift 比例和 zero-fuzz patch
  applier；无 LLM 调用，也没有测 hint acquisition。
- C-BLIND 虽移除了 oracle-like clues，C4 仍有 47/60 infra timeout；其差值是当前
  模型+服务+60s预算的 operational result，不是纯模型能力估计。
- CSP-1/CSP-2R 是种植 candidate fixture；当前 picker 的 lexical trap 失败可能依赖 prompt、
  registry 和模型配置。
- 多处成本不完整；无法做统一生产净收益或预算 calibration。
- 多数 `unsafe=0` 来自隔离路径与未开放生产 commit，不是足够大的风险样本。

### 12.2 最有价值的后续单路由研究

1. **Picker robustness：** 固定正确候选已在集合内，专门研究 lexical trap、pairwise
   contrast、claim-evidence 与 verifier-assisted selection；A-EXT 的 abstain 正效应不能
   掩盖 CSP-2R 的 picker 残余错误。
2. **Candidate existence：** 独立训练/校准“有没有合法候选”与“选哪个”，并在自然
   registry churn、多个相邻缺口和错误 Skill 真实副作用下复现 A-EXT。
3. **Hint acquisition：** 将 B-XOVER 的冻结 `edit_scope_hint` 拆成可审计提取器，测量
   hint 错误率、校准、unknown 状态和错误 hint 下的损失；在真实历史 diff 与多种 patch
   backend 上复现 crossover。
4. **Failure availability control：** 若研究问题是模型诊断能力，先把 C4 timeout/服务
   错误与回答错误分开，在匹配预算和可用性后复验；若只问生产默认，当前 stop 已足够。
5. **真实 Failure distribution：** 使用自然噪声日志、组合故障和真实 plan artifacts，
   比较机械 signature、LLM、hybrid verifier 与 safe stop，而不是继续扩同类 fixture。
6. **独立模型与环境复现：** 只复现经过上述真实性升级后仍保留的效应。

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
| A-EXT | protocol `3a0e02579`；results `38d3df97b` | [independent Skill ecosystem](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_A_EXT_skill_ecosystem.md) |
| B-XOVER | protocol `3a0e02579`；results `38d3df97b` | [Delivery crossover](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_B_XOVER_delivery_crossover.md) |
| C-BLIND | protocol `62d3a5153`；results `38d3df97b` | [blind recovery diagnosis](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_C_BLIND_recovery_diagnosis.md) |

本文是决策版综合；它不把 stub pilot 升格为生产默认，也不把单路由证据并入 Workflow、
SGAR、S/CF/G/AA 或聚合失配 V6 的 claim。
