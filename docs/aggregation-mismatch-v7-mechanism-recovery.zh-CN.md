# 聚合失配 Artifact-v7：机制恢复、确定性交付与 Agent 工程

**文档类型：** 理论—实验—工程验证报告<br>
**证据截点：** 2026-07-28<br>
**总体评估：** **保留所列结论边界后可对外分享**<br>
**Study family：** `aggregation_mismatch_v7_mechanism_recovery`<br>
**Schema：** `artifact-v7`<br>
**English：** [Aggregation Mismatch Artifact-v7: Mechanism Recovery, Deterministic Delivery, and Agent Engineering](./aggregation-mismatch-v7-mechanism-recovery.md)<br>
**理论框架：** [LLM 系统中的聚合失配与组合治理](./aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md) · [可推导命题与 Agent 工程](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)

---

## 技术摘要

Artifact-v7 收窄了 artifact-v6 留下的两个问题。它使用 240 个正式
DeepSeek-V4-Flash 模型调用和 48 个离线 deterministic-compiler 案例，分别检验：

1. 固定信息量、schema、parser 与 renderer 后，只把**要求提交的 assignment 顺序**
   从逆拓扑展示顺序改为拓扑顺序，能否产生确认性收益；
2. 正确 plan 已知且 delivery 已失败时，**字段级定位回执**能否改善一次 patch
   re-emission，以及系统应在什么时候停止让模型再次序列化工具参数。

| 比较 | 严格成功 | 配对差与 95% CI | 裁决 |
|---|---:|---:|---|
| TOPO vs PRESENT | 20/48 vs 15/48 | +10.4 pp [2.1, 20.8] | **未通过**：低于 +15 pp；Holm \(p=0.125\) |
| LOCATED vs MASKED | 13/48 vs 6/48 | +14.6 pp [−2.1, 31.2] | **未通过**：CI 跨 0；Holm \(p=0.143\) |
| Deterministic compiler | 48/48 | exact rate = 1.0；不变量违规 0 | **通过 adoption gate** |
| Rewrite vs LOCATED | 26/48 vs 13/48 | +27.1 pp [6.2, 47.9] | **报告性对照**：无方向性通过门 |

最强且最可执行的结果，不是拓扑 prompting 或更详细错误文本已被证明是普遍机制，而是：

> **plan 已经验证正确时，运行时应优先把 plan 确定性编译成工具参数，再做全局验证和
> 原子提交；不应默认让模型重新采样同一份结构化交付。**

TOPO 与 LOCATED 都有正向点估计，但没有通过预注册确认门。Rewrite fallback 在本协议
中高于一次 located patch re-emission，但该比较没有方向性通过门，只覆盖一个配置和
平衡的合成错误分布，不能升级为普遍 `Rewrite > Patch` 定律。

![Artifact-v7 配对效应与置信区间](./assets/aggregation-mismatch-experiment/v7-claim-deltas.png)

红色标记只表示 A1/B1 的预注册最小效应 +0.15；Rewrite−Located 没有预注册方向阈值。
误差线是 48 个配对实例上的 bootstrap 95% 区间。

## 1. 理论：Artifact-v7 在检验什么

### 1.1 聚合失配也会发生在交付层

Agent episode 可以拆成三个失败层：

\[
P(\text{system success})
=
P(\text{plan correct})
\times
P(\text{delivery correct}\mid\text{plan correct})
\times
P(\text{commit safe}\mid\text{plan correct},\text{delivery correct}).
\]

这个分解是诊断分层，不是独立性假设。Artifact-v5 表明 Patch 工具不会修复错误 plan；
artifact-v6 表明 stage-aware routing 能帮助 plan error，但两个模型 re-emission
策略对 delivery error 都是 0/24。Artifact-v7 因此把 plan 固定为正确，只研究
delivery 与 commit。

### 1.2 拓扑顺序是结构性预测，不是模型表现定理

对 DAG 节点 \(v\)，所有前驱就绪后，显式执行器可以计算：

\[
x_v=f_v(x_{\mathrm{pa}(v)}).
\]

拓扑 scheduler 不需要读取未决前驱。逆拓扑展示则要求延迟提交、额外状态，或者先在
其他位置完成求解。

