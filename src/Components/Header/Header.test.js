import { render, screen } from '@testing-library/react'
import Header from './Header'
import React from React

test('renders the app title in the header', () => {
  render(<Header />)
  const titleElement = screen.getByText(/Rick and Morty characters/i)
  expect(titleElement).toBeInTheDocument()
})
