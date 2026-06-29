---
key: collaboration
lang: en
path: /collaboration
title: "Human-AI Collaboration: Govern the Missing Variable"
navTitle: Collaboration
kicker: From chat-style use to governed collaboration
summary: "The best collaboration is not a mechanical split between what AI does and what humans do. It is variable governance: let AI process, search, simulate, and verify, while humans set values, supply preferences, authorize risk, and own responsibility."
order: 5
heroPoints:
  - AI should move the task forward until a human-governed variable blocks reliable continuation.
  - The human should answer the minimal sufficient question, not take the whole task back.
  - Reusable judgments should become governed knowledge or escalation objects.
---

## Collaboration Is Variable Governance

The usual question is: which work should AI do, and which work should humans do? That is too coarse. The better unit is the **control variable**.

AI should advance the parts that can be processed, searched, structured, simulated, retrieved, and validated. Humans should govern value functions, preference weights, authorization boundaries, taste, budget, identity, and responsibility.

Good collaboration is neither front-loading a long questionnaire nor letting the agent act without boundaries. It looks like:

```text
AI: Process → Search → Structure → Simulate → Verify
Human: Govern → Set values → Authorize → Judge taste → Own responsibility
System: turn reusable judgments into GKOs / GEOs and hard-state transitions
```

**In one sentence: AI should move the task to the point where only human-governed variables remain; humans should resolve variables that cannot be reliably obtained from environment, feedback, tools, or simulation; the system should commit the resolved variable into hard state rather than leave it as chat history.**

This page picks up the last step of the governance page. Control spaces and validation loops solve many structural problems, but value, authorization, responsibility, taste, and real-world state can still block autonomy. The collaboration question is not how to involve humans more. It is how to make human input small, precise, and sufficient for AI to resume autonomous progress.

## Three-Layer Diagnostic Stack

Governed collaboration sits on top of the mechanism layer. It does not add new primitive mismatches; it asks where autonomous execution is blocked.

::::cards
### Primitive Mismatch

Why might ordinary generation diverge from value? The main axes are aggregation, support, state, specification, fitting-boundary, and observation-representation.

### Operational Blocker

Which missing control variable prevents reliable continuation? The blocker may be a fact, value weight, authority boundary, validation signal, resource, or representation choice.

### Escalation Protocol

What is the smallest human contribution that restores autonomy? This is where Minimal Sufficient Human Queries (MSHQs) and Governed Escalation Objects (GEOs) belong.
::::

## First Ask Where the Variable Comes From

Not every uncertainty should be escalated to a human. The agent should first ask whether the missing variable can be obtained from the environment, learned through feedback, or stress-tested through a constructed scenario.

:::cards
### Environment-Observable
Tag: ask the environment first

If the variable lives in files, logs, databases, tests, webpages, policies, runtime behavior, or current state, the agent should read, retrieve, run, verify, and cross-check before asking the human what the fact is.

### Feedback-Learnable
Tag: reveal preference through contrast

Some preferences cannot be fully stated in advance. The agent should generate options, style axes, positive and negative examples, and pairwise comparisons so the human can choose, reject, and rank.

### Scenario-Constructible
Tag: build a proving ground

When direct reality feedback is unavailable, the agent can simulate competitors, regulators, impatient users, critics, attackers, failure worlds, or market states to expose fragile assumptions.

### Human-Controlled
Tag: only then ask the human

When the variable cannot be observed, inferred, validated, or legitimately authorized by AI, the agent should ask the human for a fact, weight, boundary, authorization, validation signal, resource, risk owner, or stopping criterion.
:::

Before asking, the agent should attempt bounded autonomous recovery: inspect context, query tools and files, run tests, retrieve current sources, simulate scenarios, generate options, and reparameterize the task. Escalation is justified only when the remaining variable is both task-critical and genuinely human-governed.

## Five Operational Domains

The collaboration supplement consolidates execution blockers into five domains:

::::cards
### Information and Evidence

The agent lacks a fact, fresh state, validator, source, runtime result, file, permission, or reliable evidence.

### Value and Specification

Several actions are feasible, but their ranking depends on objectives, taste, budget, risk tolerance, sufficiency criteria, or stakeholder priority.

### Authority and Responsibility

The agent may know what to do but lacks legitimate authority to send, publish, delete, pay, sign, disclose, deploy, or accept consequence.

### Boundary and Timing

The agent does not know when a rule applies, when it expires, whether to wait, whether to commit, or whether progress is still reversible.

### Coordination and Control Representation

The current decomposition, workflow, handoff, or task model may omit a decisive dependency or responsible role.
::::

## Escalation Gates

