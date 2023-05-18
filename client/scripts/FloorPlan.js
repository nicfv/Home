export class FloorPlan {
    /**
     * @private @readonly Namespace
     */
    NS = 'http://www.w3.org/2000/svg';
    /**
     * @private @readonly The parent element
     */
    svg = document.createElementNS(this.NS, 'svg');
    /**
     * @private The minimum X-position
     */
    minX = 0;
    /**
     * @private The maximum X-position
     */
    maxX = 0;
    /**
     * @private The minimum Y-position
     */
    minY = 0;
    /**
     * @private The maximum Y-position
     */
    maxY = 0;
    /**
     * Initialize a new floor plan.
     * @param {HTMLElement} parent The parent element to append this floor plan onto
     */
    constructor(parent) {
        this.setViewBox();
        parent.appendChild(this.svg);
    }
    /**
     * @private Set the viewbox of the SVG based on the floor size.
     */
    setViewBox() {
        this.svg.setAttribute('viewBox', this.minX + ' ' + this.minY + ' ' + (this.maxX - this.minX) + ' ' + (this.maxY - this.minY));
    }
    /**
     * Add a room to this floor plan.
     * @param {{x:number,y:number}[]} roomData X,Y data of room corners, in order
     * @param {() => any} onclick Callback function when this room is clicked on
     */
    addRoom(roomData, onclick) {
        // Recalculate min and max values
        this.minX = Math.min(this.minX, ...roomData.map(xy => xy.x));
        this.minY = Math.min(this.minY, ...roomData.map(xy => xy.y));
        this.maxX = Math.max(this.maxX, ...roomData.map(xy => xy.x));
        this.maxY = Math.max(this.maxY, ...roomData.map(xy => xy.y));
        this.setViewBox();
        const room = document.createElementNS(this.NS, 'path');
        room.setAttribute('d', 'M ' + roomData.map(xy => xy.x + ',' + xy.y).join(' ') + ' z');
        room.setAttribute('vector-effect', 'non-scaling-stroke');
        room.addEventListener('click', onclick);
        this.svg.appendChild(room);
    }
    /**
     * Remove all rooms from the current floor plan.
     */
    clear() {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
    }
}
