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

这页不是按论文顺序排的，而是按读者最常碰到的概念来组织。你可以把它当成一张术语地图：先看一句话定义，再看完整解释、出处链路和相关术语。

如果你是从别的页面点进来的，通常直接跳到对应词条就够了；如果你想先把整体轮廓搭起来，可以按下面四组读：

- [对齐区制](#alignment-regimes)
- [六类失配](#primitive-mismatches)
- [治理对象](#governance-objects)
- [工程与协作](#engineering-and-collaboration)

## 对齐区制

<a id="alignment-regimes"></a>

<a id="llm-mediocrity"></a>
### LLM 平庸

**一句话定义**：LLM 给出的答案在某些时候未必是高价值高质量的，可能是很平庸的答复，而非你期望的答案。

**完整解释**：LLM 平庸不是说模型没用，而是说在这类任务里，继续采样、润色、补充细节，通常只能让答案更顺、更完整、更像那么回事，却碰不到真正决定成败的结构。问题不在于模型完全不会，而在于默认生成路径被高概率、常见、局部可改进的模式牵引，而真实价值取决于隐藏状态、全局关系、稀缺结构、真实规格或外部验证。

**为什么重要**：这个术语把一种常见但说不清的体验钉住了：“答案越来越像样，但还是不对。” 一旦识别出自己处在 LLM 平庸区，下一步就不该只是继续改 prompt，而要开始重写任务形态。

**出处链路**：

- 首次完整主文：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前结构主文：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 站点侧综述：[机制](../framework)

**相关术语**：[局部对齐](#local-alignment) · [LLM 卓越](#llm-excellence) · [六类原始失配](#six-primitive-mismatches)

<a id="local-alignment"></a>
### 局部对齐

**一句话定义**：对于一个复杂问题，LLM 擅长处理其中的一部分，但是另外一部分给出的答案是平庸且无价值的。

**完整解释**：局部对齐是最常见的现实区间。模型往往能做好压缩、改写、列举、比较、提纲生成、格式转换、局部修补等操作，这些能力真实有用；但全局成功还取决于那些局部续写无法自动保住的变量，比如真实目标、长程依赖、隐藏状态、外部证据和责任边界。局部对齐解释了为什么 LLM 既显得很好用，又经常在关键点上掉链子。

**为什么重要**：它让判断不再停在“能不能用 AI”这种过粗的问题上。真正关键的是：哪些环节已经局部对齐，可以直接交给模型；哪些环节还得靠控制对象、验证器、人类变量或硬状态托住。

**出处链路**：

- 首次完整主文：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前结构主文：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 站点侧综述：[首页](../) · [机制](../framework)

**相关术语**：[LLM 平庸](#llm-mediocrity) · [LLM 卓越](#llm-excellence) · [知识治理](#knowledge-governance)

<a id="llm-excellence"></a>
### LLM 卓越

**一句话定义**：模型擅长处理此类问题，给出的答案往往就是你期待和需要的。

**完整解释**：在 LLM 卓越区，模型不需要被强行拉离默认生成轨道，因为默认轨道就已经靠近高价值结果。上下文压缩、语义扩写、结构化改写、格式迁移、语体转换、常见查询构造等任务常落在这一区。这里的重点不是“模型更强”，而是“任务结构、表征方式和成功标准与模型能力已经同向”。

**为什么重要**：它提醒我们别把所有任务都治理得过重。已经落在 LLM 卓越区的任务，往往可以直接生成，只做轻量验证就够了。

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

**为什么重要**：如果没有这层分类，很多失败最后都会被混成一句“模型还不够强”。有了这层分类，搜索、验证、状态治理、目标治理、通道修复和组合治理才会各自有清楚分工。

**出处链路**：

- 结构推导：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 分类总览：[六类原始失配总览](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)
- 机制桥接：[诊断-机制桥接](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/diagnostic-mechanism-bridge-for-governed-llm-systems.zh-CN.md)

**相关术语**：[聚合失配](#aggregation-mismatch) · [支持失配](#support-mismatch) · [状态失配](#state-mismatch) · [规格失配](#specification-mismatch) · [拟合边界失配](#fitting-boundary-mismatch) · [观测-表征失配](#observation-representation-mismatch)

<a id="aggregation-mismatch"></a>
### 聚合失配

**一句话定义**：部署局部代理、有限搜索或不可逆提交不能稳定恢复全局补全价值。

**完整解释**：当部署过程使用的局部得分或解码规则偏离“选择该局部决策后可达到的最佳全局补全价值”，并且早期提交缩小未来可达集合时，就发生聚合失配。故事会失去承诺—回收链，代码会破坏跨模块约束，方案会失去真正的主导取舍。自回归链式分解可以精确编码全局依赖，对失配既非必要也非充分；“自回归平庸”不再作为该机制的名称。任务的非局部耦合度只是压力剂量；严重度应由部署代理相对全局补全价值的排序错误或后悔衡量。

**为什么重要**：它提醒我们，问题不在“某一段写得差”，而在“全局关系没有被表示和治理”。这类问题通常不是靠更细的润色来修，而是要上依赖图、全局不变量、组合验证和结构化控制对象。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[聚合失配与组合治理](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/aggregation-mismatch-compositional-governance-llm-systems.zh-CN.md)
- 站点综述：[机制](../framework)

**相关术语**：[六类原始失配](#six-primitive-mismatches) · [LLM 平庸](#llm-mediocrity)

<a id="support-mismatch"></a>
### 支持失配

**一句话定义**：高价值结构位于低概率、低支持或当前搜索预算不可达的区域。

**完整解释**：支持失配不是说答案不存在，而是说默认采样几乎到不了那里。系统可能偶尔“认得出”正确结构，却几乎不会主动生成它。高价值答案可能依赖低显著性证据、罕见框架、非直觉候选或中间结构搜索，而这些都不在默认续写的舒适区里。当前模型与解码器的概率质量经验性地回落到常见、流畅但低价值区域时，可非正式称为“自回归引力”；这不是自回归架构的结构定理。

**为什么重要**：一旦识别出是支持失配，方向就会从“继续让模型写”转向“怎样把尾部结构拉进上下文或控制空间”。常见做法包括检索、扰动、反例、重组、候选扩展和结构化搜索。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[支持失配与控制空间搜索](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/support-mismatch-control-space-search-llm-systems.zh-CN.md)
- 分类总览：[六类原始失配总览](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)

**相关术语**：[六类原始失配](#six-primitive-mismatches) · [知识治理](#knowledge-governance)

<a id="state-mismatch"></a>
### 状态失配

**一句话定义**：在固定可访问表征下，系统形成或更新的状态信念偏离证据支持的信念，并改变行动排序。

**完整解释**：用户情绪、市场区间、部署环境、法律辖区、权限边界与时间窗口都可能改变最优策略。但这些状态难以直接知道，并不自动构成失配。状态失配发生在信念组件对同一证据错误折叠假设、误排概率、遗漏或遗忘证据、沿用过期状态，进而选错行动时。若系统正确维护一个仍然宽的后验，并采取信念条件下的最优、保守或分支策略，就不存在状态失配。后验弥散与状态间排序翻转只表示任务歧义度；严重度应按系统相对信念最优基准的决策后悔衡量。

**为什么重要**：它把修复目标定位到信念形成、更新、记忆、条件策略与状态权威。若改善必须依赖新增测量、工具反馈或更丰富表征，则上游诊断应是观测-表征失配，而不是状态失配。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[状态失配与状态治理](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-mismatch-state-governance-llm-systems.zh-CN.md)
- 运行时主文：[状态治理智能体范式（SGAR）](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)

**相关术语**：[SGAR](#sgar) · [六类原始失配](#six-primitive-mismatches)

<a id="specification-mismatch"></a>
### 规格失配

**一句话定义**：系统能优化的代理目标偏离了任务真正的成功目标。

**完整解释**：规格失配发生在“系统成功地完成了错的目标”时。输出也许满足了提示、评分规约、风格要求或表面标准，但没有满足真实价值函数。用户想要的是可执行、可验证、可授权、可承担后果的结果，而系统优化的却只是“看起来专业”或“通过某个 rubric”。

**为什么重要**：它逼着我们把真实目标外化出来，而不是把希望压在模型自己“应该懂”上。反例、验收标准、利益相关者排序、拒绝样例和目标治理，都从这里长出来。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[规格失配与目标治理](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/specification-mismatch-objective-governance-llm-systems.zh-CN.md)
- 分类总览：[六类原始失配总览](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/six-primitive-mismatches-pipeline-derived-taxonomy-llm-systems.zh-CN.md)

**相关术语**：[知识治理](#knowledge-governance) · [审计工程](#audit-engineering)

<a id="fitting-boundary-mismatch"></a>
### 拟合边界失配

**一句话定义**：模型已学能力的触发边界，与它真正适用的边界不一致。

**完整解释**：拟合边界失配既包括过触发，也包括欠触发。模型可能在明确要求时会做一件事，但该做时不会主动激活；也可能把一个局部模板、角色脚本、证据链或反馈信号误当成普遍规则，在相邻场景里继续套用。问题不在知识缺失，而在能力路由和适用域判断。

**为什么重要**：它把很多“模型怎么突然又不行了”的问题，重新解释成边界治理问题。修复通常不是继续喂知识，而是做触发条件审计、邻域扰动测试和能力适用性验证。

**出处链路**：

- 理论背景：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 专题主文：[拟合边界失配与能力路由](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch-capability-routing-llm-systems.zh-CN.md)
- 早期专题：[拟合边界失配专题](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/fitting-boundary-mismatch.zh-CN.md)

**相关术语**：[六类原始失配](#six-primitive-mismatches) · [知识治理](#knowledge-governance)

<a id="observation-representation-mismatch"></a>
### 观测-表征失配

**一句话定义**：可行干预本可取得或保留的决策信息，没有进入模型可操作表征。

**完整解释**：模型可以很聪明地推理它看到的东西，但如果可行通道本可提供的关键变量在进入表示之前就被丢掉、压缩、混叠或遮蔽了，那么再长的推理链也只是围绕错误坐标工作。日志缺失、可接入的传感器或工具未接入、原始信号被摘要覆盖，都是实例。若任何可行测量与表征都无法消除不确定性，剩余差距是任务的不可约信息限制，不记作系统失配。

**为什么重要**：它把很多“推理还不够深”的误判，改正成“先修通道”的问题。补测量、读原始证据、接工具、查环境、改善表示，往往比继续推理更关键。

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

**为什么重要**：这是把局部对齐转成长期工程收益的关键动作。没有知识治理，系统只能一次次“重新想”；有了知识治理，系统才有机会积累那些已经在真实任务里证明有效的判断。

**出处链路**：

- 首次完整主文：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前结构主文：[价值保存结构理论](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/structural-theory-value-preservation-llm-systems.zh-CN.md)
- 实现规范：[受治理 LLM 对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)

**相关术语**：[GKO](#gko) · [GExO](#gexo) · [GEsO](#geo) · [审计工程](#audit-engineering)

<a id="gko"></a>
### 受治理知识对象（GKO）

**一句话定义**：保存任务特定控制知识的最小治理单元。

**完整解释**：GKO 不是普通笔记，也不是一段提示词。它存的是已经被验证、可以被调用、需要携带条件与生命周期的信息，例如某个主张何时成立、优先级如何排序、冲突时怎么裁决、什么情况下撤销。GKO 的意义在于把“知道什么”变成一个可以编排和审计的对象。

**为什么重要**：它让系统能从受治理知识出发，而不是每次都让模型在自然语言里重新发明一遍规则。GKO 也是知识治理落到对象模型时最核心的载体。

**出处链路**：

- 理论起点：[Knowledge Governance for Large Language Model Systems](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/knowledge-governance-llm-systems-local-alignment.zh-CN.md)
- 当前规范主文：[受治理 LLM 对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)
- 站点综述：[治理](../engineering)

**相关术语**：[知识治理](#knowledge-governance) · [GExO](#gexo) · [GEsO](#geo) · [MSHQ](#mshq)

<a id="gexo"></a>
### 受治理执行对象（GExO）

**一句话定义**：保存任务、计划、行动、交接或工作流项执行约束的治理对象。

**完整解释**：GExO 承载的是执行侧权威。它定义这个执行单元要完成什么、输入输出是什么、什么算成功或失败、谁可以行动、哪些动作被允许或禁止，以及提交进展前必须满足哪些 GKO、验证器或转移契约。它是 GKO 在执行层的对应物。

**为什么重要**：它让执行不再只是聊天里的一段叙述。长程任务可以被显式追踪、治理和审计，而不是作为松散计划悬在上下文里。

**出处链路**：

- 当前规范主文：[受治理 LLM 对象模型与接口规范](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-llm-object-model-interface-specification.zh-CN.md)
- 站点综述：[治理](../engineering)

**相关术语**：[GKO](#gko) · [GEsO](#geo) · [SGAR](#sgar)

<a id="geso"></a>
<a id="geo"></a>
### 受治理升级对象（GEsO）

**一句话定义**：保存“什么时候该问人、问什么、问谁、等待期间还能做什么”的升级协议对象。

**完整解释**：GEsO 负责治理“问”这个动作本身。它不是临时起意的提问，而是把触发条件、最小问题、默认值、人类角色、风险等级、等待期间的自治工作、撤销条件等一起对象化。这样，系统就不会在遇到不确定性时不是盲冲，就是把整个任务甩回给人。

**为什么重要**：它把人类接入从一次性打断，变成可复用、可审计、可演进的协议。对长程 agent 来说，GEsO 是恢复自治的工具，不是放弃自治的借口。

**出处链路**：

- 协作起点：[治理式人机协作](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)
- 技术补充：[人类协助型操作失配](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)
- 站点综述：[协作](../collaboration)

**相关术语**：[MSHQ](#mshq) · [GKO](#gko) · [GExO](#gexo) · [SGAR](#sgar)

<a id="mshq"></a>
### 最小充分人类问题（MSHQ）

**一句话定义**：在一次具体交互里，只为恢复自治推进而向人提出的最小问题。

**完整解释**：MSHQ 是 GEsO 的一次实例化。好的 MSHQ 不会问“我现在该怎么办”，而会精准隔离那个仍由人治理、且一旦得到答案就能解除阻塞的变量。它通常给出少量选项、解释不同答案会改变什么、说明默认路径，并避免把整个任务重新丢回给人。

**为什么重要**：它把“人机协作”从一大段低效对话，压缩成对关键变量的最小干预。人类只补 AI 不能可靠提供的那一小部分，AI 则在答案回来后继续自治推进。

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

**为什么重要**：如果没有审计工程，失败最后只会变成下一轮 prompt 的情绪记忆；有了审计工程，失败才会变成可写回、可复放、可验证的控制增量。

**出处链路**：

- 早期工程稿：[Audit Engineering](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering.zh-CN.md)
- 当前技术主文：[面向受治理 LLM 系统的审计工程](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/audit-engineering-failure-localization-control-space-writeback.zh-CN.md)
- 引擎路由补充：[Oracle、Audit Agent 与 SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)

**相关术语**：[知识治理](#knowledge-governance) · [SGAR](#sgar) · [规格失配](#specification-mismatch)

<a id="sgar"></a>
### 状态治理智能体范式（SGAR）

**一句话定义**：从全局权威状态生成最小充分的局部求解面，通过公共协议组合阶段，并只把经过验证的公共增量提交为长程进展。

**完整解释**：SGAR 的核心判断是：上下文不是状态，同时每次 LLM 求解都必须在全局条件与局部规模之间取得平衡。系统把目标、约束、依赖、既有决策和验收事实保存在外部硬状态中，只向当前问题渲染最小充分投影；阶段之间交换 contract、evidence、decision 和 residual，而不依赖彼此完整的私有推理与实现轨迹。残差路由决定下一步解决什么，但状态是否推进仍由验证和提交决定。

**为什么重要**：它同时控制状态权威和问题形状。没有 SGAR，复杂 agent 容易面对过大的混合问题，产生脱离全局的局部最优，并把私有假设带入后续阶段；有了 SGAR，局部求解受全局条件约束，跨阶段依赖具有公共语义，完成与否由状态转移和证据决定。

**出处链路**：

- 早期稿：[状态治理智能体范式（SGAR）](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime.zh-CN.md)
- 当前主文：[面向受治理 LLM 系统的状态治理智能体范式](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/state-governed-agent-regime-for-governed-llm-systems.zh-CN.md)
- 引擎路由补充：[Oracle、Audit Agent 与 SGAR](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/oracle-classification-audit-agent-sgar-engine-routing.zh-CN.md)

**相关术语**：[状态失配](#state-mismatch) · [GEsO](#geo) · [审计工程](#audit-engineering)

<a id="governed-human-ai-collaboration"></a>
### 治理式人机协作

**一句话定义**：不围绕任务分工，而围绕控制变量组织 AI 与人的协作。

**完整解释**：治理式人机协作关心的不是“哪些任务给 AI、哪些任务给人”，而是“哪些变量可以由 AI 处理、搜索、验证，哪些变量必须由人来裁决”。AI 应该先问环境、问工具、问验证器，再在确实遇到人类治理变量时，用 MSHQ 和 GEsO 做最小升级。人类不再是默认执行者，而是价值、权限、偏好、品味、责任与边界的治理者。

**为什么重要**：它为“人该在 AI 时代做什么”给出更细的答案。不是把人退回低价值校对工的位置，而是把人上移到那些真正不能被概率生成替代的变量治理位上。

**出处链路**：

- 协作主文：[治理式人机协作](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/governed-human-ai-collaboration.zh-CN.md)
- 技术补充：[人类协助型操作失配](https://github.com/wxy2ab/against-llm-mediocrity/blob/main/docs/human-assist-operational-mismatches.zh-CN.md)
- 站点综述：[协作](../collaboration)

**相关术语**：[GEsO](#geo) · [MSHQ](#mshq) · [SGAR](#sgar)
