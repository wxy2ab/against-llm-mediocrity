# Engineering Origins of the Six Primitive Mismatches

## An Engineering Note on How the Concepts Actually Emerged

---

## Note

This document answers a simple question: **the six primitive mismatches did not begin as an abstract theory looking for examples. They were forced into view by repeated engineering failure.**

A few notes up front:

- The core content was originally handwritten; the Markdown structure was organized with AI assistance.
- This document was first written in Chinese; the English version is translated from that source.
- What follows is the discovery path, not only the compressed final theoretical form.
- Historical labels such as “autoregressive mediocrity” are therefore retained to record what was believed at the time; they are not current mechanism definitions. The current theory defines aggregation mismatch as divergence between a deployed local proxy and global completion value, uses “autoregressive gravity” only as an empirical support-side nickname, and restricts state mismatch to belief-formation or update error at fixed representation.
- Some of the large-scale sampling experiments mentioned here relied on rented AWS machines that no longer exist. Many of those results are therefore hard to reproduce exactly; smaller principle-level reproductions are more realistic now.

---

## Why This Document Had to Be Written by Hand

This repository is not hostile to AI-written documentation. In fact, many documents here were produced after long back-and-forth discussion with AI and then reorganized by AI into cleaner drafts. That makes sense for two reasons:

1. The project itself argues that work should be divided by comparative strength. LLMs should handle the parts they are good at; humans should focus on the parts they are not.
2. My own knowledge and ability are limited. Much of the information expansion, clarification, and even parts of the thinking process benefited directly from repeated conversation with AI.

But this document is different. It records **how the six primitive mismatches were first forced out of concrete practice**. The crucial part is not only the final definition. It is the path: what looked wrong at the time, why it felt wrong, and how the question kept changing after each failure.

If a human does not provide that path, AI does not already know it. That is why other documents can be summarized by AI more directly, while this one is better written first as a human record.

---

## Starting Point: I Did Not Originally Believe LLMs Had a Ceiling

At the beginning, my view of LLMs was optimistic, even naive in a certain sense:

1. As training continues, LLMs should eventually solve almost every hard problem, or at least most practical ones.
2. Many agent scaffolds that look valuable today may only be temporary compensation for current model weakness; once stronger models internalize those abilities, that engineering may quickly lose value.
3. If the model is already strong enough, and I can spend enough tokens and sampling budget, then by concentrating that budget on one sufficiently narrow problem, the system should become something close to "local AGI" for that problem.

The third belief mattered the most. I spent a lot of time learning different sampling strategies such as CoT, ToT, and self-refine, and eventually settled on a workflow I considered relatively useful:

```text
randomly combine initial ideas
-> plan
-> audit
-> refine
-> execute plan
-> fix artifact
```

Results from multiple rounds could then be recombined into new initial ideas and iterated again.

My intuition at the time was straightforward: even if the initial idea combinations are limited, enough repeated sampling should keep generating new detail; those details could then recombine and iterate again, and eventually the process should exhaust the low-probability but high-value combinations in a given task region.

---

## First Shock: Massive Quant Sampling Did Not Produce High-Value Results

To test that belief, I ran a very large experiment on futures trading strategy design.

The experiment involved more than 100,000 samples.

I expected that such large-scale sampling would eventually discover extremely strong trading code. Instead, the statistics were shocking:

1. Using `net return` as the metric, the best result appeared around the eighteen-thousandth sample; later sampling never surpassed it.
2. I switched to other metrics such as `sharpe` and found that no matter which metric I used, the results were approximately normally distributed.
3. To avoid data snooping from repeatedly testing on the same instrument, I selected the best 2,000 results by `sharpe` and moved them to other instruments. Their performance there was still approximately normally distributed.
4. I repeated this across other metrics and other instruments and saw the same pattern.

That was the first time I clearly confronted a harsh reality:

- Even with complex multi-round sampling and iteration, I was still trapped in the same basin.
- Massive repeated sampling was finding local optima, not the high-value structure itself.

I later called this phenomenon **autoregressive gravity**.

The idea was simple: the model keeps getting pulled back toward the regions it knows best, the regions with the strongest support and the smoothest continuation. What looks like large-scale exploration is often just circling inside the same local basin.

---

## From Autoregressive Gravity to Support Mismatch

After that shock, I started asking a different question:

If repeated sampling is not enough, can I extract useful knowledge from good samples and then use that knowledge to improve the next round of search?

So I began asking LLMs to summarize the samples.

That led to a second disappointment. No matter how I wrote the prompt, the model kept giving me very generic, very soft "experience." It sounded plausible, but it did almost nothing to help escape the basin.

At that point I started to realize something more specific: **if I keep showing the LLM things it is already familiar with, it is very likely to be pulled back into the same high-support region again.**

