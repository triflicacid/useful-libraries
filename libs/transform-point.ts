//#region 2D Transformations
/**
 * Translate coordinate `<x,y>` by `<tx,ty>` to obtain `<x',y'>`
 */
export function translate_2d(x: number, y: number, tx: number, ty: number) {
  return [x + tx, y + ty];
}

/**
 * Rotate given coordinate `<x,y>` by `angle` radians **anticlockwise** around the origin to obtain `<x',y'>`
 */
export function rotate_2d(x: number, y: number, angle: number) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [x * c - y * s, x * s + y * c];
}

/**
 * Scale given coordinate `<x,y>` by `sx` in the X direction and `sy` in the Y direction to obtain `<x',y'>`
 */
export function scale_2d(x: number, y: number, sx: number, sy: number) {
  return [sx * x, sy * y];
}

/**
 * Reflect given point `<x,y>` in line `y=mx+c` where `m` and `c` are given, to obtain `<x',y'>`
 */
export function reflect_2d(x: number, y: number, m: number, c: number) {
  const xi = (x + m * y - m * c) / (m * m + 1);
  const yi = m * xi + c;
  return [2 * xi - x, 2 * yi - y];
}

/**
 * Reflect given point `<x,y>` in X-axis to obtain `<x',y'>`
 */
export function reflectX_2d(x: number, y: number) {
  return [x, -y];
}

/**
 * Reflect given point `<x,y>` in Y-axis to obtain `<x',y'>`
 */
export function reflectY_2d(x: number, y: number) {
  return [-x, y];
}
//#endregion

//#region 3D Transformations
/**
 * Translate coordinate `<x,y,z>` by `<tx,ty,tz>` to obtain `<x',y',z'>`
 */
export function translate_3d(x: number, y: number, z: number, tx: number, ty: number, tz: number) {
  return [x + tx, y + ty, z + tz];
}

/**
 * Scale given coordinate `<x,y,z>` by `sx` in the X direction, `sy` in the Y direction and `sz` in the Z direction to obtain `<x',y',z'>`
 */
export function scale_3d(x: number, y: number, z: number, sx: number, sy: number, sz: number) {
  return [sx * x, sy * y, sz * z];
}

/**
 * Reflect given point `<x,y,z>` in X=0 to obtain `<x',y',z'>`
 */
export function reflectX_3d(x: number, y: number, z: number) {
  return [-x, y, z];
}

/**
 * Reflect given point `<x,y,z>` in Y=0 to obtain `<x',y',z'>`
 */
export function reflectY_3d(x: number, y: number, z: number) {
  return [x, -y, z];
}

/**
 * Reflect given point `<x,y,z>` in Z=0 to obtain `<x',y',z'>`
 */
export function reflectZ_3d(x: number, y: number, z: number) {
  return [x, y, -z];
}

/**
 * Rotate given coordinate `<x,y,z>` by `angle` radians **anticlockwise** around the X-axis to obtain `<x',y',z'>`
 */
export function rotateX_3d(x: number, y: number, z: number, angle: number) {
  return [x, y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)];
}

/**
 * Rotate given coordinate `<x,y,z>` by `angle` radians **anticlockwise** around the Y-axis to obtain `<x',y',z'>`
 */
export function rotateY_3d(x: number, y: number, z: number, angle: number) {
  return [x * Math.cos(angle) + z * Math.sin(angle), y, -x * Math.sin(angle) + z * Math.cos(angle)];
}

/**
 * Rotate given coordinate `<x,y,z>` by `angle` radians **anticlockwise** around the Z-axis to obtain `<x',y',z'>`
 */
export function rotateZ_3d(x: number, y: number, z: number, angle: number) {
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle), z];
}

/**
 * Rotate given coordinate `<x,y,z>` by given angles `a`, `b`, `c` to obtain `<x',y',z'>`
 *
 * `a`, `b`, `c` are alpha, beta, and gamma Euler angles (https://en.wikipedia.org/wiki/Euler_angles)
 */
export function rotate_3d(x: number, y: number, z: number, a: number, b: number, c: number) {
  return [
    x * Math.cos(b) * Math.cos(c) + y * Math.sin(a) * Math.sin(b) * Math.cos(c) - y * Math.cos(a) * Math.sin(c) + z * Math.cos(a) * Math.sin(b) * Math.cos(c) + z * Math.sin(a) * Math.sin(c),
    x * Math.cos(b) * Math.sin(c) + y * Math.sin(a) * Math.sin(b) * Math.sin(c) + y * Math.cos(a) * Math.cos(c) + z * Math.cos(a) * Math.sin(b) * Math.sin(c) - z * Math.sin(a) * Math.cos(c),
    -x * Math.sin(b) + y * Math.sin(a) * Math.cos(b) + z * Math.cos(a) * Math.cos(b)
  ];
}
//#endregion