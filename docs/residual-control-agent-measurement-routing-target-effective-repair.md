# Residual Control: A Unified Framework for Target-Effective Repair in Agents from Measurement and Routing

## Abstract

Current LLM and agent evaluation mostly answers two questions: whether the final result is correct, and what the overall task success rate is. But those metrics do not explain what still separates the system from the target, whether those gaps can be compensated by external structure, which repair mechanism should be invoked, or whether fixing the present problem damages other goals.

The same wrong result can come from very different failure mechanisms. A model may answer incorrectly because it never acquired a key fact, because the fact existed but never entered the decision, or because local judgments were right but aggregation, selection, implementation, or verification failed. From thinking traces, outputs, and self-explanations alone, we usually cannot uniquely recover those internal mechanisms.

So residual research should not center on "identifying why the model internally failed." It should shift to a more operational and testable question:

> **Start from machine-grounded task residuals, measure how those residuals respond to controlled repair interventions, and search under layered multi-objective constraints for the lowest-cost path to target-effective repair with sufficient evidence.**

In this framework:

- machine facts establish that a residual exists;
- the LLM may summarize the residual, propose explanations, and generate candidate repairs;
- the Oracle detects, guides, and adjudicates whether the residual is closed;
- mismatch routing changes the current problem structure so that residuals that are hard to repair directly become observable, localizable, and verifiable again;
- Audit proposes, attacks, and examines repairs;
- SGARX freezes state, executes repair, replays, rolls back, and commits;
- parent goals and closure guards prevent local repair from becoming overfit, regression, or residual transfer.

This structure unifies residual handling across LLM steps, stage artifacts, and full agent trajectories, and moves Agent Engineering from "try again after failure" toward bounded, verifiable control based on residual structure.

---

# 1. Same Error Does Not Mean the Same Residual

Consider a simple question:

> A 100-yuan bill and a healthy fish both fall into water suitable for fish survival. Which should you pick up first?

If the model answers "the fish," the final wrong answer is the same, but the failure process may be very different:

- the model never activated the fact that fish can survive in water;
- it knew fish can swim, but did not bind that fact to the current decision;
- it considered that the fish was not in danger, but a default "life first" heuristic overrode the decision;
- its local judgment was correct, but it never completed the global comparison;
- the thinking trace selected the 100-yuan bill, but the final output said "the fish";
- it could detect the contradiction but could not reliably repair itself;
- it understood the facts, but the true decision objective was not clearly specified.

These failures require very different improvements:

- missing facts require retrieval, tools, or more model capability;
- inactive facts require context restructuring or salience amplification;
- unclear goals require a specification contract;
- local correctness with global failure requires aggregation, comparison, or replanning;
- correct judgment with wrong output requires structured implementation and execution checks;
- inability to notice the error requires external audit;
- ability to notice but inability to change requires local patching, rollback, or model upgrade.

So final accuracy measures only one outcome gap. It does not measure the structure that actually matters for engineering decisions:

> **Which interventions this residual is sensitive to, which external control can compensate for it, and what that compensation costs.**

---

# 2. Residual Research Must Separate Three Objects

## 2.1 Observable task residuals

A task residual is the part of the current state, artifact, or result that still fails to satisfy the goal contract.

Let the goal consist of clauses:

\[
G=\{g_1,g_2,\ldots,g_n\}
\]

Given current state \(s_t\), the observable residual is:

\[
R(s_t)=\{g_i\mid O_i(s_t)\neq PASS\}
\]

where \(O_i\) is the Oracle that verifies goal clause \(g_i\).

Production systems should not rely only on `PASS/FAIL`. At minimum they should distinguish:

| State | Meaning |
|---|---|
| `OPEN` | The clause is not yet satisfied |
| `VIOLATED` | Machine facts prove the clause is violated |
| `PROVISIONAL` | No issue has been found yet, but closure evidence is missing |
| `UNVERIFIABLE` | Current tools, budget, or feedback do not allow reliable verification |
| `CLOSED` | Full closure conditions have been met |

This layer of residual can be established by tests, execution results, file state, state machines, environment feedback, rule checks, or human adjudication.

## 2.2 Internally latent residual mechanisms

Why the model left those residuals is usually a latent mechanism:

\[
Z_{\text{residual}}
\]

What we can observe - thinking, output, self-report - are only downstream manifestations:

\[
Z_{\text{residual}}
\rightarrow
\{\text{thinking},\text{output},\text{self-report}\}
\]

Different internal processes can produce the same visible trajectory. So from a self-explanation like:

> "I failed because I didn't notice that fish can swim."

we cannot conclude that the model truly failed for that reason. It may just be producing a plausible retrospective story after seeing the bad result.

LLM self-summary still has value, but its proper role is:

- semantic summarization of the residual claim;
- proposal of candidate mismatches;
- generation of repair hypotheses;
- explanation of repair plans.

It cannot be the final authority on whether a residual exists or whether it has been closed.

## 2.3 Repair response measurable through intervention

What is most stably measurable is how the system changes when different interventions are applied to the same machine-grounded residual.

Let residual event \(e\) occur at frozen state \(s_e\), and let \(a\) be a repair operator:

\[
s_e\xrightarrow{a}s_{e,a}
\]

