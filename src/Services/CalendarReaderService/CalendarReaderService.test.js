import CalendarReaderService from './CalendarReaderService'
import config from '../../config.json'
import Footballer from '../../Models/Footballer/Footballer'

/* eslint-disable no-undef */
describe('Merging Internet calendars', () => {
  const calendarReaderService = new CalendarReaderService()

  describe('Getting correctly the 2 calendars', () => {
    test('Footballer 1 calendar has >20 matches', async () => {
      const footballer1 = new Footballer(config.homePageFootballerNames[0])
      const footballer1Matches = await calendarReaderService.getMatchesFromURL(footballer1.teams[0].calendarUrl)
      expect(footballer1Matches.length).toBeGreaterThan(20)
    })

    test('Footballer 2 calendar has >20 matches', async () => {
      const footballer2 = new Footballer(config.homePageFootballerNames[1])
      const footballer2Matches = await calendarReaderService.getMatchesFromURL(footballer2.teams[0].calendarUrl)
      expect(footballer2Matches.length).toBeGreaterThan(20)
    })
  })
})
