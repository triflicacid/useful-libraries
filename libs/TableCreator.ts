export interface ITableObject {
    c: string[]; // Column headers
    r: any[][]; // Row data
}

export interface ITablePermissions {
    editHeaders: boolean;
    deleteHeader: boolean;
    addHeader: boolean;
    editRows: boolean;
    deleteRows: boolean;
    addRows: boolean;
}

/** Fill permissions object, setting all UNDEFINED values to TRUE/FALSE */
export function completeTablePermissions(o: any, bool = true): ITablePermissions {
    let keys = ["editHeaders", "addHeader", "deleteHeader", "editRows", "deleteRows", "addRows"];
    let permissions: any = {};
    for (let key in o) if (o.hasOwnProperty(key)) permissions[key] = o[key];
    keys.forEach(key => permissions[key] === undefined && (permissions[key] = bool));
    return permissions as ITablePermissions;
}

export class TableCreator {
    private _cols: string[] = [];
    private _rows: any[][] = [];

    public buttonClasses: string[] = []; // Classes for all <button />
    public inputClasses: string[] = []; // Classes for all <input />

    /** To non-interactive HTML */
    toStaticHTML() {
        const table = document.createElement('table');
        table.insertAdjacentHTML('beforeend', `<thead>${this._cols.map(c => `<th>${c}</th>`).join('')}</thead>`);
        table.insertAdjacentHTML('beforeend', `<tbody>${this._rows.map(row => '<tr>' + row.map((x, i) => `<td title='${this._cols[i]}'>${x}</td>`).join('') + '</tr>').join('')}</tbody>`);
        return table;
    }

    /** To interactive HTML. Note, not all table updates wil fully update HTML, so using onUpdate is advised. */
    toInteractiveHTML(onUpdate: (tc: TableCreator) => void, permissions?: ITablePermissions) {
        if (!permissions) permissions = completeTablePermissions({});
        const table = document.createElement('table');
        this.fix();

        if (permissions.editHeaders) {
            const thead = table.createTHead(), tr = document.createElement('tr');
            thead.appendChild(tr);
            this._cols.forEach((col, i) => {
                const th = document.createElement('th'), input = document.createElement('input');
                tr.appendChild(th);
                th.title = 'Column: ' + col;
                th.appendChild(input);
                input.type = 'text';
                input.value = col;
                input.classList.add(...this.inputClasses);
                input.addEventListener('change', () => {
                    th.title = 'Column: ' + input.value;
                    this._cols[i] = input.value;
                    onUpdate(this);
                });
                if (permissions?.deleteHeader) {
                    const btn = document.createElement('button');
                    btn.classList.add(...this.buttonClasses);
                    btn.innerHTML = '&times;';
                    btn.title = 'Delete Column';
                    btn.addEventListener('click', () => {
                        this._cols.splice(i, 1);
                        this.fix();
                        onUpdate(this);
                    });
                    th.appendChild(btn);
                }
            });
            if (permissions.addHeader) {
                const th = document.createElement('th'), btn = document.createElement('button');
                tr.appendChild(th);
                th.appendChild(btn);
                btn.classList.add(...this.buttonClasses);
                btn.title = 'Add Column';
                btn.innerHTML = '&plus;';
                btn.addEventListener('click', () => {
                    this._cols.push('NewCol');
                    onUpdate(this);
                });
                btn.setAttribute('title', 'Add a new column');
            }
        } else {
            table.insertAdjacentHTML('beforeend', `<thead>${this._cols.map(c => `<th>${c}</th>`).join('')}</thead>`);
        }

        if (permissions.editRows) {
            const tbody = table.createTBody();
            this._rows.forEach((row, ri) => {
                const tr = document.createElement('tr');
                row.forEach((col, ci) => {
                    const td = document.createElement('td'), input = document.createElement('input');
                    tr.appendChild(td);
                    td.appendChild(input);
                    input.type = 'text';
                    input.value = col;
                    input.classList.add(...this.inputClasses);
                    input.addEventListener('change', () => {
                        this._rows[ri][ci] = input.value;
                        onUpdate(this);
                    })
                });
                let td = document.createElement('td');
                tr.appendChild(td);
                if (permissions?.deleteRows) {
                    let btn = document.createElement('button');
                    td.appendChild(btn);
                    btn.classList.add(...this.buttonClasses);
                    btn.innerHTML = '&times;';
                    btn.title = 'Remove Row';
                    btn.addEventListener('click', () => {
                        this._rows.splice(ri, 1);
                        tr.remove();
                        onUpdate(this);
                    });
                }
                tbody.appendChild(tr);
            });
        } else {
            table.insertAdjacentHTML('beforeend', `<tbody>${this._rows.map(row => '<tr>' + row.map((x, i) => `<td title='${this._cols[i]}'>${x}</td>`).join('') + '</tr>').join('')}</tbody>`);
        }

        if (permissions.addRows) {
            const tfoot = table.createTFoot(), tr = document.createElement('tr'), td = document.createElement('td'), btn = document.createElement('button');
            tfoot.appendChild(tr);
            tr.appendChild(td);
            td.appendChild(btn);
            td.colSpan = this._cols.length + 1;
            btn.innerHTML = '&plus; Add Row';
            btn.title = 'Add Row';
            btn.classList.add(...this.buttonClasses);
            btn.addEventListener('click', () => {
                this._rows.push(Array.from({ length: this._cols.length }, () => ''));
                onUpdate(this);
            });
        }

        return table;
    }

