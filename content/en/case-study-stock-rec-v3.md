---
key: case-study-stock-rec-v3
lang: en
path: /case-study-stock-rec-v3
title: "Case Study: Stock Rec V3"
navTitle: Stock Rec V3
kicker: State mismatch and producer governance in a financial strategy system
summary: "Stock Rec V3 is a daily stock-strategy system. Its core design is not to ask an LLM to pick stocks, but to govern four producers: factor, base-score, excitation, and holding processing. New content must pass through shadow, promotion, and active lifecycle stages before it can affect the strategy."
order: 2.6
showInNav: false
heroPoints:
  - "Financial strategy is a canonical state-mismatch domain: market regime, data coverage, position state, and validation windows change the correct action."
  - "The system's central rule is to never directly trust LLM analysis; the model may only provide candidates, hints, explanations, or observations."
  - Production impact requires the nightly cycle, shadow observation, champion-challenger promotion, and active activation.
---

## Why This Case Is Worth Adding

It is worth adding. The current case library already has [Story Insight V4](/case-study-v4) and [Story Insight V6](/case-study-v6), which explain control-space design, layered governance, continuity audit, and plateau detection in narrative generation. But both cases still live in a creative-writing domain.

`stock_rec_v3` adds a different high-mismatch system: a daily financial strategy. Financial systems make LLM state mismatch hard to ignore. Market regime changes, data coverage changes, factor validity changes, position cost and PnL change, and yesterday's governance action can affect today's holding decision. Asking an LLM to directly answer "what should we buy or sell?" is dangerous because the model can easily produce a plausible market narrative without producing a verifiable, traceable, rollback-capable strategy state.

The core sentence for this case should be:

**do not trust the LLM's financial judgment; only let it participate inside a governed production process.**

## Why the Task Is High Mismatch

Stock recommendation looks tempting for an LLM. It can read news, explain themes, summarize sentiment, and write analyst-like prose. But those local abilities do not directly become a reliable strategy.

::::cards
### State Mismatch

The same signal means different things in bull, bear, and range markets. Current positions, costs, realized PnL, conditional actions, and prior governance carryover also change today's correct action.

### Specification Mismatch

"Sounds reasonable" is not the objective function. The real targets include IC, spread, top-N behavior, out-of-sample validation, transaction cost, drawdown, industry concentration, and holding-action consequences.

### Aggregation Mismatch

A locally valid factor, rule, or narrative does not imply a valid portfolio. Base score, excitation, risk penalty, holding action, and PnL have to be governed together.

### Support Mismatch

Valuable strategy changes are often not default financial prose. They may be low-coverage shadow factors, rule combinations that behave better across regimes, or sidecar enhancements that should not be activated yet.
::::

That is why `stock_rec_v3` is a useful case. It does not present the LLM as a stock-picking model. It puts the LLM inside a production system that distrusts it by design.

## The Core Structure: Four Producers

`stock_rec_v3` is organized around four continuously evolving producers, not a single prompt or one-off recommendation.

::::cards
### Factor Producer

Discovers, tests, and maintains atomic factors. The LLM may help with factor diagnosis and factor-definition proposals, but proposals must pass safety checks, field allowlists, coverage gates, IC gates, and correlation gates before they enter shadow.

### Base-Score Producer

Evolves the base-score spec: factor groups, group weights, enabled factors, and market-state-conditioned weights. Control-space search and champion-challenger replay decide whether a candidate can beat the current champion.

### Excitation Producer

Evolves excitation rules: how theme, flow, momentum, risk, and narrative atoms combine. LLM rule hints and wildcard hints emit candidates only; they do not activate rules.

### Holding-Processing Producer

Turns recommendations into position actions: position ledger, holding analysis, PnL, validation feedback, holding governance, and carryover. It answers what to do now instead of trusting a new market story.
::::

Together, these producers form the body of the strategy. Each night, the system does not ask the LLM to rewrite its opinion. It lets producers emit new inspectable objects, then lets governance decide which objects deserve production authority.

## Lifecycle: From Candidate to Active

The key mechanism in `stock_rec_v3` is lifecycle, not generation.

<div class="process-flow" aria-label="Stock Rec V3 producer lifecycle">
  <section class="process-phase">
    <span>Produce</span>
    <ol>
      <li>LLM hints</li>
      <li>control-space search</li>
      <li>factor graph proposal</li>
      <li>producer emit</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>Isolate</span>
    <ol>
      <li>candidate</li>
      <li>shadow</li>
      <li>observation-only</li>
      <li>audit artifact</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>Evaluate</span>
    <ol>
      <li>coverage gate</li>
      <li>IC / spread</li>
      <li>train / val split</li>
      <li>champion-challenger</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>Serve</span>
    <ol>
      <li>promote</li>
      <li>apply mode</li>
      <li>active spec</li>
      <li>Phase B consumption</li>
    </ol>
  </section>
</div>

This chain has an important meaning: **LLM output has no production authority by default.**

A factor can be proposed, but it cannot become an active factor directly. An excitation rule can be hinted, but it cannot directly rewrite final `effective_excitement`. A spatiotemporal enhancement can produce a sidecar, but it does not replace the main score by default. Holding governance can carry a prior-day action forward, but only through carryover profiles and holding-side rules. Only active specs can affect production scoring in Phase B.

