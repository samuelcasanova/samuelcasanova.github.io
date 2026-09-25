// @vitest-environment node
import { readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import group from './lib/fixtures/group-59724598.json' with { type: 'json' }
import { createTestRoot } from './lib/fixtures/testRoot.js'
import { buildCalendarsFile } from './build-calendars.js'
import { trimGroup } from './lib/fcfGroup.js'

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

  test('builds the calendars offline from the saved groups, with the additional matches merged in', async () => {
    root = await createTestRoot({ additionalMatches: [friendly] })
    await writeFile(join(root, 'data', 'fcf', '59724598.json'), JSON.stringify(trimGroup(group)))

    const { teams } = await buildCalendarsFile({ root })

    const { calendars } = JSON.parse(await readFile(join(root, 'src', 'data', 'calendars.json'), 'utf8'))
    const [firstWeek] = calendars[0].weeks
    expect(firstWeek.matches.map(match => match.date)).toEqual(['2026-10-01', '2026-10-04'])
    expect(firstWeek.matches[0]).toMatchObject({ awayTeam: { displayName: 'Amistoso' }, dateLabel: 'JUE 01 OCT' })
    expect(teams.find(team => team.name === 'CARMELO, C.D. C')).toMatchObject({ category: 'Alex', isRetired: true })
  })

  test('a missing saved group is an error', async () => {
    root = await createTestRoot()

    await expect(buildCalendarsFile({ root })).rejects.toThrow(/ENOENT.*59724598\.json/)
  })
})
