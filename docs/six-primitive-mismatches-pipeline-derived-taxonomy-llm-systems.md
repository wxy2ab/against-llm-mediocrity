# Six Primitive Mismatches in LLM Systems

## A Pipeline-Derived Taxonomy of Value-Preservation Failure

**Working Draft v0.1**

---

## Abstract

This document consolidates the six primitive mismatches in governed LLM systems into a single pipeline-derived taxonomy. Its purpose is not to add another list of failure modes. Rather, it shows why these six mismatches are structurally basic under a value-preservation view of LLM systems.

The central abstraction is a world-to-output pipeline:

```text
S_world
  -> O
  -> Z
  -> capability routing
  -> candidate support
  -> aggregation
  -> evaluation
```

A high-value LLM system must preserve task-relevant value structure across this pipeline. Failures arise when:

- decisive variables do not enter the representation,
- latent states are not identifiable,
- capabilities are routed to the wrong domains,
- high-value structures are unreachable under the system policy,
- locally plausible components fail to compose, or
- the accessible objective diverges from true task utility.

These correspond to six primitive mismatches:

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

The document advances two structural claims. First, the taxonomy is relatively complete under the pipeline abstraction: any task-value failure in an LLM system modeled as this pipeline must occur at one or more of these stations or through their interactions.

Second, the six mismatches are operationally independent: each can be perturbed while holding the others fixed, and each requires a distinct class of repair.

The document also explains how primitive mismatches combine into compound failures. The strongest compound failures are not merely additive. They are often super-additive because repair operators are coupled across pipeline stations.

A failure at one station can disable the information, distinction, candidate, capability, composition rule, or objective criterion needed to repair another.

Finally, the document provides a diagnostic and governance interface. Each mismatch is mapped to its core question, formal signature, typical symptoms, audit findings, control deltas, governed knowledge objects, regression guards, and state-governed commitments.

The result is a unified bridge between the structural theory, the object model, Audit Engineering, Knowledge Governance, and State-Governed Agent Regime.

---

## 1. Purpose of This Document

This document occupies a specific position in the governed LLM theory stack.

The main theory document states the broad thesis: high-value LLM systems are not merely generation systems; they are value-preservation systems. Task value must survive observation, representation, routing, support, aggregation, evaluation, audit, and state transition.

The object specification defines the object layer: Governed Knowledge Object (GKO), Governed Execution Object (GExO), Audit Finding, Control Delta, Regression Guard, Defect Ledger, State Record, Transition Contract, and Revocation Rule.

The Audit Engineering document defines how failures are localized and written back into the control space.

The State-Governed Agent Regime (SGAR) document defines hard-state authority and runtime commitment.

The individual mismatch documents expand each primitive mismatch in detail.

This document does something different. It explains why the six mismatches belong together as a single structural taxonomy. It gives the derivation, the independence argument, the relative completeness argument, the compound-interaction model, and the practical diagnostic workflow.

In short:

```text
Main theory:        Why value preservation is the core problem.
Object model:       What governed system objects look like.
Audit Engineering:  How failures become control-space updates.
SGAR:               How progress becomes hard-state commitment.
Mismatch reports:   How each mismatch works in detail.
This document:      Why the six mismatches are the primitive stations of failure.
```

The intended use of this document is threefold:

1. As a conceptual bridge for readers who need a single map of the six primitive mismatches.
2. As a formalization layer for the claim that the taxonomy is not arbitrary.
3. As a diagnostic manual for deciding which repair target a given LLM system failure requires.

---

## 2. The Value-Preservation Pipeline

An LLM system does not act directly on the world or directly optimize true utility. It operates through a sequence of transformations.

A generic high-level pipeline is:

```text
S_world
  --phi--> O
  --psi--> Z
  --rho--> C
  --p_theta, B--> K
  --A--> Y
  --U_hat--> evaluation / selection
```

Where:

```text
S_world = underlying world state, environment, database, codebase, user need, task situation
phi     = observation, sensing, logging, retrieval, input acquisition
O       = observed data available to the system
psi     = representation function: encoding, compression, tokenization, schema extraction, prompt construction
Z       = model-accessible operational representation
rho     = routing function that activates capabilities, roles, tools, or strategies
C       = activated capabilities / strategies / tools / behavioral modes
p_theta = model or system policy over continuations, candidates, plans, or actions
B       = inference budget and search procedure
K       = reachable candidate set under p_theta and B
A       = aggregation or composition operator
Y       = final artifact or action sequence
U_hat   = accessible objective, rubric, metric, verifier, reward model, preference proxy
U       = true task utility
```

The value-preservation problem is:

```text
Preserve the task-relevant structure of U(S_world, Y)
through every transformation from S_world to evaluated output.
```

Every transformation can preserve, compress, distort, or destroy the structure that matters for true utility. The six primitive mismatches are the six ways value can fail to be preserved at the structural stations of this pipeline.

---

## 3. Why a Pipeline-Derived Taxonomy Is Needed

A taxonomy of LLM failures can easily become a list of examples:

```text
hallucination
bad reasoning
wrong tool use
bad prompt following
weak planning
poor verification
schema linking error
state drift
objective hacking
```

Such lists are useful operationally, but they do not explain which failures are primitive and which are derivative. They also do not explain which repair target is appropriate.

For example, a wrong text-to-SQL answer may be described as:

```text
bad reasoning
schema linking failure
wrong join
hallucinated column
execution error
lack of planning
```

But these descriptions may point to different structural causes:

```text
The relevant column was absent from representation.          -> observation-representation mismatch
The question intent depended on an ambiguous latent state.   -> state mismatch
The model used template SQL when schema audit was needed.    -> fitting-boundary mismatch
The correct join path was low-support under direct decoding. -> support mismatch
The clauses were locally plausible but globally inconsistent.-> aggregation mismatch
The metric rewarded executable SQL but not semantic intent.   -> specification mismatch
```

A structural taxonomy must answer four questions:

1. Where in the system pipeline did value get lost?
2. Is the failure primitive or a consequence of another failure?
3. What kind of repair operator can address it?
4. Which governance object should store the repair?

The pipeline-derived taxonomy answers these questions by assigning each primitive mismatch to a structurally distinct station.

---

## 4. The Six Primitive Mismatches at a Glance

