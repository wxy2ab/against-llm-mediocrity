# 面向受治理 LLM 系统的审计工程

**失败定位、控制空间写回与回归治理**  
**工作稿 v0.1**  
**《LLM 系统中价值保存的结构理论》的配套技术报告**  
**王昕云，梁树良**

---

## 摘要

LLM 系统越来越多地围绕迭代生成、批判、检索、工具使用、执行反馈和修订来构建。这些循环常常能提升表面质量，但它们不会自动产生持久的系统学习。模型可能批判一个答案、生成更好的候选，却仍然没有触及底层失败模式。下一个类似任务可能再次失败，因为缺陷从未被定位、写回控制空间、加上回归护栏，或提交进状态。

本文提出 **审计工程**：一种把失败转换为受治理 LLM 系统中持久控制改进的纪律。审计不是分数、偏好判断或通用批评。有用的审计会识别局部缺陷，用证据支撑它，把它映射到失配类型，选择修复目标，产生控制增量，并创建一个在该缺陷家族复发时会失败的回归护栏。

审计工程建立在两个不对称性之上。第一，生成卓越产物往往比识别具体缺陷更难。第二，提前写出完整规格往往比通过反例修复规格更难。高价值系统应利用这些不对称性，把候选失败转换为任务表征、能力路由、支持搜索、聚合约束、规格、验证和硬状态中的改进。

本文定义核心审计生命周期：

```text
Candidate Artifact
  → Audit
  → Failure Localization
  → Control Delta
  → GKO / GEO / Verifier / State Update
  → Regression Guard
  → Defect Ledger
  → Future Routing / Search / Rendering / Revocation
```

本文规范审计发现、控制增量、回归护栏、缺陷账本、验证器权威和失配特定审计模式的结构。它也定义审计自身的标准失败模式：只打分审计、模糊批评、审计剧场、回归剧场、验证器污染、代理过拟合、局部补丁覆盖、过时护栏和过度治理。

核心主张是：受治理 LLM 系统并不会仅仅因为被批评而变好。它们会在失败信息被定位、对象化、写回、加护栏，并可被未来系统行为使用时变好。

---

## 1. 目的与范围

本文是《LLM 系统中价值保存的结构理论》和受治理对象模型规范的审计侧配套报告。结构理论解释任务价值会在世界到输出管线中的哪里丢失。对象模型定义受治理知识、执行、发现、增量、护栏和状态记录如何表示。本文聚焦连接失败与修复的循环。

核心问题是：

> LLM 系统应如何把一次失败转换为持久改进，而不是一次性修正？

审计工程适用于错误重要、失败会复发、任务规格不完整，或进展必须跨生成和行动持久保存的系统。它适用于：

```text
text-to-SQL systems
code generation and repair
research agents
workflow agents
data analysis assistants
retrieval-augmented systems
long-horizon tool-using agents
expert review systems
human-AI collaboration systems
safety-critical or high-cost generation tasks
```

本文不规定单一软件栈。它定义实现中立的纪律。系统可以用 JSON、数据库、状态机、prompt 编译器、CI pipeline、任务图或人类审查工作流来实现这些对象。关键要求是语义性的：失败必须被定位，并写回相关控制层。

---

## 2. 核心论点

核心论点是：

> 只有当失败信号被转化为控制空间修改和回归治理时，审计才成为工程。

通用批评可能说：

```text
The answer is incomplete.
The reasoning is weak.
The SQL is wrong.
The plan misses an edge case.
The code may fail.
```

这些陈述可能是真的，但它们还不是工程产物。它们没有说明系统哪一部分应改变，没有识别失败来自信息缺失、错误状态、错误能力路由、低支持、坏聚合还是错误规格，也没有创建持久护栏。

审计发现应当改为说明：

```text
The output joined table A to table C directly, but the schema requires A → B → C.
Evidence: foreign-key graph shows no A.c_id; execution error references missing column C.id.
Mismatch: aggregation + observation-representation.
Repair target: capability_routing.
Repair object: join-path control object.
Control delta: add join_path_constraint for this schema family.
Regression guard: re-run representative query requiring A → B → C and fail if direct A → C join appears.
```

这是一种不同对象。它定位缺陷，命名机制，改变控制空间，并防止静默复发。

因此，审计工程把失败视为资源。失败揭示了任务、系统、规格、表征、验证器或状态转移契约中的信息。目标是把这些信息捕获为系统以后能使用的形式。

---

## 3. 审计不是什么

审计工程首先要把审计与几种较弱活动区分开。

### 3.1 审计不是打分

分数给产物排序或评级：

```text
7/10
passes / fails
preferred / not preferred
more helpful than candidate B
```

打分可用于选择，但不一定改善系统。分数不解释哪个控制对象应改变，不识别复发条件，也不产生护栏。只有当分数连接到局部证据和修复目标时，它才与审计相关。

### 3.2 审计不是通用批评

通用批评识别宽泛的不满意：

```text
This lacks detail.
This may be wrong.
This is too vague.
This needs more rigor.
```

