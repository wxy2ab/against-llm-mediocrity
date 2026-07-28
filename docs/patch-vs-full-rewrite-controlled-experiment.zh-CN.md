# Patch 与完整重写：稀疏修复交付接口的受控实验

**副标题：模型已经知道或能够找到局部修改时，为什么仍不应要求它重新提交整个对象**<br>
**状态：研究证据说明 v0.5**<br>
**数据核验日期：2026-07-28；已纳入 artifact-v4、artifact-v5、artifact-v7、artifact-v8 与 artifact-v9 的边界证据**<br>
**裁决范围：DeepSeek-V4-Flash 单一部署配置；MiniMax 正式矩阵因成本中止，不进入裁决**<br>
**English:** [Patch vs. Full Rewrite: A Controlled Experiment on Sparse Repair Delivery](./patch-vs-full-rewrite-controlled-experiment.md)<br>
**双语同步规则：** 两个版本的条件名称、样本量、统计结果、证据截点与结论边界必须同步更新。

---

## 技术摘要

这组实验专门回答一个接口问题：

> 对稀疏单点修复，在实例、候选、错误位置、模型配置和预算匹配的条件下，让模型提交严格 patch 并由确定性执行器应用，是否比要求模型重新输出完整修复对象更可靠？

在 160 个全新 holdout 实例、四档长度 \(N\in\{96,145,240,384\}\)、每个条件三次重复和 300 秒预算下：

| DeepSeek-V4-Flash | Patch | 完整重写 | Patch − rewrite |
|---|---:|---:|---:|
| 严格系统成功 | 228/480（47.5%） | 124/480（25.8%） | **+21.7 pp** |
| 实例级 bootstrap 95% CI | | | **[+16.5, +26.9] pp** |

给定完全相同的权威 edit plan 后，patch 为 240/240，完整重写为 142/240，差异扩大到 **+40.8 pp [+31.3, +50.4]**。纯复制控制为 120/120，说明结果不是“模型不能输出这些长度的字符串”。在预先分配的独立 900 秒子集上，patch 仍领先 **+25.8 pp [+15.0, +37.5]**。

因此，当前数据支持：

> **在冻结的 DeepSeek-V4-Flash artifact-v3 稀疏单点修复协议中，patch + deterministic executor 相对完整重写具有更高的预算内端到端严格可靠性。**

它不支持“patch 永远优于 rewrite”、跨模型普遍规律、无限预算结论，或未经验证向真实软件工程任务直接外推。

Artifact-v5 增加了原生工具 Agent 边界。正确 oracle plan 给定后，batch Patch 为
46/48，完整对象 Rewrite 为 26/48，交付优势为 **+41.7 pp
[+27.1, +56.25]**。但推断计划下的端到端比较只有 2/96 对 0/96，没有通过
预注册门槛。因此 v5 裁决是 `delivery_only`，不是端到端 Agent superiority。

Artifact-v7 增加了不同的 delivery-error 边界。固定正确 plan 和第一次失败后，一次
完整 Rewrite fallback 为 26/48，一次字段定位 Patch re-emission 为 13/48，差异为
**+27.1 pp [+6.2, +47.9]**。该比较没有预注册方向性通过门，而且 failure subtype
存在异质性，因此不反转 v3/v5 的条件性 Patch 结论。更重要的是，deterministic plan
compiler 在 48/48 个冻结案例上通过，保护项违规为 0。生产首选边界应当是：
**能编译 verified plan 时先编译；只有 fallback 才路由 Patch 与 Rewrite。**

Artifact-v8 检验了更强的 Patch 接口边界。相同正确 semantic plan 下，物理 INDEX
Patch 为 43/64，semantic-ID Patch 为 63/64，Full Rewrite 为 64/64。ID−INDEX
以 **+31.25 pp [+20.3, +42.2]** 通过预注册门；sparse 与 dense 的 ID−FULL
interaction 只有 +3.125 pp，未过门。两条 deterministic compiler 路径均为 64/64。
工程更新是：**优先编译 delivery；仍需模型交付时，先从模型侧移除物理地址解析，再
决定 Patch 或 Rewrite。当前数据不允许硬编码 density crossover。**

