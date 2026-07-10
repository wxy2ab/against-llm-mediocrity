# Support Mismatch and Control-Space Search in LLM Systems

**Reachability, Candidate Support, and Search Governance**  
**Working Draft v0.1**  

---

## How to Read This Paper

This is a technical working paper. It argues that many high-value LLM (Large Language Model) systems fail because the structures needed for high task value are simply not *reachable* under the deployed search procedure. These structures may never be sampled, never preserved, never matured, or never recognized. The paper names this failure **support mismatch**, contrasts it with the other primitive mismatch types, and develops a governance approach built around **control-space search**.

If you want the core idea quickly, read the Abstract and Section 1 (Introduction). For the formal definitions, read Sections 2–4. For the practical machinery — the governance loop, the governance objects, and the worked domains — read Sections 8–13. The appendices collect a terminology table, a diagnosis checklist, and ready-to-use templates.

**Abbreviations.** These acronyms appear throughout (including inside code and pseudo-code blocks). They are defined once here for reference:

- **LLM** — Large Language Model.
- **GKO** — Governed Knowledge Object: a scoped, revocable knowledge artifact written back into the governed system.
- **GEsO** — Governed Escalation Object: a governed record that routes a case for escalation.
- **SGAR** — State-Governed Agent Regime: the hard-state runtime governance layer for long-horizon agents.
- **RLHF / DPO** — Reinforcement Learning from Human Feedback / Direct Preference Optimization (learned-component training methods).

**Contents.**

