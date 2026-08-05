# 聚合失配 V1–V12、V14–V17 实验总览

> **历史细节入口。** 当前包含 V18–V25 与全部已完成补充实验的统一总览见
> [聚合失配 V1–V25 与后续补充实验](./aggregation-mismatch-v1-v25-and-supplementary-experiments.zh-CN.md)。
> 本文只继续作为 V1–V17 截止点的权威细节文档。

**证据截止：** 2026-07-30

**用途：** 统一说明每一代实验回答了什么、最强数据是什么、哪些结论可以进入 Agent
工程，以及哪些主张仍不能推广。

**English:** [Aggregation Mismatch V1–V12 and V14–V17: Experiment Summary](./aggregation-mismatch-v1-v12-v14-v17-experiment-summary.md)

**范围：** V13 因四臂 ceiling 未裁决，作为方法开发 artifact 归档，不进入本证据合成。

## 30 秒总结

这组实验不是在寻找“哪种 prompt 最强”，而是在逐层分解一个系统性问题：

```text
局部规则会做
≠ 能从零构造全局一致对象
≠ 能推断正确 edit plan
≠ 能把正确 plan 稳定交付
≠ 能在状态漂移后安全提交
≠ 能在冲突后以安全策略恢复
```

V1–V2 建立预算内全局构造差距；V3–V5 分离 planning 与 Patch/Rewrite delivery；
V6–V10 检验 scheduler、ledger、failure routing、compiler、semantic addressing、
receipt 与 canonicalization；V11–V12 迁移到配置地址漂移和交付尺度；V14 则把时序收紧
到 payload seal 后的真实 TOCTOU drift；V15 分离安全冲突拒绝和 runtime 授权的一次
rebase；V16 匹配第二 provider turn，比较 same-state retry/reread 与 runtime unlock。
V17 固定 unlock，改变恢复信息，并把 typed escalation 加入不可解除冲突的合法
non-commit 终态。

最稳健的总结果是：

1. 相同 XOR 局部规则下，周期闭合的完整构造随长度快速进入预算内困难区；开边界递推
   和给定候选后的审计更容易完成。
2. candidate-conditioned auditing 的高成功率同时受候选信息和接口影响，不能推广为
   “验证普遍比生成容易”。
3. Patch 相对 Full Rewrite 的优势是条件性的；正确 plan、稀疏编辑、稳定地址、
   executor 与预算共同决定结果。
4. Runtime readiness/ledger、semantic ID、deterministic compiler、typed failure、
   atomic executor 和 verifier-gated commit 能转移部分聚合责任。
5. 科学方向与采用门必须分开：多个正点估计没有通过最小效应或 CI 门，ceiling/floor
   也不能写成等价或失败。
6. V14 证明了安全时序与 stale recovery 机制，但 +19.3% token interaction 没有达到
   预注册 +20% 门。
7. V15 的机器主检验通过：Intent-Rebase 24/24、Intent-Naive 0/24；但这是带 Pilot
   Gate 协议限制的恢复策略对比，不是模型通用能力结论。
8. V16 的机器主检验也通过：Generic/Reread 在锁定态均 0/24，runtime
   Unlock + Rebase 为 24/24。它建立的是恢复政策不变量，不是纯信息或模型推理效应。
9. V17 的四个 unlock 后信息臂全部 24/24，因此未通过预注册 superiority 门，也不能
   证明等价；完整旧状态比 receipt-only 多 74.9% 中位 token。不可解除锁下 typed
   Escalate 达到 24/24 合法终态且 commit=0，但这是治理 endpoint 对比。

## 1. 版本一览

