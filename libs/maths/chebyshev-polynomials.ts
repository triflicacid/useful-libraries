//#region 1st kind
/**
 * Evaluates the Chebyshev polynomial of the first kind, T_n(x)
 */
export function chebyshevFirst(x: number, n: number) {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (n === 1) return x;
  if (Math.abs(x) === 1) {
    if (x > 0) return 1;
    if (n % 2 === 0) return 1;
    return -1;
  }
  if (n > 6 && Math.abs(x) < 1) return Math.cos(n * Math.acos(x));
  let twox = x + x;
  let T0 = 1, T1 = x, Tn = 0;
  for (let k = 2; k <= n; k++) {
    Tn = twox * T1 - T0;
    T0 = T1;
    T1 = Tn;
  }

  return Tn;
}

/**
 * Evaluates the Chebyshev polynomial of the first kind, T_n(x), using
 * the recurrence formula T[n+1](x) = 2x T[n](x) - T[n-1](x), T[0](x) = 1, T[1](x) = x
 * @returns array of values from T[0] up to T[max]
 */
export function chebyshevFirstSequence(x: number, max: number) {
  const T: number[] = [];
  if (max < 0) return T;
  T[0] = 1;
  if (max === 0) return T;
  T[1] = x;
  if (max === 1) return T;
  let twox = x + x;
  for (let k = 2; k <= max; k++) T[k] = twox * T[k - 1] - T[k - 2];
  return T;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*T[1](x) + a[2]*T[2](x) + ... + a[deg]*T[deg](x)`
 */
export function chebyshevFirstSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox = x + x;
  for (let k = degree; k >= 1; k--, yp2 = yp1, yp1 = y) {
    y = twox * yp1 - yp2 + a[k];
  }
  return x * yp1 - yp2 * a[0];
}
//#endregion

//#region 1st kind shifted
/**
 * Evaluates the Shifted Chebyshev polynomial of the first kind, T*_n(x)
 */
export function chebyshevShiftedFirst(x: number, n: number) {
  if (n < 0) return 0;
  if (x === 1) return 1;
  if (x === 0) return n % 2 === 0 ? 1 : -1;

  let twox_m1 = x + x - 1;
  let fourx_m2 = 2 * twox_m1;

  if (n === 0) return 1;
  if (n === 1) return twox_m1;
  if (n > 6 && Math.abs(twox_m1) < 1) return Math.cos(n * Math.acos(twox_m1));
  let T0 = 1, T1 = twox_m1, Tn = 0;
  for (let k = 2; k <= n; k++) {
    Tn = fourx_m2 * T1 - T0;
    T0 = T1;
    T1 = Tn;
  }

  return Tn;
}

/**
 * Evaluates the Shifted Chebyshev polynomial of the first kind, T*_n(x), using
 * the recurrence formula `T*[n+1](x) = 2(2x - 1) T*[n](x) - T*[n-1](x)`, `T*[0](x) = 1`, `T*[1](x) = 2x-1`
 * @returns array of values from T[0] up to T[max]
 */
export function chebyshevShiftedFirstSequence(x: number, max: number) {
  const T: number[] = [];
  if (max < 0) return T;
  T[0] = 1;
  if (max === 0) return T;
  let twox_m1 = x + x - 1;
  T[1] = twox_m1;
  if (max === 1) return T;
  let fourx_m2 = 2 * twox_m1;
  for (let k = 2; k <= max; k++) T[k] = fourx_m2 * T[k - 1] - T[k - 2];
  return T;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*T*[1](x) + a[2]*T*[2](x) + ... + a[deg]*T*[deg](x)`
 */
export function chebyshevShiftedFirstSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox_m1 = x + x - 1, fourx_m2 = 2 * twox_m1;
  for (let k = degree; k >= 1; k--, yp2 = yp1, yp1 = y) {
    y = fourx_m2 * yp1 - yp2 + a[k];
  }
  return twox_m1 * yp1 - yp2 * a[0];
}
//#endregion

//#region 2nd kind
/**
 * Evaluates the Chebyshev polynomial of the second kind, U_n(x)
 */
