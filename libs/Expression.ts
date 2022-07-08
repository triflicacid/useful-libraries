import { Complex } from "./maths/Complex";
import { IParseNumberOptions, parseNumber } from "./utils";

interface IToken {
  type: number;
  value: any;
  len?: number; // Length of tokens condensed to make this one. default=1
}

interface IOperator extends IToken {
  args: number;
  action?: Function;
  assoc: 'rtl' | 'ltr';
  prec: number;
  data?: any;
}

export interface IOperatorMap {
  [op: string]: Function;
}

export const OPERATORS_DEFAULT: IOperatorMap = {
  "**": Math.pow,
  "!": (a: number) => +!a,
  "/": (a: number, b: number) => a / b,
  "%": (a: number, b: number) => a % b,
  "*": (a: number, b: number) => a * b,
  "+": (a: number, b: number) => a + b,
  "u+": (a: number) => +a,
  "-": (a: number, b: number) => a - b,
  "u-": (a: number) => -a,
  "==": (a: number, b: number) => +(a === b),
  "!=": (a: number, b: number) => +(a !== b),
  ">": (a: number, b: number) => +(a > b),
  ">=": (a: number, b: number) => +(a >= b),
  "<": (a: number, b: number) => +(a < b),
  "<=": (a: number, b: number) => +(a <= b),
};

export const OPERATORS_IMAG: IOperatorMap = {
  "**": Complex.pow,
  "!": (a: Complex) => new Complex(+!a.isTruthy()),
  "/": Complex.div,
  "%": Complex.modulo,
  "*": Complex.mult,
  "+": Complex.add,
  "-": Complex.sub,
  "u+": (z: Complex) => z,
  "u-": (z: Complex) => Complex.mult(z, -1),
  "==": (a: Complex, b: Complex) => new Complex(+Complex.eq(a, b)),
  "!=": (a: Complex, b: Complex) => new Complex(+!Complex.eq(a, b)),
  ">": (a: Complex, b: Complex) => new Complex(+Complex.gt(a, b)),
  ">=": (a: Complex, b: Complex) => new Complex(+Complex.ge(a, b)),
  "<": (a: Complex, b: Complex) => new Complex(+Complex.lt(a, b)),
  "<=": (a: Complex, b: Complex) => new Complex(+Complex.le(a, b)),
};

/** Given an operator, return its numerical precedence */
function getPrecedence(token: IToken | IOperator) {
  if (token.type === TOKEN_OP) return (token as IOperator).prec;
  return 0;
}

/** Parse string expression to array of tokens */
function parseExpression(expr: string, operators: IOperatorMap, numberOpts: IParseNumberOptions) {
  let o = tokenifyExpression(expr, operators, numberOpts);
  if (o.error) return o;
  o = parseTokenCallOpts(o.tokens as Tokens, operators, numberOpts);
  return o;
}

