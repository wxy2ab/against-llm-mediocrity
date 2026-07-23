# Audit Engineering：从生成—验证不对称到通用 Agent 治理

## 摘要

Audit Engineering，中文可称为**审计工程**，是一种面向 LLM 与 Agent 系统的推理时工程范式。它不把高质量产物主要寄托于一次性写出完美提示词，也不把审计理解为生成之后的简单打分。相反，它把审计循环设计成一套完整机制：发现真实目标、定位失配、回写控制对象、保留历史轨迹、在必要时更新硬状态，并防止下一轮退化。当前更稳定的对外压缩方式，可以概括为四个方面：它以**生成—验证不对称**为基础原理；优先利用**环境反馈、编译器、测试、runtime、执行结果**等较硬证据；在文本、claim、design doc 等任务上可操作化为 **claim-evidence 驱动的结构化对抗审计**；并可由独立的 **Auditor / Repair Router / Regression Auditor** 等角色来实现。

它的基本判断是：在大量开放式、高失配、隐含标准强的任务里，直接生成优质产物很难，但识别产物哪里不对、哪里不完整、哪里偏离真实目标，往往相对容易。审计工程把这种**生成—验证不对称**工程化：

> 让生成暴露问题，让审计把问题转化为可执行的控制增量，提交必要的状态转移，再让 Agent 沿着这些增量继续迭代。

这四个方面并非完全同级：第一项是第一原理，第二项是证据来源，第三项是特定任务的操作范式，第四项是组织实现层。在更上层，系统仍需要通过 **oracle classification / engine routing** 来决定是进入 audit、SGAR、gate hardening 还是 No-Go；因此这里保留“审计工程是第四个正交维度”的历史定位，但不把独立审计角色误写成总框架本身。

这使它有资格与 Prompt Engineering、Context Engineering 和 Hardness Engineering 并列：

- Prompt Engineering 控制"怎么问"；
- Context Engineering 控制"给什么信息"；
- Hardness Engineering 控制"任务、环境与验收边界有多硬"；
- Audit Engineering 则控制"生成之后如何发现真实目标、定位失败、回写控制空间，并防止下一轮退化"。

---

## 1. 为什么需要审计工程

传统 Prompt Engineering 隐含了一个前提：用户能够在任务开始前，把目标、约束、风格、成功标准和边界条件尽可能完整地写入提示词。但在许多高价值任务里，这个前提并不成立。

用户可能知道"不对"，却说不清"怎样才对"；知道结果没达到目标，却无法在第一轮生成前完整定义那个目标。

这不是表达能力问题，而是任务本身具有以下特征。它们也对应了审计工程最常见的几个落点：第一原理上的生成—验证不对称、环境与执行反馈提供的高硬度证据、文本逻辑任务中的 claim-evidence 审计，以及独立 Auditor/Router/Regression Auditor 带来的实现分工。

1. **真实目标会在生成中涌现**：只有看到候选产物以后，用户或审计器才知道哪些质量维度真正重要。
2. **标准由反例驱动**：开局没法写出完整验收标准，但看到失败样本后，可以稳定指出缺陷。
3. **任务价值是非局部的**：局部段落、推理或数据表都可能不错，但组合起来仍不满足整体目标。
4. **过早规格化会压窄搜索空间**：提示词越复杂，模型可能越服从显式要求，却越难发现高价值的新结构。
5. **审计通常比卓越生成更可控**：检查漏洞、枚举反例、发现规格偏差和追踪约束违背，通常比直接生成卓越成品更稳定。

因此，审计工程的核心不是"评价结果"，而是：

> 通过审计，把模糊目标转化为可定位、可修订、可回归测试的控制对象。

## 2. 与 Prompt、Context、Hardness Engineering 的关系

审计工程不是前三者的替代品，而是第四个正交维度。

这里的“第四个正交维度”说的是治理焦点，而不是说所有相关要素都属于同一抽象层。更准确地说，审计工程这条维度内部还包含第一原理、证据来源、操作范式和实现组织等不同层次；它们共同回答的是“系统怎样从失败中学习”，而不是简单等同于“要不要加一个审计 agent”。