Artifact-v9 没有重新比较 Patch 与 Rewrite，而是补充合同边界：effort-matched
ready/ledger 四臂都进入 strict ordered-submission floor，located/causal recovery
receipt 虽有正点估计，但未通过确认门。Patch/Rewrite 原裁决不变；新增工程经验是把
semantic edit-set 正确与序列化顺序正确分开，由 runtime canonicalize 顺序，并按实际
成本与恢复价值分级升级 verifier receipt。

---

## 1. 为什么要单独研究 Patch vs. Rewrite

一般修复任务至少包含两个不同阶段：

```text
发现应该改什么
→ 把修改可靠地交付给系统
```

如果只比较端到端结果，失败可能来自：

- 没有找到错误位置；
- 找到了位置但新值错误；
- edit plan 正确但 patch 格式错误；
- edit plan 正确但完整对象重写时发生 collateral error；
- 输出过长导致预算内未完成；
- executor 或评分器语义错误。

artifact-v3 的核心贡献，是用配对条件把 **plan inference** 与 **repair delivery** 分开。它不仅问“模型能否修好”，还问：

> 当修复意图相同甚至 edit plan 已经外部化时，最终要求提交局部操作还是完整对象，会不会改变系统可靠性？

---

## 2. 实验任务与六个条件

每个实例都有唯一的 GF(2) 真值序列。模型收到一个只有 1 bit 错误的完整候选，并被告知恰好存在一个错误。

六个条件共享规则、候选和真值；配对条件只改变模型必须提交的对象。

| ID | 条件 | 模型获得的信息 | 必须提交的结果 | 回答的问题 |
|---|---|---|---|---|
| I-P | infer patch | 规则 + 单错候选 | 严格单项 patch JSON | 端到端 patch 修复 |
| I-R | infer full rewrite | 与 I-P 相同 | 完整 \(N\)-bit 修复序列 | 端到端完整重写 |
| O-P | oracle-plan patch | 候选 + 权威 edit plan | 严格 patch JSON | 已知计划后的 patch 交付 |
| O-R | oracle-plan full rewrite | 与 O-P 相同的 edit plan | 完整修复序列 | 已知计划后的完整交付 |
| I-PR | patch then rewrite | 与 I-P/I-R 相同 | patch + 完整修复序列 | 同次回答内的交付分解 |
| COPY | copy only | 直接给出正确序列 | 原样复制完整序列 | 排除纯复制/长字符串解释 |

主比较是：

\[
\Delta =
P(\mathrm{system\_exact\_success}\mid I\text{-}P)
-
P(\mathrm{system\_exact\_success}\mid I\text{-}R).
\]

输出长度与序列化成本是接口处理的一部分，不是需要消除的混淆。研究问题本来就是：**把最终提交面缩小为 patch 是否改善系统级交付。**

---

## 3. 冻结设计、运行规模与评分

### 3.1 实例与配置

- 160 个全新正式 holdout，未进入 v1/v2；
- \(N\in\{96,145,240,384\}\)，每档 40 个实例；
- 每个条件 3 次重复；
- 中文提示；
- temperature=0，top_p=1，max_tokens=64000；
- 主预算 300 秒，独立敏感性预算 900 秒；
- 主配置：`deepseek_v4_flash`。

### 3.2 DeepSeek 调用账本

| 区块 | 条件 | 实例 | 重复 | Runs |
|---|---|---:|---:|---:|
| Primary @300s | I-P、I-R | 160 | 3 | 960 |
| Oracle plan @300s | O-P、O-R | 80 | 3 | 480 |
| 机制控制 @300s | I-PR、COPY | 40 | 3 | 240 |
| 独立预算敏感性 @900s | I-P、I-R | 40 | 3 | 240 |
| **合计** | | | | **1,920** |

覆盖审计：

