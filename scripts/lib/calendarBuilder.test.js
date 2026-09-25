// @vitest-environment node
import { buildCalendars, groupIntoWeeks } from './calendarBuilder.js'

const config = {
  calendars: [
    { name: 'home', label: 'Calendario Peques', path: '/', footballerNames: ['Alex', 'Victor'] },
    { name: 'mister', label: 'Calendario Míster', path: '/mister', footballerNames: ['Loupes'] }
  ],
  footballers: [
    { name: 'Alex', imageUrl: '/footballers/Alex.png', ageGroup: 'Cadetes', teams: [{ category: 'Alex', competicioUrl: 'https://fcf/alex' }] },
    { name: 'Victor', imageUrl: '/footballers/Victor.png', teams: [{ category: 'Victor', competicioUrl: 'https://fcf/victor' }] },
    { name: 'Loupes', imageUrl: '/footballers/Loupes.png', teams: [{ category: 'Míster', competicioUrl: 'https://fcf/loupes' }] }
  ]
}

const team = displayName => ({ displayName, logoUrl: '', url: '' })

function match (footballer, date, time, home, away, extra = {}) {
  return {
    footballer,
    matchday: '1',
    date,
    time,
    homeTeam: home && team(home),
    awayTeam: away && team(away),
    fieldName: 'CAMP MUNICIPAL',
    isAway: away?.startsWith('Premier') ?? false,
    ...extra
  }
}

const weeksOf = matches => buildCalendars(config, matches).calendars[0].weeks
const names = week => week.matches.map(m => `${m.homeTeam?.displayName} - ${m.awayTeam?.displayName}`)

describe('Merging the matches of several footballers into weeks', () => {
  const weeks = weeksOf([
    match('Alex', '2021-10-09', '11:00', 'Premier F', 'Barcino D'),
    match('Alex', '2021-10-16', '11:00', 'Premier F', 'Sarrià B'),
    match('Alex', '2021-10-23', '09:00', 'Horta C', 'Premier F'),
    match('Alex', '2021-10-31', '12:00', 'Premier F', 'Llefià'),
    match('Victor', '2021-10-09', '11:30', 'Parets C', 'Premier D'),
    match('Victor', '2021-10-17', '11:00', 'Premier D', 'Granja Vella'),
    match('Victor', '2021-10-23', '13:00', 'Barcino A', 'Premier D')
  ])

  test('matches are grouped into one week per ISO week', () => {
    expect(weeks).toHaveLength(4)
  })

  test('each week holds its matches sorted by time', () => {
    expect(names(weeks[0])).toEqual(['Premier F - Barcino D', 'Parets C - Premier D'])
    expect(names(weeks[1])).toEqual(['Premier F - Sarrià B', 'Premier D - Granja Vella'])
    expect(names(weeks[2])).toEqual(['Horta C - Premier F', 'Barcino A - Premier D'])
    expect(names(weeks[3])).toEqual(['Premier F - Llefià'])
  })

  test('a week ends one hour after the start of its last match', () => {
    expect(weeks[0].endsAt).toBe('2021-10-09T10:30:00.000Z')
  })

  test('each calendar only has the matches of its footballers', () => {
    const { calendars } = buildCalendars(config, [
      match('Alex', '2021-10-09', '11:00', 'Premier F', 'Barcino D'),
      match('Loupes', '2021-10-09', '12:00', 'Guineueta A', 'Europa A')
    ])
    expect(calendars.map(calendar => calendar.weeks.flatMap(week => week.matches.map(m => m.footballer))))
      .toEqual([['Alex'], ['Loupes']])
  })
})