这类批评很容易由 LLM 生成，也很容易被忽略、过拟合或表面满足。审计工程要求更窄、更可行动的对象：

```text
What exactly failed?
Where is the evidence?
Which mismatch produced the failure?
Which system layer should change?
What guard should fail if this returns?
```

### 3.3 审计不是自我反思本身

自我反思可以改善局部输出，但它不足以作为治理机制。留在同一对话上下文中的反思可能被忘记、矛盾、覆盖或合理化。只有当它被外化为发现、增量、护栏或状态记录时，才具有持久性。

### 3.4 审计默认不是最终权威

LLM 生成的审计并不自动具有权威。审计权威取决于证据和验证器层级。工具输出、执行结果、类型检查、形式验证器、数据库结果、人类专家决策和已提交状态记录，都可能高于 LLM 判断。

审计原则是：

```text
LLMs may propose audit findings.
Evidence and verifier hierarchy determine whether findings are accepted.
```

---

## 4. 基础不对称性

审计工程有用，是因为许多高价值任务存在可以利用的不对称性。

### 4.1 生成-验证不对称

在许多领域，生成正确产物比检查候选的具体缺陷更难。

例子：

```text
Writing a correct SQL query is difficult; executing it and inspecting errors is easier.
Writing a bug-free patch is difficult; running tests and static checks is easier.
Writing a fully correct plan is difficult; identifying a missing dependency is easier.
Writing a complete specification is difficult; recognizing a counterexample is easier.
```

因此，系统不应只依赖生成。它应创建候选产物，然后利用更容易的验证通道定位缺陷。

### 4.2 规格-反例不对称

用户通常无法提前给出完整规格，但他们往往能在看到违反规格的候选后识别问题。候选失败会揭示隐藏需求。

这意味着审计不只是对固定规格的检查。它也是发现并修复规格的机制。

模式是：

```text
Initial weak specification
  → candidate artifact
  → counterexample or defect
  → revised specification object
  → regression guard
```

### 4.3 局部-全局不对称

LLM 往往擅长局部改进：改写、展开、补空、生成替代方案和解释。但高价值任务可能依赖全局不变量。因此，审计应寻找组合失败，而不仅是局部缺陷。

### 4.4 上下文-状态不对称

对话上下文可以包含审计结论，但不会自动使结论具有权威。审计结果只有通过显式接受规则更新受治理对象或硬状态时才具有权威。

---

## 5. 价值保存管线中的审计

结构理论把 LLM 系统行为建模为管线：

```text
S_world
  → observation
  → representation
  → state identification
  → capability routing
  → candidate support
  → aggregation
  → evaluation
  → state transition
```

审计问的是价值在这条管线中的哪里丢失。每类原始失配对应一个不同审计问题。

| 失配 | 审计问题 | 典型修复目标 |
|---|---|---|
| Observation-representation | 决定性变量是否进入操作性表征？ | 通道、工具、schema、检索、表征格式 |
| State | 相关潜在状态是否被识别或保存？ | 状态假设、区分器、澄清、分支策略 |
| Fitting-boundary | 正确能力是否在正确域内激活？ | Router、触发条件、角色绑定、抑制规则 |
| Support | 高价值结构在搜索和预算下是否可达？ | 候选扩展、控制空间搜索、稀有模式枚举 |
| Aggregation | 局部合理部分是否组合成全局价值？ | 依赖图、不变量、组合规则、全局验证器 |
| Specification | 评估器是否代表真实任务效用？ | Rubric、成功条件、代理修正、撤销规则 |

这张表是核心诊断地图。有用的审计发现不会停在“错了”。它会把错误映射到系统站点。

---

## 6. 审计发现

**审计发现** 是审计工程的原子对象。它记录局部失败，并把失败连接到证据、机制、修复和回归治理。

最小 Audit Finding schema：

```json
{
  "id": "finding.unique_identifier",
  "artifact_id": "artifact being audited",
  "finding": "localized defect statement",
  "evidence": ["specific evidence supporting the defect"],
  "mismatch_type": [
    "observation_representation | state | fitting_boundary | support | aggregation | specification | compound"
  ],
  "severity": "low | medium | high | critical",
  "repair_target": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown",
  "repair_layer": "agent | training | hybrid | unknown",
  "repair_target_role": "primary | amplifier | downstream | unknown",
  "repair_object": "gko | geo | verifier | transition_contract | state_record | regression_guard | unknown",
  "control_delta": "proposed change to governed control space",
  "regression_guard": "test or condition that should fail if the defect recurs",
  "authority": "proposed | accepted | rejected | superseded",
  "confidence": "low | medium | high",
  "revocation_trigger": "conditions under which this finding should be weakened or revoked"
}
```

强发现具有五个性质：

```text
localized: it names a specific defect, not general dissatisfaction
evidenced: it points to observable support
mechanistic: it maps to a mismatch or system station
actionable: it identifies a repair target
regressable: it yields a future guard
```

弱发现会缺少其中一个或多个性质。

---

## 7. 控制增量