| Pipeline station | Primitive mismatch | Core question | Primary repair target |
|---|---|---|---|
| `S_world -> O -> Z` | Observation-representation mismatch | Did the decisive variable enter the operational representation? | Channel / representation repair |
| `Z -> latent state` | State mismatch | Given the representation, do we know which state we are in? | State discrimination / branching |
| `Z -> C` | Fitting-boundary mismatch | Are the right capabilities activated in the right domains? | Router governance |
| `p_theta, B -> K` | Support mismatch | Can the high-value structure become a live candidate? | Control-space search |
| `K -> Y` | Aggregation mismatch | Do locally good parts compose into global value? | Composition governance |
| `Y -> U_hat vs U` | Specification mismatch | Does the accessible objective represent true utility? | Objective governance |

The order is not merely expository. It reflects the dependency structure of the pipeline. Failures upstream often constrain what can be repaired downstream. If a variable never enters representation, a downstream evaluator may never see what it needs. If the state is unidentified, the system may route to the wrong capability. If the right capability does not activate, support expansion may search the wrong space. If high-value candidates never appear, aggregation and evaluation can only select among deficient artifacts. If the proxy objective is wrong, all earlier work may be optimized toward the wrong target.

---

## 5. Admission Criteria for a Primitive Mismatch

A failure type qualifies as primitive in this framework only if it satisfies three criteria.

### 5.1 Structural Station Criterion

The failure must correspond to a distinct station in the value-preservation pipeline.

It is not enough for a failure to be common or important. It must identify a unique location where task value can be structurally lost.

### 5.2 Intervention Specificity Criterion

The failure must require a repair target that cannot be replaced by the repair target of another primitive mismatch without loss.

For example, if a decisive variable is missing from the representation, support expansion cannot repair it. The system must repair the channel or representation. Similarly, if the objective proxy is wrong, generating more candidates cannot reliably repair it. The system must repair the specification.

### 5.3 Minimal Pair Criterion

The failure must admit a minimal pair: a pair of systems or task instances that differ primarily at that station while other stations are held fixed, and where the perturbation changes task value.

### 5.4 Irreducibility / Atomicity Criterion

A proposed refinement does not count as a new primitive mismatch merely because it is descriptively useful.

```text
If two subcases occupy the same pipeline station
and share the same effective repair target,
then the split is not primitive.
```

A new primitive mismatch requires both:

```text
1. a structurally distinct station in the value-preservation pipeline, and
2. an irreducibly distinct repair target under controlled perturbation.
```

This is why the count stops at six. Each station may have many subtypes, but a subtype becomes primitive only if it creates a new intervention-distinguishable station rather than a finer description of the same one.

This criterion makes independence operational. The taxonomy is not merely semantic; it is tied to possible counterfactual interventions.

---

## 6. Primitive Mismatch 1: Observation-Representation Mismatch

### 6.1 Definition

Observation-representation mismatch occurs when task-decisive variables in the world fail to enter the system's operational representation.

The system may observe the world through logs, documents, retrieved passages, database schemas, user messages, tool outputs, screenshots, sensors, or prompt context. Those observations are then compressed, encoded, tokenized, summarized, filtered, and formatted. At either stage, a variable required for high task value may be omitted, aliased, distorted, or made inaccessible.

### 6.2 Formal Signature

Let:

```text
Z = psi(phi(S_world))
```

Let `V*` be a set of task-critical variables. Observation-representation mismatch exists when there are two world states `S1` and `S2` such that:

```text
U*(S1) != U*(S2)
```

but:

```text
psi(phi(S1)) ~= psi(phi(S2))
```

from the perspective of the system's policy, evaluator, or control procedure.

The decisive distinction exists in the world, but it has been erased or made unavailable in the representation.

### 6.3 Diagnostic Question

```text
Did the variables that determine task success actually enter the operational representation Z?
```

If the answer is no, downstream reasoning, reflection, reranking, and audit operate on a defective projection.

### 6.4 Typical Symptoms

```text
The model reasons fluently from incomplete inputs.
The same answer is produced despite hidden changes in decisive variables.
Failures disappear when raw logs, database values, screenshots, or schema details are supplied.
The system cannot mention the actual variable that explains the error.
Extra reasoning over the same context does not improve the result.
The system over-relies on semantic priors where measurement is required.
```

### 6.5 Primary Repair Target

```text
channel repair
representation repair
measurement
raw-data access
tool access
schema extraction
value sampling
context reconstruction
structured variable introduction
```

### 6.6 Governance Template

A channel governance object should record:

```json
{
  "type": "observation_channel_rule",
  "condition": "Task requires variable V before reasoning is reliable.",
  "assertion": "V must be observed and represented in field F before downstream generation.",
  "evidence": "Prior failures occurred when V was absent or aliased.",
  "revocation_trigger": "A new representation is introduced that preserves V by construction."
}
```

### 6.7 Boundary with State Mismatch

Observation-representation mismatch concerns variable entry.

State mismatch concerns state inference after representation exists.

In short:

```text
Observation-representation mismatch: Is the decisive variable in Z?
State mismatch: Given Z, which latent state are we in?
```

---

## 7. Primitive Mismatch 2: State Mismatch

### 7.1 Definition

State mismatch occurs when the correct policy, interpretation, or evaluation depends on a latent state that is not identifiable from the current representation.

The system may have relevant variables in context but still not know which regime it is operating in. The same observed features may support multiple hidden states with different optimal actions.

### 7.2 Formal Signature

Let `H` be a latent state space. Let the correct action depend on `h in H`.

State mismatch exists when:

```text
P(h | Z) is ambiguous, unstable, or misranked
```

and:

```text
argmax_a U(a | h1) != argmax_a U(a | h2)
```

for plausible states `h1` and `h2`.

### 7.3 Diagnostic Question

```text
Given the available representation, do we know which latent state or regime the task is in?
```

### 7.4 Typical Symptoms

```text
The answer is reasonable under one hidden interpretation but wrong under another.
The model commits to a state assumption without tracking alternatives.
Small clarifying information flips the correct policy.
The same surface request requires different behavior in different contexts.
The system fails in multi-turn settings due to outdated or uncommitted state.
```

### 7.5 Primary Repair Target

```text
state enumeration
state hypothesis tracking
state discriminator construction
clarification questions
branching policies
state-conditioned validators
belief-state update
hard-state records
```

### 7.6 Governance Template

```json
{
  "type": "state_hypothesis",
  "condition": "Task outcome depends on latent state H.",
  "assertion": "Maintain competing state hypotheses until discriminating evidence is available.",
  "evidence": "Candidate actions differ across plausible states.",
  "revocation_trigger": "Verifier commits one state and rejects alternatives."
}
```

### 7.7 Boundary with Specification Mismatch

State mismatch is about which situation we are in.

Specification mismatch is about what counts as good.

