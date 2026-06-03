---
key: home
lang: en
path: /
title: Against LLM Mediocrity
navTitle: Home
kicker: A reader journey from intuition to mechanism to practice
summary: LLMs can produce fluent answers long before they produce truly valuable answers. This project starts from that everyday experience, explains the mechanism behind it, and turns the theory into practical ways to use and build AI systems with less wasted effort.
order: 0
heroVisual: alignment
heroPoints:
  - When statistical probability and task value rise together, autoregression can be extraordinary.
  - When probability and value point to different regions, fluent generation becomes mediocre.
  - Most real tasks are locally aligned: some subtasks are extraordinary, while others need governance.
alignmentLabels:
  probability: statistical probability
  value: task value
  extraordinary: Autoregressive extraordinary
  mediocre: Autoregressive mediocrity
  local: Local alignment
  aligned: probability and value rise together
  misaligned: probability peak misses value peak
  partial: some regions align, others diverge
---

## Why this exists

A user asks for a strategy, a diagnosis, a design, a proof, or a plan. The model gives something clear, coherent, and even improved after several revisions. But the decisive variable is still missing. That is the phenomenon this project calls autoregressive mediocrity: not stupidity, not randomness, but a mismatch between the statistically likely continuation and the task's true value.

## What changes

:::cards
### Stop treating every failure as a prompt failure
Tag: Fewer blind retries

Some failures are not fixed by asking for more depth, more creativity, or a cleaner style. The task may need a different representation before generation becomes useful.

### Use LLMs where they are naturally strong
Tag: Positive alignment

LLMs can be extraordinary at compression, transformation, comparison, edge-case generation, and rendering from a good structure. The point is to move more work into those regimes.

### Know what humans must govern
Tag: Better collaboration

Humans should not merely proofread fluent drafts. They should set values, choose tradeoffs, authorize risk, and supply missing control variables.
:::

## Some intuitive examples

:::cards
### Which tasks are likely to become mediocre
Tag: High mismatch

Consider financial-market judgment. Financial markets are non-stationary systems shaped by dynamic strategic interaction. Participant preferences, risk appetite, liquidity structure, and dominant narratives keep shifting. No matter how much training a model receives, it cannot infer from static text alone what the market is currently rewarding, punishing, or preferring. The decisive variables are not in the prompt, so the model can easily produce an analysis that sounds fluent, complete, and even impressive while still missing the actual game structure of the present market.

### Which tasks are often extraordinary
Tag: Positive alignment

For example: compressing a long document into a clear summary, organizing messy information into a structured outline, comparing a few options, generating edge cases from an existing rule set, or rewriting the same content in a different tone or format. In these tasks, local continuation often tracks value well, so models can be unusually strong.

### Which tasks are only partially aligned
Tag: Needs governance

Consider coding tasks. At the level of concrete implementation, things like reading and writing files, wrapping an API, building an HTML page, or filling in boilerplate are often well aligned with value, and models usually do well. But once the question becomes "what is the real business context here?", "how will this architecture evolve over time?", or "what are the real edge cases and failure modes?", the model can quickly fall back into mediocrity. In other words, coding is often not globally extraordinary; it is locally strong and only partially aligned overall.
:::

## How to resist LLM autoregressive mediocrity

:::cards
### Agent tasks
Tag: Strengthen the environment

For agentic systems, the key is not just to make the model stronger. The real move is to strengthen hard boundaries and hard feedback in the environment: which actions are clearly disallowed, which outcomes can be explicitly verified, and which failures will surface immediately. When the model can no longer continue reliably, the system should introduce a minimal human intervention point so the human supplies only the missing variable rather than taking the whole task back.

### High-exploration tasks
Tag: Build a control space

For high-exploration tasks, it is often a mistake to stay in the raw semantic space and keep sampling continuations. A better move is to cut away from the original semantic surface and reconstruct the problem as a searchable control space: a hypothesis set, a state space, a constraint graph, an evaluation rubric, or a failure-mode list. Search, compare, and filter inside that control space first, then render the final answer.

### Convertible tasks
Tag: Turn them extraordinary

Some tasks are not doomed to mediocrity; they can be converted. The key is to find the right method and add the missing environmental boundaries, feedback signals, and human participation points, so a task that would normally slide into autoregressive mediocrity is restructured into one where the model can behave autoregressively extraordinarily.
:::

## Where this is going

- The public layer explains the problem without requiring readers to begin with the paper.
- The theory layer develops autoregressive mediocrity, extraordinary regimes, four primitive mismatches, and Knowledge Governance.
- The engineering layer will grow into open-source tools for GKO-style control objects, validation loops, and human escalation protocols.
