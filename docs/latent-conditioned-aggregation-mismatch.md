# Latent-Conditioned Aggregation Mismatch

## An Advanced Form of Aggregation Mismatch: From Latent Structure to Surface Realization Across Representation Layers

**Status: advanced aggregation-subtype working draft v0.2**  
**Taxonomic discipline: keep it inside aggregation mismatch; do not add a new primitive; do not modify the six-mismatch taxonomy**  
**Primary source: hidden lines, subtext, implicit value structure, and reader inference in long-form fiction writing**  
**Formal name: Latent-Conditioned Aggregation Mismatch**  
**Usable alias: Latent-Surface Aggregation Mismatch**

---

## Abstract

Some high-value generation tasks do not merely require multiple surface parts to stay mutually consistent. They require multiple surface choices to be jointly constrained by one complete latent structure. That latent structure `H` must remain complete at the control layer, yet it must not be fully copied into the final delivery surface.

So the problem is not that global dependence disappears. Rather:

```text
global dependence is no longer expressed mainly as direct dependence among surface parts;
it is mediated by a shared latent structure that constrains multiple surface choices.
```

Ordinary aggregation mismatch looks more like:

```text
y_i <-> y_j
```

for example: scene A must stay consistent with scene F, a setup must pay off at the end, or a local edit must not break the whole structure.

The advanced form discussed here looks more like:

```text
          H
       /  |  \
     y1   y2  y3 ... yn
```

Where:

- `H` is a complete latent structure that should not directly enter the finished artifact;
- `y_i` are surface realizations such as dialogue, action, objects, scenes, wording, interfaces, hints, or signals;
- the `y_i` do not have to directly refer to one another;
- but they must all remain causally constrained by the same `H`.

This paper argues that the phenomenon should not be elevated into a "seventh primitive mismatch." It should instead be defined as an **advanced subtype inside aggregation mismatch**: **latent-conditioned aggregation mismatch**. The failure still occurs at the same value-preservation station from existing structure/candidates to composition and realization to finished output, and the main repair target is still compositional governance. What changes is the composition object: from relations among surface parts to cross-layer relations between latent structure and surface realization.

The most compact frozen definition is:

> **Latent-conditioned aggregation mismatch** occurs when multiple local choices in the final artifact must be jointly constrained by one complete latent structure, while task value also requires that structure not be fully explicit; the system therefore fails to preserve latent control consistency, surface restraint, and receiver inferability at the same time.

---

## 1. Why Move It Back Inside Aggregation Mismatch

The admission rule for the six primitive mismatches is simple: if two phenomena happen at the same value-preservation station and mainly require the same repair target, they should not be split into separate primitives. A new primitive needs:

1. an independent station;
2. an independent repair target;
3. a constructible minimal pair.

At present, this phenomenon does not meet that bar.

Its failure still occurs in:

```text
existing structure / candidates
  -> composition and realization
  -> finished artifact
```

And the main repair remains:

- maintaining global constraints;
- preserving long-range consistency;
- auditing whether local choices jointly form a high-value whole;
- using full-text audit, Stage Repair, governed projection, and bounded repair to write residuals back into the control layer.

So the more stable classification is not "a seventh station," but:

> **an advanced form of aggregation mismatch under cross-layer conditions.**

---

## 2. It Is Not the Absence of Global Dependence; It Is Global Dependence Mediated by Latent Structure

The key wording to tighten is this: the phenomenon is not "no longer global dependence." It is global dependence carried in a different way.

In ordinary aggregation mismatch, dependence is mainly written as:

```text
y_i <-> y_j
```

For example:

- scene A must stay consistent with scene F;
- a setup must be paid off at the end;
- one edit cannot destroy whole-document structure;
- a local module repair cannot break another module.

In latent-conditioned aggregation, the structure is better written as:

```text
          H
       /  |  \
     y1   y2  y3 ... yn
```

Its core point is:

- the `y_i` do not have to directly reference one another;
- but they must all remain faithful to the same `H`;
- global consistency is no longer stored mainly inside the surface sequence; it is stored in the fact that a shared latent structure acts as the common cause of multiple surface choices.

So it is still global dependence, except:

> **global dependence is no longer expressed mainly as direct dependence inside the surface sequence; it is mediated by a complete latent structure that jointly constrains multiple surface choices.**

---

## 3. Formalization: Why It Is Still Aggregation

Ordinary aggregation mismatch can be written as:

\[
Y = A(y_1,\ldots,y_n)
\]

The problem is that locally plausible `y_i` fail to preserve global value after composition.

Latent-conditioned aggregation is more accurately written as:

\[
y_i = R_i(H, D_i, C_i), \qquad
Y = A(y_1,\ldots,y_n)
\]

