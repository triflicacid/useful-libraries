import { poly_recurrence } from "./polynomial";

/**
 * Returns reccurence relation for the Fibonacci sequence
 * 
 * `a[n+1] = a[n] + a[n-1]`, `a[0] = 0, a[1] = 1`
*/
export const fibonacci = () => poly_recurrence([{ 0: 1 }, { 0: 1 }], [{ 0: 0 }, { 0: 1 }]);

/**
 * Returns reccurence relation for the Padovan sequence
 * 
 * `a[n+1] = a[n-1] + a[n-2]`, `a[0] = a[1] = a[2] = 1`
*/
export const padovan = () => poly_recurrence([{}, { 0: 1 }, { 0: 1 }], [{ 0: 1 }, { 0: 1 }, { 0: 1 }]);

/**
 * Returns reccurence relation for the Perrin sequence
 * 
 * `a[n+1] = a[n-1] + a[n-2]`, `a[0] = 3, a[1] = 0, a[2] = 2`
*/
export const perrin = () => poly_recurrence([{}, { 0: 1 }, { 0: 1 }], [{ 0: 3 }, {}, { 0: 2 }]);

/**
 * Returns reccurence relation for Chebyshev polynomial of the first kind, T[n]
 * 
 * `T[n+1] = 2x T[n] - T[n-1]`, `T[0] = 1, T[1] = x`
*/
export const chebyshevFirstKind = () => poly_recurrence([{ 1: 2 }, { 0: -1 }], [{ 0: 1 }, { 1: 1 }]);

/**
 * Returns reccurence relation for shifted Chebyshev polynomial of the first kind, `T*[n]`
 * 
 * `T*[n+1] = 2(2x-1) T*[n] - T*[n-1]`, `T*[0] = 1, T*[1] = 2x-1`
*/
export const chebyshevFirstKindShifted = () => poly_recurrence([{ 0: -2, 1: 4 }, { 0: -1 }], [{ 0: 1 }, { 0: -1, 1: 2 }]);

/**
 * Returns reccurence relation for Chebyshev polynomial of the second kind, U[n]
 * 
 * `U[n+1] = 2x U[n] - U[n-1]`, `U[0] = 1, U[1] = 2x`
*/
export const chebyshevSecondKind = () => poly_recurrence([{ 1: 2 }, { 0: -1 }], [{ 0: 1 }, { 1: 2 }]);

/**
 * Returns reccurence relation for shifted Chebyshev polynomial of the second kind, `U*[n]`
 * 
 * `U*[n+1] = 2(2x-1) U*[n] - U*[n-1]`, `U*[0] = 1, U*[1] = 4x-2`
*/
export const chebyshevSecondKindShifted = () => poly_recurrence([{ 0: -2, 1: 4 }, { 0: -1 }], [{ 0: 1 }, { 0: -2, 1: 4 }]);

/**
 * Returns reccurence relation for Chebyshev polynomial of the third kind, V[n]
 * 
 * `V[n+1] = 2x V[n] - V[n-1]`, `V[0] = 1, V[1] = 2x-1`
*/
export const chebyshevThirdKind = () => poly_recurrence([{ 1: 2 }, { 0: -1 }], [{ 0: 1 }, { 0: -1, 1: 2 }]);

/**
 * Returns reccurence relation for shifted Chebyshev polynomial of the third kind, `V*[n]`
 * 
 * `V*[n+1] = 2(2x-1) V*[n] - V*[n-1]`, `V*[0] = 1, V*[1] = 4x-3`
*/
export const chebyshevThirdKindShifted = () => poly_recurrence([{ 0: -2, 1: 4 }, { 0: -1 }], [{ 0: 1 }, { 0: -3, 1: 4 }]);

/**
 * Returns reccurence relation for Chebyshev polynomial of the fourth kind, W[n]
 * 
 * `W[n+1] = 2x W[n] - W[n-1]`, `W[0] = 1, W[1] = 2x+1`
*/
export const chebyshevFourthKind = () => poly_recurrence([{ 1: 2 }, { 0: -1 }], [{ 0: 1 }, { 0: 1, 1: 2 }]);

/**
 * Returns reccurence relation for shifted Chebyshev polynomial of the fourth kind, `W*[n]`
 * 
 * `W*[n+1] = 2(2x-1) W*[n] - W*[n-1]`, `W*[0] = 1, W*[1] = 4x-1`
*/
export const chebyshevFourthKindShifted = () => poly_recurrence([{ 0: -2, 1: 4 }, { 0: -1 }], [{ 0: 1 }, { 0: -1, 1: 4 }]);