export class JPath {
    /**
     * Extract some data from an object using a pseudo JSON path.
     * @param {string} path The pseudo-JSONPath
     * @param {object} obj The object to extract
     * @returns The extracted data from the object
     */
    static get(path, obj) {
        const parts = path.split('.');
        let extracted = obj;
        for (let part of parts) {
            if (typeof extracted !== 'object') {
                throw new Error('Could not resolve path: ' + path + ' in object: ' + JSON.stringify(obj));
            }
            extracted = extracted[part];
        }
        return extracted
    }
}
