export const WEATHER_CITIES = [
  { id: 'chennai', name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
  { id: 'mumbai', name: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
  { id: 'guwahati', name: 'Guwahati', latitude: 26.1445, longitude: 91.7362 },
  { id: 'delhi', name: 'Delhi', latitude: 28.6139, longitude: 77.209 },
  { id: 'bengaluru', name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
];

const FORECAST_HOURS = 6;
const OPEN_METEO_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

export async function fetchHourlyPrecipitation(
  cityId,
  { fetchImpl = fetch, now = new Date() } = {},
) {
  const city = WEATHER_CITIES.find((candidate) => candidate.id === cityId);
  if (!city) {
    throw new RangeError(`Unknown weather location "${cityId}".`);
  }

  const url = new URL(OPEN_METEO_ENDPOINT);
  url.search = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    hourly: 'precipitation',
    forecast_days: '2',
    timezone: 'UTC',
  }).toString();

  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Weather service returned HTTP ${response.status}.`);
  }

  const payload = await response.json();
  const times = payload?.hourly?.time;
  const precipitation = payload?.hourly?.precipitation;
  if (
    !Array.isArray(times) ||
    !Array.isArray(precipitation) ||
    times.length !== precipitation.length
  ) {
    throw new Error('Weather service returned an incomplete hourly forecast.');
  }

  const firstForecastHour = Math.ceil(now.getTime() / 3_600_000) * 3_600_000;
  const hours = times
    .map((time, index) => ({
      timestamp: Date.parse(time),
      precipitationMm: precipitation[index],
    }))
    .filter(({ timestamp }) => Number.isFinite(timestamp) && timestamp >= firstForecastHour)
    .slice(0, FORECAST_HOURS);

  if (
    hours.length !== FORECAST_HOURS ||
    hours.some(
      ({ timestamp, precipitationMm }, index) =>
        timestamp !== firstForecastHour + index * 3_600_000 ||
        !Number.isFinite(precipitationMm) ||
        precipitationMm < 0,
    )
  ) {
    throw new Error('Weather service did not provide six valid upcoming hourly precipitation values.');
  }

  return {
    city,
    fetchedAt: now.toISOString(),
    source: 'Open-Meteo forecast API',
    hours: hours.map(({ timestamp, precipitationMm }, index) => ({
      hour: index + 1,
      validAt: new Date(timestamp).toISOString(),
      precipitationMm: Math.round(precipitationMm * 10) / 10,
    })),
  };
}
