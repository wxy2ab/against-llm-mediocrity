# From Fixed Workflows to Governed Delegation: The Fundamental Difference Between Old and New Software Design

> 中文版：[从固定流程到受治理委托](from-fixed-workflows-to-governed-delegation.zh-CN.md)

The arrival of generative models in software is often described as software becoming “more intelligent.” That description is not wrong, but it misses the central design change. The important shift is not merely that a function now accepts natural language, or that a model has been inserted into a fixed pipeline. The unit of abstraction exposed by software is expanding:

```text
function → service → workflow → capability → domain responsibility → principal delegation
```

Traditional software asks developers to enumerate valid paths in advance. A new class of software lets the system select its next step at runtime from the remaining task, trusted state, budget, authority, and verification results. The former designs how to execute a known path. The latter designs how a path may be chosen within constraints and how its result can earn acceptance.

Here, “old” and “new” describe two **allocations of control authority**, not periods in history and not “without AI” versus “with AI.” Rule engines, search algorithms, and adaptive control have long made runtime decisions. The current change is that generative models expand the runtime decision surface from parameters and branches to task decomposition, capability selection, and semantic repair. Real systems usually lie on a continuum: some paths remain fixed while selected decisions are opened.

This is not a simple replacement of old software by new software. A reliable adaptive system must **mount** adaptive behavior on the deterministic foundation that conventional software already handles well. The more decision-making is opened at higher levels, the more the system must reuse deterministic capabilities below and preserve contracts, evidence, and state-commit authority at every mount point.

This article is limited to the consequences of that shift for software design. It does not attempt to turn the model into a complete theory of software engineering.

> **Project context:** The six responsibility layers below are an architectural classification, not the project's [six primitive mismatches](six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md). Governed adaptive orchestration describes how runtime decision authority is allocated; the [State-Governed Agent Regime (SGAR)](state-governed-agent-regime-for-governed-llm-systems.md) supplies the hard-state runtime discipline for accepting and committing those decisions.

## 1. Old Design Enumerates Paths; New Design Constrains Decisions

In a fixed workflow, developers usually define the following in advance:

- nodes and dependencies;
- conditional branches;
- retries and fallbacks;
- gates and completion criteria;
- the states that may be committed.

The runtime primarily executes and selects within this predefined graph. A workflow may contain many branches and still belong to the same design family if its valid paths have effectively been enumerated.

An adaptive system is different. Developers cannot—and should not—enumerate every reasonable path in advance. At runtime, the system must derive the next task graph from the current residual: which capability to call, which context to read, which objects may be changed, how to verify the result, and whether failure should lead to repair, replanning, rollback, or human escalation.

The key boundary between old and new design is therefore not the use of a large model. It is this:

> **How much authority over execution paths remains at design time, and how much is conditionally transferred to runtime?**

A system that calls a large model through an API while fixing every path and acceptance condition remains a fixed workflow. Conversely, a system that can replan at runtime but has no authority boundary, verifier, or state-commit protocol is not automatically a higher-level architecture. It has merely propagated uncertainty into system state.

The difference can be summarized as follows:

| Design paradigm | Primary design object | Runtime question | Primary risk |
| --- | --- | --- | --- |
| Fixed workflow | Known paths and branches | Which predefined node are we in? | An expected branch was omitted |
| Governed adaptive orchestration | Capabilities, state, authority, evidence, and gates | Which capability should receive the current residual? | A bad plan contaminates real state |

Old design optimizes paths. New design governs decisions.

## 2. Six Layers of Responsibility, Not Intelligence

A six-layer model helps locate the shift, but the layers should not be interpreted as levels of model intelligence. A more stable classification asks what a system promises upward and how wide a semantic responsibility it accepts.

| Layer | Upward abstraction | Core promise | Meaning of completion |
| --- | --- | --- | --- |
| L1 Deterministic tool | Function, command, operator | Perform one explicit transformation | Output satisfies the function contract |
| L2 Networked service | API, resource contract | Provide a resource across an execution boundary | The request satisfies the service contract |
| L3 Fixed workflow | Static DAG | Deliver through a known process | The workflow reaches a successful terminal state |
| L4 Adaptive orchestration | Governed dynamic task graph | Select a path for the task residual | The path outcome is verified, and the resulting state transition is committed |
| L5 Domain capability system | Professional capability contract | Take responsibility for a class of professional results | Result, evidence, and domain state are deliverable |
| L6 Principal delegation system | Delegation interface for a person or role | Allocate responsibility in service of a principal | The goal advances without exceeding authority |

The model contains three different boundary changes:

1. L1–L2 changes the resource boundary: where a capability runs and who provides it.
2. L3–L4 changes the control boundary: whether developers predefine the path or the runtime derives it.
3. L5–L6 changes the responsibility boundary: whether the system is responsible for a professional domain or coordinates several domains for a principal.

