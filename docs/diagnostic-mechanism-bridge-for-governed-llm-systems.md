# Diagnostic–Mechanism Bridge for Governed LLM Systems

## Unifying Six Primitive Value-Preservation Mismatches with Eight Intervention Mechanism Axes

**Working Draft v0.1**  
**Xinyun Wang, Shuliang Liang**

---

## Abstract

The theory of governed LLM systems contains two complementary diagnostic layers. The first layer is the **six primitive mismatch taxonomy**: observation-representation, state, fitting-boundary, support, aggregation, and specification mismatch. This layer explains where task value is structurally lost along a value-preservation pipeline. It answers the question: **why did the system fail in task-value terms?**

The second layer is the **formal mechanism layer**: specification/reward, observation availability, belief/representation, dynamics/world model, action/interface, capability support, capability routing, and search/execution. This layer identifies which intervenable component of an approximate LLM decision system should be changed. It answers the question: **where should the system be repaired?**

These two layers are not competing taxonomies. They are orthogonal coordinate systems. The six primitive mismatches are **value-preservation diagnostic axes**; the eight mechanism axes are **intervention-localization axes**. A failure should therefore be represented by at least three fields:

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer  ∈ agent | training | hybrid
```

This document defines the bridge between the two layers. It introduces a six-by-eight crosswalk matrix, a mechanism-profile object, a repair-layer selection rule, and an audit-to-training feedback loop. It also clarifies how the mechanism layer relates to Audit Engineering, the Governed Object Model, and the State-Governed Agent Regime (SGAR). The result is a unified diagnostic and repair architecture: primitive mismatches explain value failure; mechanism profiles localize repair; audit findings produce control deltas; governed objects store repair knowledge; SGAR commits verified changes into hard state; recurrent learning-component failures can be promoted into training curricula.

The central sentence is:

```text
The primitive-mismatch layer explains structure;
the mechanism layer chooses the scalpel.
```

---

## 1. Purpose and Scope

The existing governed-LLM theory stack contains two powerful but easily confused formalisms:

```text
Value-preservation pipeline:
S_world → O → Z → routing → support → aggregation → evaluation

Mechanism-layer decision model:
E = (S, A, T, R*, Ω, O, γ)
M_θ = (R̂_θ, Ω_sys, B_θ, T̂_θ, A_sys, π_θ, r_θ, D)
```

The first formalism supports the six primitive mismatches. It describes where task value is lost as the system moves from world state to output. It is primarily a **diagnostic ontology of value leakage**.

The second formalism supports the eight mechanism axes. It decomposes an LLM system into approximate, intervenable components. It is primarily a **repair-localization ontology**.

Without an explicit bridge, the theory risks appearing to contain two unrelated classification systems: six primitive mismatches in one place, eight mechanism axes in another. This document removes that ambiguity.

It establishes four claims.

First, the two layers are orthogonal rather than redundant:

```text
Six primitive mismatches = where value is structurally lost.
Eight mechanism axes     = which system component should be changed.
```

Second, a single failure may have one primitive mismatch diagnosis but multiple mechanism causes. Conversely, a single mechanism defect may manifest as several primitive mismatch symptoms.

Third, the mechanism layer is the missing bridge between inference-time governance and training-time improvement. Agent-layer repair handles local, reversible, task-specific failures. Training-layer repair handles recurrent, cross-task, amortizable learning-component failures.

Fourth, the bridge should be formalized in the object model through `mismatch_type`, `repair_target`, `repair_layer`, and `mechanism_profile` fields.

This document is not a replacement for the six-mismatch taxonomy, the formal-mechanism-layer document, the object-model specification, Audit Engineering, or SGAR. It is the wiring layer that makes them operate as one system.

---

## 2. Two Orthogonal Cuts Through the Same System

There are two legitimate ways to analyze an LLM system failure.

### 2.1 The Value-Preservation Cut

The value-preservation cut asks:

```text
Where did task value leak or distort as the system moved from world to output?
```

This cut yields six primitive mismatches:

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

These are **diagnostic axes**. They classify the form of value failure.

For example, if a Text-to-SQL system fails because the relevant foreign key never entered its operational schema representation, the failure is an observation-representation mismatch. If the correct join path exists in the representation but is rarely generated, the failure may be a support mismatch. If the generated SQL clauses are locally plausible but globally inconsistent, the failure is an aggregation mismatch.

The six-mismatch layer therefore answers:

```text
What kind of value-preservation failure occurred?
```

### 2.2 The Mechanism-Intervention Cut

The mechanism-intervention cut asks:

```text
Which component of the system should be repaired?
```

This cut yields eight mechanism axes:

```text
1. Specification / reward
2. Observation availability
3. Belief / representation
4. Dynamics / world model
5. Action / interface
6. Capability support / policy prior
7. Fitting boundary / capability routing
8. Search / execution
```

These are **repair-localization axes**. They classify the component to be changed.

For example, the same Text-to-SQL failure may require changing the observation channel, the schema representation, the SQL capability support, the router that decides whether to use join-path search, the execution-guided search procedure, or the evaluation rubric. The primitive mismatch alone does not determine which of these components is the actual repair target.

The mechanism layer therefore answers:

```text
What should be changed, and at which layer?
```

### 2.3 The Bridge

The bridge between the two cuts is:

```text
Failure
  → primitive mismatch diagnosis
  → mechanism profile
  → repair target
  → repair layer
  → control delta / training item / state transition
```

The primitive mismatch explains the failure in value terms. The mechanism profile localizes the intervention. The repair layer determines whether the repair belongs in agent-layer governance, training-layer improvement, or a hybrid of both.

---

## 3. Layer Position in the Unified Theory Stack

The bridge document sits between the structural theory and the repair systems.

```text
Layer 0: World-to-output value-preservation pipeline

