# 残差控制：Agent 中从测量、路由到目标有效修复的统一框架

## 摘要

当前的大模型与 Agent 评价，主要回答两个问题：最终结果是否正确，以及整体任务成功率是多少。但这两个指标无法解释：系统距离目标还差什么、这些差距能否被外部结构补偿、应该调用哪一种修复机制，以及修复当前问题是否会损害其他目标。

同样的错误结果，可能来自完全不同的失败机制。模型回答错误，可能是没有获得关键事实，也可能是事实存在但没有进入决策，或者局部判断正确却在聚合、选择、实现或验证阶段失败。仅凭模型的 thinking、output 和自我解释，通常无法唯一恢复这些内部机制。

因此，残差研究不应把主要目标设定为“识别模型内部为什么失败”，而应转向一个可操作、可验证的问题：

> **从机器事实建立任务残差，通过受控修复干预测量残差的修复响应，在分层、多目标约束下寻找成本最低、证据充分的目标有效修复路径。**

在这一框架中：

- 机器事实负责证明残差存在；
- LLM 可选地总结残差、提出解释和候选修复；
- Oracle 负责检测、引导和裁决残差是否关闭；
- mismatch 路由负责改变当前问题结构，使难以直接修复的残差重新变得可观察、可定位、可验证；
- Audit 负责提出、攻击和审查修复；
- SGARX 负责冻结状态、执行修复、重放、回滚和提交；
- 父级目标与 closure guards 负责防止局部修复转化为 overfit、回归或残差转移。

这套结构可以统一 LLM step、阶段 artifact 和完整 Agent 轨迹上的残差处理，并将 Agent Engineering 从“失败后再试一次”，推进到“基于残差结构进行有界、可验证的控制”。

---

# 一、问题的起点：同样的错误，不等于同样的残差

考虑一个简单问题：

> 100元纸币和一条健康的小鱼同时掉进适合鱼生存的水中，应该先捞哪一个？

如果模型回答“小鱼”，最终结果是相同的，但失败过程可能完全不同：

- 模型没有激活“鱼能够在水中生存”这一事实；
- 模型知道鱼会游泳，但没有把它绑定到当前决策；
- 模型已经想到鱼没有危险，却被“生命优先”的默认启发式覆盖；
- 模型的局部判断正确，但没有完成全局比较；
- thinking 中选择了100元，最终输出却写成小鱼；
- 模型能够发现矛盾，却无法稳定完成修复；
- 模型理解了事实，但任务的真实决策目标没有被明确表达。

这些失败需要的改进完全不同：

- 缺少事实，需要检索、工具或模型能力；
- 事实未激活，需要上下文重组或显著性增强；
- 目标不清楚，需要规格契约；
- 局部正确但全局错误，需要聚合、比较或重新规划；
- 判断正确但输出错误，需要结构化实现和执行检查；
- 无法发现错误，需要外部审计；
- 能发现但不能修改，需要局部 patch、回滚或模型升级。

因此，最终准确率只测到了一个结果差距，却没有测到真正决定工程决策的结构：

> **这个残差对什么干预敏感，哪一种外部控制可以补偿它，以及补偿成本是多少。**

---

# 二、残差研究需要区分三个对象

## 1. 可观测的任务残差

任务残差是当前状态、artifact 或结果相对于目标契约仍未满足的部分。

设目标由一组条款构成：

\[
G=\{g_1,g_2,\ldots,g_n\}
\]

当前系统状态为 \(s_t\)，则可观测残差可以表示为：

\[
R(s_t)=\{g_i\mid O_i(s_t)\neq PASS\}
\]

其中 \(O_i\) 是用于验证目标条款 \(g_i\) 的 Oracle。

生产系统不宜只使用简单的 `PASS/FAIL`，而应至少区分：

| 状态 | 含义 |
|---|---|
| `OPEN` | 条款尚未被满足 |
| `VIOLATED` | 已有机器事实证明条款被违反 |
| `PROVISIONAL` | 暂时没有发现问题，但缺少关闭证据 |
| `UNVERIFIABLE` | 当前工具、预算或反馈条件下无法可靠验证 |
| `CLOSED` | 已通过完整关闭条件 |

这一层残差可以由测试、执行结果、文件状态、状态机、环境反馈、规则检查或人工裁决建立。

## 2. 不可直接观测的内部残差机制

模型为什么留下了这些残差，通常属于潜在机制：

\[
Z_{\text{residual}}
\]

我们能够看到的 thinking、output、自我解释，都只是潜在机制的下游表现：

\[
Z_{\text{residual}}
\rightarrow
\{\text{thinking},\text{output},\text{self-report}\}
\]

不同内部过程可能产生相同的可见轨迹。因此，仅凭模型自述：

> “我刚才没有注意到鱼会游泳。”

不能证明它真的没有注意到。它也可能是在看到错误结果后生成了一段合理解释。

LLM 的自我总结仍然有价值，但其正确定位是：

- residual claim 的语义化；
- candidate mismatch 的提出；
- repair hypothesis 的生成；
- 对修复方案的解释。

它不能成为残差存在与否或残差关闭与否的最终权威。

## 3. 可通过干预测量的修复响应

真正稳定可测的是：对同一个机器残差施加不同干预以后，系统表现如何变化。

设残差事件为 \(e\)，冻结状态为 \(s_e\)，修复算子为 \(a\)：

\[
s_e\xrightarrow{a}s_{e,a}
\]

