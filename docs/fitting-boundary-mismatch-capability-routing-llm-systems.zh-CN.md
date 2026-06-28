# LLM 系统中的拟合边界失配与能力路由

**能力领域、触发边界与路由治理**  
**工作稿 v0.1**  
**王昕云，梁树良**

---

## 摘要

大型语言模型经常拥有某些能力，却不能在真正需要这些能力的情境中稳定表达。反过来，它们也可能在并不适用的情境中激活已经学到的行为、专家腔调、解题模板、拒答策略、安全仪式或 benchmark 模式。本文把 **拟合边界失配** 展开为受治理 LLM 系统中的一种原始失败模式：能力真实适用域与模型/系统实际激活该能力的域之间发生错位。

核心论点很简单：

```text
Capability present does not imply capability routed.
```

LLM 系统可能具备完成任务所需的知识、模式、技能、工具或推理例程，却仍然失败，因为隐式路由器没有激活它。反过来，系统也可能因为表面证据类似训练期或 prompt 诱导的触发条件而激活某种能力，即使任务并不真正满足该能力的适用条件。这类失败不能还原为知识缺失、概率支持不足、规格歧义、状态不确定或聚合失败。它们发生在世界到输出管线中的 **能力路由站点**。

本文通过区分能力 `X` 的真实适用域 `T_X` 与模型/系统激活域 `M_X` 来形式化这个问题。拟合边界失配发生在：

```text
M_X ≠ T_X
```

两个基本形式是：

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

本文把拟合边界失配置于 LLM 系统价值保存结构理论中。在价值保存管线里：

```text
S_world → O → Z → capability routing → candidate support → aggregation → evaluation
```

拟合边界失配位于路由站点：

```text
Z → trigger evidence → implicit router → activated capability set
```

随后本文发展一套能力路由的实践理论：能力画像、触发证据、抑制器、角色吸引子、边界扰动、路由增量、路由 GKO 和边界回归护栏。它说明拟合边界失配如何与知识治理、审计工程和状态治理型 Agent 体制相互作用。目标是把能力激活从 prompt 表面形式的隐式副作用，转化为可审计、可修订、状态感知的控制层。

### 与 Diagnostic–Mechanism Bridge 的关系

本文使用拟合边界失配作为一种价值保存诊断。当失败进入修复阶段时，Diagnostic–Mechanism Bridge 会把这一诊断映射到八轴机制目标与修复层：

```text
mismatch_type ∈ six primitive mismatches
repair_target ∈ eight mechanism axes
repair_layer ∈ agent | training | hybrid
```

### 机制层映射

拟合边界失配主要映射到 `capability_routing`，其形式机制侧组件是 `r_θ`。

```text
wrong trigger boundary
  → repair_target = capability_routing
  → repair_layer = agent | training | hybrid
```

在 Agent 层，修复通常表现为路由 GKO、router trace、触发规则、抑制规则或显式模式绑定修改。如果同一边界错误跨任务反复出现，并且仅靠运行时治理无法稳定，就应被提升到机制驱动训练。

---

## 1. 引言

一种常见的 LLM 失败描述是：模型“不知道”某件事，或“不会”某种推理。这种描述往往太粗。许多任务中，模型在被直接要求、换一个 prompt 框架、给一个最小例子、展示反例或经由专门流程路由时，能够表现出相关能力。但在原始任务语境里，这个能力没有被激活。模型做了别的事：套用通用模板，进入无关专家 persona，过度应用安全模式，写出合理套话，做浅层类比，或生成一个流畅但绕过真实操作的答案。

这首先不是知识失败，而是路由失败。

相反方向也同样常见。模型可能因为 prompt 中有表面触发词而过度激活某种能力。它看见“risk”就进入谨慎合规模式，看见“SQL”就吐出记忆化查询模板，看见“audit”就生成 checklist，看见“alignment”就切到 AI safety 话语，看见“legal”就拒绝或过度 hedge，看见“benchmark”就按指标而不是语义求解，看见“expert”就模仿专业而不是执行具体操作。

被学到的行为是真的；问题在于它的边界是错的。

本文称这种失败模式为 **拟合边界失配**。一个能力有真实适用域：使用它会提升任务价值的情境集合。模型或系统也有激活域：实际触发该能力的情境集合。当二者偏离时，即便能力存在、相关信息存在、正确答案有足够支持、目标大致明确，系统仍可能失败。

在受治理 LLM 系统的结构理论中，拟合边界失配是六类原始失配之一：

```text
1. Observation-representation mismatch
2. State mismatch
3. Fitting-boundary mismatch
4. Support mismatch
5. Aggregation mismatch
6. Specification mismatch
```

它的独特作用，是解释 **能力激活** 层面的失败。问题不是：

```text
系统是否有信息？
系统是否知道潜在状态？
正确输出是否存在于候选空间？
局部片段能否组合？
目标规格是否正确？
```

问题是：

```text
在已有表征下，系统实际激活了哪种已学能力？
```

这个问题很关键，因为现代 LLM 系统不是单一同质策略。它们是行为、角色、工具、记忆、prompt 例程、潜在技能、拒答启发式、搜索流程、验证器和风格体制的混合体。高价值系统不只要拥有有用能力，还要把能力路由到正确案例。

---

## 2. 在价值保存结构理论中的位置

价值保存统一理论把 LLM 系统建模为从世界到输出的管线：

