import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BarChart from './BarChart';

describe('BarChart', () => {
  it('renders an SVG chart with a label for accessibility', () => {
    render(<BarChart data={[2, 4, 6, 3]} />);

    expect(screen.getByLabelText(/threats over time chart/i)).toBeInTheDocument();
  });
});
