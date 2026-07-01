# Audit Engineering for Governed LLM Systems

**Failure Localization, Control-Space Write-Back, and Regression Governance**  
**Working Draft v0.1**  
**Companion Technical Report to _A Structural Theory of Value Preservation in LLM Systems_**  

---

## Abstract

LLM systems are increasingly built around iterative generation, critique, retrieval, tool use, execution feedback, and revision. These loops often improve surface quality, but they do not automatically create durable system learning.

A model may critique an answer, produce a better candidate, and still leave the underlying failure mode untouched. The next similar task may fail again because the defect was never localized, written back into the control space, guarded against, or committed into state.

This report introduces **Audit Engineering** as the discipline of converting failures into durable control improvements for governed LLM systems.

An audit is not a score, a preference judgment, or a generic critique. A useful audit identifies a localized defect, grounds it in evidence, maps it to a mismatch type, and identifies the task-specific control object that should change. It also records mechanism attribution when operationalized, produces a control delta, and creates a regression guard that will fail if the defect family recurs.

Audit Engineering is built on two asymmetries. First, excellent generation is often harder than defect identification. Second, complete upfront specification is often harder than counterexample-driven specification repair.

High-value systems should exploit these asymmetries by turning candidate failures into improvements in task representation, capability routing, support search, aggregation constraints, specification, verification, and hard state.

The report defines the core audit lifecycle:

```text
Candidate Artifact
  → Audit
  → Primitive Mismatch Diagnosis
  → Task-Specific Control Object
  → Mechanism Attribution
  → Control Delta
  → GKO / GEO / Verifier / State Update
  → Regression Guard
  → Defect Ledger
  → Future Routing / Search / Rendering / Revocation
```

It specifies the structure of Audit Findings, Control Deltas, Regression Guards, Defect Ledgers, verifier authority, and mismatch-specific audit patterns. It also defines the standard failure modes of auditing itself: score-only audit, vague critique, audit theater, regression theater, verifier poisoning, proxy overfitting, local patching, stale guards, and over-governance.

The central claim is that governed LLM systems do not improve merely by being criticized. They improve when failure information is localized, objectified, written back, guarded, and made available to future system behavior.

---

## Contents

