# Audit Engineering: From Generation–Verification Asymmetry to General Agent Governance

## Abstract

Audit Engineering is an inference-time engineering paradigm for LLM and agent systems. It does not place the burden of quality on writing a perfect prompt in advance, nor does it reduce auditing to a score assigned after generation. Instead, it treats the audit loop as the mechanism for discovering the real objective, localizing mismatch, writing findings back into control objects, preserving history, and preventing regression.

Its starting claim is simple: in many open-ended tasks with severe mismatch and tacit standards, generating an excellent artifact directly is difficult, while identifying where an artifact is wrong, incomplete, or misaligned with the real objective is often easier. Audit Engineering turns that **generation–verification asymmetry** into an engineering loop:

> Let generation expose the problem, let audit convert the problem into an actionable control delta, and let the agent continue from that delta.

This gives Audit Engineering a position alongside Prompt Engineering, Context Engineering, and Hardness Engineering. Prompt Engineering controls how the task is asked. Context Engineering controls what information is visible. Hardness Engineering controls how demanding the task, environment, and acceptance boundary are. Audit Engineering controls how the system discovers the real objective after generation, localizes failure, writes it back into the control space, and prevents the next iteration from regressing.

---

## 1. Why Audit Engineering Is Necessary

Traditional Prompt Engineering often assumes that the user can specify the objective, constraints, style, success criteria, and boundary conditions before the work begins. That assumption breaks down in many high-value tasks. A user may know that an artifact is wrong without yet being able to state what the right artifact should be. They may recognize failure immediately after seeing a candidate but be unable to define the complete objective before the first generation.

This is not merely a failure of articulation. The task itself may have the following properties:

1. **The real objective emerges through generation.** Only after seeing a candidate do the user and auditor learn which dimensions matter.
2. **The specification is counterexample-driven.** A complete rubric is unavailable initially, but failure cases reveal stable defects.
3. **Task value is non-local.** Individual paragraphs, arguments, or tables may be good while the assembled artifact still fails its purpose.
4. **Premature specification narrows search.** A large prompt can increase compliance while suppressing valuable structures that were not anticipated in advance.
5. **Audit is often more controllable than excellent generation.** Finding contradictions, boundary violations, unsupported claims, and missing dependencies is often more stable than producing an excellent final artifact directly.

The central purpose of Audit Engineering is therefore not to “evaluate the result.” It is to:

> Transform an underspecified objective into control objects that can be localized, revised, and regression-tested.

## 2. Its Relationship to Prompt, Context, and Hardness Engineering

Audit Engineering does not replace the other three paradigms. It adds a fourth, orthogonal control dimension.

| Paradigm | Control object | Primary question | Typical artifacts | Main limitation |
| --- | --- | --- | --- | --- |
| Prompt Engineering | Instruction surface | How should the task be expressed? | Prompts, roles, formats, procedures | Assumes the objective can be stated early |
| Context Engineering | Information state | What should the model see? | Documents, retrieval, memory, context windows | Sufficient information does not guarantee the right objective |
| Hardness Engineering | Task difficulty and boundaries | How do we prevent weak proxy tasks from fooling the system? | Hard cases, strong constraints, environment feedback, hard gates | Harder tests still require failure localization |
| Audit Engineering | Audit loop and failure write-back | How does failure reveal the objective and direct the next iteration? | Audit contracts, defect ledgers, control deltas, regression tests | The auditor can inherit specification mismatch |

It qualifies as an independent paradigm for four reasons:

- **Independent bottleneck:** a system may have a strong prompt, sufficient context, and hard acceptance conditions but still lack reliable failure localization and write-back.
- **Independent objects:** it governs Audit Contracts, Audit Findings, Defect Ledgers, Repair Routing, Acceptance Gates, Regression Tests, and Audit Memory.
- **Independent operations:** every finding must be routed to the requirement, context, control space, data, tool, evaluator, renderer, or human boundary—not merely phrased as criticism.
- **General loop:** stories, financial research, code review, strategy, legal memoranda, PRDs, and complex documents can all use candidate → audit → localization → write-back → regeneration → regression audit.

In compact form:

```text
Prompt Engineering   = instruction engineering
Context Engineering  = observation-state engineering
Hardness Engineering = task-boundary engineering
Audit Engineering    = verification–write-back engineering
```

