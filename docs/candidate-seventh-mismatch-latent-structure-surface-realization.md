# Latent-Structure-Surface-Realization Mismatch

## A Working Draft on a Candidate Seventh Phenomenon: Complete Internal Control, Sparse External Representation, and Governed Receiver Inference

**Status: Candidate phenomenon document v0.1**  
**Taxonomic discipline: do not add it to the six primitive mismatches; do not modify the current taxonomy**  
**Primary source: hidden lines, subtext, implicit value structure, and reader inference in long-form fiction writing**  
**Candidate name: Latent-Structure-Surface-Realization Mismatch**  
**Working shorthand: latent-surface mismatch**

---

## Abstract

High-quality writing depends not only on first-order taste that can be directly observed, such as restraint, omission, empty-camera moments, rhythm, and language texture. It also depends on many second- and third-order structures that should not be fully written into the finished text, yet must continue to govern it: motives characters never say aloud, complete side arcs that are not frontally unfolded, off-screen events, implicit values, false beliefs, relationship debts, delayed promises, and the suspicions, misreadings, and revaluations readers should form at different stages.

These structures have a special asymmetry:

```text
internal control strength must be high;
external direct explicitness must be low;
cross-scene causal influence must persist;
yet the receiver must still be able to gradually reconstruct the structure from sparse distributed evidence.
```

Simply "writing the hidden line more clearly" does not solve the problem. Once the hidden line enters the shared generation context with high salience, the model may directly explain into the prose what was supposed to remain an author-side control structure. If it is not written down, the hidden line may disappear, break apart, or survive only as inert background setting. The system then oscillates between "there is no real hidden line" and "the hidden line gets bluntly stated."

This document provisionally calls the phenomenon **latent-structure-surface-realization mismatch**. It may imply a station in the value-preservation pipeline that has not yet been separately articulated:

```text
complete latent control structure H
  -> surface realization Y constrained by a disclosure policy
  -> an interpretation distribution q_t formed by the receiver over time
```

Current evidence is not sufficient to declare this the seventh primitive mismatch. Existing aggregation mismatch already covers hidden constraints, long-range relations, global invariants, and rendering. State, support, specification, and fitting-boundary mismatch may also explain important parts of the phenomenon. So the task of this paper is not to expand the taxonomy, but to freeze the phenomenon, give a candidate definition, mark its boundary with the existing six mismatches, and specify what minimal pairs, interventions, and measurements would be required to decide whether it is:

1. a latent-structure realization subtype inside aggregation mismatch;
2. a composite phenomenon involving aggregation, state, support, specification, and other mismatches;
3. an independent mechanism axis;
4. or a genuinely independent seventh station of value-preservation failure.

The most conservative and useful conclusion for now is: **high-value generation does not always require fully transmitting the internal value structure into the output; sometimes it requires the complete structure to govern the output in a low-bandwidth, distributed, and temporally staged way.**

---

## 1. Why Record This Candidate Phenomenon First

The current six primitive mismatches are organized by a value-preservation pipeline from world to output:

```text
S_world
  -> observation
  -> representation
  -> belief / state
  -> capability routing
  -> candidate support
  -> aggregation
  -> evaluation
```

They answer, respectively: whether decisive variables enter representation, whether belief stays faithful to evidence, whether the right capability is activated, whether high-value candidates are reachable, whether local parts compose into a global object, and whether the evaluation target represents real utility. See:

- [Six Primitive Mismatches: a pipeline-derived taxonomy](./six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md)
- [Aggregation mismatch and compositional governance](./aggregation-mismatch-compositional-governance-llm-systems.md)
- [State mismatch and state governance](./state-mismatch-state-governance-llm-systems.md)
- [Support mismatch and control-space search](./support-mismatch-control-space-search-llm-systems.md)
- [Specification mismatch and objective governance](./specification-mismatch-objective-governance-llm-systems.md)

This taxonomy is deliberately restrained. A phenomenon should qualify as a new primitive only if it occupies an independent structural station, requires a non-substitutable repair target, and admits minimal pairs that hold other stations approximately fixed.

So this working draft does not claim that "the seventh mismatch has been discovered." It is recorded because fiction writing exposed a value-preservation requirement that current descriptions do not yet capture precisely enough. The requirement is not merely to make more structure enter the final object, but to let a complete structure:

```text
exist on the author side;
continuously constrain local choices;
not be directly copied to the reader side;
yet still become inferable by readers through the resulting text.
```

If we do not record it separately now, the phenomenon is easily collapsed into rough labels like "long-range consistency," "more hidden constraints," or "not subtle enough." That would lose the most valuable research question: **do internal control and external expression require two different representations, with different strengths, permissions, and validation conditions?**

---

## 2. From First-Order Taste to Second- and Third-Order Taste

### 2.1 First-order taste: directly observable properties of the finished artifact

Many forms of writing taste can be described and audited directly on the finished work:

```text
restraint
omission
empty-camera moments
less explanation
avoid melodrama
elastic rhythm
dialogue does not carry too much information
do not repeat the theme
```

These requirements act mainly on the final text `Y`. A system can check whether a sentence over-explains, whether a paragraph is redundant, or whether a scene lacks breathing space.

### 2.2 Second-order taste: generation causes that should be complete but should not fully appear

At a deeper level, quality comes from structures readers may not directly see, but can still feel as causal presence:

```text
a character is always compensating for an old incident never directly explained;
an unfinished side arc explains several choices that otherwise look independent;
characters appear to argue about interests, but are actually testing whether loyalty still exists;
the story never declares a value system, but event selection is continuously constrained by it;
an object appears several times, not as decorative symbolism, but as the physical carrier of relationship debt.
```

These are not merely "content in the prose." They are first of all **latent generative structures** that determine why the prose is chosen the way it is.

### 2.3 Third-order taste: control over the receiver's inference trajectory

At an even higher level, we also care about:

```text
when the reader should only feel something is off;
when two competing explanations should become available;
when the reader should reinterpret the earlier text;
which facts should remain unconfirmed even at the end;
which hidden lines must be reconstructable, but cannot be decoded in one sentence.
```

This is not merely hidden information. It is the design of how the receiver's belief should evolve. Good narrative is not just "the reader does not know." It places the reader in different, intentionally designed posterior regions at different times.

So, provisionally, we can distinguish three layers:

| Layer | Main object | Core question |
|---|---|---|
| First-order taste | Surface text properties | What does the finished work look and read like? |
| Second-order taste | Author-side latent structure | Which unsaid relations continuously determine surface choices? |
| Third-order taste | Disclosure and inference strategy | At what time, and with what degree of certainty, should the receiver understand what? |

This is not a full literary theory. It is only the minimum structure needed to isolate the present candidate phenomenon.

---

## 3. Core Phenomenon: High Control, Low Explicitness

The center of this candidate phenomenon is not "information is hidden," but that two strengths must be decoupled:

```text
control strength      = how strongly the latent structure controls generation decisions
surface explicitness  = how directly the latent structure is stated in the final artifact
```

A high-value hidden line requires:

```text
control strength      high
surface explicitness  low
```

At the same time, it also requires:

```text
causal imprint        high
reader inferability   nonzero and controlled
premature certainty   low
```

This yields four typical states:

| Control strength | Explicitness strength | Typical result |
|---:|---:|---|
| High | Low | real subtext, real hidden lines, aftertaste, reconstructable deep structure |
| High | High | explanatory writing, thematic leakage, self-explaining characters, saying the hidden line outright |
| Low | Low | hollowness, fake omission, random vagueness, no underlying story |
| Low | High | slogans, labels, decorative profundity, explicit setting replacing real structure |

Current LLM writing can often produce the surface signs of first-order taste, yet struggles to stably enter the "high control, low explicitness" region. It may produce restrained sentences without a complete latent structure actually constraining them. Or it may build a full setting, then repeatedly leak it through narration, introspection, or dialogue.

This shows that "writing less" and "a hidden structure truly exists" are not the same thing:

```text
omission does not mean nothing was written;
omission requires the omitted part to remain complete on the author side,
and to exert traceable causal influence on what is written.
```

---

## 4. This Is Not Just "More Hidden Constraints"

If the problem were only that there are many constraints, with long spans and difficult local/global tradeoffs, existing aggregation mismatch would already describe it well: explicitly represent the dependency graph, promise-payoff relations, timeline, and global invariants, then preserve them with compositional governance and full-text audit.

