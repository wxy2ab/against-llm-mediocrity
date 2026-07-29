# Aggregation Mismatch Artifact-v12: Drift Dose and Delivery-Scale Routing

**Document type:** Theory–experiment–data–engineering validation report

**Evidence cutoff:** July 29, 2026

**Overall assessment:** **The preregistered drift-dose interaction failed; the
sparse Patch–Full Rewrite endpoint passed**

**Study family:** `aggregation_mismatch_v12_scale_routing_transfer`

**Schema:** `artifact-v12`

**中文：** [聚合失配 Artifact-v12：漂移剂量与交付尺度路由](./aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)

**Bilingual synchronization rule:** sample sizes, estimates, verdicts,
limitations, and engineering rules must remain aligned across both versions.

## One-sentence conclusion

On larger production-shaped synthetic JSON configurations, semantic ID retains
a large simple advantage over model-authored index under both low and high
layout drift, but high drift does not further enlarge that advantage:
\((ID-Index)_{high}-(ID-Index)_{low}=-0.0417\), so V12-A1 fails. In sparse
verified-plan delivery, semantic Patch scores 24/24 and Full Rewrite 17/24,
giving a **+0.2917** budgeted strict-success advantage that passes V12-B1.

## Technical summary

| Item | Result |
|---|---:|
| Formal / pilot / offline | **240/240** / **24/24** / **768/768** |
| Formal tasks | 48 |
| Provider turns / transport attempts | 240 / 245 |
| Formal event ledger | 2,138 events |
| Endpoint reconstruction mismatch | 0 |
| Offline false accept / reject / mismatch | 0 / 0 / 0 |
| V12 tests | **24/24 passed** |
| Low-drift ID / Index | 24/24 / **6/24** |
| High-drift ID / Index | 24/24 / **7/24** |
| V12-A1 interaction | **−0.0417**, 95% CI **[−0.25, 0.1667]** |
| V12-A1 raw / Holm \(p\) | 1 / 1 |
| V12-A1 state | **`failed_pre_registered_gate`** |
| Sparse Patch / Region / Full | 24/24 / 24/24 / **17/24** |
| V12-B1 Patch−Full | **+0.2917**, 95% CI **[0.125, 0.4583]** |
| V12-B1 raw / Holm \(p\) | 0.015625 / **0.03125** |
| V12-B1 state | **`passed`** |
| Dense Patch / Region / Full | 24/24 / **8/24** / 18/24 |
| Formal token usage | **4,915,111** |

## 1. Theory

### 1.1 Semantic identity and drift dose are different claims

For a configuration \(C\) and a permutation \(\pi(C)\), a stable entity ID is
invariant:

\[
id_{\pi(C)}(s)=id_C(s).
\]

A physical array index is generally not:

\[
index_{\pi(C)}(s)\ne index_C(s).
\]

This establishes a structural reason to let the model name semantic targets and
let the runtime resolve current addresses. It does not imply a monotone
performance law saying that every increase in layout drift must produce a
larger observed ID advantage.

V12-A1 therefore tests a stronger empirical claim:

\[
\Delta_{A1}
=
(ID-Index)_{high}
-
(ID-Index)_{low}
\ge 0.15.
\]

An ID simple effect can be large at both drift levels while this interaction is
zero or negative. Treating the simple effect as proof of drift dose would answer
the wrong estimand.

### 1.2 Delivery scale changes the model-owned commitment surface

Given a correct plan with \(k\) edits in an object of size \(N\):

- **Patch** asks the model to submit the minimum semantic change set;
- **Regional Rewrite** asks it to regenerate one affected region;
- **Full Rewrite** asks it to regenerate the whole configuration.

When \(k\ll N\), the model-owned content and latency exposure of Patch can be
much smaller. This is conditional, not universal: dense edits, weak patch
semantics, invalid plans, or an unreliable executor can erase the advantage.

### 1.3 The endpoint is budgeted delivery

The primary outcome is exact, verified commit within 300 seconds:

\[
strict\_success
=
semantic\ correctness
\land invariant\ preservation
\land commit
\land wall\_time\le300s.
\]

V12-B1 can identify a delivery advantage under this endpoint. It cannot prove
that Full Rewrite would remain semantically worse under unlimited time.

## 2. Experiment

### 2.1 Shared protocol

- DeepSeek-V4-Flash, Chinese prompts, `thinking=False`, temperature 0;
- maximum 32k tokens, one provider turn, no model repair;
- 300-second semantic-episode budget;
- a correct semantic plan is frozen before delivery;
- native tools, old-value preconditions, atomic executor, and global verifier;
- task-cluster paired inference;
- V12-A1 and V12-B1 form one Holm family.

V12 isolates address and delivery after a correct plan. It does not test plan
inference, retrieval, or autonomous production-repository editing.

### 2.2 Module A: Drift × Address

Twenty-four task clusters each enter four conditions:

| Drift | Address contract | Model owns | Runtime owns |
|---|---|---|---|
| Low | Semantic ID | ID and value change | current ID→index resolution |
| Low | Physical Index | current index and value change | validation |
| High | Semantic ID | ID and value change | current ID→index resolution |
| High | Physical Index | current index and value change | validation |

The 24 tasks span \(N\in\{48,72,96\}\). Low drift moves targets minimally; high
drift is frozen to Kendall inversion in [0.40, 0.60] and target displacement of
at least \(N/4\). The plan does not expose `baseline_index`.

### 2.3 Module B: Density × Delivery Scale

Another 24 clusters each enter six conditions:

| Density | Patch | Regional Rewrite | Full Rewrite |
|---|---:|---:|---:|
| Sparse, \(k/N=1/24\) | primary | exploratory | primary |
| Dense, \(k/N=1/3\) | exploratory | exploratory | exploratory |

The tasks span \(N\in\{96,144\}\). The preregistered B1 contrast is Sparse
Patch−Full. Regional Rewrite and all dense contrasts are secondary.

## 3. Data integrity

The formal matrix contains 240 unique run keys and 48 formal tasks. All ten
conditions contain 24 episodes. The pilot contains 24 unique keys and is
excluded from confirmatory inference; no pilot or formal key overlaps prior
artifacts.

The formal ledger contains 2,138 events, 240 provider turns, and 245 transport
attempts. Endpoint reconstruction has zero mismatches. The 768 offline executor
cases have zero false accepts, false rejects, mutation mismatches, or
reconstructed-state mismatches. Freeze, executor-contract, and agent-suite tests
pass 24/24.

## 4. Results

### 4.1 V12-A1 fails

![V12 drift-by-address strict success](./assets/aggregation-mismatch-experiment/v12-a-drift-address-success.png)

| Condition | Strict success |
|---|---:|
| Low-drift ID | 24/24 |
| Low-drift Index | 6/24 |
| High-drift ID | 24/24 |
| High-drift Index | 7/24 |

The two exploratory simple effects are +0.75 and +0.7083. The preregistered
interaction is:

\[
\Delta_{A1}=0.7083-0.75=-0.0417,
\qquad
95\%\ CI=[-0.25,0.1667].
\]

The raw and Holm-adjusted \(p\)-values are both 1. V12-A1 is
`failed_pre_registered_gate`.

The correct interpretation is narrow: this protocol does not show that high
drift further amplifies the ID advantage. It does not erase the large observed
ID−Index simple effects, but those effects are not the primary drift-dose claim.

### 4.2 V12-B1 passes

![V12 density-by-delivery-scale strict success](./assets/aggregation-mismatch-experiment/v12-b-density-delivery-success.png)

Sparse Patch and Region both score 24/24; Sparse Full scores 17/24:

\[
\Delta_{B1}=1.0-0.7083=+0.2917,
\qquad
95\%\ CI=[0.125,0.4583].
\]

The raw exact sign-flip \(p=0.015625\), Holm-adjusted \(p=0.03125\), and the
effect exceeds the preregistered +0.15 threshold. All seven discordant tasks are
Patch success / Full timeout within the 300-second endpoint.

The evidence supports budgeted strict delivery, not unlimited-budget semantic
superiority. Failed requests or their transport retries can finish after 300
seconds, but no over-budget episode is counted as a success.

### 4.3 Regional Rewrite is not a universal middle ground

Dense Patch, Region, and Full score 24/24, 8/24, and 18/24. The exploratory
effects are Patch−Region +0.6667, Patch−Full +0.25, and Region−Full −0.4167.
Regional Rewrite is at ceiling in sparse tasks but performs worst in dense
tasks. Because these are secondary contrasts, V12 does not establish a general
density crossover or a universal routing threshold.

### 4.4 Failure layers and cost

![V12 formal terminal outcomes](./assets/aggregation-mismatch-experiment/v12-failure-layers.png)

| Terminal layer | Count |
|---|---:|
| Success | 176 |
| Precondition | 32 |
| Timeout | 12 |
| Address resolution | 11 |
| Collateral | 6 |
| Tool schema / coverage / transport | 1 / 1 / 1 |

Index failures concentrate in address and precondition layers. Full Rewrite
failures concentrate in timeout and output burden. Dense Regional failures
include collateral, coverage, address, and schema problems.

| Condition | Median tokens | Median wall time |
|---|---:|---:|
| Sparse Patch | 18,663 | 4.2 s |
| Sparse Region | 19,114 | 7.1 s |
| Sparse Full | 36,077 | 138.2 s |
| Dense Patch | 20,751 | 9.8 s |
| Dense Region | 29,848 | 39.7 s |
| Dense Full | 30,344 | 144.4 s |

Thirteen episodes have observed total wall time above 300 seconds: twelve end
as timeout and one as transport failure. Over-budget success is zero. The total
can include failed waiting and a transport retry inside one semantic episode;
it is not an independently randomized longer-budget arm.

## 5. Conclusions and claim boundaries

