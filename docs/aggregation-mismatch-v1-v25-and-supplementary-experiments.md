# Aggregation Mismatch V1–V25 and Supplementary Experiments

Updated: 2026-08-05<br>
Status: evidence synthesis; V1–V25 and completed supplementary probes<br>
Chinese version: [聚合失配 V1–V25 与后续补充实验总览](./aggregation-mismatch-v1-v25-and-supplementary-experiments.zh-CN.md)

## Verdict

The program establishes a robust, bounded claim: when the correct next output depends on constraints that are not yet represented in the prefix or runtime state, budgeted end-to-end construction can fail even when the model can execute the local rule. Performance improves when future constraints are externalized, a verified plan is compiled into deterministic actions, and authoritative state, addressing, locking, validation, and commit are owned by the runtime.

The evidence does **not** support a universal “verification is easier than generation” law, an unconditional “Patch beats Rewrite” rule, or an always-on Ladder/Stage writing policy. The strongest writing result is conditional: on the V22-r6 high-load natural-story subset, Ladder improved one blind editor's score by `+9.74/100 [6.32, 13.67]`; on low load the effect was approximately zero. Stage repair can fix known defects, but V25 did not establish an average finished-product advantage over Fixed Ladder.

## How to read the evidence

This is not one pooled experiment. It contains three evidence families with different endpoints:

| Evidence family | Main endpoint | What it can answer | What must not be pooled |
|---|---|---|---|
| Controlled GF(2) construction and Agent runtime, V1–V19 | Strict exact success within a fixed budget; safety/commit invariants | Construction, planning, delivery, state, and iteration mechanisms | Natural-writing quality scores |
| Natural writing and Stage repair, V20–V25 | Blind editorial quality, delivery, treatment fidelity, and cost | Conditional value of Ladder and post-draft repair | GF(2) exact-success rates |
| Wave34, MiniMax, and T1 supplements | Probe-specific strict success or exploratory rating | Ceiling escape and minimum cross-configuration checks | Full cross-model replication claims |

`passed` means a preregistered gate passed. `failed gate` means the specified minimum effect was not established, not that the true effect is zero. `ceiling` or `floor` means the contrast was not identifiable. `exploratory` and `share_with_caveats` must remain visibly qualified.

## Experiment ledger: V1–V25

### V1–V12: phenomenon, externalization, planning, and delivery

| Version | Design and scale | Main result | Frozen interpretation |
|---|---|---|---|
| V1 | Exploratory comparison; three configurations × 500 prompts | Exposed a large construction/audit/repair separation, but several cells were saturated or timeout-dominated | Pilot evidence only; V2 is the confirmatory authority |
| V2 | 1,596 confirmatory runs plus a separate 540-run contemporaneous C+B follow-up | On 15 matched instances, A/B was `45/45 vs 2/45` for DeepSeek and `37/45 vs 0/45` for MiniMax; invalid-candidate audit C was `176/180` and `164/180`, versus contemporaneous B `1/45` and `0/45` | Strong budgeted construction gap; C−B is candidate-conditioned auditing, not a pure verification effect |
| V3 | 1,920 DeepSeek runs on 160 new sparse-repair holdouts | Patch−Rewrite at 300 seconds was `+0.217 [0.165, 0.269]`; oracle-plan contrast was `+0.408`; an independently allocated 900-second subset remained positive | Patch plus deterministic execution wins in this sparse, long-object, single-configuration regime; not a universal editing law |
| V4 | 756 DeepSeek runs; V4B adds 54 audit/output cases | Full answer bits raised cyclic construction from `13/54` to `53/54`; equal-count random correct bits reached `54/54`; V4B audit-duty contrast was `+0.815` | Externalizing correct information works; structural cut-set position has no established special advantage; audit/output decomposition remains partly ceiling-limited |
| V5 | 288 native-tool Agent arms; later event-stream replication | Inferred-plan Patch/Rewrite was `2/96 vs 0/96`; oracle-plan Patch/Rewrite was `46/48 vs 26/48` in the historical run, while the event-stream replication raised oracle Rewrite and weakened the old delivery-only narrative | Delivery narrowing helps only after plan quality is secured; planning floor can erase the end-to-end advantage; historical V5 claims require the event-ledger caveat |
| V6 | 624 model-call keys plus 10,000 offline commit cases | Scheduler package `+0.438`; stage-aware routing `+0.313`, entirely from plan-error; governed commit gates passed; delivery-error recovery remained zero | Runtime scheduling, typed failure routing, and commit governance are useful, but routing gains are failure-layer specific |
| V7 | 240 calls plus 48 offline compiler cases | Requested order and localized receipt missed their gates; verified-plan deterministic compilation passed `48/48` | Compile a verified plan; do not infer that prompting for order or a localized receipt alone solves the problem |
| V8 | 288 episodes plus 64 offline cases | Gated ledger `+0.594`, semantic ID over index `+0.313`, deterministic compiler passed; density crossover failed and scaffold cost was high | Runtime-owned readiness/ledger and semantic addressing are supported as packages, with cost and identification limits |
| V9 | 192 effort-matched episodes | Ready/ledger factorial fell to a strict-order floor; located/causal receipt estimates were `+0.125` but missed the gate | A package effect cannot be assigned to a single switch without an identifiable contrast |
| V10 | 64 formal episodes plus 1,024 offline cases | Semantic-set canonicalizer passed offline; end-to-end SET−STRICT was only `+0.0625`, below the `+0.20` gate | The interface contract is sound, but a large success-rate promise was not established |
| V11 | 256 episodes plus 1,024 offline cases | Relocation × `(ID−INDEX)` interaction was `+0.21875`; Patch and Rewrite reliability both hit ceiling, while Patch was cheaper | Stable semantic IDs are valuable under layout drift; Patch cost advantage does not imply a reliability advantage at ceiling |
| V12 | 240 episodes plus 768 offline cases | Drift-dose interaction failed; sparse verified-plan Patch/Full was `24/24 vs 17/24`, `+0.2917` | Large-object sparse Patch improved 300-second strict delivery in DeepSeek; density monotonicity, Regional Rewrite optimality, and cross-model transfer were not established |

