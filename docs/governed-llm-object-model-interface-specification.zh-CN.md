# 受治理 LLM 对象模型与接口规范

**工作稿 v0.1**  
**《LLM 系统中价值保存的结构理论》的配套规范**  

---

## 摘要

本文定义一个用于受治理 LLM 系统的统一对象模型。它是《LLM 系统中价值保存的结构理论》的实现侧配套规范。该结构理论识别了六类原始失配：观测-表征失配、状态失配、拟合边界失配、支持失配、聚合失配和规格失配，并主张高价值 LLM 系统需要在观测、表征、能力路由、候选支持、聚合、评估、审计和状态转移之间保存任务价值。

本规范定义把该理论落到系统实现所需的对象和接口。它把 **受治理知识对象**（GKO）、**受治理执行对象**（GEO）、**审计发现**、**控制增量**、**回归护栏**、**缺陷账本**、**状态记录**、**转移契约**、**验证器对象** 和 **证据对象** 统一到一个生命周期中。核心流是：

```text
Candidate Artifact
  → Audit Finding
  → Control Delta
  → GKO / GEO / Verifier / State Update
  → Regression Guard
  → Defect Ledger
  → Hard State Commitment
  → Future Routing / Search / Rendering / Revocation
```

目标不是规定唯一的软件架构，而是定义稳定的对象契约和接口语义，使 LLM 系统能够外化任务特定控制知识、定位失败、把修复写回控制空间、防止回归，并且只通过可验证状态转移提交进展。

---

## 1. 目的与范围

本规范定义一种通用对象语言，面向需要超越一次性生成的 LLM 系统。它适用于输出、决策或行动必须由显式控制知识、审计轨迹、验证条件和状态提交来治理的系统。

目标系统包括：

```text
retrieval-augmented generation systems
code generation and repair systems
text-to-SQL systems
long-horizon agents
research agents
workflow agents
tool-using assistants
data analysis assistants
human-AI collaboration systems
high-stakes review and audit systems
```

本规范有意独立于具体模型、框架、数据库、向量库、提示格式、编排库或编程语言。它定义对象语义，而不是实现机制。

核心设计问题是：

> LLM 系统如何在多次生成、审计、工具调用、修订、状态变化和失败之间保存任务价值，而不把上下文叙事当成唯一权威来源？

本文提出的答案是一个对象系统。任务相关知识、失败、修复、护栏和状态转移必须成为具有作用域、证据、状态、生命周期和撤销条件的显式对象。

---

## 2. 设计原则

### 2.1 外化控制知识

只嵌在 prompt 中的指令是脆弱的。它们难以审计、修订、削弱、撤销、排序或复用。受治理系统应把持久控制知识外化为显式对象。

控制知识包括：

```text
constraints
rubrics
routing rules
state hypotheses
schema bindings
dependency rules
success conditions
failure patterns
transformation rules
verification policies
revocation conditions
```

### 2.2 区分最终渲染与控制空间

最终产物不是唯一有意义的对象。在许多高价值任务中，决定性工作发生在中间结构中：schema graph、join path、状态矩阵、rubric、问题列表、依赖图、失败分类、测试用例或转移记录。

受治理系统应区分：

```text
control objects: govern the task
rendered artifacts: presented to the user or environment
state objects: determine what the system treats as committed reality
```

### 2.3 把审计当作写回，而不是打分

分数可以排序候选，但未必改善系统。审计只有在定位缺陷、识别失配类型、提出控制增量并产生回归护栏时才真正有用。

基本审计不变量是：

```text
No serious failure should end as a mere comment.
A serious failure should become a control delta, a guard, a revocation, or a state correction.
```

### 2.4 让作用域与撤销成为一等对象

受治理对象不应是不朽的。它应说明何时适用、支持什么、不支持什么，以及何时应被削弱、修订、取代或撤销。

没有作用域的 GKO 只是 prompt 片段。没有撤销条件的 GKO 可能成为过时权威。

### 2.5 区分叙事上下文与状态权威

模型上下文可以描述进展，但它本身不能提交进展。系统只有在发生授权状态转移时才真正前进。

状态原则是：

```text
Context may narrate state.
Only committed state records authorize state.
```

### 2.6 验证器权威优先于模型信心

当可信机械验证器或外部验证器存在时，它应优先于流畅的模型自信。LLM 解释可以帮助诊断或修复失败，但不应覆盖权威观测。

### 2.7 保存局部对齐，治理全局组合

LLM 往往有很强的局部能力：压缩、改写、候选生成、解释、分解、表面渲染和边缘案例枚举。对象模型应保存这些优势，同时治理局部质量无法组合成全局任务价值的地方。

---

## 3. 架构层

受治理 LLM 系统可以组织成七层：

```text
Diagnostic Layer
  Six primitive mismatches and compound mismatch patterns

Regime Layer
  Mediocrity / local alignment / positive probability-value alignment

Transformation Layer
  Mediocrity-to-Extraordinary Transformation

Knowledge Layer
  Governed Knowledge Objects and decoupled control spaces

Audit Layer
  Audit Findings, Control Deltas, Regression Guards, Defect Ledgers

Runtime Layer
  State Records, Transition Contracts, Verifier Objects, hard-state commitment

Collaboration Layer
  Governed Execution Objects and human-AI coordination records
```

这些层不是分离产品，而是同一生命周期中的角色。诊断层识别的失败应能产生审计发现；审计发现应产生控制增量；控制增量可能更新 GKO、GEO、验证器、护栏或状态记录；经验证的更新可以成为已提交的状态转移。

---

## 4. 规范对象生命周期

规范生命周期是：

```text
1. Artifact is produced.
2. Artifact is audited.
3. Audit produces one or more findings.
4. Findings are localized to mismatch types and repair targets.
5. Each repair target produces a control delta.
6. Control delta updates governed objects.
7. A regression guard is created or updated.
8. The defect ledger records the failure family and repair.
9. A verifier determines whether state should be committed.
10. Future routing, search, rendering, and audit use the updated governed state.
```

对象形式为：

```text
Artifact
  → AuditFinding
  → ControlDelta
  → {GKO | GEO | VerifierObject | StateRecord | TransitionContract}
  → RegressionGuard
  → DefectLedgerEntry
  → StateTransition
```

