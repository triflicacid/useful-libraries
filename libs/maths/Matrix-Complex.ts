import { Complex } from "./Complex";

/**
 * Represents a matrix (this.matrix is a 2-D array)
 * Each element is an instance of Complex
 */
export class Matrix {
  public matrix: Complex[][];

  /**
   * To create a matrix, use Matrix['from'...] methods
   * Sets value given durectly to <#Matrix>.matrix
   */
  constructor(m?: Complex[][]) {
    this.matrix = m ?? [];
    if (!Matrix.isLegal(this.matrix)) throw new Error(`new Matrix() :: Invalid matrix ${this.matrix}`);
  }

  get rows() { return this.matrix.length; }
  get cols() { return this.matrix.length === 0 ? 0 : this.matrix[0].length; }

  /** Get number in (row, col) */
  public get(r: number, c: number) {
    return this.matrix[r]?.[c];
  }

  /** Set (row, col) to <arg> */
  public set(r: number, c: number, n: any) {
    this.matrix[r][c] = Complex.parse(n);
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
    return new Matrix(this.matrix.map(row => row.map(n => n.copy())));
  }

  /** Apply a function to each item in the matrix */
  public apply(fn: (n: Complex, row: number, col: number) => Complex) {
    return new Matrix(this.matrix.map((_, r) => this.matrix[r].map((_, c) => Complex.parse(fn(this.matrix[r][c], r, c)))));
  }

  /** Scalar adition: returns new Matrix */
  public scalarAdd(n: any) {
    n = Complex.parse(n);
    return this.apply(z => Complex.add(z, n));
  }

  /** Scalar subtraction: returns new Matrix */
  public scalarSub(n: any) {
    n = Complex.parse(n);
    return this.apply(z => Complex.sub(z, n));
  }

  /** Scalar multiplication: returns new Matrix */
  public scalarMult(n: any) {
    n = Complex.parse(n);
    return this.apply(z => Complex.mult(z, n));
  }