### V13–V19: state drift, conflict governance, and iteration granularity

| Version | Design and scale | Main result | Frozen interpretation |
|---|---|---|---|
| V13 | 96 formal plus 768 offline cases | All four arms were `24/24` | Archived/non-adjudicating because of ceiling and timing design; retained as method development, not used as positive evidence |
| V14 | 96 formal plus 768 offline cases under seal-before-drift timing | Compatible Exact was rejected stale and recovered `24/24`; token interaction was about `+19.3%`, just below the preregistered `+20%` gate | Stale-check and recovery mechanism supported; the primary minimum-effect claim failed |
| V15 | 96 formal plus 768 offline cases | Conflict first commits `0/72`; governed Intent/Exact Rebase `48/48`; Naive `0/24` | Machine primary passed, but the frozen Pilot wording differed from the executable gate: `share_with_caveats` |
| V16 | 96 formal plus 768 offline cases with second turns matched | Locked Generic/Reread remained `0/24`; runtime Unlock+Rebase reached `24/24` | A retry without a real state transition is not recovery; authority, state, and information remain a bundled intervention; `share_with_caveats` |
| V17 | 192 formal plus 1,536 offline cases | Four post-unlock information arms all reached `24/24`; old-state context cost `74.9%` more median tokens; typed Escalate produced `24/24` legal non-commit outcomes under an unresolvable lock | Extra context superiority was not identified at ceiling; escalation is a distinct safe terminal state, not the same endpoint as task completion |
| V18 | 144 confirmatory episodes under three revisions | Stage `30/48 = 62.5%`; Step and No-Iter `0/48` | The preregistered Step-superiority claims failed in the opposite direction. Stage advantage is strong secondary evidence, not a preregistered universal law |
| V19 | 144 confirmatory episodes under at most eight provider turns | Stage `33/48 = 68.75%`; Step `5/48 = 10.42%`; No-Iter `0/48` | Matching calls did not rescue Step. As in V18, the Stage result is a repeated directional finding whose primary claims predicted the opposite direction |

### V20–V25: long-form writing, Ladder, and post-draft Stage repair

