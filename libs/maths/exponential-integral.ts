import { DBL_EPSILON, EULER_MASCHERONI } from "./constants";

/**! Mathmatical functions adapted from http://www.mymathlib.com/functions/exponential_integrals.html */

const epsilon = DBL_EPSILON * 10;
const gamma = EULER_MASCHERONI;

/**
 * Evaluates the Exponential Integral function, which is defined
 * to be the integral between -inf and x of exp(t) / t
 */
export function exponentialIntegral(x: number) {
  if (x < -5) return ei_continuedFraction(x);
  if (x === 0) return -Infinity;
  if (x < 6.8) return ei_powerSeries(x);
  if (x < 50) return ei_ArgAdditionSeries(x);
  return ei_continuedFraction(x);
}

/**
 * Evaluates the Entire Exponential Integral function, which is defined
 * to be the integral between 0 x of (1 - exp(-t)) / t
 * 
 * For x != 0, Ein(x) = gamma + ln|x| - Ei(-x)
 */
export function exponentialIntegralEntire(x: number) {
  if (x === 0) return 0;
  return gamma + Math.log(Math.abs(x)) - exponentialIntegral(-x);
}

/**
 * Evaluates the Schloemilch Exponential Integral function, which is defined as
 * the integral between 1 to inf of exp(-xt) / t^n
 */
export function exponentialIntegralN(x: number, n: number) {
  if (x < 0) return Infinity;
  if (x === 0) return n < 2 ? Infinity : 1 / (n - 1);

  let exp_x = Math.exp(-x);
  if (n === 0) return (exp_x / x);

  let e1 = -exponentialIntegral(-x);
  if (n === 1) return e1;
  if ((x + n) >= 20) return en_continuedFraction(x, n, exp_x);
  if (x <= 1) return en_powerSeries(x, n);
  return en_continuedFraction(x, n, exp_x);
}

/**
 * Evaluates the Alpha Exponential Integral, which is defined as the integral
 * between 1->inf of t^n * exp(-xt), x is Real, n is 0, 1, 2, ...
 * 
 * - For x <= 0, I = inf
 * - For x > 0, I is defined recursively as I(x,n) = (n/x)I(x,n-1) + I(x,0)
 */
export function exponentialIntegralAlpha(x: number, n: number) {
  let a0 = 0, an = 0, xm = 0, m = 0, nx = 0;

  if (x <= 0) return Infinity; // Diverges

  a0 = Math.exp(-x) / x; // I(x,0)
  if (n === 0) return a0;
  if (x < 1) {
    an = a0 + x * a0;
    an = 1 / an;
    an = x * an;
    an = 1 / an;
  } else {
    an = a0 / x + a0;
  }
  if (n === 1) return an;

  nx = parseInt(x as any);
  if (n < nx) nx = x;
  for (; m <= n; m++) {
    xm = x / m;
    an += xm * a0;
    an = 1 / an;
    an = xm * an;
    an = 1 / an;
  }

  return an;
}

/**
 * Evaluates the Beta Exponential Integral, which is defined as the integral
 * between -1->1 of t^n * exp(-xt), x is Real, n is 0, 1, 2, ...
 * 
 * - If n is odd, beta_n(x) = ( n / x ) beta_(n-1)(x) - (2/x) cosh(x)
 * 
 *  beta_n(x) = -2 x/(n+2) + 2 x^3/[(3)!(n+4)] + ... + 2 x^(2i+1)/[(2i+1)!(n+2i+2)] + ...
 * - If n is even, beta_n(x) = ( n / x ) beta_(n-1)(x) + (2/x) sinh(x)
 * 
 *  beta_n(x) = 2/(n+1) + 2 x^2/[(2)!(n+3)] + ... + 2 x^(2i)/[(2i)!(n+2i+1)] + ...
 */
