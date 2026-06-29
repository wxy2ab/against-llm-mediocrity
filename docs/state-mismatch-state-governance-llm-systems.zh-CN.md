# LLM 系统中的状态失配与状态治理

**潜在区间、可识别性与状态条件化控制**  
**工作稿 v0.1**  

---

## 摘要

高价值 LLM 系统经常失败，并不是因为模型缺少流畅语言、相关知识或局部上合理的策略，而是因为系统在决定性潜在状态尚未解决时，就像已经知道自己处在哪种情境里一样行动。同一个 prompt、schema、用户指令、代码 trace、研究问题、市场描述或工具输出，可能同时兼容多个任务状态，而最优行动在这些状态之间可能完全反转。在这类情况下，更自信的生成会让表现变差：模型把不确定性塌缩成一个方便解释，然后优化一个不适用于当前状态的策略。

本文把 **状态失配** 展开为 LLM 系统价值保存结构理论中的六类原始失配之一。状态失配位于这样一个管线站点：系统必须从可用观测和表征中推断、保存、分支或更新潜在任务状态：

```text
S_world → O → Z → state belief / state hypothesis → capability routing → candidate support → aggregation → evaluation
```

核心主张是：

> 当正确策略或评价依赖一个系统未识别、未保存或未更新的潜在状态，并且候选行动在多个可行状态下具有不同价值排序时，就会发生状态失配。

这把状态失配与观测-表征失配区分开来。观测-表征失配问的是决定性变量是否进入操作表征。状态失配问的是：在已有操作表征的前提下，系统能否判断哪个潜在区间、阶段、用户意图、环境条件、数据状态、依赖结构或任务状态正在生效。

本文提出状态失配的形式模型、状态失败模式分类、诊断特征、状态治理对象、审计发现、控制增量、回归护栏，以及它与知识治理、审计工程和状态治理型 Agent 体制的集成规则。它也解释状态失配如何与其他原始失配复合，以及为什么状态不确定性经常必须被显式表示，而不是过早塌缩成一个单一答案。

### 与 Diagnostic–Mechanism Bridge 的关系

本文使用六类原始失配作为价值保存诊断。当失败进入修复阶段时，应通过 Diagnostic–Mechanism Bridge 把诊断映射到八轴机制目标与修复层：

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

---

## 0. 在统一理论中的位置

本文属于受治理 LLM 系统系列。

主结构理论把 LLM 系统失败定义为从世界到输出管线中的价值丢失。对象模型规范定义 GKO、审计发现、控制增量、回归护栏和状态记录等受治理对象。审计工程解释失败如何被定位并写回控制空间。SGAR 解释已验证进展如何成为已提交硬状态。各个失配文档则展开每个管线站点。

本文展开的是 **状态站点**。

它应与 SGAR 运行时文档区分阅读，但二者相互连接：

```text
State Mismatch:
  认识论 / 诊断问题。
  我们处于哪个潜在任务状态？

State-Governed Agent Regime:
  运行时权威问题。
  哪些状态转移已经真正提交？
```

状态失配关注 **状态识别**。SGAR 关注 **状态提交**。系统可能识别了正确潜在状态，却没有正确提交它；那是 SGAR 失败。系统也可能维护完美的硬状态日志，却在错误的潜在状态假设下行动；那是状态失配。

本文的治理原则是：

> 当一个行动的价值会在多个可行潜在状态之间反转时，不要静默塌缩状态。应表示、判别、分支或获取信息。

---

## 1. 问题：把状态当成已知来行动

许多 LLM 系统表现得好像当前任务状态显而易见。它们推断一个用户意图、一个数据库解释、一个代码失败原因、一个文档状态、一个计划阶段、一个市场区间或一个评价标准，然后据此生成。

这常常很高效。在低风险任务中，最可能的状态也许足够好。在许多对话语境里，用户也期待助手推断意图，而不是反复提问。然而，在高价值任务中，隐藏状态可能决定整套行动策略。

用户问：

```text
"Find the customers with the highest activity."
```

状态可能是：

```text
activity = number of orders
activity = total revenue
activity = number of logins
activity = recent activity in last 30 days
activity = business-defined engagement score
```

在某一个状态下生成的 SQL 查询，可能语法有效、局部合理，但语义错误。

开发者问：

```text
"Fix this failing test."
```

状态可能是：

```text
test is outdated
implementation regressed
dependency version changed
fixture is invalid
environment has nondeterminism
assertion encodes wrong behavior
```

正确行动会随状态改变。如果测试已经过时，修改实现可能是错的。如果实现回归，更新测试也可能是错的。

研究用户问：

```text
"Is this argument strong?"
```

状态可能是：

```text
argument is being evaluated for academic publication
argument is being evaluated for investor persuasion
argument is being evaluated for internal research planning
argument is being evaluated for adversarial peer review
argument is being evaluated for conceptual coherence only
```

合适的批评取决于潜在评价状态。

当系统在可用表征并不支持某个状态承诺时，却像该状态已经确定一样选择行动，就会出现状态失配。

---

## 2. 形式化定义

令：

```text
S_world
```

表示底层世界或任务情境。

令：

```text
O = φ(S_world)
Z = ψ(O)
```

表示 LLM 系统可用的观测数据与操作表征。

令：

```text
H = {h1, h2, ..., hn}
```

表示与行动选择或评价相关的潜在任务状态集合。

令系统隐式或显式维护一个状态信念：

```text
b(h | Z)
```

令候选行动、输出、计划或产物为：

```text
a ∈ A
```

真实效用按状态条件化：

```text
U(a | h, S_world)
```

当三个条件同时成立时，发生状态失配。

### 条件 1：状态不确定性

表征无法识别单一相关状态：

```text
H_plausible(Z) = {h : b(h | Z) > ε}
```

其中包含不止一个可行状态。

### 条件 2：策略敏感性

