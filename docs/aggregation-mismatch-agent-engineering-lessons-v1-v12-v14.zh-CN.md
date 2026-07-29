# 从聚合失配 V1–V12 与 V14 到 Agent 工程：完整经验总结

**证据截止：** 2026-07-29

**定位：** 将受控实验转化为可实现、可度量、可撤销的 Agent 架构原则。

**English:** [From Aggregation Mismatch V1–V12 and V14 to Agent Engineering](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14.md)

**配套证据：** [V1–V12 与 V14 实验总览](./aggregation-mismatch-v1-v12-v14-experiment-summary.zh-CN.md)

**范围：** V13 因 ceiling 未裁决而归档，不作为本总结的工程效果证据。

## Executive Summary

这组实验最重要的工程发现不是“Patch 永远优于 Rewrite”，也不是“加更多 prompt 或
reasoning tokens”，而是：

> **不要让模型同时拥有语义决策、权威状态、依赖调度、物理寻址、Exact 预条件重绑、
> 长对象序列化和最终提交。模型提出可验证的 semantic plan；runtime 持有硬状态、
> 编译和执行计划、解释受约束 Intent、验证不变量并控制 commit。**

推荐的生产路径：

```text
Observe authoritative state
→ Propose semantic plan
→ Verify and freeze plan
→ Schedule ready operations
→ Deterministically compile when possible
→ Otherwise route Intent / Exact Patch / Regional / Full
→ Seal payload
→ Revalidate current state
→ Execute atomically
→ Verify local and global invariants
→ Commit or rollback
→ Append event ledger and update routing evidence
```

最直接的采用规则：

1. 依赖构造由 runtime 管理 readiness 和 completed ledger。
2. 正确 plan 可编译时，不让模型再次序列化工具参数。
3. 模型提交 stable semantic ID，runtime 解析当前 index/path/span。
4. Plan verification 必须先于 Patch/Rewrite/Intent/Exact 路由。
5. 失败按 state、plan、compile、delivery、executor、verifier、commit 分层。
6. 所有写入通过 precondition、hash、atomic executor、global verifier 和 rollback。
7. Patch/Regional/Full 是条件路由，不硬编码未验证的 density crossover。
8. 语义集合正确与序列化顺序正确分开；无害顺序由 runtime canonicalize。
9. Receipt 采用 generic→located→causal 的按需证据升级。
10. 成功率、token、latency、tail、commit risk 和人工升级共同进入 router。
11. Payload seal 后发生 state drift 时，Exact 必须 stale；恢复留在同一 semantic episode。
12. 科学 claim state、实现采用门和产品默认分别维护。

## 1. 如何把证据变成工程规则

每条规则标记三种状态：

| 标记 | 含义 | 工程处理 |
|---|---|---|
| **T：条件性理论** | 在显式假设下由信息、图结构或程序语义推出 | 可先实现为安全 substrate，并验证实现 |
| **E：实验支持** | 在固定模型、对象、预算与协议下通过门 | 相似流量可 shadow/canary，保留开关 |
| **U：未裁决/未通过** | floor、ceiling、CI 或最小效应不满足 | 不硬编码，继续校准 |

例如：

- 正确 plan 的确定性编译不会增加任务信息：T；
- V7/V8 compiler 在冻结案例上 exact：E；
- 稀疏到稠密的固定路由阈值：U；
- V14 recovery 成本至少 +20%：U，虽然方向为正。

理论决定架构里应有哪些安全组件，实验决定当前部署是否开启、成本多高和边界在哪里。

## 2. Agent 成功必须按层分解

\[
P(S)=
P(\text{state adequate})
\times P(\text{plan correct}\mid state)
\times P(\text{delivery correct}\mid plan)
\times P(\text{safe commit}\mid delivery).
\]

这不是独立性假设，而是诊断分层：

| 层 | 权威对象 | 典型失败 |
|---|---|---|
| Observation / State | snapshot、version、evidence、dependencies | stale read、缺文件 |
| Plan | semantic operations、preconditions、goal | 错目标、漏影响范围 |
| Compile / Delivery | tool args、address、payload | index/path/schema 错 |
| Execute / Verify | post-state、invariants | partial apply、collateral |
| Commit | verdict、transaction、replay state | unsafe accept、重复副作用 |

V5 表明 oracle plan 下交付差很大而 infer plan 贴地；V6 表明选对 failure layer 后，
recovery executor 仍可能无效；V14 表明 initial payload 正确也可能在执行前变 stale。

## 3. 原则一：Runtime 持有权威硬状态

Runtime 至少持有：

