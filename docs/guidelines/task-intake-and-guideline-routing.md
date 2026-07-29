# Task Intake and Guideline Routing

Status: first-wave operating guideline

Audience: coding agents, agent runtimes, and operators

Foundation: [Agent Five-Knob Operating Guidelines](./agent-five-knob-operating-guidelines.zh-CN.md)

Chinese: [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)

## 1. Purpose

Use this guide at the beginning of every task. Its purpose is to prevent an agent from
solving the wrong task well.

The intake result must establish:

```text
requested outcome
task class
authority boundary
authoritative sources
mutation scope
verification boundary
delivery boundary
stop/escalation conditions
```

Intake is complete when the agent can state what it may inspect, what it may change,
and what evidence would justify saying the task is done.

## 2. Classify the Requested Outcome

Classify by the requested state transition, not by nouns in the request.

| Class | User-visible outcome | Default authority |
|---|---|---|
| Answer / explain | A supported explanation | Read-only |
| Inspect / report | A description of current state | Read-only |
| Diagnose | A localized cause and evidence | Read-only |
| Review / audit | Findings ranked by severity | Read-only |
| Change / repair | A bounded defect removed | Scoped write |
| Build / feature | New behavior implemented | Planned write |
| Refactor | Structure changed, behavior preserved | Planned write |
| Migrate | Old and new states moved through a compatibility plan | Governed write |
| Validate | A pass/fail/readiness judgment | Read-only unless test artifacts are requested |
| Operate | External or side-effectful state changed | Explicitly scoped authority |
| Deliver | Commit, PR, release, or publication | Explicit delivery authority |
| Monitor | State observed until a terminal condition | Read-only recurring authority |

When a request combines classes, preserve their order:

```text
inspect → diagnose → change → validate → deliver
```

Later stages do not erase the evidence required by earlier stages.

## 3. Establish the Authority Boundary

Before mutation, answer:

1. Which repositories, services, files, records, or external systems are in scope?
2. Is the request read-only, implementation-authorized, or delivery-authorized?
3. Are destructive, irreversible, public, financial, or interpersonal side effects involved?
4. Which existing user changes must be preserved?
5. What decision still belongs to the user?

Authority does not silently expand:

- “diagnose” does not authorize a fix;
- “fix” does not authorize a release;
- “prepare a PR” does not authorize merge unless requested;
- access to a system does not authorize every mutation in that system;
- urgency does not authorize destructive shortcuts.

Use a reasonable assumption only when it is reversible, local to the stated scope, and
does not materially change the requested outcome. State assumptions that affect the
design or result.

## 4. Identify Authoritative Sources

Prefer sources in this order:

```text
explicit user-provided artifact
→ repository-local instructions and current state
→ executable code, schema, tests, and generated manifests
→ connected first-party system
→ official external documentation
→ secondary explanation
→ model memory
```

Resolve conflicts by authority and recency, not by narrative confidence.

Record:

```json
{
  "task_id": "stable-id",
  "requested_outcome": "...",
  "task_class": ["diagnose", "change"],
  "scope": ["repo/path"],
  "non_goals": ["..."],
  "authority": {
    "read": ["..."],
    "write": ["..."],
    "deliver": []
  },
  "authoritative_sources": ["..."],
  "verifier": ["..."],
  "stop_conditions": ["..."]
}
```

This can remain implicit for a trivial task. Persist it for multi-file, long-running,
multi-agent, risky, or resumable work.

## 5. Select the Primary Guide

Use one primary guide:

```text
uncertain repository or impact
  → Codebase Reconnaissance and Impact Analysis

cause requested, no fix requested
  → Failure Diagnosis and Root-Cause Localization

bounded reproducible defect
  → Bounded Repair and Bug Fix

new behavior / structural change / compatibility transition
  → Feature, Refactor, and Migration Delivery

another agent is the object being improved
  → Agent Diagnosis and Improvement
```

Add an overlay only when it changes evidence, state transitions, or verification.
Do not load every guide “for completeness.”

## 6. Decide Whether Clarification Blocks Progress

Do not ask for information that can be discovered safely from the workspace or source
systems.

Continue with a stated assumption when:

- the choice is reversible;
- alternatives do not materially change the result;
- a conventional repository default exists;
- independent work can proceed while the answer is pending.

Stop and ask when:

- different answers create materially different products;
- authorization for an external or destructive action is missing;
- a value, policy, taste, or responsibility decision belongs to the user;
- the authoritative artifact cannot be identified;
- proceeding would overwrite or expose user data.

Ask for the minimal sufficient variable, not an open-ended restatement of the task.

## 7. Define Completion Before Acting

Translate “done” into observable predicates:

```text
requested behavior exists
AND relevant regression behavior remains valid
AND verifier coverage is appropriate
AND no unauthorized collateral change exists
AND required artifact is persisted
AND requested delivery action has completed
```

Distinguish:

| State | Meaning |
|---|---|
| Implemented | The change exists |
| Verified | Specified checks passed |
| Delivered | Requested commit/PR/release/publication completed |
| Blocked | A required external decision or authority is unavailable |
| Ungated | The artifact exists, but no adequate verifier was run |

Do not collapse these states.

## 8. Intake Failure Modes

| Failure | Correction |
|---|---|
| Acting on the latest noun instead of the requested outcome | Restate the state transition |
| Treating a diagnosis as permission to edit | Return evidence only |
| Asking broad questions before inspecting local evidence | Inspect first, ask for the unresolved variable |
| Loading a large workflow for a one-line reversible task | Use the lightweight path |
| Expanding a local fix into a cleanup campaign | Preserve non-goals and mutation scope |
| Claiming “done” after tool success | Evaluate the completion predicates |
| Hiding assumptions | Surface assumptions that affect design or interpretation |

## 9. Fast Intake Checklist

```text
[ ] What exact outcome did the user request?
[ ] Is this answer, diagnose, review, change, validate, operate, or deliver?
[ ] What may I read, write, and publish?
[ ] What existing changes or state must I preserve?
[ ] Which source is authoritative?
[ ] Which primary guide applies?
[ ] What verifier decides completion?
[ ] What would force me to stop or ask?
[ ] Can I proceed safely without clarification?
```

## 10. Handoff

At intake completion, either begin the routed guide or report a genuine blocker:

```text
Route:
Authority:
Scope / non-goals:
Authoritative sources:
Verifier:
Assumptions:
Blocking variable, if any:
```
