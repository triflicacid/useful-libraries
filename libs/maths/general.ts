import { IPolynomial } from "./polynomial";

export function factorial(n: number) {
  for (let k = n - 1; k > 1; --k) n *= k;
  return n;
}

/**
 * Return function to generate the nth Bernoulli polynomial
 * @param a_0 Initial value of the sequence
 */
export function bernoulliPolynomials(a_0?: IPolynomial) {
  const B: number[][] = []; // Store as array of coefficients, a_n
  if (a_0) {
    let max = Math.max(...Object.keys(a_0).map(x => +x));
    B[0] = Array.from({ length: max + 1 }, (_, i) => a_0[i] ?? 0);
  } else {
    B[0] = [1];
  }
  function generate(n: number) {
    for (let i = B.length; i <= n; i++) {
      const a = B[i - 1], p: number[] = [];
      p[0] = -i * a.map((_, k) => a[k] / ((k + 1) * (k + 2))).reduce((a, b) => a + b, 0);
      a.forEach((_, k) => p[k + 1] = i * a[k] / (k + 1));
      for (let j = p.length - 1; j > -1; --j) if (Math.abs(p[j]) <= Number.EPSILON) p[j] = 0;
      B[i] = p;
    }
    return B;
  }
  return (n: number) => generate(n)[n].reduce((o, c, i) => {
    if (c !== 0) o[i] = c;
    return o;
  }, {} as IPolynomial);
}

/**
 * Return function to generate the kth Bernoulli number
 * @param B0 Value of first Bernoulli number (default=1)
 */
export function bernoulliNumbers(B0 = 1) {
  const B = [B0];
  const T = pascalsTriangle();

  function next() {
    let S = 0, n = B.length, C = T(n + 1);
    for (let k = 0; k < n; ++k) S += C[k] * B[k];
    let b = -S / (n + 1);
    B[n] = b;
  }

  return function (k: number) {
    if (k !== 1 && k % 2 === 1) return 0;
    while (k >= B.length) next();
    return B[k];
  }
}

/**
 * Returns function to return the `row` row of Pascals triangle
 * 
 * (better then using bonimial combination for binomial coefficients as factorials grow really fast)
 */
export function pascalsTriangle() {
  const tri = [[1]];

  function next() {
    const last = tri[tri.length - 1];
    let row = Array.from({ length: last.length + 1 }, (_, k) => (last[k - 1] || 0) + (last[k] || 0));
    tri[tri.length] = row;
    return row;
  }

  return function (row: number) {
    if (row < 0) return [];
    while (row >= tri.length) next();
    return tri[row];
  }
}

let _pascTri = pascalsTriangle();

/** Return the binomial combination function, n choose k, C(n, k) */
export function choose(n: number, k: number) {
  if (k < 1 || k > n) return 0;
  let C = _pascTri(n);
  return C[k];
}

/** Return the Stirling Number of the 2nd kind S(n,k) */
export function stirlingNumber(n: number, k: number) {
  if (k < 1 || k > n) return 0;
  let C = _pascTri(k), S = 0;
  for (let i = 0; i <= k; ++i)
    S += (i % 2 === 0 ? 1 : -1) * C[i] * (k - i) ** n;
  return 1 / factorial(k) * S;
}

/**
 * Suppose that `n^k` can be written as a combination of binomial coefficients `C(n,k)`,
 * `n^k = Sum[C(n,m) beta(k,m), {m=1, k}]`.
 * This function returns `beta(k, m)`
 */
export function beta(k: number, m: number) {
  if (m < 1 || m > k) return 0;
  let C = _pascTri(m), S = 0;
  for (let r = 0; r <= m; ++r)
    S += (r % 2 === 0 ? 1 : -1) * C[r] * (m - r) ** k;
  return S;
}