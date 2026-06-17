# Knowledge Governance for Large Language Model Systems

# From LLM Mediocrity through Local Alignment to Autoregressive Extraordinary

**Xinyun Wang**, **Shuliang Liang**

## Abstract

Large language model (LLM) systems are increasingly improved at inference time through repeated sampling, critique, planning, reranking, retrieval, tool use, and iterative revision. These methods can substantially outperform one-shot generation. Yet on a class of difficult tasks they often remain concentrated in outputs that are fluent, locally coherent, and incrementally improvable while still falling short of high task value. We use **LLM mediocrity** as the umbrella term for this failure mode.

A terminological clarification is central to this version. **Autoregressive mediocrity** is too narrow to name the entire phenomenon. It accurately describes only one submechanism: **aggregation mismatch**, where locally plausible token-level continuations fail to compose into globally high-value structures. The other primitive mismatches are not primarily autoregressive. **State mismatch** is an observation-state identifiability problem. **Specification mismatch** is a problem of ambiguous, incomplete, or inconsistent task criteria in training data, prompts, and evaluators. **Support mismatch** is a probability-support/value mismatch in which high-value structures may occupy low-support regions of the policy and cannot be directly identified as valuable by probability alone. **Overfitting mismatch** is a local-adaptation problem: the system binds too strongly to a narrow evidence chain, metric, scene default, role template, or feedback signal, then fails when the task moves to adjacent scenes. For this reason, the broader failure regime is better named LLM mediocrity, while autoregressive mediocrity becomes a special case.

This paper argues that LLM mediocrity is not a universal property of LLMs. It is a task-, representation-, state-observation-, specification-, and budget-dependent regime. Between mediocrity and extraordinary lies the regime that most often appears in real human-facing tasks: **autoregressive local alignment**, or probability-value local alignment. In this regime, the model's local continuation tendencies are genuinely aligned with parts of the task value function, but that alignment is partial, conditional, and insufficient to guarantee global success. The system can produce locally correct, fluent, useful, or even insightful components while still drifting at the level of task construal, long-range coordination, hidden state, support, or true objective.

At the positive pole, which we call **autoregressive extraordinary**, the model's local continuation tendencies, learned semantic representations, genre priors, and surface fluency are positively aligned with task value at both local and global levels. In such cases, autoregressive generation is not a bottleneck but an advantage: local improvement compounds into global quality, high-value outputs are easy to reach, relevant state is explicit or stable, and the fluent output space itself may already be an adequate control space. Context compression and high-dimensional semantic mapping are central examples, but the same positive-alignment regime also appears in semantic decompression, register transfer, surface polishing, structured transformation, taxonomy generation, hypothesis generation, edge-case enumeration, query formulation, and boilerplate synthesis.

A crucial clarification is that modern aligned LLMs are not merely following raw lexical frequency. Supervised fine-tuning, reinforcement learning from human feedback, preference optimization, process supervision, and inference-time thinking reshape the policy distribution so that many proxy values become high-probability trajectories. We call this **policy-value compression**: task value is not emitted directly, but compressed into the model's policy and expressed at inference time as probabilities over tokens, reasoning traces, and output trajectories. This explains why better training and more thinking expand the region of local alignment. It also explains why mismatch remains: proxy value compressed into policy probability is not identical to true task value in open-ended settings.

We argue that susceptibility to LLM mediocrity is often predictable from five primitive mismatches between the LLM system and the task value landscape: **aggregation mismatch**, where global value is not recoverable from local improvements and which is the narrow home of autoregressive mediocrity; **support mismatch**, where high-value structures lie in low-probability or low-support regions and probability cannot by itself distinguish rare insight from rare noise; **state mismatch**, where utility depends on a dynamic latent state that is not observable or identifiable from the observation sequence; **specification mismatch**, where the accessible prompt, training-data norm, evaluator, or proxy objective diverges from the true task criterion; and **overfitting mismatch**, where the system over-adapts to local evidence, metrics, discourse patterns, role expectations, or user feedback and loses cross-scene robustness. These five mismatches are intended as primitive diagnostic axes rather than an exhaustive list of surface phenomena.

A key clarification is that many recurrent failures are not additional primitive mismatch classes. **Order-sensitive trajectories**, **emergent specification**, **structure-signal gaps**, **noisy-context construal failures**, **corpus-prior dominance**, and **budgeted control-capacity collapse** are better understood as derivative or compound patterns produced by the interaction of the five primitive mismatches with representation choice, inference budget, and control policy.

The central intervention principle of the paper is therefore broader than any single architecture: preserve and exploit the parts of a task that are already locally aligned, while transforming the poorly aligned parts into lower-mismatch, positively aligned subtasks. We call this principle **Mediocrity-to-Extraordinary Transformation**. A system can avoid mediocre output-space search if it can convert a difficult final-output problem into subtasks such as compression, construal extraction, rubric generation, state enumeration, edge-case generation, query formulation, structural outlining, constraint induction, and semantic decompression. These subtasks are often autoregressive-extraordinary or at least more locally aligned than the original task.

To operationalize this principle, we propose **Knowledge Governance**, an inference-time framework that separates final rendering from the acquisition, validation, and control of task-specific knowledge. The framework constructs a **Decoupled Control Space**, extracts candidate invariants, validates them under task-relevant evidence, and stores them as **Governed Knowledge Objects (GKOs)** with explicit conditions, strength, priority, lifespan, and revocation rules. These objects then guide subsequent generation as soft preferences, hard constraints, routing rules, construal rules, or diagnostic tests.

The framework does not assume a universal control-space representation. What is task-agnostic is the governance loop: construct a task-specific control space, search or perturb within it, validate candidate knowledge, render fluent outputs, monitor failures, and revise the governed knowledge set. We do not claim that Knowledge Governance is universally necessary. Rather, we argue that it is most useful in the common local-alignment regime, where some components are easy for the model to generate well but recurring high-value behavior depends on control knowledge that can be externalized, validated, and reused across candidate generations. When local likelihood is already globally aligned with task value, ordinary prompting, retrieval, limited search, or direct autoregressive generation may be sufficient and may even be the most efficient method.

---

## 1. Introduction

Large language models increasingly rely on inference-time compute to solve difficult tasks. Prompting with intermediate reasoning, sampling multiple chains, performing tree-based search, iteratively rewriting outputs, and interacting with tools or environments have all shown that performance is not determined solely by model weights at deployment time [1--5, 11]. These advances matter because they demonstrate that generation can be improved by search, critique, and feedback rather than by one-shot decoding alone.

Yet a persistent limitation remains. In many high-value applications - especially those involving long-range coordination, tacit quality criteria, dynamic environments, noisy real-world context, rare structures, hidden state, or ambiguous specifications - systems continue to plateau in outputs that are plausible but mediocre. These outputs are not random failures. They are often fluent, defensible, and even better than the first draft. What they lack is the rare structural relation, hidden boundary condition, correct problem construal, state-sensitive adaptation, low-support insight, or true success criterion that actually determines value.

We call this broader failure mode **LLM mediocrity**. The term is not meant as a universal criticism of large language models. Rather, it names a task- and budget-dependent phenomenon: under a fixed inference budget and a given family of search operators, the system remains concentrated in regions of output space that are easy to generate and refine but systematically suboptimal with respect to task value. In such regimes, more output-space search can raise average quality while still failing to reach the near-optimal region.

The earlier phrase **autoregressive mediocrity** is useful but too narrow. It should be reserved for the part of LLM mediocrity that is genuinely caused by autoregressive aggregation: local token-level continuation, local plausibility, and local refinement do not necessarily compose into global value. This mechanism is real, but it does not explain every important failure. State mismatch, specification mismatch, and support mismatch do not reduce to next-token generation alone. They arise from the gap between the LLM's observation channel, learned policy distribution, and accessible task specification on one side, and the true state, true value criterion, and high-value support structure of the problem domain on the other.

LLM mediocrity should also be distinguished from classical **mode collapse**. Mode collapse, as typically discussed in generative modeling, concerns a loss of diversity. By contrast, LLM mediocrity can persist even when candidate diversity is nontrivial. The problem is not necessarily that the system produces only one kind of answer; it is that diverse-looking answers may still occupy the same low-value basin of the task landscape or share the same hidden failure of state, specification, support, or aggregation.

Most practical tasks, however, are not pure cases of mediocrity. They contain regions where autoregression is useful and regions where it is misleading. A model may be excellent at compressing context, drafting an outline, producing fluent prose, generating edge cases, or reformatting information, while still failing to identify the decisive success condition, preserve a nonlocal dependency, condition on a hidden state, surface a low-support structure, or optimize the user's true value function.

We call this middle regime **autoregressive local alignment**. It occurs when statistical continuation and task value are aligned over some prefixes, subtasks, representations, or local operations, but the alignment does not remain stable over the whole task. Local alignment explains why many LLM outputs feel partly impressive and partly unsatisfactory: the model is not simply wrong, but neither is it globally governed by the task's value structure.

Local alignment is therefore the ordinary human-facing regime. Users typically bring messy, partially specified, state-dependent tasks that include both routine components and tacit high-value constraints. The system's challenge is not to suppress autoregressive generation; it is to identify where autoregression is already aligned, where it is only locally aligned, and where governance or reparameterization is needed to prevent local fluency from substituting for global value.

This point requires a clarification about probability. After instruction tuning, reinforcement learning from human feedback, direct preference optimization, process supervision, and related methods, a deployed LLM is no longer well described as merely following raw pretraining frequency. It still generates through an autoregressive probability distribution, but that distribution has been reshaped by proxy objectives for helpfulness, correctness, harmlessness, instruction-following, and task success [8, 13, 14]. In other words, alignment training does not abolish statistical generation. It compresses proxy task value into policy probability.

This compression is one reason modern LLM systems keep improving. As feedback improves, more high-value behaviors become high-probability under the aligned policy. As thinking and test-time reasoning create intermediate states, more difficult tasks are decomposed into local operations that the model can handle well. But this process expands local alignment rather than eliminating all mismatch. When true value depends on nonlocal aggregation, rare structures, latent state, or underspecified objectives, the aligned policy may still diverge from the real task utility.

At the positive pole, LLMs also display a stronger phenomenon: they often outperform humans on tasks where the task value function is naturally aligned with the model's representational and generative strengths. A typical example is **context compression**: taking a large body of context and mapping it into a compact, high-dimensional semantic representation, summary, taxonomy, or decision-relevant abstraction. Humans are limited by working memory, fatigue, and serial attention. LLMs can often preserve many semantic relations, compress them into a useful structure, and then re-render them for a particular purpose.

We call this positive regime **autoregressive extraordinary**. It occurs when local continuation, surface fluency, learned genre priors, semantic association, and iterative refinement point in the same direction as task value across the task, not merely inside isolated fragments. In these regimes, autoregressive generation is not the source of mediocrity. It is the mechanism of excellence. The model's tendency to continue plausibly, fill gaps, preserve register, expand sparse prompts into complete text, or enumerate adjacent concepts can itself produce unusually high value.

This observation changes the architecture question. The goal is not always to leave output space, construct a decoupled control space, and then render back into fluent text. That is one important method. The more general goal is to **change the form of the task as it appears to the model**. If a hard task can be reparameterized into a sequence of subtasks that fall inside autoregressive-extraordinary regimes, then ordinary generation can become an asset rather than a bottleneck.

For example, instead of asking a model to directly produce a high-value strategic analysis, one may ask it to:

1. compress the context into decision variables;
2. enumerate hidden assumptions;
3. generate candidate rubrics;
4. identify failure modes and misleading proxies;
5. construct a state matrix;
6. create a structural outline;
7. render the final answer from that outline;
8. validate the result against the earlier failure modes.

Each subtask is easier than the original task and may be closer to an autoregressive-extraordinary regime. The system avoids mediocrity not by making the model less autoregressive, but by presenting the model with subtasks where autoregression is well aligned with value.

The core claim of this paper is therefore three-regime rather than two-sided. First, LLM mediocrity is often predictable from structural mismatches between what an LLM system can observe, specify, support, locally aggregate, and robustly generalize from local context and what the task actually rewards. We formalize this through a **five-mismatch view**: aggregation, support, state, specification, and overfitting mismatch. These five axes are not intended to label every surface failure. Instead, they define primitive sources of divergence between reachable generation and task value.

Second, autoregressive local alignment describes the regime in which most deployed tasks actually live: local model strengths are real, but they are not sufficient to guarantee global task value. Third, autoregressive extraordinary provides the central design principle for intervention. A system can mitigate mediocrity by transforming high-mismatch or only locally aligned final-output tasks into lower-mismatch, positively aligned intermediate tasks. Knowledge Governance is a disciplined implementation of this transformation: it creates explicit control artifacts, validates them, stores them as governed knowledge, and uses them to guide fluent rendering.

This distinction matters because many intuitive failure categories are tempting but not primitive. For example, order-sensitive trajectories are important, but the mere fact that a task has a correct sequence is not itself a mismatch. It becomes a mismatch only when the generation or search procedure cannot reliably recover, preserve, or validate the required trajectory. Similarly, some goals are not fully known before candidate outputs are inspected; this is a dynamic source of specification mismatch, not a new primitive class. Real-world reasoning tasks often require extracting relevant variables from noisy scenes; this is a compound construal failure involving specification, state, support, and sometimes aggregation mismatch. Training data source imbalance can strongly shape default narratives; when that prior makes one locally plausible explanation dominate adjacent alternatives, it often appears as overfitting mismatch, sometimes interacting with support, specification, state, and aggregation effects.

This paper makes eight contributions.

1. It defines **LLM mediocrity** as a budgeted, task-dependent concentration of inference around plausible but suboptimal output regions.
2. It clarifies that **autoregressive mediocrity** is a narrower subcase of LLM mediocrity, corresponding primarily to aggregation mismatch.
3. It proposes five primitive mismatches as a diagnostic theory for predicting when ordinary output-space search is likely to plateau.
4. It defines **autoregressive local alignment** as the common intermediate regime in which probability and task value are locally but not globally aligned.
5. It introduces **policy-value compression** as the mechanism by which alignment training converts proxy task value into policy probability, thereby expanding local alignment without eliminating structural mismatch.
6. It defines **autoregressive extraordinary** as the positive-alignment regime in which autoregressive continuation and task value reinforce each other across the relevant task structure.
7. It proposes **Mediocrity-to-Extraordinary Transformation** as a general anti-mediocrity principle: preserve locally aligned operations while converting high-mismatch components into lower-mismatch, autoregressive-extraordinary subtasks; and it develops this principle into six reusable operational method patterns, each mapped to the primitive mismatch it counters (Section 6.8).
8. It presents **Knowledge Governance** as an inference-time control framework for externalizing, validating, revoking, and reusing task-specific control knowledge while distinguishing primitive mismatches from derivative and compound patterns.

---

## 2. Related Work

### 2.1 Output-Space Search and Test-Time Improvement

A large body of recent work improves LLM outputs by increasing test-time computation. Chain-of-thought prompting encourages intermediate reasoning [1]. Self-consistency samples multiple reasoning paths and selects an answer by aggregation [2]. Tree-of-Thoughts expands search over intermediate states [3]. Self-Refine and Reflexion use iterative feedback to revise outputs [4, 5]. ReAct combines reasoning and acting by interleaving language generation with external tool use or environment interaction [11].

These methods show that inference-time search can improve reasoning, planning, and task performance. Our argument is compatible with this literature but emphasizes a failure boundary. When the task value function is poorly aligned with local plausibility, repeated search over fluent outputs can still plateau. In such cases, increasing the number of candidate answers may not expose the structural knowledge needed to escape a low-value basin.

The positive counterpart is equally important. When local plausibility is strongly aligned with task value, additional search, rewriting, and expansion can compound quality. Repeated generation is then not a search over mediocre variants but a way to exploit a positive-alignment regime. The same mechanism that fails under mismatch can excel under alignment.

### 2.2 Training-Time Alignment and Policy-Value Compression

Instruction tuning, reinforcement learning from human feedback, and preference optimization alter the model policy before deployment. InstructGPT-style RLHF first uses demonstrations for supervised fine-tuning, then learns a reward model from human preference rankings, and then optimizes the model policy against that reward signal [13]. Direct Preference Optimization provides a more direct preference-learning objective that can align a language model to preference data without separately training a reward model and running a reinforcement-learning loop [14]. Process supervision similarly attempts to align intermediate steps rather than only final answers [8].

Our framework interprets these methods as **policy-value compression**. They do not replace autoregressive probability with direct access to true utility. Instead, they reshape the policy so that certain proxy values become more probable during generation. This is why aligned models can be much more useful than raw next-token models, and why local alignment expands as training improves. The residual problem is that proxy value, even when successfully compressed into policy probability, can still diverge from true task value under distribution shift, hidden state, rare structure, or underspecified goals.

