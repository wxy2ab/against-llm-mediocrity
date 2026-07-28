# Patch vs. Full Rewrite: A Controlled Experiment on Sparse Repair Delivery

**Subtitle: When a model can find or is given the local change, why should it not be required to resubmit the entire object?**<br>
**Status: Research evidence note v0.4**<br>
**Data validated: July 28, 2026; includes artifact-v4, artifact-v5, and artifact-v7 boundary evidence**<br>
**Claim scope: One DeepSeek-V4-Flash deployment configuration; the MiniMax confirmatory matrix was stopped for cost and is excluded from adjudication**<br>
**中文：** [Patch 与完整重写：稀疏修复交付接口的受控实验](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)<br>
**Bilingual synchronization rule:** Keep condition names, sample sizes, statistical results, evidence cutoff, and claim boundaries aligned across both versions.

---

## Technical Summary

This experiment isolates one interface question:

> For sparse one-bit repair, with instance, candidate, corruption, model configuration, and budget matched, is it more reliable to have the model submit a strict patch for deterministic execution than to require the model to emit the complete repaired object?

Across 160 new holdout instances, four lengths \(N\in\{96,145,240,384\}\), three repeats per condition, and a 300-second budget:

| DeepSeek-V4-Flash | Patch | Full rewrite | Patch − rewrite |
|---|---:|---:|---:|
| Strict system success | 228/480 (47.5%) | 124/480 (25.8%) | **+21.7 pp** |
| Instance-level bootstrap 95% CI | | | **[+16.5, +26.9] pp** |

When both interfaces received the same authoritative edit plan, patch achieved 240/240 while full rewrite achieved 142/240, a difference of **+40.8 pp [+31.3, +50.4]**. A pure copy control achieved 120/120, so the result is not explained by an inability to emit strings of these lengths. On an independently preallocated 900-second subset, patch still led by **+25.8 pp [+15.0, +37.5]**.

The supported conclusion is:

> **Under the frozen DeepSeek-V4-Flash artifact-v3 sparse one-bit repair protocol, patch plus a deterministic executor provides higher budgeted end-to-end exact reliability than full rewrite.**

The evidence does not establish that patch always beats rewrite, that the result generalizes across models, that it persists under unlimited budget, or that it transfers directly to real software-engineering tasks.

Artifact-v5 adds a native-tool Agent boundary. With a correct oracle plan, batch
Patch succeeds on 46/48 versus 26/48 for full-object Rewrite, a **+41.7 pp
[+27.1, +56.25]** delivery advantage. Under inferred plans, however, the
end-to-end comparison is only 2/96 versus 0/96 and fails its preregistered gate.
The v5 verdict is therefore `delivery_only`, not end-to-end Agent superiority.

Artifact-v7 adds a different delivery-error boundary. After a correct plan and a
failed first delivery are fixed, one full-rewrite fallback succeeds on 26/48 cases,
compared with 13/48 for one field-located patch re-emission, a **+27.1 pp
[+6.2, +47.9]** difference. That contrast had no preregistered directional pass
gate and is heterogeneous by failure subtype, so it does not reverse the v3/v5
conditional Patch result. More importantly, a deterministic plan compiler succeeds
on 48/48 frozen cases with zero protected violations. The preferred production
boundary is therefore: **compile a verified plan when possible; route Patch versus
Rewrite only as a fallback.**

---

## 1. Why Patch vs. Rewrite Needs Its Own Study

A repair task contains at least two distinct stages:

```text
discover what should change
→ deliver that change reliably to the system
```

An end-to-end failure can come from:

- failure to find the corrupted position;
- finding the position but selecting the wrong new value;
- a correct edit plan serialized as invalid patch syntax;
- a correct edit plan followed by collateral errors in a full rewrite;
- failure to finish within the output budget;
- incorrect executor or evaluator semantics.

Artifact-v3 uses paired conditions to separate **plan inference** from **repair delivery**. It asks not only whether the model repairs the object, but:

> When repair intent is matched—or the edit plan is explicitly supplied—does submitting a local operation instead of the complete object change system reliability?

---

## 2. Task and Six Experimental Conditions

Every instance has a unique GF(2) ground-truth sequence. The model receives a complete candidate with exactly one corrupted bit and is told that exactly one error exists.

