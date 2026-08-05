# Aggregation Mismatch V20–V25: Long-Form Writing, Ladder, and Stage Repair

Updated: 2026-08-05<br>
Chinese version: [聚合失配 V20–V25：长文本写作、Ladder 与 Stage Repair](./aggregation-mismatch-v20-v25-writing-and-stage-repair.zh-CN.md)

## Verdict

V20–V25 do not establish one universally best long-form writing workflow. They establish a routing boundary:

- a multi-stage Ladder is overhead on low-load work and was not validated by the early short-structure studies;
- on the clean V22-r6 high-load natural-story subset, Ladder produced a strong positive single-editor signal;
- after a full draft exists, Stage repair can fix known, localizable defects, but the evidence does not yet establish that the deployed Stage policy has a stable average finished-product advantage over Fixed Ladder.

The defensible production position is therefore **Direct by default, Ladder for high aggregation load, and Stage repair only when a credible defect witness and sufficient quality budget exist**.

## Theory

Long-form writing creates aggregation mismatch when an early sentence, scene, claim, or character state must remain compatible with information that appears much later. Three strategies expose different control surfaces:

```text
Direct: prompt → full draft
Ladder: plan/control space → full skeleton → MVP full story → full story
Stage repair: full story → global audit → bounded replan/patch → re-audit or rollback
```

The theory predicts neither “more stages are always better” nor “repair is always better than planning.” Ladder can externalize future constraints before prose becomes expensive, but also creates handoff and expansion surfaces. Stage repair can observe the full object, but only helps if the verifier detects material residuals and the edit transaction improves net quality without introducing new contradictions.

## Experiments and data

| Study | Comparison | Authoritative data | Result | Status |
|---|---|---:|---|---|
| V20 | Global Ladder vs Direct vs Prefix Step | 72/72 | Ladder−Direct `+12.5 pp`, below `+15 pp`; Prefix Step nearly failed completely | Failed primary gate; structural-compliance endpoint, not literary-quality evidence |
| V20R | Ladder vs Direct on low-load long form | 12 pairs | Quality delta `−0.183`; Ladder ≈`1.52×` tokens | Closed negative control: no gain, more cost |
| V21 | High/low aggregation-load crossover | 36 formal outputs in the quality-audited authority round | High Ladder was not reader-ready; token ratio ≈`1.45×` | Operational negative; causal claim non-adjudicating because implementation/data defects affected the treatment |
| V22-r6 | Natural stories, Direct vs Ladder | 30 outputs / 15 pairs | Overall `+5.86 [0.61,10.30]`; high `+9.74 [6.32,13.67]`, `9–0–0`; low `+0.03` | Strong post-hoc single-rater support; clean tree; dual-human endpoint incomplete |
| V23 r1 | Fixed Ladder vs Stage Repair | 30 outputs / 15 pairs | High `−4.34`; only 3/15 Stage tasks changed prose; non-shared high first drafts | Defective implementation record; cannot refute the Stage paradigm |
| V23R | Shared high first draft, Stage incremental effect | 30 delivered artifacts | High `+1.19`, `1–0–8`; `+60.1%` tokens | Weak exploratory signal; primary gate missed |
| V23S-R8 | Verifier-driven Stage from matched first-full drafts | 30 outputs / 15 pairs | High `+4.74 [1.78,7.96]`, `4–0–5`; low `+9.97 [4.30,15.48]`; high tokens `3.83×` | Positive one-model-editor signal; `code_dirty`; two-human endpoint incomplete |
| V24 | Fixed/Infer/Oracle on preconfirmed defects | 72 outputs / 24 tasks | Oracle `24/24`; Infer `18/24`; Fixed `0/24` | Oracle repair-capability claim passed; not a natural-policy quality comparison |
| V25-r1 | Fixed vs current Stage, three-judge absolute scores | 30 outputs / 15 pairs | High `+0.69 [0,1.62]`, `1–0–8`; aggregate tokens ≈`4.46×` | Formally inconclusive; dirty code and treatment-fidelity defects |
| V25 follow-ups | Focused controller regressions, clean pilot, defect-sensitive re-rating, Stage×2, exploratory equivalence | Four former failed treatments; Pilot 6; 9 changed pairs; 27 multi-realization episodes | Former failures all mutated after fixes; Pilot engineering gate CLEAN; high re-rating `3–0–3`; 6/9 tasks disagreed across realizations; exploratory TOST inside ±3 | Engineering and variance evidence only; no superiority/equivalence promotion |

## What changed across the sequence

### 1. Early negative results were partly about the wrong endpoint