每个任务不必使用所有对象。低风险任务可以只使用子集。高价值或长程任务应保存从发现到状态提交的链条。

---

## 5. 通用对象封套

所有受治理对象共享一个通用封套。字段名保持英文，以保证对象可被程序稳定解析。

```json
{
  "id": "object.unique_identifier",
  "object_kind": "gko | geo | audit_finding | control_delta | regression_guard | defect_ledger_entry | state_record | transition_contract | verifier | evidence",
  "version": "0.1.0",
  "status": "draft | proposed | active | suspended | superseded | deprecated | revoked | archived",
  "created_at": "ISO-8601 timestamp or logical clock",
  "updated_at": "ISO-8601 timestamp or logical clock",
  "created_by": "human | model | tool | system | hybrid",
  "source": "origin of the object",
  "scope": "where this object applies",
  "support_scope": "claims or situations this object supports",
  "not_supported_claims": "claims this object does not license",
  "evidence_refs": ["evidence.id"],
  "depends_on": ["object.id"],
  "conflicts_with": ["object.id"],
  "supersedes": ["object.id"],
  "superseded_by": ["object.id"],
  "revocation_trigger": "conditions for revocation or weakening",
  "audit_trail": ["event.id"]
}
```

### 5.1 标识符要求

标识符应在系统边界内稳定且全局唯一。

推荐模式：

```text
<object_kind>.<domain>.<short_semantic_name>.<version_or_hash>
```

示例：

```text
gko.text2sql.join_path_requires_fk.v1
finding.bird.empty_result_overconstrained_predicate.2026_06_27_001
delta.router.enable_schema_audit_for_ambiguous_columns.v1
guard.text2sql.no_empty_result_without_predicate_audit.v1
state.project.current_schema_graph.commit_000042
```

### 5.2 状态语义

| 状态 | 含义 |
|---|---|
| draft | 对象存在，但没有治理权威。 |
| proposed | 对象是等待激活的候选。 |
| active | 对象当前治理行为或状态。 |
| suspended | 对象在等待审查期间被临时禁用。 |
| superseded | 对象被更新对象替代。 |
| deprecated | 为历史保留，但不推荐继续使用。 |
| revoked | 因矛盾、作用域失败或无效证据而撤回。 |
| archived | 历史对象，不再参与活跃治理。 |

对象不应静默消失。撤销和取代应是显式事件。

---

## 6. 受治理知识对象

**受治理知识对象** 是带作用域、有证据、可撤销的任务特定控制知识单元。

GKO 是知识层核心对象。它们不只是事实。它们可以治理路由、搜索、验证、渲染、状态解释或审计。

### 6.1 GKO 类型

推荐 `gko_type` 值：

```text
constraint
invariant
rubric
success_condition
routing_rule
state_hypothesis
state_discriminator
schema_binding
value_binding
dependency_rule
composition_rule
source_prior
transformation_rule
diagnostic_test
verification_policy
revocation_rule
rendering_rule
```

### 6.2 GKO Schema

```json
{
  "id": "gko.unique_identifier",
  "object_kind": "gko",
  "version": "0.1.0",
  "status": "draft | proposed | active | suspended | superseded | deprecated | revoked | archived",
  "gko_type": "constraint | invariant | rubric | success_condition | routing_rule | state_hypothesis | state_discriminator | schema_binding | value_binding | dependency_rule | composition_rule | source_prior | transformation_rule | diagnostic_test | verification_policy | revocation_rule | rendering_rule",
  "condition": "conditions under which the GKO applies",
  "assertion": "the claim, rule, constraint, or control statement",
  "strength": "hard | soft | heuristic | provisional | advisory",
  "priority": 0,
  "scope": "task, project, dataset, user, domain, session, artifact type, or state boundary",
  "support_scope": "what this GKO supports",
  "not_supported_claims": "what this GKO does not support",
  "evidence_refs": ["evidence.id"],
  "counterevidence_refs": ["evidence.id"],
  "depends_on": ["object.id"],
  "conflicts_with": ["object.id"],
  "lifespan": "single_turn | session | project | persistent | until_revoked",
  "activation_policy": "when the object should be used",
  "rendering_policy": "how the object affects prompts, outputs, tools, or search",
  "verification_policy": "how compliance or validity is checked",
  "revocation_trigger": "conditions under which the GKO should be weakened or revoked",
  "downgrade_trigger": "conditions under which strength should be reduced",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "created_by": "human | model | tool | system | hybrid",
  "source": "origin of the object",
  "audit_trail": ["event.id"]
}
```

### 6.3 GKO 示例：Text-to-SQL Join Path 约束

该示例要求多表 SQL 的 join path 必须由外键、已验证 schema 关系或记录为证据的值分布匹配支持。完整英文规范示例保留在英文版；中文实现应保持相同字段结构与对象 ID 风格。

### 6.4 GKO 不变量

有效的 active GKO 必须包含：

```text
condition
assertion
scope
support_scope
strength
revocation_trigger
```

hard GKO 还必须包含：

```text
verification_policy
evidence_refs or authoritative source
conflict-resolution priority
```

persistent GKO 必须包含：

```text
lifespan
revocation_trigger
audit trail
```

---

## 7. 受治理执行对象

**受治理执行对象** 表示必须被跟踪和治理的任务、计划、行动、协作单元或工作流项。

GKO 治理知识，GEO 治理执行。

### 7.1 GEO 类型

推荐 `geo_type` 值：

```text
task
subtask
plan
action
handoff
review_request
tool_call
human_decision
workflow_stage
collaboration_contract
artifact_request
```

### 7.2 GEO Schema

