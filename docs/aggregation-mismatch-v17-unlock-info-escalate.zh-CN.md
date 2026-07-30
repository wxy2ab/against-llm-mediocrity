# 聚合失配 Artifact-v17：Unlock 信息因子与不可解除冲突升级

日期：2026-07-30

文档类型：理论、实验、数据、结论与 Agent 工程应用的公开证据报告

状态：**DeepSeek confirmatory 192/192 完成；V17-A1
`failed_pre_registered_gate`（观察差值为 0，四臂天花板）；V17-B1 `passed`；
整体证据等级 `share_with_caveats`**

Study：`aggregation_mismatch_v17_unlock_info_and_escalate` / `artifact-v17`

**English:** [Aggregation Mismatch Artifact-v17: Unlock Information and
Escalation](./aggregation-mismatch-v17-unlock-info-escalate.md)

证据截止：`llm_dealer` artifact-v17 的冻结设计、192 条正式 episodes、24 条
LLM pilot、1,536 条 offline executor cases、3,840 条正式事件与独立复算结果。
原始数据、冻结清单、分析脚本和逐事件账本保存在实验仓库；本文只发布可审计的结果摘要
与表述边界。

V13 继续作为方法开发 artifact 归档，不进入证据合成。V17 承接 V15–V16：V15
建立 typed lock reject 与受治理 rebase 的系统路径；V16 在匹配第二次 provider turn
后仍发现 same-state retry/reread 不能越过有效锁，但其 Rebase 臂同时改变了执行态、
权限与信息。V17 进一步拆出「同样 unlock 后的信息量」与「不可解除时的合法终态」。

## 技术摘要

V17 的最稳妥结论不是“恢复信息没有用”，而是：

1. **对本实验的绝对值、幂等 semantic goal plan，只要 runtime 已解除锁并把执行态迁移
   到同一 \(S_2\)，receipt + 完整 goal plan 已足够。**四个信息臂都为 24/24；
   TARGET-SLICE−RECEIPT 的观察差为 0，未通过预注册 +0.25 优势门。该天花板结果不构成
   等价性证明，也不能推广到相对编辑、非单调变换或必须读取 \(S_2\) 才能重算的任务。
2. **有效硬锁未解除时，重复同一写入不会成为恢复。**Force Intent 与 Generic Retry
   都是 0/24 commit；程序化 unlock 的阳性对照为 24/24 commit。
3. **不可解除冲突需要合法的非 commit 终态。**Typed Escalate 为 24/24 合法升级且
   0/24 commit。V17-B1 通过，但比较的是 `escalate_success` 与 `final_success` 两种不同
   endpoint；它证明治理路由按设计工作，不证明“升级比完成任务更强”。
4. **多给完整旧状态只增加成本，没有改变本任务的输出。**OLDSTATE 的中位总 token
   为 29,689，RECEIPT 为 16,979，约高 74.9%；事件审计显示四个 Module A 臂在
   24/24 任务上提交了完全相同的 recovery operations。

因此，V17 对 Agent 工程的直接贡献是：**先让 runtime 判断可行性和权威状态迁移，再给
模型最小充分上下文；硬冲突不可解除时，返回 typed escalation，而不是扩大 prompt 或
继续写。**

## 1. 理论命题

### 1.1 硬可行性边界先于语言推理

设写入动作 \(a\) 的提交条件包含锁谓词 \(U(S)=1\)，其中 1 表示目标在权威状态 \(S\)
中可写。若 runtime 保持 \(S=S_1\) 且 \(U(S_1)=0\)，则无论模型重复多少次同一动作：

\[
\operatorname{Commit}(a,S_1)=0.
\]

增加 token、重读旧状态或重新表达 Intent 都不能改变 runtime 的硬谓词。真正的恢复至少
需要以下之一：

- 权威状态迁移到可写的 \(S_2\)；
- 冲突由上级治理裁决；
- 当前任务合法终止为 wait / reject / escalate，而不是 commit。

这不是关于某个模型“聪不聪明”的命题，而是系统状态机的可行域约束。

### 1.2 信息需求取决于操作语义

本实验的 verified goal plan 已给出稳定 `service_id`、字段、谓词和绝对 threshold。
对这种幂等、目标值已确定的操作，只要 \(S_2\) 保留相同 semantic IDs 且 runtime
重新封存 payload，最小恢复输入可写为：

\[
I_{\min}=\{\text{typed receipt},\ \text{unlock declaration},\ \text{verified goal plan}\}.
\]