这证明的是显式执行的性质。Artifact-v7 改变的是 `requested_output_order`，不是模型
不可观察的内部推理顺序。模型可能按一种顺序求解、再按另一种顺序序列化。因此理论只能
预测可能的收益方向，不能保证某个部署一定提升至少 15 个百分点。

### 1.3 更精确的错误证据不保证固定模型会使用

LOCATED receipt 包含 MASKED receipt 的全部可用信息，并增加 field path、address 与
current hash。对可以忽略额外字段的最优策略：

\[
V^*(I_{\text{located}})\ge V^*(I_{\text{masked}}).
\]

这个信息单调性结论不意味着每个固定 prompt 策略 \(P_\theta\) 都会提升。部署模型可能
忽略、误读或受额外细节干扰。因此 B1 未过门不与信息理论冲突；它只说明部署收益没有
被确认。

### 1.4 正确 plan 使确定性编译成为自然边界

令：

- \(s\) 为带版本/hash 的权威状态；
- \(p\) 为已经验证正确且绑定到 \(s\) 的 plan；
- \(C(s,p)\) 把 plan 编译成原生工具参数；
- \(E\) 为确定性执行器；
- \(V\) 为全局验证器。

如果 compiler 正确实现 plan 语义、状态仍匹配、执行是原子的，而且 verifier 对所保护
不变量可靠，那么：

\[
V(E(s,C(s,p)))=1.
\]

此时再调用一次模型不会增加任务信息，只会增加随机序列化和工具契约失败面。V7-B2
验证的是当前 compiler 实现在 48 个冻结案例上是否通过采用门；它不是所有 compiler
的形式证明，也不是模型能力提升。

### 1.5 Patch 与 Rewrite 没有无条件排序

Patch 缩小模型提交面并保留未修改区域，但依赖稳定地址、old string、版本 hash 与严格
工具 schema。Rewrite 避开部分 patch 参数错误，却扩大输出和 collateral-change 风险。

正确工程对象因而是条件 router：

\[
\text{route}
=g(\text{plan confidence},\text{edit density},\text{address stability},
\text{compiler availability},\text{verifier coverage}).
\]

V7 的 Rewrite−Located 只说明 Rewrite 是当前单次 recovery contract 下更好的模型
fallback；它不推翻 artifact-v3 和 v5 已建立的条件性 Patch 优势。

## 2. 冻结实验设计

### 2.1 配置与推断

| 项 | 冻结值 |
|---|---|
| Model | `SimpleDeepSeekClientChat / deepseek-v4-flash` |
| Thinking | `False` |
| Temperature / top_p | `0 / 1` |
| Max tokens | 64,000 |
| Prompt language | 中文 |
| Per-call wall budget | 300 秒 |
| Primary unit | Instance |
| Bootstrap | 10,000 次 instance resample；seed `20260729` |
| Paired test | Exact two-sided sign-flip |
| Multiplicity | A1、B1 做 Holm 校正 |

正式设计中每个 instance-condition 只有一次运行。Temperature 0 会降低但不能消除托管
服务随机性，因此 v7 不能估计重复稳定性或日间漂移。

### 2.2 V7-A：requested-order 消融

48 个新 DAG 实例覆盖：

- \(N\in\{8,16\}\)；
- frontier \(\in\{2,8\}\)；
- 四个 cell，每个 12 个实例。

两个条件共享 graph、truth、信息、indexed JSON schema、parser 与 renderer：

| 条件 | Required assignment order |
|---|---|
| `A-TOPO-INDEXED` | 拓扑顺序 |
| `A-PRESENT-INDEXED` | 逆拓扑 presentation 顺序 |

主指标 `ordered_assignment_exact` 同时要求 schema、节点覆盖、请求顺序、节点值、
rendered object 和预算全部严格通过。

### 2.3 V7-B：delivery-recovery ladder

48 个新稀疏修复实例覆盖：

- \(N\in\{96,384\}\)；
- \(k\in\{1,10,20\}\)；
- 六个 cell，每个 8 个实例；
- 四种注入 delivery failure，每种 12 个实例。

每个 arm 共享 candidate、truth、已验证 oracle plan、plan hash、失败 tool arguments
和第一次失败事件。

