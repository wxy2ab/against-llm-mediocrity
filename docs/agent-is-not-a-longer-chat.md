# An Agent Is Not a Longer Chat

## Why Chat, Bot, and Agent Systems Have Fundamentally Different Task Authorities

English · [中文](./agent-is-not-a-longer-chat.zh-CN.md) · [Five-pass review record](./agent-is-not-a-longer-chat.review.md)

> For product managers, application engineers, and platform engineers who build or procure agent systems. This article is not about product labels. It asks: when a human no longer watches a task step by step, who may interpret state, cause side effects, accept evidence, and declare completion?

Many systems described as agents are still extended chat architectures:

* add tool calls to a chat;
* add a loop;
* add long-term memory;
* add a planner;
* let the model decide when the task is complete.

Such a system may be more complex than an ordinary conversation without crossing the design boundary from Chat to Agent.

The important difference among Chat, Bot, and Agent is not mainly whether they use an LLM, call tools, run for multiple turns, or last seconds rather than hours. It is:

> **As a task progresses, who holds the authority to interpret state, commit progress, correct drift, choose a route, and accept the final result?**

In Chat and most Bot systems, humans retain most of that authority. When humans stop supervising an Agent step by step, explicit mechanisms must take over the responsibilities that humans previously performed implicitly: an external runtime, a state-governance layer, routing policies, verifiers, auditors, and human escalation points.

Chat, Bot, and Agent are therefore not merely three levels of complexity. They also embody different **task-authority structures**.

Here, “authority” means permission to commit something as a task fact, not the ability to influence a decision. An LLM may strongly influence plans and candidate results; only an authorized mechanism may turn a candidate into authoritative task state. For a low-risk, reversible, easily verified task, that mechanism may be lightweight. The longer, more open-ended, or riskier the task, the more explicit the governance should become.

### In one sentence

> **Chat relies on a human to preserve task truth on every turn; an Agent needs a runtime that can distinguish proposals, observations, evidence, and committed facts without step-by-step supervision.**

---

## 1. Scope: What “Chat,” “Bot,” and “Agent” Mean Here

To avoid a debate over product names, this article distinguishes the three by their runtime control relationships.

### 1. Chat: collaboration with a human on every turn

The basic Chat structure is:

~~~text
Human makes a request
→ LLM produces a response
→ Human reads, judges, adds information, and corrects
→ LLM responds again
~~~

The human remains inside the loop.

The human knows the real problem, which information has changed, whether the model misunderstood the request, and when a different approach is needed. Even if this information never appears fully in the transcript, the human maintains a task state richer than the context window.

The actual control structure is therefore not:

~~~text
LLM independently solves the task
~~~

It is:

~~~text
Human controls the task
LLM supplies cognitive labor
~~~

An LLM may err because the human can notice. It may omit state because the human remembers. It may claim completion because that claim does not automatically commit the result.

Much of Chat's reliability comes from a component that architecture diagrams often omit: a **continuously available human control plane**.

---

### 2. Bot: bounded delegation under human supervision

Here, Bot means a system with a relatively fixed role, a limited task, and human initiation or supervision.

Examples include:

* a support bot that answers common questions;
* a coding bot that generates a function;
* an email bot that drafts a reply;
* an analytics bot that produces a report;
* a workflow bot that runs a bounded procedure.

A Bot may be more structured than Chat and may use tools, rules, databases, and short-term state. It usually still has these properties:

1. the task boundary is relatively fixed;
2. each run is limited in duration;
3. a human can inspect the result easily;
4. a human can interrupt, restart, or override it;
5. a human normally accepts or rejects the final result.

The interface may differ from Chat, but the authority structure is similar: **a human remains the authority for task state and final correctness**.

Once a Bot begins to pursue an open task for an extended period without continuous supervision, revise its own plan, invoke different capabilities, modify the environment, and decide when it is done, it has functionally entered Agent territory.

---

### 3. Agent: persistent delegation without step-by-step human control

The defining feature of an Agent is not tool use. It is:

> **A human delegates a task with duration, state changes, and intermediate uncertainty, then stops deciding every action during part of the execution.**

The basic structure becomes:

~~~text
Human submits a task
→ Agent runs over time
→ Agent maintains task progress
→ Agent selects capabilities and routes
→ Agent verifies and corrects
→ Agent submits a result
~~~

“Not participating step by step” does not mean that the human disappears forever. A human may return for approval, risk acceptance, requirement conflict, or a condition that the system cannot verify. The point is that the system cannot depend on a human to maintain state and correct it at every step.