| 范式 | 控制对象 | 主要问题 | 典型产物 | 主要局限 |
| --- | --- | --- | --- | --- |
| Prompt Engineering | 指令表面 | 怎么让模型理解任务 | 提示词、角色、格式、步骤 | 依赖用户提前说明目标 |
| Context Engineering | 信息状态 | 模型应该看到什么 | 文档、检索、记忆、上下文窗口 | 信息充分不等于目标正确 |
| Hardness Engineering | 任务难度与边界 | 如何避免低难度代理任务骗过系统 | 难例、强约束、环境反馈、硬验收 | 提高硬度后仍需定位失败 |
| Audit Engineering | 审计循环与失败回写 | 如何从失败中发现目标并指导下一轮 | 审计契约、缺陷账本、控制增量、回归测试 | 审计器也可能继承规格失配 |
| State-Governed Agent Regime | 硬状态权威 | agent 当前承认什么，哪些转移有效 | 状态账本、转移记录、恢复点、回滚规则 | 硬状态可能固化错误抽象 |

它具有独立地位，因为它具备四个条件：

- **独立瓶颈**：系统可能已有足够好的提示、上下文和任务边界，却没有稳定的失败定位与回写机制。
- **独立对象**：它治理 Audit Contract、Audit Finding、Defect Ledger、Repair Routing、Acceptance Gate、Regression Test 和 Audit Memory。
- **独立操作**：它要求把每个问题映射回需求、上下文、控制空间、数据、工具、评价器或渲染器，而不只是"让模型批评一下"。
- **通用循环**：故事、金融研究、代码审查、战略方案、法律备忘录、产品 PRD 和复杂文档都可以使用"候选—审计—定位—回写—再生成—回归审计"。

更简洁地说：

```text
Prompt Engineering   = 输入指令工程
Context Engineering  = 观察状态工程
Hardness Engineering = 任务边界工程
Audit Engineering    = 验证—回写工程
SGAR                 = 硬状态治理
```

## 3. 定义与形式化

**审计工程，是通过迭代审计、修复路由和回归治理，把未充分说明的用户价值转化为显式、可执行、可撤销控制信号的工程范式。**

给定任务输入 `x`、候选产物 `y`、历史轨迹 `H`、控制状态 `C`、受治理知识 `K` 与当前协议 `P`：

```text
Generator: y_t = G(x, C_t, K_t, H_t)
Auditor:   a_t = A(y_t, x, C_t, K_t, H_t, P_t)
Router:    ΔC_t, ΔK_t, ΔP_t = Route(a_t)
Update:    C_{t+1}, K_{t+1}, P_{t+1} = Update(C_t, K_t, P_t, Δ)
Renderer:  y_{t+1} = G(x, C_{t+1}, K_{t+1}, H_{t+1})
Gate:      accept | continue | escalate | stop
```

审计输出 `a_t` 不应只是自然语言点评。一个最小结构如下：

```json
{
  "finding": "发现的问题",
  "evidence": "来自产物、上下文或外部数据的证据",
  "mismatch_type": "aggregation | support | state | specification | fitting_boundary | observation_representation",
  "severity": "blocker | major | minor | note",
  "repair_target": "prompt | context | control_space | data | tool | evaluator | renderer | human",
  "control_delta": "建议写回的控制状态变化",
  "regression_test": {
    "guard": "下一轮必须检查什么，防止复发",
    "kind": "code | nl_rule | external_check",
    "teeth_proven": true,
    "proof_obligation": "重新引入代表性缺陷或 mutation，且该测试必须失败"
  },
  "confidence": 0.0
}
```

四个判断可以区分"审计"与普通评论：

- 如果不能产生可执行的 `control_delta`，它只是评论。
- 如果不能声明 `repair_target`，它不能指导 Agent 下一步行动。
- 如果不能产生 `regression_test`，它不能防止系统反复踩坑。
- 如果 `regression_test` 没有被证明“有牙齿”，它就无法证明自己真的能抓住所声称防止的缺陷。

## 4. 第一原理：生成—验证不对称

审计工程建立在三个相对不对称上：

1. 高质量生成难，缺陷识别相对容易。
2. 完整规格难，反例驱动的规格修订相对容易。
3. 当当前选择依赖尚未写出的未来结构时，受前缀限制的构造很难；完整候选条件化的修复相对容易，因为完整候选会暴露非局部关系。

在开放式任务里，用户很难提前写出完整目标函数，但可以在看到候选后判断："它缺少 X、过度强调 Y、忽略了 Z、把 A 当成了 B。"如果这类反馈只停留在自然语言意见里，它很容易被下一轮生成稀释；如果被记录为结构化审计发现，它就能成为下一轮的控制信号。

第三种不对称改变了任务的信息结构。首次自回归构造时，模型只能在前缀条件下选择：

```text
p_theta(y_t | x, y_<t)
```

但当前最优选择可能依赖只会出现在 `y_>t` 中的接口、回收、矛盾、依赖或承诺。完整候选 `y_0` 存在以后，修复变成候选条件化生成：

```text
p_theta(y'_t | x, y_0, audit(y_0), y'_<t)
```

