# Against LLM Mediocrity

A field guide to the structural ceilings of LLMs and the engineering moves that work around them.

Models keep improving, and their capabilities keep expanding. But there is a more important question worth asking in reverse: can continued training and iteration solve *every* important problem?

For the problems that LLMs still fail on today, should we just wait for the next round of training, the next model generation, or the next scaling curve? Or should we admit a more basic fact: some limits are structural ceilings imposed by the algorithmic and architectural character of LLMs themselves?

This site takes the second view: **some failures really are structural ceilings, and they will not disappear merely because training continues.** The useful work is to identify those ceilings and show how engineering can route around them, constrain them, compensate for them, or redesign the system boundary around them.

## What You Will Gain

- **Recognize structural failure modes early** — stop wasting time waiting for scale to fix what it cannot.
- **Learn engineering patterns** that solve those problems outside the model when needed.
- **See why the next serious agent paradigm** has to move toward governance, state, and explicit control objects.

`against-llm-mediocrity` turns that claim into a shared engineering language: a small set of terms for naming where a structural ceiling appears and deciding whether the fix belongs inside the model, outside the model, or at the human-system boundary.

## Core Vocabulary

Here is the vocabulary the site builds on, with a one-line definition for each:

- **LLM mediocrity** — The regime where the model's easiest output and the task's high-value output point in different directions. More sampling or polishing makes answers smoother, but not better.
- **Local alignment** — The common case where the model's local moves (compressing, rewriting, comparing) align with *part* of the task value, but the alignment is conditional and does not carry the whole task.
- **LLM excellence** — The regime where fluency and learned representations pull with the task value along the whole chain, so autoregression becomes an advantage.
- **Six primitive mismatches** — A taxonomy of the structural reasons a value-preserving pipeline breaks down: aggregation, support, state, specification, fitting-boundary, and observation-representation.
- **Knowledge governance** — Separating verified, task-specific control knowledge from generation and storing it as reusable objects.
- **Governed Knowledge Object (GKO)** — A verified unit of control knowledge that downstream generation can start from, instead of from the model's default probabilities.
- **Governed Execution Object (GExO)** — A governed execution unit for tasks, plans, actions, and workflow items that must be tracked explicitly.
- **Governed Escalation Object (GEsO)** — A stored rule for when to ask a human, what to ask, and whom to ask.
- **Audit engineering** — Treating auditing as an independent layer that localizes failures and writes fixes back into control objects, rather than as a post-hoc scorer.
- **State-Governed Agent Regime (SGAR)** — An agent design that moves long-horizon execution onto an external hard-state layer, so plans, actions, verification, and escalation become governed state transitions.
- **Governed human-machine collaboration** — Organizing collaboration around control variables (AI advances the searchable parts; humans govern value, preference, and responsibility) instead of around task splits.

Terminology note: the site now uses `GExO` for `Governed Execution Object` and `GEsO` for `Governed Escalation Object`, to avoid overloading `GEO`.

> **How to Read This Material**
>
> The content grows out of engineering practice and engineering intuition, distilled into theory-like frameworks meant to feed back into practice. The measure of success here is practical engineering payoff, not mathematical completeness. Read the theoretical parts as working scaffolds that can change at any time, rather than as finished theoretical research.

## Core Idea

LLMs are already good at coding, drafting, summarizing, explaining, and rephrasing. But once a task depends on long-horizon coordination, hidden state, rare structure, real-world constraints, explicit value judgment, or responsibility, "try one more time" and "prompt it better" often make outputs smoother without making them fundamentally right.

This project focuses on three questions:

1. Which failures are structural ceilings rather than temporary capability gaps?
2. How do you turn local alignment into engineering fixes that are verifiable, governable, and reusable?
3. How should agent and human collaboration be redesigned once those ceilings are taken seriously?

## Docs

The docs are working drafts, grouped by theme. Each entry ships in English and 中文; the gloss after each link says why you might read it.

### Knowledge Governance

The core framework: how structural failures arise and how governance turns them into verifiable, reusable fixes.

