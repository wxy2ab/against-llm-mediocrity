# The Maximum Price of Models

**A Mathematical Model of LLM Willingness to Pay, Task Commoditization, and Token Value Extraction**  
Revised edition | 2026-06-12

---

## Contents

This is a long working paper. The Core Conclusion and Argument Map below give the one-page version; Chapters 1–4 build the pricing model from a single task up to the four-ceiling envelope; Chapter 5 applies it across eight sectors; Chapters 6–7 unpack the most misread parts of cost; Chapters 8–9 give implications and the conclusion.

- [Core Conclusion](#core-conclusion)
- [Argument Map](#argument-map)
- [1. Why Model Capability Does Not Equal Maximum Price](#1-why-model-capability-does-not-equal-maximum-price)
- [2. Single-Task Pricing Model](#2-single-task-pricing-model)
- [3. Market Dynamics: Commoditization and the Hump Curve](#3-market-dynamics-commoditization-and-the-hump-curve)
- [4. The Maximum-Price Envelope](#4-the-maximum-price-envelope)
- [5. Industry Estimates](#5-industry-estimates)
- [6. Tokens Are Search Budget, Not Value](#6-tokens-are-search-budget-not-value)
- [7. State Oscillation in Self-Improving Agents](#7-state-oscillation-in-self-improving-agents)
- [8. Implications](#8-implications)
- [9. Conclusion](#9-conclusion)

---

## Core Conclusion

Users do not pay for a model's aura of capability, parameter count, reasoning length, or token burn. They pay for **verifiable incremental value**. For any task, an LLM's long-run maximum price is jointly constrained by four ceilings:

```text
P_i^* <= theta_i * r_i(C,G,B) * S_i(C,m_i) * V_i^0 - K_i
```

| Constraint | Symbol | Meaning |
|---|---|---|
| Reliability ceiling | `r_i` | Whether the model plus engineering governance can reliably reach an acceptable result |
| Scarcity ceiling | `S_i` | Whether the capability remains scarce after market diffusion |
| Capture-share ceiling | `theta_i` | Whether value is captured by the tool or by IP, data, organization, or distribution |
| Cost ceiling | `K_i` | Whether token, integration, supervision, verification, and risk costs eat the gain |

The resulting tension is counterintuitive: **the tasks models do best are often the least valuable, while the most valuable tasks are often the ones models still cannot do well or cannot capture value from**.

---

## Argument Map

```text
Chapter 1  Why capability != price
Chapter 2  Single-task pricing: success rate, mismatch, willingness to pay, saturation
Chapter 3  Market dynamics: commoditization and the hump curve
Chapter 4  Maximum-price envelope: the four-ceiling formula
Chapter 5  Industry estimates across eight sectors
Chapter 6  Tokens are search budget, not value; router arbitrage
Chapter 7  State oscillation in self-improving agents
Chapter 8  Implications for model companies and buyers
Chapter 9  Conclusion
```

Chapter 2 gives micro-pricing for a single transaction. Chapter 3 adds competition. Chapter 4 compresses both into one envelope formula. Chapter 5 applies it to real sectors. Chapters 6 and 7 unpack the most misread parts of `K_i`.

---

## 1. Why Model Capability Does Not Equal Maximum Price

A common inference is: the stronger the model, the higher the price. That only holds in the **short run, with low diffusion, low competition, or proprietary settings**. In the long run, users do not pay for model capability itself. They pay for **verifiable incremental utility relative to the next-best substitute**.

Pricing is squeezed by two opposing forces:

1. **Commoditization pressure**: once a model can fluently perform a task, supply expands quickly. The customer baseline shifts from expensive human labor to cheaper competing tools, and price gets pushed toward competitive equilibrium.
2. **Reachability pressure**: tasks that still carry high scarcity rent often depend on hidden state, nonlocal structure, rare judgment, IP, organizational process, taste, and governance. General models often cannot reliably reach the near-optimal solution or capture the full value.

This matches the three-regime split:

| Task type | Model performance | Pricing destiny |
|---|---|---|
| Autoregressive extraordinary | Direct output is already near-optimal | Commoditizes fastest |
| Local alignment | Locally correct but globally drifting | Has real value but needs governance |
| LLM mediocrity | Even brute-force sampling rarely reaches a near-optimal result | Highest rents, but the model cannot capture them |

The pricing sweet spot is in the middle: **tasks that have just become reachable, are not yet widespread, and whose validation and delivery can still be bound to the tool vendor**.

---

## 2. Single-Task Pricing Model

### 2.1 Basic Quantities

```text
V_i = value of successfully completing task i
F_i = loss from failure, rework, or risk
H_i = cost of the next-best substitute
r_i^H = success probability of the next-best substitute
```

Supply-side inputs:

```text
C = base model capability
G = prompt / workflow / tool / governance quality
B = test-time compute / sampling / search budget
```

Unified cost term:

```text
K_i = K_token + K_integration + K_supervision + K_verification + K_risk
```

### 2.2 Success Probability and Mismatch

Success is jointly determined by `C`, `G`, `B`, and the task's mismatch load:

```text
L_i = w_A * A_i + w_U * U_i + w_D * D_i + w_M * M_i + w_F * F_i + w_R * R_i + sum_{j<k} w_jk * m_ij * m_ik
```

where:

- `A_i`: aggregation mismatch
- `U_i`: support mismatch
- `D_i`: state mismatch
- `M_i`: specification mismatch
- `F_i`: fitting-boundary mismatch
- `R_i`: observation-representation mismatch

Success probability is capped by effective mismatch:

```text
r_i(C,G,B) = r_min + [r_max(G,B,L_i) - r_min] * C^eta / (kappa_i^eta + C^eta)

r_max = sigmoid( a_i + beta_G * G + beta_B * log(1+B) - lambda_i * L_i^eff(G) )
L_i^eff(G) = L_irreducible + L_transformable * exp(-phi_i * G)
```

Three implications follow:

1. `r_max` is not 1; pure direct generation is structurally capped.
2. Governance `G` works by **moving transformable mismatch out of the model**, not by magically making the model smarter.
3. Search budget enters through `log(1+B)`, so token returns naturally diminish.

### 2.3 Willingness to Pay

Customers compare two expected utilities:

```text
EU_i^AI = r_i * V_i - (1-r_i) * F_i - K_i
EU_i^H  = r_i^H * V_i - (1-r_i^H) * F_i - H_i
```

Maximum willingness to pay is:

```text
P_i^* = max[ 0, (H_i - K_i) + (r_i - r_i^H) * (V_i + F_i) ]
```

It has two parts:

- **Cost substitution**: `H_i - K_i`
- **Reliability premium**: `(r_i - r_i^H)(V_i + F_i)`

This is why high-value tasks are brutal. They have both high `V_i` and high `F_i`. If AI does not beat the baseline, the reliability term turns negative and large `F_i` punishes it even harder.

### 2.4 Price Saturation

If pure autoregressive performance is capped:

```text
lim_{C->inf} r_i(C, 0, B) = r_bar_i < 1
```

then price is capped too:

```text
lim_{C->inf} P_i^* = max[ 0, (H_i - K_i) + (r_bar_i - r_i^H) * (V_i + F_i) ]
```

The way out is not a bigger `C`, but stronger `G` that reduces `L_i^eff`. This is the line between selling a model and selling a system.

---

## 3. Market Dynamics: Commoditization and the Hump Curve

When capability spreads through the market, scarcity rent decays:

```text
S_i(C, m_i) = exp[ -lambda_i * a_i(C) * m_i ]
V_i(C, m_i) = V_i^0 * S_i(C, m_i)
```

Competition also shifts the customer's baseline:

```text
H_i(t) = min( H_i^human, P_competitor(t) + switching_cost )
```

So commoditization works through two channels:

- scarcity decay destroys premium;
- baseline drift destroys the substitute-cost anchor.

The result is a hump curve:

```text
cannot do it -> just became doable and not yet widespread -> everyone can do it
price 0      -> price peak                           -> price collapses toward cost
```

The business problem is therefore simple to state: **how long can a vendor stay near the hump peak, and what non-commoditizable residue remains afterward**.

---

## 4. The Maximum-Price Envelope

Introduce `theta_i`, the share of incremental value the tool vendor can actually capture:

```text
P_i^* = max[ 0, theta_i * { (H_i - K_i) + (r_i - r_i^H) * (V_i^0 * S_i + F_i) } ]

P_i^* <= theta_i * r_i(C,G,B) * S_i(C,m_i) * V_i^0 - K_i
```

`theta_i` is low when value depends on the customer's IP, proprietary data, organization, license, or distribution. It rises when the tool binds validation pipelines, delivery loops, or proprietary data.

All four ceilings matter:

- low `r_i`: nothing reliable to sell;
- low `S_i`: no scarcity left;
- low `theta_i`: value exists but does not accrue to the tool;
- high `K_i`: cost absorbs the gain.

---

## 5. Industry Estimates

To compare sectors, use:

```text
P_seat^* ~= theta * rho * H_month
```

where `H_month` is monthly human fully loaded cost, `rho` is reliably replaceable or augmentable capacity, and `theta` is the actually capturable share.

### 5.1 Software Development

- `H_month`: $12k-$25k
- `rho`: 20%-50%
- `theta`: 5%-15%
- Estimated ceiling after compression: **$100-$1,500 / seat / month**
- Status: completion tools are already past the peak; agent workflows form a smaller second hump

The paradox is that strong validators such as compilers and tests both raise `r_max` and accelerate commoditization.

### 5.2 Legal Services

- Document review and due diligence: **$10-$100 / batch**
- Full-process law-firm assistant: **$100-$1,000 / lawyer / month**
- Litigation strategy and courtroom judgment: **`theta ~= 0`**

Regulation, liability, and licensed-human supervision keep `theta` structurally low.

### 5.3 Healthcare

- Clinical documentation / scribe tools: **$100-$600 / doctor / month**
- Assisted diagnosis embedded in devices or workflows: **$1-$20 / case**
- Independent diagnostic decision-making: **current `theta ~= 0`**

Healthcare shows the strongest gap between high value and low sellable capture share.

### 5.4 Finance

- Compliance / risk: **$200-$1,000 / seat / month**
- Investment copilot: **$50-$300 / seat / month**
- Proprietary-data-bound systems: **$1,000-$3,000 / seat / month**

Alpha is self-destroying: once everyone can mine it, its value collapses.

### 5.5 Customer Support

- Outcome-based pricing: **$0.3-$2 / successful resolution**
- Long-run trend: toward marginal token cost plus thin margin

Support is a textbook right-side-of-the-hump industry.

### 5.6 Content and Marketing

- General writing tools: **$10-$50 / seat / month**
- Brand/distribution-data-bound systems: **$500-$5,000 / team / month**
- Single pieces of content: **$5-$50 / piece**, trending toward zero

AI here does not only commoditize production; it also dilutes the market value of the output itself.

### 5.7 Education

- Consumer AI tutoring: **$10-$40 / student / month**
- Institutional purchase: **$5-$20 / student / month**
- True tutoring-substitution value is much higher, but hard to monetize because validation is slow and attribution is weak

### 5.8 Research and Drug Discovery

- Tool layer: **$10,000-$100,000 / lab / year**
- Wet-lab-bound pipeline collaboration: **milestones plus revenue share, up to $10^7-$10^8**

This is the limit case: value is enormous, but only verifiable validation pipelines can unlock it.

### 5.9 Cross-Industry Regularities

1. Strong validation raises both reliability and commoditization speed.
2. High `F_i` can either amplify premium or destroy capture share, depending on liability structure.
3. Willingness to pay and value creation diverge systematically when validation cycles are long.
4. Durable high pricing exists only in bundles with proprietary data, IP, validation pipelines, licenses, or organizational lock-in.

---

## 6. Tokens Are Search Budget, Not Value

Public APIs bill per token, so token burn is easy to measure and easy to treat as a proxy for value. It is not. Tokens are a search budget, and search budget belongs on the cost side. Writing task value as a function of token count `T`, and its marginal return on investment (MROI) as the derivative, makes this explicit:

```text
Value(T) = r_i(T) * V_i - [1-r_i(T)] * F_i
         - c_T * T - K_latency(T) - K_governance(T) - K_oscillation(T)

MROI(T) = (V_i + F_i) * dr_i/dT
        - c_T - dK_latency/dT - dK_governance/dT - dK_oscillation/dT
```

Because `dr_i/dT` diminishes while latency and governance costs rise, marginal ROI must eventually cross below zero.

Useful token-yield metrics are therefore things like:

- `Delta r / 1M tokens`
- validated candidates per 1M tokens
- new rubrics, edge cases, state variables, or Governed Knowledge Objects (GKOs) found per 1M tokens
- human review time or rework reduced per 1M tokens

The common feature is that the numerator is a **verifiable state change**, not more text.

### 6.1 Router Arbitrage and Token Leverage

A recent pricing episode makes the cost side visible. A premium frontier model entered the market at a much higher per-token price than adjacent coding agents. Many developers responded with a two-model workflow:

```text
premium model:      compress intent, write architecture, produce specifications
low-price agent:    expand the specification into code, tests, edits, and retries
```

This looks like rational arbitrage. The expensive model is used for the scarce, high-density part of the task; the cheaper agent absorbs the long execution tail. But it also reveals why token prices have a hard ceiling. Let:

```text
T_I = intent tokens: planning, architecture, constraints, review standards
T_E = execution tokens: file reads, patches, tests, retries, logs
L   = T_E / T_I       token leverage ratio
p_I = price per intent token
p_E = price per execution token
```

The routed cost is:

```text
K_route = p_I * T_I + p_E * T_E + K_handoff + K_verification
        = T_I * (p_I + L * p_E) + K_handoff + K_verification
```

If `L` is 50, 100, or higher, most token volume migrates to the cheapest competent execution layer. The premium model can charge more only while its intent tokens create enough additional reliability or compression to offset the entire routed cost. Its ceiling is not:

```text
premium price ~= model intelligence
```

but:

```text
p_I^* <= [Delta verifiable value - L * p_E * T_I - K_handoff - K_verification] / T_I
```

This creates a paradox for both sides of the market.

For the premium model, high per-token price suppresses throughput. If users reserve it for rare "oracle" moments and push the execution tail elsewhere, the vendor may win high unit price but lose volume, data about execution, and fixed-asset utilization. The model becomes a planning layer that is too expensive to let run.

For the subsidized execution agent, low price can capture usage and workflow position, but it also imports a large cost burden. If the agent is paid per seat or bundled below marginal cost, token leverage turns adoption into a gross-margin problem. The more successful the arbitrage, the more execution tokens it must absorb.

The deeper point is that value can leak across the router boundary. Architecture documents, task plans, rubrics, and planning trees are portable artifacts. Once a user feeds premium-model intent into a cheaper execution agent, the scarce part of the work is no longer fully enclosed by the premium vendor. Even without assuming any training on customer data, the operational value has moved into the execution workflow. If logs, feedback, or traces are retained under the relevant product terms, the leakage can also become an intent-to-execution data flywheel.

The long-run equilibrium therefore has two stable directions:

```text
premium layer  -> stop selling naked tokens; sell closed-loop outcomes
execution layer -> drive marginal execution cost down; sell governed throughput
```

The premium layer must bundle planning with validation, delivery, and accountability, so that users cannot easily export its highest-value intermediate states. The execution layer must reduce marginal token cost through routing, distillation, caching, local inference, and tighter tool loops, because raw execution volume is economically unforgiving.

The transient two-model stack is useful, but it is not a durable pricing foundation. It is a symptom of mismatch between where task value is created and where tokens are consumed.

---

## 7. State Oscillation in Self-Improving Agents

The most hidden form of token waste is the self-improvement loop:

```text
z_{t+1} = A(z_t, critique_t, prompt_t) + epsilon_t
U_t = U(y_t; z_t, s)
```

Without external state and strong validators, the system can oscillate among locally plausible states instead of converging on real value:

```text
z_1 -> z_2 -> z_3 -> z_1 -> ...
```

If an iteration does not create reusable and verifiable control objects, it is still just output-space sampling in disguise.

---

## 8. Implications

### For Model Companies

- Report value per token, not token burn.
- Build control-space products such as rubrics, state matrices, validators, and reusable governance objects.
- Bind deeply to proprietary data, workflows, and validation pipelines.
- Use pricing structures that match sector validation cycles.
- Avoid relying on naked premium-token pricing when users can export intent to cheaper execution layers.

### For Buyers

- Ask whether the task still has scarcity rent.
- Measure real `Delta r` with your own validation standards.
- Put failure cost `F_i` into contracts.
- Refuse to pay for oscillation and redundant sampling.
- Include supervision cost in total cost of ownership.
- Route models by verified marginal value, not by perceived intelligence; track the handoff cost between planning and execution.

---

## 9. Conclusion

The maximum price of LLMs is not set by fluent output, long reasoning traces, or sheer token burn. It is set by whether capability, tokens, and governance can be turned into value that is **verifiable, capturable, and still scarce**.

```text
long-run maximum price = theta x (verifiable incremental value x residual scarcity) - token / governance / risk cost
```

Across the eight industries, no durable high-price band is sustained by pure model capability alone. Every durable high-price band sits on validation pipelines, proprietary data, IP, or organizational closed loops. Model companies should not be selling tokens. They should be selling validated state change.

The same logic applies to multi-model workflows. If one model supplies dense intent and another consumes the execution tail, the price ceiling is set by the whole route, not by either model in isolation. A high-price model must keep its value inside a closed loop of outcome, validation, and accountability; a low-price agent must make execution tokens cheap enough that usage growth does not destroy margin. Otherwise, the market merely converts intelligence theater into token-accounting pressure.
