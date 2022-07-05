const e = 2.71828182845904523536028747;
const pi = 3.14159265358979323846264338;
const g = 9.65657815377331589457187;
const exp_g_o_sqrt_2pi = 6.23316569877722552586386e+3;
const maxArg = 1755.5;

const a = [
  +1.14400529453851095667309e+4,
  -3.23988020152318335053598e+4,
  +3.50514523505571666566083e+4,
  -1.81641309541260702610647e+4,
  +4.63232990536666818409138e+3,
  -5.36976777703356780555748e+2,
  +2.28754473395181007645155e+1,
  -2.17925748738865115560082e-1,
  +1.08314836272589368860689e-4
];

/** Compute the gamma function at a given real number x
 * http://www.mymathlib.com/c_source/functions/gamma_beta/gamma_function.c
*/
export function gamma(x: number) {
  let g = gammax(x);
  return g < 0 ? -Infinity : g;
}

function gammax(x: number) {
  if (x > 0) return x <= maxArg ? gammaLancoz(x) : Infinity;
  let sinx = Math.sin(pi * x);
  if (sinx === 0) return Infinity;
  if (x < -(maxArg - 1)) return 0;
  let rg = gammaLancoz(1 - x) * sinx / pi;
  return rg === 0 ? Infinity : 1 / rg;
}

/** Use Lanczos' approximation to calculate Gamma(x) for 0 < x <= 900. Use duplication formula for 900 < x < 1755.5 */
function gammaLancoz(x: number) {
  if (x > 1755.5) return Infinity;
  if (x > 900) return gammaDupFormula(x);
  let xx = x < 1 ? x + 1 : x, temp = 0, n = a.length;
  for (let i = n - 1; i >= 0; i--) {
    temp += a[i] / (xx + i);
  }
  temp += 1;
  temp *= Math.pow((g + xx - 0.5) / e, xx - 0.5) / exp_g_o_sqrt_2pi;
  return x < 1 ? temp / x : temp;
}

/** Use duplication formula Gamma(2x) = (2^(2x-1) / sqrt(pi)) Gamma(x) Gamma(x+1/2) */
function gammaDupFormula(two_x: number) {
  let x = 0.5 * two_x, n = two_x - 1;
  let g = Math.pow(2, two_x - 1 - n);
  g = g * Math.pow(2, n);
  g /= Math.sqrt(pi);
  g *= gammax(x);
  g *= gammax(x + 0.5);
  return g;
}