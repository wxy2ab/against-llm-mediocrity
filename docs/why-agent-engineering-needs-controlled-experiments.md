# Why Agent Engineering Must Take Controlled Experiments Seriously

## From benchmark progress to a cumulative science of runtime mechanisms

**Status:** Working Draft v0.1
**Date:** 2026-08-12
**Companion:** [中文版本](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/why-agent-engineering-needs-controlled-experiments.zh-CN.md)
**Related framework:** [Agent Harness Framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-harness-framework.md) · [Six Primitive Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)

---

## Abstract

Agent engineering is moving from prompt craft toward the design of complete runtime systems: models, context constructors, tools, memory, routers, planners, verifiers, state stores, commit protocols, and recovery loops. Yet the field still evaluates many of these systems as indivisible products. A new agent changes its model, prompt, tool interface, retry budget, verifier, and benchmark harness at once, and the resulting end-to-end score is presented as if it identified the source of improvement.

This is enough for a leaderboard. It is not enough for a cumulative engineering science.

Recent work has begun to correct the imbalance. Research on agent-computer interfaces, reproducible agent evaluation, harness evolution, unified agent frameworks, factorial evaluation, and multi-generation statistics all points in the same direction: an agent score is a joint property of the model, harness, environment, budget, and evaluator. Fixed-model studies show that scaffold changes alone can move quality materially; cross-model studies show that harness sensitivity is not monotone in model capability; industrial reports increasingly treat observability, persistent state, verifiable outcomes, and mechanically enforced constraints as first-class infrastructure.

But this frontier still has a limitation. Establishing that “the harness matters” does not identify which structural failure was repaired, through which causal channel, under which conditions, or whether the effect should transfer to a new model. This paper proposes a sharper, falsifiable foundation. It treats observation-representation, state, fitting-boundary, support, aggregation, and specification mismatch as six candidate structural ways in which task value can be lost between the world and an agent's committed output. The structural-persistence hypothesis predicts that model improvement can reduce their frequency and move their boundaries, but cannot uniformly remove the underlying dimensions in open task spaces with finite resources and imperfect interfaces.

Controlled experiments should therefore become the central method of agent engineering. Their purpose is not to freeze the behavior of one model generation. Their purpose is to identify structural conditions, causal mechanisms, interaction effects, and activation boundaries that can be retested and recalibrated as models change. Training moves the boundary; controlled experiments measure the governance laws at the boundary.

---

## 1. The methodological problem is confounding, not a shortage of benchmarks

Let the expected value of an agent system be

\[
J(\theta,H,E,D,b,V),
\]

where:

- \(\theta\) is the model and inference policy;
- \(H\) is the runtime harness;
- \(E\) is the environment and tool surface;
- \(D\) is the task distribution;
- \(b\) is the token, time, call, money, and risk budget;
- \(V\) is the evaluator or oracle.

Most public comparisons change several arguments at once. A new agent release may use a stronger model, a longer context window, a different system prompt, new tools, a larger retry budget, altered truncation rules, a more permissive verifier, and a refreshed task set. The observed difference

\[
J(\theta_2,H_2,E_2,D_2,b_2,V_2)
-
J(\theta_1,H_1,E_1,D_1,b_1,V_1)
\]

is a valid product comparison. It is not an identified mechanism effect.

This distinction matters because product optimization and scientific accumulation ask different questions:

```text
Product question:
Which complete system should we deploy today?

Scientific question:
Under condition C, does intervention G change outcome Y
through mechanism M, at what cost, and with what interactions?
```

End-to-end evaluation remains necessary. Users experience the full system, not an ablation table. But end-to-end evaluation is the last layer of evidence, not a substitute for the layers beneath it. Without controlled contrasts, the field repeatedly rediscovers recipes while losing the ability to explain why they worked, when they will fail, and what should survive a model upgrade.

In this paper, a **controlled experiment** means a pre-specified manipulation of a runtime or environment variable with matched comparison arms, an authoritative endpoint, and explicit falsifiers. Randomization should be used where feasible, but the category also includes paired deterministic probes, blocked offline trials, and factorial mechanism studies. It does not mean that every useful question must be reduced to a production A/B test.

---

## 2. The frontier is shifting from model scores to system evidence

