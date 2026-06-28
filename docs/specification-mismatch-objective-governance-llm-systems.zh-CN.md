# LLM 系统中的规格失配与目标治理

**代理目标、隐性效用与反例驱动的规格修复**  
**工作稿 v0.1**
**Xinyun Wang, Shuliang Liang**

---

## 摘要

规格失配发生在 LLM 系统能够访问、优化、审计或解释的目标，与真正重要的任务效用之间出现偏离时。系统可能满足 prompt 却让用户失望，通过 rubric 却失败于真实任务，优化 benchmark metric 却违反语义意图，给出可辩护答案却错过决策标准，或遵循局部指令却损害全局目标。

本文把规格失配展开为 LLM 系统价值保存结构理论中的第六类原始失配。在世界到输出的管线中，规格失配位于评价站点：可访问代理目标 \(\tilde{U}\) 与真实任务效用 \(U\) 之间的关系。中心问题不是系统是否有足够事实、推理、概率质量或局部一致性，而是：**系统究竟在朝什么标准优化、选择、审计、奖励或修订，而这个标准是否保存真正重要的任务价值？**

本文区分规格失配与观测-表征失配、状态失配、拟合边界失配、支持失配和聚合失配，并给出规格失败类型：目标欠规格、代理过拟合、指标捕获、隐性效用损失、作用域漂移、偏好不一致、局部-全局目标冲突、验证器不完整、rubric 脆弱以及 Goodhart 式利用。本文主张，规格失配在 LLM 系统中特别核心，因为许多开放任务一开始并没有完整规格。真实成功条件常常通过候选失败、边界情况、专家审查、执行反馈、用户纠正和下游后果逐步发现。

建设性响应是 **目标治理**（Objective Governance）：对任务目标进行有纪律的归纳、修订、定界、审计和撤销。目标治理把 rubric、成功条件、偏好规则、评价标准、验收测试、验证器契约和效用假设视为受治理对象，而不是静态 prompt 文本。它直接连接审计工程：失败不应只是降低分数，而应更新规格、创建控制增量、添加回归护栏，并修订目标适用条件。

在统一的受治理 LLM 架构中，观测治理确保任务相关变量进入表征；状态治理区分潜在体制；路由治理激活正确能力；支持治理让高价值候选可达；组合治理保存全局结构；目标治理决定什么算成功，并防止整个系统优化错误目标。

---

## 1. 在统一理论中的位置

价值保存结构理论把 LLM 系统失败分析为任务价值在世界到输出管线中的丢失或扭曲：

```text
S_world
  → observation / sensing
  → representation
  → state identification
  → capability routing
  → candidate support
  → aggregation / composition
  → evaluation / selection
  → committed output or action
```

每类原始失配对应管线中的不同站点：

| 管线站点 | 原始失配 | 核心问题 |
|---|---|---|
| 世界到观测 / 表征 | 观测-表征失配 | 决定性变量是否进入操作表征？ |
| 表征到潜在情境 | 状态失配 | 我们处于哪个隐藏状态或体制？ |
| 表征到能力激活 | 拟合边界失配 | 正确能力是否在正确领域触发？ |
| 候选上的策略和搜索 | 支持失配 | 高价值结构在搜索流程下是否可达？ |
| 局部部分到全局产物 | 聚合失配 | 局部好 parts 能否组合成全局价值？ |
| 可访问评价器到真实效用 | 规格失配 | 系统是否在优化正确目标？ |

本文展开最后一个站点：**规格失配**。

治理问题是：

```text
系统相信“成功”是什么意思，而这个信念是否忠于任务？
```

规格失配不是因为系统主要缺信息、错判状态、未触发能力、到不了候选或无法组合 parts。系统可能把这些都做得足够好，却仍因为指导选择、修订或验收的标准不是真实标准而失败。

系统可以非常有效地优化错误目标。

这就是规格失配危险的原因：它会把其他所有改进机制都变成更高效的“错过重点”。

---

## 2. 核心定义

令 \(Y\) 是候选输出、artifact、plan、query、patch、answer 或 action sequence。

令 \(U(Y, S)\) 是世界状态 \(S\) 中 \(Y\) 的真实任务效用。这是用户、领域、环境、机构、benchmark 语义或下游后果真正关心的价值。

令 \(\tilde{U}(Y, Z)\) 是 LLM 系统使用的可访问评价函数。它可以是 prompt 指令、rubric、reward model、preference model、benchmark metric、verifier、self-critique、human label、unit test、execution result、ranking rule、policy constraint 或非正式验收条件。

**规格失配** 发生在任务相关候选对 \(Y_1, Y_2\) 上：

```text
rank_U(Y1, Y2) ≠ rank_Ũ(Y1, Y2)
```

或优化 \(\tilde{U}\) 系统性地无法改进 \(U\)。

等价地说：

```text
系统在一个不保存真实任务效用的代理目标下优化、选择、修订或接受。
```

失配可以是局部、全局、条件性或动态的：

```text
Local:        proxy fails on a small class of cases.
Global:       proxy is generally misaligned with true value.
Conditional:  proxy is valid only under some states or scopes.
Dynamic:      proxy becomes invalid after system behavior adapts to it.
```

因此，规格不只是 prompt 中的一句话。它是决定系统把什么当成功的整个操作结构。

---

## 3. 规格不等于指令

普通 prompt engineering 常把规格等同于给模型的指令：

```text
"Write a concise answer."
"Generate a SQL query."
"Fix this bug."
"Summarize the document."
"Rank these candidates."
```

但在受治理 LLM 系统中，规格包含更多内容：

```text
user intent
acceptance criteria
rubric dimensions
hidden constraints
risk tolerance
domain conventions
benchmark semantics
execution conditions
state-dependent priorities
non-goals
scope boundaries
failure costs
revocation conditions
human preferences
institutional rules
external verifier contracts
```

prompt 只是规格的一种表达。它可能不完整、歧义、过期、过宽、约束不足或内部不一致。

