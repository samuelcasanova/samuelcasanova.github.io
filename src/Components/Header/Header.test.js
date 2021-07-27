import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders the app title in the header', () => {
  render(<Header />);
  const titleElement = screen.getByText(/My favourite random users/i);
  expect(titleElement).toBeInTheDocument();
});
