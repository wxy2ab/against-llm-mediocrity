# Aggregation Mismatch and Compositional Governance in LLM Systems

**Subtitle:** Local Value, Global Failure, and the Governance of Composition  
**Status:** Working Draft v0.1  
**Series:** A Structural Theory of Value Preservation in LLM Systems

**Empirical companions:** [Artifact-v4 evidence, theory gaps, and agent implications](./aggregation-mismatch-v4-claims-theory-gap.md) · [Artifact-v5 stable editing agent](./aggregation-mismatch-v5-stable-editing-agent.md) · [Artifact-v7 mechanism recovery and deterministic delivery](./aggregation-mismatch-v7-mechanism-recovery.md) · [Artifact-v8 runtime ownership and semantic routing](./aggregation-mismatch-v8-runtime-ownership-routing.md) · [Artifact-v9 minimal scaffold and verifier receipt](./aggregation-mismatch-v9-minimal-scaffold-recovery.md) · [Artifact-v10 semantic contracts and runtime canonicalization](./aggregation-mismatch-v10-semantic-contract-canonicalization.md) · [Artifact-v11 address drift and configuration delivery](./aggregation-mismatch-v11-config-delivery-transfer.md) · [Artifact-v12 drift dose and delivery-scale routing](./aggregation-mismatch-v12-scale-routing-transfer.md) · [Patch vs. full rewrite controlled experiment](./patch-vs-full-rewrite-controlled-experiment.md)

---

## Abstract

Many LLM failures do not arise because every local part of an output is bad. They arise because locally plausible, locally useful, or locally improved parts fail to compose into a globally valuable artifact.

Consider a few examples. A SQL query may have a reasonable `SELECT`, a plausible `JOIN`, and a defensible `WHERE` clause—yet return the wrong answer. A code patch may fix a local symptom while violating a hidden invariant. A research synthesis may contain accurate summaries while failing to support its central claim. A long-horizon agent may complete several subtasks while failing to advance the actual project state.

This paper develops **aggregation mismatch** as one of the primitive mismatch types in the structural theory of value preservation for LLM systems. Aggregation mismatch occurs when local value signals do not preserve global task utility under the composition operation that builds the final artifact.

It is the core structural form behind what may be narrowly called **autoregressive mediocrity**: the tendency of locally likely continuations, local refinements, and local critiques to produce fluent but globally suboptimal artifacts. This tendency appears whenever the task depends on nonlocal dependencies, delayed commitments, interface consistency, global invariants, or end-to-end semantics.

Aggregation mismatch is not identical to support mismatch, specification mismatch, state mismatch, observation-representation mismatch, or fitting-boundary mismatch. It can occur even when:

- the relevant information is present,
- the state is known,
- the correct capability is activated,
- high-value components are reachable, and
- the objective is clear.

The failure lies in the **composition operator**: the procedure that assembles parts, clauses, modules, arguments, decisions, tool outputs, or agent actions into a global object.

The constructive response is **Compositional Governance**. Instead of relying on ungoverned local continuation, the system externalizes intermediate structure: dependency graphs, interface contracts, global invariants, binding records, composition plans, integration ledgers, and end-to-end validators. Local generation is preserved where it is aligned, but global value is protected by governed composition objects and compositional audits.

This reframes the central question. Rather than asking, "Can the model generate good local parts?", the system asks, "Can it preserve global invariants while assembling locally generated parts?"

### Relationship to the Diagnostic–Mechanism Bridge

This document uses aggregation mismatch as a value-preservation diagnosis. When a failure requires repair, the Diagnostic–Mechanism Bridge maps that diagnosis to an eight-axis mechanism target and a repair layer:

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

### Mechanism-Layer Mapping

Aggregation mismatch does not have a single exclusive mechanism axis. It is usually a composite mechanism profile spanning `belief_representation`, `action_interface`, and `search_execution`, and sometimes support-related amplification.

```text
parts are represented but not bound into a globally valid object
  → likely composite repair_target
  → often includes belief_representation + action_interface + search_execution
```

In mechanism terms, aggregation mismatch is about failure of whole-object preservation rather than a single missing station. That is why compositional governance often repairs multiple mechanism targets at once instead of assuming one dedicated aggregation axis.

---

## Contents

This is a long working paper. The reader's map:

- [1. Position in the Unified Theory](#1-position-in-the-unified-theory)
- [2. Core Definition](#2-core-definition)
- [3. Why Aggregation Is a Primitive Mismatch](#3-why-aggregation-is-a-primitive-mismatch)
- [4. Aggregation and Autoregressive Mediocrity](#4-aggregation-and-autoregressive-mediocrity)
- [5. The Structure of Local-to-Global Failure](#5-the-structure-of-local-to-global-failure)
- [6. Local Value Is Not a Homomorphism](#6-local-value-is-not-a-homomorphism)
- [7. Compositional Governance](#7-compositional-governance)
- [8. The Compositional Governance Loop](#8-the-compositional-governance-loop)
- [9. Core Governance Objects](#9-core-governance-objects)
- [10. Audit Engineering for Aggregation Mismatch](#10-audit-engineering-for-aggregation-mismatch)
- [11. Transformation Patterns](#11-transformation-patterns)
- [12. Interaction With Other Mismatches](#12-interaction-with-other-mismatches)
- [13. Text-to-SQL as Aggregation Mismatch](#13-text-to-sql-as-aggregation-mismatch)
- [14. Code Generation and Patch Integration](#14-code-generation-and-patch-integration)
- [15. Research Synthesis and Argument Composition](#15-research-synthesis-and-argument-composition)
- [16. Multi-Agent and Tool-Using Workflows](#16-multi-agent-and-tool-using-workflows)
- [17. When Local Improvement Is Enough](#17-when-local-improvement-is-enough)
- [18. Failure Modes of Compositional Governance](#18-failure-modes-of-compositional-governance)
- [19. Practical Checklist](#19-practical-checklist)
- [20. Relation to Existing Formal Traditions](#20-relation-to-existing-formal-traditions)
- [21. Formal Claims and Revocation Conditions](#21-formal-claims-and-revocation-conditions)
- [22. Conclusion](#22-conclusion)
- [Appendix A: Compact Glossary](#appendix-a-compact-glossary)
- [Appendix B: Minimal Compositional Governance Template](#appendix-b-minimal-compositional-governance-template)
- [Appendix C: One-Page Operational Summary](#appendix-c-one-page-operational-summary)

---

## 1. Position in the Unified Theory

The structural theory of value preservation analyzes LLM system failure through a world-to-output pipeline:

```text
S_world
  → observation
  → representation
  → state identification
  → capability routing
  → candidate support
  → aggregation
  → evaluation
  → state commitment
```

The six primitive mismatches correspond to structurally distinct failure stations in this pipeline:

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

This document focuses on the fifth station: **aggregation**.

The aggregation station asks:

```text
Given locally generated or locally selected parts,
what operation composes them into a globally valuable artifact?
```

Aggregation mismatch arises when the local value of the parts is not preserved by that operation.

This matters because many LLM systems are designed around local improvement loops:

```text
generate a draft
critique the draft
revise the draft
add missing details
improve clarity
fix local errors
merge suggestions
summarize evidence
compose modules
combine tool outputs
```

These operations are often valuable. They are also often insufficient. A system can improve every visible local part while still degrading or missing the global structure that determines task success.

The core thesis of this paper is:

> Aggregation mismatch is the failure of local value to compose into global value under the system's assembly procedure. It is repaired not by more local improvement alone, but by governing the composition relation itself.

---

## 2. Core Definition

Let a final artifact `Y` be composed from parts:

```text
Y = A(y_1, y_2, ..., y_n)
```

where:

- `y_i` are local components: tokens, clauses, paragraphs, functions, modules, arguments, retrieved snippets, tool outputs, agent actions, or intermediate objects.
- `A` is the aggregation operator: concatenation, synthesis, merging, execution, compilation, planning, voting, reranking, reduction, rendering, or state update.
- `v_i(y_i)` is a local value signal for part `y_i`.
- `U(Y)` is the global task utility.

**Aggregation mismatch** occurs when local value does not preserve global utility:

```text
high v_i(y_i) for each i

but

low U(A(y_1, ..., y_n))
```

or, more generally:

```text
local improvement of y_i does not imply improvement of U(Y)
```

This definition covers three important cases.

### 2.1 Locally Good, Globally Bad

Each part looks good in isolation, but the assembled artifact fails.

```text
∀i: v_i(y_i) is high
but U(Y) is low
```

Examples:

```text
A SQL query has plausible clauses but the wrong join semantics.
A legal memo has accurate doctrinal summaries but an unsupported conclusion.
A code patch fixes a local test but breaks a system invariant.
A plan has reasonable steps but impossible ordering.
```

### 2.2 Local Improvement, Global Regression

A revision improves a local part but makes the global artifact worse.

```text
v_k(y'_k) > v_k(y_k)

but

U(A(..., y'_k, ...)) < U(A(..., y_k, ...))
```

Examples:

```text
Clarifying a paragraph breaks a cross-reference.
Optimizing a function changes an implicit API contract.
Adding a caveat weakens a decisive argument.
Making a SQL predicate more specific eliminates the correct rows.
```

### 2.3 Globally Necessary, Locally Unattractive

A part looks awkward, risky, verbose, or low-likelihood locally, but is necessary for global correctness.

```text
v_i(y_i) appears low
but y_i is necessary for high U(Y)
```

Examples:

```text
A seemingly redundant guard clause preserves a safety invariant.
An inelegant join is required by the actual schema.
A long caveat is necessary to avoid overclaiming.
A temporary state transition is necessary for recoverability.
```

Aggregation mismatch therefore cannot be solved by optimizing each part independently. The system must govern the relation between parts.

---

## 3. Why Aggregation Is a Primitive Mismatch

Aggregation mismatch is primitive because it has a distinct repair target: the composition operator `A` and the global invariants it must preserve.

It is not reducible to the other primitive mismatches.

### 3.1 Not Observation-Representation Mismatch

Observation-representation mismatch asks whether decisive variables entered the representation.

Aggregation mismatch can occur even when all relevant variables are present.

Example:

```text
The schema, foreign keys, and column meanings are all present.
Each clause of a SQL query is locally plausible.
The query still composes the clauses into the wrong global semantics.
```

The repair is not to add missing variables. The repair is to govern how clauses compose.

### 3.2 Not State Mismatch

State mismatch asks whether the system knows which latent state it is in.

Aggregation mismatch can occur even when the state is known.

Example:

```text
The system correctly identifies that the task is a migration script.
It knows the target version and dependency state.
It still patches files in an order that breaks compatibility.
```

The repair is not state identification. The repair is dependency-preserving composition.

### 3.3 Not Fitting-Boundary Mismatch

Fitting-boundary mismatch asks whether the correct capability is activated in the correct domain.

Aggregation mismatch can occur even when the correct capability is activated.

Example:

```text
The system correctly activates code-review capability.
It identifies good local fixes.
It still merges them into a patch that violates an end-to-end invariant.
```

The repair is not merely router correction. The repair is integration governance.

### 3.4 Not Support Mismatch

Support mismatch asks whether high-value structures are reachable as candidates.

Aggregation mismatch can occur when the correct parts are all reachable or even generated.

Example:

```text
The system generates all required evidence snippets for a report.
It fails to assemble them into a valid argument.
```

The repair is not candidate expansion. The repair is argument-structure governance.

### 3.5 Not Specification Mismatch

Specification mismatch asks whether the accessible objective matches true utility.

Aggregation mismatch can occur under a clear objective.

Example:

```text
The objective is exact execution correctness.
The system knows the SQL must return the correct answer.
Each local clause is defensible.
The global query is wrong because the clauses interact incorrectly.
```

The repair is not rubric clarification. The repair is compositional validation.

### 3.6 Minimal Pair Criterion

The preceding sections showed that aggregation mismatch is distinct from the other five primitive mismatches. A stronger test is available: aggregation mismatch is independently testable by holding other stations fixed while varying only the composition relation.

```text
Same observation.
Same representation.
Same state.
Same capability.
Same candidate parts.
Same objective.
Different aggregation relation.
Different global utility.
```

This minimal pair establishes aggregation as a primitive failure station.

---

## 4. Aggregation and Autoregressive Mediocrity

Autoregressive generation is a special case of aggregation. Each next token or segment is selected under a local continuation policy, and the final output is the sequence-level composition of these local decisions.

```text
Y = (t_1, t_2, ..., t_n)
```

The local policy optimizes:

```text
p(t_k | t_1, ..., t_{k-1}, context)
```

But the task utility depends on:

```text
U(t_1, ..., t_n, S_world)
```

Autoregressive mediocrity occurs when locally likely continuations do not preserve global utility.

This is not a universal defect of autoregression. In many tasks, local continuation is highly aligned with global value:

```text
surface polishing
style transfer
genre completion
semantic paraphrase
boilerplate construction
contextual elaboration
```

In those tasks, local likelihood can be a useful proxy for local and global quality.

Aggregation mismatch appears when the task depends on properties that are not locally visible at the point of generation:

```text
long-range consistency
hidden constraints
future commitments
cross-module interfaces
proof obligations
end-to-end execution
nonlocal reference binding
global optimization
```

Autoregressive mediocrity should therefore be treated as a subcase of aggregation mismatch, not as the whole theory of LLM failure.

### 4.1 Completion-Induced Observability

During first-pass generation, a choice at position `k` is conditioned on the prefix even when its task value depends on later interfaces, payoffs, bindings, or commitments. A completed candidate changes that information condition. The old suffix is not the optimal future, but it is a concrete witness that makes many nonlocal violations observable.

```text
first pass: p_theta(t_k | t_<k, context)

repair:     p_theta(t'_k | complete_candidate, audit_finding, t'_<k, context)
```

This is why aggregation audit can be useful even without a guarantee of global optimality: it converts hidden coordination requirements into inspectable residuals.

### 4.2 From Global Synthesis to Variable-Neighborhood Repair

Let `Y_0` be a completed candidate and `N_r(Y_0)` a repair neighborhood of radius `r`. Audit changes the optimization problem from whole-space construction to a sequence of conditional searches:

```text
delta_r* = argmax_delta in N_r(Y_0)
           [U_hat(Y_0 + delta) - U_hat(Y_0)]
```

The radius should be governed rather than fixed:

```text
span
→ function / scene
→ module / chapter
→ architecture / plot plan
→ regeneration from revised control space
```

Small neighborhoods preserve already-good structure. Larger neighborhoods allow the system to leave the initial basin when the defect is upstream, densely coupled, or repeatedly reintroduced by local repair. The mechanism is a tractability transformation and a basin-escape operator, not a proof that local search reaches the global optimum.

---

## 5. The Structure of Local-to-Global Failure

Aggregation mismatch appears in several recurring structural forms.

### 5.1 Nonlocal Dependency Failure

A local component depends on another component that is distant, implicit, or not yet generated.

```text
y_i is locally plausible
but incompatible with y_j
```

Examples:

```text
A later paragraph contradicts an earlier assumption.
A function call assumes a type contract not preserved by the caller.
A SQL predicate requires a join alias that was bound differently.
A project plan schedules a dependent task before its prerequisite.
```

Repair target:

```text
dependency graph
cross-reference table
interface contract
nonlocal consistency audit
```

### 5.2 Delayed Commitment Failure

A local decision appears harmless when made, but later constrains the artifact in a way that blocks global value.

```text
commitment c_k seems locally acceptable
but makes future high-value paths unreachable
```

Examples:

```text
Choosing a schema interpretation too early.
Selecting one narrative frame before evidence has been integrated.
Hard-coding a design decision before downstream requirements are known.
Committing to a join path before value grounding is complete.
```

Repair target:

```text
commitment ledger
reversible assumptions
late binding
branch preservation
commitment audit
```

### 5.3 Interface Drift

Multiple local components each satisfy their local role, but their interfaces drift.

```text
producer contract ≠ consumer expectation
```

Examples:

```text
A module returns a different shape than the caller expects.
A summary abstracts away a distinction needed by a downstream section.
A tool result is interpreted under a different schema than the tool actually returned.
A team of agents uses inconsistent meanings for the same task label.
```

Repair target:

```text
interface schema
input/output contract
binding record
shared glossary
contract test
```

### 5.4 Invariant Violation

A global invariant is not visible in any single local decision.

```text
∀i, local check passes
but global invariant fails
```

Examples:

```text
A security property requires all endpoints to be updated consistently.
A proof requires every case to be covered exactly once.
A SQL query must preserve row cardinality under joins.
A plan must keep total resource use below a global budget.
```

Repair target:

```text
invariant registry
global validator
coverage matrix
resource ledger
end-to-end check
```

### 5.5 Evidence-to-Claim Misaggregation

Evidence items are individually accurate, but the synthesized claim exceeds what the evidence supports.

```text
Each source supports a local statement.
The conclusion requires a stronger relation not supported by their composition.
```

Examples:

```text
A research synthesis overgeneralizes from heterogeneous studies.
A market memo turns weak signals into a strong directional recommendation.
A legal analysis combines separate doctrines into an unsupported conclusion.
A safety assessment aggregates low-risk observations into a false guarantee.
```

Repair target:

```text
evidence graph
claim support map
scope-of-support annotations
aggregation rule
strength calibration
```

### 5.6 Patchwork Coherence Failure

Iterative revision improves local defects but leaves the artifact as a patchwork of inconsistent layers.

```text
revision_1 fixes defect_1
revision_2 fixes defect_2
...
final artifact lacks integrated coherence
```

Examples:

```text
A long document accumulates incompatible framing changes.
A code patch fixes tests one at a time while degrading architecture.
A policy document merges multiple reviewer comments without reconciling assumptions.
```

Repair target:

```text
integration pass
architecture review
semantic diff
global rewrite plan
versioned rationale ledger
```

### 5.7 Majority or Ensemble Misaggregation

Multiple candidates, votes, or agents are aggregated by a rule that does not preserve correctness.

```text
majority preference ≠ true utility
```

Examples:

```text
Several agents share the same blind spot.
Self-consistency samples repeat a common wrong assumption.
Reranking favors fluent answers over structurally correct ones.
Voting suppresses a rare but correct candidate.
```

Repair target:

```text
diversity audit
correlated-error detection
minority-candidate preservation
adversarial aggregation rule
validator-weighted ensemble
```

---

## 6. Local Value Is Not a Homomorphism

Aggregation mismatch can be stated algebraically.

Let `⊕` be the composition operation over parts. A local value function `v` would compose cleanly if it were a homomorphism into global utility:

```text
U(y_1 ⊕ y_2) = F(v(y_1), v(y_2))
```

for some stable aggregation function `F`.

In many LLM tasks, no such simple homomorphism exists. The value of the whole depends on relations among parts, not merely on the value of each part.

```text
U(y_1 ⊕ y_2) depends on R(y_1, y_2)
```

where `R` may include:

```text
consistency
causal dependency
interface compatibility
temporal order
scope containment
logical entailment
resource coupling
semantic binding
execution semantics
```

The system therefore needs explicit governance over `R`, not merely local improvement of `y_i`.

This is the formal intuition behind Compositional Governance:

> When global value depends on relations among parts, govern the relation, not only the parts.

---

## 7. Compositional Governance

**Compositional Governance** is the governance of intermediate structures, dependencies, constraints, and assembly rules that determine whether locally generated parts compose into a globally valuable artifact.

It has five core moves:

```text
1. Externalize the composition structure.
2. Define the interfaces among parts.
3. Register global invariants.
4. Audit local-to-global preservation.
5. Commit only composition-valid artifacts or state transitions.
```

The goal is not to prevent local generation. The goal is to place local generation inside a governed composition regime.

Ungoverned aggregation says:

```text
Generate good parts and combine them.
```

Compositional Governance says:

```text
Define what it means for parts to compose,
then generate, audit, revise, and render under that definition.
```

---

## 8. The Compositional Governance Loop

A generic loop is:

```text
1. Task decomposition
2. Composition-object construction
3. Local part generation
4. Interface binding
5. Global invariant audit
6. Integration repair
7. Final rendering
8. Regression guard creation
9. State commitment
```

### 8.1 Task Decomposition

The system first identifies the parts that will be composed.

```text
sections of a report
clauses of a SQL query
modules of a code patch
steps of a plan
claims in an argument
tool outputs in a workflow
agent-produced subtasks
```

Decomposition must not be treated as automatically valid. A bad decomposition can create aggregation mismatch by hiding dependencies.

### 8.2 Composition-Object Construction

The system constructs explicit objects that govern how parts relate.

Examples:

```text
dependency graph
interface contract
invariant registry
claim-support map
binding table
execution plan
state transition plan
coverage matrix
```

These objects become Governed Knowledge Objects (GKOs), Governed Execution Objects (GExOs), or Governed Escalation Objects (GEsOs) when they have scope, evidence, strength, and revocation conditions.

### 8.3 Local Part Generation

The model generates or revises local parts under local constraints.

This is where local alignment is preserved. LLMs are often good at generating candidate clauses, summaries, code snippets, design alternatives, edge cases, and explanations.

### 8.4 Interface Binding

Each part is bound to the rest of the artifact through explicit interfaces.

```text
input/output types
assumed definitions
referenced variables
required upstream facts
downstream consumers
scope of claim
state preconditions
```

### 8.5 Global Invariant Audit

The system checks whether the assembled artifact preserves required invariants.

```text
consistency
coverage
noncontradiction
execution correctness
semantic equivalence
resource feasibility
state transition validity
```

### 8.6 Integration Repair

Failures are localized not merely to bad parts, but to bad relations.

```text
wrong dependency
missing binding
interface mismatch
unsupported inference
order violation
invariant breach
```

Each finding should produce a control delta.

Integration repair should also declare the repair radius. If the same relation fails again after a local patch, the system should escalate from part-level repair to interface redesign, composition-plan revision, or regeneration from the governed control space. Repeating the same local neighborhood after evidence of structural coupling is repair theater.

### 8.7 Final Rendering

The final artifact is rendered from the governed composition objects, not simply concatenated from local generations.

### 8.8 Regression Guard Creation

If an aggregation failure is discovered, a guard should be created to detect recurrence.

```text
If this dependency is broken again, fail.
If this invariant is violated again, fail.
If this interface drifts again, fail.
If this claim exceeds support again, fail.
```

### 8.9 State Commitment

For long-horizon agents, a composition-valid artifact should enter hard state only when its transition contract is satisfied.

```text
S + A → O → V → S'
```

---

## 9. Core Governance Objects

Aggregation mismatch is repaired through objects that make composition explicit.

### 9.1 Composition Plan

A Composition Plan describes how parts will be assembled.

```json
{
  "id": "composition_plan.report_argument_v1",
  "type": "composition_plan",
  "parts": ["claim", "evidence", "counterargument", "conclusion"],
  "composition_rule": "Each major claim must be supported by evidence before being used in the conclusion.",
  "global_invariants": ["no unsupported central claim", "scope of evidence preserved"],
  "revocation_trigger": "A claim appears in the conclusion without support in the evidence map."
}
```

### 9.2 Dependency Graph

A Dependency Graph records which parts rely on which other parts.

```json
{
  "id": "dependency_graph.sql_query_v1",
  "type": "dependency_graph",
  "nodes": ["selected_columns", "tables", "join_path", "filters", "aggregation", "ordering"],
  "edges": [
    {"from": "selected_columns", "to": "tables", "relation": "requires_table"},
    {"from": "filters", "to": "join_path", "relation": "requires_alias_binding"},
    {"from": "aggregation", "to": "selected_columns", "relation": "determines_grouping_validity"}
  ],
  "revocation_trigger": "Execution or semantic audit finds an unbound alias, invalid grouping, or impossible join dependency."
}
```

### 9.3 Interface Contract

An Interface Contract defines how one part may be consumed by another.

```json
{
  "id": "interface_contract.module_api_v1",
  "type": "interface_contract",
  "producer": "data_loader",
  "consumer": "feature_builder",
  "producer_output": "List[Record{id, timestamp, value}]",
  "consumer_expectation": "Records are sorted by timestamp and contain non-null value.",
  "invariants": ["timestamp order preserved", "null values handled before consumption"],
  "revocation_trigger": "Consumer receives unsorted records or null values without explicit handling."
}
```

### 9.4 Invariant Registry

An Invariant Registry stores global properties that must hold across the artifact.

```json
{
  "id": "invariant_registry.plan_v1",
  "type": "invariant_registry",
  "invariants": [
    {
      "name": "prerequisite_order",
      "assertion": "No task may be scheduled before its prerequisite is complete.",
      "severity": "critical"
    },
    {
      "name": "resource_budget",
      "assertion": "Total planned cost must not exceed the approved budget.",
      "severity": "high"
    }
  ],
  "revocation_trigger": "A required invariant is shown not to apply to the current task class."
}
```

### 9.5 Binding Record

A Binding Record captures identity, reference, alias, and scope bindings.

```json
{
  "id": "binding_record.schema_v1",
  "type": "binding_record",
  "bindings": [
    {
      "surface_phrase": "customers with late payments",
      "table": "customer",
      "column": "payment_status",
      "value_condition": "payment_status = 'late'"
    }
  ],
  "scope": "current text-to-SQL task",
  "revocation_trigger": "Database inspection shows the value encoding differs from the assumed binding."
}
```

### 9.6 Claim-Support Map

A Claim-Support Map governs evidence aggregation.

```json
{
  "id": "claim_support_map.research_synthesis_v1",
  "type": "claim_support_map",
  "claims": [
    {
      "claim_id": "C1",
      "claim": "The intervention improves retention in short-term settings.",
      "supporting_evidence": ["E1", "E3"],
      "scope": "short-term retention only",
      "not_supported": ["long-term outcomes", "causal effect in all populations"]
    }
  ],
  "revocation_trigger": "A conclusion uses C1 outside its support scope."
}
```

### 9.7 Integration Ledger

An Integration Ledger records local changes and their global effects.

```json
{
  "id": "integration_ledger.patch_v1",
  "type": "integration_ledger",
  "entries": [
    {
      "change": "Modified parser error handling.",
      "local_reason": "Fixes malformed input failure.",
      "affected_interfaces": ["parser -> validator"],
      "global_checks_required": ["valid input path", "malformed input path", "logging behavior"]
    }
  ],
  "revocation_trigger": "A local change is found to have untracked global effects."
}
```

---

## 10. Audit Engineering for Aggregation Mismatch

Aggregation audits must inspect relations, not only parts.

A local audit asks:

```text
Is this part good?
```

A compositional audit asks:

```text
Does this part preserve its required relation to other parts?
Does the whole preserve the global invariant?
```

### 10.1 Aggregation Audit Finding Schema

```json
{
  "id": "finding.aggregation.unique_id",
  "artifact": "the assembled artifact or partial assembly",
  "local_parts": ["y_1", "y_2", "..."],
  "finding": "localized composition failure",
  "evidence": "specific relation, invariant, interface, or dependency violation",
  "aggregation_failure_type": "dependency | interface | invariant | evidence_claim | ordering | binding | integration | ensemble",
  "mismatch_type": "aggregation",
  "repair_target": "composition_plan | dependency_graph | interface_contract | invariant_registry | binding_record | claim_support_map | integration_ledger",
  "control_delta": "change to the governed composition object",
  "regression_guard": "check that fails if the same composition failure recurs",
  "severity": "low | medium | high | critical"
}
```

### 10.2 Example: SQL Aggregation Finding

```json
{
  "id": "finding.aggregation.sql.join_grouping_001",
  "artifact": "candidate SQL query",
  "finding": "The GROUP BY clause aggregates after a join path that duplicates rows, causing inflated counts.",
  "evidence": "Execution on sample rows shows count doubling after joining order_items before grouping by customer.",
  "aggregation_failure_type": "invariant",
  "mismatch_type": "aggregation",
  "repair_target": "dependency_graph.sql_query_v1",
  "control_delta": "Add invariant: aggregation cardinality must be checked before and after join expansion.",
  "regression_guard": "Run cardinality-preservation check on representative join paths before accepting count queries.",
  "severity": "critical"
}
```

### 10.3 Example: Research Synthesis Finding

```json
{
  "id": "finding.aggregation.research.scope_001",
  "artifact": "draft literature synthesis",
  "finding": "The conclusion generalizes from short-term retention studies to long-term learning outcomes without supporting evidence.",
  "evidence": "All cited studies measure outcomes within two weeks; the conclusion claims semester-scale retention.",
  "aggregation_failure_type": "evidence_claim",
  "mismatch_type": "aggregation",
  "repair_target": "claim_support_map.research_synthesis_v1",
  "control_delta": "Restrict claim scope to short-term retention unless long-term evidence is added.",
  "regression_guard": "Every conclusion claim must cite evidence with matching outcome horizon.",
  "severity": "high"
}
```

### 10.4 Example: Code Integration Finding

```json
{
  "id": "finding.aggregation.code.interface_001",
  "artifact": "candidate code patch",
  "finding": "The parser now returns structured errors, but the validator still expects string errors.",
  "evidence": "Unit tests for parser pass; integration test fails at validator error handling.",
  "aggregation_failure_type": "interface",
  "mismatch_type": "aggregation",
  "repair_target": "interface_contract.parser_validator_v1",
  "control_delta": "Update validator contract or add adapter preserving expected error format.",
  "regression_guard": "Parser-validator integration test must cover malformed input and structured error payloads.",
  "severity": "high"
}
```

---

## 11. Transformation Patterns

Aggregation mismatch is repaired by transforming ungoverned composition into governed composition.

### 11.1 From Sequence to Graph

Ungoverned formulation:

```text
Write the final answer step by step.
```

Governed formulation:

```text
Construct a dependency graph, then render the answer under the graph.
```

Useful when:

```text
there are nonlocal dependencies
there are prerequisites
there are cross-references
there are shared variables or assumptions
```

### 11.2 From Draft to Interface Contracts

Ungoverned formulation:

```text
Write each module or section.
```

Governed formulation:

```text
Define the interfaces among modules or sections, then generate under those interfaces.
```

Useful when:

```text
modules consume each other's outputs
sections rely on earlier definitions
agents pass intermediate artifacts
tools return structured data
```

### 11.3 From Local Rubrics to Global Invariants

Ungoverned formulation:

```text
Check whether each part is good.
```

Governed formulation:

```text
Check whether the assembled artifact preserves global invariants.
```

Useful when:

```text
local correctness does not imply end-to-end correctness
resource constraints are global
semantic equivalence is global
security or safety properties are global
```

### 11.4 From Merge to Reconciliation

Ungoverned formulation:

```text
Merge all suggestions.
```

Governed formulation:

```text
Detect conflicts, reconcile assumptions, and produce a coherent integration plan.
```

Useful when:

```text
multiple reviewers provide comments
multiple agents produce outputs
multiple retrieval sources disagree
multiple local fixes affect the same invariant
```

### 11.5 From Majority Vote to Error-Model-Aware Aggregation

Ungoverned formulation:

```text
Take the majority answer.
```

Governed formulation:

```text
Estimate correlated errors, preserve minority high-value candidates, and aggregate under validators.
```

Useful when:

```text
samples share the same blind spot
rare correct candidates look unusual
fluency correlates poorly with correctness
validators are stronger than voters
```

### 11.6 From Revision Loop to Integration Ledger

Ungoverned formulation:

```text
Iteratively fix issues.
```

Governed formulation:

```text
Record each local fix, its affected interfaces, required global checks, and regression guards.
```

Useful when:

```text
patches accumulate
long documents undergo multiple revisions
agent workflows persist across time
human feedback is incremental and heterogeneous
```

---

## 12. Interaction With Other Mismatches

Aggregation mismatch frequently interacts with the other primitive mismatches.

### 12.1 Observation-Representation × Aggregation

If a decisive relation is not represented, the system cannot govern its composition.

```text
Missing foreign key → wrong join composition.
Missing temporal order → impossible plan ordering.
Missing source scope → unsupported evidence aggregation.
```

Repair order:

```text
first repair representation of the relation,
then govern composition.
```

### 12.2 State × Aggregation

The correct aggregation rule may depend on latent state.

```text
In state h1, evidence should be aggregated conservatively.
In state h2, evidence can support a stronger conclusion.
```

If the state is wrong, composition may be wrong even if all parts are good.

Repair order:

```text
state discriminate,
then apply state-conditioned composition rules.
```

### 12.3 Fitting-Boundary × Aggregation

The system may activate a local generation capability when it should activate an integration capability.

Examples:

```text
drafting instead of reconciling
summarizing instead of preserving scope
patching instead of checking interfaces
voting instead of detecting correlated error
```

Repair target:

```text
router rule: when multiple local outputs must be combined, activate compositional audit before rendering.
```

### 12.4 Support × Aggregation

The correct global structure may require a low-support intermediate relation.

Examples:

```text
rare join path
unusual proof structure
non-obvious dependency edge
minority candidate in ensemble
```

Support search may need to target composition objects, not final artifacts.

### 12.5 Specification × Aggregation

If the objective is underspecified, the system may aggregate parts under the wrong global criterion.

Examples:

```text
optimizing readability when legal defensibility matters
maximizing coverage when precision matters
combining evidence as if all sources had equal scope
```

Specification repair should update global invariants and aggregation rules, not only local rubrics.

### 12.6 Compound Super-Additivity

Compound aggregation failures can be super-additive.

Example:

```text
A decisive schema relation is omitted from representation.
The system activates template SQL generation instead of schema audit.
The rare correct join path has low support.
The generated clauses are locally plausible.
Execution fails.
```

Here, improving local clauses does not help because the missing relation, wrong router, low support, and composition failure gate one another.

---

## 13. Text-to-SQL as Aggregation Mismatch

Text-to-SQL is a canonical aggregation task.

A SQL query is a composed artifact:

```text
SQL = A(
  selected columns,
  tables,
  aliases,
  join path,
  predicates,
  grouping,
  aggregation,
  ordering,
  limits
)
```

Each part can be locally plausible while the query is globally wrong.

### 13.1 Local Clause Plausibility

An LLM may produce:

```text
reasonable selected columns
reasonable table names
reasonable filter conditions
reasonable aggregation keyword
reasonable order clause
```

But the global query may fail because:

```text
the join path duplicates rows
the filter applies before the needed aggregation
the selected column is incompatible with GROUP BY
the value binding belongs to another table
the natural language question requires an anti-join
the query answers a neighboring question
```

### 13.2 Compositional Control Space

A governed text-to-SQL system should not treat SQL as a flat string. It should construct composition objects:

```text
schema subgraph
join dependency graph
column binding table
value binding table
predicate skeleton
aggregation cardinality invariant
execution feedback ledger
```

### 13.3 Aggregation Guards

Possible guards include:

```text
all selected columns must be bound to selected tables
join path must connect all referenced tables
aggregation cardinality must be checked when counting after joins
GROUP BY must cover non-aggregated selected columns
value predicates must be grounded in actual database values
empty results must trigger predicate overconstraint audit
```

### 13.4 Why Direct Generation Fails

Direct SQL generation asks the model to compose all dependencies implicitly. This works when the query is simple and local plausibility tracks execution semantics. It fails when global execution semantics depend on relations not visible in local token likelihood.

The governed transformation is:

```text
direct SQL string generation
  → controlled schema and join representation
  → governed predicate and aggregation skeleton
  → SQL rendering
  → execution audit
  → composition repair
```

---

## 14. Code Generation and Patch Integration

Code generation is another canonical aggregation domain.

A codebase is a network of interfaces, invariants, tests, stateful behavior, and implicit contracts. A patch may be locally correct but globally harmful.

### 14.1 Local Fix, Global Break

Examples:

```text
A function is optimized but breaks a caller's timing assumption.
A bug is fixed in one path but not in a parallel path.
A new parameter is added without updating all call sites.
A type is changed without updating serialization logic.
An error-handling patch changes the exception contract.
```

### 14.2 Compositional Objects for Code

Useful objects include:

```text
module dependency graph
API contract
call graph
state invariant registry
test coverage map
migration plan
integration ledger
semantic diff
```

### 14.3 Patch Governance Loop

```text
1. Identify local defect.
2. Identify affected interfaces.
3. Generate candidate patch.
4. Audit local tests.
5. Audit integration tests.
6. Update interface contracts if needed.
7. Add regression guard.
8. Commit only after transition validity.
```

The point is not to replace coding with bureaucracy. The point is to prevent the model from treating code as locally editable text when the actual object is an executable system with nonlocal invariants.

---

## 15. Research Synthesis and Argument Composition

Research synthesis often appears locally easy to LLMs. The model can summarize papers, extract claims, compare themes, and write fluent transitions. The hard part is preserving the relation between evidence and conclusion.

### 15.1 Evidence Aggregation Failure

Local summaries may be accurate, but the final conclusion may overstate what they support.

Common failures:

```text
scope expansion
time-horizon mismatch
population mismatch
correlation-to-causation drift
methodological heterogeneity ignored
minority evidence smoothed away
negative findings underweighted
```

### 15.2 Governed Argument Objects

Useful objects include:

```text
evidence table
claim-support map
scope annotations
methodological compatibility matrix
counterevidence ledger
strength-of-claim rubric
conclusion contract
```

### 15.3 Claim-Scope Guard

A simple but powerful guard:

```text
Every conclusion must have a support scope no broader than the narrowest required evidence scope.
```

If a conclusion exceeds the evidence scope, the system must either:

```text
weaken the conclusion
add supporting evidence
mark the claim as speculative
split the claim by scope
```

This is aggregation governance: it governs how evidence composes into claims.

---

## 16. Multi-Agent and Tool-Using Workflows

Aggregation mismatch also appears in multi-agent systems and tool-using workflows.

A common assumption is:

```text
If each agent or tool completes its subtask, the overall workflow succeeds.
```

This is often false.

### 16.1 Multi-Agent Aggregation Failure

Examples:

```text
Agents use inconsistent definitions.
One agent's output omits information another agent needs.
A planner assumes a tool succeeded when it only partially succeeded.
A reviewer critiques local quality but not integration validity.
A coordinator merges outputs without resolving conflicts.
```

Context-conditioned audit branches create a special aggregation obligation. Different contexts and matched decomposition prompts may expose complementary evidence or structural basins, but their outputs are not independent merely because their role names differ. The workflow should preserve context provenance, assumptions, excluded information, and unique evidence until synthesis. A minority branch carrying the only counterexample must not be erased by majority vote.

### 16.2 Workflow Composition Objects

Useful objects include:

```text
shared task model
role-interface contract
handoff schema
state transition contract
conflict ledger
dependency graph
completion criteria
integration audit
```

### 16.3 SGAR Connection

In a State-Governed Agent Regime (SGAR), aggregation validity must be tied to hard state across long-horizon workflows.

A set of local completions should not automatically commit project progress.

```text
local completions
  → integration audit
  → verifier
  → committed state transition
```

The system may narrate that subtasks are complete, but only a valid state transition commits the integrated result.

---

## 17. When Local Improvement Is Enough

Compositional Governance is not always necessary.

Local improvement is often enough when:

```text
the artifact has weak nonlocal dependencies
the objective is local and visible
parts are independent
the aggregation operator is simple and reliable
there is a complete external validator
global value is approximately additive over parts
```

Examples:

```text
style polishing a short paragraph
format conversion
simple extraction into a fixed schema
minor grammar correction
straightforward paraphrase
boilerplate generation
```

Compositional Governance becomes more important when:

```text
parts interact strongly
global invariants matter
interfaces can drift
local fixes can cause regressions
evidence must support claims
execution semantics differ from surface plausibility
state persists across time
```

A useful decision rule is:

```text
Govern composition when expected loss from local-to-global failure exceeds the cost of making composition explicit.
```

For candidate-conditioned repair, local improvement is enough only while accepted deltas have positive externally grounded utility and regression guards preserve previously satisfied relations. When verifier score rises but external utility stalls, when the same defect recurs, or when the necessary delta crosses many interfaces, the system should enlarge the neighborhood or restart from a revised composition object.

An open experiment should compare equal-budget fresh generation with candidate-conditioned repair across several radii. Measure localization accuracy, completion-conditioned lift, regression, radius escalation, basin escape, and divergence between verifier score and human or hidden-gold utility. This claim remains conditional until the gains survive held-out artifacts and independent evaluation.

---

## 18. Failure Modes of Compositional Governance

Compositional Governance can itself fail. The theory should name these failure modes explicitly.

### 18.1 Over-Decomposition

The system decomposes the task into parts that destroy the natural structure of the problem.

Symptom:

```text
The parts are easy to generate but hard or impossible to recombine.
```

Repair:

```text
revise the decomposition around actual dependencies, not surface sections.
```

### 18.2 False Modularity

The system treats coupled components as independent.

Symptom:

```text
Each module passes local checks, but integration fails repeatedly.
```

Repair:

```text
add dependency edges and interface contracts.
```

### 18.3 Interface Calcification

The system locks in an interface too early, preventing better global designs.

Symptom:

```text
downstream artifacts contort themselves around a bad early interface.
```

Repair:

```text
make interfaces provisional until integration evidence supports them.
```

### 18.4 Invariant Theater

The system lists global invariants but does not enforce them.

Symptom:

```text
invariants appear in the prompt or document but do not fail any artifact.
```

Repair:

```text
convert invariants into executable or auditable guards.
```

### 18.5 Integration Oscillation

Fixing one relation breaks another, leading to unstable revision cycles.

Symptom:

```text
revision alternates between satisfying invariant A and invariant B.
```

Repair:

```text
create a conflict set and solve the constraints jointly.
```

### 18.6 Coupling Explosion

The system creates too many dependencies to manage.

Symptom:

```text
the dependency graph becomes larger than the task itself.
```

Repair:

```text
abstract dependencies into layers and prioritize high-severity invariants.
```

### 18.7 Validator Myopia

The global validator checks an incomplete global property.

Symptom:

```text
artifacts pass the validator while still failing the true task.
```

Repair:

```text
audit the validator against representative composition failures.
```

---

## 19. Practical Checklist

Before final rendering, ask:

```text
1. What are the parts being composed?
2. What relation among parts determines global value?
3. What dependencies are nonlocal?
4. What interfaces must be preserved?
5. What global invariants must hold?
6. What local improvements could break global value?
7. What commitments should remain reversible?
8. What evidence supports each global claim?
9. What validator checks the assembled artifact?
10. What regression guard prevents recurrence of a composition failure?
```

For an LLM system, implement at least one of:

```text
dependency graph
interface contract
invariant registry
binding record
claim-support map
integration ledger
composition audit
end-to-end validator
```

For high-value tasks, implement several.

---

## 20. Relation to Existing Formal Traditions

Aggregation mismatch resonates with several formal traditions, but the LLM setting adds distinctive features.

### 20.1 Compositionality

Classical compositionality studies how meanings or behaviors of wholes relate to meanings or behaviors of parts. Aggregation mismatch is the failure of such preservation in LLM-mediated task artifacts.

The LLM-specific issue is that parts may be generated under local linguistic plausibility rather than under explicit composition semantics.

### 20.2 Modular Verification

Modular verification uses contracts and invariants to reason about systems part by part. Compositional Governance borrows the same spirit: local components need assumptions and guarantees.

The LLM-specific issue is that assumptions are often tacit, generated, revised, or discovered through audit.

### 20.3 Assume-Guarantee Reasoning

Assume-guarantee reasoning proves system properties by assigning assumptions and guarantees to components.

A similar structure appears in governed LLM systems:

```text
this section assumes X and guarantees Y
this module consumes Y and guarantees Z
this plan step requires state S and produces state S'
```

### 20.4 Type Systems and Interface Contracts

Type systems prevent certain composition errors by making interfaces explicit. LLM systems often lack explicit types for natural-language artifacts, claims, tool outputs, and state transitions. Compositional Governance can be seen as adding task-specific types and contracts at inference time.

### 20.5 Constraint Satisfaction

Many aggregation failures are constraint satisfaction failures. The novelty is that the constraints may be partly implicit, natural-language, expert-defined, or evolving through audit findings.

### 20.6 Dynamic Programming and Search over Structures

Some tasks become easier when decomposed into subproblems with valid recurrence relations. But LLM decomposition is often heuristic and may not preserve optimal substructure. Compositional Governance asks whether the decomposition actually supports valid recomposition.

---

## 21. Formal Claims and Revocation Conditions

The theory should expose its own claims to audit.

### 21.1 Primitive Status Claim

```json
{
  "id": "gko.aggregation_mismatch.primitive_status",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as pipelines that compose local parts into global artifacts.",
  "assertion": "Aggregation mismatch is a primitive mismatch because local value may fail to preserve global utility under the composition operator, even when observation, state, routing, support, and specification are held fixed.",
  "support_scope": "Tasks with multi-part artifacts, nonlocal dependencies, interfaces, global invariants, or evidence-to-claim relations.",
  "revocation_trigger": "Show that all aggregation failures can be reduced to another primitive mismatch without losing the distinct repair target of governing composition relations.",
  "not_supported_claims": "Does not claim every task requires explicit compositional governance. Does not claim local generation is generally bad."
}
```

### 21.2 Compositional Governance Claim

```json
{
  "id": "gko.compositional_governance.effectiveness_claim",
  "type": "method_claim",
  "condition": "Task value depends on relations among generated parts.",
  "assertion": "Externalizing and auditing composition objects can reduce aggregation mismatch by making nonlocal dependencies, interfaces, and invariants available to the system.",
  "support_scope": "High-value tasks with meaningful local-to-global failure risk.",
  "revocation_trigger": "If explicit composition objects repeatedly add cost without improving detection, repair, or prevention of local-to-global failures, governance should be reduced or redesigned.",
  "not_supported_claims": "Does not imply heavy decomposition is always beneficial. Does not replace task-specific verification."
}
```

### 21.3 Completion-Conditioned Repair Claim

```json
{
  "id": "gko.aggregation_mismatch.completion_conditioned_repair",
  "type": "method_claim",
  "condition": "A complete candidate exposes nonlocal relation violations and the system can choose and regression-test a repair neighborhood.",
  "assertion": "Candidate-conditioned audit can reduce aggregation mismatch by converting whole-artifact synthesis into a sequence of localized or variable-neighborhood repairs.",
  "support_scope": "Code, stories, arguments, plans, and other artifacts whose completed structure reveals interfaces, dependencies, payoffs, or invariants.",
  "revocation_trigger": "Equal-budget held-out experiments show no external-utility lift over fresh generation, or repeated repair increases regression and proxy overfitting.",
  "not_supported_claims": "Does not guarantee a global optimum. Does not imply the initial candidate is in a useful basin. Does not authorize a learned verifier to override hard checks."
}
```

---

## 22. Conclusion

Aggregation mismatch is the failure of local value to compose into global task value. It explains why fluent drafts, plausible clauses, reasonable modules, accurate summaries, useful tool outputs, or successful subtasks can still produce a globally wrong artifact.

This mismatch is primitive because it targets a distinct station in the value-preservation pipeline: the composition operator. It can occur even when the system has the right information, knows the state, activates the right capability, reaches the right parts, and understands the objective. The failure lies in how parts are assembled.

The constructive response is Compositional Governance. Make dependencies explicit. Define interfaces. Register invariants. Track bindings. Map claims to support. Audit relations, not just parts. Turn integration failures into control deltas and regression guards. Commit only artifacts and state transitions that preserve the relevant global structure.

The broader lesson for LLM systems is simple:

> Do not assume that locally good generations form a globally good system. Govern the composition relation.

---

## Appendix A: Compact Glossary

| Term | Definition |
|---|---|
| Aggregation mismatch | Failure of local value to compose into global utility under an aggregation operator. |
| Composition operator | The procedure that assembles parts into a final artifact or state transition. |
| Local value | A part-level quality signal, such as plausibility, correctness, fluency, or local usefulness. |
| Global utility | Task-level value of the assembled artifact. |
| Autoregressive mediocrity | Aggregation mismatch in sequential token or segment generation. |
| Compositional Governance | Governance of dependencies, interfaces, invariants, bindings, and assembly rules. |
| Dependency graph | Object recording how parts rely on one another. |
| Interface contract | Object specifying assumptions and guarantees between producer and consumer parts. |
| Invariant registry | Object recording global properties that must hold across the artifact. |
| Binding record | Object recording identity, reference, alias, and scope bindings. |
| Claim-support map | Object linking claims to evidence and support scope. |
| Integration ledger | Object recording local changes and their global effects. |
| Composition audit | Audit that checks relations among parts and global invariants. |
| Invariant theater | Listing invariants without making them enforceable or auditable. |
| False modularity | Treating coupled components as independent. |

---

## Appendix B: Minimal Compositional Governance Template

```json
{
  "task": "Describe the task or artifact being composed.",
  "parts": ["List the local components."],
  "composition_operator": "Describe how parts become the final artifact.",
  "dependencies": [
    {
      "from": "part_a",
      "to": "part_b",
      "relation": "requires | constrains | references | consumes | supports"
    }
  ],
  "interfaces": [
    {
      "producer": "part_a",
      "consumer": "part_b",
      "assumption": "What the consumer assumes.",
      "guarantee": "What the producer guarantees."
    }
  ],
  "global_invariants": [
    {
      "name": "invariant_name",
      "assertion": "What must hold globally.",
      "severity": "low | medium | high | critical"
    }
  ],
  "local_generation_rules": ["Rules for generating parts."],
  "composition_audits": ["Checks over relations and invariants."],
  "regression_guards": ["Guards against known composition failures."],
  "revocation_triggers": ["When to revise the composition structure."]
}
```

---

## Appendix C: One-Page Operational Summary

Aggregation mismatch asks:

```text
Do good parts make a good whole?
```

If the answer is not reliably yes, use Compositional Governance.

Minimum procedure:

```text
1. Identify parts.
2. Identify dependencies.
3. Define interfaces.
4. Register global invariants.
5. Generate local parts.
6. Bind references and assumptions.
7. Audit the assembled whole.
8. Localize relation failures.
9. Write control deltas.
10. Add regression guards.
```

Most important warning:

```text
A local critique loop is not a global composition guarantee.
```

Most important design principle:

```text
When value depends on relations among parts, govern the relations.
```
