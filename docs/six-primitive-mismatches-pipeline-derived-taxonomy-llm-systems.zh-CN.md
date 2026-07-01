# LLM 系统中的六类原始失配

## 一种从管线推导出的价值保存失败分类法

**工作稿 v0.1**

---

## 摘要

本文把受治理 LLM 系统中的六类原始失配整理为一个从管线推导出的统一分类法。目的不是再增加一张失败模式清单，而是说明这六类失配为何在 LLM 系统的价值保存视角下是结构性的基础。

中心抽象是一条从世界到输出的管线：

```text
S_world
  -> O
  -> Z
  -> capability routing
  -> candidate support
  -> aggregation
  -> evaluation
```

高价值 LLM 系统必须让任务相关价值结构穿过这条管线并被保存。失败可能发生在：决定性变量没有进入表征，潜在状态不可识别，能力被路由到错误领域，高价值结构在系统策略下不可达，局部合理组件无法组合，或可访问目标偏离真实任务效用。

这些失败对应六类原始失配：

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

本文提出两个结构主张。第一，在这条管线抽象下，这个分类法相对完备：任何被建模为该管线的 LLM 系统中的任务价值失败，必然发生在这些站点之一，或发生在它们之间的相互作用中。第二，这六类失配在操作上相互独立：每一类都可以在近似保持其他站点不变时被扰动，并且每一类都需要不同的修复。

本文也说明原始失配如何组合成复合失败。最强的复合失败并非简单相加，而往往是超加性的——修复算子在管线站点之间相互耦合，一个站点的失败可能禁用修复另一个站点所需的信息、区分、候选、能力、组合规则或目标标准。

最后，本文提供诊断与治理接口。每类失配都被映射到核心问题、形式特征、典型症状、审计发现、控制增量、受治理知识对象、回归护栏和状态治理型提交。结果是在结构理论、对象模型、审计工程、知识治理和状态治理智能体范式之间建立一座统一桥梁。

---

## 1. 本文目的

本文在受治理 LLM 理论栈中占据一个特定位置。

主理论文档提出总论点：高价值 LLM 系统不只是生成系统，而是价值保存系统。任务价值必须穿过观测、表征、路由、支持、聚合、评价、审计和状态转移而不被破坏。

对象规范定义对象层：受治理知识对象（Governed Knowledge Object / GKO）、受治理升级对象（Governed Escalation Object / GEO）、Audit Finding、Control Delta、Regression Guard、Defect Ledger、State Record、Transition Contract 和 Revocation Rule。

审计工程文档定义失败如何被定位并写回控制空间。

状态治理智能体范式（State-Governed Agent Regime / SGAR）文档定义硬状态权威和运行时提交。

各个 mismatch 文档详细展开每类原始失配。

本文做另一件事：解释为什么这六类失配属于同一结构分类法。它给出推导、独立性论证、相对完备性论证、复合交互模型和实用诊断流程。

简言之：

```text
Main theory:        Why value preservation is the core problem.
Object model:       What governed system objects look like.
Audit Engineering:  How failures become control-space updates.
SGAR:               How progress becomes hard-state commitment.
Mismatch reports:   How each mismatch works in detail.
This document:      Why the six mismatches are the primitive stations of failure.
```

本文用途有三：

1. 为需要六类原始失配总图的读者提供概念桥梁。
2. 为“这个 taxonomy 不是任意清单”提供形式化层。
3. 作为诊断手册，帮助判断具体 LLM 系统失败需要哪个修复目标。

---

## 2. 价值保存管线

LLM 系统并不直接作用于世界，也不直接优化真实效用。它通过一系列转换工作。

通用高层管线是：

```text
S_world
  --phi--> O
  --psi--> Z
  --rho--> C
  --p_theta, B--> K
  --A--> Y
  --U_hat--> evaluation / selection
```

其中：

```text
S_world = underlying world state, environment, database, codebase, user need, task situation
phi     = observation, sensing, logging, retrieval, input acquisition
O       = observed data available to the system
psi     = representation function: encoding, compression, tokenization, schema extraction, prompt construction
Z       = model-accessible operational representation
rho     = routing function that activates capabilities, roles, tools, or strategies
C       = activated capabilities / strategies / tools / behavioral modes
p_theta = model or system policy over continuations, candidates, plans, or actions
B       = inference budget and search procedure
K       = reachable candidate set under p_theta and B
A       = aggregation or composition operator
Y       = final artifact or action sequence
U_hat   = accessible objective, rubric, metric, verifier, reward model, preference proxy
U       = true task utility
```

价值保存问题是：

```text
Preserve the task-relevant structure of U(S_world, Y)
through every transformation from S_world to evaluated output.
```

每个转换都可能保存、压缩、扭曲或破坏真实效用所需的结构。六类原始失配就是任务价值在这条管线的六个结构站点上不能被保存的六种方式。

---

## 3. 为什么需要从管线推导的分类法

LLM 失败分类很容易变成例子清单：

```text
hallucination
bad reasoning
wrong tool use
bad prompt following
weak planning
poor verification
schema linking error
state drift
objective hacking
```

这类清单在操作上有用，但不能解释哪些失败是原始的、哪些是派生的，也不能说明该修哪个目标。

例如，错误 text-to-SQL 答案可能被描述为：

```text
bad reasoning
schema linking failure
wrong join
hallucinated column
execution error
lack of planning
```

但这些描述可能指向不同结构原因：

```text
The relevant column was absent from representation.          -> observation-representation mismatch
The question intent depended on an ambiguous latent state.   -> state mismatch
The model used template SQL when schema audit was needed.    -> fitting-boundary mismatch
The correct join path was low-support under direct decoding. -> support mismatch
The clauses were locally plausible but globally inconsistent.-> aggregation mismatch
The metric rewarded executable SQL but not semantic intent.   -> specification mismatch
```

结构分类法必须回答四个问题：

1. 任务价值在系统管线的哪里丢失？
2. 该失败是原始的，还是另一个失败的结果？
3. 什么修复算子能处理它？
4. 哪个治理对象应保存该修复？

从管线推导的 taxonomy 通过把每类原始失配分配到不同结构站点来回答这些问题。

---

## 4. 六类原始失配总览

