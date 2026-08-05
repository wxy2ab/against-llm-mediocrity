# 聚合失配 V1–V25 与后续补充实验总览

更新日期：2026-08-05<br>
状态：证据综合；覆盖 V1–V25 与已完成的后续探针<br>
English version: [Aggregation Mismatch V1–V25 and Supplementary Experiments](./aggregation-mismatch-v1-v25-and-supplementary-experiments.md)

## 一句话裁决

整条实验线建立了一个硬朗但有边界的结论：当正确的下一步输出依赖尚未进入前缀或 runtime 状态的约束时，即使模型会执行局部规则，预算内端到端构造仍可能失败。把未来约束外部化、把已验证计划编译成确定性动作，并由 runtime 掌握权威状态、地址、锁、验证和提交，可以显著减轻这种失配。

证据**不支持**「验证普遍比生成容易」「Patch 永远优于 Rewrite」或「写作任务默认总开 Ladder/Stage」。写作线上最强结果是条件性的：V22-r6 的高负荷自然故事中，一位盲态编辑者给出 Ladder `+9.74/100 [6.32, 13.67]`；低负荷效应约为零。Stage Repair 能修复已知缺陷，但 V25 没有建立其相对 Fixed Ladder 的平均成品质量优势。

## 如何阅读这些证据

这不是一项可以合并计算的单一实验，而是三类端点不同的证据：

| 证据线 | 主要端点 | 能回答什么 | 不得与什么合并 |
|---|---|---|---|
| 受控 GF(2) 构造与 Agent runtime，V1–V19 | 固定预算内严格精确成功；安全/提交不变量 | 构造、规划、交付、状态与迭代机制 | 自然写作质量分 |
| 自然写作与 Stage Repair，V20–V25 | 盲态编辑质量、交付、treatment fidelity 与成本 | Ladder 和成文后修复的条件价值 | GF(2) 严格成功率 |
| Wave34、MiniMax 与 T1 补充 | 各探针自己的严格成功或探索性评分 | 离开 ceiling 与最小跨配置检查 | 完整跨模型复现主张 |

`passed` 表示通过预注册门；`failed gate` 表示没有建立预设最小效应，不等于真实效应为零；`ceiling` / `floor` 表示对比不可识别；`exploratory` 与 `share_with_caveats` 必须始终保留限定。

## 实验账本：V1–V25

### V1–V12：现象、外部化、规划与交付

| 版本 | 设计与规模 | 主要结果 | 冻结解释 |
|---|---|---|---|
| V1 | 探索性比较；3 配置 × 500 prompts | 暴露构造、审计和修复之间的大差距，但多个格子受 ceiling 或 timeout 主导 | 仅作先导；V2 才是确认性权威 |
| V2 | 1,596 条确认性结果，另有独立同期 C+B 540 条 | 15 个匹配实例上，DeepSeek A/B 为 `45/45 vs 2/45`，MiniMax 为 `37/45 vs 0/45`；四类无效候选审计 C 为 `176/180`、`164/180`，同期 B 为 `1/45`、`0/45` | 建立强预算内构造差距；C−B 是 candidate-conditioned auditing，不是纯验证效应 |
| V3 | 160 个新稀疏修复 holdout、1,920 次 DeepSeek 运行 | 300 秒 Patch−Rewrite 为 `+0.217 [0.165, 0.269]`；oracle-plan 为 `+0.408`；独立分配的 900 秒子集仍为正 | Patch+确定性执行在该稀疏、长对象、单配置窗口胜出；不是普遍编辑定律 |
| V4 | 756 次 DeepSeek；V4B 另有 54 个 audit/output 案例 | 完整答案 bits 把周期构造从 `13/54` 提升到 `53/54`；等量随机正确 bits 为 `54/54`；V4B audit 职责对比 `+0.815` | 正确信息外部化有效；结构 cut-set 位置没有已建立的额外优势；审计/输出解混仍部分受 ceiling 限制 |
| V5 | 288 个原生 tool Agent 臂；后续 event-stream 复现 | 自推计划 Patch/Rewrite 为 `2/96 vs 0/96`；历史 oracle-plan 为 `46/48 vs 26/48`，但 event-stream 复现提升了 oracle Rewrite，削弱旧 delivery-only 叙事 | 只有计划质量先过关，缩小交付面才有意义；planning floor 会抹掉端到端优势；历史 V5 必须带事件账本 caveat |
| V6 | 624 个 model-call keys + 10,000 个离线 commit 案例 | scheduler package `+0.438`；stage-aware routing `+0.313`，全部来自 plan-error；governed commit 通过；delivery-error recovery 仍为零 | runtime 调度、typed failure routing、commit 治理有价值，但路由收益取决于失败层 |
| V7 | 240 次调用 + 48 个离线 compiler 案例 | 指定顺序和 localized receipt 未过门；verified-plan 确定性编译 `48/48` 通过 | 已验证计划应直接编译；不能推成「提示顺序」或单一回执就足够 |
| V8 | 288 episodes + 64 offline | Gated ledger `+0.594`；semantic ID 相对 index `+0.313`；compiler 通过；density crossover 失败且脚手架成本高 | 支持 runtime-owned readiness/ledger 与语义寻址包，同时保留成本与识别边界 |
| V9 | 192 个 effort-matched episodes | ready/ledger factorial 落入 strict-order floor；located/causal receipt 的 `+0.125` 未过门 | package 效果不能在无可识别对比时分摊给某个单开关 |
| V10 | 64 formal + 1,024 offline | semantic-set canonicalizer 离线门通过；端到端 SET−STRICT 仅 `+0.0625`，未达 `+0.20` 门 | 接口合同正确，但没有建立大幅成功率承诺 |
| V11 | 256 episodes + 1,024 offline | relocation × `(ID−INDEX)` interaction 为 `+0.21875`；Patch/Rewrite 可靠性均 ceiling，Patch 更便宜 | 稳定语义 ID 在布局漂移时有价值；ceiling 下的成本优势不等于可靠性优势 |
| V12 | 240 episodes + 768 offline | drift-dose interaction 失败；sparse verified-plan Patch/Full 为 `24/24 vs 17/24`，差 `+0.2917` | DeepSeek 大对象稀疏修改中 Patch 提高 300 秒严格交付；未建立剂量单调、Regional 最优或跨模型迁移 |

