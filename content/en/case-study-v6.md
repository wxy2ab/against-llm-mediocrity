---
key: case-study-v6
lang: en
path: /case-study-v6
title: "Case Study: Story Insight V6"
navTitle: V6 Case
kicker: Layered governance and plateau detection under a high acceptance threshold
summary: Story Insight V6 shows the next problem after control-space design. When a story is already fluent and highly scored, the system must still distinguish MetaSpace, LogicSpace, text, continuity, and evaluation contracts, then stop or roll back when further revision no longer improves value.
order: 2.5
showInNav: false
heroPoints:
  - V4 shows why generation should be governed through a control space; V6 shows that the control space itself needs layered review, routing, and rollback.
  - A high-threshold run used final_pass_score=9.2 and ended with score_plateau rather than acceptance.
  - The best version appeared at iteration 2, not the last iteration, so governance must preserve the best state instead of assuming more revision is always better.
---

## Why a Second Case Is Needed

[Story Insight V4](/case-study-v4) established the first core point: story generation should not rely on fluent text sampling alone. It needs a control space for characters, events, emotion, theme, rhythm, and reader understanding.

Story Insight V6 addresses the next layer. Even after a system has a control space, governance is not automatically complete. The control space may itself need evaluation and revision; text-level failures should not be misdiagnosed as world-setting failures; continuity problems should not be hidden behind a strong average score; and when a high threshold cannot be reached, the system must decide whether to continue, roll back to the best version, or recognize a plateau.

V6 is therefore not best understood as another story generator. It is a layered governance case: the same story task is split across MetaSpace, LogicSpace, section plans, text, ledger, continuity, attack, revision, and pairwise comparison.

## Why This Run Is Useful

This case used a deliberately high acceptance threshold:

:::cards
### Task Setup

The genre was `xianxia`, the target length was `short`, resolved to roughly 9000 Chinese characters, and complexity was `high`. The run used the `balanced` execution profile with Chinese prompts and Chinese story output.

### High Threshold

The acceptance target was `final_pass_score=9.2`. A previous V6 run had reached a best average score of 9.16, so 9.2 was a near-boundary pressure threshold: high enough to force further governance, but not obviously impossible.

### Run Result

The run status was `success`, but the termination reason was `score_plateau`. The system did not reach 9.2 and did not merely exhaust an iteration limit. It judged that further work was no longer producing reliable quality gains.

### Best State

The best iteration was iteration 2, with an average score of 9.00. Later stages did not produce a better version, so the final output preserved the best state instead of blindly selecting the last draft.
:::

The result is useful because it turns "iterate more" into an object of governance. The real question is not whether to keep revising, but which layer to revise, why that layer is implicated, how the revision is judged, and whether the system can roll back when later versions degrade.

## The Layered Governance Chain

The V6 run can be simplified into four phases:

<div class="process-flow" aria-label="Story Insight V6 layered governance chain">
  <section class="process-phase">
    <span>Task modeling</span>
    <ol>
      <li>Raw story task</li>
      <li>MetaSpace</li>
      <li>MetaSpace Critic</li>
      <li>MetaSpace Modify</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>Structure build</span>
    <ol>
      <li>LogicSpace</li>
      <li>Outline</li>
      <li>Section Plan</li>
      <li>Story Render</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>State memory</span>
    <ol>
      <li>Ledger</li>
      <li>Continuation Capsule</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>Evaluation and revision</span>
    <ol>
      <li>Story Critic</li>
      <li>Continuity Audit</li>
      <li>Defect Attack</li>
      <li>Revision Router</li>
      <li>Pairwise Critic</li>
      <li>Plateau detection / best-state preservation</li>
    </ol>
  </section>
</div>

The key shift is that V6 does not only ask "what is wrong with the story text?" It asks "which layer owns this problem?" The same symptom can come from different layers:

::::cards
### MetaSpace

Defines the task's evaluation and governance space: which modules, dynamic dimensions, and constraints matter for this kind of story. It answers what counts as a good result for this task.

### LogicSpace

Carries the story structure: characters, conflicts, events, rhythm, themes, and symbols. It answers why the story must happen this way.

### Text

Renders the reader experience: atmosphere, bodily perception, pacing, metaphor, sentence craft, and scene movement. It answers how the reader experiences the structure.

### Continuity

Preserves cross-scene state: injuries, abilities, object positions, world rules, and unresolved threads. It answers whether earlier commitments still hold later.

### Evaluation Contract

Defines acceptance: a good-story score, a high threshold, pairwise comparison, and plateau detection are not the same contract. It answers when to stop and when to continue.
::::

## A Real Run

The observable run metrics were:

:::cards
### Runtime Scale

The run took about 25 minutes and 19 seconds, made 41 LLM calls, and used about 425,932 tokens. The runtime engine was `deepstack_v3`, with 108 runtime events.

### Iteration Trace

Iteration 1 scored 8.84 with about 10018 characters. Iteration 2 scored 9.00 and became the best version. Iteration 3 also scored 9.00 but shortened the text to about 7529 characters. Later work did not exceed the best score.

### Tool Layers

