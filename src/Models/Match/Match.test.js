import Match from './Match'

/* eslint-disable no-undef */
describe('Testing Match model', () => {
  let homeMatch = null
  let awayMatch = null
  let restingMatch = null

  beforeAll(() => {
    homeMatch = new Match('Premier F', 'Don Bosco, C.f. A')
    awayMatch = new Match('Barcino D', 'Premier F')
    restingMatch = new Match('Premier D', '')
  })

  test('Teams are correctly set', () => {
    expect(homeMatch.homeTeam).toBe('Premier F')
    expect(homeMatch.awayTeam).toBe('Don Bosco, C.f. A')
  })

  test('Date and time is correctly set', () => {
    homeMatch.setDatetime(new Date(2021, 9, 16, 17, 0))
    expect(homeMatch.datetime.toUTCString()).toBe('Sat, 16 Oct 2021 15:00:00 GMT')
    expect(homeMatch.date).toBe('SÁB 16 OCT')
    expect(homeMatch.time).toBe('17:00h')
  })

  test('When Premier is awayTeam then the match is away, otherwise is not', () => {
    expect(homeMatch.isAway).toBeFalsy()
    expect(awayMatch.isAway).toBeTruthy()
  })

  test('When the rival is Don Bosco then is retired, otherwise is not', () => {
    expect(homeMatch.isRivalRetired).toBeTruthy()
    expect(awayMatch.isRivalRetired).toBeFalsy()
  })

  test('When Premier is the only team, then is resting', () => {
    expect(restingMatch.isResting).toBeTruthy()
  })
})
