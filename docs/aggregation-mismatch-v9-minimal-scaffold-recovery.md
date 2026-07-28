# Aggregation Mismatch Artifact-v9: Minimal Scaffold and Verifier Receipt

**Document type:** theory–experiment–data–engineering validation report<br>
**Evidence cutoff:** July 28, 2026<br>
**Overall assessment:** **auditable; scaffold main effects not adjudicated because
of floor; both receipt claims failed their preregistered gates**<br>
**Study family:** `aggregation_mismatch_v9_minimal_scaffold_recovery`<br>
**Schema:** `artifact-v9`<br>
**中文：** [聚合失配 Artifact-v9：最小 Runtime Scaffold 与 Verifier Receipt](./aggregation-mismatch-v9-minimal-scaffold-recovery.zh-CN.md)<br>
**Synchronization rule:** Keep sample sizes, condition results, estimates, verdicts,
limitations, and engineering rules aligned across both versions.

## One-Sentence Result

Artifact-v9 does not confirm independent gains from a visible ready set, a
normalized completed ledger, or more specific verifier receipts: all four scaffold
arms hit a strict-order floor, while located and causal receipts each show a
positive **+12.5-point** estimate over generic rejection but fail the confirmatory
interval and multiplicity gates. This is not evidence of zero effect.

## Technical Summary

Artifact-v9 uses **192 DeepSeek-V4-Flash semantic episodes** to narrow two open
questions from artifact-v8:

1. With staged interaction effort matched, does exposing the current ready set or
   normalized completed ledger independently improve exact DAG construction?
2. Starting from the same frozen erroneous proposal, does a generic, located, or
   causal verifier receipt change one-turn full-layer recovery?

| Claim | Paired estimate | 95% CI | Holm \(p\) | Preregistered verdict |
|---|---:|---|---:|---|
| **V9-A1** ready main effect | +0.0208 | [0, 0.0625] | 1.0 | **Not adjudicated: floor** |
| **V9-A2** ledger main effect | +0.0208 | [0, 0.0625] | 1.0 | **Not adjudicated: floor** |
| **V9-A3** interaction | +0.0417 | [0, 0.125] | — | Secondary |
| **V9-B1** CAUSAL−GENERIC | +0.125 | [−0.0313, 0.2813] | 0.875 | **Failed gate** |
| **V9-B2** LOCATED−GENERIC | +0.125 | [0, 0.2813] | 0.875 | **Failed gate** |
| **V9-B3** CAUSAL−LOCATED | 0 | [−0.0938, 0.0938] | — | Secondary |

The distinctions matter:

- A1/A2 are **not adjudicated**, because every aggregated arm is below 0.10.
- B1 falls short of its +0.15 minimum effect and also fails its CI and Holm gates.
- B2 exceeds its +0.10 point-estimate threshold, but its bootstrap lower bound is
  not strictly above zero and its Holm-adjusted test fails.
- A failed gate means the confirmatory claim was not established; it does not
  establish that the true effect is exactly zero.

## 1. Theory

### 1.1 Why decompose the v8 scaffold package?

Artifact-v8 found that a package consisting of runtime readiness, an external
ledger, and staged interaction outperformed one-shot static construction by 59.4
percentage points. The comparison did not identify which component caused the
gain, and staged effort was not matched.

V9-A exposes two visible fields in a 2×2 design:

\[
Y_i(r,l),\qquad r\in\{0,1\},\ l\in\{0,1\},
\]

where \(r\) indicates a visible ready set and \(l\) a normalized completed ledger.
All four conditions keep staged layer interaction and tool history.

The ready-set main effect is

\[
\Delta_{A1}
=
\operatorname{mean}_i
\frac{
[Y_i(1,0)-Y_i(0,0)]
+
[Y_i(1,1)-Y_i(0,1)]
}{2},
\]

and the ledger main effect is

\[
\Delta_{A2}
=
\operatorname{mean}_i
\frac{
[Y_i(0,1)-Y_i(0,0)]
+
[Y_i(1,1)-Y_i(1,0)]
}{2}.
\]

Passing these gates would support independent field-level contributions. A common
floor prevents that identification.

### 1.2 Why freeze an error before comparing receipts?

V8's local-verifier comparison was ceiling-limited: no VERIFIED episode actually
entered a receipt-to-repair path. V9-B fixes this by starting all three conditions
from the same rejected proposal:

```text
same parents, constants, completed ledger, and rejected assignment
→ vary only receipt specificity
→ one provider turn and one full-layer resubmission
→ same global verifier and commit gate
```

The conditions reveal:

- **GENERIC:** only that the proposal was rejected;
- **LOCATED:** the failed semantic node IDs;
- **CAUSAL:** failed IDs plus recomputable parents, constants, and observed values.

No receipt includes an expected value. This isolates receipt specificity better
than a candidate-audit versus from-scratch generation contrast, but it still only
identifies one fixed repair protocol.

## 2. Experiment

### 2.1 Frozen configuration

| Setting | Value |
|---|---|
| Client / model | `SimpleDeepSeekClientChat / deepseek-v4-flash` |
| Thinking | `False` |
| Temperature / top_p | `0 / 1` |
| Max tokens | 32,000 per provider turn |
| Episode budget | 300 seconds |
| Prompt language | Chinese |
| Primary units | A: 24 DAGs; B: 32 repair cases |
| Bootstrap | 10,000 samples; seed `20260731` |
| Paired test | exact two-sided sign flip |
| Multiplicity | A1, A2, B1, and B2 in one Holm family |

### 2.2 V9-A matrix

Twenty-four new DAGs cover four cells: \(N\in\{24,48\}\) by frontier
\(\in\{4,12\}\), six instances per cell. Each instance runs:

| Condition | Visible ready set | Visible normalized ledger | Staged turns |
|---|---:|---:|---:|
| `A-TRANSCRIPT` | No | No | Yes |
| `A-READY` | Yes | No | Yes |
| `A-LEDGER` | No | Yes | Yes |
| `A-READY-LEDGER` | Yes | Yes | Yes |

Strict success requires the exact next layer, exact order, exact values, complete
coverage, exact rendered object, global-verifier acceptance, governed commit, and
completion within budget.

### 2.3 V9-B matrix

Thirty-two frozen repair cases cross layer width \(\{8,32\}\) with a single-error
or quarter-layer-error regime, eight cases per cell. Each case runs GENERIC,
LOCATED, and CAUSAL once, with the same output contract.

### 2.4 Units and calls

| Module | Instances | Conditions | Semantic episodes | Provider turns |
|---|---:|---:|---:|---:|
| V9-A | 24 | 4 | 96 | 190 |
| V9-B | 32 | 3 | 96 | 96 |
| **Total** | — | — | **192** | **286** |

Provider turns are nested inside semantic episodes and are not independent samples.

## 3. Data Integrity

Independent reconstruction found:

| Audit | Result |
|---|---:|
| Formal expected / observed | 192 / 192 |
| Missing / unexpected / duplicate run keys | 0 / 0 / 0 |
| Pilot | 28/28 |
| Frozen-file SHA mismatches | 0 |
| Spec–endpoint identity mismatches | 0 |
| Events / event run keys | 2,293 / 192 |
| Non-contiguous event indexes | 0 |
| Endpoint–event reconstruction mismatches | 0 |
| Provider-turn / attempt mismatches | 0 / 0 |
| Timeout / transport error | 0 / 0 |
| Expected-value or ground-truth receipt leakage | 0 |

All 14 v9 freeze and harness tests pass. Every episode has one prompt, evaluation,
verifier, and commit-end event. The A exposure flags match the four conditions
exactly; every B episode has one provider turn and one native tool call.

## 4. Results: Ready × Ledger

![V9-A success and token cost](./assets/aggregation-mismatch-experiment/v9-a-factorial-success-cost.png)

| Condition | Exact success | Mean turns | Median tokens | Median wall | Terminal failures |
|---|---:|---:|---:|---:|---|
| TRANSCRIPT | 0/24 | 1.29 | 1,949 | 8.11s | readiness 17; order 7 |
| READY | 0/24 | 2.13 | 3,084.5 | 8.87s | order 24 |
| LEDGER | 0/24 | 2.00 | 3,126 | 8.94s | order 23; readiness 1 |
| READY-LEDGER | 1/24 | 2.50 | 3,158.5 | 8.73s | order 23; success 1 |

Across the 95 failures, 77 terminate at `order` and 18 at `readiness`; none
terminate because of timeout or transport. The single success occurs at
\(N=48,\ frontier=4\), so no \(N\) or frontier cell supplies an identifiable
field comparison.

All 77 order failures have `readiness_ok=true`: the submitted node-ID **set is the
correct next-ready layer**, but its permutation differs from the frozen order.
The gate stops before checking GF(2) values, so those values cannot be called
correct or incorrect. The dominant visible failure is therefore a serialization
acceptance contract, not universal inability to find the ready set.

