# Failure Diagnosis and Root-Cause Localization

Status: first-wave operating guideline

Primary mode: read-only

Use with: [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)

Chinese: [故障诊断与根因定位](./failure-diagnosis-and-root-cause-localization.zh-CN.md)

## 1. Outcome and Authority

Diagnosis produces:

```text
reproducible symptom
→ localized failure layer
→ causal explanation
→ evidence that distinguishes competing hypotheses
→ bounded remediation options
```

Unless the user also requests a fix, diagnosis is read-only. Reproduction, logs, tests,
profiling, and temporary isolated probes are allowed when they do not mutate
authoritative state. Do not convert a diagnosis into an implementation campaign.

## 2. Define the Symptom Precisely

Replace vague labels with an observable delta:

```text
expected state or behavior
observed state or behavior
input and environment
first known failing boundary
frequency and determinism
time/version window
user-visible impact
```

Examples:

- not “the API is broken,” but “valid requests with an empty optional list return 500
  before domain validation”;
- not “the agent is bad at patching,” but “the plan names the correct semantic target,
  while tool arguments use a stale physical index after relocation.”

Separate:

- symptom;
- proximate failure;
- root cause;
- contributing conditions;
- consequence.

## 3. Establish a Reproduction

Prefer the smallest reproduction that preserves the failure:

```text
same input
same relevant state
same configuration
same code/model/tool version
same budget and timeout
same external dependency behavior
```

Classify the reproduction:

| State | Meaning |
|---|---|
| Deterministic | Fails on every controlled run |
| Intermittent | Fails with measurable frequency |
| Historical | Supported by logs/artifacts but not reproduced now |
| Environment-specific | Requires a particular runtime or dependency |
| Not reproduced | Evidence is insufficient for a causal claim |

Do not “stabilize” the symptom away before recording the failing case.

## 4. Localize the Failure Layer

Use the earliest layer where expected and observed state diverge:

| Layer | Typical evidence |
|---|---|
| Observation | Missing, stale, truncated, or wrong input |
| Representation | Relevant state exists but is encoded or surfaced poorly |
| Specification | Optimized proxy differs from user outcome |
| Planning | Wrong target, value, dependency, or non-goal |
| Compilation | Correct plan becomes wrong physical operation |
| Tool/interface | Invalid args, ambiguous contract, stale address |
| Executor/environment | Permission, IO, dependency, transaction, race |
| Verification | False accept, false reject, incomplete coverage |
| Commit/replay | Partial apply, duplicate side effect, stale write |
| Budget/transport | Timeout, truncation, retry, provider failure |

Classify the earliest causal divergence, not merely the last error message.

## 5. Build Competing Hypotheses

For each plausible hypothesis record:

```json
{
  "hypothesis": "...",
  "mechanism": "...",
  "predicted_observation": "...",
  "disconfirming_observation": "...",
  "probe": "...",
  "result": "supported|weakened|not_tested"
}
```

Prioritize probes with high discrimination and low mutation:

- compare good and failing runs at the same boundary;
- hold input fixed and vary one configuration;
- inspect pre/post hashes;
- bypass one layer with a trusted oracle;
- replay captured payloads against a deterministic executor;
- add temporary telemetry in an isolated branch or test harness;
- minimize the failing fixture.

Avoid probes that change several causal variables at once.

## 6. Use Evidence in Causal Order

Evidence strength generally increases:

```text
plausible code reading
< correlated log pattern
< controlled reproduction
< differential probe
< intervention that removes and restores the failure
< property or invariant violation at the causal boundary
```

Code inspection alone can identify a defect, but runtime claims require runtime evidence
when execution depends on configuration, concurrency, data, or external systems.

Treat model-generated explanations, comments, and post-hoc rationales as hypotheses,
not causal evidence.

## 7. Diagnose State and Time

Many failures are version mismatches:

```text
evidence version ≠ candidate version
plan state ≠ execution state
cache state ≠ authority state
test fixture ≠ production schema
client contract ≠ server contract
```

Record hashes, revisions, timestamps, config, model/tool versions, and retry attempts.
Do not apply a syndrome computed on one state to another state.

For intermittent failures, inspect ordering, race windows, idempotency, cache invalidation,
resource limits, and shared mutable state before blaming randomness.

## 8. Stop Conditions

Stop and report uncertainty when:

- the symptom cannot be reproduced and available artifacts are insufficient;
- evidence needed to distinguish hypotheses is unavailable;
- the only next probe is destructive or externally consequential without authority;
- multiple causes remain observationally equivalent;
- the suspected issue is outside the scoped repository or system;
- a required value/policy decision belongs to the user.

“Most likely” must include why alternatives are weaker and what evidence is missing.

## 9. Diagnosis Completion Gate

```text
[ ] symptom is stated as expected vs observed
[ ] reproduction status is explicit
[ ] authoritative state/version is recorded
[ ] earliest divergent layer is localized
[ ] competing hypotheses were considered
[ ] evidence distinguishes cause from consequence
[ ] confidence matches evidence strength
[ ] remediation options are bounded
[ ] no unauthorized fix was applied
```

## 10. Diagnostic Report

Lead with the finding:

```text
Root cause:
Failure layer:
Evidence:
Reproduction:
Why competing explanations are weaker:
Impact boundary:
Remediation options:
Residual uncertainty:
```

If no root cause is established, say “not established” and report the strongest
localization achieved. A precise partial diagnosis is better than an invented cause.
