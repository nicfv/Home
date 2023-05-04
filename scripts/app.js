
class REST {
    static get(url = '', callback = (response = {}) => { }) {
        fetch(url).then(response => response.json()).then(jsonData => callback(jsonData));
    }

    static post(url = '', payload = {}, callback = (response = {}) => { }) {
        fetch(url, {
            'method': 'POST',
            'body': JSON.stringify(payload)
        }).then(response => response.json())
            .then(jsonData => callback(jsonData));
    }
}

class JMath {
    static KtoC(K = 0) {
        return K - 273.15;
    }

    static KtoF(K = 0) {
        return 1.8 * this.KtoC(K) + 32;
    }

    static clamp(n = 0, min = 0, max = 0) {
        if (n < min) {
            return min;
        }
        if (n > max) {
            return max;
        }
        return n;
    }
}

window.onload = () => {
    REST.get('collected/news-global.json', news => {
        console.log(news);
    });
    REST.get('collected/news-local.json', news => {
        console.log(news);
    });
    REST.get('collected/weather.json', weather => {
        const a_coords = document.getElementById('coords'),
            weather_status = document.getElementById('weather_status'),
            visibility = document.getElementById('visibility'),
            cloud_coverage = document.getElementById('cloud_coverage'),
            time_zone = document.getElementById('time_zone'),
            coords = weather['coord']['lat'] + ',' + weather['coord']['lon'];
        a_coords.setAttribute('href', 'https://www.google.com/maps/@' + coords + ',14z');
        a_coords.textContent = '(' + coords + ')';
        weather_status.textContent = weather['weather'][0]['main'] + ' (' + weather['weather'][0]['description'] + ')';
        visibility.textContent = +weather['visibility'] / 1000 + 'km';
        cloud_coverage.textContent = weather['clouds']['all'] + '%';
        time_zone.textContent = +weather['timezone'] / 60 / 60 + 'h';
    })
};
