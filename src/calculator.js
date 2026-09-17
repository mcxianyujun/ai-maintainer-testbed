export function add(a, b) {  return a + b;}export function subtract(a, b) {  return a - b;}export function multiply(a, b) {  return a * b;}export function divide(a, b) {  if (b === 0) {    throw new RangeError("divide(): division by zero is not allowed");  }  return a / b;}function assertNonEmpty(numbers, fnName) {  if (!Array.isArray(numbers) || numbers.length === 0) {    throw new RangeError(`${fnName}(): expected a non-empty array of numbers`);  }}export function mean(numbers) {  assertNonEmpty(numbers, "mean");  let total = 0;  for (const value of numbers) {    total += value;  }  return total / numbers.length;}export function median(numbers) {  assertNonEmpty(numbers, "median");  const sorted = [...numbers].sort((a, b) => a - b);  const middle = Math.floor(sorted.length / 2);  if (sorted.length % 2 === 1) {    return sorted[middle];  }  return (sorted[middle - 1] + sorted[middle]) / 2;}

export function increment(value) {
  return value + 1;
}