**控制增量** 是由审计发现诱导的拟议系统改变。它是审计循环的写回载荷。

控制增量应回答：

```text
What object or layer should change?
What exactly should be added, removed, weakened, strengthened, or revised?
Under what conditions should the change apply?
How should conflicts be resolved?
What guard will check whether the change works?
```

最小 schema：

```json
{
  "id": "delta.unique_identifier",
  "source_finding_id": "finding that produced the delta",
  "operation": "create | update | weaken | strengthen | revoke | split | merge | reorder | escalate",
  "target_type": "GKO | GEO | verifier | representation | router | state_record | transition_contract | regression_guard",
  "target_id": "object being modified, if any",
  "proposed_change": "precise change description",
  "condition": "when this delta should apply",
  "priority": "conflict-resolution priority",
  "expected_effect": "failure mode this delta should reduce",
  "risk": "possible negative side effects",
  "acceptance_criterion": "condition for accepting the delta",
  "rollback_condition": "condition for reverting the delta"
}
```

控制增量重要，因为它防止审计沦为一次性评论。系统只有在发现成为表征、路由、搜索、规格、验证或状态中的改变时才真正改善。

---

## 8. 审计生命周期

参考生命周期是：

```text
1. Produce or receive a candidate artifact.
2. Select audit lenses based on task risk and mismatch profile.
3. Generate audit findings.
4. Ground findings in evidence and verifier hierarchy.
5. Accept, reject, merge, or escalate findings.
6. Convert accepted findings into control deltas.
7. Apply deltas to governed objects or state.
8. Create regression guards for defect families.
9. Record the defect in a ledger.
10. Regenerate or continue under the updated control space.
11. Monitor for recurrence and guard health.
```

伪代码：

```text
function AUDIT_ENGINEERING_LOOP(task, artifact, control_state):
    lenses = select_audit_lenses(task, control_state)
    proposed_findings = audit(artifact, lenses)

    accepted_findings = []
    for finding in proposed_findings:
        evidence = collect_evidence(finding, artifact, control_state)
        authority = resolve_authority(finding, evidence, control_state.verifiers)
        if authority.accepted:
            accepted_findings.append(attach_evidence(finding, evidence))

    deltas = []
    for finding in accepted_findings:
        delta = derive_control_delta(finding, control_state)
        if delta_is_safe(delta, control_state):
            deltas.append(delta)

    updated_control_state = apply_deltas(control_state, deltas)
    guards = create_regression_guards(accepted_findings, deltas)
    ledger_update = record_defects(accepted_findings, deltas, guards)

    return updated_control_state, guards, ledger_update
```

该循环可以自动化、由人类介入，或混合执行。关键性质是：被接受的失败会被写回。

---

## 9. 失配特定审计模式

每类原始失配需要不同审计风格。如果系统对所有错误都使用同一种通用批评，就会错过修复目标。

### 9.1 观测-表征审计

问题：

```text
Did the variables that determine task success enter the system's operational representation?
```

症状：

```text
The model reasons fluently over an incomplete prompt.
The answer ignores database values, raw logs, hidden files, schema details, or external state.
The same representation would be produced for value-distinct world states.
The model fills missing variables with defaults or priors.
```

审计操作：

```text
variable inventory
source coverage check
schema coverage check
retrieval miss analysis
raw-to-representation comparison
compression-loss inspection
tool-access check
```

可能发现：

```text
Critical table was absent from schema context.
Raw log contained an error code that was omitted from the summary.
Retrieved documents excluded the only source defining the term.
The representation merged two distinct user constraints into one vague phrase.
```

控制增量：

```text
add required source retrieval
change schema serialization
introduce value sampling
add raw-log inspection step
create representation completeness guard
```

回归护栏：

```text
fail if required source type is absent
fail if schema summary omits foreign-key relation
fail if raw error code is dropped during compression
fail if task-critical variable has no representation slot
```

### 9.2 状态审计

问题：

```text
Did the system identify and preserve the relevant latent state?
```

症状、操作、增量和护栏的共同形式是：枚举状态假设，检查状态证据表、分支敏感性、澄清需求和转移历史；当系统把不确定性压成单一假设、跨状态使用同一响应，或忘记已提交分支时，添加状态区分器、分支策略、澄清要求、状态记录或转移前置条件。

### 9.3 拟合边界审计

问题：

```text
Was the right capability triggered in the right domain, and were wrong capabilities suppressed?
```

典型症状包括：模型用专家式谨慎替代具体机制，过度使用熟悉模板，拒绝安全任务，应调用工具时直接回答，或在支持域外调用审计模式。

审计操作包括：

```text
capability inventory
trigger evidence analysis
boundary perturbation
near-miss comparison
over-trigger / under-trigger classification
role-binding inspection
suppression-rule audit
```

对应控制增量包括添加 router 条件、能力适用性测试、误导模板 suppressor、工具使用触发器，或把宽泛角色拆成更窄角色。护栏应在该触发未发生或错误触发复发时失败。

### 9.4 支持审计

问题：

