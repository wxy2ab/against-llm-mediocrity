---
key: guidelines
lang: en
path: /guidelines
title: Agent Task Guidelines
navTitle: Guidelines
kicker: Route coding-agent work by authority, state, evidence, and completion
summary: A styled entry point to the project's executable operating guidelines for Codex and other coding agents. Select a task family, load the smallest sufficient guide set, and preserve explicit authority, verifier, and handoff boundaries.
order: 7.5
heroPoints:
  - Begin with task intake instead of defaulting every request to implementation.
  - Select one primary task guide and add only overlays that materially change the workflow.
  - Treat the existing Markdown guidelines as the canonical, prompt-ready source.
---

These guidelines turn the project's aggregation-mismatch and governed-agent findings into
repeatable operating procedures. They are not model-specific prompt tricks. Each guide
defines what the agent may change, which state is authoritative, what evidence must be
collected, which verifier decides completion, and when the task must stop or escalate.

:::takeaway
### The shortest safe route

Read the scenario router, classify the request, select one primary guide, and add only the
overlays that change authority, state transition, verification, or delivery. The documents
under `docs/guidelines/` remain the canonical prompt-ready versions.
:::

## Start Here

::::cards
### Scenario, Prompt, and Evidence Router

Use this first when you need to decide which guideline belongs in a Codex prompt. It maps
task signals to a primary guide, required overlays, theoretical basis, experimental basis,
and the claims that the evidence does not support.

[Open the English router](/docs/guidelines/guidelines.md)

### Guidelines Directory Index

Use the directory index when you want the compact catalogue, loading contract, composition
examples, shared handoff format, and planned extensions.

[Open the English index](/docs/guidelines/README.md)

### Five-Knob Foundation

Use the foundation when changing an agent architecture or evaluating whether a workflow
externalizes authoritative state, semantic plan, candidate, verifier, and commit. The
current foundation document is maintained in Chinese.

[Open the five-knob foundation](/docs/guidelines/agent-five-knob-operating-guidelines.zh-CN.md)
::::

## Choose a Primary Guide

::::cards
### Classify and Route a Request

**Use when:** the request is new, mixed, ambiguous, or could cross from read-only analysis
into mutation.

**Default authority:** read-only until the mutation boundary is established.

[Task Intake and Guideline Routing](/docs/guidelines/task-intake-and-guideline-routing.md)

### Understand an Unfamiliar Repository

**Use when:** ownership, entry points, dependencies, impact radius, or the authoritative
implementation is not yet known.

**Default authority:** read-only.

[Codebase Reconnaissance and Impact Analysis](/docs/guidelines/codebase-reconnaissance-and-impact-analysis.md)

### Explain Why Something Fails

**Use when:** the user asks for diagnosis, causal localization, or an evidence-backed
explanation without authorizing a fix.

**Default authority:** read-only unless implementation is explicitly requested.

[Failure Diagnosis and Root-Cause Localization](/docs/guidelines/failure-diagnosis-and-root-cause-localization.md)

### Repair a Bounded Defect

**Use when:** the defect is reproducible, the expected behavior is clear, and a bounded
patch can be checked by a relevant oracle.

**Default authority:** scoped mutation.

[Bounded Repair and Bug Fix](/docs/guidelines/bounded-repair-and-bug-fix.md)

### Deliver a Feature, Refactor, or Migration

**Use when:** work adds behavior, changes structure, or moves a schema, API, storage model,
or compatibility boundary.

**Default authority:** planned multi-file mutation with explicit rollout and verification.

[Feature, Refactor, and Migration Delivery](/docs/guidelines/feature-refactor-and-migration-delivery.md)

### Improve Another Agent

**Use when:** the target is an agent's prompt, tools, state model, planner, router,
verifier, recovery path, or commit protocol.

**Default authority:** layer-specific change gated by a frozen baseline and evaluation.

[Agent Diagnosis and Improvement](/docs/guidelines/agent-diagnosis-and-improvement.md)
::::

## The Operating Contract

::::cards
### Authority Before Action

Separate explanation, diagnosis, review, implementation, release, and external side
effects. A guide can narrow authorization; it cannot expand what the user authorized.

### Authoritative State Before Generation

Identify the repository, runtime, schema, trace, test, or external system that decides
truth. Do not let conversational memory silently replace inspectable state.

### Verifier Before Completion

Name the oracle before changing the system. A plausible diff, a passing unrelated test, or
a polished summary is not evidence that the requested outcome was achieved.

### Governed Commit and Handoff

Commit only verified state transitions. Report the outcome, scope, evidence, residual
risks, artifacts, and a next action only when one genuinely remains.
::::

## Compose Guides Without Loading Everything

| Request pattern | Recommended guide set |
|---|---|
| “Explain why this test flakes.” | Routing + Reconnaissance + Diagnosis |
| “Fix this deterministic parser failure.” | Routing + Reconnaissance + Bounded Repair |
| “Add an authenticated API endpoint.” | Routing + Reconnaissance + Feature/Refactor/Migration |
| “Move persisted schema v2 to v3.” | Routing + Reconnaissance + Feature/Refactor/Migration |
| “Review this PR; do not edit.” | Routing + Reconnaissance + Diagnosis in read-only mode |
| “Improve an agent that emits stale indexes.” | Routing + Reconnaissance + Agent Improvement + the relevant implementation guide |

The key rule is minimal sufficient composition: one primary guide, then only the overlays
that change how the task must be executed or judged.

## Prompt-Ready Loading Contract

```text
Read docs/guidelines/guidelines.md in full.
Classify this request with Task Intake and Guideline Routing.
Select one primary task guide and only necessary overlays.
Before acting, state the authority boundary, authoritative sources,
mutation scope, verifier, and stop conditions.
Follow the selected guides through their completion gates.
Do not claim completion when a required verifier did not pass.
```

When improving an agent, add:

```text
Read Agent Diagnosis and Improvement.
Freeze a baseline, localize the earliest causal failure layer,
and do not default to a prompt-only intervention.
```

## What Exists and What Comes Next

The current set covers intake, repository reconnaissance, diagnosis, bounded repair,
feature/refactor/migration delivery, and agent improvement. Planned extensions include
testing and completion adjudication, read-only review, experiments and data analysis,
documentation synchronization, Git and release work, external side effects, incident
recovery, multi-agent coordination, and performance/cost/reliability optimization.

The complete source documents remain available in the
[Guidelines directory](/docs/guidelines/README.md). This site page is a navigation and
reading layer; it does not replace those executable documents.
