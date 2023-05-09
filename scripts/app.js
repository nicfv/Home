import { FlexDoc } from './FlexDoc.js';
import { REST } from './Rest.js';
import { JTable } from './JTable.js';
import { JTime } from './JTime.js';
import { JMath } from './JMath.js';
import { UnitSwitcher } from './UnitSwitcher.js';

window.onload = () => {
    FlexDoc.build(document.body, true, [[0, 0, 0, 50, 50], [[75, 25], [50, 50]]]);
    FlexDoc.getBranch(1).style.width = 'max-content';
    REST.get('config.json', config => {
        console.log(config);
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
            // Create unit switchers
            const visibility = new UnitSwitcher(weather['visibility'] / 1000, JMath.mtomi(weather['visibility']), 'km', 'mi'),
                wind = new UnitSwitcher(weather['wind']['speed'], JMath.mpstoMPH(weather['wind']['speed']), 'm/s', 'MPH'),
                temp = new UnitSwitcher(JMath.KtoC(weather['main']['temp']), JMath.KtoF(weather['main']['temp']), '\u00B0C', '\u00B0F'),
                temp_hum = new UnitSwitcher(JMath.KtoC(weather['main']['feels_like']), JMath.KtoF(weather['main']['feels_like']), '\u00B0C', '\u00B0F'),
                temp_min = new UnitSwitcher(JMath.KtoC(weather['main']['temp_min']), JMath.KtoF(weather['main']['temp_min']), '\u00B0C', '\u00B0F'),
                temp_max = new UnitSwitcher(JMath.KtoC(weather['main']['temp_max']), JMath.KtoF(weather['main']['temp_max']), '\u00B0C', '\u00B0F'),
                press = new UnitSwitcher(weather['main']['pressure'] / 10, JMath.hPatoATM(weather['main']['pressure']), 'kPa', 'atm');
            wind.getElement().append(' (' + weather['wind']['deg'] + '\u00B0)');
            // Create JTables
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
                ['Visibility', visibility.getElement()],
                ['Clouds', weather['clouds']['all'] + '%'],
                ['Wind', wind.getElement()],
            ], false);
            JTable.build(FlexDoc.getLeaf(2), [
                ['Temperature', temp.getElement()],
                ['Feels Like', temp_hum.getElement()],
                ['Temp. Min', temp_min.getElement()],
                ['Temp. Max', temp_max.getElement()],
                ['Humidity', weather['main']['humidity'] + '%'],
                ['Pressure', press.getElement()],
            ], false);
            setInterval(() => clock.textContent = new Date().toLocaleString(), 1000);
            clock.parentElement.setAttribute('colspan', '2');
        });
    });
};