All six conditions share rules, candidate, and truth. Paired conditions change only what the model must submit.

| ID | Condition | Information supplied | Required submission | Question answered |
|---|---|---|---|---|
| I-P | infer patch | Rules + one-error candidate | Strict one-edit patch JSON | End-to-end patch repair |
| I-R | infer full rewrite | Same as I-P | Complete repaired \(N\)-bit sequence | End-to-end full rewrite |
| O-P | oracle-plan patch | Candidate + authoritative edit plan | Strict patch JSON | Patch delivery with known plan |
| O-R | oracle-plan full rewrite | Same edit plan as O-P | Complete repaired sequence | Full delivery with known plan |
| I-PR | patch then rewrite | Same as I-P/I-R | Patch + complete repaired sequence | Within-response delivery decomposition |
| COPY | copy only | Correct full sequence supplied | Copy the sequence exactly | Rule out pure copying / long-string failure |

The primary estimand is:

\[
\Delta =
P(\mathrm{system\_exact\_success}\mid I\text{-}P)
-
P(\mathrm{system\_exact\_success}\mid I\text{-}R).
\]

Output length and serialization cost are part of the interface treatment, not confounders to remove. The study asks whether reducing the final commitment surface to a patch improves system-level delivery.

---

## 3. Frozen Design, Run Scale, and Scoring

### 3.1 Instances and Configuration

- 160 new confirmatory holdouts, absent from v1/v2;
- \(N\in\{96,145,240,384\}\), 40 instances per length;
- 3 repeats per condition;
- Chinese prompts;
- temperature=0, top_p=1, max_tokens=64000;
- 300-second primary budget and independent 900-second sensitivity budget;
- primary configuration: `deepseek_v4_flash`.

### 3.2 DeepSeek Run Ledger

| Block | Conditions | Instances | Repeats | Runs |
|---|---|---:|---:|---:|
| Primary @300s | I-P, I-R | 160 | 3 | 960 |
| Oracle plan @300s | O-P, O-R | 80 | 3 | 480 |
| Mechanism controls @300s | I-PR, COPY | 40 | 3 | 240 |
| Independent budget sensitivity @900s | I-P, I-R | 40 | 3 | 240 |
| **Total** | | | | **1,920** |

Coverage audit:

```text
expected = 1,920
selected = 1,920
missing = 0
unexpected = 0
duplicates = 0
```

### 3.3 Strict Success Definition

For I-P / O-P:

```text
strictly valid patch JSON
∧ correct edit content
∧ deterministic application equals ground truth
```

For I-R / O-R / COPY:

```text
valid full-sequence format
∧ correct length
∧ sequence exactly equals ground truth
```

Timeout, max-token, format-invalid, returned-wrong, empty-visible, and transport errors all count as failures. The inferential unit is the instance: the analysis first averages the three repeats within an instance and then uses instance-cluster bootstrap. Best-of selection is prohibited.

---

## 4. Primary Result: Patch Significantly Outperforms Full Rewrite at 300 Seconds

| 160 instances × 3 repeats | I-P patch | I-R full rewrite | Patch − rewrite |
|---|---:|---:|---:|
| Strict success | 228/480 (47.5%) | 124/480 (25.8%) | **+21.7 pp** |
| Instance-level bootstrap 95% CI | | | **[+16.5, +26.9] pp** |
| Instance direction | | | n10=80, n01=14 |
| Minimum practical-effect gate | | | +10 pp, **passed** |

The sign-flip test used 100,000 Monte Carlo draws and observed no equally or more extreme random flip. It must therefore be reported as:

\[
p<10^{-5}
\quad\text{(Monte Carlo resolution)}.
\]

It is not an exact \(p=0\).

### 4.1 Results by Length

| \(N\) | I-P patch | I-R full rewrite | Run-level difference |
|---:|---:|---:|---:|
| 96 | 104/120 (86.7%) | 92/120 (76.7%) | +10.0 pp |
| 145 | 85/120 (70.8%) | 27/120 (22.5%) | +48.3 pp |
| 240 | 28/120 (23.3%) | 4/120 (3.3%) | +20.0 pp |
| 384 | 11/120 (9.2%) | 1/120 (0.8%) | +8.3 pp |

