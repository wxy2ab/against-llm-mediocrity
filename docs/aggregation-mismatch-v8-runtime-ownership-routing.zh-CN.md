# 聚合失配 Artifact-v8：运行时所有权、语义寻址与受治理交付

**文档类型：** 理论—实验—工程验证报告<br>
**证据截点：** 2026 年 7 月 28 日<br>
**总体评估：** **在明确单配置与合成任务边界的前提下可对外分享**<br>
**Study family：** `aggregation_mismatch_v8_runtime_ownership_routing`<br>
**Schema：** `artifact-v8`<br>
**English:** [Aggregation Mismatch Artifact-v8: Runtime Ownership, Semantic Addressing, and Governed Delivery](./aggregation-mismatch-v8-runtime-ownership-routing.md)<br>
**双语同步规则：** 两个版本的条件名、样本量、估计值、裁决、限制与工程规则必须保持一致。

---

## 技术摘要

Artifact-v8 用 **288 个 DeepSeek-V4-Flash semantic episodes** 和 **64 个离线
deterministic compiler cases** 检验两个 Agent 工程问题：

1. 相对一次性输出整个对象，由 runtime 持有 readiness gate、分层交互和外部 ledger，
   能否恢复依赖构造的严格成功率？
2. 正确 semantic plan 已固定后，模型应提交物理 index、稳定 semantic ID，还是完整
   重写对象？Patch/Rewrite 的相对关系是否随 edit density 改变？

| Claim | 主估计 | 95% CI | Holm/raw p | 裁决 |
|---|---:|---|---:|---|
| **V8-A1** GATED−STATIC | +59.4 pp | [40.6, 75.0] pp | Holm \(1.53\times10^{-5}\) | **通过**；成本 guardrail 失败 |
| **V8-A2** VERIFIED−GATED | +6.25 pp | [0, 15.6] pp | Holm 1.0 | **未裁决：ceiling** |
| **V8-B1** ID−INDEX | +31.25 pp | [20.3, 42.2] pp | Holm \(4.58\times10^{-5}\) | **通过** |
| **V8-B2** density interaction | +3.125 pp | [0, 9.375] pp | Holm 1.0 | **未通过预注册门** |
| **V8-B3** deterministic compile | 双路径 64/64 exact | — | — | **通过采用门** |

最强且得到支持的结论是：

> **在本单一 DeepSeek 配置和合成对象族中，把依赖状态与物理地址解析移交 runtime，
> 能显著提高系统严格成功率。但 ledger scaffold 的中位 token 约为 static 基线的
> 7 倍，本实验也没有建立稀疏 ID Patch / 稠密 Full Rewrite 的硬 crossover。**

## 1. 理论

### 1.1 聚合失配也是运行时所有权问题

Agent 成功可以按诊断层分解为：

\[
P(S)
=
P(P)
\times P(D\mid P)
\times P(C\mid P,D),
\]

其中 \(P\) 是计划或中间构造正确，\(D\) 是交付正确，\(C\) 是提交安全。这不是独立性
假设，而是分离失败责任：

- planning 可能因为依赖与完成状态没有被维护而失败；
- delivery 可能因为 path、index、hash 或工具 schema 错误而失败；
- commit 可能接受无效状态或产生重复副作用。

Artifact-v8A 干预第一层的 runtime 支架。Artifact-v8B 固定正确 semantic plan，
干预交付接口。B3 进一步问交付是否可以完全离开模型采样。

### 1.2 Readiness ledger 改变了计算结构

对 DAG 节点 \(v\)，只有全部前驱已解析时，局部执行才直接合法：

\[
x_v=f_v(x_{\mathrm{pa}(v)}).
\]

一次性响应让模型同时维护依赖顺序、已完成值、覆盖、算术和最终序列化。runtime-owned
ledger 把任务改写为受治理状态转移：

\[
(L_t,R_t)\rightarrow\Delta_t\rightarrow L_{t+1},
\]

