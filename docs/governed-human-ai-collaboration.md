# Governed Human-AI Collaboration

## From Chat-Based Use to Variable Governance

**Status:** Working practice framework  
**Version:** 1.1  
**Technical supplement:** [Human-Assist Operational Mismatches](human-assist-operational-mismatches.md)  
**Main manuscript:** [Knowledge Governance for Large Language Model Systems](knowledge-governance-llm-systems-local-alignment.md)

## 1. Core Proposition

The best division of labor between AI and humans is not a static split between "AI work" and "human work." It is governance of task-critical variables.

AI should advance everything that can be generated, searched, structured, simulated, tested, or verified. Humans should govern the variables that require legitimate value judgment, preference, budget, authority, taste, responsibility, or lived context.

```text
AI: process → search → structure → simulate → verify
Human: set values → allocate budget → authorize → judge taste → own responsibility
System: preserve durable judgments as GKOs/GEOs → restore AI autonomy
```

The collaboration unit is not the whole task. It is the **control variable**.

## 2. When Governance Is and Is Not Needed

Governed collaboration is useful for high-mismatch, high-risk, preference-heavy, cross-role, or reusable work. It should not burden tasks that are already in an autoregressive-extraordinary regime.

| Positive-alignment task | AI should do | Human boundary |
|---|---|---|
| Context compression | summarize, classify, extract decision variables | confirm whether stakes were omitted |
| Semantic decompression | expand notes or outlines into prose | ensure upstream structure is correct |
| Register transfer | adapt tone and audience | intervene when legal, relational, or reputational boundaries are tacit |
| Structured transformation | create tables, checklists, JSON, SOPs | confirm the format reflects the real workflow |
| Candidate generation | propose titles, risks, edge cases, queries | select, rank, and validate |

The design rule is:

> Govern the unstable boundary, not every token.

## 3. Ask the Environment Before Asking the Human

The first question is not "Can AI do this?" It is:

> Can the decisive uncertainty be obtained from the environment, feedback, tools, simulation, or a constructed test?

### 3.1 Environment-Observable Work

Facts should be retrieved, inspected, tested, or measured before they are escalated.

| Task | AI-first action | Avoid premature human burden |
|---|---|---|
| Current research | retrieve and cross-check sources | "What do you think the current fact is?" |
| Code correctness | run tests, inspect types and runtime behavior | "Do you think this code is correct?" |
| Data analysis | inspect distributions, anomalies, leakage, bias | "Where do you feel the anomaly is?" |
| Product operations | analyze funnels, cohorts, logs, feedback | "Do you think users like it?" |
| Deployment | inspect configuration, logs, dependencies, CI | "Do you think deployment will fail?" |

### 3.2 Feedback-Learnable Work

Some preferences cannot be fully stated in advance. AI should construct contrasts so that preference becomes visible through selection.

Instead of:

> What style do you want?

Use:

> Here are three meaning-preserving variants: restrained expert, sharp argument, and public explanation. Which is closest, and which is unacceptable?

Useful intermediate objects include:

- pairwise comparisons;
- positive and negative examples;
- style axes;
- preference rankings;
- edit traces;
- disqualifying failures.

### 3.3 Constructed Proving Grounds

When real feedback is unavailable or costly, AI should construct environments where proposals can fail:

- competitor responses and price wars;
- novice, impatient, or adversarial user journeys;
- red-team and privacy-abuse cases;
- bull/base/bear market states;
- legal, sales, support, executive, and customer perspectives;
- counterfactuals, edge cases, and rollback scenarios.

Simulation does not establish truth, but it widens the test surface and exposes hidden assumptions.

### 3.4 Human-Governed Variables

Ask a human only when a remaining variable cannot be reliably observed, inferred, validated, or legitimately authorized.

| Variable | Human contribution |
|---|---|
| fact or state | confirm a specific unavailable condition |
| preference weight | choose which objective dominates |
| authorization | approve a concrete external or irreversible action |
| boundary | define when a rule applies or stops applying |
| validation signal | provide acceptance criteria, expert review, or unavailable evidence |
| resource | grant access or approve a degraded path |
| responsibility | identify the accountable owner |
| stopping criterion | define what counts as sufficient |

## 4. Three-Layer Diagnostic Stack

| Layer | Question | Collaboration consequence |
|---|---|---|
| Primitive mismatch | Why might ordinary generation diverge from value? | reparameterize task or construct control space |
| Operational blocker | Which missing control variable prevents progress? | attempt autonomous recovery, then route if needed |
| Escalation protocol | What is the smallest human contribution? | issue MSHQ, apply GEO, restore autonomy |

The five operational domains are:

1. information and evidence;
2. value and specification;
3. authority and responsibility;
4. boundary and timing;
5. coordination and control representation.

See the [technical supplement](human-assist-operational-mismatches.md) for definitions and escalation gates.

## 5. The Governed Collaboration Workflow

1. **Route low-mismatch work directly.** Complete compression, transformation, drafting, and candidate generation without unnecessary governance.
2. **Diagnose primitive mismatch.** Identify aggregation, support, state, and specification risks.
3. **Construct the task model.** Make success conditions, target state, constraints, noise, assumptions, and evaluation criteria explicit.
4. **Construct the search space.** Include conventional, unconventional, conservative, aggressive, reversible, and delayed-decision options.
5. **Query the environment.** Inspect files, sources, tools, logs, tests, current state, and available evidence.
6. **Construct proving grounds.** Generate scenarios, counterfactuals, red-team cases, stakeholder views, and edge cases.
7. **Identify the remaining operational blocker.** Determine whether it is genuinely human-governed.
8. **Issue an MSHQ or instantiate a GEO.** Ask only for the variable needed to restore autonomy, with options and a safe default.
9. **Continue reversible work while waiting.** Prepare drafts, tests, matrices, and safer alternatives.
10. **Validate the response and resume autonomy.** Verify the answer, execute within its boundary, and check the result.
11. **Preserve reusable judgment.** Store durable conditions as GKOs and recurring escalation rules as GEOs.
12. **Revoke stale governance.** Update objects when policy, authority, state, tools, or preferences change.

