# Against LLM Mediocrity

Against LLM Mediocrity is dedicated to resisting LLM autoregressive mediocrity and improving edge performance.

## Core Idea

LLMs are often able to produce fluent answers long before they produce truly high-value answers. The core idea of this project is that many hard failures are not just prompt failures. They arise because the task's real value function is not well aligned with the model's local continuation tendencies.

This project focuses on three moves:

- preserve the parts of a task that are already locally aligned with autoregressive generation;
- externalize the poorly aligned parts into explicit control objects, constraints, rubrics, state representations, or verification loops;
- add hard environmental boundaries, hard feedback, and minimal human intervention points when the model cannot continue reliably on its own.

The goal is not to reject autoregression, but to transform tasks that would otherwise plateau in fluent mediocrity into tasks where autoregressive generation becomes genuinely useful or even extraordinary.

## Papers

- [Governed Control Inference: Escaping Autoregressive Mediocrity via Validated Latent Control Knowledge]()

## Docs

- Working manuscript in this repo (English): [docs/knowledge-governance-llm-systems-local-alignment.md](docs/knowledge-governance-llm-systems-local-alignment.md)
- Working manuscript in this repo (Chinese): [docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md](docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

## Site

- https://wxy2ab.github.io/against-llm-mediocrity/

## Repos That Resist LLM Autoregressive Mediocrity

- **Story Insight**: Story generation is an autoregressive mediocrity task with aggregation mismatch. By constructing and searching in a control space, Story Insight significantly improves story quality. With models such as MiniMax, it can produce stories that substantially outperform GPT-5.5 on overall story quality.
- **Social Insight**: Real social conversation is a multi-objective coordination task and is highly prone to aggregation mismatch. Social Insight uses control-space methods to improve multi-objective coordination and enable stronger social communication.
- **Stock Rec**: Financial tasks are a canonical state-mismatch setting. Stock Rec uses persistent search and validation so that LLM systems can better cope with the non-stationary nature of financial markets.

## Infrastructure Repos

- **deepstack**: An agent runtime scaffold that provides context assembly, recursive calls, and other core runtime capabilities for agent systems.

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
