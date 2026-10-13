import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/vitest';
import { calculateFloodRisk } from './components/floodRisk.js';

describe('App', () => {
  it('renders the hero heading and call-to-action content', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /predict floods before they hit the city/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /try the scenario/i })).toHaveAttribute('href', '#simulator');
  });

  it('renders the interactive scenario simulator and discloses its limits', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /explore a ward risk scenario/i })).toBeInTheDocument();
    expect(screen.getByText(/not an operational alert/i)).toBeInTheDocument();
    expect(screen.getByText(/not calibrated or validated/i)).toBeInTheDocument();
    expect(screen.getByText(/Elevated scenario risk/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/estimated blockage/i), { target: { value: '100' } });
    expect(screen.getByText(/High scenario risk/i)).toBeInTheDocument();
  });

  it('calculates bounded, deterministic demonstration risk levels', () => {
    expect(calculateFloodRisk({ rainfallMm: 0, drainLoad: 0, blockage: 0 })).toEqual({
      score: 0,
      level: 'Low',
    });
    expect(calculateFloodRisk({ rainfallMm: 100, drainLoad: 100, blockage: 100 })).toEqual({
      score: 100,
      level: 'Critical',
    });
    expect(calculateFloodRisk({ rainfallMm: 200, drainLoad: -10, blockage: 0 })).toEqual({
      score: 45,
      level: 'Elevated',
    });
  });
});
