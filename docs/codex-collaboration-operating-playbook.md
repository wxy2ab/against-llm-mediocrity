# Codex Collaboration Operating Playbook

## Patterns for High-Reliability Human–Agent Work

**Status:** Working practice guide<br>
**Version:** 1.0<br>
**Chinese:** [中文版本](codex-collaboration-operating-playbook.zh-CN.md)<br>
**Related framework:** [Governed Human–AI Collaboration](governed-human-ai-collaboration.md)<br>
**Related operating guides:** [Agent Task Guidelines](guidelines/README.md)

## 1. Purpose and Provenance

This playbook names a set of collaboration patterns that emerged from repeated work with Codex across engineering, research, writing, theory building, long-running jobs, and software delivery.

It is not a frequency analysis of conversational habits. It is a retrospective synthesis of methods that were actually used and produced visible value. Examples such as SCS, AlphaSchema, VPP, `stock_rec_v3`, and Story Insight V7 are evidence of where the patterns came from; they are not claims that the patterns have been universally validated.

The aim is to turn a good but previously implicit working relationship into a small, reusable vocabulary. A short mode name should be enough to establish:

- what the agent may and may not change;
- which evidence counts;
- how a claim becomes a confirmed defect;
- when human judgment is genuinely required;
- what completion means.

The central principle is:

> Make the problem hard through adversarial review and counterexamples; turn the design into an executable contract; isolate authority and impact during implementation; accept results only through authentic runs and frozen evaluation; complete the work with a structured handoff and a closed delivery loop.

## 2. The Default Collaboration Loop

The patterns compose into a staged loop rather than one giant prompt:

```text
observe and inspect
  → challenge the first diagnosis
  → establish the authoritative contract
  → trace the design invariant end to end
  → write an executable plan
  → implement within a bounded write-set
  → validate on frozen or authentic evidence
  → accept, reject, or escalate
  → hand off and close delivery
```

Not every task needs every stage. A small documentation fix may go directly from scoped inspection to delivery. A high-risk capability may require the entire loop. The routing rule is to add governance where a mistake could be expensive, hard to detect, or easy to rationalize—not to add ceremony everywhere.

## 3. Core Collaboration Patterns

### 3.1 Read-Only Adversarial Audit

**Use when:** the user asks for a review, an observed problem may be only a suspicious symptom, or premature editing would contaminate the diagnosis.

**Operating contract:**

1. Inspect without modifying code or authoritative state.
2. Record the first-pass findings.
3. Try to refute each finding using code paths, runtime evidence, counterexamples, or fault injection.
4. Classify each item as confirmed defect, suspected defect, or non-defect.
5. Move only confirmed defects into a later planning stage.

A confirmed defect needs more than an opinion. It should include at least one located code path and one meaningful evidentiary basis: runtime behavior, a falsifying example, a violated contract, or a reproducible failure.

**Invocation:**

> Run a read-only adversarial audit. Find possible defects, then try to disprove your own findings. Only defects that survive the challenge enter the plan. Do not modify code in this round.

**Guardrail:** “This could be improved” is not equivalent to “this is defective.” The audit must preserve that distinction.

### 3.2 Authority-to-Implementation Mapping

**Use when:** correctness is defined by a paper, official API, standard, architecture specification, or other authoritative source.

**Operating contract:**

1. Extract the relevant definitions and invariants from the authority.
2. Map them to implementation contracts, data, algorithms, validation, and artifacts.
3. Map existing tests to those requirements.
4. Design counterexamples that can falsify the implementation beyond the current test suite.

```text
source definition → implementation point → existing evidence → missing counterexample
```

This pattern was valuable when a passing test suite did not establish semantic correctness. In the AlphaSchema work, for example, counterexamples exposed problems that the existing 46 passing tests did not cover, including look-ahead behavior, unsafe imports, nontermination, reward errors, and inactive vocabulary semantics.

**Invocation:**

> Do not let the current tests define correctness. Extract the contract from the authoritative source, build a source–implementation–test map, and add counterexamples capable of falsifying the current implementation.

**Guardrail:** Authority must be scoped. A paper's experimental protocol, an API's documented behavior, and a project's local design decision are different kinds of authority and should not be silently conflated.

### 3.3 End-to-End Design-Invariant Audit

**Use when:** the architecture says the system should behave one way, but the observed output suggests that the intended distinction has been lost somewhere downstream.