```text
Was the high-value structure reachable under the current search procedure and budget?
```

当许多候选共享同一缺失结构、采样多样性只改变措辞、正确结构稀有或被剪枝时，应审计候选空间覆盖、稀有模式枚举、beam 多样性、控制空间搜索和剪枝决策。

修复方向包括扩展候选生成器、添加低支持模式枚举器、搜索中间结构、修改剪枝规则，以及要求“机制层多样性”而非表面措辞多样性。

### 9.5 聚合审计

问题：

```text
Do locally plausible parts compose into a globally valid artifact?
```

典型症状是每个局部部分看起来不错，但整体论证自相矛盾；每个 SQL 子句都合理但查询返回错误集合；每个代码改动都合理但补丁破坏集成；每个计划步骤可接受但依赖不可能。

审计操作：

```text
dependency graph construction
global invariant check
cross-reference check
composition consistency audit
interface compatibility check
end-to-end execution
```

修复包括添加全局不变量、引入依赖图、要求端到端验证、拆分为 plan + render，或添加组合验证器。

### 9.6 规格审计

问题：

```text
Does the accessible evaluator represent true task utility?
```

当系统优化 rubric 但错过用户真实目标，benchmark 指标奖励语义错误产物，答案满足 prompt 文字却违反隐式约束，或评估器无法区分真实价值不同的候选时，应执行代理风险分析、rubric-utility 对比、反例生成、偏好冲突检查和成功条件抽取。

修复包括修订 rubric、添加成功条件、添加负例、增加用户价值优先级或代理限制说明。

---

## 10. 失败定位

失败定位把审计工程与通用批评区分开。它问的是缺陷应在系统哪里被修复。

缺陷可能出现在最终输出中，但起源于别处。例如：

```text
Wrong SQL join
  may originate from missing foreign-key representation,
  or from low support for multi-hop joins,
  or from aggregation failure,
  or from a bad execution repair heuristic.
```

有用的定位过程区分：

```text
surface symptom: what is visibly wrong
mechanism: why the system produced it
repair target: which object or layer should change
recurrence family: what class of future failures this represents
```

### 10.1 定位阶梯

实用阶梯是：

```text
1. Output-level defect
2. Component-level defect
3. Pipeline-station defect
4. Control-object defect
5. Process defect
6. State-authority defect
```

例如：

```text
Output-level: SQL returns wrong rows.
Component-level: join path is wrong.
Pipeline-station: aggregation mismatch + representation omission.
Control-object: missing join-path constraint.
Process: schema audit was skipped.
State-authority: previous schema correction was not committed.
```

定位越低，修复越持久。

### 10.2 最小修复目标

好的审计避免过修复。它应改变最小控制层，使缺陷不复发，同时不造成更大损害。

坏修复：

```text
Tell the model: be more careful with SQL joins.
```

较好修复：

```text
Require explicit join-path enumeration when the question references columns across non-adjacent tables.
```

最好修复：

```text
Add a schema-conditioned join-path GKO with evidence, applicability condition, priority, and regression guard.
```

---

## 11. 回归治理

没有复发检测，修复是不完整的。回归治理把局部失败转换为持久护栏。

### 11.1 回归护栏

**回归护栏** 是当某个缺陷家族复发时应失败的检查。

最小 schema：

```json
{
  "id": "guard.unique_identifier",
  "source_finding_id": "finding that motivated the guard",
  "defect_family": "class of failures guarded against",
  "guard_type": "unit | integration | execution | semantic | invariant | metamorphic | human_review | state_transition",
  "procedure": "how to run the guard",
  "failure_condition": "what makes the guard fail",
  "representative_case": "minimal case that should trigger the guard if broken",
  "authority_level": "advisory | blocking | escalating | committing",
  "coverage_scope": "where the guard applies",
  "known_limitations": "what this guard does not catch"
}
```

### 11.2 有牙齿的护栏

只有当重新引入代表性缺陷会使护栏失败时，回归护栏才有牙齿。

```text
If the guard stays green when the defect is injected,
then the guard does not protect against that defect.
```

该原则防止回归剧场。护栏不应只是让系统显得自律。它必须连接到具体复发条件。

### 11.3 护栏类型

| 护栏类型 | 示例 |
|---|---|
| Unit guard | 某个转换必须保存变量。 |
| Integration guard | 生成产物必须跨组件工作。 |
| Execution guard | SQL 或代码必须成功运行。 |
| Semantic guard | 输出必须满足语义条件。 |
| Invariant guard | 全局约束必须始终成立。 |
| Metamorphic guard | 相关输入应产生相关输出。 |
| Representation guard | 必需变量必须出现在结构化表征中。 |
| Routing guard | 特定证据下必须触发所需能力。 |
| State-transition guard | 行动只有在验证器条件满足时才能提交。 |
| Human-review guard | 某些发现提交前需要专家批准。 |

### 11.4 护栏粒度

护栏可能太弱，也可能太宽。

太弱：

```text
Check that the final answer mentions joins.
```

太宽：

```text
Reject all queries with more than one join.
```