The layer is determined by its radius of responsibility, not by its code size, component count, or model parameter count. An API backed by a powerful model may still be L2. A system using a weaker model may carry L6 responsibility if it maintains principal state, constrains cross-domain authority, and escalates correctly.

## 3. Mounting Is the Essential Relationship Between Old and New Design

The phrase “upgrade a fixed DAG into an agent” suggests that the old structure should be removed. A more accurate design operation is **mounting**: the upper layer neither copies nor bypasses the lower one; it invokes a proven lower-level capability through an explicit mount point.

“Mounting” here is neither a filesystem mount nor mere registration of a tool in a plugin catalog. It means that **an upper layer incorporates a lower capability into its responsibility structure without taking over the capability’s implementation or surrendering its own acceptance duty**.

A useful mount point contains at least:

```text
capability identity
+ applicability and prerequisite state
+ inputs, outputs, and version
+ readable and writable objects
+ required authority and budget
+ success evidence and verifier
+ timeout, failure, and fallback semantics
+ committable state transitions
```

A mount point must answer four ownership questions:

| Question | Owner that must be explicit |
| --- | --- |
| Who may initiate the call? | Invocation-authority owner |
| Who owns the lower capability contract and supplies evidence of its correctness? | Lower-capability owner |
| Who decides whether the result satisfies the upper goal? | Upper-layer verifier or acceptor |
| Who may write the result into authoritative state? | State-commit authority owner |

Without these distinctions, “mounting” usually means attaching an opaque tool to an agent: the upper layer does not know what the lower layer promises, while the lower layer does not know which outputs can trigger real state changes.

A static DAG does not become obsolete when dynamic orchestration appears. A proven transcoding pipeline, release process, settlement workflow, or database migration should be mounted as an atomic capability. A planner may decide whether and when to invoke it, but it should not casually rewrite invariants already established inside that workflow.

Mounting also makes the downward and upward flows asymmetric:

```text
downward: goal → task → delegation → workflow → service → function
upward: result + evidence + cost + risk + provenance + proposed state change
```

Constrained execution authority flows downward. Verifiable deliverables flow upward. Success at a lower layer proves only that the lower-layer contract was satisfied; it does not establish completion at the layer above. An API returning a legal analysis proves that the service call succeeded. It does not prove that the analysis applies to the relevant jurisdiction, much less authorize execution of a contract.

When adjacent layers have different completion semantics and a result may enter persistent, shared, or high-consequence state, this yields a strict design principle:

> **A cross-layer return value is evidence for the receiving layer, not permission to bypass that layer’s gate and mutate real state.**

If two layer contracts are genuinely equivalent, the receiving layer may compose the lower verifier into its own gate. That is explicit inheritance of verification, not an assumption that a successful call implies completion of the higher-level goal.

## 4. The Core Object Shifts from Control Flow to Committable State

Fixed workflows are usually centered on control flow: whether a node succeeded, which edge follows, and whether the workflow reached its terminal state. If an adaptive system stores only that information, state jumps become likely. A local failure may return execution to the wrong stage; a repaired candidate may lose its provenance; or a model’s claim of “done” may be mistaken for actual completion.

A governed adaptive system needs at least four distinct kinds of state:

- **work state:** current plan, active nodes, attempt counts, and budget consumption;
- **artifact state:** candidate versions, provenance, parent versions, mutation scope, and content hashes;
- **evaluation state:** hard constraints, soft debt, evidence, scores, and unresolved risks;
- **commit state:** which candidate was accepted as authoritative, by whom, and under which gate.

A planner may propose a change, an executor may produce a candidate, and an evaluator may attach evidence. Only a component with commit authority may update authoritative state. This separation does not exist to multiply agent roles. It prevents a single uncertain component from acting, interpreting the result, and declaring its own success.

The central transition in the new design is therefore:

```text
trusted state + task residual
→ bounded plan
→ candidate change
→ independent verification
→ accept / repair / replan / roll back / escalate
→ new trusted state
```

The task graph may change dynamically. The rules for committing authoritative state may not drift with it.

## 5. Gates Must Separate Hard Constraints from Soft Judgment

Fixed workflows tend to encode every check as a Boolean condition. That works when conditions are stable and results are exactly decidable. For open-ended tasks, it creates two failure modes. Either every quality preference becomes a hard rule and the system keeps iterating without a meaningful stopping point, or judgment is delegated entirely to a model and even hard constraints can be compensated by a high aggregate score.

A sound gate has two parts.

### Non-compensable hard gates

- valid schema, types, and structure;
- intact authority, mutation scope, and data boundaries;
- evidence for every explicitly declared hard constraint;
- closed lineage, version, and provenance chains;
- no unrecovered failure or blocking risk;
- all mandatory artifacts exist and are readable.

