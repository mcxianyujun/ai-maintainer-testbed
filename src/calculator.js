export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a + b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new RangeError("divide(): division by zero is not allowed");
  }
  return a / b;
}