模型仍然是自回归的，但旧的完整 artifact 已成为 witness。它把原本潜在的跨部分约束变成可观察关系，使系统可以搜索修复增量，而不是重新构造整个产物：

```text
delta* = argmax_delta [U_hat(y_0 + delta) - U_hat(y_0)]
         subject to preserved constraints and regression guards
```

这是 tractability transformation，不是全局最优保证。它可以改善初始盆地，并在审计扩大修复邻域时离开初始盆地，但也可能继续被第一版候选或弱 verifier 锚定。

### 4.1 Oracle 获取阶梯

以下 Tier 描述审计信号如何获得。它们是逐步降级的 fallback ladder，不表示数字更高就更有权威。

| Tier | 信号来源 | 可安全支持的主张 |
| --- | --- | --- |
| Tier 0 | 原生环境或可执行 oracle：编译器、类型检查器、确定性测试、proof checker、执行参照 | 只认证 oracle 在声明作用域内编码的性质 |
| Tier 1 | 构造的 hard sub-oracle：不变量、property test、metamorphic relation、临时契约、differential check | 把软目标的一部分局部硬化；语义保真度和覆盖仍需独立 teeth-proof |
| Tier 2 | 完整候选条件化的 learned verifier | 为排序、定位和修复提供局部 proxy gradient；不认证全局质量 |
| Tier 3 | 基于分解视角或论点的 context-conditioned 结构化验证 | 可以增加结构覆盖并暴露相关盲点；统计置信度需要外部校准和显式错误模型 |

### 4.2 Tier 2：完整候选条件化的局部优化

当任务价值依赖非局部关系、完整候选能暴露关系违反，并且有界修复能保留大部分既有价值时，Tier 2 最强。它的操作形式是：

```text
complete candidate
-> expose violated relation
-> localize repair target
-> choose repair radius
-> apply control delta
-> run regression audit
```

修复半径不局限于 token。它可以从 span 扩大到函数或场景，再扩大到模块或章节、架构或情节规划，最后回到修订后的控制空间重新生成。因此，审计引导的是 variable-neighborhood search，而不只是润色当前草稿。

### 4.3 Tier 3：Context-conditioned 正交审计

在同一 context 和同一 prompt 下重复采样，主要估计单个条件分布内部的变化。Tier 3 则构造一个受治理的条件族：

```text
y_ij ~ p_theta(y | x, context_i, prompt_i, decomposition_i)
```

并把审计族视为条件混合：

```text
q_T3(y | x) = sum_i w_i p_theta(y | x, context_i, prompt_i, decomposition_i)
```

当不同 context 暴露不同证据、表征、假设、反事实、工具或 exemplar 时，它可以扩大有效结构支持。如果每个 branch 只是对同一信息的改写，并且仍路由到同一个已学习盆地，Tier 3 就会退化回伪多样性。

Tier 3 当前的地位是**条件性工作主张**。prompt diversity、context 隔离、问题分解和多来源证据分别在部分领域有支持，但它们的组合不是通用 verifier。没有外部校准时，Tier 3 可以报告跨 context 稳定性、分歧和无支持区域，但不能把模型共识直接翻译成 truth probability。

这些不对称都不是无条件成立的。缺陷必须能定位，标准必须逐步显式化，修复必须保留重要的已满足约束，verifier error 也必须与任务效用保持足够一致。在强规格失配下，审计器本身同样需要被验证。审计工程因此既工程化 verifier，也治理 verifier。

## 5. 与 Knowledge Governance 的关系

Knowledge Governance 是更大的框架。它通过解耦控制空间、受治理知识对象、验证、渲染、监控和修订，把任务特定知识外化为可治理对象。

Audit Engineering 是其中可以独立命名的一层，专门处理三件事：

1. **如何审计**：审计哪些维度、使用什么强度、按什么顺序、是否需要对抗性审计。
2. **如何定位**：问题来自规格、状态、支持、聚合、拟合边界，还是渲染损失。
3. **如何回写**：如何把发现变成控制对象、约束、禁用模式、验收门槛、撤销规则、人工决策点或硬状态转移。

二者的区别可以概括为：

```text
Knowledge Governance 关心：怎样让任务知识受治理。
Audit Engineering 关心：怎样让失败信号受治理。
```

前者保存"什么应该被用于生成"，后者保存"什么失败不能再发生，以及为什么"。

对于长程 agent，这一点直接连接到 [状态治理智能体范式](state-governed-agent-regime.zh-CN.md)：审计发现不应只是在下一轮 prompt 里提供建议。当它改变被承认的任务状态、可执行行动、证据要求、回滚义务或完成门槛时，它应被提交进硬状态。