export function chebyshevSecond(x: number, n: number) {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (Math.abs(x) === 1) {
    if (x > 0) return n + 1;
    if (n % 2 == 0) return n + 1;
    return -(n + 1);
  }

  let twox = x + x;
  if (n === 1) return twox;
  if (n > 8 && Math.abs(x) < 1) {
    let theta = Math.acos(x);
    let sin_theta = Math.sin(theta);
    if (sin_theta !== 0)
      return Math.sin((n + 1) * theta) / sin_theta;
    else
      return (n + 1) * Math.cos((n + 1) * theta) / x;
  }

  let U0 = 1, U1 = twox, Un = 0;
  for (let k = 2; k <= n; k++) {
    Un = twox * U1 - U0;
    U0 = U1;
    U1 = Un;
  }
  return Un;
}

/**
 * Evaluates the Chebyshev polynomial of the second kind, U_n(x), using
 * the recurrence formula U[n+1](x) = 2x U[n](x) - U[n-1](x), U[0](x) = 1, U[1](x) = 2x
 * @returns array of values from U[0] up to U[max]
 */
export function chebyshevSecondSequence(x: number, max: number) {
  const U: number[] = [];
  if (max < 0) return U;
  U[0] = 1;
  if (max === 0) return U;
  let twox = x + x;
  U[1] = twox;
  if (max === 1) return U;
  for (let k = 2; k <= max; k++) U[k] = twox * U[k - 1] - U[k - 2];
  return U;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*U[1](x) + a[2]*U[2](x) + ... + a[deg]*U[deg](x)`
 */
export function chebyshevSecondSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox = x + x;
  for (let k = degree; k >= 0; k--, yp2 = yp1, yp1 = y) {
    y = twox * yp1 - yp2 + a[k];
  }
  return y;
}
//#endregion

//#region 2nd kind shifted
/**
 * Evaluates the Shifted Chebyshev polynomial of the second kind, U*_n(x)
 */
export function chebyshevShiftedSecond(x: number, n: number) {
  let twox_m1 = x + x - 1;
  let fourx_m2 = twox_m1 + twox_m1;
  let xn1 = n + 1;

  if (n < 0) return 0;
  if (n === 0) return 1;
  if (n === 1) return fourx_m2;
  if (x === 1) return xn1;
  if (x === 0) return n % 2 === 0 ? xn1 : -xn1;
  if (n > 6 && Math.abs(twox_m1) < 1) {
    let theta = Math.acos(twox_m1);
    let sin_theta = Math.sin(theta);
    if (sin_theta !== 0)
      return Math.sin(xn1 * theta) / sin_theta;
    else
      return xn1 * Math.cos(xn1 * theta) / twox_m1;
  }

  let U0 = 1, U1 = fourx_m2, Un = 0;
  for (let k = 2; k <= n; k++) {
    Un = fourx_m2 * U1 - U0;
    U0 = U1;
    U1 = Un;
  }
  return Un;
}

/**
 * Evaluates the Shifted Chebyshev polynomial of the second kind, U*_n(x), using
 * the recurrence formula `U*[k+1](x) = 2(2x - 1) U*[k](x) - U*[k-1](x)`, `U[0](x)` = 1, `U[1](x) = 4x - 2`
 * @returns array of values from U[0] up to U[max]
 */
export function chebyshevShiftedSecondSequence(x: number, max: number) {
  const U: number[] = [];
  if (max < 0) return U;
  U[0] = 1;
  if (max === 0) return U;
  let twox_m1 = x + x - 1;
  let fourx_m2 = twox_m1 + twox_m1;
  U[1] = fourx_m2;
  if (max === 1) return U;
  for (let k = 2; k <= max; k++) U[k] = fourx_m2 * U[k - 1] - U[k - 2];
  return U;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*U*[1](x) + a[2]*U*[2](x) + ... + a[deg]*U*[deg](x)`
 */
export function chebyshevShiftedSecondSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox_m1 = x + x - 1, fourx_m2 = twox_m1 * 2;
  for (let k = degree; k >= 0; k--, yp2 = yp1, yp1 = y) {
    y = fourx_m2 * yp1 - yp2 + a[k];
  }
  return y;
}
//#endregion

//#region 3rd kind
/**
 * Evaluates the Chebyshev polynomial of the third kind, V_n(x)
 */
export function chebyshevThird(x: number, n: number) {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (Math.abs(x) === 1) {
    if (x > 0) return 1;
    if (n % 2 == 0) return n + n + 1;
    return -(n + n + 1);
  }

  let twox = x + x;
  if (n === 1) return twox - 1;
  if (n > 8 && Math.abs(x) < 1) {
    let theta = Math.acos(x);
    let sin_theta2 = Math.sin(theta / 2);
    let cos_theta2 = Math.cos(theta / 2);
    if (sin_theta2 != 1)
      return Math.cos((n + 0.5) * theta) / cos_theta2;
    else
      return (n % 2 == 0) ? (n + n + 1) : -(n + n + 1);
  }

  let V0 = 1, V1 = twox - 1, Vn = 0;
  for (let k = 2; k <= n; k++) {
    Vn = twox * V1 - V0;
    V0 = V1;
    V1 = Vn;
  }
  return Vn;
}