**Operating contract:** identify the design invariant, then trace it across every layer that can preserve, transform, mix, or erase it:

```text
configuration
  → data generation
  → qualification gate
  → decision score
  → promotion/routing
  → runtime behavior
  → report/export
  → tests
```

Do not declare the invariant implemented because one layer contains the right field or formula. Completion requires that the intended semantics survive the full path.

**Invocation:**

> Run a design-invariant audit. Trace this intent through configuration, data, gates, scoring, promotion, runtime, reporting, and tests. Do not treat a local implementation as proof of end-to-end preservation.

**Guardrail:** If a report is wrong because an upstream distinction was already erased, changing the report alone is a symptom-level repair.

### 3.4 Evidence-Chain Root-Cause Diagnosis

**Use when:** operational language is dramatic or ambiguous—for example, “the system failed,” “the gate rejected everything,” or “the factor never worked.”

**Operating contract:** trace the claim from raw inputs through artifacts, state fields, decision logic, and reporting. Separate at least:

- whether the execution path actually stopped;
- whether a qualification or policy gate actually failed;
- whether the signal had zero matches or merely degraded;
- whether fallback behavior occurred;
- whether the report overstated the condition;
- whether two quoted metrics describe the same evaluation object and time horizon.

The output should state both the **code-defined conclusion** and the **production-semantic conclusion**. They may differ.

**Invocation:**

> Diagnose through the evidence chain, from raw data and runtime artifacts to state, decisions, and reporting. Separate the code-defined conclusion from the production-semantic conclusion. Diagnose first; do not fix yet.

**Guardrail:** Correcting misleading wording does not close the task if the underlying output still violates a design invariant.

### 3.5 Executable Plan Contract

**Use when:** implementation spans interfaces, data contracts, compatibility, multiple files, or a meaningful authority boundary.

**Operating contract:** planning and mutation are separate stages. Before editing, the plan should define:

- summary and intended outcome;
- public interfaces and data contracts;
- implementation changes and allowed write-set;
- compatibility and migration behavior;
- test plan and required runtime evidence;
- assumptions and unresolved choices;
- explicit non-goals and prohibited actions;
- rollback or recovery path;
- failure conditions;
- Definition of Done.

The plan is not a narrative forecast. It is a reviewable contract that another session or agent could execute without inventing missing product decisions.

**Invocation:**

> Produce an executable plan without writing code. Specify interfaces, data contracts, compatibility, allowed scope, non-goals, validation evidence, failure conditions, rollback, and Definition of Done. Implement only after confirmation.

**Guardrail:** Plan approval authorizes only the stated write-set and behavior. It does not authorize opportunistic refactoring.

### 3.6 Frozen-Boundary Generalization Experiment

**Use when:** improving an agent, heuristic, factor, or strategy against known failures could overfit cases, databases, seeds, or question families.

**Operating contract:** freeze the data, sample, search space, strategy boundary, evaluation procedure, and discovery cutoff before confirmatory evaluation. Keep experimental and general profiles separate. A failed case may reveal a general risk, but it may not directly become a case-specific rule.

Use three distinct roles for data:

- **discovery:** generate hypotheses;
- **validation:** select or stabilize a general mechanism;
- **blind test:** estimate transfer after code and criteria are frozen.

Renaming tests or rerunning the same seeds can detect obvious memorization, but it cannot rule out statistical overfitting. A fresh blind cohort is the stronger test.

**Invocation:**

> Run a frozen-boundary generalization experiment. Freeze data, samples, search space, strategy, and evaluation; separate experimental and general profiles; use failed cases only to identify general risks; evaluate frozen code on a fresh blind cohort.

**Guardrail:** Any criterion added after seeing test outcomes belongs to a new exploratory round, not the current confirmatory result.

### 3.7 Zero-Impact Research Sidecar

**Use when:** a new factor, agent capability, or automated decision is promising but not yet entitled to affect production.

**Operating contract:** the sidecar may generate hypotheses, predictions, and a complete ledger, but it must have zero production authority. Typical controls include:

- force contribution or `factor_value` to zero;
- prohibit effects on ranking, holdings, transactions, or authoritative state;
- do not publish a production pointer;
- permit exploration only within the discovery window;
- after freezing, allow simplification, relaxation, or merging, but not post-hoc condition growth;
- require independent validation against a predefined promotion gate.

**Invocation:**

