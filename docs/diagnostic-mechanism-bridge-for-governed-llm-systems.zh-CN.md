# 面向受治理 LLM 系统的诊断-机制桥接

## 用八条干预机制轴统一六类原始价值保存失配

**工作稿 v0.1**  

---

## 目录

- [摘要](#摘要)
- [1. 目的与范围](#1-目的与范围)
- [2. 对同一系统的两种正交切法](#2-对同一系统的两种正交切法)
- [3. 在统一理论栈中的层位](#3-在统一理论栈中的层位)
- [4. 六类原始失配](#4-六类原始失配)
- [5. 八条机制轴](#5-八条机制轴)
- [6. 学习组件、系统组件与混合组件](#6-学习组件系统组件与混合组件)
- [7. 六乘八交叉映射矩阵](#7-六乘八交叉映射矩阵)
- [8. 诊断工作流](#8-诊断工作流)
- [9. 最小干预探针](#9-最小干预探针)
- [10. 作为治理对象的机制画像](#10-作为治理对象的机制画像)
- [11. 与审计工程的集成](#11-与审计工程的集成)
- [12. 对象模型集成](#12-对象模型集成)
- [13. 作为受治理机制层转移的 SGAR](#13-作为受治理机制层转移的-sgar)
- [14. 表征诱导的价值上限](#14-表征诱导的价值上限)
- [15. Agent 层治理与训练层修复](#15-agent-层治理与训练层修复)
- [16. 案例草图：Text-to-SQL](#16-案例草图text-to-sql)
- [17. 复合因果链](#17-复合因果链)
- [18. 反模式](#18-反模式)
- [19. 对理论栈的集成要求](#19-对理论栈的集成要求)
- [20. 压缩陈述](#20-压缩陈述)
- [Appendix A: 规范枚举](#appendix-a-规范枚举)
- [Appendix B: 最小干预探针模板](#appendix-b-最小干预探针模板)
- [Appendix C: 最小对象捆绑](#appendix-c-最小对象捆绑)

本文假设读者已经熟悉受治理 LLM 理论栈。全文中，“Agent 层”指推理时治理，“训练层”指被摊销进模型权重的改动。

---

## 摘要

受治理 LLM 系统的理论中包含两个互补的诊断层。第一层是 **六类原始失配分类法**：观测-表征失配、状态失配、拟合边界失配、支持失配、聚合失配和规格失配。这一层解释任务价值沿价值保存管线在哪些结构位置发生了丢失。它回答的问题是：**系统为什么会在任务价值意义上失败？**

第二层是 **形式化机制层**：规格 / 奖励、观测可得性、信念 / 表征、动态 / 世界模型、行动 / 接口、能力支持、能力路由，以及搜索 / 执行。这一层识别一个近似 LLM 决策系统中，在哪个组件层面可以解释或放大已经对象化的失败。它回答的问题是：**这个失败背后更像哪类组件机制问题？**

这两层不是彼此竞争的分类法，而是正交坐标系。六类原始失配是 **价值保存诊断轴**，也是任务侧工程入口；八条机制轴是 **派生的组件归因轴**。因此，一次失败至少应由四个字段来表示：

```text
mismatch_type ∈ six primitive mismatches
control_object ∈ task-specific governed object
mechanism_axis ∈ eight mechanism axes | unknown | not_operationalized
repair_layer  ∈ agent | training | hybrid
```

本文定义这两层之间的桥接关系。它引入一个六乘八的交叉映射矩阵、一个机制画像对象、一条修复层选择规则，以及一个从审计到训练的反馈闭环。它还澄清机制层与审计工程、受治理对象模型以及状态治理智能体范式（SGAR）之间的关系。结果是一个统一的诊断与修复架构：原始失配解释价值失败；机制画像定位修复；审计发现产出控制增量；受治理对象存储修复知识；SGAR 把已验证变化提交进硬状态；反复出现的学习组件失败则可被提升为训练课程。

修正后的中心句是：

```text
工程从原始失配进入；
形式化机制分析在对象完成可操作化之后跟进。
```

---

## 1. 目的与范围

现有的受治理 LLM 理论栈中，包含两套强大但容易混淆的形式系统：

```text
价值保存管线：
S_world → O → Z → routing → support → aggregation → evaluation

机制层决策模型：
E = (S, A, T, R*, Ω, O, γ)
M_θ = (R̂_θ, Ω_sys, B_θ, T̂_θ, A_sys, π_θ, r_θ, D)
```

第一套形式系统支撑六类原始失配。它描述系统从世界状态走到输出的过程中，任务价值在哪里流失。它首先是一个 **价值泄漏的诊断本体**。

第二套形式系统支撑八条机制轴。它把一个 LLM 系统拆成若干近似且可干预的组件。它首先是一个 **修复定位本体**。

如果没有显式桥接，整个理论很容易看起来像包含两套互不相干的分类系统：一处是六类原始失配，另一处是八条机制轴。本文要消除的正是这种歧义。

本文建立四个主张。

第一，这两层是正交关系，而不是冗余关系：

```text
六类原始失配 = 任务价值在何处结构性流失，以及工程应从哪里进入。
八条机制轴   = 该失败最终可能归属到哪个系统组件。
```

第二，一次失败可能只有一种原始失配诊断，却有多个机制成因。反过来，一个单一机制缺陷也可能表现为若干种原始失配症状。

第三，机制层是推理时治理与训练时改进之间缺失的桥梁。Agent 层修复处理局部、可逆、任务特定的失败。训练层修复处理反复出现、跨任务、可摊销的学习组件失败。

第四，这座桥应通过 `mismatch_type`、`control_object_ref`、`control_object_type`、`mechanism_axis`、`operationalization_status`、`repair_layer` 和 `mechanism_profile` 字段在对象模型中被形式化。

本文并不替代六类失配分类法、形式化机制层文档、对象模型规范、审计工程或 SGAR。它是把它们接成同一系统的布线层。

---

## 2. 对同一系统的两种正交切法

分析一个 LLM 系统失败，有两种正当方式。

### 2.1 价值保存切法

价值保存切法问的是：

```text
当系统从世界走向输出时，任务价值是在哪里泄漏或失真的？
```

这种切法会得到六类原始失配：

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

这些是 **诊断轴**。它们分类的是价值失败的形式。

例如，一个 Text-to-SQL 系统之所以失败，如果是因为相关外键从未进入它的操作性 schema 表征，那么失败就是观测-表征失配。如果正确的 join path 已经在表征中，但很少被生成，那么失败可能是支持失配。如果生成出的 SQL clauses 在局部都看似合理，但在整体上互不一致，那么失败就是聚合失配。

因此，六失配层回答的是：

```text
发生的是哪一种价值保存失败？
```

### 2.2 机制干预切法

机制干预切法问的是：

```text
系统的哪个组件应该被修复？
```

这种切法会得到八条机制轴：

```text
1. Specification / reward
2. Observation availability
3. Belief / representation
4. Dynamics / world model
5. Action / interface
6. Capability support / policy prior
7. Fitting boundary / capability routing
8. Search / execution
```

这些是 **修复定位轴**。它们分类的是需要被改变的组件。

例如，同一个 Text-to-SQL 失败，可能需要改变观测通道、schema 表征、SQL 能力支持、决定是否调用 join-path search 的路由器、执行引导的搜索过程，或评价 rubric。单靠原始失配本身，并不能决定这些组件里哪一个才是真正的修复目标。

因此，机制层回答的是：

```text
在任务对象已经明确之后，哪类组件机制被牵涉，以及它是否已经足够可操作化，值得直接修复或提升到训练？
```

### 2.3 桥接

这两种切法之间的桥接关系是：

```text
Failure
  → primitive mismatch diagnosis
  → task-specific control object
  → mechanism profile
  → mechanism axis
  → repair layer
  → control delta / training item / state transition
```

原始失配用价值语义解释失败。任务特定控制对象暴露真正要修改的对象。机制画像给出组件级归因。修复层则决定修复属于 Agent 层治理、训练层改进，还是二者的混合。

---

## 3. 在统一理论栈中的层位

桥接文档位于结构理论与修复系统之间。

```text
Layer 0: World-to-output value-preservation pipeline

Layer 1: Six Primitive Mismatches
  发生的是哪一种任务价值失败？

Layer 2: Task-Specific Control Objects
  应先构造或修订哪个受治理任务对象？

Layer 3: Formal Mechanism Layer
  是哪类系统组件机制在解释该任务对象上的失败？

Layer 4: Diagnostic-Mechanism Bridge
  一个价值诊断如何转化为对象修复、机制归因与修复层选择？

Layer 5: Knowledge Governance
  哪些控制对象应被诱导、修订、撤销或复用？

Layer 6: Audit Engineering
  失败如何被定位并写回控制空间？

Layer 7: Governed Object Model
  失配诊断、机制画像、控制增量和状态记录如何存储？

Layer 8: SGAR
  哪些修复、行动、验证结果与状态变化被形式提交？

Layer 9: Mechanism-Driven Training
  哪些反复出现且已操作化的学习组件失败应被提升为训练课程？
```

关键过渡是：

```text
primitive mismatch diagnosis
  → task-specific control object
  → mechanism localization
  → repair-layer selection
```

如果没有这个过渡，系统可能正确诊断出一次失败例如是支持失配，却仍然选错修法。它可能会在真正问题是能力路由时增加采样；在真正问题是行动接口缺失时增加检索；在决定性变量根本没进入表征时修改 rubric；或者在真正问题是应通过训练摊销的反复学习组件失败时，无限期地做 Agent 层补丁。

---

## 4. 六类原始失配

六类原始失配是价值保存诊断轴。它们来自世界到输出管线中结构上不同的站点。

| 原始失配 | 价值保存问题 | 典型诊断信号 |
|---|---|---|
| 观测-表征 | 决定性变量是否进入了操作表征？ | 系统在贫瘠或混叠的表征上流畅推理。 |
| 状态 | 相关潜在状态是否可识别并被保持？ | 系统把多个可能体制过早塌缩为单一解释。 |
| 拟合边界 | 正确能力是否在正确领域被激活？ | 模型拥有该能力，却过触发或欠触发。 |
| 支持 | 高价值结构是否成为活候选？ | 正确结构缺失、稀有、被剪枝，或与噪声不可区分。 |
| 聚合 | 局部好的部分能否组合成全局价值？ | 局部 clauses、步骤或 edits 看似合理，但全局不一致。 |
| 规格 | 可访问目标是否代表真实效用？ | 系统优化了一个会把候选排错序的 rubric、指标、prompt 或代理。 |

六类失配解释的是价值失败的形式，也逼出第一个工程问题：应当先构造哪个治理对象，才能让这个失败变成可审计、可修改、可写回的对象。

---

## 5. 八条机制轴

八条机制轴是干预定位轴。它们识别一个近似 LLM 系统中应改变哪个组件。

| 机制轴 | 组件 | 核心问题 | 典型修复层 |
|---|---|---|---|
| Specification / reward | `R*`, `R_proxy`, `R̂_θ`, `R_eval` | 目标、代理、rubric、奖励模型或评价器是否错了？ | 混合 |
| Observation availability | `Ω`, `O` | 系统是否拿得到必要证据？ | Agent |
| Belief / representation | `B_θ` | 系统是否形成了正确的操作状态或表征？ | 训练，辅以 Agent 补丁 |
| Dynamics / world model | `T̂_θ` | 系统是否正确预测了行动后果？ | 训练，辅以 Agent 校准 |
| Action / interface | `A_sys` | 系统是否具备所需动作、工具、API、权限或接口？ | Agent |
| Capability support | `π_θ` | 模型 / 系统在预算内是否根本能产出所需结构？ | 训练，辅以 Agent 补丁 |
| Capability routing | `r_θ` | 正确能力是否在正确条件下被激活？ | 训练，辅以 Agent 补丁 |
| Search / execution | `D` | 推理时过程是否正确搜索、分支、执行、验证或回溯？ | Agent |

这八条轴不是八个新的原始价值失配。它们是在价值保存失配已经被诊断，并且已经通过任务特定控制对象被操作化之后，才使用的派生修复坐标。

---

## 6. 学习组件、系统组件与混合组件

机制层之所以特别重要，是因为它把学习组件与系统组件区分开来。

### 6.1 系统组件

系统组件主要在 Agent 层或系统层修复。它们包括：

```text
observation availability
action / interface
search / execution
specification 中的 R_eval / rubric 组件
```

这些组件通常通过增加工具、暴露数据、改变工作流、修改验证器、增加状态记录、调整搜索过程或修订运行时控制对象来改变。

例子：

```text
增加数据库执行访问
暴露日志
增加 schema 检查
增加回滚门
增加结构化状态表
更换验证器
扩大分支搜索
要求提交前先执行
```

### 6.2 学习组件

学习组件是内部的或由模型中介的能力。它们可以在 Agent 层暂时打补丁，但若该缺陷反复出现且跨任务，就可能需要训练修复。它们包括：

```text
belief / representation: B_θ
dynamics / world model: T̂_θ
capability support: π_θ
capability routing: r_θ
reward / proxy model: R̂_θ or R_proxy
```

Agent 层补丁的例子：

```text
RAG
few-shot examples
explicit state extraction
external memory
explicit router rules
mode switching
execution calibration
structured intermediate objects
```

训练层修复的例子：

```text
SFT on boundary cases
curriculum over state distinctions
execution-grounded training
reward-model correction
capability-specific data augmentation
router training
world-model grounding
representation-focused fine-tuning
```

### 6.3 修复层选择规则

修复层选择规则是：

```text
对局部、可逆、任务特定的失败，使用 Agent 层修复。
对反复出现、跨任务、可摊销的学习组件失败，使用训练层修复。
当 Agent 层治理需要立即提供安全或性能保障，而训练可以长期摊销缺陷时，使用混合修复。
```

更操作化地说：

```text
如果缺陷是一次性的、特定上下文的、可逆的，或与工具 / 接口相关：
  在 Agent 层修。

如果缺陷是反复出现的、跨任务的、能力层的、表征层的、世界模型层的、奖励层的，或路由层的：
  提升到训练层。

如果缺陷既紧急又反复：
  先在 Agent 层打补丁，再提升到训练。
```

这条规则把机制层连接到治理成本模型。Agent 层治理便宜、局部、可逆。训练修复昂贵，但可摊销。应落在哪一层，取决于复发性、作用域、成本、可逆性和预期未来价值。

---

## 7. 六乘八交叉映射矩阵

连接六类原始失配与八条机制轴的是一个交叉映射矩阵。

行是原始失配：任务价值在哪里泄漏。  
列是机制轴：哪个组件可能需要修。

图例：

```text
● = 主要或常见机制来源
○ = 次要、放大器或下游机制来源
blank = 通常不是主要修复目标，但可能存在例外
```

| 六类原始失配 \ 八条机制轴 | Specification / reward | Observation availability | Belief / representation | Dynamics / world model | Action / interface | Capability support | Capability routing | Search / execution |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Observation-representation |  | ● | ● |  | ○ |  |  |  |
| State |  | ○ | ● | ●/○ |  |  |  | ○ |
| Fitting-boundary |  |  |  |  |  | ○ | ● | ○ |
| Support |  | ○ |  |  | ○ | ● | ○ | ●/○ |
| Aggregation |  |  | ● | ○ |  | ○ | ○ | ● |
| Specification | ● | ○ | ○ |  |  |  |  |  |

这个矩阵是一张启发式诊断图，而不是一张本体等同图。它不声称某一原始失配总是来自同一个机制。它说的是：首先应当到哪里去看。

### 7.1 为什么信念 / 表征是一个枢纽

`belief / representation` 机制是一个枢纽。观测-表征、状态、聚合，甚至某些规格失败，都取决于系统是否形成了可用的操作表征。

这很重要，因为 `B_θ` 是一个学习组件。如果信念 / 表征失败跨任务反复出现，Agent 层补丁就可能变成跑步机。缺陷可能需要被提升到面向表征的训练、课程设计或模型专门化。

### 7.2 为什么世界模型与行动接口需要机制层

`Dynamics / world model` 和 `action / interface` 之所以不呈现为一一对应的原始价值失配，是因为它们并不是同样意义上的价值泄漏站点。它们是闭环机制组件。它们的失败常常通过状态、支持、聚合、观测-表征，或 SGAR 转移失败表现出来。

例如：

```text
世界模型缺陷：
  模型预测某次 API 调用、代码补丁、SQL 查询、市场动作或工作流步骤会产生一种效果，
  但真实环境产生的是另一种效果。

行动接口缺陷：
  正确动作不可用、没有权限、无法通过工具 schema 表达、不可逆，
  或没有连到验证器。
```

原始失配层用价值保存语言诊断症状。机制层则区分：底层修复目标究竟是错误的世界模型、缺失的行动接口、不足的搜索，还是别的组件。

### 7.3 为什么规格和能力路由接近对角线

规格失配与拟合边界失配，往往接近于它们各自对应的机制轴。

```text
Specification mismatch ↔ specification / reward
Fitting-boundary mismatch ↔ capability routing
```

这使它们成为特别适合做最小干预探针的干净案例。如果改变 rubric 或目标就能修好失败，那么规格机制很可能是主因。如果改变能力触发条件就能修好失败，那么能力路由很可能是主因。

然而，即便这些案例也可能是复合的。一个规格失败可能源自缺失的利益相关方观测。一个路由失败也可能源自薄弱的能力支持。矩阵用于指导诊断，而不是取代诊断。

---

## 8. 诊断工作流

这座桥支持一个五步诊断工作流。

### 第 1 步：诊断原始失配

问：

```text
价值是在世界到输出管线的哪里泄漏的？
```

可能答案：

```text
observation_representation
state
fitting_boundary
support
aggregation
specification
compound
```

这一步用价值语义解释失败。

### 第 2 步：定位机制

问：

```text
是哪个系统组件造成了、放大了，或没有修复这一失配？
```

可能答案：

```text
specification_reward
observation_availability
belief_representation
dynamics_world_model
action_interface
capability_support
capability_routing
search_execution
```

这一步识别修复目标。

### 第 3 步：赋予机制角色

一个机制可以承担不同因果角色：

```text
primary    = 主要瓶颈或根修复目标
amplifier  = 放大了失败，但不是根因
downstream = 由另一机制缺陷导致的症状
unknown    = 证据不足
```

例如，一个支持失败可能是一个路由失败的下游症状。正确结构之所以没有出现，是因为能生成它的能力根本没有被激活。

### 第 4 步：选择修复层

问：

```text
这应当在 Agent 层修、在训练层修，还是两者都修？
```

使用修复层选择规则：

```text
agent    = 局部、可逆、任务特定、接口 / 工具 / 工作流 / 搜索 / 验证器修复
training = 反复出现、跨任务、可摊销的学习组件修复
hybrid   = 立即的 Agent 补丁 + 更长期的训练修复
```

### 第 5 步：写回受治理对象

诊断不应只停留为文字解释，而应写入对象系统：

```text
Audit Finding
  → Mechanism Profile
  → Control Delta
  → Regression Guard
  → Defect Ledger
  → State Transition or Training Item
```

因此，诊断的输出不只是一个答案，而是一个持久的治理对象。

---

## 9. 最小干预探针

机制层应避免无根据的因果贴标签。一个机制画像只有被 **最小干预探针** 支撑时，才最有力。

最小干预探针是在尽可能局部地改变一个组件、并保持其他组件不变的前提下，观察失败是否按预测方式变化。

例子：

| 疑似机制 | 最小干预探针 |
|---|---|
| Specification / reward | 只替换或细化 rubric；观测、表征、模型和搜索都保持不变。 |
| Observation availability | 只补上缺失证据源；prompt、模型和目标都保持不变。 |
| Belief / representation | 只增加一个结构化状态表、绑定表、时间线或 schema 表征。 |
| Dynamics / world model | 增加执行反馈，或增加一个 predict-execute-compare 循环。 |
| Action / interface | 只增加缺失的工具 / API / 动作 / 权限，或暴露必要接口。 |
| Capability support | 增加能力样例、专门算子、专家模型，或领域特定生成支持。 |
| Capability routing | 增加一条路由规则、触发边界、模式切换或角色分离。 |
| Search / execution | 增加分支、回溯、候选排序、验证器调用，或执行引导搜索。 |

最小干预探针不是通常意义上的 benchmark 实验。它们是因果性的修复定位探针。其目的是确定：哪个修复目标要为观察到的失败负责。

### 9.1 探针结果

一个探针可能产生若干种结果：

```text
resolved
  该干预修复了失败。该机制很可能是主因。

partially_resolved
  该干预改善了失败，但仍留下另一个瓶颈。该机制很可能是放大器，或复合链中的一环。

unchanged
  该干预没有影响失败。该机制很可能不是主因，或探针太弱。

worse
  该干预暴露出另一类失败，或引入了治理诱导错误。
```

### 9.2 主因、放大器与下游症状

一种常见诊断错误，是把最显眼的失败当作根因。

例子：

```text
Observed symptom:
  Correct SQL join path never appears.

Primitive mismatch:
  Support mismatch.

Possible mechanism profile:
  capability_routing = primary
  search_execution = amplifier
  capability_support = unknown

Interpretation:
  The correct join path did not appear because the schema-audit capability never activated.
  Merely increasing search budget may amplify cost without repairing the root cause.
```

机制画像应把根修复目标与下游症状区分开来。

---

## 10. 作为治理对象的机制画像

**机制画像**（Mechanism Profile）是连接原始失配诊断与修复行动的对象。

### 10.1 最小 Schema

```json
{
  "id": "mechanism_profile.unique_id",
  "failure_instance": "artifact, run, task, or defect being diagnosed",
  "primitive_mismatch": [
    "observation_representation",
    "state",
    "fitting_boundary",
    "support",
    "aggregation",
    "specification"
  ],
  "mechanism_scores": {
    "specification_reward": "low | medium | high | unknown",
    "observation_availability": "low | medium | high | unknown",
    "belief_representation": "low | medium | high | unknown",
    "dynamics_world_model": "low | medium | high | unknown",
    "action_interface": "low | medium | high | unknown",
    "capability_support": "low | medium | high | unknown",
    "capability_routing": "low | medium | high | unknown",
    "search_execution": "low | medium | high | unknown"
  },
  "primary_mechanism": "one of the eight mechanism axes",
  "secondary_mechanisms": ["zero or more mechanism axes"],
  "repair_layer": "agent | training | hybrid",
  "minimal_intervention_probe": "probe used or proposed",
  "probe_result": "resolved | partially_resolved | unchanged | worse | not_run",
  "remaining_bottleneck": "what still appears to block repair",
  "recommended_control_delta": "localized change to system control structure",
  "recommended_training_item": "optional training-side item if repair_layer includes training",
  "evidence": "specific evidence supporting the profile",
  "confidence": "low | medium | high"
}
```

### 10.1.1 可操作化门槛

只有当以下五个条件同时满足时，机制轴才应被当作直接 repair target：

```text
1. Observable symptom
   该机制失败能在任务行为中被观察到。

2. Task-specific control object
   已存在承载修复的具体治理对象。

3. Intervention operator
   已知如何修改该对象或组件。

4. Success / failure signal
   能判断修复是否有效。

5. Regression guard
   同类失败复发时可以被可靠捕获。
```

如果上述条件不满足，应记录：

```text
mechanism_axis = suspected axis
operationalization_status = not_operationalized
```

而不是把抽象机制名直接写成运行时修复对象。

### 10.2 与 Audit Finding 的关系

一个 Audit Finding 应包含或引用一个 Mechanism Profile。

```json
{
  "id": "finding.unique_id",
  "finding": "localized defect statement",
  "evidence": "specific evidence for the defect",
  "mismatch_type": "observation_representation | state | fitting_boundary | support | aggregation | specification | compound",
  "control_object_ref": "object.id",
  "control_object_type": "sql_dag | claim_evidence_map | state_table | router_rule | rubric | other",
  "mechanism_profile": "mechanism_profile.unique_id",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "mechanism_role": "primary | amplifier | downstream | unknown",
  "repair_layer": "agent | training | hybrid",
  "control_delta": "control_delta.unique_id",
  "regression_guard": "regression_guard.unique_id",
  "confidence": "low | medium | high"
}
```

这可以防止审计工程从症状直接跳到抽象机制名。审计必须先诊断价值失败，识别要改的任务对象，再定位机制，然后才写出控制增量。

### 10.3 与 Control Delta 的关系

Control Delta 应首先面向受治理任务对象，并把机制轴记录为归因。

```json
{
  "id": "control_delta.unique_id",
  "source_finding": "finding.unique_id",
  "target_object_ref": "object.id",
  "target_object_type": "sql_dag | claim_evidence_map | state_table | router_rule | rubric | other",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "target_layer": "agent | training | hybrid",
  "delta_type": "SpecificationDelta | ObservationDelta | BeliefRepresentationDelta | DynamicsWorldModelDelta | ActionInterfaceDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SearchExecutionDelta",
  "change": "specific change to be applied",
  "scope": "single-task | session | project | system | training-corpus",
  "reversibility": "reversible | partially_reversible | irreversible",
  "verification": "how the delta is verified",
  "revocation_trigger": "when this delta should be reverted or revised"
}
```

### 10.4 Delta 类型

| Delta 类型 | 目标机制 | 典型变化 |
|---|---|---|
| SpecificationDelta | Specification / reward | 修改 rubric、成功标准、评价器、奖励代理或验收阈值。 |
| ObservationDelta | Observation availability | 增加数据源、日志、文件、数据库查询、澄清、时间戳或覆盖记录。 |
| BeliefRepresentationDelta | Belief / representation | 增加状态表、schema 图、实体绑定、时间线、memory slot 或约束抽取。 |
| DynamicsWorldModelDelta | Dynamics / world model | 增加执行反馈、测试、sandbox、回测或 predict-execute-compare 循环。 |
| ActionInterfaceDelta | Action / interface | 增加工具、API、权限、动作 schema、回滚、重试路径或人工升级。 |
| CapabilitySupportDelta | Capability support | 增加样例、RAG、专家模块、领域算子、模型专门化或课程项。 |
| CapabilityRoutingDelta | Capability routing | 增加模式切换、触发规则、路由边界、角色分离或适用性测试。 |
| SearchExecutionDelta | Search / execution | 增加分支、回溯、beam search、验证器调用、重排或执行引导搜索。 |

---

## 11. 与审计工程的集成

这座桥会修改审计工程循环。

旧循环是：

```text
Candidate artifact
  → audit
  → failure localization
  → control delta
  → regression guard
```

桥接后的循环是：

```text
Candidate artifact
  → Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Minimal Intervention Probe
  → Control Delta
  → Regression Guard
  → Defect Ledger
  → State Transition or Training Item
```

这很重要，因为同一种原始失配可能需要完全不同的修法。

### 11.1 例子：支持失配

一个支持失配可能来自多种机制：

```text
capability_support:
  模型在当前能力下根本产不出所需结构。

capability_routing:
  模型能产出它，但所需能力没有被激活。

search_execution:
  候选其实存在，但搜索没有分支、保留或正确排序它。

action_interface:
  该候选依赖一个系统当前没有的工具或动作。

observation_availability:
  必要证据缺失，因此该候选根本构造不出来。
```

原始诊断相同，但控制增量不同。

### 11.2 例子：聚合失配

一个聚合失配可能需要：

```text
belief_representation repair:
  构造一个中间依赖图。

search_execution repair:
  增加全局一致性检查或回溯。

capability_routing repair:
  在局部生成之后激活审计能力。

capability_support repair:
  增加结构化组合支持。

world_model repair:
  如果组合依赖真实环境后果，则增加执行反馈。
```

再次强调，仅有价值症状本身还不够。真正决定修复路径的是机制定位。

---

## 12. 对象模型集成

受治理 LLM 对象模型应把以下字段视为规范 enum。

### 12.1 `mismatch_type`

```text
observation_representation
state
fitting_boundary
support
aggregation
specification
compound
unknown
```

这个字段属于原始失配层。

### 12.2 `control_object_type`

```text
sql_dag
claim_evidence_map
state_table
router_rule
rubric
schema_view
value_binding_table
dependency_graph
other
```

这个字段属于任务对象层。

### 12.3 `mechanism_axis`

```text
specification_reward
observation_availability
belief_representation
dynamics_world_model
action_interface
capability_support
capability_routing
search_execution
unknown
not_operationalized
```

这个字段属于机制层。

### 12.4 `operationalization_status`

```text
direct
derived
partial
not_operationalized
```

这个字段记录机制轴当前是否已足够可操作化，可以成为直接修复目标。

### 12.5 `repair_layer`

```text
agent
training
hybrid
unknown
```

这个字段属于修复层选择系统。

### 12.6 `mechanism_role`

```text
primary
amplifier
downstream
unknown
```

这个字段用于描述复合失败链中的因果角色。

### 12.7 规范桥接版 Audit Finding

```json
{
  "id": "finding.sql.join_path_001",
  "artifact": "candidate SQL query",
  "finding": "The query uses a locally plausible join path that cannot produce the requested entity relation.",
  "evidence": "Execution result is empty; schema graph shows required relation through table X rather than table Y.",
  "mismatch_type": "aggregation",
  "control_object_ref": "sql_dag.join_path_001",
  "control_object_type": "sql_dag",
  "mechanism_axis": "belief_representation",
  "operationalization_status": "direct",
  "mechanism_role": "primary",
  "repair_layer": "agent",
  "mechanism_profile": "mechanism_profile.sql.join_path_001",
  "control_delta": "control_delta.add_schema_graph_join_constraint",
  "regression_guard": "regression_guard.join_path_relation_check",
  "confidence": "high"
}
```

### 12.8 规范训练提升版 Finding

```json
{
  "id": "finding.router.boundary_017",
  "artifact": "multi-domain reasoning trace",
  "finding": "The model repeatedly fails to activate schema-audit mode when surface lexical overlap suggests a direct answer.",
  "evidence": "Observed across multiple databases and tasks; agent-level router rules repair the issue but must be reintroduced repeatedly.",
  "mismatch_type": "fitting_boundary",
  "control_object_ref": "router_rule.schema_audit_trigger",
  "control_object_type": "router_rule",
  "mechanism_axis": "capability_routing",
  "operationalization_status": "direct",
  "mechanism_role": "primary",
  "repair_layer": "training",
  "mechanism_profile": "mechanism_profile.router.schema_audit_undertrigger",
  "control_delta": "control_delta.runtime_router_patch",
  "recommended_training_item": "training_item.schema_audit_boundary_curriculum",
  "regression_guard": "regression_guard.schema_audit_trigger_minimal_pairs",
  "confidence": "medium"
}
```

---

## 13. 作为受治理机制层转移的 SGAR

SGAR 使用如下转移契约：

```text
S + A → O → V → S'
```

机制层为这一契约提供了决策系统解释：

```text
S  = 已提交的系统 / 环境状态
A  = 从 A_sys 中选出的动作
O  = 通过 Ω / O 产生的观测
V  = 使用 R_eval、转移准则和治理规则的验证器
S' = 已提交的下一状态
```

因此，SGAR 不只是某种 agent memory discipline。它是覆盖机制层转移的硬状态治理层。

### 13.1 八条机制轴作为转移失败模式

每一条机制轴，都可以被理解为受治理转移失败的一种方式。

| 机制轴 | 转移失败 |
|---|---|
| Specification / reward | `V` 依据了错误标准提交，或评估了错误目标。 |
| Observation availability | `O` 缺少验证该转移所需的证据。 |
| Belief / representation | `S` 或 `S'` 被错误表征。 |
| Dynamics / world model | 系统错误预测了 `A` 的后果。 |
| Action / interface | 所需的 `A` 不在 `A_sys` 中，或无法可靠执行。 |
| Capability support | 系统提不出可行的动作或状态更新。 |
| Capability routing | 转移所需能力没有被激活。 |
| Search / execution | 转移路径没有被正确搜索、执行、重试或验证。 |

### 13.2 SGAR 中的世界模型与行动接口

世界模型失败和行动接口失败在 SGAR 中尤其重要，因为它们决定了动作是否真的产生效果，以及这些效果能否被观测并提交。

例子：

```text
世界模型失配：
  agent 预测一个代码补丁会修好 bug，但测试失败。

行动接口失配：
  agent 建议检查数据库，却没有可执行的数据库查询动作。

SGAR 修复：
  增加执行反馈、工具访问、验证器门和转移规则，
  使系统不能在没有观察到效果的前提下提交所谓进展。
```

### 13.3 机制修复作为状态转移

机制修复本身也应当成为 SGAR 转移。

```text
S:
  No SQL execution verifier exists.

A:
  Add execution verifier to the system.

O:
  Verifier runs candidate SQL and returns result sets or error traces.

V:
  Verifier output is reproducible and attached to audit findings.

S':
  SQL execution feedback is now an authorized observation and verification channel.
```

这样可以防止机制修复停留为叙事。一个工具、验证器、路由器、rubric 或训练项，只有通过状态转移被提交，才成为真正的系统组成部分。

---

## 14. 表征诱导的价值上限

机制层也是一个形式化信息保持主张的自然落点。

### 14.1 命题：表征诱导的价值上限

令 `S` 为世界状态，`O` 为观测，`Z = ψ(O)` 为操作表征。令 `Π_X` 表示只能访问 `X` 的策略类，并令 `V_X = \max_{\pi \in \Pi_X}\mathbb{E}[\text{utility} \mid \pi]`。

则有：

```text
V_S ≥ V_O ≥ V_Z
```

也就是说，只能访问 `Z` 的最优策略，不可能优于只能访问 `O` 的最优策略；而只能访问 `O` 的最优策略，也不可能优于能直接访问 `S` 的最优策略。

如果存在两个与效用相关的状态 `s1` 和 `s2`，它们产生相同的操作表征：

```text
Z(s1) = Z(s2)
```

并且：

```text
argmax_a U(a | s1) ≠ argmax_a U(a | s2)
```

且这一情况以正概率发生，那么对于受影响的策略类，这个不等式就是严格的。

### 14.2 解释

这个命题说明：下游推理无法可靠恢复在表征之前已被折叠掉的区分。

它支持三个设计原则：

```text
1. 观测-表征修复先于下游推理修复。
2. 状态判别依赖足够的观测与表征。
3. 对同一个 Z 做更多搜索、更多批判或更多自我反思，都无法消除表征诱导的上限。
```

这个命题并不是说更丰富的表征总是值得其成本。它是一个上限主张：一旦决定性区分被压缩掉，下游策略就受限于这个被压缩后的表征。

---

## 15. Agent 层治理与训练层修复

这座桥为受治理 LLM 系统建立了一套训练侧原则。

当前治理机制主要发生在推理时。下表中的 `GKO` 指受治理知识对象（Governed Knowledge Object）：

```text
GKO
Audit Finding
Control Delta
Regression Guard
Defect Ledger
SGAR transition
```

这些都是 Agent 层对象。它们在运行时修系统。

然而，学习组件中的反复失败，不应永远停留为运行时补丁。它们应被提升为训练侧修复。

### 15.1 从审计到训练的闭环

这个闭环是：

```text
Agent-layer audit finds a failure
  → primitive mismatch diagnosis
  → mechanism profile
  → repair target is classified as system or learning component
  → system component: repair at agent layer
  → learning component: patch at agent layer if needed
  → recurrent learning-component defect enters defect ledger
  → defect ledger item becomes training curriculum / boundary data / reward correction
  → model improves
  → future governance burden decreases
```

这个闭环把运行时失败转化为模型改进信号。

### 15.2 提升标准

一个缺陷在以下条件下应被提升到训练层：

```text
recurrent
cross-task
capability-level
representation-level
world-model-level
router-level
reward/proxy-level
expensive to patch repeatedly
amenable to data or objective construction
```

一个缺陷在以下条件下应保留在 Agent 层：

```text
one-off
task-specific
tool/interface-related
reversible
cheap to patch
primarily caused by missing observation or workflow design
not worth amortizing through training
```

### 15.3 训练提升示例

| 反复出现的机制缺陷 | 训练侧修复 |
|---|---|
| Belief/representation 折叠了重要 schema 区分 | 用 schema-linking minimal pairs 做表征课程。 |
| World model 错误预测执行后果 | 用 predict-execute-compare traces 做执行落地训练。 |
| Capability support 缺少稀有 SQL 结构 | 针对低支持 query 模式做领域课程。 |
| Capability routing 对 audit mode 欠触发 | 用触发 / 不触发边界对做边界训练。 |
| Reward proxy 把语义错误但流畅的答案排在前面 | 用反例做偏好或奖励模型纠偏。 |

这里的原则不是每个学习组件缺陷都必须立刻通过训练消除，而是：反复出现的学习组件失败应有一条摆脱无尽运行时补丁的提升路径。

---

## 16. 案例草图：Text-to-SQL

Text-to-SQL 是桥接理论的一个好例子，因为直接 SQL 生成会在多个价值保存站点失败，并需要不同机制修复。

### 16.1 原始诊断

一个失败的 SQL query 可能呈现：

```text
observation-representation mismatch:
  相关 table、column、foreign key 或 value 没有进入表征

state mismatch:
  问题依赖数据库内容或潜在意图，而这些没有从表面文本中被消解

fitting-boundary mismatch:
  schema-audit mode 没有触发；直接 SQL 模板生成过触发

support mismatch:
  正确 join path 或 nested query 没有成为活候选

aggregation mismatch:
  SELECT、JOIN、WHERE、GROUP BY、HAVING clauses 在局部合理，但整体不一致

specification mismatch:
  自然语言意图、benchmark 标准、执行结果与语义正确性发生分离
```

### 16.2 机制画像

Text-to-SQL 中的一个支持失配，可能对应若干种机制画像。

```text
Profile A:
  mismatch_type = support
  repair_target = capability_support
  repair_layer = training or hybrid
  interpretation = the model lacks support for a rare SQL pattern

Profile B:
  mismatch_type = support
  repair_target = capability_routing
  repair_layer = agent or training
  interpretation = the model has schema-audit capability but does not activate it

Profile C:
  mismatch_type = support
  repair_target = search_execution
  repair_layer = agent
  interpretation = the correct join path could be found through controlled search but direct generation prunes it

Profile D:
  mismatch_type = support
  repair_target = observation_availability
  repair_layer = agent
  interpretation = the relevant schema/value evidence was unavailable
```

同一种原始失配会导向不同修法。

### 16.3 执行反馈作为机制修复

SQL 执行反馈常常会一次性修复多条机制轴：

```text
world_model:
  用真实执行结果替代对 query 后果的猜测

search_execution:
  支持执行引导的分支与回溯

specification_reward:
  提供比流畅性或自信程度更强的验证器

belief_representation:
  帮助更新对 schema、values 和 predicate constraints 的假设

SGAR:
  防止系统在执行与语义检查通过前，把 query 提交为已解决
```

这就是为什么 Text-to-SQL 是统一理论中的旗舰案例。它说明高性能并不只是更好提示词的产物，而是从直接最终输出生成，转向受治理控制空间搜索与机制感知修复的结果。

---

## 17. 复合因果链

许多失败不是单点缺陷，而是一条链。

### 17.1 错规格 → 错证据 → 错路由 → 收窄搜索

```text
specification_reward defect:
  The rubric rewards concise answers rather than verified answers.

observation_availability defect:
  The system does not request the missing evidence.

capability_routing defect:
  Audit mode does not trigger because the task appears simple.

search_execution defect:
  No branching or verification occurs.

primitive symptoms:
  specification mismatch + support mismatch + fitting-boundary mismatch
```

修复可能同时需要一个 rubric delta、一个 observation delta、一个 router delta，以及一个 search delta。

### 17.2 不可观测状态 → 默认先验 → 错世界模型 → 动作失败

```text
observation_availability defect:
  The system lacks the signal needed to distinguish states.

belief_representation defect:
  It collapses the state into a default assumption.

world_model defect:
  It predicts the wrong action consequence under the true state.

action_interface defect:
  It cannot query the environment to disambiguate.

primitive symptoms:
  observation-representation mismatch + state mismatch + aggregation mismatch
```

修复可能需要通道修复、状态表征、环境查询访问，以及 SGAR 验证门。

### 17.3 接口缺失 → 不可验证的猜测 → 虚假完成

```text
action_interface defect:
  The system cannot execute or inspect the artifact.

search_execution defect:
  It cannot run the verifier.

specification_reward defect:
  It substitutes self-confidence for external verification.

SGAR failure:
  The system commits progress based on narrative rather than observed outcome.

primitive symptoms:
  support mismatch + specification mismatch + state transition failure
```

修复需要增加行动接口、验证器以及提交规则。

---

## 18. 反模式

### 18.1 把机制名称当成证据

一个机制标签不是证据。说“这是个路由问题”，并不能让路由自动变成原因。机制画像必须引用证据，并在可能时给出最小干预探针。

### 18.2 把六和八看作竞争性分类法

六类原始失配和八条机制轴回答的是不同问题。

```text
Six: What kind of value failure occurred?
Eight: Which component should be repaired?
```

把两者压成同一套分类，只会让二者都变得不那么有用。

### 18.3 把八条轴称为原始失配

八条轴不应被称作原始价值失配。它们是机制轴、修复目标或可干预组件。

### 18.4 以为训练总是正确修法

一个学习组件缺陷往往可以先在 Agent 层打补丁。只有当缺陷反复出现、跨任务且可摊销时，训练才真正有理由。

### 18.5 以为 Agent 治理总是足够

如果同一个学习组件缺陷反复出现，Agent 层补丁就会变成跑步机。该缺陷应被提升到训练侧修复。

### 18.6 修症状，不修机制

如果是路由压制了正确能力，增加搜索预算就未必能修好支持失败。如果是相关用户偏好从未被观测，增加 rubric 也未必能修好规格失配。如果是行动接口缺失，增加样例也没用。

### 18.7 把机制修复作为叙事提交

一个新工具、验证器、路由器或 rubric，不会因为上下文说它存在就自动成为系统的一部分。它应通过 SGAR 作为硬状态转移被提交。

---

## 19. 对理论栈的集成要求

本文意味着整个受治理 LLM 文档集合需要若干项集成更新。

### 19.1 结构理论 (`structural-theory-value-preservation-llm-systems.md`)

在六类原始失配之后增加一节：

```text
From Value-Preservation Diagnosis to Mechanism Localization
```

该节应引入：

```text
mismatch_type ∈ six
control_object ∈ task-specific governed object
mechanism_axis ∈ eight | unknown | not_operationalized
repair_layer ∈ agent | training | hybrid
```

并包含一个紧凑的交叉映射矩阵。

### 19.2 六类原始失配分类法 (`six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.md`)

增加一节：

```text
Primitive Mismatch vs Mechanism Axis
```

并澄清：

```text
六类原始失配的相对完备性，是针对价值保存诊断站点的完备性主张，
而不是针对闭环 LLM 系统中所有可干预组件的完备性主张。
```

### 19.3 形式化机制层 (`formal-mechanism-layer-for-governed-llm-systems.md`)

该文件应声明：

```text
This document defines the intervention-localization layer orthogonal to the six primitive value-preservation mismatches.
```

并纳入学习 / 系统 / 混合分类、最小干预探针，以及表征诱导的价值上限命题。

### 19.4 受治理对象模型 (`governed-llm-object-model-interface-specification.md`)

规范化：

```text
mismatch_type = six-mismatch enum
control_object_ref / control_object_type = task-object fields
mechanism_axis = eight-mechanism enum plus not_operationalized
operationalization_status = direct | derived | partial | not_operationalized
repair_layer = agent | training | hybrid
mechanism_profile = first-class object
```

### 19.5 审计工程 (`audit-engineering-failure-localization-control-space-writeback.md`)

把循环升级为：

```text
Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Minimal Intervention Probe
  → Control Delta
```

### 19.6 SGAR (`state-governed-agent-regime-for-governed-llm-systems.md`)

增加：

```text
SGAR as Governed Mechanism-Layer Transition
```

并把 `S + A → O → V → S'` 明确连接到 `A_sys`、观测通道、验证器、世界模型和已提交状态。

### 19.7 机制驱动训练 (`mechanism-driven-training-for-governed-llm-systems.md`)

对应的单独文档是：

```text
Mechanism-Driven Training for Governed LLM Systems
From Audit Findings to Training Curricula
```

它应定义反复出现的学习组件失败如何从 defect ledger 流向训练数据、边界课程、奖励纠偏、路由训练和世界模型 grounding。

---

## 20. 压缩陈述

六类原始失配与八条机制轴，是对同一个受治理 LLM 系统的两个正交视角。

```text
Six primitive mismatches:
  diagnose where task value is lost and where engineering enters.

Task-specific control objects:
  record what is directly repaired.

Eight mechanism axes:
  explain which component-level mechanism is implicated.

mechanism_axis:
  records component attribution, not necessarily a direct runtime repair target.

repair_layer:
  decides whether the repair belongs at the agent layer, the training layer, or both.

Mechanism Profile:
  bridges audit findings to control deltas, regression guards, state transitions, and training items.
```

这座桥把理论栈变成一个闭环：

```text
primitive mismatch diagnosis
  → mechanism localization
  → agent-layer repair or training-layer promotion
  → governed object update
  → SGAR commitment
  → defect-ledger accumulation
  → model improvement when recurrent learning defects justify training
```

六类原始失配先找到病灶。  
任务对象把病灶暴露成可审计组织。  
机制层解释系统解剖。  
对象模型记录这次切口。  
审计工程检查它是否有效。  
SGAR 决定它是否成为状态。  
训练闭环决定这道反复出现的疤是否应变成学习。

---

## Appendix A: 规范枚举

### A.1 Primitive Mismatch Enum

```text
observation_representation
state
fitting_boundary
support
aggregation
specification
compound
unknown
```

### A.2 Mechanism Axis Enum

```text
specification_reward
observation_availability
belief_representation
dynamics_world_model
action_interface
capability_support
capability_routing
search_execution
unknown
```

### A.3 Repair Layer Enum

```text
agent
training
hybrid
unknown
```

### A.4 Mechanism Role Enum

```text
primary
amplifier
downstream
unknown
```

### A.5 Control Delta Type Enum

```text
SpecificationDelta
ObservationDelta
BeliefRepresentationDelta
DynamicsWorldModelDelta
ActionInterfaceDelta
CapabilitySupportDelta
CapabilityRoutingDelta
SearchExecutionDelta
```

---

## Appendix B: 最小干预探针模板

### B.1 Specification / Reward Probe

```json
{
  "suspected_mechanism": "specification_reward",
  "probe": "Replace or refine the rubric while holding observations, representation, model, and search fixed.",
  "success_signal": "Previously misranked candidates are now ranked according to task utility.",
  "failure_signal": "Misranking persists despite objective repair."
}
```

### B.2 Observation Availability Probe

```json
{
  "suspected_mechanism": "observation_availability",
  "probe": "Add only the missing observation channel, evidence source, log, database field, or clarification.",
  "success_signal": "The system can now distinguish cases previously collapsed.",
  "failure_signal": "Failure persists even with the missing observation supplied."
}
```

### B.3 Belief / Representation Probe

```json
{
  "suspected_mechanism": "belief_representation",
  "probe": "Add a structured representation such as a state table, schema graph, timeline, binding table, or dependency graph.",
  "success_signal": "The failure is repaired without changing model weights, objective, or search budget.",
  "failure_signal": "The system still fails despite correct structure being represented."
}
```

### B.4 Dynamics / World Model Probe

```json
{
  "suspected_mechanism": "dynamics_world_model",
  "probe": "Add real execution feedback or a predict-execute-compare loop.",
  "success_signal": "Predicted consequences are corrected by environment feedback.",
  "failure_signal": "Execution feedback does not change the failure pattern."
}
```

### B.5 Action / Interface Probe

```json
{
  "suspected_mechanism": "action_interface",
  "probe": "Expose the missing tool, API, permission, action schema, rollback path, or human escalation action.",
  "success_signal": "The previously impossible repair or verification becomes executable.",
  "failure_signal": "The system still cannot repair despite the action being available."
}
```

### B.6 Capability Support Probe

```json
{
  "suspected_mechanism": "capability_support",
  "probe": "Add examples, a specialized operator, domain RAG, or a stronger model for the required capability.",
  "success_signal": "The required structure appears as a viable candidate.",
  "failure_signal": "The structure remains absent or unusable."
}
```

### B.7 Capability Routing Probe

```json
{
  "suspected_mechanism": "capability_routing",
  "probe": "Add a mode switch, router rule, trigger boundary, role separation, or applicability test.",
  "success_signal": "The correct capability activates in the target region and suppresses outside it.",
  "failure_signal": "The same over-triggering or under-triggering persists."
}
```

### B.8 Search / Execution Probe

```json
{
  "suspected_mechanism": "search_execution",
  "probe": "Add branching, backtracking, execution-guided search, independent verification, or candidate reranking.",
  "success_signal": "A previously missed or pruned candidate is found, verified, and preserved.",
  "failure_signal": "Search changes do not alter the failure."
}
```

---

## Appendix C: 最小对象捆绑

一个完整的、桥接感知的失败记录应包含：

```json
{
  "audit_finding": {
    "id": "finding.example",
    "mismatch_type": "support",
    "repair_target": "capability_routing",
    "repair_layer": "hybrid",
    "repair_target_role": "primary",
    "mechanism_profile": "mechanism_profile.example",
    "control_delta": "control_delta.example",
    "regression_guard": "regression_guard.example"
  },
  "mechanism_profile": {
    "id": "mechanism_profile.example",
    "primary_mechanism": "capability_routing",
    "secondary_mechanisms": ["search_execution"],
    "minimal_intervention_probe": "Add explicit router trigger for audit mode on schema ambiguity.",
    "probe_result": "partially_resolved",
    "recommended_control_delta": "Add runtime router rule and trigger-boundary guard.",
    "recommended_training_item": "Boundary curriculum for schema-audit activation."
  },
  "control_delta": {
    "id": "control_delta.example",
    "target_mechanism": "capability_routing",
    "target_layer": "hybrid",
    "delta_type": "CapabilityRoutingDelta",
    "change": "Activate schema-audit mode when lexical overlap is high but join path is uncertain."
  },
  "regression_guard": {
    "id": "regression_guard.example",
    "guard": "Minimal-pair tasks where direct lexical answer is tempting but schema-audit is required must trigger audit mode."
  }
}
```

这个对象捆绑展示了桥接层的目的。原始失配诊断解释价值失败。机制画像识别修复目标。控制增量改变系统。回归护栏让修复真正有牙齿。训练项则在缺陷反复出现时，防止系统永远停留在运行时打补丁。
