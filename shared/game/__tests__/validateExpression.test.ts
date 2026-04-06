import { validateExpression } from '../validateExpression';

const nums = [3, 4, 2, 1, 5, 6];

describe('validateExpression — valid cases', () => {
  it('accepts a simple correct expression', () => {
    // 3 + 4 = 7
    const result = validateExpression('3 + 4', nums, 7);
    expect(result.valid).toBe(true);
    expect(result.evaluated).toBe(7);
    expect(result.error).toBeNull();
  });

  it('handles parentheses and operator precedence', () => {
    // (3 + 4) * 2 = 14
    const result = validateExpression('(3 + 4) * 2', nums, 14);
    expect(result.valid).toBe(true);
    expect(result.evaluated).toBe(14);
  });

  it('handles subtraction resulting in negative intermediate', () => {
    // 1 - 6 + 5 * 4 = 15
    const result = validateExpression('1 - 6 + 5 * 4', nums, 15);
    expect(result.valid).toBe(true);
  });

  it('accepts a single number equal to target', () => {
    const result = validateExpression('5', [5, 1, 2, 3, 4, 6], 5);
    expect(result.valid).toBe(true);
  });

  it('handles division', () => {
    // 6 / 2 = 3
    const result = validateExpression('6 / 2', nums, 3);
    expect(result.valid).toBe(true);
    expect(result.evaluated).toBe(3);
  });
});

describe('validateExpression — wrong_numbers', () => {
  it('rejects a number not in the available set', () => {
    // 7 is not in nums
    const result = validateExpression('7 + 1', nums, 8);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('wrong_numbers');
  });

  it('rejects reuse of a number beyond its multiplicity', () => {
    // 3 appears once in nums; using it twice is invalid
    const result = validateExpression('3 + 3', nums, 6);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('wrong_numbers');
  });

  it('allows using the same digit if it appears twice in available numbers', () => {
    // [3, 3, 2, 1, 5, 6] — two 3s available
    const result = validateExpression('3 + 3', [3, 3, 2, 1, 5, 6], 6);
    expect(result.valid).toBe(true);
  });
});

describe('validateExpression — wrong_result', () => {
  it('returns wrong_result when expression is valid but answer is off', () => {
    const result = validateExpression('3 + 4', nums, 99);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('wrong_result');
    expect(result.evaluated).toBe(7);
  });
});

describe('validateExpression — division_by_zero', () => {
  it('catches explicit division by zero', () => {
    // Two 3s are available so number usage is valid; result is division by zero
    const result = validateExpression('5 / (3 - 3)', [5, 3, 3, 1, 2, 4], 0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('division_by_zero');
  });

  it('catches literal division by zero', () => {
    // need 0 to not be in available, but we can use (1-1)
    const result = validateExpression('6 / (1 - 1)', [6, 1, 1, 2, 3, 4], 0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('division_by_zero');
  });
});

describe('validateExpression — syntax_error', () => {
  it('rejects empty string', () => {
    const result = validateExpression('', nums, 7);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('syntax_error');
  });

  it('rejects whitespace-only string', () => {
    const result = validateExpression('   ', nums, 7);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('syntax_error');
  });

  it('rejects double operator', () => {
    const result = validateExpression('3 + * 4', nums, 7);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('syntax_error');
  });

  it('rejects unmatched parenthesis', () => {
    const result = validateExpression('(3 + 4', nums, 7);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('syntax_error');
  });

  it('rejects trailing operator', () => {
    const result = validateExpression('3 +', nums, 3);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('syntax_error');
  });

  it('rejects unknown characters', () => {
    const result = validateExpression('3 ^ 4', nums, 81);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('syntax_error');
  });
});

describe('validateExpression — operator precedence', () => {
  it('respects * before +', () => {
    // 2 + 3 * 4 = 14 (not 20)
    const result = validateExpression('2 + 3 * 4', nums, 14);
    expect(result.valid).toBe(true);
  });

  it('parentheses override precedence', () => {
    // (2 + 3) * 4 = 20
    const result = validateExpression('(2 + 3) * 4', nums, 20);
    expect(result.valid).toBe(true);
  });
});
