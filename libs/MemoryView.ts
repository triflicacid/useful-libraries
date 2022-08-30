import CustomScreen, { ITextMeasurements, withinState, ScreenColour } from "./Screen";
import type { Font } from "./Font";
import { clamp, downloadBlob, downloadTextFile, readBinaryFile } from "./utils";

export interface IMemoryViewCache {
  ySpacing: number;
  offsetLabelsLength: number; // Padding of '0's required on hexadecimal addresses
  offsetLabelsDimensions: ITextMeasurements;
  rowTitleWidth: number;
  xSpacing: number;
  xPad: number;
}

export class MemoryView {
  public readonly screen: CustomScreen;
  private _data: DataView;

  private _rows = 20;
  private _cols = 20;
  private _base = 16;
  private _text = new TextDecoder("utf8");
  public displayText = false;
  private _cache: IMemoryViewCache | undefined;
  private _startAddr = 0;

  public colorAddresses = new Map<number, ScreenColour>();

  constructor(wrapper: HTMLDivElement, dataView: DataView) {
    this.screen = new CustomScreen(wrapper);
    this.screen.updateFont((font: Font) => {
      font.family = "consolas";
      font.size = 11;
    });
    this._data = dataView;

    this._updateCache();
    this._render();
  }

  public get length() { return this._data.byteLength; }

  public get startAddress(): number { return this._startAddr; }
  public set startAddress(addr: number) { this._startAddr = addr; this._updateCache(); this._render(); }

  public get rows(): number { return this._rows; }
  public set rows(value: number) { this._rows = value; this._updateCache(); this._render(); }

  public get cols(): number { return this._cols; }
  public set cols(value: number) { this._cols = value; this._updateCache(); this._render(); }

  public get base(): number { return this._base; }
  public set base(value: number) { this._base = value; this._updateCache(); this._render(); }

  public get text(): string { return this._text.encoding; }
  public set text(value: string) { this._text = new TextDecoder(value); this._updateCache(); this._render(); }

  /** Change data view */
  public setDataView(dataView: DataView) {
    this._data = dataView;
    this._updateCache();
    this._render();
  }

  public updateScreen(callback: (S: CustomScreen) => void) {
    callback(this.screen);
    this._updateCache();
    this._render();
  }

  /** View address range covered by the current screen */
  public getAddressRange() {
    return [this._startAddr, this._startAddr + (this._rows * this._cols - 1)];
  }

  private _updateCache() {
    const ySpacing = this.screen.getHeight() / (this._cols + 1);
    const offsetLabelsLength = this.getAddressRange()[1].toString(this._base).length, offsetLabelsDimensions = this.screen.measureText('0'.repeat(offsetLabelsLength) + ':');
    const rowTitleWidth = 5 + offsetLabelsDimensions.width;
    const xSpaceRemaining = this.screen.getWidth() - rowTitleWidth, xPad = 10;
    const xSpacing = (xSpaceRemaining - xPad * 2) / this._rows;

    const cache: IMemoryViewCache = { ySpacing, offsetLabelsLength, offsetLabelsDimensions, rowTitleWidth, xSpacing, xPad };
    this._cache = cache;
  }

  /** Number to text */
  private _textDecode(n: number) {
    return n > 0x1F ? this._text.decode(new Uint8Array([n])) : ".";
  }