- [1. Purpose and Scope](#1-purpose-and-scope)
- [2. Core Thesis](#2-core-thesis)
- [3. What Audit Is Not](#3-what-audit-is-not)
- [4. Foundational Asymmetries](#4-foundational-asymmetries)
- [5. Audit in the Value-Preservation Pipeline](#5-audit-in-the-value-preservation-pipeline)
- [6. Audit Finding](#6-audit-finding)
- [7. Control Delta](#7-control-delta)
- [8. The Audit Lifecycle](#8-the-audit-lifecycle)
- [9. Mismatch-Specific Audit Patterns](#9-mismatch-specific-audit-patterns)
- [10. Failure Localization](#10-failure-localization)
- [11. Regression Governance](#11-regression-governance)
- [12. Defect Ledger](#12-defect-ledger)
- [13. Verifier Authority and Verifier Integrity](#13-verifier-authority-and-verifier-integrity)
- [14. Audit Patterns](#14-audit-patterns)
- [15. Anti-Patterns](#15-anti-patterns)
- [16. Integration with Knowledge Governance](#16-integration-with-knowledge-governance)
- [17. Integration with SGAR](#17-integration-with-sgar)
- [18. Risk-Tiered Audit Intensity](#18-risk-tiered-audit-intensity)
- [19. Reference Example: Text-to-SQL](#19-reference-example-text-to-sql)
- [20. Reference Example: Code Repair](#20-reference-example-code-repair)
- [21. Audit Closure Criteria](#21-audit-closure-criteria)
- [22. Audit-of-Audit](#22-audit-of-audit)
- [23. Relationship to Formal Traditions](#23-relationship-to-formal-traditions)
- [24. Minimal Viable Audit Engineering](#24-minimal-viable-audit-engineering)
- [25. Conclusion](#25-conclusion)
- Appendices: [A. Compact Schemas](#appendix-a-compact-schemas) · [B. Audit Checklist](#appendix-b-audit-checklist) · [C. Severity Guide](#appendix-c-severity-guide) · [D. Closure Statuses](#appendix-d-closure-statuses)

This document uses several governed objects by acronym throughout. The most important are the **GKO (Governed Knowledge Object)**, the durable unit of governed control knowledge written back by an audit; the **GEO (Governed Escalation Object)**, which carries a finding to human or higher-authority review; and the **SGAR (State-Governed Agent Regime)**, the state model under which an audit conclusion becomes authoritative only after a committed transition.

---

## 1. Purpose and Scope

This document is the audit-focused companion to a structural theory of value preservation in LLM systems and to the governed object model specification. The structural theory explains where task value can be lost in a world-to-output pipeline. The object model defines how governed knowledge, execution, findings, deltas, guards, and state records can be represented. This report focuses on the loop that connects failure to repair.

The central question is:

> How should an LLM system convert a failure into a durable improvement rather than a one-time correction?

Audit Engineering applies to systems where errors matter, failures recur, task specifications are incomplete, or progress must persist across generations and actions. It is relevant for:

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

The report does not prescribe a single software stack. It defines an implementation-neutral discipline. A system may implement these objects in JSON, a database, a state machine, a prompt compiler, a CI pipeline, a task graph, or a human review workflow. The key requirement is semantic: failures must be localized and written back into the relevant control layer.

---

## 2. Core Thesis

The core thesis is:

> Auditing becomes engineering only when failure signals are transformed into control-space modifications and regression governance.

A generic critique may say:

```text
The answer is incomplete.
The reasoning is weak.
The SQL is wrong.
The plan misses an edge case.
The code may fail.
```

These statements may be true, but they are not yet engineering artifacts. They do not specify which part of the system should change. They do not identify whether the failure came from missing information, wrong state, wrong capability routing, low support, bad aggregation, or wrong specification. They do not create a durable guard.

An audit finding should instead say:

```text
The output joined table A to table C directly, but the schema requires A → B → C.
Evidence: foreign-key graph shows no A.c_id; execution error references missing column C.id.
Mismatch: aggregation + observation-representation.
Control object: join-path control object.
Mechanism attribution: capability_routing.
Control delta: add join_path_constraint for this schema family.
Regression guard: re-run representative query requiring A → B → C and fail if direct A → C join appears.
```

This is a different kind of object. It localizes the defect, names its mechanism, changes the control space, and prevents silent recurrence.

Audit Engineering therefore treats a failure as a resource. The failure reveals something about the task, the system, the specification, the representation, the verifier, or the state transition contract.

The goal is to capture that information in a form the system can use later.

---

## 3. What Audit Is Not

Audit Engineering begins by distinguishing audit from several weaker activities.

### 3.1 Audit Is Not Scoring

A score ranks or rates an artifact:

```text
7/10
passes / fails
preferred / not preferred
more helpful than candidate B
```

Scoring may be useful for selection, but it does not necessarily improve the system. A score does not explain which control object should change. It does not identify recurrence conditions. It does not produce a guard.

A score becomes audit-relevant only when it is connected to localized evidence and repair targets.

### 3.2 Audit Is Not Generic Critique

Generic critique identifies broad dissatisfaction:

```text
This lacks detail.
This may be wrong.
This is too vague.
This needs more rigor.
```

Such critique is often easy for LLMs to produce. It is also easy to ignore, overfit, or satisfy superficially. Audit Engineering requires a narrower and more actionable object:

```text
What exactly failed?
Where is the evidence?
Which mismatch produced the failure?
Which system layer should change?
What guard should fail if this returns?
```

### 3.3 Audit Is Not Self-Reflection Alone

Self-reflection can improve local outputs, but it is not sufficient as a governance mechanism. A reflection that remains inside the same conversational context can be forgotten, contradicted, overwritten, or rationalized away. It becomes durable only when it is externalized into a finding, delta, guard, or state record.

### 3.4 Audit Is Not Final Authority by Default

An LLM-generated audit is not automatically authoritative. Audit authority depends on evidence and verifier hierarchy. Tool outputs, execution results, type checks, formal validators, database results, human expert decisions, and committed state records may outrank LLM judgment.

The audit principle is:

```text
LLMs may propose audit findings.
Evidence and verifier hierarchy determine whether findings are accepted.
```

---

## 4. Foundational Asymmetries

Audit Engineering is useful because many high-value tasks have asymmetries that can be exploited.

### 4.1 Generation-Verification Asymmetry

In many domains, producing a correct artifact is harder than checking a candidate for specific defects.

Examples:

```text
Writing a correct SQL query is difficult; executing it and inspecting errors is easier.
Writing a bug-free patch is difficult; running tests and static checks is easier.
Writing a fully correct plan is difficult; identifying a missing dependency is easier.
Writing a complete specification is difficult; recognizing a counterexample is easier.
```

The system should therefore not rely exclusively on generation. It should create candidate artifacts and then exploit easier verification channels to localize defects.

### 4.2 Specification-Counterexample Asymmetry

Users often cannot provide a complete specification upfront. They can often recognize a violation once they see it. Candidate failures reveal hidden requirements.

This means audit is not merely a check against a fixed specification. It is also a mechanism for discovering and repairing the specification.

The pattern is:

```text
Initial weak specification
  → candidate artifact
  → counterexample or defect
  → revised specification object
  → regression guard
```

### 4.3 Local-Global Asymmetry

LLMs are often good at local improvements: rewriting, elaborating, filling gaps, generating alternatives, and explaining. But high-value tasks may depend on global invariants. Audit should therefore search for failures of composition, not only local defects.

### 4.4 Context-State Asymmetry

The conversation context can contain an audit conclusion, but it does not automatically make that conclusion authoritative. Audit results should update governed objects or hard state only through explicit acceptance rules.

---

## 5. Audit in the Value-Preservation Pipeline

The structural theory models LLM system behavior as a pipeline:

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

An audit asks where value was lost in this pipeline. Each primitive mismatch corresponds to a distinct audit question.

| Mismatch | Audit Question | Typical Repair Target |
|---|---|---|
| Observation-representation | Did the decisive variable enter the operational representation? | Channel, tool, schema, retrieval, representation format |
| State | Was the relevant latent state identified or preserved? | State hypothesis, discriminator, clarification, branch policy |
| Fitting-boundary | Was the right capability activated in the right domain? | Router, trigger condition, role binding, suppression rule |
| Support | Was the high-value structure reachable under search and budget? | Candidate expansion, control-space search, rare-pattern enumeration |
| Aggregation | Did locally plausible parts compose into global value? | Dependency graph, invariant, composition rule, global validator |
| Specification | Did the evaluator represent true task utility? | Rubric, success condition, proxy correction, revocation rule |

This table is the core diagnostic map. A useful audit finding does not stop at “wrong.” It maps wrongness to a system station.

---

## 6. Audit Finding

An **Audit Finding** is the atomic object of Audit Engineering. It records a localized failure and connects that failure to evidence, a task-specific control object, mechanism attribution, repair, and regression governance.

A minimal Audit Finding schema is:

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
  "control_object_ref": "object.id",
  "control_object_type": "sql_dag | claim_evidence_map | state_table | router_rule | rubric | other",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "repair_layer": "agent | training | hybrid | unknown",
  "mechanism_role": "primary | amplifier | downstream | unknown",
  "repair_object": "gko | geo | verifier | transition_contract | state_record | regression_guard | unknown",
  "control_delta": "proposed change to governed control space",
  "regression_guard": "test or condition that should fail if the defect recurs",
  "authority": "proposed | accepted | rejected | superseded",
  "confidence": "low | medium | high",
  "revocation_trigger": "conditions under which this finding should be weakened or revoked"
}
```

A strong finding has five properties:

```text
localized: it names a specific defect, not general dissatisfaction
evidenced: it points to observable support
mechanistic: it maps to a mismatch or system station
actionable: it identifies the object that should change
regressable: it yields a future guard
```

A weak finding lacks one or more of these properties.

---

## 7. Control Delta

A **Control Delta** is the proposed system change induced by an audit finding. It is the write-back payload of the audit loop.

A control delta should answer:

```text
What object or layer should change?
What exactly should be added, removed, weakened, strengthened, or revised?
Under what conditions should the change apply?
How should conflicts be resolved?
What guard will check whether the change works?
```

A minimal schema is:

```json
{
  "id": "delta.unique_identifier",
  "source_finding_id": "finding that produced the delta",
  "operation": "create | update | weaken | strengthen | revoke | split | merge | reorder | escalate",
  "target_type": "GKO | GEO | verifier | representation | router | state_record | transition_contract | regression_guard",
  "target_id": "object being modified, if any",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "proposed_change": "precise change description",
  "condition": "when this delta should apply",
  "priority": "conflict-resolution priority",
  "expected_effect": "failure mode this delta should reduce",
  "risk": "possible negative side effects",
  "acceptance_criterion": "condition for accepting the delta",
  "rollback_condition": "condition for reverting the delta"
}
```

Control deltas are important because they prevent audits from becoming one-time comments. The system improves only when a finding becomes a change in a governed object. Mechanism attribution can guide that change, but hard audit repairs objects, not abstractions.

---

## 8. The Audit Lifecycle

The reference lifecycle is:

```text
1. Produce or receive a candidate artifact.
2. Select audit lenses based on task risk and mismatch profile.
3. Generate audit findings.
4. Ground findings in evidence and verifier hierarchy.
5. Identify the task-specific control object to be constructed or revised.
6. Add mechanism attribution if operationalized enough to be meaningful.
7. Accept, reject, merge, or escalate findings.
8. Convert accepted findings into control deltas.
9. Apply deltas to governed objects or state.
10. Create regression guards for defect families.
11. Record the defect in a ledger.
12. Regenerate or continue under the updated control space.
13. Monitor for recurrence and guard health.
```

Pseudocode:

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

The loop may be automated, human-mediated, or hybrid. The important property is that accepted failures are written back through governed task objects rather than left as abstract commentary.

---

## 9. Mismatch-Specific Audit Patterns

Each primitive mismatch requires a distinct audit style. A system that uses the same generic critique for all errors will miss the repair target.

### 9.1 Observation-Representation Audit

Question:

```text
Did the variables that determine task success enter the system's operational representation?
```

Symptoms:

```text
The model reasons fluently over an incomplete prompt.
The answer ignores database values, raw logs, hidden files, schema details, or external state.
The same representation would be produced for value-distinct world states.
The model fills missing variables with defaults or priors.
```

Audit operations:

```text
variable inventory
source coverage check
schema coverage check
retrieval miss analysis
raw-to-representation comparison
compression-loss inspection
tool-access check
```

Possible findings:

```text
Critical table was absent from schema context.
Raw log contained an error code that was omitted from the summary.
Retrieved documents excluded the only source defining the term.
The representation merged two distinct user constraints into one vague phrase.
```

Control deltas:

```text
add required source retrieval
change schema serialization
introduce value sampling
add raw-log inspection step
create representation completeness guard
```

Regression guards:

```text
fail if required source type is absent
fail if schema summary omits foreign-key relation
fail if raw error code is dropped during compression
fail if task-critical variable has no representation slot
```

### 9.2 State Audit

Question:

```text
Did the system identify and preserve the relevant latent state?
```

Symptoms:

```text
The same response is used across states requiring different policies.
The model collapses uncertainty into a single assumption.
The plan is correct only under one hidden regime.
The system forgets which branch was committed.
```

Audit operations:

```text
state hypothesis enumeration
state evidence table
branch sensitivity analysis
clarification need detection
transition-history inspection
state-commitment check
```

Possible findings:

```text
The answer assumes the user wants legal advice, but the request is for policy summarization.
The plan assumes write access to the repository, but state record shows read-only mode.
The SQL query assumes NULL means missing, but database conventions use NULL as a valid category.
```

Control deltas:

```text
add state discriminator
create branch-specific policy
require clarification before action
update state record
add transition precondition
```

Regression guards:

```text
fail if branch-specific constraints are not checked
fail if action proceeds without required state commitment
fail if mutually exclusive state assumptions appear in the same artifact
```

### 9.3 Fitting-Boundary Audit

Question:

```text
Was the right capability triggered in the right domain, and were wrong capabilities suppressed?
```

Symptoms:

```text
The model uses expert-sounding caution instead of a concrete mechanism.
The model overuses a familiar template.
The system refuses a safe task.
The system answers directly when tool use is required.
The system invokes an audit pattern outside its support.
```

Audit operations:

```text
capability inventory
trigger evidence analysis
boundary perturbation
near-miss comparison
over-trigger / under-trigger classification
role-binding inspection
suppression-rule audit
```

Possible findings:

```text
Template SQL generation over-triggered; schema-linking audit did not trigger.
General writing-polish capability over-triggered; factual verification capability was suppressed.
Safety refusal over-triggered without policy-relevant risk evidence.
```

Control deltas:

```text
add router condition
add capability applicability test
add suppressor for misleading template
strengthen tool-use trigger
split broad role into narrower roles
```

Regression guards:

```text
fail if template generation occurs before schema audit in this task class
fail if refusal appears without required risk evidence
fail if tool-required condition does not trigger tool invocation
```

### 9.4 Support Audit

Question:

```text
Was the high-value structure reachable under the current search procedure and budget?
```

Symptoms:

```text
Many candidates share the same missing structure.
Sampling diversity changes wording but not mechanism.
The correct structure is rare, pruned, or never proposed.
The system cannot distinguish rare insight from rare noise.
```

Audit operations:

```text
candidate-space coverage analysis
rare-pattern enumeration
beam diversity inspection
control-space search comparison
pruning-decision audit
support prior correction
```

Possible findings:

```text
No candidate considered a nested query despite task requiring one.
All plans used direct API calls; none considered batch processing.
All explanations assumed one causal mechanism; alternative mechanism was absent.
```

Control deltas:

```text
expand candidate generator
add low-support pattern enumerator
search over intermediate structures
modify pruning rule
add diversity requirement over mechanisms, not surface wording
```

Regression guards:

```text
fail if required candidate family is absent from search set
fail if diversity exists only at wording level
fail if low-support pattern is pruned before verification
```

### 9.5 Aggregation Audit

Question:

```text
Do locally plausible parts compose into a globally valid artifact?
```

Symptoms:

```text
Each section looks good but the argument contradicts itself.
Each SQL clause is plausible but the query returns the wrong set.
Each code change is reasonable but the patch breaks integration.
Each plan step is acceptable but dependencies are impossible.
```

Audit operations:

```text
dependency graph construction
global invariant check
cross-reference check
composition consistency audit
interface compatibility check
end-to-end execution
```

Possible findings:

```text
The WHERE clause filters rows before the aggregation needed by HAVING.
The conclusion depends on a premise not established in earlier sections.
The generated module uses an interface not exported by the dependency.
```

Control deltas:

```text
add global invariant
introduce dependency graph
require end-to-end validation
split generation into plan + render
add composition validator
```

Regression guards:

```text
fail if local components pass but global invariant fails
fail if dependency edge is unresolved
fail if generated artifact references undefined object
```

### 9.6 Specification Audit

Question:

```text
Does the accessible evaluator represent true task utility?
```

Symptoms:

```text
The system optimizes a rubric while missing the user's real goal.
The benchmark metric rewards a semantically wrong artifact.
The answer satisfies prompt wording but violates implicit constraints.
The evaluator cannot distinguish two candidates with different real value.
```

Audit operations:

```text
proxy-risk analysis
rubric-to-utility comparison
counterexample generation
preference conflict inspection
success-condition extraction
not-supported-claim audit
```

Possible findings:

```text
The rubric rewards completeness but the user values decision speed.
Exact-match SQL metric penalizes semantically equivalent query.
The answer follows formatting constraints but omits the required operational recommendation.
```

Control deltas:

```text
revise rubric
add success condition
add negative example
add user-value priority
add proxy limitation warning
```

Regression guards:

```text
fail if candidate satisfies old proxy while violating revised success condition
fail if rubric cannot rank known preference pair correctly
fail if output makes unsupported claim beyond evidence scope
```

---

## 10. Failure Localization

Failure localization is the step that separates audit engineering from generic criticism. It asks where in the system the defect should be repaired.

A defect may appear in the final output but originate elsewhere. For example:

```text
Wrong SQL join
  may originate from missing foreign-key representation,
  or from low support for multi-hop joins,
  or from aggregation failure,
  or from a bad execution repair heuristic.
```

A useful localization process distinguishes:

```text
surface symptom: what is visibly wrong
mechanism: why the system produced it
repair target: which object or layer should change
recurrence family: what class of future failures this represents
```

### 10.1 Localization Ladder

A practical ladder is:

```text
1. Output-level defect
2. Component-level defect
3. Pipeline-station defect
4. Control-object defect
5. Process defect
6. State-authority defect
```

For example:

```text
Output-level: SQL returns wrong rows.
Component-level: join path is wrong.
Pipeline-station: aggregation mismatch + representation omission.
Control-object: missing join-path constraint.
Process: schema audit was skipped.
State-authority: previous schema correction was not committed.
```

The lower the localization, the more durable the repair.

### 10.2 Minimal Repair Target

A good audit avoids overrepair. It should change the smallest control layer that prevents recurrence without causing broader damage.

Bad repair:

```text
Tell the model: be more careful with SQL joins.
```

Better repair:

```text
Require explicit join-path enumeration when the question references columns across non-adjacent tables.
```

Best repair:

```text
Add a schema-conditioned join-path GKO with evidence, applicability condition, priority, and regression guard.
```

---

## 11. Regression Governance

A repair is incomplete unless the system can detect recurrence. Regression governance turns a localized failure into a durable guard.

### 11.1 Regression Guard

A **Regression Guard** is a check that should fail if a defect family recurs.

A minimal schema is:

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

### 11.2 Teeth-Proven Guards

A regression guard has teeth only if reintroducing a representative defect makes the guard fail.

```text
If the guard stays green when the defect is injected,
then the guard does not protect against that defect.
```

This principle prevents regression theater. A guard should not exist merely to make the system look disciplined. It must be connected to a concrete recurrence condition.

### 11.3 Guard Types

Different tasks require different guards:

| Guard Type | Example |
|---|---|
| Unit guard | A specific transformation must preserve a variable. |
| Integration guard | A generated artifact must work across components. |
| Execution guard | SQL or code must run successfully. |
| Semantic guard | Output must satisfy a meaning-level condition. |
| Invariant guard | A global constraint must always hold. |
| Metamorphic guard | Related inputs should produce related outputs. |
| Representation guard | Required variables must appear in structured representation. |
| Routing guard | Required capability must trigger under specific evidence. |
| State-transition guard | Action cannot commit unless verifier condition holds. |
| Human-review guard | Certain findings require expert approval before commitment. |

### 11.4 Guard Granularity

A guard can be too weak or too broad.

Too weak:

```text
Check that the final answer mentions joins.
```

Too broad:

```text
Reject all queries with more than one join.
```

Appropriate:

```text
For schema graphs where referenced columns lie on non-adjacent tables, require the generated SQL join path to correspond to a valid path in the foreign-key graph.
```

The appropriate guard tracks the defect family without forbidding valid variation.

---

## 12. Defect Ledger

A **Defect Ledger** records failure families and their governance history. It prevents the system from treating recurring defects as novel each time.

A minimal defect ledger entry is:

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
  "status": "open | mitigated | guarded | recurring | promoted | revoked | accepted_risk",
  "recurrence_count": 0,
  "last_seen": "timestamp or version",
  "promoted_to_training": false,
  "training_corpus_refs": ["dataset or curriculum ids"],
  "retirement_condition": "when runtime governance can stop carrying this defect family",
  "owner": "system | human | team | component",
  "notes": "additional context"
}
```

The ledger supports several operations:

```text
detect recurrence
merge duplicate findings
track repair effectiveness
identify stale guards
escalate unresolved defect families
promote recurrent learning-side defects into training
record accepted risk
support postmortems
```

A ledger should distinguish between a one-off error and a defect family. Audit Engineering is most valuable when a failure represents a family of future risks.

---

## 13. Verifier Authority and Verifier Integrity

Audits require authority hierarchy. Not every evaluator has the same authority.

A typical hierarchy is:

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

The exact hierarchy depends on the task. The important rule is that the hierarchy must be explicit.

### 13.1 Verifier Object

A verifier object should specify:

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

### 13.2 Verifier Poisoning

Verifier poisoning occurs when the system optimizes around a weak or corrupted verifier. Examples:

```text
The model learns to satisfy rubric keywords without satisfying task value.
A SQL query passes execution but returns semantically wrong rows.
A code patch passes narrow tests but violates untested requirements.
An LLM judge rewards confident explanations.
```

Verifier integrity requires:

```text
scope limits
known failure modes
cross-verification
counterexample tests
guard health checks
human escalation when authority is insufficient
```

### 13.3 LLM Auditors

LLMs can be useful auditors, especially for finding inconsistencies, missing assumptions, weak specifications, and possible failure modes. But LLM auditors should not be treated as final authority unless the task explicitly grants that role.

The safe pattern is:

```text
LLM proposes finding.
Evidence grounds finding.
Verifier hierarchy accepts or rejects finding.
Control delta is applied only after acceptance.
```

---

## 14. Audit Patterns

This section defines reusable audit patterns.

### 14.1 Minimal Pair Audit

Construct or identify two cases that differ only in the suspected failure condition. If the system behaves the same when it should behave differently, the audit has localized a distinction the system fails to preserve.

Useful for:

```text
observation-representation
state
fitting-boundary
specification
```

### 14.2 Boundary Perturbation Audit

Perturb trigger evidence near the applicability boundary of a capability. Check whether the capability turns on and off in the right region.

Useful for fitting-boundary mismatch.

Example:

```text
A task requiring tool access should trigger tool use.
A nearly identical task with all information already present should not.
```

### 14.3 Control-Space Coverage Audit

Inspect whether the candidate set covers required structural families, not merely different wordings.

Useful for support mismatch.

Example:

```text
Candidate SQL set should include at least one valid multi-hop join when schema graph requires it.
```

### 14.4 Global Invariant Audit

Check whether local components satisfy a shared global invariant.

Useful for aggregation mismatch.

Example:

```text
Every generated code reference must resolve to an imported or defined symbol.
```

### 14.5 Proxy Counterexample Audit

Find a candidate that scores well under the proxy but poorly under true utility, or vice versa.

Useful for specification mismatch.

Example:

```text
A response follows all formatting rules but fails to answer the user's decision question.
```

### 14.6 State Commitment Audit

Check whether the system changed its authoritative state only after a valid transition.

Useful for SGAR integration.

Example:

```text
The agent marked a task complete because it generated a plan, but no tool result or human confirmation committed completion.
```

---

## 15. Anti-Patterns

Audit Engineering must also audit itself. The most common failure modes are below.

### 15.1 Score-Only Audit

The system assigns scores without localized findings or repair targets.

Symptom:

```text
Candidate A: 8/10, Candidate B: 7/10.
```

Repair:

```text
Require each score difference above threshold to cite evidence and mismatch type.
```

### 15.2 Vague Critique

The audit produces high-level criticism that cannot be converted into a delta.

Symptom:

```text
Needs more depth.
Be more rigorous.
Consider edge cases.
```

Repair:

```text
Reject findings without localized evidence and repair target.
```

### 15.3 Audit Theater

The system performs audit steps to appear rigorous, but findings do not affect future behavior.

Symptom:

```text
Audit section exists, but no control object changes.
```

Repair:

```text
Require accepted high-severity findings to produce deltas, guards, revocations, or explicit accepted-risk records.
```

### 15.4 Regression Theater

The system creates tests or guards that do not fail when representative defects recur.

Repair:

```text
Teeth-prove guards by injecting representative defects.
```

### 15.5 Local Patch Overwrite

The system fixes the specific output without repairing the defect family.

Symptom:

```text
This SQL query is corrected, but the join-path generator remains unchanged.
```

Repair:

```text
Require defect-family classification before closing high-severity findings.
```

### 15.6 Proxy Overfitting

The system optimizes the audit rubric rather than task utility.

Repair:

```text
Maintain counterexamples where rubric satisfaction diverges from task success.
```

### 15.7 Verifier Poisoning

A weak verifier becomes a target for optimization.

Repair:

```text
Audit verifier scope, add cross-checks, and record known failure modes.
```

### 15.8 Stale Guard

A guard remains active after the task distribution or object semantics change.

Repair:

```text
Give guards lifespan, scope, and revocation triggers.
```

### 15.9 Over-Governance

The audit system introduces more complexity, latency, or brittleness than the task warrants.

Repair:

```text
Use risk-tiered audit intensity and explicit cost-benefit thresholds.
```

---

## 16. Integration with Knowledge Governance

Audit Engineering writes into Knowledge Governance. A finding may produce or modify a GKO.

Examples:

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

A GKO created from audit should include:

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

This creates traceability:

```text
Why does this control rule exist?
Because finding F exposed defect family D, delta Δ repaired it, and guard G protects it.
```

Without this trace, governed knowledge becomes unexplained prompt accumulation.

---

## 17. Integration with SGAR

Audit Engineering also integrates with State-Governed Agent Regime.

An audit result should not automatically change hard state. It must pass a transition contract.

Example transition:

```text
S: current task state
A: propose accepting audit finding F and applying delta Δ
O: evidence package E and verifier result V
V: acceptance criterion checks evidence, authority, risk, and conflicts
S': updated state with F accepted, Δ applied, guard G registered
```

The state principle is:

```text
An audit conclusion becomes authoritative only when committed.
```

This prevents several failures:

```text
the model says a defect was fixed, but no guard exists
the model remembers a rule, but state does not contain it
a rejected finding continues to influence later behavior
a revoked GKO remains in prompt context
a task is marked complete without verifier-backed transition
```

Audit findings, deltas, guards, and ledger updates should therefore have status fields:

```text
proposed
accepted
applied
rejected
superseded
revoked
committed
rolled_back
promoted
```

### 17.1 Promotion from Defect Ledger to Training

Audit Engineering should not treat every recurrent defect as a forever-runtime patch. When a defect family keeps recurring and its dominant `repair_layer` is `training` or `hybrid`, the ledger should support promotion into mechanism-driven training.

The basic ratchet is:

```text
Audit Finding
  -> Defect Ledger recurrence
  -> repair_layer = training | hybrid
  -> promotion decision
  -> training corpus / curriculum update
  -> runtime guard retained until retirement condition is met
```

Typical promotion conditions are:

```text
the same failure family recurs across tasks
the dominant mechanism target has a learned-side component
agent-layer repair is costly or unstable
the defect is amortizable through data, reward, routing, or world-model training
```

Promotion should not immediately remove runtime governance. The ledger should retain the guard, delta, and owner until a retirement condition is satisfied, such as repeated non-recurrence under representative evaluation.

---

## 18. Risk-Tiered Audit Intensity

Not every task deserves heavy audit. Audit Engineering should be applied selectively.

A simple decision rule is:

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

Risk tiers:

| Tier | Audit Intensity | Example |
|---|---|---|
| Tier 0 | No formal audit | Low-risk rewriting, brainstorming |
| Tier 1 | Lightweight critique | Ordinary drafts, summaries |
| Tier 2 | Structured finding | Reusable outputs, moderate stakes |
| Tier 3 | Finding + delta + guard | Code, SQL, operational recommendations |
| Tier 4 | Full governance + state commitment | Long-horizon agents, high-cost decisions |

Over-auditing can harm the system by adding latency, brittle rules, false positives, and governance debt. The audit layer should itself be governed by cost-benefit rules.

---

## 19. Reference Example: Text-to-SQL

Consider a text-to-SQL task:

```text
Question: Which departments have employees who joined after 2020 and have no completed training records?
```

A candidate SQL query joins `departments` directly to `training_records`, omitting the `employees` table. The query executes but returns wrong results.

### 19.1 Weak Critique

```text
The SQL may have an incorrect join and should be checked.
```

This is not enough.

### 19.2 Audit Finding

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
  "control_object_ref": "join_path_control_object",
  "control_object_type": "sql_dag",
  "mechanism_axis": "capability_routing",
  "repair_layer": "agent",
  "mechanism_role": "primary",
  "repair_object": "gko",
  "control_delta": "Create join-path constraint requiring schema-graph path coverage for all question-bound entities.",
  "regression_guard": "For questions binding departments, employees, and training_records, fail if generated SQL lacks employees in the join path.",
  "authority": "accepted",
  "confidence": "high"
}
```

### 19.3 Control Delta

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

### 19.4 Regression Guard

```text
Guard: For each generated SQL query, extract question-bound schema entities and verify that the SQL join graph covers a valid schema path connecting them.
Failure condition: any bound entity is absent or connected through an invalid edge unless a documented shortcut relation exists.
```

The important point is that the system has not merely corrected one query. It has learned a join-path governance rule with evidence, scope, risk, and a guard.

---

## 20. Reference Example: Code Repair

A model generates a patch that fixes a failing test but introduces a hidden state mutation.

### 20.1 Audit Finding

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
  "control_object_ref": "state_isolation_invariant",
  "control_object_type": "rubric",
  "mechanism_axis": "search_execution",
  "repair_layer": "agent",
  "mechanism_role": "downstream",
  "repair_object": "regression_guard",
  "control_delta": "Add order-randomized test guard and state-isolation invariant.",
  "regression_guard": "Run affected test suite under randomized order and fail on global cache mutation outside allowed lifecycle.",
  "authority": "accepted",
  "confidence": "high"
}
```

### 20.2 Control Lesson

The defect was not merely a bad line of code. It revealed an unstated invariant:

```text
Request-local state must not be stored in module-level mutable objects.
```

The durable repair is therefore a GKO or code-invariant guard, not just a patch edit.

---

## 21. Audit Closure Criteria

A finding should not be closed merely because the immediate artifact was revised. Closure should require one of the following:

```text
1. The finding was rejected with evidence.
2. The defect was accepted as low-risk or out-of-scope.
3. A control delta was applied.
4. A regression guard was created or updated.
5. A state transition committed the repair.
6. A revocation or weakening action was recorded.
7. The finding was merged into an existing defect family.
```

For high-severity findings, closure should normally require:

```text
accepted finding
+ applied delta
+ guard
+ ledger update
+ committed state
```

This prevents premature closure.

---

## 22. Audit-of-Audit

The audit system itself should be audited. An audit process can become stale, performative, overbroad, or misaligned.

Audit-of-audit questions:

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

An audit rule should have its own scope and revocation conditions.

Example:

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

## 23. Relationship to Formal Traditions

Audit Engineering is related to several existing traditions, but it is adapted to open-ended LLM systems.

### 23.1 Counterexample-Guided Inductive Synthesis

The loop resembles CEGIS:

```text
candidate → counterexample → refinement
```

The difference is that LLM tasks often lack a complete formal specification. Audit Engineering may refine the candidate, the search space, the specification, the representation, the router, or the verifier.

### 23.2 Mutation Testing

Teeth-proven regression guards parallel mutation testing. A test is meaningful only if it detects representative injected defects. Audit Engineering generalizes this idea from program tests to LLM task failures and governed control objects.

### 23.3 Truth Maintenance and Belief Revision

Audit findings can create, revise, or revoke governed knowledge. This resembles truth-maintenance systems, but applied to task-specific control knowledge rather than general beliefs.

### 23.4 Incident Response and Postmortems

A defect ledger resembles incident management. The difference is that LLM audit findings often target representation, specification, routing, and control-space objects, not only code or infrastructure.

---

## 24. Minimal Viable Audit Engineering

A minimal implementation does not need every object in the full specification. It needs five commitments:

```text
1. Findings must be localized.
2. Findings must cite evidence.
3. Findings must name a repair target.
4. Accepted findings must produce a control delta or accepted-risk record.
5. Serious recurring defects must have regression guards.
```

A minimal finding format is:

```text
Finding:
Evidence:
Mismatch:
Repair target:
Control delta:
Regression guard:
```

This lightweight format is often enough to turn critique into engineering.

---

## 25. Conclusion

LLM systems do not become reliable merely by adding critique. They become more reliable when critique becomes audit, audit becomes finding, finding becomes control delta, control delta becomes governed object, and governed object becomes future behavior through guards and state transitions.

Audit Engineering is the discipline that manages this conversion. It exploits the fact that specific defects are often easier to identify than excellent artifacts are to generate, and that specifications are often easier to repair from counterexamples than to complete upfront.

The central invariant is:

```text
No serious failure should end as a mere comment.
```

A serious failure should become one of:

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

In governed LLM systems, failure is not only an error. It is one of the primary sources of durable control knowledge.

---

## Appendix A: Compact Schemas

### A.1 Audit Finding

```json
{
  "id": "finding.unique_identifier",
  "artifact_id": "artifact being audited",
  "finding": "localized defect statement",
  "evidence": ["specific evidence"],
  "mismatch_type": ["observation_representation | state | fitting_boundary | support | aggregation | specification | compound"],
  "severity": "low | medium | high | critical",
  "control_object_ref": "object.id",
  "control_object_type": "sql_dag | claim_evidence_map | state_table | router_rule | rubric | other",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "repair_layer": "agent | training | hybrid | unknown",
  "mechanism_role": "primary | amplifier | downstream | unknown",
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
  "status": "open | mitigated | guarded | recurring | promoted | revoked | accepted_risk",
  "recurrence_count": 0,
  "last_seen": "timestamp or version",
  "promoted_to_training": false,
  "training_corpus_refs": ["dataset or curriculum ids"],
  "retirement_condition": "condition for removing the runtime carry cost",
  "owner": "system | human | team | component",
  "notes": "additional context"
}
```

---

## Appendix B: Audit Checklist

For any serious candidate artifact, ask:

```text
1. What exactly failed?
2. What evidence supports the finding?
3. Which primitive mismatch or compound mismatch is involved?
4. Which governed task object should change, and which mechanism axis is implicated?
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

## Appendix C: Severity Guide

| Severity | Meaning | Typical Requirement |
|---|---|---|
| Low | Local defect, low recurrence or low cost | Comment or lightweight delta |
| Medium | Meaningful quality issue or moderate recurrence risk | Finding + possible delta |
| High | Task-value failure or likely recurrence | Finding + delta + guard |
| Critical | Expensive, unsafe, irreversible, or state-corrupting failure | Finding + delta + guard + state commitment + escalation |

---

## Appendix D: Closure Statuses

| Status | Meaning |
|---|---|
| proposed | Finding or delta has been generated but not accepted. |
| accepted | Evidence and authority are sufficient. |
| rejected | Finding or delta was not supported. |
| applied | Control delta has modified the target object. |
| guarded | A regression guard exists. |
| committed | State transition has made the change authoritative. |
| superseded | Replaced by a better finding, delta, or guard. |
| revoked | Removed or invalidated by later evidence. |
| accepted_risk | Known issue intentionally left unresolved under stated conditions. |