After executing the repair and rerunning the original Oracle plus parent closure guards, we obtain:

\[
Y(e,a)=
\left(
O_{\text{source}},
O_{\text{goal-valid}},
\Delta\mathbf R,
C(a),
E(a)
\right)
\]

where:

- \(O_{\text{source}}\): whether the Oracle that defined the original residual now passes;
- \(O_{\text{goal-valid}}\): whether the full goal constraints now pass;
- \(\Delta\mathbf R\): residual change across layers and goal dimensions;
- \(C(a)\): token, time, tool, and human cost;
- \(E(a)\): newly acquired validation evidence.

Under budget \(B\), define the repair response set of a residual event as:

\[
\Sigma_B(e)
=
\left\{
Y(e,a)
\mid
a\in\mathcal A_R,\ C(a)\leq B
\right\}
\]

This is the residual's **repair response surface** or **repairability profile**.

It does not claim to recover the model's one true internal mechanism. It answers the more important engineering question:

> Which intervention closes how much residual, at what cost, with what stability, and with what side effects?

---

# 3. Agent Residuals Form a Layered Multi-Objective Field, Not a Scalar

Single-turn LLM tasks usually focus on the distance between one output and one target answer. Agents have many steps, state transitions, stage artifacts, and long-horizon goals. Their residuals live at least across three orthogonal dimensions:

\[
\text{Residual}
=
\text{carrier}
\times
\text{evaluation horizon}
\times
\text{goal dimension}
\]

## 3.1 Residual carriers

| Carrier | Typical question |
|---|---|
| Single-turn output | Does the text, code, SQL, or plan satisfy this turn's requirement? |
| State transition | Did the action actually create the intended state change? |
| Stage artifact | Is the IR, plan, patch, or research draft acceptable for its stage? |
| Full trajectory | Did the multi-stage composition complete the final delegation? |

State-transition residuals are especially important. An action may produce the right text but still fail as an agent action if it does not create the intended state change:

\[
R_t^{\text{transition}}
=
d\left(
s_{t+1},
T^*(s_t,a_t)
\right)
\]

Examples include:

- a file was generated but task state was not updated;
- tests passed but the stage was not marked as verified;
- a tool call failed but the agent continued as if the old result still held.

## 3.2 Evaluation horizon

### Step-result residual

What still separates the current LLM output or tool result from the step goal.

This is the most local and easiest residual to measure.

### Stage-artifact contract residual

Whether the stage artifact fulfills the responsibility of that stage.

For example, a Text2SQL Semantic IR may accidentally lead to a correct final SQL while still lacking:

- metric definition;
- aggregation grain;
- time window;
- schema grounding;
- ambiguity records;
- uncertainty representation.

The final result may be correct, while the stage artifact is still deficient.

### Global stage residual

What effect the current artifact has on final reachability, success probability, and future repair cost.

Let \(\Pi_B\) be the available downstream policies under remaining budget \(B\). For artifact \(a_t\):

\[
V_t(a_t;B)
=
\max_{\pi\in\Pi_B}
\mathbb E[
G(\text{final outcome})
\mid
a_t,\pi
]
\]

Then the global residual of the stage artifact is:

\[
R_t^{\text{global}}(B)
=
V_t^*(B)-V_t(a_t;B)
\]

So global artifact quality is not fixed. It depends on:

- downstream agent capability;
- remaining budget;
- available tools;
- repair action space;
- Oracle bandwidth;
- whether rollback and replay are allowed.

An incomplete artifact may be a minor issue for a strong agent but make the goal unreachable for a weak one.

### Task residual

What still separates the full trajectory from the final delegated objective, including delivery quality, reliability, cost, risk, and evidence.

### Goal-specification residual

The difference between what the system explicitly optimizes and verifies and what humans actually want.

Let the true goal be \(G^*\), and the currently executable contract be \(\hat G\):

\[
R_{\text{spec}}=G^*\setminus\hat G
\]

In Text2SQL, "current result matches gold" may be part of the evaluator, while "must generalize, must not overfit, must not rely on case identity, must not encode SQL semantics into code" may initially exist only as vague expectations. Then the evaluator may say success while the true goal still fails.

## 3.3 Goal dimensions

The same residual can sit simultaneously in different goal dimensions:

\[
\mathbf R=
\left(
R_{\text{correctness}},
R_{\text{generality}},
R_{\text{architecture}},
R_{\text{regression}},
R_{\text{cost}},
R_{\text{evidence}}
\right)
\]

A repair may reduce present correctness residual while increasing generality or architecture residual. So agent residuals cannot be compressed into a single score.

---

# 4. Residual Change Is Not Just "Closed" or "Not Closed"

After repair, at least five distinct outcomes should be tracked.

## 4.1 Residual closure

The original goal gap is genuinely removed, and no other goal dimension materially worsens.

## 4.2 Residual compensation

The upstream error still exists, but downstream logic temporarily cancels it out.

This may pass the current case while accumulating complexity and future repair debt.

## 4.3 Residual transfer

One goal dimension improves while another worsens.

An overfit Text2SQL patch often looks like:

\[
R_{\text{case}}\downarrow
\]

while:

\[
R_{\text{generality}}\uparrow
\]

