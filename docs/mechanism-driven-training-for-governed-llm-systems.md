# Mechanism-Driven Training for Governed LLM Systems

## Training-Side Counterpart to Runtime Governance

**Working Draft v0.1**  
**Companion documents:**  
`structural-theory-value-preservation-llm-systems.md`  
`diagnostic-mechanism-bridge-for-governed-llm-systems.md`  
`formal-mechanism-layer-for-governed-llm-systems.md`  
`governed-llm-object-model-interface-specification.md`  
`audit-engineering-failure-localization-control-space-writeback.md`  
`state-governed-agent-regime-for-governed-llm-systems.md`

---

## Abstract

The current governed-LLM theory stack primarily describes **runtime governance**: Knowledge Governance, Audit Engineering, object-level control deltas, regression guards, and State-Governed Agent Regime all operate around a frozen model. They repair failures by changing the task representation, control objects, audit loops, routing rules, execution procedures, and committed state, without changing the model weights.

This leaves a training-side gap. When a recurring failure is caused by a **learned component** of the approximate LLM system—belief/representation `B_θ`, world model `T̂_θ`, capability support `π_θ`, capability routing `r_θ`, or learned reward/proxy `R̂_θ / R_proxy`—runtime governance can often patch the failure, but repeated patches become a treadmill. The system keeps paying inference-time cost for a defect that should be amortized into the model.

This document defines **Mechanism-Driven Training**: the training-side counterpart of runtime governance. Its central claim is that the same eight-axis mechanism diagnosis used for repair localization should also drive training intervention, but only after recurring failures have been operationalized through task-specific control objects and mechanism-aware evaluation. The difference is not the diagnosis alone; the difference is the **repair layer** and the operationalization threshold.

The canonical record is:

```text
mismatch_type ∈ six primitive value-preservation mismatches
control_object ∈ task-specific governed object
mechanism_axis ∈ eight intervention mechanism axes | unknown | not_operationalized
repair_layer ∈ agent | training | hybrid
```

Runtime governance repairs local, reversible, task-specific failures. Mechanism-driven training promotes recurrent, cross-task, operationalized learning-component failures from the Defect Ledger into training curricula, boundary data, grounding data, reward corrections, or capability-support data.

In one sentence:

> Runtime governance turns a failure into a revocable control object; mechanism-driven training turns recurrent learning-component failures into amortized training signal.

---

## 1. Position in the Unified Theory Stack

Mechanism-Driven Training does not add a new primitive mismatch and does not replace the six-mismatch taxonomy. It occupies the training-side branch of the Diagnostic–Mechanism Bridge.

```text
Six Primitive Mismatches:
  diagnose where task value failed to survive the value-preservation pipeline.

Eight Mechanism Axes:
  localize which system component should be changed.

Mechanism-Driven Training:
  handles the subset of mechanism failures whose learned component is operationalized enough
  that recurrence justifies amortizing the repair into model training.
```

The six primitive mismatches answer:

```text
Why did value fail?
Where in the value-preservation pipeline did the failure surface?
```

The eight mechanism axes answer:

```text
Which component caused or amplified the failure?
Which mechanism axis is implicated after the task object is known?
```

Mechanism-driven training answers:

```text
When the mechanism axis is a learned component and the failure family is operationalized,
should this failure remain a runtime patch or be promoted into training?
```

---

## 2. Scope: Learned Components vs System Components

The Formal Mechanism Layer decomposes a governed LLM system into an environment and an approximate system:

```text
E = (S, A, T, R*, Ω, O, γ)

M_θ = (R̂_θ, Ω_sys, B_θ, T̂_θ, A_sys, π_θ, r_θ, D)
```

`Ω_sys` belongs to `M_θ` rather than `E`: `Ω` and `O` describe what the environment can in principle reveal, while `Ω_sys` denotes which observation channels are actually exposed to the deployed system.

Mechanism-driven training does not target "all learned things" indiscriminately. It primarily concerns five mechanism axes with learned-side components:

```text
belief_representation   -> B_θ
dynamics_world_model    -> T̂_θ
capability_support      -> π_θ
capability_routing      -> r_θ
specification_reward    -> R̂_θ and, where relevant, R_proxy
```

The pure system-side axes are:

```text
observation_availability  -> Ω_sys and observation access policy
action_interface          -> A_sys
search_execution          -> D
```

Those system components are repaired through agent-layer governance: observation repair, tool access, interface change, execution search, verifier design, GKO updates, SGAR transition rules, and audit loops.

The five hybrid axes are exactly:

```text
specification_reward
belief_representation
dynamics_world_model
capability_support
capability_routing
```

These axes have both training-side and runtime-side components:

| Mechanism axis | Training-side component | Runtime-side component |
|---|---|---|
| `specification_reward` | `R̂_θ`, reward model, learned proxy | rubric, evaluator, verifier, acceptance criterion |
| `belief_representation` | internal representation and state induction | external state table, schema, memory object, GKO |
| `dynamics_world_model` | learned prediction of consequences | execution feedback, sandbox, simulator, verifier |
| `capability_support` | probability mass for structures/operators | RAG, examples, specialist operators, tools |
| `capability_routing` | learned trigger boundary | explicit router, mode switch, role binding |

The layer-selection rule is:

```text
Local, reversible, task-specific failure:
  repair at the agent layer.

Recurrent, cross-task, amortizable learned-component failure:
  promote to training-layer repair.

Mixed case:
  use hybrid repair: runtime governance now, training promotion if recurrence persists.
```

---

## 3. Core Principle: Train the Mechanism, Not the Symptom

A surface error is rarely a sufficient training target. The same wrong output may arise from missing observation, bad representation, wrong state, weak support, wrong routing, poor search, or objective mismatch.

Mechanism-driven training therefore follows this discipline:

```text
surface failure
  → primitive mismatch diagnosis
  → task-specific control object
  → mechanism profile
  → learned-component or system-component split
  → if learned-component and recurrent:
       select mechanism-specific training intervention
  → run mechanism eval and boundary regression
```

The rule is:

> Do not train the symptom. Train the operationalized mechanism failure family that made the symptom recur.

Examples:

```text
Do not SFT final answers to repair a state-binding failure.
Train or supervise state representation.

Do not add generic data to repair a routing failure.
Train positive and negative trigger boundaries.

Do not train fluent explanations to repair a world-model failure.
Train predict-execute-compare grounding.

Do not train SQL strings to repair value grounding.
Train schema linking, value binding, and execution-grounded correction.

Do not train a single rubric into the model to repair Goodhart failure.
Train counterexample ranking and proxy-risk discrimination.
```

---

## 4. Learned Component → Training Intervention Map

This section defines the training-side counterpart for each learned mechanism axis.

---

### 4.1 `B_θ`: Belief / Representation Training

#### Target

Train the model to convert available information into operational state:

```text
parse
bind
compress
maintain
retrieve
compare
update
```

The goal is not merely to expose information in the prompt. The goal is to make the information usable as internal or externalized task state.

#### Typical source findings

Mechanism profiles with:

```text
mechanism_axis = belief_representation
repair_layer = training | hybrid
```

Often surface as:

```text
observation_representation mismatch
state mismatch
aggregation mismatch
specification mismatch amplified by forgotten constraints
```

Typical findings:

```text
information is present but not used
entity binding is wrong
unit/time/role binding is lost
schema column is visible but not linked
constraint appears in context but is omitted from the plan
long-range dependency is not maintained
state table is inconsistent across steps
```

#### Training interventions

```text
state extraction supervision
constraint extraction supervision
entity/time/unit binding data
schema-linking supervision
value-linking supervision
process supervision over intermediate state
auxiliary representation loss
memory update supervision
known/unknown/assumption table training
```

#### Mechanism eval

```text
held-out state extraction probes
schema-linking probes
constraint recall / constraint application probes
entity and temporal binding probes
long-context state retention tests
```

#### Side effects

