import { Complex } from './Complex';
import { DBL_EPSILON } from './constants';

/** Check if two floats are "equal" (take into account rounding error) */
function req(a: number, b: number) {
  return Math.abs(a - b) <= 5 * DBL_EPSILON;
}

/** Return polynomial P(z) with given coefficients */
export function polynomial(coeffs: Complex[]) {
  return function (z: Complex) {
    let sum = new Complex(0);
    for (let i = 0; i < coeffs.length; i++) {
      sum.add(Complex.mult(coeffs[i], Complex.pow(z, coeffs.length - i)));
    }
    return sum;
  }
}

/**
 * Solves a quadratic in the form ax^2 + bx + c
 * 
 * @returns roots Complex[2]
*/
export function solveQuadratic(a: Complex, b: Complex, c: Complex): [Complex, Complex] {
  const twoa = Complex.mult(a, 2);
  const A = Complex.mult(-1, b).div(twoa); // -b / 2a
  const B = Complex.sqrt(Complex.pow(b, 2).sub(Complex.mult(4, a).mult(c))).div(twoa); // sqrt(b^2 - 4ac) / 2a
  return [Complex.add(A, B), Complex.sub(A, B)];
}

/**
 * Solves a cubic in the form ax^3 + bx^2 + cx + d
 * 
 * @returns roots Complex[3]
 * 
 * **NB** formula returns Complex[6], containing three duplicate pairs,
 * which are then removed. If sufficient rounding errors occur,
 * returned array may have 3 < x <= 6 members
 * 
 * https://mathworld.wolfram.com/CubicFormula.html
 */
export function solveCubic(a: Complex, b: Complex, c: Complex, d: Complex) {
  // Divide throughout by {a}, so we can ignore it (as a=1)
  if (!(a.a === 1 && a.b === 0)) {
    b = Complex.div(b, a);
    c = Complex.div(c, a);
    d = Complex.div(d, a);
  }

  // substitute z=x-b/3 to obtain x^3 + px = q
  const p = Complex.mult(3, c).sub(Complex.mult(b, b)).div(3); // p=(3c-b^2)/3
  const q = Complex.mult(9, c).mult(b).sub(Complex.mult(27, d)).sub(Complex.mult(2, Complex.pow(b, 3))).div(27); // q=(9cb-27d-2b^3)/27
  // let x=w-p/(3w) to get w^3 - p^3/(27w^3)-q=0 => w^6 - qw^3 - (1/27)p^3 = 0
  let r = Complex.mult(-1, q), s = Complex.mult(-1 / 27, Complex.pow(p, 3));

  // solve quadratic in terms of w^3: w^3 = 0.5 * (-r +- sqrt(r^2 - 4s))
  const sqrt = Complex.sqrt(Complex.mult(r, r).sub(Complex.mult(4, s)));
  const w3_1 = Complex.mult(0.5, Complex.add(q, sqrt)), w3_2 = Complex.mult(0.5, Complex.sub(q, sqrt));
  // Find w from w^3
  const wroots = Complex.root(w3_1, 3).concat(Complex.root(w3_2, 3)); // contains 6 roots, 3 duplicate pairs

  // back-substitute: z=w-p/(3w)-b/3
  const roots = wroots.map(w => Complex.sub(w, Complex.div(p, Complex.mult(3, w))).sub(Complex.mult(1 / 3, b)));

  // obtained 6 roots, which consists of three pairs of duplicates
  // (rounding errors may be present, so check if close)
  const found: Complex[] = [];
  for (let i = roots.length - 1; i >= 0; i--) {
    if (found.find(z => req(z.a, roots[i].a) && req(z.b, roots[i].b))) roots.splice(i, 1);
    else found.push(roots[i]);
  }
  return roots;
}

/**
 * Solves quartic equation in the form ax^4 + bx^3 + cx^2 + dx + e
 * 
 * https://mathworld.wolfram.com/QuarticEquation.html
 */