## 3. Definition and Formalization

**Audit Engineering is the discipline of engineering verifier-side control loops that transform underspecified user value into explicit, actionable, and revocable control signals through iterative audit, repair routing, and regression governance.**

Given task input `x`, candidate artifact `y`, history `H`, control state `C`, governed knowledge `K`, and protocol `P`:

```text
Generator: y_t = G(x, C_t, K_t, H_t)
Auditor:   a_t = A(y_t, x, C_t, K_t, H_t, P_t)
Router:    ΔC_t, ΔK_t, ΔP_t = Route(a_t)
Update:    C_{t+1}, K_{t+1}, P_{t+1} = Update(C_t, K_t, P_t, Δ)
Renderer:  y_{t+1} = G(x, C_{t+1}, K_{t+1}, H_{t+1})
Gate:      accept | continue | escalate | stop
```

The audit output `a_t` should not be an unstructured review. A minimal schema is:

```json
{
  "finding": "what is wrong",
  "evidence": "evidence from the artifact, context, or external data",
  "mismatch_type": "aggregation | support | state | specification | fitting_boundary",
  "severity": "blocker | major | minor | note",
  "repair_target": "prompt | context | control_space | data | tool | evaluator | renderer | human",
  "control_delta": "the proposed change to the control state",
  "regression_test": "what the next round must verify",
  "confidence": 0.0
}
```

Three tests distinguish an audit from ordinary commentary:

- Without an actionable `control_delta`, it is only commentary.
- Without a declared `repair_target`, it cannot direct the agent's next action.
- Without a `regression_test`, it cannot prevent repeated failure.

## 4. First Principle: Generation–Verification Asymmetry

Audit Engineering rests on two relative asymmetries:

1. Excellent generation is difficult; defect identification is often easier.
2. Complete specification is difficult; counterexample-driven specification repair is often easier.

In open-ended work, users rarely begin with a complete utility function. Yet after seeing a candidate they can often say: “It omits X, overweights Y, ignores Z, and treats A as B.” If that feedback remains free-form prose, it is easily diluted by the next generation. When recorded as a structured finding, it becomes a control signal.

The asymmetry is not unconditional. Defects must be localizable and criteria must become progressively explicit. Under severe specification mismatch, the auditor itself must be audited. Audit Engineering therefore engineers the verifier and governs the verifier at the same time.

## 5. Relationship to Knowledge Governance

Knowledge Governance is the larger framework. Through Decoupled Control Spaces, Governed Knowledge Objects, validation, rendering, monitoring, and revision, it externalizes task-specific knowledge into governable objects.

Audit Engineering is an independently nameable layer within that framework. It focuses on three problems:

1. **How to audit:** which dimensions, in what order and intensity, and whether adversarial auditing is required.
2. **How to localize:** whether the problem comes from specification, state, support, aggregation, fitting boundary, or rendering loss.
3. **How to write back:** how to turn the finding into a control object, constraint, banned pattern, acceptance threshold, revocation rule, or human decision point.

The distinction is:

```text
Knowledge Governance asks: how should task knowledge be governed?
Audit Engineering asks: how should failure signals be governed?
```

The former stores what should guide generation. The latter stores which failures must not recur, and why.

## 6. The General Workflow

### 6.1 Begin with a weak brief

Audit Engineering permits an incomplete opening request such as “build a financial research framework” or “turn these materials into an executable plan.” It does not require the first prompt to become a giant specification.

### 6.2 Generate a low-cost candidate

The first round is not expected to pass. Its purpose is to produce an artifact complete enough to expose structural defects.

```text
Weak Brief -> Candidate v0
```

### 6.3 Establish Audit Contract v0

The audit contract is a provisional agreement for the current round, not ground truth. It should include:

- artifact type and user-visible objective;
- known constraints and prohibited failure modes;
- audit dimensions and severity levels;
- assumptions the auditor is not allowed to make;
- stopping conditions.

The contract itself remains auditable because the real standard is rarely complete at the beginning.

### 6.4 Audit the candidate independently

The auditor finds, localizes, and routes defects; it does not rewrite the artifact. Generator and auditor should be isolated where possible. Even if they use the same underlying model, they should use separate contexts, with external tools or dedicated verifiers added for verifiable tasks.