Layer 1: Six Primitive Mismatches
  What kind of task-value failure occurred?

Layer 2: Formal Mechanism Layer
  Which system component caused or amplified the failure?

Layer 3: Diagnostic–Mechanism Bridge
  How does a value diagnosis become a repair localization?

Layer 4: Knowledge Governance
  Which control objects should be induced, revised, revoked, or reused?

Layer 5: Audit Engineering
  How are failures localized and written back into the control space?

Layer 6: Governed Object Model
  How are mismatch diagnoses, mechanism profiles, control deltas, and state records stored?

Layer 7: SGAR
  Which repairs, actions, verifier results, and state changes are formally committed?

Layer 8: Mechanism-Driven Training
  Which recurrent learning-component failures should be promoted into training curricula?
```

The key transition is:

```text
primitive mismatch diagnosis
  → mechanism localization
  → repair-layer selection
```

Without this transition, the system may correctly diagnose that a failure is, for example, a support mismatch, but still choose the wrong repair. It may increase sampling when the true problem is capability routing; add retrieval when the true problem is action-interface absence; revise the rubric when the decisive variable never entered the representation; or perform agent-layer patching forever when the real issue is a recurrent learning-component failure that should be amortized through training.

---

## 4. The Six Primitive Mismatches

The six primitive mismatches are value-preservation diagnostic axes. They are derived from structurally distinct stations in the world-to-output pipeline.

| Primitive mismatch | Value-preservation question | Typical diagnostic sign |
|---|---|---|
| Observation-representation | Did the decisive variable enter the operational representation? | The system reasons fluently over an impoverished or aliased representation. |
| State | Is the relevant latent state identifiable and preserved? | The system collapses multiple possible regimes into one premature interpretation. |
| Fitting-boundary | Was the right capability activated in the right domain? | The model has the capability but over-triggers or under-triggers it. |
| Support | Did the high-value structure become a live candidate? | Correct structures are absent, rare, pruned, or indistinguishable from noise. |
| Aggregation | Do locally good parts compose into global value? | Local clauses, steps, or edits are plausible but globally inconsistent. |
| Specification | Does the accessible objective represent true utility? | The system optimizes a rubric, metric, prompt, or proxy that misranks candidates. |

The six mismatches explain the form of value failure. They do not, by themselves, enumerate every component that may need to be modified.

---

## 5. The Eight Mechanism Axes

The eight mechanism axes are intervention-localization axes. They identify which component of the approximate LLM system should be changed.

| Mechanism axis | Component | Core question | Typical repair layer |
|---|---|---|---|
| Specification / reward | `R*`, `R_proxy`, `R̂_θ`, `R_eval` | Is the objective, proxy, rubric, reward model, or evaluator wrong? | Hybrid |
| Observation availability | `Ω`, `O` | Is the necessary evidence available to the system? | Agent |
| Belief / representation | `B_θ` | Does the system form the right operational state or representation? | Training, with agent patches |
| Dynamics / world model | `T̂_θ` | Does the system predict action consequences correctly? | Training, with agent calibration |
| Action / interface | `A_sys` | Does the system have the required action, tool, API, permission, or interface? | Agent |
| Capability support | `π_θ` | Can the model/system produce the required structure at all under budget? | Training, with agent patches |
| Capability routing | `r_θ` | Is the right capability activated under the right conditions? | Training, with agent patches |
| Search / execution | `D` | Does the inference-time procedure search, branch, execute, verify, or backtrack correctly? | Agent |

The eight axes are not eight new primitive value mismatches. They are the repair coordinates used after a value-preservation mismatch has been diagnosed.

---

## 6. Learning Components, System Components, and Hybrid Components

The mechanism layer is especially important because it separates learning components from system components.

### 6.1 System Components

System components are repaired primarily at the agent or system layer. They include:

```text
observation availability
 action / interface
 search / execution
 R_eval / rubric components of specification
```

These components are usually changed by adding tools, exposing data, changing workflows, modifying verifiers, adding state records, adjusting search procedures, or revising runtime control objects.

Examples:

```text
add database execution access
expose logs
add schema inspection
add a rollback gate
add a structured state table
change the verifier
increase branch search
require execution before commit
```

### 6.2 Learning Components

Learning components are internal or model-mediated capabilities that can be temporarily patched at the agent layer but may require training if the defect is recurrent and cross-task. They include:

```text
belief / representation: B_θ
 dynamics / world model: T̂_θ
 capability support: π_θ
 capability routing: r_θ
 reward / proxy model: R̂_θ or R_proxy
```

Examples of agent-layer patches:

```text
RAG
few-shot examples
explicit state extraction
external memory
explicit router rules
mode switching
execution calibration
structured intermediate objects
```

Examples of training-layer repair:

```text
SFT on boundary cases
curriculum over state distinctions
execution-grounded training
reward-model correction
capability-specific data augmentation
router training
world-model grounding
representation-focused fine-tuning
```

### 6.3 Repair-Layer Selection Rule

The repair-layer selection rule is:

```text
Use agent-layer repair for local, reversible, task-specific failures.
Use training-layer repair for recurrent, cross-task, amortizable learning-component failures.
Use hybrid repair when agent-layer governance supplies immediate safety or performance while training amortizes the defect over time.
```

A more operational form is:

```text
If the defect is one-off, context-specific, reversible, or tool/interface-related:
  repair at the agent layer.

If the defect is recurrent, cross-task, capability-level, representation-level, world-model-level, reward-level, or router-level:
  promote it to the training layer.

If the defect is urgent but also recurrent:
  patch at the agent layer now, then promote to training.