export function solveQuartic(a: Complex, b: Complex, c: Complex, d: Complex, e: Complex) {
  // Divide throughout by {a}, so we can ignore it (as a=1)
  b = Complex.div(b, a);
  c = Complex.div(c, a);
  d = Complex.div(d, a);
  e = Complex.div(e, a);

  // y^3 - cy + (db - 4e)y + (4ce - d^2 - b^2*e)
  const yroots = solveCubic(new Complex(1), Complex.mult(-1, c), Complex.mult(d, b).sub(Complex.mult(4, e)), Complex.mult(4, c).mult(e).sub(Complex.mult(d, d)).sub(Complex.mult(b, b).mult(e)));
  const y = yroots.find(y => req(y.b, 0)); // Real root

  const b2 = Complex.mult(b, b); // b^2
  const R = Complex.sqrt(Complex.mult(b2, 0.25).sub(c).add(y));
  let lhs: Complex, rhs: Complex;
  if (req(a.a, 0) && req(a.b, 0)) { // R == 0
    lhs = Complex.mult(b2, 0.75).sub(Complex.mult(2, c)); // 0.75b^2 - 2c
    rhs = Complex.sqrt(Complex.mult(y, y).sub(Complex.mult(4, e))).mult(2); // 2sqrt(y^2 - 4e)
  } else {
    lhs = Complex.mult(b2, 0.75).sub(Complex.mult(R, R)).sub(Complex.mult(2, c)); // 0.75*b^2 - R^2 - 2c
    rhs = Complex.mult(0.25, Complex.mult(4, b).mult(c).sub(Complex.mult(8, d)).sub(Complex.mult(b2, b))).mult(Complex.div(1, R)); // 0.25(4bc-8d-b^3)*R^(-1)
  }
  const D = Complex.sqrt(Complex.add(lhs, rhs)), E = Complex.sqrt(Complex.sub(lhs, rhs));

  const roots = [
    Complex.mult(-0.25, b).add(Complex.mult(0.5, R)).add(Complex.mult(0.5, D)), // z1 = -0.25b + 0.5R + 0.5D
    Complex.mult(-0.25, b).add(Complex.mult(0.5, R)).sub(Complex.mult(0.5, D)), // z2 = -0.25b + 0.5R - 0.5D
    Complex.mult(-0.25, b).sub(Complex.mult(0.5, R)).add(Complex.mult(0.5, D)), // z3 = -0.25b - 0.5R + 0.5D
    Complex.mult(-0.25, b).sub(Complex.mult(0.5, R)).sub(Complex.mult(0.5, D)), // z4 = -0.25b - 0.5R - 0.5D
  ] as Complex[];
  return roots;
}

/** Represents object describing a polynomial */
export interface IPolynomial {
  [degree: number]: number;
}

/** Represents object describing a polynomial with complex coefficients */
export interface IZPolynomial {
  [degree: number]: Complex;
}

/** evaluate polynomial p(x) at given x */
export function poly_eval(p: IPolynomial, x: number) {
  return Object.keys(p).reduce((s, c) => s + p[c] * Math.pow(x, +c), 0);
}

/** evaluate complex polynomial p(z) at given z */
export function poly_zeval(p: IZPolynomial, x: Complex) {
  return Object.keys(p).reduce((s, c) => s.add(Complex.mult(p[c], Complex.pow(x, +c))), new Complex(0));
}

/** return c1 + c2 */
export function poly_add(c1: IPolynomial, c2: IPolynomial) {
  const c3: IPolynomial = {};
  for (let deg in c1) if (!isNaN(parseInt(deg))) c3[deg] = deg in c2 ? c1[deg] + c2[deg] : c1[deg];
  for (let deg in c2) if (!(deg in c3) && !isNaN(parseInt(deg))) c3[deg] = deg in c1 ? c1[deg] + c2[deg] : c2[deg];
  return c3;
}

/** return c1 + c2 for complex p(z) */
export function poly_zadd(c1: IZPolynomial, c2: IZPolynomial) {
  const c3: IZPolynomial = {};
  for (let deg in c1) if (!isNaN(parseInt(deg))) c3[deg] = deg in c2 ? Complex.add(c1[deg], c2[deg]) : c1[deg].copy();
  for (let deg in c2) if (!(deg in c3) && !isNaN(parseInt(deg))) c3[deg] = deg in c1 ? Complex.add(c1[deg], c2[deg]) : c2[deg].copy();
  return c3;
}

/** return -c */
export function poly_neg(c: IPolynomial) {
  const nc: IPolynomial = {};
  for (let deg in c) if (!isNaN(parseInt(deg))) nc[deg] = -c[deg];
  return nc;
}

