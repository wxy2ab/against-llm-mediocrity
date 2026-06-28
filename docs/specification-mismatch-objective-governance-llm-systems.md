# Specification Mismatch and Objective Governance in LLM Systems

**Proxy Objectives, Tacit Utility, and Counterexample-Driven Specification Repair**  
**Working Draft v0.1**
**Xinyun Wang, Shuliang Liang**

---

## Abstract

Specification mismatch occurs when the objective that an LLM system can access, optimize, audit, or explain differs from the true task utility that actually matters. The system may satisfy the prompt while disappointing the user, pass a rubric while failing the real task, optimize a benchmark metric while violating semantic intent, produce a defensible answer while missing the decision criterion, or comply with a local instruction while damaging the global objective.

This paper develops specification mismatch as the sixth primitive mismatch in the structural theory of value preservation in LLM systems. In the world-to-output pipeline, specification mismatch occupies the evaluation station: the relation between the accessible proxy objective \(\tilde{U}\) and the true task utility \(U\). The central question is not whether the system has enough facts, enough reasoning, enough probability mass, or enough local coherence. The central question is: **what exactly is the system being optimized, selected, audited, rewarded, or revised toward, and does that criterion preserve the task value that matters?**

The paper distinguishes specification mismatch from observation-representation mismatch, state mismatch, fitting-boundary mismatch, support mismatch, and aggregation mismatch. It then introduces a typology of specification failures: underspecified objectives, proxy overfitting, metric capture, tacit utility loss, scope drift, preference inconsistency, local-global objective conflict, verifier incompleteness, rubric brittleness, and Goodhart-style exploitation. The paper argues that specification mismatch is especially central in LLM systems because many open-ended tasks do not have a complete specification at the beginning. The true success condition is often discovered through candidate failures, edge cases, expert review, execution feedback, user correction, and downstream consequences.

The constructive response is **Objective Governance**: the disciplined induction, revision, scoping, auditing, and revocation of task objectives. Objective Governance treats rubrics, success conditions, preference rules, evaluation criteria, acceptance tests, verifier contracts, and utility assumptions as governed objects rather than static prompt text. It connects directly to Audit Engineering: failures should not merely lower a score; they should update the specification, create control deltas, add regression guards, and revise the conditions under which an objective applies.

The paper concludes by placing Objective Governance inside the unified governed LLM architecture. Observation governance ensures that task-relevant variables enter the representation. State governance distinguishes latent regimes. Router governance activates the right capability. Support governance makes high-value candidates reachable. Compositional governance preserves global structure. Objective Governance determines what counts as success and prevents the entire system from optimizing the wrong target.

---

## 1. Position in the Unified Theory

The structural theory of value preservation analyzes LLM system failure as loss or distortion of task value across a world-to-output pipeline:

```text
S_world
  → observation / sensing
  → representation
  → state identification
  → capability routing
  → candidate support
  → aggregation / composition
  → evaluation / selection
  → committed output or action
```

Each primitive mismatch corresponds to a structurally distinct station in this pipeline:

| Pipeline station | Primitive mismatch | Core question |
|---|---|---|
| World to observation / representation | Observation-representation mismatch | Did the decisive variables enter the operational representation? |
| Representation to latent situation | State mismatch | Which hidden state or regime are we in? |
| Representation to capability activation | Fitting-boundary mismatch | Is the right capability triggered in the right domain? |
| Policy and search over candidates | Support mismatch | Is the high-value structure reachable under the search process? |
| Local parts to global artifact | Aggregation mismatch | Do locally good parts compose into globally valuable output? |
| Accessible evaluator to true utility | Specification mismatch | Is the system optimizing the right objective? |

This document develops the final station: **Specification Mismatch**.

The governing question is:

```text
What does the system believe success means, and is that belief task-faithful?
```

Specification mismatch is the failure mode in which the system is not primarily wrong because it lacks information, misidentifies the state, fails to trigger a capability, cannot reach the right candidate, or cannot compose local parts. Instead, the system may do all of those things adequately and still fail because the criterion guiding selection, revision, or acceptance is not the true criterion.

A system can optimize the wrong target very effectively.

That is why specification mismatch is one of the most dangerous primitive mismatches: it can turn every other improvement mechanism into a more efficient way of missing the point.

---

## 2. Core Definition

Let \(Y\) be a candidate output, artifact, plan, query, patch, answer, or action sequence.

Let \(U(Y, S)\) be the true task utility of \(Y\) in world state \(S\). This is the value that actually matters to the user, domain, environment, institution, benchmark semantics, or downstream consequence.

Let \(\tilde{U}(Y, Z)\) be the accessible evaluation function used by the LLM system. This may be a prompt instruction, rubric, reward model, preference model, benchmark metric, verifier, self-critique, human label, unit test, execution result, ranking rule, policy constraint, or informal acceptance condition.

**Specification mismatch** occurs when:

```text
rank_U(Y1, Y2) ≠ rank_Ũ(Y1, Y2)
```

for task-relevant candidate pairs \(Y_1, Y_2\), or when optimizing \(\tilde{U}\) systematically fails to improve \(U\).

Equivalently:

```text
The system is optimizing, selecting, revising, or accepting under a proxy objective
that does not preserve the true task utility.
```

The mismatch may be local, global, conditional, or dynamic:

```text
Local:        proxy fails on a small class of cases.
Global:       proxy is generally misaligned with true value.
Conditional:  proxy is valid only under some states or scopes.
Dynamic:      proxy becomes invalid after system behavior adapts to it.
```

A specification is therefore not merely a sentence in a prompt. It is the entire operational structure that determines what the system treats as success.

---

## 3. Specification Is Not the Same as Instruction

In ordinary prompt engineering, the specification is often treated as the instruction given to the model:

```text
"Write a concise answer."
"Generate a SQL query."
"Fix this bug."
"Summarize the document."
"Rank these candidates."
```

But in governed LLM systems, the specification includes much more:

```text
user intent
acceptance criteria
rubric dimensions
hidden constraints
risk tolerance
domain conventions
benchmark semantics
execution conditions
state-dependent priorities
non-goals
scope boundaries
failure costs
revocation conditions
human preferences
institutional rules
external verifier contracts
```

