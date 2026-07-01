# 面向受治理 LLM 系统的形式化机制层

## 可干预组件、诊断画像与修复定位

**工作稿 v0.1**  

---

## 目录

- [摘要](#摘要)
- [0. 在统一理论中的位置](#0-在统一理论中的位置)
- [1. 为什么需要机制层](#1-为什么需要机制层)
- [2. 形式化决策系统模型](#2-形式化决策系统模型)
- [3. 八条可干预的机制轴](#3-八条可干预的机制轴)
- [4. 八轴汇总表](#4-八轴汇总表)
- [5. 与六类原始失配的交叉映射](#5-与六类原始失配的交叉映射)
- [6. 最小干预探针](#6-最小干预探针)
- [7. 作为治理对象的机制画像](#7-作为治理对象的机制画像)
- [8. 复合机制链](#8-复合机制链)
- [9. 与审计工程的关系](#9-与审计工程的关系)
- [10. 与知识治理的关系](#10-与知识治理的关系)
- [11. 与 SGAR 的关系](#11-与-sgar-的关系)
- [12. 案例一：Text-to-SQL](#12-案例一text-to-sql)
- [13. 案例二：金融事件策略](#13-案例二金融事件策略)
- [14. 案例三：使用工具的代码代理](#14-案例三使用工具的代码代理)
- [15. 使用原则与局限](#15-使用原则与局限)
- [16. 对机制层自身的自审计](#16-对机制层自身的自审计)
- [17. 压缩操作协议](#17-压缩操作协议)
- [18. 结论](#18-结论)
- [Appendix A: 机制检查清单](#appendix-a-机制检查清单)
- [Appendix B: 紧凑 Schema Bundle](#appendix-b-紧凑-schema-bundle)
- [Appendix C: 术语表](#appendix-c-术语表)

---

## 摘要

本文定义了受治理 LLM 系统的 **形式化机制层**（Formal Mechanism Layer）。它是价值保存结构理论、六类原始失配、受治理 LLM 对象模型、审计工程，以及状态治理智能体范式（SGAR）的配套文档。它的目的，是在任务失败已经被转化为可治理控制对象之后，把结构性诊断连接到组件级归因与修复定位。

六类原始失配解释了任务价值在哪里发生结构性扭曲：观测-表征、状态、拟合边界、支持、聚合，以及规格失配。它们是 **任务价值的结构性诊断轴**，也是实践中的第一工程入口。相比之下，形式化机制层回答的是另一个问题：一旦失败已经被观察到，并且已经被对象化为任务特定控制对象，实际的 LLM 系统中究竟是哪类组件机制在解释或放大这一失败？

我们把 LLM 系统建模为一个在部分可观测环境中运行的近似决策系统。系统并不直接拥有真实状态、真实转移函数、真实奖励、完整动作空间或完整观测通道。它通过一组近似组件行动：规格与奖励代理、观测接口、信念与表征状态、世界模型、动作接口、策略与能力支持、能力路由，以及搜索或执行算法。

因此，机制层把修复定位分解为八条可干预轴：

```text
1. 规格 / 奖励
2. 观测可得性
3. 信念 / 表征
4. 动态 / 世界模型
5. 动作 / 接口
6. 策略先验 / 能力支持
7. 拟合边界 / 能力路由
8. 搜索 / 执行
```

这八条轴并不是八类新的原始失配。它们也不是对六失配分类法的替代。它们是 **系统干预轴**。一个原始失配可能由多个机制故障产生，而一个机制故障也可能表现为多个原始失配。因此，恰当的诊断单位不是被迫选出的单一标签，而是 **机制画像**（Mechanism Profile）。

修正后的定位是：

> 形式化机制层是一个派生出来的组件分析层，而不是默认的一线工程入口。

本文形式化定义这八条轴，将机制画像定义为治理对象，给出用于因果定位的最小干预探针，把原始失配映射到机制来源，并展示机制级诊断如何与任务特定控制对象、审计工程、控制增量、回归护栏、缺陷台账以及 SGAR 的硬状态转移相集成。

---

## 0. 在统一理论中的位置

当前的受治理 LLM 理论栈包含若干层：

```text
Layer 0: 世界到输出的价值保存管线
Layer 1: 六类原始失配
Layer 2: 任务特定控制对象
Layer 3: 形式化机制层
Layer 4: 诊断-机制桥接
Layer 5: 知识治理
Layer 6: 审计工程
Layer 7: 受治理对象模型
Layer 8: 状态治理智能体范式（SGAR）
Layer 9: 机制驱动训练
```

每一层回答一个不同的问题。

| 层级 | 主要问题 |
|---|---|
| 价值保存管线 | 任务价值必须经过哪些站点才能存活？ |
| 六类原始失配 | 任务价值在何处发生结构性扭曲？ |
| 任务特定控制对象 | 应先构造或修订哪个受治理任务对象？ |
| 形式化机制层 | 是哪类组件机制在解释该任务对象上的失败？ |
| 诊断-机制桥接 | 价值诊断如何转化为对象修复、机制归因与修复层选择？ |
| 知识治理 | 哪些控制知识应被对象化、定域、修订与撤销？ |
| 审计工程 | 应如何定位失败并把结果写回控制空间？ |
| 受治理对象模型 | 发现、增量、受治理知识对象（Governed Knowledge Object / GKO）、护栏与状态记录应如何表示？ |
| SGAR | 哪些动作、修复、记忆与状态更新会被真正提交？ |
| 机制驱动训练 | 哪些反复出现且已操作化的学习组件失败应被提升到训练中？ |

机制层位于结构理论与修复之间。它防止 LLM 系统设计中一种常见失败：从表面症状直接跳到自己偏爱的修法，而没有先识别组件级瓶颈。

例如，一个失败的 SQL 查询可以被描述为支持失配，因为正确的 join 路径没有出现。但其机制层原因可能不同：

```text
缺少 schema 数据                    → 观测可得性
schema 已在上下文中但不可操作        → 信念 / 表征
正确查询需要先执行某步操作          → 动作 / 接口
错误猜测了查询行为                  → 动态 / 世界模型
罕见 join 模式没有被生成            → 策略 / 能力支持
没有触发 schema-audit 技能          → 能力路由
候选已生成但被丢弃                  → 搜索 / 执行
成功标准设错                        → 规格 / 奖励
```

原始失配告诉我们，发生的是哪种价值保存失败。任务特定控制对象告诉我们，真正应修改的对象是什么。机制画像告诉我们，这个对象背后是哪类组件机制在起作用。

---

## 1. 为什么需要机制层

### 1.1 结构性诊断还不够

结构性失配诊断是必要的，但并不充分。假设某个 artifact 之所以失败，是因为局部上看似合理的组件没能组合成全局有效的结果。把这称为聚合失配是合理的。但同样一种聚合失败，可能需要完全不同的修复：

```text
- 构建外部依赖图；
- 增加全局验证器；
- 扩大候选搜索；
- 引入领域专用的组合算子；
- 改变任务模式，使模型进入审计而不是起草；
- 增加一个能够验证全局 artifact 的缺失工具；
- 修正那个在奖励局部流畅性的错误规格。
```

所有这些修复都可能降低聚合失败，但它们修改的并不是同一个系统组件。

因此，一个有用的诊断不应只说：

```text
这是一次聚合失配。
```

还必须进一步说：

```text
直接瓶颈在信念 / 表征：相关依赖图从未被外化。
```

或者：

```text
直接瓶颈在搜索 / 执行：正确依赖图是可达的，但当前分支搜索没能把它保住。
```

或者：

```text
直接瓶颈在能力路由：模型具备 graph-audit 能力，但任务提示把它路由到了流畅起草模式。
```

### 1.2 机制诊断就是修复定位

机制诊断问的是：

```text
哪个组件应当被修改、扩展、约束、验证或替换？
```

答案可能是：

```text
- objective / rubric；
- observation channel；
- representation state；
- world-model feedback；
- action interface；
- capability support；
- capability router；
- search and execution procedure。
```

这就是为什么机制层不只是多加一些术语。它是理论与干预之间的桥梁。

### 1.3 机制层不是新的主分类法

六类原始失配与八条机制轴处在不同抽象层级。

```text
六类原始失配：
  任务价值结构性诊断轴

八条机制轴：
  系统干预型诊断轴
```

不应把它们并成一个扁平列表。扁平列表会混淆两个不同问题：

```text
为什么价值没能穿过管线而存活？
下一步应当修改哪个组件？
```

这两层共同形成交叉诊断。原始失配收窄失败的形式，机制画像收窄修复目标。

### 1.4 机制画像不是单标签分类器

真实的 LLM 系统失败通常是复合型的。因此，机制层应表示为画像，而不是被迫归入单一类别。

一次失败可能包含：

```text
错误规格
  → 选择了错误证据
  → 触发了错误能力模式
  → 压窄了搜索空间
  → 验证器选中了错误候选
```

在表面上，这可能看起来像搜索失败。机制诊断应区分：

```text
primary cause
secondary cause
necessary condition
amplifier
downstream symptom
unknown / not yet distinguished
```

目标不是把失败命名得很漂亮，而是识别出成本最低、信息量最高、杠杆最大的修复。

### 1.5 范围修正：派生的组件分析层，而不是一线工程入口

形式化机制层不应被当作第一步工程动作。真正的工程入口，通常来自原始失配所迫使我们构造出的任务特定治理对象：

```text
观测-表征
  → evidence map、schema view、reader simulator、value-binding table

状态
  → state machine、world ledger、role-state table、task-state table

拟合边界
  → router rule、mode boundary、pacing / density controller

支持
  → candidate generator、technique library、retrieval operator

聚合
  → DAG、outline graph、dependency tracker、narrative skeleton

规格
  → rubric、style guard、success condition、reader-response criterion
```

这些任务对象才是审计与 control delta 直接修改的东西。形式化机制层是在这些对象已经存在之后，解释它们背后更稳定的组件归因。

### 1.6 可操作化门槛

一条机制轴只有在同时满足以下五个条件时，才应被当作直接 repair target：

```text
1. Observable symptom
   该机制失败能在任务行为中被观察到。

2. Task-specific control object
   有一个具体治理对象承载修复。

3. Intervention operator
   已知如何修改该对象或组件。

4. Success / failure signal
   能判断修复是否有效。

5. Regression guard
   同类失败复发时可以被可靠捕获。
```

如果这些条件还不成立，就应把机制标签记录为假设、诊断视角或训练侧归因，而不是直接把抽象组件名写成运行时修复对象。

### 1.7 开放任务边界

形式化机制层在观测、状态、验证器、执行轨迹、候选空间和路由边界都较稳定的任务上最可操作。在开放式创作任务中，如果尚未先把失败转化为角色状态机、叙事骨架、伏笔账本、风格守卫、节奏控制器或读者模拟器等治理对象，那么直接讨论 `dynamics_world_model` 或 `specification_reward` 往往会显得伪精确。对这类任务，应先有六类失配驱动的对象构造，再有机制归因。

---

## 2. 形式化决策系统模型

### 2.1 真实任务环境

把任务环境表示成一个部分可观测决策过程：

```math
\mathcal{E} = (\mathcal{S}, \mathcal{A}, \mathcal{T}, R^*, \Omega, \mathcal{O}, \gamma)
```

其中：

| 符号 | 含义 |
|---|---|
| `\mathcal{S}` | 真实状态空间：世界状态、用户意图、任务背景、文件、数据库内容、隐藏约束与交互状态。 |
| `\mathcal{A}` | 理论上可用的动作空间：文本输出、工具调用、检索、代码执行、数据库查询、询问用户、等待、委托与回滚。 |
| `\mathcal{T}(s' \mid s,a)` | 真实转移函数：动作执行后环境如何变化。 |
| `R^*(s,a,s')` | 真实任务奖励或效用：最终真正重要的成功标准。 |
| `\Omega` | 观测空间：文本、文件、日志、数据库行、图像、工具返回、人类反馈与指标。 |
| `\mathcal{O}(o \mid s)` | 观测函数：真实状态如何映射为观测。 |
| `\gamma` | 折扣因子，或对延迟回报的长程权重。 |

对一个有限时域任务，理想轨迹是：

```math
\tau^* = \arg\max_{\tau=(s_0,a_0,\ldots,s_H)}
\mathbb{E}\left[\sum_{t=0}^{H-1}\gamma^t R^*(s_t,a_t,s_{t+1})\right]
```

一次性文本任务是退化情形，其中主要动作是生成 artifact `y`：

```math
y^* = \arg\max_y U(y, S_{world})
```

关键点在于：真实目标不是下一个 token 的似然，而是任务环境中某条轨迹或某个 artifact 的价值。

### 2.2 近似的 LLM 系统

部署中的 LLM 系统并不能直接访问 `\mathcal{E}`。它依赖的是一组近似组件：

```math
\mathcal{M}_\theta =
\left(
\hat{R}_\theta,
\Omega_{sys},
B_\theta,
\hat{\mathcal{T}}_\theta,
\mathcal{A}_{sys},
\pi_\theta,
r_\theta,
D
\right)
```

其中：

| 组件 | 含义 |
|---|---|
| `\hat{R}_\theta` | 内部价值判断、rubric 解释、奖励代理或评估器。 |
| `\Omega_{sys}` | 系统实际上可用的观测通道。 |
| `B_\theta` | 由观测历史构造出的信念 / 表征状态。 |
| `\hat{\mathcal{T}}_\theta` | 世界模型：对动作后果的预测。 |
| `\mathcal{A}_{sys}` | 系统实际上可以调用的动作 / 接口空间。 |
| `\pi_\theta` | 模型策略、token 先验、能力先验与候选生成分布。 |
| `r_\theta` | 能力路由器：模式、角色、工具、技能、审计模式与行为激活。 |
| `D` | 解码、规划、搜索、排序、验证与执行过程。 |

`\Omega_{sys}` 属于 `\mathcal{M}_\theta`，而不属于真实环境元组 `\mathcal{E}`。`\Omega` 与 `\mathcal{O}(o \mid s)` 描述的是任务环境原则上能提供哪些观测；`\Omega_{sys}` 描述的是已部署受治理系统实际上暴露了哪些观测通道。

系统还会受到外部规格的塑形：

```text
R_proxy: 训练或产品层的代理奖励
R_eval: 部署评估器或 benchmark 指标
R_user: 用户显式表达的偏好
R*: 真实任务效用
```

并非所有机制轴都属于同一种类型。五条机制轴包含学习侧组件，因此可能需要提升到训练层：

| 机制轴 | 学习侧组件 | 运行时侧组件 |
|---|---|---|
| `specification_reward` | `\hat{R}_\theta` | rubric、evaluator、verifier、验收标准 |
| `belief_representation` | `B_\theta` | 状态表、schema、memory object、GKO |
| `dynamics_world_model` | `\hat{\mathcal{T}}_\theta` | 执行反馈、simulator、verifier |
| `capability_support` | `\pi_\theta` | 示例、RAG、专门算子、工具 |
| `capability_routing` | `r_\theta` | 显式 router、模式切换、角色绑定 |

另外三条机制轴主要是系统侧：

| 机制轴 | 主导系统组件 |
|---|---|
| `observation_availability` | `\Omega_{sys}` 与观测接入策略 |
| `action_interface` | `\mathcal{A}_{sys}` |
| `search_execution` | `D` |

这也解释了为什么“表征诱导的价值上限”属于机制层：一旦与效用相关的区分在 `B_\theta` 之前被折叠，后续的路由、支持、聚合或搜索都无法在没有新增观测或表征修复的情况下可靠恢复它。

当 `\mathcal{M}_\theta` 的某个组件与任务所要求的状态存在偏差，并且这种偏差改变了可达价值时，就发生机制失配。

### 2.3 机制失配画像

定义机制失配画像：

```math
\mathbf{m} =
(m_{spec},
 m_{obs},
 m_{belief},
 m_{dyn},
 m_{act},
 m_{support},
 m_{route},
 m_{search})
```

其中每个分量都可以记录为：

```text
none | low | medium | high | critical | unknown | not_distinguished
```

这些值不必是精确的数值分数。它们是用来指导修复与治理的诊断记录。

一个画像还应记录因果角色：

```text
primary_cause
secondary_cause
necessary_condition
amplifier
downstream_symptom
not_distinguished
```

机制诊断应当携带证据。没有最小干预探针、观察到的对照结果或明确不确定性的机制标签，只能算假设。

---

## 3. 八条可干预的机制轴

### 3.1 规格 / 奖励

#### 定义

当真实效用、显式任务目标、评估器、奖励代理、验收标准或模型内部判断之间出现足以改变候选排序的偏离时，就发生规格 / 奖励失配。

令 `R^*` 为真实任务效用，`R_eval` 为系统使用的评估器。当下式成立时，失配存在：

```math
\arg\max_y R_{eval}(y) \neq \arg\max_y R^*(y)
```

或者更一般地，当：

```math
rank_{R_{eval}}(y_1,y_2) \neq rank_{R^*}(y_1,y_2)
```

对任务关键的候选对成立时，也构成失配。

#### 核心问题

```text
系统是否在优化、审计、选择或汇报错误的目标？
```

#### 典型症状

```text
- 系统优化的是 benchmark 指标，而不是用户的部署目标。
- 评估器奖励的是流畅、谨慎或完整，而任务真正需要的是果断、正确或可操作。
- rubric 在高层面是对的，但缺少不可协商的约束。
- 生成器与验证器共享同一个错误前提。
- 系统通过了可见测试，却没满足真实用户需求。
- 某个代理指标逐渐取代了真实目标。
```

#### 最小干预探针

只修改成功标准、rubric、候选排序规则或验收测试，同时固定观测、工具、模型与搜索预算。

如果被选中的答案或修复方向发生实质变化，那么规格 / 奖励很可能是瓶颈。

#### 治理增量

```text
SpecificationDelta:
  - revise true objective statement;
  - distinguish true utility, proxy metric, reporting metric, and acceptance test;
  - add non-negotiable constraints;
  - add counterexamples to the rubric;
  - add objective-scope and revocation triggers;
  - separate generator and evaluator assumptions;
  - replace scalar proxy with layered acceptance.
```

#### 边界条件

如果目标本身是清楚的，只是被误读了，问题可能在信念 / 表征。如果目标是对的，但好候选几乎从不出现，问题可能在能力支持。如果好候选出现了，但因为有限评估的噪声而被错误选择，问题可能在搜索 / 执行。

#### 与原始失配的关系

规格 / 奖励是 **规格失配** 的主要机制来源，但它也可能通过选择错误证据、激活错误任务模式，或者奖励局部好却全局错的 artifact，引发支持、路由与聚合失败。

---

### 3.2 观测可得性

#### 定义

当正确行动所需的信息没有进入系统可观测空间时，就发生观测可得性失配。

令 `\Omega_{req}` 为区分动作相关状态所必需的观测内容。当下式成立时，系统存在观测可得性失配：

```math
\Omega_{req} \nsubseteq \Omega_{sys}
```

等价地，如果两个状态在当前观测函数下不可区分：

```math
\mathcal{O}_{sys}(\cdot \mid s_1) \approx \mathcal{O}_{sys}(\cdot \mid s_2)
```

但它们的最优动作不同：

```math
a^*(s_1) \neq a^*(s_2)
```

那么系统仅凭当前观测就无法可靠完成任务。

#### 核心问题

```text
必要信息到底有没有被看到？
```

#### 典型症状

```text
- 系统需要一个文件、表、日志、数据库行、依赖版本、时间戳或原始 trace，但它们缺失了。
- 用户脑中握有一个关键约束，但系统被迫直接作答。
- 系统拿到的是摘要，而不是决定结论的原始证据。
- 市场、代码库、API、浏览器或数据库状态被拿语言先验去猜。
- 系统缺少当前信息，又无法检索或提问。
- 一旦补上某个缺失变量，结果就发生剧烈变化。
```

#### 最小干预探针

补入最小缺失观测：一个文件、一条数据库查询、一段日志、一个澄清回答、一份带时间戳的来源、一轮 schema 检查，或一次工具返回。

如果不改变推理方法，仅靠补入该观测就显著改善结果，则说明观测可得性是瓶颈。

#### 治理增量

```text
ObservationDelta:
  - add data source;
  - connect file, database, log, browser, or tool result;
  - ask minimal clarifying question;
  - record timestamp, version, and coverage;
  - mark missing variables explicitly;
  - introduce measurement or sensor;
  - create observation sufficiency checklist.
```

#### 边界条件

“不在上下文里”属于观测可得性；“在上下文里但没被正确使用”属于信念 / 表征。增加更多无关上下文还可能因为加重绑定和检索负担，反而恶化信念 / 表征。

#### 与原始失配的关系

当决定性变量从未进入系统时，观测可得性会导致 **观测-表征失配**。当潜在状态无法区分时，它会导致 **状态失配**。它也可能制造表面的支持失败，因为系统无法生成那些依赖缺失变量的结构。

---

### 3.3 信念 / 表征

#### 定义

当信息已经存在于观测中，却没有转化为正确、稳定、可操作的任务状态时，就发生信念 / 表征失配。

令 `B^*` 为理想的任务信念 / 表征，`B_\theta` 为系统构造出的信念状态。当下式成立时，失配存在：

```math
B_\theta(s_t \mid o_{\leq t}) \neq B^*(s_t \mid o_{\leq t})
```

这里的 “belief” 并不要求显式概率分布。它包括任何会影响后续决策的内部或外部表征：抽取出的约束、实体绑定、状态表、schema、假设、记忆、计划状态、工具结果或未决问题。

#### 核心问题

```text
已有信息是否被转换成了正确的可操作状态？
```

#### 典型症状

```text
- 文档里明明有答案，但系统漏掉了，或绑定错了。
- 在长上下文中，系统忘记了更早的约束。
- 单位、日期、角色、实体、表、列或条件发生混淆。
- 事实、假设、推断、决策与未决问题被混在一起。
- 已完成的子任务被重复执行，因为状态没有被外化。
- schema 虽然可见，却没有被变成可用的 schema graph。
- 系统读到了工具返回，但没有据此更新后续行为。
```

#### 最小干预探针

不要补充新事实。相反，在求解前强制进行结构化状态抽取：

```text
- knowns / unknowns;
- constraints;
- entity table;
- timeline;
- schema graph;
- state hypothesis table;
- assumption ledger;
- fact / inference / decision separation.
```

如果没有增加新观测，仅靠这些结构化步骤就大幅改善结果，那么信念 / 表征就是瓶颈。

#### 治理增量

```text
BeliefRepresentationDelta:
  - create structured task state;
  - introduce external memory with provenance;
  - extract constraints and invariants;
  - bind entities, columns, values, dates, and units;
  - maintain state tables and timelines;
  - separate facts, assumptions, inferences, decisions, and open questions;
  - require re-reading source before irreversible steps.
```

#### 边界条件

如果所需信息根本不存在，应先修观测。如果状态表征是对的，但动作后果预测错了，应修动态 / 世界模型。如果表征是对的，但局部好结果仍然无法组合，聚合或搜索可能是下游失败。

#### 与原始失配的关系

当已观测变量没有变成可操作状态时，信念 / 表征会导致 **观测-表征失配**。当潜在状态被错误表示时，它会导致 **状态失配**。它也可能因为丢失各部分之间的依赖关系而诱发聚合失败。

---

### 3.4 动态 / 世界模型

#### 定义

当系统对动作后果的预测与真实环境转移不同，就发生动态 / 世界模型失配。

令 `\hat{\mathcal{T}}_\theta` 为系统预测的转移模型，`\mathcal{T}` 为真实转移函数。当下式成立时，失配存在：

```math
\hat{\mathcal{T}}_\theta(s_{t+1} \mid s_t, a_t)
\neq
\mathcal{T}(s_{t+1} \mid s_t, a_t)
```

#### 核心问题

```text
系统是否误判了自己的动作在真实环境中会造成什么结果？
```

#### 典型症状

```text
- 代码在解释里看起来能编译，但真实运行时报错。
- SQL 看起来合理，却返回空结果、错误结果，或直接报错。
- 系统虚构 API 参数、权限、产品行为、浏览器效果或市场反应。
- 计划假定前序步骤会成功，却忽略失败传播。
- 离线推理与真实工具、编译器、用户、数据库或市场反馈发生偏离。
- 模型在解释“应该发生什么”，而不是检查“实际上发生了什么”。
```

#### 最小干预探针

让系统先预测某个动作的结果，然后在真实或权威环境中执行或模拟该动作。比较预测与观察到的结果。

如果真实反馈反复推翻内部预测，那么世界模型失配很可能是瓶颈。

#### 治理增量

```text
DynamicsWorldModelDelta:
  - add execution feedback;
  - run code, query real database, call real API;
  - add unit tests, integration tests, sandbox, simulator, or backtest;
  - require predict-execute-compare-correct loop;
  - write environment feedback into state;
  - calibrate high-risk transition assumptions;
  - store failure modes of predicted vs observed consequences.
```

#### 边界条件

如果真实反馈通道存在，但预测与反馈不一致，这是世界模型失配。如果根本没有反馈通道或动作接口，则是动作 / 接口失配。两者经常同时出现，但修复顺序不同：先让环境可被调用或观察，再校准世界模型。

#### 与原始失配的关系

动态 / 世界模型会在状态转移被误估时导致 **状态失配**；会在系统基于错误后果假设去优化代理目标时导致 **规格失配**；也会在多步计划因早期动作效果错误而崩坏时导致 **聚合失配**。

---

### 3.5 动作 / 接口

#### 定义

当成功所需的动作不在系统有效动作空间中时，就发生动作 / 接口失配。

令 `a^*` 为任务所需动作。当下式成立时，失配存在：

```math
a^* \notin \mathcal{A}_{sys}
```

某个动作即使名义上可用，也可能因为权限、schema 限制、延迟、缺少回滚、缺少授权、执行不可靠、返回值缺失或流程约束，而在事实上不可用。

#### 核心问题

```text
系统是否真的能够执行成功所需的那个动作？
```

#### 典型症状

```text
- 任务需要浏览、运行代码、编辑文件、查询数据库或看日志，但系统只能输出文本。
- 系统必须先问一个澄清问题，却被迫一轮完成回答。
- 工具存在，但参数 schema 无法表达所需操作。
- 系统能建议一个动作，却不能验证、部署、观察或回滚它。
- 权限、速率限制、策略门槛、网络访问或异步等待约束阻断了完成。
- 模型因为拿不到真实结果，只能幻觉动作结果。
```

#### 最小干预探针

在固定模型与任务规格的前提下，仅开放完成或验证所需的最小动作：

```text
- one database query;
- one code execution;
- one file read;
- one file write in a sandbox;
- one clarifying question;
- one API call;
- one permissioned tool;
- one rollback-safe execution path.
```

如果任务从“猜测”变成“可验证执行”，说明动作 / 接口就是瓶颈。

#### 治理增量

```text
ActionInterfaceDelta:
  - add tool, API, executor, file operation, or database interface;
  - improve parameter schema and error returns;
  - add authorization, rollback, and irreversible-action gates;
  - support clarification and asynchronous waiting;
  - expose tool outputs as state updates;
  - define safe action subsets and escalation conditions;
  - log action provenance and effect.
```

#### 边界条件

工具并不是越多越好。只有当系统能够观察到它们、选择它们、正确调用它们、理解返回值、验证其效果，并提交由此产生的状态转移时，工具才真正扩展有效动作空间。否则，工具只会增加路由与搜索负担。

#### 与原始失配的关系

当系统缺少观察决定性变量所需工具时，动作 / 接口会导致 **观测-表征失配**。当正确结构依赖工具生成候选时，它会导致 **支持失配**。当动作无法产生可验证状态转移时，它也会导致 SGAR 失败。

---

### 3.6 策略先验 / 能力支持

#### 定义

当正确的知识、算子、推理模式、artifact 结构或动作候选，在系统的有效策略与预算下概率太低或不可达时，就发生策略先验 / 能力支持失配。

令 `y^*` 为高价值候选，`B` 为推断预算。当下式成立时，失配存在：

```math
P_\theta(y^* \mid Z, B) \approx 0
```

或者：

```math
y^* \notin EffectiveSupport_B(\pi_\theta)
```

#### 核心问题

```text
正确结构是否位于系统的有效支持之内？
```

#### 典型症状

```text
- 多次采样反复落入同一类错误。
- 系统会复述领域材料，却不会执行该领域特有的操作。
- 正确解法依赖稀有的专业工作流、证明策略、算子族、API 用法或推理模式。
- 即使规格、上下文、工具都充足，系统仍生成不出正确类型的候选。
- 一旦换成专门模型、程序化算子或强 few-shot，结果就大幅改变。
```

#### 最小干预探针

尽量固定规格、观测、工具、表征与路由，然后只增加以下某一项：

```text
- strong few-shot examples;
- domain retrieval;
- specialist model;
- programmatic generator;
- curated operator family;
- fine-tuned capability;
- external solver.
```

如果只有这些干预能让正确候选出现，那么能力支持很可能不足。

#### 治理增量

```text
CapabilitySupportDelta:
  - add examples, domain knowledge, or specialist retrieval;
  - add expert model or programmatic operator;
  - decompose capability into smaller verifiable sub-capabilities;
  - add task-specific candidate generators;
  - add training or boundary-case curriculum;
  - create support-expansion GKO;
  - track effective support under realistic budget.
```

#### 边界条件

观测失配意味着任务缺信息；能力支持失配意味着即便有了信息，系统仍缺解法先验。如果反复采样偶尔能产生正确候选，问题可能更偏向搜索，而不是支持。如果在另一种提示、角色或模式下能力会出现，那么问题可能在路由，而不是支持。

#### 与原始失配的关系

能力支持是 **支持失配** 的主要机制来源。它也可能在系统缺少能保留全局结构的算子时，放大聚合失败。

---

### 3.7 拟合边界 / 能力路由

#### 定义

当某种已学得的能力、策略、角色、审计模式、拒答行为、工具使用行为或推理模式，本该在一个区域触发，却在另一个区域被触发时，就发生拟合边界 / 能力路由失配。

令 `X` 为某种能力。令：

```text
T_X = X 真正应当适用的域
M_X = 模型 / 系统实际上激活 X 的域
```

当下式成立时，失配存在：

```math
M_X \neq T_X
```

并有两个方向：

```math
M_X \setminus T_X \quad \text{over-triggering}
```

```math
T_X \setminus M_X \quad \text{under-triggering}
```

#### 核心问题

```text
能力是否存在，但被错误路由了？
```

#### 典型症状

```text
- 一个简单脚本任务触发了过度工程模式。
- 一个无害请求触发了拒答或过强的安全模式。
- 一个探索性研究任务触发了过早的 No-Go 审计模式。
- 一个 schema-linking 任务触发了通用 SQL 模板生成，而不是 schema 审计。
- 一个候选构造任务触发了“证据不足”语言，而不是搜索过程。
- 正确能力会在其他 prompt、角色、阶段或分解方式下出现。
```

#### 最小干预探针

不增加新事实，也不增加新工具。只改变：

```text
- task mode;
- role binding;
- generator / verifier split;
- phase state;
- positive and negative trigger examples;
- routing rule;
- suppression condition;
- instruction that explicitly activates the suspected capability.
```

如果正确行为出现了，那么瓶颈就在路由，而不是能力缺失。

#### 治理增量

```text
CapabilityRoutingDelta:
  - add explicit skill router;
  - define phase-specific modes;
  - separate generator, verifier, executor, and governor roles;
  - add trigger and anti-trigger examples;
  - add boundary probes;
  - add routing confusion matrix;
  - define revocation conditions for task modes;
  - govern capability activation as a GKO.
```

#### 边界条件

能力支持意味着系统缺少相关能力或候选先验。路由失配意味着相关能力大致存在，但没有在正确上下文中被激活。搜索失配则意味着能力已被激活、候选也存在，但搜索过程没能找到或保住它。

#### 与原始失配的关系

拟合边界 / 能力路由是 **拟合边界失配** 的主要机制来源，也经常通过在搜索开始前就压窄候选空间，放大支持与聚合失败。

---

### 3.8 搜索 / 执行

#### 定义

当正确候选位于有效支持之内，而相关信息、目标、动作空间、能力与路由都已足够接近正确，但当前的搜索、排序、验证或执行过程仍未找到、选中、保留或完成它时，就发生搜索 / 执行失配。

令 `D` 为解码、搜索、规划、排序、验证与执行过程。当下式成立时，失配存在：

```math
y^* \in EffectiveSupport_B(\pi_\theta)
```

但：

```math
D(\pi_\theta, B) \neq y^*
```

#### 核心问题

```text
正确路径是不是其实可达，只是没有被找到、选中、保住或执行到底？
```

#### 典型症状

```text
- greedy decoding 在早期 token 上过早承诺。
- Best-of-N 里有强候选，但单次输出平庸。
- 候选已经生成，却被弱排序器丢掉。
- 计划本身是好的，但执行过程中丢失了中间状态。
- 搜索只改变表面措辞，没有覆盖关键结构变量。
- 错误的初始计划被后续步骤不断合理化。
- 系统能找到局部修复，却找不到修复的组合。
```

#### 最小干预探针

不要增加数据、工具、能力或新规格。只改变搜索或执行：

```text
- increase candidate count;
- add branch search;
- add backtracking;
- add independent verifier;
- add candidate comparison;
- preserve checkpoints;
- add constrained combinatorial search;
- separate planning and execution;
- add recovery from failed branches.
```

如果结果质量显著提升，那么搜索 / 执行就是瓶颈。

#### 治理增量

```text
SearchExecutionDelta:
  - add best-of-N, beam, tree search, or MCTS;
  - add generate-rank-verify loop;
  - add branch checkpoints and rollback;
  - add independent verifier;
  - allocate budget by uncertainty and value;
  - preserve failed branches as evidence;
  - add execution trace state;
  - prevent premature commitment.
```

#### 边界条件

更大搜索只有在正确候选位于有效支持内、评估器能识别它、动作接口能执行或验证它时才有帮助。否则，搜索只是更彻底地探索错误空间。

#### 与原始失配的关系

搜索 / 执行会在预算限制下让可达候选未被采样，从而导致 **支持失配**；也会在执行过程中无法保留好的局部部分时导致 **聚合失配**。如果评估器是对的，但候选比较噪声太大或预算不足，它还可能制造表面的规格失败。

---

## 4. 八轴汇总表

| Axis | Formal object | Core diagnostic | Typical repair |
|---|---|---|---|
| Specification / reward | `R^*`, `R_proxy`, `R_eval`, `\hat R_\theta` | 系统是否在优化错误目标？ | 修目标、rubric、验收标准、代理指标。 |
| Observation availability | `\Omega_sys`, `\mathcal{O}` | 决策相关信息是否进入系统？ | 检索、数据接入、文件、日志、澄清、测量。 |
| Belief / representation | `B_\theta` | 已观测信息是否形成正确可操作状态？ | 状态抽取、实体绑定、外部记忆、结构化表征。 |
| Dynamics / world model | `\hat{\mathcal T}_\theta` | 系统是否误判了动作后果？ | 执行反馈、测试、沙盒、模拟器、回测。 |
| Action / interface | `\mathcal A_sys` | 所需动作是否可调用？ | 工具、API、权限、schema、回滚门槛。 |
| Capability support / policy prior | `\pi_\theta`, effective support | 正确结构在预算内是否可达？ | 范例、RAG、专家模型、程序算子、训练。 |
| Fitting boundary / routing | `r_\theta`, `M_X`, `T_X` | 能力是否在正确区域被触发？ | 路由器、模式切换、触发边界、角色分离。 |
| Search / execution | `D` | 可达候选是否被找到、选中、保住并完成？ | 采样、树搜索、回溯、验证器、检查点。 |

---

## 5. 与六类原始失配的交叉映射

### 5.1 原始失配 → 可能的机制来源

| Primitive mismatch | Common mechanism sources | Explanation |
|---|---|---|
| Observation-representation | observation availability; belief / representation; action / interface | 决定性变量可能没进入观测；进入后没变成可操作状态；或必须依赖某个工具 / 接口才能观测。 |
| State | observation availability; belief / representation; dynamics / world model; SGAR transition state | 相关潜在状态可能未被观测、被误表示、在转移中被误预测，或没被提交成硬状态。 |
| Fitting-boundary | capability routing; capability support; search / execution | 能力可能存在但被误路由；低支持或路径锁定会放大边界失败。 |
| Support | capability support; observation availability; action / interface; search / execution | 高价值结构可能因缺信息、缺工具、缺能力先验或搜索覆盖不足而不可达。 |
| Aggregation | belief / representation; capability support; capability routing; search / execution; dynamics | 局部部分可能因依赖未被表示、缺少正确组合算子、路由错误或执行过程丢失结构而无法组合。 |
| Specification | specification / reward; belief / representation; search / execution | 目标可能本身错了、被误读了、被遗忘了，或定义正确但在有限候选中被弱评估。 |

### 5.2 机制轴 → 可能的原始症状

| Mechanism axis | Possible primitive symptoms |
|---|---|
| Specification / reward | specification mismatch; induced routing, support, or aggregation failures. |
| Observation availability | observation-representation mismatch; state mismatch; apparent support failure. |
| Belief / representation | observation-representation mismatch; state mismatch; aggregation mismatch; specification misread. |
| Dynamics / world model | state mismatch; aggregation mismatch in multi-step plans; specification failure under false consequence assumptions. |
| Action / interface | observation-representation mismatch; support mismatch; SGAR false completion. |
| Capability support | support mismatch; aggregation mismatch; apparent route failure when capability does not exist. |
| Capability routing | fitting-boundary mismatch; support narrowing; search path lock-in. |
| Search / execution | support mismatch under budget; aggregation failure; noisy evaluator selection. |

### 5.3 为什么交叉映射重要

交叉映射能防止过早修复。考虑这句话：

```text
系统失败是因为支持失配。
```

这还不完整。不同机制画像对应完全不同的修法：

```text
由观测可得性导致的支持失配：
  补入缺失数据。

由动作接口导致的支持失配：
  增加工具或 API。

由能力支持导致的支持失配：
  增加范例、专家模型或程序算子。

由路由导致的支持失配：
  激活正确的能力模式。

由搜索 / 执行导致的支持失配：
  扩大搜索、排序、回溯或验证。
```

只有结构性诊断、没有机制定位，极易导向错误修复。

---

## 6. 最小干预探针

### 6.1 目的

最小干预探针，是一种小规模、受控的改动，用来区分不同机制原因。

它的目标不是跑外部 benchmark，而是为某个具体失败家族定位修复目标。

一个好的探针，应在尽可能保持其他部分稳定的前提下，只改变一个主导组件。

### 6.2 依赖顺序

一种实用的依赖顺序是：

```text
1. 规格 / 奖励
2. 观测可得性
3. 信念 / 表征
4. 动态 / 世界模型
5. 动作 / 接口
6. 策略先验 / 能力支持
7. 拟合边界 / 能力路由
8. 搜索 / 执行
```

这个顺序不是绝对的。低成本探针可以并行执行。但它编码了一个警告：

```text
当上游的目标、观测、表征、动作或路由条件仍然损坏时，不要把全部修复预算都砸在下游搜索上。
```

### 6.3 探针表

| Suspected mechanism | Minimal intervention probe | Evidence if positive |
|---|---|---|
| Specification / reward | 只改 rubric 或验收标准。 | 在相同数据与搜索下，输出 / 排序发生变化。 |
| Observation availability | 补一个缺失观测。 | 推理方法不变，但结果改善。 |
| Belief / representation | 强制结构化抽取 / 状态表。 | 没有增加新事实，但结果改善。 |
| Dynamics / world model | 先预测，再执行 / 检查。 | 真实反馈推翻模型预测。 |
| Action / interface | 开放一个必要工具或权限。 | 任务从猜测转为可验证行动。 |
| Capability support | 增加范例 / 专家算子。 | 只有增加支持后，正确候选才出现。 |
| Capability routing | 只改模式 / 角色 / router。 | 不加新事实，已有能力就出现。 |
| Search / execution | 增加搜索 / 回溯 / verifier。 | 可达候选被找到或被保住。 |

### 6.4 因果角色

机制画像应区分：

| Role | Meaning |
|---|---|
| Primary cause | 修掉它之后，失败会消失或显著减少。 |
| Secondary cause | 它会促成失败，但单独存在未必足够。 |
| Necessary condition | 不修它就不可能成功，但它未必制造了当前失败。 |
| Amplifier | 让失败更稳定、更流畅或更难修。 |
| Downstream symptom | 它出现是因为上游原因。 |
| Not distinguished | 证据不足，无法分配因果角色。 |

### 6.5 避免错误定位

错误定位发生在：某个下游修复看起来有帮助，却没有识别真正根因。

例子：

```text
- 增加搜索稍有帮助，但只是因为路由仍然错误，而搜索偶尔逃出了错误区域。
- 增加上下文稍有帮助，但真正问题是表征绑定。
- 换更强模型有效，但真正问题是动作接口缺失。
- 更严格 rubric 有帮助，但真正问题是评估器与生成器共享同一前提。
- 一次工具调用有帮助，但只是因为它补进了一项本应明确请求的观测。
```

机制记录应保留这种不确定性，而不是过度断言。

---

## 7. 作为治理对象的机制画像

### 7.1 机制画像 schema

机制画像应当成为受治理对象系统的一部分。

```json
{
  "id": "mechanism_profile.unique_id",
  "failure_instance": "reference to reproducible failure instance",
  "artifact": "candidate artifact, output, action trace, or state transition",
  "task_context": "summary of task and true success criterion",
  "primitive_mismatches": [
    "observation_representation",
    "state",
    "fitting_boundary",
    "support",
    "aggregation",
    "specification"
  ],
  "mechanism_scores": {
    "specification_reward": "none | low | medium | high | critical | unknown | not_distinguished",
    "observation_availability": "none | low | medium | high | critical | unknown | not_distinguished",
    "belief_representation": "none | low | medium | high | critical | unknown | not_distinguished",
    "dynamics_world_model": "none | low | medium | high | critical | unknown | not_distinguished",
    "action_interface": "none | low | medium | high | critical | unknown | not_distinguished",
    "capability_support": "none | low | medium | high | critical | unknown | not_distinguished",
    "capability_routing": "none | low | medium | high | critical | unknown | not_distinguished",
    "search_execution": "none | low | medium | high | critical | unknown | not_distinguished"
  },
  "causal_roles": {
    "primary_cause": ["..."],
    "secondary_causes": ["..."],
    "necessary_conditions": ["..."],
    "amplifiers": ["..."],
    "downstream_symptoms": ["..."],
    "not_distinguished": ["..."]
  },
  "minimal_intervention_probes": [
    {
      "probe": "what was changed",
      "held_fixed": ["data", "model", "budget", "tools", "rubric"],
      "expected_signal": "what would distinguish the mechanism",
      "observed_result": "what happened",
      "interpretation": "mechanism implication"
    }
  ],
  "recommended_control_deltas": ["..."],
  "regression_guard_candidates": ["..."],
  "evidence": ["..."],
  "confidence": "low | medium | high",
  "revocation_trigger": "when this mechanism diagnosis should be weakened or revised"
}
```

### 7.2 与 Audit Finding 的集成

Audit Finding 不应直接从 defect 跳到 repair。它应先经过机制定位。

```text
Candidate Artifact
  → Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Control Delta
  → Regression Guard
  → Defect Ledger
```

一个 Audit Finding 可以写成：

```json
{
  "finding": "The SQL query joins orders to customers through the wrong bridge table.",
  "primitive_mismatch": ["aggregation", "support"],
  "mechanism_profile": "mechanism_profile.sql_join_path_001",
  "mechanism_axis": "belief_representation + search_execution",
  "control_delta": "externalize schema graph and enumerate join paths before SQL rendering"
}
```

### 7.3 与 Control Delta 分类法的集成

每条机制轴都对应一种 Control Delta 类型。

| Mechanism axis | Control Delta type |
|---|---|
| Specification / reward | `SpecificationDelta` |
| Observation availability | `ObservationDelta` |
| Belief / representation | `BeliefRepresentationDelta` |
| Dynamics / world model | `DynamicsWorldModelDelta` |
| Action / interface | `ActionInterfaceDelta` |
| Policy / capability support | `CapabilitySupportDelta` |
| Fitting boundary / routing | `CapabilityRoutingDelta` |
| Search / execution | `SearchExecutionDelta` |

通用的 Control Delta schema：

```json
{
  "id": "control_delta.unique_id",
  "source_finding": "audit_finding.id",
  "source_mechanism_profile": "mechanism_profile.id",
  "delta_type": "SpecificationDelta | ObservationDelta | BeliefRepresentationDelta | DynamicsWorldModelDelta | ActionInterfaceDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SearchExecutionDelta",
  "target_component": "system component to be changed",
  "change": "specific modification",
  "expected_effect": "which mechanism score should decrease",
  "side_effect_risks": ["new routing burden", "tool misuse", "latency", "proxy drift"],
  "validation": "how the delta will be checked",
  "regression_guard": "guard to prevent recurrence",
  "state_commitment_rule": "when this delta becomes active system state",
  "revocation_trigger": "when to remove or weaken the delta"
}
```

### 7.4 与回归护栏的集成

回归护栏应当具备机制感知。

一个结构性护栏可能会说：

```text
Do not allow SQL queries with disconnected join graphs.
```

而带机制感知的护栏会进一步说：

```text
Before rendering SQL, the system must produce a schema graph and enumerate the join path used by every table reference.
```

这样不仅能防止同一个聚合失败重现，还能治理产生该失败的信念 / 表征与搜索 / 执行机制。

### 7.5 与 Defect Ledger 的集成

Defect Ledger 应同时按原始失配与机制轴跟踪失败家族。

```json
{
  "defect_family": "wrong_sql_join_path",
  "primitive_mismatches": ["aggregation", "support"],
  "mechanism_axes": ["belief_representation", "search_execution"],
  "representative_cases": ["..."],
  "control_deltas": ["external_schema_graph", "join_path_enumeration"],
  "regression_guards": ["join_graph_connectivity_guard"],
  "known_amplifiers": ["large schema", "ambiguous foreign keys", "missing sample values"],
  "revocation_or_revision_conditions": ["new schema representation makes guard redundant"]
}
```

### 7.6 与 SGAR 的集成

只有通过转移规则被正式提交后，机制修复才应成为硬状态。

例子：

```text
S:
  System lacks SQL execution feedback.

A:
  Add SQL execution verifier.

O:
  Verifier returns execution result, error trace, row count, and timeout status.

V:
  The verifier is deterministic enough for the database snapshot and distinguishes syntax error, runtime error, empty result, and non-empty result.

S':
  SQL execution feedback is now an available mechanism component.
```

如果没有这一步提交，系统就可能只是叙述自己“将会使用执行反馈”，但实际行为仍然是纯语言生成器。

---

## 8. 复合机制链

### 8.1 各机制在因果上是耦合的

这八种机制并不是相互独立的模块。它们彼此影响：

```text
规格 → 观测选择
观测 → 信念状态
信念状态 → 路由与世界模型的使用
世界模型 → 动作规划
动作接口 → 反馈可得性
能力支持 → 候选空间
路由 → 激活哪一片支持区域
搜索 → 哪些候选被保住
评估 → 哪些候选被提交
```

这就是为什么复合失败如此常见。

### 8.2 常见链条：错误目标 → 错误搜索

```text
错误规格
  → 选择了错误证据
  → 激活了错误模式
  → 压窄了候选空间
  → 搜索收敛到错误区域
  → 验证器确认了错误代理
```

表面症状：

```text
系统没有找到那个好候选。
```

机制画像：

```text
primary: specification / reward
secondary: routing
amplifier: search / execution
```

修复顺序：

```text
1. 先修正目标。
2. 在新目标下修正路由。
3. 只有当候选空间被重新指向正确方向后，再扩大搜索。
```

### 8.3 常见链条：不可观测状态 → 错误世界模型 → 失败动作

```text
关键状态不可观测
  → 模型用默认先验填补缺口
  → 世界模型预测出现偏差
  → 动作计划错误
  → 执行失败被误诊为能力不足
```

表面症状：

```text
模型无法完成任务。
```

机制画像：

```text
primary: observation availability
secondary: dynamics / world model
amplifier: action / interface（若反馈也缺失）
```

修复顺序：

```text
1. 增加观测或澄清状态。
2. 把状态写入表征。
3. 验证动作后果。
```

### 8.4 常见链条：接口缺失 → 不可验证叙述 → 虚假完成

```text
所需动作不可用
  → 系统以语言描述替代执行
  → 没有环境反馈
  → 上下文声称任务已完成
  → SGAR 无法验证该转移
```

表面症状：

```text
代理说自己完成了任务，但实际上什么也没改变。
```

机制画像：

```text
primary: action / interface
secondary: dynamics / world model
runtime failure: missing SGAR commitment
```

修复顺序：

```text
1. 增加有效动作接口，或明确声明动作不可能执行。
2. 增加动作效果验证器。
3. 只提交经过验证的转移。
```

### 8.5 常见链条：能力存在 → 触发错误 → 被误判为支持失败

```text
能力其实存在
  → prompt 触发了错误角色或模式
  → 正确候选家族被压制
  → 采样反复产出低价值变体
  → 失败被误读为能力缺失
```

表面症状：

```text
模型从来生成不出正确类型的答案。
```

机制画像：

```text
primary: fitting boundary / routing
secondary: policy support（若改路由后候选先验仍弱）
amplifier: search / execution
```

修复顺序：

```text
1. 在不增加新事实的前提下测试模式和角色切换。
2. 如果能力出现，就治理路由。
3. 如果仍不出现，再增加能力支持。
4. 然后再扩大搜索。
```

---

## 9. 与审计工程的关系

审计工程指出：

```text
audit is not scoring;
audit is failure localization and write-back.
```

机制层把其中的“定位”步骤进一步细化了。

### 9.1 没有机制层之前

```text
Candidate
  → Audit
  → Failure Localization
  → Control Delta
  → Regression Guard
```

### 9.2 有了机制层之后

```text
Candidate
  → Audit Finding
  → Primitive Mismatch Diagnosis
  → Mechanism Profile
  → Minimal Intervention Probe
  → Control Delta
  → Regression Guard
  → Defect Ledger
```

### 9.3 为什么这很重要

没有机制层时，审计很容易对某种表面修法过拟合。

例子：

```text
Finding:
  The answer failed to consider execution feedback.

Bad direct delta:
  Tell the model to consider execution feedback.

Mechanism-aware diagnosis:
  The system has no action interface for execution, and no state transition that writes execution results back into state.

Better delta:
  Add execution tool, define error-return schema, create predict-execute-compare loop, and commit results through SGAR.
```

第二种修法改变了机制；第一种修法只改变了叙述。

---

## 10. 与知识治理的关系

知识治理把控制知识外化为有作用域、有证据、可撤销的对象。

机制画像决定了需要哪一类受治理知识。

| Mechanism bottleneck | Governed object |
|---|---|
| Specification / reward | rubric GKO; success-condition GKO; non-negotiable constraint GKO |
| Observation availability | observation sufficiency checklist; missing-variable ledger; source coverage record |
| Belief / representation | state table; schema graph; entity binding map; assumption ledger |
| Dynamics / world model | transition assumption; execution-feedback rule; calibration record |
| Action / interface | tool capability record; permission state; rollback rule; action schema |
| Capability support | operator library; example set; specialist module record |
| Capability routing | routing rule; mode state; trigger boundary GKO |
| Search / execution | search policy; branch record; verifier contract; checkpoint rule |

因此，机制画像也帮助我们判断：什么应当成为 GKO、受治理升级对象（Governed Escalation Object / GEO）、guard 或硬状态记录。

---

## 11. 与 SGAR 的关系

SGAR 区分叙述性上下文与硬状态权威。

机制修复通常就是一种系统改动：

```text
- 增加了一个新工具；
- 一个 verifier 变成权威；
- 一条 routing rule 被激活；
- 一个 rubric 被修订；
- 一种状态表征成为 canonical；
- 一条搜索策略被改变；
- 一个数据源变得可用；
- 一个能力模块被安装。
```

这些变化不能只存在于 prompt 文本中。它们应当成为被正式提交的状态转移。

通用转移：

```text
S + A → O → V → S'
```

机制修复版本：

```text
S:
  current mechanism profile and available components

A:
  proposed mechanism delta

O:
  observed effect of delta or validation result

V:
  commitment criterion for accepting the delta

S':
  updated system mechanism state
```

这样可以防止“修复剧场”：系统声称自己增加了修复，但后续行为并没有变化。

---

## 12. 案例一：Text-to-SQL

### 12.1 失败实例

一个自然语言问题被映射为数据库 schema 上的 SQL。生成出的 SQL 可以执行，但因为用了错误的 join 路径和过强的谓词，返回了错误答案。

表面症状：

```text
Wrong SQL query.
```

原始失配诊断：

```text
aggregation mismatch:
  SELECT / JOIN / WHERE clauses are locally plausible but globally inconsistent.

support mismatch:
  correct join path did not become a live candidate.

observation-representation mismatch:
  schema semantics and sample values were not fully operationalized.
```

### 12.2 机制画像

| Mechanism axis | Diagnosis |
|---|---|
| Specification / reward | Medium: execution success was over-weighted relative to semantic correctness. |
| Observation availability | Medium: foreign-key metadata and sample values were only partially visible. |
| Belief / representation | High: schema was visible but not converted into a usable schema graph. |
| Dynamics / world model | Medium: the model predicted query behavior without checking result shape. |
| Action / interface | Low or none if SQL execution is available; high if no execution interface exists. |
| Capability support | Medium: rare join pattern had weak prior. |
| Capability routing | High: generic SQL generation triggered before schema audit and join search. |
| Search / execution | High: join-path alternatives were not enumerated or compared. |

### 12.3 修复定位

一个糟糕的修法会是：

```text
Prompt the model to be more careful with SQL joins.
```

一个具备机制感知的修法是：

```text
BeliefRepresentationDelta:
  Build schema graph with table nodes, column nodes, foreign keys, semantic aliases, and sample values.

CapabilityRoutingDelta:
  Route all multi-table questions into schema-audit mode before SQL rendering.

SearchExecutionDelta:
  Enumerate join-path candidates and run execution checks.

SpecificationDelta:
  Distinguish executable SQL from semantically correct SQL.
```

### 12.4 回归护栏

一个真正有牙齿的护栏，在缺陷被重新引入时必须失败：

```text
For each multi-table SQL query:
  1. require explicit join-path object before SQL rendering;
  2. require every table reference to be connected in the schema graph;
  3. run SQL against the database snapshot;
  4. check result shape and semantic predicate coverage;
  5. fail if the SQL uses a disconnected or unsupported join path.
```

### 12.5 SGAR 提交

```text
S:
  no canonical schema graph, direct SQL rendering allowed.

A:
  introduce schema graph and join-path enumeration.

O:
  system emits schema graph, join candidates, selected path, SQL, execution result.

V:
  selected path is graph-connected, query executes, semantic checks pass.

S':
  schema-graph-first rendering becomes committed workflow for multi-table questions.
```

---

## 13. 案例二：金融事件策略

### 13.1 失败实例

系统评估一个“涨停 / 兴奋度事件策略”，却过早把它判定为不可部署，因为它缺少某些所谓正交数据，或没能通过一种 benchmark 风格的因子审计。

表面症状：

```text
Premature No-Go judgment.
```

原始失配诊断：

```text
specification mismatch:
  wrong objective: benchmark excess / generic factor quality instead of deployable event-strategy return.

fitting-boundary mismatch:
  risk-control and anti-overfitting audit mode over-trigger.

support mismatch:
  event-specific operator family and conditional alpha structures are not explored.

state mismatch:
  post-event attention-continuation state is not represented.
```

### 13.2 机制画像

| Mechanism axis | Diagnosis |
|---|---|
| Specification / reward | High: wrong success criterion selected. |
| Observation availability | Medium: intraday, theme, sector, order-book, transaction-cost data may be missing. |
| Belief / representation | High: event-state is not represented as a trackable condition. |
| Dynamics / world model | High: next-day buyability and multi-day continuation are guessed. |
| Action / interface | Medium or high: no backtester or operator generator available. |
| Capability support | High: event-operator family is weak or absent. |
| Capability routing | Critical: system enters No-Go audit instead of mechanism-to-operator search. |
| Search / execution | High: only narrow variables are explored. |

### 13.3 修复定位

主要问题并不只是“多一些数据”。更合理的干预顺序是：

```text
1. SpecificationDelta:
   redefine objective around buyability, absolute net return, cost, slippage, capacity, and multi-day continuation.

2. BeliefRepresentationDelta:
   represent post-event attention continuation as a state variable.

3. DynamicsWorldModelDelta:
   verify next-day buyability and holding-period assumptions against real data or backtest feedback.

4. CapabilityRoutingDelta:
   enter mechanism-to-operator construction mode before No-Go audit.

5. CapabilitySupportDelta:
   add event-specific operator families.

6. SearchExecutionDelta:
   run combinatorial search under corrected objective and routing.

7. ObservationDelta:
   add new data only when it provides irreplaceable information gain under the corrected specification.
```

这样可以避免一种常见失败：一边持续优化错误目标、以错误模式工作，一边把所有问题都解释成“数据不够”。

---

## 14. 案例三：使用工具的代码代理

### 14.1 失败实例

一个代理在编辑代码后声称自己修复了 bug，但实际上没有跑测试，补丁还导入了不存在的 API，系统却把任务标成完成。

原始失配诊断：

```text
observation-representation mismatch:
  test results and API availability did not enter state.

state mismatch:
  completion state was incorrectly inferred.

aggregation mismatch:
  local patch plausibility did not compose into working code.

specification mismatch:
  "patch written" was treated as "bug fixed".
```

### 14.2 机制画像

| Mechanism axis | Diagnosis |
|---|---|
| Specification / reward | High: completion criterion is wrong. |
| Observation availability | High: tests and dependency metadata absent. |
| Belief / representation | Medium: patch state not separated from verified fix state. |
| Dynamics / world model | High: code behavior predicted rather than executed. |
| Action / interface | High if tests cannot be run; low if test tool exists. |
| Capability support | Low to medium depending on code complexity. |
| Capability routing | Medium: agent routed into completion narration instead of verification. |
| Search / execution | Medium: no rollback/checkpoint after failed test. |

### 14.3 具备机制感知的修复

```text
SpecificationDelta:
  Define "fixed" as passing relevant tests or verified reproduction case, not merely patch generation.

ObservationDelta:
  Expose test output, dependency versions, and runtime errors.

DynamicsWorldModelDelta:
  Require predict-run-compare for code changes.

ActionInterfaceDelta:
  Provide sandboxed test execution and rollback.

CapabilityRoutingDelta:
  Route after patch generation into verification mode.

SearchExecutionDelta:
  Maintain patch checkpoints and branch from test failures.

SGAR transition:
  Completion state can be committed only after verifier accepts test or reproduction evidence.
```

---

## 15. 使用原则与局限

### 15.1 机制名称不是证据

把某次失败叫作“routing mismatch”，并不能证明路由就是原因。每一项机制判断都应附带证据：

```text
- a reproducible failure instance;
- a minimal intervention probe;
- an observed change;
- a stated confidence level;
- a revocation trigger.
```

如果没有证据，画像就应写成：

```text
hypothesis, not distinguished
```

### 15.2 一次干预可能影响多个机制

干预并不是纯净分离的。

```text
RAG may add observation and capability support.
Tool execution may expand action space and calibrate world model.
Structured prompting may repair representation and change routing.
A stronger model may improve support, representation, and routing simultaneously.
```

因此，修复记录应说明它预期改变的是哪个中间变量，而不只是报告最后结果变好了。

### 15.3 更大的模型不是通用修复

扩大模型可能改善表征、支持与世界建模。但它不会自动修复：

```text
wrong objectives;
unobservable variables;
missing permissions;
invalid action interfaces;
incorrect evaluators;
state commitment failures;
wrong routing boundaries.
```

它还可能让错误答案更流畅、让错误路由更稳定。

### 15.4 更大的搜索不是默认修法

更大的搜索只在以下条件下才真正有用：

```text
correct objective;
sufficient observations;
usable representation;
available action space;
adequate capability support;
correct routing;
recognizable candidate quality.
```

否则，更大的搜索只是在更充分地优化错误目标、搜索错误空间，或产生更多同类失败的精致变体。

### 15.5 更多工具不是默认修法

工具有帮助，是因为它们能以可验证方式扩展有效动作或观测空间。它们也可能带来伤害，当：

```text
tool selection is misrouted;
tool outputs are not represented;
permissions are unclear;
errors are swallowed;
state transitions are not committed;
irreversible actions lack gates;
search burden increases without verifier authority.
```

### 15.6 机制修复应当可撤销

机制诊断不应变成永久教条。每个机制级修复都应明确：

```text
support scope;
known counterexamples;
side-effect risks;
dependent tool/model/data versions;
review date;
revocation trigger.
```

---

## 16. 对机制层自身的自审计

机制层本身也应被当成一个理论对象来治理。

```json
{
  "id": "gko.formal_mechanism_layer",
  "type": "theoretical_claim",
  "condition": "LLM systems analyzed as approximate decision systems with objectives, observations, belief state, world model, action space, policy support, routing, and search/execution procedures.",
  "assertion": "Failures can be localized for repair along eight intervenable mechanism axes: specification/reward, observation availability, belief/representation, dynamics/world model, action/interface, policy/capability support, fitting-boundary/routing, and search/execution.",
  "strength": "structural-intervention claim",
  "support_scope": "Repair localization for governed LLM systems, agents, tool-using workflows, and high-value inference-time systems.",
  "not_supported_claims": [
    "Does not replace the six primitive mismatches.",
    "Does not claim each failure has exactly one mechanism cause.",
    "Does not claim the eight axes are causally independent.",
    "Does not claim minimal intervention probes are always clean or cheap."
  ],
  "revocation_trigger": "Discovery of a recurring, repair-relevant system component that cannot be represented as objective, observation, belief/representation, dynamics/world model, action/interface, support, routing, or search/execution without losing intervention specificity."
}
```

一个经过自审计的理论，必须明确说明：什么样的发现会迫使它修正自身。

---

## 17. 压缩操作协议

对于一个具体失败，可使用如下协议：

```text
1. Freeze the failure instance.
   Record input, context, tools, model, prompt, budget, output, evaluator, and expected success criterion.

2. Identify primitive mismatch symptoms.
   observation-representation, state, fitting-boundary, support, aggregation, specification.

3. Build mechanism hypotheses.
   specification, observation, belief, dynamics, action, support, routing, search.

4. Run minimal intervention probes where useful.
   Change one dominant component at a time.

5. Assign causal roles.
   primary cause, secondary cause, necessary condition, amplifier, downstream symptom, not distinguished.

6. Produce Control Delta.
   Modify the component that mechanism diagnosis identifies.

7. Add Regression Guard.
   Ensure representative recurrence of the defect fails.

8. Commit through SGAR.
   Only verified repair becomes hard state.

9. Record in Defect Ledger.
   Store failure family, mechanism profile, deltas, guards, and revocation rules.
```

---

## 18. 结论

形式化机制层补上了受治理 LLM 理论栈中的一座关键桥梁。

六类原始失配解释了任务价值如何在结构上流失。但仅有结构性诊断，并不能决定究竟该修改哪个组件。机制层把失败定位到八条可干预的系统轴：规格 / 奖励、观测可得性、信念 / 表征、动态 / 世界模型、动作 / 接口、策略先验 / 能力支持、拟合边界 / 能力路由，以及搜索 / 执行。

机制画像不是装饰性的标签，而是修复定位对象。它记录：哪些组件是主要原因，哪些是放大器，哪些是下游症状，哪些最小干预证据支持这个判断，应当施加哪些控制增量，应当增加哪些回归护栏，以及应当提交哪种状态转移。

这一层也解释了为什么很多常见修法会失败。更大模型不能修复缺失观测、错误目标、不可用动作或未提交状态。更大搜索在系统搜索错误空间时没有帮助。更多工具在工具结果未被表示、路由、验证或提交时同样无效。更好的 prompt 也无法修复缺失的动作接口或错误的世界模型。

机制层把诊断转化为“系统手术”的问题：

```text
What exactly must be changed so that the same failure family does not recur?
```

最简短地说：

> 六类原始失配先找到病灶；任务对象把病灶暴露成可审计组织；机制层解释系统解剖；审计 delta 执行动刀。

---

## Appendix A: 机制检查清单

```text
Specification / Reward
[ ] Is the true objective explicitly stated?
[ ] Are proxy metrics distinguished from true utility?
[ ] Does the evaluator rank candidate pairs correctly?
[ ] Are non-negotiable constraints represented?
[ ] Are Goodhart risks identified?

Observation Availability
[ ] Did all task-critical variables enter the system?
[ ] Are timestamps, versions, and coverage known?
[ ] Is raw evidence available where summaries are insufficient?
[ ] Can the system ask clarifying questions or retrieve missing data?

Belief / Representation
[ ] Are facts, assumptions, decisions, and open questions separated?
[ ] Are entities, dates, units, tables, and columns bound correctly?
[ ] Is state externalized rather than held in narrative context?
[ ] Are dependencies represented explicitly?

Dynamics / World Model
[ ] Are action consequences predicted or checked?
[ ] Is execution feedback available?
[ ] Are tests, sandboxes, simulators, or backtests used when needed?
[ ] Are prediction errors written back into state?

Action / Interface
[ ] Is the required action actually callable?
[ ] Does the tool schema express the needed operation?
[ ] Are permissions and rollback gates defined?
[ ] Are action results observable and verifiable?

Capability Support
[ ] Is the correct candidate family in effective support?
[ ] Do repeated samples diversify into high-value structures?
[ ] Are examples, retrieval, specialist models, or operators needed?
[ ] Is capability absence distinguished from routing failure?

Capability Routing
[ ] Is the right mode triggered?
[ ] Are over-triggering and under-triggering cases known?
[ ] Would role/mode changes elicit the missing capability?
[ ] Are routing rules explicit, auditable, and revocable?

Search / Execution
[ ] Is the correct candidate reachable under budget?
[ ] Is the candidate preserved through planning and execution?
[ ] Is there backtracking, branching, ranking, or independent verification?
[ ] Are checkpoints and failed branches recorded?
```

---

## Appendix B: 紧凑 Schema Bundle

### B.1 Mechanism Profile

```json
{
  "id": "mechanism_profile.id",
  "failure_instance": "...",
  "primitive_mismatches": ["..."],
  "mechanism_scores": {
    "specification_reward": "...",
    "observation_availability": "...",
    "belief_representation": "...",
    "dynamics_world_model": "...",
    "action_interface": "...",
    "capability_support": "...",
    "capability_routing": "...",
    "search_execution": "..."
  },
  "causal_roles": {
    "primary_cause": ["..."],
    "secondary_causes": ["..."],
    "necessary_conditions": ["..."],
    "amplifiers": ["..."],
    "downstream_symptoms": ["..."],
    "not_distinguished": ["..."]
  },
  "minimal_intervention_probes": ["..."],
  "recommended_control_deltas": ["..."],
  "regression_guards": ["..."],
  "confidence": "low | medium | high",
  "revocation_trigger": "..."
}
```

### B.2 具备机制感知的 Audit Finding

```json
{
  "id": "audit_finding.id",
  "artifact": "...",
  "finding": "...",
  "evidence": ["..."],
  "primitive_mismatch": ["..."],
  "mechanism_profile": "mechanism_profile.id",
  "severity": "low | medium | high | critical",
  "mechanism_axis": "...",
  "control_delta": "control_delta.id",
  "regression_guard": "regression_guard.id",
  "confidence": "low | medium | high"
}
```

### B.3 具备机制感知的 Control Delta

```json
{
  "id": "control_delta.id",
  "delta_type": "SpecificationDelta | ObservationDelta | BeliefRepresentationDelta | DynamicsWorldModelDelta | ActionInterfaceDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SearchExecutionDelta",
  "source_finding": "audit_finding.id",
  "source_mechanism_profile": "mechanism_profile.id",
  "target_component": "...",
  "change": "...",
  "expected_effect": "...",
  "validation": "...",
  "regression_guard": "...",
  "state_commitment_rule": "...",
  "side_effect_risks": ["..."],
  "revocation_trigger": "..."
}
```

---

## Appendix C: 术语表

| Term | Definition |
|---|---|
| Primitive mismatch | 世界到输出管线中的任务价值结构性失败模式。 |
| Mechanism axis | 一个可被干预、可产生或修复失败的系统组件。 |
| Mechanism Profile | 带证据的记录：哪些机制轴参与了失败，以及它们如何参与。 |
| Minimal Intervention Probe | 用于区分机制原因的小型受控改动。 |
| Control Delta | 对受治理控制空间或系统组件的一次局部修改。 |
| SpecificationDelta | 对目标、rubric、代理指标或验收标准的修复。 |
| ObservationDelta | 对观测通道、数据接入、缺失变量或测量的修复。 |
| BeliefRepresentationDelta | 对结构化状态、实体绑定、记忆、schema 或表征的修复。 |
| DynamicsWorldModelDelta | 通过反馈或校准修复对动作后果的预测。 |
| ActionInterfaceDelta | 对可用工具、API、权限、schema 或工作流门槛的修复。 |
| CapabilitySupportDelta | 通过范例、检索、专家模块或算子扩展候选支持的修复。 |
| CapabilityRoutingDelta | 对触发边界、模式、角色或路由器的修复。 |
| SearchExecutionDelta | 对采样、分支搜索、验证、排序、检查点或执行流程的修复。 |
| GKO（受治理知识对象 / Governed Knowledge Object） | 把控制知识外化后得到的对象，具有作用域、有证据、可撤销。 |
| GEO（受治理升级对象 / Governed Escalation Object） | 记录失败应在何时、以何种方式升级给人类或更高权威处理的治理对象。 |
| SGAR（状态治理智能体范式 / State-Governed Agent Regime） | 区分叙述性上下文与硬状态权威、只提交经过验证的状态转移的机制。 |
| SGAR commitment | 使修复、动作或状态更新成为权威的硬状态转移。 |