## 6. 一般流程

### 6.1 从弱需求开始

审计工程允许用户从一个不完整的需求开始，例如"做一个金融研究框架"或"把这些材料变成可执行计划"。它不要求开局就把需求扩写成庞大的规格文档。

### 6.2 生成低成本候选

第一轮的目的不是一次达标，而是制造一个足够完整、可以暴露结构问题的审计对象。

```text
Weak Brief -> Candidate v0
```

### 6.3 建立 Audit Contract v0

审计契约是当前轮次的临时协议，不是真理。它至少包括：

- 交付物类型与用户可见目标
- 已知约束与禁止失败模式
- 审计维度与严重性等级
- 审计器不能自行假设的内容
- 停止条件

审计契约本身可以被修订，因为真实标准往往不是开局就完整已知。

### 6.4 独立审计候选

审计器负责发现、定位与路由问题，不负责直接重写产物。生成器与审计器应尽量在接口层隔离——这不应只停留在"最好如此"的建议上。即使底层使用同一模型，也应使用不同上下文，并在可验证任务中引入外部工具或专门 verifier。对 Tier 3，各 branch 在聚合前应保持独立，并接收声明清楚的 context contract：root question、视角或论点、证据来源、假设、排除信息、验证标准和输出 schema。

此外，产出修复的模型不应通过任何 fallback 路径自行编写自己的 acceptance test 或 mutation 集。如果这些对象是 promotion 的前提，它们就必须作为独立的操作员输入或 verifier 输入进入系统。

最小审计范围包括：

- **规格审计**：是否满足真实任务，而不只是满足提示词？
- **结构审计**：局部正确是否组成全局价值？
- **状态审计**：是否依赖未说明、变化或隐藏状态？
- **证据审计**：事实、数据、引用和时间点是否可靠？
- **边界审计**：结论在相邻情境下是否仍然成立？

### 6.5 把发现映射回控制空间

这是审计工程与普通评价的分界线。"报告不够深入""人物动机不足""策略缺少风险"——这些都不是足够好的审计输出。系统还必须追问：

- 这个缺陷应该修改哪个控制对象？
- 是任务规格不清，还是上下文缺证据？
- 是结构层缺变量，还是渲染层没有保留？
- 下一轮如何检查它不再复发？

| Repair Target | 说明 |
| --- | --- |
| Prompt Delta | 任务指令需要修改 |
| Context Delta | 需要新增事实、数据、材料或记忆 |
| Control-Space Delta | 中间结构缺少变量、依赖、约束或状态 |
| Evaluator Delta | 审计标准本身错误或过弱 |
| Tool/Data Delta | 需要外部工具、实时数据、计算或检索 |
| Renderer Delta | 控制状态正确，但最终表达发生损失 |
| Human-Governed Delta | 必须由人决定价值判断、风险偏好或商业边界 |

### 6.6 局部修复

如果问题来自控制空间，就不应直接"重写一版最终产物"。更稳的修复顺序是：

```text
先修控制对象 -> 再修局部结构 -> 最后修表面表达
```

反复全文重写会退化为普通输出空间采样，并丢失"哪项控制决策导致缺陷"的信息。

局部修复是默认策略，不是牢笼。当 finding 位于结构上游或存在高密度耦合时，auditor 应扩大邻域：

```text
span edit
-> function / scene rewrite
-> module / chapter rewrite
-> architecture / plot replan
-> regenerate from revised control space
```

如果局部 delta 无法修复 finding，或不断破坏需要保留的约束，就必须升级修复半径。

### 6.7 回归审计

每一轮修复都可能引入新问题。回归审计检查：

- 上一轮 blocker 是否消失？
- 上一轮 major 是否解决、降级或被显式接受？
- 旧约束是否被破坏？
- 新增内容是否与旧内容冲突？
- 是否为了修一个问题牺牲了更重要目标？
- 每个新增回归测试在重新引入代表性缺陷或 mutation 时，是否会真实变红？

在这个阶段，机械检查应构成验证地板。只要可复现检查失败，发现就不能 promotion。LLM 判断仍可在机械检查通过后参与复核，但它只能降低置信度或要求进一步复审，不能凭自身权威把 red 改成 green，也不能把 green 单独改成 red。

### 6.8 将发现 promotion 为常驻守卫

如果发现只停留在一次性的文字记录里，回归治理仍然是不完整的。一个缺陷只有经过 promotion ratchet，才算真正进入受治理状态：

```text
finding -> 搭建候选 guard -> 证明 guard 有牙齿 -> 记入 defect ledger -> 后续要求稳定通过
```