The prompt is only one expression of the specification. It may be incomplete, ambiguous, stale, overbroad, underconstrained, or internally inconsistent.

A useful distinction is:

```text
Stated instruction: what the user or developer says.
Operational specification: what the system actually uses to generate, select, revise, or accept.
True utility: what would count as success under the real task.
```

Specification mismatch may occur between any two of these layers.

For example:

```text
Stated instruction: "Make this answer more professional."
Operational specification: increase formality and hedge controversial claims.
True utility: make the answer clearer, more decisive, and more useful to a technical reader.
```

The system satisfies the operational proxy but harms the true objective.

---

## 4. Why Specification Mismatch Is Primitive

Specification mismatch is primitive because it occupies a structurally distinct station in the value-preservation pipeline.

Other mismatches concern whether the system has the right material and machinery to produce a valuable artifact:

```text
Observation-representation: Is the decisive variable present?
State: Is the situation identified?
Fitting-boundary: Is the right capability activated?
Support: Is the high-value candidate reachable?
Aggregation: Does local quality compose globally?
```

Specification mismatch asks a different question:

```text
Even if the system can produce the right artifact, will it recognize, select, and preserve it as right?
```

This is independent of the other mismatches.

A system may have perfect observation, correct state identification, correct capability routing, sufficient support, and sound aggregation, yet still fail if the evaluator rewards the wrong thing.

Conversely, a system may have an excellent specification but still fail due to missing variables, state ambiguity, routing failure, low support, or composition failure.

This independence gives specification mismatch its own repair target: objective repair.

The remedy is not merely more context, more search, better routing, or better composition. The remedy is to revise the success criterion itself.

---

## 5. Boundary with the Other Five Mismatches

A strong theory must distinguish specification mismatch from neighboring failure types. Many real failures are compound, but the primitive repair target should still be identifiable.

### 5.1 Specification vs Observation-Representation

Observation-representation mismatch asks:

```text
Did the task-critical variable enter the representation?
```

Specification mismatch asks:

```text
Given the variables available, does the evaluator value the right outcome?
```

Example:

```text
Task: recommend the best database migration plan.
```

If the system never receives information about downtime constraints, that is observation-representation mismatch.

If the system receives downtime constraints but uses a rubric that rewards elegance over operational safety, that is specification mismatch.

### 5.2 Specification vs State

State mismatch asks:

```text
Which latent situation are we in?
```

Specification mismatch asks:

```text
What should count as success in this situation?
```

Example:

```text
Task: decide whether a failing test indicates a real bug or flaky infrastructure.
```

If the system cannot tell whether the environment is flaky, that is state mismatch.

If it knows the environment is flaky but treats "make all tests pass" as the only objective, ignoring reproducibility and root-cause isolation, that is specification mismatch.

### 5.3 Specification vs Fitting-Boundary

Fitting-boundary mismatch asks:

```text
Was the right capability triggered?
```

Specification mismatch asks:

```text
Was the triggered capability evaluated against the right success condition?
```

Example:

```text
Task: audit a financial strategy.
```

If the model triggers generic risk commentary instead of mechanism-level strategy analysis, that is fitting-boundary mismatch.

If the model performs detailed analysis but the rubric rewards conservative language rather than alpha preservation, that is specification mismatch.

### 5.4 Specification vs Support

Support mismatch asks:

```text
Is the high-value structure reachable as a candidate?
```

Specification mismatch asks:

```text
If the high-value candidate appears, will the system prefer it?
```

Example:

```text
Task: generate a correct text-to-SQL query.
```

If the correct join path is never generated, that is support mismatch.

If the correct join path is generated but rejected because the evaluator overweights syntactic simplicity or exact-match resemblance, that is specification mismatch.

### 5.5 Specification vs Aggregation

Aggregation mismatch asks:

```text
Do locally good parts compose into global value?
```

Specification mismatch asks:

```text
Is the system judging the global artifact by the right value function?
```

Example:

```text
Task: write a legal argument.
```

If each paragraph is strong but the argument as a whole contradicts itself, that is aggregation mismatch.

If the argument is coherent but optimized for rhetorical force while the actual objective is settlement leverage, that is specification mismatch.

---

## 6. Types of Specification Mismatch

Specification mismatch appears in many forms. The following typology is intended as an intervention map, not a rigid taxonomy.

### 6.1 Underspecified Objective

The prompt or rubric omits important success conditions.

```text
"Write a good answer."
"Make this better."
"Fix the issue."
"Generate the best query."
```

The system must infer what matters, often from weak contextual signals. If the omitted criteria affect task utility, the system may optimize a plausible but wrong objective.

Common symptoms:

```text
generic improvement
surface polishing
unwanted hedging
missing domain constraints
failure to ask necessary clarifying questions
reasonable but irrelevant output
```

Repair target:

```text
success-condition extraction
rubric induction
non-goal declaration
scope clarification
acceptance criterion generation
```

### 6.2 Proxy Overfitting

The system optimizes a proxy that was originally correlated with true utility but becomes unreliable under optimization.

Examples:

```text
verbosity as a proxy for thoroughness
confidence as a proxy for correctness
politeness as a proxy for usefulness
unit-test pass rate as a proxy for semantic correctness
execution success as a proxy for intended SQL semantics
citation count as a proxy for authority
format compliance as a proxy for task completion
```

Proxy overfitting is especially dangerous because the system may appear to improve under the visible metric while degrading under true utility.

Repair target:

```text
proxy-risk audit
multi-criterion evaluation
counterexample bank
metric scope conditions
anti-Goodhart guard
```

### 6.3 Tacit Utility Loss

Many tasks contain tacit utility: implicit criteria that experts or users assume but do not state.

Examples:

```text
A business memo should preserve decision leverage, not just summarize facts.
A code review should identify maintainability risk, not just obvious bugs.
A data analysis should preserve causal caution, not just report correlations.
A research critique should locate the strongest failure mode, not list generic weaknesses.
A SQL query should match semantic intent, not merely execute.
```

Tacit utility loss occurs when the system satisfies explicit criteria while missing implicit value.

Repair target:

```text
domain-specific rubric induction
expert preference elicitation
contrastive examples
failure-mode taxonomy
implicit constraint extraction
```

### 6.4 Scope Drift

The objective may be valid within a scope but invalid outside it.

Examples:

```text
"Be concise" is useful for executive summaries but harmful for safety-critical instructions.
"Avoid speculation" is useful for factual reporting but harmful for hypothesis generation.
"Optimize runtime" is useful after correctness is established but harmful before semantic correctness.
"Follow the user's wording" is useful for style transfer but harmful when the user uses ambiguous terminology.
```

Scope drift occurs when a rule escapes the condition under which it is valid.

Repair target:

```text
conditioned objectives
scope annotations
priority rules
revocation triggers
state-dependent rubrics
```

### 6.5 Preference Inconsistency

Different parts of the system may encode inconsistent preferences.

Examples:

```text
The system prompt rewards caution; the user asks for decisiveness.
The benchmark rewards exact match; the task requires semantic equivalence.
The verifier rewards test passing; the human wants maintainable code.
The style rubric rewards brevity; the legal context requires nuance.
```

The system may oscillate, hedge, or satisfy the most salient criterion rather than resolving the preference conflict.

Repair target:

```text
preference hierarchy
conflict-resolution rules
priority lattice
stakeholder-specific objectives
explicit tradeoff declarations
```

### 6.6 Local-Global Objective Conflict

Local objectives may conflict with global objectives.

Examples:

```text
Each paragraph should be self-contained, but the whole document should avoid repetition.
Each SQL clause should be simple, but the full query must express a complex relation.
Each code change should be minimal, but the patch must preserve architectural consistency.
Each agent step should be productive, but the workflow must not drift from the final goal.
```

This resembles aggregation mismatch but the primitive error is objective-level: local criteria are over-prioritized relative to global criteria.

Repair target:

```text
global objective declaration
local criterion scoping
global acceptance tests
composition-aware rubric
hierarchical evaluation
```

### 6.7 Verifier Incompleteness

A verifier may check only part of the true objective.

Examples:

```text
Code compiles but violates the intended behavior.
SQL executes but returns the wrong semantic result.
A generated report has citations but misuses them.
A plan satisfies stated constraints but ignores operational risk.
A proof-like explanation is syntactically formal but has an invalid lemma.
```

Verifier incompleteness is not a reason to abandon verification. It is a reason to govern verifier scope.

Repair target:

```text
verifier scope declaration
complementary audits
semantic test generation
manual review triggers
non-covered-risk ledger
```

### 6.8 Rubric Brittleness

A rubric may be too rigid, coarse, or insensitive to context.

Examples:

```text
penalizing all uncertainty language
rewarding all citations equally
requiring fixed structure for tasks with different information needs
using the same checklist for exploration and final recommendation
```

Rubric brittleness causes the system to satisfy the letter of the evaluation while losing task-specific value.

Repair target:

```text
context-conditioned rubric
rubric exception cases
calibration examples
rubric revision history
rubric conflict audit
```

### 6.9 Objective Contamination

The objective may be contaminated by irrelevant signals from the prompt, context, prior examples, benchmark artifacts, or model priors.

Examples:

```text
The model imitates previous examples even when the current task differs.
The system treats a formatting convention as a semantic requirement.
The model infers that the user wants agreement rather than correction.
The system uses benchmark-specific shortcuts that do not reflect task semantics.
```

Repair target:

```text
source-prior correction
example influence audit
format-semantic separation
benchmark artifact detection
```

### 6.10 Objective Staleness

The objective may become stale as the task evolves.

Examples:

```text
A project plan changes after a stakeholder decision.
A debugging objective changes after discovering the root cause.
A research objective changes after new evidence appears.
A conversation objective changes after user correction.
```

If the system keeps optimizing the old objective, it may appear consistent while being obsolete.

Repair target:

```text
objective versioning
state-linked objective updates
revocation triggers
change logs
transition-committed specification updates
```

---

## 7. Formal Model

A minimal formalization separates four objects:

```text
S: world state
Z: operational representation
Y: candidate artifact
U: true utility
Ũ: accessible proxy objective
```

The system selects:

```text
Y_hat = argmax_Y Ũ(Y, Z)
```

But the task demands:

```text
Y_star = argmax_Y U(Y, S)
```

Specification mismatch exists when:

```text
U(Y_hat, S) << U(Y_star, S)
```

because:

```text
Ũ ≠ U over task-relevant distinctions.
```

A weaker, ranking-based condition is:

```text
∃ Y1, Y2 such that Ũ(Y1, Z) > Ũ(Y2, Z)
but U(Y1, S) < U(Y2, S)
```

A conditional specification is a family of objectives indexed by state, scope, or phase:

```text
Ũ = {Ũ_c : c ∈ C}
```

where `c` may represent:

```text
task phase
latent state
risk tier
user type
artifact type
verification mode
workflow stage
```

Conditional specification mismatch occurs when either:

```text
wrong condition selected: c_hat ≠ c_star
```

or:

```text
right condition selected but Ũ_c still misranks candidates under U.
```

This shows why specification mismatch couples with state and fitting-boundary mismatch. If the system chooses the wrong state or phase, it may also choose the wrong objective.

---

## 8. Specification Mismatch as a Repair-Operator Gate

Specification mismatch is especially powerful because it gates other repair operators.

If the objective is wrong, improvements elsewhere may become harmful.

```text
Better observation → more evidence for the wrong objective.
Better state identification → more precise pursuit of the wrong goal.
Better routing → stronger activation of the wrong capability.
Better support search → more candidates optimized for the wrong criterion.
Better aggregation → more coherent realization of the wrong plan.
Better audit → more efficient enforcement of the wrong rubric.
```

This is a central mechanism of super-additive failure.

Let `R_i` be a repair operator for another station. Its value depends on the objective under which its outputs are selected:

```text
Effect(R_i) = Effect(R_i | Ũ faithful to U)
```

When \(\tilde{U}\) is badly misaligned:

```text
∂U / ∂R_i may be zero or negative
```

even if:

```text
∂Ũ / ∂R_i is positive.
```