### Supported

- Sparse semantic Patch plus deterministic execution improves 300-second
  budgeted strict success over model-authored Full Rewrite in the frozen V12
  verified-plan protocol.
- Semantic ID performs much better than physical Index at both tested drift
  levels as an observed simple effect.
- Runtime address resolution, preconditions, atomic apply, and global
  verification turn observed errors into typed rejection rather than silent
  partial commit.
- The full endpoint and event ledgers reconstruct without mismatch.

### Not supported

- Higher drift monotonically or causally enlarges the ID advantage.
- Patch is always better than Full or Regional Rewrite.
- Regional Rewrite is generally the optimal compromise.
- A hard sparse-to-dense crossover has been established.
- Full Rewrite remains worse with unlimited time.

### Not adjudicated or not measured

- Cross-model replication, real repositories, plan inference, model repair,
  concurrency, and production side effects.
- No primary endpoint is in the frozen floor/ceiling “not adjudicated” state;
  V12-A1 instead directly fails its gate.

## 6. Theory–experiment gap

| Theory | V12 evidence | Remaining gap |
|---|---|---|
| Semantic ID is invariant under permutation | large ID simple effects | second model and real schemas |
| Drift dose should enlarge re-binding burden | interaction −0.0417; fails | a measurable dose window without ID ceiling / Index floor |
| Sparse Patch reduces commitment surface | B1 +0.2917; passes | unlimited-budget semantics and real tasks |
| Regional output may trade locality for context | heterogeneous exploratory outcomes | preregistered regional protocol |
| Governed executor rejects unsafe delivery | 768/768 offline and typed failures | stale reads, crash/replay, concurrency, side effects |

## 7. Engineering implications

1. **Expose stable semantic IDs to the model.** Do not make drift estimation a
   prerequisite for adopting an invariant interface.
2. **Resolve physical locations at execution time.** Array index, JSON Pointer,
   line span, and cell coordinate belong to authoritative runtime state.
3. **Prefer Patch for sparse verified plans.** The V12 evidence is strongest for
   the 300-second delivery endpoint, not for end-to-end planning.
4. **Do not assume Regional Rewrite is safe by construction.** Give it its own
   coverage, collateral, schema, and latency gates.
5. **Route by typed failure layer.** Re-resolve address failures, reject stale
   preconditions, replan coverage failures, and escalate budget only for
   delivery-time pressure.
6. **Keep Full Rewrite as a governed fallback.** Use it for broad structural
   change or unsupported patch semantics, with explicit budget and verification.
7. **Track multiple objectives.** Reliability, tail latency, tokens, commit
   risk, and verifier coverage should not collapse into one Patch/Rewrite flag.

## 8. Possible applications

| Domain | Model-facing object | Runtime and verifier responsibility |
|---|---|---|
| Kubernetes / IaC | resource ID + field intent | resolve current path, atomic apply, policy check |
| JSON/YAML configuration | entity ID + old/new value | resolve current index, schema and invariants |
| Code editing | symbol/AST ID + edit plan | resolve current span, format, type-check, test |
| Database migration | table/column/constraint ID | compile DDL, order dependencies, transact |
| Spreadsheet agents | row key + semantic column | resolve cells after sort/filter, check formulas |
| Document editing | claim/section ID + change set | resolve current range, citations, cross-references |
| Workflow systems | task ID + transition | own readiness ledger, idempotency, and commit |

These are transfer hypotheses derived from the synthetic protocol, not domains
validated by V12.

## 9. Recommended next tests

1. Replicate V12-B1 on a second model configuration.
2. Test verified-plan Patch and Full Rewrite on real configuration pull requests.
3. If pursuing drift dose, redesign the difficulty window to avoid ID ceiling
   and already-low Index performance at both levels.
4. Give Regional Rewrite an independent preregistered study before promoting it
   into a production router.
5. Add stale-state, concurrent-write, crash/replay, and idempotency mutations.

## 10. Reproduction sources

- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V12_SCALE_ROUTING_TRANSFER_DESIGN.md)
- [Formal report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V12_SCALE_ROUTING_TRANSFER_REPORT.md)
- [Independent validation](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V12_SCALE_ROUTING_TRANSFER_VALIDATION.md)
- [Machine summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v12_scale_routing_transfer/confirmatory/analysis/summary.json)
- [Endpoint ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v12_scale_routing_transfer/confirmatory/merged_runs.jsonl)
- [Event ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v12_scale_routing_transfer/confirmatory/events.jsonl)

## Related documents

- [聚合失配 Artifact-v12：中文](./aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)
- [Aggregation Mismatch Artifact-v11](./aggregation-mismatch-v11-config-delivery-transfer.md)
- [Patch versus Full Rewrite](./patch-vs-full-rewrite-controlled-experiment.md)
- [Aggregation mismatch: theoretical claims and agent engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Aggregation mismatch and compositional governance](./aggregation-mismatch-compositional-governance-llm-systems.md)