/**
 * Evaluates the Chebyshev polynomial of the third kind, V_n(x), using
 * the recurrence formula V[n+1](x) = 2x V[n](x) - V[n-1](x), V[0](x) = 1, V[1](x) = 2x-1
 * @returns array of values from V[0] up to V[max]
 */
export function chebyshevThirdSequence(x: number, max: number) {
  const V: number[] = [];
  if (max < 0) return V;
  V[0] = 1;
  if (max === 0) return V;
  let twox = x + x;
  V[1] = twox - 1;
  if (max === 1) return V;
  for (let k = 2; k <= max; k++) V[k] = twox * V[k - 1] - V[k - 2];
  return V;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*V[1](x) + a[2]*V[2](x) + ... + a[deg]*V[deg](x)`
 */
export function chebyshevThirdSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox = x + x;
  for (let k = degree; k >= 1; k--, yp2 = yp1, yp1 = y) {
    y = twox * yp1 - yp2 + a[k];
  }
  return (twox - 1) * yp1 - yp2 + a[0];
}
//#endregion

//#region 3rd kind shifted
/**
 * Evaluates the Shifted Chebyshev polynomial of the third kind, V*_n(x)
 */
export function chebyshevShiftedThird(x: number, n: number) {
  let twox_m1 = x + x - 1;
  let fourx_m2 = twox_m1 + twox_m1;

  if (n < 0) return 0;
  if (n === 0) return 1;
  if (n === 1) return fourx_m2 - 1;
  if (x === 1) return 1;
  if (x === 0) return n % 2 === 0 ? (n + n + 1) : -(n + n + 1);
  if (n > 6 && Math.abs(twox_m1) < 1) {
    let theta = Math.acos(twox_m1);
    let sin_theta2 = Math.sin(theta / 2);
    let cos_theta2 = Math.cos(theta / 2);
    if (sin_theta2 !== 1)
      return Math.cos((n + 0.5) * theta) / cos_theta2;
    else
      return (n % 2 == 0) ? (n + n + 1) : -(n + n + 1);
  }

  let V0 = 1, V1 = fourx_m2 - 1, Vn = 0;
  for (let k = 2; k <= n; k++) {
    Vn = fourx_m2 * V1 - V0;
    V0 = V1;
    V1 = Vn;
  }
  return Vn;
}

/**
 * Evaluates the Shifted Chebyshev polynomial of the third kind, V*_n(x), using
 * the recurrence formula `V*[n+1](x) = 2(2x - 1) V*[n](x) - V*[n-1](x)`, `V[0](x)` = 1, `V[1](x) = 4x - 3`
 * @returns array of values from U[0] up to U[max]
 */
export function chebyshevShiftedThirdSequence(x: number, max: number) {
  const V: number[] = [];
  if (max < 0) return V;
  V[0] = 1;
  if (max === 0) return V;
  let twox_m1 = x + x - 1, fourx_m2 = twox_m1 + twox_m1;
  V[1] = fourx_m2 - 1;
  if (max === 1) return V;
  for (let k = 2; k <= max; k++) V[k] = fourx_m2 * V[k - 1] - V[k - 2];
  return V;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*V*[1](x) + a[2]*V*[2](x) + ... + a[deg]*V*[deg](x)`
 */
export function chebyshevShiftedThirdSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox_m1 = x + x - 1, fourx_m2 = twox_m1 * 2;
  for (let k = degree; k >= 1; k--, yp2 = yp1, yp1 = y) {
    y = fourx_m2 * yp1 - yp2 + a[k];
  }
  return (fourx_m2 - 1) * yp1 - yp2 + a[0];
}
//#endregion

//#region 4th kind
/**
 * Evaluates the Chebyshev polynomial of the fourth kind, W_n(x)
 */
