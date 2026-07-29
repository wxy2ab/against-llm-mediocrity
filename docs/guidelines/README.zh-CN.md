# Agent 任务操作指南

本目录存放面向 Codex 等编码 Agent 的可执行操作规范。它们不是绑定某个模型的 Prompt
技巧，而是为每类任务明确：

- 任务授权与写入边界；
- 必须读取的权威状态和证据；
- Agent 可以执行的状态转移；
- verifier 与完成边界；
- 失败路由、回滚和人工升级条件；
- 可审查交接所需的产物。

English index：[README.md](./README.md)

## 1. 共同基础

当前共同基础是：

- [Agent Guidelines 使用与引用路由](./guidelines.md)
- [Agent 五旋钮操作规范](./agent-five-knob-operating-guidelines.zh-CN.md)

它定义权威状态、semantic plan、candidate、verifier、semantic ID、确定性编译、
Patch/Regional/Full 路由、失败层路由、受治理提交、事件账本和成本门。

下面的任务指南不重复这些基础规则，而是把它们特化到具体任务。

## 2. 第一批任务指南

| 主任务 | 中文 | English | 默认授权 |
|---|---|---|---|
| 判断请求类型并选择工作流 | [任务接入与指南路由](./task-intake-and-guideline-routing.zh-CN.md) | [Task Intake and Guideline Routing](./task-intake-and-guideline-routing.md) | 写入范围确定前只读 |
| 理解陌生代码库 | [代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md) | [Codebase Reconnaissance and Impact Analysis](./codebase-reconnaissance-and-impact-analysis.md) | 只读 |
| 解释失败原因 | [故障诊断与根因定位](./failure-diagnosis-and-root-cause-localization.zh-CN.md) | [Failure Diagnosis and Root-Cause Localization](./failure-diagnosis-and-root-cause-localization.md) | 未要求修复时只读 |
| 修复边界明确的缺陷 | [局部修复与 Bug Fix](./bounded-repair-and-bug-fix.zh-CN.md) | [Bounded Repair and Bug Fix](./bounded-repair-and-bug-fix.md) | 有范围写入 |
| 新增行为或改变结构 | [功能、重构与迁移交付](./feature-refactor-and-migration-delivery.zh-CN.md) | [Feature, Refactor, and Migration Delivery](./feature-refactor-and-migration-delivery.md) | 有计划的多文件写入 |
| 改进另一个 Agent | [Agent 诊断与改进](./agent-diagnosis-and-improvement.zh-CN.md) | [Agent Diagnosis and Improvement](./agent-diagnosis-and-improvement.md) | 按失败层修改，必须评测 |

## 3. 路由规则

每次只选择一份主指南，再叠加确实会改变流程的附加指南。

```text
所有任务
  → 任务接入与指南路由

陌生代码库或影响范围不确定
  → + 代码库侦察与影响分析

“为什么失败”，但没有要求实现修复
  → 故障诊断与根因定位

缺陷已知、边界明确、存在可复现 oracle
  → 局部修复与 Bug Fix

新增外部可见行为
  → 功能交付路径

保持行为不变的结构调整
  → 重构路径

schema、存储、API 或分阶段兼容变化
  → 迁移路径

修改 Agent 的 Prompt、工具、状态、路由、verifier 或 recovery
  → Agent 诊断与改进
  → + 对应的实现指南
```

禁止静默地把：

- 解释请求变成写入；
- 诊断请求变成修复；
- Review 请求变成重构；
- 局部 Bug 变成架构重写；
- Agent 症状变成只改 Prompt。

## 4. Codex 加载合同

可以把本目录索引与下面的指令一起交给 Codex：

```text
完整阅读 docs/guidelines/README.zh-CN.md 及其引用的基础规范。
使用“任务接入与指南路由”判断当前请求类型。
选择一份主任务指南，只叠加必要附加指南。
行动前明确授权边界、权威来源、写入范围、verifier 和停止条件。
按照所选指南执行到 completion gate。
必要 verifier 未通过时不得宣称完成。
```

目标是改进另一个 Agent 时，再要求：

```text
完整阅读“Agent 诊断与改进”。
先冻结 baseline，定位最早因果失败层，不得默认只改 Prompt。
```

## 5. 组合示例

| 请求 | 应加载的指南 |
|---|---|
| “解释这个测试为什么偶发失败。” | 路由 + 代码库侦察 + 故障诊断 |
| “修复这个可稳定复现的解析器错误。” | 路由 + 代码库侦察 + 局部修复 |
| “增加一个需要鉴权的新 API。” | 路由 + 代码库侦察 + 功能/重构/迁移 |
| “把持久化 schema 从 v2 升到 v3。” | 路由 + 代码库侦察 + 功能/重构/迁移 |
| “只 Review 这个 PR，不要修改。” | 路由 + 代码库侦察 + 只读诊断 |
| “改进一个经常提交过期 index 的 Agent。” | 路由 + 代码库侦察 + Agent 改进 + 局部修复或迁移 |

## 6. 共同交接合同

所有指南使用同一个简洁交接格式：

```text
结果
检查或修改的范围
证据与 verifier 结果
残余风险与不支持的主张
文件和产物
仍然存在时才给下一步
```

最终回答必须先说结果。没有运行 verifier、verifier 失败，或者 verifier 不覆盖用户目标时，
不得宣称任务完成。

## 7. 后续扩展

下一批建议覆盖：

1. 测试、验证与完成裁决；
2. 只读 Code Review 与审计；
3. 实验、评测与数据分析；
4. 文档、规范与知识同步；
5. Git、PR、发布与分支清理；
6. 外部系统与有副作用操作；
7. 事故响应与状态恢复；
8. 多 Agent 协作与交接；
9. 性能、成本与可靠性优化。
