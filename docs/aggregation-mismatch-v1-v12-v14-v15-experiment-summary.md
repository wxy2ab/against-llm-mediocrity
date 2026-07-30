# Aggregation Mismatch V1–V12, V14, and V15: Experiment Summary

**Evidence cutoff:** July 30, 2026

**Purpose:** Explain what each artifact tested, its strongest evidence, which
conclusions can inform agent engineering, and which claims remain
non-generalizable.

**中文：** [聚合失配 V1–V12、V14 与 V15 实验总览](./aggregation-mismatch-v1-v12-v14-v15-experiment-summary.zh-CN.md)

**Scope:** V13 is archived as a method-development artifact because all four
arms hit the ceiling. It is excluded from this evidence synthesis.

## 30-second summary

The series does not search for the “best prompt.” It decomposes a system-level
problem:

```text
Can apply local rules
≠ can construct a globally consistent object from scratch
≠ can infer the correct edit plan
≠ can reliably deliver a correct plan
≠ can safely commit after state drift
≠ may recover from a conflict without unsafe retry
```

V1–V2 establish a budgeted global-construction gap. V3–V5 separate planning
from Patch/Rewrite delivery. V6–V10 test schedulers, ledgers, failure routing,
compilers, semantic addressing, receipts, and canonicalization. V11–V12
transfer to configuration address drift and delivery scale. V14 tightens the
timing to genuine TOCTOU drift after payload seal. V15 separates safe conflict
rejection from runtime authorization to perform one rebase.

The most robust combined results are:

1. Under the same local XOR rule, complete periodic construction rapidly enters
   a budgeted difficulty region with length; open-boundary recurrence and
   candidate-conditioned audit complete much more often.
2. Candidate-conditioned auditing changes both information and interface, so it
   does not establish that “verification is generally easier than generation.”
3. Patch's advantage over Full Rewrite is conditional on plan quality, sparse
   edits, stable addressing, executor design, and budget.
4. Runtime readiness/ledger, semantic IDs, deterministic compilers, typed
   failures, atomic execution, and verifier-gated commit move some aggregation
   responsibility out of the model.
5. Scientific direction and adoption gates must remain separate: several
   positive estimates miss minimum-effect or interval gates, while ceilings and
   floors cannot be reported as equivalence or failure.
6. V14 establishes the safety sequence and stale-recovery mechanism, but its
   +19.3% token interaction misses the preregistered +20% threshold.
7. V15's machine primary passes: Intent-Rebase is 24/24 and Intent-Naive 0/24.
   This is a recovery-policy contrast with a Pilot Gate protocol caveat, not a
   general model-capability result.

## 1. Version overview

| Version | Formal scale | Core question | Strongest result | Main boundary |
|---|---:|---|---|---|
| V1 | 3 configurations × 500 prompts | Does the phenomenon cross configurations? | B is 0/50 in all three; syndrome E is 50/50 | B is all timeout; exploratory |
| V2 | 1,596 + 540 follow-up | Length, budget, A/B, and C/B | A−B +0.956/+0.822; C−B +0.956/+0.911 | C−B confounds candidate and interface |
| V3 | DeepSeek 1,920 | Sparse Patch vs Rewrite | infer +0.217; oracle +0.408; 900s +0.258 | One model and sparse point edits |
| V4 | DeepSeek 756 | Information, budget, interface, order | sufficient correct bits +0.741 | random bits are no weaker than cut-set |
| V5 | 288 agent arms | Planning vs delivery | oracle Patch−Rewrite +0.417 | infer planning floor |
| V6 | 624 calls + 10,000 offline | Agent control plane | scheduler +0.438; router +0.3125 | router gain comes only from plan error |
| V7 | 240 calls + 48 offline | Order, receipt, compiler | deterministic compiler 48/48 | order/receipt miss gates |
| V8 | 288 episodes + 64 offline | Runtime ownership and ID/index | scaffold +0.594; ID−INDEX +0.3125 | scaffold costs about 7× tokens |
| V9 | DeepSeek 192 | ready×ledger and receipt recovery | A at floor; B +0.125 misses | package cannot be decomposed into field effects |
| V10 | DeepSeek 64 + 1,024 offline | Semantic-set canonicalization | offline 1,024/1,024 | end-to-end +0.0625 misses +20pp |
| V11 | DeepSeek 256 + 1,024 offline | Address drift and delivery×density | relocation interaction +0.21875 | effect comes from N=48; B at ceiling |
| V12 | DeepSeek 240 + 768 offline | Drift dose and Patch/Region/Full | sparse Patch−Full +0.2917 | high−low interaction fails |
| V14 | DeepSeek 96 + 768 offline | Post-seal drift and Exact recovery | 24/24 stale+recovery; +19.3% tokens | misses preregistered +20% |
| V15 | DeepSeek 96 + 768 offline | Locked conflict and recovery governance | Rebase 48/48; Naive 0/24; A1 +1.0 | recovery permission is structural; Pilot Gate deviation |