Several lines of work now converge on a joint-system view.

| Line of work | What it establishes | What it does not yet establish |
|---|---|---|
| [METR's time-horizon program](https://metr.org/time-horizons/) | Frontier agents can reliably complete tasks of increasing human-equivalent duration; capability boundaries move quickly. | Whether the gain comes from the model, the fixed evaluation scaffold, task composition, or their interaction; nor whether runtime governance becomes unnecessary. |
| [SWE-agent](https://arxiv.org/abs/2405.15793) | Agent-computer interface design can materially change a model's ability to navigate, edit, and test software. | A general causal taxonomy of interface effects outside software engineering. |
| [AI Agents That Matter](https://arxiv.org/abs/2407.01502) | Accuracy-only leaderboards conflate developer needs, cost, overfitting, and reproducibility. | A mechanism-level decomposition of runtime interventions. |
| [OpenAI's harness engineering report](https://openai.com/index/harness-engineering/) | Legible environments, feedback loops, mechanical constraints, repository-local knowledge, and observability can compound in real engineering work. | A randomized comparison; it is high-value field evidence, not causal identification. |
| [Anthropic's agent-eval guidance](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | The unit under evaluation is the model-harness system; trials need isolated environments, multiple attempts, traces, and outcome-state graders. | A universal prescription for which harness mechanisms work. |
| [From Model Scaling to System Scaling](https://arxiv.org/abs/2605.26112) | Context, memory, routing, orchestration, verification, and governance should be first-class objects of design and evaluation. | Strong cross-domain causal evidence; much of the contribution is a research agenda and reference architecture. |
| [A Unified Framework for the Evaluation of LLM Agentic Capabilities](https://arxiv.org/abs/2605.27898) | Across a large rollout corpus, scaffold choice and environmental volatility can move benchmark outcomes in both directions. | Complete separation of intrinsic capability from the bias introduced by the chosen common ReAct-style scaffold and task adaptations. |
| [Agent Harness Evolution Shapes Coding Agent Quality](https://arxiv.org/abs/2607.03691) | Holding the model fixed across 35 sequential harness releases exposes substantial quality variation and links shifts to concrete components. | Broad external validity beyond one longitudinal CLI, one coding domain, and a stratified 50-task sample. |
| [Harness Sensitivity Is Non-Monotone](https://arxiv.org/abs/2605.26731) | A 432-run controlled study rejects the simple claim that stronger models always need less structure. | A capability-tier law: each tier contains only one tested model, and the benchmark is small and synthetic. |
| [Agentic Harness Engineering](https://arxiv.org/abs/2604.25850) | Observable, revertible harness evolution can improve coding performance; some evolved tools, middleware, and memory transfer across model families better than prompt changes. | That automatic evolution found a globally valid mechanism rather than benchmark- and optimizer-conditioned improvements. |
| [CAFE](https://arxiv.org/abs/2607.10380) | Factorial designs and mixed-effects models can attribute variance to compound-AI components and interactions. | Generality beyond its demonstrated RAG setting and the validity limits of model-based judges. |
| [Beyond the Singular](https://aclanthology.org/2026.findings-acl.488/) | Multiple generations and hierarchical modeling expose sampling variance hidden by single-run benchmark scores. | Environmental, tool, and state correlations specific to long agent trajectories. |

The important change is epistemic. The field is beginning to accept four propositions:

1. an “agent” is a compound system, not a model with a long prompt;
2. final success is jointly produced by model, harness, environment, budget, and oracle;
3. traces and final environment state carry information that a scalar score discards;
4. stochastic systems require replication, uncertainty estimates, and matched conditions.

These propositions create the opening for controlled experimentation. They do not complete it.

---

## 3. Why the frontier still falls short of a cumulative science

### 3.1 “Harness matters” is a direction, not a causal explanation

If adding memory improves success, at least five explanations remain possible: missing observations became available; latent state was represented more accurately; the correct capability was routed more often; rare useful structures received more support; or locally correct pieces were aggregated more coherently. “Memory helped” names a component. It does not identify the repaired failure.

Component labels are unstable across implementations. One system's “memory” is another system's state store, retrieval layer, prompt compressor, or audit log. Mechanism labels are more portable: observation coverage, state authority, routing calibration, support coverage, composition integrity, and objective fidelity.

### 3.2 Ablation is not automatically a controlled experiment

Removing a component can change token count, latency, available actions, prompt length, model attention, retry opportunity, and verifier behavior at the same time. A large ablation effect may be real while its causal channel remains ambiguous. A valid contrast needs a treatment contract: what is fixed, what is manipulated, what mediator should change, which endpoint is authoritative, and what result would falsify the mechanism claim.

### 3.3 Benchmarks often confound capability with opportunity

A model cannot use information it never observes, cannot commit to a state transition the environment does not expose, and cannot satisfy an objective the evaluator mis-specifies. Yet a low score is often recorded as “model failure.” Conversely, a permissive grader, leaked state, shared caches, or benchmark-specific scaffolding may create an artificial success. The result is a measurement of opportunity plus capability, incorrectly reported as capability alone.

### 3.4 Model-harness interaction defeats monotone recipes

The non-monotone harness results are not an inconvenience; they are a warning about main-effect thinking. A strict scaffold can help one reasoning model and hurt a frontier chat model. A useful engineering law must therefore be conditional:

```text
not: mechanism G is better
but: G is better when mismatch dose C is high,
     model family θ can use G,
     and overhead remains below budget b.
```

### 3.5 Endpoint accuracy hides authority and failure mode

An agent can announce completion while the database, repository, calendar, or payment system remains unchanged. It can also reach a correct answer through an unsafe or unrecoverable trajectory. Final-text grading collapses claimed state, verified state, and committed state. Agent engineering needs outcome-state oracles, transition validity, rollback evidence, cost, and tail-risk measures in addition to task success.

### 3.6 Model judges can close a self-referential loop

When models generate, critique, and grade outputs under closely related prompts or model families, shared blind spots can masquerade as agreement. Model-based graders are useful, but their error must be measured against human or executable authorities. Statistical significance computed on an unvalidated judge does not repair specification mismatch in the metric itself.

### 3.7 Average effects are not deployment rules

A positive average treatment effect can hide a crossover: patching may dominate for sparse edits and fail for dense changes; auditing may help on hard tasks and waste budget on easy ones; additional observations may resolve uncertainty in one state regime and distract in another. Agent engineering needs dose-response curves, interactions, and activation policies—not just one aggregate percentage.

### 3.8 Much of the 2026 evidence is young and domain-concentrated

Several of the most relevant studies are recent preprints, and much of the controlled evidence comes from coding agents, synthetic tasks, or RAG. They provide serious reasons to change method, but not permission to declare universal laws. The correct response is replication under stronger contracts, not dismissal and not premature canonization.

---

## 4. The deeper conflict: training absorption versus structural persistence

A common implicit prior in agent research is the **training-absorption hypothesis**:

\[
H_{\mathrm{absorb}}:
\forall g,\;\exists \theta'\text{ sufficiently capable such that }
J(\theta',h_0;D,b)\approx J(\theta,g;D,b).
\]

Here, \(g\) is a governance or harness mechanism and \(h_0\) is a minimal runtime. The hypothesis says that a sufficiently capable future model can reproduce, inside the minimal runtime, the benefit that today's weaker model receives from \(g\). If this were generally true, most runtime experiments would have only short-lived product value.

The alternative is a **structural-persistence hypothesis**:

\[
H_{\mathrm{persist}}:
\forall \theta\text{ with bounded resources},\;
\exists D_i\text{ that exhibits mismatch }M_i.
\]

For every finite model, finite context, and finite inference budget, an open task space contains regions where one of six structural mismatches reappears. A stronger model may reduce the frequency, severity, or reachable boundary of the mismatch. It does not remove the dimension along which the mismatch is generated.

The six mismatches occupy different points in a world-to-commit pipeline:

```text
world
→ observation and representation
→ belief formation and update
→ capability routing
→ candidate support
→ global aggregation
→ objective evaluation
→ verified commitment
```

| Mismatch | Structural question | What training can improve | What training alone cannot guarantee |
|---|---|---|---|
| Observation-representation | Did decision-relevant information available through a feasible channel enter, survive, bind to the right entity, and remain usable? | Compression, extraction, tool use, prior-based inference. | Recovery of information absent from every feasible channel; that remaining gap is an irreducible information limit, not system mismatch. |
| State | At fixed accessible evidence, is actual belief evidence-warranted and does it support the correct action ranking? | Belief tracking, state inference, and uncertainty preservation. | Evidence-faithful belief updating under every open dynamic; training also cannot remove irreducible uncertainty. |
| Fitting-boundary | Is a capability activated exactly where its competence applies? | Routing on known distributions. | Permanent calibration under open distribution shift and newly discovered boundaries. |
| Support | Can the deployed search process reach and retain high-value structures? | Probability mass on known useful patterns. | Adequate support for every future rare structure under finite search and budget. |
| Aggregation | Do locally plausible parts compose into global value? | Longer reasoning, planning, and backtracking. | Elimination of commitment risk in arbitrarily long, coupled, non-locally decomposable tasks. |
| Specification | Does the accessible objective match authorized real utility? | Prediction of common preferences and implicit norms. | Knowledge of unexpressed, changing, or authority-dependent utility. |

The claim must be bounded carefully. It is not that every concrete mismatch instance is forever unsolvable by training. A future model may solve today's benchmark, memorize today's edge cases, or internalize today's audit behavior. The claim is that solving a fixed instance does not remove the failure class from an open task space.

Training can absorb a governance **policy**—for example, when to query, verify, patch, or escalate. It cannot create missing observations, turn a faulty verifier into a true oracle, make text context authoritative over an external system, manufacture user authorization, or guarantee atomic commit and rollback by assertion alone. Those are governance **resources** and system semantics, wherever the product chooses to package them.

---

## 5. A six-mismatch controlled-experiment program

The six mismatches do more than classify failures. They define experimental manipulations, expected mediators, outcome measures, and falsifiers. Each experiment below should be run with paired task seeds, isolated environments, repeated trials, fixed budgets, and versioned model/harness contracts.

A general measurement rule is to **manipulate and report task-side structural dose separately from system-side mismatch**. Dependency coupling or low `α_k` is task nonlocality; a diffuse state posterior or high `δ_amb` is task ambiguity. These quantities say how much pressure a system faces. Aggregation mismatch must be measured by ranking error or regret of the deployed proxy relative to global completion value. State mismatch must be measured by calibration or belief-conditioned decision regret of the actual belief relative to the evidence-warranted belief. High task dose with zero system regret is successful governance, not severe residual mismatch.

### 5.1 Observation-representation mismatch: manipulate the channel, not the answer prompt

**Question.** Does adding or preserving a decisive variable repair performance because it increases usable information, rather than because it merely lengthens the prompt?

**Design.** Construct paired tasks whose visible surface is identical except for a hidden variable that changes the correct action. Compare: (A) lossy or absent channel; (B) channel with the decisive variable; (C) equal-length irrelevant enrichment as a negative control; and, where useful, (D) the variable present but incorrectly bound to an entity or timestamp. Keep model, action interface, budget, and verifier fixed.

**Measurements.** State discrimination accuracy, provenance/binding accuracy, downstream decision success, abstention quality, token cost, and the mediation path from channel availability to correct action.

**Falsifier.** If relevant and irrelevant enrichment produce the same gain, or if the agent succeeds without accessing the variable, the information-channel explanation is not established.

**Diagnostic boundary.** Use this label only when decision-relevant information available through a feasible channel is absent, degraded, unbound, stale, or unusable in the accessible representation. If information is available but several latent states remain plausible, the diagnosis does not automatically move to state mismatch. State mismatch requires incorrect collapse, misranking, forgetting, or stale belief at fixed evidence that changes action ranking; correctly preserving a broad posterior is not failure.

**Transfer test.** Increase loss severity, freshness demands, modality, and context distance across model generations. The expected transferable object is the channel condition and mediation path, not a fixed percentage gain.

### 5.2 State mismatch: hold evidence fixed and isolate belief-update error

**Question.** Without adding observations, does an explicit belief surface reduce decision errors caused by unjustified collapse, misranking, forgetting, or stale belief?

**Design.** Hold each episode's observation and representation `Z≤t` fixed. Cross two factors: belief update (ordinary contextual continuation versus an explicit hypothesis-evidence-probability/ranking table) and action policy (unconditional point action versus belief-conditioned branching or risk-bounded action). Include evidence that demands updating, forgetting checks, and state transitions while keeping accessible facts identical across groups. Run queryable-hard-state and typed-commit-contract experiments separately: the former changes the channel, while the latter tests SGAR authority and neither is the primitive-state minimal pair.

**Measurements.** Calibration error relative to the evidence-warranted belief, state-misranking rate, evidence-forgetting rate, stale-belief rate, belief-conditioned decision regret, and correct preservation of irreducible uncertainty. In the separate SGAR experiment, measure invalid transitions, false completion, rollback integrity, and commit consistency.

**Falsifier.** If the explicit belief surface does not improve calibration, updating, or decision regret after information and budget are fixed, it does not establish repair of state mismatch. If gains appear only after adding hard state, the evidence supports observation-representation repair rather than a fixed-`Z` state repair.

**Diagnostic boundary.** If feasibly obtainable authoritative information does not enter `Z`, the upstream failure is observation-representation mismatch. If no feasible channel exposes true state but the system maintains the correct posterior and takes a belief-optimal or risk-bounded action, there is no state mismatch. If belief is correct but an illegal action is still selected, action or commit governance is the closer mechanism target.

**Transfer test.** Move from toy state machines to files, databases, tickets, calendars, and multi-agent ownership. Stronger models may make fewer mistakes, but the distinction between belief and authority remains testable.

### 5.3 Fitting-boundary mismatch: measure routing calibration across a boundary grid

**Question.** Does a capability fail because it is unavailable, or because it is activated in the wrong regime?

**Design.** Build a boundary grid with clear in-domain cases, clear out-of-domain cases, and graded near-boundary cases. Compare ungated activation, a learned router, evidence-conditioned routing, and typed abstention/escalation. Hold the underlying specialist capability fixed so the experiment tests routing rather than retraining.

**Measurements.** True- and false-activation rates, selective risk, calibration error, utility under asymmetric error costs, coverage, and boundary drift on holdout families.

**Falsifier.** If the specialist itself lacks competence inside the intended domain, a routing intervention cannot be credited. Oracle capability tests must precede router tests.

**Diagnostic boundary.** Fitting-boundary mismatch requires a capability that succeeds in its intended regime under an oracle route. If the right route is selected but high-value candidates still rarely appear, the remaining bottleneck is support rather than routing.

**Transfer test.** Repeat on new task families and models. The main scientific object is the relationship among trigger evidence, competence boundary, and error cost—not one universal threshold.

### 5.4 Support mismatch: compare control-space search with output-space resampling

**Question.** Is the high-value structure absent because the model cannot express it, or because the deployed search process rarely reaches, retains, or recognizes it?

**Design.** Under a matched token and call budget, compare direct generation, independent best-of-\(N\), critique-and-regenerate, and control-space interventions that change decomposition, representation, constraints, candidate topology, or deterministic operators. Include an oracle-supplied candidate condition to test whether the verifier can recognize the target once present.

**Measurements.** Probability that any valid high-value structure appears, time-to-first-coverage, structural diversity, retention through pruning, verifier recall, best-found utility, and marginal value per token.

**Falsifier.** If an oracle candidate is consistently rejected, the bottleneck may be recognition or specification rather than support. If more independent samples close the gap at matched cost, a specialized control-space mechanism has not earned its complexity.

**Diagnostic boundary.** Support mismatch is a reachability or retention failure. If the required local structures appear reliably but fail when combined, the primary failure has moved downstream to aggregation.

**Transfer test.** Vary rarity, compositional depth, and search budget. The expected crossover is central: control-space search should matter most when naive effective support is low.

### 5.5 Aggregation mismatch: vary coupling and commitment surface

**Question.** When correct local pieces exist, which runtime structures preserve them while producing a globally valid object or trajectory?

**Design.** Factor task coupling (independent to globally dependent), edit density (sparse to dense), delivery interface (patch versus full rewrite), and repair horizon (local step versus full-stage replan). Fix the plan, source object, verifier, model, and budget where the target mechanism is delivery; separately vary planning when planning is the object of study. Include deterministic execution and copy controls.

**Measurements.** Global invariant satisfaction, preservation of untouched regions, conflict rate, error propagation depth, strict success within budget, recovery cost, and patch/rewrite or step/stage crossover points.

**Falsifier.** A patch advantage under sparse change does not prove universal patch superiority. If it disappears when the plan is correct and budgets are matched, the earlier result was probably a planning or resource confound. The repository's [patch-versus-rewrite study](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.md) is an example of narrowing this claim with oracle-plan, copy, and independent budget controls.

**Diagnostic boundary.** Aggregation mismatch presupposes usable local parts, constraints, or evidence that the composition process fails to preserve. If those parts never enter the candidate set, the upstream bottleneck is support; if the system optimizes the wrong global criterion, it is specification.

**Transfer test.** Repeat across artifact types, model families, and coupling scales. Program semantics can preserve a structural invariant—patches do not recommit untouched regions—even when empirical effect sizes change.

### 5.6 Specification mismatch: manipulate objective information and authority

**Question.** Does the agent fail because it cannot optimize, or because the accessible objective differs from the user's authorized utility?

**Design.** Create tasks where the same prompt is compatible with multiple plausible utilities that require different actions. Cross objective condition (proxy only, explicit preference, counterexample-enriched specification) with authority condition (no authority, authorized user signal, mandatory human gate). Add objective drift during the episode and adversarially gameable graders.

**Measurements.** Authorized-utility regret, proxy/true-objective divergence, unsafe commitment rate, escalation precision and recall, responsiveness to preference updates, and resistance to evaluator loopholes.

**Falsifier.** If the “true” utility is inferred only from the same model judge used to score the agent, the study has not escaped specification mismatch. High-fidelity human, executable, or institutionally authorized oracles are required.

**Diagnostic boundary.** Specification mismatch concerns the objective or its authority. If the authorized objective is explicit and the system still cannot produce a qualifying candidate, support, aggregation, or capability may be the active bottleneck.

**Transfer test.** Change domains, stakeholders, and authority structures. Models may predict preferences better over time; they still cannot substitute prediction for authorization where authorization is part of the task semantics.

---

## 6. The minimum experimental contract

A credible agent experiment should publish enough information to reconstruct the intervention, opportunity set, and outcome authority.

### 6.1 Define the estimand before running the system

For a governance intervention \(g\) against baseline \(h_0\), define

\[
\Delta_g(\theta,D,b)
=
\mathbb{E}[J\mid \theta,g,D,b]
-
\mathbb{E}[J\mid \theta,h_0,D,b].
\]

Then state the claim ceiling. Is the experiment estimating a product-level total effect, a mechanism-mediated effect, an interaction, a boundary threshold, or a transport effect? These are not interchangeable.

Causal language is warranted only to the extent that treatment arms differ in the declared manipulation and the endpoint is measured without treatment-dependent bias. Unmeasured differences in tools, opportunities, timeouts, or grading remain alternative explanations even when a p-value is small.

### 6.2 Freeze the comparability contract

Version and disclose:

- model identifier, endpoint, decoding settings, and date;
- full harness and prompt state;
- tools, permissions, environment image, initial state, and network policy;
- token, call, wall-clock, money, and retry budgets;
- task sampling and holdout construction;
- verifier code, outcome-state oracle, and grader version;
- stopping, timeout, failure, and exclusion rules.

Changing one of these after observing results creates a new experiment, not a harmless implementation detail.

### 6.3 Prefer paired, blocked, and factorial designs

Run treatment and control on the same task seeds and initial states. Block on known difficulty, domain, and mismatch dose. Randomize order and isolate trials. When components plausibly interact, use a factorial or fractional-factorial design instead of a sequence of one-off ablations. Main effects without interactions are especially dangerous in compound agent systems.

### 6.4 Replicate stochastic trials and model the hierarchy

Single generations underestimate uncertainty. Repeated attempts should separate variance across task families, tasks, seeds, model sampling, and infrastructure. Report effect sizes and confidence or credible intervals, not only point estimates. Use hierarchical or mixed-effects models when tasks and runs are nested, and adjust confirmatory tests for multiple comparisons.

Run a prospective power or precision analysis against the minimum effect of interest. Predefine how timeouts, invalid runs, provider errors, and early stopping enter the estimand. Repeatedly inspecting results and extending the run until significance appears invalidates ordinary confirmatory intervals unless a sequential design was declared in advance.

### 6.5 Match budgets and opportunities, not just prompts

Equal prompts do not imply equal treatments if one arm gets more tool calls, longer wall-clock, extra retries, a richer action space, or a stronger verifier. Publish both resource consumption and opportunity surfaces. When strict matching is impossible, estimate budget-success curves and compare systems at equivalent cost or risk.

### 6.6 Grade environment outcomes and trajectories

Record final environment state, valid state transitions, verifier receipts, rollback behavior, tool errors, and traces in addition to final text. Use executable or high-fidelity graders wherever possible. Validate model judges against independent authorities and incorporate grader uncertainty into conclusions.

### 6.7 Add mechanism checks and negative controls

A treatment should change its proposed mediator. More observation should increase access to the decisive variable; state governance should reduce invalid transitions; routing should improve selective calibration; support interventions should increase target coverage; aggregation controls should reduce invariant violations; specification governance should reduce authorized-utility regret. Irrelevant enrichment, sham controls, oracle candidates, copy controls, and deliberately stale state can distinguish the mechanism from generic extra-compute effects.

### 6.8 Pre-register falsifiers and minimum effects

“Any positive difference” is too weak. Specify the expected direction, minimum practically important effect, primary endpoint, interactions, and failure conditions before inspection. Preserve null and sign-reversed results. A failed prediction with a clean contract is cumulative knowledge; an unlogged post-hoc success is not.

### 6.9 Retest across models without demanding identical effect sizes

The transport claim should be layered:

1. **Structural invariant:** follows from information, program, transaction, or authority semantics.
2. **Conditional mechanism prediction:** should recur when the same mismatch condition is present.
3. **Numerical calibration:** effect size, cost, threshold, and optimal complexity are model- and protocol-specific.

It is unreasonable to demand

\[
\Delta_g(\theta_1,D,b)=\Delta_g(\theta_2,D,b).
\]

The cumulative claim is that the intervention, preconditions, mediator, and falsifier remain definable and retestable. Each model generation requires recalibration, not reinvention of the question.

---

## 7. A staged research program for Agent Engineering

### Stage 0: Build the measurement substrate

Version harnesses, isolate environments, capture traces, expose authoritative state, standardize budgets, and make evaluators executable. Without this substrate, later experiments will produce precise numbers about unstable systems.

### Stage 1: Establish diagnostic microbenchmarks

For each mismatch, build small paired tasks that orthogonalize task pressure and system defect. Observation loss, state ambiguity, boundary distance, support rarity, dependency coupling, and objective ambiguity can be task-side doses. Channel fidelity, belief updater, capability router, deployed proxy, search, and evaluator quality are system-side factors. The goal is not realism first; it is to identify which task pressure breaks which system component, without labeling a system mismatched merely because task dose is high.

### Stage 2: Estimate mechanism and interaction effects

Run cross-mismatch factorial experiments. Examples include observation × routing, state authority × commit protocol, support search × verifier quality, and dependency coupling × repair interface. Compound failures are expected to be super-additive; the experimental design must be able to detect that.

### Stage 3: Test transport on open tasks

Move from synthetic probes to coding, research, data, browser, operations, and collaborative tasks. Preserve the same treatment contract while changing surface form. Report where the mechanism stops transferring.

### Stage 4: Run longitudinal cross-model replication

Keep task families, environment snapshots, and interventions stable while models change. Re-estimate baseline, treatment effect, crossover, and optimal activation policy. This creates an empirical map of how model scaling moves mismatch boundaries.

### Stage 5: Validate decision policies in production

Deploy only after offline identification. Use guarded rollouts to test whether the learned activation rule improves user utility, cost, latency, and tail risk. Production feedback should create new regression guards and experimental tasks, not silently redefine the original benchmark.

The output of this program is not a universal “best agent.” It is a library of conditional engineering laws:

```text
When state ambiguity exceeds c, a feasible authoritative query exists,
and its value of information is positive, query before commit;
otherwise act optimally or conservatively under the warranted belief.

When edit density is below d and the plan is verified,
prefer bounded patch delivery.

When effective support for the target structure is low,
change the control space before buying more identical samples.

When objective authority is missing,
escalate instead of optimizing a guessed proxy.
```

---

## 8. What would count against this thesis?

The structural-persistence view should not be protected from evidence. It would be weakened if, across diverse open task families and under matched budgets:

- minimal runtimes consistently matched governed runtimes on mismatch-dosed probes;
- treatment effects failed to increase with the corresponding mismatch dose;
- proposed mediators did not move when interventions were applied;
- stronger models eliminated not only fixed failures but also the predicted boundary shift on newly generated tasks;
- effects did not transport even when preconditions and mechanism checks were preserved;
- the overhead and new failure modes of governance dominated its benefits across the relevant operating region.

Even then, a finite benchmark cannot prove that a failure class has vanished from every open task space. But it can show that a proposed taxonomy is not useful, a mechanism is incorrectly specified, or an intervention is economically irrelevant. The framework earns scientific value only by making those losses possible.

---

## 9. Conclusion

Agent engineering cannot become cumulative by collecting more indivisible agent scores. It becomes cumulative when it can distinguish model capability from opportunity, harness structure from component names, claimed completion from committed state, and product wins from identified mechanisms.

The emerging frontier already shows that scaffold choice, interface design, environment volatility, repeated sampling, and component interactions materially shape results. Its next step is controlled experimentation organized around stable failure structures. The six mismatches provide such a structure: they specify where value is lost, which variable should be manipulated, what mediator should move, which oracle is authoritative, and how a result can fail.

The durable unit of knowledge is therefore not “Harness X added 8 points to Model Y.” It is:

> Under a defined structural condition, a governed intervention changes the system through an observed causal channel, within a measured budget and risk envelope.

Specific benchmark items will be solved. Models will become stronger. Some external scaffolds will move inside model-native runtimes. None of this makes controlled experiments obsolete. It makes them the mechanism by which agent engineering can tell what was learned, what merely moved, and what must be tested again.

> **Training can eliminate old problems without eliminating the six dimensions that generate new ones.**
> **Model upgrades move mismatch boundaries; controlled experiments identify the governance laws at those boundaries.**

---

## Evidence and claim boundary

This document distinguishes peer-reviewed conference work, recent preprints, and practitioner reports. Recent 2026 preprints are used as frontier evidence, not as settled consensus. The six-mismatch program is a falsifiable research proposal grounded in the repository's structural framework; it is not presented as already validated across all domains or models.

---

## References

1. METR. [Task-Completion Time Horizons of Frontier AI Models](https://metr.org/time-horizons/). Updated 2026.
2. Yang, J., et al. [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793). NeurIPS 2024.
3. Kapoor, S., et al. [AI Agents That Matter](https://arxiv.org/abs/2407.01502). 2024.
4. Lopopolo, R. [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/). OpenAI, 2026.
5. Anthropic. [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents). 2026.
6. Gu, S. [From Model Scaling to System Scaling: Scaling the Harness in Agentic AI](https://arxiv.org/abs/2605.26112). 2026.
7. Zhu, P., et al. [A Unified Framework for the Evaluation of LLM Agentic Capabilities](https://arxiv.org/abs/2605.27898). 2026.
8. Ben Sghaier, O., et al. [Don't Blame the Large Language Model: How Agent Harness Evolution Shapes Coding Agent Quality](https://arxiv.org/abs/2607.03691). 2026.
9. Cho, Y. [It's Not the Capability: Harness Sensitivity Is Non-Monotone Across LLM Agent Tiers](https://arxiv.org/abs/2605.26731). 2026.
10. Lin, J., et al. [Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses](https://arxiv.org/abs/2604.25850). 2026.
11. Lukassen, F., et al. [CAFE: A Compound-AI Factorial Evaluation Framework](https://arxiv.org/abs/2607.10380). 2026.
12. Zhang, W., Cai, H., and Chen, W. [Beyond the Singular: Revealing the Value of Multiple Generations in Benchmark Evaluation](https://aclanthology.org/2026.findings-acl.488/). Findings of ACL 2026.
13. Yehudai, A., et al. [A Survey on Evaluation of LLM-based Agents](https://aclanthology.org/2026.findings-acl.1330/). Findings of ACL 2026.
