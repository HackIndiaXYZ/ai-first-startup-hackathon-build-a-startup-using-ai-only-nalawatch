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

  it('shows the Firebase setup steps from the sign-in dialog when credentials are not configured', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));
    expect(screen.getByRole('dialog', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByText(/authentication setup required/i)).toBeInTheDocument();
    expect(screen.getByText(/\.env\.local/i)).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the dashboard before the supporting product sections', () => {
    render(<App />);

    const sections = [...screen.getByRole('main').querySelectorAll('section')];
    const dashboardIndex = sections.findIndex((section) => section.id === 'simulator');
    const productIndex = sections.findIndex((section) => section.id === 'product');

    expect(dashboardIndex).toBeGreaterThanOrEqual(0);
    expect(dashboardIndex).toBeLessThan(productIndex);
  });

  it('presents Mumbai as a proposed, unconfirmed pilot in the pitch view', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /startup pitch/i }));
    expect(screen.getByRole('heading', { name: /why mumbai first/i })).toBeInTheDocument();
    expect(screen.getByText(/not a confirmed partnership or selected ward/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /pilot proof plan/i })).toBeInTheDocument();
  });

  it('renders the transparent synthetic scenario simulator', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /mumbai: prove the workflow before making a warning/i })).toBeInTheDocument();
    expect(screen.getByText(/partner not yet confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/no mcgm data, gauges, maps, reports, or emergency systems are connected/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /explore how rainfall and drainage assumptions interact/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a forecast or alert/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /neighbourhood scenario board/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /simulated ponding proxy/i })).toBeInTheDocument();
    expect(screen.getByText(/not a probability or confidence interval/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /select a synthetic neighbourhood/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /highest index first/i })).toHaveAttribute('aria-pressed', 'false');

    fireEvent.change(screen.getByLabelText(/estimated blockage/i), { target: { value: '100' } });
    expect(screen.getByLabelText(/estimated blockage/i)).toHaveValue('100');

    fireEvent.click(screen.getByRole('button', { name: /intense cloudburst/i }));
    expect(screen.getByLabelText(/rainfall total/i)).toHaveValue('150');
    expect(screen.getByText(/intense cloudburst/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /old town, scenario index/i }));
    expect(screen.getByRole('heading', { name: /old town \(w-03\)/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /highest index first/i }));
    expect(screen.getByRole('button', { name: /default order/i })).toHaveAttribute('aria-pressed', 'true');
    const sortedScores = screen
      .getAllByRole('button', { name: /scenario index/i })
      .map((tile) => Number(tile.getAttribute('aria-label').match(/scenario index (\d+)/i)[1]));
    expect(sortedScores).toEqual([...sortedScores].sort((first, second) => second - first));
    fireEvent.click(screen.getByRole('button', { name: /default order/i }));
    expect(screen.getByRole('button', { name: /highest index first/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('compares the current scenario with a saved baseline', () => {
    render(<App />);

    expect(screen.queryByRole('region', { name: /current scenario vs saved baseline/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /save current as comparison baseline/i }));
    expect(screen.getByRole('region', { name: /current scenario vs saved baseline/i })).toBeInTheDocument();
    expect(screen.getByText(/synthetic rainfall profile/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/rainfall total/i), { target: { value: '150' } });
    expect(screen.getByRole('table', { name: /synthetic neighbourhood/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear comparison/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /clear comparison/i }));
    expect(screen.queryByRole('region', { name: /current scenario vs saved baseline/i })).not.toBeInTheDocument();
  });

  it('lets a user scrub the timeline and build a scenario-specific tabletop brief', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/simulation hour/i), { target: { value: '4' } });
    expect(screen.getByRole('status', { name: /simulation readout/i })).toHaveTextContent(/hour 4 of 6/i);

    const buildBriefButton = screen.getByRole('button', { name: /build exercise brief/i });
    expect(buildBriefButton).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /review drain inspection priorities/i }));
    expect(buildBriefButton).toBeEnabled();
    fireEvent.click(buildBriefButton);

    const brief = screen.getByRole('status', { name: /generated exercise brief/i });
    expect(brief).toHaveTextContent(/hour 4/i);
    expect(brief).toHaveTextContent(/scenario index \d+\/100/i);
    expect(brief).toHaveTextContent(/review drain inspection priorities/i);
    expect(brief).toHaveTextContent(/not a flood prediction or public warning/i);
    expect(screen.getByRole('button', { name: /download discussion brief/i })).toBeInTheDocument();
  });

  it('starts a guided scenario and preselects useful tabletop tasks', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /start guided exercise/i }));

    expect(screen.getByLabelText(/rainfall total/i)).toHaveValue('150');
    expect(screen.getByRole('button', { name: /pause timeline/i })).toBeInTheDocument();
    expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /selected.*verify against local reports/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /selected.*review drain inspection priorities/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
