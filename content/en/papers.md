---
key: papers
lang: en
path: /papers
title: Papers and Working Manuscripts
navTitle: Working drafts
kicker: Formalizing the framework
summary: This section collects the current manuscripts and future empirical directions related to LLM mediocrity, autoregressive extraordinary, the discovery path of the six primitive mismatches, Knowledge Governance, hard-state agent governance, governed collaboration, and cognitive discipline for AI.
order: 7
heroPoints:
  - "Current synthesis: Structural Theory of Value Preservation, Six Primitive Mismatches, and the discovery-path draft on how the six mismatches were forced out of engineering practice."
  - "Working drafts: Formal Mechanism Layer for Governed LLM Systems, Diagnostic-Mechanism Bridge, Mechanism-Driven Training, Governed LLM Object Model, Audit Engineering, Oracle Classification and Engine Routing, State-Governed Agent Regime, Governed Delegation, Agent Harness Framework, multi-scale aggregation mismatch, Channel Governance, State Governance, Capability Routing, Control-Space Search, Compositional Governance, Objective Governance, and Human-Assist Operational Mismatches."
  - "Extensions and implementation: governed collaboration, hard-state agent governance, cognitive discipline for AI, human learning, and tooling directions derived from the research agenda."
---

This page is the index to the project's formal writing. It lists the current working manuscripts, the legacy versions they replace, the site extensions that put the theory into practice, and the empirical questions still open. Use it to find the right document and to see how the public site connects to the formal drafts.

## Document Map

The main site is the public explanation layer: intuition first, mechanism second, practice third. The papers and working manuscripts are the formal layer, where concepts, diagnostic categories, governance objects, runtime regimes, and research questions are written in a form that can be cited, compared, and extended.

So this section is not just a reading order. It is a five-layer document map: which role each manuscript plays in the framework, and how the documents connect to one another.

:::document-map
### Core Theory Layer
Tag: explain why failure appears

**Role**: explain why LLM mediocrity, local alignment, and value-preservation failure appear in the first place.

**Corresponding documents**: [A Structural Theory of Value Preservation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md), [Six Primitive Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)

### Diagnostic-Mechanism Layer
Tag: localize what failed

**Role**: localize failure to pipeline stations, mechanism axes, and repair layers, so the question becomes not just "what failed?" but "where did it fail, and which repair layer should own it?"

**Corresponding documents**: [Formal Mechanism Layer](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/formal-mechanism-layer-for-governed-llm-systems.md), [Diagnostic-Mechanism Bridge](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.md), [Mechanism-Driven Training](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/mechanism-driven-training-for-governed-llm-systems.md)

### Governance-Object Layer
Tag: write control as objects

**Role**: define GKO, GExO, GEsO, Audit Finding, Control Delta, Regression Guard, State Record, and related objects so governance becomes a set of explicit, writeable, checkable entities rather than only principles.

**Corresponding documents**: [Object Model and Interface Specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md), [Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.md)

### Runtime Layer
Tag: commit progress into hard state

**Role**: explain how agent progress enters hard state, and which actions count as real progress only after gating, audit, and verified state transition.

**Corresponding documents**: [An Agent Is Not a Longer Chat](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-is-not-a-longer-chat.md), [SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.md), [Governed Delegation](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/from-fixed-workflows-to-governed-delegation.md), [Oracle / Audit / SGAR routing](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.md), [Agent Harness Framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-harness-framework.md), [Aggregation mismatch across scales](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.md), [V1–V25 evidence synthesis](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v1-v25-and-supplementary-experiments.md), [Step versus Stage iteration evidence](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v18-v19-step-vs-stage-iteration.md)

### Human Collaboration Layer
Tag: ask humans only where humans must govern

**Role**: define which variables must remain human-governed and how to minimize interruption while still letting AI resume autonomous progress after the answer arrives.

**Corresponding documents**: [Human-Assist Operational Mismatches](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.md), [Governed Human-AI Collaboration](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.md), [Cognitive Discipline for AI](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/cognitive-discipline-for-ai.md), [AI Collaborative Posture](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/ai-collaborative-posture-calibrated-friction-constructive-firmness.md)
:::

**If you only read the site, the goal is to get an operational judgment chain. If you enter the manuscripts, the goal is to inspect how these five layers define the problem, localize failure, carry governance, commit state, and organize collaboration.** This page connects the public explanation layer and the formal manuscripts inside one map.

## Current Working Manuscripts

:::paper-docs
### A Structural Theory of Value Preservation in LLM Systems
Tag: structural theory working draft

