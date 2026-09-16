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
