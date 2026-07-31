# Single-Route Decisions: A Synthesis of Frozen RR1–RR7 and RR-v2 Evidence

**Date:** 2026-07-31<br>
**Status:** `evidence synthesis` (no frozen stage, denominator, or Freeze SHA is rewritten)<br>
**Scope:** routing from a task to one Skill, action path, DeliveryMode, recovery action,
or a Top-1 / Rank-Pick / Abstain decision over a single candidate set

**中文：** [单路由决策：RR1–RR7 与 RR-v2 冻结证据综合](./single-route-decision-frozen-evidence-synthesis.zh-CN.md)

**Authoritative source:** This report is synchronized from the frozen Routing
Reliability evidence line in `llm_dealer`. All raw numbers, denominators, and claim
states remain governed by the [upstream decision synthesis](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/SINGLE_ROUTE_DECISION_SYNTHESIS.md),
the corresponding frozen stages, and machine-readable results.

## Technical summary

The experiments did not identify an “intelligent router” that should be enabled
globally by default. They support a set of conditional boundaries:

1. **Execute directly only when external evidence certifies exactly one legal
   candidate.** Across six independent CSP-2R holdout base cases satisfying complete
   registry, validated filter, and single eligible candidate, skipping the picker
   preserved the same e2e and wrong rates as rank-pick while eliminating 100% of
   picker calls.
2. **When several candidates remain or the correct candidate may be absent, raw
   Top-1 cannot replace semantic selection and refusal.** In CSP-1, BM25 Top-1
   achieved e2e=0.583 and wrong=0.417, whereas Top-5→live picker/abstain achieved
   e2e=1.000. CSP-2R nevertheless found that the current picker failed lexical
   traps at e2e=0/12 and wrong=10/12 and was unstable under soft absence. Rank-Pick
   is therefore a conservative fallback, not a universally safe default.
3. **A retrieval score or margin is not a production certificate.** The CSP-2R
   score gate admitted 12/36 base cases with observed wrong=0, but coverage=0.333
   was below 0.40 and the one-sided Clopper–Pearson upper bound≈0.221 exceeded
   0.20. The preregistered stopping rule closes further BM25 score/margin Top-1
   threshold search.
4. **Typed abstention has live-LLM evidence, but only at narrow-canary strength.**
   On 36 lexical-OOD holdout cases with three repeats each, DeepSeek V4 Flash plus
   abstention achieved 106/108 success, wrong=2/108, and legal coverage=1.000 in
   P0-A-ood. This supports retaining and canarying the interface, not enabling it
   globally or extrapolating to natural OOD traffic.
5. **Do not route between equivalent paths; use conditional selection only when
   paths are materially inequivalent.** In RR4, redundant route+compile+duplicate
   invoke increased mean actions from 1 to 4 while success remained 1.0. In the
   planted inequivalent layer of P1-D, the conditional rule achieved D3=1.000,
   while the weakest fixed arm achieved D1=0.250.
6. **Delivery and Failure evidence still does not justify changing production
   defaults.** P0-B-real exercised real writes plus pytest, but always-EXACT and
   sparsity-aware both achieved 1.0. P0-C-exec exercised executable recovery
   operators, but C3 and C4 used the same policy. These mechanisms remain
   experimental harnesses or isolated TRIAGE paths.

The most defensible single-route policy is therefore neither “always Top-1” nor
“always Rank-Pick”:

```text
externally certified unique legal candidate        → direct / Top-1
multiple legal candidates                          → Top-K + picker + explicit abstain
uncertain existence, soft absence, lexical trap    → verifier / confirm / safe stop
raw score or margin only                            → not a production fast-path certificate
known-equivalent action paths                       → disable redundant router
materially inequivalent action paths                → constrained conditional rule
plan error                                          → bounded replan
unknown delivery error                              → stop / escalate; never blind re-emit
```

## 1. Scope: single routing, not workflow orchestration

A single-route decision is one local choice:

```text
R_skill:    task/context → one skill (+ allowlisted tool)
R_action:   observation → one action path
R_delivery: verified plan + runtime signals → one DeliveryMode
R_failure:  classified failure → one recovery action class
```

This report does not adjudicate:

- whether a task was correctly decomposed into a multi-stage workflow;
- the dependency graph, ordering, or intermediate states of
  Skill1→Bridge1→Skill2;
- dynamic rerouting, parallel DAGs, joins, or compensating transactions;
- whether SGAR / SGARX outperforms an ordinary agent;
- end-to-end reliability of multi-Skill orchestration.

Those questions route a complete workflow rather than a Skill name and require a
separate protocol.

## 2. Evidence hierarchy, denominators, and authority

### 2.1 Authority order

When wording differs, this synthesis uses the following order:

1. each stage's frozen result section, claim table, and Freeze section;
2. machine-readable result JSON;
3. post-hoc Decisive Evidence Audit revisions to the permitted extrapolation;
4. roadmap and overview prose.

The post-hoc audit does not alter frozen numbers. It lowers headline claims that
the design did not identify. For example:

- P0-B-real B4=1.0 is not evidence of superiority over always-EXACT because B3
  also equals 1.0;
- P0-C-exec C4=1.0 is not evidence that a stage-aware router beats C3 because both
  arms call the same policy;
- `unsafe_commit=0` is not a production incident-rate bound because the experiment
  never enabled real production commits.

### 2.2 Denominators must not be pooled across experiments

| Evidence set | Independent unit | Main use | Invalid use |
|---|---:|---|---|
| RR1–RR7 | 8–12 planted/stub cases; RR7 has 8 holdout scenarios | instrumentation, boundaries, policy skeleton | real-LLM or production success rate |
| P0-A-ood | 36 holdout cases; 3 reps per case | live chooser + typed abstain | treating 108 reps as 108 independent tasks |
| P0-B-real | 24 holdout cases over only 2 workspace templates | real write+pytest harness | natural-repository extrapolation |
| P0-C-exec | 30 holdout incidents | executable-recovery wiring | natural logs or LLM diagnosis |
| CSP-1 | 36 holdout tasks; 3 reps per arm | Candidate Sort→Pick | claiming a reliability gain at ceiling |
| CSP-2 | 72 holdout cases | first adaptive gate; instrument defect exposure | estimating a clean gate mechanism |
| CSP-2R | 36 holdout base cases; 72 paired risk views | decisive rerun after instrument repair | treating views or reps as larger independent n |

Endpoints, evidence grades, and denominators differ. Mode agreement, stub accuracy,
live e2e, and selective risk must not be plotted as one comparable success ranking.

## 3. From name lookup to a live Skill chooser

### 3.1 Lookup answers “does the name exist?”, not “which Skill is correct?”

RR1 validated the base instrument: oracle name lookup succeeded 8/8; empty
registry, wrong-name, and near-miss-typo refuse rates all equaled 1.0, with zero
wrong accepts. This establishes only that **unregistered names are rejected**.

RR2 then registered the wrong Skill. When a fixed policy selected an existing but
confusable wrong Skill, wrong accept=1.0; random accuracy=0.5 and the keyword/LCP
heuristic≈0.833. The boundary is therefore:

> Registry lookup blocks nonexistent names, but it does not block an existing,
> semantically wrong Skill from execution.

RR3's stub rule table reached accuracy=0.917 on the same 12-case confusion pack,
improving 0.417 over random while remaining 0.083 below oracle. Its `Stub-LLM` is
identical to the rule table, so it validates wiring, not live-LLM capability.

### 3.2 Typed abstention is the strongest live Skill result

P0-A-ood removed direct-answer fields such as `UNAVAILABLE` and `gold_skill`. On
holdout phrases from the same four domains and registry, it produced:

| Arm | e2e | wrong | abstain / coverage | Interpretation |
|---|---:|---:|---:|---|
| A1 random | 0.222 | — | — | lower bound |
| A2 heuristic | 0.250 | — | — | weak rules are insufficient |
| A3 forced choice | 0.630 | 0.370 | abstain disabled | missing Skill forces wrong execution |
| A4 live chooser + abstain | 0.981 | 0.019 | abstain=0.324; legal coverage=1.000 | strongest current live result |

The case-level paired mean for A4−A1 is 0.759, 95% CI [0.611, 0.880]. Results for
clear/confusable/absent are 1.000/0.972/0.972, with infra skip=0.