| 版本 | 正式规模 | 核心问题 | 最强结果 | 主要边界 |
|---|---:|---|---|---|
| V1 | 3 配置 × 500 prompts | 现象是否跨配置出现 | B 三配置均 0/50；syndrome E 均 50/50 | B 全 timeout；探索性 |
| V2 | 1,596 + 540 follow-up | 长度、预算、A/B 与 C/B | A−B +0.956/+0.822；C−B +0.956/+0.911 | C−B 有候选/接口混淆 |
| V3 | DeepSeek 1,920 | 稀疏 Patch vs Rewrite | infer +0.217；oracle +0.408；900s +0.258 | 单模型、单点稀疏修复 |
| V4 | DeepSeek 756 | 信息、预算、接口、顺序 | 足够正确 bits +0.741 | 随机 bits 不弱于 cut-set |
| V5 | 288 agent arms | planning 与 delivery | oracle Patch−Rewrite +0.417 | infer planning floor |
| V6 | 624 calls + 10,000 offline | Agent control plane | scheduler +0.438；router +0.3125 | router 收益只来自 plan-error |
| V7 | 240 calls + 48 offline | 顺序、receipt、compiler | deterministic compiler 48/48 | order/receipt 未过门 |
| V8 | 288 episodes + 64 offline | runtime ownership、ID/index | scaffold +0.594；ID−INDEX +0.3125 | scaffold 约 7× tokens |
| V9 | DeepSeek 192 | ready×ledger；receipt recovery | A floor；B +0.125 未过 | package 不能拆成字段效应 |
| V10 | DeepSeek 64 + 1,024 offline | semantic-set canonicalization | offline 1,024/1,024 | 端到端 +0.0625 未过 +20pp |
| V11 | DeepSeek 256 + 1,024 offline | address drift；delivery×density | relocation interaction +0.21875 | 效应来自 N=48；B ceiling |
| V12 | DeepSeek 240 + 768 offline | drift dose；Patch/Region/Full | sparse Patch−Full +0.2917 | high−low interaction 失败 |
| V14 | DeepSeek 96 + 768 offline | post-seal drift + Exact recovery | 24/24 stale+recovery；+19.3% token | 未达预注册 +20% 门 |
| V15 | DeepSeek 96 + 768 offline | locked conflict 与恢复治理 | Rebase 48/48；Naive 0/24；A1 +1.0 | 恢复权限结构性不同；Pilot Gate 偏差 |
| V16 | DeepSeek 96 + 768 offline | matched-turn 冲突恢复 | Rebase 24/24；Generic/Reread 0/24；A1 +1.0 | authority/state/info 组合；manifest 元数据偏差 |
| V17 | DeepSeek 192 + 1,536 offline | unlock 后信息与不可解除升级 | A 四臂 24/24；Escalate 24/24 且 commit=0 | A ceiling 不等于等价；B endpoint 不同 |

## 2. V1–V2：从现象到确认性构造差距

V1 在三个部署配置上观察到周期闭合 B 0/50，而给定 syndrome 的 E 为 50/50。V2 用
1,596 条确认性结果和 540 条同期 C+B follow-up 修复了 V1 的长度 floor、运行数和同期
对照问题。

在 15 个 \(N\in\{32,48,68\}\) 匹配实例上：

| 对比 | DeepSeek | MiniMax |
|---|---:|---:|
| A / B | 45/45 vs 2/45 | 37/45 vs 0/45 |
| A−B | +0.956 | +0.822 |
| C invalid / B | 176/180 vs 1/45 | 164/180 vs 0/45 |
| C−B | +0.956 | +0.911 |

V2 支持长度与预算相关的结构/接口差距。C−B 不能被命名为纯 verification effect，因为
C 同时获得完整候选并改变输出操作。

## 3. V3–V5：Patch/Rewrite 与 planning–delivery 分解

V3 在 160 个新 holdout 上确认 DeepSeek 稀疏修复中的 Patch 交付优势：

- Infer @300s：228/480 vs 124/480，+0.217；
- Oracle plan @300s：240/240 vs 142/240，+0.408；
- Infer @900s：83/120 vs 52/120，+0.258。