This working draft reframes the framework around value preservation across a world-to-output pipeline. It derives the six primitive mismatches from pipeline stations and explains repair-operator coupling and super-additive compound failure. It then unifies Knowledge Governance, Audit Engineering, and the State-Governed Agent Regime as mechanisms for preserving task value.

[Read the structural theory draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.md)

### Six Primitive Mismatches in LLM Systems
Tag: pipeline-derived taxonomy working draft

This working draft consolidates the six primitive mismatches into one pipeline-derived taxonomy. It derives observation-representation, state, fitting-boundary, support, aggregation, and specification mismatch as distinct value-preservation failure stations. It then maps each one to diagnostic questions, repair targets, audit findings, control deltas, Governed Knowledge Objects (GKOs), regression guards, and SGAR commitments.

[Read the six-mismatch taxonomy](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)

### Engineering Origins of the Six Primitive Mismatches
Tag: discovery-path working draft

This working draft starts from the discovery path rather than the final definitions. It records how the six primitive mismatches were forced out of repeated engineering friction in large-scale quant sampling, attempts to resist autoregressive gravity, story-generation reproduction, finance tasks, and everyday hard problem solving. It is the practice-first companion to the formal taxonomy.

[Read the engineering-origins draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/engineering-origins-of-six-primitive-mismatches.md)

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

This companion specification defines the object contracts and interface semantics for governed LLM systems. It unifies GKOs, Governed Execution Objects (GExOs), Audit Findings, Control Deltas, Regression Guards, Defect Ledgers, State Records, Transition Contracts, Verifier Objects, and Evidence Objects into a lifecycle for audit write-back, regression prevention, and hard-state commitment.

[Read the object model specification](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.md)

### Audit Engineering for Governed LLM Systems
Tag: technical report

This technical report defines Audit Engineering as the loop that turns failures into durable control improvements. It covers failure localization, Audit Findings, Control Deltas, Regression Guards, Defect Ledgers, verifier authority, mismatch-specific audit patterns, anti-patterns, risk-tiered audit intensity, and audit closure criteria.

[Read the Audit Engineering technical report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.md)

### Oracle, Audit Agent, and SGAR
Tag: oracle routing working draft

This working draft unifies audit, SGAR, gate hardening, and No-Go into a single oracle-classification and engine-routing framework. It explains when systems should use high-bandwidth failure localization, when they should rely on high-fidelity boundary gates, and when honest progress requires acquiring a new fidelity source instead of iterating blindly.

[Read the oracle-classification and engine-routing draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.md)

### An Agent Is Not a Longer Chat
Tag: practitioner-oriented agent architecture

This bilingual article explains the authority boundary between Chat, Bot, and Agent systems for ordinary practitioners. It corrects the overly broad claim that an LLM cannot be first-class: the LLM can remain a first-class capability, but not the sole highest task authority. It then gives a risk-proportional design, a seven-object minimum governance stack, and a concrete code-repair transition.

[Read the article: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-is-not-a-longer-chat.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-is-not-a-longer-chat.zh-CN.md)

### State-Governed Agent Regime for Governed LLM Systems
Tag: runtime governance working draft

This working draft defines SGAR as the runtime layer where progress is admitted only through verified hard-state transitions. It covers context demotion, state surfaces, transition contracts, verifier stratification, runtime loops, memory writes, completion governance, multi-agent permissions, rollback, revocation, and state-rendered context.

[Read the SGAR governed-systems draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.md)

### Agent Harness Framework
Tag: runtime science working draft

This working draft pushes Agent Engineering from empirical harness recipes toward quantifiable runtime science. It separates the model-conditioned capability frontier, Bridge, and Action-Space Optimization; introduces a dual view of system residual and execution residual; and lays out an experimental program for measuring bridge submechanisms, interface design, component interaction, and cross-model transfer.

[Read the Agent Harness Framework: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-harness-framework.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-harness-framework.zh-CN.md)

### Why Agent Engineering Must Take Controlled Experiments Seriously
Tag: controlled-experiment methodology working draft

This bilingual report reviews the frontier shift from model-centric benchmarks to harness- and system-level evidence, explains why current findings still fall short of causal accumulation, and turns observation-representation, state, fitting-boundary, support, aggregation, and specification mismatch into a concrete controlled-experiment program. Its central claim is bounded: models move mismatch boundaries, while controlled experiments identify and recalibrate the governance mechanisms at those boundaries.

[Read the controlled-experiment report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/why-agent-engineering-needs-controlled-experiments.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/why-agent-engineering-needs-controlled-experiments.zh-CN.md) · [Bilingual Word edition](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/assets/agent-engineering-controlled-experiments-bilingual.docx)