> Implement the capability as a zero-impact research sidecar. It may produce hypotheses and a complete ledger, but it must not affect production outputs. Freeze it, validate it independently, and expand authority only through predefined promotion gates.

**Guardrail:** “Shadow mode” is meaningful only when zero influence is mechanically enforced and auditable.

### 3.8 Planner–Executor–Validator–Authority Separation

**Use when:** a change touches authoritative state, generated artifacts, automated repair, or high-risk decisions.

**Operating contract:**

| Role | May do | Must not do |
|---|---|---|
| Planner | Propose intent, scope, preconditions, and a change blueprint | Directly mutate authoritative state |
| Executor | Apply the authorized write-set in isolation | Expand scope or invent new authority |
| Validator | Test the candidate against explicit acceptance criteria | Secretly repair the candidate it is judging |
| Authority | Accept, reject, or promote the validated candidate | Delegate final acceptance implicitly |

Semantic post-render changes should pass through a governed modification channel. Deterministic derivations—hashes, content-addressed storage, formatting, and mechanical exports—should remain deterministic code rather than being needlessly delegated to more agents.

**Invocation:**

> Separate planning, execution, validation, and acceptance. The planner cannot mutate authority; the executor cannot expand the write-set; the validator cannot complete the executor's answer; final acceptance remains with the domain authority.

**Guardrail:** Separation is about incompatible authority, not maximizing the number of agents or processes.

### 3.9 Continuous Authentic Execution

**Use when:** a long-running job must be supervised until real artifacts satisfy an operational acceptance gate.

**Operating contract:** define before starting:

- hard failures and hard success gates;
- recoverable failures;
- soft debt that may be reported without stopping the run;
- sparse inspection cadence;
- attempt, failed, and abandoned criteria;
- permitted repair scope;
- cleanup and terminal conditions.

Monitor at a fixed, meaningful cadence rather than narrating every minute. Repair only stable, reproducible architectural failures. After a repair, start a genuine new-version run and validate its real artifacts. Do not fabricate, replay, or manually edit databases or content-addressed artifacts to simulate success.

**Invocation:**

> Use continuous authentic execution. Define hard failures, recoverable failures, soft debt, inspection cadence, repair authority, and terminal conditions. Continue until genuine artifacts satisfy the hard gate; process exit alone is not success.

**Guardrail:** Completion includes artifact integrity, lineage, exports, process state, and configuration cleanup—not merely a zero exit code.

### 3.10 Structured Session Handoff

**Use when:** context is moving to a new Codex task, a long job will outlive the current session, or another operator must resume without reconstructing the project history.

**Operating contract:** a handoff is a state delta, not background prose. Include:

- baseline branch and commit;
- confirmed facts and current state;
- authoritative documents and artifact locations;
- completed and incomplete work;
- scope and prohibitions;
- exact next actions in order;
- validation and terminal conditions.

Long-lived specifications belong in versioned documents. The handoff should link to those documents and carry only current state, evidence, and deltas.

**Invocation:**

> Produce a new-session handoff organized as state, evidence, boundaries, unfinished work, execution order, validation, and prohibitions. Reference versioned specifications instead of repeating background prose.

**Guardrail:** A handoff is successful when the next task can act safely without rediscovering settled facts or silently expanding scope.

### 3.11 Minimal Sufficient Human Query

**Use when:** the agent has exhausted safe in-scope progress and needs a human-controlled variable to continue.

**Operating contract:** ask the human only when the next step requires at least one of:

- new authority or credentials;
- expansion of the approved modification scope;
- an irreversible or materially risky external action;
- a substantive product, value, budget, or taste decision;
- information that cannot be obtained from the environment.

Ask one question that injects the missing variable and restores autonomy. Do not return the entire task to the user.

**Invocation:**

> Proceed autonomously unless new authority, broader scope, or a substantive product choice is required. If blocked, ask one minimal question that unlocks the next safe action.

**Guardrail:** A status update, uncertainty, or difficult implementation is not by itself a reason to escalate.

## 4. Supporting Patterns

### 4.1 Multi-Lens Writing Review

Complete a coherent draft before revising it through independent lenses. The value comes from distinct responsibilities, not from repeating generic polishing five times:

1. definitions, scope, and boundaries;
2. evidence and claim hardness;
3. counterexamples, falsifiability, and limitations;
4. practical implications and actionability;
5. bilingual, structural, link, rendering, and publication consistency.

Each pass should be able to reject or weaken claims, not merely improve style.

