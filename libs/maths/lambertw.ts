import { Complex } from "./Complex";
import { PI, TWO_PI, E, EXPN1, OMEGA } from "./constants";

/**
 * LambertW is defined as the solution to w * e ** w = z
 * @implementation from SciPy: https://github.com/scipy/scipy/blob/master/scipy/special/_lambertw.pxd
 */

function lambertw_scalar(z: Complex, k: number, tol: number) {
    let i: number, p: number, absz: number,
        w: Complex, ew: Complex, wew: Complex, wewz: Complex, wn: Complex;

    if (Complex.isNaN(z)) {
        return z;
    } else if (z.a === Infinity) {
        // z + 2π*ki
        return Complex.add(z, new Complex(0, TWO_PI * k));
    } else if (z.a === -Infinity) {
        // -z + (2π*k + π)i
        return Complex.add(z.neg(), TWO_PI * k + PI);
    } else if (z.equals(0)) {
        if (k === 0) return z;
        return new Complex(-Infinity);
    } else if (z.equals(1) && k == 0) {
        // Split out this case as series blows up
        return new Complex(OMEGA);
    }

    absz = Complex.abs(z);
    // Get an initial guess for Halley's method
    if (k === 0) {
        if (Complex.abs(Complex.add(z, EXPN1)) < 0.3) {
            w = lambertw_branchpt(z);
        } else if (-1 < z.a && z.a < 1.5 && Math.abs(z.b) < 1 && -2.5 * Math.abs(z.b) - 0.2 < z.a) {
            // Empirically determined decision boundary where the Pade approx. is more accurate
            w = lambertw_pade0(z);
        } else {
            w = lambertw_asy(z, k);
        }
    } else if (k === -1) {
        if (absz <= EXPN1 && z.b === 0 && z.a < 0) {
            w = Complex.log(-z.a);
        } else {
            w = lambertw_asy(z, k);
        }
    } else {
        w = lambertw_asy(z, k);
    }

    // Halley's method
    if (w.a >= 0) {
        // Rearrange formula to avoid overflow in exp()
        for (i = 0; i < 100; i++) {
            ew = Complex.exp(w.neg()); // ew = exp(-w)
            wewz = Complex.sub(w, Complex.mult(z, ew)); // wewz = w - (z * ew)
            // wn = w - (wewz / (w + 1 - ((w + 2) * (wewz / ((2 * w) + 2)))))
            wn = Complex.sub(w, Complex.div(wewz, Complex.add(w, 1).sub(Complex.mult(Complex.add(w, 2), Complex.div(wewz, Complex.mult(2, w).add(2))))));
            if (Complex.abs(Complex.sub(wn, w)) < tol * Complex.abs(wn)) { // abs(wn - w) < tol*abs(wn)
                return wn;
            } else {
                w = wn;
            }
        }
    } else {
        for (i = 0; 1 < 100; i++) {
            ew = Complex.exp(w); // ew = exp(w)
            wew = Complex.mult(w, ew); // wew = w * ew
            wewz = Complex.sub(wew, z); // wewz = wew - z
            // wn = w - (wewz / (wew + ew - ((w + 2) * (wewz / ((2 * w) + 2)))))
            wn = Complex.sub(w, Complex.div(wewz, Complex.add(wew, ew).sub(Complex.mult(Complex.add(w, 2), Complex.div(wewz, Complex.mult(w, 2).add(2))))));
            if (Complex.abs(Complex.sub(wn, w)) < tol * Complex.abs(wn)) { // abs(wn - w) < tol*abs(wn)
                return wn;
            } else {
                w = wn;
            }
        }
    }

    console.warn(`[!] Failed to converge`);
    return new Complex(NaN, NaN);
}

function evalpoly(coeffs: number[], degree: number, z: Complex) {
    let j: number, tmp: number;
    let a = coeffs[0], b = coeffs[1],
        r = 2 * z.a,
        s = (z.a * z.a) + (z.b * z.b);
    for (j = 2; j <= degree; j++) {
        tmp = b;
        b = (-s * a) + coeffs[j];
        a = (r * a) + tmp;
    }
    return Complex.mult(z, a).add(b); // z*a + b
}

/**
 * Series for W(z, 0) around the branch point
 * @param {Complex} z
 */
function lambertw_branchpt(z: Complex) {
    const coeffs = [-1 / 3, 1, -1];
    let p = Complex.sqrt(Complex.mult(E, z).add(1).mult(2));
    return evalpoly(coeffs, 2, p);
}

/**
 * Pade approximation for W(z, 0) around 0
 * @param {Complex} z 
 */
function lambertw_pade0(z: Complex) {
    const num = [
        12.85106382978723404255,
        12.34042553191489361902,
        1.0
    ];
    const denom = [
        32.53191489361702127660,
        14.34042553191489361702,
        1.0
    ];
    return Complex.mult(z, Complex.div(evalpoly(num, 2, z), evalpoly(denom, 2, z)));
}

/**
 * Compute the W function using the first two terms of the asymptopic series
 * @param {Complex} z 
 * @param {number} k 
 */
function lambertw_asy(z: Complex, k: number) {
    let w = Complex.log(z).add(new Complex(0, TWO_PI * k));
    return Complex.sub(w, Complex.log(w));
}

/**
 * LambertW is defined as the solution to w * e ** w = z
*/
export function lambertw(z: Complex | number, k: number = 0, tol: number = 1e-8) {
    return lambertw_scalar(Complex.parse(z), k, tol);
}