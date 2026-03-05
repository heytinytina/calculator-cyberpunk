'use strict';

class Calculator {
  constructor() {
    this.currentInput = '0';
    this.previousValue = null;
    this.operator = null;
    this.expression = '';
    this.isError = false;
    this.justEvaluated = false;
    this.waitingForOperand = false;
  }

  // --- Input handlers ---

  inputDigit(digit) {
    if (this.isError) this.clear();

    if (this.waitingForOperand) {
      this.currentInput = digit;
      this.waitingForOperand = false;
    } else if (this.justEvaluated) {
      this.expression = '';
      this.currentInput = digit;
      this.justEvaluated = false;
    } else {
      const digitCount = this.currentInput.replace(/[-.]/g, '').length;
      if (digitCount >= 12) return;
      this.currentInput = this.currentInput === '0' ? digit : this.currentInput + digit;
    }

    this.updateDisplay();
  }

  inputDecimal() {
    if (this.isError) this.clear();

    if (this.waitingForOperand) {
      this.currentInput = '0.';
      this.waitingForOperand = false;
      this.updateDisplay();
      return;
    }

    if (this.justEvaluated) {
      this.expression = '';
      this.currentInput = '0.';
      this.justEvaluated = false;
      this.updateDisplay();
      return;
    }

    if (this.currentInput.includes('.')) return;
    this.currentInput = this.currentInput === '-' ? '-0.' : this.currentInput + '.';
    this.updateDisplay();
  }

  handleMinus() {
    if (this.isError) return;

    // After = → treat as subtraction
    if (this.justEvaluated) {
      this.inputOperator('−');
      return;
    }

    // After pressing an operator → start a negative second operand
    if (this.waitingForOperand) {
      this.currentInput = '-';
      this.waitingForOperand = false;
      this.updateDisplay();
      return;
    }

    // First input on a fresh display → start negative number
    if (this.currentInput === '0' && this.operator === null) {
      this.currentInput = '-';
      this.updateDisplay();
      return;
    }

    // Otherwise → subtraction operator
    this.inputOperator('−');
  }

  inputOperator(op) {
    if (this.isError) return;

    const currentNum = this.getCurrentNumber();

    // Replace operator if still waiting for next operand
    if (this.waitingForOperand) {
      this.operator = op;
      this.expression = `${this.formatResult(this.previousValue)} ${op}`;
      this.updateDisplay();
      return;
    }

    // Continue from a just-evaluated result
    if (this.justEvaluated) {
      this.previousValue = currentNum;
      this.operator = op;
      this.expression = `${this.formatResult(currentNum)} ${op}`;
      this.justEvaluated = false;
      this.waitingForOperand = true;
      this.updateDisplay();
      return;
    }

    // Chain: evaluate pending operation first, then set new operator
    if (this.operator !== null) {
      const result = this.compute(this.previousValue, this.operator, currentNum);
      if (result === null) { this.setError(); return; }
      const formatted = this.formatResult(result);
      this.currentInput = String(formatted);
      this.previousValue = result;
      this.operator = op;
      this.expression = `${formatted} ${op}`;
      this.waitingForOperand = true;
      this.updateDisplay();
      return;
    }

    // First operator press
    this.previousValue = currentNum;
    this.operator = op;
    this.expression = `${this.formatResult(currentNum)} ${op}`;
    this.waitingForOperand = true;
    this.justEvaluated = false;
    this.updateDisplay();
  }

  calculate() {
    if (this.isError || this.operator === null || this.waitingForOperand) return;

    const capturedOp = this.operator; // capture before any state mutation
    const currentNum = this.getCurrentNumber();
    const result = this.compute(this.previousValue, capturedOp, currentNum);
    const fullExpr = `${this.expression} ${this.formatResult(currentNum)} =`;

    if (result === null) {
      this.setError();
      if (typeof triggerCelebration === 'function') triggerCelebration(capturedOp, true);
      return;
    }

    const formatted = this.formatResult(result);
    this.currentInput = String(formatted);
    this.previousValue = result;
    this.expression = fullExpr;
    this.operator = null;
    this.justEvaluated = true;
    this.waitingForOperand = false;
    this.updateDisplay();
    if (typeof triggerCelebration === 'function') triggerCelebration(capturedOp, false);
  }

  clear() {
    this.currentInput = '0';
    this.previousValue = null;
    this.operator = null;
    this.expression = '';
    this.isError = false;
    this.justEvaluated = false;
    this.waitingForOperand = false;
    this.updateDisplay();
  }

  backspace() {
    if (this.isError) { this.clear(); return; }
    if (this.waitingForOperand) return;

    if (this.currentInput.length <= 1 || this.currentInput === '-') {
      this.currentInput = '0';
    } else {
      this.currentInput = this.currentInput.slice(0, -1);
      if (this.currentInput === '-') this.currentInput = '0';
    }

    this.updateDisplay();
  }

  // --- Helpers ---

  getCurrentNumber() {
    const n = parseFloat(this.currentInput);
    return isNaN(n) ? 0 : n;
  }

  compute(a, op, b) {
    switch (op) {
      case '+':  return a + b;
      case '−':  return a - b;
      case '×':  return a * b;
      case '÷':  return b === 0 ? null : a / b;
      default:   return null;
    }
  }

  formatResult(n) {
    if (n === null || n === undefined) return '0';
    const rounded = parseFloat(n.toPrecision(10));
    return String(rounded);
  }

  setError() {
    this.isError = true;
    this.currentInput = 'Error';
    this.expression = '';
    this.operator = null;
    this.previousValue = null;
    this.justEvaluated = false;
    this.waitingForOperand = false;
    this.updateDisplay();
  }

  // --- Display ---

  updateDisplay() {
    const currentEl = document.getElementById('current');
    const expressionEl = document.getElementById('expression');
    if (currentEl) {
      currentEl.textContent = this.currentInput;
      currentEl.classList.toggle('is-error', this.isError);
    }
    if (expressionEl) expressionEl.textContent = this.expression;
  }

  // --- Event binding ---

  bindButtons() {
    document.querySelectorAll('[data-digit]').forEach(btn => {
      btn.addEventListener('click', () => this.inputDigit(btn.dataset.digit));
    });

    document.querySelectorAll('[data-op]').forEach(btn => {
      btn.addEventListener('click', () => {
        const op = btn.dataset.op;
        if (op === '−') this.handleMinus();
        else this.inputOperator(op);
      });
    });

    const get = selector => document.querySelector(selector);
    get('[data-action="decimal"]')  ?.addEventListener('click', () => this.inputDecimal());
    get('[data-action="equals"]')   ?.addEventListener('click', () => this.calculate());
    get('[data-action="clear"]')    ?.addEventListener('click', () => this.clear());
    get('[data-action="backspace"]')?.addEventListener('click', () => this.backspace());
  }

  bindKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.key >= '0' && e.key <= '9') { this.inputDigit(e.key); }
      else if (e.key === '.')            { this.inputDecimal(); }
      else if (e.key === '+')            { this.inputOperator('+'); }
      else if (e.key === '-')            { this.handleMinus(); }
      else if (e.key === '*')            { this.inputOperator('×'); }
      else if (e.key === '/')            { e.preventDefault(); this.inputOperator('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { this.calculate(); }
      else if (e.key === 'Backspace')    { this.backspace(); }
      else if (e.key === 'Escape')       { this.clear(); }
    });
  }

  init() {
    this.bindButtons();
    this.bindKeyboard();
    this.updateDisplay();
  }
}

const calculator = new Calculator();
document.addEventListener('DOMContentLoaded', () => calculator.init());
