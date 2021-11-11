import Match from '../../Models/Match/Match'
import CalendarMergerService from './CalendarMergerService'

/* eslint-disable no-undef */
describe('Merging calendars', () => {
  const calendarMergerService = new CalendarMergerService()
  let calendar1Matches = null
  let calendar2Matches = null
  let calendar = null
  let matches = null

  beforeAll(() => {
    const getNewMatchToTest = (datetime, homeTeam, awayTeam) => {
      const newMatch = new Match(homeTeam, awayTeam)
      newMatch.setDatetime(datetime)
      return newMatch
    }

    calendar1Matches = [
      getNewMatchToTest(new Date(2021, 9, 9, 11, 0), 'Premier F', 'Barcino D'),
      getNewMatchToTest(new Date(2021, 9, 16, 11, 0), 'Premier F', 'Sarrià B'),
      getNewMatchToTest(new Date(2021, 9, 23, 9, 0), 'Horta C', 'Premier F'),
      getNewMatchToTest(new Date(2021, 9, 31, 12, 0), 'Premier F', 'Llefià')
    ]
    calendar2Matches = [
      getNewMatchToTest(new Date(2021, 9, 9, 11, 30), 'Parets C', 'Premier D'),
      getNewMatchToTest(new Date(2021, 9, 17, 11, 0), 'Premier D', 'Granja Vella'),
      getNewMatchToTest(new Date(2021, 9, 23, 13, 0), 'Barcino A', 'Premier D')
    ]
    matches = calendarMergerService.getMergedAndSortedMatches(calendar1Matches, calendar2Matches)
  })

  describe('Merging 2 calendars', () => {
    beforeAll(() => {
      calendar = calendarMergerService.createCalendarFromSortedMatches(matches)
    })
    test('Merging 2 simple calendars groups correctly into 2 weeks', () => {
      expect(calendar.weeks.length).toBe(4)
    })
    test('First week of year is 40', () => {
      expect(calendar.weeks[0].weekofyear).toBe(40)
    })
    test('Last week of year is 43', () => {
      expect(calendar.weeks[3].weekofyear).toBe(43)
    })
    test('First week has 2 matches', () => {
      expect(calendar.weeks[0].matches.length).toBe(2)
    })
    test('Last week has 1 match', () => {
      expect(calendar.weeks[3].matches.length).toBe(1)
    })
    test('First match of first week is Premier F vs Barcino D', () => {
      expect(calendar.weeks[0].matches[0].homeTeam.name).toBe('Premier F')
      expect(calendar.weeks[0].matches[0].awayTeam.name).toBe('Barcino D')
    })
    test('Second match of first week is Parets C vs Premier D', () => {
      expect(calendar.weeks[0].matches[1].homeTeam.name).toBe('Parets C')
      expect(calendar.weeks[0].matches[1].awayTeam.name).toBe('Premier D')
    })
    test('First match of second week is Premier F vs Sarrià B', () => {
      expect(calendar.weeks[1].matches[0].homeTeam.name).toBe('Premier F')
      expect(calendar.weeks[1].matches[0].awayTeam.name).toBe('Sarrià B')
    })
    test('Second match of second week is Premier D vs Granja Vella', () => {
      expect(calendar.weeks[1].matches[1].homeTeam.name).toBe('Premier D')
      expect(calendar.weeks[1].matches[1].awayTeam.name).toBe('Granja Vella')
    })
    test('First match of third week is Horta C vs Premier F', () => {
      expect(calendar.weeks[2].matches[0].homeTeam.name).toBe('Horta C')
      expect(calendar.weeks[2].matches[0].awayTeam.name).toBe('Premier F')
    })
    test('Second match of third week is Barcino A vs Premier D', () => {
      expect(calendar.weeks[2].matches[1].homeTeam.name).toBe('Barcino A')
      expect(calendar.weeks[2].matches[1].awayTeam.name).toBe('Premier D')
    })
    test('First match of fourth week is Premier F vs Llefià', () => {
      expect(calendar.weeks[3].matches[0].homeTeam.name).toBe('Premier F')
      expect(calendar.weeks[3].matches[0].awayTeam.name).toBe('Llefià')
    })
  })

  describe('Checking current week when merging', () => {
    test('today is before all the calendar matches', () => {
      const aDayBeforeFirstWeek = new Date(2021, 9, 8)
      calendar = calendarMergerService.createCalendarFromSortedMatches(matches, aDayBeforeFirstWeek)
      expect(calendar.currentWeekIndex).toBe(0)
    })
    test('today is between first and second match of the first week', () => {
      const aDayBeforeFirstWeek = new Date(2021, 9, 9, 12, 30)
      calendar = calendarMergerService.createCalendarFromSortedMatches(matches, aDayBeforeFirstWeek)
      expect(calendar.currentWeekIndex).toBe(0)
    })
    test('today is rigth after the last match of the first week', () => {
      const aDayBeforeFirstWeek = new Date(2021, 9, 10, 13, 0)
      calendar = calendarMergerService.createCalendarFromSortedMatches(matches, aDayBeforeFirstWeek)
      expect(calendar.currentWeekIndex).toBe(1)
    })
    test('today is between the first and the last match of the second week', () => {
      const firstMatchSecondRoundAfternoon = new Date(2021, 9, 16, 17, 0)
      calendar = calendarMergerService.createCalendarFromSortedMatches(matches, firstMatchSecondRoundAfternoon)
      expect(calendar.currentWeekIndex).toBe(1)
    })
    test('today is after the last match of the season', () => {
      const afterLastMatchOfSeason = new Date(2021, 9, 31, 17, 0)
      calendar = calendarMergerService.createCalendarFromSortedMatches(matches, afterLastMatchOfSeason)
      expect(calendar.currentWeekIndex).toBe(3)
    })
  })
})