```text
expected = 1,920
selected = 1,920
missing = 0
unexpected = 0
duplicates = 0
```

### 3.3 严格成功定义

对 I-P / O-P：

```text
patch JSON 严格合法
∧ edit 内容正确
∧ executor 应用后与 truth 完全一致
```

对 I-R / O-R / COPY：

```text
完整序列格式合法
∧ 长度正确
∧ 与 truth 完全一致
```

timeout、max-token、format-invalid、returned-wrong、empty-visible 和 transport error 全部计为失败。主推断单位是实例：先在每个实例内平均三次重复，再做 instance-cluster bootstrap；禁止 best-of。

---

## 4. Primary 结果：300 秒下 Patch 显著优于完整重写

| 160 instances × 3 repeats | I-P patch | I-R full rewrite | Patch − rewrite |
|---|---:|---:|---:|
| 严格成功 | 228/480（47.5%） | 124/480（25.8%） | **+21.7 pp** |
| 实例级 bootstrap 95% CI | | | **[+16.5, +26.9] pp** |
| 实例方向 | | | n10=80，n01=14 |
| 最小实际效应门 | | | +10 pp，**通过** |

sign-flip 使用 100,000 次 Monte Carlo，未观察到同等或更极端的随机翻转，因此报告为：

\[
p<10^{-5}
\quad\text{（Monte Carlo 分辨率）}.
\]

不能写成精确的 \(p=0\)。

### 4.1 长度分层

| \(N\) | I-P patch | I-R full rewrite | Run-level 差 |
|---:|---:|---:|---:|
| 96 | 104/120（86.7%） | 92/120（76.7%） | +10.0 pp |
| 145 | 85/120（70.8%） | 27/120（22.5%） | +48.3 pp |
| 240 | 28/120（23.3%） | 4/120（3.3%） | +20.0 pp |
| 384 | 11/120（9.2%） | 1/120（0.8%） | +8.3 pp |

三个边界非常重要：

1. 四档长度都由冻结设计共同定义，不能只挑差异最大的 \(N=145\)；
2. patch 的优势不是随长度单调增加；
3. patch 没有消除规模困难，\(N=384\) 时自身也只有 9.2%。

更准确的解释是：patch 降低了交付负担，但没有消除 plan inference、全局计算与有限预算共同造成的困难。

---

## 5. 失败类型：主要是预算内完成差异，但不只有 Timeout

| 条件 | ok | timeout | format-invalid | returned-wrong |
|---|---:|---:|---:|---:|
| I-P | 228 | 246 | 0 | 6 |
| I-R | 124 | 333 | 9 | 14 |

完整重写多出：

- 87 次 timeout；
- 9 次格式错误；
- 8 次返回但错误。

所以主效应首先是固定预算下的完成差异，但不是“只要等待更久就一定相同”已经被证明，也不是无限预算下的纯语义能力差。

本文始终把指标称为：

> **budgeted system exact success**

而不是裸模型的无预算能力。

---

## 6. 机制控制：正确 Edit Plan 已知时，完整重写仍落后

### 6.1 O-P vs. O-R

O-P 与 O-R 获得完全相同的权威 edit plan，只改变最终交付物：

| 80 instances × 3 repeats | O-P patch | O-R full rewrite | Patch − rewrite |
|---|---:|---:|---:|
| 严格成功 | 240/240（100%） | 142/240（59.2%） | **+40.8 pp** |
| 实例级 bootstrap 95% CI | | | **[+31.3, +50.4] pp** |

O-P 四档均为 60/60。O-R 从 \(N=96\) 的 58/60 下降到 \(N=384\) 的 7/60。

因为位置、旧值和新值已经外部化，这个差距不能归因于错误定位。它直接表明：

> 即使 edit plan 正确，把局部修改应用到整个对象、重新序列化并严格提交，仍会引入额外交付负担。

### 6.2 COPY 控制

COPY 在四档长度均为 30/30，总计：

\[
120/120=100\%.
\]

因此，长度 96–384 的字符串并非无法原样输出。O-R 的困难更具体地发生在：

