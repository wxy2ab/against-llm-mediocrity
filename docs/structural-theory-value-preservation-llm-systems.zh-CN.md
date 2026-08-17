# LLM 系统中价值保存的结构理论

**工作稿 v0.1**  

---

## 摘要

大型语言模型（LLM）系统越来越依赖推理时过程：重复采样、批判、规划、检索、工具使用、重排序、执行反馈和迭代修订。这些过程可以显著提高任务表现，但也暴露出一个持续存在的限制。在许多高价值任务中，系统并不是通过产生任意胡言乱语而失败。相反，它停留在一类输出中：流畅、局部连贯、可辩护、可渐进改进，却仍然错过决定真实任务价值的结构性条件。我们把这种区间称为 **LLM 平庸**。

本文提出一种结构性解释，用于说明这个区间何时以及为何出现。核心主张是：高价值 LLM 系统设计不只是更好生成的问题。更根本地，它是 **价值保存** 在世界到输出管线中的问题。任务价值必须穿过观测、表征、状态信念形成与更新、能力路由、策略支持、局部到全局聚合以及规格。失败发生在价值相关结构被丢失、混叠、形成错误或过期信念、路由到错误能力、分配到不足的概率质量、被局部优化但全局破坏，或在错误代理下被评估时。我们把这些形式化为六类原始失配：

- **观测-表征失配**
- **状态失配**
- **拟合边界失配**
- **支持失配**
- **聚合失配**
- **规格失配**

这六类失配不是松散的表面错误分类。它们来自一个通用 LLM 系统管线中的结构性不同站点：

```text
S_world → O → Z → belief formation / update → capability routing → candidate support → aggregation → evaluation
```

在这个抽象下，该分类具有一种相对完备性主张：任何任务价值保存失败，都必须发生在这些站点之一，或发生在它们的相互作用中。它也具有一种独立性主张：每一类失配都可以在保持其他站点固定的情况下被扰动，并产生具有不同修复目标的失败。

随后，本文引入一种复合失败机制。失配并不只是加法式或乘法式累积。它们常常变成 **超加性**，因为修复算子在管线站点之间相互耦合。针对某一失配的修复操作，可能在另一站点已经破坏了该修复所依赖的信息、状态区分、路由条件、支持质量、聚合不变量或目标准则时失效。

这种结构视角统一了三类系统层干预。

**知识治理** 把任务特定控制知识外化并修订为受治理对象。**审计工程** 把失败信号转换为局部控制增量与回归护栏。**状态治理智能体范式（State-Governed Agent Regime / SGAR）** 为长程系统提供硬状态权威，确保计划、观测、验证、修正与撤销成为已提交的状态转移，而不是松散的上下文叙事。

它们共同实现一个更广泛的原则：保留局部对齐的模型能力，但把高失配任务组件转化为低失配控制对象，使其可以被审计、修订、撤销和复用。

---

## 目录

本文是一篇较长的工作稿。第 1–2 节铺设价值保存问题；第 3–6 节展开六类失配的分类，并给出复合失败机制；第 7–11 节描述治理层面的回应及其对象模型；第 12–16 节涵盖一个完整实例、相关传统、适用边界，以及一次自我审计。

