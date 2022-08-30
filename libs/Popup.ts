export type PopupCloseHandler = (popup: Popup) => boolean | void;

export default class Popup {
  private static _openPopups: Popup[] = [];

  public static popupsOpen() { return Popup._openPopups.length; }
  /** Get top-most popup */
  public static getTopmostPopup() { return Popup._openPopups.length == 0 ? undefined : Popup._openPopups[Popup._openPopups.length - 1]; }

  private _title: string;
  private _htmlContent: HTMLElement | undefined;
  private _onCloseCallback: PopupCloseHandler | undefined;
  private _popupDiv: HTMLDivElement | null = null;
  private _popupBg: HTMLDivElement | null = null; // Background element which blocks interactions to page

  constructor(title: string) {
    this._title = title;
  }

  public getTitle() { return this._title; }
  public setTitle(title: string) {
    this._title = title.toString();
    return this;
  }

  /** Get this popup's body */
  public getContent() { return this._htmlContent; }

  /** Set this popup's body */
  public setContent(content: HTMLElement) {
    this._htmlContent = content
    return this;
  }

  /** Insert an element into the popup's body */
  public insertAdjacentElement(position: InsertPosition, child: HTMLElement) {
    if (!this._htmlContent) this._htmlContent = document.createElement('div');
    this._htmlContent.insertAdjacentElement(position, child);
    return this;
  }

  /** Insert HTML into the popup's body */
  public insertAdjacentHTML(position: InsertPosition, html: string) {
    if (!this._htmlContent) this._htmlContent = document.createElement('div');
    this._htmlContent.insertAdjacentHTML(position, html);
    return this;
  }

  /** Insert text into the popup's body */
  public insertAdjacentText(position: InsertPosition, text: string) {
    if (!this._htmlContent) this._htmlContent = document.createElement('div');
    this._htmlContent.insertAdjacentText(position, text);
    return this;
  }

  /** Function which executes just before popup is closed. Return <false> to cancel closure. */
  public setCloseCallback(callback: PopupCloseHandler) {
    this._onCloseCallback = callback;
    return this;
  }

  /** Is the popup currently open? */
  public isOpen() {
    return this._popupDiv !== null
  }

  /** Show this popup (append to document) */
  public show() {
    if (!this.isOpen()) {
      // Create backdrop
      this._popupBg = document.createElement("div");
      this._popupBg.classList.add("popup-bg");
      this._popupBg.addEventListener('click', () => {
        let close = typeof this._onCloseCallback == 'function' ? this._onCloseCallback(this) !== false : true;
        if (close) this.hide();
      });
      document.body.insertAdjacentElement('beforeend', this._popupBg);

      // Create popups
      let container = document.createElement('div');
      container.classList.add("popup-container");
      this._popupDiv = container;
      let body = document.createElement("div");
      body.classList.add("popup-body");
      container.appendChild(body);
      body.insertAdjacentHTML('beforeend', `<h2>${this._title}</h2>`);
      if (this._htmlContent == undefined) this._htmlContent = document.createElement('div');
      this._htmlContent.classList.add('popup-dynamic-content');
      body.insertAdjacentElement('beforeend', this._htmlContent);

      let btn = document.createElement('button');
      btn.classList.add('popup-close');
      btn.innerText = 'Close';
      btn.addEventListener('click', () => {
        let close = typeof this._onCloseCallback == 'function' ? this._onCloseCallback(this) !== false : true;
        if (close) this.hide();
      });
      body.insertAdjacentHTML('beforeend', '<br>');
      body.insertAdjacentElement('beforeend', btn);

      document.body.insertAdjacentElement('beforeend', container);

      Popup._openPopups.push(this);
    }
    return this;
  }

  /** Hide this popup (if open) */
  public hide() {
    if (this.isOpen()) {
      (this._popupDiv as HTMLDivElement).remove();
      this._popupDiv = null;

      let i = Popup._openPopups.indexOf(this);
      Popup._openPopups.splice(i, 1);

      (this._popupBg as HTMLDivElement).remove();
      this._popupBg = null;
    }
    return this;
  }
}