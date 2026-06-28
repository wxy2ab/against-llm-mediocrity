# 面向受治理 LLM 系统的状态治理型 Agent 体制

**硬状态权威、转移契约与运行时治理**  
**工作稿 v0.1**  
**王昕云，梁树良**

---

## 摘要

大型语言模型（LLM）agent 常被描述为能够随时间规划、记忆、行动、观测、修订和完成任务的系统。实践中，许多这类系统依赖语言模型上下文窗口作为进展的表面载体。上下文会说某个文件已修改、某个测试已运行、某个 bug 已修复、某个用户偏好已记住、某个任务已完成，或某个计划步骤已执行。但语言上下文可以描述进展，而不授权进展；它可以总结状态，而不是状态；它可以声称完成，而不提交已验证转移。

本文提出 **状态治理型 Agent 体制**（SGAR）：一种面向受治理 LLM 系统的运行时体制，其中进展不是由模型声称发生了什么来定义，而是由外部、可检查、可重放的硬状态中的已提交转移来定义。SGAR 把上下文窗口视为叙事工作区和提案界面，而不是状态权威来源。只有当 agent 行动通过显式转移契约时，才改变系统权威状态：

```text
S + A → O → V → S'
```

其中 `S` 是当前已提交状态，`A` 是拟议行动，`O` 是观测结果，`V` 是验证器或提交规则，`S'` 是下一个已提交状态。

SGAR 不是新的提示模式，也不是第七类原始失配。它是 LLM 系统价值保存统一理论的运行时层。六类原始失配诊断价值在世界到输出管线中的丢失位置。知识治理把控制知识外化为受治理对象。审计工程把失败转化为控制增量和回归护栏。SGAR 决定哪些观测、修复、对象更新、工具效果、记忆写入和任务完成真正进入硬状态。

核心论点很简单：长程 LLM 系统需要模型之外的状态权威。没有硬状态权威，agent 容易出现虚假完成、状态漂移、状态振荡、记忆污染、表演性行动、不可恢复的中间失败和上下文级进展幻觉。有了显式状态记录、转移契约、验证器分层、回滚规则、可重放性和缺陷账本，LLM 系统才能把局部模型能力转化为持久、可审计、可恢复的进展。

### 与 Diagnostic–Mechanism Bridge 的关系

本文使用六类原始失配作为价值保存诊断。当失败进入修复阶段时，应通过 Diagnostic–Mechanism Bridge 把诊断映射到八轴机制目标与修复层：

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

---

## 1. 在统一理论中的位置

受治理 LLM 系统的统一理论有三个主要层级：

```text
Diagnostic level:
  Six primitive mismatches explain where task value is lost.

Control-knowledge level:
  Knowledge Governance stores and revises task-specific control knowledge.

Runtime level:
  SGAR determines which proposed actions, observations, and revisions become committed system state.
```

第一层解释失败。第二层提供受治理控制对象。第三层为这些对象和失败提供运行时权威结构。

关系可以概括为：

```text
Six primitive mismatches diagnose value-preservation failure.
Knowledge Governance stores task-specific control knowledge.
Audit Engineering converts failure into control deltas.
SGAR commits verified progress into hard state.
```

因此，SGAR 回答了普通提示、检索、工具使用或自我反思不能回答的问题：

> 当 LLM 系统说某件事已经改变，是什么让这个改变对系统而言真实？

答案不能是：因为当前上下文这么说。上下文是语言产物。它适合提议、解释、压缩和规划，但不足以作为状态权威。

SGAR 引入显式划分：

```text
Context = narrative workspace.
Hard state = authority surface.
Verifier = admission rule.
Transition contract = state-change protocol.
```

这个划分是长程可靠性的基础。

---

## 2. 运行时问题：上下文不是状态

LLM agent 往往看起来能维护状态，因为上下文窗口包含一段关于已发生事情的连续故事。模型可能写：

```text
I have updated the file.
The test now passes.
The user's preference has been saved.
The issue is resolved.
The plan step is complete.
The system has learned this rule.
```

但这些陈述只是声称，除非它们被外部状态记录或已验证观测支撑。语言模型可以生成连贯的进展叙事，而环境中没有对应变化。

这产生了一类不能充分描述为幻觉的失败。它们是 **状态权威失败**：系统把关于状态的陈述误认为状态本身。

例子：

```text
The model says a file was modified, but the filesystem did not change.
The model says tests passed, but no test command was run.
The model says an error was fixed, but the same defect remains.
The model says a user preference was remembered, but no durable memory was updated.
The model says a plan step is complete, but no verifiable artifact exists.
The model says a GKO was revised, but the authoritative object store still contains the old rule.
```

关键原则是：

```text
A statement of progress is not progress.
A summary of state is not state.
A plan to act is not action.
A claim of verification is not verification.
```

受治理 LLM 系统必须显式维护这些区分。

---

## 3. 状态治理型 Agent 体制

**状态治理型 Agent 体制** 是一种运行时架构，其中 agent 进展由外部状态模型上的已提交转移定义。

最小转移形式是：

```text
S_t + A_t → O_t → V_t → S_{t+1}
```

其中：

| 符号 | 含义 |
|---|---|
| `S_t` | 当前已提交硬状态。 |
| `A_t` | 拟议行动或状态改变操作。 |
| `O_t` | 行动的观测结果。 |
| `V_t` | 验证器、准入标准或提交规则。 |
| `S_{t+1}` | 下一个已提交硬状态。 |

转移只有在以下条件成立时有效：

```text
V_t(S_t, A_t, O_t, S_candidate) = accept
```

然后且仅在此时，系统可以提交：

