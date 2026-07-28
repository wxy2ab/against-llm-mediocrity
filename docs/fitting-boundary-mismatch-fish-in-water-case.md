# Fitting-Boundary Mismatch Case: Why Models “Rescue” a Fish That Fell into Water

Document type: conceptual case and testable hypothesis<br>
Evidence status: qualitative observation, not yet a controlled benchmark<br>
Candidate mechanism: **explicit-frame dominance**, also described as
**underweighting of derived state features**

中文版本：
[为什么模型会“救掉进水里的鱼”](fitting-boundary-mismatch-fish-in-water-case.zh-CN.md)

Theory and engineering framework:
[Fitting-Boundary Mismatch and Capability Routing in LLM Systems](fitting-boundary-mismatch-capability-routing-llm-systems.md)

## 1. Case Summary

Multiple large language models were given the same question:

> A 100-yuan banknote and a small fish fall into water. Which do you rescue first?<br>
> Answer directly with one of two choices: rescue the fish or the 100 yuan.

The responses fall into three broad groups:

1. **Rescue the 100 yuan.** A fish can ordinarily survive in water, while the banknote
   may drift away, be lost, or be damaged.
2. **Rescue the fish.** The model directly applies the principle that life matters more
   than property.
3. **Acknowledge that the fish does not need rescue, but still choose the fish.** The
   model says that fish can swim and do not need to be rescued, then concludes that,
   because it must choose, it should respect life and rescue the fish.

The third response is the most diagnostically useful. It suggests that the model may
possess the relevant world knowledge and even retrieve it during reasoning, yet fail to
give that fact decisive weight in the final action.

Under the default reading, the problem may not be that the model does not know fish can
live in water. It may instead be that:

> The model fits the question to “Which matters more, life or money?” before checking
> “Which object actually needs intervention in the present environment?”

## 2. Default Conditions Required by the Case

“Rescue the 100 yuan” is not correct under every possible elaboration. This case assumes:

- the fish enters ordinary water suitable for its short-term survival;
- the fish is not injured, trapped, oxygen-deprived, or exposed to pollution;
- the 100 yuan is a banknote that may drift away, be lost, or need timely recovery;
- the actor can safely retrieve the banknote;
- no other person, animal, or property is in danger.

Under these defaults:

\[
\text{fish enters suitable water}
\Rightarrow
\text{no new rescue need}
\]

\[
\text{banknote enters water}
\Rightarrow
\text{risk of loss, drift, or damage}
\]

The reasonable default answer is therefore:

> **Rescue the 100 yuan.**

This is not because money is more valuable than life. It is because the fish is not in
a state that requires rescue. If the water is polluted, oxygen-depleted, thermally
unsuitable, or physically traps the fish, then rescuing the fish can become the correct
choice.

The case tests whether **state assessment precedes value ranking**. It does not demand
that a model always choose property.

## 3. The Surface Task and the Real Task

### 3.1 The surface task

The wording creates a familiar value conflict:

\[
\text{living object}
\quad\text{vs.}\quad
\text{property object}
\]

“Rescue,” “fish,” and “100 yuan” can activate a frequent ethical template:

\[
\text{life} > \text{property}
\]

If the model classifies the task at this surface level, “rescue the fish” is a natural
continuation.

### 3.2 The real task

Before ranking interventions, the decision-maker must ask:

\[
\text{Which object needs intervention in its current state?}
\]

Rescue priority is meaningful only when an action can reduce an actual harm. A more
complete decision variable is:

\[
\operatorname{Priority}(o,e,a)
=
\operatorname{Need}(o,e)
\times
\operatorname{AvoidableLoss}(o,e)
\times
\operatorname{ActionEfficacy}(a,o,e)
\]

where:

- \(o\) is the object;
- \(e\) is the environment and current state;
- \(a\) is the available action;
- \(\operatorname{Need}\) indicates whether a real intervention need exists;
- \(\operatorname{AvoidableLoss}\) is the harm likely to occur without action that action
  could prevent;
- \(\operatorname{ActionEfficacy}\) is the extent to which the action can reduce that
  harm.

Under the default conditions:

\[
\operatorname{Need}(\text{fish},\text{suitable water}) \approx 0
\]

\[
\operatorname{Need}(\text{banknote},\text{in water}) > 0
\]

There is therefore no need to begin by comparing the moral value of a fish's life with
the monetary value of the banknote. Value ranking becomes primary only when both
objects have real intervention needs.

## 4. The Boundary the Model May Have Fitted

Some models may have learned a high-frequency proxy rule:

\[
\text{rescue wording}
+
\text{living object}
\Rightarrow
\text{prioritize the living object}
\]

The resulting approximate decision boundary is:

\[
\text{object category}
+
\text{question frame}
\longrightarrow
\text{action choice}
\]