适当：

```text
For schema graphs where referenced columns lie on non-adjacent tables, require the generated SQL join path to correspond to a valid path in the foreign-key graph.
```

适当护栏应追踪缺陷家族，而不禁止有效变化。

---

## 12. 缺陷账本

**缺陷账本** 记录失败家族及其治理历史，防止系统每次都把复发缺陷当成新问题。

最小 defect ledger entry：

```json
{
  "id": "defect_family.unique_identifier",
  "name": "short defect family name",
  "description": "what recurs",
  "first_seen": "timestamp or version",
  "representative_findings": ["finding ids"],
  "mismatch_profile": ["mismatch types"],
  "control_deltas": ["delta ids"],
  "regression_guards": ["guard ids"],
  "status": "open | mitigated | guarded | recurring | revoked | accepted_risk",
  "recurrence_count": 0,
  "last_seen": "timestamp or version",
  "owner": "system | human | team | component",
  "notes": "additional context"
}
```

账本支持：

```text
detect recurrence
merge duplicate findings
track repair effectiveness
identify stale guards
escalate unresolved defect families
record accepted risk
support postmortems
```

账本应区分一次性错误与缺陷家族。审计工程在失败代表未来风险家族时最有价值。

---

## 13. 验证器权威与验证器完整性

审计需要权威层级。不是每个评估器都有同等权威。

典型层级是：

```text
formal proof / type system / deterministic checker
execution result
database or tool output
committed state record
human expert decision
task-specific rubric
LLM audit judgment
LLM self-confidence
```

具体层级取决于任务。重要规则是层级必须显式。

### 13.1 验证器对象

验证器对象应说明：

```json
{
  "id": "verifier.unique_identifier",
  "verifier_type": "execution | static_check | semantic | human | LLM | hybrid",
  "authority_level": "advisory | blocking | committing",
  "input_contract": "what the verifier consumes",
  "output_contract": "what the verifier returns",
  "scope": "where the verifier applies",
  "known_failure_modes": ["how this verifier can be wrong"],
  "override_policy": "who or what can override it",
  "audit_policy": "how the verifier itself is audited"
}
```

### 13.2 验证器污染

验证器污染发生在系统围绕弱或被污染的验证器优化时。例子：

```text
The model learns to satisfy rubric keywords without satisfying task value.
A SQL query passes execution but returns semantically wrong rows.
A code patch passes narrow tests but violates untested requirements.
An LLM judge rewards confident explanations.
```

验证器完整性要求：

```text
scope limits
known failure modes
cross-verification
counterexample tests
guard health checks
human escalation when authority is insufficient
```

### 13.3 LLM 审计器

LLM 可以是有用审计器，尤其适合发现不一致、缺失假设、弱规格和可能失败模式。但除非任务明确授予它最终权威，否则不应把 LLM 审计器当作最终权威。

安全模式是：

```text
LLM proposes finding.
Evidence grounds finding.
Verifier hierarchy accepts or rejects finding.
Control delta is applied only after acceptance.
```

---

## 14. 审计模式

### 14.1 最小对审计

构造或识别两个案例，它们只在疑似失败条件上不同。如果系统在应当表现不同的情况下表现相同，审计就定位了系统未能保存的区分。

适用于：

```text
observation-representation
state
fitting-boundary
specification
```

### 14.2 边界扰动审计

扰动能力适用边界附近的触发证据，检查能力是否在正确区域开启和关闭。适用于拟合边界失配。

### 14.3 控制空间覆盖审计

检查候选集合是否覆盖所需结构家族，而不仅是不同措辞。适用于支持失配。

### 14.4 全局不变量审计

检查局部组件是否满足共同全局不变量。适用于聚合失配。

### 14.5 代理反例审计

寻找在代理下得分高但真实效用差的候选，或反之。适用于规格失配。

### 14.6 状态提交审计

检查系统是否只有在有效转移后才改变权威状态。适用于 SGAR 集成。

---

## 15. 反模式

审计工程也必须审计自身。最常见失败模式如下。

### 15.1 只打分审计

系统给分，但没有局部发现或修复目标。

修复：要求阈值以上的分数差异必须引用证据和失配类型。

### 15.2 模糊批评

审计产生无法转换成增量的高层批评。

修复：拒绝没有局部证据和修复目标的发现。

### 15.3 审计剧场

系统执行审计步骤以显得严谨，但发现不影响未来行为。

修复：要求被接受的高严重度发现产生增量、护栏、撤销或显式 accepted-risk 记录。

### 15.4 回归剧场

系统创建测试或护栏，但代表性缺陷复发时它们不会失败。

修复：通过注入代表性缺陷来证明护栏有牙齿。

### 15.5 局部补丁覆盖

系统修复了具体输出，却没有修复缺陷家族。

修复：关闭高严重度发现前，要求缺陷家族分类。

### 15.6 代理过拟合

系统优化审计 rubric，而不是任务效用。

修复：维护 rubric 满足与任务成功分离的反例。

### 15.7 验证器污染

弱验证器成为优化目标。

