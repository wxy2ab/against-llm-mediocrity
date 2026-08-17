# Aggregation Mismatch Across Scales

## From Single-Call Reasoning to Agent Trajectories

**Status:** Working Draft v0.1
**Date:** 2026-08-01
**Related Documents:**

- [Chinese version](./aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.zh-CN.md)
- [Aggregation Mismatch and Compositional Governance in LLM Systems](./aggregation-mismatch-compositional-governance-llm-systems.md)
- [State-Governed Agent Regime for Governed LLM Systems](./state-governed-agent-regime-for-governed-llm-systems.md)
- [Agent Harness Framework](./agent-harness-framework.md)
- [Oracle, Audit Agent, and SGAR](./oracle-classification-audit-agent-sgar-engine-routing.md)

---

## Abstract

Aggregation mismatch appears in sequential decision systems whose deployed procedure commits one local decision at a time without exact access to global value-to-go, while task value is determined mainly by the completed structure. Early decisions form prefixes and change the reachable future, so a choice preferred by the local proxy need not belong to a globally high-value solution. Autoregressive chain factorization can itself encode global dependencies exactly; the mismatch lies in the proxy, search, or commitment policy diverging from global completion value.

In LLM systems, aggregation mismatch appears at at least two scales:

1. **Single-call reasoning aggregation mismatch**: the model generates token by token and step by step, but task value is determined by the completed output sequence. Internal reasoning uses planning, candidates, comparison, backtracking, and verification to make local generation serve whole-output value as much as possible.
2. **Agent-trajectory aggregation mismatch**: an agent can execute only one action and complete one state transition at a time, but task value is determined by the full trajectory formed by repeated calls, tool execution, environment feedback, and state change. Plan, Candidate, Audit, Hard State, Patch, Rollback, and Replan are what keep local actions aligned with terminal value on a longer time horizon.

The two scales share the same basic contradiction, but they are not the same problem. Prefix lock-in inside a single reasoning pass is mainly **semantic**; path lock-in in an agent trajectory is additionally **causal, stateful, and partly irreversible**.

The central claim of this paper is:

> **Reasoning fights semantic prefix lock-in in output sequences; agents fight causal path lock-in in state trajectories.**

So strong reasoning models have not eliminated the need for Plan and Candidate in agents. Inside the model, Plan and Candidate are cognitive structures for the current reasoning pass. Inside the agent, Plan and Candidate are persistent global control objects and search frontiers that survive across calls, stages, and state transitions.

---

## 1. A Unified Definition of Aggregation Mismatch

Suppose the final artifact of a task is composed of a sequence of decisions:

\[
z=(d_1,d_2,\ldots,d_T)
\]

At step \(t\), the system can choose only the next local decision based on the current prefix:

\[
d_t \sim \pi(d_t\mid d_{<t},x)
\]

But task value is assigned to the full aggregate result:

\[
V(z)=V(d_1,d_2,\ldots,d_T)
\]

Let the proxy score used by the local decision-maker at step \(t\) be:

\[
q_t(d\mid d_{<t},x)
\]

And let the true global value attainable by choosing a local decision and then completing it optimally be:

\[
Q_t^*(d)
=
\sup_{d_{t+1:T}}
V(d_{<t},d,d_{t+1:T})
\]

Aggregation mismatch appears when the local ranking and the true value-to-go ranking disagree:

\[
\arg\max_d q_t(d)
\neq
\arg\max_d Q_t^*(d)
\]

### 1.1 Task Nonlocality Is Not System Mismatch Severity

Let `α_k` denote how well true utility can be approximated by bounded-complexity, window-`k`, locally additive functions. `α_k` contains no model, `q_t`, searcher, or commitment rule. It therefore measures **task local decomposability**; `1-α_k` is a task-nonlocality dose, not aggregation-mismatch severity.

Aggregation mismatch must be measured relative to the deployed system. Let `μ_eval` be a common evaluation-history distribution held fixed across systems. On a preregistered evaluation decision set `C_eval(h_t)`, define

\[
\hat d_t=\arg\max_{d\in C_{\mathrm{eval}}(h_t)}q_t(d\mid h_t),
\qquad
d_t^\star=\arg\max_{d\in C_{\mathrm{eval}}(h_t)}Q_t^\star(h_t,d).
\]

One may then report argmax disagreement

\[
e_{\mathrm{agg}}=\Pr_{h_t\sim\mu_{\mathrm{eval}}}[\hat d_t\ne d_t^\star]
\]

and global-completion-value regret

\[
\operatorname{Reg}_{\mathrm{agg}}=
\mathbb E_{h_t\sim\mu_{\mathrm{eval}}}
\left[Q_t^\star(h_t,d_t^\star)-Q_t^\star(h_t,\hat d_t)\right].
\]