\[
R_{\text{architecture}}\uparrow
\]

\[
R_{\text{regression-risk}}\uparrow
\]

## 4.4 Residual delay

The issue is not visible in the current stage, but is propagated and re-exposed later.

## 4.5 Residual masking

The evaluator can no longer observe the issue, but the true goal is still unsatisfied.

So:

> Passing the source Oracle proves only that the original local residual is closed. It does not automatically prove target-effective closure of the full repair objective.

---

# 5. Machine Facts Are the Starting Point of Residuals

A reliable production process should keep the following authority relation:

```text
Machine facts establish the residual
-> the LLM may summarize and explain
-> Audit proposes and attacks repairs
-> SGARX safely executes repairs
-> the Oracle adjudicates closure
```

In one sentence:

> **The LLM proposes, Audit challenges, SGARX executes, and the Oracle adjudicates.**

The LLM must not be the authority that decides:

- whether a residual exists;
- whether the residual has been closed;
- whether the repair is general;
- whether the stage may finish.

Those authorities must belong to external machine facts, goal contracts, and state governance.

A residual record should contain at least:

```json
{
  "residual_id": "r-001",
  "snapshot_hash": "state-hash",
  "scope": "step | stage | global | task | specification",
  "goal_dimension": "correctness | generality | architecture | regression | cost | evidence",
  "goal_clause": "goal clause",
  "machine_fact": "machine evidence that formed the residual",
  "observed_layer": "where the error was observed",
  "candidate_origin_layers": ["possible origin layers"],
  "repair_locus": ["code", "tool", "llm", "harness", "model", "specification", "human"],
  "oracle_detect": "sufficient | weak | absent",
  "oracle_search": "sufficient | weak | absent",
  "oracle_close": "sufficient | weak | absent",
  "candidate_mismatches": [],
  "parent_guards": [],
  "status": "OPEN"
}
```

Three fields must be kept separate:

\[
\text{observed layer}
\neq
\text{candidate origin layer}
\neq
\text{repair locus}
\]

For example:

```text
Observed layer: final SQL execution is wrong
Candidate origin layer: metric grain in the Semantic IR
Best repair locus: metric contract
```

If the system records only one "failure layer," it will tend to patch the final SQL directly, close the surface error, and leave the upstream capability residual untouched.

---

# 6. Oracle Is Not Binary

Oracle adequacy must be judged relative to a specific residual and a specific decision.

## 6.1 Detection adequacy

Enough to prove that the residual exists.

Examples:

- compilation failure;
- failed pytest;
- SQL execution disagrees with gold;
- a required file is missing;
- state hash mismatch.

## 6.2 Search adequacy

Enough to guide repair or compare two repairs.

A `PASS/FAIL` Oracle may be sufficient for detection but not for local guidance. Feedback that points to joins, filters, aggregation, or transition locations has much higher search bandwidth.

## 6.3 Closure adequacy

Enough to prove that the residual may be safely closed, without success being obtained through gaming, residual transfer, or damage to parent goals.

In Text2SQL, gold execution is a strong Oracle for current-case correctness, but it is not a sufficient closure Oracle for:

- generality;
- anti-overfit requirements;
- architectural compliance;
- neighborhood regression;
- genuine capability gain.

So an Oracle should also be described by:

\[
O(r)=
(
\text{fidelity},
\text{bandwidth},
\text{coverage},
\text{cost},
\text{gameability}
)
\]

That is: reliability, feedback bandwidth, goal coverage, invocation cost, and ease of gaming.

Oracles must be defined per residual component. We should not simply say "this task has an Oracle," because within one task:

- current-case correctness may have a strong Oracle;
- generality may have only a weak Oracle;
- architecture boundaries may be partly checkable;
- unknown-distribution capability may be presently unverifiable.

---

# 7. Step-Level Work Can Also Have Different Oracle Types

An LLM step is not inherently Oracle-free.

## 7.1 Local Oracle

Directly verifies the current step:

- JSON Schema;
- compiler;
- unit tests;
- SQL execution;
- file existence;
- state-transition checks;
- stage-contract checks.

## 7.2 Delayed Oracle

The current step has no independent gold, but the issue appears downstream.

For example:

```text
Semantic IR
-> no gold IR
-> final SQL execution fails
```

By freezing state, replacing the artifact, and replaying downstream, we can test whether this step forms a key residual.

## 7.3 No reliable Oracle

Open-ended research, strategic judgment, or story-structure design may lack sufficient local or downstream Oracle support.

Then the system can only:

- construct local proxy Oracles;
- gather more evidence;
- attack with counterexamples;
- request human adjudication;
- mark the state as `PROVISIONAL` or `UNVERIFIABLE`.

Absence of a reliable Oracle must not be interpreted as "no problem found, so it is closed."

---

# 8. Oracle and Mismatch Are Not Ontologically Exclusive, but They Do Induce Operational Routing

Strictly speaking:

- Oracle describes how the system obtains feedback;
- mismatch describes why the present generate-verify regime cannot stably close the residual.

A code bug can simultaneously have a strong Oracle and an aggregation mismatch.

But for production routing, residuals can be separated into two operational states.

## 8.1 Oracle-addressable residual

