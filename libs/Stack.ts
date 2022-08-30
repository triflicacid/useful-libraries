/** Simple stack implementation */
export class Stack<T> {
  private _data: T[] = [];

  /**
   * Return size of stack
   * @returns {number}
  */
  public size(): number { return this._data.length; }

  /**
   * Is the stack empty?
   * @returns {boolean}
   */
  public empty() { return this._data.length === 0; }

  /** Empty the stack. */
  public dump() { this._data.length = 0; }

  /**
   * Push value to the stack.
   * @param {any} value Value to push to stack
   * @returns {void}
   */
  public push(value: T): void { this._data.push(value); }

  /**
   * Return top item of the stack
   * @returns {any}
   */
  public top() { return this.empty() ? undefined : this._data[this._data.length - 1]; }

  /**
   * Pop and return top value off of stack
   * @returns {any}
   */
  public pop() { return this._data.pop(); }

  /**
   * Get item at any index
   * @param {number} index
  */
  public get(index: number) { return this._data[index]; }

  /**
   * Set item at any index
   * @param {number} index
   * @param {any} value
  */
  public set(index: number, value: T) { this._data[index] = value; }

  public toArray() { return [...this._data]; }
}
