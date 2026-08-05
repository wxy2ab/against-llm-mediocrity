# 聚合失配：Wave34 与跨配置最小探针

更新日期：2026-08-05<br>
English version: [Aggregation Mismatch: Wave34 and Cross-Configuration Probes](./aggregation-mismatch-wave34-and-cross-configuration-probes.md)

## 一句话裁决

已完成的补充实验关闭了若干具体缺口，但没有把 V1–V25 升格成完整跨模型复现。它们提供了三类有效结果：

1. 答案信息外部化与 gated-ledger package 在 MiniMax 上保持同方向正效应；
2. 更难的 V5b oracle-delivery 格在 DeepSeek 和 MiniMax 上仍受 ceiling 限制，无法裁决 Patch 与 Rewrite；
3. seal-before-drift 的 Intent/Exact 实验可以离开旧 V13 ceiling，而首次合成配置域迁移虽为正，仍只是 pilot。

写作盲包没有形成独立人类确认：同家族 LLM panel 全部判平，两位人类编辑的评价仍未完成。

## 补充实验账本

| 包 | 设计 | 覆盖 | 主要结果 | 证据状态 |
|---|---|---:|---|---|
| V4 MiniMax X1 | A0 无锚点 vs A2 完整答案 bits vs A3 等量随机正确 bits | 162/162 | A2−A0 `+0.852 [0.722,0.963]`；A2−A3 `+0.074 [−0.074,0.241]` | 答案外部化同号；cut-set 特异性未裁决 |
| V5b DeepSeek | Hard oracle Patch vs Rewrite | 96/96 | Patch `48/48`；Rewrite `45/48` | `inconclusive_ceiling` |
| V5b MiniMax X2 | 相同冻结 V5b specs | 96/96 | Patch `48/48`；Rewrite `44/48` | `inconclusive_ceiling`；只能说同号 |
| V3 MiniMax X2 | Infer Patch vs Infer Rewrite，thinking disabled | 96/96 | 16 个 holdout 上差 `0.0 [0,0]` | 仅最小探针；不是完整 V3 复现 |
| V8-A1 MiniMax X1 | Gated ledger vs Static batch | 64/64 | `+0.34375`，与 DeepSeek `+0.59375` 同号；探针门通过 | 对 package 的最小跨配置支持 |
| V12-B1 MiniMax X1 | Sparse Patch vs Sparse Full | 48/48 | 两臂均 `0/24`；Patch precondition 失败，Full transport 失败 | floor 未裁决；不能得出同号迁移 |
| V13b | Disjoint/Compatible × Intent/Exact，seal before drift | 96/96 | Compatible Exact `0/24`；其余 `24/24`；interaction `1.0` | 在该合成时序/策略对比下 `supports_positive` |
| T1 transfer pilot | 合成 K8s/feature-flag fixture 上 Intent vs Exact | 48/48 | Intent `24/24`；Exact `0/24` | 仅外部效度 pilot |
| Wave34 写作盲包 | 12 个匿名 V25-r1 对、两个同家族 LLM persona | 12 对 + 20 评分 | `20/20` 平 | `exploratory_same_family`；人类编辑 pending |

Wave34 主 API 账本共 `432` 条完成运行：V5b DeepSeek 96、V5b MiniMax 96、V13b 96、V3 MiniMax 96、T1 48。20 条写作 panel 评分单独记录。主动中止的 MiniMax thinking-on V3 尝试继续归档，不计正式 coverage。

## 每个探针改变了什么

### 答案信息迁移强于结构位置特异性

MiniMax 复现了 A2−A0 的大幅恢复方向，但没有建立结构 cut-set 位置相对等量随机正确信息的优势。工程含义是外部化足够的决定性信息，不要把脚手架过拟合到尚未确认的图位置机制。

### 更重 payload 没有救出 Patch–Rewrite 对比

V5b 两个部署上的 Patch 和 Rewrite 都保持在 90% 以上。这是识别失败，不是实质等价证据。未来 crossover 需要避开 ceiling 与 floor，并分别记录计划质量、transport、payload size、edit density 与 exact commit。

### 跨配置结果必须按机制读取

Gated-ledger package 通过小型 MiniMax 探针。V12 sparse Patch/Full 没有迁移，因为两臂失败原因不同：Patch 生成了无效 new value，Full 则在 transport 上中断且 token=0。把共同零成功写成「两种方法一样失败」会丢掉 failure layer 的因果信息。

### TOCTOU 治理可以离开 V13 ceiling

V13b 调整时序与 recovery policy，使 Compatible Exact 在 seal-before-drift 后不能恢复，因此该格降至 `0/24`，Intent 与 disjoint controls 仍为 `24/24`。T1 在合成配置 fixture 上保持同方向。这支持状态治理机制，但 T1 不是生产 Kubernetes 或 feature-flag 系统的证据。

### 写作盲包不是独立确认

20 个同家族 panel 分全部为平。它可能来自 judge 分辨率、源配对差异或 treatment 信号；不能覆盖 V22-r6、V23S 或 V25，也不能替代两位独立人类编辑。

## 工程意义

- 跨 provider 启用应落在**机制**层，而不是整个 Agent 层；
- 为 provider 保存 reasoning mode、transport reliability、payload limit 与 schema adherence 元数据；
- 不要对 floor 盲目重试：`precondition` 送回 plan/value repair，`transport` 送到 client/payload 处理；
- comparative research 遇到 ceiling 应视为设计分辨率失败，先移动难度窗口再谈相等；
- 在完整匹配矩阵通过前，跨配置探针与生产默认保持分离；
- 自然写作质量 claim 在升格前必须补独立人类评价。

## Claim 上限

这些补充支持「最小探针同方向」和「合成机制可以被做成可识别」，不支持：

- MiniMax 对 V3 或 V5–V12 的完整复现；
- 普遍 Patch/Rewrite crossover；
- T1 fixture 的生产可靠性；
- 从 V5b ceiling 或 V12-B1 floor 推出等价；
- 写作结论已获得独立人类确认。

## 来源

- [V1–V25 完整总览](./aggregation-mismatch-v1-v25-and-supplementary-experiments.zh-CN.md)
- [`llmdealer` Wave34 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/WAVE34_GAP_CLOSURE_REPORT.md)
- [`llmdealer` MiniMax V8/V12 探针报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/MINIMAX_NECESSARY_PROBE_V8_V12_REPORT.md)
- [`llmdealer` V4 MiniMax 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V4_MINIMAX_X1_CROSS_CONFIG_REPORT.md)
- [`llmdealer` V13b 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V13B_TOCTOU_INTENT_REPORT.md)
- [`llmdealer` T1 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/T1_CONFIG_TRANSFER_PILOT_REPORT.md)