/** Given string expression, return array of tokens */
function tokenifyExpression(expr: string, operators: IOperatorMap, numberOpts: IParseNumberOptions) {
  const tokens: Tokens = [];
  for (let i = 0; i < expr.length;) {
    let token: IOperator | IToken | undefined = undefined;

    if (/\s/.test(expr[i])) {
      i += expr[i].length;
      continue;
    } else if (expr[i] === '*' && expr[i + 1] === '*') {
      token = { type: TOKEN_OP, value: '**', args: 2, action: operators["**"], assoc: 'rtl', prec: 16 } as IOperator;
      i += 2;
    } else if (expr[i] === '=' && expr[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '==', args: 2, action: operators["=="], assoc: 'ltr', prec: 9 } as IOperator;
      i += 2;
    } else if (expr[i] === '!' && expr[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '!=', args: 2, action: operators["!="], assoc: 'ltr', prec: 9 } as IOperator;
      i += 2;
    } else if (expr[i] === '<' && expr[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '<=', args: 2, action: operators["<="], assoc: 'ltr', prec: 10 } as IOperator;
      i += 2;
    } else if (expr[i] === '>' && expr[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '>=', args: 2, action: operators[">="], assoc: 'ltr', prec: 10 } as IOperator;
      i += 2;
    } else if (expr[i] === '!') {
      token = { type: TOKEN_OP, value: '!', args: 1, action: operators["!"], assoc: 'rtl', prec: 17 } as IOperator;
      i += 1;
    } else if (expr[i] === '>') {
      token = { type: TOKEN_OP, value: '>', args: 2, action: operators[">"], assoc: 'ltr', prec: 10 } as IOperator;
      i += 1;
    } else if (expr[i] === '<') {
      token = { type: TOKEN_OP, value: '<', args: 2, action: operators["<"], assoc: 'ltr', prec: 10 } as IOperator;
      i += 1;
    } else if (expr[i] === '/') {
      token = { type: TOKEN_OP, value: '/', args: 2, action: operators["/"], assoc: 'ltr', prec: 15 } as IOperator;
      i += 1;
    } else if (expr[i] === '%') {
      token = { type: TOKEN_OP, value: '%', args: 2, action: operators["%"], assoc: 'ltr', prec: 15 } as IOperator;
      i += 1;
    } else if (expr[i] === '*') {
      token = { type: TOKEN_OP, value: '*', args: 2, action: operators["*"], assoc: 'ltr', prec: 15 } as IOperator;
      i += 1;
    } else if (expr[i] === '+') {
      token = { type: TOKEN_OP, value: '+', args: 2, action: operators["+"], assoc: 'ltr', prec: 14 } as IOperator;
      i += 1;
    } else if (expr[i] === '-') {
      token = { type: TOKEN_OP, value: '-', args: 2, action: operators["-"], assoc: 'ltr', prec: 14 } as IOperator;
      i += 1;
    } else if (expr[i] === '=') {
      token = {
        type: TOKEN_OP, value: '=', args: 2, action: (a: string, b: number, symbols: SymbolMap, constSymbols: SymbolMap) => {
          if (constSymbols.has(a)) return { error: true, msg: `Cannot assign to constant value '${a}'` };
          symbols.set(a, b);
          return b;
        }, assoc: 'rtl', prec: 3
      } as IOperator;
      i += 1;
    } else if (expr[i] === ',') {
      token = { type: TOKEN_OP, value: ',', args: 2, action: (a: string, b: number) => b, assoc: 'ltr', prec: 1 } as IOperator;
      i += 1;
    } else if (expr[i] === '(' || expr[i] === ')') {
      token = { type: TOKEN_OP, value: expr[i] } as IOperator;
      i += 1;
    } else {
      if (/[A-Za-z_$]/.test(expr[i])) {
        let symbol = expr[i++];
        while (expr[i] && /[A-Za-z$_0-9]/.test(expr[i])) {
          symbol += expr[i++];
        }
        token = { type: TOKEN_SYM, value: symbol } as IToken;
      } else {
        let nobj = parseNumber(expr.substring(i), numberOpts);
        if (nobj.str.length !== 0) {
          token = { type: TOKEN_NUM, value: nobj.imag ? new Complex(0, nobj.num) : nobj.num } as IToken;
          i += nobj.str.length;
        }
      }
    }

    if (token) {
      tokens.push(token);
    } else {
      tokens.length = 0;
      return { error: true, pos: i, msg: `Unknown token '${expr[i]}' at position ${i}` };
    }
  }

  // Unary operators
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i]?.type === TOKEN_OP) {
      const OP = tokens[i] as IOperator;
      if (OP.args > 1) { // Not unary, make unary?
        const top = tokens[i - 1];
        if (top === undefined || (top.type === TOKEN_OP && top.value !== ')')) {
          if (OP.value === '-') {
            OP.args = 1;
            OP.action = operators['u-'];
            OP.assoc = 'rtl';
            OP.prec = 17;
          } else if (OP.value === '+') {
            OP.args = 1;
            OP.action = operators['u+'];
            OP.assoc = 'rtl';
            OP.prec = 17;
          }
        }
      }
    }
  }

  return { error: false, tokens };
}