So I changed the method. Instead of asking the LLM to summarize directly, I used code to split samples into fragments, recombine them horizontally and vertically, and then validate the resulting claims against the original samples or the original data.

The process looked roughly like this:

```text
split samples
-> recombine them with code
-> generate claims
-> validate against original samples or data
-> keep claims with evidence
-> discard claims without evidence
```

This was the first method that gave me a real sense of escaping the basin. Later, I used experience extracted from only 10 samples and, after roughly 10 iterations, produced a result that beat the previous best from the large-scale sampling run.

That step was decisive because it made three things much clearer:

- The problem was not simply "insufficient sampling."
- What was missing was often a **scarce high-value structure** capable of pulling the model toward a low-probability region.
- If that structure is absent from the direct generation path, continued sampling in the original output space is extremely inefficient.

That line of thought later became **support mismatch**: **the high-value structure is not nonexistent, but under the current policy, search procedure, and budget it is unreachable or very unlikely to become a live candidate.**

One piece of real chronology should be preserved here: this summarization actually happened after aggregation mismatch (next section) had been discovered and named. In order of encounter, the shock from the quant sampling came first; but in order of concept naming, aggregation mismatch was the first mismatch to be identified, and the distributional phenomenon of autoregressive gravity was only later folded back into what is now support mismatch. The sections of this document are arranged in order of encounter, an ordering organized with AI assistance.

---

## Second Turn: Story Generation Exposed Aggregation Mismatch

After the quant experiment succeeded, I briefly thought I had found something fairly general: break original semantics, build a control space, search there, and then return to output-space validation.

If that method was truly general, it should not work only for trading strategies. It should transfer to other tasks.

So I chose story generation as a reproduction target.

Very quickly, the situation changed. Code samples often contain structures that can be recombined, substituted, and validated. Great stories do not behave that way. Two excellent stories may contain no directly interchangeable unit of value.

I initially tried similar break-and-recombine strategies there as well, but after a couple of rounds the results were not good.

That forced me to rethink the real nature of story-generation failure.

Eventually I realized the central issue was not merely “missing fragments.” At the time, I interpreted it this way:

- autoregressive prediction optimizes local `next-token` continuation;
- story generation demands cross-section, cross-character, cross-rhythm, cross-theme global quality;
- when local optima do not add up to a global optimum, the problem is no longer only that valuable structures are low-support, but that locally good pieces fail to compose into global value.

This was what I first called a "multi-objective coordination problem." Later it was reorganized into the more precise category of **aggregation mismatch**.

Under the current formalization, the causal attribution in the first bullet needs correction. Autoregressive chain factorization can represent any joint distribution exactly, and its conditionals can encode global constraints. What the experiments and engineering repairs actually localize is divergence between global completion value and deployed local proxies, finite search, unexternalized future constraints, or irreversible commitment. The paragraph is retained as discovery history, not as a current claim that autoregression is intrinsically local.

This also led to an important methodological revision:

- for some tasks, **breaking original semantics is not necessary**;
- but **constructing a control space is still necessary**, because it converts a global optimization problem into a set of locally governable tasks;
- and multi-round revision is also necessary, because many global constraints can only be checked after a full version exists.

That approach later worked extremely well in story generation, to the point that under human evaluation it could simulate almost any master-like style. That was when I became convinced that some failures are not "the model cannot write," but rather **local generative strength does not automatically compose into global task value**.

---

## From Four Mismatches to Six

When I first started summarizing these experiences systematically, I did not yet have the six mismatches in their current form. I had four.

### First Group: Aggregation and Support

The first two to stabilize were:

1. **Aggregation mismatch**: local optimization does not guarantee global value.
2. **Support mismatch**: without scarce high-value structure, the system remains trapped in a high-support basin.

Both came directly out of long confrontation with what I then called autoregressive gravity. In the current terminology, that label survives only as an empirical support-side nickname: it describes probability-mass concentration for a trained model and decoder, not an architectural necessity.

### Second Group: State and Specification

Later I returned to finance and to more ordinary engineering tasks.

At that point I started to notice that many failures were not about generation alone. They came from two other facts:

- LLM weights are fixed, while the real world is dynamic, non-stationary, and strategic.
- In many tasks, the true objective is not actually specified clearly at the start.

That forced out two more categories:

3. **State mismatch**: at a fixed accessible representation, the system's formed or updated state belief diverges from the belief warranted by the evidence and therefore selects the wrong action—for example, carrying a stale market-regime belief after the evidence changes.
4. **Specification mismatch**: the system's accessible objective diverges from the real one, as in planning tasks where budget or the governing objective was never actually made explicit.