```

This rule connects the mechanism layer to the governance cost model. Agent-layer governance is cheap, local, and reversible. Training repair is expensive but amortizable. The correct layer depends on recurrence, scope, cost, reversibility, and expected future value.

---

## 7. The Six-by-Eight Crosswalk Matrix

The bridge between the six primitive mismatches and the eight mechanism axes is a crosswalk matrix.

Rows are primitive mismatches: where task value leaks.  
Columns are mechanism axes: which component may need repair.

Legend:

```text
● = primary or common mechanism source
○ = secondary, amplifier, or downstream mechanism source
blank = usually not the main repair target, though exceptions may exist
```

| Six primitive mismatches \ Eight mechanism axes | Specification / reward | Observation availability | Belief / representation | Dynamics / world model | Action / interface | Capability support | Capability routing | Search / execution |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Observation-representation |  | ● | ● |  | ○ |  |  |  |
| State |  | ○ | ● | ●/○ |  |  |  | ○ |
| Fitting-boundary |  |  |  |  |  | ○ | ● | ○ |
| Support |  | ○ |  |  | ○ | ● | ○ | ●/○ |
| Aggregation |  |  | ● | ○ |  | ○ | ○ | ● |
| Specification | ● | ○ | ○ |  |  |  |  |  |

This matrix is a heuristic diagnostic map, not an ontological identity map. It does not claim that a given primitive mismatch always comes from the same mechanism. It says where to look first.

### 7.1 Why Belief / Representation Is a Hub

The `belief / representation` mechanism is a hub. Observation-representation, state, aggregation, and sometimes specification failures all depend on whether the system forms a usable operational representation.

This matters because `B_θ` is a learning component. If belief/representation failures recur across tasks, agent-layer patches may become a treadmill. The defect may need to be promoted into representation-oriented training, curriculum design, or model specialization.

### 7.2 Why World Model and Action Interface Need the Mechanism Layer

`Dynamics / world model` and `action / interface` may not appear as one-to-one primitive value mismatches because they are not value-leakage stations in the same way. They are closed-loop mechanism components. Their failures often manifest through state, support, aggregation, observation-representation, or SGAR transition failures.

For example:

```text
World-model defect:
  The model predicts that an API call, code patch, SQL query, market action, or workflow step will have one effect, but the real environment produces another.

Action-interface defect:
  The correct action is not available, not permissioned, not expressible through the tool schema, not reversible, or not connected to a verifier.
```

The primitive-mismatch layer diagnoses the symptom in value-preservation terms. The mechanism layer distinguishes whether the underlying repair target is a faulty world model, a missing action interface, inadequate search, or another component.

### 7.3 Why Specification and Capability Routing Are Near-Diagonal

Specification mismatch and fitting-boundary mismatch are often close to their corresponding mechanism axes.

```text
Specification mismatch ↔ specification / reward
Fitting-boundary mismatch ↔ capability routing
```

This makes them unusually clean cases for minimal intervention probes. If changing the rubric or objective resolves the failure, the specification mechanism is likely primary. If changing the capability trigger resolves the failure, capability routing is likely primary.

However, even these cases can be compound. A specification failure may originate from missing stakeholder observations. A routing failure may originate from weak capability support. The matrix guides diagnosis; it does not replace it.

---

## 8. Diagnostic Workflow

The bridge supports a five-step diagnostic workflow.

### Step 1: Diagnose the Primitive Mismatch

Ask:

```text
Where did value leak in the world-to-output pipeline?
```

Possible answers:

```text
observation_representation
state
fitting_boundary
support
aggregation
specification
compound
```

This explains the failure in value terms.

### Step 2: Localize the Mechanism

Ask:

```text
Which system component caused, amplified, or failed to repair the mismatch?
```

Possible answers:

```text
specification_reward
observation_availability
belief_representation
dynamics_world_model
action_interface
capability_support
capability_routing
search_execution
```

This identifies the repair target.

### Step 3: Assign Mechanism Role

A mechanism can have different causal roles:

```text
primary    = the main bottleneck or root repair target
amplifier  = worsens the failure but is not the root cause
downstream = a symptom caused by another mechanism defect
unknown    = insufficient evidence
```

For example, a support failure may be downstream of a routing failure. The correct structure may not appear because the capability that could generate it was never activated.

### Step 4: Select Repair Layer

Ask:

```text
Should this be repaired at the agent layer, the training layer, or both?
```

Use the repair-layer selection rule:

```text
agent    = local, reversible, task-specific, interface/tool/workflow/search/verifier repair
training = recurrent, cross-task, amortizable learning-component repair
hybrid   = immediate agent patch plus longer-term training repair
```

### Step 5: Write Back to Governed Objects

The diagnosis should not remain an explanation in prose. It should be written into the object system:

```text
Audit Finding
  → Mechanism Profile
  → Control Delta
  → Regression Guard
  → Defect Ledger
  → State Transition or Training Item
```

The output of diagnosis is therefore not just an answer. It is a durable governance object.

---

## 9. Minimal Intervention Probes

The mechanism layer should avoid unsupported causal labeling. A mechanism profile is strongest when supported by a **minimal intervention probe**.

A minimal intervention probe changes one component as locally as possible while keeping other components fixed. It asks whether the failure changes in the predicted way.

Examples:

| Suspected mechanism | Minimal intervention probe |
|---|---|
| Specification / reward | Replace or refine only the rubric; keep observations, representation, model, and search fixed. |
| Observation availability | Add only the missing evidence source; keep prompt, model, and objective fixed. |
| Belief / representation | Add only a structured state table, binding table, timeline, or schema representation. |
| Dynamics / world model | Add execution feedback or a predict-execute-compare loop. |
| Action / interface | Add only the missing tool/API/action/permission or expose the necessary interface. |
| Capability support | Add capability examples, specialized operator, expert model, or domain-specific generation support. |
| Capability routing | Add a router rule, trigger boundary, mode switch, or role separation. |
| Search / execution | Add branching, backtracking, candidate ranking, verifier calls, or execution-guided search. |

Minimal intervention probes are not benchmark experiments in the usual empirical sense. They are causal repair-localization probes. Their purpose is to determine which repair target is responsible for the observed failure.

### 9.1 Probe Outcomes

A probe may produce several outcomes:

```text
resolved
  The intervention repairs the failure. The mechanism is likely primary.

