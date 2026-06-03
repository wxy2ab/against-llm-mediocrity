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

- 仓库内工作稿（英文）： [docs/knowledge-governance-llm-systems-local-alignment.md](docs/knowledge-governance-llm-systems-local-alignment.md)
- 仓库内工作稿（中文）： [docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md](docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)

## 站点

- https://wxy2ab.github.io/against-llm-mediocrity/

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
