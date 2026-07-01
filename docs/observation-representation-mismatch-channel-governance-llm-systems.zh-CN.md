# LLM 系统中的观测-表征失配与通道治理

**变量进入、表征上限与前治理修复**  
**《LLM 系统中价值保存的结构理论》的配套技术报告**  
**工作稿 v0.1**  

---

## 目录

- [摘要](#摘要)
- [1. 引言](#1-引言)
- [2. 在统一理论中的位置](#2-在统一理论中的位置)
- [3. 形式化设定](#3-形式化设定)
- [4. 观测-表征失配与状态失配](#4-观测-表征失配与状态失配)
- [5. 观测-表征失败分类](#5-观测-表征失败分类)
- [6. 表征诱导上限](#6-表征诱导上限)
- [7. 变量进入标准](#7-变量进入标准)
- [8. 通道治理](#8-通道治理)
- [9. 观测-表征失配的审计工程](#9-观测-表征失配的审计工程)
- [10. 与其他失配的相互作用](#10-与其他失配的相互作用)
- [11. Text-to-SQL 作为典型案例](#11-text-to-sql-作为典型案例)
- [12. 代码、Agent 与研究工作流](#12-代码agent-与研究工作流)
- [13. 通道治理设计模式](#13-通道治理设计模式)
- [14. 与既有形式传统的关系](#14-与既有形式传统的关系)
- [15. 什么时候不需要通道治理](#15-什么时候不需要通道治理)
- [16. 概念自审计](#16-概念自审计)
- [17. 最小诊断清单](#17-最小诊断清单)
- [18. 结论](#18-结论)
- [Appendix A: 紧凑术语表](#appendix-a-紧凑术语表)
- [Appendix B: 表征契约模板](#appendix-b-表征契约模板)
- [Appendix C: 观测-表征审计发现模板](#appendix-c-观测-表征审计发现模板)
- [Appendix D: 变量进入测试](#appendix-d-变量进入测试)

---

## 摘要

大型语言模型（LLM）系统并不直接作用于世界。它们作用于观测、检索片段、压缩上下文、数据库 schema、工具输出、截图、日志、摘要、embedding、序列化状态和 prompt 表征。因此，许多高价值失败发生在推理开始之前。

决定性变量不是被推理错了，而是根本没有进入可操作表征；或者它虽然进入了，却以混叠、扁平化、去语境化、截断、过期、未绑定或无法用于控制的形式进入。

本文把 **观测-表征失配** 展开为 LLM 系统价值保存结构理论中的第一类原始失配。若 `S_world` 是任务世界，`φ` 是观测函数，`ψ` 是表征函数，`Z = ψ(φ(S_world))` 是模型可访问的控制表征，那么当 `S_world` 中与任务价值相关的区分在 `Z` 中被折叠，或在操作上不可访问时，就发生观测-表征失配。

其结果是一个 **表征诱导上限**：在同一个 `Z` 上继续推理、批判、重排或自我反思，都无法可靠恢复上游已经丢失的价值。

本文澄清观测-表征失配与状态失配的边界。状态失配问的是：在已有表征下，我们处于哪个潜在状态？观测-表征失配问的是：为了区分状态或价值而需要的变量，是否已经进入表征？前者是给定表征下的推断问题；后者是进入表征之前的转导问题。

随后本文引入 **通道治理**：一种发生在知识治理之前的前治理纪律，用来确保价值关键变量进入通道、在表征中存活、被正确绑定、保持可区分，并成为控制空间中的可操作变量。

系统在治理任务知识之前，必须先治理任务得以可见的通道。

本文给出形式定义、诊断标准、修复算子、审计模式、受治理知识对象（Governed Knowledge Object / GKO）模板、回归护栏，以及 text-to-SQL、代码系统、工具型 agent、研究工作流和长程状态治理 agent 中的例子。中心规则很简单：

```text
在治理知识之前，先验证被治理的变量已经进入表征。
```

### 与 Diagnostic–Mechanism Bridge 的关系

本文使用六类原始失配作为价值保存诊断。当失败进入修复阶段时，应通过 Diagnostic–Mechanism Bridge 把诊断映射到八轴机制目标与修复层：

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

---

## 1. 引言

面对 LLM 失败，一个常见反应是让模型“更认真地推理”。系统加入 chain-of-thought、批判、反思、辩论、自一致性、规划、检索或工具使用。这些技术有价值，但它们共享一个隐藏假设：模型可获得的表征包含了解决任务所需的变量。

这个假设经常失败。

模型无法推断从未检索到的数据库值。它无法基于已经从 prompt 中被扁平化掉的 schema 关系推理。若日志窗口漏掉了相关事件，它就无法保存时间依赖。若接口把两个用户意图压缩成同一个摘要，它就无法区分它们。若压缩移除了触发证据，它就无法路由到专门审计能力。若观测权威只向模型传递工具结果的叙事性转述，它就无法让状态转移可信。

在这些情形中，问题不是模型抽象意义上不够聪明。问题是任务的决定性结构没有进入模型可访问的控制表征。

本文研究这种失败模式。

我们称之为 **观测-表征失配**。它是价值保存管线中的第一站：

```text
S_world --φ--> O --ψ--> Z
```

其中：

- `S_world` 是底层任务世界：数据库、代码库、市场状态、用户情境、文档语料、环境或工作流状态。
- `φ` 是观测函数：感知、日志、检索、数据库查询、截图捕获、文件读取、API 调用、用户描述或工具输出。
- `O` 是被观测数据。
- `ψ` 是表征函数：编码、tokenization、prompt 构造、schema 序列化、摘要、embedding、压缩、过滤或格式化。
- `Z` 是模型和周边系统使用的操作表征。

当 `S_world → O → Z` 没有保存任务相关区分时，就发生观测-表征失配。一旦区分丢失，下游推理面对的就不再是任务本身，而是任务的一个投影。

因此，观测-表征失配必须被看作原始失配，而不是幻觉、缺上下文或弱推理的特殊情况。它在管线中有独立位置，有独立失败机制，也有独立修复目标。

修复目标首先不是更好的文字，而是通道修复：

```text
repair the measurement
repair the retrieval
repair the schema
repair the serialization
repair the binding
repair the provenance
repair the update path
repair the representation contract
```

只有在这些修复之后，普通知识治理才真正有意义。围绕一个缺失或混叠变量建立受治理知识对象，不是治理；那只是对投影进行治理。

---

## 2. 在统一理论中的位置

价值保存结构理论把 LLM 系统建模为从世界到输出的管线：

```text
S_world
  -- φ --> O
  -- ψ --> Z
  -- ρ --> activated capabilities
  -- pθ --> candidate support
  -- A --> output aggregation
  -- Ũ / U --> evaluation
```

六类原始失配对应这条管线中的不同结构站点：

| 管线站点 | 原始失配 | 问题 |
|---|---|---|
| `S_world → O → Z` | 观测-表征失配 | 决定性变量是否进入操作表征？ |
| `Z → latent state` | 状态失配 | 给定表征，我们处在哪个潜在状态？ |
| `Z → capability activation` | 拟合边界失配 | 正确能力是否在正确领域被激活？ |
| `pθ` 与搜索预算 | 支持失配 | 高价值结构在策略和预算下是否可达？ |
| 局部部分 → 全局产物 | 聚合失配 | 局部好片段能否组合成全局价值？ |
| 可访问代理目标 vs 真实效用 | 规格失配 | 评价器是否代表真实任务价值？ |

观测-表征失配是第一站，因为后续操作都依赖表征。若价值关键变量在 `Z` 中缺失或混叠，下游系统仍可能显得很复杂：它可以规划、批判、检索、辩论、修订、验证。但这些操作都被限制在 `Z` 的信息几何中。

关键后果是一个上限：

```text
任何作用在 Z 上的下游策略，都无法可靠超过 S_world → O → Z 中丢失区分所诱导的价值上限。
```

这就是为什么观测-表征失配必须位于知识治理、审计工程和状态治理智能体范式（State-Governed Agent Regime / SGAR）之前。

知识治理治理控制知识。但控制知识必须关于已经进入控制表征的变量。

审计工程定位失败，并把发现写回控制空间。但审计发现需要暴露相关缺陷的证据通道。

SGAR 提交状态转移。但一个转移的可信度取决于授权它的观测与验证通道。

因此，观测-表征失配不是外围问题。它是所有后续治理的基底。

---

## 3. 形式化设定

令 `S` 表示可能世界状态空间，`A` 表示可能行动或输出空间，`U(a, s)` 表示在世界状态 `s` 中行动 `a` 的真实任务效用。

系统并不直接观测 `s`。它观测：

```text
O = φ(s)
```

并构造操作表征：

```text
Z = ψ(O) = ψ(φ(s))
```

下游策略从 `Z` 中选择行动：

```text
π: Z → A
```

在表征 `Z` 下可达到的最佳价值是：

```text
V_Z = max_π E_s [ U(π(Z(s)), s) ]
```

直接访问 `S` 时可达到的最佳价值是：

```text
V_S = max_π E_s [ U(π(s), s) ]
```

当以下不等式成立时，就存在表征诱导上限：

```text
V_Z < V_S
```

这个差距不一定来自弱推断。它可能来自 `φ` 或 `ψ` 引入的粗化。

### 3.1 表征诱导的等价类

表征 `Z` 在世界状态上诱导一个等价关系：

```text
s1 ~_Z s2  iff  Z(s1) = Z(s2)
```

若两个世界状态映射到同一个操作表征，策略就必须为二者选择同一个行动：

```text
Z(s1) = Z(s2)  ⇒  π(Z(s1)) = π(Z(s2))
```

如果这些状态的最优行动不同：

```text
argmax_a U(a, s1) ≠ argmax_a U(a, s2)
```

那么任何基于 `Z` 的确定性策略都不可能同时对二者最优。即便随机策略也无法完全恢复丢失区分，除非任务效用结构恰好奖励这种混合押注。

这就是观测-表征失配的核心。

### 3.2 控制充分性

如果被 `Z` 折叠到一起的所有世界状态具有相同的最优控制含义，那么 `Z` 对该任务就是 **控制充分** 的。

形式化地，当以下条件成立时，`Z` 是控制充分的：

```text
Z(s1) = Z(s2)  ⇒  Argmax_a U(a, s1) = Argmax_a U(a, s2)
```

或者，在较弱意义上，若在每个等价类上使用同一行动造成的价值损失低于可接受阈值，则可以视为足够。

当 `Z` 不是控制充分的，就存在观测-表征失配。

### 3.3 变量进入

令 `V*` 是任务关键变量集合。变量 `v ∈ V*` 只有满足五个条件，才算 **进入** 操作表征：

1. **被观测**：通道 `φ` 捕获了关于 `v` 的信息。
2. **被保留**：表征函数 `ψ` 没有擦除或折叠 `v`。
3. **被绑定**：`v` 与正确实体、时间、来源、schema 元素或状态相连。
4. **可区分**：`v` 的变化会产生系统可区分的 `Z` 变化。
5. **可操作**：系统能够用 `v` 进行路由、搜索、审计、渲染、验证或状态更新。

一个变量并不会因为上下文中出现了与它相关的字符串，就算真正存在。只有它能影响控制，才算进入表征。

例子：

```text
数据库列名出现了，但语义含义没有绑定。
日志行出现了，但时间关系丢失了。
用户偏好被摘要了，但例外条件被擦除了。
schema 被检索了，但外键约束被省略了。
工具结果被转述了，但精确值和来源被移除了。
文档被 embedding 了，但检索 chunk 漏掉了改变解释的表格脚注。
```

这些情况下，变量可能文本上存在，却在控制上缺席。

---

## 4. 观测-表征失配与状态失配

观测-表征失配与状态失配关系紧密，但并不相同。

状态失配问：

```text
Given Z, which latent state h are we in?
```

观测-表征失配问：

```text
Did the variables required to distinguish task-relevant states or utilities enter Z?
```

边界如下：

| 问题 | 观测-表征失配 | 状态失配 |
|---|---|---|
| 管线位置 | `S_world → O → Z` | 基于 `Z` 对潜在状态推断 |
| 核心失败 | 变量或区分在推理前丢失 | 已有表征下状态仍然歧义 |
| 典型症状 | 模型无法考虑决定性因素 | 模型能看到多个可能状态，但误判或未分支 |
| 修复目标 | 测量、检索、序列化、schema、通道、表征 | 状态枚举、判别器、澄清、信念更新、分支策略 |
| 关键问题 | 变量进入了吗？ | 在已进入变量下，我们处在哪个状态？ |

即便通道修复完成，状态失配也可能存在。例如，用户提供了所有可得症状，但诊断仍不确定。这是状态歧义。

观测-表征失配发生在相关症状从未被收集、被摘要掉，或以模型无法使用的方式表示时。

修复不同。状态失配邀请：

```text
ask a clarifying question
maintain multiple hypotheses
compute value of information
branch policy by state
track belief updates
```

观测-表征失配邀请：

```text
collect a missing variable
change the retrieval query
inspect the raw file
include exact tool output
preserve schema constraints
repair serialization
avoid lossy compression
```

如果系统把观测-表征失配当作状态失配，它可能在贫瘠表征上生成优雅的不确定性。如果把状态失配当作观测-表征失配，它又可能过度收集数据，而真正需要的是更好的推断或分支。

---

## 5. 观测-表征失败分类

观测-表征失配不是一种表面错误，而是一组上游价值保存失败。

### 5.1 缺失通道

系统没有捕获任务关键变量的通道。

```text
代码 agent 不能读取决定测试行为的环境变量。
text-to-SQL 系统在问题依赖数值分布时不能查看数据库值。
研究助手无法访问定义结果变量的方法附录。
agent 没有读取文件系统状态，却声称文件已完成。
```

修复需要增加或授权通道，而不是只改 prompt。

### 5.2 选择性检索失败

信息存在于语料中，但检索没有把它暴露出来。

这不只是 RAG 质量问题。检索是 `φ` 与 `ψ` 的一部分。若检索选出的 chunk 漏掉决定性条件，下游生成面对的就是扭曲世界。

修复目标包括查询扩展、chunk 边界重设、元数据检索、表格感知检索、引用扩展和覆盖率审计。

### 5.3 压缩擦除

系统摘要或压缩上下文时，删除了之后变得决定性的变量。

压缩在保存控制相关结构时有用；当它优化叙事连贯性而不是未来控制时，就很危险。

```text
"用户想要简洁专业语气"擦除了"除非写给技术评审"这一例外。
"任务涉及销售数据"擦除了日期范围和排除标准。
"测试因配置失败"擦除了确切失败断言。
```

修复需要保存来源的压缩和变量保留规则。

### 5.4 Schema 扁平化

结构关系被压成自然语言或列表，导致约束被破坏。

这常见于 text-to-SQL、代码分析、知识图谱、电子表格和工作流系统。

```text
数据库 schema 中省略外键。
电子表格公式只被渲染成显示值。
类继承关系被压成文件摘要。
API 类型被描述时丢掉 required/optional 字段约束。
```

修复要求把结构作为结构保存，而不只是写成 prose。

### 5.5 格式诱导混叠

表征格式把不同值折叠为不可区分的形式。

```text
四舍五入导致数值精度丢失。
测量单位被省略。
不同数据库列使用同一个显示名。
时区被错误规范化。
ID 被替换成不唯一的人类可读名称。
```

修复需要消歧标识符、单位、精度和来源。

### 5.6 时间快照失配

表征反映的是动态世界中的错误时间片。

```text
agent 上下文说任务未完成，但工具已经完成。
检索到的文档已经过时。
日历可用性在摘要后改变。
市场状态在缓存观测后改变。
文件内容在初始读取后改变。
```

修复需要带时间戳的观测、freshness 规则、状态失效和重新观测触发器。

### 5.7 工具结果贫化

工具返回丰富信息，但系统只把简化或转述版本传给模型。

```text
执行结果包含错误码、栈和 stderr，但 prompt 只写"failed"。
数据库查询返回行和类型，但 prompt 只写行数。
网页抽取省略表格、标题或脚注。
静态分析器返回位置，但摘要丢失行号。
```

修复要求在精度重要时保存精确工具输出，并让摘要附着在原始证据上，而不是替代原始证据。

### 5.8 绑定失败

变量进入了表征，但绑定到错误实体、列、时间、来源、用户或作用域。

```text
"revenue" 被绑定到 gross revenue，而不是 net revenue。
"current version" 被绑定到训练数据中的库版本，而不是已安装版本。
"last quarter" 被绑定到自然季度，而不是财务季度。
"customer" 被绑定到账户 owner，而不是终端用户。
```

绑定失败很危险，因为表征看似完整，但控制是错的。

### 5.9 负空间失败

系统无法表征预期证据的缺席。

```text
两张表之间不存在外键。
没有行匹配某个谓词。
没有测试覆盖被改变的行为。
没有列出 policy exception。
某时间戳之后没有事件发生。
```

许多 LLM 表征偏向已有文本。但缺席也可能是决定性的。通道治理必须把负证据作为一等观测。

### 5.10 权威折叠

表征无法区分权威观测与猜测、摘要、过时记忆、模型生成声称或用户猜测。

```text
模型生成计划和已验证工具结果并列存储。
人类假设和数据库事实并列存储。
旧记忆和当前观测并列存储。
未验证摘要和 commit 记录并列存储。
```

修复需要来源、权威标签和提交状态。

---

## 6. 表征诱导上限

观测-表征失配最重要的理论后果，是它会创造任何下游策略都无法可靠突破的上限。

### Claim（informal）：表征诱导的价值上限

观测-表征失配会在下游性能上引入一个上限。

这是一个结构性论证，而不是完全形式化的证明。它的作用是标记表征层面对可恢复任务价值的上限。

令 `S` 表示世界状态，`O` 表示观测，`Z = ψ(O)` 表示系统的操作性表征。令 `V(S)`、`V(O)` 和 `V(Z)` 分别表示：只能条件化于 `S`、`O` 与 `Z` 的策略所能达到的最佳期望任务效用。

由于 `Z` 是 `O` 的后处理，而 `O` 又只是 `S` 的部分观测：

```text
V(S) ≥ V(O) ≥ V(Z)
```

如果两个任务相关的世界状态以正概率被折叠进同一个 `Z`，且它们需要不同最优行动，那么：

```text
V(S) > V(Z)
```

这就是表征诱导的价值上限。一旦决定性区分在 `Z` 之前就被折叠，任何只受限于 `Z` 的下游策略，都无法在没有额外观测、通道修复或表征修复的情况下稳定恢复这部分价值。

假设两个世界状态 `s1` 和 `s2` 被映射为同一表征：

```text
Z(s1) = Z(s2)
```

但它们需要不同最优行动：

```text
a1* = argmax_a U(a, s1)
a2* = argmax_a U(a, s2)
a1* ≠ a2*
```

基于 `Z` 的策略必须为二者选择同一个行动。因此，至少一个状态会得到次优行动。这不是推理不足，而是表征折叠的后果。

### 6.1 确定性策略下的上限

若 `π(Z(s1)) = π(Z(s2))`，那么：

```text
U(π(Z(s1)), s1) < U(a1*, s1)
```

或：

```text
U(π(Z(s2)), s2) < U(a2*, s2)
```

除非同一行动恰好对两个状态都最优。

### 6.2 随机策略下的上限

随机策略可以随机化，但随机化不会恢复丢失区分。它最多只能基于等价类内的条件状态分布押注：

```text
π(a | Z=z)
```

若任务价值需要状态特定行动，而不是混合押注，上限仍然存在。

### 6.3 自我反思下的上限

自我反思、批判、辩论和多样采样，除非触发新观测，否则都只是在 `Z` 上操作。若流程只变换同一表征，它仍被同一等价类限制。

诊断规则是：

```text
如果多轮推理围绕同一个缺失变量生成不同合理化，修复目标很可能不是推理，而是通道。
```

### 6.4 检索下的上限

检索只有在改变 `O` 或 `Z`、引入缺失区分时，才能修复观测-表征失配。返回同一投影的更多内容，不会修复失配。

这就是为什么检索系统需要覆盖率审计，而不只是相关性排序。最高排序的 chunk 可能共享同一个缺失变量。

### 6.5 外部验证下的上限

外部验证器如果能访问缺失变量，就能暴露观测-表征失配。但只作用在同一贫化表征上的验证器，也继承同一个上限。

受治理系统中的关键原则是：

```text
验证器必须独立访问它被要求验证的变量。
```

否则验证会变成代理剧场。

---

## 7. 变量进入标准

变量不应因为出现在文本中就被视为已经进入。通道治理需要更严格的测试。

任务关键变量 `v` 进入控制表征，必须满足：

```text
observed
retained
bound
discriminative
operational
```

### 7.1 被观测

系统有能捕获 `v` 信息的通道。

问题：

```text
哪个工具、文件、数据库、日志、传感器、用户输入或文档提供 v？
该通道是否被授权？
该通道是否新鲜？
该通道对当前决策是否足够完整？
```

### 7.2 被保留

变量从观测到表征的转换中存活下来。

问题：

```text
检索是否包含它？
摘要是否保留它？
序列化是否编码它？
截断是否移除了它？
格式化是否折叠了它？
```

### 7.3 被绑定

变量被连接到正确实体、作用域、时间、单位、来源和权威。

问题：

```text
v 描述哪个对象？
它指向什么时间？
单位或尺度是什么？
哪个来源断言了它？
它是观测、推断还是猜测？
```

### 7.4 可区分

`v` 的不同值会在 `Z` 中产生不同操作后果。

问题：

```text
改变 v 会改变表征吗？
模型或路由器会注意到变化吗？
验证器会区分变化吗？
策略会作出不同选择吗？
```

### 7.5 可操作

系统能用该变量路由、搜索、审计、渲染、验证或提交状态。

问题：

```text
v 能触发某种能力吗？
v 能约束候选生成吗？
v 能被审计发现引用吗？
v 能用于回归护栏吗？
v 能影响状态转移吗？
```

任一条件失败，变量就没有完全进入。

---

## 8. 通道治理

**通道治理** 是确保任务关键变量以控制可用形式进入并存活于观测-表征管线的纪律。

它先于知识治理：

```text
Channel Governance → Knowledge Governance → Audit Engineering → State Governance
```

这个顺序在实现中不必僵硬，但在概念上重要。系统可能通过审计发现通道失败，这个发现也可能更新状态。但修复目标仍在上游：通道或表征必须被修好，下游治理才可靠。

### 8.1 通道治理循环

最小通道治理循环是：

```text
1. 识别价值关键变量。
2. 映射能暴露这些变量的观测通道。
3. 映射可能擦除或扭曲变量的表征转换。
4. 审计变量是否进入 Z。
5. 修复缺失、混叠、过期或未绑定变量。
6. 将表征契约登记为受治理对象。
7. 监控后续观测中的漂移、省略和撤销触发器。
```

### 8.2 表征契约

表征契约说明某类任务中的表征必须保存什么。

```json
{
  "id": "gko.text2sql.schema_representation_contract",
  "type": "representation_contract",
  "condition": "text-to-SQL generation over relational databases",
  "assertion": "The representation must preserve table names, column names, column descriptions when available, primary keys, foreign keys, sample values when value grounding is needed, and provenance for each schema element.",
  "strength": "hard",
  "evidence": "SQL correctness depends on schema linking, join-path selection, and value grounding.",
  "revocation_trigger": "If a database dialect or task setting provides equivalent constraints through another verified representation, this contract may be revised.",
  "not_supported_claims": "Does not claim that full database contents must always be included."
}
```

表征契约是 GKO。它们治理系统输入侧。

### 8.3 作为 GKO 的通道对象

通道也可以被表示为受治理对象：

```json
{
  "id": "gko.channel.execution_result.raw_stderr",
  "type": "observation_channel",
  "condition": "code execution or test failure audit",
  "assertion": "Raw stderr and exit code must be retained as authoritative evidence before summarization.",
  "strength": "hard",
  "priority": "higher than model-generated explanation",
  "evidence": "Failure localization depends on exact error messages and line references.",
  "lifespan": "project",
  "revocation_trigger": "If a structured test-report parser provides equivalent or superior evidence with verified fidelity.",
  "not_supported_claims": "Does not imply that raw stderr alone identifies the root cause."
}
```

这个模式把通道治理接入更大的对象模型。

---

## 9. 观测-表征失配的审计工程

观测-表征失配应当可审计。审计发现不应只说模型错了，而应识别哪个变量没有进入、在哪里丢失，以及哪个控制增量可以修复通道。

### 9.1 审计发现模板

```json
{
  "id": "finding.observation_representation.example",
  "artifact": "candidate output, state transition, SQL query, code patch, plan, or answer",
  "finding": "The artifact depends on variable v, but v was absent, aliased, stale, or unbound in the operational representation.",
  "evidence": "Specific missing channel, omitted field, truncated log, stale snapshot, collapsed schema relation, or binding error.",
  "mismatch_type": "observation_representation",
  "severity": "medium | high | critical",
  "repair_target": "channel | retrieval | compression | representation_schema | binding | provenance | freshness | verifier",
  "control_delta": "Add or modify the representation contract so v enters Z in a control-usable form.",
  "regression_guard": "A check that fails if v is again omitted or aliased in an equivalent task.",
  "confidence": "diagnostic confidence"
}
```

### 9.2 常见控制增量

| 失败 | 控制增量 |
|---|---|
| 缺失通道 | 增加工具访问、文件读取、数据库查询、API 调用或人类输入要求。 |
| 检索省略 | 修改检索查询、chunking、元数据过滤或覆盖检查。 |
| 压缩擦除 | 增加任务关键变量保留规则。 |
| Schema 扁平化 | 保存结构关系，而不是 prose 摘要。 |
| 绑定失败 | 增加实体、来源、单位、时间戳和作用域绑定字段。 |
| 观测过期 | 增加 freshness 检查和重新观测触发器。 |
| 权威折叠 | 增加来源和权威标签。 |
| 负空间失败 | 显式表征证据缺席。 |

### 9.3 有牙齿的护栏

观测-表征失配的回归护栏，只有在决定性变量被移除、混叠、过期或错误绑定时会失败，才算有牙齿。

```text
如果外键从 schema 表征中被省略，text-to-SQL 表征审计必须失败。
如果 raw stderr 被转述替代，代码审计证据护栏必须失败。
如果事件日志丢掉时间戳，状态转移验证器必须失败。
如果两个同显示名列丢失表限定标识，schema 绑定护栏必须失败。
如果摘要移除例外条件，偏好保留护栏必须失败。
```

只检查上下文长度或通用关键词存在的护栏并不充分。它必须检查变量进入条件本身。

---

## 10. 与其他失配的相互作用

观测-表征失配位于上游，但很少单独行动。它常常制造或放大其他失配。

### 10.1 与状态失配

如果区分状态所需的变量缺席，状态推断会变得不可能或不稳定。系统看似不确定，但不确定性来自表征折叠。

```text
missing discriminative variable → latent states aliased → state mismatch
```

修复必须从通道修复开始，而不只是更好的状态推理。

### 10.2 与拟合边界失配

能力路由依赖触发证据。如果触发证据被移除或扭曲，正确能力可能不被激活。

```text
schema constraints omitted → schema audit not triggered
execution trace summarized → debugging capability under-triggered
risk signal compressed away → safety or review capability under-triggered
superficial expert terms retained → expert-performance mode over-triggered
```

因此，观测-表征失配可以诱发拟合边界失配。

### 10.3 与支持失配

如果某结构不在 `Z` 中，它在候选生成中可能等同于零支持。模型不能采样未被表征的外键 join path，也不能生成关于一个被省略工具的计划步骤。

```text
not represented → not reachable → support mismatch
```

如果表征没有先修好，靠采样扩大支持通常很弱。

### 10.4 与聚合失配

聚合依赖跨部分保存约束。如果表征省略全局依赖，局部组件可能看似正确，组合产物却失败。

```text
SQL 子句各自合理，但与被省略 join 约束不兼容。
报告章节局部准确，但与被省略定义不一致。
计划步骤局部合理，但在被省略资源约束下不可执行。
```

### 10.5 与规格失配

任务关键变量缺席时，系统可能优化可见代理。时间久了，代理会被误认为任务本身。

```text
正确性依赖被省略数据时，系统优化可读性。
语义意图未被表征时，系统优化执行成功。
真实满意度由例外条件治理时，系统优化用户表述偏好。
```

规格修复必须包含变量进入审计，否则修复后的 rubric 可能只编码可见价值。

### 10.6 与 SGAR

SGAR 通过状态转移提交进展。如果观测贫化、过期或无权威，系统可能提交错误状态。

```text
上下文基于模型叙事说"tests passed"，而不是基于工具输出。
文件状态从过期摘要提交。
issue 在没有外部可验证产物时被标记 resolved。
记忆从未验证假设更新。
```

状态转移契约必须包含观测权威和表征充分性。

### 机制层映射

在形式化机制层中，观测-表征失配通常映射到 `observation_availability` 与 `belief_representation`。如果缺失变量对系统来说根本不可获得，修复目标就是 `observation_availability`。如果变量其实可获得，但没有被转换成可操作结构，修复目标就是 `belief_representation`。

---

## 11. Text-to-SQL 作为典型案例

Text-to-SQL 让观测-表征失配非常可见，因为最终 SQL 查询依赖许多可能进入或不进入 prompt/控制表征的变量。

直接表述是：

```text
natural language question + schema text → SQL
```

受治理表述是：

```text
question + database
  → schema extraction
  → schema representation contract
  → value-critical variable inventory
  → schema subgraph
  → column binding
  → value binding
  → join-path representation
  → predicate skeleton
  → SQL rendering
  → execution audit
```

### 11.1 Text-to-SQL 中的常见观测-表征失败

| 失败 | 示例 |
|---|---|
| 外键省略 | 正确 join path 无法可靠推断。 |
| 列描述省略 | 列名歧义或误导。 |
| 值分布省略 | 问题依赖真实数据库值。 |
| 表混叠 | 同一个显示术语映射到多个表。 |
| 单位或格式丢失 | 日期、货币或百分比被误解。 |
| 样本值缺席 | 自然语言实体的 value grounding 失败。 |
| Schema 扁平化 | 关系变成 prose，而不是约束。 |
| 方言省略 | 生成的 SQL 使用不支持的函数。 |

### 11.2 Text-to-SQL 中的变量进入

列名没有完全进入表征，除非它：

```text
observed: included from the schema source
retained: not truncated or merged into prose
bound: linked to its table, type, description, and keys
discriminative: distinguishable from similarly named columns
operational: usable in schema linking, join search, predicate construction, and execution audit
```

外键没有完全进入，除非它能约束 join-path 搜索。

样本值没有完全进入，除非它能支持 value binding 和谓词形成。

SQL 方言规则没有完全进入，除非它能约束渲染。

### 11.3 执行反馈作为通道修复

执行反馈常被视为验证。在本文理论中，执行反馈也可以是通道修复。它暴露此前未被表征的变量：

```text
empty result set → predicate may overconstrain actual data
SQL error → dialect or schema representation missing
unexpected row count → aggregation or join cardinality variable missing
ambiguous column error → binding representation insufficient
```

审计发现应把缺失变量或表征规则写回，而不只是让模型“再试一次”。

---

## 12. 代码、Agent 与研究工作流

观测-表征失配跨领域出现。

### 12.1 代码系统

代码任务经常失败，因为模型看到的是代码库摘要，而不是控制相关结构。

```text
隐藏测试依赖 prompt 中不可见的行为。
依赖版本被省略。
环境变量缺失。
栈被摘要，行号丢失。
调用图被扁平化。
配置文件被忽略。
构建系统约束被省略。
```

修复需要工具支撑的代码库观测、精确错误保存、依赖检查和结构化代码表征。

### 12.2 工具型 Agent

Agent 经常把叙事状态误认为观测状态。

```text
agent 说文件已创建，但没有检查文件系统。
agent 假设邮件已发送，但其实只有草稿。
agent 摘要网页却省略表格。
agent 在没有验证器观测时把计划记为完成。
```

修复要求区分模型声称与工具观测，并且只提交已验证转移。

### 12.3 研究工作流

研究任务依赖定义、分母、纳入标准、方法、假设和来源。

```text
论文摘要省略排除标准。
报告结果缺少分母。
方法比较忽略测量条件。
claim extraction 省略置信区间或人群。
引用摘要丢失结果是因果还是相关。
```

修复需要为证据、claim 作用域、方法、人群、指标和不确定性建立表征契约。

---

## 13. 通道治理设计模式

### 13.1 原始证据附着

精度重要时，摘要不应替代原始证据，而应指向原始证据。

```text
summary + exact source span / row / line / tool output / timestamp
```

### 13.2 保存来源的压缩

压缩应保存来源、时间、权威和撤销条件。

差的压缩：

```text
"The build failed because of configuration."
```

更好的压缩：

```text
"Build failed at 2026-06-27T14:03Z. Authoritative source: test runner stderr. Exit code 1. Failing target: integration:test. Exact error retained at evidence_ref. Suspected configuration issue is unverified."
```

### 13.3 双重表征

同时使用人类可读和机器结构化表征。

```text
Natural-language explanation + JSON schema + provenance refs
```

解释支持人类理解；结构化表征支持控制。

### 13.4 变量关键性清单

生成前，识别那些一旦缺失就会改变最优行动的变量。

```text
哪些变量如果改变，会让当前答案错误？
其中哪些已经被观测？
哪些只是被假设？
哪些已经过期？
哪些已被表征但未绑定？
哪些能影响路由或验证？
```

### 13.5 负空间表征

显式表征缺席。

```json
{
  "foreign_key_between_orders_and_regions": {
    "status": "absent_in_schema",
    "source": "schema introspection",
    "timestamp": "..."
  }
}
```

缺席应当与未知可区分。

### 13.6 表征 Diff

当状态、文件、schema 或观测改变时，对表征做 diff。

```text
previous Z
current Z
diff
control implications
state update / revocation trigger
```

### 13.7 Round-Trip 检查

检查表征是否能重建或保存来源中的控制相关属性。

```text
schema 序列化能否重建外键图？
摘要能否重建所有任务关键约束？
代码表征能否恢复 imports、调用图和变更行？
状态摘要能否恢复已提交转移和待办行动？
```

### 13.8 省略突变体

通过移除决定性变量创建表征突变体。护栏应在突变体丧失控制充分性时失败。

这是观测-表征版本的 mutation testing。

### 13.9 权威标签

有状态系统中的每个 claim 都应携带权威状态：

```text
observed
verified
inferred
hypothesized
model-generated
user-asserted
stale
revoked
```

没有权威标签，系统可能把叙事当事实。

### 13.10 Freshness 触发器

表征应定义自己何时变 stale。

```text
database schema snapshot invalid after migration
file summary invalid after file modification
calendar availability invalid after new event
test result invalid after code change
market observation invalid after time threshold
```

---

## 14. 与既有形式传统的关系

观测-表征失配连接若干既有传统，但 LLM 系统形成了独特组合。

### 14.1 充分统计量与信息瓶颈

控制充分性类似充分统计量：表征应保存最优决策所需的信息。但 LLM 系统常使用自然语言、混合表征和工具派生表征，而不是精心设计的统计摘要。

实践挑战不只是压缩，而是治理什么不能被压缩掉。

### 14.2 形式化方法中的抽象函数

形式化方法区分具体状态和抽象状态。只有当抽象保存验证所需性质时，它才是 sound 的。观测-表征失配是 LLM 系统中的对应物：prompt 或上下文抽象必须保存任务控制相关性质。

### 14.3 POMDP 观测模型

部分可观测模型区分世界状态、观测与信念。观测-表征失配强调信念更新之前，观测函数和表征函数中的失败。系统可能不只是“不确定”，而是构造了错误的观测空间。

### 14.4 主动感知与信息价值

当缺失变量具有高控制价值时，系统应在行动前获取它。通道治理可视为任务特定主动感知：选择能减少表征诱导价值损失的观测。

### 14.5 数据库视图与物化投影

表征类似数据库上的 view。如果 view 省略查询所需字段，任何基于该 view 的查询都无法恢复它们。这个类比对工具型 LLM 系统尤其有用：prompt、摘要、embedding 和记忆记录都是 view，不是世界。

### 14.6 因果表征

有些变量可预测但非因果相关；有些变量因果决定性但难以观测。通道治理应优先保存影响任务控制的变量，而不只是与合理输出相关的变量。

---

## 15. 什么时候不需要通道治理

通道治理有成本。它会增加延迟、token 负载、工具调用、隐私暴露、工程复杂度和虚假精确感。它并不总是值得。

通常不需要通道治理的情形：

```text
the task is low-risk and one-shot
the user supplies all relevant variables explicitly
the output is stylistic rather than control-sensitive
local quality strongly tracks global value
the verifier has complete authority and direct access to the world
the task lies in a positive probability-value alignment regime
```

通常需要通道治理的情形：

```text
missing variables can silently change the answer
representation is produced by lossy retrieval or summarization
the task depends on structured relations
state persists across time
tool outputs are authoritative
verification depends on exact values
failure is expensive or hard to detect locally
```

### 15.1 治理诱导风险

通道治理本身也会失败。

| 风险 | 描述 |
|---|---|
| 通道膨胀 | 过多变量淹没模型或遮蔽真正相关变量。 |
| 虚假精确 | 结构化表征制造不应有的信心。 |
| 隐私泄漏 | 增加通道会不必要地暴露敏感信息。 |
| 过期权威 | 旧观测继续以当前事实身份存在。 |
| 过度仪器化 | 系统花在观测上的 effort 超过行动。 |
| 错误绑定 | 更多数据增加错误绑定机会。 |
| 治理冲突 | 表征契约在不同任务模式之间冲突。 |

这些风险应通过作用域、优先级、权威和撤销规则处理。

---

## 16. 概念自审计

观测-表征失配自身也应作为受治理理论 claim 表示。

```json
{
  "id": "gko.observation_representation_mismatch",
  "type": "primitive_mismatch_claim",
  "condition": "LLM systems whose task-relevant world variables must pass through observation and representation functions before model control is possible.",
  "assertion": "If value-relevant variables are lost, aliased, stale, unbound, or made operationally inaccessible before entering Z, downstream reasoning over Z faces a representation-induced ceiling.",
  "strength": "structural-relative",
  "support_scope": "Applies to value-preservation failures caused by the map S_world → O → Z.",
  "revocation_trigger": "Show that all such failures can be reduced to state, fitting-boundary, support, aggregation, or specification mismatches without losing intervention specificity.",
  "not_supported_claims": "Does not claim that every missing fact is an observation-representation mismatch; does not claim that all tasks require exhaustive observation; does not claim that more context always improves control."
}
```

如果这个概念不再识别独特修复目标，它就应被削弱。若它能揭示无法仅靠推理、状态推断、能力路由、支持扩展、聚合修复或规格修订解决的失败，它就应被加强。

---

## 17. 最小诊断清单

在把 LLM 失败视为推理失败之前，先问：

```text
1. 哪些变量会改变正确答案？
2. 系统是否有观测这些变量的通道？
3. 检索或工具使用是否真的捕获了它们？
4. 压缩、摘要、格式化或截断是否保存了它们？
5. 它们是否绑定到正确实体、时间、来源、单位和作用域？
6. 它们是否可与相似变量区分？
7. 它们能否影响路由、搜索、审计、渲染、验证或状态转移？
8. 缺席是否与未知分开表征？
9. 观测是否新鲜？
10. 验证器是否能独立访问该变量？
```

只要任何答案是否定，首要修复目标就可能是观测-表征，而不是下游推理。

---

## 18. 结论

观测-表征失配是价值保存结构理论中的第一类原始失配。它发生在任务决定性变量没有以可用形式进入模型可访问控制表征时。

这种失配位于推理上游。它创造表征诱导上限，无法通过在同一表征上延长推断可靠突破。它不同于状态失配、支持失配、聚合失配、拟合边界失配和规格失配——因为它的修复目标是观测-表征通道本身。

实践响应是通道治理：识别价值关键变量，映射观测通道，保存结构，正确绑定变量，表征缺席和来源，审计变量进入，并把表征契约编码为受治理对象。

中心规则是：

```text
Govern the channel before governing the knowledge.
```

忽视这条规则的系统，可能在任务的贫化投影上建立复杂治理。遵守它的系统，才能让后续知识治理、审计工程和状态治理智能体范式作用在真正决定价值的变量上。

---

## Appendix A: 紧凑术语表

| 术语 | 定义 |
|---|---|
| 观测函数 `φ` | 世界成为被观测数据的过程。 |
| 表征函数 `ψ` | 被观测数据成为操作表征的过程。 |
| 操作表征 `Z` | 可用于模型控制、路由、搜索、审计、渲染和状态更新的表征。 |
| 观测-表征失配 | `S_world → O → Z` 未保存任务相关区分。 |
| 变量进入 | 任务关键变量被观测、被保留、被绑定、可区分、可操作。 |
| 控制充分性 | 表征保存高价值行动所需的全部区分。 |
| 表征诱导上限 | 表征中被折叠区分施加的最大价值损失。 |
| 通道治理 | 下游知识治理之前，对观测与表征通道的治理。 |
| 表征契约 | 指定表征必须保存什么的受治理对象。 |
| 权威折叠 | 无法区分观测、验证、推断、猜测、过期或模型生成 claim。 |
| 负空间失败 | 无法把预期证据的缺席表示为有意义观测。 |

---

## Appendix B: 表征契约模板

```json
{
  "id": "gko.representation_contract.NAME",
  "type": "representation_contract",
  "condition": "Task class or system mode where this representation contract applies",
  "assertion": "Variables, structures, relations, provenance, and authority labels that must be preserved",
  "strength": "hard | soft | heuristic | provisional",
  "priority": "conflict-resolution priority",
  "evidence": "Why these variables are control-critical",
  "source": "Origin of the contract",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "When the contract should be weakened, revised, or removed",
  "not_supported_claims": "Claims this contract does not license"
}
```

---

## Appendix C: 观测-表征审计发现模板

```json
{
  "id": "finding.orm.NAME",
  "artifact": "Artifact affected by the mismatch",
  "finding": "Localized statement of the missing, aliased, stale, unbound, or non-operational variable",
  "evidence": "Specific proof from source, tool, schema, log, retrieval, or representation diff",
  "mismatch_type": "observation_representation",
  "severity": "low | medium | high | critical",
  "repair_target": "channel | retrieval | compression | representation_schema | binding | provenance | freshness | verifier",
  "control_delta": "Precise representation or channel change",
  "regression_guard": "Guard that fails if the variable-entry failure recurs",
  "confidence": "diagnostic confidence",
  "revocation_trigger": "When this finding should be revised or withdrawn"
}
```

---

## Appendix D: 变量进入测试

对每个候选任务关键变量：

```text
Variable:
Source:
Observed? yes / no / unknown
Retained? yes / no / unknown
Bound? yes / no / unknown
Discriminative? yes / no / unknown
Operational? yes / no / unknown
Authority:
Freshness:
Control use:
Verifier access:
Failure if omitted:
Required repair:
```

任何带有 `no` 或关键 `unknown` 的变量，都不应被视为已经安全进入。
