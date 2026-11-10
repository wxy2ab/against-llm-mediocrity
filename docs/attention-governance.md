# Attention Governance: Inference-Time Control of Evidence, Working Sets, and Commits

## A General Method from Long-Document Review to Complex Tasks

**Status:** Working Draft v0.1  
**Date:** 2026-11-06  
**Chinese version:** [注意力治理：推理时的证据、工作集与提交控制](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/attention-governance.zh-CN.md)  
**Related documents:** [A Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md), [Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.md), [Governed LLM Object Model and Interface Specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md), [Agent Harness Framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-harness-framework.md)

---

## Abstract

This article defines **attention governance** as an inference-time control method that does not update model parameters. Around the current decision, it organizes evidence on demand, decomposes judgment tasks, coordinates cross-module constraints, and subjects modifications to controlled validation and commit. The question is not "how do we make one internal attention head look somewhere else?" It is "when the model makes a judgment, does it receive sufficient evidence with intact conditions, can it maintain an inspectable working set, and can its conclusion be passed reliably to the next step?" Direct manipulation of attention weights is a separate research route that requires internal access and its own calibration; it should not be conflated with the external control method proposed here.

The article develops three implementable principles. First, secure the information a task needs before pursuing compression. An evidence packet must preserve provenance, negation, exceptions, time, agency, conditions, and conflicts; when evidence is insufficient, the system should widen its read scope or explicitly decline to judge. Second, decompose the problem by constraints, writing each requirement as a judgment task over a scope of evidence. Four views help discover those tasks, while dependency relations determine what must be read and revalidated. Third, for hard constraints that are registered, completely scoped, and reliably checkable, a controlled modification can provide a conditional non-regression guarantee. Soft goals such as pacing, emotional force, or character charisma still require semantic evaluation or human judgment.

In engineering terms, the article keeps the "four-view audit" but corrects "orthogonal projection" into **complementary views**. The views overlap; their value should be measured by the ratio of newly confirmed defects to incremental cost. Chapter buckets organize tickets, but shared constraints determine which edits must be validated and committed together. Modifications default to local patches; a larger rewrite is approved only when the structure cannot be repaired locally. The official state accepts only candidates that pass acceptance.

The article closes with a falsifiable validation program. Under the same model, tools, budget, and retry policy, it compares a strong whole-context baseline, module-only slicing, four views plus physical bucketing, four views plus dependency coordination and controlled commit, and adaptive routing. The primary endpoint is not "how many problems were found." It is whether the final adopted version repairs all target defects, preserves critical protections, and introduces no new critical defect. The position is conditional: attention governance is an engineering discipline worth testing, not a universal law that shorter context makes a model smarter. On some tasks, the most reasonable action may be to add no governance at all.

---

## 1. The Problem: Context Length Is Only a Surface Symptom

### 1.1 Two adjacent but distinct burdens

Long materials make it hard for a model to find decisive evidence. Evidence is dispersed, similar content distracts, conditions remain implicit, sources conflict, and coverage is unclear. Complex reasoning makes it hard for a model to maintain state. Branches are mutually exclusive, assumptions bleed into one another, obligations remain open, variable definitions drift, and old conclusions survive a backtrack.

The two often appear together, but they are not the same problem. A million-row structured dataset may contain a great deal of material while imposing a low solving burden if the task is to fetch one record by primary key. A mathematical proposition of a few sentences may contain very little material while demanding a deep construction or a long search. Conversely, a long narrative may need only local fact-checking, while a short scheduling problem may require simultaneous coordination of skills, precedence, resources, and deadlines.

This article therefore does not treat input length or thinking length as a sufficient trigger. It locates the object of governance among three burdens:

- **Material burden:** how difficult it is to obtain and interpret the evidence required for the judgment.
- **Solving burden:** how much search, construction, computation, or domain knowledge remains after the evidence is available.
- **Process burden:** how easily assumptions, branches, conditional conclusions, open obligations, and state changes are lost or confused during solving.

A fourth burden cuts across all three: **verification burden** — whether the conclusion can be checked independently. It belongs to none of the first three, yet it determines whether governance actually closes.

### 1.2 Definition and boundaries

**Attention governance**, as used here, is a set of auditable controls over the information visible to the model and over the external process, under fixed model parameters, tools, and budget:

1. **Evidence organization:** compile an evidence packet for the current judgment, preserving provenance, conditions, counter-evidence, and gaps.
2. **Judgment-task decomposition:** split the overall requirement into judgment tasks with explicit scopes and acceptance conditions.
3. **Cross-module constraint coordination:** identify which requirements share variables, resources, or state, and must be read and validated jointly.
4. **Controlled modification and commit:** allow candidates only inside an approved write scope, validate them in layers, commit atomically, and invalidate stale evidence and tickets.

It does not claim to change the model's internal attention distribution, and it does not treat "shorter context" as the goal. It changes what the model sees at a decision point, what it is asked to answer, which state is stored externally, and which results are eligible for official state.

This distinction matters. Recent long-context work repeatedly shows that evidence position, distractor material, task form, and the degree of literal overlap between question and evidence affect performance. Those results support the value of organizing information presentation. They do not prove "shorter is always better," and they certainly do not prove "if local audits pass, the whole document is correct."

This yields the central research proposition of the article:

> Under fixed resources and tools, can adaptive organization of the current decision's working set and downstream validation — driven by observable bottlenecks such as evidence acquisition, active dependencies, branching, and state change — achieve a better quality-cost profile than direct reasoning and a fixed heavy pipeline?

The proposition covers long-document processing, short-input complex reasoning, combinatorial search, data analysis, and dynamic execution. It also permits the experimental conclusion that, for some tasks, the direct route is best.

### 1.3 Not every failure is an attention failure

If a failure comes mainly from missing knowledge, missing observations, contradictory specifications, or the need for exact computation, better evidence orchestration cannot replace acquiring evidence, acquiring observations, adjudicating the specification, or invoking a solver. This article routes those cases separately:

- **Acquire evidence:** widen the read scope, retrieve external material, request a new observation.
- **Acquire knowledge:** bring in domain material, a lemma, or expert judgment.
- **Change representation:** turn natural-language requirements into constraints, programs, state machines, or checkable structures.
- **Change the solver:** hand the task to a constraint solver, planner, executor, or model checker.
- **Escalate:** submit the conflict to an authorized adjudicator instead of letting a downstream stage quietly rewrite the upper specification.

