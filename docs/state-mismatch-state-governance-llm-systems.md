# State Mismatch and State Governance in LLM Systems

**Latent Regimes, Identifiability, and State-Conditioned Control**  
**Working Draft v0.1**  
**Xinyun Wang, Shuliang Liang**

---

## Abstract

High-value LLM systems often fail not because the model lacks fluent language, relevant knowledge, or a plausible local strategy, but because the system acts as if it knows which situation it is in when the decisive latent state remains unresolved. The same prompt, schema, user instruction, code trace, research question, market description, or tool output may be compatible with multiple task states, and the optimal action may reverse across those states. In such cases, more confident generation can worsen performance: the model collapses uncertainty into one convenient interpretation and then optimizes a state-inappropriate policy.

This document develops **state mismatch** as one of the six primitive mismatches in the structural theory of value preservation in LLM systems. State mismatch is located at the pipeline station where the system must infer, preserve, branch over, or update the latent task state from its available observations and representations:

```text
S_world → O → Z → state belief / state hypothesis → capability routing → candidate support → aggregation → evaluation
```

The core claim is:

> State mismatch occurs when the correct policy or evaluation depends on a latent state that is not identified, preserved, or updated by the system, and candidate actions have different value rankings across plausible states.

This distinguishes state mismatch from observation-representation mismatch. Observation-representation mismatch asks whether the decisive variables enter the operational representation at all. State mismatch asks whether, given the operational representation, the system can determine which latent regime, phase, user intent, environment condition, data regime, dependency structure, or task state is active.

The document introduces a formal model of state mismatch, a taxonomy of state failure modes, diagnostic signatures, state-governance objects, audit findings, control deltas, regression guards, and integration rules with Knowledge Governance, Audit Engineering, and State-Governed Agent Regime. It also explains how state mismatch compounds with the other primitive mismatches and why state uncertainty must often be represented explicitly rather than collapsed prematurely into a single answer.

---

## 0. Position in the Unified Theory

This document is part of the governed LLM systems series.

The main structural theory defines LLM system failure as value loss across a world-to-output pipeline. The object-model specification defines governed objects such as GKOs, audit findings, control deltas, regression guards, and state records. Audit Engineering explains how failures are localized and written back into the control space. SGAR explains how verified progress becomes committed hard state. The individual mismatch documents expand each pipeline station.

This document expands the **state station**.

It should be read as distinct from, but connected to, the SGAR runtime document:

```text
State Mismatch:
  epistemic / diagnostic problem.
  Which latent task state are we in?

State-Governed Agent Regime:
  runtime authority problem.
  Which state transitions are actually committed?
```

State mismatch concerns **state identification**. SGAR concerns **state commitment**. A system can identify the correct latent state but fail to commit it correctly; that is an SGAR failure. A system can maintain perfect hard-state logs while acting under the wrong latent-state hypothesis; that is state mismatch.

The governing principle of this document is:

> When the value of an action reverses across plausible latent states, do not collapse the state silently. Represent, discriminate, branch, or acquire information.

---

## 1. The Problem: Acting as If the State Were Known

Many LLM systems behave as if the current task state is obvious. They infer a single user intent, a single database interpretation, a single code-failure cause, a single document status, a single plan phase, a single market regime, or a single evaluation criterion, and then generate accordingly.

This is often efficient. In low-stakes tasks, the most likely state may be good enough. In many conversational contexts, users expect the assistant to infer intent without repeatedly asking questions. However, in high-value tasks, hidden state can determine the entire action policy.

A user asks:

```text
"Find the customers with the highest activity."
```

The state may be:

```text
activity = number of orders
activity = total revenue
activity = number of logins
activity = recent activity in last 30 days
activity = business-defined engagement score
```

A SQL query generated under one state may be syntactically valid and locally plausible while semantically wrong.

A developer asks:

```text
"Fix this failing test."
```

The state may be:

```text
test is outdated
implementation regressed
dependency version changed
fixture is invalid
environment has nondeterminism
assertion encodes wrong behavior
```

The correct action differs across states. Editing the implementation may be wrong if the test is obsolete. Updating the test may be wrong if the implementation regressed.

A research user asks:

```text
"Is this argument strong?"
```

The state may be:

```text
argument is being evaluated for academic publication
argument is being evaluated for investor persuasion
argument is being evaluated for internal research planning
argument is being evaluated for adversarial peer review
argument is being evaluated for conceptual coherence only
```

The appropriate critique depends on the latent evaluation state.

State mismatch appears when the system chooses as though one state is settled, while the available representation does not justify that commitment.

---

## 2. Formal Definition

Let:

```text
S_world
```

be the underlying world or task situation.

Let:

```text
O = φ(S_world)
Z = ψ(O)
```

be the observed data and operational representation available to the LLM system.

Let:

```text
H = {h1, h2, ..., hn}
```

be the set of latent task states relevant to action choice or evaluation.

Let the system maintain, implicitly or explicitly, a belief over states:

```text
b(h | Z)
```

Let candidate actions, outputs, plans, or artifacts be:

```text
a ∈ A
```

and let true utility be state-conditioned:

```text
U(a | h, S_world)
```

State mismatch occurs when three conditions hold:

### Condition 1: State uncertainty

The representation does not identify a single relevant state:

```text
H_plausible(Z) = {h : b(h | Z) > ε}
```

contains more than one plausible state.

### Condition 2: Policy sensitivity

The value ranking over candidate actions differs across plausible states:

```text
∃ h_i, h_j ∈ H_plausible(Z), ∃ a_m, a_n ∈ A
such that

U(a_m | h_i) > U(a_n | h_i)
but
U(a_m | h_j) < U(a_n | h_j)
```

