import React from 'react'
import { render, screen } from '@testing-library/react'
import Calendar from './Calendar'

const team = displayName => ({ displayName, logoUrl: '', url: '' })

function week (title, endsAt, home, away) {
  return {
    title,
    endsAt,
    isProblematic: false,
    matches: [{
      footballer: 'Alex',
      startsAt: endsAt,
      dateLabel: 'SÁB 04 OCT',
      timeLabel: '20:00h',
      homeTeam: team(home),
      awayTeam: away && team(away),
      fieldMapUrl: away ? 'https://maps/field' : null,
      isAway: false,
      isResting: !away,
      isRivalRetired: false
    }]
  }
}

const calendar = {
  weeks: [
    week('Jornada 1 SÁB', '2026-10-04T19:00:00.000Z', 'Premier D', 'Pia Sarrià A'),
    week('Jornada 2 SÁB', '2026-10-10T14:30:00.000Z', 'Tarr A', 'Premier D'),
    week('Jornada 3 SÁB', '2026-10-17T17:00:00.000Z', 'Premier D', null)
  ]
}
const footballers = { Alex: { name: 'Alex', imageUrl: '/footballers/Alex.png', statsUrl: 'https://fcf/alex' } }

describe('Calendar', () => {
  test('shows the current week first and the following weeks after it, hiding past weeks', () => {
    render(<Calendar calendar={calendar} footballers={footballers} now={new Date('2026-10-05T00:00:00Z')}/>)

    expect(screen.getByText('Próxima Jornada')).toBeInTheDocument()
    expect(screen.getByText('Tarr A')).toBeInTheDocument()
    expect(screen.getByText('Jornada 3 SÁB')).toBeInTheDocument()
    expect(screen.queryByText('Jornada 1 SÁB')).not.toBeInTheDocument()
    expect(screen.queryByText('Pia Sarrià A')).not.toBeInTheDocument()
  })

  test('a rest week says so and has no field link', () => {
    render(<Calendar calendar={calendar} footballers={footballers} now={new Date('2026-10-12T00:00:00Z')}/>)

    expect(screen.getByText('(Descansa)')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'home' })).not.toBeInTheDocument()
  })
})
