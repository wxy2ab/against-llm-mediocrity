---
key: papers
lang: en
path: /papers
title: Papers and Working Manuscripts
navTitle: Working drafts
kicker: Formalizing the framework
summary: This section collects the current manuscripts and future empirical directions related to LLM mediocrity, autoregressive extraordinary, Knowledge Governance, hard-state agent governance, governed collaboration, and cognitive discipline for AI.
order: 7
heroPoints:
  - "Current synthesis: Structural Theory of Value Preservation and Six Primitive Mismatches."
  - "Working drafts: Formal Mechanism Layer for Governed LLM Systems, Diagnostic-Mechanism Bridge, Mechanism-Driven Training, Governed LLM Object Model, Audit Engineering, Oracle Classification and Engine Routing, State-Governed Agent Regime, Channel Governance, State Governance, Capability Routing, Control-Space Search, Compositional Governance, Objective Governance, and Human-Assist Operational Mismatches."
  - "Extensions and implementation: governed collaboration, hard-state agent governance, cognitive discipline for AI, human learning, and tooling directions derived from the research agenda."
---

## How to Enter the Deep End

The main site is the public explanation layer: intuition first, mechanism second, practice third. The papers and working manuscripts are the deeper layer, where definitions, diagnostic categories, governance objects, and research questions are developed more fully.

Suggested reading order:

1. Start with "Why It Matters" and "Cases," using the case index to build intuition from control-space governance to layered governance.
2. Read "Mechanism," the structural theory draft, and the six-mismatch taxonomy to understand the value-preservation pipeline and how governed control objects preserve task value.
3. Read the collaboration supplement to understand when an agent should ask a human and how to construct minimal sufficient human queries.
4. Read "State-Governed Agent Regime" to understand why long-horizon agents need hard state rather than context-maintained continuity.
5. Read "Audit Engineering" to understand how systems route post-generation failure signals back into control space and prevent regression.
6. Read "Cognitive Discipline for AI" to understand how individual users can govern emotional projection, uncontrolled abstraction, self-confirmation, and real-world feedback.
7. Use the site pages on collaboration, learning, and projects to see how the manuscripts translate into practice and implementation directions.

**If you only read the site, the goal is to get an operational judgment chain. If you enter the manuscripts, the goal is to inspect the definitions, boundaries, and testability of that chain.** This page connects the public explanation layer to the formal working drafts.

## Current Working Manuscripts

:::cards
### A Structural Theory of Value Preservation in LLM Systems
Tag: structural theory working draft

This working draft reframes the framework around value preservation across a world-to-output pipeline. It derives the six primitive mismatches from pipeline stations, explains repair-operator coupling and super-additive compound failure, and unifies Knowledge Governance, Audit Engineering, and State-Governed Agent Regime as mechanisms for preserving task value.

[Read the structural theory draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)

### Six Primitive Mismatches in LLM Systems
Tag: pipeline-derived taxonomy working draft

This working draft consolidates the six primitive mismatches into one pipeline-derived taxonomy. It derives observation-representation, state, fitting-boundary, support, aggregation, and specification mismatch as distinct value-preservation failure stations, then maps each to diagnostic questions, repair targets, audit findings, control deltas, GKOs, regression guards, and SGAR commitments.

[Read the six-mismatch taxonomy](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)

### Formal Mechanism Layer for Governed LLM Systems
Tag: intervention-localization working draft

This working draft defines the formal mechanism layer for governed LLM systems. It decomposes repair localization into eight intervenable axes, treats diagnosis as mechanism profiles rather than forced single labels, and shows how mechanism-level localization integrates with Audit Engineering, Control Deltas, Regression Guards, Defect Ledgers, and SGAR hard-state transitions.

[Read the governed-systems formal mechanism layer](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer-for-governed-llm-systems.md)

### Diagnostic-Mechanism Bridge for Governed LLM Systems
Tag: diagnostic bridge working draft

This working draft connects the six primitive mismatches to the eight mechanism axes. It defines the bridge from value-failure diagnosis to repair localization through mechanism profiles, repair-layer selection, audit write-back, governed objects, SGAR commitment, and mechanism-driven training promotion.

