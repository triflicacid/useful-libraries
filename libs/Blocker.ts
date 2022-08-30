/** Class which indicates that the Blocke has been cancelled  */
export class BlockerCancelledError extends Error {
  constructor() {
    super(`CANCELLED`);
  }
}

/** Acts as a code block when called in async functions */
export class Blocker {
  private _resolve: ((value: unknown) => void) | undefined = undefined;
  private _reject: ((reason?: any) => void) | undefined = undefined;

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

  /** Forget what we were blocking (reject promise with special error) */
  public forget() {
    this.error(new BlockerCancelledError());
  }

  /** Unblock code execution. Pass in value to blocked line. */
  public unblock(value: any) {
    if (this.isBlocking()) {
      this._reject = undefined;
      if (this._resolve) this._resolve(value);
      this._resolve = undefined;
    } else {
      throw new Error(`#<Blocker>.unblock: nothing to unblock`);
    }
  }

  /** Throw an error at the block  */
  public error(e: Error) {
    if (this.isBlocking()) {
      this._resolve = undefined;
      if (this._reject) this._reject(e);
      this._reject = undefined;
    } else {
      throw new Error(`#<Blocker>.error: no block available to throw error on`);
    }

  }
}