| 条件 | 失败证据 | 允许动作 |
|---|---|---|
| `B-MASKED-REEMIT` | error code；address/hash 等字段遮蔽 | 一次 `file_edit_batch` |
| `B-LOCATED-REEMIT` | 精确 JSON path、address 与 current hash | 一次 `file_edit_batch` |
| `B-REWRITE-FALLBACK` | located receipt | 一次 `file_write` |
| `B-DETERMINISTIC-COMPILE` | 正确 plan + authoritative state | 不调用模型；runtime 编译 |

`recovery_exact` 要求使用允许的原生工具、plan hash 不变、executor 成功、全局 verifier
通过、最终对象严格正确、无 collateral change 且在预算内。

## 3. 数据与质量审计

独立复算得到：

| 检查 | 结果 | 解释 |
|---|---:|---|
| Formal rows | 240/240 | 无缺失 run key |
| Unique run keys | 240/240 | 重复 0 |
| Provider attempts | 240 | 每个 run key 恰好 1 次；没有 best-attempt selection |
| 条件覆盖 | 每条件 48 | 配对且平衡 |
| Failure subtype 覆盖 | 每类 12 | 注入错误平衡 |
| Timeout / over budget | 0/240 | 结果不是 timeout 驱动 |
| Event rows | 1,104 | 覆盖全部 240 个 run key |
| Duplicate event keys | 0 | `(run_key,event_index)` 唯一 |
| Event stream 不连续 | 0 | 每个 run 从 0 开始并保持连续 |
| Endpoint reconstruction | A 96/96；B 144/144 | mismatch 0 |
| Offline compiler | 48/48 exact | 48 个唯一案例；保护项违规 0 |

正式模型调用耗时为 2.35–28.81 秒，中位数约 3.56 秒，95 分位约 15.64 秒。失败来自
值、工具参数或全局验证，而不是在 300 秒被截断。

一个 schema 字段具有模块特异性：`schema_valid` 用于 V7-A 的 assignment output；
V7-B 使用原生 tool/executor 字段。不能跨 240 行直接聚合该字段，也不应构造不透明的
“v7 总成功率”。

配对复算同样与机器汇总一致：

- A1：正 5、负 0、平 43；raw \(p=0.0625\)，Holm \(p=0.125\)；
- B1：正 12、负 5、平 31；raw/Holm \(p=0.143463\)；
- Rewrite−Located：正 22、负 9、平 17；raw \(p=0.029449\)，不属于 A1/B1
  确认性方向门；
- 所有区间均使用 10,000 次配对 instance bootstrap。

冻结数据校验、分析、绘图和十个 v7 测试均通过。

## 4. 结果

### 4.1 请求拓扑顺序有小幅正效应，但不是已确认机制

| 条件 | Ordered exact | Order exact | Value-set exact |
|---|---:|---:|---:|
| TOPO | 20/48 | 48/48 | 20/48 |
| PRESENT | 15/48 | 48/48 | 15/48 |

两个 arm 在每个实例上都遵守 requested order。TOPO 的五个净胜实例来自值准确率，而
不是更少的顺序错误。结果与 prompt 顺序可能影响计算相容，但没有揭示 private reasoning
order，也没有拆解 artifact-v6 B 的全部 +43.8 pp 复合收益。

### 4.2 Located receipt 的诊断信息更丰富，但未形成确认性恢复定律

MASKED 为 6/48，LOCATED 为 13/48。点估计几乎达到 +15 pp 门槛，但区间跨 0，
配对检验也未通过。Located receipt 仍有诊断和路由价值；一次 located re-emission
不应被当作普遍可靠的恢复策略。

### 4.3 Deterministic compiler 通过冻结采用门

48 个案例全部严格恢复，并且：

- invalid tool arguments 为 0；
- collateral changes 为 0；
- hash-invariant violations 为 0；
- plan-invariant violations 为 0；
- rollback 时未保存 pre-state 为 0。

这是实现 acceptance test，不等于生产总体可靠率 100%，也没有证明所有输入上的
compiler 正确、verifier 完备或并发安全。

### 4.4 Rewrite 在本协议总体更强，但错误子类存在异质性

