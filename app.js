
class REST {
    static get(url = '', callback = (response = {}) => { }) {
        fetch(url).then(response => response.json()).then(jsonData => callback(jsonData));
    }

    static post(url = '', payload = {}, callback = (response = {}) => { }) {
        fetch(url, {
            'method': 'POST',
            'headers': [
                ['Content-type', 'application/json'],
            ],
            'body': payload
        }).then(response => response.json())
            .then(jsonData => callback(jsonData));
    }
}

window.onload = () => {
    REST.get('config.json', config => {
        const WEATHER_API = config['api']['openweathermap'],
            ADDR = [config['address']['city'], config['address']['state'], config['address']['country']].filter(x => x !== undefined).join(','),
            STREET_ADDR = config['address']['street'];
        document.title = STREET_ADDR;
        document.getElementById('title').textContent = STREET_ADDR;
    });
};