候选行动的价值排序在可行状态之间不同：

```text
∃ h_i, h_j ∈ H_plausible(Z), ∃ a_m, a_n ∈ A
such that

U(a_m | h_i) > U(a_n | h_i)
but
U(a_m | h_j) < U(a_n | h_j)
```

### 条件 3：过早或错误塌缩

系统选择、路由、评价或提交时，表现得像单一状态已经已知：

```text
π(a | Z) ≈ π(a | Z, h_hat)
```

其中 `h_hat` 缺乏支持、理由不足、已经陈旧或是错误的。

合起来：

> 当多个潜在状态在系统表征下仍然可行，候选行动具有状态依赖的价值排序，而系统没有保存、判别或分支处理这种不确定性时，就存在状态失配。

紧凑定义：

```text
State mismatch = unresolved state uncertainty × state-sensitive policy × premature state collapse.
```

---

## 3. 为什么状态失配是原始失配

状态失配是原始的，因为它有独立的结构位置和独立的修复目标。

它发生在系统已经拥有操作表征 `Z` 之后，但发生在系统能够正确路由能力、搜索候选、组合输出或评价成功之前。系统不仅要知道哪些信息可用，还必须知道这些信息指向什么情境。

状态站点可以写成：

```text
Z → B(H) → state-conditioned policy
```

其中 `B(H)` 是信念状态、假设集合、状态标签或分支结构。

如果这个站点失败，下游操作可能局部连贯，却不适用于真实状态。一个完全流畅的答案可能错在它回答了错误的隐藏问题。一个执行良好的工具动作可能错在它假设了错误的任务阶段。一个强验证器也可能错在它检查了错误的状态条件化标准。

状态失配不能还原为其他任何原始失配。

### 3.1 不是观测-表征失配

观测-表征失配关注决定性变量是否进入 `Z`。

状态失配关注可用变量是否识别了活跃状态。

一个简单对比：

```text
Observation-representation mismatch:
  The database schema or sample values needed to infer intent are absent.

State mismatch:
  The schema and sample values are present, but multiple intents remain plausible.
```

第一种情况需要修复通道或表征。第二种情况需要状态判别、分支或信息获取。

### 3.2 不是规格失配

规格失配关注目标代理是否匹配真实效用。

状态失配关注哪个条件或区间决定了目标。

系统可能为每个状态都有正确 rubric，却无法识别哪个 rubric 应用。反过来，它也可能正确识别状态，却使用坏的代理目标。

例子：

```text
State mismatch:
  Is the user asking for a legal-risk memo or a business-risk memo?

Specification mismatch:
  The memo rubric rewards confidence and brevity but the true task requires caveats and jurisdictional scope.
```

### 3.3 不是拟合边界失配

拟合边界失配关注某个已学习能力是否在真实适用域内被激活，或在真实适用域外被激活。

状态失配关注哪个状态应当支配能力选择。

二者经常复合。错误状态假设可能触发错误能力。但修复目标不同：

```text
State repair:
  identify or preserve latent regime.

Router repair:
  correct capability activation conditions.
```

### 3.4 不是支持失配

支持失配关注高价值候选是否可达。

状态失配关注系统是否知道应该偏好哪个候选家族。

正确候选可能可达，却因为系统假设了错误状态而被拒绝。或者系统可能正确识别状态，却无法生成该状态下所需的低支持结构。

### 3.5 不是聚合失配

聚合失配关注局部部分能否组合成全局价值。

状态失配关注系统是否在正确潜在状态假设下组合。

一个计划可能在状态 `h1` 下内部一致，但对状态 `h2` 是错的。它的失败不只是局部到全局组合问题；它是状态条件化误用。

---

## 4. 价值保存管线中的状态站点

统一管线是：

```text
S_world
  → O
  → Z
  → state belief
  → capability routing
  → candidate support
  → aggregation
  → evaluation
```

状态治理在状态站点插入显式表示：

```text
Z
  → State Hypothesis Set
  → State Belief Record
  → Discriminators / Evidence Requirements
  → State-Conditioned Routing
  → State-Conditioned Search
  → State-Conditioned Evaluation
```

当任务对状态敏感时，系统不应从 `Z` 直接走向最终生成。它应先问：

```text
What states are compatible with Z?
Would the correct answer differ across those states?
What evidence distinguishes them?
Can the system acquire that evidence?
If not, should it branch, ask, defer, or produce a conditional answer?
```

这把隐藏状态从隐含假设转化为受治理对象。

---

## 5. 状态失配分类

状态失配有几种反复出现的形式。

### 5.1 隐藏区间失配

任务属于多个区间之一，但表面观测无法识别是哪一个。

例子：

```text
market regime: trending / mean-reverting / liquidity shock / event-driven
debugging regime: implementation bug / test bug / environment bug / dependency drift
research regime: exploratory / confirmatory / adversarial / synthesis
database regime: business metric / raw count / recent activity / lifetime aggregate
```

失败特征：

```text
The system applies a policy appropriate for one regime while evidence supports multiple regimes.
```

修复：

```text
regime hypothesis enumeration
regime discriminator
state-conditioned policy selection
uncertainty-preserving response
```

### 5.2 意图状态失配

用户想要的任务状态不同于系统推断出的意图。

当用户语言欠规格、但行动后果差异很大时，这很常见。

例子：

```text
"make it better"
"clean this up"
"analyze the risk"
"give me the best option"
"optimize this query"
"rank these candidates"
```

失败特征：

```text
The output is useful under one plausible intent but not under the user's actual intent.
```

修复：

```text
intent-state matrix
clarifying question if high value at stake
conditional output
explicit assumption header
task-intent GKO
```

### 5.3 时间状态失配

系统使用了陈旧、未来或顺序错误的状态。

例子：

