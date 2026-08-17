# Agent Harness Framework

## From the Model-Conditioned Capability Frontier and Runtime Bridging to Quantifiable Action-Space Optimization

**Status:** Working Draft v0.1
**Date:** 2026-07-27
**Abbreviation:** AHF
**Chinese rendering:** Agent Harness Framework; more precisely, "an agent capability realization and runtime harness framework"
**Related Documents:**

- [中文版本](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-harness-framework.zh-CN.md)
- [Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md)
- [State-Governed Agent Regime](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md)
- [Aggregation Mismatch and Compositional Governance in LLM Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.md)
- [Aggregation Mismatch: Derivable Claims, Proof Conditions, and Implications for Agent Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Aggregation Mismatch Artifact-v4: Experimental Evidence, Theory Gaps, and Agent Implications](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.md)
- [Patch vs. Full Rewrite: A Controlled Experiment on Sparse Repair Delivery](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.md)
- [Why Agent Engineering Must Take Controlled Experiments Seriously](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/why-agent-engineering-needs-controlled-experiments.md)
- *Towards Long-Horizon Agents: A Survey — Foundation, Evolution, Harness, Optimization, Application, and Frontier*

---

## Abstract

Long-range Agent research is moving from Prompt Engineering and Context Engineering into the Runtime Harness era, but current mainstream discussions still mainly stay at the level of component classification and empirical recipes: workflow, memory, tools, orchestration, Hooks, and Verification are continuously added to the system, and ultimately only one end-to-end score is used to judge "whether this Agent is better." This method can discover effective solutions, but it is difficult to answer more basic questions: Does the improvement come from the model, environment, tools, validators, or a certain Harness? Can different components be quantified independently? Why is a framework effective on a certain model but not effective on another model? Do more iterations produce structural progress, or are they just repeated sampling from the same conditional distribution?

Agent Harness Framework proposes a functional framework for capability attribution, runtime control, and experimental quantification. Under conditions of fixed task distribution, external capability base, budget and evaluation criteria, the base model determines a **model-conditioned capability frontier**: the best system performance that the model can achieve in the allowed runtime design space. The specific Agent Harness determines how far the actual system is from this frontier, as well as the probability, stability, cost, and risk of approaching the frontier. From this, the overall problem residual can be decomposed into the model conditional capability gap and the Harness capability realization gap.

This framework divides the minimal functional core of Agent Harness into two mutually orthogonal but highly complementary parts:

1. **Bridge**: Close the loop between model, environment, observation, verification, control increment and hard state, so that model output can become verifiable, committable and recoverable task progress. SGAR forms the forward state-commit bridge, and Audit Engineering forms the reverse failure writeback bridge.
2. **Action-Space Optimization (ASO)**: Under fixed model parameters, optimize the operation form, responsibility boundary, search neighborhood, submission range and candidate structure currently faced by the model, making a model call more likely to bring about a verified reduction in task residuals, rather than just generating another complete answer.

The framework further proposes a dual residual perspective: the system level measures how much capability residuals are left by the model and Harness respectively; the trajectory level measures whether each action truly reduces the unresolved task residuals. Through paired control experiments, full factorial designs, interaction term estimation, Shapley attribution, budget-success curves, and cross-model transfer experiments, Agent Engineering makes it possible to move from "proposing a Harness that looks valid" to "identifying, quantifying, and predicting the marginal contribution of each runtime mechanism." The current aggregation mismatch experiments around patch, rewrite, audit, boundary state, and operation interface are just the first step in Action-Space Optimization. If Bridge, state governance, auditing, verification, context, tool exposure, orchestration, and budget routing can all obtain independent, reproducible effect estimates, Agent Engineering will move from empirical engineering to scientific engineering.

---

## 1. Core proposition

The central proposition of the Agent Harness Framework is:

> **Under fixed task distribution, environment, tools, Oracle, budget and allowed runtime design space, the model determines the model-conditioned capability frontier; Agent Harness determines the probability, stability, cost and risk of this frontier being realized. **

Its minimum structure is:

```text
Agent Harness = Bridge × Action-Space Optimization
```

The multiplication sign here indicates complementarity, rather than simple numerical multiplication:

- Bridge allows task progress to be confirmed by environmental evidence, recognized by hard state, and inherited by subsequent steps;
- Action-Space Optimization allows the model to work in a more appropriate problem representation, operation neighborhood and responsibility boundary;
- Without any part, the value of the other part cannot be realized stably.

More fully:

> **Bridge makes progress possible; Action-Space Optimization makes worthwhile progress more likely to happen. **

---

## 2. Why a new Agent Harness perspective is needed

### 2.1 Current Harness research addresses "what" but not "why" it works

The mainstream formalization of long-range agents has moved away from "a longer model call":

\[
\mathrm{Agent}=\pi_\theta\oplus H
\]

Among them, \(\pi_\theta\) is the basic model strategy, and \(H\) is the Harness that closes the action–observation–memory loop around the model. Existing reviews usually divide Harness into:

- Loops and Workflows; 
- Context and Memory; 
- Tools, MCP, and Skills; 
- Orchestration; 
- Hooks and Middleware; 
- Verification.

This classification is very useful for describing system composition, but it is still a component classification, not a causal decomposition. Two agents can both have the above six types of components, but their performance is completely different; if a component is added and the end-to-end score increases, it does not mean that the mechanism through which it works is known.

Agent Harness Framework does not replace Harness taxonomy, but functionally reparameterizes it:

```text
Harness taxonomy: what components make up the system?
Agent Harness: through what basic mechanisms do those components change task success?
Quantification: how much does each mechanism contribute under fixed conditions?
```

### 2.2 Both "strong Harness can break through the upper limit of the model" and "the upper limit of model determination" need to be tightened

If Harness adds a search engine, a compiler, a solver, a database, an outside expert, or a new Oracle, it may indeed allow the system to do things that the model alone cannot. Therefore, the absolute upper limit of the system cannot be attributed to the bare model.

But if the external information, tools, environment, Oracle, and budget remain the same, and only the state governance, validation loop, action interface, output responsibility, and search structure are changed, then the main changes in this type of improvement are:

- Whether the model capabilities are activated correctly;
- Whether the correct partial results that have been generated are saved;
- Whether the failure signal is converted to the direction of the next round;
- Whether the model assumes unnecessary delivery of complete objects;
- Whether the system repeatedly samples within the same local basin.

Therefore, this framework strictly distinguishes between:

| Object | Function | Example |
|---|---|---|
| **External Capability Base** | Change what information and capabilities the system has | New tools, new data, new environments, new Oracles, external solvers |
| **Model Strategy** | Determines semantic judgment, candidate generation and the ability to utilize external capabilities | Basic model, inference model, post-training strategy |
| **Agent Harness** | Determine how existing capabilities are organized, verified, delivered, and efficiently realized | Bridge, Action-Space Optimization |

The residual attribution of "Model + Harness" is identifiable only when the external capability base is fixed.

### 2.3 The end-to-end score mixes different problems into one number

Current Current Agent experiments often report:

```text
Agent A: 62%
Agent B: 68%
```

But those 6 percentage points could come from an entirely different source:

-Models are stronger;
- More tools;
- The tool interface is more suitable for the model;
- Status is not lost;
- The validator is more relaxed;
- Easier output format;
- Allow more tokens or longer wall-clock;
- More retries;
- Harness is exactly overfitting for the benchmark.

If these sources cannot be dismantled, Agent Engineering can only constantly propose new experience frameworks and cannot form transferable, reproducible, and predictable engineering knowledge.

### 2.4 The key to long-range Agent is not the "number of iterations", but "whether the structure changes"

Many agents refer to the following process as self-improvement:

```text
generate
-> reflect
-> generate again
-> reflect again
-> generate again
```

But if the new round does not add information, does not change the hard state, does not change the action space, and does not change the model strategy, then it just continues sampling under the same conditional distribution. Sampling may still yield best-of-N gains, but there is no new source of structural progress.

Agent Harness is not concerned with "how many rounds have been run", but whether it has changed in each round:

\[
(I_t,\;S_t,\;\mathcal A_t,\;\pi_t)
\]

That is, at least one of information, authoritative state, action space, or model strategy.

---

## 3. Agent Harness is a multidimensional runtime property

A system might:

- State management is strong, but action space selection is poor;
- The action interface is excellent, but verification and submission are extremely weak;
- High success rate, but huge cost;
- High average performance, but unacceptable tail failure risk.

Therefore, Agent Harness should first be treated as a multidimensional runtime profile rather than a natural total score. Only after the utility function, budget, and risk weights are made explicit can it be compressed into a single objective.

---

## 4. System formalization

### 4.1 Basic objects

set up:

- \(D\): task distribution;
- \(X\): Fixed external capability base, including environment, tools, accessible data, Oracle and executors;
- \(b\): Budget, including tokens, wall-clock, tool calls, money and risk budget;
- \(\pi_\theta\): basic model strategy;
- \(\mathcal B\): Bridge;
- \(\Omega\): Action-Space Optimizer;
- \(J(D;\theta,X,\mathcal B,\Omega,b)\): The expected utility of the system on task distribution.

The minimum core of Agent Harness is recorded as:

\[
\mathcal H=(\mathcal B,\Omega)
\]

When fixing \(D,X,b\), the deployment system can be written as:

\[
\mathcal A_{\theta,\mathcal H}
=\pi_\theta\oplus\mathcal B\oplus\Omega
\]

### 4.2 Track status

To avoid mistaking contextual narratives for world states, distinguish:

- \(s_t\): real or potential environmental state;
- \(o_t\): The environment is exposed to the observation of the system;
- \(g_t\): governed hard state currently recognized by the system;
- \(c_t\): the context actually presented to the model;
- \(u_t\): model-facing operator selected by ASO;
- \(a_t\): The specific proposal submitted by the model under this operator;
- \(f_t\): Failure evidence, Audit Finding or unresolved obligation.

Action-Space Optimizer first selects which operation the current model should face:

\[
u_t=\Omega(g_t,f_t,b_t)
\]

The model then generates specific action parameters given the state and operator:

\[
a_t\sim\pi_\theta\big(a\mid\phi(g_t,o_{\le t},u_t)\big)
\]

Bridge is responsible for connecting the proposal to the environment and returning observations, verification results, status submission and new control signals:

\[
(o_{t+1},v_{t+1},g_{t+1},f_{t+1})
=\mathcal B(g_t,a_t,X)
\]

This forms a two-tier decision-making structure:

```text
Outer runtime policy Ω: choose what kind of work the model should do
Inner model policy πθ: generate the concrete semantic action within that work form
```

ASO does not require that it be implemented by another LLM. It can be a rule, a router, a statistical strategy, a learning strategy or a hybrid system.

---

## 5. Dual residual perspective

Agent Harness Framework uses two types of residuals simultaneously:

1. **System capability residual**: How far is a specific Agent from the reachable frontier;
2. **Execution Task Residual**: How many task obligations remain unresolved in a run.

The two answer respectively "Where is the system not strong enough" and "Does the current action really advance the mission?"

### 5.1 System capability residuals: Decomposition of model and Harness

Define the model-conditioned capability frontier under fixed \(D,X,b\) and the set of allowed Harness designs \(\mathfrak H\):

\[
C_\theta(D,X,b,\mathfrak H)
=
\sup_{\mathcal H\in\mathfrak H}
J(D;\theta,X,\mathcal H,b)
\]

It represents: the system frontier that can be achieved when the optimal Harness is selected under a given model and external capability base.

Redefine the ideal system frontier based on this external capability base:

\[
C^*(D,X,b,\mathfrak H)
=
\sup_{\pi,\mathcal H\in\mathfrak H}
J(D;\pi,X,\mathcal H,b)
\]

For a specific system \((\theta,\mathcal H)\), the total residual identity decomposition is:

\[
C^*-J(\theta,\mathcal H)
=
\underbrace{C^*-C_\theta}_{\text{Model conditional capability gap}}
+
\underbrace{C_\theta-J(\theta,\mathcal H)}_{\text{Harness capability fulfillment gap}}
\]

The point of this decomposition is not to claim that two quantities are directly observable, but to establish a clear attribution goal:

- **Model Condition Capability Gap**: The part that cannot be eliminated even if the best allowed Harness is selected for the current model;
- **Harness Capability Fulfillment Gap**: The model may have been able to do it, but there is no stable realization part during the current run.

### 5.2 Empirical frontier and lower bound

The true \(C_\theta\) is usually unknowable. Experiments can only form empirical frontiers on the tested Harness set \(\mathfrak H_{test}\):

\[
\widehat C_\theta
=
\max_{\mathcal H\in\mathfrak H_{test}}
\widehat J(\theta,\mathcal H)
\]

then:

\[
\widehat G_H(\theta,\mathcal H)
=
\widehat C_\theta-
\widehat J(\theta,\mathcal H)
\]

is the current empirical Harness gap in the tested space. When ignoring estimation error, it is only a lower bound on the true capability realization gap; new Harness may continue to improve the empirical frontier.

### 5.3 Harness leverage, Model leverage and complementary terms

Definable:

\[
L_H(\theta)
=
\max_{\mathcal H}\,J(\theta,\mathcal H)
-J(\theta,\mathcal H_0)
\]

Indicates how much additional capability the Harness can achieve relative to the baseline under a fixed model.

For fixed Harness:

\[
L_M(\mathcal H)
=
\max_\theta J(\theta,\mathcal H)
-
\min_\theta J(\theta,\mathcal H)
\]

Indicates the difference in capabilities caused by model changes.

There may be strong interactions between the model and Harness. Take the baseline model \(\theta_0\) and baseline Harness \(\mathcal H_0\) as examples:

\[
I_{M\times H}
=
J(\theta_1,\mathcal H_1)
-J(\theta_1,\mathcal H_0)
-J(\theta_0,\mathcal H_1)
+J(\theta_0,\mathcal H_0)
\]

If \(I_{M\times H}\neq0\), then "how much this Harness improves things" is not a model-independent constant. A given Harness may help weak models more, or it may only be exploitable by strong models.

### 5.4 Execution task residuals

Within a single run, define \(r_t\) as the current unresolved task residual. It does not have to be a single scalar, it can be:

- The set of executable constraints that failed;
- unmet specifications and interface obligations;
- Weighted collection of Audit Findings;
- Unresolved hypotheses and gaps in evidence;
- Partially ordered objects consisting of error states, regression risks and unfinished work.

If there is scalarization, it can be written as:

\[
\Delta r_t=r_t-r_{t+1}
\]

If a uniform scalar does not exist, use partial ordering:

\[
r_{t+1}\prec r_t
\]

Represents a new governed state that strictly reduces outstanding obligations subject to the protection constraints of non-regression.

Bridge decides whether this residual drop is evidenced and can be submitted; ASO decides what operator should be selected for the next call to be more likely to produce this drop.

---

## 6. Bridge: closed model, environment, verification and hard state

### 6.1 Definition

**Bridge is a runtime mechanism that connects probabilistic model outputs to the external environment with states, consequences, and acceptance rules. **

It's not just an API adapter, nor just stringing together several model calls. It is responsible for two conversions in opposite directions:

```text
forward: model proposal -> environmental consequence -> verification -> state commit
reverse: environmental failure -> evidence and localization -> control delta -> next-round constraint
```

### 6.2 Forward Bridge: from action to governed state transition

The minimum chain of forward Bridge is:

\[
g_t+A_t\rightarrow o_{t+1}\rightarrow v_{t+1}\rightarrow g_{t+1}
\]

It answers:

> Under what conditions can the actions proposed by the model be considered real task progress?

SGAR provides state authority in this direction: context can describe, remember, infer, and summarize states, but it cannot automatically become the final authority on states. The model can propose "task completed" and the system commits to a state transition only if external evidence and validation rules allow it.

Forward Bridge contains at least:

- current governed state;
- Preconditions for actions;
- Mapping of proposal to actual execution;
- Environmental observation;
- Validation rules;
- commit, reject, rollback or retry;
- provenance and recovery points.

### 6.3 Reverse Bridge: from failure to governed control delta

The fact that the environment returns "failed" does not mean that the Agent has obtained a valid direction. A low-bandwidth signal may only have:

```text
fail
score = 0.42
test failed
wrong answer
```

Reverse Bridge needs to convert failures into:

- where the failure occurred;
- Which assumption or constraint is disproven by the evidence;
- Should prompt, context, control space, data, tool, evaluator, renderer or human boundary be modified in the next round?
- which return obligation must be added;
- Whether the current hard state, allowed actions and acceptance thresholds need to be updated.

Audit Engineering forms the core mechanism of this direction:

\[
\text{failure}
\rightarrow
\text{evidence}
\rightarrow
\text{localization}
\rightarrow
\text{control delta}
\rightarrow
\text{regression obligation}
\]

If the audit only has comments but no control delta, no Bridge is formed; if no hard state or control object is written back, the same failure may still be repeated in the next round.

### 6.4 Bridge’s six functional dimensions

| Functional dimensions | Core issues | Typical failures |
|---|---|---|
| **State Authority** | What does the system currently accept as true? | Status drift, false completion, plans treated as progress |
| **Execution Fidelity** | Does the proposal change the environment according to the declaration semantics? | Parameter mistranslation, non-idempotent side effects, executor pollution |
| **Observation and Evidence** | Do consequences enter a verifiable representation? | Key changes are not visible, logs are lost, and observations are insufficient |
| **Verification and Gate** | What evidence is sufficient to allow submission? | False positives, false negatives, weak proxy targets, reward hacks |
| **Failure Write-back** | How to change the next round of control space if it fails? | Retry only, no positioning, free text feedback is diluted |
| **Recovery and Replay** | Is it possible to recover after interruption, failure and revocation? | Repeated work, damaged state, unable to reproduce the path |

### 6.5 Bridge’s core indicators

| Indicator | Meaning |
|---|---|
| `state_drift_rate` | How often the model's implicit state is inconsistent with the governed state |
| `false_completion_rate` | How often it is declared complete without passing a legal state transition |
| `transition_validity` | The proportion of submitted state transitions that meet the evidence and verification conditions |
| `proposal_effect_fidelity` | The consistency between proposal declaration semantics and actual environment changes |
| `failure_localization_rate` | The proportion of failures that can be localized to repairable objects |
| `actionable_delta_rate` | Audit Finding the proportion of Audit Findings that become executable control deltas |
| `regression_recurrence` | How often a recorded failure reoccurs in subsequent rounds |
| `recovery_success` | Can the operation be restored correctly based only on hard state and records |
| `replayability` | Can other executors replay and interpret the source of the current state |
| `bridge_cost` | The verification, storage and interaction costs required for each legal state transfer |

---

## 7. Action-Space Optimization: Optimize the problems faced by the model, not just the answers to the model

### 7.1 Definition

**Action-Space Optimization is the optimization of model-facing operators, action representations, operation scopes, responsibility assignments, search neighborhoods, and submission structures under fixed model parameters, making model calls more likely to produce proven task residual reductions. **

It is not traditional Policy Optimization.

Traditional Policy Optimization changes:

\[
\pi_\theta(a\mid s)
\rightarrow
\pi_{\theta'}(a\mid s)
\]

Action-Space Optimization changes:

\[
\mathcal A_t
\rightarrow
\widetilde{\mathcal A}_t
\]

That is, instead of changing the model parameters first, change what operations the model is currently required to complete.

### 7.2 Action interface is not a neutral output format

Even if the following operations have the same task information, they are not the same model problem:

- Generate complete objects from scratch;
- Audit existing objects;
- Output local patch;
- Output area rewriting;
- Commit boundary states, deterministically expanded by the program;
- Only the repair plan is given and applied by the executor;
- Multiple candidates are generated and selected by verifier;
- Commit step by step in dependency topology order.

They changed:

- How many fragile commitments the model needs to bear;
- Whether the correct area must be regenerated;
- whether non-local dependencies become observable in the complete candidate;
- Whether the output can be taken over by a deterministic executor;
- Verify whether it is a complete solution or residual computation;
- Whether errors can be localized;
- Whether the current search is restricted to an error basin.

Therefore, the Agent Runtime does not just select actions from a fixed set of actions. It can also determine:

> **Which problem will the next model call face? **

### 7.3 The goal of ASO is not to "maximize the correct rate of the current answer"

Many high-value actions do not immediately yield the final correct answer. For example:

- Obtain a key observation;
- Construct a counterexample;
- Expose a conflict between two constraints;
- Proving that the current route is not feasible;
- Commit a boundary state;
- Narrow the candidate space;
- Convert full generation to partial diagnostics.

Therefore, a more reasonable goal is to maximize the long-term, proven residual reduction:

\[
u_t^*
=
\arg\max_{u\in\mathcal U_t}
\Big[
\mathbb E\big(U(g_T)\mid g_t,u,\pi_\theta\big)
-\lambda C_{t:T}(u)
-\mu Risk_{t:T}(u)
\Big]
\]

When there is a suitable residual measure, it can also be written as:

\[
u_t^*
=
\arg\max_u
\Big[
\mathbb E(r_t-r_{t+1}\mid g_t,u,\pi_\theta)
-\lambda C(u)
-\mu Risk(u)
\Big]
\]

### 7.4 Seven basic dimensions of ASO

| Dimensions | Objects to be optimized | Examples |
|---|---|---|
| **Representation** | In what form the action is submitted | Free text, typed arguments, patch, AST operation, plan |
| **Scope** | How much area is covered by one action | token, span, function, module, chapter, full object |
| **Responsibility Split** | Which part is determined by the model and which part is executed by the program | The model is given to the edit plan, and the executor keeps the unchanged area |
| **Information Condition** | Under what completion and evidence conditions does the model work | No candidate, complete candidate, residual, boundary state, counterexample |
| **Search Topology** | Single track, branching, auditing, backtracking or rebuilding | linear, branching, audit-repair, variable-neighborhood search |
| **Dependency Order** | Actions occur according to what dependencies | topological order, frontier-based execution, deferred commit |
| **Commitment Policy** | Which actions can take effect directly | provisional, sandboxed, verified commit, human-gated |

### 7.5 Relationship with aggregation mismatch

Aggregation mismatch points out that local value does not guarantee the formation of global value under combined operations. ASO directly governs combination operations, commitment surfaces, and search neighborhoods.

For example, in sparse repair:

- full rewrite requires the model to re-assume the delivery of the complete object;
- patch only requires the model to express local differences;
- Deterministic executor can apply differences according to authoritative baseline and keep unmodified areas;
- global verifier before deciding whether to submit.

This is not simply "shorter output", but rewriting a complete object reconstruction problem into a partial operation submission problem.

### 7.6 Structural advantages are not equal to actual model benefits

Theory can demonstrate that certain interfaces have structural advantages, such as:

- The description length and commitment surface of sparse patches are smaller;
- Unmodified areas can be maintained by the actuator by construction;
- Complete candidates enable verification to be converted into residual computation;
- Enough boundary state can cut off some circular dependencies;
- Topological ordering can reduce unresolved predecessors.

But these facts do not follow automatically:

- The model must be easier to infer the correct patch plan;
- patch is better than rewrite under any edit density;
- candidate must help full rewrite;
- Audit must be easier than generation;
- The boundary state of the structure position must have more model benefits than the same amount of random correct information.

Therefore it is necessary to distinguish:

\[
\text{structural advantage}
\neq
\text{model-realized advantage}
\]

The task of ASO is not to formulate a dogma of "always patch" or "always audit" but to identify operation-interface crossovers under different models, lengths, couplings, candidate qualities, edit densities, and budgets.

### 7.7 Core indicators of ASO

| Indicator | Meaning |
|---|---|
| `plan_correct` | Whether the model identified the correct change or action plan |
| `delivery_correct_given_plan` | Whether the interface can be delivered accurately when the correct plan is known |
| `commitment_surface` | The number of fragile fields, positions, or references that the model must commit without errors |
| `edit_density` | The proportion of actual changes to the complete object |
| `collateral_regression` | How often local modifications cause degradation in untargeted areas |
| `verified_residual_reduction` | Verified residual reduction caused by one operator call |
| `success_at_budget` | Strict system success rate under fixed budget |
| `cost_at_target_success` | The minimum budget required to achieve the target success rate |
| `operator_crossover` | Advantage switching points of patch, regional rewrite, full rewrite, audit and other interfaces |
| `basin_escape_rate` | The rate of escape from repeated failure patterns after changing the operator |
| `format_and_execution_validity` | Whether the output can be strictly parsed and executed correctly |

---

## 8. Orthogonality and complementarity between Bridge and ASO

Bridge and ASO are not two names for the same problem.

| | ASO weak | ASO strong |
|---|---|---|
| **Bridge weak** | Roaming without anchor point: drift, repetition, false completion | Can produce high-value instant actions, but cannot stably verify, save and inherit |
| **Bridge Strong** | Stable but inefficient: Reliably implement wrong interfaces, stuck in the same local basin for a long time | Governable capability realization: High-value actions become verifiable and accumulable state progress |

### 8.1 Strong Bridge, Weak ASO

This type of Agent may have:

- Complete log;
- Clear checkpoint;
- Rigorous testing;
- Recoverable state;
- All actions can be audited.

But it still keeps asking for the model:

- Complete rewrite of objects that are basically correct;
- Work at error granularity;
- Redo what has been completed;
- Repeated generation without new information;
- Use local optimization to solve global combinatorial problems.

It becomes "reliably inefficient".

### 8.2 Strong ASO, weak Bridge

Such agents may enable the model to output correct patches, boundary states, or diagnostics, but:

- No authoritative baseline;
- The execution results are not verified;
- It is not known which changes have taken effect in the next round;
- Failure is not written back;
- Correct results may be overwritten by subsequent complete rewrites.

It continuously produces valuable momentary results but fails to generate sustained task progress.

### 8.3 Interaction terms cannot be ignored

Assume \(B_0,B_1\) is a weak/strong Bridge, \(O_0,O_1\) is a weak/strong ASO, then the interaction term is:

\[
I_{B\times O}
=
J(B_1,O_1)-J(B_1,O_0)-J(B_0,O_1)+J(B_0,O_0)
\]

If the interaction term is large, just reporting "how much Bridge improves" or "how much ASO improves" can be misleading. Quantification of Agent Harness must explicitly model interactions, rather than the default component effects being simply additive.

---

## 9. Structural iteration principle

### 9.1 Four types of variables that can really change the search status

Suppose the structural state of an Agent iteration is:

\[
Z_t=(I_t,g_t,\mathcal A_t,\pi_t)
\]

in:

- \(I_t\): available information, evidence and observations;
- \(g_t\): authoritative hard state;
- \(\mathcal A_t\): current model-facing action space;
- \(\pi_t\): model strategy.

if:

\[
I_{t+1}=I_t,\quad
 g_{t+1}=g_t,\quad
\mathcal A_{t+1}=\mathcal A_t,\quad
\pi_{t+1}=\pi_t
\]

Then the new round is basically still:

\[
y_{t+1}\sim
p_{\pi_t}(y\mid I_t,g_t,\mathcal A_t)
\]

That is, resampling under the same conditional distribution.

### 9.2 Structural change indicator

Definable:

\[
\chi_t
=
\mathbf 1[
\Delta I_t\neq0
\vee\Delta g_t\neq0
\vee\Delta\mathcal A_t\neq0
\vee\Delta\pi_t\neq0]
\]

- \(\chi_t=0\): Repeat the sampling round;
- \(\chi_t=1\): At least one structure variable has changed.

This does not mean that the iteration of \(\chi_t=1\) is necessarily valid, nor does it mean that \(\chi_t=0\) has no best-of-N gain at all. It only shows that without structural changes, the system does not acquire a new problem-solving mechanism.

### 9.3 Who is responsible for the four types of changes?

```text
Bridge: changes information I and governed state g
ASO: changes action space A
training, distillation, or model switching: changes policy π
```

This principle provides long-range agents with clearer continuation conditions than "try again":

> After a failure, the system should explain what information will be added in the next round, what state will be committed or undone, what operator will be changed, or why it is worthwhile to simply resample.

---

## 10. From Empirical Framework to Scientific Engineering: Quantitative Methods

### 10.1 What needs to be estimated is not a score, but a set of estimands

A complete Agent Harness experiment should at least distinguish:

1. End-to-end task effectiveness;
2. Strict success rate under fixed budget;
3. The cost required to achieve the target success rate;
4. Task residuals decrease during runtime;
5. Failure type and failure location;
6. Component main effect;
7. Component interaction effects;
8. Migration effects across models, tasks and budgets;
9. Different impacts on mean, variance and tail risk;
10. Improvement of the empirical frontier of model conditions.

### 10.2 Freezing principle in experiments

To quantify a certain Harness component, it must be as fixed as possible:

- Same task instance;
- The same input information;
- The same model and inference configuration;
- Same external tool as Oracle;
- Same candidate, wrong position or authoritative plan;
- Same budget;
- Same strict success criteria;
- The same pre-allocated sample will not be selected after the results;
- Not using best-of selection masks single-shot system reliability.

Only changes in the operator, Bridge mechanism, or state rules under study can explain the differences as effects of the corresponding components.

### 10.3 First dismantle plan, delivery, execution and verification

End-to-end success can be factored into:

\[
P(\text{success})
=
P(\text{plan correct})
\cdot
P(\text{delivery correct}\mid\text{plan correct})
\cdot
P(\text{execution correct}\mid\cdots)
\cdot
P(\text{verification and commit correct}\mid\cdots)
\]

If you do not remove these four layers:

- The model did not find the correct solution;
- The model found the solution but failed to deliver when completely rewritten;
- The executor incorrectly applied the correct patch;
- verifier incorrectly accepted the result;

will be confused as "Agent failed".

### 10.4 Two-factor experiment and Shapley attribution

Do \(2\times2\) experiments on Bridge and ASO, remember:

\[
J_{00}=J(B_0,O_0),\;
J_{10}=J(B_1,O_0),\;
J_{01}=J(B_0,O_1),\;
J_{11}=J(B_1,O_1)
\]

Then the mean order-independent Shapley imputation is:

\[
\phi_B
=
\frac12[(J_{10}-J_{00})+(J_{11}-J_{01})]
\]

\[
\phi_O
=
\frac12[(J_{01}-J_{00})+(J_{11}-J_{10})]
\]

and satisfy:

\[
\phi_B+\phi_O=J_{11}-J_{00}
\]

This is more robust than reporting only a single ablation under a fixed baseline because it averages out the order in which different components are added.

### 10.5 Full factorial design of Model × Bridge × ASO

A more complete design is:

\[
M\times B\times O
\]

can be written as:

\[
Y_{ijk}
=
\mu+\alpha_i+\beta_j+\gamma_k
+(\alpha\beta)_{ij}
+(\alpha\gamma)_{ik}
+(\beta\gamma)_{jk}
+(\alpha\beta\gamma)_{ijk}
+\epsilon
\]

It can answer:

- Whether a certain Bridge only helps weak models;
- Whether a certain ASO requires a strong model to be exploited;
- Whether a strong bridge amplifies or weakens the advantages of a certain action interface;
- Whether the model sorting will change with Harness design;
- How much of the so-called "model capability gap" is actually harness compatibility.

### 10.6 Recommended statistical units

- Use task instances instead of runs as the main inference unit;
- Aggregate within the instance first for repeated runs;
- Use paired difference, instance bootstrap or mixed-effects model;
- Use survival analysis or budget curves for time-to-success;
- Report confidence intervals for strictly binary successes, not just means;
- Report tail failure, worst quantile and recovery cost for high variance Agents;
- Explicitly report heterogeneity for cross-model and cross-task migration, instead of just pooled average.

### 10.7 Agent Harness Quantifying Maturity

| Levels | Features | What's Still Missing |
|---|---|---|
| **Q0 Experience Narrative** | "This framework feels better" | No freezing, no effect sizes, no attribution |
| **Q1 single component ablation** | The score drops after removing the component | Strong baseline dependence, unknown interaction |
| **Q2 Paired Control Experiment** | Same instance, same budget, only changing one mechanism | Still limited to a single model or single task |
| **Q3 factor and interaction experiment** | Model × Bridge × ASO, estimating main effects and interactions | Cross-domain rules have not yet been established |
| **Q4 migration curve and crossover law** | Can predict when patch, audit, rewrite, branching is better | Still need dynamic decision-making |
| **Q5 Adaptive Agent Harness Optimizer** | Online selection of mechanisms based on state, residuals and budget, validated on OOD | Near-learnable scientific runtime |

### 10.8 Criteria for scientific engineering

Agent Engineering moved from empirical engineering to scientific engineering not because more mathematical symbols were used, but because the following conditions were met:

1. **Steerability**: Components can be independently intervened;
2. **Identifiable**: The intervention does not simultaneously change key confounding variables;
3. **Measurability**: There are end-to-end and intermediate mechanism indicators;
4. **Reproducibility**: Reproducible under pre-allocated samples and strict protocols;
5. **Falvability**: Each claim has clear invalidation conditions;
6. **Interactive Visibility**: Do not forcibly classify nonlinear combinations as additions;
7. **Transferability**: Ability to explain or predict changes across models, tasks, and budgets;
8. **Decision Value**: Measurement results can change the actual operator, bridge or training selection.

---

## 11. Component-level quantitative map

### 11.1 Bridge sub-mechanism

| Submechanisms | Minimal intervention control | Primary outcome variables | Key confounders |
|---|---|---|---|
| Hard state authority | Only context state vs external authority state | drift, false completion, resume success | Is the state schema richer |
| Verified transition | Model self-report completion vs evidence gate submission | false accept, transition validity | verifier coverage |
| Audit localization | Free text reflection vs structured finding | localization, repair success, recurrence | Information bandwidth given to the model |
| Control write-back | Comment only vs update control object | Subsequent repetition failure rate | Whether the next round of prompts changes at the same time |
| Rollback/replay | Overwriting updates vs revocable commits | recovery, corruption, time-to-repair | Storage and executor capabilities |
| Observation shaping | Original log vs task-oriented evidence | Positioning rate, cost, omission rate | Whether the answer is leaked |
| Oracle routing | Single judge vs oracle ladder | false accept/reject, cost | Different Oracle goals are inconsistent |

### 11.2 ASO sub-mechanism

| Submechanisms | Minimal intervention control | Primary outcome variables | Key confounders |
|---|---|---|---|
| Patch vs rewrite | Same candidate, same plan, different submission interface | delivery, timeout, collateral error | edit density, length |
| Audit vs rewrite | Same candidates, same information, different operations | residual localization, completion | Output length and task definition change at the same time |
| Regional vs full scope | Same plan, different repair radius | regression, success, cost | Regional coupling degree |
| Plan + executor | Direct delivery of the model vs. deterministic execution after submitting the plan | delivery, format, execution fidelity | executor correctness |
| Boundary state | Complete construction vs compact state + expansion | success, state inference | Does compact state leak answers |
| Dependency order | Free order vs topology-aware order | unresolved frontier, rollback | ceiling effect |
| Branching | Single-track vs multiple candidate verification and submission | success, cost, provenance | verifier quality and additional budget |
| Stop/escalate | Fixed iteration vs no-progress routing | wasted budget, false stop | Whether difficulty estimate is calibrated |

---

## 12. Place of existing aggregation mismatch experiments in the framework

The current patch, rewrite, audit, boundary state and budget experiments are not proof of the entire Agent Harness Framework, but the first batch of controllable evidence in the direction of ASO.

### 12.1 Artifact-v3: Sparse repair delivery

In the frozen DeepSeek-V4-Flash sparse single-bit repair protocol:

| Condition | Patch | Full rewrite | Difference |
|---|---:|---:|---:|
| The model infers edit plan by itself, 300s | 228/480 (47.5%) | 124/480 (25.8%) | +21.7 pp |
| Same authoritative edit plan, 300s | 240/240 (100%) | 142/240 (59.2%) | +40.8 pp |
| Independent pre-allocated 900s subset | 83/120 (69.2%) | 52/120 (43.3%) | +25.8 pp |

The COPY control is 120/120, indicating that the results cannot simply be attributed to "the model cannot output long strings". A closer explanation is:

```text
read the edit plan
-> modify the correct location
-> preserve every other location
-> redeliver the full object exactly
```

Forming an independent delivery burden.

This set of experiments supports a conditional interface law: when the correct plan is known, modifications are sparse, the executors are correct, and delivery risk increases with the number of fragile commitments, a patch's smaller commitment surface can improve on-budget system reliability.

### 12.2 Artifact-v4: Structural advantages are not automatically converted into model benefits

Artifact-v4 shows up with shorter objects, five-bit fixes, and different operators:

- Complete construction without anchor: 13/54 (24.1%);
- full cut-set correct information: 53/54 (98.1%);
- Equivalent random position correct information: 54/54 (100%);
- compact boundary seed + executor: 21/54 (38.9%);
- Five bit candidate + rewrite: 7/54 (13.0%);
- Five bit candidate + patch: 8/54 (14.8%);
- Five bit candidate + audit: 54/54 (100%).

These results provide more important bounds:

1. Sufficient correct answer information strongly aids complete construction, but does not identify the additional benefit of the structural position itself relative to an equal amount of random correct positions;
2. Candidate will not automatically become a good scaffold for full rewrite;
3. The same candidate only has a huge completion advantage when it is connected to an audit operation with a matching structure;
4. The patch advantage of v3 is close to zero under the higher edit density and short object conditions of v4;
5. Larger budgets yield only partial, length-dependent recovery.

Therefore, the correct conclusion of the ASO is not:

```text
patch > rewrite
candidate > no candidate
audit > generation
```

Instead:

> **Model benefits depend on the match between information, operator, output responsibility, object length, edit density, dependency coupling and budget. **

### 12.3 What have these experiments shown?

They at least demonstrate that a long-neglected object in Agent Engineering deserves independent study:

> **The operation interface faced by the model itself is an experimental variable that can be manipulated, quantified, has huge effects, and is highly conditioned. **

The current job can therefore be viewed as:

```text
Agent Harness Framework
└── Action-Space Optimization
    └── Operation-interface experiments
        ├── patch vs rewrite
        ├── candidate + audit vs candidate + rewrite
        ├── boundary information
        ├── deterministic expansion
        └── budget × length × edit density
```

It is the first step in the system, not the end.

---

## 13. Relationship to existing engineering paradigms

| Paradigm | Main control objects | Core issues | Relationship with AHF |
|---|---|---|---|
| Prompt Engineering | instruction surface | How to express tasks? | Possibly changing the representation of ASO, or just elicitation |
| Context Engineering | model-visible information | What should the model see? | Bridge manages evidence entry and status writeback; ASO determines what information the current operator needs |
| Harness Engineering | runtime component set | What workflows, tools, memories, and validations does the system include? | AHF performs functional and causal reparameterization of Harness |
| Audit Engineering | failure localization and write-back | How does failure become control delta? | Reverse Bridge |
| SGAR | hard-state authority | What states are recognized by the system? | Forward Bridge and State Commitment Layer |
| Knowledge Governance | governed task knowledge | How is task knowledge externalized, verified, updated and revoked? | Provides control objects for Bridge and ASO |
| Mismatch Theory | value loss diagnosis | At which structural site is the value lost? | Provides diagnostics for Harness routing, not a peer component of Harness |
| Agentic RL | internalized policy optimization | How to change the model policy? | Change \(\pi\), distinguished from inference-time ASO, but can be internalized into each other |

### 13.1 Mapping of Harness component and runtime function

| Harness component | When used as an external ability base | When used as runtime design |
|---|---|---|
| Tools | Whether the tool exists and what it can do | Tool discovery, exposure, parameterization, authorization, execution and verification |
| Context | Whether the information source exists | Information selection, compression, evidentiaryization, and operator-specific rendering |
| Memory | Is there persistent storage | What becomes state, when it is written, how it is undone and retrieved |
| Workflow | Whether multi-step operation is possible | State transition, dependency sequence, loop closure and no-progress routing |
| Orchestration | Whether there are multiple execution principals | action-space decomposition, routing, parallelism, and aggregation strategies |
| Verification | Check capability exists | Oracle selection, gating, failure localization and commit authority |

This mapping illustrates that the same Harness component may contain both "Ability Base" and "runtime control" parts. Quantitative experiments must separate the two.

### 13.2 Relationship with six types of mismatch

The six types of mismatch are failure diagnosis layers; Bridge and ASO are runtime intervention layers.

```text
Mismatch diagnosis
-> mechanism target
-> Bridge / ASO intervention
-> verified state transition
```

In general:

- observation-representation and state mismatch require Bridge more directly;
- aggregation, support, and fitting-boundary are more commonly required for ASO;
- Specification mismatch will pollute both Bridge's verifier and ASO's target;
- Either mismatch may be partially mitigated by a combination of both.

Bridge and ASO are not Category 7 or 8 mismatches.

---

## 14. Boundaries and failure modes of Agent Harness

### 14.1 Strong Harness cannot create non-existent semantic discrimination ability

Agent Harness cannot produce truth out of thin air if the ability to distinguish between right and wrong does not exist in the model, tools, environment, data, and Oracle. It can:

- Reduce unnecessary commitments;
- Keep the correct area;
- Expose evidence of failure;
- Change the search neighborhood;
- Prevent submission without evidence;
- Let humans or external tools step in at the right place.

But it does not guarantee the generation of new solutions beyond the base of models and external capabilities.

### 14.2 Poor Harness design can institutionalize mistakes

- The error state schema will stably save the error abstraction;
- Error verifier will make the system more stable in optimizing error targets;
- Too narrow an action space will block high-value candidates;
- Too strong local patch constraints will prevent necessary global reconstruction;
- Excessive branching amplifies costs and provenance confusion;
- Excessive auditing will cause the system to be stuck in inspection without action;
- Excessively strict thresholds will increase false rejection;
- Fixed routes may be valid for one model but not for another model.

### 14.3 Agent Harness does not guarantee global optimality or monotonic convergence

Even if only the changes passed by verifier are submitted each time, it is possible:

- Stop at a non-zero local minimum;
- Accept global errors due to incomplete verifier;
- Monotonous progress in the wrong direction due to wrong specifications;
- Impossible to continue improving because the status indicates the loss of key variables;
- Unable to jump out of the current basin because the action space is too narrow.

The safest proposition is:

> Agent Harness improves task structure, state governability and capability fulfillment conditions; it is not equal to a global optimality guarantee.

### 14.4 Component effects are not fixed constants

The effect of a component may depend on:

- Model capabilities;
- Task distribution;
- object length;
- Edit density;
- Candidate quality;
- Oracle Bandwidth;
- Environmental reversibility;
- budget;
- Other Harness components.

Therefore, the goal of Agent Harness Science should not just be to get an average improvement, but to establish conditional effect curves and crossover laws.

---

## 15. Scientific research route of Agent Engineering

### Phase 1: Controlled Experiment of Action-Space Optimization

The current work is mainly at this stage:

- patch vs full rewrite;
- candidate-conditioned audit;
- compact state + deterministic executor;
- operation × output interface;
- edit density × length × budget;
- Plan correctness is separated from delivery correctness.

The goal is to demonstrate that action spaces are not fuzzy engineering intuitions but system variables that can be independently manipulated and quantified.

### Phase 2: Independent quantization of Bridge subcomponents

The next step can be to measure separately:

- The impact of hard state on state drift and false completion;
- The impact of Audit localization on repair success;
- The impact of control write-back on repeated failures;
- The impact of verifier gate on false acceptance and cost;
- The impact of rollback, replay, and checkpoint on recovery time;
- The impact of observation shaping on fault localization and context costs.

### Phase 3: Model × Bridge × ASO interaction matrix

The goal is no longer "which model is best" or "which Harness is best", but to establish:

```text
which model
with which Bridge
and which action geometry
under which budget
is most effective
for which class of task residual
```

This stage can reveal:

- Whether model ranking depends on Harness;
- whether weak models benefit more from strong structures;
- Whether strong models can take advantage of freer action space;
- Whether some Harness designs are just temporary compensation for model deficiencies;
- What mechanisms enable stable cross-model migration.

### Phase 4: Establish conditional rules and prediction models

Need to enter from static effect size:

- patch / regional rewrite / full rewrite crossover;
- audit/generation crossover;
- Budget rules for branch width and verifier quality;
- state granularity and recovery cost law;
-The relationship between oracle bandwidth and audit value;
- Pareto frontier between success rate, cost, variance and risk.

### Phase 5: Adaptive Agent Harness Optimizer

When component effects can be predicted, the Harness itself can become the object of runtime optimization:

```text
current governed state
+ residual profile
+ model identity
+ budget
+ oracle availability
-> choose Bridge intensity and model-facing operator
```

At this time, Agent Runtime no longer relies on a fixed experience process, but makes dynamic selections based on measured conditional effects.

### Phase 6: Internalize the verified Harness laws into the model

After external Harness produces high-quality, attributable trajectory and failure records, it can be further used to:

- SFT; 
- on-policy distillation; 
- agentic RL; 
- model routing; 
- harness-robust training; 
- learned state and action-space policies.

External Harness and internal model optimization thus form a closed loop, but the two should still remain distinguishable in experiments, otherwise it is impossible to know where the ability is internalized.

---

## 16. Added admission criteria for a new Harness axis

Bridge and ASO are the minimum functional cores currently proposed, and it is not claimed that they have exhausted all possible Agent Harness dimensions. If a third independent axis is proposed in the future, it should at least satisfy:

1. **Independent Control Object**: The object it governs cannot be fully described by Bridge or ASO;
2. **Independent Intervention**: Can be changed independently while keeping other variables fixed;
3. **Independent failure mode**: There is a type of system residual that cannot be naturally explained by the existing two axes;
4. **Measurable mechanism**: There are intermediate indicators, not just relying on end-to-end scores;
5. **Stable Effect**: Show reproducible conditional rules on multiple tasks or models;
6. **Non-implementation details**: It cannot be just the name of a specific tool, database, or multi-agent topology.

Until these standards are adopted, it is more appropriate to think of new mechanisms as subclasses of Bridge or ASO, lateral constraints, or external capability bases.

---

## 17. Proposition, level of evidence and revocation conditions

This article follows three types of evidence levels:

- **T: Conditional Theorem** — can be deduced from definitions, algebra, graph structures, or program semantics under explicit assumptions;
- **S: Structural Prediction** — The task structure is clearly changed, but the size of the model benefit requires experimentation;
- **E: Empirical Claim** — relies on specific models, tasks, budgets, and agreements.

### Proposition 1: Model conditional frontier decomposition (T)

Under fixed \(D,X,b,\mathfrak H\):

\[
C^*-J=(C^*-C_\theta)+(C_\theta-J)
\]

It is an identity decomposition by definition.

**Does not mean:** \(C_\theta\) is already observable, or the internal contribution of the model and Harness is naturally additive.

### Proposition 2: The empirical frontier only gives the lower bound (T) of the Harness gap

The maximum value of the tested configuration does not exceed the true reachability frontier, so the new Harness may still continue to improve performance.

**Revocation conditions:** If the empirical maximum value is mistakenly called the real absolute upper limit, the claim will be invalid.

### Proposition 3: Bridge and ASO are different functional bottlenecks (S)

Bridge governs actions to states and failures to control increments; the ASO governance model faces operators and search geometry. The system can be strong in one axis and weak in another.

**Cancellation conditions:** If it is proven in the future that the two can always be completely restored to each other through the same single control object, the independent axis needs to be modified.

### Proposition 4: Iterations without structural changes belong to identical distribution repeated sampling (T/S)

If the information, hard state, action space, and model strategy remain unchanged, no new structural solution mechanism is introduced into the system.

**Does not mean:** Repeated sampling has no best-of-N value.

### Proposition 5: There is no unconditionally optimal action interface (E/S)

v3/v4 results have shown that patch advantage depends on edit density, object length, budget and operation. Candidates also only produce stable returns when combined with matching operators.

**Withdrawal condition:** This proposition can be tightened if one interface is found to strictly dominate other interfaces over a sufficiently broad range of models and task distributions.

### Proposition 6: Component effects can be partially identified through controlled experiments (T/S)

Local causal effects can be obtained as long as components are manipulated, key confounds are frozen, outcomes are rigorously scored, and interactions are explicitly estimated.

**Does not mean:** Effects on a single benchmark will automatically hold across domains.

### Proposition 7: Agent Engineering can move from empirical engineering to scientific engineering (research program)

Agent design is no longer just an empirical recipe when component effects have repeatable estimates, interaction models, cross-domain condition regularities, and runtime decision-making value.

**Cancellation conditions:** If the components are highly inseparable, the experiment cannot be stably reproduced, the effect changes arbitrarily with the task, and there is no predictable structure, then scientificization can only stay in the local field.

---

## 18. Minimal Research Protocol

A research project consistent with the Agent Harness Framework should at least answer:

### 18.1 Attribution objects

- Is the model, external capability base, Bridge or ASO changed this time?
- Are there multiple objects changing at the same time?
- Is it possible to construct a minimal comparison?

### 18.2 Status and Residuals

- What is the current governed state?
- What evidence allows state transfer?
- How to express task residuals?
- How is the progress of an action confirmed?

### 18.3 Interfaces and Responsibilities

- How many fragile commitments does the model need to take?
- What steps can be completed by a deterministic executor?
- Why choose patch, audit, rewrite, branch or boundary state?
- What are the expected advantages and failure conditions of the current operator?

### 18.4 Experimental Control

- Do the input information, task instances, candidates, budgets and scorers match?
- Are samples pre-allocated?
- Do you differentiate between plan, delivery, execution and verification?
- Are interactions and heterogeneity reported?

### 18.5 Conclusion Boundaries

- What are the conclusions that can be derived from the theory?
- Which ones are just structural predictions?
- What are the model and protocol specific empirical conclusions?
- Which outcome would revoke the current claim?

---

## 19. Conclusion: From Harness Formula to Agent Science

The main contribution of the Agent Harness Framework is not to add another set of Agent components, but to change the problem form of Agent Engineering.

Old questions usually are:

```text
Which components should this Agent add?
Does this workflow look reasonable?
Would a few more rounds make it better?
Would switching to a stronger model solve it?
```

The new question is:

```text
After fixing the external capability base, where is the model-conditioned frontier?
How much Harness gap remains between the current system and that frontier?
Does the residual come from Bridge, ASO, the model, or their interaction?
Which operator is most likely to reduce verified residual under the current state, model, and budget?
Can this effect be reproduced by controlled experiments and predict to new tasks?
```

Its core framework can be compressed into:

\[
\boxed{
\text{Agent System}
=
\text{Model Policy}
\oplus
\text{Capability Substrate}
\oplus
\text{Bridge}
\oplus
\text{Action-Space Optimization}
}
\]

After fixing the Capability Substrate:

\[
\boxed{
\text{Observed Residual}
=
\text{Model-Conditioned Gap}
+
\text{Harness Realization Gap}
}
\]

And inside a single run:

\[
\boxed{
\text{ASO chooses the next problem form;}
\quad
\text{Bridge decides whether the result becomes progress.}
}
\]

Current operation-interface experiments around aggregation mismatch have proven that action space can become an independent, controllable, and quantifiable Agent engineering object. This is just the first step. If state governance, auditing, verification, recovery, context, tool interfaces, orchestration, budgeting, and security boundaries can all obtain independent effects, interaction effects, and migration rules in the same way, Agent Engineering will no longer rely primarily on the "empirical recipes of excellent engineers."

It will begin to take on the basic form of scientific engineering:

- Have a clear target;
- There are controllable variables;
- There is an intermediate mechanism;
- Effective magnitude and uncertainty;
- There is a falsifiable boundary;
- There are cross-model and cross-task rules;
- Able to predict and select the next system structure based on measurement results.

> **The next era of Agent Engineering is not just about building more complex Harness, but about building measurable science about the relationship between models, runtime mechanisms, and task residuals. **

---

## Appendix A: Symbol table

| Symbol | Meaning |
|---|---|
| \(D\) | Task distribution |
| \(X\) | External capability base: environment, tools, data, Oracle, executor |
| \(b\) | tokens, time, tool calls, money and risk budget |
| \(\pi_\theta\) | Basic model strategy |
| \(\mathcal B\) | Bridge |
| \(\Omega\) | Action-Space Optimizer |
| \(\mathcal H\) | Agent Harness,\((\mathcal B,\Omega)\) |
| \(s_t\) | Potential real environment state |
| \(o_t\) | Environmental Observation |
| \(g_t\) | governed hard state |
| \(c_t\) | Context sent to the model |
| \(u_t\) | model-facing operator |
| \(a_t\) | Proposal submitted by the model |
| \(f_t\) | failure evidence / audit finding / unresolved obligation |
| \(r_t\) | Current task residual |
| \(J\) | System expected utility |
| \(C_\theta\) | Model conditional capability frontier |
| \(C^*\) | The ideal system frontier on a given external capability base |

---

## Appendix B: Minimum 2×2×2 experimental matrix

| Model | Bridge | ASO | Usage |
|---|---|---|---|
| \(M_0\) | \(B_0\) | \(O_0\) | Full baseline |
| \(M_0\) | \(B_1\) | \(O_0\) | Bridge main effect on weak model |
| \(M_0\) | \(B_0\) | \(O_1\) | ASO main effect on weak model |
| \(M_0\) | \(B_1\) | \(O_1\) | Combination effects on weak models |
| \(M_1\) | \(B_0\) | \(O_0\) | Model improvement baseline |
| \(M_1\) | \(B_1\) | \(O_0\) | Bridge main effect on strong model |
| \(M_1\) | \(B_0\) | \(O_1\) | ASO main effect on strong model |
| \(M_1\) | \(B_1\) | \(O_1\) | Complete system and third-order interactions |

For each cell, at least:

- strict success; 
- cost / latency; 
- residual reduction; 
- failure class; 
- plan correctness; 
- delivery correctness; 
- verification outcome; 
- state transition validity; 
- instance-level uncertainty.

---

## Appendix C: One-page summary

```text
Problem:
End-to-end Agent scores mix model, tools, environment, state, interface, verification, and budget,
so Harness is reduced to an empirical recipe and component effects cannot be attributed.

Fixed conditions:
task distribution D + external capability base X + budget b + evaluation criterion

System:
Model πθ + Harness H
H = Bridge B + Action-Space Optimization Ω

Bridge: 
proposal -> execution -> observation -> verification -> state commit
failure -> evidence -> localization -> control delta -> write-back

ASO: 
choose the next operator, representation, scope, responsibility, and search neighborhood the model faces
the goal is to maximize verified task-residual reduction, not just improve the current answer accuracy

System residual:
C* - J = (C* - Cθ) + (Cθ - J)
          model-conditioned gap      Harness realization gap

Structural iteration:
Only when information, hard state, action space, or model policy changes
does an iteration gain a new structural source of problem solving; otherwise it is mainly repeated sampling.

Quantification:
paired controls -> factorial design -> interaction -> Shapley attribution
-> cross-model transfer -> budget/success curves -> adaptive harness routing

Goal:
Agent Engineering shifts from "proposing a framework that seems to work"
to "measuring when each mechanism works, how much it contributes, what it interacts with, and whether it transfers."
```

---

## References

1. Dong, Guanting, et al. *Towards Long-Horizon Agents: A Survey — Foundation, Evolution, Harness, Optimization, Application, and Frontier*. 2026.
2. Wang, Xinyun. [Audit Engineering: From Generation–Verification Asymmetry to General Agent Governance](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md).
3. Wang, Xinyun. [State-Governed Agent Regime](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md).
4. Wang, Xinyun. [Aggregation Mismatch and Compositional Governance in LLM Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.md).
5. Wang, Xinyun. [Aggregation Mismatch: Derivable Claims, Proof Conditions, and Implications for Agent Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.md).
6. Wang, Xinyun. [Aggregation Mismatch Artifact-v4: Experimental Evidence, Theory Gaps, and Agent Implications](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.md).
7. Wang, Xinyun. [Patch vs. Full Rewrite: A Controlled Experiment on Sparse Repair Delivery](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.md).
