# Aggregation Mismatch Artifact-v4: Experimental Evidence, Theory Gaps, and Agent Implications

**Subtitle: Which mechanisms are supported, and which hold mathematically but remain unidentified in model behavior**<br>
**Status: Research evidence report v1.1**<br>
**Data validated: July 28, 2026; V5 follow-up evidence linked**<br>
**Evidence scope: One DeepSeek-V4-Flash deployment configuration; Chinese prompts; 18 GF(2) holdouts**<br>
**中文：** [聚合失配 Artifact-v4：实验证据、理论差距与 Agent 工程含义](./aggregation-mismatch-v4-claims-theory-gap.zh-CN.md)<br>
**Bilingual synchronization rule:** Keep all numbers, verdicts, evidence limits, and engineering implications aligned across both versions.

---

## Technical Summary

Artifact-v4 completed all 756 preallocated run keys across 18 new holdouts, three
lengths, twelve 300-second conditions, and three independent budget points. It
produces four main verdicts:

1. **Enough correct answer bits strongly recover cyclic full construction.** Full
   cut-set anchors improve success over no anchors by 74.1 percentage points, with
   a 95% instance-bootstrap interval of [57.4, 87.0].
2. **The recovery has no identified structural-location specificity.** Correct bits
   at an equal number of random positions achieve 54/54, versus 53/54 for the full
   cut-set; structural minus random is −1.9 points [−5.6, 0.0].
3. **A candidate does not automatically improve full rewriting.** Full rewrite
   with a five-bit-corrupted candidate is 11.1 points below no-candidate
   construction [−22.2, −1.9]; the random-candidate contrast has no clear benefit.
   Audit exceeds rewrite by 79.6–87.0 points on the same candidate, but it also
   changes the operation and output, so this is not a pure verification effect.
4. **More budget yields only partial, length-dependent recovery.** No-anchor
   construction succeeds at 24.1%/37.0%/46.3% under independent
   300/900/1800-second calls. At 1800 seconds, \(N=24\) reaches 94.4%, while
   \(N=32,48\) remain at 27.8%/16.7%.

Natural- and reverse-order conditions are both near ceiling, leaving the order
effect unidentified. MiniMax was not run in artifact-v4, so every new verdict is
configuration-specific.

The subsequent artifact-v5 native-agent study sharpens the patch boundary:
given the same authoritative plan, patch beats full rewrite by 41.7 percentage
points [27.1, 56.3], but when the model must infer the plan the difference is only
2.1 points [0.0, 6.3]. V5 therefore supports a delivery advantage under a correct
plan, not a universal end-to-end patch advantage.

The most defensible summary is:

> **Cyclic full construction is highly sensitive to visible answer information,
> operation interface, length, and budget. Enough correct bits nearly restore
> construction, but the experiment does not identify an additional benefit from
> cut-set locations themselves. A candidate produces a large completion advantage
> only when the task is rewritten as audit; it does not automatically help full
> rewrite.**

---

## 1. Experiment and Run Ledger

Frozen identity:

- study: `aggregation_mismatch_v4_p0`
- schema: `artifact-v4`
- dataset: `dataset/artifact-v4/3111d6e9e329e798`
- prompt set: `promptset/artifact-v4/8dd27dd8d7c50c0a`
- model: `SimpleDeepSeekClient::deepseek-v4-flash`

Run scale:

| Block | Decomposition | Runs |
|---|---:|---:|
| 12 conditions @300s | 18 instances × 12 × 3 repeats | 648 |
| A0 @900s | 18 × 3 | 54 |
| A0 @1800s | 18 × 3 | 54 |
| **Total** | | **756** |

Lengths are \(N\in\{24,32,48\}\), with six instances per length. The three budget
points are independently preallocated calls, not a single-call survival curve.

### 1.1 Condition Families

