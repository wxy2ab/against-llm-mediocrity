# Aggregation Mismatch Artifact-v10: Semantic Contracts and Runtime Canonicalization

**Document type:** Theory–experiment–data–engineering validation report<br>
**Evidence cutoff:** July 28, 2026<br>
**Overall assessment:** **Implementation and data gates passed; the preregistered
large-effect claim failed**<br>
**Study family:** `aggregation_mismatch_v10_semantic_contract_canonicalization`<br>
**Schema:** `artifact-v10`<br>
**中文：** [聚合失配 Artifact-v10：语义合同与 Runtime Canonicalization](./aggregation-mismatch-v10-semantic-contract-canonicalization.zh-CN.md)<br>
**Bilingual synchronization rule:** sample sizes, estimates, verdicts, limitations,
and engineering rules must remain aligned across both versions.

## One-sentence conclusion

Artifact-v10 verifies that a runtime can safely accept semantically valid unordered
ID sets and canonicalize their serialization, but it **does not confirm** the
preregistered claim that this contract improves strict end-to-end success by at
least 20 percentage points: SEMANTIC-SET scores 30/32 versus 28/32 for STRICT-LIST,
a paired difference of **+6.25 points** with a 95% CI of **[−6.25, +18.75] points**
and exact sign-flip \(p=0.625\).

## Technical summary

V10 follows an important diagnostic from artifact-v9. In 77 v9 episodes labeled as
order failures, the model had selected the exact correct ready-ID set every time,
but the strict interface rejected a different permutation before value correctness
could decide the outcome.

V10 therefore separates:

- **semantic correctness:** did the model submit exactly the required entities and
  valid values?
- **serialization correctness:** did it reproduce one runtime-owned list order?

| Item | Result |
|---|---:|
| Formal semantic episodes | **64/64 complete** |
| Paired DAG instances | **32**, each evaluated under both contracts |
| Pilot | **16/16 complete**, excluded from confirmatory inference |
| Offline canonicalizer cases | **1,024/1,024 passed** |
| Event reconstruction | **64/64; 0 mismatch** |
| Arm matching | **32/32; 0 mismatch** |
| STRICT-LIST success | **28/32 (87.5%)** |
| SEMANTIC-SET success | **30/32 (93.75%)** |
| Paired difference | **+0.0625** |
| 95% cluster-bootstrap CI | **[−0.0625, 0.1875]** |
| Exact sign-flip \(p\) | **0.625** |
| Preregistered minimum effect | **+0.20** |
| Claim state | **`failed_pre_registered_gate`** |

The correct reading is: the contract works, but a large performance gain was not
established in this matrix. A failed gate is not proof that the true effect is
exactly zero.

## 1. Theory

### 1.1 Representation invariance

Suppose a ready layer has no internal dependencies and its task meaning is the
mapping

\[
M=\{node\_id\mapsto value\}.
\]

For any permutation \(\pi\),

\[
\operatorname{Semantics}(\pi(M))=\operatorname{Semantics}(M).
\]

If an interface nevertheless accepts only one list order, it introduces a
representation constraint that is stricter than the task semantics:

\[
\text{semantic validity}
\not\Rightarrow
\text{strict serialization validity}.
\]

A sound canonicalizer can remove this extra failure surface:

\[
\text{validate ID set, uniqueness, cardinality, and value domain}
\rightarrow
\text{sort by authoritative runtime order}
\rightarrow
\text{compile and execute}.
\]

This is a conditional theorem about the interface. It applies only when order is
not part of the domain meaning.

### 1.2 What theory cannot determine

The theory does not determine:

- how often a fixed model violates the requested order;
- how much end-to-end success changes;
- whether contract wording alters value computation;
- whether the effect survives a different difficulty, model, language, or real
  editing task.

Those quantities require an experiment. In particular, the maximum practical
benefit depends on the base rate of **order-only false rejects**.

## 2. Experiment

### 2.1 Three evidence layers

