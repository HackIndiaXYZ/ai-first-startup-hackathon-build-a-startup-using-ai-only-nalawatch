import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import WeatherContext from './WeatherContext.jsx';

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeForecastPayload() {
  const currentHour = Math.floor(Date.now() / 3_600_000) * 3_600_000;
  return {
    hourly: {
      time: Array.from(
        { length: 30 },
        (_, index) => new Date(currentHour + index * 3_600_000).toISOString(),
      ),
      precipitation: Array.from({ length: 30 }, (_, index) => index / 10),
    },
  };
}

describe('WeatherContext', () => {
  it('loads, attributes, and applies an hourly rainfall forecast', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => makeForecastPayload(),
      }),
    );
    const onApply = vi.fn();
    const onRemove = vi.fn();
    render(<WeatherContext activeForecast={null} onApply={onApply} onRemove={onRemove} />);

    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'mumbai' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load forecast' }));

    const applyButton = await screen.findByRole('button', { name: 'Use rainfall in scenario' });
    expect(screen.getByText(/weather data:/i)).toHaveTextContent('Open-Meteo');
    expect(screen.getByText(/forecast total · next 3 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Mumbai · next six hours/i)).toBeInTheDocument();

    fireEvent.click(applyButton);
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        city: expect.objectContaining({ id: 'mumbai', name: 'Mumbai' }),
        hours: expect.arrayContaining([
          expect.objectContaining({ precipitationMm: 0.1 }),
        ]),
      }),
    );
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('clears stale city data and removes an applied profile when the city changes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => makeForecastPayload(),
      }),
    );
    const onRemove = vi.fn();
    render(<WeatherContext activeForecast="previous-forecast" onApply={vi.fn()} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: 'Load forecast' }));
    await screen.findByRole('button', { name: 'Use rainfall in scenario' });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'delhi' } });

    expect(onRemove).toHaveBeenCalled();
    expect(screen.getByText(/no external data requested yet/i)).toBeInTheDocument();
  });
});