### Condition 3: Premature or incorrect collapse

The system selects, routes, evaluates, or commits as if a single state were known:

```text
π(a | Z) ≈ π(a | Z, h_hat)
```

where `h_hat` is unsupported, under-justified, stale, or wrong.

Together:

> State mismatch exists when multiple latent states remain plausible under the system representation, candidate actions have state-dependent value rankings, and the system fails to preserve, discriminate, or branch over that uncertainty.

A compact definition:

```text
State mismatch = unresolved state uncertainty × state-sensitive policy × premature state collapse.
```

---

## 3. Why State Mismatch Is Primitive

State mismatch is primitive because it has a distinct structural location and distinct repair target.

It occurs after the system has an operational representation `Z`, but before it can correctly route capabilities, search candidates, compose outputs, or evaluate success. The system must determine not just what information is available, but what situation that information indicates.

The state station can be written as:

```text
Z → B(H) → state-conditioned policy
```

where `B(H)` is a belief state, hypothesis set, state label, or branch structure.

If this station fails, downstream operations may be locally coherent but state-inappropriate. A perfectly fluent answer can be wrong because it answers the wrong hidden question. A perfectly executed tool action can be wrong because it assumes the wrong task phase. A strong verifier can be wrong because it checks against the wrong state-conditioned criterion.

State mismatch is not reducible to any other primitive mismatch.

### 3.1 Not Observation-Representation Mismatch

Observation-representation mismatch concerns whether the decisive variables enter `Z`.

State mismatch concerns whether the available variables identify the active state.

A simple contrast:

```text
Observation-representation mismatch:
  The database schema or sample values needed to infer intent are absent.

State mismatch:
  The schema and sample values are present, but multiple intents remain plausible.
```

In the first case, repair requires channel or representation repair. In the second, repair requires state discrimination, branching, or information acquisition.

### 3.2 Not Specification Mismatch

Specification mismatch concerns whether the objective proxy matches true utility.

State mismatch concerns which condition or regime determines the objective.

A system may have a correct rubric for each state but fail to identify which rubric applies. Conversely, it may identify the state correctly but use a bad proxy objective.

Example:

```text
State mismatch:
  Is the user asking for a legal-risk memo or a business-risk memo?

Specification mismatch:
  The memo rubric rewards confidence and brevity but the true task requires caveats and jurisdictional scope.
```

### 3.3 Not Fitting-Boundary Mismatch

Fitting-boundary mismatch concerns whether a learned capability is activated inside or outside its true domain.

State mismatch concerns which state should govern capability selection.

They often compound. A wrong state hypothesis may trigger the wrong capability. But the repair targets differ:

```text
State repair:
  identify or preserve latent regime.

Router repair:
  correct capability activation conditions.
```

### 3.4 Not Support Mismatch

Support mismatch concerns whether the high-value candidate is reachable.

State mismatch concerns whether the system knows which candidate family should be preferred.

A correct candidate may be reachable but rejected because the system assumes the wrong state. Or the system may correctly identify the state but fail to generate a low-support structure needed under that state.

### 3.5 Not Aggregation Mismatch

Aggregation mismatch concerns whether local parts compose into global value.

State mismatch concerns whether the system is composing under the correct latent-state hypothesis.

A plan may be internally consistent under state `h1` but wrong for state `h2`. Its failure is not local-to-global composition alone; it is state-conditioned misapplication.

---

## 4. The State Station in the Value-Preservation Pipeline

The unified pipeline is:

```text
S_world
  → O
  → Z
  → state belief
  → capability routing
  → candidate support
  → aggregation
  → evaluation
```

State governance inserts an explicit representation at the state station:

```text
Z
  → State Hypothesis Set
  → State Belief Record
  → Discriminators / Evidence Requirements
  → State-Conditioned Routing
  → State-Conditioned Search
  → State-Conditioned Evaluation
```

The system should not move from `Z` directly to final generation when the task is state-sensitive. It should first ask:

```text
What states are compatible with Z?
Would the correct answer differ across those states?
What evidence distinguishes them?
Can the system acquire that evidence?
If not, should it branch, ask, defer, or produce a conditional answer?
```

This converts hidden state from an implicit assumption into a governed object.

---

## 5. Taxonomy of State Mismatch

State mismatch appears in several recurrent forms.

### 5.1 Hidden-Regime Mismatch

The task belongs to one of several regimes, but surface observations do not identify which one.

Examples:

```text
market regime: trending / mean-reverting / liquidity shock / event-driven
debugging regime: implementation bug / test bug / environment bug / dependency drift
research regime: exploratory / confirmatory / adversarial / synthesis
database regime: business metric / raw count / recent activity / lifetime aggregate
```

Failure signature:

```text
The system applies a policy appropriate for one regime while evidence supports multiple regimes.
```

Repair:

```text
regime hypothesis enumeration
regime discriminator
state-conditioned policy selection
uncertainty-preserving response
```

### 5.2 Intent-State Mismatch

The user's intended task state differs from the system's inferred intent.

This is common when user language is underspecified but action consequences differ.

Examples:

```text
"make it better"
"clean this up"
"analyze the risk"
"give me the best option"
"optimize this query"
"rank these candidates"
```

Failure signature:

```text
The output is useful under one plausible intent but not under the user's actual intent.
```

Repair:

```text
intent-state matrix
clarifying question if high value at stake
conditional output
explicit assumption header
task-intent GKO
```

### 5.3 Temporal-State Mismatch

The system uses a stale, future, or incorrectly sequenced state.

Examples:

```text
a project task was already completed but the model treats it as pending
a dependency was updated but the model assumes the old API
a database snapshot differs from the assumed snapshot
a conversation decision was superseded
an external process advanced since the last observation
```

Failure signature:

```text
The system's action is coherent relative to an old state but invalid relative to the current state.
```

Repair:

```text
state freshness check
timestamped state records
staleness guards
re-observation before action
SGAR transition logs
```

### 5.4 Phase-State Mismatch

The system misidentifies the current phase of a multi-step task.

Examples:

```text
brainstorming vs final drafting
diagnosis vs repair
search vs selection
planning vs execution
implementation vs verification
pre-commit review vs post-deploy monitoring
```

Failure signature:

```text
The system performs an action appropriate for a different phase.
```

Repair:

```text
phase state record
phase transition contract
allowed action set by phase
phase-specific verifier
```

### 5.5 Environment-State Mismatch

The system misidentifies the external environment in which the action will operate.

Examples:

```text
operating system
library version
database dialect
permissions
resource limits
available tools
deployment target
runtime configuration
```

Failure signature:

```text
The solution is correct in one environment but fails in the actual environment.
```

Repair:

```text
environment probing
tool availability checks
version capture
configuration GKO
environment-conditioned rendering
```

### 5.6 Data-State Mismatch

The system reasons over an assumed data distribution, snapshot, or content state that differs from the real one.

Examples:

```text
empty vs populated table
skewed vs uniform values
missing values present
outliers dominate
entity names normalized differently
foreign-key constraints incomplete
label distribution changed
```

Failure signature:

```text
The artifact is logically plausible but fails against actual data contents.
```

Repair:

```text
data profiling
sample-value retrieval
distribution summaries
execution feedback
value-linking state objects
```

### 5.7 Dependency-State Mismatch

The system misses which dependency, prerequisite, or upstream condition currently holds.

Examples:

```text
feature A depends on migration B
analysis conclusion depends on assumption C
query predicate depends on join path D
project task depends on approval E
model output depends on retrieved source F
```

Failure signature:

```text
The system treats a dependent step as valid before its prerequisite state is true.
```

Repair:

```text
dependency graph
precondition checks
state-gated execution
invariant guards
```

### 5.8 Social or Role-State Mismatch

The system misidentifies the social role, authority, audience, or collaboration state.

Examples:

```text
drafting for internal notes vs public publication
assistant as critic vs coauthor vs implementer
user wants recommendation vs neutral analysis
user has authority to approve vs only requesting exploration
```

Failure signature:

```text
The response has the wrong stance, level of commitment, or authority boundary.
```

Repair:

```text
role-state declaration
audience-state GKO
collaboration contract
authority check
```

### 5.9 Verifier-State Mismatch

The system applies the wrong verifier because it misidentifies the state under which verification should occur.

Examples:

```text
checking syntax when semantic equivalence matters
checking unit tests when integration tests matter
checking exact match when execution equivalence matters
checking factual citations when argumentative validity matters
```

Failure signature:

```text
The artifact passes a verifier that is valid only under a different state.
```

Repair:

```text
verifier applicability conditions
state-conditioned verifier selection
verifier router audit
```

---

## 6. Diagnostic Signatures

State mismatch often leaves recognizable traces.

### 6.1 Plausible but Misframed Output

The output is not low quality in itself. It is good under an unstated assumption. The failure is that the assumption is wrong or unsupported.

Diagnostic question:

```text
Under what state would this output be correct?
Is that state established?
```

### 6.2 Abrupt Policy Commitment

The system moves directly from ambiguous input to a strong action without representing alternatives.

Diagnostic question:

```text
Did the system enumerate plausible state hypotheses before acting?
```

### 6.3 User Correction Reveals Hidden State

The user responds:

```text
"That is not what I meant."
"Actually, this is for..."
"We already did that."
"The data is different."
"That assumption is wrong."
```

Such corrections often reveal state mismatch.

Diagnostic question:

```text
Which latent state did the user correction introduce or invalidate?
```

### 6.4 Tool Output Contradicts Assumed State

The model assumes a table exists, a file has changed, a command succeeded, or a test failed for a reason, but tool output contradicts it.

Diagnostic question:

```text
Was the assumed environment or data state checked before action?
```

### 6.5 Conflicting Local Evidence

Different parts of `Z` support different states, but the model picks one without acknowledging conflict.

Diagnostic question:

```text
What evidence supports each state hypothesis?
```

### 6.6 Correct Reasoning Pattern, Wrong Regime

The reasoning style is competent but applied to the wrong regime.

Diagnostic question:

```text
Is the capability wrong, or is the state that triggered it wrong?
```

### 6.7 Regression After Context Summarization

A system previously knew the state but loses it after compression, summary, memory retrieval, or session handoff.

Diagnostic question:

```text
Was state preserved as a hard object or only as narrative context?
```

---

## 7. State Governance

State governance is the set of methods for representing, discriminating, updating, branching over, and committing state information.

It has seven core operations:

```text
1. State hypothesis enumeration
2. State evidence binding
3. State discriminator construction
4. State belief maintenance
5. State-conditioned policy selection
6. State transition verification
7. State revocation and staleness management
```

### 7.1 State Hypothesis Enumeration

The system lists plausible latent states before committing to a policy.

A minimal state hypothesis entry includes:

```text
state label
description
supporting evidence
contradicting evidence
action implications
required discriminator
risk of acting under this state
```

The goal is not to enumerate every possible state. The goal is to enumerate states that would change action value.

A useful rule:

```text
Only branch over states that are action-relevant.
```

### 7.2 State Evidence Binding

Each state hypothesis should be tied to evidence. Evidence may come from:

```text
user text
retrieved documents
tool output
database contents
execution traces
timestamps
prior committed state
external measurements
human confirmation
```

Evidence must not be merely narrative. In governed systems, the source of state belief should be inspectable.

### 7.3 State Discriminator Construction

A discriminator is a test, question, query, tool call, or reasoning check that distinguishes among plausible states.

Examples:

```text
Ask user: "Do you mean lifetime revenue or number of orders?"
Query database: "What values appear in this column?"
Run test: "Does the failure reproduce in a clean environment?"
Inspect log: "Did the task already complete?"
Check config: "Which database dialect is active?"
```

A good discriminator has high expected state resolution relative to its cost.

### 7.4 State Belief Maintenance

The system should maintain state as a belief distribution or ranked hypothesis set when uncertainty remains.

A state belief may be:

```text
resolved
unresolved
ambiguous
stale
contradicted
branched
superseded
```

State governance should avoid pretending that unresolved states are resolved.

### 7.5 State-Conditioned Policy Selection

Capabilities, search methods, validators, and output forms should depend on state.

Examples:

```text
If state = implementation regression:
  inspect code diff, propose patch, run tests.

If state = obsolete test:
  inspect requirements, propose test update, flag semantic risk.

If state = ambiguous:
  ask clarification or produce conditional branches.
```

### 7.6 State Transition Verification

State updates should be verified before commitment, especially in long-horizon systems.

Example:

```text
Claim:
  "The migration has been applied."

Required observation:
  migration log shows success
  schema now contains expected column
  tests pass against new schema

Only then:
  commit state transition migration.applied = true
```

This is where state governance meets SGAR.

### 7.7 State Revocation and Staleness Management

States can become stale or invalid. A state object should have revocation triggers:

```text
new tool output contradicts it
timestamp exceeds freshness window
user supersedes prior intent
environment changes
dependency changes
audit finding invalidates assumption
```

State governance is not only about identifying state. It is about maintaining state under change.

---

## 8. Core State-Governance Objects

State mismatch should be repaired through explicit objects, not only prompt prose.

### 8.1 State Hypothesis Object

A **State Hypothesis Object** represents a possible latent state that matters for action value.

```json
{
  "id": "state_hypothesis.unique_identifier",
  "type": "state_hypothesis",
  "label": "short state name",
  "description": "what this state means",
  "condition": "when this state applies",
  "supporting_evidence": [
    "evidence item 1",
    "evidence item 2"
  ],
  "contradicting_evidence": [
    "evidence item 1"
  ],
  "action_implications": [
    "what actions become appropriate if this state holds"
  ],
  "risk_if_wrong": "what goes wrong if the system acts under this state incorrectly",
  "discriminator": "question, query, test, or tool call that can distinguish this state",
  "status": "candidate | active | rejected | unresolved | superseded",
  "confidence": "low | medium | high",
  "revocation_trigger": "condition under which this state should be weakened or removed"
}
```

### 8.2 State Belief Record

A **State Belief Record** stores the system's current belief over a state family.

```json
{
  "id": "state_belief.unique_identifier",
  "type": "state_belief_record",
  "state_family": "intent | environment | phase | data | dependency | verifier | regime",
  "hypotheses": [
    {
      "state_id": "state_hypothesis.id",
      "belief": "low | medium | high | numeric optional"
    }
  ],
  "resolved_state": "state_hypothesis.id or null",
  "resolution_status": "resolved | unresolved | ambiguous | stale | contradicted | branched",
  "evidence_summary": "why the belief record has this status",
  "next_discriminator": "recommended next observation if unresolved",
  "last_updated": "timestamp or transition id",
  "freshness_policy": "when this belief must be rechecked"
}
```

### 8.3 State Discriminator

A **State Discriminator** is an operation that can reduce state uncertainty.

```json
{
  "id": "state_discriminator.unique_identifier",
  "type": "state_discriminator",
  "target_state_family": "which state family it discriminates",
  "operation": "ask_user | query_database | run_test | inspect_file | retrieve_log | tool_call | reasoning_check",
  "input": "what the discriminator needs",
  "expected_observations": [
    {
      "observation": "possible result",
      "state_update": "how the result changes belief"
    }
  ],
  "cost": "low | medium | high",
  "risk": "low | medium | high",
  "authority": "human | tool | verifier | model | mixed",
  "commitment_rule": "when the discriminator result is strong enough to update state"
}
```

### 8.4 State-Conditioned Policy

A **State-Conditioned Policy** maps states to actions, tools, capabilities, evaluators, or output forms.

```json
{
  "id": "state_policy.unique_identifier",
  "type": "state_conditioned_policy",
  "state_family": "intent | environment | phase | data | dependency | verifier | regime",
  "policy_map": [
    {
      "state": "state_hypothesis.id",
      "capability_routing": ["capability or role to activate"],
      "search_strategy": "candidate generation or control-space search method",
      "verifier": "state-appropriate verifier",
      "output_form": "direct answer | conditional branches | ask clarification | defer | tool-first"
    }
  ],
  "default_policy": "what to do when state remains unresolved",
  "risk_control": "how to avoid high-cost wrong-state action"
}
```

### 8.5 State Transition Guard

A **State Transition Guard** defines what evidence is required before state can be committed.

```json
{
  "id": "state_transition_guard.unique_identifier",
  "type": "state_transition_guard",
  "from_state": "state before transition",
  "to_state": "state after transition",
  "proposed_action": "action that would cause transition",
  "required_observation": "what must be observed",
  "verifier": "who or what validates the observation",
  "commit_rule": "condition for committing S'",
  "rollback_rule": "condition for reverting or marking transition invalid"
}
```

---

## 9. Diagnostic Workflow