其中 \(L_t\) 是已完成硬状态，\(R_t\) 是 ready set。正确 gate 可以在结构上阻止
not-ready 提交。理论预测模型责任减少，但不能预测固定模型恰好提升 59.4 个百分点；
这是 A1 的经验结果。

### 1.3 局部 verifier 有安全属性，不保证模型部署增益

如果局部 verifier 对受保护规则可靠，它可以阻止已知局部违规进入 ledger。它不能保证：

- 错误出现在可修复区域；
- 模型能正确利用回执；
- ledger 基线还留有足够空间识别增量；
- verifier 没有 false accept、false reject 或额外成本。

A2 两个比较臂都高于 0.90，且 32 个 VERIFIED episode 没有一个触发 repair。因此结果
受 ceiling 限制。它既不是“局部验证无用”的证据，也不是“repair loop 恢复了两个
case”的证据。

### 1.4 Semantic ID 从模型侧移除一个确定映射

令 \(\pi\) 为当前物理排列，\(u\) 为稳定 semantic ID。物理 index 接口要求模型计算
并序列化：

\[
\mathrm{index}=\pi^{-1}(u).
\]

semantic-ID 接口只让模型提交 \(u\)，由 runtime 在权威状态上解析当前地址。这样从
模型承诺面中移除了一个确定但脆弱的映射。

结构论证只给出方向，不给出普遍成功率定律。V8-B1 是当前对象族和模型配置下的确认性
证据。

### 1.5 正确 plan 应在可能时确定性编译

给定权威状态 \(s\)、已验证 plan \(p\)、正确编译器 \(C(s,p)\)、原子执行器 \(E\)
和覆盖受保护不变量的 verifier \(V\)：

\[
V(E(s,C(s,p)))=1.
\]

在这种设定下，重新采样工具参数或完整对象不会增加任务信息，只会增加新的随机序列化
与工具契约失败面。B3 检验当前 compiler 实现是否通过采用门，不是对所有 compiler
或生产工作负载的形式证明。

### 1.6 Patch 与 Rewrite 仍是条件关系

Patch 的承诺面通常随 edit 数 \(k\)、地址成本与 schema 开销增长；Full Rewrite 的
承诺面通常随对象长度 \(N\) 增长。实际成功还取决于 plan 质量、地址稳定性、工具合同、
verifier 覆盖、模型策略与预算：

\[
\text{route}
=g(k/N,\text{address stability},\text{plan confidence},
\text{compiler availability},\text{verifier coverage},\text{budget}).
\]

理论不能给出部署阈值。V8-B2 检验一个 density interaction，并未通过预注册门。

## 2. 实验设计

### 2.1 冻结配置

| 项 | 值 |
|---|---|
| Model | `SimpleDeepSeekClientChat / deepseek-v4-flash` |
| Thinking | `False` |
| Temperature / top_p | `0 / 1` |
| Max tokens | 每 provider turn 64,000 |
| Prompt language | 中文 |
| Episode budget | 300 秒 |
| Primary unit | A：instance；B：`base_id` cluster |
| Bootstrap | 10,000 次固定 seed cluster 重采样 |
| Paired test | exact two-sided sign-flip |
| Multiplicity | A1、A2、B1、B2 做 Holm 校正 |

### 2.2 V8-A：runtime scaffold

32 个全新 DAG 覆盖 \(N\in\{8,16\}\) 与 frontier \(\in\{2,8\}\)。全部条件共享
graph、truth、预算、renderer 和 global verifier。

| 条件 | Runtime 持有 | 模型持有 |
|---|---|---|
| `A-STATIC-BATCH` | 响应后的解析和最终验证 | 一次输出完整拓扑 assignments |
| `A-GATED-LEDGER` | ready set、逐层 gate、completed ledger | 恰好提交当前 ready layer |
| `A-VERIFIED-LEDGER` | GATED 全部机制 + 当前层验证 | 失败后最多一次定向修复 |

A1 识别的是 **readiness + ledger + staged interaction package**，不是纯 ledger、
纯顺序或私有推理效应。A2 比较 local verifier 相对 GATED 的增量。

### 2.3 V8-B：semantic address routing