export function exponentialIntegralBeta(x: number, n: number) {
  if (x === 0) return n % 2 === 0 ? 2 / (n + 1) : 0;

  let bn = 0, c = 0, s = 0, m = 2;
  s = 2 * Math.sinh(x) / x;
  c = -2 * Math.cosh(x) / x;
  if (n === 0) return s;
  if (n <= 4) return Math.abs(x) <= 0.1 ? eib_powerSeries(x, n) : eib_recursion(x, n);
  if (n <= 5) return Math.abs(x) <= 0.4 ? eib_powerSeries(x, n) : eib_recursion(x, n);
  if (n <= 6) return Math.abs(x) <= 0.6 ? eib_powerSeries(x, n) : eib_recursion(x, n);
  if (n <= 7) return Math.abs(x) <= 1.0 ? eib_powerSeries(x, n) : eib_recursion(x, n);
  if (n <= 8) return Math.abs(x) <= 1.4 ? eib_powerSeries(x, n) : eib_recursion(x, n);
  if (n <= 9) return Math.abs(x) <= 1.7 ? eib_powerSeries(x, n) : eib_recursion(x, n);
  if (n <= 10) return Math.abs(x) <= 2.4 ? eib_powerSeries(x, n) : eib_recursion(x, n);
  return eib_powerSeries(x, n);
}

// ====== HELPER FUNCTIONS ======

/**
 * For x < -5 | x > 50, the continued fraction representation of the Exponential Integral converges
 * 
 * Ei(x) = -exp(x) * [ 1/(1-x) - 1/(3-x) - 4/(5-x) ... ]
 */
function ei_continuedFraction(x: number) {
  let Am1 = 1,
    A0 = 0,
    Bm1 = 0,
    B0 = 1,
    a = Math.exp(x),
    b = 1 - x,
    Ap1 = b * A0 + a * Am1,
    Bp1 = b * B0 + a * Bm1,
    j = 1;

  a = 1;
  while (Math.abs(Ap1 * B0 - A0 * Bp1) > epsilon * Math.abs(A0 * Bp1)) {
    if (Math.abs(Bp1) > 1) {
      Am1 = A0 / Bp1;
      A0 = Ap1 / Bp1;
      Bm1 = B0 / Bp1;
      B0 = 1;
    } else {
      Am1 = A0;
      A0 = Ap1;
      Bm1 = B0;
      B0 = Bp1;
    }
    a = -j * j;
    b += 2;
    Ap1 = b * A0 + a * Am1;
    Bp1 = b * B0 + a * Bm1;
    j += 1;
  }
  return -Ap1 / Bp1;
}

/**
 * For -5 < x < 6.8, the power series of the Exponential Integral converges
 * 
 * (Ei(x) - gamma - ln|x|) / exp(x) approx eq -sum(1 + 1/2 + ... + 1/j), j = 1 -> inf
 */
function ei_powerSeries(x: number) {
  if (x === 0) return -Infinity; // Singularity

  let xn = -x,
    Sn = -x,
    Sm1 = 0,
    hsum = 1,
    y = 1,
    factorial = 1;

  while (Math.abs(Sn - Sm1) > epsilon * Math.abs(Sm1)) {
    Sm1 = Sn;
    y += 1;
    xn *= -x;
    factorial *= y;
    hsum += 1 / y;
    Sn += hsum * xn / factorial;
  }
  return (gamma + Math.log(Math.abs(x)) - Math.exp(x) * Sn);
}

// Constants used in ei_ArgAdditionSeries
const eiaask = [
  1.915047433355013959531e2, 4.403798995348382689974e2,
  1.037878290717089587658e3, 2.492228976241877759138e3,
  6.071406374098611507965e3, 1.495953266639752885229e4,
  3.719768849068903560439e4, 9.319251363396537129882e4,
  2.349558524907683035782e5, 5.955609986708370018502e5,
  1.516637894042516884433e6, 3.877904330597443502996e6,
  9.950907251046844760026e6, 2.561565266405658882048e7,
  6.612718635548492136250e7, 1.711446713003636684975e8,
  4.439663698302712208698e8, 1.154115391849182948287e9,
  3.005950906525548689841e9, 7.842940991898186370453e9,
  2.049649711988081236484e10, 5.364511859231469415605e10,
  1.405991957584069047340e11, 3.689732094072741970640e11,
  9.694555759683939661662e11, 2.550043566357786926147e12,
  6.714640184076497558707e12, 1.769803724411626854310e13,
  4.669055014466159544500e13, 1.232852079912097685431e14,
  3.257988998672263996790e14, 8.616388199965786544948e14,
  2.280446200301902595341e15, 6.039718263611241578359e15,
  1.600664914324504111070e16, 4.244796092136850759368e16,
  1.126348290166966760275e17, 2.990444718632336675058e17,
  7.943916035704453771510e17, 2.111342388647824195000e18,
  5.614329680810343111535e18, 1.493630213112993142255e19,
  3.975442747903744836007e19, 1.058563689713169096306e20
];

