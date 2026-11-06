---
key: attention-governance
lang: en
path: /attention-governance
title: Attention Governance
navTitle: Attention
kicker: Governing evidence, working sets, and commits without updating model parameters
summary: Attention governance does not directly manipulate internal attention heads. It organizes evidence around the current decision, decomposes judgment tasks, coordinates cross-module constraints, and admits only validated modifications into official state.
order: 4.5
showInNav: true
heroPoints:
  - Long materials and complex reasoning share one burden: the information and state required by the current decision can be lost, mixed, or become stale.
  - The four audit views are complementary, not orthogonal; their value is measured by newly confirmed defects per incremental cost.
  - Chapter buckets organize tickets; shared constraints decide which edits must be validated and committed together.
  - For registered hard constraints with complete dependencies and reliable checking, controlled modification provides a conditional non-regression guarantee.
---

:::takeaway
### Core claim

Do not infer "shorter context means a better answer" from the attention formula. The defensible claim is narrower: **when decisive evidence and its conditions are preserved, reducing irrelevant content, explicitly organizing related evidence, and externalizing working state may improve how the model uses evidence.** This is an engineering hypothesis to be tested, not a direct corollary of softmax.
:::

## Why Attention Governance

With long documents, the hard part is usually not "reading everything." It is that decisive evidence is dispersed, similar material distracts, conditions remain implicit, sources conflict, and "not retrieved" is mistaken for "does not exist." With complex reasoning, the hard part is not the amount of material but the loss or mixing of assumptions, branches, conditional conclusions, open obligations, and state changes.

These failures are adjacent, but they are not the same problem. A million-row structured dataset may contain a great deal of material while imposing a low solving burden if the task is to fetch one record by primary key. A mathematical proposition of a few sentences may contain very little material while demanding a deep construction. The trigger for governance should therefore not be "more than N characters" or "thinking over N tokens." It should be:

> Is the current solving process unable to maintain the working set required for a reliable decision, and are dependencies between decisions at risk of being lost?

This article defines **attention governance** as a set of auditable controls over the information visible to the model and over the external process, under fixed model parameters, tools, and budget: organize evidence, decompose judgment tasks, coordinate cross-module constraints, and control modification and commit. It does not claim to change the model's internal attention distribution; directly steering attention heads is a separate route that requires internal access and its own calibration.

## Four Core Mechanisms

::::cards
### Evidence organization

Compile an evidence packet for the current judgment, preserving source anchors, provenance, negation, exceptions, time, agency, and conditions. Summaries are for navigation, not a replacement for the source. When evidence is insufficient, widen the read scope or explicitly output "cannot judge."

### Judgment-task decomposition

Write the overall requirement as `Φ(S) = ∧ₐ φₐ(S_Vₐ)`: each requirement has its own evidence scope. The value of decomposition is not chopping the task more finely; it is making "which material does this judgment actually depend on?" inspectable.

### Cross-module constraint coordination

Chapter buckets organize tickets; they do not decide commit boundaries. Shared resources, non-adjacent dependencies, character-knowledge boundaries, and global aggregate conditions determine which edits must be read, validated, and committed together.

### Controlled modification and commit

Generate a local patch by default: target ID, expected hash, exact source text, replacement text, and the ticket it addresses. Candidates pass structure, target, regression, and semantic validation; `UNKNOWN` does not count as a pass. Official state accepts only candidates that pass acceptance.
::::

## Four Complementary Views

| View | What it loads | What it checks | What it must not miss |
|---|---|---|---|
| Module | Chapter or scene text, responsibility, entry and exit state | Local logic, fulfillment of responsibility, factual support | Checking only the chapter and missing cross-chapter conditions |
| Mechanism | The source event chain of one rule, object, character knowledge, or causal line | Preconditions, exceptions, state changes, long-run consistency | Aliases, implicit consequences, dependencies never stated explicitly |
| Operating condition | One explicit reading or operating situation and its checkable criteria | Whether the requirement is met in that situation | Replacing explicit criteria with a broad persona |
| Interface and joint constraint | Both sides of a handoff, non-adjacent dependencies, shared resources | State transfer, mechanism collision, joint constraints | Checking only adjacent fragments and pairwise combinations |

Module, mechanism, operating condition, and interface share characters, rules, state, and resources. Without a representation space, inner product, and projection operator, they cannot be called strictly orthogonal subspaces. They are **complementary views**: they overlap, the same defect may be found more than once, and their value should be measured by "new confirmed defects / incremental cost," not by the neatness of the names.

