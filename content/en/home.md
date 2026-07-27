---
key: home
lang: en
path: /
title: Against LLM Mediocrity
navTitle: Home
kicker: Start with the structural ceiling
summary: "Models keep improving, but not every important problem will be solved by more training. This project asks which failures belong to the structural ceilings of LLMs and how engineering can route around, constrain, compensate for, or redesign them."
order: 0
heroVisual: alignment
heroPoints:
  - "Phenomenon: model capability keeps improving, yet some tasks stay stuck in the same failure class no matter how much you iterate or prompt."
  - "Diagnosis: some of those failures are not temporary capability gaps but structural splits between probability paths and value paths."
  - "Method: identify the ceiling first, then move the repair into control objects, validation, tools, hard state, and human governance."
alignmentLabels:
  probability: statistical probability
  value: task value
  extraordinary: Autoregressive extraordinary
  mediocre: LLM mediocrity
  local: Local alignment
  aligned: probability and value rise together
  misaligned: probability peak misses value peak
  partial: some regions align, others diverge
---

## Start With the Reverse Question

Models keep improving, and their capabilities keep expanding. A natural intuition follows: the problems that remain hard today may simply disappear after the next round of training, the next model generation, or the next scaling curve.

But the more useful question is the reverse one. **Can training and iteration solve *every* important problem?** If not, then some tasks are not merely "not solved yet." They are constrained by ceilings that follow from the algorithmic and architectural character of large language models (LLMs).

Daily use keeps exposing this pattern. The same model can feel extremely capable on some tasks and still miss the final decisive step on others. You add context, specify the format, tighten constraints, ask for reflection, and request more versions. The answer becomes more complete, smoother, and better structured — yet the one thing you actually need still does not appear.

This is not simply that the model is not smart enough, and it is not only that the prompt is still wrong. The same model can perform well elsewhere: compressing context, rewriting text, generating structure, expanding candidate options, explaining code, calling tools, and assisting validation. The real problem is that **local capability does not always become the task value you need.**

