---
key: case-study-stock-rec-v3
lang: zh
path: /zh/case-study-stock-rec-v3
title: 案例：Stock Rec V3
navTitle: Stock Rec V3
kicker: 金融策略系统中的状态失配与生产者治理
summary: Stock Rec V3 是一个日频股票策略系统案例。它的核心不是让 LLM 直接判断股票，而是把因子、基本分、兴奋度和持仓处理拆成可治理的生产者；任何新内容都必须先经过 shadow、promotion 和 active 生命周期，才能影响最终策略。
order: 2.6
showInNav: false
heroPoints:
  - 金融策略是典型状态失配任务：市场状态、数据覆盖、持仓状态和验证窗口变化都会改变正确动作。
  - 系统的关键原则是绝不直接相信 LLM 分析；LLM 只能提供候选、提示、解释或旁路观察。
  - 真正进入生产的内容必须经过 nightly cycle、shadow 观察、champion-challenger 晋升和 active 激活。
---

## 为什么这个案例值得研究

这个案例值得研究。当前案例库已经有 [Story Insight V4](/zh/case-study-v4) 和 [Story Insight V6](/zh/case-study-v6)，它们很好地解释了叙事任务中的控制空间、分层治理、连续性审计和平台期判断。但它们仍然都在创作系统里。

`stock_rec_v3` 的价值不在于它是“另一个更复杂的系统”，而在于它提供了一个不同领域的高失配样本：日频金融策略。金融系统天然会暴露 LLM 的状态失配问题。市场状态会变，数据覆盖会变，因子有效性会变，持仓成本和盈亏状态会变，上一交易日的治理动作还会影响下一交易日。此时让 LLM 直接给出“买什么、卖什么、为什么”是危险的，因为它最容易生成的是听起来合理的市场叙事，而不是可验证、可追溯、可回滚的策略状态。

因此，这个案例的核心句应该是：

**不要相信 LLM 的金融判断；只允许它参与受治理的生产过程。**

## 任务为什么高失配

股票推荐表面上很适合 LLM：它可以读新闻、解释题材、总结市场情绪，也能写出很像研究员的段落。但这些局部能力并不能直接变成可靠策略。

::::cards
### 状态失配

同一套信号在牛市、熊市和震荡市下含义不同。持仓中的股票、成本、已实现 PnL、条件动作和上一日 governance carryover，也会改变今天的动作。

### 规格失配

“解释得合理”不是目标函数。真正的目标涉及 IC、spread、top-N 表现、样本外验证、交易成本、回撤、行业集中度和持仓动作后果。

### 聚合失配

一个因子、一个规则或一段叙事局部成立，不代表最终推荐组合成立。base score、excitation、risk penalty、holding action 和 PnL 必须一起被治理。

### 支持失配

有价值的策略改动往往不是默认金融话术。它可能是一个低覆盖但需要观察的 shadow 因子、一个跨状态表现更稳的规则组合，或一个不该立即上线的旁路增强。
::::

这就是 `stock_rec_v3` 很适合作为案例的原因：它没有把 LLM 包装成“会炒股的模型”，而是把 LLM 放在一个不信任它的生产系统里。

## 核心结构：四个生产者

`stock_rec_v3` 的主体不是单个 prompt，也不是一次性推荐结果，而是四类持续迭代的生产者。

::::cards
### 因子生产者

负责发现、测试和维护原子因子。LLM 可以参与因子诊断和因子定义提案，但提案必须通过安全检查、字段白名单、覆盖率、IC 和相关性门控，才能进入 shadow。

### 基本分生产者

负责演进 base score spec：因子组、组权重、因子启用状态和市场状态下的权重配置。它通过 control-space 搜索和 champion-challenger 回放决定候选是否优于当前 champion。

### 兴奋度生产者

负责演进 excitation 规则：题材、资金流、动量、风险和叙事相关 atom 如何组合。LLM 的 rule hints 和 wildcard hints 只生成候选，不直接激活规则。