| Version | Design and scale | Main result | Frozen interpretation |
|---|---|---|---|
| V20 | 72 formal outputs | Ladder−Direct `+12.5 pp`, below the `+15 pp` gate | Structural-compliance study; it did not validly adjudicate long-form literary quality |
| V20R | 12 paired low-load long-form tasks | Quality delta `−0.183`; Ladder used about `1.52×` tokens | Low-load negative control: no quality gain and clear orchestration tax |
| V21 | 36 formal outputs in the authoritative quality-audited round | High-load Ladder was not reader-ready because of implementation/data defects; token ratio was about `1.45×` | Operational negative for that implementation; not a causal refutation of the Ladder theory |
| V22 | Authoritative r6: 30 outputs, 15 blind pairs | Overall `+5.86 [0.61, 10.30]`; high load `+9.74 [6.32, 13.67]`, `9–0–0`; low load `+0.03` | Strong single-rater evidence for conditional high-load Ladder; not dual-editor confirmatory evidence and not an always-on default |
| V23 | r1 plus V23R/V23S follow-ups, each based on 15 paired tasks | Defective r1 was negative; V23R was weak; V23S-R8 observed high `+4.74 [1.78, 7.96]` and low `+9.97 [4.30, 15.48]` in one model-editor rating, at `3.83×` high-load tokens | Stage repair has a positive selective-repair signal, but R8 was `code_dirty`, expensive, and lacked the preregistered two-human endpoint |
| V24 | 72 outputs over 24 confirmed-defect tasks | Oracle repair `24/24`; Infer `18/24`; Fixed `0/24`; V24-1 passed | Stage has editing capacity when a trustworthy defect witness is supplied; this is not a natural-policy finished-product advantage |
| V25 | r1: 30 outputs/15 pairs; focused regressions plus a clean 6-output pilot and 27 multi-realization episodes | r1 high Stage−Fixed `+0.69 [0, 1.62]`, `1–0–8`, formally inconclusive; regression checks made all four former failed treatments mutate; the clean pilot passed, while 6/9 high tasks disagreed across Stage realizations | No average superiority or equivalence claim is frozen. r1 had failed treatments, a false re-audit path, and dirty code; follow-ups validate engineering gates and treatment variance, not product-quality equivalence |

The complete writing/Stage evidence is summarized separately in [V20–V25: Long-Form Writing, Ladder, and Stage Repair](./aggregation-mismatch-v20-v25-writing-and-stage-repair.md).

## Completed supplementary experiments

| Supplement | Coverage | Result | Claim ceiling |
|---|---:|---|---|
| V4 MiniMax X1 | 162/162 | Answer-bit externalization `A2−A0 = +0.852 [0.722, 0.963]`; cut-set specificity still inconclusive | Minimum cross-configuration probe |
| V5b Hard Oracle, DeepSeek | 96/96 | Patch `48/48`, Rewrite `45/48` | Inconclusive at ceiling |
| V5b Hard Oracle, MiniMax X2 | 96/96 | Patch `48/48`, Rewrite `44/48` | Inconclusive at ceiling; same direction only |
| V3 MiniMax X2 | 96/96 | Infer Patch−Rewrite `0.0 [0,0]` with thinking disabled | Minimal probe; not a full V3 replication |
| V8-A1 MiniMax X1 | 64/64 | Gated ledger−Static `+0.34375`, same direction and passed | Minimal cross-configuration probe |
| V12-B1 MiniMax X1 | 48/48 | Patch and Full both `0/24`; Patch failed preconditions, Full was transport-dominated | Inconclusive floor; no transfer conclusion |
| V13b TOCTOU | 96/96 | Compatible Exact `0/24`; other three arms `24/24`; interaction `1.0` | Positive synthetic seal-before-drift result; does not rewrite V13/V14 identities |
| T1 config transfer | 48/48 | Intent `24/24`; Exact `0/24` on synthetic K8s/feature-flag fixtures | External-validity pilot, not a production-domain law |
| Wave34 writing blind pack | 12 anonymous pairs and 20 same-family panel ratings | Panel `20/20` ties; two-human evaluation remains pending | Exploratory same-family judge result only |

The supplement is documented in [Wave34 and Cross-Configuration Probes](./aggregation-mismatch-wave34-and-cross-configuration-probes.md).

## What the full program establishes