执行修复后，重新运行原始 Oracle 和父级 closure guards，可以得到：

\[
Y(e,a)=
\left(
O_{\text{source}},
O_{\text{goal-valid}},
\Delta\mathbf R,
C(a),
E(a)
\right)
\]

其中：

- \(O_{\text{source}}\)：形成原始残差的 Oracle 是否通过；
- \(O_{\text{goal-valid}}\)：完整目标约束是否通过；
- \(\Delta\mathbf R\)：各层、各目标维度的残差变化；
- \(C(a)\)：token、时间、工具调用和人工成本；
- \(E(a)\)：新增的验证证据。

在预算 \(B\) 下，残差事件的修复响应可以定义为：

\[
\Sigma_B(e)
=
\left\{
Y(e,a)
\mid
a\in\mathcal A_R,\ C(a)\leq B
\right\}
\]

这就是该残差的**修复响应面**或 **repairability profile**。

它不宣称恢复了模型内部唯一真实机制，而是回答了更有工程价值的问题：

> 哪种干预能够关闭多少残差，成本多高，是否稳定，是否造成新的问题。

---

# 三、Agent 残差不是一个标量，而是分层多目标残差场

LLM 单轮任务通常只关注一个输出与目标答案之间的距离。Agent 则包含多个 step、状态转移、阶段 artifact 和长期目标，其残差至少分布在三个正交维度上：

\[
\text{残差}
=
\text{残差载体}
\times
\text{评价视野}
\times
\text{目标维度}
\]

## 1. 残差载体

| 载体 | 典型问题 |
|---|---|
| 单轮输出 | 文本、代码、SQL、计划是否满足本轮要求 |
| 状态转移 | action 是否真正造成了预期状态变化 |
| 阶段 artifact | IR、方案、代码 patch、研究草稿是否合格 |
| 完整轨迹 | 多阶段组合是否完成最终委托 |

状态转移残差尤其重要。一个 action 即使生成了正确文本，如果没有造成预期状态变化，仍然不是有效的 Agent action：

\[
R_t^{\text{transition}}
=
d\left(
s_{t+1},
T^*(s_t,a_t)
\right)
\]

例如文件已经生成但没有写入任务状态，测试已经通过但 stage 没有完成验证，工具调用返回失败但 Agent 仍然继续使用旧结果，都属于状态转移残差。

## 2. 评价视野

### Step 结果残差

当前 LLM 输出或工具结果距离 step goal 还有什么差距。

这对应最局部、最容易测量的残差。

### Stage artifact 契约残差

阶段 artifact 是否完成了该阶段应该承担的职责。

例如一个 Text2SQL Semantic IR 即使最终偶然生成了正确 SQL，也可能缺少：

- metric 定义；
- 聚合粒度；
- 时间窗口；
- schema 依据；
- 歧义记录；
- 不确定性表达。

此时最终结果可能正确，但阶段 artifact 仍然不合格。

### Stage artifact 的总目标残差

当前 artifact 对最终目标可达性、成功概率和后续修复成本造成了什么影响。

设从 artifact \(a_t\) 出发，在剩余预算 \(B\) 内可以采用的后续策略为 \(\Pi_B\)：

\[
V_t(a_t;B)
=
\max_{\pi\in\Pi_B}
\mathbb E[
G(\text{final outcome})
\mid
a_t,\pi
]
\]

则阶段 artifact 的全局残差可以表示为：

\[
R_t^{\text{global}}(B)
=
V_t^*(B)-V_t(a_t;B)
\]

这意味着，阶段 artifact 的全局质量不是一个固定属性，而取决于：

- 下游 Agent 的能力；
- 剩余预算；
- 可用工具；
- 修复动作空间；
- Oracle 带宽；
- 是否允许回滚和重放。

一个不完整 artifact 对强 Agent 可能只是小问题，对弱 Agent 却可能使最终目标不可达。

### Task 残差

完整轨迹距离最终委托目标还有什么差距，包括交付质量、可靠性、成本、风险和证据。

### Goal specification 残差

系统当前显式优化、验证的目标契约，与人类真正目标之间还有多少差距。

设真实目标为 \(G^*\)，系统当前可执行契约为 \(\hat G\)：

\[
R_{\text{spec}}=G^*\setminus\hat G
\]

Text2SQL 中“当前结果和 gold 一致”可能已经写入 evaluator，但“必须通用、不得 overfit、不得依赖 case 身份、不得把 SQL 语义写进代码”最初可能只是模糊要求。此时 evaluator 可以判定成功，而真实目标仍然失败。

## 3. 目标维度

同一个 residual 还可能同时位于不同目标维度：

\[
\mathbf R=
\left(
R_{\text{correctness}},
R_{\text{generality}},
R_{\text{architecture}},
R_{\text{regression}},
R_{\text{cost}},
R_{\text{evidence}}
\right)
\]

一个修复可能降低当前正确性残差，却增加通用性和架构残差。因此，Agent 残差不能被压缩成单一分数。

---

# 四、残差变化不只有“关闭”一种

修复后观察到的残差变化至少应区分五种情况。

## 1. 残差关闭

原始目标缺口被真正消除，其他目标维度没有显著恶化。

## 2. 残差补偿

上游错误仍然存在，但下游通过额外逻辑暂时抵消了它。

这种状态可能最终通过，却积累了额外复杂度和修复债务。

## 3. 残差转移

一个目标维度改善，另一个目标维度恶化。

Text2SQL 中的 overfit patch 通常表现为：

