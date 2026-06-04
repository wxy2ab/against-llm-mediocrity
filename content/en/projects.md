---
key: projects
lang: en
path: /projects
title: Open-Source Projects
navTitle: Projects
kicker: Implementing GKO principles
summary: "Future projects will turn Knowledge Governance into reusable tools: GKO stores, validation loops, escalation protocols, task-control workbenches, and domain-specific governance templates."
order: 7
heroPoints:
  - "GKO lifecycle tooling: create, validate, prioritize, weaken, revoke."
  - Human escalation protocols based on Minimal Sufficient Human Queries.
  - Benchmarks for detecting when output-space search plateaus.
---

## Planned Project Types

These are implementation directions derived from the current manuscripts. They are not additional theoretical claims; they are ways to test whether governed knowledge, escalation protocols, and mismatch diagnostics can become useful software objects.

::::cards
### GKO Registry

A local or server-backed store for governed knowledge objects with conditions, assertions, evidence strength, priority, lifespan, conflict handling, and revocation rules.

### Escalation Workbench

A tool that turns operational blockers into Minimal Sufficient Human Queries, including options, safe defaults, human role, autonomous work allowed while waiting, and revocation triggers.

### Mismatch Diagnostics

A workflow that classifies tasks by aggregation, support, state, and specification mismatch before choosing direct generation, control-space construction, validation, retrieval, or human escalation.
::::

## Evaluation Questions

- Does the tool reduce repeated output-space sampling on high-mismatch tasks?
- Do stored GKOs improve later outputs without becoming stale or over-general?
- Do GEOs reduce unnecessary interruptions while preserving hard governance boundaries?
- Can users see why the system asked a human, used a tool, or revoked a rule?