A practical diagnostic workflow for state mismatch:

```text
1. Identify the candidate action or output.
2. Ask: under what latent state would this be correct?
3. Enumerate plausible alternative states.
4. Check whether action ranking changes across states.
5. Identify evidence currently supporting each state.
6. Identify evidence that would discriminate states.
7. Acquire evidence if cost-justified.
8. If unresolved, branch or produce conditional output.
9. Route capabilities and verifiers by state.
10. Commit state only through a transition guard.
11. Store state findings, control deltas, and regression guards.
```

### 9.1 The State-Sensitivity Test

The most important test is:

```text
Would the recommended action differ if a plausible alternative state were true?
```

If no, state uncertainty may not matter.

If yes, the system should not silently collapse state.

### 9.2 The Evidence Sufficiency Test

Ask:

```text
What evidence licenses the current state assumption?
```

If the answer is merely "the model inferred it from context," the state may be under-governed.

### 9.3 The Discriminator Availability Test

Ask:

```text
Is there a low-cost observation that would distinguish the states?
```

If yes, acquire it before high-stakes action.

If no, branch or explicitly condition the answer.

### 9.4 The Commitment Test

Ask:

```text
Has the state been committed by an authorized verifier or merely narrated by the model?
```

This connects state governance to SGAR.

---

## 10. Audit Engineering for State Mismatch

An audit finding for state mismatch should identify not only that the output is wrong, but which state assumption caused the wrong action.

### 10.1 State Mismatch Audit Finding

```json
{
  "id": "finding.state_mismatch.unique_identifier",
  "artifact": "output, plan, query, patch, action, or decision being audited",
  "finding": "The artifact assumes state h1, but h1 is unsupported, stale, contradicted, or not uniquely identified.",
  "evidence": [
    "specific evidence showing ambiguity or contradiction"
  ],
  "mismatch_type": "state",
  "state_family": "intent | phase | environment | data | dependency | verifier | regime",
  "assumed_state": "state implicitly or explicitly used by the system",
  "plausible_alternative_states": [
    "state h2",
    "state h3"
  ],
  "policy_sensitivity": "how the correct action changes across states",
  "severity": "low | medium | high | critical",
  "repair_target": "state hypothesis | state discriminator | state-conditioned policy | transition guard | state record",
  "control_delta": "specific update to state governance objects",
  "regression_guard": "test that fails if the system again collapses this state ambiguity",
  "confidence": "low | medium | high"
}
```

### 10.2 State Control Deltas

Common control deltas include:

```text
add_state_hypothesis
reject_state_hypothesis
mark_state_unresolved
add_state_discriminator
add_state_conditioned_policy
add_state_transition_guard
update_phase_state
invalidate_stale_state
require_reobservation
add_clarification_rule
branch_output_by_state
route_verifier_by_state
```

### 10.3 State Regression Guards

A regression guard for state mismatch should detect recurrence of premature state collapse.

Examples:

```text
Ambiguous intent guard:
  If input contains metric term with multiple domain meanings,
  system must either disambiguate, use domain-defined metric, or state assumption.

Stale state guard:
  If last observation exceeds freshness window before irreversible action,
  system must re-observe.

Phase guard:
  If task phase = diagnosis,
  system must not execute repair action before defect class is identified.

Environment guard:
  If solution depends on database dialect,
  system must identify dialect before rendering dialect-specific syntax.

Verifier guard:
  If verifier applicability depends on state,
  system must select verifier after state classification.
```

A guard has teeth only if reintroducing the representative state ambiguity causes the guard to fail.

---

## 11. Knowledge Governance for State

State objects can be GKOs when they function as reusable task-control knowledge.

### 11.1 State GKO Template

```json
{
  "id": "gko.state.unique_identifier",
  "type": "state_hypothesis | state_rule | state_discriminator | state_conditioned_policy",
  "condition": "when this state object applies",
  "assertion": "what state assumption, distinction, or policy mapping it asserts",
  "strength": "hard | soft | heuristic | provisional",
  "priority": "conflict-resolution priority",
  "evidence": "observations, tool outputs, prior decisions, user confirmations, or audits",
  "source": "where this state object came from",
  "lifespan": "single-turn | session | project | persistent",
  "freshness_policy": "when it must be rechecked",
  "revocation_trigger": "what invalidates it",
  "not_supported_claims": "what this state object does not license"
}
```

### 11.2 Examples of State GKOs

#### Metric Meaning State

```json
{
  "id": "gko.state.metric_activity_meaning",
  "type": "state_rule",
  "condition": "When a user asks for 'most active customers' in the sales database context",
  "assertion": "Do not assume activity means order count; candidate meanings include order count, revenue, recent orders, login count, and domain engagement score.",
  "strength": "soft",
  "evidence": "Prior audit found wrong SQL caused by assuming activity = order count.",
  "lifespan": "project",
  "revocation_trigger": "Domain owner defines activity metric explicitly.",
  "not_supported_claims": "Does not determine the metric without database or user evidence."
}
```

#### Phase State

```json
{
  "id": "gko.state.phase_diagnosis_before_patch",
  "type": "state_conditioned_policy",
  "condition": "When a test failure has not yet been classified",
  "assertion": "Remain in diagnosis phase; do not commit implementation patch until failure class is identified.",
  "strength": "hard",
  "evidence": "Patch-first behavior caused prior regression when test fixture was invalid.",
  "lifespan": "project",
  "revocation_trigger": "User explicitly requests speculative patch or verifier confirms implementation regression.",
  "not_supported_claims": "Does not prohibit proposing hypotheses or low-risk inspection."
}
```

#### Environment State