修复：审计验证器作用域，添加交叉检查，记录已知失败模式。

### 15.8 过时护栏

任务分布或对象语义变化后，护栏仍然 active。

修复：给护栏生命周期、作用域和撤销触发器。

### 15.9 过度治理

审计系统引入的复杂性、延迟或脆弱性超过任务所需。

修复：使用风险分层审计强度和显式成本收益阈值。

---

## 16. 与知识治理的集成

审计工程写入知识治理。一个发现可能产生或修改 GKO。

例子：

```text
finding: model omitted source uncertainty
control delta: add uncertainty-reporting GKO

finding: value normalization failed in SQL predicate
control delta: add value-normalization GKO

finding: safety refusal over-triggered
control delta: add routing-boundary GKO

finding: rubric rewarded verbosity over decision utility
control delta: revise success-condition GKO
```

由审计创建的 GKO 应包含：

```text
source finding
evidence
condition
assertion
priority
strength
revocation trigger
regression guard link
```

这创建了可追溯性：

```text
Why does this control rule exist?
Because finding F exposed defect family D, delta Δ repaired it, and guard G protects it.
```

没有这条轨迹，受治理知识会变成无法解释的 prompt 堆积。

---

## 17. 与 SGAR 的集成

审计工程也与状态治理型 Agent 体制集成。

审计结果不应自动改变硬状态。它必须通过转移契约。

示例转移：

```text
S: current task state
A: propose accepting audit finding F and applying delta Δ
O: evidence package E and verifier result V
V: acceptance criterion checks evidence, authority, risk, and conflicts
S': updated state with F accepted, Δ applied, guard G registered
```

状态原则是：

```text
An audit conclusion becomes authoritative only when committed.
```

这防止若干失败：

```text
the model says a defect was fixed, but no guard exists
the model remembers a rule, but state does not contain it
a rejected finding continues to influence later behavior
a revoked GKO remains in prompt context
a task is marked complete without verifier-backed transition
```

因此，审计发现、增量、护栏和账本更新应具有状态字段：

```text
proposed
accepted
applied
rejected
superseded
revoked
committed
rolled_back
```

---

## 18. 风险分层审计强度

不是每个任务都值得重审计。审计工程应有选择地应用。

简单规则是：

```text
Audit intensity should increase with:
  value at stake
  probability of hidden failure
  difficulty of local detection
  recurrence likelihood
  cost of recurrence
  availability of reliable verification
  need for persistent state
```

风险层级：

| 层级 | 审计强度 | 示例 |
|---|---|---|
| Tier 0 | 无正式审计 | 低风险改写、头脑风暴 |
| Tier 1 | 轻量批评 | 普通草稿、摘要 |
| Tier 2 | 结构化发现 | 可复用输出、中等风险 |
| Tier 3 | 发现 + 增量 + 护栏 | 代码、SQL、操作建议 |
| Tier 4 | 完整治理 + 状态提交 | 长程 agent、高成本决策 |

过度审计会通过延迟、脆弱规则、误报和治理债伤害系统。审计层本身也应受成本收益规则治理。

---

## 19. 参考示例：Text-to-SQL

考虑一个 text-to-SQL 任务：

```text
Question: Which departments have employees who joined after 2020 and have no completed training records?
```

候选 SQL 直接把 `departments` join 到 `training_records`，遗漏 `employees` 表。查询可执行但返回错误结果。

### 19.1 弱批评

```text
The SQL may have an incorrect join and should be checked.
```

这不够。

### 19.2 审计发现

```json
{
  "id": "finding.sql.join_path.omitted_employee",
  "artifact_id": "candidate_sql_017",
  "finding": "The query joins departments to training_records without passing through employees, so employee-level join conditions are lost.",
  "evidence": [
    "Schema graph: departments.id → employees.department_id → training_records.employee_id",
    "No foreign key exists from departments to training_records",
    "Question predicate 'employees who joined after 2020' requires employees.join_date"
  ],
  "mismatch_type": ["aggregation", "observation_representation"],
  "severity": "high",
  "repair_target": "capability_routing",
  "repair_layer": "agent",
  "repair_target_role": "primary",
  "repair_object": "gko",
  "control_delta": "Create join-path constraint requiring schema-graph path coverage for all question-bound entities.",
  "regression_guard": "For questions binding departments, employees, and training_records, fail if generated SQL lacks employees in the join path.",
  "authority": "accepted",
  "confidence": "high"
}
```

### 19.3 控制增量

```json
{
  "id": "delta.sql.join_path.schema_graph_coverage",
  "source_finding_id": "finding.sql.join_path.omitted_employee",
  "operation": "create",
  "target_type": "GKO",
  "proposed_change": "Add schema-graph coverage rule: every entity or column bound from the natural-language question must be connected through a valid foreign-key path in the rendered SQL.",
  "condition": "Applies to multi-table SQL generation tasks with explicit schema graph available.",
  "priority": "high",
  "expected_effect": "Reduce invalid or semantically incomplete join paths.",
  "risk": "May overconstrain queries when denormalized shortcut tables are semantically valid.",
  "acceptance_criterion": "Rule passes representative multi-hop join cases and allows documented shortcut tables.",
  "rollback_condition": "Revoke or weaken if it rejects semantically valid denormalized queries."
}
```