A minimal audit covers:

- **Specification audit:** does the artifact satisfy the real task rather than merely the prompt?
- **Structural audit:** do locally correct parts compose into global value?
- **State audit:** does the result depend on hidden, changing, or unstated state?
- **Evidence audit:** are facts, data, citations, and time references reliable?
- **Boundary audit:** does the conclusion survive adjacent conditions?

### 6.5 Map findings back to control space

This is the boundary between Audit Engineering and ordinary evaluation. “The report lacks depth,” “the character lacks motivation,” and “the strategy lacks risk analysis” are insufficient. The system must continue:

- Which control object should change?
- Is the requirement unclear, or is evidence missing from context?
- Is the structural variable absent, or did rendering lose it?
- How will the next round verify that the failure did not recur?

| Repair target | Meaning |
| --- | --- |
| Prompt Delta | Revise task instructions |
| Context Delta | Add facts, data, source material, or memory |
| Control-Space Delta | Add missing variables, dependencies, constraints, or state |
| Evaluator Delta | Repair an incorrect or weak audit standard |
| Tool/Data Delta | Invoke retrieval, computation, real-time data, or another tool |
| Renderer Delta | Preserve a correct control state in the final expression |
| Human-Governed Delta | Ask for a value judgment, risk preference, authorization, or business boundary |

### 6.6 Repair locally

When the defect originates in control space, the system should not default to “rewrite the whole artifact.” A safer order is:

```text
repair the control object -> repair local structure -> repair surface expression
```

Repeated full rewrites collapse back into output-space sampling and erase information about which control decision caused the defect.

### 6.7 Run regression audit

Every repair can introduce new failures. Regression audit asks:

- Did the previous blocker disappear?
- Was each major issue resolved, downgraded, or explicitly accepted?
- Were old constraints preserved?
- Does new material conflict with existing material?
- Did the repair sacrifice a more important objective?

### 6.8 End the loop

Stopping does not mean “the artifact has no flaws.” It means “the remaining flaws are explicitly governed.” Useful stopping conditions include:

- no blocker findings;
- all major findings resolved, downgraded, or converted into accepted risks;
- no high-value control delta appears for two consecutive rounds;
- regression tests remain stable;
- external verification or human acceptance passes;
- marginal audit benefit falls below its cost.

## 7. Core Object System

### 7.1 Audit Contract

Defines the objective, boundary, dimensions, intensity, and stopping condition for the current audit.

```json
{
  "artifact_type": "financial_research_memo",
  "primary_goal": "produce a framework suitable for investment-committee discussion",
  "known_constraints": ["no unverified real-time data", "separate facts, judgments, and assumptions"],
  "audit_dimensions": ["thesis", "evidence", "valuation", "risk", "counterargument", "time_validity"],
  "blockers": ["incorrect data definitions", "future leakage", "assumptions presented as facts"],
  "stop_condition": "no blockers; every major assumption is evidenced or marked uncertain"
}
```

### 7.2 Audit Finding

Each finding must be traceable, localizable, and regression-testable.

```json
{
  "id": "F-007",
  "finding": "the conclusion depends on margin expansion but does not explain its drivers",
  "evidence": "section 3 assumes a 2-point margin increase without decomposition",
  "mismatch_type": "specification",
  "severity": "major",
  "repair_target": "control_space",
  "control_delta": "add margin_driver_tree to thesis_map",
  "regression_test": "check every material financial assumption for drivers, evidence, and sensitivity"
}
```

### 7.3 Defect Ledger

The ledger preserves historical defects, repair rounds, current status, and recurrence.

```text
open -> patched -> regression_passed -> accepted_risk -> revoked
```

### 7.4 Control Delta

A control delta states how the finding changes the next generation space.

```json
{
  "add_control_object": "margin_driver_tree",
  "modify_rubric": "decompose margin assumptions into price, cost, mix, and utilization",
  "ban_pattern": "do not substitute a one-sentence trend claim for driver decomposition"
}
```

### 7.5 Regression Test

A regression test need not be code. It may be a repeatable natural-language acceptance rule—for example: every core conclusion must link to factual evidence, an explicit assumption, a counterargument, and a falsification condition.

### 7.6 Audit Memory