```text
S_world
  -- φ --> O
  -- ψ --> Z
  -- ρ --> C
  -- pθ --> K
  -- A --> Y
  -- Ũ --> evaluation / selection
```

其中：

- `S_world` 是底层世界、数据库、用户需求、代码库、环境或任务情境。
- `φ` 是观测：感知、数据访问、检索、用户输入、仪器化或工具调用。
- `O` 是被观测材料。
- `ψ` 是表征：编码、压缩、schema 提取、prompt 构造、tokenization、索引或上下文格式化。
- `Z` 是模型/系统可用的操作表征。
- `ρ` 是路由：激活能力、工具、角色、策略或推理流程的机制。
- `C` 是被激活的能力集合。
- `pθ` 是模型/系统在候选产物上的策略。
- `K` 是在预算和搜索流程下可达的候选空间。
- `A` 是聚合：把局部决策组合成全局产物的流程。
- `Y` 是输出或行动序列。
- `Ũ` 是可访问评价器或代理目标。
- `U` 是真实任务效用。

拟合边界失配位于：

```text
Z -- ρ --> C
```

它是能力路由失败。

这个位置很重要。如果决定性变量从未进入 `Z`，失败是观测-表征失配。如果 `Z` 不足以推断相关潜在状态，失败是状态失配。如果能力适用却未被激活，或能力不适用却被激活，失败是拟合边界失配。如果能力已激活但正确结构在策略下概率很低，失败是支持失配。如果局部能力输出无法组合，失败是聚合失配。如果评价器奖励错误东西，失败是规格失配。

因此，拟合边界失配不是分类法的可选补丁。它对应管线中一个结构上独立的站点。

---

## 3. 核心定义

令 `X` 表示一种能力、行为、工具、策略、角色、推理例程、审计模式、拒答策略或生成模式。

定义：

```text
T_X = the true applicability domain of X
M_X = the model/system activation domain of X
```

`T_X` 包含在真实效用 `U` 下激活 `X` 会提升任务价值的情境。

`M_X` 包含系统在 prompt、上下文、模型先验、路由规则、工具策略、记忆或潜在行为影响下实际激活 `X` 的情境。

**拟合边界失配** 发生在：

```text
M_X ≠ T_X
```

基本情形是：

```text
Over-triggering:  M_X \ T_X
Under-triggering: T_X \ M_X
```

过触发意味着系统在 `X` 不应适用的地方激活 `X`。欠触发意味着系统在 `X` 应适用的地方没有激活 `X`。

完美路由器满足：

```text
M_X = T_X
```

实践中这很少可能。目标不是完美路由，而是让路由边界足够显式，从而能够审计、修订、抑制、升级和治理。

---

## 4. 能力不等于行为

一个核心区分是：

```text
Capability availability ≠ capability activation ≠ capability correctness
```

模型可能在孤立情况下具备某种推理操作能力。这并不意味着它会在复杂任务中激活该操作；也不意味着一旦激活，该操作就会被正确应用。

可以区分四层：

```text
1. Latent capability
2. Triggered capability
3. Correctly scoped capability
4. Successfully executed capability
```

系统可能在任何一层失败。

例如，LLM 在被直接要求检查数据库 schema 时可能展示 schema-linking 能力。但在 text-to-SQL prompt 中，它可能立刻输出 SQL，而不执行 schema-linking。能力存在，但没有触发。

类似地，模型可能能写精确代码补丁，但在被要求“修 bug”时，可能过触发解释模式、给出通用诊断，或因为路由把任务绑定到错误修复模式而修改无关代码。

拟合边界失配关注第二层和第三层：能力是否被激活，以及它是否在真实作用域内被激活。

---

## 5. 能力路由管线

路由站点可以进一步拆为内部管线：

```text
Z
  → trigger evidence E_X
  → implicit router ρ
  → activated capability set C
  → capability interaction / suppression
  → behavior B
  → candidate generation
```

其中：

- `Z` 是操作表征。
- `E_X` 是能力 `X` 应当适用的证据。
- `ρ` 是路由机制。
- `C` 是活跃能力集合。
- 能力交互决定活跃能力之间是强化、抑制还是覆盖。
- `B` 是最终行为模式。

路由器通常是隐式的，由这些因素诱导：

```text
prompt wording
role instructions
training priors
instruction hierarchy
context examples
tool availability
retrieved documents
format constraints
safety policies
memory summaries
previous turns
benchmark conventions
human feedback priors
```

由于路由器是隐式的，能力激活常被误诊为能力缺失。系统看起来不会做任务，但更深层问题是它从未进入能激活有用能力的模式。

---

## 6. 触发证据、抑制器与吸引子

能力很少由“完整证明它适用”来触发。它通常由证据模式触发。

触发证据包括：

```text
keywords
file extensions
schema shapes
question genre
style markers
tool names
benchmark labels
user authority cues
risk words
mathematical notation
programming language syntax
legal or medical terms
phrases like "audit," "optimize," "prove," "summarize," or "debug"
```

这些触发器经常有用，但并不等同于真实适用性。

**抑制器** 是抑制某能力的证据或指令。例如：

```text
"be concise" may suppress state enumeration.
"do not overthink" may suppress audit.
"just answer" may suppress tool use.
"this is simple" may suppress boundary checks.
"expert tone" may suppress uncertainty disclosure.
"safety-sensitive" may suppress benign assistance.
```