Three boundaries matter:

1. all four frozen lengths define the effect; \(N=145\) cannot be selected alone;
2. the patch advantage is not monotonic in length;
3. patch does not eliminate scale difficulty—its own success is only 9.2% at \(N=384\).

The correct interpretation is that patch reduces delivery burden without removing the combined difficulty of plan inference, global computation, and finite budget.

---

## 5. Failure Classes: Mostly Budgeted Completion, but Not Only Timeout

| Condition | ok | timeout | format-invalid | returned-wrong |
|---|---:|---:|---:|---:|
| I-P | 228 | 246 | 0 | 6 |
| I-R | 124 | 333 | 9 | 14 |

Full rewrite adds:

- 87 timeouts;
- 9 format failures;
- 8 additional returned-but-wrong results.

The primary effect is therefore largely a fixed-budget completion difference, but the study has not proved that unlimited waiting makes the interfaces equal. Nor is the result an unlimited-budget measure of pure semantic capability.

The metric is consistently described as:

> **budgeted system exact success**

not unbounded raw-model capability.

---

## 6. Mechanism Controls: Full Rewrite Still Lags When the Edit Plan Is Known

### 6.1 O-P vs. O-R

O-P and O-R receive exactly the same authoritative edit plan and differ only in the required submission:

| 80 instances × 3 repeats | O-P patch | O-R full rewrite | Patch − rewrite |
|---|---:|---:|---:|
| Strict success | 240/240 (100%) | 142/240 (59.2%) | **+40.8 pp** |
| Instance-level bootstrap 95% CI | | | **[+31.3, +50.4] pp** |

O-P is 60/60 at every length. O-R falls from 58/60 at \(N=96\) to 7/60 at \(N=384\).

Because position, old value, and new value are already supplied, the difference cannot be attributed to error localization. It directly shows:

> Even with a correct edit plan, applying the local edit across a complete object, reserializing it, and submitting it exactly creates additional delivery burden.

### 6.2 COPY Control

COPY succeeds at 30/30 for every length:

\[
120/120=100\%.
\]

Strings of length 96–384 are therefore not intrinsically impossible to emit. O-R is more specifically difficult at:

```text
read edit plan
→ modify the correct location
→ preserve every other location
→ resubmit the complete object
```

### 6.3 I-PR: Patch Then Rewrite Within One Response

I-PR contains 120 runs:

| Event | Result |
|---|---:|
| Patch correct | 33/120 (27.5%) |
| Patch and full sequence both correct | 30/120 (25.0%) |
| Patch correct but full sequence wrong | 3/120 (2.5%) |
| Timeout | 85/120 (70.8%) |

The three patch-correct/full-sequence-wrong runs provide direct within-response serialization failures. Because I-PR has 85 timeouts, the stronger mechanism evidence remains the more complete O-P/O-R comparison.

---

## 7. Independent 900-Second Budget Sensitivity

Forty instances were fixed before confirmatory results were inspected. Both I-P and I-R were independently rerun from scratch for 900 seconds; this was not a timeout-only rerun.

| 40 instances × 3 repeats | I-P patch | I-R full rewrite | Patch − rewrite |
|---|---:|---:|---:|
| Strict success | 83/120 (69.2%) | 52/120 (43.3%) | **+25.8 pp** |
| Instance-level bootstrap 95% CI | | | **[+15.0, +37.5] pp** |
| Sign-flip | | | \(p=4.0\times10^{-5}\) |

A descriptive same-cohort comparison for the 40 preallocated instances is:

| Budget | I-P patch | I-R full rewrite | Run-level difference |
|---:|---:|---:|---:|
| 300 seconds | 59/120 (49.2%) | 32/120 (26.7%) | +22.5 pp |
| 900 seconds | 83/120 (69.2%) | 52/120 (43.3%) | +25.8 pp |

More budget improves both interfaces but does not remove the patch advantage in this preallocated subset. The 300-second row is a descriptive recomputation over the same preallocated cohort; the 900-second effect and interval remain the frozen sensitivity analysis.

This is not a single-call survival curve, and 300-second and 900-second outcomes cannot be spliced into `success@900`. It is:

> **an independently preallocated 900-second budget-sensitivity analysis.**

---

## 8. What the Experiment Establishes