`μ_eval`, `C_eval`, and tie-breaking should all be fixed before comparison. If `C_eval` contains only candidates available to both compared systems, the metric primarily isolates ranking and commitment quality. If it is the full feasible set, the metric also absorbs support and search failure and must be labeled accordingly. Replacing `μ_eval` with each system's own `μ_Π` instead measures on-policy aggregation burden and should be reported separately. A GF(2)-style task can have low task local decomposability while a system with externalized complete constraints has near-zero aggregation regret.

This is not merely the vague claim that "systems can make mistakes." It has four structural conditions:

1. **Sequential commitment**: the system cannot complete all decisions at once and must build the result step by step.
2. **Non-decomposable value**: full task value cannot be written exactly as a simple sum of local values.
3. **Prefix dependence**: committed decisions change the future option set and probability distribution.
4. **Early lock-in**: a wrong early choice is hard to fully repair later, and may permanently make high-value solutions unreachable.

So the essence of aggregation mismatch is not that "the model has no plan." It is that:

> **Local choices must be committed before the full future is known and before terminal value can be computed exactly.**

---

## 2. Aggregation Mismatch at the Single-Call Reasoning Level

### 2.1 Basic Form

For one LLM call, let the output be:

\[
y=(y_1,y_2,\ldots,y_T)
\]

The model generates token by token:

\[
y_t\sim p_\theta(y_t\mid x,y_{<t})
\]

But the task is evaluated on the complete sequence:

\[
J(y_1,\ldots,y_T)
\]

Autoregressive conditional probability must not itself be treated as a locality assumption. The chain rule

\[
p_\theta(y\mid x)=\prod_t p_\theta(y_t\mid x,y_{<t})
\]

can represent any joint distribution exactly, and each conditional may encode global constraints. Single-call aggregation mismatch instead compares a deployed local proxy $q_t$ with global completion value:

\[
Q_t^\star(d)=\sup_{y_{>t}}J(y_{<t},d,y_{>t}),
\qquad
\arg\max_d q_t(d)\ne\arg\max_d Q_t^\star(d).
\]

Here $q_t$ may combine approximate conditionals, greedy or truncated decoding scores, finite-search heuristics, and the current control state. Only when this ranking divergence combines with prefix lock-in does the local choice instantiate aggregation mismatch.

Single-call reasoning aggregation mismatch shows up as:

- early phrasing determining the later semantic basin of attraction,
- local fluency overwhelming global structure,
- the model committing too early to one explanation, solution path, or narrative line,
- later tokens mostly completing the existing prefix instead of searching again for a better full structure,
- full rewrites damaging already-correct high-value local structure, and
- a locally plausible reasoning step steering the full answer into the wrong direction.

### 2.2 What Reasoning Does

The value of reasoning is not just "producing more tokens." It is that before or during final answer generation, the model builds an internal search process:

```text
task understanding
→ internal plan
→ candidate hypotheses
→ local comparison
→ constraint checking
→ backtracking and revision
→ final output
```

It tries to upgrade generation governed by a deployed local proxy into choices that better approximate longer-range completion value. This changes approximation, search, and available control state, not the expressive capacity of autoregressive factorization.

So reasoning can be understood as:

> **the model's internal miniature search and governance layer for reducing single-output aggregation mismatch.**

It does not remove autoregressive generation, but it can let the model build a higher-level global representation before committing the final text, preserve several candidates, and compare completed candidates after the fact.

---

## 3. Main Ways to Counter Single-Call Reasoning Aggregation Mismatch

### 3.1 Global Plans and Control Structure

Before formal generation, one can construct:

- the task objective,
- the global structure,
- key constraints,
- dependency relations,
- invariants that must hold simultaneously, and
- the acceptance criteria for the final output.

The role of Plan is to compress full task value into a control structure that later local tokens can keep referencing:

\[
\text{Global Value}
\rightarrow
\text{Local Generation Constraints}
\]

For aggregation-heavy tasks such as stories, designs, code, and analysis, good artifacts usually depend on multiple cross-paragraph, cross-module, and cross-stage structures holding together at once. Building those structures first reduces the chance that local language probability pulls generation off course.

But Plan is not better simply because it is more detailed. Over-specification can freeze immature early judgment into a new local optimum. The better target is a **minimally sufficient Plan**: preserve the key structures that determine global value, while leaving room for local correction.

### 3.2 Candidate: Delay Premature Commitment

Single-path generation quickly creates semantic prefix lock-in. Candidate exists to preserve several possible full directions for a while:

```text
candidate structure A
candidate structure B
candidate structure C
```

Selection should happen on the basis of completed candidates, not the local feeling generated early in the sequence.

Useful candidates should not be mere paraphrases of the same idea. They should differ in key assumptions, structure, search space, or solution route. Their value is that they:

- prevent the first high-probability path from monopolizing later generation,
- let low-probability but high-value structures survive into the selection stage,
- give the evaluator completed candidates instead of only prefixes, and
- provide material for splitting, mutation, recombination, and local repair.