```json
{
  "id": "geo.unique_identifier",
  "object_kind": "geo",
  "version": "0.1.0",
  "status": "draft | proposed | active | blocked | completed | failed | revoked | archived",
  "geo_type": "task | subtask | plan | action | handoff | review_request | tool_call | human_decision | workflow_stage | collaboration_contract | artifact_request",
  "objective": "what this execution object is intended to accomplish",
  "inputs": ["object.id or artifact reference"],
  "outputs_expected": ["expected artifacts or state changes"],
  "success_condition": "condition under which execution counts as successful",
  "failure_condition": "condition under which execution counts as failed",
  "assigned_actor": "human | model | tool | system | hybrid",
  "allowed_actions": ["action identifiers"],
  "forbidden_actions": ["action identifiers"],
  "required_gkos": ["gko.id"],
  "required_verifiers": ["verifier.id"],
  "transition_contract_ref": "transition_contract.id",
  "state_precondition": "required state before execution",
  "state_postcondition": "state to commit if verified",
  "revocation_trigger": "conditions under which this execution object should be revoked",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "audit_trail": ["event.id"]
}
```

### 7.3 GEO 示例：Text-to-SQL 候选修复

该示例把“SQL 可执行但意外返回空结果”的修复建模为一个 subtask。它限制可用动作，禁止无语义依据地删除全部过滤条件，并要求执行验证器和语义审计通过后才能提交状态。

---

## 8. 证据对象

**证据对象** 记录支持或反驳受治理对象的观测、工具输出、人类判断、执行结果、文档、测量或推导。

证据应可寻址。受治理对象应引用证据 ID，而不是把所有证据直接嵌入对象。

### 8.1 证据类型

推荐 `evidence_type` 值：

```text
observation
tool_output
execution_result
human_judgment
model_judgment
document_excerpt
database_sample
schema_metadata
test_result
counterexample
trace
log
measurement
derivation
```

### 8.2 Evidence Schema

```json
{
  "id": "evidence.unique_identifier",
  "object_kind": "evidence",
  "version": "0.1.0",
  "status": "active | disputed | superseded | revoked | archived",
  "evidence_type": "observation | tool_output | execution_result | human_judgment | model_judgment | document_excerpt | database_sample | schema_metadata | test_result | counterexample | trace | log | measurement | derivation",
  "content_ref": "pointer to content, artifact, log, or stored payload",
  "summary": "short evidence summary",
  "authority_level": "mechanical | external_source | human_expert | human_user | model | heuristic",
  "collection_method": "how the evidence was obtained",
  "scope": "where this evidence is applicable",
  "limitations": "known limits of this evidence",
  "supports": ["object.id"],
  "contradicts": ["object.id"],
  "created_at": "timestamp",
  "created_by": "human | model | tool | system | hybrid",
  "revocation_trigger": "conditions under which evidence should be invalidated"
}
```

### 8.3 证据权威顺序

证据冲突时，系统应应用领域特定的权威顺序。常见默认顺序是：

```text
mechanical verifier / execution result
  > authoritative external source
  > expert human judgment
  > user preference within user-owned scope
  > model-assisted judgment
  > heuristic inference
```

该顺序并非普遍适用，必须按领域可配置。不变量是：权威顺序应显式记录。

---

## 9. 审计发现

**审计发现** 定位产物、轨迹、状态转移或受治理对象中的缺陷。它是从失败观测到系统修复的桥梁。修正后的桥接顺序不是“失配类型 → 八类机制 → 直接修”，而是“失配类型 → 任务特定控制对象 → 机制归因 → 修复层选择”。

### 9.1 Finding Schema

```json
{
  "id": "finding.unique_identifier",
  "object_kind": "audit_finding",
  "version": "0.1.0",
  "status": "draft | proposed | confirmed | disputed | resolved | superseded | revoked | archived",
  "artifact_ref": "artifact or object being audited",
  "finding": "localized defect statement",
  "evidence_refs": ["evidence.id"],
  "mismatch_type": "observation_representation | state | fitting_boundary | support | aggregation | specification | compound | implementation | unknown",
  "severity": "low | medium | high | critical",
  "confidence": "low | medium | high | confirmed",
  "failure_mode": "short failure-mode label",
  "control_object_ref": "object.id",
  "control_object_type": "sql_dag | claim_evidence_map | character_state_machine | narrative_skeleton | rubric | router_rule | state_table | other",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "repair_layer": "agent | training | hybrid | unknown",
  "target_object_refs": ["object.id"],
  "root_cause_hypothesis": "why the failure occurred",
  "minimal_reproduction": "minimal condition or example that reproduces the defect",
  "control_delta_refs": ["delta.id"],
  "regression_guard_refs": ["guard.id"],
  "not_a_failure_if": "conditions under which this finding should be dismissed",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "created_by": "human | model | tool | system | hybrid",
  "revocation_trigger": "conditions under which the finding should be revoked"
}
```

### 9.2 失配类型语义

| 失配类型 | 审计问题 |
|---|---|
| observation_representation | 决定性变量是否未能进入表征？ |
| state | 系统是否在错误潜在状态假设下行动？ |
| fitting_boundary | 能力是否在真实域外触发，或在真实域内被抑制？ |
| support | 正确结构是否缺席，或在搜索过程下可达性过低？ |
| aggregation | 局部合理部分是否未能组合成全局价值？ |
| specification | 代理目标是否偏离真实任务效用？ |
| compound | 多种失配是否相互作用？ |
| implementation | 失败是否来自软件、工具、解析或基础设施 bug？ |
| unknown | 失败真实存在，但尚未定位？ |

### 9.3 审计发现示例

规范示例是 text-to-SQL 中的空结果查询：SQL 能执行但返回零行，因为谓词使用了数据库中不存在的表面字符串。该发现被归为 `observation_representation`，直接修复对象是 `value_binding_table`，机制归因是 `belief_representation`，修复层是 `agent`，并派生出值落地 GKO 与回归护栏。

---

## 10. 控制增量

**控制增量** 指定对受治理控制空间的局部改变。它是审计发现产生的写回对象。

发现说明哪里失败。控制增量说明必须改变什么。

### 10.1 Delta 类型

推荐 `delta_type` 值：

```text
create_object
update_object
weaken_object
strengthen_object
revoke_object
supersede_object
add_evidence
add_counterevidence
change_priority
change_scope
change_router
change_verifier
change_transition_contract
add_regression_guard
change_rendering_policy
change_search_policy
change_representation
change_observation_channel
```

### 10.2 Control Delta Schema

