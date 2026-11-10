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
  extraordinary: Positive probability-value alignment
  mediocre: LLM mediocrity
  local: Local alignment
  aligned: probability and value rise together
  misaligned: probability peak misses value peak
  partial: some regions align, others diverge
---

## Start With the Reverse Question

Models keep improving, and their capabilities keep expanding. A natural intuition follows: the problems that remain hard today may simply disappear after the next round of training, the next model generation, or the next scaling curve.

But the more useful question is the reverse one. **Can training and iteration solve *every* important problem?** If not, then some tasks are not merely "not solved yet." They hit ceilings that come from how large language models (LLMs) are built: their algorithms and their architecture.

Daily use keeps exposing this pattern. The same model can feel extremely capable on some tasks and still miss the final decisive step on others. You add context, specify the format, tighten constraints, ask for reflection, and request more versions. The answer becomes more complete, smoother, and better structured — yet the one thing you actually need still does not appear.

The cause is not simply that the model is not smart enough, or that the prompt is still wrong. The same model performs well elsewhere: compressing context, rewriting text, generating structure, expanding candidate options, explaining code, calling tools, and assisting validation. The real problem is that **local capability does not automatically become the task value you need.**

That is what this project calls **[LLM mediocrity](/glossary#llm-mediocrity)**: on some tasks, the language-probability system and the real problem domain are structurally mismatched. The model moves in the direction that is statistically natural, easy to continue, well supported, and broadly acceptable, while the actual value often depends on global structure, hidden state, a sharper specification, or a rare solution in a low-support region. **In other words, more training will not necessarily make these failures disappear. They have already hit a structural ceiling.**

So resisting LLM mediocrity does not mean optimizing prompts forever. It starts with a diagnosis: which parts of the task are already aligned with the model's generative strengths, which parts are only [locally aligned](/glossary#local-alignment), and which parts must be repaired through control spaces, validation, tools, human decisions, or hard-state governance?

Recognizing and resisting this mediocrity may become one of the most common tasks AI users face. The aim is not to suppress the model's generative ability. It is to keep what the model is really good at while preventing local fluency from passing for global value.

The whole site follows one chain. It first explains why some problems cannot be solved just by waiting for stronger models, then why probability and value diverge, and then uses the [six primitive mismatches](/glossary#six-primitive-mismatches) to locate the part that is actually stuck. Next come the governance objects — governed knowledge, execution, and escalation objects ([GKO](/glossary#gko) / [GExO](/glossary#gexo) / [GEsO](/glossary#geso)) and the Minimal Sufficient Human Query ([MSHQ](/glossary#mshq)) — together with the State-Governed Agent Regime ([SGAR](/glossary#sgar)). They turn the problem into engineering objects that can be searched, verified, and reused. Finally, [audit engineering](/glossary#audit-engineering) and experience write-back make the next round more stable than this one. These pages are not a loose set of essays; they trace one path from structural judgment to engineering delivery.

> **Note on scope**
>
> This framework began as a summary of engineering practice and engineering intuition. What matters most is whether it helps people reorganize tasks and get better engineering results, not whether it forms a mathematically complete final theory. Read the theory sections as thinking scaffolds that will keep changing as practice feeds back.

## The One-Page Map

The project distinguishes three regimes:

:::cards
### LLM Mediocrity
Tag: probability-value mismatch

The answers that are easy to generate are not the answers that carry the most task value. Iteration may improve surface quality without touching the bottleneck.

### Local Alignment
Tag: the common real-world regime

The model can perform many local operations well, such as compression, rewriting, enumeration, comparison, and structuring. But those local successes do not automatically compose into global success.

### Positive Probability-Value Alignment
Tag: probability and value align

When local continuation reliably points toward task value, autoregression is not the problem; it is the advantage. Context compression, semantic expansion, structured transformation, and register transfer often live here. The glossary lists this regime as [LLM excellence](/glossary#llm-excellence).
:::

The middle regime is the most common. A product memo, code review, customer reply, or research synthesis usually contains parts the model handles easily alongside parts that depend on hidden state, global coordination, rare evidence, or a value choice. The real question is not whether to use AI. It is where the alignment boundary lies, and how to turn the misaligned parts into intermediate tasks with lower mismatch.

## From a Fluent Draft to a Valuable Answer

Suppose you ask for a strategic recommendation. The model quickly produces a polished memo, but the right recommendation depends on a budget limit that was never stated. Asking the model to "make the memo better" will mostly improve the prose. It will not reveal the missing budget.

The useful move is to leave the final text alone for now and answer a sequence of narrower questions:

1. **What regime are we in?** The model is locally aligned: it can write and compare options well, but direct generation cannot guarantee the right recommendation.
2. **Why does local quality stop predicting success?** The main causes are state mismatch and specification mismatch: the budget state is unknown, and the dominant tradeoff was never made explicit.
3. **What structure must be made explicit before writing again?** Build an option matrix covering cost, speed, risk, and expected return.
4. **Which variables can the model still not supply by itself?** Verify the factual estimates in the matrix first, then ask the human to confirm the budget limit and the dominant objective.
5. **What should the model do once those variables are settled?** Write the final memo from the verified option matrix and the confirmed tradeoff.

Spelled out in full, these questions are the project's chain from diagnosis to delivery:

```text
identify the probability-value regime
-> diagnose the stuck part with the six primitive mismatches
-> turn the misaligned parts into governance objects (GKO / GExO / GEsO / MSHQ)
-> execute, verify, and commit state transitions in SGAR hard state
-> use audit engineering to write failure signals back as control deltas
-> generate the final answer from the governed state
```

Each arrow changes the task the model is actually solving. The chain is not a fixed procedure that every request must walk through. It is a reminder: when the real bottleneck is still upstream, stop spending time polishing the final answer.

### The Six Primitive Mismatches (From the Structural Theory of Value Preservation)

The six primitive mismatches serve the second step of the chain: diagnosing why ordinary output-space search gets stuck. For full definitions see [Six Primitive Mismatches](/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md); for the structural derivation see [A Structural Theory of Value Preservation](/docs/structural-theory-value-preservation-llm-systems.md).

::::cards
### Aggregation

Local improvements do not reliably add up to global value. A strategy can read well while missing the governing tradeoff; code modules can look correct while violating dependency order.

### Support

The valuable answer is hard to reach with the current model, search method, and budget. What is missing may be a rare frame, low-salience evidence, or a non-obvious failure mode.

### State

The right answer depends on hidden or changing state: market regime, production environment, user emotion, authority boundary, time window, or policy context.

### Specification

The proxy objective the system can optimize diverges from the real objective. The output satisfies the prompt, style, or rubric while missing the user's true success condition.

### Fitting Boundary

The model binds too tightly to a local evidence chain, proxy metric, role template, or feedback signal. The answer looks reasonable in one scenario but fails once the scenario, audit protocol, mechanism, or preference shifts to a neighboring one.

### Observation-Representation

The decisive world variable never enters the representation the model can access. The system needs measurement, raw evidence, tool feedback, a richer modality, logs, tests, or a structured control object before reasoning can close.
::::

If you would rather see how these concepts were first forced out of real engineering failures than how they are defined, read [Engineering Origins of the Six Primitive Mismatches](/docs/engineering-origins-of-six-primitive-mismatches.md). It reads like a discovery log: from large-scale quant sampling and the fight against autoregressive gravity to the corrections made along the way in story generation, financial tasks, and everyday hard problems.

## Who This Project Is For

This project is for people who already use LLMs frequently and have started to feel that "being good at prompting" is not enough.

It may be useful if you have run into patterns like these:

- The model can produce fluent answers, but the key judgment remains unreliable.
- Writing, research, code, investing, product, or collaboration tasks repeatedly produce outputs that look right but are not good enough.
- Prompt tricks no longer satisfy you; you want to understand *why* a task diverges from the model's generation tendency.
- You are building agents, workflows, evaluators, knowledge bases, or automation systems and need to put LLMs inside verifiable, reversible, governable processes.
- You care about human-AI collaboration: what should be delegated to the model, and which variables must remain human-governed.

The project does not assume the reader is an AI researcher. It cares more about engineering experience from real tasks: how to recognize mismatch, construct intermediate objects, design validation steps, and turn the model's local capabilities into actual task value.

## How to Read the Site

:::cards
### Start With Intuition
Tag: Why It Matters

If you want to understand why "the model is useful" and "the model fails on consequential tasks" can both be true, start with "Why It Matters." It explains the most common forms of mediocrity in real tasks and maps the everyday sense that "something is off" onto the six primitive mismatches.

### Read the Cases
Tag: V4 / V6 / Stock Rec / FW-Insight

If you want to see complete systems, start with "Cases." The case index gives the reading order: V4 for control-space governance, V6 for layered governance and plateau detection, Stock Rec V3 for financial production authority, and FW-Insight V3 for hard experiences that guide factor-framework regeneration.

### Then Read the Mechanism
Tag: Mechanism

If you care about the theory, read "Mechanism." It abstracts what the cases show into the three regimes, policy-value compression, and the six primitive mismatches (aggregation, support, state, specification, fitting-boundary, and observation-representation), and gives four ways to resist autoregressive gravity.

### Finally Move to Practice
Tag: Governance and collaboration

If you want to use the framework, read "Governance" and "Collaboration." The core method is to break hard tasks into intermediate objects that suit the model better (GKO / GExO / GEsO / MSHQ), commit the progress of long-horizon agents into hard state (SGAR), write failure signals back as control deltas through audit engineering, and let humans supply only the key variables AI cannot reliably obtain.
:::

## How to Resist LLM Mediocrity

The core principle is: **preserve the parts where the model is already strong, and transform the misaligned parts into task forms that are easier to generate, verify, and govern.**

:::cards
### Do Not Search Only in Final-Answer Space

For hard tasks, do not immediately ask for the final answer. First produce a state matrix, rubric, dependency graph, failure-mode list, candidate set, query plan, or structured outline so the model faces lower-mismatch subtasks.

### Externalize Control Knowledge

Important assumptions, constraints, boundaries, preferences, and revocation conditions should not be buried inside fluent prose. They should become checkable, reusable, weakenable, and revocable Governed Knowledge Objects (GKOs).

### Let Humans Govern Missing Variables

Humans should not merely proofread AI drafts. Their role is to set values, choose weights, authorize risk, provide real state, judge taste, and own responsibility. A good AI agent asks a Minimal Sufficient Human Query (MSHQ) instead of handing the whole task back to the human.

### Ground Long-Horizon Action in Hard State

For agents that must keep working over a long horizon, plans, tool calls, observations, validation results, human answers, and audit findings should all go into external hard state instead of living only in the chat context. Under the State-Governed Agent Regime (SGAR), "done" has to pass through evidence and validation; the agent's own narrative cannot declare it.
:::

In practice, a hard task should usually pass through a set of intermediate objects before it becomes final prose:

```text
input -> task model -> control objects (GKO / GEsO / MSHQ) -> hard state (SGAR) -> validation / audit -> final answer
```

These objects may be rubrics, state matrices, hard-state ledgers, dependency graphs, option sets, failure-mode lists, validation checklists, [GKOs](/glossary#gko), [Governed Escalation Objects (GEsOs)](/glossary#geso), or [Minimal Sufficient Human Queries (MSHQs)](/glossary#mshq). They are not there to add process for its own sake. They convert a high-mismatch final-output problem into smaller operations where the model's local strengths become useful again. [Audit engineering](/docs/audit-engineering-failure-localization-control-space-writeback.md) then structures each failure signal into a control delta, so the next round of search does not repeat the same mistake. To see this runtime chain inside a quantifiable framework, read the [Agent Harness Framework](/docs/agent-harness-framework.md).

## Where This Is Going

- **The public layer** explains LLM mediocrity, local alignment, and positive probability-value alignment to readers who have not read the papers.
- **The theory layer** develops the [six primitive mismatches](/glossary#six-primitive-mismatches), [Knowledge Governance](/glossary#knowledge-governance), [GKO](/glossary#gko) / [GExO](/glossary#gexo) / [GEsO](/glossary#geso) / [MSHQ](/glossary#mshq), the [State-Governed Agent Regime (SGAR)](/glossary#sgar), audit engineering, and the quantifiable relations among them at runtime. See [A Structural Theory of Value Preservation](/docs/structural-theory-value-preservation-llm-systems.md), the [Governed LLM Object Model and Interface Specification](/docs/governed-llm-object-model-interface-specification.md), and the [Agent Harness Framework](/docs/agent-harness-framework.md).
- **The engineering layer** builds up tools and templates that bring control objects, hard-state ledgers, validation loops, and minimal human intervention points into real tasks.
- **The collaboration layer** moves the human up from processing every task to governing value, authority, taste, budget, evidence, and responsibility. See [Governed Human-AI Collaboration](/docs/governed-human-ai-collaboration.md) and [Human-Assist Operational Mismatches](/docs/human-assist-operational-mismatches.md).

## Contributions Welcome

This project welcomes cases, criticism, and improvements.

The most useful contributions include:

- **Real task cases**: where LLMs look strong on the surface but final value remains unstable.
- **Engineering patterns**: how you split a task into control objects, validation objects, rubrics, or human decision points.
- **Failure samples**: prompts, agents, or workflows that looked reasonable but proved uncontrollable.
- **Conceptual corrections**: counterexamples, extensions, or clearer wording for LLM mediocrity, local alignment, mismatch, control space, GKO / GExO / GEsO / MSHQ, SGAR, audit engineering, and related concepts.
- **Tool implementations**: small components that turn these governance moves into code, templates, evaluators, or workflows.

A contribution does not need to be complete at first. A concrete failure case, a reproducible process, a sharper term, or an evidence-backed objection is worth more than general commentary.