```text
S_{t+1} := S_candidate
```

如果验证失败，系统不更新硬状态。它可以创建审计发现、请求更多观测、回滚、重试、分支、升级，或把状态标记为 blocked。

SGAR 的核心规则是：

```text
Only verified transitions update authoritative state.
```

模型可以提议 `A_t`，帮助解释 `O_t`，建议 `S_candidate`，解释 `V_t`。但除非转移契约被满足，系统状态不改变。

---

## 4. 状态权威与状态表面

受治理系统区分多种状态表面。

### 4.1 声称状态

声称状态是模型或用户说为真的东西。

```text
"The bug is fixed."
"The file has been updated."
"The task is complete."
```

声称状态可作为提案，但本身没有权威。

### 4.2 上下文状态

上下文状态是当前 prompt、对话历史、scratchpad 或模型可见叙事中出现的内容。

它可能包含摘要、先前声称、计划、部分观测、决策或生成记忆。上下文状态是易变的，可能不完整、过时、不一致或被编造。

### 4.3 观测状态

观测状态通过工具、环境查询、文件读取、测试输出、数据库查询、用户确认、日志或外部 API 获得。

观测状态权威高于上下文，但仍可能部分、噪声、过时或被误解。

### 4.4 已验证状态

已验证状态是通过验证器或提交规则的观测状态。

例如：

```text
A file modification is verified by reading the file after writing.
A code repair is verified by tests or static checks.
A SQL candidate is verified by execution and semantic audit.
A memory update is verified by reading the durable memory store.
A task completion is verified by satisfying declared completion criteria.
```

### 4.5 已提交状态

已提交状态是有效转移后的权威系统状态。它用于未来规划、路由、渲染、审计、恢复和报告。

层级是：

```text
claimed state < context state < observed state < verified state < committed state
```

健壮 agent 不应折叠这个层级。

---

## 5. 上下文降权规则

SGAR 中最重要的操作规则是 **上下文降权规则**：

```text
Context may propose, summarize, or explain state, but it may not authorize state.
```

上下文窗口从权威降级为工作区。它仍然有用，但角色改变了。

上下文允许用于：

```text
proposing actions
summarizing observations
holding temporary hypotheses
constructing plans
explaining candidate transitions
drafting control deltas
suggesting verification steps
```

上下文不允许用于：

```text
authorizing task completion
asserting tool effects without observation
committing memory updates without durable write
marking tests passed without test evidence
claiming file edits without file verification
accepting GKO revisions without object-store update
```

这个规则防止大量 agentic 失败。模型仍可基于上下文推理，但系统不再把上下文流畅性误认为操作真相。

---

## 6. 状态模型

状态治理型 agent 需要显式状态模型。状态模型不必很重，但必须识别系统把哪些事实视为权威。

最小状态记录是：

```json
{
  "state_id": "state.project.task.001",
  "version": 17,
  "status": "active | blocked | complete | reverted | superseded",
  "task_state": {},
  "artifact_state": {},
  "environment_state": {},
  "memory_state": {},
  "governance_state": {},
  "execution_state": {},
  "collaboration_state": {},
  "open_issues": [],
  "invariants": [],
  "last_transition_id": "transition.016",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

这些字段是概念性的，不是强制性的。不同系统可以不同方式实现。

### 6.1 任务状态

任务状态记录用户任务当前状态：

```text
goal
scope
accepted constraints
completion criteria
current phase
blocked conditions
known uncertainties
```

### 6.2 产物状态

产物状态记录正在创建或修改的对象状态：

```text
files
documents
code modules
SQL candidates
reports
slides
models
data tables
analysis artifacts
```

### 6.3 环境状态

环境状态记录相关外部条件：

```text
filesystem state
tool availability
API responses
database schema
runtime dependencies
calendar facts
repository branch
execution logs
```

### 6.4 记忆状态

记忆状态记录持久用户、项目或系统记忆：

```text
user preferences
project decisions
accepted terminology
reusable constraints
long-term context
revoked assumptions
```

### 6.5 治理状态

治理状态记录受治理对象：

```text
GKOs
GEOs
Audit Findings
Control Deltas
Regression Guards
Defect Ledgers
Revocation Rules
Verifier definitions
```

### 6.6 执行状态

执行状态记录当前运行或最近完成的操作：

```text
queued actions
running actions
completed actions
failed actions
retry policies
rollback handles
idempotency keys
```

### 6.7 协作状态

协作状态记录人类和多 agent 协调：

```text
assigned roles
pending approvals
user decisions
handoff records
escalations
accepted / rejected proposals
```

这个状态模型的目的不是官僚式完整，而是防止隐藏进展假设只存在于上下文中。

---

## 7. 转移契约

转移契约定义一次尝试状态改变何时有效。

最小转移记录是：

```json
{
  "transition_id": "transition.unique_identifier",
  "from_state_id": "state.before",
  "action": {
    "type": "tool_call | file_write | memory_update | gko_update | audit_commit | task_completion | rollback | escalation",
    "parameters": {}
  },
  "observation": {
    "type": "tool_result | file_readback | test_output | human_confirmation | database_result | verifier_report",
    "evidence": []
  },
  "verifier": {
    "id": "verifier.unique_identifier",
    "rule": "acceptance criterion",
    "authority_level": "mechanical | external | human | governed_llm | heuristic"
  },
  "candidate_state_delta": {},
  "decision": "accept | reject | defer | escalate | rollback",
  "to_state_id": "state.after_if_accepted",
  "commit_record": {
    "committed_by": "system component or authority",
    "committed_at": "timestamp",
    "replay_handle": "how to reproduce or inspect the transition"
  }
}
```

转移契约应回答五个问题：

```text
1. What state is being changed?
2. What action claims to change it?
3. What observation resulted from the action?
4. What verifier decides whether the observation is sufficient?
5. What state delta is committed if the verifier accepts?
```

缺少任何一项，转移就欠规格。

---

## 8. 验证器分层

不是所有验证器都有相同权威。SGAR 要求显式验证器分层。

典型权威层级是：

```text
mechanical verifier
  > external environment observation
  > durable object-store readback
  > human domain approval
  > governed LLM judge with evidence
  > raw model assertion
