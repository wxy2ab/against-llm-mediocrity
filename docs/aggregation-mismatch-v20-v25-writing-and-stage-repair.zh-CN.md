# 聚合失配 V20–V25：长文本写作、Ladder 与 Stage Repair

更新日期：2026-08-05<br>
English version: [Aggregation Mismatch V20–V25: Long-Form Writing, Ladder, and Stage Repair](./aggregation-mismatch-v20-v25-writing-and-stage-repair.md)

## 一句话裁决

V20–V25 没有建立一个普遍最优的长文本写作 workflow，而是识别出一条路由边界：

- 多阶段 Ladder 在低负荷任务上会产生额外开销，早期短结构实验也没有验证其价值；
- 在干净的 V22-r6 高负荷自然故事子集上，Ladder 出现强单评者正信号；
- 全文已经存在后，Stage Repair 能修复已知且可定位的缺陷，但现有证据没有建立当前 Stage 策略相对 Fixed Ladder 的稳定平均成品质量优势。

因此，当前可辩护的生产策略是：**Direct 为默认；高聚合负荷时条件启用 Ladder；只有存在可信 defect witness 且质量预算足够时才启用 Stage Repair。**

## 理论

长文本写作中的聚合失配发生在：前文一句话、一个场景、一条 claim 或人物状态，必须与很久以后才出现的信息保持一致。三种策略暴露不同的控制面：

```text
Direct：prompt → full draft
Ladder：plan/control space → full skeleton → MVP full story → full story
Stage repair：full story → global audit → bounded replan/patch → re-audit 或 rollback
```

理论既不推出「阶段越多越好」，也不推出「修复一定优于规划」。Ladder 可以在 prose 变得昂贵前外部化未来约束，但也会增加阶段交接与扩写表面；Stage Repair 能观察完整对象，但只有 verifier 找到重要 residual、且事务式编辑提高净质量而不引入新冲突时，才有收益。

## 实验与数据

| 实验 | 对比 | 权威数据 | 结果 | 状态 |
|---|---|---:|---|---|
| V20 | Global Ladder vs Direct vs Prefix Step | 72/72 | Ladder−Direct `+12.5 pp`，低于 `+15 pp`；Prefix Step 几乎全败 | primary gate 失败；端点是结构合规，不是文学质量 |
| V20R | 低负荷长文 Ladder vs Direct | 12 对 | 质量差 `−0.183`；Ladder 约 `1.52×` tokens | 已关闭负对照：无增益、更贵 |
| V21 | 高/低聚合负荷 crossover | 权威质量审计轮 36 个正式输出 | high Ladder 未达到 reader-ready；token 比约 `1.45×` | operational negative；因 treatment 受工程/数据缺陷影响，因果 claim 不可裁决 |
| V22-r6 | 自然故事 Direct vs Ladder | 30 输出 / 15 对 | overall `+5.86 [0.61,10.30]`；high `+9.74 [6.32,13.67]`、`9–0–0`；low `+0.03` | 强 post-hoc 单评者支持；clean tree；双人类终点未完成 |
| V23 r1 | Fixed Ladder vs Stage Repair | 30 输出 / 15 对 | high `−4.34`；15 个 Stage 中只有 3 个改文；high 首稿不共享 | 缺陷实现记录；不能反证 Stage 范式 |
| V23R | high 共享首稿后的 Stage 增量 | 30 个已交付 artifacts | high `+1.19`、`1–0–8`；tokens `+60.1%` | 弱探索信号；主门未过 |
| V23S-R8 | 匹配 first-full 后 verifier-driven Stage | 30 输出 / 15 对 | high `+4.74 [1.78,7.96]`、`4–0–5`；low `+9.97 [4.30,15.48]`；high token `3.83×` | 单模型编辑者正信号；`code_dirty`；双人类终点未完成 |
| V24 | 预确认缺陷上的 Fixed/Infer/Oracle | 72 输出 / 24 任务 | Oracle `24/24`；Infer `18/24`；Fixed `0/24` | Oracle 修复能力 claim 通过；不是自然策略质量对比 |
| V25-r1 | Fixed vs 当前 Stage，三 judge 绝对分 | 30 输出 / 15 对 | high `+0.69 [0,1.62]`、`1–0–8`；aggregate tokens 约 `4.46×` | 正式 inconclusive；dirty code 且 treatment fidelity 有缺陷 |
| V25 后续 | 定向控制器 regression、clean pilot、缺陷敏感复评、Stage×2、探索性等价 | 4 个旧 failed treatment；Pilot 6；9 个改文对；27 个 multi-realization episodes | 修复后旧失败任务全部产生修改；Pilot 工程门 CLEAN；high 复评 `3–0–3`；6/9 任务跨 realization 不一致；探索 TOST 落入 ±3 | 仅工程与方差证据；不能升格 superiority/equivalence |

## 这条实验线逐步修正了什么

### 1. 早期负结果部分来自端点不对

V20 主要测结构合规，不是高质量长篇写作。V20R 可以有效保留为低负荷负对照。V21 则给出真正的工程教训：如果 Ladder treatment 泄漏结构对象或没有达到篇幅要求，就不能裁决文学质量。

