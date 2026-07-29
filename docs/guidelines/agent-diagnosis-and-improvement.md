# Agent Diagnosis and Improvement

Status: first-wave operating guideline

Primary mode: evaluation-gated system change

Foundation: [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)

Chinese: [Agent 诊断与改进](./agent-diagnosis-and-improvement.zh-CN.md)

Related theory:

- [Diagnostic–Mechanism Bridge](../diagnostic-mechanism-bridge-for-governed-llm-systems.md)
- [State-Governed Agent Regime](../state-governed-agent-regime-for-governed-llm-systems.md)
- [Aggregation Mismatch: Theoretical Claims and Agent Engineering](../aggregation-mismatch-theoretical-claims-agent-engineering.md)

## 1. Outcome

Improving an agent means changing the earliest failing system layer and demonstrating
the improvement on frozen evidence without degrading safety, cost, or unaffected tasks.

```text
failure corpus and baseline
→ failure-layer localization
→ mechanism hypothesis
→ smallest layer-correct intervention
→ offline implementation gate
→ paired evaluation
→ shadow/canary decision
→ governed rollout or rejection
```

The target is not “a better prompt.” The target is a better governed system.

## 2. Define the Agent as a System

Map:

```text
observation/retrieval
→ context representation
→ specification/policy
→ planning
→ routing/scheduling
→ model generation
→ tool interface/compiler
→ executor/environment
→ verifier
→ commit/recovery
→ memory/write-back
```

For each layer record:

- owner;
- input/output contract;
- authoritative state;
- version;
- failure evidence;
- available verifier;
- side effects and rollback.

Do not attribute every output failure to the model. The model may have produced a correct
semantic plan that was lost in physical addressing, tool compilation, execution, or
verification.

## 3. Freeze a Baseline

Before changing the agent, freeze:

```text
task corpus and split
model/client/version
prompts and tool schemas
runtime configuration
budgets and timeouts
seed/sampling policy
environment and dependency versions
success endpoint
failure taxonomy
token/latency/turn telemetry
unsafe and collateral endpoints
```

Store event-level evidence when possible:

```text
observed state
plan
tool payload
executor verdict
verifier receipt
commit/rollback
terminal state
```

Do not compare a new system against a baseline whose model, budget, task set, or success
definition changed silently.

## 4. Localize the Earliest Failing Layer

| Failure layer | Diagnostic question | Typical intervention |
|---|---|---|
| Observation | Did decisive state enter the system? | Retrieval, sensor, reread, freshness |
| Representation | Was state encoded in an actionable form? | Structured context, derived feature, semantic ID |
| Specification | Does the objective match the real task? | Acceptance contract, counterexamples, policy |
| Planning | Is the semantic target/value/dependency correct? | Plan schema, evidence gate, planner |
| Routing | Was the right capability/tool/path selected? | Router, readiness, risk/cost policy |
| Generation | Is uncertain semantic synthesis failing? | Prompt, examples, model, decomposition |
| Compilation/interface | Did a correct plan become valid operations? | Deterministic compiler, typed tools |
| State/executor | Was current authoritative state used atomically? | Hard state, preconditions, transactions |
| Verification | Is correct work rejected or wrong work accepted? | Semantic verifier, coverage, canonicalization |
| Recovery | Does failure feedback enable a better next action? | Located receipt, rebind, replan, escalation |
| Memory/write-back | Is unreliable experience being promoted? | GKO lifecycle, provenance, promotion gates |

Change the earliest causal layer. A downstream workaround may hide the symptom while
preserving the mechanism.

## 5. Choose the Intervention

### 5.1 Prompt or Context

Use when the failure is genuinely in interpretation or uncertain generation and the
required information is already available.

Require:

- explicit information delta;
- no leakage of expected outputs;
- bounded context size;
- paired evaluation;
- checks for fitting-boundary regressions.

Do not add more prose when the missing capability is state authority, scheduling,
physical addressing, deterministic transformation, or commit safety.

### 5.2 Tool Contract or Compiler

Use when semantic intent is correct but model-authored physical operations fail.

Prefer:

```text
stable semantic IDs
typed operations
runtime resolution of current physical state
deterministic compilation
preconditions and payload hashes
atomic executor
```

Offline property and mutation tests must precede model evaluation.

### 5.3 State, Memory, or Checkpoint

Use when failures involve stale evidence, hidden progress, replay, lost decisions, or
cross-turn inconsistency.

