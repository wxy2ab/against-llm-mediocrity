# Aggregation Mismatch Artifact-v15: Intent Conflict Governance

**Document type:** Theory–experiment–data–engineering validation report

**Evidence cutoff:** July 30, 2026

**Overall assessment:** **The machine primary passes; share the artifact with
protocol caveats**

**Study family:** `aggregation_mismatch_v15_intent_conflict_governance`

**Schema:** `artifact-v15`

**中文：** [聚合失配 Artifact-v15：Intent 冲突治理](./aggregation-mismatch-v15-intent-conflict-governance.zh-CN.md)

**Bilingual synchronization rule:** sample sizes, estimates, verdicts,
limitations, and engineering rules must remain aligned across both versions.

## One-sentence conclusion

In this synthetic, single-model protocol, all 72 conflict-arm first commits are
safely rejected; the policy that terminates after rejection finishes 0/24,
while policies that permit one runtime-governed rebase finish 24/24 for both
Intent and Exact. The Intent-Rebase minus Intent-Naive effect is +1.0, but the
contrast mainly identifies recovery permission, not a general model capability,
and the frozen Pilot Gate text differs from the implemented gate.

## Technical summary

| Item | Result |
|---|---:|
| Formal / pilot / offline | **96/96** / **12/12** / **768/768** |
| Formal tasks / conditions | 24 / 4 |
| Formal raw events | **1,594** |
| Provider turns / transport attempts | **144 / 144** |
| Endpoint reconstruction mismatch | 0 |
| Seal before drift | 96/96 |
| Conflict-arm first-attempt commit | **0/72** |
| Compatible Intent | **24/24** final; **24/24** first attempt |
| Conflict Intent Naive | **0/24** final; recovery forbidden |
| Conflict Intent Rebase | **24/24** final; **24/24** recovery |
| Conflict Exact Rebase | **24/24** final; **24/24** recovery |
| V15-A1 | **+1.0**; 95% CI **[1.0, 1.0]** |
| Exact sign-flip | \(2/2^{24}=1.1921\times10^{-7}\) |
| Machine claim state | **`passed`** |
| Evidence-sharing state | **`share_with_caveats`** |
| Formal tokens | **1,633,317** |
| Unsafe / leak / over-budget success | 0 / 0 / 0 |
| V15 tests | **27 passed** |

## 1. Theory

### 1.1 Conflict safety and conflict recovery are separate decisions

For sealed operation \(Q_0\), current authoritative state \(S_1\), lock set
\(L\), and invariant set \(I\), safe commit requires:

\[
\operatorname{pre}(Q_0,S_1)
\land \operatorname{lock\_ok}(Q_0,L)
\land \operatorname{verify}(\operatorname{apply}(Q_0,S_1),I).
\]

If `lock_ok` is false, rejection is correct. It does not determine whether the
episode should terminate. A separate governor chooses among:

```text
wait
→ re-read and rebase once
→ full replan
→ human escalation
→ terminal reject
```

The safe substrate is theoretically motivated: rejected writes must not mutate
state, and recovery authority must be explicit. The success advantage of one
policy over another remains empirical and workload-dependent.

### 1.2 Intent and Exact use different recovery compilers

- **Intent-Rebase** reinterprets a constrained goal against the new state.
- **Exact-Rebase** uses the conflict receipt to rebuild located old/new
  preconditions.
- **Intent-Naive** receives the same conflict but is not authorized to recover.

The V15 primary therefore compares recovery governance, not only payload
representation. It cannot by itself show that Intent is superior to Exact.

## 2. Experiment

- DeepSeek-V4-Flash, Chinese prompts, temperature 0, `thinking=False`;
- maximum 32k tokens and one shared 300-second semantic-episode budget;
- 24 formal tasks: eight each at \(N\in\{96,144,216\}\);
- four conditions per task: Compatible Intent, Conflict Intent Naive, Conflict
  Intent Rebase, and Conflict Exact Rebase;
- payload seal before drift, lock-aware atomic apply, global verification,
  commit/rollback, and append-only events;
- at most one governed recovery in the two Rebase arms;
- 10,000 task-cluster bootstrap resamples and exact two-sided sign-flip test.

The study isolates a controlled conflict/recovery policy after a verified goal
and plan. It does not test autonomous planning, real Git merges, or arbitrary
multi-writer semantics.

## 3. Data integrity

The 96 formal run keys are complete and unique. The 1,594 formal events have
continuous per-run indices and unique terminals; all endpoints reconstruct
with zero mismatch. Total formal tokens independently recompute to 1,633,317,
with 144 provider turns and 144 transport attempts.

The 768 offline cases report zero false accept, false reject, input mutation,
and payload mutation. All formal runs seal before drift; unsafe commit, leakage,
and over-budget success are zero. The verification script passes and 27 V15
tests pass.

## 4. Data and results

### 4.1 First attempt and final success

![V15 first-attempt and final success](./assets/aggregation-mismatch-experiment/v15-first-vs-final.png)

| Condition | First-attempt commit | Recovery success | Final success |
|---|---:|---:|---:|
| Compatible Intent | 24/24 | — | 24/24 |
| Conflict Intent Naive | 0/24 | 0/24, forbidden | 0/24 |
| Conflict Intent Rebase | 0/24 | 24/24 | 24/24 |
| Conflict Exact Rebase | 0/24 | 24/24 | 24/24 |

All 72 conflict first attempts are rejected rather than partially applied.
Intent-Rebase minus Intent-Naive is:

\[
\Delta_{A1}=1.0,\qquad 95\%\ CI=[1.0,1.0],\qquad
p_{\mathrm{exact}}=1.1921\times10^{-7}.
\]