A task can have a clear objective but ambiguous state. It can also have a clear state but ambiguous objective.

---

## 8. Primitive Mismatch 3: Fitting-Boundary Mismatch

### 8.1 Definition

Fitting-boundary mismatch occurs when a learned capability, strategy, role, or behavioral pattern is activated outside its true domain of applicability or suppressed inside it.

The model may possess the relevant capability. The problem is that the system routes to it incorrectly.

### 8.2 Formal Signature

Let `X` be a capability.

```text
T_X = true domain where X should apply
M_X = model/system domain where X is actually activated
```

Fitting-boundary mismatch exists when:

```text
M_X != T_X
```

with two basic forms:

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

### 8.3 Diagnostic Question

```text
Is the right capability being activated under the right conditions?
```

### 8.4 Typical Symptoms

```text
The model can perform the needed operation when asked explicitly, but does not invoke it spontaneously.
The system uses a familiar template where a different procedure is required.
Expert-sounding behavior appears in the wrong setting.
A safety, caution, planning, or audit pattern overfires.
Tool use, schema audit, state branching, or counterexample search underfires.
The failure is repaired by changing trigger conditions rather than adding facts. 
```

### 8.5 Primary Repair Target

```text
capability inventory
trigger condition audit
router rule construction
activation and suppression constraints
boundary perturbation
role-binding correction
capability applicability tests
```

### 8.6 Governance Template

```json
{
  "type": "routing_rule",
  "condition": "Evidence pattern E indicates capability X is appropriate.",
  "assertion": "Activate X when E holds; suppress Y unless condition F also holds.",
  "evidence": "Prior failures involved under-triggering of X or over-triggering of Y.",
  "revocation_trigger": "Boundary tests show X is no longer predictive of improved task value."
}
```

### 8.7 Boundary with Support Mismatch

Fitting-boundary mismatch asks whether the right capability is activated.

Support mismatch asks whether, after activation, the high-value structure is reachable.

A system can route correctly but still fail to reach rare structures. Conversely, the correct structure may be in the model's support, but the system never activates the capability that would search for it.

---

## 9. Primitive Mismatch 4: Support Mismatch

### 9.1 Definition

Support mismatch occurs when high-value structures have insufficient probability mass or insufficient reachability under the model policy, system search procedure, and inference budget.

The system may have the right information, state, routing, and objective. It may still fail because the correct structure does not become a live candidate.

### 9.2 Formal Signature

Let `K_B` be the candidate set reachable under budget `B`. Let `Y*` be a high-value region.

Support mismatch exists when:

```text
P_theta(Y* | Z, B) is low
```

or:

```text
Y* not in K_B
```

or:

```text
Y* in K_B but not distinguishable from rare noise under the available selection procedure
```

### 9.3 Diagnostic Question

```text
Can the high-value structure actually become a candidate under the current policy, search space, and budget?
```

### 9.4 Typical Symptoms

```text
Many samples produce variations of the same flawed pattern.
The correct structure appears only when explicitly enumerated or constrained.
The model recognizes a correct answer after seeing it but rarely generates it.
Search increases diversity without reaching the decisive structure.
Rare but valid candidates are pruned as unlikely or odd.
The system improves when searching over intermediate structures rather than final outputs.
```

### 9.5 Primary Repair Target

```text
control-space search
candidate enumeration
constraint-guided decoding
retrieval augmentation
rare-pattern prompting
beam over structures
hypothesis expansion
tool-generated candidates
```

### 9.6 Governance Template

```json
{
  "type": "support_expansion_rule",
  "condition": "High-value structure Y* is low-support under direct generation.",
  "assertion": "Search over control object C before rendering final output.",
  "evidence": "Direct candidates repeatedly omit Y*; explicit enumeration reaches it.",
  "revocation_trigger": "Direct generation reliably includes Y* under the same budget."
}
```

### 9.7 Boundary with Aggregation Mismatch

Support mismatch concerns whether the right candidate components or structures are reachable.

Aggregation mismatch concerns whether reachable components compose into a globally valuable artifact.

---

## 10. Primitive Mismatch 5: Aggregation Mismatch

### 10.1 Definition

Aggregation mismatch occurs when locally plausible, locally correct, or locally valuable components fail to compose into a globally valuable artifact.

This is the precise structural home of autoregressive mediocrity. The problem is not that every local step is bad. The problem is that local value is not compositionally faithful to global value.

### 10.2 Formal Signature

Let:

```text
Y = A(y_1, y_2, ..., y_n)
```

Aggregation mismatch exists when:

```text
local_value(y_i) is high for many or all i
```

but:

```text
U(A(y_1, ..., y_n)) is low
```

or when local edit directions improve apparent quality while reducing global utility.

### 10.3 Diagnostic Question

```text
Do the locally good parts compose into a globally good whole?
```

### 10.4 Typical Symptoms

```text
Every section looks reasonable, but the whole argument fails.
Each SQL clause seems plausible, but the query is semantically wrong.
Each code patch passes local inspection, but the system invariant breaks.
An answer improves in fluency while losing structural correctness.
The model cannot maintain cross-part dependencies.
The final artifact violates constraints that span multiple parts.
```

### 10.5 Primary Repair Target

```text
composition rules
dependency graphs
global invariants
intermediate outlines
constraint propagation
cross-part validators
integration tests
nonlocal consistency checks
```

### 10.6 Governance Template

```json
{
  "type": "composition_invariant",
  "condition": "Artifact parts y_i must jointly satisfy global invariant G.",
  "assertion": "Do not render final Y until G is checked across parts.",
  "evidence": "Prior failures involved locally plausible parts violating G.",
  "revocation_trigger": "A stronger generator or verifier enforces G by construction."
}
```

### 10.7 Boundary with Specification Mismatch

Aggregation mismatch assumes the global objective is known enough to define a composition failure.

Specification mismatch occurs when the objective itself or its proxy is wrong.

---

## 11. Primitive Mismatch 6: Specification Mismatch

### 11.1 Definition

Specification mismatch occurs when the system optimizes, verifies, or selects using an accessible objective that diverges from true task utility.

The system may do exactly what it was asked, rewarded, or scored to do and still fail the real task.

### 11.2 Formal Signature

Let `U_hat` be the accessible proxy and `U` the true utility.

Specification mismatch exists when:

```text
rank_U(Y1, Y2) != rank_U_hat(Y1, Y2)
```

for task-relevant candidates `Y1` and `Y2`.

### 11.3 Diagnostic Question

```text
Are we optimizing the right target?
```

### 11.4 Typical Symptoms

