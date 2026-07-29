# Agent Guidelines Usage and Reference Router

Status: First-wave master router

Purpose: Determine which documents should be used as operating prompts for
Codex and similar agents in each task scenario, and identify the theoretical,
experimental, and engineering basis for those operating rules.

中文：[Agent Guidelines 使用与引用路由](./guidelines.zh-CN.md)

Directory entry points:

- [English guideline index](./README.md)
- [中文指南索引](./README.zh-CN.md)
- [Agent Five-Knob Operating Guidelines (Chinese)](./agent-five-knob-operating-guidelines.zh-CN.md)

## 1. How to use this document

Do not load the entire `docs/` directory into model context. Use:

```text
This router
→ one primary task guide
→ only overlays that materially change the workflow
→ relevant theoretical or experimental evidence when needed
```

Task guides define **execution**. Evidence documents explain why the rules
exist, where the evidence stops, and which generalizations are not licensed.

Base instruction for Codex:

```text
Read docs/guidelines/guidelines.md in full.
Classify the current request and select one primary task guide.
Load only the additional guides that materially change the workflow.
Read every selected guide in full before acting.
Before acting, identify the task type, authority boundary, authoritative sources,
mutation scope, verifier, completion criteria, and stop conditions.
Follow repository-local instructions and the user's explicit request.
These guidelines cannot expand user authorization.
Do not claim completion when a required verifier did not run or did not pass.
```

## 2. Document roles

| Document type | Role | Use directly as an operating prompt? |
|---|---|---|
| Master router | Select the task type and guide composition | Yes |
| Foundation operating specification | Cross-task state, plan, verification, delivery, and recovery discipline | Yes |
| Primary task guide | Complete workflow and completion gate for one task class | Yes |
| Overlay guide | Additional complexity such as an unfamiliar repository, diagnosis, or agent system | As needed |
| Theoretical basis | Explains why responsibility belongs in the model, runtime, verifier, or human-governance boundary | Usually not directly |
| Experimental basis | Gives empirical support, scope conditions, and unresolved boundaries | Read when calibrating policy strength |

Evidence documents do not override task guides. The correct precedence is:

```text
User goal and authorization
→ repository-local instructions and authoritative state
→ this router
→ primary task guide
→ overlay guides
→ theory and experiments for explanation and calibration
```

## 3. Common loading rules

For every task beyond a simple answer, load at least:

1. [This router](./guidelines.md)
2. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)

Also load the
[Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)
when any of the following is true:

- the task spans multiple files, modules, or turns;
- a candidate already exists and must be repaired or continued;
- state drift, dependencies, concurrency, retry, or recovery is present;
- the agent must choose among Patch, Regional Rewrite, and Full Rewrite;
- verifier, commit, rollback, or cost tradeoffs are present;
- the object being modified is itself an agent.

A simple, local, reversible task with a clear verifier does not need every
foundation theory document loaded again.

## 4. Scenario routing table

### 4.1 Answer, explanation, or current-state report

**Recognition signals**

