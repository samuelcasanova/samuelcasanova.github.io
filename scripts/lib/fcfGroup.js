import { getDisplayName } from './displayName.js'

const CREST_BASE_URL = 'https://files.fcf.cat/escudos/clubes/escudos/'
const TEAM_PAGE_BASE_URL = 'https://www.fcf.cat/ca/clubs/'
const USED_MATCH_FIELDS = [
  'JORNADA', 'COMIENZO1', 'CAMPO', 'GOLES_CASA', 'GOLES_FUERA',
  'CODEQUIPO_CASA', 'CODCLUB_CASA', 'NOMBRE_CASA', 'ESCUDO_CASA',
  'CODEQUIPO_FUERA', 'CODCLUB_FUERA', 'NOMBRE_FUERA', 'ESCUDO_FUERA'
]

export function grupIdOf (competicioUrl) {
  const grupId = new URL(competicioUrl).searchParams.get('grupId')
  if (!grupId) {
    throw new Error(`No grupId in ${competicioUrl}`)
  }
  return grupId
}

export function trimGroup ({ partidos, equipos }) {
  const pickUsedFields = match => Object.fromEntries(USED_MATCH_FIELDS.map(field => [field, match[field] ?? null]))
  return {
    partidos: Object.fromEntries(Object.entries(partidos).map(([matchday, matches]) => [matchday, matches.map(pickUsedFields)])),
    equipos: listTeams(equipos).map(team => ({ value: team.code, label: team.name }))
  }
}

export function buildGroupMatches ({ group, footballerName, team, clubName }) {
  const groupTeams = listTeams(group.equipos)
  const matches = flattenMatches(group.partidos)
  const clubTeam = findClubTeam(groupTeams, clubName, team.teamName)
  const retiredCodes = findRetiredTeamCodes(groupTeams, matches)
  const describe = groupTeam => describeTeam(groupTeam, matches, team.competicioUrl, retiredCodes)
  const teamsByCode = new Map(groupTeams.map(groupTeam => [groupTeam.code, describe(groupTeam)]))
  const teamOf = (code, name) => isRestTeamName(name) ? null : teamsByCode.get(code) ?? describe({ code, name })

  return {
    teams: [...teamsByCode.values()],
    clubTeamUrl: teamsByCode.get(clubTeam.code).url,
    matches: matches
      .filter(match => match.CODEQUIPO_CASA === clubTeam.code || match.CODEQUIPO_FUERA === clubTeam.code)
      .map(match => {
        const homeTeam = teamOf(match.CODEQUIPO_CASA, match.NOMBRE_CASA)
        const awayTeam = teamOf(match.CODEQUIPO_FUERA, match.NOMBRE_FUERA)
        const isAway = match.CODEQUIPO_FUERA === clubTeam.code
        const [date, clock] = match.COMIENZO1.split(' ')
        const isPlayed = match.GOLES_CASA != null && match.GOLES_FUERA != null
        return {
          footballer: footballerName,
          matchday: match.JORNADA,
          date,
          time: clock.substring(0, 5),
          homeTeam: homeTeam && toMatchTeam(homeTeam),
          awayTeam: awayTeam && toMatchTeam(awayTeam),
          fieldName: homeTeam && awayTeam ? match.CAMPO : null,
          isAway,
          isRivalRetired: (isAway ? homeTeam : awayTeam)?.isRetired ?? false,
          result: isPlayed ? `${match.GOLES_CASA} - ${match.GOLES_FUERA}` : null
        }
      })
  }
}

export function listTeams (equipos) {
  const teamsByCode = new Map()
  for (const { value, label } of equipos) {
    if (!teamsByCode.has(value)) {
      teamsByCode.set(value, { code: value, name: label })
    }
  }
  return [...teamsByCode.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function flattenMatches (partidos) {
  return Object.values(partidos)
    .flat()
    .sort((a, b) => Number(a.JORNADA) - Number(b.JORNADA) || a.COMIENZO1.localeCompare(b.COMIENZO1))
}

export function isRestTeamName (name) {
  return name?.trim().toLowerCase() === 'descans'
}

// A team that withdraws before the season stays in equipos, but FCF renames its fixture slot to "Descans".
export function findRetiredTeamCodes (groupTeams, matches) {
  const playingCodes = new Set()
  for (const match of matches) {
    if (!isRestTeamName(match.NOMBRE_CASA)) playingCodes.add(match.CODEQUIPO_CASA)
    if (!isRestTeamName(match.NOMBRE_FUERA)) playingCodes.add(match.CODEQUIPO_FUERA)
  }
  return new Set(groupTeams.filter(team => !playingCodes.has(team.code)).map(team => team.code))
}

export function findClubTeam (groupTeams, clubName, teamName) {
  const searchedName = (teamName ?? clubName).toUpperCase()
  const candidates = groupTeams.filter(team => team.name.toUpperCase().includes(searchedName))
  if (candidates.length !== 1) {
    const found = candidates.map(team => team.name).join(', ') || 'none'
    const all = groupTeams.map(team => team.name).join(' | ')
    throw new Error(`Expected one team matching "${teamName ?? clubName}" in the group, found: ${found}. ` +
      `Set teamName in season.config.json to one of: ${all}`)
  }
  return candidates[0]
}

function describeTeam (team, matches, competicioUrl, retiredCodes) {
  const { escudo, clubCode } = findTeamSide(team, matches)
  return {
    name: team.name,
    displayName: getDisplayName(team.name),
    logoUrl: escudo ? toCrestUrl(escudo) : '',
    url: clubCode ? `${TEAM_PAGE_BASE_URL}${clubCode}/categories/${team.code}` : competicioUrl,
    isRetired: retiredCodes.has(team.code)
  }
}

function toMatchTeam ({ displayName, logoUrl, url }) {
  return { displayName, logoUrl, url }
}

function findTeamSide (team, matches) {
  for (const match of matches) {
    if (match.CODEQUIPO_CASA === team.code && !isRestTeamName(match.NOMBRE_CASA)) {
      return { escudo: match.ESCUDO_CASA, clubCode: match.CODCLUB_CASA }
    }
    if (match.CODEQUIPO_FUERA === team.code && !isRestTeamName(match.NOMBRE_FUERA)) {
      return { escudo: match.ESCUDO_FUERA, clubCode: match.CODCLUB_FUERA }
    }
  }
  return {}
}

function toCrestUrl (escudo) {
  return escudo.startsWith('http') ? escudo : CREST_BASE_URL + escudo
}
