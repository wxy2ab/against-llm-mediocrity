# Aggregation Mismatch Artifact-v5: Stable Editing Agents, Patch Delivery, and the Planning Bottleneck

**Subtitle: Native Patch beats full-object Rewrite after the plan is known, but changing the write tool alone does not solve the end-to-end Agent task**<br>
**Status: Research evidence report v1.0**<br>
**Data cutoff: July 28, 2026**<br>
**Evidence scope: One DeepSeek-V4-Flash deployment configuration; Chinese prompts; 48 synthetic GF(2) repair instances; 288 evaluated Agent arms**<br>
**中文：** [聚合失配 Artifact-v5：稳定编辑 Agent、Patch 交付与规划瓶颈](./aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)<br>
**Bilingual synchronization rule:** Keep condition names, sample sizes, statistical results, evidence-quality limits, and claim boundaries aligned across both versions.

---

## Technical Summary

Artifact-v5 asks whether the Patch advantage observed in earlier text-interface experiments survives inside a native tool-using Agent.

Every paired condition shares the same candidate, plan, verifier, 300-second episode budget, and at most one delivery repair. Only the write tool changes:

- Patch arm: native `file_edit_batch`
- Rewrite arm: native `file_write`

The 288-arm confirmatory matrix produces a split verdict:

| Comparison | Patch | Rewrite | Patch − Rewrite | Verdict |
|---|---:|---:|---:|---|
| Inferred plan, end to end | 2/96 (2.1%) | 0/96 (0%) | +2.1 pp, 95% CI [0, +6.25] | **V5-C1 failed** |
| Oracle plan, delivery only | 46/48 (95.8%) | 26/48 (54.2%) | **+41.7 pp, 95% CI [+27.1, +56.25]** | **V5-C2 passed** |

The oracle comparison has 21 positive instance pairs, one negative pair, and 26 ties. Its exact sign-flip value is \(p=1.10\times10^{-5}\). The inferred-plan effect does not meet the preregistered +10-point minimum effect, its interval includes zero, and its sign-flip value is \(p=1\).

The correct conclusion is:

> **Under the frozen DeepSeek-V4-Flash artifact-v5 protocol, once a correct plan is supplied, native batch Patch delivery is more reliable within budget than full-object Rewrite in the tested cells.**

The experiment does not establish:

> **End-to-end Agent-level Patch superiority.**

The planning stage is almost entirely at floor. A more reliable write interface can reduce loss after a correct plan exists; it cannot repair an incorrect plan.

---

## 1. The Question v5 Is Designed to Answer

Earlier experiments left an external-validity gap. Artifact-v3 compared strict textual Patch output with full-object Rewrite and used a deterministic executor for the Patch arm. It established a DeepSeek-specific advantage, but it was not a stable editing Agent with native tools.

Artifact-v5 therefore separates two questions:

1. **End-to-end question:** When the Agent must infer a plan and deliver the edit, does Patch outperform Rewrite?
2. **Delivery question:** When the correct plan is already known, does the native Patch tool outperform native full-object Rewrite?

These correspond to:

\[
\Delta_I =
P(\text{final exact success}\mid I\text{-}P\text{-}A)
-
P(\text{final exact success}\mid I\text{-}R\text{-}A)
\]

and

\[
\Delta_O =
P(\text{final exact success}\mid O\text{-}P\text{-}A)
-
P(\text{final exact success}\mid O\text{-}R\text{-}A).
\]

The mutually exclusive verdict hierarchy was frozen in advance:

```text
single_configuration_agent
delivery_only
insufficient_evidence
```

Artifact-v5 lands at `delivery_only`.

---

## 2. Experimental Design

### 2.1 Conditions

| Condition | Plan source | Write interface | What it measures |
|---|---|---|---|
| I-P-A | Model-inferred; shared before forking | `file_edit_batch` | End-to-end Patch Agent |
| I-R-A | Same shared inferred plan | `file_write` | End-to-end Rewrite Agent |
| O-P-A | Correct oracle plan | `file_edit_batch` | Patch delivery given a correct plan |
| O-R-A | Same correct oracle plan | `file_write` | Rewrite delivery given a correct plan |

