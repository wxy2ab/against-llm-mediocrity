---
key: home
lang: en
path: /
title: Against LLM Mediocrity
navTitle: Home
kicker: From intuitive failure to mechanism to practice
summary: Large language models can produce fluent answers quickly, but fluency is not the same as task value. This project explains autoregressive mediocrity and turns the theory into practical methods for using, building, and collaborating with AI systems.
order: 0
heroVisual: alignment
heroPoints:
  - When statistical probability and task value rise together, autoregressive generation can be exceptionally powerful.
  - When the probability peak misses the value peak, the model can produce fluent and plausible answers that are still not valuable enough.
  - Most real tasks are locally aligned: some parts can be generated directly, while others need governance.
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

## Why This Exists

You ask a model for a strategy, diagnosis, design, proof, code change, or plan. It quickly returns something clear, coherent, and plausible. You ask for another revision, and it becomes smoother, fuller, and more professional. Yet the decisive source of value may still be missing: a hidden state, a hard constraint, a rare high-value option, the real success criterion, or the right problem abstraction.

That is what this project calls **autoregressive mediocrity**. It does not mean the model is useless, and it does not mean all generation is unreliable. It means that, on some tasks, the statistically natural next step is not the task-relevant next step. A model can keep generating fluently while staying inside the same low-value basin.

The response is not merely to write better prompts. The first question is diagnostic: which parts of the task are already aligned with the model's generative strengths, which parts are only locally aligned, and which parts must be governed through control spaces, validation, tools, or human decisions?

## The One-Page Map

The project distinguishes three regimes:

:::cards
### Autoregressive Mediocrity
Tag: probability-value mismatch

The answers that are easy to generate are not the answers that carry the most task value. Iteration may improve surface quality without touching the bottleneck.

### Autoregressive Local Alignment
Tag: the common real-world regime

The model can perform many local operations well, such as compression, rewriting, enumeration, comparison, and structuring. But those local successes do not automatically compose into global success.

### Autoregressive Extraordinary
Tag: probability and value align

When local continuation reliably points toward task value, autoregression is not the problem; it is the advantage. Context compression, semantic expansion, structured transformation, and register transfer often live here.
:::

## How to Read the Site

:::cards
### Start With Intuition
Tag: Why It Matters

If you want to understand why "make it better" often fails, start with "Why It Matters." It explains the everyday shape of fluent but mediocre output.

### Then Read the Mechanism
Tag: Mechanism

If you care about the theory, read "Mechanism." It introduces the three regimes, policy-value compression, and the four primitive mismatches: aggregation, support, state, and specification.

### Finally Move to Practice
Tag: Governance and collaboration

If you want to use the framework, read "Governance" and "Collaboration." The practical move is to transform hard tasks into intermediate objects the model can handle well, while humans supply only the variables AI cannot reliably obtain.
:::

## How to Resist LLM Autoregressive Mediocrity

The core principle is: **preserve the parts where the model is already strong, and transform the misaligned parts into task forms that are easier to generate, verify, and govern.**

:::cards
### Do Not Search Only in Final-Answer Space

For hard tasks, do not immediately ask for the final answer. First produce a state matrix, rubric, dependency graph, failure-mode list, candidate set, query plan, or structured outline so the model faces lower-mismatch subtasks.

### Externalize Control Knowledge

Important assumptions, constraints, boundaries, preferences, and revocation conditions should not be buried inside fluent prose. They should become checkable, reusable, weakenable, and revocable GKOs.

### Let Humans Govern Missing Variables

Humans should not merely proofread AI drafts. Their role is to set values, choose weights, authorize risk, provide real state, judge taste, and own responsibility. A good agent asks the minimal sufficient question instead of handing the entire task back to the human.
:::

## Where This Is Going

- The public layer will explain autoregressive mediocrity, local alignment, and autoregressive extraordinary without requiring the reader to begin with the paper.
- The theory layer will develop the four primitive mismatches, Knowledge Governance, GKO/GEO, and governance loops.
- The engineering layer will turn control objects, validation loops, and minimal human intervention points into usable tools and templates.
