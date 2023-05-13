import requests
import json
import time
from server.setup import ABS_FILE_CONFIG, ABS_FILE_LOCAL, ABS_FILE_NATIONAL, ABS_FILE_WEATHER

WEATHER_API = ''
NEWS_API = ''
CITY = ''
COUNTRY = ''
ADDR = ''


def readConfig():
    global WEATHER_API, NEWS_API, CITY, COUNTRY, ADDR
    with open(ABS_FILE_CONFIG, 'r') as f:
        config = json.load(f)

    WEATHER_API = config.get('api').get('weather')
    NEWS_API = config.get('api').get('news')

    CITY = config.get('address').get('city')
    STATE = config.get('address').get('state')
    COUNTRY = config.get('address').get('country')

    ADDR = ','.join(filter(lambda x: x != None, [CITY, STATE, COUNTRY]))


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
    time.sleep(60)
    routine((tick+1) % 60, dry)