### Aggregation Mismatch Across Scales: From Single-Call Reasoning to Agent Trajectories
Tag: runtime bridge working draft

This working draft extends aggregation mismatch from single-call reasoning into agent trajectories. It separates semantic prefix lock-in from causal path lock-in, and explains when external Plan, Candidate, Audit, Hard State, Patch, Rollback, and Replan stop being duplicate reasoning and become a persistent control plane plus search frontier across stages.

[Read the multi-scale aggregation mismatch draft: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-across-scales-from-single-call-reasoning-to-agent-trajectories.zh-CN.md)

### Aggregation Mismatch Artifacts v18/v19: Step versus Stage Iteration
Tag: aggregation-mismatch agent-loop evidence

This bilingual evidence report compares local Step revision with full Stage
replanning on globally dependent DAG tasks. Under a three-revision budget,
Stage achieved 62.5% while Step achieved 0%; under a shared eight-provider-turn
budget, Stage achieved 68.8% while Step reached 10.4%. All preregistered primary
claims failed because they predicted the opposite direction, so the report
mounts the repeated Stage advantage as `share_with_caveats` engineering evidence,
not as a universal default law.

[Read the v18/v19 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v18-v19-step-vs-stage-iteration.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v18-v19-step-vs-stage-iteration.zh-CN.md)

### Aggregation Mismatch V1–V25 and Supplementary Experiments
Tag: complete evidence synthesis

This bilingual synthesis reconciles the complete numbered program with the
Wave34, MiniMax, T1, and writing follow-ups. It keeps strict GF(2)/Agent
endpoints separate from natural-writing quality, records the authority and
claim ceiling of every version, and translates the evidence into runtime,
delivery, conflict-governance, Ladder, and Stage-repair decisions. The headline
is conditional: externalization and runtime ownership are robust engineering
directions; Patch, Ladder, and Stage require routing rather than universal
defaults.

[Read the V1–V25 synthesis: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v1-v25-and-supplementary-experiments.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v1-v25-and-supplementary-experiments.zh-CN.md)

[Read the V20–V25 writing/Stage group: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v20-v25-writing-and-stage-repair.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v20-v25-writing-and-stage-repair.zh-CN.md)

[Read the Wave34/cross-configuration group: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-wave34-and-cross-configuration-probes.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-wave34-and-cross-configuration-probes.zh-CN.md)

### From Fixed Workflows to Governed Delegation
Tag: software architecture working draft

This working draft explains the design shift from enumerating execution paths to governing runtime decisions. It introduces six layers of responsibility, capability mounting, hard and soft gates, authority separation, and a staged path from deterministic workflows to governed adaptive orchestration, while positioning SGAR as the hard-state runtime discipline beneath that architecture.

[Read the governed-delegation draft](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/from-fixed-workflows-to-governed-delegation.md) / [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/from-fixed-workflows-to-governed-delegation.zh-CN.md)

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

### Single-Route Decisions: RR1–RR7 and RR-v2 Decisive Evidence
Tag: routing-reliability research evidence

This bilingual evidence synthesis consolidates RR1–RR7 and both RR-v2 decisive
rounds. A-EXT extends typed abstention and Top-5 shortlisting to an independent
controlled Skill ecosystem with real tempfile executors; B-XOVER identifies a
strong PATCH/EXACT crossover when a trusted runtime edit-scope hint is supplied;
C-BLIND finds mechanical signatures outperforming the tested live-LLM recovery
configuration, with an explicit infrastructure-timeout caveat. Production defaults
remain unchanged, and Workflow, SGAR, and complex orchestration remain out of scope.

[Read the single-route synthesis: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/single-route-decision-frozen-evidence-synthesis.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/single-route-decision-frozen-evidence-synthesis.zh-CN.md)

### Support Mismatch and Control-Space Search in LLM Systems
Tag: control-space search technical report

This technical report develops support mismatch as a candidate-reachability failure: a high-value structure may be expressible and valuable yet still receive too little effective support under the deployed policy, search operator, pruning rule, recognition mechanism, and budget. It defines control-space search, support lifting, support maps, search warrants, coverage ledgers, support deltas, and support regression guards.

[Read the control-space search report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.md)

### Aggregation Mismatch and Compositional Governance in LLM Systems
Tag: compositional governance technical report

This technical report develops aggregation mismatch as a local-to-global composition failure: locally plausible parts may fail to preserve global utility under the composition operator. It defines compositional governance through dependency graphs, interface contracts, invariant registries, binding records, claim-support maps, integration ledgers, and composition audits.

[Read the compositional governance report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.md)

