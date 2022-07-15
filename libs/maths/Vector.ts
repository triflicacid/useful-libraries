/**
 * Represents a vector with 4 components, default all 1
 * 
 * Some methods only work if a vector is of a certain dimension, and some methods provide different methods for different dimensions
 * 
 * **Note** Vector is *immutable*
 */
export class Vector {
  public x: number;
  public y: number;
  public z: number;
  public w: number; // Mainly for 3D matrix multiplications which require 4 elements

  public constructor(x: number, y: number, z = 1, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /** Return as string `<x,y,z,w>` */
  public toString() {
    return `<${this.x},${this.y},${this.z},${this.w}>`;
  }

  /** Return copy of this Vector */
  public copy() {
    return new Vector(this.x, this.y, this.z, this.w);
  }

  /** Add two vectors: a + b */
  public static add(a: Vector, b: Vector) {
    return new Vector(
      a.x + b.x,
      a.y + b.y,
      a.z + b.z,
      a.w + b.w,
    );
  }

  /** Subtract two vectors: a - b */
  public static sub(a: Vector, b: Vector) {
    return new Vector(
      a.x - b.x,
      a.y - b.y,
      a.z - b.z,
      a.w - b.w,
    );
  }

  /** Multiply a vecctor by a constant */
  public static mul(v: Vector, k: number) {
    return new Vector(k * v.x, k * v.y, k * v.z, k * v.w);
  }

  /** Divide a vecctor by a constant */
  public static div(v: Vector, k: number) {
    return new Vector(v.x / k, v.y / k, v.z / k, v.w / k);
  }

  /** Return normalised input vector */
  public static normalise(v: Vector) {
    let m = Math.hypot(v.x, v.y, v.z, v.w);
    return m === 0 ? v.copy() : new Vector(v.x / m, v.y / m, v.z / m, v.w / m);
  }

  /** Return normalised input vector in 3D */
  public static normalise3D(v: Vector) {
    let m = Math.hypot(v.x, v.y, v.z);
    return m === 0 ? v.copy() : new Vector(v.x / m, v.y / m, v.z / m, v.w);
  }

  /** Return normalised input vector in 2D */
  public static normalise2D(v: Vector) {
    let m = Math.hypot(v.x, v.y);
    return m === 0 ? v.copy() : new Vector(v.x / m, v.y / m, v.z, v.w);
  }

  /** Calculate the vector dot product between two 3D vectors: a.b */
  public static dot(a: Vector, b: Vector) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /** Calculate the vector cross product of two vectors: a x between
   * 
   * NB regard a and b as 3D vectors `<x,y,z>`, Returned vector has `w=0`
  */
  public static cross(a: Vector, b: Vector) {
    return new Vector(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x,
      0
    );
  }

  /**
   * Return distance between a point P and a plane descibed by `r.n=k`
   * 
   * `planeN` must be **normalised**
  */
  public static distancePointPlane(planeN: Vector, planeP: Vector, p: Vector) {
    return planeN.x * p.x + planeN.y * p.y + planeN.z * p.z - Vector.dot(planeN, planeP);
  }

  /**
   * Return point of intersection between a line and a plane
   * 
   * `planeN` must be **normalised**
   */
  public static intersectLinePlane(planeN: Vector, planeP: Vector, lineStart: Vector, lineEnd: Vector) {
    const planeD = -Vector.dot(planeN, planeP); // Distance from plane to origin (shortest)
    const ad = Vector.dot(lineStart, planeN);
    const bd = Vector.dot(lineEnd, planeN);
    const t = (-planeD - ad) / (bd - ad);
    const lineDir = Vector.sub(lineEnd, lineStart); // Vector along line direction
    const lineToIntersect = Vector.mul(lineDir, t); // Vector pointing to intersection
    return Vector.add(lineStart, lineToIntersect);
  }
}