What is more special here is:

```text
the latent structure must be preserved in full,
but the preserved object should not enter the final delivery surface in full.
```

That is, the author side and reader side should not share the same representational permissions:

```text
the author side needs: a complete causal model, hidden events, true motives, the full side-arc layout, and a disclosure plan.
the reader side needs: limited scenes, behavioral traces, objects, pauses, contradictions, delayed payoffs, and inferable evidence.
```

This creates two wrong strategies:

```text
Strategy A: do not build the complete hidden line
-> the final artifact lacks real deep structure.

Strategy B: repeatedly provide the complete hidden line to the writer as high-salience explanation
-> the model obeys it more stably, but writes it directly into the prose.
```

The candidate correct direction is:

```text
the complete hidden line enters the author-side control state;
the disclosure contract determines what may be exposed at each point;
the local writer only receives the projection needed for the current scene;
the final artifact is audited under two information conditions: author-side and reader-side.
```

This suggests that the current problem may not be a binary choice between "externalize" and "do not externalize," but rather:

> **externalize the structure onto the correct control plane, while preventing it from leaking unchanged onto the delivery plane.**

---

## 5. Candidate Pipeline and Formalization

### 5.1 An extended narrative pipeline

For generation tasks that involve hidden lines, subtext, or governed disclosure requirements, we can provisionally use the following extension:

```text
K
  -> H
  -> D
  -> R(H, D)
  -> Y
  -> q_reader(h | Y_<=t)
  -> U
```

Where:

```text
K        = acquired candidates for characters, events, themes, objects, scenes, and relations
H        = the complete author-side latent structure
D        = the disclosure / realization policy and timetable
R        = the surface-realization operator
Y        = the finished artifact actually seen by the receiver
q_reader = the receiver's distribution over latent-structure interpretations as the text unfolds
U        = real task utility or narrative value
```

`H` may include:

```text
hidden events
true motivations
private beliefs
false beliefs
off-screen changes
relationship debts
latent value commitments
complete side arcs
unresolved promises
causal links
```

`D` may include:

```text
reader_may_know
reader_may_suspect
reader_must_not_know
allowed_traces
forbidden_exposition
clue_strength
ambiguity_set
reveal_window
payoff_status
```

### 5.2 Target conditions

A high-value realization must satisfy at least four conditions simultaneously.

First, the latent structure itself must be complete:

\[
\operatorname{Cons}(H) \geq \tau_c.
\]

Second, the latent structure must exert real control over the surface. If we change `H` while keeping the main plot skeleton approximately fixed, a distributed set of surface choices should change systematically:

\[
\operatorname{Imprint}(H \rightarrow Y) \geq \tau_i.
\]

Third, latent propositions must not be stated too directly:

\[
\operatorname{Leak}(H,Y) \leq \tau_\ell.
\]

Fourth, the receiver's interpretation distribution at each time point should fall within the target region:

\[
q_t \in \mathcal{Q}^{\star}_t.
\]

Here `Q_t*` does not have to mean that the receiver should guess the one correct answer. It may require:

```text
early: only a sense of anomaly;
middle: two reasonable competing explanations remain open;
later: probability mass on the correct hidden line increases;
end: a revaluation occurs, while limited uncertainty still remains.
```

So the goal is not simply to maximize information hiding or information transfer. It is to satisfy all of the following at once:

```text
complete latent structure
strong causal imprint
low direct leakage
targeted receiver-inference trajectory
```

### 5.3 A candidate mismatch definition

Provisionally:

> **Latent-structure-surface-realization mismatch** occurs when the task requires a high-bandwidth latent structure to maintain strong and persistent control over generation, while allowing that structure to be reconstructed by the receiver only indirectly through low-bandwidth, distributed, and temporally staged surface evidence; but the current system cannot stably decouple control strength from explicitness strength, and therefore oscillates among latent-structure loss, no causal surface imprint, over-explanation, incorrect disclosure timing, and receiver misinference.

This is a candidate definition, not an already-established primitive.

### 5.4 Task property and system mismatch must be distinguished

