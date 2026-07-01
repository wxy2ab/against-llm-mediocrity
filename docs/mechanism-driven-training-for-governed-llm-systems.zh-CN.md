# 面向受治理 LLM 系统的机制驱动训练

## 运行时治理在训练侧的对应层

**工作稿 v0.1**  
**配套文档：**  
`structural-theory-value-preservation-llm-systems.md`  
`diagnostic-mechanism-bridge-for-governed-llm-systems.md`  
`formal-mechanism-layer-for-governed-llm-systems.md`  
`governed-llm-object-model-interface-specification.md`  
`audit-engineering-failure-localization-control-space-writeback.md`  
`state-governed-agent-regime-for-governed-llm-systems.md`

---

## 摘要

当前的受治理 LLM 理论栈，主要描述的是 **运行时治理**：知识治理、审计工程、对象级控制增量、回归护栏，以及状态治理型 Agent 体制（SGAR），都围绕一个冻结模型运行。它们通过改变任务表征、控制对象、审计回路、路由规则、执行过程与已提交状态来修复失败，而不改变模型权重。

这留下了训练侧的缺口。当某个反复出现的失败，是由近似 LLM 系统中的某个 **学习组件** 引起的，例如信念 / 表征 `B_θ`、世界模型 `T̂_θ`、能力支持 `π_θ`、能力路由 `r_θ`，或学习到的奖励 / 代理 `R̂_θ / R_proxy`，运行时治理往往可以先把它补住，但重复补丁会逐渐变成跑步机。系统会持续为本应被摊销进模型内部的缺陷支付推理时成本。

本文定义 **机制驱动训练**（Mechanism-Driven Training）：它是运行时治理在训练侧的对应层。其核心主张是：同一套用于修复定位的八轴机制诊断，也应当驱动训练干预。不同之处不在诊断本身，而在 **修复层**。

规范记录是：

```text
mismatch_type ∈ 六类原始价值保存失配
control_object ∈ 任务特定治理对象
mechanism_axis ∈ 八条干预机制轴 | unknown | not_operationalized
repair_layer ∈ agent | training | hybrid
```

运行时治理处理局部、可逆、任务特定的失败。机制驱动训练则把那些反复出现、跨任务、由学习组件引起的失败，从缺陷台账提升为训练课程、边界数据、grounding 数据、奖励纠偏，或能力支持数据。

一句话概括：

> 运行时治理把失败变成可撤销的控制对象；机制驱动训练把反复出现的学习组件失败变成可摊销的训练信号。

---

## 目录

