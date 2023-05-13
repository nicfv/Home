/**
 * Creates fully customizable flexible documents using flexboxes.
 */
export class FlexDoc {
    /**
     * @private A unique ID number for use in leaf nodes.
     */
    static leaf_id = 0;
    /**
     * @private A unique ID number for use in branch nodes.
     */
    static branch_id = 0;
    /**
     * @private @readonly The ID prefix for leaf nodes.
     */
    static LEAF_PREFIX = 'leaf_';
    /**
     * @private @readonly The ID prefix for branch nodes.
     */
    static BRANCH_PREFIX = 'branch_';
    /**
     * @private @readonly The element attribute name where unique IDs are set.
     */
    static ATTRIBUTE_NAME = 'fd';
    /**
     * Create a new `FlexDoc` within the parent element.
     * 
     * The `data` parameter is an array of numbers or sub-arrays which contains the structure for this `FlexDoc`. Arrays represent "branches" meaning a row or column of elements. Numbers represent "leafs" where the value of the number is the relative size of that element. A leaf of size 50 is half that of size 100. A leaf of size 0 means a fixed element sized to fit its contents. Branches are size 100.
     * ```js
     * //                        (row)  (col)  (row)
     * // Branch IDs (branch_N):   0      1      2
     * //                          v      v      v
     *                      data = [ 100, [ 200, [ 100, 0 ] ], 50 ]
     * //                            ^      ^      ^    ^      ^
     * // Leaf IDs (leaf_N):         0      1      2    3      4
     * //                         (100%w)(200%h)(100%w)(fixed)(50%w)
     * ```
     * 
     * Branch nodes and leaf nodes are identified by their unique IDs created by the corresponding prefix + a zero-indexed integer. The IDs are assigned to a unique attribute defined in this class.
     * ```html
     * <div fd="leaf_0"> <!-- The first leaf node -->
     * <div fd="branch_0"> <!-- The first branch node -->
     * ```
     * @param {HTMLElement} parent The parent element to contain this `FlexDoc`
     * @param {boolean} rowMajor Determine whether the outer element contains a row or column
     * @param {number[]} data An array of relative sizes for child elements (normalized to 100%)
     */
    static build(parent, rowMajor, data) {
        if (parent instanceof HTMLElement) {
            if (typeof data === 'number') {
                const el = document.createElement('div');
                el.setAttribute(this.ATTRIBUTE_NAME, this.LEAF_PREFIX + this.leaf_id++);
                if (rowMajor) {
                    el.style.width = '100%';
                    el.style.height = data === 0 ? 'max-content' : data + '%';
                } else {
                    el.style.width = data === 0 ? 'max-content' : data + '%';
                    el.style.height = '100%';
                }
                parent.appendChild(el);
            } else if (Array.isArray(data)) {
                const el = document.createElement('div');
                el.setAttribute(this.ATTRIBUTE_NAME, this.BRANCH_PREFIX + this.branch_id++);
                el.style.display = 'flex';
                el.style.flexDirection = rowMajor ? 'row' : 'column';
                el.style.width = '100%';
                el.style.height = '100%';
                parent.appendChild(el);
                for (let d of data) {
                    this.build(el, !rowMajor, d);
                }
            } else {
                throw new Error('Incorrect type found in ' + d);
            }
        }
    }
    /**
     * Return the branch element, if one exists with this ID.
     * @param {number} id The unique ID number of this branch
     * @returns The branch element, if one exists, or null
     */
    static getBranch(id) {
        return document.querySelector('[' + this.ATTRIBUTE_NAME + '=' + this.BRANCH_PREFIX + id + ']');
    }
    /**
     * Return the leaf element, if one exists with this ID.
     * @param {number} id The unique ID number of this leaf
     * @returns The leaf element, if one exists, or null
     */
    static getLeaf(id) {
        return document.querySelector('[' + this.ATTRIBUTE_NAME + '=' + this.LEAF_PREFIX + id + ']');
    }
}
