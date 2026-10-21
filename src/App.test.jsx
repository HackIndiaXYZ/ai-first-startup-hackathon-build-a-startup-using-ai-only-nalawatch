import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/vitest';

describe('App', () => {
  it('renders the hero heading and call-to-action content', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /explore flood scenarios before the storm/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /try the scenario/i })).toHaveAttribute('href', '#simulator');
    expect(screen.getByRole('link', { name: /open dashboard/i })).toHaveAttribute('href', '#simulator');
  });

  it('shows the dashboard before the supporting product sections', () => {
    render(<App />);

    const sections = [...screen.getByRole('main').querySelectorAll('section')];
    const dashboardIndex = sections.findIndex((section) => section.id === 'simulator');
    const productIndex = sections.findIndex((section) => section.id === 'product');

    expect(dashboardIndex).toBeGreaterThanOrEqual(0);
    expect(dashboardIndex).toBeLessThan(productIndex);
  });

  it('renders the transparent synthetic scenario simulator', () => {
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
    expect(screen.getByLabelText(/rainfall total/i)).toHaveValue('150');
    expect(screen.getByText(/intense cloudburst/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /old town, scenario index/i }));
    expect(screen.getByRole('heading', { name: /old town \(w-03\)/i })).toBeInTheDocument();
  });
});