/** return -c for complex p(z) */
export function poly_zneg(c: IZPolynomial) {
  const nc: IZPolynomial = {};
  for (let deg in c) if (!isNaN(parseInt(deg))) nc[deg] = c[deg].neg();
  return nc;
}

/** return c1 * c2 */
export function poly_mul(c1: IPolynomial, c2: IPolynomial) {
  const c3: IPolynomial = {};
  for (let deg1 in c1) if (!isNaN(parseInt(deg1))) {
    const d1 = parseInt(deg1);
    for (let deg2 in c2) if (!isNaN(parseInt(deg2))) {
      const d2 = parseInt(deg2), d3 = d1 + d2;
      if (!(d3 in c3)) c3[d3] = 0;
      c3[d3] += c1[d1] * c2[d2];
    }
  }
  return c3;
}

/** return c1 * c2 for complex p(z) */
export function poly_zmul(c1: IZPolynomial, c2: IZPolynomial) {
  const c3: IZPolynomial = {};
  for (let deg1 in c1) if (!isNaN(parseInt(deg1))) {
    const d1 = parseInt(deg1);
    for (let deg2 in c2) if (!isNaN(parseInt(deg2))) {
      const d2 = parseInt(deg2), d3 = d1 + d2;
      if (!(d3 in c3)) c3[d3] = new Complex(0);
      c3[d3].add(Complex.mult(c1[d1], c2[d2]));
    }
  }
  return c3;
}

/** return a / b and the remainder: [result, remainder] */
export function poly_div(a: IPolynomial, b: IPolynomial) {
  const res: IPolynomial = {};
  a = { ...a };
  let adegs = Object.keys(a).sort().reverse().map(k => parseInt(k)).filter(d => !isNaN(d)), admax = adegs[0], admin = adegs[adegs.length - 1];
  let bdegs = Object.keys(b).sort().reverse().map(k => parseInt(k)).filter(d => !isNaN(d)), bdmax = bdegs[0];
  for (let d = admax, off = 0; d >= admin; --d, ++off) {
    if (off === admax) break; // No more terms?
    let c = a[d] / b[bdmax]; // Divide leading coefficients
    res[d - bdmax] = c;
    for (let i = 0; i < bdegs.length; i++) {
      let bd = bdmax - i, ad = admax - off - i;
      a[ad] = a[ad] === undefined ? -c * b[bd] : a[ad] - c * b[bd];
      if (a[ad] === 0) delete a[ad];
    }
  }
  return [res, a];
}

/** return a / b and the remainder for complex p(z): [result, remainder] */
export function poly_zdiv(a: IZPolynomial, b: IZPolynomial) {
  const res: IZPolynomial = {};
  a = { ...a };
  let adegs = Object.keys(a).sort().reverse().map(k => parseInt(k)).filter(d => !isNaN(d)), admax = adegs[0], admin = adegs[adegs.length - 1];
  let bdegs = Object.keys(b).sort().reverse().map(k => parseInt(k)).filter(d => !isNaN(d)), bdmax = bdegs[0];
  for (let d = admax, off = 0; d >= admin; --d, ++off) {
    if (off === admax) break; // No more terms?
    let c = Complex.div(a[d], b[bdmax]); // Divide leading coefficients
    res[d - bdmax] = c;
    for (let i = 0; i < bdegs.length; i++) {
      let bd = bdmax - i, ad = admax - off - i;
      a[ad] = a[ad] === undefined ? Complex.mult(c, b[bd]).neg() : a[ad].sub(Complex.mult(c, b[bd]));
      if (a[ad].a === 0 && a[ad].b === 0) delete a[ad];
    }
  }
  return [res, a];
}

/** Given a polynomial p(x), return p'(x) */
export function poly_differentiate(p: IPolynomial) {
  return Object.keys(p).reduce((o, k) => {
    if (+k !== 0) o[+k - 1] = p[+k] * +k;
    return o;
  }, {} as IPolynomial);
}

/** Given a complex polynomial p(z), return p'(z) */
export function poly_zdifferentiate(p: IZPolynomial) {
  return Object.keys(p).reduce((o, k) => {
    o[+k - 1] = Complex.mult(p[+k], +k);
    return o;
  }, {} as IZPolynomial);
}

/** Given a polynomial p'(x), return p(x)
 * 
 * **NB** constant=0, removes any x^-1 terms
*/
export function poly_integrate(p: IPolynomial) {
  return Object.keys(p).reduce((o, k) => {
    if (+k !== -1) o[+k + 1] = p[+k] / (+k + 1);
    return o;
  }, {} as IPolynomial);
}

