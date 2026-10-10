const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const MATCH_DURATION_MS = HOUR_MS
const CLOSE_MATCHES_MS = 3 * HOUR_MS
const MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query='
const UNCONFIRMED_TIME_LABEL = 'Hora por confirmar'

const madridOffsetFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', timeZoneName: 'longOffset' })
const dateLabelFormat = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', weekday: 'short', day: '2-digit', month: 'short' })
const weekdayFormat = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', weekday: 'short' })

export function buildCalendars (config, matches, statsUrls = {}) {
  const footballers = Object.fromEntries(config.footballers.map(footballer => [footballer.name, {
    name: footballer.name,
    imageUrl: footballer.imageUrl,
    statsUrl: statsUrls[footballer.name] ?? footballer.teams[0]?.competicioUrl ?? '',
    ...(footballer.ageGroup && { ageGroup: footballer.ageGroup })
  }]))

  const preparedMatches = matches
    .map(match => prepareMatch(match, footballers))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

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
      url: withTab(team.competicioUrl, 'classificacio')
    })))
  }
}

function withTab (competicioUrl, tab) {
  const url = new URL(competicioUrl)
  url.searchParams.set('tab', tab)
  return url.toString()
}

// A match without a confirmed time goes after the timed matches of its day.
const sortKey = match => `${match.date} ${match.time ?? '24:00'}`

function prepareMatch (match, footballers) {
  if (!footballers[match.footballer]) {
    throw new Error(`Match on ${match.date} is for "${match.footballer}", who is not a footballer in season.config.json`)
  }
  const time = match.time ?? null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(match.date) || (time !== null && !/^\d{2}:\d{2}$/.test(time))) {
    throw new Error(`Match of ${match.footballer} needs date as YYYY-MM-DD and time as HH:MM, or no time while it is ` +
      `unconfirmed, got "${match.date}" "${match.time}"`)
  }
  const homeTeam = match.homeTeam ?? null
  const awayTeam = match.awayTeam ?? null
  const fieldName = match.fieldName ?? null
  return {
    footballer: match.footballer,
    matchday: match.matchday ?? null,
    date: match.date,
    time,
    homeTeam,
    awayTeam,
    fieldName,
    isAway: match.isAway ?? false,
    isRivalRetired: match.isRivalRetired ?? false,
    result: match.result ?? null,
    startsAt: time && toMadridDateTime(match.date, time),
    dateLabel: dateLabelFormat.format(utcDay(match.date)).toUpperCase().replace(/[.,]/g, ''),
    timeLabel: time ? `${time}h` : UNCONFIRMED_TIME_LABEL,
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
    endsAt: new Date(Math.max(...matches.map(endOf))).toISOString(),
    isProblematic,
    matches
  }
}

// Without a confirmed time the match can still be played at any time of its day.
function endOf (match) {
  return match.startsAt
    ? Date.parse(match.startsAt) + MATCH_DURATION_MS
    : Date.parse(toMadridDateTime(match.date, '23:59')) + MINUTE_MS
}

function areProblematic (first, second) {
  return !first.isResting && !second.isResting &&
    first.startsAt !== null && second.startsAt !== null &&
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