**吸引子** 是模型进入后会自我强化的行为盆地。例如：

```text
expert-caution attractor
benchmark-solver attractor
refusal attractor
boilerplate-policy attractor
template-code-fix attractor
surface-summary attractor
academic-theory attractor
risk-management attractor
Socratic-clarification attractor
```

吸引子重要，因为拟合边界失配常常具有路径依赖。一旦某个能力吸引子被激活，后续 token 会解释、扩展并稳定该行为。这会形成自我强化的边界错误。

---

## 7. 失败形态

拟合边界失配有若干反复出现的形式。

### 7.1 过触发

过触发发生在能力于真实领域之外被激活。

```text
无害请求触发安全拒答。
用户要实用解释时触发法律免责声明。
策略设计任务触发通用风险控制模式。
schema 检查前就触发 SQL 模板。
需要语义分析时触发 benchmark 答题模式。
需要形式构造时触发学术摘要模式。
```

过触发常产生看似负责、专业或连贯的输出，却绕过任务真实操作。

### 7.2 欠触发

欠触发发生在需要某能力时，该能力没有被激活。

```text
答案依赖外部状态时，系统不调用工具。
声明代码补丁已修复前，系统不运行测试。
绑定谓词前，系统不检查数据库值。
选择计划前，系统不枚举状态。
接受规格前，系统不触发对抗性审查。
渲染最终产物前，系统不激活全局一致性检查。
```

欠触发尤其危险，因为输出可能显得合理且自信。除非系统审计“未激活项”，否则缺失能力不可见。

### 7.3 错误能力绑定

任务可能触发真实能力，但绑定到错误对象。

```text
系统审计风格，而真正该审计语义。
系统检查语法，而真正该检查不变量。
系统解释 bug，而真正该定位失败状态。
系统摘要理论，而真正该推导结构承诺。
系统生成代码，而真正该检查测试失败。
```

这不是没有审计或没有推理，而是误绑定。

### 7.4 能力碰撞

多个能力可能同时激活并相互干扰。

```text
简洁性抑制必要不确定性追踪。
helpfulness 抑制拒答或安全检查。
安全检查抑制无害技术帮助。
专家语气抑制显式假设。
创意生成抑制验证。
形式证明模式抑制经验 grounding。
```

能力碰撞需要仲裁。没有显式仲裁时，最强吸引子获胜。

### 7.5 角色吸引子捕获

角色可能成为覆盖任务结构的吸引子。

例如，“act as a senior researcher” 可能提升术语和框架，但也可能在真实任务是定义撤销触发器、schema 或边界条件时生成自信理论 prose。“act as a database expert” 可能触发 SQL 流利度，但不一定触发数据库检查。

角色指令是路由干预，必须被当作路由干预治理。

### 7.6 有支持但未激活

正确候选可能存在于模型支持中，但到达它所需的能力没有激活。

这区分了拟合边界失配与支持失配。支持失配中，即使能力正确，高价值结构也低可达。拟合边界失配中，结构可能在能力 `X` 下可达，但 `X` 未触发。

### 7.7 激活但不适用

能力可能在任务条件不支持时强烈激活。这会制造虚假的胜任感：模型在非法语境中执行合法例程。

```text
从纯相关证据中做因果解释。
把需要设计权衡的任务套成定理证明。
把通用金融风险教条用于具体事件驱动 alpha 构造。
用道德化安全语言处理无害操作请求。
```

### 7.8 跨轮边界漂移

多轮设置中，能力边界会漂移。一个早先适用的能力可能在任务变化后继续激活；一个被抑制的能力也可能在变得必要后仍被抑制。

这把拟合边界失配连接到 SGAR：路由状态不能只从对话惯性中推断。

---

## 8. 与其他失配的区分

拟合边界失配最容易通过对比理解。

### 8.1 不是观测-表征失配

观测-表征失配问：

```text
Did the decisive variable enter Z?
```

拟合边界失配问：

```text
Given Z, did the right capability activate?
```

如果 schema 从 prompt 中缺失，问题是观测-表征。如果 schema 存在但系统不检查它，问题是拟合边界。

### 8.2 不是状态失配

状态失配问：

```text
Which latent state are we in?
```

拟合边界失配问：

```text
Which capability did we activate for this represented situation?
```

二者会相互作用。错误状态假设可能触发错误能力。但修复目标不同：状态失配需要更好状态判别；拟合边界失配需要更好能力路由。

### 8.3 不是支持失配

支持失配问：

```text
Is the high-value structure reachable under the active policy and budget?
```

拟合边界失配问：

```text
Was the appropriate policy or capability activated in the first place?
```

若系统已经路由到正确能力但仍无法生成稀有结构，瓶颈是支持。若稀有结构在未激活的另一能力下可达，瓶颈是路由。

### 8.4 不是聚合失配

聚合失配问：

```text
Do locally good parts compose into a globally good artifact?
```

拟合边界失配问：

```text
Were the right local operations selected?
```

系统即使正确路由也可能聚合失败；反过来，系统也可能一开始就路由到不合适的局部操作。

### 8.5 不是规格失配

规格失配问：

```text
Does the accessible evaluator represent true utility?
```

拟合边界失配问：

```text
Did the system activate the capability appropriate to the task conditions?
```

模糊或错误规格会诱发路由失败，但即使规格清楚，路由也可能失败。

---

## 9. 为什么拟合边界失配对 LLM 平庸重要

