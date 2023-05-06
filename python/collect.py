import requests
import json
import time

TARGET_DIR = 'collected'

with open('config.json', 'r') as f:
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
    with open(TARGET_DIR + '/news-local.json', 'w') as f:
        f.write(r.text)


def getGlobalNews():
    r = requests.get('https://newsapi.org/v2/top-headlines?country=' +
                     COUNTRY + '&apiKey=' + NEWS_API)
    with open(TARGET_DIR + '/news-global.json', 'w') as f:
        f.write(r.text)


def getWeather():
    r = requests.get('http://api.openweathermap.org/geo/1.0/direct?q=' +
                     ADDR + '&limit=0&appid=' + WEATHER_API)
    geo = json.loads(r.text)
    lat = geo[0]['lat']
    lon = geo[0]['lon']
    r = requests.get('https://api.openweathermap.org/data/2.5/weather?lat=' +
                     str(lat) + '&lon=' + str(lon) + '&appid=' + WEATHER_API)
    with open(TARGET_DIR + '/weather.json', 'w') as f:
        f.write(r.text)
    r = requests.get('http://api.openweathermap.org/data/2.5/air_pollution?lat=' +
                     str(lat) + '&lon=' + str(lon) + '&appid=' + WEATHER_API)
    with open(TARGET_DIR + '/aqi.json', 'w') as f:
        f.write(r.text)


def routine(tick: int = 0, dry: bool = False):
    if (tick % 5) == 0:
        print('[' + time.strftime('%T') + '] Getting weather data...')
        if not dry:
            getWeather()
    if (tick % 60) == 0:
        print('[' + time.strftime('%T') + '] Getting news...')
        if not dry:
            getLocalNews()
            getGlobalNews()
    time.sleep(60)
    routine((tick+1) % 60)
