# Agent Harness Framework

## 从模型条件能力前沿、运行时桥接到可量化的 Action-Space Optimization

**状态：** Working Draft v0.1  
**日期：** 2026-07-27  
**缩写：** AHF  
**中文暂译：** Agent Harness Framework；更精确的解释是“Agent 能力兑现与运行时 harness 框架”
**相关文档：**

- [English version](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/agent-harness-framework.md)
- [Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md)
- [State-Governed Agent Regime](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md)
- [Aggregation Mismatch and Compositional Governance in LLM Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.md)
- [Aggregation Mismatch: Derivable Claims, Proof Conditions, and Implications for Agent Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.md)
- [Aggregation Mismatch Artifact-v4: Experimental Evidence, Theory Gaps, and Agent Implications](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.md)
- [Patch vs. Full Rewrite: A Controlled Experiment on Sparse Repair Delivery](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.md)
- [Agent 工程为什么必须重视受控实验](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/why-agent-engineering-needs-controlled-experiments.zh-CN.md)
- *Towards Long-Horizon Agents: A Survey — Foundation, Evolution, Harness, Optimization, Application, and Frontier*

---

## Abstract

长程 Agent 研究正在从 Prompt Engineering、Context Engineering 进入 Runtime Harness 时代，但当前主流讨论仍主要停留在组件分类和经验配方层面：工作流、记忆、工具、编排、Hooks、Verification 被不断加入系统，最终只通过一个端到端分数判断“这个 Agent 是否更好”。这种方法能够发现有效方案，却难以回答更基础的问题：提升究竟来自模型、环境、工具、验证器，还是某一段 Harness？不同组件能否独立量化？一个框架为何在某个模型上有效、换一个模型却失效？更多迭代究竟是在产生结构性进展，还是只是在同一条件分布下重复采样？

Agent Harness Framework 提出一个面向**能力归因、运行时控制和实验量化**的功能性框架。在固定任务分布、外部能力基座、预算和评价标准的条件下，基础模型决定一个 **model-conditioned capability frontier**：该模型在允许的运行时设计空间中能够达到的最佳系统表现。具体 Agent Harness 决定实际系统距离这一前沿有多远，以及逼近前沿的概率、稳定性、成本和风险。由此，总体问题残差可以分解为模型条件能力缺口和 Harness 能力兑现缺口。

本框架把 Agent Harness 的最小功能核心分为两个相互正交但高度互补的部分：

1. **Bridge**：闭合模型、环境、观测、验证、控制增量和硬状态之间的回路，使模型输出能够成为可验证、可提交、可恢复的任务进展。SGAR 构成正向的状态提交桥，Audit Engineering 构成反向的失败写回桥。
2. **Action-Space Optimization（ASO）**：在固定模型参数下，优化模型当前面对的操作形式、责任边界、搜索邻域、提交范围和候选结构，使一次模型调用更可能带来经过验证的任务残差下降，而不是仅仅生成另一个完整答案。

该框架进一步提出双重残差视角：系统层面测量模型与 Harness 分别留下多少能力残差；轨迹层面测量每次动作是否真正减少了未解决的任务残差。通过成对控制实验、全因子设计、交互项估计、Shapley 归因、预算—成功曲线和跨模型迁移实验，Agent Engineering 有可能从“提出一个看起来有效的 Harness”转向“识别、量化和预测每个运行时机制的边际作用”。当前围绕 patch、rewrite、audit、boundary state 和 operation interface 的聚合失配实验，只是 Action-Space Optimization 的第一步。若 Bridge、状态治理、审计、验证、上下文、工具暴露、编排和预算路由都能获得独立、可复现的效应估计，Agent Engineering 将从经验工程走向科学工程。

---

## 1. 核心命题

Agent Harness Framework 的中心命题是：

> **在固定任务分布、环境、工具、Oracle、预算和允许的运行时设计空间下，模型决定模型条件能力前沿；Agent Harness 决定这一前沿被兑现的概率、稳定性、成本和风险。**

其最小结构为：

```text
Agent Harness = Bridge × Action-Space Optimization
```

这里的乘号表示互补性，而不是简单的数值乘法：

- Bridge 让任务进展能够被环境证据确认、被硬状态承认、被后续步骤继承；
- Action-Space Optimization 让模型在更合适的问题表示、操作邻域和责任边界中工作；
- 缺少任一部分，另一个部分的价值都无法稳定兑现。

更完整地说：

> **Bridge 让进展能够存在；Action-Space Optimization 让值得发生的进展更可能发生。**

---

## 2. 为什么需要一个新的 Agent Harness 视角

### 2.1 当前 Harness 研究解决了“有什么”，但还没有解决“为什么有效”

长程 Agent 的主流形式化已经从“一个更长的模型调用”转向：

\[
\mathrm{Agent}=\pi_\theta\oplus H
\]

其中，\(\pi_\theta\) 是基础模型策略，\(H\) 是围绕模型闭合 action–observation–memory loop 的 Harness。现有综述通常把 Harness 分为：

- Loops and Workflows；
- Context and Memory；
- Tools, MCP, and Skills；
- Orchestration；
- Hooks and Middleware；
- Verification。

这套分类对描述系统组成非常有用，但它仍然是**组件分类**，不是**因果分解**。两个 Agent 可以都拥有上述六类组件，却表现完全不同；一个组件被加入后端到端分数上升，也不等于已经知道它通过何种机制起效。

Agent Harness Framework 不替代 Harness taxonomy，而是对它进行功能性重参数化：

```text
Harness taxonomy：系统由哪些部件组成？
Agent Harness：这些部件通过什么基本机制改变任务成功率？
Quantification：每个机制在固定条件下贡献了多少？
```

### 2.2 “强 Harness 能突破模型上限”与“模型决定上限”都需要收紧

如果 Harness 新增了搜索引擎、编译器、求解器、数据库、外部专家或新的 Oracle，它确实可能让系统完成模型单独无法完成的任务。因此，不能把系统绝对上限归因于裸模型。

但如果外部信息、工具、环境、Oracle 和预算保持不变，只改变状态治理、验证回路、动作接口、输出责任和搜索结构，那么这类改进主要改变的是：

- 模型能力是否被正确激活；
- 已经产生的正确局部结果是否被保存；
- 失败信号是否被转换为下一轮的方向；
- 模型是否承担了不必要的完整对象交付；
- 系统是否在同一局部盆地中重复采样。

因此，本框架严格区分：

| 对象 | 作用 | 例子 |
|---|---|---|
| **外部能力基座** | 改变系统拥有什么信息和能力 | 新工具、新数据、新环境、新 Oracle、外部求解器 |
| **模型策略** | 决定语义判断、候选生成和利用外部能力的能力 | 基础模型、推理模型、训练后策略 |
| **Agent Harness** | 决定已有能力如何被组织、验证、提交和高效兑现 | Bridge、Action-Space Optimization |

只有在外部能力基座固定时，“模型 + Hardness”的残差归因才是可识别的。

### 2.3 端到端分数把不同问题混成了一个数字

当前 Agent 实验常报告：

```text
Agent A：62%
Agent B：68%
```

但这 6 个百分点可能来自完全不同的来源：

- 模型更强；
- 工具更多；
- 工具接口更适配模型；
- 状态没有丢失；
- 验证器更宽松；
- 输出格式更容易；
- 允许更多 tokens 或更长 wall-clock；
- 重试次数更多；
- Harness 恰好针对 benchmark 过拟合。

