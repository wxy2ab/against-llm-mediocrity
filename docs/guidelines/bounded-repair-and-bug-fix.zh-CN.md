# 局部修复与 Bug Fix

状态：第一批操作指南

主要模式：有范围写入

前提：缺陷可复现，或者原因已经充分定位

English：[Bounded Repair and Bug Fix](./bounded-repair-and-bug-fix.md)

## 1. 结果

局部修复要在授权变更面之外保持行为不变，同时消除指定缺陷。

```text
绑定当前状态的失败 oracle
→ 已验证修复 plan
→ 最小充分实现
→ 局部和全局验证
→ collateral audit
→ 可提交产物
```

目标不是最小文本 diff，而是能够完整修复因果机制、并且可验证的最小修改。

## 2. 进入闸门

只有满足下列条件才进入本流程：

- 用户要求的行为清晰；
- 缺陷已复现或原因已充分定位；
- 权威 candidate 和版本已知；
- 修复可以限定，不需要重新设计产品；
- verifier 能观察修正后的行为。

原因不确定时返回故障诊断。修复会改变公开语义、跨越兼容边界或需要大范围架构改变时，
转入功能/重构/迁移指南。

## 3. 冻结失败案例

编辑前保存：

```text
最小失败输入
expected vs observed
command/environment
失败输出
candidate hash 或 commit
相关配置
```

优先形成自动回归测试。无法自动化时，持久化 deterministic reproduction script、fixture、
trace 或明确检查步骤。

测试不能只断言准备采用的实现细节。它必须在原缺陷上失败，并在修复行为上通过。

## 4. 形成修复 Plan

Plan 必须明确：

```json
{
  "cause": "...",
  "targets": ["stable-symbol-or-id"],
  "invariants": ["behavior to preserve"],
  "operation": "patch|regional-rewrite|controlled-full-rewrite",
  "tests": ["failing oracle", "regressions"],
  "rollback": "..."
}
```

检查：

- target 属于 active implementation；
- plan 修复原因而不是只掩盖最终症状；
- old-value 或 state precondition 仍然成立；
- 没有混淆 generated file 与 source file；
- 不会覆盖用户无关修改。

## 5. 选择交付尺度

优先级：

```text
语义完全确定时使用 deterministic transformation
→ 稀疏局部修复使用 stable-ID Patch
→ 一个完整 region 持有不变量时使用 Regional Rewrite
→ 只有局部保持更困难或更危险时才使用受控 Full Rewrite
```

Patch 是 sparse verified-plan 修复的强默认，不是无条件定律。

下列情况选择更大交付单元：

- 局部结构本身已经无效；
- 不变量跨越 region 大部分内容；
- 大量编辑紧密耦合；
- 生成产物必须从 source 重新生成；
- 兼容状态转移需要 old/new 协同。

Full Rewrite 必须隔离执行，并通过结构化 diff 和完整回归。

## 6. 实现时不扩张范围

实现过程中：

- 编辑前读取精确 target；
- 除非现有抽象导致缺陷，否则保持本地风格和抽象；
- 不混入无关清理；
- 只为非显然约束或 rationale 增加注释；
- 只有修复确实要求时才更新 caller、schema、tests 和 docs；
- 每个有意义 checkpoint 后保持仓库可运行；
- 每次因果修改后重跑失败 oracle。

发现第二个独立缺陷时单独记录，除非它阻塞当前修复验证。

## 7. 分层验证

先运行最窄的有效检查，再逐渐扩大：

```text
syntax/import/static check
→ 原始缺陷回归测试
→ 邻近 unit tests
→ 受影响 integration/contract tests
→ 仓库要求的 suite
→ diff 与 collateral 检查
```

并发、状态、cache 或 retry 缺陷应增加对抗性重复，或使用可用的 deterministic scheduler。
安全或权限缺陷应包含 negative test，证明被禁止行为仍然被拒绝。

不得通过削弱、删除、跳过或过度 mock oracle 来隐藏失败。

## 8. Collateral Audit

检查：

- changed files 与 hunks；
- repair plan 未声明的行为；
- public API、schema、config、persistence 和 error contract；
- dependency 或 lockfile 变化；
- generated outputs；
- 相关性能和资源回归；
- 用户本地修改仍然存在。

每一行修改都应对应修复、verifier 或必要同步。

## 9. 失败路由

| 失败 | 路由 |
|---|---|
| 原始 oracle 仍失败 | 重新检查原因或实现 |
| 新局部测试失败 | 检查不变量和受影响 caller |
| 大范围回归失败 | 减少 collateral 或升级交付尺度 |
| Plan 后状态变化 | 刷新状态并 rebind/replan |
| Tool 无法表达操作 | 使用 deterministic executor 或受控 fallback |
| 修复需要新产品行为 | 转入功能交付 |
| 必须改变兼容性 | 转入迁移 |
| 无法形成足够 verifier | 标记 ungated 并请求决策 |

没有新证据时，不要重复相同修复尝试。

## 10. 完成闸门

```text
[ ] 修复前已冻结失败案例
[ ] 修复针对因果机制
[ ] 用户要求行为已通过
[ ] 相关邻近行为已通过
[ ] 没有通过削弱测试获得成功
[ ] diff 没有未授权清理
[ ] 必要 generated/docs/schema 已同步
[ ] 用户修改仍然保留
[ ] 残余风险和未运行检查已明确
```

实现完成但没有充分验证时，状态是 `implemented/ungated`，不是完整完成。

## 11. 交接

```text
Fixed：
Root cause：
Implementation：
Verification：
Collateral audit：
Files：
Residual risks / unrun checks：
Delivery state：
```

先说修复结果，不要先罗列按时间发生的工具调用。
