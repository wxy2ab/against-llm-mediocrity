# From Aggregation Mismatch V1–V12 and V14 to Agent Engineering

**Evidence cutoff:** July 29, 2026

**Purpose:** Translate controlled experiments into implementable, measurable,
and reversible agent-architecture principles.

**中文：** [从聚合失配 V1–V12 与 V14 到 Agent 工程](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14.zh-CN.md)

**Evidence companion:** [V1–V12 and V14 experiment summary](./aggregation-mismatch-v1-v12-v14-experiment-summary.md)

**Scope:** V13 is archived after a four-arm ceiling and is not used as
engineering-effect evidence here.

## Executive summary

The most important engineering result is neither “Patch always beats Rewrite”
nor “add more prompting or reasoning tokens.” It is:

> **Do not make the model simultaneously own semantic decisions,
> authoritative state, dependency scheduling, physical addressing, Exact
> precondition rebinding, long-object serialization, and final commit. Let the
> model propose a verifiable semantic plan; let the runtime own hard state,
> compile and execute plans, interpret constrained Intent, verify invariants,
> and control commit.**

Recommended production flow:

```text
Observe authoritative state
→ Propose semantic plan
→ Verify and freeze plan
→ Schedule ready operations
→ Deterministically compile when possible
→ Otherwise route Intent / Exact Patch / Regional / Full
→ Seal payload
→ Revalidate current state
→ Execute atomically
→ Verify local and global invariants
→ Commit or rollback
→ Append event ledger and update routing evidence
```

Direct adoption rules:

1. Runtime owns readiness and completed ledgers for dependency construction.
2. When a correct plan is compilable, do not ask the model to serialize tool
   arguments again.
3. The model submits stable semantic IDs; runtime resolves current
   index/path/span.
4. Plan verification precedes Patch/Rewrite/Intent/Exact routing.
5. Classify failures by state, plan, compile, delivery, executor, verifier, and
   commit layers.
6. Every write passes preconditions, hashes, atomic execution, global
   verification, and rollback.
7. Patch/Regional/Full is conditional routing, not a hard-coded unvalidated
   density crossover.
8. Separate semantic-set correctness from serialization order; runtime
   canonicalizes harmless order.
9. Escalate evidence on demand: generic→located→causal.
10. Success, tokens, latency, tails, commit risk, and human escalation jointly
    enter routing utility.
11. State drift after payload seal makes Exact stale; recovery remains in the
    same semantic episode.
12. Track scientific claim state, implementation gate, and product default
    separately.

## 1. Turning evidence into engineering rules

Every rule receives one of three evidence labels:

| Label | Meaning | Engineering treatment |
|---|---|---|
| **T: conditional theory** | Follows from information, graph, or program semantics under explicit assumptions | Implement as safety substrate and validate implementation |
| **E: experimental support** | Passes under a fixed model, object, budget, and protocol | Shadow/canary on similar traffic; retain a kill switch |
| **U: unresolved or failed gate** | Floor, ceiling, interval, or minimum effect is not satisfied | Do not hard-code; continue calibration |

Examples:

- Deterministic compilation of a correct plan adds no task information: T.
- V7/V8 compilers are exact on frozen cases: E.
- A fixed sparse-to-dense routing threshold: U.
- Exact recovery costs at least +20% in V14: U, despite a positive direction.

Theory determines which safety components belong in the architecture.
Experiments determine whether to enable them in a deployment, their cost, and
their current boundaries.

## 2. Decompose agent success by layer

\[
P(S)=
P(\text{state adequate})
\times P(\text{plan correct}\mid state)
\times P(\text{delivery correct}\mid plan)
\times P(\text{safe commit}\mid delivery).
\]

This is a diagnostic decomposition, not an independence assumption:

| Layer | Authoritative object | Typical failure |
|---|---|---|
| Observation / State | snapshot, version, evidence, dependencies | stale read, missing file |
| Plan | semantic operations, preconditions, goal | wrong target, missing impact |
| Compile / Delivery | tool args, address, payload | index/path/schema error |
| Execute / Verify | post-state and invariants | partial apply, collateral |
| Commit | verdict, transaction, replay state | unsafe accept, duplicate effect |

V5 shows a large delivery gap under oracle plans while infer plans hit the
floor. V6 shows that selecting the right failure layer does not make a weak
recovery executor effective. V14 shows that even a valid initial payload can
become stale before execution.

## 3. Principle one: Runtime owns authoritative hard state

The runtime should hold:

- authoritative snapshot, version, and `pre_hash`;
- dependency graph, ready set, and completed ledger;
- frozen plan, `plan_hash`, and provenance;
- stable-ID to current-physical-address mapping;
- sealed payload hash and seal event;
- checkpoint, post-state, and verifier verdict;
- idempotency key and commit/rollback record.