```json
{
  "id": "gko.state.database_dialect_required",
  "type": "state_discriminator",
  "condition": "When rendering SQL with dialect-specific syntax",
  "assertion": "Identify database dialect before using functions, date arithmetic, quoting, or limit syntax.",
  "strength": "hard",
  "evidence": "Dialect mismatch caused invalid query in prior execution audit.",
  "lifespan": "persistent",
  "revocation_trigger": "System configuration fixes dialect for the entire deployment.",
  "not_supported_claims": "Does not guarantee semantic correctness of query."
}
```

---

## 12. Integration with SGAR

State mismatch and SGAR are closely related but not identical.

### 12.1 Belief State vs Committed State

State governance maintains **belief state**:

```text
What does the system currently believe about the latent task state?
```

SGAR maintains **committed hard state**:

```text
What facts, actions, transitions, and completions are authoritative?
```

A belief can be tentative. A committed state must satisfy a transition contract.

Example:

```text
Belief:
  The test failure is probably caused by dependency drift.

Committed state:
  dependency_drift_confirmed = true
```

The second should require evidence.

### 12.2 State Transition Contract

For state commitments:

```text
S + A → O → V → S'
```

Example:

```text
S:
  phase = diagnosis
  failure_cause = unresolved

A:
  run dependency version check

O:
  lockfile shows package upgraded from v1 to v2;
  failure disappears when pinned to v1

V:
  tool output and reproducing test confirm causal dependency

S':
  failure_cause = dependency_drift
  phase = repair_planning
```

The LLM may propose `S'`, but the transition is committed only if `V` accepts `O`.

### 12.3 Preventing Narrative State Drift

Without SGAR, state can drift through conversation:

```text
"Assuming the migration worked..."
"Now that the issue is fixed..."
"Since we established the user wants X..."
```

Each phrase can silently promote a hypothesis into a fact. SGAR prevents this by requiring state transitions to reference evidence and verifiers.

### 12.4 State Summary Is Not State Authority

A context summary may contain:

```text
"The user wants revenue-based activity."
```

But unless that claim is linked to a committed state record or user confirmation, it may be only narrative.

Rule:

```text
A state claim in context is not authoritative unless it resolves to a state record with evidence and status.
```

---

## 13. State Mismatch in Text-to-SQL

Text-to-SQL is a strong example of state mismatch because the same natural-language question can map to different SQL depending on latent state.

### 13.1 Intent State

Question:

```text
"Which products are most popular?"
```

Possible states:

```text
popularity = number of orders
popularity = total quantity sold
popularity = revenue
popularity = number of distinct customers
popularity = recent trend
popularity = rating / review count
```

Direct SQL generation often collapses this state silently.

State governance response:

```text
1. Enumerate metric states.
2. Check schema for domain-defined popularity column.
3. Inspect sample values or metadata.
4. If benchmark context implies one metric, record that assumption.
5. If unresolved, branch or ask clarification.
```

### 13.2 Data State

Question:

```text
"Find users who have not made any purchases."
```

Possible data states:

```text
purchase table records all purchases
purchase status column distinguishes completed vs canceled
user table includes inactive users
foreign keys are complete
null user_id values exist
```

The correct SQL depends on data-state assumptions. A query using `NOT IN` may fail if nulls are present. A left join may include inactive accounts if state is not governed.

State governance response:

```text
profile nulls
inspect status values
check user activity column
select anti-join pattern by data state
```

### 13.3 Environment State

SQL syntax depends on database dialect.

Possible states:

```text
SQLite
PostgreSQL
MySQL
SQL Server
DuckDB
Oracle
```

A date arithmetic expression valid in one dialect may fail in another.

State governance response:

```text
dialect must be identified before dialect-specific rendering
```

### 13.4 Verifier State

Execution accuracy may not equal semantic correctness.

Possible verifier states:

```text
exact result comparison available
execution-only feedback available
semantic equivalence required
hidden tests unavailable
manual review required
```

The repair policy changes by verifier state.

---

## 14. State Mismatch in Code and Debugging

Code tasks are state-sensitive.

### 14.1 Failure-Cause State

A failing test may indicate:

```text
implementation bug
test bug
fixture bug
environment bug
dependency drift
nondeterminism
flaky external service
changed requirement
```

Patch-first behavior is dangerous because the same local trace can support multiple causes.

State governance response:

```text
failure-cause hypothesis set
minimal reproduction
environment check
dependency check
requirement check
test validity audit
state-conditioned repair
```

### 14.2 Repository State

The system may assume a file, function, API, or test exists in a certain form. But the repo state may differ.

State governance response:

```text
read before edit
check current file contents
confirm branch / commit state
track modifications as hard-state transitions
```

### 14.3 Phase State

A debugging workflow has phases:

```text
observe failure
classify failure
localize cause
propose patch
apply patch
run verifier
commit fix
write regression guard
```

If the model jumps from observe failure to patch without classification, it risks state mismatch.

---

## 15. State Mismatch in Research, Strategy, and Advisory Work

Open-ended advisory tasks often contain hidden evaluation states.

### 15.1 Evaluation State

A user may ask:

```text
"Is this good?"
```

But "good" may mean:

```text
conceptually original
empirically credible
publishable
investor-persuasive
implementation-ready
defensible under peer review
useful for internal decision-making
```

The critique must be state-conditioned.

State governance response:

```text
evaluation-state matrix
audience-state identification
explicit assumption
branch by evaluation state
```

### 15.2 Decision State

A user may be:

```text
exploring options
seeking a recommendation
trying to justify a prior decision
looking for risks
preparing for an adversarial review
needing an execution plan
```

The same response may be helpful in one state and harmful in another.