```text
The output satisfies the written prompt but disappoints the real user need.
The benchmark score improves while semantic quality does not.
The system learns to satisfy a rubric without solving the task.
The verifier accepts artifacts that humans reject for substantive reasons.
The model gives safe, polished, or comprehensive answers when the actual utility demands specificity, risk, or action.
Counterexamples reveal missing criteria in the original prompt. 
```

### 11.5 Primary Repair Target

```text
objective clarification
rubric revision
counterexample-driven specification repair
proxy-risk audit
success-condition extraction
human preference elicitation
verifier hierarchy
scope and non-goal declaration
```

### 11.6 Governance Template

```json
{
  "type": "objective_rule",
  "condition": "Accessible proxy U_hat diverges from task utility U in cases C.",
  "assertion": "Revise evaluation criterion to include distinction D and reject proxy-only success.",
  "evidence": "Counterexample Y shows U_hat accepts what U rejects.",
  "revocation_trigger": "New verifier aligns proxy ranking with utility across representative cases."
}
```

### 11.7 Boundary with Audit Failure

A failed audit may reveal specification mismatch, but audit failure is not itself a primitive mismatch. Audit is a repair mechanism. Specification mismatch is the objective-level cause that an audit may uncover.

---

## 12. Differential Diagnosis Table

The following table is the shortest practical diagnostic version of the taxonomy.

| If the failure is that... | Diagnose primarily as... | Ask... | Repair by... |
|---|---|---|---|
| The decisive fact, variable, schema element, log, value, or measurement is absent or compressed away. | Observation-representation | Did the variable enter Z? | Fix channel or representation. |
| The same representation supports multiple hidden regimes with different correct actions. | State | Which state are we in? | Track, discriminate, branch, clarify. |
| The model has the capability but activates it in the wrong conditions. | Fitting-boundary | Is the right capability routed? | Govern trigger boundaries. |
| The correct structure rarely appears as a candidate. | Support | Is the structure reachable? | Search control space; expand candidates. |
| Good local pieces fail as a whole. | Aggregation | Do parts compose? | Govern dependencies and invariants. |
| The system optimizes the wrong metric, rubric, or proxy. | Specification | Is the target right? | Repair objective and verifier. |

A practical rule:

```text
If the answer could not possibly be right because needed information was absent, start with observation-representation.
If the answer could be right in one hidden regime but wrong in another, start with state.
If the needed operation is known but not invoked, start with fitting-boundary.
If the needed structure is never proposed, start with support.
If the pieces are good but the whole is bad, start with aggregation.
If the system succeeds by its criterion but fails the real task, start with specification.
```

---

## 13. Relative Completeness of the Six Mismatches

The taxonomy's completeness claim is relative, not absolute.

It does not claim that every computational failure in every possible system is exhausted by six categories. It claims that under the value-preservation pipeline, all primitive ways of losing task value correspond to these stations.

### 13.1 Completeness Statement

For an LLM system modeled as:

```text
S_world -> O -> Z -> C -> K -> Y -> U_hat
```

with true utility `U`, any failure of value preservation must involve at least one of the following:

1. A value-relevant distinction in `S_world` is not preserved into `Z`.
2. A value-relevant latent state is not identifiable from `Z`.
3. A value-relevant capability is not activated in its true domain or is activated outside it.
4. A value-relevant structure is not reachable or live under the candidate-generation process.
5. Value-relevant relations among candidate parts are not preserved by aggregation.
6. The accessible evaluation criterion does not preserve the ranking induced by true utility.

These are precisely the six primitive mismatches.

### 13.2 Why the Claim Is Bounded

The claim is intentionally bounded by the abstraction. It does not deny:

```text
hardware failures
latency failures
security breaches
bad user behavior
implementation bugs
organizational process failures
```

But when those failures matter because they distort task value in an LLM pipeline, they usually manifest through one or more primitive mismatches. For example, a logging bug may become observation-representation mismatch. A tool timeout may become support mismatch if it prevents candidate generation. A stale cache may become state mismatch if it misrepresents current state.

### 13.3 Why Compound Failures Do Not Refute Completeness

Most real failures are compound. A text-to-SQL failure may involve missing schema values, wrong state assumptions, low-support joins, local clause inconsistency, and benchmark proxy issues. This does not refute the taxonomy. It confirms that primitive failures combine.

The taxonomy is not a requirement that every failure be assigned a single label. It is a decomposition basis.

### 13.4 Forward-Pass Boundary of the Completeness Claim

The completeness claim is feed-forward rather than fully dynamical.

```text
It applies to a single forward pass:
S_world -> O -> Z -> C -> K -> Y -> U_hat
```

Cross-turn feedback, oscillation, retry loops, state accumulation, and commitment dynamics are runtime phenomena. They matter greatly in deployed systems, but they are governed by SGAR and related runtime objects rather than being additional primitive stations in this taxonomy.

---

## 14. Independence of the Six Mismatches

The independence claim is operational:

```text
Each mismatch can be varied while holding the others approximately fixed, and each variation requires a distinct repair target.
```

### 14.1 Observation-Representation Minimal Pair

Two systems have the same model, prompt, search procedure, objective, and aggregation method. One receives a schema with a decisive column and sample values. The other receives a compressed schema that omits them.

If only the first system can solve the task, the failure is not state, support, aggregation, routing, or objective. It is variable entry.

### 14.2 State Minimal Pair

Two systems receive the same variables, but one receives a disambiguating state signal and the other does not. The correct action differs across states.

If ambiguity alone causes failure, the mismatch is state.

### 14.3 Fitting-Boundary Minimal Pair

Two systems possess the same capability and information. In one, trigger evidence activates the needed capability. In the other, a misleading surface cue activates a wrong capability or suppresses the right one.

If changing routing alone repairs the failure, the mismatch is fitting-boundary.

### 14.4 Support Minimal Pair

Two systems share observation, state, routing, objective, and aggregation. One searches only final output space; the other searches an intermediate control space that contains the high-value structure.

If reachability alone changes success, the mismatch is support.

### 14.5 Aggregation Minimal Pair

Two systems have the same information, state, routing, support, and objective. One composes parts with global dependency constraints; the other composes locally.

If local pieces are similar but the constrained composition succeeds, the mismatch is aggregation.

### 14.6 Specification Minimal Pair

Two systems have the same inputs, capabilities, candidate set, and composition procedure. One evaluates under a proxy that accepts candidate `Y1`; the other evaluates under true utility or a better rubric that prefers `Y2`.

If the ranking criterion alone changes selection, the mismatch is specification.

