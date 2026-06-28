---
key: framework
lang: en
path: /framework
title: Mechanism
navTitle: Mechanism
kicker: A theoretical framework for studying resistance to autoregression
summary: The framework treats LLM generation as a relationship between probability and task value. The key question is not whether the model can write, but whether what it easily generates is also what the task truly rewards.
order: 2
heroPoints:
  - "LLM mediocrity: fluent, plausible outputs remain concentrated away from high-value regions."
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
### LLM Mediocrity
Tag: probability peak misses value peak

Under the available budget, reachable candidates remain concentrated in outputs that are fluent, plausible, and locally improvable but far from high-value solutions. More sampling or polishing may improve average quality without exposing the decisive structure.

Autoregressive mediocrity is the aggregation-mismatch subcase: local token probabilities keep producing reasonable continuations while the global value structure is diluted.

### Local Alignment
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

## Why Multi-Agent Collaboration Does Not Automatically Escape LLM Mediocrity

Many people have the intuition that if a single model is prone to mediocrity, then multiple agents can solve the problem by discussing, critiquing, dividing roles, and voting. That is only true when multi-agent collaboration actually introduces a new control space, external state, validation mechanism, or genuinely differentiated strategy. Otherwise, it often amounts to repeating the same generative process many times.

If several agents share roughly the same model, corpus priors, reward shaping, and task representation, then their collaboration is mechanically closer to **repeated sampling**. Even if they are labeled proposer, critic, judge, and executor, they are still searching on roughly the same probability landscape. This can improve average quality, reduce obvious errors, and make the output more complete or robust, but it does not automatically change the fact that high-value solutions may still lie outside the high-probability region.

The same applies to multi-persona collaboration. Giving one model identities such as conservative, radical, user advocate, or architect can lengthen the sampling path and create more local perturbations and corrections. But if those personas are not tied to different information sources, different state access, different control objects, or different validation criteria, then the apparent dialogue is often just one autoregressive trajectory stretched into several entangled autoregressive trajectories. A longer path does not mean escape from autoregressive gravity.

The key point is this: **lengthening the sampling path is not the same as changing the search space; increasing the number of roles is not the same as changing the value function.** If the real bottleneck comes from aggregation mismatch, state mismatch, support mismatch, specification mismatch, or fitting-boundary mismatch, then more agents often expose the mismatch more thoroughly rather than repair it. They may make a mediocre answer more persuasive, or make a cluster of middling answers more consistent, while still failing to reach the decisive structure.

So multi-agent collaboration is not a sufficient condition for escaping LLM mediocrity. It starts to become a real governance mechanism only when it genuinely rewrites the task into a different control problem by introducing explicit external state, validation loops, governed knowledge objects, differentiated tool permissions, structured control spaces, or minimal human intervention points.

## The Six Primitive Mismatches

The six mismatches are not an attempt to name every surface failure. They are diagnostic axes for predicting when ordinary final-output search is likely to plateau.

:::cards
### Aggregation

Local improvements do not reliably compose into global value. Stories, code architecture, strategy, customer communication, and complex reasoning often depend on long-range coordination, delayed payoff, or coupled constraints. This is where autoregressive mediocrity appears as a local-probability mechanism.

### Support

The high-value answer is hard to reach under the current model, search operator, and budget. It may involve low-salience evidence, a minority frame, rare structure, counterintuitive option, or unusual boundary condition.

### State

The ranking of answers depends on hidden, changing, or underspecified state. User emotion, market regime, legal jurisdiction, production environment, time window, and organizational authority can reverse the value of the same answer.

### Specification

The accessible proxy objective diverges from the true objective. An answer may satisfy the prompt, rubric, style, or test while missing the user's real success criterion.

### Fitting Boundary

The system binds too tightly to a local evidence chain, metric, scene default, role template, or feedback signal. The answer is locally reasonable but does not survive neighboring contexts.

### Observation-Representation

The decisive world variable never reaches the model in a task-sufficient form. The system may need measurement, raw logs, tool feedback, richer modality, sensor data, or a structured control representation before reasoning can close.
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

### Boundary-Mismatch-Dominant

Test local explanations against neighboring contexts: perturb metrics, audit protocols, assumptions, role templates, and feedback sources before treating a claim as invariant.

### Observation-Representation-Dominant

Repair the channel before reasoning harder: add measurements, inspect raw evidence, run tests, query the environment, or encode physical, social, temporal, and verification variables explicitly.
::::

## Why Derivative Patterns Should Not Multiply the Taxonomy

Order-sensitive trajectories, noisy-context construal failures, corpus-prior dominance, emergent specification, structure-signal gaps, and control-capacity collapse are all important. But they are usually not new primitive mismatches. They are surface patterns produced by the six mismatches interacting with representation choice, inference budget, and control policy.

This discipline matters because each diagnosis should imply a different intervention:

- Aggregation mismatch: make global structure explicit first.
- Support mismatch: pull tail structures into context.
- State mismatch: enumerate states and produce conditional policies.
- Specification mismatch: externalize the value function through rubrics, counterexamples, and acceptance criteria.
- Fitting-boundary mismatch: perturb nearby scenes and mark the boundary of each local claim.
- Observation-representation mismatch: acquire or encode the variables the current channel dropped.

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

That is the path from LLM mediocrity toward autoregressive extraordinary, and it is what Knowledge Governance formalizes.

The transition from mechanism to governance is therefore direct. The mechanism page explains why direct generation gets stuck; the governance page explains how to rewrite stuck tasks into searchable, verifiable, reusable engineering objects. Without that layer, the six mismatches are only diagnostic labels. With it, they become interventions.

## Four Ways to Resist Autoregressive Gravity

These methods share one core move: **do not let the model slide through the raw token sequence toward familiar patterns; instead, create an intermediate layer that is searchable, evaluable, and reversible.** Once that layer exists, the task is no longer just "keep writing." It becomes "search, validate, reject, and recombine inside a control space, then render back into output."

:::cards
### Dense Sampling, Decomposition, Recombination, Then Validation
Tag: support mismatch / escaping local optima

When the high-value answer lives in the low-probability tail, asking directly for the final answer tends to pull the model back toward familiar modes. A better move is to sample heavily under autoregressive generation, collect many candidates, select the locally promising ones, and decompose them into fragments, structures, strategies, or turning points before recombining them across samples.

The value of this step is not merely better collage. It is a way to extract hard high-sigma experience that usually remains implicit: rare but effective structures, hidden constraints, non-obvious transitions, unusual failure modes, or high-value expressive moves. Once extracted, those patterns should be validated back against the sample pool and against fresh generations to see whether they actually raise value in a stable way.

This is fundamentally a way to fight support mismatch: pull low-probability but high-value local structure out of the tail, then turn it into a reusable control resource. Every time a new local optimum is reached, the same loop can be repeated.

### Write the Control Space First, Then Generate the Output
Tag: rewrite a mediocre task into extraordinary subtasks

Tasks such as stories, long-form writing, course design, or complex proposals often become mediocre when the model is asked to generate the final artifact directly. But if the elements of excellence are written down first, such as required components, pacing, constraints, tonal boundaries, emotional arcs, character relations, foreshadowing payoffs, or acceptance criteria, then the model often becomes strong on those subtasks.

In practice, this means constructing a control space first: character arcs, conflict gradients, thematic constraints, scene beats, reveal order, forbidden cliches, and evaluation rubrics. Then the model generates the story or artifact under that control space, and a relatively more reliable evaluation task checks whether the result drifts, becomes generic, violates setup, or collapses into cliche.

If the result is weak, do not immediately rewrite the whole output. Modify the control space itself. This exploits the asymmetry between generation and evaluation: producing a truly excellent artifact may be unstable, but spotting defects, detecting cliche, and checking constraint violations is often much easier. A mediocre autoregressive task is thus rewritten into a sequence of autoregressive-extraordinary tasks.

### Search in Control Space, Not Only in Output Space
Tag: the most general method

This is the most general strategy. For many high-mismatch tasks, the first move is to break the default path from raw semantics to direct output and construct a control space that is easier to search: a state matrix, rubric, candidate frame set, dependency graph, query plan, failure-mode list, role configuration, or decision table.

The search then happens inside that control space, not just through repeated sampling of final answers. You perturb, expand, prune, and compare control objects, then project them back into output space for validation. If validation fails, do not merely patch the final prose. Return to the control space and keep searching.

The point is not bureaucracy. It is a change in search geometry. In raw output space, local token fluency often fails to track task value. In control space, the search is redirected toward the variables, structures, and constraints that actually determine value.

### Use Hierarchical Control Spaces to Contain Search Complexity
Tag: coarse-to-fine search

Control space is not valuable merely because it exists. If every variable, style choice, constraint, branch, and exception is dumped into one enormous search space, the result may be no better than blind repeated sampling in output space, and can easily become worse.

That is why complex tasks often need hierarchical control spaces. Search first at a coarse level to determine the main direction, global structure, and governing constraints. Then search at the next level for local strategies, substructures, and concrete realizations. Only after that should the system render the final artifact. Each layer can also have its own validator, rollback point, and escalation condition.

The benefit of hierarchy is that it cuts the combinatorial explosion into stages. The goal is not to find the complete answer in one shot, but to lock onto a high-value region first and refine it layer by layer. That preserves the advantages of control-space search without letting the control layer itself turn into another source of mediocrity.
:::

Taken together, the four methods suggest a more general path:

```text
raw task
-> construct a control space
-> sample / search / recombine inside the control space
-> project back into output space
-> evaluate and validate
-> if rejected, roll back to the control space and iterate again
```

Dense sampling and recombination are especially useful for fishing rare high-value structures out of the support set. Writing the control space first is especially useful for stories, proposals, and other open-ended artifacts. Control-space search is the most general operational skeleton. Hierarchical control spaces keep the search tractable so the control layer does not collapse into a new form of mediocrity.