Attention governance owns only the segment concerned with information presentation, state maintenance, branch isolation, and controlled commit. The clearer that boundary, the more credible the validation.

---

## 2. Shorter Context: A Limited Theoretical Explanation

### 2.1 Conditional renormalization

In standard attention, the weight of one query on token $j$ can be sketched as [1]:

```math
\alpha_j=\frac{e^{z_j}}{\sum_{k} e^{z_k}}.
```

If only a set $R$ is retained, and the logits $z_j$ of retained items are assumed unchanged, the new weights are:

```math
\alpha'_j=\frac{\alpha_j}{\sum_{k\in R}\alpha_k},\qquad j\in R.
```

Under this very limited condition, retained items do receive higher normalized weight. But the derivation cannot be extrapolated directly to real truncation:

1. Deleting or reordering text changes positional encoding, hidden states, and the Q/K/V of later layers; retained logits do not stay unchanged.
2. Standard full attention permits direct interaction across long distances. Physical distance is not a law that forces weights toward zero.
3. Retained content may itself be wrong, stale, or conditionally incomplete.
4. Higher weight does not mean the evidence is correctly interpreted, and it does not mean the final answer is more accurate.

The defensible statement is therefore: **when decisive evidence and its conditions are preserved, reducing irrelevant content and explicitly organizing related evidence may improve how the model uses evidence.** This is an engineering hypothesis to be tested, not a theorem derived from the softmax formula.

### 2.2 What existing research supports

| Research direction | Main finding | Implication for this proposal |
|---|---|---|
| Lost in the Middle [2] | In the models and tasks tested by the authors, evidence position materially affects long-context performance | Test position, span, and organization; do not look only at nominal context length |
| GSM-IC-style irrelevant-context perturbation (Large Language Models Can Be Easily Distracted by Irrelevant Context) [3] | Irrelevant material can disrupt some mathematical reasoning | Reducing distraction may help, but check whether a necessary condition was removed |
| System 2 Attention [4] | Reorganizing task-relevant context before answering is a feasible inference-time intervention | "Organizing evidence" can be a separate stage |
| Decomposed Prompting [5] | Specialized subtasks and prompt modules help on some complex tasks | Audit different criteria separately, then reconcile the results |
| NoLiMa [6] | Reducing literal overlap between question and evidence exposes long-context retrieval and use failures | Keyword co-occurrence alone does not prove full mechanism coverage |
| RULER [7] | Multi-hop tracing, aggregation, and length changes alter long-context difficulty | Evaluation should cover cross-span dependencies and aggregation, not only "find one keyword" |

These studies provide evidence for position sensitivity, distraction, context reorganization, task decomposition, and weak literal matching. They have not directly validated the full four-view combination proposed here, and they do not establish that a fixed window ratio is universally optimal.

### 2.3 A necessary condition: the evidence packet must not collapse different correct answers into one input

Let the manuscript state be $S$, the audit question $q$, and the evidence compiler output:

```math
E=g(S,q).
```

If two manuscripts $S_1,S_2$ are compressed into exactly the same evidence packet $E$, but their correct judgments differ, then no system that sees only $E$ can be correct on both. This is not a model-capability problem; it is an information-condition problem.

Several implementation requirements follow directly:

- Preserve original text and provenance; summaries are for navigation, not a replacement for the source.
- Preserve negation, exceptions, time, agency, conditions, and qualifiers.
- Preserve conflicting evidence; do not retain only the passages that support one conclusion.
- When evidence is insufficient, widen the read scope or output "cannot judge."
- "Not retrieved" must not be treated as "does not exist."
- In long documents, track aliases, implicit references, and causal chains that share no keywords.
- A one-page global contract can serve as an index, but a concrete audit must still load the relevant full clauses and source evidence.

This is not a requirement for a better compression algorithm. It is a requirement that the evidence packet retain discriminating power over the correct judgment.

---

## 3. Three Implementable Principles

### 3.1 Principle one: secure the information the task needs before pursuing compression

The goal of the evidence compiler is not to produce a beautiful summary. It is to construct working material sufficient to support judgment while preserving uncertainty. A usable evidence packet contains at least:

- the question to be judged;
- the relevant contract and its version;
- necessary source spans, source IDs, and original order;
- known exceptions, counter-evidence, conflicts, and open information;
- the required output structure;
- the allowed read scope and budget.

Three checks should run while packing:

1. **Provenance check:** do the citations actually come from the stated version of the source?
2. **Condition check:** are negation, exception, agency, time, and conditions preserved?
3. **Scope check:** are all ends of the judgment — both or several spans — present at the same time?

Context size should be selected on a development set, not fixed by the slogan "shorter is better." Compare several length bands and then freeze the parameter. A 300,000-character Chinese manuscript is not 300,000 tokens; the budget must be computed with the actual tokenizer or interface accounting.

For prose, pacing, and emotional judgment, preserve complete narrative passages. Stripping all descriptive language may delete the very object that needs evaluation.

### 3.2 Principle two: decompose by constraints and make cross-module relations explicit

Write the overall requirement as:

```math
\Phi(S)=\bigwedge_{a\in A}\phi_a(S_{V_a}),
```

where $\phi_a$ is one requirement and $`V_a`$ is the full set of variables or spans needed to judge it. The formula is not an instruction to chop the task mechanically. It forces two questions: **which material does each requirement depend on, and which requirements share the same variables?**

For example:

- Whether a chapter fulfills its responsibility depends mainly on that chapter.
- The ownership of an object may depend on chapters 3, 8, and 19.
- Whether three mechanisms exceed a shared budget requires reading all three mechanisms together.
- Whether a character knows a secret too early requires comparing the learning event with the action event.
- Whether a code change introduces a concurrency bug requires shared state, locks, and reachable interleavings.

The scope of an interface audit should therefore be determined by dependency, not by adjacency. Adjacency is only one kind of interface. Non-adjacent shared variables, shared resources, and joint conditions can be interfaces too.

A common decomposition error is to promote a conditional conclusion into an unconditional fact. Two branches produce:

```math
A\Rightarrow P,\qquad \neg A\Rightarrow Q.
```

At merge time, $P$ and $Q$ cannot both be inserted into the global fact set. The correct move is to preserve each conclusion's premise, scope of application, and open obligations. **Preserve interface conditions when decomposing; check scope when merging.**

### 3.3 Principle three: a conditional non-regression guarantee for registered hard constraints

Let:

- $`H_{\text{pass}}`$: the set of hard constraints that already hold before modification;
- $W$: the set of positions this modification is allowed to touch.