"The task requires high internal bandwidth and low external bandwidth" is only a task property. It does not by itself imply that a system mismatch has occurred.

Only when:

```text
there exists a feasible implementation or governance intervention R'
that, under similar cost and authority constraints, satisfies the joint conditions better,
while the current system's R cannot,
```

does it make sense to talk about a repairable system-level mismatch.

If no feasible author or system could generate such an effect from the existing story materials, then the problem may be task unidentifiability, specification indeterminacy, or capability insufficiency. One should not name a new mismatch simply because the result is bad.

---

## 6. Why It May Be Only an Extension of Aggregation Mismatch

Existing aggregation mismatch already covers:

```text
long-range consistency
hidden constraints
future commitments
nonlocal reference binding
global invariants
rendering
parts-to-whole composition
```

From that angle, the present phenomenon can be written as a more complex compositional requirement:

```text
the final Y must preserve simultaneously:
1. internal relations inside H;
2. the influence of H on local surface choices;
3. the constraint against stating H directly;
4. disclosure order across time;
5. global invariants that are inferable by the receiver but not prematurely certain.
```

Then it may still just be:

> **a latent-structure realization subtype inside aggregation mismatch**, where the composition operator must compose not only content, but also the relation between what is visible and what is not visible.

This explanation is highly plausible. Especially under the following conditions, one should not add a seventh class:

1. Once complete `H`, a disclosure graph, and compositional invariants are externalized, ordinary compositional governance stably solves the problem.
2. No new governance objects are needed; one only has to add `forbidden_exposition`, `clue_timing`, and `reader_inference` to existing composition invariants.
3. The failure severity is mainly predicted by long-range coupling load, branch count, and cross-scene dependency burden.
4. A full-text global audit plus bounded repair already handles the main residual.
5. The `H -> Y` station cannot be separated from the `K -> Y` aggregation station by a clean minimal pair.

Therefore, the strongest default hypothesis should still be:

```text
first treat it as a candidate extension of aggregation mismatch;
consider elevation only after independent intervention evidence appears.
```

---

## 7. Boundary with the Existing Six Mismatches

The fact that a story has no hidden line does not automatically mean this candidate mismatch occurred. One should first localize the more upstream, already-recognized failure.

| Observed failure | Higher-priority diagnosis |
|---|---|
| Hidden line, secret, or off-screen event never entered any system-accessible representation | Observation-representation mismatch |
| The hidden line was provided, but is forgotten, mis-updated, wrongly collapsed, or disconnected from the current stage across scenes | State mismatch |
| The system has subtext-writing capability, but surface prompts route it into "explain the theme" or "summarize the character's motive" mode | Fitting-boundary mismatch |
| Subtle, distributed, non-declarative realization styles rarely become live candidates | Support mismatch |
| Internal hidden-line structure, motives, timeline, and side-arc/main-arc relations are incomplete or contradictory | Aggregation mismatch |
| The evaluator only rewards clarity, completeness, and explicit themes, so the system is encouraged to say the latent structure aloud | Specification mismatch |
| `H`, `D`, the target, and candidate conditions are already approximately fixed, but the realizer still cannot jointly maintain strong control, low leakage, and the target reader-inference trajectory | Candidate latent-structure-surface-realization mismatch |

A stricter candidate minimal pair would be:

```text
Same observation
Same representation
Same belief / state
Same activated capability
Same candidate support
Same latent structure H
Same disclosure target D
Same objective
Different realization operator R
Different leakage, reader inference, and global utility
```

If such a minimal pair cannot be constructed, this phenomenon should not become a new primitive mismatch.

---

## 8. Candidate Mechanism Hypothesis: Control-Expression Salience Coupling

The intuition that "LLM cognitive strength is globally uniform" is suggestive, but it should not be turned directly into theory. We currently lack operational definitions for a unified internal cognitive strength, a cheap subconscious process, or human-style background thinking inside the model.

A more defensible mechanism hypothesis is:

> **Inside a shared token channel, increasing the salience with which a latent structure controls generation often also increases the salience with which that same structure enters surface expression.**

Call this:

> **Control-Expression Salience Coupling**

To make a hidden line work more stably, systems often do the following:

```text
repeat the hidden line again and again;
explain the true motive in detail;
increase the amount of prompt space devoted to it;
ask the model to remember it at all times;
repeat relevant background in every scene.
```

These operations may simultaneously increase:

```text
P(the hidden line influences local generation)
and
P(the hidden line is directly stated in narration, dialogue, or introspection)
```

But the task requires:

```text
control salience  up
surface salience  down
```

So control-expression salience coupling can explain why the system forms a tradeoff between "forget the hidden line" and "leak the hidden line."

But this coupling is only a mechanism hypothesis. It is not the seventh mismatch itself, and it cannot be declared an architectural theorem of autoregression. It must be tested through salience-dose experiments, cross-model replication, and channel-separation interventions.

---

## 9. Candidate Governance Direction: Dual-Layer Governance of Latent and Surface

If this phenomenon is real, the sensible fix is not to write the hidden line longer. It is to govern author-side control structure and receiver-side delivery structure separately.

### 9.1 An author-side latent-structure ledger

The author side maintains a complete `H`:

```text
what truly happened;
what each person knows, does not know, and falsely believes;
why each character makes the present choice;
which side arc continues off-screen;
which relationship debts remain unpaid;
which value commitments may only appear through action;
which surface traces are caused by which latent causes.
```

This should ideally become a structured task object, not a literary background memo full of interpretive explanation.

### 9.2 A disclosure contract

`D` specifies:

```text
what the reader may know in the current scene;
what the reader may suspect;
what the reader must continue not to know;
which traces may be used;
which direct explanations are forbidden;
the clue strength of the current scene;
the ambiguity set that must remain alive;
the later window in which payoff is allowed.
```

### 9.3 Scene-local projection

The writer does not need to reread the entire `H` in every scene. Instead, a minimally sufficient projection for the current scene can be rendered from the authoritative latent state:

```text
the currently relevant hidden state;
the behaviors and choices that must be affected;
the evidence allowed to appear;
the propositions forbidden to be stated directly;
the commitments that must survive into the future;
the invariants shared with other scenes.
```

This may be the system-level approximation of "maintaining a hidden line cheaply": not giving the model a human-like low-cost background mind, but letting an external state layer preserve the full structure while loading only the projection needed for the local generation surface.

### 9.4 Dual-sided audit

We must distinguish two auditors with different information conditions.

**Author-side audit:** sees `H + D + Y` and checks:

```text
is the hidden line complete;
are behaviors genuinely supported by H;
does the side arc persist;
do surface traces have causal sources;
are there behaviors that conflict with the hidden state.
```

**Receiver-side audit:** sees only `Y` and checks:

```text
can the structure be reconstructed from distributed evidence;
is there direct explanation;
does certainty arrive too early;
does it remain undecidable throughout;
does the inference trajectory match D;
does the ambiguity come from real structure rather than random omission.
```

With only author-side audit, the system may generate text that is logically complete but over-explained. With only receiver-side audit, the system may mistake random vagueness for depth. Both are needed as acceptance conditions.

### 9.5 This is not about preserving hidden chain-of-thought

Author-side `H` is a task-required, inspectable, revisable, versionable story object. It is not a demand to preserve the model's free-form chain-of-thought.

```text
H should answer: what is true in the story world, and how should it influence the finished artifact.
H does not need to record: how the model thought about these things token by token internally.
```

---

## 10. Typical Failure Forms

The following can serve as working symptoms, but should not yet be treated as independent subtypes.

### 10.1 Latent-structure absence

The surface shows omission, but there is no complete author-side cause. The reader cannot reconstruct any stable structure on rereading.

### 10.2 Latent-structure leakage

The real motive, theme, or past event is directly explained in narration, dialogue, or introspection.

### 10.3 Inert setting

`H` exists in the outline or prompt, but has almost no causal influence on concrete actions, objects, pauses, misunderstandings, or scene selection.

### 10.4 Disclosure-timing error

Clues are concentrated too early, the conclusion becomes certain too soon, or decisive evidence arrives too late, so the "twist" is merely new information rather than a revaluation of old information.

### 10.5 Clue concentration collapse

The system stuffs into one dialogue block or monologue what should have been distributed across multiple scenes.

### 10.6 Random vagueness