```text
读取 edit plan
→ 修改正确位置
→ 保持其他位置不变
→ 重新提交完整对象
```

### 6.3 I-PR：同次回答内的 Patch-Then-Rewrite

I-PR 共 120 条：

| 事件 | 结果 |
|---|---:|
| patch 正确 | 33/120（27.5%） |
| patch 与完整序列都正确 | 30/120（25.0%） |
| patch 正确但完整序列错误 | 3/120（2.5%） |
| timeout | 85/120（70.8%） |

这 3 条提供了同次回答内的直接序列化失败案例，但 I-PR 的 timeout 很高，主要机制证据仍来自覆盖更充分的 O-P/O-R。

---

## 7. 900 秒独立预算敏感性

40 个实例在查看正式结果前预先固定。I-P 和 I-R 都从头独立运行 900 秒，并非只重跑 300 秒 timeout。

| 40 instances × 3 repeats | I-P patch | I-R full rewrite | Patch − rewrite |
|---|---:|---:|---:|
| 严格成功 | 83/120（69.2%） | 52/120（43.3%） | **+25.8 pp** |
| 实例级 bootstrap 95% CI | | | **[+15.0, +37.5] pp** |
| sign-flip | | | \(p=4.0\times10^{-5}\) |

对同一批 40 个预分配实例进行描述性对照：

| 预算 | I-P patch | I-R full rewrite | Run-level 差 |
|---:|---:|---:|---:|
| 300 秒 | 59/120（49.2%） | 32/120（26.7%） | +22.5 pp |
| 900 秒 | 83/120（69.2%） | 52/120（43.3%） | +25.8 pp |

延长预算提高了两个条件的成功率，但没有在这个预分配子集中消除 patch 优势。上表的 300 秒行是对同一预分配 cohort 的描述性回算；900 秒效应与区间仍按冻结敏感性分析报告。

这不是单次调用的 survival curve，也不能把 300 秒与 900 秒运行拼成 `success@900`。它只能被称为：

> **独立预分配的 900 秒预算敏感性分析。**

---

## 8. 这组实验已经证明了什么

### 8.1 当前证据支持

1. **配置内端到端优势。** 在冻结 DeepSeek 协议中，patch + executor 的严格成功率高于完整重写。
2. **独立交付负担。** edit plan 已知后，完整对象重新应用与序列化仍显著落后。
3. **不是纯复制障碍。** 相同长度范围的纯复制为 120/120。
4. **预算延长没有在已测范围内消除差异。** 独立 900 秒子集仍保持正差异。
5. **Patch 只是缓解，不是消除规模效应。** 两种接口都随长度下降。
6. **接口效应是系统效应。** 输出长度、序列化、executor 和固定 wall-clock 共同属于所比较的部署协议。

### 8.2 当前证据不支持

- patch 在所有模型、任务、长度和编辑密度上都优于 rewrite；
- DeepSeek 的结果已经是跨模型规律；
- MiniMax v3 已完成确认性复现；
- 完整重写在无限时间或无限 token 下仍然落后；
- 差异是纯粹的“语义能力”而不是预算内交付行为；
- 单点 GF(2) 修复可直接外推代码、数据库、配置和文档修改；
- patch 可以替代全局验证；
- edit plan inference 与 delivery 已在 primary 中完全解耦。
- artifact-v5 已证明端到端 Agent-level Patch superiority；
- edit-density crossover 已经识别。

### 8.3 Artifact-v5 原生工具边界

Artifact-v5 在共享 candidate、plan、verifier、300 秒 episode budget 和一次
delivery repair 的前提下，比较原生 `file_edit_batch` 与原生 `file_write`：

| v5 对比 | Patch | Rewrite | 差值 | 裁决 |
|---|---:|---:|---:|---|
| 推断计划 | 2/96 | 0/96 | +2.1 pp [0, 6.25] | V5-C1 未通过 |
| Oracle 计划 | 46/48 | 26/48 | +41.7 pp [27.1, 56.25] | V5-C2 通过 |