The infer conditions generate a plan once per repeat and fork that same plan to both delivery arms. Delivery repair may correct tool submission, but it may not change `plan_hash`. This is essential: the experiment prevents a failed delivery arm from silently solving a different planning problem.

### 2.2 Matrix and Configuration

| Item | Value |
|---|---:|
| Object lengths \(N\) | 96, 384 |
| Edit counts \(k\) | 1, 10, 20 |
| \(N\times k\) cells | 6 |
| Instances per cell | 8 |
| Formal instances | 48 |
| Infer repeats | 2 |
| Oracle repeats | 1 |
| Infer arms | 192 |
| Oracle arms | 96 |
| **Total evaluated arms** | **288/288** |

Configuration:

- `SimpleDeepSeekClientChat / deepseek-v4-flash`
- `thinking=False`
- temperature=0, top_p=1, max_tokens=64000
- Chinese prompts
- 300-second episode budget
- at most one delivery repair

The design-time canonical payload-ratio preflight spans 0.045–1.785, covering Patch payloads much smaller than, close to, and larger than full-object Rewrite. These are canonical-plan design values, not recovered per-run tool-payload measurements.

### 2.3 Strict Success

A run succeeds only when the final workspace object exactly equals the ground truth within the episode budget. Formatting, stale state, tool errors, and verifier rejection all count as failure.

The inferential unit is the instance:

- average repeats within each infer instance;
- compute paired Patch-minus-Rewrite differences across 48 instances;
- use a fixed-seed 10,000-sample instance bootstrap;
- enumerate every sign flip when the number of nonzero pairs is at most 24.

Both V5-C1 and V5-C2 must satisfy all three gates:

1. mean difference at least +10 percentage points;
2. 95% interval excludes zero;
3. sign-flip \(p<0.05\).

---

## 3. Results

### 3.1 End-to-End Agent Superiority Is Not Established

I-P-A succeeds on 2/96 runs; I-R-A succeeds on 0/96. The instance-level difference is:

\[
\Delta_I=+0.0208,\qquad 95\%\ \mathrm{CI}=[0,0.0625],\qquad p=1.
\]

Only one of the 48 paired instances favors Patch; 47 are ties. The effect fails every practical or statistical requirement for V5-C1.

This is not evidence that the write interfaces are equivalent. It is a floor-limited end-to-end comparison: if the shared plan is wrong, neither write tool can produce the correct final object.

### 3.2 Patch Delivery Is Stronger When the Plan Is Correct

O-P-A succeeds on 46/48 runs; O-R-A succeeds on 26/48. The paired result is:

\[
\Delta_O=+0.4167,\qquad
95\%\ \mathrm{CI}=[0.2708,0.5625],\qquad
p=1.0967\times10^{-5}.
\]

This passes the preregistered minimum-effect, interval, and sign-flip gates.

Failure classes also fit a delivery interpretation:

| Condition | ok | verifier fail | format invalid | stale hash | tool error |
|---|---:|---:|---:|---:|---:|
| I-P-A | 2 | 93 | 0 | 1 | 0 |
| I-R-A | 0 | 86 | 10 | 0 | 0 |
| O-P-A | 46 | 1 | 0 | 1 | 0 |
| O-R-A | 26 | 10 | 11 | 0 | 1 |

With the plan fixed, Rewrite loses both through invalid full-object submission and through semantically incorrect objects rejected by the verifier. Patch largely avoids both classes in these cells.

### 3.3 Exploratory Oracle Results by Cell

Each cell contains eight oracle instances. The payload ratio is the design-time canonical value.

| \(N\) | \(k\) | Canonical payload ratio | Patch | Rewrite | Difference |
|---:|---:|---:|---:|---:|---:|
| 96 | 1 | 0.179 | 8/8 | 4/8 | +50.0 pp |
| 96 | 10 | 0.938 | 8/8 | 8/8 | 0 |
| 96 | 20 | 1.785 | 7/8 | 7/8 | 0 |
| 384 | 1 | 0.045 | 8/8 | 3/8 | +62.5 pp |
| 384 | 10 | 0.237 | 8/8 | 2/8 | +75.0 pp |
| 384 | 20 | 0.451 | 7/8 | 2/8 | +62.5 pp |

These cells are consistent with a Patch advantage for longer objects, but they do not identify a universal edit-density or payload crossover. Length, edit count, and payload ratio vary together, each cell has only eight instances, and the preregistered crossover claim concerns the floor-limited infer conditions.