有用区分是：

```text
Stated instruction: 用户或开发者说了什么。
Operational specification: 系统实际用来生成、选择、修订或接受的标准。
True utility: 真实任务中什么才算成功。
```

规格失配可能发生在这些层之间。

例子：

```text
Stated instruction: "Make this answer more professional."
Operational specification: 增加正式语气并 hedge 有争议 claim。
True utility: 让答案更清楚、更果断、更适合技术读者。
```

系统满足了操作代理，却伤害了真实目标。

---

## 4. 为什么规格失配是原始失配

规格失配是原始的，因为它位于价值保存管线中的结构上独立站点。

其他失配关注系统是否拥有产生有价值 artifact 的材料和机制：

```text
Observation-representation: Is the decisive variable present?
State: Is the situation identified?
Fitting-boundary: Is the right capability activated?
Support: Is the high-value candidate reachable?
Aggregation: Does local quality compose globally?
```

规格失配问的是另一个问题：

```text
即使系统能产生正确 artifact，它会把它识别、选择并保存为“正确”吗？
```

这独立于其他失配。

系统可能有完美观测、正确状态识别、正确能力路由、足够支持和可靠聚合，却因为评价器奖励错误东西而失败。

反过来，系统也可能有优秀规格，却因为缺变量、状态歧义、路由失败、低支持或组合失败而失败。

这种独立性给规格失配一个独立修复目标：目标修复。

修复不是更多上下文、更多搜索、更好路由或更好组合，而是修订成功标准本身。

---

## 5. 与其他五类失配的边界

强理论必须区分规格失配与相邻失败类型。真实失败常是复合的，但原始修复目标仍应可识别。

### 5.1 规格 vs 观测-表征

观测-表征失配问：

```text
Did the task-critical variable enter the representation?
```

规格失配问：

```text
Given the variables available, does the evaluator value the right outcome?
```

例子：

```text
Task: recommend the best database migration plan.
```

如果系统没有收到 downtime constraints，那是观测-表征失配。

如果系统收到 downtime constraints，却用奖励 elegance 而非 operational safety 的 rubric，那是规格失配。

### 5.2 规格 vs 状态

状态失配问：

```text
Which latent situation are we in?
```

规格失配问：

```text
What should count as success in this situation?
```

如果系统无法判断测试失败来自真实 bug 还是 flaky infrastructure，那是状态失配。

如果它知道环境 flaky，却把 “make all tests pass” 当唯一目标，忽略 reproducibility 和 root-cause isolation，那是规格失配。

### 5.3 规格 vs 拟合边界

拟合边界失配问：

```text
Was the right capability triggered?
```

规格失配问：

```text
Was the triggered capability evaluated against the right success condition?
```

如果金融策略审计中模型触发通用风险评论而非机制级策略分析，那是拟合边界失配。

如果模型做了详细分析，但 rubric 奖励保守语言而非 alpha preservation，那是规格失配。

### 5.4 规格 vs 支持

支持失配问：

```text
Is the high-value structure reachable as a candidate?
```

规格失配问：

```text
If the high-value candidate appears, will the system prefer it?
```

如果正确 join path 从未生成，是支持失配。

如果正确 join path 已生成，却因 evaluator 过度偏好语法简单或 exact-match 外观而被拒绝，那是规格失配。

### 5.5 规格 vs 聚合

聚合失配问：

```text
Do locally good parts compose into global value?
```

规格失配问：

```text
Is the system judging the global artifact by the right value function?
```

如果法律论证每段都强但整体自相矛盾，是聚合失配。

如果论证连贯，但被优化成 rhetorical force，而真实目标是 settlement leverage，那是规格失配。

---

## 6. 规格失配类型

以下类型是干预地图，不是僵硬 taxonomy。

### 6.1 目标欠规格

prompt 或 rubric 省略重要成功条件。

```text
"Write a good answer."
"Make this better."
"Fix the issue."
"Generate the best query."
```

系统必须从弱上下文信号中推断什么重要。如果省略标准影响任务效用，系统会优化一个 plausible 但错误的目标。

常见症状：

```text
generic improvement
surface polishing
unwanted hedging
missing domain constraints
failure to ask necessary clarifying questions
reasonable but irrelevant output
```

修复目标：

```text
success-condition extraction
rubric induction
non-goal declaration
scope clarification
acceptance criterion generation
```

### 6.2 代理过拟合

系统优化原本与真实效用相关、但在优化下变得不可靠的代理。

```text
verbosity as a proxy for thoroughness
confidence as a proxy for correctness
politeness as a proxy for usefulness
unit-test pass rate as a proxy for semantic correctness
execution success as a proxy for intended SQL semantics
citation count as a proxy for authority
format compliance as a proxy for task completion
```

代理过拟合危险在于，系统在可见指标下看似进步，却在真实效用下退化。

修复目标：

```text
proxy-risk audit
multi-criterion evaluation
counterexample bank
metric scope conditions
anti-Goodhart guard
```

### 6.3 隐性效用损失

许多任务包含隐性效用：专家或用户默认但没有说出的标准。

```text
business memo 应保存 decision leverage，而不只是总结事实。
code review 应识别 maintainability risk，而不只是明显 bug。
data analysis 应保存 causal caution，而不只是报告 correlations。
research critique 应定位 strongest failure mode，而不是列 generic weaknesses。
SQL query 应匹配语义意图，而不只是执行。
```

隐性效用损失发生在系统满足显式标准，却漏掉隐含价值。

修复目标：

```text
domain-specific rubric induction
expert preference elicitation
contrastive examples
failure-mode taxonomy
implicit constraint extraction
```

### 6.4 作用域漂移

目标在某个作用域内有效，但越界后无效。