```

这个层级依任务而定，但一般规则是：

```text
The verifier with the highest relevant authority should dominate lower-authority claims.
```

例子：

```text
A test failure overrides a model's claim that code is fixed.
A database execution error overrides a model's claim that SQL is valid.
A file readback overrides a model's claim that a file was written.
A user's explicit rejection overrides a model's inferred preference.
A regression guard failure overrides a model's claim that a defect is resolved.
```

LLM 只能在受限条件下充当验证器。受治理 LLM 验证器应具有：

```text
explicit rubric
visible evidence
known authority limits
calibration or cross-checking
revocation conditions
separation from the generator when possible
```

默认规则是：

```text
LLM judgment may assist verification, but should not outrank mechanical or environmental evidence.
```

---

## 9. 状态转移类型

SGAR 支持多种转移类型。

### 9.1 观测转移

观测转移用新观测证据更新状态。

```text
S + observe(environment) → O → verify_observation → S'
```

例如：读取文件、查询数据库、检查日志、获取测试输出。

### 9.2 产物转移

产物转移改变持久产物。

```text
S + modify(artifact) → O → verify_readback_or_test → S'
```

例如：写文档、修补代码、更新 SQL 候选、修订幻灯片。

### 9.3 治理转移

治理转移改变受治理对象。

```text
S + update(GKO) → O → verify_object_store → S'
```

例如：添加路由规则、修订 rubric、撤销约束、提交审计发现。

### 9.4 验证转移

验证转移记录验证器结果。

```text
S + run(verifier) → O → commit_result → S'
```

例如：运行测试、执行 SQL、执行 schema 检查、验证约束。

### 9.5 完成转移

完成转移把任务或子任务标记为完成。

```text
S + propose_completion → O → verify_completion_criteria → S'
```

完成应视为高风险转移，因为虚假完成是最常见的 LLM-agent 失败之一。

### 9.6 回滚转移

回滚转移反转或取代先前提交状态。

```text
S + rollback(transition_id) → O → verify_reversion → S'
```

当某个转移在早期证据下有效，但后来发现有害或错误时，回滚是必要的。

### 9.7 撤销转移

撤销转移削弱或移除受治理对象。

```text
S + revoke(object_id) → O → verify_revocation_rule → S'
```

这是 GKO 撤销的运行时对应物。没有撤销的知识治理会变成脆弱累积。

### 9.8 升级转移

升级转移记录系统在当前权威下无法安全继续。

```text
S + escalate(reason) → O → verify_escalation_condition → S'
```

升级不是失败，而是从自治执行转向更高权威的受控状态转移。

---

## 10. 运行时循环

最小 SGAR 运行时循环是：

```text
while not terminal(S):
    read committed state S
    construct context from S and relevant observations
    propose action A
    execute or simulate A according to authority rules
    observe outcome O
    apply verifier V
    if V accepts:
        commit S'
    else:
        create audit finding or blocked state
        decide retry / rollback / revise / escalate
```

伪代码：

```python
def state_governed_step(S):
    context = render_context_from_state(S)
    A = propose_action(context)

    O = execute_or_observe(A)
    candidate_delta = derive_state_delta(S, A, O)

    decision = verify_transition(S, A, O, candidate_delta)

    if decision.accept:
        S_next = commit(S, candidate_delta, decision)
        return S_next

    finding = create_audit_finding(S, A, O, decision)
    S_blocked = commit_blocked_or_repair_state(S, finding)
    return S_blocked
```

关键细节是：上下文从状态渲染，而不是反过来。模型不拥有状态。它接收状态投影，并提出转移。

### SGAR 作为受治理的机制层转移

形式化机制层把 LLM 系统建模为一个由观测、信念、世界模型、动作接口、策略支持、路由与搜索/执行组件构成的近似决策系统。

SGAR 把这个机制层系统中的一个受治理步骤操作化为：

```text
S + A → O → V → S'
```

可以这样理解：

| SGAR 术语 | 机制层解释 |
|---|---|
| `S` | 已提交状态记录，包括任务状态、治理状态、工具状态和信念状态 |
| `A` | 从有效动作接口 `A_sys` 中选出的行动 |
| `O` | 行动后由观测通道产生的观测 |
| `V` | 验证器、评估器、转移护栏或提交准则 |
| `S'` | 下一个已提交硬状态 |

八条机制轴描述了这个转移常见的失败方式：

| 机制轴 | SGAR 失败形态 |
|---|---|
| `specification_reward` | 验证器按错误准则提交进展 |
| `observation_availability` | 所需的行动后观测不可获得 |
| `belief_representation` | 观测没有被转换为正确状态 |
| `dynamics_world_model` | 系统错误预测了行动后果 |
| `action_interface` | 所需行动实际上不可调用 |
| `capability_support` | 系统无法生成所需行动候选 |
| `capability_routing` | 激活了错误能力或错误模式 |
| `search_execution` | 系统无法完成、保留或验证该转移 |

对 SGAR 来说，世界模型失败和动作接口失败尤为重要。模型可能叙述一次成功行动，但环境并未改变；也可能提出一个在真实动作接口中根本不可执行的修复。SGAR 的作用，就是阻止这种叙事性进展被提交为真实进展。

