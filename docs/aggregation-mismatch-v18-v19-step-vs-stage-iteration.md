# Aggregation Mismatch Artifacts v18/v19: Step Iteration versus Stage Iteration

**Date:** 2026-08-01<br>
**Document type:** Public evidence report covering theory, experiment, data,
inference, and agent-engineering applications<br>
**Status:** V18 and V19 DeepSeek confirmatory runs both complete at 144/144;
all four preregistered primary claims failed; a reverse-direction Stage advantage
recurred under both budget protocols; overall evidence grade
`share_with_caveats`

**Studies:** `aggregation_mismatch_v18_plan_iteration_benefit` / `artifact-v18`;
`aggregation_mismatch_v19_plan_iteration_call_budget` / `artifact-v19`

**中文：** [聚合失配 Artifact-v18/v19：Step 迭代与 Stage
迭代](./aggregation-mismatch-v18-v19-step-vs-stage-iteration.zh-CN.md)

**Evidence scope:** two frozen designs, 48 formal instances × three arms and
144 complete LLM episodes per artifact, paired bootstrap, exact two-sided
sign-flip tests, event ledgers, and an independent recomputation. Raw evidence
is retained under the v18/v19 design, result, and analysis directories in
`llm_dealer/exp/aggregation_mismatch_experiment/`.

## Technical summary

V18/V19 did not establish the preregistered claim that STEP would outperform
STAGE. The observed direction was the opposite:

- Under V18's limit of three plan revisions per arm, `STAGE_ITER` achieved
  **30/48 (62.5%)**; `STEP_ITER` and `NO_ITER` both achieved **0/48**.
- V19 replaced that limit with a shared maximum of eight provider turns for
  STEP and STAGE. `STEP_ITER` improved to **5/48 (10.4%)**, while
  `STAGE_ITER` remained much higher at **33/48 (68.8%)**.
- In V19, STEP minus STAGE was **−0.583**, 95% CI **[−0.729, −0.438]**.
  Stage also used fewer provider turns on average: about **3.69** versus
  **6.67** for Step.

The most defensible engineering conclusion is therefore:

> For the tested globally dependent tasks with an exact global verifier,
> materializing the full trajectory and then replanning from a complete residual
> was more reliable than spending calls on local Step revisions before all
> relevant information was available.

This evidence is important enough to mount because it directly constrains the
outer loop of an agent. It remains **repeated reverse-direction secondary / post
hoc evidence**, not a preregistered primary pass and not a universal theorem
that Stage always dominates Step.

## 1. Theory: feedback frequency is not repair information

Represent the task as a directed dependency graph (G=(V,E)). At step (i),
the system sees only the current prefix state, a local result, and the residual
available so far. Only after the stage completes can it inspect the whole
artifact (Y) and its global verifier output (R(Y)):

```text
STEP_ITER:
plan -> step_i -> local/global-so-far residual -> revise remaining plan -> ...

STAGE_ITER:
plan -> materialize all indexed layers -> global residual -> full replan -> rerun
```

When later constraints depend on earlier choices, an early residual may be
incomplete and may not reveal whether a local repair will break downstream
constraints. More frequent feedback then introduces three risks:

1. **Calls are spent before the evidence is complete.** Early revisions can
   treat a local symptom rather than the global cause.
2. **The repair scope is too narrow.** Revising only the remaining plan, with
   little rollback, may preserve a contaminated materialized prefix.
3. **Global opportunity cost.** If early steps exhaust the budget, the model
   loses the opportunity to reconstruct the whole graph from the final residual.

Step can still be better when every step has a sufficient local oracle,
dependencies are weak, rollback is cheap, and errors do not propagate. V18/V19
test the globally coupled regime and do not theoretically exclude this local
regime.

## 2. Experiment

### 2.1 Shared protocol

