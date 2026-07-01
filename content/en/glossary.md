---
key: glossary
lang: en
path: /glossary
title: Glossary
navTitle: Glossary
kicker: A linkable map of the core terms used across the site
summary: This page gathers the core concepts used across Against LLM Mediocrity, explains what each one means, why it matters, and where it comes from.
order: 99
showInNav: false
---

## How to Use This Page

This page is not arranged by paper order. It is arranged as a term map for the concepts readers encounter most often. Use it as a quick reference: read the one-line definition first, then the fuller explanation, source chain, and related terms.

If you arrived here from another page, it usually makes sense to jump straight to the linked term. If you want the global picture first, read in this order:

- [Alignment regimes](#alignment-regimes)
- [Primitive mismatches](#primitive-mismatches)
- [Governance objects](#governance-objects)
- [Engineering and collaboration](#engineering-and-collaboration)

## Alignment Regimes

<a id="alignment-regimes"></a>

<a id="llm-mediocrity"></a>
### LLM Mediocrity

**One-line definition**: the regime where the model's easiest continuation direction is structurally misaligned with the direction of real task value.

**Full explanation**: LLM mediocrity does not mean the model is useless. It means that on this class of tasks, more sampling, polishing, or elaboration mainly makes the answer smoother, fuller, and more plausible without reaching the structure that actually decides success. The model is not failing because it can do nothing; it is failing because default generation is pulled toward high-probability, familiar, locally improvable patterns while true value depends on hidden state, global structure, rare solutions, real specifications, or external verification.

**Why it matters**: the term gives a name to a common but vague experience: "the answer keeps getting better on the surface, but it is still wrong." Once a task is recognized as LLM mediocrity, the next move is no longer endless prompt refinement but task redesign.

**Source chain**:

- First full statement: [Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)
- Current structural statement: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Site-side overview: [Mechanism](../framework)

**Related terms**: [local alignment](#local-alignment) · [LLM excellence](#llm-excellence) · [six primitive mismatches](#six-primitive-mismatches)

<a id="local-alignment"></a>
### Local Alignment

**One-line definition**: the regime where the model's local operations align with part of task value, but that local fit does not carry the whole task.

**Full explanation**: local alignment is the most common practical regime. The model can often summarize, rewrite, enumerate, compare, outline, format, and locally repair in genuinely useful ways. But global success still depends on variables that local continuation does not automatically preserve: the real objective, long-range dependency, hidden state, external evidence, or responsibility boundaries. Local alignment explains why LLMs can feel highly useful and still fail at decisive points.

**Why it matters**: the useful question stops being "should we use AI here?" and becomes "which parts are already locally aligned and can be delegated directly, and which parts still need control objects, validators, human variables, or hard state?"

**Source chain**:

- First full statement: [Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)
- Current structural statement: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Site-side overview: [Home](../) · [Mechanism](../framework)

**Related terms**: [LLM mediocrity](#llm-mediocrity) · [LLM excellence](#llm-excellence) · [knowledge governance](#knowledge-governance)

<a id="llm-excellence"></a>
### LLM Excellence

**One-line definition**: the regime where the model's natural continuation direction reliably tracks task value, so autoregression becomes an advantage rather than a liability.

**Full explanation**: in the LLM excellence regime, the model does not need to be forcibly dragged away from its default path, because the default path is already near the high-value region. Context compression, semantic expansion, structured transformation, format transfer, and many common rendering tasks often live here. The key point is not merely that "the model is strong." It is that task structure, representation, and success criteria are aligned with the model's learned continuation bias.

**Why it matters**: it prevents over-governing tasks that already fit the model well. When a task already sits in LLM excellence, direct generation plus light validation is often enough.

**Source chain**:

- Theoretical background: [Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)
- Current structural statement: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Site-side overview: [Home](../) · [Why It Matters](../science)

**Related terms**: [LLM mediocrity](#llm-mediocrity) · [local alignment](#local-alignment)

## Primitive Mismatches

<a id="primitive-mismatches"></a>

<a id="six-primitive-mismatches"></a>
### Six Primitive Mismatches

**One-line definition**: a diagnostic taxonomy derived from the value-preservation pipeline, naming the structural stations where task value can fall out of the system.

**Full explanation**: the six primitive mismatches are not surface labels for failure. They answer a stricter question: why does ordinary output-space search plateau? Each mismatch corresponds to a different structural break in the value-preservation chain, so each one implies a different repair target. Their value lies not in naming but in forcing diagnosis to imply intervention rather than sending every failure back to the same "try more versions" loop.

**Why it matters**: without this layer, many failures collapse into the vague phrase "the model is not strong enough yet." With it, search, validation, state governance, objective governance, channel repair, and compositional governance become clearly separable engineering moves.

**Source chain**:

- Structural derivation: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Taxonomy overview: [Six Primitive Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)
- Repair mapping: [Diagnostic-Mechanism Bridge](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.md)

**Related terms**: [aggregation mismatch](#aggregation-mismatch) · [support mismatch](#support-mismatch) · [state mismatch](#state-mismatch) · [specification mismatch](#specification-mismatch) · [fitting-boundary mismatch](#fitting-boundary-mismatch) · [observation-representation mismatch](#observation-representation-mismatch)

<a id="aggregation-mismatch"></a>
### Aggregation Mismatch

**One-line definition**: locally good parts fail to compose into a globally valuable whole.

**Full explanation**: aggregation mismatch is the most familiar structural location of autoregressive mediocrity. The model may make every paragraph sound good and every component look plausible, yet the task value depends on cross-part constraints, long-range dependency, or a governing tradeoff that never becomes explicit. Stories lose setup-payoff structure, code breaks cross-module invariants, and proposals miss the real decisive tradeoff.

**Why it matters**: it reframes the problem from "which paragraph is weak?" to "which global relationship was never represented or governed?" The usual repair is not finer polish but dependency graphs, global invariants, compositional validators, and structured control objects.

**Source chain**:

- Theoretical background: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Dedicated report: [Aggregation Mismatch and Compositional Governance](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.md)
- Site-side overview: [Mechanism](../framework)

**Related terms**: [six primitive mismatches](#six-primitive-mismatches) · [LLM mediocrity](#llm-mediocrity)

<a id="support-mismatch"></a>
### Support Mismatch

**One-line definition**: high-value structure sits in a low-probability, low-support, or currently unreachable region of search.

**Full explanation**: support mismatch does not mean the answer does not exist. It means direct sampling almost never reaches it. The system may occasionally recognize the right structure without reliably generating it. Valuable solutions may depend on low-salience evidence, rare frames, non-obvious candidates, or intermediate structure search that default continuation rarely visits.

**Why it matters**: once the problem is recognized as support mismatch, the question changes from "how do we make the model write more?" to "how do we bring tail structure into context or control space?" That typically means retrieval, perturbation, counterexamples, recombination, candidate expansion, and structured search.

**Source chain**:

- Theoretical background: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Dedicated report: [Support Mismatch and Control-Space Search](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.md)
- Taxonomy overview: [Six Primitive Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)

**Related terms**: [six primitive mismatches](#six-primitive-mismatches) · [knowledge governance](#knowledge-governance)

<a id="state-mismatch"></a>
### State Mismatch

**One-line definition**: the correct action depends on hidden, changing, or unstated state that the current representation cannot reliably disambiguate.

**Full explanation**: state mismatch happens when the same answer flips value across conditions. User mood, market regime, deployment status, legal jurisdiction, authority boundary, and time window can all reverse what the right action is. If the current representation cannot distinguish those states, the model treats a condition-sensitive problem as if it were a single stable one.

**Why it matters**: it shows that the repair target is not better prose but state discrimination, state enumeration, conditional policy, and state authority. For long-horizon agents, it also explains why chat context alone is not enough to hold runtime state.

**Source chain**:

- Theoretical background: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Dedicated report: [State Mismatch and State Governance](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-mismatch-state-governance-llm-systems.md)
- Runtime regime report: [State-Governed Agent Regime for Governed LLM Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.md)

**Related terms**: [SGAR](#sgar) · [six primitive mismatches](#six-primitive-mismatches)

<a id="specification-mismatch"></a>
### Specification Mismatch

**One-line definition**: the accessible proxy objective diverges from the task's real success criterion.

**Full explanation**: specification mismatch is the regime of succeeding at the wrong target. The output may satisfy the prompt, rubric, style requirement, or benchmark while failing the real value function. What the user needs is something executable, verifiable, authorizable, and consequence-bearing; what the system optimizes may be only what looks complete or professional.

**Why it matters**: it forces the real objective to be externalized rather than guessed. Counterexamples, acceptance criteria, stakeholder ordering, rejection examples, and objective governance all originate here.

**Source chain**:

- Theoretical background: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Dedicated report: [Specification Mismatch and Objective Governance](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/specification-mismatch-objective-governance-llm-systems.md)
- Taxonomy overview: [Six Primitive Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)

**Related terms**: [knowledge governance](#knowledge-governance) · [audit engineering](#audit-engineering)

<a id="fitting-boundary-mismatch"></a>
### Fitting-Boundary Mismatch

**One-line definition**: the activation boundary of a learned capability does not match the boundary of where that capability truly applies.

**Full explanation**: fitting-boundary mismatch includes both over-triggering and under-triggering. The model may perform an operation when explicitly told to do so but fail to activate it when needed, or it may overgeneralize a local pattern, role script, evidence chain, or feedback signal into neighboring cases where it no longer fits. The problem is not lack of knowledge but lack of routing discipline.

**Why it matters**: it reframes many "why did the model suddenly stop being reliable?" failures as boundary-governance problems. The repair is usually not more facts but trigger-condition audit, neighborhood perturbation, and applicability testing.

**Source chain**:

- Theoretical background: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Dedicated report: [Fitting-Boundary Mismatch and Capability Routing](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch-capability-routing-llm-systems.md)
- Earlier supplement: [Fitting-Boundary Mismatch Supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch.md)

**Related terms**: [six primitive mismatches](#six-primitive-mismatches) · [knowledge governance](#knowledge-governance)

<a id="observation-representation-mismatch"></a>
### Observation-Representation Mismatch

**One-line definition**: the world variable that actually decides success never enters the model's operational representation in a task-sufficient form.

**Full explanation**: the model may reason very well over what it sees, but if the decisive variable was dropped, compressed, aliased, or hidden before it entered representation, a longer reasoning chain only works over the wrong coordinates. Missing logs, missing sensor data, absent tools, over-compressed summaries, and variables that never reach context are all instances of observation-representation mismatch.

**Why it matters**: it corrects the common mistake of treating the problem as insufficient reasoning when the real repair is channel repair. Measurement, raw evidence access, tool integration, environment querying, and representation redesign often matter more than more thinking.

**Source chain**:

- Theoretical background: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Dedicated report: [Observation-Representation Mismatch and Channel Governance](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch-channel-governance-llm-systems.md)
- Earlier supplement: [Observation-Representation Mismatch Supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch.md)

**Related terms**: [six primitive mismatches](#six-primitive-mismatches) · [state mismatch](#state-mismatch)

## Governance Objects

<a id="governance-objects"></a>

<a id="knowledge-governance"></a>
### Knowledge Governance

**One-line definition**: separating task-specific, verified, reusable control knowledge from generation and governing it as independent objects.

**Full explanation**: knowledge governance is not about making the model "remember more." It is about extracting the control knowledge that actually matters for success from one-off fluent outputs and storing it as something verifiable, revocable, reusable, and conflict-manageable. Downstream generation then starts from governed state rather than from default model probability alone.

**Why it matters**: it is the key move that turns local alignment into durable engineering gain. Without knowledge governance, the system keeps "thinking from scratch." With it, the system accumulates judgments that real tasks have already validated.

**Source chain**:

- First full statement: [Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)
- Current structural statement: [Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)
- Implementation specification: [Governed LLM Object Model and Interface Specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md)

**Related terms**: [GKO](#gko) · [GExO](#gexo) · [GEsO](#geo) · [audit engineering](#audit-engineering)

<a id="gko"></a>
### Governed Knowledge Object (GKO)

**One-line definition**: the smallest governed unit that stores task-specific control knowledge.

**Full explanation**: a GKO is not an ordinary note and not just a prompt fragment. It stores already-validated control knowledge together with the conditions, priorities, conflicts, lifecycles, and revocation rules that determine when the knowledge still applies. The point of a GKO is to turn "what should be known" into a governable object that can be composed, checked, and audited.

**Why it matters**: it lets a system start from governed knowledge instead of re-inventing the same rule in natural language every time. It is the core object-level carrier of knowledge governance.

**Source chain**:

- Theoretical origin: [Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)
- Current specification: [Governed LLM Object Model and Interface Specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md)
- Site-side overview: [Governance](../engineering)

**Related terms**: [knowledge governance](#knowledge-governance) · [GExO](#gexo) · [GEsO](#geo) · [MSHQ](#mshq)

<a id="gexo"></a>
### Governed Execution Object (GExO)

**One-line definition**: a governed object that tracks a task, plan, action, handoff, or workflow item whose execution must be explicitly controlled.

**Full explanation**: a GExO carries execution-side authority. It defines what an execution unit is trying to accomplish, what inputs and outputs matter, what counts as success or failure, who may act, which actions are allowed or forbidden, and which governed knowledge, verifiers, or transition contracts must be satisfied before progress is committed. It is the execution-side counterpart to a GKO.

**Why it matters**: it prevents execution from remaining an implicit narrative. Long-horizon work becomes inspectable, governable, and auditable as an explicit object rather than as a loose plan in chat history.

**Source chain**:

- Current specification: [Governed LLM Object Model and Interface Specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md)
- Site-side overview: [Governance](../engineering)

**Related terms**: [GKO](#gko) · [GEsO](#geo) · [SGAR](#sgar)

<a id="geso"></a>
<a id="geo"></a>
### Governed Escalation Object (GEsO)

**One-line definition**: an object that stores when the system should ask a human, what it should ask, whom it should ask, and what it can still do while waiting.

**Full explanation**: a GEsO governs the asking itself. It is not an ad hoc interruption. It objectifies the trigger condition, minimal question, default path, human role, risk level, reversible work while waiting, and revocation conditions. This prevents the system from reacting to uncertainty with either blind action or by handing the whole task back to the human.

**Why it matters**: it turns human intervention from a one-off interruption into a reusable, auditable, evolvable protocol. For long-horizon agents, GEsOs are tools for restoring autonomy rather than abandoning it.

**Source chain**:

- Collaboration origin: [Governed Human-AI Collaboration](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.md)
- Technical supplement: [Human-Assist Operational Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.md)
- Site-side overview: [Collaboration](../collaboration)

**Related terms**: [MSHQ](#mshq) · [GKO](#gko) · [GExO](#gexo) · [SGAR](#sgar)

<a id="mshq"></a>
### Minimal Sufficient Human Query (MSHQ)

**One-line definition**: the smallest human question that can restore autonomous progress in a concrete interaction.

**Full explanation**: an MSHQ is one concrete instantiation of a GEsO. A good MSHQ does not ask "what should I do now?" It isolates the one still-human-governed variable whose answer would unblock the task. It usually offers a small option set, explains what each answer changes, states a default path, and avoids handing the whole task back to the human.

**Why it matters**: it compresses human-AI collaboration from long low-signal dialogue into minimal intervention on a decisive variable. Humans fill only the part AI cannot reliably supply; AI resumes autonomous work once the answer arrives.

**Source chain**:

- Collaboration origin: [Governed Human-AI Collaboration](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.md)
- Technical supplement: [Human-Assist Operational Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.md)
- Site-side overview: [Collaboration](../collaboration)

**Related terms**: [GEsO](#geo) · [SGAR](#sgar) · [governed human-AI collaboration](#governed-human-ai-collaboration)

## Engineering and Collaboration

<a id="engineering-and-collaboration"></a>

<a id="audit-engineering"></a>
### Audit Engineering

**One-line definition**: treating audit as an independent engineering layer that localizes failure, selects repair routes, and writes results back into control objects.

**Full explanation**: audit engineering does not treat audit as a score applied after generation. It treats failure localization, counterexample construction, evidence capture, repair routing, control deltas, and regression verification as an independent system. Generators produce candidates; audit answers "why did this fail, what should change, and how do we stop it from recurring?" In this way each failure can become actionable repair rather than commentary.

**Why it matters**: without audit engineering, failure becomes only emotional memory for the next prompt. With it, failure becomes a replayable, writable, verifiable control increment.

**Source chain**:

- Earlier engineering note: [Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md)
- Current technical report: [Audit Engineering for Governed LLM Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.md)
- Routing supplement: [Oracle Classification, Audit Agent, and SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.md)

**Related terms**: [knowledge governance](#knowledge-governance) · [SGAR](#sgar) · [specification mismatch](#specification-mismatch)

<a id="sgar"></a>
### State-Governed Agent Regime (SGAR)

**One-line definition**: a runtime regime that organizes long-horizon plans, actions, verification, escalation, and audit findings as governed hard-state transitions.

**Full explanation**: SGAR starts from one core judgment: context is not state. If task progress exists only inside chat history, then plans, tool calls, verification results, human answers, and rollback conditions have no authoritative carrier. SGAR moves those objects into an external hard-state layer so the agent advances on recognized, verifiable, recoverable state rather than on a self-narrated sense of progress.

**Why it matters**: it provides the runtime governance foundation for long-horizon agents. Without SGAR, complex agent failures often appear as drift, skipped steps, false completion, and poor recoverability. With SGAR, completion must be supported by transitions and evidence.

**Source chain**:

- Earlier draft: [State-Governed Agent Regime](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md)
- Current main statement: [State-Governed Agent Regime for Governed LLM Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.md)
- Routing supplement: [Oracle Classification, Audit Agent, and SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.md)

**Related terms**: [state mismatch](#state-mismatch) · [GEsO](#geo) · [audit engineering](#audit-engineering)

<a id="governed-human-ai-collaboration"></a>
### Governed Human-AI Collaboration

**One-line definition**: organizing AI-human collaboration around control variables rather than around a coarse task split.

**Full explanation**: governed human-AI collaboration does not ask "which tasks belong to AI and which belong to humans?" It asks "which variables can AI process, search, and validate, and which variables require human judgment?" AI should ask the environment, tools, and validators first; only when a genuinely human-governed variable remains should it escalate with an MSHQ or GEsO. Humans are no longer the default processors of the whole task, but the governors of value, authority, preference, taste, responsibility, and boundaries.

**Why it matters**: it gives a more precise answer to what humans should do in an AI workflow. Rather than being pushed down into low-value proofreading, humans move up to governing the variables that probability alone cannot replace.

**Source chain**:

- Main collaboration statement: [Governed Human-AI Collaboration](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.md)
- Technical supplement: [Human-Assist Operational Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.md)
- Site-side overview: [Collaboration](../collaboration)

**Related terms**: [GEsO](#geo) · [MSHQ](#mshq) · [SGAR](#sgar)
