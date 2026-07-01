# Fitting-Boundary Mismatch and Capability Routing in LLM Systems

**Capability Domains, Trigger Boundaries, and Router Governance**  
**Working Draft v0.1**  

---

## Abstract

Large language models often possess capabilities that are not reliably expressed in the situations where those capabilities are needed. Conversely, they may activate learned behaviors, expert registers, solution templates, refusal policies, safety rituals, or benchmark patterns in situations where those behaviors are not warranted. This paper develops **fitting-boundary mismatch** as a primitive failure mode in governed LLM systems: the mismatch between the true applicability domain of a capability and the domain in which the model or system actually activates that capability.

The core claim is simple:

```text
Capability present does not imply capability routed.
```

An LLM system may contain the knowledge, pattern, skill, tool, or reasoning routine required for a task, while still failing because the implicit router does not activate it. Conversely, a system may activate a capability because surface evidence resembles its training-time or prompt-induced trigger conditions, even when the task does not actually satisfy the capability's applicability conditions. These failures are not reducible to missing knowledge, insufficient probability support, specification ambiguity, state uncertainty, or aggregation failure. They occur at the **capability-routing station** of the world-to-output pipeline.

We formalize the problem by distinguishing the true applicability domain of a capability, `T_X`, from the model/system activation domain, `M_X`. Fitting-boundary mismatch occurs when:

```text
M_X ≠ T_X
```

The two elementary forms are:

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

The paper situates fitting-boundary mismatch inside the structural theory of value preservation in LLM systems. In the value-preservation pipeline:

```text
S_world → O → Z → capability routing → candidate support → aggregation → evaluation
```

fitting-boundary mismatch occupies the routing station:

```text
Z → trigger evidence → implicit router → activated capability set
```

The paper then develops a practical theory of capability routing: capability profiles, trigger evidence, suppressors, role attractors, boundary perturbations, router deltas, routing GKOs (Governed Knowledge Objects), and boundary regression guards. It shows how fitting-boundary mismatch interacts with Knowledge Governance, Audit Engineering, and the State-Governed Agent Regime (SGAR). The goal is to turn capability activation from an implicit side effect of prompt surface form into an auditable, revisable, state-aware control layer.

### Relationship to the Diagnostic–Mechanism Bridge

This document uses fitting-boundary mismatch as a value-preservation diagnosis. When a failure requires repair, the Diagnostic–Mechanism Bridge maps that diagnosis to an eight-axis mechanism target and a repair layer:

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

### Mechanism-Layer Mapping

Fitting-boundary mismatch maps primarily to `capability_routing`, whose formal mechanism-side component is `r_θ`.

```text
wrong trigger boundary
  → repair_target = capability_routing
  → repair_layer = agent | training | hybrid
```

At the agent layer, the repair is typically a routing GKO, router trace, trigger rule, suppressor rule, or explicit mode-binding change. If the same boundary error recurs across tasks and cannot be stabilized by runtime governance alone, it should be promoted to mechanism-driven training.

---

## Contents

The paper moves from definition to diagnosis to repair. Sections 1–4 establish what fitting-boundary mismatch is and why it is distinct. Sections 5–10 describe the routing pipeline and how to diagnose boundary failures. Sections 11–21 cover router governance and its design patterns. Sections 22–26 work through concrete examples, and sections 27–32 close with formal claims, costs, and a practical checklist.

