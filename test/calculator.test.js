import test from "node:test";
import assert from "node:assert/strict";

import {
  add,
  divide,
  mean,
  median,
  multiply,
  subtract,
} from "../src/calculator.js";

test("add returns the sum", () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-2, 2), 0);
});

test("subtract returns the difference", () => {
  assert.equal(subtract(7, 4), 3);
  assert.equal(subtract(2, 5), -3);
});

test("multiply returns the product", () => {
  assert.equal(multiply(3, 4), 12);
  assert.equal(multiply(-3, 2), -6);
});

test("divide returns the quotient", () => {
  assert.equal(divide(8, 2), 4);
  assert.equal(divide(-9, 3), -3);
});

test("divide throws a clear error when dividing by zero", () => {
  assert.throws(() => divide(1, 0), {
    name: "RangeError",
    message: /division by zero/,
  });
  assert.throws(() => divide(-1, 0), {
    name: "RangeError",
    message: /division by zero/,
  });
  assert.throws(() => divide(0, 0), {
    name: "RangeError",
    message: /division by zero/,
  });
  assert.throws(() => divide(1, -0), {
    name: "RangeError",
    message: /division by zero/,
  });
});

test("mean averages an odd-length list", () => {
  assert.equal(mean([1, 2, 3, 4, 5]), 3);
});

test("mean averages an even-length list", () => {
  assert.equal(mean([2, 4, 6, 8]), 5);
});

test("mean handles negative values", () => {
  assert.equal(mean([-2, -4, -6]), -4);
  assert.equal(mean([-5, 5]), 0);
});

test("mean handles decimal values", () => {
  assert.equal(mean([0.5, 1.5]), 1);
  assert.ok(Math.abs(mean([1.1, 2.2, 3.3]) - 2.2) < 1e-9);
});

test("mean throws a clear error for empty input", () => {
  assert.throws(() => mean([]), {
    name: "RangeError",
    message: /mean\(\): expected a non-empty array/,
  });
});

test("median returns the middle value for odd-length input", () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([7, 1, 3, 5, 9]), 5);
});

test("median averages the two middle values for even-length input", () => {
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([4, 1, 3, 2]), 2.5);
});

test("median handles negative values", () => {
  assert.equal(median([-3, -1, -2]), -2);
  assert.equal(median([-4, -1, -3, -2]), -2.5);
});

test("median handles decimal values", () => {
  assert.equal(median([1.5, 0.5, 2.5]), 1.5);
  assert.ok(Math.abs(median([0.1, 0.2, 0.3, 0.4]) - 0.25) < 1e-9);
});

test("median orders numbers numerically, not lexicographically", () => {
  // Regression: a default Array.prototype.sort() orders these as strings
  // ("1", "10", "100", "2", "20"), which yields very different results.
  assert.equal(median([1, 10, 2]), 2); // lexicographic order returns 10
  assert.equal(median([1, 10, 2, 3]), 2.5); // lexicographic order returns 6
  assert.equal(median([1, 10, 2, 20, 100]), 10); // lexicographic order returns 100
  assert.equal(median([-10, -2, -1]), -2); // lexicographic order returns -10
});

test("median throws a clear error for empty input", () => {
  assert.throws(() => median([]), {
    name: "RangeError",
    message: /median\(\): expected a non-empty array/,
  });
});

test("mean does not modify its input array", () => {
  const input = [3, 1, 2];
  const copy = [...input];
  mean(input);
  assert.deepEqual(input, copy);
});

test("median does not modify its input array", () => {
  const input = [3, 1, 2, 4];
  const copy = [...input];
  median(input);
  assert.deepEqual(input, copy);
});

test("median does not modify multi-digit input while sorting", () => {
  const input = [10, 1, 2, 20];
  const copy = [...input];
  assert.equal(median(input), 6);
  assert.deepEqual(input, copy);
});
