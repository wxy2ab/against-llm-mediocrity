# Governed LLM Object Model and Interface Specification

**Working Draft v0.1**  
**Companion Specification to _A Structural Theory of Value Preservation in LLM Systems_**  

---

## Abstract

This document specifies a unified object model for governed LLM systems. It is designed as the implementation-facing companion to a structural theory of value preservation in LLM systems. The theory identifies six primitive mismatch types—observation-representation, state, fitting-boundary, support, aggregation, and specification mismatch—and argues that high-value LLM systems require mechanisms for preserving task value across observation, representation, capability routing, candidate support, aggregation, evaluation, audit, and state transition.

The present specification defines the objects and interfaces required to make that theory operational. It unifies **Governed Knowledge Objects** (GKOs), **Governed Execution Objects** (GEOs), **Audit Findings**, **Control Deltas**, **Regression Guards**, **Defect Ledgers**, **State Records**, **Transition Contracts**, **Verifier Objects**, and **Evidence Objects** into a single lifecycle. The core flow is:

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

The goal is not to prescribe a single software architecture. The goal is to define stable object contracts and interface semantics so that LLM systems can externalize task-specific control knowledge, localize failures, write repairs back into the control space, prevent regressions, and commit progress only through verifiable state transitions.

---

## Contents

This specification is long. Use the section map below to jump to a topic. Sections 1–4 give the conceptual frame (purpose, principles, layers, and lifecycle); sections 5–16 define each governed object in turn; sections 17–20 cover how the objects relate, the implementation profiles, and the mapping back to the six primitive mismatches; sections 21–27 give a worked example, failure modes, governance economics, and conformance; the appendices supply a minimal starter object set.