\[
R_{\text{case}}\downarrow
\]

同时：

\[
R_{\text{generality}}\uparrow
\]

\[
R_{\text{architecture}}\uparrow
\]

\[
R_{\text{regression-risk}}\uparrow
\]

## 4. 残差延迟

问题在当前 stage 暂时不可见，但被传播到后续阶段重新暴露。

## 5. 残差掩盖

Evaluator 无法继续观察到问题，但真实目标仍然未满足。

因此：

> 原始 Oracle 通过，只能证明原始局部残差已关闭，不能自动证明整个修复目标有效闭合。

---

# 五、机器事实是残差的起点

可靠的生产流程应当坚持以下权威关系：

```text
机器事实建立 residual
→ LLM 可选地总结和解释
→ Audit 提出和攻击修复
→ SGARX 安全执行修复
→ Oracle 裁决是否关闭
```

可以凝练为：

> **LLM 提议，Audit 质疑，SGARX 执行，Oracle 裁决。**

LLM 不负责宣布：

- 有没有残差；
- 残差已经关闭；
- 修复是否通用；
- stage 是否可以完成。

这些权威必须属于外部机器事实、目标契约和状态治理。

一个 residual record 至少应包含：

```json
{
  "residual_id": "r-001",
  "snapshot_hash": "state-hash",
  "scope": "step | stage | global | task | specification",
  "goal_dimension": "correctness | generality | architecture | regression | cost | evidence",
  "goal_clause": "目标条款",
  "machine_fact": "形成残差的机器证据",
  "observed_layer": "错误被发现的位置",
  "candidate_origin_layers": ["可能的起源层"],
  "repair_locus": ["code", "tool", "llm", "harness", "model", "specification", "human"],
  "oracle_detect": "sufficient | weak | absent",
  "oracle_search": "sufficient | weak | absent",
  "oracle_close": "sufficient | weak | absent",
  "candidate_mismatches": [],
  "parent_guards": [],
  "status": "OPEN"
}
```

这里需要特别区分：

\[
\text{observed layer}
\neq
\text{candidate origin layer}
\neq
\text{repair locus}
\]

例如：

```text
观测层：最终 SQL 执行结果错误
候选起源层：Semantic IR 的 metric grain
最佳修复位置：metric contract
```

如果只记录一个“失败层级”，系统很容易直接修改最终 SQL，关闭表面错误，却留下上游能力残差。

---

# 六、Oracle 不是简单的“有或没有”

Oracle 是否充足，必须相对于具体 residual 和具体决策判断。

## 1. 检测充足

足以证明 residual 存在。

例如：

- 编译失败；
- pytest 失败；
- SQL execution 与 gold 不一致；
- 文件未生成；
- 状态哈希不一致。

## 2. 搜索充足

足以引导修复或比较两个修复方案哪个更好。

只有 `PASS/FAIL` 的 Oracle 可能检测充分，却无法提供局部方向。能够指出 join、filter、aggregation 或状态转移位置的反馈具有更高搜索带宽。

## 3. 关闭充足

足以证明 residual 可以被安全关闭，并且没有通过投机、残差转移或破坏父级目标获得通过。

Text2SQL 的 gold execution 对当前 case 正确性是强 Oracle，但对以下目标不是充分关闭 Oracle：

- 通用性；
- 反 overfit；
- 架构合规；
- 邻域回归；
- 真正能力增量。

因此，一个 Oracle 还应描述：

\[
O(r)=
(
\text{fidelity},
\text{bandwidth},
\text{coverage},
\text{cost},
\text{gameability}
)
\]

即可靠度、反馈带宽、目标覆盖、调用成本和可投机性。

Oracle 必须按 residual 分量建立，不能说“这个任务有 Oracle”，因为同一个任务中：

- 当前 case 结果可能有强 Oracle；
- 通用性只有弱 Oracle；
- 架构边界可通过静态检查部分验证；
- 真正未知分布能力可能暂时不可验证。

---

# 七、Step 级别也可能拥有不同类型的 Oracle

LLM step 并不是天然没有 Oracle。

## 本地 Oracle

直接验证当前 step：

- JSON Schema；
- 编译器；
- 单元测试；
- SQL 执行；
- 文件存在性；
- 状态转移检查；
- 阶段契约。

## 延迟 Oracle

当前 step 没有独立 gold，但问题在下游暴露。

例如：

```text
Semantic IR
→ 没有 gold IR
→ 最终 SQL execution 失败
```

此时可以通过冻结、替换该 artifact、重放下游流程，判断该 step 是否构成关键残差。

## 无可靠 Oracle

开放式研究、战略判断、故事结构设计等任务，可能没有充分的本地或下游 Oracle。

这时只能：

- 构造局部代理 Oracle；
- 获取更多 evidence；
- 使用反例攻击；
- 请求人类裁决；
- 标记为 `PROVISIONAL` 或 `UNVERIFIABLE`。

没有可靠 Oracle，不能被解释为“没有发现问题，因此已经关闭”。

---

# 八、Oracle 与 mismatch 不是本体上的互斥类别，但可以形成操作性路由

严格来说：

- Oracle 描述系统怎样获得反馈；
- mismatch 描述为什么当前生成—验证 regime 不能稳定关闭残差。

一个代码错误可以同时具有强 Oracle 和聚合失配。

但在生产路由中，可以把 residual 分成两种操作状态。

## Oracle-addressable residual

在当前任务表达、状态表示、动作空间、模型和预算下，现有 Oracle 足以驱动残差闭合。

