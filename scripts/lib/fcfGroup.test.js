// @vitest-environment node
import group from './fixtures/group-59724598.json' with { type: 'json' }
import { buildGroupMatches, findClubTeam, findRetiredTeamCodes, flattenMatches, grupIdOf, listTeams, trimGroup } from './fcfGroup.js'

const COMPETICIO_URL = 'https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308233&competicioId=58780268&grupId=59724598'
const CARMELO_C_CODE = '58652671'

describe('fcfGroup', () => {
  const groupTeams = listTeams(group.equipos)
  const matches = flattenMatches(group.partidos)

  test('the group id comes from the competicio URL', () => {
    expect(grupIdOf(COMPETICIO_URL)).toBe('59724598')
    expect(() => grupIdOf('https://www.fcf.cat/ca/competicio')).toThrow(/No grupId/)
  })

  test('equipos rows are deduplicated by team code', () => {
    expect(group.equipos.length).toBeGreaterThan(groupTeams.length)
    expect(groupTeams).toHaveLength(14)
  })

  test('trimming keeps only the used fields and one row per team', () => {
    const trimmed = trimGroup(group)
    expect(Object.keys(trimmed.partidos['1'][0]).sort()).toEqual([
      'CAMPO', 'CODEQUIPO_CASA', 'CODEQUIPO_FUERA', 'COMIENZO1', 'ESCUDO_CASA', 'ESCUDO_FUERA',
      'GOLES_CASA', 'GOLES_FUERA', 'JORNADA', 'NOMBRE_CASA', 'NOMBRE_FUERA'
    ])
    expect(trimmed.equipos).toHaveLength(14)
    expect(listTeams(trimmed.equipos)).toEqual(groupTeams)
  })

  test('a team whose fixtures became Descans is the only retired team', () => {
    expect([...findRetiredTeamCodes(groupTeams, matches)]).toEqual([CARMELO_C_CODE])
  })

  test('no team is retired when every team plays under its own name', () => {
    const playingTeams = groupTeams.filter(team => team.code !== CARMELO_C_CODE)
    expect(findRetiredTeamCodes(playingTeams, matches).size).toBe(0)
  })

  test('the club team is the one team whose name contains the club name', () => {
    expect(findClubTeam(groupTeams, 'premier barcelona').name).toBe('ESCOLA DE FUTBOL PREMIER BARCELONA D')
  })

  test('teamName picks the team by part of its name instead of the club name', () => {
    expect(findClubTeam(groupTeams, 'PREMIER BARCELONA', 'don bosco').code).toBe('54535327')
  })

  test('no matching team is an error that lists the teams of the group', () => {
    expect(() => findClubTeam(groupTeams, 'NOT IN GROUP')).toThrow(/found: none.*DON BOSCO, C\.F\. A/)
  })

  test('more than one matching team is an error', () => {
    expect(() => findClubTeam(groupTeams, 'PREMIER BARCELONA', 'POBLE')).toThrow(/found: APA POBLE SEC, CE\. B, POBLE NOU, AT\. B/)
  })

  describe('building the footballer matches of the group', () => {
    const build = (buildGroup = group) => buildGroupMatches({
      group: buildGroup,
      footballerName: 'Alex',
      team: { category: 'Alex', competicioUrl: COMPETICIO_URL },
      clubName: 'PREMIER BARCELONA'
    })

    test('every team of the group is described, with retired teams flagged', () => {
      const { teams } = build()
      expect(teams).toHaveLength(14)
      expect(teams.find(team => team.name === 'ESCOLA DE FUTBOL PREMIER BARCELONA D')).toEqual({
        name: 'ESCOLA DE FUTBOL PREMIER BARCELONA D',
        displayName: 'Premier D',
        logoUrl: expect.stringMatching(/^https:\/\/files\.fcf\.cat\/escudos\/clubes\/escudos\/.+/),
        url: COMPETICIO_URL,
        isRetired: false
      })
      expect(teams.find(team => team.name === 'CARMELO, C.D. C')).toMatchObject({ isRetired: true, logoUrl: '' })
    })

    test('only the club team matches are kept, ready to render', () => {
      const { matches: built } = build()
      expect(built.map(match => match.matchday)).toEqual(['1', '2', '3', '4'])
      expect(built[0]).toEqual({
        footballer: 'Alex',
        matchday: '1',
        date: '2026-10-04',
        time: '20:00',
        homeTeam: { displayName: 'Premier D', logoUrl: expect.any(String), url: COMPETICIO_URL },
        awayTeam: { displayName: 'Pia Sarrià A', logoUrl: expect.any(String), url: COMPETICIO_URL },
        fieldName: 'CAMP DE FUTBOL MPAL. VALL D´HEBRON',
        isAway: false,
        isRivalRetired: false,
        result: null
      })
      expect(built[1].isAway).toBe(true)
    })

    test('a rest week has a null rival and no field', () => {
      expect(build().matches[2]).toMatchObject({ awayTeam: null, fieldName: null, isAway: false })
    })

    test('a played match carries its result', () => {
      const played = structuredClone(group)
      Object.assign(played.partidos['1'].find(match => match.NOMBRE_CASA.includes('PREMIER')), { GOLES_CASA: '3', GOLES_FUERA: '1' })
      expect(build(played).matches[0].result).toBe('3 - 1')
    })
  })
})