partially_resolved
  The intervention improves the failure but leaves another bottleneck. The mechanism is likely an amplifier or one member of a compound chain.

unchanged
  The intervention does not affect the failure. The mechanism is likely not primary, or the probe was too weak.

worse
  The intervention exposes another failure or adds governance-induced error.
```

### 9.2 Primary Cause, Amplifier, and Downstream Symptom

A common diagnostic error is to treat the most visible failure as the root cause.

Example:

```text
Observed symptom:
  Correct SQL join path never appears.

Primitive mismatch:
  Support mismatch.

Possible mechanism profile:
  capability_routing = primary
  search_execution = amplifier
  capability_support = unknown

Interpretation:
  The correct join path did not appear because the schema-audit capability never activated. Merely increasing search budget may amplify cost without repairing the root cause.
```

The mechanism profile should distinguish root repair targets from downstream symptoms.

---

## 10. Mechanism Profiles as Governance Objects

A **Mechanism Profile** is the object that bridges primitive mismatch diagnosis and repair action.

### 10.1 Minimal Schema

```json
{
  "id": "mechanism_profile.unique_id",
  "failure_instance": "artifact, run, task, or defect being diagnosed",
  "primitive_mismatch": [
    "observation_representation",
    "state",
    "fitting_boundary",
    "support",
    "aggregation",
    "specification"
  ],
  "mechanism_scores": {
    "specification_reward": "low | medium | high | unknown",
    "observation_availability": "low | medium | high | unknown",
    "belief_representation": "low | medium | high | unknown",
    "dynamics_world_model": "low | medium | high | unknown",
    "action_interface": "low | medium | high | unknown",
    "capability_support": "low | medium | high | unknown",
    "capability_routing": "low | medium | high | unknown",
    "search_execution": "low | medium | high | unknown"
  },
  "primary_mechanism": "one of the eight mechanism axes",
  "secondary_mechanisms": ["zero or more mechanism axes"],
  "repair_layer": "agent | training | hybrid",
  "minimal_intervention_probe": "probe used or proposed",
  "probe_result": "resolved | partially_resolved | unchanged | worse | not_run",
  "remaining_bottleneck": "what still appears to block repair",
  "recommended_control_delta": "localized change to system control structure",
  "recommended_training_item": "optional training-side item if repair_layer includes training",
  "evidence": "specific evidence supporting the profile",
  "confidence": "low | medium | high"
}
```

### 10.2 Relationship to Audit Finding

An Audit Finding should include or reference a Mechanism Profile.

```json
{
  "id": "finding.unique_id",
  "finding": "localized defect statement",
  "evidence": "specific evidence for the defect",
  "mismatch_type": "observation_representation | state | fitting_boundary | support | aggregation | specification | compound",
  "mechanism_profile": "mechanism_profile.unique_id",
  "repair_target": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution",
  "repair_target_role": "primary | amplifier | downstream | unknown",
  "repair_layer": "agent | training | hybrid",
  "control_delta": "control_delta.unique_id",
  "regression_guard": "regression_guard.unique_id",
  "confidence": "low | medium | high"
}
```

This prevents Audit Engineering from jumping directly from symptom to repair. The audit first diagnoses value failure, then localizes the mechanism, then writes the control delta.

### 10.3 Relationship to Control Delta

Control Deltas should target mechanism axes, not primitive mismatches.

```json
{
  "id": "control_delta.unique_id",
  "source_finding": "finding.unique_id",
  "target_mechanism": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution",
  "target_layer": "agent | training | hybrid",
  "delta_type": "SpecificationDelta | ObservationDelta | BeliefRepresentationDelta | DynamicsWorldModelDelta | ActionInterfaceDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SearchExecutionDelta",
  "change": "specific change to be applied",
  "scope": "single-task | session | project | system | training-corpus",
  "reversibility": "reversible | partially_reversible | irreversible",
  "verification": "how the delta is verified",
  "revocation_trigger": "when this delta should be reverted or revised"
}
```

### 10.4 Delta Types

| Delta type | Target mechanism | Typical change |
|---|---|---|
| SpecificationDelta | Specification / reward | Modify rubric, success criterion, evaluator, reward proxy, acceptance threshold. |
| ObservationDelta | Observation availability | Add data source, log, file, database query, clarification, timestamp, coverage record. |
| BeliefRepresentationDelta | Belief / representation | Add state table, schema graph, entity binding, timeline, memory slot, constraint extraction. |
| DynamicsWorldModelDelta | Dynamics / world model | Add execution feedback, tests, sandbox, backtest, predict-execute-compare loop. |
| ActionInterfaceDelta | Action / interface | Add tool, API, permission, action schema, rollback, retry path, human escalation. |
| CapabilitySupportDelta | Capability support | Add examples, RAG, expert module, domain operator, model specialization, curriculum item. |
| CapabilityRoutingDelta | Capability routing | Add mode switch, trigger rule, router boundary, role separation, applicability test. |
| SearchExecutionDelta | Search / execution | Add branching, backtracking, beam search, verifier calls, reranking, execution-guided search. |

---

## 11. Audit Engineering Integration

The bridge modifies the Audit Engineering loop.

The older loop is:

```text
Candidate artifact
  → audit
  → failure localization
  → control delta
  → regression guard