### 3.3 Separate Generation From Selection

The generator faces the problem "construct a complete artifact." The selector faces the problem "judge which already-complete artifact is better." These are different informational settings.

During generation, the model must satisfy many conjunctions at once. During selection, completed candidates already exist, so many errors and value differences become visible. So the preferred pattern is:

```text
Generate multiple complete candidates
→ Evaluate complete structures
→ Select / merge / repair
```

rather than collapsing to Top-1 early using a local score.

If selector and generator use the same information, the same context, and the same biases, they may remain highly correlated. A stronger selection process introduces:

- different evaluation perspectives,
- independent context,
- external rules or tests,
- counterexamples and evidence, and
- an explicit decomposition of task value.

### 3.4 Turn High-Aggregation Tasks Into a Sequence of Locally Solvable Tasks

Many hard generation problems are hard not because each local element is difficult, but because many local elements must all hold together inside one completed artifact.

So one can first build a control space and then render it in layers:

```text
global objective
→ structural skeleton
→ substructures
→ local content
→ complete artifact
```

This converts a task whose complete-sequence value is hard to optimize directly into a series of tasks with clearer local objectives and cheaper verification.

The key is not mechanical decomposition. Each intermediate object must carry real global constraints. Intermediate text that is never consumed or verified merely adds tokens; it does not change the search problem.

### 3.5 Auditing Complete Artifacts and Looking for Evidence

Generation relies on prefixes; auditing can inspect the full result. Whenever evaluating a completed artifact is easier than generating one directly, a generation-verification asymmetry exists.

Effective auditing includes:

- checking missing constraints against the global specification,
- looking for evidence for or against the current conclusion,
- constructing counterexamples,
- comparing structural differences between candidates,
- obtaining hard feedback from compilers, tests, or execution, and
- localizing failure into a structure that can be modified.

The value of audit does not come from "thinking again in another role." It comes from the fact that complete outputs, new evidence, or external feedback change the conditions under which judgment is made.

### 3.6 Artifactization and Patch-First Editing

When a completed artifact already contains a lot of correct structure, a full rewrite re-exposes every position to autoregressive sampling and puts already-correct parts at risk again.

The structural advantage of Patch is:

\[
\text{preserve verified structure}
+
\text{re-search only the mismatched local region}
\]

So for sparse-modification tasks, the preferred pattern is:

```text
persist the completed artifact
→ localize the defect
→ generate a local patch
→ verify the patch
```

rather than repeatedly rewriting the whole artifact.

Patch is not guaranteed to beat rewriting every time. When the global structure itself is wrong and local repair cannot recover consistency, a full restructure is needed. But when the correct structure already dominates and the change is sparse, Patch can greatly reduce structural loss caused by resampling.

### 3.7 Independent Branches, Mutation, and Recombination

Multiple candidates listed sequentially in one context often share prefixes and hidden assumptions. To truly widen search support, one needs:

- fresh-context independent branching,
- different assumptions or representation spaces,
- clustering and deduplication of candidates,
- extraction of reusable local structure from multiple candidates,
- mutation and recombination of high-value local structure, and
- a return to complete-task verification.

The value here is not just larger sample count. It is lower correlation between candidates and a higher probability of entering different semantic basins of attraction.

### 3.8 Typed Abstain and Stop

When the candidate set contains no sufficiently reliable solution, forcing the system to choose a legal candidate converts "I don't know" into wrong execution.

So systems should allow:

- `abstain`,
- `needs clarification`,
- `request evidence`,
- `defer`, and
- `escalate`.

Abstain is, in effect, a legal null action added to the search space so the interface does not force premature collapse.

---

## 4. Aggregation Mismatch at the Agent-Trajectory Level

### 4.1 Basic Form

The completed artifact of an agent is not a single text output but a trajectory interacting with the environment:

\[
\tau=(s_0,a_0,o_1,s_1,a_1,o_2,\ldots,s_T)
\]

where:

- \(s_t\): external state,
- \(a_t\): the current agent action,
- \(o_{t+1}\): tool or environment feedback, and
- \(U(\tau)\): the final value of the complete task trajectory.

At step \(t\), the agent must choose an action from the current history:

\[
a_t\sim\pi(a_t\mid h_t)
\]

But the truly optimal action depends on all later state transitions and future actions:

\[
Q^*(h_t,a)
=
\sup_{\pi_{t+1:T}}
\mathbb E[U(\tau)\mid h_t,a]
\]

Real agents cannot compute \(Q^*\) exactly, so they usually rely on visible local proxies:

- whether this step is complete,
- whether the current test passes,
- whether the current text looks reasonable,
- whether the action is easy, and
- whether the local metric improves.

So one may get:

\[
\arg\max_a \hat q_{\text{local}}(a\mid h_t)
\neq
\arg\max_a Q^*(h_t,a)
\]