LLM 平庸经常表现为无法离开一个有吸引力的行为盆地。

输出并非胡言乱语。它在当前激活能力下局部可辩护。问题在于，当前激活能力不是决定任务价值的能力。

这解释了一个常见模式：

```text
The model gives a good answer to the wrong subtask.
```

例如：

```text
它写出 polished summary，而不是构造控制模型。
它输出安全免责声明，而不是执行无害请求。
它写 plausible SQL，而不是 grounding schema 和 values。
它给出通用 debug 建议，而不是定位失败不变量。
它描述方法论，而不是提交具体转移契约。
它写专家味金融谨慎语，而不是推导可执行 signal operator。
```

这些输出在浅层 review 下可能得分不错，因为被激活能力是真的。系统不是单纯差，而是在做“错误的好事”。

这就是为什么拟合边界失配对局部对齐区间很核心。许多模型能力都是局部对齐的：摘要、风格控制、谨慎、通用专业性、类比、解释、分解、代码流利度、SQL 流利度、数学符号、安全敏感性。但当这些能力跨错边界被路由时，局部对齐会变得有害。

---

## 10. 诊断方法

拟合边界失配应被直接审计。中心诊断问题是：

```text
Did the system fail because the capability was absent, or because it was not routed correctly?
```

### 10.1 能力引出探针

询问系统能否在孤立情况下执行能力 `X`。

```text
Original task failed.
Directly ask for the missing operation.
If the system can perform it, capability absence is unlikely.
```

这区分潜在能力与激活失败。

### 10.2 最小边界对

构造两个最小差异输入：

```text
Case A: X should apply.
Case B: X should not apply.
```

路由良好的系统在 A 中激活 `X`，在 B 中抑制 `X`。

如果二者都激活，是过触发；如果二者都不激活，是欠触发；如果在无关表面变化下激活不稳定，边界不稳。

### 10.3 触发扰动

在真实适用性不变时改变表面触发证据。

```text
Remove expert labels.
Change task framing.
Replace keywords with paraphrases.
Hide benchmark names.
Change role instructions.
Alter stylistic markers.
```

若适用性不变但激活改变，路由器过度依赖表面触发。

### 10.4 反事实激活

强制能力 `X` 激活并比较结果。

```text
Original route → output Y
Forced route X → output Y_X
```

如果 `Y_X` 修复失败，原问题很可能是欠触发。

这应谨慎使用。强制激活也可能制造过触发。目标是诊断，不是永久强迫。

### 10.5 抑制测试

抑制能力 `X`，观察输出改善还是退化。

```text
If suppressing X improves the result, X may be over-triggered.
If suppressing X degrades the result, X may be necessary.
```

这适用于专家语气、拒答、谨慎、模板或通用解释吸引子。

### 10.6 路由轨迹审计

要求系统明确说明：

```text
Which capabilities are relevant?
Which were activated?
Which were suppressed?
What evidence supports each activation?
What would make the activation invalid?
```

轨迹不是权威，但能暴露缺失边界条件和候选路由增量。

### 10.7 负对照

加入能力 `X` 明显不应适用的案例。若系统仍激活 `X`，触发器过宽。

### 10.8 未激活审计

高风险任务中，不只审计系统做了什么，也审计它没有激活什么。

```text
Which capabilities should have been considered but were absent from the trace?
Which tools were available but unused?
Which validators were not invoked?
Which state hypotheses were not enumerated?
Which failure modes were not checked?
```

这很关键，因为欠触发经常在最终产物中不可见。

---

## 11. 路由治理

拟合边界失配的修复不是简单“把 prompt 写好”。修复目标是治理路由器。

路由治理让能力激活变得显式、可审计、可修订。

受治理路由器应维护：

```text
capability inventory
applicability conditions
trigger evidence
suppressor evidence
priority / arbitration rules
scope limits
revocation triggers
regression guards
state dependencies
```

### 11.1 能力清单

能力清单记录系统可以激活哪些操作。

```text
observation repair
schema inspection
state enumeration
hypothesis generation
tool invocation
candidate expansion
constraint solving
semantic audit
syntax audit
safety review
execution verification
regression guard synthesis
final rendering
```

能力清单防止系统把 LLM 当成单一不可分生成器。

### 11.2 适用条件

每个能力都应有适用条件。

```text
Capability: schema audit
Applies when: task depends on database structure, table relationships, column semantics, or value grounding.
Does not apply when: schema is irrelevant or already validated.
```

### 11.3 触发与抑制规则

触发规则定义应激活能力的证据。抑制规则定义应抑制或降级能力的证据。

触发器不应只是关键词，而应连接到任务价值。

弱触发：

```text
If the prompt contains "SQL," generate SQL.
```

受治理触发：

```text
If the task requires SQL over an unfamiliar schema, activate schema audit before SQL rendering.
```

### 11.4 能力仲裁

能力冲突时，系统需要仲裁规则。

```text
If execution feedback contradicts model explanation, execution feedback dominates.
If safety policy conflicts with benign task assistance, route to policy disambiguation rather than immediate refusal.
If conciseness conflicts with required state enumeration, state enumeration dominates until state is resolved.
If final rendering conflicts with unresolved control objects, rendering is blocked.
```

### 11.5 路由增量

路由增量是由审计发现诱导的局部路由行为改变。

