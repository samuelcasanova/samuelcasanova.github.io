import PremierCalendarReaderService from './PremierCalendarReaderService'

/* eslint-disable no-undef */
describe('Merging Internet calendars', () => {
  const premierCalendarReaderService = new PremierCalendarReaderService()
  let calendar = null

  describe('Getting correctly the 2 calendars', () => {
    test('PreBenjamin calendar has 24 matches', async () => {
      const preBenjaminMatches = await premierCalendarReaderService.getMatchesFromURL(premierCalendarReaderService.preBenjaminUrl)
      expect(preBenjaminMatches.length).toBe(26)
    })

    test('Benjamin calendar has 30 matches', async () => {
      const benjaminMatches = await premierCalendarReaderService.getMatchesFromURL(premierCalendarReaderService.benjaminUrl)
      expect(benjaminMatches.length).toBe(30)
    })
  })

  describe('Checking the length of the season', () => {
    test('Merging 2 simple calendars groups correctly into 2 weeks', async () => {
      calendar = await premierCalendarReaderService.getPremierCalendar()
      expect(calendar.weeks.length).toBe(30)
    })
  })
})