### 3.4 Repair and Crossover Claims Remain Limited

The infer first-attempt and final Patch-minus-Rewrite differences are both +2.1 points. No repair attenuation or recovery is observed, but the comparison is almost entirely at floor and is descriptive only.

V5-C4 is **not adjudicated**, rather than falsified:

- five of six infer cells have zero success in both arms;
- the only nonzero cell has an interval that includes zero;
- observed per-run payload telemetry was not retained.

“No crossover was observed” must not be rewritten as “there is no crossover.”

---

## 4. Why Theory and End-to-End Measurement Diverge

The conditional Patch argument assumes that a correct edit plan already exists. A simplified Agent success decomposition is:

\[
P(\text{success})
\approx
P(\text{plan correct})
\times
P(\text{delivery succeeds}\mid\text{plan correct}).
\]

Artifact-v5 directly supports a large difference in the second factor:

```text
correct plan
→ Patch delivery: 95.8%
→ Rewrite delivery: 54.2%
```

But the infer conditions require the first factor as well. When planning is almost always unsuccessful, the downstream delivery advantage is multiplied by a near-zero upstream probability.

Three conclusions follow:

1. **The conditional theory is not contradicted.** Its correct-plan assumption is exactly where the oracle result is positive.
2. **The end-to-end claim fails.** A real Agent needs planning and plan validation, not only a better editor.
3. **Tool substitution is not architecture.** A Patch tool can execute a bad plan more faithfully; it cannot make that plan correct.

---

## 5. Relation to Artifacts v3 and v4

| Artifact | Interface and regime | Result | Claim ceiling |
|---|---|---|---|
| v3 | One-shot text; one sparse edit; long objects | Infer +21.7 pp; oracle +40.8 pp | DeepSeek-specific Patch superiority under the frozen protocol |
| v4 | Shorter objects; five-edit candidate | +1.9 pp, interval includes zero | No unconditional transfer to shorter or denser repair |
| v5 | Native tool Agent; shared plan | Infer +2.1 pp failed; oracle +41.7 pp passed | Correct-plan delivery advantage only |

The results are not contradictory. Together they support a conditional routing law:

> Patch is favored when the plan is correct, the change is sparse enough, the object is long enough relative to addressing overhead, the executor is reliable, and the verifier can govern commit.

Outside those conditions, regional or full Rewrite may be appropriate. The experiment calibrates one part of this law; it does not make it universal.

---

## 6. Engineering Implications for Agent Development

### 6.1 Verify the Plan Before Granting Write Authority

The recommended state machine is:

```text
authoritative candidate
→ planner
→ plan schema and semantic verification
→ delivery router
→ Patch / regional Rewrite / full Rewrite
→ post-write verifier
→ commit or rollback
```

If the plan is unsupported or inconsistent, the system should replan, retrieve evidence, expand search, or escalate. It should not expect a different write tool to repair planning failure.

### 6.2 Make Patch a Governed Native Transaction

A production Patch path should provide:

- authoritative baseline and `expected_hash`;
- batch atomicity;
- old/new preconditions;
- deterministic validation;
- checkpoint and rollback;
- idempotent run identity;
- separate apply, verify, and commit stages.

Artifact-v5 reused hash, checkpoint, atomic-write, and validation components from `core/cc/editing`. Its batch editor remained experiment-local; the study did not benchmark the complete production `CcAgentRunner`.

### 6.3 Route Repair by Failure Layer

| Failure layer | Correct response |
|---|---|
| Wrong or unsupported plan | Replan, retrieve, or expand search |
| Correct plan, invalid tool arguments | Re-emit arguments |
| Stale hash or failed precondition | Reload authoritative state and replan |
| Executor or tool failure | Roll back and repair the tool or precondition |
| Verifier failure | Return a failure witness; repair locally or expand repair radius |
| Dense or global restructuring | Regional/full Rewrite plus full verification |

Artifact-v5 freezes `plan_hash` during delivery repair. That is why delivery repair cannot hide a planning failure.

### 6.4 Keep a Three-Way Editing Router