The evidence supports only:

> Under the v9 \(N=24/48\) matrix and strict full-layer ordered-submission
> contract, independent ready-set and ledger effects cannot be identified.

It does not support “ready sets do not work,” “ledgers do not work,” or “v8 was
overturned.”

## 5. Results: Verifier Receipts

![V9-B receipt recovery](./assets/aggregation-mismatch-experiment/v9-b-receipt-recovery.png)

| Receipt | Exact success | Median tokens | Median wall | Value errors |
|---|---:|---:|---:|---:|
| GENERIC | 26/32 (81.25%) | 2,069.5 | 8.61s | 6 |
| LOCATED | 30/32 (93.75%) | 1,954 | 9.14s | 2 |
| CAUSAL | 30/32 (93.75%) | 2,865 | 10.06s | 2 |

Paired discordance:

| Contrast | Positive / negative / zero | Estimate | 95% CI | Holm \(p\) |
|---|---:|---:|---|---:|
| CAUSAL−GENERIC | 6 / 2 / 24 | +0.125 | [−0.0313, 0.2813] | 0.875 |
| LOCATED−GENERIC | 5 / 1 / 26 | +0.125 | [0, 0.2813] | 0.875 |
| CAUSAL−LOCATED | 1 / 1 / 30 | 0 | [−0.0938, 0.0938] | — |

Width 8 is near ceiling: 15/16, 16/16, and 16/16. At width 32, the three
conditions reach 11/16, 14/16, and 14/16. These are secondary strata, not
preregistered routing rules.

LOCATED and CAUSAL have equal observed success, while LOCATED uses 911 fewer
median tokens. That makes located receipts a good candidate for a future
noninferiority-and-cost study; v9 did not preregister or establish that claim.

## 6. Cost and Adoption

![V9-A success–token frontier](./assets/aggregation-mismatch-experiment/v9-cost-pareto.png)

A reduced scaffold had to satisfy all of the following:

1. its success difference from READY-LEDGER had a 95% CI lower bound of at least
   −0.10;
2. median tokens were at most 75% of READY-LEDGER;
3. it added no commit risk.

TRANSCRIPT met the token rule but its success-difference CI was
[−0.125, 0]. READY and LEDGER met neither combined rule. No reduced arm passed.
Because all arms were at floor, this is not evidence to enable the full scaffold
by default.

## 7. Conclusions

### Supported within the frozen protocol

- The artifact is complete and event-reconstructable.
- V9-A failures are dominated by order/readiness, not budget or transport.
- In all 77 order failures, the semantic ready-ID set is correct and only the
  serialized permutation is rejected.
- Generic rejection already supports a high one-turn repair baseline.
- Located and causal receipts have positive +12.5-point estimates over generic.
- Causal receipts show no observed success gain over located receipts when all
  parents, constants, and ledger state are already visible.

### Not adjudicated

- independent ready-set benefit;
- independent normalized-ledger benefit;
- stable ready-by-ledger interaction;
- a minimum-cost scaffold that preserves full-scaffold success.

### Failed preregistered gates

- a causal receipt improves exact recovery over generic rejection by at least
  0.15 with a positive interval and corrected \(p<0.05\);
- a located receipt improves recovery by at least 0.10 under the same statistical
  requirements.

### Not established

- that visible ready or ledger fields are useless;
- that v8's package effect is false;
- that receipt effects are exactly zero;
- that verification is universally easier than generation;
- cross-model, cross-language, or real-repository validity.

## 8. Theory–Experiment Gap

### 8.1 Structural responsibility reduction is conditional on the contract

A ready set removes one topological-search responsibility, and an external ledger
removes one state-reconstruction responsibility. That structural reduction does
not guarantee a deployment lift under every acceptance rule. In v9, strict
ordered layer submission rejects most episodes before value verification can
reveal a field benefit. In 77 episodes, the ready-ID set is already correct and
only its permutation differs.

This is a measurement floor, not a refutation of runtime state ownership.

### 8.2 Extra receipt detail can be redundant

When the common prompt already exposes parents, constants, the completed ledger,
and the rejected assignment, failed IDs may be enough to recompute the correction.
A causal witness can then reorganize existing facts rather than add new task
information. LOCATED and CAUSAL being tied is consistent with this explanation,
but does not prove universal redundancy.

### 8.3 Positive direction is not a product default

