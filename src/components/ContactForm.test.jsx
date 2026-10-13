import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  it('renders the contact form inputs', () => {
    render(<ContactForm />);

    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@company.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request demo/i })).toBeInTheDocument();
  });
});