These cannot live only in conversation text. V4's external correct bits,
V6/V8 schedulers and scaffolds, V11/V12 semantic IDs, and V14
seal-before-drift all support runtime ownership. Cost must also be measured:
V8's scaffold uses about 7.04× median tokens.

## 4. Principle two: The model outputs a semantic plan

Recommended minimal plan:

```json
{
  "plan_id": "stable-id",
  "pre_hash": "authoritative-state-hash",
  "operations": [
    {
      "target_id": "semantic-object-id",
      "intent": "replace",
      "old": "expected-old-value",
      "new": "proposed-new-value",
      "evidence_refs": ["..."]
    }
  ],
  "dependencies": [],
  "protected_invariants": []
}
```

The plan gate validates schema, target, evidence, preconditions,
duplicates/conflicts, dependency closure, impact radius, invariants, and
`plan_hash`. The correct order is:

```text
infer → verify/revise/retrieve → freeze → choose delivery
```

not choosing a shorter write API immediately after generation. The V3/V5
oracle–infer gap is the experimental boundary.

## 5. Principle three: Prefer deterministic compilation for a correct plan

Priority:

```text
1. deterministic compiler + native executor
2. runtime-resolved semantic-ID Patch
3. regional/subtree Rewrite
4. model Full Rewrite
```

V7's compiler passes 48/48 and V8's two compilers pass 64/64 on frozen cases.
Production still requires property and mutation tests, OOD schemas,
concurrency, crash/replay, and verifier false-accept audits. Asking the model to
regenerate tool arguments from a correct plan creates a new failure surface.

## 6. Principle four: Semantic ID over model-authored physical address

Avoid:

```json
{"item_id":"svc-42","path":"/items/37/value","new":3}
```

Prefer:

```json
{"item_id":"svc-42","new":3}
```

Runtime resolves path/index/span from current state. V8 ID−INDEX is +0.3125;
V11 relocation interaction is +0.21875 but concentrated at \(N=48\); V12 does
not establish monotone drift dose. The prescription follows address invariance
plus experimental support; it does not require predicting drift magnitude.

## 7. Principle five: Runtime performs dependency scheduling

The scheduler owns:

- ready set;
- completed ledger;
- unmet dependencies;
- deterministic tie-breaks;
- residual subgraph;
- per-node retry and budget.

V6's scheduler package is +0.438 and V8's scaffold +0.594. V7's pure requested
order misses its gate, while V9's ready/ledger fields hit a harder floor. The
adopted component is a dependency-aligned runtime package, not “prompt the model
to output topological order.”

## 8. Principle six: Verifier controls commit, without becoming mythology

Two levels:

| Level | Target | Receipt |
|---|---|---|
| Local / incremental | Current operation or affected subgraph | failed IDs, observed values |
| Global / commit | Full post-state and business invariants | accept/reject/rollback witness |

Local verification enables early stop and localization; global verification is
the final commit gate. V7/V9 located receipts have positive directions but miss
confirmatory gates; V8 local increment hits a ceiling. Escalate evidence:

```text
generic reject
→ failed semantic IDs
→ causal witness / dependency slice
→ broader context or human escalation
```

Escalate only when the previous level's conditional success is insufficient and
risk reduction justifies token and latency cost.

## 9. Principle seven: Patch/Rewrite/Intent/Exact is a routing problem

For sparse Patch:

\[
L_{\mathrm{rewrite}}\approx Nc_r,\qquad
L_{\mathrm{patch}}\approx c_0+k(c_p+\log N).
\]

When the plan is correct, \(k\ll N\), addresses are stable, and the executor is
reliable, Patch usually owns a smaller commitment surface. Dense edits,
structural refactors, invalid plans, or brittle tools can erase the advantage.

| Condition | Preferred route |
|---|---|
| Plan verified and compiler supported | Deterministic compile |
| Sparse edits, stable IDs, adequate local invariants | Semantic-ID Patch |
| Change localized to a verifiable region/subtree | Regional Rewrite |
| Dense edit or whole-schema change | Full Rewrite |
| Plan unverified | Replan / verify; do not enter delivery |
| Sealed Exact is stale | Typed reject → refresh → recompile/rebase |
| Verifiable monotone goal with controlled conflict risk | Runtime-interpreted Intent |

Evidence includes conditional Patch gains in V3/V5, sparse Patch−Full +0.2917
in V12, and V11 cost reductions. Boundaries include V4 near zero, stronger
Rewrite recovery in V7, V11 reliability ceiling, V12 dense Regional 8/24, and
V14's missed +20% cost gate.

## 10. Principle eight: Failure-layer routing, not generic retry

