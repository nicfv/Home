import { FlexDoc } from './FlexDoc.js';
import { REST } from './Rest.js';
import { JTable } from './JTable.js';
import { JTime } from './JTime.js';
import { JMath } from './JMath.js';
import { UnitSwitcher } from './UnitSwitcher.js';

window.onload = () => {
    FlexDoc.build(document.body, true, [[0, 0, 0, 50, 50], [[75, 25], [50, 50]]]);
    FlexDoc.getBranch(1).style.width = 'max-content';
    FlexDoc.getBranch(4).style.height = '35%';
    REST.get('config.json', config => {
        const root = document.querySelector(':root');
        // Set color preference
        const pref = config['preferences']?.['color'];
        if (typeof pref === 'string') {
            console.log(pref);
            root.style.setProperty('--red', +('0x' + pref.substring(1, 3)));
            root.style.setProperty('--green', +('0x' + pref.substring(3, 5)));
            root.style.setProperty('--blue', +('0x' + pref.substring(5, 7)));
        }
    });
    REST.get('collected/news-local.json', news => {
        generateNewspaper(FlexDoc.getLeaf(7), 'Local News', news);
        FlexDoc.getLeaf(7).style.overflow = 'auto';
    });
    REST.get('collected/news-national.json', news => {
        generateNewspaper(FlexDoc.getLeaf(8), 'National News', news);
        FlexDoc.getLeaf(8).style.overflow = 'auto';
    });
    REST.get('collected/weather.json', weather => {
        const dt_date = document.createElement('div'),
            dt_clock = document.createElement('div'),
            coords = weather['coord']['lat'] + ',' + weather['coord']['lon'],
            mapLink = document.createElement('a');
        mapLink.textContent = '(' + coords + ')';
        mapLink.setAttribute('title', 'View this location on Google Maps.');
        mapLink.setAttribute('href', 'https://www.google.com/maps/@' + coords + ',14z');
        mapLink.setAttribute('target', '_blank');
        dt_date.setAttribute('title', 'Current date');
        dt_clock.setAttribute('title', 'Current time');
        // Create unit switchers
        const visibility = new UnitSwitcher(weather['visibility'] / 1000, JMath.mtomi(weather['visibility']), 'km', 'mi'),
            clouds = new UnitSwitcher(weather['clouds']['all'], weather['clouds']['all'] / 100, '%', '1.0'),
            wind = new UnitSwitcher(weather['wind']['speed'], JMath.mpstoMPH(weather['wind']['speed']), 'm/s', 'MPH'),
            temp = new UnitSwitcher(JMath.KtoC(weather['main']['temp']), JMath.KtoF(weather['main']['temp']), '\u00B0C', '\u00B0F'),
            temp_hum = new UnitSwitcher(JMath.KtoC(weather['main']['feels_like']), JMath.KtoF(weather['main']['feels_like']), '\u00B0C', '\u00B0F'),
            temp_min = new UnitSwitcher(JMath.KtoC(weather['main']['temp_min']), JMath.KtoF(weather['main']['temp_min']), '\u00B0C', '\u00B0F'),
            temp_max = new UnitSwitcher(JMath.KtoC(weather['main']['temp_max']), JMath.KtoF(weather['main']['temp_max']), '\u00B0C', '\u00B0F'),
            humidity = new UnitSwitcher(weather['main']['humidity'], weather['main']['humidity'] / 100, '%', '1.0'),
            press = new UnitSwitcher(weather['main']['pressure'] / 10, JMath.hPatoATM(weather['main']['pressure']), 'kPa', 'atm');
        wind.getElement().append(' (' + weather['wind']['deg'] + '\u00B0)');
        // Create JTables
        JTable.build(FlexDoc.getLeaf(0), [
            [dt_date, dt_clock],
            ['Coordinates', mapLink],
            ['Time Zone', 'GMT' + (weather['timezone'] < 0 ? '-' : '+') + JTime.format(weather['timezone'])],
            ['Sunrise', new Date(weather['sys']['sunrise'] * 1000).toLocaleTimeString()],
            ['Sunset', new Date(weather['sys']['sunset'] * 1000).toLocaleTimeString()],
            ['Day Length', JTime.format(weather['sys']['sunset'] - weather['sys']['sunrise'])],
        ], false);
        JTable.build(FlexDoc.getLeaf(1), [
            ['Status', weather['weather'][0]['main'] + ' (' + weather['weather'][0]['description'] + ')'],
            ['Visibility', visibility.getElement()],
            ['Clouds', clouds.getElement()],
            ['Wind', wind.getElement()],
        ], false);
        JTable.build(FlexDoc.getLeaf(2), [
            ['Temperature', temp.getElement()],
            ['Feels Like', temp_hum.getElement()],
            ['Temp. Min', temp_min.getElement()],
            ['Temp. Max', temp_max.getElement()],
            ['Humidity', humidity.getElement()],
            ['Pressure', press.getElement()],
        ], false);
        setInterval(() => {
            const now = new Date();
            dt_date.textContent = now.toLocaleDateString();
            dt_clock.textContent = now.toLocaleTimeString();
        }, 1000);
    });
};

/**
 * Generate a digital newspaper.
 * @param {HTMLElement} parent The parent element
 * @param {string} name The name of the newspaper
 * @param {any} news The array of news articles
 */
function generateNewspaper(parent, name, news) {
    const NP = new JTable(parent),
        header = document.createElement('div');
    header.textContent = name;
    NP.addHeaders([header]);
    for (let article of news['articles']) {
        const internal = document.createElement('a'),
            external = document.createElement('a');
        internal.textContent = article['title'];
        external.textContent = article['source']['name'];
        internal.setAttribute('title', 'View a short summary of this article.');
        external.setAttribute('title', 'Visit the article (links to external website.)');
        external.setAttribute('target', '_blank');
        external.setAttribute('href', article['url']);
        NP.addData([internal, external]);
    }
    header.parentElement.setAttribute('colspan', '2');
}