The run used `metaspace_creator`, `metaspace_critic`, `metaspace_modify`, `logicspace_designer`, `story_renderer`, `ledger_updater`, `continuation_capsule_compressor`, `story_critic`, `continuity_auditor`, `defect_attacker`, `revision_router`, and `pairwise_critic`.

### Routing Result

This run did not trigger `route_was_upgraded`. That matters: the case should not be described as automatic escalation to MetaSpace. Its lesson is that after layered diagnosis, the main bottleneck had shifted toward text realization and plateau detection.
:::

## A Plateau Is Not a Failure

`score_plateau` does not mean the system failed. It means the system did not pretend that continued iteration was progress.

Ordinary multi-round generation often creates a misleading impression: if the model keeps revising, the result must be improving. In high-mismatch tasks, later revision can do three different things:

- Fix one local issue while breaking another cross-scene state.
- Improve prose while weakening structural density.
- Add explanation and setup while loosening rhythm.

This V6 run shows that tension. Iteration 2 was the best version. Iteration 3 kept the same average score but changed length substantially, suggesting a different revision direction. Later work did not cross 9.2, and the run ended in a plateau. That conclusion is more valuable than simply producing another longer draft.

## What Pairwise Critic Adds

The most important additional path in this run was `pairwise_critic`. It is not just another total score. It compares variants and writes routeable insights about why one version carries value better than another.

Its findings were mostly text-layer findings, but they were not merely style comments:

::::cards
### Genre Atmosphere

The stronger version used details like the purple spirit flower seeming to breathe and demonic qi probing the environment. The weaker version stayed closer to ordinary visual description and lost xianxia texture.

### Bodily Reaction

The stronger version expressed trauma and restraint through a scar heating up, a frozen step, and a hand hovering over an object instead of directly telling the reader that the character was in pain.

### Suspense Chain

The stronger version linked root powder, numbness, a black mark in the sky, and demonic qi into a progressive chain. The weaker version allowed clues such as a box noise to appear with weaker setup.

### Symbolic Objects

The token, broken sword, scar, and bloodstain were not decorations. They became pressure devices for the character's past and current choice.

### Rhythm Control

The stronger version connected morning labor, an old acquaintance arriving, demonic traces, and the night-time token into an action chain. The weaker version let daily-life details dilute the central conflict.
::::

This shows that layered governance does not push every issue back into structure. It can recognize that once structure mostly works, the bottleneck may be how text realizes structural value.

## What Continuity Audit Found

Across iterations, continuity audit found problems at several layers: character state, world setting, and unresolved goals.

Representative findings included:

- After Su Chen cut his wrist for blood, the story at one point lacked bodily reaction and wound handling.
- Xiaoji's recovery from demonic poisoning was not always stated clearly enough.
- The wooden box opening and knocking by itself created a suspense thread that needed explanation or deliberate preservation as a hook.
- In some variants, Xiaoji's right-foot gait was described inconsistently.
- Su Chen used spiritual power during sealing, but the earlier setup of residual spiritual power was not strong enough.

These are not copyediting issues. Continuity checks whether story state persists across scenes, whether abilities have sources, whether objects and clues carry later responsibility, and whether readers can trust the rules of the world.

## Mapping Back to the Five Mismatches

Story Insight V6 maps directly onto this site's five primitive mismatches.

::::cards
### Aggregation Mismatch

Each revision can improve locally without improving global value. Iteration 2 staying best while later work failed to break through shows that "keep revising" itself needs governance.

### State Mismatch

Injuries, ability sources, object positions, poison state, and foreshadowing must persist across scenes. The ledger and continuity audit are state-governance tools.

### Support Mismatch

High-value narrative details are often not the default template. Bodily reaction, object pressure, environmental anomaly, and symbolic chains have to be pulled explicitly into pairwise evaluation and revision targets.

### Specification Mismatch

A high score is not the same as satisfying a high acceptance contract. A 9.00 average is strong, but it still falls short when `final_pass_score=9.2`; plateau detection belongs to a higher-level acceptance specification.

### Overfitting Mismatch

Later revisions can over-bind to the previous winning draft, a local criticism, or a scoring pattern. Plateau detection, rollback, and continuity audits keep the system from treating one locally successful path as the invariant story structure.
::::

## Relation to V4

V4 and V6 should not be presented as two competing story systems. They are two levels of the same argument:

1. V4 shows why story generation should be rewritten into control-space governance.
2. V6 shows that once a control space exists, governance still needs layers, routing, continuity audit, pairwise judgment, and best-state preservation.

If the core sentence for V4 is "govern the control space before rendering text," then the core sentence for V6 is:

**distinguish the governance layer before deciding whether to revise again.**

## Conclusion

Story Insight V6 is valuable not because every run keeps improving, but because it makes "keep revising" diagnosable, stoppable, and reversible.

This high-threshold run did not reach 9.2 and did not trigger automatic escalation to MetaSpace. That does not weaken the case. It clarifies it: a mature governance system should show not only successful acceptance, but also plateau detection, version regression, layer attribution, and best-state preservation.

That is part of resisting LLM mediocrity. Mediocrity does not only come from weak prose. It also comes from systems that cannot tell when local revision has stopped advancing real value. V6 makes that judgment explicit.
