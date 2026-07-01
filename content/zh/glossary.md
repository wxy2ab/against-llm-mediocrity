---
key: glossary
lang: zh
path: /zh/glossary
title: 术语表
navTitle: 术语表
kicker: 给全站术语一个可跳转、可引用的解释页
summary: 这是一张术语地图：把 Against LLM Mediocrity 反复出现的核心概念集中定义，说明它们为什么重要，并标出各自的来源链路。
order: 99
showInNav: false
---

## 这页怎么用

这页不是按论文顺序写的，而是按读者最常遇到的概念组织。你可以把它当成一个术语地图：先看一句话定义，再看完整解释、出处链路和相关术语。

如果你是在别的页面里点进来的，通常直接跳到对应词条即可；如果你想建立全局图景，建议按下面四组读：

- [对齐区制](#alignment-regimes)
- [六类失配](#primitive-mismatches)
- [治理对象](#governance-objects)
- [工程与协作](#engineering-and-collaboration)

## 对齐区制

<a id="alignment-regimes"></a>

<a id="llm-mediocrity"></a>
### LLM 平庸

**一句话定义**：模型最容易继续生成的方向，与任务真正高价值的方向发生结构性错位。

**完整解释**：LLM 平庸不是说模型没用，而是说在这类任务里，继续采样、润色、补充细节，通常只能让答案更顺、更完整、更像那么回事，却碰不到真正决定成败的结构。问题不在于模型完全不会，而在于默认生成路径被高概率、常见、局部可改进的模式牵引，而真实价值取决于隐藏状态、全局关系、稀缺结构、真实规格或外部验证。

**为什么重要**：这个术语把一种常见但模糊的体验固定下来: “答案越来越好看，但还是不对。” 一旦识别出自己处在 LLM 平庸区，下一步就不该只是继续改 prompt，而要开始重写任务形态。

**出处链路**：

- 首次完整主文：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前结构主文：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 站点侧综述：[机制](../framework)

**相关术语**：[局部对齐](#local-alignment) · [LLM 卓越](#llm-excellence) · [六类原始失配](#six-primitive-mismatches)

<a id="local-alignment"></a>
### 局部对齐

**一句话定义**：模型的局部操作与任务价值的一部分对齐，但这种一致不足以保证整条任务成功。

**完整解释**：局部对齐是最常见的现实区间。模型往往能做好压缩、改写、列举、比较、提纲生成、格式转换、局部修补等操作，这些能力真实有用；但全局成功还取决于那些局部续写无法自动保住的变量，比如真实目标、长程依赖、隐藏状态、外部证据和责任边界。局部对齐解释了为什么 LLM 既显得很好用，又经常在关键点上掉链子。

**为什么重要**：它让判断不再停留在“能不能用 AI”。更关键的问题变成：哪些环节已经局部对齐，可以直接让模型做；哪些环节还需要控制对象、验证器、人类变量或硬状态来托住。

**出处链路**：

- 首次完整主文：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前结构主文：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 站点侧综述：[首页](../) · [机制](../framework)

**相关术语**：[LLM 平庸](#llm-mediocrity) · [LLM 卓越](#llm-excellence) · [知识治理](#knowledge-governance)

<a id="llm-excellence"></a>
### LLM 卓越

**一句话定义**：模型的自然续写方向稳定追踪任务价值，自回归生成本身成为优势。

**完整解释**：在 LLM 卓越区，模型不需要被强行拉离默认生成轨道，因为默认轨道就已经靠近高价值结果。上下文压缩、语义扩写、结构化改写、格式迁移、语体转换、常见查询构造等任务常落在这一区。这里的重点不是“模型更强”，而是“任务结构、表征方式和成功标准与模型能力已经同向”。

**为什么重要**：它提醒我们不要把所有任务都治理得过重。已经落在 LLM 卓越区的任务，往往可以直接生成，只需轻量验证。

**出处链路**：

- 理论背景：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前结构主文：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 站点侧综述：[首页](../) · [为什么重要](../science)

**相关术语**：[LLM 平庸](#llm-mediocrity) · [局部对齐](#local-alignment)

## 六类失配

<a id="primitive-mismatches"></a>

<a id="six-primitive-mismatches"></a>
### 六类原始失配

**一句话定义**：一套从价值保存管线推导出来的诊断分类，用来命名任务价值在哪个结构站点掉出了系统。

**完整解释**：六类原始失配不是给失败现象随意贴标签，而是用来回答一个更严格的问题：为什么普通输出空间搜索会进入平台期。它们分别对应价值保存链上的不同断裂位置，因此也分别指向不同的修复对象。分类学的价值不在命名，而在于它要求每个诊断都导向不同干预，而不是继续用同一种“多来几版”的办法对付所有失败。

**为什么重要**：如果没有这层分类，很多失败都会被混称为“模型还不够强”。有了这层分类，搜索、验证、状态治理、目标治理、通道修复和组合治理才有了清晰分工。

**出处链路**：

- 结构推导：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 分类总览：[六类原始失配总览](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)
- 机制桥接：[诊断-机制桥接](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md)

**相关术语**：[聚合失配](#aggregation-mismatch) · [支持失配](#support-mismatch) · [状态失配](#state-mismatch) · [规格失配](#specification-mismatch) · [拟合边界失配](#fitting-boundary-mismatch) · [观测-表征失配](#observation-representation-mismatch)

<a id="aggregation-mismatch"></a>
### 聚合失配

**一句话定义**：局部看起来好的 parts，不能稳定组合成全局有价值的结果。

**完整解释**：聚合失配是自回归平庸最典型的位置。模型可以把每一段都写得流畅、每个部件都做得像样，但一旦任务价值依赖跨段约束、长程依赖、全局目标或多部件关系，局部质量就不再自动组成整体质量。故事会失去承诺-回收链，代码会破坏跨模块约束，方案会失去真正的主导取舍。

**为什么重要**：它告诉我们，问题不在“某一段写得差”，而在“全局关系没有被表示和治理”。应对它的通常不是更细致的润色，而是依赖图、全局不变量、组合验证和结构化控制对象。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[聚合失配与组合治理](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
- 站点综述：[机制](../framework)

**相关术语**：[六类原始失配](#six-primitive-mismatches) · [LLM 平庸](#llm-mediocrity)

<a id="support-mismatch"></a>
### 支持失配

**一句话定义**：高价值结构位于低概率、低支持或当前搜索预算不可达的区域。

**完整解释**：支持失配不是说答案不存在，而是说默认采样几乎到不了那里。系统可能偶尔“认得出”正确结构，却几乎不会主动生成它。高价值答案可能依赖低显著性证据、罕见框架、非直觉候选或中间结构搜索，而这些都不在默认续写的舒适区里。

**为什么重要**：一旦识别出是支持失配，方向就会从“继续让模型写”转向“怎样把尾部结构拉进上下文或控制空间”。这通常意味着检索、扰动、反例、重组、候选扩展和结构化搜索。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[支持失配与控制空间搜索](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.zh-CN.md)
- 分类总览：[六类原始失配总览](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)

**相关术语**：[六类原始失配](#six-primitive-mismatches) · [知识治理](#knowledge-governance)

<a id="state-mismatch"></a>
### 状态失配

**一句话定义**：正确动作取决于隐藏、变化或未显式说明的状态，而当前表征不足以分辨自己处在哪个状态。

**完整解释**：状态失配发生在“同一个答案在不同情境下价值相反”的地方。用户情绪、市场区间、部署环境、法律辖区、权限边界、时间窗口等，都可能让最优策略翻转。如果当前表示不能区分这些状态，模型就会把需要条件化处理的问题，当成一个单一稳定问题去回答。

**为什么重要**：它提醒我们，修复对象不是更好的一段文字，而是状态判别、状态枚举、条件策略和状态权威。对长程 agent 来说，这也是为什么不能只靠聊天上下文维持状态。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[状态失配与状态治理](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-mismatch-state-governance-llm-systems.zh-CN.md)
- 运行时主文：[状态治理智能体范式（SGAR）](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)

**相关术语**：[SGAR](#sgar) · [六类原始失配](#six-primitive-mismatches)

<a id="specification-mismatch"></a>
### 规格失配

**一句话定义**：系统能优化的代理目标偏离了任务真正的成功目标。

**完整解释**：规格失配发生在“系统成功地完成了错的目标”时。输出也许满足了提示、评分规约、风格要求或表面标准，但没有满足真实价值函数。用户想要的是可执行、可验证、可授权、可承担后果的结果，而系统优化的却只是“看起来专业”或“通过某个 rubric”。

**为什么重要**：它迫使我们把真实目标外化出来，而不是把希望寄托在模型自己“应该懂”。反例、验收标准、利益相关者排序、拒绝样例和目标治理，都来自这里。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[规格失配与目标治理](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/specification-mismatch-objective-governance-llm-systems.zh-CN.md)
- 分类总览：[六类原始失配总览](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)

**相关术语**：[知识治理](#knowledge-governance) · [审计工程](#audit-engineering)

<a id="fitting-boundary-mismatch"></a>
### 拟合边界失配

**一句话定义**：模型已学能力的触发边界，与它真正适用的边界不一致。

**完整解释**：拟合边界失配既包括过触发，也包括欠触发。模型可能在明确要求时会做一件事，但该做时不会主动激活；也可能把一个局部模板、角色脚本、证据链或反馈信号误当成普遍规则，在相邻场景里继续套用。问题不在知识缺失，而在能力路由和适用域判断。

**为什么重要**：它把很多“模型怎么忽然又不行了”的问题，重新解释成边界治理问题。修复通常不是继续喂知识，而是做触发条件审计、邻域扰动测试和能力适用性验证。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[拟合边界失配与能力路由](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md)
- 早期专题：[拟合边界失配专题](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch.zh-CN.md)

**相关术语**：[六类原始失配](#six-primitive-mismatches) · [知识治理](#knowledge-governance)

<a id="observation-representation-mismatch"></a>
### 观测-表征失配

**一句话定义**：真正决定成败的世界变量，没有以任务充分的形式进入模型可操作表征。

**完整解释**：模型可以很聪明地推理它看到的东西，但如果真正关键的变量在进入表示之前就被丢掉、压缩、混叠或遮蔽了，那么再长的推理链也只是围绕错误坐标工作。日志缺失、传感器缺失、工具未接入、原始信号被摘要覆盖、关键变量无法进入上下文，都是观测-表征失配的实例。

**为什么重要**：它把很多“推理还不够深”的误判纠正成“先修通道”的问题。补测量、读原始证据、接工具、查环境、改善表示，往往比继续推理更关键。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[观测-表征失配与通道治理](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch-channel-governance-llm-systems.zh-CN.md)
- 早期专题：[观测-表征失配专题](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/observation-representation-mismatch.zh-CN.md)

**相关术语**：[六类原始失配](#six-primitive-mismatches) · [状态失配](#state-mismatch)

## 治理对象

<a id="governance-objects"></a>

<a id="knowledge-governance"></a>
### 知识治理

**一句话定义**：把任务特定、已验证、可复用的控制知识从生成里分离出来，作为独立对象治理。

**完整解释**：知识治理关心的不是“让模型记住更多东西”，而是把真正影响任务成功的控制知识，从一次性的流畅输出中抽离出来，存成可验证、可撤销、可复用、可冲突处理的对象。这样，下游生成就不必每次都从默认概率重新猜一遍，而能从已经治理过的状态出发。

**为什么重要**：这是把局部对齐转成长期工程收益的关键动作。没有知识治理，系统只能一次次“重新想”；有了知识治理，系统才能积累真实任务里已经证实有效的判断。

**出处链路**：

- 首次完整主文：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前结构主文：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 实现规范：[受治理 LLM 对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)

**相关术语**：[GKO](#gko) · [GExO](#gexo) · [GEsO](#geo) · [审计工程](#audit-engineering)

<a id="gko"></a>
### 受治理知识对象（GKO）

**一句话定义**：保存任务特定控制知识的最小治理单元。

**完整解释**：GKO 不是普通笔记，也不是一段提示词。它存的是已经被验证、可以被调用、需要携带条件与生命周期的信息，例如某个主张何时成立、优先级如何排序、冲突时怎么裁决、什么情况下撤销。GKO 的意义在于把“知道什么”变成一个可以编排和审计的对象。

**为什么重要**：它让系统能从受治理知识出发，而不是每次都让模型在自然语言里重新发明一次规则。GKO 也是知识治理落地到对象模型的核心载体。

**出处链路**：

- 理论起点：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前规范主文：[受治理 LLM 对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)
- 站点综述：[治理](../engineering)

**相关术语**：[知识治理](#knowledge-governance) · [GExO](#gexo) · [GEsO](#geo) · [MSHQ](#mshq)

<a id="gexo"></a>
### 受治理执行对象（GExO）

**一句话定义**：保存任务、计划、行动、交接或工作流项执行约束的治理对象。

**完整解释**：GExO 承载的是执行侧权威。它定义这个执行单元要完成什么、输入输出是什么、什么算成功或失败、谁可以行动、哪些动作被允许或禁止，以及提交进展前必须满足哪些 GKO、验证器或转移契约。它是 GKO 在执行层的对应物。

**为什么重要**：它让执行不再只是聊天里的叙述。长程任务可以被显式追踪、治理和审计，而不是作为松散计划悬在上下文中。

**出处链路**：

- 当前规范主文：[受治理 LLM 对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)
- 站点综述：[治理](../engineering)

**相关术语**：[GKO](#gko) · [GEsO](#geo) · [SGAR](#sgar)

<a id="geso"></a>
<a id="geo"></a>
### 受治理升级对象（GEsO）

**一句话定义**：保存“什么时候该问人、问什么、问谁、等待期间还能做什么”的升级协议对象。

**完整解释**：GEsO 负责治理“问”这个动作本身。它不是临时起意的提问，而是把触发条件、最小问题、默认值、人类角色、风险等级、等待期间的自治工作、撤销条件等一起对象化。这样，系统就不会在遇到不确定性时不是盲冲，就是把整个任务甩回给人。

**为什么重要**：它让人类接入从一次性打断，变成可复用、可审计、可演进的协议。对长程 agent 来说，GEsO 是恢复自治而不是放弃自治的工具。

**出处链路**：

- 协作起点：[治理式人机协作](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)
- 技术补充：[人类协助型操作失配](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)
- 站点综述：[协作](../collaboration)

**相关术语**：[MSHQ](#mshq) · [GKO](#gko) · [GExO](#gexo) · [SGAR](#sgar)

<a id="mshq"></a>
### 最小充分人类问题（MSHQ）

**一句话定义**：在一次具体交互里，只为恢复自治推进而向人提出的最小问题。

**完整解释**：MSHQ 是 GEsO 的一次实例化。好的 MSHQ 不会问“我现在该怎么办”，而会精准隔离那个仍由人治理、且一旦得到答案就能解除阻塞的变量。它通常给出少量选项、解释不同答案会改变什么、说明默认路径，并避免把整个任务重新丢回给人。

**为什么重要**：它把“人机协作”从大段低效对话，压缩成对关键变量的最小干预。人类只补 AI 不能可靠提供的部分，AI 则在回答回来后继续自治推进。

**出处链路**：

- 协作起点：[治理式人机协作](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)
- 技术补充：[人类协助型操作失配](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)
- 站点综述：[协作](../collaboration)

**相关术语**：[GEsO](#geo) · [SGAR](#sgar) · [治理式人机协作](#governed-human-ai-collaboration)

## 工程与协作

<a id="engineering-and-collaboration"></a>

<a id="audit-engineering"></a>
### 审计工程

**一句话定义**：把审计当成独立工程层，用来定位失败、选择修复路由，并把结果写回控制对象。

**完整解释**：审计工程不把 audit 理解为结果出来后的“打分”。它把失败定位、反例构造、证据沉淀、修复路由、控制增量和回归验证当成一套独立系统。生成器负责产出候选，审计负责回答“为什么失败、该改哪里、怎样防止复发”。这使得系统能从每次失败中积累可执行的修复，而不是只留下语言评论。

**为什么重要**：如果没有审计工程，失败只会变成下一轮 prompt 的情绪记忆；有了审计工程，失败会变成可写回、可复放、可验证的控制增量。

**出处链路**：

- 早期工程稿：[Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.zh-CN.md)
- 当前技术主文：[面向受治理 LLM 系统的审计工程](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)
- 引擎路由补充：[Oracle、Audit Agent 与 SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)

**相关术语**：[知识治理](#knowledge-governance) · [SGAR](#sgar) · [规格失配](#specification-mismatch)

<a id="sgar"></a>
### 状态治理智能体范式（SGAR）

**一句话定义**：把长程 agent 的计划、行动、验证、升级和审计发现，组织成受治理的硬状态转移。

**完整解释**：SGAR 的核心判断是：上下文不是状态。只把任务进展留在聊天记录里，意味着计划、工具调用、验证结果、人类回答和回滚条件都缺少权威载体。SGAR 把这些对象提交到外部硬状态层，让 agent 在被承认、可验证、可恢复的状态上推进，而不是在一段自我叙事里“觉得自己完成了”。

**为什么重要**：它为长程 agent 提供了运行时治理基础。没有 SGAR，很多复杂 agent 失败最终都表现成漂移、跳步、假完成和无法恢复；有了 SGAR，完成与否要由状态转移和证据决定。

**出处链路**：

- 早期稿：[状态治理智能体范式（SGAR）](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.zh-CN.md)
- 当前主文：[面向受治理 LLM 系统的状态治理智能体范式](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- 引擎路由补充：[Oracle、Audit Agent 与 SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)

**相关术语**：[状态失配](#state-mismatch) · [GEsO](#geo) · [审计工程](#audit-engineering)

<a id="governed-human-ai-collaboration"></a>
### 治理式人机协作

**一句话定义**：不围绕任务分工，而围绕控制变量组织 AI 与人的协作。

**完整解释**：治理式人机协作关心的不是“哪些任务给 AI、哪些任务给人”，而是“哪些变量可以由 AI 处理、搜索、验证，哪些变量必须由人来裁决”。AI 应该先问环境、问工具、问验证器，再在确实遇到人类治理变量时，用 MSHQ 和 GEsO 做最小升级。人类不再是默认执行者，而是价值、权限、偏好、品味、责任与边界的治理者。

**为什么重要**：它为“人该在 AI 时代做什么”给出更精细的答案。不是把人退回到低价值校对工，而是把人上移到真正不能被概率生成替代的变量治理位置。

**出处链路**：

- 协作主文：[治理式人机协作](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)
- 技术补充：[人类协助型操作失配](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)
- 站点综述：[协作](../collaboration)

**相关术语**：[GEsO](#geo) · [MSHQ](#mshq) · [SGAR](#sgar)
