import Team from '../Team/Team'
import Match from './Match'

/* eslint-disable no-undef */
describe('Testing Match model', () => {
  let homeMatch = null
  let awayMatch = null
  let restingMatch = null

  beforeAll(() => {
    const premierFTeam = new Team('ESCOLA DE FUTBOL PREMIER BARCELONA F', 'Benjamín')
    const donBoscoTeam = new Team('DON BOSCO, C.F. A', 'Benjamín')
    const imperioTeam = new Team('IMPERIO , C.F. A', 'Benjamín')
    homeMatch = new Match(premierFTeam, donBoscoTeam)
    awayMatch = new Match(imperioTeam, premierFTeam)
    restingMatch = new Match(premierFTeam, null)
  })

  test('Teams are correctly set', () => {
    expect(homeMatch.homeTeam).not.toBeUndefined()
    expect(homeMatch.awayTeam).not.toBeUndefined()
    expect(homeMatch.homeTeam.name).toBe('ESCOLA DE FUTBOL PREMIER BARCELONA F')
    expect(homeMatch.awayTeam.name).toBe('DON BOSCO, C.F. A')
  })

  test('Date and time is correctly set', () => {
    homeMatch.setDatetime(new Date(Date.UTC(2021, 9, 16, 17, 0)))
    expect(homeMatch.datetime.toUTCString()).toBe('Sat, 16 Oct 2021 17:00:00 GMT')
    expect(homeMatch.date).toBe('SÁB 16 OCT')
    expect(homeMatch.time).toBe('17:00h')
  })

  test('When Premier is awayTeam then the match is away, otherwise is not', () => {
    expect(homeMatch.isAway).toBeFalsy()
    expect(awayMatch.isAway).toBeTruthy()
  })

  test('Home match rival is retired, away is not', () => {
    expect(homeMatch.isRivalRetired).toBeTruthy()
    expect(awayMatch.isRivalRetired).toBeFalsy()
  })

  test('When Premier is the only team, then is resting', () => {
    expect(restingMatch.isResting).toBeTruthy()
  })
})