\[
r\in R_O
\iff
\exists \pi,\ C(\pi)\leq B,
\quad
P(\operatorname{close}(r)\mid O,\pi)\geq\theta
\]

此时不需要改变问题结构，可以直接：

```text
局部修改
→ 运行 Oracle
→ 根据反馈继续
```

## Mismatch-constrained residual

在当前 regime 中，即使有 Oracle，普通修复循环仍不能稳定关闭残差。

设当前 regime 为：

\[
\Gamma=
(
G,S,\Omega,A,M,O,H
)
\]

分别表示目标、状态、观测、动作空间、模型、Oracle 和 Harness。

Mismatch 路由的作用不是继续在 \(\Gamma\) 中重复搜索，而是执行结构转换：

\[
\Gamma\xrightarrow{\phi_m}\Gamma'
\]

使原本难以处理的 residual 在新 regime 中重新变得可观察、可定位和可验证。

因此：

> **Oracle repair 是在当前空间内解决问题；mismatch repair 是改变空间，使问题重新能够被 Oracle repair 解决。**

---

# 九、复合残差需要先剥离 Oracle 可处理部分

现实中的 residual 通常不是纯 Oracle 或纯 mismatch，而是复合结构：

\[
R=
R_O
\oplus
R_M
\oplus
I(R_O,R_M)
\]

其中 \(I\) 表示不同残差之间的交互。

例如一个代码 step 可能同时包含：

- JSON 字段错误；
- 核心算法错误；
- 规格理解遗漏；
- case-specific 特殊分支。

合理流程不是一次性给它贴上“聚合失配”标签，而是进行顺序剥离：

```text
形成复合 residual
→ 提取已有充分 Oracle 的部分
→ 执行有界低成本修复
→ 重跑原始 Oracle
→ 重新计算剩余 residual
→ 对稳定剩余项进行 mismatch 路由
→ mismatch 路由产生新子目标和新 Oracle
→ 返回 Oracle 修复循环
```

Mismatch residual 可以被操作性定义为：

> **在当前 regime 和给定直接修复预算内，无法被已有 Oracle—repair loop 稳定关闭的剩余残差。**

这避免了把 mismatch 分类完全建立在 LLM 的主观解释上。

典型的 no-progress 信号包括：

- 多轮修复没有残差下降；
- 重复生成相同错误；
- Oracle 只能返回低带宽 `FAIL`；
- 正确候选始终不能生成；
- 修复持续制造新的回归；
- 当前 case 通过，但父级目标不断失败；
- 系统在几个状态之间震荡。

---

# 十、六类失配是六种 regime 转换和 Oracle 化机制

六类失配不应只被当作错误 taxonomy，而应被定义成六类结构性修复操作。

| Mismatch | 当前结构问题 | Regime 转换 | 形成的新 Oracle |
|---|---|---|---|
| 规格失配 | 目标、约束和优先级不明确 | 建立目标契约、边界和反例 | contract checks、负例、优先级检查 |
| 状态失配 | 观测不等于真实动态状态 | 状态刷新、硬状态、回放、状态机 | state invariant、transition check |
| 观测—表征失配 | 关键信息没有进入有效表示 | 增加观测通道、结构化转导、降噪 | evidence checks、字段完整性 |
| 支持失配 | 有效候选处于极低概率区域 | 扩大候选、变异重组、模型升级 | candidate verifier、候选覆盖 |
| 聚合失配 | 局部正确不能组合成全局正确 | 分解、计划、候选比较、局部 patch | intermediate invariants、全局一致性 |
| 拟合边界失配 | 修复当前区域损害邻域能力 | 隔离、路由、适用域、回归保护 | regression、canary、routing guards |

Mismatch 路由的共同目标可以概括为：

# Oracle 化

即把一个难以直接处理的结构性 residual 转化成若干更明确的 Oracle-addressable residual：

\[
R_M
\xrightarrow{\text{mismatch transformation}}
\{r_1^O,r_2^O,\ldots,r_k^O\}
\xrightarrow{\text{oracle-guided repair}}
0
\]

例如一个模糊的“SQL 语义错误”经过规格路由后，可以被拆成：

- metric 是否明确；
- 聚合粒度是否明确；
- 时间范围是否明确；
- join 语义是否明确。

这些子问题更容易建立局部 Oracle。

六类失配在运行时应允许多标签：

```text
primary candidate: aggregation mismatch
secondary candidate: specification mismatch
possible upstream candidate: state mismatch
```

它们是候选修复假设，不是模型内部真实机制的最终判决。

---

# 十一、修复位置必须独立路由

即使 residual 有充分 Oracle，也不代表应该默认再次调用 LLM。

可能的 repair locus 包括：

| 修复位置 | 典型 residual |
|---|---|
| 确定性代码 | 格式、路径、机械 schema 错误 |
| 工具层 | 超时、重试、权限、外部调用失败 |
| LLM | 语义、候选、规划、局部 patch |
| Agent Harness | 状态、路由、预算、阶段边界 |
| 模型层 | 当前模型无法产生必要结构 |
| 规格层 | 目标和约束不完整 |
| 人类 | 高风险、不可验证、价值判断 |

因此流程应是：

```text
Oracle-addressable residual
→ 选择最便宜、最确定的 repair locus
→ code / tool / LLM / harness / model / specification / human
```

LLM 是修复执行器之一，而不是所有 residual 的默认承担者。

---