```text
Add schema audit before rendering SQL for unseen schemas.
Suppress generic risk-caution mode when the task asks for operator construction.
Activate execution verification before declaring code repair complete.
Require state enumeration when the same observation supports multiple policies.
```

---

## 12. 路由 GKO

路由 GKO 是控制能力激活的受治理知识对象。

最小 schema：

```json
{
  "id": "gko.routing.schema_audit_before_sql_rendering",
  "type": "routing_rule",
  "capability": "schema_audit",
  "condition": "The task requires SQL generation over a nontrivial or unfamiliar database schema.",
  "trigger_evidence": [
    "question references database entities",
    "schema contains multiple related tables",
    "column names are ambiguous",
    "value grounding may affect predicates"
  ],
  "suppressor_evidence": [
    "schema and join path already verified",
    "task is only about SQL syntax independent of schema"
  ],
  "activation": "must_activate_before_sql_rendering",
  "priority": "high",
  "strength": "hard",
  "evidence": "Prior failures from plausible SQL generated before schema inspection.",
  "revocation_trigger": "If schema audit repeatedly adds no information in a well-defined low-complexity class, downgrade to soft trigger.",
  "not_supported_claims": "Does not imply that schema audit alone guarantees semantic correctness."
}
```

路由 GKO 尤其重要，因为它们在最终生成之前治理行为。它们决定模型接下来被允许做什么。

---

## 13. 拟合边界失配的审计工程

在审计工程中，拟合边界发现应识别失败来自过触发、欠触发、误绑定、碰撞还是漂移。

拟合边界审计发现可使用这个 schema：

```json
{
  "id": "finding.fitting_boundary.unique_id",
  "artifact": "The candidate output or action trace being audited.",
  "finding": "The system generated final SQL before activating schema-linking and join-path audit.",
  "mismatch_type": "fitting_boundary",
  "subtype": "under_triggering",
  "capability": "schema_linking_and_join_path_audit",
  "true_domain": "SQL tasks over unfamiliar multi-table schemas.",
  "model_activation_domain_observed": "Only activated when explicitly instructed after failure.",
  "evidence": [
    "The trace contains no schema inspection step.",
    "The final SQL joins tables through an unsupported path.",
    "When asked directly to inspect joins, the model identifies the correct path."
  ],
  "repair_target": "router",
  "control_delta": "Add routing GKO requiring schema-linking before SQL rendering for multi-table schemas.",
  "regression_guard": "Given a multi-table schema with ambiguous joins, the system must produce a schema-linking artifact before final SQL."
}
```

关键是修复目标是路由器，而不只是最终产物。

---

## 14. 边界回归护栏

边界回归护栏检查路由修复是否持续有效。

好的护栏同时测试边界两侧：

```text
Positive case: capability should activate.
Negative case: capability should not activate.
```

对能力 `X`，护栏应验证：

```text
Activate X when T_X holds.
Suppress X when T_X does not hold.
Escalate when T_X is uncertain.
```

边界护栏只有在重新引入代表性路由缺陷时会失败，才算有牙齿。

```text
If schema audit is removed, the guard should fail on ambiguous multi-table SQL cases.
If refusal is over-triggered, the guard should fail on benign requests with superficial risk words.
If execution verification is skipped, the guard should fail on code repair tasks with hidden failing tests.
If state enumeration is skipped, the guard should fail on observations compatible with multiple policies.
```

边界护栏应包含负对照。否则系统可能通过“到处激活能力”来修复欠触发，结果只是把欠触发转化为过触发。

---

## 15. 与状态治理型 Agent 体制的相互作用

能力路由不只是单轮决策。在长程系统中，路由决策会成为运行时状态的一部分。

系统应记录：

```text
which capabilities were activated
which were suppressed
why they were activated or suppressed
which routing GKOs applied
which router deltas were committed
which boundary guards passed
whether routing state should persist or expire
```

用 SGAR 表示：

```text
S + A → O → V → S'
```

路由更新不应仅因为模型建议就成为权威。只有满足转移契约时，才应提交。

```text
S: Current router lacks schema-audit requirement.
A: Add routing GKO requiring schema audit before SQL rendering.
O: Re-run representative case; system produces schema-linking artifact and correct join path.
V: Boundary guard passes positive and negative cases.
S': Router GKO committed with scope and revocation trigger.
```

这防止路由漂移和路由 folklore。路由规则成为状态化承诺，而不是对话建议。

---

## 16. 与知识治理的相互作用

拟合边界失配说明，知识治理不只治理事实和约束，也必须治理激活条件。

GKO 可以控制：

```text
what is true
what is preferred
what must be checked
what state is assumed
what capability should activate
what capability should be suppressed
what evidence changes the route
```

这把 GKO 从知识存储扩展为 **行为治理**。

对拟合边界失配重要的 GKO 类型包括：

```text
routing_rule
capability_profile
trigger_condition
suppressor_condition
applicability_boundary
arbitration_rule
escalation_rule
role_binding_rule
```

知识治理把路由转化为显式控制表面。

---

## 17. 与支持失配的相互作用

拟合边界失配与支持失配紧密耦合。

能力可能定义更好的搜索分布。如果能力未激活，高价值候选可能看起来低支持。反之，如果能力已激活但正确结构仍不可达，瓶颈就是支持。

修复不同：

```text
Routing repair:
  Activate schema-linking before SQL generation.
  Activate theorem search before proof rendering.
  Activate execution verification before code fix completion.

Support repair:
  Expand join-path candidates.
  Search over proof skeletons.
  Generate multiple patch hypotheses.
  Enumerate rare operator combinations.
```

