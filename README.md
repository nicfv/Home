# Home
A dashboard for your home.

## API Request Limits
At the time of posting, these are the limits on free tiers:

### OpenWeatherMap
1,000 requests/day

### NewsAPI
1,000 requests/day

### Mapbox
100,000 requests/month

$$\frac{1,000\frac{\text{requests}}{\text{day}}}{24\frac{\text{hours}}{\text{day}}\times 60\frac{\text{minutes}}{\text{hour}}}\approx 0.69\frac{\text{requests}}{\text{minute}}\Rightarrow \text{1:30 between single calls, 3:00 between 2 back-to-back calls...}$$

$$\frac{100,000\frac{\text{requests}}{\text{month}}}{30\frac{\text{days}}{\text{month}}\times 24\frac{\text{hours}}{\text{day}}\times 60\frac{\text{minutes}}{\text{hour}}}\approx 2.24\frac{\text{requests}}{\text{minute}}\Rightarrow \text{0:30 between single calls, 1:00 between 2 back-to-back calls...}$$