Suppose all of the following hold:

1. The dependency scope of every hard constraint is completely recorded.
2. The candidate modifies only positions in $W$.
3. Every already-satisfied constraint that depends on $W$ passes again on the candidate state.
4. The committed state is exactly the candidate that was validated.

Then every constraint in $`H_{\text{pass}}`$ still holds after commit.

The reason is direct: constraints that depend on $W$ have been revalidated; constraints that do not depend on $W$ have all their inputs unchanged. The argument relies on engineering assumptions: constraint checking is deterministic or at least repeatable, dependency records are complete, the modification does not exceed its scope, and commit does not substitute a different candidate.

The scope of the guarantee must be stated clearly:

- It covers only **registered** constraints, not undiscovered implicit requirements.
- It depends on **complete dependency scope**, while dependency extraction itself can fail.
- It depends on **reliable checking**, while semantic judgment can be unstable.
- It does not hold for soft goals such as pacing, emotional force, character charisma, or reading experience. Those still need independent evaluation or human judgment.

It is therefore a valuable conditional guarantee, not a proof that the whole document is correct after commit.

---

## 4. Four Complementary Views

### 4.1 What each view loads and checks

| View | What it loads each time | What it mainly checks | What it must not miss |
|---|---|---|---|
| Module view | Chapter or scene text, responsibility, entry and exit state, related contracts | Local logic, fulfillment of responsibility, factual support | Checking only the chapter and missing cross-chapter conditions |
| Mechanism view | The source event chain of one rule, object, character knowledge, or causal line | Preconditions, exceptions, state changes, long-run consistency | Aliases, implicit consequences, dependencies never stated explicitly |
| Operating-condition view | One explicit reading or operating situation and its checkable criteria | Whether the requirement is met in that situation | Replacing explicit criteria with a broad persona |
| Interface and joint-constraint view | Both sides of a handoff, non-adjacent dependencies, shared resources, related mechanisms | State transfer, mechanism collision, joint constraints | Checking only adjacent fragments and pairwise combinations |

Two practical adjustments follow.

First, replace "reader identity" with "a decidable question." For example:

> As of chapter 8, has a first-time reader received the information needed to understand this action by the character?

This is easier to execute and validate than "audit from the perspective of an ordinary reader." It also requires distinguishing three states: what actually happened in the story world, what the character currently knows, and what the reader knows at this point. Otherwise, an omniscient audit will import later information into the earlier reading experience.

Second, replace a fixed percentage seam window with an adaptive handoff window. Read one complete handoff event or adjacent scene first, determine what is missing, and then widen the range. "Last 20% plus first 20%" can be an experimental parameter, but there is no reason to treat it as a universal optimum.

### 4.2 "Complementary," not "orthogonal"

Module, mechanism, operating condition, and interface are four useful ways of looking, but they share variables such as characters, rules, state, and resources. Without an explicit representation space, inner product, and projection operator, they cannot be treated as strictly orthogonal subspaces. Calling them "orthogonal projections" creates a decomposition guarantee that does not exist.

**Complementary views** is the better description:

- They propose judgment tasks from different angles.
- They overlap; the same defect may be found by more than one view.
- Their value lies not in mutual non-overlap but in whether they find real problems the other views miss.
- Their budget should be decided by incremental value, not by the neatness of the names.

One operational view-value metric is:

```math
\mathrm{IV}_v=\frac{\text{new confirmed defects found by view }v}{\text{incremental cost of view }v},
```

where duplicate defects count once and false positives plus review cost enter the denominator. The metric is imperfect, but it is closer to an engineering judgment than "we have four views."

### 4.3 Local consistency is not global consistency

The gluing result in sheaf theory has strict premises: the objects must satisfy the sheaf axioms, and local sections must agree on overlaps before they can glue uniquely. The text-audit scheme proposed here has not shown that it has such a structure. It therefore cannot borrow the conclusion "local audits pass, therefore the whole document is correct."

A simple counterexample is enough:

- Three mechanisms each consume 4 units of a resource.
- Total resources are 10.
- Any two mechanisms together consume 8 and pass.
- All three together consume 12 and violate the constraint.

A $`K\times K`$ pairwise interaction matrix can be retained, but it is not enough. The system must also check joint conditions involving three or more parties and global aggregate constraints.

### 4.4 Organize dependencies with a constraint hypergraph

Treat paragraphs, scenes, variables, or states as nodes, and each requirement $\phi_a$ as a hyperedge over its dependency set $`V_a`$. The result is a **constraint hypergraph**:

- A binary interface is a hyperedge of size 2.
- A three-way resource constraint is a hyperedge of size 3.
- A global budget, timeline, or character-knowledge boundary may be a larger hyperedge.
- The read closure is hyperedge reachability; the revalidation closure is the set of hyperedges affected by the modification.

The induced width of the hypergraph can indicate decomposition cost, and the variable-elimination order affects that width. Dechter's bucket-elimination framework provides a theoretical basis for this family of phenomena [12], but it cannot be treated as a universal complexity theorem for all language tasks. Its engineering value is a reminder: **a widely coupled problem cannot be solved merely by cutting it into smaller pieces. If the subtasks still need to pass a large joint state across an interface, the difficulty has only moved to the interface.**

---

## 5. Execution Architecture: From Version Freeze to Atomic Commit

A complete loop can be written as:

```text
freeze goal, version, and rules
  -> build index and coverage ledger
  -> compile an evidence packet for the concrete question
  -> run the four-view read-only audit and produce tickets
  -> group tickets by chapter, determine coordination scope by dependency
  -> generate a bounded set of candidate edits (local patches by default)
  -> validate in layers
  -> commit atomically, invalidate stale evidence, continue auditing
```

### 5.1 Stage 0: freeze the goal, version, and rules of this round

| Object | Minimum content |
|---|---|
| Source snapshot | Manuscript ID, version, whole-document hash |
| Stable anchors | Chapter/scene/paragraph ID, original order, text hash |
| Hard requirements | Explicit author settings, facts, immutable content, relations that must hold |
| Soft goals | Pacing, style, clarity, reader experience, and their priorities |
| Candidate requirements | Settings or regularities inferred by the model, with source and pending-confirmation status |
| Budget | Calls, cost or tokens, time, retry policy |

A regularity inferred by the model cannot be promoted automatically to an author setting. If the global contract itself is wrong, the system should produce an explicit **contract-revision task**. Downstream audits must not quietly rewrite the upper specification to make a local result pass.