### 8.1 Supported

1. **Configuration-specific end-to-end advantage.** Patch plus executor beats full rewrite under the frozen DeepSeek protocol.
2. **Independent delivery burden.** With the edit plan supplied, full-object application and serialization still lag substantially.
3. **Not a pure copying obstacle.** Copy succeeds 120/120 over the same length range.
4. **The measured difference survives the tested budget extension.** The independent 900-second subset remains positive.
5. **Patch mitigates but does not eliminate scale effects.** Both interfaces decline with length.
6. **The treatment is a system interface.** Output length, serialization, executor semantics, and fixed wall-clock budget belong to the deployment protocol being compared.

### 8.2 Not Supported

- patch beats rewrite across every model, task, length, and edit density;
- the DeepSeek result is already a cross-model law;
- MiniMax v3 completed a confirmatory replication;
- full rewrite remains worse with unlimited time or tokens;
- the effect is pure “semantic ability” rather than budgeted delivery behavior;
- one-bit GF(2) repair transfers directly to code, databases, configuration, or documents;
- patch removes the need for global verification;
- plan inference and delivery are fully separated in the primary I-P/I-R comparison.
- artifact-v5 proves end-to-end Agent-level Patch superiority;
- the edit-density crossover has been identified.

### 8.3 Artifact-v5 Native-Tool Boundary

Artifact-v5 compares native `file_edit_batch` with native `file_write` while
sharing candidate, plan, verifier, 300-second episode budget, and one allowed
delivery repair:

| v5 comparison | Patch | Rewrite | Difference | Verdict |
|---|---:|---:|---:|---|
| Inferred plan | 2/96 | 0/96 | +2.1 pp [0, 6.25] | V5-C1 failed |
| Oracle plan | 46/48 | 26/48 | +41.7 pp [27.1, 56.25] | V5-C2 passed |

This result strengthens the delivery mechanism while narrowing the Agent claim:

> **A correct plan can be delivered more reliably through native batch Patch,
> but a planning floor can prevent that delivery advantage from improving the
> end-to-end Agent.**

The crossover remains unadjudicated because five of six infer cells are at a
two-arm zero floor and observed per-run payload telemetry was not retained.

---

## 9. Relation to the Theoretical Derivation

For complete-object length \(N\) and a patch touching \(k\) positions:

\[
L_{\text{rewrite}}=Nc_r,
\]

\[
L_{\text{patch}}
=c_0+k(c_p+\lceil\log_2N\rceil).
\]

With sparse change, a correct executor, and delivery reliability that declines monotonically with commitment surface, patch delivery dominance follows conditionally.

Artifact-v3 supplies two empirical layers:

| Theoretical layer | Experimental contrast |
|---|---|
| With the correct plan known, the smaller commitment surface should be more reliable | O-P vs. O-R |
| When the model must infer the plan, does the interface advantage survive end to end? | I-P vs. I-R |

The appropriate conclusion is:

> **Patch > rewrite is a conditional interface law; artifact-v3 shows that its conditions produce an observable end-to-end advantage in one frozen DeepSeek sparse-repair protocol.**

The experiment does not locate the edit-density crossover in real tasks or prove that patch-plan inference is universally easier.

### 9.1 Why Artifact-v4 Does Not Reproduce the Patch Advantage

The completed artifact-v4 compares a five-bit candidate at
\(N\in\{24,32,48\}\):

| Condition | Strict success | Contrast |
|---|---:|---:|
| C1 full rewrite | 7/54 (13.0%) | |
| C2 patch | 8/54 (14.8%) | +0.019 [−0.037, 0.074] |

This near-zero result neither overturns v3 nor belongs in a pooled estimate with
v3. Artifact-v4 uses five edits and shorter objects, making patch addresses and
values relatively more expensive, while both conditions are timeout-floor
censored. Artifact-v3 uses one-bit sparse repair and long \(N=96\)–384 objects.

Together, the studies support a more precise engineering conclusion:

> **Patch advantage has a regime determined jointly by edit density, object
> length, address overhead, dependency coupling, and budget. Artifact-v3 confirms
> a sparse-long-object regime; artifact-v4 prevents unconditional
> extrapolation.**

### 9.2 Artifact-v5 Separates Planning from Native Delivery