export function chebyshevFourth(x: number, n: number) {
  if (n < 0) return 0;
  if (n === 0) return 1;
  if (Math.abs(x) === 1) {
    if (x > 0) return n + n + 1;
    return (n % 2 === 0) ? 1 : -1;
  }

  let twox = x + x;
  if (n === 1) return twox + 1;
  if (n > 8 && Math.abs(x) < 1) {
    let theta = Math.acos(x);
    let sin_theta2 = Math.sin(theta / 2);
    let cos_theta2 = Math.cos(theta / 2);
    if (cos_theta2 !== 1)
      return Math.sin((n + 0.5) * theta) / sin_theta2;
    else {
      if (x > 0) return n + n + 1;
      return n % 2 === 0 ? 1 : -1;
    }
  }

  let W0 = 1, W1 = twox + 1, Wn = 0;
  for (let k = 2; k <= n; k++) {
    Wn = twox * W1 - W0;
    W0 = W1;
    W1 = Wn;
  }
  return Wn;
}

/**
 * Evaluates the Chebyshev polynomial of the fourth kind, W_n(x), using
 * the recurrence formula W[n+1](x) = 2x W[n](x) - W[n-1](x), W[0](x) = 1, W[1](x) = 2x+1
 * @returns array of values from W[0] up to W[max]
 */
export function chebyshevFourthSequence(x: number, max: number) {
  const W: number[] = [];
  if (max < 0) return W;
  W[0] = 1;
  if (max === 0) return W;
  let twox = x + x;
  W[1] = twox + 1;
  if (max === 1) return W;
  for (let k = 2; k <= max; k++) W[k] = twox * W[k - 1] - W[k - 2];
  return W;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*W[1](x) + a[2]*W[2](x) + ... + a[deg]*W[deg](x)`
 */
export function chebyshevFourthSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox = x + x;
  for (let k = degree; k >= 1; k--, yp2 = yp1, yp1 = y) {
    y = twox * yp1 - yp2 + a[k];
  }
  return (twox + 1) * yp1 - yp2 + a[0];
}
//#endregion

//#region 4th kind shifted
/**
 * Evaluates the Shifted Chebyshev polynomial of the fourth kind, W*_n(x)
 */
export function chebyshevShiftedFourth(x: number, n: number) {
  let twox_m1 = x + x - 1;
  let fourx_m2 = twox_m1 + twox_m1;

  if (n < 0) return 0;
  if (n === 0) return 1;
  if (n === 1) return fourx_m2 + 1;
  if (x === 1) return n + n + 1;
  if (x === 0) return n % 2 === 0 ? 1 : -1;
  if (n > 4 && Math.abs(twox_m1) < 1) {
    let theta = Math.acos(twox_m1);
    let sin_theta2 = Math.sin(theta / 2);
    let cos_theta2 = Math.cos(theta / 2);
    if (cos_theta2 !== 1)
      return Math.sin((n + 0.5) * theta) / sin_theta2;
    else
      return (n % 2 == 0) ? 1 : -1;
  }

  let W0 = 1, W1 = fourx_m2 + 1, Wn = 0;
  for (let k = 2; k <= n; k++) {
    Wn = fourx_m2 * W1 - W0;
    W0 = W1;
    W1 = Wn;
  }
  return Wn;
}

/**
 * Evaluates the Shifted Chebyshev polynomial of the fourth kind, W*_n(x), using
 * the recurrence formula `W*[n+1](x) = 2(2x - 1) W*[n](x) - W*[n-1](x)`, `W[0](x)` = 1, `W[1](x) = 4x - 1`
 * @returns array of values from U[0] up to U[max]
 */
export function chebyshevShiftedFourthSequence(x: number, max: number) {
  const W: number[] = [];
  if (max < 0) return W;
  W[0] = 1;
  if (max === 0) return W;
  let twox_m1 = x + x - 1, fourx_m2 = twox_m1 + twox_m1;
  W[1] = fourx_m2 + 1;
  if (max === 1) return W;
  for (let k = 2; k <= max; k++) W[k] = fourx_m2 * W[k - 1] - W[k - 2];
  return W;
}

/**
 * Evaluates p(x), where `p(x) = a[0] + a[1]*W*[1](x) + a[2]*W*[2](x) + ... + a[deg]*W*[deg](x)`
 */
export function chebyshevShiftedFourthSeries(x: number, a: number[], degree: number) {
  if (degree < 0) return 0;
  let yp1 = 0, yp2 = 0, y = 0;
  let twox_m1 = x + x - 1, fourx_m2 = twox_m1 * 2;
  for (let k = degree; k >= 1; k--, yp2 = yp1, yp1 = y) {
    y = fourx_m2 * yp1 - yp2 + a[k];
  }
  return (fourx_m2 + 1) * yp1 - yp2 + a[0];
}
//#endregion