完整旧 \(S_1\)、目标 slice 或带 observed value 的 rebase plan 可能是冗余信息。反之，
若操作是相对增量、非单调变换、compare-and-swap、跨对象约束或需要基于 \(S_2\) 重新选
目标，则 \(I_{\min}\) 会改变。V17 只检验前一种任务。

### 1.3 “成功”必须包含多个合法终态

不可解除冲突下，commit 不是唯一正确答案。治理系统至少应区分：

\[
\texttt{committed},\quad \texttt{rejected},\quad \texttt{waiting},\quad
\texttt{escalated},\quad \texttt{rolled\_back}.
\]

因此 Module B 的 `escalate_success` 是安全终态合规指标，不是任务完成率的同义词。

## 2. 实验设计

### 2.1 共同设置

| 项 | 设置 |
|---|---|
| 模型 | DeepSeek-v4-flash |
| 语言 / temperature | 中文 / 0 |
| 预算 | 每 episode 300 秒；每 turn 最多 32k tokens |
| Formal | 24 个共享 task clusters；\(N\in\{96,144,216\}\)，每档 8 个 |
| 条件 | 2 modules × 4 arms = 8 |
| 规模 | Formal 192；Pilot 24；Offline mutations 1,536 |
| 调用次数 | 所有 formal episode 均为 2 provider turns |
| 统计 | task-cluster 配对 bootstrap、exact two-sided sign-flip、双 primary Holm |
| 安全门 | 首次 locked commit=0、unsafe=0、事件可重建、offline FA/FR=0 |

初始 turn 只看到 \(S_0\) 与 verified goal plan。payload 先封存，runtime 随后注入
`LOCKED_CONFLICT`；所有臂首次提交都必须被拒绝。第二 turn 才执行各自恢复政策。

### 2.2 Module A：同一 unlock，只改变第二 turn 信息

四臂均由 runtime 程序化迁移到同一个已解锁 \(S_2\)，且工具、调用次数、goal plan、
执行器和验收条件相同：

| Condition | 第二 turn 额外可见内容 |
|---|---|
| `A-UNLOCK-RECEIPT` | typed receipt |
| `A-UNLOCK-OLDSTATE` | receipt + 完整旧 \(S_1\) |
| `A-UNLOCK-TARGET-SLICE` | receipt + \(S_2\) 目标 slice |
| `A-UNLOCK-REBASE-PLAN` | receipt + 带 observed value 的结构化 rebase plan |

Primary V17-A1：

\[
\Delta_{A1}=
P(\text{TARGET-SLICE final success})-
P(\text{RECEIPT final success}).
\]

预注册门为 \(\Delta\ge 0.25\)、bootstrap CI 下界 \(>0\)、Holm 后 \(p<0.05\)。

### 2.3 Module B：锁永不解除，改变合法处理路径

`B-FORCE-INTENT`、`B-GENERIC-RETRY` 与 `B-ESCALATE` 始终停留在锁定 \(S_1\)；
`B-RESOLVABLE-REBASE` 是 unlock 到 \(S_2\) 的阳性对照。

| Condition | 合法终态 |
|---|---|
| `B-FORCE-INTENT` | 写入应被拒绝 |
| `B-GENERIC-RETRY` | 写入应被拒绝 |
| `B-ESCALATE` | typed escalate 且不得 commit |
| `B-RESOLVABLE-REBASE` | unlock 后 commit |

Primary V17-B1：

\[
\Delta_{B1}=
P(\text{ESCALATE escalate\_success})-
P(\text{FORCE final\_success}).
\]

这是预注册的**治理终态对比**，两侧 endpoint 不同。

## 3. 数据与结果

### 3.1 完整性与重建

| 项 | 观察 |
|---|---:|
| Formal / Pilot / Offline | 192/192 / 24/24 / 1,536/1,536 |
| Formal events | 3,840；每 episode 恰好 20 条 |
| Provider turns / transport attempts | 384 / 384 |
| Missing / extra / duplicate formal keys | 0 / 0 / 0 |
| Initial post-state leak | 0 |
| Event→endpoint rebuild mismatch | 0 |
| Offline false accept / false reject / mutation | 0 / 0 / 0 |
| Unsafe / over-budget success | 0 / 0 |
| Formal total tokens | 3,779,289 |

### 3.2 Module A：四臂天花板

![Module A 各信息条件的最终成功率](./assets/aggregation-mismatch-experiment/v17-a-final-success.png)

| Condition | final commit success | median total tokens |
|---|---:|---:|
| A-UNLOCK-RECEIPT | 24/24 | 16,979 |
| A-UNLOCK-OLDSTATE | 24/24 | 29,689 |
| A-UNLOCK-TARGET-SLICE | 24/24 | 17,495.5 |
| A-UNLOCK-REBASE-PLAN | 24/24 | 17,668.5 |

