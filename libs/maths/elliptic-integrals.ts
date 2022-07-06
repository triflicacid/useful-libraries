/**
 * Calculates Legendre's Elliptic Integral of the first kind, F(φ, k)
 * 
 * F(φ, k) = integrate 1/sqrt(1-k^2 sin^2(t)) between 0->φ, where φ is the amplitude, k is the modulus
 * 
 * - arg = k => k is the modulus (*default*)
 * - arg = a => a is the modular angle (rad)
 * - arg = a => m is the parameter
 */
export function legendresEllipticIntegralFirst(phi: number, x: number, arg: 'k' | 'a' | 'm' = 'k') {
  if (phi === 0) return 0;
  if (x === 0) return phi;
  let sgn = phi >= 0 ? 1 : -1;
  let m: number, k: number;
  switch (arg) {
    case 'm':
      m = x;
      k = Math.sqrt(Math.abs(m));
      break;
    case 'a':
      k = Math.abs(Math.sin(x));
      m = k * k;
      break;
    default:
      k = Math.abs(x);
      m = k * k;
  }
  if (m > 0 && m < 1) {
    return sgn * leifSmallM(Math.abs(phi), m).F;
  }
  if (m < 0) {
    if (Math.abs(phi) > pi_2) return sgn * Infinity;
    x = Math.tan(phi);
    return sgn * Math.log(Math.abs(x) + Math.sqrt(1 + x * x));
  }
  return sgn * leifLargeModulus(Math.abs(phi), k);
}

/**
 * Calculates the Complete Elliptic integral of the first kind, K(k)
 * 
 * K(k) = integral 1/sqrt(1-k^2 sin^2(t)) between 0->pi/2
 * 
 * - arg = k => k is the modulus (*default*)
 * - arg = a => a is the modular angle (rad)
 * - arg = a => m is the parameter
 */
export function completeEllipticIntegralFirst(x: number, arg: 'k' | 'a' | 'm' = 'k') {
  if (x === 0) return pi_2;
  let k: number, m: number;
  switch (arg) {
    case 'm':
      m = x;
      k = Math.sqrt(Math.abs(x));
      break;
    case 'a':
      k = Math.sin(x);
      m = k * k;
      break;
    default:
      k = Math.abs(x);
      m = k * k;
  }
  if (m === 1) return Infinity;
  let a = 0, g = Math.sqrt(1 - m), a_old: number, g_old: number;
  while (true) {
    g_old = g;
    a_old = a;
    a = 0.5 * (g_old + a_old);
    g = Math.sqrt(g_old * a_old);
    if (Math.abs(a_old - g_old) <= a_old * epsilon) break;
  }
  return pi_2 / g;
}

/**
 * Calculates Legendre's Elliptic Integral of the second kind, E(φ, k)
 * 
 * E(φ, k) = integrate sqrt(1-k^2 sin^2(t)) between 0->φ
 * 
 * - arg = k => k is the modulus (*default*)
 * - arg = a => a is the modular angle (rad)
 * - arg = a => m is the parameter
 */
export function legendresEllipticIntegralSecond(amplitude: number, x: number, arg: 'k' | 'a' | 'm' = 'k') {
  if (amplitude === 0) return 0;
  if (x === 0) return amplitude;
  let sgn = amplitude >= 0 ? 1 : -1;
  let m: number, k: number;
  switch (arg) {
    case 'm':
      m = x;
      k = Math.sqrt(Math.abs(m));
      break;
    case 'a':
      k = Math.sin(x);
      m = k * k;
      break;
    default:
      k = Math.abs(x);
      m = k * k;
  }
  if (m > 0 && m < 1) {
    return sgn * leisSmallM(Math.abs(amplitude), m)[1];
  }
  if (m < 0) {
    let phi = pi_2 - Math.abs(amplitude);
    let [Em, Em_phi] = leisSmallM(Math.abs(phi), Math.abs(m / (1 - m)));
    return phi > pi_2 ? (sgn * (Em + Em_phi) * Math.sqrt(1 - m)) : (sgn * (Em - Em_phi) * Math.sqrt(1 - m));
  }
  if (m === 1) {
    if (Math.abs(amplitude) <= pi_2) return Math.sin(amplitude);
    let n = (amplitude + pi_2) / pi;
    n += n;
    return n + Math.sin(amplitude - n * pi);
  }
  return sgn * leisLargeModulus(Math.abs(amplitude), k);
}

/**
 * Calculates the Complete Elliptic integral of the second kind, E(k)
 * 
 * E(k) = integral sqrt(1-k^2 sin^2(t)) between 0->pi/2
 * 
 * - arg = k => k is the modulus (*default*)
 * - arg = a => a is the modular angle (rad)
 * - arg = a => m is the parameter
 */
export function completeEllipticIntegralSecond(x: number, arg: 'k' | 'a' | 'm' = 'k') {
  if (x === 0) return pi_2;
  let k: number, m: number;
  switch (arg) {
    case 'm':
      m = x;
      k = Math.sqrt(Math.abs(x));
      break;
    case 'a':
      k = Math.sin(x);
      m = k * k;
      break;
    default:
      k = Math.abs(x);
      m = k * k;
  }
  if (m === 1) return 1;
  let a = 1, g = Math.sqrt(1 - m), two_n = 1, Ek = 2 - m, a_old: number, g_old: number;
  while (true) {
    g_old = g;
    a_old = a;
    a = 0.5 * (g_old + a_old);
    g = a_old * g_old;
    two_n += two_n;
    Ek -= two_n * (a * a - g);
    if (Math.abs(a_old - g_old) <= a_old * epsilon) break;
    g = Math.sqrt(g);
  }
  return (pi_4 / a) * Ek;
}