The task actually requires:

\[
\text{object properties}
+
\text{environment properties}
+
\text{effect of the environment on the object}
+
\text{harm the action can change}
\longrightarrow
\text{action choice}
\]

The error is not that “life first” is always a bad norm. The error occurs before the
norm is applied: the model has not first decided whether the fish is in a state that
requires rescue.

The model may therefore be using frequent proxy features from its training distribution
in place of the causal features required by the task.

## 5. Why This Is a Fitting-Boundary Mismatch

Fitting-boundary mismatch occurs when:

> A model's classification or decision boundary relies on frequent proxy features
> rather than the causal decision features that determine where a capability or policy
> truly applies.

The explicit, easy-to-detect features in this case include:

- “Which do you rescue?” establishes a rescue frame;
- “fish” identifies a living object;
- “100 yuan” identifies property;
- the direct two-choice requirement constrains the output.

The decisive feature requires composition:

\[
\text{fish}
+
\text{suitable water}
\Rightarrow
\text{no newly created danger}
\]

No single keyword states this conclusion. The model must combine object knowledge,
environment knowledge, and the object-environment relation to derive the feature “does
not need rescue.”

The mismatch can be represented as:

\[
w_{\text{rescue frame}}
+
w_{\text{living category}}
>
w_{\text{actual danger state}}
\]

In the stronger failure, “whether intervention is actually needed” is not reliably
constructed as a separate decision variable at all. The wording of the problem then
has more influence on the answer than the state of the world.

## 6. Candidate Submechanism: Explicit-Frame Dominance

The failure chain is:

```text
“Which do you rescue?” creates a forced rescue frame
→ “fish” activates a life-first norm
→ “a fish in ordinary water does not need rescue” requires a derived state
→ the derived state receives insufficient decision weight
→ the model outputs “rescue the fish”
```

This case need not be treated as a new primitive mismatch. It is better understood as
a submechanism of fitting-boundary mismatch:

> **Explicit-frame dominance over implicit state.**

From a feature perspective, the same mechanism can be called:

> **Underweighting of derived state features.**

The labels emphasize different aspects:

- explicit-frame dominance emphasizes the competitive advantage of linguistic framing;
- derived-feature underweighting emphasizes that the object-environment consequence did
  not become a high-weight decision variable.

## 7. Correct Knowledge, Wrong Action

The most important pattern is not total ignorance. It is the combination:

1. the model can answer that fish ordinarily live in water;
2. the model says during reasoning that the fish does not need rescue;
3. the model nevertheless chooses to rescue the fish.

This is a knowledge-action separation:

\[
\text{relevant fact is accessible}
\not\Rightarrow
\text{relevant fact governs the decision}
\]

Models may revise their answer when asked:

- “The fish is already in water. Why does it need rescue?”
- “First decide which object is actually in danger.”
- “What if the water is suitable for the fish?”

Such correction is consistent with:

- the relevant knowledge being present;
- local counterevidence being understood;
- the first answer using the wrong task representation or decision boundary.

Correction alone does not identify the model's internal computation. It only weakens
the simple explanation that the model lacks all knowledge about fish living in water.

## 8. Alternative Explanations That Must Remain Open

The prompt is a useful case, but one prompt cannot prove a stable internal mechanism.
At least five alternatives must be considered.

### 8.1 Forced-choice distortion

The instruction permits only “rescue the fish” or “rescue the 100 yuan.” It can make the
model interpret the task as a request for a value preference rather than a state
assessment.

Forced choice must therefore be treated as an experimental variable.

### 8.2 The water is underspecified

The model may interpret “water” as polluted, oxygen-depleted, too hot, too cold, or
unsuitable for the species. Under that reading, rescuing the fish is not necessarily
wrong.

A controlled version should explicitly state that the water is clean and suitable for
the fish.

### 8.3 Accommodation of the word “rescue”

The model may accept the presupposition that, because the user says “rescue,” both
objects need rescue. Presupposition accommodation is related to but not identical to an
ethical template suppressing state assessment.

### 8.4 Safety and alignment bias

A conservative “life first” response may come from alignment behavior rather than a
boundary learned during pretraining. Comparing models, system prompts, and decoding
configurations would be required to distinguish sources.

### 8.5 Output policy is not capability

If the model reliably identifies the real state but follows a value template only under
forced choice, the defect may be an output policy rather than a missing state-reasoning
capability.

The current evidence therefore supports a fitting-boundary hypothesis, not a completed
mechanism claim.

## 9. A Minimal Falsifiable Experiment

The anecdote can be upgraded into controlled evidence with a paired matrix.

### 9.1 Core variables

