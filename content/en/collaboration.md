---
key: collaboration
lang: en
path: /collaboration
title: "Human-AI Collaboration: Govern the Missing Variable"
navTitle: Collaboration
kicker: From chat-style use to governed collaboration
summary: "The best collaboration is not a mechanical split between what AI does and what humans do. It is variable governance: let AI process, search, simulate, and verify, while humans set values, supply preferences, authorize risk, and own responsibility."
order: 4
heroPoints:
  - AI should move the task forward until a human-governed variable blocks reliable continuation.
  - The human should answer the minimal sufficient question, not take the whole task back.
  - Reusable judgments should become governed knowledge or escalation objects.
---

## Collaboration Is Variable Governance

The usual question is: which work should AI do, and which work should humans do? That is too coarse. The better unit is the **control variable**.

AI is strong at processing, searching, structuring, simulating, retrieving, and validating. Humans remain essential for value functions, preference weights, authorization boundaries, taste, budget, identity, and responsibility.

Good collaboration is neither front-loading a long questionnaire nor letting the agent act without boundaries. It looks like:

```text
AI: Process → Search → Structure → Simulate → Verify
Human: Govern → Set values → Authorize → Judge taste → Own responsibility
System: turn reusable judgments into GKOs / GEOs
```

In one sentence: AI should move the task to the point where only human-governed variables remain; humans should resolve variables that cannot be reliably obtained from environment, feedback, tools, or simulation.

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

## GEO: Governing When to Ask

GKOs govern what the AI should know or obey. GEOs govern when the AI should ask a human, what it should ask, whom it should ask, and what to do safely if no answer arrives.

A GEO should specify:

- Trigger condition: when must the agent escalate?
- Minimal question: what exact variable is needed?
- Options and default: what happens if no one answers?
- Risk level: what goes wrong if the agent guesses?
- Human role: user, expert, approver, data owner, reviewer, or risk owner?
- Autonomous work while waiting: what drafts, tests, or analysis can continue?
- Revocation trigger: when does this escalation rule stop applying?

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

That is the move from chat-style use to governed collaboration: AI handles processing, search, and expression; humans govern the variables that probability alone cannot replace.
