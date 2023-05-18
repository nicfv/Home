export class UnitSwitcher {
    /**
     * @private @type {HTMLElement} The containing element of this `UnitSwitcher`
     */
    el;
    /**
     * @private @type {boolean} Determines if the initial units are displayed.
     */
    initialSystem;
    /**
     * Create a new `UnitSwitcher`
     * @param {number} valueDefault The value or quantity of `unitsDefault`
     * @param {number} valueOther The value or quantity of `unitsOther`
     * @param {string} unitsDefault String representation of the initial unit system
     * @param {string} unitsOther String representation of the secondary unit system
     */
    constructor(valueDefault, valueOther, unitsDefault, unitsOther) {
        const valSpan = document.createElement('span'),
            unitSpan = document.createElement('span');
        this.el = document.createElement('div');
        this.el.setAttribute('usw', 'container');
        valSpan.setAttribute('usw', 'value');
        unitSpan.setAttribute('usw', 'units');
        this.el.appendChild(valSpan);
        this.el.appendChild(unitSpan);
        this.initialSystem = false;
        const refresh = () => {
            this.initialSystem = !this.initialSystem;
            if (this.initialSystem) {
                valSpan.textContent = valueDefault.toLocaleString();
                unitSpan.textContent = unitsDefault;
            } else {
                valSpan.textContent = valueOther.toLocaleString();
                unitSpan.textContent = unitsOther;
            }
        };
        refresh();
        this.el.addEventListener('click', refresh);
        this.el.setAttribute('title', 'Click here to switch unit system.');
    }
    /**
     * Simulate a click on this element.
     */
    click() {
        this.el.click();
    }
    /**
     * Return the containing element of this `UnitSwitcher`
     * @returns The containing HTML element
     */
    getElement() {
        return this.el;
    }
}