V20 mostly measured structural compliance, not high-quality long-form writing. V20R validly became a low-load negative control. V21 then exposed a real engineering lesson: a Ladder treatment that leaks structured artifacts or fails the length requirement cannot adjudicate literary quality.

### 2. V22 established a load-conditioned Ladder signal

The authoritative r6 run used a clean tree and a blind full-text rescore. High-load stories improved on causality, setup/payoff, pacing, and editorial readiness, while prose language and originality changed little. The observed high-load gain cost about `2.34×` tokens and `1.62×` wall time. The result supports an optional quality mode, not a default.

### 3. Stage repair required several engineering repairs before it became a valid treatment

V23 exposed non-shared first drafts, truncated audit context, stop/issue contradictions, ineffective mutation, and weak re-audit. V23R/V23S introduced shared checkpoints, fuller state, patch-first repair, rollback, and complete-round stopping. R8 then produced a positive single-rater signal, but remained expensive and dirty-tree.

### 4. V24 separated capability from policy value

When a trustworthy defect witness was supplied, Oracle repair succeeded `24/24`. Infer reached `18/24`, revealing that detection and planning—not only editing—remain bottlenecks. This proves the edit operator can work under favorable information, but not that a natural Stage loop should always run.

### 5. V25 prevented a premature Stage≈Fixed conclusion

V25-r1's many ties included true clean stops, failed treatments that returned baseline prose, small edits below judge resolution, and one false re-audit commit path. An inconclusive interval touching zero is neither superiority nor equivalence. Phase 2 fixed the engineering gate, then showed that Stage treatment itself varies substantially across realizations. A formal quality claim therefore requires clean frozen code, multiple treatment realizations or a declared estimand over them, and an independent quality endpoint.

## Frozen conclusions

### Supported within scope

- Low-load Ladder may add cost without quality value.
- High-load natural stories showed a strong Ladder benefit in the V22-r6 single-editor audit.
- Stage repair can resolve preconfirmed defects when the witness is reliable.
- A verifier-driven Stage loop can produce positive incremental edits on matched drafts.
- Treatment fidelity, judge resolution, and run-to-run variance materially affect the measured Stage value.

### Not established

- Ladder is the best general solution to aggregation mismatch.
- Ladder saves tokens.
- Every high-load task benefits from Ladder.
- Stage repair is better than Fixed Ladder on average.
- Fixed Ladder and Stage repair are practically equivalent.
- V22 or V23S has independent two-human confirmation.
- The results generalize to other languages, providers, expert genres, or production editorial teams.

## Engineering guidance

### Routing policy

```text
Low aggregation load
  → Direct

High aggregation load before a first full draft
  → optional full-scope Ladder

Full draft + credible material defect witness
  → selective Stage repair

No reliable witness, low expected value, or tight budget
  → stop / Direct / human review; do not run Stage by habit
```

### Minimum Stage transaction

1. Build a full-object state ledger: entities, chronology, open/closed conflicts, claims/evidence, and ending state.
2. Produce a typed defect witness with affected spans and expected invariants.
3. Prefer a bounded Patch; use regional rewrite only with explicit coverage.
4. Apply changes transactionally to a candidate copy.
5. Re-audit with the same or stronger semantic capability.
6. Commit only if net value passes; otherwise rollback.
7. Stop only after a complete round, and distinguish `clean_stop` from `failed_treatment`.

### Required telemetry

- shared first-full hash;
- defect witness and verifier provenance;
- mutation and treatment-delivery flags;
- patch attempts, successful applies, rollbacks, and re-audits;
- final artifact delivery;
- paired net-quality score;
- tokens, turns, wall time, and run-to-run treatment variance;
- code-tree identity and reproducibility status.

## Possible applications

These are engineering extrapolations, not directly validated cross-domain claims:

- long stories, reports, papers, legal drafts, and policy documents;
- cross-section consistency of names, dates, definitions, claims, and numbers;
- configuration and schema migration where the first full object exposes global residuals;
- multi-stage agents that commit only verified deltas into a shared state object.

## Sources

- [Complete V1–V25 synthesis](./aggregation-mismatch-v1-v25-and-supplementary-experiments.md)
- [V18/V19 Step versus Stage evidence](./aggregation-mismatch-v18-v19-step-vs-stage-iteration.md)
- [`llmdealer` V22-r6 report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V22_NATURAL_STORY_QUALITY_R6_REPORT.md)
- [`llmdealer` V23S-R8 report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V23S_VERIFIER_DRIVEN_STAGE_REPORT.md)
- [`llmdealer` V24 report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V24_CONDITIONAL_STAGE_REPAIR_REPORT.md)
- [`llmdealer` V25 and Phase 2 report](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V25_STAGE_VS_FIXED_ADVANTAGE_REPORT.md)