### 2. V22 建立了按负荷条件化的 Ladder 信号

权威 r6 使用 clean tree 和盲态全文复评。high-load 的收益主要集中在因果、伏笔回收、节奏和编辑就绪度，语言与原创性几乎没有变化。观测 high-load 增益的代价约为 `2.34×` tokens、`1.62×` wall time。因此它支持可选 quality mode，不支持默认总开。

### 3. Stage Repair 必须先成为真实 treatment

V23 暴露了不共享首稿、审计上下文截断、stop 与 issue 冲突、修改不生效和 re-audit 过弱。V23R/V23S 逐步加入共享 checkpoint、更完整状态、patch-first、rollback 和完整轮停止。R8 随后出现单评者正信号，但仍然昂贵，且来自 dirty tree。

### 4. V24 把能力与策略价值分开

可信 defect witness 已给定时，Oracle Repair 达到 `24/24`；Infer 为 `18/24`，说明检测与规划仍是主要瓶颈之一。这个结果证明编辑算子在有利信息条件下可工作，不证明自然 Stage loop 应当总开。

### 5. V25 阻止了过早的 Stage≈Fixed 结论

V25-r1 的大量平局混合了合理 clean stop、失败后退回基线文本的 failed treatment、低于 judge 分辨率的小改，以及一条假 re-audit 提交路径。区间下界触零的 inconclusive 既不是 superiority，也不是 equivalence。Phase 2 修复工程门后又发现 Stage treatment 跨 realization 有明显方差。因此，正式质量 claim 需要 clean frozen code、多 realization 或预先声明其分布 estimand，以及独立质量端点。

## 冻结结论

### 在范围内获得支持

- 低负荷 Ladder 可能只增加成本，不增加质量；
- V22-r6 单评者审计对 high-load 自然故事给出强 Ladder 正信号；
- defect witness 可靠时，Stage Repair 能解决预确认缺陷；
- matched draft 上 verifier-driven Stage 能产生正向增量编辑；
- treatment fidelity、judge 分辨率与 run-to-run 方差会实质改变测得的 Stage 价值。

### 尚未建立

- Ladder 是聚合失配的最佳普遍解；
- Ladder 会节省 token；
- 每个 high-load 任务都受益；
- Stage Repair 平均优于 Fixed Ladder；
- Fixed Ladder 与 Stage Repair 实质等价；
- V22 或 V23S 已获得两位独立人类确认；
- 结果能推广到其他语言、provider、专家文体或生产编辑团队。

## 工程指南

### 路由策略

```text
低聚合负荷
  → Direct

首份全文之前的高聚合负荷
  → 可选 full-scope Ladder

已有全文 + 可信且重要的 defect witness
  → selective Stage repair

没有可靠 witness、预期价值低或预算紧
  → stop / Direct / human review；不要习惯性启动 Stage
```

### 最小 Stage 事务

1. 从全文构建状态账本：实体、时间线、开放/已关闭冲突、claim/evidence 与结局状态；
2. 输出带影响 span 和期望不变量的 typed defect witness；
3. 优先有界 Patch；Regional Rewrite 必须带显式覆盖；
4. 在 candidate copy 上事务式应用；
5. 用同等级或更强语义能力 re-audit；
6. 只有净价值通过才 commit，否则 rollback；
7. 仅在完整轮结束时 stop，并区分 `clean_stop` 与 `failed_treatment`。

### 必须记录的 telemetry

- shared first-full hash；
- defect witness 与 verifier provenance；
- mutation、treatment delivery；
- patch attempt、成功 apply、rollback 与 re-audit；
- 最终 artifact delivery；
- paired net-quality score；
- token、turn、wall time 与跨 realization treatment 方差；
- code-tree identity 与 reproducibility status。

## 可能应用

以下是工程推论，不是已直接验证的跨域 claim：

- 长篇故事、报告、论文、法律文本与政策文档；
- 跨章节姓名、日期、定义、claim 与数字一致性；
- 首份完整对象暴露全局 residual 后的配置/schema migration；
- 只有通过验证的 delta 才进入共享状态的多阶段 Agent。

## 来源

- [V1–V25 完整总览](./aggregation-mismatch-v1-v25-and-supplementary-experiments.zh-CN.md)
- [V18/V19 Step vs Stage 证据](./aggregation-mismatch-v18-v19-step-vs-stage-iteration.zh-CN.md)
- [`llmdealer` V22-r6 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V22_NATURAL_STORY_QUALITY_R6_REPORT.md)
- [`llmdealer` V23S-R8 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V23S_VERIFIER_DRIVEN_STAGE_REPORT.md)
- [`llmdealer` V24 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V24_CONDITIONAL_STAGE_REPAIR_REPORT.md)
- [`llmdealer` V25 与 Phase 2 报告](https://github.com/wxy2ab/llmdealer/blob/main/exp/aggregation_mismatch_experiment/docs/V25_STAGE_VS_FIXED_ADVANTAGE_REPORT.md)