  /** Scalar division: returns new Matrix */
  public scalarDiv(n: any) {
    n = Complex.parse(n);
    return this.apply(z => Complex.div(z, n));
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

  /** Transpose this matrix: returns new Matrix */
  public transpose() {
    const mat = [];
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
    const minor = [];
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
    const minors = [];
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
          mat.set(r, c, Complex.mult(mat.get(r, c), -1));
        }
      }
    }
    return mat;
  }

  /** calculate cofactor matrix */
  public cofactors() {
    return this.getMinors().checkerboard();
  }

  /** calculare inverse matrix */
  public inverse() {
    let inter = this.getMinors().checkerboard().transpose();
    return inter.scalarMult(Complex.div(1, inter.determinant()));
  }

  /** Return string representation as a flat string e.g "0 0 0; 0 0 0;" */
  public toString() {
    return this.matrix.map(a => a.join(' ')).join('; ') + ';';
  }

  /** Return string representation as an array e.g [[0,0,0],[0,0,0]] */
  public toArrayString() {
    return '[' + this.matrix.map(a => '[' + a.join(',') + ']').join(',') + ']';
  }

  /** Convert contents to pritimitive numbers from Complex (taking real parts) */
  public toPrimitiveNumbers() {
    for (let r = 0; r < this.matrix.length; ++r) {
      for (let c = 0; c < this.matrix[r].length; ++c) {
        this.matrix[r][c] = this.matrix[r][c].a as any;
      }
    }
    return this;
  }

  /** Convert contents from primitive numbers to complex number */
  public toComplexNumbers() {
    for (let r = 0; r < this.matrix.length; ++r) {
      for (let c = 0; c < this.matrix[r].length; ++c) {
        this.matrix[r][c] = new Complex(this.matrix[r][c] as any);
      }
    }
    return this;
  }

  public static fromDimensions(rows: number, cols: number, value?: Complex) {
    if (value === undefined) value = new Complex(0);
    return new Matrix(Array.from({ length: cols }, () => Array.from({ length: rows }, () => value.copy())));
  }

  /** Parse matrix from string: "v v v; v v v;" */
  public static fromString(string: string) {
    let arr = string.split(';').map(a => a.split(/\s/g).filter(a => a.length > 0).map(n => Complex.parse(n))).filter(a => a.length > 0);
    if (arr.length === 0) return new Matrix();
    let allNotNaN = arr.map(arr => arr.map(x => !Complex.isNaN(x)).every(x => x)).every(x => x);
    if (!allNotNaN) throw new Error(`Matrix string '${string}' :: invalid matrix string (found NaN value)`);
    let sameLength = arr.every(a => a.length === arr[0].length);
    if (!sameLength) throw new Error(`Matrix string '${string}' :: each row must be same length`);
    return new Matrix(arr);
  }

  /** Generate matrix from 1D array */
  public static fromArray(array: any[], rows: number, cols: number) {
    let marr = [], tmp = [];
    for (let i = 0, c = 1; i < array.length && marr.length < rows; i++) {
      tmp.push(Complex.parse(array[i]));
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
      return new Matrix(a.matrix.map((_, r) => a.matrix[r].map((_, c) => Complex.add(a.matrix[r][c], b.matrix[r][c]))));
    } else {
      throw E_SAMESIZE;
    }
  }

  /** Subtract two matrices: a - b */
  public static sub(a: Matrix, b: Matrix) {
    if (a.rows === b.rows && a.cols === b.cols) {
      return new Matrix(a.matrix.map((_, r) => a.matrix[r].map((_, c) => Complex.sub(a.matrix[r][c], b.matrix[r][c]))));
    } else {
      throw E_SAMESIZE;
    }
  }

  /** Multiply two matrices: a * b */
  public static mult(a: Matrix, b: Matrix) {
    if (a.cols === b.rows) {
      const result = Matrix.zeroes(a.rows, b.cols);

      for (let r1 = 0; r1 < a.rows; r1++) {
        for (let c2 = 0; c2 < b.cols; c2++) {
          let psum = result.get(r1, c2);
          for (let r2 = 0; r2 < b.rows; r2++) {
            psum.add(Complex.mult(a.get(r1, r2), b.get(r2, c2)));
          }
        }
      }
      return result;
    } else {
      throw new Error(`Matrix: unable to multiply (a.cols != b.rows)`);
    }
  }

  /** Calculate the determinant of a matrix */
  public static determinant(matrix: Matrix) {
    if (matrix.isSquare()) {
      if (matrix.rows === 1) return matrix.get(0, 0);
      if (matrix.rows === 2) return Complex.mult(matrix.get(0, 0), matrix.get(1, 1)).sub(Complex.mult(matrix.get(0, 1), matrix.get(1, 0)));

      let M = 1, det = new Complex(0);
      for (let c = 0; c < matrix.cols; c++) {
        let scalar = matrix.get(0, c), mat = [];
        for (let r1 = 1, ri = 0; r1 < matrix.rows; r1++) {
          mat[ri] = [];
          for (let c1 = 0; c1 < matrix.cols; c1++) {
            if (c1 === c) continue; // Skip current column
            mat[ri].push(matrix.get(r1, c1));
          }
          ri++;
        }
        let inter = Complex.mult(scalar, Matrix.determinant(new Matrix(mat)));
        if (M) det.add(inter); else det.sub(inter);
        M ^= 1;
      }
      return det;
    } else {
      throw E_SQUARE;
    }
  }

  /** Return matrix in row echelon form.
   * ! This expects a matrix in raw numerical form Matrix.toPrimitive()
  */
  public static toRowEchelonForm(matrix: Matrix) {
    let nr = matrix.rows, nc = matrix.cols;

    // Bubble all all-zero rows to bottom of matrix
    for (let r = 0; r < nr; ++r) {
      // If row all zeroes?
      let all0 = true;
      for (let c = 0; c < nc; ++c) {
        if (matrix.get(r, c) as any !== 0) {
          all0 = false;
          break;
        }
      }
      // If all zero, swap row with last row
      if (all0) {
        // Swap row <r> with <nr>
        swapRows(matrix, r, nr);
        nr--;
      }
    }

    let p = 0;
    while (p < nr && p < nc) {
      let repeat = true;
      while (repeat) {
        repeat = false;
        let r = 1;
        while (matrix.get(p, p) as any === 0) {
          if (p + r <= nr) {
            p++;
            repeat = true;
            break;
          }
          swapRows(matrix, p, p + r);
          r++;
        }

        for (let r = 1; r < nr - p; ++r) {
          if (matrix.get(p + r, p) as any !== 0) {
            let x = -matrix.get(p + r, p) / (matrix.get(p, p) as any);
            for (let c = p; c <= nc; ++c) {
              matrix.set(p + r, c, (matrix.get(p, c) as any) * x + (matrix.get(p + r, c) as any));
            }
          }
        }
        p++;
      }
    }
    return matrix;
  }

  /** Return matrix in reduced row echelon form */
  public static toReducedRowEchelonForm(matrix: Matrix) {
    let lead = 0, rowCount = matrix.rows, colCount = matrix.cols;
    for (let r = 0; r < rowCount; ++r) {
      if (colCount <= lead) return matrix;
      let i = r;
      while (matrix.get(i, lead) as any === 0) {
        i++;
        if (rowCount === i) {
          i = r;
          lead++;
          if (colCount === lead) return matrix;
        }
      }

      if (r !== r) swapRows(matrix, i, r);

      const k = matrix.get(r, lead) as any;
      for (let c = 0; c < colCount; ++c) matrix.set(r, c, (matrix.get(r, c) as any) / k);

      for (let i = 0; i < rowCount; ++i) {
        const k = matrix.get(i, lead) as any;
        if (i !== r) {
          for (let c = 0; c < colCount; ++c) matrix.set(i, c, (matrix.get(i, c) as any) - k * (matrix.get(r, c) as any));
        }
      }
      lead++;
    }

    return matrix;
  }

  /** Return identity matrix */
  public static identity(size: number) {
    return new Matrix(Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => new Complex(r === c ? 1 : 0))));
  }

  /** Return a zero matrix */
  public static zeroes(rows: number, cols?: number) {
    if (cols === undefined) cols = rows;
    return new Matrix(Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => new Complex(0))));
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

const E_SAMESIZE = new Error(`Matrix: given matrices must be the same size`);
const E_SQUARE = new Error(`Matrix: matrix must be square`);