/** Given an array of tokens, identify and extract call operators */
function parseTokenCallOpts(tokens: Tokens, operators: IOperatorMap, numberOpts: IParseNumberOptions) {
  // Call operator: <symbol>(...)
  for (let i = 0; i < tokens.length - 1;) {
    if (tokens[i].type === TOKEN_SYM && tokens[i + 1].type === TOKEN_OP && tokens[i + 1].value === '(') {
      let j = i;
      i += 2;
      let contents: Tokens = [], open = 1;
      while (tokens[i]) {
        if (tokens[i].type === TOKEN_OP) {
          if (tokens[i].value === '(') {
            ++open;
          } else if (tokens[i].value === ')') {
            --open;
            if (open === 0) break;
          }
        }
        contents.push(tokens[i++]);
      }
      if (open > 0) return { error: true, pos: i, msg: `Unclosed parenthesis (expected ${open} * ')' at position ${i})` };
      let args: Tokens[] = [[]];
      let o = parseTokenCallOpts(contents, operators, numberOpts);
      if (o.error) return o;
      o.tokens.forEach((T: IToken | IOperator) => {
        if (T.type === TOKEN_OP && T.value === ',') args.push([]);
        else args[args.length - 1].push(T);
      });
      args = args.filter(ar => ar.length > 0).map(ar => expressionToRPN(ar));
      const getlen = (t: Tokens) => t.reduce((p, c) => p + (c.len ?? 1), 0);
      let op = { type: TOKEN_OP, value: '()', args: 1, assoc: 'ltr', prec: 20, action: undefined, data: args, len: getlen(contents) + 2 } as IOperator;
      tokens.splice(j + 1, op.len as number, op);
      ++i;
    } else {
      ++i;
    }
  }

  return { error: false, tokens };
}

/** Given array of tokens, make tokens to RPN form */
function expressionToRPN(original: Tokens) {
  const stack: Tokens = [], tokens: Tokens = [];
  for (let i = 0; i < original.length; ++i) {
    const token = original[i];
    if (token.type === TOKEN_OP) {
      const OP = token as IOperator;
      if (OP.value === '(') {
        stack.push(token);
      } else if (OP.value === ')') {
        while (stack.length > 0 && !(stack[stack.length - 1].type === TOKEN_OP && stack[stack.length - 1].value === '(')) {
          tokens.push(stack.pop() as IToken | IOperator);
        }
        stack.pop(); // Remove ) from stack
      } else {
        if (OP.assoc === 'ltr') {
          while (stack.length !== 0 && getPrecedence(original[i]) <= getPrecedence(stack[stack.length - 1])) tokens.push(stack.pop() as IToken | IOperator);
        } else {
          while (stack.length !== 0 && getPrecedence(original[i]) < getPrecedence(stack[stack.length - 1])) tokens.push(stack.pop() as IToken | IOperator);
        }
        stack.push(OP);
      }
    } else {
      tokens.push(token);
    }
  }
  while (stack.length !== 0) tokens.push(stack.pop() as IToken | IOperator); // DUMP
  return tokens;
}

/** Parse an array of tokens to a numerical result */
function evaluateExpression(tokens: Tokens, symbols: SymbolMap, constSymbols: SymbolMap, numberOpts: IParseNumberOptions) {
  if (tokens.length === 0) return { error: true, msg: `Empty expression` };
  // EVALUATE
  const stack: Tokens = [];
  for (let i = 0; i < tokens.length; ++i) {
    const T = tokens[i];
    if (T.type === TOKEN_NUM) stack.push(T);
    else if (T.type === TOKEN_SYM) stack.push(T);
    else if (T.type === TOKEN_OP) {
      const OP = T as IOperator;
      if (OP.value === '(' || OP.value === ')') return { error: true, token: T, msg: `Unbalanced parenthesis '${OP.value}' at position ${i}`, pos: i };
      if (OP.args === undefined) return { error: true, token: T, msg: `Unexpected operator '${OP.value}' at position ${i}`, pos: i };
      if (stack.length < OP.args) return { error: true, token: T, msg: `Stack underflow whilst executing operator ${OP.value} (expects ${OP.args} args, got ${stack.length})` };
      let argTokens = stack.splice(stack.length - OP.args), args: any[] = [];
      for (let j = 0; j < argTokens.length; ++j) {
        let T = argTokens[j];
        if (T.type === TOKEN_NUM) {
          args.push(T.value); // Push numeric constant
        } else if (T.type === TOKEN_SYM) {
          if (j === 0 && OP.value === '=') args.push(T.value); // Push the symbol itself
          else if (T.value === numberOpts.imag) args.push(Complex.I); // Imaginary unit
          else if (symbols.has(T.value)) args.push(symbols.get(T.value));
          else if (constSymbols.has(T.value)) args.push(constSymbols.get(T.value));
          else return { error: true, token: T, msg: `Unbound symbol referenced '${T.value}' in operator ${OP.value}` };
        } else {
          return { error: true, token: T, msg: `Invalid token type in operator ${OP.value}` };
        }
      }
      if (numberOpts.imag) args = args.map(z => typeof z === 'number' ? new Complex(z) : z); // Ensure all data values are Complex
      let o: any;
      if (OP.action) {
        o = OP.action(...args, symbols, constSymbols);
      } else if (OP.value === '()') {
        // CALL
        const f = args[0];
        if (typeof f !== 'function') return { error: true, msg: `Operator '()' used on non-callable '${f}'` };
        const argValues: any[] = [];
        for (let arg of OP.data) {
          let o = evaluateExpression(arg, symbols, constSymbols, numberOpts);
          if (o.error) return o;
          argValues.push(o.value);
        }
        let x = f(...argValues, symbols);
        if (typeof x === 'number') o = numberOpts.imag ? new Complex(x) : x;
        else if (x == undefined) o = numberOpts.imag ? new Complex(0) : 0;
        else o = x;
      } else {
        return { error: true, msg: `Unknown operator '${OP.value}'` };
      }
      if (typeof o === 'object' && o.error) return o;
      stack.push({ type: TOKEN_NUM, value: typeof o === 'object' && o.value ? o.value : o } as IToken);
    }
  }

  if (stack.length !== 1) return { error: true, token: null, msg: `Expected one item to be in result stack, got ${stack.length}`, stack, };
  let value: any;
  if (stack[0].type === TOKEN_NUM) value = stack[0].value;
  else if (stack[0].type === TOKEN_SYM) {
    if (stack[0].value === numberOpts.imag) value = Complex.I as any;
    else if (symbols.has(stack[0].value)) value = symbols.get(stack[0].value);
    else if (constSymbols.has(stack[0].value)) value = constSymbols.get(stack[0].value);
    else return { error: 1, token: stack[0], msg: `Unbound symbol referenced '${stack[0].value}'` };
  } else {
    return { error: true };
  }
  if (typeof value === 'number' && numberOpts.imag) value = Complex.parse(value);
  return { error: false, value };
}