- [1. Introduction](#1-introduction)
- [2. Position in the Structural Theory of Value Preservation](#2-position-in-the-structural-theory-of-value-preservation)
- [3. Core Definition](#3-core-definition)
- [4. Capability Is Not Behavior](#4-capability-is-not-behavior)
- [5. A Capability-Routing Pipeline](#5-a-capability-routing-pipeline)
- [6. Trigger Evidence, Suppressors, and Attractors](#6-trigger-evidence-suppressors-and-attractors)
- [7. Failure Morphology](#7-failure-morphology)
- [8. Distinguishing Fitting-Boundary Mismatch from Other Mismatches](#8-distinguishing-fitting-boundary-mismatch-from-other-mismatches)
- [9. Why Fitting-Boundary Mismatch Matters for LLM Mediocrity](#9-why-fitting-boundary-mismatch-matters-for-llm-mediocrity)
- [10. Diagnostic Methods](#10-diagnostic-methods)
- [11. Router Governance](#11-router-governance)
- [12. Routing GKOs](#12-routing-gkos)
- [13. Audit Engineering for Fitting-Boundary Mismatch](#13-audit-engineering-for-fitting-boundary-mismatch)
- [14. Boundary Regression Guards](#14-boundary-regression-guards)
- [15. Interaction with State-Governed Agent Regime](#15-interaction-with-state-governed-agent-regime)
- [16. Interaction with Knowledge Governance](#16-interaction-with-knowledge-governance)
- [17. Interaction with Support Mismatch](#17-interaction-with-support-mismatch)
- [18. Interaction with Specification Mismatch](#18-interaction-with-specification-mismatch)
- [19. Interaction with Observation-Representation Mismatch](#19-interaction-with-observation-representation-mismatch)
- [20. Interaction with Aggregation Mismatch](#20-interaction-with-aggregation-mismatch)
- [21. Design Patterns for Capability Routing](#21-design-patterns-for-capability-routing)
- [22. Example: Text-to-SQL](#22-example-text-to-sql)
- [23. Example: Code Repair](#23-example-code-repair)
- [24. Example: Quantitative Research and Strategy Design](#24-example-quantitative-research-and-strategy-design)
- [25. Example: Safety and Refusal](#25-example-safety-and-refusal)
- [26. Example: Research and Theory Writing](#26-example-research-and-theory-writing)
- [27. Capability Routing as Control-Space Search](#27-capability-routing-as-control-space-search)
- [28. Formal Claims](#28-formal-claims)
- [29. Cost and Risk of Router Governance](#29-cost-and-risk-of-router-governance)
- [30. Revocation Triggers for Fitting-Boundary Claims](#30-revocation-triggers-for-fitting-boundary-claims)
- [31. Practical Checklist](#31-practical-checklist)
- [32. Conclusion](#32-conclusion)

---

## 1. Introduction

A common description of LLM failure is that the model “does not know” something or “cannot reason” in a particular way. This description is often too coarse. In many tasks, the model can demonstrate the relevant capability when asked directly, when placed in a different prompt frame, when given a minimal example, when shown a counterexample, or when routed through a specialized procedure. Yet in the original task context, the capability remains inactive. The model does something else: it follows a generic template, adopts an irrelevant expert persona, over-applies a safety pattern, writes plausible boilerplate, performs shallow analogy, or produces a fluent answer that bypasses the real operation.

This is not primarily a knowledge failure. It is a routing failure.

The same phenomenon appears in the opposite direction. A model may activate a capability too eagerly because a prompt contains superficial trigger words. It may see “risk” and enter a cautious compliance mode, see “SQL” and emit a memorized query template, see “audit” and produce a checklist, see “alignment” and switch into AI-safety rhetoric, see “legal” and refuse or over-hedge, see “benchmark” and solve to metric rather than meaning, or see “expert” and imitate expertise rather than perform the specific operation required.

The learned behavior is real. The problem is that its boundary is wrong.

This paper calls this failure mode **fitting-boundary mismatch**. A capability has a true applicability domain: the set of situations where using it would improve task value. The model or system has an activation domain: the set of situations where the capability is actually triggered. When these sets diverge, the system can fail even if the capability exists, the relevant information is present, the correct answer has sufficient support, and the objective is reasonably specified.

In the broader structural theory of governed LLM systems, fitting-boundary mismatch is one of six primitive mismatches:

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

Its distinct role is to explain failures in **capability activation**. The question is not:

```text
Does the system have the information?
Does the system have the latent state?
Does the correct output exist in the candidate space?
Can local pieces compose?
Is the objective correctly specified?
```

The question is:

```text
Given the available representation, which learned capability does the system actually activate?
```

This question is central because modern LLM systems are not single homogeneous policies. They are mixtures of behaviors, roles, tools, memories, prompt routines, latent skills, refusal heuristics, search procedures, validators, and style regimes. A high-value system must not only contain useful capabilities; it must route them to the right cases.

---

## 2. Position in the Structural Theory of Value Preservation

The unified theory of value preservation models LLM systems as a world-to-output pipeline:

```text
S_world
  -- φ --> O
  -- ψ --> Z
  -- ρ --> C
  -- pθ --> K
  -- A --> Y
  -- Ũ --> evaluation / selection
```

where:

- `S_world` is the underlying world, database, user need, codebase, environment, or task situation.
- `φ` is observation: sensing, data access, retrieval, user input, instrumentation, or tool calls.
- `O` is the observed material.
- `ψ` is representation: encoding, compression, schema extraction, prompt construction, tokenization, indexing, or context formatting.
- `Z` is the operational representation available to the model/system.
- `ρ` is routing: the mechanism that activates capabilities, tools, roles, policies, or reasoning procedures.
- `C` is the active capability set.
- `pθ` is the model/system policy over candidate artifacts.
- `K` is the reachable candidate space under the budget and search procedure.
- `A` is aggregation: the procedure that composes local decisions into a global artifact.
- `Y` is the output or action sequence.
- `Ũ` is the accessible evaluator or proxy.
- `U` is the true task utility.

Fitting-boundary mismatch sits at:

```text
Z -- ρ --> C
```

It is the failure of capability routing.

This position matters. If the decisive variable never enters `Z`, the failure is observation-representation mismatch. If `Z` is insufficient to infer the relevant latent state, the failure is state mismatch. If the capability is not activated despite being appropriate, or activated despite being inappropriate, the failure is fitting-boundary mismatch. If the capability is active but the correct structure has low probability under the policy, the failure is support mismatch. If local capability outputs fail to compose, the failure is aggregation mismatch. If the evaluator rewards the wrong thing, the failure is specification mismatch.

Fitting-boundary mismatch is therefore not an optional add-on to the taxonomy. It corresponds to a structurally distinct station in the pipeline.

---

## 3. Core Definition

Let `X` denote a capability, behavior, tool, strategy, role, reasoning routine, audit pattern, refusal policy, or generation mode.

Define:

```text
T_X = the true applicability domain of X
M_X = the model/system activation domain of X
```

`T_X` contains the situations where activating `X` would improve task value under the true utility `U`.

`M_X` contains the situations where the system actually activates `X` under its prompt, context, model priors, routing rules, tool policies, memory, or latent behavior.

**Fitting-boundary mismatch** occurs when:

```text
M_X ≠ T_X
```

The elementary cases are:

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

Over-triggering means the system activates `X` where `X` should not apply. Under-triggering means the system fails to activate `X` where `X` should apply.

A perfect router would satisfy:

```text
M_X = T_X
```

In practice, this is rarely possible. The goal is not perfect routing. The goal is to make routing boundaries explicit enough to audit, revise, suppress, escalate, and govern.

---

## 4. Capability Is Not Behavior

A central distinction is:

```text
Capability availability ≠ capability activation ≠ capability correctness
```

A model may be capable of performing a reasoning operation in isolation. That does not mean the operation will be activated in a complex task. It also does not mean that, once activated, the operation will be applied correctly.

We can distinguish four levels:

```text
1. Latent capability
2. Triggered capability
3. Correctly scoped capability
4. Successfully executed capability
```

A system may fail at any level.

For example, an LLM may demonstrate schema-linking ability when directly asked to inspect a database schema. But in a text-to-SQL prompt, it may immediately emit SQL without performing schema-linking. The capability exists but is not triggered.

Similarly, a model may be able to write precise code patches, but when asked to “fix the bug,” it may over-trigger explanation mode, produce a generic diagnosis, or modify unrelated code because the router bound the task to the wrong repair pattern.

Fitting-boundary mismatch focuses on the second and third levels: whether a capability is activated, and whether it is activated within its true scope.

---

## 5. A Capability-Routing Pipeline

The routing station can be decomposed into a smaller internal pipeline:

```text
Z
  → trigger evidence E_X
  → implicit router ρ
  → activated capability set C
  → capability interaction / suppression
  → behavior B
  → candidate generation
```

Where:

- `Z` is the operational representation.
- `E_X` is evidence that capability `X` should apply.
- `ρ` is the routing mechanism.
- `C` is the set of active capabilities.
- Capability interaction determines whether active capabilities reinforce, suppress, or override each other.
- `B` is the resulting behavior pattern.

The router is usually implicit. It is induced by:

```text
prompt wording
role instructions
training priors
instruction hierarchy
context examples
tool availability
retrieved documents
format constraints
safety policies
memory summaries
previous turns
benchmark conventions
human feedback priors
```

Because the router is implicit, capability activation is often misdiagnosed as capability absence. The system appears unable to do the task, but the deeper issue is that it was never placed into the mode in which its useful capability becomes active.

---

## 6. Trigger Evidence, Suppressors, and Attractors

A capability is rarely triggered by a complete proof that it applies. It is triggered by evidence patterns.

Examples of trigger evidence include:

```text
keywords
file extensions
schema shapes
question genre
style markers
tool names
benchmark labels
user authority cues
risk words
mathematical notation
programming language syntax
legal or medical terms
phrases like “audit,” “optimize,” “prove,” “summarize,” or “debug”
```

These triggers are often useful, but they are not identical to true applicability.

A **suppressor** is evidence or instruction that inhibits a capability. For example:

```text
“be concise” may suppress state enumeration.
“do not overthink” may suppress audit.
“just answer” may suppress tool use.
“this is simple” may suppress boundary checks.
“expert tone” may suppress uncertainty disclosure.
“safety-sensitive” may suppress benign assistance.
```

An **attractor** is a behavior basin that the model enters and then continues to reinforce. Examples include:

```text
expert-caution attractor
benchmark-solver attractor
refusal attractor
boilerplate-policy attractor
template-code-fix attractor
surface-summary attractor
academic-theory attractor
risk-management attractor
Socratic-clarification attractor
```

Attractors matter because fitting-boundary mismatch is often path-dependent. Once a capability attractor becomes active, subsequent tokens may justify, elaborate, and stabilize that behavior. This creates a self-reinforcing boundary error.

---

## 7. Failure Morphology

Fitting-boundary mismatch has several recurring forms.

### 7.1 Over-Triggering

Over-triggering occurs when a capability activates outside its true domain.

Examples:

```text
A safety refusal activates for a harmless request.
A legal disclaimer activates where practical explanation is requested.
A generic risk-control mode activates for a strategy-design task.
A SQL template activates before schema inspection.
A benchmark-answering pattern activates where semantic analysis is needed.
An academic-summary mode activates where a formal construction is needed.
```

Over-triggering often produces outputs that look responsible, expert, or coherent while bypassing the task's true operation.

### 7.2 Under-Triggering

Under-triggering occurs when a needed capability fails to activate.

Examples:

```text
The system does not call a tool when the answer depends on external state.
The system does not run tests before declaring a code patch fixed.
The system does not inspect database values before binding a predicate.
The system does not perform state enumeration before choosing a plan.
The system does not trigger adversarial review before accepting a specification.
The system does not activate global consistency checking before rendering a final artifact.
```

Under-triggering is especially dangerous because the output may appear plausible and confident. The missing capability is invisible unless the system is audited for non-activation.

### 7.3 Wrong Capability Binding

A task may trigger a real capability, but bind it to the wrong object.

Examples:

```text
The system audits style when it should audit semantics.
The system checks syntax when it should check invariants.
The system explains a bug when it should localize the failing state.
The system summarizes a theory when it should derive its structural commitments.
The system generates code when it should inspect the test failure.
```

This is not absence of audit or reasoning. It is misbinding.

### 7.4 Capability Collision

Multiple capabilities may activate simultaneously and interfere.

Examples:

```text
Conciseness suppresses necessary uncertainty tracking.
Helpfulness suppresses refusal or safety checking.
Safety checking suppresses harmless technical assistance.
Expert tone suppresses explicit assumptions.
Creative generation suppresses verification.
Formal proof mode suppresses empirical grounding.
```

Capability collision requires arbitration. Without explicit arbitration, the dominant attractor wins.

### 7.5 Role Attractor Capture

A role can become an attractor that overrides task structure.

For example, “act as a senior researcher” may improve terminology and framing, but it may also produce confident theoretical prose when the real task is to define revocation triggers, schemas, or boundary conditions. “Act as a database expert” may trigger SQL fluency, but not necessarily database inspection.

Role instructions are routing interventions. They must be governed as such.

### 7.6 Support Without Activation

The correct candidate may exist in the model's support, but the capability needed to reach it is not active.

This distinguishes fitting-boundary mismatch from support mismatch. In support mismatch, the correct structure is low-reachability even under the right capability. In fitting-boundary mismatch, the structure may be reachable under capability `X`, but `X` is not triggered.

### 7.7 Activation Without Applicability

A capability may activate strongly despite being unsupported by the task conditions. This produces a false sense of competence. The model performs a legitimate routine in an illegitimate context.

Examples:

```text
Performing causal explanation from purely correlational evidence.
Applying theorem-proof style to a task requiring design tradeoffs.
Using generic financial risk doctrine for a specific event-driven alpha construction.
Using moralized safety language for a benign operational request.
```

### 7.8 Boundary Drift Across Turns

In multi-turn settings, capability boundaries can drift. A capability that was appropriate earlier may remain active after the task changes. Or a capability suppressed in one turn may remain suppressed after it becomes necessary.

This connects fitting-boundary mismatch to SGAR: routing state should not be inferred merely from conversational momentum.

---

## 8. Distinguishing Fitting-Boundary Mismatch from Other Mismatches

Fitting-boundary mismatch is easiest to understand by contrast.

### 8.1 Not Observation-Representation Mismatch

Observation-representation mismatch asks:

```text
Did the decisive variable enter Z?
```

Fitting-boundary mismatch asks:

```text
Given Z, did the right capability activate?
```

If the schema is missing from the prompt, the problem is observation-representation. If the schema is present but the system does not inspect it, the problem is fitting-boundary.

### 8.2 Not State Mismatch

State mismatch asks:

```text
Which latent state are we in?
```

Fitting-boundary mismatch asks:

```text
Which capability did we activate for this represented situation?
```

The two interact. A wrong state hypothesis can trigger the wrong capability. But the repair targets differ: state mismatch requires better state discrimination; fitting-boundary mismatch requires better capability routing.

### 8.3 Not Support Mismatch

Support mismatch asks:

```text
Is the high-value structure reachable under the active policy and budget?
```

Fitting-boundary mismatch asks:

```text
Was the appropriate policy or capability activated in the first place?
```

If the system is routed to the right capability but still cannot generate the rare structure, support is the bottleneck. If the rare structure would be reachable under a different capability that was not activated, routing is the bottleneck.

### 8.4 Not Aggregation Mismatch

Aggregation mismatch asks:

```text
Do locally good parts compose into a globally good artifact?
```

Fitting-boundary mismatch asks:

```text
Were the right local operations selected?
```

A system may fail aggregation even with correct routing. Conversely, a system may route to a local operation that is inappropriate from the start.

### 8.5 Not Specification Mismatch

Specification mismatch asks:

```text
Does the accessible evaluator represent true utility?
```

Fitting-boundary mismatch asks:

```text
Did the system activate the capability appropriate to the task conditions?
```

A vague or wrong specification can induce routing failures, but routing can fail even when the specification is clear.

---

## 9. Why Fitting-Boundary Mismatch Matters for LLM Mediocrity

LLM mediocrity often appears as a failure to leave an attractive behavior basin.

The output is not nonsensical. It is locally defensible under the active capability. The problem is that the active capability is not the one that determines task value.

This explains a common pattern:

```text
The model gives a good answer to the wrong subtask.
```

Examples:

```text
It writes a polished summary instead of constructing the control model.
It produces a safe disclaimer instead of performing the benign requested operation.
It writes plausible SQL instead of grounding schema and values.
It provides generic debugging advice instead of localizing the failing invariant.
It describes methodology instead of committing to a concrete transition contract.
It writes expert-sounding financial caution instead of deriving an executable signal operator.
```

These outputs can score well under shallow review because the active capability is real. The system is not simply bad. It is doing the wrong good thing.

This is why fitting-boundary mismatch is central to the local alignment regime. Many model capabilities are locally aligned: summarization, stylistic control, caution, generic expertise, analogy, explanation, decomposition, code fluency, SQL fluency, mathematical notation, safety sensitivity. But local alignment becomes harmful when routed across the wrong boundary.

---

## 10. Diagnostic Methods

Fitting-boundary mismatch should be audited directly. The central diagnostic question is:

```text
Did the system fail because the capability was absent, or because it was not routed correctly?
```

### 10.1 Capability Elicitation Probe

Ask whether the system can perform capability `X` in isolation.

```text
Original task failed.
Directly ask for the missing operation.
If the system can perform it, capability absence is unlikely.
```

This distinguishes latent capability from activation failure.

### 10.2 Minimal Boundary Pair

Construct two minimally different inputs:

```text
Case A: X should apply.
Case B: X should not apply.
```

A well-routed system activates `X` in A and suppresses it in B.

If it activates in both, there is over-triggering. If it activates in neither, there is under-triggering. If it activates inconsistently under irrelevant surface changes, the boundary is unstable.

### 10.3 Trigger Perturbation

Change superficial trigger evidence while holding true applicability constant.

Examples:

```text
Remove expert labels.
Change task framing.
Replace keywords with paraphrases.
Hide benchmark names.
Change role instructions.
Alter stylistic markers.
```

If activation changes despite unchanged applicability, the router is over-reliant on surface triggers.

### 10.4 Counterfactual Activation

Force capability `X` to activate and compare the result.

```text
Original route → output Y
Forced route X → output Y_X
```

If `Y_X` repairs the failure, the original issue was likely under-triggering.

This should be used carefully. Forced activation can also create over-triggering. The goal is diagnosis, not permanent coercion.

### 10.5 Suppression Test

Suppress capability `X` and observe whether output improves or degrades.

```text
If suppressing X improves the result, X may be over-triggered.
If suppressing X degrades the result, X may be necessary.
```

This is useful for expert-tone, refusal, caution, template, or generic explanation attractors.

### 10.6 Router Trace Audit

Ask the system to explicitly state:

```text
Which capabilities are relevant?
Which were activated?
Which were suppressed?
What evidence supports each activation?
What would make the activation invalid?
```

The trace is not authoritative, but it can expose missing boundary conditions and candidate router deltas.

### 10.7 Negative Control

Include cases where capability `X` should clearly not apply. If the system activates `X` anyway, the trigger is too broad.

### 10.8 Non-Activation Audit

For high-risk tasks, audit not only what the system did, but what it failed to activate.

A non-activation audit asks:

```text
Which capabilities should have been considered but were absent from the trace?
Which tools were available but unused?
Which validators were not invoked?
Which state hypotheses were not enumerated?
Which failure modes were not checked?
```

This is essential because under-triggering is often invisible in the final artifact.

---

## 11. Router Governance

The repair for fitting-boundary mismatch is not simply “prompt better.” It is to govern the router.

Router governance makes capability activation explicit, auditable, and revisable.

A governed router should maintain:

```text
capability inventory
applicability conditions
trigger evidence
suppressor evidence
priority / arbitration rules
scope limits
revocation triggers
regression guards
state dependencies
```

### 11.1 Capability Inventory

A capability inventory records what operations the system may activate.

Example categories:

```text
observation repair
schema inspection
state enumeration
hypothesis generation
tool invocation
candidate expansion
constraint solving
semantic audit
syntax audit
safety review
execution verification
regression guard synthesis
final rendering
```

A capability inventory prevents a system from treating the LLM as a single undifferentiated generator.

### 11.2 Applicability Conditions

Each capability should have applicability conditions.

For example:

```text
Capability: schema audit
Applies when: task depends on database structure, table relationships, column semantics, or value grounding.
Does not apply when: schema is irrelevant or already validated.
```

### 11.3 Trigger and Suppressor Rules

Trigger rules define evidence that should activate a capability. Suppressor rules define evidence that should inhibit or downgrade it.

A trigger should not be a mere keyword. It should be connected to task value.

Weak trigger:

```text
If the prompt contains “SQL,” generate SQL.
```

Governed trigger:

```text
If the task requires SQL over an unfamiliar schema, activate schema audit before SQL rendering.
```

### 11.4 Capability Arbitration

When capabilities conflict, the system needs arbitration rules.

Examples:

```text
If execution feedback contradicts model explanation, execution feedback dominates.
If safety policy conflicts with benign task assistance, route to policy disambiguation rather than immediate refusal.
If conciseness conflicts with required state enumeration, state enumeration dominates until state is resolved.
If final rendering conflicts with unresolved control objects, rendering is blocked.
```

### 11.5 Router Delta

A router delta is a localized change to routing behavior induced by an audit finding.

Examples:

```text
Add schema audit before rendering SQL for unseen schemas.
Suppress generic risk-caution mode when the task asks for operator construction.
Activate execution verification before declaring code repair complete.
Require state enumeration when the same observation supports multiple policies.
```

---

## 12. Routing GKOs

A routing GKO is a governed knowledge object that controls capability activation.

A minimal schema:

```json
{
  "id": "gko.routing.schema_audit_before_sql_rendering",
  "type": "routing_rule",
  "capability": "schema_audit",
  "condition": "The task requires SQL generation over a nontrivial or unfamiliar database schema.",
  "trigger_evidence": [
    "question references database entities",
    "schema contains multiple related tables",
    "column names are ambiguous",
    "value grounding may affect predicates"
  ],
  "suppressor_evidence": [
    "schema and join path already verified",
    "task is only about SQL syntax independent of schema"
  ],
  "activation": "must_activate_before_sql_rendering",
  "priority": "high",
  "strength": "hard",
  "evidence": "Prior failures from plausible SQL generated before schema inspection.",
  "revocation_trigger": "If schema audit repeatedly adds no information in a well-defined low-complexity class, downgrade to soft trigger.",
  "not_supported_claims": "Does not imply that schema audit alone guarantees semantic correctness."
}
```

Routing GKOs are especially important because they govern behavior before final generation. They decide what the model is allowed to do next.

---

## 13. Audit Engineering for Fitting-Boundary Mismatch

In Audit Engineering, a fitting-boundary finding should identify whether the failure came from over-triggering, under-triggering, misbinding, collision, or drift.

A fitting-boundary audit finding can use this schema:

```json
{
  "id": "finding.fitting_boundary.unique_id",
  "artifact": "The candidate output or action trace being audited.",
  "finding": "The system generated final SQL before activating schema-linking and join-path audit.",
  "mismatch_type": "fitting_boundary",
  "subtype": "under_triggering",
  "capability": "schema_linking_and_join_path_audit",
  "true_domain": "SQL tasks over unfamiliar multi-table schemas.",
  "model_activation_domain_observed": "Only activated when explicitly instructed after failure.",
  "evidence": [
    "The trace contains no schema inspection step.",
    "The final SQL joins tables through an unsupported path.",
    "When asked directly to inspect joins, the model identifies the correct path."
  ],
  "repair_target": "router",
  "control_delta": "Add routing GKO requiring schema-linking before SQL rendering for multi-table schemas.",
  "regression_guard": "Given a multi-table schema with ambiguous joins, the system must produce a schema-linking artifact before final SQL."
}
```

The key is that the repair target is the router, not the final artifact alone.

---

## 14. Boundary Regression Guards

A boundary regression guard checks whether a routing fix remains effective.

A good guard tests both sides of the boundary:

```text
Positive case: capability should activate.
Negative case: capability should not activate.
```

For capability `X`, the guard should verify:

```text
Activate X when T_X holds.
Suppress X when T_X does not hold.
Escalate when T_X is uncertain.
```

A boundary guard has teeth only if it fails when a representative routing defect is reintroduced.

Examples:

```text
If schema audit is removed, the guard should fail on ambiguous multi-table SQL cases.
If refusal is over-triggered, the guard should fail on benign requests with superficial risk words.
If execution verification is skipped, the guard should fail on code repair tasks with hidden failing tests.
If state enumeration is skipped, the guard should fail on observations compatible with multiple policies.
```

Boundary guards should include negative controls. Otherwise, a system can “fix” under-triggering by activating the capability everywhere, which merely converts under-triggering into over-triggering.

---

## 15. Interaction with State-Governed Agent Regime

Capability routing is not only a per-turn decision. In long-horizon systems, routing decisions become part of runtime state.

A system should record:

```text
which capabilities were activated
which were suppressed
why they were activated or suppressed
which routing GKOs applied
which router deltas were committed
which boundary guards passed
whether routing state should persist or expire
```

In SGAR terms:

```text
S + A → O → V → S'
```

A router update should not become authoritative merely because the model suggested it. It should be committed only when a transition contract is satisfied.

Example:

```text
S: Current router lacks schema-audit requirement.
A: Add routing GKO requiring schema audit before SQL rendering.
O: Re-run representative case; system produces schema-linking artifact and correct join path.
V: Boundary guard passes positive and negative cases.
S': Router GKO committed with scope and revocation trigger.
```

This prevents router drift and router folklore. Routing rules become stateful commitments rather than conversational suggestions.

---

## 16. Interaction with Knowledge Governance

Fitting-boundary mismatch shows why Knowledge Governance must govern not only facts and constraints, but also activation conditions.

A GKO may control:

```text
what is true
what is preferred
what must be checked
what state is assumed
what capability should activate
what capability should be suppressed
what evidence changes the route
```

This expands the role of GKOs from knowledge storage to **behavioral governance**.

Important GKO types for fitting-boundary mismatch include:

```text
routing_rule
capability_profile
trigger_condition
suppressor_condition
applicability_boundary
arbitration_rule
escalation_rule
role_binding_rule
```

Knowledge Governance turns routing into an explicit control surface.

---

## 17. Interaction with Support Mismatch

Fitting-boundary mismatch and support mismatch are tightly coupled.

A capability may define a better search distribution. If the capability is not activated, the high-value candidate may appear low-support. Conversely, if the capability is activated but the correct structure remains unreachable, the bottleneck is support.

This distinction matters for repair.

Routing repair:

```text
Activate schema-linking before SQL generation.
Activate theorem search before proof rendering.
Activate execution verification before code fix completion.
```

Support repair:

```text
Expand join-path candidates.
Search over proof skeletons.
Generate multiple patch hypotheses.
Enumerate rare operator combinations.
```

Often the right sequence is:

```text
1. Repair routing.
2. Then repair support within the activated capability.
```

Otherwise, the system may expand candidates in the wrong mode.

---

## 18. Interaction with Specification Mismatch

Specification controls routing. If the system does not know what counts as success, it may not know which capability to activate.

For example, if the task says “make this better,” the system may activate style improvement when semantic correction is required. If the prompt says “audit,” it may activate checklist production when counterexample search is required. If the metric rewards exact match, it may activate benchmark optimization rather than semantic preservation.

A specification repair may therefore need to include a router repair.

Example:

```text
Specification delta:
  Success requires semantic preservation under execution, not surface plausibility.

Router delta:
  Activate execution-guided verification before final answer.
```

This is a common compound mismatch:

```text
specification mismatch → routing mismatch → support / aggregation failure
```

---

## 19. Interaction with Observation-Representation Mismatch

Routing depends on representation. A capability cannot be triggered by evidence that never enters `Z`.

If a database schema is omitted, schema audit cannot be properly routed. If tool results are compressed into vague summaries, execution-debugging capability may not activate. If user constraints are lost during context compression, constraint-checking may be suppressed.

This yields a basic dependency:

```text
No trigger evidence in Z → unreliable routing
```

Therefore, channel governance precedes router governance.

The correct order is often:

```text
1. Ensure task-critical variables enter Z.
2. Ensure trigger evidence for relevant capabilities enters Z.
3. Govern activation boundaries.
4. Search or render under the activated capability.
```

---

## 20. Interaction with Aggregation Mismatch

A system may activate the right local capabilities but fail to coordinate them globally.

For example, a code assistant may activate test inspection, patch generation, and explanation, but aggregate them in the wrong order: it patches before localizing the test failure, then explains the patch without rerunning tests.

This is not merely routing or aggregation. It is their interaction.

A governed system may need **capability-ordering constraints**:

```text
state identification before action
schema audit before SQL rendering
execution verification before completion claim
specification repair before final scoring
regression guard before committing fix
```

Such constraints are both routing rules and aggregation rules. They govern not only which capability activates, but when it activates in the composition sequence.

---

## 21. Design Patterns for Capability Routing

### 21.1 Route-Then-Render

Do not render the final answer until the relevant capabilities have been selected and applied.

```text
Task → route → control objects → render
```

This is especially useful for SQL, code, plans, audits, legal analysis, medical triage, and research synthesis.

### 21.2 Boundary-First Prompting

Before performing the task, ask:

```text
Which capabilities are applicable?
Which are tempting but inappropriate?
Which checks must precede final rendering?
```

This reduces over-triggering by making capability selection explicit.

### 21.3 Positive and Negative Capability Examples

Provide examples where a capability should apply and where it should not.

This trains the local router inside the prompt or system procedure.

### 21.4 Capability Suppression

Sometimes the repair is to suppress a capability.

Examples:

```text
Suppress generic disclaimer mode.
Suppress direct final-answer mode until audit is complete.
Suppress template SQL rendering before schema linking.
Suppress stylistic rewriting when semantic invariants are unresolved.
```

### 21.5 Capability Escalation

When routing uncertainty is high, escalate rather than choose a capability prematurely.

Escalation options include:

```text
ask a clarifying question
query a tool
branch into multiple capability paths
request human review
construct a state matrix
perform an audit pass
```

### 21.6 Capability Portfolio Search

Instead of searching only over final outputs, search over capability sequences:

```text
route_1: schema audit → join search → SQL rendering → execution audit
route_2: direct SQL → execution audit → repair
route_3: value sampling → schema linking → predicate skeleton → SQL rendering
```

The candidate is not only an output. It is a route.

### 21.7 Router-as-Control-Object

Treat routing decisions as governed objects, not hidden prompt effects.

This enables:

```text
audit
revision
revocation
regression testing
state commitment
reuse across tasks
```

---

## 22. Example: Text-to-SQL

Text-to-SQL illustrates fitting-boundary mismatch clearly.

The direct generation attractor is strong:

```text
question + schema → SQL
```

But high-value performance often requires several capabilities before final SQL rendering:

```text
schema inspection
entity linking
value grounding
join-path search
predicate skeleton construction
aggregation check
execution audit
semantic repair
```

A common failure is:

```text
SQL fluency over-triggers.
Schema audit under-triggers.
```

The model produces plausible SQL, but the query uses a wrong join path, wrong column, wrong value normalization, or wrong aggregation.

A routing repair is:

```text
If schema is unfamiliar or multi-table, block final SQL rendering until schema-linking and join-path artifacts exist.
```

A boundary guard is:

```text
On ambiguous multi-table schema tasks, the trace must include table/column binding and join-path justification before final SQL.
On simple single-table syntax tasks, schema audit may be skipped.
```

This avoids both under-triggering and over-triggering.

---

## 23. Example: Code Repair

A code model may have several relevant capabilities:

```text
read stack trace
localize failing invariant
inspect tests
construct patch
run tests
minimize diff
explain change
```

A common fitting-boundary failure is that patch generation over-triggers before failure localization.

The model can write plausible patches. But the true task requires identifying the failing invariant, not merely editing code.

A routing rule:

```text
If a code repair task includes failing tests, activate failure localization before patch generation.
```

A suppressor:

```text
Suppress final completion claims until tests or equivalent verifiers pass.
```

A regression guard:

```text
For a representative failing test, the system must identify the failing condition and produce a verifier-backed patch before declaring completion.
```

---

## 24. Example: Quantitative Research and Strategy Design

In quantitative strategy design, LLMs often over-trigger generic risk-management or academic caution attractors.

These capabilities are not useless. Risk control, skepticism, and data hygiene matter. But they may be over-triggered when the task asks for mechanism-to-operator translation, event-conditioned signal construction, holding-period design, or execution-aware alpha generation.

Possible over-triggered capabilities:

```text
generic risk caveats
orthogonality rhetoric
factor-neutralization boilerplate
academic methodology summary
compliance-like caution
```

Possible under-triggered capabilities:

```text
mechanism decomposition
event-to-operator mapping
conditional alpha search
holding-period reasoning
microstructure constraint modeling
feature construction
backtest failure-mode audit
```

A routing repair is not “be more creative.” It is:

```text
Given a mechanism-level strategy request, activate operator construction before risk boilerplate.
Use risk analysis as an audit layer after candidate operator generation, not as the primary generation mode.
```

This preserves caution without letting it capture the route.

---

## 25. Example: Safety and Refusal

Safety policies are capabilities. They have true applicability domains and activation domains.

A refusal capability is appropriate when the request is unsafe, harmful, illegal, or disallowed. But it can over-trigger on benign requests containing risk-adjacent language.

Fitting-boundary analysis separates:

```text
true safety applicability
surface risk triggers
policy ambiguity
benign technical assistance
safe redirection
```

A governed router should support:

```text
activate refusal when policy conditions are met
activate clarification when applicability is uncertain
activate safe assistance when the task is benign
suppress moralized boilerplate when it does not improve safety or task value
```

This is not an argument for weakening safety. It is an argument for routing safety capabilities according to their true domain rather than superficial triggers.

---

## 26. Example: Research and Theory Writing

In research writing, LLMs often over-trigger summarization, literature-review, or polished-prose capabilities.

These are useful but insufficient when the task is to derive a structural theory, prove independence, define objects, formalize revocation triggers, or construct a unifying architecture.

A fitting-boundary failure appears when the system writes fluent conceptual prose instead of performing the structural operation.

A router repair:

```text
If the task asks for theory construction, activate:
  - claim decomposition
  - formal object definition
  - independence analysis
  - revocation-trigger construction
  - relation-to-existing-theory mapping
before polished exposition.
```

A suppressor:

```text
Suppress literature-summary mode unless the task explicitly asks for positioning.
```

This keeps writing from replacing theory construction.

---

## 27. Capability Routing as Control-Space Search

The system can search over outputs, but it can also search over routes.

A route is a sequence of capabilities:

```text
R = [X1, X2, ..., Xn]
```

The utility of a route depends on how it transforms the task before final rendering.

Instead of:

```text
sample many final answers
```

use:

```text
sample or construct candidate routes
apply route-specific control objects
audit route outputs
commit route improvements
```

This creates a new search space:

```text
capability-route space
```

For high-value tasks, route search may dominate output search. If the system is in the wrong capability mode, sampling more outputs merely explores the wrong basin.

---

## 28. Formal Claims

### 28.1 Boundary Independence Claim

Fitting-boundary mismatch is primitive under the value-preservation pipeline because one can hold observation, representation, state, support, aggregation, and specification fixed while changing only the capability activation boundary.

If task value changes under that intervention, routing is an independent failure station.

### 28.2 Capability-Existence Separation Claim

For many LLM systems:

```text
exists capability X
```

does not imply:

```text
X activates when T_X holds
```

and does not imply:

```text
X suppresses when T_X does not hold
```

Therefore, capability evaluation should include activation-domain evaluation, not merely elicitation.

### 28.3 Router-Support Coupling Claim

Support is conditional on routing.

```text
P(Y* | Z, route = X) may be high
P(Y* | Z, route ≠ X) may be low
```

A structure can appear low-support under the wrong route and high-support under the right route.

### 28.4 Boundary Guard Claim

A routing repair is incomplete unless it includes both positive and negative boundary guards.

Otherwise, repairing under-triggering by always activating the capability may introduce over-triggering.

### 28.5 State-Router Commitment Claim

In long-horizon systems, routing changes should be committed as hard state only after boundary verification. Otherwise, router drift can become persistent system behavior.

---

## 29. Cost and Risk of Router Governance

Router governance is not free.

Costs include:

```text
additional latency
more intermediate artifacts
token overhead
more complex control flow
possible route conflicts
more brittle meta-rules
human review burden
```

Risks include:

```text
router bureaucracy
frozen capability boundaries
overfitting to known failure cases
capability underuse due to excessive gating
meta-Goodhart on routing checks
adversarial trigger manipulation
conflicting GKOs
obsolete routing rules
```

Therefore, router governance should be selective.

It is most justified when:

```text
task value is high
wrong capability activation is costly
under-triggering is hard to observe from final output
capabilities conflict
state persists across turns
routing rules can be reused
external verification can test boundaries
```

It is less justified when:

```text
the task is low-risk and one-shot
the appropriate capability is obvious
local generation already aligns with value
routing overhead exceeds expected gain
```

---

## 30. Revocation Triggers for Fitting-Boundary Claims

The theoretical claim that fitting-boundary mismatch is primitive should itself be governed.

A self-audit GKO:

```json
{
  "id": "gko.fitting_boundary_mismatch_primitive_status",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as value-preservation pipelines with a capability-routing station.",
  "assertion": "Fitting-boundary mismatch is a primitive failure mode when the true applicability domain of a capability differs from its activation domain.",
  "strength": "structural-relative",
  "support_scope": "Failures where capability presence and capability activation can be separated.",
  "revocation_trigger": "Show that all such failures can be reduced to observation-representation, state, support, aggregation, or specification mismatch without losing intervention specificity.",
  "not_supported_claims": "Does not claim that every routing failure is easy to detect or that explicit routing always improves performance."
}
```

For individual routing GKOs, revocation triggers should include:

```text
capability no longer improves task value in its claimed domain
negative controls show over-triggering
positive controls show persistent under-triggering
new verifier invalidates the activation condition
state distribution changes
cost exceeds value gain
more precise routing rule supersedes the old rule
```

---

## 31. Practical Checklist

For a suspected fitting-boundary mismatch, ask:

```text
1. What capability, behavior, role, tool, or routine was needed?
2. Did the system possess that capability when elicited directly?
3. Did the capability activate in the original task?
4. If not, what trigger evidence was missing or suppressed?
5. If yes, was it actually applicable?
6. Was the capability bound to the right object?
7. Did another capability suppress or override it?
8. Did the route persist after it should have expired?
9. What router delta would repair the boundary?
10. What positive and negative boundary guards would test the repair?
11. Should the routing change become a GKO?
12. Should the routing change be committed into hard state?
```

For system design, maintain:

```text
capability inventory
routing GKOs
positive boundary cases
negative boundary cases
non-activation audits
router deltas
boundary regression guards
routing state records
revocation triggers
```

---

## 32. Conclusion

Fitting-boundary mismatch explains a major class of LLM system failures: the model has useful capabilities, but the system activates them in the wrong places or fails to activate them where they are needed.

This failure cannot be fully explained as missing knowledge, poor support, ambiguous state, bad aggregation, or wrong specification. It occurs at the capability-routing station of the value-preservation pipeline.

The core distinction is:

```text
T_X = where capability X should apply
M_X = where capability X actually activates
```

When:

```text
M_X ≠ T_X
```

the system is vulnerable to over-triggering, under-triggering, misbinding, capability collision, role attractor capture, and boundary drift.

The repair is router governance. Capability activation should become explicit, auditable, revisable, and state-aware. Routing GKOs define applicability conditions, trigger evidence, suppressors, arbitration rules, and revocation triggers. Audit Engineering converts routing failures into router deltas and boundary guards. SGAR commits verified routing changes into hard state.

The broader lesson is that high-value LLM systems require more than capabilities. They require governed capability boundaries.

```text
Capability present does not imply capability routed.
Capability routed does not imply capability applicable.
Capability applicable does not imply capability verified.
```

A governed LLM system must know not only what it can do, but when each thing it can do should actually be done.

---

## Appendix A: Compact Glossary

| Term | Definition |
|---|---|
| Capability | A learned behavior, tool use, role, strategy, reasoning routine, audit pattern, or generation mode. |
| True applicability domain `T_X` | The set of situations where capability `X` improves true task value. |
| Activation domain `M_X` | The set of situations where the system actually activates `X`. |
| Fitting-boundary mismatch | A mismatch between `T_X` and `M_X`. |
| Over-triggering | Activation of `X` outside its true domain. |
| Under-triggering | Failure to activate `X` inside its true domain. |
| Trigger evidence | Evidence that causes or should cause capability activation. |
| Suppressor | Evidence or instruction that inhibits capability activation. |
| Attractor | A self-reinforcing behavior basin. |
| Router | The implicit or explicit mechanism that selects active capabilities. |
| Router delta | A localized update to capability-routing behavior. |
| Routing GKO | A governed knowledge object that controls capability activation. |
| Boundary guard | A regression guard checking both positive and negative cases for capability activation. |

---

## Appendix B: Minimal Routing GKO Template

```json
{
  "id": "gko.routing.<capability>.<scope>",
  "type": "routing_rule",
  "capability": "Capability to activate or suppress",
  "condition": "When this routing rule applies",
  "trigger_evidence": [
    "Evidence supporting activation"
  ],
  "suppressor_evidence": [
    "Evidence supporting suppression or downgrade"
  ],
  "activation": "must_activate | may_activate | suppress | escalate | block_final_rendering_until_complete",
  "priority": "low | medium | high | critical",
  "strength": "hard | soft | heuristic | provisional",
  "evidence": "Why this rule exists",
  "revocation_trigger": "When to weaken, revise, or remove this rule",
  "not_supported_claims": "What this rule does not imply"
}
```

---

## Appendix C: Minimal Boundary Guard Template

```json
{
  "id": "guard.boundary.<capability>.<defect_family>",
  "capability": "Capability being tested",
  "positive_cases": [
    "Cases where capability should activate"
  ],
  "negative_cases": [
    "Cases where capability should not activate"
  ],
  "uncertain_cases": [
    "Cases where escalation is required"
  ],
  "pass_condition": "Activation, suppression, or escalation matches the applicability boundary.",
  "failure_condition": "Over-triggering, under-triggering, misbinding, or unverified activation occurs.",
  "teeth_condition": "Reintroducing the representative boundary defect makes this guard fail."
}
```
