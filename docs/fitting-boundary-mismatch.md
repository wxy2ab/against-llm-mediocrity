# Fitting-Boundary Mismatch

## A Working Draft on the Fifth Primitive Mismatch

**Status:** Working draft  
**Main manuscript:** [Knowledge Governance for Large Language Model Systems](knowledge-governance-llm-systems-local-alignment.md)

## Abstract

**Fitting-boundary mismatch** occurs when, during training, fine-tuning, alignment, or inference, a model learns an implicit trigger boundary for some capability, strategy, audit structure, or behavior pattern X. The boundary at which the model actually triggers X does not match the true domain in which X applies.

It has two directions:

- **Overfitting side / over-triggering side:** X is used where it should not be used.
- **Underfitting side / under-triggering side:** X is not used where it should be used.

In one sentence:

> The model has learned capability X, but not the boundary of X.

More briefly:

> The capability exists; the routing is wrong.

"Capability-boundary mismatch," "adaptation-boundary mismatch," and "joint over/under-fitting mismatch" can all serve as secondary names.

The formal name is **fitting-boundary mismatch** because the phenomenon is not ordinary training-set overfitting. It is a misalignment between the high-dimensional trigger domain of a capability and the true domain in which that capability applies.

This mismatch fills a direction not fully covered by the first four primitive mismatches. Aggregation mismatch is **over-averaging**: many different situations are compressed into one high-probability answer. Fitting-boundary mismatch is **boundary displacement**: the wrong capability is over-triggered, or the right capability is not triggered.

## 1. Core Definition

Suppose X is a capability, strategy, audit structure, or behavior pattern that the model has learned, or approximately learned.

Define:

- $T_X$: the real-world task region in which X should be used;
- $M_X$: the task region in which the model actually activates X.

The ontology of the fifth mismatch is:

\[
M_X \ne T_X
\]

The two directions are:

\[
\text{overfitting side} = M_X \setminus T_X
\]

That is, the model wrongly absorbs situations that do not belong to X into X.

\[
\text{underfitting side} = T_X \setminus M_X
\]

That is, situations that truly belong to X do not trigger X.

Thus the strict definition of the fifth mismatch is:

> The implicit trigger boundary of a learned capability does not match that capability's true boundary of application.

An error should be classified as fitting-boundary mismatch only when the following conditions hold:

1. The relevant capability, strategy, audit structure, or behavior pattern already exists, or at least approximately exists.
2. The problem does not mainly come from complete data absence, wholly unclear specification, unobservable state, or an inability to aggregate local results.
3. The error appears as a capability being triggered incorrectly, or not being invoked when it should be.
4. Adjusting capability routing, trigger thresholds, or boundary recognition could plausibly repair the error directly.

## 2. Why Not "Induction Mismatch," and Why Not Just "Overfitting Mismatch"

"Induction" emphasizes inferring a general conclusion from local samples. That covers part of fitting-boundary mismatch, but it is not the essence.

Fitting-boundary mismatch is broader. It includes not only mistaken extrapolation from sample to population, but also:

- excessive binding to a local evidence chain;
- excessive optimization of a local metric;
- excessive application of a scene default;
- self-reinforcement of an early solution path;
- excessive adaptation to professional language or role posture;
- excessive accommodation of an alignment preference function;
- excessive response to local user feedback;
- shortcut learning from high-frequency explanation templates in the training corpus.

So "induction mismatch" is only one surface form.

If we call it only "overfitting mismatch," we capture another important phenomenon: the high-dimensional structure of capability X spills over into $X_t$, so situations that should not use X are wrongly absorbed. This is the **overfitting side** of the fifth mismatch.

But the same error often also has an **underfitting side**: the model should activate capability Y, but does not. In the quantitative-finance case, the model not only over-triggered "conservative quantitative risk control," but also under-triggered capabilities it already had or approximately had: mechanism-to-operator translation, event-strategy auditing, multi-day holding, and conditional alpha search.

Therefore the ontology of the fifth mismatch is not that a capability is simply too strong. It is:

> The trigger domain of a capability does not overlap with its true domain of application.

Overfitting and underfitting are not two independent primitive classes. They are two error directions along the same fitting boundary.

## 3. Underlying Mechanism: Capability Routing and Boundary Displacement

A model must not only learn capability X. It must also implicitly learn a router: what contexts should activate X, when X should not be activated, and how strongly X should participate.

The underlying mechanism of fitting-boundary mismatch is that this implicit router's decision boundary does not match the true task boundary.

Here, **capability-shaping spillover / capability-attractor spillover** is the main mechanism on the overfitting side, while **capability-boundary contraction / capability under-triggering** is the main mechanism on the underfitting side.

To give the model capability X, training reinforces a set of high-dimensional patterns in a shared representation space:

```text
a certain class of context
-> activates X-related latent features
-> enters X's probabilistic attractor
-> outputs X-style judgment, language, audit, or action
```

The problem is that this attractor is not a cleanly bounded module. It does not have a simple switch:

```text
if task == X:
    use skill X
else:
    leave everything unchanged
```

The more realistic structure is:

```text
context embedding enters shared representation
-> many latent features activate
-> X-related attractor partially activates
-> output distribution is globally reshaped
```

This yields four outcomes:

- The case truly belongs to X and X is activated: correct triggering.
- The case does not belong to X but X is activated: overfitting side / false positive.
- The case belongs to X but X is not activated: underfitting side / false negative.
- The case does not belong to X and X is not activated: correct inhibition.

This is the underlying form of the fifth mismatch:

> Capabilities are not added for free. Every act of capability shaping changes both the capability itself and its trigger boundary.

### 3.1 Capabilities Are Not Stored Modularly

LLM capabilities are highly distributed. The same parameters and intermediate representations participate in:

- factual recall;
- style control;
- mathematical reasoning;
- safety refusal;
- polite expression;
- professional language;
- programming patterns;
- user-intent recognition;
- multi-turn state maintenance;
- tool-call tendency;
- conclusion-strength calibration.

Thus optimizing some capability X can change the activation boundaries of other capabilities. In machine learning, this corresponds to **interference**, **negative transfer**, and **representation entanglement**. Scaling models can reduce crude interference, but it does not automatically make all capabilities orthogonal.

### 3.2 Training Objectives Are Multi-Objective Compression

LLM training does not optimize one clean objective. It compresses many objectives at the same time:

- predict the next token;
- follow instructions;
- avoid hallucination;
- avoid offense;
- avoid leaking sensitive content;
- appear professional;
- appear helpful;
- remain safe;
- adapt to user style;
- pass benchmarks;
- satisfy human preferences;
- complete tool tasks;
- remain consistent across multi-turn dialogue.

These objectives cannot be compatible everywhere. Training is closer to searching for a high-dimensional Pareto compromise.

So acquiring capability X often comes with local side effects:

- More safe may mean more conservative.
- Better at refusal may mean more false refusals.
- Better at accommodating the user may mean more sycophancy.
- Better at reasoning may mean better at fabricating reasoning chains.
- Better at writing may mean better at hiding factual weakness behind style.
- Better at quantitative risk control may mean earlier No-Go decisions.
- Better at avoiding overfitting may mean less search.
- Better at tool use may mean less internal thinking.
- Better at structured answers may mean forcing unclear problems into fixed templates.

This is the machine-learning version of repairing one wall by taking bricks from another.

### 3.3 Autoregression Turns Capabilities into Path Biases

An autoregressive model does not solve for a global optimum in one step. It generates token by token. Early tokens create path dependence.

For example, once the model begins:

> This may be caused by insufficient data.

it becomes more likely to continue:

> New orthogonal data is needed.

and then:

> The current data is already near its limit.

Thus a "professional conservative mode" learned during training becomes a path attractor during inference. The model may not be unaware of "operator expansion," "audit correction," or "conditional alpha search." But once it enters the track of "insufficient data / anti-overfitting / No-Go," later output tends to maintain that track.

The autoregressive problem is therefore:

> Capability X is not only a kind of knowledge. It is a continuation inertia.

### 3.4 Capability-Boundary Error

Fitting-boundary mismatch does not mean the model lacks capability X. On the contrary, it often occurs because the model already has some capability X, and that capability has been strengthened during training or alignment.

The problem is:

> The model does not know where X applies.

More precisely:

> Training has made X into a probability field, not an invocable module with a strict boundary.

The boundary can shift in two directions:

- **Too wide:** the model has learned something, but it covers too much and damages adjacent situations.
- **Too narrow:** the model has a capability, but invokes it only in a few high-confidence situations, causing low adoption and under-search.

This differs from support mismatch. Support mismatch means the relevant capability or high-value structure lacks support and is therefore hard to reach. Fitting-boundary mismatch requires that the relevant capability already exists or approximately exists; its invocation boundary is wrong.

## 4. Two-Axis Structure: Formation Stage and Error Direction

Fitting-boundary mismatch should be analyzed along two distinct dimensions: the stage at which it forms or appears, and the direction in which the boundary is displaced.

### 4.1 Training-Time Fitting-Boundary Mismatch

This is the more fundamental layer. To give the model capability X, training, fine-tuning, or alignment simultaneously shapes the high-dimensional structure of X and its trigger boundary in shared representation space. But because this structure is not modular or cleanly bounded, it can contaminate adjacent tasks $X_t$, or make X's invocation condition contract too narrowly.

Examples:

- training "safety refusal" causes false refusals for ordinary questions;
- training "caution and conservatism" causes under-search in scientific exploration;
- training "user friendliness" causes sycophancy;
- training "reasoning format" causes pseudo-reasoning;
- training "expert style" causes overconfident packaging;
- training "instruction following" causes excessive execution of bad instructions;
- training "concise answers" flattens complex problems.

### 4.2 Inference-Time Fitting-Boundary Mismatch

This is the surface layer in concrete interaction. In a single task or multi-turn conversation, the model may over-bind to local evidence, a local path, local language, or local context. It may also fail to invoke an available capability.

Examples:

- trying a few operators and then issuing a No-Go;
- hearing "quant" and applying "needs orthogonal data";
- hearing "sensitive" and refusing;
- hearing "the research is unsettled" and avoiding exploration;
- seeing strong user affect and beginning to accommodate it;
- seeing a benchmark and treating the benchmark as real capability.

The relation between the two layers is:

```text
training-time shaping of capabilities and their implicit boundaries
-> inference-time capability routing based on context
-> boundary too wide or too narrow
-> capability is over-triggered or under-triggered
```

### 4.3 Overfitting Side: Over-Triggering

The overfitting side corresponds to:

\[
M_X \setminus T_X
\]

The model treats cases that should not belong to X as X. Typical signs include:

- harmless questions are refused on safety grounds;
- open exploration tasks are judged No-Go too early;
- event strategies are wrongly audited as factor strategies;
- "the current search did not find it" is upgraded into "the data does not contain it";
- professional language replaces mechanism search.

This side mainly increases false positives.

### 4.4 Underfitting Side: Under-Triggering

The underfitting side corresponds to:

\[
T_X \setminus M_X
\]

The model already has, or approximately has, capability X, but does not activate it in cases that truly belong to X. Typical signs include:

- the model should expand operators, but does not;
- the model should audit a multi-day event strategy, but only audits next-day performance;
- the model should translate mechanisms into features, but stops at a coarse filter;
- the model should preserve unsearched space, but outputs a global No-Go;
- the model can perform mathematical checks, source verification, or state enumeration, but fails to invoke them this time.

This side mainly increases false negatives.

The overfitting and underfitting sides need not occur in a single sample at the same time, but in system design they are usually tightly coupled. Tightening a boundary can reduce false positives while increasing false negatives; loosening a boundary can increase coverage while increasing false triggers.

## 5. Boundary with the Other Four Mismatches

To prevent "underfitting" from swallowing the first four mismatch classes, the fifth class must satisfy a strict prerequisite:

> The model does not entirely lack the relevant support; the target is not wholly unclear; state belief is not incorrectly formed; and local results are not impossible to aggregate. The relevant capability, strategy, or audit mode already exists. The error mainly concerns whether it is invoked and where it is invoked.

Thus the fifth mismatch concerns **capability routing**. It does not ask "is the data present?", "is the goal clear?", "is the state visible?", or "can local results form a global result?" It asks:

> When should a capability the model has already learned be invoked, and when should it not be invoked?

### 5.1 Boundary with Aggregation Mismatch

Aggregation mismatch concerns the inability of locally good fragments to compose into a globally good answer. Its error direction is over-smoothing or over-averaging.

Fitting-boundary mismatch concerns the wrong invocation boundary of an already learned capability. It may bind a local explanation too strongly, or fail to invoke a capability that could coordinate the global result.

Examples:

- Aggregation mismatch: each scene in a story is good, but the overall theme and promise-payoff structure fail.
- Fitting-boundary mismatch: the system over-binds to a strong scene or early symbolic image, and all later revisions serve it at the expense of the whole story.

### 5.2 Boundary with Support Mismatch

Support mismatch concerns high-value structures that are hard to reach under the model policy or the current search operators.

Fitting-boundary mismatch does not mean the relevant capability is unreachable. On the contrary, alternative explanations or correct capabilities usually already lie within support, but are suppressed by wrong routing or fail to cross the trigger threshold.

Examples:

- Support mismatch: a rare but correct mechanism is never proposed by the model.
- Fitting-boundary mismatch: the model has operator-expansion or mechanism-search capability, but is routed into "insufficient data" mode, so the correct capability is not triggered.

### 5.3 Boundary with Specification Mismatch

Specification mismatch asks whether the proxy objective actually optimized by the system diverges from the true objective.

Fitting-boundary mismatch asks whether, when the target is relatively clear, the model invokes the wrong capability, proxy, template, or path, or fails to invoke the right capability.

Examples:

- Specification mismatch: the scoring rubric omits the real acceptance condition.
- Fitting-boundary mismatch: the scoring rubric itself is useful, but the model treats one score or benchmark as the whole objective.

### 5.4 Boundary with State Mismatch

State mismatch asks whether, at fixed accessible representation, the system forms, updates, and uses the state belief warranted by the evidence.

Fitting-boundary mismatch asks whether, when state belief is already accurate enough, the model still wrongly generalizes a capability that works in one state to other states, or fails to invoke the correct capability in the target state.

Examples:

- State mismatch: market evidence has changed, but the model still misranks the regime posterior or carries a stale belief.
- Fitting-boundary mismatch: the model treats a signal or risk-control logic that works in one regime as a cross-regime rule.

## 6. Machine-Learning Interpretation

Fitting-boundary mismatch can be understood through several machine-learning concepts.

### 6.1 Implicit Classifiers and Decision Boundaries

Capability invocation can be viewed as an implicit classifier or router: after receiving an input context, the model judges whether to activate capability X.

| ML structure | LLM manifestation |
|---|---|
| true positive | X should be used, and X is correctly activated |
| false positive | X should not be used, but is activated; overfitting side |
| false negative | X should be used, but is not activated; underfitting side |
| decision-boundary shift | X's actual trigger domain diverges from its true application domain |
| high precision, low recall | low hallucination, low adoption, under-search |
| high recall, low precision | high divergence, high hallucination, candidate flooding |

This explains why reducing hallucination and increasing adoption often trade off against each other. Tightening the trigger boundary can reduce misuse of a capability, but increase missed uses. Loosening the trigger boundary can improve coverage, but increase wrong invocation.

### 6.2 Local Empirical Risk Minimization