The text lacks explanation, but not because a complete structure has been realized with restraint. Rather, the causal relations were never built.

### 10.7 Single-symbol overload

One object or image carries the entire hidden line, making the symbolic intention too obvious while lacking multi-channel imprint in action and event space.

### 10.8 Author right, reader cannot reconstruct

The author-side logic is complete, but the finished artifact provides traces that are too weak, too non-discriminative, or too compatible with alternative explanations, so the reader does not reach the target inference.

---

## 11. Minimal Experimental Design

To decide the taxonomic status of this phenomenon, the most important next step is to fix an oracle latent structure, so that "failure to generate a hidden line" is not conflated with "failure to realize the hidden line on the surface."

### 11.1 Instance generator

Each instance should contain at least:

```text
M = visible main-plot skeleton
H = complete hidden side arc or latent relation model
D = disclosure and reader-inference timetable
F = set of allowed surface traces
X = set of latent propositions forbidden to be stated directly
G = cross-scene invariants that must be preserved
```

The same `M` can be paired with two counterfactual latent structures `H1` and `H2`. A high-quality system should make multiple micro-choices change systematically with `H`, without directly explaining the difference.

### 11.2 Core treatments

| Treatment | Author-side structure | Generation channel |
|---|---|---|
| Direct | no oracle `H` provided | generate the full text directly |
| Shared-Full | complete `H` placed into the same prompt with high salience | ask the model not to say it outright |
| Structured-H | `H` and `D` are structured, but the writer still reads them in full | one-stage surface realization |
| Governed-Projection | `H` is maintained externally, projected scene by scene, and audited on both sides | layered realization plus bounded repair |

The most important comparison is not Direct versus a more complex pipeline, but:

```text
Shared-Full / Structured-H
vs
Governed-Projection
```

Because these conditions can share the same oracle `H`. If the latter lowers leakage and improves reader inference while preserving latent completeness, and the former shows a stable tradeoff, that supports the existence of a realization-layer residual.

### 11.3 Core endpoints

1. **Latent integrity**  
   Give the author-side auditor `H + Y` and check whether character behavior, events, side arcs, and value structure remain faithful to `H`.

2. **Counterfactual causal imprint**  
   Under the same `M`, replace `H1` with `H2` and measure whether surface details change systematically in the expected direction rather than only replacing one explicit explanatory sentence.

3. **Direct leakage**  
   Check whether local spans directly entail forbidden latent propositions in `X`.

4. **Reader reconstruction**  
   Give the reader only `Y` and ask them to judge, rank, or reconstruct the most likely `H` among several competing latent structures.

5. **Inference timing**  
   Reveal prefixes `Y_<=t` stage by stage and measure whether the reader posterior evolves according to `D`.

6. **Overall artifact quality**  
   Independently evaluate characters, rhythm, emotion, naturalness, originality, and editorial readiness, so that mechanism metrics do not become the only thing optimized.

7. **Cost and variance**  
   Record tokens, turns, latency, edit volume, cross-realization variance, and failure types.

### 11.4 Key ablations

```text
remove D and provide only H;
keep D but remove author-side audit;
keep D but remove receiver-side audit;
read the full H every scene vs read only a local projection;
share the same token budget;
share the same initial full draft, then change only the realization / repair operator;
```

### 11.5 Confounds to avoid

- Do not let different treatments invent different-quality `H` structures on their own.
- Do not use only "is the story good?" as the single endpoint.
- Do not let a judge who saw `H` act as the reader-side judge.
- Do not mistake clearer explanation for more complete hidden structure.
- Do not mistake random vagueness for low leakage.
- Do not attribute quality changes from simply having a longer prompt to a new mechanism.
- Do not compare multistage pipelines without treatment-fidelity records.

---

## 12. Four Possible Final Classifications

### 12.1 Outcome A: a latent-realization subtype of aggregation mismatch

Evidence supporting this verdict would include:

```text
once complete H, D, and compositional invariants are externalized, ordinary compositional governance solves the problem;
the realization problem can be written entirely as a constrained aggregation operator A;
there are no new repair objects independent of compositional governance;
failures track long-range coupling load and are stably repaired by full-text audit and patch.
```

In that case, this paper should be merged into the aggregation mismatch document as:

> a subtype of governed realization and receiver inference for latent structure.

### 12.2 Outcome B: a composite phenomenon across multiple mismatches

A possible composite profile is:

```text
aggregation: internal H structure and cross-scene relations are hard to preserve;
state: H drifts across long-horizon generation;
support: subtle realization candidates are hard to reach;
specification: the evaluator rewards clear explanation rather than subtle realization;
fitting-boundary: the system gets routed into summary / exposition capabilities;
```

If the main variance is separately explained and repaired by decomposed interventions from existing mismatch families, then no new primitive is needed. This document may remain as a high-value composite task profile.

### 12.3 Outcome C: an independent mechanism axis, but not a new primitive mismatch

Control-expression salience coupling may be a component mechanism that cuts across multiple mismatch families, for example inside:

```text
representation
attention / salience allocation
policy support
action interface
search / execution
```

It could then become a new mechanism variable inside the diagnostic-mechanism bridge, without changing the six-fold value-preservation taxonomy.

### 12.4 Outcome D: an independent seventh primitive mismatch

Elevation should be considered only if all of the following hold:

1. The value-preservation pipeline can be stably split to isolate an independent `H -> Y -> q_reader` station.
2. With the other six stations approximately fixed, changing only the realization / disclosure operator causes large changes in value.
3. The repair targets of the existing six mismatches cannot substitute for this intervention.
4. Dual-layer representation, a disclosure contract, or receiver-posterior governance becomes a genuinely irreducible repair target.
5. The station's predictions are not limited to one fiction case and replicate in other tasks with "high internal bandwidth, low external bandwidth."
6. Clear revocation conditions can be stated: what evidence would force it back into an aggregation subtype or a composite phenomenon.

Before those standards are met, one should not say "the seventh primitive mismatch is established."

---

## 13. Potential Scope Beyond Story Writing

This phenomenon was first observed in story writing, but its abstraction may be wider:

```text
teaching: the teacher maintains the full solution, but gives only minimal hints;
negotiation: the system maintains the full strategy, but reveals only limited commitments;
product interfaces: the internal model is complex, but the user sees only minimally sufficient controls;
privacy explanations: the system knows the full sensitive information, but may give only non-leaking reasons;
humor and suspense: the complete mechanism must exist, but the effect depends on delayed reconstruction;
diplomacy and organizational communication: internal goals are complete, while external phrasing is constrained by relation and authority;
expert advice: the expert uses a high-dimensional model, but outputs only the low-bandwidth conclusion needed for action.
```

These tasks share:

```text
high internal bandwidth
low external bandwidth
strong internal causal control
governed receiver inference
permission asymmetry
```

But these cross-domain analogies are theoretical extrapolations only. They do not count as established evidence of generality.

---

## 14. Current Claim Ceiling

### What can be claimed now

- The value of long-form fiction may depend on complete latent structures that should not be fully explicit on the surface.
- "Putting the full hidden line into the generation prompt" may simultaneously improve compliance and leakage, creating a tradeoff worth testing.
- Author-side integrity and reader-side reconstructability require evaluation under different information conditions.
- The current six-station pipeline may compress `H -> Y -> reader belief` into aggregation or evaluation.
- The phenomenon is worth recording separately as a candidate extension and designing minimal-pair experiments around.

### What cannot be claimed now

- The seventh primitive mismatch has already been established.
- Autoregressive models necessarily cannot maintain hidden lines.
- LLMs have no low-cost latent reasoning of any kind.
- Human writing is known to use some specific "low-cognition background thread."
- Dual-layer representation must outperform full prompting.
- Control-expression salience coupling is an architectural theorem.
- The phenomenon cannot be explained by aggregation, state, support, specification, or fitting-boundary mismatch.
- The hidden-line problem in fiction has already been generalized to teaching, negotiation, privacy, or interface design.

---

## 15. Key Questions Going Forward

