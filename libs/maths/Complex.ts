/**
 * @prop a - Real component in 'a + bi' notation
 * @prop b - Imaginary component in 'a + bi' notation
 * 
 * Thanks to http://scipp.ucsc.edu/~haber/archives/physics116A10/arc_10.pdf, https://en.wikipedia.org/wiki/Complex_number, https://www.youtube.com/channel/UC_SvYP0k05UKiJ_2ndB02IA
 */
export class Complex {
  public a: number;
  public b: number;

  /**
   * Build a complex number in form 'a + bi', where a and b are real
   */
  constructor(a = 0, b = 0) {
    this.a = +a;
    this.b = +b;
  }

  /** Set oneself to value of argument */
  public set(z_: any) {
    const z = Complex.parse(z_);
    this.a = z.a;
    this.b = z.b;
    return this;
  }

  /** Do we only have a real component? */
  public isReal() {
    return this.b === 0;
  }

  /** Add a complex number to this: this = this + z */
  public add(z_: any) {
    const z = Complex.parse(z_);
    this.a += z.a;
    this.b += z.b;
    return this;
  }

  /** Subtract a complex number from this: this = this - z */
  public sub(z_: any) {
    const z = Complex.parse(z_);
    this.a -= z.a;
    this.b -= z.b;
    return this;
  }

  /** Return negation of this number. Return -a - bi */
  public neg() {
    return new Complex(-this.a, -this.b);
  }

  /** Multiply by a complex number : this = this * z */
  public mult(z_: any) {
    const z = Complex.parse(z_);
    let a = (this.a * z.a) - (this.b * z.b);
    let b = (this.a * z.b) + (this.b * z.a);
    this.a = a;
    this.b = b;
    return this;
  }

  /** Get magnitude of complex number on argand plane */
  public getMag() {
    return Math.sqrt(Math.pow(this.a, 2) + Math.pow(this.b, 2));
  }

  /** Set magnitude of complex number on argand plane */
  public setMag(r: number) {
    const θ = this.getArg();
    this.a = r * Math.cos(θ);
    this.b = r * Math.sin(θ);
    return this;
  }

  /** Get arg - angle between self and positive Real axis */
  public getArg() {
    return Math.atan2(this.b, this.a);
  }

  /** Set arg - angle between self and positive Real axis */
  public setArg(θ: number) {
    const r = this.getMag();
    this.a = r * Math.cos(θ);
    this.b = r * Math.sin(θ);
    return this;
  }

  /** Find complex conjugate (z*). Return as new Complex number. */
  public conjugate() {
    return new Complex(this.a, -this.b);
  }

  /** Return reciprocal */
  public reciprocal() {
    const a = this.a / (Math.pow(this.a, 2) + Math.pow(this.b, 2));
    const b = this.b / (Math.pow(this.a, 2) + Math.pow(this.b, 2));
    return new Complex(a, -b);
  }

  /** Divide by complex: this = this / w */
  public div(z_: any) {
    const z = Complex.div(this, z_);
    this.a = z.a;
    this.b = z.b;
    return this;
  }

  /** CCalculate this % z */
  public modulo(z_: any) {
    const z = Complex.modulo(this, z_);
    this.a = z.a;
    this.b = z.b;
    return this;
  }

  /** Raise to a power: this = this ^ z */
  public pow(z_: any) {
    const z = Complex.pow(this, z_);
    this.a = z.a;
    this.b = z.b;
    return this;
  }

  /** Is this == z */
  public equals(z_: any) {
    let z = Complex.parse(z_);
    return this.a === z.a && this.b === z.b;
  }

  public toString(radix?: number, ncase?: 'upper' | 'lower') {
    if (Complex.isNaN(this)) return 'nan';
    if (this.a === 0 && this.b === 0) return '0';
    let str = '', string: (z: number) => string;
    if (ncase === "upper") string = z => z.toString(radix).toUpperCase();
    else if (ncase === "lower") string = z => z.toString(radix).toLowerCase();
    else string = z => z.toString(radix);
    if (this.a !== 0) str += isFinite(this.a) ? string(this.a) : 'inf';
    if (this.b !== 0) {
      if (this.b >= 0 && this.a !== 0) str += '+';
      if (this.b === -1) str += '-';
      else if (this.b !== 1) str += isFinite(this.b) ? string(this.b) : 'inf';
      str += 'i';
    }
    return str;
  }