| 管线站点 | 原始失配 | 核心问题 | 主要修复目标 |
|---|---|---|---|
| `S_world -> O -> Z` | 观测-表征失配 | 决定性变量是否进入操作表征？ | 通道 / 表征修复 |
| `Z -> latent state` | 状态失配 | 给定表征，我们是否知道自己处于哪个状态？ | 状态判别 / 分支 |
| `Z -> C` | 拟合边界失配 | 正确能力是否在正确领域激活？ | 路由治理 |
| `p_theta, B -> K` | 支持失配 | 高价值结构能否成为活候选？ | 控制空间搜索 |
| `K -> Y` | 聚合失配 | 局部好 parts 是否组合成全局价值？ | 组合治理 |
| `Y -> U_hat vs U` | 规格失配 | 可访问目标是否代表真实效用？ | 目标治理 |

这个顺序不只是陈述顺序，而反映管线依赖。上游失败常限制下游修复。如果变量从未进入表征，下游评价器可能永远看不到所需信息。如果状态未识别，系统可能路由到错误能力。如果正确能力未激活，支持扩展可能搜索错误空间。如果高价值候选从未出现，聚合和评价只能在缺陷产物中选择。如果代理目标错误，前面所有工作都可能被优化到错误目标上。

---

## 5. 原始失配准入标准

一种失败类型只有满足三个标准，才在本文框架中称为原始。

### 5.1 结构站点标准

该失败必须对应价值保存管线中的独立站点。

常见或重要还不够。它必须识别任务价值在结构上会丢失的独特位置。

### 5.2 干预特异性标准

该失败必须需要不能被另一类原始失配修复目标替代的修复目标。

例如，如果决定性变量缺失于表征，支持扩展修不好它，系统必须修通道或表征。同样，如果目标代理错误，生成更多候选无法可靠修复，系统必须修规格。

### 5.3 最小对标准

该失败必须能构造最小对：两个系统或任务实例主要只在该站点不同，其他站点保持不变，而这个扰动改变任务价值。

该标准让独立性变得可操作。taxonomy 不只是语义分类，而与可反事实干预相连。

### 5.4 不可再分 / 原子性标准

一个拟议细分并不会因为“描述上有用”就自动成为新的原始失配。

```text
如果两个子情形位于同一管线站点，
并且共享同一有效修复目标，
那么这个切分就不是 primitive。
```

新的原始失配必须同时满足：

```text
1. 在价值保存管线中占据一个结构上不同的站点；
2. 在受控扰动下要求一个不可再约化的不同修复目标。
```

这就是为什么计数停在六。每个站点都可能包含很多子型，但只有当某个子型产生一个新的、在干预上可区分的站点，而不只是对同一站点的更细描述时，它才会上升为 primitive。

---

## 6. 原始失配 1：观测-表征失配

### 6.1 定义

观测-表征失配发生在世界中的任务决定性变量没有进入系统操作表征时。

系统可能通过日志、文档、检索段落、数据库 schema、用户消息、工具输出、截图、传感器或 prompt 上下文观测世界。随后这些观测被压缩、编码、tokenize、摘要、过滤和格式化。在任一阶段，高任务价值所需变量都可能被省略、混叠、扭曲或变得不可访问。

### 6.2 形式特征

令：

```text
Z = psi(phi(S_world))
```

令 `V*` 是任务关键变量集合。若存在两个世界状态 `S1` 和 `S2`：

```text
U*(S1) != U*(S2)
```

但从系统策略、评价器或控制流程看：

```text
psi(phi(S1)) ~= psi(phi(S2))
```

则存在观测-表征失配。

决定性区分存在于世界中，但在表征里被擦除或不可用。

### 6.3 诊断问题

```text
Did the variables that determine task success actually enter the operational representation Z?
```

如果答案是否定，下游推理、反思、重排和审计都在缺陷投影上操作。

### 6.4 典型症状

```text
The model reasons fluently from incomplete inputs.
The same answer is produced despite hidden changes in decisive variables.
Failures disappear when raw logs, database values, screenshots, or schema details are supplied.
The system cannot mention the actual variable that explains the error.
Extra reasoning over the same context does not improve the result.
The system over-relies on semantic priors where measurement is required.
```

### 6.5 主要修复目标

```text
channel repair
representation repair
measurement
raw-data access
tool access
schema extraction
value sampling
context reconstruction
structured variable introduction
```

### 6.6 治理模板

```json
{
  "type": "observation_channel_rule",
  "condition": "Task requires variable V before reasoning is reliable.",
  "assertion": "V must be observed and represented in field F before downstream generation.",
  "evidence": "Prior failures occurred when V was absent or aliased.",
  "revocation_trigger": "A new representation is introduced that preserves V by construction."
}
```

### 6.7 与状态失配的边界

观测-表征失配关注变量是否进入。

状态失配关注在表征已经存在后，如何推断状态。

```text
Observation-representation mismatch: Is the decisive variable in Z?
State mismatch: Given Z, which latent state are we in?
```

---

## 7. 原始失配 2：状态失配

### 7.1 定义

状态失配发生在正确策略、解释或评价依赖某个潜在状态，而该状态不能从当前表征中识别时。

系统可能已经有相关变量在上下文里，却仍不知道自己处于哪个体制。同一组观测特征可能支持多个隐藏状态，而这些状态要求不同最优行动。

### 7.2 形式特征

令 `H` 是潜在状态空间。正确行动依赖 `h in H`。

当：

```text
P(h | Z) is ambiguous, unstable, or misranked
```

且对于合理状态 `h1` 和 `h2`：

```text
argmax_a U(a | h1) != argmax_a U(a | h2)
```

就存在状态失配。

### 7.3 诊断问题

```text
Given the available representation, do we know which latent state or regime the task is in?
```

### 7.4 典型症状

```text
The answer is reasonable under one hidden interpretation but wrong under another.
The model commits to a state assumption without tracking alternatives.
Small clarifying information flips the correct policy.
The same surface request requires different behavior in different contexts.
The system fails in multi-turn settings due to outdated or uncommitted state.
```

### 7.5 主要修复目标

```text
state enumeration
state hypothesis tracking
state discriminator construction
clarification questions
branching policies
state-conditioned validators
belief-state update
hard-state records
```

### 7.6 治理模板

```json
{
  "type": "state_hypothesis",
  "condition": "Task outcome depends on latent state H.",
  "assertion": "Maintain competing state hypotheses until discriminating evidence is available.",
  "evidence": "Candidate actions differ across plausible states.",
  "revocation_trigger": "Verifier commits one state and rejects alternatives."
}
```

### 7.7 与规格失配的边界

