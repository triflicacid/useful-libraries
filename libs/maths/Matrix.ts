import { Vector } from "./Vector";

/**
 * Represents a matrix (this.matrix is a 2-D array)
 * Each element is an instance of Complex
 */
export class Matrix {
  protected matrix: number[][];

  /**
   * To create a matrix, use Matrix['from'...] methods
   * Sets value given durectly to <#Matrix>.matrix
   */
  constructor(m?: number[][]) {
    this.matrix = m ?? [];
    if (!Matrix.isLegal(this.matrix)) throw new Error(`new Matrix() :: Invalid matrix ${this.matrix}`);
  }

  get rows() { return this.matrix.length; }
  get cols() { return this.matrix.length === 0 ? 0 : this.matrix[0].length; }

  /** Get number in (row, col) */
  public get(r: number, c: number) {
    return this.matrix[r]?.[c];
  }

  /** Get a given row */
  public getRow(r: number) {
    return this.matrix[r];
  }

  /** Set (row, col) to <arg> */
  public set(r: number, c: number, n: number) {
    this.matrix[r][c] = n
    return this;
  }

  /** Set a given row */
  public setRow(r: number, values: number[]) {
    if (values.length !== this.matrix[r].length) throw new Error(`Expected ${this.matrix[r].length} values, got ${values.length}`);
    this.matrix[r] = values;
    return this;
  }

  /** Swap two rows */
  public swapRows(r1: number, r2: number) {
    let tmp = this.matrix[r1];
    this.matrix[r1] = this.matrix[r2];
    this.matrix[r2] = tmp;
    return this;
  }

  /** Flatten matrix -> returns array */
  public flatten() { return this.matrix.flat(); }

  /** Is this a square matrix? */
  public isSquare() { return this.rows === this.cols; }

  /** Check if two matrices are equal */
  public equals(arg: Matrix) {
    return arg instanceof Matrix ? this.toString() === arg.toString() : false;
  }

  /** Return copy of matrix */
  public copy() {
    return new Matrix(this.matrix.map(row => ([...row])));
  }

  /** Apply a function to each item in the matrix */
  public apply(fn: (n: number, row: number, col: number) => number) {
    return new Matrix(this.matrix.map((_, r) => this.matrix[r].map((_, c) => +(fn(this.matrix[r][c], r, c)))));
  }

  /** Scalar adition: returns new Matrix */
  public scalarAdd(n: number) {
    return this.apply(x => x + n);
  }

  /** Scalar add to a single row: returns new matrix */
  public scalarAddRow(row: number, n: number) {
    const matrix = this.copy();
    matrix.setRow(row, matrix.getRow(row).map(e => e + n));
    return matrix;
  }

  /** Scalar subtraction: returns new Matrix */
  public scalarSub(n: number) {
    return this.apply(x => x - n);
  }

  /** Scalar multiplication: returns new Matrix */
  public scalarMult(n: number) {
    return this.apply(x => x * n);
  }

  /** Scalar multiplication to a single row: returns new matrix */
  public scalarMultRow(row: number, n: number) {
    const matrix = this.copy();
    matrix.setRow(row, matrix.getRow(row).map(e => e * n));
    return matrix;
  }

  /** Scalar division: returns new Matrix */
  public scalarDiv(n: number) {
    return this.apply(x => x / n);
  }

  /** raise to integer power */
  public pow(exp: number) {
    if (!this.isSquare()) throw E_SQUARE;
    if (exp === 0) return Matrix.identity(this.rows) // 0 -> identity matrix
    if (exp === 1) return this.copy(); // 1 -> same
    if (exp === -1) return this.inverse(); // -1 -> inverse
    let inter: Matrix = this;
    if (exp < 0) {
      inter = this.inverse();
      exp = Math.abs(exp);
    }
    if (exp > 1) {
      let res = inter;
      for (let i = exp; i > 1; i--) {
        res = Matrix.mult(res, inter);
      }
      inter = res;
    }
    return inter;
  }

  /** Count occurences of a number in the given row */
  public countOccurences(n: number, row: number) {
    let count = 0;
    this.matrix[row].forEach(e => {
      if (e === n) count++;
    });
    return count;
  }

