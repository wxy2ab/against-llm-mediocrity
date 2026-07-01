# LLM 系统中的支持失配与控制空间搜索

**可达性、候选支持与搜索治理**  
**工作稿 v0.1**  

---

## 如何阅读本文

这是一篇技术工作稿。它的核心论点是：许多高价值 LLM（Large Language Model，大语言模型）系统之所以失败，是因为任务高价值所需的结构在已部署搜索流程下根本不可达——它们没有被采样、没有被保存、没有被成熟、也没有被识别。

本文把这种失败命名为**支持失配**，将它与其他原始失配类型加以对比，并围绕**控制空间搜索**发展出一套治理方法。

想快速抓住核心思想，请读摘要和第 1 节（引言）。想看形式化定义，请读第 2–4 节。想了解可落地的机制——治理循环、治理对象以及若干领域实例——请读第 8–13 节。附录则汇总了术语表、诊断清单和可直接套用的模板。

**缩写。** 以下缩写在全文（包括代码块和伪代码块中）反复出现，这里统一定义一次以备查阅：

- **LLM** —— Large Language Model，大语言模型。
- **GKO** —— 受治理知识对象（Governed Knowledge Object）：写回受治理系统、带作用域且可撤销的知识产物。
- **GEsO** —— 受治理升级对象（Governed Escalation Object）：把某个案例路由去升级处理的受治理记录。
- **SGAR** —— 状态治理智能体范式（State-Governed Agent Regime）：面向长程 agent 的硬状态运行时治理层。
- **RLHF / DPO** —— 基于人类反馈的强化学习（RLHF）／直接偏好优化（DPO），即两类学习组件的训练方法。

**目录。**