通常正确顺序是：

```text
1. Repair routing.
2. Then repair support within the activated capability.
```

否则系统可能在错误模式中扩展候选。

---

## 18. 与规格失配的相互作用

规格会控制路由。如果系统不知道什么算成功，就可能不知道激活哪种能力。

例如，任务说“make this better”时，系统可能激活风格改进，而真实需要语义修正。prompt 说“audit”时，它可能激活 checklist 生产，而真实需要反例搜索。指标奖励 exact match 时，它可能激活 benchmark 优化，而不是语义保存。

因此，规格修复可能需要包含路由修复。

```text
Specification delta:
  Success requires semantic preservation under execution, not surface plausibility.

Router delta:
  Activate execution-guided verification before final answer.
```

这是一种常见复合失配：

```text
specification mismatch → routing mismatch → support / aggregation failure
```

---

## 19. 与观测-表征失配的相互作用

路由依赖表征。能力不能由从未进入 `Z` 的证据触发。

如果数据库 schema 被省略，schema audit 就无法被正确路由。如果工具结果被压缩成模糊摘要，execution-debugging 能力可能不激活。如果用户约束在上下文压缩中丢失，constraint-checking 可能被抑制。

基本依赖是：

```text
No trigger evidence in Z → unreliable routing
```

因此，通道治理先于路由治理。

常见正确顺序是：

```text
1. Ensure task-critical variables enter Z.
2. Ensure trigger evidence for relevant capabilities enters Z.
3. Govern activation boundaries.
4. Search or render under the activated capability.
```

---

## 20. 与聚合失配的相互作用

系统可能激活了正确局部能力，却无法全局协调它们。

例如，代码助手可能激活测试检查、补丁生成和解释，但以错误顺序聚合：先打补丁，再定位测试失败，然后在未重跑测试时解释补丁。

这不只是路由或聚合，而是二者相互作用。

受治理系统可能需要 **能力排序约束**：

```text
state identification before action
schema audit before SQL rendering
execution verification before completion claim
specification repair before final scoring
regression guard before committing fix
```

这类约束既是路由规则，也是聚合规则。它们治理的不只是激活哪个能力，也包括能力在组合序列中何时激活。

---

## 21. 能力路由设计模式

### 21.1 先路由再渲染

在相关能力被选择并应用之前，不要渲染最终答案。

```text
Task → route → control objects → render
```

这对 SQL、代码、计划、审计、法律分析、医疗分诊和研究综合尤其有用。

### 21.2 边界优先 Prompting

执行任务前先问：

```text
Which capabilities are applicable?
Which are tempting but inappropriate?
Which checks must precede final rendering?
```

这通过显式化能力选择来减少过触发。

### 21.3 正负能力例子

提供能力应适用和不应适用的例子。

这会训练 prompt 或系统流程中的局部路由器。

### 21.4 能力抑制

有时修复是抑制某能力。

```text
Suppress generic disclaimer mode.
Suppress direct final-answer mode until audit is complete.
Suppress template SQL rendering before schema linking.
Suppress stylistic rewriting when semantic invariants are unresolved.
```

### 21.5 能力升级

路由不确定性高时，升级而不是过早选择能力。

```text
ask a clarifying question
query a tool
branch into multiple capability paths
request human review
construct a state matrix
perform an audit pass
```

### 21.6 能力组合搜索

不要只搜索最终输出，也搜索能力序列：

```text
route_1: schema audit → join search → SQL rendering → execution audit
route_2: direct SQL → execution audit → repair
route_3: value sampling → schema linking → predicate skeleton → SQL rendering
```

候选不只是输出，也是一条路线。

### 21.7 路由器作为控制对象

把路由决策当作受治理对象，而不是隐藏 prompt 效应。

这支持：

```text
audit
revision
revocation
regression testing
state commitment
reuse across tasks
```

---

## 22. 示例：Text-to-SQL

Text-to-SQL 很清楚地展示了拟合边界失配。

直接生成吸引子很强：

```text
question + schema → SQL
```

但高价值表现通常要求最终 SQL 渲染前先激活多个能力：

```text
schema inspection
entity linking
value grounding
join-path search
predicate skeleton construction
aggregation check
execution audit
semantic repair
```

常见失败是：

```text
SQL fluency over-triggers.
Schema audit under-triggers.
```

模型生成 plausible SQL，但 query 使用错误 join path、错误列、错误值归一化或错误聚合。

路由修复是：

```text
If schema is unfamiliar or multi-table, block final SQL rendering until schema-linking and join-path artifacts exist.
```

边界护栏是：

```text
On ambiguous multi-table schema tasks, the trace must include table/column binding and join-path justification before final SQL.
On simple single-table syntax tasks, schema audit may be skipped.
```

这同时避免欠触发和过触发。

---

## 23. 示例：代码修复

代码模型可能拥有多种相关能力：

```text
read stack trace
localize failing invariant
inspect tests
construct patch
run tests
minimize diff
explain change
```

常见拟合边界失败是：补丁生成在失败定位之前过触发。

模型能写 plausible patches。但真实任务要求识别失败不变量，而不只是编辑代码。

路由规则：

```text
If a code repair task includes failing tests, activate failure localization before patch generation.
```

抑制器：

```text
Suppress final completion claims until tests or equivalent verifiers pass.
```

