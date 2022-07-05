/** [!] http://www.mymathlib.com/functions/riemann_zeta.html#dirichlet_lambda */

import { riemannZetaStar } from "./riemann-zeta";

const MAX = 1.7976931348623158e+308;

/** Common notation for the Dirichlet Lambda function */
export const SYMBOL = "λ";

/**
 * Calculates the Dirichlet Lambda function, defined as lambda(s) = Sum (1/(2k+1)^2)
 * 
 * NB lambda(s) = (zeta(s) + eta(s)) / 2
 */
export function dirichletLambda(s: number) {
  if (s === 1) return Infinity;
  return 1 + dirichletLambdaStar(s);
}

/**
 * Calculates the Dirichlet Lambda Star function, defined as lambda*(s) = lambda(s) - 1
 * 
 * NB lambda*(s) = (zeta*(s) + eta*(s)) / 2
 */
export function dirichletLambdaStar(s: number) {
  if (s === 0) return -1;
  return s > 0 ? dls_positive(s) : dls_negative(s);
}

/**
 * Calculate the Dirichlet Lambda Star function for s > 1
 * 
 * lambda(s) = Sum (1/(2k+1)^s)
 * 
 * lambda*(s) = [(2^s-1)/(2^s)] * zeta*(s) - 1/2^s
 */
function dls_positive(s: number) {
  if (s === 1) return Infinity;
  let zstar = riemannZetaStar(s);
  if (zstar > 1024) return zstar; // Maximum float exponent
  let two_s = Math.pow(2, s);
  return ((two_s - 1) / zstar - 1) / two_s;
}

/**
 * Calculate the Dirichlet Lambda Star function for s < 0
 * 
 * lambda*(s) = [(2^s-1)/(2^s)] * zeta*(s) - 1/2^s
 */
function dls_negative(s: number) {
  let zstar = riemannZetaStar(s);
  if (Math.abs(zstar) >= MAX) return -zstar;
  let two_ms = Math.pow(2, -s);
  if (Math.abs(zstar) > (MAX / (two_ms - 1))) return (zstar < 0) ? Infinity : -Infinity;
  let lambdaStar = (1 - two_ms) * zstar;
  if (lambdaStar > 0) return lambdaStar - two_ms;
  if (lambdaStar < (two_ms - MAX)) return -Infinity;
  return lambdaStar - two_ms;
}