During autonomous execution, a human no longer performs all of these duties turn by turn:

* remember where the task is;
* decide which claims have been established;
* notice that the current route has drifted;
* choose whether to continue, roll back, repair, or reroute;
* decide whether a stage is actually complete;
* distinguish the model's ideas, plans, descriptions, and real events.

These responsibilities do not vanish when the human leaves the local loop.

If the Agent architecture does not implement them explicitly, they default to the LLM. An LLM is poorly suited to be the final authority for them.

That is the structural boundary between Chat/Bot and Agent.

---

## 2. In Chat and Bot Systems, the Human Is the Real State Machine

People often say that the context window is the state of a conversation. That is incomplete.

Context contains the text that has been expressed. Much of the real task state remains in the human's mind.

Suppose a user is revising a paper through Chat. The transcript may not fully record:

* the central claim the user intends to preserve;
* which edits are exploratory rather than accepted;
* which version is authoritative;
* which review comments have been addressed;
* which conclusions lack evidence;
* which paragraphs are temporary placeholders;
* the user's implicit tradeoffs among risk, length, and venue.

The user nevertheless knows these things.

When the model makes a wrong edit, the user points it out. When it forgets earlier context, the user restores it. When it mistakes a provisional option for a final decision, the user corrects it. When it says “done,” the user still checks.

Chat therefore contains an implicit state transition:

$$
S_t^H
\xrightarrow{\text{LLM output}}
P_t
\xrightarrow{\text{human judgment}}
S_{t+1}^H
$$

where:

* $S_t^H$ is the real task state maintained by the human;
* $P_t$ is the candidate response produced by the model;
* the human decides whether to accept, modify, reject, or ask again;
* only human judgment can turn the output into task progress.

The LLM output is a **proposal**, not an automatically valid fact.

---

### The human performs five implicit roles in Chat

#### 1. State maintainer

The human knows the current stage, which constraints remain valid, and which information is stale.

#### 2. Task auditor

The human checks for misunderstanding, omissions, fabricated facts, and drift from the goal.

#### 3. Drift corrector

When the model moves in the wrong direction, the human says, “That is not what I meant,” “Return to the previous question,” or “Do not expand this branch.”

#### 4. Routing controller

The human chooses whether to ask another question, request a search, write code, upload a file, switch models, or stop.

#### 5. Final committer

The model's declaration of completion is not decisive. The task ends when the human accepts the result.

These roles are often invisible in the Chat interface, yet they make Chat stable.

---

### Chat does not need full task sovereignty

Chat may keep a transcript, remember preferences, and add safety checks. But there is little reason for it to take over the complete authority for task state, audit, and completion because the human is present.

This does not mean Chat needs no state mechanisms. It means:

> **State mechanisms in Chat primarily support convenience, continuity, and personalization; they do not have to replace the human as the final authority for task truth.**

A human can fill gaps in system state, override a bad interpretation, and advance a task through natural language even without a rigorous task state machine.

Chat can therefore remain model-centered.

---

## 3. Why the LLM Can Be the Center of Chat and Bot

“Center” is not a strict programming-language term here. It is an architectural test: are the main interfaces, lifecycles, and surrounding components organized around model calls?

A typical Chat architecture looks like this:

~~~text
Conversation
 ├─ messages
 ├─ model
 ├─ system prompt
 ├─ tools
 └─ memory
~~~

The system is organized as repeated model invocations:

~~~text
Assemble context
→ Call model
→ Return text
→ Wait for the next human turn
~~~

It is reasonable for the LLM to be the center of this architecture.

Not because the LLM is fully reliable, but because it does not bear final responsibility for reliability by itself. It may:

* interpret the task freely from the current context;
* express uncertain state in natural language;
* change its approach across turns;
* mix plans, hypotheses, and conclusions in one answer;
* depend on the user to detect problems;
* depend on the user to decide what should persist.

Even if the model drifts, the user remains a stable anchor.

A Bot can also remain model-centered when its scope is narrow, failure is visible, and its output does not automatically cause a high-risk state transition.

That structure does not extend naturally to a long-running Agent.

---

## 4. An Agent Is Not a Chat Loop Repeated More Times

A common formula is:

~~~text
Chat + tools + memory + loop = Agent
~~~

It omits the crucial term: **transfer of authority**.

When the human leaves the local loop, adding more model calls does not recreate the control functions that the human used to perform.

Small problems that a human absorbs easily in Chat can accumulate into systematic failures along an Agent trajectory.