### Aggregation Mismatch Artifact-v11: Address Drift and Configuration Delivery
Tag: aggregation-mismatch research evidence

This bilingual report validates 256 DeepSeek delivery episodes and 1,024 offline executor cases on production-shaped synthetic JSON configurations. The relocation × (ID−INDEX) interaction passes at +21.875 points, with all differences concentrated at \(N=48\). Patch and Rewrite both reach ceiling reliability, while Patch substantially reduces tokens, latency, and response bytes.

[Read the artifact-v11 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v11-config-delivery-transfer.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v11-config-delivery-transfer.zh-CN.md)

### Aggregation Mismatch Artifact-v12: Drift Dose and Delivery-Scale Routing
Tag: aggregation-mismatch research evidence

This bilingual report validates 240 DeepSeek episodes and 768 offline executor
cases. The preregistered drift-dose interaction fails, while sparse
verified-plan Patch improves 300-second strict success over Full Rewrite by
29.17 points. Regional Rewrite remains exploratory and heterogeneous.

[Read the artifact-v12 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v12-scale-routing-transfer.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)

### Aggregation Mismatch Artifact-v14: Post-Compile Drift and Exact Recovery
Tag: aggregation-mismatch research evidence

This bilingual report validates 96 formal DeepSeek episodes, 768 offline
executor cases, and 1,416 reconstructable events under strict
seal-before-drift timing. Compatible Exact is safely rejected stale and
recovered 24/24. Its +19.3% token interaction is positive but misses the
preregistered +20% minimum-effect gate.

[Read the artifact-v14 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v14-post-compile-drift-recovery.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)

### Aggregation Mismatch Artifact-v15: Intent Conflict Governance
Tag: aggregation-mismatch research evidence

This bilingual report validates 96 formal DeepSeek episodes, 768 offline
executor cases, and 1,594 reconstructable events. Conflict first commits are
rejected 0/72; governed Intent/Exact Rebase recover 48/48, while Naive
terminates 0/24. The machine primary passes, but a frozen-prose versus
executable Pilot Gate deviation requires a `share_with_caveats` verdict.

[Read the artifact-v15 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v15-intent-conflict-governance.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v15-intent-conflict-governance.zh-CN.md)

### Aggregation Mismatch Artifact-v16: Matched Conflict Recovery
Tag: aggregation-mismatch research evidence

This bilingual report validates 96 formal DeepSeek episodes, 768 offline
executor cases, and 1,752 reconstructable events. With second-turn opportunities
matched, Generic/Reread remain locked at 0/24 while runtime Unlock + Rebase
reaches 24/24. The machine primary passes; bundled authority/state/information
and a frozen-manifest Pilot metadata deviation require a
`share_with_caveats` verdict.

[Read the artifact-v16 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v16-matched-conflict-recovery.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v16-matched-conflict-recovery.zh-CN.md)

### Aggregation Mismatch Artifact-v17: Unlock Information and Escalation
Tag: aggregation-mismatch research evidence

This bilingual report validates 192 formal DeepSeek episodes, 1,536 offline
cases, and 3,840 reconstructable events. All four post-unlock information arms
reach 24/24, so the preregistered superiority claim fails at ceiling; complete
old-state context costs 74.9% more median tokens than receipt-only. Under an
unresolvable lock, typed Escalate reaches 24/24 accepted non-commit outcomes.
The latter is a governance-terminal contrast with different endpoints, not a
task-completion advantage.

[Read the artifact-v17 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v17-unlock-info-escalate.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v17-unlock-info-escalate.zh-CN.md)

### Aggregation Mismatch V1–V12 and V14–V17: Historical Detail and Agent Engineering
Tag: historical experiment synthesis and engineering guide

This historical bilingual synthesis maps each earlier artifact to its supported,
unsupported, and non-generalizable claims, explicitly excluding archived V13.
Its engineering companion turns that evidence into a reference architecture,
routing policy, telemetry schema, governed-commit protocol, implementation
sequence, conflict governor, minimum-context disclosure, typed terminal states,
and application map. The V1–V25 synthesis above is the current complete entry.

[Read the experiment summary: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v1-v12-v14-v17-experiment-summary.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v1-v12-v14-v17-experiment-summary.zh-CN.md)

[Read the engineering lessons: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v17.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v17.zh-CN.md)

### Aggregation Mismatch Artifact-v4: Evidence, Theory Gaps, and Agent Implications
Tag: aggregation-mismatch research evidence

