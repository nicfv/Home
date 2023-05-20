# Home
A dashboard for your home.
Read the [changelog](./CHANGELOG.md) for updates.

## Obtain API Keys
This program requires the use of 3 (free) API keys. Sign up on these websites to obtain a free key.
- https://newsdata.io/
- https://www.mapbox.com/
- https://openweathermap.org/

## Installation
Python version 3 is required for installation.
```shell
git clone https://github.com/nicfv/Home.git
cd Home
pip install -r requirements.txt
```

## Accessing Your Home Dashboard
When the server is running, open a browser and visit: http://localhost:8000/

## Setup
Start the server with the following command from the `Home` directory.
```shell
python run.py
```

You will likely receive this error, which means the configuration file needs to be filled out.
```
Error in config.json: 'api' is a required property
```

Open the newly created configuration file, `config.json` in the home directory with a text editor. It should look like this:
```json
{ "$schema": "server/schema.json" }
```

### Required Parameters
In this scope, there are several optional parameters, and 3 required ones: `api`, `coordinates`, and `floors`. Start by including the API keys:
```json
"api": {
    "weather": "...",
    "news": "...",
    "maps": "..."
}
```

The next required field is `coordinates` which follows this schema:
```json
"coordinates": {
    "home": {
        "lat": 0,
        "lon": 0
    },
    "work": {
        "lat": 0,
        "lon": 0
    }
}
```
Use a tool like Google maps to determine the coordinates for your home and workplace.

The last required parameter is `floors`, which is an object that contains key-value pairs, where *keys* are floor names and *values* contain room data from that floor. The room data is also formatted in key-value pairs, where the *key* is that room's name, and the *value* is an array of at least 3 (X,Y) coordinate pairs.
```json
"floors": {
    "First Floor": {
        "Living Room": [
            { "x": 0, "y": 0 },
            { "x": 10, "y": 0 },
            { "x": 10, "y": 10 },
            { "x": 0, "y": 10 }
        ],
        "Bedroom": [ ... ]
    }
}
```

### Optional Parameters
This section lists the optional parameters to further customize your home dashboard. The `server` parameter allows configuration options for running the server. If you are exposing your server to the public, or just want an added security, add the `password` subparameter. The `port` subparameter allows changing the server port number from the default value of 8000.
```json
"server": {
    "password": "mypassword",
    "port": 8001
}
```

The `preferences` parameter contains many customization options.
```json
"preferences": {
    "autoReloadInterval": 1,
    "color": "#FF00FF",
    "flip": {
        "x": false,
        "y": false
    },
    "newsCategory": "business",
    "units": "US"
}
```
- `autoReloadInterval`: If set, will refresh the browser every interval, in minutes
- `color`: If set, will add a tint to the dashboard panels
- `flip`: If the house floor plan is inverted or mirrored, set `flip.x` or `flip.y` to `true` to correct this
- `newsCategory`: Set one of the values in this enum to select your custom news category, defaults to `business`
- `units`: Determine whether the dashboard will display US or SI units on startup, defaulting to SI if not set

Finally, the `custom` parameter allows for custom datasource data to be shown in the custom panel. Like `floors`, this uses a key-value format to define unique names for data sources and data fields. Datasources are HTTP URLs to API endpoints. The custom panel only supports GET requests. The custom datasource polls the file every subparameter `interval` minutes, and collects all the fields from the `fields` subparameter. The `value` corresponds to a JSON path from where in the object to extract data, the `type` corresponds to the data type, and the `prefix` and `suffix` subparameters are optional to format data. There is no limit to how many data sources or fields to capture.
```json
"custom": {
    "My Datasource": {
        "source": "http://example.com/api/...",
        "interval": 30,
        "fields": {
            "My Custom Field": {
                "value": "response.0.price",
                "type": "number",
                "prefix": "$",
                "suffix": ".00"
            },
            "Another Field": {}
        }
    },
    "Another Datasource": {}
}
```

## Using Your Home Dashboard
If 

## API Request Limits
The server is configured to request updates from OpenWeatherMap and Mapbox every 5 minutes, and from NewsData every hour. If you wish to reconfigure this in `server/collect.py`, note the API rate limits. The news and weather APIs are called twice back-to-back to obtain all the required data for the frontend. At the time of posting, these are the limits on free tiers:

### NewsData
200 requests/day

$$\frac{200\frac{\text{requests}}{\text{day}}}{24\frac{\text{hours}}{\text{day}}\times 60\frac{\text{minutes}}{\text{hour}}}\approx 0.14\frac{\text{requests}}{\text{minute}}\Rightarrow \text{7:30 between single calls, 15:00 between 2 back-to-back calls}$$

### OpenWeatherMap
1,000 requests/day

$$\frac{1,000\frac{\text{requests}}{\text{day}}}{24\frac{\text{hours}}{\text{day}}\times 60\frac{\text{minutes}}{\text{hour}}}\approx 0.69\frac{\text{requests}}{\text{minute}}\Rightarrow \text{1:30 between single calls, 3:00 between 2 back-to-back calls}$$

### Mapbox
100,000 requests/month

$$\frac{100,000\frac{\text{requests}}{\text{month}}}{30\frac{\text{days}}{\text{month}}\times 24\frac{\text{hours}}{\text{day}}\times 60\frac{\text{minutes}}{\text{hour}}}\approx 2.24\frac{\text{requests}}{\text{minute}}\Rightarrow \text{0:30 between calls}$$

## Screenshots

![screenshot](https://github.com/nicfv/Home/assets/24358775/54a5b855-4335-4736-afed-263d04112bfa)

![screenshot-help](https://github.com/nicfv/Home/assets/24358775/00e01e1e-76dc-4239-b9a3-74d2c35a76c8)
