# Against LLM Mediocrity

A bilingual knowledge hub about why large language models can produce fluent but mediocre answers, how those limits arise, and how scientific and engineering practice can turn high-mismatch tasks into governed, higher-value workflows.

The first version is based on four source drafts:

- `Knowledge Governance for Large Language Model Systems`
- `Human-Assist Operational Mismatches`
- `AI 与人的协作范式：从聊天式使用到治理式协作`
- `AI 时代的人类学习：从技能教育到洞察、反馈与叙事的形成`

The site does not publish those drafts verbatim. It reorganizes them into a public-facing English-first structure with Chinese mirror pages.

## Site Structure

- `/` and `/zh/`: bilingual home pages
- `/science` and `/zh/science`: popular science introduction
- `/framework` and `/zh/framework`: scientific framework and mismatch taxonomy
- `/engineering` and `/zh/engineering`: engineering playbook for Knowledge Governance
- `/collaboration` and `/zh/collaboration`: human-AI collaboration patterns
- `/learning` and `/zh/learning`: human learning in the AI era
- `/papers` and `/zh/papers`: future papers and working manuscripts
- `/projects` and `/zh/projects`: future open-source projects based on GKO principles

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

## Adding Future Work

- Add papers as dedicated pages or metadata entries under the existing Papers route.
- Add GKO-based open-source projects as cards under Projects, including repository links, status, and the governance principle they implement.
- Keep English as the primary version and add Chinese mirrors under the same route path in `/zh/`.