```json
{
  "id": "delta.unique_identifier",
  "object_kind": "control_delta",
  "version": "0.1.0",
  "status": "draft | proposed | approved | applied | rejected | rolled_back | superseded | archived",
  "delta_type": "create_object | update_object | weaken_object | strengthen_object | revoke_object | supersede_object | add_evidence | add_counterevidence | change_priority | change_scope | change_router | change_verifier | change_transition_contract | add_regression_guard | change_rendering_policy | change_search_policy | change_representation | change_observation_channel",
  "source_finding_refs": ["finding.id"],
  "target_object_ref": "object.id",
  "target_object_type": "sql_dag | claim_evidence_map | character_state_machine | narrative_skeleton | rubric | router_rule | state_table | other",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "repair_layer": "agent | training | hybrid | unknown",
  "target_object_refs": ["object.id"],
  "proposed_change": "human-readable description of the change",
  "patch": "machine-readable patch or structured update",
  "expected_effect": "what failure this change should prevent or reduce",
  "risk_assessment": "possible negative side effects",
  "required_verification": "checks required before applying or committing",
  "rollback_plan": "how to revert the change",
  "regression_guard_refs": ["guard.id"],
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "created_by": "human | model | tool | system | hybrid",
  "applied_at": "timestamp or null",
  "applied_by": "human | system | hybrid | null",
  "revocation_trigger": "conditions under which this delta should be rolled back"
}
```

### 10.3 控制增量示例

规范示例创建一个 GKO，要求在渲染 SQL 字面量谓词前，必须把字符串或分类值落地到已观测数据库值、归一化映射或显式不确定性说明上。

### 10.4 Delta 不变量

控制增量在应用前应至少具有：

```text
source finding or explicit rationale
target object or object creation patch
expected effect
risk assessment
required verification
rollback plan
```

高影响增量不应在没有回归护栏的情况下应用，除非显式说明为什么无法构造护栏。

---

## 11. 回归护栏

**回归护栏** 是一种检查：当已知缺陷家族复发时，它应当失败。

护栏可以是单元测试、执行检查、语义审计、schema 验证器、反例 prompt、人类审查 checklist、不变量检查器或状态转移验证器。

### 11.1 有牙齿护栏原则

回归护栏只有在代表性缺陷被重新引入时会失败，才真正有牙齿。

```text
If the defect returns and the guard stays green, the guard is theater.
```

### 11.2 护栏类型

推荐 `guard_type` 值：

```text
unit_test
execution_check
semantic_check
schema_check
invariant_check
counterexample_check
mutation_check
state_transition_check
routing_check
rubric_check
human_review_check
```

### 11.3 Regression Guard Schema

```json
{
  "id": "guard.unique_identifier",
  "object_kind": "regression_guard",
  "version": "0.1.0",
  "status": "draft | active | failing | passing | flaky | deprecated | revoked | archived",
  "guard_type": "unit_test | execution_check | semantic_check | schema_check | invariant_check | counterexample_check | mutation_check | state_transition_check | routing_check | rubric_check | human_review_check",
  "defect_family": "failure family this guard is meant to catch",
  "linked_findings": ["finding.id"],
  "linked_deltas": ["delta.id"],
  "failure_predicate": "condition under which the guard must fail",
  "pass_predicate": "condition under which the guard may pass",
  "representative_defect": "minimal defect instance that should make the guard fail",
  "teeth_proof": "evidence that the guard fails on the representative defect",
  "execution_method": "how the guard is run",
  "authority_level": "mechanical | human | hybrid | heuristic",
  "scope": "where this guard applies",
  "false_positive_risk": "known false-positive conditions",
  "false_negative_risk": "known false-negative conditions",
  "last_run_at": "timestamp or null",
  "last_result": "pass | fail | skipped | unknown",
  "revocation_trigger": "conditions under which this guard should be retired or revised",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "created_by": "human | model | tool | system | hybrid"
}
```

### 11.4 护栏示例

规范示例检查 text-to-SQL 中的未落地字面量谓词：当分类字符串不在样本值、归一化映射或显式 schema 证据中，且没有不确定性分支时，护栏应失败。

---

## 12. 缺陷账本

**缺陷账本** 记录失败家族、代表性实例、修复、护栏、回归和撤销。

它是系统失败的记忆。没有缺陷账本，系统会反复重新发现同一缺陷。

### 12.1 Defect Ledger Entry Schema

```json
{
  "id": "defect.unique_identifier",
  "object_kind": "defect_ledger_entry",
  "version": "0.1.0",
  "status": "open | mitigated | resolved | recurring | accepted_risk | revoked | archived",
  "defect_family": "short stable name for the failure family",
  "description": "description of the defect family",
  "mismatch_types": ["observation_representation | state | fitting_boundary | support | aggregation | specification | compound | implementation"],
  "representative_findings": ["finding.id"],
  "representative_artifacts": ["artifact.id"],
  "control_deltas": ["delta.id"],
  "regression_guards": ["guard.id"],
  "affected_objects": ["object.id"],
  "first_seen_at": "timestamp",
  "last_seen_at": "timestamp",
  "recurrence_count": 0,
  "current_mitigation": "current repair or mitigation strategy",
  "known_limitations": "what remains unresolved",
  "owner": "human | system | team | null",
  "revocation_trigger": "conditions under which this ledger entry should be retired or reclassified"
}
```

### 12.2 缺陷账本示例

规范示例记录 `ungrounded_literal_predicate` 缺陷家族：系统将自然语言表面值直接插入 SQL 谓词，而没有根据数据库值或归一化映射落地。当前缓解方法是要求谓词渲染前进行值落地，并运行分类谓词护栏。

---

## 13. 验证器对象

**验证器对象** 定义能够检查产物、对象、状态转移或护栏结果的权威。

验证器可以是机械的、人类的、模型辅助的或混合的。关键是其权威、作用域、失败模式和限制必须显式。

### 13.1 验证器类型

推荐 `verifier_type` 值：

```text
execution_engine
unit_test_runner
schema_validator
static_analyzer
semantic_checker
rubric_evaluator
human_reviewer
model_auditor
state_transition_checker
consistency_checker
external_api_checker
```

### 13.2 Verifier Schema