32 个新 base host 覆盖 \(N\in\{96,384\}\) 与 stable/relocated 地址状态。每个 base
产生 sparse 和 dense 两个 variant，共 64 variants。

| 条件 | 模型提交 | Runtime 持有 |
|---|---|---|
| `B-INDEX-PATCH` | 当前 path/index + ID + old/new | 检查与执行 |
| `B-ID-PATCH` | 稳定 ID + old/new | 解析当前 index 并执行 |
| `B-FULL-REWRITE` | 完整当前对象 | 结构、metadata 与 collateral 检查 |
| `B-DETERMINISTIC-COMPILE` | 无模型调用 | 从已验证 plan 编译 index/ID 参数 |

三个模型臂获得相同权威 current object、semantic plan、plan hash 和预算。每臂只允许
一次 write action，不允许 recovery。

## 3. 数据验证

### 3.1 覆盖与身份

| 检查 | 结果 |
|---|---:|
| 冻结正式 specs | 288 |
| Endpoint rows | 288/288 |
| Unique run keys | 288/288 |
| Missing / unexpected / duplicate | 0 / 0 / 0 |
| Spec–result identity mismatch | 0 |
| Offline compiler cases | 64/64 unique |

### 3.2 事件重建

Event ledger 共 2,992 条事件，覆盖全部 288 个 run key：

| 检查 | 结果 |
|---|---:|
| 重复 `(run_key,event_index)` | 0 |
| Episode 内 event index 不连续 | 0 |
| 每 episode 恰好一个 `commit_end` | 288/288 |
| A endpoints 可重建 | 96/96 |
| B endpoints 可重建 | 192/192 |
| Provider-turn / event mismatch | 0 |
| Transport-attempt / event mismatch | 0 |
| B 原生 write 恰好一次 | 192/192 |

A 有 272 个 provider turns 和 272 个 transport attempts；B 为 192/192。没有
transport retry。全部 episode 都在 300 秒内结束，最大 wall time 为 50.77 秒。
因此 V8 不是 timeout 驱动的结果。

冻结数据验证器返回 `ok=true`；仓库根路径进入 `PYTHONPATH` 后，15 个 V8 测试全部通过。

## 4. 结果

### 4.1 Runtime scaffold

| 条件 | Strict exact | Mean turns | Median tokens | Median wall time |
|---|---:|---:|---:|---:|
| STATIC | 11/32 (34.4%) | 1.0 | 418 | 2.64s |
| GATED | 30/32 (93.8%) | 3.75 | 2,941 | 8.78s |
| VERIFIED | 32/32 (100%) | 3.75 | 2,800.5 | 8.39s |

![V8-A 严格成功与 episode 成本](./assets/aggregation-mismatch-experiment/v8-a-success-rates.png)

19 个配对实例 GATED 优于 STATIC，0 个反向，13 个持平。STATIC 有 21 次
`value_error`；GATED 有 2 次。中位 token 比约为 **7.04×**，超过预注册 4×
成本 guardrail。

VERIFIED 比 GATED 多两个观察成功，但两臂都高于 0.90，比较未裁决。没有 VERIFIED
episode 触发 repair path。

### 4.2 Semantic ID 与物理 index

| 条件 | Strict exact | Median tokens | Median wall time |
|---|---:|---:|---:|
| INDEX Patch | 43/64 (67.2%) | 8,361.5 | 7.89s |
| ID Patch | 63/64 (98.4%) | 7,661.5 | 6.96s |
| Full Rewrite | 64/64 (100%) | 11,846 | 24.66s |
| Deterministic compile | 双路径 64/64 | 0 model calls | 中位约 2.22ms/case |

![V8-B 按地址状态分层](./assets/aggregation-mismatch-experiment/v8-b-by-address.png)

17 个 base cluster 中 ID 优于 INDEX，0 个反向，15 个持平。INDEX 的 21 次失败全部为
`executor_or_tool_error`；ID 的唯一失败为 `verifier_fail`。

地址分层结果为：

