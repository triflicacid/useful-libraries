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

/** Return polynomial P(z) with given coefficients as a string */
export function pstr(k: Complex[]) {
  return k.map((z, i) => i === k.length - 1 ? z.toString() : ("(" + z.toString() + ")z" + (i === k.length - 2 ? "" : "^" + (3 - i)))).join(" + ");
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