```text
"Be concise" 对 executive summaries 有用，但对 safety-critical instructions 有害。
"Avoid speculation" 对 factual reporting 有用，但对 hypothesis generation 有害。
"Optimize runtime" 在 correctness 已建立后有用，但在 semantic correctness 前有害。
"Follow the user's wording" 对 style transfer 有用，但当用户术语歧义时有害。
```

作用域漂移发生在规则逃离其有效条件时。

修复目标：

```text
conditioned objectives
scope annotations
priority rules
revocation triggers
state-dependent rubrics
```

### 6.5 偏好不一致

系统不同部分可能编码不一致偏好。

```text
system prompt 奖励 caution；用户要求 decisiveness。
benchmark 奖励 exact match；任务要求 semantic equivalence。
verifier 奖励 test passing；人类想要 maintainable code。
style rubric 奖励 brevity；法律上下文要求 nuance。
```

系统可能振荡、hedge，或满足最显著/最容易满足的标准。

修复目标：

```text
preference hierarchy
conflict-resolution rules
priority lattice
stakeholder-specific objectives
explicit tradeoff declarations
```

### 6.6 局部-全局目标冲突

局部目标可能与全局目标冲突。

```text
每段应 self-contained，但整篇文档应避免重复。
每个 SQL clause 应简单，但完整 query 必须表达复杂关系。
每个 code change 应 minimal，但 patch 必须保存 architecture consistency。
每个 agent step 应 productive，但 workflow 不应偏离最终目标。
```

这类似聚合失配，但原始错误在目标层：局部标准相对全局标准被过度优先。

修复目标：

```text
global objective declaration
local criterion scoping
global acceptance tests
composition-aware rubric
hierarchical evaluation
```

### 6.7 验证器不完整

验证器可能只检查真实目标的一部分。

```text
Code compiles but violates the intended behavior.
SQL executes but returns the wrong semantic result.
Generated report has citations but misuses them.
Plan satisfies stated constraints but ignores operational risk.
Proof-like explanation is syntactically formal but has an invalid lemma.
```

验证器不完整不是放弃验证的理由，而是治理验证器作用域的理由。

修复目标：

```text
verifier scope declaration
complementary audits
semantic test generation
manual review triggers
non-covered-risk ledger
```

### 6.8 Rubric 脆弱

rubric 可能过于刚性、粗糙或对上下文不敏感。

```text
penalizing all uncertainty language
rewarding all citations equally
requiring fixed structure for tasks with different information needs
using the same checklist for exploration and final recommendation
```

rubric 脆弱使系统满足评价字面，却丢失任务特定价值。

修复目标：

```text
context-conditioned rubric
rubric exception cases
calibration examples
rubric revision history
rubric conflict audit
```

### 6.9 目标污染

目标可能被 prompt、上下文、先前例子、benchmark artifacts 或模型先验中的无关信号污染。

```text
模型模仿先前 examples，即使当前任务不同。
系统把 formatting convention 当语义要求。
模型推断用户想要 agreement 而非 correction。
系统使用 benchmark-specific shortcuts，而非任务语义。
```

修复目标：

```text
source-prior correction
example influence audit
format-semantic separation
benchmark artifact detection
```

### 6.10 目标过期

任务演化后目标可能过期。

```text
stakeholder decision 后 project plan 改变。
发现 root cause 后 debugging objective 改变。
新证据出现后 research objective 改变。
用户纠正后 conversation objective 改变。
```

如果系统继续优化旧目标，会看似一致但实际上过时。

修复目标：

```text
objective versioning
state-linked objective updates
revocation triggers
change logs
transition-committed specification updates
```

---

## 7. 形式模型

最小形式化区分四个对象：

```text
S: world state
Z: operational representation
Y: candidate artifact
U: true utility
Ũ: accessible proxy objective
```

系统选择：

```text
Y_hat = argmax_Y Ũ(Y, Z)
```

但任务要求：

```text
Y_star = argmax_Y U(Y, S)
```

当以下情况出现时，存在规格失配：

```text
U(Y_hat, S) << U(Y_star, S)
```

因为：

```text
Ũ ≠ U over task-relevant distinctions.
```

较弱的排序条件是：

```text
∃ Y1, Y2 such that Ũ(Y1, Z) > Ũ(Y2, Z)
but U(Y1, S) < U(Y2, S)
```

条件性规格是按状态、作用域或阶段索引的目标族：

```text
Ũ = {Ũ_c : c ∈ C}
```

其中 `c` 可以表示：

```text
task phase
latent state
risk tier
user type
artifact type
verification mode
workflow stage
```

条件性规格失配发生在：

```text
wrong condition selected: c_hat ≠ c_star
```

或：

```text
right condition selected but Ũ_c still misranks candidates under U.
```

这说明规格失配为何与状态失配和拟合边界失配耦合：如果系统选错状态或阶段，也可能选错目标。

---

## 8. 规格失配作为修复算子的门

规格失配特别有力，因为它会 gating 其他修复算子。

如果目标错，其他地方的改进可能有害。

```text
Better observation → more evidence for the wrong objective.
Better state identification → more precise pursuit of the wrong goal.
Better routing → stronger activation of the wrong capability.
Better support search → more candidates optimized for the wrong criterion.
Better aggregation → more coherent realization of the wrong plan.
Better audit → more efficient enforcement of the wrong rubric.
```

这是超加性失败的中心机制。

令 `R_i` 是其他站点的修复算子。它的价值取决于输出被什么目标选择：

```text
Effect(R_i) = Effect(R_i | Ũ faithful to U)
```

当 \(\tilde{U}\) 严重偏离时：

```text
∂U / ∂R_i may be zero or negative
```

即使：

```text
∂Ũ / ∂R_i is positive.
```

这就是高风险系统中目标治理不可选的原因。没有它，整个受治理架构可能成为生产“看起来更好的错误”的机器。

---

## 9. 目标治理

**目标治理** 是把目标、rubric、成功条件、代理、验证器、偏好和验收标准作为受治理对象进行管理的纪律。

它不把规格视为静态指令，而视为必须被：

