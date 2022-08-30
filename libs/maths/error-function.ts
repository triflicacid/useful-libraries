import { Complex } from "./Complex";

/**
 * The error function, erf(x), is defined as `erf(x) = 2/sqrt(pi) * integral e^-t^2 between 0->x`
 *
 * Abramowitz & Stegun, page 299, eq (7.1.26)
 */
export function erf(x: number): number {
    if (x < 0) return -erf(-x); // Odd function
    const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429], p = 0.3275911;
    const t = 1 / (1 + p * x);
    return 1 - Math.exp(-x * x) * a.map((a, i) => a * Math.pow(t, i + 1)).reduce((a, b) => a + b, 0);
}

/**
 * Error function, erf(z), for complex argument `z`
 * 
 * Abramowitz & Stegun, page 299, eq (7.1.29)
 */
export function erfz(z: Complex) {
    const f = (n: number, x: number, y: number) => 2 * x - 2 * x * Math.cosh(n * y) * Math.cos(2 * x * y) + n * Math.sinh(n * y) * Math.sin(2 * x * y);
    const g = (n: number, x: number, y: number) => 2 * x * Math.cosh(n * y) * Math.sin(2 * x * y) + n * Math.sinh(n * y) * Math.cos(2 * x * y);
    const x = z.a, y = z.b;
    const r = Complex.add(erf(x), Complex.mult(Math.exp(-x * x) / (2 * Math.PI * x), new Complex(1 - Math.cos(2 * x * y), Math.sin(2 * x * y))));
    const sum = new Complex(0);
    for (let n = 1; n <= 100; n++) {
        sum.add(Complex.mult(Math.exp(-0.5 * n * n) / (n * n + 4 * x * x), new Complex(f(n, x, y), g(n, x, y))));
    }
    r.add(Complex.mult((2 / Math.PI) * Math.exp(-x * x), sum));
    return r;
}

/**
 * The complementary error function, erfc(x), is defined as `erfc(x) = 1 - erf(x)`
 */
export function erfc(x: number) {
    return 1 - erf(x);
}

/**
 * The complementary error function, erfc(z), is defined as `erfc(z) = 1 - erf(z)`
 */
export function erfcz(z: Complex) {
    return Complex.sub(1, erfz(z));
}

/**
 * The Imaginary Error function, erfi(x), is defined as `erfi(x) = -i erf(ix)`
 */
export function erfi(x: number) {
    return Complex.mult(erfz(new Complex(0, x)), new Complex(0, -1));
}

/**
 * The Imaginary Error function, erfi(z), is defined as `erfi(z) = -i erf(iz)`
 */
export function erfiz(z: Complex) {
    return Complex.mult(erfz(new Complex(-z.b, z.a)), new Complex(0, -1));
}