- authoritative snapshot、version、`pre_hash`；
- dependency graph、ready set、completed ledger；
- frozen plan、`plan_hash`、provenance；
- stable ID 到当前 physical address 的映射；
- sealed payload hash 与 seal event；
- checkpoint、post-state、verifier verdict；
- idempotency key、commit/rollback record。

这些对象不能只存在对话文本中。V4 的外部正确 bits、V6/V8 的 scheduler/scaffold、
V11/V12 的 semantic-ID，以及 V14 的 seal-before-drift 都说明硬状态所有权是 runtime
责任。代价也必须测量：V8 scaffold 中位 token 约增加 7.04×。

## 4. 原则二：模型输出 Semantic Plan

推荐最小 plan：

```json
{
  "plan_id": "stable-id",
  "pre_hash": "authoritative-state-hash",
  "operations": [
    {
      "target_id": "semantic-object-id",
      "intent": "replace",
      "old": "expected-old-value",
      "new": "proposed-new-value",
      "evidence_refs": ["..."]
    }
  ],
  "dependencies": [],
  "protected_invariants": []
}
```

Plan gate 检查 schema、target、evidence、precondition、重复/冲突、依赖闭合、影响范围、
不变量和 `plan_hash`。顺序必须是：

```text
infer → verify/revise/retrieve → freeze → choose delivery
```

而不是 plan 一生成就选择更短的写入 API。V3/V5 的 oracle–infer 差正是这条边界。

## 5. 原则三：正确 Plan 优先确定性编译

优先级：

```text
1. deterministic compiler + native executor
2. runtime-resolved semantic-ID Patch
3. regional/subtree Rewrite
4. model Full Rewrite
```

V7 compiler 48/48、V8 双 compiler 64/64 通过冻结采用门。实现仍需 property/mutation、
OOD schema、并发、crash/replay 和 verifier false-accept 测试。正确 plan 已知时，再让
模型重写 tool args 只增加新的失效面。

## 6. 原则四：Semantic ID 优于模型侧物理地址

不推荐模型同时提交：

```json
{"item_id":"svc-42","path":"/items/37/value","new":3}
```

推荐：

```json
{"item_id":"svc-42","new":3}
```

由 runtime 根据最新状态解析 path/index/span。V8 ID−INDEX +0.3125；V11 的
relocation interaction +0.21875，但集中于 \(N=48\)；V12 没有确认 drift-dose
单调增加。工程处方来自地址不变性和实验支持，不需要先预测漂移剂量。

## 7. 原则五：依赖调度由 Runtime 执行

Scheduler 管理：

- ready set；
- completed ledger；
- unmet dependencies；
- deterministic tie-break；
- residual subgraph；
- per-node retry 与 budget。

V6 scheduler package +0.438，V8 scaffold +0.594；V7 仅要求 requested order 的纯效应
未过门，V9 的 ready/ledger 单字段在更难窗口进入 floor。因此采用的是
dependency-aligned runtime package，不是“提示模型按拓扑顺序输出”。

## 8. 原则六：Verifier 控制提交，但不能神化 Verifier

两级验证：

| 层 | 目标 | 回执 |
|---|---|---|
| Local / incremental | 当前 operation 或受影响子图 | failed IDs、observed values |
| Global / commit | 完整 post-state 与业务不变量 | accept/reject/rollback witness |

Local verifier 用于早停和定位，global verifier 是最终 commit gate。V7/V9 的 located
receipt 都有正方向但未过确认门；V8 local increment 又遇 ceiling。推荐证据升级：

```text
generic reject
→ failed semantic IDs
→ causal witness / dependency slice
→ broader context or human escalation
```

只有上一层条件成功率不足且风险收益覆盖 token/latency 成本时才升级。

## 9. 原则七：Patch/Rewrite/Intent/Exact 是路由问题

稀疏 Patch 的条件性承诺面：

\[
L_{\mathrm{rewrite}}\approx Nc_r,\qquad
L_{\mathrm{patch}}\approx c_0+k(c_p+\log N).
\]

当 plan 正确、\(k\ll N\)、地址稳定、executor 可靠时，Patch 通常更小；高密度、结构
重构、错误 plan 或脆弱工具会消除优势。

| 条件 | 首选 |
|---|---|
| Plan 已验证且 compiler 支持 | Deterministic compile |
| 稀疏 edit、stable IDs、局部不变量充分 | Semantic-ID Patch |
| 修改集中于可验证 region/subtree | Regional Rewrite |
| 高密度或整体 schema 改变 | Full Rewrite |
| Plan 未验证 | Replan / verify，不进入 delivery |
| Sealed Exact stale | Typed reject → refresh → recompile/rebase |
| 可验证单调目标、冲突风险可控 | Runtime-interpreted Intent |

