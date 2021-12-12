export class SegmentDisplay {
  public x: number;
  public y: number;
  private _w = 100;
  private _h = 20;
  public padding = 1; // Padding between rectangles
  public margin = 0; // Padding between this and bounding box
  public roundness = 20; // Rounding of rectangles
  public on = true;
  private _rawValue: number; // Raw hex value
  public onColor = 'rgb(255, 0, 90)';


  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this._rawValue = 0; // The raw hex value
    this.value = 0; // The integer passed in
  }

  public get value() { return this._rawValue; }
  public set value(n: number) {
    n = Math.floor(n);
    if (isNaN(n)) n = 0;
    this._rawValue = SegmentDisplay.getNum(n);
  }

  /** Get width of whole segment */
  public get width() {
    return (2 * this.margin) + (2 * this._h) + this.padding + this._w + this.padding;
  }
  /** Set width of whole segment */
  public set width(w) {
    this._w = w / 1.5;
  }

  /** Get height of whole segment */
  public get height() {
    return (2 * this.margin) + (3 * this._h) + (2 * this._w) + (4 * this.padding);
  }
  /** Set height of the whole segment */
  public set height(h) {
    this._h = h / 2.8;
  }

  /** Draw rectangle given the state */
  private _rect(ctx: CanvasRenderingContext2D, shift: number, x: number, y: number, width: number, height: number) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    let color = this.getFill(shift);
    ctx.stroke();
    if (color) {
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  /** Render display depending on this.value */
  public display(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';

    this._rect(ctx, 6, this.x + this.margin + this._h + this.padding, this.y + this.margin, this._w, this._h); // TOP: a

    this._rect(ctx, 5, this.x + this.margin + this._h + this.padding + this._w + this.padding, this.y + this.margin + this._h + this.padding, this._h, this._w); // RIGHT UPPER: b

    this._rect(ctx, 4, this.x + this.margin + this._h + this.padding + this._w + this.padding, this.y + this.margin + (2 * this._h) + this._w + (3 * this.padding), this._h, this._w); // RIGHT LOWER: c

    this._rect(ctx, 3, this.x + this.margin + this._h + this.padding, this.y + this.margin + (2 * this._h) + (2 * this._w) + (4 * this.padding), this._w, this._h); // BOTTOM: d

    this._rect(ctx, 2, this.x + this.margin, this.y + this.margin + (2 * this._h) + this._w + (3 * this.padding), this._h, this._w); // LEFT LOWER: e

    this._rect(ctx, 1, this.x + this.margin, this.y + this.margin + this._h + this.padding, this._h, this._w); // LEFT UPPER: f

    this._rect(ctx, 0, this.x + this.margin + this._h + this.padding, this.y + this.margin + this._h + this._w + (2 * this.padding), this._w, this._h); // MIDDLE: g

    ctx.restore();
    return this;
  }

  /** Return fill colour for the shift value */
  public getFill(shift: number) {
    let state = (this.value >> shift) & 1;
    return (this.on && state) ? this.onColor : null;
  }

  public toNumber() {
    return SEGMENT_ENCODED_NUMS.indexOf(this.value);
  }

  /** Get encoded number */
  public static getNum(i: number) {
    i = i % SEGMENT_ENCODED_NUMS.length;
    return SEGMENT_ENCODED_NUMS[i];
  }
}

/** Numbers 0-15 (0-f) as encoded display digits */
export const SEGMENT_ENCODED_NUMS = new Uint8Array([
  0x7E,
  0x30,
  0x6D,
  0x79,
  0x33,
  0x5B,
  0x5F,
  0x70,
  0x7F,
  0x7B,
  0x77,
  0x1F,
  0x4E,
  0x3D,
  0x4F,
  0x47,
]);
