// @vitest-environment node
import { readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import group from './lib/fixtures/group-59724598.json' with { type: 'json' }
import { createTestRoot } from './lib/fixtures/testRoot.js'
import { buildCalendarsFile } from './build-calendars.js'
import { trimGroup } from './lib/fcfResponse.js'

const FETCHED_AT = '2026-10-10T08:17:00.000Z'

const friendly = {
  footballer: 'Alex',
  date: '2026-10-01',
  time: '19:00',
  homeTeam: { displayName: 'Premier D', logoUrl: '', url: '' },
  awayTeam: { displayName: 'Amistoso', logoUrl: '', url: '' },
  fieldName: 'CAMP DE FUTBOL MPAL. VALL D´HEBRON'
}

describe('buildCalendarsFile', () => {
  let root

  afterEach(async () => {
    await rm(root, { recursive: true })
  })

  const saveSeason = groups => writeFile(join(root, 'data', 'fcf', 'season.json'), JSON.stringify({ fetchedAt: FETCHED_AT, groups }))

  test('builds the calendars offline from the saved season, with the additional matches merged in and its fetch time', async () => {
    root = await createTestRoot({ additionalMatches: [friendly] })
    await saveSeason({ 59724598: trimGroup(group) })

    const { teams } = await buildCalendarsFile({ root })

    const { calendars, fetchedAt } = JSON.parse(await readFile(join(root, 'src', 'data', 'calendars.json'), 'utf8'))
    const [firstWeek] = calendars[0].weeks
    expect(firstWeek.matches.map(match => match.date)).toEqual(['2026-10-01', '2026-10-04'])
    expect(firstWeek.matches[0]).toMatchObject({ awayTeam: { displayName: 'Amistoso' }, dateLabel: 'JUE 01 OCT' })
    expect(teams.find(team => team.name === 'CARMELO, C.D. C')).toMatchObject({ category: 'Alex', isRetired: true })
    expect(fetchedAt).toBe(FETCHED_AT)
  })

  test('a group of the config missing from the saved season is an error', async () => {
    root = await createTestRoot()
    await saveSeason({})

    await expect(buildCalendarsFile({ root })).rejects.toThrow(/Group 59724598 of Alex is not in data\/fcf\/season\.json/)
  })
})