[Read the diagnostic-mechanism bridge](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.md)

### Mechanism-Driven Training for Governed LLM Systems
Tag: training-side governance working draft

This working draft defines the training-side counterpart to runtime governance. It explains when recurrent failures should stop being handled as runtime patches and instead be promoted into mechanism-specific training interventions such as representation training, boundary data, grounding data, reward correction, and capability-support training.

[Read the mechanism-driven training draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/mechanism-driven-training-for-governed-llm-systems.md)

### Governed LLM Object Model and Interface Specification
Tag: implementation specification

This companion specification defines the object contracts and interface semantics for governed LLM systems. It unifies GKOs, GEOs, Audit Findings, Control Deltas, Regression Guards, Defect Ledgers, State Records, Transition Contracts, Verifier Objects, and Evidence Objects into a lifecycle for audit write-back, regression prevention, and hard-state commitment.

[Read the object model specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md)

### Audit Engineering for Governed LLM Systems
Tag: technical report

This technical report defines Audit Engineering as the loop that turns failures into durable control improvements. It covers failure localization, Audit Findings, Control Deltas, Regression Guards, Defect Ledgers, verifier authority, mismatch-specific audit patterns, anti-patterns, risk-tiered audit intensity, and audit closure criteria.

[Read the Audit Engineering technical report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.md)

### Oracle, Audit Agent, and SGAR
Tag: oracle routing working draft

This working draft unifies audit, SGAR, gate hardening, and No-Go into a single oracle-classification and engine-routing framework. It explains when systems should use high-bandwidth failure localization, when they should rely on high-fidelity boundary gates, and when honest progress requires acquiring a new fidelity source instead of iterating blindly.

[Read the oracle-classification and engine-routing draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.md)

### State-Governed Agent Regime for Governed LLM Systems
Tag: runtime governance working draft

This working draft defines SGAR as the runtime layer where progress is admitted only through verified hard-state transitions. It covers context demotion, state surfaces, transition contracts, verifier stratification, runtime loops, memory writes, completion governance, multi-agent permissions, rollback, revocation, and state-rendered context.

[Read the SGAR governed-systems draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.md)

### Observation-Representation Mismatch and Channel Governance in LLM Systems
Tag: channel governance technical report

This technical report develops observation-representation mismatch as the first primitive mismatch and defines channel governance as pre-governance repair for variable entry, representation ceilings, binding, provenance, freshness, authority, and operational control.

[Read the channel governance report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch-channel-governance-llm-systems.md)

### State Mismatch and State Governance in LLM Systems
Tag: state governance technical report

This technical report develops state mismatch as the second primitive mismatch: the system acts as if the relevant latent task state is known when multiple states remain plausible and action value changes across them. It defines state hypotheses, evidence binding, discriminators, belief records, state-conditioned policies, transition guards, state regression guards, and SGAR integration rules.

[Read the state governance report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-mismatch-state-governance-llm-systems.md)

### Fitting-Boundary Mismatch and Capability Routing in LLM Systems
Tag: capability routing technical report

This technical report develops fitting-boundary mismatch as a capability-routing failure: useful capabilities may fail to activate where they apply, or activate outside their true domain. It defines trigger evidence, suppressors, attractors, routing GKOs, router deltas, and boundary regression guards.

[Read the capability routing report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch-capability-routing-llm-systems.md)

### Support Mismatch and Control-Space Search in LLM Systems
Tag: control-space search technical report

This technical report develops support mismatch as a candidate-reachability failure: high-value structures may be expressible and valuable but still receive too little effective support under the deployed policy, search operator, pruning rule, recognition mechanism, and budget. It defines control-space search, support lifting, support maps, search warrants, coverage ledgers, support deltas, and support regression guards.

[Read the control-space search report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.md)

### Aggregation Mismatch and Compositional Governance in LLM Systems
Tag: compositional governance technical report

This technical report develops aggregation mismatch as a local-to-global composition failure: locally plausible parts may fail to preserve global utility under the composition operator. It defines compositional governance through dependency graphs, interface contracts, invariant registries, binding records, claim-support maps, integration ledgers, and composition audits.