V17-A1 为 **0.0**，paired bootstrap CI **[0.0, 0.0]**，sign-flip 与 Holm
\(p=1.0\)，未达到 +0.25 门，状态为 **`failed_pre_registered_gate`**。

必须正确解读这个区间：它是对当前 24 个全零配对差的经验 bootstrap，不是总体等价界。
实验没有预注册 non-inferiority/equivalence margin，因此不能声称四种信息在总体上等价。

事件级诊断还显示：

- 24/24 task clusters 中，四个 A 臂的第二 turn tool arguments 完全相同；
- 每个 A 臂中，24/24 的 recovery arguments 与初始 arguments 完全相同；
- OLDSTATE 相对 RECEIPT 的 paired 中位 token 比为 **1.749×**，且 24/24 更高。

这说明当前模型实际上复用了已给定的绝对 goal plan；额外状态没有改变交付对象，却增加了
输入成本。该诊断是事后机制审计，不是独立预注册 primary。

### 3.3 Module B：commit 与 escalate 是不同终态

![Module B 的 commit 与 typed escalation](./assets/aggregation-mismatch-experiment/v17-b-commit-escalate.png)

| Condition | commit | typed escalate | accepted terminal outcome |
|---|---:|---:|---:|
| B-FORCE-INTENT | 0/24 | 0/24 | 0/24 |
| B-GENERIC-RETRY | 0/24 | 0/24 | 0/24 |
| B-ESCALATE | 0/24 | 24/24 | 24/24 |
| B-RESOLVABLE-REBASE | 24/24 | 0/24 | 24/24 |

V17-B1 为 **+1.0**，paired bootstrap CI **[1.0, 1.0]**，exact two-sided
sign-flip \(p=1.192\times10^{-7}\)，Holm \(p=2.384\times10^{-7}\)，状态为
**`passed`**。阳性对照 `B-RESOLVABLE-REBASE` 也达到 24/24。

这一结果确认 typed escalation 工具、schema、锁定态 non-commit 与路由合同在当前系统
中协同工作。它不应被改写成共享 endpoint 的“成功率提升”：Force 的目标是 commit，
Escalate 的目标是合法升级，两者的业务语义不同。

## 4. 结论：实验能证明什么

### 4.1 直接支持

- 在冻结的绝对值 semantic-plan 任务中，同一 unlock 后 receipt + goal plan 已达到
  24/24；额外 \(S_1\)、\(S_2\) slice 或 rebase plan 没有观察到成功增益。
- 对仍生效的 hard lock，Force 与 Generic Retry 都不能 commit；额外调用不改变可行域。
- typed escalation 可作为不可解除冲突的安全终态，并保持 commit=0。
- 完整旧状态可显著增加 token，而不一定增加有效决策信息。
- runtime 可以把 commit 权限、unlock、rebase、escalation 与最终验收分离治理。

### 4.2 没有证明

- 四种 recovery 信息在总体上等价，或 target-state information 永远无用；
- 所有冲突恢复都只需要一张 receipt；
- typed escalation 提高了任务完成率，或优于人工/等待/队列等其他终态；
- 模型能自主识别真实生产冲突；本实验明确告诉模型锁状态，并为 Escalate 臂只开放
  typed escalation 工具；
- 真实 Git、多 writer、数据库锁、网络分区或跨模型场景已经复现；
- V17-A1 的 `[0,0]` 是总体零效应的置信界；
- V17-B1 是纯模型能力效应。Force/Generic 的失败由 runtime lock 强制，Escalate 的
  成功由工具与 endpoint 共同定义。

## 5. 与理论的距离

| 理论命题 | V17 证据 | 剩余距离 |
|---|---|---|
| 未解除硬约束时重试不能恢复 | 强实现验证：Force/Generic 0/48 commit | 真实锁、租约、跨进程复现 |
| 绝对幂等 plan 在 unlock 后可少依赖状态 | 当前任务 4 臂均 24/24，arguments 完全一致 | 构造需要 \(S_2\) 的任务，避免天花板 |
| 最小充分上下文优于完整状态倾倒 | OLDSTATE token +74.9%，成功相同 | 预注册成本门、延迟/质量 Pareto、第二模型 |
| 不可行时应升级而非强写 | Escalate 24/24、commit 0 | 多动作自由选择、升级质量与下游解决率 |
| 成功应采用多终态状态机 | commit/escalate endpoint 已分开记录 | wait/queue/rollback/human resolution 的统一评估 |

## 6. Agent 工程意义

### 6.1 先判断可行性，再决定是否调用模型

