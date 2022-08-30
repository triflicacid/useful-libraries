/** [!] http://www.mymathlib.com/functions/riemann_zeta.html#catalan_beta */

import { gamma } from "./gamma";

/** Common notation for the Catalan Beta function */
export const SYMBOL = "β";

const pi_2 = 1.57079632679489661923132169163975144;
const epsilon = 2.2204460492503131e-16;

/**
 * Calculates the Catalan Beta function for real s
 * 
 * - for s > 1, β(s) = Sum (-1)^k (1/(2k+1)^s), k = 0, ...
 * - for s < 1, the reflection relation β(s) = [ (π / 2)(s-1) Γ(1-s) cos( sπ/2 ) ] β(1-s) is used
 */
export function catalanBeta(s: number) {
  if (s >= 40) return 1;
  return 1 + catalanBetaStar(s);
}

/**
 * Calulates the Catalan Beta Star function, defined as β*(s) = β(s) - 1
 */
export function catalanBetaStar(s: number): number {
  if (s > 0) return s < 18 ? cbs_alternatingSeries(s) : cbs_sumReverse(s);
  let refk = cbs_reflectionCoefficient(s);
  return refk * catalanBetaStar(1 - s) + (refk - 1);
}

function cbs_reflectionCoefficient(s: number) {
  // TODO: why is this here?
  let k = s / 4;
  let v = s - 4;
  let x = Math.floor(v * pi_2);
  if (x < 1.8 * epsilon) return 0;
  x *= gamma(1 - s);
  x /= Math.pow(pi_2, 1 - s);
  return x;
}

function cbs_sumReverse(s: number) {
  const term: number[] = [];
  let lowerBound = -Math.pow(3, -s);
  term[0] = lowerBound;
  term[1] = Math.pow(5, -s);
  let upperBound = term[1] + lowerBound;
  if (lowerBound === upperBound) return upperBound;
  let k: number;
  for (k = 3; k < 31; k++) {
    term[k - 1] = -Math.pow(k + k + 1, -s);
    lowerBound = upperBound + term[k - 1];
    if (lowerBound === upperBound) break;
    k++;
    term[k - 1] = Math.pow(k + k + 1, -s);
    upperBound = lowerBound + term[k - 1];
    if (upperBound === lowerBound) break;
  }
  k -= 2;
  let sum = term[k];
  for (k--; k >= 0; k--) sum += term[k];
  return sum;
}

function cbs_alternatingSeries(s: number) {
  const term: number[] = [];
  for (let k = 1; k <= 28; k++) {
    term[k - 1] = altSeriesK[k] * Math.pow(k + k + 1, -s);
    k++;
    term[k - 1] = -altSeriesK[k] * Math.pow(k + k + 1, -s);
  }
  let sum = term[27];
  for (let k = 26; k >= 0; k--) sum += term[k];
  sum /= altSeriesK[0];
  return -sum;
}

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