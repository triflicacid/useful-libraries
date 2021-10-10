export class SuperSet<T> {
  private _sets: Set<T>[] = [new Set<T>()];
  private _size = 0;

  public get size() { return this._size; }

  /** Check: add new set if needs be */
  private _extend() {
    if (this._sets[this._sets.length - 1].size === 16777000) this._sets.push(new Set<T>());
  }

  /** Add item to set */
  public add(v: T) {
    this._extend();
    this._size++;
    return this._sets[this._sets.length - 1].add(v);
  }

  /** Does value exist in this set? */
  public has(v: T) {
    for (const set of this._sets) {
      if (set.has(v)) return true;
    }
    return false;
  }

  /** Remove value from set */
  public delete(v: T) {
    for (const set of this._sets) {
      if (set.delete(v)) {
        this._size--;
        return true;
      }
    }
    return false;
  }

  /** Remove all items from set */
  public clear() {
    this._size = 0;
    this._sets.length = 0;
    this._sets.push(new Set<T>());
  }

  /** Loop through every item in set */
  public forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any) {
    for (const set of this._sets) {
      set.forEach(callbackfn, thisArg);
    }
  }
}