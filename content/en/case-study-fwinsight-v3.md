---
key: case-study-fwinsight-v3
lang: en
path: /case-study-fwinsight-v3
title: "Case Study: FW-Insight V3"
navTitle: FW-Insight V3
kicker: Distribution-penetrating hard experience for factor-framework regeneration
summary: "FW-Insight V3 is a factor-framework regeneration case. Instead of blindly sampling more versions, it treats the large population of already generated factor frameworks as an empirical distribution, then uses cutting, recombination, realization checks, distribution tests, direction correction, and maturity filtering to distill a small set of hard experiences for the next regeneration cycle."
order: 2.7
showInNav: false
heroPoints:
  - Many factor-framework versions already exist; more sampling remains trapped in the old distribution unless the system finds experiences that change its shape.
  - "V3 turns 1400+ backtested samples into a statistical laboratory, using φ_c to map each experience's realization onto each sample."
  - Folding, direction checks, and the maturity filter compress repeated soft knowledge into a small set of regeneration-ready hard experiences.
---

## Overview

FW-Insight V3 (`fwinsight_v3`) is a factor-framework regeneration case. A factor framework here is a generated piece of quantitative-trading logic; "regeneration" means producing the next, improved version of it. The system has already produced many such versions and recorded how each one backtested. The question this case answers is which experiences (lessons drawn from that history) actually deserve to shape the next version — and how to tell a genuinely useful experience apart from one that merely sounds good. Throughout, "V2" and "V3" refer to successive generations of the framework's experience layer, and a "claim" is a candidate experience carried forward from V2 that still has to be tested.

## Why This Case Is Worth Studying

This case is worth studying because it covers a governance move that the earlier cases do not: **extracting, from a large population of historical generated samples, the hard experiences that can change the distribution of future generation**.

`fwinsight_v3` is not another factor generator, and it does not ask an LLM to simply invent better factor frameworks. It starts from a system that has already generated many framework versions. Sampling more can produce more variants, but most variants still come from the same generation distribution. The valuable question becomes:

**Which experiences are not merely plausible explanations, but actually change the sample distribution, correct directionality, and guide the next regeneration cycle?**

That makes it a clean financial-engineering case for state mismatch and support mismatch. An LLM can summarize experience, explain code, name patterns, and write locally convincing claims. But if those claims do not change the distribution across many samples, they remain soft knowledge. `fwinsight_v3` puts experience back into the distribution and tests it there.

## Why the Task Is High Mismatch

Factor-framework regeneration looks like a code-generation task: give the model samples, performance metrics, and a few experiences, then ask it to write the next framework. But the hard part is not syntax or component assembly.

::::cards
### Support Mismatch

High-value frameworks may sit in low-probability regions of the old sampling distribution. Natural LLM sampling tends to return to common structures, common explanations, and common combinations.

### Specification Mismatch

"Sounds like a good lesson" is not the objective. An experience must show up as a mean shift, variance contraction, thicker right tail, thinner left tail, or direction reversal in the sample distribution.

### Aggregation Mismatch

Local successes across many versions do not automatically become regeneration rules. Many claims may be repeated expressions of the same signal and must be folded into independent signal groups.

### State Mismatch

Experiences have lifecycle state. Claims that were once useful but later decayed, or that have already been refuted, cannot be mixed with current live claims when guiding regeneration.
::::

The case is therefore not about whether an LLM can write a factor framework. It is about how the system decides which experiences deserve to guide the next generation step.

## Turning the Sample Distribution Into a Laboratory

The core move in `fwinsight_v3` is to treat the existing population of generated factor-framework samples as an empirical laboratory.

It reads existing framework versions, performance metrics, and V2 claims. It does not trust the natural-language explanation of any claim. Instead, it converts each claim into a detectable predicate `φ_c` (a "realization" test: a yes/no check for whether a given sample actually exhibits the property the claim describes). It then maps that predicate across the full sample pool, splits the samples into high-realization and low-realization groups, and compares their Sharpe ratios, quantiles, and distribution shape.

In other words, a claim survives not because it sounds right, but because it actually cuts the sample distribution.

The pipeline below shows how a candidate experience moves from raw samples to a vetted hard experience. (The distribution tests are standard statistical comparisons: Mann–Whitney U (MWU) and Kolmogorov–Smirnov (KS) check whether two groups differ, Levene checks for a difference in spread, and q90 compares the 90th-percentile tail.)

<div class="process-flow" aria-label="FW-Insight V3 hard-experience pipeline">
  <section class="process-phase">
    <h3>Sample pool</h3>
    <p>Build a full pool from many generated and backtested factor-framework versions.</p>
  </section>
  <section class="process-phase">
    <h3>Realization</h3>
    <p>Rewrite candidate experiences into abstract-syntax-tree (AST) or structural predicates φ_c and map them onto each sample.</p>
  </section>
  <section class="process-phase">
    <h3>Distribution tests</h3>
    <p>Compare high-realization and low-realization groups with MWU, KS, Levene, q90, and related tests.</p>
  </section>
  <section class="process-phase">
    <h3>Experience folding</h3>
    <p>Merge repeated claims into independent signal groups and label them CONFIRMED, REVERSED, SOFT, or UNCLEAR.</p>
  </section>
  <section class="process-phase">
    <h3>Regeneration interface</h3>
    <p>Pass only a small set of hard experiences, anti-patterns, and direction signals into the next regeneration cycle.</p>
  </section>
