# Observation-Representation Mismatch

## A Working Draft on the Sixth Primitive Mismatch

**Status:** Working draft  
**Alias:** Observation-Channel Mismatch  
**Main manuscript:** [Knowledge Governance for Large Language Model Systems](knowledge-governance-llm-systems-local-alignment.md)

## Abstract

**Observation-representation mismatch** occurs when task-relevant information that a feasible intervention could have acquired or preserved is lost, compressed, aliased, or made operationally inaccessible by the observation, encoding, tokenization, embedding, context-compression, or control-representation channel through which the world reaches an LLM system.

It is not merely that the current latent state is unknown. More precisely, the available representation is not a task-sufficient representation of the world state. The system may reason well over the variables it has, yet still be capped by the variables that never entered its controllable representation.

The practical alias is **observation-channel mismatch**. The formal name is **observation-representation mismatch**, because the bottleneck can occur at sensing, reporting, modality conversion, encoding, tokenization, embedding, summarization, retrieval, memory, or task-control representation.

The core contrast is:

> State mismatch asks: at fixed representation, does the system form and update the belief warranted by the available evidence?
>
> Observation-representation mismatch asks: did decision-relevant information obtainable through a feasible channel enter the model-accessible representation?

## 1. Core Claim

The LLM system does not act on the world directly. It acts on a representation formed through a chain:

\[
S_{\text{world}}
\xrightarrow{\phi}
O_{\text{observation}}
\xrightarrow{\psi}
Z_{\text{model representation}}
\xrightarrow{\pi}
Y_{\text{output/action}}.
\]

where:

- \(S_{\text{world}}\) is the true world state;
- \(\phi\) is the observation channel, such as text, images, audio, video, sensors, logs, traces, human reports, files, or tool outputs;
- \(O\) is the observed content;
- \(\psi\) is encoding, tokenization, embedding, retrieval, summarization, context compression, or task-model construction;
- \(Z\) is the model-accessible and operationally controllable representation;
- \(Y\) is the output or action.

State mismatch compares the evidence-warranted and actual beliefs after fixing \(Z\). Observation-representation mismatch asks the prior interface-level question:

\[
Z=\psi(\phi(S))
\quad \text{does it preserve the task-sufficient variables?}
\]

Let \(C^\star(S)\) denote the task-sufficient control variables. Observation-representation mismatch occurs when there exist world states \(s_1,s_2\) such that:

\[
\psi(\phi(s_1)) \approx \psi(\phi(s_2)),
\]

but:

\[
C^\star(s_1) \ne C^\star(s_2),
\]

and that difference changes the ranking of candidate outputs or actions:

\[
\arg\max_y U(y;s_1) \ne \arg\max_y U(y;s_2).
\]

This is observation-representation mismatch only if a feasible alternative channel or representation can separate the pair and improve decision value.

Let \(\Gamma_{\mathrm{feas}}\) be the set of channels feasible under deployment constraints. Mismatch occurs when the current representation value \(V_Z\) is strictly below the best feasible-channel value:

\[
V_Z
<
V_{\mathrm{feas}}
:=
\sup_{(\phi',\psi')\in\Gamma_{\mathrm{feas}}}
\max_{\pi:Z'_{\le t}\to Y}\mathbb{E}[U(\pi(Z'_{\le t});S_t)].
\]

The remediable channel loss is:

\[
\Delta_{\text{channel}}
=
V_{\mathrm{feas}}-V_Z.
\]