- Structural theory of value preservation: [English](docs/structural-theory-value-preservation-llm-systems.md) · [中文](docs/structural-theory-value-preservation-llm-systems.zh-CN.md) — Start here for the overall theory of when value survives a pipeline and when it does not.
- Six primitive mismatches pipeline-derived taxonomy: [English](docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md) · [中文](docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md) — The diagnostic taxonomy that names the six structural reasons a task breaks down.
- Engineering origins of the six primitive mismatches: [English](docs/engineering-origins-of-six-primitive-mismatches.md) · [中文](docs/engineering-origins-of-six-primitive-mismatches.zh-CN.md) — A practice-first account of how the six mismatches emerged from failed sampling, story generation, finance, and repeated engineering friction.
- Formal Mechanism Layer for Governed LLM Systems: [English](docs/formal-mechanism-layer-for-governed-llm-systems.md) · [中文](docs/formal-mechanism-layer-for-governed-llm-systems.zh-CN.md) — Connects the mismatches to eight intervenable mechanism axes.
- Diagnostic-Mechanism Bridge for Governed LLM Systems: [English](docs/diagnostic-mechanism-bridge-for-governed-llm-systems.md) · [中文](docs/diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md) — Translates a diagnosed mismatch into where the repair belongs and which layer to fix.
- Mechanism-Driven Training for Governed LLM Systems: [English](docs/mechanism-driven-training-for-governed-llm-systems.md) · [中文](docs/mechanism-driven-training-for-governed-llm-systems.zh-CN.md) — When to promote a recurring component failure into an amortizable training signal.
- Governed LLM object model and interface specification: [English](docs/governed-llm-object-model-interface-specification.md) · [中文](docs/governed-llm-object-model-interface-specification.zh-CN.md) — The implementation spec: the objects and interfaces the theory relies on.
- Audit Engineering for governed LLM systems: [English](docs/audit-engineering-failure-localization-control-space-writeback.md) · [中文](docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md) — How to localize failures and write fixes back into the control space.
- Oracle classification, audit agent, and SGAR engine routing: [English](docs/oracle-classification-audit-agent-sgar-engine-routing.md) · [中文](docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md) — Unifies oracle classification, auditing, and SGAR into one engine-routing decision chain.
- State-Governed Agent Regime for governed LLM systems: [English](docs/state-governed-agent-regime-for-governed-llm-systems.md) · [中文](docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md) — The case for hard-state authority, transition contracts, and runtime governance.
- Agent Hardness Framework: [English](docs/agent-hardness-framework.md) · [中文](docs/agent-hardness-framework.zh-CN.md) — A runtime-science draft that separates model-conditioned capability frontier, runtime bridge, and Action-Space Optimization into quantifiable components.
- Observation-representation mismatch and channel governance: [English](docs/observation-representation-mismatch-channel-governance-llm-systems.md) · [中文](docs/observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md) — How decisive variables enter the model, and how to govern the channel that carries them.
- State mismatch and state governance: [English](docs/state-mismatch-state-governance-llm-systems.md) · [中文](docs/state-mismatch-state-governance-llm-systems.zh-CN.md) — Handling latent state, state discrimination, and state-conditioned control.
- Fitting-boundary mismatch and capability routing: [English](docs/fitting-boundary-mismatch-capability-routing-llm-systems.md) · [中文](docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md) — Aligning a capability's trigger boundary with where it actually works, via routing.
- Fitting-boundary case — why models “rescue” a fish in water: [English](docs/fitting-boundary-mismatch-fish-in-water-case.md) · [中文](docs/fitting-boundary-mismatch-fish-in-water-case.zh-CN.md) — A qualitative case, competing explanations, and a falsifiable paired design for explicit-frame dominance over derived world state.
- Support mismatch and control-space search: [English](docs/support-mismatch-control-space-search-llm-systems.md) · [中文](docs/support-mismatch-control-space-search-llm-systems.zh-CN.md) — Reaching high-value structures that sit in low-probability regions.
- Aggregation mismatch and compositional governance: [English](docs/aggregation-mismatch-compositional-governance-llm-systems.md) · [中文](docs/aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md) — Why good local pieces fail to compose, and how to govern the composition.
- Aggregation mismatch and generation–verification asymmetry: [中文研究证据](docs/aggregation-mismatch-generation-verification-asymmetry-evidence.zh-CN.md) — Controlled evidence that local rule execution does not automatically become globally consistent construction.
- Aggregation mismatch artifact-v4 verdict: [English](docs/aggregation-mismatch-v4-claims-theory-gap.md) · [中文](docs/aggregation-mismatch-v4-claims-theory-gap.zh-CN.md) — What the completed 756-run boundary, candidate/interface, budget, and order matrix establishes; where its empirical results stop short of the theory; and what agent builders should change.
- Aggregation mismatch artifact-v5 stable editing Agent: [English](docs/aggregation-mismatch-v5-stable-editing-agent.md) · [中文](docs/aggregation-mismatch-v5-stable-editing-agent.zh-CN.md) — The completed 288-arm native-tool study: Patch delivery wins once the plan is correct, the end-to-end Agent claim fails under a planning floor, and the crossover remains unadjudicated.
- Aggregation mismatch artifact-v7 mechanism recovery: [English](docs/aggregation-mismatch-v7-mechanism-recovery.md) · [中文](docs/aggregation-mismatch-v7-mechanism-recovery.zh-CN.md) — The completed 240-call plus 48-case compiler study: order and localized-receipt signals fail their confirmatory gates, while deterministic plan compilation passes its adoption gate.
- Aggregation mismatch artifact-v8 runtime ownership and semantic routing: [English](docs/aggregation-mismatch-v8-runtime-ownership-routing.md) · [中文](docs/aggregation-mismatch-v8-runtime-ownership-routing.zh-CN.md) — The completed 288-episode plus 64-case study: runtime readiness/ledger and semantic-ID interfaces pass their gates, while local verification is ceiling-limited, the density crossover fails, and scaffold cost remains material.
- Aggregation mismatch artifact-v9 minimal scaffold and verifier receipt: [English](docs/aggregation-mismatch-v9-minimal-scaffold-recovery.md) · [中文](docs/aggregation-mismatch-v9-minimal-scaffold-recovery.zh-CN.md) — The completed 192-episode effort-matched study: ready/ledger main effects remain unadjudicated under a strict-order floor, while located/causal receipt estimates are positive but fail their confirmatory gates.
- Patch vs. full rewrite controlled experiment: [English](docs/patch-vs-full-rewrite-controlled-experiment.md) · [中文](docs/patch-vs-full-rewrite-controlled-experiment.zh-CN.md) — DeepSeek artifact-v3 evidence that patch plus deterministic execution improves budgeted exact reliability for sparse repair, with oracle-plan, copy, and independent 900-second controls.
- Aggregation mismatch theoretical claims and agent engineering: [English](docs/aggregation-mismatch-theoretical-claims-agent-engineering.md) · [中文](docs/aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md) — Which conclusions follow from information, dependency, and program semantics, which still require experiments, and how they change agent architecture.
- Specification mismatch and objective governance: [English](docs/specification-mismatch-objective-governance-llm-systems.md) · [中文](docs/specification-mismatch-objective-governance-llm-systems.zh-CN.md) — Closing the gap between the proxy objective and the real one, driven by counterexamples.