这个结果强化了交付机制，同时收窄了 Agent claim：

> **正确 plan 可以通过原生 batch Patch 得到更可靠的交付；但 planning floor
> 会阻止这种交付优势转化为端到端 Agent 收益。**

Crossover 仍未裁决，因为 6 个 infer cells 中 5 个双臂均为 0，且正式逐 run
payload telemetry 未保留。

---

## 9. 与理论推导的关系

若完整对象长度为 \(N\)，patch 修改 \(k\) 个位置，则典型提交长度为：

\[
L_{\text{rewrite}}=Nc_r,
\]

\[
L_{\text{patch}}
=c_0+k(c_p+\lceil\log_2N\rceil).
\]

当修改稀疏、executor 正确且交付可靠性随提交面单调下降时，可以条件性推出 patch 的交付优势。

artifact-v3 对这条理论链提供了两层经验支持：

| 理论层 | 对应实验 |
|---|---|
| 正确 plan 已知，较小提交面应更可靠 | O-P vs. O-R |
| plan 需要模型自行推断时，接口优势是否仍能保留 | I-P vs. I-R |

因此，结论应写成：

> **patch > rewrite 是有条件成立的接口规律；artifact-v3 证明这些条件在一个冻结 DeepSeek 稀疏修复协议中产生了可观测的端到端优势。**

实验没有确定真实任务中的 edit-density crossover，也没有证明 plan inference 对 patch 永远更容易。

### 9.1 Artifact-v4 为什么没有复现 Patch 优势

完成后的 artifact-v4 在 \(N\in\{24,32,48\}\) 上比较 five-bit candidate：

| 条件 | strict success | 对比 |
|---|---:|---:|
| C1 full rewrite | 7/54（13.0%） | |
| C2 patch | 8/54（14.8%） | +0.019 [−0.037, 0.074] |

这个零附近结果不推翻 v3，也不能与 v3 合并。v4 使用 5 个 edits、更短对象，
patch 地址和值的开销相对更高，而且两个条件都受 timeout floor 压制；v3 则是
单点稀疏修复和 \(N=96\)–384 的长对象。

两组实验共同支持更精确的工程结论：

> **Patch 优势有一个由 edit density、对象长度、地址开销、依赖耦合和预算共同决定的
> 适用区间；v3 确认了稀疏长对象区间，v4 阻止我们把它外推成无条件规律。**

### 9.2 Artifact-v5 分离 Planning 与原生交付

Artifact-v5 在原生 tool loop 中复现了 oracle delivery 的量级：v3 的
O-P−O-R 为 +40.8 个百分点，v5 的 O-P-A−O-R-A 为 +41.7 个百分点；但 v5
的 infer 端到端比较没有通过。这既支持正确计划下的交付理论，也说明 Agent 为什么
需要 plan-verification gate。

系统含义是乘法式的：

\[
P(\text{end-to-end success})
\approx
P(\text{plan correct})
\times
P(\text{delivery succeeds}\mid\text{plan correct}).
\]

更强的 editor 改善第二项，不会自动改善第一项。

---

## 10. 对 Agent 开发的工程意义

### 10.1 Operation-First，而不是 Object-Rewrite-First

模型默认提交：

- edit operations；
- AST transforms；
- JSON Patch；
- database migration；
- tool arguments；
- section-level replacement。

运行时持有原对象，并由确定性 executor 应用修改。完整对象不应仅因为“模型返回了一版”就覆盖权威状态。

### 10.2 把发现与交付分开

Agent 应分别记录：

```text
plan_correct
delivery_correct_given_plan
executor_success
verifier_success
commit_success
```

失败路由也应不同：

- plan 错误 → replan / retrieve / expand search；
- plan 正确但格式错误 → re-emit；
- executor 失败 → 修复工具或前置条件；
- verifier 失败 → rollback + failure witness；
- 长度/预算失败 → patch、区域重写或预算升级。

