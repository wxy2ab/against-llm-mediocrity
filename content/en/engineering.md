---
key: engineering
lang: en
path: /engineering
title: Governance
navTitle: Governance
kicker: Concrete engineering practice based on the mechanism
summary: The engineering move is not to force the model to solve every hard task in final-answer space. It is to first build intermediate control objects and hard-state objects that make the task easier to generate, verify, reuse, recover, and revoke.
order: 4
heroPoints:
  - Do not blindly add more final-answer sampling before asking whether the bottleneck is support, search, or validation.
  - Governance works by building a control space first, then searching, projecting, validating, and writing experience back.
  - The control space itself should be searched rather than designed once and treated as fixed.
---

## What Governance Is Actually Doing

Governance is not about making the model behave more strictly, and it is not about writing longer prompts. What it really does is take a problem that is hard to solve directly in final-output space and rewrite it as a workflow that is easier to search, verify, and roll back.

Many failed tasks originally look like this:

```text
input -> direct final-answer sampling -> repeated polishing -> still wrong
```

After governance, the shape is closer to this:

```text
input -> build a control space -> search in control space -> project back into output space -> validate -> write experience back
```

In one line: **do not let the model keep struggling inside final-answer space; first give it an intermediate layer that is easier to search.**

This page follows directly from the mechanism page. When local fluency no longer predicts global value, the question is not "how many more versions should we sample?" but "what must be made explicit before generation?" Governance translates the six mismatches into engineering moves: construct control spaces, add measurement or raw evidence, separate evaluators, preserve experience, govern agent state, and pass any remaining variables to collaboration protocols when needed.

For full engineering examples, return to "Cases." Story Insight V4 applies this workflow through a narrative logic space, evaluator, and defect attacker. V6 then shows the next layer: once a control space exists, the system must route problems across MetaSpace, LogicSpace, text, continuity, and evaluation contracts.

### From Mechanism to Governance: Four Core Objects

The mechanism layer diagnoses with mismatches; the governance layer acts through objects. The four objects below stitch diagnosis, action, and human governance into one executable chain. They correspond to the [Governed LLM Object Model and Interface Specification](/docs/governed-llm-object-model-interface-specification.md) and [A Structural Theory of Value Preservation](/docs/structural-theory-value-preservation-llm-systems.md):

