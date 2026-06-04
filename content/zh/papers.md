---
key: papers
lang: zh
path: /zh/papers
title: 论文与工作稿
navTitle: 论文
kicker: 把这套框架正式写清楚
summary: 这里收集与自回归平庸、自回归卓越、知识治理和治理式协作相关的当前工作稿与后续实证方向。
order: 6
heroPoints:
  - 主文：Knowledge Governance for Large Language Model Systems。
  - 补充稿：Human-Assist Operational Mismatches。
  - 实践与实现：治理式协作及由研究议程直接推导的工具方向。
---

## 深水区怎么读

站点正文是公开解释层：先讲直觉，再讲机制，再讲实践。论文与工作稿则是深水区，用来把概念定义、诊断分类、治理对象和后续研究问题写得更完整。

建议阅读顺序：

1. 先读站点的“为什么重要”和“机制”，建立三种对齐区间与四类原始错配。
2. 再读主文，理解知识治理如何把中间控制知识外化、验证和复用。
3. 然后读协作补充稿，理解能自主推进任务的 AI agent 什么时候应该问人，以及如何构造最小充分人类问题。
4. 最后读站点中的协作和项目页，理解这些手稿如何转化为实践和实现方向。

## 当前工作稿

:::cards
### Knowledge Governance for Large Language Model Systems
Tag: 主文

主文提出三种区间：自回归平庸、局部对齐、自回归卓越；用聚合、支持集、状态、规约四类原始错配解释为什么普通输出空间搜索会进入平台期；并提出知识治理、解耦控制空间和受治理知识对象（GKO）。

[阅读主文](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

### Human-Assist Operational Mismatches
Tag: 协作补充稿

补充稿不增加新的原始错配，而是把执行阻塞收紧为五个操作域，定义硬治理与预期损失升级门槛，并展开最小充分人类问题（MSHQ）、受治理升级对象（GEO）、回答验证和自治恢复。

[阅读技术补充稿](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)

### 治理式人机协作
Tag: 公开实践框架

这份实践框架把论文理论转化为协作方法：AI 先问环境、学反馈、构造试炼场，只有当剩余变量确实由人类治理时，才提出最小充分问题。

[阅读实践框架](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)
::::

## 实现方向

::::cards
### 开源项目
Tag: 实现路线图

项目页只整理当前工作稿已经提出的实现与评估方向：GKO 生命周期、GEO 升级协议和四类原始错配诊断。它不是当前工作稿之外的新理论主张。
:::

## 后续实证方向

- 在相同计算预算下，比较知识治理与强输出空间搜索基线。
- 衡量自动生成的评分规约、边界情况、状态矩阵和 GKO，什么时候与专家判断相关。
- 研究上下文压缩、语义解压、查询构造和结构化转换这些正向对齐任务的画像。
- 测量嘈杂自然场景与干净抽象形式之间的建模缺口。
- 比较普通人机问答与 MSHQ/GEO 协作协议在中断次数、回答质量和自治恢复率上的差异。
- 评估 GKO/GEO 存储是否能提高复用，同时避免过期治理、过度升级或习得性无助。

## 项目定位

这些工作稿目前更像研究框架与开源宣言，而不是已经封闭完成的理论。它们的目标是提出一套可讨论、可实现、可验证的语言：用来描述 LLM 什么时候会平庸，什么时候会卓越，以及人和系统应该怎样把局部能力转化为稳定的任务价值。
