# 《Agent 不是更长的 Chat》五轮审校记录

## Five-pass review record for “An Agent Is Not a Longer Chat”

审校对象 / Reviewed artifacts:

- `agent-is-not-a-longer-chat.zh-CN.md`
- `agent-is-not-a-longer-chat.md`
- `README.md` and `README.zh.md`
- `content/en/papers.md` and `content/zh/papers.md`

审校目标 / Audience test:

> 让普通 Agent 产品与工程从业者无需预先接受某套理论，也能理解文章的适用边界、识别真正的架构风险，并拿到可以从小规模开始实施的方案。

Review date: 2026-08-16

## 第一轮：读者、范围与定义 / Pass 1: audience, scope, and definitions

发现并纠正：

- 明确文章按运行时控制关系而非产品名称区分 Chat、Bot 与 Agent，避免陷入名词归属争论。
- 把“人类退出循环”限定为“不再逐步决定每个动作”，保留审批、风险接受、需求冲突与不可验证问题的人工检查点。
- 在开头定义“权威”是把候选提交为任务事实的权限，而不是一般影响力。
- 增加目标读者、一句话版本与风险比例原则，让普通从业者先获得判断框架，再进入形式化论证。

Corrections: defined the terms by runtime control rather than product labels; narrowed “human out of the loop” to the absence of step-by-step control; defined authority as commit power; and added an audience note, one-sentence thesis, and risk-proportional scope.

## 第二轮：概念、逻辑与绝对化主张 / Pass 2: concepts, logic, and overclaiming

发现并纠正：

- 将“LLM 不能成为 first-class object”修正为“LLM 可以是一等能力对象，但不能仅凭自身声明成为唯一的最高任务权威”。
- 将“Memory 是错误中心抽象”修正为“Memory 解决存取问题，但不足以替代状态、权限、证据和产物治理”。
- 明确外部运行时提供的是规则与提交语义的确定性，不是内容真理；观察可能不完整，验证器也可能出错。
- 区分可逆工作区写入与权威状态提交，避免把“模型不能直接写权威事实”误读为“模型不能执行任何副作用”。
- 修正公式渲染：将原稿的普通方括号改为 GitHub Markdown 可识别的 `$$` 数学块，并消除验证函数与验证结果共用符号的歧义。

Corrections: bounded the first-class-object claim; recast memory as necessary but insufficient; separated rule certainty from truth; distinguished reversible side effects from authoritative commitment; and repaired all equations and notation.

## 第三轮：普通从业者的可实施性 / Pass 3: practitioner usability

发现并纠正：

- 明确简单、固定能力 Agent 可以保留固定路线，不需要为了“像 Agent”而引入动态路由。
- 将自我反思定位为有用但不足的浅层检查；把审计独立性定义为输入、目标、证据路径和否决权的操作分离，而不是必须更换模型。
- 将验证与审计写成本文使用的职责划分，而非强制全行业采用的唯一术语。
- 增加七对象最小治理栈：Task Spec、State Record、Action Proposal、Execution Receipt、Evidence、Gate、Commitment。
- 增加代码 Bug 修复的完整状态转移例子，以及“不需要重治理”的反例，防止读者过度设计。

Corrections: allowed fixed routes for simple Agents; made audit separation operational and proportional; treated verification/audit as a responsibility split rather than universal vocabulary; added a seven-object minimum stack, a repair example, and an explicit lightweight-task exception.

## 第四轮：中英文同步与仓库挂载 / Pass 4: bilingual parity and repository mounting

检查并确认：

- 中英文均包含副标题、18 个编号章节和结语，标题拓扑完全一致：1 个 H1、20 个 H2、53 个 H3、16 个 H4。
- 两个版本均包含 8 个数学块、相同的状态转移、四张同结构表格和同顺序的最小治理对象。
- 关键限定——风险比例、人工检查点、低风险写入、固定路由例外、分离式审计和非重治理场景——在两种语言中同时存在。
- 双语稿互链并共同挂载到英文/中文 README、站点论文索引的运行时文档地图和当前工作稿列表。

Checks: matched the complete heading topology, eight equation blocks, tables, examples, and claim boundaries; added reciprocal bilingual links; and mounted both versions in both README files and both site paper indexes.

## 第五轮：格式、链接、构建与最终验收 / Pass 5: format, links, build, and acceptance

检查并确认：

- 使用仓库当前安装的 `marked` 分别解析中英文 Markdown，两个文件均成功生成非空 HTML。
- `git diff --check` 通过，没有尾随空格或补丁空白错误。
- 新增的双语互链、审校记录链接及 README 相对路径全部解析到实际文件。
- `npm run build` 通过：TypeScript 编译、Vite 生产构建和路由 HTML 生成均成功。
- 构建仅保留仓库原有的大 chunk 提示，不影响本次文章、挂载或路由验收。

Checks: parsed both manuscripts with the repository's Markdown parser, passed whitespace validation, resolved every new local link, and completed the full TypeScript/Vite/route build. The existing large-chunk advisory remains non-blocking.

## 最终结论 / Final disposition

五轮审校后，文章保留了原始核心判断：Agent 的关键边界不是“更多模型调用”，而是人类不再逐步维护任务真相之后的权威迁移。同时，它不再把 LLM、Memory、动态路由、独立模型审计或重型状态机写成绝对命题，而是给出了按任务风险逐级加强的架构路线。

After five passes, the article preserves its central thesis—Agent architecture begins with a transfer of task authority, not more model calls—while replacing categorical claims with a risk-proportional design that ordinary practitioners can implement incrementally.