```text
a project task was already completed but the model treats it as pending
a dependency was updated but the model assumes the old API
a database snapshot differs from the assumed snapshot
a conversation decision was superseded
an external process advanced since the last observation
```

失败特征：

```text
The system's action is coherent relative to an old state but invalid relative to the current state.
```

修复：

```text
state freshness check
timestamped state records
staleness guards
re-observation before action
SGAR transition logs
```

### 5.4 阶段状态失配

系统误识别了多步骤任务的当前阶段。

例子：

```text
brainstorming vs final drafting
diagnosis vs repair
search vs selection
planning vs execution
implementation vs verification
pre-commit review vs post-deploy monitoring
```

失败特征：

```text
The system performs an action appropriate for a different phase.
```

修复：

```text
phase state record
phase transition contract
allowed action set by phase
phase-specific verifier
```

### 5.5 环境状态失配

系统误识别了行动将运行的外部环境。

例子：

```text
operating system
library version
database dialect
permissions
resource limits
available tools
deployment target
runtime configuration
```

失败特征：

```text
The solution is correct in one environment but fails in the actual environment.
```

修复：

```text
environment probing
tool availability checks
version capture
configuration GKO
environment-conditioned rendering
```

### 5.6 数据状态失配

系统基于一个假定的数据分布、快照或内容状态推理，而它不同于真实数据状态。

例子：

```text
empty vs populated table
skewed vs uniform values
missing values present
outliers dominate
entity names normalized differently
foreign-key constraints incomplete
label distribution changed
```

失败特征：

```text
The artifact is logically plausible but fails against actual data contents.
```

修复：

```text
data profiling
sample-value retrieval
distribution summaries
execution feedback
value-linking state objects
```

### 5.7 依赖状态失配

系统漏掉了当前哪个依赖、前置条件或上游条件成立。

例子：

```text
feature A depends on migration B
analysis conclusion depends on assumption C
query predicate depends on join path D
project task depends on approval E
model output depends on retrieved source F
```

失败特征：

```text
The system treats a dependent step as valid before its prerequisite state is true.
```

修复：

```text
dependency graph
precondition checks
state-gated execution
invariant guards
```

### 5.8 社会或角色状态失配

系统误识别社会角色、权限、受众或协作状态。

例子：

```text
drafting for internal notes vs public publication
assistant as critic vs coauthor vs implementer
user wants recommendation vs neutral analysis
user has authority to approve vs only requesting exploration
```

失败特征：

```text
The response has the wrong stance, level of commitment, or authority boundary.
```

修复：

```text
role-state declaration
audience-state GKO
collaboration contract
authority check
```

### 5.9 验证器状态失配

系统误识别了验证应发生在哪种状态下，因此应用了错误验证器。

例子：

```text
checking syntax when semantic equivalence matters
checking unit tests when integration tests matter
checking exact match when execution equivalence matters
checking factual citations when argumentative validity matters
```

失败特征：

```text
The artifact passes a verifier that is valid only under a different state.
```

修复：

```text
verifier applicability conditions
state-conditioned verifier selection
verifier router audit
```

---

## 6. 诊断特征

状态失配经常留下可识别痕迹。

### 6.1 合理但框架错误的输出

输出本身并非低质量。它在某个未说明假设下是好的。失败在于该假设错误或缺乏支持。

诊断问题：

```text
Under what state would this output be correct?
Is that state established?
```

### 6.2 突然的策略承诺

系统从含糊输入直接走向强行动，没有表示替代状态。

诊断问题：

```text
Did the system enumerate plausible state hypotheses before acting?
```

### 6.3 用户纠正暴露隐藏状态

用户回应：

```text
"That is not what I meant."
"Actually, this is for..."
"We already did that."
"The data is different."
"That assumption is wrong."
```

这类纠正常常暴露状态失配。

诊断问题：

```text
Which latent state did the user correction introduce or invalidate?
```

### 6.4 工具输出反驳假定状态

模型假设某张表存在、某个文件已改变、某条命令成功，或某个测试因某种原因失败，但工具输出与之矛盾。

诊断问题：

```text
Was the assumed environment or data state checked before action?
```

### 6.5 局部证据冲突

`Z` 的不同部分支持不同状态，但模型选择其中一个而不承认冲突。

诊断问题：

```text
What evidence supports each state hypothesis?
```

### 6.6 推理模式正确，区间错误

推理风格是有能力的，但被用于错误区间。

诊断问题：

```text
Is the capability wrong, or is the state that triggered it wrong?
```

### 6.7 上下文摘要后的回归

系统原本知道状态，但在压缩、摘要、记忆检索或会话交接后丢失了它。

诊断问题：

```text
Was state preserved as a hard object or only as narrative context?
```

---

## 7. 状态治理

状态治理是一组方法，用于表示、判别、更新、分支处理和提交状态信息。

它有七个核心操作：

```text
1. State hypothesis enumeration
2. State evidence binding
3. State discriminator construction
4. State belief maintenance
5. State-conditioned policy selection
6. State transition verification
7. State revocation and staleness management
```

### 7.1 状态假设枚举

系统在承诺某个策略之前，列出可行潜在状态。

最小状态假设条目包括：

```text
state label
description
supporting evidence
contradicting evidence
action implications
required discriminator
risk of acting under this state
```

目标不是枚举每个可能状态。目标是枚举会改变行动价值的状态。

有用规则：

```text
Only branch over states that are action-relevant.
```

### 7.2 状态证据绑定

每个状态假设都应绑定到证据。证据可能来自：

```text
user text
retrieved documents
tool output
database contents
execution traces
timestamps
prior committed state
external measurements
human confirmation
```

证据不能只是叙事性的。在受治理系统中，状态信念的来源应可检查。

### 7.3 状态判别器构造

判别器是一个测试、问题、查询、工具调用或推理检查，用于区分多个可行状态。

例子：