- [1. Introduction](#1-introduction)
- [2. Support in the Value-Preservation Pipeline](#2-support-in-the-value-preservation-pipeline)
- [3. What Support Mismatch Is Not](#3-what-support-mismatch-is-not)
- [4. Subtypes of Support Mismatch](#4-subtypes-of-support-mismatch)
- [5. Why More Sampling Often Fails](#5-why-more-sampling-often-fails)
- [6. Control-Space Search](#6-control-space-search)
- [7. Support Lifting](#7-support-lifting)
- [8. Support Governance Loop](#8-support-governance-loop)
- [9. Support-Specific Governance Objects](#9-support-specific-governance-objects)
- [10. Support Audit](#10-support-audit)
- [11. Support Mismatch in Text-to-SQL](#11-support-mismatch-in-text-to-sql)
- [12. Support Mismatch in Code Synthesis](#12-support-mismatch-in-code-synthesis)
- [13. Support Mismatch in Research and Analysis](#13-support-mismatch-in-research-and-analysis)
- [14. Search Budget as a Governed Resource](#14-search-budget-as-a-governed-resource)
- [15. Anti-Patterns](#15-anti-patterns)
- [16. Integration with Knowledge Governance, Audit Engineering, and SGAR](#16-integration-with-knowledge-governance-audit-engineering-and-sgar)
- [17. Minimal Implementation Pattern](#17-minimal-implementation-pattern)
- [18. When Support Governance Is Not Needed](#18-when-support-governance-is-not-needed)
- [19. Self-Audit of Support Mismatch](#19-self-audit-of-support-mismatch)
- [20. Conclusion](#20-conclusion)

---

## Abstract

High-value LLM systems often fail not because the correct answer is logically impossible, nor because the model lacks all relevant local capabilities, but because the structures required for high task value receive too little effective support under the deployed inference procedure. They are not sampled, not preserved, not expanded, not recognized, or not carried forward under the available search budget. This paper develops **support mismatch** as one of the six primitive mismatch types in the structural theory of value preservation in LLM systems.

Support mismatch is the failure of reachability: high-value structures lie in low-probability, low-coverage, low-recognition, or early-pruned regions of the system's candidate space. It is distinct from observation-representation mismatch, where decisive variables fail to enter the system representation. It is distinct from fitting-boundary mismatch, where the right capability fails to activate. It is distinct from aggregation mismatch, where locally good components fail to compose globally. And it is distinct from specification mismatch, where the evaluator optimizes the wrong proxy.

In support mismatch, the high-value structure is in principle expressible and valuable, but the system's policy, search operators, priors, or budget make it unlikely to appear as a live candidate.

The central intervention is **control-space search**. Instead of repeatedly sampling final outputs, a governed system searches over intermediate structures that are closer to the causal determinants of task value. These intermediate structures include schemas, join paths, dependency graphs, state hypotheses, constraints, proof obligations, tool plans, invariant sets, candidate mechanisms, and repair deltas. A renderer then maps these governed control objects into final artifacts.

This transformation can raise effective support by making rare final outputs reachable through more common, inspectable, and composable intermediate objects.

This paper defines support mismatch formally, distinguishes its subtypes, and explains why naive sampling and self-consistency often fail under shared support blind spots. It then presents a governance architecture for support repair: support diagnosis, control-axis construction, candidate expansion, coverage accounting, anti-pruning, verifier coupling, and support deltas.

It also introduces support-specific objects such as Support Maps, Search Warrants, Candidate Generation Contracts, Coverage Ledgers, and Support Regression Guards. The paper situates support mismatch within the broader unified theory: support governance is the candidate-space counterpart to channel governance, capability routing governance, audit engineering, and hard-state runtime governance.

### Relationship to the Diagnostic–Mechanism Bridge

This document uses support mismatch as a value-preservation diagnosis. When a failure requires repair, the Diagnostic–Mechanism Bridge maps that diagnosis to an eight-axis mechanism target and a repair layer:

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

### Mechanism-Layer Mapping

Support mismatch maps primarily to `capability_support` and `search_execution`, and in some cases secondarily to `capability_routing`.

```text
missing candidate structure under the active policy
  → repair_target = capability_support

candidate exists but search, pruning, or budget fails to preserve it
  → repair_target = search_execution
```

In mechanism terms, support mismatch is about insufficient reachability under `π_θ` and `D`, rather than about missing observations or wrong objectives. Agent-layer repair uses control-space search, anti-pruning rules, and support governance objects; recurrent learned-component failures can be promoted into mechanism-driven training.

---

## 1. Introduction

LLM systems are often improved by asking for more candidates, increasing temperature, sampling multiple answers, prompting for alternatives, using self-consistency, adding critique, or running iterative refinement. These methods can help when the desired answer is reachable under the system's candidate distribution and when the system can recognize it once produced. But in many high-value tasks, the decisive structure has weak effective support. More sampling produces more variants of the same basin. More critique repairs surface defects while preserving the same hidden blind spot. More refinement polishes candidates that should have been replaced. More self-consistency amplifies the dominant wrong structure.

This is **support mismatch**.

Support mismatch occurs when high-value structures are not sufficiently reachable under the deployed policy, search operator, representation, routing state, and budget. The system may understand many local pieces of the task. The prompt may contain the relevant information. The objective may be clear enough. The model may even possess the needed capability. Yet the correct global structure remains unlikely to enter the active candidate set.

Support mismatch is one of the core reasons LLM systems become trapped in mediocrity. Mediocre outputs are not necessarily low-effort outputs. They may be fluent, carefully reasoned, multi-step, and revised. Their defect is that they are drawn from the wrong support region. They are reachable, plausible, and easy to improve locally, but the task's high-value region remains underexplored.

The constructive response is not merely "sample more." It is to ask: **what space is being searched?** If the system is searching final text directly, the high-value structure may be a thin, low-probability subset of the output distribution. But if the system searches over control objects that determine the final artifact, the same high-value region may become much more reachable. A rare SQL query may be reachable through a common join-path enumeration. A rare code patch may be reachable through an explicit invariant and failing test. A rare research insight may be reachable through mechanism decomposition and contradiction mapping. A rare plan may be reachable through state-conditioned branching rather than direct proposal.

This paper treats support mismatch as a primitive structural failure station in the world-to-output pipeline:

```text
S_world
  → observation
  → representation
  → capability routing
  → candidate support
  → aggregation
  → evaluation
```

Support mismatch lives at the **candidate support** station. It asks:

```text
Does the high-value structure receive enough effective probability mass, search coverage, and recognition opportunity to become a live candidate under the available budget?
```

This question is different from whether the system has observed the right variables, inferred the right state, routed the right capability, composed local parts correctly, or optimized the right objective. Those failures interact with support, but they are not identical to it.

---

## 2. Support in the Value-Preservation Pipeline

Let the system's operational representation be `Z`, and let the capability-routing function produce an activated strategy set `C`:

```text
C = ρ(Z)
```

Given `Z`, `C`, a model policy `pθ`, a search operator `S_B`, and budget `B`, the system induces a reachable candidate set:

```text
K_B = S_B(pθ, Z, C, B)
```

Let `Y` be the output space and `U` the true task utility. Let the high-value region be:

```text
Y*τ = { y ∈ Y : U(y) ≥ τ }
```

for a task threshold `τ`.

Support mismatch exists when:

```text
Reach_B(Y*τ | Z, C, pθ, S_B) is too low
```

where `Reach_B` may include probability of generation, probability of survival through pruning, probability of recognition, probability of being passed to aggregation, and probability of being selected under the evaluator.

A simple support coefficient can be written as:

```text
σ_B(Y*τ) = P[ K_B ∩ Y*τ ≠ ∅ ]
```

This is the probability that the budgeted search process produces at least one live candidate in the high-value region.

A stronger effective-support coefficient includes recognition and retention:

```text
σ_eff(Y*τ) =
  P[ a candidate y ∈ Y*τ is generated,
     preserved,
     recognized as promising,
     and made available for final selection ]
```

Support mismatch occurs when `σ_eff(Y*τ)` is low even though high-value candidates are possible in principle.

This definition matters because support is not merely the model's raw probability of emitting a string. It is the combined result of:

```text
policy probability
search operator
candidate representation
pruning rule
diversity mechanism
intermediate evaluator
tool access
routing state
budget
recognition process
selection policy
```

A system can therefore suffer support mismatch even when the base model has nonzero probability of generating the answer. Nonzero support is not enough. The high-value structure must have adequate effective support under the actual deployment regime.

---

## 3. What Support Mismatch Is Not

Support mismatch is easiest to understand by separating it from neighboring mismatch types.

### 3.1 Not Observation-Representation Mismatch

Observation-representation mismatch occurs when decisive variables never enter the operational representation `Z`.

Support mismatch assumes the high-value structure is at least expressible from the representation. The issue is not that the variable is absent, but that the system's search process is unlikely to instantiate the structure that uses it correctly.

Example:

```text
Observation-representation failure:
  The database schema omits a relevant foreign key from the prompt.

Support failure:
  The foreign key is present, but the correct three-table join path is rarely generated.
```

### 3.2 Not State Mismatch

State mismatch occurs when the system cannot identify which latent state it is in.

Support mismatch can occur even after the state is known. The system may know the task regime but still fail to produce the rare structure required by that regime.

Example:

```text
State failure:
  The system cannot tell whether the user wants historical analysis or a forward-looking forecast.

Support failure:
  The system correctly identifies a forward-looking forecast task,
  but never generates the low-probability causal scenario that matters.
```

### 3.3 Not Fitting-Boundary Mismatch

Fitting-boundary mismatch occurs when a capability is activated outside its true domain or suppressed inside it.

Support mismatch assumes the relevant capability may be active, but the search space it produces still undercovers the high-value structure.

Example:

```text
Fitting-boundary failure:
  The model fails to activate schema-audit behavior.

Support failure:
  Schema-audit behavior is active,
  but the candidate generator does not enumerate the rare join path.
```

### 3.4 Not Aggregation Mismatch

Aggregation mismatch occurs when locally good pieces fail to compose into global value.

Support mismatch can occur before aggregation: the globally correct candidate structure never appears. Aggregation mismatch occurs after candidate parts are available but are combined incorrectly.

Example:

```text
Support failure:
  The correct proof strategy is never proposed.

Aggregation failure:
  The correct lemmas are proposed,
  but their dependencies are ordered or combined incorrectly.
```

### 3.5 Not Specification Mismatch

Specification mismatch occurs when the accessible evaluator `Ũ` diverges from true utility `U`.

Support mismatch can occur even under a correct specification. The system may know what good means but fail to reach candidates that satisfy it.

Example:

```text
Specification failure:
  The rubric rewards concise answers when the true task requires exhaustive coverage.

Support failure:
  The rubric correctly demands exhaustive coverage,
  but the system never generates the rare edge case.
```

---

## 4. Subtypes of Support Mismatch

Support mismatch is not a single surface phenomenon. It has several structurally distinct subtypes.

### 4.1 Policy-Support Mismatch

The base model or prompted policy assigns low probability to the high-value structure.

```text
pθ(y* | Z, C) is low
```

This is common when the answer requires an unusual formulation, rare domain pattern, nonstandard decomposition, counterintuitive mechanism, long-tail schema relation, or low-frequency action sequence.

Repair target:

```text
change the policy context, introduce control objects, or use guided generation.
```

### 4.2 Search-Operator Mismatch

The high-value structure has nontrivial model probability, but the search operator does not explore the right axes.

Example failures:

```text
beam search collapses onto similar candidates
temperature sampling produces surface diversity but not structural diversity
self-consistency samples many variants of the same assumption
critique loops repair style while preserving the same plan
```

Repair target:

```text
change the search operator or search space.
```

### 4.3 Budget Mismatch

The high-value region is reachable but not under the available budget.

This is not always solved by increasing budget. If the search distribution is poorly shaped, more budget may produce many near-duplicates. Budget repair often requires support shaping.

Repair target:

```text
allocate budget by control axis, not by undifferentiated candidate count.
```

### 4.4 Pruning Mismatch

A high-value candidate or partial candidate is generated but eliminated before it can be developed.

Common causes:

```text
early evaluator favors surface plausibility
beam search drops low-probability partials
intermediate critique marks unfamiliar structure as risky
tool errors are interpreted as terminal rather than diagnostic
```

Repair target:

```text
anti-pruning rules, delayed evaluation, protected minority beams, or evidence-preserving ledgers.
```

### 4.5 Recognition-Support Mismatch

The high-value candidate appears but is not recognized as high value.

This subtype is adjacent to specification mismatch but distinct. The criterion may be correct in principle, yet the system's recognition mechanism lacks the local discriminator needed to identify the candidate.

Repair target:

```text
candidate-specific validators, diagnostic tests, contrastive comparisons, or expert rubric expansion.
```

### 4.6 Expansion Mismatch

The system generates a promising partial structure but lacks operators to expand it into a full candidate.

Example:

```text
A plausible mechanism is proposed,
but the system never derives its implications,
never turns it into a testable plan,
and never maps it to the final artifact.
```

Repair target:

```text
expansion operators, decomposition contracts, continuation scaffolds, and partial-candidate maturation.
```

### 4.7 Transfer-Support Mismatch

A high-value structure is available in one representation or modality but not transferred into the candidate space that controls final output.

Example:

```text
A table inspection reveals a useful relation,
but the SQL generator does not receive it as a constraint.
```

Repair target:

```text
cross-object propagation, GKO injection, state commitment, rendering contracts.
```

---

## 5. Why More Sampling Often Fails

A common response to support mismatch is to sample more. This helps only under specific conditions.

Let `q` be the probability that a single sample lands in `Y*τ`. Independent sampling `n` times yields:

```text
P(hit) = 1 - (1 - q)^n
```

If `q` is moderately low, increasing `n` helps. But in many LLM systems, `q` is not the right variable. Samples are not independent structural draws from the task space. They are correlated continuations from the same prompt, same representation, same routing state, same learned priors, same hidden assumptions, and often the same evaluator.

The effective hit rate is closer to:

```text
P(hit structural basin) × P(hit high-value variant inside basin)
```

If the system repeatedly samples from the wrong structural basin, increasing `n` mostly gives surface variation.

### 5.1 Pseudo-Diversity

Pseudo-diversity occurs when candidates differ lexically, stylistically, or in minor details while sharing the same structural blind spot.

Examples:

```text
ten summaries that omit the same decisive caveat
ten SQL queries with different aliases but the same wrong join path
ten plans that vary ordering but assume the same false state
ten critiques that identify wording issues but miss the same invariant
```

Pseudo-diversity is dangerous because it gives the appearance of exploration.

### 5.2 Self-Consistency Under Shared Blind Spots

Self-consistency improves reliability when independent reasoning paths converge on the correct answer more often than on the wrong answer. Under support mismatch, however, many paths may share the same missing structure. Consensus then amplifies the support bias.

Self-consistency fails when:

```text
the dominant candidate basin is wrong
the correct basin is low-support
the verifier cannot distinguish the basins
the samples are structurally correlated
```

### 5.3 Critique Without Support Expansion

Critique can improve candidates already near the right region. But if the correct structure is absent, critique often performs local repair within the wrong basin.

A critique loop should therefore ask:

```text
Is this candidate wrong because of a local defect,
or because the candidate family itself is unsupported by the task?
```

If the latter, the repair is not revision. The repair is support expansion.

### 5.4 Fixed-Condition Sampling Is Not Context Intervention

The negative result about more sampling is conditional on holding the deployed condition approximately fixed:

```text
Y_j ~ p_theta(Y | x, context_0, prompt_0)
```

Changing only the random seed or decoding noise increases density inside that conditional distribution. It does not necessarily increase structural-basin coverage.

A governed context intervention constructs a family of different conditionals:

```text
Y_ij ~ p_theta(Y | x, context_i, prompt_i, decomposition_i)

q_ctx(Y | x) = sum_i w_i p_theta(Y | x, context_i, prompt_i, decomposition_i)
```

The mixture can broaden effective support when contexts introduce substantively different:

```text
evidence sources or data slices
representations or control objects
state hypotheses or counterfactuals
tools, exemplars, or formal rules
claim targets or decomposition structures
```

This does not contradict basin collapse under massive fixed-condition sampling. It changes the search policy, representation, or observable evidence rather than merely increasing `n`.

Context intervention still fails when every context is generated as a paraphrase from the same missing knowledge, when the model lacks the required capability and the context does not supply it, or when aggregation discards the unique structure reached by a minority branch.

The governing distinction is:

```text
same-condition sampling increases density
context intervention may increase structural coverage
external evidence may increase fidelity
```

### 5.5 Open Experiment: Context-Conditioned Support Expansion

Use an equal-budget factorial comparison:

```text
A. same context + same prompt + repeated sampling
B. same context + diverse prompts
C. diverse contexts + same prompt
D. diverse contexts + matched decomposition prompts
E. D + independent evidence or model diversity
```

Run replicates within each cell. Define basin identity using task-level structures such as mechanism class, dependency graph, claim family, join path, invariant set, or strategy family—not lexical distance alone. Measure:

```text
within-context structural diversity
between-context structural diversity
new-basin hit rate
high-value target hit rate
cross-context error correlation
aggregation survival of minority structures
external-utility lift per unit cost
```

The context-expansion claim is supported only if between-context structural diversity exceeds within-context diversity and the new basins improve hidden-gold or human-grounded utility. An unfamiliar domain with no decisive knowledge in any context should be included as a negative control.

---

## 6. Control-Space Search

Support mismatch is often repaired by changing the search space.

Direct output-space search asks:

```text
Which final answer should we generate?
```

Control-space search asks:

```text
Which intermediate control objects determine the final answer,
and can we search those objects more reliably than final text?
```

Let `Ω` be a control space and let `R` be a renderer:

```text
R: Ω → Y
```

The goal is to find `ω* ∈ Ω` such that:

```text
U(R(ω*)) ≥ τ
```

Support transformation succeeds when:

```text
Reach_B(Ω*τ) > Reach_B(Y*τ)
```

where:

```text
Ω*τ = { ω ∈ Ω : U(R(ω)) ≥ τ }
```

The high-value final output may be rare, but the control object that determines it may be easier to generate, inspect, enumerate, or verify.

Examples:

| Task | Final-output space | Control space |
|---|---|---|
| Text-to-SQL | SQL string | schema subgraph, join path, column binding, predicate skeleton |
| Code synthesis | code patch | failing test, invariant, API contract, dependency graph |
| Research writing | final argument | claim graph, objection map, mechanism chain |
| Planning | full plan | state hypotheses, action preconditions, resource constraints |
| Legal analysis | memo | issue tree, authority map, fact-rule bindings |
| Data analysis | final conclusion | variable dictionary, causal graph, model assumption ledger |
| Agent workflow | final completion | state transition contract, verifier outputs, defect ledger |

Control-space search is not merely decomposition. It is search over the structures that preserve task value.

---

## 7. Support Lifting

The central design pattern is **support lifting**.

A support-lifting transformation maps a low-support final-output target into a higher-support control-space target.

```text
Low-support Y*
  ← rendered from
Higher-support Ω*
```

A transformation is useful when the control object has at least one of the following properties:

```text
easier to enumerate
easier to verify
easier to perturb
easier to compose
easier to compare
easier to store
easier to revoke
more likely under the model's local abilities
```

### 7.1 Example: Join Path Before SQL

A correct SQL query may be low-support under direct generation because the model must simultaneously choose tables, columns, joins, predicates, grouping, ordering, and syntax.

But the join path can be searched separately:

```text
question → candidate tables → join graph → join paths → SQL skeleton → SQL
```

The correct final SQL may be rare. The correct join path may be much easier to enumerate and audit.

### 7.2 Example: Invariant Before Code

A correct code patch may be low-support because many possible edits are plausible. But the invariant violated by the bug may be easier to state:

```text
bug report → failing behavior → invariant → repair obligation → patch
```

Once the invariant is governed, the support of useful patches rises.

### 7.3 Example: Mechanism Before Argument

A high-quality analytical argument may be rare as a direct essay. But a mechanism chain may be easier to generate:

```text
claim → mechanism → boundary condition → counterexample → refined claim
```

The final argument becomes a rendering of governed mechanism structure.

---

## 8. Support Governance Loop

Support repair should be governed, not improvised.

A basic support governance loop is:

```text
1. Diagnose support failure.
2. Identify the missing high-value structure type.
3. Construct a control axis where that structure is easier to search.
4. Generate candidates across the control axis.
5. Track coverage and diversity structurally, not stylistically.
6. Protect promising low-probability candidates from premature pruning.
7. Use verifiers or audits to recognize value.
8. Convert successful structures into GKOs, GExOs, GEsOs, or state records.
9. Add support regression guards.
10. Update future routing and search policies.
```

### 8.1 Step 1: Diagnose Support Failure

A support diagnosis asks:

```text
Did the system fail because the right candidate family never appeared?
Did it appear but get pruned?
Did it appear but not mature?
Did it appear but fail recognition?
Did search explore surface variants instead of structural alternatives?
```

### 8.2 Step 2: Identify the Missing Structure Type

The missing structure may be:

```text
join path
state hypothesis
causal mechanism
edge case
counterexample
tool plan
proof strategy
API invariant
column binding
value normalization rule
risk scenario
constraint set
exception class
```

### 8.3 Step 3: Construct Control Axes

A control axis is a dimension along which meaningful structural alternatives can be generated.

Examples:

```text
tables involved
join depth
predicate operator
state regime
risk mode
failure family
mechanism class
data source
user intent
tool sequence
invariant type
```

The point is to diversify over task-relevant structure, not over wording.

### 8.4 Step 4: Candidate Expansion

Candidate expansion should be tied to control axes:

```text
generate one candidate per state hypothesis
generate join paths up to depth k
generate counterexamples by failure family
generate patches by invariant class
generate plans by resource regime
```

### 8.5 Step 5: Coverage Accounting

The system should track what has and has not been searched.

Coverage accounting can be approximate but must be explicit:

```text
covered axes
uncovered axes
protected candidates
discarded candidates and reasons
candidate lineage
verification status
remaining uncertainty
```

### 8.6 Step 6: Anti-Pruning

Low-support high-value candidates are often fragile. They may initially look unusual, incomplete, or less fluent. Anti-pruning rules preserve candidates long enough for proper evaluation.

Examples:

```text
do not prune a candidate solely for unfamiliarity
do not prune a partial join path before schema verification
do not prune a mechanism before deriving implications
do not prune a failed execution if the failure is diagnostic
```

### 8.7 Step 7: Recognition and Verification

Support expansion without recognition creates noise. The system needs discriminators and verifiers.

These may include:

```text
execution tests
schema checks
constraint satisfaction
counterexample search
semantic comparison
state discriminators
human review
formal validators
unit tests
rubric-specific audits
```

### 8.8 Step 8: Write-Back

Successful support repair should not disappear after one run. It should update the governed control space.

Examples:

```text
add a GKO for a join-path constraint
add a router rule for low-support hypothesis generation
add a support map to the project state
add a regression guard for a missed edge case
add a defect ledger entry for pseudo-diversity
```

---

## 9. Support-Specific Governance Objects

Support mismatch requires objects that represent reachability, coverage, and candidate-space obligations.

### 9.1 Support Map

A Support Map records where high-value structures are expected to live in the candidate space and which regions have been searched.

```json
{
  "id": "support_map.unique_identifier",
  "type": "support_map",
  "task_scope": "task or subtask covered",
  "target_structure": "join_path | invariant | mechanism | edge_case | plan | proof_strategy | other",
  "control_axes": [
    {
      "name": "axis name",
      "values_or_range": "enumerated values, range, or generation rule",
      "coverage_status": "covered | partially_covered | uncovered | not_applicable"
    }
  ],
  "known_low_support_regions": [
    "regions likely to be missed by direct generation"
  ],
  "protected_regions": [
    "regions that should not be pruned without explicit audit"
  ],
  "evidence": "why this map is believed useful",
  "revocation_trigger": "when the map should be revised or discarded"
}
```

### 9.2 Search Warrant

A Search Warrant authorizes additional exploration because the expected value of support expansion justifies the cost.

```json
{
  "id": "search_warrant.unique_identifier",
  "type": "search_warrant",
  "reason": "why direct generation or current search is insufficient",
  "mismatch_type": "support",
  "target_region": "candidate region to expand",
  "expected_value_basis": "why this region may contain high-value candidates",
  "budget": {
    "candidate_limit": 0,
    "tool_calls": 0,
    "human_review": "none | optional | required",
    "latency_limit": "constraint"
  },
  "stop_conditions": [
    "coverage reached",
    "verifier success",
    "budget exhausted",
    "support hypothesis falsified"
  ],
  "revocation_trigger": "condition that cancels the warrant"
}
```

### 9.3 Candidate Generation Contract

A Candidate Generation Contract specifies structural diversity requirements.

```json
{
  "id": "candidate_generation_contract.unique_identifier",
  "type": "candidate_generation_contract",
  "target_artifact": "what candidates are being generated",
  "diversity_axes": [
    "state hypothesis",
    "join path",
    "mechanism class",
    "failure family"
  ],
  "minimum_coverage": {
    "per_axis": "coverage rule",
    "protected_minority_candidates": 0
  },
  "forbidden_pseudo_diversity": [
    "wording-only variation",
    "alias-only variation",
    "same assumption with different phrasing"
  ],
  "candidate_lineage_required": true,
  "recognition_method": "how promising candidates will be identified"
}
```

### 9.4 Coverage Ledger

A Coverage Ledger records search history.

```json
{
  "id": "coverage_ledger.unique_identifier",
  "type": "coverage_ledger",
  "task_scope": "search scope",
  "generated_candidates": [
    {
      "candidate_id": "candidate identifier",
      "control_axis_values": {},
      "lineage": "how it was generated",
      "status": "active | pruned | matured | selected | rejected",
      "pruning_reason": "if pruned",
      "verification_status": "untested | passed | failed | inconclusive"
    }
  ],
  "coverage_gaps": [
    "unsearched or undersearched regions"
  ],
  "support_findings": [
    "audit findings related to support"
  ]
}
```

### 9.5 Support Delta

A Support Delta is a control delta specifically aimed at changing candidate reachability.

```json
{
  "id": "support_delta.unique_identifier",
  "type": "support_delta",
  "source_finding": "audit finding that triggered this delta",
  "support_failure_subtype": "policy | search_operator | budget | pruning | recognition | expansion | transfer",
  "change": "what will change in candidate generation, search, pruning, or recognition",
  "target_region": "candidate region whose support should increase",
  "expected_effect": "why the change should improve reachability",
  "regression_guard": "guard that detects recurrence of the support failure"
}
```

### 9.6 Support Regression Guard

A Support Regression Guard ensures that a previously missed structure is now generated, preserved, and recognized.

```json
{
  "id": "support_regression_guard.unique_identifier",
  "type": "support_regression_guard",
  "defect_family": "missed join path | missed edge case | missed invariant | missed mechanism | other",
  "representative_case": "case that previously failed",
  "required_behavior": [
    "generate candidate in target region",
    "preserve it through pruning",
    "subject it to verification",
    "select or reject with explicit evidence"
  ],
  "failure_condition": "what means the support failure recurred",
  "teeth_test": "how to confirm the guard fails if the missed structure is removed or suppressed"
}
```

---

## 10. Support Audit

A support audit asks whether candidate search adequately covered the structural alternatives required by the task.

A minimal Support Audit Finding is:

```json
{
  "id": "finding.support.unique_identifier",
  "artifact": "candidate set, search trace, or final output",
  "finding": "high-value candidate family was not generated / preserved / recognized",
  "evidence": "coverage gap, missing axis, pruned candidate, verifier discrepancy",
  "mismatch_type": "support",
  "support_subtype": "policy | search_operator | budget | pruning | recognition | expansion | transfer",
  "severity": "low | medium | high | critical",
  "repair_target": "search space | search operator | pruning rule | recognition method | control object",
  "control_delta": "proposed support delta",
  "regression_guard": "support guard preventing recurrence",
  "confidence": "confidence in diagnosis"
}
```

### 10.1 Audit Questions

A support audit should ask:

```text
What candidate families were searched?
What candidate families were not searched?
Were alternatives structurally diverse or only stylistically diverse?
Were low-probability candidates protected long enough for verification?
Did the evaluator recognize promising unusual candidates?
Were candidates matured from partial to complete form?
Was search guided by task-relevant axes?
Were support failures written back into future search policy?
```

### 10.2 Common Audit Findings

Common findings include:

```text
All candidates share the same hidden assumption.
Candidate diversity is lexical rather than structural.
The correct structure appeared in an intermediate note but was not propagated.
The search operator pruned the only candidate with the right dependency.
The verifier was applied only to the final selected candidate.
The system used self-consistency despite correlated samples.
The prompt requested alternatives without specifying control axes.
The tool result created a new candidate region, but no expansion followed.
```

---

## 11. Support Mismatch in Text-to-SQL

Text-to-SQL is a clear support-mismatch domain because the correct SQL query may be structurally rare under direct generation.

Direct generation asks:

```text
question + schema → SQL
```

This requires the model to choose tables, columns, joins, filters, aggregation, ordering, grouping, and syntax in one candidate trajectory. The correct SQL may occupy a thin region of output space.

Support governance decomposes this into control-space search:

```text
question
  → intent slots
  → relevant table candidates
  → schema subgraph
  → join path enumeration
  → column binding
  → value binding
  → predicate skeleton
  → aggregation skeleton
  → SQL rendering
  → execution audit
```

### 11.1 Low-Support Structures

Common low-support structures include:

```text
multi-hop join paths
non-obvious bridge tables
implicit aggregation
nested subqueries
anti-joins
date normalization
value grounding through cell contents
ambiguous column names
schema-specific enumerations
```

### 11.2 Support Repair Patterns

| Failure | Support repair |
|---|---|
| Correct table not considered | Generate table candidates by schema semantics and value evidence. |
| Correct join path missed | Enumerate join paths over schema graph before SQL generation. |
| Value grounding missed | Query sample values or value indexes; add value-binding GKOs. |
| Aggregation rare | Generate aggregation skeletons separately from predicates. |
| Nested query not sampled | Search over query-shape templates as a control axis. |
| Candidate pruned after execution error | Treat execution error as diagnostic and produce repair delta. |

### 11.3 Execution Feedback as Recognition Support

Execution feedback increases recognition support but does not guarantee candidate support. Running generated SQL helps identify bad candidates. It does not automatically generate the correct one. Therefore execution feedback should be coupled with support expansion:

```text
execution failure
  → localize failure
  → identify missing candidate region
  → generate support delta
  → expand controlled search
```

---

## 12. Support Mismatch in Code Synthesis

In code synthesis, the correct patch may be low-support because many plausible edits exist.

Direct generation asks:

```text
bug report + code context → patch
```

Support-governed code synthesis searches intermediate objects:

```text
bug report
  → failing behavior
  → invariant
  → affected API contract
  → dependency slice
  → patch strategy
  → code patch
  → test execution
```

Low-support structures include:

```text
rare edge case
nonlocal dependency
implicit invariant
interaction between modules
lifecycle ordering bug
concurrency interleaving
backward compatibility constraint
```

Support repair patterns include:

```text
generate invariants before patches
enumerate failure modes before edits
protect unusual hypotheses until tested
use tests as recognition support
write missed edge cases into regression guards
```

A support regression guard in code synthesis should ensure not only that the final patch passes a known test, but that the previously missed candidate family is now considered or that its invariant is explicitly checked.

---

## 13. Support Mismatch in Research and Analysis

Research tasks often fail through support mismatch because the high-value idea is not the most probable continuation of the existing discourse.

Direct generation tends to produce:

```text
reasonable summaries
mainstream framings
safe qualifications
familiar taxonomies
surface-level objections
```

High-value structures may require:

```text
unusual mechanism
reframing
hidden contradiction
cross-domain analogy
failure of a shared assumption
new object decomposition
boundary condition
```

Support governance in research writing should search over control structures:

```text
claim space
mechanism space
objection space
counterexample space
boundary-condition space
analogy space
formalization space
```

A useful candidate generation contract might require:

```text
one mainstream mechanism
one contrarian mechanism
one boundary-condition reversal
one hidden-variable hypothesis
one formal analogy
one failure-of-proxy interpretation
```

The point is not to force novelty for its own sake. The point is to avoid mistaking fluent mainstream support for adequate exploration of high-value structure.

---

## 14. Search Budget as a Governed Resource

Support governance requires budget discipline. More search is not always better. Search budget should be allocated according to expected value and structural uncertainty.

A Search Warrant should be issued when:

```text
P(high-value region underexplored)
× value at stake
× expected gain from expansion
>
search cost + verification cost + noise cost
```

Budget should be allocated by control axes:

```text
state hypotheses
schema paths
failure families
mechanism classes
patch strategies
risk regimes
tool sequences
```

not merely by number of final candidates.

### 14.1 Stop Conditions

Search should stop when:

```text
target coverage is achieved
a verified high-value candidate is found
remaining regions have low expected value
budget is exhausted
the support hypothesis is falsified
a higher-priority mismatch is diagnosed
```

### 14.2 Escalation Conditions

Search should escalate when:

```text
coverage gaps involve high-stakes regions
all candidates share a hidden assumption
verification repeatedly rejects the dominant basin
the correct structure is suspected but not expressible
a low-support candidate requires external expertise
```

---

## 15. Anti-Patterns

### 15.1 Sampling Theater

Sampling theater occurs when a system generates many candidates without changing the support structure.

Symptoms:

```text
many candidates
same assumption
same plan
same join path
same omitted variable
same proxy objective
```

### 15.2 Diversity Theater

Diversity theater occurs when the system asks for "diverse answers" but does not define structural diversity axes.

It also occurs when the system creates many nominally different contexts that are only paraphrases of the same evidence, representation, hidden assumption, or learned prior. Context count is not context diversity.

Better instruction:

```text
Generate candidates that differ by state hypothesis, mechanism class, dependency structure, and failure mode.
```

not:

```text
Generate five diverse answers.
```

A governed diversity contract should state the root question, context provenance, intended structural axis, assumptions, excluded information, and the structure that would count as a genuinely new basin.

### 15.3 Critique Theater

Critique theater occurs when critique improves presentation while leaving the candidate family unchanged.

Symptoms:

```text
more caveats
better wording
same missing structure
same unsupported assumption
same low-value basin
```

### 15.4 Verifier-Only Illusion

A verifier can reject bad candidates but cannot by itself guarantee generation of good candidates.

A system with strong verification but weak support may become excellent at saying no and poor at finding yes.

### 15.5 Premature Consensus

Consensus among correlated samples can amplify support bias.

A system should not interpret consensus as reliability unless structural independence of samples is established.

### 15.6 Over-Governed Search

Support governance can also be harmful. A rigid control space may suppress useful unexpected candidates. Search contracts should include revocation triggers and escape hatches for novel structures.

---

## 16. Integration with Knowledge Governance, Audit Engineering, and SGAR

Support governance is not a standalone module. It connects to the rest of the governed LLM architecture.

### 16.1 With Knowledge Governance

Support repair produces GKOs:

```text
low-support region identifiers
candidate generation rules
protected candidate regions
search-axis definitions
value-recognition discriminators
```

These should have scope and revocation triggers.

### 16.2 With Audit Engineering

Support audits produce findings and deltas:

```text
finding: correct join path was never generated
delta: add join-path enumeration before SQL rendering
guard: representative case must produce the bridge-table path
```

### 16.3 With SGAR

Support state should be committed when search progress matters:

```text
which regions were searched
which candidates were pruned
which candidates were protected
which verifier results were obtained
which coverage gaps remain
```

Without hard state, a long-horizon agent may repeatedly search the same region, forget a protected candidate, or falsely claim coverage.

### 16.4 With Fitting-Boundary Governance

Support repair often depends on routing repair. The system must activate the search behavior appropriate to the task:

```text
join-path search
edge-case generation
counterexample search
mechanism enumeration
invariant extraction
```

If those capabilities are not routed, support expansion will not occur.

### 16.5 With Observation-Representation Governance

Support repair cannot generate structures involving variables absent from the representation. If the missing candidate depends on unobserved information, channel repair must precede support repair.

---

## 17. Minimal Implementation Pattern

A minimal support-governed LLM system can be implemented with the following pipeline:

```text
Input
  → representation audit
  → support risk assessment
  → control-axis selection
  → candidate generation contract
  → candidate expansion
  → coverage ledger
  → verifier / audit
  → support delta
  → governed rendering
```

Pseudo-procedure:

```text
function support_governed_generation(task, representation, budget):
    risk = assess_support_risk(task, representation)

    if risk.low:
        return direct_or_lightweight_generation(task)

    axes = construct_control_axes(task, representation)
    contract = build_candidate_generation_contract(axes, budget)
    candidates = generate_candidates(contract)

    ledger = initialize_coverage_ledger(axes, candidates)

    for candidate in candidates:
        if anti_pruning_required(candidate):
            protect(candidate, ledger)

        result = verify_or_audit(candidate)

        update_ledger(ledger, candidate, result)

        if result.verified_high_value:
            return render(candidate), ledger

    gaps = identify_coverage_gaps(ledger)

    if gaps.high_value and budget.remaining:
        delta = create_support_delta(gaps)
        return support_governed_generation(task.with_delta(delta), representation, budget.remaining)

    return best_supported_candidate(ledger), ledger
```

The important features are:

```text
structural axes
coverage tracking
anti-pruning
verification coupling
write-back
state commitment
```

Without these, the system is likely only sampling.

---

## 18. When Support Governance Is Not Needed

Support governance is not always necessary.

It is usually unnecessary when:

```text
the high-value region is already high-probability
local fluency strongly correlates with task value
the task is low-stakes
a complete verifier and generator already exist
ordinary retrieval supplies the missing structure
output-space sampling gives true structural diversity
the cost of search exceeds expected value
```

It may be harmful when:

```text
the control axes are wrong
the governance layer prunes novel candidates
coverage accounting becomes bureaucratic
the system optimizes for explored regions rather than value
budget is diverted from a more important mismatch
```

A mature system should decide whether support governance is warranted rather than applying it universally.

---

## 19. Self-Audit of Support Mismatch

The support mismatch claim can itself be represented as a governed theoretical object.

```json
{
  "id": "gko.support_mismatch_primitive_claim",
  "type": "theoretical_claim",
  "condition": "LLM systems analyzed as value-preservation pipelines with a candidate-support station between capability routing and aggregation",
  "assertion": "High-value task structures may be expressible and valuable but receive insufficient effective support under the deployed policy, search operator, pruning rule, recognition mechanism, and budget.",
  "strength": "structural-relative",
  "support_scope": "Failures where candidate reachability, preservation, maturation, or recognition is the distinct repair target",
  "revocation_trigger": "Show that all such failures can be reduced to observation-representation, state, fitting-boundary, aggregation, or specification mismatch without losing intervention specificity.",
  "not_supported_claims": [
    "Does not claim all low performance is caused by support mismatch.",
    "Does not claim more search always helps.",
    "Does not claim every rare candidate is valuable.",
    "Does not claim control-space search is always cheaper than output-space search."
  ]
}
```

This self-audit is important because support mismatch is easily overdiagnosed. Many failures look like support failures because the right answer was not produced. But the deeper cause may be absent variables, wrong state, wrong routing, wrong aggregation, or wrong specification. A support diagnosis is warranted only when the repair target is candidate reachability or coverage.

---

## 20. Conclusion

Support mismatch is the reachability failure of high-value LLM systems. It occurs when the structures required for task value are not sufficiently generated, preserved, matured, recognized, or selected under the deployed search procedure and budget.

It is a primitive mismatch because candidate support is a distinct station in the value-preservation pipeline. It is not reducible to missing observation, state ambiguity, capability routing failure, local-to-global aggregation failure, or objective mis-specification, even though it interacts strongly with all of them.

The main repair is not blind sampling. It is control-space search: search over the intermediate objects that determine task value more directly than final text. By constructing control axes, expanding candidates structurally, tracking coverage, protecting low-probability candidates, coupling to verifiers, and writing successful structures back into governed knowledge and hard state, an LLM system can raise the effective support of high-value outputs.

In the unified theory of governed LLM systems, support governance is the candidate-space counterpart to channel governance, router governance, audit engineering, and state governance. It answers a central question:

```text
Even if the system has the right information, the right state, the right capability, and the right objective,
will the high-value structure actually become a live candidate?
```

If the answer is no, the system does not need more fluent generation. It needs support repair.

---

## Appendix A: Compact Terminology

| Term | Definition |
|---|---|
| Support mismatch | Failure where high-value structures have insufficient effective reachability under the deployed policy, search operator, pruning rule, recognition mechanism, and budget. |
| Effective support | Probability that a high-value candidate is generated, preserved, recognized, and made available for selection. |
| Candidate space | The set of live candidates reachable under the system's policy and search budget. |
| Control space | A space of intermediate structures that determine the final artifact. |
| Control-space search | Searching over control objects rather than final outputs. |
| Support lifting | Transforming a low-support final-output target into a higher-support control-space target. |
| Pseudo-diversity | Surface variation among candidates that share the same structural blind spot. |
| Search warrant | A governed authorization for additional support expansion. |
| Support map | A representation of searched and undersearched candidate regions. |
| Coverage ledger | A record of generated candidates, structural axes, pruning decisions, and verification status. |
| Support delta | A control delta that changes reachability, preservation, expansion, or recognition of candidate regions. |
| Support regression guard | A guard ensuring a previously missed candidate family is now generated, preserved, and recognized. |

---

## Appendix B: Support Diagnosis Checklist

A support diagnosis should check:

```text
1. Was the relevant information present in representation?
2. Was the correct latent state identified or at least preserved as a branch?
3. Was the relevant capability activated?
4. Did candidate generation cover the structural axis where the answer lives?
5. Did candidates differ structurally or only stylistically?
6. Was a promising low-probability candidate generated and then pruned?
7. Was a partial candidate expanded into a full candidate?
8. Was the evaluator capable of recognizing the high-value candidate?
9. Was the support failure written back as a support delta?
10. Was a regression guard added to prevent recurrence?
```

If the answer to 1, 2, or 3 is no, the primary mismatch may be upstream. If the answer to 8 is no because the criterion itself is wrong, the primary mismatch may be specification. If candidate components exist but fail to compose, aggregation may dominate. Support diagnosis should be precise, not default.

---

## Appendix C: Example Support Delta Templates

### C.1 Missed Join Path

```json
{
  "id": "support_delta.missed_join_path",
  "type": "support_delta",
  "support_failure_subtype": "search_operator",
  "source_finding": "The generated SQL candidates did not include the bridge-table join path required by the schema.",
  "change": "Add explicit join-path enumeration over the schema graph before SQL rendering.",
  "target_region": "multi-hop join paths involving bridge tables",
  "expected_effect": "Raises reachability of low-probability but schema-valid query structures.",
  "regression_guard": "Representative questions requiring bridge-table joins must generate at least one valid bridge-path candidate before final SQL selection."
}
```

### C.2 Missed Edge Case

```json
{
  "id": "support_delta.missed_edge_case",
  "type": "support_delta",
  "support_failure_subtype": "policy",
  "source_finding": "Candidate patches ignored the empty-input edge case.",
  "change": "Add edge-case enumeration by input cardinality before patch generation.",
  "target_region": "zero-length, singleton, null, and boundary inputs",
  "expected_effect": "Increases candidate support for patches that preserve boundary behavior.",
  "regression_guard": "Patch-generation traces must include boundary-case consideration before final patch rendering."
}
```

### C.3 Pseudo-Diversity

```json
{
  "id": "support_delta.pseudo_diversity",
  "type": "support_delta",
  "support_failure_subtype": "search_operator",
  "source_finding": "The system generated five alternatives, all sharing the same hidden assumption.",
  "change": "Require structural diversity along state-hypothesis and mechanism-class axes.",
  "target_region": "alternative latent-state and mechanism basins",
  "expected_effect": "Reduces correlated sampling and increases chance of reaching the correct basin.",
  "regression_guard": "Alternative-candidate sets must include explicit axis annotations showing non-identical assumptions."
}
```

---

## Appendix D: Minimal Support Objects in YAML

```yaml
support_map:
  id: support_map.example
  task_scope: "current task"
  target_structure: "join_path"
  control_axes:
    - name: "join_depth"
      values_or_range: "1..3"
      coverage_status: "partially_covered"
    - name: "bridge_table"
      values_or_range: "schema-derived"
      coverage_status: "uncovered"
  known_low_support_regions:
    - "multi-hop paths through bridge tables"
  protected_regions:
    - "paths that initially look indirect but satisfy foreign-key constraints"
  revocation_trigger: "schema graph changes or direct-generation reliably covers these paths"

candidate_generation_contract:
  id: candidate_generation_contract.example
  target_artifact: "SQL skeleton"
  diversity_axes:
    - "table set"
    - "join path"
    - "predicate skeleton"
    - "aggregation form"
  forbidden_pseudo_diversity:
    - "alias-only variants"
    - "same join path with reordered clauses"
  candidate_lineage_required: true
  recognition_method: "schema validation + execution audit"

coverage_ledger:
  id: coverage_ledger.example
  task_scope: "single text-to-SQL query"
  generated_candidates: []
  coverage_gaps:
    - "no candidate explored bridge table relation"
  support_findings:
    - "dominant candidates used direct table pairing not supported by schema"
```