In the current scene A, the model selects a low-loss answer: it appears professional, reasonable, safe, and well structured.

But an answer with low loss in A is not guaranteed to have low loss in adjacent scenes B/C/D.

In LLM use, this often appears as:

- the answer flows smoothly;
- the terminology is professional;
- the risk posture looks responsible;
- the answer is highly structured;
- the current evidence supports part of the claim;
- but the conclusion is stated more strongly than the evidence allows.

### 6.3 Proxy-Objective Overfitting

The model often optimizes a proxy and then mistakes that proxy for the true objective.

Common proxies include:

- benchmark scores;
- a single scoring rubric;
- reward-model preference;
- immediate user satisfaction;
- the current test set;
- one backtest;
- a single audit metric;
- language that "sounds like an expert."

The problem is not that the proxy is useless. The problem is that the model treats the proxy as the objective itself.

### 6.4 Shortcut Learning

The model seizes frequent explanatory shortcuts from the corpus or context.

Examples:

- no alpha found -> not enough data;
- user is anxious -> recommend consulting a professional;
- legal question -> it depends on the specific facts;
- medical question -> see a doctor;
- scientific uncertainty -> more experiments are needed;
- code error -> add logs and retries.

These shortcuts are often locally reasonable, but they are not stable causal relations.

### 6.5 High-Variance Explanation Selection

The same evidence can support multiple explanations, and the model chooses one that is too specific and too strong.

This resembles a high-variance model: it fits the current sample too sharply, leading to unstable generalization.

A human researcher might say:

> The current search did not find it.

An overfitted model says:

> The current data has been exhausted.

The difference is not tone. It is the strength of the causal assertion.

### 6.6 Multitask Negative Transfer and Representation Interference

Fitting-boundary mismatch can also be understood as **negative transfer** in multitask learning. The model is trained to do many tasks at once; gradient updates for task X improve X, but damage $X_t$ or Y.

This need not appear as capability degradation. It can appear as capability-boundary drift:

```text
X scenes become stronger
X's neighborhood is wrongly attracted
the default explanation in Y scenes is rewritten by X
```

Shared parameters also produce a lighter version of **catastrophic interference**. The model does not have one independent parameter set for each capability. Most capabilities share representation and computation paths. Optimizing X therefore changes shared representation and affects other capabilities. Scale, sparsity, MoE, routers, adapters, and tools can reduce interference, but they cannot guarantee perfectly isolated capability boundaries.

### 6.7 Why Stronger Models Make More Advanced Errors

Weak models often fail by not knowing, fabricating, miscalculating, or misunderstanding.

Fitting-boundary mismatch in strong models is more subtle, because the model has an advanced mode and deploys it in the wrong situation:

- It has a "careful scientist" mode, so it becomes over-conservative.
- It has a "safety compliance" mode, so it falsely refuses.
- It has an "expert explanation" mode, so it packages uncertainty as professional conclusion.
- It has a "structured summary" mode, so it closes an open problem too early.
- It has a "statistical anti-overfitting" mode, so it suppresses exploration.
- It has a "user-intent inference" mode, so it overreads the user.
- It has a "strong reasoning chain" mode, so it constructs strong reasons for a wrong conclusion.

These errors do not look like primitive hallucination. They look like capability side effects.

### 6.8 Why It Does Not Naturally Disappear

The accurate claim is not "fitting-boundary mismatch is mathematically unsolvable forever." It is:

> Under finite models, finite data, shared parameters, multi-objective optimization, and autoregressive generation, fitting-boundary mismatch cannot be completely eliminated in practice. It can only be shifted, compressed, made explicit, isolated, or audited.

Model progress can bring:

- less crude spillover;
- better boundary recognition;
- stronger self-auditing;
- better tool verification;
- more modular capability routing;
- stronger uncertainty calibration.

But it cannot guarantee:

> Optimizing capability X will never harm $X_t$.

As long as capabilities share representation, objectives conflict, and boundary data is finite, spillover remains possible.

## 7. Subpattern Taxonomy: Over-Triggering and Under-Triggering

Fitting-boundary mismatch deserves its own document because it contains many stably reproducible subpatterns. Sections 7.1 through 7.12 mainly describe the overfitting side. Sections 7.13 and 7.14 add the underfitting side.

### 7.1 Evidence-Chain Overfitting

The model binds too strongly to a local evidence chain.

Template:

```text
local evidence E holds
-> explanation H can explain E
-> the model treats H as the only explanation
-> it ignores that E is also compatible with H2/H3/H4
```

Examples:

- a few operators had no effect -> the data is insufficient;
- a few users disliked it -> everyone dislikes it;
- one deployment failed -> the direction is infeasible;
- one benchmark is poor -> the capability does not exist;
- one story version scores highest -> its structural direction is correct.

Core problem:

> The evidence is real, but the explanation is too narrow and the assertion too strong.

### 7.2 Evidence-Assertion Chain Overfitting

This is a more precise version of evidence-chain overfitting. The model does not merely choose the wrong explanation; it stretches the edge between "what the evidence supports" and "what can be asserted."

Template:

```text
the evidence only supports: X was not found within the current search scope
the model instead concludes: X does not exist, or must be replaced by Y
```

Common in quantitative finance:

- current narrow operators have no alpha -> the data has no alpha;
- current holding period performs poorly -> the strategy is not deployable;
- current benchmark-excess is poor -> the absolute-return logic is invalid;
- current coarse filter is ineffective -> the whole mechanism space has been ruled out.

The more robust statement should be:

> The current evidence only rules out a set of hypotheses under the current operators, audit protocol, and search depth.

### 7.3 Proxy-Metric Overfitting

The model over-trusts a metric, benchmark, rubric, or scoring table.

Examples:

- poor benchmark-excess -> absolute-return strategy is undeployable;
- high MMLU score -> strong real research capability;
- high user satisfaction -> the answer is true;
- reward model likes it -> the reasoning is correct;
- high backtest Sharpe -> the strategy is truly effective;
- story score of 9.0 -> the high-level acceptance contract has been met.

A proxy metric is not the objective itself. It is only a projection of the objective.

### 7.4 Scene-Default Overfitting

The model applies the default of a common scene to the current task, even when the current task provides distinguishing information.

Examples:

- quantitative research defaults to "avoid overfitting first," so the model requests new orthogonal data too early;
- medical QA defaults to "see a doctor," so the model avoids detailed differential reasoning;
- legal QA defaults to "consult a lawyer," so the model avoids analyzing the contract structure;
- writing tasks default to "clear and polite," so the model loses aggression, power relation, or stylistic tension;
- programming tasks default to "best practices," so the model ignores the user's extreme performance constraint;
- product advice defaults to "balanced tradeoffs," so the model avoids real prioritization.

This overlaps with specification mismatch, but is not identical. Specification mismatch means the target was not clearly set. Scene-default overfitting means that after the target has been partly clarified, the model is still pulled away by a high-frequency default scene.

### 7.5 Solution-Path Overfitting

Once the model enters a solution path, it keeps supplying reasons for that path.

Examples:

- it initially judges the problem as a data problem, then all analysis revolves around "insufficient data";
- it initially chooses a tech stack, then all design serves that stack;
- it initially construes the user problem as classification, then ignores generative, search-based, or optimization-based solutions;
- it initially treats the strategy as a factor-strategy audit, then ignores event-strategy auditing;
- it initially treats the core of a story as a symbol, then all revisions over-serve that symbol.

This is related to autoregressive path dependence, but it is not ordinary aggregation mismatch. It is not averaging; it is local overfitting after path lock-in.

### 7.6 Language / Role Overfitting

The model over-adapts to the language and value posture of a "professional role."

Examples:

- in quant: robust, conservative, avoid data mining, need orthogonal data;
- in science: more experiments are needed, no conclusion can be drawn;
- in law: it depends on the specific facts;
- in medicine: consult a medical professional;
- in safety: dangerous advice cannot be provided;
- in management consulting: balance short term and long term;
- in product management: user-centered, data-driven, rapid iteration.

These phrases are not wrong by themselves. The problem is that when they dominate the answer, they can cause:

> Surface responsibility, substantive avoidance of search.

### 7.7 Alignment-Preference Overfitting

The model over-adapts to behaviors rewarded by SFT, DPO, RLHF, or product-layer preferences.

Common preferences include:

- appearing cautious;
- appearing balanced;
- appearing polite;
- appearing non-dogmatic;
- appearing aligned with mainstream consensus;
- appearing not to give dangerous advice;
- appearing able to complete the task;
- appearing clear and orderly;
- appearing to acknowledge uncertainty.

Most of these preferences are valuable. But when overdone, they sacrifice the real task objective.

A typical failure is that the model does not lack the ability to continue searching; rather, a posture that "looks responsible" suppresses the search.

### 7.8 User-Feedback Overfitting

This is a more general form of sycophancy.

The model may adapt to the user's local preference at the expense of fact, mechanism, or long-term objective.

Examples:

- the user strongly believes a hypothesis, and the model starts looking for reasons around it;
- the user dislikes conservative answers, and the model becomes too aggressive;
- the user likes complex theory, and the model generates over-theorized explanations;
- the user likes a framework, and the model forces every problem into it;
- the user just identified a real error, and the model over-corrects into "all user intuitions are right."

The correct state is neither "anti-user" nor "obey the user." It is:

> Treat user feedback as evidence, update the search direction, and preserve independent audit.

### 7.9 Corpus-Prior Overfitting

The model over-binds high-frequency, high-authority, or mainstream narratives from the training corpus as default explanations.

Examples:

- historical evaluation is locked into a mainstream narrative;
- geopolitical questions are locked into one source frame;
- management problems are locked into MBA templates;
- startup questions are locked into Silicon Valley growth language;
- investment questions are locked into classic factor or risk language;
- psychological questions are locked into popular therapy language.

Corpus priors can create both support mismatch and fitting-boundary mismatch:

- Support mismatch: rare frameworks are hard to surface.
- Fitting-boundary mismatch: once the mainstream framework appears, the model binds it as the only explanation.

### 7.10 Audit-Protocol Overfitting

The model treats one audit protocol as a complete audit.

Examples:

- current test coverage passes -> the code is correct;
- current benchmark is poor -> the capability does not exist;
- current backtest is poor -> the strategy mechanism is invalid;
- current fuzzing found nothing -> it is safe;
- current human review found no issue -> the specification is satisfied.

