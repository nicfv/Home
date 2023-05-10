export class JBtn {
    /**
     * @private @readonly @type {HTMLButtonElement} The button element
     */
    el = document.createElement('button');
    /**
     * 
     * @param {string} text The text content in the button.
     * @param {() => any} onclick The callback function when this button is clicked.
     * @param {HTMLElement} parent Appends this button onto the parent element.
     * @param {string} className Optional. If set, defines the HTML class name for this element, for CSS styling purposes.
     */
    constructor(text, onclick, parent, className = '') {
        this.el.textContent = text;
        this.el.addEventListener('click', onclick);
        className && this.el.setAttribute('class', className);
        parent.appendChild(this.el);
    }
    /**
     * Hide this button.
     */
    hide() {
        this.el.style.display = 'none';
    }
    /**
     * Unhide this button.
     */
    show() {
        this.el.style.display = 'initial';
    }
}
