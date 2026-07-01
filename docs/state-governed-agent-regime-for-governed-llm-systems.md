# State-Governed Agent Regime for Governed LLM Systems

**Hard-State Authority, Transition Contracts, and Runtime Governance**  
**Working Draft v0.1**  

---

## Contents

This is a long working paper. The early sections (Abstract through Section 5) motivate the core idea and state the central rule; Sections 6–9 define the state model and transition machinery; Sections 10–13 connect SGAR to the runtime loop, Knowledge Governance, and Audit Engineering; Sections 14–21 cover the failure modes SGAR prevents and the operational disciplines it relies on; Sections 22–24 work through concrete domains; and Sections 25–35 cover the remaining cross-cutting concerns, theory, and conclusion. Two appendices give a compact glossary and a checklist.

A short reader's note on terminology used throughout: a **GKO** is a Governed Knowledge Object (a piece of control knowledge stored as a governed object), and a **GEO** is a Governed Escalation Object (a governed record of an escalation). Both are defined again at first substantive use below.

- [Abstract](#abstract)
- [1. Position in the Unified Theory](#1-position-in-the-unified-theory)
- [2. The Runtime Problem: Context Is Not State](#2-the-runtime-problem-context-is-not-state)
- [3. State-Governed Agent Regime](#3-state-governed-agent-regime)
- [4. State Authority and State Surfaces](#4-state-authority-and-state-surfaces)
- [5. The Context Demotion Rule](#5-the-context-demotion-rule)
- [6. State Model](#6-state-model)
- [7. Transition Contracts](#7-transition-contracts)
- [8. Verifier Stratification](#8-verifier-stratification)
- [9. State Transition Types](#9-state-transition-types)
- [10. Runtime Loop](#10-runtime-loop)
- [11. SGAR and the Six Primitive Mismatches](#11-sgar-and-the-six-primitive-mismatches)
- [12. SGAR and Knowledge Governance](#12-sgar-and-knowledge-governance)
- [13. SGAR and Audit Engineering](#13-sgar-and-audit-engineering)
- [14. Failure Modes Prevented by SGAR](#14-failure-modes-prevented-by-sgar)
- [15. Authority Separation](#15-authority-separation)
- [16. Idempotence, Replay, and Rollback](#16-idempotence-replay-and-rollback)
- [17. State Invariants](#17-state-invariants)
- [18. Completion as a Governed Transition](#18-completion-as-a-governed-transition)
- [19. Memory Writes as Governed Transitions](#19-memory-writes-as-governed-transitions)
- [20. Human Approval and Collaboration State](#20-human-approval-and-collaboration-state)
- [21. SGAR for Multi-Agent Systems](#21-sgar-for-multi-agent-systems)
- [22. SGAR for Text-to-SQL](#22-sgar-for-text-to-sql)
- [23. SGAR for Code Agents](#23-sgar-for-code-agents)
- [24. SGAR for Research Agents](#24-sgar-for-research-agents)
- [25. SGAR and Tool Use](#25-sgar-and-tool-use)
- [26. State Compression and Context Rendering](#26-state-compression-and-context-rendering)
- [27. Non-Monotonic State and Revocation](#27-non-monotonic-state-and-revocation)
- [28. SGAR Decision Rules](#28-sgar-decision-rules)
- [29. Minimal SGAR Implementation](#29-minimal-sgar-implementation)
- [30. Theoretical Propositions](#30-theoretical-propositions)
- [31. Relationship to Formal Traditions](#31-relationship-to-formal-traditions)
- [32. Risks and Failure Modes of SGAR Itself](#32-risks-and-failure-modes-of-sgar-itself)
- [33. Design Principles](#33-design-principles)
- [34. Standard Schemas](#34-standard-schemas)
- [35. Conclusion](#35-conclusion)
- [Appendix A: Compact Glossary](#appendix-a-compact-glossary)
- [Appendix B: Minimal Checklist](#appendix-b-minimal-checklist)

---

## Abstract

Large language model (LLM) agents are often described as systems that plan, remember, act, observe, revise, and complete tasks over time. In practice, many such systems rely on the language-model context window as the apparent carrier of progress. The context says that a file was changed, a test was run, a bug was fixed, a user preference was remembered, a task was completed, or a plan step was executed.

But a language context can describe progress without authorizing it. It can summarize state without being state. It can claim completion without committing a verified transition.

This paper introduces **State-Governed Agent Regime** (SGAR), a runtime regime for governed LLM systems. In SGAR, progress is defined not by what the model says has happened, but by committed transitions in external, inspectable, replayable hard state.

SGAR treats the context window as a narrative workspace and proposal surface, not as the source of state authority. An agent action changes the authoritative system state only when it passes an explicit transition contract:

```text
S + A → O → V → S'
```

where `S` is the current committed state, `A` is a proposed action, `O` is the observed outcome, `V` is the verifier or commitment rule, and `S'` is the next committed state.

SGAR is not a new prompting pattern and not a seventh primitive mismatch. It is the runtime layer of the unified theory of value preservation in LLM systems.

The six primitive mismatches diagnose where value is lost in the world-to-output pipeline. Knowledge Governance externalizes control knowledge as governed objects. Audit Engineering turns failures into control deltas and regression guards. SGAR decides which observations, repairs, object updates, tool effects, memory writes, and task completions are actually admitted into hard state.

The central thesis is simple: long-horizon LLM systems require state authority outside the model. Without hard-state authority, agents are vulnerable to false completion, state drift, state oscillation, memory contamination, performative action, unrecoverable intermediate failure, and context-level progress illusion.

With explicit state records, transition contracts, verifier stratification, rollback rules, replayability, and defect ledgers, an LLM system can convert local model competence into durable, auditable, recoverable progress.

### Relationship to the Diagnostic–Mechanism Bridge

This document uses the six primitive mismatches as value-preservation diagnostics. When a failure requires repair, the Diagnostic–Mechanism Bridge should be used to map the diagnosis to an eight-axis mechanism target and a repair layer:

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

---

## 1. Position in the Unified Theory

The unified theory of governed LLM systems has three major levels:

```text
Diagnostic level:
  Six primitive mismatches explain where task value is lost.

Control-knowledge level:
  Knowledge Governance stores and revises task-specific control knowledge.

Runtime level:
  SGAR determines which proposed actions, observations, and revisions become committed system state.
```

The first level explains failure. The second level provides governed control objects. The third level gives those objects and failures a runtime authority structure.

The relationship can be summarized as:

```text
Six primitive mismatches diagnose value-preservation failure.
Knowledge Governance stores task-specific control knowledge.
Audit Engineering converts failure into control deltas.
SGAR commits verified progress into hard state.
```

SGAR therefore answers a question not answered by ordinary prompting, retrieval, tool use, or self-reflection:

> When an LLM system says that something has changed, what makes that change real for the system?

The answer cannot be: because the current context says so. The context is a language artifact. It is useful for proposing, explaining, compressing, and planning. But it is not sufficient as a state authority.

SGAR introduces an explicit division:

```text
Context = narrative workspace.
Hard state = authority surface.
Verifier = admission rule.
Transition contract = state-change protocol.
```

This division is the foundation of long-horizon reliability.

---

## 2. The Runtime Problem: Context Is Not State

LLM agents often appear to maintain state because the context window contains a running story of what has happened. The model may write:

```text
I have updated the file.
The test now passes.
The user's preference has been saved.
The issue is resolved.
The plan step is complete.
The system has learned this rule.
```

But these statements are only claims unless they are grounded in an external state record or verified observation. A language model can generate a coherent narrative of progress without corresponding changes in the environment.

This creates a class of failures that are not adequately described as hallucination. They are **state-authority failures**. The system confuses a statement about state with state itself.

Examples:

```text
The model says a file was modified, but the filesystem did not change.
The model says tests passed, but no test command was run.
The model says an error was fixed, but the same defect remains.
The model says a user preference was remembered, but no durable memory was updated.
The model says a plan step is complete, but no verifiable artifact exists.
The model says a GKO was revised, but the authoritative object store still contains the old rule.
```

The key principle is:

```text
A statement of progress is not progress.
A summary of state is not state.
A plan to act is not action.
A claim of verification is not verification.
```

A governed LLM system must make these distinctions explicit.

---

## 3. State-Governed Agent Regime

A **State-Governed Agent Regime** is a runtime architecture in which agent progress is defined by committed transitions over an external state model.

The minimal transition form is:

```text
S_t + A_t → O_t → V_t → S_{t+1}
```

where:

| Symbol | Meaning |
|---|---|
| `S_t` | Current committed hard state. |
| `A_t` | Proposed action or state-changing operation. |
| `O_t` | Observed outcome of the action. |
| `V_t` | Verifier, admission criterion, or commitment rule. |
| `S_{t+1}` | Next committed hard state. |

The transition is valid only if:

```text
V_t(S_t, A_t, O_t, S_candidate) = accept
```

Then and only then may the system commit:

```text
S_{t+1} := S_candidate
```

If verification fails, the system does not update hard state. It may instead create an audit finding, request more observation, roll back, retry, branch, escalate, or mark the state as blocked.

The core SGAR rule is:

```text
Only verified transitions update authoritative state.
```

The model may propose `A_t`. It may help interpret `O_t`. It may suggest `S_candidate`. It may explain `V_t`. But unless the transition contract is satisfied, the system state does not change.

---

## 4. State Authority and State Surfaces

A governed system distinguishes multiple state surfaces.

### 4.1 Claimed State

Claimed state is what the model or user says is true.

```text
"The bug is fixed."
"The file has been updated."
"The task is complete."
```

Claimed state is useful as a proposal but has no authority by itself.

### 4.2 Context State

Context state is what appears in the current prompt, conversation history, scratchpad, or model-visible narrative.

It may include summaries, previous claims, plans, partial observations, decisions, or generated memory. Context state is volatile and can be incomplete, stale, inconsistent, or fabricated.

### 4.3 Observed State

Observed state is obtained through tools, environment queries, file reads, test outputs, database queries, user confirmations, logs, or external APIs.

Observed state has higher authority than context, but it may still be partial, noisy, stale, or misinterpreted.

### 4.4 Verified State

Verified state is observed state that has passed a verifier or commitment rule.

For example:

```text
A file modification is verified by reading the file after writing.
A code repair is verified by tests or static checks.
A SQL candidate is verified by execution and semantic audit.
A memory update is verified by reading the durable memory store.
A task completion is verified by satisfying declared completion criteria.
```

### 4.5 Committed State

Committed state is the authoritative system state after a valid transition. It is the state used for future planning, routing, rendering, audit, recovery, and reporting.

The hierarchy is:

```text
claimed state < context state < observed state < verified state < committed state
```

A robust agent must not collapse this hierarchy.

---

## 5. The Context Demotion Rule

The most important operational rule in SGAR is the **context demotion rule**:

```text
Context may propose, summarize, or explain state, but it may not authorize state.
```

The context window is demoted from authority to workspace. It remains useful, but its role changes.

Allowed uses of context:

```text
proposing actions
summarizing observations
holding temporary hypotheses
constructing plans
explaining candidate transitions
drafting control deltas
suggesting verification steps
```

Disallowed uses of context:

```text
authorizing task completion
asserting tool effects without observation
committing memory updates without durable write
marking tests passed without test evidence
claiming file edits without file verification
accepting GKO revisions without object-store update
```

This rule prevents a large fraction of agentic failure. The model may still reason over context, but the system no longer confuses context fluency with operational truth.

---

## 6. State Model

A state-governed agent requires an explicit state model. The state model need not be heavy, but it must identify what kinds of facts the system treats as authoritative.

A minimal state record is:

```json
{
  "state_id": "state.project.task.001",
  "version": 17,
  "status": "active | blocked | complete | reverted | superseded",
  "task_state": {},
  "artifact_state": {},
  "environment_state": {},
  "memory_state": {},
  "governance_state": {},
  "execution_state": {},
  "collaboration_state": {},
  "open_issues": [],
  "invariants": [],
  "last_transition_id": "transition.016",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

The fields are conceptual rather than mandatory. Different systems may implement them differently.

### 6.1 Task State

Task state records the current status of the user's task:

```text
goal
scope
accepted constraints
completion criteria
current phase
blocked conditions
known uncertainties
```

### 6.2 Artifact State

Artifact state records the status of objects being created or modified:

```text
files
documents
code modules
SQL candidates
reports
slides
models
data tables
analysis artifacts
```

### 6.3 Environment State

Environment state records relevant external conditions:

```text
filesystem state
tool availability
API responses
database schema
runtime dependencies
calendar facts
repository branch
execution logs
```

### 6.4 Memory State

Memory state records durable user, project, or system memory:

```text
user preferences
project decisions
accepted terminology
reusable constraints
long-term context
revoked assumptions
```

### 6.5 Governance State

Governance state records governed objects. Two acronyms appear here and recur throughout the paper: a GKO is a Governed Knowledge Object (control knowledge stored as a governed object), and a GEO is a Governed Escalation Object (a governed record of an escalation). The governed objects tracked in this surface are:

```text
GKOs
GEOs
Audit Findings
Control Deltas
Regression Guards
Defect Ledgers
Revocation Rules
Verifier definitions
```

### 6.6 Execution State

Execution state records currently running or recently completed operations:

```text
queued actions
running actions
completed actions
failed actions
retry policies
rollback handles
idempotency keys
```

### 6.7 Collaboration State

Collaboration state records human and multi-agent coordination:

```text
assigned roles
pending approvals
user decisions
handoff records
escalations
accepted / rejected proposals
```

The purpose of this state model is not bureaucratic completeness. It is to prevent hidden progress assumptions from living only in context.

---

## 7. Transition Contracts

A transition contract defines when an attempted state change is valid.

A minimal transition record is:

```json
{
  "transition_id": "transition.unique_identifier",
  "from_state_id": "state.before",
  "action": {
    "type": "tool_call | file_write | memory_update | gko_update | audit_commit | task_completion | rollback | escalation",
    "parameters": {}
  },
  "observation": {
    "type": "tool_result | file_readback | test_output | human_confirmation | database_result | verifier_report",
    "evidence": []
  },
  "verifier": {
    "id": "verifier.unique_identifier",
    "rule": "acceptance criterion",
    "authority_level": "mechanical | external | human | governed_llm | heuristic"
  },
  "candidate_state_delta": {},
  "decision": "accept | reject | defer | escalate | rollback",
  "to_state_id": "state.after_if_accepted",
  "commit_record": {
    "committed_by": "system component or authority",
    "committed_at": "timestamp",
    "replay_handle": "how to reproduce or inspect the transition"
  }
}
```

A transition contract should answer five questions:

```text
1. What state is being changed?
2. What action claims to change it?
3. What observation resulted from the action?
4. What verifier decides whether the observation is sufficient?
5. What state delta is committed if the verifier accepts?
```

If any of these are missing, the transition is under-specified.

---

## 8. Verifier Stratification

Not all verifiers have equal authority. SGAR requires explicit verifier stratification.

A typical authority hierarchy is:

```text
mechanical verifier
  > external environment observation
  > durable object-store readback
  > human domain approval
  > governed LLM judge with evidence
  > raw model assertion
```

This hierarchy is task-dependent, but the general rule is:

```text
The verifier with the highest relevant authority should dominate lower-authority claims.
```

Examples:

```text
A test failure overrides a model's claim that code is fixed.
A database execution error overrides a model's claim that SQL is valid.
A file readback overrides a model's claim that a file was written.
A user's explicit rejection overrides a model's inferred preference.
A regression guard failure overrides a model's claim that a defect is resolved.
```

LLMs can serve as verifiers only under constrained conditions. A governed LLM verifier should have:

```text
explicit rubric
visible evidence
known authority limits
calibration or cross-checking
revocation conditions
separation from the generator when possible
```

The default rule is:

```text
LLM judgment may assist verification, but should not outrank mechanical or environmental evidence.
```

---

## 9. State Transition Types

SGAR supports several transition types.

### 9.1 Observation Transition

An observation transition updates the state with newly observed evidence.

```text
S + observe(environment) → O → verify_observation → S'
```

Example:

```text
Read a file, query a database, inspect logs, fetch test output.
```

### 9.2 Artifact Transition

An artifact transition changes a durable artifact.

```text
S + modify(artifact) → O → verify_readback_or_test → S'
```

Example:

```text
Write a document, patch code, update a SQL candidate, revise a slide deck.
```

### 9.3 Governance Transition

A governance transition changes a governed object.

```text
S + update(GKO) → O → verify_object_store → S'
```

Example:

```text
Add a routing rule, revise a rubric, revoke a constraint, commit an audit finding.
```

### 9.4 Verification Transition

A verification transition records the outcome of a verifier.

```text
S + run(verifier) → O → commit_result → S'
```

Example:

```text
Run tests, execute SQL, perform schema check, validate constraints.
```

### 9.5 Completion Transition

A completion transition marks a task or subtask complete.

```text
S + propose_completion → O → verify_completion_criteria → S'
```

Completion should be treated as a high-risk transition because false completion is one of the most common LLM-agent failures.

### 9.6 Rollback Transition

A rollback transition reverses or supersedes a previously committed state.

```text
S + rollback(transition_id) → O → verify_reversion → S'
```

Rollback is essential when a transition was valid under earlier evidence but later found harmful or incorrect.

### 9.7 Revocation Transition

A revocation transition weakens or removes a governed object.

```text
S + revoke(object_id) → O → verify_revocation_rule → S'
```

This is the runtime counterpart of GKO revocation. Knowledge governance without revocation becomes brittle accumulation.

### 9.8 Escalation Transition

An escalation transition records that the system cannot safely proceed under current authority.

```text
S + escalate(reason) → O → verify_escalation_condition → S'
```

Escalation is not failure. It is a controlled state transition from autonomous execution to higher authority.

---

## 10. Runtime Loop

A minimal SGAR runtime loop is:

```text
while not terminal(S):
    read committed state S
    construct context from S and relevant observations
    propose action A
    execute or simulate A according to authority rules
    observe outcome O
    apply verifier V
    if V accepts:
        commit S'
    else:
        create audit finding or blocked state
        decide retry / rollback / revise / escalate
```

In pseudocode:

```python
def state_governed_step(S):
    context = render_context_from_state(S)
    A = propose_action(context)

    O = execute_or_observe(A)
    candidate_delta = derive_state_delta(S, A, O)

    decision = verify_transition(S, A, O, candidate_delta)

    if decision.accept:
        S_next = commit(S, candidate_delta, decision)
        return S_next

    finding = create_audit_finding(S, A, O, decision)
    S_blocked = commit_blocked_or_repair_state(S, finding)
    return S_blocked
```

The crucial detail is that context is rendered from state, not the other way around. The model does not own the state. It receives a projection of state and proposes transitions.

### SGAR as Governed Mechanism-Layer Transition

The Formal Mechanism Layer models an LLM system as an approximate decision system with observation, belief, world model, action interface, policy support, routing, and search/execution components.

SGAR operationalizes one governed step in that mechanism-layer system:

```text
S + A → O → V → S'
```

This can be read as:

| SGAR term | Mechanism-layer interpretation |
|---|---|
| `S` | committed state record, including task state, governance state, tool state, and belief state |
| `A` | action selected from the effective action interface `A_sys` |
| `O` | observation produced by the observation channel after action |
| `V` | verifier, evaluator, transition guard, or commitment criterion |
| `S'` | next committed hard state |

The eight mechanism axes describe common ways this transition can fail:

| Mechanism axis | SGAR failure form |
|---|---|
| `specification_reward` | the verifier commits progress under the wrong criterion |
| `observation_availability` | the needed post-action observation is unavailable |
| `belief_representation` | the observation is not converted into correct state |
| `dynamics_world_model` | the system predicts the action consequence incorrectly |
| `action_interface` | the required action is not actually callable |
| `capability_support` | the system cannot produce the needed action candidate |
| `capability_routing` | the wrong capability or mode is activated |
| `search_execution` | the system fails to complete, preserve, or verify the transition |

World-model and action-interface failures are especially important for SGAR. A model may narrate a successful action while the environment does not change, or it may propose a repair that is not available in the actual action interface. SGAR prevents such narrative progress from becoming committed progress.

---

## 11. SGAR and the Six Primitive Mismatches

SGAR is not a seventh primitive mismatch. It is a runtime regime that prevents several primitive mismatches from becoming uncontrolled over time.

### 11.1 Observation-Representation

SGAR forces observation claims to be tied to observation records. If a decisive variable is missing, the state can represent this as an unresolved observation requirement rather than allowing the model to proceed as if the variable were known.

State representation:

```json
{
  "missing_observations": [
    "database sample values for column X",
    "test output after patch Y",
    "user confirmation of constraint Z"
  ]
}
```

### 11.2 State Mismatch

SGAR maintains explicit state hypotheses and prevents a single latent-state assumption from silently becoming committed fact.

```json
{
  "state_hypotheses": [
    {"id": "h1", "claim": "user wants concise summary", "status": "unverified"},
    {"id": "h2", "claim": "user wants formal paper draft", "status": "supported"}
  ]
}
```

### 11.3 Fitting-Boundary Mismatch

SGAR stores routing rules and their activation history. If a capability was over-triggered or under-triggered, the correction can be committed as a router update.

```json
{
  "routing_updates": [
    {
      "capability": "direct_sql_generation",
      "change": "suppress until schema subgraph and join path are verified"
    }
  ]
}
```

### 11.4 Support Mismatch

SGAR can record which regions of the control space have been searched and which remain unexplored. This prevents repeated search in the same low-value basin.

```json
{
  "search_state": {
    "explored_join_paths": [],
    "pruned_candidates": [],
    "required_expansions": []
  }
}
```

### 11.5 Aggregation Mismatch

SGAR stores global invariants and composition constraints as stateful objects, not merely as one-turn instructions.

```json
{
  "global_invariants": [
    "all generated SQL clauses must refer to columns in the selected schema subgraph",
    "final report claims must trace to accepted evidence records"
  ]
}
```

### 11.6 Specification Mismatch

SGAR makes specification changes explicit. Rubrics, success criteria, and user decisions become committed governance state with revision history.

```json
{
  "success_criteria": [
    {
      "criterion": "final answer must include downloadable Markdown file",
      "source": "user request",
      "status": "committed"
    }
  ]
}
```

---

## 12. SGAR and Knowledge Governance

Knowledge Governance creates and manages control knowledge. SGAR determines when that knowledge becomes authoritative.

A GKO proposed in context is not yet a committed GKO. It becomes committed only through a governance transition.

```text
Proposed GKO
  → evidence envelope
  → conflict check
  → revocation rule check
  → object-store write
  → readback verification
  → committed GKO
```

A committed GKO may then influence:

```text
routing
search
rendering
audit
verification
state transition eligibility
```

This distinction matters because many LLM systems accumulate pseudo-rules in the conversation context. The model may say:

```text
From now on, we will always check X before doing Y.
```

But unless that rule is committed into the governed object store or state record, it may vanish, be contradicted, or be ignored later.

The SGAR version is:

```text
1. Propose rule.
2. Represent it as a GKO candidate.
3. Attach condition, evidence, priority, and revocation trigger.
4. Check for conflicts.
5. Commit it to governance state.
6. Use it in future context rendering and transition verification.
```

---

## 13. SGAR and Audit Engineering

Audit Engineering produces findings, control deltas, and regression guards. SGAR commits them into the runtime state.

The integration is:

```text
Candidate Artifact
  → Audit Finding
  → Control Delta
  → Verification
  → State Commit
  → Regression Guard Activation
  → Defect Ledger Update
```

Without SGAR, audit findings may remain as textual suggestions. The model may mention the failure, apologize, and produce a revised output, but the failure family may not become durable system knowledge.

With SGAR, an audit finding becomes a state transition:

```json
{
  "transition_type": "audit_commit",
  "finding_id": "finding.empty_result_due_to_overconstrained_predicate",
  "control_delta": {
    "target": "predicate_construction_rule",
    "change": "require value-distribution inspection before applying equality predicate"
  },
  "regression_guard": {
    "type": "execution_guard",
    "rule": "candidate SQL must not return empty result without explicit empty-result justification"
  }
}
```

The defect is no longer merely noted. It changes future behavior.

---

## 14. Failure Modes Prevented by SGAR

### 14.1 False Completion

False completion occurs when the agent declares a task done without satisfying completion criteria.

Pattern:

```text
model says done → user trusts done → hidden defect remains
```

SGAR repair:

```text
completion requires explicit completion transition and verifier acceptance
```

### 14.2 State Drift

State drift occurs when the system's internal narrative gradually diverges from external reality.

Pattern:

```text
summary says file has property P
actual file lacks P
future actions rely on P
```

SGAR repair:

```text
state summaries are projections from committed records, not authority sources
```

### 14.3 State Oscillation

State oscillation occurs when the system repeatedly changes assumptions or plans without committing a stable state.

Pattern:

```text
assumption A → assumption B → assumption A → no durable resolution
```

SGAR repair:

```text
state hypotheses require status: proposed / supported / rejected / committed / revoked
```

### 14.4 Performative Action

Performative action occurs when the agent generates text that resembles action but does not affect the environment.

Pattern:

```text
"I will update the file" or "I have updated the file" without write/readback
```

SGAR repair:

```text
state-changing actions require tool effects and observation records
```

### 14.5 Memory Contamination

Memory contamination occurs when unverified claims enter durable memory.

Pattern:

```text
model infers user preference → stores as fact → future behavior adapts incorrectly
```

SGAR repair:

```text
memory writes require source, confidence, scope, and revocation trigger
```

### 14.6 Unrecoverable Intermediate Failure

Unrecoverable intermediate failure occurs when a long process changes several artifacts but lacks rollback or replay records.

Pattern:

```text
agent modifies files A, B, C
failure appears later
system cannot identify responsible transition
```

SGAR repair:

```text
every state-changing action has transition ID, evidence, delta, and rollback policy
```

### 14.7 Context-Level Progress Illusion

Context-level progress illusion occurs when the context becomes increasingly detailed and coherent while the external task has not advanced.

Pattern:

```text
long plans, summaries, rationales, and refinements create an impression of progress
but no committed state transition occurs
```

SGAR repair:

```text
progress metrics count committed transitions, not narrative length
```

### 14.8 Role Confusion

Role confusion occurs when the model acts as planner, executor, verifier, and state authority simultaneously without separation.

Pattern:

```text
same model proposes action, claims execution, verifies success, and records completion
```

SGAR repair:

```text
separate proposal, execution, verification, and commitment roles where risk requires
```

---

## 15. Authority Separation

SGAR benefits from separating four roles:

| Role | Function |
|---|---|
| Proposer | Generates candidate actions or state deltas. |
| Executor | Performs actions against tools or environment. |
| Observer | Records outcomes. |
| Verifier | Decides whether the transition is admissible. |
| Committer | Writes the accepted state transition. |

In low-risk systems, one component may perform multiple roles. In high-risk systems, these roles should be separated.

The important rule is:

```text
The proposer should not be the sole authority for verifying its own success.
```

This does not prohibit LLM self-critique. It demotes self-critique to one evidence source among others.

---

## 16. Idempotence, Replay, and Rollback

Long-horizon agents need recovery. Recovery requires the system to know what happened.

### 16.1 Idempotence

An action is idempotent if repeating it does not create unintended additional effects.

SGAR should prefer idempotent transitions where possible:

```text
write object version N
set field to value V
create transition with unique idempotency key
```

rather than ambiguous operations:

```text
append something again
make the file better
update the memory somehow
```

### 16.2 Replay

Replayability means that the system can reconstruct how a state was reached.

A replayable transition includes:

```text
previous state reference
action parameters
observed outcome
verifier decision
state delta
commit timestamp
artifact references
```

Replayability allows debugging, audit, governance, and trust.

### 16.3 Rollback

Rollback allows the system to undo or supersede a bad transition.

Not all transitions can be physically undone. Some can only be compensated or marked as superseded. SGAR should therefore distinguish:

```text
reversible transition
compensatable transition
irreversible transition
```

For irreversible transitions, the threshold for commitment should be higher.

---

## 17. State Invariants

A state invariant is a condition that must remain true across transitions.

Examples:

```text
A completed task must have at least one completion verifier.
A committed GKO must have a revocation trigger.
A code patch transition must include file readback.
A defect marked resolved must have an associated regression guard.
A memory fact must have source and scope.
A high-risk action must have human approval.
```

State invariants prevent governance objects from degrading into unstructured logs.

A minimal invariant schema is:

```json
{
  "id": "invariant.unique_identifier",
  "condition": "when this invariant applies",
  "rule": "what must be true",
  "severity": "warning | blocking | critical",
  "verifier": "how to check the invariant",
  "repair_action": "what to do if violated"
}
```

Invariants connect SGAR to Audit Engineering. An invariant violation should create an audit finding and possibly block transition commitment.

---

## 18. Completion as a Governed Transition

Completion deserves special treatment. In ordinary agent systems, completion is often a model utterance:

```text
"Done."
```

In SGAR, completion is a transition type with explicit admission criteria.

A completion contract is:

```json
{
  "completion_id": "completion.task.001",
  "task_id": "task.001",
  "claimed_completed_scope": "what is claimed complete",
  "completion_criteria": [],
  "evidence": [],
  "verifier": {},
  "open_issues": [],
  "known_limitations": [],
  "decision": "accept | reject | partial | blocked"
}
```

A completion transition should answer:

```text
What exactly is complete?
Against which criteria?
What evidence supports completion?
What remains open?
What authority accepted completion?
```

This prevents overbroad completion claims. A system can mark a subtask complete while leaving the larger task active.

---

## 19. Memory Writes as Governed Transitions

Memory is one of the most dangerous forms of state because it influences future behavior while often being hard for users to inspect.

A memory write should not occur merely because the model inferred something. It should be governed.

A minimal memory transition is:

```json
{
  "memory_write_id": "memory.write.unique_identifier",
  "claim": "user prefers concise technical explanations",
  "source": "explicit user statement | inferred | repeated behavior | system decision",
  "scope": "global | project | session | task",
  "confidence": "low | medium | high",
  "lifespan": "temporary | persistent | until_revoked",
  "revocation_trigger": "user contradicts preference or task context changes",
  "verifier": "user explicit confirmation or policy allowing inference",
  "decision": "commit | defer | reject"
}
```

Memory governance prevents:

```text
unverified preference capture
stale assumptions
cross-project contamination
privacy leakage
irreversible personalization errors
```

In SGAR, memory is not a passive transcript. It is a governed state surface.

---

## 20. Human Approval and Collaboration State

Human involvement should also be state-governed. A user approval, rejection, correction, or constraint should become an explicit state event when it affects future behavior.

A human approval transition records:

```json
{
  "approval_id": "approval.unique_identifier",
  "approved_object": "artifact | plan | GKO | action | completion",
  "scope": "what the approval covers",
  "not_approved": "what the approval does not cover",
  "approver": "user or role",
  "evidence": "message or interaction reference",
  "expires": "optional expiry condition"
}
```

This prevents a common failure:

```text
The user approved a local step, and the agent treats it as approval of the entire plan.
```

Approval has scope. SGAR makes scope explicit.

---

## 21. SGAR for Multi-Agent Systems

Multi-agent LLM systems amplify state-authority problems. Multiple agents may maintain inconsistent narratives, duplicate work, overwrite each other's assumptions, or verify their own outputs through friendly agents with no external authority.

SGAR requires shared hard state and role-specific permissions.

A multi-agent state model should specify:

```text
which agent can propose actions
which agent can execute tools
which agent can verify outcomes
which agent can commit state
which objects require human or mechanical authority
how conflicts are resolved
```

A simple permission schema is:

```json
{
  "role": "planner | executor | auditor | verifier | committer | human_supervisor",
  "permissions": [
    "propose_transition",
    "execute_tool",
    "create_audit_finding",
    "commit_gko",
    "mark_task_complete"
  ],
  "forbidden_actions": [],
  "requires_approval_for": []
}
```

The key rule is:

```text
Multi-agent disagreement should be resolved through state authority, not conversation dominance.
```

---

## 22. SGAR for Text-to-SQL

Text-to-SQL illustrates SGAR in a compact domain.

A direct system may generate SQL, run it, observe an error, and revise. But unless intermediate assumptions are state-governed, the system may repeat failures or silently change schema assumptions.

An SGAR text-to-SQL state includes:

```json
{
  "question": "natural language query",
  "schema_state": {
    "inspected_tables": [],
    "column_meanings": [],
    "foreign_keys": [],
    "sampled_values": []
  },
  "control_state": {
    "schema_subgraph": null,
    "join_paths": [],
    "value_bindings": [],
    "predicate_skeleton": null
  },
  "candidate_sql": [],
  "execution_results": [],
  "audit_findings": [],
  "accepted_sql": null
}
```

Transitions include:

```text
inspect_schema
sample_values
commit_schema_subgraph
commit_join_path
render_sql
execute_sql
audit_execution_result
revise_control_object
accept_final_sql
```

Completion requires:

```text
accepted SQL
execution result
semantic audit
record of unresolved ambiguity, if any
```

This converts text-to-SQL from direct answer generation into governed state progression over schema, values, joins, predicates, execution, and semantic acceptance.

---

## 23. SGAR for Code Agents

Code agents are highly exposed to false completion and state drift.

A code agent may claim that it changed code, fixed a bug, updated tests, or passed a suite. SGAR requires every such claim to map to a transition.

A code-agent state includes:

```json
{
  "repository_state": {
    "branch": "current branch",
    "modified_files": [],
    "base_revision": "commit hash or snapshot id"
  },
  "issue_state": {
    "bug_report": "description",
    "reproduction_steps": [],
    "root_cause_hypotheses": [],
    "accepted_root_cause": null
  },
  "patch_state": {
    "candidate_patches": [],
    "applied_patch": null,
    "rollback_handle": null
  },
  "verification_state": {
    "tests_run": [],
    "test_results": [],
    "static_checks": [],
    "known_failures": []
  }
}
```

Transitions include:

```text
read_file
write_patch
readback_patch
run_test
commit_test_result
audit_failure
revise_patch
mark_issue_resolved
rollback_patch
```

A completion transition should be blocked if:

```text
no reproduction was attempted
no relevant test was run
file modification was not verified
known failing tests remain unexplained
regression guard is missing for a fixed defect
```

This does not require perfect verification. It requires explicit verification scope.

---

## 24. SGAR for Research Agents

Research agents create subtle state-authority risks because much of the work is conceptual: claims, summaries, citations, hypotheses, outlines, and decisions.

A research-agent state should distinguish:

```text
source records
extracted claims
interpretations
hypotheses
accepted conclusions
open uncertainties
citation requirements
drafted artifacts
review findings
```

A model-generated summary is not an accepted conclusion. It becomes one only when it passes the appropriate verifier, such as source traceability, user acceptance, or consistency with a research rubric.

A research transition might be:

```text
read_source → extract_claims → verify_traceability → commit_claim_objects
```

Another might be:

```text
propose_theoretical_claim → audit_against_framework → commit_as_GKO_with_revocation_trigger
```

SGAR is especially important in research because conceptual drift can be hard to detect. A long coherent draft can silently change definitions, overstate evidence, or collapse distinctions. Hard state forces definitions, assumptions, and accepted claims to remain inspectable.

---

## 25. SGAR and Tool Use

Tool use is not automatically state governance. A model can call tools and still mis-handle the resulting state.

SGAR requires that tool effects be represented explicitly.

For each tool call, the system should record:

```text
tool name
input parameters
authority level
side-effect profile
observed output
error status
state delta, if any
verification method
rollback or compensation policy
```

Tool calls can be classified by side effect:

| Tool type | State risk |
|---|---|
| Pure read | Low, but observation may be stale or partial. |
| Deterministic computation | Low to medium, depending on input correctness. |
| File write | Medium, requires readback and rollback. |
| Database write | High, requires transaction and audit. |
| External message/send action | High, often irreversible. |
| Memory write | High, affects future behavior. |
| Deletion/destructive action | Critical, requires elevated authority. |

The transition threshold should rise with irreversibility and external consequence.

---

## 26. State Compression and Context Rendering

SGAR does not require placing all hard state into the prompt. The system should render a task-relevant projection of hard state into context.

This introduces a new governed function:

```text
R_context: S_hard → C_prompt
```

Context rendering must preserve the state distinctions relevant to the next action. Poor rendering can reintroduce observation-representation mismatch inside the runtime itself.

A good context render includes:

```text
current goal
committed constraints
open uncertainties
recent relevant transitions
active GKOs
blocking issues
available actions
completion criteria
```

It should avoid:

```text
stale summaries
unverified claims
irrelevant long history
collapsed uncertainty
hidden revocations
overconfident completion statements
```

Thus SGAR does not eliminate representation problems. It makes them explicit and governable.

---

## 27. Non-Monotonic State and Revocation

Some state should be monotonic: a transition happened, a test produced output, a file had content at time `t`. Other state is non-monotonic: assumptions, beliefs, hypotheses, preferences, rubrics, and control rules may be revised or revoked.

SGAR should distinguish event history from current belief state.

```text
Event history is append-only.
Current governed state is revisable.
```

For example:

```text
Event: User said "keep it concise" on date t.
Current preference: User prefers concise answers for this project.
Revocation: User later asks for maximal detail.
```

The event remains true. The current preference changes.

This distinction prevents two bad extremes:

```text
forgetting old evidence entirely
or treating old assumptions as immortal facts
```

---

## 28. SGAR Decision Rules

A practical system needs decision rules for when SGAR overhead is justified.

SGAR is most valuable when:

```text
the task spans multiple turns or tools
state changes have external effects
actions are costly or irreversible
progress must be recoverable
multiple agents or humans collaborate
control knowledge must persist
completion has meaningful consequences
failure families should be remembered
```

SGAR may be unnecessary for:

```text
single-turn low-risk drafting
pure brainstorming
casual explanation
format conversion
one-shot style rewriting
simple Q&A with no durable state
```

A simple decision criterion is:

```text
Use SGAR when the expected cost of false state exceeds the overhead of state governance.
```

False state includes:

```text
false completion
wrong memory
unverified tool effect
lost rollback
miscommitted assumption
untracked artifact change
unrecoverable process drift
```

---

## 29. Minimal SGAR Implementation

A minimal implementation does not require a large platform. It requires four things:

```text
1. A committed state store.
2. A transition log.
3. Verifier definitions.
4. A context renderer that reads from committed state.
```

The minimal loop is:

```text
read state
render context
propose action
execute / observe
derive state delta
verify delta
commit or reject
log transition
```

A lightweight file-based implementation can store:

```text
/state/current.json
/state/transitions/*.json
/governance/gkos/*.json
/governance/findings/*.json
/governance/guards/*.json
/artifacts/*
```

The principle matters more than the storage technology. A database, event log, git repository, object store, task tracker, or structured file system can all implement SGAR if they respect transition authority.

---

## 30. Theoretical Propositions

### Proposition 1: Context Non-Authority

If state commitment depends only on model assertion, then there exists a runtime trace in which the model claims progress without any corresponding environment or object-state change.

Therefore, model assertion alone is insufficient as a state authority for systems where external progress matters.

### Proposition 2: Verification-Dependent Progress

For any task whose success depends on external artifacts or environment state, progress is not established by an action proposal but by a verified observation of the action's effect.

### Proposition 3: Audit Durability

An audit finding that is not committed into a durable governance or state object can be lost under context truncation, summarization, or topic shift. Therefore, audit-driven improvement requires state commitment.

### Proposition 4: Completion Risk

If task completion is represented only as generated text, then false completion is indistinguishable from true completion at the state-authority level. Completion must therefore be governed by an explicit transition contract when task stakes justify it.

### Proposition 5: Revocation Necessity

Any persistent governed object without a revocation path can become a stale constraint under changing evidence. Therefore, long-running SGAR systems require revocation or supersession transitions for non-monotonic control knowledge.

These propositions are not empirical performance claims. They are structural claims about authority, state, and transition validity.

---

## 31. Relationship to Formal Traditions

SGAR borrows structural ideas from several established traditions while adapting them to LLM-agent runtime.

### 31.1 Event Sourcing

Event sourcing treats state as the result of an event log. SGAR similarly treats committed agent state as the result of transition records. The difference is that SGAR events include LLM proposals, tool observations, audit findings, GKO revisions, human approvals, and verifier decisions.

### 31.2 Database Transactions

Transactions distinguish proposed changes from committed changes. SGAR applies this distinction to agentic work. A model's proposed change is not committed until it satisfies a transition contract.

### 31.3 Write-Ahead Logs

A write-ahead log records enough information to recover from failure. SGAR transition logs serve a similar role for agent workflows: they allow replay, audit, rollback, and accountability.

### 31.4 State Machines

State machines define allowed transitions between states. SGAR extends this idea to heterogeneous LLM tasks where states include artifacts, beliefs, tools, memory, audits, and collaboration objects.

### 31.5 POMDPs and Belief State

POMDPs are not merely an analogy for SGAR. The Formal Mechanism Layer provides the approximate decision-system model in which SGAR commits verified transitions. SGAR is the hard-state governance layer over that mechanism-level transition process.

### 31.6 Truth Maintenance

Truth-maintenance systems track dependencies and retractions among beliefs. SGAR applies this logic to governed knowledge objects, memory records, state hypotheses, and revocation transitions.

---

## 32. Risks and Failure Modes of SGAR Itself

SGAR introduces overhead and can fail if implemented poorly.

### 32.1 State Bureaucracy

Too much state structure can slow down simple tasks and create unnecessary friction.

Mitigation:

```text
apply SGAR selectively based on state risk
use lightweight state for low-risk tasks
allow direct generation when no durable state is affected
```

### 32.2 False Authority

A poorly designed state store can create the illusion of reliability while storing unverified claims.

Mitigation:

```text
separate claimed, observed, verified, and committed state
require evidence and verifier metadata
```

### 32.3 Verifier Weakness

If verifiers are weak, SGAR may merely commit bad transitions more formally.

Mitigation:

```text
stratify verifier authority
prefer mechanical and environmental checks
record verifier limits
add audit-of-verifier processes
```

### 32.4 State Staleness

Committed state can become stale when the world changes.

Mitigation:

```text
attach freshness metadata
use expiration conditions
require revalidation for time-sensitive facts
```

### 32.5 Over-Commitment

The system may commit hypotheses too early.

Mitigation:

```text
support provisional states
separate hypothesis status from fact status
use revocation and supersession
```

### 32.6 Inconsistent Object Stores

Governance objects, artifact records, and transition logs may diverge.

Mitigation:

```text
state invariants
periodic consistency checks
transition atomicity where possible
```

SGAR should itself be governed. It is not a magic layer; it is a discipline for authority management.

---

## 33. Design Principles

The core design principles of SGAR are:

### Principle 1: Context Demotion

The context window is a workspace, not a state authority.

### Principle 2: Verified Commitment

Only verified transitions update hard state.

### Principle 3: Authority Stratification

Different evidence sources have different authority levels.

### Principle 4: Explicit State Surfaces

Task, artifact, environment, memory, governance, execution, and collaboration state should be distinguished when relevant.

### Principle 5: Replayability

The system should be able to reconstruct how important states were reached.

### Principle 6: Revocability

Non-monotonic state must have revocation or supersession paths.

### Principle 7: Completion Governance

Completion is a transition, not a statement.

### Principle 8: Audit Durability

Audit findings must become durable objects to influence future behavior.

### Principle 9: Minimal Necessary Governance

Use only as much state governance as the task's risk and duration justify.

### Principle 10: State-Rendered Context

Prompts should be rendered from committed state, rather than allowing context narrative to define state.

---

## 34. Standard Schemas

### 34.1 State Record

```json
{
  "state_id": "state.unique_identifier",
  "version": 1,
  "status": "active",
  "task_state": {},
  "artifact_state": {},
  "environment_state": {},
  "memory_state": {},
  "governance_state": {},
  "execution_state": {},
  "collaboration_state": {},
  "invariants": [],
  "open_issues": [],
  "last_transition_id": null
}
```

### 34.2 Transition Record

```json
{
  "transition_id": "transition.unique_identifier",
  "from_state_id": "state.before",
  "action": {},
  "observation": {},
  "verifier": {},
  "candidate_state_delta": {},
  "decision": "accept | reject | defer | escalate | rollback",
  "to_state_id": "state.after",
  "commit_record": {}
}
```

### 34.3 Verifier Record

```json
{
  "verifier_id": "verifier.unique_identifier",
  "type": "mechanical | environment | human | governed_llm | heuristic",
  "authority_level": 0,
  "input_requirements": [],
  "acceptance_rule": "rule or procedure",
  "known_limits": [],
  "failure_action": "reject | retry | escalate | create_audit_finding"
}
```

### 34.4 Completion Record

```json
{
  "completion_id": "completion.unique_identifier",
  "task_id": "task.unique_identifier",
  "scope": "what is complete",
  "criteria": [],
  "evidence": [],
  "verifier": {},
  "open_issues": [],
  "known_limitations": [],
  "decision": "complete | partial | blocked | rejected"
}
```

### 34.5 Rollback Record

```json
{
  "rollback_id": "rollback.unique_identifier",
  "target_transition_id": "transition.to_revert_or_supersede",
  "reason": "why rollback is needed",
  "rollback_type": "revert | compensate | supersede | mark_invalid",
  "verification": {},
  "resulting_state_id": "state.after_rollback"
}
```

---

## 35. Conclusion

LLM agents need more than plans, memory, tools, and self-reflection. They need a runtime account of what makes progress real. In ordinary context-driven agents, the language context often carries the appearance of state. It says what has been done, what is true, what has changed, and what remains. But context is not authority. It is a narrative workspace.

State-Governed Agent Regime replaces narrative authority with transition authority. A system changes state only through verified transitions:

```text
S + A → O → V → S'
```

This simple contract has broad consequences. It separates proposals from actions, observations from claims, verification from confidence, completion from declaration, memory from inference, and state from summary. It gives Knowledge Governance a runtime authority surface. It gives Audit Engineering a durable write-back path. It gives long-horizon agents the ability to recover, replay, rollback, revoke, and coordinate.

SGAR is not necessary for every LLM interaction. It is unnecessary for many low-risk, one-shot, purely textual tasks. But when an LLM system must act over time, modify artifacts, remember preferences, coordinate agents, use tools, commit repairs, or claim completion, hard-state governance becomes central.

The central rule is:

```text
The model may narrate progress, but only the state transition commits it.
```

---

## Appendix A: Compact Glossary

| Term | Definition |
|---|---|
| SGAR | Runtime regime where progress is defined by verified hard-state transitions. |
| Hard state | External, authoritative, inspectable state used for future execution. |
| Context state | Narrative or prompt-level representation of state, non-authoritative by default. |
| Claimed state | State asserted by a model or user before verification. |
| Observed state | State obtained through tools, environment queries, or evidence. |
| Verified state | Observed or derived state accepted by a verifier. |
| Committed state | Authoritative state after a valid transition. |
| Transition contract | Rule of the form `S + A → O → V → S'`. |
| Verifier | Authority that decides whether a candidate transition is admissible. |
| Completion transition | Governed transition marking a scope of work complete. |
| Rollback transition | Transition that reverts, compensates, or supersedes a prior state change. |
| Revocation transition | Transition that weakens or removes a non-monotonic governed object. |
| Context demotion | Principle that context may propose or summarize state but cannot authorize it. |

## Appendix B: Minimal Checklist

Before allowing an LLM agent to mark a state-changing step complete, ask:

```text
1. What state is being changed?
2. What action was taken?
3. What observation shows the action's effect?
4. What verifier accepted the observation?
5. What state delta was committed?
6. Can the transition be replayed or inspected?
7. Is rollback or supersession possible if later evidence contradicts it?
8. Are open issues and limitations recorded?
```

If these questions cannot be answered, the system may have a useful narrative of progress, but it does not yet have governed progress.