# 十二、LLM 级残差路由与 Agent 级残差路由是同一个递归结构

没有必要为 LLM 建立一套独立的“内部心理残差理论”。

每一个 LLM step 都可以被视为一个局部 Agent 任务：

```text
Step Goal
→ LLM output / artifact
→ 机器事实或下游反馈
→ Step residual
→ Oracle 剥离或 mismatch 路由
→ 修复
→ 重新验证
```

当 repair locus 确定为 LLM 时，可以进一步选择一组操作性修复算子：

| LLM 修复类别 | 典型处理 |
|---|---|
| 信息可用性 | retrieve、re-observe、state refresh |
| 信息绑定 | 约束提取、结构化表示、降低噪声 |
| 候选生成 | candidate expansion、decomposition、模型升级 |
| 候选选择 | global comparison、verifier、对抗审计 |
| 实现 | structured output、局部 patch、动作约束 |
| 验证与修复 | replay、外部 corrective、独立 auditor |

这些类别表示的是：

> residual 对哪一类干预敏感。

而不是：

> 已经证明模型内部究竟发生了什么。

Step 关闭以后，还必须重新计算 Stage 和 Task residual。否则局部通过可能只是把问题转移到了父级目标。

---

# 十三、修复方案通常不稀缺，目标有效修复才稀缺

Text2SQL 的 overfit 案例揭示了残差修复中最重要的陷阱。

已知当前 case 的 gold 以后，让当前结果正确通常很容易：

```python
if current_case_matches_special_pattern:
    return expected_behavior
```

或者更隐蔽地：

- 使用特定表名；
- 利用 schema 身份；
- 根据问题中的特殊短语触发规则；
- 把业务语义写入确定性代码；
- 增加只对当前 join 生效的启发式。

这些方案都能关闭当前结果残差。

定义：

\[
\mathcal P_{\text{result}}
=
\{
P:
O_{\text{source}}(P)=PASS
\}
\]

但真正满足目标的修复集合小得多：

\[
\mathcal P_{\text{goal-valid}}
=
\{
P\in\mathcal P_{\text{result}}:
G(P)=1
\}
\]

还可以进一步区分：

\[
\mathcal P_{\text{result}}
\supseteq
\mathcal P_{\text{stage}}
\supseteq
\mathcal P_{\text{global}}
\supseteq
\mathcal P_{\text{goal-valid}}
\supseteq
\mathcal P_{\text{certified}}
\]

分别表示：

- 当前结果通过；
- 阶段 artifact 合格；
- 对全局目标有益；
- 满足通用性、架构和反 overfit 约束；
- 拥有足够证据允许安全关闭。

因此：

> **Result reachability 不等于 goal-valid reachability。**

搜索系统最容易找到的是第一条让当前 Oracle 通过的路径，但第一条通过路径往往不是第一条合法路径。

定义：

\[
C_{\text{hit}}^*
=
\min_{P:O_{\text{source}}(P)=PASS} C(P)
\]

\[
C_{\text{valid}}^*
=
\min_{P:\operatorname{Accept}(P)=1} C(P)
\]

二者之差：

\[
H_{\text{goal}}
=
C_{\text{valid}}^*-C_{\text{hit}}^*
\]

反映了从“让当前结果正确”到“找到目标有效修复”之间的真实难度。

---

# 十四、多目标硬约束不能简单压成一个 reward

Text2SQL 的真实目标通常是一个合取结构：

\[
G=
G_{\text{correct}}
\land
G_{\text{general}}
\land
G_{\text{no-overfit}}
\land
G_{\text{architecture}}
\land
G_{\text{regression-safe}}
\land
G_{\text{evidence}}
\]

这些目标不能被简单写成：

\[
Reward
=
100\times\text{current case pass}
-
5\times\text{overfit risk}
\]

因为强局部奖励会覆盖抽象、较弱的长期约束。

更合理的方式是：

1. 先进入满足所有硬约束的合法修复空间；
2. 再在合法修复中优化成本、稳定性、修改规模和证据强度。

修复接受条件可以表示为：

\[
\operatorname{Accept}(P)
=
O_{\text{source}}
\land
O_{\text{stage}}
\land
O_{\text{parent}}
\land
O_{\text{regression}}
\land
O_{\text{anti-overfit}}
\land
O_{\text{architecture}}
\land
O_{\text{evidence}}
\]

因此修复叶节点至少应分成：

| 状态 | 含义 |
|---|---|
| `FAIL` | 原始 residual 未关闭 |
| `LOCAL_PASS` | 原始 Oracle 通过，但父级约束或 closure guards 失败 |
| `GOAL_VALID_PASS` | 完整目标约束通过 |
| `CERTIFIED` | 目标有效，并具有足够证据允许关闭 |

---

# 十五、反复 overfit review 本质上是目标规格学习

“必须通用、不可 overfit”最初只是一个抽象自然语言要求。

每次 Codex 产生一种 overfit 修复，人类审计都会发现一种新的非法捷径：

```text
不得依赖 case 特征
不得依赖数据库身份
不得依赖表名和列名身份
不得把 SQL 语义写入 Python
不得增加只对当前样例生效的特殊分支
规则必须由通用语义条件触发
```

每一次 review 都在收紧合法修复空间：

\[
\mathcal P_{t+1}
=
\mathcal P_t\setminus\mathcal B_t
\]

其中 \(\mathcal B_t\) 是本轮发现的一类非法修复区域。

这一过程可以理解为：

