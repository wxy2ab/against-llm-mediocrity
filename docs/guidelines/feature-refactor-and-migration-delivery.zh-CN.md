# 功能、重构与迁移交付

状态：第一批操作指南

主要模式：有计划的多文件写入

配合使用：[代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)

English：[Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md)

## 1. 选择正确交付合同

三类任务可能修改相同文件，但成功条件不同。

| 模式 | 预期变化 | 首要不变量 |
|---|---|---|
| Feature | 新增或改变外部有意义的行为 | 新验收条件成立 |
| Refactor | 改变结构，不准备改变行为 | 行为等价 |
| Migration | 让状态或接口跨版本转移 | 兼容性与可恢复性 |

不要把行为改变描述成重构。旧状态、旧 client 或 rollback 仍然重要时，不要把迁移实现成
一次性完整重写。

## 2. 进入产物

实现前明确：

```text
用户结果与 non-goals
当前架构和权威状态
受影响 actor、interface 和 data
验收条件
受保护不变量
依赖顺序
交付模式
验证矩阵
rollback 或兼容计划
```

工作跨模块、Agent、session、schema 或部署阶段时，必须持久化 plan。

## 3. 功能路径

### 3.1 把请求转成行为

定义：

- actor 与 permission；
- trigger/input；
- expected output 或 state transition；
- negative 和 edge behavior；
- observability；
- failure semantics；
- 与已有行为的兼容性；
- 明确排除的行为。

优先使用示例和可执行验收案例，不使用“健壮”“智能”“无缝”等形容词代替规格。

### 3.2 选择所有权

把职责放在持有不变量的层：

```text
model：解释、提案、不确定语义工作
runtime：状态、顺序、身份、策略、retry
compiler/executor：确定性转换与副作用
verifier：接受边界
event store：审计与恢复证据
```

不要通过增加 Prompt 文本补偿 runtime ownership 问题。

### 3.3 实现垂直切片

优先用一个薄的端到端切片证明合同：

```text
interface/schema
→ domain behavior
→ persistence/tool integration
→ verifier
→ user-facing path
```

再扩展其他变体。避免先建互相断开的层，直到最后才首次可运行。

## 4. 重构路径

### 4.1 冻结可观察行为

确认必须等价的行为：

- public API 与序列化；
- error 与 permission decision；
- 顺序确实属于语义时的 ordering；
- persistence 与 side effects；
- 性能预算属于合同时的 performance；
- extension 与 plugin points。

隐式合同时先建立 characterization tests。

### 4.2 分离结构 Diff 与行为 Diff

确实需要改变行为时，条件允许应分两阶段：

```text
行为保持型重构
→ 验证等价
→ 明确 feature/bug 修改
→ 验证新行为
```

这样失败更容易归因，rollback 更安全。

### 4.3 保持中间状态有效

Big-bang move 会破坏 caller 时，使用 adapter、临时 compatibility layer、stable semantic
ID 和分阶段移动。只有所有消费者迁移完成且 removal verifier 通过后，才移除过渡代码。

## 5. 迁移路径

### 5.1 定义状态机

至少考虑：

```text
old-only
→ dual-read 或 compatibility
→ backfill/transform
→ new-write 或 dual-write
→ verification
→ cutover
→ old-path retirement
```

不是所有迁移都需要全部阶段，但省略必须有理由。

### 5.2 迁移不变量

明确：

- source 与 target schema/version；
- identity mapping；
- transformation semantics；
- idempotency 与 replay；
- partial failure 行为；
- backward/forward compatibility window；
- rollback boundary；
- data-loss 与 duplication checks；
- cutover 与 retirement criteria。

迁移工具必须可恢复，或者明确保证原子性。Timeout 后不能留下未分类中间状态。

### 5.3 Expand-Verify-Contract

优先：

```text
扩展新能力但不破坏旧用户
→ 迁移并验证
→ 切换权威
→ 观察
→ 收缩/删除旧能力
```

能够独立 rollout 时，不要在引入新路径的同一次未验证转换中删除旧路径。

## 6. Plan 与依赖图

把工作表示成带依赖的 semantic operations：

```json
{
  "operation_id": "stable-id",
  "target": "semantic-component",
  "intent": "add|move|adapt|remove",
  "preconditions": ["..."],
  "dependencies": ["..."],
  "acceptance": ["..."],
  "rollback": "..."
}
```

Runtime 或 plan 应持有 readiness。文件顺序不等于依赖顺序。

在下列位置定义 checkpoint：

- 仓库可以构建；
- 旧行为仍然可用；
- 一个 migration phase 完成；
- rollback 仍然简单；
- verifier 可以独立裁决。

## 7. 验证矩阵

| 主张 | 最低证据 |
|---|---|
| Feature 有效 | Positive acceptance case |
| 非法使用被拒绝 | Negative/permission case |
| 已有行为保持 | Regression/compatibility suite |
| Refactor 等价 | Characterization + existing tests |
| Migration 保留数据 | Counts、hashes、invariants、samples、reconciliation |
| Migration 可安全重放 | Idempotency 或 crash/restart test |
| Rollback 有效 | 已测试 rollback 或恢复演练 |
| 性能可接受 | 相对 baseline 的测量 |
| Agent 行为改善 | 冻结 paired evaluation 与 failure-layer telemetry |

只有 schema valid 或 build success 不足以证明语义完成。

## 8. 变更管理

交付过程中：

- 保留无关 dirty changes；
- 通过 generator 同步 generated files；
- 合同或 operator 行为改变时更新文档；
- 不确定或分阶段 adoption 使用 feature flag；
- 记录 deprecation 和 removal criteria；
- 不做推测性清理；
- 区分 public contract 与 internal contract；
- 明确标记不可逆步骤。

大型修改优先拆成多个有意义 commit 或 checkpoint，不形成一个无法审计的大 diff。

## 9. 失败路由

| 失败 | 响应 |
|---|---|
| 验收案例有歧义 | 返回 specification |
| Ownership 不清晰 | 返回侦察/设计 |
| Plan 无法保持不变量 | 改变架构或 migration phase |
| 本地通过但 consumer 失败 | 修复 compatibility boundary |
| Migration reconciliation 失败 | 停止 cutover、保存证据、rollback/reconcile |
| Refactor 意外改变行为 | 拆分或撤销结构阶段 |
| Cost/latency 超预算 | Profile 并进入优化流程 |
| Agent 只在训练案例上改善 | 扩大冻结 holdout，检查 fitting boundary |

不要用 retry 解决 specification 或 architecture failure。

## 10. 完成闸门

### Feature

```text
[ ] acceptance 与 negative cases 通过
[ ] 兼容的已有行为通过
[ ] state、permission、error 与 observability 已定义
[ ] docs/config/generated artifacts 已同步
```

### Refactor

```text
[ ] 受保护行为已被 characterization
[ ] equivalence suite 通过
[ ] 没有意外改变 public contract
[ ] obsolete path removal 已验证
```

### Migration

```text
[ ] migration phases 与 authority transitions 已记录
[ ] reconciliation 通过
[ ] replay/partial failure 已验证
[ ] cutover 与 rollback criteria 通过
[ ] old path 只在 retirement gate 后删除
```

所有模式还必须通过 diff/collateral audit，并公开未运行检查。

## 11. 交接

```text
Mode：
Outcome：
Architecture/ownership decision：
Implementation and migration phases：
Verification matrix and results：
Compatibility/rollback：
Files and checkpoints：
Residual risks：
Delivery state：
```