That is **agent-trajectory aggregation mismatch**.

### 4.2 From Semantic Prefix Lock-In to Causal Path Lock-In

In a single reasoning pass, a bad prefix mainly changes the distribution of later tokens. In an agent, a bad action also changes the outside world:

- writing files,
- modifying state,
- consuming budget,
- triggering side effects,
- losing information,
- closing future paths, and
- forcing later stages to build on a wrong artifact.

So agent-trajectory aggregation mismatch adds three extra difficulties beyond single-call reasoning:

1. **Statefulness**: later decisions face the real state changed by the previous step.
2. **Causality**: an action is not just a text proposal; it produces real effects.
3. **Irreversibility**: some state transitions cannot be recovered by merely "thinking again."

Define the highest reachable value under the current history as:

\[
V_{\text{reachable}}(h_t)
=
\sup_{\tau\in\mathcal R(h_t)}U(\tau)
\]

A locally plausible action may drastically shrink the reachable future set:

\[
V_{\text{reachable}}(h_{t+1})
\ll
V_{\text{reachable}}(h_t)
\]

So at the agent level, countering aggregation mismatch is not just about improving the quality of the current action. It is also about:

> **keeping high-value futures reachable for as long as possible.**

---

## 5. Main Ways to Counter Agent-Trajectory Aggregation Mismatch

### 5.1 Persistent Global Plan: Keep Projecting Terminal Value Into Current Actions

An agent Plan is not just an outline for one call. It is a control object consumed by multiple future stages. At minimum it should preserve:

- the final goal and task contract,
- global invariants,
- the dependency graph of subtasks,
- stage order,
- acceptance criteria,
- unresolved uncertainty,
- resource and budget allocation,
- rollback layers, and
- completed structures that must not be damaged.

Its purpose is to make each action answer not only:

> What is easiest to do right now?

but:

> Which action best preserves a path toward a high-value ending?

Agents must keep "looking globally," but that does not mean rewriting the whole plan every step. The right pattern is:

```text
freeze the goal and key invariants
→ persist the current Plan
→ check at each step whether the local action still serves the whole
→ patch the Plan locally with new evidence
→ replan globally only when key assumptions fail
```

Plan should act as a single source of truth, so Planner, Executor, and Critic do not each maintain their own drifting version.

### 5.2 Persistent Candidate Frontier: Preserve Multiple Future Trajectories

In agents, Candidate is not just a few transient answers considered inside the current call. It is a persistent search frontier across steps:

- candidate plans,
- candidate hypotheses,
- candidate implementation routes,
- candidate recovery actions, and
- candidate completed artifacts.

The Candidate Frontier serves to:

- delay irreversible commitment,
- preserve multiple futures under uncertainty,
- allocate different tools and budgets to different routes,
- rerank routes after environmental feedback,
- eliminate falsified branches,
- switch basins when the current path is trapped in a local optimum, and
- recombine high-value local structure across branches.

The point of Candidate is not quantity for its own sake. It is whether candidates truly correspond to different reachable trajectories and can later be executed, verified, and updated independently.

### 5.3 Layered Global Look-Back

An agent should not look globally only once at the start, but it also should not fully replan after every action. A better structure is three control loops with different frequencies:

#### Action Loop

At every step, check:

- whether the action matches the current stage,
- whether it violates any global invariant,
- whether it creates authority or irreversibility risks, and
- whether more information must be acquired first.

#### Stage Loop

After each stage, check:

- whether the stage goal is actually complete,
- whether the output can be consumed by the next stage,
- whether Plan and Candidate Frontier need local updates, and
- whether the current route still keeps high-value futures reachable.

#### Mission Loop

Only replan globally when one of the following happens:

- a key assumption is falsified,
- the environment changes materially,
- the current route stalls repeatedly,
- the candidate frontier is exhausted, or
- the global acceptance criteria cannot be met by the current structure.

So the precise meaning of "keep looking globally" is:

> **let global goals keep participating in local judgment, rather than repeatedly rewriting the whole global plan.**

### 5.4 Hard State: Make Actions Operate on Explicit State

If an agent's "state" is only a soft declaration inside natural-language context, the model can reinterpret it at any time:

- which stage it is in,
- which work has already been completed,
- which actions are allowed, and
- which constraints are still in force.

Hard State externalizes those facts into environmental constraints:

- a stage state machine,
- an action allowlist,
- verifiable state transitions,
- `commit` / `rollback` / `replay`,
- authority boundaries, and
- completion and failure states.

This turns an action from "the model says it did something" into a controlled transition over real state.

Hard State is not what directly finds the global optimum. Its role is to prevent:

- state drift,
- role confusion,
- stage oscillation,
- repeated rework of already-finished tasks, and
- local actions from damaging the global execution boundary.

### 5.5 Execute-Observe: Use Real Environmental Feedback to Correct the Trajectory