Audit Memory stores reusable failure patterns, not only successful templates. Negative experience is especially valuable because it prunes large low-value regions of search.

## 8. Audit Types

| Type | Core question |
| --- | --- |
| Conformance Audit | Does the artifact satisfy explicit format, constraint, and delivery requirements? |
| Value Audit | Does it serve the real objective rather than merely satisfy surface requirements? |
| Structural Audit | Do good local parts compose into global value? |
| Evidence Audit | Are sources, definitions, timestamps, and inference chains reliable? |
| State Audit | Does the answer depend on hidden, changing, or unstated state? |
| Adversarial Audit | Does the artifact look sophisticated while failing in substance? |
| Audit-of-Audit | Is the auditor mistaking preference for criteria, producing non-actionable advice, or adding complexity without value? |

## 9. Mapping to the Five Mismatches

| Mismatch | Audit Engineering intervention |
| --- | --- |
| Aggregation | Test whether local improvements compose into global value; externalize dependency graphs, promise–payoff chains, and acceptance lists |
| Support | Search for omitted low-salience evidence, rare structures, counterexamples, and tail solutions |
| State | Audit applicable state, triggers, time windows, markets, organizations, and user conditions |
| Specification | Test whether the prompt, rubric, and explicit objective match the real success criterion |
| Fitting Boundary | Test whether a pattern, metric, template, role, or feedback signal has been generalized beyond its valid boundary |

The five mismatches are useful not merely as labels but because they imply different interventions:

```text
detect mismatch -> localize mismatch -> modify control object -> regression-test the mismatch
```

## 10. Three Applications

### 10.1 Story generation

A story system can first represent character state, event graph, emotional curve, thematic lines, rhythm, and conflict architecture in a `LogicSpace`, then render and audit a draft. Findings route to control objects rather than scores:

```text
an image is introduced but never deepened
-> theme_lines / promise_payoff_chain

a character changes position without psychological cause
-> character_arc / value_transition

an antagonist supplies pressure but no thematic function
-> conflict_architecture / thematic_function
```

The story auditor is therefore a repair router, not a scoring device.

### 10.2 Financial research

The criteria for valuable financial analysis rarely fit inside one opening prompt. A stronger loop is:

```text
weak brief
-> initial research memo
-> thesis / evidence / valuation / risk / regime / counterargument audit
-> defect ledger
-> write back thesis_map, driver_tree, risk_register, data_requirements
-> regenerate
-> committee, short-side, and data-definition audits
-> final memo
```

Audit Engineering in finance should first produce a research quality-control system: Thesis Map, Evidence Table, Assumption Register, Risk Register, Counterargument Map, Regime Matrix, Valuation Sensitivity, Data Freshness Log, and Audit Findings Ledger. It is not itself an investment recommendation.

### 10.3 General agents

When a user asks for a growth plan, project organization, or research pipeline, the agent need not pretend that the initial objective is complete. It can:

1. generate a candidate;
2. let an independent auditor identify mismatch with the real objective;
3. route findings to prompt, context, control space, tools, acceptance criteria, or a human boundary;
4. revise locally from the new control state;
5. regression-test prior findings;
6. preserve history until no high-value control delta remains.

The user may not yet be able to state the complete objective, but the audit loop must state why each round has not passed.

## 11. Minimum Viable Architecture

| Role | Responsibility |
| --- | --- |
| Generator | Produce candidates without defending them |
| Auditor | Find and localize defects without repairing them |
| Repair Router | Route findings to prompt, context, control, evaluator, tool, or human |
| Editor | Apply local repairs rather than defaulting to a full rewrite |
| Regression Judge | Test old defects, preserved constraints, and acceptance gates |

The system also needs Artifact Store, Audit Ledger, Control State, Rubric Store, Regression Suite, and Decision Log.

```text
Brief
-> Candidate
-> Audit Findings
-> Control Deltas
-> Revised Control State
-> New Candidate
-> Regression Audit
-> Acceptance Gate
```

## 12. Minimal Prompt Templates

### Generator

```text
You are the Generator. Produce a candidate from the current brief,
control state, and audit history.

1. Prioritize the current Control State.
2. Do not defend previous errors.
3. Do not silently delete auditor constraints.
4. Surface conflicts in the control state.
5. Output the candidate, not an audit.
```