```text
Ask user: "Do you mean lifetime revenue or number of orders?"
Query database: "What values appear in this column?"
Run test: "Does the failure reproduce in a clean environment?"
Inspect log: "Did the task already complete?"
Check config: "Which database dialect is active?"
```

好判别器相对于成本有较高的预期状态分辨率。

### 7.4 状态信念维护

当不确定性仍然存在时，系统应把状态维护为信念分布或排序后的假设集合。

状态信念可以是：

```text
resolved
unresolved
ambiguous
stale
contradicted
branched
superseded
```

状态治理应避免假装未解决状态已经解决。

### 7.5 状态条件化策略选择

能力、搜索方法、验证器和输出形式都应依赖状态。

例子：

```text
If state = implementation regression:
  inspect code diff, propose patch, run tests.

If state = obsolete test:
  inspect requirements, propose test update, flag semantic risk.

If state = ambiguous:
  ask clarification or produce conditional branches.
```

### 7.6 状态转移验证

状态更新在提交前应被验证，尤其是在长程系统中。

例子：

```text
Claim:
  "The migration has been applied."

Required observation:
  migration log shows success
  schema now contains expected column
  tests pass against new schema

Only then:
  commit state transition migration.applied = true
```

这里正是状态治理与 SGAR 相遇的地方。

### 7.7 状态撤销与陈旧管理

状态可能变得陈旧或无效。状态对象应有撤销触发器：

```text
new tool output contradicts it
timestamp exceeds freshness window
user supersedes prior intent
environment changes
dependency changes
audit finding invalidates assumption
```

状态治理不仅是识别状态，也是维护变化中的状态。

---

## 8. 核心状态治理对象

状态失配应通过显式对象修复，而不只是通过 prompt prose 修复。

### 8.1 状态假设对象

**状态假设对象** 表示一个可能影响行动价值的潜在状态。

```json
{
  "id": "state_hypothesis.unique_identifier",
  "type": "state_hypothesis",
  "label": "short state name",
  "description": "what this state means",
  "condition": "when this state applies",
  "supporting_evidence": [
    "evidence item 1",
    "evidence item 2"
  ],
  "contradicting_evidence": [
    "evidence item 1"
  ],
  "action_implications": [
    "what actions become appropriate if this state holds"
  ],
  "risk_if_wrong": "what goes wrong if the system acts under this state incorrectly",
  "discriminator": "question, query, test, or tool call that can distinguish this state",
  "status": "candidate | active | rejected | unresolved | superseded",
  "confidence": "low | medium | high",
  "revocation_trigger": "condition under which this state should be weakened or removed"
}
```

### 8.2 状态信念记录

**状态信念记录** 保存系统对一个状态族的当前信念。

```json
{
  "id": "state_belief.unique_identifier",
  "type": "state_belief_record",
  "state_family": "intent | environment | phase | data | dependency | verifier | regime",
  "hypotheses": [
    {
      "state_id": "state_hypothesis.id",
      "belief": "low | medium | high | numeric optional"
    }
  ],
  "resolved_state": "state_hypothesis.id or null",
  "resolution_status": "resolved | unresolved | ambiguous | stale | contradicted | branched",
  "evidence_summary": "why the belief record has this status",
  "next_discriminator": "recommended next observation if unresolved",
  "last_updated": "timestamp or transition id",
  "freshness_policy": "when this belief must be rechecked"
}
```

### 8.3 状态判别器

**状态判别器** 是可以减少状态不确定性的操作。

```json
{
  "id": "state_discriminator.unique_identifier",
  "type": "state_discriminator",
  "target_state_family": "which state family it discriminates",
  "operation": "ask_user | query_database | run_test | inspect_file | retrieve_log | tool_call | reasoning_check",
  "input": "what the discriminator needs",
  "expected_observations": [
    {
      "observation": "possible result",
      "state_update": "how the result changes belief"
    }
  ],
  "cost": "low | medium | high",
  "risk": "low | medium | high",
  "authority": "human | tool | verifier | model | mixed",
  "commitment_rule": "when the discriminator result is strong enough to update state"
}
```

### 8.4 状态条件化策略

**状态条件化策略** 把状态映射到行动、工具、能力、评价器或输出形式。

```json
{
  "id": "state_policy.unique_identifier",
  "type": "state_conditioned_policy",
  "state_family": "intent | environment | phase | data | dependency | verifier | regime",
  "policy_map": [
    {
      "state": "state_hypothesis.id",
      "capability_routing": ["capability or role to activate"],
      "search_strategy": "candidate generation or control-space search method",
      "verifier": "state-appropriate verifier",
      "output_form": "direct answer | conditional branches | ask clarification | defer | tool-first"
    }
  ],
  "default_policy": "what to do when state remains unresolved",
  "risk_control": "how to avoid high-cost wrong-state action"
}
```

### 8.5 状态转移护栏

**状态转移护栏** 定义状态能够被提交之前需要什么证据。

```json
{
  "id": "state_transition_guard.unique_identifier",
  "type": "state_transition_guard",
  "from_state": "state before transition",
  "to_state": "state after transition",
  "proposed_action": "action that would cause transition",
  "required_observation": "what must be observed",
  "verifier": "who or what validates the observation",
  "commit_rule": "condition for committing S'",
  "rollback_rule": "condition for reverting or marking transition invalid"
}
```

---

## 9. 诊断工作流

状态失配的实用诊断流程：

```text
1. Identify the candidate action or output.
2. Ask: under what latent state would this be correct?
3. Enumerate plausible alternative states.
4. Check whether action ranking changes across states.
5. Identify evidence currently supporting each state.
6. Identify evidence that would discriminate states.
7. Acquire evidence if cost-justified.
8. If unresolved, branch or produce conditional output.
9. Route capabilities and verifiers by state.
10. Commit state only through a transition guard.
11. Store state findings, control deltas, and regression guards.
```

