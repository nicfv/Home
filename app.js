

class REST {
    static get(url = '', callback = (response = {}) => { }) {
        fetch(url, {
            'method': 'GET'
        }).then(response => response.json())
            .then(jsonData => callback(jsonData));
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
            ADDR = [config['address']['city'], config['address']['state'], config['address']['country']].filter(x => x !== undefined).join(',');
        console.log(WEATHER_API);
        REST.get('http://api.openweathermap.org/geo/1.0/direct?q=' + ADDR + '&limit=0&appid=' + WEATHER_API, geo => {
            const LAT = geo[0]['lat'], LON = geo[0]['lon'];
            REST.get('https://api.openweathermap.org/data/2.5/weather?lat=' + LAT + '&lon=' + LON + '&appid=' + WEATHER_API, weather => {
                console.log(weather);
            });
        });
    });
};