## 2. V1–V2: From observation to a confirmatory construction gap

V1 observes periodic-closure B at 0/50 in three deployment configurations,
while syndrome-supplied E is 50/50. V2 uses 1,596 confirmatory results and 540
contemporaneous C+B follow-ups to address V1's length floor, run accounting, and
contemporaneous-control problems.

Across 15 matched instances at \(N\in\{32,48,68\}\):

| Contrast | DeepSeek | MiniMax |
|---|---:|---:|
| A / B | 45/45 vs 2/45 | 37/45 vs 0/45 |
| A−B | +0.956 | +0.822 |
| C invalid / B | 176/180 vs 1/45 | 164/180 vs 0/45 |
| C−B | +0.956 | +0.911 |

V2 supports a length- and budget-dependent structural/interface gap. C−B is not
a pure verification effect because C also supplies a complete candidate and
changes the output operation.

## 3. V3–V5: Patch/Rewrite and the planning–delivery decomposition

V3 confirms a Patch delivery advantage for DeepSeek on 160 new sparse-repair
holdouts:

- Infer @300s: 228/480 vs 124/480, +0.217;
- Oracle plan @300s: 240/240 vs 142/240, +0.408;
- Infer @900s: 83/120 vs 52/120, +0.258.

V4's short five-bit condition is near zero, showing that Patch is not an
unconditional law. V5 separates planning from delivery with native tools:
infer is 2/96 vs 0/96 and does not pass; oracle is 46/48 vs 26/48, +0.417 and
passes. A better delivery interface cannot repair an invalid plan.

## 4. V6–V8: Moving aggregation responsibility into the runtime

V6's dependency scheduler improves by +0.438, stage-aware failure routing by
+0.3125, and 10,000 governed-commit offline cases show no
invalid/duplicate/hash violation. The routing gain comes entirely from plan
errors; delivery-error recovery remains 0/24.

V7's requested topological order and located receipt have positive estimates
but miss confirmatory gates; its deterministic compiler passes 48/48. V8's
runtime scaffold improves from 11/32 to 30/32, and ID Patch improves over INDEX
from 43/64 to 63/64. The scaffold costs roughly 7.04× median tokens, while local
verifier increment is not adjudicated because of a ceiling.

## 5. V9–V10: Package effects, acceptance boundaries, and canonicalization

V9's harder effort-matched ready×ledger arms nearly all hit the floor. Of 95
failures, 77 submit the correct ready-ID set but are rejected solely for order.
Located and causal receipts each exceed generic by 12.5 points, but miss the
combined interval, Holm, and minimum-effect gates.

V10 turns that diagnosis into semantic-set plus runtime canonicalization. The
offline implementation passes 1,024/1,024, and 24 successful SET episodes depend
on non-canonical-order normalization. Formal success is only 30/32 vs 28/32,
and +0.0625 misses the +20pp gate. The justified conclusion is “do not encode
harmless order in the semantic rejection boundary,” not “all end-to-end tasks
improve dramatically.”

## 6. V11–V12: Address drift and delivery scale

V11's relocation×(ID−INDEX) interaction is +0.21875 and passes; all seven
differences come from \(N=48\) relocated-index precondition failures.
Patch/Rewrite reliability is ceiling-limited at 32/32 in all four arms, while
Patch uses substantially fewer tokens, wall time, and response bytes.

V12's high−low drift-dose interaction is −0.0417 and fails. ID scores 24/24 at
both drift levels while INDEX scores 6/24 and 7/24, demonstrating why large
simple effects cannot be substituted for a monotone dose interaction. Sparse
Patch/Full scores 24/24 vs 17/24; +0.2917 passes, with all seven differences
caused by Full timeout within 300 seconds. Dense Regional scores only 8/24, so
Regional cannot be a universal middle route.

## 7. V14: Post-compile drift and Exact recovery

V14 injects drift only after payload seal. Formal coverage is 96/96, pilot
12/12, offline 768/768, with 1,416 formal raw events and zero endpoint-rebuild
mismatches.

Compatible Exact returns `STALE_OLD_VALUE` on all 24 first attempts and then
completes 24/24 located recoveries. Compatible Intent commits 24/24 on the first
attempt, and all four arms finish 24/24. The primary is:

\[
\Delta_{A1}=0.176459,\quad
95\%\ CI=[0.168331,0.184575],\quad
p_{\mathrm{exact}}=1.1921\times10^{-7}.
\]

Because \(0.176459<\log(1.20)=0.182322\), V14-A1 is
`failed_pre_registered_gate`. The mechanism and safety semantics hold; the
frozen +20% cost commitment does not.

