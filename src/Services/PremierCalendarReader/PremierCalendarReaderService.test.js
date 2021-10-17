import PremierCalendarReaderService from './PremierCalendarReaderService'

/* eslint-disable no-undef */
describe('Merging Internet calendars', () => {
  const premierCalendarReaderService = new PremierCalendarReaderService()
  let calendar = null

  describe('Getting correctly the 2 calendars', () => {
    test('PreBenjamin calendar has >20 matches', async () => {
      const preBenjaminMatches = await premierCalendarReaderService.getMatchesFromURL(premierCalendarReaderService.preBenjaminUrl)
      expect(preBenjaminMatches.length).toBeGreaterThan(20)
    })

    test('Benjamin calendar has >20 matches', async () => {
      const benjaminMatches = await premierCalendarReaderService.getMatchesFromURL(premierCalendarReaderService.benjaminUrl)
      expect(benjaminMatches.length).toBeGreaterThan(20)
    })
  })

  describe('Checking the length of the season', () => {
    test('Merging 2 simple calendars groups correctly into 2 weeks', async () => {
      calendar = await premierCalendarReaderService.getPremierCalendar()
      expect(calendar.weeks.length).toBeGreaterThan(20)
    })
  })
})
