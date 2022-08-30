import { Font } from "./Font";
import { lerp } from "./utils";

type ColorMode = "RGB" | "HSL" | "LCH" | "LAB";
type ColorArg = string | number[];
type Point = [number, number];

function parseColor(mode: ColorMode, arg: ColorArg = '#000'): string | null {
  if (arg === null) return null;
  if (typeof arg === 'string') return arg; // May be CSS colour, hex string etc...
  if (typeof arg.slice === 'function') {
    let cstr = "";
    switch (mode) {
      case "RGB": {
        if (arg.length === 1) cstr = `rgb(${arg[0]},${arg[0]},${arg[0]})`;
        else if (arg.length === 2) cstr = `rgba(${arg[0]},${arg[0]},${arg[0]},${arg[1]})`;
        else if (arg.length === 3) cstr = `rgb(${arg[0]},${arg[1]},${arg[2]})`;
        else if (arg.length === 4) cstr = `rgba(${arg[0]},${arg[1]},${arg[2]},${arg[3]})`;
        break;
      }
      case "HSL": {
        if (arg.length === 1) cstr = `hsl(${arg[0]},${arg[0]},${arg[0]})`;
        else if (arg.length === 2) cstr = `hsla(${arg[0]},${arg[0]},${arg[0]},${arg[1]})`;
        else if (arg.length === 3) cstr = `hsl(${arg[0]},${arg[1]},${arg[2]})`;
        else if (arg.length === 4) cstr = `hsla(${arg[0]},${arg[1]},${arg[2]},${arg[3]})`;
        break;
      }
      case "LCH": {
        if (arg.length === 1) cstr = `lch(${arg[0]},${arg[0]},${arg[0]})`;
        else if (arg.length === 3) cstr = `lch(${arg[0]},${arg[1]},${arg[2]})`;
        break;
      }
      case "LAB": {
        if (arg.length === 1) cstr = `lab(${arg[0]},${arg[0]},${arg[0]})`;
        else if (arg.length === 3) cstr = `lab(${arg[0]},${arg[1]},${arg[2]})`;
        break;
      }
      default:
        throw new Error(`Unknown color mode '${mode}'`);
    }
    if (cstr !== "") return cstr;
  }
  throw new Error(`Invalid arguments - could not convert to valid color (color mode = '${mode}')`);
}

var BEZIER_DELTA = 0.05;

export class RCanv {
  private _canv: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _cmode: ColorMode = "HSL";
  private _fill: string | null = "#000"; // Fill colour
  private _stroke: string | null = null; // Stroke colour
  private _strokew: number = 1; // WIdth of stroke
  private _lineJoin: CanvasLineJoin = "miter";
  private _lineCap: CanvasLineCap = "butt";
  private _inPath = false;
  private _newPath = true; // Is this a fresh, new path?
  private _font: Font;

  constructor(canvas: HTMLCanvasElement) {
    this._canv = canvas;
    this._ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this._font = new Font();
  }

  /** Return canvas element */
  public getCanvas() { return this._canv; }

  /** Return canvas context we are using */
  public getContext() { return this._ctx; }

  /** Get canvas width */
  public get width() { return this._canv.width; }
  /** Get canvas height */
  public get height() { return this._canv.height; }

  public get font() { return this._font; }

  /** Update context */
  private _updateCtx(apply = true) {
    this._ctx.font = this._font.toString();
    if (this._fill) {
      this._ctx.fillStyle = this._fill;
      if (apply) this._ctx.fill();
    }
    if (this._stroke) {
      this._ctx.lineJoin = this._lineJoin;
      this._ctx.lineCap = this._lineCap;
      this._ctx.lineWidth = this._strokew;
      this._ctx.strokeStyle = this._stroke;
      if (apply) this._ctx.stroke();
    }
  }

  /** Get/set colour mode */
  public colorMode(mode?: ColorMode) {
    if (mode !== undefined) this._cmode = mode;
    return this._cmode;
  }

  /** Parse color argument to color string */
  public color(arg?: ColorArg) { return parseColor(this._cmode, arg); }

  /** Set fill colour (null for no fill) */
  public fill(color?: ColorArg) {
    this._fill = color === null ? null : this.color(color);
  }