describe('Describing a week', () => {
  const saturdayHome = match('Alex', '2021-10-16', '10:00', 'Premier F', 'Bufalà B')
  const saturdayAwayAnHourLater = match('Victor', '2021-10-16', '11:00', 'Martinenc E', 'Premier D')
  const sundayAway = match('Alex', '2021-10-17', '10:00', 'Martinenc E', 'Premier F')

  test('the title is the matchday of its first match and its match days', () => {
    expect(weeksOf([saturdayHome])[0].title).toBe('Jornada 1 SÁB')
    expect(weeksOf([saturdayHome, saturdayAwayAnHourLater])[0].title).toBe('Jornada 1 SÁB')
    expect(weeksOf([saturdayHome, saturdayAwayAnHourLater, sundayAway])[0].title).toBe('Jornada 1 SÁB+DOM')
  })

  test('without matchday the title is only the match days', () => {
    expect(weeksOf([{ ...saturdayHome, matchday: undefined }])[0].title).toBe('SÁB')
  })

  test('one match is never problematic', () => {
    expect(weeksOf([saturdayHome])[0].isProblematic).toBe(false)
  })

  test('two matches the same day less than 3 hours apart, one of them away, are problematic', () => {
    expect(weeksOf([saturdayHome, saturdayAwayAnHourLater])[0].isProblematic).toBe(true)
    expect(weeksOf([saturdayHome, saturdayAwayAnHourLater, sundayAway])[0].isProblematic).toBe(true)
  })

  test('a rest week is never problematic', () => {
    const resting = match('Alex', '2021-10-16', '10:00', 'Premier D', null)
    expect(weeksOf([resting, saturdayAwayAnHourLater])[0].isProblematic).toBe(false)
  })

  test('a match against a retired rival is never problematic', () => {
    const retired = { ...saturdayHome, isRivalRetired: true }
    expect(weeksOf([retired, saturdayAwayAnHourLater])[0].isProblematic).toBe(false)
  })
})

describe('Preparing a match to render', () => {
  const [week] = weeksOf([match('Alex', '2021-10-16', '10:00', 'Premier F', null)])
  const [prepared] = week.matches

  test('date and time labels are ready in Spanish', () => {
    expect(prepared.dateLabel).toBe('SÁB 16 OCT')
    expect(prepared.timeLabel).toBe('10:00h')
  })

  test('the start time carries the Madrid offset, summer and winter', () => {
    expect(prepared.startsAt).toBe('2021-10-16T10:00:00+02:00')
    const [winterWeek] = weeksOf([match('Alex', '2021-11-06', '10:00', 'Premier F', 'Llefià')])
    expect(winterWeek.matches[0].startsAt).toBe('2021-11-06T10:00:00+01:00')
  })

  test('a match without rival is resting', () => {
    expect(prepared.isResting).toBe(true)
  })

  test('the field links to a map search', () => {
    expect(prepared.fieldMapUrl).toBe('https://www.google.com/maps/search/?api=1&query=CAMP%20MUNICIPAL')
  })

  test('optional fields of a hand-written match get defaults', () => {
    const [handWritten] = weeksOf([{ footballer: 'Alex', date: '2021-10-16', time: '10:00', homeTeam: team('A'), awayTeam: team('B') }])[0].matches
    expect(handWritten).toMatchObject({ matchday: null, fieldName: null, fieldMapUrl: null, isAway: false, isRivalRetired: false, result: null })
  })

  test('a match of an unknown footballer is an error', () => {
    expect(() => weeksOf([match('Nobody', '2021-10-16', '10:00', 'A', 'B')])).toThrow(/"Nobody", who is not a footballer/)
  })

  test('a malformed date is an error', () => {
    expect(() => weeksOf([match('Alex', '16/10/2021', '10:00', 'A', 'B')])).toThrow(/YYYY-MM-DD/)
  })
})

describe('Data for the rest of the portal', () => {
  const { footballers, standings } = buildCalendars(config, [])

  test('footballers are keyed by name, with their stats link and age group', () => {
    expect(footballers.Alex).toEqual({ name: 'Alex', imageUrl: '/footballers/Alex.png', statsUrl: 'https://fcf/alex', ageGroup: 'Cadetes' })
    expect(footballers.Victor).not.toHaveProperty('ageGroup')
  })

  test('there is one standings link per footballer team, opening the calendari tab', () => {
    expect(standings).toEqual([
      { label: 'Clasificación Alex', url: 'https://fcf/alex?tab=calendari' },
      { label: 'Clasificación Victor', url: 'https://fcf/victor?tab=calendari' },
      { label: 'Clasificación Míster', url: 'https://fcf/loupes?tab=calendari' }
    ])
  })

  test('a competicio URL that already has a tab gets it replaced', () => {
    const withTabConfig = { ...config, footballers: [{ ...config.footballers[0], teams: [{ category: 'Alex', competicioUrl: 'https://fcf/alex?grupId=1&tab=classificacio' }] }] }
    expect(buildCalendars(withTabConfig, []).standings[0].url).toBe('https://fcf/alex?grupId=1&tab=calendari')
  })

  test('no matches give no weeks', () => {
    expect(groupIntoWeeks([])).toEqual([])
  })
})
