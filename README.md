# Against LLM Mediocrity

A bilingual knowledge hub about why large language models can produce fluent but mediocre answers, how those limits arise, and how scientific and engineering practice can turn high-mismatch tasks into governed, higher-value workflows.

The first version is based on four source drafts:

- `Knowledge Governance for Large Language Model Systems`
- `Human-Assist Operational Mismatches`
- `AI 与人的协作范式：从聊天式使用到治理式协作`
- `AI 时代的人类学习：从技能教育到洞察、反馈与叙事的形成`

The site does not publish those drafts verbatim. It reorganizes them into a public-facing English-first structure with Chinese mirror pages.

The content is organized as a reader journey: public explanation -> theoretical mechanism -> engineering application. In other words, "popular explanation / scientific theory / engineering practice" is the logic of the writing, not a set of literal section labels.

## Editing Content

Page content lives in Markdown files:

- `content/en/*.md`
- `content/zh/*.md`

Normal content edits should only require editing these Markdown files. The TypeScript code is a shared renderer for routes, navigation, hero metadata, Markdown sections, card grids, and the alignment visual.
Adding a new page requires adding a Markdown file with frontmatter; navigation order is controlled by the `order` field.

Each page starts with frontmatter:

```yaml
---
key: home
lang: en
path: /
title: Against LLM Mediocrity
navTitle: Home
kicker: A reader journey from intuition to mechanism to practice
summary: LLMs can produce fluent answers long before they produce truly valuable answers.
order: 0
heroVisual: alignment
heroPoints:
  - When statistical probability and task value rise together, autoregression can be extraordinary.
---
```

For the home-page alignment diagram, add `heroVisual: alignment` and an `alignmentLabels` object in frontmatter to control the labels.

Use `##` headings for page sections. Use `:::cards` blocks for card grids:

```md
:::cards
### Card title
Tag: Optional tag

Card body.

### Another card

Another body.
:::
```

## Site Routes

- `/` and `/zh/`: bilingual home pages
- `/science` and `/zh/science`: Why It Matters, the plain-language entry point
- `/framework` and `/zh/framework`: Mechanism, the paper-facing conceptual layer
- `/engineering` and `/zh/engineering`: Governance, the engineering application layer
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

- Add papers by editing `content/en/papers.md` and `content/zh/papers.md`, or by adding new Markdown pages with frontmatter.
- Add GKO-based open-source projects as cards under Projects, including repository links, status, and the governance principle they implement.
- Keep English as the primary version and add Chinese mirrors with matching `key` values under `/zh/`.