  /** Set stroke colour (null for no stroke) */
  public stroke(color?: ColorArg) {
    this._stroke = color === null ? null : this.color(color);
  }

  /** Set stroke weight (undefined = 1) */
  public strokeWeight(weight = 1) {
    this._strokew = weight;
  }

  /** Set line join type (undefined = 'miter') */
  public lineJoin(type: CanvasLineJoin = "miter") {
    this._lineJoin = type;
  }

  /** Set line cap type (undefined = 'butt') */
  public lineCap(type: CanvasLineCap = "butt") {
    this._lineCap = type;
  }

  /** Clear canvas */
  public clear() {
    this.endPath(false);
    this._ctx.clearRect(0, 0, this.width, this.height);
  }

  /** Set background colour of canvas */
  public background(color?: ColorArg) {
    const col = this.color(color);
    if (col) this._ctx.fillStyle = col;
    this._ctx.fillRect(0, 0, this.width, this.height);
  }

  /** Start a path. Close the path if already open before beginning another. */
  public beginPath() {
    if (this._inPath) {
      this.endPath();
    }
    this._inPath = true;
    this._newPath = true;
  }

  /** End a path and render */
  public endPath(close = false) {
    if (!this._inPath) return;
    if (close) this._ctx.closePath();
    this._updateCtx();
    this._inPath = false;
  }

  /**
   * Draw a rectangle/add rectangle to path
   * @param x x-coordinate of top-left corner
   * @param y y-coordinate of top-left corner
   * @param w width of the rectangle
   * @param h height of the rectangle
  */
  public rect(x: number, y: number, w: number, h: number) {
    if (this._inPath) {
      this._ctx.rect(x, y, w, h);
      this._newPath = false;
    } else {
      if (this._fill || this._stroke) {
        this._ctx.beginPath();
        this._ctx.rect(x, y, w, h);
        this._updateCtx();
      }
    }
  }

  public text(text: string, x: number, y: number, maxWidth?: number) {
    this._updateCtx(false);
    if (this._fill) this._ctx.fillText(text, x, y, maxWidth);
    if (this._stroke) this._ctx.strokeText(text, x, y, maxWidth);
  }

  /**
   * Draw an arc/add arc to path
   * @param x x-coordinate of centre of arc
   * @param y y-coordinate of centre of arc
   * @param r radius of arc
   * @param startAngle starting angle of arc (radians)
   * @param endAngle ending angle of arc (radians)
   * @param anticlockwise draw the arc anticlockwise? (default=false)
  */
  public arc(x: number, y: number, r: number, startAngle: number, endAngle: number, anticlockwise = false) {
    if (this._inPath) {
      this._ctx.arc(x, y, r, startAngle, endAngle, anticlockwise);
      this._newPath = false;
    } else {
      if (this._fill || this._stroke) {
        this._ctx.beginPath();
        this._ctx.arc(x, y, r, startAngle, endAngle, anticlockwise);
        this._updateCtx();
      }
    }
  }

  /**
   * Draw a circle/add circle to path
   * @param x x-coordinate of centre of circle
   * @param y y-coordinate of centre of circle
   * @param r radius of circle
  */
  public circle(x: number, y: number, r: number) {
    return this.arc(x, y, r, 0, 2 * Math.PI);
  }

  /**
   * Draw an ellipse/add ellipse to path
   * @param x x-coordinate of centre of ellipse
   * @param y y-coordinate of centre of ellipse
   * @param rx ellipses x-axis radius
   * @param ry ellipses y-axis radius
   * @param rotation rotation of ellipse in radians
   * @param startAngle starting angle of ellipse (radians)
   * @param endAngle ending angle of ellipse (radians)
   * @param anticlockwise draw the ellipse anticlockwise? (default=false)
  */
  public ellipse(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, anticlockwise = false) {
    if (this._inPath) {
      this._ctx.ellipse(x, y, rx, ry, rotation, startAngle, endAngle, anticlockwise);
      this._newPath = false;
    } else {
      if (this._fill || this._stroke) {
        this._ctx.beginPath();
        this._ctx.ellipse(x, y, rx, ry, rotation, startAngle, endAngle, anticlockwise);
        this._updateCtx();
      }
    }
  }