### 持仓处理生产者

负责把推荐转成持仓动作：position ledger、holding analysis、PnL、validation feedback、holding governance 和 carryover。它处理的是“当前该怎么做”，而不是重新相信一段市场叙事。
::::

这四个生产者共同构成策略主体。系统每天不是让 LLM 重新写一份观点，而是在 nightly cycle 中让生产者产出新的可检查对象，再由治理链路决定这些对象是否有资格进入生产。

## 生命周期：从候选到 active

`stock_rec_v3` 的关键机制是生命周期，而不是生成能力。

<div class="process-flow" aria-label="Stock Rec V3 producer lifecycle">
  <section class="process-phase">
    <span>产生</span>
    <ol>
      <li>LLM hints</li>
      <li>control-space search</li>
      <li>factor graph proposal</li>
      <li>producer emit</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>隔离</span>
    <ol>
      <li>candidate</li>
      <li>shadow</li>
      <li>observation-only</li>
      <li>audit artifact</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>评估</span>
    <ol>
      <li>coverage gate</li>
      <li>IC / spread</li>
      <li>train / val split</li>
      <li>champion-challenger</li>
    </ol>
  </section>
  <section class="process-phase">
    <span>生产</span>
    <ol>
      <li>promote</li>
      <li>apply mode</li>
      <li>active spec</li>
      <li>Phase B consumption</li>
    </ol>
  </section>
</div>

这个链路有一个非常重要的含义：**LLM 产出的内容默认没有生产权。**

因子可以被提案，但不能直接成为 active 因子。兴奋度规则可以被提示，但不能直接改写最终 `effective_excitement`。时空增强可以输出 sidecar，但默认不能替换主评分。持仓治理可以延续前日动作，但必须通过 carryover profile 和持仓侧规则表达。只有 active spec 才能影响 Phase B 的生产评分。

## Nightly Cycle 不是批处理，而是治理循环

日频策略系统每天都会经历新的市场状态和新的反馈，因此 nightly cycle 是治理循环，不只是 ETL。

它大致可以分成四段：

::::cards
### 数据与状态

交易日发现、tushare 数据采集、股票池、行情因子、市场状态、叙事主题和 future returns 准备。这里的目标是把“今天是什么状态”先落成可计算对象。

### 生产者产出

FactorCalculator 生成横截面因子矩阵；LLM 只在因子诊断、叙事归并、规则提示等局部环节提供候选或上下文；shadow 因子每日更新 IC 轨迹。

### 治理评估

base_score 和 excitation 进入 champion-challenger 评估。候选必须通过覆盖率、样本量、train/val、IC、spread 和稳定性门控，不能靠解释好听晋升。

### 生产消费

Phase B 只加载 active spec。推荐结果再进入持仓闭环，形成 position ledger、holding analysis、PnL、validation feedback、holding governance 和 execution report。
::::

这条链路的价值在于把“今天模型觉得什么有道理”改写成“今天哪些对象经过验证后可以影响策略”。这正是金融系统区别于普通文本任务的地方。

## LLM 在系统里的正确位置

`stock_rec_v3` 并不是不用 LLM。相反，它有很多 LLM 入口：叙事归并、新闻假设、因子诊断、因子提案、规则提示、通配变异、治理解释和报表叙事。

但所有这些入口都被降级为低权力角色：

- LLM 可以提出因子，但不能跳过 `FactorTestEngine`。
- LLM 可以解释 champion-challenger 决策，但不能替代 promotion gate。
- LLM 可以生成 rule hints，但候选必须被 replay 和门控。
- LLM 可以写报表叙事，但报表叙事不反向覆盖 active spec。
- LLM 不可用、输出坏 JSON 或调用异常时，系统会 fallback，不阻断 nightly cycle。

这正好体现了对抗 LLM 平庸的工程原则：不要禁止模型生成，而是限制生成物的权力。

