import { Complex } from "./Complex";

/** Compute the gamma function at a given complex number z.
 * See https://en.wikipedia.org/wiki/Lanczos_approximation
*/
export const gamma = (function () {
  const p = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  const epsilon = 1e-7;
  function gamma(z: Complex): Complex {
    if (z.a < 0.5) {
      // pi / (sin(pi * z) * gamma(1 - z))
      return Complex.div(Math.PI, Complex.mult(Complex.sin(Complex.mult(Math.PI, z)), gamma(Complex.sub(1, z))));
    } else {
      z = Complex.sub(z, 1);
      let x = new Complex(0.99999999999980993);
      p.forEach((p, i) => {
        x.add(Complex.div(p, Complex.add(z, i).add(1))); // x += pval / (z + i + 1)
      });
      let t = Complex.add(z, p.length).sub(0.5);
      return Complex.sqrt(2 * Math.PI).mult(Complex.pow(t, Complex.add(z, 0.5))).mult(Complex.exp(Complex.mult(t, -1))).mult(x);
    }
  }
  return gamma;
})();

/** Return both roots of a quadratic ax^2 + bx + c = 0 */
export function quadratic(a: Complex, b: Complex, c: Complex) {
  const twoa = Complex.mult(2, a);
  const A = Complex.mult(-1, b).div(twoa); // -b / 2a
  const B = Complex.sqrt(Complex.pow(b, 2).sub(new Complex(4).mult(a).mult(c))).div(twoa); // sqrt(b^2 - 4ac) / 2a
  return [Complex.add(A, B), Complex.sub(A, B)];
}

/** Return the three roots of a depressed cubic ax^3 + bx + c = 0 */
export function depressed_cubic(a: Complex, b: Complex, c: Complex) {
  // t^3 + pt + q
  const p = Complex.div(b, a);
  const q = Complex.div(c, a);
  const root = Complex.sqrt(Complex.pow(q, 2).div(4).add(Complex.pow(p, 3).div(27))); // sqrt(q^2 / 4 + p^3 / 27)
  const k = Complex.div(q, -2); // -q / 2
  const z = Complex.add(k, root); // k + root
  const mag = Math.cbrt(z.getMag()); // |k + root|
  return Array.from({ length: 3 }, (_, i) => i).map(k => new Complex(2 * mag * Math.cos((z.getArg() + 2 * Math.PI * k) / 3))); // Ignore imaginary parts
}