### Goal drift

The model reinterprets the task from the current prefix on every turn. Small restatements accumulate until the execution target differs from the original request.

### State oscillation

The model alternates between approaches. It endorses A in one turn and returns to B in another, while the system lacks explicit commit and revocation semantics.

### False completion

The model says “we have completed X,” and the runtime treats the sentence as fact even though the artifact does not exist, tests did not pass, or the environment did not change.

### Memory contamination

Unverified assumptions, stale information, failed routes, and valid conclusions enter memory in the same form and later return to context without adequate distinction.

### Self-confirmation

The same model proposes, explains, evaluates, and accepts its own solution. Blind spots in generation survive unchanged in evaluation.

### Routing collapse

Deterministic execution, open exploration, semantic judgment, hard verification, and exception recovery are all repackaged as another generic LLM request.

A human can interrupt these failures in Chat. In an Agent they propagate through the trajectory.

The engineering question is therefore not “How do we make the model work longer?” It is:

> **How can an uncertain cognitive component continue without step-by-step human supervision while remaining inside a governed task environment?**

---

## 5. In an Agent, the LLM Cannot Be the Highest Task Authority

The “is not” in the title concerns task authority, not component status. An LLM can certainly be a first-class, composable software object and the system's most important source of capability. The problem is that an Agent's top-level task model cannot be organized only around a model, conversation, or prompt. It should also treat these as first-class:

* Mission;
* Task State;
* State Transition;
* Artifact;
* Evidence;
* Capability;
* Verification;
* Commitment.

The LLM may determine how good the best candidate solution can be. But its own declaration should not grant it final interpretive or authoritative write access to task state.

The core structure should look more like:

$$
C_t = R(S_t)
$$

$$
A_t^{proposal} = M(C_t)
$$

$$
O_t = E(S_t, A_t^{proposal})
$$

$$
D_t = V(S_t, A_t^{proposal}, O_t)
$$

$$
S_{t+1} = Commit(S_t, A_t^{proposal}, O_t, D_t)
$$

where:

* $S_t$ is authoritative task state maintained by a runtime outside the LLM;
* $R$ renders current context from task state;
* $M$ is the LLM proposing an action;
* $E$ is the execution environment;
* $O_t$ is an observation obtained from a tool or sensor;
* $V$ is verification or audit, and $D_t$ is its decision;
* Commit decides whether the result can enter authoritative state.

The key restriction is:

> **An LLM may propose a state change, but its natural-language declaration alone cannot modify authoritative state.**

This does not prevent an LLM from editing drafts, workspaces, or other reversible objects. The important distinction is between causing a side effect and committing an authoritative fact. Low-risk writes may be preauthorized; high-risk writes should pass an approval boundary. In either case, an artifact is not verified merely because the model says it is complete.

The model may say “the code is fixed,” but task state should move from “repairing” to “fixed” only after the relevant checks and commit rules pass.

The model may say “the stage is complete,” but the stage should close only when its exit conditions are verified.

The model may propose a different route, but policy, budget, risk, and current state should decide whether the route is accepted.

This does not diminish the model. It puts it where it is strongest:

> **The LLM generates, interprets, infers, plans, and proposes; external mechanisms decide what becomes a task fact.**

---

## 6. The Purpose of an Agent Harness: External Rules for Internal Uncertainty

An Agent harness is often described as:

* tool wrappers;
* prompt templates;
* model APIs;
* a planner;
* retry loops;
* multi-agent orchestration.

These may all belong to a harness, but they do not capture its main role in a system that needs long-horizon reliability:

> **Around probabilistic model cognition, establish a task regime with explicit rules, stable semantics, and verifiable state transitions.**

“External rules” do not mean that ordinary code can know the truth of every open question. Deterministic code cannot replace a model's semantic judgment or solve an unknown problem from nothing. Observations can be incomplete, and verifiers can be wrong.

The runtime provides a different kind of certainty:

* which state is authoritative;
* which information is still a candidate;
* which results have passed verification;
* which actions are legal in the current state;
* which conditions must hold before commitment;
* which failures require rollback;
* which component may write which state;
* which intermediate results need evidence;
* when to stop, escalate, or ask for human intervention.

This is certainty about **rules and commit semantics**, not certainty about content truth. It reduces the chance that unchecked candidates become facts; it does not guarantee that every committed conclusion is correct.

Model uncertainty cannot be removed, but it can be contained within candidate generation, semantic analysis, and controlled decisions. A fluent sentence no longer becomes system reality by itself.

