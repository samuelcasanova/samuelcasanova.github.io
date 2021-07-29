import { render, screen } from '@testing-library/react'
import UserInformation from './UserInformation'
import test from jest

test('renders the coming soon button element', () => {
  render(<UserInformation />)
  const buttonElement = screen.getByRole('button')
  expect(buttonElement).toBeInTheDocument()
  expect(buttonElement).toHaveTextContent('Coming soon...')
  expect(buttonElement).toBeDisabled()
})