如果这些来源不能拆开，Agent Engineering 就只能不断提出新的经验框架，无法形成可迁移、可复现、可预测的工程知识。

### 2.4 长程 Agent 的关键不是“迭代次数”，而是“结构是否改变”

很多 Agent 把下列过程称为自我改进：

```text
生成
→ 反思
→ 再生成
→ 再反思
→ 再生成
```

但如果新一轮没有增加信息、没有改变硬状态、没有改变动作空间、也没有改变模型策略，那么它只是在相同条件分布下继续采样。采样仍可能获得 best-of-N 收益，但没有新的结构性进展来源。

Agent Harness 关注的不是“运行了多少轮”，而是每一轮是否改变了：

\[
(I_t,\;S_t,\;\mathcal A_t,\;\pi_t)
\]

即信息、权威状态、动作空间或模型策略中的至少一项。

---

## 3. 术语边界

### 3.1 Task Hardness、Boundary Hardening 与 Agent Harness

“Hardness”容易同时指向三种不同概念：

| 概念 | 含义 | 本文位置 |
|---|---|---|
| **Task Hardness** | 任务本身的难度、依赖深度、部分可观测性、搜索复杂度 | 外生任务属性 |
| **Boundary / Acceptance Hardening** | 强化验收门槛，防止弱代理目标和可钻漏洞的测试欺骗系统 | Bridge 中的验证约束，也是 ASO 的可行动作边界 |
| **Agent Harness** | 系统把概率性模型输出转化为可验证、可积累、可恢复任务进展的能力 | 本文的上位框架 |

因此，本文不把 Agent Harness 等同于“把 benchmark 做难”，也不把它等同于安全领域常见的 system hardening。

### 3.2 Hardness 是系统属性，Hardening 是改造过程

- **Agent Harness**：系统在当前任务、模型和外部能力基座下表现出的运行时属性；
- **Agent Hardening**：通过实验和工程改造提升这一属性的过程；
- **Agent Harness Framework**：用于定义、分解、量化和优化该属性的理论与实验框架。

### 3.3 Hardness 不是一个天然的单标量

一个系统可能：

- 状态治理很强，但动作空间选择很差；
- 动作接口很优，但验证和提交极弱；
- 成功率高，但成本巨大；
- 平均表现高，但尾部失败风险不可接受。

因此，Hardness 首先是一个多维 profile，而不是一个天然总分。只有在明确效用函数、预算和风险权重后，才可以压缩为单一目标。

---

## 4. 系统形式化

### 4.1 基本对象

设：

- \(D\)：任务分布；
- \(X\)：固定的外部能力基座，包括环境、工具、可访问数据、Oracle 和执行器；
- \(b\)：预算，包括 tokens、wall-clock、工具调用、金钱和风险预算；
- \(\pi_\theta\)：基础模型策略；
- \(\mathcal B\)：Bridge；
- \(\Omega\)：Action-Space Optimizer；
- \(J(D;\theta,X,\mathcal B,\Omega,b)\)：系统在任务分布上的期望效用。

Agent Harness 的最小核心记为：

\[
\mathcal H=(\mathcal B,\Omega)
\]

在固定 \(D,X,b\) 时，部署系统可写为：

\[
\mathcal A_{\theta,\mathcal H}
=\pi_\theta\oplus\mathcal B\oplus\Omega
\]

### 4.2 轨迹状态

为避免把上下文叙事误认为世界状态，区分：

- \(s_t\)：真实或潜在环境状态；
- \(o_t\)：环境暴露给系统的观测；
- \(g_t\)：系统当前承认的 governed hard state；
- \(c_t\)：实际呈现给模型的上下文；
- \(u_t\)：由 ASO 选择的 model-facing operator；
- \(a_t\)：模型在该 operator 下提交的具体 proposal；
- \(f_t\)：失败证据、Audit Finding 或尚未解决的义务。

Action-Space Optimizer 先选择当前模型应当面对哪一种操作：

\[
u_t=\Omega(g_t,f_t,b_t)
\]

模型再在给定状态和 operator 下生成具体动作参数：

\[
a_t\sim\pi_\theta\big(a\mid\phi(g_t,o_{\le t},u_t)\big)
\]

Bridge 负责把 proposal 接入环境，并返回观测、验证结果、状态提交和新的控制信号：

\[
(o_{t+1},v_{t+1},g_{t+1},f_{t+1})
=\mathcal B(g_t,a_t,X)
\]

这形成一个两层决策结构：

```text
Outer runtime policy Ω：选择模型应该做哪一类工作
Inner model policy πθ：在该工作形式中生成具体语义动作
```

ASO 不要求必须由另一个 LLM 实现。它可以是规则、路由器、统计策略、学习策略或混合系统。

---

## 5. 双重残差视角

Agent Harness Framework 同时使用两种残差：

1. **系统能力残差**：一个具体 Agent 距离可达前沿还有多远；
2. **执行任务残差**：一次运行中还有多少任务义务尚未解决。

二者分别回答“系统哪里还不够强”和“当前动作是否真正推进任务”。

### 5.1 系统能力残差：模型与 Hardness 的分解

在固定 \(D,X,b\) 和允许的 Hardness 设计集合 \(\mathfrak H\) 下，定义模型条件能力前沿：

\[
C_\theta(D,X,b,\mathfrak H)
=
\sup_{\mathcal H\in\mathfrak H}
J(D;\theta,X,\mathcal H,b)
\]

它表示：在给定模型和外部能力基座下，允许选择最佳 Hardness 时能够达到的系统前沿。

再定义该外部能力基座上的理想系统前沿：

\[
C^*(D,X,b,\mathfrak H)
=
\sup_{\pi,\mathcal H\in\mathfrak H}
J(D;\pi,X,\mathcal H,b)
\]

对于一个具体系统 \((\theta,\mathcal H)\)，总残差恒等分解为：

\[
C^*-J(\theta,\mathcal H)
=
\underbrace{C^*-C_\theta}_{\text{模型条件能力缺口}}
+
\underbrace{C_\theta-J(\theta,\mathcal H)}_{\text{Harness 能力兑现缺口}}
\]

该分解的意义不是声称两个量已经可直接观测，而是建立一个清晰的归因目标：

- **模型条件能力缺口**：即使为当前模型选择最佳允许的 Harness，仍然无法消除的部分；
- **Harness 能力兑现缺口**：模型本来可能做得到，但当前运行时没有稳定兑现的部分。

### 5.2 经验前沿与下界

真实的 \(C_\theta\) 通常不可知。实验只能在已测试 Hardness 集合 \(\mathfrak H_{test}\) 上形成经验前沿：

\[
\widehat C_\theta
=
\max_{\mathcal H\in\mathfrak H_{test}}
\widehat J(\theta,\mathcal H)
\]

于是：

\[
\widehat G_H(\theta,\mathcal H)
=
\widehat C_\theta-
\widehat J(\theta,\mathcal H)
\]

是当前已测试空间内的经验 Harness gap。在忽略估计误差时，它只是对真实能力兑现缺口的下界；新的 Harness 可能继续提高经验前沿。

### 5.3 Harness leverage、Model leverage 与互补项

可定义：

\[
L_H(\theta)
=
\max_{\mathcal H}\,J(\theta,\mathcal H)
-J(\theta,\mathcal H_0)
\]

表示固定模型下，Hardness 相对基线能够兑现多少额外能力。

