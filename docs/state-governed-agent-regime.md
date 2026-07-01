# State-Governed Agent Regime

## A Working Draft on Hard-State Governance for Agents

**Status:** Working draft  
**Abbreviation:** SGAR  
**Chinese term:** 状态治理智能体范式  
**Related drafts:** [Knowledge Governance](knowledge-governance-llm-systems-local-alignment.md), [Audit Engineering](audit-engineering.md), [Human-Assist Operational Mismatches](human-assist-operational-mismatches.md), [Governed Human-AI Collaboration](governed-human-ai-collaboration.md)

## Abstract

State-Governed Agent Regime, or **SGAR**, names the governance regime in which an agent's operative state is externalized, verifiable, updateable, recoverable, and authoritative outside the LLM context. The central claim is simple: an agent is not merely an LLM that calls tools. A reliable long-horizon agent is a system that acts in state and advances goals through governed state transitions.

LLM context can describe state, remember state, summarize state, and simulate continuity. But context is not, by itself, a state authority. It is a narrative workspace. SGAR moves the basis of agent operation from context-maintained narrative to hard state: a governance layer that decides what the system currently recognizes, which actions are admissible, what evidence can validate progress, and whether a task has actually advanced.

SGAR does not claim to create metaphysically true causality. Its value is more operational and more testable: it creates an **operational scene** in which actions obtain task meaning, consequences become observable state differences, and long-horizon behavior becomes auditable, recoverable, and governable.

## 1. Core Claim

The core claim of SGAR is:

> Hard state establishes the operational scene; the scene gives action task meaning; action obtains causal position through state transition; the agent gains governable long-horizon behavior through the state-action-result chain.

Without hard state, an agent can still produce agent-like behavior: it may plan, call tools, revise drafts, run loops, and explain its progress. But if the authority for "where we are," "what is true," "what has been completed," and "what may happen next" lives only inside the LLM's current context, then the system remains a sophisticated LLM application rather than a reliable long-horizon action system.

SGAR changes the basic runtime question from:

```text
What should the LLM say or do next?
```

to:

```text
Given the currently recognized hard state, what actions are admissible,
what observation would count as evidence, what verification is required,
and which state transition may be committed?
```

## 2. Why Context Is Not Agent State

An LLM is stateless in the strict operational sense. It receives a context window and produces a continuation. It can represent prior facts and commitments in that context, but those representations have no independent authority once the context is rewritten, summarized, truncated, contradicted, or interpreted differently.

The decisive issue is not whether an LLM can *simulate* state. It often can. The issue is where state authority lives.

In a context-centric agent, the LLM is asked to be all of these at once:

- planner;
- executor;
- observer;
- bookkeeper;
- auditor;
- acceptor;
- governor.

That role fusion creates predictable failures: false completion, self-rationalization, forgotten constraints, goal substitution, unstable phase recognition, and action loops that look busy but do not reliably advance the task.

SGAR separates authority:

```text
LLM layer: understand, propose, explore, implement, explain
Hard-state layer: position, constrain, validate, commit, recover, audit
```

The LLM may propose that a state transition has occurred. The governance layer decides whether the transition is recognized.

## 3. Soft State and Hard State

| Dimension | Soft state | Hard state |
|---|---|---|
| Typical form | context, memory, summary, retrieval | external governance layer |
| Main function | help the LLM understand background | decide what the system currently recognizes |
| Authority | low or advisory | high or operative |
| Stability | rewritable, compressible, selectively recalled | persists beyond one inference and one context |
| Failure mode | drift, reinterpretation, narrative smoothing | stale or wrongly designed state if not governed |
| Proper role | cognitive aid | state authority |
| Short definition | belief-like support | commitment-like record |

Memory remains valuable in SGAR, but memory is not state authority. A compact distinction is:

```text
Memory tells the agent what may be relevant.
Hard state tells the agent what is currently true for governance.
```

Planning also remains valuable, but a plan is not progress. SGAR distinguishes:

1. **Plan:** what the system intends to do.
2. **Action:** what the system actually does.
3. **State transition:** what the system recognizes as changed after evidence and verification.