  /** Transpose this matrix: returns new Matrix */
  public transpose() {
    const mat: number[][] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!mat[c]) mat[c] = [];
        mat[c][r] = this.matrix[r][c];
      }
    }
    return new Matrix(mat);
  }

  /** Calculate the determinant */
  public determinant() {
    return Matrix.determinant(this);
  }

  /** Get minor matrix from position */
  public getMinor(row: number, col: number) {
    const minor: number[][] = [];
    for (let r = 0, ri = 0; r < this.rows; r++) {
      if (r === row) continue;
      minor[ri] = [];
      for (let c = 0; c < this.cols; c++) {
        if (c === col) continue; // Skip current column
        minor[ri].push(this.get(r, c));
      }
      ri++;
    }
    return new Matrix(minor);
  }

  /** Calculate matrix of minors */
  public getMinors() {
    const minors: number[][] = [];
    for (let r = 0; r < this.rows; r++) {
      minors[r] = [];
      for (let c = 0; c < this.cols; c++) {
        let minor = this.getMinor(r, c);
        let det = minor.determinant();
        minors[r][c] = det;
      }
    }
    return new Matrix(minors);
  }

  /** Return matrix in checkerboard + - + -... pattern. Either start with -1 or 1 (default: 1) */
  public checkerboard(start: 1 | -1 = 1) {
    let mat = this.copy(), neg = Math.sign(start) === -1;
    for (let r = 0; r < this.rows; r++, neg = !neg) {
      for (let c = 0, nneg = neg; c < this.cols; c++, nneg = !nneg) {
        if (nneg) {
          mat.set(r, c, -mat.get(r, c));
        }
      }
    }
    return mat;
  }

  /** Pad square matrix of size `n` to size `m` by making identity matrix, where `m` > `n` */
  public pad(newSize: number) {
    if (this.rows !== this.cols) throw E_SQUARE;
    const rows = this.rows, d = newSize - rows;
    const copy = this.copy();
    // Extend existing columns
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < d; i++) {
        copy.matrix[r][rows + i] = 0;
      }
    }
    for (let i = 0; i < d; i++) {
      copy.matrix[rows + i] = Array.from({ length: newSize }, () => 0);
      copy.matrix[rows + i][rows + i] = 1;
    }
    return copy;
  }

  /** calculate cofactor matrix */
  public cofactors() {
    return this.getMinors().checkerboard();
  }

  /** calculare inverse matrix */
  public inverse() {
    let inter = this.getMinors().checkerboard().transpose();
    return inter.scalarMult(1 / inter.determinant());
  }

  /** Return string representation as a flat string e.g "0 0 0; 0 0 0;" */
  public toString() {
    return this.matrix.map(a => a.join(' ')).join('; ') + ';';
  }

  /** Return string representation as an array e.g [[0,0,0],[0,0,0]] */
  public toArrayString() {
    return '[' + this.matrix.map(a => '[' + a.join(',') + ']').join(',') + ']';
  }

  /** Return values in first column */
  public toVector(col = 0) {
    let vec: number[] = [];
    for (let i = 0; i < this.matrix.length; i++) vec.push(this.matrix[i][col]);
    return vec;
  }

  public static fromDimensions(rows: number, cols: number, value = 0) {
    return new Matrix(Array.from({ length: cols }, () => new Array(rows).fill(value)));
  }

  /** Parse matrix from string: "v v v; v v v;" */
  public static fromString(string: string) {
    let arr = string.split(';').map(a => a.split(/\s/g).filter(a => a.length > 0).map(n => +n)).filter(a => a.length > 0);
    if (arr.length === 0) return new Matrix();
    let allNotNaN = arr.map(arr => arr.map(x => !isNaN(x)).every(x => x)).every(x => x);
    if (!allNotNaN) throw new Error(`Matrix string '${string}' :: invalid matrix string (found NaN value)`);
    let sameLength = arr.every(a => a.length === arr[0].length);
    if (!sameLength) throw new Error(`Matrix string '${string}' :: each row must be same length`);
    return new Matrix(arr);
  }

  /** Generate matrix from 1D array */
  public static fromArray(array: number[], rows: number, cols: number) {
    let marr: number[][] = [], tmp: number[] = [];
    for (let i = 0, c = 1; i < array.length && marr.length < rows; i++) {
      tmp.push(+(array[i]));
      if (c === cols) {
        c = 1;
        marr.push(tmp);
        tmp = [];
      } else {
        c++;
      }
    }
    if (tmp.length > 0) marr.push(tmp);
    return new Matrix(marr);
  }

  /** From Vector e.g. [1, 2, 3] */
  public static fromVector(...values: number[]) {
    let mat: number[][] = [];
    for (let i = 0; i < values.length; i++) {
      mat[i] = [values[i]];
    }
    return new Matrix(mat);
  }

  /** Check if an array is a legal matrix? <array> allows caller to control what is defined as an array */
  public static isLegal(arr: any, isArray = Array.isArray) {
    if (isArray(arr)) {
      for (let ar of arr) {
        if (isArray(ar)) {
          if (!ar.every(x => !isArray(x))) return false;
        } else {
          return false;
        }
      }
      return arr.every(a => a.length === arr[0].length);
    } else {
      return false;
    }
  }

  /** Add two matrices: a + b */
  public static add(a: Matrix, b: Matrix) {
    if (a.rows === b.rows && a.cols === b.cols) {
      return new Matrix(a.matrix.map((_, r) => a.matrix[r].map((_, c) => (a.matrix[r][c] + b.matrix[r][c]))));
    } else {
      throw E_SAMESIZE;
    }
  }

  /** Subtract two matrices: a - b */
  public static sub(a: Matrix, b: Matrix) {
    if (a.rows === b.rows && a.cols === b.cols) {
      return new Matrix(a.matrix.map((_, r) => a.matrix[r].map((_, c) => (a.matrix[r][c] - b.matrix[r][c]))));
    } else {
      throw E_SAMESIZE;
    }
  }

  /** Multiply two matrices: a * b */
  public static mult(a: Matrix, b: Matrix) {
    if (a.cols === b.rows) {
      const result = Matrix.zeroes(a.rows, b.cols);

      for (let r = 0; r < a.rows; ++r) {
        for (let c = 0; c < b.cols; ++c) {
          let sum = 0;
          for (let r2 = 0; r2 < b.rows; ++r2) {
            sum += a.matrix[r][r2] * b.matrix[r2][c];
          }
          result.matrix[r][c] = sum;
        }
      }
      return result;
    } else {
      throw new Error(`Matrix: unable to multiply (a.cols != b.rows)`);
    }
  }

  /** Multiply with a Vector: MV=V' */
  public static multVector(m: Matrix, v: Vector) {
    if (m.rows === 3) { // 3D
      return new Vector(
        v.x * m.matrix[0][0] + v.y * m.matrix[1][0] + v.z * m.matrix[2][0],
        v.x * m.matrix[0][1] + v.y * m.matrix[1][1] + v.z * m.matrix[2][1],
        v.x * m.matrix[0][2] + v.y * m.matrix[1][2] + v.z * m.matrix[2][2],
        v.w,
      );
    } else if (m.rows === 4) { // 3D + w
      return new Vector(
        v.x * m.matrix[0][0] + v.y * m.matrix[1][0] + v.z * m.matrix[2][0] + v.w * m.matrix[3][0],
        v.x * m.matrix[0][1] + v.y * m.matrix[1][1] + v.z * m.matrix[2][1] + v.w * m.matrix[3][1],
        v.x * m.matrix[0][2] + v.y * m.matrix[1][2] + v.z * m.matrix[2][2] + v.w * m.matrix[3][2],
        v.x * m.matrix[0][3] + v.y * m.matrix[1][3] + v.z * m.matrix[2][3] + v.w * m.matrix[3][3],
      );
    } else {
      throw new Error(`Cannot multiply matrix by Vector: matrix must have 3 or 4 rows, got ${m.rows}`);
    }
  }

  /** Calculate the determinant of a matrix */
  public static determinant(matrix: Matrix) {
    if (matrix.isSquare()) {
      if (matrix.rows === 1) return matrix.get(0, 0);
      if (matrix.rows === 2) return matrix.get(0, 0) * matrix.get(1, 1) - matrix.get(0, 1) * matrix.get(1, 0);

      let M = 1, det = 0;
      for (let c = 0; c < matrix.cols; c++) {
        let scalar = matrix.get(0, c), mat: number[][] = [];
        for (let r1 = 1, ri = 0; r1 < matrix.rows; r1++) {
          mat[ri] = [];
          for (let c1 = 0; c1 < matrix.cols; c1++) {
            if (c1 === c) continue; // Skip current column
            mat[ri].push(matrix.get(r1, c1));
          }
          ri++;
        }
        let inter = scalar * Matrix.determinant(new Matrix(mat));
        if (M) det += inter; else det -= inter;
        M ^= 1;
      }
      return det;
    } else {
      throw E_SQUARE;
    }
  }

  /** Given an array of transformations, where a[0] is applies first, then a[1] etc... Return a single matrix representing said transformation. */
  public static combineArray(array: Matrix[]) {
    if (array.length === 0) throw new Error("Error: array is empty");
    if (!array[0].isSquare()) throw new Error(`Expected matrix[0] to be square`);
    const dim = array[0].rows;
    for (let i = 0; i < array.length; i++)
      if (array[0].rows !== dim || array[0].cols !== dim)
        throw new Error(`Every matrix must have the same dimensions (matrix ${i})`);
    let acc = array[array.length - 1];
    for (let i = array.length - 2; i >= 0; i--)
      acc = Matrix.mult(acc, array[i]);
    return acc;
  }

  /** Is matrix in row echelon form? */
  public isRowEchelon() {
    const zeroes = this.matrix.map(row => row.findLastIndex((n: number) => n === 0));
    for (let i = 0; i < zeroes.length - 1; i++)
      if (zeroes[i] >= zeroes[i + 1]) return false;
    return true;
  }

  /**
   * Transforms matrix into Row Echelon Form
   * @param matrix Matrix to transform. NB it is **mutated**.
   * @param echo Matrix to echo changed in NB **mutated**.
   * @return Array of elementary matrices required to reproduce
  */
  public static toRowEchelonForm(matrix: Matrix, echo?: Matrix) {
    if (echo && matrix.rows !== echo.rows)
      throw new Error(`Matrices <matrix> and <echo> must have the same number of rows`);
    const sq = matrix.isSquare();
    const elementary: Matrix[] = [];

    // Bubble zeroes to end (basic bubble sort)
    let done = false;
    while (!done) {
      done = true;
      for (let i = 0; i < matrix.rows - 1; i++) {
        const c = matrix.countOccurences(0, i);
        const nc = matrix.countOccurences(0, i + 1);
        if (c > nc) {
          matrix.swapRows(i, i + 1);
          done = false;
          // Generate elementary matrix
          if (sq) {
            const I = Matrix.identity(matrix.cols);
            I.swapRows(i, i + 1);
            elementary.push(I);
          }
          // Echo?
          if (echo) echo.swapRows(i, i + 1);
        }
      }
    }

    let zeroAt = matrix.getRow(0).findIndex(n => n === 0);
    const op = (a: number, b: number, x: number, y: number) => x - (a / b) * y;

    for (let row = 1; row < matrix.rows; row++) {
      for (let col = 0; col <= zeroAt + 1; col++) {
        const a = matrix.get(row, col); // Value at current position - want to become 0
        if (a === 0) continue; // If valud is already zero, skip

        // Find row with a nonzero entry -- search above
        let target = row - 1, b = NaN;
        while (target >= 0) {
          b = matrix.get(target, col)
          if (b !== 0) break;
          target--;
        }
        if (isNaN(b)) continue; // Can't find entry

        const lastRow = matrix.getRow(target);
        const newRow = matrix.getRow(row).map((e, i) => op(a, b, e, lastRow[i])); // Make a 0 at this position
        matrix.setRow(row, newRow);
        // Echo?
        if (echo) {
          const lastRow = echo.getRow(target);
          const newRow = echo.getRow(row).map((e, i) => op(a, b, e, lastRow[i])); // Make a 0 at this position
          echo.setRow(row, newRow);
        }

        if (sq) { // Generate the elementary row operation matrix
          const I = Matrix.identity(matrix.cols);
          I.set(row, target, -a / b);
          elementary.push(I);
        }
      }
      zeroAt = matrix.getRow(row).findIndex(n => n === 0);
    }

    return elementary;
  }

  /**
   * Transforms matrix into Row Echelon Form
   * @param matrix Matrix to transform. NB it is **mutated**.
   * @param echo Matrix to echo changed in NB **mutated**.
   * @return Array of elementary matrices required to reproduce
  */
  public static toReducedRowEchelonForm(matrix: Matrix, echo?: Matrix) {
    if (echo && matrix.rows !== echo.rows)
      throw new Error(`Matrices <matrix> and <echo> must have the same number of rows`);
    let elementary: Matrix[];
    const sq = matrix.isSquare();

    // Convert to row echelon form first!
    if (matrix.isRowEchelon()) {
      elementary = [];
    } else {
      elementary = Matrix.toRowEchelonForm(matrix, echo);
    }

    const op = (a: number, b: number, x: number, y: number) => x - (a / b) * y;

    for (let row = matrix.rows - 1; row >= 0; row--) {
      let nonZeroAt = matrix.getRow(row).findIndex(n => n !== 0);

      // Remove all zeroes
      for (let col = matrix.cols - 1; col > nonZeroAt; col--) {
        const a = matrix.get(row, col); // Value at current position - want to become 0
        if (a === 0) continue; // If valud is already zero, skip

        // Find row with a nonzero entry -- search below
        let target = matrix.rows - 1, b = NaN;
        while (target > row) {
          b = matrix.get(target, col);
          if (b !== 0) break;
          target--;
        }
        if (isNaN(b)) continue; // If no nonzero entry, skip

        const lastRow = matrix.getRow(target);
        const newRow = matrix.getRow(row).map((e, i) => op(a, b, e, lastRow[i])); // Make a 0 at this position
        matrix.setRow(row, newRow);

        // Echo?
        if (echo) {
          const lastRow = echo.getRow(target);
          const newRow = echo.getRow(row).map((e, i) => op(a, b, e, lastRow[i])); // Make a 0 at this position
          echo.setRow(row, newRow);
        }

        if (sq) { // Generate the elementary row operation matrix
          const I = Matrix.identity(matrix.cols);
          I.set(row, target, -a / b);
          elementary.push(I);
        }
      }

      // Set pivot to one
      const k = 1 / matrix.get(row, nonZeroAt);
      if (k !== 1) {
        if (!isFinite(k)) console.log(k, matrix.toString())
        matrix.setRow(row, matrix.getRow(row).map(e => e * k));

        // Echo?
        if (echo) echo.setRow(row, echo.getRow(row).map(e => e * k));

        if (sq) { // Generate the elementary row operation matrix
          const I = Matrix.identity(matrix.cols);
          I.set(row, nonZeroAt, k);
          elementary.push(I);
        }
      }
    }
    return elementary;
  }

  /** Return new square matrix */
  public static square(size: number, n = 0) {
    return new Matrix(Array.from({ length: size }, (_, r) => Array.from({ length: size }, () => n)));
  }

  /** Return identity matrix */
  public static identity(size: number) {
    return new Matrix(Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => (r === c ? 1 : 0))));
  }

  /** Return a zero matrix */
  public static zeroes(rows: number, cols = -1) {
    if (cols === -1) cols = rows;
    return new Matrix(Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, () => 0)));
  }

  /** Create orthographic projection matrix from N to N-1 dimensions (default: 3 to 2). Perfect top-view, meaning Nth component (depth) is ignored, but may be incorporated using `k` */
  public static projectionOrthographic(N = 3, k = 1) {
    return new Matrix(Array.from({ length: N - 1 }, (_, r) => Array.from({ length: N }, (_, c) => (r === c ? k : 0))));
  }

  /**
   * Create projection matrix (4x4)
   * @param zNear Closest Z co-ordinate
   * @param zFar Fathest Z co-ordinate
   * @param fov Field of view (radians)
   * @param aspectR Aspect ratio (commonly height/width)
   */
  public static projectionDetail(zNear: number, zFar: number, fov: number, aspectR: number) {
    let t = 1 / Math.tan(fov * 0.5);
    return new Matrix([
      [aspectR * t, 0, 0, 0],
      [0, t, 0, 0],
      [0, 0, zFar / (zFar - zNear), 1],
      [0, 0, (-zFar * zNear) / (zFar - zNear), 1]
    ]);
  }

  /**
   * **CHEAT INVERSE: ONLY VALID FOR 4x4 MATRICES IN FORM `[ a 0 0 0; 0 b 0 0; 0 0 c 1 ; 0 0 d 1 ]`**
   * 
   * Return the inverse of a specifi 4x4 matric (e.g. as produced from projectionDetail)
   */
  public static inverseSpecial(m: Matrix) {
    const a = m.matrix[0][0], b = m.matrix[1][1], c = m.matrix[2][2], d = m.matrix[3][2];
    return new Matrix([
      [1 / a, 0, 0, 0],
      [0, 1 / b, 0, 0],
      [0, 0, -1 / (d - c), 1 / (d - c)],
      [0, 0, d / (d - c), -c / (d - c)],
    ]);
  }

  /** Create 2D translation matrix. Same as `translateND(x, y)` */
  public static translate2D(x: number, y: number) {
    return new Matrix([
      [1, 0, 0],
      [0, 1, 0],
      [x, y, 1],
    ]);
  }

  /** Create 2D rotation matrix, to rotate a point `phi` radians ANTICLOCKWISE around the origin. Same as `rotateXY(2, phi)` */
  public static rotate2D(phi: number) {
    return new Matrix([
      [Math.cos(phi), -Math.sin(phi)],
      [Math.sin(phi), Math.cos(phi)],
    ]);
  }

  /** Create 3D translation matrix. Same as `translateND(x, y, z)` */
  public static translate3D(x: number, y: number, z: number) {
    return new Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [x, y, z, 1],
    ]);
  }

  /** Create an N-dimensional translation matrix, where `N = values.length` */
  public static translateND(...values: number[]) {
    const mat = Matrix.identity(values.length + 1);
    for (let i = 0; i < values.length; i++)
      mat.matrix[values.length][i] = values[i];
    return mat;
  }

  /** Create 3D rotation matrix, to rotate a point `phi` radians ANTICLOCKWISE around the Z-axis. Same as `rotateXY(3, phi)` */
  public static rotate3DZ(phi: number) {
    return new Matrix([
      [Math.cos(phi), -Math.sin(phi), 0],
      [Math.sin(phi), Math.cos(phi), 0],
      [0, 0, 1],
    ]);
  }

  /** Create an N-dimensional (N > 1) rotational matrix, which will rotate a point `phi` radians anticlockwise about the XY plane */
  public static rotateXY(dim: number, phi: number) {
    if (dim <= 1) throw new Error(`Dimension must be greater than 1, got ${dim}`);
    const mat = Matrix.identity(dim);
    mat.matrix[0][0] = Math.cos(phi);
    mat.matrix[0][1] = -Math.sin(phi);
    mat.matrix[1][0] = Math.sin(phi);
    mat.matrix[1][1] = Math.cos(phi);
    return mat;
  }

  /** Create 3D rotation matrix, to rotate a point `phi` radians ANTICLOCKWISE around the X-axis. Same as `rotateYZ(3, phi)` */
  public static rotate3DX(phi: number) {
    return new Matrix([
      [1, 0, 0],
      [0, Math.cos(phi), -Math.sin(phi)],
      [0, Math.sin(phi), Math.cos(phi)],
    ]);
  }

  /** Create an N-dimensional (N > 2) rotational matrix, which will rotate a point `phi` radians anticlockwise about the YZ plane */
  public static rotateYZ(dim: number, phi: number) {
    if (dim <= 2) throw new Error(`Dimension must be greater than 2, got ${dim}`);
    const mat = Matrix.identity(dim);
    mat.matrix[1][1] = Math.cos(phi);
    mat.matrix[1][2] = -Math.sin(phi);
    mat.matrix[2][1] = Math.sin(phi);
    mat.matrix[2][2] = Math.cos(phi);
    return mat;
  }

  /** Create 3D rotation matrix, to rotate a point `phi` radians ANTICLOCKWISE around the Y-axis. Same as `rotateXZ(3, phi)` */
  public static rotate3DY(phi: number) {
    return new Matrix([
      [Math.cos(phi), 0, Math.sin(phi)],
      [0, 1, 0],
      [-Math.sin(phi), 0, Math.cos(phi)],
    ]);
  }

  /** Create an N-dimensional (N > 2) rotational matrix, which will rotate a point `phi` radians anticlockwise about the XZ plane */
  public static rotateXZ(dim: number, phi: number) {
    if (dim <= 2) throw new Error(`Dimension must be greater than 2, got ${dim}`);
    const mat = Matrix.identity(dim);
    mat.matrix[0][0] = Math.cos(phi);
    mat.matrix[0][2] = Math.sin(phi);
    mat.matrix[2][0] = -Math.sin(phi);
    mat.matrix[2][2] = Math.cos(phi);
    return mat;
  }

  /** Create an N-dimensional (N > 3) rotational matrix, which will rotate a point `phi` radians anticlockwise about the XW plane */
  public static rotateXW(dim: number, phi: number) {
    if (dim <= 3) throw new Error(`Dimension must be greater than 3, got ${dim}`);
    const mat = Matrix.identity(dim);
    mat.matrix[0][0] = Math.cos(phi);
    mat.matrix[0][3] = -Math.sin(phi);
    mat.matrix[3][0] = Math.sin(phi);
    mat.matrix[3][3] = Math.cos(phi);
    return mat;
  }

  /** Create an N-dimensional (N > 3) rotational matrix, which will rotate a point `phi` radians anticlockwise about the ZW plane */
  public static rotateZW(dim: number, phi: number) {
    if (dim <= 3) throw new Error(`Dimension must be greater than 3, got ${dim}`);
    const mat = Matrix.identity(dim);
    mat.matrix[2][2] = Math.cos(phi);
    mat.matrix[2][3] = -Math.sin(phi);
    mat.matrix[3][2] = Math.sin(phi);
    mat.matrix[3][3] = Math.cos(phi);
    return mat;
  }

  /**
   * Return matrix which will translate a given point `pos` onto `target`
   * @param pos Current position
   * @param target Target (new) position
   * @param up Vector pointing perpendicularly upwards from `pos`
  */
  public static translateToPointAt(pos: Vector, target: Vector, up: Vector) {
    let forward = Vector.sub(target, pos); // Vector pointing from pos to target
    forward = Vector.normalise3D(forward);
    // Factor in `y` elevation from `up`
    const diff = Vector.mul(forward, Vector.dot(up, forward));
    up = Vector.sub(up, diff);
    up = Vector.normalise3D(up);

    const right = Vector.cross(up, forward); // Right direction is perpendicular to forward and up (use hand rule)

    return new Matrix([
      [right.x, right.y, right.z, 0],
      [up.x, up.y, up.z, 0],
      [forward.x, forward.y, forward.z, 0],
      [pos.x, pos.y, pos.z, 1],
    ]);
  }

  /**
   * **CHEAT INVERSE: ONLY VALID FOR ROTATION/TRANSLATION 4x4 MATRICES**
   * 
   * Return the matrix inverser of a 4x4 rotation/translation matrix
   */
  public static inverseRotTrans(m: Matrix) {
    let M = Matrix.zeroes(4);
    M.matrix[0][0] = m.matrix[0][0];
    M.matrix[0][1] = m.matrix[1][0];
    M.matrix[0][2] = m.matrix[2][0];
    M.matrix[0][3] = 0;
    M.matrix[1][0] = m.matrix[0][1];
    M.matrix[1][1] = m.matrix[1][1]
    M.matrix[1][2] = m.matrix[2][1];
    M.matrix[1][3] = 0;
    M.matrix[2][0] = m.matrix[0][2];
    M.matrix[2][1] = m.matrix[1][2];
    M.matrix[2][2] = m.matrix[2][2];
    M.matrix[2][3] = 0;
    M.matrix[3][0] = -(m.matrix[3][0] * M.matrix[0][0] + m.matrix[3][1] * M.matrix[1][0] + m.matrix[3][2] * M.matrix[2][0]);
    M.matrix[3][1] = -(m.matrix[3][0] * M.matrix[0][1] + m.matrix[3][1] * M.matrix[1][1] + m.matrix[3][2] * M.matrix[2][1]);
    M.matrix[3][2] = -(m.matrix[3][0] * M.matrix[0][2] + m.matrix[3][1] * M.matrix[1][2] + m.matrix[3][2] * M.matrix[2][2]);
    M.matrix[3][3] = 1;
    return M;
  }
}

/** Swap row r1 with r2 */
function swapRows(matrix: Matrix, r1: number, r2: number) {
  for (let c = 0; c < matrix.cols; ++c) {
    let temp = matrix.get(r1, c);
    matrix.set(r1, c, matrix.get(r2, c));
    matrix.set(r2, c, temp);
  }
  return matrix;
}

export const E_SAMESIZE = new Error(`Matrix: given matrices must be the same size`);
export const E_SQUARE = new Error(`Matrix: matrix must be square`);