### 2.3 Retrieval, Memory, and Principle-Based Control

Retrieval-augmented generation adds external documents or memories to the context [6]. Constitutional and principle-based approaches guide outputs by explicit normative or behavioral constraints [7]. Process supervision and step-level verification attempt to evaluate not only final answers but intermediate reasoning steps [8].

Knowledge Governance shares the idea that model behavior can be improved by external information and explicit constraints. Its focus is different: it asks how task-specific control knowledge can be induced, validated, stored, weakened, and revoked during inference. The target is not only factual knowledge retrieval but also the discovery of structural dependencies, boundary conditions, state variables, and reusable control rules that are not already available as retrieved text.

### 2.4 Induced vs. Retrieved Knowledge

Retrieved knowledge is imported from an external corpus. Induced knowledge is inferred from artifacts, failures, perturbations, counterexamples, or repeated task interactions. Knowledge Governance primarily concerns induced control knowledge. A system may observe that a certain dialogue pattern fails under a frustration state, that a code module leaks future information, or that a story reversal only works when a prior commitment has been planted. Such knowledge is not necessarily a factual document; it is a task-specific constraint extracted from experience.

This distinction is important because many high-value failures are not caused by missing facts. They are caused by missing control knowledge: knowing which variables matter, when a rule applies, which dependency is nonlocal, which assumption must be validated, which source prior is misleading, or which surface feature is not actually task-relevant.

### 2.5 Underspecification and Misgeneralization

Underspecification arises when many models or policies fit observed data while behaving differently under deployment conditions [9]. Goal misgeneralization occurs when a system pursues a proxy or learned goal that diverges from the intended goal under distributional shift [10]. These ideas are closely related to specification mismatch and, when deployment behavior depends on a latent regime not identifiable from observations, to state mismatch.

Our framework extends this line of thinking to inference-time generation. A prompt, evaluator, benchmark, or reranker often supplies only a partial proxy for true task value. The model may optimize this proxy while missing the tacit criterion that matters to a user or domain expert. This is specification mismatch. Separately, in dynamic settings, a policy that was appropriate under one latent state may become inappropriate when the hidden state changes and the observation stream does not reveal the transition. This is state mismatch.

### 2.6 From Solving Problems to Construing Problems

Many benchmarks present already-abstracted problems: the relevant variables are named, the goal is explicit, and irrelevant scene details have been removed. Real-world tasks often require an earlier step: extracting a compact problem model from a noisy natural context. A human may quickly infer that in a car-wash scenario the relevant object is the car, not the person walking to the shop; or that a long thin pole can pass through a doorway by orienting it along the direction of motion rather than fitting it inside the two-dimensional door rectangle.

This **scene-to-model abstraction** step is not identical to solving the abstract problem. A model may be competent at the latter while failing at the former. We treat this as a compound mismatch pattern rather than a separate primitive class. It is one of the central reasons why a system that performs well on clean benchmark tasks can remain brittle in noisy, underspecified, or common-sense-heavy contexts.

### 2.7 Local Alignment, Positive Alignment, and Task Reparameterization

Most inference-time improvement methods can be understood not only as adding compute but also as changing the task distribution faced by the model. A prompt that asks for a plan before an answer transforms final-output generation into plan generation plus rendering. A rubric transforms a vague preference into an explicit evaluation structure. Retrieval transforms unsupported factual generation into grounded synthesis. A checklist transforms open-ended quality judgment into localized verification. These transformations can succeed when the new subtasks are more aligned with the model's strengths than the original task.

This paper makes that observation explicit through two concepts: autoregressive local alignment and autoregressive extraordinary. The anti-mediocrity question becomes: which parts of a task are already locally aligned, which parts are misaligned, and can the misaligned parts be transformed into a sequence of tasks whose intermediate values are well aligned with continuation?

---

## 3. LLM Mediocrity as a Five-Mismatch Problem

We now formalize LLM mediocrity as a predictable consequence of mismatches between an LLM system's policy distribution, observation channel, accessible specification, and the task value landscape.

### 3.1 Problem Setup

Let the accessible input to the model be an observation sequence $o_{1:t} \triangleq x \in \mathcal{X}$, and let $s_t \in \mathcal{S}$ denote an optional latent, environmental, or interaction state. The notation is intentionally state-observation separated: the model conditions on observations, prompts, traces, retrieved text, logs, or other visible artifacts, but the utility of an output may depend on a latent state that is not equivalent to those observations. Let $y \in \mathcal{Y}$ denote an output. Let the active model policy define a conditional distribution

\[
p_\theta(y \mid o_{1:t}),
\]

and let the task utility be

\[
U(y; o_{1:t}, s_t) \in \mathbb{R}.
\]

The dependence on $s_t$ allows utility to vary with hidden Markov state, market regime, temporal context, physical configuration, institutional setting, dialogue phase, system condition, or other task-relevant variables not fully identified by the visible observation sequence.

In a modern deployed system, $p_\theta$ should not be interpreted as raw corpus frequency. It may already include supervised fine-tuning, RLHF, DPO-style preference optimization, process supervision, tool-use tuning, or other alignment procedures. We therefore use $p_\theta$ generically for the active model policy. The important point is that even an aligned policy remains probabilistic: value-shaped preferences are expressed through the probability of trajectories.

We consider a budgeted inference procedure $\Pi_B$ with compute budget $B$. This procedure may include sampling, critique, reranking, rewriting, tool use, retrieval, limited search, or adaptive compute allocation, and induces a distribution over candidates that are actually reachable under the available budget:

\[
q_{\Pi_B}(y \mid o_{1:t}).
\]

Define the near-optimal set at tolerance $\tau \ge 0$ as

\[
\mathcal{H}_\tau(o_{1:t},s_t) =
\left\{y \in \mathcal{Y}: U(y;o_{1:t},s_t) \ge U^\star(o_{1:t},s_t)-\tau \right\},
\quad
U^\star(o_{1:t},s_t)=\max_{y \in \mathcal{Y}} U(y;o_{1:t},s_t).
\]

We say that a task instance exhibits **LLM mediocrity** under $\Pi_B$ when the inference procedure remains concentrated away from $\mathcal{H}_\tau(o_{1:t},s_t)$ despite producing outputs that are locally plausible, high-likelihood, or highly rated by an available proxy. In the notation introduced in Section 3.2.2, this is the statement that the reachability score $r_{\tau,B}(o_{1:t},s_t)$ is low; the five mismatches of Section 3.2 are the procedure-independent task properties that predict when this occurs.

This definition is operational. It does not imply that high-value outputs never exist in the model distribution, nor that the model can never produce them. It claims only that, under practical inference budgets and common search operators, the system can remain trapped in output regions that are easy to generate and locally improve while still failing to reach near-optimal solutions.

For naturalistic tasks, it is useful to make an additional distinction. The system may not directly solve $o_{1:t} \mapsto y$. Instead, it may need to construct an intermediate task model $z$:

\[
z^\star = A^\star(o_{1:t},s_t), \qquad y^\star = S(z^\star).
\]

Here $z^\star$ contains the relevant goal, role bindings, constraints, hidden state variables, causal affordances, source priors, and success conditions. A common failure occurs when the system constructs $\tilde{z}$ rather than $z^\star$, and then reasons fluently within the wrong abstraction. This does not by itself require another primitive mismatch, but it is important enough to treat as a recurring compound pattern.

### 3.2 Five Primitive Sources of Mismatch

The following five mismatches are intended as primitive diagnostic axes. A candidate sixth mismatch should be admitted only if it cannot be reduced to these axes or their interactions, provides additional predictive power, and requires a meaningfully different intervention.

#### 3.2.1 Aggregation Mismatch

**Aggregation mismatch** occurs when global task value cannot be reliably recovered by summing, averaging, or locally refining prefix-level improvements.

Autoregressive generation naturally proceeds through locally conditioned decisions. This is effective when task value is approximately compositional across local choices. It becomes unreliable when decisive utility depends on higher-order interactions, long-range coordination, or coupled constraints that are not well approximated by local gains.

This is the narrow and precise home of **autoregressive mediocrity**. In this subcase, the model's local token-level continuation process aggregates many possible intentions, styles, constraints, and continuations into a smooth local distribution. The locally most plausible continuation can therefore dilute the globally highest-value structure. Autoregressive mediocrity is not identical to LLM mediocrity as a whole; it is LLM mediocrity produced by aggregation mismatch.

One operationalization is to compare the true utility $U$ with a class of **window-limited locally additive surrogates**. For a locality horizon $k \ll T$, define

\[
\mathcal{F}_{\mathrm{loc}}^{(k)} =
\left\{
F(y;x)=\sum_{t=1}^{T} f_t\!\left(x,\,y_{t-k:t}\right) : f_t(\cdot) \in \mathbb{R}
\right\},
\]

where each term may depend on the input and on a bounded window of at most $k$ recent tokens, and where the per-term functions $f_t$ are further restricted to a bounded-complexity class (for instance, functions computable by a fixed-capacity scorer). Let $\rho$ be a correlation measure over a candidate pool. Define the aggregation-alignment score at horizon $k$ as

\[
\alpha_k(x,s) = \sup_{F \in \mathcal{F}_{\mathrm{loc}}^{(k)}} \rho(F(y;x), U(y;x,s)).
\]

The window restriction is not a technicality; without it the score is degenerate. If each $f_t$ may depend on the full prefix $y_{\le t}$, then the final term $f_T(x, y_{\le T})$ is a function of the entire output and can simply encode $U(\cdot;x,s)$ itself for the fixed instance under evaluation, forcing the supremum to one for every task. A meaningful locality score must therefore bound both the window and the per-term complexity, so that $\alpha_k$ measures what it is intended to measure: how well bounded-horizon local signals can approximate global utility.

A low value of $\alpha_k(x,s)$ at moderate horizons indicates severe aggregation mismatch, and the growth profile of $\alpha_k$ as $k$ increases indicates the effective range of the nonlocal coupling. In such settings, local refinement can improve style while damaging logic, improve empathy while delaying resolution, improve one code component while silently violating another constraint, or improve prose while weakening narrative payoff.

This mismatch is the signature of multi-objective coordination, global consistency, delayed payoff, and tasks in which the global optimum is not the sum of locally good decisions.

#### 3.2.2 Support Mismatch

**Support mismatch** occurs when near-optimal solutions lie in a low-mass region of the base policy distribution, or when the high-value structure is not reliably bound to probability support. Low probability can mean noise, but it can also mean rare insight; probability alone does not mark which tail structures are valuable.

It is essential to define this mismatch over the base policy $p_\theta$, not over the search-induced distribution $q_{\Pi_B}$. Define the support score as

\[
\sigma_{\tau}(x,s)=
\Pr_{y \sim p_{\theta}(\cdot \mid x)}
\left[y \in \mathcal{H}_\tau(x,s)\right],
\]

and, separately, the **reachability score** of an inference procedure as

\[
r_{\tau,B}(x,s)=
\Pr_{y \sim q_{\Pi_B}(\cdot \mid x)}
\left[y \in \mathcal{H}_\tau(x,s)\right].
\]

A low value of $\sigma_{\tau}(x,s)$ indicates severe support mismatch: near-optimal solutions are tail events under the model policy itself, before any search is applied. A low value of $r_{\tau,B}(x,s)$ is, by the operational definition of Section 3.1, the phenomenon of LLM mediocrity. Keeping these two quantities distinct prevents a circularity that would otherwise undermine the diagnostic role of the taxonomy: if support mismatch were defined directly over $q_{\Pi_B}$, it would restate the definition of mediocrity rather than explain it.

The separation makes the relation between cause and phenomenon substantive. Support mismatch (low $\sigma_\tau$) is a structural property of the pair $(p_\theta, U)$. Mediocrity (low $r_{\tau,B}$) occurs when the inference procedure fails to repair that property — when sampling, reranking, critique, and revision do not concentrate mass onto the near-optimal set despite the budget spent. The repair can fail for reasons supplied by the other axes: a misspecified reranker cannot recognize tail candidates when it encounters them (specification mismatch), local refinement cannot assemble the rare structure from locally good pieces (aggregation mismatch), and a hidden regime can make the procedure search the wrong tail entirely (state mismatch). Conversely, an effective procedure can achieve $r_{\tau,B} \gg \sigma_\tau$, which is precisely what successful perturbation, recombination, retrieval, and control-space search accomplish. This formulation also makes the Predictive Hypothesis of Section 3.4 falsifiable rather than definitional: it relates a measurable property of the base policy to an outcome of the search procedure.

Repeated sampling under the unmodified policy may improve average quality while still rarely exposing the rare structure that determines real success. Support mismatch therefore corresponds most directly to low-probability, high-value discovery: the crucial invariant exists, but it is rare in ordinary autoregressive continuation. In such cases, the system may need search procedures that deliberately perturb, recombine, retrieve, or expose unlikely structural relations rather than merely sample more fluent completions.

A useful way to state the mismatch is: low-probability structures cannot be directly tied to value by the model's policy alone. They can often be reached only through **scarce prompt structures**, examples, contrastive constraints, retrieval routes, or governed control objects that move the conditional distribution toward the relevant low-support region. Prompt engineering and control-space construction are therefore not merely stylistic instructions; they are mechanisms for reshaping support so that rare but valuable structures become reachable.

#### 3.2.3 State Mismatch

**State mismatch** occurs when the correct ranking of candidate outputs depends on a dynamic latent state $S_t$ that is not directly observable and not identifiable from the observation sequence available to the LLM.

The key distinction is:

\[
\text{observation} \ne \text{state}.
\]

Prompts, context windows, retrieved passages, logs, conversation histories, and user descriptions are observations. They may be evidence about state, but they are not the state itself. In HMM or POMDP terms, the latent state evolves and emits observations:

\[
S_{t+1} \sim T(S_t,a_t), \qquad O_t \sim E(S_t),
\]

while the LLM conditions only on some observation history:

\[
O_{1:t}=o_{1:t}.
\]

The strongest form of state mismatch appears when two latent states are observationally indistinguishable or insufficiently distinguishable:

\[
P(O_{1:t}\mid S_t=s_1) \approx P(O_{1:t}\mid S_t=s_2),
\]

but require different optimal outputs:

\[
y^\star(o_{1:t},s_1) \ne y^\star(o_{1:t},s_2).
\]

In this case, no system whose only input is $O_{1:t}$ can reliably know which output is correct. The issue is not that the prompt is vague, nor that the user has failed to articulate a preference. It is an identifiability problem: the problem domain contains state variables that are dynamic, hidden, unmeasured, or intrinsically unavailable through the observation channel. The LLM can at best maintain a posterior distribution

\[
P(S_t \mid O_{1:t}),
\]

not direct access to $S_t$.

Suppose two plausible states $s, s' \in \mathcal{S}$ are both compatible with the same observation sequence $o_{1:t}$. If there exist candidates $y,y'$ such that