| Failure layer | Evidence | Action |
|---|---|---|
| Observation/state | stale evidence, hash mismatch | reread / refresh |
| Plan | wrong target/value/dependency | replan / expand search |
| Compile | unsupported operation | fix compiler / controlled fallback |
| Delivery | path/index/schema/tool args | deterministic recompile / rebind |
| Executor | permission, IO, transaction | rollback / repair environment |
| Verifier | local/global invariant failure | local repair / expand radius |
| Commit/replay | duplicate, conflict, stale pre-state | abort / rebase / idempotent replay |

V6's stage-aware router is +0.3125, but both delivery-error strategies remain
0/24. V14's `STALE_OLD_VALUE` belongs on refresh/recompile, not blind resubmission
of the same payload.

## 11. Principle nine: Governed commit is an independent safety layer

Minimal transaction:

```text
revalidate pre_hash / version / lock
→ checkpoint
→ atomic apply
→ local checks
→ global verifier
→ post_hash and collateral audit
→ commit

on failure:
rollback and preserve authoritative pre-state
```

Prevent invalid commit, stale write, partial multi-edit, duplicate replay,
plan-hash mutation, collateral, and write-after-verifier-reject. V6's 10,000
offline cases, V10 and V11's 1,024 each, and V12/V14's 768 each are
implementation-adoption evidence, not population guarantees.

## 12. Principle ten: Budget and cost are part of the claim

Router utility:

\[
U=
V_sP(\text{exact success})
-C_t(tokens)
-C_l(latency)
-C_r(risk)
-C_h(human).
\]

Record exact endpoint, budget, tokens, provider turns, transport attempts,
payload bytes, stage latency, rollback, tail latency, and success per cost.

V12's Patch advantage comes entirely from Full timeout within 300 seconds. In
V14 all four arms eventually succeed, but Exact recovery adds a second turn;
its +19.3% point estimate misses the +20% gate. Never treat missing timeout
usage as zero or splice independent budgets into one survival curve.

## 13. Principle eleven: The event ledger is part of recovery

Recommended event:

```json
{
  "run_key": "semantic-episode-id",
  "event_index": 7,
  "stage": "plan_verified|payload_sealed|drift|tool|verify|commit|rollback",
  "state_hash_before": "...",
  "state_hash_after": "...",
  "plan_hash": "...",
  "payload_hash": "...",
  "verdict": "...",
  "error_layer": null
}
```

Invariants:

- `(run_key,event_index)` is unique and continuous;
- the terminal is unique and cannot be overwritten by resume;
- retry/recovery is a nested attempt in the same statistical sample;
- payload or auditable hash is durable;
- endpoint reconstructs from events;
- replay creates no duplicate side effect.

V9–V12 reconstruct episodes. V14 reconstructs 96 episodes from 1,416 events and
120 provider turns with zero mismatch, explicitly recording seal-before-drift
in all 96.

## 14. Principle twelve: Separate scientific gates from product defaults

Maintain:

```json
{
  "scientific_state": "passed|failed_gate|not_adjudicated",
  "implementation_gate": "passed|failed|untested",
  "cost_gate": "passed|failed|unknown",
  "external_validity": "synthetic|shadow|canary|production",
  "default_policy": "off|shadow|conditional|on"
}
```

Examples:

- V8 scaffold passes scientifically but is costly.
- V11 Patch/Rewrite reliability is ceiling-limited, while cost can inform
  routing.
- V12-A1 has large simple effects but fails the interaction.
- V12-B1 passes, with differences caused by budgeted timeout.
- V14 has a strong direction and exact test but misses its minimum effect.

One `experiment_passed` boolean cannot control both paper language and
production policy.

## 15. Recommended reference architecture

```text
State Reader
  → authoritative snapshot + pre_hash

Planner
  → semantic plan

Plan Verifier
  → evidence, target, precondition, dependency checks

Scheduler / Ledger
  → ready set and completed work

Compiler / Delivery Router
  → deterministic / ID Patch / Regional / Full / constrained Intent

Payload Sealer
  → immutable args + payload_hash

Atomic Executor
  → revalidate, checkpoint, apply, rollback

Local + Global Verifiers
  → typed witness and commit verdict

Commit Controller
  → commit only verified post-state

Event Store / Policy Learner
  → reconstruct episodes and calibrate routes
```

State machine:

```text
OBSERVED → PLANNED → PLAN_VERIFIED → READY → COMPILED → SEALED
→ REVALIDATED → EXECUTED → POST_VERIFIED → COMMITTED

PLAN_REJECTED → REPLAN
SEALED_PAYLOAD_STALE → TYPED_REJECT → REFRESH → RECOMPILE
COMPILE_UNSUPPORTED → CONTROLLED_FALLBACK
DELIVERY_FAILED → RECOMPILE / REBIND
POST_REJECTED → ROLLBACK → LOCAL_REPAIR_OR_REPLAN
```