```

The bridged loop is:

```text
Candidate artifact
  → Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Minimal Intervention Probe
  → Control Delta
  → Regression Guard
  → Defect Ledger
  → State Transition or Training Item
```

This matters because the same primitive mismatch may require different repairs.

### 11.1 Example: Support Mismatch

A support mismatch may come from several mechanisms:

```text
capability_support:
  The model cannot produce the required structure under current capability.

capability_routing:
  The model can produce it, but the required capability does not activate.

search_execution:
  The candidate exists but search does not branch, preserve, or rank it.

action_interface:
  The candidate requires a tool or action not available to the system.

observation_availability:
  The candidate cannot be constructed because necessary evidence is missing.
```

The primitive diagnosis is the same. The control delta is different.

### 11.2 Example: Aggregation Mismatch

An aggregation mismatch may require:

```text
belief_representation repair:
  Build an intermediate dependency graph.

search_execution repair:
  Add global consistency checking or backtracking.

capability_routing repair:
  Activate an audit capability after local generation.

capability_support repair:
  Add support for structured composition.

world_model repair:
  Add execution feedback if composition depends on real environment consequences.
```

Again, the value symptom alone is not enough. Mechanism localization chooses the repair.

---

## 12. Object Model Integration

The Governed LLM Object Model should treat the following as canonical enums.

### 12.1 `mismatch_type`

```text
observation_representation
state
fitting_boundary
support
aggregation
specification
compound
unknown
```

This field belongs to the primitive-mismatch layer.

### 12.2 `repair_target`

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
```

This field belongs to the mechanism layer.

### 12.3 `repair_layer`

```text
agent
training
hybrid
unknown
```

This field belongs to the repair-layer selection system.

### 12.4 `repair_target_role`

```text
primary
amplifier
downstream
unknown
```

This field captures causal role within a compound failure chain.

### 12.5 Canonical Bridged Audit Finding

```json
{
  "id": "finding.sql.join_path_001",
  "artifact": "candidate SQL query",
  "finding": "The query uses a locally plausible join path that cannot produce the requested entity relation.",
  "evidence": "Execution result is empty; schema graph shows required relation through table X rather than table Y.",
  "mismatch_type": "aggregation",
  "repair_target": "belief_representation",
  "repair_target_role": "primary",
  "repair_layer": "agent",
  "mechanism_profile": "mechanism_profile.sql.join_path_001",
  "control_delta": "control_delta.add_schema_graph_join_constraint",
  "regression_guard": "regression_guard.join_path_relation_check",
  "confidence": "high"
}
```

### 12.6 Canonical Training-Promoted Finding

```json
{
  "id": "finding.router.boundary_017",
  "artifact": "multi-domain reasoning trace",
  "finding": "The model repeatedly fails to activate schema-audit mode when surface lexical overlap suggests a direct answer.",
  "evidence": "Observed across multiple databases and tasks; agent-level router rules repair the issue but must be reintroduced repeatedly.",
  "mismatch_type": "fitting_boundary",
  "repair_target": "capability_routing",
  "repair_target_role": "primary",
  "repair_layer": "training",
  "mechanism_profile": "mechanism_profile.router.schema_audit_undertrigger",
  "control_delta": "control_delta.runtime_router_patch",
  "recommended_training_item": "training_item.schema_audit_boundary_curriculum",
  "regression_guard": "regression_guard.schema_audit_trigger_minimal_pairs",
  "confidence": "medium"
}
```

---

## 13. SGAR as Governed Mechanism-Layer Transition

SGAR uses the transition contract:

```text
S + A → O → V → S'
```

The mechanism layer gives this contract a decision-system interpretation:

```text
S  = committed system/environment state
A  = action selected from A_sys
O  = observation generated through Ω/O
V  = verifier using R_eval, transition criteria, and governance rules
S' = committed next state
```

SGAR is therefore not merely an agent memory discipline. It is the hard-state governance layer over mechanism-level transitions.

### 13.1 Eight Mechanism Axes as Transition Failure Modes

Each mechanism axis can be interpreted as a way for a governed transition to fail.

| Mechanism axis | Transition failure |
|---|---|
| Specification / reward | `V` commits the wrong criterion or evaluates the wrong objective. |
| Observation availability | `O` lacks the evidence required to verify the transition. |
| Belief / representation | `S` or `S'` is represented incorrectly. |
| Dynamics / world model | The system predicts the wrong consequence of `A`. |
| Action / interface | The required `A` is not in `A_sys` or cannot be executed reliably. |
| Capability support | The system cannot propose a viable action or state update. |
| Capability routing | The capability required for the transition is not activated. |
| Search / execution | The transition path is not searched, executed, retried, or verified correctly. |

### 13.2 World Model and Action Interface in SGAR

World-model and action-interface failures are especially important in SGAR because they determine whether actions have real effects and whether those effects are observed and committed.

Examples:

```text
World-model mismatch:
  The agent predicts that a code patch fixes a bug, but tests fail.

Action-interface mismatch:
  The agent recommends a database inspection but has no executable database-query action.

SGAR repair:
  Add execution feedback, tool access, verifier gates, and transition rules so that claimed progress cannot be committed without observed effects.
```

### 13.3 Mechanism Repair as State Transition

Mechanism repairs themselves should become SGAR transitions.

```text
S:
  No SQL execution verifier exists.

A:
  Add execution verifier to the system.

O:
  Verifier runs candidate SQL and returns result sets or error traces.

V:
  Verifier output is reproducible and attached to audit findings.

S':
  SQL execution feedback is now an authorized observation and verification channel.
```

This prevents mechanism repairs from remaining merely narrative. A tool, verifier, router, rubric, or training item becomes authoritative only when committed through a state transition.

---

## 14. Representation-Induced Value Ceiling

