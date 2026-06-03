---
key: papers
lang: zh
path: /zh/papers
title: 论文与工作稿
navTitle: 论文
kicker: 把这套框架正式写清楚
summary: 这里会收集与自回归平庸、自回归卓越和 Knowledge Governance 相关的论文、工作稿、研究笔记和实证研究。
order: 6
heroPoints:
  - 初始工作稿：Knowledge Governance for Large Language Model Systems。
  - 补充稿：Human-Assist Operational Mismatches。
  - 未来工作：实证比较、消融实验，以及 GKO 系统的工程实现。
---

## 当前工作论文

初始工作稿的核心观点是：自回归平庸可以通过四类 primitive mismatch 来预测；在实践中，更有效的干预方式，是把困难的最终输出任务转化成错配更低、与价值更一致的子任务。

## 未来的实证方向

- 在相同计算预算下，比对 Knowledge Governance 和强输出空间搜索基线的效果。
- 衡量自动生成的 rubric、边界情况、状态矩阵和 GKO，什么时候会与专家判断相关。
- 研究压缩、语义解压、查询构造和结构化转换这些任务的正向对齐 profile。
