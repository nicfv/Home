import { JBtn } from './JBtn.js';
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
            addBtn = new JBtn('+', () => {
                if (input.value) {
                    this.addItem(input.value);
                    this.onchange(this.list);
                    input.value = '';
                }
            }, undefined, 'Add this item to the checklist!');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'New item...');
        input.setAttribute('title', 'Type in a new item here.');
        this.addHeaders([input, addBtn.element()]);
    }
    /**
     * Add an item to this checklist.
     * @param {string} item The item to add to this checklist
     */
    addItem(item) {
        const deleteBtn = new JBtn('\u2713', () => {
            this.table.removeChild(row);
            this.list.splice(this.list.indexOf(item), 1);
            this.onchange(this.list);
        }, undefined, 'Check off this item from the checklist.'),
            row = this.addRow([item, deleteBtn.element()], 'td');
        this.list.push(item);
    }
}