The model can predict tool outcomes, but prediction is not execution. Agent-level aggregation mismatch can be corrected only through a real closed loop:

```text
choose an action
→ execute it
→ observe environmental change
→ obtain new evidence
→ update Plan and Candidate
```

High-value feedback includes:

- compiler output,
- `pytest`,
- runtime errors,
- SQL execution results,
- file diffs,
- numeric metrics,
- permission denials, and
- external system state.

Real feedback lets the agent discover whether a locally successful-looking action truly increased complete task value.

### 5.6 Global Audit: Distinguish Local Success From Real Task Progress

Agents easily mistake the following for global progress:

- the current step was executed,
- the current output is well formatted,
- some local test passed,
- a local metric improved a bit, and
- more text or code was produced.

The job of Audit is to check:

- whether the local artifact satisfies the global specification,
- whether the current action damages later dependencies,
- whether the current "success" is only a proxy-metric improvement,
- whether important constraints remain uncovered,
- whether the current path is oscillating inside a local optimum, and
- whether new evidence requires changing Plan or reranking Candidates.

Effective audit should obtain information that was not available during generation: the complete result, environmental witnesses, counterexamples, test diffs, or reproducible evidence. Otherwise, "self-critique" using the same model and same information may be only extra reasoning, not genuine trajectory adjudication.

### 5.7 Artifacts, Versions, and Local Patch

The core state of a long-horizon agent should be persisted as artifacts rather than living only in conversation context:

- Plan,
- code,
- documents,
- candidates,
- an evidence ledger,
- acceptance records, and
- the current state snapshot.

Then one should prefer local patching:

```text
existing artifact
→ localize the mismatch
→ modify locally
→ verify
→ commit
```

This:

- preserves verified structure,
- reduces drift from full rewrites,
- supports diff, audit, and rollback,
- lets multiple stages share the same real state, and
- gives failure localization and repair a clear boundary.

### 5.8 Branch, Rollback, and Replan

To fight causal path lock-in, agents need mechanisms for restoring reachability:

- **Branch**: preserve multiple state branches under uncertainty;
- **Rollback**: undo a state transition that created negative value;
- **Patch**: repair locally without damaging the rest of the structure;
- **Replan**: reconstruct the global route after key assumptions fail; and
- **Stop**: stop causing further damage when no safe high-value action exists.

These correspond to backtracking in single-call reasoning, but they are stronger because they must handle real environmental state rather than merely regenerate text.

### 5.9 Budgeted Search and Candidate Portfolio Management

Infinite candidates and infinite replanning let coordination cost swallow the benefit. Agents should treat search as a budget-constrained portfolio management problem:

- allocate exploration budget to candidates with high uncertainty and high upside,
- eliminate duplicate or low-upper-bound branches,
- increase verification budget for key candidates,
- stop expanding when marginal information gain drops, and
- allocate resources dynamically between exploration and exploitation.

The goal is not exhaustive global search. It is to increase the probability of reaching a higher-value region under finite cost.

### 5.10 Typed Failure, Abstain, and Escalation

When the agent cannot determine the current state, lacks a necessary capability, or finds all candidates unreliable, continuing to act converts uncertainty into real loss.

So the agent interface must support:

- `typed abstain`,
- `needs clarification`,
- `missing capability`,
- `evidence required`,
- `retryable failure`,
- `unrecoverable failure`, and
- `human escalation`.

These states give the agent a legal way to "not commit a path yet," reducing causal trajectory lock-in caused by a forced interface.

---

## 6. Structural Homology and Difference Between the Two Levels

| Primitive | Single-call reasoning function | Agent-trajectory function |
|---|---|---|
| Plan | Cognitive planning inside the current call | A control plane that persists across calls and stages |
| Candidate | Temporarily consider multiple answers in the current reasoning pass | A persistent trajectory search frontier that can be executed independently |
| Verify | Semantic checking on the complete output | Read real execution, environment state, and outside evidence |
| Backtrack | Regenerate earlier text or change the reasoning route | Roll back real state, switch branches, or replan |
| Patch | Repair part of the current output | Modify a persistent artifact while preserving verified state |
| Stop / Abstain | Do not force a low-confidence answer | Do not execute an action that may cause real side effects |
| Final selection | Choose a complete output | Commit a trajectory that changes the reachable future |

The shared structure is:

```text
local sequential decisions
+
whole-structure value
+
prefix dependence
+
early lock-in
```

The core difference is:

```text
single-call reasoning: semantic prefix lock-in
agent trajectory: causal path lock-in
```

So this is a form of **multi-scale aggregation mismatch**: the same local-global contradiction recurs at the level of tokens, outputs, calls, actions, stages, and full task trajectories.

---

## 7. When Plan and Candidate Are Not Just Duplicate Reasoning