| Task state | Default interface |
|---|---|
| Sparse, localized, low coupling, verified plan | Patch + incremental verification |
| Moderate density, impact concentrated in one region | Function/subtree/section Rewrite |
| High density, schema change, or global restructuring | Full Rewrite + full verification |

The router should observe plan confidence, edit count and density, object length, address overhead, dependency frontier, executor/verifier reliability, budget, and configuration-specific success history.

### 6.5 Preserve Stage-Level Telemetry

The v5 artifact loss is itself an engineering lesson. An Agent evaluation should durably record:

- immutable run and prompt identity;
- plan and plan hash;
- every tool name and argument hash;
- state hash before and after;
- first-attempt and repaired outcome;
- repair count;
- observed Patch and Rewrite payload;
- latency and token usage;
- verifier witness;
- commit or rollback result.

Endpoint logs are enough for the current delivery verdict, but not for complete process-mechanism analysis.

---

## 7. Evidence Quality and Claim Boundary

The original formal `merged_runs.jsonl` and full tool-event payloads were lost after the API run during a branch switch. The current 288-row table was reconstructed by aligning all 288 `done` records in the complete `run.log` with the frozen run specification.

### Safe to cite

- 288/288 coverage;
- condition, instance, \(N\), \(k\), and repeat counts;
- final success;
- failure class;
- native-event count (506);
- final I-P/I-R and O-P/O-R paired effects.

Repeat labels within a duplicated infer prompt do not affect the per-instance two-repeat mean.

### Not safe to cite as exact process telemetry

- complete tool arguments or event order;
- exact delivery-repair API-call count;
- per-run latency or token usage;
- observed per-run payload ratio;
- post-hoc event-level proof of arm exclusivity.

The machine-readable summary therefore sets exact repair and total API counts to `null`, and marks V5-C4 as `not_adjudicated_floor_or_missing_payload_telemetry`.

This is a meaningful artifact weakness, but it does not reverse the endpoint counts. If v5 is promoted from supporting evidence to a paper-defining result, the highest-value replication is the same frozen design with durable native event retention.

---

## 8. What v5 Does and Does Not Establish

**Supported**

- Native Patch delivery can retain a large advantage over full-object Rewrite after a correct plan is supplied.
- A planning bottleneck can mask a downstream interface advantage in end-to-end Agent success.
- Agent evaluation should report stage-conditional reliability, not only one final success rate.
- Plan validation and write-interface routing are separate engineering responsibilities.

**Not supported**

- Patch always beats Rewrite.
- End-to-end Patch Agents are superior across tasks or models.
- The edit-density crossover has been identified.
- One delivery repair is ineffective in general.
- The result transfers directly to production code editing.
- The effect is independent of language, model, budget, executor, or verifier.

---

## 9. Reproducibility Sources

- [Frozen v5 design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_AGENT_PATCH_REWRITE_DESIGN_FREEZE.md)
- [Full v5 report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_STABLE_EDITING_AGENT_REPORT.md)
- [Machine-readable summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/summary.json)
- [Coverage audit](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/coverage.json)
- [Recovered endpoint rows](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/merged_runs.jsonl)
- [Complete run log](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/run.log)
- [Complete experiment repository](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment)

---

## 10. Conclusion

Artifact-v5 gives a narrower and more useful result than “Patch beats Rewrite”:

> **A stable native Patch path can make correct plans substantially more reliable to deliver, but an Agent still needs a reliable planner and a plan-verification gate before that advantage can improve end-to-end outcomes.**

The engineering prescription is therefore:

```text
verify the plan
+ minimize the model-authored commitment surface
+ apply through a transactional executor
+ verify the resulting state
+ commit or roll back
```

Patch is a conditional delivery advantage. Planning governance is what allows that advantage to become an Agent advantage.

---

## Related Documents

- [Aggregation Mismatch Artifact-v5: 中文](./aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)
- [Patch vs. Full Rewrite: A Controlled Sparse-Repair Experiment](./patch-vs-full-rewrite-controlled-experiment.md)
- [Aggregation Mismatch Artifact-v4: Evidence, Theory Gaps, and Agent Implications](./aggregation-mismatch-v4-claims-theory-gap.md)
- [Aggregation Mismatch: Derivable Claims and Agent Engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Aggregation Mismatch and Compositional Governance](./aggregation-mismatch-compositional-governance-llm-systems.md)
