export class REST {
    /**
     * @private @type {string} The authentication password for POST requests.
     */
    static password;
    /**
     * Execute an HTTP GET request on the specified URL.
     * @param {string} url The requested location
     * @param {(json) => any} callback The callback function upon successful execution
     */
    static get(url, callback) {
        fetch(url).then(response => response.json()).then(jsonData => callback(jsonData));
    }

    /**
     * Execute an HTTP POST request on the specified URL.
     * @param {string} url The requested location
     * @param {object} payload The data in the request body
     * @param {(json) => any} callback The callback function upon successful execution
     */
    static post(url, payload, callback) {
        fetch(url, {
            'method': 'POST',
            'body': JSON.stringify(payload),
            'headers': [['password', this.password = this.password ?? prompt('Please enter the server password.')]]
        }).then(response => response.json())
            .then(jsonData => callback(jsonData));
    }
}