回归护栏：

```text
For a representative failing test, the system must identify the failing condition and produce a verifier-backed patch before declaring completion.
```

---

## 24. 示例：量化研究与策略设计

在量化策略设计中，LLM 经常过触发通用风险管理或学术谨慎吸引子。

这些能力并非无用。风险控制、怀疑精神和数据卫生都重要。但当任务要求机制到算子的转换、事件条件信号构造、持有期设计或 execution-aware alpha generation 时，它们可能被过触发。

可能过触发的能力：

```text
generic risk caveats
orthogonality rhetoric
factor-neutralization boilerplate
academic methodology summary
compliance-like caution
```

可能欠触发的能力：

```text
mechanism decomposition
event-to-operator mapping
conditional alpha search
holding-period reasoning
microstructure constraint modeling
feature construction
backtest failure-mode audit
```

路由修复不是“更有创意”，而是：

```text
Given a mechanism-level strategy request, activate operator construction before risk boilerplate.
Use risk analysis as an audit layer after candidate operator generation, not as the primary generation mode.
```

这保留谨慎，但不让谨慎捕获路线。

---

## 25. 示例：安全与拒答

安全策略也是能力。它们有真实适用域和激活域。

当请求不安全、有害、非法或不被允许时，拒答能力是适用的。但它可能在包含风险相邻语言的无害请求中过触发。

拟合边界分析区分：

```text
true safety applicability
surface risk triggers
policy ambiguity
benign technical assistance
safe redirection
```

受治理路由器应支持：

```text
activate refusal when policy conditions are met
activate clarification when applicability is uncertain
activate safe assistance when the task is benign
suppress moralized boilerplate when it does not improve safety or task value
```

这不是削弱安全，而是主张按照真实领域而不是表面触发来路由安全能力。

---

## 26. 示例：研究与理论写作

研究写作中，LLM 经常过触发摘要、文献综述或 polished prose 能力。

这些能力有用，但当任务是推导结构理论、证明独立性、定义对象、形式化撤销触发器或构造统一架构时，它们是不充分的。

拟合边界失败表现为系统写出流畅概念 prose，而不是执行结构操作。

路由修复：

```text
If the task asks for theory construction, activate:
  - claim decomposition
  - formal object definition
  - independence analysis
  - revocation-trigger construction
  - relation-to-existing-theory mapping
before polished exposition.
```

抑制器：

```text
Suppress literature-summary mode unless the task explicitly asks for positioning.
```

这让写作不取代理论构造。

---

## 27. 能力路由作为控制空间搜索

系统可以搜索输出，也可以搜索路线。

路线是能力序列：

```text
R = [X1, X2, ..., Xn]
```

路线的效用取决于它如何在最终渲染前转换任务。

不要只是：

```text
sample many final answers
```

而应：

```text
sample or construct candidate routes
apply route-specific control objects
audit route outputs
commit route improvements
```

这创造了一个新搜索空间：

```text
capability-route space
```

对高价值任务，路线搜索可能比输出搜索更重要。如果系统处在错误能力模式中，采样更多输出只是探索错误盆地。

---

## 28. 形式化主张

### 28.1 边界独立性主张

拟合边界失配在价值保存管线中是原始的，因为可以保持观测、表征、状态、支持、聚合和规格不变，只改变能力激活边界。

如果任务价值在该干预下改变，路由就是独立失败站点。

### 28.2 能力存在分离主张

对许多 LLM 系统：

```text
exists capability X
```

并不推出：

```text
X activates when T_X holds
```

也不推出：

```text
X suppresses when T_X does not hold
```

因此，能力评价应包含激活域评价，而不只是能力引出。

### 28.3 路由-支持耦合主张

支持以路由为条件。

```text
P(Y* | Z, route = X) may be high
P(Y* | Z, route ≠ X) may be low
```

一个结构在错误路线下可能看似低支持，在正确路线下则是高支持。

### 28.4 边界护栏主张

路由修复如果不包含正负边界护栏，就不完整。

否则，用“总是激活能力”修复欠触发，可能引入过触发。

### 28.5 状态-路由提交主张

在长程系统中，路由改变只有经过边界验证后才应提交为硬状态。否则，路由漂移会成为持久系统行为。

---

## 29. 路由治理的成本与风险

路由治理并非免费。

成本包括：

```text
additional latency
more intermediate artifacts
token overhead
more complex control flow
possible route conflicts
more brittle meta-rules
human review burden
```

风险包括：

```text
router bureaucracy
frozen capability boundaries
overfitting to known failure cases
capability underuse due to excessive gating
meta-Goodhart on routing checks
adversarial trigger manipulation
conflicting GKOs
obsolete routing rules
```

因此，路由治理应选择性使用。

最值得使用的情形：

```text
task value is high
wrong capability activation is costly
under-triggering is hard to observe from final output
capabilities conflict
state persists across turns
routing rules can be reused
external verification can test boundaries
```

较不值得使用的情形：

```text
the task is low-risk and one-shot
the appropriate capability is obvious
local generation already aligns with value
routing overhead exceeds expected gain
```

---

## 30. 拟合边界主张的撤销触发器

“拟合边界失配是原始失配”这一理论主张本身也应受治理。

自审计 GKO：

