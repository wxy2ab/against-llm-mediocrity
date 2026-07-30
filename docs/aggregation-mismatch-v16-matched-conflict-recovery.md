# Aggregation Mismatch Artifact-v16: Matched Conflict Recovery

**Document type:** Theory–experiment–data–engineering validation report

**Evidence cutoff:** July 30, 2026

**Overall assessment:** **Machine primary passed; share with protocol-metadata and causal-scope caveats**

**Study:** `aggregation_mismatch_v16_matched_conflict_recovery` / `artifact-v16`

**中文：** [聚合失配 Artifact-v16：匹配冲突恢复](./aggregation-mismatch-v16-matched-conflict-recovery.zh-CN.md)

## One-sentence conclusion

With the number of provider turns matched, Generic Retry and Reread Only remain
locked and finish 0/24, while runtime Unlock + Rebase finishes 24/24. V16
therefore supports “retry without an authoritative state transition is not
recovery,” but it does not separate recovery authority, execution state,
target-state information, and model replanning.

## Technical summary

| Item | Result |
|---|---:|
| Formal / pilot / offline | **96/96** / **12/12** / **768/768** |
| Formal tasks / conditions | 24 / 4 |
| Formal events | **1,752** |
| Provider turns / transport attempts | **168 / 168** |
| Compatible Intent final success | **24/24** |
| Conflict Generic Retry final success | **0/24** |
| Conflict Reread Only final success | **0/24** |
| Conflict Rebase Once final success | **24/24** |
| Conflict first-attempt commit | **0/72** |
| V16-A1 Rebase−Generic | **+1.0**; 95% CI **[1.0, 1.0]** |
| Exact sign-flip | \(2/2^{24}=1.1921\times10^{-7}\) |
| Minimum-effect gate | +0.25; **passed** |
| Machine claim state | **`passed`** |
| Evidence-sharing state | **`share_with_caveats`** |
| Formal tokens | **1,983,686** |
| Unsafe / over-budget success | 0 / 0 |
| V16 tests | **29 passed** |

## 1. Theory

A conflict receipt is evidence that the sealed operation cannot commit against
the current authoritative state. It is not itself a state transition.

For state \(S\), lock set \(L\), operation \(Q\), and invariant set \(I\):

\[
\operatorname{commit}(Q,S)
\Rightarrow
\operatorname{pre}(Q,S)
\land \operatorname{lock\_ok}(Q,L)
\land \operatorname{verify}(\operatorname{apply}(Q,S),I).
\]

If `lock_ok` remains false, a larger prompt or another provider turn cannot
make commit valid. A recovery attempt becomes meaningful only after the runtime
changes authoritative state or authority and revalidates preconditions.

This gives an engineering invariant:

```text
retry requested
+ authoritative state/authority unchanged
→ reject, wait, or escalate

retry requested
+ authoritative state transition completed
+ preconditions revalidated
→ permit one bounded recovery attempt
```

The theorem-like safety rule does not imply that information never matters.
After unlock, the model may still need a current target slice or structured
rebase plan.

## 2. Experiment

- DeepSeek-V4-Flash; Chinese; temperature 0; `thinking=False`;
- one shared 300-second semantic-episode budget; maximum 32k tokens;
- 24 tasks: eight each at \(N\in\{96,144,216\}\);
- four conditions per task:
  - **Compatible Intent:** first-attempt commit;
  - **Generic Retry:** lock rejection, then receipt + goal plan while still in locked \(S_1\);
  - **Reread Only:** lock rejection, then receipt + full old repository while still in locked \(S_1\);
  - **Rebase Once:** lock rejection, runtime unlock to \(S_2\), then receipt + target-state slice;
- all three conflict arms receive exactly one second provider turn;
- atomic apply/rollback, global verification, append-only events, and exact
  task-paired statistics.

Turn opportunity is matched. Recovery authority and execution state are not:
only Rebase receives programmatic unlock.

## 3. Data integrity

All 96 formal run keys are present and unique. The 1,752 events have unique
`(run_key,event_index)` pairs and rebuild all 96 endpoints without mismatch.
All 72 conflict first attempts reject without commit; Generic/Reread have zero
final commits; unsafe commit, input mutation, payload mutation, and prompt leak
are zero. The offline executor passes 768/768 cases, and 29 V16 tests pass.

### Protocol-metadata deviation

The design Markdown and executable Pilot gate agree: Compatible and Rebase
must reach at least 2/3 final success, while Generic and Reread must not be 3/3
successful. The frozen `design_manifest.json`, however, retains a stale
`pilot_gate.stop_if` sentence saying that *any* condition below 2/3 should stop.
That contradicts the negative-control semantics in the same manifest.

Formal execution followed the executable gate after Pilot results of 3/3,
0/3, 0/3, and 3/3. The recomputed formal effect remains valid, but full
preregistration-conformance wording is not.

## 4. Data and results

