# 《Agent 工程为什么必须重视受控实验》五轮审校记录

## Five-pass review record for “Why Agent Engineering Must Take Controlled Experiments Seriously”

审校对象：

- `why-agent-engineering-needs-controlled-experiments.zh-CN.md`
- `why-agent-engineering-needs-controlled-experiments.md`
- `assets/agent-engineering-controlled-experiments-bilingual.docx`

Review date: 2026-08-12

## 第一轮：来源、事实与证据边界 / Pass 1: sources, facts, and evidence boundaries

发现并纠正：

- 逐项核对 13 项论文、预印本和一线工程材料的标题、年份与链接；将 arXiv:2607.03691 的旧题名纠正为最新题名 *Don't Blame the Large Language Model: How Agent Harness Evolution Shapes Coding Agent Quality*。
- 将同行评议论文、2026 年预印本和 practitioner report 分层陈述，避免把近期前沿方向写成已经定稿的学界共识。
- 对 35 个 Harness 版本、432 次受控运行、CAFE 的 RAG 演示范围等结论补上样本与外部有效性边界。

Corrections: verified the 13-source bibliography; corrected the current title of arXiv:2607.03691; separated peer-reviewed findings, recent preprints, and practitioner reports; and made sample and external-validity limits explicit.

## 第二轮：论证与因果语言 / Pass 2: argument and causal language

发现并纠正：

- 把“端到端分数提高”与“机制效应已经识别”明确分开。
- 将六类失配从既定普遍定律收敛为可证伪的候选结构失效方式，并加入证据与主张边界。
- 补充受控实验定义：除随机 A/B 外，还包括成对确定性探针、分块离线试验和因子机制研究。
- 统一效应量公式的参数，并限定只有在处理组仅在声明操纵上不同、终点无 treatment-dependent bias 时才使用因果语言。

Corrections: distinguished product comparison from mechanism identification; framed the six mismatches as falsifiable candidate structures; broadened the controlled-experiment definition beyond online A/B tests; and tightened the conditions for causal claims.

## 第三轮：实验设计与统计合同 / Pass 3: experimental and statistical contracts

发现并纠正：

- 为每类失配补齐 Question、Design、Measurements、Falsifier、Diagnostic boundary 和 Transfer test，避免不同失配之间诊断重叠。
- 加入成对任务种子、隔离环境、固定预算、负对照、Oracle candidate、机制中介检查和版本化合同。
- 加入分块与全因子/部分因子设计、多次随机试验、层级或混合效应模型、多重比较校正、功效/精度分析和预先声明的序贯停止规则。
- 将可迁移主张拆成结构不变量、条件机制预测和数值校准，避免要求跨模型百分点评分完全相同。

Corrections: completed the six experimental contracts, added controls and mediator checks, strengthened replication and hierarchical inference, and separated structural transfer from model-specific numerical calibration.

## 第四轮：中英文一致性与仓库挂载 / Pass 4: bilingual parity and repository mounting

发现并纠正：

- 对齐中英文的章节结构、六类实验顺序、反证条件、研究路线与 13 项参考文献。
- 修复互链和相关框架链接，并将中英文稿与 Word 合订版挂载到 README、论文索引及 Agent Hardness Framework 页面。
- 保持两种语言的证据边界一致，避免英文或中文单方面扩大主张。

Corrections: aligned the bilingual topology, experiment order, falsifiers, roadmap, and bibliography; repaired cross-links; mounted the work in repository indexes; and kept claim boundaries equivalent across languages.

## 第五轮：Word 排版、可访问性与最终验收 / Pass 5: Word layout, accessibility, and final acceptance

发现并纠正：

- 将中英文全文生成 40 页双语 Word 合订版，并用 Microsoft Word 导出 PDF，在 144 DPI 下逐页检查全部 40 页。
- 修复重复页眉、摘要孤行、参考文献分页和代码块两端对齐造成的异常字距。
- 为两幅失配图添加替代文本；可访问性审计结果为 0 项 high、0 项 medium、0 项 low。
- 验证 5 张表的 `tblW`、`tblGrid` 和逐单元格宽度完全一致；图片均为页内图，页面为 Letter 纵向、四边 1 英寸页边距。

Corrections: visually inspected every page of the 40-page bilingual edition; fixed header, orphan, reference, and code-block layout defects; added figure alt text; obtained a clean accessibility audit; and verified exact table geometry.

## 最终结论 / Final disposition

五轮审校后，文章的核心主张被限定为一个可证伪的研究纲领，而不是已经成立的普遍定律：训练可以解决固定实例并移动失配边界；受控实验用于识别边界上的条件、机制、交互、成本与失效方式。

After five passes, the thesis is deliberately bounded as a falsifiable research program rather than a settled universal law: training may solve fixed instances and move mismatch boundaries; controlled experiments identify the conditions, mechanisms, interactions, costs, and failure modes at those boundaries.