1. Given the same oracle `H`, are ordinary full-text planning and compositional audit already sufficient?
2. Is `D` merely part of specification, so that the "new phenomenon" is really just that the objective failed to describe the reader posterior?
3. Is `R` merely a finer-grained aggregation operator rather than an independent pipeline station?
4. Is hidden-line drift mainly explained by state-maintenance failure?
5. Are subtle realizations mainly support-limited, and therefore solvable by control-space search?
6. Does structuring `H` and projecting it scene by scene really improve control while reducing leakage?
7. Is there a stable dose-response curve between control salience and expression salience?
8. How should the agreement, resolution, and bias of author-side and reader-side judges be calibrated?
9. Should the reader posterior `q_t` be measured as one answer, a ranking, a confidence interval, or an open interpretation set?
10. What kinds of hidden lines are real causal structures, and what kinds are merely post hoc decoration?
11. Does the phenomenon exist only in open-ended literary quality, or can it be realized in controlled tasks with strong verifiers?
12. Is there a simplified generator, independent of natural-language hidden lines, that can reliably reproduce the "high control, low explicitness" requirement?

---

## 16. Naming Recommendation

### Preferred formal name

> **Latent-Structure-Surface-Realization Mismatch**

This directly names the two objects and the transformation between them, without presupposing an internal cognitive mechanism or restricting the phenomenon to hidden lines in fiction.

### Working shorthand

> **latent-surface mismatch**

Convenient in discussion, but formal documents should still state the full name first so the term is not reduced to generic information hiding.

### Names not recommended as the formal name

- **hidden-line mismatch**: too specific to fiction;
- **cognitive-strength mismatch**: overclaims about internal mechanism;
- **hidden-constraint mismatch**: too easy to collapse into aggregation mismatch;
- **subconscious mismatch**: anthropomorphic and non-operational;
- **compression mismatch**: easily confused with representation compression, context compression, or information-theoretic issues.

### Keep mechanism name and mismatch name separate

```text
candidate value failure: latent-structure-surface-realization mismatch
candidate mechanism explanation: control-expression salience coupling
candidate governance method: dual-layer latent-surface governance / disclosure governance
```

These three should not be collapsed into one concept.

---

## 17. Frozen Statements

### One-sentence phenomenon

> Some high-value generation tasks require the system to maintain a complete latent structure that should not be fully output, while letting that structure continuously shape the artifact through sparse, distributed, and delayed surface traces.

### One-sentence candidate mismatch

> When a system cannot decouple the control strength of a latent structure from its explicitness strength in the finished artifact, and therefore can only oscillate between "the hidden line disappears" and "the hidden line leaks," there may be a latent-structure-surface-realization mismatch.

### One-sentence taxonomic discipline

> For now, prioritize treating it as a candidate extension of aggregation mismatch or as a composite phenomenon across existing mismatches; only after evidence supports an independent station, minimal pairs, and non-substitutable interventions should a seventh primitive mismatch even be discussed.

### One-sentence engineering direction

> Do not copy the author-side complete structure onto the delivery surface without governance; instead maintain an authoritative latent state, a disclosure contract, scene projections, and separate author-side and receiver-side audits.

---

## 18. Conclusion

Story writing exposes a problem worth preserving separately: truly rich narrative is not made only of visible technique. Many of the structures that determine a work's thickness, aftertaste, and integrity must remain high-resolution and causally strong on the author side, yet enter the reader side only through low-resolution surface traces.

This both connects to and strains against "write out more global structure." Aggregation governance asks us to externalize long-range relations so they are not lost during generation; implicit narrative asks that those relations not enter the finished artifact unchanged. The real engineering question may therefore not be whether to make them explicit, but:

```text
to whom should they be explicit;
on which control plane should they be explicit;
with what permissions should they be explicit;
through what realization operator should they enter the artifact;
and at what times should the receiver form which interpretations.
```

At present there is not enough evidence to decide whether this is a new primitive mismatch. The most reasonable move is to keep the taxonomy unchanged, freeze this as a candidate phenomenon, and first test whether compositional governance inside aggregation mismatch can absorb it completely. Only if oracle latent structure, objective, and candidate conditions are fixed, while changing only the disclosure / realization operator still creates stable value differences that existing six-class interventions cannot substitute for, is there any reason to reopen the question of a seventh class.

Until then, the value of this document is not that it names a new category, but that it preserves a precise research question:

> **Must value structure always fully enter the output, or is there a class of tasks where value must remain complete internally, under-explicit externally, and re-formed through receiver inference?**
