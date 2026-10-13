import React from 'react'
import { render, screen } from '@testing-library/react'
import StaleDataAlert from './StaleDataAlert'

const staleSince = '2026-10-10T08:17:00.000Z'

describe('StaleDataAlert', () => {
  test('says how many days ago the data was last updated', () => {
    render(<StaleDataAlert staleSince={staleSince} now={new Date('2026-10-13T10:00:00Z')}/>)

    expect(screen.getByRole('status')).toHaveTextContent('Última actualización hace 3 días')
  })

  test('says one day in singular', () => {
    render(<StaleDataAlert staleSince={staleSince} now={new Date('2026-10-11T09:00:00Z')}/>)

    expect(screen.getByRole('status')).toHaveTextContent('Última actualización hace 1 día')
  })

  test('is hidden until the data is more than a day old', () => {
    render(<StaleDataAlert staleSince={staleSince} now={new Date('2026-10-11T08:17:00Z')}/>)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('is hidden when the data is up to date', () => {
    render(<StaleDataAlert staleSince={null} now={new Date('2026-10-13T10:00:00Z')}/>)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