| Failure subtype | MASKED | LOCATED | REWRITE |
|---|---:|---:|---:|
| Stale hash | 0/12 | 5/12 | 3/12 |
| Old string not found | 2/12 | 1/12 | 7/12 |
| Duplicate edit | 0/12 | 3/12 | 8/12 |
| Wrong new value | 4/12 | 4/12 | 8/12 |

总体 Rewrite 为 26/48，LOCATED 为 13/48，但 stale-hash 子组中 LOCATED 更高。
这些子组计数只是描述性证据，不能事后形成确认性局部规律。它们提示生产 router 应把
refresh/rebase 失败与表示、verifier 失败区分开。

## 5. 按证据等级给出结论

### 已确认

- 正式 endpoint 与事件完整且可重建；
- 当前 deterministic plan compiler 通过冻结 48-case adoption gate；
- 结果不由 timeout 或缺失数据驱动。

### 有方向性但未确认

- requested topological order 相对 presentation order 为 +10.4 pp；
- located receipt 相对 masked receipt 为 +14.6 pp。

两项都不能被直接写成零效应，也不能写成已经证明；它们仍是需要复现或更高统计力设计的
候选方向。

### 当前协议工程默认，而非普遍规律

- delivery error 已发生且 deterministic compilation 不可用时，本协议支持 Rewrite
  优先于一次 located patch re-emission；
- 选择必须受 failure type、edit density、对象长度、地址稳定性和 verifier coverage
  约束。

### 当前不支持

- requested output order 已独立解释 artifact-v6 B；
- localized receipt 普遍提高模型恢复；
- Rewrite 普遍优于 Patch；
- deterministic compilation 提升模型能力；
- 48/48 是生产可靠率 100% 的证明；
- 单一 DeepSeek 配置和合成 GF(2)/DAG 可直接推广到其他模型或真实仓库。

## 6. 理论与实验的差距

| 结构或理论命题 | V7 观测 | 裁决 |
|---|---|---|
| 拓扑执行不读取未决前驱 | TOPO +10.4 pp；两臂顺序均 48/48 | 结构性质成立；LLM 收益未确认 |
| Located 证据扩大最优策略可用信息 | LOCATED +14.6 pp；CI 跨 0 | 信息关系成立；部署利用未确认 |
| 正确 plan 可以确定性编译 | 48/48；保护项违规 0 | 当前实现在样本采用门上通过 |
| Patch 通常提交面更小 | Rewrite 在本 recovery 协议更高 | 不矛盾：Patch 受严格参数和单次 re-emit 失败影响 |
| Verifier gate 保护已编码不变量 | 48 cases 保护项违规 0 | 支持实现；未证明 verifier 完备 |

核心结论是：

> **结构上更好的顺序或信息更丰富的 receipt，不会自动成为固定 LLM 的确认性收益。
> 能从 verified plan 编译的交付操作，应移出随机生成循环。**

## 7. 对 Agent 的工程意义

### 推荐控制流

```text
model proposes plan
→ plan verifier and plan hash
→ deterministic plan compiler
→ native tool executor
→ global verifier
→ atomic commit or rollback
→ model fallback only when the deterministic path is unavailable
```

### 具体调整

1. **分开存储 plan 与 delivery。** 受治理 plan 应携带 target identity、pre-state
   hash、edit set、依赖和 plan hash。
2. **为高频工具实现 compiler。** 从 verified plan 生成严格 API/tool arguments，
   不再让模型复制 address、old string、hash 或完整对象。
3. **保留 located receipt，但用它进行路由。** receipt 应触发 refresh、rebase、
   recompile、regional rewrite 或 escalation，而不仅是把错误文字追加到 prompt。
4. **保留 artifact-v6 的 scheduler、ledger 与 renderer。** Artifact-v7 没有证明
   requested order 单独解释复合收益。
5. **按失败层路由。** plan error 返回 planning；delivery schema error 进入 compiler；
   stale state 触发 refresh/rebase；verifier failure 再触发 rewrite 或 replan。
6. **让验证和提交不可绕过。** Executor success 不是任务完成；global verification
   与 hash 一致性必须控制原子 commit。
7. **保留可重建事件。** 记录 plan hash、pre/post hash、原生工具参数与结果、verifier
   receipt、commit 或 rollback receipt。