Under the current task expression, state representation, action space, model, and budget, the available Oracle is sufficient to drive residual closure.

\[
r\in R_O
\iff
\exists \pi,\ C(\pi)\leq B,
\quad
P(\operatorname{close}(r)\mid O,\pi)\geq\theta
\]

Then the system need not change the problem structure. It can directly do:

```text
Local modification
-> run the Oracle
-> continue from the feedback
```

## 8.2 Mismatch-constrained residual

In the current regime, even with an Oracle, the ordinary repair loop cannot stably close the residual.

Let the current regime be:

\[
\Gamma=
(
G,S,\Omega,A,M,O,H
)
\]

representing goal, state, observation, action space, model, Oracle, and Harness.

Mismatch routing does not keep searching inside \(\Gamma\). It performs a structural transformation:

\[
\Gamma\xrightarrow{\phi_m}\Gamma'
\]

so that the residual becomes observable, localizable, and verifiable again in the new regime.

Therefore:

> **Oracle repair solves the problem inside the current space; mismatch repair changes the space so that Oracle repair becomes possible again.**

---

# 9. Composite Residuals Must Be Peeled Before Mismatch Routing

In practice, residuals are rarely pure Oracle or pure mismatch structures. They are composite:

\[
R=
R_O
\oplus
R_M
\oplus
I(R_O,R_M)
\]

where \(I\) is interaction between residual components.

For example, a code step may contain at once:

- a wrong JSON field;
- a core algorithmic error;
- a missed specification detail;
- a case-specific branch.

The right procedure is not to label it "aggregation mismatch" in one shot. It is to peel it in sequence:

```text
Form a composite residual
-> extract the portion already covered by sufficient Oracle
-> execute bounded low-cost repair
-> rerun the source Oracle
-> recompute the remaining residual
-> mismatch-route the stable remainder
-> mismatch routing creates new subgoals and new Oracles
-> return to the Oracle repair loop
```

A mismatch residual can be operationally defined as:

> **The remaining residual that cannot be stably closed by the current Oracle-repair loop within the direct-repair budget of the current regime.**

This avoids grounding mismatch classification entirely in the LLM's subjective explanation.

Typical no-progress signals include:

- multiple repair rounds with no residual reduction;
- repeated generation of the same error;
- an Oracle that only returns low-bandwidth `FAIL`;
- correct candidates that are never generated;
- repairs that keep introducing new regressions;
- a current case that passes while parent goals keep failing;
- oscillation among a few states.

---

# 10. The Six Primitive Mismatches Are Six Regime Transformations and Oracleization Mechanisms

The six primitive mismatches should not be treated only as an error taxonomy. They should be defined as six structural repair operators.

| Mismatch | Current structural problem | Regime transformation | New Oracle created |
|---|---|---|---|
| Specification mismatch | Goals, constraints, or priorities are unclear | Establish contracts, boundaries, and counterexamples | contract checks, negative examples, priority checks |
| State mismatch | Observation does not identify the true dynamic state | state refresh, hard state, replay, state machines | state invariants, transition checks |
| Observation-representation mismatch | Key information never enters the effective representation | add channels, structured transduction, denoising | evidence checks, field completeness |
| Support mismatch | Useful candidates sit in an extremely low-probability region | candidate expansion, mutation/recombination, model upgrade | candidate verifier, candidate coverage |
| Aggregation mismatch | Locally correct pieces fail to compose globally | decomposition, planning, candidate comparison, local patching | intermediate invariants, global consistency |
| Fitting-boundary mismatch | Repair here damages capability nearby | isolation, routing, domain-of-validity control, regression protection | regression tests, canaries, routing guards |

The common objective of mismatch routing is:

# Oracleization

That is, transform a hard structural residual into several clearer Oracle-addressable residuals:

\[
R_M
\xrightarrow{\text{mismatch transformation}}
\{r_1^O,r_2^O,\ldots,r_k^O\}
\xrightarrow{\text{oracle-guided repair}}
0
\]

For example, a vague "SQL semantic error" may, after specification routing, be decomposed into:

- is the metric explicit?
- is the aggregation grain explicit?
- is the time range explicit?
- is the join semantics explicit?

These subproblems are much easier to attach local Oracles to.

At runtime, mismatch labels should be multi-label:

```text
Primary candidate: aggregation mismatch
Secondary candidate: specification mismatch
Possible upstream candidate: state mismatch
```

These are repair hypotheses, not final verdicts about the model's true inner mechanism.

---

# 11. Repair Locus Must Be Routed Independently

Even when the residual has a sufficient Oracle, that does not mean the system should default to another LLM call.

Possible repair loci include:

| Repair locus | Typical residual |
|---|---|
| Deterministic code | formatting, path, mechanical schema errors |
| Tool layer | timeouts, retries, permissions, external-call failures |
| LLM | semantics, candidate generation, planning, local patching |
| Agent Harness | state, routing, budget, stage boundaries |
| Model layer | the present model cannot generate the required structure |
| Specification layer | goals or constraints are incomplete |
| Human | high risk, unverifiable cases, value judgment |

So the process should be:

```text
Oracle-addressable residual
-> choose the cheapest and most reliable repair locus
-> code / tool / LLM / harness / model / specification / human
```