Establish:

- authoritative state owner;
- version/hash and freshness;
- plan and candidate lineage;
- append-only events;
- terminal and orphan semantics;
- resume and replay behavior;
- promotion criteria for long-term memory.

More context is not a substitute for authoritative state.

### 5.4 Router or Scheduler

Use when different tasks, states, or failures require different capabilities.

Router inputs should be observable and testable:

```text
task type
risk
coupling
state freshness
plan confidence
tool support
budget
failure layer
```

Do not route on vague model self-confidence alone. Runtime owns dependency readiness and
completed ledgers.

### 5.5 Verifier

Use when acceptance boundaries are too weak, too strict, or tied to accidental
serialization.

Separate:

- schema validity;
- local semantic validity;
- global invariants;
- collateral and permission checks;
- commit eligibility.

A verifier change can alter measured success without improving the underlying agent.
Audit false accepts and false rejects independently.

### 5.6 Recovery and Escalation

Use when the initial failure is expected or unavoidable.

Recovery must add information or capability:

```text
refresh state
rebind address
localize failed targets
expose violated constraint
change executor
replan
ask a minimal sufficient human question
```

No-information same-parameter retry is not recovery.

## 6. Separate Scientific and Implementation Gates

Track:

```json
{
  "scientific_state": "passed|failed_gate|not_adjudicated",
  "implementation_gate": "passed|failed|untested",
  "cost_gate": "passed|failed|unknown",
  "safety_gate": "passed|failed|unknown",
  "external_validity": "synthetic|shadow|canary|production",
  "default_policy": "off|shadow|conditional|on"
}
```

Examples:

- a deterministic compiler may pass its implementation gate even when an end-to-end
  success claim is ceiling-limited;
- a prompt may improve a benchmark but fail the safety or cost gate;
- a sound semantic-ID interface should not be advertised with an unconfirmed universal
  performance gain.

## 7. Evaluation Design

Use paired, frozen evaluation whenever possible:

- same tasks and initial state;
- same model and budget;
- one isolated intervention or a declared package;
- strict outcome plus failure-layer endpoints;
- cost, latency, turns, retries, unsafe commit, and collateral;
- holdout tasks that test nearby fitting boundaries;
- explicit floor and ceiling stop rules;
- confidence intervals and minimum effect when making performance claims.

Include negative and adversarial cases:

- stale state;
- wrong/missing/duplicate target;
- relocation or reordered physical layout;
- timeout and truncated output;
- replay and duplicate side effects;
- verifier false-accept probes;
- unsupported and ambiguous intent.

Do not tune on the confirmatory set.

## 8. Adopt in Stages

```text
unit/property tests
→ offline replay
→ frozen pilot
→ confirmatory evaluation
→ shadow
→ canary
→ conditional/default rollout
```

Each stage needs:

- entry and exit gates;
- rollback;
- telemetry completeness;
- owner;
- decision record.

Skip stages only when risk and reversibility justify it.

## 9. Common Failed Improvements

| Pattern | Why it fails |
|---|---|
| Add a longer prompt to every failure | Treats all layers as generation |
| Give the model the expected post-state | Leaks the answer and destroys causal validity |
| Add retries without new evidence | Repeats the same failure and may duplicate effects |
| Let the model own indexes and line numbers | Couples intent to drifting physical state |
| Call tool success task success | Ignores semantic and global verification |
| Improve only average success | Hides unsafe tails, cost, and subgroup regressions |
| Train on every failure immediately | Promotes noise before mechanism and verifier are stable |
| Replace a correct safety reject with permissive execution | Converts liveness into unsafe commit |
| Rewrite the whole agent for a local layer defect | Expands attribution and regression surface |

## 10. Completion Gate

```text
[ ] baseline and task corpus are frozen
[ ] earliest failure layer is supported by evidence
[ ] intervention targets that layer
[ ] implementation properties pass offline
[ ] paired evaluation preserves model/budget/task identity
[ ] strict outcome, cost, and safety endpoints are reported
[ ] regressions and fitting-boundary cases are checked
[ ] rollout state matches evidence strength
[ ] rollback and telemetry exist
[ ] unsupported generalizations are explicit
```

## 11. Handoff

```text
Agent symptom:
Localized failure layer:
Mechanism:
Intervention:
Baseline and evaluation:
Outcome / cost / safety:
Regressions:
Scientific and rollout state:
Artifacts:
Residual limits:
```
