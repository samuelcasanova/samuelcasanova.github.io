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

export function listTeams (equipos) {
  const teamsByCode = new Map()
  for (const { value, label } of equipos) {
    if (!teamsByCode.has(value)) {
      teamsByCode.set(value, { code: value, name: label })
    }
  }
  return [...teamsByCode.values()].sort((a, b) => a.name.localeCompare(b.name))
}
