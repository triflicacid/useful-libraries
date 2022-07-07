/**
 * Gaussian function is defined as `f(x) = a exp(-(x-b)^2/(2c^2))`
 */
export function gaussian(x: number, a: number, b: number, c: number) {
  if (c === 0) return NaN;
  return a * Math.exp(-Math.pow(x - b, 2) / (2 * c * c));
}

/**
 * Normal distribution function, which is a variation of the Gaussian function with mean `m` and standard deviation `sd`
 * - `a = 1/(sd sqrt(2pi))`
 * - `b = `m`
 * - `c = sqrt(sd^2)`
 */
export function normalDist(x: number, m = 0, sd = 1) {
  return 1 / (sd * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow(x - m, 2) / (sd * sd));
}