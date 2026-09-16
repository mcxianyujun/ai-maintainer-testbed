import test from "node:test";
import assert from "node:assert/strict";

import { add, divide, multiply, subtract } from "../src/calculator.js";

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