Artifact-v5 reproduces the oracle delivery magnitude in a native-tool loop:
v3 O-P−O-R is +40.8 points and v5 O-P-A−O-R-A is +41.7 points. But v5's inferred
end-to-end comparison fails. This supports the correct-plan delivery theory and
simultaneously shows why an Agent needs a plan-verification gate.

The system implication is multiplicative:

\[
P(\text{end-to-end success})
\approx
P(\text{plan correct})
\times
P(\text{delivery succeeds}\mid\text{plan correct}).
\]

A stronger editor changes the second term. It does not automatically improve the
first.

---

## 10. Engineering Implications for Agent Development

### 10.1 Operation-First, Not Object-Rewrite-First

The model should normally submit:

- edit operations;
- AST transforms;
- JSON Patch;
- database migrations;
- tool arguments;
- section-level replacement.

The runtime owns the base object and applies changes through a deterministic executor. A complete object should not overwrite authoritative state merely because the model emitted a new version.

### 10.2 Separate Discovery from Delivery

Agents should measure:

```text
plan_correct
delivery_correct_given_plan
executor_success
verifier_success
commit_success
```

Failure routing should differ by layer:

- wrong plan → replan / retrieve / expand search;
- correct plan, invalid format → re-emit;
- executor failure → repair tool or preconditions;
- verifier failure → rollback + failure witness;
- length/budget failure → patch, regional rewrite, or budget escalation.

Artifact-v5 shows that this separation must be enforced as a gate, not merely
logged after the fact. A plan that has not passed schema, precondition, and semantic
checks should not receive write authority.

### 10.3 Use Three Repair Scales

| Task state | Default interface |
|---|---|
| Sparse, localized, low coupling | Patch + incremental verification |
| Moderate density, impact concentrated in one region | Function / subtree / section rewrite |
| High density, schema change, or global restructuring | Full rewrite + full verification |

The experiment supports implementing a strong patch path first. It does not support a hard-coded rule that always chooses patch. The crossover must be measured by domain, model, and cost.

### 10.4 Executor and Verifier Are Required System Components

Patch is not merely “asking the model to write less.” The reliable flow is:

```text
authoritative object
→ model proposes patch
→ deterministic executor applies it in a sandbox
→ local and global verifiers run
→ commit or rollback
```

Without an authoritative baseline, deterministic application, and final verification, the structural patch advantage cannot become a reliable state update.

---

## 11. Cross-Configuration Evidence Status

The MiniMax artifact-v3 run was stopped after 182 incomplete results because of cost and long-runtime burden. Those data:

- are excluded from the 1,920-row DeepSeek coverage ledger;
- do not enter formal effect estimation;
- do not support a cross-configuration superiority verdict.

In earlier v2 evidence, MiniMax patch minus rewrite without syndrome was +44.4 pp with a 95% CI of [+24.4, +64.4]. This is directionally consistent exploratory evidence, not a replacement for the unfinished v3 confirmatory replication.

The current claim ceiling remains:

```text
single_configuration
```

Cross-model replication is a separate research task, not an accomplished result of this study.
Artifact-v5 also uses only the DeepSeek configuration; its `delivery_only` verdict
does not raise the cross-configuration claim ceiling.

---

## 12. Reproducibility and Evidence Sources

Frozen identity:

- study: `patch_rewrite_v3`
- schema: `artifact-v3`
- dataset: `dataset/artifact-v3/3202c269677098eb`
- prompt set: `promptset/artifact-v3/c4dd075ff290e04d`
- design manifest SHA-256: `9b0b3fa6298cc29a03388cfcf84e1873aa3f8b30950d7ca14d8d4b845bc00114`

Sources:

- [Frozen design](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/PATCH_VS_REWRITE_V3_DESIGN_FREEZE.md)
- [Confirmatory report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/PATCH_VS_REWRITE_V3_REPORT.md)
- [Machine-readable summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/patch_rewrite_v3/confirmatory/analysis/summary.json)
- [Coverage audit](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/patch_rewrite_v3/confirmatory/analysis/coverage.json)
- [Artifact-v5 stable editing Agent report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_STABLE_EDITING_AGENT_REPORT.md)
- [Artifact-v5 machine-readable summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/summary.json)
- [Artifact-v7 mechanism-recovery validation](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V7_AGENT_MECHANISM_RECOVERY_VALIDATION.md)
- [Complete experiment repository](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment)