| Item | Frozen setting |
|---|---|
| Model | `SimpleDeepSeekClientChat` / `deepseek-v4-flash` |
| Inference | Chinese; temperature=0; `thinking=False`; at most 32k tokens per turn |
| Task | Synthetic directed acyclic GF(2) graph; a step is a topological layer |
| Grid | (N\in\{16,24\}), frontier \(\in\{2,4\}\); 12 formal instances per cell |
| Formal | 48 shared instances × three arms = 144 episodes per artifact |
| Pilot | 12 independent instances × three arms = 36 episodes per artifact |
| Initial condition | The three arms share one frozen erroneous plan (P_0) per instance |
| Feedback | Verifier-guided residual and failed-constraint IDs |
| Delivery | Indexed layer submission; runtime checks readiness but does not compute values |
| Endpoint | `final_system_exact_success_within_budget` |
| Statistics | Task-paired; 10,000 bootstraps; exact two-sided sign flip; Holm over two primaries |
| Safety gates | Complete coverage; `unsafe_commit=0`; no all-arm floor or ceiling |

Only the iteration policy changes across arms:

| Condition | Behavior |
|---|---|
| `NO_ITER` | Execute the shared (P_0); no revision |
| `STEP_ITER` | After each topological layer, read the residual and keep, revise, or rollback-replan |
| `STAGE_ITER` | Run the full plan, verify globally, then full-replan, reset the ledger, and rerun on failure |

### 2.2 V18 and V19 budget ablation

| Protocol | Budget unit | STEP / STAGE limit | Remaining asymmetry |
|---|---|---:|---|
| V18 | Number of plan revisions | (R=3) | One Step revision and one full Stage replan buy different amounts of execution |
| V19 | Number of provider turns | (K=8) | Call caps match, but Stage can still rerun the whole graph after one call |

V19 reuses V18's seeded instance family and changes only the budget accounting
protocol. It is a **budget-protocol ablation**, not an external replication on
independent tasks. It addresses the main criticism that Step could revise only
three times, but it does not match full passes, layer applies, tokens, wall time,
or total execution compute.

### 2.3 Preregistered direction

Both artifacts registered the following primary directions, requiring a minimum
effect of (+0.15), a bootstrap lower bound above zero, and Holm-adjusted
(p<0.05):

- V18-1 / V19-1: STEP minus STAGE;
- V18-2 / V19-2: STEP minus NO.

A significant negative STEP-minus-STAGE contrast therefore cannot be relabeled
as a passed primary after seeing the data. The valid account is that the original
hypothesis failed in the reverse direction and the Stage advantage is reported
as secondary / post hoc engineering evidence.

## 3. Data and results

### 3.1 Completeness

| Artifact | Formal coverage | Independent tasks | Duplicate run keys | Unsafe commits |
|---|---:|---:|---:|---:|
| V18 | 144/144 | 48 | 0 | 0 |
| V19 | 144/144 | 48 | 0 | 0 |

Frozen data, manifest hashes, balanced arms, and shared-(P_0) checks passed.
The combined v18/v19 data-freeze and iteration-state-machine suite reported
**18 passed**.

### 3.2 Stage led under both budget protocols

| Artifact | NO_ITER | STEP_ITER | STAGE_ITER | STEP−STAGE |
|---|---:|---:|---:|---:|
| V18: (R=3) | 0/48 (0%) | 0/48 (0%) | **30/48 (62.5%)** | **−0.625** |
| V19: (K=8) | 0/48 (0%) | 5/48 (10.4%) | **33/48 (68.8%)** | **−0.583** |

This joint exact-value table is more appropriate than copying the two separate
bar charts: it preserves numerator, denominator, budget protocol, and effect
direction together, without implying that the two artifacts form one pooled
sample.

### 3.3 Preregistered decisions and secondary evidence

| Claim / contrast | Delta | 95% CI | Holm p | Frozen state |
|---|---:|---|---:|---|
| V18-1 STEP−STAGE | −0.625 | [−0.750, −0.479] | (3.73\times10^{-9}) | `failed_pre_registered_gate` |
| V18-2 STEP−NO | 0.000 | [0, 0] | 1.0 | `failed_pre_registered_gate` |
| V19-1 STEP−STAGE | −0.583 | [−0.729, −0.438] | (1.49\times10^{-8}) | `failed_pre_registered_gate` |
| V19-2 STEP−NO | +0.104 | [+0.021, +0.188] | 0.0625 | `failed_pre_registered_gate` |
| V18 secondary STAGE−NO | +0.625 | [+0.479, +0.750] | Outside primary Holm family | secondary |
| V19 secondary STAGE−NO | +0.688 | [+0.563, +0.813] | Outside primary Holm family | secondary |