Artifact-v5 表明，这种分离必须成为写入前闸门，而不只是事后日志。没有通过 schema、
precondition 与语义检查的 plan 不应获得写权限。

### 10.3 使用三档修复路由

| 任务状态 | 默认接口 |
|---|---|
| 稀疏、位置明确、低耦合 | patch + incremental verify |
| 中等密度、影响集中在局部区域 | function / subtree / section rewrite |
| 高密度、schema 或整体结构变化 | full rewrite + full verify |

实验支持优先实现 patch 路径，但不支持一个永远选择 patch 的硬编码规则。真实 crossover 仍需按领域、模型和成本测量。

### 10.4 Executor 与 Verifier 是 Patch 优势成立的必要系统部件

patch 不是“让模型少写一点文字”这么简单。可靠流程是：

```text
authoritative object
→ model proposes patch
→ deterministic executor applies it in sandbox
→ local and global verifiers run
→ commit or rollback
```

如果没有权威基线、确定性应用和最终验证，patch 的结构优势无法转化为可靠状态更新。

---

## 11. 跨配置证据状态

MiniMax artifact-v3 因成本与长时运行负担在 182 条不完整结果后中止。这些数据：

- 不进入 1,920 条 DeepSeek 覆盖账本；
- 不进入正式效应估计；
- 不用于跨配置 superiority 裁决。

既有 v2 中，MiniMax 无 syndrome 条件的 patch−rewrite 为 +44.4 pp，95% CI [+24.4, +64.4]，可作为方向一致的探索性旁证，但不能替代 v3 confirmatory。

当前 claim ceiling 必须保持为：

```text
single_configuration
```

跨模型复现仍然是独立研究任务，而不是本文已经完成的结论。
Artifact-v5 同样只有 DeepSeek 配置；它的 `delivery_only` 裁决不会提高跨配置
claim 上限。

---

## 12. 可复现性与证据来源

冻结身份：

- study：`patch_rewrite_v3`
- schema：`artifact-v3`
- dataset：`dataset/artifact-v3/3202c269677098eb`
- prompt set：`promptset/artifact-v3/c4dd075ff290e04d`
- design manifest SHA-256：`9b0b3fa6298cc29a03388cfcf84e1873aa3f8b30950d7ca14d8d4b845bc00114`

源材料：

- [设计冻结](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/PATCH_VS_REWRITE_V3_DESIGN_FREEZE.md)
- [正式结果报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/PATCH_VS_REWRITE_V3_REPORT.md)
- [机器可读 summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/patch_rewrite_v3/confirmatory/analysis/summary.json)
- [覆盖审计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/patch_rewrite_v3/confirmatory/analysis/coverage.json)
- [Artifact-v5 稳定编辑 Agent 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V5_STABLE_EDITING_AGENT_REPORT.md)
- [Artifact-v5 机器可读 summary](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v5_agent_patch_rewrite/confirmatory/analysis/summary.json)
- [Artifact-v7 机制恢复验证](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V7_AGENT_MECHANISM_RECOVERY_VALIDATION.md)
- [Artifact-v8 运行时所有权验证](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V8_RUNTIME_OWNERSHIP_ROUTING_VALIDATION.md)
- [完整实验仓库](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment)

v5 正式 endpoint 表在原始 tool-event payload 丢失后，由完整 run log 重建。
Final success 与 failure class 计数可用；精确 repair-call、latency 与正式实际
payload telemetry 不可用。

---

## 13. 下一步最有判别力的问题