State governance response:

```text
decision-state hypothesis
recommendation vs analysis distinction
commitment-level control
```

### 15.3 Evidence State

An argument may be evaluated under different evidence standards:

```text
intuitive plausibility
formal proof
engineering evidence
benchmark evidence
case-study evidence
expert consensus
regulatory-grade evidence
```

A mismatch in evidence state produces wrong confidence and wrong critique.

---

## 16. Compound Interactions with Other Mismatches

State mismatch often compounds with the other primitive mismatches.

### 16.1 State × Observation-Representation

If the variables needed to distinguish states never enter `Z`, state repair is impossible without channel repair.

Example:

```text
The system must distinguish active users from inactive users,
but the active flag or last-login column is not included.
```

Repair coupling:

```text
R_state is gated by c_obs
```

### 16.2 State × Fitting-Boundary

Wrong state beliefs trigger wrong capabilities.

Example:

```text
The system treats a task as final drafting when it is actually adversarial review,
so it activates polishing instead of critique.
```

Repair coupling:

```text
R_route depends on state discrimination.
```

### 16.3 State × Support

The correct candidate family may have low support under the wrong state.

Example:

```text
If the system assumes "popular" means count,
revenue-based query structures are not searched.
```

Repair coupling:

```text
R_support depends on preserving alternative state-conditioned candidate spaces.
```

### 16.4 State × Aggregation

Local components may compose correctly under one state and incorrectly under another.

Example:

```text
A plan is coherent for exploration phase but incoherent for execution phase.
```

Repair coupling:

```text
R_agg must enforce state-specific composition rules.
```

### 16.5 State × Specification

The correct objective may be state-conditioned.

Example:

```text
A legal memo and a business memo have different success criteria.
```

Repair coupling:

```text
R_spec depends on identifying the evaluation state.
```

### 16.6 State × SGAR

A state hypothesis may be narrated as if committed.

Example:

```text
The model says "now that the bug is fixed" before tests pass.
```

Repair coupling:

```text
epistemic state must not become hard state without transition verification.
```

---

## 17. State-Governed Rendering

When state remains unresolved, final output should reflect that.

Possible rendering modes:

```text
direct answer
assumption-labeled answer
conditional answer
branched answer
clarifying question
tool-first response
deferred recommendation
risk-bounded action
```

### 17.1 Assumption-Labeled Answer

Use when one state is likely but not certain.

```text
Assuming "activity" means number of completed orders, the query is...
If instead you mean revenue or recent engagement, the query changes.
```

### 17.2 Branched Answer

Use when multiple states are plausible and action differs significantly.

```text
If the test encodes the intended behavior, patch the implementation as follows.
If the requirement changed, update the test instead.
Here is how to distinguish the two cases.
```

### 17.3 Clarifying Question

Use when wrong-state action is costly and low-cost clarification is available.

```text
Do you want "most active" measured by order count, revenue, or recent activity?
```

### 17.4 Tool-First Response

Use when a tool can resolve state cheaply.

```text
Before rendering SQL, inspect the schema and sample values.
Before patching, run the failing test and inspect the traceback.
```

### 17.5 Risk-Bounded Action

Use when action must proceed under uncertainty.

```text
Proceed with a reversible, low-risk step that is useful across states.
```

---

## 18. Relationship to Formal Traditions

State mismatch relates to several existing traditions, but the governed LLM setting has distinctive features.

### 18.1 POMDPs

Partially observable Markov decision processes model agents acting under hidden state. State mismatch is conceptually related: the system has observations, latent states, belief updates, and state-conditioned policies.

The difference is that LLM systems often operate in open-ended task spaces where:

```text
state space is not predefined
observations are natural language, tool outputs, documents, and context summaries
state hypotheses may be induced at inference time
utility may be tacit or evolving
state beliefs may be stored as governed objects
human clarification may be part of the policy
```

### 18.2 Active Perception and Value of Information

State governance uses active information acquisition: ask, query, inspect, measure, or run a test when the expected value of resolving state exceeds the cost.

A simple decision rule:

```text
Acquire state information if:

Expected reduction in wrong-state action loss
  >
cost of discriminator + delay + risk
```

### 18.3 Belief Revision

State hypotheses should be revised, weakened, or revoked as evidence changes. This connects to belief revision and truth-maintenance systems, but in LLM systems the beliefs are task-control objects, not merely propositions.

### 18.4 Runtime State Machines

SGAR and state transition guards resemble state machines and transaction logs. The distinct issue here is that state beliefs are often inferred through language and must be connected to hard-state authority.

---

## 19. When State Governance Is Not Needed

State governance has costs. It can produce unnecessary branching, excessive clarification, and slowed interaction.

It is usually not needed when:

```text
the task is low stakes
state ambiguity does not change action ranking
the user expects a quick default
the cost of clarification exceeds the likely benefit
a robust default action is good across states
the state is already committed by trusted hard state
```

It is warranted when:

```text
wrong-state action is costly
multiple states are plausible
the optimal action reverses across states
a cheap discriminator exists
state will be reused across future steps
state uncertainty compounds with other mismatches
the system is about to commit irreversible action
```

A practical rule:

```text
Do not ask about every uncertainty.
Ask, branch, or inspect only when state uncertainty is action-relevant.
```

---

## 20. Self-Audit of the State Mismatch Claim

The theory should govern its own claims.

### 20.1 State Mismatch as a GKO