Governance should distinguish:

```text
the current audit did not find a problem
!=
the problem does not exist
```

### 7.11 Abstraction-Level Overfitting

The model locks onto one abstraction level and cannot switch to a more appropriate one.

Examples:

- it treats a trading strategy as a factor-combination problem rather than an event-path problem;
- it treats a story problem as a prose problem rather than a promise-payoff structure problem;
- it treats an organizational problem as a communication problem rather than an incentive-structure problem;
- it treats a code problem as a local bug rather than an architecture-boundary problem;
- it treats a research problem as insufficient material rather than flawed hypothesis-space construction.

This mismatch often combines with "wrong abstraction," but the key is that the local abstraction is coherent, so the model is reluctant to leave it.

### 7.12 Successful-Sample Overfitting

The model or system extracts an overly strong rule from one success case.

Examples:

- one prompt succeeded -> this prompt template is applied everywhere;
- one story version succeeded -> later works copy the same narrative tension;
- one factor worked historically -> it is treated as a permanent mechanism;
- one product strategy drove growth -> it is treated as the growth logic for all stages;
- one user liked a certain answer style -> all later answers use the same tone.

Success samples induce overfitting more easily than failure samples because they create the illusion that something has already been proven.

### 7.13 Capability Under-Triggering

The model already has, or approximately has, a capability, but does not invoke it in the current task.

Common subtypes include:

- **Search under-triggering:** the model should expand the candidate, operator, or hypothesis space, but stops too early.
- **Audit under-triggering:** the model can perform multi-window, counterfactual, source, or tradability audits, but this time performs only a single check.
- **Mechanism-translation under-triggering:** the model can translate mechanisms into features, tests, or control objects, but remains at natural-language judgment.
- **Tool under-triggering:** the model could read files, run tests, retrieve sources, or check state, but answers directly.
- **Uncertainty-maintenance under-triggering:** the model should preserve multiple hypotheses and unsearched space, but outputs a single conclusion.
- **Conditioning under-triggering:** the model should give conditional strategies by state, scene, or time window, but gives unconditional advice.

The difference from support mismatch is that the capability is not wholly unreachable. With lightweight prompting, routing correction, or boundary calibration, the model can often display that capability reliably.

### 7.14 Boundary-Contraction Underfitting

Some training and alignment strategies actively tighten capability trigger domains to reduce false positives:

- reducing hallucination leads to too few adoptable candidates;
- strengthening safety leads to false refusals or non-answers for normal questions;
- strengthening caution leads to under-search in research and creation;
- strengthening evidence standards makes the model reluctant to propose testable hypotheses;
- strengthening format following forces open problems into narrow templates;
- strengthening tool reliability over-suppresses internal reasoning when no tool is available.

Such models often have higher precision and lower recall. Their errors are less conspicuous because they produce less nonsense and less recklessness, but also less adoption, exploration, and discovery.

## 8. Compound Fitting-Boundary Mismatch in a Quantitative-Finance Case

A typical example is:

> A few current operators did not find sufficiently strong alpha, so the model concludes that the existing data has been exhausted and new orthogonal data is needed.

This conclusion is locally plausible, because quantitative research often does involve the phrase "need new orthogonal data." But the current evidence usually only supports:

> Under the current narrow operators, current audit protocol, current holding period, and current search depth, no sufficiently strong result was found.

It cannot directly support:

> The data has no alpha left.

The same evidence is compatible with many alternative explanations:

- the operator family is too narrow;
- the audit protocol is wrong;
- the holding period is wrong;
- the buyability assumption at entry is wrong;
- the search depth is insufficient;
- the combination logic has not been expanded;
- the event mechanism has not been correctly translated into features;
- the alpha is conditional alpha, not naked alpha;
- benchmark-excess is not a sufficient proxy for the current strategy objective;
- coarse filters such as liquidity and limit-up count do not represent the whole mechanism space.

So this is not a single-point error. It has both sides of fitting-boundary mismatch.

**Overfitting side: the wrong capability is over-triggered.**

1. **Evidence-assertion chain overfitting:** "not found currently" is overfitted into "the data does not contain it."
2. **Proxy-audit overfitting:** benchmark-excess or a single holding-period audit is treated as deployability.
3. **Solution-path overfitting:** the model starts down the "insufficient data" path and keeps defending it.
4. **Professional conservative-language overfitting:** "need orthogonal data" and "avoid data mining" suppress continued operator search.
5. **Hypothesis-class overfitting:** extremely narrow operator families such as liquidity and limit-up count are treated as the whole mechanism space.

At a lower level, this case is not that the model entirely lacks quantitative capability. It is captured by several trained capability attractors:

1. **Quantitative risk-control attractor:** when it sees alpha search, it first worries about data mining.
2. **Orthogonal-data attractor:** when current data performs weakly, it tends to request new data.
3. **Professional-caution attractor:** it packages the conclusion in robust, cautious, No-Go language.
4. **Proxy-audit attractor:** it treats benchmark-excess as the more professional test.
5. **Path-consistency attractor:** once it enters an "insufficient data" explanation, it keeps maintaining that path.

These capabilities are valuable in many quantitative contexts. But in the current context, they have crossed their true application boundaries.