### Legacy Versions

Earlier drafts kept for reference; superseded by the entries above but still cited.

- A Formal Mechanism Layer for LLM Failure: [English](docs/formal-mechanism-layer.md) · [中文](docs/formal-mechanism-layer.zh-CN.md) — The original mechanism-layer write-up.
- Knowledge Governance for Large Language Model Systems: [English](docs/knowledge-governance-llm-systems-local-alignment.md) · [中文](docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md) — The first full statement of knowledge governance and local alignment.
- Observation-representation mismatch supplement: [English](docs/observation-representation-mismatch.md) · [中文](docs/observation-representation-mismatch.zh-CN.md) — The standalone supplement on observation-representation mismatch.
- Fitting-boundary mismatch supplement: [English](docs/fitting-boundary-mismatch.md) · [中文](docs/fitting-boundary-mismatch.zh-CN.md) — The standalone supplement on fitting-boundary mismatch.
- Audit–write-back–governance engineering: [English](docs/audit-engineering.md) · [中文](docs/audit-engineering.zh-CN.md) — The earlier audit-and-write-back engineering note.
- State-Governed Agent Regime: [English](docs/state-governed-agent-regime.md) · [中文](docs/state-governed-agent-regime.zh-CN.md) — The earlier SGAR draft.

### Governed Human-AI Collaboration

How AI and humans should divide work once structural ceilings are taken seriously.

- Human-assist operational mismatches, MSHQs, and GEsOs: [English](docs/human-assist-operational-mismatches.md) · [中文](docs/human-assist-operational-mismatches.zh-CN.md) — The technical supplement on when an agent should escalate and how it restores autonomy afterward, using Minimal Sufficient Human Queries (MSHQ) and Governed Escalation Objects (GEsO).
- Practical governed-collaboration framework: [English](docs/governed-human-ai-collaboration.md) · [中文](docs/governed-human-ai-collaboration.zh-CN.md) — The practice framework: AI first queries the environment and builds options and proving grounds, then asks humans only for genuinely human-governed variables.
- Cognitive discipline for AI: [English](docs/cognitive-discipline-for-ai.md) · [中文](docs/cognitive-discipline-for-ai.zh-CN.md) — The cognitive framework for the human side of using AI.
- AI collaborative posture: calibrated friction and constructive firmness: [English](docs/ai-collaborative-posture-calibrated-friction-constructive-firmness.md) · [中文](docs/ai-collaborative-posture-calibrated-friction-constructive-firmness.zh-CN.md) — How an assistant should push back with calibrated friction instead of agreeing by default.

### AI Economics and Pricing

- The maximum price of models: [English](docs/maximum-price-of-llms.md) · [中文](docs/maximum-price-of-llms.zh-CN.md) — The math behind LLM pricing and commoditization.

Taken together, these drafts make one case in detail: the SGAR draft explains why long-horizon agents need an external hard-state layer so that plans, actions, verification, escalation, and audit findings become governed state transitions rather than loose context narrative.

## Site

- <https://wxy2ab.github.io/against-llm-mediocrity/>

## Authors

- Xinyun Wang: [GitHub](https://github.com/wxy2ab)
- Shuliang Liu: [GitHub](https://github.com/MichaelLyo)

## Local Development

```bash
npm install
npm run dev
```

Build the static site:

```bash
npm run build
```

## Publishing

The repository is configured for GitHub Pages through `.github/workflows/pages.yml`. Pushes to `main` build the Vite site and deploy the generated `dist` directory.