```json
{
  "id": "gko.primitive_mismatch.state",
  "type": "primitive_mismatch_claim",
  "condition": "LLM systems modeled as value-preservation pipelines in which action value may depend on latent task state",
  "assertion": "State mismatch occurs when multiple latent states remain plausible under the representation, action value differs across those states, and the system prematurely collapses or mismanages the state.",
  "strength": "structural-relative",
  "support_scope": "Tasks where hidden regimes, user intent, environment conditions, data states, phase states, dependency states, or verifier states affect policy or evaluation",
  "revocation_trigger": "Show that state-sensitive failures can always be reduced to observation-representation, fitting-boundary, support, aggregation, or specification mismatch without losing intervention specificity.",
  "not_supported_claims": "Does not claim that all uncertainty is state mismatch; does not require exhaustive state enumeration; does not claim that systems should always ask clarifying questions."
}
```

### 20.2 Boundary Conditions

State mismatch should be downgraded when:

```text
state uncertainty exists but does not affect action value
the problem is actually missing variables rather than latent-state ambiguity
the problem is a bad objective rather than wrong state identification
the system has a complete verifier that makes state irrelevant
the user explicitly wants a default assumption and low-cost action
```

### 20.3 Revocation Trigger for a Specific State Object

Every state object should be revocable.

Example:

```json
{
  "state_object": "activity_means_order_count",
  "revocation_trigger": "User defines activity as revenue, schema contains domain metric named engagement_score, or audit finds mismatch between query result and intended metric."
}
```

---

## 21. Checklist for State Mismatch

Use this checklist before high-stakes generation, tool action, or state commitment.

```text
1. What latent state is the system assuming?
2. Is that state explicitly represented?
3. What evidence supports it?
4. What plausible alternative states remain?
5. Would the correct action differ under those alternatives?
6. Is there a cheap discriminator?
7. Should the system ask, inspect, query, test, or branch?
8. Which capabilities should activate under each state?
9. Which verifier applies under each state?
10. Is the state fresh?
11. Has the state been committed through SGAR or only narrated?
12. What revocation trigger should be attached?
```

---

## 22. Conclusion

State mismatch is a primitive value-preservation failure in LLM systems. It occurs when the system acts under an unsupported, stale, collapsed, or wrong latent-state assumption, and when the value of candidate actions differs across plausible states.

This failure is common because LLMs are powerful at producing coherent continuations from underspecified context. Coherence can hide state uncertainty. The model may infer one plausible state and proceed fluently, while the task required preserving multiple hypotheses, acquiring discriminating evidence, or conditioning actions on the unresolved state.

State governance repairs this failure by making latent state explicit. It introduces state hypotheses, evidence records, discriminators, state-conditioned policies, transition guards, freshness policies, and revocation triggers. It integrates with Knowledge Governance by storing reusable state-control objects, with Audit Engineering by converting wrong-state failures into control deltas and regression guards, and with SGAR by ensuring that state commitments require verified transitions rather than narrative confidence.

The central rule is simple:

> When action value depends on which state is true, state must be governed before action is committed.

---

## Appendix A: Minimal Pair Examples

### A.1 Observation-Representation vs State

```text
Case 1:
  The schema omits the revenue column.
  Failure: observation-representation mismatch.

Case 2:
  The schema includes revenue and order count,
  but the phrase "most active" is ambiguous between them.
  Failure: state mismatch.
```

### A.2 State vs Specification

```text
Case 1:
  The system does not know whether the memo is for legal or business review.
  Failure: state mismatch.

Case 2:
  The system knows it is for legal review,
  but the rubric rewards brevity over legal caveats.
  Failure: specification mismatch.
```

### A.3 State vs Fitting-Boundary

```text
Case 1:
  The system misidentifies the task as polishing rather than adversarial review.
  Failure: state mismatch.

Case 2:
  The system knows it is adversarial review,
  but still activates polishing behavior.
  Failure: fitting-boundary mismatch.
```

### A.4 State vs Support

```text
Case 1:
  The system does not know whether a nested query is needed because it misreads the question state.
  Failure: state mismatch.

Case 2:
  The system knows a nested query is needed but never generates one.
  Failure: support mismatch.
```

### A.5 State vs Aggregation

```text
Case 1:
  The plan is for the wrong project phase.
  Failure: state mismatch.

Case 2:
  The plan is for the right phase, but the steps conflict.
  Failure: aggregation mismatch.
```

---

## Appendix B: State Governance Object Catalogue

```text
State Hypothesis Object
  Represents one plausible latent state.

State Belief Record
  Represents current belief over a state family.

State Discriminator
  Represents an operation that can distinguish states.

State-Conditioned Policy
  Maps states to routing, search, verifier, and output strategy.

State Transition Guard
  Defines conditions for committing a state transition.

State Freshness Policy
  Defines when a state must be rechecked.

State Revocation Rule
  Defines when a state object should be weakened or removed.

State Regression Guard
  Detects recurrence of premature state collapse.

State Ledger Entry
  Records state changes, evidence, verifier, and transition id.
```

---

## Appendix C: State Control Delta Types

```text
add_state_hypothesis
remove_state_hypothesis
mark_state_unresolved
mark_state_resolved
mark_state_stale
mark_state_contradicted
add_state_discriminator
update_state_belief
add_state_conditioned_policy
update_capability_routing_by_state
update_verifier_by_state
require_clarification
require_tool_observation
branch_output
add_state_transition_guard
commit_state_transition
rollback_state_transition
add_state_regression_guard
```

---

## Appendix D: Compact Definition

```text
State mismatch occurs when:

1. Multiple latent task states remain plausible under the system representation;
2. candidate actions have different value rankings across those states; and
3. the system prematurely collapses, ignores, misupdates, or miscommits the state.

Repair requires:

state hypotheses
state evidence
state discriminators
state-conditioned policies
state freshness
state revocation
hard-state commitment when appropriate
```