An agent cannot move forward merely by writing "verify result" into a plan. Verification must be performed, evidence must be attached, and the transition must be committed or rejected.

## 4. The Operational Scene

Action has task meaning only relative to a state. The same tool call, message, file edit, or experiment can mean different things depending on the operative state in which it occurs.

For example, "run tests" may mean:

- baseline discovery before implementation;
- verification after a patch;
- regression audit after a prior failure;
- evidence collection before a human escalation;
- rollback validation after a broken deployment.

The string of the action is the same. Its task meaning is different because the state is different.

SGAR therefore treats action as:

```text
in state S, take action A, produce observation O,
apply verification V, and commit or reject transition to S'
```

Without this state transition contract, actions degrade into stacked events. The agent may do many things, but the system cannot reliably tell which actions changed the task, which were exploratory, which failed, which created obligations, and which can be ignored.

## 5. State Transition Contract

A useful SGAR transition should specify at least:

| Field | Question |
|---|---|
| `state_id` | Which recognized state is the agent currently in? |
| `preconditions` | What must be true before this action is admissible? |
| `action` | What operation is being attempted? |
| `observation` | What did the tool, environment, human, or artifact return? |
| `verification` | What evidence decides whether the action succeeded? |
| `transition_rule` | Which state change is allowed if verification passes? |
| `commit_record` | What was actually recognized and when? |
| `rollback_or_retry` | What happens if verification fails or is inconclusive? |
| `provenance` | Which sources, logs, tests, tools, or approvals support the transition? |

The minimal pattern is:

```text
S + A -> O -> V -> S'
```

This is the core of hard-state governance. The state transition, not the LLM's confidence or explanation, is what turns activity into progress.

## 6. Failure Modes Without Hard State

### 6.1 State Drift

State drift occurs when the agent's implied position changes without a governed transition. Common forms include:

- treating a plan as if it were completed work;
- treating a guess as if it were validated evidence;
- treating an exploratory result as a final conclusion;
- forgetting that a constraint still applies;
- carrying forward a stale assumption after new evidence has contradicted it.

Longer context does not solve this by itself. More history can produce more material for reinterpretation.

### 6.2 State Oscillation

State oscillation occurs when the agent repeatedly switches among interpretations, stages, or priorities because there is no external anchor. The agent appears active but keeps rediscovering where it is.

Hard state gives the system a stable task skeleton. The agent does not have to infer from the transcript who it is, where it is, and what has been recognized. It reads the current governance state and acts inside it.

### 6.3 Performative Action

Without state uptake, action becomes performance. Tool calls, plans, summaries, audits, and explanations may look like work, but the system cannot tell whether they changed the recognized task state.

SGAR requires actions to be interpreted through state transitions. If no transition is possible, the action should be recorded as exploration, failed attempt, blocked attempt, or irrelevant activity rather than silently absorbed as progress.

### 6.4 Role Confusion

When the LLM acts as both operator and final acceptor, it has an incentive to accept its own story of progress. SGAR removes final state authority from the same context that generated the action.

## 7. Research Agents Need SGAR

Research tasks make SGAR especially important because uncertainty is not a temporary defect. It is the work itself.

Research agents must govern:

- current hypotheses;
- evidence strength;
- verified conclusions;
- unverified guesses;
- failed paths;
- reasons for abandonment;
- inconclusive results;
- replication obligations;
- disputed points;
- next research duties.

Without hard state, a research agent easily forgets failed routes, upgrades weak evidence into strong claims, treats hypotheses as facts, repeats experiments, ignores negative results, or over-rationalizes the current narrative to preserve continuity.

SGAR does not mechanize research into a rigid workflow. It lets uncertainty be governed rather than forgotten.

## 8. Causal Legibility, Not Guaranteed True Causality

SGAR should not be overstated as a guarantee of "true causality." A hard-state record can still be incomplete, wrongly designed, poorly observed, or attached to a misleading validator.

The stronger and safer claim is:

> SGAR creates causal legibility for task progress.

That means the system can inspect a chain such as:

```text
recognized state -> action -> observation -> verification -> next recognized state
```

and ask:

- Which action claimed to change the state?
- What evidence was produced?
- Which verifier accepted or rejected the transition?
- Which commitments or obligations changed?
- Can the chain be replayed, audited, rolled back, or contested?

This is operational or governed causality. It does not prove the complete external causal structure of the world, but it gives the agent a traceable causal position inside the task.

## 9. Conditional Reliability Claim

SGAR also should not be stated as "making prediction inherently more reliable." It improves the conditional reliability of next-action selection when the state layer is well designed.

The reliability gain depends on:

- state variables preserving task-relevant distinctions;
- transition rules matching the real workflow;
- observation and verification channels capturing decisive evidence;
- the LLM reading the hard state correctly;
- stale state being revoked;
- failures and negative evidence being recorded;
- long-horizon progress being recognized through valid transitions.

When these conditions hold, SGAR reduces uncertainty caused by mis-positioning. The agent chooses next actions from a clearer operative scene. When the state schema is wrong, SGAR can institutionalize the wrong abstraction. Hard state is therefore powerful, but it must itself be governed.

## 10. Relation to the Existing Framework

### State mismatch

State mismatch asks: given the current observation channel, which latent state are we in? SGAR is not a seventh primitive mismatch. It is a governance regime for representing, updating, validating, and recovering task state over time.

### Observation-representation mismatch

Observation-representation mismatch asks whether decisive variables enter the model-accessible representation at all. SGAR depends on this: a hard-state layer cannot govern variables that never enter observation, evidence, tools, logs, sensors, or encoded control representations.

### Knowledge Governance and GKOs

Knowledge Governance governs task-specific knowledge. GKOs store validated assertions, conditions, priorities, strengths, lifespans, conflicts, and revocation rules. SGAR gives agent operation a broader state authority layer in which GKOs may be read, applied, updated, or revoked as part of state transitions.

### GEOs and governed collaboration

GEOs govern escalation: when the agent must ask, whom it should ask, what it should ask, and what it may do while waiting. In SGAR, a human answer should not disappear into chat. It should update a recognized state, GKO, GEO, obligation, or transition record.

### Audit Engineering

Audit Engineering turns failure signals into control deltas. SGAR supplies the state substrate that absorbs those deltas: a defect is not merely noted; it changes recognized state, allowed actions, verification requirements, regression obligations, or rollback conditions.

## 11. Evaluation Questions

SGAR can be evaluated through metrics such as:

- **state drift rate:** how often the agent's implied state diverges from recognized state;
- **false completion rate:** how often the LLM claims completion without a valid transition;
- **transition validity:** how often committed transitions satisfy their evidence and verification requirements;
- **recovery success:** whether the agent can resume after interruption from the hard state alone;
- **replayability:** whether another agent or reviewer can reconstruct why the system is in its current state;
- **rollback quality:** whether failed or revoked transitions are handled without corrupting later work;
- **action-to-state uptake:** whether important actions are classified as progress, exploration, failure, or blocked attempts;
- **auditability:** whether commitments, evidence, validators, and owners can be inspected.

## 12. Design Principles

1. **State authority must be external to one inference.** A context summary may describe state, but it should not be the sole authority.
2. **Transitions require verification.** "I finished" must become "the system recognizes completion because evidence passed a gate."
3. **Plans are not state.** A plan can guide action, but it cannot certify progress.
4. **Memory is advisory.** It supports cognition but does not decide what is currently true for governance.
5. **Negative results matter.** Failed paths, inconclusive tests, and revoked assumptions should be first-class state objects.
6. **Humans update state, not just chat.** Human judgments should become governed variables, approvals, constraints, or revocation rules.
7. **Hard state must remain revisable.** The point is governed change, not immutability.

## Conclusion

SGAR is the state governance layer of an agent. It lets the LLM stop floating inside a self-maintained narrative and act from a recognized operational scene.

The compact thesis is:

> Without hard state, an agent has continuous output. With hard state, it can have continuous action.

For any agent expected to run over time, act in the world, recover from failure, respect commitments, pass verification, coordinate with humans or other agents, and learn from its own trajectory, hard-state governance is not an optional enhancement. It is one of the conditions under which the system becomes an agent at all.
