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

## What Knowledge Governance Means

Knowledge Governance is an inference-time control layer. It separates final rendering from the acquisition and management of task-specific control knowledge.

The point is not a longer prompt. The point is lifecycle management for knowledge:

::::cards
### Visible

Important assumptions, boundaries, preferences, constraints, and failure conditions should be pulled out of fluent prose and made inspectable.

### Validated

A candidate rule should not become active just because it sounds plausible. It needs support from examples, tests, tool results, expert judgment, counterexamples, or environmental feedback.

### Revocable

A rule is valid only under conditions. When state, version, authority, objective, or evidence changes, it should be weakened, replaced, or revoked.
::::

## What a GKO Looks Like

A Governed Knowledge Object, or GKO, stores control knowledge the AI should know, obey, or check. A useful GKO should answer:

::::cards
### Condition

When does this knowledge apply? A locally useful rule should not silently become a universal truth.

### Evidence Strength

Does it come from one example, repeated failures, a test result, a tool run, statistical evidence, or expert confirmation?

### Priority and Revocation

What happens when rules conflict? What observation weakens, overrides, or retires the rule?
::::

In an external-communication setting, a GKO might look like:

```json
{
  "condition": "external communication involves refunds, pricing, delivery dates, or legal commitments",
  "assertion": "do not make the commitment directly; obtain authorization first or prepare a draft instead",
  "strength": "objective-grounded",
  "priority": 0.95,
  "lifespan": "project",
  "revocation_trigger": "an authorized owner grants standing permission for this class of commitment",
  "evidence": "external commitments create reputational, financial, and legal risk",
  "source": "authority governance"
}
```

## A Practical Loop

1. Check whether the task is already autoregressive-extraordinary. If it is compression, rewriting, format conversion, or common candidate generation, direct generation may be enough.
2. Diagnose the mismatch profile: aggregation, support, state, and specification.
3. Construct the task model: real success condition, target carrier, constraints, noise, hidden assumptions, and evaluation standard.
4. Build the control space: state matrix, dependency graph, rubric, failure modes, edge cases, query plan, or validation checklist.
5. Generate candidate GKOs from evidence, failures, perturbations, contrastive examples, and tool results.
6. Validate or weaken GKOs by separating confirmed rules, local rules, assumptions, and rejected claims.
7. Render the final output from governed knowledge, then check whether the output preserves the control objects.
8. Monitor failures, write new evidence back into the GKO set, and demote or revoke stale rules when needed.

## Engineering Judgment

Governance has a cost. Not every task needs a full control layer. Low-risk, low-mismatch, strongly validated, highly patterned tasks can stay lightweight. High-risk, high-mismatch, tacit, stateful, or reusable tasks should externalize their control knowledge.

A good system does not make the model generate less. It makes the model generate in the right task shape.
