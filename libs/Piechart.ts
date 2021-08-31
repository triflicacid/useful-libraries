/** Data object for Piechart */
export interface IPiechartDataItem {
  count: number;
  colour: string; // RGB string
  rgb: number[]; // RGB colours
  angleStart?: number;
  angleEnd?: number;
}

/** Get best foreground/background colour depending on colour */
function bestColour(rgb: number[], txt = true, n = 100) {
  if (txt) return ((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > n) ? "black" : "white";
  return ((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > n) ? "white" : "black";
}

function areClockwise(center: number[], radius: number, angle: number, point: number[]) {
  var point1 = [
    (center[0] + radius) * Math.cos(angle),
    (center[1] + radius) * Math.sin(angle)
  ];
  return -point1[0] * point[1] + point1[1] * point[0] > 0;
}

/** Is a point inside a sector of a circle? */
function isInsideSector(point: number[], center: number[], radius: number, angle1: number, angle2: number) {
  var relPoint = [
    point[0] - center[0],
    point[1] - center[1]
  ];

  if (angle2 - angle1 < Math.PI) {
    return !areClockwise(center, radius, angle1, relPoint) &&
      areClockwise(center, radius, angle2, relPoint) &&
      (relPoint[0] * relPoint[0] + relPoint[1] * relPoint[1] <= radius * radius);
  } else {
    const half = (angle1 + angle2) / 2;
    return isInsideSector(point, center, radius, angle1, angle2 - half) || isInsideSector(point, center, radius, angle1 + half, angle2);
  }
}

const rotateCoords = (cx: number, cy: number, r: number, theta: number): [number, number] => ([cx + r * Math.cos(theta), cy + r * Math.sin(theta)]);

export default class Piechart {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  public x = 0;
  public y = 0;
  private _radius: number = 50;
  private _data: { [label: string]: IPiechartDataItem } = {};
  private _total = 0;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
  }

  get radius() { return this._radius; }
  set radius(r: number) { this._radius = Math.abs(r); }

  setPos(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getPos() { return [this.x, this.y]; }

  hasData(label: string) {
    return this._data.hasOwnProperty(label);
  }

  getData(label: string) { return this._data[label]; }

  setData(label: string, count: number, rgb: number[]) {
    if (!this._data.hasOwnProperty(label)) {
      this._data[label] = { count, rgb, colour: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` };
      this._total += count;
      return true;
    } else {
      return false;
    }
  }

  removeData(label: string) {
    if (this._data.hasOwnProperty(label)) {
      this._total -= this._data[label].count;
      delete this._data[label];
      return true;
    } else {
      return false;
    }
  }

  reset() {
    this._data = {};
    this._total = 0;
  }

  getTotal() { return this._total; }

  getLabels() { return Object.keys(this._data); }

  render(labelHighlighted?: string) {
    let cangle = 0, ctx = this._ctx;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '10px sans-serif';

    for (let label in this._data) {
      if (this._data.hasOwnProperty(label)) {
        let decimal = this._data[label].count / this._total;
        let angle = decimal * Math.PI * 2;

        ctx.beginPath();
        ctx.fillStyle = this._data[label].colour;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(...rotateCoords(this.x, this.y, this.radius, cangle));
        ctx.arc(this.x, this.y, this.radius, cangle, cangle + angle);
        // ctx.lineTo(...rotateCoords(this._x, this._y, radius, cangle + angle));
        ctx.lineTo(this.x, this.y);
        ctx.fill();
        if (labelHighlighted === label) {
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        this._data[label].angleStart = cangle;
        this._data[label].angleEnd = cangle + angle;

        if (decimal > 0.03) {
          ctx.beginPath();
          ctx.fillStyle = bestColour(this._data[label].rgb, true);
          ctx.fillText(label, ...rotateCoords(this.x, this.y, this.radius / 2, cangle + angle / 2));
        }

        cangle += angle;
      }
    }
  }

  isOver(position: number[]) {
    const r = this.radius;
    if (position[0] < this.x - r || position[0] > this.x + r || position[1] < this.y - r || position[1] > this.y + r) return false;
    return true;
  }

  isOverLabel(label: string, position: number[]) {
    if (this._data.hasOwnProperty(label)) {
      const data = this._data[label];
      return isInsideSector(position, this.getPos(), this.radius, data.angleStart, data.angleEnd);
    } else {
      return false;
    }
  }
}