/** Given a complex polynomial p'(\), return p(z)
 * 
 * **NB** constant=0, removes any x^-1 terms
*/
export function poly_zintegrate(p: IPolynomial) {
  return Object.keys(p).reduce((o, k) => {
    if (+k !== -1) o[+k + 1] = Complex.div(p[+k], +k + 1);
    return o;
  }, {} as IZPolynomial);
}

/** return string from a polynomial object, p(x) */
export function poly_str(c: IPolynomial, variable: string = 'x') {
  let str = '';
  for (let deg in c) if (!isNaN(parseInt(deg))) {
    let d = parseInt(deg);
    if (str === '') {
      str += c[deg].toString();
    } else {
      str += ' ' + (c[deg] < 0 ? '-' : '+') + ' ' + Math.abs(c[deg]);
    }
    if (d !== 0) {
      str += '*' + variable;
      if (d !== 1) str += '^' + deg;
    }
  }
  return str;
}

/** return string from a complex polynomial object, p(z) */
export function poly_zstr(c: IZPolynomial, variable: string = 'z') {
  let str = '';
  for (let deg in c) if (!isNaN(parseInt(deg))) {
    let d = parseInt(deg);
    if (str === '') {
      str += c[deg].toString();
    } else {
      str += ' + ' + c[deg].toString();
    }
    if (d !== 0) {
      str += '*' + variable;
      if (d !== 1) str += '^' + deg;
    }
  }
  return str;
}

/**
 * Given a recurrence relation `U[n+1]`, return `U[k]`
 * @param a - recurrence relation coefficients
 * @param initial - initial values i.e. `U[0]`
 * @returns a function which, when called, returns U[k] | k>0.
 * 
 * `U[n+1] = Sum (a[i] U[n-i])`, i=`0` to `len(a)`
 * 
 * Example: `a = [2x, -1]`, `initial = [1, x]` would define `U[n+1] = 2x U[n] - U[n-1]` with `U[0] = 1, U[1] = x`
 */
export function poly_recurrence(a: IPolynomial[], initial: IPolynomial[]) {
  const U = [...initial];
  function generate(k: number) {
    for (let i = U.length; i <= k; i++)
      for (let j = 0; j < a.length; j++)
        U[i] = poly_add(U[i] || {}, poly_mul(a[j], U[i - 1 - j]));
    return U;
  }
  return (k: number) => generate(k)[k];
}

/** Same as createRecurrence() but for complex polynomials p(z) */
export function poly_zrecurrence(a: IZPolynomial[], initial: IZPolynomial[]) {
  const U = [...initial];
  function generate(k: number) {
    for (let i = U.length; i <= k; i++)
      for (let j = 0; j < a.length; j++)
        U[i] = poly_zadd(U[i] || {}, poly_zmul(a[j], U[i - 1 - j]));
    return U;
  }
  return (k: number) => generate(k)[k];
}

/**
 * Given a polynomial string in terms of `variable`, parse it and return an polynomial object
 */
export function poly_parse(str: string, variable = 'x') {
  const p: IPolynomial = {};
  let n: number[] = [1, 0, 0], ni = 1;
  for (let i = 0; i < str.length;) {
    if (str[i] === ' ') ++i;
    else if (/[0-9]/.test(str[i])) {
      let s = i++;
      while (/[0-9]/.test(str[i])) ++i;
      let sgn = ni !== 1 && n[ni] < 0 ? -1 : 1;
      n[ni] = sgn * parseInt(str.substring(s, i));
      ++ni;
    } else if (str[i] === '+' || str[i] === '-') {
      if (n[1] !== 0) p[n[2]] = n[0] * n[1];
      n = [str[i] === '-' ? -1 : 1, 0, 0];
      ni = 1;
      ++i;
    } else if (str[i] === '^') {
      n[ni = 2] = 1;
      ++i;
      if (str[i] === '+') i++;
      else if (str[i] === '-') n[ni] = -1, i++;
    } else if (str[i] === variable) {
      n[2]++;
      if (n[1] === 0) n[1] = 1;
      ++i;
    } else ++i;
  }
  if (n[1] !== 0) p[n[2]] = n[0] * n[1];
  return p;
}