This is why objective governance is not optional in high-stakes systems. Without it, the entire governed architecture may become a machine for producing better-looking wrongness.

---

## 9. Objective Governance

**Objective Governance** is the disciplined management of objectives, rubrics, success conditions, proxies, verifiers, preferences, and acceptance criteria as governed objects.

It treats specifications not as static instructions but as artifacts that must be:

```text
induced
scoped
prioritized
audited
versioned
revised
weakened
revoked
committed to state
```

Objective Governance has six core principles.

### 9.1 Objectives Are Objects

A specification should be represented as an object with fields, not just embedded in prompt prose.

A minimal Objective Object schema:

```json
{
  "id": "objective.unique_identifier",
  "type": "objective | rubric | success_condition | proxy_metric | acceptance_test | verifier_contract | preference_rule",
  "condition": "When this objective applies",
  "assertion": "What counts as success or improvement",
  "priority": "How this objective ranks against others",
  "scope": "Task, phase, artifact, user, state, or risk tier where valid",
  "evidence": "Why this objective is believed to represent task value",
  "proxy_risks": "Ways this objective can be satisfied while true utility fails",
  "non_goals": "What this objective does not optimize",
  "verifier": "How satisfaction is checked, if checkable",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "When this objective should be revised or removed",
  "owner": "User, developer, system, domain authority, benchmark, or governance layer"
}
```

This schema forces the system to distinguish:

```text
what is being optimized
where it applies
why it is trusted
what it does not cover
when it should stop applying
```

### 9.2 Objectives Must Be Scoped

Unscoped objectives become dangerous.

```text
Be concise.
Be safe.
Be helpful.
Be rigorous.
Pass tests.
Optimize accuracy.
Preserve style.
Minimize change.
Use citations.
```

Each of these can be correct in one context and harmful in another.

Objective Governance therefore requires explicit scope:

```text
phase scope: exploration / drafting / final answer / execution
artifact scope: SQL / explanation / code patch / report / plan
risk scope: low-risk / high-risk / safety-critical
state scope: known / ambiguous / adversarial / incomplete
user scope: novice / expert / decision-maker / implementer
```

### 9.3 Objectives Need Priority Rules

LLM systems often face multiple objectives:

```text
accuracy
brevity
safety
completeness
faithfulness
maintainability
speed
style
user preference
legal constraints
benchmark metric
```

Without explicit priority, the system may choose the most salient or easiest-to-satisfy objective.

A priority rule may be simple:

```text
Correctness > completeness > style.
Safety constraints override helpfulness.
Semantic intent overrides exact phrasing.
Execution correctness is necessary but not sufficient.
```

Or conditional:

```text
During exploration, recall > precision.
During final answer, precision > recall.
For high-risk recommendations, uncertainty disclosure > fluency.
For code patches, semantic preservation > minimal diff size.
```

### 9.4 Objectives Need Proxy-Risk Audits

Every operational objective should include known failure modes.

For example:

```json
{
  "objective": "Pass unit tests",
  "proxy_risks": [
    "tests may not cover intended behavior",
    "patch may hard-code test cases",
    "performance regressions may be untested",
    "maintainability may degrade"
  ]
}
```

This prevents the system from mistaking a proxy for the full utility.

### 9.5 Objectives Need Revision Pathways

Open-ended tasks often reveal their true specification through failure.

A user may say:

```text
"No, I meant compare the mechanisms, not summarize the papers."
"This SQL executes, but it answers the wrong question."
"The code passes tests, but it breaks the abstraction."
"The answer is accurate, but not useful for this audience."
```

These corrections should not merely trigger another generation. They should update the objective object.

### 9.6 Objectives Need Revocation

Some objectives should stop applying when their scope changes.

Examples:

```text
A temporary debugging objective should not govern final architecture.
A benchmark-specific formatting rule should not govern real deployment.
A user's preliminary preference should be revoked after explicit correction.
A safety fallback should be weakened after the task is classified as harmless.
```

Revocation is essential because stale objectives cause persistent system drift.

---

## 10. Specification Audit

A **Specification Audit** asks whether the system's objective faithfully represents task value.

It is not the same as output evaluation. Output evaluation asks:

```text
Is this artifact good under the current criterion?
```

Specification audit asks:

```text
Is the current criterion the right criterion?
```

A minimal Specification Audit checklist:

```text
1. What objective is currently being optimized?
2. Is it explicit or implicit?
3. Who supplied it?
4. What true utility is it intended to proxy?
5. Under what scope is it valid?
6. What does it ignore?
7. What candidates would it incorrectly reward?
8. What candidates would it incorrectly penalize?
9. What evidence supports its validity?
10. What would trigger revision or revocation?
```

Specification Audit should be performed when:

```text
outputs are locally good but user dissatisfaction persists
a system passes visible checks but fails downstream
multiple revisions improve style but not usefulness
a metric improves while expert judgment worsens
candidate rankings feel unstable or arbitrary
user corrections reveal unstated criteria
benchmark success does not transfer to real tasks
```

---

## 11. Audit Findings for Specification Mismatch

Specification mismatch should be represented in Audit Engineering as a localized finding.

A specification-related Audit Finding schema:

```json
{
  "id": "finding.specification_mismatch.example",
  "artifact": "candidate output or system behavior",
  "finding": "The artifact satisfies the visible rubric but violates the true task objective.",
  "evidence": "Specific contrast between proxy success and utility failure.",
  "mismatch_type": "specification",
  "severity": "medium | high | critical",
  "repair_target": "objective | rubric | verifier | acceptance_test | preference_rule | priority_order",
  "control_delta": "Change to the governed objective object.",
  "regression_guard": "A test or scenario that fails if the proxy-success/utility-failure pattern recurs.",
  "confidence": "Confidence in the mismatch diagnosis"
}
```

Example:

```json
{
  "id": "finding.sql.semantic_proxy_failure",
  "artifact": "Generated SQL query",
  "finding": "The query executes successfully but answers a different question than the natural-language request.",
  "evidence": "Execution returns non-empty results, but selected column and grouping correspond to department count rather than employee count requested by the user.",
  "mismatch_type": "specification",
  "severity": "high",
  "repair_target": "acceptance_test",
  "control_delta": "Execution success must be treated as necessary but not sufficient; add semantic intent check comparing selected measure and grouping against question decomposition.",
  "regression_guard": "Inject an executable but semantically wrong SQL candidate; guard must reject it.",
  "confidence": "high"
}
```

