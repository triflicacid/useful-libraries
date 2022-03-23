import { Complex } from './Complex';

/** Return solutions to quadratic: ax^2 + bx + c = 0 */
export function quadratic(a: Complex, b: Complex, c: Complex): [Complex, Complex] {
    const twoa = Complex.mult(a, 2);
    const A = Complex.mult(-1, b).div(twoa); // -b / 2a
    const B = Complex.sqrt(Complex.pow(b, 2).sub(Complex.mult(4, a).mult(c))).div(twoa); // sqrt(b^2 - 4ac) / 2a
    return [Complex.add(A, B), Complex.sub(A, B)];
}

/** Solve a depressed cubic in the form ax^3 + bx + c = 0 */
export function depressed_cubic(a: Complex, b: Complex, c: Complex): [Complex, Complex, Complex] {
    // x^3 + px = q
    const p = Complex.div(b, a); // p = b/a
    const q = Complex.div(c, a).mult(-1); // q = -c/a
    const w = new Complex(-0.5, 0.8660254037844386); // -1/2 + i*sqrt(3)/2
    const w2 = Complex.pow(w, 2); // w^2
    const discriminant = Complex.div(p, 3).pow(3).add(Complex.div(q, 2).pow(2)); // (p/3)^3 + (q/2)^2
    const beta = Complex.pow(Complex.div(q, -2).add(Complex.sqrt(discriminant)), 1/3); // b^3 = -q/2 + sqrt(discriminant)
    const alpha = Complex.div(-2, beta);
    return [
        Complex.sub(alpha, beta), // a - b
        Complex.sub(Complex.mult(alpha, w2), Complex.mult(beta, w)), // aw^2 - bw
        Complex.sub(Complex.mult(alpha, w), Complex.mult(beta, w2)), // aw - bw^2
    ];
}

/** Solve a cubic in the firm ax^3 + bx^2 + cx + d = 0 */
export function cubic(a: Complex, b: Complex, c: Complex, d: Complex): [Complex, Complex, Complex] {
    // Form t^3 + pt + q = 0 where t = x + b / 3a
    const bo3a = Complex.div(b, Complex.mult(3, a)); // b / 3a
    const p = Complex.mult(3, a).mult(c).sub(Complex.pow(b, 2)).div(Complex.mult(3, Complex.pow(a, 2))); // p = (3ac - b^2) / 3a^2
    const q = Complex.pow(b, 3).mult(2).sub(Complex.mult(9, a).mult(b).mult(c)).add(Complex.pow(a, 2).mult(27).mult(d)).div(Complex.pow(a, 3).mult(27)); // (2b^3 - 9abc + 27da^2) / 27a^3
    const roots = depressed_cubic(new Complex(1), p, q);
    return roots.map(z => Complex.sub(z, bo3a)) as [Complex, Complex, Complex];
}