### 5.2 Stage 1: build the index and record coverage

Read the full manuscript at least once by module, and extract candidate information:

- characters and aliases;
- events and chronology;
- objects, ownership, and location;
- rules, trigger conditions, and exceptions;
- foreshadowing, promises, and payoffs;
- unresolved references and sources of conflict.

Every item keeps a source anchor. Maintain a **coverage ledger** in parallel: which modules have been scanned, which mechanisms have been traced, and which spans remain unchecked.

The ledger lets the system distinguish:

- "This part has been checked; no problem found so far."
- "Only part of the material has been retrieved."

A first version can start with files, structured indexes, source search, and module-by-module scanning. Vector retrieval can be added as a candidate-discovery tool, but a similarity hit is not proof of coverage.

### 5.3 Stage 2: compile an evidence packet for a concrete question

Each packet follows a fixed structure: question, contract and version, necessary source spans and provenance, known exceptions and counter-evidence, open information, output structure, read scope, and budget.

Run provenance, condition, and scope checks while packing. For a cross-chapter judgment, the packet must contain both or all ends of the evidence. For negation, exception, and time conditions, a summary cannot replace the source. For prose and emotional judgment, preserve complete narrative passages so that the object of evaluation is not deleted along with the description.

### 5.4 Stage 3: four-view read-only audit, producing tickets

An actionable ticket answers at least six groups of questions:

| Field group | Questions to answer |
|---|---|
| Location | Which version, which source positions? |
| Evidence | Which source sentences support the judgment? Are two or more ends required? |
| Defect | Which requirement is violated? |
| Impact scope | Which modules, mechanisms, and shared states are involved? |
| Repair condition | What should be observed after the fix? |
| Protection and revalidation | What must not be broken? What must be rechecked? |

The audit stage permits three outcomes:

- a problem supported by evidence;
- no problem found within the current scope;
- insufficient evidence to judge.

"Citations match the source" only proves provenance; it does not prove the ticket's judgment. Tickets still need semantic review or adjudication. Audits over the same snapshot can run in parallel, but one view's conclusion cannot be treated directly as authoritative fact for another view.

### 5.5 Stage 4: group tickets by chapter, determine coordination scope by dependency

This is the easiest step to get wrong. Distinguish three sets:

- **Write set $W$:** the positions this round is actually allowed to modify.
- **Read scope:** the material needed to understand and repair the problem.
- **Revalidation scope:** constraints and spans that may be affected by this modification.

Dependency closure mainly determines read and revalidation scope. It does not automatically authorize edits in every related chapter.

For example, a piece of foreshadowing in chapter 8 is related to a reveal in chapter 19:

- If changing chapter 8 alone satisfies all requirements, change only chapter 8 and revalidate chapter 19.
- If both places must change together, form a cross-chapter modification transaction.
- If the change touches a setting the author has not adjudicated, stop in an explicit conflict state.

Adjudication rules must be fixed in advance:

- Hard requirements outrank soft preferences.
- When two hard requirements conflict, do not invent a compromise.
- Different problems at the same location cannot be deduplicated mechanically.
- Duplicate tickets from the same root cause should be merged.
- The model may propose expanding the write scope, but the formal scope is approved by a trusted coordinator.
- Contract errors should escalate to contract revision, not be quietly bypassed locally.

Chapter buckets organize tickets. They do not determine commit boundaries. **Shared constraints determine which edits must be validated and committed together.**

### 5.6 Stage 5: generate minimal candidate edits

By default, the model outputs a local patch:

- target paragraph ID;
- expected source hash;
- exact source text to replace;
- replacement text;
- the adjudicated ticket it addresses.

This limits the model's generative scope to the part that needs to change and lets the runtime check whether the patch actually lands where it claims.

When a chapter's structure can no longer be repaired by local adjustment, a scene-level or chapter-level rewrite may be approved. A larger modification still goes through the same acceptance process.

The principle is:

> One adjudication round may produce a bounded number of candidates; official state accepts only modifications that pass acceptance.

"Completed in one generation" may be an efficiency metric, not a correctness requirement.

### 5.7 Stage 6: validate candidates in layers

At least four checks are required:

| Check | Content | Typical action on failure |
|---|---|---|
| Structure and authority | Version, source hash, anchors, overlapping edits, approved scope, output format | Reject and request regeneration |
| Target repair | Does the ticket's defect actually disappear, rather than merely the surrounding text changing? | Return for evidence or rework |
| Regression | Affected local rules, cross-chapter relations, shared resources, protection requirements | Narrow the scope or form a joint transaction |
| Reading and semantic quality | New interpretive burden, stylistic rupture, character-motivation problem, reading obstacle | Human review or semantic adjudication |

Semantic review should use an independent context and judge against the source, the candidate, and the acceptance conditions. It should not inherit the builder's interpretation. Different roles played by the same model can still share errors; "three roles agree" is not three independent pieces of evidence.

Verification cannot be replaced by thinking again. Without external feedback, repeated self-critique may simply generate another answer; in the reasoning tasks tested by existing work, intrinsic self-correction does not always improve results and sometimes degrades them [15]. A trained process verifier and an ad hoc request for the same model to score its own steps are different mechanisms; empirical results about process supervision cannot be transplanted into the claim that "any model's self-review is reliable" [16].

Each check outputs:

```math
\mathrm{PASS},\quad \mathrm{FAIL},\quad \mathrm{UNKNOWN}.
```

`UNKNOWN` does not count as a pass. An unimplemented semantic check must explicitly return `UNKNOWN`; a default pass would hide a capability gap.

### 5.8 Stage 7: commit, invalidate, and continue auditing

Commit is performed by the runtime:

1. Confirm that official state is still the version on which the proposal was based.
2. Rebuild and validate the candidate.
3. Update the canonical state.
4. Record the modification, check results, and version.
5. Invalidate evidence and tickets that depend on the old content.

An old ticket cannot be reused by simply swapping in a new hash. Its evidence and conclusion must be confirmed to still hold in the new state.

Every transaction should have an explicit terminal state:

- committed;
- rejected;
- needs evidence;
- specification conflict;
- budget exhausted;
- no progress.

Unfinished work and correct escalation must be preserved, not hidden behind a final "passed."

---

## 6. Generalizing from Documents to General Tasks

### 6.1 The decision working set

Write the information that must remain valid for a correct judgment at a given step as:

```math
\Omega_t=\langle g_t,E_t,s_t,A_t,C_t,O_t,\epsilon_t\rangle,
```

where:

- $g_t$: current goal;
- $E_t$: necessary evidence;
- $s_t$: current state;
- $A_t$: active assumptions and their scopes;
- $C_t$: relevant constraints;
- $O_t$: open obligations;
- $\epsilon_t$: acceptance conditions.

This is an explicit engineering representation, not a direct measurement of the model's internal attention capacity. Its purpose is to let the system check whether the information needed at this step is present, which assumptions are still valid, which obligations remain open, and whether the next move should acquire evidence, switch branches, change method, or commit.

The trigger for additional processing can therefore be rewritten as:

> Is the current solving process unable to maintain this working set reliably, and are dependencies between decisions at risk of being lost?

This is closer to the problem than "the material exceeds some number of characters" or "thinking exceeds some number of tokens."

### 6.2 Depth, width, branching, and state change

| Structural feature | Typical difficulty | More suitable handling |
|---|---|---|
| Deep dependencies | Many serial steps; early errors propagate forward | Validate intermediate results at checkable milestones |
| Wide joint constraints | One step must satisfy many interacting conditions | Preserve a shared working set or hand off to a joint solver |
| Many branches | Mutually exclusive assumptions are mixed; old conclusions survive backtracking | Branch isolation, explicit assumption scopes, undo |
| Frequent state change | Later steps use stale assignments or observations | State update, version checks, re-observation |
| Heavy exact computation | The route is right but arithmetic or enumeration is unreliable | Programs, constraint solvers, executors |
| Strong coverage requirements | "All," "none," "unique," "optimal" | Exhaustiveness checks, counterexample search, completeness obligations |

### 6.3 Four failure situations, four different remedies

| Situation | Symptoms | Priority remedy |
|---|---|---|
| A. Conditions are known but lost or mixed during reasoning | Forgetting a constraint, variable drift, treating an assumption as proved, reusing an old branch after backtracking | External state snapshot, assumption scope, checkpoints |
| B. Conditions are preserved but no solution is found | Repeated attempts in the same direction, no new candidates | Search strategy, representation change, compute allocation |
| C. Exact computation or formal derivation is unreliable | The problem is understood but the arithmetic is wrong, or derivation steps are unstable | Programs, solvers, independent checkers |
| D. Key knowledge, observation, or insight is missing | Stuck on material not supplied or a lemma not yet found | Acquire evidence or knowledge, change representation, preserve unresolved state |

These four remedies must not be reported as one intervention. Branch isolation reduces mixing; adding branches expands search coverage; improving branch scoring improves selection; invoking a solver changes computation execution. They are not the same "attention benefit."

In situation B, Tree of Thoughts shows that explicit candidate search, lookahead, and backtracking are feasible on some planning and search tasks [10], but this does not mean every complex problem should use tree search. In situation C, PAL shows a feasible division of labor in which the model interprets the problem and generates a program while the runtime performs exact computation [8], and LLM+P shows a precedent for translating a natural-language planning problem into a formal representation, handing it to a classical planner, and interpreting the result [9]. These gains come mainly from computation execution, not from attention organization alone.

### 6.4 Intervention menu

| Observable bottleneck | Priority intervention | Object changed |
|---|---|---|
| Key material hard to find, sources conflict, coverage unclear | Evidence localization, condition preservation, coverage checks | Available evidence |
| Known conditions lost across steps | State snapshot, constraint and obligation records | State maintenance |
| Different assumptions are mixed | Independent branches, assumption scopes, backtracking | Branch isolation |
| Long dependency chain, intermediate results unchecked | Subgoals and stage checks | Error propagation |
| Large combinatorial search space | Heuristics, constraint propagation, search or solver | Search and computation |
| Many candidates but hard to judge | Checkers, counterexample search, external feedback | Selection and validation |
| Observations or external state have changed | Re-observation, versioning, replanning | State freshness |
| Code, document, or environment writes | Scope checks, candidate validation, commit and recovery | Execution reliability |
| Small working set, easily verifiable result | **Add no processing; finish and stop** | Avoid over-governance |

The last row is not an exception. It is a legitimate action of the framework. The control layer also consumes resources and can introduce omissions, over-constraint, and erroneous rewriting.

### 6.5 Three minimal interfaces

A first version can stay small:

```text
prepare(current_goal, state)
    -> current question, necessary evidence, active assumptions, constraints, acceptance conditions

solve(work_packet, operator, budget)
    -> candidate result, dependency conditions, checkable artifacts

check_and_update(candidate, state)
    -> accept, reject, needs validation, acquire evidence, or escalate
```

Add branch state when search is needed; add a commit protocol when external objects are modified; simple tasks can finish within one call. Control happens at the call boundary and does not require reading or manipulating hidden thinking token by token. The model can still reason autonomously inside a well-defined subtask.

### 6.6 Task mapping

| Task type | Main working object | Suitable handling |
|---|---|---|
| Long-document review and revision | Evidence, tickets, cross-chapter constraints, patches | Four-view audit, dependency coordination, controlled commit |
| Short math problem, complex proof | Assumptions, lemmas, quantifiers, completeness obligations | Conditional conclusions, proof dependencies, local checks |
| Combinatorial planning and scheduling | Assignments, remaining domains, resources, backtracking branches | Constraint propagation, branch isolation, solvers |
| Concurrency bug in short code | Event order, shared state, reachable interleavings | State exploration, execution, or model checking |
| Diagnosis with little material | Multiple causal hypotheses, discriminating observations | Hypothesis management, information acquisition, experiment design |
| Large-scale simple data processing | Definitions, fields, full data range | Deterministic programs, coverage and exception checks |
| Multi-source complex research | Evidence relations, source conflicts, conditional conclusions | Evidence organization, uncertainty and dependency management |
| Dynamic agent tasks | Current environment, action preconditions, stale observations | Re-observation, state transition, commit recovery |
| Open-ended creation and design | Multiple objectives, candidate solutions, unsettled preferences | Preserve solution diversity, staged comparison and evaluation |

Open-ended tasks require particular caution when freezing conditions. Turning a provisional preference into a hard constraint too early can compress the effective search space. Here the framework's job is to preserve comparable options and evaluation grounds; it cannot claim that every quality judgment has been programmatically verified.

---

## 7. Cost, Scheduling, and Stopping

### 7.1 The cost ledger

Slicing reduces the size of a single context. Total cost also includes indexing, extraction, repeated loading, adjudication, review, and failed retries. The cost ledger should therefore cover:

```math
C_{\text{total}}
=
C_{\text{index}}
+C_{\text{audit}}
+C_{\text{reconcile}}
+C_{\text{edit}}
+C_{\text{verify}}
+C_{\text{retry}}
+C_{\text{coord}}.
```

Here $`C_{\text{coord}}`$ includes coordination, human adjudication, and runtime overhead. Also record end-to-end time, call count, tokens, and cost, rather than only the length of a single context.

### 7.2 Three scheduling rules

First, **establish coverage initially, then audit incrementally by impact**. There is no need to rerun every view after every sentence, but essential global checks must remain, and old evidence must expire with the version.

Second, **let incremental value decide a view's budget**. Measure how many new valid defects a view finds, how many false positives it produces, and what resources it consumes. A view's name is not a reason to keep it. If a view only repeats other views' conclusions over time, reduce its scope or turn it into sampling.

Third, **when evidence is missing, acquire evidence first**. Asking the same incomplete evidence packet ten times usually does not solve the problem that the decisive variable never appeared. Widen the read, retrieve external material, request an observation, or explicitly output "cannot judge."

### 7.3 Net value of intervention

An engineering decision rule can be written as:

```math
\mathrm{NV}
=
\mathbb{E}[\Delta L]
-
C_{\text{extra}}
-
C_{\text{coord}}
-
\mathbb{E}[L_{\text{new}}],
```

where $\Delta L$ is the expected reduction in loss from errors, $`C_{\text{extra}}`$ is additional computation, $`C_{\text{coord}}`$ is coordination cost, and $`L_{\text{new}}`$ is the loss from new errors introduced by governance itself.

This is a decision criterion, not a precise benefit estimator for the model to fill in by intuition. Actual judgment should come from the task set, historical errors, and development-set calibration. It corresponds to metareasoning: deciding not only how to solve the problem but what computation is worth performing next. Russell and Wefald treat search steps themselves as decisions, selected by their expected value in improving the final decision [11].

### 7.4 When to enable

Combine three modes:

- **Pre-enable for known high-risk tasks.** Examples: tasks that clearly require backtracking, contain concurrent interleavings, change external state, or have strong cross-module joint constraints.
- **Default to lightweight for ordinary tasks.** Use the direct route or appropriate tools, plus necessary checks.
- **Escalate in a targeted way when observable problems appear.** Examples: missed constraints, assumption bleed, repeated errors, stale versions, insufficient evidence coverage.

Research on inference-time compute shows that the effect of different compute-allocation methods depends on task difficulty relative to the model; OptimalThinkingBench observes both overthinking on easy tasks and underthinking on hard tasks, and notes that improving one side can hurt the other [17]. Compute should therefore be scheduled by task, not uniformly lengthened or shortened.

There is no need to make the system fail once on a known dangerous structure before justifying governance.

### 7.5 When to stop

Stop the current line of processing when:

- the acceptance goal is met;
- the budget is exhausted;
- repeated candidates bring no new evidence, no valid exclusion, and no checked progress;
- the blockage is clearly missing observation, missing knowledge, or specification conflict;
- further processing has no corresponding open question.

"Re-audit every step" is not a suitable default. The goal of governance is to increase the density of valid judgment, not to add ceremonial process.

---

## 8. How to Validate

### 8.1 Separate the claims first

Three questions must be answered separately:

1. Does the whole scheme improve final outcomes?
2. Which parts produce the benefit?
3. Does it actually change the internal attention mechanism?

The first two can be tested through black-box model interfaces. The third requires internal access and intervention. The main proposal here does not claim the third, so a behavioral improvement cannot be interpreted directly as "the attention mechanism changed."

| Claim | Current status | Evidence needed |
|---|---|---|
| Protocol invariants are executable | A reference prototype covers several protocol tests | Reproducible runtime tests and fault injection |
| Evidence organization improves evidence use | Related research supports it; the full combination is untested | Controlled end-to-end and component experiments |
| Four views add incremental defect discovery | To be tested | New confirmed defects compared with a module-slicing baseline |
| Dependency coordination reduces regression | To be tested | Cross-module transactions and regression-rate comparison |
| Controlled modification reduces erroneous commits | To be tested | Erroneous-commit rate, stale-rejection rate, correct-escalation rate |
| Directly changing internal attention | Outside the main proposal | Internal access, head-level intervention, randomized controls |

### 8.2 End-to-end comparison: at least five arms

| Arm | Method | Question answered |
|---|---|---|
| A0 | Strong whole-context or paged-browsing baseline, with multiple turns allowed inside the shared budget | Is there a gain over a competitive whole-document approach? |
| A1 | Module slicing only, using the same tickets, patches, and acceptance flow where possible | What do multiple views add over chapter splitting alone? |
| A2 | Four views + physical bucketing + per-bucket edits | How does the original proposal perform? |
| A3 | Four views + dependency coordination + unified adjudication + controlled patches + regression checks | How much does commit governance add? |
| A4 | Adaptive routing: choose the smallest intervention by bottleneck; allow no added processing | Is the routing policy itself worthwhile? |

All arms should use the same model configuration, public specification, source-material permissions, outer budget, and retry policy, and should run in randomized interleaved order.

Do not constrain A0 to a single call while giving A3 dozens of calls, and then attribute the difference to slicing. If a length genuinely exceeds A0's input range, report runnability separately or give A0 a paged-browsing capability. A technical context-window overflow is not a cognitive-capability failure.

### 8.3 Component experiments: control the material before attributing cause

| Experiment | Hold fixed | Vary |
|---|---|---|
| Evidence rearrangement | Exactly the same evidence and distractors | Distance and grouping of relevant evidence |
| Distractor deletion | The same necessary evidence | Amount of irrelevant material |
| Criteria splitting | The same material and full set of evaluation targets | Mixed evaluation vs. separate evaluation then merge |
| Commit organization | The same confirmed tickets and modification requirements | Per-view edits, physical bucketing, or cross-module transactions |
| State externalization | The same branches and constraints | Whether the working set, assumption scopes, and obligations are stored explicitly |
| Tool computation | The same problem and information | Prose reasoning vs. program/solver execution |

Conditions where a human supplies complete evidence, correct tickets, or the correct modification intent are controlled diagnostic experiments. They help localize the problem, but they must not be mixed into actual end-to-end results as if the system had found that information automatically.

### 8.4 Data: controlled generators and real manuscripts have different jobs

**Controlled data:** first generate a story or system with explicit state and constraints, then render it into natural language, and finally inject predefined faults. Cover at least:

- in-module errors and long-range mechanism conflicts;
- aliases, implicit associations, negation, and exceptions;
- adjacent and non-adjacent handoffs;
- two-mechanism conflicts and shared constraints involving three or more parties;
- repairing one problem while breaking another;
- stale versions and conflicting tickets;
- negative controls that are originally correct, information-insufficient, or specification-contradictory.

Answers, defect locations, and hidden repair plans stay in the evaluation process; the runtime sees only the public task specification and source material. RULER's tests of multi-hop tracing, aggregation, and length variation, and NoLiMa's tests of weak literal matching, both show that "find one explicit keyword in a long document" is not enough for these tasks.

**Real manuscripts:** an author or editor confirms a set of defects and protection requirements. Every method starts from the same source snapshot, and final evaluation is anonymous:

- Are the predetermined problems resolved?
- Are the previously correct relations preserved?
- Were new problems introduced?
- Did the reading experience improve?

One manuscript can form a deep case. Its hundreds of tickets still share one work's context and cannot be treated as hundreds of independent manuscript samples. Statistics should cluster by manuscript or generated-system instance, not by ticket.

### 8.5 Metrics

| Layer | Metrics |
|---|---|
| Evidence | Necessary-evidence completeness, condition fidelity, provenance traceability |
| Audit | Confirmed-defect recall, ticket precision, duplication rate, localization error |
| Repair | Valid-repair rate, critical-regression rate, new defects, out-of-scope edits |
| System | Erroneous-commit rate, correct-escalation rate, completion rate, stale-version rejection |
| Resources | Cost, tokens, call count, and end-to-end time across all stages |

The primary endpoint can be defined as:

> Among instances predetermined to be information-sufficient, specification-consistent, equipped with target defects, and completable, the proportion in which the actually adopted final version repairs all target defects, preserves critical protection requirements, and introduces no new critical defect.

Scoring should specify:

- Timeout, exhaustion, refusal, or absence of a final version on a completable task counts as incomplete, with the original pairing preserved.
- Defect-free tasks are reported separately as correct preservation.
- Information-insufficient or unresolvable-conflict tasks are reported separately as correct escalation.
- Do not achieve a high "repair success rate" by rejecting every commit.
- Do not select the best result among unadopted candidates as the final score.

### 8.6 Statistics

Use the independent manuscript or generated-system instance as the unit, with paired differences and instance-level interval estimates. Run a small pilot to estimate variance, then plan sample size against a predetermined minimum meaningful improvement. Randomize and interleave run order to avoid systematic bias from time, caching, and model-version drift.

If the primary endpoint is binary, report paired risk differences, risk ratios, and intervals. If continuous, report paired mean differences and intervals. In either case, keep a failure ledger rather than reporting only successful cases.

### 8.7 Six falsifiable predictions

1. At similar input length, adding mutually exclusive branches and delayed obligations should make state organization more valuable.
2. With task logic held constant, increasing distraction and evidence dispersion should make evidence organization more valuable.
3. At a similar number of steps, adding conditions that must be handled jointly should reduce the value of purely serial slicing.
4. When errors come mainly from exact computation, programmatic tools should outperform more summaries and viewpoint audits.
5. When the working set is small and results are easy to verify, the full pipeline may add only cost and may even introduce new errors.
6. When verification is weak, adding candidates or agents should not be treated by default as an increase in reliability.

The range in which these predictions hold is the real boundary of the framework.

### 8.8 The other route: directly modifying attention weights

With internal model access, direct inference-time attention intervention can be studied. Existing work includes:

- PASTA, which reweights selected attention heads so that they attend more to a designated text region [13];
- Found in the Middle, which studies and calibrates positional attention bias [14].

These methods can be applied without updating model parameters, but they require access to internal attention information and model-specific configuration or calibration. Their validation requirements are stricter:

1. Select intervention layers, heads, positions, and strength on a development set.
2. Freeze the settings before testing.
3. Compare with no intervention, random positions, or random heads.
4. Distinguish manually marked diagnostic conditions from automatically marked conditions.
5. Check answer quality, generation stability, and additional cost together.

An ordinary persona prompt cannot be treated as having implemented this head-level control. For current long-document tasks, completing evidence orchestration and the commit protocol first is more likely to yield interpretable, reproducible engineering results.

### 8.9 What the reference prototype proves and does not prove

The companion reference prototype contains 19 protocol tests covering core protocol invariants:

- citations and patches must match the correct version and source text;
- a model cannot expand the coordinator-approved write scope by creating its own tickets;
- when a change to one chapter breaks a cross-chapter rule, commit is rejected and the state file is unchanged;
- a multi-chapter change that passes checks is committed as one state snapshot;
- proposals against an old version are rejected;
- missing, empty, or ambiguous extraction results cannot count as a pass;
- an unimplemented semantic check returns `UNKNOWN` and blocks commit.

These tests prove the corresponding protocol behavior. The `runtime.py`, `demo.py`, and `test_runtime.py` files in the implementation package correspond to this layer; this article treats their results only as protocol evidence. The prototype does not call a real model, and it has not completed an audit-quality experiment on a 300,000-character manuscript. It provides an execution foundation into which model proposals can be plugged. Passing protocol tests is not evidence of end-to-end effectiveness.

---

## 9. Implementation Path

| Stage | Deliverable | Condition for moving on |
|---|---|---|
| M0: small closed loop | A few modules, one cross-module rule, a complete commit demonstration | Correctly accept valid changes; reject invalid and stale changes |
| M1: read-only audit | Full-manuscript index, coverage ledger, evidence-backed tickets | Human review confirms usable ticket precision and key-evidence coverage |
| M2: multi-view comparison | Records of new defects and cost per view | A new view shows measurable incremental value |
| M3: controlled repair | Candidate patches, cross-module revalidation, anonymous reading evaluation | Repair gain meets the requirement; critical regression is controlled |
| M4: formal comparison | Budget-quality curves, paired results, failure ledger | Supports an effect claim within a clearly stated scope |

### 9.1 Minimum viable implementation

A first version does not need complex infrastructure. It needs at least:

1. source snapshot, stable anchors, and hashes;
2. a versioned contract registry distinguishing hard requirements, soft goals, and candidate requirements;
3. a coverage ledger recording scanned, traced, and unchecked items;
4. an evidence-packet schema and provenance binding;
5. four-view audit prompt templates and structured output;
6. a ticket schema and adjudication records;
7. three scopes: write set, read scope, and revalidation scope;
8. a patch schema with target ID, expected hash, exact source text, and replacement text;
9. structure, target, regression, and semantic validators outputting `PASS/FAIL/UNKNOWN`;
10. atomic commit, stale-evidence invalidation, and transaction terminal states;
11. cost, call, latency, and failure ledgers.