This bilingual evidence report adjudicates the completed 756-run DeepSeek matrix on boundary-state externalization, candidate/interface decomposition, independently allocated 300/900/1800-second budgets, and output order. It reports the deterministic correction of seven legacy-evaluator rows, distinguishes answer-information recovery from structural cut-set specificity, and translates the theory–evidence gap into agent routing, executor, verifier, and telemetry requirements.

[Read the artifact-v4 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.zh-CN.md)

### Aggregation Mismatch Artifact-v5: Stable Editing Agents and the Planning Bottleneck
Tag: aggregation-mismatch research evidence

This bilingual report adjudicates the completed 288-arm native-tool DeepSeek study. With a correct oracle plan, batch Patch succeeds on 46/48 versus 26/48 for full-object Rewrite, a +41.7-point delivery advantage. Under inferred plans, the end-to-end comparison is 2/96 versus 0/96 and fails its gate. The report explains why the verdict is `delivery_only`, why the crossover remains unadjudicated, and how plan verification must precede write-interface routing.

[Read the artifact-v5 report: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v5-stable-editing-agent.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)

### Patch vs. Full Rewrite: A Controlled Sparse-Repair Experiment
Tag: aggregation-mismatch research evidence

This evidence note isolates repair delivery from edit discovery. Across 160 new holdouts and 1,920 completed DeepSeek runs, patch plus deterministic execution improves budgeted exact reliability over full rewrite. Oracle-plan, pure-copy, within-response, length, failure-class, and independently preallocated 900-second controls define both the result and its limits.

[Read the controlled experiment: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.zh-CN.md)

### Aggregation Mismatch: Derivable Claims, Proof Conditions, and Agent Engineering
Tag: theory-to-engineering bridge

This working draft separates three kinds of conclusions: interface and state properties that follow under explicit assumptions, structural predictions that still require LLM measurement, and empirical questions that depend entirely on the model and task distribution. It derives results for patch commitment surfaces, boundary state, dependency order, verifier gates, local invalidation, conflict-free parallelism, commit safety, and replayable state, then turns them into an implementable agent architecture.

[Read the theoretical claims and agent-engineering implications: English](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.md) · [中文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)

### Specification Mismatch and Objective Governance in LLM Systems
Tag: objective governance technical report

This technical report develops specification mismatch as an objective-preservation failure: the accessible proxy objective may diverge from true task utility even when observation, state, routing, support, and aggregation are adequate. It defines Objective Governance through scoped objective objects, proxy-risk audits, priority rules, verifier contracts, specification audits, control deltas, and regression guards.

[Read the objective governance report](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/specification-mismatch-objective-governance-llm-systems.md)

### Human-Assist Operational Mismatches
Tag: collaboration supplement

The supplement does not add new primitive mismatches. It consolidates execution blockers into five operational domains, defines hard and expected-loss escalation gates, and develops MSHQs, GEsOs, answer validation, and autonomy recovery.

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

These are earlier drafts kept for reference. Each one is now superseded by a document in the current working manuscripts above, and each card points to its replacement.

:::paper-docs
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

These site pages carry the framework into practice. They do not add new theory; they apply the manuscripts to human capability and to open-source implementation.

::::cards
### Human Learning in the AI Era
Tag: site extension

The learning page develops the human-role shift in governed collaboration: from routine processor to governor of problem construction, value judgment, feedback, validation, authorization, and governance memory. It is the human-capability extension of the main framework.

### Open-Source Projects
Tag: implementation roadmap

The project page only organizes implementation and evaluation directions already present in the manuscripts: GKO lifecycles, GEsO escalation protocols, hard-state agent ledgers, and six-mismatch diagnostics. It is not an additional theoretical claim.
::::

## Future Empirical Agenda

The framework is built to be tested, not just argued. These are the open empirical questions it raises:

- Compare Knowledge Governance against strong output-space search baselines under matched compute budgets.
- Measure when generated rubrics, edge cases, state matrices, and GKOs correlate with expert judgment.
- Study positive-alignment profiles for context compression, semantic decompression, query formulation, and structured transformation.
- Measure the construal gap between noisy natural scenes and clean abstract forms.
- Compare ordinary human-agent prompting with MSHQ/GEsO collaboration protocols on interruption count, answer quality, and autonomy regained.
- Evaluate whether GKO/GEsO stores improve reuse without causing stale governance, over-escalation, or learned helplessness.
- Evaluate whether SGAR-style hard state reduces false completion, state drift, unrecoverable interruptions, and unauditable action loops in long-horizon agents.

## Project Status

These drafts are research frameworks and an open-source agenda, not a closed theory. Their goal is to provide a language for debating, implementing, and testing: when LLMs become mediocre, when they become extraordinary, and how people and systems can turn local capability into stable task value.
