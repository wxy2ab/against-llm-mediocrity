# Human-Assist Operational Mismatches

## A Directional Supplement to *Knowledge Governance for Large Language Model Systems*

**Status:** Working draft  
**Version:** 1.1  
**Companion practice framework:** [Governed Human-AI Collaboration](governed-human-ai-collaboration.md)  
**Main manuscript:** [Knowledge Governance for Large Language Model Systems](knowledge-governance-llm-systems-local-alignment.md)

## Abstract

The main *Knowledge Governance* manuscript explains task-value divergence through five primitive mismatches: aggregation, state, specification, support, and overfitting. This supplement introduces a collaboration-layer diagnosis for agentic systems: **Human-Assist Operational Mismatches**.

An operational mismatch occurs when an agent cannot reliably continue because a task-critical control variable is unavailable, uncertain, or outside its legitimate authority, and targeted human input can resolve the blocker. Operational mismatches do not expand the primitive mismatch taxonomy. They answer a different question: not why generation diverges from value, but where autonomous execution is blocked and what minimal human contribution restores progress.

The central objects are the **Minimal Sufficient Human Query (MSHQ)** and the **Governed Escalation Object (GEO)**. An MSHQ asks only for the missing human-governed variable. A GEO records when escalation is required, who should answer, what safe default applies, what work may continue, and how the rule expires or is revoked.

## 1. Scope and Core Claim

The purpose of human assistance is not to return the task to the human. It is to supply the smallest missing control variable that allows the agent to resume autonomous work.

Before escalating, an agent should try reasonable autonomous recovery:

1. inspect available context and governed knowledge;
2. query tools, files, logs, databases, or current sources;
3. test, simulate, retrieve, or construct counterexamples;
4. reparameterize the task or generate decision options;
5. identify whether the remaining blocker is genuinely human-governed.

Only then should it ask:

> What is the smallest human-answerable question whose answer restores reliable autonomy?

## 2. Relation to the Main Framework

| Layer | Question | Examples |
|---|---|---|
| Primitive mismatch | Why can generation diverge from task value? | aggregation, state, specification, support, overfitting |
| Operational blocker | What control variable prevents reliable continuation? | missing state, value choice, authority, evidence, resource |
| Escalation protocol | What should the agent ask, and what happens next? | MSHQ, GEO, safe default, answer validation, autonomy recovery |

Operational blockers often express primitive mismatches:

- hidden state may become a missing-observation blocker;
- specification mismatch may become a preference or acceptance-criterion blocker;
- aggregation mismatch may require confirmation of global constraints;
- support mismatch may require access to an expert, source, tool, or unusual option.
- fitting-boundary mismatch may require a human or external validator to test whether a local claim survives adjacent cases.

## 3. Definition and Escalation Gate

A **Human-Assist Operational Mismatch** exists when:

1. action ranking or admissibility depends materially on a missing control variable;
2. the agent cannot obtain or validate it autonomously at acceptable cost;
3. continuing without it creates material error, risk, waste, or illegitimate action;
4. a targeted human or human-governed system can resolve it.

Escalation should pass one of two gates:

### 3.1 Hard Governance Gate

Escalation is mandatory when the next step requires human-governed authority or crosses a hard boundary:

- sending, publishing, deleting, paying, signing, or making an external commitment;
- revealing sensitive information;
- accepting legal, financial, safety, employment, or reputational responsibility;
- overriding an explicit policy or approval boundary.

### 3.2 Expected-Loss Gate

For non-mandatory cases, escalate when the expected cost of unsupported autonomy exceeds the cost of interruption:

\[
\operatorname{Escalate}
\quad \text{if} \quad
P(\text{material error}) \times C(\text{error})
>
C(\text{interruption}) + C(\text{delay}).
\]

Reversibility, evidence quality, and available autonomous recovery should influence both sides.

## 4. Five Operational Domains

The earlier broad list of operational mismatches is consolidated into five action-oriented domains. More specific labels remain useful as subtypes, not as peer-level primitive categories.

### 4.1 Information and Evidence

The agent lacks a fact, current state, reliable evidence, validator, or fresh context.

Common subtypes:

- **observability:** a task-critical real-world state is unavailable;
- **verification:** a candidate exists but cannot be validated;
- **freshness:** stored context may be stale;
- **resource access:** a required file, tool, runtime, API, or permission is unavailable.

Example MSHQ:

> I can continue after one fact is confirmed: is this field available before prediction time? If it is unknown, I will treat it as a leakage risk and use a lagged version.

### 4.2 Value and Specification

Several actions are feasible, but their ranking depends on human-governed objectives or acceptance standards.

Common subtypes:

- preference or utility weight;
- taste and identity;
- budget and risk tolerance;
- stopping or sufficiency criterion;
- stakeholder priority.

Example MSHQ:

> These plans mainly trade speed against operational risk. Which should dominate? If unspecified, I will choose the lowest-risk reversible plan.

### 4.3 Authority and Responsibility

The agent may know what to do but lacks legitimate authority to do it or cannot determine who owns the consequence.

Common subtypes:

- authorization or delegation;
- accountability and risk ownership;
- privacy and disclosure permission;
- external commitment.

Example MSHQ:

> This message makes a delivery commitment. Do you authorize sending this exact wording? Without approval, I will keep it as a draft.

### 4.4 Boundary and Timing

The agent does not know when a rule applies, when it should be revoked, or whether to explore, draft, wait, commit, or execute.

Common subtypes:

- rule applicability and revocation;
- temporal urgency;
- commitment level;
- reversible versus irreversible progress.

