# Agent 五旋钮操作规范（V1–V12 证据对齐版）

更新日期：2026-07-29<br>
定位：面向 Agent 操作者与运行时实现者的执行规范<br>
上游版本：[llmdealer 中的 CCX 操作规范](https://github.com/wxy2ab/llmdealer/blob/main/core/ccx/docs/agent_five_knob_operating_guidelines.zh.md)<br>
证据来源：[聚合失配：可推导命题、证明条件与 Agent 工程含义](../aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)与
[Artifact-v12：漂移剂量与交付尺度路由](../aggregation-mismatch-v12-scale-routing-transfer.zh-CN.md)

> **本文中的“五旋钮”是操作层检查表，不是完整 Agent 架构。**
>
> V1–V12 后的上位架构是：模型提出可验证的 semantic plan；runtime 持有权威状态、
> 依赖、物理寻址与提交权；compiler/executor 负责可确定交付；verifier 定义接受边界；
> delivery 方法按计划质量、修改规模、耦合、预算和风险条件化路由。

## 0. 证据口径

本文把规则分成三类，避免把安全工程默认写成跨模型定律：

| 标记 | 含义 | 使用方式 |
|---|---|---|
| **T：条件性理论** | 在明确前提下由程序语义、信息量或事务安全推出 | 可实现为安全 substrate，但仍需验证实现 |
| **E：实验支持** | 在冻结模型、协议、预算和对象族中通过确认门 | 可在相似流量中条件启用，保留开关和 telemetry |
| **U：未裁决** | floor、ceiling、置信区间或最小效应门未满足 | 不得硬编码为普遍策略 |

V1–V12 大量结果来自单一 DeepSeek 配置与合成对象。本文给出的默认值是可撤销的工程策略，
不是跨模型、跨语言、跨真实仓库的固定成功率承诺。

---

## 1. 总原则：先分配责任，再调五个旋钮

推荐状态机：

```text
OBSERVE authoritative state
→ PROPOSE semantic plan
→ VERIFY and freeze plan
→ SCHEDULE ready operations
→ COMPILE deterministically when possible
→ otherwise ROUTE ID Patch / Regional Rewrite / Full Rewrite
→ EXECUTE atomically
→ VERIFY local and global invariants
→ COMMIT or ROLLBACK
→ APPEND event ledger
```

最短原则：

> **先读取并版本化权威状态，再验证 plan；让 runtime 管依赖与物理地址，优先确定性编译，
> 否则条件化选择 Patch、Regional 或 Full；只有通过语义验收、全局回归、collateral
> 审计和原子提交门后，任务才算完成。**

五个旋钮控制的是这条状态机中的操作选择：

| 旋钮 | Agent 中的对应物 | V1–V12 后的默认纪律 |
|---|---|---|
| 依赖拓扑 | 闭环、顺序、ready set、completed ledger | 依赖图与 readiness 由 runtime 持有；锚点是手段，不把“按拓扑顺序输出”当成等价替代 |
| Candidate / 初始状态 | 已有产物、checkpoint、从零生成 | 优先沿用经过验证的 candidate；所有状态绑定版本；骨架策略按耦合与成本启用 |
| Verifier / 错误证据 | checker、syndrome、receipt | verifier 控制接受；证据绑定当前版本，并按 generic→located→causal 逐级升级 |
| Delivery 粒度 | deterministic compile、Patch、Regional、Full | 正确 plan 可编译时优先 compiler；其余按条件路由，不设无条件 Patch 默认 |
| Failure recovery | state、plan、tool、verifier、commit 等失败层 | 分类恢复；恢复 executor 必须有效；禁止把无差别重试当成修复 |

---

## 2. 权威状态与落盘纪律

### 2.1 什么时候必须持久化

出现下列任一情况，关键状态不得只存在于对话上下文：

- 跨文件、跨章节或前后相互影响；
- 需要跨轮、跨 Agent、跨进程或中断后恢复；
- 已产生昂贵、用户确认或 verifier 通过的 candidate；
- 工作可能超过单轮预算；
- 即将覆盖、删除、迁移、重命名或完整重写；
- checker 输出或审稿意见将用于后续修复；
- 存在并发写入、外部状态漂移、不可逆副作用或重复提交风险。

持久化的是**状态对象**，不强制要求四个固定 Markdown 文件。最小集合通常包括：

```text
authoritative candidate / workspace snapshot
pre_hash + version + provenance
semantic plan + plan_hash
diagnostics / verifier receipt + verifier version
checkpoint + post_hash
commit / rollback record
append-only event ledger
```

`PLAN.md`、`DIAGNOSTICS.md`、`STATE.md`、`VALIDATION.md` 可以是人类可读视图，但不能代替
runtime 可解析、可哈希、可恢复的状态。

### 2.2 轻量路径与治理路径

V8 的 runtime scaffold 显著提高成功率，但中位 token 约为静态路径的 7 倍；V9 又表明，
仅增加 ready/ledger 字段不会自动修复过严的工具合同。因此持久化强度需要成本门控：

```text
低耦合 + 可逆 + 失败便宜 + 单步可验证
  → lightweight path

高耦合 OR 长依赖链 OR 跨 Agent OR 提交昂贵/不可逆
  → governed state + ledger path
```

无论走哪条路径，旧 syndrome 都不得用于修改新 candidate。所有诊断必须绑定
`candidate_hash`、`pre_hash`、git commit 或等价不可歧义版本。

---

## 3. Semantic Plan 与 Plan Gate

### 3.1 什么时候必须先 Plan

以下任务必须先形成 semantic plan：

- 多文件、多模块或多章节联动；
- 存在 schema、接口、引用、账目或其他全局不变量；
- 后续修改可能推翻前面修改；
- 需要整体重构、Regional Rewrite 或 Full Rewrite；
- 修改顺序与展示顺序不同；
- 单步预算不足，需要拆成可独立验收的阶段；
- 目标地址可能因重排、并发或外部更新而漂移。

有明确、可复现、版本一致 syndrome 的单点修复，可以使用轻量 plan：

```text
确认 authoritative version
→ 声明 target semantic ID、old/new 与不变量
→ 最小执行
→ 重算 checker
→ 全局回归
```

### 3.2 Plan 最小合同

```json
{
  "plan_id": "stable-id",
  "pre_hash": "authoritative-state-hash",
  "operations": [
    {
      "target_id": "semantic-object-id",
      "intent": "replace",
      "old": "expected-old-value",
      "new": "proposed-new-value",
      "evidence_refs": ["..."]
    }
  ],
  "dependencies": [],
  "protected_invariants": [],
  "non_goals": []
}
```

Plan 应描述“改变什么、为什么、在什么前提下改变”，不应默认要求模型同时提交易漂移的
数组 index、旧行号、JSON path、文本 span 或完整未修改区域。

### 3.3 写入前 Plan Gate

进入 delivery 前至少检查：

- plan schema 与 semantic ID 可解析；
- `pre_hash` 仍绑定当前权威状态；
- old-value / precondition 成立；
- edit 集合没有重复、冲突和明显遗漏；
- 依赖与影响范围可闭合；
- protected invariants 成立或有明确 waiver；
- evidence 足以支持目标与新值；
- `plan_hash` 在 compile、delivery 和 commit 中不可被静默修改。

V5 表明：oracle plan 下 Patch 相对 Rewrite 有明显优势，但 infer-plan 两臂接近 floor。
因此更短的写入 API 不能替代 plan correctness。

### 3.4 锚点的正确定位

切集锚点、接口、schema、目录和大纲仍是有用的 plan 元素，但不得声称其结构位置已经被
V1–V12 单独确认为因果机制：

- V4 中，等量随机正确答案信息不弱于 full cut-set；
- V7 中，仅要求 topological order 的效应没有通过预注册门；
- V6/V8 支持的是 scheduler、ledger、renderer 或 staged scaffold 的组合干预。

因此，闭环任务应外部化足够状态并由 runtime 计算 readiness；“请模型按拓扑顺序思考”
不是 runtime scheduler 的替代品。

---

## 4. Candidate 与 Frontier 纪律

### 4.1 Candidate 默认

已有文件、代码、论文或配置，一律视为 candidate：

```text
读取 authoritative candidate
→ 确认目标、版本与不变量
→ 生成并验证 semantic plan
→ compile 或选择 delivery route
→ 原子执行
→ 验证与 commit
```

已通过验证或用户确认的版本必须冻结为 checkpoint。后续失败从最近有效 checkpoint 恢复，
不重新生成已经验证的内容。

没有 candidate 时，“先建最小可运行、可解析或可审查骨架”是高耦合任务的推荐启发，
不是已被实验确认的普遍定律。小型、低耦合、完整可验证的对象可以直接生成完整候选；
长对象、跨模块对象或验收函数不完整时，应优先建立可验证骨架。

### 4.2 Frontier（sgarx stage-internal）

当工作区走 `agent_mode=sgarx` / `.sgarx/` 时，stage 内部 Multi-Candidate Frontier
把 candidate 管理落到可审计节点上；它不是把 ProjectMode 改成搜索树。

| 控制面 | Frontier 落点 |
|---|---|
| Candidate | `propose-candidate` / `patch-candidate`；指纹为 `candidate_hash` |
| Plan | parent lineage、目标与受保护不变量 |
| Checker | stage `[check:]` + `audit-candidate --from-checks` |
| Syndrome | `format_candidate_bound_detail` / `audit.extras["bound_detail"]`；必须绑定当前 hash |
| Delivery | verified plan 下优先最小有效变更；Full Rewrite 必须隔离、diff、回归 |
| Recovery | 外环 `repair_attempts` + 内环 frontier 预算；reopen 不擦 `frontier.json` |

操作纪律：

1. 有 `frontier.json` 时，close 前必须 `promote-candidate`。
2. 审计失败后优先从明确 parent 形成新 revision，不覆盖已验证节点。
3. `autobuild` 默认 `use_candidate_frontier=False`；需要 frontier 时显式开启。
4. 稳定 `sgar` / blueprint 没有 frontier 指令；相关命令 `requires sgarx`。
5. 每个 stage 至多一个 promoted candidate；不要发明第二 promote 或 demote。

权威规格：[sgar_candidate_tree_upgrade](https://github.com/wxy2ab/llmdealer/tree/main/core/ccx/docs/sgar_candidate_tree_upgrade)；
战役记录：[sgarx_candidate_frontier_2026-07-27.md](https://github.com/wxy2ab/llmdealer/blob/main/core/ccx/docs/supervised/sgarx_candidate_frontier_2026-07-27.md)。

---

## 5. Verifier、Checker 与 Syndrome

### 5.1 两级验证

| 层级 | 目标 | 典型输出 |
|---|---|---|
| Local / incremental | 当前 operation、节点或受影响子图 | failed semantic IDs、约束、observed values |
| Global / commit | 完整 post-state 与业务不变量 | accept / reject / rollback witness |

Local verifier 用于早停与定位；global verifier 才是 commit gate。增量检查通过不能取消最终
全局验证。

### 5.2 Checker 纪律

1. 有可信、当前版本适用的 checker 时，修改前先运行 checker。
2. 没有自动 checker 时，先定义验收函数：测试、schema、lint、编译、渲染、数据核对或 rubric。
3. 每次执行后重新计算 syndrome，不继续使用旧报错。
4. candidate 与 syndrome 不一致时，先检查版本、环境、测试和观测通道。
5. checker 给出确定性修复时可以机械编译，但执行后仍须重新验证。
6. checker 本身必须有版本、coverage、false accept / false reject 与盲区记录。
7. schema 合法只证明语法合法，不等于语义正确。

### 5.3 Receipt 按需升级

V7 的 localized receipt 与 V9 的 located/causal receipt 都没有通过确认门；V9 中
LOCATED 与 CAUSAL 同为 30/32，但 CAUSAL 中位 token 更高。因此不得规定“回执越详细越好”。

推荐升级链：

```text
generic reject
→ failed semantic IDs / locations
→ expected vs observed constraints
→ causal witness / dependency slice
→ broader context or human escalation
```

只有上一层条件成功率不足，且新增证据的预期风险收益高于 token/latency 成本时，才升级。

### 5.4 接受语义而不是偶然序列化

如果业务对象在语义上无序，应接受 stable-ID set/mapping，再由 runtime canonicalize：

```text
model: {node_17, node_09, node_11}
runtime:
  validate semantic set
  → canonicalize order
  → compile native payload
```

V9 有 77 个 order failure 实际提交了正确 ready-ID 集合；V10 的 offline canonicalizer
通过 1,024/1,024 属性案例，但正式端到端增益没有达到预注册门。因此：

- 语义合同应避免无害的 order-only false reject；
- 不能承诺 canonicalization 在所有流量中都会带来大幅成功率提升；
- 只有顺序本身属于领域语义时，才把顺序写入接受边界。

---

## 6. Runtime 依赖、Semantic ID 与确定性编译

### 6.1 依赖调度由 Runtime 执行

Runtime 应持有：

- dependency graph；
- ready set；
- completed ledger；
- transition state 与 state hash；
- revision lineage；
- 未决 residual。

未 ready 节点不得执行；completed ledger 不得由模型任意重写；局部成功不自动等于全局提交。

V6 的 scheduler package 提高 43.8 pp，V8 的 runtime scaffold 提高 59.4 pp；V7 仅改变
requested order 只有 +10.4 pp 且未过门。工程默认应是 runtime scheduler，而不是更强
的顺序提示词。

### 6.2 Semantic ID 优于模型侧物理寻址

模型推荐提交：

```json
{"target_id":"item-0042","old":0,"new":1}
```

Runtime 根据当前权威对象解析物理 index/path。不要让模型长期引用：

- 旧行号；
- 数组 index；
- 未验证 JSON path；
- 易漂移文本 span；
- relocation 前的位置。

V8 的 ID−INDEX 为 +31.25 pp；V11 确认 relocation interaction 为 +21.875 pp，且效应
集中于较大配置；V12 在 low/high drift 下都观察到很大的 ID 简单优势，但没有确认
“漂移越大，ID 增益越大”的剂量定律。应采用 identity substrate，但不得把实验效应量
写成跨模型 SLA。

### 6.3 Verified Plan 优先确定性编译

推荐优先级：

```text
1. deterministic compiler + native executor
2. runtime-resolved semantic-ID Patch
3. verified Regional Rewrite
4. controlled Full Rewrite
```

V7 compiler 为 48/48 exact，V8 双路径 compiler 为 64/64 exact。它们是冻结 case 上的
实现采用证据，不是生产总体可靠率。Compiler 仍需 property、mutation、并发、stale-state、
crash/replay 与 OOD schema 测试。

---

## 7. Patch、Regional 与 Full Rewrite 路由

### 7.1 路由表

| 条件 | 首选 |
|---|---|
| plan 已验证且 compiler 支持全部操作 | Deterministic compile |
| plan 已验证、stable ID、稀疏/中等 edit、局部不变量充分 | ID Patch |
| 修改集中在一个子树、函数或 section，且 region 合同经过验证 | Regional Rewrite |
| 高密度、整体 schema/方向改变、Patch plan 过大 | Full Rewrite |
| plan 未验证 | 返回 planning / evidence gathering，不进入 delivery |
| stale hash / state drift | 刷新权威状态并 replan |
| compiler/tool 不支持目标语义 | 扩展 executor 或进入受控 fallback |

不得硬编码一个未经确认的 density crossover：

- V3、V5、V12 支持特定稀疏、正确 plan 条件下的 Patch 优势；
- V4、V6 的部分 Patch−Rewrite 对比接近零；
- V7 的一次 recovery 中 Rewrite 高于 located Patch re-emission；
- V11 四个 delivery 单元全部成功，可靠性未裁决，但 Patch 成本显著更低；
- V12 的 sparse Patch−Full 通过，差异来自 300 秒预算下 Full timeout；
- V12 dense Regional 只有 8/24，不能把 Regional 写成普遍最佳折中。

因此，**sparse verified-plan + stable-ID** 可以把 Patch 设为强默认候选；其他流量按
schema、coupling、coverage、collateral、预算和真实 telemetry 校准。

### 7.2 Full Rewrite 纪律

Full Rewrite 必须：

```text
保留 authoritative pre-state
→ 在新文件、分支或临时目录生成
→ 运行格式和语义检查
→ 与原版本做结构化 diff
→ 检查计划外变化
→ 完整回归
→ 原子替换
→ post-state 全局验证
```

“无关内容保持不变”不一定要求字节完全一致，但所有非预期语义、结构和格式变化都必须被
解释或撤销。大输出可以分块、局部提交和分段验证，但不能把未完成分块误记为完成对象。

---

## 8. Failure-Layer Routing

| Failure layer | 典型证据 | 恢复动作 |
|---|---|---|
| Observation / state | missing/stale evidence、hash mismatch | reread、retrieve、refresh、rebase |
| Plan | wrong target/value/dependency、证据不足 | replan、扩大检索、请求澄清 |
| Compile | unsupported operation、compiler defect | 修 compiler、缩小操作、受控 fallback |
| Delivery / tool | path/index/schema/tool args 错误 | rebind、recompile、修输出合同 |
| Executor / environment | permission、IO、transaction failure | rollback、修环境、重放幂等操作 |
| Verifier | 局部或全局不变量失败 | 获取最新 receipt、局部修复或扩大修复半径 |
| Commit / replay | stale pre-state、duplicate、conflict | abort、rebase、idempotent replay |
| Budget / resource | timeout、token 或 wall-clock 耗尽 | checkpoint、缩小分片、改变接口或预算 |
| Transport / infrastructure | provider、客户端、通道或版本异常 | 检查基础设施；与语义失败分开统计 |

V6 的 stage-aware router 相对 generic retry 提高 31.25 pp，但收益全部来自 plan-error；
delivery-error 的两种恢复均为 0/24。**选对失败层只是必要条件，目标 recovery executor
也必须有独立的成功率、成本和安全验证。**

语义、计划或 delivery 失败时，禁止无新增信息的同参数重试。重试至少应改变证据、范围、
计划、compiler、地址绑定、输出量、预算或环境之一。

短暂 transport error 可以在相同语义请求上做有界、幂等重试，但必须：

- 保持同一 semantic run key；
- 把 transport attempt 记录为 nested attempt；
- 不把重试当作新的独立样本；
- 防止重复副作用；
- 设置最大次数和退出条件。

---

## 9. Governed Commit 与事件账本

### 9.1 最小事务协议

```text
verify pre_hash
→ checkpoint
→ atomic apply
→ local checks
→ global verifier
→ post_hash + collateral audit
→ commit

on any failure:
rollback and preserve authoritative pre-state
```

必须防止：

- invalid object commit；
- stale write；
- partial multi-edit apply；
- verifier reject 后仍提交；
- plan hash 被 delivery 静默修改；
- replay 产生重复副作用；
- crash 后状态不明；
- 未授权 collateral changes。

V6 的 10,000 个 offline governed-commit 属性案例未观察到已编码的
invalid/duplicate/hash 违规；这是实现采用证据，不是生产总体可靠率证明。

### 9.2 Event Ledger

最小事件字段：

```json
{
  "run_key": "immutable-semantic-episode-id",
  "event_index": 7,
  "stage": "planned|plan_verified|compiled|tool|verifier|commit|rollback",
  "state_hash_before": "...",
  "state_hash_after": "...",
  "plan_hash": "...",
  "payload_hash": "...",
  "verdict": "...",
  "error_layer": null
}
```

不变量：

- `(run_key,event_index)` 唯一且 episode 内连续；
- terminal event 不被 resume 覆盖；
- retry 属于同一 episode 的 nested attempt；
- endpoint 可以从事件重建；
- payload 或可审计 hash 必须持久化；
- crash/replay 不产生重复副作用；
- resume 前识别没有 terminal event 的孤儿链。

V5/V6 因过程事件不足而限制了机制分析；V9–V12 已能从事件零错配重建正式 endpoint。
事件账本既是研究可复现资产，也是生产恢复与路由校准基础设施。

---

## 10. 预算、成本与策略门

“单步预算够不够”不足以决定策略。Router 至少应优化：

\[
U =
V_sP(\text{exact success})
- C_t(\text{tokens})
- C_l(\text{latency})
- C_r(\text{commit risk})
- C_h(\text{human escalation}).
\]

每个可选机制应分别记录科学证据、实现正确性、成本与外部效度，不能用一个
`experiment_passed` 同时控制论文措辞和生产默认：

```json
{
  "scientific_state": "passed|failed_gate|not_adjudicated",
  "implementation_gate": "passed|failed|untested",
  "cost_gate": "passed|failed|unknown",
  "external_validity": "synthetic|shadow|canary|production",
  "default_policy": "off|shadow|conditional|on"
}
```

最低 telemetry：

- exact endpoint 与失败层；
- wall time 与明确 budget；
- input/output/reasoning/total tokens；
- provider turns、transport attempts 与 retry cause；
- plan/compile/delivery/commit 分层耗时；
- tool argument bytes 与完整 response bytes；
- rollback、collateral 和 duplicate side effects；
- success per cost 与 tail latency；
- floor、ceiling 和 timeout 标记。

不能把 timeout usage 缺失当作 0，也不能把多个独立预算调用拼成同一次 survival curve。
成功率相同仍可能存在重要成本差；可靠性差异由 timeout 产生时，结论必须保留预算标签。

---

## 11. 完成条件

文件已经生成、patch 已应用或 tool 返回成功，都不代表任务完成。正式提交前必须满足：

```text
authoritative pre-state 与 plan 版本一致
plan 已验证且 delivery 未静默改变 plan
格式有效
局部 checker 通过
全局不变量成立
语义接受边界通过
回归检查通过
diff / collateral 中不存在未授权修改
post_hash 与验证记录一致
commit 或 rollback 终态已记录
最终产物与 event ledger 已持久化
```

`verify=none`、只有 schema gate、只有 tool success 或只有模型自我声明时，状态应标为
`ungated`，不得宣称完成。

---

## 12. 接单八问

1. **权威状态是什么，版本/hash 是什么？**
2. **任务是低耦合顺序任务，还是需要 runtime dependency/ledger 的全局任务？**
3. **模型需要提出什么 semantic plan，Plan Gate 如何验收？**
4. **目标能否使用 stable semantic ID，而不是物理 index/path？**
5. **正确 plan 能否由 deterministic compiler 交付？**
6. **若不能编译，应选择 Patch、Regional 还是 Full；依据是什么？**
7. **local/global verifier、commit、rollback 与 collateral audit 是什么？**
8. **预算、失败层、恢复 executor 和 event ledger 如何记录？**

---

## 13. CCX 运行时强制点与证据边界

以下表格描述 `llmdealer/core/ccx` 的实现守卫。**实现守卫通过测试，不等于对应策略已经被
实验证明为普遍性能定律。**

| 控制 | 当前运行时行为 | V1–V12 解释 | 相关模块 / 开关 |
|---|---|---|---|
| Patch-first 安全守卫 | 治理修复 turn stamp `ccx_patch_first`；已有文件拒绝无读覆盖与空 `old_string` 整文件旁路；watch fixer 同样应用 | 防止未审计覆盖；不代表 Patch 普遍优于 Rewrite。Full Rewrite 应走隔离、diff、回归路径 | `agents/patch_first.py`、`agents/read_before_write.py`、`cc_agent.py`、`modes/watch.py` |
| 版本绑定 syndrome | check residual 绑定 `candidate_hash` / git head；只注入当前诊断 | **T：安全不变量**；具体实现仍需测试 | `agents/syndrome.py`、`sgar/autobuild.py`、`modes/watch.py` |
| 单调进度与振荡停止 | 默认启用 ever-passed 集合增长；`no_progress_stop` 终止振荡 | 安全恢复策略；不能替代分层 root-cause routing | `agents/progress.py`、`modes/watch.py` |
| 无 check 不宣称完成 | `verify=none` / ungated → `passed=False, status=ungated` | global verifier 应控制 commit；具体 verifier coverage 仍需审计 | spawn / run-audit / goal |
| 读写集冲突治理 | scope 冲突自动依赖化；越界写 fail-loud；守卫安装失败抬到 run 级 | 与 runtime ownership 和 governed commit 一致 | `agents/rwset.py`、`agents/write_scope_guard.py`、`agents/metadata_inheritance.py`、`runtime.py` |
| 增量验证 | 只对变更路径相交的 scoped checks 增量重跑，之后全量确认 | 增量 verifier 的性能增益仍未裁决；最终 global verification 不可删除 | `agents/incremental_verify.py`、`sgar/validation.py`、`sgar/runtime.py` |
| Cut-set anchor | 显式 DAG 有环且无锚点时拒绝静默断环；有锚点时物化边界节点 | 合理的结构安全规则；V4 未证明 cut-set 位置有额外信息优势，V7 未确认纯 topo-order 门 | `modes/plan.py`、`agents/governed_goal.py`、`agents/goal_prompts.py` |
| Plan invariants | plan invariants 进入 extras 和子任务 metadata；跨模式跳变不可丢弃 | 与 plan gate 一致，但仍需 semantic evidence、pre_hash 与 plan_hash 校验 | `modes/plan.py`、`agents/metadata_inheritance.py`、`modes/spec.py`、`runtime.py` |

当前守卫尚不能自动证明以下事项已经完整实现或校准：

- 所有领域都有可靠 stable semantic ID；
- 每类 verified plan 都有 deterministic compiler；
- Patch / Regional / Full router 已找到真实 density × coupling 阈值；
- verifier 对真实语义没有 coverage blind spot；
- staged scaffold 在目标流量上的成本收益已经通过；
- 单模型、合成对象上的效应可以直接迁移到生产。

这些项目应作为实现 gate、shadow/canary 与持续实验对象，而不是写成无条件完成状态。