A good harness is therefore less about making an LLM “autonomous like a person” and more about preventing the system from mistaking linguistic performance for task reality.

---

## 7. An Agent Needs Task State, Not Only Execution State

Many Agent systems claim to be stateful while storing only execution state:

~~~text
current workflow node
whether a tool returned
retry count
running process
files that were created
current model
~~~

This information matters, but it mainly answers:

> What is the system doing now?

It does not fully answer:

> What has the task established? Which conclusions are trustworthy? What remains unmet? Why is the next action legal?

The two kinds of state must be distinguished.

| Execution state | Task state |
| --- | --- |
| Current node | Current task stage |
| Tool-call ID | Accepted task objective |
| Process exit | Verified progress |
| Retry count | Unresolved constraint |
| File exists | Authoritative artifact |
| Current model | Current capability requirement |
| DAG node complete | Stage exit criteria satisfied |
| API response | Response accepted as evidence |

A completed workflow node does not necessarily mean task progress.

A written file does not necessarily satisfy the requirement.

A finished test process does not mean that the tests passed.

A model turn does not by itself create a valid task-state transition.

---

### What task state contains

Task state includes at least:

* current valid objectives;
* boundaries and constraints;
* accepted facts;
* unverified hypotheses;
* committed decisions;
* authoritative artifacts;
* completed and pending stages;
* stage exit criteria;
* unresolved questions;
* risks and blockers;
* capability requirements;
* legal next actions;
* evidence sources;
* a commit record for state changes.

This is not merely a summary paragraph. It is a task model with types, permissions, and transition rules.

---

### State gives an Action meaning

Without explicit task state, many “actions” are only linguistic gestures:

~~~text
continue
retry
repair
replan
roll back
verify
complete
~~~

If they do not refer to a concrete transition, their meanings are unstable.

Does “retry” mean the same call with the same input, a different model, a different method, or restoration from a checkpoint?

Does “repair” target code, specification, data, or the task route?

Does “complete” mean that the model has nothing else to write or that every exit condition is satisfied?

Does “roll back” revert a file, a stage, a decision, or merely say “let us start over” in the transcript?

Only explicit state gives an action stable semantics:

$$
S_t + A_t \rightarrow O_t \rightarrow V_t \rightarrow S_{t+1}
$$

An action need not mutate the environment. Reading, diagnosis, and approval requests can all be legitimate. But an action should produce a traceable observation, item of evidence, authorization request, or state transition. Otherwise “executed,” “verified,” and “complete” are only descriptions.

---

## 8. Why Memory Is Not Enough as an Agent's Central Abstraction

Memory is one of the most confusing abstractions in current Agent discussions. The problem is not that systems use memory. It is that memory becomes a catch-all name for state, permissions, evidence, and artifact governance.

It places very different information into a common category of “content that can be stored and retrieved”:

* user information;
* environment information;
* task information;
* session information;
* historical plans;
* model hypotheses;
* tool returns;
* intermediate conclusions;
* failure records;
* final artifacts.

A memory system often represents all of these as:

~~~text
string
+ timestamp
+ tags
+ embedding
+ similarity
~~~

That is useful for Chat.

Chat asks how the next model call can see relevant past content. Memory is thus designed around **content continuity**.

An Agent has additional questions:

* What semantic type does this item have?
* Is it still valid?
* Who produced it?
* Has it been verified?
* May it influence authoritative task state?
* May it trigger a transition?
* How does it relate to the authoritative artifact?
* Should it be revoked, archived, or retained after expiry?
* Is it a fact, observation, hypothesis, preference, plan, or decision?

The fact that an item was stored and retrieved cannot answer these questions.

---

### Memory solves storage and retrieval; an Agent also needs governance types

The distinction is:

> **Memory is a storage-and-retrieval category; state is a governance category.**

Consider these six sentences:

~~~text
The user prefers Python.
The API currently returns 429.
Implementation is complete.
Tests are not passing.
The next stage should refactor routing.
The user permits production modification.
~~~

They may all be strings in memory, but they belong to different mechanisms.

#### “The user prefers Python”

This is a preference that may influence a design choice without becoming a hard constraint.

#### “The API currently returns 429”

This is a timestamped environment observation that may expire quickly and trigger backoff or service switching.

#### “Implementation is complete”

This is only a completion claim. It should not enter completed state before verification.

#### “Tests are not passing”

This is a blocker and verification result that should prevent stage commitment.

#### “The next stage should refactor routing”

This may be a planning proposal rather than a committed task decision.