状态失配关心我们处于什么情境。

规格失配关心什么算好。

任务可以目标清楚但状态歧义，也可以状态清楚但目标歧义。

---

## 8. 原始失配 3：拟合边界失配

### 8.1 定义

拟合边界失配发生在已学习能力、策略、角色或行为模式被激活在真实适用域之外，或在真实适用域内被抑制时。

模型可能拥有相关能力。问题是系统错误地路由到它。

### 8.2 形式特征

令 `X` 是一种能力。

```text
T_X = true domain where X should apply
M_X = model/system domain where X is actually activated
```

当：

```text
M_X != T_X
```

就存在拟合边界失配。基本形式是：

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

### 8.3 诊断问题

```text
Is the right capability being activated under the right conditions?
```

### 8.4 典型症状

```text
The model can perform the needed operation when asked explicitly, but does not invoke it spontaneously.
The system uses a familiar template where a different procedure is required.
Expert-sounding behavior appears in the wrong setting.
A safety, caution, planning, or audit pattern overfires.
Tool use, schema audit, state branching, or counterexample search underfires.
The failure is repaired by changing trigger conditions rather than adding facts. 
```

### 8.5 主要修复目标

```text
capability inventory
trigger condition audit
router rule construction
activation and suppression constraints
boundary perturbation
role-binding correction
capability applicability tests
```

### 8.6 治理模板

```json
{
  "type": "routing_rule",
  "condition": "Evidence pattern E indicates capability X is appropriate.",
  "assertion": "Activate X when E holds; suppress Y unless condition F also holds.",
  "evidence": "Prior failures involved under-triggering of X or over-triggering of Y.",
  "revocation_trigger": "Boundary tests show X is no longer predictive of improved task value."
}
```

### 8.7 与支持失配的边界

拟合边界失配问正确能力是否激活。

支持失配问在能力激活之后，高价值结构是否可达。

系统可以路由正确但仍到不了稀有结构。反过来，正确结构可能在模型支持中，但系统从未激活会搜索它的能力。

---

## 9. 原始失配 4：支持失配

### 9.1 定义

支持失配发生在高价值结构在模型策略、系统搜索流程和推断预算下具有不足概率质量或不足可达性时。

系统可能有正确信息、状态、路由和目标，却仍失败，因为正确结构没有成为活候选。

### 9.2 形式特征

令 `K_B` 是预算 `B` 下可达候选集，`Y*` 是高价值区域。

支持失配存在于：

```text
P_theta(Y* | Z, B) is low
```

或：

```text
Y* not in K_B
```

或：

```text
Y* in K_B but not distinguishable from rare noise under the available selection procedure
```

### 9.3 诊断问题

```text
Can the high-value structure actually become a candidate under the current policy, search space, and budget?
```

### 9.4 典型症状

```text
Many samples produce variations of the same flawed pattern.
The correct structure appears only when explicitly enumerated or constrained.
The model recognizes a correct answer after seeing it but rarely generates it.
Search increases diversity without reaching the decisive structure.
Rare but valid candidates are pruned as unlikely or odd.
The system improves when searching over intermediate structures rather than final outputs.
```

### 9.5 主要修复目标

```text
control-space search
candidate enumeration
constraint-guided decoding
retrieval augmentation
rare-pattern prompting
beam over structures
hypothesis expansion
tool-generated candidates
```

### 9.6 治理模板

```json
{
  "type": "support_expansion_rule",
  "condition": "High-value structure Y* is low-support under direct generation.",
  "assertion": "Search over control object C before rendering final output.",
  "evidence": "Direct candidates repeatedly omit Y*; explicit enumeration reaches it.",
  "revocation_trigger": "Direct generation reliably includes Y* under the same budget."
}
```

### 9.7 与聚合失配的边界

支持失配关心正确候选组件或结构是否可达。

聚合失配关心可达组件是否组合成全局有价值产物。

---

## 10. 原始失配 5：聚合失配

### 10.1 定义

聚合失配发生在局部合理、局部正确或局部有价值组件无法组合成全局有价值 artifact 时。

这是自回归平庸的精确结构位置。问题不是每个局部步骤都坏，而是局部价值没有组合式忠于全局价值。

### 10.2 形式特征

令：

```text
Y = A(y_1, y_2, ..., y_n)
```

当：

```text
local_value(y_i) is high for many or all i
```

但：

```text
U(A(y_1, ..., y_n)) is low
```

或局部编辑方向提升表面质量却降低全局效用时，就存在聚合失配。

### 10.3 诊断问题

```text
Do the locally good parts compose into a globally good whole?
```

### 10.4 典型症状

```text
Every section looks reasonable, but the whole argument fails.
Each SQL clause seems plausible, but the query is semantically wrong.
Each code patch passes local inspection, but the system invariant breaks.
An answer improves in fluency while losing structural correctness.
The model cannot maintain cross-part dependencies.
The final artifact violates constraints that span multiple parts.
```

### 10.5 主要修复目标

```text
composition rules
dependency graphs
global invariants
intermediate outlines
constraint propagation
cross-part validators
integration tests
nonlocal consistency checks
```

### 10.6 治理模板

```json
{
  "type": "composition_invariant",
  "condition": "Artifact parts y_i must jointly satisfy global invariant G.",
  "assertion": "Do not render final Y until G is checked across parts.",
  "evidence": "Prior failures involved locally plausible parts violating G.",
  "revocation_trigger": "A stronger generator or verifier enforces G by construction."
}
```

### 10.7 与规格失配的边界

聚合失配假设全局目标足够清楚，因而可以定义组合失败。

规格失配发生在目标本身或其代理是错误的。

---

## 11. 原始失配 6：规格失配

### 11.1 定义

规格失配发生在系统使用偏离真实任务效用的可访问目标进行优化、验证或选择时。

系统可能准确完成被要求、被奖励或被评分的事情，却仍失败于真实任务。

### 11.2 形式特征

令 `U_hat` 是可访问代理，`U` 是真实效用。

当任务相关候选 `Y1` 和 `Y2` 满足：

```text
rank_U(Y1, Y2) != rank_U_hat(Y1, Y2)
```

就存在规格失配。

### 11.3 诊断问题

```text
Are we optimizing the right target?
```

### 11.4 典型症状