Some cases require escalation even if the agent is confident. These are hard governance gates: external commitments, sensitive disclosure, deletion, payment, signing, publication, deployment, policy overrides, or legal, financial, safety, employment, privacy, or reputational responsibility.

For non-mandatory cases, escalation should depend on expected loss: if the expected cost of unsupported autonomy exceeds the cost of interruption and delay, the agent should ask. Reversibility matters. A reversible draft can continue; an irreversible commitment should pause.

## Minimal Sufficient Human Query

A good agent should not ask:

```text
What should I do?
```

It should ask:

```text
What is the smallest human-answerable question whose answer restores autonomous progress?
```

A good Minimal Sufficient Human Query has five properties:

- It names the blocking variable.
- It offers a small set of options when possible.
- It explains what each answer changes.
- It states a safe default.
- It does not hand the entire task back to the human.

A reusable template is:

```text
I can continue autonomously with ______.
The only blocking variable is ______.
Please choose or confirm: A ______ / B ______ / C ______.
This changes ______.
If you do not specify, I will ______ because it is the safest or most reversible path.
```

:::cards
### Fact or State

"Please confirm one fact: is the customer still inside the refund window? If yes, I will prepare refund options; if no, I will prepare an escalation explanation."

### Preference Weight

"These three plans mainly trade off speed, cost, and risk. Which objective should dominate? If you do not specify, I will default to lowest risk."

### Authorization

"I can send this email, but it includes a delivery-date commitment. Do you authorize sending this exact wording? Options: send, revise first, do not send."

### Validation Signal

"The main unresolved risk is temporal leakage. Please confirm that all features are available before prediction time, or provide an example or test result."
:::

## Governed Escalation Objects: Governing When to Ask

Governed Knowledge Objects (GKOs) govern what the AI should know or obey. GEOs govern when the AI should ask a human, what it should ask, whom it should ask, and what to do safely if no answer arrives.

A GEO should specify:

- Trigger condition: when must the agent escalate?
- Minimal question: what exact variable is needed?
- Options and default: what happens if no one answers?
- Risk level: what goes wrong if the agent guesses?
- Human role: user, expert, approver, data owner, reviewer, or risk owner?
- Autonomous work while waiting: what drafts, tests, or analysis can continue?
- Revocation trigger: when does this escalation rule stop applying?

If a human answer becomes durable, it may become a GKO. For example: "Any external commitment for this client requires explicit approval before sending." Conversely, a GKO may trigger a GEO when a condition appears in a future task.

For long-horizon agents, the answer should also update the agent's hard state: which fact was confirmed, which boundary now applies, which authorization was granted or denied, and which transition is now allowed. This is the collaboration-side link to State-Governed Agent Regime (SGAR).

## Collaboration Workflow

1. Route low-mismatch work directly.
2. Diagnose the primitive mismatch and current operational blocker.
3. Construct a task model and option space.
4. Query the environment and available tools.
5. Build proving grounds: scenarios, counterfactuals, stakeholder views, red-team cases, and edge cases.
6. Identify the remaining human-governed variable.
7. Issue an MSHQ or instantiate a GEO.
8. Continue safe reversible work while waiting.
9. Validate the answer, resume autonomous work, and verify the result.
10. Commit resolved variables into hard state.
11. Preserve reusable judgment as GKOs or GEOs, and revoke stale ones when conditions change.

## What Humans Should Govern

:::cards
### Values and Weights

Speed, quality, cost, risk, relationship, reputation, and long-term direction cannot all dominate. AI can model tradeoffs, but it should not choose the final value function.

### Taste and Identity

What counts as premium, restrained, sharp, credible, brave, or appropriate? These judgments carry identity and long-term narrative; they cannot be fully reduced to objective metrics.

### Authorization and Responsibility

External actions such as sending, publishing, promising, deleting, buying, signing, or deploying require explicit authorization. AI can prepare evidence and options, but it cannot own consequences.

### Boundaries and Stopping Criteria

When does a rule apply? When should it be revoked? Is the current output an internal draft, an external final, an executable plan, or something that still needs validation?
:::

## What Good Collaboration Measures

Good human-AI collaboration is not measured by minimizing all human involvement. It is measured by precise involvement:

- Does escalation correspond to a real blocker?
- Is the question minimal, specific, and answerable?
- After the human answers, can the AI resume autonomous work?
- Does the AI avoid unauthorized external actions?
- Are reusable judgments stored as GKOs or GEOs instead of disappearing into the chat?
- Can the agent recover the recognized state after interruption?

That is the move from chat-style use to governed collaboration: AI handles processing, search, and expression; humans govern the variables that probability alone cannot replace.