#### “The user permits production modification”

This is a permission and risk-control record. It needs explicit scope, duration, and revocation semantics; semantic similarity search is not an authorization system.

Memory can store all six items, but it cannot govern them in the same way.

---

### An Agent should distinguish at least five mechanisms

#### 1. User-information mechanism

Maintains identity, preferences, permissions, long-term goals, and explicit constraints.

A user preference and a user authorization cannot be peers. “Prefers concise output” and “may delete production data” need different semantics.

#### 2. Environment-information mechanism

Maintains observable resources, tool capabilities, external system state, data versions, and time-sensitive information.

Environment information needs time, source, and refresh semantics.

#### 3. Task-state mechanism

Maintains objectives, stages, constraints, committed decisions, verification results, unresolved questions, and exit criteria.

This is the Agent's core authoritative state.

#### 4. Session-information mechanism

Maintains the temporary context and working set for the current run.

Session data can be compressed, discarded, or reconstructed. It should not be the only source of task facts.

#### 5. Evidence-and-artifact mechanism

Maintains evidence, tool results, test reports, file versions, artifact relationships, and verification records.

An artifact's existence does not prove its validity. Evidence must be linked to a claim, transition, and verification rule.

Memory can implement storage for some of these mechanisms, but it cannot replace the top-level task model.

Calling all of them memory is like calling orders, permissions, audit logs, balances, and caches “data,” then trying to run the business through one retrieval endpoint. The storage claim is true; the mechanism distinction is missing.

---

## 9. Context Cannot Be an Agent's Only Source of Fact

Chat systems usually treat conversation history as the main context. That can work under continuous human supervision.

An Agent should not treat a growing narrative as its only authoritative state. For a short, reversible task with immediate human acceptance, the transcript may be enough. The problem appears when the system must resume across stages, coordinate concurrently, perform high-risk writes, or accept its own output.

Natural-language context mixes:

* events that actually occurred;
* ideas proposed by the model;
* unverified hypotheses;
* abandoned routes;
* raw tool output;
* model interpretations of tool output;
* progress summaries;
* rhetorical completion claims;
* stale information;
* conflicting conclusions.

If the Agent re-infers “where we are” from that narrative at every step, task state changes with the current wording of the context.

A more robust direction is:

> **Render critical context from authoritative state. If state must be recovered from conversation, reconcile and commit the recovered result.**

That is:

~~~text
Task State
+ relevant Artifacts
+ relevant Evidence
+ current Capability Contract
→ render Context for this step
→ LLM proposes an action
~~~

Rather than:

~~~text
Put every historical message back into the model
→ ask it to guess current task state
→ keep working
~~~

Context still matters, but it becomes a current working view rather than task truth itself.

---

## 10. Heterogeneous Tasks Need State-Aware Capability Routing

A long task is not homogeneous. It can include:

* deterministic transformations;
* external service calls;
* steps suited to a fixed DAG;
* steps that require dynamic planning;
* work for a specialist model or Agent;
* work that needs separated audit;
* decisions that only a human can make.

These subtasks differ in difficulty, risk, verifiability, state dependence, and capability fit.

For a heterogeneous task, one LLM should not simply choose “what next?” forever inside a uniform loop. A bounded Agent with one capability can retain a fixed route; it need not add dynamic routing merely to look agentic.

A complex Agent needs **heterogeneous capability routing**: route work to different capabilities and mechanisms according to authoritative state.

For example:

~~~text
Deterministic transformation
→ static function

Explicit remote-resource operation
→ service API

Known steps and verification boundaries
→ static DAG

Variable plan under stable governance
→ dynamic DAG

Specialist semantic judgment
→ specialist capability or Agent

High-risk or low-confidence result
→ separated audit or human approval

No usable verification boundary
→ pause, strengthen conditions, or escalate
~~~

The important question is not whether a model can select a tool. It is whether the system explicitly models where each capability is valid.

---

### Routing cannot depend entirely on LLM self-assessment

A model may classify the task and propose a route. A sentence such as “I think we should use X” should not grant unlimited authority.

Routing should also consider:

* current task state;
* capability contracts;
* risk;
* budget;
* permission boundaries;
* historical success;
* available verification;
* current blockers or oscillation;
* whether the action may modify an authoritative artifact.

There are therefore two layers:

~~~text
LLM proposes a cognitive route
External runtime decides whether to authorize and commit the route
~~~

Dynamic execution does not require everything to be dynamic.