  /**
   * Draw array of points/add points to path
   * @param points array of points
   * @param close close the path?
   */
  public path(points: Point[]) {
    if (this._inPath) {
      points.forEach(point => this.point(...point));
    } else {
      this.beginPath();
      points.forEach(point => this.point(...point));
      this.endPath(false);
    }
  }

  /**
   * Draw a point/add point to path
   * @param x x-coordinate of point
   * @param y y-coordinate of point
   */
  public point(x: number, y: number) {
    if (this._inPath) {
      if (this._newPath) {
        this._ctx.moveTo(x, y);
        this._newPath = false;
      } else {
        this._ctx.lineTo(x, y);
      }
    } else {
      this.circle(x, y, this._strokew * 0.5);
    }
  }

  /**
   * Draw a line between two points/add both points to path
   * @param x1 x-coordinate of first point
   * @param y1 y-coordinate of first point
   * @param x2 x-coordinate of second point
   * @param y2 y-coordinate of second point
   */
  public line(x1: number, y1: number, x2: number, y2: number) {
    if (this._inPath) {
      this.point(x1, y1);
      this.point(x2, y2);
    } else {
      if (this._stroke) {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._updateCtx();
      }
    }
  }

  /** Sketch a bezier curve for any number of points */
  public bezier(points: Point[]) {
    if (points.length < 2) throw new Error(`Bezier: must have at least 2 points`);
    const curvePoints = [points[0]];
    for (let d = 0; d < 1.0001; d += BEZIER_DELTA) {
      let oldPoints = points;
      let newPoints: Point[] = [];
      while (oldPoints.length > 1) {
        for (let i = 0; i < oldPoints.length - 1; i++) {
          const ia1 = i + 1;
          const point: Point = [
            lerp(oldPoints[i][0], oldPoints[ia1][0], d),
            lerp(oldPoints[i][1], oldPoints[ia1][1], d)
          ];
          newPoints.push(point);
        }
        oldPoints = newPoints;
        newPoints = [];
      }
      curvePoints.push(oldPoints[0]);
    }

    this.path(curvePoints);
  }

  /** Get array of point for a quadratic bezier curve */
  private _bquadPoint(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, delta: number): Point {
    let x1_t = lerp(x1, x2, delta);
    let y1_t = lerp(y1, y2, delta);
    let x2_t = lerp(x2, x3, delta);
    let y2_t = lerp(y2, y3, delta);
    let x = lerp(x1_t, x2_t, delta);
    let y = lerp(y1_t, y2_t, delta);
    return [x, y];
  }

  /**
   * Like bezier(), but more efficiently sketches a quadratic bezier curve (one control point)
   */
  public bezier_quadratic(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    let points: Point[] = [];
    for (let d = 0; d < 1.0001; d += BEZIER_DELTA) {
      points.push(this._bquadPoint(x1, y1, x2, y2, x3, y3, d));
    }
    this.path(points);
  }

  /**
   * Like bezier(), but more efficiently sketches a cubic bezier curve (two control point)
   */
  public bezier_cubic(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
    let points: Point[] = [];
    for (let d = 0; d < 1.0001; d += BEZIER_DELTA) {
      let p0 = this._bquadPoint(x1, y1, x2, y2, x3, y3, d);
      let p1 = this._bquadPoint(x2, y2, x3, y3, x4, y4, d);
      let x = lerp(p0[0], p1[0], d);
      let y = lerp(p0[1], p1[1], d);
      points.push([x, y]);
    }
    this.path(points);
  }

  /** Save current canvas state */
  public save() { this._ctx.save(); }

  /** Restore previous canvas state */
  public restore() { this._ctx.restore(); }

  /** Apply a translation */
  public translate(x: number, y: number) { this._ctx.translate(x, y); }

  /** Apply a rotation */
  public rotate(angle: number) { this._ctx.rotate(angle); }

  /** Apply a scale (if only factorX is provided, scale by factorX in both directions) */
  public scale(factorX: number, factorY?: number) {
    if (factorY === undefined) {
      this._ctx.scale(factorX, factorX);
    } else {
      this._ctx.scale(factorX, factorY);
    }
  }

  /** Create RCanv instance along with a new canvas */
  static create(width?: number, height?: number) {
    const canv = document.createElement("canvas");
    if (width !== undefined) canv.width = width;
    if (height !== undefined) canv.height = height;
    return new RCanv(canv);
  }
}