This structure turns a failure into an objective update.

---

## 12. Control Deltas for Objective Repair

A **Control Delta** is a localized change to the governed control space. For specification mismatch, the control delta changes how the system defines, prioritizes, checks, or revokes success.

Common specification control deltas include:

### 12.1 Add Missing Criterion

```text
Add a new success condition that was previously tacit.
```

Example:

```text
Generated summaries must preserve decision-relevant uncertainty, not only main claims.
```

### 12.2 Narrow Objective Scope

```text
Restrict an objective to the contexts where it is valid.
```

Example:

```text
"Be concise" applies to the executive overview, not to the risk disclosure section.
```

### 12.3 Add Priority Rule

```text
Resolve conflict between objectives.
```

Example:

```text
For code repair, semantic correctness outranks minimal diff size.
```

### 12.4 Add Proxy-Risk Guard

```text
Prevent the system from satisfying the proxy while failing the true utility.
```

Example:

```text
Passing unit tests does not authorize completion if the patch changes public API semantics.
```

### 12.5 Add Negative Example

```text
Store a candidate that should be rejected despite looking good under the proxy.
```

Example:

```text
An answer with many citations but no causal analysis is not sufficient for this task.
```

### 12.6 Revise Verifier Contract

```text
Change what the verifier is allowed to certify.
```

Example:

```text
Execution success certifies syntactic validity and runtime feasibility, not semantic correctness.
```

### 12.7 Version the Objective

```text
Commit a new objective version after task state changes.
```

Example:

```text
After root cause is identified, objective changes from exploration to minimal safe patch.
```

---

## 13. Regression Guards for Specification Mismatch

A specification regression guard prevents recurrence of a proxy-success / true-utility-failure pattern.

A good guard has teeth:

```text
If a representative specification defect is reintroduced, the guard must fail.
```

Specification guards may take several forms.

### 13.1 Contrastive Candidate Pair

Store two candidates:

```text
Y_bad: scores well under old proxy, fails true utility.
Y_good: better under true utility, perhaps less attractive under old proxy.
```

The guard requires the system to prefer `Y_good`.

### 13.2 Proxy Exploit Test

Construct an artifact that exploits the proxy.

Examples:

```text
A verbose answer that says little.
A SQL query that executes but answers the wrong measure.
A code patch that passes tests by hard-coding cases.
A citation-rich report that misrepresents evidence.
A safe-sounding recommendation that avoids the user's actual decision.
```

The guard must reject it.

### 13.3 Scope Boundary Test

Test whether an objective is applied outside its valid scope.

Example:

```text
"Be concise" should not suppress legally required caveats.
```

### 13.4 Priority Conflict Test

Test whether the system resolves objective conflicts correctly.

Example:

```text
When brevity conflicts with correctness, correctness must win.
```

### 13.5 Verifier Authority Test

Test whether the system overclaims what a verifier proves.

Example:

```text
A unit-test pass may allow "tested under current suite" but not "bug fully fixed" unless additional semantic checks pass.
```

---

## 14. Objective Objects and GKO Integration

Objective Governance should integrate with the Governed Knowledge Object model.

An objective can be represented as a GKO:

```json
{
  "id": "gko.objective.semantic_correctness_over_execution_only",
  "type": "rubric | success_condition | verifier_contract",
  "condition": "Text-to-SQL tasks where execution feedback is available",
  "assertion": "Execution success is necessary but not sufficient; semantic intent alignment must be checked separately.",
  "strength": "hard",
  "priority": "higher than syntactic simplicity and query brevity",
  "evidence": "Executable queries can answer the wrong natural-language question.",
  "source": "Audit finding from semantic proxy failure",
  "lifespan": "project",
  "revocation_trigger": "If a complete semantic verifier is introduced that subsumes this check",
  "not_supported_claims": "Does not imply that execution feedback is unimportant; it remains a necessary lower-level check."
}
```

This object can then guide:

```text
candidate ranking
audit prompts
verifier interpretation
SQL repair
regression guard creation
completion claims
```

Objective GKOs differ from ordinary facts. They govern value judgments, not just world descriptions.

---

## 15. Objective Governance and SGAR

Objectives should be connected to hard state.

In long-horizon systems, objective changes must not be loose context updates. They should be committed transitions.

A state transition might look like:

```text
S: current task objective = "identify root cause"
A: user confirms root cause and asks for patch
O: confirmation message + failing test isolated
V: transition criterion satisfied
S': current task objective = "produce minimal safe patch preserving public API"
```

The key principle:

```text
The model may suggest an objective update, but only a valid transition commits it.
```

Without this, objectives drift. The agent may continue optimizing an old phase after the task has changed, or silently change objectives without user authorization.

SGAR therefore requires:

```text
objective versioning
objective transition records
state-linked rubrics
commit criteria for objective changes
rollback when objective updates are invalid
```

A minimal Objective Transition Record:

```json
{
  "transition_id": "transition.objective.001",
  "previous_objective": "Explore possible causes of failing test",
  "proposed_objective": "Implement minimal patch for confirmed root cause",
  "trigger": "User confirmed root cause and requested patch",
  "evidence": "Conversation turn, test output, audit finding",
  "verifier": "Root cause finding accepted and patch request explicit",
  "committed": true,
  "rollback_condition": "If new evidence contradicts the root cause"
}
```

---

## 16. Objective Governance in Text-to-SQL

Text-to-SQL is a useful example because specification mismatch is common even when execution feedback exists.

A naive objective is:

```text
Generate a SQL query that executes successfully.
```

But the true objective is closer to:

```text
Generate a SQL query that semantically answers the natural-language question under the database schema and contents.
```

Execution is necessary but not sufficient.

Specification mismatch appears when:

```text
query executes but answers the wrong measure
query uses plausible but wrong column
query groups by the wrong entity
query filters by the wrong value interpretation
query returns non-empty results but violates question intent
query matches benchmark artifacts but not semantic meaning
```