V19-2 has an empirical CI lower bound above zero, but it missed both the
preregistered (+0.15) minimum effect and the Holm (p<0.05) gate. It remains
a failed primary; selecting only the favorable part would improperly promote
the claim.

### 3.4 Call use and failure layer

| Artifact / arm | Mean provider turns | Success | Dominant failure layer |
|---|---:|---:|---|
| V18 STEP | 3.00 / 3 | 0/48 | `verifier_fail` 48/48 |
| V18 STAGE | 2.08 / 3 | 30/48 | `budget_exhausted` 18/48 |
| V19 STEP | 6.67 / 8 | 5/48 | `verifier_fail` 43/48 |
| V19 STAGE | 3.69 / 8 | 33/48 | `budget_exhausted` 15/48 |

Increasing the available calls moved Step from 0% to 10.4%, so budget explains
part of V18's floor. Stage still achieved much higher success with fewer calls
on average, so the remaining gap cannot be reduced to “Step received too few
revisions.”

## 4. What the experiments support

### 4.1 Directly supported

- In the frozen synthetic globally dependent task and one DeepSeek
  configuration, Stage-style full replanning achieved much higher
  within-budget exact success than Step-style local revision.
- More call budget provided a small benefit to Step; “Step is useless” is not a
  valid conclusion.
- Access to a complete global residual plus whole-graph reconstruction is a
  plausible mechanism for the observed difference.
- Feedback value depends on **information completeness, repair scope, and
  remaining budget**, not feedback frequency alone.

### 4.2 Not established

- that Stage universally dominates Step, or that real coding, research,
  browsing, and tool-orchestration agents should prohibit Step loops;
- that any V18/V19 primary passed—all four failed their frozen gates;
- complete budget fairness in V19; full passes, layer applies, tokens, wall time,
  and total execution compute were not matched;
- a pure model-capability effect; the policy state machine, verifier, and repair
  scope jointly determine the outcome;
- two independent-sample replications; V18 and V19 share a seeded instance family;
- that global residual is the sole mechanism; sparse rollback, prompt structure,
  and whole-graph re-execution can also contribute.

### 4.3 Evidence grade

The appropriate grade is **`share_with_caveats`**. The paired effects are large,
their intervals are far from zero, the direction recurs under two budget
definitions, and coverage and safety gates are complete. But the observed
direction was not the preregistered target, the task and model are singular,
and V19 does not eliminate every execution asymmetry. The result is strong
enough to guide controlled agent design and the next experiment, not to serve
as a domain-general default law.

## 5. Agent-engineering implications

### 5.1 Use a Stage outer loop for globally dependent tasks

```text
propose typed plan
-> materialize complete indexed artifacts
-> run global verifier
-> emit structured residual / failed constraints
-> full replan or bounded global repair
-> reset affected ledger and rerun
-> commit only after final verification
```

“Complete” does not mean asking the model to free-generate a final answer in one
shot. It means that the runtime first gathers a complete, indexed, verifiable
intermediate artifact before presenting the global failure witness to the next
decision.

### 5.2 Keep Step gates for diagnosis, not as the default semantic repair loop

Every step should still check schemas, authority, safety invariants, and
irreversible side effects. A local gate should primarily:

- prevent unsafe commit;
- record local evidence and provenance;
- stop on a fatal condition that cannot wait;
- build a structured ledger for the Stage verifier.

Unless a local oracle is sufficient to determine the correct repair, every
nonfatal warning should not automatically consume a plan-revision call. Collect
residuals and replan at a meaningful boundary.

### 5.3 Split the budget by function

An agent should explicitly reserve:

```text
step_safety_budget      # safety blocks or deterministic local repair only
stage_replan_budget     # global replanning after complete residual
final_verification_budget
escalation_budget
```

At least one global review and one valid termination opportunity should remain
available after early local checks.

### 5.4 When to prefer Step and when to prefer Stage