---

## 15. Compound Mismatches

A compound mismatch occurs when multiple primitive mismatches interact in a single failure.

Compound mismatches are the norm in high-value tasks. The taxonomy is useful precisely because it lets us decompose them.

### 15.1 Common Compound Patterns

#### 15.1.1 Observation-Specification Compound

The system lacks the variables needed to evaluate the true objective. As a result, the proxy objective becomes artificially attractive.

Example:

```text
A summarizer lacks access to the user's actual decision context, so it optimizes for generic completeness rather than decision usefulness.
```

Repair requires both channel repair and objective repair.

#### 15.1.2 State-Routing Compound

The system misidentifies the state and therefore routes to the wrong capability.

Example:

```text
A debugging assistant treats a failure as a syntax issue when the latent state is actually a race condition.
```

Repair requires state discrimination before router correction.

#### 15.1.3 Routing-Support Compound

The system could search the right candidate space, but the capability that performs that search never activates.

Example:

```text
A text-to-SQL system uses direct SQL generation instead of join-path enumeration because schema-search capability is under-triggered.
```

Repair requires router governance and support expansion.

#### 15.1.4 Support-Aggregation Compound

The right components appear, but the system lacks a composition mechanism that can combine them correctly.

Example:

```text
A code patch contains the right functions and checks, but places them in a sequence that violates transactional invariants.
```

Repair requires control-space search plus composition invariants.

#### 15.1.5 Aggregation-Specification Compound

The proxy objective scores local sections or subtests but misses global coherence or systemic risk.

Example:

```text
A report scores well section by section but fails to support a coherent decision.
```

Repair requires global objective criteria and composition governance.

#### 15.1.6 Observation-State-Specification Compound

The system lacks decisive variables, cannot identify state, and therefore relies on a generic objective.

Example:

```text
A medical or legal assistant receives an incomplete user narrative, cannot distinguish crucial regimes, and optimizes for generic helpfulness.
```

Repair must begin upstream; objective refinement alone is insufficient.

---

## 16. Repair-Operator Coupling

Primitive mismatches combine strongly because repair operators depend on other stations.

Let each station have a fidelity coefficient:

```text
c_obs, c_state, c_route, c_support, c_agg, c_spec in [0, 1]
```

A simple bottleneck model would say:

```text
Success ~= product_i c_i
```

This model captures compounding weakness but not the strongest phenomenon.

The stronger phenomenon is repair-operator coupling.

Let:

```text
R_obs     = channel / representation repair
R_state   = state discrimination repair
R_route   = routing repair
R_support = support expansion repair
R_agg     = aggregation repair
R_spec    = specification repair
```

The effectiveness of `R_i` may be gated by `c_j`.

```text
Effect(R_i) = f_i(c_i; c_j, c_k, ...)
```

In strong cases:

```text
d Success / d R_i -> 0 as c_j -> 0
```

Examples:

```text
Specification repair is weak when decisive variables are absent from representation.
State repair is weak when observations alias the relevant states.
Routing repair is weak when the objective gives no criterion for capability applicability.
Support repair is weak when the right search capability is not triggered.
Aggregation repair is weak when high-value components never enter the candidate set.
Audit repair is weak when the verifier can only see a proxy objective.
```

This is the structural mechanism behind super-additive failure. Multiple mismatches do not merely add more errors. They can disable the very procedures that would reveal, localize, or repair each other.

---

## 17. Diagnostic Workflow

The following workflow is designed for Audit Engineering and Knowledge Governance.

### 17.1 Step 1: Identify the Value Failure

Start with the concrete failure:

```text
What output or action was produced?
Why was it low-value under the real task?
What would have made it high-value?
```

Do not begin with the model's explanation. Begin with the task-value gap.

### 17.2 Step 2: Ask Whether the Decisive Variable Was Represented

```text
Was the information required to distinguish good from bad present in Z?
```

If no, diagnose observation-representation mismatch first.

### 17.3 Step 3: Ask Whether the Correct State Was Identified

```text
Could the same representation correspond to multiple states requiring different actions?
```

If yes, diagnose state mismatch.

### 17.4 Step 4: Ask Whether the Right Capability Was Activated

```text
Did the system invoke the procedure that a competent designer would have used?
```

If the capability exists but did not trigger, diagnose fitting-boundary mismatch.

### 17.5 Step 5: Ask Whether the Correct Structure Became a Candidate

```text
Was a high-value candidate present in the candidate set?
```

If not, diagnose support mismatch.

### 17.6 Step 6: Ask Whether Local Parts Composed

```text
Were the parts individually plausible but jointly wrong?
```

If yes, diagnose aggregation mismatch.

### 17.7 Step 7: Ask Whether the Objective Was Right

```text
Did the system optimize an accessible proxy that diverged from true utility?
```

If yes, diagnose specification mismatch.

### 17.8 Step 8: Record Compound Structure

Most serious failures will involve more than one mismatch. Record the dependency order:

```text
primary upstream mismatch
secondary downstream mismatch
repair operator disabled by upstream mismatch
required repair sequence
```

A useful audit output is not a single label but a causal repair map.

---

## 18. Mapping Mismatches to Audit Findings

An Audit Finding should name the mismatch type and the repair target.

| Mismatch | Finding pattern | Evidence pattern | Repair target |
|---|---|---|---|
| Observation-representation | Missing or aliased decisive variable | Failure disappears when variable is supplied | Channel / representation |
| State | Wrong latent regime assumed | Alternative state explains failure | State discriminator / branch |
| Fitting-boundary | Wrong capability activated or right one suppressed | Capability works when explicitly requested | Router rule |
| Support | Correct structure absent from candidates | Search variants repeat same flawed pattern | Candidate expansion / control-space search |
| Aggregation | Local components conflict globally | Cross-part invariant violated | Composition rule |
| Specification | Proxy accepts low-utility artifact | Counterexample separates proxy from utility | Rubric / verifier / objective |

A minimal Audit Finding should include:

```json
{
  "finding": "localized defect statement",
  "mismatch_type": "one or more primitive mismatches",
  "evidence": "specific artifact evidence",
  "repair_target": "which system station must change",
  "control_delta": "proposed change",
  "regression_guard": "how recurrence will be detected"
}
```

---

## 19. Mapping Mismatches to Control Deltas

A Control Delta is the write-back unit of governed repair.