V4 的短 five-bit 条件却接近 0，表明 Patch 不是无条件定律。V5 使用原生工具把
planning 与 delivery 分开：infer 为 2/96 vs 0/96，未通过；oracle 为 46/48 vs
26/48，+0.417 通过。因此更好的交付接口不能修复错误 plan。

## 4. V6–V8：把聚合责任转移到 Runtime

V6 的依赖 scheduler 提高 +0.438，stage-aware failure routing 提高 +0.3125，
10,000 个 governed-commit offline case 未出现 invalid/duplicate/hash 违规。但 router
收益全部来自 plan-error，delivery-error recovery 仍为 0/24。

V7 的 requested topological order 与 located receipt 都有正点估计却未通过确认门；
deterministic compiler 48/48 通过采用门。V8 的 runtime scaffold 从 11/32 提升到
30/32，ID Patch 相对 INDEX 从 43/64 提升到 63/64；代价是 scaffold 中位 token 约
7.04×，local verifier 增量因 ceiling 未裁决。

## 5. V9–V10：Package 效应、错误接受边界与 Canonicalization

V9 在更难的 effort-matched ready×ledger 四臂上几乎全部进入 floor。95 个失败中，
77 个提交了正确 ready-ID 集合，只因排列不同被 strict-order contract 拒绝。Located
和 causal receipt 都比 generic 高 12.5 个百分点，但 CI、Holm 与最小效应组合门未过。

V10 将这个诊断改为 semantic-set + runtime canonicalization。离线实现
1,024/1,024 通过，SET 臂的 24 个成功依赖非规范排列 canonicalization；正式成功率
却只有 30/32 vs 28/32，+0.0625 未达到 +20pp 门。合理结论是“不要把无害排列写进
语义拒绝边界”，而不是“大幅提高所有端到端任务”。

## 6. V11–V12：地址漂移与交付尺度

V11 的 relocation×(ID−INDEX) interaction 为 +0.21875 并通过；7 个差异全部来自
\(N=48\) relocated-index precondition failure。Patch/Rewrite 四臂均 32/32，
可靠性 ceiling，但 Patch 的 tokens、wall time 和 response bytes 明显更低。

V12 的 high−low drift-dose interaction 为 −0.0417，未通过；ID 在 low/high 都为
24/24，INDEX 为 6/24 和 7/24，说明大的简单效应不能偷换成单调剂量定律。Sparse
Patch/Full 为 24/24 vs 17/24，+0.2917 通过；7 个差异全部来自 300 秒内 Full timeout。
Dense Regional 仅 8/24，不能把 Regional 设为普遍中间方案。

## 7. V14：Post-Compile Drift 与 Exact Recovery

V14 在 payload seal 后才注入 drift。正式 96/96、pilot 12/12、offline 768/768，
formal raw events 1,416 条，endpoint rebuild mismatch=0。

Compatible Exact 24/24 首次返回 `STALE_OLD_VALUE`，随后 24/24 located recovery；
Compatible Intent 24/24 一次 commit，四臂最终均为 24/24。Primary：

\[
\Delta_{A1}=0.176459,\quad
95\%\ CI=[0.168331,0.184575],\quad
p_{\mathrm{exact}}=1.1921\times10^{-7}.
\]

因为 \(0.176459<\log(1.20)=0.182322\)，V14-A1 为
`failed_pre_registered_gate`。机制与安全语义成立，冻结的 +20% 成本承诺未通过。

详见 [V14 双语报告](./aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)。

## 8. V15：Locked Conflict 与受治理 Rebase

V15 完成 96/96 formal episodes、12/12 pilot cases 与 768/768 offline cases。
1,594 条 event 可零错配重建全部 endpoint。三个冲突臂的 72 次首提交都被安全拒绝；
Compatible Intent 首提交 24/24；Intent-Naive 最终 0/24；Intent-Rebase 与
Exact-Rebase 均恢复 24/24。

\[
\Delta_{\text{Intent Rebase−Naive}}=1.0,\quad
95\%\ CI=[1.0,1.0],\quad
p_{\mathrm{exact}}=1.1921\times10^{-7}.
\]

