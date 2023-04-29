
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
            ADDR = [config['address']['city'], config['address']['state'], config['address']['country']].filter(x => x !== undefined).join(','),
            STREET_ADDR = config['address']['street'];
        document.title = STREET_ADDR;
        document.getElementById('title').textContent = STREET_ADDR;
        // return;
        REST.get('http://api.openweathermap.org/geo/1.0/direct?q=' + ADDR + '&limit=0&appid=' + WEATHER_API, geo => {
            const LAT = geo[0]['lat'], LON = geo[0]['lon'];
            REST.get('https://api.openweathermap.org/data/2.5/weather?lat=' + LAT + '&lon=' + LON + '&appid=' + WEATHER_API, weather => {
                document.getElementById('weather').textContent =
                    LAT + ',' + LON + '\n' +
                    'Weather Status: ' + weather['weather'][0]['main'] + ' (' + weather['weather'][0]['description'] + ')\n' +
                    'Temperature: ' + weather['main']['temp_min'] + ' to ' + weather['main']['temp_max'] + ' (' + weather['main']['temp'] + ' now)\n' +
                    'TODO...';
            });
        });
    });
};
