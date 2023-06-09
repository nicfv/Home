export class JTable {
    /**
     * @private @readonly The containing element of this `JTable`
     */
    table = document.createElement('table');
    /**
     * Create a new JTable.
     * @param {HTMLElement} parent The parent to append this `JTable` onto
     */
    constructor(parent) {
        parent.appendChild(this.table);
    }
    /**
     * @protected Add a row of data to the table.
     * @param {any[]} data Table row data - can be of type `string` or `HTMLElement`
     * @param {'th'|'td'} type Header or data
     * @returns The row last created
     */
    addRow(data, type) {
        const row = document.createElement('tr');
        for (let datum of data) {
            const cell = document.createElement(type);
            if (datum instanceof HTMLElement) {
                cell.appendChild(datum);
            } else if (typeof datum === 'string') {
                cell.textContent = datum;
            } else {
                throw new Error('Incorrect data type: ' + typeof datum);
            }
            row.appendChild(cell);
        }
        this.table.appendChild(row);
        this.table.setAttribute('jt', 'jtable');
        return row;
    }
    /**
     * Add a row of headers to the table.
     * @param {any[]} headers Table header data - can be of type `string` or `HTMLElement`
     */
    addHeaders(headers) {
        this.addRow(headers, 'th');
    }
    /**
     * Add a row of data to the table.
     * @param {any[]} row Table row data - can be of type `string` or `HTMLElement`
     */
    addData(row) {
        this.addRow(row, 'td');
    }
    /**
     * Hide the table.
     */
    hide() {
        this.table.style.display = 'none';
    }
    /**
     * Unhide the table.
     */
    show() {
        this.table.style.display = 'initial';
    }
    /**
     * Remove all rows from the table.
     */
    clear() {
        while (this.table.firstChild) {
            this.table.removeChild(this.table.firstChild);
        }
    }
    /**
     * Create a new fully defined table and append it to the parent element.
     * @param {HTMLElement} parent The parent element for this `JTable`
     * @param {any[][]} data 2D square array of data to insert into the table
     * @param {boolean} hasHeaders Determine if the first row is a table header
     */
    static build(parent, data, hasHeaders) {
        const jt = new JTable(parent);
        if (hasHeaders) {
            jt.addHeaders(data[0]);
            for (let i = 1; i < data.length; i++) {
                jt.addData(data[i]);
            }
        } else {
            for (let row of data) {
                jt.addData(row)
            }
        }
    }
}
