import requests
import json

with open('config.json', 'r') as f:
    config = json.load(f)

WEATHER_API = config.get('api').get('weather')
NEWS_API = config.get('api').get('news')

CITY = config.get('address').get('city')
STATE = config.get('address').get('state')
COUNTRY = config.get('address').get('country')

ADDR = ','.join(filter(lambda x: x != None, [CITY, STATE, COUNTRY]))

r = requests.get('https://newsapi.org/v2/everything?q=' +
                 CITY + '&sortBy=publishedAt&language=en&apiKey=' + NEWS_API)

with open('news-local.json', 'w') as f:
    f.write(r.text)

r = requests.get('https://newsapi.org/v2/top-headlines?country=' +
                 COUNTRY + '&apiKey=' + NEWS_API)

with open('news-global.json', 'w') as f:
    f.write(r.text)

r = requests.get('http://api.openweathermap.org/geo/1.0/direct?q=' +
                 ADDR + '&limit=0&appid=' + WEATHER_API)

geo = json.loads(r.text)
lat = geo[0]['lat']
lon = geo[0]['lon']

r = requests.get('https://api.openweathermap.org/data/2.5/weather?lat=' +
                 str(lat) + '&lon=' + str(lon) + '&appid=' + WEATHER_API)

with open('weather.json', 'w') as f:
    f.write(r.text)