### 19.4 回归护栏

```text
Guard: For each generated SQL query, extract question-bound schema entities and verify that the SQL join graph covers a valid schema path connecting them.
Failure condition: any bound entity is absent or connected through an invalid edge unless a documented shortcut relation exists.
```

重点是，系统不只是修正了一个查询。它学到了一个带证据、作用域、风险和护栏的 join-path 治理规则。

---

## 20. 参考示例：代码修复

模型生成一个补丁，修复了失败测试，却引入隐藏状态突变。

### 20.1 审计发现

```json
{
  "id": "finding.code.hidden_state_mutation",
  "artifact_id": "patch_042",
  "finding": "The patch fixes the visible failing test by mutating shared global state, causing order-dependent behavior in later tests.",
  "evidence": [
    "Test A passes when run alone but fails when run after Test B",
    "Patch adds write to module-level cache without reset",
    "Existing design expects request-local cache isolation"
  ],
  "mismatch_type": ["aggregation", "specification"],
  "severity": "critical",
  "repair_target": "search_execution",
  "repair_layer": "agent",
  "repair_target_role": "downstream",
  "repair_object": "regression_guard",
  "control_delta": "Add order-randomized test guard and state-isolation invariant.",
  "regression_guard": "Run affected test suite under randomized order and fail on global cache mutation outside allowed lifecycle.",
  "authority": "accepted",
  "confidence": "high"
}
```

### 20.2 控制教训

该缺陷不只是某一行代码不好。它揭示了一个未说明的不变量：

```text
Request-local state must not be stored in module-level mutable objects.
```

因此，持久修复应是 GKO 或代码不变量护栏，而不仅是补丁编辑。

---

## 21. 审计关闭标准

发现不应仅因即时产物被修订就关闭。关闭应满足以下之一：

```text
1. The finding was rejected with evidence.
2. The defect was accepted as low-risk or out-of-scope.
3. A control delta was applied.
4. A regression guard was created or updated.
5. A state transition committed the repair.
6. A revocation or weakening action was recorded.
7. The finding was merged into an existing defect family.
```

对高严重度发现，关闭通常应要求：

```text
accepted finding
+ applied delta
+ guard
+ ledger update
+ committed state
```

这防止过早关闭。

---

## 22. 审计之审计

审计系统本身也应被审计。审计过程可能变得过时、表演化、过宽或失配。

审计之审计问题：

```text
Are findings localized enough to produce deltas?
Do accepted findings actually change future behavior?
Do guards fail when representative defects are injected?
Are auditors overfitting to proxy rubrics?
Are verifier authority levels correct?
Are stale guards being revoked?
Are recurring defects decreasing, stable, or increasing?
Are human escalations meaningful or rubber-stamped?
```

审计规则本身也应有作用域和撤销条件。

示例：

```json
{
  "id": "gko.audit.requires_regression_guard_for_high_severity",
  "type": "audit_policy",
  "condition": "Accepted audit finding has severity high or critical",
  "assertion": "The finding cannot be closed without a regression guard or explicit accepted-risk record.",
  "strength": "hard",
  "revocation_trigger": "If guard creation creates more false-blocking cost than recurrence risk for this task class, weaken to human-review requirement.",
  "not_supported_claims": "Does not require automated guards where no reliable verifier exists."
}
```

---

## 23. 与形式传统的关系

审计工程与若干既有传统相关，但它被适配到开放式 LLM 系统中。

### 23.1 反例引导归纳合成

该循环类似 CEGIS：

```text
candidate → counterexample → refinement
```

区别在于，LLM 任务往往缺少完整形式规格。审计工程可能修订候选、搜索空间、规格、表征、router 或验证器。

### 23.2 突变测试

有牙齿的回归护栏与突变测试平行。测试只有在能检测代表性注入缺陷时才有意义。审计工程把这一思想从程序测试推广到 LLM 任务失败和受治理控制对象。

### 23.3 真值维护与信念修订

审计发现可以创建、修订或撤销受治理知识。这类似真值维护系统，但作用对象是任务特定控制知识，而不是一般信念。

### 23.4 事故响应与复盘

缺陷账本类似事故管理。区别在于，LLM 审计发现常常指向表征、规格、路由和控制空间对象，而不只是代码或基础设施。

---

## 24. 最小可行审计工程

最小实现不需要完整规范中的每个对象。它需要五项承诺：

```text
1. Findings must be localized.
2. Findings must cite evidence.
3. Findings must name a repair target.
4. Accepted findings must produce a control delta or accepted-risk record.
5. Serious recurring defects must have regression guards.
```

最小发现格式：

```text
Finding:
Evidence:
Mismatch:
Repair target:
Control delta:
Regression guard:
```

这个轻量格式通常已经足以把批评转化为工程。

---