Strong reasoning models already plan, enumerate candidates, and reflect. So adding external agent stages with the same names can indeed become redundant. But the standard should not be "did the model already think about this?" It should be whether the external structure performs a new global function.

### 7.1 Conditions Under Which Plan Has Independent Value

As long as Plan satisfies any of the following, it is more than a reasoning trace:

1. it is consumed by two or more later stages;
2. it constrains action order, authority, or budget;
3. it is persisted and supports local patching;
4. it defines stage exit conditions and global acceptance criteria;
5. it supports rollback and replan localization;
6. it is updated continuously by new evidence; or
7. it becomes a shared single source of truth across components.

If Plan is generated once and never referenced again, does not constrain state transitions, and does not participate in acceptance, it is probably only a repeated explanation.

### 7.2 Conditions Under Which Candidate Has Independent Value

A Candidate stage needs the following:

1. candidates differ structurally rather than by paraphrase,
2. candidates are stored independently,
3. candidates can receive different execution or evidence,
4. candidates can later be reranked, discarded, or restored,
5. candidates affect resource allocation and route choice, and
6. selection happens after a complete result or new evidence appears.

If the same model lists five similar candidates in the same context, then immediately chooses the first one, and the others are never executed, verified, or reused, that Candidate stage is mostly extra tokens.

### 7.3 Precise Conclusion

> **Plan and Candidate inside the model are proposals; Plan and Candidate inside the agent are a control plane and a search frontier.**

Agents should not mechanically repeat reasoning. They should upgrade the temporary structures produced by reasoning into system objects that are:

- persistent,
- shareable,
- verifiable,
- locally editable,
- able to control state transitions,
- able to absorb later evidence, and
- able to support branching and rollback.

---

## 8. A Unified Control Stack for Aggregation Mismatch

The two levels can be placed in one unified stack:

```text
                     final task value / mission contract
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
              persistent Plan graph         Candidate frontier
                 │                                 │
                 └──────────────┬──────────────────┘
                                │ choose current path
                         local action contract
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
          native reasoning              tools and environment state
      plan / candidate / compare                  │
                 │                                │
                 └──────────────┬─────────────────┘
                                │
                         Execute → Observe
                                │
                   Verify / Audit / Evidence
                                │
             Patch / Branch / Rollback / Replan / Stop
                                │
              update Plan, Candidate, and Hard State
                                └──────────────↺
```

The division of labor between model and agent can then be stated as:

> **The model generates and revises global structure; the agent keeps that global structure effective inside a real trajectory.**

More concretely:

```text
Reasoning generates a local Plan
The agent persists, verifies, and executes that Plan

Reasoning proposes Candidates
The agent isolates, schedules, verifies, and adjudicates those Candidates
```

---

## 9. Five Basic Intervention Families for Aggregation Mismatch

Many concrete methods exist, but they fall into five basic directions.

### 9.1 Globalize: Project Global Value Into Local Decisions

Methods:

- Plan,
- Contract,
- global invariants,
- stage dependencies,
- complete-output evaluation, and
- periodic global look-back.

The goal is to reduce cases where local actions obey only immediate fluency or short-term proxy metrics.

### 9.2 Preserve Options: Keep Multiple Futures Alive

Methods:

- Candidate,
- Branch,
- Top-K shortlist,
- delayed commitment,
- Abstain, and
- candidate mutation and recombination.

The goal is to prevent premature single-path collapse and preserve reachability of high-value futures.

### 9.3 Externalize State: Put Critical Structure Outside the Model

Methods:

- Artifact,
- Hard State,
- Plan Graph,
- Evidence Ledger,
- Version, and
- commit history.

The goal is to prevent global structure from existing only in drift-prone context and model memory.

### 9.4 Close the Loop: Bring in Real Feedback

Methods:

- Execute-Observe,
- compilers and tests,
- outside evidence,
- Audit,
- counterfactual measurement, and
- verifiers.

The goal is to let the system revise path value based on real outcomes rather than model imagination.

### 9.5 Restore Reachability: Recover Solution Space Compressed by Wrong Actions

Methods:

- Patch,
- Rollback,
- Rebranch,
- Replan,
- typed failure, and
- Stop.

The goal is to restore high-value paths after local mistakes instead of making later steps keep completing a wrong prefix.

---

## 10. Relationship to the Current Routing Reliability Experiments

The current RR experiments are not a direct proof of the full theory of multi-scale aggregation mismatch, but they provide several consistent local signals.

### 10.1 Redundant Stages Do Not Automatically Create Global Value

In RR4, adding extra route, compile, and repeated invoke steps increased the action count from 1 to 4, but task success did not improve. This suggests:

> If an extra stage does not introduce new state, information, candidate paths, or verification ability, it is likely only repeated orchestration.

### 10.2 Candidate Frontier Can Beat Premature Top-1 Collapse

In CSP-1, a Top-5 shortlist preserved task success on the current fixture while greatly reducing picker tokens; direct ranker Top-1 was clearly worse. That is consistent with the mechanism:

> Preserve a minimally sufficient candidate frontier first, then select on the basis of complete candidates, rather than collapsing immediately under a weak local score.

### 10.3 Typed Abstain Prevents Forced Wrong Commitment

In `P0-A-ood`, allowing typed abstain greatly reduced execution of wrong-but-legal Skills. That shows that "there is no correct answer in the candidate set" must be represented as a first-class state rather than forcing the system to choose one wrong path.

### 10.4 Local Proxy Scores Cannot Carry Global Judgment by Themselves

In `CSP-2` and `CSP-2R`, the BM25 score/margin Top-1 route did not pass its preregistered gate. Even if no errors were seen yet in some released samples, coverage and statistical boundaries still did not justify production gating.

That is exactly what aggregation mismatch predicts:

> A local retrieval score or margin need not equal full task-trajectory value.

These results should be treated as mechanistic anchor points, not as a full theory proof extrapolated from a small fixture.

---

## 11. How to Validate the Two Levels Empirically

### 11.1 Experiments at the Single-Call Reasoning Level

A fair comparison must control total compute budget. At minimum it should include:

```text
R0: native reasoning, standard budget
R1: native reasoning, budget increased to match the scaffold
P1: explicit Plan
C1: same-context Candidate
C2: fresh-context independent Candidate
V1: post-hoc selection over complete candidates
A1: external verifier / audit
D1: Artifact + Patch
```

Key metrics include:

- complete task value,
- global-constraint preservation rate,
- structural diversity of candidates,
- wrong-prefix recovery rate,
- Patch preservation rate for already-correct structure, and
- token, latency, and call cost.

The most important comparison is not "short answer vs multi-stage agent." It is:

\[
\text{external structure}
\quad vs \quad
\text{budget-matched native reasoning}
\]

Only when the former still improves task value can we claim structural gain rather than merely more compute.

### 11.2 Experiments at the Agent-Trajectory Level

At minimum compare:

```text
no persistent Plan
vs persistent Plan

single path
vs Candidate Frontier

local checks only
vs layered global look-back

full rewrite
vs Artifact + Patch

no rollback
vs Rollback / Branch

soft state
vs Hard State
```

These experiments must execute in a real environment and record:

- final task value,
- the gap between local success rate and final success rate,
- irreversible error rate,
- plan drift,
- state oscillation,
- candidate collapse,
- rollback count,
- reached-dead-end rate, and
- token, latency, tool-call, and coordination cost.

They should also be clustered by action, stage, and task family rather than treating multiple runs of the same task as independent samples.

### 11.3 A Key New Metric: Reachable-Value Preservation

The goal of fighting trajectory-level aggregation mismatch should not be judged only by whether the current action succeeds. It should also estimate:

> After the current action, is a high-value ending still reachable?

The true \(V_{\text{reachable}}\) is hard to observe directly, but one can approximate it using:

- whether key invariants were broken,
- whether other candidate paths were closed,
- whether irreversible side effects were introduced,
- whether a full redo is now required,
- whether at least one candidate can still pass the terminal verifier, and
- whether failure can still be recovered by Patch or Rollback.

This is much closer to agent-level global value than merely recording that "the current step finished."

---

## 12. Design Principles

### Principle 1: Global Function Matters More Than Stage Names

You cannot assume a component is useful just because it is called Planner, Critic, or Candidate Generator. Check whether it really changes:

- global constraints,
- the search frontier,
- outside state,
- feedback information, or
- recoverability.

### Principle 2: Minimally Sufficient Plan, Not Maximal Plan

Plan must cover global dependencies and acceptance boundaries, but it should not freeze all local detail. Overplanning creates plan rigidity and lets early mistakes propagate across the whole trajectory.

### Principle 3: Minimally Sufficient Candidate Frontier

More candidates are not automatically better. Under the requirement of necessary recall, structural diversity, and future reachability, candidate set size and coordination cost should still be compressed.

### Principle 4: Local Execution, Global Governance

The model may focus on the current local task, but the agent control plane must keep maintaining:

- the global objective,
- the current stage,
- the candidate frontier,
- global invariants,
- terminal acceptance, and
- rollback-capable state.

### Principle 5: Do Not Rewrite the Whole Global Structure Every Step

Global structure should keep participating in judgment, but full replanning should happen only when key assumptions fail. Under normal conditions, use local state updates and Plan patching.

### Principle 6: Select Complete Structures, Do Not Worship Local Scores

As soon as task value depends on a complete sequence or complete trajectory, local probability, retrieval score, or current-step success should not be treated as equivalent to global value.

### Principle 7: Prefer Recoverability

When several actions have similar local benefit, prefer the one that:

- has lower side effects,
- is easier to roll back,
- preserves more candidate paths,
- obtains information more easily, and
- damages less verified structure.