如果回归测试是空洞的、重新引入代表性缺陷后仍不失败，或者 guard 只存在于当前会话而没有成为常驻控制对象，那么 promotion 必须被拒绝。

### 6.9 结束循环

停止不是"产物没有任何缺点"，而是"剩余缺点已经被显式管理"。可用停止条件包括：

- 无 blocker 缺陷；
- major 缺陷均已解决、降级或转为显式风险；
- 连续两轮没有新增高价值控制增量；
- 已证明有牙齿的回归测试稳定通过；
- 外部验证或人工验收通过；
- 审计的边际收益低于成本阈值。

## 7. 核心对象体系

### 7.1 Audit Contract

定义本轮审计的目标、边界、维度、强度和停止条件。

```json
{
  "artifact_type": "financial_research_memo",
  "primary_goal": "形成可被投资委员会讨论的研究框架",
  "known_constraints": ["不得给出未经验证的实时数据", "区分事实、判断和假设"],
  "audit_dimensions": ["thesis", "evidence", "valuation", "risk", "counterargument", "time_validity"],
  "blockers": ["数据口径错误", "未来信息泄露", "把假设写成事实"],
  "stop_condition": "无 blocker，主要假设均有证据或已标注不确定性"
}
```

### 7.2 Audit Finding

每条发现必须可追踪、可定位、可回归测试。

```json
{
  "id": "F-007",
  "finding": "结论依赖毛利率改善，但正文没有解释改善来源",
  "evidence": "第 3 节直接假设毛利率提升 2pct，无驱动拆解",
  "mismatch_type": "specification",
  "severity": "major",
  "repair_target": "control_space",
  "control_delta": "在 thesis_map 中加入 margin_driver_tree",
  "regression_test": {
    "guard": "检查每个关键财务假设是否存在驱动、证据和敏感性",
    "kind": "nl_rule",
    "teeth_proven": true,
    "proof_obligation": "从一个代表性假设中删除驱动解释，并要求该 guard 失败"
  }
}
```

### 7.3 Defect Ledger

缺陷账本保存历史问题、修复轮次、当前状态和复发记录。要看见复发，账本必须有稳定的 join key。对代码来说，这通常是 `(file, function, defect_family)` 之类的位置轴，而不是按 run 或 session 编号；对文档或方案，也应使用同样稳定的结构位置。如果账本只按会话编号记录，复犯会被系统性隐藏。

```text
open -> patched -> regression_passed -> accepted_risk -> revoked
```

### 7.4 Control Delta

控制增量描述审计发现如何改变下一轮生成空间。

```json
{
  "add_control_object": "margin_driver_tree",
  "modify_rubric": "毛利率假设必须拆成价格、成本、产品结构和产能利用率",
  "ban_pattern": "不得用单句趋势判断替代驱动拆解"
}
```

### 7.5 Regression Test

回归测试不一定是代码测试，也可以是可重复执行的自然语言验收项。例如：所有核心结论都必须回链到事实证据、明确假设、反方解释和触发失效的条件。

它的强制属性是：必须**被证明有牙齿**。一个 guard 如果永远是绿的，或者无法证明在重新引入缺陷后会失败，那它就不是回归测试，而是回归剧场。

```json
{
  "guard": "检查每个关键结论是否都具备证据、假设、反方解释和失效条件",
  "kind": "code | nl_rule | external_check",
  "teeth_proven": true,
  "proof_obligation": "重新引入代表性缺陷或 mutation，且该 guard 必须失败"
}
```

只要条件允许，这种证明就应通过 mutation、重放或缺陷回注等机械方式完成，而不是停留在语言保证上。也正因为如此，瞬时发现才能被 promotion 为常驻 guard。

### 7.6 Verification Hierarchy

验证必须有信任层级：

- 机械检查在其可判定范围内拥有权威；
- LLM 判断只在检查通过后运行；
- 当证据不足时，LLM 判断默认不满足；
- LLM 判断只能 downgrade，不能作为 override 通道。

这是对“agent 学会迎合 auditor”的结构性回应。系统可以迎合一个文本裁判，但不能把失败的退出码说服成成功。

### 7.7 Audit Memory

审计记忆保存可复用的失败模式。它不只记录成功模板，还记录哪些模式看起来高级却经常失败。负经验能大面积剪掉低价值搜索分支。

## 8. 审计类型

