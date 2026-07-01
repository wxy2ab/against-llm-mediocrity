# Observation-Representation Mismatch and Channel Governance in LLM Systems

**Variable Entry, Representation Ceilings, and Pre-Governance Repair**  
**Companion Technical Report to _A Structural Theory of Value Preservation in LLM Systems_**  
**Working Draft v0.1**  

---

## Contents

- [Abstract](#abstract)
- [1. Introduction](#1-introduction)
- [2. Position in the Unified Theory](#2-position-in-the-unified-theory)
- [3. Formal Setup](#3-formal-setup)
- [4. Observation-Representation Mismatch vs State Mismatch](#4-observation-representation-mismatch-vs-state-mismatch)
- [5. A Taxonomy of Observation-Representation Failures](#5-a-taxonomy-of-observation-representation-failures)
- [6. Representation-Induced Ceilings](#6-representation-induced-ceilings)
- [7. Variable Entry Criteria](#7-variable-entry-criteria)
- [8. Channel Governance](#8-channel-governance)
- [9. Audit Engineering for Observation-Representation Mismatch](#9-audit-engineering-for-observation-representation-mismatch)
- [10. Interaction with Other Mismatches](#10-interaction-with-other-mismatches)
- [11. Text-to-SQL as a Canonical Case](#11-text-to-sql-as-a-canonical-case)
- [12. Code, Agents, and Research Workflows](#12-code-agents-and-research-workflows)
- [13. Design Patterns for Channel Governance](#13-design-patterns-for-channel-governance)
- [14. Relation to Existing Formal Traditions](#14-relation-to-existing-formal-traditions)
- [15. When Channel Governance Is Not Needed](#15-when-channel-governance-is-not-needed)
- [16. Self-Audit of the Concept](#16-self-audit-of-the-concept)
- [17. Minimal Diagnostic Checklist](#17-minimal-diagnostic-checklist)
- [18. Conclusion](#18-conclusion)
- [Appendix A: Compact Glossary](#appendix-a-compact-glossary)
- [Appendix B: Representation Contract Template](#appendix-b-representation-contract-template)
- [Appendix C: Observation-Representation Audit Finding Template](#appendix-c-observation-representation-audit-finding-template)
- [Appendix D: Variable Entry Test](#appendix-d-variable-entry-test)

---

## Abstract

Large language model systems do not act directly on the world. They act on observations, retrieved fragments, compressed context, database schemas, tool outputs, screenshots, logs, summaries, embeddings, serialized state, and prompt representations. Many high-value failures therefore occur before reasoning begins. The decisive variable is not misreasoned about; it never enters the operational representation. Or it enters in a form that is aliased, flattened, decontextualized, truncated, stale, unbound, or unusable for control.

This report develops **observation-representation mismatch** as the first primitive mismatch in a structural theory of value preservation for LLM systems. If `S_world` is the task world, `φ` the observation function, `ψ` the representation function, and `Z = ψ(φ(S_world))` the model-accessible control representation, observation-representation mismatch occurs when task-relevant distinctions in `S_world` are collapsed or made operationally inaccessible in `Z`. The resulting failure is a **representation-induced ceiling**: no amount of downstream reasoning, critique, reranking, or self-reflection over the same `Z` can reliably recover the value that was lost upstream.

The report clarifies the boundary between observation-representation mismatch and state mismatch. State mismatch asks: given the available representation, which latent state are we in? Observation-representation mismatch asks: did the variables needed to make that state or value distinction enter the representation at all? The first is a problem of inference under a representation. The second is a problem of transduction into that representation.

We then introduce **channel governance**: a pre-governance discipline for ensuring that value-critical variables enter, survive, bind correctly, remain discriminative, and become operational in the control space. Channel governance precedes Knowledge Governance. Before a system can govern knowledge about a task, it must govern the channels through which the task becomes visible.

The report provides formal definitions, diagnostic criteria, repair operators, audit patterns, Governed Knowledge Object (GKO) templates, regression guards, and examples across text-to-SQL, code systems, tool-using agents, research workflows, and long-horizon state-governed agents. The central rule is simple:

```text
Before governing knowledge, verify that the variables to be governed have entered the representation.
```

### Relationship to the Diagnostic–Mechanism Bridge

This document uses the six primitive mismatches as value-preservation diagnostics. When a failure requires repair, the Diagnostic–Mechanism Bridge should be used to map the diagnosis to an eight-axis mechanism target and a repair layer:

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

---

## 1. Introduction

A common response to LLM failure is to ask the model to reason more carefully. The system adds chain-of-thought, critique, reflection, debate, self-consistency, planning, retrieval, or tool use. These techniques can be valuable. But they share a hidden assumption: that the representation available to the model contains the variables required to solve the task.

This assumption often fails.

A model cannot infer a database value that was never retrieved. It cannot reason over a schema relation that was flattened out of the prompt. It cannot preserve a temporal dependency if the log window omits the relevant event. It cannot distinguish two user intents if the interface collapsed them into the same summary. It cannot route to a specialized audit capability if the trigger evidence was removed by compression. It cannot make a state transition trustworthy if the observation authority only reports a narrative paraphrase of the tool result.

In such cases, the problem is not that the model lacks intelligence in the abstract. The problem is that the decisive structure of the task has not entered the model-accessible control representation.

This report studies that failure mode.

We call it **observation-representation mismatch**. It is the first station in the value-preservation pipeline:

```text
S_world --φ--> O --ψ--> Z
```

where:

- `S_world` is the underlying task world: database, codebase, market state, user situation, document corpus, environment, or workflow state.
- `φ` is the observation function: sensing, logging, retrieval, database query, screenshot capture, file read, API call, user description, or tool output.
- `O` is the observed data.
- `ψ` is the representation function: encoding, tokenization, prompt construction, schema serialization, summarization, embedding, compression, filtering, or formatting.
- `Z` is the operational representation used by the model and the surrounding system.

Observation-representation mismatch occurs when the map `S_world → O → Z` fails to preserve task-relevant distinctions. Once the distinction is lost, downstream reasoning operates over a projection of the task rather than the task itself.

This is why observation-representation mismatch must be treated as a primitive mismatch, not as a special case of hallucination, missing context, or weak reasoning. It has a distinct location in the pipeline, a distinct failure mechanism, and distinct repair targets.

The repair target is not primarily better prose. It is channel repair.

```text
repair the measurement
repair the retrieval
repair the schema
repair the serialization
repair the binding
repair the provenance
repair the update path
repair the representation contract
```

Only after these repairs does ordinary Knowledge Governance become meaningful. A governed knowledge object about a missing or aliased variable is not governance; it is governance over a projection.

---

## 2. Position in the Unified Theory

The structural theory of value preservation models an LLM system as a world-to-output pipeline:

```text
S_world
  -- φ --> O
  -- ψ --> Z
  -- ρ --> activated capabilities
  -- pθ --> candidate support
  -- A --> output aggregation
  -- Ũ / U --> evaluation
```

The six primitive mismatches correspond to structurally distinct stations in this pipeline:

| Pipeline Station | Primitive Mismatch | Question |
|---|---|---|
| `S_world → O → Z` | Observation-representation mismatch | Did the decisive variable enter the operational representation? |
| `Z → latent state` | State mismatch | Given the representation, which latent state are we in? |
| `Z → capability activation` | Fitting-boundary mismatch | Was the right capability activated in the right domain? |
| `pθ` and search budget | Support mismatch | Is the high-value structure reachable under the policy and budget? |
| local parts → global artifact | Aggregation mismatch | Do locally good parts compose into global value? |
| accessible proxy vs true utility | Specification mismatch | Does the evaluator represent real task value? |

Observation-representation mismatch is the first station because all later operations depend on the representation. If value-critical variables are absent or aliased in `Z`, the downstream system may still appear sophisticated. It may plan, critique, retrieve, debate, revise, and validate. But these operations are confined to the information geometry of `Z`.

The key consequence is a ceiling:

```text
No downstream policy over Z can reliably exceed the value ceiling induced by the distinctions lost in S_world → O → Z.
```

This is the foundational reason to place observation-representation mismatch before Knowledge Governance, Audit Engineering, and the State-Governed Agent Regime (SGAR).

Knowledge Governance governs control knowledge. But control knowledge must be about variables that have entered the control representation.

Audit Engineering localizes failures and writes them back into the control space. But audit findings require evidence channels that expose the relevant defect.

SGAR commits state transitions. But a transition is only as trustworthy as the observation and verification channels that authorize it.

Therefore, observation-representation mismatch is not a peripheral issue. It is the substrate on which all later governance depends.

---

## 3. Formal Setup

Let `S` denote the space of possible world states. Let `A` denote the space of possible actions or outputs. Let `U(a, s)` be the true task utility of action `a` in world state `s`.

The system does not observe `s` directly. It observes:

```text
O = φ(s)
```

and constructs an operational representation:

```text
Z = ψ(O) = ψ(φ(s))
```

A downstream policy chooses an action from `Z`:

```text
π: Z → A
```

The best achievable value under representation `Z` is:

```text
V_Z = max_π E_s [ U(π(Z(s)), s) ]
```

The best achievable value under direct access to `S` is:

```text
V_S = max_π E_s [ U(π(s), s) ]
```

A representation-induced ceiling exists when:

```text
V_Z < V_S
```

This gap is not necessarily caused by weak inference. It may be caused by the coarsening introduced by `φ` or `ψ`.

### 3.1 Equivalence Classes Induced by Representation

The representation `Z` induces an equivalence relation over world states:

```text
s1 ~_Z s2  iff  Z(s1) = Z(s2)
```

If two world states map to the same operational representation, the policy must choose the same action for both:

```text
Z(s1) = Z(s2)  ⇒  π(Z(s1)) = π(Z(s2))
```

If the optimal actions differ across those states:

```text
argmax_a U(a, s1) ≠ argmax_a U(a, s2)
```

then no deterministic policy over `Z` can be optimal for both. Even stochastic policies cannot fully recover the lost distinction unless the utility structure rewards hedging in exactly the right way.

This is the core of observation-representation mismatch.

### 3.2 Control Sufficiency

A representation `Z` is **control-sufficient** for a task if all world states collapsed by `Z` have the same optimal control implications.

Formally, `Z` is control-sufficient when:

```text
Z(s1) = Z(s2)  ⇒  Argmax_a U(a, s1) = Argmax_a U(a, s2)
```

or, more weakly, when the value loss from using the same action over each equivalence class is below an acceptable threshold.

Observation-representation mismatch exists when `Z` is not control-sufficient.

### 3.3 Variable Entry

Let `V*` be a set of task-critical variables. A variable `v ∈ V*` has **entered** the operational representation only if it satisfies five conditions:

1. **Observed**: the channel `φ` captures information about `v`.
2. **Retained**: the representation function `ψ` does not erase or collapse `v`.
3. **Bound**: `v` is linked to the correct entity, time, source, schema element, or state.
4. **Discriminative**: changes in `v` produce changes in `Z` that the system can distinguish.
5. **Operational**: the system can use `v` to route, search, audit, render, verify, or update state.

A variable is not meaningfully present merely because some string related to it appears in context. A variable has entered the representation only if it can affect control.

This distinction is crucial. Many LLM systems contain surface traces of relevant information while lacking operational representation of that information.

Examples:

```text
A database column name appears, but its semantic meaning is not bound.
A log line appears, but its timestamp relation is lost.
A user preference is summarized, but its exception condition is erased.
A schema is retrieved, but foreign-key constraints are omitted.
A tool result is paraphrased, but exact values and provenance are removed.
A document is embedded, but the retrieval chunk omits the table footnote that changes interpretation.
```

In each case, the variable may be textually present but control-absent.

---

## 4. Observation-Representation Mismatch vs State Mismatch

Observation-representation mismatch and state mismatch are closely related but distinct.

State mismatch asks:

```text
Given Z, which latent state h are we in?
```

Observation-representation mismatch asks:

```text
Did the variables required to distinguish task-relevant states or utilities enter Z?
```

The boundary can be summarized as follows:

| Issue | Observation-Representation Mismatch | State Mismatch |
|---|---|---|
| Pipeline location | `S_world → O → Z` | inference over latent state from `Z` |
| Core failure | variable or distinction lost before reasoning | state ambiguous under available representation |
| Typical symptom | model cannot consider the decisive factor | model considers multiple plausible regimes but misidentifies or fails to branch |
| Repair target | measurement, retrieval, serialization, schema, channel, representation | state enumeration, discriminator, clarification, belief update, branching policy |
| Question | Did the variable enter? | Given entered variables, what state are we in? |

A state mismatch can remain even after channel repair. For example, a user may provide all available symptoms, yet the diagnosis remains uncertain. That is state ambiguity.

An observation-representation mismatch occurs when the relevant symptom was never collected, was summarized away, or was represented in a way that prevents the model from using it.

The distinction matters because the repair differs.

State mismatch invites:

```text
ask a clarifying question
maintain multiple hypotheses
compute value of information
branch policy by state
track belief updates
```

Observation-representation mismatch invites:

```text
collect a missing variable
change the retrieval query
inspect the raw file
include exact tool output
preserve schema constraints
repair serialization
avoid lossy compression
```

If a system treats observation-representation mismatch as state mismatch, it may produce elegant uncertainty over an impoverished representation. If it treats state mismatch as observation-representation mismatch, it may over-collect data when the real need is better inference or branching.

---

## 5. A Taxonomy of Observation-Representation Failures

Observation-representation mismatch is not one surface error. It is a family of upstream value-preservation failures.

### 5.1 Missing Channel

The system has no channel for a task-critical variable.

Examples:

```text
A code agent cannot read environment variables that determine test behavior.
A text-to-SQL system cannot inspect database values when the question depends on value distribution.
A research assistant cannot access the methods appendix that defines the outcome variable.
An agent claims file completion without reading the file system state.
```

Repair requires adding or authorizing a channel, not merely prompting the model.

### 5.2 Selective Retrieval Failure

The information exists in the corpus but retrieval fails to surface it.

This is not simply a RAG quality issue. Retrieval is part of `φ` and `ψ`. If retrieval selects chunks that omit the decisive condition, downstream generation operates over a distorted world.

Repair targets include query expansion, chunk boundary redesign, metadata retrieval, table-aware retrieval, citation expansion, and coverage audits.

### 5.3 Compression Erasure

The system summarizes or compresses context and deletes variables that later become decisive.

Compression is useful when it preserves control-relevant structure. It is dangerous when it optimizes for narrative coherence rather than future control.

Examples:

```text
"The user wants a concise professional tone" erases the exception "unless writing to technical reviewers."
"The task concerns sales data" erases the date range and exclusion criteria.
"The tests failed due to configuration" erases the exact failing assertion.
```

Repair requires provenance-preserving compression and variable retention rules.

### 5.4 Schema Flattening

Structured relationships are flattened into natural language or lists, destroying constraints.

This is common in text-to-SQL, code analysis, knowledge graphs, spreadsheets, and workflow systems.

Examples:

```text
foreign keys omitted from a database schema
spreadsheet formulas rendered only as displayed values
class inheritance flattened into file summaries
API types described without required/optional field constraints
```

Repair requires preserving structure as structure, not only as prose.

### 5.5 Format-Induced Aliasing

Different values become indistinguishable because the representation format collapses them.

Examples:

```text
numeric precision lost by rounding
units omitted from measurements
same display name used for different database columns
time zones normalized incorrectly
IDs replaced by human-readable names that are not unique
```

Repair requires disambiguating identifiers, units, precision, and provenance.

### 5.6 Temporal Snapshot Mismatch

The representation reflects the wrong time slice of a dynamic world.

Examples:

```text
agent context says a task is incomplete, but a tool has completed it
retrieved documentation is stale
calendar availability changed after summarization
market state changed after a cached observation
file content changed after initial read
```

Repair requires timestamped observations, freshness rules, state invalidation, and re-observation triggers.

### 5.7 Tool-Result Impoverishment

A tool returns rich information, but the system passes only a simplified or paraphrased version to the model.

Examples:

```text
execution result includes error code, stack trace, and stderr, but prompt includes only "failed"
database query returns rows and types, but prompt includes only row count
webpage extraction omits tables, captions, or footnotes
static analyzer returns locations, but summary loses line numbers
```

Repair requires preserving exact tool outputs when precision matters and attaching summaries to raw evidence rather than replacing raw evidence.

### 5.8 Binding Failure

A variable enters the representation but is bound to the wrong entity, column, time, source, user, or scope.

Examples:

```text
"revenue" bound to gross revenue rather than net revenue
"current version" bound to the library version in training data rather than the installed version
"last quarter" bound to calendar quarter rather than fiscal quarter
"customer" bound to account owner rather than end user
```

Binding failure is especially dangerous because the representation appears complete while control is wrong.

### 5.9 Negative-Space Failure

The system cannot represent the absence of expected evidence.

Examples:

```text
no foreign key exists between two tables
no rows match a predicate
no test covers a changed behavior
no policy exception is listed
no event occurred after a given timestamp
```

Many LLM representations are biased toward present text. But absence can be decisive. Channel governance must represent negative evidence as a first-class observation.

### 5.10 Authority Collapse

The representation fails to distinguish authoritative observations from guesses, summaries, stale memory, model-generated claims, or user speculation.

Examples:

```text
model-generated plan stored beside verified tool result
human assumption stored beside database fact
old memory stored beside current observation
unverified summary stored beside commit record
```

Repair requires provenance, authority labels, and commitment status.

---

## 6. Representation-Induced Ceilings

The most important theoretical consequence of observation-representation mismatch is that it creates ceilings no downstream policy can reliably exceed.

### Claim (informal): Representation-Induced Value Ceiling

Observation-representation mismatch induces a ceiling on downstream performance.

This is a structural argument rather than a fully formal proof. Its role is to mark a representation-level limit on recoverable task value.

Let `S` be the world state, `O` the observation, and `Z = ψ(O)` the system's operational representation. Let `V(S)`, `V(O)`, and `V(Z)` denote the best achievable expected task utility by policies that can condition on `S`, `O`, and `Z`.

Because `Z` is a post-processing of `O`, and `O` is a partial observation of `S`:

```text
V(S) ≥ V(O) ≥ V(Z)
```

If two task-relevant world states are collapsed into the same `Z` with positive probability and require different optimal actions, then:

```text
V(S) > V(Z)
```

This is the representation-induced ceiling. Once the decisive distinction is collapsed before `Z`, no downstream policy restricted to `Z` can reliably recover it without additional observation, channel repair, or representation repair.

Suppose two world states `s1` and `s2` are mapped to the same representation:

```text
Z(s1) = Z(s2)
```

but require different optimal actions:

```text
a1* = argmax_a U(a, s1)
a2* = argmax_a U(a, s2)
a1* ≠ a2*
```

A policy over `Z` must choose the same action for both. Therefore at least one state receives a suboptimal action. This is not an error of insufficient reasoning; it is a consequence of representation collapse.

### 6.1 Ceiling Under Deterministic Policy

If `π(Z(s1)) = π(Z(s2))`, then:

```text
U(π(Z(s1)), s1) < U(a1*, s1)
```

or:

```text
U(π(Z(s2)), s2) < U(a2*, s2)
```

unless one action happens to be optimal for both.

### 6.2 Ceiling Under Stochastic Policy

A stochastic policy can randomize, but randomization does not restore the lost distinction. It can at best hedge according to the conditional distribution over states within the equivalence class:

```text
π(a | Z=z)
```

If task value requires state-specific action rather than hedging, the ceiling remains.

### 6.3 Ceiling Under Self-Reflection

Self-reflection, critique, debate, and multi-sampling operate over `Z` unless they trigger new observations. If the procedure only transforms the same representation, it remains bounded by the same equivalence classes.

This yields a diagnostic rule:

```text
If multiple reasoning rounds produce different rationalizations over the same missing variable, the repair target is probably not reasoning. It is channel repair.
```

### 6.4 Ceiling Under Retrieval

Retrieval can repair observation-representation mismatch only when it changes `O` or `Z` in a way that introduces the missing distinction. Retrieval that returns more of the same projection does not repair the mismatch.

This is why retrieval systems need coverage audits, not just relevance ranking. The highest-ranked chunks may all share the same missing variable.

### 6.5 Ceiling Under External Verification

External verification can reveal observation-representation mismatch if the verifier has access to the missing variable. But a verifier operating over the same impoverished representation inherits the ceiling.

This distinction is central in governed systems:

```text
A verifier must have independent access to the variables it is supposed to verify.
```

Otherwise verification becomes proxy theater.

---

## 7. Variable Entry Criteria

A variable should not be treated as entered merely because it appears in text. Channel governance requires a stricter test.

A task-critical variable `v` has entered the control representation if it is:

```text
observed
retained
bound
discriminative
operational
```

### 7.1 Observed

The system has a channel that can capture information about `v`.

Questions:

```text
Which tool, file, database, log, sensor, user input, or document provides v?
Is the channel authorized?
Is the channel fresh?
Is the channel complete enough for the decision?
```

### 7.2 Retained

The variable survives transformation from observation to representation.

Questions:

```text
Does retrieval include it?
Does summarization preserve it?
Does serialization encode it?
Does truncation remove it?
Does formatting collapse it?
```

### 7.3 Bound

The variable is attached to the correct entity, scope, time, unit, source, and authority.

Questions:

```text
Which object does v describe?
What time does it refer to?
What unit or scale is it in?
Which source asserted it?
Is it observed, inferred, or guessed?
```

### 7.4 Discriminative

Different values of `v` produce different operational consequences in `Z`.

Questions:

```text
Would changing v change the representation?
Would the model or router notice the change?
Would the verifier distinguish the change?
Would the policy choose differently?
```

### 7.5 Operational

The system can use the variable to route, search, audit, render, verify, or commit state.

Questions:

```text
Can v trigger a capability?
Can v constrain candidate generation?
Can v be cited in an audit finding?
Can v be used in a regression guard?
Can v affect a state transition?
```

If any condition fails, the variable is not fully entered.

---

## 8. Channel Governance

**Channel governance** is the discipline of ensuring that task-critical variables enter and survive the observation-representation pipeline in a control-usable form.

It is prior to Knowledge Governance:

```text
Channel Governance → Knowledge Governance → Audit Engineering → State Governance
```

This ordering is not rigid in implementation, but it is conceptually important. A system may discover a channel failure through audit, and that discovery may update state. But the repair target remains upstream: the channel or representation must be fixed before downstream governance can become reliable.

### 8.1 Channel Governance Loop

A minimal channel governance loop is:

```text
1. Identify value-critical variables.
2. Map the observation channels that can expose them.
3. Map representation transformations that may erase or distort them.
4. Audit whether the variables enter Z.
5. Repair missing, aliased, stale, or unbound variables.
6. Register representation contracts as governed objects.
7. Monitor future observations for drift, omission, and revocation triggers.
```

### 8.2 Representation Contracts

A representation contract states what a representation must preserve for a task class.

Example:

```json
{
  "id": "gko.text2sql.schema_representation_contract",
  "type": "representation_contract",
  "condition": "text-to-SQL generation over relational databases",
  "assertion": "The representation must preserve table names, column names, column descriptions when available, primary keys, foreign keys, sample values when value grounding is needed, and provenance for each schema element.",
  "strength": "hard",
  "evidence": "SQL correctness depends on schema linking, join-path selection, and value grounding.",
  "revocation_trigger": "If a database dialect or task setting provides equivalent constraints through another verified representation, this contract may be revised.",
  "not_supported_claims": "Does not claim that full database contents must always be included."
}
```

Representation contracts are GKOs. They govern the input side of the system.

### 8.3 Channel Objects as GKOs

A channel can also be represented as a governed object:

```json
{
  "id": "gko.channel.execution_result.raw_stderr",
  "type": "observation_channel",
  "condition": "code execution or test failure audit",
  "assertion": "Raw stderr and exit code must be retained as authoritative evidence before summarization.",
  "strength": "hard",
  "priority": "higher than model-generated explanation",
  "evidence": "Failure localization depends on exact error messages and line references.",
  "lifespan": "project",
  "revocation_trigger": "If a structured test-report parser provides equivalent or superior evidence with verified fidelity.",
  "not_supported_claims": "Does not imply that raw stderr alone identifies the root cause."
}
```

This pattern integrates channel governance with the broader object model.

---

## 9. Audit Engineering for Observation-Representation Mismatch

Observation-representation mismatch should be auditable. An audit finding should not merely say that the model was wrong. It should identify what variable failed to enter, where it was lost, and what control delta repairs the channel.

### 9.1 Audit Finding Template

```json
{
  "id": "finding.observation_representation.example",
  "artifact": "candidate output, state transition, SQL query, code patch, plan, or answer",
  "finding": "The artifact depends on variable v, but v was absent, aliased, stale, or unbound in the operational representation.",
  "evidence": "Specific missing channel, omitted field, truncated log, stale snapshot, collapsed schema relation, or binding error.",
  "mismatch_type": "observation_representation",
  "severity": "medium | high | critical",
  "repair_target": "channel | retrieval | compression | representation_schema | binding | provenance | freshness | verifier",
  "control_delta": "Add or modify the representation contract so v enters Z in a control-usable form.",
  "regression_guard": "A check that fails if v is again omitted or aliased in an equivalent task.",
  "confidence": "diagnostic confidence"
}
```

### 9.2 Common Control Deltas

| Failure | Control Delta |
|---|---|
| Missing channel | Add tool access, file read, database query, API call, or human input requirement. |
| Retrieval omission | Modify retrieval query, chunking, metadata filter, or coverage check. |
| Compression erasure | Add retention rule for task-critical variables. |
| Schema flattening | Preserve structured relations rather than prose summaries. |
| Binding failure | Add entity, source, unit, timestamp, and scope binding fields. |
| Stale observation | Add freshness check and re-observation trigger. |
| Authority collapse | Add provenance and authority labels. |
| Negative-space failure | Add explicit representation for absence of evidence. |

### 9.3 Teeth-Proven Guards

A regression guard for observation-representation mismatch has teeth only if it fails when the decisive variable is removed, aliased, made stale, or rebound incorrectly.

Examples:

```text
If a foreign key is omitted from schema representation, the text-to-SQL representation audit must fail.
If raw stderr is replaced by a paraphrase, the code-audit evidence guard must fail.
If timestamps are dropped from event logs, the state-transition verifier must fail.
If two columns with the same display name lose table-qualified identifiers, the schema-binding guard must fail.
If a summary removes an exception condition, the preference-retention guard must fail.
```

A guard that only checks for fluent context length or presence of generic keywords is not sufficient. It must check the variable-entry condition itself.

---

## 10. Interaction with Other Mismatches

Observation-representation mismatch is upstream, but it rarely acts alone. It often creates or amplifies other mismatches.

### 10.1 Interaction with State Mismatch

If the variables needed to distinguish states are absent, state inference becomes impossible or unstable. The system may appear uncertain, but the uncertainty is caused by representation collapse.

```text
missing discriminative variable → latent states aliased → state mismatch
```

Repair must begin with channel repair, not merely better state reasoning.

### 10.2 Interaction with Fitting-Boundary Mismatch

Capability routing depends on trigger evidence. If trigger evidence is removed or distorted, the correct capability may not activate.

Examples:

```text
schema constraints omitted → schema audit not triggered
execution trace summarized → debugging capability under-triggered
risk signal compressed away → safety or review capability under-triggered
superficial expert terms retained → expert-performance mode over-triggered
```

Thus observation-representation mismatch can induce fitting-boundary mismatch.

### 10.3 Interaction with Support Mismatch

If a structure is absent from `Z`, it may have effectively zero support in candidate generation. The model cannot sample a join path whose foreign-key relation was not represented. It cannot generate a plan step involving a tool whose availability was omitted.

```text
not represented → not reachable → support mismatch
```

Support repair through sampling is weak unless the representation is repaired first.

### 10.4 Interaction with Aggregation Mismatch

Aggregation depends on preserving constraints across parts. If the representation omits a global dependency, local components may appear correct while the composed artifact fails.

Examples:

```text
clauses of a SQL query individually plausible but incompatible with omitted join constraint
sections of a report locally accurate but inconsistent with omitted definition
steps of a plan locally reasonable but impossible under omitted resource constraint
```

### 10.5 Interaction with Specification Mismatch

When task-critical variables are absent, the system may optimize visible proxies. Over time, the proxy may be mistaken for the task.

Examples:

```text
optimizing readability when correctness depends on omitted data
optimizing execution success when semantic intent was not represented
optimizing user-stated preference while omitted exception conditions govern true satisfaction
```

Specification repair must include variable-entry audit; otherwise the repaired rubric may encode only visible value.

### 10.6 Interaction with SGAR

SGAR commits progress through state transitions. If observations are impoverished, stale, or unauthoritative, the system may commit false state.

Examples:

```text
context says "tests passed" based on model narrative rather than tool output
file state committed from stale summary
issue marked resolved without verified external artifact
memory updated from unverified assumption
```

A state transition contract must include observation authority and representation sufficiency.

### Mechanism-Layer Mapping

In the Formal Mechanism Layer, observation-representation mismatch usually maps to `observation_availability` and `belief_representation`. If the missing variable is unavailable to the system, the repair target is `observation_availability`. If the variable is available but not converted into an operational structure, the repair target is `belief_representation`.

---

## 11. Text-to-SQL as a Canonical Case

Text-to-SQL makes observation-representation mismatch visible because the final SQL query depends on many variables that may or may not enter the prompt or control representation.

A direct formulation is:

```text
natural language question + schema text → SQL
```

A governed formulation is:

```text
question + database
  → schema extraction
  → schema representation contract
  → value-critical variable inventory
  → schema subgraph
  → column binding
  → value binding
  → join-path representation
  → predicate skeleton
  → SQL rendering
  → execution audit
```

### 11.1 Common Observation-Representation Failures in Text-to-SQL

| Failure | Example |
|---|---|
| Foreign-key omission | Correct join path is impossible to infer reliably. |
| Column-description omission | Column names are ambiguous or misleading. |
| Value distribution omission | The question depends on actual database values. |
| Table aliasing | Same display term maps to multiple tables. |
| Unit or format loss | Dates, currencies, or percentages are misinterpreted. |
| Sample-value absence | Value grounding fails for natural-language entities. |
| Schema flattening | Relationships become prose rather than constraints. |
| Dialect omission | Generated SQL uses unsupported functions. |

### 11.2 Variable Entry in Text-to-SQL

A column name has not fully entered the representation unless it is:

```text
observed: included from the schema source
retained: not truncated or merged into prose
bound: linked to its table, type, description, and keys
discriminative: distinguishable from similarly named columns
operational: usable in schema linking, join search, predicate construction, and execution audit
```

A foreign key has not fully entered unless it can constrain join-path search.

A sample value has not fully entered unless it can support value binding and predicate formation.

A SQL dialect rule has not fully entered unless it can constrain rendering.

### 11.3 Execution Feedback as Channel Repair

Execution feedback is often treated as verification only. In this theory, execution feedback can also serve as channel repair. It reveals variables not previously represented:

```text
empty result set → predicate may overconstrain actual data
SQL error → dialect or schema representation missing
unexpected row count → aggregation or join cardinality variable missing
ambiguous column error → binding representation insufficient
```

The audit finding should write back the missing variable or representation rule, not merely ask the model to try again.

---

## 12. Code, Agents, and Research Workflows

Observation-representation mismatch appears across domains.

### 12.1 Code Systems

Code tasks often fail because the model sees a summary of the codebase rather than the control-relevant structure.

Examples:

```text
hidden tests depend on behavior not visible in the prompt
dependency versions are omitted
environment variables are missing
stack traces are summarized without line numbers
call graphs are flattened
configuration files are ignored
build-system constraints are omitted
```

Repair requires tool-backed codebase observation, exact error preservation, dependency inspection, and structured code representations.

### 12.2 Tool-Using Agents

Agents often confuse narrative state with observed state.

Examples:

```text
agent says a file was created, but file system was not checked
agent assumes an email was sent, but only drafted text exists
agent summarizes a webpage but omits a table
agent records a plan as completed without verifier observation
```

Repair requires separating model claims from tool observations and committing only verified transitions.

### 12.3 Research Workflows

Research tasks depend on definitions, denominators, inclusion criteria, methods, assumptions, and provenance.

Examples:

```text
paper summary omits exclusion criteria
reported result lacks denominator
method comparison ignores measurement conditions
claim extraction omits confidence interval or population
citation summary loses whether a result is causal or correlational
```

Repair requires representation contracts for evidence, claim scope, method, population, metric, and uncertainty.

---

## 13. Design Patterns for Channel Governance

### 13.1 Raw Evidence Attachment

Summaries should not replace raw evidence when precision matters. They should point to raw evidence.

Pattern:

```text
summary + exact source span / row / line / tool output / timestamp
```

### 13.2 Provenance-Preserving Compression

Compression should preserve source, time, authority, and revocation conditions.

Bad compression:

```text
"The build failed because of configuration."
```

Better compression:

```text
"Build failed at 2026-06-27T14:03Z. Authoritative source: test runner stderr. Exit code 1. Failing target: integration:test. Exact error retained at evidence_ref. Suspected configuration issue is unverified."
```

### 13.3 Dual Representation

Use both human-readable and machine-structured representations.

Example:

```text
Natural-language explanation + JSON schema + provenance refs
```

The explanation supports human understanding. The structured representation supports control.

### 13.4 Variable-Criticality Checklist

Before generation, identify variables whose absence would change the optimal action.

Questions:

```text
What variables would make the current answer wrong if changed?
Which of those variables are observed?
Which are only assumed?
Which are stale?
Which are represented but unbound?
Which can affect routing or verification?
```

### 13.5 Negative-Space Representation

Represent absence explicitly.

Examples:

```json
{
  "foreign_key_between_orders_and_regions": {
    "status": "absent_in_schema",
    "source": "schema introspection",
    "timestamp": "..."
  }
}
```

Absence should be distinguishable from unknown.

### 13.6 Representation Diffing

When state, files, schemas, or observations change, diff the representations.

Pattern:

```text
previous Z
current Z
diff
control implications
state update / revocation trigger
```

### 13.7 Round-Trip Checks

Check whether a representation can reconstruct or preserve the control-relevant properties of the source.

Examples:

```text
Can schema serialization reconstruct foreign-key graph?
Can summary reconstruct all task-critical constraints?
Can code representation recover imports, call graph, and changed lines?
Can state summary recover committed transitions and pending actions?
```

### 13.8 Omission Mutants

Create representation mutants by removing decisive variables. A guard should fail when the mutant loses control sufficiency.

This is the observation-representation analogue of mutation testing.

### 13.9 Authority Labels

Every claim in a stateful system should carry authority status:

```text
observed
verified
inferred
hypothesized
model-generated
user-asserted
stale
revoked
```

Without authority labels, the system may treat narrative as fact.

### 13.10 Freshness Triggers

Representations should define when they become stale.

Examples:

```text
database schema snapshot invalid after migration
file summary invalid after file modification
calendar availability invalid after new event
test result invalid after code change
market observation invalid after time threshold
```

---

## 14. Relation to Existing Formal Traditions

Observation-representation mismatch connects to several established traditions, but LLM systems create a distinctive combination.

### 14.1 Sufficient Statistics and Information Bottlenecks

The concept of control sufficiency resembles sufficient statistics. A representation should preserve the information required for optimal decision-making. However, LLM systems often use natural-language, hybrid, and tool-derived representations rather than carefully designed statistical summaries.

The practical challenge is not only compression but governance of what must not be compressed away.

### 14.2 Abstraction Functions in Formal Methods

Formal methods often distinguish concrete states from abstract states. An abstraction is sound only if it preserves properties required for verification. Observation-representation mismatch is the LLM-system analogue: the prompt or context abstraction must preserve control-relevant task properties.

### 14.3 POMDP Observation Models

Partial observability models distinguish world states, observations, and beliefs. Observation-representation mismatch emphasizes failures in the observation and representation functions before belief update. A system may not merely be uncertain; it may have constructed the wrong observation space.

### 14.4 Active Perception and Value of Information

When a missing variable has high control value, the system should acquire it before acting. Channel governance can be seen as task-specific active perception: choose observations that reduce representation-induced value loss.

### 14.5 Database Views and Materialized Projections

A representation is like a view over a database. If the view omits fields needed for a query, no query over the view can recover them. This analogy is especially useful for tool-using LLM systems: prompts, summaries, embeddings, and memory records are views, not the world.

### 14.6 Causal Representation

Some variables are predictive but not causally relevant; others are causally decisive but hard to observe. Channel governance should prioritize variables that affect task control, not merely variables that correlate with plausible output.

---

## 15. When Channel Governance Is Not Needed

Channel governance has costs. It can add latency, token load, tool calls, privacy exposure, engineering complexity, and false precision. It is not always justified.

It is usually unnecessary when:

```text
the task is low-risk and one-shot
the user supplies all relevant variables explicitly
the output is stylistic rather than control-sensitive
local quality strongly tracks global value
the verifier has complete authority and direct access to the world
the task lies in a positive probability-value alignment regime
```

It is usually warranted when:

```text
missing variables can silently change the answer
representation is produced by lossy retrieval or summarization
the task depends on structured relations
state persists across time
tool outputs are authoritative
verification depends on exact values
failure is expensive or hard to detect locally
```

### 15.1 Governance-Induced Risks

Channel governance can itself fail.

| Risk | Description |
|---|---|
| Channel bloat | Too many variables overwhelm the model or obscure the relevant ones. |
| False precision | Structured representation creates unwarranted confidence. |
| Privacy leakage | Adding channels exposes sensitive information unnecessarily. |
| Stale authority | Old observations persist as if current. |
| Over-instrumentation | System spends more effort observing than acting. |
| Misbinding | More data increases opportunities for incorrect binding. |
| Governance conflict | Representation contracts conflict across task modes. |

These risks should be handled with scope, priority, authority, and revocation rules.

---

## 16. Self-Audit of the Concept

Observation-representation mismatch should be represented as a governed theoretical claim.

```json
{
  "id": "gko.observation_representation_mismatch",
  "type": "primitive_mismatch_claim",
  "condition": "LLM systems whose task-relevant world variables must pass through observation and representation functions before model control is possible.",
  "assertion": "If value-relevant variables are lost, aliased, stale, unbound, or made operationally inaccessible before entering Z, downstream reasoning over Z faces a representation-induced ceiling.",
  "strength": "structural-relative",
  "support_scope": "Applies to value-preservation failures caused by the map S_world → O → Z.",
  "revocation_trigger": "Show that all such failures can be reduced to state, fitting-boundary, support, aggregation, or specification mismatches without losing intervention specificity.",
  "not_supported_claims": "Does not claim that every missing fact is an observation-representation mismatch; does not claim that all tasks require exhaustive observation; does not claim that more context always improves control."
}
```

The concept should be weakened if it ceases to identify distinct repair targets. It should be strengthened when it reveals failures that cannot be fixed by reasoning, state inference, capability routing, support expansion, aggregation repair, or specification revision alone.

---

## 17. Minimal Diagnostic Checklist

Before treating an LLM failure as reasoning failure, ask:

```text
1. What variables would have changed the correct answer?
2. Did the system have an observation channel for those variables?
3. Did retrieval or tool use actually capture them?
4. Did compression, summarization, formatting, or truncation preserve them?
5. Are they bound to the correct entity, time, source, unit, and scope?
6. Are they distinguishable from similar variables?
7. Can they affect routing, search, audit, rendering, verification, or state transition?
8. Is absence represented separately from unknown?
9. Is the observation fresh?
10. Does the verifier have independent access to the variable?
```

If the answer to any of these is no, the primary repair target may be observation-representation rather than downstream reasoning.

---

## 18. Conclusion

Observation-representation mismatch is the first primitive mismatch in the structural theory of value preservation. It occurs when the decisive variables of the task fail to enter the model-accessible control representation in a usable form.

This mismatch is upstream of reasoning. It creates representation-induced ceilings that cannot be reliably overcome by longer inference over the same representation. It is distinct from state mismatch, support mismatch, aggregation mismatch, fitting-boundary mismatch, and specification mismatch because its repair target is the observation-representation channel itself.

The practical response is channel governance: identify value-critical variables, map observation channels, preserve structure, bind variables correctly, represent absence and provenance, audit variable entry, and encode representation contracts as governed objects.

The central rule is:

```text
Govern the channel before governing the knowledge.
```

A system that ignores this rule may build sophisticated governance over an impoverished projection of the task. A system that follows it can make later Knowledge Governance, Audit Engineering, and State-Governed Agent Regime operate over the variables that actually determine value.

---

## Appendix A: Compact Glossary

| Term | Definition |
|---|---|
| Observation function `φ` | The process by which the world becomes observed data. |
| Representation function `ψ` | The process by which observed data becomes operational representation. |
| Operational representation `Z` | The representation available for model control, routing, search, audit, rendering, and state update. |
| Observation-representation mismatch | Failure of `S_world → O → Z` to preserve task-relevant distinctions. |
| Variable entry | The condition that a task-critical variable is observed, retained, bound, discriminative, and operational. |
| Control sufficiency | A representation preserves all distinctions needed for high-value action. |
| Representation-induced ceiling | The maximum value loss imposed by distinctions collapsed in the representation. |
| Channel governance | Governance of observation and representation channels before downstream knowledge governance. |
| Representation contract | A governed object specifying what a representation must preserve. |
| Authority collapse | Failure to distinguish observed, verified, inferred, guessed, stale, or model-generated claims. |
| Negative-space failure | Failure to represent absence of expected evidence as a meaningful observation. |

---

## Appendix B: Representation Contract Template

```json
{
  "id": "gko.representation_contract.NAME",
  "type": "representation_contract",
  "condition": "Task class or system mode where this representation contract applies",
  "assertion": "Variables, structures, relations, provenance, and authority labels that must be preserved",
  "strength": "hard | soft | heuristic | provisional",
  "priority": "conflict-resolution priority",
  "evidence": "Why these variables are control-critical",
  "source": "Origin of the contract",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "When the contract should be weakened, revised, or removed",
  "not_supported_claims": "Claims this contract does not license"
}
```

---

## Appendix C: Observation-Representation Audit Finding Template

```json
{
  "id": "finding.orm.NAME",
  "artifact": "Artifact affected by the mismatch",
  "finding": "Localized statement of the missing, aliased, stale, unbound, or non-operational variable",
  "evidence": "Specific proof from source, tool, schema, log, retrieval, or representation diff",
  "mismatch_type": "observation_representation",
  "severity": "low | medium | high | critical",
  "repair_target": "channel | retrieval | compression | representation_schema | binding | provenance | freshness | verifier",
  "control_delta": "Precise representation or channel change",
  "regression_guard": "Guard that fails if the variable-entry failure recurs",
  "confidence": "diagnostic confidence",
  "revocation_trigger": "When this finding should be revised or withdrawn"
}
```

---

## Appendix D: Variable Entry Test

For each candidate task-critical variable:

```text
Variable:
Source:
Observed? yes / no / unknown
Retained? yes / no / unknown
Bound? yes / no / unknown
Discriminative? yes / no / unknown
Operational? yes / no / unknown
Authority:
Freshness:
Control use:
Verifier access:
Failure if omitted:
Required repair:
```

A variable with any `no` or critical `unknown` should not be treated as safely entered.
