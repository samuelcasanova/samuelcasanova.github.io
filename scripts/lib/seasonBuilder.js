import { getDisplayName } from './displayName.js'

const CREST_BASE_URL = 'https://files.fcf.cat/escudos/clubes/escudos/'

export function buildSeason (config, groupsByUrl) {
  const teamCategories = []
  const matchFootballers = []
  const footballers = []

  for (const footballer of config.footballers) {
    const matchTeams = []
    const footballerTeams = []
    for (const team of footballer.teams) {
      const { partidos, equipos } = groupsByUrl.get(team.competicioUrl)
      const groupTeams = listTeams(equipos)
      const matches = flattenMatches(partidos)
      const clubTeam = findClubTeam(groupTeams, config.clubName, team.teamName)
      const retiredCodes = findRetiredTeamCodes(groupTeams, matches)

      teamCategories.push({
        name: team.category,
        teams: groupTeams.map(groupTeam => describeTeam(groupTeam, matches, team.competicioUrl, retiredCodes))
      })
      matchTeams.push({ category: team.category, matches: buildMatchEntries(matches, clubTeam) })
      footballerTeams.push({ name: clubTeam.name, category: team.category, standingsUrl: team.competicioUrl })
    }
    matchFootballers.push({ name: footballer.name, teams: matchTeams })
    footballers.push({
      name: footballer.name,
      imageUrl: footballer.imageUrl,
      ...(footballer.ageGroup && { ageGroup: footballer.ageGroup }),
      statsUrl: footballer.teams[0]?.competicioUrl ?? '',
      teams: footballerTeams
    })
  }

  return {
    teams: { categories: teamCategories },
    matches: { footballers: matchFootballers },
    footballers: { footballers }
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
  const candidates = teamName
    ? groupTeams.filter(team => team.name === teamName)
    : groupTeams.filter(team => team.name.toUpperCase().includes(clubName.toUpperCase()))
  if (candidates.length !== 1) {
    const found = candidates.map(team => team.name).join(', ') || 'none'
    throw new Error(`Expected one team matching "${teamName ?? clubName}" in the group, found: ${found}. ` +
      'Set teamName in season.config.json to pick one.')
  }
  return candidates[0]
}

function describeTeam (team, matches, competicioUrl, retiredCodes) {
  return {
    name: team.name,
    displayName: getDisplayName(team.name),
    fieldName: mostFrequentHomeField(team, matches),
    calendarUrl: competicioUrl,
    logoUrl: findCrestUrl(team, matches),
    isRetired: retiredCodes.has(team.code)
  }
}

function mostFrequentHomeField (team, matches) {
  const counts = new Map()
  for (const match of matches) {
    if (match.CODEQUIPO_CASA === team.code && !isRestTeamName(match.NOMBRE_CASA) && match.CAMPO) {
      counts.set(match.CAMPO, (counts.get(match.CAMPO) ?? 0) + 1)
    }
  }
  let bestField = ''
  let bestCount = 0
  for (const [field, count] of counts) {
    if (count > bestCount) {
      bestField = field
      bestCount = count
    }
  }
  return bestField
}

function findCrestUrl (team, matches) {
  for (const match of matches) {
    if (match.CODEQUIPO_CASA === team.code && !isRestTeamName(match.NOMBRE_CASA) && match.ESCUDO_CASA) {
      return toCrestUrl(match.ESCUDO_CASA)
    }
    if (match.CODEQUIPO_FUERA === team.code && !isRestTeamName(match.NOMBRE_FUERA) && match.ESCUDO_FUERA) {
      return toCrestUrl(match.ESCUDO_FUERA)
    }
  }
  return ''
}

function toCrestUrl (escudo) {
  return escudo.startsWith('http') ? escudo : CREST_BASE_URL + escudo
}

export function buildMatchEntries (matches, clubTeam) {
  return matches
    .filter(match => match.CODEQUIPO_CASA === clubTeam.code || match.CODEQUIPO_FUERA === clubTeam.code)
    .map(match => {
      const [date, clock] = match.COMIENZO1.split(' ')
      const homeTeamName = isRestTeamName(match.NOMBRE_CASA) ? null : match.NOMBRE_CASA
      const awayTeamName = isRestTeamName(match.NOMBRE_FUERA) ? null : match.NOMBRE_FUERA
      const isPlayed = match.GOLES_CASA != null && match.GOLES_FUERA != null
      return {
        matchday: match.JORNADA,
        date,
        time: clock.substring(0, 5),
        homeTeamName,
        awayTeamName,
        result: isPlayed ? `${match.GOLES_CASA} - ${match.GOLES_FUERA}` : null,
        fieldName: homeTeamName && awayTeamName ? match.CAMPO : null
      }
    })
}
