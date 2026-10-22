import { describe, expect, it, vi } from 'vitest';
import { fetchHourlyPrecipitation } from './weatherData.js';

function makePayload(startAt = '2026-10-22T00:00:00Z') {
  const firstTime = Date.parse(startAt);
  return {
    hourly: {
      time: Array.from({ length: 30 }, (_, index) => new Date(firstTime + index * 3_600_000).toISOString()),
      precipitation: Array.from({ length: 30 }, (_, index) => index / 10),
    },
  };
}

describe('fetchHourlyPrecipitation', () => {
  it('provides the Mumbai pilot rainfall context at its published preset coordinates', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => makePayload(),
    });

    const forecast = await fetchHourlyPrecipitation('mumbai', {
      fetchImpl,
      now: new Date('2026-10-22T02:30:00Z'),
    });

    const requestUrl = new URL(fetchImpl.mock.calls[0][0]);
    expect(requestUrl.searchParams.get('latitude')).toBe('19.076');
    expect(requestUrl.searchParams.get('longitude')).toBe('72.8777');
    expect(forecast.city.name).toBe('Mumbai');
  });

  it('requests six upcoming hourly values for the selected city', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => makePayload(),
    });

    const forecast = await fetchHourlyPrecipitation('chennai', {
      fetchImpl,
      now: new Date('2026-10-22T02:30:00Z'),
    });

    const requestUrl = new URL(fetchImpl.mock.calls[0][0]);
    expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(requestUrl.searchParams.get('latitude')).toBe('13.0827');
    expect(requestUrl.searchParams.get('hourly')).toBe('precipitation');
    expect(forecast.city.name).toBe('Chennai');
    expect(forecast.hours).toHaveLength(6);
    expect(forecast.hours[0]).toEqual({
      hour: 1,
      validAt: '2026-10-22T03:00:00.000Z',
      precipitationMm: 0.3,
    });
  });

  it('rejects unsupported city identifiers without making a request', async () => {
    const fetchImpl = vi.fn();

    await expect(fetchHourlyPrecipitation('not-a-city', { fetchImpl })).rejects.toThrow(
      /unknown weather location/i,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('surfaces upstream HTTP errors', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 });

    await expect(fetchHourlyPrecipitation('mumbai', { fetchImpl })).rejects.toThrow(
      /HTTP 503/i,
    );
  });

  it('rejects malformed or insufficient forecast data', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hourly: { time: ['2026-10-22T03:00:00Z'], precipitation: [] } }),
    });

    await expect(
      fetchHourlyPrecipitation('delhi', {
        fetchImpl,
        now: new Date('2026-10-22T02:00:00Z'),
      }),
    ).rejects.toThrow(/incomplete hourly forecast/i);
  });

  it('rejects invalid timestamps and negative precipitation values', async () => {
    const invalidTimestamp = makePayload();
    invalidTimestamp.hourly.time[3] = 'not-a-time';
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => invalidTimestamp,
    });

    await expect(
      fetchHourlyPrecipitation('bengaluru', {
        fetchImpl,
        now: new Date('2026-10-22T02:30:00Z'),
      }),
    ).rejects.toThrow(/six valid upcoming hourly precipitation values/i);

    const negativeValue = makePayload();
    negativeValue.hourly.precipitation[3] = -1;
    fetchImpl.mockResolvedValue({
      ok: true,
      json: async () => negativeValue,
    });

    await expect(
      fetchHourlyPrecipitation('bengaluru', {
        fetchImpl,
        now: new Date('2026-10-22T02:30:00Z'),
      }),
    ).rejects.toThrow(/six valid upcoming hourly precipitation values/i);
  });
});