```text
The output satisfies the written prompt but disappoints the real user need.
The benchmark score improves while semantic quality does not.
The system learns to satisfy a rubric without solving the task.
The verifier accepts artifacts that humans reject for substantive reasons.
The model gives safe, polished, or comprehensive answers when the actual utility demands specificity, risk, or action.
Counterexamples reveal missing criteria in the original prompt. 
```

### 11.5 主要修复目标

```text
objective clarification
rubric revision
counterexample-driven specification repair
proxy-risk audit
success-condition extraction
human preference elicitation
verifier hierarchy
scope and non-goal declaration
```

### 11.6 治理模板

```json
{
  "type": "objective_rule",
  "condition": "Accessible proxy U_hat diverges from task utility U in cases C.",
  "assertion": "Revise evaluation criterion to include distinction D and reject proxy-only success.",
  "evidence": "Counterexample Y shows U_hat accepts what U rejects.",
  "revocation_trigger": "New verifier aligns proxy ranking with utility across representative cases."
}
```

### 11.7 与审计失败的边界

失败的审计可能揭示规格失配，但审计失败本身不是原始失配。审计是修复机制；规格失配是审计可能发现的目标层原因。

---

## 12. 差异诊断表

| 如果失败在于... | 主要诊断为... | 问... | 修复方式... |
|---|---|---|---|
| 决定性事实、变量、schema 元素、日志、值或测量缺失或被压缩掉。 | 观测-表征 | 变量进入 Z 了吗？ | 修通道或表征。 |
| 同一表征支持多个隐藏体制，且正确行动不同。 | 状态 | 我们处于哪个状态？ | 追踪、判别、分支、澄清。 |
| 模型有能力但在错误条件激活。 | 拟合边界 | 正确能力被路由了吗？ | 治理触发边界。 |
| 正确结构很少作为候选出现。 | 支持 | 结构可达吗？ | 搜索控制空间；扩展候选。 |
| 好的局部片段组合后失败。 | 聚合 | parts 能组合吗？ | 治理依赖和不变量。 |
| 系统优化错误 metric、rubric 或 proxy。 | 规格 | 目标正确吗？ | 修目标和验证器。 |

实用规则：

```text
If the answer could not possibly be right because needed information was absent, start with observation-representation.
If the answer could be right in one hidden regime but wrong in another, start with state.
If the needed operation is known but not invoked, start with fitting-boundary.
If the needed structure is never proposed, start with support.
If the pieces are good but the whole is bad, start with aggregation.
If the system succeeds by its criterion but fails the real task, start with specification.
```

---

## 13. 六类失配的相对完备性

taxonomy 的完备性主张是相对的，不是绝对的。

它不声称每个可能系统中的每个计算失败都被六类耗尽。它声称，在价值保存管线下，所有原始的任务价值丢失方式都对应这些站点。

### 13.1 完备性陈述

对被建模为：

```text
S_world -> O -> Z -> C -> K -> Y -> U_hat
```

且存在真实效用 `U` 的 LLM 系统，任何价值保存失败必须至少涉及以下之一：

1. `S_world` 中价值相关区分未保存到 `Z`。
2. 价值相关潜在状态无法从 `Z` 识别。
3. 价值相关能力未在真实领域内激活，或在真实领域外激活。
4. 价值相关结构在候选生成过程中不可达或不成为活候选。
5. 候选 parts 之间的价值相关关系未被聚合保存。
6. 可访问评价标准未保存真实效用诱导的排序。

这些正是六类原始失配。

### 13.2 为什么该主张有边界

该主张有意受限于抽象。它不否认：

```text
hardware failures
latency failures
security breaches
bad user behavior
implementation bugs
organizational process failures
```

但当这些失败因为扭曲 LLM 管线中的任务价值而重要时，它们通常通过一种或多种原始失配显现。例如，日志 bug 可能成为观测-表征失配；工具超时若阻碍候选生成，则可能成为支持失配；陈旧缓存若误表征当前状态，则可能成为状态失配。

### 13.3 为什么复合失败不反驳完备性

大多数真实失败是复合的。一个 text-to-SQL 失败可能同时涉及缺失 schema values、错误状态假设、低支持 joins、局部 clause 不一致和 benchmark proxy 问题。这不反驳 taxonomy，而确认原始失败会组合。

taxonomy 不要求每个失败只能贴一个标签。它是一个分解基。

### 13.4 完备性主张的前馈边界

这一完备性主张是前馈的，而不是完全动态的。

```text
它适用于单次前向过程：
S_world -> O -> Z -> C -> K -> Y -> U_hat
```

跨轮反馈、振荡、重试回路、状态累积和提交动力学都属于运行时现象。它们在已部署系统中非常重要，但应由 SGAR 及相关运行时对象治理，而不是被视为本 taxonomy 中额外的 primitive 站点。

---

## 14. 六类失配的独立性

独立性主张是操作性的：

```text
Each mismatch can be varied while holding the others approximately fixed, and each variation requires a distinct repair target.
```

### 14.1 观测-表征最小对

两个系统使用同一模型、prompt、搜索流程、目标和聚合方式。一个收到包含决定性列和样本值的 schema，另一个收到省略这些内容的压缩 schema。

若只有前者能完成任务，失败不是状态、支持、聚合、路由或目标，而是变量进入。

### 14.2 状态最小对

两个系统收到同样变量，但一个收到状态消歧信号，另一个没有。正确行动随状态变化。

如果歧义本身导致失败，失配就是状态。

### 14.3 拟合边界最小对

两个系统拥有同样能力和信息。一个系统的触发证据激活所需能力；另一个由误导表面线索激活错误能力或抑制正确能力。

若仅改变路由即可修复失败，失配就是拟合边界。

### 14.4 支持最小对

两个系统共享观测、状态、路由、目标和聚合。一个只搜索最终输出空间；另一个搜索包含高价值结构的中间控制空间。

若只有可达性改变成功，失配就是支持。

### 14.5 聚合最小对

两个系统有相同信息、状态、路由、支持和目标。一个用全局依赖约束组合 parts；另一个局部组合。

若局部片段类似但受约束组合成功，失配就是聚合。

### 14.6 规格最小对

两个系统有相同输入、能力、候选集和组合流程。一个在接受 `Y1` 的代理下评价；另一个在真实效用或更好 rubric 下偏好 `Y2`。

若仅 ranking criterion 改变选择，失配就是规格。

---

## 15. 复合失配

复合失配是多个原始失配在同一次失败中相互作用。

高价值任务中，复合失配是常态。taxonomy 有用，正因为它让我们能分解它们。