A sound Agent retains a relatively stable governance skeleton—stages, state commitment, verification, permissions, and exit criteria—while the model adjusts search routes, capability combinations, and local order inside that boundary.

> **The execution route may be flexible; the governance boundary should not drift with the model's narrative.**

---

## 11. An Agent Needs Separated Audit, Not Only Orchestrator Self-Reflection

In Chat, the human naturally audits the work and can say:

* You answered a different question.
* This conclusion has no evidence.
* The code runs but changes the intended behavior.
* You omitted a critical constraint.
* You described completion without completing the task.
* This route has failed repeatedly and should stop.

When the human leaves the local loop, an Agent that needs long-horizon reliability must systematize that function.

Asking the orchestrator to reflect again can catch shallow errors, but it is not by itself an audit mechanism.

---

### Why the orchestrator should not be the only auditor

The orchestrator:

* interprets the task;
* selects the next step;
* invokes capabilities;
* organizes execution;
* pushes the task forward.

It has an inherent progress bias and has already accepted the current framing, plan, and route.

If the same orchestrator is solely responsible for deciding whether:

* its problem definition is wrong;
* its route should be abandoned;
* its result truly satisfies the objective;
* its task is complete;

then audit easily becomes another explanation of the existing narrative. This does not mean that the orchestrator should perform no self-check. It means that self-check should not be the only basis for a high-risk commitment.

When orchestration and audit share the same context, assumptions, and compressed objective, they resample the same blind spots.

Another model call does not automatically create independence.

---

### Effective audit needs a separated evidence path and veto power

An Agent audit should:

1. evaluate the task objective, constraints, and committed state rather than the orchestrator's explanation;
2. inspect artifacts, observations, and evidence directly;
3. distinguish claim, evidence, and corrective action;
4. localize the mechanism that failed;
5. block commitment, trigger repair, or request rollback;
6. ignore sunk-cost pressure from the existing route;
7. use context isolation and permissions proportional to risk.

The auditor may use the same kind of model, or even the same model instance. Independence here is operational, not necessarily model identity. It comes from:

* different input structure;
* a different objective;
* different access to evidence;
* no pressure to advance the task;
* authority to block or roll back commitment.

An ordinary team can start lightly: the execution phase produces only candidate artifacts and receipts; an audit phase with a cleaner context reads the requirements, diff, tests, and final artifact directly. As risk grows, add a different model, different tools, human approval, or a separate service.

---

### This article distinguishes verification from audit

Verification asks:

> Does the result meet an explicit condition?

Examples:

* did the test pass?
* does the file exist?
* did the metric exceed the threshold?
* does the schema validate?
* are all stage exit criteria satisfied?

Audit asks:

> Why does the result still fail the task's value, where is the failure, and what should be repaired next?

Verification is a gate. Audit localizes and directs correction.

Teams may use different names. The important distinction is between checking known conditions and locating the gap when the result is still wrong. Complex or high-risk Agents need both responsibilities; neither should collapse into one “check your own work” prompt.

---

## 12. Agent Completion Is a State Commitment, Not a Linguistic Judgment

In Chat, the model may say:

> “That is the complete solution.”

The human decides whether it is complete.

If an Agent runtime treats a model's completion statement as task termination, it creates false completion.

Completion criteria should be defined according to task risk and usually include:

~~~text
required artifacts exist
+ exit criteria are satisfied
+ required verification has run
+ high-risk issues are closed or explicitly accepted
+ authoritative state is committed
+ final artifacts map to the task objective
~~~

“Complete” is a governed state transition, not a language label:

$$
S_{\text{in progress}}
\xrightarrow{\text{exit criteria + verification}}
S_{\text{completed}}
$$

The LLM can request completion. The runtime may accept that request under preauthorized rules, but the statement itself is not evidence.

Likewise, the model may request to:

* close a stage;
* accept a hypothesis;
* replace an authoritative artifact;
* change the route.

Each request enters the corresponding commit mechanism.

---

## 13. Which Objects Should Be First-Class Governance Objects?

Chat can center:

~~~text
Model
Message
Conversation
Tool Call
Memory Item
~~~

An Agent should also elevate:

### Mission

Defines the long-term objective, scope, success criteria, and governance strategy.

### Task State

Defines what is established, what remains, and which next actions are permitted.

### State Transition

Defines the relationship among action, observation, verification, and commitment.

### Capability

Defines which class of task a component may undertake, under which conditions, and how its output is verified.

### Artifact

Defines identity, version, dependencies, authority, and lifecycle of a deliverable.

### Evidence