| Address regime | INDEX | ID | FULL |
|---|---:|---:|---:|
| stable | 19/32 | 32/32 | 32/32 |
| relocated | 24/32 | 31/32 | 32/32 |

stable 与 relocated 使用不同 base host，而不是同 host 内地址干预。INDEX 在 stable
子组反而更低，因此不能把 pooled B1 事后改写成“重定位专门导致 index 失败”。

### 4.3 Density crossover 未建立

| Density | ID | FULL | ID−FULL |
|---|---:|---:|---:|
| sparse | 32/32 | 32/32 | 0 |
| dense | 31/32 | 32/32 | −3.125 pp |

![V8-B ID 与 Full 的密度分层](./assets/aggregation-mismatch-experiment/v8-b-id-full-density.png)

+3.125 pp interaction 只有 1 个正向 base，31 个零差。它没有满足 +20 pp、CI 排零和
Holm-\(p\) 门。两臂接近 ceiling，也不能据此证明 crossover 不存在。

### 4.4 Deterministic compilation

64 个 offline case 上：

- index compile 64/64 exact；
- ID compile 64/64 exact；
- invalid args、collateral changes、hash violations、plan violations 全部为 0；
- failure-path pre-state preservation 为 64/64；
- model delivery calls 为 0。

这是冻结案例的实现证据，不是生产可靠率 100% 的估计。

## 5. 结论与 Claim 边界

### 得到支持

- 在受测 DeepSeek 配置中，runtime-owned readiness/ledger/staged-interaction package
  对 strict exact 有大效应。
- 正确 semantic plan 固定时，stable semantic-ID 接口优于模型提交物理 index。
- 当前 deterministic compiler 通过冻结采用门。
- V8 失败不是 300 秒 timeout 驱动。

### 未得到支持

- A1 只由 ledger、顺序、外部记忆或某个孤立组件造成；
- 局部验证已经确认独立部署增益；
- relocation 是 INDEX 失败的已识别原因；
- sparse 永远选 ID Patch、dense 永远选 Full Rewrite；
- Patch 或 Rewrite 存在普遍排序；
- 单一 DeepSeek 配置与合成 JSON/GF(2) 可泛化到真实软件仓库；
- 64/64 offline gate 是生产可靠性保证。

## 6. 工程意义

### 6.1 推荐控制流

```text
read authoritative state
→ construct semantic plan
→ verify and bind plan_hash/pre_hash
→ schedule ready operations
→ persist completed ledger
→ deterministically compile when available
→ otherwise prefer semantic-ID operations over physical indexes
→ execute atomically
→ verify local and global invariants
→ commit or rollback
```

### 6.2 Runtime 应持有的对象

- authoritative object 与 version/hash；
- dependency graph、ready set 与 completed ledger；
- stable semantic-ID 到 current address 的映射；
- verified plan 与 plan hash；
- compiler、atomic executor、checkpoint 与 rollback；
- local/global verifier 与 typed receipt；
- append-only event ledger 与幂等 commit record。

### 6.3 V8 不足以支持的策略

- 不经过成本和风险路由就全局开启昂贵 ledger path；
- 因 A2 ceiling 而删除 global verifier；
- 根据当前子组把 stable 路由到 INDEX、relocated 路由到 ID；
- 硬编码 sparse→ID / dense→FULL；
- 正确 plan 可编译时仍让模型重新采样 delivery。

### 6.4 成本感知路由

runtime scaffold 用成本换可靠性。生产 router 应优化：

\[
\text{utility}
=
\text{exact success value}
-\lambda_t\text{tokens}
-\lambda_l\text{latency}
-\lambda_r\text{commit risk}.
\]

低耦合、低成本、可逆任务可以保留轻量路径。高耦合或高后果状态转移应进入受治理
readiness 与 ledger path。

## 7. 可能的应用