```json
{
  "id": "verifier.unique_identifier",
  "object_kind": "verifier",
  "version": "0.1.0",
  "status": "active | degraded | deprecated | revoked | archived",
  "verifier_type": "execution_engine | unit_test_runner | schema_validator | static_analyzer | semantic_checker | rubric_evaluator | human_reviewer | model_auditor | state_transition_checker | consistency_checker | external_api_checker",
  "scope": "what this verifier is authorized to verify",
  "input_contract": "required input format or state",
  "output_contract": "result format and semantics",
  "pass_condition": "condition under which verification passes",
  "fail_condition": "condition under which verification fails",
  "authority_level": "mechanical | external_source | human_expert | human_user | model | heuristic | hybrid",
  "limitations": "known limitations and blind spots",
  "failure_modes": "ways this verifier can be wrong or gamed",
  "dependencies": ["object.id or system dependency"],
  "revocation_trigger": "conditions under which verifier authority should be reduced or revoked",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "created_by": "human | model | tool | system | hybrid"
}
```

### 13.3 验证器示例

规范示例 `verifier.sql.execution_engine` 验证 SQL 对特定数据库实例的语法可执行性和观测结果集。它的限制是：执行成功并不证明该 SQL 在自然语言问题语义上正确。

---

## 14. 状态记录

**状态记录** 表示已提交系统状态。它只在声明作用域内具有权威。

状态记录不是摘要。它们是提交。摘要可能错误、不完整或只是修辞。状态记录应显式、可版本化且可验证。

### 14.1 状态类型

推荐 `state_type` 值：

```text
project_state
task_state
artifact_state
knowledge_state
schema_state
agent_state
workflow_state
conversation_state
verification_state
defect_state
```

### 14.2 State Record Schema

```json
{
  "id": "state.unique_identifier",
  "object_kind": "state_record",
  "version": "0.1.0",
  "status": "proposed | committed | disputed | rolled_back | superseded | archived",
  "state_type": "project_state | task_state | artifact_state | knowledge_state | schema_state | agent_state | workflow_state | conversation_state | verification_state | defect_state",
  "scope": "what part of the system this state governs",
  "state_payload": "structured state content",
  "predecessor_state_refs": ["state.id"],
  "transition_contract_ref": "transition_contract.id",
  "evidence_refs": ["evidence.id"],
  "verifier_refs": ["verifier.id"],
  "commit_record": {
    "committed_at": "timestamp",
    "committed_by": "human | system | hybrid",
    "commit_reason": "why this state was committed"
  },
  "rollback_policy": "how this state can be rolled back",
  "revocation_trigger": "conditions under which state should be disputed or rolled back",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 14.3 状态记录示例

规范示例提交一个 text-to-SQL schema graph 状态，其中包含表、外键、来源 snapshot、前序状态、转移契约、证据和验证器引用。若 snapshot 失效或外键元数据不完整，该状态应被争议或回滚。

---

## 15. 转移契约

**转移契约** 定义行动何时可以改变已提交状态。

基本形式是：

```text
S + A → O → V → S'
```

其中：

```text
S  = current committed state
A  = proposed action
O  = observed outcome
V  = verifier or commitment criterion
S' = next committed state
```

### 15.1 Transition Contract Schema

```json
{
  "id": "contract.unique_identifier",
  "object_kind": "transition_contract",
  "version": "0.1.0",
  "status": "draft | active | suspended | deprecated | revoked | archived",
  "contract_type": "state_update | artifact_commit | task_completion | verifier_update | gko_update | rollback | handoff | external_action",
  "scope": "where this transition contract applies",
  "precondition": "required state before action",
  "action_schema": "allowed action structure",
  "observation_schema": "required observation structure",
  "verifier_refs": ["verifier.id"],
  "commit_condition": "condition under which S' may be committed",
  "reject_condition": "condition under which transition must be rejected",
  "rollback_condition": "condition under which committed transition may be rolled back",
  "state_update_rule": "how S' is derived from S, A, O, and V",
  "audit_requirement": "required audit before or after commit",
  "authority_policy": "who or what may commit the transition",
  "revocation_trigger": "conditions under which the contract should be revoked",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "created_by": "human | model | tool | system | hybrid"
}
```

### 15.2 转移契约示例

规范示例 `contract.text2sql.sql_repair_commit.v1` 要求 SQL 执行通过、语义审计通过、相关回归护栏通过且不违反 hard GKO 后，才能把候选状态提交为 `repaired_and_verified`。

### 15.3 转移不变量

已提交状态转移必须包含：

```text
precondition
action record
observation record
verifier or commitment criterion
commit record
rollback policy
```

关键转移不得仅凭模型断言提交。

---

## 16. 能力路由规则

**能力路由规则** 可以表示为 GKO 子类型，但由于拟合边界失配是原始失配类型，它重要到值得单独规范。

该规则治理能力何时应激活或被抑制。

### 16.1 Routing Rule Schema

```json
{
  "id": "gko.routing.unique_identifier",
  "object_kind": "gko",
  "gko_type": "routing_rule",
  "status": "active",
  "capability": "capability or strategy name",
  "activation_condition": "when the capability should activate",
  "suppression_condition": "when the capability should be suppressed",
  "true_applicability_domain": "T_X: where the capability is actually appropriate",
  "observed_activation_domain": "M_X: where the system has been observed to activate it",
  "overtrigger_risk": "known conditions for M_X \\ T_X",
  "undertrigger_risk": "known conditions for T_X \\ M_X",
  "trigger_evidence": "evidence used to activate the capability",
  "boundary_tests": ["guard.id or diagnostic test"],
  "fallback_capability": "what to do if the capability is suppressed",
  "revocation_trigger": "conditions under which routing rule should be revised"
}
```

### 16.2 路由规则示例

规范示例在自然语言短语可能映射到多列、列名语义重叠，或 SQL 候选使用未绑定列时，激活 `schema_audit`。它记录过触发风险、欠触发风险、触发证据、边界测试和 fallback capability。

---

## 17. 对象关系与图语义

受治理对象系统是一张图。对象可以支持、反驳、取代、依赖、实例化或修复彼此。

### 17.1 核心边类型

| 边 | 含义 |
|---|---|
| supports | 证据或对象支持另一个对象。 |
| contradicts | 证据或对象与另一个对象冲突。 |
| depends_on | 对象要求另一个对象有效。 |
| supersedes | 对象替代旧对象。 |
| repairs | 增量或护栏修复发现或缺陷家族。 |
| generated_from | 对象由另一个对象产生。 |
| verifies | 验证器或护栏检查对象。 |
| commits | 转移提交状态记录。 |
| revokes | 对象使另一个对象失效。 |
| routes | 路由规则激活或抑制能力。 |
| renders | 控制对象影响最终产物渲染。 |

### 17.2 图不变量

对象图应满足：

```text
No active hard GKO should depend on a revoked object.
No committed state should depend only on draft evidence.
No resolved defect should lack a mitigation or accepted-risk note.
No active regression guard should lack a representative defect.
No transition should commit against a revoked contract.
No object should both supersede and depend on the same object unless explicitly justified.
```

### 17.3 冲突解决

对象冲突时，默认解决应考虑：

```text
scope specificity
authority level
evidence strength
recency under valid state
priority
human ownership boundary
mechanical verifier dominance
revocation conditions
```

常见排序是：

```text
hard object with valid mechanical evidence
  > hard object with authoritative external evidence
  > expert-human scoped judgment
  > active project-specific GKO
  > general-domain heuristic
  > model-generated suggestion