机器 claim state 为 `passed`，但分享状态是 `share_with_caveats`：Naive 被结构性
禁止 recovery，且冻结 Pilot Gate 要求每臂达到 2/3，而实现只把该门用于非 Naive 臂。
正式效应可复算，但 artifact 不能声称完全遵循预注册。

详见 [V15 双语报告](./aggregation-mismatch-v15-intent-conflict-governance.zh-CN.md)。

## 9. V16：匹配调用次数的冲突恢复

V16 完成 96/96 formal episodes、12/12 pilot cases 与 768/768 offline cases；
1,752 条 event 可重建所有 endpoint。三个 conflict 臂都有第二 provider turn：
Generic/Reread 仍锁定并均为 0/24，runtime Unlock + Rebase 为 24/24。

\[
\Delta_{\text{Rebase−Generic}}=1.0,\quad
95\%\ CI=[1.0,1.0],\quad
p_{\mathrm{exact}}=1.1921\times10^{-7}.
\]

机器 claim 通过。Artifact 支持“没有权威状态迁移的重试不是恢复”。它没有识别纯信息
效应：Rebase 同时改变 recovery authority、执行态与 target slice。冻结 manifest
还有一条陈旧 Pilot `stop_if`，因此整体分享状态为 `share_with_caveats`。

详见 [V16 双语报告](./aggregation-mismatch-v16-matched-conflict-recovery.zh-CN.md)。

## 10. V17：最小恢复上下文与 typed escalation

V17 完成 192/192 formal episodes、24/24 LLM pilot episodes 与
1,536/1,536 offline mutations；3,840 条 event 可重建全部 endpoint，每个正式
episode 恰好两个 provider turns、20 条事件。

Module A 把所有臂迁移到同一已解锁 \(S_2\)，只改变第二 turn 信息。RECEIPT、
OLDSTATE、TARGET-SLICE 与 REBASE-PLAN 均为 24/24 commit：

\[
\Delta_{\text{TARGET-SLICE−RECEIPT}}=0,\quad
\text{经验 paired bootstrap CI}=[0,0].
\]

V17-A1 未通过预注册 +0.25 superiority 门；这个 ceiling 不能证明总体等价。事件重建
发现每个 task 的四臂 recovery operations 完全相同：verified plan 已给定绝对、幂等
目标值。OLDSTATE 的中位 token 为 29,689，RECEIPT 为 16,979，前者高 74.9%，但
没有观察到成功增益。

Module B 让 Force、Generic 与 Escalate 留在锁定 \(S_1\)。Force/Generic 合计
0/48 commit；typed Escalate 为 24/24 合法升级、0/24 commit；已解除锁的 Resolvable
阳性对照为 24/24 commit。V17-B1 为 +1.0，Holm 后
\(p=2.384\times10^{-7}\)，但两侧 endpoint 不同。它验证 runtime/tool 治理合同，
不是同 endpoint 的任务完成优势。

详见 [V17 双语报告](./aggregation-mismatch-v17-unlock-info-escalate.zh-CN.md)。

## 11. 当前较强支持的命题

| 命题 | 证据 | 当前范围 |
|---|---|---|
| 局部能力不自动聚合成全局构造 | V1–V2 | 合成 GF(2)，两个主配置 |
| 完成难度受长度和预算影响 | V2–V4 | 预算内 endpoint |
| 正确信息/候选可恢复部分构造 | V2、V4 | 信息与接口常同时改变 |
| 正确 plan 后减少交付面可提高可靠性 | V3、V5、V12 | DeepSeek、冻结稀疏任务 |
| Dependency-aligned runtime 有价值 | V6、V8 | package 干预 |
| 正确 plan 优先确定性编译 | V7–V8 | 合成采用门 |
| Runtime 应拥有物理寻址和接受边界 | V8、V10–V12 | 合成配置 |
| Post-seal Exact 必须 stale，typed recovery 可完成 | V14 | 单模型、单调字段 |
| 冲突拒绝与恢复权限应是独立 runtime policy | V15 | 单模型合成协议 |
| 没有权威状态迁移的 same-state retry 不是恢复 | V16 | 匹配调用，但 authority/state/info 组合 |
| 绝对 verified plan 解锁后可由最小上下文完成恢复 | V17 | Module A ceiling；单模型、单操作类型 |
| 不可解除冲突应有 typed non-commit 路由 | V17 | runtime/tool 治理 endpoint，不是完成率优势 |