/**
 * For 6.8 < x < 50, the argument addition series of the Exponential Integral converges
 * 
 * Ei(x+dx) = Ei(x) + exp(x) Sum j! [exp(j) expj(-dx) - 1] / x^(j+1), j = 0->inf, |x| > |dx|
 */
function ei_ArgAdditionSeries(x: number) {
  let k = parseInt((x + 0.5) as any),
    j = 0,
    xx = k,
    dx = x - xx,
    xxj = xx,
    edx = Math.exp(dx),
    Sm = 1,
    Sn = (edx - 1) / xxj,
    term = Infinity,
    factorial = 1,
    dxj = 1;

  while (Math.abs(term) > epsilon * Math.abs(Sn)) {
    j++;
    factorial *= j;
    xxj *= xx;
    dxj *= -dx;
    Sm += dxj / factorial;
    term = (factorial * (edx * Sm - 1)) / xxj;
    Sn += term;
  }

  return eiaask[k - 7] + Sn * Math.exp(xx);
}

/**
 * For 0 < x <= 1 and x + n < 20, the power series representation for
 * En(x) + ln(x) * (-x)^(n-1) / (n-1)! is used which approximates to
 * psi(n) * (-x)^(n-1)/(n-1)! - Sum (-x)^k / [k - (n-1)] k!, k = 0->inf excluding k=n-1
 */
function en_powerSeries(x: number, n: number) {
  let xn = 1,
    Sm1 = 0,
    factorial = 1,
    psi_n = -gamma,
    term = 1 / (1 - n),
    Sn = term,
    i;

  for (i = 1; i < n - 1; i++) {
    factorial *= i;
    psi_n += 1 / i;
    xn *= -x;
    term = xn / (factorial * (i - n + 1));
    Sn += term;
  }

  factorial *= n - 1;
  psi_n += 1 / (n - 1);
  xn *= -x;
  Sn = xn * (-Math.log(x) + psi_n) / factorial - Sn;

  Sm1 = Sn;
  for (i = n; ; i++) {
    factorial *= i;
    xn *= -x;
    term = xn / (factorial * (i - n + 1));
    Sn -= term;
    if (Math.abs(term) <= DBL_EPSILON * Math.abs(Sm1)) break;
    Sm1 = Sn;
  }

  return Sn;
}
/**
 * For x > 1 or x + n >= 20, the continued fraction representation is used:
 * En(x) = exp(-x) { 1/(x+n-) 1*n/(x+n+2-) 2*(n+1)/(x+n+4-)  ... }
 */
function en_continuedFraction(x: number, n: number, expx: number) {
  let Am1 = 1,
    A0 = 0,
    Bm1 = 0,
    B0 = 1,
    a = expx,
    b = x + n,
    Ap1 = b * A0 + a * Am1,
    Bp1 = b * B0 + a * Bm1,
    eps = 10 * DBL_EPSILON,
    lhs,
    rhs,
    j = 1;

  while (Math.abs(Ap1 * B0 - A0 * Bp1) > eps * Math.abs(A0 * Bp1)) {
    if (Math.abs(Bp1) > 1) {
      Am1 = A0 / Bp1;
      A0 = Ap1 / Bp1;
      Bm1 = B0 / Bp1;
      B0 = 1;
    } else {
      Am1 = A0;
      A0 = Ap1;
      Bm1 = B0;
      B0 = Bp1;
    }
    a = -j * (n + j - 1);
    b += 2;
    Ap1 = b * A0 + a * Am1;
    Bp1 = b * B0 + a * Bm1;
    j += 1;
    lhs = Math.abs(Ap1 * B0 - A0 * Bp1);
    rhs = Math.abs(eps * A0 * Bp1);
    lhs = Ap1;
    rhs = Bp1;
  }

  return Ap1 / Bp1;
}

