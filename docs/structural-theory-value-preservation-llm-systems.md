# A Structural Theory of Value Preservation in LLM Systems

**Working Draft v0.1**  

---

## Abstract

Large language model (LLM) systems increasingly rely on inference-time procedures: repeated sampling, critique, planning, retrieval, tool use, reranking, execution feedback, and iterative revision. These procedures can substantially improve task performance, but they also reveal a persistent limitation. On many high-value tasks, the system does not fail by producing arbitrary nonsense. Instead, it remains concentrated in outputs that are fluent, locally coherent, defensible, and incrementally improvable while still missing the structural conditions that determine true task value. We call this regime **LLM mediocrity**.

This paper proposes a structural account of when and why that regime appears. The central claim is that high-value LLM system design is not merely a problem of better generation, but a problem of **value preservation** across a world-to-output pipeline. Task value must survive observation, representation, latent-state identification, capability routing, policy support, local-to-global aggregation, and specification. Failures arise when value-relevant structure is lost, aliased, routed to the wrong capability, assigned insufficient probability mass, locally optimized but globally broken, or evaluated under the wrong proxy. We formalize these as six primitive mismatches: **observation-representation mismatch**, **state mismatch**, **fitting-boundary mismatch**, **support mismatch**, **aggregation mismatch**, and **specification mismatch**.

The six mismatches are not presented as a loose taxonomy of surface errors. They are derived from structurally distinct stations in a generic LLM system pipeline:

```text
S_world → O → Z → capability routing → candidate support → aggregation → evaluation
```

Under this abstraction, the taxonomy has a relative completeness claim: any failure of task-value preservation must occur at one or more of these stations or in their interactions. It also has an independence claim: each mismatch can be perturbed while holding the others fixed, producing failures with distinct repair targets.

The paper then introduces a mechanism for compound failure. Mismatches do not merely accumulate additively or multiplicatively. They often become **super-additive** because repair operators are coupled across pipeline stations. A repair operation for one mismatch may be ineffective when another station has already destroyed the information, state distinction, routing condition, support mass, aggregation invariant, or objective criterion on which the repair depends.

This structural view unifies three system-level interventions. **Knowledge Governance** externalizes and revises task-specific control knowledge as governed objects. **Audit Engineering** converts failure signals into localized control deltas and regression guards. **State-Governed Agent Regime (SGAR)** provides hard-state authority for long-horizon systems, ensuring that plans, observations, verifications, corrections, and revocations become committed state transitions rather than loose context narrative. Together, these mechanisms implement a broader principle: preserve locally aligned model capabilities, but transform high-mismatch task components into lower-mismatch control objects that can be audited, revised, revoked, and reused.

---

## Contents

This is a long working paper. Sections 1–2 set up the value-preservation problem; Sections 3–6 develop the six-mismatch taxonomy and its compound-failure mechanism; Sections 7–11 describe the governance response and its object model; Sections 12–16 cover a worked instantiation, related traditions, scope limits, and a self-audit.