[Read the compositional governance report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.md)

### Specification Mismatch and Objective Governance in LLM Systems
Tag: objective governance technical report

This technical report develops specification mismatch as an objective-preservation failure: the accessible proxy objective may diverge from true task utility even when observation, state, routing, support, and aggregation are adequate. It defines Objective Governance through scoped objective objects, proxy-risk audits, priority rules, verifier contracts, specification audits, control deltas, and regression guards.

[Read the objective governance report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/specification-mismatch-objective-governance-llm-systems.md)

### Human-Assist Operational Mismatches
Tag: collaboration supplement

The supplement does not add new primitive mismatches. It consolidates execution blockers into five operational domains, defines hard and expected-loss escalation gates, and develops MSHQs, GEOs, answer validation, and autonomy recovery.

[Read the technical supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.md)

### Governed Human-AI Collaboration
Tag: public practice framework

This practice framework turns the theory into a collaboration method: AI should first query the environment, learn from feedback, and construct proving grounds. Only when the remaining variable is genuinely human-governed should it ask a minimal sufficient question.

[Read the practice framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.md)

### Cognitive Discipline for AI
Tag: cognitive framework draft

This draft turns AI use from a list of warnings into a discipline of cognition: AI is not a person but can produce personhood effects; fluency is not truth; AI tends to amplify user premises and self-confirmation; and real value must be tested through action, work, relationships, and durable judgment outside the conversation.

[Read the cognitive framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/cognitive-discipline-for-ai.md)

### AI Collaborative Posture: Calibrated Friction and Constructive Firmness
Tag: collaboration posture working draft

This working draft develops the AI-side dual of cognitive discipline. Instead of maximizing compliance, AI should protect the human judgment loop through calibrated friction and constructive firmness: be firm where hard oracles exist, defer where human-governed variables dominate, install gates before irreversible actions, and preserve human generative labor in learning and judgment tasks.

[Read the collaboration posture draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/ai-collaborative-posture-calibrated-friction-constructive-firmness.md)

### The Maximum Price of Models
Tag: economics and pricing manuscript

This manuscript develops a pricing envelope for LLM products. It argues that long-run willingness to pay is bounded by reliability, residual scarcity, value capture share, and the full cost stack. It then estimates ceiling price bands across software, law, healthcare, finance, support, content, education, and research.

[Read the economics manuscript](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/maximum-price-of-llms.md)
:::

## Legacy Versions

:::cards
### A Formal Mechanism Layer for LLM Failure
Tag: legacy intervention-localization draft

This earlier mechanism-layer draft introduced the eight intervenable components as a companion to the earlier manuscript stack. The current governed-systems version is the formal mechanism layer draft in the current working manuscripts section above.

[Read the legacy formal mechanism layer](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer.md)

### Knowledge Governance for Large Language Model Systems
Tag: legacy main manuscript

This earlier manuscript introduced the three regimes, the first six-mismatch framing, Knowledge Governance, Decoupled Control Spaces, and GKOs. The current synthesis is now represented by the structural theory, six-mismatch taxonomy, object model, and governed-systems technical reports above.

[Read the legacy main manuscript](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)

### Observation-Representation Mismatch
Tag: legacy primitive-mismatch supplement

This earlier supplement develops observation-representation mismatch as a standalone primitive mismatch. The current version is the channel governance report in the current working manuscripts section.

[Read the legacy observation-representation supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch.md)

### Fitting-Boundary Mismatch
Tag: legacy primitive-mismatch supplement

This earlier supplement develops fitting-boundary mismatch as a standalone primitive mismatch. The current version is the capability routing report in the current working manuscripts section.

[Read the legacy fitting-boundary supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch.md)

### Audit Engineering
Tag: legacy audit manuscript

This earlier manuscript develops audit-write-back governance from generation-verification asymmetry. The current version is the governed-systems Audit Engineering technical report above.

[Read the legacy Audit Engineering manuscript](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md)

### State-Governed Agent Regime
Tag: legacy hard-state agent governance draft

This earlier SGAR draft names hard-state agent governance. The current version is the governed-systems SGAR working draft above.

[Read the legacy SGAR draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md)
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