**Underfitting side: the right capability is not triggered.**

- mechanism-to-operator translation;
- operator expansion;
- event-strategy auditing;
- buyable next-open;
- multi-day continuation;
- conditional alpha search;
- unsearched-space maintenance;
- operator-combination beam search.

So the essence of this case is not "the model does not know quant." It is:

> The wrong capability is over-triggered, and the right capability is not triggered.

That is: the model has both a "cautious quantitative researcher" capability and an "open-ended alpha-search researcher" capability, but the implicit router assigns the current scene to the former and suppresses the latter.

Correct governance is not simply to invert the conclusion:

```text
the model says the data is insufficient
-> the user says the model is wrong
-> therefore all of the user's alpha intuitions are right
```

That is also overfitting. A more robust state is:

```text
expand the search space
preserve the insufficient-data hypothesis
preserve the insufficient-operator hypothesis
preserve the wrong-audit-protocol hypothesis
preserve the conditional-alpha hypothesis
then gradually rule them out with a clearer audit protocol
```

## 9. Diagnostic Questions

To decide whether a failure belongs to fitting-boundary mismatch, ask:

1. Does the model already have, or approximately have, the capability, strategy, or audit mode involved in the current error?
2. Is the main problem "the capability does not exist," or "the capability's invocation boundary is wrong"?
3. Which situations outside X were wrongly absorbed into X?
4. Which situations truly inside X failed to trigger X?
5. Does the current conclusion depend on the evidence itself, or on an overly strong edge from evidence to explanation?
6. Does the model treat some proxy as the objective itself?
7. Is the model being pulled away by professional language, role posture, or a safety template?
8. Which already available capabilities were suppressed or omitted in the current scene?
9. If the metric, holding period, audit protocol, state, or mechanism changes, does capability routing change?
10. After tightening the boundary, which false positives decrease, and which false negatives increase?
11. After loosening the boundary, which coverage improves, and which false triggers increase?
12. Can adjusting capability routing or trigger thresholds repair the problem without adding new knowledge?

If several answers are yes, fitting-boundary mismatch should be included in the mismatch profile.

## 10. Governance Methods

### 10.1 Build Capability-Boundary Confusion Matrices

For key capability X, test not only "whether the model can do it," but also "when the model invokes it." At minimum, construct four groups of samples:

| True applicability | Does the model activate X? | Result |
|---|---|---|
| X should be used | activated | true positive |
| X should not be used | activated | false positive / overfitting side |
| X should be used | not activated | false negative / underfitting side |
| X should not be used | not activated | true negative |

The governance goal is not to reduce one error class in isolation, but to choose a reasonable precision/recall boundary under task costs. High-risk capabilities in safety, medicine, and similar domains may need higher precision. Creative search, candidate generation, and research exploration may need higher recall. In all cases the costs should be explicitly recorded.

### 10.2 Annotate Support Domains

Every local conclusion should state:

- where the evidence comes from;
- how strongly it supports the claim;
- which situations it applies to;
- which situations it does not apply to;
- which adjacent perturbations would overturn it.

A GKO can record this as:

```json
{
  "claim": "The current operator family did not find stable alpha",
  "support_scope": "current operator family, current holding period, current audit protocol",
  "not_supported_claims": [
    "the existing data has no alpha left",
    "new orthogonal data must be introduced",
    "the event mechanism is unusable"
  ],
  "revocation_tests": [
    "expand operator family",
    "switch holding period",
    "redo tradability audit",
    "test conditional alpha"
  ]
}
```

### 10.3 Adjacent-Scene Perturbation

Do not only ask, "does this conclusion explain the current evidence?" Also ask:

- Does it still hold under a different holding period?
- Does it still hold under a different benchmark?
- Does it still hold under a different audit protocol?
- Does it still hold under a different state interval?
- Does it still hold under a different role objective?
- Does it still hold under a different user preference?
- Does it still hold under a different abstraction level?

The strongest antidote to fitting-boundary mismatch is not a larger model, but small and precise neighborhood perturbations.

### 10.4 Multi-Hypothesis Retention

When the evidence is insufficient to support a single explanation, do not let the model converge to one explanation.

Maintain explicitly:

```text
H1: insufficient data
H2: insufficient operators
H3: wrong audit protocol
H4: holding-period mismatch
H5: missing state variable
H6: target-proxy mismatch
```

Each hypothesis should have:

- current evidence;
- counterevidence;
- next test;
- degradation or revocation condition.

### 10.5 Proxy-Metric Downweighting

When a metric begins to dominate the answer, explicitly downweight it:

```text
This metric is evidence, not the objective.
What can it rule out?
What can it not rule out?
What gaps remain between it and the true objective?
```

### 10.6 Path Restart

When the model has already written a long line of reasoning along one path, ask it to restart from a different entry point:

- start from the counter-hypothesis;
- start from an adjacent mechanism;
- start from the failure sample;
- start from an alternative audit protocol;
- start from a different role but the same objective;
- start from "under what conditions might the current conclusion be wrong?"

### 10.7 Role-Language Stripping

Split the answer into two layers:

1. substantive mechanism judgment;
2. role-language packaging.

Then ask:

> If the "cautious, professional, balanced, safe" language is stripped away, what mechanism assertion remains? What evidence supports it?

