/** Acts as a code block when called in async functions */
export class Blocker {
  private _resolve: (value: unknown) => void | undefined = undefined;
  private _reject: (reason?: any) => void | undefined = undefined;

  /** Are we currently blocking execution? */
  public isBlocking() { return this._resolve !== undefined; }

  /** Use "await" on this line to block execution. */
  public async block() {
    if (this.isBlocking()) {
      throw new Error(`#<Blocker>.block: cannot create new block as block is already in use`);
    } else {
      return new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
    }
  }

  /** Forget what we were blocking (block still remains in place) */
  public forget(throwError = true) {
    if (throwError && this._reject) this._reject("Error: 'forget' was called, terminating this blockade");
    this._resolve = undefined;
    this._reject = undefined;
  }

  /** Unblock code execution. Pass in value to blocked line. */
  public unblock(value: any) {
    if (this.isBlocking()) {
      let fn = this._resolve;
      this.forget(false);
      fn(value);
    } else {
      throw new Error(`#<Blocker>.unblock: nothing to unblock`);
    }
  }

  /** Throw an error at the block  */
  public error(e: Error) {
    if (this.isBlocking()) {
      let fn = this._reject;
      this.forget(false);
      fn(e);
    } else {
      throw new Error(`#<Blocker>.error: no block available to throw error on`);
    }

  }
}