```text
over-structuring open-ended tasks
template forcing where flexible interpretation is needed
false precision over ambiguous information
reduced creative exploration
```

#### Boundary regression

After representation training, test neighboring tasks where strict structure should not be over-triggered:

```text
open-ended ideation
ambiguous user intent
non-tabular writing
creative synthesis
multi-perspective analysis
```

---

### 4.2 `T̂_θ`: Dynamics / World-Model Training

#### Target

Train the model's prediction of action consequences to align with real environment transitions:

```text
T̂_θ(s_{t+1} | s_t, a_t) ≈ T(s_{t+1} | s_t, a_t)
```

This is crucial when the system acts in code, SQL, browsers, APIs, tools, markets, workflows, or other environments where language priors are insufficient.

#### Typical source findings

Mechanism profiles with:

```text
mechanism_axis = dynamics_world_model
repair_layer = training | hybrid
```

Typical findings:

```text
model predicts code will compile but it fails
model invents API behavior
model predicts SQL result shape incorrectly
model underestimates error propagation
model assumes tool effects that do not occur
model narrates completion without environmental change
plan relies on invalid state transition
```

#### Training interventions

```text
predict → execute → compare → correct traces
execution-grounded correction data
tool-result supervision
API behavior grounding
compiler/test feedback training
environment interaction trajectories
simulator-grounded training
calibration data for consequence prediction
RL or preference training with verified environment feedback
```

#### Mechanism eval

```text
predict-execute-compare accuracy
pre-execution outcome prediction
tool-call consequence prediction
API behavior prediction
compile/test outcome prediction
SQL result-shape prediction
multi-step error propagation prediction
```

#### Side effects

```text
overfitting to one execution environment
incorrect generalization from sandbox quirks
excessive conservatism after failure-heavy data
environment-specific assumptions leaking into unrelated tasks
```

#### Boundary regression

Run tests across environment variants:

```text
different API versions
different database schemas
different compilers/interpreters
different browser/tool states
different execution limits
different market or simulation regimes
```

---

### 4.3 `π_θ`: Capability Support Training

#### Target

Increase the probability mass and reachability of high-value structures under fixed or modest inference budgets.

The question is:

```text
Can the model produce the required operator, structure, proof move, join pattern, program pattern, or workflow at all?
```

#### Typical source findings

Mechanism profiles with:

```text
mechanism_axis = capability_support
repair_layer = training | hybrid
```

Typical findings:

```text
many samples never contain the correct structure
correct structure appears only after expert demonstration
model lacks rare join paths or nested query forms
model never proposes necessary proof strategy
model cannot generate domain-specific operator
model produces generic alternatives but not the high-value candidate
```

#### Training interventions

```text
SFT on rare correct structures
curriculum from easy to hard variants
expert / programmatic operator distillation
long-tail data augmentation
counterfactual support data
specialist data for under-supported capabilities
decomposition traces showing how rare structures are constructed
```

#### Mechanism eval

```text
fixed-budget pass@k for target structures
structure-presence rate
operator recall
rare-pattern recall
candidate diversity conditioned on correctness
support lift under held-out schemas/domains
```

#### Side effects

```text
raising long-tail structures may distort common-case priors
negative transfer to simpler tasks
overuse of specialized operators
spurious pattern memorization
increased false positives under weak routing
```

#### Boundary regression

Capability-support training must be paired with routing tests. A structure that becomes easier to generate can also become easier to over-trigger.

```text
positive support eval:
  can the model produce the structure when needed?

negative boundary eval:
  does the model avoid the structure when inappropriate?
```

---

### 4.4 `r_θ`: Capability Routing Training

#### Target

Correct the trigger boundary of learned capabilities.

Let:

```text
T_X = true applicability domain of capability X
M_X = model-activated domain of capability X
```

Routing training aims to reduce:

```text
over-triggering:  M_X \ T_X
under-triggering: T_X \ M_X
```

#### Typical source findings

Mechanism profiles with:

```text
mechanism_axis = capability_routing
repair_layer = training | hybrid
```

Typical findings:

```text
capability appears under another prompt but not in the target setting
expert role triggers correct behavior but default mode does not
template reasoning is over-triggered
schema audit is under-triggered
tool use is under-triggered
safety refusal or caution is over-triggered
direct answer mode suppresses needed search mode
```

#### Training interventions

```text
positive and negative trigger-boundary data
mode-labeled examples
hard negatives from M_X \ T_X
hard positives from T_X \ M_X
preference data over activate/suppress decisions
router calibration data
contrastive capability selection
role-binding and mode-switch supervision
```

#### Mechanism eval

```text
capability-boundary confusion matrix:

TP: capability triggered when appropriate
FP: capability triggered when inappropriate
FN: capability not triggered when needed
TN: capability suppressed when inappropriate
```

Evaluate both sides:

```text
over-trigger regression
under-trigger regression
neighboring task boundary tests
mode-selection accuracy
```

#### Side effects

```text
tightening over-triggering may create under-triggering
boosting under-triggering may create over-triggering
new capability labels may become superficial style markers
router may learn prompt artifacts instead of task conditions
```

#### Boundary regression

Routing training always requires paired positive and negative boundary tests. One-sided routing evals are invalid.

---

### 4.5 `R̂_θ / R_proxy`: Reward / Proxy Training

#### Target

Improve the learned or trainable objective so that candidate ranking aligns with true task utility rather than a brittle proxy.

Formally, reduce cases where:

```text
rank_R̂(Y1, Y2) ≠ rank_U(Y1, Y2)
```

#### Typical source findings

Mechanism profiles with:

```text
mechanism_axis = specification_reward
repair_layer = training | hybrid
```

Typical findings:

```text
generator and evaluator share the same false assumption
reward model consistently selects fluent but wrong answers
rubric overweights visible style and underweights hidden correctness
execution success is rewarded despite semantic error
model optimizes benchmark proxy while missing task intent
preference model misranks counterexample pairs
```

#### Training interventions

```text
counterexample preference pairs
anti-Goodhart hard negatives
reward-model correction data
rubric-to-preference conversion
multi-rubric calibration
proxy-risk labels
semantic correctness vs surface compliance comparisons
evaluator disagreement data
```

#### Mechanism eval

```text
counterexample-pair ranking
proxy-overoptimization tests
semantic-vs-surface ranking tests
multi-rubric robustness
reward-model calibration
human/expert agreement on hard pairs
```

#### Side effects

```text
overfitting to one rubric
overcorrecting against legitimate proxy use
reward conservatism
reward hacking under new proxies
style/value entanglement
```

#### Boundary regression

Evaluate across multiple rubrics and task families. A reward repair that only fixes one benchmark artifact may create a new specification mismatch elsewhere.

---

## 5. Agent-Layer Governance vs Training-Layer Repair

The same mechanism failure may have two repair routes:

| Repair route | Properties | Typical tools |
|---|---|---|
| Agent-layer governance | fast, local, reversible, task-specific | GKO, explicit router, tool access, audit loop, execution feedback, control-space search |
| Training-layer repair | slower, global, persistent, amortized | SFT, preference data, curriculum, grounding traces, reward correction, router training |
| Hybrid | runtime patch now, training promotion if recurrence persists | defect ledger, mechanism profile, temporary GKO, later training item |

Mechanism-driven training should not be the default first response. The default should be:

```text
repair locally when local repair is sufficient
promote only when recurrence makes runtime repair a treadmill
```

Mechanism-driven training never trains an abstract mechanism name directly. It trains operationalized failure families extracted from governed task objects, defect-ledger evidence, mechanism evals, and boundary regressions.

A training intervention is justified when the defect is:

```text
learning-component based
recurrent
cross-task
expensive to patch at runtime
representable as training data or objective correction
measurable by a teeth-proven mechanism eval
safe under boundary regression
```

---

## 6. Promotion Ratchet: From Audit Finding to Training Signal

Mechanism-driven training extends Audit Engineering from runtime write-back into training-side write-back.

### 6.1 Closed Loop

