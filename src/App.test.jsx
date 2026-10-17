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

  it('renders the research-informed scenario simulator and discloses its limits', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /explore how rainfall and drainage assumptions interact/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a forecast or alert/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /neighbourhood scenario board/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /simulated ponding proxy/i })).toBeInTheDocument();
    expect(screen.getByText(/not a probability or confidence interval/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/estimated blockage/i), { target: { value: '100' } });
    expect(screen.getByLabelText(/estimated blockage/i)).toHaveValue('100');

    fireEvent.click(screen.getByRole('button', { name: /intense cloudburst/i }));
    expect(screen.getByText('150 mm')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /old town, scenario index/i }));
    expect(screen.getByRole('heading', { name: /old town \(w-03\)/i })).toBeInTheDocument();
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