| Claim | Evidence | Scope-safe conclusion |
|---|---|---|
| Global construction can fail despite local-rule competence | V2, V4 | The tested closed/future-dependent structures produce a large budgeted exact-construction gap; this is not theoretical impossibility |
| Externalizing future constraints reduces the gap | V2 C, V4, MiniMax V4 X1 | Candidate/answer information can sharply restore performance; structural placement is not uniquely established |
| Patch advantage is conditional on plan quality and task shape | V3, V5, V11, V12, V5b | Prefer sparse deterministic delivery after plan verification; route by scope, density, budget, and provider rather than hard-code Patch |
| Runtime ownership reduces hard aggregation burden | V6–V12 | Put readiness, ledgers, stable IDs, canonicalization, compilation, verification, and commit outside token generation |
| Recovery requires a valid authority/state transition | V14–V17, V13b, T1 | Reject stale/locked writes, rebase only after a real unlock, and escalate when the state cannot be made writable |
| Revision unit matters | V18–V19 | In the tested synthetic DAGs, full-stage replanning repeatedly beat local step revision, but the result is secondary to failed opposite-direction primary claims |
| Writing scaffolds should be load-conditioned | V20R, V22-r6 | Low-load Ladder can be pure overhead; high-load Ladder has a strong single-rater positive signal |
| Stage repair is a capability, not yet a default policy | V23S, V24, V25 | It can repair known, localizable residuals; stable average net quality and practical equivalence remain unconfirmed |

## Agent-engineering consequences

1. **Externalize before generating.** Put dependencies, invariants, accepted evidence, end-state requirements, and unresolved constraints into a control object before asking for a long final object.
2. **Separate plan quality from delivery.** Verify the semantic plan first. If it is correct and machine-compilable, compile it into deterministic operations instead of asking the model to serialize the entire object again.
3. **Route the write scope.** Use minimal Patch for sparse changes, Regional Rewrite only with explicit coverage checks, and Full Rewrite when the target is dense or the old object is untrustworthy. No single write interface is always optimal.
4. **Give the runtime hard ownership.** Readiness, stable identity, version/hash checks, lock state, canonicalization, commit, rollback, and replay should not depend on the model preserving them in prose.
5. **Treat failure receipts as typed state.** Distinguish plan error, delivery error, stale state, locked conflict, verifier failure, transport failure, and budget exhaustion. Retry only after the state or information relevant to that failure has changed.
6. **Use Ladder selectively.** Direct generation remains the low-load default. Enable a full-scope Skeleton→MVP→Full ladder only when long-range dependencies and quality value justify its token cost.
7. **Use Stage repair selectively and transactionally.** Require a defect witness, full-object/state visibility, patch-first bounded edits, same-caliber re-audit, rollback, and a complete-round budget. A clean stop is valid; a failed treatment must not be mislabeled as treatment delivery.
8. **Measure treatment, artifact, and cost separately.** A valid final artifact can be identical to baseline because treatment failed. Record mutation, treatment delivery, final delivery, net quality, turns, tokens, and run-to-run variance as separate endpoints.

## Claims the evidence does not support

- All autoregressive models are unable to solve globally constrained tasks.
- Verification is universally easier than generation.
- Structural cut-set placement is uniquely better than the same amount of correct information elsewhere.
- Patch is always more reliable than Full Rewrite, or the two are generally equivalent.
- A single runtime switch explains the value of an entire governance package.
- More context always improves recovery.
- Step iteration is a better default because it provides more frequent feedback.
- Ladder or Stage repair should be enabled for all writing tasks.
- V23S or V22 already completed the preregistered two-independent-human endpoint.
- V25 proved Stage superiority, Stage inferiority, or Fixed≈Stage.
- The MiniMax probes replicate the complete V5–V12 Agent matrix.
- The writing endpoint and strict GF(2)/Agent endpoints can be combined into one effect size.

## Authority and reproducibility

The source-of-truth reports, machine-readable analyses, frozen designs, and result artifacts live in the [`llmdealer` aggregation-mismatch experiment](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment). The primary source indexes are:

- [`AGGREGATION_MISMATCH_V1_V25_AND_SUPPLEMENTS_SUMMARY.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/AGGREGATION_MISMATCH_V1_V25_AND_SUPPLEMENTS_SUMMARY.md)
- [`AGGREGATION_MISMATCH_CLAIM_SUMMARY_ZH.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/AGGREGATION_MISMATCH_CLAIM_SUMMARY_ZH.md)
- [`WAVE34_GAP_CLOSURE_REPORT.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/WAVE34_GAP_CLOSURE_REPORT.md)
- [`V25_STAGE_VS_FIXED_ADVANTAGE_REPORT.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V25_STAGE_VS_FIXED_ADVANTAGE_REPORT.md)

The intentionally aborted MiniMax thinking-on V3 run is archived and excluded from formal identity. Archived V13, dirty V23S-R8, dirty V25-r1, exploratory V25E, and pending human ratings remain visible rather than being silently promoted or removed.