---

## 11. SGAR 与六类原始失配

SGAR 不是第七类原始失配。它是一种运行时体制，防止若干原始失配随时间失控。

### 11.1 观测-表征

SGAR 强制观测声称绑定到观测记录。如果决定性变量缺失，状态可以把它表示为未解决观测需求，而不是让模型假装已知。

```json
{
  "missing_observations": [
    "database sample values for column X",
    "test output after patch Y",
    "user confirmation of constraint Z"
  ]
}
```

### 11.2 状态失配

SGAR 维护显式状态假设，防止单一潜在状态假设静默成为已提交事实。

```json
{
  "state_hypotheses": [
    {"id": "h1", "claim": "user wants concise summary", "status": "unverified"},
    {"id": "h2", "claim": "user wants formal paper draft", "status": "supported"}
  ]
}
```

### 11.3 拟合边界失配

SGAR 存储路由规则和激活历史。如果能力过触发或欠触发，修正可作为 router 更新提交。

```json
{
  "routing_updates": [
    {
      "capability": "direct_sql_generation",
      "change": "suppress until schema subgraph and join path are verified"
    }
  ]
}
```

### 11.4 支持失配

SGAR 可以记录控制空间中哪些区域已搜索，哪些仍未探索，防止在同一个低价值盆地反复搜索。

```json
{
  "search_state": {
    "explored_join_paths": [],
    "pruned_candidates": [],
    "required_expansions": []
  }
}
```

### 11.5 聚合失配

SGAR 把全局不变量和组合约束存为有状态对象，而不是单轮指令。

```json
{
  "global_invariants": [
    "all generated SQL clauses must refer to columns in the selected schema subgraph",
    "final report claims must trace to accepted evidence records"
  ]
}
```

### 11.6 规格失配

SGAR 使规格变化显式化。Rubric、成功标准和用户决策成为带修订历史的已提交治理状态。

```json
{
  "success_criteria": [
    {
      "criterion": "final answer must include downloadable Markdown file",
      "source": "user request",
      "status": "committed"
    }
  ]
}
```

---

## 12. SGAR 与知识治理

知识治理创建并管理控制知识。SGAR 决定这些知识何时成为权威。

在上下文中提出的 GKO 还不是已提交 GKO。它只有通过治理转移后才成为已提交对象。

```text
Proposed GKO
  → evidence envelope
  → conflict check
  → revocation rule check
  → object-store write
  → readback verification
  → committed GKO
```

已提交 GKO 随后可以影响：

```text
routing
search
rendering
audit
verification
state transition eligibility
```

这种区分很重要，因为许多 LLM 系统会在对话上下文中积累伪规则。模型可能说：

```text
From now on, we will always check X before doing Y.
```

但除非该规则被提交进受治理对象库或状态记录，否则它可能消失、被矛盾或在之后被忽略。

SGAR 版本是：

```text
1. Propose rule.
2. Represent it as a GKO candidate.
3. Attach condition, evidence, priority, and revocation trigger.
4. Check for conflicts.
5. Commit it to governance state.
6. Use it in future context rendering and transition verification.
```

---

## 13. SGAR 与审计工程

审计工程产生发现、控制增量和回归护栏。SGAR 把它们提交进运行时状态。

集成关系是：

```text
Candidate Artifact
  → Audit Finding
  → Control Delta
  → Verification
  → State Commit
  → Regression Guard Activation
  → Defect Ledger Update
```

没有 SGAR，审计发现可能停留为文本建议。模型可能提到失败、道歉并产生修订输出，但失败家族不一定成为持久系统知识。

有了 SGAR，审计发现成为状态转移：

```json
{
  "transition_type": "audit_commit",
  "finding_id": "finding.empty_result_due_to_overconstrained_predicate",
  "control_delta": {
    "target": "predicate_construction_rule",
    "change": "require value-distribution inspection before applying equality predicate"
  },
  "regression_guard": {
    "type": "execution_guard",
    "rule": "candidate SQL must not return empty result without explicit empty-result justification"
  }
}
```

缺陷不再只是被记录。它改变未来行为。

---

## 14. SGAR 防止的失败模式

### 14.1 虚假完成

虚假完成发生在 agent 未满足完成标准就声明任务完成时。

SGAR 修复：

```text
completion requires explicit completion transition and verifier acceptance
```

### 14.2 状态漂移

状态漂移发生在系统内部叙事逐渐偏离外部现实。

SGAR 修复：

```text
state summaries are projections from committed records, not authority sources
```

### 14.3 状态振荡

状态振荡发生在系统反复改变假设或计划，却没有提交稳定状态。

SGAR 修复：

```text
state hypotheses require status: proposed / supported / rejected / committed / revoked
```

### 14.4 表演性行动

表演性行动发生在 agent 生成类似行动的文本，却没有影响环境。

SGAR 修复：

```text
state-changing actions require tool effects and observation records
```

### 14.5 记忆污染

记忆污染发生在未验证声称进入持久记忆时。

SGAR 修复：

```text
memory writes require source, confidence, scope, and revocation trigger
```

### 14.6 不可恢复的中间失败

长流程改变多个产物却缺少回滚或重放记录时，就会出现不可恢复的中间失败。

SGAR 修复：

```text
every state-changing action has transition ID, evidence, delta, and rollback policy
```

### 14.7 上下文级进展幻觉

上下文变得越来越详细连贯，但外部任务没有推进时，就会出现上下文级进展幻觉。

SGAR 修复：

```text
progress metrics count committed transitions, not narrative length
```