  public toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions) {
    if (Complex.isNaN(this)) return 'nan';
    if (this.a === 0 && this.b === 0) return '0';
    let str = '';
    if (this.a !== 0) str += isFinite(this.a) ? this.a.toLocaleString(locales, options) : 'inf';
    if (this.b !== 0) {
      if (this.b >= 0 && this.a !== 0) str += '+';
      if (this.b === -1) str += '-';
      else if (this.b !== 1) str += isFinite(this.b) ? this.b.toLocaleString(locales, options) : 'inf';
      str += 'i';
    }
    return str;
  }

  public toExponential(fdigits?: number) {
    if (Complex.isNaN(this)) return 'nan';
    if (this.a === 0 && this.b === 0) return '0';
    let str = '';
    if (this.a !== 0) str += isFinite(this.a) ? this.a.toExponential(fdigits) : 'inf';
    if (this.b !== 0) {
      if (this.b >= 0 && this.a !== 0) str += '+';
      if (this.b === -1) str += '-';
      else if (this.b !== 1) str += isFinite(this.b) ? this.b.toExponential(fdigits) : 'inf';
      str += 'i';
    }
    return str;
  }

  /** Return copy of this */
  public copy() {
    return new Complex(this.a, this.b);
  }

  /** Return new complex number = a + b */
  static add(a_: any, b_: any) {
    const za = Complex.parse(a_);
    const zb = Complex.parse(b_);
    return new Complex(za.a + zb.a, za.b + zb.b);
  }

  /** Return new complex number = a - b */
  static sub(a_: any, b_: any) {
    const za = Complex.parse(a_);
    const zb = Complex.parse(b_);
    return new Complex(za.a - zb.a, za.b - zb.b);
  }

  /** Return new complex number = a * b */
  static mult(a_: any, b_: any) {
    const za = Complex.parse(a_);
    const zb = Complex.parse(b_);
    return new Complex(
      (za.a * zb.a) - (za.b * zb.b),
      (za.a * zb.b) + (za.b * zb.a));
  }

  /** Return new complex number = a / b */
  static div(a_: any, b_: any) {
    const za = Complex.parse(a_);
    const zb = Complex.parse(b_);
    const denom = (zb.a * zb.a) + (zb.b * zb.b);
    let a = (za.a * zb.a) + (za.b * zb.b);
    let b = (za.b * zb.a) - (za.a * zb.b);
    return new Complex(a / denom, b / denom);
  }

  /** Return new complex number = a % b */
  static modulo(a: any, b: any) {
    const divb = Complex.div(a, b);
    const ans = Complex.sub(a, _zapply(divb, Math.floor).mult(b));
    return ans;
  }

  /** Return new complex number = a ^ b */
  static pow(a_: any, b_: any) {
    const za = Complex.parse(a_);
    const zb = Complex.parse(b_);

    // (a + bi) ^ (c + di)
    let a: number, b: number;
    if (zb.equals(0)) { // n^0
      a = 1;
      b = 0;
    } else if (zb.equals(1)) { // n^1
      a = za.a;
      b = za.b;
    } else if (za.equals(0) && zb.b === 0 && zb.a > 0) { // 0^n where n > 0 if 0 else NaN
      if (zb.b === 0 && zb.a > 0) {
        a = 0;
        b = 0;
      } else {
        a = NaN;
        b = NaN;
      }
    } else {
      const r = za.getMag(), θ = za.getArg();
      let common = Math.pow(r, zb.a) * Math.exp(-zb.b * θ); // Commong multiplier of both
      let value = (zb.a * θ) + (zb.b * Math.log(r)); // Commong value of trig functions
      a = common * Math.cos(value);
      b = common * Math.sin(value);
    }
    return new Complex(a, b);
  }

  /** Calculate sine of a complex number */
  public static sin(z_: any) {
    let z = Complex.parse(z_);
    return new Complex(Math.sin(z.a) * Math.cosh(z.b), Math.cos(z.a) * Math.sinh(z.b));
  }

  /** Calculate hyperbolic sine of a complex number */
  public static sinh(z_: any) {
    // sinh(a + bi) = sinh(a)cos(b) + cosh(a)sin(b)i
    const z = Complex.parse(z_);
    return new Complex(Math.sinh(z.a) * Math.cos(z.b), Math.cosh(z.a) * Math.sin(z.b));
  }

  /** Calculate hyperbolic arcsine of a number */
  public static arcsinh(z_: any) {
    // arcsinh(z) = ln[z + |1 + z^2|^0.5 * e^((i/2) * arg(1 + z^2))]
    const z = Complex.parse(z_);
    let opz2 = Complex.add(1, Complex.mult(z, z)); // 1 + z^2
    return Complex.log(Complex.add(z, Complex.mult(Complex.pow(Complex.abs(opz2), 0.5), Complex.exp(Complex.div(Complex.I, 2).mult(opz2.getArg())))));
  }

  /** Calculate arcsine of a complex number */
  public static arcsin(z_: any) {
    const z = Complex.parse(z_);

    let sqrt = new Complex(1 - Math.pow(z.a, 2) + Math.pow(z.b, 2), -2 * z.a * z.b).pow(0.5); // sqrt(1 - z^2)
    let ln = Complex.log(new Complex(-z.b + sqrt.a, z.a + sqrt.b)); // ln(iz + <sqrt>)
    let k = new Complex(0, -1); // -i
    return Complex.mult(k, ln); // <k> * <ln>
  }

  /** Calculate cosine of a complex number */
  public static cos(z_: any) {
    const z = Complex.parse(z_);
    return new Complex(Math.cos(z.a) * Math.cosh(z.b), -1 * Math.sin(z.a) * Math.sinh(z.b));
  }

  /** Calculate hyperbolic cosine of a complex number */
  public static cosh(z_: any) {
    // cosh(a + bi) = cosh(a)cos(b) + sinh(a)sin(b)i
    const z = Complex.parse(z_);
    return new Complex(Math.cosh(z.a) * Math.cos(z.b), Math.sinh(z.a) * Math.sin(z.b));
  }

  /** Calculate arccosine of a complex number */
  public static arccos(z_: any) {
    const z = Complex.parse(z_);
    let sqrt = new Complex(Math.pow(z.a, 2) - Math.pow(z.b, 2) - 1, 2 * z.a * z.b).pow(0.5); // sqrt(z^2 - 1)
    let ln = Complex.log(new Complex(z.a + sqrt.a, z.b + sqrt.b)); // ln(z + <sqrt>)
    let k = new Complex(0, -1); // -i
    return Complex.mult(k, ln); // <k> * <ln>
  }

  /** Calculate hyperbolic arccosine of a number
  */
  public static arccosh(z_: any) {
    // arccosh(z) = ln[z + |z^2 - 1|^0.5 * e^((i/2) * arg(z^2 - 1))]
    const z = Complex.parse(z_);
    let z2mo = Complex.sub(Complex.mult(z, z), 1); // z^2 - 1
    return Complex.log(Complex.add(z, Complex.mult(Complex.pow(Complex.abs(z2mo), 0.5), Complex.exp(Complex.div(Complex.I, 2).mult(z2mo.getArg())))));
  }

  /** Calculate tangent of a complex number */
  public static tan(z_: any) {
    const z = Complex.parse(z_);
    return Complex.div(Complex.sin(z), Complex.cos(z));
  }

  /** Calculate hyperbolic tangent of a complex number */
  public static tanh(z_: any) {
    // tanh(a + bi) = [sinh(2a) + sin(2b)i] / [cosh(2a) + cos(2b)]
    const z = Complex.parse(z_);
    return Complex.add(Math.sinh(2 * z.a), new Complex(0, Math.sin(2 * z.b))).div(Math.cosh(2 * z.a) + Math.cos(2 * z.b));
  }

  /** Calculate arctangent of a complex number */
  public static arctan(z_: any) {
    // arctan(z) = 1/(2i) * ln[(1 + iz)/(1 - iz)]
    const z = Complex.parse(z_);
    const iz = Complex.mult(Complex.I, z);
    return Complex.mult(Complex.div(1, new Complex(0, 2)), Complex.log(Complex.div(Complex.add(1, iz), Complex.sub(1, iz))));
  }

  /** Calculate hyperbolic arctangent of a number */
  public static arctanh(z_: any) {
    // arctanh(z) = (1/2)ln[(1+z)/(1-z)]
    const z = Complex.parse(z_);
    return Complex.mult(0.5, Complex.log(Complex.div(Complex.add(1, z), Complex.sub(1, z))));
  }

  /** Calculate log() of a complex number [natural log] */
  public static log(z_: any) {
    const z = Complex.parse(z_);
    return new Complex(Math.log(z.getMag()), z.getArg());
  }

  /** Calculate log base a of b */
  public static logab(a_: any, b_: any) {
    const a = Complex.parse(a_);
    const b = Complex.parse(b_);
    return Complex.div(Complex.log(b), Complex.log(a));
  }

  /** Is this not-a-number? */
  public static isNaN(z_: any) {
    const z = Complex.parse(z_);
    return isNaN(z.a) || isNaN(z.b);
  }

  /** Is this finite? */
  public static isFinite(z_: any) {
    const z = Complex.parse(z_);
    return isFinite(z.a) && isFinite(z.b);
  }

  /** Calculatemagnitude o a complex number */
  public static abs(z_: any) {
    return Complex.parse(z_).getMag();
  }

  /** square root */
  public static sqrt(z_: any) {
    const z = Complex.parse(z_);
    return Complex.pow(z, 0.5);
  }

  /** cube root */
  public static cbrt(z_: any) {
    const z = Complex.parse(z_);
    return Complex.pow(z, 1 / 3);
  }

  /** Return ceiling of a number */
  public static ceil(z_: any) {
    return _zapply(z_, Math.ceil);
  }

  /** Return floor of a number */
  public static floor(z_: any) {
    return _zapply(z_, Math.floor);
  }

  /** Return rounded value of z to specified decimal places, or to whole integer */
  public static round(z_: any, dp_?: number) {
    if (dp_ === undefined) return _zapply(z_, Math.round);
    const z = Complex.parse(z_);
    const K = Math.pow(10, dp_);
    return new Complex(Math.round(z.a * K) / K, Math.round(z.b * K) / K);
  }

  /** Calculate Math.exp of a complex number */
  public static exp(z_: any) {
    // exp(a + bi) = e^a * [ cos(b) + isin(b) ]
    const z = Complex.parse(z_);
    const ea = Math.exp(z.a); // e ^ a
    return new Complex(ea * Math.cos(z.b), ea * Math.sin(z.b));
  }

  /** Generate complex number from polar representation */
  public static fromPolar(r: number, θ: number) {
    return new Complex(r * Math.cos(θ), r * Math.sin(θ));
  }

  /** Return complex unit */
  public static get I() { return new Complex(0, 1); }

  /** Return not-a-number */
  public static get NaN() { return new Complex(NaN, NaN); }

  /** Return infinity */
  public static get Inf() { return new Complex(Infinity, Infinity); }

  /** Attemot to parse argument to a complex number */
  public static parse(z: any) {
    if (z instanceof Complex) return z;
    if (typeof z === 'number' || typeof z === 'boolean') return new Complex(+z, 0);
    if (typeof z === 'bigint') return new Complex(Number(z), 0);
    if (typeof z === 'string') {
      let parts = z.split(/(?=[\-\+])/).map(x => x.trim()).filter(x => x.length > 0);
      let complex: Complex;
      if (parts.length === 1) {
        complex = new Complex(+parts[0], 0);
      } else if (parts.length === 2 && parts[1].indexOf('i') !== -1) {
        let imag = parts[1].replace('i', '');
        if (imag === '-' || imag === '+') imag += '1';
        complex = new Complex(+parts[0], +imag);
      }
      if (complex && !Complex.isNaN(complex)) return complex;
    }
    throw new TypeError(`Expected Complex, got ${typeof z} ${z}`);
  }

  /** Make sure input may be casted to a complex number. Else, return false. */
  public static is(value: any) {
    try {
      return Complex.parse(value);
    } catch (e) {
      return false;
    }
  }
}

// Apply a function to a complex number
export function _zapply(arg: any, fn: Function) {
  const z = Complex.parse(arg);
  z.a = fn(z.a);
  z.b = fn(z.b);
  return z;
}