The mechanism layer is also the natural home for a formal information-preservation claim.

### 14.1 Proposition: Representation-Induced Value Ceiling

Let `S` be a world state, `O` an observation, and `Z = ψ(O)` an operational representation. Let `Π_X` denote the class of policies restricted to information `X`, and let `V_X = \max_{\pi \in \Pi_X}\mathbb{E}[\text{utility} \mid \pi]`.

Then:

```text
V_S ≥ V_O ≥ V_Z
```

That is, the best policy with access only to `Z` cannot exceed the best policy with access to `O`, and the best policy with access only to `O` cannot exceed the best policy with access to `S`.

If there exist two utility-relevant states `s1` and `s2` that produce the same operational representation:

```text
Z(s1) = Z(s2)
```

and:

```text
argmax_a U(a | s1) ≠ argmax_a U(a | s2)
```

with positive probability, then the inequality is strict for the affected policy class.

### 14.2 Interpretation

The proposition states that downstream reasoning cannot reliably recover distinctions that were collapsed before representation.

This supports three design principles:

```text
1. Observation-representation repair precedes downstream reasoning repair.
2. State discrimination requires sufficient observation and representation.
3. More search, more critique, or more self-reflection over the same Z cannot eliminate a representation-induced ceiling.
```

This proposition is not a claim that richer representations are always worth their cost. It is a ceiling claim: once decisive distinctions are collapsed, downstream policies are bounded by the compressed representation.

---

## 15. Agent-Layer Governance and Training-Layer Repair

The bridge creates a training-side doctrine for governed LLM systems.

Current governance mechanisms are primarily inference-time:

```text
GKO
Audit Finding
Control Delta
Regression Guard
Defect Ledger
SGAR transition
```

These are agent-layer objects. They repair systems at runtime.

However, recurrent failures in learning components should not remain permanent runtime patches. They should be promoted into training-side repair.

### 15.1 Audit-to-Training Loop

The loop is:

```text
Agent-layer audit finds a failure
  → primitive mismatch diagnosis
  → mechanism profile
  → repair target is classified as system or learning component
  → system component: repair at agent layer
  → learning component: patch at agent layer if needed
  → recurrent learning-component defect enters defect ledger
  → defect ledger item becomes training curriculum / boundary data / reward correction
  → model improves
  → future governance burden decreases
```

This loop turns runtime failures into model improvement signals.

### 15.2 Promotion Criteria

A defect should be promoted to training when it is:

```text
recurrent
cross-task
capability-level
representation-level
world-model-level
router-level
reward/proxy-level
expensive to patch repeatedly
amenable to data or objective construction
```

A defect should remain at the agent layer when it is:

```text
one-off
task-specific
tool/interface-related
reversible
cheap to patch
primarily caused by missing observation or workflow design
not worth amortizing through training
```

### 15.3 Examples of Training Promotion

| Recurrent mechanism defect | Training-side repair |
|---|---|
| Belief/representation collapses important schema distinctions | Representation curriculum with schema-linking minimal pairs. |
| World model mispredicts execution consequences | Execution-grounded training with predict-execute-compare traces. |
| Capability support lacks rare SQL structures | Domain curriculum over low-support query patterns. |
| Capability routing under-triggers audit mode | Boundary training over trigger/non-trigger pairs. |
| Reward proxy misranks semantically wrong but fluent answers | Preference or reward-model correction with counterexamples. |

The doctrine is not that every learning-component defect must immediately be trained away. The doctrine is that recurrent learning-component failures should have a promotion path out of endless runtime patching.

---

## 16. Case Sketch: Text-to-SQL

Text-to-SQL illustrates the bridge because direct SQL generation can fail at multiple value-preservation stations and require different mechanism repairs.

### 16.1 Primitive Diagnosis

A failed SQL query may exhibit:

```text
observation-representation mismatch:
  relevant table, column, foreign key, or value did not enter the representation

state mismatch:
  the question depends on database contents or latent intent not resolved from surface text

fitting-boundary mismatch:
  schema-audit mode did not trigger; direct SQL template generation over-triggered

support mismatch:
  correct join path or nested query was not a live candidate

aggregation mismatch:
  SELECT, JOIN, WHERE, GROUP BY, HAVING clauses were locally plausible but globally inconsistent

specification mismatch:
  natural-language intent, benchmark criterion, execution result, and semantic correctness diverged
```

### 16.2 Mechanism Profile

A support mismatch in Text-to-SQL might have several mechanism profiles.

```text
Profile A:
  mismatch_type = support
  repair_target = capability_support
  repair_layer = training or hybrid
  interpretation = the model lacks support for a rare SQL pattern

Profile B:
  mismatch_type = support
  repair_target = capability_routing
  repair_layer = agent or training
  interpretation = the model has schema-audit capability but does not activate it

Profile C:
  mismatch_type = support
  repair_target = search_execution
  repair_layer = agent
  interpretation = the correct join path could be found through controlled search but direct generation prunes it

Profile D:
  mismatch_type = support
  repair_target = observation_availability
  repair_layer = agent
  interpretation = the relevant schema/value evidence was unavailable
```

The same primitive mismatch leads to different repairs.

### 16.3 Execution Feedback as Mechanism Repair

SQL execution feedback often repairs several mechanism axes at once:

```text
world_model:
  replaces guessed query consequences with actual execution results

search_execution:
  supports execution-guided branching and backtracking

specification_reward:
  provides a stronger verifier than fluency or self-confidence

belief_representation:
  helps update assumptions about schema, values, and predicate constraints

SGAR:
  prevents a query from being committed as solved until execution and semantic checks pass
```

This is why Text-to-SQL is a strong flagship case for the unified theory. It shows that high performance is not merely a product of better prompting; it is produced by moving from direct final-output generation to governed control-space search with mechanism-aware repair.

