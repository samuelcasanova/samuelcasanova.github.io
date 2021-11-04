import Team from './Team'

/* eslint-disable no-undef */
describe('Testing Team model', () => {
  let homeTeam = null
  let awayTeam = null
  let nonExistingTeam = null

  beforeAll(() => {
    homeTeam = new Team('Premier D')
    awayTeam = new Team('DON BOSCO, C.F. A')
    nonExistingTeam = new Team('Non Existing')
  })

  test('Team names are correctly set', () => {
    expect(homeTeam.name).toBe('Premier D')
    expect(awayTeam.name).toBe('DON BOSCO, C.F. A')
    expect(nonExistingTeam.name).toBe('Non Existing')
  })

  test('Team fields are correctly matched', () => {
    expect(homeTeam.fieldName).not.toBeNull()
    expect(awayTeam.fieldName).not.toBeNull()
    expect(homeTeam.fieldName).toBe('CAMP DE FUTBOL MUNICIPAL VALL D\'HEBRON')
    expect(awayTeam.fieldName).toBe('CAMP DE FUTBOL ESCOLA INDUSTRIAL')
  })

  test('If a team name doesnt exist then field Name is the same as the team name', () => {
    expect(nonExistingTeam.fieldName).not.toBeNull()
    expect(nonExistingTeam.fieldName).toBe('Non Existing')
  })

  test('Team name should have value, otherwise an Error is thrown', () => {
    try {
      // eslint-disable-next-line no-new
      new Team('')
    } catch (exception) {
      expect(exception).toBeInstanceOf(Error)
    }
  })

  test('Team Don Bosco is retired', () => {
    expect(awayTeam.isRetired).toBeTruthy()
  })
})