| Mismatch | Control Delta Type | Example |
|---|---|---|
| Observation-representation | Add required variable, channel, field, retrieval query, tool call, schema element | Require sample values before SQL predicate generation |
| State | Add state hypothesis, discriminator, clarification branch, belief update | Track whether user wants exploration or final answer |
| Fitting-boundary | Add routing trigger, suppression rule, capability applicability test | Activate join-path search when question references multiple entities |
| Support | Add candidate enumeration, control-space search, low-support expansion | Enumerate schema subgraphs before SQL rendering |
| Aggregation | Add invariant, dependency graph, integration check | Verify all report claims support the final recommendation |
| Specification | Add or revise rubric, verifier, success condition, proxy limitation | Reject answers that satisfy format but not decision usefulness |

The key discipline:

```text
Do not write back a prompt patch when the failure requires a channel repair.
Do not write back a rubric patch when the failure requires router correction.
Do not write back a reranking patch when the high-value candidate never appears.
```

---

## 20. Mapping Mismatches to GKOs

Each primitive mismatch has a corresponding family of Governed Knowledge Objects.

| Mismatch | GKO family |
|---|---|
| Observation-representation | Channel Rule, Required Variable, Representation Schema, Measurement Requirement |
| State | State Hypothesis, State Discriminator, Branch Policy, Transition Assumption |
| Fitting-boundary | Routing Rule, Trigger Boundary, Capability Applicability Constraint, Suppression Rule |
| Support | Support Expansion Rule, Candidate Enumeration Rule, Search-Space Constraint |
| Aggregation | Composition Invariant, Dependency Graph, Cross-Part Constraint, Integration Check |
| Specification | Objective Rule, Rubric Item, Proxy Limitation, Success Condition, Counterexample |

A GKO should always include:

```text
condition
assertion
strength
priority
evidence
lifespan
revocation_trigger
not_supported_claims
```

The revocation trigger is especially important. Many LLM system failures come from immortal instructions whose support conditions have expired.

---

## 21. Mapping Mismatches to Regression Guards

A Regression Guard prevents a repaired failure family from silently returning.

| Mismatch | Regression guard form |
|---|---|
| Observation-representation | Remove variable V and confirm system blocks downstream reasoning or requests it. |
| State | Present ambiguous state case and confirm system branches or asks for discriminating evidence. |
| Fitting-boundary | Present boundary cases and confirm correct activation / suppression. |
| Support | Present low-support case and confirm candidate expansion reaches required structure. |
| Aggregation | Reintroduce local-good/global-bad artifact and confirm invariant check fails. |
| Specification | Reintroduce proxy-satisfying/utility-failing artifact and confirm verifier rejects it. |

A guard has teeth only if a representative defect makes it fail.

```text
If the defect can return and the guard stays green, the guard is theater.
```

---

## 22. Mapping Mismatches to SGAR

In long-horizon systems, mismatch repairs must often become hard-state transitions.

| Mismatch | SGAR commitment question |
|---|---|
| Observation-representation | Has the required variable actually been observed and committed? |
| State | Has the state hypothesis been verified, rejected, or left open? |
| Fitting-boundary | Has the routing rule been updated and scoped? |
| Support | Has the candidate expansion step been completed and recorded? |
| Aggregation | Has the global invariant check passed? |
| Specification | Has the revised objective been committed with scope and revocation? |

A repair is not complete because the model says it has been considered. It is complete only if the relevant state transition is committed:

```text
S + A -> O -> V -> S'
```

For example:

```text
S: schema values unknown
A: query sample values for candidate columns
O: values retrieved
V: values parsed and linked to predicates
S': value-linking representation committed
```

---

## 23. Text-to-SQL Example

Text-to-SQL illustrates all six primitive mismatches.

### 23.1 Observation-Representation

The database schema, foreign keys, column meanings, sample values, and data distributions must enter the operational representation. If the prompt omits sample values, the model may choose plausible but wrong predicates.

Repair:

```text
schema extraction
sample value retrieval
foreign-key graph construction
column description normalization
```

### 23.2 State

The natural language question may depend on a latent intent or on database contents. A term may refer to a column value, a category, a metric, or a derived relation.

Repair:

```text
state hypotheses for intent
value-grounding checks
branching SQL skeletons
```

### 23.3 Fitting-Boundary

The model may over-trigger memorized SQL templates and under-trigger schema audit or join-path search.

Repair:

```text
activate schema-linking when question references entities
activate join search when multiple tables are implicated
suppress direct SQL rendering until control objects are available
```

### 23.4 Support

The correct join path or nested query may be low-support under direct generation.

Repair:

```text
enumerate schema subgraphs
beam over join paths
generate predicate skeletons before final SQL
```

### 23.5 Aggregation

Each clause may be locally plausible while the full SQL is wrong.

Repair:

```text
cross-check SELECT/JOIN/WHERE/GROUP/HAVING consistency
execute intermediate candidates
validate result shape and semantics
```

### 23.6 Specification

Execution accuracy, exact match, semantic correctness, and user intent may diverge.

Repair:

```text
distinguish executable from semantically correct
use execution feedback as authority but not as sole objective
record counterexamples where execution success hides semantic mismatch
```

Text-to-SQL therefore demonstrates the core transformation:

```text
direct final SQL generation
  -> schema control space
  -> join-path control
  -> value binding
  -> predicate skeleton
  -> execution audit
  -> governed rendering
```

---

## 24. Code Synthesis Example

A code-generation system may fail with all six mismatch types.

| Mismatch | Code synthesis example |
|---|---|
| Observation-representation | Relevant file, dependency, test, API contract, or runtime log is absent. |
| State | The codebase is in a latent migration, concurrency, or compatibility regime. |
| Fitting-boundary | The model uses local patching when architectural refactor reasoning is required. |
| Support | The correct design is a low-support pattern not reached by direct patch generation. |
| Aggregation | Individual edits compile but jointly break invariants. |
| Specification | Tests reward passing current cases but miss the real behavioral contract. |

The repair sequence should not start with "generate another patch" if the failure is upstream. It should start with the first defective station.

---

## 25. Research-Agent Example

A long-horizon research agent also exhibits the six mismatches.

| Mismatch | Research-agent manifestation |
|---|---|
| Observation-representation | The agent lacks decisive papers, notes, assumptions, or prior decisions. |
| State | The project state is unclear: exploration, drafting, revision, rebuttal, or synthesis. |
| Fitting-boundary | The agent over-triggers summarization and under-triggers critical comparison. |
| Support | Novel hypotheses or alternative framings are low-support. |
| Aggregation | Section-level quality fails to produce a coherent paper. |
| Specification | The agent optimizes for polished prose rather than contribution clarity. |