![V16 first attempt versus final success](./assets/aggregation-mismatch-experiment/v16-first-vs-final.png)

| Condition | First-attempt commit | Second turn | Final success |
|---|---:|---:|---:|
| Compatible Intent | 24/24 | — | 24/24 |
| Conflict Generic Retry | 0/24 | 24/24, still locked | 0/24 |
| Conflict Reread Only | 0/24 | 24/24, still locked | 0/24 |
| Conflict Rebase Once | 0/24 | 24/24, unlocked | 24/24 |

\[
\Delta_{A1}
= P(\text{Rebase success})-P(\text{Generic success})
=1.0.
\]

The 95% bootstrap interval is [1.0, 1.0], and the exact two-sided sign-flip
\(p=1.1921\times10^{-7}\). The preregistered machine primary passes.

![V16 Rebase minus Generic effect](./assets/aggregation-mismatch-experiment/v16-rebase-generic-effect.png)

Reread consumes substantially more context but does not change the locked
state:

| Condition | Median tokens | P90 tokens | Median wall time |
|---|---:|---:|---:|
| Compatible Intent | 14,608.5 | 21,545.0 | 5.98 s |
| Generic Retry | 16,938.0 | 24,672.0 | 10.17 s |
| Reread Only | 29,589.0 | 43,589.4 | 10.57 s |
| Rebase Once | 17,439.0 | 25,400.2 | 9.99 s |

Within this locked-state comparison, more old-state context raises cost without
raising success. It does not prove that information is generally irrelevant
after a valid state transition.

## 5. Conclusions and theory–experiment gap

### Supported

- Same-state Generic Retry and full old-state Reread are insufficient to
  override a valid lock.
- Runtime Unlock + Rebase + target-state slice is sufficient in this frozen
  synthetic protocol.
- Matching a second model call does not match recovery authority.
- Typed rejection, no-mutation safety, bounded recovery, event reconstruction,
  and atomic commit work mechanically in the tested harness.

### Not supported

- A pure information effect, pure state effect, or model reasoning effect;
- that context is never useful during recovery;
- that every conflict should be automatically rebased;
- transfer across models, languages, real Git repositories, databases, or
  distributed multi-writer systems;
- safe handling of ambiguous, non-monotone, or repeated conflicts.

### Remaining causal gap

Rebase changes three factors together: authority, executable state, and visible
target-state information. A decisive factorial must hold unlock and \(S_2\)
constant while randomizing receipt-only, old-state, target-slice, and structured
rebase-plan information.

## 6. Engineering meaning

1. **Retry requires a state-transition precondition.** Check lock, version,
   lease, and authoritative hash before spending another model call.
2. **Do not use context growth as a substitute for governance.** Rereading a
   locked old state can increase tokens without creating commit authority.
3. **Separate rejection from recovery.** Executors reject; a conflict governor
   chooses wait, unlock/rebase, replan, human escalation, or terminal stop.
4. **Bound recovery under one episode.** Preserve run key, idempotency key,
   shared budget, and event lineage.
5. **Expose the minimum current slice after transition.** Avoid full-repository
   disclosure when semantic IDs and a target-state slice are sufficient.
6. **Record two verdicts.** Keep machine claim state separate from protocol
   conformance and evidence-sharing state.

## 7. Potential applications

- **Code agents:** wait for a branch/file lock to clear, then rebase on the new
  base and regenerate only the affected patch.
- **Configuration agents:** resolve semantic IDs against the unlocked current
  version before one bounded retry.
- **Database migrations:** treat schema locks as governance states, not generic
  tool errors.
- **Multi-agent systems:** centralize lock ownership and recovery permission;
  do not let a late worker overwrite the current owner.
- **Long-running workflows:** resume from an authoritative checkpoint, not from
  conversational memory.

## 8. Next experiment

Use a new frozen schema with identical unlock authority, identical \(S_2\),
identical provider-turn count, and identical budget across all arms. Randomize
only the recovery information package. Replicate on a second model and at least
one real Git/configuration workflow.

## Related documents

- [V1–V12, V14–V16 experiment summary](./aggregation-mismatch-v1-v12-v14-v16-experiment-summary.md)
- [V1–V12, V14–V16 agent engineering lessons](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v16.md)
- [Artifact-v15: Intent Conflict Governance](./aggregation-mismatch-v15-intent-conflict-governance.md)
- [Aggregation Mismatch and Compositional Governance](./aggregation-mismatch-compositional-governance-llm-systems.md)

## Source artifact

- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V16_MATCHED_CONFLICT_RECOVERY_DESIGN.md)
- [Formal report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V16_MATCHED_CONFLICT_RECOVERY_REPORT.md)
- [Independent validation](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V16_MATCHED_CONFLICT_RECOVERY_VALIDATION.md)
- [Machine summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v16_matched_conflict_recovery/confirmatory/analysis/summary.json)
