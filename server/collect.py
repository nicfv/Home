import requests
import json
import time
from server.setup import ABS_FILE_CONFIG, ABS_FILE_LOCAL, ABS_FILE_NATIONAL, ABS_FILE_WEATHER, ABS_FILE_AIRPOLL, ABS_FILE_CUSTOM

WEATHER_API = ''
NEWS_API = ''
MAPS_API = ''
COORDS = {}
CUSTOM = {}

CITY = ''
COUNTRY = ''


def readConfig():
    global WEATHER_API, NEWS_API, MAPS_API, COORDS, CUSTOM
    with open(ABS_FILE_CONFIG, 'r') as f:
        config = json.load(f)

    WEATHER_API = config['api']['weather']
    NEWS_API = config['api']['news']
    MAPS_API = config['api']['maps']

    COORDS = config['coordinates']
    CUSTOM = config['custom'] or CUSTOM


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
    r = requests.get('https://newsapi.org/v2/everything?q=' +
                     CITY + '&sortBy=publishedAt&language=en&apiKey=' + NEWS_API)
    with open(ABS_FILE_LOCAL, 'w') as f:
        f.write(r.text)
    r = requests.get('https://newsapi.org/v2/top-headlines?country=' +
                     COUNTRY + '&apiKey=' + NEWS_API)
    with open(ABS_FILE_NATIONAL, 'w') as f:
        f.write(r.text)


def getWeather():
    global CITY, COUNTRY
    r = requests.get('https://api.openweathermap.org/data/2.5/weather?lat=' + str(
        COORDS['home']['lat']) + '&lon=' + str(COORDS['home']['lon']) + '&appid=' + WEATHER_API)
    weather = json.loads(r.text)
    CITY = weather['name']
    COUNTRY = weather['sys']['country']
    with open(ABS_FILE_WEATHER, 'w') as f:
        f.write(r.text)
    r = requests.get('http://api.openweathermap.org/data/2.5/air_pollution?lat=' + str(
        COORDS['home']['lat']) + '&lon=' + str(COORDS['home']['lon']) + '&appid=' + WEATHER_API)
    with open(ABS_FILE_AIRPOLL, 'w') as f:
        f.write(r.text)


def getCustom(tick: int, dry: bool):
    if tick == 0:
        CUST_DATA = {}
    else:
        with open(ABS_FILE_CUSTOM) as f:
            CUST_DATA = json.load(f)
    for req in CUSTOM:
        if (tick % req['interval']) == 0:
            log('Getting custom data from ' + req['name'] + '...')
            if dry:
                return
            sourceId = req['name']
            CUST_DATA[sourceId] = []
            data = json.loads(requests.get(req['source']).text)
            for field in req['fields']:
                CUST_DATA[sourceId] += [{'label': field['label'],
                                         'type': field['type'], 'value': extract(data, field['value'])}]
    with open(ABS_FILE_CUSTOM, 'w') as f:
        json.dump(CUST_DATA, f)


def log(message: str):
    print('[' + time.strftime('%T') + '] ' + message)


def routine(dry: bool = False, tick: int = 0):
    if (tick % 5) == 0:
        log('Getting weather data...')
        if not dry:
            getWeather()
    if (tick % 60) == 0:
        log('Getting news...')
        if not dry:
            getNews()
    getCustom(tick, dry)
    time.sleep(60)
    routine(dry, (tick+1) % 60)
