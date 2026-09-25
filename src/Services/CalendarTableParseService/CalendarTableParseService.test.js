/* eslint-disable no-undef */
import CalendarTableParseService from './CalendarTableParseService'
import Match from '../../Models/Match/Match'
import Footballer from '../../Models/Footballer/Footballer'
import matchesData from '../../testFixtures/matches.json'

vi.mock('../../Models/Footballer/footballers.json', () => import('../../testFixtures/footballers.json'))
vi.mock('../../Models/Team/teams.json', () => import('../../testFixtures/teams.json'))

describe('Parsing matches data', () => {
  const entries = matchesData.footballers[0].teams[0].matches
  let matches = null
  let singleMatch = null
  let calendarTableParseService = null

  beforeAll(() => {
    calendarTableParseService = new CalendarTableParseService()
    matches = calendarTableParseService.parseMatchesFromJson(entries, new Footballer('Alex'), 'Alex')
    singleMatch = matches[0]
  })

  describe('Parsing a single match', () => {
    test('match is instance of Match', () => {
      expect(singleMatch).toBeInstanceOf(Match)
    })

    test('matchday is 1', () => {
      expect(singleMatch.matchday).toBe('1')
    })

    test('match time is 20:00h', () => {
      expect(singleMatch.time).toBe('20:00h')
    })

    test('match date is DOM 4 OCT', () => {
      expect(singleMatch.date).toBe('DOM 04 OCT')
    })

    test('match datetime day is correctly merged and printed', () => {
      expect(calendarTableParseService.dateTimeToString(singleMatch.datetime)).toBe('Sun Oct 04 2026')
    })

    test('footballer name is Alex', () => {
      expect(singleMatch.footballer.name).toBe('Alex')
    })

    test('teams take their data from the category', () => {
      expect(singleMatch.homeTeam.displayName).toBe('Premier D')
      expect(singleMatch.awayTeam.logoUrl).toMatch(/^https:\/\/files\.fcf\.cat\//)
    })

    test('the match keeps its own field', () => {
      expect(singleMatch.fieldName).toBe('CAMP DE FUTBOL MPAL. VALL D´HEBRON')
    })

    test('isAway is false when the match is home for Premier', () => {
      expect(singleMatch.isAway).toBeFalsy()
    })
  })

  describe('Parsing several matches', () => {
    test('every entry becomes a match', () => {
      expect(matches).toHaveLength(entries.length)
    })

    test('an away match is away', () => {
      expect(matches[1].isAway).toBeTruthy()
    })

    test('a match without rival is a rest week', () => {
      expect(matches[2].isResting).toBeTruthy()
      expect(matches[2].awayTeam).toBeNull()
    })
  })

  describe('Parsing config data with additional matches', () => {
    beforeAll(() => {
      const configData = [{
        footballerName: 'Victor',
        homeTeamName: 'Martinenc D',
        awayTeamName: 'Premier C',
        date: '30-10-2021',
        time: '10:30'
      }]
      matches = calendarTableParseService.parseMatchesFromData(configData)
    })

    test('Checking data from the match at the config', () => {
      expect(matches).toHaveLength(1)
      expect(matches[0].awayTeam.displayName).toBe('Premier C')
      expect(matches[0].datetime).toBeDefined()
    })
  })
})