```text
induced
scoped
prioritized
audited
versioned
revised
weakened
revoked
committed to state
```

的 artifact。

目标治理有六个核心原则。

### 9.1 目标是对象

规格应表示为带字段的对象，而不是只嵌在 prompt prose 中。

最小 Objective Object schema：

```json
{
  "id": "objective.unique_identifier",
  "type": "objective | rubric | success_condition | proxy_metric | acceptance_test | verifier_contract | preference_rule",
  "condition": "When this objective applies",
  "assertion": "What counts as success or improvement",
  "priority": "How this objective ranks against others",
  "scope": "Task, phase, artifact, user, state, or risk tier where valid",
  "evidence": "Why this objective is believed to represent task value",
  "proxy_risks": "Ways this objective can be satisfied while true utility fails",
  "non_goals": "What this objective does not optimize",
  "verifier": "How satisfaction is checked, if checkable",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "When this objective should be revised or removed",
  "owner": "User, developer, system, domain authority, benchmark, or governance layer"
}
```

这个 schema 迫使系统区分：

```text
what is being optimized
where it applies
why it is trusted
what it does not cover
when it should stop applying
```

### 9.2 目标必须有作用域

无作用域目标很危险。

```text
Be concise.
Be safe.
Be helpful.
Be rigorous.
Pass tests.
Optimize accuracy.
Preserve style.
Minimize change.
Use citations.
```

它们各自在某些上下文正确，在另一些上下文有害。

目标治理要求显式作用域：

```text
phase scope: exploration / drafting / final answer / execution
artifact scope: SQL / explanation / code patch / report / plan
risk scope: low-risk / high-risk / safety-critical
state scope: known / ambiguous / adversarial / incomplete
user scope: novice / expert / decision-maker / implementer
```

### 9.3 目标需要优先级规则

LLM 系统常面对多个目标：

```text
accuracy
brevity
safety
completeness
faithfulness
maintainability
speed
style
user preference
legal constraints
benchmark metric
```

没有显式优先级时，系统可能选择最显著或最容易满足的目标。

优先级规则可以简单：

```text
Correctness > completeness > style.
Safety constraints override helpfulness.
Semantic intent overrides exact phrasing.
Execution correctness is necessary but not sufficient.
```

也可以条件化：

```text
During exploration, recall > precision.
During final answer, precision > recall.
For high-risk recommendations, uncertainty disclosure > fluency.
For code patches, semantic preservation > minimal diff size.
```

### 9.4 目标需要代理风险审计

每个操作目标都应包含已知失败模式。

```json
{
  "objective": "Pass unit tests",
  "proxy_risks": [
    "tests may not cover intended behavior",
    "patch may hard-code test cases",
    "performance regressions may be untested",
    "maintainability may degrade"
  ]
}
```

这防止系统把代理误认为完整效用。

### 9.5 目标需要修订路径

开放任务常通过失败揭示真实规格。

```text
"No, I meant compare the mechanisms, not summarize the papers."
"This SQL executes, but it answers the wrong question."
"The code passes tests, but it breaks the abstraction."
"The answer is accurate, but not useful for this audience."
```

这些纠正不应只触发再生成，而应更新目标对象。

### 9.6 目标需要撤销

某些目标应在作用域变化后停止适用。

```text
临时 debugging objective 不应治理最终 architecture。
benchmark-specific formatting rule 不应治理真实部署。
用户初步偏好在明确纠正后应撤销。
safety fallback 在任务被分类为 harmless 后应弱化。
```

撤销很关键，因为过期目标会造成持久系统漂移。

---

## 10. 规格审计

**规格审计** 问系统目标是否忠实代表任务价值。

它不同于输出评价。输出评价问：

```text
Is this artifact good under the current criterion?
```

规格审计问：

```text
Is the current criterion the right criterion?
```

最小规格审计清单：

```text
1. What objective is currently being optimized?
2. Is it explicit or implicit?
3. Who supplied it?
4. What true utility is it intended to proxy?
5. Under what scope is it valid?
6. What does it ignore?
7. What candidates would it incorrectly reward?
8. What candidates would it incorrectly penalize?
9. What evidence supports its validity?
10. What would trigger revision or revocation?
```

适合执行规格审计的情形：

```text
outputs are locally good but user dissatisfaction persists
a system passes visible checks but fails downstream
multiple revisions improve style but not usefulness
a metric improves while expert judgment worsens
candidate rankings feel unstable or arbitrary
user corrections reveal unstated criteria
benchmark success does not transfer to real tasks
```

---

## 11. 规格失配的审计发现

规格失配应在审计工程中表示为局部化 finding。

规格相关 Audit Finding schema：

```json
{
  "id": "finding.specification_mismatch.example",
  "artifact": "candidate output or system behavior",
  "finding": "The artifact satisfies the visible rubric but violates the true task objective.",
  "evidence": "Specific contrast between proxy success and utility failure.",
  "mismatch_type": "specification",
  "severity": "medium | high | critical",
  "repair_target": "objective | rubric | verifier | acceptance_test | preference_rule | priority_order",
  "control_delta": "Change to the governed objective object.",
  "regression_guard": "A test or scenario that fails if the proxy-success/utility-failure pattern recurs.",
  "confidence": "Confidence in the mismatch diagnosis"
}
```

例子：

```json
{
  "id": "finding.sql.semantic_proxy_failure",
  "artifact": "Generated SQL query",
  "finding": "The query executes successfully but answers a different question than the natural-language request.",
  "evidence": "Execution returns non-empty results, but selected column and grouping correspond to department count rather than employee count requested by the user.",
  "mismatch_type": "specification",
  "severity": "high",
  "repair_target": "acceptance_test",
  "control_delta": "Execution success must be treated as necessary but not sufficient; add semantic intent check comparing selected measure and grouping against question decomposition.",
  "regression_guard": "Inject an executable but semantically wrong SQL candidate; guard must reject it.",
  "confidence": "high"
}
```