| Family | Conditions | Intervention |
|---|---|---|
| Boundary | A0/A1/A2/A3 | No anchors, half cut-set, full cut-set, equal-count random correct bits |
| Compact state | A4 | Model submits a boundary seed; a program expands it deterministically |
| Candidate/interface | C1–C5 | Five/random candidate × rewrite/patch/audit |
| Order | O1/O2 | Natural/reverse submission order for a causal task |
| Budget | A0@300/900/1800 | Independent wall-clock allocation |

The primary metric is `system_exact_success`. Analysis first averages the three
repeats within each instance and then uses a fixed-seed 10,000-draw bootstrap over
the 18 instances.

---

## 2. Data-Quality Correction

Run coverage is complete:

```text
expected = 756
observed_unique = 756
missing = 0
unexpected = 0
duplicates = 0
```

A deeper audit of the raw JSONL found seven rows from an early worker shard that
still carried legacy-evaluator fields. Their visible responses were present, but
`condition_id/schema_version` were missing and the rows were incorrectly labeled
`format_invalid`. The frozen artifact-v4 evaluator parses all seven strictly, and
all seven exactly match ground truth.

The analyzer now deterministically rescores **all 756 responses**:

- seven rows change from `format_invalid` to `ok`;
- seven rows recover v4 condition/schema metadata;
- the remaining 749 rows retain the same success and failure class;
- no calls, best-of selection, or outcome filtering are added.

Rescored failure classes are:

| ok | timeout | returned wrong | format invalid |
|---:|---:|---:|---:|
| 478 | 271 | 7 | 0 |

Coverage shows that each run key has a record. Deterministic rescoring separately
shows that every record is interpreted under the correct scoring semantics.

---

## 3. Results

### 3.1 Success at 300 Seconds

| Condition | Strict success |
|---|---:|
| A0 no anchor, full construction | 13/54 (24.1%) |
| A1 half cut-set | 53/54 (98.1%) |
| A2 full cut-set | 53/54 (98.1%) |
| A3 equal-count random correct bits | 54/54 (100%) |
| A4 compact boundary seed + executor | 21/54 (38.9%) |
| C1 five-bit candidate + rewrite | 7/54 (13.0%) |
| C2 five-bit candidate + patch | 8/54 (14.8%) |
| C3 five-bit candidate + audit | 54/54 (100%) |
| C4 random candidate + rewrite | 10/54 (18.5%) |
| C5 random candidate + audit | 53/54 (98.1%) |
| O1 causal natural order | 54/54 (100%) |
| O2 causal reverse order | 53/54 (98.1%) |

### 3.2 Primary Contrasts

| Contrast | Instance-level difference | 95% bootstrap interval | Verdict |
|---|---:|---:|---|
| A2−A0 | +0.741 | [0.574, 0.870] | Enough correct bits strongly recover construction |
| A2−A3 | −0.019 | [−0.056, 0.000] | No support for structural-location-specific gain |
| A4−A0 | +0.148 | [0.037, 0.259] | Compact state helps, but recovery is limited |
| C1−A0 | −0.111 | [−0.222, −0.019] | Five-bit candidate rewrite is worse |
| C2−C1 | +0.019 | [−0.037, 0.074] | No v4 five-bit patch advantage |
| C3−C1 | +0.870 | [0.722, 0.981] | Large audit/rewrite composite difference |
| C4−A0 | −0.056 | [−0.148, 0.037] | No clear random-candidate rewrite benefit |
| C5−C4 | +0.796 | [0.648, 0.926] | Large audit/rewrite composite difference |
| O1−O2 | +0.019 | [0.000, 0.056] | Ceiling-limited and uninformative |

### 3.3 Independent Budgets

| Budget | All N | \(N=24\) | \(N=32\) | \(N=48\) |
|---:|---:|---:|---:|---:|
| 300s | 13/54 | 9/18 | 3/18 | 1/18 |
| 900s | 20/54 | 12/18 | 6/18 | 2/18 |
| 1800s | 25/54 | 17/18 | 5/18 | 3/18 |

The \(N=32\) point is lower at 1800 than at 900 seconds because these are
independent stochastic calls. Per-instance monotonicity is not required.

---

## 4. What the Experiment Establishes

### Supported