Defines why a claim may be accepted, rejected, or left unresolved.

### Stage

Defines a stable long-task boundary, its exit criteria, and its rollback scope.

### Audit Result

Defines failure location, evidence, impact, and corrective action.

### Commitment

Defines when a candidate becomes a task fact.

The LLM remains a core capability provider, but it is a replaceable, composable, governable cognitive executor.

Design the system around “What state is the task in, which capability is needed, and what result may be committed?” rather than “What is the model thinking?”

---

## 14. Structural Risks Amplified by a Model-Only Center

When the LLM is the sole center and every other mechanism is merely a prompt attachment, the following degradations become likely. They are not inevitable on every run, but risk grows with task length, irreversible writes, and verification difficulty.

### State becomes a paragraph in a prompt

The model reinterprets it on every call instead of reading a defined state object.

### Plan becomes the model's current narrative

The plan lacks versions, commitment, dependencies, and revocation semantics.

### Tools become a list of callable functions

The system knows a tool's name without modeling legality and risk in each task state.

### Audit becomes a reflection prompt

There is no separated evidence, veto authority, or effect on state commitment.

### Memory becomes a context patch

Historical content is reinserted without authority, expiry, or semantic types.

### Multi-agent becomes several models talking

Without shared authoritative task state and a commit protocol, more Agents produce more candidate opinions, not governance.

### Completion becomes a sentence

The model decides that the answer is good enough, and the runtime stops.

Such systems can look fluid in a demo yet drift, oscillate, rework, contaminate state, and fail to deliver over a long run.

---

## 15. From Chat to Agent Means Transferring the Human Control Plane

The transition can be understood as moving duties that a human performs implicitly in Chat into explicit system mechanisms.

| Human duty in Chat | Mechanism needed in Agent |
| --- | --- |
| Remember objective and progress | Authoritative task state |
| Decide which information is trustworthy | Evidence and verification |
| Detect an off-target answer | Separated audit or human check |
| Decide what to do next | State-aware routing |
| Decide whether to change method | Failure classification and route governance |
| Separate ideas from facts | Candidate–commit separation |
| Decide whether the task is complete | Exit criteria and completion gate |
| Correct bad state | Rollback, revocation, and replay |
| Control risk and permission | External permission mechanism |
| Preserve the final version | Artifact authority and version governance |

> An Agent harness is not only another layer of tools around a model. It also systematizes the control plane that is missing when a human leaves the step-by-step loop.

Humans do not have to disappear completely. Approval points, risk acceptance, and requirement decisions can remain part of the Agent system. What must disappear is the assumption that someone will remember and correct everything at every step.

---

## 16. Risk-Proportional Agent Design Principles

The implementation strength of these principles should vary with task duration, openness, reversibility, verification difficulty, and side-effect risk.

### 1. Task state before conversation state

An Agent is first a system that advances a task, and second a language interface.

### 2. LLM output is a candidate by default

Plans, conclusions, state descriptions, and completion claims should pass a commit mechanism proportional to risk. Preauthorized low-risk side effects may execute directly, but an execution receipt is not proof of quality.

### 3. Maintain state outside the LLM

Do not ask the model merely to remember state, and do not store only workflow-node position. A runtime or equivalent component should maintain semantically explicit task state.

### 4. Render critical context from state

Long-running work should not depend only on the model re-inferring facts from an extended transcript.

### 5. State updates need appropriate observation and verification

Model intent cannot replace environment results, and an execution description cannot replace execution. Verification strength depends on error cost.

### 6. Memory cannot replace mechanisms

User, environment, task, session, evidence, artifact, permission, and decision data need mechanism-level distinctions.

### 7. Distinguish orchestration, execution, verification, and audit

They may share models and infrastructure, but should not share undifferentiated input, objectives, and commit authority. Increase separation with risk.

### 8. Route heterogeneous tasks by capability and state

A complex Agent should not reduce every problem to one generic model call. A simple task may retain a fixed route.

### 9. Execution can be dynamic; governance boundaries should be stable

The model may search flexibly, but state commitment, permission, verification, and stage boundaries should not drift with its narrative.

### 10. Completion is a verified state transition

The model's feeling of completion cannot replace exit criteria.

### 11. Design undo, rollback, or compensation for costly actions

Long-running systems will make mistakes. The important property is that an error does not silently contaminate later state.

### 12. Human escalation is a valid state, not a system failure

When evidence, capability, or a verification boundary is missing, pause and ask rather than continuing inside an uncertain story.

---