Where:

- `H`: the complete latent structure;
- `D_i`: the disclosure strength allowed for the current part;
- `C_i`: the local context;
- `R_i`: the realizer that projects latent structure into the current surface part;
- `A`: the composition operator that combines surface parts into the finished artifact.

So real task value does not only require:

\[
\operatorname{Consistent}(y_1,\ldots,y_n)
\]

It also requires:

\[
\operatorname{Faithful}(Y,H)
\]

while ensuring that:

\[
\operatorname{ExplicitLeakage}(H,Y)
\]

does not become too high.

In other words, this is a composition problem with a special constraint:

> **preserve the control power of the latent structure over the surface artifact in full, without fully copying the latent structure itself.**

That still belongs to the composition/realization station rather than to a new primitive station.

---

## 4. In What Sense It Is More Advanced Than Ordinary Global Dependence

Ordinary global dependence can often be improved by "writing the complete object out":

- write the full plan first;
- write the whole-document skeleton first;
- generate a complete candidate;
- then check cross-part consistency.

This is also the main line in many existing aggregation-mismatch experiments: full candidates turn otherwise unobservable cross-part conflicts into auditable residuals, and Ladder, full-text audit, and Stage Repair all work in that direction.

But latent-conditioned aggregation has an extra difficulty:

```text
writing out H in full helps control generation;
writing H into Y in full damages final value.
```

So the question is not merely:

```text
was the global structure written out completely?
```

It is:

```text
does the global structure exist in complete form at the control layer,
and is it projected correctly at the delivery layer?
```

That yields two different notions of completeness.

### 4.1 Control completeness

Latent motives, hidden lines, full solutions, strategies, risk models, or residual branches must exist in complete form.

### 4.2 Expressive incompleteness

The final surface may show only selected evidence, hints, interfaces, or signals from that structure, rather than the full structure itself.

So the genuinely higher-order aspect is:

> **ordinary aggregation governs composition within one representation layer; latent-conditioned aggregation governs composition across two representation layers.**

---

## 5. Why "Latent Space Dependence" Is the Wrong Name

It is not a good idea to formalize this as "latent space dependence."

In machine-learning language, `latent space` usually suggests:

- hidden vectors inside the model;
- neural representation spaces;
- embedding manifolds;
- hidden-layer activations.

But the present phenomenon does not require `H` to live inside the model. `H` can be external and explicit to the control system, for example:

- a character-motive ledger;
- a complete side-arc graph;
- a private-state table;
- a strategy model;
- a full proof;
- a fault-hypothesis graph;
- a user-uncertainty graph.

So the right relation is:

```text
latent to the delivered artifact / receiver
explicit to the authoring or control system
```

That also explains why the solution is not to ask the model to "reason in latent space." The solution is:

> **make the latent structure an explicit control object.**

---

## 6. When It Really Counts as This Advanced Subtype

Not everything unsaid belongs to latent-conditioned aggregation mismatch. At least four conditions must hold.

### 6.1 A complete latent structure `H` exists

Not just a vague "feeling," but a complete control structure that can be externally represented, audited, and revised.

### 6.2 `H` has counterfactual causal impact on multiple surface choices

If `H` changes, multiple local choices should shift systematically, not just one explicit explanatory sentence.

### 6.3 Fully making `H` explicit would lower task value

Not merely "it would be longer," but "it would make the task worse." For example:

- a hidden line is spoiled;
- a teaching hint turns into giving away the answer;
- an MSHQ turns into dumping the whole internal problem graph onto the user;
- a diplomatic phrase becomes open disclosure of the entire strategy.

### 6.4 The surface output must still carry enough imprint

The receiver, verifier, or environment must still be able to form some correct inference, update, or action from `Y`.

So this is not ordinary compression. Ordinary compression tries to:

```text
recover as much original information as possible under limited bandwidth
```

Here the goal is:

```text
preserve control in full,
intentionally transmit content incompletely,
and precisely govern what part the receiver can reconstruct.
```

This can be summarized as:

> **Cross-Layer Aggregation under Asymmetric Bandwidth**

---

## 7. Typical Failure Forms

### 7.1 Missing latent control

The surface looks restrained, but no complete `H` exists. The choices look subtle without having a real common cause.

### 7.2 Latent-structure leakage

The full control structure is directly stated in narration, explanation, interface text, or question wording, reducing final value.

### 7.3 Inert setting

`H` exists in the outline or state ledger, but dialogue, action, objects, and interface behavior are barely constrained by it.

### 7.4 Disclosure-timing error

Signals that should be distributed gradually are concentrated too early, or evidence that should be delayed is delivered too soon.

### 7.5 Receiver cannot reconstruct