### V13–V19：状态漂移、冲突治理与迭代粒度

| 版本 | 设计与规模 | 主要结果 | 冻结解释 |
|---|---|---|---|
| V13 | 96 formal + 768 offline | 四臂全部 `24/24` | 因 ceiling 与时序设计归档为 non-adjudicating；保留作方法开发，不作为正向证据 |
| V14 | seal-before-drift，96 formal + 768 offline | Compatible Exact 被判 stale 后恢复 `24/24`；token interaction 约 `+19.3%`，略低于预注册 `+20%` | stale 检查与恢复机制成立；主最小效应 claim 失败 |
| V15 | 96 formal + 768 offline | 冲突首提交 `0/72`；受治理 Intent/Exact Rebase `48/48`；Naive `0/24` | 机器主检验通过，但冻结 Pilot 文字与可执行 gate 不一致：`share_with_caveats` |
| V16 | 匹配第二 turn，96 formal + 768 offline | 锁定的 Generic/Reread 仍为 `0/24`；runtime Unlock+Rebase 为 `24/24` | 没有真实状态迁移的重试不是恢复；authority/state/info 仍为组合干预；`share_with_caveats` |
| V17 | 192 formal + 1,536 offline | unlock 后四个信息臂均 `24/24`；完整旧态多 `74.9%` 中位 token；不可解除锁下 typed Escalate 为 `24/24` 合法 non-commit | ceiling 下未识别额外上下文优势；Escalate 是不同于任务完成的安全终态 |
| V18 | 相同 3 次修订预算，144 个确认性 episodes | Stage `30/48 = 62.5%`；Step、No-Iter 均 `0/48` | 预注册 Step 优势在相反方向失败；Stage 优势是强 secondary 证据，不是预注册通过的普遍定律 |
| V19 | 最多 8 次 provider turn，144 个确认性 episodes | Stage `33/48 = 68.75%`；Step `5/48 = 10.42%`；No-Iter `0/48` | 对齐调用次数仍不能让 Step 追上；与 V18 一样，是重复方向性结果，但 primary 预测了相反方向 |

### V20–V25：长文本写作、Ladder 与成文后 Stage Repair

