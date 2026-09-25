import Footballer from './Footballer'

vi.mock('./footballers.json', () => import('../../testFixtures/footballers.json'))
vi.mock('../Team/teams.json', () => import('../../testFixtures/teams.json'))

/* eslint-disable no-undef */
describe('Testing Footballer model', () => {
  let alex = null

  beforeAll(() => {
    alex = new Footballer('Alex')
  })

  test('Footballer name is correctly set', () => {
    expect(alex.name).not.toBeUndefined()
    expect(alex.name).toBe('Alex')
  })

  test('Footballer image Url is correctly set', () => {
    expect(alex.imageUrl).toBe('/footballers/Alex.png')
  })

  test('Footballer stats Url is correctly set', () => {
    expect(alex.statsUrl).toBe('https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308233&competicioId=58780268&grupId=59724598')
  })

  test('Footballer name should have value, otherwise an Error is thrown', () => {
    expect(() => new Footballer('')).toThrow(Error)
  })

  test('Footballer teams are read from the config, with their team data', () => {
    expect(alex.teams).toHaveLength(1)
    expect(alex.teams[0].name).toBe('ESCOLA DE FUTBOL PREMIER BARCELONA D')
    expect(alex.teams[0].displayName).toBe('Premier D')
  })
})