Here \(Z'_{\le t}\) is the representation history produced by \((\phi',\psi')\). Both \(V_Z\) and \(V_{\mathrm{feas}}\) optimize over the same history-dependent policy class; for a static task, set \(t=1\). The value of a direct-state policy remains a full-information upper bound, but its gap from \(V_{\mathrm{feas}}\) is irreducible partial observability and is not counted as system mismatch. The remediable gap cannot be eliminated by longer reasoning over the same representation. It requires changing the observation channel, adding measurement, querying the environment, using tools, requesting raw data, or constructing a richer control representation.

## 2. Six Ceilings Imposed by the Channel

### 2.1 Information Sufficiency Ceiling

If task value depends on a variable \(v^\star(S)\) that never enters \(Z\), even an optimal policy can only be Bayes-optimal with respect to \(Z\), below the full-information upper bound based on \(S\). This gap is observation-representation mismatch only when a feasible alternative channel could bring \(v^\star\) into representation; otherwise it is an irreducible information constraint.

Typical signs include decisions based on summaries that omit decisive evidence, recommendations drawn from stale snapshots, and answers that treat user reports as complete state rather than partial observations.

### 2.2 Affordance Ceiling

Images can show appearance without preserving weight, temperature, texture, friction, elasticity, fragility, grip, resistance, attachment, or action cost. These are not merely semantic attributes — they are action-relevant affordances.

For example:

\[
\text{cup looks normal} \not\Rightarrow \text{cup is safe to grab}
\]

\[
\text{rod fits visually} \not\Rightarrow \text{rod can be maneuvered through space}
\]

Without an affordance channel, an action problem is reduced to a visual or linguistic proxy.

### 2.3 Spatiotemporal Continuity Ceiling

A single image, truncated video, summarized log, or text transcript may lose velocity, acceleration, contact order, action intent, trajectories, event sequence, latency, or irreversible state changes.

Many tasks depend on state transitions rather than static object identity — medicine, sports judgment, driving, robotics, financial microstructure, incident response, and customer-escalation timing. If the channel undersamples transitions, the system cannot construct the correct dynamic control variables.

### 2.4 Social-Pragmatic Ceiling

Text transcripts often lose tone, pause, facial expression, shared attention, power relation, humiliation, sarcasm, exhaustion, intimacy, tension, and scene pressure.

The sentence "Sure, you're impressive" can be praise, anger, sarcasm, surrender, flirtation, teasing, or social self-protection. If feasible voice, expression, or interaction-history channels could distinguish these states but the system receives only text tokens, their collapse is observation-representation mismatch. At fixed text, state mismatch arises only if the system unjustifiably collapses, misranks, or forgets the latent dialogue-state belief; correctly preserving the ambiguity is not mismatch.

### 2.5 Verification Ceiling

An LLM can generate a plausible answer, but without tests, sensors, runtime logs, user feedback, external data, or expert acceptance, it cannot bind a candidate output to its actual consequences.

This is not identical to hallucination. Hallucination is false output content. Observation-representation mismatch is the absence of verification signal from the system representation. More thinking over the same unverified representation may only produce more elaborate errors.

### 2.6 Task-Construction Ceiling

Many real tasks are not already clean abstract problems. The system must first extract the task model from a natural scene. Observation-representation mismatch explains one lower-level failure source: the decisive variables in the scene never become extractable, verifiable, or controllable.

In a car-wash problem, the key variable is not how far a person moves but which object's state must change. In a doorway-and-pole problem, the key variables may include three-dimensional clearance, cross-section, orientation, path, and surrounding maneuvering space. A clean abstract formulation may be solvable even when the natural observation form remains unsolved, because the right control variables never entered \(Z\).

## 3. Distinction from State Mismatch

| Dimension | State mismatch | Observation-representation mismatch |
|---|---|---|
| Core question | At fixed \(Z\), is belief formed and updated according to the evidence? | Relative to feasible channels, did the current channel preserve decision-relevant information? |
| Mathematical object | Decision-relevant divergence between \(\hat b_t=B_\theta(Z_{\le t})\) and \(b_t^\star=P(H_t\mid Z_{\le t})\) | \(V_{\mathrm{feas}}-V_Z\) |
| Typical condition | Incorrect collapse, misranking, forgetting, or stale belief | A stable scene can fail because the current channel drops obtainable information |
| Typical error | The same evidence produces the wrong belief and action | A physical, social, temporal, or verification problem is reduced to a visible proxy |
| Standard repair | Repair belief updating, memory, and conditional or conservative policy | New measurement, richer modality, tool call, sensor, raw data, environmental query, structured representation |
| Success criterion | Belief and action ranking recover at fixed input | Performance jumps after the observation or representation channel changes |

State-mismatch repair holds the evidence fixed and repairs the belief updater: enumerate plausible latent states, rank them according to evidence, preserve warranted uncertainty, and use conditional, conservative, or branching policies. Correctly maintaining a broad posterior is not mismatch.

Observation-representation mismatch asks a different first question:

> Is the current observation channel qualified to support this judgment?

If not, the correct next step is not merely to enumerate more states. It is to measure, inspect, run, sense, query, retrieve, observe from another angle, obtain raw evidence, or construct a richer representation.

## 4. Distinction from Fitting-Boundary Mismatch

Fitting-boundary mismatch concerns capability routing:

\[
M_X \ne T_X.
\]

The model has learned or approximately learned capability \(X\), but activates it outside its true domain or fails to activate it within its true domain.

Observation-representation mismatch concerns the upstream channel:

\[
S_{\text{world}} \rightarrow O \rightarrow Z.
\]

The question is whether task-sufficient variables entered the representation space in which any capability could be routed. The boundary is:

- **Fitting-boundary mismatch:** the capability exists, but the router is wrong.
- **Observation-representation mismatch:** the decisive variables never sufficiently enter the routable representation.

## 5. Independent Predictive Signatures

### 5.1 Channel Enhancement Produces Nonlinear Improvement

The same model on the same task may improve abruptly when a missing channel is supplied:

- image only -> wrong physical judgment; add depth, size, material, weight -> correct judgment;
- text transcript only -> socially mistimed reply; add voice, pauses, history, emotion labels -> appropriate reply;
- code snippet only -> vague bug guess; add logs, failing stack trace, input examples -> successful localization.

If improvement comes mainly from channel completion rather than longer reasoning, this is a signature of observation-representation mismatch.

### 5.2 State Enumeration Does Not Close the Decision

Under state mismatch, a state matrix can often produce a conditional policy:

\[
s_1 \rightarrow y_1,\quad s_2 \rightarrow y_2.
\]

Under observation-representation mismatch, state enumeration may only expose the missing variable:

\[
\text{measure } v^\star.
\]

For example: if the cup is hot, do not grab it; if it is not hot, grabbing may be safe. But if the current image cannot reveal temperature, the correct next step is not to answer with confidence. It is to measure temperature or mark the variable unavailable.

### 5.3 Errors Concentrate in Channel Blind Spots

Typical failures overuse visible proxies:

- appearance as a proxy for weight;
- text as a proxy for emotion;
- a static frame as a proxy for motion trend;
- fluent narrative as a proxy for causality;
- local logs as a proxy for system state;
- a screenshot as a proxy for interactive flow;
- user description as a proxy for objective fact;
- two-dimensional projection as a proxy for three-dimensional action space.

The shared form is:

\[
\text{visible proxy} \ne \text{task-relevant variable}.
\]

### 5.4 Clean Abstract Form Recovers Capability

If a model fails in the natural observation form but succeeds when hidden channel variables are explicitly represented, the problem may not be an inability to reason. It may be a failure to extract the right control variables from the channel.

For example, an image may lead to a wrong pole-through-door judgment, while a structured variable list that includes cross-section, orientation, clearance, and maneuvering space restores the correct solution.

### 5.5 Output-Space Search Has Low Yield; Measurement Has High Yield

Repeated requests to "try again," "think harder," or "make it better" produce limited improvement when the channel is insufficient. Measurement, raw signals, tools, tests, logs, environmental APIs, or structured multimodal variables can yield a much larger gain.

The required reparameterization is not only a better state matrix. It is making the world observable, measurable, encodable, and controllable.

## 6. Intervention Playbook

When observation-representation mismatch is suspected, the system should prefer channel repair over verbal overconfidence:

1. identify the task-sufficient variable \(v^\star\) or control variable \(C^\star\);
2. ask whether \(v^\star\) is present in \(O\) and preserved in \(Z\);
3. if absent, change the observation channel or acquire measurement;
4. if present but unstable, construct a structured representation, state table, trace, feature set, or control object;
5. if verification is absent, run tests, query logs, call validators, inspect external data, or request expert acceptance;
6. if acquisition is impossible, mark the variable unavailable and output a conditional or bounded answer.

Common repairs include:

- changing camera angle, adding depth, adding temporal sampling, or using sensors;
- retrieving source documents, raw logs, runtime traces, or database records;
- running tests, simulations, queries, or probes;
- asking for raw data rather than summaries;
- turning speech, video, image, or social context into explicit variables;
- adding a tool, evaluator, validator, or environment API;
- recording which missing variables block a reliable answer.

## 7. Relation to Knowledge Governance

Knowledge Governance externalizes task-specific control knowledge into governable objects. Observation-representation mismatch identifies a prior condition for that governance to work: the control variables must first enter a representation where they can be stored, validated, revised, and revoked.

If the representation is wrong, more thinking can produce longer mediocrity. If the representation is repaired, the same model may become locally aligned or even extraordinary on the transformed task.

The design implication is:

> Before asking the model to reason harder, ask whether the world has entered the system in a task-sufficient form.

## Conclusion

Observation-representation mismatch qualifies as a sixth primitive because it satisfies three criteria:

1. it cannot be fully reduced to inference-layer state enumeration;
2. it predicts nonlinear improvement from channel enhancement;
3. it requires a different intervention point: interface, sensing, encoding, measurement, verification, and control representation.

State mismatch asks whether, at fixed representation, system belief is evidence-faithful and supports the correct action. Observation-representation mismatch asks whether important information available through a feasible channel entered the operational representation.
