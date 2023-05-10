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
     * @param {string} tooltip Optional. If set, renders a tooltip containing this string.
     */
    constructor(text, onclick, parent, tooltip = '') {
        this.el.textContent = text;
        this.el.addEventListener('click', onclick);
        tooltip && this.el.setAttribute('title', tooltip);
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
    /**
     * Disable this button.
     */
    disable() {
        this.el.disabled = true;
    }
    /**
     * Enable this button.
     */
    enable() {
        this.el.disabled = false;
    }
}
