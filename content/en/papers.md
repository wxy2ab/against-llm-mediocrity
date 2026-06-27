---
key: papers
lang: en
path: /papers
title: Papers and Working Manuscripts
navTitle: Papers
kicker: Formalizing the framework
summary: This section collects the current manuscripts and future empirical directions related to LLM mediocrity, autoregressive extraordinary, Knowledge Governance, hard-state agent governance, governed collaboration, and cognitive discipline for AI.
order: 7
heroPoints:
  - "Main manuscript: Knowledge Governance for Large Language Model Systems."
  - "Working drafts: Structural Theory of Value Preservation, Governed LLM Object Model, Audit Engineering, State-Governed Agent Regime, Channel Governance, Capability Routing, Control-Space Search, Fitting-Boundary Mismatch, Observation-Representation Mismatch, and Human-Assist Operational Mismatches."
  - "Extensions and implementation: governed collaboration, hard-state agent governance, cognitive discipline for AI, human learning, and tooling directions derived from the research agenda."
---

## How to Enter the Deep End

The main site is the public explanation layer: intuition first, mechanism second, practice third. The papers and working manuscripts are the deeper layer, where definitions, diagnostic categories, governance objects, and research questions are developed more fully.

Suggested reading order:

1. Start with "Why It Matters" and "Cases," using the case index to build intuition from control-space governance to layered governance.
2. Read "Mechanism" and the main manuscript to understand the three regimes, six primitive mismatches, and how Knowledge Governance externalizes, validates, and reuses intermediate control knowledge.
3. Read the collaboration supplement to understand when an agent should ask a human and how to construct minimal sufficient human queries.
4. Read "State-Governed Agent Regime" to understand why long-horizon agents need hard state rather than context-maintained continuity.
5. Read "Audit Engineering" to understand how systems route post-generation failure signals back into control space and prevent regression.
6. Read "Cognitive Discipline for AI" to understand how individual users can govern emotional projection, uncontrolled abstraction, self-confirmation, and real-world feedback.
7. Use the site pages on collaboration, learning, and projects to see how the manuscripts translate into practice and implementation directions.

If you only read the site, the goal is to get an operational judgment chain. If you enter the manuscripts, the goal is to inspect the definitions, boundaries, and testability of that chain. This page connects the public explanation layer to the formal working drafts.

## Current Working Manuscripts

:::cards
### Knowledge Governance for Large Language Model Systems
Tag: main manuscript

The main manuscript introduces the three regimes: LLM mediocrity, local alignment, and autoregressive extraordinary. It explains ordinary output-space search plateaus through six primitive mismatches: aggregation, support, state, specification, fitting-boundary, and observation-representation. It then develops Knowledge Governance, Decoupled Control Spaces, and GKOs.

[Read the main manuscript](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)

### A Structural Theory of Value Preservation in LLM Systems
Tag: structural theory working draft

This working draft reframes the framework around value preservation across a world-to-output pipeline. It derives the six primitive mismatches from pipeline stations, explains repair-operator coupling and super-additive compound failure, and unifies Knowledge Governance, Audit Engineering, and State-Governed Agent Regime as mechanisms for preserving task value.

[Read the structural theory draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)

### Governed LLM Object Model and Interface Specification
Tag: implementation specification

This companion specification defines the object contracts and interface semantics for governed LLM systems. It unifies GKOs, GEOs, Audit Findings, Control Deltas, Regression Guards, Defect Ledgers, State Records, Transition Contracts, Verifier Objects, and Evidence Objects into a lifecycle for audit write-back, regression prevention, and hard-state commitment.

[Read the object model specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md)

### Audit Engineering for Governed LLM Systems
Tag: technical report

This technical report defines Audit Engineering as the loop that turns failures into durable control improvements. It covers failure localization, Audit Findings, Control Deltas, Regression Guards, Defect Ledgers, verifier authority, mismatch-specific audit patterns, anti-patterns, risk-tiered audit intensity, and audit closure criteria.

[Read the Audit Engineering technical report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.md)

### State-Governed Agent Regime for Governed LLM Systems
Tag: runtime governance working draft

This working draft defines SGAR as the runtime layer where progress is admitted only through verified hard-state transitions. It covers context demotion, state surfaces, transition contracts, verifier stratification, runtime loops, memory writes, completion governance, multi-agent permissions, rollback, revocation, and state-rendered context.

[Read the SGAR governed-systems draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.md)

### Observation-Representation Mismatch and Channel Governance in LLM Systems
Tag: channel governance technical report

This technical report develops observation-representation mismatch as the first primitive mismatch and defines channel governance as pre-governance repair for variable entry, representation ceilings, binding, provenance, freshness, authority, and operational control.

[Read the channel governance report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch-channel-governance-llm-systems.md)

### Fitting-Boundary Mismatch and Capability Routing in LLM Systems
Tag: capability routing technical report

This technical report develops fitting-boundary mismatch as a capability-routing failure: useful capabilities may fail to activate where they apply, or activate outside their true domain. It defines trigger evidence, suppressors, attractors, routing GKOs, router deltas, and boundary regression guards.