- **[Governed Knowledge Object (GKO)](/glossary#gko)**: stores task-specific control knowledge (verified claims, conditions, priorities, lifecycle, revocation rules).
- **[Governed Escalation Object (GEsO)](/glossary#geso)**: stores when to escalate, to whom, what to ask, and what can be done while waiting.
- **[Minimal Sufficient Human Query (MSHQ)](/glossary#mshq)**: the instantiation of a GEsO in a single interaction; it asks only for the minimal variable needed to restore autonomy.
- **[State-Governed Agent Regime (SGAR)](/glossary#sgar)**: renders local solving surfaces from globally authoritative state, composes stages through public protocols, and commits verified plans, actions, observations, decisions, and residuals to an external hard-state layer.

Together, the four turn governance from "a sense of process" into "objects and protocols."

### Going Further: Audit Engineering, SGAR, and the Collaboration Drafts

This verification and write-back mechanism can be developed into an independent discipline: **[Audit Engineering](/glossary#audit-engineering)**. It treats audit not as post-generation scoring but as a structured process that turns findings into defect evidence, repair routes, control deltas, and regression tests — allowing underspecified user value to become explicit through iteration.

[Read "Audit Engineering for Governed LLM Systems"](/docs/audit-engineering-failure-localization-control-space-writeback.md)

For long-horizon agents, these control objects also need a hard-state layer. **[SGAR](/glossary#sgar)** preserves global goals, constraints, dependencies, and accepted facts, then renders a minimally sufficient projection for the current LLM solve. Stages connect through public protocols, while private reasoning and implementation remain decoupled. Plans, tool calls, observations, verification results, human answers, audit findings, and rollback decisions enter state through governed transitions. This avoids asking one context to carry the entire long-horizon problem or to serve as the sole authority on whether the task advanced.

[Read "State-Governed Agent Regime for Governed LLM Systems"](/docs/state-governed-agent-regime-for-governed-llm-systems.md)

If you want to place "Audit Engineering + SGAR + control space" inside a quantifiable, attributable runtime framework, continue with the [Agent Harness Framework](/docs/agent-harness-framework.md). That working draft defines Bridge and Action-Space Optimization separately and makes component main effects, interaction terms, and cross-model transfer explicit experimental targets.

Escalation protocols and human boundaries rest on **[Governed Human-AI Collaboration](/glossary#governed-human-ai-collaboration)** and **Human-Assist Operational Mismatches** (the five operational domains): ask the environment before asking the human; ask with an [MSHQ](/glossary#mshq); store recurring rules in a [GEsO](/glossary#geso); and let long-horizon agents regain autonomy in hard state.

[Read "Governed Human-AI Collaboration"](/docs/governed-human-ai-collaboration.md) · [Read "Human-Assist Operational Mismatches"](/docs/human-assist-operational-mismatches.md)

## A More Useful Governance Workflow

The workflow can be described in seven steps:

1. **Output-space sampling**: Explore broadly in the original autoregressive space and collect rare but high-quality samples.
2. **Experience extraction**: Pull transferable control variables, generation operators, and failure boundaries out of those samples.
3. **Control-space construction**: Rewrite the original task into a lower-dimensional, composable, and verifiable intermediate representation.
4. **Control-space search**: Stop sampling only final answers; search the control space with beam search, tree search, evolutionary search, or local repair.
5. **Output-space projection**: Render the control plan back into final text, code, strategy, or artifact.
6. **Layered validation**: Apply hard constraints, soft scoring, reverse attacks, and external tools.
7. **Experience write-back**: Write both successes and failures into the experience base for the next round.

The loop looks like this:

```text
output-space sampling
-> experience extraction
-> control-space construction
-> control-space search
-> output-space projection
-> layered validation
-> experience write-back
```

:::takeaway
This works better than asking for "one more version" because each step changes the problem itself instead of merely changing the phrasing.
:::

## The Control Space Should Also Be Searched

It is tempting to think of a control space as something you design once and then keep fixed. In practice, the safer view is that **the control space itself should be searched**.

There are at least two layers here:

:::cards
### Inner Search
Tag: given a control space C

Given a fixed control space, search for the best output inside it. For example, under one story scaffold, one rubric, or one dependency graph, which concrete candidate is best?

### Outer Search
Tag: compare different control spaces

Do not assume one control space is already right. Compare C1, C2, C3 and ask which one more reliably produces high-quality outputs. Many breakthroughs come from changing the control space rather than searching harder inside the same one.
:::

So governance is not "design a control space and stop." It is "search the outputs and the control spaces together."

## First Ask What Is Actually Missing

When a task goes wrong, "the model is not strong enough" is usually too vague to act on. A more useful diagnosis asks whether the bottleneck is **support**, **search**, or **validation**.

::::cards
### Support Deficit
Tag: no good candidates appear

No matter how much you sample, the system never reaches a good region, because it lacks the material, knowledge, or capability to get there. More search alone will not help. You need external knowledge, examples, tools, retrieval, finetuning, or a stronger model.

### Search Deficit
Tag: good samples appear, but not reliably

The good answer exists, but the path to it is weak. This is where control spaces, tree search, recombination, hierarchical search, and local repair become powerful.

### Validation Deficit
Tag: good and bad candidates are mixed together

The system can already produce some good candidates, but it cannot reliably identify them. What you need is a stronger judge, pairwise comparison, automatic verification, or reverse attacks.
::::

These three cases must be separated because the intervention changes completely:

- If the problem is **support**, adding more search does not help.
- If the problem is **search**, control space is often extremely effective.
- If the problem is **validation**, more sampling can become dangerous because you get more candidates that merely fool the evaluator.

## What Goes Into a Control Space

A control space does not need to resemble the final answer. It is better understood as a set of intermediate objects that expose the variables that actually determine quality.

Typical control objects include:

- state matrices
- [hard-state ledgers](/glossary#sgar) (first-class objects in SGAR)
- rubrics
- candidate frames
- failure-mode lists
- dependency graphs
- query plans
- constraint lists
- role configurations
- promise-payoff chains
- transition records
- governance objects: [Governed Knowledge Objects (GKOs)](/glossary#gko), [Governed Escalation Objects (GEsOs)](/glossary#geso), and [Minimal Sufficient Human Queries (MSHQs)](/glossary#mshq)

A good control space usually has three properties:

- **Lower-dimensional**: easier to search than the final answer
- **Composable**: local structures can be recombined rather than regenerated from scratch
- **Verifiable**: constraints, evidence, and failure boundaries can be checked directly instead of inferred from surface plausibility

## Separate the Generator From the Evaluator

Do not let the same model in the same context generate, evaluate, and revise. That setup easily creates path dependence, because the model tends to defend its earlier choices rather than seriously challenge them.

A more stable arrangement separates roles:

:::cards
### Generator

Produces candidates and does not defend them.

### Critic

Attacks candidates and looks for hidden failures, contradictions, pseudo-depth, and weak structure.

### Editor

Repairs locally instead of reinventing the whole artifact.

### Judge

Makes the final selection using a different context, different prompt, and ideally a different evaluation criterion.
:::

Even when the underlying model is the same, use separate contexts to simulate role separation. For verifiable tasks, it is even better to add a dedicated verifier or external tool. In many tasks, **verification is easier than generation**, and once the verifier improves, overall quality rises sharply.

## Do Not Store Only Positive Experience

Extracting positive experience from strong samples is valuable, but it is not enough on its own. If you store only success patterns, the system can still repeat the same family of mistakes in slightly different surface forms.

A better experience base has two parts:

::::cards
### Positive Library
Tag: patterns that reliably improve quality

Store structures, control variables, generation operators, validation moves, and search strategies that repeatedly raise quality.

### Negative Library
Tag: patterns that look impressive but often fail

Store recurring pseudo-quality patterns. Negative experience is often more transferable because it cuts off large regions of low-value search.
::::

In a story task, negative experience might include:

- using setting complexity as a substitute for depth
- using twists as a substitute for character choice
- using quotable lines as a substitute for emotional accumulation
- using tragic events as a substitute for tragic structure
- using grand themes as a substitute for concrete conflict
- using "he suddenly understood" as a substitute for behavioral change

These are not minor notes. They are search-pruning tools.

## Search for Novelty, Not Only Quality

If each round keeps only the current top-scoring samples, you can still get trapped in a larger local optimum. High score is not the same as high coverage, and it is not the same as recombination value.

A better approach keeps multiple terms in the scoring function:

```text
total score = quality score + novelty score + constraint satisfaction score - risk score
```

Novelty here is not about being strange for its own sake. It is about expanding the coverage of material available for recombination. A genuinely valuable sample may not be the current best overall sample; it may be the one with an unusually strong local structure that is not yet globally mature.

So sample selection should keep at least three kinds of candidates:

1. **Highest total-score samples**
2. **Samples that are exceptionally strong on one local dimension**
3. **Samples most different from the current strong set**

The third group is especially important because it often supplies the material needed to escape the current local optimum.

## Derive Control Space Backward From Failure

A control space does not have to be derived only from good samples. It can also be derived backward from failure modes — a useful move we call **reverse control-space construction**.

Common story failure modes include:

- flat
- cliche
- shallow characters
- weak ending
- vague theme

Those labels are not useful while they stay at the adjective level. The productive question is which control variable is missing underneath each failure.

::::cards
### Flat

Usually not a prose problem, but a lack of mutually incompatible choices.

### Cliche

Usually not a wording problem, but an overused conflict structure.

### Shallow Characters

Usually not a lack of description, but a lack of genuine tension among desire, fear, shame, and action.

### Weak Ending

Usually not a pacing problem, but a lack of earlier promises or a failure to pay them off.

### Vague Theme

Usually not an unimpressive theme, but a failure to make characters pay a cost for the theme through choice.
::::

If you push those failures backward, the control space should explicitly include variables such as:

- mutually incompatible constraints
- internal contradiction in the character
- cost functions
- promise-payoff chains
- escalating scene pressure
- irreversible choice points

That is far more useful than an instruction such as "make the story deeper," because it turns a vague desire into searchable and verifiable control variables.

## Treat Validation as Engineering: The Audit Engineering View

[Audit Engineering](/docs/audit-engineering-failure-localization-control-space-writeback.md) treats "finding the failure" and "repairing the failure" as two different kinds of engineering work, and requires audit findings to be rewritten as executable control deltas:

- **Defect evidence**: which primitive mismatch dominates? Which counterexample or perturbation was used?
- **Repair routing**: change a GKO? The rubric? The dependency graph? A hard-state transition?
- **Regression tests**: the failure mode is recorded as a replayable check instead of staying only in a log.
- **Control delta**: the audit result changes the shape of the next control space instead of only commenting on the previous answer.

Under SGAR, these control deltas are written into hard state through governed state transitions, so an agent can continue from them even after an interruption.

## Five Operational Domains: When to Escalate to a Human

[Human-Assist Operational Mismatches](/docs/human-assist-operational-mismatches.md) breaks "what AI cannot reliably decide" into five operational domains, each with its own escalation threshold:

1. **Information and evidence**: can the environment, a tool, retrieval, or a test supply the factual state? If so, the agent should not ask a human too early.
2. **Value and specification**: has the real objective been externalized as a rubric, acceptance criteria, or counterexamples?
3. **Authority and responsibility**: does an external or irreversible action need approval? Such actions must be escalated.
4. **Boundary and timing**: does the rule still apply? Has a revocation condition been triggered?
5. **Coordination and control representation**: does the current task representation, decomposition, workflow, or handoff omit a decisive dependency? The agent should first build a task model, dependency graph, or workflow by itself, and escalate only when the controlling representation or organizational process cannot be inferred or verified.

These five domains map onto the MSHQ, the GEsO, and the hard-state update in [Governed Human-AI Collaboration](/docs/governed-human-ai-collaboration.md). When it escalates, the agent follows the GEsO and asks only an MSHQ instead of handing the whole task back to the human. While waiting, it does reversible preparation: candidate matrices, low-cost experiments, rollback paths. When the answer arrives, the answer is committed to hard state and the agent resumes autonomy.

## A More Practical Engineering Judgment

Governance should not be maximized on every task. The tasks that really justify it usually show a few signals:

- Repeated sampling rarely produces stable good results
- Strong outputs appear occasionally, but cannot be reproduced
- Good candidates exist, but the system cannot reliably choose them
- The cost of error is high enough that surface plausibility is not acceptable
- Similar tasks will recur often enough that an experience base is worth building

By contrast, if the task is mostly compression, rewriting, format conversion, or routine candidate generation, direct generation is often already enough and heavy governance is unnecessary.

The point of governance is never to make the process feel more elaborate. It is to make search more effective, validation more reliable, and experience more cumulative. A good governed system does not make the model generate less; it makes the model generate in the right task shape.