    toObject(): ITableObject {
        this.fix();
        return { r: this._rows, c: this._cols };
    }

    fromObject(o: ITableObject) {
        TableCreator.fix(o.c, o.r);
        this._rows = o.r;
        this._cols = o.c;
    }

    toCSV(seperator = ',') {
        return this._cols.map(c => `"${c}"`).join(seperator) + '\n' + this._rows.map(row => row.map(r => `"${r}"`).join(seperator)).join('\n');
    }

    fromCSV(csv: string, seperator = ',') {
        const lines = parseCSV(csv, seperator);
        this._cols = lines[0];
        this._rows = lines.slice(1);
    }

    /** Normalise data */
    fix() {
        TableCreator.fix(this._cols, this._rows);
    }

    /** Normalised rows/cols. Modifies arrays. */
    static fix(cols: string[], rows: any[][]) {
        let ccount = cols.length;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].length < ccount) {
                while (rows[i].length < ccount) rows[i].push('');
            } else {
                while (rows[i].length > ccount) rows[i].pop();
            }
        }
    }

    /** Generate empty ITableObject object */
    static empty(): ITableObject {
        return { c: [], r: [] };
    }
}

/** Parse string to CLOSING " (assume opening " was already met at index before 0) (allow escape characters) */
function parseString(string: string): { error: boolean, output: string; index: number } {
    const obj = { error: true, output: '', index: 0 };
    for (obj.index = 0; obj.index < string.length; obj.index++) {
        if (string[obj.index] === '\\') {
            obj.output += string[++obj.index];
        } else {
            if (string[obj.index] === '"') {
                obj.error = false;
                break;
            } else {
                obj.output += string[obj.index];
            }
        }
    }
    return obj;
}

/** Parse CSV */
function parseCSV(input: string, seperator = ',') {
    const _sr = /\s/;
    const lines = [], rows = input.split(/\r\n|\r|\n/g);
    if (rows[rows.length - 1]?.length === 0) rows.pop();
    for (let ri = 0; ri < rows.length; ri++) {
        const row = rows[ri];
        const items = [];
        for (let i = 0; i < row.length; i++) {
            if (_sr.test(row[i])) continue;
            if (row[i] === '"') {
                const info = parseString(row.substr(i + 1));
                if (info.error) throw new Error(`Error parsing CSV: cannot parse string at position ${i} in row ${ri}: "${row}"`);
                items.push(info.output);
                i += info.index + 2;
            } else {
                let item = '';
                while (row[i] !== undefined && row[i] !== seperator) item += row[i++];
                items.push(item);
            }
        }
        lines.push(items);
    }
    return lines;
}