```text
agent-layer audit finding
  → primitive mismatch diagnosis
  → task-specific control object
  → mechanism profile
  → mechanism_axis ∈ eight mechanism axes
  → repair_layer ∈ agent | training | hybrid
  → if system component:
       repair through agent-layer governance
  → if learned component and recurrent:
       record in defect ledger
       promote to mechanism-labeled training item
  → train
  → run mechanism eval + boundary regression
  → redeploy
  → retire or weaken corresponding runtime patches when safe
```

### 6.2 Promotion Conditions

A finding should be promoted to training only if all of the following hold:

```text
1. repair_layer is training or hybrid.
2. mechanism_axis is a learned component:
     belief_representation
     dynamics_world_model
     capability_support
     capability_routing
     specification_reward
3. the failure family is operationalized through a task-specific control object.
4. recurrence_count exceeds threshold.
5. recurrence appears across tasks, schemas, users, or environments.
6. agent-layer patching is repetitive or expensive.
7. a mechanism-specific held-out eval can be constructed.
8. boundary regression risk is acceptable.
```

### 6.3 Rejection Conditions

Do not promote to training when:

```text
the defect is one-off
the defect is caused by missing observation
the defect is caused by unavailable action interface
the defect is caused by search/execution configuration
the defect is caused by a runtime rubric or verifier
there is no teeth-proven mechanism eval
the training data would encode a local patch as a global behavior
boundary regression risk exceeds expected recurrence reduction
```

---

## 7. Object Model Integration

Mechanism-driven training does not require a new family of governance objects. It reuses the existing object model with training-layer fields.

### 7.1 Audit Finding

An Audit Finding should include:

```json
{
  "mismatch_type": "observation_representation | state | fitting_boundary | support | aggregation | specification | compound | unknown",
  "control_object_ref": "object.id",
  "control_object_type": "sql_dag | claim_evidence_map | state_table | router_rule | rubric | other",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "repair_layer": "agent | training | hybrid | unknown",
  "mechanism_role": "primary | amplifier | downstream | unknown",
  "mechanism_profile_ref": "mechanism_profile.id"
}
```

### 7.2 Mechanism Profile

A Mechanism Profile should distinguish system mechanisms from learned mechanisms:

```json
{
  "id": "mechanism_profile.example",
  "primary_mechanisms": ["capability_routing"],
  "secondary_mechanisms": ["capability_support"],
  "recommended_repair_layer": "hybrid",
  "training_promotion_candidate": true,
  "promotion_reason": "Repeated under-triggering of schema audit across unrelated schemas.",
  "mechanism_eval_ref": "eval.capability_routing.schema_audit_boundary",
  "boundary_regression_refs": [
    "eval.capability_routing.direct_sql_when_safe",
    "eval.capability_routing.avoid_unneeded_schema_search"
  ]
}
```

### 7.3 Control Delta

A Control Delta with `target_layer = training` is a **training delta**. Its target is not a GKO but a training artifact: curriculum item, boundary set, grounding trace, preference pair, reward correction, or eval.

```json
{
  "id": "delta.training.capability_routing.schema_audit",
  "object_kind": "control_delta",
  "target_mechanism": "capability_routing",
  "target_layer": "training",
  "delta_class": "CapabilityRoutingDelta",
  "operation": "promote_defect_family_to_training_curriculum",
  "source_finding_refs": ["finding.schema_audit_undertrigger.001"],
  "source_mechanism_profile_refs": ["mechanism_profile.schema_audit_undertrigger"],
  "training_artifact_refs": [
    "training_item.schema_audit_positive_boundary",
    "training_item.schema_audit_negative_boundary"
  ],
  "mechanism_eval_refs": ["eval.schema_audit_boundary_confusion_matrix"],
  "boundary_regression_refs": ["eval.direct_sql_safe_cases"]
}
```

### 7.4 Defect Ledger

The Defect Ledger should track promotion state:

```json
{
  "id": "defect_family.schema_audit_undertrigger",
  "recurrence_count": 37,
  "mechanism_axis": "capability_routing",
  "repair_layer": "hybrid",
  "promoted_to_training": true,
  "training_corpus_refs": ["corpus.schema_audit_boundary_v1"],
  "mechanism_eval_refs": ["eval.schema_audit_boundary_v1"],
  "governance_debt_refs": ["gko.runtime_schema_audit_trigger"],
  "retirement_condition": "Runtime GKO can be weakened after boundary eval passes for two releases."
}
```

### 7.5 Regression Guard → Mechanism Eval

A teeth-proven regression guard becomes a mechanism eval when the defect is promoted to training.

```text
Belief / representation:
  held-out state extraction and binding probes.

World model:
  predict-execute-compare eval.

Capability support:
  fixed-budget pass@k / structure-recall eval.

Capability routing:
  boundary confusion matrix.

Reward / proxy:
  counterexample-pair ranking eval.
```

The same teeth rule applies:

> If reintroducing the representative defect does not make the mechanism eval fail, the eval is theater.

---

## 8. Training Side Effects and Boundary Governance

Training changes shared model behavior. It can repair one mechanism while damaging another. The most common side effect is a new fitting-boundary mismatch.

Examples:

```text
Capability support training:
  makes a rare operator available but causes overuse.

Routing training:
  reduces over-triggering but increases under-triggering.

World-model grounding:
  improves one execution environment but overfits another.

Reward training:
  fixes one proxy failure but creates rubric overfitting.

Representation training:
  improves structured extraction but over-structures open tasks.
```

Therefore every mechanism-driven training intervention requires boundary governance.

### 8.1 Required Release Gates

A training intervention should not be released unless it passes:

```text
1. mechanism-localized eval
2. neighborhood boundary regression
3. negative-transfer scan
4. representative defect re-injection
5. runtime governance compatibility check
```

### 8.2 Boundary Regression by Mechanism

| Training target | Required boundary regression |
|---|---|
| `belief_representation` | open tasks where strict schema should not be imposed |
| `dynamics_world_model` | alternate environments and tool versions |
| `capability_support` | cases where the newly supported operator is inappropriate |
| `capability_routing` | both over-trigger and under-trigger boundary sets |
| `specification_reward` | alternative rubrics and anti-Goodhart pairs |

### 8.3 No Training Without Teeth

A training intervention without a mechanism eval and boundary regression is not mechanism-driven training. It is training theater.

---

## 9. When Not to Train

Mechanism-driven training should be selective.

Do not train when:

```text
the mechanism failure is a system component:
  observation_availability
  action_interface
  search_execution
  runtime rubric / verifier

the failure is one-off or task-specific

a runtime patch is cheaper and safer

the defect cannot be represented as training data or objective correction

there is no held-out mechanism eval

boundary regression predicts negative transfer

the proposed training would encode a temporary user preference as global model behavior

the issue is better solved by tool access, observation repair, verifier design, or SGAR state commitment
```

Training is high-cost, persistent, and difficult to revoke. Runtime governance remains the appropriate repair layer for local, reversible, task-specific issues.

---

## 10. Text-to-SQL / BIRD as a Mechanism-Driven Training Case

Text-to-SQL naturally spans both runtime governance and training-side repair.

At runtime, a governed system may use:

```text
schema extraction
value linking
join-path search
predicate skeletons
execution feedback
audit findings
control deltas
stateful repair
```

These are agent-layer governance mechanisms.

When failures recur across schemas or query families, the same findings can be promoted to training.

| Learned component | Text-to-SQL training intervention | Mechanism eval |
|---|---|---|
| `B_θ` belief / representation | schema-linking and value-binding supervision | held-out schema/value linking |
| `T̂_θ` world model | execution-grounded predict-run-correct data | result-shape and error prediction |
| `π_θ` capability support | rare join paths, nested queries, conditional aggregation curriculum | fixed-budget pass@k on target structures |
| `r_θ` capability routing | when to trigger schema search vs direct SQL | routing boundary confusion matrix |
| `R̂_θ / R_proxy` reward | reward semantic correctness, not mere executability | counterexample pairs where executable SQL is semantically wrong |

