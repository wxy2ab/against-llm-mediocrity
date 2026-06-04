---
key: projects
lang: zh
path: /zh/projects
title: 开源项目
navTitle: 项目
kicker: 把 GKO 原理做成工具
summary: 未来的项目会把 Knowledge Governance 做成可复用的工具：GKO 存储、验证循环、升级协议、任务控制工作台，以及面向具体领域的治理模板。
order: 7
heroPoints:
  - GKO 生命周期工具：创建、验证、排序、弱化、撤销。
  - 基于“最小充分人类问题”的人类升级协议。
  - 用于检测输出空间搜索何时进入平台期的 benchmark。
---

## 计划中的项目类型

这些是从当前工作稿推导出的实现方向，不是额外理论主张。它们用于测试受治理知识、升级协议和 mismatch diagnostics 能否变成有用的软件对象。

::::cards
### GKO Registry

用于存放治理知识对象的本地或服务端存储，包含适用条件、主张、证据强度、优先级、生命周期、冲突处理和撤销规则。

### Escalation Workbench

把执行过程中的阻塞转化成最小充分人类问题，并包含选项、安全默认值、人类角色、等待期间可继续的自治工作和撤销触发器。

### Mismatch Diagnostics

在选择推理策略之前，先按 aggregation、support、state 和 specification 四类 mismatch 对任务进行诊断，再决定直接生成、构造控制空间、验证、检索或升级给人。
::::

## 评估问题

- 工具是否减少了高错配任务上的重复输出空间采样？
- 存储的 GKO 是否改善后续输出，同时避免过期或过度泛化？
- GEO 是否减少了不必要中断，同时保留硬治理边界？
- 用户是否能看清系统为什么问人、调用工具或撤销规则？