\[
U(y;o_{1:t},s) > U(y';o_{1:t},s)
\quad \text{but} \quad
U(y;o_{1:t},s') < U(y';o_{1:t},s'),
\]

then the preferred output is state-dependent. If the relevant state is hidden, only partially inferable, dynamically changing, or not measurable by the available instruments, local plausibility under $p_\theta(y \mid o_{1:t})$ is a weak guide to utility.

A useful diagnostic is ranking instability across plausible posterior states:

\[
\delta(o_{1:t})=
\mathbb{E}_{s,s' \sim p(\cdot \mid o_{1:t})}
\Pr_{y,y' \sim q_{\Pi_B}(\cdot \mid o_{1:t})}
\left[
\operatorname{sgn}(U(y;o_{1:t},s)-U(y';o_{1:t},s))
\ne
\operatorname{sgn}(U(y;o_{1:t},s')-U(y';o_{1:t},s'))
\right].
\]

A high value of $\delta(o_{1:t})$ indicates severe state mismatch. Candidate rankings are unstable across plausible latent states. In such cases, strong generators may repeatedly produce outputs that are reasonable in isolation but mistimed, miscalibrated, attached to the wrong latent regime, or based on a wrong physical, temporal, system, market, or institutional state.

State mismatch therefore captures hidden-Markov or partially observable domains: dynamic games, non-stationary environments, unobserved physical affordances, market regimes, changing system states, latent dialogue phases, and other cases where utility depends on a state variable that is not itself supplied by the observation stream. It does **not** include merely vague goals, tacit preferences, or unclear evaluation criteria. Those belong to specification mismatch.

#### 3.2.4 Specification Mismatch

**Specification mismatch** occurs when the true task utility differs materially from the specification actually available to the model during generation, evaluation, or refinement.

Let $\tilde{U}(y;o_{1:t})$ denote the accessible proxy: the prompt-implied objective, a reranker score, a style rubric, a benchmark metric, a test suite, a limited automatic evaluator, a learned preference model, or a norm inherited from training data. A task exhibits specification mismatch when there exist candidates $y,y'$ such that

\[
\tilde{U}(y;o_{1:t}) > \tilde{U}(y';o_{1:t})
\quad \text{but} \quad
U(y;o_{1:t},s_t) < U(y';o_{1:t},s_t).
\]

Equivalently, a rank-correlation score between $\tilde{U}$ and $U$ over a candidate pool can be used as a diagnostic. Low rank alignment indicates severe specification mismatch.

Specification mismatch is common because neither training data nor prompts provide a single clean value function. Training data contains many incompatible standards of "good": exam answers, forum advice, customer-service replies, academic explanations, marketing copy, legalistic caution, safety refusals, social politeness, and domain-specific expert judgments. A prompt may also be vague: "make it better," "be more strategic," "write it at a higher level," "optimize this plan," or "give me the best answer". These instructions do not specify a complete reward function.

The model therefore often acts as if the specification were known when it is only partially specified. It falls back to a high-support proxy of general acceptability: fluent, balanced, complete, safe, and conventionally helpful. This default may be useful, but it is not necessarily the true criterion of success.

This boundary is important. Tacit preferences, unclear goals, underdefined rubrics, ambiguous user requirements, and evaluator-proxy divergence are specification mismatch, not state mismatch. They ask: **what counts as good?** State mismatch asks: **which latent world state are we actually in?**

Specification mismatch is common when quality is tacit, expert-only, partially adversarial, culturally contested, historically framed, or only weakly described by the prompt and available automatic metrics. The system may become increasingly good at producing outputs that score well under the proxy while remaining mediocre under the true objective.

A special case is **emergent specification**. In some tasks, the principal cannot fully articulate the desired target before seeing candidate outputs. The target is not absent; it is partially latent to the principal and becomes more identifiable through contrastive inspection. In formal terms, the accessible proxy $\tilde{U}_t$ evolves over interaction time:

\[
\tilde{U}_0 \rightarrow \tilde{U}_1 \rightarrow \cdots \rightarrow \tilde{U}_t.
\]

This is a dynamic source of specification mismatch, not an additional primitive mismatch. If the true utility itself changes with interaction state rather than merely being discovered, the phenomenon additionally involves state mismatch.

#### 3.2.5 Overfitting Mismatch

**Overfitting mismatch** occurs when the system adapts too strongly to a local evidence chain, local scene, local proxy metric, local discourse template, role expectation, alignment preference, or user feedback signal, and then treats that local adaptation as if it were invariant across adjacent task contexts.

In classical machine learning, overfitting means that a model performs well on the training sample while failing to generalize. In LLM systems the same structure appears at inference time. A response may be locally plausible, professionally phrased, safe under the immediate rubric, or consistent with the first explanatory path, yet still fail when the task shifts from scene $A$ to neighboring scenes $B,C,D,\ldots$.

A useful template is:

\[
E_A \Rightarrow H_A \quad \text{locally}, \qquad
H_A \not\Rightarrow I_{A:B:C}
\]

where $E_A$ is local evidence in scene $A$, $H_A$ is the hypothesis or answer structure selected by the model, and $I_{A:B:C}$ denotes the cross-scene invariant that should survive neighboring perturbations. The failure is not that $H_A$ has no support. The failure is that the model mistakes local support for invariant support.

This includes several recurring subtypes:

- **Evidence-chain overfitting:** a locally defensible explanation is promoted into the only causal explanation.
- **Proxy-metric overfitting:** a benchmark, rubric, reward model, or test score is treated as the target rather than as partial evidence about the target.
- **Scene-default overfitting:** a common domain default is applied too strongly after the current task has already supplied distinguishing details.
- **Solution-path overfitting:** an early reasoning path becomes self-reinforcing, and later analysis is recruited to defend it.
- **Role or discourse overfitting:** professional caution, safety language, legalistic balance, or domain jargon substitutes for continued search.
- **User-feedback overfitting:** local preference adaptation becomes sycophancy or overcorrection rather than task alignment.

This axis is distinct from aggregation mismatch. Aggregation mismatch over-smooths many cases into an average answer; overfitting mismatch over-binds to one local case. It is also distinct from support mismatch: the relevant alternative may be in support, but the selected local explanation blocks the search path. It is distinct from specification mismatch: the target may be sufficiently specified, but the model over-optimizes a local proxy, template, or hypothesis within that target. The operational test is simple: if the answer is locally reasonable in $A$ but collapses under small changes to scene, metric, audit protocol, mechanism, or feedback source, the task has overfitting mismatch.

### 3.3 Criterion for Adding New Mismatch Classes

The five-mismatch taxonomy is useful only if it remains disciplined. Many phenomena are important but should not automatically become new primitive classes. We adopt the following criterion:

> A candidate mismatch should be treated as an independent primitive class only if it satisfies three conditions: it cannot be reduced to the five primitive mismatches or their interactions; it provides additional predictive power; and it requires a meaningfully different intervention.

This criterion excludes several tempting additions.

**Sequence or trajectory mismatch** is not primitive by itself. The fact that a task has a correct order is a task property, not a mismatch. A mismatch arises only when the system cannot recover, preserve, or validate the required trajectory. Depending on the cause, this decomposes into aggregation mismatch, support mismatch, or state mismatch.

**Goal emergence** is not primitive by itself. It describes how the proxy objective becomes specified through interaction. It is best treated as emergent specification: a dynamic source of specification mismatch, sometimes interacting with state mismatch.

**Noisy-context signal extraction** is not primitive by itself. It is a compound construal problem in which the system must infer a compact task model from a natural scene before solving the abstract problem. Depending on what is misidentified, the failure decomposes into specification, state, support, and aggregation mismatch.

**Training-data or corpus-source imbalance** is not primitive by itself. It can create a strong default narrative, salience pattern, or evaluative prior, but the resulting failure usually appears as support mismatch, specification mismatch, state mismatch, and sometimes aggregation mismatch. A corpus prior can make a minority but task-relevant frame hard to reach, can cause a mainstream narrative to substitute for the true evaluation criterion, can hide state-dependent institutional context, or can overvalue local metrics relative to system-level effects.

**Complex-task collapse** is not primitive by itself. It is a budgeted control-capacity regime: the task's primitive mismatch load exceeds the system's effective control capacity under the current model, inference budget, representation, and routing policy. Increasing adaptive compute or improving the control representation may move the same task out of collapse. This changes reachability and control capacity rather than adding a sixth mismatch axis.

The value of these categories is not that they expand the primitive taxonomy, but that they name recurring interaction patterns that are important for diagnosis and intervention.

### 3.4 Mismatch Profile and Predictive Hypothesis

For a task instance $(x,s)$, define the **mismatch profile** as a conceptual vector:

\[
\mathbf{m}(x,s)=
\big(
\mathsf{A}_k(x,s),
\mathsf{S}_{\tau}(x,s),
\mathsf{D}(x),
\mathsf{M}(x,s),
\mathsf{O}(x,s)
\big),
\]

where the five components correspond to aggregation, support, state, specification, and overfitting mismatch. The aggregation component is measured through the window-limited score $\alpha_k$ of Section 3.2.1, and the support component is measured on the base policy $p_\theta$ via $\sigma_\tau$ of Section 3.2.2; neither component depends on the inference procedure $\Pi_B$. The state, specification, and overfitting components are likewise properties of the task, the utility, the accessible proxy, and the stability of the selected explanation under local perturbation. The mismatch profile is therefore defined independently of the search procedure whose success it is meant to predict. In practice, these quantities may be approximated through sampled candidate pools, task probes, perturbation tests, failure analysis, human diagnosis, or domain-specific validators. Their value is conceptual and predictive rather than perfectly measurable in every setting.

Our central hypothesis is:

> **Predictive Hypothesis.** For a fixed model class and inference budget, the reachability $r_{\tau,B}(x,s)$ achieved by output-space search decreases as the procedure-independent mismatch profile $\mathbf{m}(x,s)$ becomes more severe; interactions among mismatch components are often super-additive.

Because the profile is defined over $(p_\theta, U, \tilde{U}, \mathcal{S})$ and local-stability tests while reachability is defined over $q_{\Pi_B}$, the hypothesis relates two distinct objects and is falsifiable rather than definitional. The super-additivity has a mechanism: the mismatches interfere with each other's repair channels. Specification mismatch corrupts the reranker or evaluator that a search procedure would use to recognize and amplify tail candidates; state mismatch corrupts the validation signal needed to confirm a recovered rare structure; aggregation mismatch prevents locally good pieces from being assembled into the rare global structure even after its components have been surfaced; overfitting mismatch locks the procedure onto one locally plausible explanation and suppresses neighboring alternatives. One severe mismatch may degrade performance; several severe mismatches together disable the very operators that would repair any one of them, which is the condition under which LLM mediocrity becomes persistent.

This yields a practical heuristic:

- **One dominant mismatch:** stronger prompting, reranking, retrieval, limited search, or additional compute may suffice.
- **Two substantial mismatches:** ordinary output-space search often begins to plateau.
- **Three or more substantial mismatches:** task reparameterization or a decoupled control layer becomes a strong candidate.

### 3.5 Derivative and Compound Failure Patterns

The five primitive mismatches explain many recurring surface patterns. The following patterns are worth naming because they are practically important, but they should not be confused with additional primitive classes.

#### 3.5.1 Order-Sensitive Trajectory Recovery Failure

Some tasks require a correct sequence of decisions, revelations, explanations, or actions. A story may require setup before payoff. A customer-service dialogue may require acknowledgment before troubleshooting. A codebase may require dependency ordering before execution. A strategy may require information gathering before commitment.

The sequence itself is not the mismatch. The mismatch occurs when local search cannot reliably recover or preserve the required trajectory. This can happen because local improvements do not compose into global success (aggregation mismatch), the correct trajectory is rare (support mismatch), or the appropriate next step depends on latent phase or state (state mismatch).

The appropriate intervention is not merely to add a new sequence label. It is to externalize the trajectory state, validate phase transitions, and store ordering constraints as governed knowledge.

#### 3.5.2 Emergent Specification

Some tasks cannot be fully specified before candidate outputs are observed. A user may not know what kind of story ending feels right until seeing alternatives. A product manager may not know the desired tradeoff among clarity, ambition, and risk until comparing drafts. A domain expert may recognize a subtle violation only after inspecting a concrete artifact.

This phenomenon is important but not primitive. It is a dynamic path through specification mismatch. The proxy objective becomes more precise through contrastive exposure. The appropriate intervention is preference elicitation, paired comparison, rubric refinement, and explicit updating of the proxy $\tilde{U}_t$ rather than treating the initial prompt as a fixed complete objective.

#### 3.5.3 Noisy-Context Construal Failure

Many real tasks are not presented as clean abstract problems. They are embedded in scenes containing irrelevant details, misleading cues, tacit goals, implicit role bindings, and background common sense. The system must first construct the right task model.

Noisy-context construal failure is therefore a compound pattern, but its components should be kept distinct. When the system misidentifies the success condition, role binding, or evaluation criterion, the failure is specification mismatch. When the system fails because a physical, temporal, institutional, or environmental state is genuinely hidden or not identifiable from observations, the failure is state mismatch. When the correct abstraction is rare under the policy, support mismatch contributes. When the wrong abstraction causes locally coherent reasoning to violate a global dependency, aggregation mismatch contributes.

Consider a car-wash example. If a car wash is fifty meters from home, should one drive or walk? A superficial distance heuristic suggests walking. But the success condition is not that the person reaches the shop; it is that the car is washed. The relevant goal-carrier is the car. This is primarily a **specification and role-binding failure**: the model answers the wrong success condition. It should not be counted as state mismatch merely because the desired object has a state that must change.

Consider a doorway example. A door is two meters high and two meters wide. Can a five-meter pole pass through it? If the pole is a thin rod and there is enough space on both sides, it can pass through by orienting along the direction of motion. A mistaken two-dimensional abstraction compares the rod length to the door's diagonal and concludes that it cannot pass. Here the goal is clear; the failure lies in physical affordance, abstraction level, and hidden assumptions. This becomes state mismatch only when the relevant physical configuration, constraints on orientation, or surrounding space are not observable or not identifiable from the given scene. Otherwise, it is a world-model/construal failure compounded with specification and aggregation effects.

The general pattern is:

\[
x \rightarrow \tilde{z} \rightarrow y,
\]

where $\tilde{z}$ is the wrong task model. The subsequent reasoning may be locally coherent while still answering the wrong abstraction. This pattern is central to the gap between clean benchmark performance and robust real-world reasoning.

A useful experimental measure is the **construal gap**:

\[
\operatorname{ConstrualGap} =
P(\text{correct} \mid \text{clean abstract form})
-
P(\text{correct} \mid \text{noisy natural scene}).
\]

A large construal gap indicates that failure occurs in scene-to-model abstraction rather than in solving the abstract problem itself.

#### 3.5.4 Structure-Signal Gap

Outcome-level feedback can tell a system that an answer failed without identifying the rare structural dependency that made a better answer succeed. This is the **structure-signal gap**. It often appears when a final score, user rating, or test result is available but does not localize the cause of success or failure.

This pattern is usually an interaction of support and aggregation mismatch. The decisive structure is rare, and local changes do not reveal its contribution. Knowledge Governance addresses this by perturbing artifacts, comparing failures, and trying to convert outcome feedback into explicit structural hypotheses.

#### 3.5.5 Representation or Control-Space Gap

A method may fail not because the model lacks all relevant knowledge, but because the active representation is wrong. The system may search over fluent paragraphs when it should search over plot beats, policy states, physical variables, dependency graphs, economic regimes, or risk filters. This is a representation-level bottleneck, not a sixth mismatch class. It motivates task-specific constructors and decoupled control spaces.

#### 3.5.6 Corpus-Prior Dominance

Some tasks concern historical, cultural, geopolitical, institutional, or moral evaluation. In such settings, the model's default answer may be shaped by high-frequency or high-authority narratives in the training corpus. The failure is not necessarily factual ignorance. The model may know minority evidence or alternative frames, but without explicit prompting, retrieval, or governance, these frames remain low-salience and low-probability.

This is best understood as **corpus-prior dominance** rather than a sixth primitive mismatch. It often decomposes into:

- support mismatch: the less common but task-relevant frame is hard to reach;
- specification mismatch: the model treats the mainstream narrative as the evaluation standard;
- state mismatch: the correct evaluation depends on period, institutional role, development stage, or background condition;
- aggregation mismatch: local costs or visible failures obscure system-level effects.
- overfitting mismatch: a high-frequency narrative or local explanatory template becomes over-bound and suppresses adjacent alternatives.

The appropriate intervention is source-prior governance: separate dominant narrative, counter-narrative, evidence base, causal mechanism, evaluation metric, and counterfactual comparison.

#### 3.5.7 Budgeted Control-Capacity Collapse

On sufficiently complex tasks, some systems collapse rapidly into low-quality output. This collapse is not a new primitive mismatch. It occurs when the task's mismatch load exceeds the system's effective control capacity:

\[
C_{\mathrm{eff}}(M,\Pi_B,R) < L_{\mathrm{mismatch}}(x,s),
\]

where $M$ is the model, $\Pi_B$ is the inference procedure and budget, $R$ is the active representation, and $L_{\mathrm{mismatch}}$ is the combined load created by aggregation, support, state, specification, and overfitting mismatch.

The same task may not collapse under a system with stronger adaptive compute, better task routing, a more stable control state, or a better representation. This is why complex-task collapse should be treated as a model-budget-control regime rather than a primitive mismatch. Its intervention is to increase effective control capacity or transform the task into lower-mismatch subtasks.

### 3.6 Relation to Task Patterns

The five mismatches are more primitive than domain labels. Recurrent task patterns can be understood as typical mismatch profiles.

| Task pattern | Dominant mismatch | Typical secondary mismatch | Notes |
|---|---|---|---|
| Multi-objective coordination | Aggregation | Specification | Local improvements trade off against hidden global constraints. |
| Low-probability, high-value discovery | Support | Aggregation | The decisive structure is rare under ordinary continuation. |
| Dynamic games / non-stationary adaptation | State | Specification | Utility changes with latent or evolving regimes that observations may not identify. |
| Tacit, expert, or adversarial evaluation | Specification | State | The accessible proxy diverges from true quality; state matters only when the criterion itself is conditional on latent regime. |
| Order-sensitive trajectories | Aggregation / State | Support | The required sequence is a derivative pattern, not a primitive class. |
| Emergent specification | Specification | State | The proxy objective becomes clearer through interaction; this is not hidden-state inference unless true utility changes with latent state. |
| Noisy-context construal | Specification / State | Support / Aggregation | The system must build the right task model; state is primitive only when the relevant latent state is not identifiable from observations. |
| Corpus-prior dominance | Support / Specification | State / Aggregation | Default narratives can suppress low-salience but task-relevant frames. |
| Control-capacity collapse | Composite regime | Representation / Budget | The mismatch load exceeds effective control capacity. |

This matters because the same application may instantiate several mismatch sources simultaneously. For example, high-integrity code synthesis may involve aggregation mismatch (nonlocal structural coupling), support mismatch (rare correct architectures), and specification mismatch (true quality exceeds what a benchmark or test suite directly measures). A noisy real-world reasoning task may involve state mismatch (hidden physical affordances), specification mismatch (misidentified success condition), and support mismatch (the correct abstraction is rare relative to common surface templates).

---

## 4. Autoregressive Local Alignment

LLM mediocrity and autoregressive extraordinary are useful poles of a wider probability-value spectrum, but most real tasks live between them. We call this middle regime **autoregressive local alignment**, or **probability-value local alignment**. It is the state in which the model's statistical continuation tendencies are aligned with some parts of the task value function, but the alignment is partial, conditional, and not sufficient to guarantee global success.

Local alignment is not a weak version of mediocrity. It is a distinct operating regime. The system can genuinely perform useful work: compress context, preserve register, generate candidate structures, produce clear prose, enumerate edge cases, or instantiate familiar patterns. The failure risk appears when these locally valuable operations are mistaken for global task completion.

### 4.1 Definition

Let $x$ denote the input, $s$ the relevant latent or environmental state, and $y$ the final output. A task instance exhibits **autoregressive local alignment** under an inference procedure $\Pi_B$ when some reachable local operations are positively aligned with task value, while the final-output process is not globally guaranteed to reach the near-optimal set $\mathcal{H}_\tau(x,s)$.

Informally:

\[
\text{local likelihood direction} \approx \text{local task-value direction},
\]

but

\[
\text{local likelihood direction} \not\Rightarrow \text{global task-value direction}.
\]

Equivalently, the model may be reliable over local continuations, fragments, transformations, or subtasks while remaining unreliable over the whole task trajectory. A locally aligned system may produce outputs that are partly correct, partly insightful, and partly polished, yet still fail because the global objective, state condition, role binding, structural dependency, or evaluation criterion was not preserved.

### 4.2 Formal Characterization

For a transformed or decomposed task, suppose the system constructs intermediate objects

\[
Z=(z_1,z_2,\ldots,z_k)
\]

and then renders a final output

\[
y=R(Z,x).
\]

Let $u_i(z_i;x,s,z_{<i})$ denote the local value of an intermediate object or operation, and let $U(R(Z,x);x,s)$ denote the global task utility after composition. A local-alignment score can be represented conceptually as

\[
\ell_i(x,s)=
\rho\left(
\log q_{\Pi_B}(z_i \mid x,z_{<i}),
 u_i(z_i;x,s,z_{<i})
\right),
\]

where $\rho$ is a rank or correlation measure over a candidate pool. A task is locally aligned when many $\ell_i$ are positive, but the composed output is not reliably near-optimal:

\[
\Pr_{Z \sim q_{\Pi_B}}
\left[R(Z,x) \in \mathcal{H}_\tau(x,s)\right]
\]

is intermediate, unstable, or highly sensitive to representation, validation, and control policy.

This distinguishes local alignment from both neighboring regimes:

- In **LLM mediocrity**, the system remains in a low-value basin because one or more primitive mismatches prevent reachable probability from tracking task value.
- In **autoregressive local alignment**, many local operations are useful, but their composition is not automatically value-preserving.
- In **autoregressive extraordinary**, local operations tend to compose into global quality under the available budget and representation.

### 4.3 Local Alignment as the Default Human Task Regime

Local alignment is the regime people most often encounter when using LLM systems. Human-facing tasks are rarely pure mathematical instances with fully explicit value functions, but they are also rarely pure adversarial search problems. They usually combine:

- **routine linguistic or structural work**, where the model is strongly aligned with task value;
- **context compression and re-rendering**, where autoregression is often useful;
- **tacit criteria**, where the user's true objective is under-specified;
- **hidden state**, where the correct answer depends on information not fully visible in the prompt;
- **nonlocal structure**, where local improvements do not necessarily compose;
- **rare high-value moves**, where the decisive insight is not the default continuation.

This is why many outputs feel simultaneously impressive and inadequate. A model may write the right kind of document, in the right tone, with many correct local moves, while still missing the actual decision variable. It may produce a good plan that fails under a hidden constraint. It may generate a polished answer that optimizes an accessible proxy rather than the user's true objective. These are not pure failures of language generation; they are failures to convert local alignment into global alignment.

### 4.4 Diagnostic Signs of Local Alignment

Local alignment is visible when an output has genuine local quality but incomplete global task value. Common signs include:

- the prose is clear, but the problem construal is wrong;
- the outline is plausible, but the decisive dependency is absent;
- the examples are useful, but the evaluation standard is misplaced;
- the answer is factually reasonable, but conditioned on the wrong latent state;
- the code is idiomatic, but violates a nonlocal invariant;
- the story has strong scenes, but weak promise-payoff structure;
- the recommendation is well argued, but optimizes the wrong objective;
- the user response is empathetic, but mistimed relative to the dialogue state;
- multiple candidates look diverse, but share the same hidden failure.

The characteristic user reaction is: "This is good, but it is not quite what matters." That reaction is a signature of local alignment. The model has generated value, but not the value that controls final success.

### 4.5 Local Alignment and the Five Mismatches

Local alignment can be analyzed through the same five primitive mismatch axes.

| Mismatch axis | Local-alignment form | Typical failure |
|---|---|---|
| Aggregation | Local improvements are real but do not compose. | Polished parts weaken the global structure. |
| Support | Some useful structures are easy, but the decisive structure is rare. | The model circles near the answer without surfacing the key invariant. |
| State | The answer is locally plausible under one state but wrong under another. | The model gives a reasonable response for the wrong regime. |
| Specification | The prompt proxy captures part of value but misses the tacit criterion. | The model optimizes clarity, tone, or format while missing success. |
| Overfitting | A local explanation, proxy, or role template works in one scene but does not survive neighboring perturbations. | The model treats "locally supported" as "globally invariant." |

This table clarifies why local alignment should not be treated as a sixth primitive mismatch. It is a regime produced by partial positive alignment plus residual mismatch. The primitive question remains: where does the local alignment stop, and which mismatch prevents it from becoming global alignment?

### 4.6 Design Consequences

Local alignment changes the intervention strategy. If a task is purely high-mismatch, the system may need substantial control-space search. If a task is already extraordinary, heavy governance may be unnecessary. But if a task is locally aligned, the right strategy is selective:

1. preserve aligned operations such as compression, outlining, rewriting, style transfer, matrix construction, and semantic decompression;
2. identify the boundaries where local continuation stops being a reliable proxy for value;
3. externalize those boundary conditions as rubrics, state predicates, invariants, failure modes, or GKOs;
4. validate composition so that locally good parts remain globally coherent;
5. render fluently only after the control structure has stabilized enough for the task.

In this sense, local alignment is the natural target of Knowledge Governance. Governance should not fight the model's autoregressive strengths. It should harvest them, constrain them where they become unsafe or misleading, and convert partial alignment into more stable global alignment.

### 4.7 Relationship to the Three-Regime View

The resulting three-regime view is:

| Regime | Probability-value relation | Typical output | Preferred intervention |
|---|---|---|---|
| **LLM mediocrity** | Systematic divergence or low reachability | Fluent but low-value basin | Reparameterize, search control space, validate hard. |
| **Autoregressive local alignment** | Local positive alignment with global instability | Useful parts, incomplete whole | Preserve aligned parts; govern boundaries and composition. |
| **Autoregressive extraordinary** | Stable positive alignment | Local improvement compounds into global value | Use direct generation or lightweight search. |

This middle regime is important because it is where most practical user tasks begin. Users rarely face an LLM that is wholly useless on the task. They face a system that is useful enough to create local value, but not governed enough to ensure that local value becomes final task success.


### 4.8 Policy-Value Compression and the Expansion of Local Alignment

A useful clarification is that aligned LLMs should not be understood as systems that merely follow raw lexical frequency. Pretraining induces a distribution over token continuations, but supervised fine-tuning, reinforcement learning from human feedback, preference optimization, process supervision, and related methods reshape this distribution. They make certain trajectories more likely not because those trajectories are merely frequent in the pretraining corpus, but because they better satisfy a proxy for helpfulness, correctness, harmlessness, user intent, or task success.

In this sense, alignment training performs a form of **policy-value compression**. Proxy task value is not directly emitted as value. It is compressed into the model's policy and expressed at inference time as a probability distribution over tokens, reasoning traces, tool calls, intermediate states, and output trajectories:

\[
U_{\mathrm{proxy}} \rightarrow \pi_{\theta}^{\mathrm{aligned}}(y \mid x).
\]

This is the precise sense in which reinforcement learning and preference optimization can be understood as task-value alignment. They do not make the model stop using probability. They reshape the probability landscape so that many valuable continuations become easier to reach. The output remains autoregressive; the probability distribution has absorbed proxy value.

This explains why the region of autoregressive local alignment expands as models are trained with better feedback. More tasks move from probability-value divergence into probability-value partial alignment, and some tasks move further into autoregressive extraordinary. The model becomes increasingly likely to generate locally useful, instruction-following, preference-aligned, and task-relevant continuations.

Thinking and test-time reasoning extend this process at inference time. Chain-of-thought, self-consistency, tree search, process feedback, and iterative revision do not merely add tokens. They create intermediate states in which the original task can be decomposed into smaller operations:

\[
x \rightarrow z_1,z_2,\ldots,z_k \rightarrow y.
\]

These intermediate operations include construal extraction, assumption listing, state enumeration, rubric construction, candidate generation, edge-case discovery, verification, and final rendering. Many of them are easier to align locally than the original final-output task. Thinking therefore expands the **reachable** region of local alignment, while alignment training expands the **learned** region of local alignment.

However, policy-value compression does not eliminate structural mismatch. It only expands the region in which probability and value are aligned. In open-ended tasks, the true utility function may still depend on nonlocal aggregation, low-support structures, latent state, or underspecified goals. These are not guaranteed to be fully recoverable from training data, preference labels, reward models, or longer reasoning traces. Longer thinking can expose more structure, but if the active representation is wrong, it can also produce longer rationalizations of the wrong construal.

The distinction can be summarized as follows:

| Mechanism | What it expands | What remains unresolved |
|---|---|---|
| **Pretraining** | Language, world patterns, semantic priors, common trajectories | Corpus probability is not identical to task value. |
| **SFT / RLHF / DPO** | Proxy human preference, instruction-following, helpfulness, safety, task-style alignment | Proxy value is not always true task value. |
| **Process supervision** | Step-level correctness under a defined criterion | The criterion may miss hidden state, rare structure, or global utility. |
| **Thinking / CoT / search** | Reachable intermediate states and locally aligned decompositions | More reasoning can still follow the wrong representation. |
| **Retrieval and tools** | External facts, external state, executable checks, current evidence | The system still needs the right question, control representation, and value criterion. |
| **Knowledge Governance** | Externalized, validated, revocable task-control knowledge | It depends on control-space quality, validation strength, and governance cost. |

This is why autoregressive local alignment is the dominant practical regime. The model is neither a raw next-token frequency machine nor a fully value-governed reasoner. It is a system whose policy has absorbed many proxy values, whose reasoning can expose additional local structure, but whose outputs still require governance when local alignment fails to compose into global task success.

---

## 5. Autoregressive Extraordinary

Autoregressive local alignment describes the common mixed regime, but some tasks exhibit a stronger property: the model's autoregressive continuation process naturally moves toward high-value outputs across the relevant task structure. We call this positive pole **autoregressive extraordinary**.

### 5.1 Definition

Let $\mathcal{H}_\tau(x,s)$ be the near-optimal set defined above. A task instance exhibits **autoregressive extraordinary** under $\Pi_B$ when high-value outputs are not tail events but are easily reachable under the inference procedure: the reachability score of Section 3.2.2,

\[
r_{\tau,B}(x,s)=
\Pr_{y \sim q_{\Pi_B}(\cdot \mid x)}
\left[y \in \mathcal{H}_\tau(x,s)\right],
\]

is high, and ordinary local operations such as continuation, rewriting, expansion, compression, style adjustment, or structural formatting tend to increase rather than decrease task value. In the typical extraordinary case the support score $\sigma_\tau(x,s)$ is itself high — the base policy already places substantial mass on the near-optimal set — so that little or no search effort is needed to convert support into reachability.

Informally:

\[
\text{local likelihood gradient} \approx \text{task-value gradient}.
\]

In LLM mediocrity, what is easy to continue is not what is truly valuable. In autoregressive local alignment, what is easy to continue is often valuable locally but not sufficient globally. In autoregressive extraordinary, what is easy to continue is often exactly what the task rewards across the task.

This distinction is essential. The same model can be mediocre on one task, locally aligned on another, and extraordinary on a third. The difference is not simply model intelligence. It is the alignment relation among the model distribution, the inference procedure, the active representation, and the task utility.

### 5.2 Positive-Alignment Conditions

Autoregressive extraordinary tends to appear when several conditions hold.

#### 5.2.1 High-Support Excellence

High-value outputs lie in high-probability regions of the model distribution. The system does not need to discover a rare invariant, unusual strategy, or low-frequency structure. It needs to instantiate a pattern that the model has seen many times in high-quality form.

Typical examples include standard emails, summaries, common explanations, boilerplate code, README files, SOPs, policy templates, common SQL patterns, and standard documentation.

#### 5.2.2 Local-to-Global Compositionality

Local improvements genuinely compose into global improvement. Shortening a redundant sentence improves the paragraph. Adding a clear transition improves the document. Preserving a table schema improves comparative clarity. Tightening a definition improves the surrounding explanation.

In this regime, aggregation mismatch is low. The local nature of autoregressive generation is not a liability; it is a useful search bias.

#### 5.2.3 Explicit or Stable State

The relevant state is either already explicit, stable, or not decisive. A rewriting task may not require hidden market regimes or changing user emotions. A summary of a provided document does not require inferring an unobserved physical affordance. A translation task can often proceed from the given text without deep latent-state modeling.

When state is stable, the model's default continuation is less likely to be conditionally wrong.

#### 5.2.4 Specification Alignment

The accessible proxy objective is close to the true objective. If the user asks for a shorter, clearer, more formal version of a paragraph, the prompt-implied proxy is often close to the real target. If the user asks for ten possible titles, diversity and plausibility are genuinely useful proxies. If the user asks for a checklist, coverage and clarity are meaningful intermediate objectives.

This does not mean the proxy is perfect. It means optimizing the proxy is unlikely to move the system in the wrong direction.

#### 5.2.5 Representation Adequacy

The fluent output space itself is a good enough control space. For many tasks, natural language lists, outlines, tables, bullets, rubrics, and examples are not merely surface forms; they are effective representations of the work to be done.

When representation adequacy holds, a decoupled control space may add little value. The output space is already sufficiently aligned with task control.

### 5.3 Major Autoregressive-Extraordinary Patterns

The following patterns are not guaranteed successes, but they are common positive-alignment regimes.

#### 5.3.1 Context Compression and High-Dimensional Semantic Mapping

The model takes a large context and compresses it into a summary, taxonomy, decision matrix, semantic map, or task-relevant abstraction. This is often difficult for humans because of working-memory limits and attention fatigue. LLMs can preserve many semantic relations simultaneously and render them into compact form.

This is a central autoregressive-extraordinary regime because compression quality often aligns with the model's learned semantic representations.

#### 5.3.2 Semantic Decompression and Surface Realization

The reverse operation is also powerful. Given a sparse control state - bullets, outline, notes, rough thoughts, requirements, or a skeletal argument - the model expands it into coherent prose, an email, a memo, a product requirement document, a speech, or a report.

This is extraordinary when the upstream structure is correct. The model is not being asked to discover the core insight; it is asked to render it well.

#### 5.3.3 Register Transfer

The model converts the same meaning across audience, tone, formality, domain register, or rhetorical posture:

- technical to executive;
- academic to public-facing;
- harsh to professional;
- vague to precise;
- informal to polished;
- legalistic to plain-language;
- Chinese reasoning to native English business prose.

These transformations are strongly represented in the model's token-level distribution. The task value is highly aligned with style, syntax, and phrase selection.

#### 5.3.4 Surface Polish and Local Language Improvement

LLMs are often excellent at reducing redundancy, improving transitions, tightening sentences, adjusting rhythm, clarifying phrasing, and making prose more readable. These tasks have low aggregation mismatch because local improvements usually compose.

The boundary is important: surface polish is extraordinary only when the underlying argument or structure is already good enough. Otherwise, the system may produce polished mediocrity.

#### 5.3.5 Structured Transformation

The model converts loose text into a table, checklist, JSON schema, YAML file, rubric, action-item list, user-story list, decision tree, SOP, or comparison matrix.

This is not merely summarization. It is representational normalization. Many formats have strong local constraints, and those constraints make autoregressive generation reliable: the next token is guided by the schema.

#### 5.3.6 Taxonomy and Design-Space Generation

The model generates candidate categories, dimensions, failure modes, risk types, stakeholder groups, product ideas, research hypotheses, or analytical frames. Human experts often have stronger final judgment, but LLMs have high recall over adjacent conceptual space.

This is extraordinary when the goal is candidate coverage rather than final truth. It becomes mediocre if the generated taxonomy is treated as valid without checking for overlap, missing axes, false primitives, or poor operationalization.

#### 5.3.7 Ideation under Weak Constraints

When the task rewards many plausible candidates at low cost - titles, slogans, prompts, story premises, A/B test ideas, interview questions, campaign angles - LLMs are often unusually effective. The value function is diversity times acceptable quality times low generation cost.

This is a high-recall hypothesis-generation regime. The model need not be a perfect evaluator to be a valuable generator.

#### 5.3.8 Analogy and Pedagogical Reframing

The model can explain the same concept using multiple analogies, examples, levels of expertise, or learner personas. This is useful because teaching often depends on re-rendering the same structure from different entry points.

The risk is false analogy. The intervention is to ask for scope conditions: where the analogy holds, where it breaks, and what it hides.

#### 5.3.9 Boilerplate and Scaffold Synthesis

Many useful artifacts are highly patterned: API skeletons, CRUD endpoints, unit-test templates, README files, meeting notes, incident reports, HR policies, standard operating procedures, and project plans.

Here high-value outputs often lie inside high-support regions. The model's priors are an advantage. The boundary appears when the task shifts from scaffold generation to high-integrity implementation, security, legal responsibility, or complex architecture.

#### 5.3.10 Edge-Case and Counterexample Generation

LLMs are often strong at listing ways something might fail: code edge cases, policy abuse cases, contract ambiguities, product failure modes, user confusion states, adversarial prompts, or missing assumptions.

This is extraordinary when the task is high-recall candidate generation. It is not sufficient for final verification, but it creates valuable objects for later validation.

#### 5.3.11 Query Formulation and Search Strategy Generation

The model can translate an ambiguous information need into search queries, academic keywords, related terms, multilingual expressions, database search strings, and retrieval routes. This turns a semantic need into surface forms that search systems can use.

This is an important bridge between autoregressive generation and external evidence. It is often easier for a model to generate good queries than to answer a current or specialized question without retrieval.

#### 5.3.12 Comparative Matrix Synthesis

The model can organize multiple options across multiple dimensions: pros, cons, risks, assumptions, costs, reversibility, implementation complexity, stakeholders, and failure modes. The table schema stabilizes generation, and each cell has a local role.

The risk is false completeness. If facts are current, numerical, or domain-critical, the matrix must be grounded and verified.

#### 5.3.13 Protocolization of Tacit Processes

The model can convert expert fragments, meeting notes, rough instructions, or repeated practice into a first-pass SOP, checklist, onboarding guide, playbook, or workflow. Human experts often know what they do but do not have time to write it down. LLMs can quickly make tacit fragments explicit.

The boundary is invention. The model may fill gaps with plausible but nonexistent steps. Expert validation remains necessary.

### 5.4 Autoregressive Extraordinary Is a Regime, Not a Task Label

No task category is permanently extraordinary. Summarization can be extraordinary when the source is explicit and the goal is clear; it can become locally aligned when the model compresses the text well but misidentifies what matters; and it can become mediocre when hidden legal, political, or strategic criteria dominate. Code generation can be extraordinary for scaffolds, locally aligned for idiomatic but incompletely validated implementations, and mediocre for leakage-sensitive systems. Teaching can be extraordinary when the learner state is clear, locally aligned when the explanation is good but the misconception is only partly identified, and mediocre when the actual misconception is hidden. Comparison matrices can be extraordinary for structure, locally aligned for organizing uncertain facts, and mediocre when unsupported cells are treated as truth.

The correct unit of analysis is therefore not the task name but the alignment regime:

| Surface task | Extraordinary when | Locally aligned when | Mediocre when |
|---|---|---|---|
| Summarization | Information is explicit and success means faithful compression. | Compression is good but importance depends on partially hidden stakes. | Importance depends on hidden stakes or expert judgment. |
| Writing | Structure and goal are clear. | Prose and sections improve while the core argument remains unstable. | The task requires rare insight, taste, or strategic novelty. |
| Code | Pattern is common and validator is reliable. | Code is idiomatic but nonlocal invariants need checking. | Architecture, security, leakage, or nonlocal dependencies dominate. |
| Teaching | Learner state is known. | Explanation is clear but the learner's misconception is only partially identified. | The real misconception is hidden. |
| Brainstorming | Candidate diversity is valuable. | Many plausible candidates are generated but strategic selection is unresolved. | Final strategic judgment is required. |
| SOP drafting | Process is conventional or supplied. | A good first-pass protocol exists but local organizational constraints are missing. | Organization-specific constraints are missing. |
| Tone adjustment | Meaning is stable. | Tone improves but diplomatic, legal, or reputational boundaries remain tacit. | Diplomatic, legal, or reputational boundaries are tacit. |

This regime view is critical for system design. It prevents both overuse and underuse of governance. If the task is already autoregressive-extraordinary, heavy governance may waste compute. If the task is locally aligned, selective governance should protect the aligned operations while controlling the unstable boundaries. If the task is high-mismatch, direct generation may produce only fluent mediocrity.

---

## 6. Mediocrity-to-Extraordinary Transformation

Autoregressive extraordinary provides a general strategy for mitigating LLM mediocrity, but the practical starting point is often autoregressive local alignment. The core idea is simple:

> Do not always ask the model to solve the high-mismatch or only locally aligned final-output task directly. Instead, preserve the locally aligned operations and transform the unstable parts into lower-mismatch subtasks whose values are positively aligned with autoregressive generation.

This broader principle includes decoupled control spaces, but it is not limited to them. A decoupled control space is one implementation. The deeper objective is to change the task distribution faced by the model.

### 6.1 Reparameterizing the Task

A direct generation setup asks for:

\[
x \rightarrow y.
\]

If $y^\star$ lies in a low-reachability region or depends on hidden state, tacit specification, or global aggregation, direct output-space search may plateau even when many local operations inside the task are well aligned.

A Mediocrity-to-Extraordinary transformation introduces intermediate objects:

\[
x \xrightarrow{T} z_1,z_2,\ldots,z_k
\xrightarrow{R} y
\xrightarrow{V} \text{validated or revised output}.
\]

The intermediate objects may include:

- compressed context;
- task model;
- success condition;
- role binding;
- state matrix;
- hidden assumption list;
- rubric;
- failure-mode taxonomy;
- edge-case set;
- search queries;
- dependency graph;
- outline;
- skeleton;
- candidate invariant;
- GKO set.

The transformation works when the intermediate operations are themselves autoregressive-extraordinary, locally aligned in a controllable way, or at least lower-mismatch than the original task. The final answer is then not generated from an underconstrained prompt but rendered from a structured, validated, and task-relevant representation.

### 6.2 From Local Alignment to Global Alignment

For locally aligned tasks, the system should not discard the model's natural strengths. Instead, it should ask which parts of the task can safely remain autoregressive and which parts must be governed.

A practical local-to-global transformation has four steps:

1. **Exploit local alignment.** Use the model for compression, restructuring, query generation, surface polish, outline expansion, and candidate enumeration when those operations are aligned with local task value.
2. **Locate the alignment boundary.** Identify where local fluency stops predicting final success: hidden state, tacit objective, rare invariant, nonlocal dependency, or misleading source prior.
3. **Govern the boundary.** Convert the boundary into explicit artifacts: state matrices, rubrics, constraints, counterexamples, role bindings, failure modes, or GKOs.
4. **Validate composition.** Check that locally good pieces compose into the global task objective rather than merely creating a polished proxy.

This is why local alignment is the most important practical target for Knowledge Governance. The system is not moving from zero value to value. It is moving from partial value to controlled value.

### 6.3 Transformation under Each Primitive Mismatch

#### 6.3.1 Aggregation Mismatch: Make Global Structure Local

When global value does not decompose into local improvements, the transformation should first expose the global structure.

Typical transformations include:

- generate a dependency graph before writing;
- create a plot-beat map before prose;
- extract cross-module invariants before code;
- define a decision matrix before recommendation;
- list long-range commitments before narrative rendering;
- build an evaluation checklist before revision.

The original task may be: produce a globally coherent artifact. The transformed task becomes: generate a structure, fill the structure, and check whether the filled artifact preserves the structure. Each subtask is more local and more aligned with autoregressive strengths.

#### 6.3.2 Support Mismatch: Pull Tail Structures into Context

When high-value solutions are rare under the model distribution, the transformation should explicitly surface rare structures before asking for the final output.

Typical transformations include:

- ask for non-obvious alternatives;
- enumerate minority frames;
- generate counterexamples;
- search for unusual constraints;
- produce adversarial cases;
- create retrieval queries aimed at low-salience evidence;
- ask what a conventional answer would miss.

Once a rare structure becomes explicit context, the final rendering task may become ordinary. The system no longer needs to spontaneously sample the rare answer; it only needs to develop an already surfaced structure.

#### 6.3.3 State Mismatch: Condition the Output on State

When utility depends on hidden or changing state, the transformation should make state explicit.

Typical transformations include:

- list plausible latent states;
- identify which state variables change the ranking of actions;
- generate a scenario matrix;
- write if-then policies;
- define revocation triggers;
- ask what assumption would flip the answer;
- request clarifying diagnostics when information is missing.

The original task may be: give one answer under hidden state. The transformed task becomes: enumerate states, map actions to states, and render a conditional policy.

#### 6.3.4 Specification Mismatch: Externalize the Value Function

When the accessible proxy diverges from true utility, the transformation should make the target more explicit.

Typical transformations include:

- generate a rubric;
- compare good and bad examples;
- ask what would look good but fail;
- elicit user preference through pairwise contrasts;
- define disqualifying failure modes;
- separate style criteria from outcome criteria;
- revise the proxy after inspecting candidate outputs.

The original task may be: optimize a vague target. The transformed task becomes: infer the target, generate candidates, and evaluate them against the inferred target.

### 6.4 Multi-Request Interaction as Transformation

Multiple requests do not automatically mitigate mediocrity. If the user only asks the model to "try again," "think harder," or "make it better," the model may remain in the same low-value basin and produce more polished mediocrity.

Multi-request interaction becomes powerful only when each request changes the next task distribution. A useful sequence accumulates intermediate artifacts that constrain later generation:

\[
q_0(y \mid x)
\rightarrow
q_1(z_1 \mid x)
\rightarrow
q_2(z_2 \mid x,z_1)
\rightarrow
q_3(y \mid x,z_1,z_2,\ldots,z_k).
\]

The practical rule is:

> Each round should produce a persistent object that changes what the next round is solving.

Examples of persistent objects include rubrics, state matrices, edge cases, failure lists, search results, outlines, dependency graphs, and governed rules. Without persistent objects, multi-turn prompting is often just repeated output-space sampling.

### 6.5 Algorithm 1. Positive-Alignment Reparameterization

**Input:** task input $x$; optional context $c$; model and inference procedure $\Pi_B$; available tools; stop criterion `Stop`

**Output:** rendered output $\hat{y}$ and intermediate artifacts $Z$

```text
Z ← ∅
A ← {x, c}

1. Diagnose mismatch
   Identify likely aggregation, support, state, specification, and overfitting mismatch.

2. Select transformation operators
   Choose subtasks that are likely autoregressive-extraordinary:
   compression, rubric generation, state enumeration, edge-case generation,
   query formulation, outline construction, semantic decompression, or checklist verification.

3. Generate intermediate artifacts
   For each selected operator, produce z_i and add it to Z.

4. Validate or weaken artifacts
   Reject unsupported claims, mark assumptions, identify conflicts,
   and record evidence strength.

5. Render final output
   Generate y from x plus the validated or weakened artifacts Z.

6. Verify composition
   Check whether y preserves the artifacts, satisfies the rubric,
   covers the state conditions, and avoids known failure modes.

7. Revise or stop
   If verification fails, revise the artifacts or rendering strategy.
   Otherwise return y and Z.
```

This algorithm is intentionally broader than Knowledge Governance. It can be implemented with simple prompting, with retrieval, with tools, with human feedback, with a formal control space, or with a full governance layer.

### 6.6 Failure Modes of Transformation

Mediocrity-to-Extraordinary transformation can fail in several ways.

#### 6.6.1 Proxy Drift

The transformation may replace the original hard task with an easier but wrong proxy. For example, "produce strategic insight" may become "write a clear multi-section memo." The model then performs extraordinarily at clarity while missing strategy.

#### 6.6.2 False Intermediate Artifacts

The model may generate plausible but false rubrics, invariants, assumptions, or state variables. If these are not validated, they can make the final output worse while increasing confidence.

#### 6.6.3 Composition Failure

Each subtask may succeed locally, but the final composition may fail. A good rubric may not be followed. A strong outline may be contradicted during prose expansion. A state matrix may be ignored in the final recommendation. Composition validation is therefore mandatory.

#### 6.6.4 Non-Extraordinary Intermediate Tasks

Some intermediate tasks are themselves hard. True mathematical invariants, rare engineering architectures, legal standards, scientific mechanisms, and current market facts may require tools, retrieval, formal verification, experiments, or expert judgment. Reparameterization cannot turn every hard task into a purely linguistic task.

### 6.7 Relationship to Knowledge Governance

Knowledge Governance is a disciplined implementation of Mediocrity-to-Extraordinary Transformation. It formalizes the intermediate artifacts as governed control knowledge, assigns evidence strength and scope, and tracks when they should apply or be revoked.

In short:

- **LLM mediocrity** is the broad failure regime.
- **Autoregressive local alignment** is the common mixed regime in which local value exists but global value is unstable.
- **Primitive mismatches** are the diagnostic axes that identify where local alignment breaks; aggregation mismatch is the specific source of autoregressive mediocrity.
- **Autoregressive extraordinary** is the stable positive-alignment regime.
- **Mediocrity-to-Extraordinary Transformation** is the general intervention principle.
- **Knowledge Governance** is a strong, inspectable implementation for high-stakes, high-mismatch, or only locally aligned cases.

### 6.8 Operational Method Patterns

The transformation principle can be made concrete through a small set of recurring operational methods. Their common core is the same: do not allow generation to slide along high-frequency continuation paths in raw token space. Instead, deliberately construct an intermediate layer that is searchable, evaluable, and revocable. Once such a layer exists, the task is no longer "continue writing." It becomes: search, validate, prune, and recombine within a control representation, and only then render the result back into output space.

Each method below is annotated with the primitive mismatch it primarily counters and with the characteristic failure mode that arises when it is applied carelessly. The methods are complementary and are frequently composed within a single task.

#### 6.8.1 Dense Decorrelated Sampling, Fragmentation, and Cross-Sample Recombination

**Primary target:** support mismatch. **Secondary:** aggregation mismatch.

When high-value answers lie in the low-probability tail, writing the final answer directly is repeatedly pulled back toward common patterns by autoregressive gravity. A more effective sequence is: (i) sample a large candidate pool under autoregressive generation; (ii) select the locally most promising samples; (iii) fragment them into functional units — structures, strategies, key turns, partial solutions; and (iv) recombine those units across samples into a new candidate space that is no longer anchored to the original artifact boundaries.

Three refinements are essential.

First, the sampling must be **decorrelated, not merely dense**. As noted in Section 1, candidate diversity can be nontrivial while all candidates still occupy the same low-value basin. A pool of near-duplicates yields fragments with no tail structure to recover. Decorrelation should therefore be forced deliberately: temperature and nucleus variation, prompt and framing perturbation, alternative construals of the task, different orderings of constraints, and contrastive instructions that explicitly request what a conventional answer would miss.

Second, the value of recombination is not merely splicing better content. It is the extraction, from the sample cluster, of **high-sigma hard experience** that ordinary summarization does not surface: rare but effective structures, hidden constraints, non-obvious turns, recurring failure modes, and high-value expressive moves. These extracted claims are candidate control knowledge, not conclusions. They are subject to a selection-noise hazard: a pattern mined from a finite pool may be a multiple-comparisons artifact rather than a real invariant. Validation must therefore be performed on held-out samples or on freshly generated candidates, never solely on the pool that suggested the pattern. Surviving claims enter the GKO lifecycle with an explicit evidence regime (Section 8.1).

Third, the loop is repeatable. Each time the system reaches a new local optimum, the same sample-fragment-recombine-validate cycle can be run around it to probe for the next tail structure.

This method is the general form of the Fragment-Perturb-Reconcile machinery of Section 7.2, and the leakage-sensitive code-synthesis pattern of Section 10.5 is its concrete instantiation. Its essence is an anti-support-mismatch maneuver: dredge low-probability, high-value local structures out of the tail first, then convert them into explicit control resources from which rendering becomes an ordinary, high-support task.

#### 6.8.2 Control-Space-First Generation

**Primary target:** aggregation mismatch and specification mismatch.

For tasks such as stories, long-form documents, curriculum design, and complex plans, direct generation of the finished artifact is often mediocre. Yet the elements that an excellent result must satisfy — beats, pacing, constraints, style boundaries, emotional curves, character relations, promise-payoff obligations, acceptance criteria — are subtasks on which the model frequently performs at the extraordinary level.

The method is therefore to write the control space before writing the output. Construct, for example, character arcs, a conflict gradient, thematic constraints, scene beats, an information-revelation order, a banned-trope list, and a scoring rubric. Generate the artifact under this control state. Then evaluate the artifact with comparatively more reliable evaluation tasks: Did the pacing stall? Was a premise violated? Did a planted commitment fail to pay off? Did the output fall into a banned pattern?

If the result is inadequate, **revise the control space rather than immediately rewriting the full text**. This rule is a credit-assignment principle: it moves the locus of correction from the output layer to the control layer. Without it, repeated rewriting degenerates into ordinary output-space sampling, and the system loses the information about which control decision caused the defect.

The loop exploits a **generation-evaluation asymmetry**: on many tasks, directly producing an excellent artifact is unstable, while recognizing defects, naming clichés, and checking constraint violations is substantially easier. The asymmetry has a scope condition, however. It holds when defects are localizable and criteria can be made explicit. Under strong specification mismatch, the evaluator inherits the same specification gap as the generator, and the rubric itself becomes a candidate object requiring contrastive validation (Sections 6.8.6 and 8.2). With that caveat, the method rewrites one autoregressive-mediocre task as a chain of autoregressive-extraordinary subtasks: enumerate requirements, render under constraints, detect violations, repair the control state.

#### 6.8.3 Search in Control Space Rather Than Brute-Force Search in Output Space

**Primary target:** all five mismatches; the most general pattern.

For most high-mismatch tasks, the first step is to cut the default path from raw semantics to direct output, and to construct a control space that is easier to search: a state matrix, scoring rubric, candidate framing set, dependency graph, query plan, failure-mode list, role configuration, or decision table.

The search then proceeds in the control space — perturbing, expanding, pruning, and comparing control objects — rather than by repeatedly resampling final answers. Candidate control objects are restored to output space for validation. When validation fails, the system returns to the control space and continues searching there, instead of patching the final text.

The key is not that this adds steps. It is that it **changes the search terrain**. In raw output space, the neighborhood structure is token adjacency, and fluency between adjacent tokens is often unrelated to task value. A control space defines neighborhoods over the variables, structures, and constraints that actually carry value, so that local moves in the search correspond to meaningful moves in utility.

Two operating rules govern this method. First, a cost criterion: by the heuristic of Section 3.4, a single dominant mismatch is usually addressable with stronger prompting, retrieval, or reranking; control-space search becomes a strong candidate at two or more substantial mismatches. Second, composition validation is mandatory (Section 6.6.3): the renderer can silently ignore the control object, so validation must check that the rendered output preserves the control state, not merely that the output looks good. When the control state is correct and preserved, the final rendering step is a semantic-decompression task and frequently falls in the extraordinary regime.

#### 6.8.4 Hierarchical Control Spaces to Bound Search Complexity

**Primary target:** budgeted control-capacity collapse; combinatorial explosion in the control layer itself.

A control space is not better simply because it is larger. If all variables, styles, constraints, branches, and exceptions are loaded into one flat search space, the search cost may be no lower than blind repeated sampling in output space, and may be worse. The control layer then becomes a new source of disorder rather than a remedy.

Complex tasks therefore favor **hierarchical control spaces**. A coarse layer first fixes direction, principal structure, and binding global constraints; subsequent layers search local strategies, substructures, and concrete realizations; rendering happens last. Each layer can carry its own validators, rollback points, and promotion conditions.

The value of the hierarchy is that it cuts the combinatorial explosion: rather than attempting to find a complete answer in one pass, the system first locks a high-value region and then refines within it. Three design rules sharpen the method.

First, **layer boundaries should follow the task's mismatch structure**, not implementation convenience. Aggregation mismatch should be absorbed at the coarse layer: once global structure and nonlocal constraints are fixed there, the lower-layer tasks become genuinely local, low-mismatch subtasks. A hierarchy whose top layer does not capture the global coupling merely postpones the aggregation failure.

Second, budget allocation across layers should be explicit, and the coarse layer deserves a disproportionate share. Errors at the top are the most expensive: a wrong construal or wrong principal structure converts all lower-layer effort into longer rationalization of the wrong abstraction (Section 4.8).

Third, the characteristic failure mode is **premature coarse commitment**. The mitigation is an explicit backtrack trigger: when lower-layer search repeatedly fails validation within a fixed budget, this should be interpreted as evidence against the upper-layer decision, not as a local difficulty, and should force re-entry into the coarse search. Without such triggers, hierarchy hardens early errors instead of containing complexity.

In the language of Section 3.5.7, hierarchical control raises the system's effective control capacity $C_{\mathrm{eff}}$ under a fixed model and budget. It is therefore the natural intervention when a task's total mismatch load approaches the collapse threshold.

#### 6.8.5 State Enumeration and Conditional Rendering

**Primary target:** state mismatch.

When the correct ranking of outputs depends on latent, partially observed, or changing state, a single answer rendered under an implicit state guess is fragile. The method, elevated from Section 6.3.3, is to make state a first-class control object: enumerate the plausible latent states; identify which state variables would flip the ranking of actions; construct a scenario matrix; and render a **state-conditioned policy** — if-then recommendations with explicit conditions of application and revocation triggers — rather than a single unconditional answer. Where a small diagnostic question can collapse the state uncertainty cheaply, request it before rendering.

The component operations — state listing, scenario-matrix construction, conditional phrasing — are themselves high-support, locally aligned generation tasks. The method thus converts a state-mismatched final answer into a sequence of well-aligned subtasks plus an explicit conditionality structure that downstream governance can maintain, weaken, or revoke as the state becomes observable.

#### 6.8.6 Contrastive Value Elicitation and Rubric Refinement

**Primary target:** specification mismatch, including emergent specification.

When the true objective is tacit or only becomes identifiable through inspection, the method is to make the value function itself the object of search. Generate **deliberately contrasting candidates** — alternatives that differ along hypothesized value dimensions, not near-duplicates — and elicit pairwise preferences over them. Ask explicitly what would look good under the current proxy but fail under the true objective. Separate style criteria from outcome criteria. Record the refined proxy $\tilde{U}_t$ as explicit, revisable artifacts: rubrics, disqualifying failure modes, and preference GKOs.

This converts a target the principal cannot articulate in advance into a sequence of operations the principal can perform reliably: choosing between concrete alternatives and naming the reason. The hazard is the false-rubric failure of Section 6.6.2: a plausible but wrong rubric increases confidence while reducing true value, and an evaluator built on it inherits the error. Rubrics produced by this method therefore carry evidence strength and revocation triggers like any other governed object, and should be re-tested whenever downstream evaluations and principal reactions diverge.

#### 6.8.7 Method-Mismatch Mapping and Composition

The six methods align with the diagnostic theory as follows.

| Method | Primary mismatch countered | Typical control objects | Characteristic failure if misapplied |
|---|---|---|---|
| 6.8.1 Decorrelated sampling and recombination | Support | Fragments, recombination candidates, induced invariants | Selection noise promoted as knowledge; correlated pool with no tail content |
| 6.8.2 Control-space-first generation | Aggregation, specification | Beats, constraints, rubrics, acceptance criteria | Evaluator inherits the specification gap; rubric mistaken for the true objective |
| 6.8.3 Control-space search | All five (general) | State matrices, dependency graphs, frames, decision tables | Overhead on low-mismatch tasks; renderer ignores the control state |
| 6.8.4 Hierarchical control | Capacity collapse (composite) | Layered constraints, rollback points, backtrack triggers | Premature coarse commitment hardened by the hierarchy |
| 6.8.5 State enumeration and conditional rendering | State | Scenario matrices, if-then policies, revocation triggers | Spurious state proliferation; conditionality dropped at rendering |
| 6.8.6 Contrastive value elicitation | Specification | Contrast pairs, refined rubrics, disqualifying failure modes | False rubrics raising confidence while lowering value |

Real tasks compose these methods. A long-form strategic document may use control-space-first generation (6.8.2) inside a two-layer hierarchy (6.8.4), refine its rubric through contrastive elicitation (6.8.6), render conditionally over unresolved client states (6.8.5), and invoke sampling-and-recombination (6.8.1) at the points where the draft stalls in a recognizable basin. The composition rule is the persistence requirement of Section 6.4: each application of a method must leave behind a validated, revocable artifact that changes what the next step is solving. Methods that produce only transient text are output-space sampling in disguise.

---

## 7. Knowledge Governance

### 7.1 Design Principle

The five-mismatch view, the local-alignment view, and the extraordinary-regime view together suggest a simple but important architectural shift:

> Do not search only over candidate final answers. Search also over the intermediate objects that can convert partial local alignment into more stable global alignment.

We use **Knowledge Governance** to mean the explicit acquisition, validation, deployment, weakening, and revocation of task-specific control knowledge during inference. The framework separates the layer that discovers and manages such knowledge from the layer that renders fluent final outputs.

A crucial clarification is that the framework does not assume a single universal internal representation. What is universal is the governance cycle. The internal control space itself may differ radically across tasks: code modules and dataflow boundaries in one domain, story beats and payoff constraints in another, emotional states and policy transitions in another, physical affordances and role bindings in another, source-prior audits and evaluation metrics in another, regime indicators and risk filters in a fifth.

Knowledge Governance should not be interpreted as a rejection of autoregressive generation. Its purpose is to use autoregressive generation where it is strong. In locally aligned tasks, this means keeping the operations that the model already performs well while governing the parts where local value fails to compose. It converts difficult tasks into intermediate operations such as compression, taxonomy generation, failure-mode enumeration, rubric drafting, and semantic decompression. The final renderer remains an autoregressive model; the difference is that it renders from governed control knowledge rather than from an underspecified prompt.

### 7.2 Decoupled Control Space

A **Decoupled Control Space** is an external representation layer whose elements are not required to be fluent final answers. Its purpose is to preserve task-relevant units and relations while discarding much of the discourse continuity of complete outputs. The space is therefore decoupled from fluent surface form, not semantically empty.

Depending on the task, its units may include:

- narrative beats, commitments, promise-payoff pairs, and scene functions;
- dialogue acts, emotional cues, policy constraints, and escalation states;
- physical objects, affordances, role bindings, success conditions, and hidden assumptions;
- market signals, regime indicators, and risk filters;
- code blocks, temporal assumptions, dependency constraints, and validation steps;
- source frames, counter-narratives, evaluation metrics, and causal mechanisms;
- failure cases, boundary violations, and synthetic counterexamples.

We use three core operators.

**Fragment** decomposes a coherent artifact into minimal functional units.

**Perturb** introduces controlled disruption: reordering fragments, removing a dependency, negating a condition, injecting a violation, altering a latent state, changing a source frame, or constructing a counterfactual scene.

**Reconcile** asks what must be true for the perturbed artifact to become valid again. The result is not a finished answer, but a candidate rule, boundary condition, dependency hypothesis, construal correction, or evaluation principle.

The aim of perturbation is not random corruption. It is to make hidden dependencies visible. If deleting a step leaves performance unchanged, the step may be ornamental. If deleting it causes a failure, the missing dependency becomes legible. If changing a physical assumption flips the answer, the relevant state variable becomes visible. If switching source frame changes the evaluation, the prior may be governing the answer more than evidence. In this way, perturbation helps convert implicit structure into explicit control hypotheses.

### 7.3 Construal Before Rendering

For noisy real-world tasks, the control space may need to represent not only solution steps but also the task model itself. Before rendering an answer, the controller should ask:

- What is the real success condition?
- Which object or agent carries the target state change?
- Which stated details are constraints, and which are distractors?
- What hidden physical, social, temporal, institutional, or source-prior assumptions are being used?
- What alternative abstraction would make the problem trivial or reverse the conclusion?
- Which evaluation metric is being optimized, and is it the right one?

This construal-first step is not required for all tasks. It is especially important when the model performs well on the clean abstract version of a problem but fails on the noisy scene version. In such cases, the bottleneck is not abstract reasoning alone; it is the construction of the correct abstraction.

### 7.4 Governed Knowledge Objects

To make discovered knowledge actionable, we store it as **Governed Knowledge Objects (GKOs)** rather than leaving it implicit in free-form text.

A generic schema is:

```json
{
  "id": "gko-uuid",
  "condition": "context predicate under which the rule applies",
  "assertion": "constraint, preference, heuristic, role binding, state condition, source-frame correction, or diagnostic test",
  "strength": "sample-grounded | objective-grounded | statistics-grounded | adversarial",
  "priority": 0.0,
  "lifespan": "episodic | session | windowed | global",
  "revocation_trigger": "condition for weakening or removal",
  "evidence": "summary of supporting observations or tests",
  "source": "artifact, validation pass, induction step, construal probe, or source-prior audit"
}
```

A GKO may function as:

- a **hard constraint**: must hold;
- a **soft preference**: prefer when possible;
- a **routing rule**: switch strategy when this condition is met;
- a **diagnostic test**: reject a candidate if this boundary condition fails;
- a **construal rule**: identify the relevant goal, carrier, state variable, or abstraction;
- a **source-prior correction**: separate dominant narrative from evidence and evaluation metric;
- a **transformation rule**: convert the current task into an autoregressive-extraordinary subtask.

The key design principle is that control knowledge is explicit, conditional, persistent, and revisable. It is no longer buried inside one particular output. This stands in contrast to what we call **soft experience**: plausible-sounding, fluent statements that appear useful but fail to provide reliable behavioral constraints when tested.

---

## 8. A Task-Agnostic Governance Loop

The implementation details of Knowledge Governance are task-specific. The commonality lies not in one universal constructor for control space, but in a reusable loop.

### Algorithm 2. Task-Agnostic Governance Loop

**Input:** task input $x$; initial artifact pool $A_0$; task-specific control-space constructor $C$; renderer $R$; evaluator $E$; validator $V$; maximum iterations $T$; stop criterion `Stop`

**Output:** best rendered output $\hat{y}$; active governed knowledge set $K$

```text
K ← ∅                                  # active GKO set
A ← A0                                 # candidate traces, failures, exemplars, retrieved cases
best ← ⊥

for t = 1 ... T do
    Z_t ← C(x, A, K)                   # construct task-specific control space
                                       # optionally includes scene-to-model construal
                                       # and local-alignment-to-global-alignment transformation

    H_t ← Expand(Z_t, A, K)            # search in control space
                                       # fragment / pair / recombine / perturb / reconcile
                                       # generate rubrics, states, edge cases, outlines, queries
                                       # or directly edit task-specific control variables

    G_t ← Validate(H_t, A, x, V)       # reject, demote, localize, or promote hypotheses

    K ← UpdateGovernance(K, G_t)       # add, weaken, revoke, reprioritize GKOs

    y_t ← R(x, K)                      # render back into fluent output space
                                       # often a semantic-decompression task

    eval_t, critique_t, trace_t ← E(y_t, x, K)

    A ← UpdateArtifacts(A, y_t, critique_t, trace_t)

    K ← MonitorAndRevise(K, eval_t, critique_t, trace_t)

    best ← SelectBest(best, y_t, eval_t)

    if Stop(best, K, eval_t, critique_t) then
        break
    end if
end for

return best, K
```

Two points are worth emphasizing.

First, **$C$ is task-specific**. In a sample-rich code task, it may segment traces into functional modules and create recombination candidates. In story generation, it may expose beats, arcs, reveals, and pacing controls. In noisy common-sense reasoning, it may extract goals, role bindings, physical affordances, and hidden assumptions. In institutional or historical evaluation, it may separate source priors, evidence classes, causal mechanisms, and evaluation metrics. There is no claim that a single universal representation fits all tasks.

Second, **Expand is also task-specific**. Some tasks require fragment-pair-recombine-reconcile. Others require direct edits to a hand-designed control state. Others require counterfactual scene perturbation, source-frame switching, or state-matrix construction. What is common is that the search happens in a representation that is better aligned with task value than undifferentiated final-output text.

### 8.1 Validation Hierarchy

Not all evidence justifies the same confidence. We therefore distinguish four evidence regimes.

1. **Sample-grounded.** A candidate rule is supported by contrastive or paired examples, such as preferred vs. rejected outputs or successful vs. failed dialogues.
2. **Objective-grounded.** A candidate rule improves a measurable downstream objective, such as task completion, leakage reduction, or out-of-sample performance.
3. **Statistics-grounded.** A candidate rule induces a desirable distributional shift when no single task objective is available, such as more diverse scenarios, fewer contradictions, or reduced repetition.
4. **Adversarial.** A candidate rule survives targeted attempts to break it, but lacks stronger paired or objective support.

We treat these as confidence levels, not as claims of truth. A high-strength GKO can still be revised if later evidence overturns it.

### 8.2 Reconciliation Noise and the Burden of Proof

A practical risk is that Reconcile may hallucinate plausible-sounding but false dependencies. This is not a peripheral issue; it is a central reason why the framework must separate expansion from validation.

In our view, Reconciliation is a generator of candidate hypotheses, not a guarantor of truth. Its job is to widen the hypothesis space. The burden of proof lies elsewhere: in validation, adversarial checking, downstream evidence, external tools, and explicit revocation. We do not ask the LLM to certify its own explanations. We ask it to propose hypotheses that must survive external pressure.

### 8.3 Soft Experience, Local Knowledge, and Hard Knowledge

The framework is explicitly designed to avoid the accumulation of **soft experience**: vague, agreeable, or stylistically appealing statements that sound useful but do not constrain behavior in a reliable way.

A useful practical distinction is:

- **Rejected claims:** contradicted by evidence or invalidated by the sample pool;
- **Local knowledge:** claims that conflict globally but reliably improve a narrow subproblem under a restricted condition;
- **Hard knowledge:** validated claims that remain non-conflicting across the relevant sample pool and survive stronger validation.

This distinction is especially useful in sample-derived control spaces, where many candidate claims are partly right, locally useful, or merely eloquent.

### 8.4 Conflict Resolution and Deadlock

As the GKO set grows, conflicts are inevitable. Two rules may apply in the same context while recommending incompatible actions. We resolve such conflicts using:

- evidentiary strength;
- priority;
- scope specificity;
- recency;
- measured objective impact.

A second failure mode is **constraint deadlock**: the active control set becomes so restrictive that the renderer cannot produce a valid or useful output. In that case, the system should not silently ignore constraints. It should surface the conflict, weaken lower-priority rules, transform the task differently, or request a decision if human intervention is available.

---

## 9. Why a Decoupled Control Space Can Help

The key claim of this paper is not that output-space search is ineffective. On many tasks, it works well and may be extraordinary. The narrower claim is this: **when local plausibility is a weak proxy for task value, searching only over fluent candidates becomes a representation bottleneck**.

### 9.1 Under Local Alignment

Local alignment is the most common reason a decoupled control space helps without replacing autoregressive generation. The model can already produce valuable fragments, but the relation among those fragments is under-governed. A control space can preserve the useful fragments while making their conditions, dependencies, and composition rules explicit.

For example, a model may draft a strong outline but miss the decisive evaluation metric; generate useful code modules but fail to preserve temporal ordering; or produce empathetic dialogue turns without tracking escalation state. In each case, the local operation is valuable. The problem is that local value is not yet organized into global value. A decoupled control space gives the system a place to represent what must be preserved, what must be checked, and when a locally good operation should be overridden.

### 9.2 Under Aggregation Mismatch

Fluent outputs entangle content, style, local coherence, and latent constraints into a single object. A rewrite that improves one part of the surface can silently break a long-range dependency elsewhere. By moving to fragmented units and explicit relations, the controller can represent nonlocal dependencies directly rather than hoping they survive repeated rewriting.

The mediocrity-to-extraordinary transformation is to make global structure local. Once the global structure is represented as a checklist, graph, beat map, dependency table, or invariant set, final rendering becomes a semantic-decompression task - often an autoregressive-extraordinary operation.

Examples include story payoff, cross-module code constraints, multi-step customer-service escalation, and physical reasoning tasks where one early abstraction choice determines all later reasoning.

### 9.3 Under Support Mismatch

If high-value solutions are tail events, ordinary autoregressive continuation will often underexpose them. Perturbation can help by making rare dependencies visible. The point is not that perturbation magically creates knowledge from noise. The point is that controlled disruption can reveal which dependency was previously hidden inside a successful artifact or absent from a failed one.

The transformation is to pull tail structures into context. Once an unlikely frame, rare invariant, or non-obvious failure mode is made explicit, the model can often elaborate it fluently. The final operation becomes expansion from an explicit seed rather than spontaneous discovery from a low-support region.

### 9.4 Under State Mismatch

When utility depends on hidden or changing state, the system needs explicit state predicates. A decoupled control space can represent candidate states, conditions of application, and revocation triggers. A GKO can be correct under one state and wrong under another. Treating this conditionality as first-class prevents the system from promoting a locally useful rule into a global but false principle.

The transformation is to replace a single hidden-state answer with a state-conditioned policy. Scenario matrices, if-then rules, and revocation triggers are natural-language structures that LLMs can often generate and maintain well.

### 9.5 Under Specification Mismatch

When the available proxy differs from true utility, optimizing the proxy more strongly can produce polished mediocrity. A decoupled control layer can help by making the proxy explicit, collecting contrastive evidence, refining rubrics, and representing newly discovered preferences as revisable GKOs.

The transformation is to turn tacit value into explicit evaluation artifacts. Rubric generation, contrastive comparison, failure-mode enumeration, and checklist verification are frequently autoregressive-extraordinary operations. The danger is false rubrics; therefore validation and revocation are essential.

### 9.6 Under Noisy-Context Construal Failure

In noisy natural scenes, the model may fail before reasoning begins. It may choose the wrong success condition, bind the goal to the wrong object, overuse irrelevant numbers, apply a familiar but inappropriate template, or ignore a hidden physical affordance.

A decoupled control space can make this front-end construal explicit. Instead of immediately answering, the system can represent candidate construals:

- Is the goal to move the person, the car, the patient, the document, or the object whose state must change?
- Is the numeric detail a true constraint or a distractor?
- Is the problem two-dimensional, three-dimensional, temporal, institutional, or social?
- Which assumptions would flip the answer?
- Which source prior or conventional template is being imported?

This does not eliminate the need for world knowledge. It makes the point of failure inspectable and governable.

### 9.7 Under Corpus-Prior Dominance

When the model's default narrative is shaped by corpus frequency or source authority, direct generation can substitute mainstream salience for task-relevant evidence. A control space can force the system to separate:

- dominant narrative;
- counter-narrative;
- evidence classes;
- causal mechanisms;
- evaluation metrics;
- counterfactual alternatives;
- local costs and system-level effects.

This transformation often turns a biased evaluation task into a structured comparison task. Comparative matrices, source audits, and causal-mechanism decomposition are often easier for LLMs than spontaneously escaping a default narrative.

### 9.8 Relation to Adjacent Methods

Knowledge Governance is related to but distinct from several adjacent methods.

- **Prompt engineering** changes the instruction surface; governance stores validated control knowledge across candidate generations.
- **Reranking** selects among finished outputs; governance can modify the search space before rendering.
- **Retrieval** imports external content; governance can induce control knowledge from task-specific failures and perturbations.
- **Process supervision** scores intermediate steps; governance additionally manages the lifecycle of explicit rules, conditions, and revocation triggers.
- **Tool use** expands capabilities; governance decides what task-specific knowledge should persist and how it should constrain future tool use or rendering.
- **Ordinary autoregressive generation** is retained as the renderer and as a generator of intermediate artifacts; governance redirects it toward positive-alignment subtasks.

---

## 10. Instantiation Patterns

The following examples illustrate how the framework can be instantiated. They are not intended as exhaustive case studies. Their purpose is to show how the same governance loop can operate over different task-specific control spaces and how mediocrity-to-extraordinary transformation appears in practice.

### 10.1 Narrative Generation

**Mismatch profile:** high aggregation mismatch, moderate support mismatch, high specification mismatch.

Narrative quality depends on long-range structure, promise-payoff relations, character commitments, pacing, and emotional tension. Direct generation often produces locally strong prose but weak global structure.

A task-specific story control space may include plot beats, promise-payoff pairs, character commitments, reversals, scene functions, and genre-specific constraints. The controller renders a full story from this control state, uses critique to diagnose missing payoff, pacing drift, cliché overuse, or character inconsistency, maps those defects back into the control space, and iterates.

Candidate governed rules in this setting include:

- a major reversal should be preceded by legible pressure;
- a planted object should either pay off or be deliberately subverted;
- a character flaw should be tested before the climax resolves it;
- emotional escalation should be coupled to irreversible narrative commitment rather than only to prose intensity.

The mediocrity-to-extraordinary transformation is clear: instead of asking the model to directly generate a globally coherent story, the system asks it to generate and refine beats, commitments, and payoffs, then uses semantic decompression to render prose from a controlled structure.

### 10.2 Noisy-Context Reasoning

**Mismatch profile:** high specification or role-binding mismatch, moderate support mismatch, and state mismatch only when the relevant physical, temporal, or institutional state is not identifiable from observations.

Noisy-context reasoning tasks require the system to construct the right abstraction from a natural scene. The hard part is often not solving the clean abstract problem but deciding which problem the scene actually instantiates. In this stricter taxonomy, car-wash-style failures are specification/role-binding failures; hidden-state failures are reserved for cases where the relevant state is genuinely latent, dynamic, or unmeasurable from the observation stream.

A control space for this setting may include:

- candidate success conditions;
- goal-carrier bindings;
- relevant and irrelevant variables;
- hidden physical or social assumptions;
- alternative abstraction templates;
- counterfactual variants that flip the answer.

For the car-wash case, a construal GKO might be:

```json
{
  "condition": "the task is about receiving a service applied to an object",
  "assertion": "identify the object whose state must change; movement of the person alone may not satisfy the goal",
  "strength": "adversarial",
  "priority": 0.8,
  "lifespan": "session",
  "revocation_trigger": "the service can be completed without moving the object",
  "evidence": "walking to a car wash does not bring the car to be washed"
}
```

For the doorway-and-pole case, a construal GKO might be:

```json
{
  "condition": "a thin elongated object must pass through an opening",
  "assertion": "do not reduce the problem to fitting the object's length inside the opening plane; consider orientation, cross-section, surrounding space, and path through the opening",
  "strength": "adversarial",
  "priority": 0.9,
  "lifespan": "session",
  "revocation_trigger": "the object is constrained to remain in the plane of the opening or surrounding space is insufficient",
  "evidence": "a long thin rod can pass lengthwise through a doorway if the cross-section fits and there is enough space"
}
```

This example highlights why noisy-context construal failure should not be reduced to a single primitive mismatch. Some failures concern success conditions and therefore specification; others concern physical affordances, hidden assumptions, or abstraction templates; only the cases where the relevant world state is not identifiable from observations instantiate state mismatch in the strict sense.

### 10.3 Customer-Service Dialogue

**Mismatch profile:** high aggregation mismatch, high specification mismatch, moderate state mismatch.

Customer-service dialogue requires simultaneous optimization of task resolution, emotional regulation, policy compliance, and conversational efficiency. These objectives are coupled and often partially tacit.

A decoupled control space may include dialogue acts, emotional cues, escalation states, policy rules, and transition patterns. Perturbation removes acknowledgments, swaps apology and troubleshooting order, or injects unsupported assumptions. Reconciliation yields candidate state-conditional rules such as:

- when frustration is high and diagnosis is incomplete, acknowledgment should precede solutioning;
- once a scripted suggestion has already been rejected, repetition should trigger reframing or escalation;
- policy clarification should be explicit before requesting additional burdens from the user.

The final response is then a register-transfer and semantic-decompression task: render the selected dialogue act in the right tone while respecting the governed state conditions. This uses autoregressive strength under explicit control.

### 10.4 Market Adaptation

**Mismatch profile:** high state mismatch, moderate specification mismatch.

Recommendation and allocation tasks are difficult because utility changes with the environment. A recommendation policy that is appropriate under one regime may become stale under another. Static priors therefore make imperfect guides.

A decoupled control space for this setting may include signal families, regime indicators, confirmation rules, risk filters, and horizon assumptions. Perturbation simulates regime changes, removes filters, or alters volatility assumptions. Reconciliation can produce conditional rules such as:

- momentum signals should be downweighted above a volatility threshold;
- liquidity-sensitive constraints should dominate when market stress is rising;
- previously profitable rules should expire unless revalidated under the current regime.

The important architectural feature here is lifespan. Market-related GKOs should generally be windowed and revocable. Knowledge Governance is useful in this setting because it treats stale control knowledge as a first-class failure mode.

### 10.5 Leakage-Sensitive Code Synthesis and Factor-Scheduling Frameworks

**Mismatch profile:** high support mismatch, high aggregation mismatch, moderate specification mismatch.

High-integrity code synthesis tasks are structurally brittle. Apparent performance gains may be artifacts of leakage, timestamp mistakes, hidden future information, or invalid dependency ordering. Many locally plausible code revisions are therefore structurally wrong.

In one pilot-informed pattern, the artifact pool is built from iterative traces of the form

\[
(\text{initial code}, \text{prompt}) \rightarrow \text{plan} \rightarrow \text{attack} \rightarrow \text{refine} \rightarrow \text{code},
\]

repeated for multiple rounds. From this pool, the controller:

1. segments each sample into functional modules, where a module may span several classes or reduce to a single function depending on the logical unit of work;
2. pairs and recombines modules across samples to create a new sample space that is no longer anchored to the original fluent artifact boundaries;
3. asks the model to induce candidate principles explaining why some combinations are valid and others fail;
4. validates those principles against leakage checks, temporal constraints, dependency graphs, and downstream metrics;
5. stores surviving constraints as GKOs.

Candidate governed rules in this setting include:

- any feature depending on future timestamps must be rejected unless explicitly lagged;
- validation splits must preserve temporal order;
- module recombination is invalid when a downstream component assumes a preprocessing invariant not supplied by the upstream component;
- high metric improvement should trigger a leakage audit before promotion.

The purpose is not to let the model merely write more code. It is to induce and enforce structural constraints that ordinary output-space refinement may repeatedly violate.

### 10.6 Historical, Institutional, and Development-Policy Evaluation

**Mismatch profile:** moderate to high support mismatch, high specification mismatch, often high aggregation mismatch.

Historical and institutional evaluation is vulnerable to corpus-prior dominance. The model may reproduce a culturally dominant evaluation frame even when the task requires causal explanation, counterfactual comparison, or system-level accounting.

A control space for this setting may include:

- dominant narrative;
- minority or counter-narrative;
- evidence base;
- causal mechanism;
- local metric;
- system-level metric;
- counterfactual alternative;
- temporal or institutional state.

Candidate governed rules include:

```json
{
  "condition": "evaluation of public investment or state-led industrial policy",
  "assertion": "separate direct financial return from system-level externalities, capability formation, industrial diffusion, regional coordination, pollution reduction, and counterfactual alternatives",
  "strength": "adversarial",
  "priority": 0.85,
  "lifespan": "session",
  "revocation_trigger": "the task explicitly restricts evaluation to project-level financial ROI",
  "evidence": "project-level ROI may understate system-level value"
}
```

```json
{
  "condition": "evaluation of a culturally heroized historical figure",
  "assertion": "separate literary reception, cultural image, strategic judgment, organizational leadership, political decision-making, and ethical evaluation",
  "strength": "adversarial",
  "priority": 0.8,
  "lifespan": "session",
  "revocation_trigger": "the task asks only for reception history or popular image",
  "evidence": "heroic cultural salience can hide leadership or institutional failures"
}
```

The mediocrity-to-extraordinary transformation is to convert a default evaluative essay into a structured comparison of narratives, metrics, mechanisms, and counterfactuals. The model is often much stronger at filling such a matrix than at spontaneously escaping a default corpus prior.

### 10.7 Local-Alignment-Dominant Tasks

**Mismatch profile:** moderate aggregation or specification mismatch, with strong local positive alignment.

Many everyday tasks fall into this category. They are not hard because every local operation is difficult. They are hard because the model must know which local operations to trust, when to stop, and how to compose them.

Examples include:

- drafting a strategic memo from messy context;
- revising a legal or reputationally sensitive message;
- producing a product recommendation under uncertain user priorities;
- generating an implementation plan with hidden organizational constraints;
- summarizing a long document for a specific decision-maker;
- writing an expert-facing explanation where tone is easy but judgment is tacit.

A typical governance pattern is:

1. let the model perform aligned local operations, such as compression, outlining, style transfer, and candidate enumeration;
2. extract the uncertain global variables, such as goal, state, risk, evaluation metric, or nonlocal dependency;
3. store these variables as conditional constraints or GKOs;
4. render the final artifact from the locally generated material plus the governed constraints.

The key point is that local alignment is not a defect. It is the practical substrate of useful LLM work. The defect appears only when the system treats local alignment as if it were already global alignment.

### 10.8 Extraordinary-Native Tasks

Some tasks are low-mismatch from the start and may not need a governance layer. Examples include:

- context compression;
- semantic decompression from a good outline;
- register transfer;
- surface polish;
- simple structured transformation;
- standard documentation;
- first-pass taxonomy generation;
- first-pass edge-case enumeration;
- query formulation;
- boilerplate scaffold generation.

For these tasks, the best system design may be lightweight: clear prompt, adequate context, optional retrieval, and minimal validation. Governance becomes valuable only when the task shifts from fluent transformation to rare structure, hidden state, high-stakes correctness, or tacit evaluation.

---

## 11. Discussion and Limitations

### 11.1 Framework Scope

This paper advances a framework and a set of hypotheses. It does not claim a universal theorem about LLMs, nor does it claim that Knowledge Governance will outperform simpler methods on every task. Its main purpose is to identify when ordinary output-space refinement is likely to plateau, when autoregressive generation is likely to excel, when a task is only locally aligned, and how tasks can be transformed from partial alignment into more stable global alignment.

### 11.2 Taxonomy Discipline

A major risk for any diagnostic taxonomy is category inflation. If every recurring surface failure becomes a new primitive mismatch, the framework loses explanatory power. We therefore distinguish primitive mismatches from derivative and compound phenomena.

The practical rule is strict: a new primitive class should be added only when it cannot be reduced to the five existing classes or their interactions, adds predictive power, and requires a distinct intervention. Under this standard, order-sensitive trajectories, emergent specification, noisy-context construal failure, corpus-prior dominance, and control-capacity collapse are important but not primitive. They should be analyzed as recurring patterns that decompose into the five mismatch axes plus representation, budget, and control-policy effects.

### 11.3 Local Alignment and Extraordinary Are Not Guarantees

Autoregressive local alignment and autoregressive extraordinary are regimes, not promises. A task may begin as extraordinary and become locally aligned or mediocre when hidden constraints, factual uncertainty, high stakes, or nonlocal coupling enter. For example, generating a code scaffold may be extraordinary; adapting it to a real architecture may be locally aligned; ensuring that it is secure, leakage-free, scalable, and temporally valid may not be. A comparison matrix may be extraordinary as a structuring device, locally aligned as a reasoning aid, and still require verification for factual cells.

These concepts should therefore be used diagnostically, not as a blanket endorsement of direct generation.

### 11.4 Training Reduces Mismatch but Does Not Close It

Alignment training should be understood as mismatch reduction rather than mismatch elimination. It can make many valuable behaviors high-probability under the model policy, and inference-time thinking can make additional valuable structures reachable through intermediate reasoning. This is a real capability gain, not merely a surface change. A sufficiently aligned and reasoning-capable model can move many tasks from LLM mediocrity into local alignment, and some from local alignment into extraordinary.

But open-ended task value is not a closed table that can be fully precompiled into model weights. When utility depends on hidden state, rare structure, nonlocal composition, changing environments, or emergent specification, the aligned policy may still diverge from true task value. The failure is not that the model is only following raw word frequency. The failure is that the proxy values learned during training and exposed during thinking do not fully determine the real value function of the current task.

This distinction motivates Knowledge Governance. Governance is not a denial of alignment training or thinking. It is a response to the residual gap that remains after those mechanisms have already expanded local alignment. Its role is to externalize task-control knowledge when local alignment cannot be trusted to compose into global success.

### 11.5 Decomposition Quality and False Invariants

The quality of the decoupled control space depends on how artifacts are fragmented and perturbed. Poor decomposition may generate noise rather than insight. Weak validation may promote false invariants. This is one reason revocation is a first-class mechanism rather than a patch.

False invariants are especially dangerous because they can make the system more confident while reducing true performance. A governance layer therefore needs adversarial testing, conflict detection, and explicit demotion mechanisms.

### 11.6 Outcome Feedback vs. Structural Feedback

Outcome-level feedback can be useful for eliminating clearly bad candidates. However, in some tasks it may saturate: it tells the system that a candidate failed, but not which rare structural dependency made a better candidate succeed. Knowledge Governance is most justified when this gap between result signal and structure signal becomes the dominant bottleneck.

Mediocrity-to-Extraordinary transformation helps by converting vague outcome signals into explicit intermediate objects: failure modes, edge cases, hypotheses, rubrics, and constraints. These objects can then be tested.

### 11.7 Compute and Latency

Governance adds overhead. Fragmentation, perturbation, validation, memory management, and conflict resolution all consume compute and latency. When task value is already globally aligned with local likelihood, the extra machinery may not be worth it.

The framework should therefore be used selectively. It is most appropriate when the cost of mediocre outputs is high, when recurring failures can be converted into reusable control knowledge, and when the task is locally aligned but not globally stable. When the task is autoregressive-extraordinary, simpler methods may dominate.

### 11.8 Floor vs. Ceiling

Knowledge Governance can improve the ceiling of control quality, but the floor still depends on the base model and available tools. It does not replace the need for a competent renderer, reliable evaluators, domain-specific diagnostics, retrieval systems, formal validators, or human expertise.

Similarly, adaptive compute can raise the threshold at which complex-task collapse occurs, but longer thinking alone is not enough if the representation is wrong. More budget without better control may produce longer mediocrity.

### 11.9 When a Decoupled Control Space Is Unnecessary

Not all tasks need this architecture. Routine translation, straightforward summarization, many factual QA settings with strong retrieval, clean symbolic tasks with reliable validators, surface polish, register transfer, standard documentation, and first-pass ideation may have low mismatch profiles. In such cases, ordinary prompting, retrieval, limited search, or tool use may be sufficient.

This is not a weakness of the framework. It is a consequence of the central theory. When the task is already in an autoregressive-extraordinary regime, the system should exploit that regime rather than impose unnecessary control machinery. When the task is locally aligned, governance should be selective rather than maximal: govern the unstable boundary, not every token.

### 11.10 Empirical Work Still Needed

A full empirical study should compare Knowledge Governance and Mediocrity-to-Extraordinary Transformation against strong output-space baselines under matched compute budgets. Important ablations include:

- direct generation vs. local-alignment-preserving reparameterization;
- output-space search vs. control-space search at local-alignment boundaries;
- rubric generation only vs. full GKO lifecycle;
- state enumeration only vs. state-conditioned rendering;
- edge-case generation only vs. edge-case validation;
- governance with and without revocation;
- task-specific control-space gains vs. task-agnostic governance-loop gains.

For noisy-context reasoning, empirical work should also measure the construal gap: performance difference between noisy natural scene formulations and clean abstract formulations. This would separate failures of problem solving from failures of problem construction.

For autoregressive local alignment, empirical work should measure where local value stops predicting global value: when clear prose masks wrong construal, when candidate lists fail to surface the decisive invariant, when generated rubrics correlate only weakly with expert judgment, and when state enumeration improves conditional correctness. For autoregressive extraordinary, empirical work should identify positive-alignment profiles: when local edits improve global value, when semantic decompression preserves control state, when query formulation improves retrieval, and when generated rubrics actually correlate with expert judgment.

---

## 12. Conclusion

As LLM systems increasingly rely on inference-time compute, it becomes important to ask not only how to generate more candidates, but also what kind of task the model is being asked to perform. Some tasks induce **LLM mediocrity**: a high-probability, low-value regime in which fluent, locally coherent, incrementally improved outputs remain far from the near-optimal set. We argued that susceptibility to this failure mode can often be understood through five primitive sources of mismatch: aggregation, support, state, specification, and overfitting mismatch.

A central revision of this version is terminological. **Autoregressive mediocrity** should not name the whole phenomenon. It is the narrower subcase created by aggregation mismatch: locally plausible token-level continuation fails to compose into global task value. LLM mediocrity is broader. It also includes state mismatch, where observations are not states and hidden Markov or partially observable variables cannot be identified from text alone; specification mismatch, where the prompt, training-data norm, evaluator, or proxy reward fails to define what counts as good; support mismatch, where rare high-value structures cannot be reliably distinguished from rare noise by probability support alone; and overfitting mismatch, where local evidence, metrics, templates, or feedback are bound too tightly and fail to generalize across adjacent scenes.

The paper also introduced **autoregressive local alignment** as the common middle regime. In this regime, probability and task value are aligned over local operations, fragments, or subtasks, but the alignment does not automatically compose into global task success. This is the regime most users actually face: the model is useful enough to create real local value, but not governed enough to ensure that local value satisfies the task's true objective.

A further clarification is that modern alignment does not invalidate the probability-value framework. Training-time alignment compresses proxy task value into policy probability, and thinking expands the reachable space of locally aligned intermediate states. These mechanisms explain why LLM systems continue to improve and why more tasks become locally aligned over time. But they do not remove structural mismatch in open-ended tasks, because true utility may still depend on nonlocal aggregation, low-support structures, unidentifiable latent state, or underspecified goals.

At the positive pole, the paper argued that LLM mediocrity has an opposite: **autoregressive extraordinary**. In stable positive-alignment regimes, autoregressive continuation is not the bottleneck but the advantage. Context compression, semantic decompression, register transfer, surface polish, structured transformation, taxonomy generation, edge-case enumeration, query formulation, comparison-matrix synthesis, and scaffold generation can all be cases where local continuation and task value reinforce each other.

This three-regime view changes the intervention principle. The goal is not always to abandon output space or impose a heavy control architecture. The more general goal is **Mediocrity-to-Extraordinary Transformation**: preserve the locally aligned operations, reparameterize the high-mismatch components into lower-mismatch, positively aligned subtasks, then compose and validate their outputs. Multi-request interaction becomes useful when each round produces persistent intermediate artifacts that change the task distribution faced by the next round.

To operationalize this principle for high-mismatch, high-stakes, or only locally aligned tasks, we proposed **Knowledge Governance**: an inference-time framework that induces task-specific control knowledge in a **Decoupled Control Space**, validates it under the strongest available evidence, stores it as explicit and revocable **Governed Knowledge Objects**, and uses those objects to guide rendering. The framework is not universally necessary. Its value lies in settings where local plausibility is an incomplete proxy for utility and where repeated fluent search alone is unlikely to convert local value into global task success.

The broader implication is that high-value LLM systems may depend not only on generating better text, but on knowing when text generation is already the right control space, when it is only locally aligned, when it is the wrong control space, and how to transform one regime into another.

---

## Acknowledgments

We thank colleagues and collaborators who provided feedback on early versions of this framework and on pilot implementations.

---

## References

[1] Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed H. Chi, Quoc V. Le, and Denny Zhou. **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.** arXiv:2201.11903, 2022.

[2] Xuezhi Wang, Jason Wei, Dale Schuurmans, Quoc V. Le, Ed H. Chi, Sharan Narang, Aakanksha Chowdhery, and Denny Zhou. **Self-Consistency Improves Chain of Thought Reasoning in Language Models.** arXiv:2203.11171, 2022.

[3] Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao, and Karthik Narasimhan. **Tree of Thoughts: Deliberate Problem Solving with Large Language Models.** arXiv:2305.10601, 2023.

[4] Aman Madaan, Niket Tandon, Prakhar Gupta, Skyler Hallinan, Luyu Gao, Sarah Wiegreffe, Uri Alon, Nouha Dziri, Shrimai Prabhumoye, Yiming Yang, Shashank Gupta, Bodhisattwa Prasad Majumder, Katherine Hermann, Sean Welleck, Amir Yazdanbakhsh, and Peter Clark. **Self-Refine: Iterative Refinement with Self-Feedback.** arXiv:2303.17651, 2023.

[5] Noah Shinn, Federico Cassano, Edward Berman, Ashwin Gopinath, Karthik Narasimhan, and Shunyu Yao. **Reflexion: Language Agents with Verbal Reinforcement Learning.** arXiv:2303.11366, 2023.

[6] Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Kuettler, Mike Lewis, Wen-tau Yih, Tim Rocktaeschel, Sebastian Riedel, and Douwe Kiela. **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.** arXiv:2005.11401, 2020.

[7] Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, Jackson Kernion, Andy Jones, Anna Chen, Anna Goldie, Azalia Mirhoseini, Cameron McKinnon, Carol Chen, Catherine Olsson, Christopher Olah, Danny Hernandez, Dawn Drain, Deep Ganguli, Dustin Li, Eli Tran-Johnson, Ethan Perez, Jamie Kerr, Jared Mueller, Jeffrey Ladish, Joshua Landau, Kamal Ndousse, Kamile Lukosuite, Liane Lovitt, Michael Sellitto, Nelson Elhage, Nicholas Schiefer, Noemi Mercado, Nova DasSarma, Robert Lasenby, Robin Larson, Sam Ringer, Scott Johnston, Shauna Kravec, Sheer El Showk, Stanislav Fort, Tamera Lanham, Timothy Telleen-Lawton, Tom Conerly, Tom Henighan, Tristan Hume, Samuel R. Bowman, Zac Hatfield-Dodds, Ben Mann, Dario Amodei, Nicholas Joseph, Sam McCandlish, Tom Brown, and Jared Kaplan. **Constitutional AI: Harmlessness from AI Feedback.** arXiv:2212.08073, 2022.

[8] Hunter Lightman, Vineet Kosaraju, Yura Burda, Harri Edwards, Bowen Baker, Teddy Lee, Jan Leike, John Schulman, Ilya Sutskever, and Karl Cobbe. **Let's Verify Step by Step.** arXiv:2305.20050, 2023.

[9] Alexander D'Amour, Katherine Heller, Dan Moldovan, Ben Adlam, Babak Alipanahi, Alex Beutel, Christina Chen, Jonathan Deaton, Jacob Eisenstein, Matthew D. Hoffman, Farhad Hormozdiari, Neil Houlsby, Shaobo Hou, Ghassen Jerfel, Alan Karthikesalingam, Mario Lucic, Yian Ma, Cory McLean, Diana Mincu, Akinori Mitani, Andrea Montanari, Zachary Nado, Vivek Natarajan, Christopher Nielson, Thomas F. Osborne, Rajiv Raman, Kim Ramasamy, Rory Sayres, Jessica Schrouff, Martin Seneviratne, Shannon Sequeira, Harini Suresh, Victor Veitch, Max Vladymyrov, Xuezhi Wang, Kellie Webster, Steve Yadlowsky, Taedong Yun, Xiaohua Zhai, and D. Sculley. **Underspecification Presents Challenges for Credibility in Modern Machine Learning.** arXiv:2011.03395, 2020.

[10] Lauro Langosco, Jack Koch, Lee Sharkey, Jacob Pfau, Laurent Orseau, and David Krueger. **Goal Misgeneralization in Deep Reinforcement Learning.** arXiv:2105.14111, 2021.

[11] Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, and Yuan Cao. **ReAct: Synergizing Reasoning and Acting in Language Models.** arXiv:2210.03629, 2022.

[12] Hariharan Iyer, Seungmin Seo, Lukas Diduch, Kay Peterson, George Awad, and Yooyoung Lee. **2024 NIST GenAI (Pilot Study): Text-to-Text Evaluation Overview and Results.** NIST AI 700-1, 2025.

[13] Long Ouyang, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Fraser Kelton, Luke Miller, Maddie Simens, Amanda Askell, Peter Welinder, Paul Christiano, Jan Leike, and Ryan Lowe. **Training Language Models to Follow Instructions with Human Feedback.** arXiv:2203.02155, 2022.

[14] Rafael Rafailov, Archit Sharma, Eric Mitchell, Stefano Ermon, Christopher D. Manning, and Chelsea Finn. **Direct Preference Optimization: Your Language Model is Secretly a Reward Model.** arXiv:2305.18290, 2023.
