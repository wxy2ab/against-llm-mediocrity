# Bounded Repair and Bug Fix

Status: first-wave operating guideline

Primary mode: scoped mutation

Prerequisite: a reproducible defect or sufficiently localized cause

Chinese: [局部修复与 Bug Fix](./bounded-repair-and-bug-fix.zh-CN.md)

## 1. Outcome

A bounded repair removes a specified defect while preserving behavior outside the
authorized change surface.

```text
failing oracle bound to current state
→ verified repair plan
→ smallest sufficient implementation
→ local and global verification
→ collateral audit
→ commit-ready artifact
```

The target is not the smallest textual diff. It is the smallest change that fully
repairs the causal mechanism and can be verified.

## 2. Entry Gate

Enter this workflow only when:

- the requested behavior is clear;
- the defect is reproduced or strongly localized;
- the authoritative candidate and version are known;
- the repair can be bounded without redesigning the product;
- a verifier can observe the corrected behavior.

Return to diagnosis when the cause is uncertain. Route to feature/refactor/migration
when the fix changes public semantics, crosses compatibility boundaries, or requires
broad architecture changes.

## 3. Freeze the Failing Case

Before editing, preserve:

```text
minimal failing input
expected vs observed
command/environment
failure output
candidate hash or commit
relevant configuration
```

Prefer an automated regression test. If one is impractical, persist a deterministic
reproduction script, fixture, trace, or explicit inspection procedure.

Do not write a test that merely asserts the intended implementation detail. It must fail
for the observed defect and pass for the repaired behavior.

## 4. Form the Repair Plan

The plan must identify:

```json
{
  "cause": "...",
  "targets": ["stable-symbol-or-id"],
  "invariants": ["behavior to preserve"],
  "operation": "patch|regional-rewrite|controlled-full-rewrite",
  "tests": ["failing oracle", "regressions"],
  "rollback": "..."
}
```

Check:

- the target belongs to the active implementation;
- the plan repairs the cause, not only the final symptom;
- old-value or state preconditions still hold;
- generated files and source files are not confused;
- no user-authored unrelated change will be overwritten.

## 5. Choose Delivery Scale

Use this order:

```text
deterministic transformation when semantics are fully known
→ stable-ID Patch for sparse localized repair
→ Regional Rewrite when a coherent region owns the invariant
→ controlled Full Rewrite only when local preservation is harder or less safe
```

Patch is a strong default for sparse, verified-plan repairs, not a universal law.

Choose a larger delivery unit when:

- the local structure is already invalid;
- the invariant spans most of the region;
- many edits are tightly coupled;
- a generated artifact must be regenerated from its source;
- a compatibility transition requires coordinated old/new behavior.

Full Rewrite must occur in isolation and pass structured diff plus full regression.

## 6. Implement Without Expanding Scope

During implementation:

- read the exact target before editing;
- preserve local style and existing abstractions unless they cause the defect;
- do not mix unrelated cleanup;
- add comments only for non-obvious constraints or rationale;
- update call sites, schemas, tests, and docs only when required by the repair;
- keep the repository runnable after each meaningful checkpoint;
- rerun the failing oracle after each causal change.

If the repair reveals a second independent defect, record it separately unless it blocks
verification of the requested fix.

## 7. Verify in Layers

Run the narrowest useful check first, then expand:

```text
syntax/import/static check
→ regression test for the original defect
→ neighboring unit tests
→ affected integration/contract tests
→ repository-required suite
→ diff and collateral inspection
```

For concurrency, state, cache, or retry defects, include adversarial repetitions or a
deterministic scheduler when available. For security or permission defects, include a
negative test proving forbidden behavior remains rejected.

Do not hide failures by weakening, deleting, skipping, or over-mocking the oracle.

## 8. Collateral Audit

Inspect:

- changed files and hunks;
- behavior not named in the repair plan;
- public API, schema, config, persistence, and error contracts;
- dependency or lockfile changes;
- generated outputs;
- performance and resource regressions when relevant;
- local user changes still present.

Every changed line should map to the repair, its verifier, or required synchronization.

## 9. Failure Routing

| Failure | Route |
|---|---|
| Original oracle still fails | Revisit cause or implementation |
| New local test fails | Check invariant and affected caller |
| Broad regression fails | Reduce collateral or escalate delivery scale |
| State changed since plan | Refresh state and rebind/replan |
| Tool cannot express the operation | Use deterministic executor or controlled fallback |
| Fix requires new product behavior | Route to feature delivery |
| Compatibility must change | Route to migration |
| Adequate verifier is impossible | Mark ungated and request a decision |

Do not repeat the same repair attempt without new evidence.

## 10. Completion Gate

```text
[ ] failing case was frozen before the fix
[ ] repair targets the causal mechanism
[ ] requested behavior now passes
[ ] relevant neighboring behavior passes
[ ] no test was weakened to obtain success
[ ] diff contains no unauthorized cleanup
[ ] generated/docs/schema surfaces are synchronized when needed
[ ] user changes remain preserved
[ ] residual risks and unrun checks are explicit
```

Implementation without adequate verification is `implemented/ungated`, not complete.

## 11. Handoff

```text
Fixed:
Root cause:
Implementation:
Verification:
Collateral audit:
Files:
Residual risks / unrun checks:
Delivery state:
```

Lead with the repaired outcome, not a chronological tool log.
