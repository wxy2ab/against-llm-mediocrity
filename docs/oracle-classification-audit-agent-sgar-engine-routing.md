# Oracle, Audit Agent, and SGAR: A Unified Framework from Hard Feedback to Engine Routing

**Oracle Classification, Boundary Fidelity, and Engine Routing**  
**Working Draft v0.1**  

---

## Overview

This paper argues that the right question for a self-improving system is not *whether* to build an audit agent, but *what kind of oracle* a given task exposes — and therefore which repair engine to route to.

It introduces three engines (Audit, SGAR, and No-Go), a taxonomy of fidelity sources, an A/B/C stratification of tasks by oracle quality, and the architectural implications for the ccx system. Throughout, two terms recur: an **audit agent**, which uses recognition to localize the cause of a failure, and **SGAR (State-Governed Agent Regime)**, which uses recognition only as a pass/fail gate over generated candidates.

## Contents

- [0. One-Sentence Conclusion](#0-one-sentence-conclusion)
- [1. Background Problem](#1-background-problem)
- [2. Core Mechanism: Audit Is Failure-Conditioned Oracle Exploitation](#2-core-mechanism-audit-is-failure-conditioned-oracle-exploitation)
- [3. The Key Criterion: Oracle Cost, Bandwidth, and Fidelity](#3-the-key-criterion-oracle-cost-bandwidth-and-fidelity)
- [4. Important Correction: Text Is Not Taste, and Textual Logic Audit Is a Sweet Spot](#4-important-correction-text-is-not-taste-and-textual-logic-audit-is-a-sweet-spot)
- [5. Fidelity Source Taxonomy: Where Task Auditability Comes From](#5-fidelity-source-taxonomy-where-task-auditability-comes-from)
- [6. Task Stratification: A / B / C](#6-task-stratification-a--b--c)
- [7. Audit and SGAR: Two Engines for the Same Asymmetry](#7-audit-and-sgar-two-engines-for-the-same-asymmetry)
- [8. The Three-Engine Map: Audit / SGAR / No-Go](#8-the-three-engine-map-audit--sgar--no-go)
- [9. Architectural Implications for ccx](#9-architectural-implications-for-ccx)
- [10. Deployment Strategies for Different Tasks](#10-deployment-strategies-for-different-tasks)
- [11. Experiments and Metrics](#11-experiments-and-metrics)
- [12. Final Principles](#12-final-principles)
- [13. Final Compressed Version](#13-final-compressed-version)

---

## 0. One-Sentence Conclusion

What truly matters is not "whether to build an audit agent," but rather:

> **When facing a failure or a target, the system must first identify what oracle it has in hand.**
>
> If it has a high-bandwidth, high-fidelity localization oracle, use audit; if it only has a high-fidelity boundary gate, use SGAR; if the boundary is low-fidelity, harden the gate first; if it has neither, honestly choose No-Go and acquire a new fidelity source.

Audit agents and SGAR are not substitute mechanisms for one another. They are two different ways of exploiting the same underlying resource: **generation-recognition asymmetry**.

- **Audit** uses recognition to localize causes: it needs high-bandwidth, high-fidelity answers to "why is this wrong?"
- **SGAR** uses recognition to gate candidates: it does not need to know why, only whether it passes or fails with high fidelity.

Therefore, ccx should not merely build an "audit agent" in the future. It should build a higher-level capability for **oracle classification / engine routing**.

---

## 1. Background Problem

The original question came from text2sql: the builder agent already sees the schema, column samples, column stats, and column descriptions, and has also tried audit-agent-like analysis, yet it still fails easily. By contrast, asking an audit agent to inspect an existing SQL query after failure produces clearly better results.

This is puzzling. From the standpoint of static information, the builder and the auditor receive almost the same inputs. The key question is:

> **What exactly does the audit agent have in addition? Can this mechanism generalize beyond text2sql?**

After discussion, the most valuable answer is:

> The auditor does not necessarily have more prior information; what it has is the witness / oracle exposed after failure, along with a diagnostic task framing.

The builder faces an open-loop generation problem:

```text
spec / intent / priors -> candidate artifact
```

The auditor faces failure-conditioned diagnosis:

```text
spec / intent / priors + failed candidate + failure witness + tools -> diagnosis / evidence / corrective requirement
```

The inputs look similar on the surface, but the problem structure is completely different.

---

## 2. Core Mechanism: Audit Is Failure-Conditioned Oracle Exploitation

### 2.1 The Builder Performs Open-Loop Conjunctive Generation

The builder must satisfy a set of conjunctive constraints in one shot. In text2sql, for example, it must simultaneously choose the correct:

- tables;
- join path;
- join key;
- filters;
- aggregation;
- grouping grain;
- time boundaries;
- entity disambiguation;
- NULL / duplicate / cardinality handling.

If any one of these is wrong, the final answer is wrong. During generation, the builder usually lacks a clear witness to compare against, so it can rely only on priors and internal coherence.

### 2.2 The Auditor Performs Targeted Existential Diagnosis

After failure, the auditor's question becomes:

> Given that this artifact is wrong, identify which local constraint was violated and provide reviewable evidence.

This is not "generate it again." Rather, it is:

```text
hypothesis -> probe/check -> evidence -> refine -> corrective requirement
```

That is, the value of audit does not come from being "smarter," but from a **change in task state**: failure exposes a witness, enabling the system to query the oracle in a closed loop.

### 2.3 This Explains the "Magic" of Text2SQL

Text2sql is a strong example for audit because it simultaneously has:

| Condition | Manifestation in text2sql |
|---|---|
| Low query cost | SQL / CTE / probe queries can be executed repeatedly |
| High bandwidth | rows, counts, join cardinality, gold diff, and intermediate CTEs all provide localization signals |
| Medium-to-high fidelity | very high with gold; even without gold, question intent + rows can construct a medium-fidelity oracle |
| Clear failure witness | the candidate SQL is already known to be wrong, so audit can perform closed-loop diagnosis around that error |

So the reason the text2sql audit agent works is not that it is "better at reading schemas," but that it obtains a failure target that the builder did not have during generation.

---

## 3. The Key Criterion: Oracle Cost, Bandwidth, and Fidelity

Whether a task is suitable for audit should not be judged by task name, but by the oracle.

### 3.1 Three Dimensions

| Dimension | Question | What a high value means |
|---|---|---|
| Cost | Is a single oracle query expensive? | You can afford multiple probing rounds without fearing iteration |
| Bandwidth | How much localization information does the oracle provide? | It does not just say fail, but indicates where the issue may be |
| Fidelity | How close is the oracle to truth? | It is not a proxy story, but something reproducible / recomputable / reviewable |

The value of audit can be roughly written as:

```text
Audit value ≈ fidelity_source_strength
            × evidence_bandwidth
            × low_query_cost
            × diagnosis_to_repair_closeness
            × independence_from_builder_context
            - anchoring_harm
            - audit_cost
```

### 3.2 Definition of Hard Evidence

Hard evidence is not about how confidently the agent speaks. It is:

> Something a third party can rerun, recompute, or reobserve and obtain the same fact.

Different tasks have different forms of hard evidence:

| Task | Example hard evidence |
|---|---|
| Compile / type / runtime | stack trace, file:line, deterministic failing command |
| Unit tests | failing nodeid, minimal repro, assertion diff |
| text2sql | gold rows vs predicted rows diff, join cardinality, intermediate CTE results |
| Textual logic | claim span vs contradiction span, missing support, reviewable localization of non sequitur |
| Quant / ML | per-slice metric, ablation, cost attribution, leakage check, train/test contamination check |

Note that in textual logic, hard usually means **human-reviewable hard / inspectable hard**, not always deterministic hard. It can be highly valuable, but should not be conflated with the mechanical hardness of a proof checker or unit test.

---

## 4. Important Correction: Text Is Not Taste, and Textual Logic Audit Is a Sweet Spot

A previous mistaken model collapsed "text tasks" into taste / stylistic preference. That is incorrect.

Text tasks should at least be split into two categories:

| Text type | Audit properties |
|---|---|
| Logic, arguments, claims, specs, reports, design docs, research summaries | High value, can be locally hard |
| Poetry, brand tone, aesthetics, pure creative preference | Soft, more dependent on taste / judge |

For texts such as claims, insights, specs, and design docs, the source of oracle fidelity does not come from external gold, but from the artifact's internal logical / consistency structure.

Common audit targets include:

- whether a claim is supported by evidence;
- whether the evidence actually supports the claim;
- whether definitions remain consistent throughout;
- whether paragraph 3 conflicts with paragraph 5;
- whether the conclusion follows from the premises;
- whether there is equivocation;
- whether a proxy is written as truth;
- whether speculation is written as fact;
- whether key counterexamples or qualifiers are missing.

### 4.1 Why Audit Feels Especially Natural in Text

In textual logic tasks, the generation-verification asymmetry is very large:

- Writing an argument that is coherent, supported, non-self-contradictory, and whose conclusion is entailed by its claims is a conjunctive generation problem.
- Finding one unsupported claim, one contradiction, or one missing premise is a local existential diagnosis problem.

This is exactly why peer review, editing, and proofreading are more stable than original writing.

### 4.2 In Text, "Diagnosis ≈ Prescription"

In textual auditing, the repair operator for many flaws is quite direct:

| flaw | repair operator |
|---|---|
| unsupported claim | add evidence, or downgrade / delete the claim |
| self-contradiction | reconcile, add scope, or remove one side |
| broken reasoning | add the missing premise |
| term drift | unify definitions, or explicitly distinguish the two concepts |
| overly strong conclusion | narrow the conclusion, add uncertainty |
| evidence does not support claim | replace the evidence, or rewrite the claim |
| granularity mismatch | rewrite the comparison frame |

This makes textual logic auditing even cleaner than text2sql on the axis of "diagnosis to repair closeness."

The boundary is: strong textual logic audit does not imply strong text taste judgment; human-reviewable hard is not the same as deterministic hard.

---

## 5. Fidelity Source Taxonomy: Where Task Auditability Comes From

A better framework than "task type classification" is: what kind of fidelity source can this task invoke?

| # | Fidelity source | Nature | Example |
|---|---|---|---|
| 1 | Logic / consistency | intrinsic, low-cost, localizable | textual arguments, claims, spec consistency |
| 2 | Formal checkers | mechanical hard, high-fidelity | proof checker, type checker, SMT, schema, lint, contract check |
| 3 | Execution vs reference | hard, but needs a reference | tests, gold answer, expected output, SQL result diff |
| 4 | Conservation / invariants | hard core hidden inside soft tasks | accounting identity, dimensions, no-look-ahead, train/test split, cap constraints |
| 5 | Decomposition / counterfactuals | buys bandwidth, not fidelity | per-slice, ablation, gross/net, IC decay, cost attribution |
| 6 | Proxy judge | low-to-medium fidelity | LLM-as-judge, human preference proxy, taste score |

The single most important sentence is:

> **Decomposition buys bandwidth, not fidelity.**

Breaking an IC scalar into per-horizon IC, per-regime IC, and turnover attribution helps the auditor know where to look; but each component may still be noisy, sample-dependent, and non-causal. Decomposition improves localization bandwidth, but does not automatically improve truth fidelity.

What truly buys fidelity is logic, consistency, formal checking, execution references, and invariants.

---

## 6. Task Stratification: A / B / C

### A-Level: Naturally or Locally Hard Oracles, Audit Is Directly Applicable

| Subclass | Example | Main fidelity source | Notes |
|---|---|---|---|
| A1 deterministic hard | type check, unit test, SQL gold diff, schema validation | formal checker / execution reference | can enter the trust root |
| A2 inspectable logical hard | textual claims, spec consistency, argument flaws | logic / consistency | highly reviewable by humans, but usually does not enter the mechanical trust root |
| A3 hidden invariant hard | no-look-ahead, leakage, accounting identity, weight cap | invariants | often hidden inside the soft shell of quant / ML / code |

### B-Level: Oracles Can Be Constructed, Medium Fidelity, the Engineering Frontier

| Task | Default oracle | Constructible enhancement | Result |
|---|---|---|---|
| IC / IR / DSR / net Sharpe | expensive, noisy, low-bandwidth scalar | per-horizon, per-regime, gross/net, turnover, cost sensitivity | upgraded from a soft scalar into a high-bandwidth profile |
| ML gate | accuracy/loss scalar | per-class confusion, error clustering, learning curve, ablation, data probe | more diagnosable, but still noisy |
| weak-oracle code behavior | pass/fail but weak localization | invariant check, trace, property test, contract check | can be locally hardened |

The principle for B-level tasks is:

> Do not directly audit "why is IC low?"; first audit "is there look-ahead?", "is cost attribution consistent?", "which horizon or regime fails?", and "is gross alpha being eaten by cost?"

The outer objective may be soft, but it often contains internally hardenable sub-oracles.

### C-Level: No Cheap High-Fidelity Oracle, Can Offer Priors at Most

Examples:

- pure taste / aesthetics;
- "is this a good research direction?";
- long-cycle real outcomes such as "can this make money next year?" or "will users like this in the long run?";
- tasks whose true oracle lies in the future, or requires expensive RCTs / new data sources.

C-level is not something solvable by "thinking harder for a while." The honest conclusion is usually:

> No constructible oracle currently exists; new data, new experiments, or new evaluation sources are needed, or we must accept that this is only a soft prior.

---

## 7. Audit and SGAR: Two Engines for the Same Asymmetry

The most important advancement from the latest discussion is this: audit and SGAR are not one broad and one narrow; they are complementary along the **bandwidth axis**.

### 7.1 Audit Requires High-Bandwidth Recognition

Audit must answer:

```text
Which constraint is wrong? Why? Where is the evidence? What is the repair direction?
```

Therefore it needs the oracle to provide direction / gradient: file:line, row diff, contradiction span, slice attribution, invariant violation.

If the oracle only returns a noisy scalar, audit tends to fail because there is not enough gradient to follow.

### 7.2 SGAR Only Requires a High-Fidelity Boundary

SGAR does not ask "why did it fail?" It asks only:

```text
Does this candidate pass the gate or not?
```

Its bandwidth requirement for WHY is close to zero. Therefore, when feedback collapses into a scalar, audit may fail, but SGAR may still work.

SGAR's intelligence lies not in recognizing causes, but in:

- generating diverse candidates;
- managing the population;
- retaining states that pass the gate;
- using a ratchet to prevent regression;
- turning random walk into monotonic approximation.

One can say:

```text
Audit = smart recognition + directed repair
SGAR  = dumb recognition (pass/fail) + smart generation/state management
```

### 7.3 SGAR Does Not Eliminate Fidelity, It Relocates Fidelity

This is the most important point.

SGAR appears to need only a boundary and therefore seems less demanding. But it does not escape the fidelity problem; it merely moves fidelity from a hard place to a tractable one:

| Mechanism | What must be proven | Difficulty |
|---|---|---|
| Audit | failure happened because of X | very hard under statistical noise, because it requires causal attribution |
| SGAR | whether a candidate crosses the boundary | can be hardened using hypothesis testing, OOS, FDR, DSR, effective-N, etc. |

The gap between "proving a boundary" and "proving a cause" is exactly the gap between hypothesis testing and causal attribution.

This explains why SGAR can survive where audit dies: the fidelity it needs is boundary fidelity, not causal-reason fidelity.

### 7.4 The Two Failure Modes of SGAR

SGAR has two fatal failure modes:

1. **Insufficient gate fidelity**: the ratchet locks in overfit noise rather than real progress.
2. **Sampling family failure**: the generation family does not cover the target, so no passer exists no matter how large the population is.

Therefore, the engineering focus of SGAR is not on explaining why, but on:

- hardening the gate: OOS, FDR, DSR, effective-N, data-snooping control;
- widening the generation family: richer pools, diversity, orthogonal sources, mutation strategies.

---

## 8. The Three-Engine Map: Audit / SGAR / No-Go

Once oracle quality is laid out, we get a more general routing table.

| Available recognition | Engine to apply | Convergence mode | Engineering action |
|---|---|---|---|
| High bandwidth + high fidelity, can localize causes | Audit | directed descent, few-step repair | diagnosis, evidence, corrective requirement |
| Only a boundary, but it is high-fidelity and cheap | SGAR | population search + ratchet | diverse generation, state management, passer retention |
| Only a boundary, but low fidelity | Hardening first | fix the gate before searching | OOS, FDR, DSR, effective-N, anti-cheating |
| Neither a localization oracle nor a high-fidelity boundary | No-Go | should not be mechanically approximated | acquire a new fidelity source / new data / new experiments |

Pseudocode:

```python
def route(goal_or_failure):
    oracle = classify_oracle(goal_or_failure)

    if oracle.can_localize and oracle.fidelity_high and oracle.bandwidth_high:
        return "AUDIT_MODE"

    if oracle.boundary_available and oracle.boundary_fidelity_high:
        return "SGAR_MODE"

    if oracle.boundary_available and not oracle.boundary_fidelity_high:
        return "HARDEN_GATE_FIRST"

    return "NO_GO__ACQUIRE_NEW_FIDELITY_SOURCE"
```

This is what it means to say: "the endpoint of audit is not stronger audit, but knowing when to switch engines or stop."

---

## 9. Architectural Implications for ccx

### 9.1 Not Just an Audit Agent, but an Oracle-Aware Router

What ccx should build is a meta-capability:

```text
failure / target
  -> oracle classification
  -> engine routing
  -> evidence protocol
  -> iteration policy
```

The routing result should include at least four categories:

| Route | Trigger condition | Behavior |
|---|---|---|
| audit-mode | high-bandwidth localization oracle exists | generate claim/evidence/corrective requirement |
| sgar-mode | only a high-fidelity boundary exists | population generation + ratchet + state management |
| harden-gate-mode | boundary exists but fidelity is low | first do validation design and anti-cheating |
| no-go-mode | no usable oracle exists | stop pseudo-iteration, report the missing fidelity source |

### 9.2 Audit Cannot Enter the Trust Root

An audit agent is a feedback amplifier, not a truth source.

It should satisfy:

- post-gate;
- read-only;
- default-off;
- advisory-only;
- must not flip fail into pass;
- must not trust agent prose;
- only deterministic reproduction / recomputation can be upgraded to confirmed.

From ccx's current investigation, today's audit behaves more like deterministic machine checking than an agent. In failure cases, what the verify-repair loop passes to the next round is mostly raw failing tail, rather than structured claim/evidence/corrective answers. The existing finding ledger already resembles a claim/evidence contract in shape, so the landing point looks more like "adding structured feedback on the red branch" than modifying the verifier.

### 9.3 Finding Contract

It is recommended to unify the finding schema as follows:

```text
claim:                  cause of failure or violated constraint
observed:               concrete observation, must include a handle, not just prose
evidence:               facts supporting the claim
evidence_check:         how to reobserve the issue
fidelity_source:        logic | checker | execution_reference | invariant | decomposition | proxy_judge
hardness_level:         H3 | H2 | H1 | H0
corrective_requirement: constraint that must be satisfied after repair
corrective_answer:      suggested fix, default UNVERIFIED
residual_uncertainty:   portions still not covered by evidence
track:                  audit-agent / sgar / gate-hardening / no-go
```

### 9.4 Hardness Levels

| Level | Meaning | Usable for |
|---|---|---|
| H3 deterministic reproducible | machine-rerunnable, reproducible | confirmed finding / regression guard / trust-adjacent |
| H2 mechanically inspectable | structured evidence, mechanically assisted checking possible | strong hint to builder, but not directly part of the trust root |
| H1 human-reviewable logical | logically reviewable by humans | review finding / textual logic audit |
| H0 advisory / proxy | only a soft judgment or preference | can only serve as a prior, should not drive a hard gate |

### 9.5 Corrective Answers Must Be Downgraded by Default

Audit evidence can be hard, but corrective answers often are not.

For example:

```text
claim: join key is wrong
evidence: current join causes cardinality explosion, gold rows are missing
corrective_answer: should switch to account_id join
```

The first two items may be evidenced, but the last item may still be wrong. Therefore, a corrective answer must default to advisory. It can only be upgraded after the post-fix check passes, or after joint verification by the evidence check and the repaired gate.

---

## 10. Deployment Strategies for Different Tasks

### 10.1 Text / Claims / Design Docs

Strategy: claim graph + evidence ledger + contradiction scan.

The output should not be "this paragraph is unclear," but rather:

```text
claim_id
suspect_span
violated_rule
supporting_span_or_missing_evidence
why_it_fails
repair_operator
minimal_patch
residual_uncertainty
```

Strengths: low cost, high bandwidth, diagnosis is very close to prescription.

Boundary: factual claims that depend on the external world still require external sources; taste-oriented text remains soft.

### 10.2 Text2SQL / NL2Code

Strategy: build executable probes around the failure witness.

Key evidence:

- predicted vs expected rows diff;
- intermediate CTE row counts;
- join path cardinality;
- filter before/after counts;
- entity disambiguation samples;
- aggregation grain mismatch.

Key experiments:

- ablation with and without gold / witness;
- ablation allowing vs forbidding probe SQL;
- same builder under diagnostic prompt vs fresh auditor;
- impact of audit advice on no-progress rescue rate.

### 10.3 Coding Tasks

Strategy: do not re-prove existing hard errors; audit only where localization is weak or the oracle is missing.

Code scenarios suitable for audit:

- coarse-grained failing tests;
- behavioral regression;
- invariant violation;
- unreachable error paths;
- weak-oracle refactors;
- performance / API contract drift.

Scenarios unsuitable for eager audit:

- the compiler already provides a clear file:line;
- the stack trace already localizes the issue;
- the unit test assertion diff is already sufficiently specific.

### 10.4 Quant / IC / IR / DSR / ML Gate

Strategy: when the outer scalar fails, do not explain the cause first; first construct the hardest possible sub-oracle.

For quant:

- no-look-ahead / leakage check;
- label shift correctness;
- gross vs net decomposition;
- turnover attribution;
- per-horizon IC;
- per-regime IC;
- cost sensitivity;
- pool correlation / orthogonality;
- effective-N / data-snooping check.

For ML:

- train/test contamination;
- per-class confusion;
- error clustering;
- data slices;
- ablation;
- seed sensitivity;
- learning curve;
- label quality probe.

Key boundary: these decompositions improve bandwidth, but do not automatically prove causality.

### 10.5 SGAR-Type Targets

Strategy: do not explain why; build hard boundaries and state management.

Must ensure:

- the gate is high-fidelity;
- OOS / FDR / DSR / effective-N are handled correctly;
- the population covers the target space;
- the ratchet does not allow regression;
- passer lineage is recorded;
- overfit lock-in is prevented.

---

## 11. Experiments and Metrics

### 11.1 ROI Metrics for Audit

Do not look only at whether audit "sounds right." Look at whether it improves iteration.

| Metric | Meaning |
|---|---|
| no-progress rescue rate | among cases that would otherwise stall / be abandoned, how many are rescued by audit |
| iteration reduction | whether the average number of repair rounds decreases after audit intervention |
| confirmed finding yield | how many audit findings are confirmed by deterministic checks |
| false-confirm rate | the proportion of wrong claims mistakenly marked as confirmed |
| anchoring harm | the proportion of cases where wrong audit advice slows iteration or sends it off track |
| evidence-to-fix conversion | the proportion of confirmed evidence that ultimately turns into a passing fix |

### 11.2 ROI Metrics for SGAR

| Metric | Meaning |
|---|---|
| OOS retention | how many in-sample passers are retained out-of-sample |
| FDR-controlled pass rate | estimated true-positive proportion among passers |
| effective-N adjusted lift | real improvement after adjusting for multiple attempts |
| lineage diversity | whether passers come from diverse generation families or from a single overfit path |
| ratchet regression rate | whether state management truly prevents regression |
| sampling coverage | whether the generation family covers the target space |

### 11.3 Metrics for No-Go

No-Go is not failure; it is avoidance of fake progress.

A No-Go finding should output:

```text
missing_fidelity_source
why_current_oracle_insufficient
minimum_new_data_or_experiment_needed
expected_cost_to_acquire_oracle
fallback_soft_prior_if_any
```

---

## 12. Final Principles

### Principle 1: Ask About the Oracle Before Asking About the Agent

```text
What is the cheapest fidelity source I can construct that is still localizable?
```

This is the first question for all tasks.

### Principle 2: If You Can Audit a Hard Sub-Oracle, Audit It First

Even if the outer objective is soft, first look for the largest hard subproblem: invariants, leakage, contracts, logic, execution diffs, data consistency.

### Principle 3: Use Decomposition to Buy Bandwidth, Do Not Pretend It Buys Fidelity

A high-bandwidth profile is useful, but it does not automatically become causal proof.

### Principle 4: Audit Does Not Enter the Trust Root

Audit only strengthens feedback on the red branch; it cannot flip fail into pass.

### Principle 5: The Core of SGAR Is Hard Boundaries + Ratcheted State

SGAR does not need why, but it depends heavily on boundary fidelity. If the gate is not hard, the ratchet locks in noise.

### Principle 6: No-Go Is a First-Class Citizen

When there is neither a localization oracle nor a high-fidelity boundary, continued mechanical iteration is pseudo-work. At that point, the system should explicitly report which fidelity source is missing, rather than continue generating more candidates.

---

## 13. Final Compressed Version

> **The essence of an audit agent is failure-conditioned oracle exploitation.**
>
> It is strong on text2sql, textual logic, specs/claims, consistency checks, and executable semantic tasks because failure exposes a cheap, high-bandwidth, relatively high-fidelity localization oracle.
>
> It is weak on pure scalar metric gates because localization bandwidth is missing; in those cases, we should first use decomposition to buy bandwidth, or switch to SGAR.
>
> **The essence of SGAR is boundary-fidelity exploitation.**
>
> It does not ask for reasons. It relies only on a high-fidelity boundary plus ratcheted state management to turn gradient-free search into accumulable monotonic approximation.
>
> When neither a locator oracle nor a boundary oracle exists, the honest answer is No-Go: go acquire new data, experiments, or a new fidelity source.

This framework places audit, text2sql, textual logic audit, quant/ML gates, SGAR, and No-Go into a single decision system:

```text
Classify the oracle first, then choose the engine.
```