这个结构把失败转化为目标更新。

---

## 12. 目标修复的控制增量

**控制增量** 是对受治理控制空间的局部改变。对规格失配而言，控制增量改变系统如何定义、优先、检查或撤销成功。

### 12.1 添加缺失标准

```text
Add a new success condition that was previously tacit.
```

例子：

```text
Generated summaries must preserve decision-relevant uncertainty, not only main claims.
```

### 12.2 收窄目标作用域

```text
Restrict an objective to the contexts where it is valid.
```

例子：

```text
"Be concise" applies to the executive overview, not to the risk disclosure section.
```

### 12.3 添加优先级规则

```text
Resolve conflict between objectives.
```

例子：

```text
For code repair, semantic correctness outranks minimal diff size.
```

### 12.4 添加代理风险护栏

```text
Prevent the system from satisfying the proxy while failing the true utility.
```

例子：

```text
Passing unit tests does not authorize completion if the patch changes public API semantics.
```

### 12.5 添加负例

```text
Store a candidate that should be rejected despite looking good under the proxy.
```

例子：

```text
An answer with many citations but no causal analysis is not sufficient for this task.
```

### 12.6 修订验证器契约

```text
Change what the verifier is allowed to certify.
```

例子：

```text
Execution success certifies syntactic validity and runtime feasibility, not semantic correctness.
```

### 12.7 版本化目标

```text
Commit a new objective version after task state changes.
```

例子：

```text
After root cause is identified, objective changes from exploration to minimal safe patch.
```

---

## 13. 规格失配回归护栏

规格回归护栏防止 proxy-success / true-utility-failure 模式复发。

好的护栏有牙齿：

```text
If a representative specification defect is reintroduced, the guard must fail.
```

### 13.1 对比候选对

存储两个候选：

```text
Y_bad: scores well under old proxy, fails true utility.
Y_good: better under true utility, perhaps less attractive under old proxy.
```

护栏要求系统偏好 `Y_good`。

### 13.2 代理利用测试

构造利用代理的 artifact：

```text
A verbose answer that says little.
A SQL query that executes but answers the wrong measure.
A code patch that passes tests by hard-coding cases.
A citation-rich report that misrepresents evidence.
A safe-sounding recommendation that avoids the user's actual decision.
```

护栏必须拒绝它。

### 13.3 作用域边界测试

测试目标是否越界适用。

例子：

```text
"Be concise" should not suppress legally required caveats.
```

### 13.4 优先级冲突测试

测试系统是否正确解决目标冲突。

例子：

```text
When brevity conflicts with correctness, correctness must win.
```

### 13.5 验证器权威测试

测试系统是否过度声称验证器证明了什么。

例子：

```text
A unit-test pass may allow "tested under current suite" but not "bug fully fixed" unless additional semantic checks pass.
```

---

## 14. 目标对象与 GKO 集成

目标治理应接入受治理知识对象模型。

目标可以表示为 GKO：

```json
{
  "id": "gko.objective.semantic_correctness_over_execution_only",
  "type": "rubric | success_condition | verifier_contract",
  "condition": "Text-to-SQL tasks where execution feedback is available",
  "assertion": "Execution success is necessary but not sufficient; semantic intent alignment must be checked separately.",
  "strength": "hard",
  "priority": "higher than syntactic simplicity and query brevity",
  "evidence": "Executable queries can answer the wrong natural-language question.",
  "source": "Audit finding from semantic proxy failure",
  "lifespan": "project",
  "revocation_trigger": "If a complete semantic verifier is introduced that subsumes this check",
  "not_supported_claims": "Does not imply that execution feedback is unimportant; it remains a necessary lower-level check."
}
```

该对象可指导：

```text
candidate ranking
audit prompts
verifier interpretation
SQL repair
regression guard creation
completion claims
```

目标 GKO 不同于普通事实。它治理价值判断，而不只是描述世界。

---

## 15. 目标治理与 SGAR

目标应连接硬状态。

长程系统中，目标变化不能只是 loose context update，而应是已提交转移。

状态转移可能是：

```text
S: current task objective = "identify root cause"
A: user confirms root cause and asks for patch
O: confirmation message + failing test isolated
V: transition criterion satisfied
S': current task objective = "produce minimal safe patch preserving public API"
```

关键原则：

```text
模型可以建议目标更新，但只有有效转移才能提交它。
```

否则目标会漂移。agent 可能在任务变化后继续优化旧阶段，或在未经授权时静默改变目标。

SGAR 因此需要：

```text
objective versioning
objective transition records
state-linked rubrics
commit criteria for objective changes
rollback when objective updates are invalid
```

最小 Objective Transition Record：

```json
{
  "transition_id": "transition.objective.001",
  "previous_objective": "Explore possible causes of failing test",
  "proposed_objective": "Implement minimal patch for confirmed root cause",
  "trigger": "User confirmed root cause and requested patch",
  "evidence": "Conversation turn, test output, audit finding",
  "verifier": "Root cause finding accepted and patch request explicit",
  "committed": true,
  "rollback_condition": "If new evidence contradicts the root cause"
}
```

---

## 16. Text-to-SQL 中的目标治理

Text-to-SQL 是有用例子，因为即使有执行反馈也常见规格失配。

朴素目标是：

```text
Generate a SQL query that executes successfully.
```

真实目标更接近：

```text
Generate a SQL query that semantically answers the natural-language question under the database schema and contents.
```

执行是必要但不充分。

规格失配出现于：

```text
query executes but answers the wrong measure
query uses plausible but wrong column
query groups by the wrong entity
query filters by the wrong value interpretation
query returns non-empty results but violates question intent
query matches benchmark artifacts but not semantic meaning
```

目标治理引入分层 rubric：

```text
1. SQL syntax validity
2. Executability
3. Schema-linking correctness
4. Value-linking correctness
5. Join-path semantic correctness
6. Predicate correctness
7. Aggregation correctness
8. Result-set semantic alignment
9. Benchmark-specific answer format
```

