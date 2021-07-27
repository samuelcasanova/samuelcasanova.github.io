import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders the copyright text in the footer', () => {
  render(<Footer />);
  const copyrightElement = screen.getByText(/Samuel Casanova, 2021/i);
  expect(copyrightElement).toBeInTheDocument();
});
