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

- Main working manuscript: [English](docs/knowledge-governance-llm-systems-local-alignment.md) · [中文](docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

### Governed Human-AI Collaboration

- Human-assist operational mismatches, MSHQs, and GEOs: [English](docs/human-assist-operational-mismatches.md) · [中文](docs/human-assist-operational-mismatches.zh-CN.md)
- Practical governed-collaboration framework: [English](docs/governed-human-ai-collaboration.md) · [中文](docs/governed-human-ai-collaboration.zh-CN.md)
- Cognitive discipline for AI: [English](docs/cognitive-discipline-for-ai.md) · [中文](docs/cognitive-discipline-for-ai.zh-CN.md)

### AI Economics and Pricing

- The maximum price of models: [English](docs/maximum-price-of-llms.md) · [中文](docs/maximum-price-of-llms.zh-CN.md)

The technical supplement defines when an agent should escalate and how to restore autonomy. The practice framework explains how AI should first query the environment, construct options and proving grounds, and ask humans only for genuinely human-governed variables.

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