每层都有作用域和权威。

```text
Executability can reject invalid SQL.
Executability cannot certify semantic correctness.
Result comparison can catch many errors.
Result comparison may still miss semantically wrong queries that coincidentally produce the same result.
Semantic decomposition can identify intended measure, entity, condition, and grouping.
```

受治理 text-to-SQL 系统应维护 Objective GKOs：

```text
Execution success is necessary but not sufficient.
Question decomposition has authority over syntactic simplicity.
Join path must be justified by schema relation and question semantics.
Aggregation must match the requested measure and grouping.
Value normalization must preserve user intent.
```

这些不是额外实验，而是解释控制空间方法为何优于直接 SQL 生成的目标层。

---

## 17. 代码修复中的目标治理

代码修复也暴露规格失配。

朴素目标是：

```text
Make the tests pass.
```

真实目标可能是：

```text
Fix the underlying bug while preserving intended behavior, maintainability, public interfaces, performance constraints, and architectural invariants.
```

常见规格失败：

```text
hard-code test cases
weaken assertions
remove failing behavior instead of fixing it
change public API without authorization
optimize local function while breaking system invariant
pass current tests but fail implied behavior
```

目标治理要求：

```text
test authority scoping
semantic preservation rules
minimal-change priority only after correctness
public API invariants
architecture constraints
regression guards for representative bug behavior
```

示例 Objective GKO：

```json
{
  "id": "gko.code.tests_necessary_not_sufficient",
  "type": "verifier_contract",
  "condition": "Automated tests are available for code repair",
  "assertion": "Passing tests is necessary evidence but does not by itself certify semantic correctness or maintainability.",
  "strength": "hard",
  "priority": "over completion claims",
  "proxy_risks": [
    "hard-coded test behavior",
    "untested edge-case regression",
    "architectural degradation"
  ],
  "revocation_trigger": "Only if test suite is proven complete for the declared behavioral spec"
}
```

---

## 18. 写作与分析中的目标治理

写作任务看起来主观，但仍有规格。

用户可能说：

```text
"Make this stronger."
```

系统可能解释为：

```text
more assertive tone
more polished language
more persuasive phrasing
```

但真实目标可能是：

```text
clearer argument structure
better evidence hierarchy
more precise claim boundaries
less generic language
better reader actionability
```

写作中的规格失配常产生：

```text
polished mediocrity
confident but unsupported claims
generic professional tone
loss of original insight
inflated structure without sharper argument
```

目标治理可以表示任务特定写作目标：

```json
{
  "id": "gko.writing.strength_means_argument_power",
  "type": "success_condition",
  "condition": "User asks to make analytical writing stronger",
  "assertion": "Strength means clearer thesis, sharper causal structure, better evidence use, and reduced generic phrasing; not merely more assertive tone.",
  "priority": "argument quality over surface polish",
  "proxy_risks": [
    "rhetorical inflation",
    "unwarranted confidence",
    "generic executive tone"
  ],
  "revocation_trigger": "User explicitly asks for style-only editing"
}
```

这解释了普通 rewriting 为什么会局部对齐但全局平庸：模型擅长表面改进，但目标本应是 argument repair。

---

## 19. Agentic 工作流中的目标治理

Agentic workflows 中，规格失配常表现为阶段混淆。

agent 可能优化错误阶段目标：

```text
Exploration objective: maximize relevant hypotheses.
Diagnosis objective: discriminate among hypotheses.
Repair objective: make minimal validated change.
Finalization objective: document and commit verified result.
```

如果 agent 在 repair 阶段继续 explore，会浪费 effort。若在 diagnosis 阶段 finalize，会制造 false completion。若在 root cause 识别前优化 minimal change，会 patch symptoms。

agent 的目标治理要求：

```text
phase-specific objectives
transition criteria between phases
phase-linked verifiers
objective state records
completion authority rules
```

阶段目标表：

| Phase | Objective | Completion criterion | Common proxy failure |
|---|---|---|---|
| Explore | Identify plausible hypotheses | Hypothesis set covers observed symptoms | Generic brainstorming |
| Diagnose | Discriminate root cause | Evidence supports one cause over alternatives | Premature certainty |
| Repair | Implement minimal safe fix | Patch addresses root cause and passes checks | Test hacking |
| Verify | Confirm no regression | Relevant guards pass | Overclaiming from partial tests |
| Finalize | Commit and report | State transition recorded | Narrative completion |

这把规格失配直接连接到 SGAR。

---

## 20. 目标治理协议

实践中的目标治理协议有八步。

### Step 1: 提取候选目标

识别系统看起来正在优化什么：

```text
explicit user instruction
system prompt criterion
rubric items
implicit model behavior
benchmark metric
verifier result
human preference signal
```

### Step 2: 识别真实效用假设

说明真实任务中的成功可能意味着什么：

```text
What downstream consequence matters?
What would make the user accept or reject the result?
What would an expert consider a failure?
What is not captured by the visible metric?
```

### Step 3: 比较代理与效用

询问：

```text
Where can Ũ be high while U is low?
Where can U be high while Ũ is low?
```

### Step 4: 定界目标

指定：

```text
when it applies
where it does not apply
which phase it governs
which risks it ignores
```

### Step 5: 定义优先级和冲突规则

指定目标排序：

```text
correctness over fluency
semantic intent over exact phrasing
safety constraint over user preference
verified state over narrative claim
```

### Step 6: 添加代理风险护栏

创建代理具有误导性的代表性案例。

### Step 7: 存为 Objective GKO

以证据、作用域、生命周期和撤销触发器提交目标。

### Step 8: 监控和修订

失败发生时，更新目标，而不是只再生成。

---

## 21. 目标治理与人机协作

规格失配常是协作问题。用户可能无法在看到失败前完整说明自己想要什么。

此时，系统不应假定初始 prompt 是完整目标，而应把 prompt 当作初始假设。

