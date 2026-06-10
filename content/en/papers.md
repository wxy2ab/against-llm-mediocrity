---
key: papers
lang: en
path: /papers
title: Papers and Working Manuscripts
navTitle: Papers
kicker: Formalizing the framework
summary: This section collects the current manuscripts and future empirical directions related to autoregressive mediocrity, autoregressive extraordinary, Knowledge Governance, and governed collaboration.
order: 6
heroPoints:
  - "Main manuscript: Knowledge Governance for Large Language Model Systems."
  - "Supplement: Human-Assist Operational Mismatches."
  - "Extensions and implementation: governed collaboration, human learning, and tooling directions derived from the research agenda."
---

## How to Enter the Deep End

The main site is the public explanation layer: intuition first, mechanism second, practice third. The papers and working manuscripts are the deeper layer, where definitions, diagnostic categories, governance objects, and research questions are developed more fully.

Suggested reading order:

1. Start with "Why It Matters" and "Mechanism" to understand the three regimes and four primitive mismatches.
2. Read the main manuscript to see how Knowledge Governance externalizes, validates, and reuses intermediate control knowledge.
3. Read the collaboration supplement to understand when an agent should ask a human and how to construct minimal sufficient human queries.
4. Use the site pages on collaboration, learning, and projects to see how the manuscripts translate into practice and implementation directions.

If you only read the site, the goal is to get an operational judgment chain. If you enter the manuscripts, the goal is to inspect the definitions, boundaries, and testability of that chain. This page connects the public explanation layer to the formal working drafts.

## Current Working Manuscripts

:::cards
### Knowledge Governance for Large Language Model Systems
Tag: main manuscript

The main manuscript introduces the three regimes: autoregressive mediocrity, local alignment, and autoregressive extraordinary. It explains ordinary output-space search plateaus through four primitive mismatches: aggregation, support, state, and specification. It then develops Knowledge Governance, Decoupled Control Spaces, and GKOs.

[Read the main manuscript](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.md)

### Human-Assist Operational Mismatches
Tag: collaboration supplement

The supplement does not add new primitive mismatches. It consolidates execution blockers into five operational domains, defines hard and expected-loss escalation gates, and develops MSHQs, GEOs, answer validation, and autonomy recovery.

[Read the technical supplement](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.md)

### Governed Human-AI Collaboration
Tag: public practice framework

This practice framework turns the theory into a collaboration method: AI should first query the environment, learn from feedback, and construct proving grounds. Only when the remaining variable is genuinely human-governed should it ask a minimal sufficient question.

[Read the practice framework](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.md)
:::

## Extensions and Implementation

::::cards
### Human Learning in the AI Era
Tag: site extension

The learning page develops the human-role shift in governed collaboration: from routine processor to governor of problem construction, value judgment, feedback, validation, authorization, and governance memory. It is the human-capability extension of the main framework.

### Open-Source Projects
Tag: implementation roadmap

The project page only organizes implementation and evaluation directions already present in the manuscripts: GKO lifecycles, GEO escalation protocols, and four-mismatch diagnostics. It is not an additional theoretical claim.
::::

## Future Empirical Agenda

- Compare Knowledge Governance against strong output-space search baselines under matched compute budgets.
- Measure when generated rubrics, edge cases, state matrices, and GKOs correlate with expert judgment.
- Study positive-alignment profiles for context compression, semantic decompression, query formulation, and structured transformation.
- Measure the construal gap between noisy natural scenes and clean abstract forms.
- Compare ordinary human-agent prompting with MSHQ/GEO collaboration protocols on interruption count, answer quality, and autonomy regained.
- Evaluate whether GKO/GEO stores improve reuse without causing stale governance, over-escalation, or learned helplessness.

## Project Status

These drafts are research frameworks and an open-source agenda, not a closed theory. Their goal is to provide a language that can be debated, implemented, and tested: when LLMs become mediocre, when they become extraordinary, and how people and systems can turn local capability into stable task value.