With 32 matched cases, the receipt comparison contains only 6–8 discordant pairs.
The +0.125 estimates may represent a real moderate effect or sampling variation.
Preregistered minimum-effect, interval, and multiplicity gates prevent a
directional estimate from silently becoming a default policy.

## 9. Agent Engineering Implications

1. **Do not decompose package evidence by assertion.** V8 supports a full runtime
   package; v9 does not identify a ready-only or ledger-only gain.
2. **Audit the acceptance contract before adding more context.** An order/schema
   floor can block any benefit from additional state or reasoning.
3. **Let the runtime own canonical order.** If domain semantics require a set of
   ready IDs, validate set equality and canonicalize serialization outside the
   model.
4. **Separate semantic and serialization metrics.** Record
   `semantic_set_exact` independently from `serialization_order_exact`.
5. **Escalate verifier receipts.** Start with generic rejection, add failed IDs
   when needed, and reserve causal witnesses for unresolved or high-risk cases.
6. **Route on success, cost, and risk together.** In this sample, located and
   causal receipts tie on success but differ materially in token cost.
7. **Use three-state experiment governance.** Keep `passed`, `failed_gate`, and
   `not_adjudicated_floor_or_ceiling` distinct.
8. **Persist episode events.** V9's prompt→turn→tool→verifier→commit chain is a
   useful minimum for production recovery and audit.

## 10. Possible Applications

### Code and configuration agents

- compute ready edits from AST/schema dependencies in the runtime;
- accept stable semantic IDs and canonicalize physical order;
- return failed IDs before generating full causal traces;
- keep global tests and schema validation as commit gates.

### Database migration and workflow orchestration

- keep the dependency DAG, completed ledger, and transaction state authoritative;
- dispatch only current-ready operations;
- use constraint or task IDs in receipts;
- treat ordering as runtime compilation unless order itself is business semantics.

### Spreadsheets, documents, and multi-agent systems

- use stable row, claim, section, or task IDs;
- persist formula, citation, and task dependencies outside dialogue;
- escalate receipts from generic to located to causal;
- calibrate escalation with exact success, tokens, latency, and rollback risk.

## 11. Limitations and Next Tests

1. One DeepSeek configuration, Chinese prompts, thinking disabled.
2. One formal run per condition and instance.
3. Synthetic GF(2) DAGs, not real repositories or workflows.
4. V9 uses \(N=24/48\), while V8 used \(N=8/16\); the versions do not form a
   field-only cross-study contrast.
5. Strict within-layer order may reject semantically equivalent sets.
6. Generic receipt recovery is already 26/32, limiting headroom.
7. The common B prompt may make causal receipt content redundant.
8. No multi-turn repair, verifier blind-spot, or false-accept study.

Highest-value follow-ups:

- rerun ready×ledger in an overlapping non-floor range such as \(N=8/16/24\);
- accept ID sets and let the runtime canonicalize order;
- lower the generic-receipt baseline through harder widths or larger samples;
- preregister LOCATED-versus-CAUSAL noninferiority plus a token-cost gate;
- replicate with a second version-fixed model and a real code/configuration task.

## 12. Reproducibility and Sources

- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V9_MINIMAL_SCAFFOLD_RECOVERY_DESIGN.md)
- [Formal report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V9_MINIMAL_SCAFFOLD_RECOVERY_REPORT.md)
- [Independent validation](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V9_MINIMAL_SCAFFOLD_RECOVERY_VALIDATION.md)
- [Machine summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v9_minimal_scaffold_recovery/confirmatory/analysis/summary.json)
- [Endpoint ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v9_minimal_scaffold_recovery/confirmatory/merged_runs.jsonl)
- [Event ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v9_minimal_scaffold_recovery/confirmatory/events.jsonl)

## Related Documents

- [聚合失配 Artifact-v9：中文](./aggregation-mismatch-v9-minimal-scaffold-recovery.zh-CN.md)
- [Aggregation Mismatch Artifact-v8](./aggregation-mismatch-v8-runtime-ownership-routing.md)
- [Aggregation Mismatch and Compositional Governance](./aggregation-mismatch-compositional-governance-llm-systems.md)
- [Aggregation Mismatch: Derivable Claims and Agent Engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Patch vs. Full Rewrite Controlled Experiment](./patch-vs-full-rewrite-controlled-experiment.md)
- [State-Governed Agent Regime](./state-governed-agent-regime-for-governed-llm-systems.md)