### 14.8 角色混淆

模型同时充当规划者、执行者、验证者和状态权威，且缺少分离时，就会出现角色混淆。

SGAR 修复：

```text
separate proposal, execution, verification, and commitment roles where risk requires
```

---

## 15. 权威分离

SGAR 受益于分离四类角色：

| 角色 | 功能 |
|---|---|
| Proposer | 生成候选行动或状态增量。 |
| Executor | 对工具或环境执行行动。 |
| Observer | 记录结果。 |
| Verifier | 判断转移是否可准入。 |
| Committer | 写入被接受的状态转移。 |

在低风险系统中，一个组件可以承担多个角色。在高风险系统中，这些角色应分离。

重要规则是：

```text
The proposer should not be the sole authority for verifying its own success.
```

这不禁止 LLM 自我批判。它把自我批判降级为证据来源之一。

---

## 16. 幂等、重放与回滚

长程 agent 需要恢复。恢复要求系统知道发生了什么。

### 16.1 幂等

如果重复某行动不会产生非预期额外效果，该行动就是幂等的。

SGAR 应尽可能偏好幂等转移：

```text
write object version N
set field to value V
create transition with unique idempotency key
```

而不是模糊操作：

```text
append something again
make the file better
update the memory somehow
```

### 16.2 重放

可重放性意味着系统能重构某状态如何到达。

可重放转移包含：

```text
previous state reference
action parameters
observed outcome
verifier decision
state delta
commit timestamp
artifact references
```

可重放性支持调试、审计、治理和信任。

### 16.3 回滚

回滚允许系统撤销或取代坏转移。

并非所有转移都能物理撤销。有些只能补偿或标记为被取代。因此，SGAR 应区分：

```text
reversible transition
compensatable transition
irreversible transition
```

不可逆转移的提交阈值应更高。

---

## 17. 状态不变量

状态不变量是跨转移必须保持为真的条件。

例子：

```text
A completed task must have at least one completion verifier.
A committed GKO must have a revocation trigger.
A code patch transition must include file readback.
A defect marked resolved must have an associated regression guard.
A memory fact must have source and scope.
A high-risk action must have human approval.
```

状态不变量防止治理对象退化成非结构化日志。

最小 invariant schema：

```json
{
  "id": "invariant.unique_identifier",
  "condition": "when this invariant applies",
  "rule": "what must be true",
  "severity": "warning | blocking | critical",
  "verifier": "how to check the invariant",
  "repair_action": "what to do if violated"
}
```

不变量把 SGAR 与审计工程连接起来。不变量违反应创建审计发现，并可能阻止转移提交。

---

## 18. 完成作为受治理转移

完成值得特别处理。在普通 agent 系统中，完成常常是模型话语：

```text
"Done."
```

在 SGAR 中，完成是一类具有显式准入条件的转移。

完成契约是：

```json
{
  "completion_id": "completion.task.001",
  "task_id": "task.001",
  "claimed_completed_scope": "what is claimed complete",
  "completion_criteria": [],
  "evidence": [],
  "verifier": {},
  "open_issues": [],
  "known_limitations": [],
  "decision": "accept | reject | partial | blocked"
}
```

完成转移应回答：

```text
What exactly is complete?
Against which criteria?
What evidence supports completion?
What remains open?
What authority accepted completion?
```

这防止过宽的完成声称。系统可以把子任务标记为完成，同时保持更大任务 active。

---

## 19. 记忆写入作为受治理转移

记忆是最危险的状态形式之一，因为它影响未来行为，却常常难以被用户检查。

记忆写入不应仅仅因为模型推断了某事就发生。它应受治理。

最小 memory transition：

```json
{
  "memory_write_id": "memory.write.unique_identifier",
  "claim": "user prefers concise technical explanations",
  "source": "explicit user statement | inferred | repeated behavior | system decision",
  "scope": "global | project | session | task",
  "confidence": "low | medium | high",
  "lifespan": "temporary | persistent | until_revoked",
  "revocation_trigger": "user contradicts preference or task context changes",
  "verifier": "user explicit confirmation or policy allowing inference",
  "decision": "commit | defer | reject"
}
```

记忆治理防止：

```text
unverified preference capture
stale assumptions
cross-project contamination
privacy leakage
irreversible personalization errors
```

在 SGAR 中，记忆不是被动 transcript，而是受治理状态表面。

---

## 20. 人类批准与协作状态

人类参与也应被状态治理。当用户批准、拒绝、修正或约束影响未来行为时，它应成为显式状态事件。

人类批准转移记录：

```json
{
  "approval_id": "approval.unique_identifier",
  "approved_object": "artifact | plan | GKO | action | completion",
  "scope": "what the approval covers",
  "not_approved": "what the approval does not cover",
  "approver": "user or role",
  "evidence": "message or interaction reference",
  "expires": "optional expiry condition"
}
```

这防止常见失败：

```text
The user approved a local step, and the agent treats it as approval of the entire plan.
```

批准有作用域。SGAR 使作用域显式。

---

## 21. 多 Agent 系统中的 SGAR

多 agent LLM 系统会放大状态权威问题。多个 agent 可能维护不一致叙事、重复工作、覆盖彼此假设，或通过没有外部权威的友好 agent 验证自己的输出。

SGAR 要求共享硬状态和角色特定权限。

多 agent 状态模型应说明：

```text
which agent can propose actions
which agent can execute tools
which agent can verify outcomes
which agent can commit state
which objects require human or mechanical authority
how conflicts are resolved
```

简单权限 schema：