| 类型 | 核心问题 |
| --- | --- |
| Conformance Audit | 是否满足显式格式、约束和交付要求？ |
| Value Audit | 产物是否真正服务任务目标，而不是只满足表面要求？ |
| Structural Audit | 局部好内容是否组成整体价值？ |
| Evidence Audit | 事实来源、数据口径、时间点和推理链是否可靠？ |
| State Audit | 答案是否依赖隐藏、变化或未说明的状态？ |
| Channel Audit | 决定性变量是否进入可用观测、证据、工具、日志、传感器或控制表征？ |
| Adversarial Audit | 是否存在"看起来高级但实际失败"的模式？ |
| Audit-of-Audit | 审计器是否把偏好当标准、提出不可执行建议或只会增加复杂度？ |

这里最好再落地一些具名的 anti-theater detector。像 performative completion、degraded completion 这样的命名检查，能够把“看起来很高级但其实失败”的抽象风险压到机械可检查层。

## 9. 与六类失配的映射

| 失配类型 | 审计工程的处理方式 |
| --- | --- |
| Aggregation，聚合失配 | 检查局部改进是否组成全局价值，把整体结构外化为依赖图、承诺—兑现链或验收清单 |
| Support，支持失配 | 检查是否遗漏低显著性证据、少见结构、反例或尾部方案 |
| State，状态失配 | 检查适用状态、触发条件、时间窗口、市场、组织和用户状态 |
| Specification，规格失配 | 检查提示词、评分规约和显式目标是否偏离真实成功标准 |
| Fitting Boundary，拟合边界失配 | 检查模式、指标、模板、角色或反馈是否被过度泛化 |
| Observation-Representation，观测-表征失配 | 检查决定性变量是否进入观测、证据、工具、日志、传感器、验证器或编码后的控制表征 |

六类失配的价值不只是给失败命名，而是让不同失配指向不同干预：

```text
发现失配 -> 定位失配 -> 修改控制对象 -> 回归检查失配是否消失
```

## 10. 三类应用

### 10.1 故事生成

故事系统可以先把任务转成由人物状态、事件图、情绪曲线、主题线、节奏结构和冲突架构组成的 `LogicSpace`，再渲染草稿并审计。审计结果不是"文笔 8 分"，而是把问题路由到具体控制对象：

```text
剑鞘意象后文没有深化
-> theme_lines / promise_payoff_chain

人物态度转变缺乏心理动机
-> character_arc / value_transition

反派只提供外部压力
-> conflict_architecture / thematic_function
```

因此，故事审计器不是打分器，而是修复路由器。

### 10.2 金融研究

金融分析的高价值标准很难被一个开局提示词完全覆盖。一个更稳的循环是：

```text
弱需求
-> 初版研究 memo
-> thesis / evidence / valuation / risk / regime / counterargument 审计
-> defect ledger
-> 回写 thesis_map、driver_tree、risk_register、data_requirements
-> 再生成
-> 投委会、空头和数据口径审计
-> 最终 memo
```

金融场景中的审计工程不应直接等同于投资建议，而应先形成研究质量控制系统，例如 Thesis Map、Evidence Table、Assumption Register、Risk Register、Counterargument Map、Regime Matrix、Valuation Sensitivity、Data Freshness Log 和 Audit Findings Ledger。

### 10.3 通用 Agent

当用户说"做一个增长方案""整理这个项目"或"设计研究 pipeline"时，Agent 不必假装初始目标已经完整。它可以：

1. 生成候选方案；
2. 由独立 Auditor 审计真实目标与候选的偏差；
3. 由 Repair Router 把偏差路由到 prompt、context、control space、工具或验收标准；
4. 基于新控制状态生成局部修订；
5. 由 Regression Auditor 检查旧问题是否复发；
6. 保留历史轨迹，直到没有高价值控制增量。

用户可以暂时说不清完整目标，但审计循环必须说清楚每一轮为什么不达标。

## 11. 最小可用架构

一个最小系统包含五个角色：

| 角色 | 职责 |
| --- | --- |
| Generator | 生成候选，不替自己辩护 |
| Auditor | 发现并定位问题，不直接修复 |
| Repair Router | 把问题路由到 prompt、context、control、evaluator、tool 或 human |
| Editor | 执行局部修复，不默认全文重写 |
| Mechanical Checker | 执行具权威的可复现检查，失败时硬失败 |
| LLM Judge | 仅在检查通过后复核；对非机械维度执行 downgrade-only 判断 |
| Promotion Gate | 只有当候选回归 guard 成为常驻对象且已证明有牙齿时才允许 promotion |

它还需要六类状态存储：Artifact Store、Audit Ledger、Control State、Rubric Store、Regression Suite 和 Decision Log。

Verifier integrity 也是架构的一部分，而不是脚注。一个 agent 可以污染的 verifier 不提供任何有效信号。对代码任务和工具驱动任务，检查应尽量 hermetic，或运行在可信根之下，避免被审计对象静默改写“pass”的含义。