SGAR is crucial here because progress must be committed. A context summary claiming that a section is done is not equivalent to a verified state transition.

---

## 26. Common Misdiagnoses

### 26.1 Mistaking Observation Failure for Reasoning Failure

If the decisive variable is absent, the model may still produce an elaborate explanation. The error may look like reasoning failure, but the repair is not more reasoning. It is variable entry.

### 26.2 Mistaking State Ambiguity for Lack of Knowledge

A model may know all relevant facts but not know which regime applies. Adding more facts may not help unless they discriminate state.

### 26.3 Mistaking Routing Failure for Capability Absence

The model may be able to perform the needed operation when asked explicitly. The failure is not capacity but activation.

### 26.4 Mistaking Support Failure for Lack of Creativity

The issue may not be creativity in general. It may be that the high-value structure is not reachable under the current search parameterization.

### 26.5 Mistaking Aggregation Failure for Local Quality Failure

Improving each part separately can worsen global structure if dependencies are not governed.

### 26.6 Mistaking Specification Failure for Model Misbehavior

A system may optimize exactly what it was instructed to optimize. The failure lies in the proxy.

---

## 27. The Six Mismatches as a Repair Sequence

Although real systems may require iteration, the default repair priority is upstream to downstream:

```text
1. Observation-representation: ensure variables enter.
2. State: determine or preserve uncertainty over the regime.
3. Fitting-boundary: activate the right capabilities.
4. Support: make high-value structures reachable.
5. Aggregation: compose components under global constraints.
6. Specification: ensure the evaluator represents true utility.
```

Specification appears last in the pipeline but can be considered at any stage. In practice, objective repair often co-evolves with audits. However, if a variable is absent or state is unidentified, objective repair may itself be misdirected.

A useful repair discipline:

```text
Do not optimize downstream stations until upstream preconditions are satisfied.
Do not commit a repair until its regression guard has teeth.
Do not promote a heuristic to a GKO without scope and revocation.
```

---

## 28. Mismatch Profiles

A complex task can be represented by a mismatch profile:

```json
{
  "observation_representation": "high",
  "state": "medium",
  "fitting_boundary": "high",
  "support": "high",
  "aggregation": "medium",
  "specification": "medium"
}
```

The profile is not a benchmark score. It is a repair-planning artifact.

A task with high observation-representation mismatch needs channel governance before output search.

A task with high support mismatch needs control-space search.

A task with high aggregation mismatch needs composition invariants.

A task with high specification mismatch needs objective governance and counterexample-driven rubric repair.

Mismatch profiles can guide architecture selection:

| Profile | Architecture implication |
|---|---|
| High observation-representation | Tool access, structured input, raw-data retrieval |
| High state | State tracker, clarifier, branch manager, SGAR |
| High fitting-boundary | Router governance, capability tests, role constraints |
| High support | Candidate expansion, control-space search, structured enumeration |
| High aggregation | Intermediate representations, dependency graphs, validators |
| High specification | Rubric governance, counterexamples, human review, verifier hierarchy |

---

## 29. Relationship to Local Alignment and LLM Mediocrity

LLM mediocrity is not identical to any one mismatch. It is a regime produced by one or more mismatches under a fixed budget and search procedure.

Local alignment means:

```text
The model is useful on local operations.
Those local operations do not automatically preserve global task value.
```

The six mismatches explain why local alignment fails to become global success.

```text
Observation-representation: local reasoning lacks decisive variables.
State: local answer assumes wrong regime.
Fitting-boundary: local capability activation is misrouted.
Support: local search never reaches high-value structure.
Aggregation: local improvements fail to compose.
Specification: local optimization targets wrong proxy.
```

Mediocrity-to-Extraordinary Transformation repairs this by changing the task form:

```text
final-output generation
  -> governed control objects
  -> audit
  -> state commitment
  -> rendering
```

---

## 30. What the Taxonomy Does Not Claim

The taxonomy does not claim:

```text
All failures are equally important.
Every failure has only one mismatch type.
Every mismatch can be diagnosed automatically.
Every task requires heavy governance.
The six mismatches are an absolute ontology beyond the pipeline abstraction.
The model itself is always the source of failure.
Prompting is useless.
Autoregressive generation is inherently mediocre.
```

The taxonomy does claim:

```text
For LLM systems viewed as value-preservation pipelines, these six stations are the primitive places where task value is structurally lost.
Each station has distinct symptoms, repair targets, and governance objects.
Compound failures can be decomposed into interactions among these stations.
```

---

## 31. Revocation Triggers for the Taxonomy

A governed theory should specify when its claims should be weakened or revised.

### 31.1 Revocation Trigger for Relative Completeness

The relative completeness claim should be revised if a structurally distinct pipeline station is identified that:

```text
1. is not reducible to observation, state, routing, support, aggregation, or specification;
2. produces task-value failures under the same pipeline abstraction;
3. requires a distinct repair target;
4. admits minimal pairs independent of the six current stations.
```

### 31.2 Revocation Trigger for Independence

A primitive mismatch should be downgraded if all of its apparent failures can be reduced to another mismatch without losing intervention specificity.

For example, fitting-boundary mismatch would lose primitive status if every routing failure could be fully repaired as support, specification, state, aggregation, or observation failure. The current theory denies this, because capability activation domains are distinct repair targets.

### 31.3 Revocation Trigger for Repair-Operator Coupling

The super-additive coupling claim should be weakened if compound failures can generally be repaired by independent station repairs whose effects do not depend on the fidelity of other stations.

The current theory predicts that this will often be false in high-value tasks.

### 31.4 Revocation Trigger for Atomicity

The atomicity claim should be weakened if a proposed subdivision:

```text
1. occupies a structurally distinct pipeline station,
2. admits minimal pairs independent of the current six,
3. requires an irreducibly distinct repair target, and
4. cannot be reduced to an existing station without losing intervention specificity.
```

If those conditions are met, the current count of six would no longer be stable.

---

## 32. Compact Canonical Definitions

### 32.1 Observation-Representation Mismatch

```text
A failure in which task-decisive variables in S_world are lost, aliased, compressed, omitted, or made operationally inaccessible before entering Z.
```

### 32.2 State Mismatch

```text
A failure in which the correct policy depends on a latent state that is not identifiable under the available representation.
```

### 32.3 Fitting-Boundary Mismatch

```text
A failure in which a learned capability's actual activation domain M_X differs from its true applicability domain T_X.
```

### 32.4 Support Mismatch

```text
A failure in which high-value structures have insufficient probability mass or reachability under the system policy, search space, and budget.
```

### 32.5 Aggregation Mismatch

