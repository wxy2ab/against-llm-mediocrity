---
key: engineering
lang: en
path: /engineering
title: Governance
navTitle: Governance
kicker: Concrete engineering practice based on the mechanism
summary: The engineering move is not to force the model to solve every hard task in final-answer space. It is to build intermediate control objects that make the task easier to generate, verify, reuse, and revoke.
order: 3
heroPoints:
  - Reparameterize high-mismatch tasks into lower-mismatch subtasks.
  - Represent task-specific control knowledge outside the final prose.
  - Validate, prioritize, weaken, and revoke that knowledge as conditions change.
---

## One Thing to Change Tomorrow

Before asking the model for another final answer, ask:

```text
What intermediate object would change the shape of this task?
```

That object may be a state matrix, rubric, dependency graph, failure-mode list, edge-case set, query plan, task model, structural outline, validation checklist, or candidate constraint. LLMs are often strong at generating these objects. Once they stabilize, final writing, expansion, formatting, and tone adjustment move closer to an autoregressive-extraordinary regime.

## Mediocrity-to-Extraordinary Transformation

Governance is not about freezing the model. It is about changing the task the model faces.

Direct generation usually looks like:

```text
input → final answer
```

A high-mismatch task often works better as:

```text
input → task model → control objects → validation / weakening → final rendering
```

The goal is to turn a hard final-output problem into a sequence of easier intermediate tasks: compress context, enumerate states, generate rubrics, create counterexamples, list failure modes, formulate queries, build dependency graphs, and then render the final output from those governed objects.

## Decoupled Control Space

A decoupled control space is an external representation layer that does not need to look like the final answer. Its job is to preserve the units and relations that fluent prose tends to blur.

Depending on the task, the control space may contain:

::::cards
### Structure

Story beats, dependency graphs, module boundaries, workflow states, scenario matrices, role bindings, or promise-payoff relations.

### Constraints

Policy rules, data availability, temporal order, budget limits, privacy boundaries, acceptance criteria, and non-negotiable conditions.

### Evidence

Tests, retrieved sources, examples, failed cases, counterexamples, expert judgment, tool results, and validation notes.

### Governance

GKOs, GEOs, priorities, lifespans, revocation triggers, safe defaults, and unresolved human-governed variables.
::::

The final answer is then rendered from this control space. This matters because final prose entangles content, style, local coherence, and hidden constraints into one object. When the control objects are separate, the system can check whether the final prose preserved them.

## What Knowledge Governance Means

Knowledge Governance is an inference-time control layer. It separates final rendering from the acquisition and management of task-specific control knowledge.

The point is not a longer prompt. The point is lifecycle management for knowledge:

:::cards
### Visible

Important assumptions, boundaries, preferences, constraints, and failure conditions should be pulled out of fluent prose and made inspectable.

### Validated

A candidate rule should not become active just because it sounds plausible. It needs support from examples, tests, tool results, expert judgment, counterexamples, or environmental feedback.

### Revocable

A rule is valid only under conditions. When state, version, authority, objective, or evidence changes, it should be weakened, replaced, or revoked.
:::

## What a GKO Looks Like

A Governed Knowledge Object, or GKO, stores control knowledge the AI should know, obey, or check. A useful GKO should answer:

:::cards
### Condition

When does this knowledge apply? A locally useful rule should not silently become a universal truth.

### Evidence Strength

Does it come from one example, repeated failures, a test result, a tool run, statistical evidence, or expert confirmation?

### Priority and Revocation

What happens when rules conflict? What observation weakens, overrides, or retires the rule?
:::

The main manuscript's car-wash task shows how a GKO can preserve a conditional construal rule:

```json
{
  "condition": "the task is about receiving a service applied to an object",
  "assertion": "identify the object whose state must change; movement of the person alone may not satisfy the goal",
  "strength": "adversarial",
  "priority": 0.8,
  "lifespan": "session",
  "revocation_trigger": "the service can be completed without moving the object",
  "evidence": "walking to a car wash does not bring the car to be washed"
}
```

The exact schema can vary by domain, but a GKO should usually separate five concerns: the condition under which it applies, the assertion it makes, the evidence supporting it, its priority relative to other rules, and the trigger that weakens or revokes it.

## Validation Strength

Candidate GKOs should not become active merely because they sound plausible. The main manuscript distinguishes evidence regimes that imply different confidence levels:

::::cards
### Sample-Grounded

A rule is supported by paired or contrastive examples, such as preferred vs. rejected outputs or successful vs. failed dialogues.

### Objective-Grounded

A rule improves a measurable downstream objective, such as task completion, leakage reduction, test pass rate, or out-of-sample performance.

### Statistics-Grounded

A rule produces a desirable distributional shift when no single task objective is available, such as fewer contradictions, less repetition, or more diverse scenarios.

### Adversarial

A rule survives targeted attempts to break it, but still lacks stronger paired or objective support.
::::

Validation is the burden of proof. The model can propose hypotheses, dependencies, and candidate rules, but the system should not ask the same generation process to certify them as true.

## A Practical Loop

1. Check whether the task is already autoregressive-extraordinary. If it is compression, rewriting, format conversion, or common candidate generation, direct generation may be enough.
2. Diagnose the mismatch profile: aggregation, support, state, and specification.
3. Construct the task model: real success condition, target carrier, constraints, noise, hidden assumptions, and evaluation standard.
4. Build the control space: state matrix, dependency graph, rubric, failure modes, edge cases, query plan, or validation checklist.
5. Generate candidate GKOs from evidence, failures, perturbations, contrastive examples, and tool results.
6. Validate or weaken GKOs by separating confirmed rules, local rules, assumptions, and rejected claims.
7. Render the final output from governed knowledge, then check whether the output preserves the control objects.
8. Monitor failures, write new evidence back into the GKO set, and demote or revoke stale rules when needed.

## Failure Modes to Watch

Governance can also fail if the intermediate objects become the wrong target.

::::cards
### Proxy Drift

The system replaces the hard task with an easier but wrong proxy. "Produce strategic insight" quietly becomes "write a clear multi-section memo."

### False Artifacts

The model invents a rubric, dependency, state, or invariant that sounds useful but is not supported by evidence.

### Stale Knowledge

A rule that was valid under one version, market regime, authority boundary, or user preference silently persists after conditions change.

### Control Overhead

The task was already low-risk and locally aligned, but the system adds heavy governance that costs more than it improves.
::::

Conflict is normal as the GKO set grows. When two rules apply but recommend incompatible actions, resolve by evidence strength, priority, scope specificity, recency, and measured objective impact.

## Engineering Judgment

Governance has a cost. Not every task needs a full control layer. Low-risk, low-mismatch, strongly validated, highly patterned tasks can stay lightweight. High-risk, high-mismatch, tacit, stateful, or reusable tasks should externalize their control knowledge.

Use the lightweight path when the task is mostly compression, formatting, register transfer, or routine candidate generation. Use the governed path when local plausibility is a weak proxy for value, when state can change the answer, when errors are costly, or when the same judgment should be reused and revoked over time.

A good system does not make the model generate less. It makes the model generate in the right task shape.