The surface is restrained, but the imprint is too weak, too random, or too non-discriminative for the receiver to reach the target posterior.

### 7.6 Over-projection

In order to maintain consistency, the control layer copies high-bandwidth latent structure directly into the delivery layer, causing surface failure.

---

## 8. Governance Direction: From Full Explicitness to Governed Projection

If this is an advanced subtype of aggregation mismatch, the repair direction is still compositional governance. The governance object simply gets expanded.

### 8.1 Authoritative latent-structure ledger `H`

Maintain a complete control structure such as:

- true motives, side arcs, and value debts in stories;
- full solutions, misconceptions, and concept graphs in teaching;
- residual branches, failure evidence, and uncertainty graphs in agents;
- private state, reservation price, opponent model, and commitment boundaries in negotiation.

### 8.2 Disclosure contract `D`

Constrain how much may be realized, when it may be realized, and through which channel it may be realized.

### 8.3 Scene- or interaction-local projection `R_i(H,D_i,C_i)`

Do not force every step to reread the full `H`. Instead, render a minimally sufficient local projection from the authoritative control layer.

### 8.4 Dual-sided audit

**Control-side audit:** does `Y` remain truly constrained by `H`?  
**Receiver-side audit:** does `Y` leak too much, too little, or produce the wrong posterior?

### 8.5 Bounded repair

Repair should not default to adding more explanation. It should first ask:

- is `H` missing?
- is the `H -> y_i` projection wrong?
- is `D_i` too strong or too weak?
- are several `y_i` drifting away from the same `H`?

---

## 9. This Is Not Just a Story Problem

The shared structure is:

```text
the system must maintain a high-bandwidth, complete H;
the final output may expose only a low-bandwidth Y;
fully stating H would damage value;
yet Y must still be truly and stably controlled by H;
and the receiver must still gain some correct inference or actionability from Y.
```

### 9.1 Hidden lines and subtext in stories

The author knows the full hidden line; the reader only sees distributed evidence.

### 9.2 Teaching hints

The teacher knows the full solution, but cannot directly hand over the answer; only minimally sufficient hints should be chosen so the learner reconstructs it.

### 9.3 MSHQ / GEsO / minimal-sufficient agent questions

An agent may possess the full residual and uncertainty graph, but should not dump the whole internal problem graph onto a human; it should emit only the smallest question that unblocks progress.

### 9.4 Pragmatics, implication, and indirect language

The speaker maintains real intent, common knowledge, relationship structure, and risk, yet produces only a governed utterance that lets the target receiver infer the intended meaning.

### 9.5 Negotiation and selective disclosure

The sender maintains full private state but changes the receiver posterior only through a price, a commitment, a silence, or a small signal.

### 9.6 APIs, modularity, and user interfaces

Internal state machines, invariants, and recovery logic remain complete, while the public interface exposes only a minimally sufficient surface.

### 9.7 Privacy-constrained explanation

The system knows the full reason but cannot reveal it completely; the output must remain faithful rather than turning into generic empty language after deletion.

### 9.8 Scientific summaries and decision memos

The full argument graph exists, but only a low-bandwidth expression acceptable under the current budget and authority boundary can be delivered.

These are not just superficially similar cases. They are structurally isomorphic.

---

## 10. Which Domains Are Best for First Validation

The domains can be grouped by validation strength.

### 10.1 Highest priority

- **stories**: where the phenomenon was first exposed;
- **teaching hints**: the full solution must exist, but cannot be directly delivered;
- **MSHQ**: the full residual graph must exist, but must be projected into the smallest possible question;
- **pragmatic utterances**: even one sentence can require high-dimensional latent control over a low-bandwidth surface.

Together these cover:

- long-form artistic generation;
- short teaching interaction;
- agent-human interface;
- single-utterance natural-language pragmatics.

If the same intervention helps in all four, it becomes much harder to dismiss the effect as just "a fiction-writing trick."

### 10.2 Second priority

- negotiation and selective disclosure;
- API / UI abstraction;
- privacy-constrained explanation.

### 10.3 Extension domains

- scientific summaries;
- decision memos;
- brand, product voice, and organizational expression.

---

## 11. A More Precise Three-Level Aggregation Structure

Instead of adding a seventh primitive, it is more useful to split aggregation mismatch internally into three levels.

### Level 1: local composition mismatch

Local parts are individually plausible, but fail after composition.

Typical examples:

- SQL clauses;
- code modules;
- plan steps;
- configuration fragments.

### Level 2: surface-level global aggregation mismatch

Long-range commitments, dependencies, foreshadowing, and invariants are not preserved.

Typical examples:

- long documents;
- long-horizon agent trajectories;
- multi-file changes;
- multi-stage workflows.

