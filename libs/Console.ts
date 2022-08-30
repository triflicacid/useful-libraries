export const scrollToBottom = (el: HTMLElement) => el.scrollTop = el.scrollHeight;

export type ConsoleCallback = (value: string, ioconsole: IOConsole) => void;

export class IOConsole {
  private _wrapper: HTMLElement;
  private _: HTMLDivElement;
  private _suspended: boolean = false;
  private _backlog: HTMLDivElement[] = [];
  private _inputCallback: ConsoleCallback;
  private _inputLine: HTMLDivElement;
  private _inputEl: HTMLInputElement | undefined;
  private _boundEventHandler: (event: KeyboardEvent) => void;

  constructor(wrapper: HTMLElement) {
    this._wrapper = wrapper;
    this._ = document.createElement('div');
    this._wrapper.appendChild(this._);
    this._.classList.add('ioconsole');
  }

  /** Is the console suspended? */
  public isSuspended(): boolean { return this._suspended; }

  /** Set whether or not the console is suspended */
  public suspend(bool: boolean) {
    if (bool !== this._suspended) {
      this._suspended = bool;
      if (!bool) {
        this._backlog.forEach(line => this._appendLine(line));
        this._backlog.length = 0;
      }
    }
  }

  /** Create a new line in the console with given `content` of given `type` (e.g. "error", "response") */
  public createLine(content: string, type?: string): HTMLDivElement {
    const line = document.createElement('div');
    line.classList.add('ioconsole-line');
    if (type) line.dataset.type = type.toString();
    if (type === 'user') line.innerHTML = '&gt;&nbsp;&nbsp;';
    else if (type === 'response') line.innerHTML = '&lt;&nbsp;&nbsp;';
    else if (type === 'error') line.innerHTML = '[!]&nbsp;';
    line.innerText += content;
    return line;
  }

  /** Append a HTML line onto console body */
  private _appendLine(line: HTMLDivElement): void {
    this._.insertAdjacentElement('beforeend', line);
    scrollToBottom(this._);
  }

  /** Print given text to the console. May contain newlines. */
  public print(text: string) {
    const lines = text.toString().split(/\r|\n|\r\n/g);
    for (let i = 0; i < lines.length; i++) {
      const line = this.createLine(lines[i], i === 0 ? "user" : "user-newline");
      if (this._suspended) {
        this._backlog.push(line);
      } else {
        this._appendLine(line);
      }
    }
  }

  /** Print an error message to the console. May contain newlines. Bypasses console suspension. */
  public error(message: string) {
    const lines: string[] = message.split(/\r|\n|\r\n/g);
    lines.forEach(line => this._appendLine(this.createLine(line, 'error')));
  }

  /** Clear the console */
  public clear(silent = false) {
    this.suspend(false);
    this._.innerHTML = '';
    this._backlog.length = 0;
    if (!silent) this._appendLine(this.createLine("Console was cleared", "notice"));
  }

  /** Print `prompt` and wait for input. When entered, call `callback` with inputted string as its argument. */
  public inputCallback(prompt: string, callback: ConsoleCallback) {
    if (this._suspended) {
      this.error("Cannot prompt for user input whilst console is suspended");
      return false;
    }

    const lines = prompt.split(/\r|\n|\r\n/g), last = lines.pop() as string;
    if (lines.length !== 0) this.print(lines.join('\n'));

    const line = this.createLine(last, "user");
    const input = document.createElement("input");
    input.type = 'text';
    line.insertAdjacentElement('beforeend', input);
    input.focus();
    this._appendLine(line);

    // event handler
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        let content = input.value;
        input.remove();
        this._appendLine(this.createLine(content, "response"));
        if (typeof this._inputCallback === 'function') this._inputCallback(content, this);
        this._.removeEventListener('keydown', handler);
        scrollToBottom(this._);
        this.suspend(false);
        callback(content, this);
      }
    }

    this._.addEventListener('keydown', handler);
    this.suspend(true);

    return true;
  }

  /** Print `prompt` and wait for input. When entered, return inputted string. */
  public inputAsync(prompt: string) {
    if (this._suspended) {
      this.error("Cannot prompt for user input whilst console is suspended");
      return false;
    }

    const lines = prompt.split(/\r|\n|\r\n/g), last = lines.pop() as string;
    if (lines.length !== 0) this.print(lines.join('\n'));

    const line = this.createLine(last, "user");
    const input = document.createElement("input");
    input.type = 'text';
    line.insertAdjacentElement('beforeend', input);
    input.focus();
    this._appendLine(line);

    const promise = new Promise(res => {
      // event handler
      const handler = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          let content = input.value;
          input.remove();
          this._appendLine(this.createLine(content, "response"));
          if (typeof this._inputCallback === 'function') this._inputCallback(content, this);
          this._.removeEventListener('keydown', handler);
          scrollToBottom(this._);
          this.suspend(false);
          res(content);
        }
      }

      this._.addEventListener('keydown', handler);
      this.suspend(true);
    });
    return promise;
  }
}

export default IOConsole;