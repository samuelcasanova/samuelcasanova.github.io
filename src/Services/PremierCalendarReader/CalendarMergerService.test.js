import CalendarMergerService from './CalendarMergerService'

/* eslint-disable no-undef */
describe('Merging calendars', () => {
  const calendarMergerService = new CalendarMergerService()
  let simpleCalendarMatches1 = null
  let simpleCalendarMatches2 = null
  let complexCalendarMatches1 = null
  let complexCalendarMatches2 = null
  let calendar = null

  beforeAll(() => {
    simpleCalendarMatches1 = [
      { datetime: new Date(2021, 9, 9, 11, 0), homeTeam: 'Home 11', awayTeam: 'Away 11' },
      { datetime: new Date(2021, 9, 16, 12, 0), homeTeam: 'Home 12', awayTeam: 'Away 12' }
    ]
    simpleCalendarMatches2 = [
      { datetime: new Date(2021, 9, 10, 11, 30), homeTeam: 'Home 21', awayTeam: 'Away 21' },
      { datetime: new Date(2021, 9, 17, 12, 30), homeTeam: 'Home 22', awayTeam: 'Away 22' }
    ]
    complexCalendarMatches1 = [
      { datetime: new Date(2021, 9, 9, 11, 0), homeTeam: 'Home 11', awayTeam: 'Away 11' },
      { datetime: new Date(2021, 9, 16, 11, 0), homeTeam: 'Home 12', awayTeam: 'Away 12' },
      { datetime: new Date(2021, 9, 23, 11, 0), homeTeam: 'Home 13', awayTeam: 'Away 13' },
      { datetime: new Date(2021, 9, 31, 12, 0), homeTeam: 'Home 14', awayTeam: 'Away 14' }
    ]
    complexCalendarMatches2 = [
      { datetime: new Date(2021, 9, 9, 11, 30), homeTeam: 'Home 21', awayTeam: 'Away 21' },
      { datetime: new Date(2021, 9, 17, 11, 0), homeTeam: 'Home 22', awayTeam: 'Away 22' },
      { datetime: new Date(2021, 9, 23, 11, 0), homeTeam: 'Home 23', awayTeam: 'Away 23' }
    ]
  })

  describe('Merging 2 simple calendars', () => {
    beforeAll(() => {
      calendar = calendarMergerService.mergeMatchesIntoCalendar(simpleCalendarMatches1, simpleCalendarMatches2)
    })
    test('Merging 2 simple calendars groups correctly into 2 weeks', () => {
      expect(calendar.weeks.length).toBe(2)
    })
    test('First week of year is 40', () => {
      expect(calendar.weeks[0].weekofyear).toBe(40)
    })
    test('Second week of year is 41', () => {
      expect(calendar.weeks[1].weekofyear).toBe(41)
    })
    test('First week has 2 matches', () => {
      expect(calendar.weeks[0].matches.length).toBe(2)
    })
    test('Second week has 2 matches as well', () => {
      expect(calendar.weeks[1].matches.length).toBe(2)
    })
    test('First match of first week is Home 11 vs Away 11', () => {
      expect(calendar.weeks[0].matches[0].homeTeam).toBe('Home 11')
      expect(calendar.weeks[0].matches[0].awayTeam).toBe('Away 11')
    })
    test('Second match of first week is Home 21 vs Away 21', () => {
      expect(calendar.weeks[0].matches[1].homeTeam).toBe('Home 21')
      expect(calendar.weeks[0].matches[1].awayTeam).toBe('Away 21')
    })
    test('First match of second week is Home 12 vs Away 12', () => {
      expect(calendar.weeks[1].matches[0].homeTeam).toBe('Home 12')
      expect(calendar.weeks[1].matches[0].awayTeam).toBe('Away 12')
    })
    test('Second match of second week is Home 22 vs Away 22', () => {
      expect(calendar.weeks[1].matches[1].homeTeam).toBe('Home 22')
      expect(calendar.weeks[1].matches[1].awayTeam).toBe('Away 22')
    })
  })

  describe('Merging 2 more complex calendars', () => {
    beforeAll(() => {
      calendar = calendarMergerService.mergeMatchesIntoCalendar(complexCalendarMatches1, complexCalendarMatches2)
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
    test('First match of first week is Home 11 vs Away 11', () => {
      expect(calendar.weeks[0].matches[0].homeTeam).toBe('Home 11')
      expect(calendar.weeks[0].matches[0].awayTeam).toBe('Away 11')
    })
    test('Second match of first week is Home 21 vs Away 21', () => {
      expect(calendar.weeks[0].matches[1].homeTeam).toBe('Home 21')
      expect(calendar.weeks[0].matches[1].awayTeam).toBe('Away 21')
    })
    test('First match of second week is Home 12 vs Away 12', () => {
      expect(calendar.weeks[1].matches[0].homeTeam).toBe('Home 12')
      expect(calendar.weeks[1].matches[0].awayTeam).toBe('Away 12')
    })
    test('Second match of second week is Home 22 vs Away 22', () => {
      expect(calendar.weeks[1].matches[1].homeTeam).toBe('Home 22')
      expect(calendar.weeks[1].matches[1].awayTeam).toBe('Away 22')
    })
    test('First match of third week is Home 13 vs Away 13', () => {
      expect(calendar.weeks[2].matches[0].homeTeam).toBe('Home 13')
      expect(calendar.weeks[2].matches[0].awayTeam).toBe('Away 13')
    })
    test('Second match of third week is Home 23 vs Away 23', () => {
      expect(calendar.weeks[2].matches[1].homeTeam).toBe('Home 23')
      expect(calendar.weeks[2].matches[1].awayTeam).toBe('Away 23')
    })
    test('First match of fourth week is Home 14 vs Away 14', () => {
      expect(calendar.weeks[3].matches[0].homeTeam).toBe('Home 14')
      expect(calendar.weeks[3].matches[0].awayTeam).toBe('Away 14')
    })
  })

  describe('Checking current week when merging', () => {
    test('today is before all the calendar matches', () => {
      const aDayBeforeFirstWeek = new Date(2021, 9, 8)
      calendar = calendarMergerService.mergeMatchesIntoCalendar(simpleCalendarMatches1, simpleCalendarMatches2, aDayBeforeFirstWeek)
      expect(calendar.currentWeekIndex).toBe(0)
    })
    test('today is between first and second match of the first week', () => {
      const aDayBeforeFirstWeek = new Date(2021, 9, 9, 12, 30)
      calendar = calendarMergerService.mergeMatchesIntoCalendar(simpleCalendarMatches1, simpleCalendarMatches2, aDayBeforeFirstWeek)
      expect(calendar.currentWeekIndex).toBe(0)
    })
    test('today is rigth after the last match of the first week', () => {
      const aDayBeforeFirstWeek = new Date(2021, 9, 10, 13, 0)
      calendar = calendarMergerService.mergeMatchesIntoCalendar(simpleCalendarMatches1, simpleCalendarMatches2, aDayBeforeFirstWeek)
      expect(calendar.currentWeekIndex).toBe(1)
    })
    test('today is between the first and the last match of the second week', () => {
      const firstMatchSecondRoundAfternoon = new Date(2021, 9, 16, 17, 0)
      calendar = calendarMergerService.mergeMatchesIntoCalendar(simpleCalendarMatches1, simpleCalendarMatches2, firstMatchSecondRoundAfternoon)
      expect(calendar.currentWeekIndex).toBe(1)
    })
    test('today is after the last match of the season', () => {
      const afterLastMatchOfSeason = new Date(2021, 9, 18, 17, 0)
      calendar = calendarMergerService.mergeMatchesIntoCalendar(simpleCalendarMatches1, simpleCalendarMatches2, afterLastMatchOfSeason)
      expect(calendar.currentWeekIndex).toBe(1)
    })
  })
})