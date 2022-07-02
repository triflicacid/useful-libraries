import { Complex } from "./Complex";
import { DBL_EPSILON, PI } from "./constants";

/**
 * WriteOmega is the solution w(z) where w + log(w) = z
 * @implementation from SciPy: https://github.com/scipy/scipy/blob/master/scipy/special/wright.cc
 */

export function wrightomega_ext(z: Complex, cond: Complex = null): Complex {
    let s = 1;
    let near = 0.01, e: Complex, r: Complex, pz: Complex, wp1: Complex, t: Complex, fac: Complex, w: Complex;

    // Extract real/imag components
    let x = z.a;
    let y = z.b;

    // Compute: near branch cuts?
    let ympi = y - PI;
    let yppi = y + PI;

    if (isNaN(x) || isNaN(y)) {
        // NaN
        return Complex.NaN;
    } else if (!isFinite(x) && x < 0 && -PI < y && y <= PI) {
        // Signed zeroes between branches
        if (Math.abs(y) <= PI / 2) {
            w = y >= 0 ? new Complex(0, 0) : new Complex(0, -0);
        } else {
            w = y >= 0 ? new Complex(-0, 0) : new Complex(-0, -0);
        }
        return w;
    } else if (!isFinite(x) || !isFinite(y)) {
        // Asymptopic for large z (either one is infinite)
        return new Complex(x, y);
    }

    // If exactly on the singular points
    if (x === -1 && Math.abs(y) === PI) {
        return new Complex(-1, 0);
    }

    // Choose an approximation base on region
    if (-2 < x && x <= 1 && 1 < y && y < 2 * PI) {
        // ! Region 1: upper branch point -> series about z = -1 + pi*i
        // pz=conj(sqrt(conj(2.0*(z+1.0-I*pi))));
        pz = Complex.sqrt(Complex.add(z, 1).sub(new Complex(0, PI)).mult(2).conjugate()).conjugate();
        // w=-1.0+(I+(1.0/3.0+(-1.0/36.0*I+(1.0/270.0+1.0/4320.0*I*pz)*pz)*pz)*pz)*pz;
        w = Complex.add(-1, Complex.add(Complex.I, Complex.add(1 / 3, Complex.add(new Complex(0, -1 / 36), Complex.add(1 / 270, new Complex(0, 1 / 4320).mult(pz)).mult(pz)).mult(pz)).mult(pz)).mult(pz));
    } else if (-2 < x && x <= 1 && -2 * PI < y && y < -1) {
        // ! Region 2: lower branch point -> series about z = -1 - pi*i
        // pz=conj(sqrt(conj(2.0*(z+1.0+I*pi))));
        pz = Complex.sqrt(Complex.add(z, 1).add(new Complex(0, PI)).mult(2).conjugate()).conjugate();
        // w=-1.0+(-I+(1.0/3.0+(1.0/36.0*I+(1.0/270.0-1.0/4320.0*I*pz)*pz)*pz)*pz)*pz;
        w = Complex.add(-1, Complex.add(new Complex(0, -1), Complex.add(1 / 3, Complex.add(new Complex(0, 1 / 36), Complex.sub(1 / 270, new Complex(0, 1 / 4320).mult(pz)).mult(pz)).mult(pz)).mult(pz)).mult(pz));
    } else if (x <= -2 && -PI < y && y <= PI) {
        // ! Region 3: between branch cuts -> series about -Infinity
        // pz=exp(z);
        pz = Complex.exp(z);
        // w=(1.0+(-1.0+(3.0/2.0+(-8.0/3.0+125.0/24.0*pz)*pz)*pz)*pz)*pz;
        w = Complex.add(1, Complex.add(-1, Complex.add(3 / 2, Complex.add(-8.0 / 3.0, Complex.mult(125 / 24, pz)).mult(pz)).mult(pz)).mult(pz)).mult(pz);
        if (w.equals(0)) {
            // console.error(`WriteOmega: underflow in exponential series`);
            if (cond) cond.set(Complex.div(z, Complex.add(1, w))); // cond = z/(1.0+*w)
            return w;
        }
    } else if ((-2 < x && x <= 1 && -1 <= y && y <= 1) || (-2 < x && (x - 1) * (x - 1) + y * y <= PI * PI)) {
        // ! Region 4: Mushroom -> series about z = 1
        // pz=z-1.0
        pz = Complex.sub(z, 1);
        // w=1.0/2.0+1.0/2.0*z+(1.0/16.0+(-1.0/192.0+(-1.0/3072.0+13.0/61440.0*pz)*pz)*pz)*pz*pz
        w = Complex.add(Complex.add(0.5, Complex.mult(0.5, z)), Complex.add(1 / 16, Complex.add(-1 / 192, Complex.add(-1 / 3072, Complex.mult(13 / 61440, pz)).mult(pz)).mult(pz)).mult(pz).mult(pz));
    } else if (x <= -1.05 && PI < y && y - PI <= -0.75 * (x + 1)) {
        // ! Region 5: Top wing -> negative log series
        t = Complex.sub(z, new Complex(0, PI));
        pz = Complex.log(Complex.mult(t, -1));
        w = Complex.sub(t, pz);
        fac = Complex.div(pz, t);
        w.add(fac);
        fac.div(t);
        w.add(Complex.mult(fac, Complex.sub(Complex.mult(0.5, pz), 1)));
        fac.div(t);
        w.add(Complex.mult(fac, Complex.sub(Complex.mult(pz, pz).div(3), Complex.mult(3, pz).div(2)).add(1)));

        if (Complex.abs(z) > 1e50) {
            // Series is accurate and the iterative scheme could overflow
            if (cond) cond.set(Complex.div(z, Complex.add(1, w))); // cond = z/(1.0+*w)
            return w;
        }
    } else if (x <= -1.05 && 0.75 * (x + 1) < y + PI && y + PI <= 0) {
        // ! Region 6: Bottom wing -> negative log series
        t = Complex.add(z, new Complex(0, PI));
        pz = Complex.log(Complex.mult(t, -1));
        w = Complex.sub(t, pz);
        fac = Complex.div(pz, t);
        w.add(fac);
        fac.div(t);
        w.add(Complex.mult(fac, Complex.sub(Complex.mult(0.5, pz), 1)));
        fac.div(t);
        w.add(Complex.mult(fac, Complex.sub(Complex.mult(pz, pz).div(3), Complex.mult(3, pz).div(2)).add(1)));

        if (Complex.abs(z) > 1e50) {
            // Series is accurate and the iterative scheme could overflow
            if (cond) cond.set(Complex.div(z, Complex.add(1, w))); // cond = z/(1.0+*w)
            return w;
        }
    } else {
        // ! Region 7 : everywhere else
        pz = Complex.log(z);
        w = Complex.sub(z, pz);
        fac = Complex.div(pz, z);
        w.add(fac);
        fac.div(z);
        w.add(Complex.mult(fac, Complex.mult(0.5, pz).sub(1)));
        fac.div(z);
        w.add(Complex.mult(fac, Complex.mult(pz, pz).div(3).sub(Complex.mult(3, pz).div(2)).add(1)));

        if (Complex.abs(z) > 1e50) {
            // Series is accurate and the iterative scheme could overflow
            if (cond) cond.set(Complex.div(z, Complex.add(1, w))); // cond = z/(1.0+*w)
            return w;
        }
    }

    // Regularise if near branch cuts
    if (x <= -1 + near && (Math.abs(ympi) <= near || Math.abs(yppi) <= near)) {
        s = -1;
        if (Math.abs(ympi) <= near) {
            z = Complex.add(x, new Complex(0, ympi));
        } else {
            z = Complex.add(x, new Complex(0, yppi));
        }
    }

    // Iteration One
    w = Complex.mult(s, w); // *w=s**w;
    r = Complex.sub(z, Complex.mult(s, w)).sub(Complex.log(w)); // r=z-s**w-log(*w);
    wp1 = Complex.mult(s, w).add(1); // wp1=s**w+1.0
    // 2.0*wp1*(wp1+2.0/3.0*r)
    let tmp = Complex.mult(2, wp1).mult(Complex.add(wp1, Complex.mult(2 / 3, r)));
    // e=r/wp1*(2.0*wp1*(wp1+2.0/3.0*r)-r)/(2.0*wp1*(wp1+2.0/3.0*r)-2.0*r);
    e = Complex.div(r, wp1).mult(Complex.sub(tmp, r)).div(Complex.sub(tmp, Complex.mult(2, r)));
    w.mult(Complex.add(1, e));

    // Iteration Two
    // (2.0**w**w-8.0**w-1.0)*pow(abs(r),4.0)
    let lhs = Complex.mult(2, w).mult(w).sub(Complex.mult(8, w)).sub(1).mult(Complex.pow(Complex.abs(r), 4));
    // TWOITERTOL*72.0*pow(abs(wp1),6.0)
    // let rhs = Complex.mult(DBL_EPSILON, 72).mult(Complex.pow(Complex.abs(wp1), 6));
    let rhs = DBL_EPSILON * 72 * Math.pow(Complex.abs(wp1), 6);
    // abs((2.0**w**w-8.0**w-1.0)*pow(abs(r),4.0)) >= TWOITERTOL*72.0*pow(abs(wp1),6.0)
    if (Complex.abs(lhs) >= rhs) {
        r = Complex.sub(z, Complex.mult(s, w)).sub(Complex.log(w)); // r=z-s**w-log(*w);
        wp1 = Complex.mult(s, w).add(1); // wp1=s**w+1.0
        // 2.0*wp1*(wp1+2.0/3.0*r)
        let tmp = Complex.mult(2, wp1).mult(Complex.add(wp1, Complex.mult(2 / 3, r)));
        // e=r/wp1*(2.0*wp1*(wp1+2.0/3.0*r)-r)/(2.0*wp1*(wp1+2.0/3.0*r)-2.0*r);
        e = Complex.div(r, wp1).mult(Complex.sub(tmp, r)).div(Complex.sub(tmp, Complex.mult(2, r)));
        w.mult(Complex.add(1, e));
    }

    // Undo regularisation : *w=s**w;
    w = Complex.mult(s, w);

    // Provide condition number estimate
    if (cond) cond.set(Complex.div(z, Complex.add(1, w))); // cond = z/(1.0+*w)

    return w;
}