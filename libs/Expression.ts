import { Complex } from "./maths/Complex";
import { IParseNumberOptions, parseNumber } from "./utils";

//#region TYPES
/** Describes a Token */
interface IToken {
  type: number;
  value: any;
  pos: number; // Original position in string
  posend: number; // Ending position
  tlen?: number; // Length of tokens condensed to make this one. default=1
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

/** Represents an item in the callstack */
interface ICallStackItem {
  name: string; // Function name
  symbols: SymbolMap;
  token?: Token; // Invoker token
}

/** Object describing a user-defined function */
export interface IFunction {
  type: "fn";
  args: string[]; // array of arguments
  defaults?: (SymbolValue | undefined)[]; // Default arguments: if args[i] not provided, defaults[i] is used
  body: string; // valid string expression
  tokens?: Tokens | undefined; // parsed this.body
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
  "u-": (z: Complex) => z.neg(),
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
      token = { type: TOKEN_OP, value: '**', args: 2, action: E.operators["**"], assoc: 'rtl', prec: 16, pos: i, posend: i + 1 } as IOperator;
      i += 2;
    } else if (source[i] === '=' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '==', args: 2, action: E.operators["=="], assoc: 'ltr', prec: 9, pos: i, posend: i + 1 } as IOperator;
      i += 2;
    } else if (source[i] === '!' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '!=', args: 2, action: E.operators["!="], assoc: 'ltr', prec: 9, pos: i, posend: i + 1 } as IOperator;
      i += 2;
    } else if (source[i] === '<' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '<=', args: 2, action: E.operators["<="], assoc: 'ltr', prec: 10, pos: i, posend: i + 1 } as IOperator;
      i += 2;
    } else if (source[i] === '>' && source[i + 1] === '=') {
      token = { type: TOKEN_OP, value: '>=', args: 2, action: E.operators[">="], assoc: 'ltr', prec: 10, pos: i, posend: i + 1 } as IOperator;
      i += 2;
    } else if (source[i] === '!') {
      token = { type: TOKEN_OP, value: '!', args: 1, action: E.operators["!"], assoc: 'rtl', prec: 17, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '>') {
      token = { type: TOKEN_OP, value: '>', args: 2, action: E.operators[">"], assoc: 'ltr', prec: 10, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '<') {
      token = { type: TOKEN_OP, value: '<', args: 2, action: E.operators["<"], assoc: 'ltr', prec: 10, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '/') {
      token = { type: TOKEN_OP, value: '/', args: 2, action: E.operators["/"], assoc: 'ltr', prec: 15, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '%') {
      token = { type: TOKEN_OP, value: '%', args: 2, action: E.operators["%"], assoc: 'ltr', prec: 15, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '*') {
      token = { type: TOKEN_OP, value: '*', args: 2, action: E.operators["*"], assoc: 'ltr', prec: 15, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '+') {
      token = { type: TOKEN_OP, value: '+', args: 2, action: E.operators["+"], assoc: 'ltr', prec: 14, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '-') {
      token = { type: TOKEN_OP, value: '-', args: 2, action: E.operators["-"], assoc: 'ltr', prec: 14, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '=') {
      token = {
        type: TOKEN_OP, value: '=', args: 2, action: (a: string, b: number, E: Expression) => {
          E.setSymbol(a, b);
          return b;
        }, assoc: 'rtl', prec: 3, pos: i, posend: i
      } as IOperator;
      i += 1;
    } else if (source[i] === ',') {
      token = { type: TOKEN_OP, value: ',', args: 2, action: (a: string, b: number) => b, assoc: 'ltr', prec: 1, pos: i, posend: i } as IOperator;
      i += 1;
    } else if (source[i] === '(' || source[i] === ')') {
      token = { type: TOKEN_OP, value: source[i], pos: i, posend: i } as IOperator;
      i += 1;
    } else {
      if (/[A-Za-z_$]/.test(source[i])) {
        let j = i, symbol = source[i++];
        while (source[i] && /[A-Za-z$_0-9]/.test(source[i])) symbol += source[i++];
        token = { type: TOKEN_SYM, value: symbol, pos: j, posend: i - 1 } as IToken;
      } else {
        let nobj = parseNumber(source.substring(i), E.numberOpts);
        if (nobj.str.length !== 0) {
          token = { type: TOKEN_NUM, value: nobj.imag ? new Complex(0, nobj.num) : nobj.num, pos: i, posend: i + nobj.str.length } as IToken;
          i += nobj.str.length;
        }
      }
    }

    if (token) {
      tokens.push(token);
    } else {
      tokens.length = 0;
      return { error: true, pos: i, posend: i, msg: `Unknown token encountered '${source[i]}'` } as IParseError;
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
      const j = i;
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
      const getlen = (t: Tokens) => t.reduce((p, c) => p + (c.tlen ?? 1), 0);
      let op = { type: TOKEN_OP, value: '()', args: 1, assoc: 'ltr', prec: 20, action: undefined, data: args, tlen: getlen(contents) + 2, pos: tokens[j].pos, posend: tokens[i].posend } as IOperator;
      tokens.splice(j + 1, op.tlen as number, op);
      i = j + 2;
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
          else return void (E.error = { error: true, token: T, msg: `Unbound symbol '${T.value}' referenced in operator '${OP.value}'` } as IEvaluationError);
        } else {
          return void (E.error = { error: true, token: T, msg: `Invalid token type in operator '${OP.value}'` } as IEvaluationError);
        }
      }
      if (E.numberOpts.imag) args = args.map(z => typeof z === 'number' ? new Complex(z) : z); // Ensure all data values are Complex
      let val: ReturnValue;
      if (OP.action) {
        if (OP.value === '=' && E.constSymbols.has(args[0])) return void (E.error = { error: true, token: argTokens[0], msg: `Cannot assign to constant symbol '${args[0]}'` });
        val = OP.action(...args, E);
      } else if (OP.value === '()') {
        // CALL
        const f = args[0];
        E.push(argTokens[0].value, OP); // PUSH CALLSTACK
        const argValues: any[] = [];
        for (let arg of OP.data) {
          let a = evaluateExpression(arg, E);
          if (E.error) return; // Propagate error
          argValues.push(a);
        }
        let x: ReturnValue;
        if (typeof f === 'function') {
          try {
            x = f(...argValues, E);
          } catch (e) {
            E.error = { error: true, msg: e instanceof Error ? e.message : (e as any).toString(), token: OP };
            return;
          }
        } else if (typeof f === 'object' && f.type === 'fn') {
          const fn = f as IFunction;
          if (!fn.tokens) E.parseSymbol(argTokens[0].value); // Parse on the fly
          if (argValues.length > fn.args.length) {
            E.pop();
            return void (E.error = { error: true, token: OP, msg: `Function ${argTokens[0].value} expected ${fn.args.length} arguments, got ${argValues.length}` });
          }
          for (let i = 0; i < fn.args.length; ++i) {
            if (argValues[i] === undefined && (fn.defaults === undefined || fn.defaults[i] === undefined)) {
              E.pop();
              return void (E.error = { error: true, token: OP, msg: `Function ${argTokens[0].value}: no value provided for argument '${fn.args[i]}'` });
            }
            E.defSymbol(fn.args[i], argValues[i] ?? (fn.defaults as SymbolValue[])[i]);
          }
          x = evaluateExpression(fn.tokens as Tokens, E);
          if (E.error) return; // Propagate error
        } else {
          return void (E.error = { error: true, token: OP, msg: `Operator '()' used on non-callable '${f}'` } as IEvaluationError);
        }
        if (typeof x === 'number') val = E.numberOpts.imag ? new Complex(x) : x;
        else if (x == undefined) val = E.numberOpts.imag ? new Complex(0) : 0;
        else val = x;
        E.pop(); // POP CALLSTACK
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
type SymbolValue = number | Complex | Function | IFunction; // Value of a symbol
type SymbolMap = Map<string, SymbolValue>;
type ReturnValue = number | Complex | undefined; // Return valid from evaluate()
type ExprError = IParseError | IEvaluationError | undefined; // Error types

/** 
 * Creates an expression, which may be parsed and executed.
 * 
 * Expression.numberOpts allows customision on numerical parsing.
 * 
 * Values may be numbers, Complex instanced, Functions, or objects (IFunction) which behave as a function.
 * When changes are made to IFunction.source, call Expression.parseSymbol(<name>) to update it, otherwise the change WILL NOT take effect.
*/
export class Expression {
  public source: string;
  private _tokens: Tokens;
  public constSymbols: SymbolMap = new Map(); // Symbols whose values are not changed
  public operators: IOperatorMap = OPERATORS_DEFAULT; // Operators to be used in parsing
  public error: ExprError; // Current error
  public callstack: ICallStackItem[] = [];
  public readonly numberOpts: IParseNumberOptions;

  constructor(expr = '') {
    this.source = expr;
    this._tokens = [];
    this.numberOpts = {
      exponent: true, // Allow exponent e.g. "1e2"
      decimal: true, // Allow decimal places e.g. "0.3"
      seperator: '_', // Numeric seperator e.g. "1_000" -> 1000
      signed: false, // Dont scan for +/- sign
      imag: undefined, // Disallow
    };
    this.callstack.push({ name: '_MAIN', symbols: new Map() }); // Initialise call stack
  }

  /** Reset symbol map and expression data */
  public reset() {
    this._tokens.length = 0;
    this.callstack.length = 1;
    this.callstack[0].symbols.clear();
    return this;
  }

  /** Load new raw expression string */
  public load(expr: string) {
    this._tokens.length = 0;
    this.source = expr;
    return this;
  }

  /** Define given symbol in topmost scope */
  public defSymbol(name: string, value: SymbolValue = 0) {
    if (this.constSymbols.has(name)) throw new Error(`Cannot re-use constant symbol '${name}'`);
    this.callstack[this.callstack.length - 1].symbols.set(name, value);
    return this;
  }

  /** Set value of existing symbol to a value. If symbol does not exist, create it in the topmost scope. */
  public setSymbol(name: string, value: SymbolValue) {
    if (this.callstack.length === 0) return this;
    if (this.constSymbols.has(name)) throw new Error(`Cannot assign to constant '${name}'`);
    for (let i = this.callstack.length - 1; i >= 0; --i) {
      if (this.callstack[i].symbols.has(name)) {
        this.callstack[i].symbols.set(name, value);
        return this;
      }
    }
    this.callstack[this.callstack.length - 1].symbols.set(name, value);
    return this;
  }

  /** Does the given symbol exist? */
  public hasSymbol(name: string) {
    return this.constSymbols.has(name) || this.callstack.some(({ symbols }) => symbols.has(name));
  }

  /** Get value of given symbol, or undefined */
  public getSymbol(name: string) {
    if (this.constSymbols.has(name)) return this.constSymbols.get(name);
    for (let i = this.callstack.length - 1; i >= 0; --i) {
      if (this.callstack[i].symbols.has(name)) {
        return this.callstack[i].symbols.get(name);
      }
    }
    return undefined;
  }

  /** Delete first occurence of a given symbol */
  public delSymbol(name: string) {
    if (this.constSymbols.has(name)) {
      this.constSymbols.delete(name);
      return this;
    }
    for (let i = this.callstack.length - 1; i >= 0; --i) {
      if (this.callstack[i].symbols.has(name)) {
        this.callstack[i].symbols.delete(name);
        break;
      }
    }
    return this;
  }

  /** Set internal error object (NB overrides current error if there is one) */
  public setError(msg: string, pos: number) {
    this.error = { error: true, msg, pos };
  }

  /**
   * Handle the error:
   * - Empty call stack
   * - Remove error flag
   * - Return error as string
  */
  public handleError() {
    if (this.error) {
      let msg = errorToString(this.error);
      if (this.error && (this.error as IEvaluationError).token) {
        const e = this.error as IEvaluationError;
        const fname = this.callstack[this.callstack.length - 1].name, fval = this.getSymbol(fname);
        let source = fval && typeof fval === "object" && (fval as any).type === "fn" ? (fval as IFunction).body : this.source;
        let snippet = source.substring(e.token.pos, e.token.posend + 1);
        msg += '\n  ' + snippet + '\n  ' + '~'.repeat(snippet.length);
      }

      const stack: string[] = [];
      for (let i = 0; i < this.callstack.length; i++) {
        let frame = this.callstack[i], str = `In function <${frame.name}>`;
        if (frame.token) {
          str += ` at position ${frame.token.pos}:`;
          const fname = this.callstack[i - 1]?.name, fval = fname ? this.getSymbol(fname) : undefined;
          let source = fval && typeof fval === "object" && (fval as any).type === "fn" ? (fval as IFunction).body : this.source;
          let snippet = source.substring(frame.token.pos, frame.token.posend + 1);
          str += '\n  ' + snippet + '\n  ' + '~'.repeat(snippet.length);
        } else {
          str += ':';
        }
        stack.push(str);
      }
      this.callstack.length = 1;
      this.error = undefined;
      return stack.join("\n") + "\n" + msg;
    } else {
      return;
    }
  }

  /** Push iterm to the call stack */
  public push(name: string, invoker?: Token) {
    this.callstack.push({ name, symbols: new Map(), token: invoker });
    return this;
  }

  /** Pop item from the call stack */
  public pop() {
    this.callstack.pop();
    return this;
  }

  /** Parse a symbol (i.e. a user-defined function) */
  public parseSymbol(name: string) {
    if (this.hasSymbol(name)) {
      const value = this.getSymbol(name);
      if (typeof value === "object" && (value as any).type === "fn") {
        const fn = value as IFunction;
        let o = parseExpression(fn.body, this);
        if (o.error) {
          this.error = o;
        } else {
          fn.tokens = tokensToRPN(o.tokens);
        }
      }
    }
    return this;
  }

  /** call this.parseSymbol on every elligible symbol */
  public parseAllSymbols() {
    this.constSymbols.forEach((_, name) => this.parseSymbol(name));
    for (let i = this.callstack.length - 1; i >= 0; --i) {
      this.callstack[i].symbols.forEach((_, name) => this.parseSymbol(name));
    }
  }

  /** Parse raw to token array */
  public parse() {
    this.error = undefined;
    this.callstack.length = 1;
    this._tokens.length = 0;

    const o = parseExpression(this.source, this);
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
} 