export interface ITableObject {
    c: string[]; // Column headers
    r: any[][]; // Row data
}

export interface ITablePermissions {
    editHeaders: boolean;
    addHeader: boolean;
    editRows: boolean;
    addRows: boolean;
}

/** Fill permissions object, setting all UNDEFINED values to TRUE/FALSE */
export function completeTablePermissions(o: object, bool = true): ITablePermissions {
    let keys = ["editHeaders", "addHeader", "editRows", "addRows"];
    let permissions = {};
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
            });
            if (permissions.addHeader) {
                const th = document.createElement('th'), btn = document.createElement('button');
                tr.appendChild(th);
                th.appendChild(btn);
                btn.classList.add(...this.buttonClasses);
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
            btn.classList.add(...this.buttonClasses);
            btn.addEventListener('click', () => {
                this._rows.push(Array.from({ length: this._cols.length }, () => ''));
                onUpdate(this);
            });
        }

        return table;
    }

    toObject(): ITableObject {
        return { r: this._rows, c: this._cols };
    }

    fromObject(o: ITableObject) {
        TableCreator.fix(o.c, o.r);
        this._rows = o.r;
        this._cols = o.c;
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
}