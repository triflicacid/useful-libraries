import { Complex } from "./maths/Complex";
import { IParseNumberOptions, parseNumber } from "./utils";

//#region TYPES
/** Describes a Token */
interface IToken {
  type: number;
  value: any;
  pos: number; // Original position in string
  len?: number; // Length of tokens condensed to make this one. default=1
}

/** Describes a token representing an operator */
interface IOperator extends IToken {
  args: number; // Number of arguments it takes
  action?: Function; // Function arguments will be passed to, returns a number
  assoc: 'rtl' | 'ltr';
  prec: number; // Precedence of operator
  data?: any; // Data accompanying the operator. This is unique to each operator.
}

/** Maps operator symbols onto their functions e.g. `"+": (a, b) => a + b` */
export interface IOperatorMap {
  [op: string]: Function;
}

/** Result from parsing an expression string: error */
interface IParseError {
  error: true;
  msg: string;
  pos: number;
}

/** Result from parsing an expression string: success */
interface IParseSuccess {
  error: false;
  tokens: Tokens;
}

/** Result from evaluating an expression: error */
interface IEvaluationError {
  error: true;
  msg: string; // Error message
  token: Token; // Token error happened at
}
//#endregion

//#region OPERATORS
/** Default operators */
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

/** OPERATORS_DEFAULT overloaded to handle Complex numbers */
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
//#endregion

/** Given an operator, return its numerical precedence */
function getPrecedence(token: Token) {
  if (token.type === TOKEN_OP) return (token as IOperator).prec;
  return 0;
}

/** Parse string expression to array of tokens */
function parseExpression(source: string, E: Expression): IParseSuccess | IParseError {
  let o = tokenifyExpression(source, E);
  if (o.error) return o;
  o = parseTokenCallOpts(o.tokens as Tokens, E);
  return o;
}

