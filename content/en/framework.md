---
key: framework
lang: en
path: /framework
title: Mechanism
navTitle: Mechanism
kicker: The theory layer behind the public explanation
summary: The framework treats LLM generation as a relationship between probability and task value. The key question is not whether the model can write, but whether what it easily generates is also what the task truly rewards.
order: 2
heroPoints:
  - "Autoregressive mediocrity: fluent, plausible outputs remain concentrated away from high-value regions."
  - "Local alignment: the model performs useful local operations, but local value does not automatically compose into global value."
  - "Autoregressive extraordinary: local continuation and task value reinforce each other."
---

## The Core Question: Does Probability Track Value?

An LLM still generates through probability: the next token, reasoning step, structural move, or tool call is selected under the current context. Training, RLHF, preference optimization, and inference-time reasoning reshape this distribution, but they do not give the model direct access to the real utility function of the current task.

The mechanism question is therefore:

```text
Is the model's easiest direction of continuation also the direction in which task value rises?
```

When yes, autoregressive generation can be extremely effective. When no, fluency can make the wrong direction more convincing.

## Three Alignment Regimes

:::cards
### Autoregressive Mediocrity
Tag: probability peak misses value peak

Under the available budget, reachable candidates remain concentrated in outputs that are fluent, plausible, and locally improvable but far from high-value solutions. More sampling or polishing may improve average quality without exposing the decisive structure.

### Autoregressive Local Alignment
Tag: the common practical state

The model's local continuation tendencies align with part of the task value. It can compress, rewrite, enumerate, compare, outline, and produce useful fragments. But global success may still depend on hidden state, long-range dependency, true objective, or validation.

### Autoregressive Extraordinary
Tag: probability and value rise together

High-value outputs are no longer tail events; they are easy to reach. Context compression, semantic decompression, register transfer, surface polish, structured transformation, query formulation, and edge-case generation often live in this regime.
:::

## Policy-Value Compression

Modern aligned models should not be described as merely following raw word frequency. Pretraining gives the model language and world patterns. SFT, RLHF, DPO, process supervision, and related methods compress certain proxy values into the policy, making helpful, preferred, apparently correct, or safe trajectories more probable.

This is **policy-value compression**: value is not directly read by the model; it is compressed into probability and expressed at inference time through more likely tokens, steps, and output trajectories.

This explains two facts:

- Models keep getting more useful because more valuable behaviors are moved into high-probability regions.
- Mismatch remains because proxy value is not the same as the real value of the current task, especially in open-ended, dynamic, high-stakes, or underspecified situations.

Inference-time reasoning has a similar effect. Chain-of-thought, search, reflection, and tool use create intermediate states that can turn the original task into more locally aligned subtasks. But if the intermediate representation is wrong, longer reasoning can simply become a longer rationalization of the wrong abstraction.

The consequence is not pessimism. It is calibration. Training and inference-time thinking expand the region where probability and value are locally aligned, but they do not remove the need to ask whether the current representation actually contains the task's decisive variables.

## The Four Primitive Mismatches

The four mismatches are not an attempt to name every surface failure. They are diagnostic axes for predicting when ordinary final-output search is likely to plateau.

:::cards
### Aggregation

Local improvements do not reliably compose into global value. Stories, code architecture, strategy, customer communication, and complex reasoning often depend on long-range coordination, delayed payoff, or coupled constraints.

### Support

The high-value answer is hard to reach under the current model, search operator, and budget. It may involve low-salience evidence, a minority frame, rare structure, counterintuitive option, or unusual boundary condition.

### State

The ranking of answers depends on hidden, changing, or underspecified state. User emotion, market regime, legal jurisdiction, production environment, time window, and organizational authority can reverse the value of the same answer.

### Specification

The accessible proxy objective diverges from the true objective. An answer may satisfy the prompt, rubric, style, or test while missing the user's real success criterion.
:::

A task rarely contains only one mismatch. A useful diagnosis asks for the **mismatch profile**: which mismatch dominates, which ones are secondary, and which intervention follows from that profile.

::::cards
### Aggregation-Dominant

Make the global structure local: dependency graphs, long-range constraints, promise-payoff maps, system boundaries, or validation checklists before final rendering.

### Support-Dominant

Pull tail structures into context: retrieve low-salience evidence, generate counterexamples, perturb assumptions, search unusual frames, and seed rare options explicitly.

### State-Dominant

Represent state as a first-class object: enumerate regimes, conditions of application, revocation triggers, and conditional policies.

### Specification-Dominant

Externalize the value function: write rubrics, acceptance criteria, rejected examples, stakeholder priorities, and evidence requirements.
::::

## Why Derivative Patterns Should Not Multiply the Taxonomy

Order-sensitive trajectories, noisy-context construal failures, corpus-prior dominance, emergent specification, structure-signal gaps, and control-capacity collapse are all important. But they are usually not new primitive mismatches. They are surface patterns produced by the four mismatches interacting with representation choice, inference budget, and control policy.

This discipline matters because each diagnosis should imply a different intervention:

- Aggregation mismatch: make global structure explicit first.
- Support mismatch: pull tail structures into context.
- State mismatch: enumerate states and produce conditional policies.
- Specification mismatch: externalize the value function through rubrics, counterexamples, and acceptance criteria.

The same discipline also prevents taxonomy inflation. If a proposed new failure label does not predict a different intervention, it is usually better treated as a derivative pattern rather than a primitive mismatch.

## Where Autoregression Is Extraordinary

The framework is not anti-generation. It identifies where generation is already positively aligned with value.

::::cards
### Compression and Semantic Mapping

Summaries, taxonomies, concept maps, and decision matrices often work well because the model's learned semantic structure helps preserve many relations in compact form.

### Semantic Decompression

Once a strong outline, rubric, or control object exists, expanding it into prose can be a high-alignment operation.

### Register Transfer

Meaning-preserving shifts in tone, audience, or format often benefit from the model's fluency, as long as legal, relational, or reputational boundaries are governed.

### Structured Transformation

Converting material into tables, checklists, JSON, SOPs, queries, or edge-case lists is often easier to verify than open-ended final-answer generation.
::::

## From Theory to Method

The mechanism leads to a practical principle: do not always ask the model to solve the high-mismatch final-output task directly. Preserve the operations that are already locally aligned, transform the misaligned parts into lower-mismatch intermediate tasks, and then verify that those intermediate objects compose into real global value.

A local-to-global transformation has four moves:

1. Exploit local alignment: use the model for compression, outline expansion, candidate enumeration, query formulation, and surface rendering where those operations are valuable.
2. Locate the alignment boundary: find where fluency stops predicting success, such as hidden state, tacit objective, rare invariant, nonlocal dependency, or misleading prior.
3. Govern the boundary: turn the boundary into state matrices, rubrics, constraints, counterexamples, failure modes, or GKOs.
4. Render after stabilization: let the model produce the final fluent artifact from governed intermediate objects, then check that the control objects survived rendering.

That is the path from autoregressive mediocrity toward autoregressive extraordinary, and it is what Knowledge Governance formalizes.