The LLM is one repair executor, not the default owner of every residual.

---

# 12. LLM-Level Residual Routing and Agent-Level Residual Routing Share One Recursive Structure

We do not need a separate "internal psychological residual theory" for LLMs.

Every LLM step can be treated as a local agent task:

```text
Step goal
-> LLM output / artifact
-> machine fact or downstream feedback
-> step residual
-> Oracle peeling or mismatch routing
-> repair
-> re-verification
```

When the repair locus is the LLM, we can choose among operational repair categories:

| LLM repair category | Typical handling |
|---|---|
| Information availability | retrieve, re-observe, state refresh |
| Information binding | constraint extraction, structured representation, denoising |
| Candidate generation | candidate expansion, decomposition, model upgrade |
| Candidate selection | global comparison, verifier, adversarial audit |
| Implementation | structured output, local patching, action constraints |
| Verification and correction | replay, external correction, independent auditor |

These categories answer:

> Which class of intervention is the residual sensitive to?

not:

> What exactly happened inside the model?

After a step closes, the system must recompute the stage and task residual. Otherwise a local pass may just be a residual transfer upward.

---

# 13. Repair Plans Are Usually Abundant; Target-Effective Repairs Are Scarce

Overfit Text2SQL cases reveal the central trap.

Once the current case's gold is known, making the present output correct is often easy:

```python
if current_case_matches_special_pattern:
    return expected_behavior
```

Or more subtly:

- use a specific table name;
- exploit schema identity;
- trigger a rule from a special phrase in the question;
- write business semantics into deterministic code;
- add a branch that only works for this join.

All of these can close the present result residual.

Define:

\[
\mathcal P_{\text{result}}
=
\{
P:
O_{\text{source}}(P)=PASS
\}
\]

But the set of repairs that really satisfy the full goal is much smaller:

\[
\mathcal P_{\text{goal-valid}}
=
\{
P\in\mathcal P_{\text{result}}:
G(P)=1
\}
\]

We may further distinguish:

\[
\mathcal P_{\text{result}}
\supseteq
\mathcal P_{\text{stage}}
\supseteq
\mathcal P_{\text{global}}
\supseteq
\mathcal P_{\text{goal-valid}}
\supseteq
\mathcal P_{\text{certified}}
\]

meaning:

- current result passes;
- stage artifact is acceptable;
- the repair helps the global objective;
- it satisfies generality, architecture, and anti-overfit constraints;
- it carries enough evidence for safe closure.

Therefore:

> **Result reachability is not the same as goal-valid reachability.**

Search systems most easily find the first path that makes the current Oracle pass, but the first passing path is often not the first lawful path.

Define:

\[
C_{\text{hit}}^*
=
\min_{P:O_{\text{source}}(P)=PASS} C(P)
\]

\[
C_{\text{valid}}^*
=
\min_{P:\operatorname{Accept}(P)=1} C(P)
\]

Their difference:

\[
H_{\text{goal}}
=
C_{\text{valid}}^*-C_{\text{hit}}^*
\]

captures the real hardness gap between "make the current output pass" and "find a target-effective repair."

---

# 14. Multi-Objective Hard Constraints Cannot Be Flattened Into One Reward

The true Text2SQL objective is usually conjunctive:

\[
G=
G_{\text{correct}}
\land
G_{\text{general}}
\land
G_{\text{no-overfit}}
\land
G_{\text{architecture}}
\land
G_{\text{regression-safe}}
\land
G_{\text{evidence}}
\]

It should not be compressed into:

\[
Reward
=
100\times\text{current case pass}
-
5\times\text{overfit risk}
\]

because a strong local reward can overwhelm weaker, more abstract long-term constraints.

A more reasonable procedure is:

1. enter the legal repair space that satisfies all hard constraints;
2. optimize cost, stability, edit size, and evidence strength only inside that legal space.

Define repair acceptance as:

\[
\operatorname{Accept}(P)
=
O_{\text{source}}
\land
O_{\text{stage}}
\land
O_{\text{parent}}
\land
O_{\text{regression}}
\land
O_{\text{anti-overfit}}
\land
O_{\text{architecture}}
\land
O_{\text{evidence}}
\]

So at the leaf level, repairs should at least be separated into:

| State | Meaning |
|---|---|
| `FAIL` | the original residual is not closed |
| `LOCAL_PASS` | the source Oracle passes, but parent constraints or closure guards fail |
| `GOAL_VALID_PASS` | the full goal constraints pass |
| `CERTIFIED` | the repair is target-valid and carries enough evidence for closure |

---

# 15. Repeated Overfit Review Is Really Goal-Specification Learning

At first, "must generalize" and "must not overfit" are only abstract natural-language demands.

Each time Codex proposes an overfit repair, human review identifies a new illegal shortcut:

```text
Do not rely on case features
Do not rely on database identity
Do not rely on table-name or column-name identity
Do not encode SQL semantics into Python
Rules must trigger from general semantic conditions
Do not add branches that only work on the current sample
```

Every review round shrinks the legal repair space:

\[
\mathcal P_{t+1}
=
\mathcal P_t\setminus\mathcal B_t
\]

where \(\mathcal B_t\) is the newly discovered illegal region.

This process can be understood as:

- counterexample-driven specification tightening;
- cutting-plane style search-space pruning;
- moving from extensional goals toward intensional goals.

Gold defines only:

```text
This input should map to this output.
```

But the real capability objective is:

```text
The system should solve a class of unknown problems through a general mechanism.
```

A single gold instance cannot uniquely identify the correct mechanism. Repeated overfit review is really externalizing which forms of success must not be accepted.

---

# 16. Repair Artifacts Should Carry Evidence

A reliable repair should not be just a patch \(p\), but:

\[
(p,E)
\]

where \(E\) is an evidence bundle such as:

```text
current case passes
historical regression passes
question paraphrase passes
schema/table/column renaming passes
neighboring positives pass
neighboring negatives do not trigger
anti-leak scan passes
architecture audit passes
```

This may be called:

# Evidence-Carrying Repair

Evidence does not prove universal generalization over all unknown distributions, but it greatly increases falsifiability and safe closure capacity.

---

# 17. The Minimal Repair Path Must Be the Minimal Target-Effective Repair Path

Ordinary repair search may optimize only:

\[
P^*
=
\arg\min_P C(P)
\quad
\text{s.t.}
\quad
O_{\text{source}}(P)=PASS
\]

What we actually need is:

\[
P_{\text{valid}}^*
=
\arg\min_P
\left[
C(P)+\lambda D(P)+\mu D_{\text{repair}}(P)
\right]
\]

subject to:

\[
\operatorname{Accept}(P)=1
\]

where:

- \(C(P)\): token, time, tool, and human cost;
- \(D(P)\): modification size imposed on already-correct structure;
- \(D_{\text{repair}}(P)\): future repair debt introduced by the repair.

Repair debt of a stage artifact can be written as:

\[
D_t^{\text{repair}}
=
C_t^*(a_t)-C_t^*(a_t^{\text{ideal}})
\]

that is, how much additional minimum downstream cost the current artifact imposes relative to the ideal artifact.

This explains why two trajectories can both succeed while having very different quality.

---

# 18. Residual Repair and MCTS

Residual repair can indeed be viewed as a search problem:

```text
Failure state
-> repair operator
-> new state
-> Oracle feedback
-> continue, rollback, or finish
```

But it is not ordinary from-scratch solution search.

Residual repair must:

- preserve already-correct structure;
- prefer local modification;
- control regression;
- satisfy parent goals;
- maintain hard state;
- carry validation evidence.

So search edges should be semantic repair operators, not arbitrary natural-language thoughts.

MCTS may become a useful algorithm later, but it cannot replace the following infrastructure:

- explicit residual state;
- semantic repair operators;
- goal-valid terminal conditions;
- closure guards;
- freeze, fork, replay, and rollback;
- no-progress handling and budget control.

## Infinite budget does not guarantee success

Search probability can approach 1 with growing budget only if:

- an effective repair is reachable in the action space;
- a finite repair path exists;
- necessary actions have nonzero generation probability;
- exploration remains sufficient;
- the Oracle can recognize success;
- state can be rolled back or replayed;
- necessary information has not been lost.

If the needed repair has zero probability under the model support:

\[
P(a^*\mid s)=0
\]

then more budget will not generate it.

Infinite budget can reduce sampling insufficiency, but it does not automatically solve:

- zero support;
- a wrong action space;
- Oracle blindness;
- state loss;
- specification error;
- overfit rewards hijacking the search objective.

---

# 19. Known-Result and Unknown-Result Research Are Two Different Tracks

## 19.1 Known-result track: for residual research

The experimental system knows the gold, but the repair proposer should not directly see the full answer.

The system can control how much Oracle information is exposed to the repair agent:

```text
full diff
-> local error location
-> structured error type
-> continuous score
-> binary pass/fail
-> noisy preference
-> no external feedback
```

This track measures:

- which effective repair paths exist;
- whether the model can propose them;
- whether the router can recognize them;
- minimum repair cost;
- how much Oracle bandwidth is required;
- whether a clear shortcut gap exists;
- which repairs cause residual transfer.

Gold should be visible to the experiment system, not directly to the repair model. Otherwise the task degenerates into inventing a plausible story from the answer.

## 19.2 Unknown-result track: for production

When the result is unknown, we must split again.

### Unknown result, but reliable success criterion

Examples:

- code with full tests;
- mathematical proof with a proof checker;
- tools with clear environment feedback;
- SQL with a reliable execution Oracle.

This is still a verifiable search problem.

### Unknown result, and unreliable success criterion

Examples:

- whether a research proposal is truly novel;
- whether an essay is truly excellent;
- whether an investment strategy has real alpha;
- whether an open-ended agent truly completed a complex delegation.

Then the system must jointly maintain:

- residual hypotheses;
- candidate mismatches;
- repair plans;
- falsification plans;
- new evidence;
- Oracle reliability;
- remaining budget and risk.

Actions are not just "repair." They also include:

```text
diagnose
gather evidence
construct counterexamples
strengthen the Oracle
execute repair
run verification
rollback
upgrade the model
ask a human
accept residual risk
```

This is closer to belief-space search than to answer-tree search.

---

# 20. The Bridge Between Offline Research and Online Application

In known-result settings, we can run expensive repair search and collect:

\[
(s_t,a_t,\Delta\mathbf R,C_t,E_t,\text{success})
\]

From that we can learn:

### Repair policy

\[
\pi_R(a\mid r,s,G,O,B)
\]

Given residual, state, goal, Oracle, and budget, which repair operator should be tried first?

### Repair value

\[
Q_R(s,a)
=
P(
\text{goal-valid closure within budget}
\mid s,a
)
\]

### Residual value

\[
V_R(s)
=
P(
\text{repair remains possible within budget from this state}
)
\]

In production, we no longer enumerate every path. We use these offline priors:

```text
Current residual
-> choose a small number of high-value repair or diagnostic actions
-> execute
-> Oracle verification
-> update residual
-> continue, rollback, reroute, or stop
```

So residual measurement should ultimately serve online residual control, not just generate another error taxonomy.

---

# 21. A Unified Production Residual Loop

The full production loop can be organized as:

```text
Goal contract + hard state + current artifact
                        ↓
Machine facts produce residual evidence
                        ↓
Create a machine-grounded residual record
                        ↓
Identify:
- residual scope
- goal dimension
- observed layer
- candidate origin layer
- repair locus
                        ↓
Evaluate the Oracle:
- is detect sufficient?
- is search sufficient?
- is close sufficient?
                        ↓
If search Oracle is insufficient:
acquire, split, or strengthen the Oracle
                        ↓
If sufficient Oracle cannot be obtained within budget:
UNVERIFIABLE / human escalation / risk acceptance / terminate
                        ↓
Peel the Oracle-addressable portion
                        ↓
Perform bounded direct repair
                        ↓
Rerun the source Oracle
                        ↓
Recompute the remaining residual
                        ↓
Stable remainder enters candidate mismatch routing
                        ↓
Audit:
propose repairs, counterexamples, and closure guards
                        ↓
SGARX:
freeze -> fork -> patch -> replay
                        ↓
Rerun the source Oracle
             ┌──────────┴──────────┐
           FAIL                   PASS
             ↓                      ↓
      repartition and reroute   local residual closed
                                    ↓
                           run parent closure guards
                         ┌──────────┴──────────┐
                       FAIL                   PASS
                         ↓                      ↓
            residual transfer / new residual  allow residual closure
            repartition and reroute           then judge stage closure
```

Within this loop:

- Audit has no state-closing authority;
- the repair model cannot declare success by itself;
- the source Oracle must be rerun;
- parent goals must be revalidated;
- if closure guards fail, the stage must not close;
- `UNVERIFIABLE` must be an explicit state, not silently rewritten as success.

---

# 22. Step, Stage, and Task Must Close Separately

At least three completion states should be distinguished in agents.

## 22.1 Turn Done

The current action obtained the expected local result.

## 22.2 Stage Closed

The stage artifact:

- satisfies the stage contract;
- is written into hard state;
- is compatible with downstream interfaces;
- violates no known hard constraint;
- carries sufficient stage evidence;
- does not produce unacceptable parent-level residual transfer.

## 22.3 Task Complete

The final artifact:

- satisfies the full goal;
- satisfies multi-objective hard constraints;
- causes no unacceptable regression;
- reaches delivery-level evidence;
- has residual risk either closed or explicitly accepted.

Therefore:

> A correct environment result can close only the turn residual. It does not automatically close the stage, and it certainly does not automatically imply task completion.

---

# 23. Core Metrics for Residual Measurement

## Outcome Repair@B

Probability that the source Oracle passes under budget \(B\):

\[
P(O_{\text{source}}=PASS)
\]

## Goal-Valid Repair@B

Probability that all hard goal constraints pass under budget \(B\):

\[
P(\operatorname{Accept}(P)=1)
\]

## Certified Repair@B

Probability that the repair is not only target-valid but carries enough evidence for safe closure.

## Shortcut Gap

\[
\operatorname{ShortcutGap}(B)
=
\operatorname{OutcomeRepair@B}
-
\operatorname{GoalValidRepair@B}
\]

This measures how much apparent repair success is actually gaming, overfit, or residual transfer.

## Selection Gap

\[
\operatorname{SelectionGap}(B)
=
\operatorname{OracleBestRepair@B}
-
\operatorname{SelectedRepair@B}
\]

If the candidate set already contains an effective repair but the system fails to choose it, the main problem lies in verification, ranking, or routing rather than proposal.

## Minimum Valid Repair Cost

\[
C_{\text{valid}}^*
=
\min_{P:\operatorname{Accept}(P)=1}C(P)
\]

## Residual Transfer Rate

\[
P(
R_i\downarrow
\land
\exists j\neq i,\ R_j\uparrow
)
\]

## Repair Debt

How much additional downstream repair cost the current artifact creates relative to an ideal one.

## Oracleization Gain

How many formerly hard residuals become covered by sufficient search or closure Oracle after mismatch transformation.

## Residual Closure per Cost

\[
\frac{\Delta \mathbf R_{\text{goal-valid}}}{C}
\]

## No-Progress / Oscillation Rate

Track:

- repeated retry;
- full-object rewrite;
- state oscillation;
- repeated entry into the same failure path;
- token spend with no residual reduction.

---

# 24. How the First Research Stage Should Be Grounded