- Supplying many correct answer bits nearly restores cyclic full construction in
  the tested configuration.
- Compact state plus deterministic execution improves over no anchors.
- Candidate-conditioned audit has much higher budgeted exact completion than full
  rewrite with the same candidate.
- A candidate is not a reliable full-rewrite scaffold; the five-bit candidate is
  actively harmful under this protocol.
- More budget improves A0 overall, with recovery concentrated at shorter length.
- Patch advantage is conditional: the five-bit, short-object v4 setting does not
  reproduce the one-bit, long-object v3 advantage.

### Not Supported

- an additional LLM benefit from structural cut-set locations over equal-count
  random correct bits;
- “audit minus rewrite equals pure verification ability”;
- patch dominance at every edit density and length;
- universal cyclic-construction recovery by 1800 seconds;
- an identified natural-order advantage over reverse order;
- cross-model, cross-language, or real-domain universality.

---

## 5. Gaps Between Theory and Experiment

### 5.1 Sufficient Boundary State

Partition variables into \(C\) and \(R\):

\[
H_Cx_C+H_Rx_R=c.
\]

Given correct \(x_C\), if \(H_R\) has full column rank and the system is
consistent, \(x_R\) is uniquely determined. That is an algebraic fact.

The experiment confirms that enough answer information helps. It does not confirm
that structural positions help more. A3 is not worse than A2, so the observed
recovery may also come from answer leakage, search-space reduction, or generic
scaffolding. Theory proves state sufficiency; it does not prove that a real LLM
will obtain more benefit from one state representation.

### 5.2 Candidate and Residual

Given a candidate \(y\), verification becomes:

\[
r=Hy\oplus c.
\]

This proves that a candidate replaces solution search with residual computation.
It does not prove that a candidate helps the model emit a corrected full object.
Artifact-v4 shows exactly this boundary: candidate plus rewrite does not help;
candidate plus audit nearly saturates.

### 5.3 Conditional Patch Advantage

For sparse edits:

\[
L_{\text{patch}}
=c_0+k(c_p+\lceil\log_2N\rceil)
\]

can be smaller than \(L_{\text{rewrite}}=Nc_r\). With a correct plan, reliable
executor, and delivery risk that increases with commitment surface, patch delivery
dominance follows conditionally.

Artifact-v3 matches this prediction for one-bit sparse repair at \(N=96\)–384.
Artifact-v4 is near zero for five-bit repair at \(N=24\)–48. These results do not
conflict; together they constrain the crossover. Edit density, object length,
address overhead, coupling, and timeout floor all affect the best interface.

Artifact-v5 adds native tool execution and reproduces the theory-aligned split:
oracle-plan patch is 46/48 versus 26/48 for rewrite, while inferred-plan patch is
2/96 versus 0/96. The tool fixes delivery exposure; it does not guarantee correct
plan discovery. V5 does not locate the density crossover because five of six
inferred-plan cells are at a joint zero floor and actual per-run payload telemetry
was not retained.

### 5.4 Budget and Order

Mathematical solvability does not imply completion by a hosted model within a
wall-clock allocation, nor monotonic success across independent budget calls.
Dependency-graph theory can establish that topological order reduces unresolved
predecessors, but the O1/O2 ceiling leaves the model effect unidentified.

---

## 6. Engineering Implications for Agents

| Finding | Agent adjustment | Boundary |
|---|---|---|
| Enough answer information strongly recovers construction | Externalize verifiable state and support compact-state delivery | Use ablations to check whether state is merely answer leakage |
| Compact seed only partially recovers | Compute or validate hard state programmatically, then expand deterministically | Do not assume the model can always infer the seed |
| Candidate rewrite does not improve | Connect candidates to verifiers, failure witnesses, and minimal repair | Do not merely attach the old object and request a full rewrite |
| v3 patch positive, v4 patch null | Route by edit density, length, coupling, and address overhead | Do not hard-code `patch > rewrite` |
| v5 oracle patch positive, inferred-plan comparison near floor | Verify the plan before write, then optimize the delivery interface | Do not treat a stable editor as a substitute for planning |
| Budget recovery is incomplete | Use checkpoints, algorithmic tools, budget escalation, and fallbacks | Do not extend timeout unconditionally |
| Order experiment is uninformative | Separate dependency-respecting execution from final presentation | Do not claim a measured order benefit |