## Active 才能影响策略

`stock_rec_v3` 的设计不变量里有一个核心约束：治理是 active spec 参数的唯一所有者。任何新增机制都不能绕过治理，直接覆盖 active spec、base score 权重、excitation 规则或持仓动作。

这个约束使系统具有可归因性：

::::cards
### 知道谁在生效

Phase B 消费的是 active base spec 和 active excitation spec。没有 active spec 时，系统回退到默认或 registry 构建结果，而不是偷偷消费某个未验证候选。

### 知道为什么生效

晋升必须留下 champion-challenger 评估、门控结果、blocker、metadata 和治理解释。推荐变化可以追溯到具体 spec，而不是追溯到一段 prompt。

### 知道何时不生效

dry run 不移动 active pointer；observation-only 增强只记录观察；默认关能力在未开启时必须保持旧路径数值等价。

### 知道如何回退

当候选不通过或保存失败时，系统保留原 champion 或回滚 shadow 状态。生产链路不会因为某次 LLM 提案看起来合理就被永久污染。
::::

这也是金融案例最能补足本站论证的地方：在创作系统里，错误可能表现为故事不好；在金融系统里，错误会变成真实仓位、交易成本和风险暴露。因此治理权必须比生成权更重要。

## 映射回五类失配

`stock_rec_v3` 可以把本站框架里的五类失配解释得更具体。

::::cards
### 聚合失配

单个因子 IC 好、单条规则命中、单段叙事合理，都不等于组合策略好。系统用非线性 final score、行业集中度、PnL、validation 和 holding governance 来治理聚合。

### 支持失配

真正有用的新信号可能不在默认 active 集合里。系统允许 LLM 和 control-space search 提出低支持候选，但先放入 shadow、sidecar 或 observation-only，而不是直接上线。

### 状态失配

市场 regime、交易日、数据覆盖、持仓成本、前日条件动作、carryover profile 都是状态。系统通过 nightly artifact、ledger、governance carryover 和 report summary 保存状态。

### 规格失配

LLM 的自然语言解释不是策略规格。系统把规格落到 coverage、IC、spread、train/val、交易成本、回撤、PnL veto 和 promotion gate 上。

### 拟合边界失配

局部合理的 alpha 叙事、过滤器、benchmark 结果或审计路径，都可能绑定得太死并挤掉相邻机制。shadow 状态、promotion gate、train/val 和 PnL veto 要求局部断言先通过相邻市场、指标和部署检查，才能获得生产权。
::::

## 与 Story Insight 案例的关系

V4 和 V6 说明了高失配任务为什么需要控制空间和分层治理。`stock_rec_v3` 则说明同一思想进入金融生产系统后，会变成更严格的生命周期治理。

三者可以这样读：

1. **V4**：先把最终生成问题改写成控制空间问题。
2. **V6**：控制空间存在以后，还要判断问题属于哪一层，并能识别平台期与版本退化。
3. **Stock Rec V3**：当任务进入金融生产，LLM 只能生成候选；只有经过 shadow、promotion 和 active 的对象才有生产权。

如果说 V4 的关键词是控制空间，V6 的关键词是分层路由，那么 Stock Rec V3 的关键词就是：

**生产权治理。**

## 案例结论

`stock_rec_v3` 值得作为案例研究，而且应该作为当前案例库的第三类样本：金融策略系统。

它的价值不在于展示“LLM 能不能做股票分析”，而在于展示一个更成熟的判断：在高状态失配、高错误成本的任务里，LLM 分析默认不可信。系统真正需要的是生产者、生命周期、门控、回放、持仓反馈和 active 指针治理。

这也让本站的论证更完整。对抗 LLM 平庸不是把所有任务都变成多轮 prompt，而是把生成能力关进正确的工程边界里。对于金融策略，正确边界就是：LLM 可以参与发现，但不能拥有生产权。
