import CalendarReaderService from './CalendarReaderService'

/* eslint-disable no-undef */
describe('Merging Internet calendars', () => {
  const calendarReaderService = new CalendarReaderService()
  let calendar = null

  describe('Getting correctly the 2 calendars', () => {
    test('PreBenjamin calendar has >20 matches', async () => {
      const preBenjaminMatches = await calendarReaderService.getMatchesFromURL(calendarReaderService.preBenjaminUrl)
      expect(preBenjaminMatches.length).toBeGreaterThan(20)
    })

    test('Benjamin calendar has >20 matches', async () => {
      const benjaminMatches = await calendarReaderService.getMatchesFromURL(calendarReaderService.benjaminUrl)
      expect(benjaminMatches.length).toBeGreaterThan(20)
    })
  })

  describe('Checking the length of the season', () => {
    test('Merging 2 simple calendars groups correctly into 2 weeks', async () => {
      calendar = await calendarReaderService.getCalendar()
      expect(calendar.weeks.length).toBeGreaterThan(20)
    })
  })
})