证据包括 V3/V5 的条件 Patch 优势、V12 sparse Patch−Full +0.2917、V11 的成本优势；
边界包括 V4 近零、V7 Rewrite recovery 较高、V11 reliability ceiling、V12 dense
Regional 8/24 和 V14 +20% cost gate 未过。

## 10. 原则八：Failure-Layer Routing，不做 Generic Retry

| Failure layer | 证据 | 动作 |
|---|---|---|
| Observation/state | stale evidence、hash mismatch | reread / refresh |
| Plan | wrong target/value/dependency | replan / expand search |
| Compile | unsupported operation | fix compiler / controlled fallback |
| Delivery | path/index/schema/tool args | deterministic recompile / rebind |
| Executor | permission、IO、transaction | rollback / repair environment |
| Verifier | local/global invariant failure | local repair / expand radius |
| Commit/replay | duplicate、conflict、stale pre-state | abort / rebase / idempotent replay |

V6 的 stage-aware router +0.3125，但 delivery-error 两策略都 0/24。V14 的
`STALE_OLD_VALUE` 应进入 refresh/recompile，而不是盲目重发同一 payload。

## 11. 原则九：Governed Commit 是独立安全层

最小事务：

```text
revalidate pre_hash / version / lock
→ checkpoint
→ atomic apply
→ local checks
→ global verifier
→ post_hash and collateral audit
→ commit

on failure:
rollback and preserve authoritative pre-state
```

必须防止 invalid commit、stale write、partial multi-edit、duplicate replay、plan-hash
mutation、collateral 和 verifier reject 后仍写入。V6 10,000 offline、V10 1,024、
V11 1,024、V12/V14 各 768 是实现采用证据，不是生产总体保证。

## 12. 原则十：预算和成本属于 Claim

Router 应优化：

\[
U=
V_sP(\text{exact success})
-C_t(tokens)
-C_l(latency)
-C_r(risk)
-C_h(human).
\]

必须同时记录 exact endpoint、budget、token、provider turns、transport attempts、
payload bytes、stage latency、rollback、tail latency 和 success-per-cost。

V12 的 Patch 优势全部来自 300 秒内 Full timeout；V14 四臂最终均成功，但 Exact
recovery 增加第二 turn，成本点估计 +19.3% 且未达 +20% 门。不能把 timeout usage
缺失当 0，也不能把多个独立预算调用拼成一次 survival curve。

## 13. 原则十一：事件账本属于恢复能力

推荐 event：

```json
{
  "run_key": "semantic-episode-id",
  "event_index": 7,
  "stage": "plan_verified|payload_sealed|drift|tool|verify|commit|rollback",
  "state_hash_before": "...",
  "state_hash_after": "...",
  "plan_hash": "...",
  "payload_hash": "...",
  "verdict": "...",
  "error_layer": null
}
```

不变量：

- `(run_key,event_index)` 唯一且连续；
- terminal 唯一且不可被 resume 覆盖；
- retry/recovery 是同一统计样本的 nested attempt；
- payload 或可审计 hash 持久化；
- endpoint 可由 events 重建；
- replay 不产生重复副作用。

V9–V12 已做到逐 episode 重建；V14 的 96 episodes、1,416 events、120 provider
turns 零重建错配，并明确记录 96/96 seal-before-drift。

## 14. 原则十二：科学门与产品默认分开

每个 feature 维护：

```json
{
  "scientific_state": "passed|failed_gate|not_adjudicated",
  "implementation_gate": "passed|failed|untested",
  "cost_gate": "passed|failed|unknown",
  "external_validity": "synthetic|shadow|canary|production",
  "default_policy": "off|shadow|conditional|on"
}
```

典型差异：

- V8 scaffold 科学效应通过，但成本高；
- V11 Patch/Rewrite reliability ceiling，但成本可用于路由；
- V12 A1 simple effect 大而 interaction 未过；
- V12 B1 通过，但差异来自预算内 timeout；
- V14 方向和精确检验都强，但未达到预注册最小效应。

一个布尔 `experiment_passed` 不能同时控制论文措辞和生产策略。

## 15. 推荐参考架构

```text
State Reader
  → authoritative snapshot + pre_hash

Planner
  → semantic plan

Plan Verifier
  → evidence, target, precondition, dependency checks

Scheduler / Ledger
  → ready set and completed work

Compiler / Delivery Router
  → deterministic / ID Patch / Regional / Full / constrained Intent

Payload Sealer
  → immutable args + payload_hash

Atomic Executor
  → revalidate, checkpoint, apply, rollback

Local + Global Verifiers
  → typed witness and commit verdict

Commit Controller
  → commit only verified post-state

Event Store / Policy Learner
  → reconstruct episodes and calibrate routes
```

状态机：

