# The Working Set at Commit Time: From Thinking to Agents

**Status: Working paper v0.1** (draft; not yet listed in the README or the site index)  
**Date: 2026-11-11**  
**Related documents:**

- [中文版](./commit-time-working-set-from-thinking-to-agents.zh-CN.md)
- [Aggregation Mismatch Across Scales: From Single-Call Reasoning to Agent Trajectories](./aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.md)
- [Audit Engineering for Governed LLM Systems](./audit-engineering-failure-localization-control-space-writeback.md)
- [Attention Governance](./attention-governance.md)
- [Aggregation Mismatch V1–V25 and Supplementary Experiments](./aggregation-mismatch-v1-v25-and-supplementary-experiments.md)

---

## Abstract

How good a generation can be depends on what the system has to go on at the moment it makes a commitment it cannot take back. This paper calls that content the **working set at commit time** and uses it to compare three ways of generating. Direct output can rely only on the task representation and the prefix already written. Thinking (the model's internal reasoning) adds a draft of its own before the commit; what it adds is computation, but only as much as a single context and budget can hold. An agent can spread computation over several contexts and allocate budget as needed, and before the commit it can also bring in external observations, independent checks, and committed intermediate state.

Four conclusions follow:

1. Thinking cannot raise the task's information-theoretic ceiling. How far it gets below that ceiling is limited by the effective computational capacity of a single context: when the budget can expand only 5 approaches, approaches 6 through 20 are not covered.
2. An agent's gain over thinking is of two sorts. One is a difference in degree: more computation that can be allocated freely. Thinking with enough budget and suitable training can catch up in principle. The other is a difference in kind: new information. Thinking cannot provide it however long it runs.
3. An external structure that neither brings new information nor enlarges effective computation is only repeating thinking.
4. Iteration pays only when each round brings new information, an independent verdict, or a persistent object.

Together these conclusions give a division of responsibility. When the decisive information is not in the input, the agent's main job is to obtain observations and feedback. When the information is in the input but exceeds the effective capacity of a single call, the main job is to construct and organize information. When neither holds, an agent can add very little.

This is a draft to be tested. Section 8 gives three experimental designs with falsification conditions, and Section 9 states the current evidence level of each claim.

---

## 1. Starting Point: Why Expanding First and Then Writing Helps

The current definition of aggregation mismatch is that deployed local proxies, bounded search, or irreversible commitment deviate from global completion value. Autoregressive chain factorization can represent any joint distribution exactly, so it is not the cause. The cause is two things: the conditional distribution the model has learned is only an approximation, and content cannot be taken back once it is written.

In direct output, the conditional distribution used to write token `t` must implicitly account for every way the rest could be written. That is a demanding requirement, and it is where approximation error enters. Thinking does something different: it first writes out one complete version, then generates the final output conditioned on it. The implicit "account for every continuation" is replaced by one concrete draft. The [Audit Engineering](./audit-engineering-failure-localization-control-space-writeback.md) paper calls this the prefix-completion asymmetry: a complete candidate exposes interfaces, contradictions, and dependencies that were not yet visible during first-pass generation.

To be precise, thinking does not remove the fact that the current choice depends on the full sequence. The draft is itself written token by token with the same local proxy. What thinking changes is the commitment structure:

- choices made in the draft are not delivered and can be overturned;
- the final output is conditioned on one complete candidate.

The cost is anchoring. One draft usually represents one structural basin, and the final output inherits its frame. The [across-scales](./aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.md) paper calls this semantic prefix lock-in.

---

## 2. The Working Set at Commit Time

A **commit** is the delivery of an output or the execution of a state transition that cannot be taken back. The **working set at commit time** `W_c` is everything the call that makes this commit can rely on. Split it into five parts:

```math
W_c = Z \cup D \cup O \cup A \cup S
```

| Symbol | Content | Source |
|---|---|---|
| `Z` | Task representation: the prompt and the given context | Present when the task starts |
| `D` | Drafts and derivations | Generated by the model itself; thinking has only those in the same context, an agent can have ones generated in several contexts |
| `O` | Observations: tool results, files, test output, human answers | Obtained from outside after the task starts |
| `A` | Assessments: conclusions from checking a candidate | Another context, or an external verifier |
| `S` | Committed state: verified decisions, results, and open items | Left by earlier rounds |

The three ways of generating differ in which parts `W_c` contains:

| Mode | Composition of `W_c` | Resource added over the previous row |
|---|---|---|
| Direct output | `Z` and the prefix already written | None |
| Thinking | `Z`, `D` from a single context | Computation, limited to a single context and budget |
| Agent | `Z`, `D` from several contexts, `O`, `A`, `S` | Scalable computation, information, independence, persistence |

`W_c` is a task-level concept. It describes what the system can get hold of at commit time, not attention weights inside the model. Being in the working set is not the same as being used; the more content there is, the heavier the dilution. Section 5 handles this.

---

## 3. The Limits of Thinking

### 3.1 It Adds Computation, Not Information

The draft `D` is generated from the model parameters, `Z`, and sampling randomness, whether it comes from one context or several. Given `Z`, it carries no new information about the world:

```math
I(D; S_{\text{world}} \mid Z) = 0
```

Let `V_X` be the highest expected utility any policy can reach when relying only on `X`. Then:

```math
V_{Z \cup D} = V_Z \le V_{Z \cup O}
```

The equality says that content the model generates itself cannot raise `V_Z`, however much of it there is. Its role is to bring a computation-bounded model closer to `V_Z`, that is, to make usable what is already in `Z` and the model parameters but cannot be used in a single forward pass. How close it can get is the subject of Section 3.2. The inequality says that only observation can raise the ceiling itself.

This agrees with the decomposition in the [channel governance](./observation-representation-mismatch-channel-governance-llm-systems.md) paper: the `V_feas − V_Z` segment is the loss from a feasible channel that was never connected, and no amount of thinking recovers it.

### 3.2 Below the Ceiling: Effective Computational Capacity

There are two more levels below the information ceiling. Let `V_θ` be the value this model can reach with an unlimited budget and well-organized computation, and `V_θ(B)` the value that thinking in a single context with budget `B` can reach:

```math
V_\theta(B) \le V_\theta \le V_Z
```

The gap in the first inequality comes from budget. Suppose a task needs 20 structurally different approaches to be combined before a good result is reliable, and the budget of one thinking pass can expand only 5. The other 15 are not covered, and `V_θ(B)` is clearly below `V_θ`.

More budget narrows this gap, but a single context has two soft limits that keep effective capacity below the nominal budget: later approaches are conditioned on earlier ones (Section 3.3), and dilution grows with length (Section 3.5).

In principle, if the budget is unlimited and training has taught the model to use very long thinking, `V_θ(B)` can approach `V_θ`. The gap at this level is therefore a matter of degree, not of kind. The agent's advantage here is practical: it is not bound by the budget cap of a single call, it can spread computation over several contexts that do not interfere with one another, and it can put budget where the prospects are better.

### 3.3 One Draft, One Basin

Thinking usually expands a single route. Later self-revision is conditioned on that route; it changes details and rarely changes structure. Keeping several structurally different directions alive requires saving candidates independently and advancing them separately, which is beyond what a single context can do reliably.

### 3.4 Self-Checking Is Not Independent

Self-criticism in the same context reads the same draft and the same frame, so its errors are highly correlated with the draft's errors. What the draft did not see, the self-check mostly does not see either.

### 3.5 Longer Means More Diluted

The longer the thinking, the more content in the working set is irrelevant to the current decision, and earlier constraints are washed out by later text.

---

## 4. "Higher-Order Content" Is Several Different Resources

Saying that an agent can "expand higher-order content" tends to mix several things together:

| So-called "higher-order content" | What it is | Can thinking provide it |
|---|---|---|
| Derivations of derivations, consequences of consequences | Computation | Yes, limited by budget and working-set capacity |
| More structurally different candidate approaches | Scale of computation | Partly: as many as the budget can expand |
| File contents, test results, the current real state | Information | No |
| A check not influenced by the same draft | Independence | Not in practice |

Adding the ability to keep verified results across rounds, that is, persistence, what an agent can do is listed below. The first four rows are the usual account; the fifth comes from free allocation of budget; the last two are easy to miss, yet they decide whether the rows above work.

| Agent action | Resource added | Mismatch mainly repaired | Corresponding paper |
|---|---|---|---|
| Expand highly relevant hidden context | Information | Observation-representation | [Channel governance](./observation-representation-mismatch-channel-governance-llm-systems.md) |
| Reorganize context from different angles | Usability: getting existing content used | Aggregation | [Attention governance](./attention-governance.md) |
| Independent audit: cut irrelevant content, locate defects | Independence | Specification, aggregation | [Audit engineering](./audit-engineering-failure-localization-control-space-writeback.md) |
| Repeated iteration | Chances to revise | Aggregation | [Step versus Stage experiments](./aggregation-mismatch-v18-v19-step-vs-stage-iteration.md) |
| Expand candidates across contexts, allocate budget as needed | Scalable computation | Support | [Support mismatch and control-space search](./support-mismatch-control-space-search-llm-systems.md) |
| Commit verified results | Persistence | State | [SGAR](./state-governed-agent-regime-for-governed-llm-systems.md) |
| Connect an external criterion | Fidelity | Specification | [Oracle classification](./oracle-classification-audit-agent-sgar-engine-routing.md) |

Four remarks.

First, only part of this table is aggregation repair. Expanding hidden context repairs observation-representation mismatch, and connecting an external criterion repairs specification mismatch. An agent's gain spans several mismatches.

Second, independent audit buys bandwidth, not fidelity. Looking again from another context finds more suspicious spots; whether those findings are real has to be settled by an external criterion. Without one, the audit is only a second opinion from the same model.

Third, Section 7 of the across-scales paper lists the conditions under which Plan and Candidate are "not duplicate reasoning", and those conditions map onto the resources here. Being consumed by several stages, being persisted, and serving as a single source of truth belong to persistence. Candidates saved independently, given different evidence, and selected after new evidence appears belong to independence plus information.

Fourth, these resources differ in nature. Information is a difference in kind: what is not in `Z`, thinking cannot provide however long it runs. Scalable computation is a difference in degree: it narrows as the budget cap of a single thinking pass rises and as models learn to use longer thinking. Independence and persistence sit in between: thinking that is long enough and suitably trained can in principle re-derive and keep accounts internally, but in practice it is limited by anchoring and dilution. This agrees with the judgment in the [controlled experiments](./why-agent-engineering-needs-controlled-experiments.md) paper: training can absorb a governance policy, but it cannot create missing observations.

---

## 5. The Agent's Job in Three Situations

"Is there new information" depends on relative to whom. Relative to the whole task, everything in the input counts as existing information. Relative to one call, only what enters its effective working set counts. When the input exceeds the effective capacity of a single call, the decisive content may be in the input and yet in no call's working set. Bringing it into the working set adds no information for the task, but it is new for that call.

The agent's job is therefore decided by two questions: whether the decisive information is in the input, and whether the input and the structure a judgment needs fit in a single call.

| Situation | Condition | The agent's main job | Resource mainly involved |
|---|---|---|---|
| Closed and small | The decisive information is in the input and fits in a single call | Very little; expand candidates across contexts when the candidates needed exceed the budget | Scalable computation |
| Closed and large | The decisive information is in the input but exceeds the effective capacity of a single call | Construct and organize information | Usability, independence, persistence |
| Open | The decisive information is not in the input | Obtain observations and feedback through tools | Information |

The three situations can combine: a task that is both large and open carries both jobs.

In the terms of the [Attention Governance](./attention-governance.md) paper, the decision working set describes what a judgment must keep in effect, and `W_c` describes what the commit can actually rely on. "Closed and large" means that what the former needs is in the input but has not entered the latter.

### 5.1 Two Bottlenecks in Closed Tasks

Without external information, results stall for two different reasons:

- **Attention capacity**: the input is too large, or cross-part dependencies are too entangled, so the content a judgment needs is not held in the working set together. The remedy is reorganization.
- **Computational capacity**: there are too many candidates to expand for the budget. The remedy is expanding candidates across contexts (Section 3.2).

The two can be told apart by intervention. If results improve after the input is cut down to the relevant parts, the bottleneck is attention. If results improve with the input unchanged and several independent attempts added, the bottleneck is computation. They correspond to case A and case B in Section 6.3 of the Attention Governance paper, and the open situation corresponds to case D.

### 5.2 Operations Covered by "Reorganization"

| Operation | Limit it works around |
|---|---|
| Selection: pick the material relevant to the current judgment | Dilution |
| Re-representation: turn implicit relations into explicit structure, such as a character table, a timeline, or a dependency graph | Re-deriving the same relations for every judgment |
| Splitting judgments: break a large question into sub-judgments that each need only a small working set | Capacity of a single working set |
| Independent review: check again from another context | Self-check correlated with the draft |
| Persistent bookkeeping: keep confirmed findings and track cross-part constraints | Forgetting and going back and forth |

The selections and derived structures these operations produce are all computed by the model from the input. They belong to `D` and `S` in Section 2 and do not raise the information ceiling. Their role is to make each call's working set small and sufficient. The Attention Governance paper gives a necessary condition: an evidence pack must not compress material that requires different judgments into the same input, or the reorganization itself loses information.

### 5.3 Who Supplies the Reorganization Scheme

The reorganization scheme can itself carry external information. When a person decides what structure to reorganize by, their knowledge of the material and their judgment of "what counts as good" enter the system. That is input on the observation and specification side, not a gain under closed conditions. To test "improvement without external information", the scheme must be produced by the system itself or come from fixed rules that do not depend on the specific material.

This section was motivated by experience with long manuscripts: a book manuscript of several hundred thousand characters was beyond the effective range of both attention and a single thinking pass, and after the context structure was reorganized several times, the quality of the final result improved clearly. This is an uncontrolled single-case observation, and the reorganization was led by a person. It shows that the situation exists; it is not evidence of a gain under closed conditions.

---

## 6. When Iteration Pays

Iteration by itself creates no value. For a round to pay, it must bring at least one of three things:

- a new observation;
- a verdict independent of the previous draft;
- an object that passed verification and is kept, and that changes the problem the next round has to solve.

With none of the three, the loop is resampling from the same distribution, and it may swing back and forth among several locally reasonable versions.

Existing experiments point the same way, though none was designed to test this claim:

- **V18/V19**: on synthetic tasks with global dependencies and an exact global verifier, completing the whole plan first and then replanning from the complete residual (Stage) is far better than revising step by step while information is still incomplete (Step). In V19, Stage is 33/48 and Step is 5/48, and Stage uses fewer calls. This is secondary evidence in the direction opposite to the preregistration (see [V18/V19](./aggregation-mismatch-v18-v19-step-vs-stage-iteration.md)).
- **V20R**: on low-load long-form writing, the multi-stage process uses about 1.52 times the tokens of direct generation, with no quality gain.
- **V25**: on the high-load subset, post-draft stage repair differs from the fixed process by +0.69 in quality, interval [0, 1.62]; the formal verdict is inconclusive, and tokens are about 4.46 times (for both, see [V20–V25](./aggregation-mismatch-v20-v25-writing-and-stage-repair.md)).

More frequent feedback is not the same as more repair information.

---

## 7. Where Aggregation Mismatch Sits

The statement "aggregation mismatch is the most important mismatch for producing high-quality results" holds only with a condition: the decisive information has already entered the representation, and the objective has been made clear. When the upstream is unresolved, repairing aggregation does nothing.

Two experimental results support this ordering:

- **V4**: externalizing correct information raises cyclic construction from 13/54 to 53/54; an equal count of correct bits at random positions gives 54/54. What worked was the information coming in; structural position showed no additional advantage (see [V4](./aggregation-mismatch-v4-claims-theory-gap.md)).
- **V5**: when the model infers the plan itself, Patch versus Rewrite is 2/96 versus 0/96. When the plan layer does not hold, differences in delivery method have nowhere to show (see [V5](./aggregation-mismatch-v5-stable-editing-agent.md)).

A steadier statement is: once information and objective are in place, aggregation is the hardest layer left. Thinking handles the part "inside a single output", and an agent handles the part "across observations, across checks, across rounds".

---

## 8. Testable Predictions

### 8.1 Design A: Information, Independence, and Persistence

With equal-budget thinking as the baseline, run a 2×2×2 factorial over the three resources:

| Factor | Off | On |
|---|---|---|
| Observation `O` | No tool calls | May read files and run tests |
| Independent assessment `A` | Self-check in the same context | Audit in a new context |
| Persistent state `S` | Each round carries only the previous draft | Carries verified decisions and open items |

Controls:

- All arms use the same model, temperature, and retry rule, with the same total token budget, kept within what a single context can use effectively; the baseline spends all the extra budget on thinking.
- Tasks come in two strata: in **closed tasks** the decisive information is all in `Z`; in **open tasks** the decisive information can be obtained only through tools.
- Add an irrelevant-observation arm: equal-length tool output unrelated to the task, to separate "information" from "a longer context".
- The primary endpoint is final task value under an external criterion. Secondary measures are defect detection rate, false-positive rate of detections, reversal rate between rounds, tokens, and wall time.
- Calibrate difficulty and run a power analysis before freezing the design, to avoid floor and ceiling.

### 8.2 Design B: Scale and Allocation of Computation

Using closed tasks only, test "spreading computation over several contexts" in isolation:

| Arm | Procedure |
|---|---|
| `T(B)` | One thinking pass with budget `B` |
| `T(kB)` | One thinking pass with budget `kB`, within what the service allows |
| `M(k×B)` | `k` contexts that cannot see one another, each with budget `B`, followed by one selection or synthesis step |

Controls:

- Stratify tasks by "the number of structurally different candidates needed for a reliable hit", with at least one stratum clearly above what a single budget `B` can expand.
- `T(kB)` and `M(k×B)` use the same total tokens, so the comparison is about organization; `T(B)` against `M(k×B)` is about scale.
- The selection step comes in two forms: selection by an external criterion, and selection by the model itself. The gap between them shows how much of the gain is held up at selection.
- Other controls are the same as in Design A.

### 8.3 Design C: Reorganization Under Large Inputs

Using closed tasks only, with input size clearly above the effective capacity of a single call:

| Arm | Procedure |
|---|---|
| `W` | Whole context: give the model the entire input, allowing paged browsing and several rounds, with the same total budget as the other arms |
| `R_m` | The model generates the reorganization scheme itself, then selects, re-represents, and splits judgments according to it |
| `R_f` | Fixed generic views that do not depend on the specific material |
| `R_h` | A scheme supplied by a person; an upper bound, marked as containing external information |

Controls:

- Stratify tasks by input size and by density of cross-part dependencies, including a small-input stratum as a negative control.
- All arms use the same total tokens, and the cost of generating the scheme in `R_m` counts against the budget.
- The endpoint is the same as in Design A, with "the share of decisive material that enters the working set" reported as a mediator.
- `R_h − R_m` estimates how much the person's scheme brings in, and `R_f − W` estimates how much generic structure alone provides.
- Tasks and the `W` baseline can reuse the setup in Section 8.2 of the Attention Governance paper; what is new here is treating the source of the reorganization scheme as a factor.

### 8.4 Predictions and Falsification Conditions

| ID | Prediction | What result would overturn it |
|---|---|---|
| P1 | On closed tasks, when the total budget is within the effective capacity of a single context, a multi-round structure with all three factors off does not beat equal-budget thinking | That structure reliably exceeds the preregistered minimum effect |
| P2 | On closed tasks, when the number of candidates needed exceeds what a single budget can expand, `M(k×B)` beats `T(B)` and also beats `T(kB)` at equal total budget; the gap grows with the number of candidates needed | `T(kB)` is no worse than `M(k×B)`, or the gap does not change with the number of candidates needed |
| P3 | The gain from observation rises with the amount of decisive information missing from `Z` and is near zero on closed tasks; the irrelevant-observation arm shows no gain | The observation arm shows a clear gain on closed tasks, or the irrelevant-observation arm shows an equal gain |
| P4 | A new-context audit detects defects that a same-context self-check misses; without an external criterion, this advantage converts only partly into final quality | At equal budget, the two detection rates do not differ |
| P5 | Beyond three rounds, a loop with persistent state keeps improving; a loop without it stalls after the first or second round and has a high reversal rate | The two loops do not differ in final quality or reversal rate |
| P6 | The return on iteration comes mainly from its interaction with `O` or `A`; the main effect of adding rounds alone is near zero | Adding rounds alone gives a stable gain |
| P7 | When the budget cap of a single thinking pass is raised, the agent's gain on closed tasks shrinks, while the gain from observation on open tasks does not | The gains on the two kinds of task shrink together, or neither shrinks |
| P8 | On closed and large tasks, `R_m` beats `W`; the gain rises with input size and density of cross-part dependencies and is near zero in the small-input stratum | `R_m` does not beat `W` in the large-input strata, or the small-input stratum shows an equal gain |

Four of the predictions need a separate note on what they mean:

- If P1 is overturned, "organizing the same computation differently" has value even within capacity, and anchoring and dilution matter more than this paper estimates.
- If P2 is overturned, the effective capacity of a single thinking pass is not below its nominal budget, and "scalable computation" does not stand as a resource.
- P7 is there to separate a difference in degree from a difference in kind.
- If P8 is overturned, a strong whole-context baseline is already enough, and the agent's job in the "closed and large" situation is smaller than this paper estimates.

---

## 9. Evidence Status

Levels follow the [Aggregation Mismatch: Derivable Claims](./aggregation-mismatch-theoretical-claims-agent-engineering.md) paper: T is a conditional theorem that follows from stated assumptions, S is a structural prediction, and E is an empirical proposition that must be measured.

| Claim | Level | Status |
|---|---|---|
| Thinking does not raise the information-theoretic ceiling (Section 3.1) | T | Follows directly from how `D` is generated |
| Conditioning on a complete candidate changes the commitment structure (Section 1) | S | Consistent with the prefix-completion asymmetry in Audit Engineering |
| Externalizing correct information greatly raises construction success | E | Supported by V4; one model, synthetic tasks |
| Materializing fully before revising beats step-by-step revision under incomplete information | E | Secondary evidence from V18/V19, opposite to the preregistered direction |
| Iteration without new information does not pay | E | Not tested directly; V20R negative, V25 inconclusive |
| The effective computational capacity of a single context is below its nominal budget (Section 3.2) | S | Untested; see P1 and P2 |
| Errors of a same-context self-check are correlated with the draft (Section 3.4) | S | Untested; see P4 |
| Gains from computation are absorbed by stronger thinking, gains from information are not (Section 4) | S | Untested; see P7 |
| The agent's job is decided by "is the information in the input" and "does it fit in a single call" (Section 5) | S | Follows from the divisions in Sections 3 and 4; whether the conditions can be measured independently is untested |
| When the input exceeds the effective capacity of a single call, reorganization improves results without external information (Section 5) | E | Untested; see P8. The only existing support is one person-led single-case observation |
| The division into resources and their respective gains (Section 4) | E | Untested; see Section 8 |

---

## 10. Boundaries

- "The effective capacity of a single call" currently has no measurement that is independent of outcomes; it can only be inferred from the effect of trimming the input or adding independent attempts (Section 5.1). Until an independent measurement is given, telling the three situations apart is partly circular.
- This paper does not claim that agents always beat thinking. On closed tasks, as long as the exploration needed fits within the capacity of a single context, the prediction is precisely that there is no gain.
- The resources overlap in implementation: one tool call can bring both information and an independent verdict, and several contexts both enlarge computation and bring independence. Design A relies on task strata and the irrelevant-observation arm to separate them; Design B relies on the equal-total-budget comparison.
- Cost is not part of the claims. Each agent resource costs tokens and time, and the overhead in existing experiments ranges from about 1.5 times to more than 4 times. Whether it is worth it must be judged separately by the task's risk and value.
- "Working set" here is not a description of mechanisms inside the model; it is only bookkeeping for what is available at commit time.
