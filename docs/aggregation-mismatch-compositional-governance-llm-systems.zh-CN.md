# LLM 系统中的聚合失配与组合治理

**副标题：局部价值、全局失败与组合关系治理**  
**状态：工作稿 v0.1**  
**系列：LLM 系统中价值保存的结构理论**

**实验配套：** [Artifact-v4 实验证据、理论差距与 Agent 含义](./aggregation-mismatch-v4-claims-theory-gap.zh-CN.md) · [Artifact-v5 稳定编辑 Agent](./aggregation-mismatch-v5-stable-editing-agent.zh-CN.md) · [Patch 与完整重写受控实验](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)

---

## 摘要

许多 LLM 失败并不是因为输出的每个局部部分都很差。它们发生在局部合理、局部有用或局部被改进的部分无法组合成全局有价值的产物时。

举几个例子：

- 一个 SQL query 可能有合理的 `SELECT`、看似可行的 `JOIN` 和可辩护的 `WHERE` clause，却返回错误答案。
- 一个代码补丁可能修复了局部症状，却破坏了隐藏不变量。
- 一个研究综合可能包含准确摘要，却不能支撑中心结论。
- 一个长程 agent 可能完成多个子任务，却没有推进真实项目状态。

本文把 **聚合失配** 展开为 LLM 系统价值保存结构理论中的原始失配之一。聚合失配发生在局部价值信号不能在构造最终产物的组合操作下保存全局任务效用时。

它是狭义上可称为 **自回归平庸** 的核心结构形式：局部上合理的 token 级续写、局部 refinement 和局部 critique，往往会产生流畅但全局次优的产物。这种倾向出现在任务依赖非局部依赖、延迟承诺、接口一致性、全局不变量或端到端语义时。

聚合失配不同于支持失配、规格失配、状态失配、观测-表征失配或拟合边界失配。即使满足以下条件，它仍可能发生：

- 相关信息存在，
- 状态已知，
- 正确能力已激活，
- 高价值组件可达，
- 目标清晰。

失败位于 **组合算子**：把 parts、clauses、modules、arguments、decisions、tool outputs 或 agent actions 组装成全局对象的过程。

建设性响应是 **组合治理**（Compositional Governance）。系统不再依赖无治理的局部 continuation，而是外化中间结构：依赖图、接口契约、全局不变量、绑定记录、组合计划、集成账本和端到端验证器。局部生成在它对齐的地方被保存，但全局价值由受治理组合对象和组合审计保护。

这一思路把核心问题从"模型能否生成好的局部部分？"转化为"系统能否在组装局部生成部分时保存全局不变量？"

### 与 Diagnostic–Mechanism Bridge 的关系

本文使用聚合失配作为一种价值保存诊断。当失败进入修复阶段时，Diagnostic–Mechanism Bridge 会把这一诊断映射到八轴机制目标与修复层：

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

### 机制层映射

聚合失配并没有单一专属的机制轴。它通常对应一个复合机制画像，横跨 `belief_representation`、`action_interface` 与 `search_execution`，有时还伴随支持相关放大因素。

```text
parts are represented but not bound into a globally valid object
  → likely composite repair_target
  → often includes belief_representation + action_interface + search_execution
```

从机制角度看，聚合失配指向的是整体对象保存失败，而不是某一个独立站点缺失。这也是为什么组合治理经常需要同时修补多个机制目标，而不能假定存在一条专属“聚合轴”。

---

## 目录

这是一篇较长的工作稿。读者导览：

