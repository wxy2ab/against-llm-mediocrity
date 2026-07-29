# Codebase Reconnaissance and Impact Analysis

Status: first-wave operating guideline

Primary mode: read-only

Use with: [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md)

Chinese: [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)

## 1. Outcome

Reconnaissance turns an unfamiliar repository into a bounded change model:

```text
request
→ authoritative entry points
→ execution and data flow
→ ownership boundaries
→ affected consumers and invariants
→ smallest safe mutation surface
→ verification map
```

The outcome is not “I read many files.” It is an evidence-backed impact map sufficient
to diagnose, plan, review, or implement the requested task.

## 2. When to Use

Use this guide when:

- the repository or subsystem is unfamiliar;
- a request names a symptom but not the owning component;
- a change may cross modules, schemas, generated files, or deployment boundaries;
- multiple implementations of the same concept exist;
- the worktree already contains user changes;
- a refactor, migration, or agent change could affect hidden consumers.

Use a lightweight path for a self-contained file with an obvious local verifier.

Reconnaissance is read-only. Do not “clean up while exploring.”

## 3. Establish Repository State

Record before analysis:

```text
repository root
current branch and upstream
working-tree status
relevant local instructions
build/test entry points
language and package boundaries
generated/vendor/cache directories
active configuration and environment assumptions
```

Inspect local instruction files completely before acting. Preserve dirty files unless
they are explicitly in scope. Distinguish:

- committed baseline;
- user-authored uncommitted changes;
- generated or ignored artifacts;
- changes introduced by the current task.

## 4. Search Strategy

Search from semantic anchors to physical files:

1. exact symbol, command, route, schema, error, or config key;
2. definitions and constructors;
3. callers and consumers;
4. tests, fixtures, examples, and docs;
5. serialization, persistence, API, and CLI boundaries;
6. parallel or legacy implementations;
7. generated outputs and publication surfaces.

Prefer repository-native search and metadata:

```text
file inventory
symbol/text search
dependency manifests
test discovery
version-control history when causally useful
runtime logs or schemas when available
```

Do not recursively read everything. Read enough context to determine contracts and
control flow, then follow only relevant edges.

## 5. Build Four Maps

### 5.1 Ownership Map

```text
user-facing behavior
→ entry point
→ orchestrator/runtime
→ domain implementation
→ persistence/external side effect
```

Identify which layer owns:

- interpretation of intent;
- validation;
- state;
- physical addressing;
- execution;
- commit and rollback.

### 5.2 Data and State Map

For each important object, record:

```text
producer
schema/type
authoritative storage
transformations
consumers
version/hash/revision
lifetime and cache behavior
```

Watch for duplicate state, stale snapshots, implicit defaults, lossy conversions, and
derived data presented as authoritative.

### 5.3 Dependency and Impact Map

Classify affected surfaces:

| Surface | Questions |
|---|---|
| Direct | Which files and symbols implement the requested behavior? |
| Callers | Who invokes them, and under which configurations? |
| Data | Which schemas, fixtures, caches, or migrations depend on them? |
| Interface | Which API, CLI, tool, prompt, or serialized contracts change? |
| Tests | Which tests prove behavior, and what is untested? |
| Operations | Which deployment, permission, release, or rollback paths are affected? |
| Documentation | Which instructions or examples become false? |

### 5.4 Verification Map

Map each claim to a verifier:

```text
syntax/import → compiler or import check
local behavior → focused unit test
cross-module behavior → integration test
schema compatibility → contract/migration test
user-facing flow → end-to-end or rendered inspection
performance claim → benchmark with baseline
agent claim → frozen evaluation set and event telemetry
```

An absent verifier is an impact finding, not permission to assume safety.

## 6. Find the Authoritative Implementation

When several paths look plausible, adjudicate using:

- actual callers and runtime registration;
- package exports and dependency injection;
- active configuration;
- current tests and fixtures;
- production or CLI entry points;
- recent migration state;
- repository instructions.

File names, comments, and apparent completeness are weaker evidence than executed
control flow.

Mark dead, legacy, shadow, experimental, and generated paths explicitly. Do not patch a
plausible but inactive implementation.

## 7. Bound the Mutation Surface

Recommend the smallest surface that fully closes the requested behavior:

```text
required implementation
+ required tests
+ required schema/docs/generated synchronization
- unrelated cleanup
- speculative architecture changes
```

Classify proposed files:

| Class | Meaning |
|---|---|
| Must change | Required to satisfy the request |
| May change | Conditional implementation choice |
| Must inspect | Needed to verify contracts |
| Must preserve | User changes, public behavior, or protected artifacts |
| Out of scope | Related but not necessary |

If a local change cannot preserve an invariant, escalate the route to feature,
refactor, or migration rather than disguising it as a bug fix.

## 8. Impact Analysis Failure Modes

| Failure | Prevention |
|---|---|
| Editing the first matching file | Confirm runtime ownership and callers |
| Treating docs as current implementation | Trace executable paths |
| Ignoring dirty worktree state | Snapshot status and preserve unrelated changes |
| Reading only definitions | Inspect callers, consumers, and tests |
| Assuming schema-local changes are local | Trace serialization and migration boundaries |
| Using line/index identity across revisions | Prefer semantic symbols and stable IDs |
| Expanding to whole-repo cleanup | Maintain must/may/out-of-scope sets |
| Claiming no impact because no test failed | Assess verifier coverage |

## 9. Completion Gate

Reconnaissance is complete when:

```text
[ ] active entry point is identified
[ ] authoritative implementation is identified
[ ] important data/state objects are traced
[ ] direct and downstream consumers are listed
[ ] invariants and compatibility boundaries are explicit
[ ] existing user changes are separated from task changes
[ ] smallest safe mutation surface is proposed
[ ] each intended outcome has a verifier
[ ] unknowns that could change the design are surfaced
```

## 10. Handoff Artifact

Use this compact format:

```text
Repository state:
Active entry points:
Ownership and data flow:
Must-change files:
Must-inspect / must-preserve files:
Affected contracts and consumers:
Verifier map:
Residual unknowns:
Recommended next guide:
```

Do not hand off a raw file list without explaining why each file matters.