审计机制也应具备运维上的 gateability。较重的审计原语需要 default-off，并且在关闭时保持 byte-equivalent，这样验证成本只在需要时支付，而不是强加给每次运行。

```text
Brief
-> Candidate
-> Audit Findings
-> Control Deltas
-> Revised Control State
-> New Candidate
-> Regression Audit
-> Acceptance Gate
```

## 12. 最小提示模板

### Generator

```text
你是 Generator。请基于当前任务说明、控制状态和历史审计记录生成候选产物。

1. 优先满足当前 Control State。
2. 不要为上一轮错误辩护。
3. 不要自行删除审计器设定的约束。
4. 如果控制状态冲突，显式标出冲突，不要静默忽略。
5. 只输出候选产物，不输出审计意见。
```

### Auditor

```text
你是独立 Auditor。你不负责改写产物，只负责审计。

每条发现必须包含：
- finding
- evidence
- mismatch_type
- severity
- repair_target
- control_delta
- 一个已证明有牙齿的 regression_test 对象
- confidence

禁止只给笼统评价、用"更深入"替代定位、直接重写全文、
把个人偏好伪装成任务标准，或提出无法执行和验证的建议。
```

### Repair Router

```text
读取审计发现，并为每条发现选择：
accept_delta | reject_delta | downgrade | ask_human | require_data | audit_auditor

输出：
1. 被接受的控制增量
2. 被拒绝的审计发现及原因
3. 下一轮生成规则
4. 下一轮回归审计清单
```

### Regression Auditor

```text
机械检查具备权威，只有在其通过后才进入复核。
LLM 判断只能 downgrade 或要求复审，不能把失败检查改判为通过。

只检查：
1. 上一轮 blocker 是否已解决。
2. 上一轮 major 是否已解决、降级或显式接受。
3. 新版本是否破坏旧约束。
4. 是否为修复旧问题引入新 blocker。
5. 每个已 promotion 的回归 guard 是否已通过代表性缺陷回注或 mutation 证明其有牙齿。
6. 是否还有高价值控制增量值得继续迭代。
```

## 13. 常见失败模式

### 审计退化为打分

"结构 8 分、逻辑 7 分、表达 9 分"对下一轮几乎没有帮助。审计必须定位到控制对象。

### 审计器继承规格失配

审计器可能强化错误的评分规约。应使用 Audit-of-Audit、对比样本、反例和外部验证修订审计契约。

### 审计诱导过度复杂

审计器可能每轮都建议增加维度，导致控制空间组合爆炸。控制增量必须同时证明其价值、成本和可验证性。

### Agent 学会迎合审计器

系统可能开始优化 audit score，而不是真实价值。可使用对抗审计、隐藏测试、外部验证、人类验收和标准轮换缓解 Goodhart 问题，但更强的防线是结构性的：机械检查定义地板，LLM 判断只能 downgrade。

### 空洞回归测试 / 回归剧场

系统可能形式上提供了 regression_test，却完全没有保护作用。如果所谓 guard 在重新引入缺陷后依然保持绿色，那么系统得到的不是治理，而是表演。这类发现不得 promotion。

### Verifier 污染

框架可能默认 verifier 是可信的，但在 agent 具备文件与工具权限时，verifier 本身可能被篡改。被污染的 verifier 什么都检测不到。因此，hermetic 执行、可信根与外部化检查权威，都是一等公民要求。

### 只修表面，不修控制空间

"人物动机不足"只补几句心理描写，"金融假设缺证据"只加一句行业趋势，都只是遮盖缺陷。修复必须作用于缺失的结构或证据对象。

### 无限迭代

每轮都能找到问题，不代表每个问题都值得修。系统必须设置成本阈值和明确停止条件。

## 14. 衡量指标

审计工程的质量不应只看最终评分，还要看循环是否提高了系统可控性。

| 指标 | 含义 |
| --- | --- |
| Audit Yield | 每轮产生多少高价值控制增量 |
| Localization Rate | 审计发现能否定位到明确 repair target |
| Recurrence Rate | 同类缺陷是否反复出现 |
| Regression Pass Rate | 旧问题是否稳定不复发 |
| Teeth-Proof Rate | 已 promotion 的 guard 中，有多少被代表性缺陷回注证明会真实失败 |
| Control Delta Precision | 写回控制空间的改动是否真的提升产物 |
| Over-Audit Rate | 无价值或过度复杂建议所占比例 |
| External Validity | 外部工具、人类或真实环境是否支持结果 |
| Verifier Integrity | 被审计系统能否污染 verifier，以及污染难度有多高 |
| Cost per Accepted Artifact | 达到验收所需轮次、Token、时间和人工成本 |