No score, cost tradeoff, or subjective assessment can compensate for failure of a hard gate.

### Tradeable soft gates

- whether style or expression can still improve;
- whether a noncritical gap is worth repairing;
- whether expected gain exceeds modification cost and regression risk;
- whether current quality is sufficient for the downstream stage.

An agent may judge a soft gate, but it must persist its rationale, remaining risks, and evidence. Flexibility does not mean removing gates. It means separating non-negotiable conditions from debt that may be traded off.

This separation also provides a clear stopping rule. Once hard gates pass, if a candidate has reached its quality target and further editing has lower expected value than its cost or regression risk, the system should advance rather than continue generating merely to exhaust a round budget.

## 6. When to Use a Fixed Workflow and When to Use an Agent

The purpose of new design is not to make every task dynamic. It is to place uncertainty only where a decision is genuinely required.

Two questions provide a useful first classification:

1. Can valid execution paths be substantially enumerated at design time?
2. Can results be accepted through stable deterministic or structured gates?

| Path | Acceptance | Better design |
| --- | --- | --- |
| Enumerable | Stable | Fixed DAG |
| Enumerable | Requires semantic judgment | Fixed DAG + semantic evaluator |
| Not enumerable | Stable | Dynamic planning + deterministic gate |
| Not enumerable | Requires semantic judgment | Governed adaptive orchestration + independent review/escalation |

A domain capability system is justified only when the software must maintain domain objects, policies, evidence, and failure classifications over time. A principal delegation layer is justified only when it must also represent a principal across domains, reconciling goals, authority conflicts, budgets, and long-running commitments.

Do not manufacture dynamism merely to use an agent. The more fixed the path, the more it should be packaged as a reusable capability. The more open the judgment, the stronger the evidence, authority, and escalation mechanism must be.

### A concrete comparison: short-video delivery

Suppose a system must turn a batch of source media into publishable short videos.

A conventional fixed workflow might inspect the media, normalize formats, normalize loudness, apply specified captions, sample-check the output, and export. As long as the input and publication standard are stable, this DAG is simple, inexpensive, and reproducible. There is no reason for an agent to replan it step by step.

Now change the request: “Produce three audience-specific versions from interview footage, preserve the central arguments, avoid misleading edits, and choose the pacing within a total-duration limit.” The complete path can no longer be enumerated easily. The system must judge relevance, select excerpts, retrieve more context when evidence is insufficient, and possibly replan around quality and duration. Opening L4 decisions is useful here.

Only the **editorial decisions** need to be open, not all execution:

```text
agent selects excerpts and version strategy
→ mounts “source location and timecode extraction”
→ mounts a validated transcoding and loudness DAG
→ produces candidate videos and citation manifests
→ independently checks semantic integrity, rights, duration, and release specification
→ commits release versions after the gate passes
```

If transcoding fails, recovery should resume at transcoding. If semantic review fails, control should return to excerpt selection or local editing. Neither failure should restart “understand all source media” without cause. This is the practical value of layered state and mounting: the dynamic layer avoids wasteful fixed paths, the fixed layer avoids reinventing reliable execution, and the gate prevents local success from masquerading as global completion.

## 7. A Design Path from Existing Software to Adaptive Software

A lower-risk evolution does not rewrite every workflow. It builds mount points one layer at a time.

### 1. Preserve deterministic islands

Identify stable functions, services, and workflows. Specify their inputs, outputs, errors, idempotency, and versions. They are the execution foundation of the adaptive system, not legacy code that an agent must replace.

### 2. Package workflows as capability contracts

Do not make the planner manipulate a bag of unrelated tools. Package a verifiable workflow as a capability with prerequisites, authority, artifacts, evidence, and failure routing.

The capability contract should also declare compatible versions and unmount conditions. When an implementation is replaced, the upper layer should depend on the contract and evidence format—not a provider name or a particular prompt. An old capability that cannot satisfy a new contract should be unmounted rather than retained through implicit compatibility.

### 3. Separate authoritative state from candidate state

Runtime changes first enter candidate state. A candidate becomes authoritative only after passing the gate for its layer. Recovery and retries must continue from persisted state, not from a model’s recollection of the current stage.

### 4. Open only the necessary decision points

Let an agent decide genuinely uncertain questions, such as capability selection, local repair strategy, or escalation. Keep established safety checks, transaction boundaries, and release steps fixed.

### 5. Separate verification authority from generation according to risk

Generated results must carry checkable evidence. Low-risk systems may combine generation and verification roles, but the proposer should not be the sole authority for verifying its own success when a result can enter real state. High-risk cases need an independent verifier, review agent, or human acceptor, and a generator must not be able to overwrite the verdict.

