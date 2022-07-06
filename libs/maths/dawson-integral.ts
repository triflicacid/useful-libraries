/** [!] http://www.mymathlib.com/functions/dawsons_integral.html */

import { chebyshevFirstSeries } from "./chebyshev-polynomials";

/**
 * Calculates the Dawson integral, defined as Daw(x) = integrate exp(-x^2) exp(t^2) between 0->x
 */
export function dawsonIntegral(x: number) {
  let ax = Math.abs(x);
  if (ax <= 1) return dPowerSeries(x);
  if (ax <= 1.75) return dChebyshevExpansion_1_175(x);
  if (ax <= 2.50) return dChebyshevExpansion_175_250(x);
  if (ax <= 3.25) return dChebyshevExpansion_250_325(x);
  if (ax <= 4.25) return dChebyshevExpansion_325_425(x);
  if (ax <= 5.50) return dChebyshevExpansion_425_550(x);
  if (ax <= 7.25) return dChebyshevExpansion_550_725(x);
  return dAsymptoticExpansion(x);
}

/**
 * Evaluates the Dawson integral -1 <= x <= 1
 * 
 * Daw(x) = x Sum [(-2x^2)^j / (2j + 1)!!
 */
function dPowerSeries(x: number) {
  if (x === 0) return 0;
  let twox2 = -2 * x * x;
  let sum = 0;
  let term = 1;
  let factorial = 1;
  let xn = 1;
  let ep = epsilon / 2;
  let y = 0;
  do {
    sum += term;
    y += 1;
    factorial *= 2 * y + 1;
    xn *= twox2;
    term = xn / factorial;
  } while (Math.abs(term) > ep * Math.abs(sum));
  return x * sum;
}

/** Chebyschev expansion of Daw(x) for 1 <= |x| <= 1.75 */
function dChebyshevExpansion_1_175(x: number) {
  const c = [
    + 4.563960711239483142081e-1, -9.268566100670767619861e-2,
    -7.334392170021420220239e-3, +3.379523740404396755124e-3,
    -3.085898448678595090813e-4, -1.519846724619319512311e-5,
    +4.903955822454009397182e-6, -2.106910538629224721838e-7,
    -2.930676220603996192089e-8, +3.326790071774057337673e-9,
    +3.335593457695769191326e-11, -2.279104036721012221982e-11,
    +7.877561633156348806091e-13, +9.173158167107974472228e-14,
    -7.341175636102869400671e-15, -1.763370444125849029511e-16,
    +3.792946298506435014290e-17, -4.251969162435936250171e-19,
    -1.358295820818448686821e-19, +5.268740962820224108235e-21,
    +3.414939674304748094484e-22
  ];
  let daw = chebyshevFirstSeries((Math.abs(x) - 1.375) / 0.375, c, c.length - 1);
  return x > 0 ? daw : -daw;
}

/** Chebyschev expansion of Daw(x) for 1.75 <= |x| <= 2.50 */
function dChebyshevExpansion_175_250(x: number) {
  const c = [
    +2.843711194548592808550e-1, -6.791774139166808940530e-2,
    +6.955211059379384327814e-3, -2.726366582146839486784e-4,
    -6.516682485087925163874e-5, +1.404387911504935155228e-5,
    -1.103288540946056915318e-6, -1.422154597293404846081e-8,
    +1.102714664312839585330e-8, -8.659211557383544255053e-10,
    -8.048589443963965285748e-12, +6.092061709996351761426e-12,
    -3.580977611213519234324e-13, -1.085173558590137965737e-14,
    +2.411707924175380740802e-15, -7.760751294610276598631e-17,
    -6.701490147030045891595e-18, +6.350145841254563572100e-19,
    -2.034625734538917052251e-21, -2.260543651146274653910e-21,
    +9.782419961387425633151e-23
  ];
  let daw = chebyshevFirstSeries((Math.abs(x) - 2.125) / 0.375, c, c.length - 1);
  return x > 0 ? daw : -daw;
}

/** Chebyschev expansion of Daw(x) for 2.50 <= |x| <= 3.25 */
function dChebyshevExpansion_250_325(x: number) {
  const c = [
    +1.901351274204578126827e-1, -3.000575522193632460118e-2,
    +2.672138524890489432579e-3, -2.498237548675235150519e-4,
    +2.013483163459701593271e-5, -8.454663603108548182962e-7,
    -8.036589636334016432368e-8, +2.055498509671357933537e-8,
    -2.052151324060186596995e-9, +8.584315967075483822464e-11,
    +5.062689357469596748991e-12, -1.038671167196342609090e-12,
    +6.367962851860231236238e-14, +3.084688422647419767229e-16,
    -3.417946142546575188490e-16, +2.311567730100119302160e-17,
    -6.170132546983726244716e-20, -9.133176920944950460847e-20,
    +5.712092431423316128728e-21, +1.269641078369737220790e-23,
    -2.072659711527711312699e-23
  ];
  let daw = chebyshevFirstSeries((Math.abs(x) - 2.875) / 0.375, c, c.length - 1);
  return x > 0 ? daw : -daw;
}