---

## 17. Compound Causal Chains

Many failures are chains rather than single-point defects.

### 17.1 Wrong Specification → Wrong Evidence → Wrong Routing → Narrowed Search

```text
specification_reward defect:
  The rubric rewards concise answers rather than verified answers.

observation_availability defect:
  The system does not request the missing evidence.

capability_routing defect:
  Audit mode does not trigger because the task appears simple.

search_execution defect:
  No branching or verification occurs.

primitive symptoms:
  specification mismatch + support mismatch + fitting-boundary mismatch
```

The repair may require a rubric delta, an observation delta, a router delta, and a search delta.

### 17.2 Unobservable State → Default Prior → Wrong World Model → Failed Action

```text
observation_availability defect:
  The system lacks the signal needed to distinguish states.

belief_representation defect:
  It collapses the state into a default assumption.

world_model defect:
  It predicts the wrong action consequence under the true state.

action_interface defect:
  It cannot query the environment to disambiguate.

primitive symptoms:
  observation-representation mismatch + state mismatch + aggregation mismatch
```

The repair may require channel repair, state representation, environment query access, and SGAR verification gates.

### 17.3 Missing Interface → Unverifiable Guess → False Completion

```text
action_interface defect:
  The system cannot execute or inspect the artifact.

search_execution defect:
  It cannot run the verifier.

specification_reward defect:
  It substitutes self-confidence for external verification.

SGAR failure:
  The system commits progress based on narrative rather than observed outcome.

primitive symptoms:
  support mismatch + specification mismatch + state transition failure
```

The repair requires adding the action interface, verifier, and commit rule.

---

## 18. Anti-Patterns

### 18.1 Treating Mechanism Names as Evidence

A mechanism label is not evidence. Saying “this is a routing problem” does not make routing the cause. The mechanism profile should cite evidence and, where possible, a minimal intervention probe.

### 18.2 Treating Six and Eight as Competing Taxonomies

The six primitive mismatches and eight mechanism axes answer different questions.

```text
Six: What kind of value failure occurred?
Eight: Which component should be repaired?
```

Collapsing them into one taxonomy makes both less useful.

### 18.3 Calling the Eight Axes Primitive Mismatches

The eight axes should not be called primitive value mismatches. They are mechanism axes, repair targets, or intervenable components.

### 18.4 Assuming Training Is Always the Correct Repair

A learning-component defect can often be patched at the agent layer. Training is justified when the defect is recurrent, cross-task, and amortizable.

### 18.5 Assuming Agent Governance Is Always Enough

If the same learning-component defect keeps recurring, agent-layer patches become a treadmill. The defect should be promoted into training-side repair.

### 18.6 Repairing the Symptom Rather Than the Mechanism

Increasing search budget may not repair support failure if routing suppresses the right capability. Adding a rubric may not repair specification failure if the relevant user preference was never observed. Adding examples may not repair action-interface absence.

### 18.7 Committing Mechanism Repairs as Narrative

A new tool, verifier, router, or rubric is not part of the system merely because the context says it is. It should be committed through SGAR as a hard-state transition.

---

## 19. Integration Requirements for the Theory Stack

This document implies several integration requirements across the governed-LLM document set.

### 19.1 Structural Theory (`structural-theory-value-preservation-llm-systems.md`)

Add a section after the six primitive mismatches:

```text
From Value-Preservation Diagnosis to Mechanism Localization
```

It should introduce:

```text
mismatch_type ∈ six
repair_target ∈ eight
repair_layer ∈ agent | training | hybrid
```

and include the compact crosswalk matrix.

### 19.2 Six Primitive Mismatches Taxonomy (`six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md`)

Add a section:

```text
Primitive Mismatch vs Mechanism Axis
```

Clarify:

```text
The relative completeness of the six primitive mismatches is a completeness claim over value-preservation diagnostic stations, not over all intervenable components of a closed-loop LLM system.
```

### 19.3 Formal Mechanism Layer (`formal-mechanism-layer-for-governed-llm-systems.md`)

The file should state:

```text
This document defines the intervention-localization layer orthogonal to the six primitive value-preservation mismatches.
```

Include learning/system/hybrid classification, minimal intervention probes, and the representation-induced value ceiling proposition.

### 19.4 Governed Object Model (`governed-llm-object-model-interface-specification.md`)

Canonicalize:

```text
mismatch_type = six-mismatch enum
repair_target = eight-mechanism enum
repair_layer = agent | training | hybrid
mechanism_profile = first-class object
```

### 19.5 Audit Engineering (`audit-engineering-failure-localization-control-space-writeback.md`)

Upgrade the loop:

```text
Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Minimal Intervention Probe
  → Control Delta
```

### 19.6 SGAR (`state-governed-agent-regime-for-governed-llm-systems.md`)

Add:

```text
SGAR as Governed Mechanism-Layer Transition
```

and explicitly connect `S + A → O → V → S'` to `A_sys`, observation channels, verifiers, world models, and committed state.

### 19.7 Mechanism-Driven Training (`mechanism-driven-training-for-governed-llm-systems.md`)

The dedicated document is:

```text
Mechanism-Driven Training for Governed LLM Systems
From Audit Findings to Training Curricula
```

It should define how recurrent learning-component failures move from defect ledger to training data, boundary curricula, reward correction, router training, and world-model grounding.

---

## 20. Compressed Statement

The six primitive mismatches and the eight mechanism axes are two orthogonal views of the same governed LLM system.

```text
Six primitive mismatches:
  diagnose where task value is lost.

Eight mechanism axes:
  localize which system component should be repaired.

mismatch_type:
  records the value-preservation diagnosis.

repair_target:
  records the intervenable mechanism.

repair_layer:
  decides whether the repair belongs at the agent layer, the training layer, or both.

Mechanism Profile:
  bridges audit findings to control deltas, regression guards, state transitions, and training items.
```

