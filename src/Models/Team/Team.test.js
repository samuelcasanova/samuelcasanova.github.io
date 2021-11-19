import Team from './Team'

/* eslint-disable no-undef */
describe('Testing Team model', () => {
  let homeTeam = null
  let awayTeam = null
  let nonExistingTeam = null

  beforeAll(() => {
    homeTeam = new Team('ESCOLA DE FUTBOL PREMIER BARCELONA D', 'Pre-benjamín')
    awayTeam = new Team('MONTAÑESA, C.F. C', 'Pre-benjamín')
    nonExistingTeam = new Team('NON EXISTING')
  })

  test('Team names are correctly set', () => {
    expect(homeTeam.name).toBe('ESCOLA DE FUTBOL PREMIER BARCELONA D')
    expect(awayTeam.name).toBe('MONTAÑESA, C.F. C')
    expect(nonExistingTeam.name).toBe('NON EXISTING')
  })

  test('Team calendar Urls are correctly set', () => {
    expect(homeTeam.calendarUrl).toBe('https://www.fcf.cat/calendari-equip/2022/futbol-7/prebenjami-7/grup-18/escola-de-futbol-premier-barcelona-d')
  })

  test('Team fields are correctly matched', () => {
    expect(homeTeam.fieldName).not.toBeUndefined()
    expect(homeTeam.fieldName).toBe('CAMP DE FUTBOL MPAL. VALL D\'HEBRON')
    expect(awayTeam.fieldName).toBeUndefined()
  })

  test('Team display name is taken from config if exists', () => {
    expect(homeTeam.displayName).not.toBeUndefined()
    expect(homeTeam.displayName).toBe('Premier D')
  })

  test('If a team name doesnt exist then field Name is the same as the team name', () => {
    expect(nonExistingTeam.fieldName).not.toBeUndefined()
    expect(nonExistingTeam.fieldName).toBe('NON EXISTING')
  })

  test('If a team name doesnt exists then the display name is calculated automatically', () => {
    expect(nonExistingTeam.displayName).not.toBeUndefined()
    expect(nonExistingTeam.displayName).toBe('Non Existing')
  })

  test('Team name should have value, otherwise an Error is thrown', () => {
    try {
      // eslint-disable-next-line no-new
      new Team('')
    } catch (exception) {
      expect(exception).toBeInstanceOf(Error)
    }
  })

  test('Team Montañesa is retired', () => {
    expect(awayTeam.isRetired).toBeTruthy()
  })
})
