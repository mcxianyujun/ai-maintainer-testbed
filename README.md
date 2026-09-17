# AI Maintainer Testbed

这是 GitHub AI Maintainer 的专用集成测试仓库，使用纯 Node.js ESM 和 Node.js 内置测试运行器。

运行测试：

```sh
npm test
```

## API

模块 `src/calculator.js` 导出的函数：

### 计算器

- `add(a, b)` —— 返回 `a + b`。
- `subtract(a, b)` —— 返回 `a - b`。
- `multiply(a, b)` —— 返回 `a * b`。
- `divide(a, b)` —— 返回 `a / b`；当 `b === 0` 时抛出 `RangeError`。

### 统计

- `mean(numbers)` —— 返回数字数组的算术平均值。
- `median(numbers)` —— 返回数字数组的中位数；长度为偶数时返回中间两个值的平均值。

`mean` 与 `median` 都不会修改传入的数组，并且当传入空数组（或非数组）时会抛出带有清晰信息的 `RangeError`。

```js
import { mean, median } from "./src/calculator.js";

mean([1, 2, 3, 4, 5]); // 3
median([1, 2, 3, 4]); // 2.5

mean([]); // RangeError: mean(): expected a non-empty array of numbers
median([]); // RangeError: median(): expected a non-empty array of numbers
```

## 自动清理过期 Issue（stale issue cleanup）

该功能会在 issue 长时间没有更新后自动标记或关闭它。判定逻辑是**纯函数**，不产生副作用；真正执行操作的只有定时工作流，而且只有在仓库策略显式开启后才会执行。

### 判定规则

- 一个 issue 在**至少** `staleAfterDays` 天没有更新后被视为过期，即 `ageInDays >= staleAfterDays`。默认值 30 表示恰好 30 天即视为过期，29.99 天仍然保留。
- 拉取请求（PR）、已经关闭的 issue、带有豁免标签的 issue、以及无法解析更新时间的 issue 一律保留。
- 当 `action: mark` 时，过期 issue 会被打上 `staleLabel` 标签；当 `action: close` 时，过期 issue 会被直接关闭。`mark` 模式下已带该标签的 issue 不会重复处理。

### 仓库策略：`.github/stale-issue-policy.yml`

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | `false` | 总开关。为 `false` 时永不改动任何 issue。 |
| `staleAfterDays` | `30` | 过期阈值（天）；必须是正数。 |
| `action` | `mark` | 过期后的动作：`mark`（打标签）或 `close`（关闭）。 |
| `staleLabel` | `stale` | `action: mark` 时使用的标签名。 |
| `exemptLabels` | `[]` | 带有任一标签的 issue 永不处理。 |
| `dryRun` | `true` | 为 `true` 时只记录将要执行的动作，不修改任何 issue。 |

### 安全默认（非破坏性）

仓库自带策略默认是**安全的非破坏性**配置：

```yaml
enabled: false   # 关闭
dryRun: true     # 即使开启也只演练
```

只有在策略显式同时设置 `enabled: true` 与 `dryRun: false` 时才会真正执行清理。任何格式错误或未知字段都会回退到安全默认值，因此配置拼写错误不会意外触发清理。

### 启用真正的清理

1. 编辑 `.github/stale-issue-policy.yml`。
2. 先保持 `enabled: true` 且 `dryRun: true`，通过手动触发观察日志输出。
3. 确认无误后设置 `dryRun: false`，此后定时任务会实际标记/关闭过期 issue。

也可以手动运行工作流时通过 `dryRun` 输入临时覆盖策略（`true` / `false`），无需改动文件。该覆盖是**故障关闭（fail-closed）**的：只有精确的 `true` / `false`（忽略大小写与首尾空白）才会生效，其它任何值（例如拼写错误 `garbage`、`yes`、`0`）都会被忽略，因此绝不会把演练模式意外变成真实清理。

### 工作流：`.github/workflows/stale-issue-cleanup.yml`

- 每天定时运行，并支持 `workflow_dispatch` 手动触发。
- 使用内置 `GITHUB_TOKEN`，权限最小化：`contents: read` 与 `issues: write`。
- 入口脚本为 `src/stale-issue-runner.js`；策略文件路径可用环境变量 `STALE_POLICY_PATH` 覆盖。

### 模块 API

- `src/stale-policy.js` —— 纯策略模块。
  - `decideStaleAction(issue, policy, now)` —— 返回 `{ decision, reason, ageInDays, ... }`，其中 `decision` 为 `keep`、`mark_stale` 或 `close`，`shouldExecute` 表示是否真的应当执行。
  - `resolvePolicy(partial)` —— 把任意输入规整为带安全默认值的策略对象。
  - 常量：`DECISIONS`、`DEFAULT_POLICY`、`ACTION_MODES`、`MS_PER_DAY`。
- `src/stale-policy-config.js` —— 读取受限 YAML 子集的策略加载器（`loadPolicyFile`、`loadPolicyFromText`、`parsePolicyYaml`）。
- `src/stale-issue-runner.js` —— 组织执行的运行器（`planStaleActions`、`runStaleCleanup`、`createGitHubClient`、`normalizeIssue`、`applyEnvOverrides`）。

```js
import { decideStaleAction, DECISIONS } from "./src/stale-policy.js";

const decision = decideStaleAction(
  { number: 1, updatedAt: "2024-01-01T00:00:00Z", labels: [] },
  { enabled: true, staleAfterDays: 30, action: "mark", dryRun: false },
  new Date("2024-03-01T00:00:00Z"),
);

decision.decision; // DECISIONS.MARK_STALE（"mark_stale"）
```