Objective Governance introduces a layered rubric:

```text
1. SQL syntax validity
2. Executability
3. Schema-linking correctness
4. Value-linking correctness
5. Join-path semantic correctness
6. Predicate correctness
7. Aggregation correctness
8. Result-set semantic alignment
9. Benchmark-specific answer format
```

Each layer has scope and authority.

For example:

```text
Executability can reject invalid SQL.
Executability cannot certify semantic correctness.
Result comparison can catch many errors.
Result comparison may still miss semantically wrong queries that coincidentally produce the same result.
Semantic decomposition can identify intended measure, entity, condition, and grouping.
```

A governed text-to-SQL system should therefore maintain Objective GKOs such as:

```text
Execution success is necessary but not sufficient.
Question decomposition has authority over syntactic simplicity.
Join path must be justified by schema relation and question semantics.
Aggregation must match the requested measure and grouping.
Value normalization must preserve user intent.
```

These are not extra experiments. They are the objective layer that explains why a control-space approach outperforms direct SQL generation.

---

## 17. Objective Governance in Code Repair

Code repair also exposes specification mismatch.

A naive objective is:

```text
Make the tests pass.
```

The true objective may be:

```text
Fix the underlying bug while preserving intended behavior, maintainability, public interfaces, performance constraints, and architectural invariants.
```

Common specification failures:

```text
hard-code test cases
weaken assertions
remove failing behavior instead of fixing it
change public API without authorization
optimize local function while breaking system invariant
pass current tests but fail implied behavior
```

Objective Governance requires:

```text
test authority scoping
semantic preservation rules
minimal-change priority only after correctness
public API invariants
architecture constraints
regression guards for representative bug behavior
```

Example Objective GKO:

```json
{
  "id": "gko.code.tests_necessary_not_sufficient",
  "type": "verifier_contract",
  "condition": "Automated tests are available for code repair",
  "assertion": "Passing tests is necessary evidence but does not by itself certify semantic correctness or maintainability.",
  "strength": "hard",
  "priority": "over completion claims",
  "proxy_risks": [
    "hard-coded test behavior",
    "untested edge-case regression",
    "architectural degradation"
  ],
  "revocation_trigger": "Only if test suite is proven complete for the declared behavioral spec"
}
```

---

## 18. Objective Governance in Writing and Analysis

Writing tasks often appear subjective, but they still contain specifications.

A user may ask:

```text
"Make this stronger."
```

The system may interpret this as:

```text
more assertive tone
more polished language
more persuasive phrasing
```

But the true objective may be:

```text
clearer argument structure
better evidence hierarchy
more precise claim boundaries
less generic language
better reader actionability
```

Specification mismatch in writing often produces:

```text
polished mediocrity
confident but unsupported claims
generic professional tone
loss of original insight
inflated structure without sharper argument
```

Objective Governance can represent the task-specific writing objective:

```json
{
  "id": "gko.writing.strength_means_argument_power",
  "type": "success_condition",
  "condition": "User asks to make analytical writing stronger",
  "assertion": "Strength means clearer thesis, sharper causal structure, better evidence use, and reduced generic phrasing; not merely more assertive tone.",
  "priority": "argument quality over surface polish",
  "proxy_risks": [
    "rhetorical inflation",
    "unwarranted confidence",
    "generic executive tone"
  ],
  "revocation_trigger": "User explicitly asks for style-only editing"
}
```

This explains why ordinary rewriting can remain locally aligned but globally mediocre: the model is good at surface improvement, but the objective should have been argument repair.

---

## 19. Objective Governance in Agentic Workflows

In agentic workflows, specification mismatch often appears as phase confusion.

An agent may optimize the wrong phase objective:

```text
Exploration objective: maximize relevant hypotheses.
Diagnosis objective: discriminate among hypotheses.
Repair objective: make minimal validated change.
Finalization objective: document and commit verified result.
```

If the agent keeps exploring during repair, it wastes effort. If it finalizes during diagnosis, it creates false completion. If it optimizes minimal change before identifying the root cause, it patches symptoms.

Objective Governance for agents requires:

```text
phase-specific objectives
transition criteria between phases
phase-linked verifiers
objective state records
completion authority rules
```

A phase objective table:

| Phase | Objective | Completion criterion | Common proxy failure |
|---|---|---|---|
| Explore | Identify plausible hypotheses | Hypothesis set covers observed symptoms | Generic brainstorming |
| Diagnose | Discriminate root cause | Evidence supports one cause over alternatives | Premature certainty |
| Repair | Implement minimal safe fix | Patch addresses root cause and passes checks | Test hacking |
| Verify | Confirm no regression | Relevant guards pass | Overclaiming from partial tests |
| Finalize | Commit and report | State transition recorded | Narrative completion |

This connects Specification Mismatch directly to SGAR.

---

## 20. Objective Governance Protocol

A practical Objective Governance protocol has eight steps.

### Step 1: Extract Candidate Objectives

Identify what the system appears to be optimizing.

```text
explicit user instruction
system prompt criterion
rubric items
implicit model behavior
benchmark metric
verifier result
human preference signal
```

### Step 2: Identify True Utility Hypothesis

State what success likely means in the real task.

```text
What downstream consequence matters?
What would make the user accept or reject the result?
What would an expert consider a failure?
What is not captured by the visible metric?
```

### Step 3: Compare Proxy and Utility

Ask:

```text
Where can Ũ be high while U is low?
Where can U be high while Ũ is low?
```

### Step 4: Scope the Objective

Specify:

```text
when it applies
where it does not apply
which phase it governs
which risks it ignores
```

### Step 5: Define Priority and Conflict Rules

Specify how objectives rank.

```text
correctness over fluency
semantic intent over exact phrasing
safety constraint over user preference
verified state over narrative claim
```

### Step 6: Add Proxy-Risk Guards

Create representative cases where the proxy is misleading.

### Step 7: Store as Objective GKO

Commit the objective with evidence, scope, lifespan, and revocation trigger.

### Step 8: Monitor and Revise

When failures occur, update the objective rather than merely regenerating.

---

## 21. Objective Governance and Human-AI Collaboration