See the [bilingual V14 report](./aggregation-mismatch-v14-post-compile-drift-recovery.md).

## 8. V15: Locked conflict and governed rebase

V15 completes 96/96 formal episodes, 12/12 pilot cases, and 768/768 offline
cases. Its 1,594 events reconstruct all endpoints with zero mismatch. All 72
conflict-arm first commits are safely rejected. Compatible Intent succeeds
24/24 on the first attempt; Intent-Naive terminates 0/24; Intent-Rebase and
Exact-Rebase each recover 24/24.

\[
\Delta_{\text{Intent Rebase−Naive}}=1.0,\quad
95\%\ CI=[1.0,1.0],\quad
p_{\mathrm{exact}}=1.1921\times10^{-7}.
\]

The machine claim state is `passed`, but the evidence-sharing state is
`share_with_caveats`: Naive is structurally forbidden to recover, and the
frozen Pilot Gate says every arm must reach 2/3 although the implementation
applies that gate only to non-Naive arms. The formal effect recomputes, but the
artifact is not fully preregistration-conformant.

See the [bilingual V15 report](./aggregation-mismatch-v15-intent-conflict-governance.md).

## 9. Claims with relatively strong support

| Claim | Evidence | Current scope |
|---|---|---|
| Local ability does not automatically aggregate into global construction | V1–V2 | Synthetic GF(2), two primary configurations |
| Completion difficulty changes with length and budget | V2–V4 | Budgeted endpoint |
| Correct external information or candidates can restore some construction | V2, V4 | Information and interface often co-vary |
| Reducing delivery surface after a correct plan can improve reliability | V3, V5, V12 | DeepSeek and frozen sparse tasks |
| Dependency-aligned runtime has value | V6, V8 | Package interventions |
| Prefer deterministic compile for a correct plan | V7–V8 | Synthetic adoption gates |
| Runtime should own physical addressing and acceptance boundaries | V8, V10–V12 | Synthetic configuration tasks |
| Post-seal Exact must stale; typed recovery can complete | V14 | One model and monotone fields |
| Conflict rejection and recovery permission should be separate runtime policies | V15 | Synthetic single-model protocol |

## 10. Claims not established

- Verification is generally easier than generation.
- Patch always beats Rewrite, or Regional is always the best compromise.
- Higher drift necessarily further enlarges semantic-ID advantage.
- Requested order, located receipt, ready set, or ledger has a universal
  independent main effect.
- Semantic-set acceptance generally adds at least 20 points.
- Intent always beats Exact, or arbitrary Intent can be merged safely.
- Exact recovery has confirmed an at-least-20% token interaction.
- The model has general conflict-resolution ability, Intent beats Exact, or all
  conflicts should automatically rebase.
- Longer budgets generally restore periodic construction.
- One synthetic DeepSeek experiment generalizes across models, languages, and
  real engineering tasks.
- Passing every offline case implies 100% production reliability.

## 11. Unified interpretation

The most consistent account is not “the model cannot XOR” or “the model cannot
edit.” The model is often assigned too many compositional responsibilities:

```text
Model is better suited to:
  interpreting uncertain semantics, proposing candidates, producing semantic plans

Runtime is better suited to:
  owning authoritative state, tracking dependencies, resolving addresses,
  canonicalizing, compiling tool arguments, executing atomically,
  verifying, governing conflict recovery, committing/rolling back,
  and recording events
```

When search, global state, physical addressing, long-object serialization,
stale-precondition rebinding, and commit all remain model-owned, local
capabilities are lost in composition. Agent engineering is primarily a
responsibility-allocation problem, not an unlimited-prompt problem.

## 12. Rules for cross-version use

- Do not pool run counts, success rates, or \(p\)-values across artifacts.
- Do not promote secondary or exploratory analyses to primary claims.
- Do not rewrite floor/ceiling as failure, equivalence, or ineffectiveness.
- Do not rewrite a failed minimum-effect gate as a zero effect.
- Do not call a machine primary “fully preregistered” when frozen prose and
  executable gates differ.
- Do not generalize budgeted success to unlimited-budget semantic correctness.
- Keep model, object, budget, tool, plan-quality, and verifier-coverage labels
  attached to every production rule.

## Related documents

- [V1–V12, V14, and V15: agent engineering lessons](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v15.md)
- [V15 Intent Conflict Governance](./aggregation-mismatch-v15-intent-conflict-governance.md)
- [V14 Post-Compile Drift and Exact Recovery](./aggregation-mismatch-v14-post-compile-drift-recovery.md)
- [Theoretical claims, proof conditions, and agent engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Patch vs Full Rewrite controlled experiment](./patch-vs-full-rewrite-controlled-experiment.md)