![V15 Rebase–Naive effect](./assets/aggregation-mismatch-experiment/v15-rebase-naive-effect.png)

The machine primary passes its minimum-effect and safety gates.

### 4.2 Cost of governed recovery

![V15 provider turns and wall time](./assets/aggregation-mismatch-experiment/v15-turns-wall.png)

| Condition | Median tokens | P90 tokens | Provider turns |
|---|---:|---:|---:|
| Compatible Intent | 14,623 | 21,549.3 | 24 |
| Conflict Intent Naive | 14,623 | 21,549.3 | 24 |
| Conflict Intent Rebase | 17,467 | 25,399.5 | 48 |
| Conflict Exact Rebase | 18,115.5 | 26,228.6 | 48 |

Recovery adds a second provider turn. Exact and Intent Rebase both finish
24/24, so this experiment does not establish a reliability ranking between
them.

## 5. Conclusions and claim boundaries

### Supported

- The tested lock conflict is detected before mutation in 72/72 first attempts.
- A typed conflict receipt plus one runtime-authorized rebase completes 48/48
  Rebase episodes in this harness.
- Terminal-on-conflict and rebase-once policies have sharply different final
  endpoints under otherwise matched Intent conflict tasks.
- The event ledger, safety gates, and offline executor are mechanically
  auditable.

### Not supported

- The model independently acquired general conflict-resolution ability.
- Intent is more reliable than Exact.
- Every conflict should be automatically rebased.
- The effect transfers across models, languages, production repositories, or
  multi-writer systems.
- Rebase remains safe for ambiguous, non-monotone, or mutually exclusive goals.

### Protocol caveat

The frozen design text says every Pilot condition must reach at least 2/3 final
success. That is incompatible with the Naive arm, whose definition forbids
recovery and expects a terminal locked conflict. The implementation applies the
2/3 gate only to non-Naive arms and applies a separate data-quality check to
Naive; the Pilot is 3/3 for each non-Naive arm and 0/3 for Naive. Formal
execution followed the implementation gate, not the literal frozen sentence.

The frozen turn-count estimates also say 120 formal and 15 pilot turns; the
four-arm protocol with two second-turn recovery arms implies 144 and 18. The
formal artifact records the correct 144 turns.

These deviations do not change the recomputed formal effect, but they prevent a
claim of full preregistration conformance. The appropriate share verdict is
`share_with_caveats`.

## 6. Theory–experiment gap

| Theory or design claim | V15 evidence | Remaining gap |
|---|---|---|
| Locked writes must reject before mutation | 72/72 rejected; unsafe=0 | Real side effects and distributed locks |
| Recovery permission belongs to runtime policy | Rebase 48/48 vs Naive 0/24 | Matched active-control factorial |
| Typed receipt can support local recovery | Intent and Exact 24/24 | Generic/located/causal randomized comparison |
| One rebase can preserve episode identity | 144 turns under 96 run keys | Crash/replay and repeated conflicts |
| Intent can be recompiled against current state | 24/24 tested recovery | Ambiguous and non-monotone goals |

## 7. Engineering meaning

1. **Separate rejection from recovery policy.** Executors detect conflicts;
   governors decide whether to wait, rebase, replan, escalate, or stop.
2. **Return a typed conflict receipt.** Include target ID, base/current
   versions, observed value, lock owner or conflict class, and allowed actions.
3. **Bound recovery.** Permit a fixed number of attempts under the original run
   key, shared budget, and idempotency key.
4. **Re-read authoritative state.** Never rebase from conversational memory.
5. **Verify again before commit.** Recompiled payloads must repeat
   precondition, lock, invariant, atomicity, and global verification gates.
6. **Do not encode expected failure as a success gate.** Protocol validators
   must understand negative-control semantics; frozen text and executable gates
   must be generated from one specification.

## 8. Potential applications

- **Code agents:** reject a stale or locked patch, reread the symbol, rebase once,
  rerun tests, or escalate a semantic conflict.
- **Configuration agents:** resolve stable IDs against current state and
  recompile constrained Intent after a version conflict.
- **Database migration:** treat lock/schema-version conflicts as typed states,
  never generic retry.
- **Multi-agent workflows:** make conflicting subplans wait or rebase under a
  central governor instead of last-writer-wins.
- **Long-running tools:** preserve episode identity and idempotency across
  prepare, seal, reject, recover, and commit.

## 9. Next steps

1. Replicate with a second model and English prompts.
2. Replace the structurally disabled Naive control with matched active controls:
   generic retry, reread-only, full replan, and human escalation.
3. Transfer to real Git conflicts, JSON configuration merges, and database
   migrations.
4. Add repeated conflicts, crash/replay, multiple writers, and non-monotone
   Intent.
5. Generate frozen prose gates and executable validators from one machine
   specification.

## Related documents

- [V1–V12, V14, and V15 experiment summary](./aggregation-mismatch-v1-v12-v14-v15-experiment-summary.md)
- [V1–V12, V14, and V15 agent engineering lessons](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v15.md)
- [Artifact-v14: Post-Compile Drift and Exact Recovery](./aggregation-mismatch-v14-post-compile-drift-recovery.md)
- [Theoretical claims and agent engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Aggregation mismatch and compositional governance](./aggregation-mismatch-compositional-governance-llm-systems.md)

## Source artifact

- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V15_INTENT_CONFLICT_GOVERNANCE_DESIGN.md)
- [Formal report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V15_INTENT_CONFLICT_GOVERNANCE_REPORT.md)
- [Independent validation](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V15_INTENT_CONFLICT_GOVERNANCE_VALIDATION.md)
- [Machine summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v15_intent_conflict_governance/confirmatory/analysis/summary.json)