### Principle 8: Agent Structure Must Be Compared Against Strong Reasoning Baselines

Traditional scaffolds may already be partly absorbed by model-internal reasoning. Any Plan, Candidate, or Reflect component must therefore show that its benefit comes from a global system function, not from repeating a cognitive operation the model already performs.

---

## 13. Theoretical Boundaries

### 13.1 No Guarantee of Global Optimality

Plan, Candidate, Audit, Patch, and Rollback cannot guarantee a global optimum, because:

- the search space cannot be exhausted,
- global value may be unobservable,
- verifiers may be incomplete,
- candidates may be correlated,
- the initial Plan may be wrong,
- environmental state may be partly irreversible, and
- budgets are usually insufficient.

What these methods can support more plausibly is:

> reducing premature stopping caused by local attractors, preserving more high-value futures, and increasing the probability of migrating from the current local optimum into a higher-value region.

### 13.2 Use the Agent-Trajectory Aggregation Term Strictly

The outer layer of an agent is not necessarily a token-autoregressive model in the strict sense. It may include deterministic code, tools, state machines, and environment transitions.

So the precise term should be:

> **agent-trajectory aggregation mismatch**

The phrase “agent-level autoregressive mediocrity” is no longer retained even as an intuition pump. It turns a structural analogy into a claim about generative mechanism and again mixes support-side probability concentration with aggregation-side local-global divergence. The shared cross-scale structure is simply **agent-trajectory aggregation mismatch**.

### 13.3 The Countermeasures Themselves Can Create New Local Optima

- Plan can create plan rigidity;
- Candidate can remain highly correlated;
- Audit can optimize the wrong metric;
- Patch can preserve the wrong global structure;
- Hard State can lock in a wrong state definition;
- Rollback can create oscillation; and
- excessive global look-back can consume the execution budget.

So the goal of fighting aggregation mismatch is not to add infinite structure. It is to build:

> **a minimally sufficient combination of global control, candidate preservation, real feedback, state stability, and recoverability.**

---

## 14. Core Propositions

### Proposition 1: Single-Call Reasoning Aggregation Mismatch

When full-output value cannot be recovered accurately by the deployed local proxy, the proxy ranking diverges from global value-to-go, and the generated prefix constrains later reachable sequences, a token preferred by that proxy need not belong to a globally high-value output. Reasoning uses internal Plan, Candidate, comparison, backtracking, and verification to make local generation better approximate complete-output value. The proposition does not identify autoregressive factorization itself as the source of mismatch.

### Proposition 2: Agent-Trajectory Aggregation Mismatch

When full task value depends on a trajectory formed by multiple actions and state transitions, and early actions change the future reachable space, a locally reasonable action need not belong to a high-value terminal trajectory. Agents use persistent Plan, Candidate Frontier, Hard State, Execute-Observe, Audit, Patch, Rollback, and Replan to keep each local state transition inside regions that still lead toward higher task value.

### Proposition 3: Two Recursive Levels

Model reasoning and agent scaffolding are not simple duplication; they operate on different time scales:

```text
Reasoning: fight semantic prefix lock-in inside one output
Agent: fight causal path lock-in across multi-step execution
```

### Proposition 4: Global Function Determines Whether Plan and Candidate Are Necessary

If Plan and Candidate only generate more text over the same information, they may be redundant scaffolds. If they become cross-stage, persistent, verifiable, updatable global objects that control state transitions, they are infrastructure for fighting trajectory-level aggregation mismatch and cannot be dismissed simply because the model already reasons internally.

---

## 15. Final Conclusion

Aggregation mismatch is not an accidental defect confined to token generation. It is a structural problem that recurs across scales in sequential decision systems.

Inside a single call, the model commits local semantic choices token by token, while complete task value is determined by the whole output. Reasoning fights semantic prefix lock-in through internal planning, candidates, comparison, and backtracking.

Inside an agent system, the model and the environment commit real state transitions action by action, while complete task value is determined by the full execution trajectory. Agents fight causal path lock-in through persistent Plan, Candidate Frontier, Hard State, real feedback, Audit, Patch, Rollback, and Replan.

So the purpose of agents is not to mechanically repeat the model's internal reasoning. It is to place outside the model the global structures that reasoning alone cannot maintain:

- keep global goals participating in local actions,
- keep multiple futures reachable when evidence is insufficient,
- let real environmental feedback correct path value,
- preserve correct structure and support local modification,
- allow wrong state to be rolled back, and
- allow replanning when key assumptions fail.

The most compact statement is:

> **Reasoning fights semantic prefix lock-in; agents fight causal trajectory lock-in. Plan keeps projecting global value into local decisions, Candidate preserves multiple reachable futures, and Audit plus environmental feedback keep revising path value. These tools do not guarantee global optimality, but they reduce premature collapse, preserve the reachability of high-value futures, and increase the probability that the system moves into a higher-value region.**