对于固定 Harness：

\[
L_M(\mathcal H)
=
\max_\theta J(\theta,\mathcal H)
-
\min_\theta J(\theta,\mathcal H)
\]

表示模型变化带来的能力差异。

模型与 Hardness 可能存在强交互。以基线模型 \(\theta_0\) 和基线 Harness \(\mathcal H_0\) 为例：

\[
I_{M\times H}
=
J(\theta_1,\mathcal H_1)
-J(\theta_1,\mathcal H_0)
-J(\theta_0,\mathcal H_1)
+J(\theta_0,\mathcal H_0)
\]

若 \(I_{M\times H}\neq0\)，则“这个 Harness 提升多少”不是模型无关的常数。一个 Hardness 可能帮助弱模型更多，也可能只有强模型才能利用。

### 5.4 执行任务残差

在单次运行内部，定义 \(r_t\) 为当前未解决任务残差。它不一定是单一标量，可以是：

- 未通过的可执行约束集合；
- 未满足的规格和接口义务；
- Audit Findings 的加权集合；
- 未决假设与证据缺口；
- 错误状态、回归风险和未完成工作构成的偏序对象。

若存在标量化，可写为：

\[
\Delta r_t=r_t-r_{t+1}
\]

若不存在统一标量，则使用偏序：

\[
r_{t+1}\prec r_t
\]

表示新的 governed state 在受保护约束不回归的条件下严格减少了未解决义务。

Bridge 决定这一残差下降是否有证据、是否可以提交；ASO 决定下一次调用应选择什么 operator 才更可能产生该下降。

---

## 6. Bridge：闭合模型、环境、验证与硬状态

### 6.1 定义

**Bridge 是连接概率性模型输出与具有状态、后果和验收规则的外部环境的运行时机制。**

它不只是 API adapter，也不只是把若干模型调用串起来。它负责两种方向相反的转换：

```text
正向：模型 proposal → 环境后果 → 验证 → 状态提交
反向：环境失败 → 证据与定位 → 控制增量 → 下一轮约束
```

### 6.2 正向 Bridge：从 action 到 governed state transition

正向 Bridge 的最小链条是：

\[
g_t+A_t\rightarrow o_{t+1}\rightarrow v_{t+1}\rightarrow g_{t+1}
\]

它回答：

> 模型提出的动作在什么条件下才算真实任务进展？

SGAR 为这一方向提供状态权威：上下文可以描述、记忆、推断和总结状态，但不能自动成为状态的最终权威。模型可以提议“任务已经完成”，只有外部证据和验证规则允许时，系统才提交状态转移。

正向 Bridge 至少包含：

- 当前 governed state；
- 动作的前置条件；
- proposal 到真实执行的映射；
- 环境观测；
- 验证规则；
- commit、reject、rollback 或 retry；
- provenance 和恢复点。

### 6.3 反向 Bridge：从 failure 到 governed control delta

环境返回“失败”并不等于 Agent 获得了有效方向。一个低带宽信号可能只有：

```text
fail
score = 0.42
test failed
wrong answer
```

反向 Bridge 需要把失败转化为：

- 失败发生在哪里；
- 哪个假设或约束被证据推翻；
- 下一轮应修改 prompt、context、control space、data、tool、evaluator、renderer 还是 human boundary；
- 哪个回归义务必须被加入；
- 当前硬状态、允许动作和验收门槛是否需要更新。

Audit Engineering 构成这一方向的核心机制：

\[
\text{failure}
\rightarrow
\text{evidence}
\rightarrow
\text{localization}
\rightarrow
\text{control delta}
\rightarrow
\text{regression obligation}
\]

审计如果只有评论而没有 control delta，就没有形成 Bridge；如果没有写回硬状态或控制对象，下一轮仍可能重复同一失败。

### 6.4 Bridge 的六个功能维度

| 功能维度 | 核心问题 | 典型失效 |
|---|---|---|
| **State Authority** | 系统当前承认什么是真的？ | 状态漂移、虚假完成、计划被当作进展 |
| **Execution Fidelity** | proposal 是否按声明语义改变环境？ | 参数错译、非幂等副作用、执行器污染 |
| **Observation and Evidence** | 后果是否进入可验证表示？ | 关键变化不可见、日志丢失、观测不充分 |
| **Verification and Gate** | 哪些证据足以允许提交？ | 假阳性、假阴性、弱代理目标、奖励黑客 |
| **Failure Write-back** | 失败如何改变下一轮控制空间？ | 只重试、不定位、自由文本反馈被稀释 |
| **Recovery and Replay** | 中断、失败和撤销后能否恢复？ | 重复工作、状态损坏、无法复现路径 |

### 6.5 Bridge 的核心指标

| 指标 | 含义 |
|---|---|
| `state_drift_rate` | 模型隐含状态与 governed state 不一致的频率 |
| `false_completion_rate` | 未通过合法状态转移却被宣布完成的频率 |
| `transition_validity` | 已提交状态转移满足证据与验证条件的比例 |
| `proposal_effect_fidelity` | proposal 声明语义与实际环境变化的一致度 |
| `failure_localization_rate` | 失败能够被定位到可修复对象的比例 |
| `actionable_delta_rate` | Audit Finding 形成可执行 control delta 的比例 |
| `regression_recurrence` | 已记录失败在后续轮次再次出现的频率 |
| `recovery_success` | 仅凭硬状态和记录能否正确恢复运行 |
| `replayability` | 其他执行者能否重放并解释当前状态来源 |
| `bridge_cost` | 每次合法状态转移所需的验证、存储和交互成本 |

---

## 7. Action-Space Optimization：优化模型面对的问题，而不只优化模型回答

### 7.1 定义

**Action-Space Optimization 是在固定模型参数下，对 model-facing operator、动作表示、操作范围、责任分配、搜索邻域和提交结构进行优化，使模型调用更可能产生经过验证的任务残差下降。**

它不是传统 Policy Optimization。

传统 Policy Optimization 改变：

