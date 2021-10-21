import CalendarReaderService from './CalendarReaderService'
import config from '../../config.json'

/* eslint-disable no-undef */
describe('Merging Internet calendars', () => {
  const calendarReaderService = new CalendarReaderService()
  let calendar = null

  describe('Getting correctly the 2 calendars', () => {
    test('Player 1 calendar has >20 matches', async () => {
      const player1Matches = await calendarReaderService.getMatchesFromURL(config.players[0].calendarUrl)
      expect(player1Matches.length).toBeGreaterThan(20)
    })

    test('Player 2 calendar has >20 matches', async () => {
      const player2Matches = await calendarReaderService.getMatchesFromURL(config.players[1].calendarUrl)
      expect(player2Matches.length).toBeGreaterThan(20)
    })
  })

  describe('Checking the length of the season', () => {
    test('Merging 2 simple calendars groups correctly into 2 weeks', async () => {
      calendar = await calendarReaderService.getCalendar()
      expect(calendar.weeks.length).toBeGreaterThan(20)
    })
  })
})