- [1. 在统一理论中的位置](#1-在统一理论中的位置)
- [2. 核心定义](#2-核心定义)
- [3. 为什么聚合是原始失配](#3-为什么聚合是原始失配)
- [4. 聚合与自回归平庸](#4-聚合与自回归平庸)
- [5. 局部到全局失败的结构](#5-局部到全局失败的结构)
- [6. 局部价值不是同态](#6-局部价值不是同态)
- [7. 组合治理](#7-组合治理)
- [8. 组合治理循环](#8-组合治理循环)
- [9. 核心治理对象](#9-核心治理对象)
- [10. 聚合失配的审计工程](#10-聚合失配的审计工程)
- [11. 转换模式](#11-转换模式)
- [12. 与其他失配的相互作用](#12-与其他失配的相互作用)
- [13. Text-to-SQL 作为聚合失配](#13-text-to-sql-作为聚合失配)
- [14. 代码生成与补丁集成](#14-代码生成与补丁集成)
- [15. 研究综合与论证组合](#15-研究综合与论证组合)
- [16. 多 Agent 与工具型工作流](#16-多-agent-与工具型工作流)
- [17. 什么时候局部改进足够](#17-什么时候局部改进足够)
- [18. 组合治理的失败模式](#18-组合治理的失败模式)
- [19. 实用清单](#19-实用清单)
- [20. 与既有形式传统的关系](#20-与既有形式传统的关系)
- [21. 形式主张与撤销条件](#21-形式主张与撤销条件)
- [22. 结论](#22-结论)
- [Appendix A: 紧凑术语表](#appendix-a-紧凑术语表)
- [Appendix B: 最小组合治理模板](#appendix-b-最小组合治理模板)
- [Appendix C: 一页操作摘要](#appendix-c-一页操作摘要)

---

## 1. 在统一理论中的位置

价值保存结构理论通过世界到输出管线分析 LLM 系统失败：

```text
S_world
  → observation
  → representation
  → state identification
  → capability routing
  → candidate support
  → aggregation
  → evaluation
  → state commitment
```

六类原始失配对应管线中的结构上不同失败站点：

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

本文关注第五个站点：**聚合**。

聚合站点问：

```text
给定局部生成或局部选择的 parts，
什么操作把它们组合成全局有价值的 artifact？
```

当 parts 的局部价值不能被该操作保存时，就发生聚合失配。

这很重要，因为许多 LLM 系统围绕局部改进循环设计：

```text
generate a draft
critique the draft
revise the draft
add missing details
improve clarity
fix local errors
merge suggestions
summarize evidence
compose modules
combine tool outputs
```

这些操作常常有用，但也常常不充分。系统可以改进每个可见局部部分，却仍然退化或错过决定任务成功的全局结构。

本文核心论点是：

> 聚合失配是局部价值未能在系统组装流程下组合成全局价值的失败。修复它不能只靠更多局部改进，而要治理组合关系本身。

---

## 2. 核心定义

令最终产物 `Y` 由 parts 组合而成：

```text
Y = A(y_1, y_2, ..., y_n)
```

其中：

- `y_i` 是局部组件：tokens、clauses、paragraphs、functions、modules、arguments、retrieved snippets、tool outputs、agent actions 或 intermediate objects。
- `A` 是聚合算子：concatenation、synthesis、merging、execution、compilation、planning、voting、reranking、reduction、rendering 或 state update。
- `v_i(y_i)` 是 part `y_i` 的局部价值信号。
- `U(Y)` 是全局任务效用。

**聚合失配** 发生在局部价值不能保存全局效用时：

```text
high v_i(y_i) for each i

but

low U(A(y_1, ..., y_n))
```

或更一般地：

```text
local improvement of y_i does not imply improvement of U(Y)
```

这个定义覆盖三类重要情形。

### 2.1 局部好，全局坏

每个部分单独看都不错，但组装产物失败。

```text
∀i: v_i(y_i) is high
but U(Y) is low
```

例子：

```text
SQL query 的 clauses 都 plausible，但 join semantics 错。
法律 memo 的教义摘要准确，但 conclusion 无支撑。
代码补丁修复局部测试，却破坏系统 invariant。
计划步骤合理，但顺序不可执行。
```

### 2.2 局部改进，全局退化

一次修订改进了局部部分，却让全局产物变差。

```text
v_k(y'_k) > v_k(y_k)

but

U(A(..., y'_k, ...)) < U(A(..., y_k, ...))
```

例子：

```text
澄清一个段落破坏了 cross-reference。
优化一个函数改变了隐式 API contract。
增加 caveat 削弱了决定性 argument。
让 SQL predicate 更具体却排除了正确 rows。
```

### 2.3 全局必要，局部不吸引

某个部分局部看起来笨拙、有风险、冗长或低概率，但对全局正确性必要。

```text
v_i(y_i) appears low
but y_i is necessary for high U(Y)
```

例子：

```text
看似冗余的 guard clause 保存 safety invariant。
不优雅的 join 由真实 schema 强制要求。
冗长 caveat 防止 overclaiming。
临时状态转移对 recoverability 必要。
```

因此，聚合失配不能通过独立优化每个 part 解决。系统必须治理 parts 之间的关系。

---

## 3. 为什么聚合是原始失配

聚合失配是原始的，因为它有独立修复目标：组合算子 `A` 及其必须保存的全局不变量。

它不能还原为其他原始失配。

### 3.1 不是观测-表征失配

观测-表征失配问决定性变量是否进入表征。

即使所有相关变量都存在，聚合失配仍可发生。

```text
schema、foreign keys 和 column meanings 都存在。
SQL query 的每个 clause 局部合理。
query 仍把 clauses 组合成错误全局语义。
```

修复不是增加缺失变量，而是治理 clauses 如何组合。

### 3.2 不是状态失配

状态失配问系统是否知道所处潜在状态。

即使状态已知，聚合失配仍可发生。

```text
系统正确识别任务是 migration script。
它知道目标版本和 dependency state。
它仍按破坏兼容性的顺序 patch 文件。
```

修复不是状态识别，而是依赖保存型组合。

### 3.3 不是拟合边界失配

拟合边界失配问正确能力是否在正确领域激活。

即使正确能力已激活，聚合失配仍可发生。

```text
系统正确激活 code-review capability。
它识别出好的局部 fixes。
它仍把 fixes merge 成破坏端到端 invariant 的 patch。
```

修复不是只改 router，而是 integration governance。

### 3.4 不是支持失配

支持失配问高价值结构是否可作为候选抵达。

当正确 parts 都可达甚至已生成时，聚合失配仍可发生。

```text
系统生成了报告所需全部 evidence snippets。
它无法把它们组装成 valid argument。
```

修复不是候选扩展，而是 argument-structure governance。

### 3.5 不是规格失配

规格失配问可访问目标是否匹配真实效用。

目标清晰时，聚合失配仍可发生。

```text
目标是 exact execution correctness。
系统知道 SQL 必须返回正确答案。
每个局部 clause 可辩护。
全局 query 因 clauses 交互错误而失败。
```

修复不是澄清 rubric，而是组合验证。

### 3.6 最小对标准

前面各节已经说明，聚合失配与其他五类原始失配相互独立。更强的测试如下：可以在保持其他站点不变的情况下，只改变组合关系来独立测试聚合失配。

```text
Same observation.
Same representation.
Same state.
Same capability.
Same candidate parts.
Same objective.
Different aggregation relation.
Different global utility.
```

这个最小对建立了聚合作为原始失败站点的地位。

---

## 4. 聚合与自回归平庸

自回归生成是聚合的一个特例。每个下一个 token 或 segment 在局部 continuation policy 下被选择，最终输出是这些局部决策的序列级组合。

```text
Y = (t_1, t_2, ..., t_n)
```

局部策略优化：

```text
p(t_k | t_1, ..., t_{k-1}, context)
```

但任务效用依赖：

```text
U(t_1, ..., t_n, S_world)
```

当局部可能的 continuation 不保存全局效用时，就发生自回归平庸。

这不是自回归的普遍缺陷。在许多任务中，局部 continuation 与全局价值高度对齐：

```text
surface polishing
style transfer
genre completion
semantic paraphrase
boilerplate construction
contextual elaboration
```

在这些任务里，局部 likelihood 可以是局部和全局质量的有用代理。

聚合失配出现于任务依赖生成点局部不可见的性质时：

```text
long-range consistency
hidden constraints
future commitments
cross-module interfaces
proof obligations
end-to-end execution
nonlocal reference binding
global optimization
```

因此，自回归平庸应被视为聚合失配的一个子情形，而不是 LLM 失败的全部理论。

### 4.1 完成诱导的可观测性

首次生成时，位置 `k` 的选择受前缀条件限制，即使它的任务价值依赖后续接口、回收、绑定或承诺。完整候选改变了这个信息条件。旧 suffix 不是最优未来，但它是一个具体 witness，能使许多非局部违反变得可观察。

```text
first pass: p_theta(t_k | t_<k, context)

repair:     p_theta(t'_k | complete_candidate, audit_finding, t'_<k, context)
```

这解释了为什么 aggregation audit 即使不能保证全局最优，仍然有价值：它把隐藏协调要求转换成可检查 residual。

### 4.2 从全局合成到可变邻域修复

令 `Y_0` 为完整候选，`N_r(Y_0)` 为半径 `r` 的修复邻域。审计把优化问题从全空间构造转换为一系列条件搜索：

```text
delta_r* = argmax_delta in N_r(Y_0)
           [U_hat(Y_0 + delta) - U_hat(Y_0)]
```

修复半径应受治理，而不是固定：

```text
span
→ function / scene
→ module / chapter
→ architecture / plot plan
→ regeneration from revised control space
```

小邻域保存已经好的结构；当缺陷位于上游、高度耦合或被局部修复反复重新引入时，大邻域允许系统离开初始盆地。这个机制是 tractability transformation 和 basin-escape operator，不是局部搜索达到全局最优的证明。

---

## 5. 局部到全局失败的结构

聚合失配有几种反复出现的结构形式。

### 5.1 非局部依赖失败

某个局部组件依赖另一个遥远、隐式或尚未生成的组件。

```text
y_i is locally plausible
but incompatible with y_j
```

例子：

```text
后文段落与前文假设矛盾。
函数调用假设 caller 没保存的 type contract。
SQL predicate 需要一个已被不同绑定的 join alias。
项目计划把依赖任务排在前置任务之前。
```

修复目标：

```text
dependency graph
cross-reference table
interface contract
nonlocal consistency audit
```

### 5.2 延迟承诺失败

局部决定当下看似无害，但之后约束产物，阻断全局高价值路径。

```text
commitment c_k seems locally acceptable
but makes future high-value paths unreachable
```

例子：

```text
过早选择 schema interpretation。
证据尚未整合就选择 narrative frame。
下游需求未知时 hard-code design decision。
value grounding 未完成就提交 join path。
```

修复目标：

```text
commitment ledger
reversible assumptions
late binding
branch preservation
commitment audit
```

### 5.3 接口漂移

多个局部组件各自满足局部角色，但接口发生漂移。

```text
producer contract ≠ consumer expectation
```

例子：

```text
module 返回 shape 与 caller 预期不同。
summary 抽象掉下游 section 需要的区分。
tool result 被按不同于实际返回 schema 的方式解释。
多 agent 对同一 task label 使用不一致含义。
```

修复目标：

```text
interface schema
input/output contract
binding record
shared glossary
contract test
```

### 5.4 不变量违反

全局不变量在任何单一局部决策中都不可见。

```text
∀i, local check passes
but global invariant fails
```

例子：

```text
安全属性要求所有 endpoints 一致更新。
证明要求每个 case 恰好覆盖一次。
SQL query 必须在 joins 下保存 row cardinality。
计划必须让总资源使用低于全局预算。
```

修复目标：

```text
invariant registry
global validator
coverage matrix
resource ledger
end-to-end check
```

### 5.5 证据到结论的误聚合

证据项各自准确，但合成结论超过证据可支持范围。

```text
Each source supports a local statement.
The conclusion requires a stronger relation not supported by their composition.
```

例子：

```text
研究综合从异质研究中过度泛化。
市场 memo 把弱信号聚合成强方向建议。
法律分析把分离 doctrines 组合成无支撑结论。
safety assessment 把低风险观察聚合成虚假保证。
```

修复目标：

```text
evidence graph
claim support map
scope-of-support annotations
aggregation rule
strength calibration
```

### 5.6 拼贴式一致性失败

迭代修订改善局部缺陷，却留下由不一致层叠成的 patchwork。

```text
revision_1 fixes defect_1
revision_2 fixes defect_2
...
final artifact lacks integrated coherence
```

例子：

```text
长文档积累不兼容 framing changes。
代码补丁逐个修测试，却退化 architecture。
policy document 合并多个 reviewer comments，却不调和 assumptions。
```

修复目标：

```text
integration pass
architecture review
semantic diff
global rewrite plan
versioned rationale ledger
```

### 5.7 多数或集成误聚合

多个候选、投票或 agent 被不保存正确性的规则聚合。

```text
majority preference ≠ true utility
```

例子：

```text
多个 agent 共享同一盲点。
self-consistency samples 重复共同错误假设。
reranking 偏好流畅答案而非结构正确答案。
投票压制稀有但正确候选。
```

修复目标：

```text
diversity audit
correlated-error detection
minority-candidate preservation
adversarial aggregation rule
validator-weighted ensemble
```

---

## 6. 局部价值不是同态

聚合失配可以代数化表达。

令 `⊕` 是 parts 上的组合操作。如果局部价值函数 `v` 能干净组合到全局效用，那么存在稳定聚合函数 `F`：

```text
U(y_1 ⊕ y_2) = F(v(y_1), v(y_2))
```

在许多 LLM 任务中，这种简单同态不存在。整体价值取决于 parts 之间的关系，而不只是每个 part 的价值。

```text
U(y_1 ⊕ y_2) depends on R(y_1, y_2)
```

其中 `R` 可以包括：

```text
consistency
causal dependency
interface compatibility
temporal order
scope containment
logical entailment
resource coupling
semantic binding
execution semantics
```

系统因此需要对 `R` 进行显式治理，而不只是局部改进 `y_i`。

这就是组合治理的形式化直觉：

> 当全局价值依赖 parts 之间的关系时，治理关系，而不只是治理 parts。

---

## 7. 组合治理

**组合治理** 是对中间结构、依赖、约束和组装规则的治理，用来决定局部生成部分能否组合成全局有价值产物。

它有五个核心动作：

```text
1. Externalize the composition structure.
2. Define the interfaces among parts.
3. Register global invariants.
4. Audit local-to-global preservation.
5. Commit only composition-valid artifacts or state transitions.
```

目标不是阻止局部生成，而是把局部生成放进受治理组合体制中。

无治理聚合说：

```text
Generate good parts and combine them.
```

组合治理说：

```text
Define what it means for parts to compose,
then generate, audit, revise, and render under that definition.
```

---

## 8. 组合治理循环

通用循环是：

```text
1. Task decomposition
2. Composition-object construction
3. Local part generation
4. Interface binding
5. Global invariant audit
6. Integration repair
7. Final rendering
8. Regression guard creation
9. State commitment
```

### 8.1 任务分解

系统先识别将要组合的 parts：

```text
sections of a report
clauses of a SQL query
modules of a code patch
steps of a plan
claims in an argument
tool outputs in a workflow
agent-produced subtasks
```

分解不应被视为自动有效。坏分解会隐藏依赖，从而制造聚合失配。

### 8.2 构造组合对象

系统构造显式对象来治理 parts 如何关联。

```text
dependency graph
interface contract
invariant registry
claim-support map
binding table
execution plan
state transition plan
coverage matrix
```

当这些对象具有作用域、证据、强度和撤销条件时，它们就成为受治理知识对象（Governed Knowledge Object / GKO）、受治理执行对象（Governed Execution Object / GExO）或受治理升级对象（Governed Escalation Object / GEsO）。

### 8.3 局部部分生成

模型在局部约束下生成或修订局部 parts。

这是保存局部对齐的地方。LLM 往往擅长生成候选 clauses、summaries、code snippets、design alternatives、edge cases 和 explanations。

### 8.4 接口绑定

每个 part 通过显式接口绑定到其他 artifact 部分。

```text
input/output types
assumed definitions
referenced variables
required upstream facts
downstream consumers
scope of claim
state preconditions
```

### 8.5 全局不变量审计

系统检查组装产物是否保存所需不变量。

```text
consistency
coverage
noncontradiction
execution correctness
semantic equivalence
resource feasibility
state transition validity
```

### 8.6 集成修复

失败不只被定位为坏 part，也被定位为坏关系。

```text
wrong dependency
missing binding
interface mismatch
unsupported inference
order violation
invariant breach
```

每个发现都应产生控制增量。

集成修复还应声明 repair radius。如果同一关系在局部 patch 后再次失败，系统应从 part-level repair 升级到 interface redesign、composition-plan revision，或从受治理控制空间重新生成。在已有结构耦合证据后仍重复同一局部邻域，属于 repair theater。

### 8.7 最终渲染

最终产物从受治理组合对象渲染，而不是简单拼接局部生成。

### 8.8 创建回归护栏

如果发现聚合失败，应创建护栏检测复发。

```text
If this dependency is broken again, fail.
If this invariant is violated again, fail.
If this interface drifts again, fail.
If this claim exceeds support again, fail.
```

### 8.9 状态提交

对长程 agent，只有满足转移契约时，组合有效产物才应进入硬状态。

```text
S + A → O → V → S'
```

---

## 9. 核心治理对象

聚合失配通过让组合显式化的对象来修复。

### 9.1 Composition Plan

Composition Plan 描述 parts 如何组装。

```json
{
  "id": "composition_plan.report_argument_v1",
  "type": "composition_plan",
  "parts": ["claim", "evidence", "counterargument", "conclusion"],
  "composition_rule": "Each major claim must be supported by evidence before being used in the conclusion.",
  "global_invariants": ["no unsupported central claim", "scope of evidence preserved"],
  "revocation_trigger": "A claim appears in the conclusion without support in the evidence map."
}
```

### 9.2 Dependency Graph

Dependency Graph 记录哪些 parts 依赖哪些其他 parts。

```json
{
  "id": "dependency_graph.sql_query_v1",
  "type": "dependency_graph",
  "nodes": ["selected_columns", "tables", "join_path", "filters", "aggregation", "ordering"],
  "edges": [
    {"from": "selected_columns", "to": "tables", "relation": "requires_table"},
    {"from": "filters", "to": "join_path", "relation": "requires_alias_binding"},
    {"from": "aggregation", "to": "selected_columns", "relation": "determines_grouping_validity"}
  ],
  "revocation_trigger": "Execution or semantic audit finds an unbound alias, invalid grouping, or impossible join dependency."
}
```

### 9.3 Interface Contract

Interface Contract 定义一个 part 如何被另一个 part 消费。

```json
{
  "id": "interface_contract.module_api_v1",
  "type": "interface_contract",
  "producer": "data_loader",
  "consumer": "feature_builder",
  "producer_output": "List[Record{id, timestamp, value}]",
  "consumer_expectation": "Records are sorted by timestamp and contain non-null value.",
  "invariants": ["timestamp order preserved", "null values handled before consumption"],
  "revocation_trigger": "Consumer receives unsorted records or null values without explicit handling."
}
```

### 9.4 Invariant Registry

Invariant Registry 存储 artifact 级全局属性。

```json
{
  "id": "invariant_registry.plan_v1",
  "type": "invariant_registry",
  "invariants": [
    {
      "name": "prerequisite_order",
      "assertion": "No task may be scheduled before its prerequisite is complete.",
      "severity": "critical"
    },
    {
      "name": "resource_budget",
      "assertion": "Total planned cost must not exceed the approved budget.",
      "severity": "high"
    }
  ],
  "revocation_trigger": "A required invariant is shown not to apply to the current task class."
}
```

### 9.5 Binding Record

Binding Record 捕获身份、引用、别名和作用域绑定。

```json
{
  "id": "binding_record.schema_v1",
  "type": "binding_record",
  "bindings": [
    {
      "surface_phrase": "customers with late payments",
      "table": "customer",
      "column": "payment_status",
      "value_condition": "payment_status = 'late'"
    }
  ],
  "scope": "current text-to-SQL task",
  "revocation_trigger": "Database inspection shows the value encoding differs from the assumed binding."
}
```

### 9.6 Claim-Support Map

Claim-Support Map 治理 evidence aggregation。

```json
{
  "id": "claim_support_map.research_synthesis_v1",
  "type": "claim_support_map",
  "claims": [
    {
      "claim_id": "C1",
      "claim": "The intervention improves retention in short-term settings.",
      "supporting_evidence": ["E1", "E3"],
      "scope": "short-term retention only",
      "not_supported": ["long-term outcomes", "causal effect in all populations"]
    }
  ],
  "revocation_trigger": "A conclusion uses C1 outside its support scope."
}
```

### 9.7 Integration Ledger

Integration Ledger 记录局部改变及其全局影响。

```json
{
  "id": "integration_ledger.patch_v1",
  "type": "integration_ledger",
  "entries": [
    {
      "change": "Modified parser error handling.",
      "local_reason": "Fixes malformed input failure.",
      "affected_interfaces": ["parser -> validator"],
      "global_checks_required": ["valid input path", "malformed input path", "logging behavior"]
    }
  ],
  "revocation_trigger": "A local change is found to have untracked global effects."
}
```

---

## 10. 聚合失配的审计工程

聚合审计必须检查关系，而不只是 parts。

局部审计问：

```text
Is this part good?
```

组合审计问：

```text
Does this part preserve its required relation to other parts?
Does the whole preserve the global invariant?
```

### 10.1 聚合审计发现 Schema

```json
{
  "id": "finding.aggregation.unique_id",
  "artifact": "the assembled artifact or partial assembly",
  "local_parts": ["y_1", "y_2", "..."],
  "finding": "localized composition failure",
  "evidence": "specific relation, invariant, interface, or dependency violation",
  "aggregation_failure_type": "dependency | interface | invariant | evidence_claim | ordering | binding | integration | ensemble",
  "mismatch_type": "aggregation",
  "repair_target": "composition_plan | dependency_graph | interface_contract | invariant_registry | binding_record | claim_support_map | integration_ledger",
  "control_delta": "change to the governed composition object",
  "regression_guard": "check that fails if the same composition failure recurs",
  "severity": "low | medium | high | critical"
}
```

### 10.2 示例：SQL 聚合发现

```json
{
  "id": "finding.aggregation.sql.join_grouping_001",
  "artifact": "candidate SQL query",
  "finding": "The GROUP BY clause aggregates after a join path that duplicates rows, causing inflated counts.",
  "evidence": "Execution on sample rows shows count doubling after joining order_items before grouping by customer.",
  "aggregation_failure_type": "invariant",
  "mismatch_type": "aggregation",
  "repair_target": "dependency_graph.sql_query_v1",
  "control_delta": "Add invariant: aggregation cardinality must be checked before and after join expansion.",
  "regression_guard": "Run cardinality-preservation check on representative join paths before accepting count queries.",
  "severity": "critical"
}
```

### 10.3 示例：研究综合发现

```json
{
  "id": "finding.aggregation.research.scope_001",
  "artifact": "draft literature synthesis",
  "finding": "The conclusion generalizes from short-term retention studies to long-term learning outcomes without supporting evidence.",
  "evidence": "All cited studies measure outcomes within two weeks; the conclusion claims semester-scale retention.",
  "aggregation_failure_type": "evidence_claim",
  "mismatch_type": "aggregation",
  "repair_target": "claim_support_map.research_synthesis_v1",
  "control_delta": "Restrict claim scope to short-term retention unless long-term evidence is added.",
  "regression_guard": "Every conclusion claim must cite evidence with matching outcome horizon.",
  "severity": "high"
}
```

### 10.4 示例：代码集成发现

```json
{
  "id": "finding.aggregation.code.interface_001",
  "artifact": "candidate code patch",
  "finding": "The parser now returns structured errors, but the validator still expects string errors.",
  "evidence": "Unit tests for parser pass; integration test fails at validator error handling.",
  "aggregation_failure_type": "interface",
  "mismatch_type": "aggregation",
  "repair_target": "interface_contract.parser_validator_v1",
  "control_delta": "Update validator contract or add adapter preserving expected error format.",
  "regression_guard": "Parser-validator integration test must cover malformed input and structured error payloads.",
  "severity": "high"
}
```

---

## 11. 转换模式

聚合失配通过把无治理组合转换为受治理组合来修复。

### 11.1 从序列到图

无治理表述：

```text
Write the final answer step by step.
```

受治理表述：

```text
Construct a dependency graph, then render the answer under the graph.
```

适用情形：

```text
there are nonlocal dependencies
there are prerequisites
there are cross-references
there are shared variables or assumptions
```

### 11.2 从草稿到接口契约

无治理表述：

```text
Write each module or section.
```

受治理表述：

```text
Define the interfaces among modules or sections, then generate under those interfaces.
```

适用情形：

```text
modules consume each other's outputs
sections rely on earlier definitions
agents pass intermediate artifacts
tools return structured data
```

### 11.3 从局部 Rubric 到全局不变量

无治理表述：

```text
Check whether each part is good.
```

受治理表述：

```text
Check whether the assembled artifact preserves global invariants.
```

适用情形：

```text
local correctness does not imply end-to-end correctness
resource constraints are global
semantic equivalence is global
security or safety properties are global
```

### 11.4 从 Merge 到 Reconciliation

无治理表述：

```text
Merge all suggestions.
```

受治理表述：

```text
Detect conflicts, reconcile assumptions, and produce a coherent integration plan.
```

适用情形：

```text
multiple reviewers provide comments
multiple agents produce outputs
multiple retrieval sources disagree
multiple local fixes affect the same invariant
```

### 11.5 从多数投票到错误模型感知聚合

无治理表述：

```text
Take the majority answer.
```

受治理表述：

```text
Estimate correlated errors, preserve minority high-value candidates, and aggregate under validators.
```

适用情形：

```text
samples share the same blind spot
rare correct candidates look unusual
fluency correlates poorly with correctness
validators are stronger than voters
```

### 11.6 从修订循环到集成账本

无治理表述：

```text
Iteratively fix issues.
```

受治理表述：

```text
Record each local fix, its affected interfaces, required global checks, and regression guards.
```

适用情形：

```text
patches accumulate
long documents undergo multiple revisions
agent workflows persist across time
human feedback is incremental and heterogeneous
```

---

## 12. 与其他失配的相互作用

聚合失配经常与其他原始失配相互作用。

### 12.1 观测-表征 × 聚合

如果决定性关系没有被表征，系统无法治理它的组合。

```text
Missing foreign key → wrong join composition.
Missing temporal order → impossible plan ordering.
Missing source scope → unsupported evidence aggregation.
```

修复顺序：

```text
first repair representation of the relation,
then govern composition.
```

### 12.2 状态 × 聚合

正确聚合规则可能取决于潜在状态。

```text
In state h1, evidence should be aggregated conservatively.
In state h2, evidence can support a stronger conclusion.
```

如果状态错，所有 parts 都好也可能组合错。

修复顺序：

```text
state discriminate,
then apply state-conditioned composition rules.
```

### 12.3 拟合边界 × 聚合

系统可能在应激活 integration capability 时激活局部生成能力。

```text
drafting instead of reconciling
summarizing instead of preserving scope
patching instead of checking interfaces
voting instead of detecting correlated error
```

修复目标：

```text
router rule: when multiple local outputs must be combined, activate compositional audit before rendering.
```

### 12.4 支持 × 聚合

正确全局结构可能需要低支持的中间关系。

```text
rare join path
unusual proof structure
non-obvious dependency edge
minority candidate in ensemble
```

支持搜索可能应针对组合对象，而不是最终产物。

### 12.5 规格 × 聚合

如果目标规格不足，系统可能按错误全局标准聚合 parts。

```text
optimizing readability when legal defensibility matters
maximizing coverage when precision matters
combining evidence as if all sources had equal scope
```

规格修复应更新全局不变量和聚合规则，而不只是局部 rubrics。

### 12.6 复合超加性

复合聚合失败可能是超加性的。

```text
A decisive schema relation is omitted from representation.
The system activates template SQL generation instead of schema audit.
The rare correct join path has low support.
The generated clauses are locally plausible.
Execution fails.
```

此时，改进局部 clauses 没有帮助，因为缺失关系、错误 router、低支持和组合失败彼此锁门。

---

## 13. Text-to-SQL 作为聚合失配

Text-to-SQL 是典型聚合任务。

SQL query 是组合产物：

```text
SQL = A(
  selected columns,
  tables,
  aliases,
  join path,
  predicates,
  grouping,
  aggregation,
  ordering,
  limits
)
```

每个 part 都可以局部合理，而 query 全局错误。

### 13.1 局部 Clause 合理性

LLM 可能生成：

```text
reasonable selected columns
reasonable table names
reasonable filter conditions
reasonable aggregation keyword
reasonable order clause
```

但全局 query 可能失败，因为：

```text
the join path duplicates rows
the filter applies before the needed aggregation
the selected column is incompatible with GROUP BY
the value binding belongs to another table
the natural language question requires an anti-join
the query answers a neighboring question
```

### 13.2 组合控制空间

受治理 text-to-SQL 系统不应把 SQL 当作 flat string。它应构造组合对象：

```text
schema subgraph
join dependency graph
column binding table
value binding table
predicate skeleton
aggregation cardinality invariant
execution feedback ledger
```

### 13.3 聚合护栏

可能的护栏：

```text
all selected columns must be bound to selected tables
join path must connect all referenced tables
aggregation cardinality must be checked when counting after joins
GROUP BY must cover non-aggregated selected columns
value predicates must be grounded in actual database values
empty results must trigger predicate overconstraint audit
```

### 13.4 为什么直接生成失败

直接 SQL 生成要求模型隐式组合所有依赖。当 query 简单且局部合理性跟执行语义一致时，这可行。当全局执行语义依赖局部 token likelihood 中不可见的关系时，它会失败。

受治理转换是：

```text
direct SQL string generation
  → controlled schema and join representation
  → governed predicate and aggregation skeleton
  → SQL rendering
  → execution audit
  → composition repair
```

---

## 14. 代码生成与补丁集成

代码生成是另一个典型聚合领域。

代码库是接口、不变量、测试、有状态行为和隐式契约的网络。补丁可能局部正确但全局有害。

### 14.1 局部修复，全局破坏

例子：

```text
函数被优化但破坏 caller 的 timing assumption。
bug 在一条路径修复，但 parallel path 没修。
新增参数但未更新所有 call sites。
类型改变但 serialization logic 没更新。
error-handling patch 改变 exception contract。
```

### 14.2 代码组合对象

有用对象包括：

```text
module dependency graph
API contract
call graph
state invariant registry
test coverage map
migration plan
integration ledger
semantic diff
```

### 14.3 补丁治理循环

```text
1. Identify local defect.
2. Identify affected interfaces.
3. Generate candidate patch.
4. Audit local tests.
5. Audit integration tests.
6. Update interface contracts if needed.
7. Add regression guard.
8. Commit only after transition validity.
```

重点不是用官僚流程替代 coding，而是防止模型把代码当作局部可编辑文本，而真实对象其实是有非局部不变量的可执行系统。

---

## 15. 研究综合与论证组合

研究综合对 LLM 来说局部很容易：模型能摘要论文、抽取 claims、比较 themes、写流畅 transitions。难点是保存 evidence 与 conclusion 的关系。

### 15.1 证据聚合失败

局部摘要可能准确，但最终结论可能夸大证据支持。

常见失败：

```text
scope expansion
time-horizon mismatch
population mismatch
correlation-to-causation drift
methodological heterogeneity ignored
minority evidence smoothed away
negative findings underweighted
```

### 15.2 受治理论证对象

有用对象包括：

```text
evidence table
claim-support map
scope annotations
methodological compatibility matrix
counterevidence ledger
strength-of-claim rubric
conclusion contract
```

### 15.3 Claim-Scope Guard

一个简单但强力的护栏：

```text
Every conclusion must have a support scope no broader than the narrowest required evidence scope.
```

如果结论超过 evidence scope，系统必须：

```text
weaken the conclusion
add supporting evidence
mark the claim as speculative
split the claim by scope
```

这就是聚合治理：治理 evidence 如何组合成 claims。

---

## 16. 多 Agent 与工具型工作流

聚合失配也出现在多 agent 系统和工具型工作流中。

常见假设是：

```text
If each agent or tool completes its subtask, the overall workflow succeeds.
```

这经常是假的。

### 16.1 多 Agent 聚合失败

例子：

```text
agents 使用不一致定义。
一个 agent 输出省略另一个 agent 需要的信息。
planner 假设 tool succeeded，但其实只是 partial success。
reviewer critique 局部质量而非 integration validity。
coordinator merge outputs 却不解决 conflicts。
```

Context-conditioned audit branch 会产生特殊聚合义务。不同 context 与匹配的 decomposition prompt 可能暴露互补证据或不同结构盆地，但 role name 不同并不使输出自动独立。工作流应在汇总前保留 context provenance、假设、排除信息和唯一证据。携带唯一反例的少数 branch 不能被多数投票抹掉。

### 16.2 工作流组合对象

有用对象包括：

```text
shared task model
role-interface contract
handoff schema
state transition contract
conflict ledger
dependency graph
completion criteria
integration audit
```

### 16.3 SGAR 连接

在状态治理智能体范式（State-Governed Agent Regime / SGAR）中，长程工作流的聚合有效性必须绑定硬状态。

一组局部完成不应自动提交项目进展。

```text
local completions
  → integration audit
  → verifier
  → committed state transition
```

系统可以叙述子任务完成，但只有有效状态转移才能提交集成结果。

---

## 17. 什么时候局部改进足够

组合治理并不总是必要。

以下情况局部改进通常足够：

```text
the artifact has weak nonlocal dependencies
the objective is local and visible
parts are independent
the aggregation operator is simple and reliable
there is a complete external validator
global value is approximately additive over parts
```

例子：

```text
style polishing a short paragraph
format conversion
simple extraction into a fixed schema
minor grammar correction
straightforward paraphrase
boilerplate generation
```

以下情况组合治理更重要：

```text
parts interact strongly
global invariants matter
interfaces can drift
local fixes can cause regressions
evidence must support claims
execution semantics differ from surface plausibility
state persists across time
```

有用决策规则：

```text
Govern composition when expected loss from local-to-global failure exceeds the cost of making composition explicit.
```

对候选条件化修复而言，只有当 accepted delta 具有正的外部 grounded utility，且回归护栏保存此前已满足关系时，局部改进才足够。当 verifier score 上升但外部效用停滞、同一缺陷反复出现，或必要 delta 跨越大量接口时，系统应扩大邻域，或从修订后的组合对象重启。

开放实验应在多个修复半径上比较等预算 fresh generation 与 candidate-conditioned repair。测量定位准确率、completion-conditioned lift、回归、radius escalation、盆地逃逸，以及 verifier score 与 human/hidden-gold utility 的分叉。在增益通过 held-out artifact 和独立评价前，这一主张保持条件性。

---

## 18. 组合治理的失败模式

组合治理本身也会失败。理论应显式命名这些失败模式。

### 18.1 过度分解

系统把任务分解成破坏问题自然结构的 parts。

症状：

```text
The parts are easy to generate but hard or impossible to recombine.
```

修复：

```text
revise the decomposition around actual dependencies, not surface sections.
```

### 18.2 虚假模块性

系统把耦合组件当作独立组件。

症状：

```text
Each module passes local checks, but integration fails repeatedly.
```

修复：

```text
add dependency edges and interface contracts.
```

### 18.3 接口钙化

系统过早锁定接口，阻止更好的全局设计。

症状：

```text
downstream artifacts contort themselves around a bad early interface.
```

修复：

```text
make interfaces provisional until integration evidence supports them.
```

### 18.4 不变量剧场

系统列出全局不变量，但不执行。

症状：

```text
invariants appear in the prompt or document but do not fail any artifact.
```

修复：

```text
convert invariants into executable or auditable guards.
```

### 18.5 集成振荡

修复一个关系会破坏另一个关系，导致不稳定修订循环。

症状：

```text
revision alternates between satisfying invariant A and invariant B.
```

修复：

```text
create a conflict set and solve the constraints jointly.
```

### 18.6 耦合爆炸

系统创建太多依赖以至不可管理。

症状：

```text
the dependency graph becomes larger than the task itself.
```

修复：

```text
abstract dependencies into layers and prioritize high-severity invariants.
```

### 18.7 验证器近视

全局验证器只检查不完整的全局性质。

症状：

```text
artifacts pass the validator while still failing the true task.
```

修复：

```text
audit the validator against representative composition failures.
```

---

## 19. 实用清单

最终渲染前，询问：

```text
1. What are the parts being composed?
2. What relation among parts determines global value?
3. What dependencies are nonlocal?
4. What interfaces must be preserved?
5. What global invariants must hold?
6. What local improvements could break global value?
7. What commitments should remain reversible?
8. What evidence supports each global claim?
9. What validator checks the assembled artifact?
10. What regression guard prevents recurrence of a composition failure?
```

对 LLM 系统，至少实现其中一种：

```text
dependency graph
interface contract
invariant registry
binding record
claim-support map
integration ledger
composition audit
end-to-end validator
```

对高价值任务，应实现多个。

---

## 20. 与既有形式传统的关系

聚合失配与若干形式传统相呼应，但 LLM 场景有独特特征。

### 20.1 组合性

经典组合性研究整体意义或行为如何与 parts 的意义或行为相关。聚合失配是这种保存关系在 LLM 介导任务产物中的失败。

LLM 特有问题是，parts 可能在局部语言合理性下生成，而不是在显式组合语义下生成。

### 20.2 模块化验证

模块化验证用契约和不变量逐部件推理系统。组合治理借用了同样精神：局部组件需要 assumptions 和 guarantees。

LLM 特有问题是，assumptions 往往是 tacit、generated、revised，或通过审计发现的。

### 20.3 Assume-Guarantee Reasoning

Assume-guarantee reasoning 通过给 components 分配 assumptions 和 guarantees 来证明系统性质。

受治理 LLM 系统中也出现类似结构：

```text
this section assumes X and guarantees Y
this module consumes Y and guarantees Z
this plan step requires state S and produces state S'
```

### 20.4 类型系统与接口契约

类型系统通过显式接口防止某些组合错误。LLM 系统通常缺少面向自然语言 artifact、claims、tool outputs 和 state transitions 的显式类型。组合治理可视为在推断时添加任务特定类型和契约。

### 20.5 约束满足

许多聚合失败是约束满足失败。新颖之处在于，约束可能部分隐式、自然语言、专家定义，或随审计发现演化。

### 20.6 动态规划与结构搜索

一些任务在被分解为具有有效递推关系的子问题后更容易。但 LLM 分解通常是启发式的，未必保存 optimal substructure。组合治理问的是：分解是否真的支持有效重组。

---

## 21. 形式主张与撤销条件

理论应暴露自身 claim 以便审计。

### 21.1 原始地位主张

```json
{
  "id": "gko.aggregation_mismatch.primitive_status",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as pipelines that compose local parts into global artifacts.",
  "assertion": "Aggregation mismatch is a primitive mismatch because local value may fail to preserve global utility under the composition operator, even when observation, state, routing, support, and specification are held fixed.",
  "support_scope": "Tasks with multi-part artifacts, nonlocal dependencies, interfaces, global invariants, or evidence-to-claim relations.",
  "revocation_trigger": "Show that all aggregation failures can be reduced to another primitive mismatch without losing the distinct repair target of governing composition relations.",
  "not_supported_claims": "Does not claim every task requires explicit compositional governance. Does not claim local generation is generally bad."
}
```

### 21.2 组合治理有效性主张

```json
{
  "id": "gko.compositional_governance.effectiveness_claim",
  "type": "method_claim",
  "condition": "Task value depends on relations among generated parts.",
  "assertion": "Externalizing and auditing composition objects can reduce aggregation mismatch by making nonlocal dependencies, interfaces, and invariants available to the system.",
  "support_scope": "High-value tasks with meaningful local-to-global failure risk.",
  "revocation_trigger": "If explicit composition objects repeatedly add cost without improving detection, repair, or prevention of local-to-global failures, governance should be reduced or redesigned.",
  "not_supported_claims": "Does not imply heavy decomposition is always beneficial. Does not replace task-specific verification."
}
```

### 21.3 完整候选条件化修复主张

```json
{
  "id": "gko.aggregation_mismatch.completion_conditioned_repair",
  "type": "method_claim",
  "condition": "A complete candidate exposes nonlocal relation violations and the system can choose and regression-test a repair neighborhood.",
  "assertion": "Candidate-conditioned audit can reduce aggregation mismatch by converting whole-artifact synthesis into a sequence of localized or variable-neighborhood repairs.",
  "support_scope": "Code, stories, arguments, plans, and other artifacts whose completed structure reveals interfaces, dependencies, payoffs, or invariants.",
  "revocation_trigger": "Equal-budget held-out experiments show no external-utility lift over fresh generation, or repeated repair increases regression and proxy overfitting.",
  "not_supported_claims": "Does not guarantee a global optimum. Does not imply the initial candidate is in a useful basin. Does not authorize a learned verifier to override hard checks."
}
```

---

## 22. 结论

聚合失配是局部价值无法组合成全局任务价值的失败。它解释了为什么流畅草稿、plausible clauses、合理模块、准确摘要、有用工具输出或成功子任务仍然可能产生全局错误产物。

这种失配是原始的，因为它指向价值保存管线中的独立站点：组合算子。即使系统有正确信息、知道状态、激活正确能力、抵达正确 parts 并理解目标，它仍可能发生。失败在于 parts 如何被组装。

建设性响应是组合治理。显式化依赖。定义接口。登记不变量。追踪绑定。把 claims 映射到 support。审计关系，而不只是审计 parts。把集成失败转化为控制增量和回归护栏。只提交保存相关全局结构的 artifact 和状态转移。

对 LLM 系统的更大教训很简单：

> 不要假设局部好的生成会形成全局好的系统。治理组合关系。

---

## Appendix A: 紧凑术语表

| 术语 | 定义 |
|---|---|
| 聚合失配 | 局部价值在聚合算子下未能组合成全局效用的失败。 |
| 组合算子 | 把 parts 组装成最终产物或状态转移的流程。 |
| 局部价值 | part 级质量信号，如 plausible、correct、fluent 或局部有用。 |
| 全局效用 | 组装产物的任务级价值。 |
| 自回归平庸 | 序列 token 或 segment 生成中的聚合失配。 |
| 组合治理 | 对依赖、接口、不变量、绑定和组装规则的治理。 |
| 依赖图 | 记录 parts 如何相互依赖的对象。 |
| 接口契约 | 指定 producer 与 consumer parts 之间 assumptions 和 guarantees 的对象。 |
| 不变量登记表 | 记录 artifact 级必须成立的全局性质的对象。 |
| 绑定记录 | 记录身份、引用、别名和作用域绑定的对象。 |
| Claim-support map | 把 claims 连接到 evidence 与支持范围的对象。 |
| Integration ledger | 记录局部改变及其全局影响的对象。 |
| 组合审计 | 检查 parts 关系和全局不变量的审计。 |
| 不变量剧场 | 列出 invariants 但没有让它们可执行或可审计。 |
| 虚假模块性 | 把耦合组件当作独立组件。 |

---

## Appendix B: 最小组合治理模板

```json
{
  "task": "Describe the task or artifact being composed.",
  "parts": ["List the local components."],
  "composition_operator": "Describe how parts become the final artifact.",
  "dependencies": [
    {
      "from": "part_a",
      "to": "part_b",
      "relation": "requires | constrains | references | consumes | supports"
    }
  ],
  "interfaces": [
    {
      "producer": "part_a",
      "consumer": "part_b",
      "assumption": "What the consumer assumes.",
      "guarantee": "What the producer guarantees."
    }
  ],
  "global_invariants": [
    {
      "name": "invariant_name",
      "assertion": "What must hold globally.",
      "severity": "low | medium | high | critical"
    }
  ],
  "local_generation_rules": ["Rules for generating parts."],
  "composition_audits": ["Checks over relations and invariants."],
  "regression_guards": ["Guards against known composition failures."],
  "revocation_triggers": ["When to revise the composition structure."]
}
```

---

## Appendix C: 一页操作摘要

聚合失配问：

```text
Do good parts make a good whole?
```

如果答案不是可靠的 yes，就使用组合治理。

最小流程：

```text
1. Identify parts.
2. Identify dependencies.
3. Define interfaces.
4. Register global invariants.
5. Generate local parts.
6. Bind references and assumptions.
7. Audit the assembled whole.
8. Localize relation failures.
9. Write control deltas.
10. Add regression guards.
```

最重要警告：

```text
A local critique loop is not a global composition guarantee.
```

最重要设计原则：

```text
When value depends on relations among parts, govern the relations.
```
