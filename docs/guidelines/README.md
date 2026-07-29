# Agent Task Guidelines

This directory contains executable operating guidelines for coding agents such as Codex.
They are not model-specific prompt tricks. Each guide defines:

- the authority boundary of a task;
- the authoritative state and evidence to inspect;
- the state transitions the agent may perform;
- the verifier and completion boundary;
- failure routing, rollback, and escalation;
- the artifacts required for a reviewable handoff.

Chinese index: [README.zh-CN.md](./README.zh-CN.md)

## 1. Foundation

The current foundation is:

- [Chinese scenario, prompt, and evidence router](./guidelines.md)
- [Agent Five-Knob Operating Guidelines (Chinese)](./agent-five-knob-operating-guidelines.zh-CN.md)

It defines the common substrate: authoritative state, semantic plans, candidates,
verifiers, semantic IDs, deterministic compilation, Patch/Regional/Full routing,
failure-layer routing, governed commit, event ledgers, and cost gates.

The task guides below do not repeat that substrate. They specialize it for a concrete
class of work.

## 2. First-Wave Task Guides

| Primary task | English | 中文 | Default authority |
|---|---|---|---|
| Classify and route a request | [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md) | [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md) | Read-only until mutation scope is established |
| Understand an unfamiliar repository | [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md) | [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md) | Read-only |
| Explain why something fails | [Failure Diagnosis and Root-Cause Localization](./failure-diagnosis-and-root-cause-localization.md) | [故障诊断与根因定位](./failure-diagnosis-and-root-cause-localization.zh-CN.md) | Read-only unless a fix is requested |
| Repair a bounded defect | [Bounded Repair and Bug Fix](./bounded-repair-and-bug-fix.md) | [局部修复与 Bug Fix](./bounded-repair-and-bug-fix.zh-CN.md) | Scoped mutation |
| Add behavior or change structure | [Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md) | [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md) | Planned multi-file mutation |
| Improve another agent | [Agent Diagnosis and Improvement](./agent-diagnosis-and-improvement.md) | [Agent 诊断与改进](./agent-diagnosis-and-improvement.zh-CN.md) | Layer-specific, evaluation-gated mutation |

## 3. Routing Rule

Load one primary guide and only the overlays that materially change the workflow.

```text
Every task
  → Task Intake and Guideline Routing

Unfamiliar repository or uncertain impact
  → + Codebase Reconnaissance and Impact Analysis

"Why does this fail?" without an implementation request
  → Failure Diagnosis and Root-Cause Localization

Known, bounded defect with a reproducible oracle
  → Bounded Repair and Bug Fix

New behavior
  → Feature delivery path

Behavior-preserving structural change
  → Refactor path

Schema, storage, API, or staged compatibility change
  → Migration path

Prompt/tool/state/router/verifier/recovery change to an agent
  → Agent Diagnosis and Improvement
  → + the relevant implementation guide
```

Do not silently convert:

- an explanation request into a write;
- a diagnosis request into a fix;
- a review request into a refactor;
- a local bug into an architecture rewrite;
- an agent symptom into a prompt-only change.

## 4. Loading Contract for Codex

The directory index can be given to Codex with this instruction:

```text
Read docs/guidelines/README.md and the foundation it references.
Classify this request with Task Intake and Guideline Routing.
Load one primary task guide and only necessary overlays.
Before acting, state the authority boundary, authoritative sources,
mutation scope, verifier, and stop conditions.
Follow the selected guides through their completion gates.
Do not claim completion when a required verifier did not pass.
```

When the target task is to improve another agent, also require:

```text
Read Agent Diagnosis and Improvement.
Freeze a baseline, localize the earliest causal failure layer,
and do not default to a prompt-only intervention.
```

## 5. Composition Examples

| Request | Guides to load |
|---|---|
| “Explain why this test flakes.” | Routing + Reconnaissance + Diagnosis |
| “Fix this deterministic parser failure.” | Routing + Reconnaissance + Bounded Repair |
| “Add a new authenticated API endpoint.” | Routing + Reconnaissance + Feature/Refactor/Migration |
| “Move a persisted schema from v2 to v3.” | Routing + Reconnaissance + Feature/Refactor/Migration |
| “Review this PR; do not edit.” | Routing + Reconnaissance + Diagnosis in read-only mode |
| “Improve an agent that repeatedly emits stale indexes.” | Routing + Reconnaissance + Agent Improvement + Bounded Repair or Migration |

## 6. Common Handoff Contract

Every guide uses the same compact handoff:

```text
Outcome
Scope changed or inspected
Evidence and verifier results
Residual risks and unsupported claims
Files/artifacts
Next action, only when one remains
```

The final response must lead with the outcome. It must not claim completion when the
configured verifier did not run, failed, or does not cover the requested outcome.

## 7. Planned Extensions

The next guides should cover:

1. testing, verification, and completion adjudication;
2. read-only code review and audit;
3. experiments, evaluation, and data analysis;
4. documentation, specification, and knowledge synchronization;
5. Git, pull request, release, and branch cleanup;
6. external systems and side-effectful operations;
7. incident response and state recovery;
8. multi-agent orchestration and handoff;
9. performance, cost, and reliability optimization.
