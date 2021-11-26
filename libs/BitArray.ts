export type Bit = 0 | 1;

export class BitArray {
  private _data: Uint8Array;
  private _length: number;

  constructor(size: number);
  constructor(bits: Bit[]);
  constructor(arg: number | Bit[]) {
    if (typeof arg === "number") {
      // Size
      this._length = arg[0];
      this._data = new Uint8Array(Math.ceil(arg[0] / 8));
    } else {
      // Items
      this._length = arg.length;
      this._data = new Uint8Array(Math.ceil(arg.length / 8));
      for (let i = 0; i < arg.length; i++) {
        this._data[Math.floor(i / 8)] |= arg[i] << (i % 8);
      }
    }
  }

  public get length() { return this._length; }
  public set length(l: number) {
    const size = Math.ceil(l / 8);
    const array = new Uint8Array(size);
    if (l >= this._length) {
      array.set(this._data, 0);
    } else {
      array.set(this._data.slice(0, size));
    }
    this._length = l;
    this._data = array;
  }

  public get byteLength() { return this._data.byteLength; }

  /** Set bit in position */
  public set(index: number, bit: Bit) {
    if (index < 0) return undefined;
    if (index >= this.length) this.length = index + 1;
    this._data[Math.floor(index / 8)] |= bit << (index % 8);
    return bit;
  }

  /** Get bit at position */
  public get(index: number): Bit {
    if (index < 0 || index >= this.length) return undefined;
    const mask = 1 << (index % 8);
    return (this._data[Math.floor(index / 8)] & mask) === mask ? 1 : 0;
  }

  /** Convert to array */
  public toArray() {
    return Array.from<number, Bit>({ length: this.length }, (_, i) => this.get(i));
  }

  public toArrayBuffer() {
    return this._data.buffer.slice(this._data.byteOffset, this._data.byteLength + this._data.byteOffset);
  }
}