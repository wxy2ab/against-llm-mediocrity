---
key: engineering
lang: en
path: /engineering
title: Governance
navTitle: Governance
kicker: Concrete engineering practice based on the mechanism
summary: The engineering move is to stop asking the model to solve every hard task directly in final-answer space. Instead, build intermediate control objects that make the task easier to generate, verify, reuse, and revise.
order: 3
heroPoints:
  - Reparameterize hard tasks into lower-mismatch subtasks.
  - Represent task-specific control knowledge outside the final prose.
  - Validate, prioritize, weaken, and revoke that knowledge over time.
---

## What to do differently tomorrow

Before asking for another final answer, ask what intermediate object would change the task shape: a state matrix, rubric, dependency graph, failure-mode list, edge-case set, query plan, construal extraction, or structural outline. These are often tasks where LLMs are strong, and they give the final renderer something better to render from.

## Knowledge Governance

Knowledge Governance separates final rendering from the acquisition and management of task-specific control knowledge. The goal is not to make a heavier prompt. The goal is to create a control layer where important assumptions, constraints, preferences, and failure conditions can be tested and revised.

## Why inference-time governance still matters

RL alignment moves many valuable behaviors into the model's high-probability region. That is a powerful weight-level intervention. But it does not remove the need for task-level governance, because the model still has to express value through local autoregressive probabilities at inference time.

When a task's value function is already locally aligned with the model's probability surface, direct generation may be enough. When only part of the task is aligned, the system should let the model handle the aligned subtasks and externalize the rest into explicit control objects: states, constraints, rubrics, evidence checks, failure modes, and revocation rules.

Knowledge Governance is therefore not a replacement for RL. It is a complementary inference-time layer for the parts of a task that were not successfully mapped into probability by training.

## Governed Knowledge Objects in practice

:::cards
### Condition

When does this piece of knowledge apply? A useful rule should not silently become universal.

### Strength and evidence

Was it inferred from one example, multiple failures, a test, a tool result, or expert validation?

### Priority and revocation

How should conflicts be resolved, and what observation should weaken or retire the rule?
:::

## A practical loop

- Diagnose mismatch profile before choosing the workflow.
- Construct the task model and control space.
- Generate candidate GKOs from evidence, perturbations, and failures.
- Validate the GKOs against the strongest available signal.
- Render the final output from governed control knowledge, then monitor and revise.
