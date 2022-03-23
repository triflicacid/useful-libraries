import { Complex } from "./Complex";

/** Approximate the error function erf(z) using Abramowitz and Stegun */
export function erf(z: Complex): Complex {
    if (z.a >= 0 && z.b >= 0) {
        const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
        const p = 0.3275911;
        const t = Complex.div(1, Complex.add(1, Complex.mult(p, z))); // t = 1/(1+pz)
        const enz2 = Complex.exp(Complex.pow(z, 2).neg()); // e^(-z^2)
        const s = a.map((a, i) => Complex.mult(new Complex(a), Complex.pow(t, i + 1))).reduce((a, b) => Complex.add(a, b), new Complex(0)).mult(enz2); // (a1*t + 12*t^2 + ...) * e^(-z^2)
        return Complex.sub(1, s); // 1 - s
    } else if (z.a < 0 && z.b < 0) {
        // -erf(-z)
        return erf(Complex.mult(z, -1)).neg();
    }
    throw new Error(`erf(${z.toString()}) - unable to calculate`);
}