```json
{
  "role": "planner | executor | auditor | verifier | committer | human_supervisor",
  "permissions": [
    "propose_transition",
    "execute_tool",
    "create_audit_finding",
    "commit_gko",
    "mark_task_complete"
  ],
  "forbidden_actions": [],
  "requires_approval_for": []
}
```

关键规则是：

```text
Multi-agent disagreement should be resolved through state authority, not conversation dominance.
```

---

## 22. Text-to-SQL 中的 SGAR

Text-to-SQL 是 SGAR 的紧凑示例。

直接系统可能生成 SQL、运行、观测错误并修订。但如果中间假设不受状态治理，系统可能重复失败或静默改变 schema 假设。

SGAR text-to-SQL 状态包括：

```json
{
  "question": "natural language query",
  "schema_state": {
    "inspected_tables": [],
    "column_meanings": [],
    "foreign_keys": [],
    "sampled_values": []
  },
  "control_state": {
    "schema_subgraph": null,
    "join_paths": [],
    "value_bindings": [],
    "predicate_skeleton": null
  },
  "candidate_sql": [],
  "execution_results": [],
  "audit_findings": [],
  "accepted_sql": null
}
```

转移包括：

```text
inspect_schema
sample_values
commit_schema_subgraph
commit_join_path
render_sql
execute_sql
audit_execution_result
revise_control_object
accept_final_sql
```

完成要求：

```text
accepted SQL
execution result
semantic audit
record of unresolved ambiguity, if any
```

这把 text-to-SQL 从直接答案生成转化为围绕 schema、值、join、谓词、执行和语义接受的受治理状态推进。

---

## 23. 代码 Agent 中的 SGAR

代码 agent 极易暴露于虚假完成和状态漂移。

代码 agent 可能声称它修改了代码、修复了 bug、更新了测试或通过了测试套件。SGAR 要求每个这类声称映射到一个转移。

代码 agent 状态包括：

```json
{
  "repository_state": {
    "branch": "current branch",
    "modified_files": [],
    "base_revision": "commit hash or snapshot id"
  },
  "issue_state": {
    "bug_report": "description",
    "reproduction_steps": [],
    "root_cause_hypotheses": [],
    "accepted_root_cause": null
  },
  "patch_state": {
    "candidate_patches": [],
    "applied_patch": null,
    "rollback_handle": null
  },
  "verification_state": {
    "tests_run": [],
    "test_results": [],
    "static_checks": [],
    "known_failures": []
  }
}
```

转移包括：

```text
read_file
write_patch
readback_patch
run_test
commit_test_result
audit_failure
revise_patch
mark_issue_resolved
rollback_patch
```

如果满足以下情况，完成转移应被阻止：

```text
no reproduction was attempted
no relevant test was run
file modification was not verified
known failing tests remain unexplained
regression guard is missing for a fixed defect
```

这不要求完美验证。它要求显式验证作用域。

---

## 24. 研究 Agent 中的 SGAR

研究 agent 会产生微妙的状态权威风险，因为大量工作是概念性的：声明、摘要、引用、假设、大纲和决策。

研究 agent 状态应区分：

```text
source records
extracted claims
interpretations
hypotheses
accepted conclusions
open uncertainties
citation requirements
drafted artifacts
review findings
```

模型生成的摘要不是已接受结论。它只有通过适当验证器后才成为结论，例如来源可追溯性、用户接受或与研究 rubric 一致。

研究转移可以是：

```text
read_source → extract_claims → verify_traceability → commit_claim_objects
```

另一个可以是：

```text
propose_theoretical_claim → audit_against_framework → commit_as_GKO_with_revocation_trigger
```

SGAR 在研究中尤其重要，因为概念漂移很难检测。长篇连贯草稿可能静默改变定义、夸大证据或折叠区分。硬状态迫使定义、假设和已接受声明保持可检查。

---

## 25. SGAR 与工具使用

工具使用不自动等于状态治理。模型可以调用工具，却仍然错误处理结果状态。

SGAR 要求显式表示工具效果。

对每个工具调用，系统应记录：

```text
tool name
input parameters
authority level
side-effect profile
observed output
error status
state delta, if any
verification method
rollback or compensation policy
```

工具调用可按副作用分类：

| 工具类型 | 状态风险 |
|---|---|
| Pure read | 低，但观测可能过时或部分。 |
| Deterministic computation | 低到中，取决于输入正确性。 |
| File write | 中，需要读回和回滚。 |
| Database write | 高，需要事务和审计。 |
| External message/send action | 高，常常不可逆。 |
| Memory write | 高，影响未来行为。 |
| Deletion/destructive action | 严重，需要更高权威。 |

转移阈值应随不可逆性和外部后果提高。

---

## 26. 状态压缩与上下文渲染

SGAR 不要求把全部硬状态放进 prompt。系统应把硬状态中与任务相关的投影渲染进上下文。

这引入一个新的受治理函数：

```text
R_context: S_hard → C_prompt
```

上下文渲染必须保存与下一步行动相关的状态区分。糟糕渲染会在运行时内部重新引入观测-表征失配。

好的上下文渲染包括：

```text
current goal
committed constraints
open uncertainties
recent relevant transitions
active GKOs
blocking issues
available actions
completion criteria
```

它应避免：

```text
stale summaries
unverified claims
irrelevant long history
collapsed uncertainty
hidden revocations
overconfident completion statements
```

因此，SGAR 不消除表征问题。它使这些问题显性且可治理。

---

## 27. 非单调状态与撤销

某些状态应是单调的：某个转移发生过、某个测试产生过输出、某个文件在时间 `t` 具有某内容。其他状态是非单调的：假设、信念、偏好、rubric 和控制规则可能被修订或撤销。

