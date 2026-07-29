# Aggregation Mismatch Artifact-v11: Address Drift and Configuration Delivery

**Document type:** Theory–experiment–data–engineering validation report

**Evidence cutoff:** July 29, 2026

**Overall assessment:** **The preregistered address interaction passed; the
Patch–Rewrite reliability claim was not adjudicated because of ceiling**

**Study family:** `aggregation_mismatch_v11_config_delivery_transfer`

**Schema:** `artifact-v11`

**中文：** [聚合失配 Artifact-v11：地址漂移与配置交付](./aggregation-mismatch-v11-config-delivery-transfer.zh-CN.md)

**Bilingual synchronization rule:** sample sizes, estimates, verdicts,
limitations, and engineering rules must remain aligned across both versions.

## One-sentence conclusion

On production-shaped synthetic JSON configurations, relocation increases the
strict-success advantage of runtime-resolved semantic IDs over model-authored
physical indices by **21.875 percentage points**. The effect passes the
preregistered V11-A1 gate, but all seven differences occur at \(N=48\); all four
\(N=24\) cells are at ceiling. Patch and Full Rewrite are both perfectly reliable
in all four V11-B cells, so reliability is not adjudicated, although Patch is
substantially cheaper in tokens, latency, and response bytes.

## Technical summary

| Item | Result |
|---|---:|
| Formal episodes | **256/256 complete** |
| Pilot | **32/32 complete**, excluded from confirmatory inference |
| Offline executor cases | **1,024/1,024 match expected accept/reject behavior** |
| Formal event ledger | 2,048 events; exactly 8 per episode |
| Event reconstruction mismatch | 0 |
| V11 tests | **26/26 passed** |
| Stable-ID / Stable-Index | 32/32 / 32/32 |
| Relocated-ID / Relocated-Index | 32/32 / **25/32** |
| V11-A1 interaction | **+0.21875**, 95% CI **[0.09375, 0.375]** |
| V11-A1 exact / Holm \(p\) | 0.015625 / **0.03125** |
| V11-A1 state | **`passed`** |
| Sparse Patch / Rewrite | 32/32 / 32/32 |
| Dense Patch / Rewrite | 32/32 / 32/32 |
| V11-B1 state | **`not_adjudicated_floor_or_ceiling`** |
| Formal token usage | 1,062,138 input + 279,292 output = **1,341,430** |

## 1. Theory

### 1.1 Semantic identity is invariant under relocation

Let \(C\) be a configuration containing objects with stable IDs and let
\(\pi(C)\) reorder its service array without changing object semantics. For a
service \(s\),

\[
\operatorname{id}_{\pi(C)}(s)=\operatorname{id}_{C}(s),
\]

while generally

\[
\operatorname{index}_{\pi(C)}(s)\ne\operatorname{index}_{C}(s).
\]

A semantic-ID tool contract asks the model to identify the target and lets the
runtime resolve its current address against authoritative state. A physical-index
contract makes the model perform an extra re-binding:

\[
\text{semantic target}
\rightarrow
\text{current physical index}
\rightarrow
\text{tool payload}.
\]

The theory guarantees representational invariance and a smaller model-owned
responsibility surface. It does **not** determine how often a particular model
will fail, how the effect scales, or how much success will improve. V11-A tests
that empirical translation.

### 1.2 Patch has a conditional commitment-surface advantage

For object length \(N\) and \(k\) edits, a rough delivery model is

\[
L_{\text{rewrite}}\approx N c_r,
\qquad
L_{\text{patch}}\approx c_0+k(c_p+\log N).
\]

Patch usually commits less model-generated content when the plan is correct,
\(k\ll N\), addressing is stable, and the executor is reliable. It is not an
unconditional reliability theorem: short rewrites can reach ceiling, Patch has
address and schema overhead, dense edits weaken the \(k\ll N\) assumption, and a
bad plan stays bad under either interface.

### 1.3 Governed execution changes the safety outcome

Both delivery paths use:

```text
resolve target
→ check old-value precondition
→ atomic apply
→ global verification
→ commit or rollback
```

This turns address errors into typed, auditable rejection rather than silent
configuration corruption. It is a safety mechanism; it does not make an
incorrect model output semantically correct.

## 2. Experiment

### 2.1 Shared protocol

- DeepSeek-V4-Flash, Chinese prompts, `thinking=False`;
- one provider turn, no model repair, 300-second episode budget;
- a correct semantic edit plan is frozen before delivery;
- matched native-tool schema, old-value preconditions, atomic executor, and
  global verifier;
- strict success requires exact targets, values, protected fields, coverage, and
  final configuration;
- task-cluster paired inference;
- V11-A1 and V11-B1 form one Holm family.

V11 isolates delivery after a correct plan. It does not test planning, retrieval,
or production repository editing.

### 2.2 Module A: Layout × Address

Thirty-two tasks each enter four conditions:

| Layout | Address contract | Model owns | Runtime owns |
|---|---|---|---|
| Stable | Semantic ID | ID, old value, new value | ID→current index |
| Stable | Physical index | index, ID, old value, new value | validation and execution |
| Relocated | Semantic ID | ID, old value, new value | ID→relocated index |
| Relocated | Physical index | index, ID, old value, new value | validation and execution |

The primary interaction is

\[
\Delta_{A1}
=
(ID-INDEX)_{\text{relocated}}
-
(ID-INDEX)_{\text{stable}}.
\]

The frozen gate requires a positive effect, an observed effect of at least +0.15,
support from the interval and randomization test, and passage of data, event,
truth-isolation, and offline-executor gates.

### 2.3 Module B: Density × Delivery

Another 32 tasks each enter Sparse-Patch, Sparse-Rewrite, Dense-Patch, and
Dense-Rewrite. The primary contrast is Sparse Patch−Rewrite. Dense effects and
the density interaction are exploratory. The frozen decision rule explicitly
marks a dual floor or ceiling as not adjudicated.

## 3. Data and results

### 3.1 Data integrity

The formal matrix contains 256 unique run keys, 256 provider turns, and 256
transport attempts. Every episode makes exactly one native-tool submission and
emits exactly eight events. Event indices are contiguous, timestamps are
monotone, and all 256 endpoints reconstruct with zero mismatch.

The 1,024 offline cases include valid inputs and mutations for duplicate targets,
stale old values, unknown IDs, invalid fields or values, stale baselines,
out-of-range or reordered indices, missing or duplicate services, collateral
mutation, and unapplied edits. False accepts, false rejects, and reconstructed
state mismatches are all zero.

“1,024/1,024 passed” means observed acceptance or rejection matches the test
oracle; it does not mean that all cases should be accepted or that production
safety is 100%.

### 3.2 V11-A1 passes, with a scale boundary

![V11 layout-by-address strict success](./assets/aggregation-mismatch-experiment/v11-a-layout-address-success.png)

| Size | Stable-ID | Stable-Index | Relocated-ID | Relocated-Index |
|---|---:|---:|---:|---:|
| \(N=24\) | 16/16 | 16/16 | 16/16 | 16/16 |
| \(N=48\) | 16/16 | 16/16 | 16/16 | **9/16** |
| Overall | 32/32 | 32/32 | 32/32 | **25/32** |

The paired interaction is

\[
\Delta_{A1}=0.21875,
\qquad
95\%\ CI=[0.09375,0.375].
\]

Seven tasks favor ID, none favor Index, and 25 tie. The raw exact sign-flip
\(p=0.015625\); Holm-adjusted \(p=0.03125\). V11-A1 therefore passes.

The wording must remain precise. The observed effect exceeds the preregistered
+0.15 threshold, and the CI lower bound exceeds zero. The lower bound,
0.09375, does **not** exceed +0.15; the study therefore does not establish with
95% confidence that the population effect is at least 15 points.

All seven failures are \(N=48\) Relocated-Index precondition failures. Across 35
submitted edit operations in those failed batches, 24 current indices are
correct and 11 are wrong. Errors are not explained by simply copying every
pre-relocation index. Preconditions and atomicity reject each faulty batch before
commit; no partial or collateral mutation is observed.

### 3.3 V11-B1 is not adjudicated

![V11 density-by-delivery strict success](./assets/aggregation-mismatch-experiment/v11-b-density-delivery-success.png)

Sparse Patch, Sparse Rewrite, Dense Patch, and Dense Rewrite all score 32/32.
The observed Sparse Patch−Rewrite difference is zero with CI [0,0] and
raw/Holm \(p=1\). Under the frozen rule, this is
`not_adjudicated_floor_or_ceiling`, not equivalence and not evidence that Patch
has no reliability advantage outside this easy matrix.

### 3.4 Cost remains decision-relevant at reliability ceiling

![V11 successful-delivery cost](./assets/aggregation-mismatch-experiment/v11-success-cost.png)

| Condition | Median tokens | Median wall time | Mean response bytes |
|---|---:|---:|---:|
| Sparse-Patch | 4,176.5 | 2.917 s | 435 |
| Sparse-Rewrite | 7,276 | 17.935 s | 10,489 |
| Dense-Patch | 5,233 | 5.569 s | 1,842 |
| Dense-Rewrite | 7,805 | 18.013 s | 10,536 |

Relative to Rewrite, Patch reduces:

- sparse tokens by 42.6%, wall time by 83.7%, and response bytes by 95.9%;
- dense tokens by 33.0%, wall time by 69.1%, and response bytes by 82.5%.

These are descriptive cost outcomes from the frozen matrix, not the
preregistered V11-B1 reliability endpoint.

## 4. Conclusions and claim boundaries

### Supported

- In this verified-plan configuration protocol, relocation selectively exposes
  physical-index re-binding errors at the larger tested size.