### 9.2 The first real trial

The first real trial should select a small number of cross-chapter defects and must-preserve relations, then verify "evidence can be found, the problem can be judged, and the modification can be accepted" before expanding to the whole manuscript. Suggested design:

- 3–5 cross-chapter defects with clear evidence;
- 3–5 correct relations that must be preserved as protection requirements;
- fixed model, tools, budget, and retry policy;
- run A0, A1, A2, and A3 together, with A4 if needed;
- inspect evidence completeness and ticket precision before repair and regression rates;
- anonymize reading evaluation so evaluators do not know which arm produced a candidate;
- retain all failures, rejections, escalations, and budget exhaustions.

This way, each added layer of complexity has a corresponding artifact, acceptance condition, and measurable benefit, instead of assembling a large all-in-one process at once.

---

## 10. Limitations and Conclusion

### 10.1 Limitations

**First, the hard-constraint guarantee is conditional.** It depends on complete dependency scope, reliable checking, in-scope modification, and commit of exactly the validated candidate. If any of these fails, the guarantee fails.

**Second, soft goals cannot be covered by a formal guarantee.** Pacing, emotional force, character charisma, reading experience, and stylistic consistency still require semantic evaluation, comparative judgment, or human review. They can be structured, but they cannot be disguised as hard constraints.

**Third, effects depend on model, task, and budget.** The same governance scheme may produce different results across models, task distributions, and budgets. A single experiment's average-score increase is not a universal law.

**Fourth, evaluation itself is expensive.** Defect annotation, confirmation of protection requirements, and anonymous review of real manuscripts all require expert time. Synthetic data can expand coverage but cannot replace the subtle constraints of real work.

**Fifth, governance can overreach.** The control layer adds calls, latency, coordination cost, and new error sources. For tasks with a small working set and easily verifiable results, the most reasonable action may be to add no governance.

**Sixth, contract errors propagate downstream.** If the global contract is wrong, even a rigorous local audit may reliably reach a wrong conclusion. A "contract revision" terminal state must be allowed and encouraged.

**Seventh, direct attention intervention is outside the guarantee of this article.** The main proposal controls input and external process, not internal head-level weights. The two routes have different validation requirements and cannot impersonate each other.

### 10.2 Conclusion

The core of attention governance is not making context shorter, and it is not adding four viewpoint prompts. The core is: **at every point where a judgment must be made, preserve sufficient evidence with intact conditions; decompose the overall requirement into judgment tasks with scopes; make shared cross-module constraints explicit; and admit only validated modifications into official state.**

The scheme can be implemented without updating model parameters, and most of it can be validated through black-box interfaces. Its reasonable goal is, under explicit model, task, and budget conditions, to improve the utilization of necessary evidence, the rate of defect discovery, and the rate of valid repair while reducing regression. It does not guarantee that every task benefits, and it does not guarantee that local passage implies global correctness.

What deserves commitment is not "four views always work," but three more basic requirements:

1. Every governance mechanism must state what it changes and what it does not change.
2. Every effectiveness claim must have controls, a budget, and a failure ledger.
3. Every framework must permit the conclusion "this task does not need governance."

In that sense, attention governance is not a more elaborate process. It is a more honest engineering discipline: put the information and state that determine a judgment where they belong, and then let validation decide what may be committed.

---

## References

1. Vaswani, A., et al. *Attention Is All You Need.* arXiv:1706.03762. https://arxiv.org/abs/1706.03762
2. Liu, N. F., et al. *Lost in the Middle: How Language Models Use Long Contexts.* arXiv:2307.03172. https://arxiv.org/abs/2307.03172
3. Shi, F., et al. *Large Language Models Can Be Easily Distracted by Irrelevant Context.* ICML 2023. https://proceedings.mlr.press/v202/shi23a.html
4. Weston, J., & Sukhbaatar, S. *System 2 Attention (is something you might need too).* arXiv:2311.11829. https://arxiv.org/abs/2311.11829
5. Khot, T., et al. *Decomposed Prompting: A Modular Approach for Solving Complex Tasks.* arXiv:2210.02406. https://arxiv.org/abs/2210.02406
6. Modarressi, A., et al. *NoLiMa: Long-Context Evaluation Beyond Literal Matching.* arXiv:2502.05167. https://arxiv.org/abs/2502.05167
7. Hsieh, C.-P., et al. *RULER: What's the Real Context Size of Your Long-Context Language Models?* arXiv:2404.06654. https://arxiv.org/abs/2404.06654
8. Gao, L., et al. *PAL: Program-aided Language Models.* arXiv:2211.10435. https://arxiv.org/abs/2211.10435
9. Liu, B., et al. *LLM+P: Empowering Large Language Models with Optimal Planning Proficiency.* arXiv:2304.11477. https://arxiv.org/abs/2304.11477
10. Yao, S., et al. *Tree of Thoughts: Deliberate Problem Solving with Large Language Models.* arXiv:2305.10601. https://arxiv.org/abs/2305.10601
11. Russell, S., & Wefald, E. *Principles of Metareasoning.* Artificial Intelligence, 49(1–3), 1991. https://doi.org/10.1016/0004-3702(91)90015-C
12. Dechter, R. *Bucket Elimination: A Unifying Framework for Reasoning.* Artificial Intelligence, 113(1–2), 1999. https://doi.org/10.1016/S0004-3702(99)00059-4
13. Zhang, Q., et al. *Tell Your Model Where to Attend: Post-hoc Attention Steering for LLMs.* arXiv:2311.02262. https://arxiv.org/abs/2311.02262
14. Hsieh, C.-Y., et al. *Found in the Middle: Calibrating Positional Attention Bias Improves Long Context Utilization.* arXiv:2406.16008. https://arxiv.org/abs/2406.16008
15. Huang, J., et al. *Large Language Models Cannot Self-Correct Reasoning Yet.* arXiv:2310.01798. https://arxiv.org/abs/2310.01798
16. Lightman, H., et al. *Let's Verify Step by Step.* arXiv:2305.20050. https://arxiv.org/abs/2305.20050
17. Aggarwal, P., et al. *OptimalThinkingBench: Evaluating Over and Underthinking in LLMs.* arXiv:2508.13141. https://arxiv.org/abs/2508.13141
