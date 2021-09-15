export class FileUploader {
  private _btnContainer: HTMLElement;
  private _listContainer: HTMLElement;
  private _files = new Map<string, File>();
  private _reader: FileReader;

  constructor(btnText = 'Upload Files') {
    this._reader = new FileReader();

    this._btnContainer = this._createBtnContainer(btnText);
    this._listContainer = this._createListContainer();
  }

  private _createListContainer() {
    const container = document.createElement('div');
    container.classList.add('fileuploader-files');
    return container;
  }

  private _createBtnContainer(btnText: string) {
    const btnContainer = document.createElement("div");
    btnContainer.classList.add('fileuploader-container');
    const input = document.createElement("input");
    input.type = "file";
    input.id = `freader-fupload-${Math.random()}`;
    input.style.display = "none";
    input.multiple = true;
    input.addEventListener('input', e => {
      for (let file of input.files) {
        this.fadd(file.name, file);
      }
    });
    btnContainer.appendChild(input);
    const label = document.createElement("label");
    label.classList.add('fileuploader-upload', 'btn');
    label.setAttribute('for', input.id);
    label.innerText = btnText;
    btnContainer.appendChild(label);
    return btnContainer;
  }

  private _updateFileList() {
    this._listContainer.innerHTML = '';
    this._files.forEach((file, name) => {
      this._listContainer.appendChild(this._fileListSpan(name, file));
    });
  }

  private _fileListSpan(name: string, file: File) {
    const span = document.createElement('span');
    span.innerText = name;
    span.dataset.type = file.type;
    span.classList.add('fileuploader-file-item');
    span.addEventListener('click', () => this.fremove(name));
    return span;
  }

  /** Attach to HTML elements */
  public attach(btnTarget: HTMLElement, listTarget: HTMLElement) {
    btnTarget.appendChild(this._btnContainer);
    listTarget.appendChild(this._listContainer);
    return this;
  }

  /** Does a file with this name exist? */
  public fexists(name: string) { return this._files.has(name); }

  /** Add a new file */
  public fadd(name: string, file: File) {
    this._files.set(name, file);
    this._updateFileList();
  }

  /** Remove file */
  public fremove(name: string) {
    const bool = this._files.delete(name);
    this._updateFileList();
    return bool;
  }

  /** Read a file as text */
  public freadText(name: string, encoding?: string): Promise<string> {
    if (!this._files.has(name)) throw new Error(`fread: file '${name}' could not be located`);
    return new Promise((resolve) => {
      this._reader.onload = () => void resolve(this._reader.result as string);
      this._reader.readAsText(this._files.get(name), encoding);
    });
  }

  /** Read a file as data buffer */
  public freadBuffer(name: string): Promise<ArrayBuffer> {
    if (!this._files.has(name)) throw new Error(`fread: file '${name}' could not be located`);
    return new Promise((resolve) => {
      this._reader.onload = () => void resolve(this._reader.result as ArrayBuffer);
      this._reader.readAsArrayBuffer(this._files.get(name));
    });
  }

  /** Return array of all file names */
  public getFiles() { return Array.from(this._files.keys()); }

  /** Return file object of a file */
  public getFile(name: string) { return this._files.get(name); }
}