## 17. A Minimal Governance Stack for Ordinary Teams

You do not need to build a grand “Agent operating system” first. For an ordinary application Agent, seven objects remove many common failures:

| Minimal object | What it records | Simplest implementation |
| --- | --- | --- |
| Task Spec | Objective, scope, constraints, acceptance criteria | Versioned JSON/YAML or database row |
| State Record | Stage, accepted facts, open items, blockers | Versioned structured state |
| Action Proposal | Action, reason, expected side effects, required permission | Typed tool call |
| Execution Receipt | Actual call, result, time, target version | Immutable log or event |
| Evidence | Which evidence supports which claim | Test report, query result, artifact hash |
| Gate | When to commit, reject, or escalate | Rules plus necessary semantic review |
| Commitment | New authoritative state, committer, grounds, rollback point | Transaction, version commit, or state event |

A minimal transition is:

~~~text
Read versioned task state
→ LLM proposes a typed action
→ runtime checks permission and preconditions
→ tool executes and returns a receipt
→ verifier checks exit criteria
→ commit new state, or record failure and repair/escalate
~~~

### A code-repair example

A user requests an API bug fix. The patch generated by the model is only an Action Proposal. File writes and command output are Execution Receipts. A reproduction test, regression tests, and diff inspection form Evidence. Only after the Gate accepts that evidence does state move from “repairing” to “complete.” If the test environment is missing, “blocked: environment information required” is a valid non-complete state; a fabricated completion claim is not.

### When heavy governance is unnecessary

If the task is short, a human can inspect the result immediately, every action is reversible, there are no external side effects, and failure is cheap, then a transcript, a tool loop, and final human acceptance may be enough. Do not add a complicated state machine for architectural purity.

The thesis is not “every Agent needs heavy governance.” It is:

> **Once a system preserves long-running task truth on a human's behalf, it must assume that authority in a way proportional to risk.**

---

## 18. The Final Difference Among Chat, Bot, and Agent

The three structures can be compressed into three statements.

### Chat

> The human maintains the task; the LLM participates in thinking.

### Bot

> The human delegates a bounded function while retaining supervision and final acceptance.

### Agent

> The human delegates a persistent task; the system assumes the governance duties the human no longer performs step by step and escalates when necessary.

The deepest difference is not model capability. It is the location of task authority.

| Dimension | Chat | Bot | Agent |
| --- | --- | --- | --- |
| Human in every step | Yes | Usually | Usually not; may return at checkpoints |
| Task-state authority | Human | Human or fixed system | External task-governance layer |
| Nature of LLM output | Advice | Bounded result | Candidate action and conclusion |
| Drift correction | Human | Human or fixed rules | Agent governance mechanisms |
| Routing | Human | Preset or human | Fixed route or state-aware capability routing |
| Audit | Human | Human or simple check | Risk-proportional separated audit |
| Completion authority | Human | Human or fixed process | Exit criteria and verified commitment |
| Main role of Memory | Continuity | Convenience and local record | One underlying storage mechanism |
| Central governance objects | Model and conversation | Function and model | Mission, State, Capability, Evidence |
| Meaning of Harness | Invocation convenience | Function packaging | External governance of model uncertainty |

---

## Conclusion: An Agent Is a Different Software Institution

The success of Chat and Bot rests partly on an overlooked fact: humans perform the hardest governance work.

Humans preserve real intent, fill in implicit state, detect drift, choose the next route, separate hypotheses from facts, and finally decide whether the task is complete. The model only needs to provide high-quality cognitive work locally.

An Agent changes that assumption.

When the human leaves step-by-step control, the system cannot assume that those governance functions still exist. Nor can it hand them wholesale to a context-dependent, probabilistic LLM that can drift.

An Agent is therefore not merely a more autonomous Chat or a Bot with memory, tools, and a loop.

It is a different software institution:

> **It centers task state rather than conversation history, treats capability rather than model invocation as the basic unit, recognizes verified state commitment rather than a sentence as progress, uses separated audit rather than only self-reflection for correction, and governs model uncertainty through external rules.**

In Chat, the system can center the LLM and conversation because the human is the hidden task operating system.

In an Agent, the LLM can remain a first-class capability object, but it cannot be the sole highest task authority. The harness must assume the control plane that the human no longer supplies step by step.

The first-class concern is not “what is the model saying?” It is:

> **What state is the task in, which results have been established, what may happen next, and what evidence is sufficient to continue?**

Only after that shift does an unattended conversational model become an Agent capable of sustained, stable, and auditable task execution.
