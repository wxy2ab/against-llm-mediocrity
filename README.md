# Against LLM Mediocrity

Against LLM Mediocrity studies how to resist LLM mediocrity and turn local model capability into stable task value.

## Core Idea

LLMs are often able to produce fluent answers long before they produce truly high-value answers. The core idea of this project is that many hard failures are not just prompt failures. They arise because the task's real value function is not well aligned with the model's local continuation tendencies.

This project focuses on three moves:

- preserve the parts of a task that are already locally aligned with autoregressive generation;
- externalize the poorly aligned parts into explicit control objects, constraints, rubrics, state representations, or verification loops;
- add hard environmental boundaries, hard feedback, and minimal human intervention points when the model cannot continue reliably on its own.

The goal is not to reject autoregression, but to transform tasks that would otherwise plateau in fluent mediocrity into tasks where autoregressive generation becomes genuinely useful or even extraordinary.

## Docs

### Knowledge Governance

- Structural theory of value preservation: [English](docs/structural-theory-value-preservation-llm-systems.md) · [中文](docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- Six primitive mismatches pipeline-derived taxonomy: [English](docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md) · [中文](docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)
- Formal mechanism layer for LLM failure: [English](docs/formal-mechanism-layer.md) · [中文](docs/formal-mechanism-layer.zh-CN.md)
- Governed LLM object model and interface specification: [English](docs/governed-llm-object-model-interface-specification.md) · [中文](docs/governed-llm-object-model-interface-specification.zh-CN.md)
- Audit Engineering for governed LLM systems: [English](docs/audit-engineering-failure-localization-control-space-writeback.md) · [中文](docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)
- State-Governed Agent Regime for governed LLM systems: [English](docs/state-governed-agent-regime-for-governed-llm-systems.md) · [中文](docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- Observation-representation mismatch and channel governance: [English](docs/observation-representation-mismatch-channel-governance-llm-systems.md) · [中文](docs/observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)
- State mismatch and state governance: [English](docs/state-mismatch-state-governance-llm-systems.md) · [中文](docs/state-mismatch-state-governance-llm-systems.zh-CN.md)
- Fitting-boundary mismatch and capability routing: [English](docs/fitting-boundary-mismatch-capability-routing-llm-systems.md) · [中文](docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md)
- Support mismatch and control-space search: [English](docs/support-mismatch-control-space-search-llm-systems.md) · [中文](docs/support-mismatch-control-space-search-llm-systems.zh-CN.md)
- Aggregation mismatch and compositional governance: [English](docs/aggregation-mismatch-compositional-governance-llm-systems.md) · [中文](docs/aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
- Specification mismatch and objective governance: [English](docs/specification-mismatch-objective-governance-llm-systems.md) · [中文](docs/specification-mismatch-objective-governance-llm-systems.zh-CN.md)

### Legacy Versions

- Knowledge Governance for Large Language Model Systems: [English](docs/knowledge-governance-llm-systems-local-alignment.md) · [中文](docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- Observation-representation mismatch supplement: [English](docs/observation-representation-mismatch.md) · [中文](docs/observation-representation-mismatch.zh-CN.md)
- Fitting-boundary mismatch supplement: [English](docs/fitting-boundary-mismatch.md) · [中文](docs/fitting-boundary-mismatch.zh-CN.md)
- Audit–write-back–governance engineering: [English](docs/audit-engineering.md) · [中文](docs/audit-engineering.zh-CN.md)
- State-Governed Agent Regime: [English](docs/state-governed-agent-regime.md) · [中文](docs/state-governed-agent-regime.zh-CN.md)

### Governed Human-AI Collaboration

- Human-assist operational mismatches, MSHQs, and GEOs: [English](docs/human-assist-operational-mismatches.md) · [中文](docs/human-assist-operational-mismatches.zh-CN.md)
- Practical governed-collaboration framework: [English](docs/governed-human-ai-collaboration.md) · [中文](docs/governed-human-ai-collaboration.zh-CN.md)
- Cognitive discipline for AI: [English](docs/cognitive-discipline-for-ai.md) · [中文](docs/cognitive-discipline-for-ai.zh-CN.md)

### AI Economics and Pricing

- The maximum price of models: [English](docs/maximum-price-of-llms.md) · [中文](docs/maximum-price-of-llms.zh-CN.md)

The technical supplement defines when an agent should escalate and how to restore autonomy. The practice framework explains how AI should first query the environment, construct options and proving grounds, and ask humans only for genuinely human-governed variables. The SGAR draft explains why long-horizon agents need an external hard-state layer so that plans, actions, verification, escalation, and audit findings become governed state transitions rather than loose context narrative.

## Site

- https://wxy2ab.github.io/against-llm-mediocrity/

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
