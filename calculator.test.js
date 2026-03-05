'use strict';

// Lightweight test runner — no framework needed
const results = [];
let totalPassed = 0;
let totalFailed = 0;

function it(description, fn) {
  try {
    fn();
    totalPassed++;
    results.push({ pass: true, description });
  } catch (e) {
    totalFailed++;
    results.push({ pass: false, description, error: e.message });
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, got ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy, got ${JSON.stringify(actual)}`);
      }
    },
  };
}

// Fresh Calculator with no DOM side-effects
function makeCalc() {
  return new Calculator();
}

// ============================================================
// Initial state
// ============================================================

it('starts with display showing 0', () => {
  const c = makeCalc();
  expect(c.currentInput).toBe('0');
  expect(c.operator).toBeNull();
  expect(c.expression).toBe('');
});

// ============================================================
// Digit input
// ============================================================

it('inputs a single digit', () => {
  const c = makeCalc();
  c.inputDigit('5');
  expect(c.currentInput).toBe('5');
});

it('inputs multi-digit number', () => {
  const c = makeCalc();
  c.inputDigit('1'); c.inputDigit('2'); c.inputDigit('3');
  expect(c.currentInput).toBe('123');
});

it('normalizes leading zeros (007 → 7)', () => {
  const c = makeCalc();
  c.inputDigit('0'); c.inputDigit('0'); c.inputDigit('7');
  expect(c.currentInput).toBe('7');
});

it('caps input at 12 digits', () => {
  const c = makeCalc();
  for (let i = 0; i < 15; i++) c.inputDigit('1');
  expect(c.currentInput).toBe('111111111111'); // 12 ones
});

it('caps 12 digits correctly for decimal numbers', () => {
  const c = makeCalc();
  c.inputDigit('1'); c.inputDecimal();
  for (let i = 0; i < 14; i++) c.inputDigit('5');
  // 1 digit before decimal + 11 after = 12 total (decimal not counted)
  expect(c.currentInput).toBe('1.55555555555');
});

// ============================================================
// Decimal input
// ============================================================

it('adds decimal point', () => {
  const c = makeCalc();
  c.inputDigit('3'); c.inputDecimal(); c.inputDigit('1'); c.inputDigit('4');
  expect(c.currentInput).toBe('3.14');
});

it('allows 0.x decimals', () => {
  const c = makeCalc();
  c.inputDecimal(); c.inputDigit('5');
  expect(c.currentInput).toBe('0.5');
});

it('ignores second decimal point on same number', () => {
  const c = makeCalc();
  c.inputDigit('3'); c.inputDecimal(); c.inputDecimal(); c.inputDigit('5');
  expect(c.currentInput).toBe('3.5');
});

// ============================================================
// Basic arithmetic
// ============================================================

it('adds two numbers', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('+'); c.inputDigit('3'); c.calculate();
  expect(c.currentInput).toBe('8');
});

it('subtracts two numbers', () => {
  const c = makeCalc();
  c.inputDigit('9'); c.inputOperator('−'); c.inputDigit('4'); c.calculate();
  expect(c.currentInput).toBe('5');
});

it('multiplies two numbers', () => {
  const c = makeCalc();
  c.inputDigit('6'); c.inputOperator('×'); c.inputDigit('7'); c.calculate();
  expect(c.currentInput).toBe('42');
});

it('divides two numbers', () => {
  const c = makeCalc();
  c.inputDigit('1'); c.inputDigit('0'); c.inputOperator('÷'); c.inputDigit('4'); c.calculate();
  expect(c.currentInput).toBe('2.5');
});

// ============================================================
// Error: division by zero
// ============================================================

it('shows Error on division by zero', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('÷'); c.inputDigit('0'); c.calculate();
  expect(c.currentInput).toBe('Error');
  expect(c.isError).toBe(true);
});

it('resets after error when next digit is typed', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('÷'); c.inputDigit('0'); c.calculate();
  c.inputDigit('3');
  expect(c.currentInput).toBe('3');
  expect(c.isError).toBe(false);
});

it('backspace on Error clears to 0', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('÷'); c.inputDigit('0'); c.calculate();
  c.backspace();
  expect(c.currentInput).toBe('0');
  expect(c.isError).toBe(false);
});

// ============================================================
// Clear
// ============================================================

it('C clears all state', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('+'); c.inputDigit('3');
  c.clear();
  expect(c.currentInput).toBe('0');
  expect(c.operator).toBeNull();
  expect(c.previousValue).toBeNull();
  expect(c.expression).toBe('');
});

// ============================================================
// Backspace
// ============================================================

it('backspace removes last digit', () => {
  const c = makeCalc();
  c.inputDigit('1'); c.inputDigit('2'); c.inputDigit('3');
  c.backspace();
  expect(c.currentInput).toBe('12');
});

it('backspace on single digit resets to 0', () => {
  const c = makeCalc();
  c.inputDigit('5');
  c.backspace();
  expect(c.currentInput).toBe('0');
});

it('backspace on 0 keeps 0', () => {
  const c = makeCalc();
  c.backspace();
  expect(c.currentInput).toBe('0');
});

// ============================================================
// Operator replacement
// ============================================================

it('replaces operator when pressed twice before entering second number', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('+'); c.inputOperator('×');
  expect(c.operator).toBe('×');
});

// ============================================================
// Chaining
// ============================================================

it('chains calculations (5 + 3 × 2 = 16)', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('+');
  c.inputDigit('3'); c.inputOperator('×'); // evaluates 5+3=8 first
  c.inputDigit('2'); c.calculate();
  expect(c.currentInput).toBe('16');
});

it('chains after = with new operator', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('+'); c.inputDigit('3'); c.calculate(); // = 8
  c.inputOperator('×'); c.inputDigit('2'); c.calculate(); // 8 × 2 = 16
  expect(c.currentInput).toBe('16');
});

// ============================================================
// Float rounding
// ============================================================

it('rounds 0.1 + 0.2 to 0.3', () => {
  const c = makeCalc();
  c.inputDigit('0'); c.inputDecimal(); c.inputDigit('1');
  c.inputOperator('+');
  c.inputDigit('0'); c.inputDecimal(); c.inputDigit('2');
  c.calculate();
  expect(c.currentInput).toBe('0.3');
});

// ============================================================
// Expression display
// ============================================================

it('expression shows full equation after =', () => {
  const c = makeCalc();
  c.inputDigit('1'); c.inputDigit('2');
  c.inputOperator('+');
  c.inputDigit('5');
  c.calculate();
  expect(c.expression).toBe('12 + 5 =');
});

it('expression clears when typing a new number after =', () => {
  const c = makeCalc();
  c.inputDigit('5'); c.inputOperator('+'); c.inputDigit('3'); c.calculate();
  c.inputDigit('7');
  expect(c.expression).toBe('');
});

// ============================================================
// Negative numbers
// ============================================================

it('supports negative number as first input via handleMinus', () => {
  const c = makeCalc();
  c.handleMinus(); c.inputDigit('5');
  expect(c.currentInput).toBe('-5');
});

it('supports negative second operand', () => {
  const c = makeCalc();
  c.inputDigit('1'); c.inputDigit('0');
  c.inputOperator('+');
  c.handleMinus(); c.inputDigit('3'); // -3
  c.calculate();
  expect(c.currentInput).toBe('7');
});

it('minus after = is treated as subtraction operator', () => {
  const c = makeCalc();
  c.inputDigit('8'); c.inputOperator('+'); c.inputDigit('2'); c.calculate(); // = 10
  c.handleMinus(); // should set operator = −
  c.inputDigit('3'); c.calculate(); // 10 − 3 = 7
  expect(c.currentInput).toBe('7');
});