Multi-turn collaboration is useful when each round produces a persistent object that changes the next task. "Try again" without new control objects is often repeated sampling.

## 6. What AI Should Advance and What It Should Not Decide

### AI should advance:

- task models and decision variables;
- broad option and search spaces;
- scenario and state matrices;
- dependency graphs and control spaces;
- evidence plans and validation checklists;
- reversible drafts, experiments, and preparations;
- minimal human questions.

### AI should not silently decide:

- the final value function;
- budget or risk tolerance;
- identity and taste;
- external commitments or irreversible actions;
- legal, financial, safety, employment, or privacy responsibility;
- whether fluent explanation counts as sufficient evidence;
- whether stale preferences apply to a new context.

## 7. Collaboration Objects

| Object | Purpose |
|---|---|
| Task model | makes success conditions, constraints, and hidden assumptions explicit |
| Option set | converts open-ended preference into bounded choice |
| Style axis | makes taste contrastive and inspectable |
| Scenario matrix | reveals state-dependent decisions |
| Failure-mode list | exposes how a plausible answer could fail |
| Validation checklist | separates generation from evidence |
| GKO | stores what the agent should know or obey |
| GEO | stores when the agent should ask, whom, and what next |
| MSHQ | expresses a GEO in a specific interaction |

### 7.1 Minimal Sufficient Human Query Template

```text
I can continue autonomously with ______.
The only blocking variable is ______.
Please choose or confirm: A ______ / B ______ / C ______.
This changes ______.
If you do not specify, I will ______ because it is the safest or most reversible path.
```

### 7.2 Option Construction Template

```text
Task:
Success condition:
A. Conservative / low-risk path:
B. Balanced path:
C. Aggressive / high-return path:
D. Low-cost experiment:
E. Delay-decision path:
Key tradeoff:
Smallest human-governed variable:
```

### 7.3 Validation Template

```text
Candidate claim:
Evidence type: fact / data / test / expert review / user feedback / simulation
Current evidence strength: weak / medium / strong
Unverified assumptions:
Cost if wrong:
Reversibility:
Minimum validation required:
Safe default without human input:
```

## 8. Scenario Examples

### 8.1 Strategy Memo

- **AI first:** build an option matrix, counterarguments, assumptions, risks, and low-cost validation paths.
- **Environment:** retrieve market, competitor, customer, policy, and internal evidence.
- **Human variable:** whether growth, margin, speed, reputation, or risk dominates.
- **MSHQ:** "Should this memo optimize for decision clarity, persuasion, risk exposure, or completeness? If unspecified, I will optimize for decision clarity."

### 8.2 Product Roadmap

- **AI first:** create a feature × user value × cost × reversibility × risk matrix.
- **Environment:** analyze usage, support tickets, experiments, and competitor behavior.
- **Human variable:** strategic priority, budget ceiling, release window, and brand boundary.
- **GEO:** when options mainly differ by cost, speed, and risk, ask the project owner to choose the dominant weight.

### 8.3 Code and Data Validation

- **AI first:** run tests, inspect dependencies, generate edge cases, and conduct leakage audits.
- **Environment:** inspect CI, runtime behavior, data contracts, and timestamps.
- **Human variable:** unavailable field semantics, production constraint, or acceptance criterion.
- **MSHQ:** "Please confirm whether every feature is available before prediction time. If unknown, I will assume leakage risk and add lagging."

### 8.4 External Communication

- **AI first:** prepare drafts, risks, and safer wording variants.
- **Environment:** inspect policy, relationship state, prior commitments, and contracts.
- **Human variable:** authorization to send, promise, disclose, or commit.
- **Default:** without confirmation, do not send; retain a draft.

## 9. Human Role: From Processor to Governor

As AI becomes the default information-processing core, human capability should move upward:

- **problem construction:** detect the wrong abstraction;
- **value design:** distinguish true value from proxies;
- **taste articulation:** express judgment through examples and contrasts;
- **budget governance:** define money, time, attention, organizational credit, and opportunity cost;
- **evidence judgment:** distinguish generated explanation from validated knowledge;
- **authorization:** define autonomous and approval-required actions;
- **environment design:** create feedback, experiments, and review mechanisms;
- **governance memory:** preserve recurring judgments as GKOs and GEOs.

## 10. Quality Metrics and Risk Boundaries

Useful collaboration metrics include:

- final task value;
- escalation precision and recall;
- minimality and cognitive load;
- autonomy regained;
- wrong-autonomy incidents;
- unnecessary escalations;
- answer-resolution rate;
- reuse and revocation quality of GKOs/GEOs.

Hard boundaries should default to escalation for external commitments, disclosure, deletion, payment, signing, publication, or other irreversible actions. High-error-cost domains require stronger verification. State uncertainty should produce conditional policies, not fabricated certainty.

## Conclusion

Governed collaboration moves beyond chat-based prompting. AI advances the searchable, structurable, simulatable, and verifiable parts of a task. Humans inject the smallest variables that require human value, authority, budget, taste, context, or responsibility. The system then preserves durable judgments and restores AI autonomy.

The shortest definition is:

> High-quality human-AI collaboration = autonomous AI progress + constructed search and validation environments + minimal human variable injection + governed memory + restored autonomy.