| 版本 | 设计与规模 | 主要结果 | 冻结解释 |
|---|---|---|---|
| V20 | 72 个正式输出 | Ladder−Direct `+12.5 pp`，低于 `+15 pp` 门 | 主要检验结构合规，不能有效裁决长篇文学质量 |
| V20R | 12 个低负荷长文配对 | 质量差 `−0.183`；Ladder token 约 `1.52×` | 低负荷负对照：没有质量收益，存在明确编排税 |
| V21 | 权威质量审计轮 36 个正式输出 | 因工程/数据问题，high Ladder 未达到 reader-ready；token 比约 `1.45×` | 只是否定当时实现的 operational 结果，不是对 Ladder 理论的因果反证 |
| V22 | 权威 r6：30 个输出、15 个盲态配对 | overall `+5.86 [0.61, 10.30]`；high `+9.74 [6.32, 13.67]`、`9–0–0`；low `+0.03` | 强单评者证据支持 high-load 条件启用；不是双编辑确认，也不是 always-on 默认 |
| V23 | r1 与 V23R/V23S 后续，每轮基于 15 个配对任务 | 缺陷 r1 为负；V23R 信号弱；V23S-R8 在单模型编辑评分下 high `+4.74 [1.78, 7.96]`、low `+9.97 [4.30, 15.48]`，high token `3.83×` | Stage 有选择性修复正信号，但 R8 为 `code_dirty`、成本高、未完成预注册双人类终点 |
| V24 | 24 个确认缺陷任务、72 个输出 | Oracle `24/24`；Infer `18/24`；Fixed `0/24`；V24-1 通过 | 稳定缺陷 witness 已给定时，Stage 具备编辑能力；不等于自然策略的成品质量优势 |
| V25 | r1 30 输出/15 对；定向 regression、clean 6-output pilot 与 27 个 multi-realization episodes | r1 high Stage−Fixed `+0.69 [0, 1.62]`、`1–0–8`，正式 inconclusive；regression 让此前 4 个 failed treatment 全部产生修改；clean pilot 通过，但 9 个 high 中 6 个跨 Stage realization 不一致 | 没有冻结平均优势或等价结论。r1 含 failed treatment、假 re-audit 路径和 dirty code；后续只验证工程门与 treatment 方差，不验证成品质量等价 |

写作与 Stage 证据另见 [V20–V25：长文本写作、Ladder 与 Stage Repair](./aggregation-mismatch-v20-v25-writing-and-stage-repair.zh-CN.md)。

## 已完成的后续补充实验

| 补充实验 | 覆盖 | 结果 | Claim 上限 |
|---|---:|---|---|
| V4 MiniMax X1 | 162/162 | 答案 bits 外部化 `A2−A0 = +0.852 [0.722, 0.963]`；cut-set 特异性仍未裁决 | 最小跨配置探针 |
| V5b Hard Oracle，DeepSeek | 96/96 | Patch `48/48`，Rewrite `45/48` | ceiling 下无法裁决 |
| V5b Hard Oracle，MiniMax X2 | 96/96 | Patch `48/48`，Rewrite `44/48` | ceiling 下无法裁决；只能说同号 |
| V3 MiniMax X2 | 96/96 | thinking disabled 时 Infer Patch−Rewrite `0.0 [0,0]` | 最小探针；不是完整 V3 复现 |
| V8-A1 MiniMax X1 | 64/64 | Gated ledger−Static `+0.34375`，同号并通过 | 最小跨配置探针 |
| V12-B1 MiniMax X1 | 48/48 | Patch、Full 都 `0/24`；Patch 为 precondition 失败，Full 由 transport 主导 | floor 下未裁决；不能给迁移结论 |
| V13b TOCTOU | 96/96 | Compatible Exact `0/24`，其余三臂 `24/24`，interaction `1.0` | 合成 seal-before-drift 正结果；不改写 V13/V14 身份 |
| T1 配置迁移 | 48/48 | 合成 K8s/feature-flag fixture 上 Intent `24/24`、Exact `0/24` | 外部效度 pilot，不是生产域定律 |
| Wave34 写作盲包 | 12 个匿名对、20 个同家族 panel 分 | panel `20/20` 平；双人类仍 pending | 仅同家族探索性 judge 结果 |

补充实验单列于 [Wave34 与跨配置最小探针](./aggregation-mismatch-wave34-and-cross-configuration-probes.zh-CN.md)。

## 整条实验线建立了什么