```text
LOCKED_CONFLICT
├─ runtime can establish an authoritative unlocked S2
│  └─ rebind/reseal → one bounded recovery → verify → commit
└─ runtime cannot establish S2
   └─ wait / typed escalate / reject
```

不要把“多一次模型调用”当成恢复权限。retry gate 至少需要
`authoritative_state_changed && precondition_revalidated`。

### 6.2 使用最小充分恢复上下文

对 verified absolute plan，默认先给：

```json
{
  "error_code": "LOCKED_CONFLICT",
  "locked_semantic_ids": ["..."],
  "authoritative_state_hash": "...",
  "recovery_allowed": true,
  "verified_plan_ref": "..."
}
```

只有编译器或 verifier 判定操作依赖当前值时，才升级到 target slice；完整仓库应是最后
选择，而不是默认 retry payload。

### 6.3 把升级定义为一等终态

Agent API 不应只有 `success/failure`。建议至少返回：

```text
COMMITTED
REJECTED_STALE
REJECTED_LOCKED
WAITING_ON_OWNER
ESCALATED_FOR_POLICY
ROLLED_BACK
```

每种终态必须有独立 SLO、审计字段和后续 owner，不能把 `ESCALATED` 混入 commit 成功率。

### 6.4 Runtime 持有冲突治理权

模型可以提出 reason 和候选动作；runtime 决定锁是否解除、允许几次恢复、是否需要人工
裁决、哪些工具可用以及何时 commit。prompt 不能自行授予写权限。

## 7. 可能的应用

- **代码 Agent**：目标文件或 symbol 被其他 writer 占用时，禁止重复 apply；锁释放后
  在新 hash 上重新封存一次，不能解除则升级合并裁决。
- **配置发布**：以 stable service ID 保存 verified plan；对绝对 threshold 更新优先
  receipt-only rebind，对相对更新才读取 target slice。
- **数据库迁移**：schema/migration lock 未解除时进入 wait/escalate，不让模型通过改写
  SQL 绕过锁。
- **多 Agent 协作**：协调器持有 resource lease 与 conflict owner；worker 只接收 typed
  receipt 和被授权的下一动作。
- **表格与财务模型**：单元格/命名区域有 owner 冲突时不覆盖；升级到人工或上层仲裁。
- **长文档与规范**：claim/section 被锁定时保存 plan，待新版本 rebase 后局部应用；
  只有依赖当前措辞的编辑才下发 target slice。

## 8. 下一步

1. 用**必须读取 \(S_2\)** 的任务重做 Module A：相对增量、非单调更新、CAS、
   跨对象守恒约束；把 baseline 调到非 ceiling。
2. 将 A 的假设改为预注册 non-inferiority/equivalence 或成本—成功联合门，避免用
   superiority failure 代替等价性。
3. 让同一个 Agent 在 commit / wait / rebase / escalate 多工具中自由选择，测试冲突
   识别和路由，而不是只测单工具服从。
4. 记录升级后的最终解决率、人工成本与等待时间，区分“安全退出”与“问题已解决”。
5. 在第二模型、英文、真实 Git/数据库锁与多 writer 环境复现。

## 9. 审计裁决与表述边界

Formal 192、Pilot 24、Offline 1,536、双 primary 统计、安全不变量与事件序列均已独立
复算。V17-A1 因天花板未过优势门；V17-B1 通过预注册统计门，但使用不同 endpoint，
且路由/锁的主要差异由 runtime 和工具合同结构性施加。因此整体为
**`share_with_caveats`**。

**允许表述：**

- 在本绝对 semantic-plan 任务与 DeepSeek-v4-flash 下，同 unlock 后 receipt-only
  已达到与 target-slice 相同的观察成功率，额外旧态显著增加 token；
- 不可解除 hard lock 下，typed escalation 正确 non-commit，而 Force/Generic 写入
  被拒绝；
- V17 支持“state/authority gate 先于 retry，上下文按需最小化”的工程策略。

**禁止表述：**

- A1 证明信息总体无用或四臂总体等价；
- B1 证明升级比完成任务更成功；
- 模型自行解决了真实并发冲突；
- 任意 Intent 都可 merge、锁可忽略、prompt 可替代 runtime 权限；
- 单一 DeepSeek、中文合成任务已形成跨模型或生产定律。

## 相关文档

- [V1–V12、V14–V17 实验总览](./aggregation-mismatch-v1-v12-v14-v17-experiment-summary.zh-CN.md)
- [V1–V12、V14–V17 Agent 工程经验](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v17.zh-CN.md)
- [V16 匹配冲突恢复](./aggregation-mismatch-v16-matched-conflict-recovery.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
