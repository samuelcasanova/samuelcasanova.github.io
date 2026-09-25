// @vitest-environment node
import { getDisplayName } from './displayName.js'

describe('getDisplayName', () => {
  test.each([
    ['ESCOLA DE FUTBOL PREMIER BARCELONA D', 'Premier D'],
    ["FUNDACIÓ ACADEMIA F. L'HOSPITALET  B", "L'Hospitalet B"],
    ['ESCOLA DE FUTBOL STOITCHKOV-RACING SARRIA  B', 'Racing Sarria B'],
    ['Pª BARC. CINC COPES A', 'Cinc Copes A'],
    ['HORTA, U.AT. C', 'Horta C']
  ])('%s → %s', (rawName, displayName) => {
    expect(getDisplayName(rawName)).toBe(displayName)
  })
})