- 反例驱动的规格收紧；
- cutting-plane 式搜索空间裁剪；
- 从 extensional goal 向 intensional goal 的逼近。

Gold 只定义了：

```text
这个输入应当对应这个输出。
```

而真正的能力目标是：

```text
系统应当依据一套通用机制解决一类未知问题。
```

单个 gold 不能唯一确定正确机制。反复 overfit review 实际上是在逐渐外化“什么样的成功不应被接受”。

---

# 十六、修复产物应当携带证据

一个可靠修复不应只是 patch \(p\)，而应是：

\[
(p,E)
\]

其中 \(E\) 是验证证据包，例如：

```text
当前 case 通过
历史 regression 通过
问题 paraphrase 通过
schema/table/column 重命名通过
邻域正例通过
邻域负例未误触发
反泄漏扫描通过
架构审计通过
```

这可以称为：

# Evidence-Carrying Repair  
# 携带证据的修复

证据不能证明修复在所有未知分布上绝对通用，但可以显著提高修复的可证伪性和安全闭合能力。

---

# 十七、最小修复路径必须是最小“目标有效”修复路径

普通修复搜索可能只优化：

\[
P^*
=
\arg\min_P C(P)
\quad
\text{s.t.}
\quad
O_{\text{source}}(P)=PASS
\]

真正需要的是：

\[
P_{\text{valid}}^*
=
\arg\min_P
\left[
C(P)+\lambda D(P)+\mu D_{\text{repair}}(P)
\right]
\]

满足：

\[
\operatorname{Accept}(P)=1
\]

其中：

- \(C(P)\)：token、时间、工具和人工成本；
- \(D(P)\)：对已有正确结构的修改规模；
- \(D_{\text{repair}}(P)\)：修复引入的未来修复债务。

阶段 artifact 的修复债务可以表示为：

\[
D_t^{\text{repair}}
=
C_t^*(a_t)-C_t^*(a_t^{\text{ideal}})
\]

即当前 artifact 相比理想 artifact，使下游达到目标所需的最低成本增加了多少。

这解释了为什么两个最终都成功的轨迹仍然可能质量差异巨大。

---

# 十八、残差修复与 MCTS 的关系

残差修复确实可以被视为一个搜索问题：

```text
失败状态
→ 修复算子
→ 新状态
→ Oracle 反馈
→ 继续、回滚或完成
```

但它不是普通的从头解题搜索。

普通搜索寻找任意正确解；残差修复搜索需要：

- 保留已有正确结构；
- 尽量局部修改；
- 控制回归；
- 满足父级目标；
- 维护硬状态；
- 携带验证证据。

因此，搜索边应当是语义修复算子，而不是任意自然语言 thought。

MCTS 可以作为后续算法，但不能替代以下基础设施：

- 明确的 residual state；
- 语义修复算子；
- Goal-valid terminal condition；
- closure guards；
- freeze、fork、replay 和 rollback；
- 无进展和预算控制。

## 无限预算并不无条件保证成功

只有满足以下条件，搜索成功概率才可能随预算增加趋近于1：

- 有效修复在动作空间中可达；
- 存在有限长度修复路径；
- 必要动作具有非零生成概率；
- 搜索保持充分探索；
- Oracle 能识别成功；
- 状态可以回滚或重放；
- 必要信息没有丢失。

如果有效修复在模型支持中概率为零：

\[
P(a^*\mid s)=0
\]

那么增加预算也无法生成它。

无限预算只能缓解采样不足，不能自动解决：

- 零支持；
- 错误动作空间；
- Oracle 失明；
- 状态丢失；
- 规格错误；
- 搜索目标被 overfit 奖励劫持。

---

# 十九、已知结果与未知结果是两条不同研究轨道

## 1. 已知结果：用于残差研究

实验系统知道 gold，但 repair proposer 不应直接看到完整答案。

实验系统可以控制向修复 Agent 暴露多少 Oracle 信息：

```text
完整差异
→ 局部错误位置
→ 结构化错误类别
→ 连续得分
→ 二值 pass/fail
→ 噪声偏好
→ 无外部反馈
```

这一轨道用于测量：

- 哪些有效修复路径存在；
- 模型是否能提出它们；
- Router 是否能识别它们；
- 最低修复成本；
- 需要多少 Oracle 带宽；
- 是否存在明显 shortcut gap；
- 哪类修复会造成残差转移。

Gold 应当对实验系统可见，而不是直接暴露给修复模型。否则任务容易退化为根据已知答案编造一条合理解释。

## 2. 未知结果：用于生产应用

结果未知时，又需要区分：

### 结果未知，但成功判据可靠

例如：

- 代码有完整测试；
- 数学证明有 proof checker；
- 工具有明确环境反馈；
- SQL 有可靠执行 Oracle。

这仍然是一个可验证搜索问题。

### 结果未知，成功判据也不可靠

例如：

- 研究方案是否真正新颖；
- 文章是否真正优秀；
- 投资策略是否具有真实 alpha；
- 开放式 Agent 是否真正完成复杂委托。

此时系统需要同时维护：

- residual hypothesis；
- candidate mismatch；
- 修复方案；
- 证伪方案；
- 新 evidence；
- Oracle 可靠性；
- 剩余预算和风险。

动作不只是“修复”，还包括：

```text
诊断
获取证据
构造反例
增强 Oracle
执行修复
运行验证
回滚
升级模型
请求人类
接受剩余风险
```

这更接近 belief-space search，而不是单纯答案树搜索。

---