### Auditor

```text
You are an independent Auditor. Do not rewrite the artifact.

Every finding must contain:
finding, evidence, mismatch_type, severity, repair_target,
control_delta, regression_test, and confidence.

Do not provide vague advice, use “go deeper” as localization,
rewrite the whole artifact, disguise preference as a task criterion,
or propose changes that cannot be executed or verified.
```

### Repair Router

```text
For each finding choose:
accept_delta | reject_delta | downgrade | ask_human | require_data | audit_auditor

Return:
1. accepted control deltas;
2. rejected findings and reasons;
3. rules for the next generation;
4. the next regression checklist.
```

### Regression Auditor

```text
Check only:
1. whether previous blockers are resolved;
2. whether previous majors are resolved, downgraded, or accepted;
3. whether old constraints were broken;
4. whether a repair introduced a new blocker;
5. whether another high-value control delta remains.
```

## 13. Common Failure Modes

### Audit collapses into scoring

“Structure 8, logic 7, expression 9” provides almost no guidance for the next round. An audit must localize the failure to a control object.

### The auditor inherits specification mismatch

An auditor can reinforce a bad rubric. Audit-of-Audit, comparison samples, counterexamples, and external validation should be used to revise the contract.

### Audit induces unnecessary complexity

An auditor may propose more dimensions every round until the control space suffers combinatorial explosion. A control delta should justify its value, cost, and verifiability.

### The agent learns to please the auditor

The system may optimize audit score rather than real value. Adversarial audits, hidden tests, external validation, human acceptance, and rotating criteria can reduce this Goodhart failure.

### Surface repair replaces control repair

Adding a sentence of introspection does not repair a missing character motive. Adding “according to industry trends” does not repair an unsupported financial assumption. The missing structural or evidence object must change.

### Iteration never ends

An auditor can always find another issue. That does not mean every issue is worth fixing. Explicit stopping conditions and cost thresholds are mandatory.

## 14. Metrics

Audit Engineering should be evaluated not only by final score but by whether the loop increases controllability.

| Metric | Meaning |
| --- | --- |
| Audit Yield | High-value control deltas produced per round |
| Localization Rate | Share of findings mapped to a clear repair target |
| Recurrence Rate | Frequency with which defect families return |
| Regression Pass Rate | Stability with which old failures remain resolved |
| Control Delta Precision | Share of write-backs that actually improve the artifact |
| Over-Audit Rate | Share of low-value or complexity-inflating findings |
| External Validity | Agreement with tools, humans, or the real environment |
| Cost per Accepted Artifact | Rounds, tokens, time, and human effort required for acceptance |

## 15. Applicability Boundary

Audit Engineering is most useful when:

- the requirement is initially underspecified;
- quality depends on tacit judgment;
- the first draft can easily look correct while failing;
- error costs are high;
- similar tasks recur;
- users recognize dissatisfaction more easily than they can pre-specify success;
- value depends on multiple non-local structures.

Heavy governance is usually unnecessary for:

- simple format conversion;
- low-risk summarization;
- information extraction under explicit criteria;
- one-off light rewriting;
- local polishing;
- tasks already in the Autoregressive Extraordinary regime.

Governance should selectively target mismatch boundaries, not every token.

## 16. Final Proposition

When the objective cannot yet be fully stated, do not place all complexity into the prompt. Generate an auditable object, use an independent audit to turn “this is wrong” into control deltas, and use the visible history to externalize tacit value over successive rounds.

```text
Story:   LogicSpace -> Draft -> Evaluation -> Defect Attack -> Revision
Finance: ThesisMap -> Memo -> Evidence/Risk Audit -> Driver Repair -> Regression
Code:    Architecture -> Implementation -> Test/Leakage Audit -> Refactor -> Regression
Strategy: Frame -> Plan -> Assumption/Counterfactual Audit -> Reframe -> Board-ready Output
Agent:   Candidate -> Audit -> Control Delta -> Rerender -> Gate
```

Audit Engineering is not a Prompt Engineering technique, a subset of Context Engineering, or a substitute for Hardness Engineering. It turns two important asymmetries—generation is hard while verification is often easier, and complete specification is hard while counterexample-driven revision is often easier—into a reusable engineering discipline.