**Permitted interpretation:** On a same-registry lexical-OOD fixture, DeepSeek V4
Flash followed a constrained `skill | abstain` protocol. When the correct Skill
might be missing, typed abstention sharply reduced wrong execution.

**Not permitted:** natural OOD, transfer across registries or domains, real Skill
executors, cross-model transfer, or production-default validation. The executor
writes only a marker, and absent tasks are easier to reject than realistic adjacent
capability gaps.

## 4. Candidate Sort→Pick mainly improves cost, not reliability

CSP-1 expanded a Skill decision into candidate generation, ranking, Top-K, a live
picker, and abstention, while still making one local route choice:

| Arm | e2e | wrong | tokens≈ | Frozen interpretation |
|---|---:|---:|---:|---|
| S0 full-shuffle pick | 1.000 | 0.000 | 632 | strong picker baseline is at ceiling |
| S1 sorted-all pick | 0.991 | 0.009 | 632 | ordering effect unsupported |
| S2 Top-5→pick | 1.000 | 0.000 | 144 | non-inferior to S0; tokens↓77% |
| S3 oracle Top-K→pick | 1.000 | 0.000 | 124 | retrieval ceiling |
| S4 ranker Top-1 | 0.583 | 0.417 | 0 | substantial errors without picker |

These results support:

- when Recall@5=1.0, Top-K reduces picker tokens by about 77% without lowering
  current e2e;
- picker+abstain has clear value over raw ranker Top-1;
- sorting before showing the picker all candidates has no identified benefit.

They do not establish that Top-K is more reliable than the full set because S0 and
S2 are both at ceiling, nor that K, the ranker, or the token ratio transfers across
models and registries.

## 5. The Top-1 / Rank-Pick boundary is a structural certificate, not a score threshold

### 5.1 CSP-2 first exposed an instrumentation defect

CSP-2 produced Recall@5 legal=0.684 and hard-filter false exclusion=0.458. Relative
to safe rank-pick G1, Adaptive G4 lowered e2e by 0.023 and increased wrong by 0.074;
selective Top-1 coverage=0.167 with wrong=0.5. All A1–A4 claims were unsupported.

This rejected the tested gate, but it could not cleanly show that Top-1 is never
valid because the candidate filter had already removed correct candidates.

### 5.2 After instrument repair, CSP-2R retained only certified uniqueness

CSP-2R repaired legal-gold retention, conditional Recall@5, and end-to-end candidate
recall to 1.000, with false exclusion=0. The formal holdout results were:

| Arm | e2e | wrong | picker call | Conclusion |
|---|---:|---:|---:|---|
| E0 raw Top-1 | 0.667 | 0.333 | 0.000 | no certificate; not a default |
| E1 safe rank-pick | 0.806 | 0.167 | 0.833 | conservative reference, still fallible |
| E2 certified unique | 0.806 | 0.167 | 0.667 | picker↓100% on single eligible |
| E3 score gate | 0.806 | 0.167 | 0.500 | descriptive signal; R2 failed |
| E4 risk-aware gate | 0.806 | 0.167 | 0.667 | picker↓20%; R4 required 25% |
| E5 route oracle | 0.833 | 0.139 | 0.167 | configured upper bound |
| E6 retrieval oracle | 0.806 | 0.167 | 0.833 | identical to E1 |

Confirmatory support is limited to:

```text
complete registry receipt
+ validated filter receipt
+ eligible_candidate_count == 1
→ direct / Top-1
```

The evidence does not support:

- BM25 score/margin as a production fast-path certificate;
- measurable incremental safety from risk context alone;
- the preregistered reliability/cost Pareto for E4;
- stable typed abstention under soft absence;
- universal Top-1 or Rank-Pick defaults.

The 12 R2-admitted base cases had no observed wrong decisions, but coverage=0.333
and the one-sided risk upper bound≈0.221 missed coverage≥0.40 and upper≤0.20. R4
was not a reliability regression: paired E4−E1 e2e and wrong differences were both
zero, but the 20% picker-call reduction missed the 25% minimum-effect gate.

### 5.3 Residual error is currently in the picker, not retrieval

Retrieval oracle E6 and E1 are identical, so improved candidate recall cannot
explain the remaining errors in this fixture:

| Condition (E1/E6 policy views) | e2e | wrong | Diagnosis |
|---|---:|---:|---|
| lexical trap legal | 0/12 | 10/12 | gold is present; picker follows surface similarity |
| soft absent | 10/12 | 2/12 | refusal is unstable when no legal candidate exists |
| hard absent / separated / single / tied | 12/12 | 0/12 | reliable within this fixture |

Rank-Pick cannot be reduced to “pay for one more LLM call and become safe.” It
still needs candidate-existence checks, a contract verifier, confirmation, or an
execution guard.

## 6. Action routing is valuable only when paths are materially inequivalent

Across eight RR4 oracle workspace cases, one `invoke_skill`, one `invoke_tool`, and
the mixed rule all achieved success=1.0. Redundant route+compile+two invokes also
achieved 1.0 but increased mean actions from 1 to 4.

The planted 48-case P1-D contrast then introduced inequivalence in permission,
information, and side effects. Conditional rule D3 achieved e2e=1.000 while fixed
arm D1 achieved 0.250; the equivalent layer remained at success≈1.0 and actions≤1.

The current boundary is:

```text
path_equivalence_known == true        → simplest direct path; router DISABLE
permission/information/effect differs → restricted conditional route
```

P1-D remains a planted stub with no live-LLM action chooser. It does not justify
enabling an Action Router by default; it establishes **path inequivalence as an
enable condition**.

## 7. Delivery routing shows that mode matters, not that a new default wins

In RR5's small planted pack, SparseStub mode agreement=1.0 and Default=0.5.
P0-B-real then wrote real files in isolated workspaces and ran pytest:

| Policy | sparse | dense | Audited interpretation |
|---|---:|---:|---|
| Default INTENT | 0 | 0 | payload was preset as wrong/incomplete; cannot estimate production Default |
| always PATCH | 1.0 | 0 | tested dense payload lacked coverage |
| always EXACT | 1.0 | 1.0 | tied with sparsity-aware at ceiling |
| sparsity-aware | 1.0 | 1.0 | succeeds in fixture; does not beat always-EXACT |

The experiment supports that DeliveryMode can create observable real-write
differences; local PATCH payloads can succeed on single-file tasks and fail on
preset multi-file tasks because of inadequate coverage; and the real write+pytest
evaluation chain is operational.

It does not support adding sparsity/density to `DefaultDeliveryRouter`, claiming
sparsity-aware superiority over always-EXACT, or treating the tested PATCH as a
real hunk editor. There are only two workspace templates, and changed lines,
rollback, retry, tokens, and unintended surface are insufficient for a Pareto claim.

## 8. Failure routing must distinguish choosing a recovery from recovering

RR6's stub results show stage-aware replan improving plan-error recovery from 0 to
1.0 relative to generic retry. For delivery error, re-emit and stage-aware recovery
both remained at 0. This supports bounded replan for plan error and rejects generic
retry as a repair mechanism.

P0-C-exec moved recovery operators into real file writes plus pytest: pre-mapped
operators recovered 20/20 planted positives and correctly stopped 10/10 negatives.
The post-hoc audit nevertheless found:

- C3 and C4 both called `policy_from_error_text`, so no independent router gain was
  identified;
- error text and workspace structures were highly repetitive;
- negatives contained an explicit fatal marker;
- operators read target content from an `EXPECTED` file;
- there was no live-LLM diagnosis, noisy logging, compound failure, or multi-step
  recovery.

The current policy is therefore:

```text
plan_error                    → bounded replan + re-verify
known mapped delivery subtype → isolated deterministic TRIAGE + verifier
unknown/noisy delivery error  → stop / escalate
blind retry or blind re-emit  → DISABLE
```

## 9. RR7 is a policy skeleton, not production-benefit evidence

Using runtime-visible features only, RR7 produced NB(B0 all-disable)=0, B1=0.570,
B2 budgeted=0.463, and B3 random≈0.224 over eight holdout scenarios, while forcing
delivery-error recovery to DISABLE. It establishes that the frozen boundaries can
be encoded in an ENABLE/TRIAGE/DISABLE skeleton.

RR7 utility comes from planted scenarios and a hand-defined λ=0.1. It omits complete
token, latency, rollback, changed-surface, and natural-traffic error matrices. It
must not be read as “this policy yields 0.570 production benefit”; P1-E remains
deferred.

