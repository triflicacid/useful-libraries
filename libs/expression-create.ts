import { Expression, OPERATORS_DEFAULT, OPERATORS_IMAG } from "./Expression";
import { Complex } from "./maths/Complex";
import * as constants from "./maths/constants";
import { lambertw } from "./maths/lambertw";
import { wrightomega_ext } from "./maths/wright-omega";

/** Return new Expression */
export function createExpression(expr?: string) {
  const E = new Expression();
  const parse = (expr: string) => E.load(expr).parse(OPERATORS_DEFAULT);
  gen_vars(E);
  real_funcs(E);
  if (expr) parse(expr);
  return { expr: E, parse };
}

/** Return new Expression for complex numbers */
export function createComplexExpression(expr?: string) {
  const E = new Expression();
  const parse = (expr: string) => E.load(expr).parse(OPERATORS_IMAG);
  E.numberOpts.imag = 'i';
  gen_vars(E);
  cplx_funcs(E);
  if (expr) parse(expr);
  return { expr: E, parse };
}

/** Load generic variables */
function gen_vars(E: Expression) {
  E.setSymbol("pi", constants.PI);
  E.setSymbol("e", constants.E);
  E.setSymbol("omega", constants.OMEGA);
  E.setSymbol("phi", constants.PHI);
  E.setSymbol("ln2", Math.LN2);
  E.setSymbol("sqrt2", Math.SQRT2);
}

/** Load real functions */
function real_funcs(E: Expression) {
  E.setSymbol("cos", Math.cos);
  E.setSymbol("cosh", Math.cosh);
  E.setSymbol("arccos", Math.acosh);
  E.setSymbol("arcosh", Math.acosh);
  E.setSymbol("sin", Math.sin);
  E.setSymbol("sinh", Math.sinh);
  E.setSymbol("arcsin", Math.asin);
  E.setSymbol("arsinh", Math.asinh);
  E.setSymbol("tan", Math.tan);
  E.setSymbol("tanh", Math.tanh);
  E.setSymbol("arctan", Math.atan);
  E.setSymbol("artanh", Math.atanh);
  E.setSymbol("sqrt", Math.sqrt);
  E.setSymbol("cbrt", Math.cbrt);
  E.setSymbol("exp", Math.exp);
  E.setSymbol("ln", Math.log);
}

/** Load complex functions */
function cplx_funcs(E: Expression) {
  E.setSymbol("Re", (z: Complex) => z.a);
  E.setSymbol("Im", (z: Complex) => z.b);
  E.setSymbol("cos", Complex.cos);
  E.setSymbol("cosh", Complex.cosh);
  E.setSymbol("arccos", Complex.arccos);
  E.setSymbol("arcosh", Complex.arccosh);
  E.setSymbol("sin", Complex.sin);
  E.setSymbol("sinh", Complex.sinh);
  E.setSymbol("arcsin", Complex.arcsin);
  E.setSymbol("arsinh", Complex.arcsinh);
  E.setSymbol("tan", Complex.tan);
  E.setSymbol("tanh", Complex.tanh);
  E.setSymbol("arctan", Complex.arctan);
  E.setSymbol("artanh", Complex.arctanh);
  E.setSymbol("arg", (z: Complex) => z.getArg());
  E.setSymbol("conj", (z: Complex) => z.conjugate());
  E.setSymbol("sqrt", Complex.sqrt);
  E.setSymbol("cbrt", Complex.cbrt);
  E.setSymbol("exp", Complex.exp);
  E.setSymbol("ln", Complex.log);
  E.setSymbol("lambertw", (z: Complex, k?: Complex, tol?: Complex) => lambertw(z, k?.a, tol?.a));
  E.setSymbol("wrightomega", (z: Complex) => wrightomega_ext(z));
}