### 机制层映射

状态失配是一个原始的价值保存诊断，但它的机制画像可能涉及多个修复目标：

| 机制目标 | 在状态失配中的角色 |
|---|---|
| `observation_availability` | 因为缺少所需证据，系统无法区分状态 |
| `belief_representation` | 证据存在，但没有被维护为状态 |
| `dynamics_world_model` | 系统错误预测了行动如何改变状态 |
| `search_execution` | 系统没有对状态假设进行分支、测试或判别 |

状态失配不应被自动修成“再多推理一点”。真正的修法取决于机制定位：

```text
missing evidence:
  repair observation_availability.

unstructured or forgotten evidence:
  repair belief_representation.

wrong prediction of state transitions:
  repair dynamics_world_model.

failure to branch or test hypotheses:
  repair search_execution.
```

### 9.1 状态敏感性测试

最重要的测试是：

```text
Would the recommended action differ if a plausible alternative state were true?
```

如果不会，状态不确定性也许无关紧要。

如果会，系统不应静默塌缩状态。

### 9.2 证据充分性测试

问：

```text
What evidence licenses the current state assumption?
```

如果答案只是“模型从上下文推断出来”，该状态可能治理不足。

### 9.3 判别器可用性测试

问：

```text
Is there a low-cost observation that would distinguish the states?
```

如果有，在高风险行动前先获取。

如果没有，分支或显式条件化答案。

### 9.4 提交测试

问：

```text
Has the state been committed by an authorized verifier or merely narrated by the model?
```

这把状态治理连接到 SGAR。

---

## 10. 面向状态失配的审计工程

状态失配的审计发现不仅应指出输出错误，还应识别哪个状态假设导致了错误行动。

### 10.1 状态失配审计发现

```json
{
  "id": "finding.state_mismatch.unique_identifier",
  "artifact": "output, plan, query, patch, action, or decision being audited",
  "finding": "The artifact assumes state h1, but h1 is unsupported, stale, contradicted, or not uniquely identified.",
  "evidence": [
    "specific evidence showing ambiguity or contradiction"
  ],
  "mismatch_type": "state",
  "state_family": "intent | phase | environment | data | dependency | verifier | regime",
  "assumed_state": "state implicitly or explicitly used by the system",
  "plausible_alternative_states": [
    "state h2",
    "state h3"
  ],
  "policy_sensitivity": "how the correct action changes across states",
  "severity": "low | medium | high | critical",
  "repair_target": "state hypothesis | state discriminator | state-conditioned policy | transition guard | state record",
  "control_delta": "specific update to state governance objects",
  "regression_guard": "test that fails if the system again collapses this state ambiguity",
  "confidence": "low | medium | high"
}
```

### 10.2 状态控制增量

常见控制增量包括：

```text
add_state_hypothesis
reject_state_hypothesis
mark_state_unresolved
add_state_discriminator
add_state_conditioned_policy
add_state_transition_guard
update_phase_state
invalidate_stale_state
require_reobservation
add_clarification_rule
branch_output_by_state
route_verifier_by_state
```

### 10.3 状态回归护栏

状态失配的回归护栏应检测过早状态塌缩是否复发。

例子：

```text
Ambiguous intent guard:
  If input contains metric term with multiple domain meanings,
  system must either disambiguate, use domain-defined metric, or state assumption.

Stale state guard:
  If last observation exceeds freshness window before irreversible action,
  system must re-observe.

Phase guard:
  If task phase = diagnosis,
  system must not execute repair action before defect class is identified.

Environment guard:
  If solution depends on database dialect,
  system must identify dialect before rendering dialect-specific syntax.

Verifier guard:
  If verifier applicability depends on state,
  system must select verifier after state classification.
```

只有当重新引入代表性状态歧义会导致护栏失败时，护栏才真正有牙齿。

---

## 11. 面向状态的知识治理

当状态对象充当可复用任务控制知识时，它们可以成为 GKO。

### 11.1 状态 GKO 模板

```json
{
  "id": "gko.state.unique_identifier",
  "type": "state_hypothesis | state_rule | state_discriminator | state_conditioned_policy",
  "condition": "when this state object applies",
  "assertion": "what state assumption, distinction, or policy mapping it asserts",
  "strength": "hard | soft | heuristic | provisional",
  "priority": "conflict-resolution priority",
  "evidence": "observations, tool outputs, prior decisions, user confirmations, or audits",
  "source": "where this state object came from",
  "lifespan": "single-turn | session | project | persistent",
  "freshness_policy": "when it must be rechecked",
  "revocation_trigger": "what invalidates it",
  "not_supported_claims": "what this state object does not license"
}
```

### 11.2 状态 GKO 示例

#### 指标含义状态

```json
{
  "id": "gko.state.metric_activity_meaning",
  "type": "state_rule",
  "condition": "When a user asks for 'most active customers' in the sales database context",
  "assertion": "Do not assume activity means order count; candidate meanings include order count, revenue, recent orders, login count, and domain engagement score.",
  "strength": "soft",
  "evidence": "Prior audit found wrong SQL caused by assuming activity = order count.",
  "lifespan": "project",
  "revocation_trigger": "Domain owner defines activity metric explicitly.",
  "not_supported_claims": "Does not determine the metric without database or user evidence."
}
```

#### 阶段状态

```json
{
  "id": "gko.state.phase_diagnosis_before_patch",
  "type": "state_conditioned_policy",
  "condition": "When a test failure has not yet been classified",
  "assertion": "Remain in diagnosis phase; do not commit implementation patch until failure class is identified.",
  "strength": "hard",
  "evidence": "Patch-first behavior caused prior regression when test fixture was invalid.",
  "lifespan": "project",
  "revocation_trigger": "User explicitly requests speculative patch or verifier confirms implementation regression.",
  "not_supported_claims": "Does not prohibit proposing hypotheses or low-risk inspection."
}
```

