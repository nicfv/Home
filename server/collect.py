import requests
import json
import time
from server.setup import ABS_FILE_CONFIG, ABS_FILE_LOCAL, ABS_FILE_NATIONAL, ABS_FILE_WEATHER, ABS_FILE_CUSTOM

WEATHER_API = ''
NEWS_API = ''
CITY = ''
COUNTRY = ''
ADDR = ''
CUSTOM = {}


def readConfig():
    global WEATHER_API, NEWS_API, CITY, COUNTRY, ADDR, CUSTOM
    with open(ABS_FILE_CONFIG, 'r') as f:
        config = json.load(f)

    WEATHER_API = config.get('api').get('weather')
    NEWS_API = config.get('api').get('news')

    CITY = config.get('address').get('city')
    STATE = config.get('address').get('state')
    COUNTRY = config.get('address').get('country')

    ADDR = ','.join(filter(lambda x: x != None, [CITY, STATE, COUNTRY]))

    CUSTOM = config.get('custom')


def extract(obj: dict, path: str):
    extracted = obj
    parts = path.split('.')
    for part in parts:
        if part.isnumeric():
            extracted = extracted[int(part)]
        else:
            extracted = extracted[part]
    return extracted


def getLocalNews():
    r = requests.get('https://newsapi.org/v2/everything?q=' +
                     CITY + '&sortBy=publishedAt&language=en&apiKey=' + NEWS_API)
    with open(ABS_FILE_LOCAL, 'w') as f:
        f.write(r.text)


def getNationalNews():
    r = requests.get('https://newsapi.org/v2/top-headlines?country=' +
                     COUNTRY + '&apiKey=' + NEWS_API)
    with open(ABS_FILE_NATIONAL, 'w') as f:
        f.write(r.text)


def getWeather():
    r = requests.get('http://api.openweathermap.org/geo/1.0/direct?q=' +
                     ADDR + '&limit=0&appid=' + WEATHER_API)
    geo = json.loads(r.text)
    lat = geo[0]['lat']
    lon = geo[0]['lon']
    r = requests.get('https://api.openweathermap.org/data/2.5/weather?lat=' +
                     str(lat) + '&lon=' + str(lon) + '&appid=' + WEATHER_API)
    with open(ABS_FILE_WEATHER, 'w') as f:
        f.write(r.text)


def getCustom(tick: int, dry: bool):
    with open(ABS_FILE_CUSTOM) as f:
        CUST_DATA = json.load(f)
    for req in CUSTOM:
        if (tick % req['interval']) == 0:
            log('Getting custom data from ' + req['source'] + '...')
            if dry:
                return
            sourceId = hash(req['source']) # TODO: for some reason, sometimes creates duplicate keys
            CUST_DATA[sourceId] = []
            data = json.loads(requests.get(req['source']).text)
            for field in req['fields']:
                CUST_DATA[sourceId].append(
                    {'label': field['label'], 'value': extract(data, field['value'])})
    with open(ABS_FILE_CUSTOM, 'w') as f:
        json.dump(CUST_DATA, f)


def clearCustom():
    with open(ABS_FILE_CUSTOM, 'w') as f:
        f.write('{ }')


def log(message: str):
    print('[' + time.strftime('%T') + '] ' + message)


def routine(tick: int = 0, dry: bool = False):
    if (tick % 5) == 0:
        log('Getting weather data...')
        if not dry:
            getWeather()
    if (tick % 60) == 0:
        log('Getting news...')
        if not dry:
            getLocalNews()
            getNationalNews()
    if tick == 0:
        clearCustom()
    getCustom(tick, dry)
    time.sleep(60)
    routine((tick+1) % 60, dry)