受治理协作循环：

```text
initial instruction
  → candidate objective hypothesis
  → artifact generation
  → user / audit feedback
  → objective refinement
  → updated GKO
  → revised artifact
```

重要区分：

```text
Clarifying the objective is not asking the user to do the system's job.
It is preserving task value when the true utility is underdetermined by the initial instruction.
```

但目标治理不应给用户增加过多负担。系统通常可以推断候选标准，并只在澄清的预期价值超过成本时提出有针对性问题。

---

## 22. 目标治理的失败模式

目标治理本身也会失败。

### 22.1 目标增殖

系统积累过多标准，导致生成脆弱或过度约束。

缓解：

```text
priority pruning
scope narrowing
objective merging
lifespan limits
```

### 22.2 Rubric 剧场

系统创建复杂 rubric，但它不影响选择或修复。

缓解：

```text
trace objective use in ranking and audit
require counterexample guards
verify rubric has behavioral consequences
```

### 22.3 代理倍增

增加更多代理可能制造完整性的幻觉，却仍漏掉真实效用。

缓解：

```text
explicit non-covered risks
expert review triggers
contrastive failure cases
```

### 22.4 目标锁定

临时目标在应该修订后继续持久存在。

缓解：

```text
revocation triggers
objective versioning
periodic scope audit
state-linked objective transitions
```

### 22.5 对用户纠正过拟合

系统从单次纠正中过度泛化。

缓解：

```text
conditioned objective updates
support scope limits
confidence levels
user-confirmed generalization
```

### 22.6 目标冲突压制

系统用模糊妥协输出隐藏冲突。

缓解：

```text
explicit tradeoff declaration
priority hierarchy
ask-for-decision triggers
```

---

## 23. 设计模式

### 23.1 必要但不充分模式

用于验证器只检查目标一部分的场景：

```text
X passing is necessary but not sufficient for Y.
```

例子：

```text
Execution is necessary but not sufficient for semantic SQL correctness.
Tests passing is necessary but not sufficient for correct code repair.
Citation presence is necessary but not sufficient for evidence quality.
```

### 23.2 代理利用模式

对每个代理，问：

```text
What artifact could maximize this proxy while failing the task?
```

把该 artifact 存为护栏。

### 23.3 作用域盒模式

每个目标都获得：

```text
applies_when
invalid_when
priority
revocation_trigger
```

### 23.4 对比目标对模式

用成对候选定义成功：

```text
Prefer A over B because A better preserves true utility, even though B scores higher on a tempting proxy.
```

### 23.5 阶段目标模式

Agentic tasks 应使用阶段特定目标，而不是一个全局指令。

```text
explore → diagnose → repair → verify → finalize
```

### 23.6 目标账本模式

维护目标变化账本：

```text
objective version
reason for change
evidence
scope
committed transition
rollback condition
```

---

## 24. 最小实现架构

支持目标治理的最小系统包含：

```text
Objective Extractor
Objective Store
Proxy-Risk Auditor
Priority Resolver
Verifier Scope Manager
Specification Audit Module
Control Delta Writer
Regression Guard Generator
State Commitment Layer
```

数据流：

```text
User task / system context
  → Objective Extractor
  → Objective Objects
  → Generation / Search / Routing
  → Candidate Artifact
  → Output Audit + Specification Audit
  → Audit Finding
  → Control Delta
  → Objective GKO Update
  → Regression Guard
  → State Commitment
```

这个架构不要求每个任务都用重治理。它允许需要时表示目标，任务简单时绕过。

---

## 25. 什么时候需要目标治理

目标治理特别有价值于：

```text
true success is tacit or expert-dependent
the visible metric is incomplete
failure costs are high
the task has multiple stakeholders
outputs are selected or revised over many rounds
user feedback reveals hidden criteria
benchmarks differ from deployment objectives
long-horizon agents change phases
verifiers are partial
the system keeps producing polished but unsatisfactory outputs
```

它可能不必要于：

```text
the objective is simple and explicit
the verifier is complete
the task is low-risk and one-shot
local quality strongly predicts global success
the user only wants surface transformation
governance overhead exceeds expected value gain
```

这个边界很重要。目标治理不是通用仪式，而是对目标不确定、代理风险和承载价值复杂性的响应。

---

## 26. 与 Goodhart 和机制设计的关系

规格失配与代理优化问题密切相关。当代理成为优化目标时，它可能不再保存原本代表的价值。

LLM 系统让这个问题更常见，因为目标常通过软 artifact 表达：

```text
prompts
rubrics
examples
reward models
preference labels
benchmarks
self-critiques
human comments
execution checks
```

这些 artifact 有用，但每个都压缩真实效用。目标治理让这种压缩显式且可修订。

机制设计类比也有帮助：LLM 系统是响应 prompt、metric、verifier 和 feedback 编码激励的优化器。如果激励结构奖励错误可观察行为，系统可能学习或选择满足激励却违反意图结果的策略。

目标治理的贡献，是把这些问题带入 LLM 系统推断时控制层。

---

## 27. 与其他治理层的关系

目标治理是更大受治理 LLM 架构中的一层。

```text
Observation Governance:
  Ensure decisive variables enter Z.

State Governance:
  Identify which latent regime the task is in.

Router Governance:
  Activate the right capabilities under the right conditions.

Support Governance:
  Make high-value structures reachable.

Compositional Governance:
  Preserve global value across local parts.

Objective Governance:
  Define, scope, audit, and revise what counts as success.

Audit Engineering:
  Convert failures into control deltas and regression guards.

SGAR:
  Commit valid objective changes and artifact completions into hard state.
```

这些层相互作用。目标治理常提供其他层使用的标准。但它也依赖其他层：若决定性变量缺席、状态错误、能力未触发、候选不可达或 artifact 组合破坏，好目标也无法应用。

---

## 28. 规格失配的自审计

“规格失配是原始失配”这一主张本身应有治理记录。

