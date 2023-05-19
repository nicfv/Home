# Home
A dashboard for your home.
Read the [changelog](./CHANGELOG.md) for updates.

## Installation
Python version 3 is required for installation.
```shell
git clone https://github.com/nicfv/Home.git
cd Home
pip install -r requirements.txt
```

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