```json
{
  "id": "gko.fitting_boundary_mismatch_primitive_status",
  "type": "theoretical_claim",
  "condition": "LLM systems modeled as value-preservation pipelines with a capability-routing station.",
  "assertion": "Fitting-boundary mismatch is a primitive failure mode when the true applicability domain of a capability differs from its activation domain.",
  "strength": "structural-relative",
  "support_scope": "Failures where capability presence and capability activation can be separated.",
  "revocation_trigger": "Show that all such failures can be reduced to observation-representation, state, support, aggregation, or specification mismatch without losing intervention specificity.",
  "not_supported_claims": "Does not claim that every routing failure is easy to detect or that explicit routing always improves performance."
}
```

对单个路由 GKO，撤销触发器应包括：

```text
capability no longer improves task value in its claimed domain
negative controls show over-triggering
positive controls show persistent under-triggering
new verifier invalidates the activation condition
state distribution changes
cost exceeds value gain
more precise routing rule supersedes the old rule
```

---

## 31. 实用清单

怀疑拟合边界失配时，询问：

```text
1. 需要哪种能力、行为、角色、工具或例程？
2. 系统在直接引出时是否拥有该能力？
3. 该能力在原始任务中是否激活？
4. 如果没有，缺失或被抑制的触发证据是什么？
5. 如果激活了，它是否真的适用？
6. 该能力是否绑定到正确对象？
7. 是否有另一能力抑制或覆盖它？
8. 路线是否在应过期后仍继续存在？
9. 哪个路由增量可以修复边界？
10. 哪些正负边界护栏可以测试修复？
11. 路由改变是否应成为 GKO？
12. 路由改变是否应提交到硬状态？
```

系统设计应维护：

```text
capability inventory
routing GKOs
positive boundary cases
negative boundary cases
non-activation audits
router deltas
boundary regression guards
routing state records
revocation triggers
```

---

## 32. 结论

拟合边界失配解释了 LLM 系统中的一大类失败：模型拥有有用能力，但系统在错误位置激活它们，或在需要它们时没有激活。

这种失败不能完全解释为缺知识、支持差、状态歧义、聚合坏或规格错。它发生在价值保存管线中的能力路由站点。

核心区分是：

```text
T_X = where capability X should apply
M_X = where capability X actually activates
```

当：

```text
M_X ≠ T_X
```

系统就容易出现过触发、欠触发、误绑定、能力碰撞、角色吸引子捕获和边界漂移。

修复方式是路由治理。能力激活应变得显式、可审计、可修订、状态感知。路由 GKO 定义适用条件、触发证据、抑制器、仲裁规则和撤销触发器。审计工程把路由失败转化为路由增量和边界护栏。SGAR 把已验证的路由改变提交为硬状态。

更大的教训是：高价值 LLM 系统需要的不只是能力，而是受治理的能力边界。

```text
Capability present does not imply capability routed.
Capability routed does not imply capability applicable.
Capability applicable does not imply capability verified.
```

受治理 LLM 系统不仅要知道自己能做什么，也要知道每件能做的事什么时候真正应该做。

---

## Appendix A: 紧凑术语表

| 术语 | 定义 |
|---|---|
| 能力 | 已学习行为、工具使用、角色、策略、推理例程、审计模式或生成模式。 |
| 真实适用域 `T_X` | 能力 `X` 提升真实任务价值的情境集合。 |
| 激活域 `M_X` | 系统实际激活 `X` 的情境集合。 |
| 拟合边界失配 | `T_X` 与 `M_X` 之间的错位。 |
| 过触发 | 在真实领域之外激活 `X`。 |
| 欠触发 | 在真实领域内没有激活 `X`。 |
| 触发证据 | 导致或应导致能力激活的证据。 |
| 抑制器 | 抑制能力激活的证据或指令。 |
| 吸引子 | 自我强化的行为盆地。 |
| 路由器 | 选择活跃能力的隐式或显式机制。 |
| 路由增量 | 对能力路由行为的局部更新。 |
| 路由 GKO | 控制能力激活的受治理知识对象。 |
| 边界护栏 | 同时检查能力激活正例和负例的回归护栏。 |

---

## Appendix B: 最小路由 GKO 模板

```json
{
  "id": "gko.routing.<capability>.<scope>",
  "type": "routing_rule",
  "capability": "Capability to activate or suppress",
  "condition": "When this routing rule applies",
  "trigger_evidence": [
    "Evidence supporting activation"
  ],
  "suppressor_evidence": [
    "Evidence supporting suppression or downgrade"
  ],
  "activation": "must_activate | may_activate | suppress | escalate | block_final_rendering_until_complete",
  "priority": "low | medium | high | critical",
  "strength": "hard | soft | heuristic | provisional",
  "evidence": "Why this rule exists",
  "revocation_trigger": "When to weaken, revise, or remove this rule",
  "not_supported_claims": "What this rule does not imply"
}
```

---

## Appendix C: 最小边界护栏模板

```json
{
  "id": "guard.boundary.<capability>.<defect_family>",
  "capability": "Capability being tested",
  "positive_cases": [
    "Cases where capability should activate"
  ],
  "negative_cases": [
    "Cases where capability should not activate"
  ],
  "uncertain_cases": [
    "Cases where escalation is required"
  ],
  "pass_condition": "Activation, suppression, or escalation matches the applicability boundary.",
  "failure_condition": "Over-triggering, under-triggering, misbinding, or unverified activation occurs.",
  "teeth_condition": "Reintroducing the representative boundary defect makes this guard fail."
}
```