```json
{
  "id": "gko.theory.specification_mismatch_primitive",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as value-preservation pipelines with an accessible evaluator and true task utility",
  "assertion": "Specification mismatch is a primitive failure mode: the accessible objective can diverge from true utility even when observation, state, routing, support, and aggregation are adequate.",
  "strength": "structural-relative",
  "support_scope": "Tasks where system behavior is selected, revised, rewarded, or accepted under an operational criterion",
  "revocation_trigger": "Show that all objective divergence failures can be reduced to another primitive mismatch without losing intervention specificity.",
  "not_supported_claims": "Does not claim that every objective disagreement is resolvable; does not claim true utility is always fully knowable; does not claim objective governance eliminates the need for human judgment."
}
```

这个自审计很重要。目标治理不假定真实效用总能完全访问。它只假定代理目标应被视为会出错、有作用域、可修订的对象。

---

## 29. 结论

规格失配是目标保存失败。它发生在系统可访问标准 \(\tilde{U}\) 偏离真实任务效用 \(U\) 时。其结果不一定是 incoherence 或 hallucination，也可能是一个 polished、compliant、well-structured，却优化错误目标的 artifact。

这种失配是原始的，因为它位于世界到输出管线的评价站点。它不能还原为缺信息、状态歧义、能力误路由、低支持或组合失败。系统可能解决所有这些问题，但如果目标错，仍会选择错误 artifact。

建设性响应是目标治理：把目标表示为受治理对象，给它们定界、排序、审计代理风险、通过反例修订、附加回归护栏，并通过硬状态转移提交目标变化。

在统一理论中，目标治理完成了六站点价值保存图景。观测治理问变量是否进入表征；状态治理问系统处于什么情境；路由治理问应激活什么能力；支持治理问高价值候选是否可达；组合治理问局部 parts 是否形成全局价值；目标治理问价值本身意味着什么。

没有目标治理，系统可能越来越擅长优化错误标准。有了它，失败可以变成规格更新，代理风险可以变成护栏，rubric 可以变成有作用域的对象，任务价值不仅保存在输出中，也保存在系统对成功的演化理解中。

---

## Appendix A: 紧凑术语表

| 术语 | 定义 |
|---|---|
| 规格失配 | 可访问代理目标与真实任务效用之间的偏离。 |
| 真实效用 \(U\) | 任务语境中真正重要的价值。 |
| 代理目标 \(\tilde{U}\) | 系统用于生成、排序、修订或接受的操作标准。 |
| 目标治理 | 把目标作为有作用域、可修订、可审计受治理对象来管理。 |
| Objective Object | 成功条件、rubric、proxy 或 verifier contract 的结构化表示。 |
| 代理风险审计 | 分析代理如何被满足而真实效用失败。 |
| 隐性效用 | prompt 或 rubric 未明说但真实存在的任务价值。 |
| 作用域漂移 | 目标被应用到其有效条件之外。 |
| 验证器不完整 | 验证器只检查真实目标的一部分。 |
| Rubric 脆弱 | rubric 过于刚性或对上下文不敏感，无法保存任务价值。 |
| 目标过期 | 曾经有效的目标在任务状态改变后继续存在。 |
| 规格审计 | 审计当前目标是否是正确目标。 |
| Objective GKO | 定义或约束任务成功的受治理知识对象。 |
| 代理利用测试 | 满足代理但失败于真实效用的护栏案例。 |

---

## Appendix B: 最小目标对象模板

```json
{
  "id": "objective.<name>",
  "type": "objective | rubric | success_condition | proxy_metric | acceptance_test | verifier_contract | preference_rule",
  "condition": "When this objective applies",
  "assertion": "What counts as success or improvement",
  "priority": "How this objective ranks against other objectives",
  "scope": "Where this objective is valid",
  "evidence": "Why this objective is believed to track task value",
  "proxy_risks": [
    "How this objective could be satisfied while true utility fails"
  ],
  "non_goals": [
    "What this objective does not optimize"
  ],
  "verifier": "How satisfaction is checked, if checkable",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "When this objective should be revised or removed",
  "owner": "User | developer | system | domain authority | benchmark | governance layer"
}
```

---

## Appendix C: 规格审计清单

```text
1. What objective is currently being optimized?
2. Is the objective explicit, inferred, or inherited?
3. Who or what supplied the objective?
4. What true utility is the objective intended to proxy?
5. What important task value does the objective omit?
6. Under what condition is the objective valid?
7. Where does the objective stop applying?
8. What candidate would score high under the proxy but fail the task?
9. What candidate would score lower under the proxy but better satisfy true utility?
10. What conflicts exist with other objectives?
11. What priority rule resolves the conflict?
12. What evidence supports the objective?
13. What verifier, if any, checks it?
14. What does the verifier not prove?
15. What failure would trigger objective revision?
16. What regression guard prevents recurrence of the same specification defect?
17. Should the objective be committed to hard state?
18. What rollback condition applies?
```

---

## Appendix D: 示例目标账本条目

```json
{
  "objective_version": "obj.v3",
  "task": "Text-to-SQL query generation",
  "previous_objective": "Generate executable SQL",
  "new_objective": "Generate SQL that executes and semantically answers the natural-language question under the schema and database contents",
  "reason_for_change": "Audit found executable queries that answered the wrong measure",
  "evidence": [
    "semantic mismatch finding",
    "candidate query returned non-empty result",
    "question decomposition required employee count but query counted departments"
  ],
  "added_proxy_risks": [
    "execution success can mask semantic error",
    "non-empty result can mask wrong predicate or grouping"
  ],
  "added_guards": [
    "executable_wrong_measure_guard",
    "wrong_grouping_semantic_guard"
  ],
  "scope": "Text-to-SQL tasks with natural-language question and database schema",
  "committed_by": "state transition contract",
  "rollback_condition": "If a complete semantic verifier supersedes the layered objective"
}
```