### 6. Grant commit authority gradually through shadow operation

First let the system propose plans and candidates without committing them, and compare its decisions with the established process. Then open mutation scope by risk tier. Capabilities can be mounted early; authority to commit real state should be granted last.

## 8. Five Common Design Errors

### Error 1: A large model implies a new architecture

A model is an implementation mechanism. Architecture is determined by the responsibility promised upward and by the state boundary.

### Error 2: Dynamic task graphs should replace static DAGs

The dynamic layer chooses paths. Static DAGs execute known and validated paths. Their relationship is mounting, not replacement.

### Error 3: An agent may plan, execute, and accept its own result

Those roles may be combined for low-risk exploration. Once a result can enter real state, action authority and acceptance authority should be separated or constrained by an external gate.

### Error 4: More retries mean stronger adaptation

A retry without a task residual, failure classification, or new evidence is only repeated sampling. A useful iteration must explain the previous failure, retain the best known candidate, and limit repair to the authorized scope.

### Error 5: Long-term memory is domain state

Conversation history is not an authoritative ledger. Domain state needs an object model, versions, provenance, committers, verification results, and a recoverable transition history.

## 9. Which Conclusions Are Hard, and Which Remain Hypotheses?

A rigorous review separates two kinds of conclusion.

### Relatively hard conclusions within this article’s scope

“Hard” here does not mean a mathematical theorem. It means a design invariant for **auditable and recoverable software that can modify persistent, shared, or high-consequence state**.

1. **Model use cannot define architectural level.** The same model can be wrapped as a function, service, workflow node, or planner. Classification must follow the upward contract and responsibility boundary.
2. **More open runtime decisions cannot justify weaker governance.** If paths cannot be enumerated, the system needs explicit state, authority boundaries, evidence, gates, and failure routing to distinguish exploration from commitment. Low-risk sandbox exploration without persistent side effects is outside this constraint.
3. **Success below cannot replace acceptance above.** Each layer has a different completion semantics, so cross-layer results require validation at the receiving layer.
4. **Deterministic capabilities do not become obsolete when agents appear.** Enumerable, stable processes should remain fixed and be mounted into the dynamic layer.
5. **Dynamic paths must be decoupled from authoritative state.** A plan may change; real state may change only through a stable, auditable commit protocol.

These claims do not prescribe the only possible implementation. They are testable obligations: a system that omits one should be able to identify the equivalent mechanism by which it preserves authority, evidence, consistency, and recovery, and demonstrate that mechanism through fault injection or audit records.

### Useful but still contingent hypotheses

1. The six-layer model is a useful design coordinate system, not a maturity ladder every product must climb.
2. Domain capability systems may become a primary unit for complex agent products, but domains differ sharply in required state and verification structures.
3. A general agent is more likely to excel as a delegator than as an omnipotent executor. The direction is plausible, but depends on mature capability markets, interoperability standards, and accountability regimes.
4. Dynamic orchestration can eliminate waste in fixed DAGs only when planning, verification, and error costs are lower in aggregate.

Treating forecasts as structural facts produces forceful prose but weak design guidance. A more useful framework separates invariants that should not be violated from product judgments that still require empirical validation.

### Five questions for a design review

After reading the architecture diagram, ask five questions to test whether the design actually holds:

1. Which paths must remain fixed, and which decisions genuinely need to be opened at runtime?
2. Through which contract is each lower capability mounted, and are the four ownership roles explicit?
3. Are candidate state and authoritative state separate, and who owns final commit authority?
4. Is every hard constraint verified individually and without compensation, and is the rationale for soft debt recorded?
5. After any node fails, can the system recover at the correct layer instead of returning to the beginning without cause?

If these questions have no concrete answers, “agentification” has usually changed the invocation style without creating a reliable new software design.

## Conclusion: New Software Requires a New Control Plane, Not Less Design

Old software fixes most decisions in code and workflow graphs. New software moves some decisions into runtime. Moving decisions does not remove design. It shifts design effort from enumerating every step toward defining capability boundaries, mount relationships, authoritative state, evidence standards, authority scopes, stopping conditions, and escalation paths.

The most precise distinction between old and new software design is therefore not a conflict between determinism and intelligence:

> **Old design primarily predefines execution paths; new design primarily constrains runtime decisions.**

A stable new system is not “one general agent plus many tools.” It is closer to a stack of mounted responsibilities:

```text
principal delegation
→ domain capability
→ governed adaptive orchestration
→ validated fixed workflow
→ networked service
→ deterministic tool
```

Upper layers delegate downward without bypassing authority. Lower layers present evidence upward without declaring themselves complete. Dynamic paths may change; authoritative state changes only through gates. When all three conditions hold, an agent expands the responsibility software can safely assume rather than the radius through which uncertainty can spread.
