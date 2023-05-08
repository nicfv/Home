import { FlexDoc } from './FlexDoc.js';
import { REST } from './Rest.js';
import { JTable } from './JTable.js';
import { JTime } from './JTime.js';
import { JMath } from './JMath.js';

window.onload = () => {
    FlexDoc.build(document.body, true, [[0, 0, 0, 0, 50, 50], [[75, 25], [50, 50]]]);
    FlexDoc.getBranch(1).style.width = 'min-content';
    // return;
    REST.get('collected/news-national.json', news => {
        console.log(news);
    });
    REST.get('collected/news-local.json', news => {
        console.log(news);
    });
    REST.get('collected/weather.json', weather => {
        const clock = document.createElement('div'),
            coords = weather['coord']['lat'] + ',' + weather['coord']['lon'],
            mapLink = document.createElement('a');
        mapLink.textContent = '(' + coords + ')';
        mapLink.setAttribute('title', 'View this location on Google Maps.');
        mapLink.setAttribute('href', 'https://www.google.com/maps/@' + coords + ',14z');
        mapLink.setAttribute('target', '_blank');
        // FlexDoc.getLeaf(0).appendChild(clock);
        JTable.build(FlexDoc.getLeaf(0), [
            [clock],
            ['Coordinates', mapLink],
            ['Time Zone', 'GMT' + (weather['timezone'] < 0 ? '-' : '+') + JTime.format(weather['timezone'])],
            ['Sunrise', new Date(weather['sys']['sunrise'] * 1000).toLocaleTimeString()],
            ['Sunset', new Date(weather['sys']['sunset'] * 1000).toLocaleTimeString()],
            ['Day Length', JTime.format(weather['sys']['sunset'] - weather['sys']['sunrise'])],
        ], false);
        JTable.build(FlexDoc.getLeaf(1), [
            ['Status', weather['weather'][0]['main'] + ' (' + weather['weather'][0]['description'] + ')'],
            ['Visibility', weather['visibility'] / 1000 + 'km'],
            ['Clouds', weather['clouds']['all'] + '%'],
        ], false);
        JTable.build(FlexDoc.getLeaf(2), [
            [],
        ], false);
        setInterval(() => clock.textContent = new Date().toLocaleString(), 1000);
        clock.parentElement.setAttribute('colspan', '2');
        // console.log(clock.parentElement);
        // console.log(clock.parentElement.parentElement);
        // clock.parentElement.style.columnSpan = '2';
        // const a_coords = document.getElementById('coords'),
        //     weather_status = document.getElementById('weather_status'),
        //     visibility = document.getElementById('visibility'),
        //     cloud_coverage = document.getElementById('cloud_coverage'),
        //     time_zone = document.getElementById('time_zone'),
        //     coords = weather['coord']['lat'] + ',' + weather['coord']['lon'];
        // a_coords.setAttribute('href', 'https://www.google.com/maps/@' + coords + ',14z');
        // a_coords.textContent = '(' + coords + ')';
        // weather_status.textContent = weather['weather'][0]['main'] + ' (' + weather['weather'][0]['description'] + ')';
        // visibility.textContent = +weather['visibility'] / 1000 + 'km';
        // cloud_coverage.textContent = weather['clouds']['all'] + '%';
        // time_zone.textContent = +weather['timezone'] / 60 / 60 + 'h';
    })
};