| 领域 | Semantic plan | Runtime-owned delivery |
|---|---|---|
| 代码编辑 | symbol ID、AST node ID、预期 old/new | 解析当前位置、应用 edit、测试、原子提交 |
| JSON/配置 | object key 或 stable entity ID | 解析当前 path、schema 验证、rollback |
| 数据库迁移 | table/column/constraint ID | 编译 DDL、dry-run、事务提交 |
| 表格 | row key + column name | 解析当前 cell、公式与总计检查 |
| Agent DAG | task ID + dependency edge | readiness scheduling、ledger、幂等执行 |
| 研究/规范文档 | claim/section ID + evidence link | 局部修改、引用检查、全局一致性审计 |

每个真实领域都需要领域 verifier。合成 exact truth 不能替代编译器、测试、schema、
数据库约束、业务规则或人工验收。

## 8. 限制与下一步

1. 单一 DeepSeek-V4-Flash 配置、中文 prompt、thinking disabled。
2. 每个正式 semantic episode 只有一次运行，没有托管服务跨日方差估计。
3. A1 是 package 干预，且不与 STATIC effort-matched。
4. A2 受 ceiling 限制，没有观察到 repair event。
5. stable/relocated 不是同 base host 内配对。
6. ID/FULL 接近 ceiling，限制 density interaction 识别。
7. B3 只覆盖合成冻结案例，不含并发或仓库语义。
8. 真实采用仍需 property-based、mutation、concurrency、failure-injection 与 OOD 测试。

最高价值的下一步是：

- 低成本 readiness × ledger × staged interaction × verifier factorial；
- 同 host 地址重定位与更多 density 点；
- regional rewrite 与真实 payload telemetry；
- semantic-ID/compiler 向真实代码/配置任务迁移；
- 在第二个低成本、版本固定配置上复现。

### Artifact-v9 后续证据

Artifact-v9 已用 192 个 semantic episodes 完成计划中的 ready × ledger 与 receipt
后续实验。更难的 \(N=24/48\) strict-order 合同下，effort-matched scaffold 四臂为
0/24、0/24、0/24、1/24，所以 ready 与 ledger 主效应因 floor **未裁决**。冻结错误
修复中，GENERIC、LOCATED、CAUSAL 为 26/32、30/32、30/32；两个 +12.5 个百分点
对比都没有通过预注册门。77 个 order failure 的 ready-ID 集合其实全部正确，只有
排列不同。

这些结果不修改 V8 的原始裁决，但阻止更强归因：V8-A1 仍然是完整 runtime package
的证据，不是任一可见字段的单独证据。它们也支持继续检验 runtime 顺序 canonicalization
与成本门控的 receipt 升级。详见
[Artifact-v9](./aggregation-mismatch-v9-minimal-scaffold-recovery.zh-CN.md)。

## 9. 可复现性与来源

Canonical sources：

- [冻结设计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V8_RUNTIME_OWNERSHIP_ROUTING_DESIGN.md)
- [正式裁决报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V8_RUNTIME_OWNERSHIP_ROUTING_REPORT.md)
- [理论—实验验证](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V8_RUNTIME_OWNERSHIP_ROUTING_VALIDATION.md)
- [机器可读汇总](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v8_runtime_ownership_routing/confirmatory/analysis/summary.json)
- [覆盖审计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v8_runtime_ownership_routing/confirmatory/analysis/coverage.json)
- [完整实验仓库](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment)

## 10. 一句话结论

> **Artifact-v8 确认了两个可部署边界：依赖构造在 readiness 与 completed state 由
> runtime 持有时获益，结构化编辑在模型提交 semantic ID、runtime 解析地址并编译
> verified plan 时获益。这些收益需要成本路由，而 Patch/Rewrite density crossover
> 仍未解决。**

## 相关文档

- [聚合失配 Artifact-v9](./aggregation-mismatch-v9-minimal-scaffold-recovery.zh-CN.md)
- [Aggregation Mismatch Artifact-v8: English](./aggregation-mismatch-v8-runtime-ownership-routing.md)
- [聚合失配与组合治理](./aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [聚合失配 Artifact-v7](./aggregation-mismatch-v7-mechanism-recovery.zh-CN.md)
- [Patch 与完整重写受控实验](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)
- [State-Governed Agent Regime](./state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