SGAR 应区分事件历史和当前信念状态。

```text
Event history is append-only.
Current governed state is revisable.
```

例如：

```text
Event: User said "keep it concise" on date t.
Current preference: User prefers concise answers for this project.
Revocation: User later asks for maximal detail.
```

事件仍然为真。当前偏好会改变。

这一区分防止两个坏极端：

```text
forgetting old evidence entirely
or treating old assumptions as immortal facts
```

---

## 28. SGAR 决策规则

实用系统需要判断何时 SGAR 开销值得。

SGAR 最有价值的情形：

```text
the task spans multiple turns or tools
state changes have external effects
actions are costly or irreversible
progress must be recoverable
multiple agents or humans collaborate
control knowledge must persist
completion has meaningful consequences
failure families should be remembered
```

SGAR 可能不必要的情形：

```text
single-turn low-risk drafting
pure brainstorming
casual explanation
format conversion
one-shot style rewriting
simple Q&A with no durable state
```

简单判据是：

```text
Use SGAR when the expected cost of false state exceeds the overhead of state governance.
```

虚假状态包括：

```text
false completion
wrong memory
unverified tool effect
lost rollback
miscommitted assumption
untracked artifact change
unrecoverable process drift
```

---

## 29. 最小 SGAR 实现

最小实现不需要大型平台。它需要四件事：

```text
1. A committed state store.
2. A transition log.
3. Verifier definitions.
4. A context renderer that reads from committed state.
```

最小循环是：

```text
read state
render context
propose action
execute / observe
derive state delta
verify delta
commit or reject
log transition
```

轻量文件实现可以存储：

```text
/state/current.json
/state/transitions/*.json
/governance/gkos/*.json
/governance/findings/*.json
/governance/guards/*.json
/artifacts/*
```

原则比存储技术更重要。只要尊重转移权威，数据库、事件日志、git 仓库、对象存储、任务追踪器或结构化文件系统都能实现 SGAR。

---

## 30. 理论命题

### 命题 1：上下文非权威

如果状态提交只依赖模型断言，则存在一个运行时轨迹，其中模型声称进展，而环境或对象状态没有对应改变。

因此，对于外部进展重要的系统，模型断言本身不足以作为状态权威。

### 命题 2：进展依赖验证

对任何成功依赖外部产物或环境状态的任务，进展不是由行动提案建立，而是由对行动效果的已验证观测建立。

### 命题 3：审计持久性

没有提交进持久治理或状态对象的审计发现，可能在上下文截断、摘要或主题转移下丢失。因此，审计驱动改进需要状态提交。

### 命题 4：完成风险

如果任务完成只表示为生成文本，则在状态权威层面，虚假完成与真实完成不可区分。因此，当任务风险值得时，完成必须由显式转移契约治理。

### 命题 5：撤销必要性

任何没有撤销路径的持久受治理对象，都可能在证据变化下变成过时约束。因此，长程 SGAR 系统需要针对非单调控制知识的撤销或取代转移。

这些命题不是经验性能主张，而是关于权威、状态和转移有效性的结构主张。

---

## 31. 与形式传统的关系

SGAR 借用了若干既有传统的结构思想，并将其适配到 LLM-agent 运行时。

### 31.1 事件溯源

事件溯源把状态视为事件日志的结果。SGAR 类似地把已提交 agent 状态视为转移记录的结果。区别是，SGAR 事件包括 LLM 提案、工具观测、审计发现、GKO 修订、人类批准和验证器决策。

### 31.2 数据库事务

事务区分拟议改变和已提交改变。SGAR 把这一区分应用到 agentic 工作中。模型的拟议改变只有在满足转移契约后才提交。

### 31.3 预写日志

预写日志记录足够信息以便从失败中恢复。SGAR 转移日志对 agent 工作流起类似作用：允许重放、审计、回滚和问责。

### 31.4 状态机

状态机定义状态之间的允许转移。SGAR 把这一思想扩展到异质 LLM 任务，其中状态包括产物、信念、工具、记忆、审计和协作对象。

### 31.5 POMDP 与信念状态

POMDP 对 SGAR 并不只是一个类比。形式化机制层提供了 SGAR 用来提交已验证转移的近似决策系统模型。SGAR 则是覆盖在该机制层转移过程之上的硬状态治理层。

### 31.6 真值维护

真值维护系统追踪信念之间的依赖和撤回。SGAR 把这个逻辑应用到受治理知识对象、记忆记录、状态假设和撤销转移。

---

## 32. SGAR 自身的风险与失败模式

SGAR 引入开销，如果实现不当也会失败。

### 32.1 状态官僚制

过多状态结构会拖慢简单任务，并制造不必要摩擦。

缓解：

```text
apply SGAR selectively based on state risk
use lightweight state for low-risk tasks
allow direct generation when no durable state is affected
```

### 32.2 虚假权威

设计糟糕的状态存储可能保存未验证声称，却制造可靠性幻觉。

缓解：

```text
separate claimed, observed, verified, and committed state
require evidence and verifier metadata
```

### 32.3 验证器弱点

如果验证器很弱，SGAR 可能只是更正式地提交坏转移。

缓解：

```text
stratify verifier authority
prefer mechanical and environmental checks
record verifier limits
add audit-of-verifier processes
```

### 32.4 状态过时

世界变化时，已提交状态可能变得过时。

缓解：

```text
attach freshness metadata
use expiration conditions
require revalidation for time-sensitive facts
```

### 32.5 过早提交

系统可能过早提交假设。

缓解：

```text
support provisional states
separate hypothesis status from fact status
use revocation and supersession
```

### 32.6 对象存储不一致

