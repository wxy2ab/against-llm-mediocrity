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

## Where this is going

- The public layer explains the problem without requiring readers to begin with the paper.
- The theory layer develops autoregressive mediocrity, extraordinary regimes, four primitive mismatches, and Knowledge Governance.
- The engineering layer will grow into open-source tools for GKO-style control objects, validation loops, and human escalation protocols.