The theoretical point is not to recommend additional experiments. It is to describe how existing runtime failures can be read as training-side signals when they are recurrent, learning-component based, and measurable.

Execution feedback is especially important because it plays three roles:

```text
runtime verifier
world-model grounding signal
mechanism eval for training promotion
```

---

## 11. Metrics for Mechanism-Driven Training

The success criterion is not generic benchmark improvement alone. The target is reduction of recurrent learned-component defects without unacceptable boundary damage.

| Metric | Meaning |
|---|---|
| Mechanism-localized eval score | held-out performance on the targeted learned component |
| Promotion precision | fraction of promoted defect families whose recurrence decreases after training |
| Recurrence-after-training | rate of the same mechanism failure after deployment |
| Negative-transfer rate | number or severity of new boundary regressions introduced |
| Governance-debt reduction | runtime patches retired or weakened after training |
| Amortization ratio | saved runtime governance cost divided by training cost |
| Boundary stability | no new over-trigger / under-trigger failures in neighboring tasks |
| Eval teeth rate | fraction of mechanism evals that fail when representative defects are reintroduced |

The desired outcome:

```text
recurrent learning-component bottleneck decreases
runtime governance burden decreases
neighboring capability boundaries remain stable
```

---

## 12. Self-Audit GKO

The core claim of mechanism-driven training can be represented as a governed theoretical object:

```json
{
  "id": "gko.mechanism_driven_training.core",
  "type": "theoretical_claim",
  "condition": "A failure is caused by a recurrent learned-component mechanism defect in B_theta, T_hat_theta, pi_theta, r_theta, or R_hat_theta / R_proxy.",
  "assertion": "Mechanism-localized training can amortize recurrent learned-component failures that would otherwise require repeated agent-layer governance, provided that the training intervention has a teeth-proven mechanism eval and boundary regression.",
  "strength": "structural-relative",
  "support_scope": "recurrent, cross-task, learning-component failures with constructible mechanism evals",
  "revocation_trigger": [
    "agent-layer repair remains cheaper and safer than training",
    "training introduces more negative transfer than recurrence reduction",
    "no mechanism eval can be constructed",
    "the defect is actually caused by a system component rather than a learned component"
  ],
  "not_supported_claims": [
    "does not claim training can repair missing observations, missing action interfaces, or runtime search failures",
    "does not claim bigger models or more generic training are universal repairs",
    "does not claim training eliminates the need for runtime governance",
    "does not claim one-off task-specific failures should be promoted to training"
  ]
}
```

---

## 13. Failure Modes of Mechanism-Driven Training

Mechanism-driven training can itself fail.

### 13.1 Symptom Training

The training data imitates corrected outputs without training the mechanism that caused the failure.

```text
surface output improves on seen cases
mechanism eval does not improve
recurrence persists under distribution shift
```

### 13.2 Wrong-Mechanism Training

A failure caused by routing is trained as capability support, or a failure caused by representation is trained as final-answer SFT.

```text
training appears to help locally
new boundary failures appear
root defect remains
```

### 13.3 Training Theater

The training intervention has no teeth-proven mechanism eval.

```text
model is trained
benchmark may move
but representative defect re-injection does not fail any eval
```

### 13.4 Governance-Debt Transfer

A runtime patch is removed too early after training.

```text
training partially improves behavior
governance object is retired
failure returns in edge cases
```

### 13.5 Boundary Spillover

A newly trained capability becomes over-triggered outside its support scope.

```text
target defect decreases
neighboring tasks degrade
new fitting-boundary mismatch appears
```

### 13.6 Reward Overfitting

Reward correction overfits the visible rubric and creates a new proxy objective.

```text
old Goodhart failure fixed
new Goodhart failure introduced
```

---

## 14. Compressed Doctrine