1. **V9 retrospective audit — motivation only.** Recompute the semantic content of
   77 historical order failures. It is descriptive and does not enter the V10
   confidence interval or \(p\)-value.
2. **Offline canonicalizer adoption gate.** Test valid and adversarial sets for
   acceptance, rejection, idempotence, and non-mutation.
3. **Paired confirmatory study.** Run 32 new frozen DAG instances once under each
   acceptance contract, producing 64 semantic episodes.

### 2.2 Paired contracts

Both arms use the same DeepSeek-V4-Flash configuration, Chinese prompts,
`thinking=False`, \(N\in\{16,24\}\), frozen DAGs, ready-set and completed-ledger
exposure, tool schema, output cardinality, 300-second budget, and global verifier.
Only the acceptance contract changes:

- **A-STRICT-LIST:** the submitted array must exactly equal
  `current_ready_node_ids`, including order.
- **A-SEMANTIC-SET:** the submitted IDs and values must be semantically valid;
  runtime canonicalizes a valid permutation.

The primary endpoint is budgeted strict success. The preregistered claim requires a
paired improvement of at least +0.20, a CI lower bound above zero, and exact
sign-flip \(p<0.05\), subject to data-quality and floor/ceiling gates.

## 3. Data and results

### 3.1 Primary result

![V10-A1 strict success rates](./assets/aggregation-mismatch-experiment/v10-a1-success-rates.png)

There are 28 paired ties, three instances where only SET succeeds, and one where
only STRICT succeeds. The +6.25-point estimate is positive but imprecise, below
the minimum engineering effect, and compatible with zero. V10-A1 therefore fails
its preregistered gate.

### 3.2 Diagnostic decomposition

![Semantic correctness, serialization correctness, and canonicalization](./assets/aggregation-mismatch-experiment/v10-diagnostic-decomposition.png)

- Semantic node-set correctness is **32/32 in both arms**.
- STRICT serialization is exact in **32/32** episodes.
- SET serialization is exact in only **6/32** episodes.
- **24 successful SET episodes** depend on the runtime accepting and
  canonicalizing a noncanonical permutation.
- All six terminal failures are `value_error`: four in STRICT and two in SET.
  Neither arm has a terminal `order` failure.

This is the central mechanism result: semantic and serialization correctness can
be separated, and the canonicalizer is actively used. The small primary effect
arises because STRICT already reproduces the requested order in this easier
matrix; residual errors are about values, which canonicalization cannot repair.

![Failure layers under both contracts](./assets/aggregation-mismatch-experiment/v10-failure-layers.png)

### 3.3 Offline adoption gate

The 1,024 frozen property cases contain:

| Case type | Count |
|---|---:|
| Valid permutations | 224 |
| Duplicate IDs | 224 |
| Missing IDs | 192 |
| Extra IDs | 192 |
| Invalid values | 192 |

All 1,024 cases pass. False accepts and false rejects are both zero; canonicalization
is idempotent and does not mutate its input.

### 3.4 Cost

| Arm | Median tokens | Total tokens | Provider turns | Median wall time |
|---|---:|---:|---:|---:|
| STRICT-LIST | 5,650.5 | 212,769 | 120 | 11.7 s |
| SEMANTIC-SET | 5,744.5 | 221,043 | 120 | 11.8 s |

The formal study uses approximately 433,812 tokens and 240 provider turns. V10
does not establish a cost reduction.

![Strict success and provider cost](./assets/aggregation-mismatch-experiment/v10-success-cost.png)

## 4. Conclusions and claim boundaries

### Supported

- A semantic-set API can safely accept valid permutations and deterministically
  canonicalize them while rejecting duplicates, omissions, extras, and invalid
  values.
- In the formal SET arm, noncanonical submissions frequently remain valid and
  succeed end to end.
- The v9 retrospective order diagnosis is reproducible: 77/77 failed submissions
  contain the exact ready-ID set; 73/77 also have all first-failed-layer values
  correct.
- Semantic correctness and serialization correctness should be separate telemetry
  dimensions.

### Not supported