The bridge turns the theory stack into a closed loop:

```text
primitive mismatch diagnosis
  → mechanism localization
  → agent-layer repair or training-layer promotion
  → governed object update
  → SGAR commitment
  → defect-ledger accumulation
  → model improvement when recurrent learning defects justify training
```

The primitive-mismatch layer explains structure.  
The mechanism layer chooses the scalpel.  
The object model records the cut.  
Audit Engineering checks whether it worked.  
SGAR decides whether it becomes state.  
The training loop decides whether the scar should become learning.

---

## Appendix A: Canonical Enums

### A.1 Primitive Mismatch Enum

```text
observation_representation
state
fitting_boundary
support
aggregation
specification
compound
unknown
```

### A.2 Mechanism Axis Enum

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
```

### A.3 Repair Layer Enum

```text
agent
training
hybrid
unknown
```

### A.4 Mechanism Role Enum

```text
primary
amplifier
downstream
unknown
```

### A.5 Control Delta Type Enum

```text
SpecificationDelta
ObservationDelta
BeliefRepresentationDelta
DynamicsWorldModelDelta
ActionInterfaceDelta
CapabilitySupportDelta
CapabilityRoutingDelta
SearchExecutionDelta
```

---

## Appendix B: Minimal Intervention Probe Templates

### B.1 Specification / Reward Probe

```json
{
  "suspected_mechanism": "specification_reward",
  "probe": "Replace or refine the rubric while holding observations, representation, model, and search fixed.",
  "success_signal": "Previously misranked candidates are now ranked according to task utility.",
  "failure_signal": "Misranking persists despite objective repair."
}
```

### B.2 Observation Availability Probe

```json
{
  "suspected_mechanism": "observation_availability",
  "probe": "Add only the missing observation channel, evidence source, log, database field, or clarification.",
  "success_signal": "The system can now distinguish cases previously collapsed.",
  "failure_signal": "Failure persists even with the missing observation supplied."
}
```

### B.3 Belief / Representation Probe

```json
{
  "suspected_mechanism": "belief_representation",
  "probe": "Add a structured representation such as a state table, schema graph, timeline, binding table, or dependency graph.",
  "success_signal": "The failure is repaired without changing model weights, objective, or search budget.",
  "failure_signal": "The system still fails despite correct structure being represented."
}
```

### B.4 Dynamics / World Model Probe

```json
{
  "suspected_mechanism": "dynamics_world_model",
  "probe": "Add real execution feedback or a predict-execute-compare loop.",
  "success_signal": "Predicted consequences are corrected by environment feedback.",
  "failure_signal": "Execution feedback does not change the failure pattern."
}
```

### B.5 Action / Interface Probe

```json
{
  "suspected_mechanism": "action_interface",
  "probe": "Expose the missing tool, API, permission, action schema, rollback path, or human escalation action.",
  "success_signal": "The previously impossible repair or verification becomes executable.",
  "failure_signal": "The system still cannot repair despite the action being available."
}
```

### B.6 Capability Support Probe

```json
{
  "suspected_mechanism": "capability_support",
  "probe": "Add examples, a specialized operator, domain RAG, or a stronger model for the required capability.",
  "success_signal": "The required structure appears as a viable candidate.",
  "failure_signal": "The structure remains absent or unusable."
}
```

### B.7 Capability Routing Probe

```json
{
  "suspected_mechanism": "capability_routing",
  "probe": "Add a mode switch, router rule, trigger boundary, role separation, or applicability test.",
  "success_signal": "The correct capability activates in the target region and suppresses outside it.",
  "failure_signal": "The same over-triggering or under-triggering persists."
}
```

### B.8 Search / Execution Probe

```json
{
  "suspected_mechanism": "search_execution",
  "probe": "Add branching, backtracking, execution-guided search, independent verification, or candidate reranking.",
  "success_signal": "A previously missed or pruned candidate is found, verified, and preserved.",
  "failure_signal": "Search changes do not alter the failure."
}
```

---

## Appendix C: Minimal Object Bundle

A complete bridge-aware failure record should contain:

```json
{
  "audit_finding": {
    "id": "finding.example",
    "mismatch_type": "support",
    "repair_target": "capability_routing",
    "repair_layer": "hybrid",
    "repair_target_role": "primary",
    "mechanism_profile": "mechanism_profile.example",
    "control_delta": "control_delta.example",
    "regression_guard": "regression_guard.example"
  },
  "mechanism_profile": {
    "id": "mechanism_profile.example",
    "primary_mechanism": "capability_routing",
    "secondary_mechanisms": ["search_execution"],
    "minimal_intervention_probe": "Add explicit router trigger for audit mode on schema ambiguity.",
    "probe_result": "partially_resolved",
    "recommended_control_delta": "Add runtime router rule and trigger-boundary guard.",
    "recommended_training_item": "Boundary curriculum for schema-audit activation."
  },
  "control_delta": {
    "id": "control_delta.example",
    "target_mechanism": "capability_routing",
    "target_layer": "hybrid",
    "delta_type": "CapabilityRoutingDelta",
    "change": "Activate schema-audit mode when lexical overlap is high but join path is uncertain."
  },
  "regression_guard": {
    "id": "regression_guard.example",
    "guard": "Minimal-pair tasks where direct lexical answer is tempting but schema-audit is required must trigger audit mode."
  }
}
```

This bundle shows the purpose of the bridge. The primitive mismatch diagnosis explains the value failure. The mechanism profile identifies the repair target. The control delta changes the system. The regression guard gives the repair teeth. The training item prevents endless runtime patching when the defect recurs.
