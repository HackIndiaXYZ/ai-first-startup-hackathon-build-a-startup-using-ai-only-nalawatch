import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/vitest';

describe('App', () => {
  it('renders the hero heading and call-to-action content', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /predict floods before they hit the city/i })).toBeInTheDocument();
    expect(screen.getByText(/start a pilot/i)).toBeInTheDocument();
  });

  it('renders the pricing section', () => {
    render(<App />);

    expect(screen.getByText(/simple pricing for city pilots and scale-up/i)).toBeInTheDocument();
    expect(screen.getByText(/^Scale$/i)).toBeInTheDocument();
  });
});
