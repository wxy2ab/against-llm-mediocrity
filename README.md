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

- Main paper (English): `TBD`
- Main paper (Chinese): `TBD`
- Working manuscript in this repo (English): [docs/knowledge-governance-llm-systems-local-alignment.md](docs/knowledge-governance-llm-systems-local-alignment.md)
- Working manuscript in this repo (Chinese): [docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md](docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

## Docs

- Site home (English): [content/en/home.md](content/en/home.md)
- Site home (Chinese): [content/zh/home.md](content/zh/home.md)
- Mechanism: [content/en/framework.md](content/en/framework.md)
- Governance: [content/en/engineering.md](content/en/engineering.md)
- Collaboration: [content/en/collaboration.md](content/en/collaboration.md)
- Learning: [content/en/learning.md](content/en/learning.md)
- Papers page: [content/en/papers.md](content/en/papers.md)
- Projects page: [content/en/projects.md](content/en/projects.md)

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