#### 环境状态

```json
{
  "id": "gko.state.database_dialect_required",
  "type": "state_discriminator",
  "condition": "When rendering SQL with dialect-specific syntax",
  "assertion": "Identify database dialect before using functions, date arithmetic, quoting, or limit syntax.",
  "strength": "hard",
  "evidence": "Dialect mismatch caused invalid query in prior execution audit.",
  "lifespan": "persistent",
  "revocation_trigger": "System configuration fixes dialect for the entire deployment.",
  "not_supported_claims": "Does not guarantee semantic correctness of query."
}
```

---

## 12. 与 SGAR 集成

状态失配和 SGAR 关系紧密，但并不相同。

状态失配问的是哪个潜在任务状态为真。SGAR 问的是哪个状态转移已经被正式提交。前者是对不确定性或误识别的诊断；后者是一种运行时权威体制。

### 12.1 信念状态与已提交状态

状态治理维护 **信念状态**：

```text
What does the system currently believe about the latent task state?
```

SGAR 维护 **已提交硬状态**：

```text
What facts, actions, transitions, and completions are authoritative?
```

信念可以是暂定的。已提交状态必须满足转移契约。

例子：

```text
Belief:
  The test failure is probably caused by dependency drift.

Committed state:
  dependency_drift_confirmed = true
```

第二者应要求证据。

### 12.2 状态转移契约

对于状态提交：

```text
S + A → O → V → S'
```

例子：

```text
S:
  phase = diagnosis
  failure_cause = unresolved

A:
  run dependency version check

O:
  lockfile shows package upgraded from v1 to v2;
  failure disappears when pinned to v1

V:
  tool output and reproducing test confirm causal dependency

S':
  failure_cause = dependency_drift
  phase = repair_planning
```

LLM 可以提出 `S'`，但只有当 `V` 接受 `O` 时，该转移才被提交。

### 12.3 防止叙事性状态漂移

没有 SGAR，状态可能通过对话漂移：

```text
"Assuming the migration worked..."
"Now that the issue is fixed..."
"Since we established the user wants X..."
```

每句话都可能静默地把一个假设提升为事实。SGAR 要求状态转移引用证据和验证器，从而防止这种漂移。

### 12.4 状态摘要不是状态权威

上下文摘要可能包含：

```text
"The user wants revenue-based activity."
```

但除非该声明连接到已提交状态记录或用户确认，否则它可能只是叙事。

规则：

```text
A state claim in context is not authoritative unless it resolves to a state record with evidence and status.
```

---

## 13. Text-to-SQL 中的状态失配

Text-to-SQL 是状态失配的强例子，因为同一个自然语言问题会根据潜在状态映射到不同 SQL。

### 13.1 意图状态

问题：

```text
"Which products are most popular?"
```

可能状态：

```text
popularity = number of orders
popularity = total quantity sold
popularity = revenue
popularity = number of distinct customers
popularity = recent trend
popularity = rating / review count
```

直接 SQL 生成经常静默塌缩这个状态。

状态治理响应：

```text
1. Enumerate metric states.
2. Check schema for domain-defined popularity column.
3. Inspect sample values or metadata.
4. If benchmark context implies one metric, record that assumption.
5. If unresolved, branch or ask clarification.
```

### 13.2 数据状态

问题：

```text
"Find users who have not made any purchases."
```

可能数据状态：

```text
purchase table records all purchases
purchase status column distinguishes completed vs canceled
user table includes inactive users
foreign keys are complete
null user_id values exist
```

正确 SQL 依赖数据状态假设。如果存在 null，使用 `NOT IN` 的查询可能失败。如果状态未治理，left join 可能包含非活跃账户。

状态治理响应：

```text
profile nulls
inspect status values
check user activity column
select anti-join pattern by data state
```

### 13.3 环境状态

SQL 语法依赖数据库方言。

可能状态：

```text
SQLite
PostgreSQL
MySQL
SQL Server
DuckDB
Oracle
```

在一种方言中有效的日期运算表达式，可能在另一种方言中失败。

状态治理响应：

```text
dialect must be identified before dialect-specific rendering
```

### 13.4 验证器状态

执行准确率不等于语义正确性。

可能验证器状态：

```text
exact result comparison available
execution-only feedback available
semantic equivalence required
hidden tests unavailable
manual review required
```

修复策略会随验证器状态改变。

---

## 14. 代码与调试中的状态失配

代码任务对状态敏感。

### 14.1 失败原因状态

一个失败测试可能表示：

```text
implementation bug
test bug
fixture bug
environment bug
dependency drift
nondeterminism
flaky external service
changed requirement
```

先 patch 再说很危险，因为同一条局部 trace 可能支持多个原因。

状态治理响应：

```text
failure-cause hypothesis set
minimal reproduction
environment check
dependency check
requirement check
test validity audit
state-conditioned repair
```

### 14.2 仓库状态

系统可能假设某个文件、函数、API 或测试以某种形式存在。但仓库状态可能不同。

状态治理响应：

```text
read before edit
check current file contents
confirm branch / commit state
track modifications as hard-state transitions
```

### 14.3 阶段状态

调试工作流有多个阶段：

```text
observe failure
classify failure
localize cause
propose patch
apply patch
run verifier
commit fix
write regression guard
```

如果模型从观察失败直接跳到 patch，而没有分类，它就有状态失配风险。

---

## 15. 研究、策略与咨询工作中的状态失配

开放式咨询任务经常包含隐藏评价状态。

### 15.1 评价状态

用户可能问：

```text
"Is this good?"
```

但“好”可能意味着：

```text
conceptually original
empirically credible
publishable
investor-persuasive
implementation-ready
defensible under peer review
useful for internal decision-making
```

批评必须按状态条件化。

状态治理响应：