Tier 2 与 Tier 3 还需要额外指标：

| 指标 | 含义 |
| --- | --- |
| Completion-Conditioned Lift | 候选条件化修复相对等预算重新生成带来的外部效用提升 |
| Repair-Radius Escalation Rate | 局部修复需要扩大到结构重规划或重新生成的频率 |
| Basin Escape Rate | 抵达与初始盆地结构不同且外部效用更高的候选族比例 |
| Within-Context Structural Diversity | 同一 context 与 prompt 下重复采样产生的结构变化 |
| Between-Context Structural Diversity | 受治理 context 与 prompt 干预产生的结构变化 |
| Cross-Context Error Correlation | 审计 branch 共享同一错误 finding 或遗漏的程度 |
| Unique Confirmed Finding Yield | 只有单一 context branch 提出、但最终被独立确认的 finding 数量 |
| False-Consensus Rate | branch 达成一致但被外部验证拒绝的比例 |
| Aggregation Loss | 正确局部 finding 在汇总时变成错误全局结论的比例 |

### 14.1 开放实验计划

以下主张有意保留为待直接实验。

**实验 AE-T1：构造 oracle 的杠杆。** 在等预算下比较无构造 oracle、builder 自己构造检查、独立 verifier 构造检查，以及 hidden-gold 上界。测量构造成本、语义 precision、coverage、mutation kill rate、hidden-gold pass rate，以及 verifier 与 builder 的错误相关性。

**实验 AE-T2：完整候选条件化修复。** 在代码、故事和论证组合上比较 fresh regeneration 与候选条件化 audit/repair。植入或标注非局部缺陷，改变 repair radius，测量定位准确率、外部效用提升、回归率、盆地逃逸，以及多轮迭代中 verifier score 与外部 score 的分叉。

**实验 AE-T3：Context-conditioned 结构化验证。** 使用等预算 factorial design：

```text
A. same context + same prompt + repeated sampling
B. same context + diverse prompts
C. diverse contexts + same prompt
D. diverse contexts + matched decomposition prompts
E. D + independent evidence or model diversity
```

每个 cell 内做少量重复，以分离 within-condition noise 和 between-context effect。任务应覆盖：模型熟悉的结构化领域；模型不熟悉但提供充分领域材料的任务；模型不熟悉且缺少决定性知识的负对照。核心检验是：between-context structural diversity 是否超过 within-context diversity，cross-context error correlation 是否下降，聚合后的 hidden-gold 或 human-grounded utility 是否提高。在这些检验通过前，Tier 3 仍是 coverage 与 robustness 机制，而不是 calibrated truth oracle。

## 15. 适用边界

审计工程最适合：

- 需求在开局时说不清；
- 高质量标准依赖隐性判断；
- 初版很容易"看起来对"；
- 错误成本高；
- 同类任务会反复出现；
- 用户能识别不满意，却难以提前表达；
- 最终价值由多个非局部结构共同组成。

它通常不值得重治理：

- 简单格式转换；
- 低风险摘要；
- 明确标准下的信息抽取；
- 一次性轻量改写；
- 局部润色；
- 已经处于LLM卓越区间的任务。

治理应选择性地作用于失配边界，而不是治理每个 Token。

## 16. 最终命题

当目标暂时说不清时，不要把复杂性全部塞进 Prompt。先让模型生成一个可审计对象，再用独立审计把"不对"转化为控制增量，用历史轨迹把隐性目标逐轮外化。

```text
故事：LogicSpace -> Draft -> Evaluation -> Defect Attack -> Revision
金融：ThesisMap -> Memo -> Evidence/Risk Audit -> Driver Repair -> Regression
代码：Architecture -> Implementation -> Test/Leakage Audit -> Refactor -> Regression
战略：Frame -> Plan -> Assumption/Counterfactual Audit -> Reframe -> Board-ready Output
Agent：Candidate -> Audit -> Control Delta -> Rerender -> Gate
```

Audit Engineering 不是 Prompt Engineering 的技巧，不是 Context Engineering 的子集，也不是 Hardness Engineering 的替代品。它把三个重要不对称——生成与验证、完整规格与反例驱动修订、前缀受限构造与完整候选条件化修复——转化为可复用的工程纪律。Context-conditioned 正交审计是这套纪律的条件性扩展：它可以扩大结构覆盖，但只有独立证据与校准聚合才能把覆盖提升为置信度。

> **Audit Engineering is the discipline of engineering verifier-side control loops that transform underspecified user value into explicit, actionable, and revocable control signals through iterative audit, repair routing, and regression governance.**
