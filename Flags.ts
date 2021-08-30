/** A class which generates Flag objects */
export class FlagGenerator {
  private _cnum = 1n; // Current number
  private _fields = new Map<string, bigint>();

  /** Is the provided field present? */
  public hasField(field: string) {
    return this._fields.has(field);
  }

  /** Ads a new field to the generator */
  public addField(field: string) {
    this._fields.set(field, this._cnum);
    this._cnum <<= 1n;
  }

  /** Get mask associated with field */
  public getField(field: string) {
    return this._fields.get(field);
  }

  /** Remove a field from the generator */
  public removeField(field: string) {
    this._fields.delete(field);
    this._clean();
  }

  /** Clean numeric values related to each field */
  private _clean() {
    const fields = Array.from(this._fields.keys());
    this._fields.clear();
    this._cnum = 1n;
    fields.forEach(field => this.addField(field));
  }

  /** Clone this generator */
  public clone() {
    const G = new FlagGenerator();
    this._fields.forEach((_, f) => G.addField(f));
    return G;
  }

  /** Generate a new Flag with the given fields enabled */
  public generate(...fields: string[]) {
    let n = 0n;
    this._fields.forEach((v, f) => fields.includes(f) && (n |= v));
    return new Flag(this, n);
  }
}

/** A class which represents an integer as a flag */
export class Flag {
  private _gen: FlagGenerator;
  private _n: bigint;

  constructor(gen: FlagGenerator, n?: bigint) {
    this._gen = gen
    this._n = n ?? 0n;
  }

  /** Return string representation of flag integer */
  public toString(radix?: number) {
    return this._n.toString(radix);
  }

  /** Return integer value of flag as a number */
  public valueOf() { return Number(this._n); }

  /** Is the given field set? */
  public isSet(field: string) {
    const mask = this._gen.getField(field);
    return mask === undefined ? false : (this._n & mask) === mask;
  }

  /** Set a given field */
  public set(field: string) {
    const mask = this._gen.getField(field);
    if (mask === undefined) throw new Error(`Flag#set: unknown flag field '${field}'`);
    this._n |= mask;
    return this;
  }

  /** Unset a given field */
  public unset(field: string) {
    const mask = this._gen.getField(field);
    if (mask === undefined) throw new Error(`Flag#unset: unknown flag field '${field}'`);
    this._n &= ~mask;
    return this;
  }

  /** Unset/set a give field */
  public toggle(field: string) {
    const mask = this._gen.getField(field);
    if (mask === undefined) throw new Error(`Flag#toggle: unknown flag field '${field}'`);
    this._n ^= mask;
    return this;
  }
}