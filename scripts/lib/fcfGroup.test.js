// @vitest-environment node
import group from './fixtures/group-59724598.json' with { type: 'json' }
import { buildGroupMatches, findClubTeam, findRetiredTeamCodes, flattenMatches, parseKickoff } from './fcfGroup.js'
import { listTeams } from './fcfResponse.js'

const COMPETICIO_URL = 'https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308233&competicioId=58780268&grupId=59724598'
const CARMELO_C_CODE = '58652671'
const PREMIER_D_URL = 'https://www.fcf.cat/ca/clubs/15548283/categories/54313684'

describe('fcfGroup', () => {
  const groupTeams = listTeams(group.equipos)
  const matches = flattenMatches(group.partidos)

  test('the kick-off is split into date and time, each null when FCF does not give it', () => {
    expect(parseKickoff('2026-10-04 20:00:00')).toEqual({ date: '2026-10-04', time: '20:00' })
    expect(parseKickoff('2026-10-04T20:00:00')).toEqual({ date: '2026-10-04', time: '20:00' })
    expect(parseKickoff('2026-10-04')).toEqual({ date: '2026-10-04', time: null })
    expect(parseKickoff('')).toEqual({ date: null, time: null })
    expect(parseKickoff(null)).toEqual({ date: null, time: null })
  })

  test('matches without kick-off are still sorted by matchday', () => {
    const partidos = { 2: [{ JORNADA: '2', COMIENZO1: null }, { JORNADA: '2', COMIENZO1: '2026-10-10 15:30:00' }], 1: [{ JORNADA: '1', COMIENZO1: null }] }
    expect(flattenMatches(partidos).map(match => match.JORNADA)).toEqual(['1', '2', '2'])
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

    test('every team of the group is described, linking to its team page, with retired teams flagged', () => {
      const { teams } = build()
      expect(teams).toHaveLength(14)
      expect(teams.find(team => team.name === 'ESCOLA DE FUTBOL PREMIER BARCELONA D')).toEqual({
        name: 'ESCOLA DE FUTBOL PREMIER BARCELONA D',
        displayName: 'Premier D',
        logoUrl: expect.stringMatching(/^https:\/\/files\.fcf\.cat\/escudos\/clubes\/escudos\/.+/),
        url: PREMIER_D_URL,
        isRetired: false
      })
    })

    test('a retired team has no crest and links to the group, since it never plays', () => {
      expect(build().teams.find(team => team.name === 'CARMELO, C.D. C'))
        .toMatchObject({ isRetired: true, logoUrl: '', url: COMPETICIO_URL })
    })

    test('the club team page is returned for the footballer', () => {
      expect(build().clubTeamUrl).toBe(PREMIER_D_URL)
    })

    test('only the club team matches are kept, ready to render', () => {
      const { matches: built } = build()
      expect(built.map(match => match.matchday)).toEqual(['1', '2', '3', '4'])
      expect(built[0]).toEqual({
        footballer: 'Alex',
        matchday: '1',
        date: '2026-10-04',
        time: '20:00',
        homeTeam: { displayName: 'Premier D', logoUrl: expect.any(String), url: PREMIER_D_URL },
        awayTeam: { displayName: 'Pia Sarrià A', logoUrl: expect.any(String), url: 'https://www.fcf.cat/ca/clubs/15544315/categories/58148497' },
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

    function withFirstKickoff (comienzo) {
      const changed = structuredClone(group)
      changed.partidos['1'].find(match => match.NOMBRE_CASA.includes('PREMIER')).COMIENZO1 = comienzo
      return changed
    }

    test('a match without kick-off time keeps its date and has no time', () => {
      expect(build(withFirstKickoff('2026-10-04')).matches[0]).toMatchObject({ matchday: '1', date: '2026-10-04', time: null })
    })

    test('a match without date is left out with a warning, since it belongs to no week', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(build(withFirstKickoff('')).matches.map(match => match.matchday)).toEqual(['2', '3', '4'])
      expect(warn).toHaveBeenCalledWith(expect.stringMatching(/matchday 1 of Alex: no date in COMIENZO1 ""/))
      warn.mockRestore()
    })

    test('a played match carries its result', () => {
      const played = structuredClone(group)
      Object.assign(played.partidos['1'].find(match => match.NOMBRE_CASA.includes('PREMIER')), { GOLES_CASA: '3', GOLES_FUERA: '1' })
      expect(build(played).matches[0].result).toBe('3 - 1')
    })
  })
})