At that stage, the original "four mismatches" already existed, and I still placed them under the larger theme of autoregressive mediocrity.

---

## From Autoregressive Mediocrity to LLM Mediocrity—and Then to Mechanism Separation

A later revision mattered a great deal:

not every mismatch should be blamed directly on autoregression itself.

The first correction at the time was that some failures appeared tightly tied to local commitment in stepwise continuation, especially aggregation mismatch, while others arose from broader system issues such as proxy objectives, state belief, insufficient observation, or the wrong capability-trigger boundary.

That is why I later expanded “autoregressive mediocrity” into the wider frame of **LLM mediocrity**. The current theory takes a further step and retires the mixed mechanism label entirely. Aggregation mismatch is mechanism-independent local-proxy/global-value divergence; concentration of probability mass belongs to support mismatch; and autoregression is only one implementation in which either phenomenon may appear.

That change matters because the framework is no longer only about "why autoregression fails." It is about **where an LLM system structurally loses task value.**

---

## The Fifth Mismatch: Fitting-Boundary Mismatch

Later, while using models for more real tasks, I kept seeing another pattern:

even strong models often perform a very shallow search and then declare `no-go` too early.

The real search space is often still large. The model simply stops expanding and prefers to conclude that the path is not workable.

At first I hesitated. Was this only because the model was not yet strong enough? Would the problem disappear with more careful prompting or more refined system design?

Over time I became convinced that it would not disappear in principle. The reason is that:

- the implicit trigger boundary of a learned capability can differ from its true domain of applicability;
- and deciding which capability should activate under which condition is itself often a state-sensitive problem.

That phenomenon later became **fitting-boundary mismatch**: **the model does possess a capability, but it over-triggers under the wrong conditions and under-triggers under the right ones.**

---

## The Sixth Mismatch: Observation-Representation Mismatch

The final addition was **observation-representation mismatch**.

The earliest seed came from a conversation with a friend. His point was simple:

- humans perceive a three-dimensional world with rich sensation;
- human judgment is accompanied by emotion, bodily response, and many continuous environmental signals;
- but once those signals enter the model, they are usually reduced to text, audio, images, or video;
- in other words, the real world is heavily compressed before the model ever sees it.

As long as that compression persists, the model never encounters the world itself. It encounters only a constrained projection of it.

I later discussed this repeatedly with AI as well, and it eventually crystallized into observation-representation mismatch: **the decisive world variable does not enter the model representation in an operationally usable form, so even stronger downstream reasoning still operates on a defective projection.**

At that point, the six primitive mismatches were finally complete.

---

## A More Compact Timeline

If the path above is compressed into a simpler evolution chain, it looks roughly like this:

| Stage | Engineering encounter | Judgment forced out of it |
|---|---|---|
| Large-scale quant sampling | 100k-scale sampling still trapped in a local basin | Support mismatch / autoregressive gravity |
| Extracting experience from samples | LLM summaries stay soft; code-based recombination plus validation works better | Scarce high-value structure must be constructed explicitly |
| Story-generation reproduction | Locally good fragments do not automatically become a globally good work | Aggregation mismatch |
| Finance and open-ended task design | State-evidence updates and underspecified objectives often decide success | State-belief update mismatch, specification mismatch |
| Everyday hard problem solving | The model reaches `no-go` too early after shallow search | Fitting-boundary mismatch |
| Reflection on human perception and model input | Decisive variables are heavily compressed before reaching the model | Observation-representation mismatch |

---

## What This Document Is Really Trying to Preserve

This document is not trying to prove that the current six definitions are final. It is not trying to reduce everything to one moment of inspiration either.

It is trying to preserve three things:

1. The six primitive mismatches came first from engineering frustration, not from a desire to classify.
2. They matter because each one points toward a different repair direction.
3. AI was not a bystander in this process. Much of the clarification, renaming, abstraction, and boundary-setting came directly from long discussion with AI. But if the human does not first provide the raw experience and the raw path, AI does not derive it on its own.

In that sense, the whole process is itself a strong example of human-AI collaboration:

- the human provides the raw encounters, the initial judgments, and the real-world feedback;
- AI helps expand, compare, rename, and stabilize the concepts;
- the result is neither pure human intuition nor pure model output, but a discussable framework grown out of engineering failure.

---

## Conclusion

There are still many engineering details in the full process that are not unfolded here. But the broad origin story of the six primitive mismatches is now visible.

They were not introduced to make failure sound more abstract. They were introduced to answer a practical question:

**when LLMs keep producing outputs that look right but do not carry enough value in real tasks, where exactly is the problem, and where should the repair be placed?**

If this document is useful, it is not because it tells a neat story. It is because it shows that the framework did not begin as theoretical ornament. It was forced into existence by repeated contact with real engineering failure.
