# 故障诊断与根因定位

状态：第一批操作指南

主要模式：只读

配合使用：[代码库侦察与影响分析](./codebase-reconnaissance-and-impact-analysis.zh-CN.md)

English：[Failure Diagnosis and Root-Cause Localization](./failure-diagnosis-and-root-cause-localization.md)

## 1. 结果与授权

诊断需要产出：

```text
可复现症状
→ 已定位失败层
→ 因果解释
→ 能区分竞争假设的证据
→ 边界明确的修复选项
```

除非用户同时要求修复，否则诊断默认只读。在不修改权威状态的前提下，可以复现、读取日志、
运行测试、profile 或执行隔离探针。不要把诊断静默变成实现战役。

## 2. 精确定义症状

把模糊标签替换为可观察差异：

```text
预期状态或行为
实际状态或行为
输入和环境
最早已知失败边界
频率与确定性
时间/version 窗口
用户可见影响
```

例如：

- 不写“API 坏了”，而写“合法请求在 optional list 为空时，于 domain validation 之前返回
  500”；
- 不写“Agent 不擅长 patch”，而写“plan 指向正确 semantic target，但 relocation 后
  tool arguments 仍使用陈旧物理 index”。

区分：

- 症状；
- 近端失败；
- 根因；
- 促成条件；
- 后果。

## 3. 建立复现

优先构造仍能保留失败的最小复现：

```text
相同输入
相同相关状态
相同配置
相同代码/模型/tool 版本
相同预算与 timeout
相同外部依赖行为
```

标记复现状态：

| 状态 | 含义 |
|---|---|
| Deterministic | 每次受控运行都失败 |
| Intermittent | 以可测频率失败 |
| Historical | 当前未复现，但日志或产物支持 |
| Environment-specific | 依赖特定 runtime 或外部依赖 |
| Not reproduced | 证据不足以形成因果主张 |

记录失败案例之前，不要先通过修改环境把症状“稳定掉”。

## 4. 定位失败层

寻找预期状态和实际状态最早开始分叉的层：

| 层 | 典型证据 |
|---|---|
| Observation | 输入缺失、陈旧、截断或错误 |
| Representation | 相关状态存在，但编码或外部化方式不合适 |
| Specification | 被优化的代理目标偏离用户结果 |
| Planning | target、value、dependency 或 non-goal 错误 |
| Compilation | 正确 plan 被编译成错误物理操作 |
| Tool/interface | 参数非法、合同歧义、地址陈旧 |
| Executor/environment | 权限、IO、依赖、事务、race |
| Verification | false accept、false reject、coverage 不足 |
| Commit/replay | partial apply、重复副作用、stale write |
| Budget/transport | timeout、截断、retry、provider failure |

定位最早的因果分叉，不要只定位最后一条报错。

## 5. 建立竞争假设

对每个合理假设记录：

```json
{
  "hypothesis": "...",
  "mechanism": "...",
  "predicted_observation": "...",
  "disconfirming_observation": "...",
  "probe": "...",
  "result": "supported|weakened|not_tested"
}
```

优先选择区分力高、写入风险低的探针：

- 在同一边界比较正常运行和失败运行；
- 固定输入，只改变一项配置；
- 检查 pre/post hash；
- 用可信 oracle 绕过某一层；
- 对 deterministic executor 重放已捕获 payload；
- 在隔离分支或测试 harness 中增加临时 telemetry；
- 最小化失败 fixture。

不要让一个探针同时改变多个因果变量。

## 6. 按因果强度使用证据

通常证据强度递增：

```text
看代码后觉得合理
< 日志相关模式
< 受控复现
< 差分探针
< 能消除并恢复失败的干预
< 因果边界上的 property 或 invariant violation
```

Code inspection 可以发现代码缺陷，但当执行依赖配置、并发、数据或外部系统时，runtime
主张仍需要 runtime 证据。

模型生成的解释、注释和事后 rationale 都只能作为假设，不能直接作为因果证据。

## 7. 诊断状态与时间

许多故障本质上是版本不一致：

```text
evidence version ≠ candidate version
plan state ≠ execution state
cache state ≠ authority state
test fixture ≠ production schema
client contract ≠ server contract
```

记录 hash、revision、timestamp、config、模型/tool 版本和 retry attempts。不得把一个状态
上计算出的 syndrome 应用到另一个状态。

对间歇性故障，优先检查顺序、race window、幂等性、cache invalidation、资源限制和共享
可变状态，而不是直接归因于随机性。

## 8. 停止条件

下列情况停止并报告不确定性：

- 无法复现症状，且现有产物不足；
- 缺少区分竞争假设所需证据；
- 下一步唯一探针是未获授权的破坏性或外部操作；
- 多个原因在观测上仍然等价；
- 怀疑问题位于范围外仓库或系统；
- 需要用户做价值、政策或责任决策。

使用“最可能”时，必须说明其他解释为什么较弱，以及仍缺少什么证据。

## 9. 诊断完成闸门

```text
[ ] 症状已写成 expected vs observed
[ ] 已明确复现状态
[ ] 已记录权威状态/version
[ ] 已定位最早分叉层
[ ] 已考虑竞争假设
[ ] 证据能够区分原因与后果
[ ] 置信度与证据强度匹配
[ ] 修复选项边界明确
[ ] 没有执行未经授权的修复
```

## 10. 诊断报告

先给结论：

```text
Root cause：
Failure layer：
Evidence：
Reproduction：
Why competing explanations are weaker：
Impact boundary：
Remediation options：
Residual uncertainty：
```

如果尚未建立根因，应明确写“未建立”，并报告当前最强定位。精确的部分诊断优于虚构根因。
