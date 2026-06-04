---
key: papers
lang: zh
path: /zh/papers
title: 论文与工作稿
navTitle: 论文
kicker: 把这套框架正式写清楚
summary: 这里收集与自回归平庸、自回归卓越、Knowledge Governance、治理式协作和 AI 时代人类学习相关的论文、工作稿与后续实证方向。
order: 6
heroPoints:
  - 主文：Knowledge Governance for Large Language Model Systems。
  - 补充稿：Human-Assist Operational Mismatches。
  - 扩展稿：治理式协作与 AI 时代的人类学习。
---

## 深水区怎么读

站点正文是公开解释层：先讲直觉，再讲机制，再讲实践。论文与工作稿则是深水区，用来把概念定义、诊断分类、治理对象和后续研究问题写得更完整。

建议阅读顺序：

1. 先读站点的“为什么重要”和“机制”，建立三种对齐区间与四类 mismatch。
2. 再读主文，理解 Knowledge Governance 如何把中间控制知识外化、验证和复用。
3. 然后读协作补充稿，理解 agent 什么时候应该问人，以及如何构造最小充分人类问题。
4. 最后读治理式协作与人类学习稿，理解这套理论在人机协作和教育中的展开。

## 当前工作稿

:::cards
### Knowledge Governance for Large Language Model Systems
Tag: 主文

主文提出三种区间：自回归平庸、局部对齐、自回归卓越；用 aggregation、support、state、specification 四类 primitive mismatch 解释为什么普通输出空间搜索会进入平台期；并提出 Knowledge Governance、Decoupled Control Space 和 GKO。

[阅读主文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

### Human-Assist Operational Mismatches
Tag: 协作补充稿

补充稿不增加新的 primitive mismatch，而是把执行阻塞收紧为五个操作域，定义硬治理与预期损失升级门槛，并展开 MSHQ、GEO、回答验证和自治恢复。

[阅读技术补充稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)

### 治理式人机协作
Tag: 公开实践框架

这份实践框架把论文理论转化为协作方法：AI 先问环境、学反馈、构造试炼场，只有当剩余变量确实由人类治理时，才提出最小充分问题。

[阅读实践框架](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)

### AI 时代的人类学习
Tag: 人类侧能力

这份稿件讨论当 AI 成为默认信息处理核心后，人类学习如何从技能执行转向知识底座、反馈、验证、洞察、价值判断和长期叙事。
:::

## 后续实证方向

- 在相同计算预算下，比较 Knowledge Governance 与强输出空间搜索基线。
- 衡量自动生成的 rubric、边界情况、状态矩阵和 GKO，什么时候与专家判断相关。
- 研究上下文压缩、语义解压、查询构造和结构化转换这些正向对齐任务的 profile。
- 测量 noisy natural scene 与 clean abstract form 之间的 construal gap。
- 比较普通人机问答与 MSHQ/GEO 协作协议在中断次数、回答质量和自治恢复率上的差异。

## 项目定位

这些工作稿目前更像研究框架与开源宣言，而不是已经封闭完成的理论。它们的目标是提出一套可讨论、可实现、可验证的语言：用来描述 LLM 什么时候会平庸，什么时候会卓越，以及人和系统应该怎样把局部能力转化为稳定的任务价值。