```text
evaluation-state matrix
audience-state identification
explicit assumption
branch by evaluation state
```

### 15.2 决策状态

用户可能处于：

```text
exploring options
seeking a recommendation
trying to justify a prior decision
looking for risks
preparing for an adversarial review
needing an execution plan
```

同一个回应在一种状态下有帮助，在另一种状态下可能有害。

状态治理响应：

```text
decision-state hypothesis
recommendation vs analysis distinction
commitment-level control
```

### 15.3 证据状态

论证可能在不同证据标准下被评价：

```text
intuitive plausibility
formal proof
engineering evidence
benchmark evidence
case-study evidence
expert consensus
regulatory-grade evidence
```

证据状态失配会产生错误置信度和错误批评。

---

## 16. 与其他失配的复合交互

状态失配经常与其他原始失配复合。

### 16.1 状态 × 观测-表征

如果区分状态所需变量从未进入 `Z`，则没有通道修复就无法做状态修复。

例子：

```text
The system must distinguish active users from inactive users,
but the active flag or last-login column is not included.
```

修复耦合：

```text
R_state is gated by c_obs
```

### 16.2 状态 × 拟合边界

错误状态信念会触发错误能力。

例子：

```text
The system treats a task as final drafting when it is actually adversarial review,
so it activates polishing instead of critique.
```

修复耦合：

```text
R_route depends on state discrimination.
```

### 16.3 状态 × 支持

在错误状态下，正确候选家族可能得到低支持。

例子：

```text
If the system assumes "popular" means count,
revenue-based query structures are not searched.
```

修复耦合：

```text
R_support depends on preserving alternative state-conditioned candidate spaces.
```

### 16.4 状态 × 聚合

局部组件可能在一种状态下正确组合，在另一种状态下错误组合。

例子：

```text
A plan is coherent for exploration phase but incoherent for execution phase.
```

修复耦合：

```text
R_agg must enforce state-specific composition rules.
```

### 16.5 状态 × 规格

正确目标可能按状态条件化。

例子：

```text
A legal memo and a business memo have different success criteria.
```

修复耦合：

```text
R_spec depends on identifying the evaluation state.
```

### 16.6 状态 × SGAR

状态假设可能被叙述得像已提交事实。

例子：

```text
The model says "now that the bug is fixed" before tests pass.
```

修复耦合：

```text
epistemic state must not become hard state without transition verification.
```

---

## 17. 状态治理型渲染

当状态仍未解决时，最终输出应反映这一点。

可用渲染模式：

```text
direct answer
assumption-labeled answer
conditional answer
branched answer
clarifying question
tool-first response
deferred recommendation
risk-bounded action
```

### 17.1 标注假设的答案

当某个状态很可能成立但并不确定时使用。

```text
Assuming "activity" means number of completed orders, the query is...
If instead you mean revenue or recent engagement, the query changes.
```

### 17.2 分支答案

当多个状态都可行且行动差异显著时使用。

```text
If the test encodes the intended behavior, patch the implementation as follows.
If the requirement changed, update the test instead.
Here is how to distinguish the two cases.
```

### 17.3 澄清问题

当错误状态行动成本很高、且存在低成本澄清时使用。

```text
Do you want "most active" measured by order count, revenue, or recent activity?
```

### 17.4 工具优先响应

当工具可以低成本解决状态时使用。

```text
Before rendering SQL, inspect the schema and sample values.
Before patching, run the failing test and inspect the traceback.
```

### 17.5 风险有界行动

当必须在不确定性下继续行动时使用。

```text
Proceed with a reversible, low-risk step that is useful across states.
```

---

## 18. 与形式传统的关系

状态失配与几个既有传统相关，但受治理 LLM 场景有自己的特点。

### 18.1 POMDP

部分可观测马尔可夫决策过程建模隐藏状态下的智能体行动。状态失配在概念上相关：系统有观测、潜在状态、信念更新和状态条件化策略。

不同之处在于，LLM 系统经常运行于开放任务空间，其中：

```text
state space is not predefined
observations are natural language, tool outputs, documents, and context summaries
state hypotheses may be induced at inference time
utility may be tacit or evolving
state beliefs may be stored as governed objects
human clarification may be part of the policy
```

### 18.2 主动感知与信息价值

状态治理使用主动信息获取：当解决状态的预期价值超过成本时，提问、查询、检查、测量或运行测试。

一个简单决策规则：

```text
Acquire state information if:

Expected reduction in wrong-state action loss
  >
cost of discriminator + delay + risk
```

### 18.3 信念修订

状态假设应随证据变化被修订、削弱或撤销。这与信念修订和真值维护系统相关，但在 LLM 系统中，这些信念是任务控制对象，而不仅是命题。

### 18.4 运行时状态机

SGAR 和状态转移护栏类似状态机和事务日志。这里的独特问题是，状态信念经常通过语言推断出来，并且必须连接到硬状态权威。

---

## 19. 什么时候不需要状态治理

状态治理有成本。它可能制造不必要分支、过度澄清并拖慢交互。

通常在以下情况不需要：

```text
the task is low stakes
state ambiguity does not change action ranking
the user expects a quick default
the cost of clarification exceeds the likely benefit
a robust default action is good across states
the state is already committed by trusted hard state
```

在以下情况值得使用：

```text
wrong-state action is costly
multiple states are plausible
the optimal action reverses across states
a cheap discriminator exists
state will be reused across future steps
state uncertainty compounds with other mismatches
the system is about to commit irreversible action
```

实用规则：

```text
Do not ask about every uncertainty.
Ask, branch, or inspect only when state uncertainty is action-relevant.
```

---

## 20. 状态失配主张的自审计

理论应治理自己的主张。

### 20.1 作为 GKO 的状态失配

