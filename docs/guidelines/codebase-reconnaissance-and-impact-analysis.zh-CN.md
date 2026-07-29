# 代码库侦察与影响分析

状态：第一批操作指南

主要模式：只读

配合使用：[任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md)

English：[Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md)

## 1. 结果

代码库侦察要把陌生仓库转化为边界明确的变更模型：

```text
用户请求
→ 权威入口
→ 执行流和数据流
→ 所有权边界
→ 受影响消费者与不变量
→ 最小安全写入面
→ 验证地图
```

结果不是“读了很多文件”，而是一份足以支持诊断、规划、Review 或实现的证据化影响地图。

## 2. 何时使用

下列情况使用：

- 对仓库或子系统不熟悉；
- 请求只描述症状，没有指出负责组件；
- 修改可能跨模块、schema、生成文件或部署边界；
- 同一个概念存在多套实现；
- 工作区已有用户修改；
- 重构、迁移或 Agent 修改可能影响隐藏消费者。

单文件、自包含、已有明显局部 verifier 的任务可以走轻量路径。

侦察阶段默认只读。不要在探索过程中顺手清理代码。

## 3. 建立仓库状态

分析前记录：

```text
仓库根目录
当前分支与 upstream
工作区状态
相关本地指令
构建与测试入口
语言和 package 边界
generated/vendor/cache 目录
当前配置和环境假设
```

行动前完整阅读适用的本地指令。除非明确在范围内，否则保留所有 dirty files。区分：

- 已提交 baseline；
- 用户未提交修改；
- 生成或忽略产物；
- 当前任务产生的修改。

## 4. 搜索策略

从语义锚点搜索到物理文件：

1. 精确 symbol、command、route、schema、error 或配置键；
2. 定义与构造入口；
3. caller 和 consumer；
4. 测试、fixture、示例与文档；
5. 序列化、持久化、API 和 CLI 边界；
6. 平行实现或 legacy 实现；
7. 生成产物和发布表面。

优先使用仓库原生证据：

```text
文件清单
symbol/text 搜索
依赖 manifest
测试发现
确有因果价值时的版本历史
可用的 runtime log 或 schema
```

不要递归阅读全部文件。先读到足以确认合同和控制流，再只沿相关依赖边继续。

## 5. 建立四张地图

### 5.1 所有权地图

```text
用户可见行为
→ entry point
→ orchestrator/runtime
→ domain implementation
→ persistence/external side effect
```

确认以下职责分别属于哪一层：

- 意图解释；
- 验证；
- 状态；
- 物理寻址；
- 执行；
- commit 与 rollback。

### 5.2 数据与状态地图

对每个重要对象记录：

```text
生产者
schema/type
权威存储
转换过程
消费者
version/hash/revision
生命周期与 cache 行为
```

重点检查重复状态、陈旧快照、隐式默认、信息损失转换，以及被误当成权威状态的派生数据。

### 5.3 依赖与影响地图

按表面分类：

| 表面 | 问题 |
|---|---|
| 直接实现 | 哪些文件和 symbol 实现用户要求的行为？ |
| Caller | 谁调用它们，在什么配置下调用？ |
| 数据 | 哪些 schema、fixture、cache 或 migration 依赖它们？ |
| 接口 | 哪些 API、CLI、tool、Prompt 或序列化合同会变化？ |
| 测试 | 哪些测试证明行为，哪些行为没有覆盖？ |
| 运维 | 哪些部署、权限、发布或回滚路径受影响？ |
| 文档 | 哪些说明或示例会因此失真？ |

### 5.4 验证地图

把每项主张映射到 verifier：

```text
syntax/import → compiler 或 import check
局部行为 → focused unit test
跨模块行为 → integration test
schema 兼容 → contract/migration test
用户流程 → end-to-end 或渲染检查
性能主张 → 有 baseline 的 benchmark
Agent 主张 → 冻结评测集与事件 telemetry
```

缺少 verifier 是一项影响发现，不等于可以默认安全。

## 6. 找到权威实现

多条路径都看似合理时，根据以下证据裁决：

- 实际 caller 与 runtime registration；
- package export 与 dependency injection；
- 当前启用配置；
- 当前测试和 fixture；
- 生产或 CLI entry point；
- 当前 migration 状态；
- 仓库本地指令。

文件名、注释和表面完整度都弱于真实执行控制流。

明确标记 dead、legacy、shadow、experimental 和 generated 路径。不要修补一个看似合理但
实际上未激活的实现。

## 7. 限定写入面

推荐能够闭合用户要求行为的最小范围：

```text
必要实现
+ 必要测试
+ 必要 schema/docs/generated 同步
- 无关清理
- 推测性架构改变
```

对文件分类：

| 类型 | 含义 |
|---|---|
| Must change | 满足请求必须修改 |
| May change | 取决于实现选择 |
| Must inspect | 验证合同必须检查 |
| Must preserve | 用户修改、公开行为或受保护产物 |
| Out of scope | 相关但不必要 |

如果局部修改无法保持不变量，就把任务升级到功能、重构或迁移路径，不要伪装成 Bug Fix。

## 8. 常见影响分析失败

| 失败 | 预防 |
|---|---|
| 修改第一个搜索命中的文件 | 先确认 runtime ownership 与 caller |
| 把文档当成当前实现 | 追踪可执行路径 |
| 忽略 dirty worktree | 记录状态并保留无关修改 |
| 只读定义不读消费者 | 检查 caller、consumer 和 tests |
| 假设 schema-local 修改只影响局部 | 追踪序列化与 migration 边界 |
| 跨 revision 使用行号/index 身份 | 使用 semantic symbol 和 stable ID |
| 扩张为全仓清理 | 维持 must/may/out-of-scope 集合 |
| 没有测试失败就宣称无影响 | 评估 verifier coverage |

## 9. 完成闸门

满足以下条件才算完成侦察：

```text
[ ] 已确认 active entry point
[ ] 已确认权威实现
[ ] 已追踪重要数据与状态对象
[ ] 已列出直接和下游消费者
[ ] 已明确不变量和兼容边界
[ ] 已区分用户修改与任务修改
[ ] 已提出最小安全写入面
[ ] 每个目标结果都有 verifier
[ ] 已公开会改变设计的未知项
```

## 10. 交接产物

使用以下紧凑格式：

```text
Repository state：
Active entry points：
Ownership and data flow：
Must-change files：
Must-inspect / must-preserve files：
Affected contracts and consumers：
Verifier map：
Residual unknowns：
Recommended next guide：
```

不要只交接文件列表；必须解释每个文件为什么重要。
