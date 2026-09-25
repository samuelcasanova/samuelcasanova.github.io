import CalendarReaderService from './CalendarReaderService'
import matchesData from '../../testFixtures/matches.json'

vi.mock('../../Models/Footballer/footballers.json', () => import('../../testFixtures/footballers.json'))
vi.mock('../../Models/Team/teams.json', () => import('../../testFixtures/teams.json'))

function stubFetch (matches) {
  const responses = {
    'matches.json': matches,
    'applicationData.json': { additionalMatches: [] }
  }
  return vi.fn(async url => new Response(JSON.stringify(responses[url])))
}

/* eslint-disable no-undef */
describe('Reading calendars from the season data', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('the home calendar merges every footballer match from matches.json, and nothing else is fetched', async () => {
    const fetchFn = stubFetch(matchesData)
    vi.stubGlobal('fetch', fetchFn)

    const calendar = await new CalendarReaderService().getLiveCalendar('home')

    const matches = calendar.weeks.flatMap(week => week.matches)
    expect(matches).toHaveLength(5)
    expect(matches.map(match => match.footballer.name)).toEqual(['Victor', 'Victor', 'Alex', 'Alex', 'Alex'])
    expect(fetchFn.mock.calls.map(([url]) => url).sort()).toEqual(['applicationData.json', 'matches.json'])
  })

  test('a footballer without matches gives an error', async () => {
    const withoutVictor = { footballers: matchesData.footballers.filter(footballer => footballer.name !== 'Victor') }
    vi.stubGlobal('fetch', stubFetch(withoutVictor))

    await expect(new CalendarReaderService().getLiveCalendar('home'))
      .rejects.toThrow('CalendarReaderService.getTeamMatches: 0 matches for Victor in category Victor')
  })
})