[Read the capability routing report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch-capability-routing-llm-systems.md)

### Support Mismatch and Control-Space Search in LLM Systems
Tag: control-space search technical report

This technical report develops support mismatch as a candidate-reachability failure: high-value structures may be expressible and valuable but still receive too little effective support under the deployed policy, search operator, pruning rule, recognition mechanism, and budget. It defines control-space search, support lifting, support maps, search warrants, coverage ledgers, support deltas, and support regression guards.

[Read the control-space search report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.md)

### Fitting-Boundary Mismatch
Tag: fifth primitive mismatch supplement

This working draft develops the fifth primitive mismatch: a learned capability's implicit trigger boundary may fail to match its true domain of application. It distinguishes over-triggering from under-triggering, then expands subpatterns such as evidence-chain overfitting, proxy-metric overfitting, scene-default overfitting, solution-path overfitting, role-language overfitting, alignment-preference overfitting, and user-feedback overfitting.

[Read the Fitting-Boundary supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch.md)

### Observation-Representation Mismatch
Tag: sixth primitive mismatch supplement

This working draft develops the sixth primitive mismatch: decisive world variables may be lost before they enter the model-accessible representation. It distinguishes channel insufficiency from state uncertainty and capability routing, then gives signatures and interventions such as measurement, raw evidence, tools, logs, sensors, environmental queries, and richer control representations.

[Read the Observation-Representation supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch.md)

### Human-Assist Operational Mismatches
Tag: collaboration supplement

The supplement does not add new primitive mismatches. It consolidates execution blockers into five operational domains, defines hard and expected-loss escalation gates, and develops MSHQs, GEOs, answer validation, and autonomy recovery.

[Read the technical supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.md)

### Audit Engineering
Tag: audit–write-back–governance engineering

This manuscript develops generation–verification asymmetry into an independent engineering paradigm. Candidate artifacts expose failures; an independent auditor localizes mismatch; a repair router writes findings back into the prompt, context, control space, tools, evaluator, or human-governed boundary; and regression audit prevents old defects from returning. Its concern is not the score itself, but how failure signals become explicit, actionable, and revocable control deltas.

[Read the Audit Engineering manuscript](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md)

### State-Governed Agent Regime
Tag: hard-state agent governance

This working draft names SGAR as the regime in which agent state is externalized, verifiable, recoverable, and authoritative outside the LLM context. It argues that long-horizon agents need hard state so that planning, action, observation, verification, escalation, and audit findings become governed state transitions rather than loose narrative continuity.

[Read the SGAR working draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md)

### Governed Human-AI Collaboration
Tag: public practice framework

This practice framework turns the theory into a collaboration method: AI should first query the environment, learn from feedback, and construct proving grounds. Only when the remaining variable is genuinely human-governed should it ask a minimal sufficient question.

[Read the practice framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.md)

### Cognitive Discipline for AI
Tag: cognitive framework draft

This draft turns AI use from a list of warnings into a discipline of cognition: AI is not a person but can produce personhood effects; fluency is not truth; AI tends to amplify user premises and self-confirmation; and real value must be tested through action, work, relationships, and durable judgment outside the conversation.

[Read the cognitive framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/cognitive-discipline-for-ai.md)

### The Maximum Price of Models
Tag: economics and pricing manuscript

This manuscript develops a pricing envelope for LLM products. It argues that long-run willingness to pay is bounded by reliability, residual scarcity, value capture share, and the full cost stack. It then estimates ceiling price bands across software, law, healthcare, finance, support, content, education, and research.

[Read the economics manuscript](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/maximum-price-of-llms.md)
:::

## Extensions and Implementation

::::cards
### Human Learning in the AI Era
Tag: site extension

The learning page develops the human-role shift in governed collaboration: from routine processor to governor of problem construction, value judgment, feedback, validation, authorization, and governance memory. It is the human-capability extension of the main framework.

### Open-Source Projects
Tag: implementation roadmap

The project page only organizes implementation and evaluation directions already present in the manuscripts: GKO lifecycles, GEO escalation protocols, hard-state agent ledgers, and six-mismatch diagnostics. It is not an additional theoretical claim.
::::

## Future Empirical Agenda

- Compare Knowledge Governance against strong output-space search baselines under matched compute budgets.
- Measure when generated rubrics, edge cases, state matrices, and GKOs correlate with expert judgment.
- Study positive-alignment profiles for context compression, semantic decompression, query formulation, and structured transformation.
- Measure the construal gap between noisy natural scenes and clean abstract forms.
- Compare ordinary human-agent prompting with MSHQ/GEO collaboration protocols on interruption count, answer quality, and autonomy regained.
- Evaluate whether GKO/GEO stores improve reuse without causing stale governance, over-escalation, or learned helplessness.
- Evaluate whether SGAR-style hard state reduces false completion, state drift, unrecoverable interruptions, and unauditable action loops in long-horizon agents.

## Project Status

These drafts are research frameworks and an open-source agenda, not a closed theory. Their goal is to provide a language that can be debated, implemented, and tested: when LLMs become mediocre, when they become extraordinary, and how people and systems can turn local capability into stable task value.
