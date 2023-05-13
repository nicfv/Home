import { FlexDoc } from './FlexDoc.js';
import { REST } from './Rest.js';
import { JTable } from './JTable.js';
import { JTime } from './JTime.js';
import { JMath } from './JMath.js';
import { JBtn } from './JBtn.js';
import { UnitSwitcher } from './UnitSwitcher.js';
import { FloorPlan } from './FloorPlan.js';
import { Checklist } from './Checklist.js';
import { JPath } from './JPath.js';

window.onload = () => {
    let currentFloor = 0;
    FlexDoc.build(document.body, true, [[0, 0, 0, 100], [[75, 25], [50, 50]]]);
    FlexDoc.getBranch(1).style.width = 'max-content';
    FlexDoc.getBranch(3).style.height = '65%';
    FlexDoc.getBranch(4).style.height = 'calc(35% - 0.5em)';
    REST.get('config.json', config => {
        document.title = config['address']['street'];
        const root = document.querySelector(':root');
        // Set color preference
        const pref = config['preferences']?.['color'];
        if (typeof pref === 'string') {
            root.style.setProperty('--red', +('0x' + pref.substring(1, 3)));
            root.style.setProperty('--green', +('0x' + pref.substring(3, 5)));
            root.style.setProperty('--blue', +('0x' + pref.substring(5, 7)));
        }
        // Add floor plan controls
        let showFloor = () => { };
        const numFloors = config['layout']['floors'].length,
            btnContainer = document.createElement('div'),
            down = new JBtn('<', () => { showFloor(-1); }, btnContainer, 'Go down one floor.'),
            up = new JBtn('>', () => { showFloor(1); }, btnContainer, 'Go up one floor.'),
            floorName = document.createElement('span');
        btnContainer.setAttribute('class', 'floorPlanControls');
        btnContainer.appendChild(floorName);
        FlexDoc.getLeaf(4).style.position = 'relative';
        FlexDoc.getLeaf(4).appendChild(btnContainer);
        // Generate floor plan
        const FP = new FloorPlan(FlexDoc.getLeaf(4));
        REST.get('data/room.json', roomData => {
            showFloor = delta => {
                currentFloor += delta;
                (currentFloor > 0) ? down.enable() : down.disable();
                (currentFloor < numFloors - 1) ? up.enable() : up.disable();
                floorName.textContent = config['layout']['floors'][currentFloor]['name'];
                FP.clear();
                showRoom(FlexDoc.getLeaf(5));
                for (let room of config['layout']['floors'][currentFloor]['rooms']) {
                    FP.addRoom(room['data'], () => showRoom(FlexDoc.getLeaf(5), room['name'], roomData));
                }
            };
            showFloor(0);
        });
        showCustom(FlexDoc.getLeaf(3), config['custom']);
    });
    REST.get('api/news-local.json', news => generateNewspaper(FlexDoc.getLeaf(6), 'Local News', news));
    REST.get('api/news-national.json', news => generateNewspaper(FlexDoc.getLeaf(7), 'National News', news));
    REST.get('api/weather.json', weather => {
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
    parent.style.overflow = 'auto';
    let close = () => { };
    const X = new JBtn('x', () => { close() }, parent, 'Close the current article.'),
        NP = new JTable(parent),
        ART = new JTable(parent),
        header = document.createElement('div');
    header.textContent = name;
    NP.addHeaders([header]);
    header.parentElement.setAttribute('colspan', '2');
    ART.hide();
    X.hide();
    close = () => {
        NP.show();
        ART.hide();
        X.hide();
    }
    /**
     * Display an article in the parent element
     * @param {object} article The article object to display
     */
    function showArticle(article) {
        NP.hide();
        X.show();
        ART.show();
        ART.clear();
        ART.addData([article['title']]);
        if (article['urlToImage']) {
            const img = document.createElement('img');
            img.src = article['urlToImage'];
            ART.addData([img]);
        }
        ART.addData([article['author'] ?? 'No Author']);
        ART.addData([article['publishedAt']]);
        ART.addData([article['description']]);
        const external = document.createElement('a');
        external.textContent = article['source']['name'];
        external.setAttribute('title', 'Visit the article (links to external website.)');
        external.setAttribute('target', '_blank');
        external.setAttribute('href', article['url']);
        ART.addData([external]);
    }
    for (let article of news['articles']) {
        const internal = document.createElement('a'),
            external = document.createElement('a');
        internal.textContent = article['title'];
        external.textContent = article['source']['name'];
        internal.setAttribute('title', 'View a short summary of this article.');
        external.setAttribute('title', 'Visit the article (links to external website.)');
        external.setAttribute('target', '_blank');
        external.setAttribute('href', article['url']);
        internal.addEventListener('click', () => showArticle(article));
        NP.addData([internal, external]);
    }
}

/**
 * Show room details in the parent element.
 * @param {HTMLElement} parent The containing element.
 * @param {string} name The name of the room from the configuration file. If left blank, will show a default message.
 * @param {object} data The data object from the data JSON file.
 */
function showRoom(parent, name, data) {
    parent.style.overflow = 'auto';
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    if (name) {
        const CL = new Checklist(parent, list => {
            data[name] = list
            REST.post('data/room.json', data, console.log);
        }, name);
        // No list has been created yet for this room
        if (!Array.isArray(data[name])) {
            data[name] = [];
        }
        // Add any pre-existing items from this room
        for (let item of data[name]) {
            CL.addItem(item);
        }
    } else {
        parent.textContent = 'Click on a room in the floor plan to view details!';
    }
}

/**
 * Show the custom panel.
 * @param {HTMLElement} parent The parent element to append the custom panel onto
 * @param {object} customData The custom data from the configuration JSON file
 */
function showCustom(parent, customData) {
    parent.style.overflow = 'auto';
    const JT = new JTable(parent),
        header = document.createElement('div');
    JT.addHeaders([header]);
    header.textContent = 'Custom';
    header.parentElement.setAttribute('colspan', '2');
    if (Array.isArray(customData)) {
        for (let datasource of customData) {
            REST.get(datasource['source'], data => {
                for (let field of datasource['fields']) {
                    JT.addData([field['label'], '' + JPath.get(field['value'], data)]);
                }
            });
        }
    } else {
        JT.addData(['No custom datasources found.']);
    }
}