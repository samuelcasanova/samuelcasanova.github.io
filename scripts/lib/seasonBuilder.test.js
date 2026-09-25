// @vitest-environment node
import group from './fixtures/group-59724598.json' with { type: 'json' }
import { buildSeason, buildMatchEntries, findClubTeam, findRetiredTeamCodes, flattenMatches, listTeams } from './seasonBuilder.js'

const COMPETICIO_URL = 'https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308233&competicioId=58780268&grupId=59724598'
const CARMELO_C_CODE = '58652671'

const config = {
  clubName: 'PREMIER BARCELONA',
  footballers: [{
    name: 'Alex',
    imageUrl: '/footballers/Alex.png',
    teams: [{ category: 'Alex', competicioUrl: COMPETICIO_URL }]
  }]
}

describe('seasonBuilder', () => {
  const groupTeams = listTeams(group.equipos)
  const matches = flattenMatches(group.partidos)

  test('equipos rows are deduplicated by team code', () => {
    expect(group.equipos.length).toBeGreaterThan(groupTeams.length)
    expect(groupTeams).toHaveLength(14)
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

  test('teamName picks the club team explicitly', () => {
    expect(findClubTeam(groupTeams, 'PREMIER BARCELONA', 'DON BOSCO, C.F. A').code).toBe('54535327')
  })

  test('no matching club team is an error', () => {
    expect(() => findClubTeam(groupTeams, 'NOT IN GROUP')).toThrow(/found: none/)
  })

  test('match entries hold local date and time, field and rest weeks as a null team', () => {
    const entries = buildMatchEntries(matches, findClubTeam(groupTeams, 'PREMIER BARCELONA'))
    expect(entries.map(entry => entry.matchday)).toEqual(['1', '2', '3', '4'])
    expect(entries[0]).toEqual({
      matchday: '1',
      date: '2026-10-04',
      time: '20:00',
      homeTeamName: 'ESCOLA DE FUTBOL PREMIER BARCELONA D',
      awayTeamName: 'ESCOLA PIA SARRIÀ S.E. A',
      result: null,
      fieldName: 'CAMP DE FUTBOL MPAL. VALL D´HEBRON'
    })
    expect(entries[2]).toMatchObject({ homeTeamName: 'ESCOLA DE FUTBOL PREMIER BARCELONA D', awayTeamName: null, fieldName: null })
  })

  test('a played match carries its result', () => {
    const played = { ...matches[0], CODEQUIPO_CASA: 'X', GOLES_CASA: '3', GOLES_FUERA: '1', CERRADA: '1' }
    expect(buildMatchEntries([played], { code: 'X' })[0].result).toBe('3 - 1')
  })

  test('the season has the portal teams, footballers and matches', () => {
    const season = buildSeason(config, new Map([[COMPETICIO_URL, group]]))

    const [category] = season.teams.categories
    expect(category.name).toBe('Alex')
    const premier = category.teams.find(team => team.name === 'ESCOLA DE FUTBOL PREMIER BARCELONA D')
    expect(premier).toEqual({
      name: 'ESCOLA DE FUTBOL PREMIER BARCELONA D',
      displayName: 'Premier D',
      fieldName: 'CAMP DE FUTBOL MPAL. VALL D´HEBRON',
      calendarUrl: COMPETICIO_URL,
      logoUrl: expect.stringMatching(/^https:\/\/files\.fcf\.cat\/escudos\/clubes\/escudos\/.+/),
      isRetired: false
    })
    expect(category.teams.find(team => team.name === 'CARMELO, C.D. C')).toMatchObject({ isRetired: true, logoUrl: '' })

    expect(season.footballers.footballers).toEqual([{
      name: 'Alex',
      imageUrl: '/footballers/Alex.png',
      statsUrl: COMPETICIO_URL,
      teams: [{ name: 'ESCOLA DE FUTBOL PREMIER BARCELONA D', category: 'Alex', standingsUrl: COMPETICIO_URL }]
    }])

    expect(season.matches.footballers[0].teams[0].matches).toHaveLength(4)
  })
})