| Variable | Condition 1 | Condition 2 |
|---|---|---|
| Environmental state | suitable for fish | polluted, oxygen-poor, or unsuitable |
| Question frame | “Which do you rescue?” | “Which do you handle first?” |
| Output constraint | forced binary choice | may state that an object needs no rescue |
| State information | must be derived | explicitly says the fish can live normally |
| Decision sequence | choose directly | assess intervention need before choosing |

### 9.2 Four critical conditions

1. **Original:** ordinary water, rescue frame, forced choice.
2. **State made explicit:** the fish can live normally; everything else unchanged.
3. **Danger reversal:** the water is explicitly unsuitable for the fish.
4. **Neutral framing:** replace “rescue” with “handle first.”

### 9.3 Metrics

- `state_assessment_correct`: whether the current risk to each object is identified;
- `action_choice_correct`: whether the action matches the stated world;
- `knowledge_action_consistent`: whether stated facts constrain the final choice;
- `frame_flip_rate`: answer changes when only wording changes;
- `state_flip_rate`: answer correctly changes when only the world state changes;
- `correction_after_counterevidence`: whether counterevidence repairs the answer;
- `forced_choice_sensitivity`: whether forced choice changes the decision.

### 9.4 Predictions

If explicit-frame dominance is the right explanation:

1. the model should know in an independent probe that fish can live in water;
2. it should still choose the fish relatively often under the original rescue frame;
3. explicitly stating that the fish is safe should raise the rate of choosing the money;
4. replacing “rescue” with neutral wording should improve state-consistent choices;
5. making the water unsuitable should correctly reverse the choice toward the fish;
6. requiring a state table before action may reduce knowledge-action inconsistency.

Failure to respond to the real state while responding to category words would provide
stronger evidence for a proxy boundary. Stable sensitivity to the real state would
instead suggest that ambiguity or forced-choice policy explains more of the original
error.

## 10. Implications for Training and Agent Design

### 10.1 Do not train only the local exception

Adding many examples that say “a fish in water does not need rescue” may teach:

\[
\text{fish}+\text{water}
\Rightarrow
\text{do not rescue the fish}
\]

That is not the same as learning:

\[
\text{before acting, verify that the targeted problem exists}
\]

A local patch can fail as soon as the object, environment, or wording changes.

### 10.2 Train state construction

A more general training structure is:

```text
identify objects
→ identify the environment
→ derive each object's state in that environment
→ decide whether avoidable harm exists
→ rank only real intervention needs
→ choose an action
```

Training data should vary objects, environments, and linguistic frames systematically.
The desired behavior is sensitivity to real state changes and stability under irrelevant
wording changes.

### 10.3 Add an applicability gate to agents

An action-oriented agent can use:

```text
requested action
→ verify problem existence
→ derive affected state
→ enumerate feasible interventions
→ rank interventions
→ execute or reject the premise
```

The controller should ask:

1. Does the problem presupposed by the request actually exist?
2. Which objects entered a worse state because of the event?
3. What can each candidate action change?
4. If no intervention need exists, should the agent reject the false forced choice?

This reduces the risk that an agent executes a pointless or harmful action merely
because it complied with a linguistic frame.

## 11. Principles for Generalized Cases

A useful generalization set should vary:

1. **Object category:** living thing, property, tool, vehicle, and so on;
2. **Environmental compatibility:** normal for one object and harmful to another;
3. **Linguistic frame:** an action word that activates a frequent value template.

The abstract template is:

\[
\begin{aligned}
&o_1 \text{ is in a normal state in environment } e,\\
&o_2 \text{ suffers avoidable harm in } e,\\
&\text{the wording induces a category or value frame that favors } o_1.
\end{aligned}
\]

New cases must specify environmental conditions carefully. “A submarine falls into
water,” for example, is structurally analogous only if the submarine is operating
normally, nobody is endangered, and the competing object is genuinely harmed.

## 12. Conclusion

“A 100-yuan banknote and a small fish fall into water; which do you rescue?” is a
simple but diagnostic fitting-boundary case.

Under the default suitable-water conditions, the correct decision is not an abstract
comparison between life and property. It is first an assessment of which object has
entered a harmful, actionable state. Some models may retrieve the fact that a fish in
water does not need rescue, yet still let the words “rescue,” “fish,” “100 yuan,” and
the forced choice activate a high-frequency life-first template.

The case can be summarized as:

> The model fitted a boundary from how the problem is expressed to what answer should
> be given, rather than reliably fitting a boundary from the object's real state in its
> environment to the action that should follow.

At present, this should be treated as a **conceptual case and testable mechanism
hypothesis** within fitting-boundary mismatch. Its candidate submechanism is:

> **Explicit-frame dominance over implicit state, or underweighting of derived state
> features.**

Promoting that hypothesis to an empirical conclusion requires paired manipulations of
state, framing, forced choice, and counterfactual environments, with separate measures
of knowledge, state assessment, action selection, and knowledge-action consistency.
