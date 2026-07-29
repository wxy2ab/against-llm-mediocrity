# Agent 诊断与改进

状态：第一批操作指南

主要模式：以评测为闸门的系统修改

基础：[Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

English：[Agent Diagnosis and Improvement](./agent-diagnosis-and-improvement.md)

相关理论：

- [诊断—机制桥接](../diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md)
- [状态治理智能体范式](../state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](../aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)

## 1. 结果

改进 Agent，是修改最早发生因果失败的系统层，并在冻结证据上证明改善，同时不破坏安全、
成本和未受影响任务。

```text
失败语料与 baseline
→ 失败层定位
→ 机制假设
→ 最小且层级正确的干预
→ 离线实现门
→ paired evaluation
→ shadow/canary 决策
→ 受治理 rollout 或拒绝采用
```

目标不是“更好的 Prompt”，而是更好的受治理系统。

## 2. 把 Agent 定义成系统

建立地图：

```text
observation/retrieval
→ context representation
→ specification/policy
→ planning
→ routing/scheduling
→ model generation
→ tool interface/compiler
→ executor/environment
→ verifier
→ commit/recovery
→ memory/write-back
```

对每层记录：

- owner；
- input/output contract；
- authoritative state；
- version；
- failure evidence；
- available verifier；
- side effects 与 rollback。

不要把每个输出失败都归因于模型。模型可能已经产生正确 semantic plan，但在物理寻址、
tool compilation、execution 或 verification 中丢失。

## 3. 冻结 Baseline

修改 Agent 前冻结：

```text
task corpus 与 split
model/client/version
prompts 与 tool schemas
runtime configuration
budgets 与 timeouts
seed/sampling policy
environment 与 dependency versions
success endpoint
failure taxonomy
token/latency/turn telemetry
unsafe 与 collateral endpoints
```

条件允许时保存 event-level evidence：

```text
observed state
plan
tool payload
executor verdict
verifier receipt
commit/rollback
terminal state
```

新系统不能和一个模型、预算、任务集或成功定义被静默改变的 baseline 比较。

## 4. 定位最早失败层

| 失败层 | 诊断问题 | 典型干预 |
|---|---|---|
| Observation | 决定性状态是否进入系统？ | Retrieval、sensor、reread、freshness |
| Representation | 状态是否编码成可行动形式？ | Structured context、派生特征、semantic ID |
| Specification | 目标是否等于真实任务？ | Acceptance contract、反例、policy |
| Planning | Semantic target/value/dependency 是否正确？ | Plan schema、evidence gate、planner |
| Routing | 是否选择正确能力/tool/path？ | Router、readiness、risk/cost policy |
| Generation | 不确定语义合成是否失败？ | Prompt、examples、model、decomposition |
| Compilation/interface | 正确 plan 是否变成合法 operation？ | Deterministic compiler、typed tools |
| State/executor | 是否基于当前权威状态原子执行？ | Hard state、preconditions、transactions |
| Verification | 正确工作是否被拒绝，错误工作是否被接受？ | Semantic verifier、coverage、canonicalization |
| Recovery | 失败反馈是否支持更好下一步？ | Located receipt、rebind、replan、escalation |
| Memory/write-back | 不可靠经验是否被升级？ | GKO lifecycle、provenance、promotion gates |

修改最早的因果失败层。下游 workaround 可能隐藏症状，但保留原机制。

## 5. 选择干预

### 5.1 Prompt 或 Context

只有失败确实位于理解或不确定生成、且所需信息已经可用时使用。

要求：

- 明确的信息增量；
- 不泄漏 expected output；
- context 大小有界；
- paired evaluation；
- 检查 fitting-boundary regression。

缺失能力属于状态权威、调度、物理寻址、确定性转换或提交安全时，不要继续加 Prompt 文本。

### 5.2 Tool Contract 或 Compiler

Semantic intent 正确，但模型生成的物理操作失败时使用。

优先：

```text
stable semantic IDs
typed operations
runtime 解析当前物理状态
deterministic compilation
preconditions 与 payload hashes
atomic executor
```

模型评测之前先通过 offline property 与 mutation tests。

### 5.3 State、Memory 或 Checkpoint

失败涉及 stale evidence、隐藏进度、replay、决策丢失或跨轮不一致时使用。

建立：

- authoritative state owner；
- version/hash 与 freshness；
- plan/candidate lineage；
- append-only events；
- terminal 与 orphan semantics；
- resume 与 replay；
- 长期 memory promotion criteria。

更多 context 不能替代 authoritative state。

### 5.4 Router 或 Scheduler

不同任务、状态或失败需要不同能力时使用。

Router 输入必须可观察、可测试：

```text
task type
risk
coupling
state freshness
plan confidence
tool support
budget
failure layer
```

不要只根据模型模糊的 self-confidence 路由。Runtime 持有 dependency readiness 与 completed
ledger。

### 5.5 Verifier

接受边界过弱、过严，或者绑定偶然序列化时使用。

区分：

- schema validity；
- local semantic validity；
- global invariants；
- collateral 与 permission checks；
- commit eligibility。

修改 verifier 可以改变测得成功率，却不一定改善 Agent。必须分别审计 false accept 与
false reject。

### 5.6 Recovery 与 Escalation

初始失败是预期或不可避免时使用。

Recovery 必须增加信息或能力：

```text
refresh state
rebind address
localize failed targets
expose violated constraint
change executor
replan
ask a minimal sufficient human question
```

没有信息增量的同参数 retry 不是 recovery。

## 6. 分开科学门与实现门

记录：

```json
{
  "scientific_state": "passed|failed_gate|not_adjudicated",
  "implementation_gate": "passed|failed|untested",
  "cost_gate": "passed|failed|unknown",
  "safety_gate": "passed|failed|unknown",
  "external_validity": "synthetic|shadow|canary|production",
  "default_policy": "off|shadow|conditional|on"
}
```

例如：

- 即使端到端成功 claim 受 ceiling 限制，deterministic compiler 仍可能通过实现门；
- Prompt 可能提高 benchmark，但未通过安全门或成本门；
- sound semantic-ID interface 不应绑定未经确认的普遍性能增益宣传。

## 7. 评测设计

尽量使用 paired frozen evaluation：

- 相同 tasks 和 initial state；
- 相同 model 与 budget；
- 一个隔离干预，或明确声明的 intervention package；
- strict outcome + failure-layer endpoints；
- cost、latency、turns、retries、unsafe commit 与 collateral；
- 检查附近 fitting boundary 的 holdout tasks；
- 明确 floor/ceiling stop rules；
- 性能主张使用置信区间和 minimum effect。

加入 negative 与 adversarial cases：

- stale state；
- wrong/missing/duplicate target；
- relocation 或 reordered physical layout；
- timeout 与 truncated output；
- replay 与 duplicate side effects；
- verifier false-accept probes；
- unsupported 与 ambiguous intent。

不得在 confirmatory set 上调参。

## 8. 分阶段采用

```text
unit/property tests
→ offline replay
→ frozen pilot
→ confirmatory evaluation
→ shadow
→ canary
→ conditional/default rollout
```

每一阶段需要：

- entry/exit gates；
- rollback；
- telemetry completeness；
- owner；
- decision record。

只有风险和可逆性允许时才跳过阶段。

## 9. 常见无效改进

| 模式 | 为什么失败 |
|---|---|
| 所有失败都增加更长 Prompt | 把所有层都误当成 generation |
| 把 expected post-state 给模型 | 泄漏答案并破坏因果有效性 |
| 没有新证据就 retry | 重复相同失败，还可能重复副作用 |
| 让模型持有 index 和 line number | 把 intent 耦合到漂移物理状态 |
| Tool success 就记为 task success | 忽略语义与全局验证 |
| 只优化平均成功率 | 隐藏 unsafe tail、cost 和 subgroup regression |
| 每个失败立刻进入训练 | 机制和 verifier 稳定前就升级噪声 |
| 把正确安全拒绝改成宽松执行 | 用 unsafe commit 换取 liveness |
| 局部层缺陷却完整重写 Agent | 扩大归因与回归表面 |

## 10. 完成闸门

```text
[ ] baseline 与 task corpus 已冻结
[ ] 最早失败层有证据支持
[ ] 干预针对该层
[ ] 实现 properties 已离线通过
[ ] paired evaluation 保持 model/budget/task identity
[ ] strict outcome、cost 和 safety endpoints 已报告
[ ] regressions 与 fitting-boundary cases 已检查
[ ] rollout state 与证据强度匹配
[ ] rollback 与 telemetry 已存在
[ ] 不支持的泛化已明确
```

## 11. 交接

```text
Agent symptom：
Localized failure layer：
Mechanism：
Intervention：
Baseline and evaluation：
Outcome / cost / safety：
Regressions：
Scientific and rollout state：
Artifacts：
Residual limits：
```