# 二十、离线研究与在线应用之间的桥

在已知结果场景中，可以进行昂贵修复搜索，得到：

\[
(s_t,a_t,\Delta\mathbf R,C_t,E_t,\text{success})
\]

由此学习：

### Repair policy

\[
\pi_R(a\mid r,s,G,O,B)
\]

给定残差、状态、目标、Oracle 和预算，优先尝试哪个修复算子。

### Repair value

\[
Q_R(s,a)
=
P(
\text{在预算内目标有效关闭}
\mid s,a
)
\]

### Residual value

\[
V_R(s)
=
P(
\text{从当前状态仍可在预算内修复}
)
\]

生产阶段不再枚举所有路径，而是利用离线形成的修复先验：

```text
当前 residual
→ 选择少量高价值修复或诊断动作
→ 执行
→ Oracle 验证
→ 更新 residual
→ 继续、回滚、换路由或停止
```

因此，残差测量最终应服务于在线残差控制，而不只是形成一套错误分类。

---

# 二十一、统一的生产残差闭环

完整生产流程可以组织为：

```text
Goal contract + hard state + current artifact
                        ↓
机器事实形成 residual evidence
                        ↓
建立 machine-grounded residual record
                        ↓
识别：
- residual scope
- goal dimension
- observed layer
- candidate origin layer
- repair locus
                        ↓
评估 Oracle：
- detect 是否充足
- search 是否充足
- close 是否充足
                        ↓
若 search Oracle 不足：
获取、拆分或加固 Oracle
                        ↓
若无法在预算内获得充分 Oracle：
UNVERIFIABLE / 人工升级 / 风险接受 / 终止
                        ↓
剥离 Oracle-addressable residual
                        ↓
有界直接修复
                        ↓
重新运行 source Oracle
                        ↓
重新计算剩余 residual
                        ↓
稳定剩余项进入 candidate mismatch routing
                        ↓
Audit：
提出修复、反例和 closure guards
                        ↓
SGARX：
freeze → fork → patch → replay
                        ↓
重新运行 source Oracle
             ┌──────────┴──────────┐
           FAIL                   PASS
             ↓                      ↓
      重新分区和路由        局部 residual 已关闭
                                    ↓
                           运行 parent closure guards
                         ┌──────────┴──────────┐
                       FAIL                   PASS
                         ↓                      ↓
            残差转移 / 新 residual       允许关闭 residual
            重新分区和路由               再判断 stage closure
```

其中：

- Audit 没有状态关闭权；
- 修复模型不能自行宣布成功；
- 原始 Oracle 必须重新运行；
- 父级目标必须重新验证；
- closure guards 失败时不得关闭 stage；
- `UNVERIFIABLE` 必须是明确状态，而不是被误写为成功。

---

# 二十二、Step、Stage 和 Task 必须分别闭合

Agent 中至少要区分三种完成状态。

## Turn Done

本轮 action 获得了预期局部结果。

## Stage Closed

阶段 artifact：

- 满足阶段契约；
- 已写入硬状态；
- 与下游接口兼容；
- 没有已知硬约束违规；
- 具有足够阶段证据；
- 没有不可接受的父级残差转移。

## Task Complete

最终产物：

- 满足完整目标；
- 满足多目标硬约束；
- 没有不可接受回归；
- 证据达到交付标准；
- 剩余风险已被关闭或明确接受。

因此：

> 环境结果正确只能关闭 Turn residual，不能自动关闭 Stage，更不能自动宣布 Task Complete。

---

# 二十三、残差测量的核心指标

## Outcome Repair@B

预算 \(B\) 内，原始 Oracle 通过的概率：

\[
P(O_{\text{source}}=PASS)
\]

## Goal-Valid Repair@B

预算 \(B\) 内，通过全部硬目标约束的概率：

\[
P(\operatorname{Accept}(P)=1)
\]

## Certified Repair@B

预算内不仅目标有效，而且拥有足够证据允许安全关闭的概率。

## Shortcut Gap

\[
\operatorname{ShortcutGap}(B)
=
\operatorname{OutcomeRepair@B}
-
\operatorname{GoalValidRepair@B}
\]

它测量系统有多少“修复成功”实际上只是投机、overfit 或残差转移。

## Selection Gap

\[
\operatorname{SelectionGap}(B)
=
\operatorname{OracleBestRepair@B}
-
\operatorname{SelectedRepair@B}
\]

如果候选集合中已经有有效修复，但系统没有选中，问题主要位于 verifier、ranking 或 routing，而不是 proposal。

## Minimum Valid Repair Cost

\[
C_{\text{valid}}^*
=
\min_{P:\operatorname{Accept}(P)=1}C(P)
\]

## Residual Transfer Rate

\[
P(
R_i\downarrow
\land
\exists j\neq i,\ R_j\uparrow
)
\]

## Repair Debt

测量当前 artifact 相比理想 artifact 增加了多少后续修复成本。

## Oracleization Gain

测量 mismatch 转换后，有多少原本难以处理的 residual 被转化成具有充分 search 或 close Oracle 的子残差。

## Residual Closure per Cost

\[
\frac{\Delta \mathbf R_{\text{goal-valid}}}{C}
\]

## No-Progress / Oscillation Rate

记录：

- 重复 retry；
- 全文 rewrite；
- 状态震荡；
- 相同失败路径重复进入；
- 没有残差下降的 token 消耗。

---

# 二十四、第一阶段研究应如何落地

Text2SQL 是最合适的初始实验场，因为它同时具备：