- [1. 在统一理论栈中的位置](#1-在统一理论栈中的位置)
- [2. 范围：学习组件与系统组件](#2-范围学习组件与系统组件)
- [3. 核心原则：训练机制，不训练症状](#3-核心原则训练机制不训练症状)
- [4. 学习组件 → 训练干预映射](#4-学习组件--训练干预映射)
- [5. Agent 层治理 vs 训练层修复](#5-agent-层治理-vs-训练层修复)
- [6. 提升棘轮：从审计发现到训练信号](#6-提升棘轮从审计发现到训练信号)
- [7. 对象模型集成](#7-对象模型集成)
- [8. 训练副作用与边界治理](#8-训练副作用与边界治理)
- [9. 什么时候不该训练](#9-什么时候不该训练)
- [10. Text-to-SQL / BIRD 作为机制驱动训练案例](#10-text-to-sql--bird-作为机制驱动训练案例)
- [11. 机制驱动训练的指标](#11-机制驱动训练的指标)
- [12. 自审计 GKO](#12-自审计-gko)
- [13. 机制驱动训练的失败模式](#13-机制驱动训练的失败模式)
- [14. 压缩教义](#14-压缩教义)
- [Appendix A: 学习组件训练卡片](#appendix-a-学习组件训练卡片)
- [Appendix B: 训练提升检查表](#appendix-b-训练提升检查表)
- [Appendix C: 训练增量模板](#appendix-c-训练增量模板)

---

## 1. 在统一理论栈中的位置

机制驱动训练不会新增一种原始失配，也不会取代六失配分类法。它占据的是诊断-机制桥中的训练侧分支。

```text
六类原始失配：
  诊断任务价值在价值保存管线的哪里没有存活下来。

八条机制轴：
  定位应当修改哪个系统组件。

机制驱动训练：
  处理其中那部分已经通过任务对象完成可操作化、并且其学习组件归因足以证明应将修复摊销进模型训练的机制失败。
```

六类原始失配回答的是：

```text
为什么价值会失败？
失败是在价值保存管线的哪个位置显现出来的？
```

八条机制轴回答的是：

```text
是哪个组件造成了或放大了失败？
在任务对象已经明确之后，哪条机制轴被牵涉？
```

机制驱动训练回答的是：

```text
当机制轴属于学习组件，而且失败族已经被对象化时，
这个失败应继续保留为运行时补丁，
还是应当被提升进训练？
```

---

## 2. 范围：学习组件与系统组件

形式化机制层把一个受治理 LLM 系统分解为环境与近似系统：

```text
E = (S, A, T, R*, Ω, O, γ)

M_θ = (R̂_θ, Ω_sys, B_θ, T̂_θ, A_sys, π_θ, r_θ, D)
```

`\Omega_{sys}` 属于 `M_θ`，而不是 `E`：`Ω` 与 `O` 描述环境原则上能提供哪些观测，`\Omega_{sys}` 则描述已部署系统实际暴露了哪些观测通道。

机制驱动训练并不是笼统地针对“一切学习到的东西”。它主要关注五条带有学习侧分量的机制轴：

```text
belief_representation   -> B_θ
dynamics_world_model    -> T̂_θ
capability_support      -> π_θ
capability_routing      -> r_θ
specification_reward    -> R̂_θ，以及相关情况下的 R_proxy
```

纯系统侧的机制轴是：

```text
observation_availability  -> Ω_sys 与观测接入策略
action_interface          -> A_sys
search_execution          -> D
```

这些系统组件应通过 Agent 层治理来修复：观测修复、工具接入、接口修改、执行搜索、verifier 设计、受治理知识对象（Governed Knowledge Object / GKO）更新、SGAR 转移规则与审计回路。

五条混合机制轴恰好是：

```text
specification_reward
belief_representation
dynamics_world_model
capability_support
capability_routing
```

这些轴同时具有训练侧与运行时侧分量：

| 机制轴 | 训练侧组件 | 运行时侧组件 |
|---|---|---|
| `specification_reward` | `R̂_θ`、奖励模型、学习到的代理 | rubric、evaluator、verifier、验收标准 |
| `belief_representation` | 内部表征与状态诱导 | 外部状态表、schema、memory object、GKO |
| `dynamics_world_model` | 对后果的学习型预测 | 执行反馈、sandbox、simulator、verifier |
| `capability_support` | 对结构 / 算子的概率质量 | RAG、范例、专门算子、工具 |
| `capability_routing` | 学习到的触发边界 | 显式 router、模式切换、角色绑定 |

修复层选择规则是：

```text
局部、可逆、任务特定的失败：
  在 Agent 层修复。

反复出现、跨任务、可摊销的学习组件失败：
  提升到训练层修复。

混合情况：
  先做运行时治理；若复发持续，则再提升到训练层。
```

---

## 3. 核心原则：训练机制，不训练症状

表面错误很少是充分的训练目标。同一种错误输出，可能源自观测缺失、表征错误、状态错误、支持不足、路由错误、搜索薄弱，或目标失配。

因此，机制驱动训练遵循如下纪律：

```text
表面失败
  → 原始失配诊断
  → 任务特定控制对象
  → 机制画像
  → 学习组件 / 系统组件拆分
  → 如果是学习组件且会复发：
       选择机制特定的训练干预
  → 运行机制评测与边界回归
```

规则是：

> 不要训练症状。要训练那个已经被操作化、并让症状反复出现的机制失败族。

例如：

```text
不要用最终答案的 SFT 去修复状态绑定失败。
要训练或监督状态表征本身。

不要用通用数据去修复路由失败。
要训练正向与反向的触发边界。

不要用流畅解释去修复世界模型失败。
要训练 predict-execute-compare 的 grounding。

不要只训练 SQL 字符串去修复价值 grounding。
要训练 schema linking、value binding 与基于执行的纠偏。

不要把单一 rubric 训练进模型去修复 Goodhart 失败。
要训练反例排序与代理风险辨别。
```

---

## 4. 学习组件 → 训练干预映射

本节为每条学习型机制轴定义其训练侧对应物。

---

### 4.1 `B_θ`：信念 / 表征训练

#### 目标

训练模型把可得信息转化为可操作状态：

```text
解析
绑定
压缩
维护
检索
比较
更新
```

目标不只是把信息放进 prompt。目标是让这些信息能作为内部或外化的任务状态被真正使用。

#### 典型来源发现

机制画像中具有：

```text
mechanism_axis = belief_representation
repair_layer = training | hybrid
```

其表面上常表现为：

```text
observation_representation mismatch
state mismatch
aggregation mismatch
因遗忘约束而被放大的 specification mismatch
```

典型发现包括：

```text
信息明明存在，但没有被使用
实体绑定错误
单位 / 时间 / 角色绑定丢失
schema 列可见，但没有被链接
约束出现在上下文中，但没有进入计划
长程依赖没有被维持
状态表在多步之间不一致
```

#### 训练干预

```text
状态抽取监督
约束抽取监督
实体 / 时间 / 单位绑定数据
schema-linking 监督
value-linking 监督
中间状态上的过程监督
辅助表征损失
memory update 监督
known / unknown / assumption 表训练
```

#### 机制评测

```text
保留集状态抽取探针
schema-linking 探针
约束回忆 / 约束应用探针
实体与时间绑定探针
长上下文状态保持测试
```

#### 副作用

```text
对开放任务过度结构化
在需要灵活解释时强行套模板
对模糊信息产生虚假精度
降低创造性探索
```

#### 边界回归

在完成表征训练后，应测试那些本不该被过度触发严格结构的邻近任务：

```text
开放式构思
模糊用户意图
非表格化写作
创造性综合
多视角分析
```

---

### 4.2 `T̂_θ`：动态 / 世界模型训练

#### 目标

训练模型对行动后果的预测，使其与真实环境转移一致：

```text
T̂_θ(s_{t+1} | s_t, a_t) ≈ T(s_{t+1} | s_t, a_t)
```

当系统在代码、SQL、浏览器、API、工具、市场、工作流或其他语言先验不足以覆盖的环境中行动时，这一点尤为关键。

#### 典型来源发现

机制画像中具有：

```text
mechanism_axis = dynamics_world_model
repair_layer = training | hybrid
```

典型发现包括：

```text
模型预测代码会编译，但实际失败
模型虚构 API 行为
模型错误预测 SQL 结果形状
模型低估错误传播
模型假设工具会产生并不存在的效果
模型在环境尚未改变时就叙述“已完成”
计划依赖无效的状态转移
```

#### 训练干预

```text
predict → execute → compare → correct 轨迹
基于执行 grounding 的纠错数据
工具结果监督
API 行为 grounding
编译器 / 测试反馈训练
环境交互轨迹
基于模拟器的训练
后果预测校准数据
带经验证环境反馈的 RL 或偏好训练
```

#### 机制评测

```text
predict-execute-compare 准确率
执行前结果预测
tool-call 后果预测
API 行为预测
编译 / 测试结果预测
SQL 结果形状预测
多步错误传播预测
```

#### 副作用

```text
对单一执行环境过拟合
把 sandbox 的怪癖错误泛化
在失败密集数据后变得过度保守
把环境特定假设泄漏到无关任务
```

#### 边界回归

需要在环境变体上进行测试：

```text
不同 API 版本
不同数据库 schema
不同编译器 / 解释器
不同浏览器 / 工具状态
不同执行限制
不同市场或模拟体制
```

---

### 4.3 `π_θ`：能力支持训练

#### 目标

在固定或适度的推理预算下，提高高价值结构的概率质量与可达性。

问题是：

```text
模型到底能不能生成所需的算子、结构、证明步、
join 模式、程序模式或工作流？
```

#### 典型来源发现

机制画像中具有：

```text
mechanism_axis = capability_support
repair_layer = training | hybrid
```

典型发现包括：

```text
许多采样中从不出现正确结构
只有在专家示范后才会出现正确结构
模型缺少稀有 join 路径或嵌套查询形式
模型从不提出必要的证明策略
模型无法生成领域特定算子
模型会生成通用替代物，但不会生成高价值候选
```

#### 训练干预

```text
针对稀有正确结构的 SFT
从易到难的课程
专家 / 程序化算子蒸馏
长尾数据增强
反事实支持数据
针对支持不足能力的专门数据
展示稀有结构如何被构造的分解轨迹
```

#### 机制评测

```text
固定预算下目标结构的 pass@k
结构出现率
算子召回率
稀有模式召回率
以正确性为条件的候选多样性
在保留 schema / domain 上的支持提升
```

#### 副作用

```text
抬高长尾结构可能扭曲常见情形先验
对简单任务产生负迁移
过度使用专门算子
伪模式记忆
在路由较弱时增加假阳性
```

#### 边界回归

能力支持训练必须与路由测试配对。一个更容易生成的结构，也可能更容易被误触发。

```text
正向支持评测：
  在需要时，模型能否生成该结构？

反向边界评测：
  在不合适时，模型能否避免该结构？
```

---

### 4.4 `r_θ`：能力路由训练

#### 目标

纠正学习到的能力触发边界。

令：

```text
T_X = 能力 X 的真实适用域
M_X = 模型激活能力 X 的域
```

路由训练旨在减少：

```text
过触发：  M_X \ T_X
欠触发： T_X \ M_X
```

#### 典型来源发现

机制画像中具有：

```text
mechanism_axis = capability_routing
repair_layer = training | hybrid
```

典型发现包括：

```text
能力在另一个 prompt 下会出现，但在目标场景中不出现
专家角色会触发正确行为，但默认模式不会
模板化推理被过触发
schema audit 被欠触发
工具使用被欠触发
安全拒答或谨慎模式被过触发
直接回答模式压制了本应启动的搜索模式
```

#### 训练干预

```text
正向与反向触发边界数据
带模式标签的样例
来自 M_X \ T_X 的 hard negatives
来自 T_X \ M_X 的 hard positives
针对激活 / 抑制决策的偏好数据
router 校准数据
对比式能力选择
角色绑定与模式切换监督
```

#### 机制评测

```text
能力边界混淆矩阵：

TP: 在适用时触发能力
FP: 在不适用时错误触发
FN: 在需要时未触发
TN: 在不适用时成功抑制
```

必须同时评估两侧：

```text
过触发回归
欠触发回归
邻近任务边界测试
模式选择准确率
```

#### 副作用

```text
收紧过触发可能制造欠触发
增强欠触发可能制造过触发
新的能力标签可能沦为表面风格标记
router 可能学到 prompt 伪特征，而不是任务条件
```

#### 边界回归

路由训练始终需要成对的正向与反向边界测试。单边路由评测无效。

---

### 4.5 `R̂_θ / R_proxy`：奖励 / 代理训练

#### 目标

改进学习到的或可训练的目标，使候选排序与真实任务效用对齐，而不是对齐到脆弱代理。

形式化地说，要减少如下情况：

```text
rank_R̂(Y1, Y2) ≠ rank_U(Y1, Y2)
```

#### 典型来源发现

机制画像中具有：

```text
mechanism_axis = specification_reward
repair_layer = training | hybrid
```

典型发现包括：

```text
生成器与评估器共享同一个错误假设
奖励模型稳定地选择流畅但错误的答案
rubric 过度重视可见风格，而轻视隐藏正确性
执行成功被奖励，但语义上仍然错误
模型优化 benchmark 代理，却偏离任务意图
偏好模型把反例对排错序
```

#### 训练干预

```text
反例偏好对
anti-Goodhart hard negatives
奖励模型纠偏数据
rubric 到偏好的转换
多 rubric 校准
代理风险标签
语义正确性 vs 表面合规性的对比
evaluator 分歧数据
```

#### 机制评测

```text
反例对排序
代理过优化测试
语义 vs 表面排序测试
多 rubric 鲁棒性
奖励模型校准
在困难样本对上的人类 / 专家一致性
```

#### 副作用

```text
对单一 rubric 过拟合
对合法代理使用过度纠偏
奖励保守化
在新代理下发生新的 reward hacking
风格 / 价值纠缠
```

#### 边界回归

应在多种 rubric 与任务家族上评估。一个只修复单一 benchmark 伪特征的奖励修复，可能会在别处制造新的规格失配。

---

## 5. Agent 层治理 vs 训练层修复

同一种机制失败，可能有两条修复路径：

| 修复路径 | 属性 | 典型工具 |
|---|---|---|
| Agent 层治理 | 快、局部、可逆、任务特定 | GKO、显式 router、工具接入、审计回路、执行反馈、控制空间搜索 |
| 训练层修复 | 慢、全局、持久、可摊销 | SFT、偏好数据、课程、grounding 轨迹、奖励纠偏、router 训练 |
| 混合 | 先做运行时补丁，若持续复发则提升到训练 | 缺陷台账、机制画像、临时 GKO、后续训练项 |

机制驱动训练不应成为默认的第一反应。默认应该是：

```text
当局部修复已经足够时，就在局部修
只有当复发让运行时修复变成跑步机时，才提升到训练
```

当缺陷满足以下条件时，训练干预才是合理的：

```text
由学习组件引起
反复出现
跨任务
在运行时打补丁成本高
能被表示为训练数据或目标纠偏
可由一个有牙齿的机制评测来衡量
在边界回归下是安全的
```

---

## 6. 提升棘轮：从审计发现到训练信号

机制驱动训练把审计工程从运行时写回，扩展到训练侧写回。

### 6.1 闭环

```text
Agent 层审计发现
  → 原始失配诊断
  → 任务特定控制对象
  → 机制画像
  → mechanism_axis ∈ 八条机制轴
  → repair_layer ∈ agent | training | hybrid
  → 如果是系统组件：
       通过 Agent 层治理修复
  → 如果是学习组件且会复发：
       记录进缺陷台账
       提升为带机制标签的训练项
  → 训练
  → 运行机制评测 + 边界回归
  → 重新部署
  → 在安全时退役或削弱对应的运行时补丁
```

### 6.2 提升条件

只有当以下条件全部成立时，某个发现才应提升到训练层：

```text
1. repair_layer 是 training 或 hybrid。
2. mechanism_axis 是学习组件：
     belief_representation
     dynamics_world_model
     capability_support
     capability_routing
     specification_reward
3. 失败家族已经通过任务特定控制对象完成可操作化。
4. recurrence_count 超过阈值。
5. 复发跨越了任务、schema、用户或环境。
6. Agent 层补丁是重复性的或代价高的。
7. 可以构造机制特定的保留集评测。
8. 边界回归风险可接受。
```

### 6.3 拒绝条件

在以下情况下，不要提升到训练：

```text
该缺陷只是一次性问题
缺陷由观测缺失引起
缺陷由动作接口不可用引起
缺陷由搜索 / 执行配置引起
缺陷由运行时 rubric 或 verifier 引起
没有有牙齿的机制评测
训练数据会把局部补丁编码成全局行为
边界回归风险超过预期的复发下降收益
```

---

## 7. 对象模型集成

机制驱动训练不需要新增一套治理对象家族。它复用现有对象模型，只是增加训练层字段。

### 7.1 Audit Finding

一个 Audit Finding 应包含：

```json
{
  "mismatch_type": "observation_representation | state | fitting_boundary | support | aggregation | specification | compound | unknown",
  "control_object_ref": "object.id",
  "control_object_type": "sql_dag | claim_evidence_map | state_table | router_rule | rubric | other",
  "mechanism_axis": "specification_reward | observation_availability | belief_representation | dynamics_world_model | action_interface | capability_support | capability_routing | search_execution | unknown | not_operationalized",
  "operationalization_status": "direct | derived | partial | not_operationalized",
  "repair_layer": "agent | training | hybrid | unknown",
  "mechanism_role": "primary | amplifier | downstream | unknown",
  "mechanism_profile_ref": "mechanism_profile.id"
}
```

### 7.2 Mechanism Profile

Mechanism Profile 应区分系统机制与学习机制：

```json
{
  "id": "mechanism_profile.example",
  "primary_mechanisms": ["capability_routing"],
  "secondary_mechanisms": ["capability_support"],
  "recommended_repair_layer": "hybrid",
  "training_promotion_candidate": true,
  "promotion_reason": "无关 schema 上反复出现的 schema audit 欠触发。",
  "mechanism_eval_ref": "eval.capability_routing.schema_audit_boundary",
  "boundary_regression_refs": [
    "eval.capability_routing.direct_sql_when_safe",
    "eval.capability_routing.avoid_unneeded_schema_search"
  ]
}
```

### 7.3 Control Delta

当 `target_layer = training` 时，一个 Control Delta 就是 **训练增量**。它的目标不再是 GKO，而是训练工件：课程项、边界集、grounding trace、偏好对、奖励纠偏或评测。

```json
{
  "id": "delta.training.capability_routing.schema_audit",
  "object_kind": "control_delta",
  "target_mechanism": "capability_routing",
  "target_layer": "training",
  "delta_class": "CapabilityRoutingDelta",
  "operation": "promote_defect_family_to_training_curriculum",
  "source_finding_refs": ["finding.schema_audit_undertrigger.001"],
  "source_mechanism_profile_refs": ["mechanism_profile.schema_audit_undertrigger"],
  "training_artifact_refs": [
    "training_item.schema_audit_positive_boundary",
    "training_item.schema_audit_negative_boundary"
  ],
  "mechanism_eval_refs": ["eval.schema_audit_boundary_confusion_matrix"],
  "boundary_regression_refs": ["eval.direct_sql_safe_cases"]
}
```

### 7.4 Defect Ledger

缺陷台账应跟踪提升状态：

```json
{
  "id": "defect_family.schema_audit_undertrigger",
  "recurrence_count": 37,
  "mechanism_axis": "capability_routing",
  "repair_layer": "hybrid",
  "promoted_to_training": true,
  "training_corpus_refs": ["corpus.schema_audit_boundary_v1"],
  "mechanism_eval_refs": ["eval.schema_audit_boundary_v1"],
  "governance_debt_refs": ["gko.runtime_schema_audit_trigger"],
  "retirement_condition": "当边界评测连续两个发布版本通过后，可削弱运行时 GKO。"
}
```

### 7.5 Regression Guard → Mechanism Eval

当缺陷被提升到训练层时，一个有牙齿的回归护栏就变成了机制评测。

```text
信念 / 表征：
  保留集状态抽取与绑定探针。

世界模型：
  predict-execute-compare 评测。

能力支持：
  固定预算 pass@k / 结构召回评测。

能力路由：
  边界混淆矩阵。

奖励 / 代理：
  反例对排序评测。
```

同样的“牙齿”规则依然成立：

> 如果重新引入代表性缺陷都不能让机制评测失败，那么这个评测就是剧场。

---

## 8. 训练副作用与边界治理

训练会改变共享模型行为。它可能修复一种机制，同时损伤另一种。最常见的副作用，是制造新的拟合边界失配。

例如：

```text
能力支持训练：
  让某个稀有算子变得可用，但也导致滥用。

路由训练：
  减少了过触发，却增加了欠触发。

世界模型 grounding：
  改善了一个执行环境，却对另一个过拟合。

奖励训练：
  修好了一种代理失败，却制造了 rubric 过拟合。

表征训练：
  改善了结构化抽取，却对开放任务过度结构化。
```

因此，每一个机制驱动训练干预都需要边界治理。

### 8.1 必需的发布门

训练干预若未通过以下门槛，不应发布：

```text
1. 机制局部化评测
2. 邻域边界回归
3. 负迁移扫描
4. 代表性缺陷再注入
5. 运行时治理兼容性检查
```

### 8.2 按机制划分的边界回归

| 训练目标 | 必需的边界回归 |
|---|---|
| `belief_representation` | 不应强加严格 schema 的开放任务 |
| `dynamics_world_model` | 替代环境与工具版本 |
| `capability_support` | 新支持的算子并不合适的情形 |
| `capability_routing` | 过触发与欠触发两侧边界集 |
| `specification_reward` | 替代 rubric 与 anti-Goodhart 样本对 |

### 8.3 没有牙齿就不要训练

没有机制评测与边界回归的训练干预，不是机制驱动训练。它只是训练剧场。

---

## 9. 什么时候不该训练

机制驱动训练应当是有选择性的。

在以下情况下不要训练：

```text
机制失败属于系统组件：
  observation_availability
  action_interface
  search_execution
  运行时 rubric / verifier

失败是一次性或任务特定的

运行时补丁更便宜、更安全

缺陷无法表示为训练数据或目标纠偏

没有保留集机制评测

边界回归预测会产生负迁移

拟议训练会把临时用户偏好编码成全局模型行为

这个问题更适合通过工具接入、观测修复、verifier 设计或 SGAR 状态提交来解决
```

训练是高成本、持久、难以撤销的。对于局部、可逆、任务特定的问题，运行时治理仍然是合适的修复层。

---

## 10. Text-to-SQL / BIRD 作为机制驱动训练案例

Text-to-SQL 天然横跨运行时治理与训练侧修复。

在运行时，一个受治理系统可能使用：

```text
schema 抽取
value linking
join-path 搜索
predicate skeleton
执行反馈
审计发现
控制增量
有状态修复
```

这些都属于 Agent 层治理机制。

当某些失败跨 schema 或查询家族反复出现时，同样的发现就可以提升到训练层。

| 学习组件 | Text-to-SQL 训练干预 | 机制评测 |
|---|---|---|
| `B_θ` 信念 / 表征 | schema-linking 与 value-binding 监督 | 保留集 schema / value linking |
| `T̂_θ` 世界模型 | 基于执行 grounding 的 predict-run-correct 数据 | 结果形状与错误预测 |
| `π_θ` 能力支持 | 稀有 join 路径、嵌套查询、条件聚合课程 | 目标结构上的固定预算 pass@k |
| `r_θ` 能力路由 | 何时触发 schema 搜索而不是直接 SQL | 路由边界混淆矩阵 |
| `R̂_θ / R_proxy` 奖励 | 奖励语义正确性，而非仅奖励可执行性 | 可执行但语义错误的 SQL 反例对 |

理论重点不是建议额外实验，而是说明：当运行时失败满足“反复出现、由学习组件引起、且可测量”这几个条件时，它们如何被读作训练侧信号。

执行反馈尤其重要，因为它同时扮演三个角色：

```text
运行时 verifier
世界模型 grounding 信号
训练提升时的机制评测
```

---

## 11. 机制驱动训练的指标

成功标准不只是通用 benchmark 分数提升。真正目标是：在不造成不可接受边界损伤的前提下，降低反复出现的学习组件缺陷。

| 指标 | 含义 |
|---|---|
| 机制局部化评测分数 | 针对目标学习组件的保留集表现 |
| 提升精度 | 被提升的缺陷家族中，训练后复发率下降的比例 |
| 训练后复发率 | 部署后同一种机制失败再次出现的频率 |
| 负迁移率 | 新引入的边界回归数量或严重程度 |
| 治理债务下降 | 训练后被退役或削弱的运行时补丁数量 |
| 摊销比 | 节省的运行时治理成本除以训练成本 |
| 边界稳定性 | 邻近任务中没有新增过触发 / 欠触发失败 |
| 评测牙齿率 | 重新引入代表性缺陷时，确实会失败的机制评测占比 |

理想结果是：

```text
反复出现的学习组件瓶颈下降
运行时治理负担下降
邻近能力边界保持稳定
```

---

## 12. 自审计 GKO

机制驱动训练的核心主张，可以表示为一个受治理理论对象：

```json
{
  "id": "gko.mechanism_driven_training.core",
  "type": "theoretical_claim",
  "condition": "某个失败由 B_theta、T_hat_theta、pi_theta、r_theta 或 R_hat_theta / R_proxy 中一个反复出现的学习组件机制缺陷造成。",
  "assertion": "只要训练干预具备有牙齿的机制评测与边界回归，机制局部化训练就能把原本需要反复依赖 Agent 层治理的学习组件失败摊销进模型内部。",
  "strength": "structural-relative",
  "support_scope": "可构造机制评测的、反复出现的、跨任务的学习组件失败",
  "revocation_trigger": [
    "Agent 层修复始终比训练更便宜、更安全",
    "训练引入的负迁移大于复发下降收益",
    "无法构造任何机制评测",
    "缺陷实际由系统组件而非学习组件造成"
  ],
  "not_supported_claims": [
    "不主张训练能修复缺失观测、缺失动作接口或运行时搜索失败",
    "不主张更大模型或更多通用训练是普适修法",
    "不主张训练会消除运行时治理的必要性",
    "不主张一次性、任务特定的失败都应被提升到训练"
  ]
}
```

---

## 13. 机制驱动训练的失败模式

机制驱动训练本身也可能失败。

### 13.1 症状训练

训练数据模仿了被修正后的输出，但没有训练造成失败的机制。

```text
已见样例上的表面输出变好
机制评测没有改进
一旦分布偏移，复发仍然持续
```

### 13.2 错机制训练

一个由路由导致的失败，被训练成能力支持问题；或者一个由表征导致的失败，被训练成最终答案 SFT。

```text
训练似乎在局部有帮助
新的边界失败出现
根缺陷仍然存在
```

### 13.3 训练剧场

训练干预没有任何有牙齿的机制评测。

```text
模型被训练了
benchmark 可能也动了
但重新注入代表性缺陷时，没有任何评测会失败
```

### 13.4 治理债务转移

训练后，运行时补丁被过早移除。

```text
训练只部分改善了行为
治理对象被退役
失败在边缘情形中回来了
```

### 13.5 边界外溢

一个新训练出的能力，在其支持范围之外被过触发。

```text
目标缺陷减少了
邻近任务退化了
新的拟合边界失配出现了
```

### 13.6 奖励过拟合

奖励纠偏对可见 rubric 过拟合，并制造了新的代理目标。

```text
旧的 Goodhart 失败被修好
新的 Goodhart 失败被引入
```

---

## 14. 压缩教义

```text
六类原始失配：
  诊断价值保存失败。

八条机制轴：
  定位修复组件。

运行时治理：
  围绕冻结模型，修复局部、可逆、任务特定的失败。

机制驱动训练：
  把反复出现、跨任务、由学习组件引起的失败摊销进模型内部。

缺陷台账：
  决定何时把重复出现的运行时发现提升为训练候选。

机制评测：
  证明目标学习组件是否真的改进了。

边界回归：
  防止修复制造新的拟合边界失败。
```

一句话概括：

> Agent 层治理处理的是“这一次怎样不失败”；机制驱动训练处理的是“怎样不再反复以这种方式失败”。

---

## Appendix A: 学习组件训练卡片

```text
B_θ  信念 / 表征
  目标：信息 → 可操作状态
  信号：信息存在，但被误用
  干预：状态 / 过程监督、绑定数据、schema-linking
  评测：状态抽取与绑定探针
  风险：对开放任务过度结构化

T̂_θ 动态 / 世界模型
  目标：预测后果与真实转移一致
  信号：预测 ≠ 执行 / 环境结果
  干预：基于执行 grounding 的 predict-run-correct 数据
  评测：predict-execute-compare 准确率
  风险：环境过拟合

π_θ 能力支持
  目标：提高正确结构的概率质量
  信号：固定预算采样缺少所需候选
  干预：课程、稀有结构 SFT、专家 / 算子蒸馏
  评测：固定预算 pass@k / 结构召回
  风险：负迁移与稀有算子滥用

r_θ 能力路由
  目标：修正过触发与欠触发边界
  信号：能力在别处出现，但在这里不出现；或在不合适时出现
  干预：对比式边界数据、模式标签数据、hard positives / negatives
  评测：边界混淆矩阵
  风险：过触发 / 欠触发跷跷板

R̂_θ / R_proxy 奖励侧
  目标：让代理排序与真实效用对齐
  信号：evaluator 稳定地选错候选
  干预：反例偏好对、anti-Goodhart hard negatives
  评测：反例对排序
  风险：对单一 rubric 的奖励过拟合
```

---

## Appendix B: 训练提升检查表

只有当以下每一项的答案都是 yes，某个缺陷家族才可以提升到训练层：

```text
[ ] 机制轴是否是学习组件？
[ ] 是否存在一个让失败家族可复现、可审计的治理任务对象？
[ ] 缺陷是否会复发？
[ ] 复发是否跨越任务、schema、用户或环境？
[ ] 运行时补丁是否正在变成跑步机？
[ ] 缺陷能否表示为训练数据、边界数据、grounding trace 或奖励纠偏？
[ ] 是否存在一个有牙齿的机制评测？
[ ] 重新注入代表性缺陷时，该评测是否会失败？
[ ] 是否具备边界回归？
[ ] 预期复发下降收益是否大于预期负迁移？
[ ] 是否有计划仅在训练成功后，才退役或削弱运行时治理？
```

如果有任意一项失败，应改用 Agent 层治理。

---

## Appendix C: 训练增量模板

```json
{
  "id": "delta.training.unique_identifier",
  "object_kind": "control_delta",
  "target_mechanism": "belief_representation | dynamics_world_model | capability_support | capability_routing | specification_reward",
  "target_layer": "training",
  "delta_class": "BeliefRepresentationDelta | DynamicsWorldModelDelta | CapabilitySupportDelta | CapabilityRoutingDelta | SpecificationDelta",
  "operation": "promote_defect_family_to_training",
  "source_defect_family_ref": "defect_family.id",
  "source_finding_refs": ["finding.id"],
  "source_mechanism_profile_refs": ["mechanism_profile.id"],
  "training_artifact_refs": ["training_item.id"],
  "mechanism_eval_refs": ["eval.id"],
  "boundary_regression_refs": ["eval.boundary.id"],
  "promotion_criteria": {
    "recurrence_threshold_met": true,
    "cross_task": true,
    "learning_component": true,
    "runtime_treadmill": true,
    "teeth_proven_eval": true
  },
  "release_gate": {
    "mechanism_eval_passed": false,
    "boundary_regression_passed": false,
    "negative_transfer_acceptable": false,
    "runtime_patch_retirement_allowed": false
  },
  "revocation_trigger": "如果训练未通过机制评测、造成不可接受的边界回归，或未能降低复发率，则撤销。"
}
```
