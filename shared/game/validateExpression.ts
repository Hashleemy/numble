import type { ValidationResult } from './types';

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

type TokenType = 'number' | 'operator' | 'lparen' | 'rparen';

interface Token {
  type: TokenType;
  value: string;
  numericValue?: number;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }

    if (ch >= '0' && ch <= '9') {
      let numStr = '';
      while (i < expr.length && expr[i] >= '0' && expr[i] <= '9') {
        numStr += expr[i++];
      }
      tokens.push({ type: 'number', value: numStr, numericValue: parseInt(numStr, 10) });
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }

    // Unknown character — signal syntax error
    throw new SyntaxError(`Unexpected character: ${ch}`);
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Number usage checker (multiset)
// ---------------------------------------------------------------------------

function checkNumberUsage(tokens: Token[], available: number[]): boolean {
  const used = tokens
    .filter((t) => t.type === 'number')
    .map((t) => t.numericValue as number);

  if (used.length === 0) return false;

  const pool = [...available];
  for (const n of used) {
    const idx = pool.indexOf(n);
    if (idx === -1) return false;
    pool.splice(idx, 1);
  }

  return true;
}

// ---------------------------------------------------------------------------
// Recursive-descent parser / evaluator
// Handles: +, -, *, / with correct precedence, parentheses, unary minus
// Throws on division by zero.
// ---------------------------------------------------------------------------

class Parser {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  private peek(): Token | null {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  // expression = term (('+' | '-') term)*
  parseExpression(): number {
    let left = this.parseTerm();

    while (true) {
      const t = this.peek();
      if (!t || t.type !== 'operator' || (t.value !== '+' && t.value !== '-')) break;
      this.consume();
      const right = this.parseTerm();
      left = t.value === '+' ? left + right : left - right;
    }

    return left;
  }

  // term = unary (('*' | '/') unary)*
  private parseTerm(): number {
    let left = this.parseUnary();

    while (true) {
      const t = this.peek();
      if (!t || t.type !== 'operator' || (t.value !== '*' && t.value !== '/')) break;
      this.consume();
      const right = this.parseUnary();
      if (t.value === '/') {
        if (right === 0) throw new RangeError('division_by_zero');
        left = left / right;
      } else {
        left = left * right;
      }
    }

    return left;
  }

  // unary = '-' unary | primary
  private parseUnary(): number {
    const t = this.peek();
    if (t && t.type === 'operator' && t.value === '-') {
      this.consume();
      return -this.parseUnary();
    }
    return this.parsePrimary();
  }

  // primary = number | '(' expression ')'
  private parsePrimary(): number {
    const t = this.peek();

    if (!t) throw new SyntaxError('Unexpected end of expression');

    if (t.type === 'number') {
      this.consume();
      return t.numericValue as number;
    }

    if (t.type === 'lparen') {
      this.consume();
      const val = this.parseExpression();
      const closing = this.peek();
      if (!closing || closing.type !== 'rparen') {
        throw new SyntaxError('Missing closing parenthesis');
      }
      this.consume();
      return val;
    }

    throw new SyntaxError(`Unexpected token: ${t.value}`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function validateExpression(
  expression: string,
  availableNumbers: number[],
  target: number
): ValidationResult {
  if (!expression || expression.trim() === '') {
    return { valid: false, evaluated: null, error: 'syntax_error' };
  }

  let tokens: Token[];

  try {
    tokens = tokenize(expression);
  } catch {
    return { valid: false, evaluated: null, error: 'syntax_error' };
  }

  if (!checkNumberUsage(tokens, availableNumbers)) {
    return { valid: false, evaluated: null, error: 'wrong_numbers' };
  }

  let result: number;

  try {
    const parser = new Parser(tokens);
    result = parser.parseExpression();

    // Ensure entire input was consumed (no trailing tokens)
    if ((parser as unknown as { pos: number }).pos !== tokens.length) {
      return { valid: false, evaluated: null, error: 'syntax_error' };
    }
  } catch (err) {
    if (err instanceof RangeError && err.message === 'division_by_zero') {
      return { valid: false, evaluated: null, error: 'division_by_zero' };
    }
    return { valid: false, evaluated: null, error: 'syntax_error' };
  }

  if (!Number.isFinite(result)) {
    return { valid: false, evaluated: null, error: 'division_by_zero' };
  }

  if (result !== target) {
    return { valid: false, evaluated: result, error: 'wrong_result' };
  }

  return { valid: true, evaluated: result, error: null };
}