```text
Six primitive mismatches:
  diagnose value-preservation failure.

Eight mechanism axes:
  localize the repair component.

Runtime governance:
  repairs local, reversible, task-specific failures around a frozen model.

Mechanism-driven training:
  amortizes recurrent, cross-task, learned-component failures into the model.

Defect Ledger:
  decides when repeated runtime findings become training candidates.

Mechanism eval:
  proves whether the targeted learned component improved.

Boundary regression:
  prevents the repair from creating new fitting-boundary failures.
```

In one sentence:

> Agent-layer governance handles how not to fail this time; mechanism-driven training handles how not to keep failing this way.

---

## Appendix A: Learning-Component Training Cards

```text
B_θ  belief / representation
  Target: information → operational state
  Signal: information present but misused
  Intervention: state/process supervision, binding data, schema-linking
  Eval: state extraction and binding probes
  Risk: over-structuring open tasks

T̂_θ dynamics / world model
  Target: predicted consequences align with real transitions
  Signal: prediction ≠ execution / environment result
  Intervention: execution-grounded predict-run-correct data
  Eval: predict-execute-compare accuracy
  Risk: environment overfitting

π_θ capability support
  Target: raise probability mass of correct structures
  Signal: fixed-budget sampling lacks required candidate
  Intervention: curriculum, rare-structure SFT, expert/operator distillation
  Eval: fixed-budget pass@k / structure recall
  Risk: negative transfer and overuse of rare operators

r_θ capability routing
  Target: correct over-trigger and under-trigger boundaries
  Signal: capability appears elsewhere but not here, or appears when inappropriate
  Intervention: contrastive boundary data, mode-labeled data, hard positives/negatives
  Eval: boundary confusion matrix
  Risk: over-trigger / under-trigger seesaw

R̂_θ / R_proxy reward side
  Target: proxy ranking aligns with true utility
  Signal: evaluator stably selects wrong candidate
  Intervention: counterexample preference pairs, anti-Goodhart hard negatives
  Eval: counterexample-pair ranking
  Risk: reward overfitting to a single rubric
```

---

## Appendix B: Training Promotion Checklist

A defect family can be promoted to training only if the answer to every item is yes:

```text
[ ] Is the mechanism axis a learned component?
[ ] Is there a governed task object that makes the failure family reproducible and auditable?
[ ] Is the defect recurrent?
[ ] Does recurrence appear across tasks, schemas, users, or environments?
[ ] Is runtime patching becoming a treadmill?
[ ] Can the defect be represented as training data, boundary data, grounding trace, or reward correction?
[ ] Is there a teeth-proven mechanism eval?
[ ] Does representative defect re-injection fail the eval?
[ ] Is boundary regression available?
[ ] Is expected recurrence reduction greater than expected negative transfer?
[ ] Is there a plan for retiring or weakening runtime governance only after training succeeds?
```

If any item fails, use agent-layer governance instead.

---

## Appendix C: Training Delta Template

```json
{
  "id": "delta.training.unique_identifier",
  "object_kind": "control_delta",
  "target_mechanism": "belief_representation | dynamics_world_model | capability_support | capability_routing | specification_reward",
  "target_layer": "training",
  "delta_class": "BeliefRepresentationDelta | DynamicsWorldModelDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SpecificationDelta",
  "operation": "promote_defect_family_to_training",
  "source_defect_family_ref": "defect_family.id",
  "source_finding_refs": ["finding.id"],
  "source_mechanism_profile_refs": ["mechanism_profile.id"],
  "training_artifact_refs": ["training_item.id"],
  "mechanism_eval_refs": ["eval.id"],
  "boundary_regression_refs": ["eval.boundary.id"],
  "promotion_criteria": {
    "recurrence_threshold_met": true,
    "cross_task": true,
    "learning_component": true,
    "runtime_treadmill": true,
    "teeth_proven_eval": true
  },
  "release_gate": {
    "mechanism_eval_passed": false,
    "boundary_regression_passed": false,
    "negative_transfer_acceptable": false,
    "runtime_patch_retirement_allowed": false
  },
  "revocation_trigger": "If training fails mechanism eval, causes unacceptable boundary regression, or does not reduce recurrence."
}
```