```

该排序应按领域显式配置。

---

## 18. 核心接口

本节定义面向实现的操作，不规定传输协议。这些操作可以实现为函数、数据库操作、agent 工具、API endpoint 或编排步骤。

### 18.1 `propose_object`

创建 draft 或 proposed 受治理对象。

```json
{
  "operation": "propose_object",
  "input": {
    "object_kind": "gko | geo | audit_finding | control_delta | regression_guard | state_record | transition_contract | verifier | evidence",
    "object_payload": {},
    "source_refs": ["object.id"]
  },
  "output": {
    "object_id": "object.id",
    "status": "draft | proposed",
    "validation_messages": []
  }
}
```

### 18.2 `validate_object`

检查 schema 有效性、必需字段、依赖状态、冲突和激活要求。

```json
{
  "operation": "validate_object",
  "input": {
    "object_id": "object.id",
    "validation_profile": "core | standard | strict"
  },
  "output": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "required_actions": []
  }
}
```

### 18.3 `activate_object`

验证通过后，把对象从 draft/proposed 移到 active。

```json
{
  "operation": "activate_object",
  "input": {
    "object_id": "object.id",
    "authority": "human | system | hybrid",
    "activation_reason": "reason"
  },
  "output": {
    "object_id": "object.id",
    "old_status": "proposed",
    "new_status": "active",
    "event_id": "event.id"
  }
}
```

### 18.4 `audit_artifact`

对产物运行审计并返回发现。

```json
{
  "operation": "audit_artifact",
  "input": {
    "artifact_ref": "artifact.id",
    "audit_scope": "semantic | execution | schema | routing | aggregation | specification | full",
    "active_gko_refs": ["gko.id"],
    "verifier_refs": ["verifier.id"]
  },
  "output": {
    "finding_refs": ["finding.id"],
    "evidence_refs": ["evidence.id"],
    "audit_summary": "summary"
  }
}
```

### 18.5 `derive_control_delta`

从发现生成控制增量。

```json
{
  "operation": "derive_control_delta",
  "input": {
    "finding_refs": ["finding.id"],
    "repair_policy": "minimal | standard | aggressive | human_review_required"
  },
  "output": {
    "delta_refs": ["delta.id"],
    "unresolved_findings": ["finding.id"]
  }
}
```

### 18.6 `apply_delta`

把 approved 增量应用到对象图。

```json
{
  "operation": "apply_delta",
  "input": {
    "delta_id": "delta.id",
    "authority": "human | system | hybrid",
    "dry_run": false
  },
  "output": {
    "applied": true,
    "created_objects": ["object.id"],
    "updated_objects": ["object.id"],
    "events": ["event.id"],
    "rollback_ref": "rollback.id"
  }
}
```

### 18.7 `register_guard`

验证 teeth proof 后激活回归护栏。

```json
{
  "operation": "register_guard",
  "input": {
    "guard_id": "guard.id",
    "require_teeth_proof": true
  },
  "output": {
    "registered": true,
    "guard_status": "active",
    "warnings": []
  }
}
```

### 18.8 `commit_transition`

当转移契约通过时提交状态转移。

```json
{
  "operation": "commit_transition",
  "input": {
    "contract_id": "contract.id",
    "current_state_ref": "state.id",
    "action_record": {},
    "observation_refs": ["evidence.id"],
    "verifier_result_refs": ["evidence.id"]
  },
  "output": {
    "committed": true,
    "new_state_ref": "state.id",
    "commit_event_ref": "event.id",
    "rejection_reason": null
  }
}
```

### 18.9 `query_governed_context`

返回与任务、状态、产物或能力相关的 active 对象。

```json
{
  "operation": "query_governed_context",
  "input": {
    "task_ref": "geo.id or task descriptor",
    "state_ref": "state.id",
    "artifact_type": "string",
    "capability": "string or null",
    "mismatch_focus": ["observation_representation", "state", "fitting_boundary", "support", "aggregation", "specification"]
  },
  "output": {
    "gko_refs": ["gko.id"],
    "geo_refs": ["geo.id"],
    "guard_refs": ["guard.id"],
    "verifier_refs": ["verifier.id"],
    "state_refs": ["state.id"]
  }
}
```

### 18.10 `render_control_context`

把选中的受治理对象渲染进 prompt、工具指令、验证器或执行计划。

```json
{
  "operation": "render_control_context",
  "input": {
    "object_refs": ["object.id"],
    "render_target": "prompt | tool_config | verifier_config | human_review | execution_plan",
    "compression_budget": "token or structural budget"
  },
  "output": {
    "rendered_context": "string or structured payload",
    "omitted_objects": ["object.id"],
    "compression_notes": "what was compressed or omitted"
  }
}
```

### 18.11 `revoke_or_weaken_object`

当撤销触发器触发时削弱或撤销对象。

```json
{
  "operation": "revoke_or_weaken_object",
  "input": {
    "object_id": "object.id",
    "action": "weaken | revoke | suspend | supersede",
    "reason": "reason",
    "evidence_refs": ["evidence.id"],
    "replacement_object_ref": "object.id or null"
  },
  "output": {
    "old_status": "active",
    "new_status": "revoked | suspended | superseded",
    "event_id": "event.id"
  }
}
```

---

## 19. 最小实现 Profile

并非每个系统都需要完整对象模型。本规范定义三个实现 profile。

### 19.1 Core Profile

用于短程但需要部分受治理控制的任务。

必需对象：

```text
GKO
Audit Finding
Control Delta
Regression Guard
Evidence Object
```

必需不变量：

```text
Active GKOs have scope and revocation triggers.
Findings classify mismatch type or mark unknown.
Control deltas reference findings.
Regression guards have representative defects.
```

### 19.2 Standard Profile

用于执行重复任务、工具使用或迭代修复的系统。

必需对象：

```text
Core Profile objects
Defect Ledger
Verifier Object
State Record
```

额外不变量：

```text
Resolved defect families have guards or accepted-risk notes.
Mechanical verifiers declare scope and limitations.
State records cite evidence and verifier results.
```

### 19.3 Full SGAR Profile

用于长程、多 agent、高价值或有状态系统。

必需对象：

```text
Standard Profile objects
GEO
Transition Contract
State Transition events
Rollback records
```

额外不变量：

```text
Critical progress requires committed state transition.
Context narrative alone cannot update hard state.
Transition contracts define precondition, observation, verifier, commit condition, and rollback condition.
```

---

## 20. 对象到原始失配的映射

每类原始失配都有特征性的受治理对象。

| 失配 | 主要对象 | 典型增量 | 典型护栏 |
|---|---|---|---|
| 观测-表征 | Evidence Object、representation GKO、schema/value binding GKO | 改变观测通道、添加表征 schema、要求工具检查 | 变量存在性检查、值落地检查、原始日志可用性检查 |
| 状态 | State hypothesis GKO、State Record、Transition Contract | 添加状态区分器、分支策略、要求澄清 | 状态消歧检查、转移一致性检查 |
| 拟合边界 | Routing Rule GKO、能力边界测试 | 改变 router、添加激活/抑制条件 | 路由检查、边界扰动测试 |
| 支持 | Search policy GKO、candidate expansion GEO | 扩展候选集合、添加稀有结构生成器 | 候选覆盖检查、低支持模式检查 |
| 聚合 | Composition Rule GKO、依赖图、artifact verifier | 添加全局不变量、改变渲染顺序、执行依赖 | 不变量检查、非局部一致性检查 |
| 规格 | Rubric GKO、success condition GKO、人类判断证据 | 修订 rubric、添加反例、改变评估器 | rubric 反例检查、代理风险检查 |

对象模型的价值在于把失配诊断转化为修复路由。问题不再只是“哪里错了？”，而是“哪个受治理对象必须改变？”

---

## 21. Text-to-SQL 实例

本节给出 text-to-SQL 系统中的紧凑端到端示例。

### 21.1 直接生成失败

直接系统接收：

```text
natural language question + database schema → SQL
```

它产生一个能执行但返回空结果集的 SQL 候选。流畅解释声称查询正确。

受治理系统不把解释当成权威。它创建证据：

```json
{
  "id": "evidence.sql.execution_result.014",
  "object_kind": "evidence",
  "evidence_type": "execution_result",
  "summary": "SQL executed successfully but returned zero rows.",
  "authority_level": "mechanical"
}
```

它审计候选并创建发现：

```text
finding: value predicate uses ungrounded surface form
mismatch_type: observation_representation
control_object_ref: value_binding_table.status_column
mechanism_axis: belief_representation
repair_layer: agent
```

它派生控制增量：

```text
create GKO requiring value grounding before predicate rendering
```

它注册护栏：

```text
literal predicate must match observed values or normalization map
```

它更新缺陷账本：

```text
defect family: ungrounded_literal_predicate
status: mitigated
```

只有当修复通过执行和语义审计后，它才提交状态：

```text
S + repaired SQL action → execution result + semantic audit → verifier pass → S'
```

### 21.2 受治理 SQL 构造对象

成熟 text-to-SQL 系统可以使用这些对象：

```text
state.database.schema_graph
gko.schema.column_binding
gko.schema.join_path_constraint
gko.value.literal_predicate_grounding
gko.routing.activate_schema_audit
gko.composition.sql_clause_dependency
gko.rubric.semantic_equivalence
guard.sql.executes_without_error
guard.sql.no_empty_result_without_audit
guard.sql.literal_values_are_grounded
contract.sql_candidate_commit
```

最终 SQL 从这些控制对象渲染，而不是作为单次不受治理续写生成。

---

## 22. 治理失败模式

对象模型也可能失败。以下失败模式应被显式审计。

### 22.1 对象膨胀

对象过多累积，使检索、优先级和渲染不稳定。

缓解方式：

```text
scope narrowing
object compaction
supersession
archive stale objects
summarize low-authority objects
```

### 22.2 过时权威

旧 GKO 在证据或领域已经变化后仍继续治理。

缓解方式：

```text
revocation triggers
lifespan policies
state dependency checks
periodic contradiction audit
```

### 22.3 回归剧场

护栏存在，但代表性缺陷复发时不会失败。

缓解方式：

```text
teeth proof
mutation-style defect injection
guard audit
false-negative tracking
```

### 22.4 验证器污染

验证器变得不可靠、可被博弈、过时或作用域错误。

缓解方式：

```text
verifier scope declaration
verifier limitation records
cross-verification
verifier revocation triggers
```

### 22.5 硬状态漂移

状态记录基于弱观测或叙事性声称提交。

缓解方式：

```text
transition contracts
mechanical evidence where available
commit records
rollback policies
```

### 22.6 过度治理

治理在低失配任务中引入延迟、冲突、脆弱规则或过拟合。

缓解方式：

```text
profile selection
cost-benefit threshold
soft object strength
on-demand governance
revocation of low-yield rules
```

### 22.7 隐藏冲突

两个 active 对象给出矛盾指导，却没有显式冲突边。

缓解方式：

```text
conflict detection
priority rules
scope-specific resolution
human review for critical conflicts
```

---

## 23. 治理成本收益规则

治理应具有选择性。

当：

```text
P(failure without governance)
× value at stake
× expected reachability gain
>
governance cost + governance-induced risk
```

系统应使用更重治理。

治理成本包括：

```text
token cost
latency
implementation complexity
human review burden
tool cost
state management overhead
```

治理诱发风险包括：

```text
overfitting to rules
object conflict
false authority
stale constraints
lost flexibility
incorrect verifier dominance
```

除非系统有可靠成本与价值估计，该规则有意保持定性。它的目的在于防止对象模型变成普遍负担。

---

## 24. 审计之审计要求

受治理系统应审计自己的治理层。

以下元问题应可回答：

```text
Which active GKOs have not been used recently?
Which guards have no teeth proof?
Which findings have no control delta?
Which resolved defects have recurred?
Which state records depend on stale evidence?
Which verifiers have untested limitations?
Which objects lack revocation triggers?
Which conflicts are unresolved?
Which deltas were applied without rollback plans?
```

最小的审计之审计发现，本身也是一个 Audit Finding：它的 `mechanism_axis` 可以是 `unknown` 或某个具体机制归因，而 `target_object_refs` 则可指向需要改变的 `gko`、`verifier`、`guard` 或 `transition_contract`。

---

## 25. 一致性 Checklist

系统满足 Core Profile，当它满足：

```text
[ ] Active GKOs include scope, support_scope, strength, and revocation_trigger.
[ ] Audit Findings include mismatch_type and control_object_ref；若已可操作化，还应包含 mechanism_axis。
[ ] Control Deltas reference findings or explicit rationales.
[ ] Regression Guards include representative_defect and failure_predicate.
[ ] Evidence Objects identify authority_level and limitations.
```

系统满足 Standard Profile，当它还满足：

```text
[ ] Defect Ledger entries track recurrence and mitigation.
[ ] Verifier Objects declare scope, pass/fail conditions, limitations, and revocation triggers.
[ ] State Records cite evidence and verifiers.
[ ] Resolved defects have guards or accepted-risk notes.
```

系统满足 Full SGAR Profile，当它还满足：

```text
[ ] Critical state changes use Transition Contracts.
[ ] Transition Contracts define precondition, observation schema, verifier, commit condition, and rollback condition.
[ ] Context narrative alone cannot commit state.
[ ] Rollback or dispute paths exist for committed state.
[ ] GEOs track long-horizon tasks, actions, handoffs, and success conditions.
```

---

## 26. 紧凑 JSON 类型索引

规范对象种类是：

```text
gko
geo
evidence
audit_finding
control_delta
regression_guard
defect_ledger_entry
verifier
state_record
transition_contract
```

规范状态词汇因对象而异，但通用状态包括：

```text
draft
proposed
active
confirmed
approved
applied
committed
resolved
suspended
superseded
deprecated
revoked
archived
```

规范 `mismatch_type` 词汇是：

```text
observation_representation
state
fitting_boundary
support
aggregation
specification
compound
implementation
unknown
```

规范任务对象词汇是：

```text
sql_dag
claim_evidence_map
character_state_machine
narrative_skeleton
rubric
router_rule
state_table
other
```

规范 `mechanism_axis` 词汇是：

```text
specification_reward
observation_availability
belief_representation
dynamics_world_model
action_interface
capability_support
capability_routing
search_execution
unknown
not_operationalized
```

规范 `operationalization_status` 词汇是：

```text
direct
derived
partial
not_operationalized
```

规范 `repair_layer` 词汇是：

```text
agent
training
hybrid
unknown
```

---

## 27. 结论

本规范定义了受治理 LLM 系统所需的对象层。它的核心目的是让价值保存工作变得持久。失败不应消失在对话历史中。修复不应停留为临时 prompt 改动。状态不应通过叙事性断言提交。验证不应被流畅自信覆盖。控制知识不应不朽、无作用域或不可撤销。

拟议对象模型把 LLM 系统改进变成一个受治理生命周期：

```text
observe failure
localize mismatch
write control delta
update governed objects
install regression guard
record defect family
commit verified state
reuse or revoke under scope
```

该模型有意保持模块化。低风险系统可以只使用 Core Profile。重复工具使用系统可以使用 Standard Profile。长程 agent 和高价值工作流应使用 Full SGAR Profile。

更广泛的论点是：高价值 LLM 系统需要的不只是生成、检索和批判。它们需要显式治理那些保存任务价值的对象。

---

## 附录 A：最小核心对象集

对许多系统而言，以下五种对象足以开始：

```text
GKO
Evidence Object
Audit Finding
Control Delta
Regression Guard
```

最小生命周期：

```text
1. Create GKO for important task rule.
2. Audit candidate artifact against active GKOs.
3. Convert failure into Audit Finding.
4. Derive Control Delta from finding.
5. Create Regression Guard for defect family.
6. Update or revoke GKO as evidence changes.
```

这个最小集合已经可以把 prompt 迭代转化为受治理修复。

---

## 附录 B：最小 GKO 示例

该示例定义一个 research answer generation 的 hard rubric：生成非常识性事实声明时，每个声明应由引用来源支持，或标记为不确定。它改进事实回答的可追溯性，但不保证来源正确或消除解释错误。

---

## 附录 C：最小审计发现示例

该示例定位一个未引用事实声明：答案对近期法规提出事实主张，却没有引用或不确定性标记。失配类型是 `specification`，直接修复对象是 `rubric`，机制归因是 `specification_reward`，控制增量是添加引用护栏。

---

## 附录 D：最小控制增量示例

该示例添加一个回归护栏：当非常识事实声明缺少引用或不确定性标记时失败。风险是可能对常识声明过触发；rollback plan 是在 false positive 高时把护栏降级为 advisory。

---

## 附录 E：最小回归护栏示例

该示例定义 `guard.example.noncommon_claim_requires_citation.v1`：当非常识事实声明没有引用或不确定性标记时失败；当每个非常识事实声明都有引用、来源指针或不确定性标记时通过。代表性缺陷是关于当前法律或产品功能的无引用声明。
