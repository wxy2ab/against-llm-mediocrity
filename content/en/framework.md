---
key: framework
lang: en
path: /framework
title: Mechanism
navTitle: Mechanism
kicker: The paper-facing theory behind the public explanation
summary: The theory treats autoregressive mediocrity as a task- and budget-dependent regime. It appears when the reachable distribution of fluent outputs is poorly aligned with the task's true value landscape.
order: 2
heroPoints:
  - "Autoregressive mediocrity: fluent, plausible outputs remain concentrated away from high-value regions."
  - "Autoregressive extraordinary: local continuation and task value reinforce each other."
  - Four primitive mismatches explain when the first regime is likely to appear.
---

## From output fluency to value alignment

The central scientific question is not whether a model can generate good text. It is whether the generation process exposes and preserves the variables that determine task value. In many tasks, the fluent output space is too close to the proxy objective and too far from the real one.

## The four primitive mismatches

:::cards
### Aggregation

Local improvements do not reliably compose into global value. The task depends on long-range coordination, delayed payoff, or coupled constraints.

### Support

Near-optimal solutions are low probability or hard to reach under the available inference budget and search operators.

### State

The ranking of outputs depends on hidden, changing, or underspecified states that are not fully contained in the prompt.

### Specification

The accessible proxy objective diverges from the true objective: the answer can satisfy the prompt while missing what actually matters.
:::

## Why extraordinary regimes matter

The framework is not anti-autoregression. It also names the opposite regime: autoregressive extraordinary. When the model's local continuation tendencies align with value, tasks such as context compression, taxonomy generation, edge-case enumeration, register transfer, query formulation, and semantic decompression can become unusually effective.

## Derivative patterns should be explained, not endlessly renamed

- Order-sensitive trajectories, noisy-context construal, corpus-prior dominance, and emergent specification are important patterns.
- They are usually better diagnosed as interactions among the four primitive mismatches, representation choice, inference budget, and control policy.
- This keeps the taxonomy useful: every diagnosis should imply a different intervention.