/**
 * Recursive formula for beta_n(x)
 * - If n is odd, beta_n(x) = ( n / x ) beta_(n-1)(x) - (2/x) cosh(x)
 * - If n is even, beta_n(x) = ( n / x ) beta_(n-1)(x) + (2/x) sinh(x)
 */
function eib_recursion(x: number, n: number) {
  if (x === 0) return n % 2 === 0 ? 2 / (n + 1) : 0;

  let bn = 0, c = 0, s = 0, m = 2;
  s = 2 * Math.sinh(x) / x;
  c = -2 * Math.cosh(x) / x;

  if (n == 0) return s;

  bn = s;
  for (m = 1; m <= n; m++) {
    if (x > m) {
      bn = (m / x) * bn + c;
    } else {
      bn += (x / m) * c;
      bn = 1 / bn;
      bn *= (x / m);
      bn = 1 / bn;
    }
    m++;
    if (m > n) break;
    if (x > m) {
      bn = (m / x) * bn + s;
    } else {
      bn += (x / m) * s;
      bn = 1 / bn;
      bn *= (x / m);
      bn = 1 / bn;
    }
  }

  return bn;
}

/**
 * Power Series of beta_n(x)
 * 
 * - If n is odd, beta_n(x) = -2 x/(n+2) + 2 x^3/[(3)!(n+4)] + ... + 2 x^(2i+1)/[(2i+1)!(n+2i+2)] + ...
 * - If n is even, beta_n(x) = 2/(n+1) + 2 x^2/[(2)!(n+3)] + ... + 2 x^(2i)/[(2i)!(n+2i+1)] + ...
 */
function eib_powerSeries(x: number, n: number) {
  return n % 2 === 0 ? eib_powerSeriesEven(x, n) : eib_powerSeriesOdd(x, n);
}

/**
 * Power series for beta_n where n is even
 * 
 * beta_n(x) = 2/(n+1) + 2 x^2/[(2)!(n+3)] + ... + 2 x^(2i)/[(2i)!(n+2i+1)] + ...
 */
function eib_powerSeriesEven(x: number, n: number) {
  let x2 = x * x,
    xn = 1,
    np1 = n + 1,
    Sn = xn / np1,
    Sm1 = 0,
    factorial = 1,
    y = 0;

  while (Math.abs(Sn - Sm1) > DBL_EPSILON * Math.abs(Sm1)) {
    Sm1 = Sn;
    y += 1;
    factorial *= y;
    y += 1;
    factorial *= y;
    xn *= x2;
    Sn += (xn / (factorial * (np1 + y)));
  }

  return Sn + Sn;
}

/**
 * Power series for beta_n where n is odd
 * 
 * beta_n(x) = -2 x/(n+2) + 2 x^3/[(3)!(n+4)] + ... + 2 x^(2i+1)/[(2i+1)!(n+2i+2)] + ...
 */
function eib_powerSeriesOdd(x: number, n: number) {
  let x2 = x * x,
    xn = x,
    np1 = n + 1,
    np2 = n + 2,
    Sn = xn / np2,
    Sm1 = 0,
    factorial = 1,
    y = 1;

  if (x === 0) Sn = 0;
  while (Math.abs(Sn - Sm1) > DBL_EPSILON * Math.abs(Sm1)) {
    Sm1 = Sn;
    y += 1;
    factorial *= y;
    y += 1;
    factorial *= y;
    xn *= x2;
    Sn += (xn / (factorial * (np1 + y)));
  }

  return -(Sn + Sn);
}