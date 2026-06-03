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

## RL turns value into probability

Pre-training mainly fits the statistical distribution of human text. In that phase, the model learns which continuations are likely under a context; high probability mostly means "this is what text like this tends to do." Reinforcement learning from human feedback, preference optimization, and related alignment methods change the meaning of that probability space. They push up the probability of trajectories that receive higher reward and push down the probability of trajectories that receive lower reward.

After alignment, the model still emits tokens through logits, softmax, and autoregressive sampling. The physical interface has not changed. What changes is what the probability distribution is trying to express. A high-probability continuation is no longer only a frequent continuation; it is also a continuation that the trained system expects to score well under a learned proxy for task value.

This is why RL can create real local alignment. In instruction following, summarization, style transfer, polite refusal, surface helpfulness, and many formatting tasks, the local likelihood gradient can become close to the task-value gradient. The model's most natural next step is also a useful next step. That is one source of autoregressive extraordinary.

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

## Why RL is not enough

RL aligns the model to a reward model or preference signal, not directly to the full real-world utility of every future task state. The learned reward is a proxy. It can capture broad patterns of helpfulness and harmlessness while missing tacit requirements, hidden state, domain constraints, long-range structure, or unusual high-value solutions.

That means alignment is usually local rather than total. Some regions of the task become autoregressive-extraordinary because high-value continuations have been mapped into high-probability regions. Other regions remain autoregressive-mediocre because the probability surface still points toward answers that are fluent, reward-shaped, and plausible but not truly valuable for the concrete situation.

The four-mismatch view explains these remaining gaps.


## Why extraordinary regimes matter

The framework is not anti-autoregression. It also names the opposite regime: autoregressive extraordinary. When the model's local continuation tendencies align with value, tasks such as context compression, taxonomy generation, edge-case enumeration, register transfer, query formulation, and semantic decompression can become unusually effective.

## Derivative patterns should be explained, not endlessly renamed

- Order-sensitive trajectories, noisy-context construal, corpus-prior dominance, and emergent specification are important patterns.
- They are usually better diagnosed as interactions among the four primitive mismatches, representation choice, inference budget, and control policy.
- This keeps the taxonomy useful: every diagnosis should imply a different intervention.