```text
OBSERVED → PLANNED → PLAN_VERIFIED → READY → COMPILED → SEALED
→ REVALIDATED → EXECUTED → POST_VERIFIED → COMMITTED

PLAN_REJECTED → REPLAN
SEALED_PAYLOAD_STALE → TYPED_REJECT → REFRESH → RECOMPILE
COMPILE_UNSUPPORTED → CONTROLLED_FALLBACK
DELIVERY_FAILED → RECOMPILE / REBIND
POST_REJECTED → ROLLBACK → LOCAL_REPAIR_OR_REPLAN
```

## 16. 落地顺序

### P0：安全与审计底座

1. 权威 state、version、`pre_hash/post_hash`；
2. semantic plan schema 与 `plan_hash`；
3. payload seal、typed stale、idempotency key；
4. atomic executor、checkpoint、rollback；
5. global verifier 实际控制 commit；
6. append-only event ledger 与 typed failure taxonomy。

### P1：能力与路由

1. stable semantic ID；
2. deterministic compiler；
3. dependency scheduler + hard ledger；
4. plan verifier 与 evidence binding；
5. local/incremental verifier；
6. Patch/Regional/Full/Intent/Exact router；
7. stage-aware recovery executors。

### P2：校准与迁移

1. 按真实流量估计各层 base rate；
2. 学习 success–token–latency–risk Pareto；
3. 跨模型、语言、日漂移与 OOD 监控；
4. verifier mutation、false accept/reject suite；
5. density、coupling、length、address stability 阈值；
6. shadow/canary 反事实评估；
7. 迁移到真实代码、配置、数据库、表格和文档。

## 17. 应用映射

- **代码 Agent：** symbol/AST plan → compile current edits → seal → hash recheck →
  format/type/test → diff audit → atomic commit。
- **配置/JSON：** stable ID、schema、old-value precondition、atomic batch；runtime 解析
  当前 index，受约束 Intent 处理单调目标。
- **数据库：** semantic migration plan → shadow dry-run → lock/version recheck →
  transaction → invariant check。
- **表格/财务模型：** row key、semantic column、formula intent；runtime 解析 cell，
  验证依赖图与 totals。
- **研究/规范文档：** claim/evidence ID、术语表、局部变更、数字和双语一致性检查。
- **多 Agent：** 只分发 ready task，共享 hard ledger；每个 sealed plan 绑定 base
  hash，合并前做 conflict graph 和全局验收。

## 18. 反模式

- 权威对象只存在模型上下文；
- 模型引用陈旧行号、index 或文本 span；
- plan 未验证就选择 Patch；
- 正确 plan 已知仍让模型重复生成工具参数；
- 等价 ID 集合因排列不同被拒；
- verifier 只建议，reject 后仍可 commit；
- stale payload 做 generic retry；
- recovery 被计作新独立样本；
- 只报成功率，不报预算、tail 和 commit risk；
- 把 48/48、768/768 写成生产 100%；
- 把 failed gate 写成无效，把 ceiling 写成等价；
- 根据探索性子组硬编码 router；
- 把单模型合成结果外推为普遍定律。

## 19. 仍需研究

1. V8 scaffold 的最小成本实现是什么？
2. Ready、ledger、多轮和 canonicalization 的独立增量如何识别？
3. Located receipt 能否相对 causal 非劣且更省成本？
4. 真实 density×coupling×schema 的 Patch/Regional/Full crossover 在哪里？
5. V11 semantic-ID 与 V14 stale-recovery 能否跨模型、真实仓库复现？
6. 非单调、互斥或含糊 Intent 的安全解释边界是什么？
7. 多 writer、crash/replay、外部副作用下的 governed commit 是否仍成立？
8. 真实 failure base rate 下 stage-aware routing 的净收益是多少？

## 最终工程结论

```text
模型负责不确定语义与候选计划
runtime 负责权威状态、依赖、地址和 Intent 解释
compiler/executor 负责可确定交付
verifier 负责接受边界
commit controller 负责原子状态转移
event ledger 负责恢复、审计与持续校准
```

最短原则：

> **先验证 plan，再编译 delivery；优先 semantic ID 和确定性执行；payload seal 后重验
> 权威状态；stale Exact 走 typed recovery；所有写入经过 atomic executor、global
> verifier 与 commit/rollback；交付方式和 scaffold 强度由真实成本、风险与证据状态
> 条件化路由。**

## 相关文档

- [V1–V12 与 V14 实验总览](./aggregation-mismatch-v1-v12-v14-experiment-summary.zh-CN.md)
- [V14 Post-Compile Drift 与 Exact Recovery](./aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)
- [Agent 五旋钮操作指南](./guidelines/agent-five-knob-operating-guidelines.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
