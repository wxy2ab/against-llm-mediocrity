---
key: projects
lang: en
path: /projects
title: Open-Source Projects
navTitle: Projects
kicker: Implementing GKO principles
summary: "The first published project is sgar: an embedded coding agent that combines long-range code editing, automated repair, state governance, staged execution, audit verification, and persistent traces. Future projects will keep turning Knowledge Governance into reusable software objects."
order: 8
heroPoints:
  - "sgar: a state-governed coding agent for long-range code editing, automated repair, and governed operations."
  - Audit Engineering and State-Governed Agent Regime implemented as CLI, runtime, traces, and verification records.
  - Future tools will cover GKO lifecycle, escalation protocols, and task-control workbenches.
  - Benchmarks for detecting when output-space search plateaus.
---

This page tracks the software side of the work: tools that turn the manuscripts' ideas about Knowledge Governance into objects you can run, inspect, and revoke. One project is published today; the rest are planned implementation directions. Throughout, GKO stands for Governed Knowledge Object — a stored unit of judgment that can be searched, weakened, or revoked.

## Published Project

::::cards
### sgar
Tag: State-Governed Agent Regime

[sgar](https://github.com/wxy2ab/sgar) is an embedded coding agent for automated repair, automated operations, and long-range code editing inside other systems. It is also a standalone CLI, an embeddable agent runtime, and an OpenClaw long-range coding skill.

The project is not a one-shot "ask an LLM to write code" wrapper. It combines code editing, state governance, staged execution, audit verification, and persistent traces into a long-running agent model. Its design is grounded in [Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md) and the [State-Governed Agent Regime (SGAR)](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md). In practice, this means externalized hard state, action/delta progression, traces, verification records, and a `.sgar/` workspace. Together these reduce drift, skipped steps, and unsupported completion claims in long-horizon coding work.

Current entry points include `pip install sgar`, `sgar --help`, `sgar init`, `sgar status`, `sgar doctor`, `sgar trace`, plus governance commands such as `validate`, `verify`, and `mission`. The repository also includes [architecture](https://github.com/wxy2ab/sgar/blob/main/docs/architecture.en.md), [usage](https://github.com/wxy2ab/sgar/blob/main/docs/usage.en.md), [API](https://github.com/wxy2ab/sgar/blob/main/docs/api.en.md), and [integration](https://github.com/wxy2ab/sgar/blob/main/docs/integration.en.md) documentation.
::::

## Planned Project Types

The directions below are follow-on implementations derived from the current manuscripts. They are not additional theoretical claims; they are ways to test whether governed knowledge, hard-state transitions, escalation protocols, and mismatch diagnostics can become useful software objects.

Each one picks up the same empirical question the manuscripts raise: **if Knowledge Governance is more than an explanatory framework, it must become software objects that can be stored, inspected, weakened, and revoked.** `sgar` has already made hard state, staged progression, verification, and traces into runnable objects. Future projects continue the pattern, turning control spaces, layered routing, continuity audit, pairwise judgment, and plateau detection into observable governance processes. None aims to build a monolithic agent first; each isolates the smallest testable component.

::::cards
### GKO Registry

A local or server-backed store for people, teams, or agents that handle recurring task families. Inputs are extracted judgment rules, constraints, failure modes, validation evidence, and revocation conditions. Outputs are searchable, rankable, weakenable, revocable Governed Knowledge Objects.

Core fields include applicability conditions, assertion, evidence strength, priority, lifespan, conflicts, dependencies, and revocation rules. The success criterion is not remembering more. It is reducing repeated failures while avoiding over-generalized stale experience.

### Escalation Workbench

A workflow surface for agents that should keep moving without taking unauthorized action. Inputs are task state, blocker variable, risk level, and reversible work. Outputs are Minimal Sufficient Human Queries (MSHQs) or Governed Escalation Objects (GEOs).

Core fields include trigger condition, question template, options, safe default, human role, autonomous work allowed while waiting, answer validation, and revocation trigger. The success criterion is fewer useless interruptions while preserving hard boundaries around authorization, privacy, finance, law, reputation, and deployment.

### Hard-State Agent Ledger

A state substrate for long-horizon agents that should recover after interruption and avoid false completion. Inputs are current state, admissible actions, observations, verification results, human answers, audit findings, and rollback events. Outputs are committed or rejected state transitions.

Core fields include state id, preconditions, action, observation, verifier, transition rule, commit record, rollback rule, provenance, and revoked assumptions. The success criterion is lower state drift, fewer unsupported completion claims, and better replayability across sessions or agents.

### Mismatch Diagnostics

A workflow for developers and high-value knowledge workers choosing an inference strategy. Inputs are task description, candidate outputs, failure history, available tools, and validation conditions. Outputs are mismatch profiles: which of aggregation, support, state, specification, fitting-boundary, and observation-representation dominates, and whether to generate directly, construct a control space, retrieve evidence, add measurement, run validation, or escalate to a human.

Core objects include diagnostic questions, mismatch evidence, recommended intervention, validation plan, and rollback condition. The success criterion is detecting output-space plateaus earlier and replacing "try another version" with a more specific next action.
::::

## Evaluation Questions

- Does the tool reduce repeated output-space sampling on high-mismatch tasks?
- Do stored GKOs improve later outputs without becoming stale or over-general?
- Do GEOs reduce unnecessary interruptions while preserving hard governance boundaries?
- Can users see why the system asked a human, used a tool, or revoked a rule?
- Do mismatch diagnostics predict which intervention works, rather than merely explaining failure after the fact?