### 15.1 常见复合模式

#### 15.1.1 观测-规格复合

系统缺少评价真实目标所需变量。因此，代理目标变得虚假地有吸引力。

```text
A summarizer lacks access to the user's actual decision context, so it optimizes for generic completeness rather than decision usefulness.
```

修复需要同时修通道和修目标。

#### 15.1.2 状态-路由复合

系统错判状态，因此路由到错误能力。

```text
A debugging assistant treats a failure as a syntax issue when the latent state is actually a race condition.
```

修复需要先状态判别，再路由修正。

#### 15.1.3 路由-支持复合

系统本可以搜索正确候选空间，但执行该搜索的能力没有激活。

```text
A text-to-SQL system uses direct SQL generation instead of join-path enumeration because schema-search capability is under-triggered.
```

修复需要路由治理和支持扩展。

#### 15.1.4 支持-聚合复合

正确 components 出现，但系统缺少能正确组合它们的机制。

```text
A code patch contains the right functions and checks, but places them in a sequence that violates transactional invariants.
```

修复需要控制空间搜索加组合不变量。

#### 15.1.5 聚合-规格复合

代理目标评分局部 sections 或 subtests，却漏掉全局 coherence 或 systemic risk。

```text
A report scores well section by section but fails to support a coherent decision.
```

修复需要全局目标标准和组合治理。

#### 15.1.6 观测-状态-规格复合

系统缺少决定性变量，无法识别状态，因此依赖通用目标。

```text
A medical or legal assistant receives an incomplete user narrative, cannot distinguish crucial regimes, and optimizes for generic helpfulness.
```

修复必须从上游开始；仅目标修订不足。

---

## 16. 修复算子耦合

原始失配强烈组合，是因为修复算子依赖其他站点。

令各站点有 fidelity coefficient：

```text
c_obs, c_state, c_route, c_support, c_agg, c_spec in [0, 1]
```

简单瓶颈模型会说：

```text
Success ~= product_i c_i
```

这捕捉了弱点复合，但不是最强现象。

更强现象是修复算子耦合。

令：

```text
R_obs     = channel / representation repair
R_state   = state discrimination repair
R_route   = routing repair
R_support = support expansion repair
R_agg     = aggregation repair
R_spec    = specification repair
```

`R_i` 的有效性可能被 `c_j` gating：

```text
Effect(R_i) = f_i(c_i; c_j, c_k, ...)
```

强情形中：

```text
d Success / d R_i -> 0 as c_j -> 0
```

例子：

```text
Specification repair is weak when decisive variables are absent from representation.
State repair is weak when observations alias the relevant states.
Routing repair is weak when the objective gives no criterion for capability applicability.
Support repair is weak when the right search capability is not triggered.
Aggregation repair is weak when high-value components never enter the candidate set.
Audit repair is weak when the verifier can only see a proxy objective.
```

这是超加性失败背后的结构机制。多个失配不只是增加错误。它们可能禁用彼此暴露、定位或修复所需的流程。

---

## 17. 诊断流程

以下流程面向审计工程和知识治理。

### 17.1 第一步：识别价值失败

从具体失败开始：

```text
What output or action was produced?
Why was it low-value under the real task?
What would have made it high-value?
```

不要从模型解释开始，而要从任务价值缺口开始。

### 17.2 第二步：问决定性变量是否被表征

```text
Was the information required to distinguish good from bad present in Z?
```

如果否，先诊断观测-表征失配。

### 17.3 第三步：问正确状态是否被识别

```text
Could the same representation correspond to multiple states requiring different actions?
```

如果是，诊断状态失配。

### 17.4 第四步：问正确能力是否被激活

```text
Did the system invoke the procedure that a competent designer would have used?
```

如果能力存在但未触发，诊断拟合边界失配。

### 17.5 第五步：问正确结构是否成为候选

```text
Was a high-value candidate present in the candidate set?
```

如果否，诊断支持失配。

### 17.6 第六步：问局部 parts 是否组合

```text
Were the parts individually plausible but jointly wrong?
```

如果是，诊断聚合失配。

### 17.7 第七步：问目标是否正确

```text
Did the system optimize an accessible proxy that diverged from true utility?
```

如果是，诊断规格失配。

### 17.8 第八步：记录复合结构

多数严重失败涉及多个失配。记录依赖顺序：

```text
primary upstream mismatch
secondary downstream mismatch
repair operator disabled by upstream mismatch
required repair sequence
```

有用的审计输出不是单一标签，而是因果修复图。

---

## 18. 从失配映射到审计发现

Audit Finding 应命名 mismatch type 和 repair target。

| 失配 | Finding pattern | Evidence pattern | Repair target |
|---|---|---|---|
| 观测-表征 | Missing or aliased decisive variable | Failure disappears when variable is supplied | Channel / representation |
| 状态 | Wrong latent regime assumed | Alternative state explains failure | State discriminator / branch |
| 拟合边界 | Wrong capability activated or right one suppressed | Capability works when explicitly requested | Router rule |
| 支持 | Correct structure absent from candidates | Search variants repeat same flawed pattern | Candidate expansion / control-space search |
| 聚合 | Local components conflict globally | Cross-part invariant violated | Composition rule |
| 规格 | Proxy accepts low-utility artifact | Counterexample separates proxy from utility | Rubric / verifier / objective |

最小 Audit Finding 应包含：

```json
{
  "finding": "localized defect statement",
  "mismatch_type": "one or more primitive mismatches",
  "evidence": "specific artifact evidence",
  "repair_target": "which system station must change",
  "control_delta": "proposed change",
  "regression_guard": "how recurrence will be detected"
}
```

---

## 19. 从失配映射到控制增量

Control Delta 是受治理修复的写回单元。

| 失配 | Control Delta Type | 示例 |
|---|---|---|
| 观测-表征 | Add required variable, channel, field, retrieval query, tool call, schema element | SQL predicate generation 前要求 sample values |
| 状态 | Add state hypothesis, discriminator, clarification branch, belief update | 追踪用户要 exploration 还是 final answer |
| 拟合边界 | Add routing trigger, suppression rule, capability applicability test | 当问题涉及多个 entities 时激活 join-path search |
| 支持 | Add candidate enumeration, control-space search, low-support expansion | SQL rendering 前枚举 schema subgraphs |
| 聚合 | Add invariant, dependency graph, integration check | 验证所有 report claims 支持 final recommendation |
| 规格 | Add or revise rubric, verifier, success condition, proxy limitation | 拒绝满足格式但不满足 decision usefulness 的答案 |