Text2SQL is the ideal first environment because it simultaneously provides:

- multi-stage artifacts;
- a strong outcome Oracle;
- delayed credit assignment;
- overfit risk;
- architectural boundaries;
- historical regression;
- many real failure trajectories;
- existing Audit and SGARX foundations.

## 24.1 Build a residual dataset

Extract real failures such as:

- Semantic IR errors;
- schema-linking errors;
- metric-interpretation errors;
- join-planning errors;
- aggregation errors;
- SQL-realization errors;
- cases that pass the current example but fail overfit review;
- cases that repair the current example but fail historical regression.

Also construct injected residuals such as:

- remove key constraints;
- make state stale;
- bury relevant facts in noise;
- break artifact fields;
- create correct thinking with wrong final mapping;
- add case-specific shortcuts;
- create local pass with global failure.

Real residuals provide external validity. Injected residuals provide clearer system-level ground truth.

## 24.2 Freeze and fork

For each residual, create an SGARX snapshot:

```text
freeze
-> fork multiple isolated branches
-> each branch executes one repair operator
-> replay downstream flow
-> rerun source Oracle
-> run closure guards
-> recompute parent residual
-> rollback
```

## 24.3 Fix the repair-operator space

At the first stage, do not search arbitrary natural-language thought. Use a finite semantic operator set:

```text
plain retry
generic reflection
local patch
full rewrite
Oracle acquisition
specification clarification
state refresh
observation reconstruction
candidate expansion
aggregation decomposition
Audit-mediated repair
rollback + replay
model upgrade
human escalation
```

## 24.4 Control Oracle bandwidth

The experiment system always knows the gold, but exposes only different feedback levels to the repair agent:

```text
full diff
local position
structured category
continuous score
binary pass/fail
weak feedback
no external feedback
```

## 24.5 Build closure guards

At minimum:

- current-case execution;
- historical regression;
- question paraphrase;
- schema/table/column renaming;
- same semantics under different database structure;
- neighboring positives;
- neighboring negatives;
- scans for leakage of case/db/gold identity;
- architecture-boundary audit;
- checks that SQL semantics were not moved into deterministic code.

## 24.6 Compare baselines

Compare:

- single retry;
- fixed reflection;
- best-of-N;
- from-scratch rewrite;
- search using only the source Oracle;
- repair with closure guards;
- six-mismatch routing;
- repair routing based on historical response profiles.

---

# 25. Core Hypotheses the First Version Can Test

## H1: Same error, different repairs

The same final error corresponds to significantly different repairability profiles.

## H2: Repair response outperforms self-explanation

A router based on machine facts, Oracle profile, and historical intervention response predicts effective repair operators better than classification based only on LLM self-report.

## H3: There is a substantial gap between local pass and target-validity

When gold is visible but goal constraints are incomplete, stronger search is more likely to find overfit or opportunistic paths.

## H4: The main value of mismatch routing is Oracleization

The six mismatch transformations increase residual localizability and verifiability, and lower the later minimum valid repair cost.

## H5: Layered closure guards reduce residual transfer

Recomputing stage and task residuals after a step pass should significantly reduce global regression caused by local repair.

## H6: Residual routing improves repair efficiency per unit budget

Under the same token, time, and tool budget, residual-profile-based routing outperforms uniform retry, reflection, and unconstrained search.

---

# 26. Final Unification

Residual measurement, residual routing, and residual repair can be unified into one recursive control structure:

\[
\boxed{
\text{machine facts establish residual}
\rightarrow
\text{register layered multi-objective residuals}
\rightarrow
\text{peel the Oracle-addressable portion}
\rightarrow
\text{bounded direct repair}
\rightarrow
\text{route the stable remainder through mismatch}
\rightarrow
\text{change the regime and complete Oracleization}
\rightarrow
\text{search for a target-effective repair path}
\rightarrow
\text{rerun the source Oracle and closure guards}
\rightarrow
\text{recompute the parent residual}
\rightarrow
\text{close, rollback, reroute, or escalate}
}
\]

In this unified view:

- residual measurement does not attempt to recover unknowable internal model states; it records machine-grounded goal gaps and repair responses;
- residual routing does not attach psychological labels to errors; it selects Oracles, repair loci, and regime transformations;
- residual repair is not about making the current result look correct; it is about closing residuals under multi-objective hard constraints while preventing transfer, delay, compensation, and masking;
- LLM-level repair is not a separate theory; it is the recursive leaf-node instance of the same residual-control mechanism;
- MCTS is not the framework itself; it is only one possible finite-budget search algorithm after residual states, repair operators, and goal-valid Oracles are already explicit;
- known-result settings measure repairability, and unknown-result settings use those measurements for online routing and control.

The central research object is no longer:

> Why did the model fail internally?

It becomes:

> **Given a state that has already failed, what additional control delta is needed to succeed reliably at minimum cost under the full goal constraints, and what evidence is required before the system may safely recognize that success?**

That is the core increment of residual control over traditional accuracy evaluation, error classification, and generic reflection. It turns agent failure handling from "keep generating" into:

> **layered residual governance grounded in machines, driven by Oracles, transformed by mismatch routing, constrained by goals, and closed by evidence.**