That is what this project calls **[LLM mediocrity](/glossary#llm-mediocrity)**: on some tasks, the language-probability system and the real problem domain are structurally mismatched. The model may move along the direction that is statistically natural, easy to continue, well supported, or broadly acceptable, while the actual value depends on global structure, hidden state, a sharper specification, or a rare low-support move. **In other words, some failures do not merely wait for more scale. They are already touching a structural ceiling.**

The response is not to keep optimizing prompts indefinitely. The first question is diagnostic: which parts of the task are already aligned with the model's generative strengths, which parts are only [locally aligned](/glossary#local-alignment), and which parts must be repaired through control spaces, validation, tools, human decisions, or hard-state governance?

Recognizing and resisting this mediocrity may be the most common task AI users face. The practical aim is to preserve the model's real strengths while preventing local fluency from masquerading as global value.

The site follows that order. It starts by asking why some problems cannot be solved just by waiting for stronger models, then explains why probability and value diverge, and finally turns the divergent parts into control spaces, validation objects, and [minimal human questions](/glossary#mshq). These pages are not separate essays; they trace a single path from structural judgment to diagnosis to delivery.

> **Note on scope**
>
> This framework starts as a summary of engineering practice and engineering intuition. What matters most here is whether it helps people reorganize tasks and improve practical engineering outcomes, not whether it forms a mathematically complete final theory. The theory sections are better understood as adjustable thinking scaffolds that will keep changing with practice.

## The One-Page Map

The project distinguishes three regimes:

:::cards
### LLM Mediocrity
Tag: probability-value mismatch

The answers that are easy to generate are not the answers that carry the most task value. Iteration may improve surface quality without touching the bottleneck.

### Local Alignment
Tag: the common real-world regime

The model can perform many local operations well, such as compression, rewriting, enumeration, comparison, and structuring. But those local successes do not automatically compose into global success.

### Autoregressive Extraordinary
Tag: probability and value align

When local continuation reliably points toward task value, autoregression is not the problem; it is the advantage. Context compression, semantic expansion, structured transformation, and register transfer often live here.
:::

The common case is the middle one. A product memo, code review, customer reply, or research synthesis may contain parts that are easy for the model to handle alongside parts that depend on hidden state, global coordination, rare evidence, or a value choice. The real question is not whether to use AI, but where the alignment boundary lies.

## From a Fluent Draft to a Valuable Answer

If you want to see not only how the six mismatches are defined but how they were first forced out of real engineering failure, read [Engineering origins of the six primitive mismatches](/docs/engineering-origins-of-six-primitive-mismatches.md). It works more like a discovery log, following the path from large-scale quant sampling and autoregressive gravity to story generation, finance, and everyday hard problem solving.

Suppose you ask for a strategic recommendation. The model produces a polished memo, but the recommendation depends on a budget limit that was never stated. Asking it to "make the memo better" will mostly improve the prose. It will not reveal the missing budget.

The useful move is to stop treating the draft as the whole problem and ask a sequence of narrower questions:

1. **What regime are we in?** The model is locally aligned: it can write and compare options well, but direct generation cannot guarantee the right recommendation.
2. **Why does local quality stop predicting success?** This is primarily state and specification mismatch: the budget is hidden, and the preferred tradeoff is unknown.
3. **What should become explicit before writing again?** Build an option matrix showing cost, speed, risk, and expected return.
4. **What still cannot be supplied by the model?** Validate the factual estimates, then ask the human to confirm the budget and dominant objective.
5. **What should the model do after those variables are resolved?** Render the final memo from the validated option matrix and chosen tradeoff.

That sequence is the project's diagnostic-to-delivery chain:

```text
identify the probability-value regime
-> diagnose the mismatch that blocks global value
-> construct an intermediate object that exposes the missing structure
-> validate evidence or obtain the human-governed variable
-> render the final answer from the governed state
```

Each arrow changes the task the model is actually solving. The chain is not a mandatory workflow for every request — it is a way to avoid repeatedly polishing the final answer when the real bottleneck lives upstream.

The six primitive mismatches help diagnose the second step in that chain:

::::cards
### Aggregation

Local improvements do not reliably add up to global value. A strategy can read well while missing the governing tradeoff; code modules can look correct while violating dependency order.

### Support

The valuable answer is hard to reach under the current model, search method, and budget. The missing move may be a rare frame, low-salience evidence, or non-obvious failure mode.

### State

The right answer depends on hidden or changing state: market regime, production environment, user emotion, authority boundary, time window, or policy context.

### Specification

The accessible proxy objective diverges from the real objective. The output satisfies the prompt, style, or rubric while missing the user's true success condition.

### Fitting Boundary

The model over-binds to a local evidence chain, proxy metric, role template, or feedback signal. The answer looks reasonable in one scene but fails under nearby scene, audit, mechanism, or preference shifts.

### Observation-Representation

The decisive world variable never enters the model-accessible representation. The system needs measurement, raw evidence, tool feedback, richer modality, logs, tests, or a structured control object before reasoning can close.
::::

## Who This Project Is For

This project is for people who already use LLMs frequently and have started to feel that "being good at prompting" is not enough.

It may be useful if you have run into patterns like these:

- The model can produce fluent answers, but the key judgment remains unreliable.
- Writing, research, code, investing, product, or collaboration tasks repeatedly produce outputs that look right but are not good enough.
- You want to understand *why* a task diverges from the model's generation tendency instead of collecting more prompt tricks.
- You are building agents, workflows, evaluators, knowledge bases, or automation systems and need to put LLMs inside verifiable, reversible, governable processes.
- You care about human-AI collaboration: what should be delegated to the model, and which variables must remain human-governed.

The project does not assume the reader is an AI researcher. It is more interested in engineering experience from real tasks: how to recognize mismatch, construct intermediate objects, design validation steps, and turn the model's local capabilities into actual task value.

## How to Read the Site

:::cards
### Start With Intuition
Tag: Why It Matters

If you want to understand why "the model is useful" and "the model fails on consequential tasks" can both be true, start with "Why It Matters." It explains the common forms of mediocrity in real tasks.

### Read the Cases
Tag: V4 / V6 / Stock Rec / FW-Insight

If you want to see complete systems, start with "Cases." The case index gives the reading order: V4 for control-space governance, V6 for layered governance and plateau detection, Stock Rec V3 for financial production authority, and FW-Insight V3 for hard experiences that guide factor-framework regeneration.

### Then Read the Mechanism
Tag: Mechanism

If you care about the theory, read "Mechanism." It abstracts the case into the three regimes, policy-value compression, and the six primitive mismatches: aggregation, support, state, specification, fitting-boundary, and observation-representation.

### Finally Move to Practice
Tag: Governance and collaboration

If you want to use the framework, read "Governance" and "Collaboration." The practical move is to transform hard tasks into intermediate objects the model can handle well, commit long-horizon agent progress into hard state, and let humans supply only the variables AI cannot reliably obtain.
:::

## How to Resist LLM Mediocrity

The core principle is: **preserve the parts where the model is already strong, and transform the misaligned parts into task forms that are easier to generate, verify, and govern.**

:::cards
### Do Not Search Only in Final-Answer Space

For hard tasks, do not immediately ask for the final answer. First produce a state matrix, rubric, dependency graph, failure-mode list, candidate set, query plan, or structured outline so the model faces lower-mismatch subtasks.

### Externalize Control Knowledge

Important assumptions, constraints, boundaries, preferences, and revocation conditions should not be buried inside fluent prose. They should become checkable, reusable, weakenable, and revocable Governed Knowledge Objects (GKOs).

### Let Humans Govern Missing Variables

Humans should not merely proofread AI drafts. Their role is to set values, choose weights, authorize risk, provide real state, judge taste, and own responsibility. A good agent asks the minimal sufficient question instead of handing the entire task back to the human.
:::

In practice, this means a hard task should often move through artifacts before it moves into final prose:

```text
input -> task model -> control objects -> validation / escalation -> final answer
```

Those artifacts may include rubrics, state matrices, hard-state ledgers, dependency graphs, option sets, failure-mode lists, validation checklists, [GKOs](/glossary#gko), [Governed Escalation Objects (GEsOs)](/glossary#geso), or [Minimal Sufficient Human Queries (MSHQs)](/glossary#mshq). They are not bureaucracy for its own sake; they convert a high-mismatch final-output problem into smaller operations where the model's local strengths become useful again. For the runtime-science view of that chain, read the [Agent Hardness Framework](/docs/agent-hardness-framework.md).

## Where This Is Going

- The public layer will explain LLM mediocrity, local alignment, and autoregressive extraordinary without requiring the reader to begin with the paper.
- The theory layer develops the [six primitive mismatches](/glossary#six-primitive-mismatches), [Knowledge Governance](/glossary#knowledge-governance), [GKO](/glossary#gko) / [GExO](/glossary#gexo) / [GEsO](/glossary#geso), the [State-Governed Agent Regime (SGAR)](/glossary#sgar), governance loops, and the quantifiable runtime view in the [Agent Hardness Framework](/docs/agent-hardness-framework.md).
- The engineering layer turns control objects, hard-state ledgers, validation loops, and minimal human intervention points into usable tools and templates.
- The collaboration layer reframes the human role: not as a processor of every task, but as the governor of value, authority, taste, budget, evidence, and responsibility.
- **The public layer** will explain LLM mediocrity, local alignment, and autoregressive extraordinary without requiring the reader to begin with the paper.
- **The theory layer** develops the [six primitive mismatches](/glossary#six-primitive-mismatches), [Knowledge Governance](/glossary#knowledge-governance), [GKO](/glossary#gko) / [GExO](/glossary#gexo) / [GEsO](/glossary#geso), the [State-Governed Agent Regime (SGAR)](/glossary#sgar), governance loops, and the quantifiable runtime view in the [Agent Hardness Framework](/docs/agent-hardness-framework.md).
- **The engineering layer** turns control objects, hard-state ledgers, validation loops, and minimal human intervention points into usable tools and templates.
- **The collaboration layer** reframes the human role: not as a processor of every task, but as the governor of value, authority, taste, budget, evidence, and responsibility.

## Contributions Welcome

This project welcomes cases, criticism, and improvements.

The most useful contributions include:

- **Real task cases**: where LLMs look strong on the surface but final value remains unstable.
- **Engineering patterns**: how you split a task into control objects, validation objects, rubrics, or human decision points.
- **Failure samples**: prompts, agents, or workflows that looked reasonable but proved uncontrollable.
- **Conceptual corrections**: counterexamples, extensions, or clearer wording for LLM mediocrity, local alignment, mismatch, control space, and related concepts.
- **Tool implementations**: small components that turn these governance moves into code, templates, evaluators, or workflows.

A contribution does not need to be complete at first. A concrete failure case, a reproducible process, a sharper term, or an evidence-backed objection is more valuable than generic agreement.