治理对象、产物记录和转移日志可能分歧。

缓解：

```text
state invariants
periodic consistency checks
transition atomicity where possible
```

SGAR 本身也应受治理。它不是魔法层，而是一种权威管理纪律。

---

## 33. 设计原则

SGAR 核心设计原则是：

### 原则 1：上下文降权

上下文窗口是工作区，不是状态权威。

### 原则 2：已验证提交

只有已验证转移更新硬状态。

### 原则 3：权威分层

不同证据来源具有不同权威等级。

### 原则 4：显式状态表面

任务、产物、环境、记忆、治理、执行和协作状态应在相关时被区分。

### 原则 5：可重放性

系统应能重构重要状态如何到达。

### 原则 6：可撤销性

非单调状态必须有撤销或取代路径。

### 原则 7：完成治理

完成是转移，不是陈述。

### 原则 8：审计持久性

审计发现必须成为持久对象，才能影响未来行为。

### 原则 9：最小必要治理

只使用任务风险和时长所需的状态治理。

### 原则 10：状态渲染上下文

Prompt 应从已提交状态渲染，而不是允许上下文叙事定义状态。

---

## 34. 标准 Schema

### 34.1 State Record

```json
{
  "state_id": "state.unique_identifier",
  "version": 1,
  "status": "active",
  "task_state": {},
  "artifact_state": {},
  "environment_state": {},
  "memory_state": {},
  "governance_state": {},
  "execution_state": {},
  "collaboration_state": {},
  "invariants": [],
  "open_issues": [],
  "last_transition_id": null
}
```

### 34.2 Transition Record

```json
{
  "transition_id": "transition.unique_identifier",
  "from_state_id": "state.before",
  "action": {},
  "observation": {},
  "verifier": {},
  "candidate_state_delta": {},
  "decision": "accept | reject | defer | escalate | rollback",
  "to_state_id": "state.after",
  "commit_record": {}
}
```

### 34.3 Verifier Record

```json
{
  "verifier_id": "verifier.unique_identifier",
  "type": "mechanical | environment | human | governed_llm | heuristic",
  "authority_level": 0,
  "input_requirements": [],
  "acceptance_rule": "rule or procedure",
  "known_limits": [],
  "failure_action": "reject | retry | escalate | create_audit_finding"
}
```

### 34.4 Completion Record

```json
{
  "completion_id": "completion.unique_identifier",
  "task_id": "task.unique_identifier",
  "scope": "what is complete",
  "criteria": [],
  "evidence": [],
  "verifier": {},
  "open_issues": [],
  "known_limitations": [],
  "decision": "complete | partial | blocked | rejected"
}
```

### 34.5 Rollback Record

```json
{
  "rollback_id": "rollback.unique_identifier",
  "target_transition_id": "transition.to_revert_or_supersede",
  "reason": "why rollback is needed",
  "rollback_type": "revert | compensate | supersede | mark_invalid",
  "verification": {},
  "resulting_state_id": "state.after_rollback"
}
```

---

## 35. 结论

LLM agent 需要的不只是计划、记忆、工具和自我反思。它们需要一种运行时解释：什么让进展变得真实。在普通上下文驱动 agent 中，语言上下文往往承载状态的表象。它说什么已完成、什么为真、什么已改变、还剩什么。但上下文不是权威。它是叙事工作区。

状态治理型 Agent 体制用转移权威取代叙事权威。系统只通过已验证转移改变状态：

```text
S + A → O → V → S'
```

这个简单契约有广泛后果。它区分提案与行动、观测与声称、验证与信心、完成与宣告、记忆与推断、状态与摘要。它给知识治理提供运行时权威表面。它给审计工程提供持久写回路径。它给长程 agent 提供恢复、重放、回滚、撤销和协调能力。

SGAR 并非每次 LLM 交互都需要。对许多低风险、一次性、纯文本任务，它是不必要的。但当 LLM 系统必须跨时间行动、修改产物、记住偏好、协调 agent、使用工具、提交修复或声称完成时，硬状态治理就成为中心。

核心规则是：

```text
The model may narrate progress, but only the state transition commits it.
```

---

## 附录 A：紧凑术语表

| 术语 | 定义 |
|---|---|
| SGAR | 通过已验证硬状态转移定义进展的运行时体制。 |
| Hard state | 外部、权威、可检查，并用于未来执行的状态。 |
| Context state | 状态的叙事或 prompt 级表征，默认无权威。 |
| Claimed state | 模型或用户在验证前声称的状态。 |
| Observed state | 通过工具、环境查询或证据获得的状态。 |
| Verified state | 被验证器接受的观测或推导状态。 |
| Committed state | 有效转移后的权威状态。 |
| Transition contract | 形如 `S + A → O → V → S'` 的规则。 |
| Verifier | 判断候选转移是否准入的权威。 |
| Completion transition | 标记某范围工作完成的受治理转移。 |
| Rollback transition | 撤销、补偿或取代先前状态变化的转移。 |
| Revocation transition | 削弱或移除非单调受治理对象的转移。 |
| Context demotion | 上下文可以提出或总结状态，但不能授权状态的原则。 |

## 附录 B：最小 Checklist

在允许 LLM agent 标记某个状态改变步骤完成前，询问：

```text
1. What state is being changed?
2. What action was taken?
3. What observation shows the action's effect?
4. What verifier accepted the observation?
5. What state delta was committed?
6. Can the transition be replayed or inspected?
7. Is rollback or supersession possible if later evidence contradicts it?
8. Are open issues and limitations recorded?
```

如果这些问题无法回答，系统可能拥有有用的进展叙事，但还没有受治理进展。
