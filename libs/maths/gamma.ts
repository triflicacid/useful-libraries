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