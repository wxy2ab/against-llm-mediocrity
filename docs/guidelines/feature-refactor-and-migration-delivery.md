# Feature, Refactor, and Migration Delivery

Status: first-wave operating guideline

Primary mode: planned multi-file mutation

Use with: [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)

Chinese: [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md)

## 1. Choose the Correct Delivery Contract

These tasks may touch the same files but have different success conditions.

| Mode | Intended change | Primary invariant |
|---|---|---|
| Feature | Add or alter externally meaningful behavior | New acceptance criteria hold |
| Refactor | Change structure without intended behavior change | Behavioral equivalence |
| Migration | Move state or interfaces across versions | Compatibility and recoverability |

Do not describe a behavior change as a refactor. Do not implement a migration as a
one-shot rewrite when old state, clients, or rollback still matter.

## 2. Entry Artifacts

Before implementation, establish:

```text
requested outcome and non-goals
current architecture and authoritative state
affected actors, interfaces, and data
acceptance criteria
protected invariants
dependency order
delivery mode
verification matrix
rollback or compatibility plan
```

Persist the plan when work spans modules, agents, sessions, schemas, or deployment
stages.

## 3. Feature Path

### 3.1 Turn the Request into Behavior

Define:

- actor and permission;
- trigger/input;
- expected output or state transition;
- negative and edge behavior;
- observability;
- failure semantics;
- compatibility with existing behavior;
- explicitly excluded behavior.

Prefer examples and executable acceptance cases over adjectives such as “robust,”
“smart,” or “seamless.”

### 3.2 Choose Ownership

Place responsibility in the layer that owns the invariant:

```text
model: interpretation, proposal, uncertain semantic work
runtime: state, ordering, identity, policy, retries
compiler/executor: deterministic transformation and side effects
verifier: acceptance boundary
event store: audit and recovery evidence
```

Do not compensate for a runtime ownership problem by adding prompt prose.

### 3.3 Implement a Vertical Slice

Prefer a thin end-to-end slice that proves the contract:

```text
interface/schema
→ domain behavior
→ persistence/tool integration
→ verifier
→ user-facing path
```

Then extend variants. Avoid building disconnected layers that cannot be exercised until
the end.

## 4. Refactor Path

### 4.1 Freeze Observable Behavior

Identify behavior that must remain equivalent:

- public API and serialization;
- errors and permission decisions;
- ordering where semantically meaningful;
- persistence and side effects;
- performance budgets when part of the contract;
- extension and plugin points.

Create characterization tests where the contract is implicit.

### 4.2 Separate Structural and Behavioral Diffs

If behavior must change, use two stages when practical:

```text
behavior-preserving refactor
→ verify equivalence
→ explicit feature/bug change
→ verify new behavior
```

This makes failures attributable and rollback safer.

### 4.3 Preserve Intermediate Validity

Use adapters, temporary compatibility layers, stable semantic IDs, and staged movement
when a big-bang move would break callers. Remove transitional code only after all
consumers have moved and the removal verifier passes.

## 5. Migration Path

### 5.1 Define the State Machine

At minimum:

```text
old-only
→ dual-read or compatibility
→ backfill/transform
→ new-write or dual-write
→ verification
→ cutover
→ old-path retirement
```

Not every migration requires every phase, but omitted phases must be justified.

### 5.2 Migration Invariants

Specify:

- source and target schema/version;
- identity mapping;
- transformation semantics;
- idempotency and replay behavior;
- partial failure behavior;
- backward/forward compatibility window;
- rollback boundary;
- data-loss and duplication checks;
- cutover and retirement criteria.

The migration tool must be resumable or explicitly atomic. A timeout must not leave an
unclassified intermediate state.

### 5.3 Expand-Verify-Contract

Prefer:

```text
expand new capability without breaking old users
→ migrate and verify
→ switch authority
→ observe
→ contract/remove old capability
```

Do not remove the old path in the same unverified transition that introduces the new
path when independent rollout is possible.

## 6. Plan and Dependency Graph

Represent work as semantic operations with dependencies:

```json
{
  "operation_id": "stable-id",
  "target": "semantic-component",
  "intent": "add|move|adapt|remove",
  "preconditions": ["..."],
  "dependencies": ["..."],
  "acceptance": ["..."],
  "rollback": "..."
}
```

The runtime or plan should own readiness. File order is not dependency order.

Define checkpoints at points where:

- the repository builds;
- old behavior remains usable;
- a migration phase is complete;
- rollback remains simple;
- a verifier can make an independent judgment.

## 7. Verification Matrix

| Claim | Minimum evidence |
|---|---|
| Feature works | Positive acceptance case |
| Invalid use is rejected | Negative/permission case |
| Existing behavior survives | Regression/compatibility suite |
| Refactor is equivalent | Characterization plus existing tests |
| Migration preserves data | Counts, hashes, invariants, samples, reconciliation |
| Migration is replay-safe | Idempotency or crash/restart test |
| Rollback works | Tested rollback or rehearsed restoration |
| Performance is acceptable | Baseline-relative measurement |
| Agent behavior improves | Frozen paired evaluation and failure-layer telemetry |

Schema validity or build success alone is not sufficient for semantic completion.

## 8. Change Management

During delivery:

- preserve unrelated dirty changes;
- keep generated files synchronized through their generator;
- update docs when contracts or operator behavior change;
- add feature flags for uncertain or staged adoption;
- record deprecation and removal criteria;
- avoid speculative cleanup;
- keep public and internal contracts distinct;
- make irreversible steps explicit.

For a large change, prefer multiple coherent commits or checkpoints over one opaque diff.

## 9. Failure Routing

| Failure | Response |
|---|---|
| Acceptance case is ambiguous | Return to specification |
| Ownership is unclear | Return to reconnaissance/design |
| Plan cannot preserve an invariant | Change architecture or migration phase |
| Implementation passes locally but breaks consumers | Repair compatibility boundary |
| Migration reconciliation fails | Stop cutover, preserve evidence, rollback/reconcile |
| Refactor changes behavior unexpectedly | Split or revert structural stage |
| Cost/latency exceeds budget | Profile and route to optimization |
| Agent evaluation improves only on training cases | Expand frozen holdout and inspect fitting boundary |

Do not use retry to resolve a specification or architecture failure.

## 10. Completion Gates

### Feature

```text
[ ] acceptance and negative cases pass
[ ] existing compatible behavior passes
[ ] state, permissions, errors, and observability are defined
[ ] docs/config/generated artifacts are synchronized
```

### Refactor

```text
[ ] protected behavior is characterized
[ ] equivalence suite passes
[ ] no unintended public contract changed
[ ] obsolete path removal is verified
```

### Migration

```text
[ ] migration phases and authority transitions are recorded
[ ] reconciliation passes
[ ] replay/partial failure behavior is verified
[ ] cutover and rollback criteria pass
[ ] old path is removed only after retirement gate
```

All modes also require diff/collateral audit and explicit unrun checks.

## 11. Handoff

```text
Mode:
Outcome:
Architecture/ownership decision:
Implementation and migration phases:
Verification matrix and results:
Compatibility/rollback:
Files and checkpoints:
Residual risks:
Delivery state:
```
