import Footballer from './Footballer'

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
    expect(alex.statsUrl).toBe('https://www.fcf.cat/jugador/2022/futbol-7/benjami-7-tercera-divisio/grup-6/42202112/41820009')
  })

  test('Footballer name should have value, otherwise an Error is thrown', () => {
    try {
      // eslint-disable-next-line no-new
      new Footballer('')
    } catch (exception) {
      expect(exception).toBeInstanceOf(Error)
    }
  })

  test('Can add a team to the footballer', () => {
    expect(alex.teams).toHaveLength(1)
    expect(alex.teams[0].name).toBe('ESCOLA DE FUTBOL PREMIER BARCELONA G')
  })
})