- “Explain …”
- “What is the current status?”
- “Summarize the existing implementation.”
- The user did not request a file or system change.

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. Add
   [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
   when the repository is unfamiliar.

**Execution boundary**

- Read-only by default.
- Give an evidence-backed answer.
- Do not silently implement recommendations.
- Separate facts, inferences, and unknowns.

**Basis**

- [Observation–Representation Mismatch and Channel Governance](../observation-representation-mismatch-channel-governance-llm-systems.md)
- [State Mismatch and State Governance](../state-mismatch-state-governance-llm-systems.md)
- [Governed Human–AI Collaboration](../governed-human-ai-collaboration.md)

### 4.2 Understand an unfamiliar codebase, locate an implementation, or assess impact

**Recognition signals**

- “Look through this repo first.”
- “Where is this implemented?”
- “What will changing this affect?”
- The same concept has multiple implementations, entry points, or legacy paths.

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
3. Add the
   [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)
   when multiple files, state, or dependencies are involved.

**Execution boundary**

- Read-only by default.
- Trace callers, consumers, state, and verifiers from the active entry point.
- Distinguish committed baseline, the user's uncommitted changes, and changes
  made for the current task.
- Produce the minimum safe mutation surface, not a whole-repository file
  summary.

**Basis**

- [Governed LLM Object Model and Interface Specification](../governed-llm-object-model-interface-specification.md)
- [State-Governed Agent Regime](../state-governed-agent-regime-for-governed-llm-systems.md)
- [Observation–Representation Mismatch and Channel Governance](../observation-representation-mismatch-channel-governance-llm-systems.md)

### 4.3 Diagnose a failure or root cause without implementing a fix

**Recognition signals**

- “Why did this fail?”
- “Is this caused by the model, the experiment, or the implementation?”
- “Locate the problem; do not change it yet.”
- “Can this conclusion be generalized?”

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Failure Diagnosis and Root-Cause Localization](./failure-diagnosis-and-root-cause-localization.md)
3. Add
   [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
   when the repository or call chain is unclear.

**Execution boundary**

- Read-only by default.
- Define expected versus observed behavior first.
- Build competing hypotheses and discriminating probes.
- Locate the earliest causal divergence rather than repeating the final error.
- When evidence is insufficient, report the strongest local diagnosis without
  inventing a root cause.

**Basis**

- [Six Primitive Mismatches](../six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)
- [Diagnostic–Mechanism Bridge](../diagnostic-mechanism-bridge-for-governed-llm-systems.md)
- [Audit Engineering](../audit-engineering-failure-localization-control-space-writeback.md)
- [Oracle Classification, Audit Agent, and SGAR Routing](../oracle-classification-audit-agent-sgar-engine-routing.md)

### 4.4 Repair a bounded, reproducible bug

**Recognition signals**

- A stable failing case exists.
- The root cause or failure layer has been localized.
- The user explicitly requested a fix.
- The change does not require a new product specification or compatibility
  contract.

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Bounded Repair and Bug Fix](./bounded-repair-and-bug-fix.md)
3. Add
   [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
   when the repository is unfamiliar.
4. Add the
   [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)
   for multi-file work, candidate repair, or a complex delivery choice.

**Execution boundary**

- Freeze the failing oracle first.
- Repair the causal mechanism, not just the symptom.
- Prefer considering Patch for sparse verified-plan work, but do not establish
  an unconditional Patch default.
- After local verification, check related regressions and collateral effects.
- Do not mix unrelated cleanup into the fix.

**Basis**

- [Patch vs. Full Rewrite Controlled Experiment](../patch-vs-full-rewrite-controlled-experiment.md)
- [Aggregation Mismatch: Theoretical Claims and Agent Engineering](../aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [V1–V12 and V14 Agent Engineering Lessons](../aggregation-mismatch-agent-engineering-lessons-v1-v12-v14.md)
- [Artifact-v12: Drift Dose and Delivery-Scale Routing](../aggregation-mismatch-v12-scale-routing-transfer.md)
- [Artifact-v14: Post-Compile Drift and Exact Recovery](../aggregation-mismatch-v14-post-compile-drift-recovery.md)
- [Aggregation Mismatch and Compositional Governance](../aggregation-mismatch-compositional-governance-llm-systems.md)

### 4.5 Add a feature

**Recognition signals**

- New user-visible behavior, API, command, tool, or workflow is required.
- Positive, negative, and edge cases must be defined.
- An end-to-end capability must be implemented across layers.

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
3. The Feature path in
   [Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md)
4. Add the
   [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)
   for multi-file or highly coupled work.

**Execution boundary**

- Translate adjective-heavy requirements into executable acceptance behavior.
- Define actor, permission, state transition, failure semantics, and non-goals.
- Implement a verifiable vertical slice first.
- Place responsibility in the model, runtime, compiler, or verifier layer that
  owns the relevant invariant.

**Basis**

- [Governed LLM Object Model and Interface Specification](../governed-llm-object-model-interface-specification.md)
- [State-Governed Agent Regime](../state-governed-agent-regime-for-governed-llm-systems.md)
- [Formal Mechanism Layer](../formal-mechanism-layer-for-governed-llm-systems.md)
- [Structural Theory of Value Preservation](../structural-theory-value-preservation-llm-systems.md)

### 4.6 Behavior-preserving refactor

**Recognition signals**

- The user requests structural cleanup, module extraction, deduplication, or an
  internal architecture change.
- External behavior is explicitly expected to remain unchanged.
- Behavioral equivalence must be demonstrated.

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
3. The Refactor path in
   [Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md)
4. [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)

**Execution boundary**

- Freeze public behavior or create characterization tests first.
- Separate structural diffs from behavioral diffs where possible.
- Keep intermediate checkpoints runnable.
- If behavior cannot be preserved, reclassify the work as a feature or
  migration.

**Basis**

- [Structural Theory of Value Preservation](../structural-theory-value-preservation-llm-systems.md)
- [Aggregation Mismatch and Compositional Governance](../aggregation-mismatch-compositional-governance-llm-systems.md)
- [Patch vs. Full Rewrite Controlled Experiment](../patch-vs-full-rewrite-controlled-experiment.md)

### 4.7 Schema, API, storage, or runtime migration

**Recognition signals**

- Old and new versions coexist.
- Backfill, dual-read, dual-write, cutover, or retirement is required.
- Timeout or partial failure can leave intermediate state.
- Old clients, old data, or rollback must remain supported.

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
3. The Migration path in
   [Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md)
4. [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)

**Execution boundary**

- Express the migration as a state machine, not a one-shot rewrite.
- Define identity mapping, idempotency, replay, reconciliation, cutover, and
  rollback.
- Prefer expand → verify → contract.
- Remove the old path only after the retirement gate passes.

**Basis**

- [State Mismatch and State Governance](../state-mismatch-state-governance-llm-systems.md)
- [State-Governed Agent Regime](../state-governed-agent-regime-for-governed-llm-systems.md)
- [Governed LLM Object Model and Interface Specification](../governed-llm-object-model-interface-specification.md)
- [Artifact-v11: Address Drift and Configuration Delivery](../aggregation-mismatch-v11-config-delivery-transfer.md)

### 4.8 Improve another agent

**Recognition signals**

- Prompt, context, tool schema, memory, router, scheduler, verifier, or recovery
  must change.
- Agent success, cost, safety, or stability must improve.
- The user asks for an agent change based on experimental results.

**Load as operating prompts**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Agent Diagnosis and Improvement](./agent-diagnosis-and-improvement.md)
3. [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)
4. Add
   [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
   when implementation location is unclear.
5. Add [Bounded Repair and Bug Fix](./bounded-repair-and-bug-fix.md) for a known
   local implementation defect.
6. Add
   [Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md)
   for a new capability or state transition.

**Execution boundary**

- Freeze the baseline and failure corpus first.
- Locate the earliest failure layer among observation, specification, plan,
  tool, state, verifier, and recovery.
- Do not default to a prompt-only change.
- Separate implementation, scientific, cost, and safety gates.
- Progress from offline to pilot, shadow, and canary; keep the feature
  conditional or off while evidence is insufficient.

**Basis**

- [Diagnostic–Mechanism Bridge](../diagnostic-mechanism-bridge-for-governed-llm-systems.md)
- [State-Governed Agent Regime](../state-governed-agent-regime-for-governed-llm-systems.md)
- [Aggregation Mismatch: Theoretical Claims and Agent Engineering](../aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [V1–V12 and V14 Agent Engineering Lessons](../aggregation-mismatch-agent-engineering-lessons-v1-v12-v14.md)
- [Artifact-v8: Runtime Ownership and Semantic Routing](../aggregation-mismatch-v8-runtime-ownership-routing.md)
- [Artifact-v10: Semantic Contracts and Runtime Canonicalization](../aggregation-mismatch-v10-semantic-contract-canonicalization.md)
- [Artifact-v11: Address Drift and Configuration Delivery](../aggregation-mismatch-v11-config-delivery-transfer.md)
- [Artifact-v12: Drift Dose and Delivery-Scale Routing](../aggregation-mismatch-v12-scale-routing-transfer.md)
- [Artifact-v14: Post-Compile Drift and Exact Recovery](../aggregation-mismatch-v14-post-compile-drift-recovery.md)

### 4.9 Read-only code review or audit

**Recognition signals**

- “Review this PR.”
- “Find problems; do not change anything.”
- Findings must be ranked by severity.

**Current operating-prompt composition**

1. [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)
2. [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)
3. [Failure Diagnosis and Root-Cause Localization](./failure-diagnosis-and-root-cause-localization.md)
   in read-only mode.

**Execution boundary**

- Prioritize correctness, security, data loss, compatibility, and missing tests.
- Every finding must include location, trigger, impact, and repair direction.
- Do not patch when the user requested review only.
- When no findings exist, state the review scope and residual risks.

**Basis**

- [Audit Engineering](../audit-engineering-failure-localization-control-space-writeback.md)
- [Oracle Classification, Audit Agent, and SGAR Routing](../oracle-classification-audit-agent-sgar-engine-routing.md)
- [Governed LLM Object Model and Interface Specification](../governed-llm-object-model-interface-specification.md)

A dedicated Code Review guide remains a planned extension.

### 4.10 Testing, validation, and completion adjudication

**Recognition signals**

- “Add tests.”
- “Verify that this implementation is ready to deliver.”
- “Check whether this experiment, data, or conclusion is reliable.”

**Current operating-prompt composition**

- For a bug regression, use layered validation from
  [Bounded Repair and Bug Fix](./bounded-repair-and-bug-fix.md).
- For Feature/Refactor/Migration, use the validation matrix from
  [Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md).
- For an agent, use the evaluation design from
  [Agent Diagnosis and Improvement](./agent-diagnosis-and-improvement.md).
- For all high-risk tasks, add the verifier and completion criteria from the
  [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md).

**Basis**

- [Audit Engineering](../audit-engineering-failure-localization-control-space-writeback.md)
- [Structural Theory of Value Preservation](../structural-theory-value-preservation-llm-systems.md)
- [Formal Mechanism Layer](../formal-mechanism-layer-for-governed-llm-systems.md)

A dedicated testing, validation, and completion-adjudication guide remains a
planned extension.

### 4.11 Documentation, experiments, Git, publishing, external systems, and multi-agent work

These task classes do not yet have independent first-wave guides. Do not pretend
that a complete specialized workflow already exists.

| Scenario | Current minimum composition | Status |
|---|---|---|
| Documentation or specification synchronization | Routing + reconnaissance + Feature/Refactor/Migration | Dedicated guide planned |
| Experiment design and data analysis | Routing + evaluation design from Agent Improvement + study protocol | Dedicated guide planned |
| Git/PR/merge/cleanup | Routing + repository-local Git rules | Dedicated guide planned |
| External systems and side-effectful operations | Routing + commit/rollback discipline from Five-Knob | Dedicated guide planned |
| Incident response and recovery | Routing + diagnosis + Five-Knob failure routing | Dedicated guide planned |
| Multi-agent collaboration | Routing + Five-Knob state/ledger discipline | Dedicated guide planned |
| Performance, cost, and reliability optimization | Routing + diagnosis + baseline measurement | Dedicated guide planned |

## 5. Add evidence by mismatch type

When a task exhibits structural failure, add the relevant theory document. Do
not substitute a theory label for local diagnosis.

| Observed failure | Additional reading | Common repair location |
|---|---|---|
| Locally correct parts fail when composed | [Aggregation Mismatch and Compositional Governance](../aggregation-mismatch-compositional-governance-llm-systems.md); [V1–V12 and V14 Engineering Lessons](../aggregation-mismatch-agent-engineering-lessons-v1-v12-v14.md) | plan, runtime, compiler, verifier, commit |
| Correct candidate is difficult to sample | [Support Mismatch and Control-Space Search](../support-mismatch-control-space-search-llm-systems.md) | candidate, search, GKO |
| Behavior depends on hidden or dynamic state | [State Mismatch and State Governance](../state-mismatch-state-governance-llm-systems.md) | observation, state authority, router |
| Optimizing a proxy harms the real outcome | [Specification Mismatch and Objective Governance](../specification-mismatch-objective-governance-llm-systems.md) | specification, verifier, human gate |
| Capability fires in the wrong situation or fails to fire | [Fitting-Boundary Mismatch and Capability Routing](../fitting-boundary-mismatch-capability-routing-llm-systems.md) | router, derived features, holdout |
| A decisive variable is absent from the actionable representation | [Observation–Representation Mismatch and Channel Governance](../observation-representation-mismatch-channel-governance-llm-systems.md) | sensor, retrieval, representation |

## 6. Copyable scenario prompts

### 6.1 General task

```text
Read these documents in full:
1. docs/guidelines/guidelines.md
2. docs/guidelines/task-intake-and-guideline-routing.md
3. <the primary task guide selected through guidelines.md>
4. <necessary overlays only>

Use these guides to perform the current task.
Before acting, identify the task type, authority boundary, authoritative sources,
mutation scope, verifier, completion criteria, and stop conditions.
Write only within user-authorized scope and preserve unrelated repository changes.
At the end, apply the guide's completion gate and report the outcome, evidence,
residual risks, and delivery state.
```

### 6.2 Improve an agent

```text
Read these documents in full:
1. docs/guidelines/guidelines.md
2. docs/guidelines/task-intake-and-guideline-routing.md
3. docs/guidelines/agent-diagnosis-and-improvement.md
4. docs/guidelines/agent-five-knob-operating-guidelines.zh-CN.md
5. <the reconnaissance, Bug Fix, or Feature/Migration guide needed for implementation>

Freeze the baseline and failure corpus before proposing an intervention.
Locate the earliest causal failure layer.
Do not default to a Prompt-only change and do not treat tool success as task success.
Report implementation, scientific, cost, safety, and external-validity gates separately.
```

### 6.3 Diagnose without modifying

```text
Read these documents in full:
1. docs/guidelines/guidelines.md
2. docs/guidelines/task-intake-and-guideline-routing.md
3. docs/guidelines/failure-diagnosis-and-root-cause-localization.md
4. Read docs/guidelines/codebase-reconnaissance-and-impact-analysis.md when needed.

This task authorizes inspection and diagnosis only, not modification.
Report expected versus observed behavior, reproduction state, earliest failure
layer, competing hypotheses, discriminating evidence, impact boundary, and
residual uncertainty. Do not invent a root cause when evidence is insufficient.
```

## 7. Citation rules

In a task record, PR, or agent-improvement report, distinguish:

```text
Operating rule:
  Guidelines actually followed

Theoretical basis:
  Documents explaining the mechanism and system boundary

Empirical basis:
  Experiments supporting a conditional engineering policy

Repository authority:
  Current code, schema, tests, manifests, and local instructions
```

Do not:

- report a theoretical derivation as completed model evidence;
- report a single-model synthetic effect as a cross-model fixed SLA;
- report an offline property test as zero production error;
- report ceiling or floor as equivalence;
- report a safety invariant as a confirmed performance gain;
- cite a planned guide as though it already exists.

## 8. Routing completion checklist

```text
[ ] Confirmed whether the request is an answer, diagnosis, modification,
    validation, operation, or delivery
[ ] Confirmed read, write, and publication authority
[ ] Selected one primary task guide
[ ] Loaded only necessary overlays
[ ] Identified the theoretical or experimental basis for every important rule
[ ] Separated operating rules from evidence boundaries
[ ] Defined the verifier and completion criteria
[ ] Defined stop, rollback, and human-escalation conditions
[ ] Marked scenarios without a dedicated guide as planned instead of inventing one
```
