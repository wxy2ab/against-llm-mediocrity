# Oracle、Audit Agent 与 SGAR：从硬反馈到引擎路由的统一框架

**Oracle 分类、边界保真度与引擎路由**  
**工作稿 v0.1**  

---

## 概览

本文主张：对一个自我改进的系统来说，关键问题不是“要不要做 audit agent”，而是“某个任务暴露了什么样的 oracle”，进而决定应该路由到哪种修复引擎。文章给出三种引擎（Audit、SGAR、No-Go），一套 fidelity source（保真度来源）分类，一套按 oracle 质量把任务分成 A/B/C 三层的方法，以及这套框架对 ccx 系统的架构含义。全文反复出现两个角色：一是 audit agent，它用识别去定位失败的原因；二是 状态治理智能体范式（State-Governed Agent Regime / SGAR），它只把识别当作对候选的“过/不过”关卡。

## 目录

- [0. 一句话结论](#0-一句话结论)
- [1. 背景问题](#1-背景问题)
- [2. 核心机制：audit 是 failure-conditioned oracle exploitation](#2-核心机制audit-是-failure-conditioned-oracle-exploitation)
- [3. 关键判据：oracle 的成本、带宽、保真度](#3-关键判据oracle-的成本带宽保真度)
- [4. 重要纠正：文本不是 taste，文本逻辑审计是甜点区](#4-重要纠正文本不是-taste文本逻辑审计是甜点区)
- [5. Fidelity source taxonomy：任务可审计性来自哪里](#5-fidelity-source-taxonomy任务可审计性来自哪里)
- [6. 任务分层：A / B / C](#6-任务分层a--b--c)
- [7. Audit 与 SGAR：同一不对称的两种引擎](#7-audit-与-sgar同一不对称的两种引擎)
- [8. 三引擎地图：Audit / SGAR / No-Go](#8-三引擎地图audit--sgar--no-go)
- [9. 对 ccx 的架构含义](#9-对-ccx-的架构含义)
- [10. 不同任务的落地策略](#10-不同任务的落地策略)
- [11. 实验与度量](#11-实验与度量)
- [12. 最终原则](#12-最终原则)
- [13. 最终压缩版](#13-最终压缩版)

---

## 0. 一句话结论

真正重要的不是“要不要做 audit agent”，而是：

> **面对一个失败或目标，系统首先要识别自己手里有什么 oracle。**
>
> 有高带宽、高保真的定位 oracle，就走 audit；只有高保真的边界 gate，就走 SGAR；边界低保真，就先硬化 gate；两者都没有，就诚实 No-Go，去获取新的 fidelity source。

Audit agent 和 SGAR 不是彼此替代的机制，而是同一个底层资源——**生成-识别不对称**——的两种不同榨取方式：

- **Audit** 用识别来定位原因：需要高带宽、高保真的“为什么错”。
- **SGAR** 用识别来把关候选：不需要知道为什么，只需要高保真的“过/不过”。

因此，ccx 未来不应只建设一个“审计 agent”，而应建设一个更上层的 **oracle classification / engine routing** 能力。

---

## 1. 背景问题

最初的问题来自 text2sql：builder agent 已经看过 schema、column sample、column stat、column description，也尝试过类似 audit agent 的分析，但仍然很容易失败。反过来，让一个 audit agent 在失败之后审计已有 SQL，效果却明显变好。

这个现象令人困惑。因为从静态信息看，builder 与 auditor 拿到的信息几乎一样。关键问题是：

> **audit agent 到底多了什么？这个机制能否泛化到 text2sql 之外？**

经过讨论，最有价值的答案是：

> auditor 不一定拥有更多先验信息；它拥有的是失败之后暴露出来的 witness / oracle，以及一个诊断式任务框架。

builder 面对的是开环生成问题：

```text
spec / intent / priors -> candidate artifact
```

auditor 面对的是 failure-conditioned diagnosis：

```text
spec / intent / priors + failed candidate + failure witness + tools -> diagnosis / evidence / corrective requirement
```

两者的输入表面相似，但问题结构完全不同。

---

## 2. 核心机制：audit 是 failure-conditioned oracle exploitation

### 2.1 Builder 是开环合取生成

builder 要一次性满足一组合取条件。以 text2sql 为例，它必须同时选对：

- 表；
- join path；
- join key；
- filter；
- aggregation；
- grouping grain；
- 时间边界；
- entity disambiguation；
- NULL / duplicate / cardinality 处理。

其中任意一项错，最终答案都错。builder 在生成时通常没有一个清晰的可对照 witness，因此只能依靠 priors 与内部自洽。

### 2.2 Auditor 是有靶子的存在式诊断

失败之后，auditor 的问题变成：

> 已知这个 artifact 错了，找出哪个局部约束被违反，并给出可复核证据。

这不是“再生成一遍”，而是：

```text
hypothesis -> probe/check -> evidence -> refine -> corrective requirement
```

也就是说，audit 的价值不来自“更聪明”，而来自 **任务状态改变**：失败暴露了 witness，使得系统可以闭环查询 oracle。

### 2.3 这解释了 text2sql 的“神奇”

text2sql 是 audit 的强样本，因为它同时具备：

| 条件 | text2sql 中的体现 |
|---|---|
| 查询成本低 | SQL / CTE / probe query 可以反复执行 |
| 带宽高 | rows、counts、join cardinality、gold diff、中间 CTE 都能提供定位信号 |
| 保真度中高 | 有 gold 时很高；无 gold 时，也可由 question intent + rows 构造中保真 oracle |
| failure witness 明确 | 已知候选 SQL 错，audit 可以围绕这个错做闭环诊断 |

所以 text2sql 的 audit agent 不是因为“更会读 schema”，而是因为它拿到了 builder 生成时没有的失败靶子。

---

## 3. 关键判据：oracle 的成本、带宽、保真度

一个任务是否适合 audit，不应按任务名称判断，而应按 oracle 判断。

### 3.1 三个维度

| 维度 | 问题 | 高值意味着什么 |
|---|---|---|
| 成本 | 查询一次 oracle 贵不贵？ | 可以多轮 probe，不怕迭代 |
| 带宽 | oracle 给多少定位信息？ | 不只是 fail，而是告诉你可能错在哪里 |
| 保真度 | oracle 是否接近 truth？ | 不是 proxy story，而是可复现/可重算/可复核 |

可以把 audit 价值粗略写成：

```text
Audit value ≈ fidelity_source_strength
            × evidence_bandwidth
            × low_query_cost
            × diagnosis_to_repair_closeness
            × independence_from_builder_context
            - anchoring_harm
            - audit_cost
```

### 3.2 Hard evidence 的定义

Hard evidence 不是 agent 说得有多自信，而是：

> 第三方能重新运行、重新计算、重新观察，得到同样事实。

不同任务的 hard evidence 形式不同：

| 任务 | hard evidence 示例 |
|---|---|
| 编译 / 类型 / runtime | stack trace、file:line、deterministic failing command |
| 单测 | failing nodeid、minimal repro、assertion diff |
| text2sql | gold rows vs predicted rows diff、join cardinality、CTE 中间结果 |
| 文本逻辑 | claim span 与 contradiction span、missing support、non sequitur 的可复核定位 |
| quant / ML | per-slice metric、ablation、cost attribution、leakage check、train/test contamination check |

注意：文本逻辑中的 hard 通常是 **human-reviewable hard / inspectable hard**，不总是 deterministic hard。它可以非常有价值，但不应与 proof checker / unit test 级别的机械 hard 混为一谈。

---

## 4. 重要纠正：文本不是 taste，文本逻辑审计是甜点区

之前一个错误建模是把“文本任务”塌缩成 taste / 风格偏好。这是不对的。

文本任务至少应拆成两类：

| 文本类型 | audit 属性 |
|---|---|
| 逻辑、论证、claim、spec、报告、设计文档、研究总结 | 高价值，可局部 hard |
| 诗歌、品牌调性、审美、纯创意偏好 | soft，更多依赖 taste / judge |

对 claim、insight、spec、design doc 这类文本，oracle 的保真度来源不是外部 gold，而是 artifact 内部的逻辑/一致性结构。

常见可审计对象包括：

- claim 是否有 evidence 支撑；
- evidence 是否真的支持 claim；
- 前后定义是否一致；
- 第 3 段与第 5 段是否冲突；
- 结论是否由前提推出；
- 是否偷换概念；
- 是否把 proxy 写成 truth；
- 是否把 speculation 写成 fact；
- 是否遗漏关键反例或限定条件。

### 4.1 为什么文本里的 audit 特别自然

文本逻辑任务中，生成-验证不对称非常大：

- 写出一篇同时满足连贯、有据、不自相矛盾、论点蕴含结论的论证，是合取式生成问题。
- 找出一个 unsupported claim、一个 contradiction、一个 missing premise，则是局部存在式诊断。

这正是同行评审、编辑、proofreading 比原创写作更稳定的原因。

### 4.2 文本中的“诊断≈药方”

文本审计里，很多 flaw 的 repair operator 很直接：

| flaw | repair operator |
|---|---|
| claim 无据 | 补 evidence，或者降级/删除 claim |
| self-contradiction | 调和、加 scope、删除一方 |
| 推理断裂 | 补 missing premise |
| 术语漂移 | 统一定义，或显式区分两个概念 |
| 结论过强 | 收窄结论，加入 uncertainty |
| evidence 不支持 claim | 换 evidence，或改写 claim |
| 粒度错位 | 重写 comparison frame |

这使得文本逻辑审计在“diagnosis to repair closeness”这一轴上甚至比 text2sql 更干净。

边界是：文本逻辑审计强，不代表文本 taste 也强；human-reviewable hard 不等于 deterministic hard。

---

## 5. Fidelity source taxonomy：任务可审计性来自哪里

比“任务类型分类”更好的框架是：这个任务里能调用哪种 fidelity source。

| # | Fidelity source | 性质 | 示例 |
|---|---|---|---|
| 1 | 逻辑 / 一致性 | 内在、低成本、可定位 | 文本论证、claim、spec consistency |
| 2 | 形式检查器 | 机械 hard、高保真 | proof checker、type checker、SMT、schema、lint、contract check |
| 3 | 执行 vs 参照 | hard，但需要参照物 | tests、gold answer、expected output、SQL result diff |
| 4 | 守恒 / 不变量 | 藏在软任务里的硬核 | accounting identity、dimension、no-look-ahead、train/test split、cap constraints |
| 5 | 分解 / 反事实 | 买带宽，不买保真度 | per-slice、ablation、gross/net、IC decay、cost attribution |
| 6 | proxy judge | 低到中保真 | LLM-as-judge、human preference proxy、taste score |

最关键的一句话：

> **分解买带宽，不买保真度。**

把一个 IC 标量拆成 per-horizon IC、per-regime IC、turnover attribution，能让 auditor 更知道该往哪里看；但每个分量仍可能是 noisy、sample-dependent、non-causal 的。分解提升的是定位带宽，不自动提升 truth fidelity。

真正买保真度的是逻辑、一致性、形式检查、执行参照、不变量或新的独立证据。context diversity 可以引入这种证据，但只由改写构成的 context diversity 不会自动增加保真度。

### 5.1 Oracle 获取阶梯

Fidelity source taxonomy 和下面的 Tier ladder 回答不同问题。taxonomy 问“判断靠什么支撑”；ladder 问“系统需要降级到哪一层才能获得可用信号”。

| Tier | Oracle 构造方式 | 权威边界 |
|---|---|---|
| 0 | 环境提供的原生硬反馈 | 只对已编码性质和声明环境 hard |
| 1 | 构造的 hard sub-oracle | 构造后机械 hard；语义上仍局部，并需独立 teeth-proof |
| 2 | 完整候选条件化的 learned verifier | 为排序、定位和修复提供局部 proxy gradient；不是全局质量证书 |
| 3 | 对分解视角或论点运行的 context-conditioned 结构化 verifier | 在外部 truth 校准前，只是 coverage 与 robustness 机制 |

Tier 2 利用的是 **completion-induced observability**。完整候选把非局部关系暴露为 failure witness，使系统可以搜索 repair delta，并在局部 patch 停滞时扩大 repair radius。

Tier 3 不是普通重复采样。它构造条件分布混合：

```text
q_T3(y | x) = sum_i w_i p_theta(y | x, context_i, prompt_i, decomposition_i)
```

只有当 branch 改变了证据、表征、假设、反事实、工具、exemplar 或能力路由时，有效支持才可能扩大。如果每个 branch 只是同一 context 的改写，Tier 3 就是伪多样性。如果 context 引入独立证据，它可能增加 fidelity；如果只是重构现有材料，它主要增加 bandwidth、routing diversity 或 effective support。

---

## 6. 任务分层：A / B / C

### A 级：天然或局部硬 oracle，audit 直接可做

| 子类 | 示例 | 主要 fidelity source | 注意 |
|---|---|---|---|
| A1 deterministic hard | type check、unit test、SQL gold diff、schema validation | 形式检查器 / 执行参照 | 可进 trust root |
| A2 inspectable logical hard | 文本 claim、spec consistency、论证漏洞 | 逻辑 / 一致性 | 人类可复核强，但通常不进机械 trust root |
| A3 hidden invariant hard | no-look-ahead、leakage、accounting identity、weight cap | 不变量 | 常藏在 quant / ML / code 的软外壳里 |

### B 级：可造 oracle，中保真，是工程前沿

| 任务 | 默认 oracle | 可造增强 | 结果 |
|---|---|---|---|
| IC / IR / DSR / net Sharpe | 昂贵、带噪、低带宽标量 | per-horizon、per-regime、gross/net、turnover、cost sensitivity | 从软标量升级成高带宽剖面 |
| ML gate | accuracy/loss 标量 | per-class confusion、错例聚类、learning curve、ablation、data probe | 更可诊断，但仍有噪声 |
| weak-oracle code behavior | 通过/不通过但定位弱 | invariant check、trace、property test、contract check | 可局部硬化 |

B 级的原则是：

> 不要直接审“IC 为什么低”，要先审“有没有前视 / 成本归因是否一致 / 哪个 horizon 或 regime 失效 / gross alpha 是否被 cost 吃掉”。

外层目标可能软，但内部经常藏着可硬化的 sub-oracle。

### C 级：缺少廉价高保真 oracle，至多给先验

示例：

- 纯 taste / 美学；
- “这是不是一个好研究方向”；
- 长周期真实结果，如“明年能不能赚钱”“用户长期喜不喜欢”；
- 真 oracle 在未来，或者需要昂贵 RCT / 新数据源才能知道的任务。

C 级不是“多想一会儿”能解决的。诚实结论通常是：

> 当前没有可构造 oracle；需要新数据、新实验、新评估源，或者接受这只是软先验。

---

## 7. Audit 与 SGAR：同一不对称的两种引擎

最新讨论里最关键的提升是：audit 和 SGAR 不是一个宽、一个窄，而是在**带宽轴**上互补。

### 7.1 Audit 需要高带宽识别

Audit 要回答：

```text
错的是哪一个约束？为什么？证据在哪里？修复方向是什么？
```

因此它需要 oracle 给出方向/梯度：file:line、row diff、contradiction span、slice attribution、invariant violation。

如果 oracle 只给一个带噪标量，audit 就容易死掉，因为没有足够梯度可跟。

### 7.2 SGAR 只需要高保真边界

SGAR 不问“为什么失败”，只问：

```text
这个候选过不过 gate？
```

它对 WHY 的带宽需求接近零。因此，当反馈塌缩成一个标量时，audit 可能失效，但 SGAR 仍可能有效。

SGAR 的智能不在识别原因，而在：

- 生成多样候选；
- 管理种群；
- 保留过 gate 的状态；
- 用 ratchet 防止退步；
- 让随机游走变成单调逼近。

可以说：

```text
Audit = 聪明识别 + 定向修复
SGAR  = 笨识别(pass/fail) + 聪明生成/状态管理
```

### 7.3 SGAR 没有省掉 fidelity，而是搬了 fidelity

这点最重要。

SGAR 看起来只要一个边界，要求更低。但它并没有逃掉保真度问题，而是把 fidelity 从一个难的地方搬到一个可做的地方：

| 机制 | 需要证明什么 | 难度 |
|---|---|---|
| Audit | 失败是因为 X | 在统计噪声里做因果归因，很难 |
| SGAR | 候选是否过边界 | 可以用假设检验、OOS、FDR、DSR、effective-N 等硬化 |

“证明一条边界”与“证明一个原因”之间的鸿沟，就是假设检验与因果归因之间的鸿沟。

这解释了为什么 SGAR 能在 audit 死掉的地方活：它要的 fidelity 是 boundary fidelity，而不是 causal-reason fidelity。

### 7.4 SGAR 的两个失败模式

SGAR 的致命失败模式有两个：

1. **Gate 保真度不够**：ratchet 锁进的是过拟合噪声，而不是真实进步。
2. **Sampling family 失败**：生成族覆盖不到目标，种群再大也没有 passer。

因此 SGAR 的工程重心不是解释 why，而是：

- 把 gate 做硬：OOS、FDR、DSR、effective-N、data-snooping 控制；
- 把生成族做宽：丰富池、多样性、正交来源、变异策略。

---

## 8. 三引擎地图：Audit / SGAR / No-Go

把 oracle 质量摊开，可以得到一个更通用的路由表。

| 可得识别 | 应用引擎 | 收敛方式 | 工程动作 |
|---|---|---|---|
| 高带宽 + 高保真，能定位原因 | Audit | 定向下降，少步修复 | 诊断、证据、corrective requirement |
| 只有边界，但边界高保真且便宜 | SGAR | 种群搜索 + ratchet | 多样生成、状态管理、passer 保留 |
| 只有边界，但低保真 | Hardening first | 先修 gate，再搜索 | OOS、FDR、DSR、effective-N、反作弊 |
| 定位 oracle 和高保真边界都没有 | No-Go | 不应机械逼近 | 获取新 fidelity source / 新数据 / 新实验 |

伪代码如下：

```python
def route(goal_or_failure):
    oracle = classify_oracle(goal_or_failure)

    if oracle.can_localize and oracle.fidelity_high and oracle.bandwidth_high:
        return "AUDIT_MODE"

    if oracle.boundary_available and oracle.boundary_fidelity_high:
        return "SGAR_MODE"

    if oracle.boundary_available and not oracle.boundary_fidelity_high:
        return "HARDEN_GATE_FIRST"

    return "NO_GO__ACQUIRE_NEW_FIDELITY_SOURCE"
```

这就是“审计的尽头不是更强的审计，而是知道何时切换引擎或停手”。

---

## 9. 对 ccx 的架构含义

### 9.1 不只是 audit agent，而是 oracle-aware router

ccx 应该建设的是元能力：

```text
failure / target
  -> oracle classification
  -> engine routing
  -> evidence protocol
  -> iteration policy
```

路由结果至少包括四类：

| 路由 | 触发条件 | 行为 |
|---|---|---|
| audit-mode | 有高带宽定位 oracle | 生成 claim/evidence/corrective requirement |
| sgar-mode | 只有高保真边界 | 种群生成 + ratchet + state management |
| harden-gate-mode | 边界存在但低保真 | 先做验证设计与反作弊 |
| no-go-mode | 没有可用 oracle | 停止伪迭代，报告缺失的 fidelity source |

### 9.2 Audit 不能进 trust root

Audit agent 是 feedback amplifier，不是 truth source。

它应该满足：

- post-gate；
- read-only；
- default-off；
- advisory-only；
- 不把 fail 翻成 pass；
- 不信 agent prose；
- 只有 deterministic reproduction / recomputation 才能升级为 confirmed。

从 ccx 当前调研看，当前 audit 更像 deterministic machine check，不是 agent；失败时 verify-repair loop 传给下一轮的多是 raw failing tail，而不是结构化 claim/evidence/corrective answer。已有 finding ledger 形状接近 claim/evidence contract，因此 landing 更像“在红分支增加结构化反馈”，而不是改 verifier。

### 9.3 Finding contract

建议统一 finding schema：

```text
claim:                  失败原因或违反的约束
observed:               具体观察，必须带 handle，不只是 prose
evidence:               支撑 claim 的事实
evidence_check:         如何重新观察到该问题
fidelity_source:        logic | checker | execution_reference | invariant | decomposition | proxy_judge
hardness_level:         H3 | H2 | H1 | H0
corrective_requirement: 修复后必须满足的约束
corrective_answer:      建议修法，默认 UNVERIFIED
residual_uncertainty:   仍未被证据覆盖的部分
track:                  audit-agent / sgar / gate-hardening / no-go
```

### 9.4 Hardness levels

| 等级 | 含义 | 可用于 |
|---|---|---|
| H3 deterministic reproducible | 机器可重跑、可复现 | confirmed finding / regression guard / trust-adjacent |
| H2 mechanically inspectable | 有结构化证据，可机械辅助检查 | 强提示 builder，但不直接进 trust root |
| H1 human-reviewable logical | 人类可复核的逻辑证据 | review finding / 文本逻辑审计 |
| H0 advisory / proxy | 只是软判断或偏好 | 只能作为先验，不应驱动硬 gate |

### 9.5 Corrective answer 必须默认降级

audit 的 evidence 可以是 hard 的，但 corrective answer 常常不是 hard 的。

例如：

```text
claim: join key 错了
evidence: 当前 join 导致 cardinality 爆炸，gold rows 缺失
corrective_answer: 应该改用 account_id join
```

前两项可能有证据，最后一项仍可能错。因此 corrective answer 必须默认 advisory。只有 post-fix check 通过，或 evidence_check 与修复后的 gate 共同验证，才能升级。

---

## 10. 不同任务的落地策略

### 10.1 Text / claim / design doc

策略：claim graph + evidence ledger + contradiction scan。

输出应该不是“这段不清楚”，而是：

```text
claim_id
suspect_span
violated_rule
supporting_span_or_missing_evidence
why_it_fails
repair_operator
minimal_patch
residual_uncertainty
```

强项：低成本、高带宽、诊断到药方很近。

边界：事实性 claim 如果依赖外部世界，仍需外部 source；taste 文本仍是 soft。

### 10.2 Text2SQL / NL2Code

策略：围绕失败 witness 做可执行 probe。

重点证据：

- predicted vs expected rows diff；
- 中间 CTE 行数；
- join path cardinality；
- filter before/after counts；
- entity disambiguation sample；
- aggregation grain mismatch。

关键实验：

- 有无 gold / witness 的 ablation；
- 允许/禁止 probe SQL 的 ablation；
- 同一个 builder 切 diagnostic prompt vs fresh auditor；
- audit advice 对 no-progress rescue rate 的影响。

### 10.3 编码任务

策略：不要重复证明已有硬错误；只在定位弱或 oracle 缺失处审计。

适合 audit 的代码场景：

- 粗粒度 failing test；
- behavioral regression；
- invariant violation；
- unreachable error path；
- weak-oracle refactor；
- performance / API contract drift。

不适合 eager audit 的场景：

- 编译器已经给出明确 file:line；
- stack trace 已定位；
- unit test assertion diff 已足够明确。

### 10.4 Quant / IC / IR / DSR / ML gate

策略：外层标量失败先不要解释原因，先构造最大硬 sub-oracle。

对 quant：

- no-look-ahead / leakage check；
- label shift correctness；
- gross vs net decomposition；
- turnover attribution；
- per-horizon IC；
- per-regime IC；
- cost sensitivity；
- pool correlation / orthogonality；
- effective-N / data-snooping check。

对 ML：

- train/test contamination；
- per-class confusion；
- 错例聚类；
- data slice；
- ablation；
- seed sensitivity；
- learning curve；
- label quality probe。

关键边界：这些分解提升 bandwidth，不自动证明 causality。

### 10.5 SGAR 型目标

策略：不解释 why；做硬边界与状态管理。

必须保证：

- gate 是高保真的；
- OOS / FDR / DSR / effective-N 处理到位；
- 种群覆盖目标空间；
- ratchet 不允许 regression；
- 记录 passer lineage；
- 防止 overfit lock-in。

---

## 11. 实验与度量

### 11.1 Audit 的 ROI 指标

不要只看 audit 说得像不像，要看是否改善迭代。

| 指标 | 含义 |
|---|---|
| no-progress rescue rate | 原本会卡死/放弃的 case，有多少被 audit 救回 |
| iteration reduction | audit 介入后平均修复轮数是否下降 |
| confirmed finding yield | audit finding 中有多少被 deterministic check 确认 |
| false-confirm rate | 错误 claim 被标成 confirmed 的比例 |
| anchoring harm | audit 错建议导致迭代更慢或走偏的比例 |
| evidence-to-fix conversion | confirmed evidence 最终转成通过修复的比例 |

### 11.2 SGAR 的 ROI 指标

| 指标 | 含义 |
|---|---|
| OOS retention | in-sample passer 在 out-of-sample 中保留多少 |
| FDR-controlled pass rate | passer 中估计真阳性比例 |
| effective-N adjusted lift | 调整多重尝试后的真实提升 |
| lineage diversity | passer 是否来自多样生成族，还是单一路径 overfit |
| ratchet regression rate | 状态管理是否真的防止退步 |
| sampling coverage | 生成族是否覆盖目标空间 |

### 11.3 No-Go 的度量

No-Go 不是失败，而是避免伪进步。

No-Go finding 应输出：

```text
missing_fidelity_source
why_current_oracle_insufficient
minimum_new_data_or_experiment_needed
expected_cost_to_acquire_oracle
fallback_soft_prior_if_any
```

### 11.4 Tier 1 实验：构造 oracle 的杠杆

在等预算下比较四种条件：无构造 oracle、builder 自己构造检查、独立 verifier 构造检查，以及 hidden-gold oracle 上界。测量构造成本、语义 precision、coverage、mutation kill rate、hidden-gold pass rate，以及 builder-verifier error correlation。

### 11.5 Tier 2 实验：完整候选条件化修复

在代码、故事和论证组合上比较 fresh regeneration 与 candidate-conditioned audit/repair。植入或标注非局部缺陷，改变 repair radius，测量定位准确率、外部效用提升、回归率、盆地逃逸，以及跨轮次 verifier score 与 external score 的分叉。

### 11.6 Tier 3 实验：Context-conditioned 结构化验证

使用等预算 factorial design：

```text
A. same context + same prompt + repeated sampling
B. same context + diverse prompts
C. diverse contexts + same prompt
D. diverse contexts + matched decomposition prompts
E. D + independent evidence or model diversity
```

在每个 cell 内重复，以分离 within-condition 随机方差与 between-context 结构变化。测试模型熟悉的结构化任务、提供充分领域材料的不熟悉任务，以及缺少决定性知识的不熟悉任务作为负对照。测量 between/within-context structural diversity、structural basin coverage、cross-context error correlation、unique confirmed findings、false consensus、calibration、aggregation loss 和 externally grounded utility。

只有当 context-conditioned branch 降低相关错误，并在聚合后提高 held-out 或 human-grounded outcome 时，Tier 3 才能从 coverage 机制进一步 promotion。

---

## 12. 最终原则

### 原则 1：先问 oracle，不先问 agent

```text
我能构造的最廉价、能定位的保真度来源是什么？
```

这是所有任务的第一问。

### 原则 2：能审硬的 sub-oracle 先审硬

即使外层目标是软的，也要先寻找最大的硬子问题：invariant、leakage、contract、logic、execution diff、data consistency。

### 原则 3：区分带宽、路由、支持、保真度与置信度

高带宽 profile 很有用，但不能自动变成 causal proof。分解主要买 bandwidth；prompt diversity 可以买 routing diversity；context diversity 可以买 representation 与 effective-support diversity；独立且与任务相关的证据可以买 fidelity；经过外部校准的聚合可以买 confidence。

### 原则 4：audit 不进 trust root

Audit 只增强红分支反馈；它不能把 fail 翻成 pass。

### 原则 5：SGAR 的核心是硬边界 + 棘轮状态

SGAR 不需要 why，但极度依赖 boundary fidelity。gate 不硬，ratchet 锁进噪声。

### 原则 6：No-Go 是一等公民

当没有定位 oracle，也没有高保真边界时，继续机械迭代就是伪工作。此时系统应明确报告缺少什么 fidelity source，而不是继续生成更多候选。

### 原则 7：不要把同条件采样与 context intervention 混为一谈

同一 context 下增加样本，只增加已部署条件分布内部的密度。受治理的 context intervention 可能增加结构覆盖，但前提是它产生实质不同的证据或表征，而不是词汇变化。

---

## 13. 最终压缩版

> **Audit agent 的本质是 failure-conditioned oracle exploitation。**
>
> 它在 text2sql、文本逻辑、spec/claim、一致性检查、可执行语义任务上强，是因为失败暴露了便宜、高带宽、较高保真的定位 oracle。
>
> 它在纯标量 metric gate 上弱，是因为缺少定位带宽；这时应先用分解买带宽，或切到 SGAR。
>
> Tier 2 把完整候选作为 candidate-conditioned 局部修复的 witness。Tier 3 通过受治理的 context 与 decomposition intervention 暴露不同 witness，降低 verifier 的共享盲点。没有外部证据和校准时，二者都不能进入 trust root。
>
> **SGAR 的本质是 boundary-fidelity exploitation。**
>
> 它不问原因，只靠高保真边界与棘轮状态管理，把无梯度搜索变成可积累的单调逼近。
>
> 当 neither locator nor boundary oracle exists，诚实答案是 No-Go：去拿新的数据、实验或 fidelity source。

这套框架把 audit、text2sql、文本逻辑审计、quant/ML gate、SGAR 和 No-Go 放进同一个决策系统：

```text
先分类 oracle，再选择引擎。
```