**Invocation:**

> Finish the full draft, then review it through five independent lenses: boundaries, evidence, falsifiability, actionability, and publication consistency.

### 4.2 Closed Delivery Loop

Local edits are an intermediate state. When publication is in scope, delivery follows:

```text
scope diff → tests → branch → commit → push → PR → CI
  → merge → cleanup → verify main and workspace state
```

The integrity rules are more important than the Git commands:

- stage only task-scoped files;
- preserve unrelated user changes;
- disclose unrelated test failures truthfully;
- do not bypass protected checks to manufacture a green result;
- after merge, verify local state, remote state, and branch cleanup.

**Invocation:**

> Complete the delivery loop: verify the scoped diff, test it, publish it through the protected path, merge only after CI, clean up, and verify the final main/workspace state.

## 5. Mode Catalog

| Short label | Meaning |
|---|---|
| Read-only adversarial audit | Find possible defects, challenge them, and do not edit in this round |
| Authority mapping | Map source definition → implementation → tests → counterexamples |
| Design-invariant audit | Trace one intent end to end across configuration, data, decisions, runtime, and reports |
| Evidence-chain diagnosis | Distinguish real failure, gate failure, fallback/degradation, and reporting error |
| Executable plan | Write the implementation contract first; execute after approval |
| Generalization guard | Freeze boundaries, separate profiles, and use a fresh blind cohort |
| Zero-impact sidecar | Generate research evidence without production influence |
| Governed change loop | Blueprint → isolated execution → validation → accept/reject |
| Continuous authentic execution | Sparse monitoring with hard/soft gates until real terminal conditions |
| Session handoff | Produce an actionable state package for a new task |
| Minimal sufficient query | Ask one human question only when genuinely blocked |
| Multi-lens writing review | Review a complete draft through independent quality dimensions |
| Closed delivery loop | Test, publish, merge, clean up, and verify final state |

## 6. Recommended Compositions

| Task shape | Pattern sequence |
|---|---|
| Ambiguous engineering failure | Read-only adversarial audit → evidence-chain diagnosis → design-invariant audit → executable plan |
| Paper or API reproduction | Authority mapping → counterexamples → frozen-boundary experiment → executable plan |
| High-risk new capability | Zero-impact sidecar → frozen validation → governed promotion |
| Automated semantic repair | Planner–Executor–Validator–Authority separation → authentic validation → accept/reject |
| Long-running production-like job | Continuous authentic execution → stable repair only → structured handoff |
| Theory or research writing | Complete draft → multi-lens review → bilingual consistency check |
| Repository delivery | Scoped implementation → tests → closed delivery loop |

These are defaults, not mandatory ceremonies. The smallest sequence that preserves authority, evidence, and reversibility is usually the best one.

## 7. Reusable Artifacts

### 7.1 Confirmed Finding Record

```text
Finding:
Classification: confirmed defect | suspected defect | non-defect
Violated authority or invariant:
Located code/artifact path:
Runtime or test evidence:
Attempted refutation:
Why the refutation failed or succeeded:
Impact boundary:
Recommended next stage: stop | investigate | plan
```

### 7.2 Executable Plan Skeleton

```text
Outcome:
Authoritative contract:
Allowed write-set:
Public interfaces and data contracts:
Implementation changes:
Compatibility and migration:
Validation evidence:
Failure conditions:
Rollback or recovery:
Explicit non-goals:
Definition of Done:
```

### 7.3 Session Handoff Skeleton

```text
Baseline branch/commit:
Current state:
Confirmed facts and evidence:
Authoritative documents/artifacts:
Completed work:
Unfinished work:
Allowed scope and prohibitions:
Next actions in order:
Validation gates:
Terminal conditions:
```

## 8. Definition of Done for the Collaboration

A task is not complete merely because the agent produced text, changed files, or ended a process. It is complete when, in proportion to the task's risk:

- the claimed problem survived appropriate adversarial scrutiny;
- the implementation stayed within its authority and write-set;
- the intended invariant survives end to end;
- validation uses evidence capable of falsifying the result;
- production claims come from authentic artifacts rather than simulated state;
- remaining uncertainty and soft debt are explicit;
- the next operator can resume from a compact, versioned state;
- any requested publication path is fully closed.

This is the practical signature of the collaboration: the human governs the consequential variables, while Codex keeps the rest of the work moving, evidence-bearing, bounded, and recoverable.