Specification mismatch is often a collaboration problem. Users may not be able to fully specify what they want before seeing failures.

In such cases, the system should not assume the initial prompt is the complete objective. It should treat the prompt as an initial hypothesis.

A governed collaboration loop:

```text
initial instruction
  → candidate objective hypothesis
  → artifact generation
  → user / audit feedback
  → objective refinement
  → updated GKO
  → revised artifact
```

Important distinction:

```text
Clarifying the objective is not asking the user to do the system's job.
It is preserving task value when the true utility is underdetermined by the initial instruction.
```

However, objective governance should not overburden the user. The system can often infer candidate criteria and ask targeted questions only when the expected value of clarification exceeds its cost.

---

## 22. Failure Modes of Objective Governance

Objective Governance itself can fail.

### 22.1 Objective Proliferation

The system accumulates too many criteria, making generation brittle or overconstrained.

Mitigation:

```text
priority pruning
scope narrowing
objective merging
lifespan limits
```

### 22.2 Rubric Theater

The system creates elaborate rubrics that do not affect selection or repair.

Mitigation:

```text
trace objective use in ranking and audit
require counterexample guards
verify rubric has behavioral consequences
```

### 22.3 Proxy Multiplication

Adding more proxies may create the illusion of completeness while still missing true utility.

Mitigation:

```text
explicit non-covered risks
expert review triggers
contrastive failure cases
```

### 22.4 Objective Lock-In

A provisional objective becomes persistent after it should have been revised.

Mitigation:

```text
revocation triggers
objective versioning
periodic scope audit
state-linked objective transitions
```

### 22.5 Overfitting to User Corrections

The system overgeneralizes from a single correction.

Mitigation:

```text
conditioned objective updates
support scope limits
confidence levels
user-confirmed generalization
```

### 22.6 Objective Conflict Suppression

The system hides conflicts by producing vague compromise outputs.

Mitigation:

```text
explicit tradeoff declaration
priority hierarchy
ask-for-decision triggers
```

---

## 23. Design Patterns

### 23.1 Necessary-But-Not-Sufficient Pattern

Use when a verifier checks only part of the objective.

```text
X passing is necessary but not sufficient for Y.
```

Examples:

```text
Execution is necessary but not sufficient for semantic SQL correctness.
Tests passing is necessary but not sufficient for correct code repair.
Citation presence is necessary but not sufficient for evidence quality.
```

### 23.2 Proxy Exploit Pattern

For every proxy, ask:

```text
What artifact could maximize this proxy while failing the task?
```

Store that artifact as a guard.

### 23.3 Scope Box Pattern

Every objective receives:

```text
applies_when
invalid_when
priority
revocation_trigger
```

### 23.4 Contrastive Objective Pair Pattern

Define success using pairs:

```text
Prefer A over B because A better preserves true utility, even though B scores higher on a tempting proxy.
```

### 23.5 Phase Objective Pattern

Agentic tasks should use phase-specific objectives, not one global instruction.

```text
explore → diagnose → repair → verify → finalize
```

### 23.6 Objective Ledger Pattern

Maintain a ledger of objective changes:

```text
objective version
reason for change
evidence
scope
committed transition
rollback condition
```

---

## 24. Minimal Implementation Architecture

A minimal system that supports Objective Governance contains:

```text
Objective Extractor
Objective Store
Proxy-Risk Auditor
Priority Resolver
Verifier Scope Manager
Specification Audit Module
Control Delta Writer
Regression Guard Generator
State Commitment Layer
```

The data flow:

```text
User task / system context
  → Objective Extractor
  → Objective Objects
  → Generation / Search / Routing
  → Candidate Artifact
  → Output Audit + Specification Audit
  → Audit Finding
  → Control Delta
  → Objective GKO Update
  → Regression Guard
  → State Commitment
```

This architecture does not require every task to use heavy governance. It allows objectives to be represented when needed and bypassed when the task is simple.

---

## 25. When Objective Governance Is Necessary

Objective Governance is especially valuable when:

```text
true success is tacit or expert-dependent
the visible metric is incomplete
failure costs are high
the task has multiple stakeholders
outputs are selected or revised over many rounds
user feedback reveals hidden criteria
benchmarks differ from deployment objectives
long-horizon agents change phases
verifiers are partial
the system keeps producing polished but unsatisfactory outputs
```

It may be unnecessary when:

```text
the objective is simple and explicit
the verifier is complete
the task is low-risk and one-shot
local quality strongly predicts global success
the user only wants surface transformation
governance overhead exceeds expected value gain
```

This boundary is important. Objective Governance is not a universal ceremony. It is a response to objective uncertainty, proxy risk, and value-bearing complexity.

---

## 26. Relation to Goodhart and Mechanism Design

Specification mismatch is closely related to the general problem of proxy optimization. When a proxy becomes the target of optimization, it may cease to preserve the value it was intended to represent.

LLM systems make this problem more common because their objectives are often expressed through soft artifacts:

```text
prompts
rubrics
examples
reward models
preference labels
benchmarks
self-critiques
human comments
execution checks
```

These artifacts are useful, but each compresses the true utility. Objective Governance makes this compression explicit and revisable.

The mechanism-design analogy is also useful: an LLM system is an optimizer responding to incentives encoded by prompts, metrics, verifiers, and feedback. If the incentive structure rewards the wrong observable behavior, the system may learn or select strategies that satisfy the incentive while violating the intended outcome.

The contribution of Objective Governance is to bring these concerns into the inference-time control layer of LLM systems.

---

## 27. Relation to the Other Governance Layers

Objective Governance is one layer in the larger governed LLM architecture.

```text
Observation Governance:
  Ensure decisive variables enter Z.

State Governance:
  Identify which latent regime the task is in.

Router Governance:
  Activate the right capabilities under the right conditions.

Support Governance:
  Make high-value structures reachable.

Compositional Governance:
  Preserve global value across local parts.

Objective Governance:
  Define, scope, audit, and revise what counts as success.

Audit Engineering:
  Convert failures into control deltas and regression guards.

SGAR:
  Commit valid objective changes and artifact completions into hard state.
```

