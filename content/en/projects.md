---
key: projects
lang: en
path: /projects
title: Open-Source Projects
navTitle: Projects
kicker: Implementing GKO principles
summary: "Future projects will turn Knowledge Governance into reusable tools: GKO stores, validation loops, escalation protocols, task-control workbenches, and domain-specific governance templates."
order: 8
heroPoints:
  - "GKO lifecycle tooling: create, validate, prioritize, weaken, revoke."
  - Human escalation protocols based on Minimal Sufficient Human Queries.
  - Benchmarks for detecting when output-space search plateaus.
---

## Planned Project Types

These are implementation directions derived from the current manuscripts. They are not additional theoretical claims; they are ways to test whether governed knowledge, escalation protocols, and mismatch diagnostics can become useful software objects.

The project page picks up the empirical question from the manuscripts: if Knowledge Governance is more than an explanatory framework, it must become software objects that can be stored, inspected, weakened, and revoked. These projects do not aim to build a monolithic agent first. They isolate the smallest testable components.

::::cards
### GKO Registry

A local or server-backed store for people, teams, or agents that handle recurring task families. Inputs are extracted judgment rules, constraints, failure modes, validation evidence, and revocation conditions. Outputs are searchable, rankable, weakenable, revocable Governed Knowledge Objects.

Core fields include applicability conditions, assertion, evidence strength, priority, lifespan, conflicts, dependencies, and revocation rules. The success criterion is not remembering more. It is reducing repeated failures while avoiding over-generalized stale experience.

### Escalation Workbench

A workflow surface for agents that should keep moving without taking unauthorized action. Inputs are task state, blocker variable, risk level, and reversible work. Outputs are Minimal Sufficient Human Queries (MSHQs) or Governed Escalation Objects (GEOs).

Core fields include trigger condition, question template, options, safe default, human role, autonomous work allowed while waiting, answer validation, and revocation trigger. The success criterion is fewer useless interruptions while preserving hard boundaries around authorization, privacy, finance, law, reputation, and deployment.

### Mismatch Diagnostics

A workflow for developers and high-value knowledge workers choosing an inference strategy. Inputs are task description, candidate outputs, failure history, available tools, and validation conditions. Outputs are mismatch profiles: which of aggregation, support, state, and specification dominates, and whether to generate directly, construct a control space, retrieve evidence, run validation, or escalate to a human.

Core objects include diagnostic questions, mismatch evidence, recommended intervention, validation plan, and rollback condition. The success criterion is detecting output-space plateaus earlier and replacing "try another version" with a more specific next action.
::::

## Evaluation Questions

- Does the tool reduce repeated output-space sampling on high-mismatch tasks?
- Do stored GKOs improve later outputs without becoming stale or over-general?
- Do GEOs reduce unnecessary interruptions while preserving hard governance boundaries?
- Can users see why the system asked a human, used a tool, or revoked a rule?
- Do mismatch diagnostics predict which intervention works, rather than merely explaining failure after the fact?
