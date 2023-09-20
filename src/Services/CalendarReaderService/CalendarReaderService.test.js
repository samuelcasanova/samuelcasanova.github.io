import CalendarReaderService from './CalendarReaderService'
import config from '../../config.json'
import Footballer from '../../Models/Footballer/Footballer'

/* eslint-disable no-undef */
describe('Merging Internet calendars', () => {
  const calendarReaderService = new CalendarReaderService()

  describe('Getting correctly the calendars', () => {
    test('Footballer 1 calendar has >20 matches', async () => {
      const footballer1 = new Footballer(config.calendars[0].footballerNames[0])
      const footballer1Matches = await calendarReaderService.getMatchesFromURL(footballer1.teams[0].calendarUrl, footballer1, footballer1.teams[0].category)
      expect(footballer1Matches.length).toBeGreaterThan(20)
    })

    test('Footballer 2 calendar has >20 matches', async () => {
      const footballer2 = new Footballer(config.calendars[0].footballerNames[1])
      const footballer2Matches = await calendarReaderService.getMatchesFromURL(footballer2.teams[0].calendarUrl, footballer2, footballer2.teams[0].category)
      expect(footballer2Matches.length).toBeGreaterThan(20)
    })

    test('Wrong calendar give an error', async () => {
      try {
        await calendarReaderService.getMatchesFromURL('https://www.fcf.cat/calendari-equip/2022/futbol-7/prebenjami-7/grup-18/montanesa-cf-c')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('CalendarReaderService.getMatchesFromURL: 0 matches read from calendar: https://www.fcf.cat/calendari-equip/2022/futbol-7/prebenjami-7/grup-18/montanesa-cf-c')
      }
    })
  })
})