- [1. Introduction](#1-introduction)
- [2. The Value-Preservation Problem](#2-the-value-preservation-problem)
- [3. Six Primitive Mismatches as Pipeline-Station Failures](#3-six-primitive-mismatches-as-pipeline-station-failures)
- [4. Relative Completeness and Independence](#4-relative-completeness-and-independence)
- [5. Regimes of Probability-Value Coupling](#5-regimes-of-probability-value-coupling)
- [6. Repair-Operator Coupling and Super-Additive Failure](#6-repair-operator-coupling-and-super-additive-failure)
- [7. Mediocrity-to-Extraordinary Transformation](#7-mediocrity-to-extraordinary-transformation)
- [8. Knowledge Governance](#8-knowledge-governance)
- [9. Audit Engineering](#9-audit-engineering)
- [10. State-Governed Agent Regime](#10-state-governed-agent-regime)
- [11. A Unified Object Model](#11-a-unified-object-model)
- [12. Text-to-SQL as a Flagship Instantiation](#12-text-to-sql-as-a-flagship-instantiation)
- [13. Relation to Existing Formal Traditions](#13-relation-to-existing-formal-traditions)
- [14. When Governance Is Not Needed](#14-when-governance-is-not-needed)
- [15. Self-Audit of the Theory](#15-self-audit-of-the-theory)
- [16. Conclusion](#16-conclusion)
- [Appendix A: Compact Terminology](#appendix-a-compact-terminology)

---

## 1. Introduction

Modern LLM systems are no longer one-shot text generators. They search, critique, retrieve, execute tools, inspect errors, revise outputs, and accumulate intermediate artifacts. These methods demonstrate that model behavior at deployment time is not determined solely by a single forward pass. A system can reshape the task it presents to the model, expose intermediate states, ask for decompositions, and use external verification to improve results.

Yet this progress exposes a deeper problem. Many high-value tasks do not merely require a fluent answer. They require preserving a task-specific value structure across multiple transformations: from the world into observations, from observations into representations, from representations into capability activation, from capability activation into candidate generation, from candidates into global artifacts, and from artifacts into evaluation. When this value structure is not preserved, the system may produce outputs that are locally plausible and even locally useful but globally deficient.

This failure mode is not the same as random hallucination. It is also not merely lack of diversity. The system may generate many different candidates, and all of them may still inhabit the same low-value basin. They may share the same missing variable, the same wrong latent-state assumption, the same capability-routing error, the same low-support blind spot, the same local-to-global composition failure, or the same proxy objective. The problem is not that the model cannot produce language. The problem is that the task value has not survived the system pipeline.

We call the broader regime **LLM mediocrity**: under a fixed inference budget and a given set of search operators, the system remains concentrated in regions of reachable output space that are easy to generate, defend, and refine but systematically below the value demanded by the task. The term does not describe a universal property of LLMs. Many tasks lie in positive regimes where generation, semantic association, compression, surface fluency, genre priors, and iterative refinement are strongly aligned with task value. In such cases, autoregressive generation is not a bottleneck but a source of excellence.

The important regime is the middle one. In many deployed tasks, LLMs are neither simply mediocre nor globally extraordinary. They are **locally aligned**: the model is genuinely good at parts of the work, but those local strengths do not reliably compose into global task success. A system may be excellent at summarizing context, generating edge cases, drafting an outline, or translating tone, while still failing to preserve a hidden dependency, identify a decisive state, activate the right capability, reach a rare structure, or optimize the actual success criterion.

This paper develops a structural theory of that middle regime and its failure boundaries. The theory rests on four claims.

First, task-value failure in LLM systems can be analyzed as failure of preservation across a world-to-output pipeline. The pipeline is abstract enough to cover pure prompting, retrieval-augmented generation, tool-using agents, execution-guided code synthesis, text-to-SQL systems, and long-horizon autonomous workflows.

Second, six primitive mismatches correspond to six structurally distinct stations in that pipeline. Observation-representation mismatch concerns whether decisive world variables enter the model-accessible representation. State mismatch concerns whether the relevant latent state is identifiable under the available observations. Fitting-boundary mismatch concerns whether learned capabilities are activated in the right domain. Support mismatch concerns whether high-value structures have enough probability mass or reachability under the system policy. Aggregation mismatch concerns whether local improvements compose into global value. Specification mismatch concerns whether the accessible proxy objective represents the true task utility.

Third, compound failures are often super-additive because repair operations are coupled. A specification repair may be useless if the decisive variable never entered the representation. An aggregation repair may be useless if the system is operating under the wrong latent-state hypothesis. A support expansion may be useless if the correct candidate is later routed to the wrong evaluator. These interactions are not incidental. They follow from the pipeline structure.

Fourth, successful high-value LLM systems should not merely increase output-space search. They should transform the task. The system should preserve locally aligned model operations while converting high-mismatch parts into governed control objects: schemas, constraints, rubrics, state hypotheses, join paths, failure modes, regression guards, routing rules, and transition contracts. This is the principle of **Mediocrity-to-Extraordinary Transformation**: change the form in which the task appears to the model so that more of the work falls into locally aligned or positively aligned regimes.

---

## 2. The Value-Preservation Problem

Let a task be defined by a world state, a system procedure, an output, and a true utility function. A high-value LLM system must not merely produce an output that appears plausible under the model policy. It must produce an output whose relevant structure is valuable under the task utility.

We can write this schematically as:

```text
S_world → System → Y → U(Y, S_world)
```

where:

- `S_world` is the underlying world, environment, database, user need, codebase, research context, or task situation.
- `Y` is the system artifact: an answer, plan, SQL query, code patch, diagnosis, report, or action sequence.
- `U` is the true task utility.

The difficulty is that the system never acts directly on `S_world` or `U`. It acts through observations, encodings, prompts, retrieved documents, context windows, tools, latent model policies, candidate distributions, external validators, and human-supplied proxies. The system therefore optimizes under transformed versions of both the world and the objective.

A more explicit pipeline is:

```text
S_world
  -- φ --> O
  -- ψ --> Z
  -- ρ --> C
  -- pθ --> K
  -- A --> Y
  -- Ũ --> evaluation / selection
```

where:

- `φ` is the observation or sensing function.
- `O` is the observed data available to the system.
- `ψ` is the representation function: encoding, tokenization, retrieval, compression, schema extraction, prompt construction, or tool-result formatting.
- `Z` is the model-accessible, operational representation.
- `ρ` is the capability-routing function: it decides which learned strategy, role, behavior, tool, audit pattern, or reasoning mode becomes active.
- `C` is the set of activated capabilities or strategies.
- `pθ` is the model/system policy over candidate continuations, reasoning traces, plans, or artifacts.
- `K` is the reachable candidate space under the current budget and search operators.
- `A` is the aggregation or composition procedure that turns local decisions, tokens, clauses, steps, or modules into a global artifact.
- `Y` is the produced output or action sequence.
- `Ũ` is the accessible evaluator, prompt criterion, reward proxy, rubric, benchmark metric, human preference signal, or verifier.
- `U` is the true task utility.

The problem of value preservation is the problem of maintaining the information, distinctions, constraints, and objective structure relevant to `U` across this pipeline. LLM mediocrity occurs when the system preserves enough structure to produce plausible local artifacts but loses enough structure to miss high task value.

---

## 3. Six Primitive Mismatches as Pipeline-Station Failures

The six primitive mismatches are derived by asking where task value can be structurally lost or distorted in the pipeline.

### 3.1 Observation-Representation Mismatch

Observation-representation mismatch occurs when task-relevant variables in the world are lost, compressed, aliased, omitted, or made operationally inaccessible before they enter the system's working representation.

Formally, let `V*` be a set of variables in `S_world` that are necessary for high utility. Let:

```text
Z = ψ(φ(S_world))
```

Observation-representation mismatch exists when there are two world states `S1` and `S2` such that:

```text
U*(S1) ≠ U*(S2)
but
ψ(φ(S1)) ≈ ψ(φ(S2))
```

for the purposes of the policy or control procedure. The system has collapsed two value-distinct situations into the same operational representation.

This mismatch is upstream of reasoning. It cannot be reliably repaired by asking the model to think longer over the same representation. If the decisive variable is absent from `Z`, longer reasoning only elaborates an impoverished projection of the task.

Typical repair targets include:

```text
channel repair
measurement
tool access
raw-log inspection
schema extraction
value sampling
database queries
sensor introduction
structured representation
context reconstruction
```

The governing rule is:

```text
Before governing knowledge, verify that the variables to be governed have entered the representation.
```

### 3.2 State Mismatch

State mismatch occurs when utility depends on a latent state that is not identifiable under the current observation channel or representation.

Observation-representation mismatch asks whether the necessary variables enter the representation. State mismatch asks whether, given the representation, the system can infer which state it is in.

Let `H` be a latent state space and let the correct policy depend on `h ∈ H`. State mismatch exists when:

```text
P(h | Z) is ambiguous or misranked
```

and the utility of candidate actions differs sharply across possible states:

```text
argmax_a U(a | h1) ≠ argmax_a U(a | h2)
```

This mismatch is common in dialogue, planning, diagnosis, user modeling, market interpretation, code debugging, long-horizon agents, and dynamic environments. A system may see the same surface text under multiple hidden regimes and choose a policy that is locally plausible but state-inappropriate.

Repair targets include:

```text
state enumeration
state discriminator construction
active clarification
branching policies
state-conditioned rubrics
state transition tracking
uncertainty-preserving outputs
```

### 3.3 Fitting-Boundary Mismatch

Fitting-boundary mismatch occurs when a learned capability, strategy, audit structure, role, or behavior is triggered outside its true domain of application or suppressed inside it.

Let `X` be a capability. Let:

```text
T_X = true domain where X should apply
M_X = model/system domain where X is actually activated
```

Fitting-boundary mismatch exists when:

```text
M_X ≠ T_X
```

It has two basic forms:

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

The model may have the relevant capability, but the implicit router activates it under the wrong evidence. This is not identical to lacking knowledge, lacking support, or having an ambiguous objective. It is a routing failure.

Examples include:

- expert-sounding caution triggered where decisive action is needed;
- generic safety refusal triggered where harmless assistance is appropriate;
- template-based reasoning triggered in a task requiring schema inspection;
- surface analogy triggered where mechanism-level analysis is required;
- benchmark-style solution patterns triggered outside their support;
- genuine audit, tool use, state branching, or counterexample search failing to trigger when needed.

Repair targets include:

```text
capability inventory
trigger evidence audit
boundary perturbation
router correction
activation / suppression rules
role-binding constraints
capability applicability tests
```

### 3.4 Support Mismatch

Support mismatch occurs when high-value structures occupy low-probability or low-reachability regions under the system's policy, search procedure, and budget.

Let `K_B` be the set of candidates reachable under budget `B`, and let `Y*` be a high-value output region. Support mismatch exists when:

```text
Pθ(Y* | Z, B) is low
```

or when the search procedure cannot distinguish rare high-value structures from rare noise using probability alone.

Support mismatch is not merely lack of diversity. The system may sample many outputs and still fail if the relevant structure has insufficient probability mass, is pruned early, or is indistinguishable from low-value tail events. More sampling can help only if the high-value region is reachable and recognizable.

Repair targets include:

```text
control-space search
candidate expansion
constraint-guided generation
retrieval or tool augmentation
low-support hypothesis generation
search over intermediate structures
explicit enumeration of rare patterns
```

### 3.5 Aggregation Mismatch

Aggregation mismatch occurs when local improvements do not compose into global value.

This is the narrow home of **autoregressive mediocrity**. Autoregressive generation proceeds through locally plausible continuations. In many tasks, local plausibility is useful. But when global value depends on nonlocal dependencies, exact coordination, delayed commitments, long-range consistency, or structural invariants, local goodness can be insufficient or actively misleading.

Let `Y` be composed of parts:

```text
Y = A(y1, y2, ..., yn)
```

Aggregation mismatch exists when:

```text
∀i, local_value(yi) is high
but
U(A(y1, ..., yn)) is low
```

or when local edits monotonically improve apparent quality while moving the artifact away from the global optimum.

Repair targets include:

```text
intermediate structure
outline-first generation
dependency graphs
constraint propagation
global validators
composition rules
nonlocal consistency checks
```

### 3.6 Specification Mismatch

Specification mismatch occurs when the accessible objective, prompt, rubric, metric, evaluator, or proxy diverges from the true task utility.

Let `Ũ` be the accessible evaluation function and `U` the true utility. Specification mismatch exists when:

```text
rank_Ũ(Y1, Y2) ≠ rank_U(Y1, Y2)
```

for task-relevant candidate pairs.

Specification mismatch is especially common in open-ended tasks where success criteria are tacit, evolving, expert-dependent, or revealed only through inspection of candidate failures. The user may not know the full specification at the start. The system may therefore need to infer, revise, and govern the specification through counterexamples and audit findings.

Repair targets include:

```text
rubric induction
success-condition extraction
counterexample-driven specification repair
preference elicitation
proxy-risk audit
scope limitation
revocation conditions
```

---

## 4. Relative Completeness and Independence

The six mismatches are not claimed to be an absolute ontology of all possible computational failures. They are claimed to be complete relative to the value-preservation pipeline.

### 4.1 Relative Completeness

Under the pipeline abstraction, task value can fail to be preserved in six structurally distinct ways:

1. The decisive world variable may fail to enter the representation.
2. The relevant latent state may be unidentifiable from the representation.
3. The right capability may fail to activate, or the wrong one may activate.
4. The high-value structure may have insufficient support under the policy and budget.
5. Local decisions may fail to compose into global value.
6. The accessible evaluator may not represent true utility.

Any system failure that affects task value must either occur at one of these stations or arise from an interaction among them. This yields a relative completeness thesis:

> For LLM systems modeled as world-observation-representation-routing-support-aggregation-evaluation pipelines, the six primitive mismatches and their compound interactions exhaust the primitive stations at which task value can be structurally lost.

This is a deliberately bounded claim. It does not assert that every surface error is easy to classify. It does not assert that every failure has a single cause. It does not deny implementation bugs, resource failures, or adversarial interference. It says that when the question is how task value is lost in an LLM-mediated pipeline, these are the primitive value-preservation stations.

This completeness claim is feed-forward. It concerns a single forward value-preservation pass from `S_world` to output and accessible evaluation. Closed-loop dynamics across turns, oscillation, retry policies, and state accumulation are governed at runtime by SGAR and are not exhausted by the six stations alone.

### 4.2 Independence

The six mismatches are independent in the following operational sense:

> A mismatch is primitive if one can construct a minimal pair in which that station is perturbed while the remaining stations are held fixed, and the perturbation changes task value in a way that requires a distinct repair target.

Equivalently, a proposed subdivision does not become a new primitive mismatch if its subcases remain at the same pipeline station and share the same effective repair target. A new primitive requires an irreducible intervention distinction, not merely a finer description.

For example:

- Observation-representation can be perturbed by removing a decisive database column from the prompt while keeping the objective, state, policy, and aggregation procedure unchanged.
- State can be perturbed by making two latent regimes observationally ambiguous while preserving the same variables and task objective.
- Fitting-boundary can be perturbed by changing trigger evidence so that the same capability is activated in the wrong domain.
- Support can be perturbed by lowering the probability or reachability of the correct structure without changing its utility or the evaluator.
- Aggregation can be perturbed by preserving local part quality while changing global composition dependencies.
- Specification can be perturbed by changing the evaluation proxy while leaving the observation, representation, policy support, and aggregation intact.

Each perturbation produces a distinct repair target. This gives the taxonomy practical force. It is not merely a labeling scheme; it is an intervention map.

---

## 5. Regimes of Probability-Value Coupling

The same LLM can be mediocre, locally aligned, or extraordinary depending on the task, representation, state, support, aggregation structure, specification, and budget. These are not fixed model traits. They are regimes of coupling between model likelihood and task value.

### 5.1 LLM Mediocrity

LLM mediocrity occurs when the system remains concentrated in plausible but suboptimal regions under the available inference budget. The outputs may be fluent, diverse, and locally defensible. They may improve across rounds. But the improvements do not reach the region where true task value is determined.

This regime appears when one or more primitive mismatches make the high-value region hard to observe, identify, route to, sample, compose, or evaluate.

### 5.2 Local Alignment

Local alignment occurs when model tendencies are genuinely useful on parts of the task but insufficient for global success. This is the common regime of human-facing LLM work.

Examples include:

```text
summarizing context
extracting variables
drafting outlines
generating candidate failure modes
rewriting for tone
enumerating edge cases
compressing raw material into structure
```

These operations can be valuable. The failure comes from assuming that success in these local operations implies global task success.

A local-alignment regime has the following structure:

```text
local likelihood direction ≈ local task-value direction
but
global likelihood direction ≠ global task-value direction
```

### 5.3 Positive Probability-Value Alignment

At the positive pole, model probability and task value reinforce each other across the task. This regime may be called **autoregressive extraordinary** or, more neutrally, **positive probability-value alignment**.

In this regime:

```text
local continuation helps global structure
surface fluency supports task value
semantic association exposes useful relations
iteration compounds quality
high-value artifacts are reachable
verification is relatively stable
```

Examples include context compression, register transfer, surface polishing, semantic decompression, taxonomy generation, structured transformation, query formulation, boilerplate synthesis, and many forms of edge-case enumeration.

The design lesson is not to suppress autoregression. The lesson is to reshape tasks so that more of the work appears to the model in positive-alignment form.

---

## 6. Repair-Operator Coupling and Super-Additive Failure

A simple way to model multiple mismatches is as independent bottlenecks. Let each station have a fidelity coefficient:

```text
c_obs, c_state, c_route, c_support, c_agg, c_spec ∈ [0, 1]
```

A crude reachability model would be:

```text
Reachability ≈ ∏ c_i
```

This captures the intuition that multiple weak stations reduce overall success. But it does not explain the stronger phenomenon often seen in LLM systems: several mismatches together can disable the operators that would repair any one of them.

To capture that phenomenon, define repair operators:

```text
R_obs, R_state, R_route, R_support, R_agg, R_spec
```

Each `R_i` is a procedure intended to repair station `i`: channel repair, state discrimination, router correction, support expansion, composition constraint, or specification revision.

The key claim is:

> The marginal effectiveness of `R_i` is often gated by the fidelity of other stations.

Formally:

```text
Effect(R_i) = f_i(c_i; c_j, c_k, ...)
```

and in strong coupling cases:

```text
∂Reachability / ∂R_i → 0 as c_j → 0
```

Examples:

- Specification repair is weak if the decisive variable never entered the representation.
- State repair is weak if the observation channel aliases the relevant states.
- Aggregation repair is weak if the support space never contains the required global structure.
- Support expansion is weak if routing suppresses the capability needed to generate the expanded candidate.
- Routing repair is weak if the specification provides no criterion for when the capability should apply.
- Audit repair is weak if the verifier only sees a proxy objective.

This mechanism explains why compound mismatch is often super-additive. The failure is not merely that several bottlenecks each reduce success. The failure is that one bottleneck can remove the conditions under which another bottleneck can be repaired.

---

## 7. Mediocrity-to-Extraordinary Transformation

The general intervention principle is:

> Preserve the parts of the task that are already locally aligned, and transform high-mismatch parts into lower-mismatch control tasks.

This is **Mediocrity-to-Extraordinary Transformation**.

The transformation does not require abandoning autoregressive generation. It requires changing the form of the task as presented to the model. Instead of asking directly for a high-value final artifact, the system induces intermediate objects that are easier to generate, inspect, revise, and verify.

Examples of intermediate objects include:

```text
compressed context
task model
state matrix
schema subgraph
join path
rubric
success condition
constraint set
failure-mode taxonomy
candidate invariant
dependency graph
routing rule
regression guard
transition contract
```

The final answer is then rendered from governed control objects rather than generated as an ungoverned fluent continuation.

Each primitive mismatch has a corresponding transformation pattern:

| Mismatch | Transformation |
|---|---|
| Observation-representation | Repair the channel; introduce structured variables before reasoning. |
| State | Enumerate and discriminate latent states; branch policies by state. |
| Fitting-boundary | Audit trigger conditions; govern capability activation and suppression. |
| Support | Search control space rather than final output space; expand rare structures deliberately. |
| Aggregation | Generate intermediate structure; enforce composition constraints and global invariants. |
| Specification | Induce, revise, and govern rubrics through counterexamples and failure findings. |

The common pattern is:

```text
High-mismatch final-output task
  → lower-mismatch control objects
  → validation / audit
  → governed rendering
```

---

## 8. Knowledge Governance

Knowledge Governance is an inference-time framework for constructing, validating, storing, weakening, revoking, and reusing task-specific control knowledge.

It begins from a distinction between final rendering and control knowledge. Many LLM failures occur because the system asks the model to produce the final artifact directly, when the more valuable operation would be to construct the control objects from which the final artifact should be rendered.

A **Governed Knowledge Object (GKO)** is a task-specific control object with explicit scope, evidence, strength, and revocation conditions.

A minimal GKO schema is:

```json
{
  "id": "gko.unique_identifier",
  "type": "constraint | invariant | routing_rule | rubric | state_hypothesis | dependency | transformation_rule | diagnostic_test",
  "condition": "When this object applies",
  "assertion": "What the object claims or enforces",
  "strength": "hard | soft | heuristic | provisional",
  "priority": "conflict-resolution priority",
  "evidence": "observations, audits, examples, tool outputs, or derivations",
  "source": "where the object came from",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "conditions under which the object should be weakened or removed",
  "not_supported_claims": "claims this object does not license"
}
```

GKOs are not merely facts. They may function as:

```text
hard constraints
soft preferences
routing rules
state discriminators
rubrics
diagnostic tests
source-prior corrections
rendering controls
transformation rules
```

A basic Knowledge Governance loop is:

```text
1. Construct a task-specific control space.
2. Induce candidate control objects.
3. Validate them against task-relevant evidence.
4. Store them as GKOs with scope and revocation rules.
5. Use them to guide routing, search, audit, and rendering.
6. Monitor failures.
7. Weaken, revise, or revoke GKOs as new evidence arrives.
```

Knowledge Governance is most useful in the local-alignment regime. The model has enough local competence to generate useful control candidates, but the task requires persistent control knowledge that is not reliably preserved by ordinary context continuation.

---

## 9. Audit Engineering

Audit Engineering is the discipline of converting failure signals into governed control changes.

The central asymmetry is:

```text
Excellent generation is often difficult.
Defect identification is often easier.

Complete specification is often difficult.
Counterexample-driven specification repair is often easier.
```

An audit is not merely a score. A score says how good an artifact is. An audit finding says what failed, why it matters, what evidence supports the diagnosis, what control object must change, and what regression guard should prevent recurrence.

A minimal Audit Finding schema is:

```json
{
  "id": "finding.unique_identifier",
  "artifact": "candidate or system output being audited",
  "finding": "localized defect statement",
  "evidence": "specific evidence for the defect",
  "mismatch_type": "observation_representation | state | fitting_boundary | support | aggregation | specification | compound",
  "severity": "low | medium | high | critical",
  "repair_target": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown",
  "repair_layer": "agent | training | hybrid | unknown",
  "control_delta": "proposed change to the governed control space",
  "regression_guard": "test, check, or condition that should fail if the defect recurs",
  "confidence": "confidence in the diagnosis"
}
```

The Audit Engineering loop is:

```text
Candidate artifact
  → audit
  → failure localization
  → control delta
  → GKO / state / verifier update
  → regeneration
  → regression guard
  → defect ledger
```

A regression guard has teeth only if reintroducing a representative defect makes the guard fail. Otherwise it is not a regression test; it is regression theater.

Audit Engineering therefore turns failures into durable system knowledge. It is the write-back mechanism that prevents each failure from being rediscovered as if it were new.

---

## 10. State-Governed Agent Regime

Knowledge Governance governs control knowledge. Audit Engineering governs failure write-back. **State-Governed Agent Regime** governs state authority.

Long-horizon LLM systems cannot rely on context narrative as the source of truth. A context window can describe progress, summarize plans, simulate memory, or claim completion. But description is not commitment. A system has made progress only when a valid transition has occurred in hard state.

The basic transition contract is:

```text
S + A → O → V → S'
```

where:

- `S` is the current committed state.
- `A` is a proposed action.
- `O` is the observed outcome.
- `V` is the verifier or commitment criterion.
- `S'` is the next committed state.

An action should not update the system's authoritative state merely because the LLM says it succeeded. It should update state only when the observation and verifier satisfy the transition contract.

SGAR is not a seventh primitive mismatch. It is a runtime regime for systems whose tasks persist across time, tools, files, agents, revisions, failures, and recoveries.

It prevents common long-horizon failures:

```text
false completion
state drift
state oscillation
performative action
memory contamination
unrecoverable intermediate failure
context-level progress illusion
role confusion
```

In a governed system, audit findings, GKO updates, revocations, verifier results, escalations, and tool outputs should become state transitions when they satisfy explicit commitment rules.

---

## 11. A Unified Object Model

Knowledge Governance, Audit Engineering, and SGAR can be unified as one object system.

The central objects are:

| Object | Function |
|---|---|
| GKO | Stores governed control knowledge. |
| GEO (Governed Escalation Object) | Stores governed execution or collaboration objects. |
| Audit Finding | Localizes a failure and its evidence. |
| Control Delta | Specifies how the control space should change. |
| Regression Guard | Prevents recurrence of a failure family. |
| Defect Ledger | Records defect families, fixes, regressions, and revocations. |
| State Record | Represents the current committed system state. |
| Transition Contract | Defines when an action becomes a committed state transition. |
| Revocation Rule | Defines when an object should be weakened, revised, or removed. |

The object flow is:

```text
Candidate Artifact
  → Audit Finding
  → Control Delta
  → GKO / GEO / Verifier / State Update
  → Regression Guard
  → Defect Ledger
  → Hard State Commitment
  → Future Routing / Search / Rendering / Revocation
```

This object flow makes the system cumulative. A failure does not merely produce another prompt. It updates the governed structure of the system.

---

## 12. Text-to-SQL as a Flagship Instantiation

Text-to-SQL is a natural instantiation of the theory because it exposes nearly every pipeline station.

A direct prompt-to-SQL approach asks the model to generate the final artifact in one step:

```text
question + schema → SQL
```

This is a high-mismatch formulation. The system must preserve schema structure, infer question intent, identify tables and columns, ground values, choose join paths, construct predicates, handle aggregation, respect database content, and produce executable syntax. Local plausibility is not enough. A SQL query can look reasonable while being globally wrong.

A governed formulation changes the control space:

```text
question + database
  → schema representation
  → task-critical variable extraction
  → schema subgraph
  → column / value binding
  → join-path candidates
  → predicate skeleton
  → SQL rendering
  → execution audit
  → repair delta
```

Each primitive mismatch has a clear role:

| Mismatch | Text-to-SQL manifestation |
|---|---|
| Observation-representation | Relevant schema, foreign keys, sample values, or database content fail to enter the operational representation. |
| State | The query depends on database contents, implicit value distributions, or latent intent not identifiable from surface question alone. |
| Fitting-boundary | The model over-triggers template SQL generation and under-triggers schema audit, value grounding, or join search. |
| Support | Rare join patterns, nested queries, or implicit aggregation structures are low-support under direct generation. |
| Aggregation | SELECT, JOIN, WHERE, GROUP BY, HAVING, and ORDER BY clauses may be locally plausible but globally inconsistent. |
| Specification | Natural language intent, execution accuracy, semantic correctness, and benchmark metric may diverge. |

Execution feedback provides an unusually strong audit authority. The model may propose, explain, or repair, but execution results and semantic checks have higher authority than fluent confidence. A failure should be converted into a localized control delta:

```text
wrong join path → update join-path constraint
wrong value grounding → update value-normalization GKO
empty result set → inspect predicate overconstraint
ambiguous column → add schema-linking discriminator
wrong aggregation → revise predicate / grouping skeleton
```

The theoretical point is not that text-to-SQL needs more prompting. The point is that direct SQL generation is transformed into governed control-space search. The final SQL is rendered from audited intermediate objects.

---

## 13. Relation to Existing Formal Traditions

This theory is not intended to replace older formal traditions. It reuses several structural ideas while adapting them to open-ended LLM systems.

### 13.1 CEGIS and Audit Engineering

Counterexample-guided inductive synthesis constructs candidates, finds counterexamples, and refines the candidate space. Audit Engineering has a similar loop, but the setting differs. In open-ended LLM tasks, the specification itself may be incomplete, tacit, or revised through failures. The audit does not merely find a counterexample to a fixed formal spec. It may also repair the spec, the representation, the router, the support search, or the control objects.

### 13.2 Mutation Testing and Teeth-Proven Guards

Mutation testing asks whether tests detect injected defects. Teeth-proven regression guards apply the same principle to governed LLM systems: a guard is meaningful only if a representative recurrence of the defect makes it fail.

### 13.3 Belief Revision and GKO Revocation

AGM-style belief revision and truth-maintenance systems study how beliefs are justified, revised, and retracted. GKOs apply similar principles to task-specific control knowledge. A GKO should not be an immortal prompt instruction. It should have support scope, evidence, priority, lifespan, and revocation triggers.

### 13.4 POMDPs, Active Perception, and State Mismatch

State mismatch is related to partial observability. The system must often choose whether to act under uncertainty, branch policies, ask clarifying questions, query tools, or acquire additional observations. Observation-representation mismatch adds an upstream issue: the system may not merely be uncertain over states; the decisive variables may never have entered the representation.

### 13.5 Event Sourcing, Transactions, and SGAR

SGAR resembles event sourcing and transaction logs in that actions become durable only when committed through explicit transition rules. The difference is that LLM agents operate over heterogeneous tasks, tools, documents, memories, audits, and human collaborations. The core idea is the same: state authority should be externalized and replayable, not inferred from narrative context.

### 13.6 Goodhart, Mechanism Design, and Specification Mismatch

Specification mismatch is related to proxy optimization and Goodhart effects. The accessible evaluator can become a poor proxy for true utility. In LLM systems, this problem is amplified because prompts, rubrics, reward models, human preferences, and benchmark metrics may all compress only partial task value.

---

## 14. When Governance Is Not Needed

A strong theory should specify its own limits. Knowledge Governance, Audit Engineering, and SGAR are not universally necessary.

Governance is warranted when:

```text
expected value gain from governance
  >
governance cost + governance-induced risk
```

More explicitly:

```text
P(failure without governance)
× value at stake
× expected reachability gain
>
token cost + latency cost + human review cost + implementation cost + governance-induced error risk
```

Governance is usually useful when:

```text
task value is high
failure is hard to locally detect
local improvements do not compose reliably
state persists across time
control knowledge can be reused
mistakes are expensive
specification is tacit or evolving
external verification exists but must be integrated
```

Governance may be unnecessary or harmful when:

```text
the task is low-risk and one-shot
local quality strongly predicts global quality
the specification is simple and explicit
ordinary retrieval supplies the missing facts
a complete verifier already exists
the task lies in a positive probability-value alignment regime
governance adds latency, conflict, overfitting, or brittle meta-rules
```

This boundary is essential. The theory is not a mandate for heavy architecture. It is a decision framework for when heavier governance is justified.

---

## 15. Self-Audit of the Theory

The theory should apply its own governance principles to itself.

The central claim can be represented as a GKO:

```json
{
  "id": "gko.six_primitive_mismatches",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as world-observation-representation-routing-support-aggregation-evaluation pipelines",
  "assertion": "Task-value failures can be decomposed into observation-representation, state, fitting-boundary, support, aggregation, and specification mismatches, plus compound interactions.",
  "strength": "structural-relative",
  "support_scope": "Value-preservation failures under the specified pipeline abstraction",
  "revocation_trigger": "Identification of a structurally distinct pipeline station that produces irreducible task-value failures not captured by the six categories",
  "not_supported_claims": "Does not claim absolute completeness over all computational systems; does not claim every empirical failure has a single mismatch cause."
}
```

Each primitive mismatch should have similar support scope and revocation triggers.

For example:

```json
{
  "id": "gko.observation_representation_mismatch",
  "type": "primitive_mismatch_claim",
  "condition": "Task-critical world variables must pass through observation and representation functions before model control is possible.",
  "assertion": "If value-relevant variables are lost, aliased, or made inaccessible before entering Z, downstream reasoning cannot reliably recover them.",
  "revocation_trigger": "Show that all such failures can be reduced to state, support, aggregation, specification, or routing failures without losing intervention specificity."
}
```

This self-audit matters because it makes the theory falsifiable in principle. It states where the theory applies, what it does not claim, and what would require revision.

---

## 16. Conclusion

High-value LLM systems fail not only because models generate imperfect text, but because task value is difficult to preserve across a multi-stage pipeline. The decisive variable may not enter the representation. The latent state may remain unidentified. The correct capability may not activate. The high-value structure may have low support. Local improvements may fail to compose. The accessible evaluator may optimize the wrong proxy.

This paper has argued that these are not merely surface errors. They are six primitive mismatch types corresponding to structurally distinct stations in the world-to-output pipeline. Under this abstraction, they provide a relatively complete and operationally independent map of value-preservation failure.

The theory also explains why compound failures are often super-additive. Repair operators are coupled. A failure at one station can disable the conditions required to repair another. Therefore, simply adding more output-space search, more critique, or more self-reflection may improve local quality while leaving the decisive mismatch untouched.

The constructive response is to transform the task. Preserve the parts where the model is locally aligned or positively aligned, and convert high-mismatch components into governed control objects. Knowledge Governance stores and revises these objects. Audit Engineering writes failures back into the control space. SGAR commits verified progress into hard state. Together, they describe a system architecture for turning local model competence into durable, auditable, and stateful task performance.

The central problem of advanced LLM systems is therefore not generation alone. It is the governance of task value across observation, representation, routing, support, aggregation, specification, audit, and state transition.

---

## Appendix A: Compact Terminology

| Term | Definition |
|---|---|
| LLM mediocrity | Budgeted concentration in plausible but suboptimal output regions. |
| Autoregressive mediocrity | Aggregation-driven subcase where local continuations fail to compose into global value. |
| Local alignment | Regime where model likelihood and task value align locally but not globally. |
| Positive probability-value alignment | Regime where model tendencies reinforce task value across the relevant structure. |
| Mediocrity-to-Extraordinary Transformation | Reparameterizing high-mismatch tasks into lower-mismatch, positively aligned control tasks. |
| Knowledge Governance | Framework for inducing, validating, storing, revising, and revoking task-specific control knowledge. |
| GKO | Governed Knowledge Object with scope, evidence, priority, lifespan, and revocation triggers. |
| Audit Engineering | Discipline of converting failure findings into control deltas and regression guards. |
| SGAR | Runtime regime in which progress is committed through hard-state transition contracts. |
| Control Delta | A localized change to the control space induced by an audit finding. |
| Regression Guard | A test or check that prevents recurrence of a defect family. |
| Revocation Trigger | A condition under which a governed object should be weakened, revised, or removed. |