| Runtime evidence | Default policy |
|---|---|
| Strong cross-step dependency, global constraints, suffix contamination | Stage replan |
| A high-fidelity verifier exists only for the complete artifact | Stage replan |
| Repair must rewrite several assignments or reset a ledger | Stage replan |
| Each step has a sufficient local oracle and errors do not propagate | Step repair is a candidate |
| An irreversible or unsafe action must be blocked immediately | Step gate / stop; do not wait for Stage |
| Rollback is cheap and every transition is auditable | Test a hybrid policy |
| Coupling is unknown | Record dependencies and residuals; use Stage as the conservative default |

### 5.5 Prefer a hybrid to an absolute rule

The most promising policy is: **Step owns gates, accounting, and fatal stops;
Stage owns semantic replanning.** This preserves local safety without escalating
every local deviation into an expensive model revision made from incomplete
information.

## 6. Candidate applications

- **Coding agents:** materialize candidate changes by file or module, then
  replan from complete tests and static analysis; fatal compilation or authority
  failures still stop immediately.
- **Research agents:** complete a source ledger, claim-evidence map, and conflict
  register before revising the research plan, instead of rewriting the outline
  after every source.
- **Data and analytical pipelines:** build auditable intermediate tables and run
  global invariants before repairing the pipeline; avoid local row-count or
  schema fixes that hide cross-table failure.
- **Multi-Skill workflows:** execute a complete verified workflow stage, retain
  every Skill receipt, and update orchestration from the global residual at the
  stage boundary.
- **Configuration and migration:** materialize the target state, dependencies,
  and drift ledger before choosing patch, regional rewrite, or full replan.

These are engineering candidates derived from the mechanism, not production
domains directly validated by V18/V19.

## 7. Highest-value next experiments

1. **Hybrid primary:** preregister `STEP_GATE + STAGE_REPLAN` against pure Step
   and pure Stage, separating local safety gates from semantic revision.
2. **Fully matched budgets:** jointly cap provider turns, tokens, wall time,
   layer applies, full passes, and verifier cost; report the reliability-cost
   Pareto frontier.
3. **Coupling gradient:** vary dependency density, error locality, and rollback
   cost to identify the Step/Stage crossover instead of another absolute winner.
4. **Independent tasks and models:** use a fresh seed family, at least one second
   model, and real coding or configuration tasks.
5. **Mechanism ablation:** remove global residual, ledger reset, whole-object
   rewrite scope, and rollback separately to identify the source of Stage value.

## 8. Final verdict

The central v18/v19 result is not a successful preregistered claim. It is a
stable reversal of the preregistered direction. On these globally dependent
tasks, frequent early local plan revision did not beat global replanning after
full materialization. Even with a common eight-provider-turn budget, success
was 10.4% for Step and 68.8% for Stage.

The current engineering principle is therefore:

> **Use local gates for safety and accounting; use a global residual for
> semantic replanning. For highly coupled tasks, materialize a complete
> verifiable artifact and repair at the Stage boundary.**

The claim ceiling must travel with the rule: one model, synthetic DAGs,
reverse-direction secondary evidence, and incompletely matched execution cost.
The next goal is to identify the Step/Stage crossover conditions, not to promote
this result into an unconditional default.

## 9. Authoritative evidence locations

- `exp/aggregation_mismatch_experiment/docs/V18_PLAN_ITERATION_BENEFIT_DESIGN.md`
- `exp/aggregation_mismatch_experiment/docs/V18_PLAN_ITERATION_BENEFIT_REPORT.md`
- `exp/aggregation_mismatch_experiment/docs/V19_PLAN_ITERATION_CALL_BUDGET_DESIGN.md`
- `exp/aggregation_mismatch_experiment/docs/V19_PLAN_ITERATION_CALL_BUDGET_REPORT.md`
- `exp/aggregation_mismatch_experiment/docs/V18_V19_GLOBAL_THEN_ITERATE_LESSON.md`
- `exp/aggregation_mismatch_experiment/results/v18_plan_iteration_benefit/confirmatory/`
- `exp/aggregation_mismatch_experiment/results/v19_plan_iteration_call_budget/confirmatory/`

This report does not redefine frozen claims, thresholds, or denominators. If a
public summary conflicts with machine evidence, `analysis/summary.json`,
`coverage.json`, and the frozen design manifest remain authoritative.