Example MSHQ:

> This rule is appropriate for normal refund cases. Should it still apply when fraud or account takeover is suspected?

### 4.5 Coordination and Control Representation

The current task representation, decomposition, workflow, or human handoff may omit a decisive dependency.

Common subtypes:

- representation or decomposition;
- workflow ownership;
- handoff interface;
- conflicting principals.

These blockers should usually be addressed autonomously first by building a task model, dependency graph, option set, or workflow. Human escalation is appropriate only when the controlling representation or organizational process cannot be inferred or verified.

Example MSHQ:

> I modeled this as a decision memo organized by cost, speed, and risk. Is there another governing dimension or required approval step that changes the decision?

## 5. Minimal Sufficient Human Query

A good MSHQ is:

1. **specific:** names the blocking variable;
2. **decision-shaped:** asks for a fact, value choice, authorization, boundary, or evidence;
3. **low-load:** offers concise options when possible;
4. **consequence-aware:** explains what the answer changes;
5. **defaulted:** states the safe action if no answer arrives;
6. **non-delegating:** does not ask the human to redo the task;
7. **routable:** identifies the appropriate human role.

Bad:

> What should I do?

Better:

> The only blocking decision is whether speed or operational risk should dominate. I recommend lowest risk because the action is difficult to reverse.

## 6. Governed Escalation Object

A GEO stores a reusable escalation rule.

```json
{
  "id": "geo-uuid",
  "domain": "information | value | authority | boundary | coordination",
  "subtype": "authorization",
  "condition": "predicate that triggers escalation",
  "autonomous_recovery_attempted": ["context", "tools", "tests", "reparameterization"],
  "minimal_question": "smallest human-answerable question",
  "options": ["A", "B", "C"],
  "recommended_option": "B",
  "default_if_no_response": "safe fallback or pause",
  "mandatory_gate": true,
  "error_cost": "low | medium | high",
  "reversibility": "reversible | costly-to-reverse | irreversible",
  "human_role": "user | expert | approver | operator | reviewer | risk owner",
  "evidence_needed": "fact | preference | authorization | validation | boundary",
  "autonomous_work_allowed": "safe work while waiting",
  "answer_validation": "how to check that the response resolves the blocker",
  "lifespan": "one-shot | session | project | until revoked",
  "revocation_trigger": "when this escalation rule expires",
  "source": "policy, failure, user instruction, validator, or prior escalation"
}
```

`error_cost` and `reversibility` are separate fields. An irreversible action is not merely another severity level.

## 7. Human-Assist Governance Loop

```text
1. Diagnose the primitive mismatch and current operational blocker.
2. Attempt bounded autonomous recovery:
   inspect → retrieve → test → simulate → reparameterize.
3. Apply hard governance gates.
4. If no hard gate applies, compare expected unsupported-autonomy loss
   with interruption and delay cost.
5. Construct an MSHQ and instantiate or update a GEO.
6. Continue safe reversible work while waiting.
7. Validate the human answer:
   sufficient? authorized? internally consistent? current?
8. If ambiguous, ask one narrower follow-up or route to the correct role.
9. Resume autonomous work under the resolved variable.
10. Verify the resulting action or artifact.
11. Store durable answers as GKOs; retain recurring escalation rules as GEOs.
12. Revoke stale GKOs and GEOs when state, policy, authority, or tools change.
```

If no answer arrives:

- never cross a mandatory authority, privacy, or irreversible-action gate;
- use an explicit safe default only when it is genuinely safe;
- continue reversible preparatory work;
- record the unresolved blocker rather than silently guessing.

## 8. GKO and GEO Integration

| Object | Governs | Primary question |
|---|---|---|
| GKO | knowledge, constraints, conditions, diagnostics | What should the agent know or obey? |
| GEO | escalation, missing variables, authority, handoff | When should the agent ask, whom, and what next? |

A human answer to a GEO may become a GKO:

> For this client, never promise refunds directly; escalate to the account owner.

A GKO may trigger a GEO:

> Any external commitment requires explicit approval before sending.

## 9. Evaluation

A human-assist system should be evaluated on both task outcomes and collaboration quality:

- **escalation precision:** escalations correspond to real blockers;
- **escalation recall:** human-required blockers are not missed;
- **minimality:** the query isolates the missing variable;
- **cognitive load:** answering requires little unnecessary effort;
- **autonomy regained:** the agent resumes useful work after the answer;
- **wrong-autonomy incidents:** the agent acts when it should escalate;
- **unnecessary escalation incidents:** the agent asks when tools or context suffice;
- **answer-resolution rate:** the response actually resolves the blocker;
- **GEO reuse and revocation quality:** recurring rules help without becoming stale.

## 10. Limitations and Research Agenda

This taxonomy is directional, not ontologically exhaustive. Operational labels should be retained only when they improve routing, question construction, or safe action.

Important open questions include:

- calibrating escalation thresholds under different risk and interruption costs;
- detecting when a human answer is wrong, stale, unauthorized, or incomplete;
- resolving conflicts among multiple principals;
- preventing over-escalation and learned helplessness;
- protecting sensitive information collected during escalation;
- measuring whether MSHQ/GEO protocols improve task value under matched budgets.

## Conclusion

Human assistance is most valuable when it injects a small number of control variables that an agent cannot reliably observe, infer, validate, or authorize. The agent should first exhaust reasonable autonomous recovery, then ask a minimal, structured question, respect hard governance boundaries, validate the response, and resume autonomy.

Reliable delegation is not full automation and not constant supervision. It is governed movement between autonomous work and precise human intervention.
