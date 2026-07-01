---
key: projects
lang: zh
path: /zh/projects
title: 开源项目
navTitle: 项目
kicker: 把知识治理原理做成工具
summary: 已发布的第一个项目是 sgar：一个把长程代码编辑、自动化修复、状态治理、阶段推进、审计验证和运行痕迹组合起来的 embedded coding agent。后续项目会继续把知识治理做成可复用的软件对象。
order: 8
heroPoints:
  - sgar：用于长程代码编辑、自动化修复和可治理运维的状态治理型 coding agent。
  - 将审计工程和状态治理 agent 模式落到 CLI、runtime、trace 与验证记录。
  - 后续工具会继续覆盖 GKO lifecycle、升级协议和任务控制工作台。
  - 用于检测输出空间搜索何时进入平台期的基准测试。
---

本页记录这项工作的软件一侧：把论文中关于知识治理的想法，做成可运行、可检查、可撤销的对象。目前已发布一个项目，其余都还是计划中的实现方向。下文出现的 GKO，指受治理知识对象（Governed Knowledge Object / GKO）——一个存储下来的判断单元，可以被检索、弱化或撤销。

## 已发布项目

::::cards
### sgar
Tag: State-Governed Agent Regime

[sgar](https://github.com/wxy2ab/sgar) 是一个 embedded coding agent，用来把自动化修复、自动化运维与长程代码编辑能力嵌入到系统中。它同时提供 standalone CLI、可嵌入的 agent runtime，以及面向 OpenClaw 的长程代码编辑技能。

项目的核心不是“一次调用 LLM 写点代码”，而是把代码编辑、状态治理、阶段推进、审计验证和运行痕迹组合成可长期运行的 agent 模型。它的设计基于 [审计工程](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.zh-CN.md) 与 [状态治理 agent 模式（State-Governed Agent Regime / SGAR）](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.zh-CN.md)。具体来说，就是外部化硬状态、action/delta、trace、验证记录和 `.sgar/` 工作区。这些机制合在一起，能降低长程运行中的漂移、跳步和虚假完成。

当前入口包括 `pip install sgar`、`sgar --help`、`sgar init`、`sgar status`、`sgar doctor`、`sgar trace`，以及 `validate`、`verify`、`mission` 等治理型命令。仓库文档还提供 [架构](https://github.com/wxy2ab/sgar/blob/main/docs/architecture.md)、[使用](https://github.com/wxy2ab/sgar/blob/main/docs/usage.md)、[API](https://github.com/wxy2ab/sgar/blob/main/docs/api.md) 与 [集成](https://github.com/wxy2ab/sgar/blob/main/docs/integration.md) 说明。
::::

## 计划中的项目类型

下面这些是从当前工作稿推导出的后续实现方向，不是额外的理论主张。它们的作用，是测试受治理知识、硬状态转移、升级协议和失配诊断能否变成有用的软件对象。

每一个方向都承接论文提出的同一个实证问题：**如果知识治理不只是一个解释框架，它就必须能落到可保存、可检查、可撤销的软件对象上。**`sgar` 已经先把硬状态、阶段推进、验证和 trace 做成可运行对象。后续项目会延续这个思路，把控制空间、分层路由、连续性审计、pairwise 判断和平台期判断也做成可观察的治理过程。它们都不追求一次性做出"大而全 agent"，而是各自拆出最小可验证组件。

::::cards
### GKO 登记库

面向反复处理同类任务的个人、团队或 agent 系统。输入是从任务中抽取出的判断规则、约束、失败模式、验证证据和撤销条件；输出是可检索、可排序、可弱化、可撤销的受治理知识对象。

核心对象包括适用条件、主张、证据强度、优先级、生命周期、冲突处理、依赖关系和撤销规则。成功标准不是"记得更多"，而是后续任务能更少重复踩坑，同时不过度泛化旧经验。

### 升级工作台

面向需要自主推进但不能越权行动的 agent 工作流。输入是当前任务状态、阻塞变量、风险等级和可逆工作；输出是最小充分人类问题（MSHQ）或受治理升级对象（GEO）。

核心对象包括触发条件、问题模板、选项、安全默认值、人类角色、等待期间可继续的自治工作、回答验证和撤销触发器。成功标准是减少无效打断，同时保留授权、隐私、财务、法律、声誉和部署等硬边界。

### 硬状态 Agent Ledger

面向需要中断恢复并避免虚假完成的长程 agent。输入是当前状态、可执行行动、观测、验证结果、人类回答、审计发现和回滚事件；输出是被提交或拒绝的状态转移。

核心字段包括状态 id、前置条件、行动、观测、验证器、转移规则、提交记录、回滚规则、来源和被撤销假设。成功标准是降低状态漂移、减少无证据完成声明，并提升跨 session 或多 agent 的可复盘性。

### 失配诊断

面向需要选择推理策略的开发者和高价值知识工作。输入是任务描述、候选输出、失败记录、可用工具和验证条件；输出是失配画像：聚合、支持、状态、规格、拟合边界和观测-表征哪类占主导，以及应该直接生成、构造控制空间、检索证据、补测量、运行验证还是升级给人。

核心对象包括诊断问题、失配证据、推荐干预、验证计划和回滚条件。成功标准是更早发现输出空间搜索的平台期，并把"再来一版"替换成更具体的下一步动作。
::::

## 评估问题

- 工具是否减少了高失配任务上的重复输出空间采样？
- 存储的 GKO 是否改善后续输出，同时避免过期或过度泛化？
- GEO 是否减少了不必要中断，同时保留硬治理边界？
- 用户是否能看清系统为什么问人、调用工具或撤销规则？
- 失配诊断是否能稳定预测哪类干预最有效，而不是只在事后解释失败？
