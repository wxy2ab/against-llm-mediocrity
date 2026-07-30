---
key: guidelines
lang: zh
path: /zh/guidelines
title: Agent 任务操作指南
navTitle: 指南
kicker: 按授权、状态、证据与完成边界路由 Coding Agent 任务
summary: 面向 Codex 等编码 Agent 的可视化指南入口。先判断任务类型，再选择最小充分指南组合，并显式守住授权、verifier 与交付边界。
order: 7.5
heroPoints:
  - 从任务接入与分类开始，不要把所有请求都默认转换成实现任务。
  - 每次选择一份主指南，只叠加真正改变工作流的附加指南。
  - 现有 Markdown Guidelines 继续作为权威、可直接用于提示词的规范源。
---

这套 Guidelines 把项目关于聚合失配与受治理 Agent 的研究结论，转成可重复执行的操作规范。
它们不是绑定某个模型的 Prompt 技巧。每份指南都会明确 Agent 可以修改什么、哪一份状态具有
权威性、必须收集什么证据、由哪个 verifier 裁决完成，以及任务应当在什么条件下停止或升级。

:::takeaway
### 最短安全路径

先读场景路由，判断请求类型，选择一份主指南，再只叠加会改变授权、状态转移、验证或交付方式的
附加指南。`docs/guidelines/` 下的现有文档继续作为权威、可直接放入提示词的版本。
:::

## 从这里开始

::::cards
### 场景、提示词与证据路由

当你需要判断应该把哪份 Guidelines 交给 Codex 时，先读这一份。它把任务信号映射到主指南、
必要附加指南、理论依据、实验依据，以及当前证据不支持的主张。

[打开中文路由](/docs/guidelines/guidelines.zh-CN.md)

### Guidelines 目录索引

需要快速查看目录、加载合同、组合示例、共同交接格式和后续扩展时，使用这份紧凑索引。

[打开中文索引](/docs/guidelines/README.zh-CN.md)

### Agent 五旋钮基础规范

修改 Agent 架构，或者检查工作流是否外部化权威状态、semantic plan、candidate、verifier 与
commit 时，使用这份共同基础。

[打开五旋钮基础规范](/docs/guidelines/agent-five-knob-operating-guidelines.zh-CN.md)
::::

## 选择一份主指南

::::cards
### 判断请求类型并选择工作流

**适用场景：** 请求刚进入、包含多类任务、边界不清，或者可能从只读分析跨入写入操作。

**默认授权：** 在写入边界建立之前保持只读。

[任务接入与指南路由](/docs/guidelines/task-intake-and-guideline-routing.zh-CN.md)

### 理解陌生代码库

**适用场景：** 尚不清楚代码所有权、入口、依赖、影响半径或哪份实现才是权威来源。

**默认授权：** 只读。

[代码库侦察与影响分析](/docs/guidelines/codebase-reconnaissance-and-impact-analysis.zh-CN.md)

### 解释为什么失败

**适用场景：** 用户要求诊断、因果定位或基于证据的解释，但没有授权实现修复。

**默认授权：** 未明确要求实现时保持只读。

[故障诊断与根因定位](/docs/guidelines/failure-diagnosis-and-root-cause-localization.zh-CN.md)

### 修复边界明确的缺陷

**适用场景：** 缺陷可以复现、预期行为明确，并且局部 Patch 可以由相关 oracle 验证。

**默认授权：** 有范围的写入。

[局部修复与 Bug Fix](/docs/guidelines/bounded-repair-and-bug-fix.zh-CN.md)

### 交付功能、重构或迁移

**适用场景：** 新增行为、改变结构，或者迁移 schema、API、存储模型与兼容边界。

**默认授权：** 有计划的多文件写入，并显式定义上线与验证方式。

[功能、重构与迁移交付](/docs/guidelines/feature-refactor-and-migration-delivery.zh-CN.md)

### 改进另一个 Agent

**适用场景：** 修改 Agent 的 Prompt、工具、状态模型、planner、router、verifier、recovery
路径或 commit 协议。

**默认授权：** 先冻结 baseline，再按失败层修改，并通过评测门。

[Agent 诊断与改进](/docs/guidelines/agent-diagnosis-and-improvement.zh-CN.md)
::::

## 共同操作合同

::::cards
### 行动之前先确定授权

区分解释、诊断、Review、实现、发布和外部副作用。指南可以收紧授权，不能扩大用户没有给出的
授权。

### 生成之前先确定权威状态

明确由哪个仓库、运行时、schema、trace、测试或外部系统裁决事实。不能让会话记忆静默替代
可检查状态。

### 宣布完成之前先确定 Verifier

修改前先命名 oracle。看似合理的 diff、无关测试通过或漂亮总结，都不能证明用户要求的结果
已经实现。

### 受治理提交与交接

只提交经过验证的状态转移。交接时报告结果、范围、证据、残余风险和产物；只有确实还有动作时，
才给出下一步。
::::

## 组合指南，而不是一次加载全部文档

| 请求模式 | 推荐指南组合 |
|---|---|
| “解释这个测试为什么偶发失败。” | 路由 + 代码库侦察 + 故障诊断 |
| “修复这个可稳定复现的解析器错误。” | 路由 + 代码库侦察 + 局部修复 |
| “增加一个需要鉴权的新 API。” | 路由 + 代码库侦察 + 功能/重构/迁移 |
| “把持久化 schema 从 v2 升到 v3。” | 路由 + 代码库侦察 + 功能/重构/迁移 |
| “只 Review 这个 PR，不要修改。” | 路由 + 代码库侦察 + 只读诊断 |
| “改进一个经常提交过期 index 的 Agent。” | 路由 + 代码库侦察 + Agent 改进 + 对应实现指南 |

关键规则是最小充分组合：一份主指南，再加真正改变执行或裁决方式的附加指南。

## 可直接使用的加载合同

```text
完整阅读 docs/guidelines/guidelines.zh-CN.md。
使用“任务接入与指南路由”判断当前请求类型。
选择一份主任务指南，只叠加必要附加指南。
行动前明确授权边界、权威来源、写入范围、verifier 和停止条件。
按照所选指南执行到 completion gate。
必要 verifier 未通过时不得宣称完成。
```

目标是改进另一个 Agent 时，再加入：

```text
完整阅读“Agent 诊断与改进”。
先冻结 baseline，定位最早因果失败层，不得默认只改 Prompt。
```

## 当前覆盖与后续扩展

当前指南已经覆盖任务接入、代码库侦察、故障诊断、局部修复、功能/重构/迁移交付与 Agent 改进。
后续计划覆盖测试与完成裁决、只读 Review、实验与数据分析、文档同步、Git 与发布、外部副作用、
事故恢复、多 Agent 协作，以及性能、成本和可靠性优化。

所有完整规范仍保留在 [Guidelines 目录](/docs/guidelines/README.zh-CN.md) 中。这个站内页负责导航
与阅读，不替代那些可执行文档。