## 10. Current executable single-route defaults

### 10.1 Decision table

| Routing layer | Condition | Current action | Evidence grade |
|---|---|---|---|
| Skill | registry≤1 or caller has a certified Skill ID | no chooser; direct by name | RR1 instrument + RR7 skeleton |
| Skill | several legal candidates; correct one may be absent | Top-K→picker with typed abstain | CSP-1 efficiency; P0-A-ood live canary |
| Skill | complete registry + validated filter + one legal candidate | skip picker; direct | CSP-2R R1 supported |
| Skill | only score/margin is high | not a direct certificate | CSP-2R R2 unsupported + stop rule |
| Skill | lexical trap / soft absence / high risk | verifier/confirm after picker; safe stop allowed | CSP-2R residual failures |
| Action | paths equivalent | shortest direct path; disable redundant route | RR4 supported |
| Action | permission, information, or side effects differ | constrained conditional rule; no default live LLM | P1-D fixture-supported |
| Delivery | current production path | retain `DefaultDeliveryRouter` | P0-B-real has no replacement Pareto |
| Failure | plan error | bounded replan + re-verify | RR6 supported in stub |
| Failure | mapped delivery subtype | isolated TRIAGE + post-verifier | P0-C-exec fixture-supported |
| Failure | unknown delivery error | stop/escalate; never blind re-emit | RR6 + P0-C audit |

### 10.2 Reference pseudocode

```text
route_skill(task, registry, receipts, risk):
    if receipts.complete_registry
       and receipts.validated_filter
       and eligible_count == 1:
        return DIRECT(unique_candidate)

    if eligible_count == 0 and hard_absence_is_certified:
        return ABSTAIN

    candidates = retrieve_top_k(task)
    if candidate_recall_not_validated:
        return TRIAGE("instrument/retrieval uncertain")

    choice = picker(candidates, allow_none=true)
    if choice.none or risk.high or verifier.weak:
        return CONFIRM_OR_SAFE_STOP(choice)
    return EXECUTE_WITH_GUARD(choice)

route_action(context):
    if path_equivalence_is_certified:
        return SHORTEST_DIRECT_PATH
    return RESTRICTED_RULE_ROUTE

route_failure(failure):
    if failure.layer == PLAN_ERROR:
        return BOUNDED_REPLAN
    if failure.subtype in VALIDATED_ISOLATED_OPS:
        return TRIAGE_WITH_POST_VERIFY
    return STOP_AND_ESCALATE
```

This is an evidence synthesis, not a committed production implementation. The
`receipts`, candidate-recall verifier, execution guard, and natural-task error
matrix still require productization.

## 11. Supported, partial, and explicitly unpromoted claims

### 11.1 Supported

- unregistered Skill names are rejected; registered but confusable wrong Skills
  may still execute;
- live typed abstention sharply reduces wrong execution in the tested lexical-OOD
  fixture;
- with validated Recall@5, Top-K substantially reduces picker tokens without
  lowering current e2e;
- raw ranker Top-1 cannot replace picker/abstain;
- externally certified uniqueness permits skipping the picker;
- redundant Action routing has no value when paths are equivalent;
- conditional rules can add value under planted path inequivalence;
- real write+pytest Delivery/Recovery evaluation paths are operational;
- plan error and delivery error require different recovery boundaries.

### 11.2 Partially supported or fixture-limited

- typed abstention may enter shadow/canary, not global default;
- Top-K→picker is a cost optimization, not a confirmed reliability gain here;
- score gate shows a descriptive 12/36 with zero wrong, but fails confirmation;
- risk-aware gate reduces picker calls by 20%, below the 25% minimum effect;
- DeliveryMode depends on task structure, but sparsity-aware does not beat strong
  fixed EXACT;
- five delivery-recovery operators execute, but only in isolated TRIAGE.

### 11.3 Explicitly forbidden claims

- an LLM Skill Router is ready as a production default;
- Top-1 or Rank-Pick is universally optimal;
- raw BM25 score/margin proves that Top-1 is safe;
- typed abstention is generally reliable for natural adjacent capability gaps or
  soft absence;
