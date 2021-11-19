import Week from './Week'
import Match from '../../Models/Match/Match'
import Team from '../Team/Team'

/* eslint-disable no-undef */
describe('Testing week model', () => {
  let week = null
  let match1 = null
  let match2 = null
  let match3 = null

  beforeAll(() => {
    const premierFTeam = new Team('ESCOLA DE FUTBOL PREMIER BARCELONA F', 'Benjamín')
    const bufalaTeam = new Team('BUFALÀ, C.F. B', 'Benjamín')

    const premierDTeam = new Team('ESCOLA DE FUTBOL PREMIER BARCELONA D', 'Pre-benjamín')
    const martinencETeam = new Team('MARTINENC, F.C. E', 'Pre-benjamín')
    match1 = new Match(premierFTeam, bufalaTeam)
    match1.setDatetime(new Date(Date.UTC(2021, 9, 16, 10, 0)))
    match2 = new Match(martinencETeam, premierDTeam)
    match2.setDatetime(new Date(Date.UTC(2021, 9, 16, 11, 0)))
    match3 = new Match(martinencETeam, premierFTeam)
    match3.setDatetime(new Date(Date.UTC(2021, 9, 17, 10, 0)))
  })

  test('Matches array is correctly initialized', () => {
    week = new Week(20)
    expect(week.matches).toHaveLength(0)
  })

  describe('Inserting a first match', () => {
    beforeAll(() => {
      week = new Week(20)
      week.addMatch(match1)
    })

    test('Match is correctly inserted in the collection', () => {
      expect(week.matches).toHaveLength(1)
    })

    test('Short description is updated correctly', () => {
      expect(week.shortDescription).toBe('SÁB')
    })

    test('With one match the week is not problematic', () => {
      expect(week.isProblematic).toBeFalsy()
    })
  })

  describe('Inserting a second match', () => {
    beforeAll(() => {
      week = new Week(20)
      week.addMatch(match1)
      week.addMatch(match2)
    })

    test('Match is correctly inserted in the collection', () => {
      expect(week.matches).toHaveLength(2)
    })

    test('Short description is updated correctly', () => {
      expect(week.shortDescription).toBe('SÁB')
    })

    test('With the second match the week is problematic', () => {
      expect(week.isProblematic).toBeTruthy()
    })
  })

  describe('Inserting a third match', () => {
    beforeAll(() => {
      week = new Week(20)
      week.addMatch(match1)
      week.addMatch(match2)
      week.addMatch(match3)
    })

    test('Match is correctly inserted in the collection', () => {
      expect(week.matches).toHaveLength(3)
    })

    test('Short description is updated correctly', () => {
      expect(week.shortDescription).toBe('SÁB+DOM')
    })

    test('With the second match the week is still problematic', () => {
      expect(week.isProblematic).toBeTruthy()
    })
  })

  describe('Other potentially problematic scenarios', () => {
    test('With a resting matchday a week cant be problematic', () => {
      week = new Week(20)
      week.addMatch(match2)
      const restingMatch = new Match(new Team('Premier D'), null)
      restingMatch.setDatetime(new Date(Date.UTC(2021, 9, 16, 10, 0)))
      week.addMatch(restingMatch)
      expect(week.isProblematic).toBeFalsy()
    })

    test('With a retired team cant be problematic', () => {
      week = new Week(20)
      week.addMatch(match2)
      const premierDTeam = new Team('ESCOLA DE FUTBOL PREMIER BARCELONA D', 'Pre-benjamín')
      const retiredTeam = new Team('MONTAÑESA, C.F. C', 'Pre-benjamín')
      const matchAgainstRetiredTeam = new Match(premierDTeam, retiredTeam)
      matchAgainstRetiredTeam.setDatetime(new Date(Date.UTC(2021, 9, 16, 10, 0)))
      week.addMatch(matchAgainstRetiredTeam)
      expect(week.isProblematic).toBeFalsy()
    })
  })
})