### 应避免的设计

- 每次 delivery error 都让模型“再输出一次相同 JSON”；
- 把更详细的错误文字当成唯一恢复机制；
- 因 A1 未通过就删除 dependency scheduler；
- 因 Rewrite−Located 为正就全局禁用 Patch；
- 用一个最终成功率掩盖 planning、delivery、verification 与 commit 失败层。

## 8. 可能的应用

| 场景 | Verified plan | Deterministic compiler | 验证与提交 |
|---|---|---|---|
| 代码修改 | 文件、symbol、old/new、依赖测试 | Batch edit 或 AST edit | Parser、tests、diff scope、atomic commit |
| JSON/YAML 配置 | Path、旧值、新值、版本 | JSON Patch 或 typed mutation | Schema、业务不变量、hash gate |
| 数据库 migration | Schema delta、backfill plan、前置条件 | SQL/DDL transaction | Dry run、constraints、transactional commit |
| 结构化文档 | Section/anchor、替换内容、引用 | Document operations | 结构、链接、格式、导出验证 |
| 多 Agent DAG | Task dependencies、ready set、产物 contract | Scheduling 与 merge operations | Ledger、integration tests、release gate |
| API/tool workflow | Validated intent、resource id、参数约束 | 原生 API arguments | Idempotency、response invariant、rollback |

每个应用都需要域内 executor 与 verifier。开放式创作、目标未决、缺少可执行 plan 的任务，
不会自动继承 deterministic-compiler 结论。

## 9. 局限与下一步实验

1. **单配置：** DeepSeek-V4-Flash、中文、thinking 关闭；需要成本可控的第二配置复现。
2. **正式单次运行：** 需要重复或跨日 block 设计估计托管服务波动。
3. **合成任务：** GF(2)、DAG 和结构化字符串提供严格真值，不代表真实代码语义。
4. **平衡注入错误：** 每类 12 个不等同生产 base rate；生产 lift 要按自然失败重加权。
5. **B2 是采用门：** 仍需 property-based、mutation、concurrency 和真实仓库 holdout。
6. **A1 不强制内部顺序：** 更强设计应外部化 step ledger 或由 runtime 强制 readiness。
7. **Fallback 仍需条件化：** 扫描 edit density、对象长度、地址稳定性和 regional
   rewrite，学习 Patch/region/Rewrite router。

## 10. 可复现性与来源

权威源资产：

- [冻结设计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V7_AGENT_MECHANISM_RECOVERY_DESIGN.md)
- [原始裁决报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V7_AGENT_MECHANISM_RECOVERY_REPORT.md)
- [理论—实验验证](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V7_AGENT_MECHANISM_RECOVERY_VALIDATION.md)
- [机器可读汇总](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v7_agent_mechanism_recovery/confirmatory/analysis/summary.json)
- [覆盖审计](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/results/v7_agent_mechanism_recovery/confirmatory/analysis/coverage.json)
- [完整实验仓库](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment)

复现命令：

```bash
conda activate env
cd exp/aggregation_mismatch_experiment
python scripts/verify_v7_agent_data.py
python scripts/analyze_v7_agent.py --require-complete
python scripts/plot_v7_agent.py
python -m pytest -q tests/test_v7_*.py
```

## 11. 一句话结论

> **Artifact-v7 没有确认 requested topological order 或 field-localized receipt 是
> 单独成立的普遍恢复机制。它确认了更有用的工程边界：正确 plan 能被可靠编译时，
> 结构化交付应从模型采样转移到 deterministic compiler、global verifier 和
> atomic commit。**

## 相关文档

- [Artifact-v8 后续：运行时所有权与语义寻址](./aggregation-mismatch-v8-runtime-ownership-routing.zh-CN.md)
- [Aggregation Mismatch Artifact-v7: English](./aggregation-mismatch-v7-mechanism-recovery.md)
- [LLM 系统中的聚合失配与组合治理](./aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
- [聚合失配：可推导命题与 Agent 工程](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [Patch 与完整重写受控实验](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)
- [Artifact-v5 稳定编辑 Agent](./aggregation-mismatch-v5-stable-editing-agent.zh-CN.md)