- risk context is useless for all high-risk tasks;
- density should be added to `DefaultDeliveryRouter`;
- PATCH or sparsity-aware routing generally beats EXACT in real repositories;
- C4 stage-aware recovery beats C3, or delivery errors are generally recoverable;
- `unsafe_commit=0` is a production incident-rate upper bound;
- one-model, one-fixture results transfer directly across registries, domains,
  models, and tools;
- single-route experiments validate task decomposition, Workflow, SGAR, or complex
  orchestration.

## 12. Limitations, robustness, and open questions

### 12.1 Main limitations

- Live evidence uses only DeepSeek V4 Flash; there is no cross-model confirmation.
- P0-A-ood changes phrase libraries, not registry, domain, or true Skill semantics.
- P0-A's Skill executor writes a marker instead of invoking a real tool chain.
- P0-B-real has only two workspace templates, with payload quality preset by the
  fixture.
- P0-C-exec exposes explicit failure clues and `EXPECTED` oracle content.
- CSP-1/CSP-2R use planted candidate fixtures; picker lexical-trap failures may
  depend on prompt, registry, and model configuration.
- Cost coverage is incomplete, preventing unified production net-benefit or budget
  calibration.
- Most `unsafe=0` observations come from isolation and disabled production commit,
  not a sufficiently large risk sample.

### 12.2 Highest-value next single-route studies

1. **Picker robustness:** keep the correct candidate in-set and isolate lexical
   traps, pairwise contrast, claim-evidence selection, and verifier assistance.
2. **Candidate existence:** separate “does any legal candidate exist?” from “which
   one?”, focusing on soft absence and adjacent capability gaps.
3. **Real Skill executors:** reproduce typed abstention with new registries, new
   domains, real side effects, and realistic error matrices.
4. **Fair Delivery comparison:** generate PATCH/EXACT/INTENT payloads through the
   same planner/editor over real historical diffs, measuring rollback, unintended
   surface, tokens, and latency.
5. **Real Failure diagnosis:** remove fatal markers and `EXPECTED`; use noisy logs,
   compound failures, and real plan artifacts so deterministic mapping, LLM
   diagnosis, and stage-aware routing are actually different.
6. **Independent-model replication:** replicate only effects that survive the
   realism upgrades above.

Workflow and complex orchestration are not part of this list. They need an
independent task population, workflow verifier, and endpoint and must not be added
to the single-route denominator.

## 13. Frozen evidence index

| Evidence | Freeze / commit | Primary result source |
|---|---|---|
| RR1 | `8d591e264` | [name-router baseline](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR1_protocol_baseline.md) |
| RR2 | `ed41d1925` | [registered confusion](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR2_skill_confusion.md) |
| RR3 | `4b7371b91` | [stub chooser](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR3_skill_chooser.md) |
| RR4 | `9458045d3` | [action equivalence](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR4_action_sequence.md) |
| RR5 | `ce4c6be58` | [delivery mode stub](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR5_delivery_mode.md) |
| RR6 | `917af9fbf` | [failure layer](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR6_failure_layer.md) |
| RR7 | `721efc573` | [enable policy skeleton](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability/stages/RR7_enable_policy.md) |
| P0-A-live | `8a7659f6c` | [live Skill routing](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_P0A_live_llm.md) |
| Decisive P0-A/B/C | `77aac4660` | [evidence audit](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/RRV2_DECISIVE_EVIDENCE_AUDIT.md) |
| CSP-1 | `828a86d73` | [Candidate Sort→Pick](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_CSP1_candidate_sort_pick.md) |
| CSP-2 | `2f409ead3` | [Adaptive Gate](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_CSP2_candidate_adaptive_gate.md) |
| CSP-2R | `499d9f645`; record `2a99430a1` | [Instrument Repair](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/stages/RRV2_CSP2R_instrument_repair.md) · [Result analysis](https://github.com/wxy2ab/llmdealer/blob/main/core/agent_runtime/docs/routing_reliability_v2/RRV2_CSP2R_RESULT_ANALYSIS.md) |

This is the decision-facing synthesis. It neither promotes stub pilots to a
production default nor merges single-route evidence into Workflow, SGAR, S/CF/G/AA,
or aggregation-mismatch V6 claims.