关键纪律：

```text
Do not write back a prompt patch when the failure requires a channel repair.
Do not write back a rubric patch when the failure requires router correction.
Do not write back a reranking patch when the high-value candidate never appears.
```

---

## 20. 从失配映射到 GKO

每类原始失配都有对应的受治理知识对象族。

| 失配 | GKO family |
|---|---|
| 观测-表征 | Channel Rule, Required Variable, Representation Schema, Measurement Requirement |
| 状态 | State Hypothesis, State Discriminator, Branch Policy, Transition Assumption |
| 拟合边界 | Routing Rule, Trigger Boundary, Capability Applicability Constraint, Suppression Rule |
| 支持 | Support Expansion Rule, Candidate Enumeration Rule, Search-Space Constraint |
| 聚合 | Composition Invariant, Dependency Graph, Cross-Part Constraint, Integration Check |
| 规格 | Objective Rule, Rubric Item, Proxy Limitation, Success Condition, Counterexample |

GKO 应始终包含：

```text
condition
assertion
strength
priority
evidence
lifespan
revocation_trigger
not_supported_claims
```

撤销触发器尤其重要。许多 LLM 系统失败来自 support conditions 已过期的不朽指令。

---

## 21. 从失配映射到回归护栏

Regression Guard 防止已修复失败族静默返回。

| 失配 | Regression guard form |
|---|---|
| 观测-表征 | 移除变量 V，并确认系统阻断下游推理或请求它。 |
| 状态 | 提供歧义状态案例，并确认系统分支或请求判别证据。 |
| 拟合边界 | 提供边界案例，并确认正确激活 / 抑制。 |
| 支持 | 提供低支持案例，并确认候选扩展抵达所需结构。 |
| 聚合 | 重新引入 local-good/global-bad artifact，并确认 invariant check 失败。 |
| 规格 | 重新引入 proxy-satisfying/utility-failing artifact，并确认 verifier 拒绝。 |

护栏只有在代表性缺陷让它失败时才有牙齿。

```text
If the defect can return and the guard stays green, the guard is theater.
```

---

## 22. 从失配映射到 SGAR

长程系统中，mismatch repairs 往往必须成为硬状态转移。

| 失配 | SGAR commitment question |
|---|---|
| 观测-表征 | 所需变量是否真的被观测并提交？ |
| 状态 | 状态假设是否被验证、拒绝或保持开放？ |
| 拟合边界 | 路由规则是否被更新并定界？ |
| 支持 | 候选扩展步骤是否完成并记录？ |
| 聚合 | 全局 invariant check 是否通过？ |
| 规格 | 修订目标是否带作用域和撤销条件被提交？ |

修复不是因为模型说它考虑过就完成。只有相关状态转移被提交，它才完成：

```text
S + A -> O -> V -> S'
```

例子：

```text
S: schema values unknown
A: query sample values for candidate columns
O: values retrieved
V: values parsed and linked to predicates
S': value-linking representation committed
```

---

## 23. Text-to-SQL 示例

Text-to-SQL 展示全部六类原始失配。

### 23.1 观测-表征

数据库 schema、foreign keys、column meanings、sample values 和 data distributions 必须进入操作表征。如果 prompt 省略 sample values，模型可能选择 plausible 但错误 predicates。

修复：

```text
schema extraction
sample value retrieval
foreign-key graph construction
column description normalization
```

### 23.2 状态

自然语言问题可能依赖潜在 intent 或数据库内容。一个术语可能指 column value、category、metric 或 derived relation。

修复：

```text
state hypotheses for intent
value-grounding checks
branching SQL skeletons
```

### 23.3 拟合边界

模型可能过触发记忆化 SQL templates，欠触发 schema audit 或 join-path search。

修复：

```text
activate schema-linking when question references entities
activate join search when multiple tables are implicated
suppress direct SQL rendering until control objects are available
```

### 23.4 支持

正确 join path 或 nested query 可能在直接生成下低支持。

修复：

```text
enumerate schema subgraphs
beam over join paths
generate predicate skeletons before final SQL
```

### 23.5 聚合

每个 clause 可能局部 plausible，而完整 SQL 是错的。

修复：

```text
cross-check SELECT/JOIN/WHERE/GROUP/HAVING consistency
execute intermediate candidates
validate result shape and semantics
```

### 23.6 规格

执行准确、exact match、语义正确和用户意图可能相互偏离。

修复：

```text
distinguish executable from semantically correct
use execution feedback as authority but not as sole objective
record counterexamples where execution success hides semantic mismatch
```

Text-to-SQL 展示核心转换：

```text
direct final SQL generation
  -> schema control space
  -> join-path control
  -> value binding
  -> predicate skeleton
  -> execution audit
  -> governed rendering
```

---

## 24. 代码合成示例

代码生成系统可能以全部六种方式失败。

| 失配 | 代码合成示例 |
|---|---|
| 观测-表征 | 相关文件、依赖、测试、API contract 或 runtime log 缺失。 |
| 状态 | 代码库处于 latent migration、concurrency 或 compatibility regime。 |
| 拟合边界 | 模型在需要 architecture refactor reasoning 时使用 local patching。 |
| 支持 | 正确设计是 direct patch generation 未抵达的低支持 pattern。 |
| 聚合 | 单个 edits 可编译，但共同破坏 invariants。 |
| 规格 | 测试奖励 passing current cases，却漏掉真实 behavioral contract。 |

如果失败在上游，修复序列不应从“再生成一个 patch”开始，而应从第一个有缺陷站点开始。

---

## 25. Research-Agent 示例

长程 research agent 也体现六类失配。

| 失配 | Research-agent manifestation |
|---|---|
| 观测-表征 | agent 缺少决定性 papers、notes、assumptions 或 prior decisions。 |
| 状态 | 项目状态不清楚：exploration、drafting、revision、rebuttal 或 synthesis。 |
| 拟合边界 | agent 过触发 summarization，欠触发 critical comparison。 |
| 支持 | Novel hypotheses 或 alternative framings 低支持。 |
| 聚合 | section-level quality 未形成 coherent paper。 |
| 规格 | agent 优化 polished prose，而不是 contribution clarity。 |

这里 SGAR 很关键，因为进展必须被提交。上下文摘要声称某 section 完成，并不等价于已验证状态转移。