</div>

## From Soft Knowledge to Hard Experience

`fwinsight_v3` is strict about what counts as experience. A claim can receive a high V2 score and still be downgraded to `SOFT` or `UNCLEAR` if it does not significantly separate the sample distribution. Conversely, a claim with a low V2 score can be promoted to penetrating knowledge if it reliably changes the sample distribution.

That strictness produces four key operations:

::::cards
### Cutting

Every experience must split the sample pool into high-realization and low-realization groups. An experience whose realization cannot be detected cannot directly guide regeneration.

### Recombination

Many natural-language claims are folded into a small number of independent signal groups. The system cares about independent experience, not about how many times a claim is restated.

### Direction Correction

If the high-realization group performs worse, the experience is not simply discarded. It is labeled `PENETRATING_REVERSED`. Such a result is especially valuable because it exposes a direction the old system may have been systematically wrong to trust.

### Maturity Filtering

Live, decayed, and refuted claims must be separated. Only currently valid experience should constrain the next regeneration step.
::::

That is the definition of hard experience here: not experience that is more eloquent, but experience that changes the distribution across many samples, exposes directionality, and survives the current-state filter.

## The Most Valuable Finding

The most important result from the implemented stages is not that V3 found many experiences. It is the opposite: after statistical governance, many plausible experiences shrink into a small number of independent signals.

Stage 01 ran distribution tests on 77 V2 claims against 1400+ samples and at first found a batch of `PENETRATING` results. But once Stage 02 folded repeated claims, only a few truly independent strong signals remained: for example, market-state awareness was confirmed, while AdaptiveThresholdManager-related claims reversed direction. Stage 03 then added the maturity filter to further separate live experiences from historical pollution.

So V3's value is not in increasing the number of experiences. It compresses experience entropy:

```text
many generated versions
-> candidate experiences and claims
-> realization cuts
-> distribution tests
-> independent signal folding
-> direction correction
-> maturity filter
-> a small set of hard experiences
```

It does not take many of these hard experiences: adopting just a few may be enough to push the next factor-framework regeneration cycle away from the old sampling distribution. They are not decorative prompt advice. They become generation constraints, anti-patterns, component-combination boundaries, and direction prohibitions.

## Boundary: Not the Full Regeneration Loop

To describe this case accurately, one boundary has to stay clear: `fwinsight_v3` is best described as the hard-experience extraction layer and evidence-specification layer before regeneration, not the full generate-backtest-regenerate loop by itself.

What it has already established is:

- how to extract statistically testable experiences from a historical sample pool;
- how to decide whether a claim truly penetrates the sample distribution;
- how to fold repeated claims into independent signal groups;
- how to identify confirmed, reversed, soft, and unclear signals;
- how to use a maturity filter so historical claims do not pollute current regeneration;
- how to output anti-patterns, direction signals, and experience interfaces for a later V4 or regeneration engine.

So the conclusion should not be "V3 has proven a complete factor-framework regeneration loop." It should be:

**V3 demonstrates the most critical step before regeneration: how to distill, from the old sampling distribution, a small set of hard experiences that can change the direction of future sampling.**

## Mapping to This Site's Framework

`fwinsight_v3` maps cleanly onto the primitive mismatch framework.

::::cards
### Support: Move Beyond the Old Distribution

Sampling again from the same generator tends to revisit high-probability regions of the old distribution. Hard experience changes the constraints of the next sampling cycle so generation can reach regions outside the old distribution.

### Specification: Reject Pretty Explanations

LLM explanations, high V2 utility, and even natural-language claims from successful samples are not accepted as truth. A claim is upgraded only when it changes the statistical distribution.

### Aggregation: Fold Repeated Experience

Large sample sets generate many similar claims. V3 merges them into independent signal groups so repetition does not masquerade as evidence volume.

### State: Separate Live From Historical

Experience is not permanent truth. V3 uses a maturity filter to separate ObservedFact, Decayed, and Refuted claims before they affect regeneration.

### Fitting Boundary: Do Not Bind to One Explanation

A repeated claim, high utility score, or elegant factor story can overfit the historical sample. V3 requires evidence groups, maturity states, and distribution-change checks before a claim can guide future generation.
::::

## Relation to the Other Cases

This case adds an important new type to the case library.

1. **Story Insight V4**: rewrites story generation from final-text sampling into control-space governance.
2. **Story Insight V6**: handles layered attribution, continuity audit, plateau detection, and rollback above that control space.
3. **Stock Rec V3**: limits LLM authority in financial-strategy production; only objects passing shadow, promotion, and active lifecycle stages can affect production.
4. **FW-Insight V3**: extracts distribution-changing hard experiences from historical generated samples before factor-framework regeneration.

If Stock Rec V3's keyword is production-authority governance, FW-Insight V3's keyword is:

**hard experience, not more sampling.**

## Case Conclusion

`fwinsight_v3` works well as a new case. It shows a crucial, somewhat counterintuitive point: once a system has already generated many versions, asking the LLM to "generate some better ones" is usually not the most important move. The more important move is to cut, recombine, validate, fold, and direction-correct the old sample distribution, and distill from it a small set of hard experiences that can actually guide regeneration.

This case belongs after Stock Rec V3. Stock Rec V3 shows that financial strategy systems must govern production authority. FW-Insight V3 adds that the knowledge inside financial engineering must also be governed: only distribution-penetrating experience deserves to guide the next factor-framework regeneration cycle.
