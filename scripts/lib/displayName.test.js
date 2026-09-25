// @vitest-environment node
import { getDisplayName } from './displayName.js'

describe('getDisplayName', () => {
  test.each([
    ['ESCOLA DE FUTBOL PREMIER BARCELONA D', 'Premier D'],
    ["FUNDACIÓ ACADEMIA F. L'HOSPITALET  B", "L'Hospitalet B"],
    ['ESCOLA DE FUTBOL STOITCHKOV-RACING SARRIA  B', 'Racing Sarria B'],
    ['Pª BARC. CINC COPES A', 'Cinc Copes A'],
    ['HORTA, U.AT. C', 'Horta C'],
    ['ESCOLA FUTBOL ALMOGAVERS A', 'Almogavers A'],
    ['TARR, ASSOC.ESP.  A', 'Tarr A'],
    ['VILA OLIMPICA CLUB ESP. A', 'Vila Olímpica A'],
    ['FUNDACIO PRIVADA ASSOC. ESP. PRAT  A', 'Prat A'],
    ['ESCUELA F.SAN PEDRO SAN PABLO A', 'San Pedro San Pablo A']
  ])('%s → %s', (rawName, displayName) => {
    expect(getDisplayName(rawName)).toBe(displayName)
  })
})
