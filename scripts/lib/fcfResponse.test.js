// @vitest-environment node
import group from './fixtures/group-59724598.json' with { type: 'json' }
import { COMPETICIO_URL } from './fixtures/testRoot.js'
import { grupIdOf, listTeams, trimGroup } from './fcfResponse.js'

describe('fcfResponse', () => {
  test('the group id comes from the competicio URL', () => {
    expect(grupIdOf(COMPETICIO_URL)).toBe('59724598')
    expect(() => grupIdOf('https://www.fcf.cat/ca/competicio')).toThrow(/No grupId/)
  })

  test('equipos rows are deduplicated by team code', () => {
    expect(group.equipos.length).toBeGreaterThan(listTeams(group.equipos).length)
    expect(listTeams(group.equipos)).toHaveLength(14)
  })

  test('trimming keeps only the used fields and one row per team', () => {
    const trimmed = trimGroup(group)
    expect(Object.keys(trimmed.partidos['1'][0]).sort()).toEqual([
      'CAMPO', 'CODCLUB_CASA', 'CODCLUB_FUERA', 'CODEQUIPO_CASA', 'CODEQUIPO_FUERA', 'COMIENZO1', 'ESCUDO_CASA', 'ESCUDO_FUERA',
      'GOLES_CASA', 'GOLES_FUERA', 'JORNADA', 'NOMBRE_CASA', 'NOMBRE_FUERA'
    ])
    expect(trimmed.equipos).toHaveLength(14)
    expect(listTeams(trimmed.equipos)).toEqual(listTeams(group.equipos))
  })
})