  /** Render headers and all addresses on current page */
  private _render() {
    const S = this.screen, D = this._data;
    S.clear();

    // Headers
    S.saveState();
    S.updateFont((font: Font) => {
      font.weight = 900;
    });
    S.setForeground("lime");

    const cache = this._cache as IMemoryViewCache;
    S.y = cache.ySpacing / 3;
    // Column headers
    S.y = cache.ySpacing;
    S.x = cache.rowTitleWidth - cache.offsetLabelsDimensions.width;
    for (let col = 0, addr = this._startAddr; col < this._cols; col++, addr += this._rows) {
      let text = addr.toString(this._base).padStart(cache.offsetLabelsLength, '0') + ':';
      S.writeString(text, false);
      S.y += cache.ySpacing;
    }

    // Determine what space we've got left
    const startX = cache.rowTitleWidth + cache.xPad, startY = cache.ySpacing / 2 - 0.5 * cache.offsetLabelsDimensions.height;
    S.y = startY;
    S.x = startX;
    // Row headers
    for (let row = 0; row < this._rows; row++) {
      let text = row.toString(this._base).padStart(2, '0');
      S.writeString(text, false);
      S.x += cache.xSpacing;
    }
    S.restoreState();

    S.x = startX;
    S.y = cache.ySpacing;
    S.setForeground('lightgrey');
    const maxLength = (255).toString(this._base).length;
    // Address values
    for (let col = 0, addr = this._startAddr; col < this._cols; col++) {
      for (let row = 0; row < this._rows; row++, addr++) {
        if (addr >= 0 && addr < D.byteLength) {
          let value = D.getUint8(addr);
          let text = this.displayText ? this._textDecode(value) : value.toString(this.base).padStart(maxLength, '0');
          if (this.colorAddresses.has(addr)) {
            withinState(this.screen, (S: CustomScreen) => {
              S.setForeground(this.colorAddresses.get(addr) as ScreenColour);
              S.writeString(text, false);
            });
          } else {
            S.writeString(text, false);
          }
        } else {
          S.writeString('-', false);
        }
        S.x += cache.xSpacing;
      }
      S.y += cache.ySpacing;
      S.x = startX;
    }
  }

  /** Render a single address */
  private _renderAddress(address: number) {
    const relAddress = address - this.startAddress; // Address relative to where we are in the view
    const row = Math.floor(relAddress / this._rows);
    const col = relAddress - (row * this._rows);
    const cache = this._cache as IMemoryViewCache;
    let x = (cache.rowTitleWidth + cache.xPad) + (col * cache.xSpacing);
    let y = cache.ySpacing + (row * cache.ySpacing);
    this.screen.x = x;
    this.screen.y = y;

    if (relAddress >= 0 && relAddress < this.length) {
      const value = this._data.getUint8(address);
      const maxLength = (255).toString(this._base).length;
      let text = this.displayText ? this._textDecode(value) : value.toString(this.base).padStart(maxLength, '0');
      if (this.colorAddresses.has(address)) {
        withinState(this.screen, (S: CustomScreen) => {
          S.setForeground(this.colorAddresses.get(address) as ScreenColour);
          S.writeString(text, false);
        });
      } else {
        this.screen.writeString(text, false);
      }
    } else {
      this.screen.writeString('-', false);
    }
  }

  /** Update given address in MemortView. If not provided, everything will be updated */
  public update(address?: number) {
    if (typeof address === 'number') {
      this._renderAddress(address);
    } else {
      this._render();
    }
  }
}

export interface IControlOptions {
  wrapper: HTMLDivElement;
  dataView: DataView;
  onupdate?: (dataView: DataView) => void
  editable?: boolean;
  resizable?: boolean;
  colorCurrent?: string;
  keyboardControl?: boolean;
}

export interface IControlReturnData {
  wrapper: HTMLDivElement;
  dataView: DataView;
  view: MemoryView;
  updateGUI: () => void;
  remove: () => void;
}