- A confirmed improvement of at least 20 percentage points from SET over STRICT in
  this protocol.
- The claims that ordering never matters, that arbitrary permutations are always
  safe, or that canonicalization repairs bad plans or values.
- Cross-model, cross-language, or real-repository generalization.

### The theory–experiment gap

Theory says canonicalization removes **avoidable order-only rejection**. It does
not say that order-only rejection is frequent in every workload. V9 shows a hard
matrix where it is frequent; V10 uses an easier \(N=16/24\) matrix in which the
STRICT arm has no terminal order failures. The studies are complementary, not
contradictory:

```text
V9: order-only failures can dominate under a strict, difficult contract.
V10: the semantic-set mechanism works, but its end-to-end gain is small when the
     strict baseline already follows the requested order.
```

## 5. Engineering implications

1. **Use semantic contracts for semantically unordered objects.** Accept stable-ID
   sets or mappings; do not make a runtime-owned permutation part of correctness.
2. **Keep authoritative order in the runtime.** Validate first, then canonicalize
   and compile deterministically.
3. **Do not weaken semantic verification.** Reject duplicate, missing, extra,
   unknown, or invalid-value entries before execution.
4. **Separate substrate adoption from performance promises.** The API can be
   preferable for semantic clarity and fewer false rejects even when a large
   success-rate lift is not demonstrated.
5. **Measure the target failure distribution.** Track order-only false rejects and
   value errors separately before assigning an expected uplift.
6. **Route by task semantics.** If sequence has causal or business meaning, retain
   a strict ordered contract and make the order explicit.

## 6. Possible applications

| Domain | Model output | Runtime responsibility | Required verifier |
|---|---|---|---|
| Configuration updates | `{entity_id: new_value}` | schema, deduplication, canonical order, atomic apply | business invariants |
| Code editing | symbol/AST-ID edit set | resolve current locations, order edits, compile native patch | format, type, tests |
| Database migration | table/column-ID intent | dependency order, DDL compilation, transaction/rollback | locks and data constraints |
| DAG workflow | current ready task-ID set | scheduling, ledger, idempotent execution | global completion state |
| Multi-agent merge | artifact/claim-ID changes | conflict detection, deterministic merge, commit gate | cross-task consistency |

These are engineering transfer hypotheses, not domains validated by V10.

## 7. Limitations and next tests

- One DeepSeek configuration, Chinese prompts, synthetic GF(2) DAGs, and 32 paired
  instances.
- \(N=16/24\) is easier than the v9 \(N=24/48\) protocol.
- The 3.125-point paired resolution and confidence interval do not support a
  zero-effect claim.
- A decisive follow-up should overlap the non-floor difficulty range of v8/v9,
  premeasure the order-only failure base rate, and test a second model plus a real
  unordered code/configuration task.

## 8. Reproduction sources

- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V10_SEMANTIC_CONTRACT_CANONICALIZATION_DESIGN.md)
- [Formal report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V10_SEMANTIC_CONTRACT_CANONICALIZATION_REPORT.md)
- [Independent validation](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V10_SEMANTIC_CONTRACT_CANONICALIZATION_VALIDATION.md)
- [Machine summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v10_semantic_contract_canonicalization/confirmatory/analysis/summary.json)
- [Endpoint ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v10_semantic_contract_canonicalization/confirmatory/merged_runs.jsonl)
- [Event ledger](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v10_semantic_contract_canonicalization/confirmatory/events.jsonl)

## Related documents

- [聚合失配 Artifact-v10：中文](./aggregation-mismatch-v10-semantic-contract-canonicalization.zh-CN.md)
- [Aggregation Mismatch Artifact-v9](./aggregation-mismatch-v9-minimal-scaffold-recovery.md)
- [Aggregation mismatch theoretical claims and agent engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Aggregation mismatch and compositional governance](./aggregation-mismatch-compositional-governance-llm-systems.md)
- [Patch versus full rewrite](./patch-vs-full-rewrite-controlled-experiment.md)