```json
{
  "id": "gko.primitive_mismatch.state",
  "type": "primitive_mismatch_claim",
  "condition": "LLM systems modeled as value-preservation pipelines in which action value may depend on latent task state",
  "assertion": "State mismatch occurs when multiple latent states remain plausible under the representation, action value differs across those states, and the system prematurely collapses or mismanages the state.",
  "strength": "structural-relative",
  "support_scope": "Tasks where hidden regimes, user intent, environment conditions, data states, phase states, dependency states, or verifier states affect policy or evaluation",
  "revocation_trigger": "Show that state-sensitive failures can always be reduced to observation-representation, fitting-boundary, support, aggregation, or specification mismatch without losing intervention specificity.",
  "not_supported_claims": "Does not claim that all uncertainty is state mismatch; does not require exhaustive state enumeration; does not claim that systems should always ask clarifying questions."
}
```

### 20.2 边界条件

在以下情况下，应下调状态失配诊断：

```text
state uncertainty exists but does not affect action value
the problem is actually missing variables rather than latent-state ambiguity
the problem is a bad objective rather than wrong state identification
the system has a complete verifier that makes state irrelevant
the user explicitly wants a default assumption and low-cost action
```

### 20.3 特定状态对象的撤销触发器

每个状态对象都应可撤销。

例子：

```json
{
  "state_object": "activity_means_order_count",
  "revocation_trigger": "User defines activity as revenue, schema contains domain metric named engagement_score, or audit finds mismatch between query result and intended metric."
}
```

---

## 21. 状态失配检查清单

在高风险生成、工具动作或状态提交前使用这份清单。

```text
1. What latent state is the system assuming?
2. Is that state explicitly represented?
3. What evidence supports it?
4. What plausible alternative states remain?
5. Would the correct action differ under those alternatives?
6. Is there a cheap discriminator?
7. Should the system ask, inspect, query, test, or branch?
8. Which capabilities should activate under each state?
9. Which verifier applies under each state?
10. Is the state fresh?
11. Has the state been committed through SGAR or only narrated?
12. What revocation trigger should be attached?
```

---

## 22. 结论

状态失配是 LLM 系统中的一种原始价值保存失败。它发生在系统基于缺乏支持、已经陈旧、被塌缩或错误的潜在状态假设行动，并且候选行动价值在多个可行状态之间不同时。

这种失败很常见，因为 LLM 很擅长从欠规格上下文中生成连贯续写。连贯性会隐藏状态不确定性。模型可能推断一个可行状态并流畅推进，但任务真正需要的是保存多个假设、获取判别证据，或在未解决状态上条件化行动。

状态治理通过让潜在状态显式化来修复这种失败。它引入状态假设、证据记录、判别器、状态条件化策略、转移护栏、新鲜度策略和撤销触发器。它与知识治理集成，把可复用状态控制对象保存下来；与审计工程集成，把错误状态失败转换为控制增量和回归护栏；与 SGAR 集成，确保状态提交需要已验证转移，而不是叙事性自信。

中心规则很简单：

> 当行动价值依赖哪个状态为真时，状态必须在行动提交前被治理。

---

## Appendix A: 最小对照例

### A.1 观测-表征 vs 状态

```text
Case 1:
  The schema omits the revenue column.
  Failure: observation-representation mismatch.

Case 2:
  The schema includes revenue and order count,
  but the phrase "most active" is ambiguous between them.
  Failure: state mismatch.
```

### A.2 状态 vs 规格

```text
Case 1:
  The system does not know whether the memo is for legal or business review.
  Failure: state mismatch.

Case 2:
  The system knows it is for legal review,
  but the rubric rewards brevity over legal caveats.
  Failure: specification mismatch.
```

### A.3 状态 vs 拟合边界

```text
Case 1:
  The system misidentifies the task as polishing rather than adversarial review.
  Failure: state mismatch.

Case 2:
  The system knows it is adversarial review,
  but still activates polishing behavior.
  Failure: fitting-boundary mismatch.
```

### A.4 状态 vs 支持

```text
Case 1:
  The system does not know whether a nested query is needed because it misreads the question state.
  Failure: state mismatch.

Case 2:
  The system knows a nested query is needed but never generates one.
  Failure: support mismatch.
```

### A.5 状态 vs 聚合

```text
Case 1:
  The plan is for the wrong project phase.
  Failure: state mismatch.

Case 2:
  The plan is for the right phase, but the steps conflict.
  Failure: aggregation mismatch.
```

---

## Appendix B: 状态治理对象目录

```text
State Hypothesis Object
  Represents one plausible latent state.

State Belief Record
  Represents current belief over a state family.

State Discriminator
  Represents an operation that can distinguish states.

State-Conditioned Policy
  Maps states to routing, search, verifier, and output strategy.

State Transition Guard
  Defines conditions for committing a state transition.

State Freshness Policy
  Defines when a state must be rechecked.

State Revocation Rule
  Defines when a state object should be weakened or removed.

State Regression Guard
  Detects recurrence of premature state collapse.

State Ledger Entry
  Records state changes, evidence, verifier, and transition id.
```

---

## Appendix C: 状态控制增量类型

```text
add_state_hypothesis
remove_state_hypothesis
mark_state_unresolved
mark_state_resolved
mark_state_stale
mark_state_contradicted
add_state_discriminator
update_state_belief
add_state_conditioned_policy
update_capability_routing_by_state
update_verifier_by_state
require_clarification
require_tool_observation
branch_output
add_state_transition_guard
commit_state_transition
rollback_state_transition
add_state_regression_guard
```

---

## Appendix D: 紧凑定义

```text
State mismatch occurs when:

1. Multiple latent task states remain plausible under the system representation;
2. candidate actions have different value rankings across those states; and
3. the system prematurely collapses, ignores, misupdates, or miscommits the state.

Repair requires:

state hypotheses
state evidence
state discriminators
state-conditioned policies
state freshness
state revocation
hard-state commitment when appropriate
```