- [1. Purpose and Scope](#1-purpose-and-scope)
- [2. Design Principles](#2-design-principles)
- [3. Architectural Layers](#3-architectural-layers)
- [4. Canonical Object Lifecycle](#4-canonical-object-lifecycle)
- [5. Common Object Envelope](#5-common-object-envelope)
- [6. Governed Knowledge Object](#6-governed-knowledge-object)
- [7. Governed Execution Object](#7-governed-execution-object)
- [8. Evidence Object](#8-evidence-object)
- [9. Audit Finding](#9-audit-finding)
- [10. Control Delta](#10-control-delta)
- [11. Regression Guard](#11-regression-guard)
- [12. Defect Ledger](#12-defect-ledger)
- [13. Verifier Object](#13-verifier-object)
- [14. State Record](#14-state-record)
- [15. Transition Contract](#15-transition-contract)
- [16. Capability Routing Rule](#16-capability-routing-rule)
- [17. Object Relationships and Graph Semantics](#17-object-relationships-and-graph-semantics)
- [18. Core Interfaces](#18-core-interfaces)
- [19. Minimal Implementation Profiles](#19-minimal-implementation-profiles)
- [20. Mapping Objects to Primitive Mismatches](#20-mapping-objects-to-primitive-mismatches)
- [21. Text-to-SQL Instantiation](#21-text-to-sql-instantiation)
- [22. Governance Failure Modes](#22-governance-failure-modes)
- [23. Cost-Benefit Rule for Governance](#23-cost-benefit-rule-for-governance)
- [24. Audit-of-Audit Requirements](#24-audit-of-audit-requirements)
- [25. Conformance Checklist](#25-conformance-checklist)
- [26. Compact JSON Type Index](#26-compact-json-type-index)
- [27. Conclusion](#27-conclusion)

---

## 1. Purpose and Scope

This specification defines a common object language for LLM systems that require more than one-shot generation. It applies to systems where outputs, decisions, or actions must be governed by explicit control knowledge, audit trails, verification conditions, and state commitments.

The target systems include:

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

The specification is intentionally independent of any particular model, framework, database, vector store, prompt format, orchestration library, or programming language. It defines object semantics rather than implementation mechanisms.

The central design problem is this:

> How can an LLM system preserve task value across multiple generations, audits, tool calls, revisions, state changes, and failures without relying on context narrative as the sole source of authority?

The answer proposed here is an object system. Task-relevant knowledge, failures, repairs, guards, and state transitions must become explicit objects with scope, evidence, status, lifecycle, and revocation conditions.

---

## 2. Design Principles

### 2.1 Externalize Control Knowledge

Instructions embedded only in prompts are fragile. They are difficult to audit, revise, weaken, revoke, prioritize, or reuse. A governed system should externalize durable control knowledge as explicit objects.

Control knowledge includes:

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

### 2.2 Separate Final Rendering from Control Space

The final artifact is not the only meaningful object. In many high-value tasks, the decisive work happens in intermediate structures: schema graphs, join paths, state matrices, rubrics, issue lists, dependency graphs, failure taxonomies, test cases, or transition records.

A governed system should distinguish:

```text
control objects: govern the task
rendered artifacts: presented to the user or environment
state objects: determine what the system treats as committed reality
```

### 2.3 Treat Audit as Write-Back, Not Scoring

A score may rank candidates, but it does not necessarily improve the system. An audit becomes useful when it localizes a defect, identifies the mismatch type, proposes a control delta, and produces a regression guard.

The basic audit invariant is:

```text
No serious failure should end as a mere comment.
A serious failure should become a control delta, a guard, a revocation, or a state correction.
```

### 2.4 Make Scope and Revocation First-Class

A governed object should not be immortal. It should specify when it applies, what it supports, what it does not support, and when it should be weakened, revised, superseded, or revoked.

A GKO without scope is a prompt fragment. A GKO without revocation conditions is a potential source of stale authority.

### 2.5 Separate Narrative Context from State Authority

The model context can describe progress. It cannot, by itself, commit progress. A system has progressed only when an authorized state transition has occurred.

The state principle is:

```text
Context may narrate state.
Only committed state records authorize state.
```

### 2.6 Prefer Verifier Authority over Model Confidence

When a trusted mechanical or external verifier exists, it should dominate fluent model confidence. LLM explanations may help diagnose or repair failures, but they should not override authoritative observations.

### 2.7 Preserve Local Alignment; Govern Global Composition

LLMs often have strong local capabilities: compression, paraphrase, candidate generation, explanation, decomposition, surface rendering, and edge-case enumeration. The object model should preserve these strengths while governing the places where local quality does not compose into global task value.

---

## 3. Architectural Layers

A governed LLM system can be organized into seven layers.

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

These layers are not separate products. They are distinct roles within a single lifecycle. A failure diagnosed at the diagnostic layer should be able to produce an audit finding. An audit finding should produce a control delta. A control delta may update a GKO, a GEO, a verifier, a guard, or a state record. A verified update may become a committed state transition.

---

## 4. Canonical Object Lifecycle

The canonical lifecycle is:

```text
1. Artifact is produced.
2. Artifact is audited.
3. Audit produces one or more findings.
4. Findings are localized to mismatch types and task-specific control objects.
5. Mechanism attribution and repair-layer selection are added where operationalized.
6. Each accepted finding produces a control delta against a governed object.
7. Control delta updates governed objects.
8. A regression guard is created or updated.
9. The defect ledger records the failure family and repair.
10. A verifier determines whether state should be committed.
11. Future routing, search, rendering, and audit use the updated governed state.
```

In object form:

```text
Artifact
  → AuditFinding
  → ControlDelta
  → {GKO | GEO | VerifierObject | StateRecord | TransitionContract}
  → RegressionGuard
  → DefectLedgerEntry
  → StateTransition
```

The lifecycle does not require all objects for every task. Low-risk tasks may use only a subset. High-value or long-horizon tasks should preserve the full chain from finding to state commitment.

---

## 5. Common Object Envelope

All governed objects share a common envelope.

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

### 5.1 Identifier Requirements

Identifiers should be stable and globally unique within the system boundary.

Recommended pattern:

```text
<object_kind>.<domain>.<short_semantic_name>.<version_or_hash>
```

Examples:

```text
gko.text2sql.join_path_requires_fk.v1
finding.bird.empty_result_overconstrained_predicate.2026_06_27_001
delta.router.enable_schema_audit_for_ambiguous_columns.v1
guard.text2sql.no_empty_result_without_predicate_audit.v1
state.project.current_schema_graph.commit_000042
```

### 5.2 Status Semantics

| Status | Meaning |
|---|---|
| draft | Object exists but has no authority. |
| proposed | Object is a candidate for activation. |
| active | Object currently governs behavior or state. |
| suspended | Temporarily disabled pending review. |
| superseded | Replaced by a newer object. |
| deprecated | Retained for history but not recommended. |
| revoked | Withdrawn due to contradiction, failed scope, or invalid evidence. |
| archived | Historical object no longer part of active governance. |

No object should silently disappear. Revocation and supersession must be explicit events.

---

## 6. Governed Knowledge Object

A **Governed Knowledge Object** is a scoped, evidence-bearing, revocable unit of task-specific control knowledge.

GKOs are the core knowledge-layer objects. They are not merely facts; they can govern routing, search, validation, rendering, state interpretation, or audit.

### 6.1 GKO Types

Recommended `gko_type` values:

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

### 6.3 GKO Example: Text-to-SQL Join Path Constraint

```json
{
  "id": "gko.text2sql.join_path.requires_declared_relationship.v1",
  "object_kind": "gko",
  "version": "0.1.0",
  "status": "active",
  "gko_type": "composition_rule",
  "condition": "When constructing SQL involving multiple tables in a database with available foreign-key or inferred relationship metadata.",
  "assertion": "A join path must be justified by a declared foreign key, a verified schema relationship, or a value-distribution match recorded as evidence.",
  "strength": "hard",
  "priority": 90,
  "scope": "text2sql.database_specific_query_generation",
  "support_scope": "Prevents unsupported table joins and forces join-path evidence before SQL rendering.",
  "not_supported_claims": "Does not claim that declared foreign keys always encode the user-intended relationship; does not resolve natural-language ambiguity by itself.",
  "evidence_refs": ["evidence.schema.foreign_key_graph.commit_0007"],
  "counterevidence_refs": [],
  "depends_on": ["state.database.schema_graph.commit_0007"],
  "conflicts_with": [],
  "lifespan": "project",
  "activation_policy": "Activate whenever SQL rendering requires more than one table.",
  "rendering_policy": "Require a join_path object before final SQL is rendered.",
  "verification_policy": "Check that every join edge appears in the schema graph or has explicit value-distribution evidence.",
  "revocation_trigger": "Revoke or weaken if schema metadata is found incomplete or if benchmark evidence shows valid joins not represented in the graph.",
  "downgrade_trigger": "Downgrade to soft if inferred relationships are required and no authoritative schema metadata exists.",
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00",
  "created_by": "hybrid",
  "source": "audit finding on unsupported join-path failures",
  "audit_trail": ["finding.text2sql.unsupported_join_path.001"]
}
```

### 6.4 GKO Invariants

A valid active GKO must have:

```text
condition
assertion
scope
support_scope
strength
revocation_trigger
```

A hard GKO must additionally have:

```text
verification_policy
evidence_refs or authoritative source
conflict-resolution priority
```

A persistent GKO must have:

```text
lifespan
revocation_trigger
audit trail
```

---

## 7. Governed Execution Object

A **Governed Execution Object** represents a task, plan, action, collaboration unit, or workflow item whose execution must be tracked and governed.

Where GKOs govern knowledge, GEOs govern execution.

### 7.1 GEO Types

Recommended `geo_type` values:

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

### 7.3 GEO Example: Text-to-SQL Candidate Repair

```json
{
  "id": "geo.text2sql.repair.empty_result_query.001",
  "object_kind": "geo",
  "version": "0.1.0",
  "status": "active",
  "geo_type": "subtask",
  "objective": "Repair a SQL candidate that executes successfully but returns an empty result set unexpectedly.",
  "inputs": ["artifact.sql_candidate.014", "finding.text2sql.empty_result.014"],
  "outputs_expected": ["artifact.sql_candidate.repaired", "evidence.execution_result"],
  "success_condition": "The repaired SQL executes and the audit confirms that empty-result risk has been addressed semantically, not merely by removing constraints.",
  "failure_condition": "The repaired SQL either fails execution, returns empty results without justification, or violates the question semantics.",
  "assigned_actor": "hybrid",
  "allowed_actions": ["inspect_predicates", "inspect_value_bindings", "query_sample_values", "revise_predicate", "rerun_execution"],
  "forbidden_actions": ["drop_all_filters_without_semantic_justification"],
  "required_gkos": ["gko.text2sql.no_empty_result_without_predicate_audit.v1"],
  "required_verifiers": ["verifier.sql.execution_engine", "verifier.text2sql.semantic_audit"],
  "transition_contract_ref": "contract.text2sql.sql_repair_commit.v1",
  "state_precondition": "state.sql_candidate.014.status == failed_audit",
  "state_postcondition": "state.sql_candidate.014.status == repaired_and_verified",
  "revocation_trigger": "Revoke if the candidate is found irrelevant to the original question or if database state is invalid.",
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00",
  "audit_trail": ["finding.text2sql.empty_result.014"]
}
```

---

## 8. Evidence Object

An **Evidence Object** records observations, tool outputs, human judgments, executions, documents, measurements, or derivations that support or contradict governed objects.

Evidence should be addressable. Governed objects should cite evidence by ID rather than embedding all evidence directly.

### 8.1 Evidence Types

Recommended `evidence_type` values:

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

### 8.3 Evidence Authority Order

When evidence conflicts, systems should apply a domain-specific authority order. A common default is:

```text
mechanical verifier / execution result
  > authoritative external source
  > expert human judgment
  > user preference within user-owned scope
  > model-assisted judgment
  > heuristic inference
```

This ordering is not universal. It must be configurable by domain. The invariant is that authority order should be explicit.

---

## 9. Audit Finding

An **Audit Finding** localizes a defect in an artifact, trace, state transition, or governed object. It is the bridge from failure observation to system repair.

The corrected bridging sequence is not "mismatch type → eight mechanisms → direct fix," but rather "mismatch type → task-specific control object → mechanism attribution → repair-layer selection."

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

### 9.2 Mismatch-Type Semantics

| Mismatch type | Audit question |
|---|---|
| observation_representation | Did the decisive variable fail to enter the representation? |
| state | Did the system act under the wrong latent-state assumption? |
| fitting_boundary | Was a capability triggered outside its true domain or suppressed inside it? |
| support | Was the correct structure absent or too low-reachability under the search procedure? |
| aggregation | Did locally plausible parts fail to compose into global value? |
| specification | Did the proxy objective diverge from true task utility? |
| compound | Did multiple mismatch types interact? |
| implementation | Was the failure due to a software, tool, parsing, or infrastructure bug? |
| unknown | Is the failure real but not yet localized? |

### 9.3 Audit Finding Example

```json
{
  "id": "finding.text2sql.empty_result_due_to_overconstrained_predicate.014",
  "object_kind": "audit_finding",
  "version": "0.1.0",
  "status": "confirmed",
  "artifact_ref": "artifact.sql_candidate.014",
  "finding": "The SQL query executes but returns an empty result because the value predicate uses a surface string not present in the database values.",
  "evidence_refs": ["evidence.sql.execution_result.014", "evidence.database.sample_values.column_status.003"],
  "mismatch_type": "observation_representation",
  "severity": "high",
  "confidence": "confirmed",
  "failure_mode": "value_linking_surface_form_not_grounded",
  "control_object_ref": "value_binding_table.status_column",
  "control_object_type": "value_binding_table",
  "mechanism_axis": "belief_representation",
  "operationalization_status": "direct",
  "repair_layer": "agent",
  "target_object_refs": ["value_binding_table.status_column"],
  "root_cause_hypothesis": "The system used the natural-language value phrase directly rather than querying or normalizing database values before predicate construction.",
  "minimal_reproduction": "Use the same question and schema but omit sample values for the status column; the model generates an unsupported literal predicate.",
  "control_delta_refs": ["delta.text2sql.require_value_grounding_before_predicate_rendering.v1"],
  "regression_guard_refs": ["guard.text2sql.value_predicate_must_match_observed_values.v1"],
  "not_a_failure_if": "The question explicitly asks for a value not present in the database and the correct answer requires an empty result.",
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00",
  "created_by": "hybrid",
  "revocation_trigger": "Revoke if database inspection shows the literal value is valid or if the task specification defines empty result as correct."
}
```

---

## 10. Control Delta

A **Control Delta** specifies a localized change to the governed control space. It is the write-back object produced by an audit finding.

A finding says what failed; a control delta says what must change.

### 10.1 Delta Types

Recommended `delta_type` values:

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

### 10.3 Control Delta Example

```json
{
  "id": "delta.text2sql.require_value_grounding_before_predicate_rendering.v1",
  "object_kind": "control_delta",
  "version": "0.1.0",
  "status": "approved",
  "delta_type": "create_object",
  "source_finding_refs": ["finding.text2sql.empty_result_due_to_overconstrained_predicate.014"],
  "target_object_ref": "value_binding_table.status_column",
  "target_object_type": "value_binding_table",
  "mechanism_axis": "belief_representation",
  "operationalization_status": "direct",
  "repair_layer": "agent",
  "target_object_refs": ["value_binding_table.status_column"],
  "proposed_change": "Create a GKO requiring observed or normalized database values before rendering literal predicates.",
  "patch": {
    "create": {
      "object_kind": "gko",
      "gko_type": "value_binding",
      "id": "gko.text2sql.literal_predicates.require_value_grounding.v1",
      "condition": "When generating SQL predicates involving string or categorical database values.",
      "assertion": "Literal predicates must be grounded in observed values, normalized value mappings, or an explicit uncertainty note before final SQL rendering.",
      "strength": "hard",
      "priority": 95
    }
  },
  "expected_effect": "Reduce failures where surface-form values from the question are inserted into SQL without database grounding.",
  "risk_assessment": "May add latency due to value inspection; may overconstrain tasks where database access is unavailable.",
  "required_verification": "Run value-grounding guard on representative predicate cases.",
  "rollback_plan": "Downgrade GKO to soft if value inspection is unavailable or if guard produces false positives.",
  "regression_guard_refs": ["guard.text2sql.value_predicate_must_match_observed_values.v1"],
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00",
  "created_by": "hybrid",
  "applied_at": null,
  "applied_by": null,
  "revocation_trigger": "Rollback if the GKO causes systematic rejection of semantically correct predicates."
}
```

### 10.4 Delta Invariants

A control delta should not be applied unless it has:

```text
source finding or explicit rationale
target object or object creation patch
expected effect
risk assessment
required verification
rollback plan
```

A high-impact delta should not be applied without a regression guard or explicit explanation for why no guard is possible.

---

## 11. Regression Guard

A **Regression Guard** is a check that should fail when a known defect family recurs.

A guard may be a unit test, execution check, semantic audit, schema validator, counterexample prompt, human-review checklist, invariant checker, or state-transition verifier.

### 11.1 Teeth-Proven Guard Principle

A regression guard has teeth only if a representative reintroduction of the defect makes the guard fail.

```text
If the defect returns and the guard stays green, the guard is theater.
```

### 11.2 Guard Types

Recommended `guard_type` values:

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

### 11.4 Guard Example

```json
{
  "id": "guard.text2sql.value_predicate_must_match_observed_values.v1",
  "object_kind": "regression_guard",
  "version": "0.1.0",
  "status": "active",
  "guard_type": "execution_check",
  "defect_family": "ungrounded_literal_predicate",
  "linked_findings": ["finding.text2sql.empty_result_due_to_overconstrained_predicate.014"],
  "linked_deltas": ["delta.text2sql.require_value_grounding_before_predicate_rendering.v1"],
  "failure_predicate": "A SQL literal predicate uses a categorical string not observed in sample values, normalization mappings, or explicit schema evidence, without an uncertainty branch.",
  "pass_predicate": "Every literal predicate is grounded in observed values, a normalization mapping, or an explicit verified exception.",
  "representative_defect": "WHERE status = 'completed' when observed values are ['Complete', 'Pending', 'Cancelled'] and no normalization map is present.",
  "teeth_proof": "Injected representative defect fails the guard under guard_run_0003.",
  "execution_method": "Parse SQL predicates, inspect categorical column evidence, compare literal values against observed/normalized value set.",
  "authority_level": "mechanical",
  "scope": "text2sql.string_and_categorical_predicates",
  "false_positive_risk": "May fail valid predicates when sample values are incomplete.",
  "false_negative_risk": "May pass semantically wrong predicates that use observed but unintended values.",
  "last_run_at": "2026-06-27T00:00:00-04:00",
  "last_result": "pass",
  "revocation_trigger": "Revise if sample-value incompleteness causes unacceptable false positives.",
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00",
  "created_by": "hybrid"
}
```

---

## 12. Defect Ledger

A **Defect Ledger** records failure families, representative instances, fixes, guards, regressions, and revocations.

It is the memory of system failure. Without a defect ledger, the system risks rediscovering the same defect repeatedly.

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

### 12.2 Defect Ledger Example

```json
{
  "id": "defect.text2sql.ungrounded_literal_predicate",
  "object_kind": "defect_ledger_entry",
  "version": "0.1.0",
  "status": "mitigated",
  "defect_family": "ungrounded_literal_predicate",
  "description": "The system inserts natural-language surface values into SQL predicates without grounding them against database values or normalization mappings.",
  "mismatch_types": ["observation_representation", "aggregation"],
  "representative_findings": ["finding.text2sql.empty_result_due_to_overconstrained_predicate.014"],
  "representative_artifacts": ["artifact.sql_candidate.014"],
  "control_deltas": ["delta.text2sql.require_value_grounding_before_predicate_rendering.v1"],
  "regression_guards": ["guard.text2sql.value_predicate_must_match_observed_values.v1"],
  "affected_objects": ["gko.text2sql.literal_predicates.require_value_grounding.v1"],
  "first_seen_at": "2026-06-27T00:00:00-04:00",
  "last_seen_at": "2026-06-27T00:00:00-04:00",
  "recurrence_count": 1,
  "current_mitigation": "Require value grounding before predicate rendering and run categorical predicate guard.",
  "known_limitations": "Guard may be incomplete when sample values are partial.",
  "owner": "system",
  "revocation_trigger": "Retire only if no recurrence appears across the maintained defect horizon and a more general guard supersedes it."
}
```

---

## 13. Verifier Object

A **Verifier Object** defines an authority that can check an artifact, object, state transition, or guard result.

Verifiers may be mechanical, human, model-assisted, or hybrid. The important point is that their authority, scope, failure modes, and limitations must be explicit.

### 13.1 Verifier Types

Recommended `verifier_type` values:

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

### 13.3 Verifier Example

```json
{
  "id": "verifier.sql.execution_engine",
  "object_kind": "verifier",
  "version": "0.1.0",
  "status": "active",
  "verifier_type": "execution_engine",
  "scope": "Verifies syntactic executability and observed result sets of SQL queries against a specific database instance.",
  "input_contract": "SQL query string plus database connection or snapshot identifier.",
  "output_contract": "Execution status, error message if any, result schema, row count, and sample rows.",
  "pass_condition": "SQL executes without runtime error.",
  "fail_condition": "SQL fails parsing, planning, permissions, or execution.",
  "authority_level": "mechanical",
  "limitations": "Execution success does not prove semantic correctness with respect to the natural-language question.",
  "failure_modes": "May pass semantically wrong queries; may fail correct queries if database snapshot or permissions are invalid.",
  "dependencies": ["state.database.snapshot.current"],
  "revocation_trigger": "Reduce authority if database snapshot is stale or execution environment is inconsistent.",
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00",
  "created_by": "system"
}
```

---

## 14. State Record

A **State Record** represents committed system state. It is authoritative only within its declared scope.

State records are not summaries. They are commitments. A summary may be wrong, incomplete, or rhetorical. A state record should be explicit, versioned, and verifiable.

### 14.1 State Types

Recommended `state_type` values:

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

### 14.3 State Record Example

```json
{
  "id": "state.text2sql.schema_graph.commit_0007",
  "object_kind": "state_record",
  "version": "0.1.0",
  "status": "committed",
  "state_type": "schema_state",
  "scope": "database.bird.example_db.schema_graph",
  "state_payload": {
    "tables": ["student", "course", "enrollment"],
    "foreign_keys": [
      {"from": "enrollment.student_id", "to": "student.id"},
      {"from": "enrollment.course_id", "to": "course.id"}
    ],
    "source_snapshot": "database_snapshot_0007"
  },
  "predecessor_state_refs": ["state.text2sql.schema_graph.commit_0006"],
  "transition_contract_ref": "contract.schema_graph.commit_from_database_introspection.v1",
  "evidence_refs": ["evidence.schema.introspection.0007"],
  "verifier_refs": ["verifier.database.schema_introspection"],
  "commit_record": {
    "committed_at": "2026-06-27T00:00:00-04:00",
    "committed_by": "system",
    "commit_reason": "Database introspection completed and schema validator passed."
  },
  "rollback_policy": "Rollback to previous schema graph if snapshot is invalidated or schema introspection is contradicted.",
  "revocation_trigger": "Dispute if database snapshot changes or foreign-key metadata is found incomplete.",
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00"
}
```

---

## 15. Transition Contract

A **Transition Contract** defines when an action may change committed state.

The basic form is:

```text
S + A → O → V → S'
```

Where:

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

### 15.2 Transition Contract Example

```json
{
  "id": "contract.text2sql.sql_repair_commit.v1",
  "object_kind": "transition_contract",
  "version": "0.1.0",
  "status": "active",
  "contract_type": "artifact_commit",
  "scope": "text2sql.sql_candidate_repair",
  "precondition": "A SQL candidate has a confirmed audit finding and an approved repair GEO.",
  "action_schema": "Submit repaired SQL plus explanation of changed control objects.",
  "observation_schema": "Execution result, semantic audit result, and guard result.",
  "verifier_refs": ["verifier.sql.execution_engine", "verifier.text2sql.semantic_audit", "guard.text2sql.value_predicate_must_match_observed_values.v1"],
  "commit_condition": "SQL executes; semantic audit passes; relevant regression guards pass; no hard GKO is violated.",
  "reject_condition": "SQL fails execution, violates hard GKO, or semantic audit identifies unresolved mismatch.",
  "rollback_condition": "Later evidence shows the repaired SQL is semantically wrong or was committed under stale database state.",
  "state_update_rule": "Mark candidate as repaired_and_verified; attach execution evidence and semantic audit evidence; update defect ledger if recurrence is mitigated.",
  "audit_requirement": "Audit must classify remaining failures, if any, by primitive mismatch type.",
  "authority_policy": "Mechanical execution verifier dominates model confidence; semantic audit may require human or model-assisted review depending on task setting.",
  "revocation_trigger": "Revoke if semantic audit is found unreliable or if database snapshot validity cannot be guaranteed.",
  "created_at": "2026-06-27T00:00:00-04:00",
  "updated_at": "2026-06-27T00:00:00-04:00",
  "created_by": "hybrid"
}
```

### 15.3 Transition Invariants

A committed state transition must have:

```text
precondition
action record
observation record
verifier or commitment criterion
commit record
rollback policy
```

A critical transition must not be committed solely by model assertion.

---

## 16. Capability Routing Rule

A **Capability Routing Rule** may be represented as a GKO subtype, but it is important enough to specify explicitly because fitting-boundary mismatch is a primitive mismatch type.

The rule governs when a capability should activate or be suppressed.

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

### 16.2 Routing Rule Example

```json
{
  "id": "gko.routing.text2sql.activate_schema_audit_on_ambiguous_column.v1",
  "object_kind": "gko",
  "gko_type": "routing_rule",
  "status": "active",
  "capability": "schema_audit",
  "activation_condition": "Activate when a natural-language phrase can map to more than one column, when column names are semantically overlapping, or when the SQL candidate uses a column not explicitly bound in the control space.",
  "suppression_condition": "Suppress only when a prior committed schema binding uniquely resolves the phrase within the current database state.",
  "true_applicability_domain": "T_X: Text-to-SQL cases where column ambiguity affects correctness.",
  "observed_activation_domain": "M_X: Cases detected by ambiguity heuristics or audit findings.",
  "overtrigger_risk": "May over-trigger on harmless synonymy and add latency.",
  "undertrigger_risk": "May under-trigger when column ambiguity is semantic rather than lexical.",
  "trigger_evidence": "Schema column names, natural-language phrase embeddings, prior binding failures, and audit findings.",
  "boundary_tests": ["guard.text2sql.ambiguous_column_requires_binding.v1"],
  "fallback_capability": "direct_sql_rendering_with_binding_check",
  "revocation_trigger": "Revise if schema_audit is frequently activated without changing outcomes or if failures occur without activation."
}
```

---

## 17. Object Relationships and Graph Semantics

The governed object system is a graph. Objects may support, contradict, supersede, depend on, instantiate, or repair one another.

### 17.1 Core Edge Types

| Edge | Meaning |
|---|---|
| supports | Evidence or object supports another object. |
| contradicts | Evidence or object conflicts with another object. |
| depends_on | Object requires another object to be valid. |
| supersedes | Object replaces an older object. |
| repairs | Delta or guard repairs a finding or defect family. |
| generated_from | Object was produced from another object. |
| verifies | Verifier or guard checks an object. |
| commits | Transition commits a state record. |
| revokes | Object invalidates another object. |
| routes | Routing rule activates or suppresses a capability. |
| renders | Control object affects final artifact rendering. |

### 17.2 Graph Invariants

The object graph should satisfy:

```text
No active hard GKO should depend on a revoked object.
No committed state should depend only on draft evidence.
No resolved defect should lack a mitigation or accepted-risk note.
No active regression guard should lack a representative defect.
No transition should commit against a revoked contract.
No object should both supersede and depend on the same object unless explicitly justified.
```

### 17.3 Conflict Resolution

When objects conflict, default resolution should consider the following factors:

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

A common ordering is:

```text
hard object with valid mechanical evidence
  > hard object with authoritative external evidence
  > expert-human scoped judgment
  > active project-specific GKO
  > general-domain heuristic
  > model-generated suggestion
```

This ordering should be domain-specific and explicitly configurable.

---

## 18. Core Interfaces

This section defines implementation-facing operations. It does not prescribe transport protocols. These may be implemented as functions, database operations, agent tools, API endpoints, or orchestration steps.

### 18.1 `propose_object`

Creates a draft or proposed governed object.

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

Checks schema validity, required fields, dependency status, conflicts, and activation requirements.

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

Moves an object from draft/proposed to active status if validation succeeds.

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

Runs audit over an artifact and returns findings.

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

Produces control deltas from findings.

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

Applies an approved delta to the object graph.

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

Activates a regression guard after validating teeth proof.

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

Commits a state transition if the transition contract passes.

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

Returns active objects relevant to a task, state, artifact, or capability.

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

Renders selected governed objects into prompts, tool instructions, validators, or execution plans.

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

Weakens or revokes an object when its revocation trigger fires.

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

## 19. Minimal Implementation Profiles

Not every system needs the full object model. This specification defines three implementation profiles.

### 19.1 Core Profile

Use when tasks are short-horizon but require some governed control.

Required objects:

```text
GKO
Audit Finding
Control Delta
Regression Guard
Evidence Object
```

Required invariants:

```text
Active GKOs have scope and revocation triggers.
Findings classify mismatch type or mark unknown.
Control deltas reference findings.
Regression guards have representative defects.
```

### 19.2 Standard Profile

Use when systems perform repeated tasks, tool use, or iterative repairs.

Required objects:

```text
Core Profile objects
Defect Ledger
Verifier Object
State Record
```

Additional invariants:

```text
Resolved defect families have guards or accepted-risk notes.
Mechanical verifiers declare scope and limitations.
State records cite evidence and verifier results.
```

### 19.3 Full SGAR Profile

Use when systems are long-horizon, multi-agent, high-value, or stateful.

Required objects:

```text
Standard Profile objects
GEO
Transition Contract
State Transition events
Rollback records
```

Additional invariants:

```text
Critical progress requires committed state transition.
Context narrative alone cannot update hard state.
Transition contracts define precondition, observation, verifier, commit condition, and rollback condition.
```

---

## 20. Mapping Objects to Primitive Mismatches

Each primitive mismatch has characteristic governed objects.

| Mismatch | Primary objects | Typical deltas | Typical guards |
|---|---|---|---|
| Observation-representation | Evidence Object, representation GKO, schema/value binding GKO | change observation channel, add representation schema, require tool inspection | variable-presence check, value-grounding check, raw-log availability check |
| State | State hypothesis GKO, State Record, Transition Contract | add state discriminator, branch policy, require clarification | state-disambiguation check, transition consistency check |
| Fitting-boundary | Routing Rule GKO, capability boundary tests | change router, add activation/suppression condition | routing check, boundary perturbation test |
| Support | Search policy GKO, candidate expansion GEO | expand candidate set, add rare-structure generator | candidate coverage check, low-support pattern check |
| Aggregation | Composition Rule GKO, dependency graph, artifact verifier | add global invariant, change rendering order, enforce dependency | invariant check, nonlocal consistency check |
| Specification | Rubric GKO, success condition GKO, human judgment evidence | revise rubric, add counterexample, change evaluator | rubric counterexample check, proxy-risk check |

The object model is useful because it turns mismatch diagnosis into repair routing. The question is no longer merely “what went wrong?” but “which governed object must change?”

---

## 21. Text-to-SQL Instantiation

This section gives a compact end-to-end example of the object model in a text-to-SQL system.

### 21.1 Direct Generation Failure

A direct system receives a natural language question and a database schema, then produces SQL:

```text
natural language question + database schema → SQL
```

It produces a SQL candidate that executes but returns an empty result set. The fluent explanation claims the query is correct.

A governed system does not treat the explanation as authoritative. It creates evidence:

```json
{
  "id": "evidence.sql.execution_result.014",
  "object_kind": "evidence",
  "evidence_type": "execution_result",
  "summary": "SQL executed successfully but returned zero rows.",
  "authority_level": "mechanical"
}
```

It audits the candidate and creates a finding:

```text
finding: value predicate uses ungrounded surface form
mismatch_type: observation_representation
control_object_ref: value_binding_table.status_column
mechanism_axis: belief_representation
repair_layer: agent
```

It derives a control delta:

```text
create GKO requiring value grounding before predicate rendering
```

It registers a guard:

```text
literal predicate must match observed values or normalization map
```

It updates the defect ledger:

```text
defect family: ungrounded_literal_predicate
status: mitigated
```

It commits state only if the repair passes execution and semantic audit:

```text
S + repaired SQL action → execution result + semantic audit → verifier pass → S'
```

### 21.2 Governed SQL Construction Objects

A mature text-to-SQL system may use these objects:

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

The final SQL is rendered from these control objects rather than generated as a single ungoverned continuation.

---

## 22. Governance Failure Modes

The object model can fail. The following failure modes should be explicitly audited.

### 22.1 Object Bloat

Too many objects accumulate, making retrieval, priority, and rendering unstable.

Mitigations:

```text
scope narrowing
object compaction
supersession
archive stale objects
summarize low-authority objects
```

### 22.2 Stale Authority

Old GKOs continue to govern after their evidence or domain has changed.

Mitigations:

```text
revocation triggers
lifespan policies
state dependency checks
periodic contradiction audit
```

### 22.3 Regression Theater

Guards exist but do not fail when representative defects recur.

Mitigations:

```text
teeth proof
mutation-style defect injection
guard audit
false-negative tracking
```

### 22.4 Verifier Poisoning

A verifier becomes unreliable, gamed, stale, or mis-scoped.

Mitigations:

```text
verifier scope declaration
verifier limitation records
cross-verification
verifier revocation triggers
```

### 22.5 Hard-State Drift

State records are committed based on weak observations or narrative claims.

Mitigations:

```text
transition contracts
mechanical evidence where available
commit records
rollback policies
```

### 22.6 Over-Governance

Governance adds latency, conflicts, brittle rules, or overfitting in low-mismatch tasks.

Mitigations:

```text
profile selection
cost-benefit threshold
soft object strength
on-demand governance
revocation of low-yield rules
```

### 22.7 Hidden Conflict

Two active objects give contradictory guidance without explicit conflict edges.

Mitigations:

```text
conflict detection
priority rules
scope-specific resolution
human review for critical conflicts
```

---

## 23. Cost-Benefit Rule for Governance

Governance should be selective.

A system should apply heavier governance when the following inequality holds:

```text
P(failure without governance)
× value at stake
× expected reachability gain
>
governance cost + governance-induced risk
```

Where governance cost includes:

```text
token cost
latency
implementation complexity
human review burden
tool cost
state management overhead
```

And governance-induced risk includes:

```text
overfitting to rules
object conflict
false authority
stale constraints
lost flexibility
incorrect verifier dominance
```

This rule is intentionally qualitative unless a system has reliable cost and value estimates. Its purpose is to prevent the object model from becoming a universal burden.

---

## 24. Audit-of-Audit Requirements

A governed system should audit its own governance layer.

The following meta-questions should be answerable:

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

A minimal audit-of-audit finding is itself an Audit Finding with `mechanism_axis = unknown` or a specific mechanism attribution, while `target_object_refs` can point to a `gko`, `verifier`, `guard`, or `transition_contract` that should change.

---

## 25. Conformance Checklist

A system conforms to the Core Profile if it satisfies the following:

```text
[ ] Active GKOs include scope, support_scope, strength, and revocation_trigger.
[ ] Audit Findings include mismatch_type and control_object_ref, plus mechanism attribution when operationalized.
[ ] Control Deltas reference findings or explicit rationales.
[ ] Regression Guards include representative_defect and failure_predicate.
[ ] Evidence Objects identify authority_level and limitations.
```

A system conforms to the Standard Profile if it additionally satisfies the following:

```text
[ ] Defect Ledger entries track recurrence and mitigation.
[ ] Verifier Objects declare scope, pass/fail conditions, limitations, and revocation triggers.
[ ] State Records cite evidence and verifiers.
[ ] Resolved defects have guards or accepted-risk notes.
```

A system conforms to the Full SGAR Profile if it additionally satisfies the following:

```text
[ ] Critical state changes use Transition Contracts.
[ ] Transition Contracts define precondition, observation schema, verifier, commit condition, and rollback condition.
[ ] Context narrative alone cannot commit state.
[ ] Rollback or dispute paths exist for committed state.
[ ] GEOs track long-horizon tasks, actions, handoffs, and success conditions.
```

---

## 26. Compact JSON Type Index

The canonical object kinds are:

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

The canonical status vocabulary is object-specific, but common statuses are:

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

The canonical mismatch_type vocabulary is:

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

The canonical control-object vocabulary is:

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

The canonical mechanism-axis vocabulary is:

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

The canonical operationalization_status vocabulary is:

```text
direct
derived
partial
not_operationalized
```

The canonical repair_layer vocabulary is:

```text
agent
training
hybrid
unknown
```

---

## 27. Conclusion

This specification defines the object layer required for governed LLM systems. Its central purpose is to make value-preservation work durable. Failures should not vanish into conversation history. Repairs should not remain as ad hoc prompt changes. State should not be committed by narrative assertion. Verification should not be overridden by fluent confidence. Control knowledge should not be immortal, unscoped, or unrevocable.

The proposed object model turns LLM system improvement into a governed lifecycle:

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

The model is intentionally modular. Low-risk systems may use only the Core Profile. Repeated tool-using systems may use the Standard Profile. Long-horizon agents and high-value workflows should use the Full SGAR Profile.

The broader thesis is that high-value LLM systems require more than generation, retrieval, and critique. They require explicit governance of the objects through which task value is preserved.

---

## Appendix A: Minimal Core Object Set

For many systems, the following five objects are sufficient to begin:

```text
GKO
Evidence Object
Audit Finding
Control Delta
Regression Guard
```

Minimal lifecycle:

```text
1. Create GKO for important task rule.
2. Audit candidate artifact against active GKOs.
3. Convert failure into Audit Finding.
4. Derive Control Delta from finding.
5. Create Regression Guard for defect family.
6. Update or revoke GKO as evidence changes.
```

This minimal set already converts prompt iteration into governed repair.

---

## Appendix B: Example Minimal GKO

```json
{
  "id": "gko.example.must_cite_source_for_noncommon_factual_claims.v1",
  "object_kind": "gko",
  "version": "0.1.0",
  "status": "active",
  "gko_type": "rubric",
  "condition": "When generating factual claims that are not common knowledge.",
  "assertion": "Each non-common factual claim should be supported by a cited source or marked as uncertain.",
  "strength": "hard",
  "priority": 80,
  "scope": "research_answer_generation",
  "support_scope": "Improves traceability of factual answers.",
  "not_supported_claims": "Does not guarantee source correctness or eliminate interpretation error.",
  "evidence_refs": [],
  "lifespan": "persistent",
  "activation_policy": "Activate during factual answer generation and audit.",
  "rendering_policy": "Insert citation requirements into answer plan and audit checklist.",
  "verification_policy": "Check that factual claims have citations or uncertainty markers.",
  "revocation_trigger": "Revise if task setting explicitly forbids citations or if all claims are derived from provided context only.",
  "created_by": "human"
}
```

---

## Appendix C: Example Minimal Audit Finding

```json
{
  "id": "finding.example.uncited_factual_claim.001",
  "object_kind": "audit_finding",
  "version": "0.1.0",
  "status": "confirmed",
  "artifact_ref": "artifact.answer.001",
  "finding": "The answer makes a factual claim about a recent regulation without citation or uncertainty marker.",
  "evidence_refs": ["evidence.answer_span.001"],
  "mismatch_type": "specification",
  "severity": "medium",
  "confidence": "high",
  "failure_mode": "uncited_noncommon_factual_claim",
  "control_object_ref": "gko.example.must_cite_source_for_noncommon_factual_claims.v1",
  "control_object_type": "rubric",
  "mechanism_axis": "specification_reward",
  "operationalization_status": "direct",
  "root_cause_hypothesis": "The citation requirement was not represented in the active answer rubric.",
  "control_delta_refs": ["delta.example.add_citation_guard.v1"],
  "regression_guard_refs": ["guard.example.noncommon_claim_requires_citation.v1"],
  "not_a_failure_if": "The answer is explicitly constrained to use only provided material and the claim appears in that material.",
  "created_by": "hybrid"
}
```

---

## Appendix D: Example Minimal Control Delta

```json
{
  "id": "delta.example.add_citation_guard.v1",
  "object_kind": "control_delta",
  "version": "0.1.0",
  "status": "approved",
  "delta_type": "add_regression_guard",
  "source_finding_refs": ["finding.example.uncited_factual_claim.001"],
  "target_object_refs": ["gko.example.must_cite_source_for_noncommon_factual_claims.v1"],
  "proposed_change": "Add a regression guard that fails when non-common factual claims lack citations or uncertainty markers.",
  "patch": {
    "create_guard": "guard.example.noncommon_claim_requires_citation.v1"
  },
  "expected_effect": "Prevent recurrence of uncited factual claims in research answers.",
  "risk_assessment": "May over-trigger on common knowledge claims.",
  "required_verification": "Run guard against representative answers with cited and uncited claims.",
  "rollback_plan": "Downgrade guard to advisory if false positives are high.",
  "regression_guard_refs": ["guard.example.noncommon_claim_requires_citation.v1"]
}
```

---

## Appendix E: Example Minimal Regression Guard

```json
{
  "id": "guard.example.noncommon_claim_requires_citation.v1",
  "object_kind": "regression_guard",
  "version": "0.1.0",
  "status": "active",
  "guard_type": "rubric_check",
  "defect_family": "uncited_noncommon_factual_claim",
  "linked_findings": ["finding.example.uncited_factual_claim.001"],
  "linked_deltas": ["delta.example.add_citation_guard.v1"],
  "failure_predicate": "A non-common factual claim appears without citation or uncertainty marker.",
  "pass_predicate": "Every non-common factual claim has a citation, source pointer, or uncertainty marker.",
  "representative_defect": "A claim about a current law or product feature without citation.",
  "teeth_proof": "Representative defect fails the guard in test run guard_run.example.001.",
  "execution_method": "Claim extraction followed by citation/uncertainty audit.",
  "authority_level": "hybrid",
  "scope": "research_answer_generation",
  "false_positive_risk": "May flag common knowledge as non-common.",
  "false_negative_risk": "May miss implicit factual claims.",
  "revocation_trigger": "Revise if guard misses repeated uncited claims or over-flags common knowledge."
}
```
