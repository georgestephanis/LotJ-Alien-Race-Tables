import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the race filter form', () => {
  render(<App />);
  const heading = screen.getByText(/Race Name\?/i);
  expect(heading).toBeInTheDocument();
});