The layers interact. Objective Governance often supplies the criteria used by the other layers. But it also depends on them. A good objective cannot be applied if the decisive variables are absent, the state is wrong, the capability is not triggered, the candidate is unreachable, or the artifact composition is broken.

---

## 28. Self-Audit of Specification Mismatch

The claim that specification mismatch is primitive should itself have a governance record.

```json
{
  "id": "gko.theory.specification_mismatch_primitive",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as value-preservation pipelines with an accessible evaluator and true task utility",
  "assertion": "Specification mismatch is a primitive failure mode: the accessible objective can diverge from true utility even when observation, state, routing, support, and aggregation are adequate.",
  "strength": "structural-relative",
  "support_scope": "Tasks where system behavior is selected, revised, rewarded, or accepted under an operational criterion",
  "revocation_trigger": "Show that all objective divergence failures can be reduced to another primitive mismatch without losing intervention specificity.",
  "not_supported_claims": "Does not claim that every objective disagreement is resolvable; does not claim true utility is always fully knowable; does not claim objective governance eliminates the need for human judgment."
}
```

This self-audit is important. Objective Governance does not assume the true utility is always perfectly accessible. It assumes only that proxy objectives should be treated as fallible, scoped, revisable objects.

---

## 29. Conclusion

Specification mismatch is the failure of objective preservation. It occurs when the system's accessible criterion \(\tilde{U}\) diverges from the true task utility \(U\). The result is not necessarily incoherence or hallucination. The result may be a polished, compliant, well-structured artifact that optimizes the wrong target.

This mismatch is primitive because it occupies the evaluation station in the world-to-output pipeline. It cannot be reduced to missing information, state ambiguity, capability misrouting, low support, or compositional failure. A system may solve all of those and still select the wrong artifact if its objective is wrong.

The constructive response is Objective Governance: represent objectives as governed objects, scope them, prioritize them, audit their proxy risks, revise them through counterexamples, attach regression guards, and commit objective changes through hard state transitions.

In the unified theory, Objective Governance completes the six-station account of value preservation. Observation governance asks whether variables enter the representation. State governance asks which situation the system is in. Router governance asks which capability should activate. Support governance asks whether high-value candidates are reachable. Compositional governance asks whether local parts form global value. Objective Governance asks what value means in the first place.

Without Objective Governance, the system may become increasingly capable at optimizing the wrong criterion. With it, failures can become specification updates, proxy risks can become guards, rubrics can become scoped objects, and task value can be preserved not merely in outputs but in the system's evolving understanding of success.

---

## Appendix A: Compact Terminology

| Term | Definition |
|---|---|
| Specification mismatch | Divergence between accessible proxy objective and true task utility. |
| True utility \(U\) | The value that actually matters in the task context. |
| Proxy objective \(\tilde{U}\) | The operational criterion used by the system to generate, rank, revise, or accept. |
| Objective Governance | Management of objectives as scoped, revisable, auditable governed objects. |
| Objective Object | A structured representation of a success condition, rubric, proxy, or verifier contract. |
| Proxy-risk audit | Analysis of how a proxy can be satisfied while true utility fails. |
| Tacit utility | Task value that is real but not explicitly stated in the prompt or rubric. |
| Scope drift | Applying an objective outside the condition where it is valid. |
| Verifier incompleteness | A verifier checks only part of the true objective. |
| Rubric brittleness | A rubric is too rigid or context-insensitive to preserve task value. |
| Objective staleness | A previously valid objective persists after the task state changes. |
| Specification audit | Audit of whether the current objective is the right objective. |
| Objective GKO | A governed knowledge object that defines or constrains task success. |
| Proxy exploit test | A guard case that satisfies the proxy while failing true utility. |

---

## Appendix B: Minimal Objective Object Template

```json
{
  "id": "objective.<name>",
  "type": "objective | rubric | success_condition | proxy_metric | acceptance_test | verifier_contract | preference_rule",
  "condition": "When this objective applies",
  "assertion": "What counts as success or improvement",
  "priority": "How this objective ranks against other objectives",
  "scope": "Where this objective is valid",
  "evidence": "Why this objective is believed to track task value",
  "proxy_risks": [
    "How this objective could be satisfied while true utility fails"
  ],
  "non_goals": [
    "What this objective does not optimize"
  ],
  "verifier": "How satisfaction is checked, if checkable",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "When this objective should be revised or removed",
  "owner": "User | developer | system | domain authority | benchmark | governance layer"
}
```

---

## Appendix C: Specification Audit Checklist

```text
1. What objective is currently being optimized?
2. Is the objective explicit, inferred, or inherited?
3. Who or what supplied the objective?
4. What true utility is the objective intended to proxy?
5. What important task value does the objective omit?
6. Under what condition is the objective valid?
7. Where does the objective stop applying?
8. What candidate would score high under the proxy but fail the task?
9. What candidate would score lower under the proxy but better satisfy true utility?
10. What conflicts exist with other objectives?
11. What priority rule resolves the conflict?
12. What evidence supports the objective?
13. What verifier, if any, checks it?
14. What does the verifier not prove?
15. What failure would trigger objective revision?
16. What regression guard prevents recurrence of the same specification defect?
17. Should the objective be committed to hard state?
18. What rollback condition applies?
```

---

## Appendix D: Example Objective Ledger Entry

```json
{
  "objective_version": "obj.v3",
  "task": "Text-to-SQL query generation",
  "previous_objective": "Generate executable SQL",
  "new_objective": "Generate SQL that executes and semantically answers the natural-language question under the schema and database contents",
  "reason_for_change": "Audit found executable queries that answered the wrong measure",
  "evidence": [
    "semantic mismatch finding",
    "candidate query returned non-empty result",
    "question decomposition required employee count but query counted departments"
  ],
  "added_proxy_risks": [
    "execution success can mask semantic error",
    "non-empty result can mask wrong predicate or grouping"
  ],
  "added_guards": [
    "executable_wrong_measure_guard",
    "wrong_grouping_semantic_guard"
  ],
  "scope": "Text-to-SQL tasks with natural-language question and database schema",
  "committed_by": "state transition contract",
  "rollback_condition": "If a complete semantic verifier supersedes the layered objective"
}
```