## Nightly Cycle as Governance Loop

A daily strategy sees a new market state and new feedback every day, so the nightly cycle is a governance loop, not merely ETL.

It can be summarized in four parts:

::::cards
### Data and State

Trade-date discovery, Tushare data collection, stock pool construction, market features, market regime, narrative themes, and future returns. The goal is to turn today's state into computable objects.

### Producer Output

FactorCalculator builds a cross-sectional factor matrix. The LLM provides candidates or context only in narrow roles such as factor diagnosis, narrative merging, and rule hints. Shadow factors update their IC traces daily.

### Governance Evaluation

Base score and excitation enter champion-challenger evaluation. Candidates must pass coverage, sample size, train/validation, IC, spread, and stability gates. A good explanation is not enough.

### Production Consumption

Phase B loads active specs only. Recommendations then enter the holding loop: position ledger, holding analysis, PnL, validation feedback, holding governance, and execution report.
::::

The value of this chain is that it turns "what the model thinks is plausible today" into "which governed objects are allowed to affect the strategy today." That is the difference between a financial production system and an ordinary text task.

## The LLM's Proper Place

`stock_rec_v3` does use LLMs. It has many LLM entry points: narrative merging, news hypotheses, factor diagnosis, factor proposals, rule hints, wildcard mutation, governance explanation, and report narrative.

But all of those entry points are low-authority roles:

- The LLM can propose a factor, but it cannot bypass `FactorTestEngine`.
- The LLM can explain a champion-challenger decision, but it cannot replace the promotion gate.
- The LLM can generate rule hints, but candidates still need replay and gates.
- The LLM can write a report narrative, but the narrative does not overwrite active specs.
- If the LLM is unavailable, returns bad JSON, or throws, the system falls back and the nightly cycle continues.

This is the engineering principle for resisting autoregressive mediocrity: do not forbid generation; constrain the authority of generated artifacts.

## Only Active Can Affect the Strategy

One core invariant in `stock_rec_v3` is that governance is the sole owner of active spec parameters. New mechanisms may not bypass governance and directly override active specs, base-score weights, excitation rules, or holding actions.

That constraint gives the system attribution:

::::cards
### It Knows What Is Live

Phase B consumes active base and excitation specs. If no active spec exists, the system falls back to defaults or registry-built structures instead of silently consuming an unvalidated candidate.

### It Knows Why It Is Live

Promotion leaves champion-challenger evaluation, gate outcomes, blockers, metadata, and governance explanations. Recommendation changes trace to specs, not to prompt prose.

### It Knows What Is Not Live

Dry runs do not move the active pointer. Observation-only enhancements only record observations. Default-off features must preserve prior numerical behavior until deliberately enabled.

### It Knows How To Roll Back

When a candidate fails or persistence fails, the system keeps the existing champion or rolls shadow state back. The production path is not permanently polluted by a plausible LLM proposal.
::::

This is where the financial case adds the most to the site's argument. In a creative system, failure may mean a weaker story. In a financial system, failure becomes real position state, transaction cost, and risk exposure. Governance authority must be stronger than generation authority.

## Mapping Back to the Four Mismatches

`stock_rec_v3` makes the four primitive mismatches more concrete.

::::cards
### Aggregation Mismatch

A good single-factor IC, a triggered rule, or a plausible narrative does not imply a good strategy. The system governs aggregation through nonlinear final score, concentration checks, PnL, validation, and holding governance.

### Support Mismatch

Useful new signals may not be in the default active set. The system lets LLMs and control-space search propose low-support candidates, but first places them in shadow, sidecar, or observation-only states.

### State Mismatch

Market regime, trade date, data coverage, position cost, prior conditional actions, and carryover profile are all state. The system preserves state through nightly artifacts, ledgers, governance carryover, and report summaries.

### Specification Mismatch

Natural-language explanation is not a strategy specification. The system grounds specification in coverage, IC, spread, train/validation splits, transaction cost, drawdown, PnL veto, and promotion gates.
::::

## Relation to the Story Insight Cases

V4 and V6 show why high-mismatch tasks need control spaces and layered governance. `stock_rec_v3` shows what the same idea becomes in a financial production system: stricter lifecycle governance.

Read the three cases this way:

1. **V4**: rewrite final generation into control-space governance.
2. **V6**: once a control space exists, diagnose the layer and detect plateau or version regression.
3. **Stock Rec V3**: once the task enters financial production, LLMs may emit candidates only; production authority belongs to objects that pass shadow, promotion, and active lifecycle stages.

If V4's keyword is control space and V6's keyword is layered routing, Stock Rec V3's keyword is:

**production-authority governance.**

## Conclusion

`stock_rec_v3` should be added as a case, and it should be the case library's third domain sample: a financial strategy system.

Its value is not to show that an LLM can analyze stocks. Its value is the opposite: in a high-state-mismatch, high-error-cost domain, LLM analysis is not trusted by default. The system needs producers, lifecycles, gates, replay, holding feedback, and active-pointer governance.

That makes the site's argument more complete. Resisting LLM mediocrity does not mean turning every task into multi-round prompting. It means putting generation inside the right engineering boundary. For financial strategy, the boundary is clear: the LLM may help discover, but it must not own production authority.
