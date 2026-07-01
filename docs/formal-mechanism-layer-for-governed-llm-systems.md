# Formal Mechanism Layer for Governed LLM Systems

## Intervenable Components, Diagnostic Profiles, and Repair Localization

**Working Draft v0.1**  

---

## Contents

- [Abstract](#abstract)
- [0. Position in the Unified Theory](#0-position-in-the-unified-theory)
- [1. Why a Mechanism Layer Is Needed](#1-why-a-mechanism-layer-is-needed)
- [2. Formal Decision-System Model](#2-formal-decision-system-model)
- [3. The Eight Intervenable Mechanism Axes](#3-the-eight-intervenable-mechanism-axes)
- [4. Eight-Axis Summary Table](#4-eight-axis-summary-table)
- [5. Crosswalk with the Six Primitive Mismatches](#5-crosswalk-with-the-six-primitive-mismatches)
- [6. Minimal Intervention Probes](#6-minimal-intervention-probes)
- [7. Mechanism Profiles as Governance Objects](#7-mechanism-profiles-as-governance-objects)
- [8. Compound Mechanism Chains](#8-compound-mechanism-chains)
- [9. Relation to Audit Engineering](#9-relation-to-audit-engineering)
- [10. Relation to Knowledge Governance](#10-relation-to-knowledge-governance)
- [11. Relation to SGAR](#11-relation-to-sgar)
- [12. Case Illustration I: Text-to-SQL](#12-case-illustration-i-text-to-sql)
- [13. Case Illustration II: Financial Event Strategy](#13-case-illustration-ii-financial-event-strategy)
- [14. Case Illustration III: Tool-Using Code Agent](#14-case-illustration-iii-tool-using-code-agent)
- [15. Use Principles and Limits](#15-use-principles-and-limits)
- [16. Self-Audit of the Mechanism Layer](#16-self-audit-of-the-mechanism-layer)
- [17. Compressed Operating Protocol](#17-compressed-operating-protocol)
- [18. Conclusion](#18-conclusion)
- [Appendix A: Mechanism Checklist](#appendix-a-mechanism-checklist)
- [Appendix B: Compact Schema Bundle](#appendix-b-compact-schema-bundle)
- [Appendix C: Glossary](#appendix-c-glossary)

---

## Abstract

This document defines the **Formal Mechanism Layer** for governed LLM systems. It is a companion to the structural theory of value preservation, the six primitive mismatches, the Governed LLM Object Model, Audit Engineering, and the State-Governed Agent Regime (SGAR). Its purpose is to connect structural diagnosis to component-level attribution and repair localization after a task has already been turned into governable control objects.

The six primitive mismatches explain where task value becomes structurally distorted: observation-representation, state, fitting-boundary, support, aggregation, and specification. They are **task-value structural diagnostic axes** and, in practice, the first engineering entry points. By contrast, the Formal Mechanism Layer asks a different question: once a failure has been observed and operationalized into task-specific control objects, which component of the actual LLM system best explains that failure and where should persistent repair be localized?

We model an LLM system as an approximate decision system operating in a partially observable environment. The system does not directly possess the true state, the true transition function, the true reward, the complete action space, or the complete observation channel. Instead, it acts through approximate components:

- specification and reward proxies;
- observation interfaces;
- belief and representation state;
- a world model;
- action interfaces;
- policy and capability support;
- capability routing;
- search or execution algorithms.

The mechanism layer therefore decomposes repair localization into eight intervenable axes:

```text
1. Specification / reward
2. Observation availability
3. Belief / representation
4. Dynamics / world model
5. Action / interface
6. Capability support / policy prior
7. Fitting boundary / capability routing
8. Search / execution
```

These are not eight new primitive mismatches. They are not a replacement for the six-mismatch taxonomy. They are **system-intervention axes**. One primitive mismatch may be produced by several mechanism failures, and one mechanism failure may appear as several primitive mismatches. The proper unit of diagnosis is therefore a **Mechanism Profile**, not a forced single label.

The corrected positioning is:

> The Formal Mechanism Layer is a derived component-analysis layer, not a primary engineering entry point.

This document formalizes the eight axes, defines Mechanism Profiles as governance objects, provides minimal intervention probes for causal localization, maps primitive mismatches to mechanism sources, and shows how mechanism-level diagnosis integrates with task-specific control objects, Audit Engineering, Control Deltas, Regression Guards, Defect Ledgers, and SGAR hard-state transitions.

---

## 0. Position in the Unified Theory

The current governed-LLM theory stack has several layers:

```text
Layer 0: World-to-output value-preservation pipeline
Layer 1: Six Primitive Mismatches
Layer 2: Task-Specific Control Objects
Layer 3: Formal Mechanism Layer
Layer 4: Diagnostic–Mechanism Bridge
Layer 5: Knowledge Governance
Layer 6: Audit Engineering
Layer 7: Governed Object Model
Layer 8: State-Governed Agent Regime
Layer 9: Mechanism-Driven Training
```

Each layer answers a different question.

| Layer | Main question |
|---|---|
| Value-preservation pipeline | Through which stations must task value survive? |
| Six Primitive Mismatches | Where is task value structurally distorted? |
| Task-Specific Control Objects | What governed task object must be constructed or revised to expose the failure? |
| Formal Mechanism Layer | Which component-level mechanism explains or amplifies failure in that task object? |
| Diagnostic–Mechanism Bridge | How does value diagnosis become object repair, mechanism attribution, and repair-layer selection? |
| Knowledge Governance | Which control knowledge should be objectified, scoped, revised, and revoked? |
| Audit Engineering | How should failures be localized and written back into the control space? |
| Governed Object Model | How should findings, deltas, Governed Knowledge Objects (GKOs), guards, and state records be represented? |
| SGAR | Which actions, repairs, memories, and state updates are actually committed? |
| Mechanism-Driven Training | Which recurrent operationalized learning-component failures should be promoted into training? |

The mechanism layer sits between structural theory and repair. It prevents a common failure in LLM-system design: moving directly from a surface symptom to a favorite repair without identifying the component-level bottleneck.

For example, a failed SQL query may be described as a support mismatch because the correct join path did not appear. But the mechanism-level cause may differ:

```text
missing schema data                  → observation availability
schema present but not operational    → belief / representation
correct query requires execution      → action / interface
query behavior guessed incorrectly    → dynamics / world model
rare join pattern not generated       → policy / capability support
schema-audit skill not triggered      → capability routing
candidate generated but discarded     → search / execution
wrong success criterion               → specification / reward
```

The primitive mismatch tells us what kind of value-preservation failure occurred. The task-specific control object tells us what is directly manipulated. The mechanism profile tells us which component-level mechanism explains why that task object failed and where persistent repair may belong.

---

## 1. Why a Mechanism Layer Is Needed

### 1.1 Structural diagnosis is not enough

A structural mismatch diagnosis is necessary but not sufficient. Suppose an artifact fails because locally plausible components do not compose into a globally valid result. It is reasonable to call this an aggregation mismatch. But the same aggregation failure may require different repairs:

```text
- build an external dependency graph;
- add a global validator;
- expand candidate search;
- introduce a domain-specific composition operator;
- change the task mode so that the model enters audit rather than drafting;
- add a missing tool that can verify the global artifact;
- correct a specification that was rewarding local fluency.
```

All of these repairs can reduce aggregation failure, but they do not modify the same system component.

A useful diagnosis must therefore say not only:

```text
This is an aggregation mismatch.
```

but also:

```text
The immediate bottleneck is belief / representation: the relevant dependency graph was never externalized.
```

or:

```text
The immediate bottleneck is search / execution: the correct dependency graph is reachable, but the current branch search does not preserve it.
```

or:

```text
The immediate bottleneck is capability routing: the model has a graph-audit capability, but the task prompt routes it into fluent drafting mode.
```

### 1.2 Mechanism diagnosis is repair localization

Mechanism diagnosis asks:

```text
Which component should be changed, expanded, constrained, verified, or replaced?
```

The answer may be:

```text
- objective / rubric;
- observation channel;
- representation state;
- world-model feedback;
- action interface;
- capability support;
- capability router;
- search and execution procedure.
```

This is why the mechanism layer is not merely more terminology. It is the bridge between theory and intervention.

### 1.3 The mechanism layer is not a new main taxonomy

The six primitive mismatches and the eight mechanism axes live at different abstraction levels.

```text
Six primitive mismatches:
  task-value structural diagnostic axes

Eight mechanism axes:
  system-intervention diagnostic axes
```

They should not be merged into one flat list. A flat list would confuse two different questions:

```text
Why did value fail to survive the pipeline?
Which component should we modify next?
```

The two layers form a cross-diagnosis. A primitive mismatch narrows the failure form. A mechanism profile narrows the repair target.

### 1.4 The mechanism profile is not a single-label classifier

Real LLM-system failures are usually compound. The mechanism layer should therefore be represented as a profile, not as a forced class label.

A single failure may involve:

```text
wrong specification
  → wrong evidence selected
  → wrong capability mode triggered
  → search space narrowed
  → verifier selects the wrong candidate
```

At the surface, this may look like search failure. Mechanism diagnosis should distinguish:

```text
primary cause
secondary cause
necessary condition
amplifier
downstream symptom
unknown / not yet distinguished
```

The goal is not to name the failure beautifully. The goal is to identify the lowest-cost, highest-information, highest-leverage repair.

### 1.5 Scope Correction: Derived Component Analysis, Not Primary Engineering Entry

The Formal Mechanism Layer should not be treated as the first engineering move. Engineering usually enters through a primitive mismatch that forces construction of a task-specific governed object:

```text
observation-representation
  → evidence map, schema view, reader simulator, value-binding table

state
  → state machine, world ledger, role-state table, task-state table

fitting-boundary
  → router rule, mode boundary, pacing or density controller

support
  → candidate generator, technique library, retrieval operator

aggregation
  → DAG, outline graph, dependency tracker, narrative skeleton

specification
  → rubric, style guard, success condition, reader-response criterion
```

These task objects are what audits and control deltas directly modify. The Formal Mechanism Layer comes after that direct object construction. It explains whether the recurring pressure behind those object failures belongs to specification/reward, representation, routing, search, or another component axis.

### 1.6 Operationalization Gate

A mechanism axis should become a direct repair target only when five conditions hold:

```text
1. Observable symptom
   The mechanism failure is visible in task behavior.

2. Task-specific control object
   A concrete governed object carries the repair.

3. Intervention operator
   We know how to modify the object or component.

4. Success / failure signal
   We can tell whether the intervention worked.

5. Regression guard
   Recurrence can be detected reliably.
```

If these conditions do not hold, a mechanism label should be recorded as:

```text
hypothesis
diagnostic lens
training-side attribution
```

rather than as a direct runtime control delta.

### 1.7 Open-Ended Task Boundary

The Formal Mechanism Layer is most actionable when the task admits stable system components. Examples include observations, state variables, verifiers, execution traces, candidate spaces, or learned routing boundaries.

It is less directly actionable in open-ended creative tasks unless the task has first been transformed into governed control objects. In story generation, for example, it is usually premature to begin with `dynamics_world_model` or `specification_reward` as direct repair targets. The first useful engineering objects are more often:

- a character-state machine;
- a narrative skeleton;
- a foreshadowing ledger;
- a style guard;
- a pacing controller;
- a reader simulator.

Only after those objects exist and fail recurrently does mechanism attribution become sharp enough to support stable repair or training promotion.

---

## 2. Formal Decision-System Model

### 2.1 True task environment

Represent the task environment as a partially observable decision process:

```math
\mathcal{E} = (\mathcal{S}, \mathcal{A}, \mathcal{T}, R^*, \Omega, \mathcal{O}, \gamma)
```

where:

| Symbol | Meaning |
|---|---|
| `\mathcal{S}` | True state space: world state, user intent, task background, files, database contents, hidden constraints, interaction state. |
| `\mathcal{A}` | The theoretically available action space: text output, tool calls, retrieval, code execution, database queries, asking the user, waiting, delegation, rollback. |
| `\mathcal{T}(s' \mid s,a)` | True transition function: how the environment changes after an action. |
| `R^*(s,a,s')` | True task reward or utility: the success criterion that ultimately matters. |
| `\Omega` | Observation space: text, files, logs, database rows, images, tool returns, human feedback, metrics. |
| `\mathcal{O}(o \mid s)` | Observation function: how true state maps into observations. |
| `\gamma` | Discount factor or long-horizon weighting over delayed returns. |

For a finite-horizon task, the ideal trajectory is:

```math
\tau^* = \arg\max_{\tau=(s_0,a_0,\ldots,s_H)}
\mathbb{E}\left[\sum_{t=0}^{H-1}\gamma^t R^*(s_t,a_t,s_{t+1})\right]
```

A one-shot text task is a degenerate case where the main action is generating an artifact `y`:

```math
y^* = \arg\max_y U(y, S_{world})
```

The key point is that the true objective is not the likelihood of the next token. It is value over an artifact or trajectory in the task environment.

### 2.2 Approximate LLM system

A deployed LLM system does not have direct access to `\mathcal{E}`. It relies on approximate components:

```math
\mathcal{M}_\theta =
\left(
\hat{R}_\theta,
\Omega_{sys},
B_\theta,
\hat{\mathcal{T}}_\theta,
\mathcal{A}_{sys},
\pi_\theta,
r_\theta,
D
\right)
```

where:

| Component | Meaning |
|---|---|
| `\hat{R}_\theta` | Internal value judgment, rubric interpretation, reward proxy, or evaluator. |
| `\Omega_{sys}` | Observation channels actually available to the system. |
| `B_\theta` | Belief / representation state constructed from observation history. |
| `\hat{\mathcal{T}}_\theta` | World model: predicted consequences of actions. |
| `\mathcal{A}_{sys}` | Action / interface space actually callable by the system. |
| `\pi_\theta` | Model policy, token prior, capability prior, and candidate-generation distribution. |
| `r_\theta` | Capability router: mode, role, tool, skill, audit pattern, and behavior activation. |
| `D` | Decoding, planning, search, ranking, verification, and execution procedure. |

`\Omega_{sys}` belongs to `\mathcal{M}_\theta`, not to the true environment tuple `\mathcal{E}`. `\Omega` and `\mathcal{O}(o \mid s)` describe what observations exist in principle in the task environment. `\Omega_{sys}` describes which observation channels are actually exposed to the deployed governed system.

The system is also shaped by external specifications:

```text
R_proxy: training or product-level proxy reward
R_eval: deployment evaluator or benchmark metric
R_user: expressed user preference
R*: true task utility
```

Not all mechanism axes are of the same type. Five axes include learned components that may justify training promotion:

| Mechanism axis | Learned-side components | Runtime-side components |
|---|---|---|
| `specification_reward` | `\hat{R}_\theta`, learned reward proxy | rubric, evaluator, verifier, acceptance criterion |
| `belief_representation` | `B_\theta` | state tables, schemas, memory objects, GKOs |
| `dynamics_world_model` | `\hat{\mathcal{T}}_\theta` | execution feedback, simulator, verifier |
| `capability_support` | `\pi_\theta` | examples, RAG, specialist operators, tools |
| `capability_routing` | `r_\theta` | explicit router, mode switch, role binding |

Three axes are primarily system-side:

| Mechanism axis | Dominant system-side components |
|---|---|
| `observation_availability` | `\Omega_{sys}` and observation access policy |
| `action_interface` | `\mathcal{A}_{sys}` |
| `search_execution` | `D` |

This distinction also explains why a representation-induced value ceiling belongs to the mechanism layer. Once utility-relevant distinctions are lost before `B_\theta`, downstream routing, support, aggregation, or search cannot reliably recover them. Recovery requires additional observation or representation repair.

A mechanism mismatch occurs when a component of `\mathcal{M}_\theta` differs from what the task requires, and that difference changes reachable value.

### 2.3 Mechanism mismatch profile

Define the mechanism mismatch profile:

```math
\mathbf{m} =
(m_{spec},
 m_{obs},
 m_{belief},
 m_{dyn},
 m_{act},
 m_{support},
 m_{route},
 m_{search})
```

where each component can be recorded as:

```text
none | low | medium | high | critical | unknown | not_distinguished
```

The values do not need to be precise numerical scores. They are diagnostic records used to guide repair and governance.

A profile should also record causal role:

```text
primary_cause
secondary_cause
necessary_condition
amplifier
downstream_symptom
not_distinguished
```

Mechanism diagnosis should be evidence-bearing. A mechanism label without a minimal intervention probe, observed contrast, or explicit uncertainty is only a hypothesis.

---

## 3. The Eight Intervenable Mechanism Axes

### 3.1 Specification / Reward

#### Definition

Specification / reward mismatch occurs when the true utility, expressed task objective, evaluator, reward proxy, acceptance criteria, or internal model judgment diverge. The divergence must be large enough to change candidate ranking.

Let `R^*` be the true task utility and `R_eval` be the evaluator used by the system. The mismatch exists when:

```math
\arg\max_y R_{eval}(y) \neq \arg\max_y R^*(y)
```

or, more generally, when:

```math
rank_{R_{eval}}(y_1,y_2) \neq rank_{R^*}(y_1,y_2)
```

for task-critical candidate pairs.

#### Core question

```text
Is the system optimizing, auditing, selecting, or reporting the wrong objective?
```

#### Typical symptoms

```text
- The system optimizes a benchmark metric rather than the user's deployment objective.
- The evaluator rewards fluency, caution, or completeness while the task requires decisiveness, correctness, or operational usefulness.
- The rubric is correct at a high level but lacks non-negotiable constraints.
- The generator and verifier share the same wrong premise.
- The system passes the visible test but fails the real user need.
- A proxy metric gradually replaces the true objective.
```

#### Minimal intervention probe

Change only the success criterion, rubric, candidate-ranking rule, or acceptance test while holding observations, tools, model, and search budget fixed.

If the selected answer or repair direction changes materially, specification / reward is a likely bottleneck.

#### Governance deltas

```text
SpecificationDelta:
  - revise true objective statement;
  - distinguish true utility, proxy metric, reporting metric, and acceptance test;
  - add non-negotiable constraints;
  - add counterexamples to the rubric;
  - add objective-scope and revocation triggers;
  - separate generator and evaluator assumptions;
  - replace scalar proxy with layered acceptance.
```

#### Boundary conditions

If the objective is clear but was misread, the problem may be belief / representation. If the objective is correct but good candidates almost never appear, the problem may be capability support. If good candidates appear but are selected poorly due to noisy finite evaluation, the problem may be search / execution.

#### Primitive mismatch relations

Specification / reward is the primary mechanism source for **specification mismatch**, but it can also induce support, routing, and aggregation failures by selecting the wrong evidence, activating the wrong task mode, or rewarding locally good but globally wrong artifacts.

---

### 3.2 Observation Availability

#### Definition

Observation availability mismatch occurs when information required for correct action does not enter the system's observable space.

Let `\Omega_{req}` be the observation content required to distinguish action-relevant states. The system has an observation availability mismatch when:

```math
\Omega_{req} \nsubseteq \Omega_{sys}
```

Equivalently, if two states are indistinguishable under the current observation function:

```math
\mathcal{O}_{sys}(\cdot \mid s_1) \approx \mathcal{O}_{sys}(\cdot \mid s_2)
```

but their optimal actions differ:

```math
a^*(s_1) \neq a^*(s_2)
```

then the system cannot reliably solve the task from current observations alone.

#### Core question

```text
Was necessary information seen at all?
```

#### Typical symptoms

```text
- The system needs a file, table, log, database row, dependency version, timestamp, or raw trace that is absent.
- The user holds a key constraint in their head but the system is forced to answer.
- The system receives a summary but not the raw evidence that decides the conclusion.
- A market, codebase, API, browser, or database state is guessed from language prior.
- The system lacks current information and cannot retrieve or ask.
- The result changes dramatically after one missing variable is supplied.
```

#### Minimal intervention probe

Add the smallest missing observation: one file, one database query, one log, one clarifying answer, one timestamped source, one schema inspection, one tool return.

If the result improves without changing the reasoning method, observation availability was a bottleneck.

#### Governance deltas

```text
ObservationDelta:
  - add data source;
  - connect file, database, log, browser, or tool result;
  - ask minimal clarifying question;
  - record timestamp, version, and coverage;
  - mark missing variables explicitly;
  - introduce measurement or sensor;
  - create observation sufficiency checklist.
```

#### Boundary conditions

“Not in context” is observation availability. “In context but not used correctly” is belief / representation. Adding more irrelevant context may worsen belief / representation by increasing binding and retrieval burden.

#### Primitive mismatch relations

Observation availability contributes to **observation-representation mismatch** when decisive variables never enter the system. It contributes to **state mismatch** when latent states cannot be distinguished. It can also create apparent support failures because the system cannot generate structures that require missing variables.

---

### 3.3 Belief / Representation

#### Definition

Belief / representation mismatch occurs when information is available in observations but does not become a correct, stable, operational task state.

Let `B^*` be the ideal task belief or representation and `B_\theta` the system's constructed belief state. The mismatch exists when:

```math
B_\theta(s_t \mid o_{\leq t}) \neq B^*(s_t \mid o_{\leq t})
```

Here “belief” does not require an explicit probability distribution. It includes any internal or external representation that affects later decisions: extracted constraints, entity bindings, state tables, schemas, assumptions, memory, plan state, tool results, or open questions.

#### Core question

```text
Was available information converted into the right operational state?
```

#### Typical symptoms

```text
- A document contains the answer, but the system misses or misbinds it.
- The system forgets earlier constraints in a long context.
- Units, dates, roles, entities, tables, columns, or conditions are confused.
- Facts, assumptions, inferences, decisions, and open questions are mixed together.
- Completed subtasks are repeated because state was not externalized.
- A schema is visible but not transformed into a usable schema graph.
- The system reads a tool result but does not update subsequent behavior.
```

#### Minimal intervention probe

Do not add new facts. Instead, require structured state extraction before solving:

```text
- knowns / unknowns;
- constraints;
- entity table;
- timeline;
- schema graph;
- state hypothesis table;
- assumption ledger;
- fact / inference / decision separation.
```

If results improve substantially without new observations, belief / representation was a bottleneck.

#### Governance deltas

```text
BeliefRepresentationDelta:
  - create structured task state;
  - introduce external memory with provenance;
  - extract constraints and invariants;
  - bind entities, columns, values, dates, and units;
  - maintain state tables and timelines;
  - separate facts, assumptions, inferences, decisions, and open questions;
  - require re-reading source before irreversible steps.
```

#### Boundary conditions

If the needed information is absent, repair observation first. If state representation is correct but action consequences are predicted incorrectly, repair dynamics / world model. If representation is correct but locally good pieces still fail to compose, aggregation or search may be the downstream failure.

#### Primitive mismatch relations

Belief / representation contributes to **observation-representation mismatch** when observed variables fail to become operational. It contributes to **state mismatch** when latent states are represented incorrectly. It can also induce aggregation failure by losing dependencies among parts.

---

### 3.4 Dynamics / World Model

#### Definition

Dynamics / world-model mismatch occurs when the system's predicted consequences of actions differ from the true environment transition.

Let `\hat{\mathcal{T}}_\theta` be the system's predicted transition model and `\mathcal{T}` the true transition function. The mismatch exists when:

```math
\hat{\mathcal{T}}_\theta(s_{t+1} \mid s_t, a_t)
\neq
\mathcal{T}(s_{t+1} \mid s_t, a_t)
```

#### Core question

```text
Does the system misjudge what its action will do in the real environment?
```

#### Typical symptoms

```text
- Generated code compiles in the explanation but fails in runtime.
- SQL looks plausible but returns an empty, wrong, or erroring result.
- The system invents API parameters, permissions, product behavior, browser effects, or market reactions.
- A plan assumes early steps will succeed but ignores propagation of failure.
- Offline reasoning diverges from actual tool, compiler, user, database, or market feedback.
- The model explains what should happen instead of checking what did happen.
```

#### Minimal intervention probe

Ask the system to predict the outcome of an action, then execute or simulate the action in a real or authoritative environment. Compare prediction with observed result.

If real feedback repeatedly refutes internal predictions, world-model mismatch is a likely bottleneck.

#### Governance deltas

```text
DynamicsWorldModelDelta:
  - add execution feedback;
  - run code, query real database, call real API;
  - add unit tests, integration tests, sandbox, simulator, or backtest;
  - require predict-execute-compare-correct loop;
  - write environment feedback into state;
  - calibrate high-risk transition assumptions;
  - store failure modes of predicted vs observed consequences.
```

#### Boundary conditions

If a real feedback channel exists but predictions disagree with it, this is world-model mismatch. If no feedback channel or action interface exists, this is action / interface mismatch. The two often co-occur, but their repair order differs. First make the environment callable or observable; then calibrate the world model.

#### Primitive mismatch relations

Dynamics / world model contributes to **state mismatch** when state transitions are misestimated. It contributes to **specification mismatch** when the system optimizes a proxy under false assumptions about consequences. It contributes to **aggregation mismatch** when multi-step plans fail because earlier action effects are wrong.

---

### 3.5 Action / Interface

#### Definition

Action / interface mismatch occurs when the action required for success is not available through the system's effective action space.

Let `a^*` be an action required for the task. The mismatch exists when:

```math
a^* \notin \mathcal{A}_{sys}
```

A nominally available action may still be effectively unavailable if blocked by permissions, schema limits, latency, lack of rollback, missing authorization, unreliable execution, absent return values, or process constraints.

#### Core question

```text
Can the system actually perform the action required for success?
```

#### Typical symptoms

```text
- The task requires browsing, running code, editing a file, querying a database, or inspecting logs, but the system can only output text.
- The system must ask a clarifying question but is forced to answer in one turn.
- A tool exists but its parameter schema cannot express the required operation.
- The system can recommend an action but cannot verify, deploy, observe, or roll it back.
- Permissions, rate limits, policy gates, network access, or asynchronous waiting constraints block completion.
- The model hallucinates action results because it has no way to obtain them.
```

#### Minimal intervention probe

Open the smallest action needed for verification or completion while holding the model and task specification fixed:

```text
- one database query;
- one code execution;
- one file read;
- one file write in a sandbox;
- one clarifying question;
- one API call;
- one permissioned tool;
- one rollback-safe execution path.
```

If the task changes from guessing to verifiable execution, action / interface was a bottleneck.

#### Governance deltas

```text
ActionInterfaceDelta:
  - add tool, API, executor, file operation, or database interface;
  - improve parameter schema and error returns;
  - add authorization, rollback, and irreversible-action gates;
  - support clarification and asynchronous waiting;
  - expose tool outputs as state updates;
  - define safe action subsets and escalation conditions;
  - log action provenance and effect.
```

#### Boundary conditions

More tools are not automatically better. Tools expand the effective action space only when the system can observe them, select them, call them correctly, interpret their returns, verify their effects, and commit the resulting state transitions. Otherwise, tools merely add routing and search burdens.

#### Primitive mismatch relations

Action / interface contributes to **observation-representation mismatch** when the system lacks the tool needed to observe decisive variables. It contributes to **support mismatch** when correct structures require tool-generated candidates. It contributes to SGAR failures when actions cannot produce verifiable state transitions.

---

### 3.6 Capability Support / Policy Prior

#### Definition

Capability support / policy prior mismatch occurs when the correct knowledge, operator, reasoning pattern, artifact structure, or action candidate has insufficient probability or reachability under the system's effective policy and budget.

Let `y^*` be a high-value candidate and `B` the inference budget. The mismatch exists when:

```math
P_\theta(y^* \mid Z, B) \approx 0
```

or:

```math
y^* \notin EffectiveSupport_B(\pi_\theta)
```

#### Core question

```text
Is the correct structure in the system's effective support?
```

#### Typical symptoms

```text
- Multiple samples repeat the same error family.
- The system restates domain material but cannot perform the domain-specific operation.
- The correct solution requires a rare professional workflow, proof strategy, operator family, API idiom, or reasoning pattern.
- Even with sufficient context, tools, and specification, the system does not generate the right type of candidate.
- A specialist model, programmatic operator, or strong example changes the result dramatically.
```

#### Minimal intervention probe

Hold specification, observations, tools, representation, and routing mostly fixed. Then add one of:

```text
- strong few-shot examples;
- domain retrieval;
- specialist model;
- programmatic generator;
- curated operator family;
- fine-tuned capability;
- external solver.
```

If only these interventions make the correct candidate appear, capability support was likely insufficient.

#### Governance deltas

```text
CapabilitySupportDelta:
  - add examples, domain knowledge, or specialist retrieval;
  - add expert model or programmatic operator;
  - decompose capability into smaller verifiable sub-capabilities;
  - add task-specific candidate generators;
  - add training or boundary-case curriculum;
  - create support-expansion GKO;
  - track effective support under realistic budget.
```

#### Boundary conditions

Observation mismatch means the task lacks information. Capability support mismatch means that even with information, the system lacks the solution prior. If repeated sampling occasionally produces the correct candidate, the problem may be search rather than support. If the capability appears under another prompt or role, the problem may be routing rather than support.

#### Primitive mismatch relations

Capability support is a primary mechanism source for **support mismatch**. It may also amplify aggregation failure when the system lacks operators that preserve global structure.

---

### 3.7 Fitting Boundary / Capability Routing

#### Definition

Fitting boundary / capability routing mismatch occurs when a learned capability, strategy, role, audit pattern, refusal behavior, tool-use behavior, or reasoning mode exists but is triggered in the wrong region.

Let `X` be a capability. Let:

```text
T_X = true domain where X should apply
M_X = model/system domain where X is actually activated
```

The mismatch exists when:

```math
M_X \neq T_X
```

with two directions:

```math
M_X \setminus T_X \quad \text{over-triggering}
```

```math
T_X \setminus M_X \quad \text{under-triggering}
```

#### Core question

```text
Does the capability exist but get routed incorrectly?
```

#### Typical symptoms

```text
- A simple scripting task triggers over-engineering mode.
- A harmless request triggers refusal or excessive safety mode.
- An exploratory research task triggers premature No-Go audit mode.
- A schema-linking task triggers generic SQL template generation instead of schema audit.
- A candidate-construction task triggers evidence-insufficiency language rather than search.
- The correct capability appears under another prompt, role, phase, or decomposition.
```

#### Minimal intervention probe

Add no new facts and no new tools. Change only:

```text
- task mode;
- role binding;
- generator / verifier split;
- phase state;
- positive and negative trigger examples;
- routing rule;
- suppression condition;
- instruction that explicitly activates the suspected capability.
```

If the correct behavior appears, routing rather than capability absence was the bottleneck.

#### Governance deltas

```text
CapabilityRoutingDelta:
  - add explicit skill router;
  - define phase-specific modes;
  - separate generator, verifier, executor, and governor roles;
  - add trigger and anti-trigger examples;
  - add boundary probes;
  - add routing confusion matrix;
  - define revocation conditions for task modes;
  - govern capability activation as a GKO.
```

#### Boundary conditions

Capability support means the system lacks the relevant capability or candidate prior. Routing mismatch means the capability approximately exists but is not activated in the right context. Search mismatch means the capability is activated and candidate exists, but the search procedure fails to find or preserve it.

#### Primitive mismatch relations

Fitting boundary / capability routing is the main mechanism source for **fitting-boundary mismatch**, and it frequently amplifies support and aggregation failures by narrowing the candidate space before search begins.

---

### 3.8 Search / Execution

#### Definition

Search / execution mismatch occurs when the correct candidate is already in effective support, and when the relevant information, objective, action space, capability, and routing are all close enough to correct. The failure happens because the current search, ranking, verification, or execution procedure cannot find, select, preserve, or complete that candidate.

Let `D` be the decoding, search, planning, ranking, verification, and execution procedure. The mismatch exists when:

```math
y^* \in EffectiveSupport_B(\pi_\theta)
```

but:

```math
D(\pi_\theta, B) \neq y^*
```

#### Core question

```text
Was the correct path reachable but not found, selected, preserved, or executed?
```

#### Typical symptoms

```text
- Greedy decoding commits to bad early tokens.
- Best-of-N contains a strong candidate, but single-sample output is mediocre.
- The candidate is generated but discarded by a weak ranker.
- The plan is good, but execution loses intermediate state.
- The search varies surface wording but not the key structural variables.
- A wrong initial plan becomes rationalized by later steps.
- The system finds local fixes but not combinations of fixes.
```

#### Minimal intervention probe

Do not add data, tools, capability, or a new specification. Only change search or execution:

```text
- increase candidate count;
- add branch search;
- add backtracking;
- add independent verifier;
- add candidate comparison;
- preserve checkpoints;
- add constrained combinatorial search;
- separate planning and execution;
- add recovery from failed branches.
```

If result quality improves materially, search / execution was the bottleneck.

#### Governance deltas

```text
SearchExecutionDelta:
  - add best-of-N, beam, tree search, or MCTS;
  - add generate-rank-verify loop;
  - add branch checkpoints and rollback;
  - add independent verifier;
  - allocate budget by uncertainty and value;
  - preserve failed branches as evidence;
  - add execution trace state;
  - prevent premature commitment.
```

#### Boundary conditions

More search only helps when the correct candidate is in effective support, the evaluator can recognize it, and the action interface can execute or verify it. Otherwise, search explores the wrong space more thoroughly.

#### Primitive mismatch relations

Search / execution contributes to **support mismatch** when reachable candidates are not sampled under budget, and to **aggregation mismatch** when good local pieces are not preserved across execution. It can also create apparent specification failure if the evaluator is correct but candidate comparison is noisy or under-budgeted.

---

## 4. Eight-Axis Summary Table

| Axis | Formal object | Core diagnostic | Typical repair |
|---|---|---|---|
| Specification / reward | `R^*`, `R_proxy`, `R_eval`, `\hat R_\theta` | Is the system optimizing the wrong objective? | Objective, rubric, acceptance criteria, proxy correction. |
| Observation availability | `\Omega_sys`, `\mathcal{O}` | Did decision-relevant information enter the system? | Retrieval, data access, files, logs, clarification, measurement. |
| Belief / representation | `B_\theta` | Did observed information become correct operational state? | State extraction, entity binding, external memory, structured representation. |
| Dynamics / world model | `\hat{\mathcal T}_\theta` | Did the system mispredict action consequences? | Execution feedback, tests, sandbox, simulator, backtest. |
| Action / interface | `\mathcal A_sys` | Is the required action callable? | Tools, APIs, permissions, schemas, rollback gates. |
| Capability support / policy prior | `\pi_\theta`, effective support | Is the correct structure reachable under budget? | Examples, RAG, expert models, programmatic operators, training. |
| Fitting boundary / routing | `r_\theta`, `M_X`, `T_X` | Is the capability triggered in the right region? | Routers, mode switches, trigger boundaries, role separation. |
| Search / execution | `D` | Is a reachable candidate found, selected, preserved, and completed? | Sampling, tree search, backtracking, verifier, checkpoints. |

---

## 5. Crosswalk with the Six Primitive Mismatches

### 5.1 Primitive mismatch → possible mechanism sources

| Primitive mismatch | Common mechanism sources | Explanation |
|---|---|---|
| Observation-representation | observation availability; belief / representation; action / interface | Decisive variables may fail to enter observation, enter but fail to become operational, or require a tool/interface to observe. |
| State | observation availability; belief / representation; dynamics / world model; SGAR transition state | Relevant latent state may be unobserved, misrepresented, mispredicted across transition, or not committed as hard state. |
| Fitting-boundary | capability routing; capability support; search / execution | Capability may exist but be misrouted; low support or path lock-in may amplify boundary failure. |
| Support | capability support; observation availability; action / interface; search / execution | High-value structures may be unreachable because the system lacks information, tools, capability prior, or search coverage. |
| Aggregation | belief / representation; capability support; capability routing; search / execution; dynamics | Local parts may fail to compose because dependencies are not represented, the right composition operator is absent, routing is wrong, or execution loses structure. |
| Specification | specification / reward; belief / representation; search / execution | Objective may be wrong, misread, forgotten, or correctly defined but weakly evaluated among finite candidates. |

### 5.2 Mechanism axis → possible primitive symptoms

| Mechanism axis | Possible primitive symptoms |
|---|---|
| Specification / reward | specification mismatch; induced routing, support, or aggregation failures. |
| Observation availability | observation-representation mismatch; state mismatch; apparent support failure. |
| Belief / representation | observation-representation mismatch; state mismatch; aggregation mismatch; specification misread. |
| Dynamics / world model | state mismatch; aggregation mismatch in multi-step plans; specification failure under false consequence assumptions. |
| Action / interface | observation-representation mismatch; support mismatch; SGAR false completion. |
| Capability support | support mismatch; aggregation mismatch; apparent route failure when capability does not exist. |
| Capability routing | fitting-boundary mismatch; support narrowing; search path lock-in. |
| Search / execution | support mismatch under budget; aggregation failure; noisy evaluator selection. |

### 5.3 Why crosswalk matters

The crosswalk prevents premature repair. Consider the statement:

```text
The system failed because of support mismatch.
```

This is incomplete. The repair differs depending on mechanism profile:

```text
Support mismatch due to observation availability:
  add missing data.

Support mismatch due to action interface:
  add tool or API.

Support mismatch due to capability support:
  add examples, specialist model, or programmatic operator.

Support mismatch due to routing:
  activate the right capability mode.

Support mismatch due to search / execution:
  expand search, ranking, backtracking, or verification.
```

A structural diagnosis without mechanism localization can easily produce the wrong repair.

---

## 6. Minimal Intervention Probes

### 6.1 Purpose

A minimal intervention probe is a small, controlled change designed to distinguish mechanism causes.

The goal is not to run an external benchmark. The goal is to localize the repair target for a specific failure family.

A useful probe changes one dominant component while holding the rest as stable as possible.

### 6.2 Dependency order

A practical dependency order is:

```text
1. Specification / reward
2. Observation availability
3. Belief / representation
4. Dynamics / world model
5. Action / interface
6. Capability support / policy prior
7. Fitting boundary / capability routing
8. Search / execution
```

This order is not absolute. Low-cost probes can be run in parallel. But it encodes a warning:

```text
Do not spend all repair budget on downstream search while upstream objective, observation, representation, action, or routing conditions are still broken.
```

### 6.3 Probe table

| Suspected mechanism | Minimal intervention probe | Evidence if positive |
|---|---|---|
| Specification / reward | Change only rubric or acceptance criteria. | Output/ranking changes under same data and search. |
| Observation availability | Add one missing observation. | Reasoning method unchanged, result improves. |
| Belief / representation | Require structured extraction/state table. | No new facts added, result improves. |
| Dynamics / world model | Predict then execute/check. | Real feedback refutes model prediction. |
| Action / interface | Open one necessary tool or permission. | Task changes from guessing to verifiable action. |
| Capability support | Add examples/specialist operator. | Correct candidate appears only with added support. |
| Capability routing | Change only mode/role/router. | Existing capability appears without new facts. |
| Search / execution | Add search/backtracking/verifier. | Reachable candidate found or preserved. |

### 6.4 Causal roles

Mechanism profiles should distinguish:

| Role | Meaning |
|---|---|
| Primary cause | Removing it eliminates or substantially reduces the failure. |
| Secondary cause | Contributes to the failure but may not be sufficient alone. |
| Necessary condition | Without repair, success is impossible, but it may not have caused the observed failure. |
| Amplifier | Makes a failure more stable, fluent, or harder to repair. |
| Downstream symptom | Appears because of an upstream cause. |
| Not distinguished | Evidence is insufficient to assign a causal role. |

### 6.5 Avoiding false localization

False localization occurs when a downstream repair appears to help but does not identify the root cause.

Examples:

```text
- More search helps slightly, but only because routing remains wrong and search occasionally escapes it.
- More context helps slightly, but the true issue is representation binding.
- A stronger model helps, but the true issue is missing action interface.
- A stricter rubric helps, but the true issue is the evaluator and generator sharing the same premise.
- A tool call helps, but only because it supplies an observation that should have been explicitly requested.
```

The mechanism record should preserve this uncertainty rather than overclaiming.

---

## 7. Mechanism Profiles as Governance Objects

### 7.1 Mechanism Profile schema

A Mechanism Profile should be part of the governed object system.

```json
{
  "id": "mechanism_profile.unique_id",
  "failure_instance": "reference to reproducible failure instance",
  "artifact": "candidate artifact, output, action trace, or state transition",
  "task_context": "summary of task and true success criterion",
  "primitive_mismatches": [
    "observation_representation",
    "state",
    "fitting_boundary",
    "support",
    "aggregation",
    "specification"
  ],
  "mechanism_scores": {
    "specification_reward": "none | low | medium | high | critical | unknown | not_distinguished",
    "observation_availability": "none | low | medium | high | critical | unknown | not_distinguished",
    "belief_representation": "none | low | medium | high | critical | unknown | not_distinguished",
    "dynamics_world_model": "none | low | medium | high | critical | unknown | not_distinguished",
    "action_interface": "none | low | medium | high | critical | unknown | not_distinguished",
    "capability_support": "none | low | medium | high | critical | unknown | not_distinguished",
    "capability_routing": "none | low | medium | high | critical | unknown | not_distinguished",
    "search_execution": "none | low | medium | high | critical | unknown | not_distinguished"
  },
  "causal_roles": {
    "primary_cause": ["..."],
    "secondary_causes": ["..."],
    "necessary_conditions": ["..."],
    "amplifiers": ["..."],
    "downstream_symptoms": ["..."],
    "not_distinguished": ["..."]
  },
  "minimal_intervention_probes": [
    {
      "probe": "what was changed",
      "held_fixed": ["data", "model", "budget", "tools", "rubric"],
      "expected_signal": "what would distinguish the mechanism",
      "observed_result": "what happened",
      "interpretation": "mechanism implication"
    }
  ],
  "recommended_control_deltas": ["..."],
  "regression_guard_candidates": ["..."],
  "evidence": ["..."],
  "confidence": "low | medium | high",
  "revocation_trigger": "when this mechanism diagnosis should be weakened or revised"
}
```

### 7.2 Integration with Audit Finding

Audit Finding should not jump directly from defect to repair. It should pass through mechanism localization.

```text
Candidate Artifact
  → Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Control Delta
  → Regression Guard
  → Defect Ledger
```

An Audit Finding can say:

```json
{
  "finding": "The SQL query joins orders to customers through the wrong bridge table.",
  "primitive_mismatch": ["aggregation", "support"],
  "mechanism_profile": "mechanism_profile.sql_join_path_001",
  "mechanism_axis": "belief_representation + search_execution",
  "control_delta": "externalize schema graph and enumerate join paths before SQL rendering"
}
```

### 7.3 Integration with Control Delta taxonomy

Each mechanism axis has a corresponding Control Delta type.

| Mechanism axis | Control Delta type |
|---|---|
| Specification / reward | `SpecificationDelta` |
| Observation availability | `ObservationDelta` |
| Belief / representation | `BeliefRepresentationDelta` |
| Dynamics / world model | `DynamicsWorldModelDelta` |
| Action / interface | `ActionInterfaceDelta` |
| Policy / capability support | `CapabilitySupportDelta` |
| Fitting boundary / routing | `CapabilityRoutingDelta` |
| Search / execution | `SearchExecutionDelta` |

A generic Control Delta schema:

```json
{
  "id": "control_delta.unique_id",
  "source_finding": "audit_finding.id",
  "source_mechanism_profile": "mechanism_profile.id",
  "delta_type": "SpecificationDelta | ObservationDelta | BeliefRepresentationDelta | DynamicsWorldModelDelta | ActionInterfaceDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SearchExecutionDelta",
  "target_component": "system component to be changed",
  "change": "specific modification",
  "expected_effect": "which mechanism score should decrease",
  "side_effect_risks": ["new routing burden", "tool misuse", "latency", "proxy drift"],
  "validation": "how the delta will be checked",
  "regression_guard": "guard to prevent recurrence",
  "state_commitment_rule": "when this delta becomes active system state",
  "revocation_trigger": "when to remove or weaken the delta"
}
```

### 7.4 Integration with Regression Guards

Regression guards should be mechanism-aware.

A structural guard might say:

```text
Do not allow SQL queries with disconnected join graphs.
```

A mechanism-aware guard additionally says:

```text
Before rendering SQL, the system must produce a schema graph and enumerate the join path used by every table reference.
```

This prevents the same aggregation failure by governing the belief / representation and search / execution mechanism that produced it.

### 7.5 Integration with Defect Ledger

The Defect Ledger should track failure families by both primitive mismatch and mechanism axis.

```json
{
  "defect_family": "wrong_sql_join_path",
  "primitive_mismatches": ["aggregation", "support"],
  "mechanism_axes": ["belief_representation", "search_execution"],
  "representative_cases": ["..."],
  "control_deltas": ["external_schema_graph", "join_path_enumeration"],
  "regression_guards": ["join_graph_connectivity_guard"],
  "known_amplifiers": ["large schema", "ambiguous foreign keys", "missing sample values"],
  "revocation_or_revision_conditions": ["new schema representation makes guard redundant"]
}
```

### 7.6 Integration with SGAR

Mechanism repair should become hard state only when committed by a transition rule.

Example:

```text
S:
  System lacks SQL execution feedback.

A:
  Add SQL execution verifier.

O:
  Verifier returns execution result, error trace, row count, and timeout status.

V:
  The verifier is deterministic enough for the database snapshot and distinguishes syntax error, runtime error, empty result, and non-empty result.

S':
  SQL execution feedback is now an available mechanism component.
```

Without this commitment, the system may merely narrate that it “will use execution feedback” while continuing to behave as a language-only generator.

---

## 8. Compound Mechanism Chains

### 8.1 Mechanisms are causally coupled

The eight mechanisms are not independent modules. They influence each other in a causal chain:

```text
specification → observation selection
observation → belief state
belief state → routing and world-model use
world model → action planning
action interface → feedback availability
capability support → candidate space
routing → which support region is activated
search → which candidates are preserved
evaluation → which candidates are committed
```

This is why compound failure is common.

### 8.2 Common chain: wrong objective → wrong search

```text
wrong specification
  → wrong evidence selected
  → wrong mode activated
  → candidate space narrowed
  → search converges to wrong region
  → verifier confirms wrong proxy
```

Surface symptom:

```text
The system did not find the good candidate.
```

Mechanism profile:

```text
primary: specification / reward
secondary: routing
amplifier: search / execution
```

Repair order:

```text
1. Correct objective.
2. Correct routing under new objective.
3. Expand search only after candidate space points in the right direction.
```

### 8.3 Common chain: unobservable state → false world model → failed action

```text
key state unobservable
  → model fills gap with default prior
  → world-model prediction biased
  → action plan wrong
  → execution failure misdiagnosed as lack of capability
```

Surface symptom:

```text
The model cannot complete the task.
```

Mechanism profile:

```text
primary: observation availability
secondary: dynamics / world model
amplifier: action / interface if feedback is absent
```

Repair order:

```text
1. Add observation or clarify state.
2. Write state into representation.
3. Verify action consequences.
```

### 8.4 Common chain: missing interface → unverifiable narrative → false completion

```text
required action unavailable
  → system substitutes language description
  → no environment feedback
  → context claims completion
  → SGAR cannot validate transition
```

Surface symptom:

```text
The agent says it completed the task but nothing changed.
```

Mechanism profile:

```text
primary: action / interface
secondary: dynamics / world model
runtime failure: missing SGAR commitment
```

Repair order:

```text
1. Add effective action interface or state that action is impossible.
2. Add verifier for action effect.
3. Commit only verified transition.
```

### 8.5 Common chain: capability exists → wrong trigger → false support failure

```text
capability exists
  → prompt triggers wrong role or mode
  → correct candidate family suppressed
  → sampling repeats low-value variants
  → failure misread as capability absence
```

Surface symptom:

```text
The model never generates the right type of answer.
```

Mechanism profile:

```text
primary: fitting boundary / routing
secondary: policy support if candidate prior remains weak after rerouting
amplifier: search / execution
```

Repair order:

```text
1. Probe mode and role changes without new facts.
2. If capability appears, govern routing.
3. If not, add capability support.
4. Then expand search.
```

---

## 9. Relation to Audit Engineering

Audit Engineering says:

```text
audit is not scoring;
audit is failure localization and write-back.
```

The mechanism layer refines the localization step.

### 9.1 Before mechanism layer

```text
Candidate
  → Audit
  → Failure Localization
  → Control Delta
  → Regression Guard
```

### 9.2 After mechanism layer

```text
Candidate
  → Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Minimal Intervention Probe
  → Control Delta
  → Regression Guard
  → Defect Ledger
```

### 9.3 Why this matters

Without the mechanism layer, an audit can overfit to a surface repair.

Example:

```text
Finding:
  The answer failed to consider execution feedback.

Bad direct delta:
  Tell the model to consider execution feedback.

Mechanism-aware diagnosis:
  The system has no action interface for execution, and no state transition that writes execution results back into state.

Better delta:
  Add execution tool, define error-return schema, create predict-execute-compare loop, and commit results through SGAR.
```

The second repair changes the mechanism. The first only changes the narration.

---

## 10. Relation to Knowledge Governance

Knowledge Governance externalizes control knowledge as scoped, evidenced, revocable objects.

Mechanism profiles determine which kind of governed knowledge is needed.

| Mechanism bottleneck | Governed object |
|---|---|
| Specification / reward | rubric GKO; success-condition GKO; non-negotiable constraint GKO |
| Observation availability | observation sufficiency checklist; missing-variable ledger; source coverage record |
| Belief / representation | state table; schema graph; entity binding map; assumption ledger |
| Dynamics / world model | transition assumption; execution-feedback rule; calibration record |
| Action / interface | tool capability record; permission state; rollback rule; action schema |
| Capability support | operator library; example set; specialist module record |
| Capability routing | routing rule; mode state; trigger boundary GKO |
| Search / execution | search policy; branch record; verifier contract; checkpoint rule |

Mechanism profiles therefore help determine what should become a GKO, a Governed Escalation Object (GEO), a guard, or a hard-state record.

---

## 11. Relation to SGAR

SGAR distinguishes narrative context from hard-state authority.

Mechanism repair is often a system change:

```text
- a new tool is added;
- a verifier becomes authoritative;
- a routing rule becomes active;
- a rubric is revised;
- a state representation becomes canonical;
- a search policy is changed;
- a data source becomes available;
- a capability module is installed.
```

These changes must not exist only as prompt text. They should become committed state transitions.

Generic transition:

```text
S + A → O → V → S'
```

Mechanism repair version:

```text
S:
  current mechanism profile and available components

A:
  proposed mechanism delta

O:
  observed effect of delta or validation result

V:
  commitment criterion for accepting the delta

S':
  updated system mechanism state
```

This prevents “repair theater,” where the system claims to have added a repair but subsequent behavior is unchanged.

---

## 12. Case Illustration I: Text-to-SQL

### 12.1 Failure instance

A natural-language question is mapped to SQL over a database schema. The generated SQL executes but returns the wrong answer because it uses an incorrect join path and an overrestrictive predicate.

Surface symptom:

```text
Wrong SQL query.
```

Primitive mismatch diagnosis:

```text
aggregation mismatch:
  SELECT / JOIN / WHERE clauses are locally plausible but globally inconsistent.

support mismatch:
  correct join path did not become a live candidate.

observation-representation mismatch:
  schema semantics and sample values were not fully operationalized.
```

### 12.2 Mechanism profile

| Mechanism axis | Diagnosis |
|---|---|
| Specification / reward | Medium: execution success was over-weighted relative to semantic correctness. |
| Observation availability | Medium: foreign-key metadata and sample values were only partially visible. |
| Belief / representation | High: schema was visible but not converted into a usable schema graph. |
| Dynamics / world model | Medium: the model predicted query behavior without checking result shape. |
| Action / interface | Low or none if SQL execution is available; high if no execution interface exists. |
| Capability support | Medium: rare join pattern had weak prior. |
| Capability routing | High: generic SQL generation triggered before schema audit and join search. |
| Search / execution | High: join-path alternatives were not enumerated or compared. |

### 12.3 Repair localization

A bad repair would be:

```text
Prompt the model to be more careful with SQL joins.
```

A mechanism-aware repair is:

```text
BeliefRepresentationDelta:
  Build schema graph with table nodes, column nodes, foreign keys, semantic aliases, and sample values.

CapabilityRoutingDelta:
  Route all multi-table questions into schema-audit mode before SQL rendering.

SearchExecutionDelta:
  Enumerate join-path candidates and run execution checks.

SpecificationDelta:
  Distinguish executable SQL from semantically correct SQL.
```

### 12.4 Regression guard

A teeth-proven guard should fail if the defect is reintroduced:

```text
For each multi-table SQL query:
  1. require explicit join-path object before SQL rendering;
  2. require every table reference to be connected in the schema graph;
  3. run SQL against the database snapshot;
  4. check result shape and semantic predicate coverage;
  5. fail if the SQL uses a disconnected or unsupported join path.
```

### 12.5 SGAR commitment

```text
S:
  no canonical schema graph, direct SQL rendering allowed.

A:
  introduce schema graph and join-path enumeration.

O:
  system emits schema graph, join candidates, selected path, SQL, execution result.

V:
  selected path is graph-connected, query executes, semantic checks pass.

S':
  schema-graph-first rendering becomes committed workflow for multi-table questions.
```

---

## 13. Case Illustration II: Financial Event Strategy

### 13.1 Failure instance

A system evaluates a “limit-up / excitement event strategy” and prematurely rejects it as undeployable because it lacks supposedly orthogonal data or fails a benchmark-style factor audit.

Surface symptom:

```text
Premature No-Go judgment.
```

Primitive mismatch diagnosis:

```text
specification mismatch:
  wrong objective: benchmark excess / generic factor quality instead of deployable event-strategy return.

fitting-boundary mismatch:
  risk-control and anti-overfitting audit mode over-trigger.

support mismatch:
  event-specific operator family and conditional alpha structures are not explored.

state mismatch:
  post-event attention-continuation state is not represented.
```

### 13.2 Mechanism profile

| Mechanism axis | Diagnosis |
|---|---|
| Specification / reward | High: wrong success criterion selected. |
| Observation availability | Medium: intraday, theme, sector, order-book, transaction-cost data may be missing. |
| Belief / representation | High: event-state is not represented as a trackable condition. |
| Dynamics / world model | High: next-day buyability and multi-day continuation are guessed. |
| Action / interface | Medium or high: no backtester or operator generator available. |
| Capability support | High: event-operator family is weak or absent. |
| Capability routing | Critical: system enters No-Go audit instead of mechanism-to-operator search. |
| Search / execution | High: only narrow variables are explored. |

### 13.3 Repair localization

The main issue is not simply “more data.” A better intervention order is:

```text
1. SpecificationDelta:
   redefine objective around buyability, absolute net return, cost, slippage, capacity, and multi-day continuation.

2. BeliefRepresentationDelta:
   represent post-event attention continuation as a state variable.

3. DynamicsWorldModelDelta:
   verify next-day buyability and holding-period assumptions against real data or backtest feedback.

4. CapabilityRoutingDelta:
   enter mechanism-to-operator construction mode before No-Go audit.

5. CapabilitySupportDelta:
   add event-specific operator families.

6. SearchExecutionDelta:
   run combinatorial search under corrected objective and routing.

7. ObservationDelta:
   add new data only when it provides irreplaceable information gain under the corrected specification.
```

This avoids the common failure of explaining everything as “not enough data” while continuing to optimize the wrong objective in the wrong mode.

---

## 14. Case Illustration III: Tool-Using Code Agent

### 14.1 Failure instance

An agent claims it fixed a bug after editing code, but tests were not run, the patch imports a nonexistent API, and the system marks the task complete.

Primitive mismatch diagnosis:

```text
observation-representation mismatch:
  test results and API availability did not enter state.

state mismatch:
  completion state was incorrectly inferred.

aggregation mismatch:
  local patch plausibility did not compose into working code.

specification mismatch:
  "patch written" was treated as "bug fixed".
```

### 14.2 Mechanism profile

| Mechanism axis | Diagnosis |
|---|---|
| Specification / reward | High: completion criterion is wrong. |
| Observation availability | High: tests and dependency metadata absent. |
| Belief / representation | Medium: patch state not separated from verified fix state. |
| Dynamics / world model | High: code behavior predicted rather than executed. |
| Action / interface | High if tests cannot be run; low if test tool exists. |
| Capability support | Low to medium depending on code complexity. |
| Capability routing | Medium: agent routed into completion narration instead of verification. |
| Search / execution | Medium: no rollback/checkpoint after failed test. |

### 14.3 Mechanism-aware repair

```text
SpecificationDelta:
  Define "fixed" as passing relevant tests or verified reproduction case, not merely patch generation.

ObservationDelta:
  Expose test output, dependency versions, and runtime errors.

DynamicsWorldModelDelta:
  Require predict-run-compare for code changes.

ActionInterfaceDelta:
  Provide sandboxed test execution and rollback.

CapabilityRoutingDelta:
  Route after patch generation into verification mode.

SearchExecutionDelta:
  Maintain patch checkpoints and branch from test failures.

SGAR transition:
  Completion state can be committed only after verifier accepts test or reproduction evidence.
```

---

## 15. Use Principles and Limits

### 15.1 Mechanism names are not evidence

Calling a failure “routing mismatch” does not prove routing is the cause. Every mechanism judgment should be attached to evidence:

```text
- a reproducible failure instance;
- a minimal intervention probe;
- an observed change;
- a stated confidence level;
- a revocation trigger.
```

Without evidence, the profile should say:

```text
hypothesis, not distinguished
```

### 15.2 One intervention may affect several mechanisms

Interventions are not mechanically pure. A single change often affects multiple axes.

```text
RAG may add observation and capability support.
Tool execution may expand action space and calibrate world model.
Structured prompting may repair representation and change routing.
A stronger model may improve support, representation, and routing simultaneously.
```

Therefore, a repair record should state which intermediate variable it is expected to change, not merely report final improvement.

### 15.3 Larger models are not universal repair

Scaling may improve representation, support, and world modeling. But it does not automatically repair:

```text
wrong objectives;
unobservable variables;
missing permissions;
invalid action interfaces;
incorrect evaluators;
state commitment failures;
wrong routing boundaries.
```

It may also make wrong answers more fluent and wrong routing more stable.

### 15.4 Larger search is not default repair

Larger search is useful only under certain conditions:

```text
correct objective;
sufficient observations;
usable representation;
available action space;
adequate capability support;
correct routing;
recognizable candidate quality.
```

Otherwise, larger search optimizes the wrong target, searches the wrong space, or produces more polished variants of the same failure.

### 15.5 More tools are not default repair

Tools help when they expand the effective action or observation space in a verifiable way. They hurt when:

```text
tool selection is misrouted;
tool outputs are not represented;
permissions are unclear;
errors are swallowed;
state transitions are not committed;
irreversible actions lack gates;
search burden increases without verifier authority.
```

### 15.6 Mechanism repair should be revocable

A mechanism diagnosis should not become permanent dogma. Every mechanism-level repair should specify:

```text
support scope;
known counterexamples;
side-effect risks;
dependent tool/model/data versions;
review date;
revocation trigger.
```

---

## 16. Self-Audit of the Mechanism Layer

The mechanism layer itself should be governed as a theoretical object.

```json
{
  "id": "gko.formal_mechanism_layer",
  "type": "theoretical_claim",
  "condition": "LLM systems analyzed as approximate decision systems with objectives, observations, belief state, world model, action space, policy support, routing, and search/execution procedures.",
  "assertion": "Failures can be localized for repair along eight intervenable mechanism axes: specification/reward, observation availability, belief/representation, dynamics/world model, action/interface, policy/capability support, fitting-boundary/routing, and search/execution.",
  "strength": "structural-intervention claim",
  "support_scope": "Repair localization for governed LLM systems, agents, tool-using workflows, and high-value inference-time systems.",
  "not_supported_claims": [
    "Does not replace the six primitive mismatches.",
    "Does not claim each failure has exactly one mechanism cause.",
    "Does not claim the eight axes are causally independent.",
    "Does not claim minimal intervention probes are always clean or cheap."
  ],
  "revocation_trigger": "Discovery of a recurring, repair-relevant system component that cannot be represented as objective, observation, belief/representation, dynamics/world model, action/interface, support, routing, or search/execution without losing intervention specificity."
}
```

A self-audited theory should make clear what would force it to revise itself.

---

## 17. Compressed Operating Protocol

For a concrete failure, use the following protocol:

```text
1. Freeze the failure instance.
   Record input, context, tools, model, prompt, budget, output, evaluator, and expected success criterion.

2. Identify primitive mismatch symptoms.
   observation-representation, state, fitting-boundary, support, aggregation, specification.

3. Build mechanism hypotheses.
   specification, observation, belief, dynamics, action, support, routing, search.

4. Run minimal intervention probes where useful.
   Change one dominant component at a time.

5. Assign causal roles.
   primary cause, secondary cause, necessary condition, amplifier, downstream symptom, not distinguished.

6. Construct or revise the task-specific control object.
   Turn the lesion into something auditable and directly modifiable.

7. Produce Control Delta.
   Modify the governed object first; record mechanism attribution alongside it.

8. Add Regression Guard.
   Ensure representative recurrence of the defect fails.

9. Commit through SGAR.
   Only verified repair becomes hard state.

10. Record in Defect Ledger.
   Store failure family, mechanism profile, deltas, guards, and revocation rules.
```

---

## 18. Conclusion

The Formal Mechanism Layer completes an important bridge in the governed-LLM theory stack.

The six primitive mismatches explain how task value is structurally lost. They are not merely explanatory labels; they are task-anchored engineering entry points. They tell us what kind of governed task object must be constructed before repair becomes durable. Structural diagnosis alone does not determine which component should be changed, but it does expose where engineering should begin.

A mechanism profile is not a decorative label. It is a derived repair-localization object. It records which components are primary causes, which are amplifiers, which are downstream symptoms, what minimal intervention evidence supports the diagnosis, and which recurrent operationalized failures justify promotion beyond local runtime governance.

This layer also clarifies why common repairs fail. Larger models do not fix missing observations, wrong objectives, unavailable actions, or uncommitted state. Larger search does not help when the system searches the wrong space. More tools do not help when tool results are not represented, routed, verified, or committed. Better prompts do not repair absent action interfaces or false world models.

The mechanism layer turns diagnosis into a question of system anatomy:

```text
What exactly must be changed so that the same failure family does not recur?
```

In the shortest form:

> Six mismatches find the lesion. Task objects expose the tissue. Mechanism axes explain the anatomy. Audit deltas perform the cut.

---

## Appendix A: Mechanism Checklist

```text
Specification / Reward
[ ] Is the true objective explicitly stated?
[ ] Are proxy metrics distinguished from true utility?
[ ] Does the evaluator rank candidate pairs correctly?
[ ] Are non-negotiable constraints represented?
[ ] Are Goodhart risks identified?

Observation Availability
[ ] Did all task-critical variables enter the system?
[ ] Are timestamps, versions, and coverage known?
[ ] Is raw evidence available where summaries are insufficient?
[ ] Can the system ask clarifying questions or retrieve missing data?

Belief / Representation
[ ] Are facts, assumptions, decisions, and open questions separated?
[ ] Are entities, dates, units, tables, and columns bound correctly?
[ ] Is state externalized rather than held in narrative context?
[ ] Are dependencies represented explicitly?

Dynamics / World Model
[ ] Are action consequences predicted or checked?
[ ] Is execution feedback available?
[ ] Are tests, sandboxes, simulators, or backtests used when needed?
[ ] Are prediction errors written back into state?

Action / Interface
[ ] Is the required action actually callable?
[ ] Does the tool schema express the needed operation?
[ ] Are permissions and rollback gates defined?
[ ] Are action results observable and verifiable?

Capability Support
[ ] Is the correct candidate family in effective support?
[ ] Do repeated samples diversify into high-value structures?
[ ] Are examples, retrieval, specialist models, or operators needed?
[ ] Is capability absence distinguished from routing failure?

Capability Routing
[ ] Is the right mode triggered?
[ ] Are over-triggering and under-triggering cases known?
[ ] Would role/mode changes elicit the missing capability?
[ ] Are routing rules explicit, auditable, and revocable?

Search / Execution
[ ] Is the correct candidate reachable under budget?
[ ] Is the candidate preserved through planning and execution?
[ ] Is there backtracking, branching, ranking, or independent verification?
[ ] Are checkpoints and failed branches recorded?
```

---

## Appendix B: Compact Schema Bundle

### B.1 Mechanism Profile

```json
{
  "id": "mechanism_profile.id",
  "failure_instance": "...",
  "primitive_mismatches": ["..."],
  "mechanism_scores": {
    "specification_reward": "...",
    "observation_availability": "...",
    "belief_representation": "...",
    "dynamics_world_model": "...",
    "action_interface": "...",
    "capability_support": "...",
    "capability_routing": "...",
    "search_execution": "..."
  },
  "causal_roles": {
    "primary_cause": ["..."],
    "secondary_causes": ["..."],
    "necessary_conditions": ["..."],
    "amplifiers": ["..."],
    "downstream_symptoms": ["..."],
    "not_distinguished": ["..."]
  },
  "minimal_intervention_probes": ["..."],
  "recommended_control_deltas": ["..."],
  "regression_guards": ["..."],
  "confidence": "low | medium | high",
  "revocation_trigger": "..."
}
```

### B.2 Mechanism-Aware Audit Finding

```json
{
  "id": "audit_finding.id",
  "artifact": "...",
  "finding": "...",
  "evidence": ["..."],
  "primitive_mismatch": ["..."],
  "mechanism_profile": "mechanism_profile.id",
  "severity": "low | medium | high | critical",
  "mechanism_axis": "...",
  "control_delta": "control_delta.id",
  "regression_guard": "regression_guard.id",
  "confidence": "low | medium | high"
}
```

### B.3 Mechanism-Aware Control Delta

```json
{
  "id": "control_delta.id",
  "delta_type": "SpecificationDelta | ObservationDelta | BeliefRepresentationDelta | DynamicsWorldModelDelta | ActionInterfaceDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SearchExecutionDelta",
  "source_finding": "audit_finding.id",
  "source_mechanism_profile": "mechanism_profile.id",
  "target_component": "...",
  "change": "...",
  "expected_effect": "...",
  "validation": "...",
  "regression_guard": "...",
  "state_commitment_rule": "...",
  "side_effect_risks": ["..."],
  "revocation_trigger": "..."
}
```

---

## Appendix C: Glossary

| Term | Definition |
|---|---|
| Primitive mismatch | A task-value structural failure mode in the world-to-output pipeline. |
| Mechanism axis | An intervenable system component that can produce or repair a failure. |
| Mechanism Profile | Evidence-bearing record of which mechanism axes contributed to a failure and how. |
| Minimal Intervention Probe | A small controlled change used to distinguish mechanism causes. |
| Control Delta | A localized modification to the governed control space or system component. |
| SpecificationDelta | Repair to objective, rubric, proxy, or acceptance criteria. |
| ObservationDelta | Repair to observation channel, data access, missing variable, or measurement. |
| BeliefRepresentationDelta | Repair to structured state, entity binding, memory, schema, or representation. |
| DynamicsWorldModelDelta | Repair to prediction of action consequences via feedback or calibration. |
| ActionInterfaceDelta | Repair to available tools, APIs, permissions, schemas, or workflow gates. |
| CapabilitySupportDelta | Repair to candidate support through examples, retrieval, expert modules, or operators. |
| CapabilityRoutingDelta | Repair to trigger boundaries, modes, roles, or routers. |
| SearchExecutionDelta | Repair to sampling, branch search, verification, ranking, checkpoints, or execution. |
| GKO (Governed Knowledge Object) | Externalized control knowledge represented as a scoped, evidenced, revocable governance object. |
| GEO (Governed Escalation Object) | Governance object that records when and how a failure should be escalated for human or higher-authority handling. |
| SGAR (State-Governed Agent Regime) | Regime that distinguishes narrative context from hard-state authority and commits only verified state transitions. |
| SGAR commitment | Hard-state transition that makes a repair, action, or state update authoritative. |
