# Against LLM Mediocrity

Against LLM Mediocrity 致力于对抗 LLM 的自回归平庸，提升边缘性能。

## 核心想法

LLM 往往很早就能生成流畅答案，但要晚得多才会真正生成高价值答案。这个项目的核心判断是：许多困难任务中的失败，并不只是 prompt 失败，而是因为任务真实的价值函数，并没有和模型的局部续写倾向很好对齐。

这个项目主要关注三件事：

- 保留任务中那些已经与自回归生成局部对齐的部分；
- 把对齐较差的部分外化成显式控制对象、约束、rubric、状态表示或验证循环；
- 当模型无法可靠继续时，引入硬边界、硬反馈和最小人类接入点。

目标不是否定自回归，而是把那些原本会停留在“流畅但平庸”状态的任务，转化成自回归真正有用、甚至能够表现卓越的任务。

## 论文

- [Governed Control Inference: Escaping Autoregressive Mediocrity via Validated Latent Control Knowledge]()

## 文档

### 知识治理

- 主工作稿：[English](docs/knowledge-governance-llm-systems-local-alignment.md) · [中文](docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

### 治理式人机协作

- 人类协助型操作失配、MSHQ 与 GEO：[English](docs/human-assist-operational-mismatches.md) · [中文](docs/human-assist-operational-mismatches.zh-CN.md)
- 治理式协作实践框架：[English](docs/governed-human-ai-collaboration.md) · [中文](docs/governed-human-ai-collaboration.zh-CN.md)

技术补充稿定义 agent 什么时候应该升级、如何恢复自治；实践框架则说明 AI 应如何先向环境取证、构造选项与试炼场，并只向人询问真正由人类治理的变量。

## 站点

- https://wxy2ab.github.io/against-llm-mediocrity/

## 对抗 LLM 自回归平庸的项目

- **Story Insight**：故事生成是一个带有聚合失配的自回归平庸任务。Story Insight 通过构造控制空间并在其中搜索，显著提升故事生成质量。结合 MiniMax 一类模型，它可以写出整体质量明显超过 GPT-5.5 的故事。
- **Social Insight**：真实社交对话是一个多目标协调任务，也很容易落入聚合失配。Social Insight 通过控制空间方法提升多目标协调能力，从而实现更高水平的社交沟通。
- **Stock Rec**：金融任务是典型的状态失配场景。Stock Rec 通过持续的搜索与验证，让 LLM 系统更好地应对金融市场的非平稳特性。

## 基础设施项目

- **deepstack**：一个 agent runtime scaffold，提供 context 组装、递归调用等 agent runtime 基础能力。

## 作者

- Xinyun Wang: [GitHub](https://github.com/wxy2ab)
- Shuliang Liu: [GitHub](https://github.com/MichaelLyo)

## 本地开发

```bash
npm install
npm run dev
```

构建静态站点：

```bash
npm run build
```

## 发布

仓库通过 `.github/workflows/pages.yml` 部署到 GitHub Pages。推送到 `main` 后，会构建 Vite 站点并发布生成出的 `dist` 目录。