The v5 formal endpoint table was reconstructed from the complete run log after
the original tool-event payloads were lost. Its final success and failure-class
counts are usable; exact repair-call, latency, and observed-payload telemetry are
not.

---

## 13. The Most Decision-Relevant Next Questions

| Question | Why it matters | Recommended comparison |
|---|---|---|
| Cross-configuration replication | Determines whether the claim can move beyond one deployment configuration | I-P / I-R / O-P / O-R on a low-cost, version-fixed second model |
| Edit-density crossover | Determines when routing should switch from patch to regional or full rewrite | \(k/N\) gradient × patch / region rewrite / full rewrite |
| Regional coupling | The same \(k\) may have different difficulty under different dependency density | Dispersed edits vs. edits inside one dependency subgraph |
| Real-domain transfer | Determines the engineering external validity of GF(2) | Code, JSON/configuration, database migration, structured documents |
| Verifier / executor reliability | Determines whether interface advantage becomes commit safety | Correct plan × executor failure × verifier false acceptance |
| Budget and commitment surface | Distinguishes a budget shift from a more stable interface law | Independently allocated budget × output length × visible/reasoning tokens |
| v5 event-retaining replication | Restores the full native-tool audit trail | Same frozen 288-arm design with durable event payloads |
| Planning lift | Tests whether delivery advantage becomes end-to-end advantage away from floor | Verified or higher-success plans × the same native delivery arms |

The priorities are:

1. replicate the four core conditions on one cost-controlled second configuration;
2. measure the edit-density crossover among patch, regional rewrite, and full rewrite;
3. test transfer in real tasks with deterministic executors and hard verifiers.

These studies should calibrate the agent router. Until then, systems should retain configurable policies rather than hard-code the current DeepSeek effect sizes.

---

## 14. Conclusion

This study does not establish an unconditional law that patch is always better. It establishes a more useful conditional result for agent engineering:

> When the task is sparse local repair, the model must deliver an exact result under finite budget, and the system can apply a patch through a deterministic executor, submitting the local operation can substantially reduce failures introduced by full-object rewriting.

More concretely:

```text
the model discovers or confirms the change
+ patch minimizes the commitment surface
+ executor preserves unchanged regions
+ verifier controls commit
→ more reliable than asking the model to regenerate the authoritative object
```

Within the current evidence scope, this result is confirmed for the frozen DeepSeek-V4-Flash artifact-v3 protocol. Boundaries across models, edit densities, and real domains remain empirical.

Artifact-v5 sharpens the Agent implication: native Patch retains a +41.7-point
advantage after a correct plan is supplied, but the inferred-plan end-to-end claim
fails. The production rule is therefore **verify the plan, then route delivery**,
not simply “install a Patch tool.”

Artifact-v7 adds the next routing layer. If a verified plan can be compiled
deterministically, use the compiler rather than asking the model to re-emit either a
Patch or a Rewrite. When compilation is unavailable, the fallback remains
conditional: Rewrite is stronger than one located Patch re-emission in v7 overall,
but that result is protocol-specific and does not support a universal ordering.

---

## Related Documents

- [Patch vs. Full Rewrite: 中文](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)
- [Aggregation Mismatch Artifact-v7: Mechanism Recovery and Deterministic Delivery](./aggregation-mismatch-v7-mechanism-recovery.md)
- [Aggregation Mismatch Artifact-v4: Experimental Evidence, Theory Gaps, and Agent Implications](./aggregation-mismatch-v4-claims-theory-gap.md)
- [Aggregation Mismatch Artifact-v5: Stable Editing Agents and the Planning Bottleneck](./aggregation-mismatch-v5-stable-editing-agent.md)
- [Aggregation Mismatch: Derivable Claims, Proof Conditions, and Agent Engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Controlled evidence for aggregation mismatch and generation–verification asymmetry (Chinese)](./aggregation-mismatch-generation-verification-asymmetry-evidence.zh-CN.md)
- [Aggregation Mismatch and Compositional Governance in LLM Systems](./aggregation-mismatch-compositional-governance-llm-systems.md)
