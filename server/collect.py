import requests
import json
import time
from server.setup import ABS_FILE_CONFIG, ABS_FILE_LOCAL, ABS_FILE_NATIONAL, ABS_FILE_WEATHER, ABS_FILE_AIRPOLL, ABS_FILE_TRAFFIC, ABS_FILE_CUSTOM

WEATHER_API = ''
NEWS_API = ''
MAPS_API = ''
COORDS = {}
CUSTOM = {}

CATEGORY = 'business'
COUNTRY = ''


def readConfig():
    global WEATHER_API, NEWS_API, MAPS_API, COORDS, CATEGORY, CUSTOM
    with open(ABS_FILE_CONFIG, 'r') as f:
        config = json.load(f)

    WEATHER_API = config['api']['weather']
    NEWS_API = config['api']['news']
    MAPS_API = config['api']['maps']

    COORDS = config['coordinates']
    CUSTOM = config['custom'] or CUSTOM
    if config['preferences']:
        CATEGORY = config['preferences']['newsCategory'] or CATEGORY


def extract(obj: dict, path: str):
    extracted = obj
    parts = path.split('.')
    for part in parts:
        if part.isnumeric():
            extracted = extracted[int(part)]
        else:
            extracted = extracted[part]
    return extracted


def getNews():
    r = requests.get('https://newsdata.io/api/1/news?country=' + COUNTRY +
                     '&category=' + CATEGORY + '&language=en&apiKey=' + NEWS_API)
    with open(ABS_FILE_LOCAL, 'w') as f:
        f.write(r.text)
    r = requests.get('https://newsdata.io/api/1/news?country=' +
                     COUNTRY + '&language=en&apiKey=' + NEWS_API)
    with open(ABS_FILE_NATIONAL, 'w') as f:
        f.write(r.text)


def getWeather():
    global COUNTRY
    r = requests.get('https://api.openweathermap.org/data/2.5/weather?lat=' + str(
        COORDS['home']['lat']) + '&lon=' + str(COORDS['home']['lon']) + '&appid=' + WEATHER_API)
    weather = json.loads(r.text)
    COUNTRY = weather['sys']['country']
    with open(ABS_FILE_WEATHER, 'w') as f:
        f.write(r.text)
    r = requests.get('http://api.openweathermap.org/data/2.5/air_pollution?lat=' + str(
        COORDS['home']['lat']) + '&lon=' + str(COORDS['home']['lon']) + '&appid=' + WEATHER_API)
    with open(ABS_FILE_AIRPOLL, 'w') as f:
        f.write(r.text)


def getTraffic():
    r = requests.get('https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + str(
        COORDS['home']['lon']) + '%2C' + str(COORDS['home']['lat']) + '%3B' + str(COORDS['work']['lon']) + '%2C' + str(COORDS['work']['lat']) + '%3B' + str(COORDS['home']['lon']) + '%2C' + str(COORDS['home']['lat']) + '?geometries=geojson&overview=false&steps=false&access_token=' + MAPS_API)
    with open(ABS_FILE_TRAFFIC, 'w') as f:
        f.write(r.text)


def getCustom(tick: int, dry: bool):
    if tick == 0:
        CUST_DATA = {}
    else:
        with open(ABS_FILE_CUSTOM) as f:
            CUST_DATA = json.load(f)
    for ds in CUSTOM:
        ds_data = dict(CUSTOM[ds])
        if (tick % ds_data['interval']) == 0:
            log('Getting custom data from ' + ds + '...')
            if dry:
                return
            data = json.loads(requests.get(ds_data.pop('source')).text)
            for field in ds_data['fields']:
                ds_data['fields'][field]['value'] = extract(
                    data, ds_data['fields'][field]['value'])
            CUST_DATA[ds] = ds_data
    with open(ABS_FILE_CUSTOM, 'w') as f:
        json.dump(CUST_DATA, f)


def log(message: str):
    print('[' + time.strftime('%T') + '] ' + message)


def routine(dry: bool = False, tick: int = 0):
    if (tick % 5) == 0:
        log('Getting weather data...')
        log('Getting traffic data...')
        if not dry:
            getWeather()
            getTraffic()
    if (tick % 60) == 0:
        log('Getting news...')
        if not dry:
            getNews()
    getCustom(tick, dry)
    time.sleep(60)
    routine(dry, (tick+1) % 60)