---

## 26. 常见误诊

### 26.1 把观测失败误认为推理失败

如果决定性变量缺席，模型仍可能给出复杂解释。错误看起来像推理失败，但修复不是更多推理，而是变量进入。

### 26.2 把状态歧义误认为缺知识

模型可能知道所有相关事实，但不知道哪个体制适用。除非新事实能判别状态，否则添加更多事实未必有帮助。

### 26.3 把路由失败误认为能力缺失

模型在被明确要求时可能能执行所需操作。失败不是 capacity，而是 activation。

### 26.4 把支持失败误认为缺创造力

问题未必是一般创造力，而是高价值结构在当前搜索参数化下不可达。

### 26.5 把聚合失败误认为局部质量失败

如果依赖没有被治理，分别改进每个 part 可能让全局结构更差。

### 26.6 把规格失败误认为模型行为异常

系统可能准确优化了它被指示优化的东西。失败在 proxy。

---

## 27. 六类失配作为修复序列

虽然真实系统可能需要迭代，但默认修复优先级是从上游到下游：

```text
1. Observation-representation: ensure variables enter.
2. State: determine or preserve uncertainty over the regime.
3. Fitting-boundary: activate the right capabilities.
4. Support: make high-value structures reachable.
5. Aggregation: compose components under global constraints.
6. Specification: ensure the evaluator represents true utility.
```

规格在管线中最后出现，但实践中可在任何阶段考虑。目标修复常与审计共同演化。不过，如果变量缺席或状态未识别，目标修复自身可能被误导。

有用修复纪律：

```text
Do not optimize downstream stations until upstream preconditions are satisfied.
Do not commit a repair until its regression guard has teeth.
Do not promote a heuristic to a GKO without scope and revocation.
```

---

## 28. 失配画像

复杂任务可以用 mismatch profile 表示：

```json
{
  "observation_representation": "high",
  "state": "medium",
  "fitting_boundary": "high",
  "support": "high",
  "aggregation": "medium",
  "specification": "medium"
}
```

profile 不是 benchmark score，而是 repair-planning artifact。

高观测-表征失配任务，需要先通道治理，再输出搜索。

高支持失配任务，需要控制空间搜索。

高聚合失配任务，需要组合不变量。

高规格失配任务，需要目标治理和反例驱动 rubric 修复。

| Profile | Architecture implication |
|---|---|
| High observation-representation | Tool access, structured input, raw-data retrieval |
| High state | State tracker, clarifier, branch manager, SGAR |
| High fitting-boundary | Router governance, capability tests, role constraints |
| High support | Candidate expansion, control-space search, structured enumeration |
| High aggregation | Intermediate representations, dependency graphs, validators |
| High specification | Rubric governance, counterexamples, human review, verifier hierarchy |

---

## 29. 与局部对齐和 LLM 平庸的关系

LLM 平庸不等同于任何一种失配。它是在固定预算和搜索流程下，由一种或多种失配产生的体制。

局部对齐意味着：

```text
The model is useful on local operations.
Those local operations do not automatically preserve global task value.
```

六类失配解释为什么局部对齐无法自动变成全局成功：

```text
Observation-representation: local reasoning lacks decisive variables.
State: local answer assumes wrong regime.
Fitting-boundary: local capability activation is misrouted.
Support: local search never reaches high-value structure.
Aggregation: local improvements fail to compose.
Specification: local optimization targets wrong proxy.
```

从平庸到卓越的转换通过改变任务形态来修复：

```text
final-output generation
  -> governed control objects
  -> audit
  -> state commitment
  -> rendering
```

---

## 30. 这个分类法不主张什么

本文不主张：

```text
All failures are equally important.
Every failure has only one mismatch type.
Every mismatch can be diagnosed automatically.
Every task requires heavy governance.
The six mismatches are an absolute ontology beyond the pipeline abstraction.
The model itself is always the source of failure.
Prompting is useless.
Autoregressive generation is inherently mediocre.
```

本文主张：

```text
For LLM systems viewed as value-preservation pipelines, these six stations are the primitive places where task value is structurally lost.
Each station has distinct symptoms, repair targets, and governance objects.
Compound failures can be decomposed into interactions among these stations.
```

---

## 31. 分类法的撤销触发器

受治理理论应说明其主张何时应被削弱或修订。

### 31.1 相对完备性的撤销触发器

如果识别出一个结构上独立的管线站点，满足：

```text
1. is not reducible to observation, state, routing, support, aggregation, or specification;
2. produces task-value failures under the same pipeline abstraction;
3. requires a distinct repair target;
4. admits minimal pairs independent of the six current stations.
```

则相对完备性主张应被修订。

### 31.2 独立性的撤销触发器

如果某类原始失配的所有表面失败都可以还原为另一类失配且不损失干预特异性，则该失配应降级。

例如，如果所有路由失败都可完全作为支持、规格、状态、聚合或观测失败来修复，拟合边界失配就会失去原始地位。当前理论否认这一点，因为能力激活域是独立修复目标。

### 31.3 修复算子耦合的撤销触发器

如果复合失败通常可以通过相互独立的站点修复来修好，且各修复效果不依赖其他站点 fidelity，那么超加性耦合主张应被削弱。

当前理论预测，在高价值任务中这通常不成立。

### 31.4 原子性的撤销触发器

如果某个拟议细分满足以下条件，则 atomicity 主张应被削弱：

```text
1. 占据一个结构上不同的管线站点；
2. 承认独立于当前六类的最小对；
3. 要求一个不可再约化的不同修复目标；
4. 若将其还原为现有站点，就会失去干预特异性。
```

一旦这些条件成立，当前“六类”的计数就不再稳定。

---

## 32. 紧凑规范定义

### 32.1 观测-表征失配

```text
A failure in which task-decisive variables in S_world are lost, aliased, compressed, omitted, or made operationally inaccessible before entering Z.
```

### 32.2 状态失配

```text
A failure in which the correct policy depends on a latent state that is not identifiable under the available representation.
```

### 32.3 拟合边界失配

```text
A failure in which a learned capability's actual activation domain M_X differs from its true applicability domain T_X.
```

### 32.4 支持失配

```text
A failure in which high-value structures have insufficient probability mass or reachability under the system policy, search space, and budget.
```

### 32.5 聚合失配

```text
A failure in which locally valuable components do not compose into a globally valuable artifact.
```