| Claim | 证据 | 有效范围内的结论 |
|---|---|---|
| 会局部规则不等于能完成全局构造 | V2、V4 | 受测闭合/未来依赖结构产生巨大预算内严格构造差距；不是理论不可能性 |
| 外部化未来约束能减轻差距 | V2-C、V4、MiniMax V4 X1 | candidate/答案信息能大幅恢复；结构位置没有唯一优势证据 |
| Patch 优势取决于计划质量与任务形状 | V3、V5、V11、V12、V5b | 计划验证后优先稀疏确定性交付；按 scope、density、预算和 provider 路由，不硬编码 Patch |
| Runtime ownership 能减少硬聚合负担 | V6–V12 | readiness、ledger、stable ID、canonicalization、compiler、verifier 与 commit 应退出 token 流 |
| 恢复需要有效的权威状态迁移 | V14–V17、V13b、T1 | stale/locked 写先拒绝；真实 unlock 后才 rebase；无法变为可写时升级 |
| 修订单元会影响失配修复 | V18–V19 | 受测合成 DAG 上 full-stage replan 反复胜过局部 step，但它来自预测相反方向的 primary 失败后的 secondary 结果 |
| 写作脚手架应按负荷启用 | V20R、V22-r6 | low-load Ladder 可能只是开销；high-load Ladder 有强单评者正信号 |
| Stage Repair 是能力，不是已证默认策略 | V23S、V24、V25 | 可修已知且可定位 residual；稳定平均净质量与实质等价均未确认 |

## 对 Agent 工程的直接含义

1. **先外部化，再生成。** 先把依赖、不变量、已接受证据、终态要求和未决约束写入控制对象，再请求长成品。
2. **分开计划质量与交付质量。** 先验证语义计划；计划正确且可编译时，编译成确定性动作，不再让模型重新序列化完整对象。
3. **按写入范围路由。** 稀疏修改用最小 Patch；Regional Rewrite 必须带覆盖检查；目标稠密或旧对象不可信时再 Full Rewrite。没有永远最优的单一接口。
4. **让 runtime 拥有硬状态。** readiness、稳定身份、版本/hash、锁、canonicalization、commit、rollback 和 replay 不应靠模型在自然语言里记住。
5. **把失败回执变成 typed state。** 区分 plan error、delivery error、stale、locked conflict、verifier、transport 与 budget exhaustion；只有相关状态或信息真的改变后才重试。
6. **条件启用 Ladder。** Direct 保持 low-load 默认；只有长程依赖与质量价值足以覆盖 token 成本时，才启用覆盖全文的 Skeleton→MVP→Full。
7. **Stage Repair 必须选择性、事务化。** 要求 defect witness、完整对象/状态视图、patch-first 有界修改、同等级 re-audit、rollback 与完整轮预算。clean stop 合法；failed treatment 不能伪装成 treatment delivery。
8. **分开测 treatment、artifact 与成本。** 最终 artifact 合法，可能只是因为 treatment 失败后退回基线。mutation、treatment delivery、final delivery、净质量、turn、token 与跨 realization 方差必须分别记录。

## 证据明确不支持什么

- 所有自回归模型都无法解决全局约束任务；
- 验证普遍比生成容易；
- 结构 cut-set 一定优于放在其他位置的等量正确信息；
- Patch 永远比 Full Rewrite 可靠，或两者普遍等价；
- 整个治理包的收益可以自动归因于某一个开关；
- 更多上下文总能改善恢复；
- 因为反馈更频繁，Step iteration 就应作为更好默认；
- 所有写作任务都应开启 Ladder 或 Stage Repair；
- V22/V23S 已完成预注册的两位独立人类编辑终点；
- V25 证明了 Stage 更好、Stage 更差或 Fixed≈Stage；
- MiniMax 探针已经复现完整 V5–V12 Agent 矩阵；
- 写作质量端点与 GF(2)/Agent 严格端点可以合成一个效应量。

## 权威来源与可复现性

权威报告、机器可读分析、冻结设计与结果产物位于 [`llmdealer` 聚合失配实验](https://github.com/wxy2ab/llmdealer/tree/main/exp/aggregation_mismatch_experiment)。主要入口为：

- [`AGGREGATION_MISMATCH_V1_V25_AND_SUPPLEMENTS_SUMMARY.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/AGGREGATION_MISMATCH_V1_V25_AND_SUPPLEMENTS_SUMMARY.md)
- [`AGGREGATION_MISMATCH_CLAIM_SUMMARY_ZH.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/AGGREGATION_MISMATCH_CLAIM_SUMMARY_ZH.md)
- [`WAVE34_GAP_CLOSURE_REPORT.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/WAVE34_GAP_CLOSURE_REPORT.md)
- [`V25_STAGE_VS_FIXED_ADVANTAGE_REPORT.md`](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V25_STAGE_VS_FIXED_ADVANTAGE_REPORT.md)

被中止的 MiniMax thinking-on V3 运行继续归档，不进入正式身份。归档 V13、dirty V23S-R8、dirty V25-r1、探索性 V25E 与尚未完成的人类评分都保留可见，不静默升格，也不删除。
