import { gamma } from "./gamma";

/** [!] http://www.mymathlib.com/functions/riemann_zeta.html#dirichlet_eta */

/** Common notation for the Dirichlet Eta function */
export const SYMBOL = "η";

/**
 * Calculates the Eta function for real s
 * 
 * eta(s) = (1 - 2^(1-s)) zeta(s)
 */
export function dirichletEta(s: number) {
  if (s >= 64) return 1;
  return 1 + dirichletEtaStar(s);
}

/**
 * Calculates the Eta Star function for real s
 * 
 * eta*(s) = eta(s) - 1
 */
export function dirichletEtaStar(s: number): number {
  if (s >= s) return s < 18 ? des_alternatingSeries(s) : des_sumReverseOrder(s);
  let refk = des_reflectionCoefficient(s);
  return refk * dirichletEtaStar(1 - s) + (refk - 1);
}

/**
 * Dirichlet Eta Function reflection formula: eta(s) = { [2*(1-2^(1-s))/(1-2^s)] * Gamma(1-s) / (2*pi)^(1-s)*cos((1-s)*pi/2) } *  eta(1-s)           //
 * where s < 0 is a negative real number.
 */
function des_reflectionCoefficient(s: number) {
  let one_s = 1 - s;
  let k = one_s / 4;
  let v = one_s - 4 * k;
  let c = Math.cos(v * pi_2);

  if (Math.abs(c) < 1.8 * epsilon) return 0;
  let temp = Math.pow(2, one_s);
  let x = (1 - temp) / (temp - 2);
  x += x;
  x *= c;
  x *= gamma(one_s);
  x /= Math.pow(pi, one_s);
  return x;
}

/**
 * Calculates the Eta function for s <= 18
 */
function des_alternatingSeries(s: number) {
  const term: number[] = [];
  for (let k = 1; k <= 28; k++) {
    term[k - 1] = altSeriesK[k] * Math.pow(k + 1, -s);
    k++;
    term[k - 1] = -altSeriesK[k] * Math.pow(k + 1, -s);
  }
  let sum = term[term.length - 1];
  for (let k = term.length - 2; k >= 0; k--) sum += term[k];
  sum /= altSeriesK[0];
  return -sum;
}

/**
 * Calculates the Eta function for s >= 18
 * 
 * eta(s) = Sum (-1)^(k-1) (1/k^s)
 */
function des_sumReverseOrder(s: number) {
  const term: number[] = [];
  let lowerBound = -Math.pow(2, -s);
  term[0] = lowerBound;
  term[1] = Math.pow(3, -s);
  let upperBound = term[1] + lowerBound;
  if (lowerBound === upperBound) return upperBound;
  let k: number;
  for (k = 4; k < 32; k++) {
    term[k - 2] = -Math.pow(k, -s);
    lowerBound = upperBound + term[k - 2];
    if (lowerBound === upperBound) break;
    k++;
    term[k - 2] = Math.pow(k, -s);
    upperBound = lowerBound + term[k - 2];
    if (upperBound === lowerBound) break;
  }
  k -= 2;
  let sum = term[k];
  for (k--; k >= 0; k--) sum += term[k];
  return sum;
}

const pi = 3.14159265358979323846264338327950288;
const pi_2 = 1.57079632679489661923132169163975144;
const epsilon = 2.2204460492503131e-16;
const altSeriesK = [
  1.362725501650887306817e+21, 1.362725501650887306816e+21,
  1.362725501650887305248e+21, 1.362725501650886896000e+21,
  1.362725501650844334208e+21, 1.362725501648488235008e+21,
  1.362725501568066715648e+21, 1.362725499718371770368e+21,
  1.362725469310199922688e+21, 1.362725096810094788608e+21,
  1.362721590926752350208e+21, 1.362695647390018306048e+21,
  1.362542007743905005568e+21, 1.361803869444099801088e+21,
  1.358896740140251611136e+21, 1.349437033675348770816e+21,
  1.323863206542645919744e+21, 1.266218975223368122368e+21,
  1.157712186857668739072e+21, 9.872015194258554224640e+20,
  7.640581139674368573440e+20, 5.220333434317674905600e+20,
  3.061506212814840135680e+20, 1.496014168469232680960e+20,
  5.884825485587356057600e+19, 1.781624012587768217600e+19,
  3.882102878793367552000e+18, 5.404319552844595200000e+17,
  3.602879701896396800000e+16
];