/**
 * Calculated Legendre's Elliptic Integral of the First kind F(phi | m) for 0<m<1
 * 
 * @returns `{ K: number, F: number }` where K is the complete elliptic integral, F is the incomplete elliptic integral
 */
function leifSmallM(phi: number, m: number) {
  let n = (phi + pi_2) / pi;
  phi -= n * pi;
  n += n;
  let { K, F } = leifLandenTransform(Math.abs(phi), m);
  F = phi >= 0 ? (F + n * K) : (n * K - F);
  return { K, F };
}

/**
 * Calculated Legendre's Elliptic Integral of the Second kind E(phi | m) for 0<m<1
 * 
 * @returns `[Em: number, Em_phi: number]` where Em is the complete elliptic integral E(pi/2 | m), Em_phi is the incomplete elliptic integral E(phi | m)
 */
function leisSmallM(phi: number, m: number) {
  let n = (phi + pi_2) / pi;
  phi -= n * pi;
  n += n;
  let [F, Fk, Em_phi, Em] = leisLandenTransform(Math.abs(phi), m);
  Em_phi = phi >= 0 ? (Em_phi + n * Em) : (n * Em - Em_phi);
  return [Em, Em_phi];
}

/**
 * Calculated Legendre's Elliptic Integral of the First kind F(phi, k) for k>1
 */
function leifLargeModulus(phi: number, k: number) {
  let n = (phi + pi_2) / pi;
  phi -= n * pi;
  n += n;
  let sin_phi = Math.sin(phi);
  if (Math.abs(sin_phi) >= 1 / k) phi = phi > 0 ? pi_2 : -pi_2;
  else phi = Math.asin(k * sin_phi);
  let { K, F } = leifLandenTransform(Math.abs(phi), 1 / (k * k));
  F = phi >= 0 ? (F + n * K) : (n * k - F);
  return F / k;
}

/**
 * Calculated Legendre's Elliptic Integral of the Second kind E(phi, k) for k>1
 */
function leisLargeModulus(phi: number, k: number) {
  let n = (phi + pi_2) / pi;
  phi -= n * pi;
  n += n;
  let sin_phi = Math.sin(phi);
  if (Math.abs(sin_phi) >= 1 / k) phi = phi > 0 ? pi_2 : -pi_2;
  else phi = Math.asin(k * sin_phi);
  let [F, K, E, Ek] = leisLandenTransform(Math.abs(phi), 1 / (k * k));
  Ek = k * Ek + (1 - k * k) * K / k;
  E = k * E + (1 - k * k) * F / k;
  E = phi >= 0 ? (E + n * Ek) : (n * Ek - E);
  return E;
}

/**
 * @param parameter modulus of k^2
 * @returns K - complete elliptic integral, F - incomplete elliptic integral
 */
function leifLandenTransform(phi: number, parameter: number) {
  let two_n = 1;
  let a = 1;
  let g = Math.sqrt(1 - parameter);
  let a_old: number, g_old: number, tan_2n_phi: number;

  while (true) {
    tan_2n_phi = Math.tan(phi);
    two_n += two_n;
    phi += phi - Math.atan((a - g) * tan_2n_phi / (a + g * tan_2n_phi * tan_2n_phi));
    g_old = g;
    a_old = a;
    a = 0.5 * (g_old + a_old);
    g = Math.sqrt(g_old * a_old);
    if (Math.abs(a_old - g_old) <= (a_old * epsilon)) break;
  }
  phi /= two_n;
  return { F: phi / g, K: pi_2 / g };
}

/**
 * @param parameter modulus of k^2
 * @returns [F, Fk, E, Ek]
 * - `F` - incomplete elliptic integral of 1st kind, 0<parameter<1, 0<amplitude<pi/2
 * - `Fk` - complete elliptic integral of 1st kind, 0<parameter<1
 * - `E` - incomplete elliptic integral of the 2nd kind, 0<parameter<1
 * - `Ek` - complete elliptic integral of the 2nd kind, 0<parameter<1
 */
function leisLandenTransform(phi: number, parameter: number) {
  let two_n = 1;
  let a = 1;
  let g = Math.sqrt(1 - parameter);
  let a_old: number, g_old: number, tan_2n_phi: number;
  let sum = 2 * (2 - parameter);
  let integral = 0;

  while (true) {
    tan_2n_phi = Math.tan(two_n * phi);
    sum -= two_n * (a - g) * (a - g);
    two_n += two_n;
    phi -= Math.atan((a - g) * tan_2n_phi / (a + g * tan_2n_phi * tan_2n_phi)) / two_n;
    integral += (a - g) * Math.sin(two_n * phi);
    g_old = g;
    a_old = a;
    a = 0.5 * (g_old + a_old);
    g = Math.sqrt(g_old * a_old);
    if (Math.abs(a_old - g_old) <= a_old * epsilon) break;
  }
  return [phi / g, pi_2 / g, 0.5 * integral + 0.25 * sum * phi / g, (pi_4 / a) * sum / 2.0];
}

const pi = 3.1415926535897932384626433832795029;
const pi_2 = 1.5707963267948966192313216916397514;
const pi_4 = 0.7853981633974483096156608458198757;
const epsilon = 2.2204460492503131e-16;