/** HTML template a controls for MemoryView */
export function generateControl(options: IControlOptions) {
  options.editable ??= true;
  options.resizable ??= true;
  options.onupdate ??= () => void 0;
  options.colorCurrent ??= 'yellow';
  options.keyboardControl ??= true;

  const viewDiv = document.createElement("div");
  const view = new MemoryView(viewDiv, options.dataView);
  var eventMap: Map<keyof HTMLElementEventMap, (ev: Event) => any> = new Map();
  function remove() {
    eventMap.forEach((handle, type) => viewDiv.removeEventListener(type, handle));
    viewDiv.remove();
    options.wrapper.remove();
    (Object.keys(DATA) as (keyof IControlReturnData)[]).forEach(key => delete DATA[key]);
  }
  const DATA = { wrapper: options.wrapper, view, dataView: options.dataView, updateGUI, remove } as IControlReturnData;

  /// Edit memory
  let p = document.createElement("p"), addressViewing: number;
  options.wrapper.appendChild(p);
  /** Read value of given address */
  const inputtedAddress = (address: number | string) => {
    const addr = typeof address === 'string' ? parseInt(address) : Math.floor(address);
    if (isNaN(addr)) {
      inputtedAddress(0);
    } else {
      view.colorAddresses.delete(addressViewing);
      addressViewing = addr;
      view.colorAddresses.set(addressViewing, options.colorCurrent as string);
      if (addr >= 0 && addr < view.length) {
        const decimal = DATA.dataView.getUint8(addr);
        inputAddressValue.value = decimal.toString();
      } else {
        inputAddressValue.value = '0';
      }
    }
  };
  p.insertAdjacentHTML('beforeend', 'Address ');
  let inputAddress = document.createElement("input");
  inputAddress.type = "number";
  inputAddress.value = "0";
  inputAddress.min = "0";
  inputAddress.addEventListener('change', e => {
    inputtedAddress(inputAddress.value);
    view.update();
    e.preventDefault();
  });
  p.appendChild(inputAddress);
  p.insertAdjacentHTML('beforeend', ' &equals; ');
  let inputAddressValue = document.createElement("input");
  inputAddressValue.type = "number";
  inputAddressValue.addEventListener('keyup', e => {
    if (e.key === " " || (e.key.length === 1 && isNaN(+e.key))) {
      inputAddressValue.value = e.key.charCodeAt(0).toString();
    }
    e.preventDefault();
  });
  inputAddressValue.addEventListener('change', e => {
    // Write to address
    const decimal = +inputAddressValue.value;
    if (options.editable && !isNaN(decimal) && isFinite(decimal) && addressViewing >= 0 && addressViewing < view.length) {
      DATA.dataView.setUint8(addressViewing, decimal);
      view.update(addressViewing);
      updateGUI();
      if (options.onupdate) options.onupdate(DATA.dataView);
    }
    inputtedAddress(inputAddress.value); // Reset
    e.preventDefault();
  });
  if (!options.editable) inputAddressValue.readOnly = true;
  p.appendChild(inputAddressValue);
  inputtedAddress(0);

  // Size
  p.insertAdjacentHTML("beforeend", "&nbsp; &nbsp;|&nbsp; &nbsp;Size: ");
  let inputSize = document.createElement("input");
  inputSize.type = "number";
  inputSize.min = "0";
  if (options.editable && options.resizable) {
    inputSize.addEventListener("change", e => {
      let size = parseInt(inputSize.value);
      if (size >= 0 && size !== view.length) {
        let buff: ArrayBuffer;
        if (size < view.length) {
          buff = DATA.dataView.buffer.slice(0, size);
        } else {
          buff = new ArrayBuffer(size);
          new Uint8Array(buff).set(new Uint8Array(DATA.dataView.buffer), 0);
        }
        DATA.dataView = new DataView(buff);
        if (options.onupdate) options.onupdate(DATA.dataView);
        view.setDataView(DATA.dataView);
        view.update();
      }
      updateGUI();
      e.preventDefault();
    });
  } else {
    inputSize.readOnly = true;
  }
  p.appendChild(inputSize);

  // Display
  p.insertAdjacentHTML("beforeend", "&nbsp; | Display: ");
  let displayBaseRadio = document.createElement("input");
  const displayName = "display-" + Math.random().toString() + Math.random().toString();
  displayBaseRadio.type = "radio";
  displayBaseRadio.name = displayName;
  displayBaseRadio.checked = true;
  displayBaseRadio.addEventListener("change", () => {
    view.displayText = !displayBaseRadio.checked;
    view.update();
  });
  p.appendChild(displayBaseRadio);
  p.insertAdjacentHTML("beforeend", " Base ");
  let displayBaseSelect = document.createElement("select");
  displayBaseSelect.value = view.base.toString();
  for (let b = 2; b <= 36; b++) displayBaseSelect.insertAdjacentHTML("beforeend", `<option value='${b}'${b === view.base ? ' selected' : ''}>${b}</option>`);
  displayBaseSelect.addEventListener("change", () => {
    view.base = parseInt(displayBaseSelect.value);
    if (options.onupdate) options.onupdate(DATA.dataView);
    view.update();
  });
  p.appendChild(displayBaseSelect);
  let displayTextRadio = document.createElement("input");
  displayTextRadio.type = "radio";
  displayTextRadio.name = displayName;
  if (view.displayText) displayTextRadio.checked = true;
  displayTextRadio.addEventListener("change", () => {
    view.displayText = displayTextRadio.checked;
    view.update();
  });
  p.appendChild(displayTextRadio);
  p.insertAdjacentHTML("beforeend", " Text ");
  let displayTextInput = document.createElement("input");
  displayTextInput.value = view.text;
  displayTextInput.addEventListener("change", e => {
    try {
      view.text = displayTextInput.value;
      view.update();
    } catch (e) {
      displayTextInput.value = view.text ?? '';
      alert(`Unable to view as text '${displayTextInput.value}'`);
    }
    e.preventDefault();
  });
  p.appendChild(displayTextInput);

  /// Buttons
  p = document.createElement("p");
  options.wrapper.appendChild(p);
  // Start button - go to start
  const btnStart = document.createElement("button");
  btnStart.innerText = '0';
  p.appendChild(btnStart);
  btnStart.addEventListener('click', () => {
    view.startAddress = 0;
    updateGUI();
    view.update();
  });
  p.insertAdjacentHTML('beforeend', ' &nbsp;&nbsp;');
  // Back button - go back an address page
  const btnBack = document.createElement("button");
  btnBack.innerHTML = '&larr;';
  p.appendChild(btnBack);
  btnBack.addEventListener('click', () => {
    view.startAddress -= view.rows * view.cols;
    if (view.startAddress < 0) view.startAddress = 0;
    updateGUI();
    view.update();
  });
  p.insertAdjacentHTML('beforeend', ' &nbsp;&nbsp;&nbsp;&nbsp; ');

  // Show current address range
  const addressRange = document.createElement("code");
  p.appendChild(addressRange);

  // Update all GUI elements
  function updateGUI() {
    // addressRange HTML
    const pad = view.length.toString(view.base).length;
    const [min, max] = view.getAddressRange();
    const range = `${min.toString(view.base).padStart(pad, '0')} - ${max.toString(view.base).padStart(pad, '0')}`;
    addressRange.innerText = range;
    inputAddress.max = view.length.toString();
    view.colorAddresses.delete(addressViewing);
    addressViewing = clamp(0, view.length, addressViewing);
    view.colorAddresses.set(addressViewing, options.colorCurrent as string);
    btnEnd.innerText = view.length.toString(view.base);
    inputAddress.value = addressViewing.toString();
    inputtedAddress(addressViewing);
    inputSize.value = view.length.toString();
    if (options.editable) {
      btnSetInRange.innerText = range;
    }

    // Limiting buttons
    if (view.startAddress <= 0) {
      btnBack.setAttribute("disabled", "disabled");
    } else {
      btnBack.removeAttribute("disabled");
    }
    if (view.startAddress + (max - min) >= view.length) {
      btnForward.setAttribute("disabled", "disabled");
    } else {
      btnForward.removeAttribute("disabled");
    }
  }

  // Forward button - go forward an address page
  p.insertAdjacentHTML('beforeend', ' &nbsp;&nbsp;&nbsp;&nbsp; ');
  const btnForward = document.createElement("button");
  btnForward.innerHTML = '&rarr;';
  btnForward.addEventListener('click', () => {
    view.startAddress += view.rows * view.cols;
    updateGUI();
  });
  p.appendChild(btnForward);

  // End button - go to end
  p.insertAdjacentHTML('beforeend', ' &nbsp;&nbsp;');
  const btnEnd = document.createElement("button");
  p.appendChild(btnEnd);
  btnEnd.addEventListener('click', () => {
    const [min, max] = view.getAddressRange();
    view.startAddress = view.length - (max - min);
    updateGUI();
    view.update();
  });

  // Set memory in range/all
  let btnSetInRange: HTMLButtonElement, btnSetAll: HTMLButtonElement, btnSetInputRange: HTMLButtonElement, inputSetValue: HTMLInputElement;
  if (options.editable) {
    p.insertAdjacentHTML('beforeend', ' &nbsp;&nbsp; | &nbsp;&nbsp; Set ');
    btnSetInRange = document.createElement("button");
    btnSetInRange.addEventListener('click', () => {
      let [min, max] = view.getAddressRange();
      min = Math.max(0, min);
      max = Math.min(view.length, max);
      const number = +inputSetValue.value;
      for (let i = min; i < max; ++i) {
        DATA.dataView.setUint8(i, checkboxFillRandom.checked ? Math.floor(Math.random() * 255) : number);
      }
      updateGUI();
      view.update();
      if (options.onupdate) options.onupdate(DATA.dataView);
    });
    p.appendChild(btnSetInRange);
    btnSetAll = document.createElement("button");
    btnSetAll.innerText = 'All';
    btnSetAll.addEventListener('click', () => {
      const number = +inputSetValue.value;
      for (let i = 0; i < DATA.dataView.byteLength; ++i) {
        DATA.dataView.setUint8(i, checkboxFillRandom.checked ? Math.floor(Math.random() * 255) : number);
      }
      updateGUI();
      view.update();
      if (options.onupdate) options.onupdate(DATA.dataView);
    });
    p.appendChild(btnSetAll);
    btnSetInputRange = document.createElement("button");
    btnSetInputRange.innerText = 'Range';
    btnSetInputRange.addEventListener('click', () => {
      let range = view.getAddressRange(), rangeInput = prompt(`Range of addresses to set`, range.join(', '));
      if (rangeInput === null) return;
      if (rangeInput) {
        let parsed = rangeInput.split(',').map(n => parseInt(n));
        range[0] = parsed[0];
        range[1] = parsed[1];
        if (parsed.length !== 2 || range[0] > range[1] || range[0] < 0 || range[1] > view.length + 1) return alert(`Invalid range.`);
      }
      if (checkboxFillRandom.checked) {
        for (let i = range[0]; i < range[1]; ++i) {
          DATA.dataView.setUint8(i, Math.floor(Math.random() * 255));
        }
      } else {
        const number = +inputSetValue.value;
        for (let i = range[0]; i < range[1]; ++i) {
          DATA.dataView.setUint8(i, number);
        }
      }
      view.colorAddresses.delete(addressViewing);
      addressViewing = range[0];
      updateGUI();
      view.update();
      if (options.onupdate) options.onupdate(DATA.dataView);
    });
    p.appendChild(btnSetInputRange);
    p.insertAdjacentHTML('beforeend', ' &nbsp;to ');
    inputSetValue = document.createElement("input");
    inputSetValue.type = "number";
    inputSetValue.value = "0";
    inputSetValue.addEventListener('keyup', e => {
      if (e.key.length === 1 && isNaN(+e.key)) {
        inputSetValue.value = e.key.charCodeAt(0).toString();
      }
      e.preventDefault();
    });
    inputSetValue.addEventListener('change', e => {
      let value = +inputSetValue.value;
      if (isNaN(value) || !isFinite(value)) {
        inputSetValue.value = "0";
      } else {
        inputSetValue.value = value.toString();
      }
      e.preventDefault();
    })
    p.appendChild(inputSetValue);
    let checkboxFillRandom = document.createElement("input");
    checkboxFillRandom.type = "checkbox";
    checkboxFillRandom.addEventListener('change', () => {
      inputSetValue.disabled = checkboxFillRandom.checked;
    });
    p.appendChild(checkboxFillRandom);
    p.insertAdjacentHTML("beforeend", " <abbr title='Fill range with random bytes'>Random</abbr>");

    p.insertAdjacentHTML("beforeend", " | ");
    let insertText = document.createElement("button");
    insertText.innerText = "Insert";
    p.appendChild(insertText);
    insertText.addEventListener("click", () => {
      let bytes = new TextEncoder().encode(inputText.value);
      for (let a = +inputTextFrom.value, i = 0; i < bytes.byteLength && a < DATA.dataView.byteLength; a++, i++) {
        DATA.dataView.setUint8(a, bytes[i]);
      }
      updateGUI();
      view.update();
      if (options.onupdate) options.onupdate(DATA.dataView);
    });
    p.insertAdjacentHTML("beforeend", " ");
    let inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "text";
    p.appendChild(inputText);
    p.insertAdjacentHTML("beforeend", " from ");
    let inputTextFrom = document.createElement("input");
    inputTextFrom.type = "number";
    inputTextFrom.value = "0";
    inputTextFrom.title = "Address to insert text from";
    p.appendChild(inputTextFrom);
  }

  // Append MemoryViewer to screen
  options.wrapper.appendChild(viewDiv);

  p = document.createElement("p");
  options.wrapper.appendChild(p);
  // Row count
  p.insertAdjacentHTML('beforeend', 'Rows: ');
  let inputRows = document.createElement("input");
  inputRows.type = "number";
  inputRows.min = "1";
  inputRows.max = "50";
  inputRows.value = view.rows.toString();
  p.appendChild(inputRows);
  inputRows.addEventListener('change', e => {
    const rows = parseInt(inputRows.value);
    if (rows >= +inputRows.min && rows < +inputRows.max) {
      view.rows = rows;
      updateGUI();
    } else {
      inputRows.value = view.rows.toString();
    }
    e.preventDefault();
  });
  // Col count
  p.insertAdjacentHTML('beforeend', ' &nbsp;|&nbsp; Cols: ');
  let inputCols = document.createElement("input");
  inputCols.type = "number";
  inputCols.min = "1";
  inputCols.max = "75";
  inputCols.value = view.cols.toString();
  p.appendChild(inputCols);
  inputCols.addEventListener('change', e => {
    const cols = parseInt(inputCols.value);
    if (cols >= +inputCols.min && cols < +inputCols.max) {
      view.cols = cols;
      updateGUI();
    } else {
      inputCols.value = view.cols.toString();
    }
    e.preventDefault();
  });
  // Download as file
  p.insertAdjacentHTML('beforeend', ' &nbsp;|&nbsp; ');
  let btnDownload = document.createElement("button");
  btnDownload.innerText = 'Download';
  btnDownload.addEventListener('click', () => {
    let range = [0, view.length], rangeInput = prompt(`Range of bytes to download`, range.join(', '));
    if (rangeInput === null) return;
    if (rangeInput) {
      let parsed = rangeInput.split(',').map(n => parseInt(n));
      range[0] = parsed[0];
      range[1] = parsed[1];
      if (parsed.length !== 2 || range[0] > range[1] || range[0] < 0 || range[1] > view.length) return alert(`Invalid range.`);
    }
    downloadBlob(DATA.dataView.buffer.slice(range[0], range[1]), 'data.bin', 'application/octet-stream');
  });
  p.appendChild(btnDownload);
  p.insertAdjacentHTML('beforeend', ' &nbsp;');
  let btnDownloadText = document.createElement("button");
  btnDownloadText.innerText = 'Download as Text';
  function download() {
    let range = [0, view.length], rangeInput = prompt(`Range of bytes to convert`, range.join(', '));
    if (rangeInput === null) return;
    if (rangeInput) {
      let parsed = rangeInput.split(',').map(n => parseInt(n));
      range[0] = parsed[0];
      range[1] = parsed[1];
      if (parsed.length !== 2 || range[0] > range[1] || range[0] < 0 || range[1] > view.length) return alert(`Invalid range.`);
    }
    let dec = new TextDecoder();
    let text = dec.decode(DATA.dataView.buffer.slice(range[0], range[1]));
    downloadTextFile(text, 'data.txt');
  }
  btnDownloadText.addEventListener('click', download);
  p.appendChild(btnDownloadText);
  // Upload a file
  let upload = async () => { };
  if (options.editable) {
    let inputUpload = document.createElement('input');
    inputUpload.type = 'file';
    upload = async () => {
      const file = (inputUpload.files as FileList)[0];
      if (file) {
        let buff = await readBinaryFile(file);
        if (!options.resizable && buff.byteLength !== DATA.dataView.byteLength) return alert(`Uploaded file must contain ${DATA.dataView.byteLength} bytes; got ${buff.byteLength} bytes`);
        DATA.dataView = new DataView(buff);
        view.setDataView(DATA.dataView);
        if (options.onupdate) options.onupdate(DATA.dataView);
        updateGUI();
      }
    };
    inputUpload.addEventListener('input', upload);

    p.insertAdjacentHTML('beforeend', ' &nbsp;');
    let btnUpload = document.createElement('button');
    btnUpload.innerText = 'Upload';
    btnUpload.addEventListener('click', () => inputUpload.click());
    p.appendChild(btnUpload);
  }

  // Keyboard control
  if (options.keyboardControl) {
    function changeAddress(newAddr: number) {
      let arange = view.getAddressRange();
      if (newAddr < arange[0]) {
        view.startAddress -= view.rows * view.cols;
        if (view.startAddress < 0) view.startAddress = 0;
      } else if (newAddr > arange[1]) {
        view.startAddress += view.rows * view.cols;
      }
      inputtedAddress(newAddr);
      updateGUI();
      view.update();
    }

    let editMSN = true; // In hex digit "01", edit "0" or "1"?
    let handle = (e: Event) => {
      const key = (e as KeyboardEvent).key;
      if (key === 'ArrowRight') {
        if (addressViewing + 1 < view.length) {
          changeAddress(addressViewing + 1);
          editMSN = true;
          e.preventDefault();
        }
      } else if (key === 'ArrowLeft') {
        if (addressViewing - 1 >= 0) {
          changeAddress(addressViewing - 1);
          editMSN = true;
          e.preventDefault();
        }
      } else if (key === 'ArrowUp') {
        if (addressViewing - view.rows >= 0) {
          changeAddress(addressViewing - view.rows);
          editMSN = true;
          e.preventDefault();
        }
      } else if (key === 'ArrowDown') {
        if (addressViewing + view.rows < view.length) {
          changeAddress(addressViewing + view.rows);
          editMSN = true;
          e.preventDefault();
        }
      } else if (/[0-9a-fA-F]/.test(key)) {
        let n = parseInt(key, 16), val = DATA.dataView.getUint8(addressViewing);
        DATA.dataView.setUint8(addressViewing, editMSN ? ((n << 4) | (val & 0x0f)) : ((val & 0xf0) | n));
        updateGUI();
        view.update();
        if (options.onupdate) options.onupdate(DATA.dataView);
        editMSN = !editMSN;
      } else if (key === 'i') {
        inputAddressValue.focus();
      } else if ((e as KeyboardEvent).ctrlKey && (key === 'd' || key === 'o')) {
        if (key === 'd') {
          download();
          e.preventDefault();
        } else if (key === 'o') {
          upload();
          e.preventDefault();
        }
      }
    };
    eventMap.set("keydown", handle);
  }

  updateGUI();

  // Register all events
  viewDiv.tabIndex = 0;
  viewDiv.focus();
  eventMap.forEach((handle, type) => viewDiv.addEventListener(type, handle));
  return DATA;
}