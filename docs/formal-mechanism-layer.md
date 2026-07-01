# A Formal Mechanism Layer for LLM Failure

## From Mismatch Phenomena to Intervenable Components

**Status:** Working draft  
**Current synthesis:** [A Structural Theory of Value Preservation in LLM Systems](structural-theory-value-preservation-llm-systems.md)

## Abstract

This document proposes a **formal mechanism layer** for diagnosing failures in LLM systems. It does not replace the six primitive mismatches in the main manuscript, and it does not merely give errors a more "mathematical" name. It answers a more engineering-facing question:

> When a failure occurs, should the system change the specification, add observations, repair belief state, connect real environment feedback, expand the action interface, add capability support, calibrate capability routing, or expand search?

We model an LLM system as an approximate decision system in a partially observable environment, and decompose its intervenable components into eight classes:

**specification / reward, observation availability, belief / representation, dynamics / world model, action / interface, policy prior / capability support, fitting boundary / capability routing, and search / execution**.

These eight classes are not mutually exclusive error labels. They are diagnostic axes that can be distinguished by intervention experiments. A single failure may be caused by several mechanisms, and upstream mismatches may induce downstream symptoms along the execution chain.

The core principle of the mechanism layer is:

> The phenomenon layer and primitive-mismatch layer explain what form the failure takes; the mechanism layer explains which component should be changed.

---

## 1. Position: What the Mechanism Layer Is and Is Not

### 1.1 It Is an Intervention-Localization Layer

When a model gets something wrong, asking why the model is "not smart enough" is usually not operational enough. There are at least eight very different repair directions:

1. The true objective was not expressed or evaluated correctly.
2. Information required for the decision did not enter the system.
3. Information entered the system, but did not become a correct and stable task state.
4. The system predicted the real-world consequences of action incorrectly.
5. The correct action was not available through the system interface.
6. The model policy distribution gave almost no support to the correct solution.
7. A capability existed, but was triggered in the wrong situation or under-triggered in the right one.
8. The correct candidate was reachable, but the current search and execution procedure did not find it.

These causes can look similar at the surface, but their repairs differ. The mechanism layer localizes failure to system components that can be changed, replaced, expanded, or verified.

### 1.2 It Is Not a New Main Taxonomy

The main manuscript's six primitive mismatches — aggregation, support, specification, state, fitting-boundary, and observation-representation mismatch — describe **structural misalignment between task value and system-reachable generation**.

The mechanism layer instead follows the system execution chain: how objectives enter the system, how information is observed and represented, how consequences are predicted, how actions are executed, how capabilities are supported and routed, and how candidates are searched.

Therefore the two layers do not correspond one-to-one:

- one primitive mismatch may be produced by several mechanisms;
- one mechanism mismatch may produce several surface phenomena;
- primitive mismatches are useful for explaining why a class of tasks tends to fail;
- the mechanism layer is useful for deciding which experiment to run and which component to change next.

### 1.3 It Is Not a Mutually Exclusive Label Set

The mechanism layer should be represented as a **mismatch profile**, not as a forced single-label classification.

Real systems often exhibit compound mismatches. For example, a wrong evaluation standard may push a router into conservative audit mode; conservative routing may narrow candidate search; the final symptom may look like "the model did not find the strategy." At the surface this looks like search failure, but the root cause includes specification, routing, and search.

The goal of diagnosis is not to find a unique label. It is to identify:

- which factors are upstream root causes;
- which factors are downstream symptoms;
- which intervention has the lowest cost and highest information gain;
- where the bottleneck will move after one layer is repaired.

---

## 2. Unified Formalization

### 2.1 The True Task Environment

Represent the task environment as a partially observable decision process:

\[
\mathcal{E}=(\mathcal{S},\mathcal{A},\mathcal{T},R^*,\Omega,\mathcal{O},\gamma).
\]

where:

| Symbol | Meaning |
|---|---|
| $\mathcal{S}$ | the true state space, including world state, user intent, task background, and interaction state |
| $\mathcal{A}$ | theoretically available actions, including text output, tool calls, retrieval, code execution, asking the user, and so on |
| $\mathcal{T}(s'\mid s,a)$ | true state transition: how the environment changes after an action |
| $R^*(s,a,s')$ | true task reward, the success criterion humans ultimately care about |
| $\Omega$ | the observation space available to the system |
| $\mathcal{O}(o\mid s)$ | the observation function: how true state maps to text, images, files, logs, or tool returns |
| $\gamma$ | discount factor or long-horizon weight for delayed returns |

For finite-horizon tasks, the true objective is not local likelihood for a single token, but expected value over the whole trajectory:

\[
\tau^*=\arg\max_{\tau=(s_0,a_0,\ldots,s_H)}
\mathbb{E}\left[\sum_{t=0}^{H-1}\gamma^t R^*(s_t,a_t,s_{t+1})\right].
\]

A one-shot text task is a degenerate case of this expression: the main action is generating an output sequence $y$, and the objective reduces to:

\[
y^*=\arg\max_y V^*(y\mid x).
\]

### 2.2 The Approximation Actually Used by an LLM System

A deployed LLM system does not directly possess the true environment. It relies on a set of approximate components:

\[
\mathcal{M}_\theta=
\left(
B_\theta,
\hat{\mathcal{T}}_\theta,
\hat{R}_\theta,
\pi_\theta,
r_\theta,
D,
\mathcal{A}_{\mathrm{sys}}
\right).
\]

| Component | Meaning |
|---|---|
| $B_\theta$ | belief / state estimator: how the system forms internal task state from observation history |
| $\hat{\mathcal{T}}_\theta$ | world model: how the system predicts action consequences |
| $\hat{R}_\theta$ | internal value judgment or proxy objective |
| $\pi_\theta$ | learned policy and token prior: which candidates are easier to generate |
| $r_\theta$ | capability / mode router: when to activate which knowledge, skill, role, or audit pattern |
| $D$ | decoding, planning, search, verification, and execution algorithm |
| $\mathcal{A}_{\mathrm{sys}}$ | the actions and interfaces the system can actually call |

The system is also shaped by external specifications and evaluators. Let $R_{\mathrm{proxy}}$ denote the proxy reward in training or product workflows, and $R_{\mathrm{eval}}$ denote the evaluation rule used at deployment. A failure can be understood as a causal mismatch between what the true task requires and one or more of these approximate components.

### 2.3 Mechanism Mismatch Profile

Let the eight components of severity be:

\[
\mathbf{m}=
(m_{\mathrm{spec}},m_{\mathrm{obs}},m_{\mathrm{belief}},m_{\mathrm{dyn}},
m_{\mathrm{act}},m_{\mathrm{support}},m_{\mathrm{route}},m_{\mathrm{search}}).
\]

This vector is not a score that must be estimated precisely in one pass. It is a diagnostic record. In practice, each component can be approximated by observing performance changes before and after interventions. If changing only one component substantially improves the result, that component is more likely to be a causal bottleneck.

---

## 3. The Eight Mechanism Mismatches

### 3.1 Specification / Reward Mismatch

#### Definition

The true task reward $R^*$, training proxy reward $R_{\mathrm{proxy}}$, model-internal value $\hat{R}_\theta$, and evaluation rule $R_{\mathrm{eval}}$ are inconsistent:

\[
\arg\max_y R_{\mathrm{proxy}}(y)
\ne
\arg\max_y R^*(y),
\]

or the evaluator selects a candidate that is not optimal under the user's true objective:

\[
\arg\max_y R_{\mathrm{eval}}(y)
\ne
\arg\max_y R^*(y).
\]

#### Core Question

The system is optimizing, auditing, or reporting the wrong objective.

#### Common Symptoms

- The user needs a deployable strategy, but the system optimizes benchmark excess return or a single offline metric.
- The user needs a simple script, but the system treats full engineering completeness as the primary goal.
- A reward model prefers linguistically robust answers, but this is not the same as factual correctness or task success.
- A proxy metric gradually replaces the true objective and produces Goodhart-style drift.
- The generator and evaluator share the same wrong assumption, so wrong candidates are selected consistently.

#### Diagnostic Experiment

Hold data, tools, model, and search budget fixed; change only the success criterion, scoring rubric, or candidate ranking rule. If the result changes substantially, prioritize specification / reward mismatch.

#### Typical Interventions

- Rewrite the task objective and non-negotiable constraints.
- Distinguish the true objective, proxy metric, and reporting metric.
- Modify the rubric, reward model, or acceptance tests.
- Add human preference and domain-expert audit.
- Replace single-metric maximization with multi-objective, constrained, or layered acceptance.

#### Boundary

If the objective is clear but the model missed it, the problem is belief / representation. If the objective is correctly understood but the policy almost never generates acceptable candidates, the problem is capability support.

### 3.2 Observation Availability Mismatch

#### Definition

Information required for choosing the correct action does not enter the system's observable space. This does not require recovering the complete true state; it only requires observations to contain the sufficient statistics needed for the decision.

If two states $s_1,s_2$ are indistinguishable under the current observation mechanism:

\[
\mathcal{O}(\cdot\mid s_1)=\mathcal{O}(\cdot\mid s_2),
\]

but their optimal actions differ:

\[
a^*(s_1)\ne a^*(s_2),
\]

then the system cannot solve the task reliably from the current observations alone.

#### Core Question

Necessary information was not seen.

#### Common Symptoms

- The user did not provide a key constraint, and the system cannot ask.
- Latest facts, dependency versions, files, or database records are unavailable.
- Transaction costs, slippage, order book depth, capacity, or institutional constraints are missing.
- The user's default scenario remains only in the user's head.
- The system only sees a summary and cannot access the raw evidence that determines the conclusion.

#### Diagnostic Experiment

Add context, retrieve sources, upload files, connect a database, or ask the minimal clarifying question. If results improve substantially without changing the reasoning method, observation availability is the main bottleneck.

#### Typical Interventions

- RAG, browser access, databases, and long-term memory.
- Files, logs, monitoring, and sensor access.
- Minimal sufficient clarifying questions.
- Explicit records of data timestamp, version, coverage, and missing fields.
- Convert unobservable variables into measurable proxies or explicit assumptions.

#### Boundary

"Not in context" is an observation mismatch. "In context, but not used correctly" is a belief / representation mismatch. Adding more irrelevant context may worsen the latter.

### 3.3 Belief / Representation Mismatch

#### Definition

Necessary information exists in the observation history, but the system does not parse, bind, compress, preserve, or retrieve it correctly. Let the ideal belief state be $B^*$. Then:

\[
B_\theta(s_t\mid o_{\le t})
\ne
B^*(s_t\mid o_{\le t}).
\]

"Belief" here does not require the model to output an explicit probability distribution. It refers to all internal task state that affects later decisions.

#### Core Question

The information was seen, but did not become a correct, stable, executable state representation.

#### Common Symptoms

- The system forgets earlier constraints in a long context.
- The user explicitly ruled out an option, but the system uses it later.
- A file contains the answer, but the system misses the key passage or binds entities incorrectly.
- Conditions, roles, dates, or units are misbound.
- Multi-turn task state drifts and completed items are executed again.
- The system mixes assumptions, facts, inferences, decisions, and open questions in one natural-language paragraph.

#### Diagnostic Experiment

Require the system to first extract constraints, list knowns and unknowns, build a state table, or create a structured intermediate representation before doing the original task. If the result improves without adding new facts, the failure is likely belief / representation mismatch.

#### Typical Interventions

- Constraint extraction and schema-structured input.
- External task state, memory, and provenance tracking.
- Chunked reading, entity binding, and timeline maintenance.
- Explicit separation of facts, assumptions, inferences, decisions, and open questions.
- Re-read sources before critical steps instead of relying on compressed language memory.

#### Boundary

If state representation is correct but the system still predicts action consequences incorrectly, the problem moves to dynamics / world model. If global structure collapses during generation, aggregation or search mismatch may also be involved.

### 3.4 Dynamics / World-Model Mismatch

#### Definition

The system's prediction of action consequences differs from the true state transition:

\[
\hat{\mathcal{T}}_\theta(s_{t+1}\mid s_t,a_t)
\ne
\mathcal{T}(s_{t+1}\mid s_t,a_t).
\]

#### Core Question

The system misjudges what its action will do in the real environment.

#### Common Symptoms

- Generated code or SQL fails at runtime.
- The system invents nonexistent APIs, parameters, permissions, or product behavior.
- Multi-step plans underestimate how early errors propagate.
- The system guesses user, market, compiler, or browser feedback from language priors alone.
- Offline simulation conclusions systematically diverge from deployment feedback.

#### Diagnostic Experiment

Ask the system to predict the result, then execute in the real environment and compare prediction error. If real feedback repeatedly refutes internal predictions, the main bottleneck is the world model rather than text expression.

#### Typical Interventions

- Run code, query the real database, and call real APIs.
- Unit tests, integration tests, backtests, sandboxes, and simulators.
- Predict-execute-compare-correct loops.
- Write environment feedback back into state, rather than merely reporting tool output.
- Build calibration sets and error bounds for key dynamics.

#### Boundary

If tools exist but predictions are wrong, it is a world-model problem. If there is no tool or permission to obtain feedback, it is an action / interface problem. The two often coexist, but their repair order differs.

### 3.5 Action / Interface Mismatch

#### Definition

The action required to complete the task is not in the system's actually available action space:

\[
a^*\notin\mathcal{A}_{\mathrm{sys}}.
\]

An action that nominally exists but cannot be called because of permissions, schema, latency, reliability, or process constraints also counts as an insufficient effective action space.

#### Core Question

The correct action is unavailable; the problem is not merely that the model failed to think of it.

#### Common Symptoms

- The task requires browsing, code execution, database queries, or file modification, but the system can only output text.
- The system needs to ask the user but is forced to answer in one shot.
- A tool exists, but its parameter schema cannot express the needed operation.
- Permissions, network access, rate limits, or irreversible-action gates block execution.
- The system can recommend but cannot verify, deploy, or observe the result.

#### Diagnostic Experiment

Open the minimal necessary tool, permission, or interaction round while keeping the model and prompt fixed. If the task changes from guessing to verifiable execution, the action space was the key bottleneck.

#### Typical Interventions

- Add tools, APIs, executors, and file read/write capability.
- Improve action schemas and error returns.
- Design recoverable and rollback-capable agent workflows.
- Allow clarification, authorization requests, and waiting for asynchronous results.
- Put irreversible actions behind explicit governance gates.

#### Boundary

Action / interface mismatch does not mean "more tools are always better." Tools expand the effective action space only when they can be correctly observed, selected, called, and verified. Otherwise they introduce new routing and search burdens.

### 3.6 Policy Prior / Capability Support Mismatch

#### Definition

The correct knowledge, operator, reasoning pattern, or candidate structure has too little probability under the effective support of the model policy:

\[
\pi_\theta(y^*\mid o)\approx 0,
\]

or under realistic budget $B$, the correct candidate is nearly unreachable:

\[
y^*\notin \operatorname{EffectiveSupport}_B(\pi_\theta).
\]

#### Core Question

The system did not merely fail to see information; it lacks sufficient knowledge, operators, or solution priors.

#### Common Symptoms

- The system repeatedly fails on long-tail domains, uncommon technology stacks, rare market mechanisms, or emerging research areas.
- Even with sufficient context and clear specification, the system does not generate the right type of candidate.
- Multiple samples produce similar errors rather than covering new high-value structures.
- The system can restate domain material but cannot perform domain-specific audit or construction.
- The correct solution requires a procedure, proof strategy, or professional workflow the model has not learned.

#### Diagnostic Experiment

Run multiple samples under sufficient specification, observation, state, and tools; then add examples, domain retrieval, an expert model, or a programmatic operator. If only the latter interventions work, capability support is insufficient.

#### Typical Interventions

- Few-shot examples, domain RAG, and structured knowledge bases.
- SFT, finetuning, curriculum data, and boundary-case training.
- Expert models, programmatic generators, and domain tools.
- Decompose complex capabilities into supervised and verifiable sub-capabilities.
- Evaluate support on the real task distribution, not only general benchmarks.

#### Boundary

Observation mismatch means "this task lacks information." Capability support mismatch means "even with the information, the model lacks the solution prior." If repeated sampling occasionally and stably produces the correct candidate, the problem is more likely search than support.

### 3.7 Fitting Boundary / Capability Routing Mismatch

#### Definition

The model has learned a capability, strategy, audit structure, or behavior pattern $X$, but the region where it actually triggers $X$, $M_X$, does not match the true region where $X$ applies, $T_X$:

\[
M_X\ne T_X.
\]

The two directions are:

\[
M_X\setminus T_X \quad \text{(over-triggering)},
\]

\[
T_X\setminus M_X \quad \text{(under-triggering)}.
\]

#### Core Question

The capability exists, but routing is wrong.

#### Common Symptoms

- The system routes an exploration task into risk-control or refusal mode.
- It treats an event strategy as a traditional factor strategy audit.
- It escalates a simple script task into large-system engineering.
- It enters "insufficient evidence / No-Go" mode when it should search for candidates.
- It enters user-premise-compliant continuation when it should strictly audit.
- The correct capability appears under other prompts or roles, but not in the current context.

#### Diagnostic Experiment

Add no new facts and change no tools. Change only task mode, role, positive and negative examples, routing rules, or generator-verifier division of labor. If the correct capability appears, the problem is mainly routing rather than capability absence.

#### Typical Interventions

- Explicit skill routers, mode switches, and phase state machines.
- Positive and negative examples for when to explore, audit, or refuse.
- Separate generator, verifier, executor, and governor roles.
- Neighborhood perturbation tests and confusion-matrix evaluation for capability boundaries.
- Train boundary cases for over-triggering, under-triggering, and neighboring tasks.
- Make routing decisions explainable, coverable, and revocable.

#### Boundary

Capability support mismatch means the correct capability is basically outside effective support. Routing mismatch requires that the capability already exists or approximately exists, but is not triggered in the right region. See [Fitting-Boundary Mismatch and Capability Routing](fitting-boundary-mismatch-capability-routing-llm-systems.md) for the fuller treatment.

### 3.8 Search / Execution Mismatch

#### Definition

The true objective, observations, belief state, world model, action space, capability support, and capability routing are all close enough to correct, but the current search and execution algorithm $D$ does not find or preserve the good candidate:

\[
y^*\in \operatorname{EffectiveSupport}_B(\pi_\theta),
\qquad
D(\pi_\theta,B)\ne y^*.
\]

#### Core Question

The correct path is reachable, but was not found, selected, preserved, or executed to completion.

#### Common Symptoms

- Greedy decoding is locked in by early tokens.
- A single answer is mediocre, but best-of-$N$ contains a high-quality answer.
- Local steps look reasonable, but global structure collapses through path dependence.
- After a wrong initial plan, later steps rationalize it.
- The candidate was generated, but the ranker, verifier, or executor chose the wrong one.
- Search covers single-variable variation but not the key combinations.

#### Diagnostic Experiment

Do not add data, change the specification, or add capability. Only add sampling, backtracking, candidate comparison, branch search, or an independent verifier. If the result improves substantially, the problem is likely search / execution mismatch.

#### Typical Interventions

- Best-of-$N$, self-consistency, and beam search.
- Plan-then-execute, generate-then-rank, and backtracking.
- Tree search, MCTS, and constrained combinatorial search.
- Independent critics / verifiers and multi-model cross-review.
- Preserve intermediate state, failed branches, and recoverable checkpoints.
- Allocate search budget to high-uncertainty and high-value branches.

#### Boundary

Expanding search only helps when the correct candidate is already in effective support, the evaluator can recognize it, and the execution environment can verify it. Otherwise, larger search only explores the wrong space more thoroughly.

---

## 4. Eight-Layer Summary Table

| Layer | Mechanism mismatch | Formal object | Core diagnostic | Preferred intervention |
|---:|---|---|---|---|
| 1 | Specification / reward | $R^*,R_{\mathrm{proxy}},\hat R_\theta,R_{\mathrm{eval}}$ | Is the system optimizing the wrong objective? | change objective, rubric, reward, acceptance standard |
| 2 | Observation availability | $\Omega,\mathcal O$ | Did decision-relevant information enter the system? | retrieval, data access, file upload, clarification |
| 3 | Belief / representation | $B_\theta$ | Did available information become the right task state? | state extraction, structured representation, external memory |
| 4 | Dynamics / world model | $\hat{\mathcal T}_\theta$ | Did the system mispredict action consequences? | real execution, tests, backtests, feedback calibration |
| 5 | Action / interface | $\mathcal A_{\mathrm{sys}}$ | Is the correct action callable? | tools, APIs, permissions, interaction workflow |
| 6 | Policy prior / capability support | $\pi_\theta$ | Is the correct solution in effective support? | examples, training, RAG, expert model, program |
| 7 | Fitting boundary / capability routing | $r_\theta,M_X,T_X$ | Is the capability triggered in the right situation? | routing, mode control, boundary training, role separation |
| 8 | Search / execution | $D(\pi_\theta,B)$ | Is a reachable candidate found and executed? | multi-sampling, backtracking, tree search, verifier |

---

## 5. Diagnostic Protocol

### 5.1 First Fix the Failure Instance

Before diagnosis, record the same reproducible task instance: input, available tools, model version, prompt, randomness, budget, actual output, and acceptance standard. Otherwise, differences between interventions may simply reflect task drift.

### 5.2 Check in Dependency Order

Ask in this order:

1. **Is the objective correct?** If the evaluation standard itself is wrong, downstream optimization only does the wrong thing more reliably.
2. **Is necessary information visible?** Unobservable problems should not be solved through language guessing.
3. **Is visible information represented correctly?** First confirm that constraints, entities, time, and state were not lost or misbound.
4. **Are action consequences verified against reality?** Guesses about code, markets, tools, and user reactions should connect to feedback early.
5. **Is the correct action available?** Without an execution interface, capability and search cannot turn into environment change.
6. **Is the correct capability in effective support?** Only after enough information and budget have been provided should capability be suspected.
7. **Is the capability routed correctly?** Use mode switches and boundary probes to distinguish "cannot do it" from "did not call it."
8. **Was it merely not searched or executed to completion?** Expanding search is most meaningful after the first seven conditions mostly hold.

This order is not a strict pipeline. In practice, low-cost probes can be run in parallel, but the system should not pour all budget into downstream search while upstream conditions are still unmet.

### 5.3 Use Minimal Interventions for Causal Distinction

Change one main component at a time and observe the result:

- change only the rubric;
- add only one key piece of information;
- add only structured state extraction;
- connect only one real execution feedback channel;
- open only one key tool;
- provide only domain examples;
- switch only task mode;
- add only search budget.

If several things change at once, the task may be repaired, but the real bottleneck remains unclear and the repair knowledge is hard to reuse.

### 5.4 Record Primary Cause, Secondary Causes, and Evidence

A useful diagnostic record:

```text
Failure instance:
True success criterion:
Primary mismatch:
Secondary mismatches:
Supporting evidence:
Minimal intervention:
Intervention result:
Remaining bottleneck:
Reusable control knowledge:
```

When evidence is insufficient, record "not distinguished" instead of forcing a classification. For example, a single-sample failure cannot distinguish capability support from search mismatch; it needs controls such as multi-sampling, example injection, or expert tools.

---

## 6. Commonly Confused Boundaries

### 6.1 Observation Availability vs. Belief / Representation

| Question | Observation availability mismatch | Belief / representation mismatch |
|---|---|---|
| Did necessary information enter context or tool returns? | No | Yes |
| Main fault | not seen | seen but not used correctly |
| Typical repair | add data, retrieval, clarification | state extraction, binding, memory, structure |

### 6.2 World Model vs. Action / Interface

| Question | World-model mismatch | Action / interface mismatch |
|---|---|---|
| Is a real feedback channel available? | usually available, but prediction and feedback disagree | unavailable or not effectively callable |
| Main fault | consequence prediction is wrong | correct action cannot be performed |
| Typical repair | execution and calibration | add tool, permission, schema |

### 6.3 Capability Support vs. Capability Routing vs. Search

| Question | Capability support mismatch | Capability routing mismatch | Search / execution mismatch |
|---|---|---|---|
| Does the correct capability or candidate exist? | basically outside effective support | exists, but trigger boundary is wrong | exists and is correctly activated |
| Key evidence | multi-sampling still lacks correct candidate; examples or training help | no new knowledge, only mode change improves | only more sampling, backtracking, or ranking improves |
| Main repair | add capability | change trigger conditions | expand search and execution control |

### 6.4 Specification vs. Evaluator Search Error

If an evaluator stably prefers the wrong objective, the problem is specification / reward mismatch. If the evaluation standard is correct but the evaluator makes noisy selections among finite candidates, the problem is closer to search / execution mismatch. These are especially easy to confuse when generator and evaluator share the same model.

---

## 7. Relationship to the Six Primitive Mismatches

The mechanism layer is not a replacement for the six primitive mismatches. A safer cross-map is:

| Six primitive mismatches | Common mechanism sources | Explanation |
|---|---|---|
| Aggregation mismatch | belief / representation, capability support, capability routing, search / execution | When global constraints cannot be recovered from local continuation, the system may need external state, specialized operators, or structured search |
| Support mismatch | observation availability, capability support, action / interface, search / execution | High-value structures may be unreachable because information, capability, or action is missing, or because search coverage is insufficient under budget |
| Specification mismatch | specification / reward, belief / representation | The objective itself may be wrong, or it may be written correctly but misread or forgotten by the system |
| State mismatch | observation availability, belief / representation, dynamics / world model | State may be unobservable, unstably estimated, or incorrectly modeled in transition |
| Fitting-boundary mismatch | capability routing, capability support, search / execution | The core mechanism is routing-boundary misalignment, sometimes amplified by low support and path lock-in |
| Observation-representation mismatch | observation availability, belief / representation, action / interface | Decisive variables may fail to enter observation, or enter without becoming operational representation; sometimes new tools, sensors, logs, tests, or raw-data interfaces are needed |

Therefore:

> The six primitive mismatches are task-value structural diagnostic axes; the eight mechanism mismatches are system-intervention diagnostic axes.

Using both layers gives a fuller diagnosis. For example, "state mismatch" says that a task depends on a latent state that was not stably identified; the mechanism layer further distinguishes whether the state was unobserved, incorrectly represented, or mispredicted through a world model. "Observation-representation mismatch" further asks whether the decisive variable failed to enter observation space, or entered but was not encoded into an operational control variable.

---

## 8. Compound Mismatches and Causal Chains

### 8.1 Why It Is Often Not a Single Layer

The eight components depend on one another: specification affects observation selection and evaluation; observation affects belief state; belief state affects routing and world-model use; the action interface determines whether feedback can be acquired; policy support and routing together shape the search space; and search results are selected by the evaluator.

A common causal chain is:

```text
wrong specification
→ wrong evidence and evaluation metrics selected
→ wrong capability mode activated
→ candidate space narrowed
→ search stably converges to the wrong answer
```

Another common chain is:

```text
key state unobservable
→ model fills it with a default prior
→ world-model prediction bias
→ tool-call plan wrong
→ execution failure misdiagnosed as lack of capability
```

### 8.2 Primary Causes and Amplifiers

During diagnosis, distinguish:

- **primary cause**: if removed, the failure no longer occurs stably;
- **necessary condition**: without it success is impossible, but it may not have caused the current error;
- **amplifier**: makes the error more stable and harder for search or feedback to correct;
- **downstream symptom**: induced by an upstream mismatch and should not be treated as the only root cause.

For example, narrow search may be the true bottleneck, or it may only be a downstream symptom of wrong routing. Only when routing is held fixed and search expansion alone improves the result is there good reason to mark search as the primary mechanism.

---

## 9. Financial Event-Strategy Example

Consider the failure analysis of a "limit-up / excitement event strategy." The system may prematurely judge the strategy undeployable and demand supposedly orthogonal data. A mechanism profile can be decomposed as:

| Mechanism layer | Case manifestation |
|---|---|
| Specification / reward | benchmark-excess is used instead of the true deployment objective for a long-only event strategy |
| Observation availability | missing intraday, theme, sector, order-book, and transaction-cost data may limit later identification |
| Belief / representation | "post-event attention continuation" is not represented as a trackable state |
| Dynamics / world model | next-day buyability and multi-day continuation are misestimated |
| Action / interface | no backtester or operator generator exists; the system can only make language judgments |
| Capability support | the candidate operator family is poor; event structures and conditional alpha priors are missing |
| Capability routing | the system incorrectly enters "insufficient data / anti-overfitting / No-Go" mode |
| Search / execution | only a few liquidity and consecutive-limit variables are tried; key filter combinations are not covered |

The main issue is not simply "not enough search." It is **wrong specification + wrong dynamics + wrong routing + narrow search**. A better intervention order is:

1. change the true objective to buyable next-day open, absolute net return, multi-day continuation, cost, slippage, and capacity audit;
2. verify buyability and holding-period assumptions using real data;
3. explicitly enter "mechanism-to-operator" mode and expand the operator family;
4. run combinatorial search under the corrected audit standard;
5. only then judge whether new data provides irreplaceable information gain.

This order avoids a common mistake: explaining every failure as "not enough data" and continuing to add data under the wrong objective and wrong mode.

---

## 10. Use Principles and Limits

### 10.1 Mechanism Names Are Not Evidence

Calling a failure "routing mismatch" does not prove that routing is the problem. Every judgment should be attached to a reproducible case, a controlled intervention, and an observed result change. Without intervention evidence, the classification is only a hypothesis.

### 10.2 One Intervention May Affect Several Layers

RAG may add observations and also add capability support through examples. Tool execution may expand action space and calibrate the world model. Structured prompting may repair belief state and also change capability routing. Therefore an intervention evaluation should state which intermediate variable it is expected to change, not only report the final score.

### 10.3 Larger Models Are Not a Universal Repair

Scaling the model may improve capability support, representation, and world modeling, but it does not automatically repair wrong specifications, unobservable states, missing permissions, or inappropriate evaluators. It may also strengthen wrong routing and make failure more fluent and stable.

### 10.4 Larger Search Is Not the Default Answer

When the objective, evaluator, or world model is wrong, more search optimizes the wrong object more thoroughly. When the action space is missing, search cannot create nonexistent interfaces. When the capability is outside effective support, multi-sampling repeats low-value variants.

### 10.5 The Mechanism Layer Should Enter the Governance Loop

A successful repair should not remain a prompt trick. The following should be stored as auditable and revocable governance objects:

- the failure pattern that triggered the diagnosis;
- applicability boundaries and counterexamples;
- the minimal intervention and its evidence;
- dependent data, tools, models, and versions;
- invalidation conditions and review date;
- the next-layer bottleneck exposed after repair.

In this way, the mechanism layer becomes not just a one-off explanation but a control language for continuous system improvement.

---

## 11. Final Compressed Version

The formal mechanism layer treats LLM tasks as approximate decision processes in partially observable environments. It does not rename failures by surface phenomenon. It localizes failures to eight intervenable components: **specification / reward, observation availability, belief / representation, dynamics / world model, action / interface, policy prior / capability support, fitting boundary / capability routing, and search / execution**. It forms a cross-diagnosis with the six primitive mismatches: primitive mismatches explain why task value separates from reachable generation; the mechanism layer decides whether to change the objective, add information, maintain state, connect real feedback, expand actions, add capability, change routing, or expand search.

In the shortest form:

> The primitive-mismatch layer explains structure; the mechanism layer chooses the scalpel.