| 问题 | 为什么重要 | 推荐比较 |
|---|---|---|
| 跨配置复现 | 决定 claim 能否从单配置升级 | 低成本固定版本模型上的 I-P / I-R / O-P / O-R |
| Edit-density crossover | 决定何时应从 patch 切换到区域或完整重写 | \(k/N\) 梯度 × patch / region rewrite / full rewrite |
| 区域耦合 | 相同 \(k\) 可能因依赖密度不同而难度不同 | 分散 edits vs. 同一依赖子图内 edits |
| 真实领域迁移 | 决定 GF(2) 是否具有工程外部效度 | 代码、JSON/config、数据库 migration、结构化文档 |
| Verifier / executor 可靠性 | 决定接口优势能否变成提交安全性 | 正确 plan × executor failure × verifier false accept |
| 预算与提交面 | 决定优势是预算位移还是更稳定的接口规律 | 独立预分配预算 × 输出长度 × visible/reasoning tokens |
| v5 事件保留版复现 | 恢复完整原生工具审计链 | 同一冻结 288-arm 设计 + 持久事件 payload |
| Planning lift | 检验脱离 floor 后交付优势能否成为端到端优势 | 已验证或更高成功率 plan × 相同原生 delivery arms |

最优先的是：

1. 用成本可控的第二配置复现四个核心条件；
2. 测量 patch、区域重写、完整重写的 edit-density crossover；
3. 在具有确定性 executor 和 hard verifier 的真实任务中做迁移实验。

这些实验会决定 agent 路由器的实际阈值；在完成前，工程系统应保留可配置策略，而不是把当前 DeepSeek 数值写死。

---

## 14. 结论

这组实验没有证明一个无条件的“patch 永远更好”。它证明了一个对 agent 工程更有用的条件性结论：

> 当任务是稀疏局部修复，模型需要在有限预算内严格交付结果，并且系统能够用确定性 executor 应用 patch 时，要求模型提交局部操作可以显著减少完整对象重写带来的交付失败。

更具体地说：

```text
模型负责发现或确认修改
+ patch 负责最小化提交面
+ executor 负责保持未修改区域
+ verifier 负责决定是否提交
→ 比“让模型重新生成整个权威对象”更可靠
```

在当前证据范围内，这一结论已在 DeepSeek-V4-Flash 的冻结 artifact-v3 协议中得到确认；跨模型、跨编辑密度和跨真实领域的边界仍需继续测量。

Artifact-v5 收紧了 Agent 含义：正确 plan 给定后，原生 Patch 仍有 +41.7 个百分点
优势，但 infer-plan 端到端 claim 未通过。因此生产规则应是**先验证 plan，再路由
delivery**，而不是简单“装一个 Patch 工具”。

Artifact-v7 增加下一层路由：verified plan 能够确定性编译时，应使用 compiler，而
不是再让模型输出 Patch 或 Rewrite。compiler 不可用时，fallback 仍必须条件化：
v7 总体上 Rewrite 高于一次 located Patch re-emission，但该结果是协议特异的，
不支持普遍排序。

Artifact-v8 增加地址层：semantic-ID Patch 几乎达到 Full Rewrite，并显著高于模型
提交物理 INDEX Patch，但预注册 density interaction 未通过。生产 router 因此应
优先 compiler，其次 stable-ID operation；regional/full Rewrite 保持可配置 fallback，
而不是使用固定 edit-density 阈值。

---

## 相关文档

- [聚合失配 Artifact-v8：运行时所有权与语义寻址](./aggregation-mismatch-v8-runtime-ownership-routing.zh-CN.md)
- [聚合失配 Artifact-v9：最小 Scaffold 与 Verifier Receipt](./aggregation-mismatch-v9-minimal-scaffold-recovery.zh-CN.md)
- [Patch vs. Full Rewrite: English](./patch-vs-full-rewrite-controlled-experiment.md)
- [聚合失配 Artifact-v7：机制恢复与确定性交付](./aggregation-mismatch-v7-mechanism-recovery.zh-CN.md)
- [聚合失配 Artifact-v4：实验证据、理论差距与 Agent 工程含义](./aggregation-mismatch-v4-claims-theory-gap.zh-CN.md)
- [聚合失配 Artifact-v5：稳定编辑 Agent 与规划瓶颈](./aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)
- [聚合失配：可推导命题、证明条件与 Agent 工程含义](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [聚合失配与生成—验证不对称：受控实验证据](./aggregation-mismatch-generation-verification-asymmetry-evidence.zh-CN.md)
- [LLM 系统中的聚合失配与组合治理](./aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