## 12. 明确没有建立的命题

- “验证普遍比生成容易”；
- Patch 永远优于 Rewrite，或 Regional 永远是最佳折中；
- 更高漂移必然进一步放大 semantic-ID 优势；
- requested order、located receipt、ready set 或 ledger 已分别建立普遍主效应；
- semantic-set acceptance 普遍带来 ≥20pp 增益；
- Intent 永远优于 Exact，或任意 Intent 都可以安全 merge；
- Exact recovery 已确认至少 +20% token interaction；
- 模型具有通用冲突能力、Intent 优于 Exact，或所有冲突都应自动 rebase；
- V16 已识别纯信息效应，或证明恢复中上下文永远无用；
- V17 已证明 receipt、target slice、旧状态与 rebase plan 在总体中等价，或当前状态
  普遍不必要；
- V17 已证明升级会提高任务完成率；Escalate 与 Force 的合法 endpoint 不同；
- 更长预算会普遍恢复周期构造；
- 单一 DeepSeek 合成实验已跨模型、跨语言或跨真实工程任务泛化；
- offline 全通过等于生产总体 100%。

## 13. 统一解释

最一致的解释不是“模型不会 XOR”或“模型不会编辑”，而是模型被要求同时承担过多
可组合责任：

```text
模型更适合：
  解释不确定语义、提出候选、生成 semantic plan

Runtime 更适合：
  持有权威状态、管理依赖、解析地址、canonicalize、编译工具参数、
  原子执行、验证、治理冲突恢复、提交/回滚、记录事件
```

当搜索、全局状态、物理地址、长对象序列化、陈旧 precondition 重绑和 commit 同时落到
模型上时，局部能力会在组合中损失。Agent 工程的核心是重分配责任，而不是无限增加
prompt。

## 14. 跨版本使用规则

- 不把不同 artifact 的 run 数、成功率或 \(p\) 值合并；
- 不把 secondary/exploratory 升格为 primary；
- 不把 floor/ceiling 写成失败、等价或无效；
- 不把 failed minimum-effect gate 写成零效应；
- 不把 ceiling 下 failed superiority gate 写成等价；
- 不把 commit 与 escalation 当成相同 endpoint 比较；
- 冻结文字门与可执行门不一致时，不声称“完全遵循预注册”；
- 不把预算内成功推广为无限预算语义正确率；
- 每条生产规则保留模型、对象、预算、工具、plan 质量和 verifier coverage 标签。

## 相关文档

- [V1–V12、V14–V17：Agent 工程经验](./aggregation-mismatch-agent-engineering-lessons-v1-v12-v14-v17.zh-CN.md)
- [V17 Unlock 信息与不可解除升级](./aggregation-mismatch-v17-unlock-info-escalate.zh-CN.md)
- [V16 匹配冲突恢复](./aggregation-mismatch-v16-matched-conflict-recovery.zh-CN.md)
- [V15 Intent 冲突治理](./aggregation-mismatch-v15-intent-conflict-governance.zh-CN.md)
- [V14 Post-Compile Drift 与 Exact Recovery](./aggregation-mismatch-v14-post-compile-drift-recovery.zh-CN.md)
- [可推导命题、证明条件与 Agent 工程含义](./aggregation-mismatch-theoretical-claims-agent-engineering.zh-CN.md)
- [Patch 与完整重写受控实验](./patch-vs-full-rewrite-controlled-experiment.zh-CN.md)