## 25. 结论

LLM 系统不会仅仅因为增加批评就变得可靠。它们在批评变成审计、审计变成发现、发现变成控制增量、控制增量变成受治理对象，并且受治理对象通过护栏和状态转移变成未来行为时，才会更可靠。

审计工程管理这种转换。它利用一个事实：识别具体缺陷常常比生成卓越产物更容易；从反例修复规格常常比提前写完整规格更容易。

核心不变量是：

```text
No serious failure should end as a mere comment.
```

严重失败应成为以下之一：

```text
control delta
regression guard
GKO update
verifier update
state correction
revocation
accepted-risk record
defect-ledger entry
```

在受治理 LLM 系统中，失败不只是错误。它是持久控制知识的主要来源之一。

---

## 附录 A：紧凑 Schema

### A.1 Audit Finding

```json
{
  "id": "finding.unique_identifier",
  "artifact_id": "artifact being audited",
  "finding": "localized defect statement",
  "evidence": ["specific evidence"],
  "mismatch_type": ["observation_representation | state | fitting_boundary | support | aggregation | specification | compound"],
  "severity": "low | medium | high | critical",
  "repair_target": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown",
  "repair_layer": "agent | training | hybrid | unknown",
  "repair_target_role": "primary | amplifier | downstream | unknown",
  "repair_object": "gko | geo | verifier | transition_contract | state_record | regression_guard | unknown",
  "control_delta": "proposed change",
  "regression_guard": "future recurrence check",
  "authority": "proposed | accepted | rejected | superseded",
  "confidence": "low | medium | high",
  "revocation_trigger": "conditions for weakening or revoking"
}
```

### A.2 Control Delta

```json
{
  "id": "delta.unique_identifier",
  "source_finding_id": "finding id",
  "operation": "create | update | weaken | strengthen | revoke | split | merge | reorder | escalate",
  "target_type": "GKO | GEO | verifier | representation | router | state_record | transition_contract | regression_guard",
  "target_id": "optional target object",
  "proposed_change": "precise change",
  "condition": "when delta applies",
  "priority": "priority level",
  "expected_effect": "failure reduction expected",
  "risk": "possible negative effects",
  "acceptance_criterion": "when to accept",
  "rollback_condition": "when to revert"
}
```

### A.3 Regression Guard

```json
{
  "id": "guard.unique_identifier",
  "source_finding_id": "finding id",
  "defect_family": "class of failures guarded against",
  "guard_type": "unit | integration | execution | semantic | invariant | metamorphic | human_review | state_transition",
  "procedure": "how guard is run",
  "failure_condition": "what makes guard fail",
  "representative_case": "case that should fail when defect recurs",
  "authority_level": "advisory | blocking | escalating | committing",
  "coverage_scope": "where guard applies",
  "known_limitations": "what guard does not catch"
}
```

### A.4 Defect Ledger Entry

```json
{
  "id": "defect_family.unique_identifier",
  "name": "short defect name",
  "description": "recurring failure description",
  "first_seen": "timestamp or version",
  "representative_findings": ["finding ids"],
  "mismatch_profile": ["mismatch types"],
  "control_deltas": ["delta ids"],
  "regression_guards": ["guard ids"],
  "status": "open | mitigated | guarded | recurring | revoked | accepted_risk",
  "recurrence_count": 0,
  "last_seen": "timestamp or version",
  "owner": "system | human | team | component",
  "notes": "additional context"
}
```

---

## 附录 B：审计 Checklist

对任何严重候选产物，询问：

```text
1. What exactly failed?
2. What evidence supports the finding?
3. Which primitive mismatch or compound mismatch is involved?
4. Which pipeline station should be repaired?
5. Is the defect a one-off or a family?
6. What control object should change?
7. What regression guard would fail if the defect recurs?
8. What verifier has authority over this finding?
9. Does the repair require state commitment?
10. What are the risks of the control delta?
11. What are the revocation conditions?
12. Has the defect ledger been updated?
```

---

## 附录 C：严重度指南

| 严重度 | 含义 | 典型要求 |
|---|---|---|
| Low | 局部缺陷，低复发或低成本 | 评论或轻量增量 |
| Medium | 有意义的质量问题或中等复发风险 | 发现 + 可能的增量 |
| High | 任务价值失败或可能复发 | 发现 + 增量 + 护栏 |
| Critical | 昂贵、不安全、不可逆或污染状态的失败 | 发现 + 增量 + 护栏 + 状态提交 + 升级 |

---

## 附录 D：关闭状态

| 状态 | 含义 |
|---|---|
| proposed | 发现或增量已生成但尚未接受。 |
| accepted | 证据和权威足够。 |
| rejected | 发现或增量未被支持。 |
| applied | 控制增量已经修改目标对象。 |
| guarded | 已存在回归护栏。 |
| committed | 状态转移已使改变具有权威。 |
| superseded | 被更好的发现、增量或护栏替代。 |
| revoked | 被后续证据移除或失效。 |
| accepted_risk | 已知问题在声明条件下被有意保留。 |