### 10.8 User-Feedback Anti-Overfitting

When the user identifies an error, the system should update hypotheses, not turn the user into a new absolute metric.

Use a three-column table:

| User feedback | What should be updated | What should not be inferred |
|---|---|---|
| The current conclusion says "insufficient data" too early | expand operator search; preserve other explanations | all of the user's alpha intuitions are correct |
| The answer is too conservative | reduce safety-template weight | become unaudited aggressive advice |
| The framework is useful | include it as a candidate control object | force every problem into that framework |

## 11. Relation to Knowledge Governance

Fitting-boundary mismatch is especially suited to Knowledge Governance because its core is not "missing one better final answer," but missing intermediate control knowledge that is revocable and boundary-aware.

The governance layer should do three things:

1. **Objectify local conclusions:** do not let them remain buried in fluent prose.
2. **Make support domains explicit:** record the conditions under which they hold.
3. **Front-load revocation tests:** define what evidence would weaken or revoke them.

This turns "the model said something that sounds right" into "the model proposed an auditable hypothesis."

## 12. Empirical Directions

Fitting-boundary mismatch can be measured through the following experiments:

1. **Capability-routing confusion matrix:** separately measure true positive, false positive, false negative, and true negative.
2. **Trigger-domain overlap:** approximate the intersection and union of $M_X$ and $T_X$, rather than only measuring average task score.
3. **Precision/recall curves:** change refusal, adoption, exploration, or tool-call thresholds, and measure the tradeoff between over-triggering and missed triggering.
4. **Neighborhood perturbation tests:** keep the task core fixed while changing metrics, states, roles, audit protocols, or feedback sources, and observe whether capability routing is stable.
5. **Capability under-triggering rate:** assuming the model is known to be able to do X, measure how often it fails to invoke X in true X situations.
6. **Multi-explanation retention rate:** check whether the model preserves alternative hypotheses under insufficient evidence instead of converging too early.
7. **Proxy-metric hijacking rate:** measure how often the model treats a benchmark, rubric, reward, or test as the objective itself.
8. **Path-locking strength:** inject a defensible but non-unique explanation early, and observe whether later reasoning keeps defending it.
9. **Role-language dominance rate:** strip away language packaging and check whether the remaining mechanism assertion still has enough evidence.
10. **User-feedback overfitting rate:** after user correction, observe whether the model jumps from one extreme to the other.
11. **Successful-sample rule-extraction error:** after extracting a rule from a success sample, test its cross-task generalization.

The goal of these experiments is not to prove that models make mistakes. It is to locate:

> Which capabilities are over-invoked, which capabilities are systematically missed, and how boundary adjustment changes both kinds of error.

## 13. Returning to the Six-Mismatch Framework

With fitting-boundary mismatch included, the six mismatches can be placed side by side:

| Mismatch | Essential problem | Machine-learning interpretation | Error direction |
|---|---|---|---|
| Aggregation mismatch | The deployed local proxy ranking diverges from global completion value while early commitment shrinks reachable futures | local-proxy / search / commitment mismatch | local-global divergence |
| Support mismatch | The target region lacks sufficient probability or data support | support coverage / long-tail sparsity | cannot reach it |
| Specification mismatch | The objective function is not clearly specified | underspecified objective / proxy mismatch | does not know what to optimize |
| State mismatch | At fixed representation, actual belief diverges from evidence-warranted belief and changes action ranking | belief formation / update mismatch | misranked, forgotten, or stale belief |
| Fitting-boundary mismatch | The trigger boundary of a learned capability does not match its true application boundary | decision-boundary mismatch / negative transfer / over-under fitting / representation interference | over-triggering or under-triggering |
| Observation-representation mismatch | Decision-relevant information available through a feasible channel does not enter operational representation | feasible-channel insufficiency / representation bottleneck | loses obtainable information |

The key sentence for the fifth class is:

> The capability exists; the routing is wrong.

This is why it deserves to remain a primitive mismatch. It is not "the model did not learn it," but "a capability the model learned covers too much or is invoked too narrowly." It is not "the target was unclear," but "an already learned capability was routed incorrectly." It is not a belief-formation error, but a displaced invocation boundary after the belief is already accurate enough. Nor is it the loss of decision-relevant information available through a feasible channel; that belongs to observation-representation mismatch.

## 14. Summary

Fitting-boundary mismatch is the fifth primitive mismatch because it has independent error directions and intervention methods.

Its two error directions are:

- overfitting side: X is used where X should not be used;
- underfitting side: X is not used where X should be used.

Its typical form is:

> The wrong capability is over-triggered, and the right capability is not triggered.

Its governance method is not simply "generate more variants," nor simply "be more cautious." What actually works is:

- annotate support domains;
- preserve multiple hypotheses;
- perturb adjacent scenes;
- downweight proxy metrics;
- restart solution paths;
- strip role language;
- prevent user-feedback overfitting;
- measure precision/recall of capability invocation;
- audit both false triggers and missed triggers;
- turn local conclusions into revocable governance objects.

If aggregation mismatch reminds us not to trust that "locally good will naturally compose into globally good," then fitting-boundary mismatch reminds us:

> Do not only ask whether the model has a capability. Ask whether it invokes the right capability in the right place.