const TOKEN_OP = 1;
const TOKEN_NUM = 2;
const TOKEN_SYM = 4;

type Tokens = Array<IToken | IOperator>;
type SymbolMap = Map<string, number | Function>

/** Creates an expression, which may be parsed and executed.
 * Expression.numberOpts allows customision on numerical parsing.
 *   NOTE if numberOpts.imag is truthy, please pass OPERATORS_IMAG to parse
*/
export class Expression {
  private _raw: string;
  private _tokens: Tokens;
  private _symbols: SymbolMap = new Map();
  public constSymbols: SymbolMap = new Map(); // Symbols whose values are not changed
  public readonly numberOpts: IParseNumberOptions;

  constructor(expr = '') {
    this._raw = expr;
    this._tokens = [];
    this.numberOpts = {};
  }

  /** Reset symbol map and expression data */
  public reset() {
    this._tokens.length = 0;
    this._symbols.clear();
    return this;
  }

  /** Load new raw expression string */
  public load(expr: string) {
    this._tokens.length = 0;
    this._raw = expr;
    return this;
  }

  /** Get original expression string */
  public getOriginal() {
    return this._raw;
  }

  public setSymbol(name: string, value: number | Function) {
    this._symbols.set(name, value);
    return this;
  }

  public hasSymbol(name: string) {
    return this._symbols.has(name);
  }

  public getSymbol(name: string) {
    return this._symbols.get(name);
  }

  public delSymbol(name: string) {
    return this._symbols.delete(name);
  }

  public setSymbolMap(map: Map<string, number>) {
    this._symbols = map;
  }

  /** Parse raw to token array */
  public parse(operators?: IOperatorMap) {
    if (operators === undefined) operators = OPERATORS_DEFAULT;
    this._tokens.length = 0;
    const o = parseExpression(this._raw, operators, this.numberOpts);
    if ((o as any).tokens) {
      this._tokens = (o as any).tokens;
      const tokens = expressionToRPN(this._tokens);
      this._tokens = tokens;
      (o as any).tokens = tokens;
    }
    return o;
  }

  /** Evaluate parsed string. */
  public evaluate() {
    return evaluateExpression(this._tokens, this._symbols, this.constSymbols, this.numberOpts);
  }

  /** Return new Expression, copying symbolMap */
  public copy(expr = undefined) {
    let E = new Expression(expr);
    this._symbols.forEach((v, k) => E._symbols.set(k, v));
    return E;
  }
} 