/** Given string expression, return array of tokens */
function tokenifyExpression(source: string, E: Expression): IParseSuccess | IParseError {
  const tokens: Tokens = [];
  for (let i = 0; i < source.length;) {
    let token: IOperator | IToken | undefined = undefined;
    if (/\s/.test(source[i])) {
      i += source[i].length;
      continue;
    } else if (source[i] === '*' && source[i + 1] === '*') {
      token = { type: TOKEN_OP, value: '**', args: 2, action: E.operators["**"], assoc: 'rtl', prec: 16, pos: i } as IOperator;
      i += 2;
    } else if (source[i] === '=' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '==', args: 2, action: E.operators["=="], assoc: 'ltr', prec: 9, pos: i } as IOperator;
      i += 2;
    } else if (source[i] === '!' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '!=', args: 2, action: E.operators["!="], assoc: 'ltr', prec: 9, pos: i } as IOperator;
      i += 2;
    } else if (source[i] === '<' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '<=', args: 2, action: E.operators["<="], assoc: 'ltr', prec: 10, pos: i } as IOperator;
      i += 2;
    } else if (source[i] === '>' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '>=', args: 2, action: E.operators[">="], assoc: 'ltr', prec: 10, pos: i } as IOperator;
      i += 2;
    } else if (source[i] === '!') {
      token = { type: TOKEN_OP, value: '!', args: 1, action: E.operators["!"], assoc: 'rtl', prec: 17, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '>') {
      token = { type: TOKEN_OP, value: '>', args: 2, action: E.operators[">"], assoc: 'ltr', prec: 10, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '<') {
      token = { type: TOKEN_OP, value: '<', args: 2, action: E.operators["<"], assoc: 'ltr', prec: 10, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '/') {
      token = { type: TOKEN_OP, value: '/', args: 2, action: E.operators["/"], assoc: 'ltr', prec: 15, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '%') {
      token = { type: TOKEN_OP, value: '%', args: 2, action: E.operators["%"], assoc: 'ltr', prec: 15, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '*') {
      token = { type: TOKEN_OP, value: '*', args: 2, action: E.operators["*"], assoc: 'ltr', prec: 15, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '+') {
      token = { type: TOKEN_OP, value: '+', args: 2, action: E.operators["+"], assoc: 'ltr', prec: 14, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '-') {
      token = { type: TOKEN_OP, value: '-', args: 2, action: E.operators["-"], assoc: 'ltr', prec: 14, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '=') {
      token = {
        type: TOKEN_OP, value: '=', args: 2, action: (a: string, b: number, symbols: SymbolMap, constSymbols: SymbolMap) => {
          if (constSymbols.has(a)) return { error: true, msg: `Cannot assign to constant value '${a}'` };
          symbols.set(a, b);
          return b;
        }, assoc: 'rtl', prec: 3, pos: i
      } as IOperator;
      i += 1;
    } else if (source[i] === ',') {
      token = { type: TOKEN_OP, value: ',', args: 2, action: (a: string, b: number) => b, assoc: 'ltr', prec: 1, pos: i } as IOperator;
      i += 1;
    } else if (source[i] === '(' || source[i] === ')') {
      token = { type: TOKEN_OP, value: source[i], pos: i } as IOperator;
      i += 1;
    } else {
      if (/[A-Za-z_$]/.test(source[i])) {
        let j = i, symbol = source[i++];
        while (source[i] && /[A-Za-z$_0-9]/.test(source[i])) symbol += source[i++];
        token = { type: TOKEN_SYM, value: symbol, pos: j } as IToken;
      } else {
        let nobj = parseNumber(source.substring(i), E.numberOpts);
        if (nobj.str.length !== 0) {
          token = { type: TOKEN_NUM, value: nobj.imag ? new Complex(0, nobj.num) : nobj.num, pos: i } as IToken;
          i += nobj.str.length;
        }
      }
    }

    if (token) {
      tokens.push(token);
    } else {
      tokens.length = 0;
      return { error: true, pos: i, msg: `Unknown token encountered '${source[i]}'` } as IParseError;
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
            OP.action = E.operators['u-'];
            OP.assoc = 'rtl';
            OP.prec = 17;
          } else if (OP.value === '+') {
            OP.args = 1;
            OP.action = E.operators['u+'];
            OP.assoc = 'rtl';
            OP.prec = 17;
          }
        }
      }
    }
  }

  return { error: false, tokens } as IParseSuccess;
}

/** Given an array of tokens, identify and extract call operators */
function parseTokenCallOpts(tokens: Tokens, E: Expression): IParseSuccess | IParseError {
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
      if (open > 0) return { error: true, pos: i, msg: `Unclosed parenthesis (expected ${open} * ')' at position ${i})` } as IParseError;
      let args: Tokens[] = [[]];
      let o = parseTokenCallOpts(contents, E);
      if (o.error) return o;
      o.tokens.forEach((T: Token) => {
        if (T.type === TOKEN_OP && T.value === ',') args.push([]);
        else args[args.length - 1].push(T);
      });
      args = args.filter(ar => ar.length > 0).map(ar => tokensToRPN(ar));
      const getlen = (t: Tokens) => t.reduce((p, c) => p + (c.len ?? 1), 0);
      let op = { type: TOKEN_OP, value: '()', args: 1, assoc: 'ltr', prec: 20, action: undefined, data: args, len: getlen(contents) + 2, pos: i + 1 } as IOperator;
      tokens.splice(j + 1, op.len as number, op);
      ++i;
    } else {
      ++i;
    }
  }

  return { error: false, tokens } as IParseSuccess;
}

/** Given array of tokens, make tokens to RPN form */
function tokensToRPN(original: Tokens) {
  const stack: Tokens = [], tokens: Tokens = [];
  for (let i = 0; i < original.length; ++i) {
    const token = original[i];
    if (token.type === TOKEN_OP) {
      const OP = token as IOperator;
      if (OP.value === '(') {
        stack.push(token);
      } else if (OP.value === ')') {
        while (stack.length > 0 && !(stack[stack.length - 1].type === TOKEN_OP && stack[stack.length - 1].value === '(')) {
          tokens.push(stack.pop() as Token);
        }
        stack.pop(); // Remove ) from stack
      } else {
        if (OP.assoc === 'ltr') {
          while (stack.length !== 0 && getPrecedence(original[i]) <= getPrecedence(stack[stack.length - 1])) tokens.push(stack.pop() as Token);
        } else {
          while (stack.length !== 0 && getPrecedence(original[i]) < getPrecedence(stack[stack.length - 1])) tokens.push(stack.pop() as Token);
        }
        stack.push(OP);
      }
    } else {
      tokens.push(token);
    }
  }
  while (stack.length !== 0) tokens.push(stack.pop() as Token); // DUMP
  return tokens;
}

/** Parse an array of tokens to a numerical result. Returns value, or undefined. If there was an error, E.error will be populated */
function evaluateExpression(tokens: Tokens, E: Expression): ReturnValue {
  if (tokens.length === 0) return void (E.error = { error: true, msg: `Empty expression` } as IEvaluationError);
  // EVALUATE
  const stack: Tokens = [];
  for (let i = 0; i < tokens.length; ++i) {
    const T = tokens[i];
    if (T.type === TOKEN_NUM) stack.push(T);
    else if (T.type === TOKEN_SYM) stack.push(T);
    else if (T.type === TOKEN_OP) {
      const OP = T as IOperator;
      if (OP.value === '(' || OP.value === ')') return void (E.error = { error: true, token: T, msg: `Unbalanced parenthesis '${OP.value}' at position ${i}` } as IEvaluationError);
      if (OP.args === undefined) return void (E.error = { error: true, token: T, msg: `Unexpected operator '${OP.value}' at position ${i}` } as IEvaluationError);
      if (stack.length < OP.args) return void (E.error = { error: true, token: T, msg: `Stack underflow whilst executing operator ${OP.value} (expects ${OP.args} args, got ${stack.length})` } as IEvaluationError);
      let argTokens = stack.splice(stack.length - OP.args), args: any[] = [];
      for (let j = 0; j < argTokens.length; ++j) {
        let T = argTokens[j];
        if (T.type === TOKEN_NUM) {
          args.push(T.value); // Push numeric constant
        } else if (T.type === TOKEN_SYM) {
          if (j === 0 && OP.value === '=') args.push(T.value); // Push the symbol itself
          else if (T.value === E.numberOpts.imag) args.push(Complex.I); // Imaginary unit
          else if (E.hasSymbol(T.value)) args.push(E.getSymbol(T.value));
          else if (E.constSymbols.has(T.value)) args.push(E.constSymbols.get(T.value));
          else return void (E.error = { error: true, token: T, msg: `Unbound symbol '${T.value}' referenced in operator '${OP.value}'` } as IEvaluationError);
        } else {
          return void (E.error = { error: true, token: T, msg: `Invalid token type in operator '${OP.value}'` } as IEvaluationError);
        }
      }
      if (E.numberOpts.imag) args = args.map(z => typeof z === 'number' ? new Complex(z) : z); // Ensure all data values are Complex
      let val: ReturnValue;
      if (OP.action) {
        val = OP.action(...args, E);
      } else if (OP.value === '()') {
        // CALL
        const f = args[0];
        if (typeof f !== 'function') return void (E.error = { error: true, token: OP, msg: `Operator '()' used on non-callable '${f}'` } as IEvaluationError);
        const argValues: any[] = [];
        for (let arg of OP.data) {
          let a = evaluateExpression(arg, E);
          if (E.error) return; // Propagate error
          argValues.push(a);
        }
        let x = f(...argValues, E) as ReturnValue;
        if (typeof x === 'number') val = E.numberOpts.imag ? new Complex(x) : x;
        else if (x == undefined) val = E.numberOpts.imag ? new Complex(0) : 0;
        else val = x;
      } else {
        return void (E.error = { error: true, token: OP, msg: `Unknown operator '${OP.value}'` } as IEvaluationError);
      }
      if (E.error) return; // Propagate error
      stack.push({ type: TOKEN_NUM, value: val } as IToken);
    }
  }

  if (stack.length > 1) return void (E.error = { error: true, token: stack[1], msg: `Expected one item to be in result stack, got ${stack.length}` } as IEvaluationError);
  let value: any;
  if (stack[0].type === TOKEN_NUM) value = stack[0].value;
  else if (stack[0].type === TOKEN_SYM) {
    if (stack[0].value === E.numberOpts.imag) value = Complex.I as any;
    else if (E.hasSymbol(stack[0].value)) value = E.getSymbol(stack[0].value);
    else if (E.constSymbols.has(stack[0].value)) value = E.constSymbols.get(stack[0].value);
    else return void (E.error = { error: true, token: stack[0], msg: `Unbound symbol referenced '${stack[0].value}'` } as IEvaluationError);
  } else {
    return void (E.error = { error: true, token: stack[0], msg: `Unterminal token in result stack` } as IEvaluationError);
  }
  if (typeof value === 'number' && E.numberOpts.imag) value = Complex.parse(value);
  return value;
}

/** Given error object, return string representation (returns '' if not an error) */
export function errorToString(error: ExprError) {
  if (error) {
    if (error.hasOwnProperty("token")) {
      let e = error as IEvaluationError;
      return `[!] ${e.msg}` + (e.token ? ` [position ${e.token.pos}]` : '');
    } else {
      let e = error as IParseError;
      return `[!] ${e.msg}` + (e.pos === undefined ? '' : ` [position ${e.pos}]`);
    }
  } else {
    return "";
  }
}

const TOKEN_OP = 1;
const TOKEN_NUM = 2;
const TOKEN_SYM = 4;

type Token = IToken | IOperator;
type Tokens = Array<Token>;
type SymbolMap = Map<string, number | Function>;
type ReturnValue = number | Complex | undefined;
type ExprError = IParseError | IEvaluationError | undefined;

/** 
 * Creates an expression, which may be parsed and executed.
 * 
 * Expression.numberOpts allows customision on numerical parsing.
*/
export class Expression {
  private _raw: string;
  private _tokens: Tokens;
  private _symbols: SymbolMap = new Map();
  public constSymbols: SymbolMap = new Map(); // Symbols whose values are not changed
  public operators: IOperatorMap = OPERATORS_DEFAULT; // Operators to be used in parsing
  public error: ExprError; // Current error
  public readonly numberOpts: IParseNumberOptions;

  constructor(expr = '') {
    this._raw = expr;
    this._tokens = [];
    this.numberOpts = {
      exponent: true, // Allow exponent e.g. "1e2"
      decimal: true, // Allow decimal places e.g. "0.3"
      seperator: '_', // Numeric seperator e.g. "1_000" -> 1000
      signed: false, // Dont scan for +/- sign
      imag: undefined, // Disallow
    };
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

  /** Set value of given symbol */
  public setSymbol(name: string, value: number | Function) {
    this._symbols.set(name, value);
    return this;
  }

  /** Does the given symbol exist? */
  public hasSymbol(name: string) {
    return this._symbols.has(name);
  }

  /** Get value of given symbol, or undefined */
  public getSymbol(name: string) {
    return this._symbols.get(name);
  }

  /** Delete given symbol */
  public delSymbol(name: string) {
    this._symbols.delete(name);
    return this;
  }

  /** Set internal error object (NB overrides current error if there is one) */
  public setError(msg: string, pos: number) {
    this.error = { error: true, msg, pos };
  }

  /** Parse raw to token array */
  public parse() {
    this.error = undefined;
    this._tokens.length = 0;
    const o = parseExpression(this._raw, this);
    if (o.error) {
      this.error = o; // !ERROR!
    } else {
      this._tokens = o.tokens;
      const tokens = tokensToRPN(this._tokens);
      this._tokens = tokens;
      o.tokens = tokens;
    }
    return this;
  }

  /** Evaluate parsed string. */
  public evaluate() {
    if (this.error) return;
    return evaluateExpression(this._tokens, this);
  }

  /** Return new Expression, copying symbolMap */
  public copy(expr = undefined) {
    let E = new Expression(expr);
    this._symbols.forEach((v, k) => E._symbols.set(k, v));
    return E;
  }
} 