### Level 3: latent-conditioned aggregation mismatch

Multiple surface choices must be jointly governed by latent structure `H`, while `H` cannot be fully copied onto the delivery surface.

Typical examples:

- hidden lines;
- hints;
- implications;
- MSHQs;
- selective disclosure;
- low-bandwidth strategic signaling.

If further subdivision is needed, Level 3 can be split into:

### 3A. Latent consistency

Is `Y` truly governed by `H`?

### 3B. Disclosure governance

How much of `H` is expressed, and when?

### 3C. Receiver reconstruction

What posterior does the receiver form from `Y`?

This three-level structure is already sufficient to capture the present phenomenon without changing the six-mismatch taxonomy.

---

## 12. Minimal Experimental Design

To validate this subtype, the key is not to mix up "generating the latent structure" with "correctly projecting the latent structure onto the surface."

### 12.1 Fix an oracle latent structure

Each instance should specify at least:

```text
H = complete latent structure
D = disclosure rule
C_i = local context
Y* = acceptable surface samples or acceptance criteria
```

### 12.2 The comparison is not "with H vs without H," but "how H is projected into Y"

The main comparison should be among:

- full `H` directly shared into the generation prompt;
- structured `H` fully read by the writer;
- `H` maintained externally and projected locally;
- conditions with and without control-side / receiver-side audit.

### 12.3 Key endpoints

1. whether multiple `y_i` jointly preserve `H`;
2. whether explicit leakage is too high;
3. whether the receiver forms the target posterior;
4. whether overall task value rises;
5. what the cost, variance, and repair stability look like.

---

## 13. Current Claim Ceiling

### What can be claimed now

- This is a higher-order aggregation problem, not an already-established new primitive.
- Its global dependence is mediated by a shared latent structure rather than residing mainly inside the surface sequence.
- High-value generation may require complete control-layer structure together with restrained delivery-layer expression.
- "Put the full structure into the prompt" may create a tradeoff between stronger control and stronger leakage.
- Stories, teaching hints, MSHQs, and pragmatics are the four best domains for first validation.

### What cannot be claimed now

- The six primitive mismatches should become seven.
- The phenomenon must live inside the model's internal latent space.
- Every kind of hidden information belongs to this advanced subtype.
- Governed projection must outperform full explicitness in all cases.
- All related failures cannot be partly explained by state, support, specification, or fitting-boundary mismatch.

---

## 14. Frozen Naming

### Preferred formal name

> **Latent-Conditioned Aggregation Mismatch**

The advantage of this name is that it makes three things explicit:

- it belongs to aggregation mismatch;
- its special feature is that aggregation is conditioned by latent structure;
- it is not a seventh primitive category.

### Usable alias

> **Latent-Surface Aggregation Mismatch**

This is shorter, but formal documents should still prefer the conditional wording so the phenomenon is not mistaken for a new top-level class.

### Names not recommended as the formal name

- latent-space dependence;
- subconscious mismatch;
- candidate seventh mismatch;
- latent-structure-surface-realization mismatch.

The last one is not wrong descriptively. It is just too easy to read as a standalone class name, which weakens the key point that this belongs inside aggregation mismatch.

---

## 15. Frozen Definitions

### One-sentence structure

> Multiple surface choices are not mainly coupled directly to one another; they are jointly constrained by one complete latent structure.

### One-sentence subtype definition

> Latent-conditioned aggregation mismatch occurs when multiple local choices in the final artifact must be jointly constrained by one complete latent structure, while task value also requires that structure not be fully explicit; the system therefore cannot preserve latent control consistency, surface restraint, and receiver inferability at the same time.

### One-sentence engineering direction

> Do not copy the full latent structure onto the delivery surface without governance; maintain an authoritative `H`, a disclosure contract `D`, local projections `R_i`, and separate audits for control consistency and receiver posterior.

---

## 16. Conclusion

The most reasonable contraction is now clear: **do not treat this phenomenon as a seventh primitive mismatch; treat it as an advanced subtype inside aggregation mismatch.**

It is still a global-dependence problem, except that:

- dependence is no longer written mainly as direct relations among surface parts;
- it is written as a shared latent structure jointly constraining multiple surface choices.

So what really needs governance is not simply "does a global structure exist," but:

```text
does the global structure exist in complete form at the control layer;
is it projected correctly to the delivery layer;
does it preserve control without leaking too much;
and does it lead the receiver to the target inference?
```

That definition already extends naturally beyond fiction, covering teaching hints, pragmatic language, MSHQs, negotiation signals, API abstraction, privacy-constrained explanation, and high-level information compression.

At the current stage, placing it back inside aggregation mismatch produces a more stable theory and better respects the admission discipline of the present taxonomy.