Local consistency is not global consistency. Three mechanisms each consume 4 units of a resource, and total resources are 10. Any two together pass; all three together violate the constraint. A pairwise interaction matrix can be retained, but joint conditions involving three or more parties and global aggregate constraints must also be checked.

## Minimum Execution Loop

```text
freeze goal, version, and rules
  -> build index and coverage ledger
  -> compile evidence packets
  -> four-view read-only audit
  -> ticket and dependency adjudication
  -> bounded candidate patches
  -> layered validation
  -> atomic commit and stale-evidence invalidation
```

Distinguish three sets: the **write set** is what this round may modify; the **read scope** is the material needed to understand and repair the problem; the **revalidation scope** is the constraints and spans that may be affected. Dependency closure determines reading and revalidation; it does not automatically authorize edits in every related chapter.

If changing chapter 8 alone satisfies all requirements, change only chapter 8 and revalidate chapter 19. If both places must change together, form a cross-chapter transaction. If the change touches a setting the author has not adjudicated, stop in an explicit conflict state. Hard requirements outrank soft preferences; when two hard requirements conflict, do not invent a compromise; the model may propose broadening the scope, but the formal scope is approved by a trusted coordinator.

## The Boundary of the Non-Regression Guarantee

Let `H_pass` be the hard constraints that already hold before modification, and `W` the positions this modification may touch. If every hard constraint's dependency scope is completely recorded, the candidate modifies only `W`, every already-satisfied constraint that depends on `W` passes again on the candidate, and the committed state is exactly the validated candidate, then `H_pass` still holds after commit.

The reason is direct: affected constraints have been revalidated; unaffected constraints have all their inputs unchanged. But this is a **conditional guarantee**. It covers only registered constraints; dependency records may be incomplete; semantic checks may be unstable; and soft goals such as pacing, emotional force, or character charisma remain outside it.

## How to Validate

| Arm | Method | Question answered |
|---|---|---|
| A0 | Strong whole-context or paged-browsing baseline, with multiple turns inside the shared budget | Is there a gain over a competitive whole-document approach? |
| A1 | Module slicing only, using the same tickets, patches, and acceptance flow where possible | What do multiple views add over chapter splitting alone? |
| A2 | Four views + physical bucketing + per-bucket edits | How does the original proposal perform? |
| A3 | Four views + dependency coordination + unified adjudication + controlled patches + regression checks | How much does commit governance add? |
| A4 | Adaptive routing: choose the smallest intervention by bottleneck; allow no added processing | Is the routing policy itself worthwhile? |

All arms should use the same model configuration, public specification, source permissions, outer budget, and retry policy, and should run in randomized interleaved order. Do not constrain A0 to a single call while giving A3 dozens of calls, and then attribute the difference to slicing.

The primary endpoint is not "how many problems were found." It is the proportion of instances — predetermined to be information-sufficient, specification-consistent, equipped with target defects, and completable — in which the actually adopted final version repairs all target defects, preserves critical protection requirements, and introduces no new critical defect. Timeout, exhaustion, refusal, or absence of a final version on a completable task counts as incomplete; defect-free tasks are reported separately as correct preservation; information-insufficient or unresolvable-conflict tasks are reported separately as correct escalation; and the best unadopted candidate is not used as the final score.

## Current Evidence Boundary

The reference prototype implements protocol invariants: citations and patches must match the correct version and source text; a model cannot expand the approved write scope by creating its own tickets; a change to one chapter that breaks a cross-chapter rule is rejected; a multi-chapter change that passes checks is committed as one snapshot; stale proposals are rejected; missing, empty, or ambiguous extractions cannot pass; and an unimplemented semantic check returns `UNKNOWN` and blocks commit.

These tests prove the corresponding protocol behavior. The prototype does not call a real model, and it has not completed an audit-quality experiment on a 300,000-character manuscript. It provides an execution foundation into which model proposals can be plugged. Passing protocol tests is not evidence of end-to-end effectiveness.

## Read the Full Article

- [Attention Governance: Inference-Time Control of Evidence, Working Sets, and Commits (English)](/docs/attention-governance.md)
- [注意力治理：推理时的证据、工作集与提交控制（中文）](/docs/attention-governance.zh-CN.md)