\[
\pi_\theta(a\mid s)
\rightarrow
\pi_{\theta'}(a\mid s)
\]

Action-Space Optimization 改变：

\[
\mathcal A_t
\rightarrow
\widetilde{\mathcal A}_t
\]

即不先改模型参数，而是改变模型当前被要求完成什么样的操作。

### 7.2 Action interface 不是中性输出格式

以下操作即使拥有相同任务信息，也不是同一个模型问题：

- 从零生成完整对象；
- 对已有对象进行审计；
- 输出局部 patch；
- 输出区域重写；
- 提交边界状态，由程序确定性展开；
- 只给出修复计划，由执行器应用；
- 生成多个候选并由 verifier 选择；
- 在依赖拓扑顺序中逐步提交。

它们改变了：

- 模型需要承担多少脆弱承诺；
- 已正确区域是否必须重新生成；
- 非局部依赖是否在完整候选中变得可观测；
- 输出是否可以由确定性执行器接管；
- 验证是完整求解还是 residual computation；
- 错误能否被局部化；
- 当前搜索是否被限制在一个错误盆地中。

因此，Agent Runtime 不只是从固定动作集合中选择动作。它还可以决定：

> **下一次模型调用究竟面对哪一种问题。**

### 7.3 ASO 的目标不是“当前回答正确率最大化”

很多高价值动作不会立即产生最终正确答案。例如：

- 获取一个关键观测；
- 构造一个反例；
- 暴露两个约束之间的冲突；
- 证明当前路线不可行；
- 提交一个边界状态；
- 缩小候选空间；
- 把完整生成转换为局部诊断。

因此，更合理的目标是最大化长期的、经过验证的残差下降：

\[
u_t^*
=
\arg\max_{u\in\mathcal U_t}
\Big[
\mathbb E\big(U(g_T)\mid g_t,u,\pi_\theta\big)
-\lambda C_{t:T}(u)
-\mu Risk_{t:T}(u)
\Big]
\]

在有合适残差度量时，也可写为：

\[
u_t^*
=
\arg\max_u
\Big[
\mathbb E(r_t-r_{t+1}\mid g_t,u,\pi_\theta)
-\lambda C(u)
-\mu Risk(u)
\Big]
\]

### 7.4 ASO 的七个基本维度

| 维度 | 被优化的对象 | 例子 |
|---|---|---|
| **Representation** | 动作以什么形式提交 | 自由文本、typed arguments、patch、AST operation、plan |
| **Scope** | 一次动作覆盖多大区域 | token、span、function、module、chapter、full object |
| **Responsibility Split** | 哪部分由模型决定，哪部分由程序执行 | 模型给 edit plan，executor 保持未改区域 |
| **Information Condition** | 模型在什么完成度和证据条件下工作 | 无候选、完整候选、residual、boundary state、counterexample |
| **Search Topology** | 单轨、分支、审计、回溯还是重生成 | linear、branching、audit-repair、variable-neighborhood search |
| **Dependency Order** | 动作按什么依赖关系发生 | topological order、frontier-based execution、deferred commit |
| **Commitment Policy** | 哪些动作可以直接生效 | provisional、sandboxed、verified commit、human-gated |

### 7.5 与聚合失配的关系

聚合失配指出：局部价值并不保证在组合操作下形成全局价值。ASO 直接治理的正是组合操作、承诺表面和搜索邻域。

例如，在稀疏修复中：

- full rewrite 要求模型重新承担完整对象的交付；
- patch 只要求模型表达局部差异；
- deterministic executor 可以按权威 baseline 应用差异并保持未修改区域；
- global verifier 再决定是否提交。

这不是简单“输出更短”，而是把一个完整对象重建问题改写为局部操作提交问题。

### 7.6 结构优势不等于实际模型收益

理论可以证明某些接口具有结构优势，例如：

- 稀疏 patch 的描述长度和 commitment surface 更小；
- 未修改区域可由执行器按构造保持；
- 完整候选使验证可以转化为 residual computation；
- 足够的 boundary state 可以切断部分循环依赖；
- 拓扑顺序可以减少未解析前驱。

但这些事实不能自动推出：

- 模型一定更容易推断正确 patch plan；
- 任何 edit density 下 patch 都优于 rewrite；
- candidate 一定帮助 full rewrite；
- audit 一定比 generation 容易；
- 结构位置的 boundary state 一定比等量随机正确信息更有模型收益。

因此必须区分：

\[
\text{structural advantage}
\neq
\text{model-realized advantage}
\]

ASO 的任务不是制定“永远 patch”或“永远 audit”的教条，而是识别不同模型、长度、耦合、候选质量、编辑密度和预算下的 operation-interface crossover。

### 7.7 ASO 的核心指标

| 指标 | 含义 |
|---|---|
| `plan_correct` | 模型是否识别了正确改变或操作计划 |
| `delivery_correct_given_plan` | 已知正确计划时，是否能按接口准确交付 |
| `commitment_surface` | 模型必须无错提交的脆弱字段、位置或引用数量 |
| `edit_density` | 实际改变占完整对象的比例 |
| `collateral_regression` | 局部改动导致未目标区域退化的频率 |
| `verified_residual_reduction` | 一次 operator 调用带来的经验证残差下降 |
| `success_at_budget` | 固定预算下的严格系统成功率 |
| `cost_at_target_success` | 达到目标成功率所需的最小预算 |
| `operator_crossover` | patch、regional rewrite、full rewrite、audit 等接口的优势切换点 |
| `basin_escape_rate` | 改变 operator 后摆脱重复失败模式的比例 |
| `format_and_execution_validity` | 输出能否被严格解析和正确执行 |

---

## 8. Bridge 与 ASO 的正交性和互补性

Bridge 和 ASO 不是同一问题的两个名字。

| | ASO 弱 | ASO 强 |
|---|---|---|
| **Bridge 弱** | 无锚点漫游：漂移、重复、虚假完成 | 能产生高价值瞬时动作，但无法稳定验证、保存和继承 |
| **Bridge 强** | 稳定而低效：可靠地执行错误接口，长期困在同一局部盆地 | 可治理的能力兑现：高价值动作成为可验证、可积累的状态进展 |

### 8.1 强 Bridge、弱 ASO

这类 Agent 可能拥有：

- 完整日志；
- 明确 checkpoint；
- 严格测试；
- 可恢复状态；
- 所有动作都能审计。

但它仍然不断要求模型：

- 完整重写已基本正确的对象；
- 在错误粒度上工作；
- 重做已经完成的部分；
- 在没有新信息的情况下重复生成；
- 用局部优化解决全局组合问题。

它会变成“非常可靠地低效”。

### 8.2 强 ASO、弱 Bridge

这类 Agent 可能能让模型输出正确 patch、边界状态或诊断，但：

- 没有权威 baseline；
- 执行结果未验证；
- 下一轮不知道哪些改变已生效；
- 失败没有写回；
- 正确结果可能被后续完整重写覆盖。

它不断产生有价值的瞬时结果，却无法形成持续任务进展。

### 8.3 交互项不能被忽略

设 \(B_0,B_1\) 为弱/强 Bridge，\(O_0,O_1\) 为弱/强 ASO，则交互项为：

\[
I_{B\times O}
=
J(B_1,O_1)-J(B_1,O_0)-J(B_0,O_1)+J(B_0,O_0)
\]

若交互项很大，只报告“Bridge 提升多少”或“ASO 提升多少”会产生误导。Agent Harness 的量化必须显式建模交互，而不是默认组件作用可简单相加。

---

## 9. 结构性迭代原则

### 9.1 四类能够真正改变搜索状态的变量

设一次 Agent 迭代的结构状态为：

\[
Z_t=(I_t,g_t,\mathcal A_t,\pi_t)
\]

其中：

- \(I_t\)：可用信息、证据和观测；
- \(g_t\)：权威硬状态；
- \(\mathcal A_t\)：当前 model-facing action space；
- \(\pi_t\)：模型策略。

如果：

\[
I_{t+1}=I_t,\quad
 g_{t+1}=g_t,\quad
\mathcal A_{t+1}=\mathcal A_t,\quad
\pi_{t+1}=\pi_t
\]

那么新一轮基本仍然是：

\[
y_{t+1}\sim
p_{\pi_t}(y\mid I_t,g_t,\mathcal A_t)
\]

即同一条件分布下的再次采样。

### 9.2 结构变化指示量

可定义：

\[
\chi_t
=
\mathbf 1[
\Delta I_t\neq0
\vee\Delta g_t\neq0
\vee\Delta\mathcal A_t\neq0
\vee\Delta\pi_t\neq0]
\]

- \(\chi_t=0\)：重复采样轮；
- \(\chi_t=1\)：至少有一个结构变量发生变化。

这不意味着 \(\chi_t=1\) 的迭代一定有效，也不意味着 \(\chi_t=0\) 完全没有 best-of-N 收益。它只说明：没有结构变化时，系统没有获得新的问题求解机制。

### 9.3 四类变化分别由谁负责

```text
Bridge：改变信息 I 与 governed state g
ASO：改变 action space A
训练、蒸馏或模型切换：改变 policy π
```

这一原则为长程 Agent 提供了比“再试一次”更清晰的继续条件：

> 在失败后，系统应说明下一轮将新增什么信息、提交或撤销什么状态、改变什么 operator，或者为何值得仅进行重复采样。

---

## 10. 从经验框架到科学工程：量化方法

### 10.1 需要估计的不是一个分数，而是一组 estimands

一个完整的 Agent Harness 实验至少应区分：

1. 端到端任务效用；
2. 固定预算下的严格成功率；
3. 达到目标成功率所需成本；
4. 运行时任务残差下降；
5. 失败类型和失败位置；
6. 组件主效应；
7. 组件交互效应；
8. 跨模型、跨任务和跨预算的迁移效应；
9. 对均值、方差和尾部风险的不同影响；
10. 对模型条件经验前沿的提升。

### 10.2 实验中的冻结原则

要量化某一 Hardness 组件，必须尽量固定：

- 同一任务实例；
- 同一输入信息；
- 同一模型和推理配置；
- 同一外部工具与 Oracle；
- 同一候选、错误位置或 authoritative plan；
- 同一预算；
- 同一严格成功标准；
- 同一预分配样本，不进行结果后挑选；
- 不使用 best-of 选择掩盖单次系统可靠性。

只有被研究的 operator、Bridge 机制或状态规则发生变化，才能把差异解释为对应组件的效应。

### 10.3 先拆 plan、delivery、execution、verification

端到端成功可因式分解为：

\[
P(\text{success})
=
P(\text{plan correct})
\cdot
P(\text{delivery correct}\mid\text{plan correct})
\cdot
P(\text{execution correct}\mid\cdots)
\cdot
P(\text{verification and commit correct}\mid\cdots)
\]

如果不拆这四层：

- 模型没有找到正确方案；
- 模型找到了方案但完整重写时交付失败；
- 执行器错误应用了正确 patch；
- verifier 错误接受了结果；

都会被混成一个“Agent 失败”。

### 10.4 二因子实验与 Shapley 归因

对 Bridge 和 ASO 做 \(2\times2\) 实验，记：

\[
J_{00}=J(B_0,O_0),\;
J_{10}=J(B_1,O_0),\;
J_{01}=J(B_0,O_1),\;
J_{11}=J(B_1,O_1)
\]

则平均顺序无关的 Shapley 归因为：

\[
\phi_B
=
\frac12[(J_{10}-J_{00})+(J_{11}-J_{01})]
\]

\[
\phi_O
=
\frac12[(J_{01}-J_{00})+(J_{11}-J_{10})]
\]

并满足：

\[
\phi_B+\phi_O=J_{11}-J_{00}
\]

这比在一个固定基线下只报告单次 ablation 更稳健，因为它平均了不同组件加入顺序。

### 10.5 模型 × Bridge × ASO 的全因子设计

更完整的设计是：

\[
M\times B\times O
\]

可写为：

\[
Y_{ijk}
=
\mu+\alpha_i+\beta_j+\gamma_k
+(\alpha\beta)_{ij}
+(\alpha\gamma)_{ik}
+(\beta\gamma)_{jk}
+(\alpha\beta\gamma)_{ijk}
+\epsilon
\]

它能够回答：

- 某个 Bridge 是否只帮助弱模型；
- 某个 ASO 是否需要强模型才能利用；
- 强 Bridge 是否放大或削弱某个 action interface 的优势；
- 模型排序是否会随 Hardness 改变；
- 所谓“模型能力差距”中有多少其实是 harness compatibility。

### 10.6 推荐统计单位

- 以任务实例而不是 run 作为主要推断单位；
- 对重复运行先在实例内聚合；
- 使用 paired difference、instance bootstrap 或 mixed-effects model；
- 对 time-to-success 使用生存分析或预算曲线；
- 对严格二元成功报告置信区间，而不仅是均值；
- 对高方差 Agent 报告尾部失败、最坏分位数和恢复成本；
- 对跨模型、跨任务迁移显式报告异质性，而不是只给 pooled average。

### 10.7 Agent Harness 量化成熟度

| 等级 | 特征 | 仍然缺少什么 |
|---|---|---|
| **Q0 经验叙述** | “这个框架感觉更好” | 无冻结、无效应量、不可归因 |
| **Q1 单组件 ablation** | 去掉组件后分数下降 | 基线依赖强，交互未知 |
| **Q2 成对控制实验** | 同实例、同预算，只改变一个机制 | 仍局限于单模型或单任务 |
| **Q3 因子与交互实验** | Model × Bridge × ASO，估计主效应和交互 | 跨域规律尚未建立 |
| **Q4 迁移曲线与 crossover law** | 能预测何时 patch、audit、rewrite、branching 更优 | 仍需要动态决策 |
| **Q5 自适应 Hardness Optimizer** | 根据状态、残差和预算在线选择机制，并在 OOD 上验证 | 接近可学习的科学运行时 |

### 10.8 科学工程的判定标准

Agent Engineering 从经验工程进入科学工程，不是因为使用了更多数学符号，而是因为满足以下条件：

1. **可操纵性**：组件可以被独立干预；
2. **可识别性**：干预没有同时改变关键混杂变量；
3. **可测量性**：存在端到端和中间机制指标；
4. **可重复性**：在预分配样本和严格协议下可复现；
5. **可证伪性**：每个主张有明确失效条件；
6. **交互可见性**：不把非线性组合强行归为加法；
7. **可迁移性**：能够解释或预测跨模型、跨任务、跨预算变化；
8. **决策价值**：测量结果能够改变实际 operator、Bridge 或训练选择。

---

## 11. 组件级量化地图

### 11.1 Bridge 子机制

| 子机制 | 最小干预对照 | 主要结果变量 | 关键混杂 |
|---|---|---|---|
| Hard state authority | 仅上下文状态 vs 外部权威状态 | drift、false completion、resume success | 状态 schema 是否更丰富 |
| Verified transition | 模型自报完成 vs 证据门控提交 | false accept、transition validity | verifier 覆盖率 |
| Audit localization | 自由文本反思 vs structured finding | localization、repair success、recurrence | 给模型的信息带宽 |
| Control write-back | 只评论 vs 更新 control object | 后续重复失败率 | 下一轮 prompt 是否同时变化 |
| Rollback/replay | 覆盖式更新 vs 可撤销提交 | recovery、corruption、time-to-repair | 存储和执行器能力 |
| Observation shaping | 原始日志 vs task-oriented evidence | 定位率、成本、遗漏率 | 是否泄漏答案 |
| Oracle routing | 单一 judge vs oracle ladder | false accept/reject、cost | 不同 Oracle 目标不一致 |

### 11.2 ASO 子机制

| 子机制 | 最小干预对照 | 主要结果变量 | 关键混杂 |
|---|---|---|---|
| Patch vs rewrite | 同候选、同 plan、不同提交接口 | delivery、timeout、collateral error | edit density、长度 |
| Audit vs rewrite | 同候选、同信息、不同 operation | residual localization、completion | 输出长度和任务定义同时变化 |
| Regional vs full scope | 同计划、不同修复半径 | regression、success、cost | 区域耦合程度 |
| Plan + executor | 模型直接交付 vs 提交 plan 后确定性执行 | delivery、format、execution fidelity | executor 正确性 |
| Boundary state | 完整构造 vs compact state + expansion | success、state inference | compact state 是否泄漏答案 |
| Dependency order | 自由顺序 vs topology-aware order | unresolved frontier、rollback | ceiling effect |
| Branching | 单轨 vs 多候选验证后提交 | success、cost、provenance | verifier 质量和额外预算 |
| Stop/escalate | 固定迭代 vs no-progress routing | wasted budget、false stop | 难度估计是否校准 |

---

## 12. 现有聚合失配实验在框架中的位置

当前 patch、rewrite、audit、boundary state 和 budget 实验不是整个 Agent Harness Framework 的证明，而是 ASO 方向的第一批可控证据。

### 12.1 Artifact-v3：稀疏 repair delivery

在冻结的 DeepSeek-V4-Flash 稀疏单 bit 修复协议中：

| 条件 | Patch | Full rewrite | 差异 |
|---|---:|---:|---:|
| 模型自行推断 edit plan，300s | 228/480（47.5%） | 124/480（25.8%） | +21.7 pp |
| 同一 authoritative edit plan，300s | 240/240（100%） | 142/240（59.2%） | +40.8 pp |
| 独立预分配 900s 子集 | 83/120（69.2%） | 52/120（43.3%） | +25.8 pp |

COPY control 为 120/120，说明结果不能简单归因于“模型无法输出长字符串”。更接近的解释是：

```text
读取 edit plan
→ 在正确位置修改
→ 保持所有其他位置
→ 精确重交付完整对象
```

形成了独立的 delivery burden。

这组实验支持一个条件性接口规律：当正确计划已知、修改稀疏、执行器正确、交付风险随脆弱承诺数量增加时，patch 的较小 commitment surface 可以提高预算内系统可靠性。

### 12.2 Artifact-v4：结构优势不自动转化为模型收益

Artifact-v4 在更短对象、五 bit 修复和不同 operator 下显示：

- 无 anchor 的完整构造：13/54（24.1%）；
- full cut-set 正确信息：53/54（98.1%）；
- 等量随机位置正确信息：54/54（100%）；
- compact boundary seed + executor：21/54（38.9%）；
- 五 bit candidate + rewrite：7/54（13.0%）；
- 五 bit candidate + patch：8/54（14.8%）；
- 五 bit candidate + audit：54/54（100%）。

这些结果提供了更重要的边界：

1. 足够的正确答案信息强烈帮助完整构造，但没有识别出结构位置本身相对等量随机正确位置的额外收益；
2. candidate 不会自动成为 full rewrite 的好 scaffold；
3. 同一 candidate 只有连接到结构匹配的 audit operation 时才出现巨大完成优势；
4. v3 的 patch 优势在 v4 的更高 edit density、短对象条件下接近零；
5. 更多预算只产生部分、长度依赖的恢复。

因此，ASO 的正确结论不是：

```text
patch > rewrite
candidate > no candidate
audit > generation
```

而是：

> **模型收益取决于信息、operator、输出责任、对象长度、编辑密度、依赖耦合和预算之间的匹配。**

### 12.3 这些实验已经说明了什么

它们至少证明了 Agent Engineering 中一个长期被忽略的对象值得独立研究：

> **模型面对的 operation interface 本身就是可操纵、可量化、具有巨大效应且高度条件化的实验变量。**

当前工作因此可以被视为：

```text
Agent Harness Framework
└── Action-Space Optimization
    └── Operation-interface experiments
        ├── patch vs rewrite
        ├── candidate + audit vs candidate + rewrite
        ├── boundary information
        ├── deterministic expansion
        └── budget × length × edit density
```

它是整个体系的第一步，而不是终点。

---

## 13. 与现有工程范式的关系

| 范式 | 主要控制对象 | 核心问题 | 与 AHF 的关系 |
|---|---|---|---|
| Prompt Engineering | instruction surface | 如何表达任务？ | 可能改变 ASO 的表示，也可能只是 elicitation |
| Context Engineering | model-visible information | 模型应该看到什么？ | Bridge 管理证据进入与状态写回；ASO 决定当前 operator 需要什么信息 |
| Harness Engineering | runtime component set | 系统包含哪些工作流、工具、记忆和验证？ | AHF 对 Harness 做功能性和因果性重参数化 |
| Audit Engineering | failure localization and write-back | 失败如何变成 control delta？ | 反向 Bridge |
| SGAR | hard-state authority | 什么状态被系统承认？ | 正向 Bridge 和状态提交层 |
| Knowledge Governance | governed task knowledge | 任务知识如何外部化、验证、更新和撤销？ | 为 Bridge 和 ASO 提供控制对象 |
| Mismatch Theory | value loss diagnosis | 价值在哪一个结构站点丢失？ | 为 Harness 路由提供诊断，不是 Harness 的同层组件 |
| Agentic RL | internalized policy optimization | 如何改变模型策略？ | 改变 \(\pi\)，与 inference-time ASO 区分，但可互相内化 |

### 13.1 Harness component 与 Hardness function 的映射

| Harness 组件 | 作为外部能力基座时 | 作为 Hardness 时 |
|---|---|---|
| Tools | 工具是否存在、能做什么 | 工具发现、暴露、参数化、授权、执行和验证 |
| Context | 信息源是否存在 | 信息选择、压缩、证据化和 operator-specific rendering |
| Memory | 是否有持久存储 | 哪些内容成为状态、何时写入、如何撤销和检索 |
| Workflow | 是否能多步运行 | 状态转移、依赖顺序、回路闭合和 no-progress 路由 |
| Orchestration | 是否有多个执行主体 | action-space 分解、路由、并行和聚合策略 |
| Verification | 是否存在检查能力 | Oracle 选择、门控、failure localization 和 commit authority |

这一映射说明：同一个 Harness 组件可能同时包含“能力基座”和“Hardness 控制”两部分。量化实验必须将两者分开。

### 13.2 与六类 mismatch 的关系

六类 mismatch 是失败诊断层；Bridge 和 ASO 是运行时干预层。

```text
Mismatch diagnosis
→ mechanism target
→ Bridge / ASO intervention
→ verified state transition
```

大体上：

- observation-representation、state mismatch 更直接要求 Bridge；
- aggregation、support、fitting-boundary 更常要求 ASO；
- specification mismatch 会同时污染 Bridge 的 verifier 和 ASO 的目标；
- 任一 mismatch 都可能通过两者的组合得到局部缓解。

Bridge 和 ASO 不是第七、第八类 mismatch。

---

## 14. Hardness 的边界与失败模式

### 14.1 强 Hardness 不能创造不存在的语义判别能力

若模型、工具、环境、数据和 Oracle 中都不存在区分正确与错误的能力，Hardness 无法凭空产生真值。它可以：

- 降低不必要的承诺；
- 保留已正确区域；
- 暴露失败证据；
- 改变搜索邻域；
- 防止无证据提交；
- 让人类或外部工具在正确位置介入。

但它不能保证产生模型和外部能力基座之外的新解。

### 14.2 错误的 Hardness 会把错误制度化

- 错误 state schema 会稳定保存错误抽象；
- 错误 verifier 会让系统更稳定地优化错误目标；
- 过窄 action space 会封锁高价值候选；
- 过强局部 patch 约束会阻止必要的全局重构；
- 过度分支会放大成本和 provenance 混乱；
- 过度审计会让系统陷入检查而不行动；
- 过度硬门槛会提高 false rejection；
- 固定路由可能对某一模型有效、对另一模型失效。

### 14.3 Hardness 不保证全局最优或单调收敛

即使每次只提交通过 verifier 的改动，也可能：

- 停在非零局部最小；
- 因 verifier 不完备而接受全局错误；
- 因规格错误而朝错误方向单调前进；
- 因状态表示丢失关键变量而无法继续改善；
- 因 action space 过窄而无法跳出当前盆地。

最安全的主张是：

> Hardness 改善任务结构、状态可治理性和能力兑现条件；它不等于全局最优保证。

### 14.4 组件效应不是固定常数

一个组件的效应可能依赖：

- 模型能力；
- 任务分布；
- 对象长度；
- 编辑密度；
- 候选质量；
- Oracle 带宽；
- 环境可逆性；
- 预算；
- 其他 Hardness 组件。

因此，Agent Harness Science 的目标不应只是得到一个平均提升，而是建立条件化效应曲线和 crossover law。

---

## 15. Agent Engineering 的科学化研究路线

### Phase 1：Action-Space Optimization 的可控实验

当前工作主要处于这一阶段：

- patch vs full rewrite；
- candidate-conditioned audit；
- compact state + deterministic executor；
- operation × output interface；
- edit density × length × budget；
- plan correctness 与 delivery correctness 分离。

目标是证明：action space 不是模糊工程直觉，而是可以独立操纵和量化的系统变量。

### Phase 2：Bridge 子组件的独立量化

下一步可以分别测量：

- hard state 对 state drift 和 false completion 的影响；
- Audit localization 对 repair success 的影响；
- control write-back 对 repeated failure 的影响；
- verifier gate 对 false acceptance 和 cost 的影响；
- rollback、replay、checkpoint 对恢复时间的影响；
- observation shaping 对故障定位和上下文成本的影响。

### Phase 3：Model × Bridge × ASO 的交互矩阵

目标不再是“哪个模型最好”或“哪个 Harness 最好”，而是建立：

```text
哪个模型
在什么 Bridge
配合什么 action geometry
在什么预算下
对哪类任务残差
最有效
```

这一阶段可以揭示：

- 模型排名是否依赖 Harness；
- 弱模型是否从强结构中获益更多；
- 强模型是否能利用更自由的 action space；
- 某些 Hardness 是否只是对模型缺陷的临时补偿；
- 哪些机制可以稳定跨模型迁移。

### Phase 4：建立条件化规律和预测模型

需要从静态效应量进入：

- patch / regional rewrite / full rewrite crossover；
- audit / generation crossover；
- branch width 与 verifier quality 的预算规律；
- state granularity 与恢复成本规律；
- oracle bandwidth 与 audit value 的关系；
- 成功率、成本、方差和风险之间的 Pareto frontier。

### Phase 5：自适应 Agent Harness Optimizer

当组件效应能够被预测后，Hardness 本身可以成为运行时优化对象：

```text
current governed state
+ residual profile
+ model identity
+ budget
+ oracle availability
→ choose Bridge intensity and model-facing operator
```

此时 Agent Runtime 不再依赖固定经验流程，而是根据测得的条件效应进行动态选择。

### Phase 6：把已验证的 Hardness 规律内化到模型

外部 Hardness 产生高质量、可归因的 trajectory 和 failure records 后，可以进一步用于：

- SFT；
- on-policy distillation；
- agentic RL；
- model routing；
- harness-robust training；
- learned state and action-space policies。

外部 Hardness 与内部模型优化由此形成闭环，但二者仍应在实验中保持可区分，否则无法知道能力究竟被内化到了哪里。

---

## 16. 新增 Hardness 轴的准入标准

Bridge 和 ASO 是当前提出的最小功能核心，不主张它们已经穷尽所有可能的 Agent Harness 维度。未来若提出第三个独立轴，应至少满足：

1. **独立控制对象**：它治理的对象不能被 Bridge 或 ASO 充分描述；
2. **独立干预**：在保持其他变量固定时可以被单独改变；
3. **独立失败模式**：存在一类不能通过现有两轴自然解释的系统残差；
4. **可测量机制**：有中间指标，不只依赖端到端分数；
5. **稳定效应**：在多个任务或模型上表现出可复现的条件规律；
6. **非实现细节**：不能只是某个具体工具、数据库或多 Agent 拓扑的名字。

在通过这些标准之前，更合适的做法是把新机制视为 Bridge 或 ASO 的子类、横向约束或外部能力基座。

---

## 17. 命题、证据等级与撤销条件

本文沿用三类证据等级：

- **T：Conditional Theorem** — 在明确假设下可由定义、代数、图结构或程序语义推出；
- **S：Structural Prediction** — 任务结构被明确改变，但模型收益大小需要实验；
- **E：Empirical Claim** — 依赖具体模型、任务、预算和协议。

### 命题 1：模型条件前沿分解（T）

在固定 \(D,X,b,\mathfrak H\) 下：

\[
C^*-J=(C^*-C_\theta)+(C_\theta-J)
\]

是定义上的恒等分解。

**不代表：** \(C_\theta\) 已经可观测，或模型与 Harness 的内部贡献天然可加。

### 命题 2：经验前沿只给出 Harness gap 的下界（T）

已测试配置的最大值不超过真实可达前沿，因此新的 Harness 仍可能继续提高表现。

**撤销条件：** 若把经验最大值误称为真实绝对上限，则该主张失效。

### 命题 3：Bridge 与 ASO 是不同的功能瓶颈（S）

Bridge 治理 action 到状态和 failure 到控制增量；ASO 治理模型面对的 operator 和搜索几何。系统可以在其中一轴强、另一轴弱。

**撤销条件：** 若未来证明两者总能通过同一单一控制对象完全互相还原，则独立分轴需要修改。

### 命题 4：无结构变化的迭代属于同条件分布重复采样（T/S）

若信息、硬状态、动作空间和模型策略都不变，则系统没有引入新的结构性求解机制。

**不代表：** 重复采样没有 best-of-N 价值。

### 命题 5：不存在无条件最优的 action interface（E/S）

v3/v4 结果已经表明 patch 优势依赖 edit density、对象长度、预算和 operation。candidate 也只有与匹配 operator 结合时才产生稳定收益。

**撤销条件：** 若在足够广泛的模型和任务分布上发现某一接口严格支配其他接口，该命题可被收紧。

### 命题 6：组件作用可以通过控制实验部分识别（T/S）

只要组件可操纵、关键混杂被冻结、结果严格评分，并显式估计交互，就可以获得局部因果效应。

**不代表：** 单一 benchmark 上的效应会自动跨域成立。

### 命题 7：Agent Engineering 可以从经验工程进入科学工程（研究纲领）

当组件效应具有可重复估计、交互模型、跨域条件规律和运行时决策价值时，Agent 设计不再只是经验配方。

**撤销条件：** 若组件高度不可分、实验无法稳定复现、效应随任务任意变化且无可预测结构，则科学化只能停留在局部领域。

---

## 18. 最小研究协议

一个符合 Agent Harness Framework 的研究项目，至少应回答：

### 18.1 归因对象

- 本次改变的是模型、外部能力基座、Bridge 还是 ASO？
- 是否有多个对象同时变化？
- 是否能构造最小对照？

### 18.2 状态与残差

- 当前 governed state 是什么？
- 什么证据允许状态转移？
- 任务残差如何表示？
- 一次 action 的进展如何被确认？

### 18.3 接口与责任

- 模型需要承担多少脆弱承诺？
- 哪些步骤可由 deterministic executor 完成？
- 为什么选择 patch、audit、rewrite、branch 或 boundary state？
- 当前 operator 的预期优势和失效条件是什么？

### 18.4 实验控制

- 输入信息、任务实例、候选、预算和 scorer 是否匹配？
- 是否预分配样本？
- 是否区分 plan、delivery、execution 和 verification？
- 是否报告交互和异质性？

### 18.5 结论边界

- 哪些是理论可推导结论？
- 哪些只是结构预测？
- 哪些是模型和协议特定的经验结论？
- 哪个结果会撤销当前主张？

---

## 19. 结论：从 Harness 配方到 Agent Science

Agent Harness Framework 的主要贡献，不是再增加一组 Agent 组件，而是改变 Agent Engineering 的问题形式。

旧的问题通常是：

```text
这个 Agent 应该加入哪些组件？
这个 workflow 看起来是否合理？
多跑几轮会不会更好？
换一个更强模型是否就能解决？
```

新的问题是：

```text
固定外部能力基座后，模型条件前沿在哪里？
当前系统离该前沿还有多少 Harness gap？
残差来自 Bridge、ASO、模型，还是它们的交互？
哪一种 operator 在当前状态、模型和预算下最可能减少经验证残差？
这个效应能否被控制实验重复，并预测到新的任务？
```

其核心框架可以压缩为：

\[
\boxed{
\text{Agent System}
=
\text{Model Policy}
\oplus
\text{Capability Substrate}
\oplus
\text{Bridge}
\oplus
\text{Action-Space Optimization}
}
\]

在固定 Capability Substrate 后：

\[
\boxed{
\text{Observed Residual}
=
\text{Model-Conditioned Gap}
+
\text{Hardness Realization Gap}
}
\]

而在单次运行内部：

\[
\boxed{
\text{ASO chooses the next problem form;}
\quad
\text{Bridge decides whether the result becomes progress.}
}
\]

当前围绕聚合失配进行的 operation-interface 实验，已经证明 action space 可以成为一个独立、可操纵、可量化的 Agent 工程对象。这只是第一步。若状态治理、审计、验证、恢复、上下文、工具接口、编排、预算和安全边界都能按照同样方法获得独立效应、交互效应和迁移规律，Agent Engineering 将不再主要依赖“优秀工程师的经验配方”。

它将开始具备科学工程的基本形态：

- 有明确对象；
- 有可控变量；
- 有中间机制；
- 有效应量和不确定性；
- 有可证伪边界；
- 有跨模型和跨任务规律；
- 能根据测量结果预测并选择下一种系统结构。

> **Agent Engineering 的下一个时代，不只是构造更复杂的 Harness，而是建立关于模型、运行时机制和任务残差之间关系的可测量科学。**

---

## Appendix A：符号表

| 符号 | 含义 |
|---|---|
| \(D\) | 任务分布 |
| \(X\) | 外部能力基座：环境、工具、数据、Oracle、执行器 |
| \(b\) | tokens、时间、工具调用、金钱和风险预算 |
| \(\pi_\theta\) | 基础模型策略 |
| \(\mathcal B\) | Bridge |
| \(\Omega\) | Action-Space Optimizer |
| \(\mathcal H\) | Agent Harness，\((\mathcal B,\Omega)\) |
| \(s_t\) | 潜在真实环境状态 |
| \(o_t\) | 环境观测 |
| \(g_t\) | governed hard state |
| \(c_t\) | 发送给模型的上下文 |
| \(u_t\) | model-facing operator |
| \(a_t\) | 模型提交的 proposal |
| \(f_t\) | failure evidence / audit finding / unresolved obligation |
| \(r_t\) | 当前任务残差 |
| \(J\) | 系统期望效用 |
| \(C_\theta\) | 模型条件能力前沿 |
| \(C^*\) | 给定外部能力基座上的理想系统前沿 |

---

## Appendix B：最小 2×2×2 实验矩阵

| Model | Bridge | ASO | 用途 |
|---|---|---|---|
| \(M_0\) | \(B_0\) | \(O_0\) | 全基线 |
| \(M_0\) | \(B_1\) | \(O_0\) | 弱模型上的 Bridge 主效应 |
| \(M_0\) | \(B_0\) | \(O_1\) | 弱模型上的 ASO 主效应 |
| \(M_0\) | \(B_1\) | \(O_1\) | 弱模型上的组合效应 |
| \(M_1\) | \(B_0\) | \(O_0\) | 模型提升基线 |
| \(M_1\) | \(B_1\) | \(O_0\) | 强模型上的 Bridge 主效应 |
| \(M_1\) | \(B_0\) | \(O_1\) | 强模型上的 ASO 主效应 |
| \(M_1\) | \(B_1\) | \(O_1\) | 完整系统和三阶交互 |

对每个格子应至少报告：

- strict success；
- cost / latency；
- residual reduction；
- failure class；
- plan correctness；
- delivery correctness；
- verification outcome；
- state transition validity；
- instance-level uncertainty。

---

## Appendix C：一页式摘要

```text
问题：
端到端 Agent 分数混合了模型、工具、环境、状态、接口、验证和预算，
导致 Harness 只能被当作经验配方，组件作用无法归因。

固定条件：
任务分布 D + 外部能力基座 X + 预算 b + 评价标准

系统：
Model πθ + Hardness H
H = Bridge B + Action-Space Optimization Ω

Bridge：
proposal → execution → observation → verification → state commit
failure → evidence → localization → control delta → write-back

ASO：
选择模型下一次面对的 operator、表示、范围、责任和搜索邻域
目标是最大化经过验证的任务残差下降，而不是只提高当前回答正确率

系统残差：
C* - J = (C* - Cθ) + (Cθ - J)
          模型条件缺口      Harness 兑现缺口

结构性迭代：
只有信息、硬状态、动作空间或模型策略发生变化，
迭代才获得新的结构性求解来源；否则主要是重复采样。

量化：
paired controls → factorial design → interaction → Shapley attribution
→ cross-model transfer → budget/success curves → adaptive harness routing

目标：
Agent Engineering 从“提出一个有效框架”
转向“测量每个机制何时有效、贡献多少、与什么交互、能否迁移”。
```

---

## References

1. Dong, Guanting, et al. *Towards Long-Horizon Agents: A Survey — Foundation, Evolution, Harness, Optimization, Application, and Frontier*. 2026.
2. Wang, Xinyun. [Audit Engineering: From Generation–Verification Asymmetry to General Agent Governance](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.md).
3. Wang, Xinyun. [State-Governed Agent Regime](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.md).
4. Wang, Xinyun. [Aggregation Mismatch and Compositional Governance in LLM Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.md).
5. Wang, Xinyun. [Aggregation Mismatch: Derivable Claims, Proof Conditions, and Implications for Agent Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-theoretical-claims-agent-engineering.md).
6. Wang, Xinyun. [Aggregation Mismatch Artifact-v4: Experimental Evidence, Theory Gaps, and Agent Implications](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-v4-claims-theory-gap.md).
7. Wang, Xinyun. [Patch vs. Full Rewrite: A Controlled Experiment on Sparse Repair Delivery](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/patch-vs-full-rewrite-controlled-experiment.md).