/** Chebyschev expansion of Daw(x) for 3.25 <= |x| <= 4.25 */
function dChebyshevExpansion_325_425(x: number) {
  const c = [
    +1.402884974484995678749e-1, -2.053975371995937033959e-2,
    +1.595388628922920119352e-3, -1.336894584910985998203e-4,
    +1.224903774178156286300e-5, -1.206856028658387948773e-6,
    +1.187997233269528945503e-7, -1.012936061496824448259e-8,
    +5.244408240062370605664e-10, +2.901444759022254846562e-11,
    -1.168987502493903926906e-11, +1.640096995420504465839e-12,
    -1.339190668554209618318e-13, +3.643815972666851044790e-15,
    +6.922486581126169160232e-16, -1.158761251467106749752e-16,
    +8.164320395639210093180e-18, -5.397918405779863087588e-20,
    -5.052069908100339242896e-20, +5.322512674746973445361e-21,
    -1.869294542789169825747e-22
  ];
  let daw = chebyshevFirstSeries((Math.abs(x) - 3.75) / 0.5, c, c.length - 1);
  return x > 0 ? daw : -daw;
}

/** Chebyschev expansion of Daw(x) for 4.25 <= |x| <= 5.50 */
function dChebyshevExpansion_425_550(x: number) {
  const c = [
    +1.058610209741581514157e-1, -1.429297757627935191694e-2,
    +9.911301703835545472874e-4, -7.079903107876049846509e-5,
    +5.229587914675267516134e-6, -4.016071345964089296212e-7,
    +3.231734714422926453741e-8, -2.752870944370338482109e-9,
    +2.503059741885009530630e-10, -2.418699000594890423278e-11,
    +2.410158905786160001792e-12, -2.327254341132174000949e-13,
    +1.958284411563056492727e-14, -1.099893145048991004460e-15,
    -2.959085292526991317697e-17, +1.966366179276295203082e-17,
    -3.314408783993662492621e-18, +3.635520318133814622089e-19,
    -2.550826919215104648800e-20, +3.830090587178262542288e-22,
    +1.836693763159216122739e-22
  ];
  let daw = chebyshevFirstSeries((Math.abs(x) - 4.875) / 0.625, c, c.length - 1);
  return x > 0 ? daw : -daw;
}

/** Chebyschev expansion of Daw(x) for 5.50 <= |x| <= 7.25 */
function dChebyshevExpansion_550_725(x: number) {
  const c = [
    +8.024637207807814739314e-2, -1.136614891549306029413e-2,
    +8.164249750628661856014e-4, -5.951964778701328943018e-5,
    +4.407349502747483429390e-6, -3.317746826184531133862e-7,
    +2.541483569880571680365e-8, -1.983391157250772649001e-9,
    +1.579050614491277335581e-10, -1.284592098551537518322e-11,
    +1.070070857004674207604e-12, -9.151832297362522251950e-14,
    +8.065447314948125338081e-15, -7.360105847607056315915e-16,
    +6.995966000187407197283e-17, -6.964349343411584120055e-18,
    +7.268789359189778223225e-19, -7.885125241947769024019e-20,
    +8.689022564130615225208e-21, -9.353211304381231554634e-22
    + 9.218280404899298404756e-23
  ];
  let daw = chebyshevFirstSeries((Math.abs(x) - 6.375) / 0.875, c, c.length - 1);
  return x > 0 ? daw : -daw;
}

/** Asymprotic expansion dor Daw(x) for large value of x
 * 
 * Daw(x) ~ (1/2x) [ 1 + 1 / (2x^2) + ... + (2j - 1)!! / (2x^2)^j + ... ]
 */
function dAsymptoticExpansion(x: number) {
  const term: number[] = [];
  let x2 = x * x, twox = x + x, twox2 = x2 + x2, xn = twox2, Sn = 0, factorial = 1, n: number;
  term[0] = 1;
  term[1] = 1 / xn;
  for (n = 2; n <= asyCutoff; n++) {
    xn *= twox2;
    factorial *= n + n - 1;
    term[n] = factorial / xn;
    if (term[n] < epsilon / 2) break;
  }
  if (n > asyCutoff) n = asyCutoff;
  for (; n >= 0; n--) Sn += term[n];
  return Sn / twox;
}

const epsilon = 2.2204460492503131e-16;
const asyCutoff = 50;