- 多阶段 artifact；
- 强结果 Oracle；
- 延迟 credit assignment；
- overfit 风险；
- 架构边界；
- 历史 regression；
- 大量真实失败轨迹；
- Audit 和 SGARX 基础。

## 1. 建立 residual dataset

从真实失败中提取：

- Semantic IR 错误；
- schema linking 错误；
- metric interpretation 错误；
- join planning 错误；
- aggregation 错误；
- SQL realization 错误；
- 当前 case 通过但 overfit review 失败；
- 修复当前 case 后历史 regression 失败。

同时构造注入式 residual：

- 删除关键约束；
- 使状态过期；
- 把相关事实埋入噪声；
- 破坏 artifact 字段；
- 制造 thinking 正确但 final mapping 错误；
- 添加 case-specific 捷径；
- 制造局部通过、全局错误。

真实 residual 用于外部有效性，注入 residual 用于获得明确的系统级 ground truth。

## 2. 冻结和分支

每个 residual 建立 SGARX snapshot：

```text
freeze
→ fork 多个隔离分支
→ 每个分支执行一种修复算子
→ replay 下游流程
→ 重跑 source Oracle
→ 运行 closure guards
→ 重新计算父级 residual
→ rollback
```

## 3. 固定修复算子空间

第一阶段不直接搜索任意自然语言 thought，而使用有限语义算子：

```text
普通 retry
通用 reflection
局部 patch
全文 rewrite
Oracle 获取
规格澄清
状态刷新
观测重构
候选扩展
聚合分解
Audit 修复
rollback + replay
模型升级
人工升级
```

## 4. 控制 Oracle 带宽

实验系统始终知道 gold，但对 repair agent 只暴露不同反馈：

```text
完整差异
局部位置
结构化类别
连续得分
二值 pass/fail
弱反馈
无外部反馈
```

## 5. 建立 closure guards

至少包括：

- 当前 case execution；
- 历史 regression；
- 问题 paraphrase；
- schema/table/column 重命名；
- 相同语义、不同数据库结构；
- 邻域正例；
- 邻域负例；
- case/db/gold 身份泄漏扫描；
- 架构边界审计；
- SQL 语义是否被转移到确定性代码。

## 6. 比较基线

应比较：

- 单次 retry；
- 固定 reflection；
- best-of-N；
- 从头 rewrite；
- 仅使用 source Oracle 的搜索；
- 带 closure guards 的修复；
- 六类 mismatch 路由；
- 基于历史 response profile 的 repair router。

---

# 二十五、第一版研究可以验证的核心命题

## H1：同错异修

相同最终错误对应显著不同的 repairability profile。

## H2：修复响应优于自我解释

基于机器事实、Oracle profile 和历史干预响应的 router，比仅依赖 LLM 自述的错误分类，更能预测有效修复算子。

## H3：局部通过与目标有效之间存在显著差距

在 gold 可见、目标约束不足的条件下，搜索越强，越容易找到 overfit 或投机路径。

## H4：Mismatch 路由的主要价值是 Oracle 化

六类失配转换能够提高 residual 的可定位性、可验证性，并降低后续最低有效修复成本。

## H5：分层 closure guards 能减少残差转移

Step 通过后重新计算 Stage 和 Task residual，可以显著减少局部修复造成的全局回归。

## H6：残差路由能提高单位预算修复效率

在相同 token、时间和工具预算下，基于 residual profile 的修复路由优于统一 retry、reflection 和无约束搜索。

---

# 二十六、最终统一

残差测量、残差路由和残差修复可以被统一成一个递归控制结构：

\[
\boxed{
\text{机器事实建立 residual}
\rightarrow
\text{分层多目标残差登记}
\rightarrow
\text{Oracle-addressable 部分剥离}
\rightarrow
\text{有界直接修复}
\rightarrow
\text{稳定剩余项进入 mismatch 路由}
\rightarrow
\text{改变 regime 并完成 Oracle 化}
\rightarrow
\text{搜索目标有效修复路径}
\rightarrow
\text{重跑 source Oracle 和 closure guards}
\rightarrow
\text{重新计算父级 residual}
\rightarrow
\text{关闭、回滚、重路由或升级}
}
\]

其中：

- 残差测量不是恢复不可知的模型内部状态，而是记录机器目标缺口和修复响应；
- 残差路由不是给错误贴一个心理标签，而是选择 Oracle、repair locus 和 regime transformation；
- 残差修复不是让当前结果看起来正确，而是在多目标硬约束下关闭残差，同时避免转移、延迟、补偿和掩盖；
- LLM 级修复不是另一套理论，而是同一残差控制机制在 step 叶节点上的递归实例；
- MCTS 不是框架本身，只是当 residual state、repair operators 和 goal-valid Oracle 已经明确以后，可用于有限预算搜索的一种算法；
- 已知结果场景用于测量 repairability，未知结果场景利用这些测量结果完成在线路由与控制。

最核心的研究对象不再是：

> 模型内部为什么会错？

而是：

> **在一个已经失败的状态上，还需要增加什么控制增量，才能以最低成本、在完整目标约束下可靠地成功；这一成功又需要什么证据，才能被系统安全地承认。**

这就是残差控制相对于传统准确率评测、错误分类和统一 reflection 的根本增量。它把 Agent 的失败处理从“继续生成”转化为：

> **机器奠基、Oracle 驱动、Mismatch 转换、目标约束、证据闭合的分层残差治理。**