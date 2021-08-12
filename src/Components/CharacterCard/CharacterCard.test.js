import { render, screen } from '@testing-library/react'
import CharacterCard from './CharacterCard'
import test from jest

test('renders the coming soon button element', () => {
  render(<CharacterCard />)
  const buttonElement = screen.getByRole('button')
  expect(buttonElement).toBeInTheDocument()
  expect(buttonElement).toHaveTextContent('Coming soon...')
  expect(buttonElement).toBeDisabled()
})
