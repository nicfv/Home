import { JTable } from './JTable.js';

export class Checklist extends JTable {
    /**
     * @private @readonly @type {(list: string[]) => any} This function is called whenever a change is made in the checklist
     */
    onchange;
    /**
     * @private @readonly @type {string[]} The data within the checklist
     */
    list = [];
    /**
     * Create a new checklist.
     * @param {HTMLElement} parent The containing element of this checklist
     * @param {string} header An optional header at the top of the checklist
     */
    constructor(parent, onchange, header) {
        super(parent);
        this.onchange = onchange;
        if (header) {
            const headerRow = document.createElement('div');
            headerRow.textContent = header;
            this.addHeaders([headerRow]);
            headerRow.parentElement.setAttribute('colspan', '2');
        }
        const input = document.createElement('input'),
            addBtn = document.createElement('button');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'New item...');
        input.setAttribute('title', 'Type in a new item here.');
        addBtn.setAttribute('title', 'Add this item to the checklist!');
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            if (input.value) {
                this.addItem(input.value);
                this.onchange(this.list);
                input.value = '';
            }
        });
        this.addHeaders([input, addBtn]);
    }
    /**
     * Add an item to this checklist.
     * @param {string} item The item to add to this checklist
     */
    addItem(item) {
        const deleteBtn = document.createElement('button'),
            row = this.addRow([item, deleteBtn], 'td');
        deleteBtn.setAttribute('title', 'Check off this item from the checklist.');
        deleteBtn.textContent = '\u2713';
        deleteBtn.addEventListener('click', () => {
            this.table.removeChild(row);
            this.list.splice(this.list.indexOf(item), 1);
            this.onchange(this.list);
        });
        this.list.push(item);
    }
}