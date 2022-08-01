import { Expression, OPERATORS_IMAG } from "./Expression";
import { Complex } from "./maths/Complex";
import * as constants from "./maths/constants";

/** Return new Expression */
export function createExpression(expr?: string) {
  const E = new Expression(expr);
  gen_vars(E);
  real_funcs(E);
  return E;
}

/** Return new Expression for complex numbers */
export function createComplexExpression(expr?: string) {
  const E = new Expression(expr);
  E.numberOpts.imag = 'i';
  E.operators = OPERATORS_IMAG;
  gen_vars(E);
  cplx_funcs(E);
  return E;
}

/** Load generic variables */
function gen_vars(E: Expression) {
  E.constSymbols.set("pi", constants.PI);
  E.constSymbols.set("e", constants.E);
  E.constSymbols.set("omega", constants.OMEGA);
  E.constSymbols.set("phi", constants.PHI);
  E.constSymbols.set("ln2", Math.LN2);
  E.constSymbols.set("sqrt2", Math.SQRT2);
}

/** Load real functions */
function real_funcs(E: Expression) {
  E.constSymbols.set("abs", Math.abs);
  E.constSymbols.set("cos", Math.cos);
  E.constSymbols.set("cosh", Math.cosh);
  E.constSymbols.set("arccos", Math.acosh);
  E.constSymbols.set("arcosh", Math.acosh);
  E.constSymbols.set("sin", Math.sin);
  E.constSymbols.set("sinh", Math.sinh);
  E.constSymbols.set("arcsin", Math.asin);
  E.constSymbols.set("arsinh", Math.asinh);
  E.constSymbols.set("tan", Math.tan);
  E.constSymbols.set("tanh", Math.tanh);
  E.constSymbols.set("arctan", Math.atan);
  E.constSymbols.set("artanh", Math.atanh);
  E.constSymbols.set("sqrt", Math.sqrt);
  E.constSymbols.set("cbrt", Math.cbrt);
  E.constSymbols.set("exp", Math.exp);
  E.constSymbols.set("log", Math.log);
}

/** Load complex functions */
function cplx_funcs(E: Expression) {
  E.constSymbols.set("Re", (z: Complex) => z.a);
  E.constSymbols.set("Im", (z: Complex) => z.b);
  E.constSymbols.set("abs", Complex.abs);
  E.constSymbols.set("cos", Complex.cos);
  E.constSymbols.set("cosh", Complex.cosh);
  E.constSymbols.set("arccos", Complex.arccos);
  E.constSymbols.set("arcosh", Complex.arccosh);
  E.constSymbols.set("sin", Complex.sin);
  E.constSymbols.set("sinh", Complex.sinh);
  E.constSymbols.set("arcsin", Complex.arcsin);
  E.constSymbols.set("arsinh", Complex.arcsinh);
  E.constSymbols.set("tan", Complex.tan);
  E.constSymbols.set("tanh", Complex.tanh);
  E.constSymbols.set("arctan", Complex.arctan);
  E.constSymbols.set("artanh", Complex.arctanh);
  E.constSymbols.set("arg", (z: Complex) => z.getArg());
  E.constSymbols.set("conj", (z: Complex) => z.conjugate());
  E.constSymbols.set("sqrt", Complex.sqrt);
  E.constSymbols.set("cbrt", Complex.cbrt);
  E.constSymbols.set("exp", Complex.exp);
  E.constSymbols.set("log", Complex.log);
}