```text
A failure in which locally valuable components do not compose into a globally valuable artifact.
```

### 32.6 Specification Mismatch

```text
A failure in which the accessible objective U_hat ranks candidates differently from true task utility U.
```

---

## 33. Appendix A: Full Mismatch Cards

### A.1 Observation-Representation Card

```text
Station: S_world -> O -> Z
Question: Did decisive variables enter Z?
Failure: Variable absent, aliased, compressed, inaccessible.
Audit evidence: Supplying variable changes answer; system cannot cite variable.
Control delta: Add observation channel or representation field.
GKO: Required Variable / Channel Rule.
Regression guard: Remove variable and ensure system blocks or requests it.
SGAR state: Variable observed and committed.
```

### A.2 State Card

```text
Station: Z -> latent state
Question: Which state are we in?
Failure: Ambiguous or misranked latent regime.
Audit evidence: Alternative state explains defect; small discriminator flips action.
Control delta: Add state hypothesis and discriminator.
GKO: State Hypothesis / Branch Policy.
Regression guard: Ambiguous case requires branch or clarification.
SGAR state: State committed, rejected, or held open.
```

### A.3 Fitting-Boundary Card

```text
Station: Z -> capability activation
Question: Was the right capability routed?
Failure: Over-trigger or under-trigger of learned behavior.
Audit evidence: Capability succeeds when explicitly invoked.
Control delta: Add trigger or suppression rule.
GKO: Routing Rule / Capability Boundary.
Regression guard: Boundary cases route correctly.
SGAR state: Router update committed with scope.
```

### A.4 Support Card

```text
Station: policy and budget -> candidate set
Question: Is the high-value structure reachable?
Failure: Correct structure absent or pruned.
Audit evidence: More direct samples repeat flawed basin; structured enumeration finds candidate.
Control delta: Add control-space search or candidate expansion.
GKO: Support Expansion Rule.
Regression guard: Low-support case reaches required candidate.
SGAR state: Candidate expansion completed and recorded.
```

### A.5 Aggregation Card

```text
Station: local components -> global artifact
Question: Do the parts compose?
Failure: Local-good/global-bad artifact.
Audit evidence: Cross-part invariant violation.
Control delta: Add dependency graph or composition invariant.
GKO: Composition Rule / Global Invariant.
Regression guard: Reintroduced invariant violation fails.
SGAR state: Global composition check passed.
```

### A.6 Specification Card

```text
Station: accessible objective vs true utility
Question: Are we optimizing the right target?
Failure: Proxy success / utility failure.
Audit evidence: Counterexample separates U_hat and U.
Control delta: Revise rubric, verifier, or success condition.
GKO: Objective Rule / Proxy Limitation.
Regression guard: Proxy-only success rejected.
SGAR state: Objective update committed with revocation trigger.
```

---

## 34. Appendix B: Diagnostic Checklist

Use the following checklist during failure review.

```text
[ ] What was the actual low-value outcome?
[ ] What true utility criterion did it fail?
[ ] Was the decisive variable present in the operational representation?
[ ] Were multiple latent states plausible?
[ ] Did the system activate the appropriate capability?
[ ] Did the correct structure appear among candidates?
[ ] Were local components globally consistent?
[ ] Did the evaluator or rubric match true utility?
[ ] Which mismatch was upstream?
[ ] Which repair operator was disabled by another mismatch?
[ ] What control delta follows?
[ ] What GKO or object must be updated?
[ ] What regression guard has teeth?
[ ] What hard-state transition commits the repair?
```

---

## 35. Appendix C: Canonical Audit Finding Template

```json
{
  "id": "finding.example",
  "artifact": "candidate artifact or action sequence",
  "value_failure": "why the artifact failed true task utility",
  "mismatch_profile": {
    "observation_representation": "none | low | medium | high",
    "state": "none | low | medium | high",
    "fitting_boundary": "none | low | medium | high",
    "support": "none | low | medium | high",
    "aggregation": "none | low | medium | high",
    "specification": "none | low | medium | high"
  },
  "primary_mismatch": "one primitive mismatch",
  "compound_interactions": [
    "upstream mismatch disables repair operator for downstream mismatch"
  ],
  "evidence": [
    "specific artifact evidence"
  ],
  "repair_target": "channel | state | router | support | aggregation | objective | verifier | state_record",
  "control_delta": "specific proposed change",
  "gko_update": "object to add, revise, weaken, or revoke",
  "regression_guard": "guard that fails if defect recurs",
  "state_transition": "commitment required under SGAR"
}
```

---

## 36. Appendix D: Canonical Control Delta Template

```json
{
  "id": "delta.example",
  "source_finding": "finding.id",
  "target_station": "observation_representation | state | routing | support | aggregation | specification",
  "change_type": "add | revise | weaken | revoke | split | merge | escalate",
  "object_target": "GKO | GExO | Verifier | StateRecord | TransitionContract | RegressionGuard",
  "before": "current rule, object, or process",
  "after": "proposed revised rule, object, or process",
  "scope": "where the change applies",
  "risk": "possible adverse effects",
  "revocation_trigger": "condition for weakening or removing the delta",
  "required_guard": "regression guard id"
}
```

---

## 37. Conclusion

The six primitive mismatches provide a structural basis for diagnosing LLM system failure. They are not six arbitrary labels. They correspond to six stations in the value-preservation pipeline:

```text
observation / representation
state identification
capability routing
candidate support
local-to-global aggregation
objective specification
```

The taxonomy is relatively complete under this abstraction because these are the primitive places where task value can be lost. It is operationally independent because each station can fail while the others are held fixed and each requires a distinct repair target.

The practical value of the taxonomy is not classification for its own sake. Its value is repair routing. A failure diagnosed as observation-representation mismatch should not be repaired by more sampling. A failure diagnosed as support mismatch should not be repaired merely by polishing the rubric. A failure diagnosed as specification mismatch should not be repaired by local fluency improvements. Each mismatch points to a different control delta, GKO family, regression guard, and hard-state commitment.

The deepest failures are compound. Multiple mismatches interact by coupling repair operators. A defect at one station can disable the operation required to repair another. This explains why some LLM systems remain trapped in mediocrity despite more prompting, more critique, more samples, or more self-reflection.

The constructive response is governed transformation. Preserve locally aligned model abilities, but transform high-mismatch final-output tasks into lower-mismatch control objects. Govern those objects with scope, evidence, revocation, audit, regression, and state commitment. In that architecture, the six primitive mismatches become not only a theory of failure but a map for building systems that preserve task value.
