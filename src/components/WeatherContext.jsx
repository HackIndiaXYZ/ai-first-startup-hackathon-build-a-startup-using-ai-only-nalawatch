import { useState } from 'react';
import { fetchHourlyPrecipitation, WEATHER_CITIES } from './weatherData.js';

function formatHour(value) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    timeZoneName: 'short',
  }).format(new Date(value));
}

export default function WeatherContext({ activeForecast, onApply, onRemove }) {
  const [cityId, setCityId] = useState(WEATHER_CITIES[0].id);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nextThreeHourTotal =
    forecast?.hours.slice(0, 3).reduce((total, hour) => total + hour.precipitationMm, 0) ?? 0;
  const applied = Boolean(activeForecast && activeForecast === forecast?.fetchedAt);
  const maxRainfall = Math.max(1, ...(forecast?.hours.map((hour) => hour.precipitationMm) ?? []));

  async function loadForecast() {
    setLoading(true);
    setError('');
    try {
      const nextForecast = await fetchHourlyPrecipitation(cityId);
      setForecast(nextForecast);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Weather forecast could not be loaded. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="weather-context" aria-labelledby="weather-context-title">
      <div className="weather-context-heading">
        <div>
          <span className="eyebrow">External weather context · optional</span>
          <h4 id="weather-context-title">Bring a real hourly rain forecast into the scenario</h4>
          <p>
            Fetches precipitation for a selected city. Weather is not a flood warning; the ward model remains synthetic.
          </p>
        </div>
        <div className="weather-controls">
          <label htmlFor="weather-city">City</label>
          <select
            id="weather-city"
            value={cityId}
            disabled={loading}
            onChange={(event) => {
              setCityId(event.target.value);
              setForecast(null);
              onRemove();
            }}
          >
            {WEATHER_CITIES.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          <button className="preset-button" type="button" onClick={loadForecast} disabled={loading}>
            {loading ? 'Loading forecast…' : forecast ? 'Refresh forecast' : 'Load forecast'}
          </button>
        </div>
      </div>

      {error && <p className="weather-error" role="alert">{error}</p>}

      {forecast ? (
        <div className="weather-results">
          <div className="weather-results-heading">
            <div>
              <strong>{forecast.city.name} · next six hours</strong>
              <span>Updated {new Date(forecast.fetchedAt).toLocaleString()} (local time)</span>
            </div>
            <div className="weather-total">
              <strong>{Math.round(nextThreeHourTotal * 10) / 10} mm</strong>
              <span>forecast total · next 3 hours</span>
            </div>
          </div>
          <div className="weather-hour-grid" aria-label={`Hourly precipitation forecast for ${forecast.city.name}`}>
            {forecast.hours.map((hour) => (
              <div className="weather-hour" key={hour.validAt}>
                <span>{formatHour(hour.validAt)}</span>
                <span className="weather-rain-track" aria-hidden="true">
                  <i style={{ width: `${Math.max(4, (hour.precipitationMm / maxRainfall) * 100)}%` }} />
                </span>
                <strong>{hour.precipitationMm} mm</strong>
              </div>
            ))}
          </div>
          <div className="weather-actions">
            <p>
              Forecast context only. Applying it scales the sandbox rainfall profile; this does not produce a flood forecast.
            </p>
            {applied ? (
              <button className="preset-button" type="button" onClick={onRemove}>
                Switch back to synthetic rain
              </button>
            ) : (
              <button className="export-button" type="button" onClick={() => onApply(forecast)}>
                Use rainfall in scenario
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="weather-empty">No external data requested yet. The simulation uses synthetic rainfall until you load a forecast.</p>
      )}

      <p className="weather-attribution">
        Weather data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
        {' '}· Free API for non-commercial use, CC BY 4.0 attribution ·{' '}
        <a href="https://open-meteo.com/en/terms" target="_blank" rel="noreferrer">terms</a>.
        A commercial product requires an appropriate API plan.
      </p>
    </section>
  );
}
