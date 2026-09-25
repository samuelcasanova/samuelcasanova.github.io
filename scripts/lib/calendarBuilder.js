const HOUR_MS = 60 * 60 * 1000
const MATCH_DURATION_MS = HOUR_MS
const CLOSE_MATCHES_MS = 3 * HOUR_MS
const MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query='

const madridOffsetFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', timeZoneName: 'longOffset' })
const dateLabelFormat = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', weekday: 'short', day: '2-digit', month: 'short' })
const weekdayFormat = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', weekday: 'short' })

export function buildCalendars (config, matches) {
  const footballers = Object.fromEntries(config.footballers.map(footballer => [footballer.name, {
    name: footballer.name,
    imageUrl: footballer.imageUrl,
    statsUrl: footballer.teams[0]?.competicioUrl ?? '',
    ...(footballer.ageGroup && { ageGroup: footballer.ageGroup })
  }]))

  const preparedMatches = matches
    .map(match => prepareMatch(match, footballers))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))

  return {
    calendars: config.calendars.map(({ name, label, path, footballerNames }) => ({
      name,
      label,
      path,
      weeks: groupIntoWeeks(preparedMatches.filter(match => footballerNames.includes(match.footballer)))
    })),
    footballers,
    standings: config.footballers.flatMap(footballer => footballer.teams.map(team => ({
      label: `Clasificación ${team.category}`,
      url: team.competicioUrl
    })))
  }
}

function prepareMatch (match, footballers) {
  if (!footballers[match.footballer]) {
    throw new Error(`Match on ${match.date} is for "${match.footballer}", who is not a footballer in season.config.json`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(match.date) || !/^\d{2}:\d{2}$/.test(match.time)) {
    throw new Error(`Match of ${match.footballer} needs date as YYYY-MM-DD and time as HH:MM, got "${match.date}" "${match.time}"`)
  }
  const homeTeam = match.homeTeam ?? null
  const awayTeam = match.awayTeam ?? null
  const fieldName = match.fieldName ?? null
  return {
    footballer: match.footballer,
    matchday: match.matchday ?? null,
    date: match.date,
    time: match.time,
    homeTeam,
    awayTeam,
    fieldName,
    isAway: match.isAway ?? false,
    isRivalRetired: match.isRivalRetired ?? false,
    result: match.result ?? null,
    startsAt: toMadridDateTime(match.date, match.time),
    dateLabel: dateLabelFormat.format(utcDay(match.date)).toUpperCase().replace(/[.,]/g, ''),
    timeLabel: `${match.time}h`,
    isResting: !homeTeam || !awayTeam,
    fieldMapUrl: fieldName ? MAPS_SEARCH_URL + encodeURIComponent(fieldName) : null
  }
}

export function groupIntoWeeks (sortedMatches) {
  const weeks = []
  let weekKey = null
  for (const match of sortedMatches) {
    const matchWeekKey = isoWeekKey(match.date)
    if (matchWeekKey !== weekKey) {
      weeks.push([])
      weekKey = matchWeekKey
    }
    weeks.at(-1).push(match)
  }
  return weeks.map(describeWeek)
}

function describeWeek (matches) {
  const weekdays = []
  let isProblematic = false
  matches.forEach((match, index) => {
    const previous = matches[index - 1]
    if (!previous || previous.date !== match.date) {
      weekdays.push(weekdayFormat.format(utcDay(match.date)).toUpperCase().substring(0, 3))
    }
    if (previous && areProblematic(previous, match)) {
      isProblematic = true
    }
  })
  const matchday = matches[0].matchday
  return {
    title: [matchday && `Jornada ${matchday}`, weekdays.join('+')].filter(Boolean).join(' '),
    endsAt: new Date(Date.parse(matches.at(-1).startsAt) + MATCH_DURATION_MS).toISOString(),
    isProblematic,
    matches
  }
}

function areProblematic (first, second) {
  return !first.isResting && !second.isResting &&
    !first.isRivalRetired && !second.isRivalRetired &&
    first.date === second.date &&
    Date.parse(second.startsAt) - Date.parse(first.startsAt) < CLOSE_MATCHES_MS &&
    (first.isAway || second.isAway)
}

function utcDay (date) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function isoWeekKey (date) {
  const thursday = utcDay(date)
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7))
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1)
  const week = Math.ceil(((thursday - yearStart) / (24 * HOUR_MS) + 1) / 7)
  return `${thursday.getUTCFullYear()}-W${week}`
}

function toMadridDateTime (date, time) {
  const offset = madridOffsetFormat.formatToParts(new Date(`${date}T${time}:00Z`))
    .find(part => part.type === 'timeZoneName').value.replace('GMT', '')
  return `${date}T${time}:00${offset || '+00:00'}`
}
