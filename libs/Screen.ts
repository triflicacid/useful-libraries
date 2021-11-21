import { Font } from "./Font";

export type ScreenColour = null | string | CanvasGradient | CanvasPattern;

export interface IScreenState {
  foreground: ScreenColour;
  background: ScreenColour;
  x: number;
  y: number;
  font: Font;
};

export interface ITextMeasurements {
  width: number;
  height: number;
}

export const getTextMetrics = (ctx: CanvasRenderingContext2D, text: string): ITextMeasurements => {
  const metrics = ctx.measureText(text);
  return {
    width: metrics.width,
    height: metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent,
  };
};

export class CustomScreen {
  public static readonly defaultFont = '12px monospace';
  public static readonly defaultForeground = '#fff';
  public static readonly defaultBackground = '#000';

  private _wrapper: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  public x: number = 0; // X-position
  public y: number = 0; // Y-position
  private _foreground: ScreenColour;
  private _background: ScreenColour;
  private _savedStates: IScreenState[] = [];
  private _padding: number = 0; // Text padding
  public font: Font;

  constructor(wrapper: HTMLDivElement) {
    this._wrapper = wrapper;
    this._canvas = document.createElement('canvas');
    this._wrapper.appendChild(this._canvas);
    this._canvas.classList.add('screen');
    this._ctx = this._canvas.getContext('2d');
    this.font = new Font();
    this.reset();
  }

  public reset() {
    this._background = CustomScreen.defaultBackground
    this._foreground = CustomScreen.defaultForeground;
    this.font.toDefault();
    this.x = 0;
    this.y = 0;
    this.clear();
  }

  public getWidth(): number { return this._canvas.width; }
  public setWidth(value: number): CustomScreen { this._canvas.width = value; this.clear(); return this; }

  public getHeight(): number { return this._canvas.height; }
  public setHeight(value: number): CustomScreen { this._canvas.height = value; this.clear(); return this; }


  public getForeground(): ScreenColour { return this._foreground; }
  public setForeground(value: ScreenColour): CustomScreen { this._foreground = value; return this; }

  public getBackground(): ScreenColour { return this._background; }
  public setBackground(value: ScreenColour): CustomScreen { this._background = value; return this; }

  public getPadding(): number { return this._padding; }
  public setPadding(value: number): CustomScreen { this._padding = value; return this; }

  /** Write string to screen. Move cursor position to end of string? */
  public writeString(string: string, moveCursorPos = true, maxWidth?: number) {
    const ctx = this._ctx, metrics = getTextMetrics(ctx, string);
    // Fill background
    if (this._background !== null) {
      ctx.beginPath();
      ctx.fillStyle = this._background;
      ctx.rect(this.x - this._padding, this.y - this._padding, metrics.width + this._padding * 2, metrics.height + this._padding * 2);
      ctx.fill();
    }
    // Fill text
    if (this._foreground !== null) {
      ctx.beginPath();
      ctx.textBaseline = 'top';
      ctx.textAlign = 'start';
      ctx.fillStyle = this._foreground;
      ctx.fillText(string, this.x, this.y, maxWidth);
    }
    if (moveCursorPos) this.x += metrics.width;
  }

  public clear() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    if (this._background !== null) {
      this._ctx.beginPath();
      this._ctx.fillStyle = this._background;
      this._ctx.rect(0, 0, this._canvas.width, this._canvas.height);
      this._ctx.fill();
    }
  }

  public measureText(text: string): ITextMeasurements {
    return getTextMetrics(this._ctx, text);
  }

  /** Make changed to Font object in function. The font string will then be updated. */
  public updateFont(action: (font: Font) => void): CustomScreen {
    action(this.font);
    this._ctx.font = this.font.toString();
    return this;
  }

  public getState(): IScreenState {
    return {
      foreground: this._foreground,
      background: this._background,
      x: this.x,
      y: this.y,
      font: this.font.clone(),
    };
  }

  public saveState(): CustomScreen {
    this._savedStates.push(this.getState());
    return this;
  }

  public restoreState(): boolean {
    if (this._savedStates.length > 0) {
      const state = this._savedStates.pop();
      this._foreground = state.foreground;
      this._background = state.background;
      this.x = state.x;
      this.y = state.y;
      this.font = state.font;
      this._ctx.font = this.font.toString();
      return true;
    } else {
      console.warn(`No states left to restore to.`);
      return false;
    }
  }
}

// ======== UTILITY FUNCTIONS FOR SCREEN ========
/** Apply operations to a screen within an enclosed state */
export function withinState(screen: CustomScreen, action: (S: CustomScreen) => void) {
  screen.saveState();
  action(screen);
  screen.restoreState();
}

/** Write multi-line to the screen */
export function writeMultilineString(screen: CustomScreen, text: string, maxWidth?: number) {
  const lines = text.split(/\r\n|\n|\r/g), lastIndex = lines.length - 1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let dim = screen.measureText(line);
    screen.writeString(line, false, maxWidth);
    if (i != lastIndex) screen.y += dim.height;
  }
}

export const errorForeground = '#f9accb';
export const errorBackground = '#4C2F36';

/** Write text to center of screen */
export function writeInCentre(screen: CustomScreen, text: string) {
  const dim = screen.measureText(text);
  screen.x = screen.getWidth() / 2 - dim.width / 2;
  screen.y = screen.getHeight() / 2 - dim.height / 2;
  screen.writeString(text);
}

export function writeMultilineInCentre(screen: CustomScreen, text: string) {
  const lines = text.split(/\r\n|\n|\r/g), lastIndex = lines.length - 1, Swidth = screen.getWidth(), Sheight = screen.getHeight();
  let textDimensions: ITextMeasurements[] = [], wholeTextHeight = 0;
  for (let i = 0; i < lines.length; i++) {
    let dim = screen.measureText(lines[i]);
    textDimensions.push(dim);
    wholeTextHeight += dim.height * 1.1;
  }

  screen.y = Sheight / 2 - wholeTextHeight / 2;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], dim = textDimensions[i];
    screen.x = Swidth / 2 - dim.width / 2;
    screen.writeString(line, false);
    if (i != lastIndex) screen.y += dim.height;
  }
}

export default CustomScreen;