Recommended default loop:

```text
authoritative state
→ model proposes plan / compact state / patch
→ deterministic executor
→ incremental checks
→ global verifier gate
→ commit or rollback
```

Minimum telemetry should separate:

- `plan_correct`
- `delivery_correct_given_plan`
- `edit_density`
- `candidate_quality`
- `dependency_frontier`
- `verifier_failures`
- `budget_s`, latency, and token usage
- `failure_class`

---

## 7. Most Decision-Relevant Next Work

1. Replicate v4 across configurations instead of only adding same-configuration
   instances.
2. Run a matched candidate-information × operation × output factorial.
3. Match answer-bit count, entropy, and position coverage to separate cut-set
   structure from generic answer scaffolding.
4. Sweep the edit-density crossover across patch, regional rewrite, and full
   rewrite.
5. Increase dependency frontier or length and rerun an order study without ceiling.
6. Replicate in code, configuration, databases, and structured documents with
   executable verifiers.
7. Replicate V5 with durable native-event retention and a plan-accuracy
   intervention, so delivery and planning remain separately identifiable.

---

## 8. Reproducibility Sources

- [Original v4 report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V4_P0_REPORT.md)
- [Original Claim–Evidence–Theory audit](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V4_P0_CLAIMS_THEORY_GAP.md)
- [Machine-readable summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v4_p0/confirmatory/analysis/summary.json)
- [Coverage audit](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v4_p0/confirmatory/analysis/coverage.json)
- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V4_P0_DESIGN_FREEZE.md)
- [Full paper](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/PAPER.md)
- [Artifact-v5 native-agent report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_STABLE_EDITING_AGENT_REPORT.md)
- [Artifact-v5 machine-readable summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/summary.json)

The raw `merged_runs.jsonl` preserves legacy-evaluator output for auditability.
Formal aggregation must use the uniform rescoring in `analyze_v4_p0.py`, not the
raw success fields directly.

For V5, the original merged formal JSONL and full event payload were not retained
across a branch switch. The 288-row endpoint table was reconstructed from complete
`run.log` completion records aligned to frozen specs. Final success, failure
class, condition, instance, \(N\), \(k\), and paired endpoint effects are
citable; exact repair-call totals, latency/token use, actual per-run payload
ratios, and event-level arm exclusivity are not.

---

## 9. Conclusion

Theory tells us that sufficient state, residual computation, sparse patches, and
topological execution reduce system responsibilities. Experiments tell us whether
a real LLM realizes those structural advantages and where they disappear across
length, density, interface, and budget.

Artifact-v4 narrows the gap:

> **A provable task simplification is not a guaranteed model gain. Agents must use
> authoritative state, deterministic executors, verifier gates, configurable
> routing, and telemetry to convert structural advantages into reliable
> end-to-end behavior.**

Artifact-v5 adds the practical boundary condition: a stable editing tool can
realize the patch delivery advantage once the plan is correct, but it does not
remove the upstream planning bottleneck.

---

## Related Documents

- [Aggregation Mismatch and Generation–Verification Asymmetry: Controlled Evidence (Chinese)](./aggregation-mismatch-generation-verification-asymmetry-evidence.zh-CN.md)
- [Aggregation Mismatch: Derivable Claims, Proof Conditions, and Agent Engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Patch vs. Full Rewrite: A Controlled Sparse-Repair Experiment](./patch-vs-full-rewrite-controlled-experiment.md)
- [Aggregation Mismatch Artifact-v5: Stable Editing Agent, Planning Bottleneck, and Conditional Patch Advantage](./aggregation-mismatch-v5-stable-editing-agent.md)
- [Aggregation Mismatch and Compositional Governance in LLM Systems](./aggregation-mismatch-compositional-governance-llm-systems.md)