### 32.6 规格失配

```text
A failure in which the accessible objective U_hat ranks candidates differently from true task utility U.
```

---

## 33. Appendix A: 完整失配卡片

### A.1 观测-表征卡片

```text
Station: S_world -> O -> Z
Question: Did decisive variables enter Z?
Failure: Variable absent, aliased, compressed, inaccessible.
Audit evidence: Supplying variable changes answer; system cannot cite variable.
Control delta: Add observation channel or representation field.
GKO: Required Variable / Channel Rule.
Regression guard: Remove variable and ensure system blocks or requests it.
SGAR state: Variable observed and committed.
```

### A.2 状态卡片

```text
Station: Z -> latent state
Question: Which state are we in?
Failure: Ambiguous or misranked latent regime.
Audit evidence: Alternative state explains defect; small discriminator flips action.
Control delta: Add state hypothesis and discriminator.
GKO: State Hypothesis / Branch Policy.
Regression guard: Ambiguous case requires branch or clarification.
SGAR state: State committed, rejected, or held open.
```

### A.3 拟合边界卡片

```text
Station: Z -> capability activation
Question: Was the right capability routed?
Failure: Over-trigger or under-trigger of learned behavior.
Audit evidence: Capability succeeds when explicitly invoked.
Control delta: Add trigger or suppression rule.
GKO: Routing Rule / Capability Boundary.
Regression guard: Boundary cases route correctly.
SGAR state: Router update committed with scope.
```

### A.4 支持卡片

```text
Station: policy and budget -> candidate set
Question: Is the high-value structure reachable?
Failure: Correct structure absent or pruned.
Audit evidence: More direct samples repeat flawed basin; structured enumeration finds candidate.
Control delta: Add control-space search or candidate expansion.
GKO: Support Expansion Rule.
Regression guard: Low-support case reaches required candidate.
SGAR state: Candidate expansion completed and recorded.
```

### A.5 聚合卡片

```text
Station: local components -> global artifact
Question: Do the parts compose?
Failure: Local-good/global-bad artifact.
Audit evidence: Cross-part invariant violation.
Control delta: Add dependency graph or composition invariant.
GKO: Composition Rule / Global Invariant.
Regression guard: Reintroduced invariant violation fails.
SGAR state: Global composition check passed.
```

### A.6 规格卡片

```text
Station: accessible objective vs true utility
Question: Are we optimizing the right target?
Failure: Proxy success / utility failure.
Audit evidence: Counterexample separates U_hat and U.
Control delta: Revise rubric, verifier, or success condition.
GKO: Objective Rule / Proxy Limitation.
Regression guard: Proxy-only success rejected.
SGAR state: Objective update committed with revocation trigger.
```

---

## 34. Appendix B: 诊断清单

失败审查时使用：

```text
[ ] What was the actual low-value outcome?
[ ] What true utility criterion did it fail?
[ ] Was the decisive variable present in the operational representation?
[ ] Were multiple latent states plausible?
[ ] Did the system activate the appropriate capability?
[ ] Did the correct structure appear among candidates?
[ ] Were local components globally consistent?
[ ] Did the evaluator or rubric match true utility?
[ ] Which mismatch was upstream?
[ ] Which repair operator was disabled by another mismatch?
[ ] What control delta follows?
[ ] What GKO or object must be updated?
[ ] What regression guard has teeth?
[ ] What hard-state transition commits the repair?
```

---

## 35. Appendix C: 规范审计发现模板

```json
{
  "id": "finding.example",
  "artifact": "candidate artifact or action sequence",
  "value_failure": "why the artifact failed true task utility",
  "mismatch_profile": {
    "observation_representation": "none | low | medium | high",
    "state": "none | low | medium | high",
    "fitting_boundary": "none | low | medium | high",
    "support": "none | low | medium | high",
    "aggregation": "none | low | medium | high",
    "specification": "none | low | medium | high"
  },
  "primary_mismatch": "one primitive mismatch",
  "compound_interactions": [
    "upstream mismatch disables repair operator for downstream mismatch"
  ],
  "evidence": [
    "specific artifact evidence"
  ],
  "repair_target": "channel | state | router | support | aggregation | objective | verifier | state_record",
  "control_delta": "specific proposed change",
  "gko_update": "object to add, revise, weaken, or revoke",
  "regression_guard": "guard that fails if defect recurs",
  "state_transition": "commitment required under SGAR"
}
```

---

## 36. Appendix D: 规范控制增量模板

```json
{
  "id": "delta.example",
  "source_finding": "finding.id",
  "target_station": "observation_representation | state | routing | support | aggregation | specification",
  "change_type": "add | revise | weaken | revoke | split | merge | escalate",
  "object_target": "GKO | GEO | Verifier | StateRecord | TransitionContract | RegressionGuard",
  "before": "current rule, object, or process",
  "after": "proposed revised rule, object, or process",
  "scope": "where the change applies",
  "risk": "possible adverse effects",
  "revocation_trigger": "condition for weakening or removing the delta",
  "required_guard": "regression guard id"
}
```

---

## 37. 结论

六类原始失配为诊断 LLM 系统失败提供结构基础。它们不是六个任意标签，而对应价值保存管线中的六个站点：

```text
observation / representation
state identification
capability routing
candidate support
local-to-global aggregation
objective specification
```

在该抽象下，这个 taxonomy 是相对完备的，因为这些是任务价值能被结构性丢失的原始位置。它在操作上独立，因为每个站点都能在其他站点近似不变时失败，并且每个站点都需要不同修复目标。

taxonomy 的实践价值不在于分类本身，而在于修复路由。诊断为观测-表征失配的失败不应靠更多采样修复。诊断为支持失配的失败不应只靠润色 rubric 修复。诊断为规格失配的失败不应靠局部流畅性改进修复。每类失配都指向不同控制增量、GKO family、回归护栏和硬状态提交。

最深的失败是复合的。多个失配通过修复算子耦合相互作用。一个站点的缺陷可能禁用修复另一个站点所需的操作。这解释了为什么一些 LLM 系统即使增加 prompt、critique、samples 或 self-reflection，仍然困在平庸中。

建设性响应是受治理转换。保存模型已局部对齐的能力，但把高失配最终输出任务转换为低失配控制对象。用作用域、证据、撤销、审计、回归和状态提交治理这些对象。在这种架构里，六类原始失配不只是失败理论，也是一张构建能保存任务价值的系统地图。