- Semantic ID plus runtime current-address resolution avoids the seven observed
  Relocated-Index failures.
- Old-value preconditions, atomic execution, and global verification convert the
  observed address mistakes into safe rejection.
- Both Patch and Rewrite can deliver a correct plan perfectly on this matrix.
- At equal observed success, Patch is substantially cheaper in this study.
- The event ledger reconstructs address, coverage, precondition, verifier, and
  commit outcomes.

### Not supported

- Semantic ID is more reliable for every size, layout, model, or real domain.
- Relocation alone, independent of size or context burden, explains the effect.
- Patch is more reliable than Rewrite in V11.
- Patch and Rewrite are equivalent.
- A hard sparse-to-dense crossover has been established.
- Offline 1,024/1,024 implies 100% production safety.
- The result generalizes across models, languages, or real repositories.

### Theory–experiment gap

| Theory | V11 evidence | Remaining gap |
|---|---|---|
| ID is invariant under permutation | A1 interaction passes | second model, continuous size, real schemas |
| Runtime resolution removes model-side re-binding | seven failures avoided | separate size, edit count, dispersion, relocation distance |
| Patch reduces commitment surface | large token/time/byte reduction | non-ceiling reliability and density curve |
| Governed executor prevents bad commits | seven safe rejects; offline gate passes | concurrency, stale reads, crash/replay, external side effects |

## 5. Engineering implications

1. **Make semantic identity the model-facing contract.** Accept service IDs,
   resource names, symbol IDs, row keys, or claim IDs.
2. **Resolve physical addresses from current authoritative state.** JSON pointers,
   array indices, line spans, and cell coordinates belong to the runtime or a
   deterministic compiler.
3. **Bind delivery to the frozen plan.** Include plan hash, state hash, old-value
   preconditions, and protected invariants.
4. **Keep execution atomic.** A single bad address in a batch should reject or
   roll back the batch, not leave a partial configuration.
5. **Separate reliability routing from cost routing.** Ceiling does not establish
   equivalence; cost can still justify preferring Patch when both paths are safe.
6. **Monitor interaction variables.** Record object size, edit count, target
   dispersion, relocation distance, address contract, and failure layer.
7. **Keep Full Rewrite as a controlled fallback.** Use it for unsupported patch
   semantics or broad structural change, not as an automatic response to any
   Patch failure.

## 6. Possible applications

| Domain | Stable identity | Runtime responsibility |
|---|---|---|
| Kubernetes / IaC | resource UID or kind/name | resolve current document path and atomically apply |
| JSON/YAML configuration | entity ID + field name | compile current JSON Pointer or index |
| Code editing | symbol or AST node ID | resolve current span and compile native edits |
| Database migration | table/column/constraint ID | compile DDL and transaction order |
| Spreadsheet agents | row key + semantic column | resolve current cell after sort/filter |
| Workflow systems | task ID | own dependency position and completed ledger |
| Document editing | section or claim ID | resolve current text range after reordering |

These are transfer hypotheses, not domains validated by V11.

## 7. Limitations and next tests

- One DeepSeek configuration, Chinese prompts, synthetic JSON, correct verified
  plans, 32 task clusters per module, and only \(N=24/48\).
- The A effect is heterogeneous and entirely concentrated at \(N=48\).
- The B matrix is too easy to estimate reliability or a density crossover.
- Offline mutation coverage is bounded by the encoded invariants.

A decisive follow-up should reproduce A1 on a second model, use more size levels
and controlled permutation distance, push B outside ceiling, and test real
configuration or code repositories with stale-state, concurrency, crash/replay,
and idempotency mutations.

## 8. Reproduction sources

- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V11_CONFIG_DELIVERY_TRANSFER_DESIGN.md)
- [Formal report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V11_CONFIG_DELIVERY_TRANSFER_REPORT.md)
- [Independent validation](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V11_CONFIG_DELIVERY_TRANSFER_VALIDATION.md)
- [Machine summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v11_config_delivery_transfer/confirmatory/analysis/summary.json)
- [Endpoint ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v11_config_delivery_transfer/confirmatory/merged_runs.jsonl)
- [Event ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v11_config_delivery_transfer/confirmatory/events.jsonl)

## Related documents

- [Next: Aggregation Mismatch Artifact-v12](./aggregation-mismatch-v12-scale-routing-transfer.md)
- [聚合失配 Artifact-v11：中文](./aggregation-mismatch-v11-config-delivery-transfer.zh-CN.md)
- [Aggregation Mismatch Artifact-v10](./aggregation-mismatch-v10-semantic-contract-canonicalization.md)
- [Patch versus Full Rewrite](./patch-vs-full-rewrite-controlled-experiment.md)
- [Aggregation mismatch: theoretical claims and agent engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Aggregation mismatch and compositional governance](./aggregation-mismatch-compositional-governance-llm-systems.md)