- [1. 引言](#1-引言)
- [2. 价值保存问题](#2-价值保存问题)
- [3. 六类原始失配作为管线站点失败](#3-六类原始失配作为管线站点失败)
- [4. 相对完备性与独立性](#4-相对完备性与独立性)
- [5. 概率-价值耦合区间](#5-概率-价值耦合区间)
- [6. 修复算子耦合与超加性失败](#6-修复算子耦合与超加性失败)
- [7. 平庸到卓越转化](#7-平庸到卓越转化)
- [8. 知识治理](#8-知识治理)
- [9. 审计工程](#9-审计工程)
- [10. 状态治理智能体范式](#10-状态治理智能体范式)
- [11. 统一对象模型](#11-统一对象模型)
- [12. Text-to-SQL 作为旗舰实例](#12-text-to-sql-作为旗舰实例)
- [13. 与既有形式传统的关系](#13-与既有形式传统的关系)
- [14. 何时不需要治理](#14-何时不需要治理)
- [15. 理论的自我审计](#15-理论的自我审计)
- [16. 结论](#16-结论)
- [附录 A：紧凑术语表](#附录-a紧凑术语表)

---

## 1. 引言

现代 LLM 系统不再只是一次性文本生成器。它们会搜索、批判、检索、执行工具、检查错误、修订输出，并积累中间产物。这些方法表明，部署时的模型行为并不只由一次前向传播决定。系统可以重塑呈现给模型的任务，暴露中间状态，要求分解，并使用外部验证来改善结果。

然而，这种进步暴露出一个更深的问题。许多高价值任务并不只是要求一个流畅答案。它们要求在多个转换中保存任务特定的价值结构：从世界到观测，从观测到表征，从表征到能力激活，从能力激活到候选生成，从候选到全局产物，再从产物到评估。当这种价值结构没有被保存时，系统可能产生局部合理甚至局部有用的输出，但全局上仍然不足。

这种失败模式不同于随机幻觉。它也不只是缺乏多样性。系统可能生成许多不同候选，而所有候选仍然处在同一个低价值盆地中。它们可能共享同一个缺失变量、同一个错误潜在状态假设、同一个能力路由错误、同一个低支持盲点、同一个局部到全局组合失败，或同一个代理目标。问题不是模型不会生成语言。问题是任务价值没有在系统管线中存活下来。

我们把这个更广泛的区间称为 **LLM 平庸**：在固定推理预算和给定搜索算子集合下，系统停留在可达输出空间中一类易于生成、辩护和修订但系统性低于任务要求价值的区域中。这个术语并不描述 LLM 的普遍性质。许多任务处在正向区间中，其中生成、语义联想、压缩、表面流畅性、体裁先验和迭代修订都与任务价值强对齐。在这些情形中，自回归生成不是瓶颈，而是卓越的来源。

重要的是中间区间。在许多部署任务中，LLM 既不是简单平庸，也不是全局卓越。它们是 **局部对齐** 的：模型确实擅长部分工作，但这些局部优势并不可靠组合成全局任务成功。系统可能非常擅长总结上下文、生成边缘案例、起草大纲或转换语气，却仍然无法保存隐藏依赖、识别决定性状态、激活正确能力、到达稀有结构或优化真实成功标准。

本文发展一种关于这个中间区间及其失败边界的结构理论。该理论建立在四个主张之上。

第一，LLM 系统中的任务价值失败可以被分析为世界到输出管线中的保存失败。这个管线足够抽象，可以覆盖纯提示、检索增强生成、工具型 agent、执行引导代码合成、text-to-SQL 系统和长程自治工作流。

第二，六类原始失配对应这个管线中的六个结构性不同站点。观测-表征失配关注在可行通道与表征预算内可获得的决定性变量是否进入模型可访问表征。状态失配关注系统能否在给定表征下形成、保存和更新证据所支持的信念状态。拟合边界失配关注已学能力是否在正确域内被激活。支持失配关注高价值结构是否在系统策略下有足够概率质量或可达性。聚合失配关注局部改进是否能组合成全局价值。规格失配关注可访问代理目标是否代表真实任务效用。

第三，复合失败常常是超加性的，因为修复操作是耦合的。如果决定性变量从未进入表征，规格修复可能无用。如果系统在错误潜在状态假设下运行，聚合修复可能无用。如果正确候选后来被路由给错误评估器，支持扩展可能无用。这些相互作用不是偶然的。它们来自管线结构。

第四，成功的高价值 LLM 系统不应只是增加输出空间搜索。它们应当转化任务。系统应保留局部对齐的模型操作，同时把高失配部分转换为受治理控制对象：schema、约束、rubric、状态假设、join path、失败模式、回归护栏、路由规则和转移契约。这就是 **平庸到卓越转化** 原则：改变任务呈现给模型的形式，使更多工作落入局部对齐或正向对齐区间。

---

## 2. 价值保存问题

令一个任务由世界状态、系统过程、输出和真实效用函数定义。一个高价值 LLM 系统不能只产生在模型策略下看似合理的输出。它必须产生一个在任务效用下相关结构具有价值的输出。

可以把它示意为：

```text
S_world → System → Y → U(Y, S_world)
```

其中：

- `S_world` 是底层世界、环境、数据库、用户需求、代码库、研究上下文或任务情境。
- `Y` 是系统产物：答案、计划、SQL 查询、代码补丁、诊断、报告或行动序列。
- `U` 是真实任务效用。

困难在于，系统从不直接作用于 `S_world` 或 `U`。它通过观测、编码、提示、检索文档、上下文窗口、工具、潜在模型策略、候选分布、外部验证器和人类提供的代理来行动。因此，系统是在世界与目标的转换版本下优化。

更明确的管线是：

```text
S_world
  -- φ --> O
  -- ψ --> Z
  -- Bθ --> b
  -- ρ --> C
  -- pθ --> K
  -- A --> Y
  -- Ũ --> evaluation / selection
```

其中：

- `φ` 是观测或感知函数。
- `O` 是系统可用的观测数据。
- `ψ` 是表征函数：编码、tokenization、检索、压缩、schema 抽取、提示构造或工具结果格式化。
- `Z` 是模型可访问、可操作的表征。
- `Bθ` 是信念形成与更新组件；它把当前及历史表征转换为对潜在任务状态的操作性信念。
- `b` 是系统实际维护的信念状态、假设集合或状态分支。它不要求潜在状态可被直接观测。
- `ρ` 是能力路由函数：它决定哪种已学策略、角色、行为、工具、审计模式或推理模式被激活。
- `C` 是被激活的能力或策略集合。
- `pθ` 是模型或系统在候选续写、推理轨迹、计划或产物上的策略。
- `K` 是当前预算和搜索算子下可达的候选空间。
- `A` 是把局部决策、token、子句、步骤或模块转换为全局产物的聚合或组合过程。
- `Y` 是产生的输出或行动序列。
- `Ũ` 是可访问评估器、提示准则、奖励代理、rubric、benchmark 指标、人类偏好信号或验证器。
- `U` 是真实任务效用。

价值保存问题，就是在这条管线中维持与 `U` 相关的信息、区分、约束和目标结构。LLM 平庸发生在系统保存了足够结构以产生局部合理产物，却丢失了足够结构以至于错过高任务价值时。

---

## 3. 六类原始失配作为管线站点失败

六类原始失配来自一个问题：任务价值会在管线中的哪里被结构性丢失或扭曲？

### 3.1 观测-表征失配

当在系统声明的授权、成本、时延与工具约束下本来可获得的任务相关区分，在进入系统工作表征之前被丢失、压缩、混叠、省略，或变得不可操作时，就会发生观测-表征失配。

形式上，令 `V*` 是 `S_world` 中高效用所必需的一组变量。令：

```text
Z = ψ(φ(S_world))
```

当存在两个世界状态 `S1` 和 `S2` 满足：

```text
U*(S1) ≠ U*(S2)
but
ψ(φ(S1)) ≈ ψ(φ(S2))
```

且这种近似对策略或控制过程而言不可区分时，当前表征产生了决策相关混叠。要把这种混叠诊断为观测-表征失配，还必须存在一个**可行通道或表征干预** `(φ', ψ')`，它能在不改变任务目标的前提下，以允许的成本使该区分进入 `Z'`：

```text
Z'(S1) = ψ'(φ'(S1))  not≈  ψ'(φ'(S2)) = Z'(S2)
```

如果在声明的可行通道集合中没有任何干预能够暴露该区分，那么差距来自任务的信息结构或不可约部分可观测性，而不是系统漏接了一个可用变量。此时，下游系统应在正确的信念状态上行动；仅仅无法直接观测真实状态，不构成观测-表征失配。

这种失配位于推理上游。它无法通过让模型在同一个表征上想更久来可靠修复。如果决定性变量缺席于 `Z`，更长推理只会细化一个贫乏的任务投影。

典型修复目标包括：

```text
channel repair
measurement
tool access
raw-log inspection
schema extraction
value sampling
database queries
sensor introduction
structured representation
context reconstruction
```

治理规则是：

```text
Before governing knowledge, verify that the variables to be governed have entered the representation.
```

### 3.2 状态失配

当效用依赖某个潜在状态，而系统在固定的可用表征下形成、保存或更新了决策相关的错误信念时，就会发生状态失配。

观测-表征失配问的是可行获得的必要变量是否进入表征。状态失配问的是，在给定表征和观测历史的情况下，系统实际维护的信念是否与证据所支持的信念一致。潜在状态可以原则上不可直接观测；这时正确对象是信念分布，而不是被假定可得的真实状态标签。

令 `H` 是潜在状态空间，`Z≤t` 是截至当前的可用表征历史。定义证据所支持的信念与系统实际信念：

```text
b*t(h) = P(h_t = h | Z≤t)
b_hat_t(h) = Bθ(Z≤t)
```

当二者的差异改变行动排序：

```text
argmax_a E_{h ~ b_hat_t}[U(a | h)]
  ≠
argmax_a E_{h ~ b*t}[U(a | h)]
```

就存在状态失配。错误可以表现为无依据地塌缩到单一状态、误排状态、遗忘证据、使用陈旧信念，或在新观测后没有更新。`b*t` 本身有歧义并不构成失配；如果系统保存这种不确定性，并采取信念条件下的最优行动、分支、澄清或有界输出，它已经在当前信息结构下正确行动。

因此必须分开 **任务状态歧义度** 与 **系统状态失配度**。在固定候选对分布 `ν` 上，后验状态之间的排序翻转率

```text
δ_amb(Z≤t) = E_{h,h' ~ b*t} Pr_{a,a' ~ ν}[ranking_h(a,a') != ranking_h'(a,a')]
```

描述的是任务在当前信息结构下对潜在状态的决策敏感性；它不包含 `b_hat_t`，不能充当状态失配严重度，也不能单独区分可行通道漏失与不可约不确定性。前一边界需另测 `V_feas - V_Z`。系统失配应以信念最优基准为参照，例如：

```text
Reg_state(Bθ; Z≤t)
  = max_a E_{h ~ b*t}[U(a | h)]
    - E_{h ~ b*t}[U(a_hat | h)]
```

其中 `a_hat` 是系统按 `b_hat_t` 选择的行动。一个信念最优系统可以同时具有高 `δ_amb` 与零 `Reg_state`。

这种失配常见于对话、规划、诊断、用户建模、市场解释、代码调试、长程 agent 和动态环境。系统可能在多个隐藏 regime 下看到同样的表面文本，并选择一个局部合理但状态不适配的策略。

修复目标包括：

```text
state enumeration
state discriminator construction
active clarification
branching policies
state-conditioned rubrics
state transition tracking
uncertainty-preserving outputs
```

### 3.3 拟合边界失配

当已学能力、策略、审计结构、角色或行为在其真实适用域之外被触发，或在其真实适用域之内被抑制时，就会发生拟合边界失配。

令 `X` 是一种能力。令：

```text
T_X = true domain where X should apply
M_X = model/system domain where X is actually activated
```

当：

```text
M_X ≠ T_X
```

就存在拟合边界失配。

它有两种基本形式：

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

模型可能拥有相关能力，但隐式 router 在错误证据下激活它。这不同于缺乏知识、缺乏支持或目标模糊。它是路由失败。

例子包括：

- 在需要决定性行动的地方触发专家式谨慎；
- 在无害帮助适当的地方触发通用安全拒答；
- 在需要 schema 检查的任务中触发模板化推理；
- 在需要机制层分析的地方触发表面类比；
- 在支持域外触发 benchmark 风格解题模式；
- 真正的审计、工具使用、状态分支或反例搜索在需要时没有触发。

修复目标包括：

```text
capability inventory
trigger evidence audit
boundary perturbation
router correction
activation / suppression rules
role-binding constraints
capability applicability tests
```

### 3.4 支持失配

当高价值结构在系统策略、搜索过程和预算下处于低概率或低可达区域时，就会发生支持失配。

令 `K_B` 是预算 `B` 下可达的候选集合，`Y*` 是高价值输出区域。当：

```text
Pθ(Y* | Z, B) is low
```

或搜索过程无法仅凭概率把稀有高价值结构与稀有噪声区分开时，就存在支持失配。

支持失配不只是缺乏多样性。系统可能采样许多输出却仍然失败，如果相关结构概率质量不足、被过早剪枝，或无法与低价值尾部事件区分。更多采样只有在高价值区域可达且可识别时才有帮助。

修复目标包括：

```text
control-space search
candidate expansion
constraint-guided generation
retrieval or tool augmentation
low-support hypothesis generation
search over intermediate structures
explicit enumeration of rare patterns
```

### 3.5 聚合失配

当局部改进不能组合成全局价值时，就会发生聚合失配。

聚合失配与生成架构无关。它发生在不可逆或代价高昂的局部提交所使用的代理，偏离完整补全的全局价值时。自回归分解 `p(y|x)=∏_t p(y_t|x,y_<t)` 本身可以精确表示任意联合分布，精确条件分布也可以编码全局约束；因此它既不是聚合失配的充分条件，也不是必要条件。实际风险来自条件近似误差、贪心或截断解码、有限搜索、不可逆提交顺序，以及局部代理与全局补全价值的分歧。

这里也必须区分任务属性与系统失败。窗口受限函数类逼近真实效用的能力 `α_k` 只刻画任务局部可分解性；因为它不包含模型、部署代理或搜索过程，低 `α_k` 不能单独推出系统存在严重聚合失配。对固定评估决策集，系统相对的量应比较部署代理 `q_hat_t` 与全局补全价值 `Q*t`，例如 argmax 不一致率，或

```text
Reg_agg(M, Π; h_t) = Q*t(d*t) - Q*t(d_hat_t)
```

其中 `d_hat_t` 是系统实际选择，`d*t` 是同一评估决策集上最大化 `Q*t` 的选择。外部化全局约束的系统可以在任务 `α_k` 很低时仍使 `Reg_agg` 接近零；错误代理也可以在 `α_k` 很高时产生较大后悔。

令 `Y` 由若干部分组成：

```text
Y = A(y1, y2, ..., yn)
```

当：

```text
∀i, local_value(yi) is high
but
U(A(y1, ..., yn)) is low
```

或当局部编辑单调改善表面质量却让产物远离全局最优时，就存在聚合失配。

修复目标包括：

```text
intermediate structure
outline-first generation
dependency graphs
constraint propagation
global validators
composition rules
nonlocal consistency checks
```

### 3.6 规格失配

当可访问目标、提示、rubric、指标、评估器或代理偏离真实任务效用时，就会发生规格失配。

令 `Ũ` 是可访问评估函数，`U` 是真实效用。当对任务相关候选对存在：

```text
rank_Ũ(Y1, Y2) ≠ rank_U(Y1, Y2)
```

就存在规格失配。

规格失配尤其常见于开放式任务，其中成功标准是默会的、演化的、专家依赖的，或只有在检查候选失败后才显现。用户在开始时可能并不知道完整规格。因此，系统可能需要通过反例和审计发现来推断、修订并治理规格。

修复目标包括：

```text
rubric induction
success-condition extraction
counterexample-driven specification repair
preference elicitation
proxy-risk audit
scope limitation
revocation conditions
```

---

## 4. 相对完备性与独立性

六类失配并不声称构成所有可能计算失败的绝对本体。它们声称的是相对于价值保存管线的完备性。

### 4.1 相对完备性

在管线抽象下，任务价值可能以六种结构性不同方式未被保存：

1. 决定性世界变量可能未能进入表征。
2. 系统形成或更新的信念状态可能偏离表征证据所支持的信念。
3. 正确能力可能没有激活，或错误能力被激活。
4. 高价值结构可能在策略和预算下支持不足。
5. 局部决策可能无法组合成全局价值。
6. 可访问评估器可能无法代表真实效用。

任何影响任务价值的系统失败，都必须发生在这些站点之一，或来自它们之间的相互作用。这给出一个相对完备性论点：

> 对于被建模为世界-观测-表征-信念-路由-支持-聚合-评估管线的 LLM 系统，六类原始失配及其复合相互作用，穷尽了任务价值可能被结构性丢失的原始站点。

这是一个有意限定的主张。它并不声称每个表面错误都容易分类。它并不声称每次失败只有单一原因。它不否认实现 bug、资源失败或对抗干扰。它说的是：当问题是任务价值如何在 LLM 中介管线中丢失时，这些就是原始价值保存站点。

这一完备性主张是前馈的。它针对的是从 `S_world` 到输出和可访问评估的一次前向价值保存过程。跨轮反馈、振荡、重试策略和状态累积属于闭环运行时现象，应由 SGAR 在运行时治理，而不由这六个站点单独穷尽。

### 4.2 独立性

六类失配在以下操作意义上相互独立：

> 如果可以构造一个最小对，其中某个站点被扰动而其余站点保持固定，并且该扰动以需要不同修复目标的方式改变任务价值，那么该失配就是原始的。

等价地，如果某个拟议细分的各子情形仍位于同一管线站点，并共享同一有效修复目标，那么它并不会因此成为新的原始失配。新的 primitive 必须带来不可再约化的干预区分，而不只是更细的描述。

例如：

- 可以通过从提示中移除一个本可通过授权数据库通道取得的决定性列来扰动观测-表征，同时保持信念更新规则、目标、策略和聚合过程不变。
- 可以固定 `φ`、`ψ`、`Z` 及任务目标，只把有证据约束的信念更新器替换为会误排、陈旧或过早塌缩的更新器；这只扰动状态/信念站点。
- 可以通过改变触发证据，使同一能力在错误域内被激活来扰动拟合边界。
- 可以通过降低正确结构的概率或可达性，而不改变其效用或评估器来扰动支持。
- 可以通过保留局部部分质量但改变全局组合依赖来扰动聚合。
- 可以通过改变评估代理，同时保持观测、表征、策略支持和聚合不变来扰动规格。

每个扰动都会产生不同的修复目标。这赋予该分类实践力量。它不只是标签体系，而是一张干预地图。

---

## 5. 概率-价值耦合区间

同一个 LLM 可能平庸、局部对齐或卓越，取决于任务、表征、状态、支持、聚合结构、规格和预算。这些不是固定的模型特质。它们是模型似然与任务价值之间的耦合区间。

### 5.1 LLM 平庸

当系统在可用推理预算下停留在合理但次优的区域时，就会发生 LLM 平庸。输出可能流畅、多样且局部可辩护。它们可能在多轮中改善。但这些改善没有到达真实任务价值被决定的区域。

当一个或多个原始失配使高价值区域难以被观测、识别、路由、采样、组合或评估时，这个区间就会出现。

### 5.2 局部对齐

当模型倾向在任务的一部分上真正有用，但不足以保证全局成功时，就会发生局部对齐。这是面向人的 LLM 工作中最常见的区间。

例子包括：

```text
summarizing context
extracting variables
drafting outlines
generating candidate failure modes
rewriting for tone
enumerating edge cases
compressing raw material into structure
```

这些操作可以有价值。失败来自一个假设：这些局部操作中的成功意味着全局任务成功。

局部对齐区间具有如下结构：

```text
local likelihood direction ≈ local task-value direction
but
global likelihood direction ≠ global task-value direction
```

### 5.3 正向概率-价值对齐

在正向一端，模型概率与任务价值在整个任务中相互强化。这个区间称为 **正向概率-价值对齐**。

在这个区间中：

```text
local continuation helps global structure
surface fluency supports task value
semantic association exposes useful relations
iteration compounds quality
high-value artifacts are reachable
verification is relatively stable
```

例子包括上下文压缩、语域迁移、表面润色、语义解压、分类法生成、结构化转换、查询构造、样板合成和许多形式的边缘案例枚举。

设计教训不是压制自回归。教训是重塑任务，使更多工作以正向对齐形式呈现给模型。

---

## 6. 修复算子耦合与超加性失败

建模多个失配的一种简单方式，是把它们看作独立瓶颈。令每个站点有一个保真系数：

```text
c_obs, c_state, c_route, c_support, c_agg, c_spec ∈ [0, 1]
```

一个粗略的可达性模型是：

```text
Reachability ≈ ∏ c_i
```

这捕捉到多个弱站点会降低整体成功率的直觉。但它无法解释 LLM 系统中常见的更强现象：多个失配组合在一起，可能禁用本来可以修复任一单一失配的算子。

为刻画这一现象，定义修复算子：

```text
R_obs, R_state, R_route, R_support, R_agg, R_spec
```

每个 `R_i` 是旨在修复站点 `i` 的过程：通道修复、状态区分、router 修正、支持扩展、组合约束或规格修订。

关键主张是：

> `R_i` 的边际有效性经常受其他站点保真度约束。

形式上：

```text
Effect(R_i) = f_i(c_i; c_j, c_k, ...)
```

在强耦合情形中：

```text
∂Reachability / ∂R_i → 0 as c_j → 0
```

例子：

- 如果决定性变量从未进入表征，规格修复很弱。
- 如果观测通道混叠相关状态，状态修复很弱。
- 如果支持空间从未包含所需全局结构，聚合修复很弱。
- 如果路由抑制了生成扩展候选所需的能力，支持扩展很弱。
- 如果规格没有提供能力何时适用的准则，路由修复很弱。
- 如果验证器只看到代理目标，审计修复很弱。

这个机制解释了为什么复合失配常常是超加性的。失败不只是几个瓶颈各自降低成功率。失败在于，一个瓶颈可能移除修复另一个瓶颈所需的条件。

---

## 7. 平庸到卓越转化

一般干预原则是：

> 保留任务中已经局部对齐的部分，并把高失配部分转化为低失配控制任务。

这就是 **平庸到卓越转化**。

这种转化不要求放弃自回归生成。它要求改变任务呈现给模型的形式。系统不直接要求一个高价值最终产物，而是诱导中间对象，这些对象更容易生成、检查、修订和验证。

中间对象的例子包括：

```text
compressed context
task model
state matrix
schema subgraph
join path
rubric
success condition
constraint set
failure-mode taxonomy
candidate invariant
dependency graph
routing rule
regression guard
transition contract
```

最终答案随后从受治理控制对象中渲染，而不是作为不受治理的流畅续写生成。

每类原始失配都有对应的转化模式：

| 失配 | 转化 |
|---|---|
| 观测-表征 | 修复通道；在推理前引入结构化变量。 |
| 状态 | 枚举并区分潜在状态；按状态分支策略。 |
| 拟合边界 | 审计触发条件；治理能力激活与抑制。 |
| 支持 | 搜索控制空间而不是最终输出空间；有意识扩展稀有结构。 |
| 聚合 | 生成中间结构；执行组合约束和全局不变量。 |
| 规格 | 通过反例和失败发现诱导、修订并治理 rubric。 |

共同模式是：

```text
High-mismatch final-output task
  → lower-mismatch control objects
  → validation / audit
  → governed rendering
```

---

## 8. 知识治理

知识治理是一种推理时框架，用于构造、验证、存储、削弱、撤销和复用任务特定控制知识。

它从最终渲染与控制知识的区分出发。许多 LLM 失败发生的原因是：系统要求模型直接产生最终产物，而更有价值的操作其实是构造最终产物应当由之渲染的控制对象。

**受治理知识对象（Governed Knowledge Object / GKO）** 是一种任务特定控制对象，具有显式作用域、证据、强度和撤销条件。

最小 GKO schema 是：

```json
{
  "id": "gko.unique_identifier",
  "type": "constraint | invariant | routing_rule | rubric | state_hypothesis | dependency | transformation_rule | diagnostic_test",
  "condition": "When this object applies",
  "assertion": "What the object claims or enforces",
  "strength": "hard | soft | heuristic | provisional",
  "priority": "conflict-resolution priority",
  "evidence": "observations, audits, examples, tool outputs, or derivations",
  "source": "where the object came from",
  "lifespan": "single-turn | session | project | persistent",
  "revocation_trigger": "conditions under which the object should be weakened or removed",
  "not_supported_claims": "claims this object does not license"
}
```

GKO 不只是事实。它们可以充当：

```text
hard constraints
soft preferences
routing rules
state discriminators
rubrics
diagnostic tests
source-prior corrections
rendering controls
transformation rules
```

基本知识治理循环是：

```text
1. Construct a task-specific control space.
2. Induce candidate control objects.
3. Validate them against task-relevant evidence.
4. Store them as GKOs with scope and revocation rules.
5. Use them to guide routing, search, audit, and rendering.
6. Monitor failures.
7. Weaken, revise, or revoke GKOs as new evidence arrives.
```

知识治理在局部对齐区间中最有用。模型具有足够局部能力来生成有用控制候选，但任务需要持续的控制知识，而普通上下文续写无法可靠保存这些知识。

---

## 9. 审计工程

审计工程是把失败信号转换为受治理控制变更的纪律。

核心不对称是：

```text
Excellent generation is often difficult.
Defect identification is often easier.

Complete specification is often difficult.
Counterexample-driven specification repair is often easier.
```

审计不只是分数。分数说明一个产物有多好。审计发现说明哪里失败、为什么重要、什么证据支持诊断、哪个控制对象必须改变，以及什么回归护栏应防止复发。

最小审计发现 schema 是：

```json
{
  "id": "finding.unique_identifier",
  "artifact": "candidate or system output being audited",
  "finding": "localized defect statement",
  "evidence": "specific evidence for the defect",
  "mismatch_type": "observation_representation | state | fitting_boundary | support | aggregation | specification | compound",
  "severity": "low | medium | high | critical",
  "repair_target": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown",
  "repair_layer": "agent | training | hybrid | unknown",
  "control_delta": "proposed change to the governed control space",
  "regression_guard": "test, check, or condition that should fail if the defect recurs",
  "confidence": "confidence in the diagnosis"
}
```

审计工程循环是：

```text
Candidate artifact
  → audit
  → failure localization
  → control delta
  → GKO / state / verifier update
  → regeneration
  → regression guard
  → defect ledger
```

一个回归护栏只有在重新引入代表性缺陷会让护栏失败时，才真正有力。否则它不是回归测试，而是回归剧场。

因此，审计工程把失败转化为持久系统知识。它是写回机制，防止每次失败都像新问题一样被重新发现。

---

## 10. 状态治理智能体范式

知识治理治理控制知识。审计工程治理失败写回。**状态治理智能体范式** 治理状态权威。

长程 LLM 系统不能依赖上下文叙事作为真相来源。上下文窗口可以描述进展、总结计划、模拟记忆或声称完成。但描述不是提交。只有当硬状态中发生有效转移时，系统才真正取得进展。

基本转移契约是：

```text
S + A → O → V → S'
```

其中：

- `S` 是当前已提交状态。
- `A` 是拟议行动。
- `O` 是观测到的结果。
- `V` 是验证器或提交准则。
- `S'` 是下一个已提交状态。

行动不应仅仅因为 LLM 说它成功了就更新系统权威状态。只有当观测和验证器满足转移契约时，它才应更新状态。

SGAR 不是第七类原始失配。它是任务跨越时间、工具、文件、agent、修订、失败与恢复的系统所需的运行时体制。

它防止常见长程失败：

```text
false completion
state drift
state oscillation
performative action
memory contamination
unrecoverable intermediate failure
context-level progress illusion
role confusion
```

在受治理系统中，审计发现、GKO 更新、撤销、验证器结果、升级和工具输出在满足显式提交规则时，应成为状态转移。

---

## 11. 统一对象模型

知识治理、审计工程和 SGAR 可以统一为一个对象系统。

核心对象是：

| 对象 | 功能 |
|---|---|
| GKO | 存储受治理控制知识。 |
| GExO（受治理执行对象 / Governed Execution Object） | 存储任务、计划、行动或工作流项等受治理执行对象。 |
| GEsO（受治理升级对象 / Governed Escalation Object） | 存储受治理协作与升级对象。 |
| 审计发现 | 定位失败及其证据。 |
| 控制增量 | 说明控制空间应如何改变。 |
| 回归护栏 | 防止一类失败复发。 |
| 缺陷账本 | 记录缺陷家族、修复、回归和撤销。 |
| 状态记录 | 表示当前已提交系统状态。 |
| 转移契约 | 定义行动何时成为已提交状态转移。 |
| 撤销规则 | 定义对象何时应被削弱、修订或移除。 |

对象流是：

```text
Candidate Artifact
  → Audit Finding
  → Control Delta
  → GKO / GExO / GEsO / Verifier / State Update
  → Regression Guard
  → Defect Ledger
  → Hard State Commitment
  → Future Routing / Search / Rendering / Revocation
```

这个对象流使系统具有累积性。失败不只是产生另一个 prompt。它会更新系统的受治理结构。

---

## 12. Text-to-SQL 作为旗舰实例

Text-to-SQL 是该理论的自然实例，因为它暴露了几乎每一个管线站点。

直接 prompt-to-SQL 方法要求模型一步生成最终产物：

```text
question + schema → SQL
```

这是一种高失配表述。系统必须保存 schema 结构、推断问题意图、识别表和列、落地值、选择 join path、构造谓词、处理聚合、尊重数据库内容，并产生可执行语法。局部合理性不够。一个 SQL 查询可以看起来合理却全局错误。

受治理表述改变控制空间：

```text
question + database
  → schema representation
  → task-critical variable extraction
  → schema subgraph
  → column / value binding
  → join-path candidates
  → predicate skeleton
  → SQL rendering
  → execution audit
  → repair delta
```

每类原始失配都有清晰角色：

| 失配 | Text-to-SQL 表现 |
|---|---|
| 观测-表征 | 相关 schema、外键、样本值或数据库内容未能进入操作性表征。 |
| 状态 | 查询依赖数据库内容、隐式值分布或无法仅从表面问题识别的潜在意图。 |
| 拟合边界 | 模型过度触发模板 SQL 生成，并欠触发 schema 审计、值落地或 join 搜索。 |
| 支持 | 稀有 join 模式、嵌套查询或隐式聚合结构在直接生成下低支持。 |
| 聚合 | SELECT、JOIN、WHERE、GROUP BY、HAVING 和 ORDER BY 子句可能局部合理但全局不一致。 |
| 规格 | 自然语言意图、执行准确性、语义正确性和 benchmark 指标可能分离。 |

执行反馈提供了少见的强审计权威。模型可以提出、解释或修复，但执行结果和语义检查具有高于流畅自信的权威。失败应转换为局部控制增量：

```text
wrong join path → update join-path constraint
wrong value grounding → update value-normalization GKO
empty result set → inspect predicate overconstraint
ambiguous column → add schema-linking discriminator
wrong aggregation → revise predicate / grouping skeleton
```

理论重点不是 text-to-SQL 需要更多提示。重点是，直接 SQL 生成被转化为受治理控制空间搜索。最终 SQL 从经审计的中间对象中渲染。

---

## 13. 与既有形式传统的关系

这个理论并不意在替代更早的形式传统。它复用若干结构性思想，并把它们适配到开放式 LLM 系统中。

### 13.1 CEGIS 与审计工程

反例引导归纳合成会构造候选、寻找反例并细化候选空间。审计工程具有类似循环，但场景不同。在开放式 LLM 任务中，规格本身可能是不完整、默会的，或通过失败被修订的。审计不只是找到固定形式规格的反例。它也可能修复规格、表征、router、支持搜索或控制对象。

### 13.2 突变测试与有牙齿的护栏

突变测试询问测试是否能检测注入缺陷。有牙齿的回归护栏把同一原则应用到受治理 LLM 系统中：一个护栏只有在代表性缺陷复发会使其失败时才有意义。

### 13.3 信念修订与 GKO 撤销

AGM 风格信念修订和真值维护系统研究信念如何被辩护、修订和撤回。GKO 把类似原则应用于任务特定控制知识。GKO 不应是不朽的 prompt 指令。它应具有支持域、证据、优先级、生命周期和撤销触发器。

### 13.4 POMDP、主动感知与状态失配

状态失配与部分可观测性有关，但部分可观测性本身不是失败。在 POMDP 中，信念状态是可用观测历史的充分统计量；若系统在该信念下采取最优或风险有界行动，就不存在状态失配。失配发生在实际信念偏离证据所支持的信念，或系统没有保存该不确定性时。询问、查询工具和主动感知可以是信念策略的一部分；只有当某个可行且应接入的证据通道缺失或被损坏时，上游主诊断才是观测-表征失配。

### 13.5 事件溯源、事务与 SGAR

SGAR 类似事件溯源和事务日志，因为行动只有通过显式转移规则提交后才变得持久。不同之处在于，LLM agent 运行在异质任务、工具、文档、记忆、审计和人类协作之上。核心思想相同：状态权威应被外部化并可重放，而不是从叙事上下文中推断。

### 13.6 Goodhart、机制设计与规格失配

规格失配与代理优化和 Goodhart 效应有关。可访问评估器可能成为真实效用的劣质代理。在 LLM 系统中，这个问题被放大，因为提示、rubric、奖励模型、人类偏好和 benchmark 指标都可能只压缩了部分任务价值。

---

## 14. 何时不需要治理

一个强理论应说明自己的边界。知识治理、审计工程和 SGAR 并非普遍必要。

当：

```text
expected value gain from governance
  >
governance cost + governance-induced risk
```

时，治理才有正当性。

更明确地说：

```text
P(failure without governance)
× value at stake
× expected reachability gain
>
token cost + latency cost + human review cost + implementation cost + governance-induced error risk
```

治理通常在以下情形有用：

```text
task value is high
failure is hard to locally detect
local improvements do not compose reliably
state persists across time
control knowledge can be reused
mistakes are expensive
specification is tacit or evolving
external verification exists but must be integrated
```

治理可能不必要，甚至有害，当：

```text
the task is low-risk and one-shot
local quality strongly predicts global quality
the specification is simple and explicit
ordinary retrieval supplies the missing facts
a complete verifier already exists
the task lies in a positive probability-value alignment regime
governance adds latency, conflict, overfitting, or brittle meta-rules
```

这个边界是必要的。该理论不是重架构的强制令。它是一个判断何时重治理值得的决策框架。

---

## 15. 理论的自我审计

该理论应把自己的治理原则应用于自身。

核心主张可以表示为一个 GKO：

```json
{
  "id": "gko.six_primitive_mismatches",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as world-observation-representation-routing-support-aggregation-evaluation pipelines",
  "assertion": "Task-value failures can be decomposed into observation-representation, state, fitting-boundary, support, aggregation, and specification mismatches, plus compound interactions.",
  "strength": "structural-relative",
  "support_scope": "Value-preservation failures under the specified pipeline abstraction",
  "revocation_trigger": "Identification of a structurally distinct pipeline station that produces irreducible task-value failures not captured by the six categories",
  "not_supported_claims": "Does not claim absolute completeness over all computational systems; does not claim every empirical failure has a single mismatch cause."
}
```

每类原始失配都应有类似的支持域和撤销触发器。

例如：

```json
{
  "id": "gko.observation_representation_mismatch",
  "type": "primitive_mismatch_claim",
  "condition": "Task-critical world variables must pass through observation and representation functions before model control is possible.",
  "assertion": "If value-relevant variables are lost, aliased, or made inaccessible before entering Z, downstream reasoning cannot reliably recover them.",
  "revocation_trigger": "Show that all such failures can be reduced to state, support, aggregation, specification, or routing failures without losing intervention specificity."
}
```

这种自我审计很重要，因为它使该理论原则上可证伪。它说明理论适用在哪里，不声称什么，以及什么发现会要求修订。

---

## 16. 结论

高价值 LLM 系统失败，不只是因为模型生成了不完美文本，而是因为任务价值难以在多阶段管线中被保存。可行获得的决定性变量可能没有进入表征。系统的信念可能偏离证据所支持的状态分布。正确能力可能没有激活。高价值结构可能支持很低。局部改进可能无法组合。可访问评估器可能优化错误代理。

本文主张，这些不只是表面错误。它们是六类原始失配，分别对应世界到输出管线中的结构性不同站点。在这个抽象下，它们提供了一张相对完备且操作上独立的价值保存失败地图。

该理论也解释了为什么复合失败常常是超加性的。修复算子相互耦合。一个站点的失败可能禁用修复另一个站点所需的条件。因此，简单增加更多输出空间搜索、更多批判或更多自我反思，可能改善局部质量，却仍然不触及决定性失配。

建设性的回应是转化任务。保留模型局部对齐或正向对齐的部分，并把高失配组件转换为受治理控制对象。知识治理存储并修订这些对象。审计工程把失败写回控制空间。SGAR 把已验证进展提交进硬状态。它们共同描述了一种系统架构，用于把局部模型能力转化为持久、可审计、有状态的任务表现。

因此，先进 LLM 系统的核心问题不只是生成。它是在观测、表征、路由、支持、聚合、规格、审计与状态转移中治理任务价值。

---

## 附录 A：紧凑术语表

| 术语 | 定义 |
|---|---|
| LLM 平庸 | 在合理但次优输出区域中的预算受限集中。 |
| 自回归引力（经验昵称） | 当前模型与解码配置把概率质量或可达候选集中在常见但次优区域的经验现象；主要按支持失配诊断，不是自回归分解的结构定理。 |
| 局部对齐 | 模型似然与任务价值局部对齐但非全局对齐的区间。 |
| 正向概率-价值对齐 | 模型倾向在相关结构中强化任务价值的区间。 |
| 平庸到卓越转化 | 把高失配任务重新参数化为低失配、正向对齐的控制任务。 |
| 知识治理 | 诱导、验证、存储、修订和撤销任务特定控制知识的框架。 |
| GKO | 具有作用域、证据、优先级、生命周期和撤销触发器的受治理知识对象。 |
| 审计工程 | 把失败发现转换为控制增量和回归护栏的纪律。 |
| SGAR | 通过硬状态转移契约提交进展的运行时体制。 |
| 控制增量 | 由审计发现诱导的控制空间局部变更。 |
| 回归护栏 | 防止一类缺陷复发的测试或检查。 |
| 撤销触发器 | 受治理对象应被削弱、修订或移除的条件。 |