- [1. 引言](#1-引言)
- [2. 价值保存管线中的支持](#2-价值保存管线中的支持)
- [3. 支持失配不是什么](#3-支持失配不是什么)
- [4. 支持失配的子类型](#4-支持失配的子类型)
- [5. 为什么更多采样经常失败](#5-为什么更多采样经常失败)
- [6. 控制空间搜索](#6-控制空间搜索)
- [7. 支持提升](#7-支持提升)
- [8. 支持治理循环](#8-支持治理循环)
- [9. 支持专属治理对象](#9-支持专属治理对象)
- [10. 支持审计](#10-支持审计)
- [11. Text-to-SQL 中的支持失配](#11-text-to-sql-中的支持失配)
- [12. 代码合成中的支持失配](#12-代码合成中的支持失配)
- [13. 研究与分析中的支持失配](#13-研究与分析中的支持失配)
- [14. 搜索预算作为受治理资源](#14-搜索预算作为受治理资源)
- [15. 反模式](#15-反模式)
- [16. 与知识治理、审计工程和 SGAR 的集成](#16-与知识治理审计工程和-sgar-的集成)
- [17. 最小实现模式](#17-最小实现模式)
- [18. 什么时候不需要支持治理](#18-什么时候不需要支持治理)
- [19. 支持失配的自审计](#19-支持失配的自审计)
- [20. 结论](#20-结论)

---

## 摘要

高价值 LLM 系统经常失败，并不是因为正确答案在逻辑上不可能，也不是因为模型完全缺少相关局部能力，而是因为任务高价值所需的结构，在已部署推断流程下获得的有效支持太少。它们没有被采样、没有被保存、没有被展开、没有被识别，或在可用搜索预算下没有被继续推进。本文把 **支持失配** 展开为 LLM 系统价值保存结构理论中的六类原始失配之一。

支持失配是可达性失败：高价值结构位于系统候选空间中的低概率、低覆盖、低识别或早期剪枝区域。

它不同于以下失配类型：

- **观测-表征失配**——决定性变量没有进入系统表征。
- **拟合边界失配**——正确能力没有激活。
- **聚合失配**——局部好组件无法组合成全局价值。
- **规格失配**——评价器优化了错误代理目标。

在支持失配中，高价值结构原则上可表达且有价值，但系统的策略、搜索算子、先验或预算使它不太可能作为活候选出现。

中心干预是 **控制空间搜索**。受治理系统不是反复采样最终输出，而是在更接近任务价值因果决定因素的中间结构上搜索：schema、join path、依赖图、状态假设、约束、证明义务、工具计划、不变量集合、候选机制或修复增量。

随后由 renderer 把这些受治理控制对象映射为最终产物。这种转换可以通过更常见、可检查、可组合的中间对象，让稀有最终输出变得可达，从而提高有效支持。

本文形式化定义支持失配，区分其子类型，解释为什么朴素采样和 self-consistency 在共享支持盲点下常常失败。本文还提出支持修复的治理架构：支持诊断、控制轴构造、候选扩展、覆盖核算、反剪枝、验证器耦合和支持增量。

本文引入 Support Map、Search Warrant、Candidate Generation Contract、Coverage Ledger、Support Regression Guard 等支持专属对象。放在更大的统一理论中，支持治理是候选空间层面对通道治理、能力路由治理、审计工程和硬状态运行时治理的对应物。

### 与 Diagnostic–Mechanism Bridge 的关系

本文使用支持失配作为一种价值保存诊断。当失败进入修复阶段时，Diagnostic–Mechanism Bridge 会把这一诊断映射到八轴机制目标与修复层：

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

### 机制层映射

支持失配主要映射到 `capability_support` 与 `search_execution`，某些情况下还会次级映射到 `capability_routing`。

```text
missing candidate structure under the active policy
  → repair_target = capability_support

candidate exists but search, pruning, or budget fails to preserve it
  → repair_target = search_execution
```

从机制角度看，支持失配关心的是 `π_θ` 与 `D` 下的可达性不足，而不是观测缺失或目标错误。Agent 层修复依赖控制空间搜索、反剪枝规则和支持治理对象；反复出现的学习组件失败则可以提升到机制驱动训练。

---

## 1. 引言

LLM 系统常通过要求更多候选、提高 temperature、多次采样、提示 alternative、使用 self-consistency、加入 critique 或迭代 refinement 来改进。当目标答案在系统候选分布下可达，并且系统在产出后能识别它时，这些方法有用。但在许多高价值任务中，决定性结构的有效支持很弱。更多采样只产生同一个盆地里的更多变体。更多 critique 修复表面缺陷，却保留同一个隐藏盲点。更多 refinement 会润色本该被替换的候选。更多 self-consistency 会放大主导但错误的结构。

这就是 **支持失配**。

支持失配发生在高价值结构在已部署策略、搜索算子、表征、路由状态和预算下不可充分到达时。系统可能理解任务的许多局部片段，prompt 可能包含相关信息，目标可能足够清楚，模型甚至可能拥有所需能力。但正确全局结构仍然不太可能进入活跃候选集。

支持失配是 LLM 系统陷入平庸的核心原因之一。平庸输出不一定低 effort。它们可能流畅、认真推理、多步骤并经过修订。缺陷在于，它们来自错误支持区域：可达、合理、容易局部改进，但任务高价值区域仍然探索不足。

建设性响应不是简单“多采样”，而是问：**系统正在搜索什么空间？** 如果系统直接搜索最终文本，高价值结构可能只是输出分布中的薄而低概率子集。但如果系统搜索决定最终产物的控制对象，同一高价值区域可能变得更可达。稀有 SQL query 可以通过常见的 join-path 枚举抵达。稀有代码补丁可以通过显式不变量和失败测试抵达。稀有研究洞见可以通过机制分解和矛盾映射抵达。稀有计划可以通过状态条件分支抵达，而不是直接 proposal。

本文把支持失配作为世界到输出管线中的原始结构失败站点：

```text
S_world
  → observation
  → representation
  → capability routing
  → candidate support
  → aggregation
  → evaluation
```

支持失配位于 **候选支持** 站点。它问：

```text
高价值结构是否在可用预算下获得足够有效概率质量、搜索覆盖和识别机会，从而成为活候选？
```

这个问题不同于系统是否观测了正确变量、推断了正确状态、路由了正确能力、正确组合局部片段或优化正确目标。那些失败会与支持相互作用，但不等同于支持。

---

## 2. 价值保存管线中的支持

令系统操作表征为 `Z`，能力路由函数产生已激活策略集合 `C`：

```text
C = ρ(Z)
```

给定 `Z`、`C`、模型策略 `pθ`、搜索算子 `S_B` 和预算 `B`，系统诱导出可达候选集：

```text
K_B = S_B(pθ, Z, C, B)
```

令 `Y` 是输出空间，`U` 是真实任务效用。任务阈值 `τ` 下的高价值区域为：

```text
Y*τ = { y ∈ Y : U(y) ≥ τ }
```

当以下量过低时，存在支持失配：

```text
Reach_B(Y*τ | Z, C, pθ, S_B)
```

其中 `Reach_B` 可以包括生成概率、通过剪枝存活概率、被识别概率、被传递给聚合的概率，以及在评价器下被选择的概率。

一个简单支持系数可以写成：

```text
σ_B(Y*τ) = P[ K_B ∩ Y*τ ≠ ∅ ]
```

即预算化搜索流程至少产生一个高价值区域活候选的概率。

更强的有效支持系数包括识别和保留：

```text
σ_eff(Y*τ) =
  P[ a candidate y ∈ Y*τ is generated,
     preserved,
     recognized as promising,
     and made available for final selection ]
```

当高价值候选原则上可能存在，但 `σ_eff(Y*τ)` 很低时，就发生支持失配。

这个定义重要，因为支持不只是模型发出某个字符串的原始概率。它是以下因素的合成结果：

```text
policy probability
search operator
candidate representation
pruning rule
diversity mechanism
intermediate evaluator
tool access
routing state
budget
recognition process
selection policy
```

因此，即使基础模型生成答案的概率非零，系统仍可能发生支持失配。非零支持不够。高价值结构必须在真实部署体制下获得足够有效支持。

---

## 3. 支持失配不是什么

支持失配最容易通过与相邻失配区分来理解。

### 3.1 不是观测-表征失配

观测-表征失配发生在决定性变量从未进入操作表征 `Z`。

支持失配假设高价值结构至少可以从表征中表达。问题不是变量缺席，而是系统搜索流程不太可能实例化正确使用该变量的结构。

```text
Observation-representation failure:
  The database schema omits a relevant foreign key from the prompt.

Support failure:
  The foreign key is present, but the correct three-table join path is rarely generated.
```

### 3.2 不是状态失配

状态失配发生在系统无法识别所处潜在状态。

即便状态已知，支持失配仍可能发生。系统知道任务体制，却仍无法生成该体制所需的稀有结构。

```text
State failure:
  The system cannot tell whether the user wants historical analysis or a forward-looking forecast.

Support failure:
  The system correctly identifies a forward-looking forecast task,
  but never generates the low-probability causal scenario that matters.
```

### 3.3 不是拟合边界失配

拟合边界失配发生在能力在真实领域之外被激活，或在真实领域内被抑制。

支持失配假设相关能力可能已激活，但它产生的搜索空间仍然低覆盖高价值结构。

```text
Fitting-boundary failure:
  The model fails to activate schema-audit behavior.

Support failure:
  Schema-audit behavior is active,
  but the candidate generator does not enumerate the rare join path.
```

### 3.4 不是聚合失配

聚合失配发生在局部好片段不能组合成全局价值。

支持失配可能发生在聚合之前：全局正确候选结构从未出现。聚合失配发生在候选部分可用但组合错误之后。

```text
Support failure:
  The correct proof strategy is never proposed.

Aggregation failure:
  The correct lemmas are proposed,
  but their dependencies are ordered or combined incorrectly.
```

### 3.5 不是规格失配

规格失配发生在可访问评价器 `Ũ` 偏离真实效用 `U`。

即使规格正确，支持失配也可能发生。系统知道什么是好，却到不了满足它的候选。

```text
Specification failure:
  The rubric rewards concise answers when the true task requires exhaustive coverage.

Support failure:
  The rubric correctly demands exhaustive coverage,
  but the system never generates the rare edge case.
```

---

## 4. 支持失配的子类型

支持失配不是单一表面现象。它有若干结构上不同的子类型。

### 4.1 策略支持失配

基础模型或 prompt 后策略给高价值结构分配了低概率：

```text
pθ(y* | Z, C) is low
```

当答案需要不寻常表述、稀有领域模式、非标准分解、反直觉机制、长尾 schema 关系或低频行动序列时，这很常见。

修复目标：

```text
change the policy context, introduce control objects, or use guided generation.
```

### 4.2 搜索算子失配

高价值结构有非平凡模型概率，但搜索算子没有探索正确轴线。

失败例子：

```text
beam search collapses onto similar candidates
temperature sampling produces surface diversity but not structural diversity
self-consistency samples many variants of the same assumption
critique loops repair style while preserving the same plan
```

修复目标：

```text
change the search operator or search space.
```

### 4.3 预算失配

高价值区域是可达的，但不在当前预算下可达。

这不总能通过增加预算解决。如果搜索分布形状很差，更多预算可能产生大量近重复。预算修复通常需要塑形支持。

修复目标：

```text
allocate budget by control axis, not by undifferentiated candidate count.
```

### 4.4 剪枝失配

高价值候选或部分候选已生成，但在发展前被消除。

常见原因：

```text
early evaluator favors surface plausibility
beam search drops low-probability partials
intermediate critique marks unfamiliar structure as risky
tool errors are interpreted as terminal rather than diagnostic
```

修复目标：

```text
anti-pruning rules, delayed evaluation, protected minority beams, or evidence-preserving ledgers.
```

### 4.5 识别支持失配

高价值候选出现了，但没有被识别为高价值。

这一子类型接近规格失配，但不相同。标准原则上可能正确，但系统识别机制缺少识别该候选的局部判别器。

修复目标：

```text
candidate-specific validators, diagnostic tests, contrastive comparisons, or expert rubric expansion.
```

### 4.6 展开失配

系统生成了有希望的部分结构，却缺少把它展开成完整候选的算子。

```text
A plausible mechanism is proposed,
but the system never derives its implications,
never turns it into a testable plan,
and never maps it to the final artifact.
```

修复目标：

```text
expansion operators, decomposition contracts, continuation scaffolds, and partial-candidate maturation.
```

### 4.7 迁移支持失配

高价值结构存在于某个表征或模态中，但没有迁移到控制最终输出的候选空间。

```text
A table inspection reveals a useful relation,
but the SQL generator does not receive it as a constraint.
```

修复目标：

```text
cross-object propagation, GKO injection, state commitment, rendering contracts.
```

---

## 5. 为什么更多采样经常失败

支持失配的常见响应是多采样。这只在特定条件下有用。

令 `q` 表示单个样本落入 `Y*τ` 的概率。独立采样 `n` 次得到：

```text
P(hit) = 1 - (1 - q)^n
```

如果 `q` 只是中等偏低，增加 `n` 有帮助。但在许多 LLM 系统中，`q` 不是正确变量。样本不是从任务空间中独立抽取的结构样本。它们是来自同一 prompt、同一表征、同一路由状态、同一已学先验、同一隐藏假设，且经常受同一评价器影响的相关 continuation。

有效命中率更接近：

```text
P(hit structural basin) × P(hit high-value variant inside basin)
```

如果系统反复从错误结构盆地采样，增加 `n` 主要只会得到表面变化。

### 5.1 伪多样性

伪多样性指候选在词汇、风格或小细节上不同，却共享同一个结构盲点。

```text
十个摘要都省略同一个决定性 caveat。
十个 SQL query alias 不同，但 join path 一样错。
十个计划顺序不同，却假设同一个错误状态。
十个 critique 指出措辞问题，却漏掉同一个 invariant。
```

伪多样性危险，因为它制造探索的外观。

### 5.2 共享盲点下的 Self-Consistency

当独立推理路径更多收敛到正确答案而不是错误答案时，self-consistency 能提升可靠性。但在支持失配下，多条路径可能共享同一缺失结构。共识会放大支持偏差。

Self-consistency 失败于：

```text
the dominant candidate basin is wrong
the correct basin is low-support
the verifier cannot distinguish the basins
the samples are structurally correlated
```

### 5.3 没有支持扩展的 Critique

Critique 可以改进已接近正确区域的候选。但如果正确结构缺席，critique 常常只在错误盆地内局部修补。

Critique loop 因此应问：

```text
Is this candidate wrong because of a local defect,
or because the candidate family itself is unsupported by the task?
```

如果是后者，修复不是 revision，而是支持扩展。

---

## 6. 控制空间搜索

支持失配常通过改变搜索空间修复。

直接输出空间搜索问：

```text
Which final answer should we generate?
```

控制空间搜索问：

```text
Which intermediate control objects determine the final answer,
and can we search those objects more reliably than final text?
```

令 `Ω` 是控制空间，`R` 是 renderer：

```text
R: Ω → Y
```

目标是找到 `ω* ∈ Ω`，使：

```text
U(R(ω*)) ≥ τ
```

当以下不等式成立时，支持转换成功：

```text
Reach_B(Ω*τ) > Reach_B(Y*τ)
```

其中：

```text
Ω*τ = { ω ∈ Ω : U(R(ω)) ≥ τ }
```

高价值最终输出可能稀有，但决定它的控制对象可能更容易生成、检查、枚举或验证。

| 任务 | 最终输出空间 | 控制空间 |
|---|---|---|
| Text-to-SQL | SQL string | schema subgraph, join path, column binding, predicate skeleton |
| Code synthesis | code patch | failing test, invariant, API contract, dependency graph |
| Research writing | final argument | claim graph, objection map, mechanism chain |
| Planning | full plan | state hypotheses, action preconditions, resource constraints |
| Legal analysis | memo | issue tree, authority map, fact-rule bindings |
| Data analysis | final conclusion | variable dictionary, causal graph, model assumption ledger |
| Agent workflow | final completion | state transition contract, verifier outputs, defect ledger |

控制空间搜索不只是分解，而是在保存任务价值的结构上搜索。

---

## 7. 支持提升

中心设计模式是 **支持提升**。

支持提升转换把低支持最终输出目标映射为更高支持的控制空间目标。

```text
Low-support Y*
  ← rendered from
Higher-support Ω*
```

当控制对象具有以下任一性质时，转换有用：

```text
easier to enumerate
easier to verify
easier to perturb
easier to compose
easier to compare
easier to store
easier to revoke
more likely under the model's local abilities
```

### 7.1 示例：SQL 之前先找 Join Path

正确 SQL query 在直接生成下可能低支持，因为模型必须同时选择表、列、join、谓词、分组、排序和语法。

但 join path 可以分开搜索：

```text
question → candidate tables → join graph → join paths → SQL skeleton → SQL
```

正确最终 SQL 可能稀有；正确 join path 可能更容易枚举和审计。

### 7.2 示例：代码之前先找 Invariant

正确代码补丁可能低支持，因为许多编辑都看似合理。但 bug 违反的不变量可能更容易陈述：

```text
bug report → failing behavior → invariant → repair obligation → patch
```

一旦 invariant 被治理，有用补丁的支持就上升。

### 7.3 示例：论证之前先找机制

高质量分析论证作为直接 essay 可能稀有。但机制链可能更容易生成：

```text
claim → mechanism → boundary condition → counterexample → refined claim
```

最终论证变成受治理机制结构的渲染。

---

## 8. 支持治理循环

支持修复应当受治理，而不是临场即兴处理。

基本支持治理循环是：

```text
1. Diagnose support failure.
2. Identify the missing high-value structure type.
3. Construct a control axis where that structure is easier to search.
4. Generate candidates across the control axis.
5. Track coverage and diversity structurally, not stylistically.
6. Protect promising low-probability candidates from premature pruning.
7. Use verifiers or audits to recognize value.
8. Convert successful structures into GKOs, GExOs, GEsOs, or state records.
9. Add support regression guards.
10. Update future routing and search policies.
```

### 8.1 第一步：诊断支持失败

支持诊断问：

```text
Did the system fail because the right candidate family never appeared?
Did it appear but get pruned?
Did it appear but not mature?
Did it appear but fail recognition?
Did search explore surface variants instead of structural alternatives?
```

### 8.2 第二步：识别缺失结构类型

缺失结构可能是：

```text
join path
state hypothesis
causal mechanism
edge case
counterexample
tool plan
proof strategy
API invariant
column binding
value normalization rule
risk scenario
constraint set
exception class
```

### 8.3 第三步：构造控制轴

控制轴是可以沿其生成有意义结构替代项的维度。

```text
tables involved
join depth
predicate operator
state regime
risk mode
failure family
mechanism class
data source
user intent
tool sequence
invariant type
```

重点是围绕任务相关结构多样化，而不是围绕措辞多样化。

### 8.4 第四步：候选扩展

候选扩展应绑定到控制轴：

```text
generate one candidate per state hypothesis
generate join paths up to depth k
generate counterexamples by failure family
generate patches by invariant class
generate plans by resource regime
```

### 8.5 第五步：覆盖核算

系统应跟踪哪些区域搜索过、哪些没有。

覆盖核算可以近似，但必须显式：

```text
covered axes
uncovered axes
protected candidates
discarded candidates and reasons
candidate lineage
verification status
remaining uncertainty
```

### 8.6 第六步：反剪枝

低支持高价值候选通常很脆弱。它们初看可能不熟悉、不完整或不够流畅。反剪枝规则把候选保存到足以被正确评价。

```text
do not prune a candidate solely for unfamiliarity
do not prune a partial join path before schema verification
do not prune a mechanism before deriving implications
do not prune a failed execution if the failure is diagnostic
```

### 8.7 第七步：识别与验证

只有支持扩展而没有识别，会制造噪声。系统需要判别器和验证器。

```text
execution tests
schema checks
constraint satisfaction
counterexample search
semantic comparison
state discriminators
human review
formal validators
unit tests
rubric-specific audits
```

### 8.8 第八步：写回

成功的支持修复不应在一次运行后消失。它应更新受治理控制空间。

```text
add a GKO for a join-path constraint
add a router rule for low-support hypothesis generation
add a support map to the project state
add a regression guard for a missed edge case
add a defect ledger entry for pseudo-diversity
```

---

## 9. 支持专属治理对象

支持失配需要表示可达性、覆盖和候选空间义务的对象。

### 9.1 Support Map

Support Map 记录高价值结构预期位于候选空间何处，以及哪些区域已被搜索。

```json
{
  "id": "support_map.unique_identifier",
  "type": "support_map",
  "task_scope": "task or subtask covered",
  "target_structure": "join_path | invariant | mechanism | edge_case | plan | proof_strategy | other",
  "control_axes": [
    {
      "name": "axis name",
      "values_or_range": "enumerated values, range, or generation rule",
      "coverage_status": "covered | partially_covered | uncovered | not_applicable"
    }
  ],
  "known_low_support_regions": [
    "regions likely to be missed by direct generation"
  ],
  "protected_regions": [
    "regions that should not be pruned without explicit audit"
  ],
  "evidence": "why this map is believed useful",
  "revocation_trigger": "when the map should be revised or discarded"
}
```

### 9.2 Search Warrant

Search Warrant 因支持扩展的预期价值足以证明成本合理，而授权额外探索。

```json
{
  "id": "search_warrant.unique_identifier",
  "type": "search_warrant",
  "reason": "why direct generation or current search is insufficient",
  "mismatch_type": "support",
  "target_region": "candidate region to expand",
  "expected_value_basis": "why this region may contain high-value candidates",
  "budget": {
    "candidate_limit": 0,
    "tool_calls": 0,
    "human_review": "none | optional | required",
    "latency_limit": "constraint"
  },
  "stop_conditions": [
    "coverage reached",
    "verifier success",
    "budget exhausted",
    "support hypothesis falsified"
  ],
  "revocation_trigger": "condition that cancels the warrant"
}
```

### 9.3 Candidate Generation Contract

Candidate Generation Contract 指定结构多样性要求。

```json
{
  "id": "candidate_generation_contract.unique_identifier",
  "type": "candidate_generation_contract",
  "target_artifact": "what candidates are being generated",
  "diversity_axes": [
    "state hypothesis",
    "join path",
    "mechanism class",
    "failure family"
  ],
  "minimum_coverage": {
    "per_axis": "coverage rule",
    "protected_minority_candidates": 0
  },
  "forbidden_pseudo_diversity": [
    "wording-only variation",
    "alias-only variation",
    "same assumption with different phrasing"
  ],
  "candidate_lineage_required": true,
  "recognition_method": "how promising candidates will be identified"
}
```

### 9.4 Coverage Ledger

Coverage Ledger 记录搜索历史。

```json
{
  "id": "coverage_ledger.unique_identifier",
  "type": "coverage_ledger",
  "task_scope": "search scope",
  "generated_candidates": [
    {
      "candidate_id": "candidate identifier",
      "control_axis_values": {},
      "lineage": "how it was generated",
      "status": "active | pruned | matured | selected | rejected",
      "pruning_reason": "if pruned",
      "verification_status": "untested | passed | failed | inconclusive"
    }
  ],
  "coverage_gaps": [
    "unsearched or undersearched regions"
  ],
  "support_findings": [
    "audit findings related to support"
  ]
}
```

### 9.5 Support Delta

Support Delta 是专门改变候选可达性的控制增量。

```json
{
  "id": "support_delta.unique_identifier",
  "type": "support_delta",
  "source_finding": "audit finding that triggered this delta",
  "support_failure_subtype": "policy | search_operator | budget | pruning | recognition | expansion | transfer",
  "change": "what will change in candidate generation, search, pruning, or recognition",
  "target_region": "candidate region whose support should increase",
  "expected_effect": "why the change should improve reachability",
  "regression_guard": "guard that detects recurrence of the support failure"
}
```

### 9.6 Support Regression Guard

Support Regression Guard 确保曾经遗漏的结构现在会被生成、保存并识别。

```json
{
  "id": "support_regression_guard.unique_identifier",
  "type": "support_regression_guard",
  "defect_family": "missed join path | missed edge case | missed invariant | missed mechanism | other",
  "representative_case": "case that previously failed",
  "required_behavior": [
    "generate candidate in target region",
    "preserve it through pruning",
    "subject it to verification",
    "select or reject with explicit evidence"
  ],
  "failure_condition": "what means the support failure recurred",
  "teeth_test": "how to confirm the guard fails if the missed structure is removed or suppressed"
}
```

---

## 10. 支持审计

支持审计检查候选搜索是否充分覆盖任务所需的结构替代项。

最小 Support Audit Finding：

```json
{
  "id": "finding.support.unique_identifier",
  "artifact": "candidate set, search trace, or final output",
  "finding": "high-value candidate family was not generated / preserved / recognized",
  "evidence": "coverage gap, missing axis, pruned candidate, verifier discrepancy",
  "mismatch_type": "support",
  "support_subtype": "policy | search_operator | budget | pruning | recognition | expansion | transfer",
  "severity": "low | medium | high | critical",
  "repair_target": "search space | search operator | pruning rule | recognition method | control object",
  "control_delta": "proposed support delta",
  "regression_guard": "support guard preventing recurrence",
  "confidence": "confidence in diagnosis"
}
```

### 10.1 审计问题

支持审计应问：

```text
What candidate families were searched?
What candidate families were not searched?
Were alternatives structurally diverse or only stylistically diverse?
Were low-probability candidates protected long enough for verification?
Did the evaluator recognize promising unusual candidates?
Were candidates matured from partial to complete form?
Was search guided by task-relevant axes?
Were support failures written back into future search policy?
```

### 10.2 常见审计发现

常见发现包括：

```text
All candidates share the same hidden assumption.
Candidate diversity is lexical rather than structural.
The correct structure appeared in an intermediate note but was not propagated.
The search operator pruned the only candidate with the right dependency.
The verifier was applied only to the final selected candidate.
The system used self-consistency despite correlated samples.
The prompt requested alternatives without specifying control axes.
The tool result created a new candidate region, but no expansion followed.
```

---

## 11. Text-to-SQL 中的支持失配

Text-to-SQL 是清晰的支持失配领域，因为正确 SQL query 在直接生成下可能结构上稀有。

直接生成问：

```text
question + schema → SQL
```

这要求模型在一条候选轨迹中同时选择表、列、join、filter、aggregation、ordering、grouping 和 syntax。正确 SQL 可能只占输出空间中的薄区域。

支持治理把它拆为控制空间搜索：

```text
question
  → intent slots
  → relevant table candidates
  → schema subgraph
  → join path enumeration
  → column binding
  → value binding
  → predicate skeleton
  → aggregation skeleton
  → SQL rendering
  → execution audit
```

### 11.1 低支持结构

常见低支持结构包括：

```text
multi-hop join paths
non-obvious bridge tables
implicit aggregation
nested subqueries
anti-joins
date normalization
value grounding through cell contents
ambiguous column names
schema-specific enumerations
```

### 11.2 支持修复模式

| 失败 | 支持修复 |
|---|---|
| 正确表未被考虑 | 通过 schema 语义和值证据生成表候选。 |
| 正确 join path 被漏掉 | SQL 生成前在 schema graph 上枚举 join path。 |
| value grounding 被漏掉 | 查询样本值或 value indexes；增加 value-binding GKO。 |
| aggregation 稀有 | 将 aggregation skeleton 与 predicate 分开生成。 |
| nested query 没采样到 | 把 query-shape template 作为控制轴搜索。 |
| 候选因执行错误被剪枝 | 把执行错误视为诊断，并生成 repair delta。 |

### 11.3 执行反馈作为识别支持

执行反馈提升识别支持，但不保证候选支持。运行生成的 SQL 有助于识别坏候选，却不会自动生成正确候选。因此执行反馈应与支持扩展耦合：

```text
execution failure
  → localize failure
  → identify missing candidate region
  → generate support delta
  → expand controlled search
```

---

## 12. 代码合成中的支持失配

代码合成中，正确补丁可能低支持，因为很多编辑都看似合理。

直接生成问：

```text
bug report + code context → patch
```

支持治理型代码合成搜索中间对象：

```text
bug report
  → failing behavior
  → invariant
  → affected API contract
  → dependency slice
  → patch strategy
  → code patch
  → test execution
```

低支持结构包括：

```text
rare edge case
nonlocal dependency
implicit invariant
interaction between modules
lifecycle ordering bug
concurrency interleaving
backward compatibility constraint
```

支持修复模式包括：

```text
generate invariants before patches
enumerate failure modes before edits
protect unusual hypotheses until tested
use tests as recognition support
write missed edge cases into regression guards
```

代码合成中的支持回归护栏不应只保证最终补丁通过已知测试，还应保证曾被漏掉的候选族现在被考虑，或其 invariant 被显式检查。

---

## 13. 研究与分析中的支持失配

研究任务经常因支持失配失败，因为高价值想法不是既有 discourse 中最可能的 continuation。

直接生成倾向于产生：

```text
reasonable summaries
mainstream framings
safe qualifications
familiar taxonomies
surface-level objections
```

高价值结构可能要求：

```text
unusual mechanism
reframing
hidden contradiction
cross-domain analogy
failure of a shared assumption
new object decomposition
boundary condition
```

研究写作中的支持治理应搜索控制结构：

```text
claim space
mechanism space
objection space
counterexample space
boundary-condition space
analogy space
formalization space
```

一个有用的 Candidate Generation Contract 可能要求：

```text
one mainstream mechanism
one contrarian mechanism
one boundary-condition reversal
one hidden-variable hypothesis
one formal analogy
one failure-of-proxy interpretation
```

重点不是为了新而新，而是避免把流畅主流支持误认为已经充分探索高价值结构。

---

## 14. 搜索预算作为受治理资源

支持治理需要预算纪律。更多搜索并不总是更好。搜索预算应按预期价值和结构不确定性分配。

当以下条件成立时，应签发 Search Warrant：

```text
P(high-value region underexplored)
× value at stake
× expected gain from expansion
>
search cost + verification cost + noise cost
```

预算应按控制轴分配：

```text
state hypotheses
schema paths
failure families
mechanism classes
patch strategies
risk regimes
tool sequences
```

而不是只按最终候选数量分配。

### 14.1 停止条件

搜索应在以下条件下停止：

```text
target coverage is achieved
a verified high-value candidate is found
remaining regions have low expected value
budget is exhausted
the support hypothesis is falsified
a higher-priority mismatch is diagnosed
```

### 14.2 升级条件

搜索应在以下条件下升级：

```text
coverage gaps involve high-stakes regions
all candidates share a hidden assumption
verification repeatedly rejects the dominant basin
the correct structure is suspected but not expressible
a low-support candidate requires external expertise
```

---

## 15. 反模式

### 15.1 采样剧场

采样剧场指系统生成许多候选，却没有改变支持结构。

症状：

```text
many candidates
same assumption
same plan
same join path
same omitted variable
same proxy objective
```

### 15.2 多样性剧场

多样性剧场指系统要求“diverse answers”，但没有定义结构多样性轴。

更好的指令：

```text
Generate candidates that differ by state hypothesis, mechanism class, dependency structure, and failure mode.
```

而不是：

```text
Generate five diverse answers.
```

### 15.3 Critique 剧场

Critique 剧场指 critique 改善表达，却让候选族保持不变。

症状：

```text
more caveats
better wording
same missing structure
same unsupported assumption
same low-value basin
```

### 15.4 只有验证器的幻觉

验证器可以拒绝坏候选，但不能单独保证好候选被生成。

强验证弱支持的系统，可能很擅长说 no，却不擅长找到 yes。

### 15.5 过早共识

相关样本之间的共识会放大支持偏差。

除非样本的结构独立性已建立，否则系统不应把共识解释为可靠性。

### 15.6 过度治理的搜索

支持治理也可能有害。僵硬控制空间可能抑制有用的意外候选。搜索契约应包含撤销触发器和新结构 escape hatch。

---

## 16. 与知识治理、审计工程和 SGAR 的集成

支持治理不是独立模块。它连接到受治理 LLM 架构的其他部分。

### 16.1 与知识治理

支持修复产生 GKO：

```text
low-support region identifiers
candidate generation rules
protected candidate regions
search-axis definitions
value-recognition discriminators
```

这些对象应有作用域和撤销触发器。

### 16.2 与审计工程

支持审计产生 finding 和 delta：

```text
finding: correct join path was never generated
delta: add join-path enumeration before SQL rendering
guard: representative case must produce the bridge-table path
```

### 16.3 与 SGAR

当搜索进展重要时，支持状态应被提交：

```text
which regions were searched
which candidates were pruned
which candidates were protected
which verifier results were obtained
which coverage gaps remain
```

没有硬状态，长程 agent 可能反复搜索同一区域、忘记受保护候选，或虚假声称覆盖已完成。

### 16.4 与拟合边界治理

支持修复常依赖路由修复。系统必须激活与任务相应的搜索行为：

```text
join-path search
edge-case generation
counterexample search
mechanism enumeration
invariant extraction
```

如果这些能力没有被路由，支持扩展不会发生。

### 16.5 与观测-表征治理

支持修复无法生成依赖缺席变量的结构。如果缺失候选依赖未观测信息，通道修复必须先于支持修复。

---

## 17. 最小实现模式

一个最小支持治理型 LLM 系统可以用以下管线实现：

```text
Input
  → representation audit
  → support risk assessment
  → control-axis selection
  → candidate generation contract
  → candidate expansion
  → coverage ledger
  → verifier / audit
  → support delta
  → governed rendering
```

伪流程：

```text
function support_governed_generation(task, representation, budget):
    risk = assess_support_risk(task, representation)

    if risk.low:
        return direct_or_lightweight_generation(task)

    axes = construct_control_axes(task, representation)
    contract = build_candidate_generation_contract(axes, budget)
    candidates = generate_candidates(contract)

    ledger = initialize_coverage_ledger(axes, candidates)

    for candidate in candidates:
        if anti_pruning_required(candidate):
            protect(candidate, ledger)

        result = verify_or_audit(candidate)

        update_ledger(ledger, candidate, result)

        if result.verified_high_value:
            return render(candidate), ledger

    gaps = identify_coverage_gaps(ledger)

    if gaps.high_value and budget.remaining:
        delta = create_support_delta(gaps)
        return support_governed_generation(task.with_delta(delta), representation, budget.remaining)

    return best_supported_candidate(ledger), ledger
```

重要特征是：

```text
structural axes
coverage tracking
anti-pruning
verification coupling
write-back
state commitment
```

没有这些，系统很可能只是在采样。

---

## 18. 什么时候不需要支持治理

支持治理并不总是必要。

通常不需要它的情形：

```text
the high-value region is already high-probability
local fluency strongly correlates with task value
the task is low-stakes
a complete verifier and generator already exist
ordinary retrieval supplies the missing structure
output-space sampling gives true structural diversity
the cost of search exceeds expected value
```

它可能有害的情形：

```text
the control axes are wrong
the governance layer prunes novel candidates
coverage accounting becomes bureaucratic
the system optimizes for explored regions rather than value
budget is diverted from a more important mismatch
```

成熟系统应判断是否值得支持治理，而不是普遍套用。

---

## 19. 支持失配的自审计

支持失配主张本身可以表示为受治理理论对象。

```json
{
  "id": "gko.support_mismatch_primitive_claim",
  "type": "theoretical_claim",
  "condition": "LLM systems analyzed as value-preservation pipelines with a candidate-support station between capability routing and aggregation",
  "assertion": "High-value task structures may be expressible and valuable but receive insufficient effective support under the deployed policy, search operator, pruning rule, recognition mechanism, and budget.",
  "strength": "structural-relative",
  "support_scope": "Failures where candidate reachability, preservation, maturation, or recognition is the distinct repair target",
  "revocation_trigger": "Show that all such failures can be reduced to observation-representation, state, fitting-boundary, aggregation, or specification mismatch without losing intervention specificity.",
  "not_supported_claims": [
    "Does not claim all low performance is caused by support mismatch.",
    "Does not claim more search always helps.",
    "Does not claim every rare candidate is valuable.",
    "Does not claim control-space search is always cheaper than output-space search."
  ]
}
```

这个自审计很重要，因为支持失配很容易被过度诊断。许多失败看起来像支持失败，因为正确答案没有出现。但更深原因可能是变量缺席、状态错误、路由错误、聚合错误或规格错误。只有当修复目标确实是候选可达性或覆盖时，支持诊断才成立。

---

## 20. 结论

支持失配是高价值 LLM 系统中的可达性失败。它发生在任务价值所需结构没有在已部署搜索流程和预算下被充分生成、保存、成熟、识别或选择时。

它是原始失配，因为候选支持是价值保存管线中的独立站点。它不能还原为观测缺失、状态歧义、能力路由失败、局部到全局聚合失败或目标规格错误，尽管它与这些问题强烈相互作用。

主要修复不是盲目采样，而是控制空间搜索：搜索比最终文本更直接决定任务价值的中间对象。通过构造控制轴、结构化扩展候选、跟踪覆盖、保护低概率候选、耦合验证器，并把成功结构写回受治理知识和硬状态，LLM 系统可以提高高价值输出的有效支持。

在受治理 LLM 系统统一理论中，支持治理是候选空间层面对通道治理、路由治理、审计工程和状态治理的对应物。它回答一个中心问题：

```text
Even if the system has the right information, the right state, the right capability, and the right objective,
will the high-value structure actually become a live candidate?
```

如果答案是否定的，系统需要的不是更流畅的生成，而是支持修复。

---

## Appendix A: 紧凑术语表

| 术语 | 定义 |
|---|---|
| 支持失配 | 高价值结构在已部署策略、搜索算子、剪枝规则、识别机制和预算下有效可达性不足的失败。 |
| 有效支持 | 高价值候选被生成、保存、识别并可用于选择的概率。 |
| 候选空间 | 系统策略和搜索预算下可达的活候选集合。 |
| 控制空间 | 决定最终产物的中间结构空间。 |
| 控制空间搜索 | 搜索控制对象，而不是最终输出。 |
| 支持提升 | 把低支持最终输出目标转换为更高支持控制空间目标。 |
| 伪多样性 | 候选有表面差异，但共享同一结构盲点。 |
| Search warrant | 授权额外支持扩展的受治理对象。 |
| Support map | 已搜索和搜索不足候选区域的表征。 |
| Coverage ledger | 生成候选、结构轴、剪枝决策和验证状态的记录。 |
| Support delta | 改变候选区域可达性、保存、展开或识别的控制增量。 |
| Support regression guard | 确保曾被漏掉的候选族现在会被生成、保存并识别的护栏。 |

---

## Appendix B: 支持诊断清单

支持诊断应检查：

```text
1. Was the relevant information present in representation?
2. Was the correct latent state identified or at least preserved as a branch?
3. Was the relevant capability activated?
4. Did candidate generation cover the structural axis where the answer lives?
5. Did candidates differ structurally or only stylistically?
6. Was a promising low-probability candidate generated and then pruned?
7. Was a partial candidate expanded into a full candidate?
8. Was the evaluator capable of recognizing the high-value candidate?
9. Was the support failure written back as a support delta?
10. Was a regression guard added to prevent recurrence?
```

如果 1、2、3 的答案是否定，主要失配可能在上游。如果 8 是否定是因为标准本身错误，主要失配可能是规格。如果候选组件存在但不能组合，聚合可能占主导。支持诊断应精确，而不是默认归因。

---

## Appendix C: 支持增量模板示例

### C.1 漏掉 Join Path

```json
{
  "id": "support_delta.missed_join_path",
  "type": "support_delta",
  "support_failure_subtype": "search_operator",
  "source_finding": "The generated SQL candidates did not include the bridge-table join path required by the schema.",
  "change": "Add explicit join-path enumeration over the schema graph before SQL rendering.",
  "target_region": "multi-hop join paths involving bridge tables",
  "expected_effect": "Raises reachability of low-probability but schema-valid query structures.",
  "regression_guard": "Representative questions requiring bridge-table joins must generate at least one valid bridge-path candidate before final SQL selection."
}
```

### C.2 漏掉边界情况

```json
{
  "id": "support_delta.missed_edge_case",
  "type": "support_delta",
  "support_failure_subtype": "policy",
  "source_finding": "Candidate patches ignored the empty-input edge case.",
  "change": "Add edge-case enumeration by input cardinality before patch generation.",
  "target_region": "zero-length, singleton, null, and boundary inputs",
  "expected_effect": "Increases candidate support for patches that preserve boundary behavior.",
  "regression_guard": "Patch-generation traces must include boundary-case consideration before final patch rendering."
}
```

### C.3 伪多样性

```json
{
  "id": "support_delta.pseudo_diversity",
  "type": "support_delta",
  "support_failure_subtype": "search_operator",
  "source_finding": "The system generated five alternatives, all sharing the same hidden assumption.",
  "change": "Require structural diversity along state-hypothesis and mechanism-class axes.",
  "target_region": "alternative latent-state and mechanism basins",
  "expected_effect": "Reduces correlated sampling and increases chance of reaching the correct basin.",
  "regression_guard": "Alternative-candidate sets must include explicit axis annotations showing non-identical assumptions."
}
```

---

## Appendix D: YAML 中的最小支持对象

```yaml
support_map:
  id: support_map.example
  task_scope: "current task"
  target_structure: "join_path"
  control_axes:
    - name: "join_depth"
      values_or_range: "1..3"
      coverage_status: "partially_covered"
    - name: "bridge_table"
      values_or_range: "schema-derived"
      coverage_status: "uncovered"
  known_low_support_regions:
    - "multi-hop paths through bridge tables"
  protected_regions:
    - "paths that initially look indirect but satisfy foreign-key constraints"
  revocation_trigger: "schema graph changes or direct-generation reliably covers these paths"

candidate_generation_contract:
  id: candidate_generation_contract.example
  target_artifact: "SQL skeleton"
  diversity_axes:
    - "table set"
    - "join path"
    - "predicate skeleton"
    - "aggregation form"
  forbidden_pseudo_diversity:
    - "alias-only variants"
    - "same join path with reordered clauses"
  candidate_lineage_required: true
  recognition_method: "schema validation + execution audit"

coverage_ledger:
  id: coverage_ledger.example
  task_scope: "single text-to-SQL query"
  generated_candidates: []
  coverage_gaps:
    - "no candidate explored bridge table relation"
  support_findings:
    - "dominant candidates used direct table pairing not supported by schema"
```