## 16. Implementation sequence

### P0: Safety and audit substrate

1. Authoritative state, version, and `pre_hash/post_hash`.
2. Semantic-plan schema and `plan_hash`.
3. Payload seal, typed stale, and idempotency key.
4. Atomic executor, checkpoint, and rollback.
5. Global verifier that actually controls commit.
6. Append-only event ledger and typed failure taxonomy.

### P1: Capability and routing

1. Stable semantic IDs.
2. Deterministic compiler.
3. Dependency scheduler and hard ledger.
4. Plan verifier and evidence binding.
5. Local/incremental verifier.
6. Patch/Regional/Full/Intent/Exact router.
7. Stage-aware recovery executors.

### P2: Calibration and transfer

1. Estimate per-layer base rates on real traffic.
2. Learn the success–token–latency–risk Pareto frontier.
3. Monitor across models, languages, time drift, and OOD data.
4. Run verifier mutation and false-accept/reject suites.
5. Calibrate density, coupling, length, and address-stability thresholds.
6. Evaluate routing counterfactuals in shadow/canary.
7. Transfer to real code, configuration, database, spreadsheet, and document
   tasks.

## 17. Application map

- **Code agents:** symbol/AST plan → compile current edits → seal → hash recheck
  → format/type/test → diff audit → atomic commit.
- **Configuration/JSON:** stable IDs, schema, old-value preconditions, atomic
  batches; runtime resolves current index and interprets constrained monotone
  Intent.
- **Database:** semantic migration plan → shadow dry-run → lock/version recheck
  → transaction → invariant check.
- **Spreadsheet/financial models:** row keys, semantic columns, formula Intent;
  runtime resolves cells and verifies dependency graphs and totals.
- **Research/specification documents:** claim/evidence IDs, glossary, local
  changes, numeric checks, and bilingual synchronization.
- **Multi-agent:** dispatch only ready tasks and share a hard ledger; bind every
  sealed plan to a base hash and run conflict-graph plus global acceptance before
  merge.

## 18. Anti-patterns

- Authoritative objects exist only in model context.
- The model uses stale line numbers, indices, or text spans.
- Patch is selected before plan verification.
- A known-correct plan is reserialized by the model.
- Equivalent ID sets are rejected for harmless order.
- Verifier is advisory and writes proceed after rejection.
- A stale payload receives generic retry.
- Recovery is counted as a new independent sample.
- Reporting success without budget, tail latency, or commit risk.
- Reporting 48/48 or 768/768 as 100% production reliability.
- Rewriting failed gates as ineffectiveness or ceilings as equivalence.
- Hard-coding routers from exploratory subgroups.
- Generalizing a single-model synthetic result into a universal law.

## 19. Open research

1. What is the minimum-cost implementation of the V8 scaffold?
2. How can readiness, ledger, multiple turns, and canonicalization be identified
   separately?
3. Can located receipts be non-inferior to causal receipts while reducing cost?
4. Where is the real density×coupling×schema crossover for
   Patch/Regional/Full?
5. Do V11 semantic-ID and V14 stale-recovery effects replicate across models
   and real repositories?
6. What is the safe interpretation boundary for non-monotone, exclusive, or
   ambiguous Intent?
7. Does governed commit hold under multiple writers, crash/replay, and external
   side effects?
8. What is the net value of stage-aware routing at production failure base
   rates?

## Final engineering conclusion

```text
Model owns uncertain semantics and candidate plans
Runtime owns authoritative state, dependencies, addresses, and Intent interpretation
Compiler/executor owns deterministic delivery
Verifier owns the acceptance boundary
Commit controller owns atomic state transition
Event ledger owns recovery, audit, and continual calibration
```

Shortest rule:

> **Verify the plan before compiling delivery; prefer semantic IDs and
> deterministic execution; revalidate authoritative state after payload seal;
> route stale Exact through typed recovery; put every write behind atomic
> execution, global verification, and commit/rollback; condition delivery and
> scaffold intensity on real cost, risk, and evidence state.**

## Related documents

- [V1–V12 and V14 experiment summary](./aggregation-mismatch-v1-v12-v14-experiment-summary.md)
- [V14 Post-Compile Drift and Exact Recovery](./aggregation-mismatch-v14-post-compile-drift-recovery.md)
- [Agent Five-Knob Operating Guidelines](./guidelines/agent-five-knob-operating-guidelines.zh-CN.md)
- [Aggregation mismatch: theoretical claims and agent engineering](./aggregation-mismatch-theoretical-claims-agent-engineering.md)
