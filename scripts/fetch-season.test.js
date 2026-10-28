// @vitest-environment node
import { readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import group from './lib/fixtures/group-59724598.json' with { type: 'json' }
import { createTestRoot } from './lib/fixtures/testRoot.js'
import { fetchAndSaveSeason } from './fetch-season.js'

const OUTPUT_PATHS = ['data/fcf/season.json', 'src/data/calendars.json']
const FETCHED_AT = '2026-10-10T08:17:00.000Z'

describe('fetchAndSaveSeason', () => {
  let root

  beforeEach(async () => {
    root = await createTestRoot()
  })

  afterEach(async () => {
    await rm(root, { recursive: true })
  })

  const readOutputs = () => Promise.all(OUTPUT_PATHS.map(path => readFile(join(root, path), 'utf8')))
  const now = () => new Date(FETCHED_AT)

  test('saves the trimmed groups with the fetch time and builds the calendars, and a second run leaves them unchanged', async () => {
    const client = { getGroup: vi.fn(async () => group) }

    await fetchAndSaveSeason({ root, client, now })
    const firstRun = await readOutputs()
    await fetchAndSaveSeason({ root, client, now })

    expect(await readOutputs()).toEqual(firstRun)
    const [season, calendars] = firstRun.map(JSON.parse)
    expect(season.fetchedAt).toBe(FETCHED_AT)
    expect(Object.keys(season.groups)).toEqual(['59724598'])
    expect(season.groups['59724598'].partidos['1'][0]).not.toHaveProperty('CERRADA')
    expect(calendars.fetchedAt).toBe(FETCHED_AT)
    expect(calendars.calendars[0].weeks).toHaveLength(4)
  })

  test('a club match without kick-off time is saved and shown with its time to be confirmed', async () => {
    const withoutTime = structuredClone(group)
    withoutTime.partidos['2'].find(match => match.NOMBRE_FUERA.includes('PREMIER')).COMIENZO1 = '2026-10-10'

    await fetchAndSaveSeason({ root, client: { getGroup: async () => withoutTime } })

    const [, calendars] = await readOutputs()
    expect(JSON.parse(calendars).calendars[0].weeks[1].matches[0])
      .toMatchObject({ date: '2026-10-10', dateLabel: 'SÁB 10 OCT', timeLabel: 'Hora por confirmar' })
  })

  test('writes nothing when a group fails', async () => {
    const client = { getGroup: vi.fn(async () => { throw new Error('challenged') }) }

    await expect(fetchAndSaveSeason({ root, client })).rejects.toThrow('challenged')
    for (const path of OUTPUT_PATHS) {
      await expect(readFile(join(root, path))).rejects.toThrow(/ENOENT/)
    }
  })

  test('writes nothing when the fetched data does not build', async () => {
    const withoutPremier = { ...group, equipos: group.equipos.filter(team => !team.label.includes('PREMIER')) }
    const client = { getGroup: vi.fn(async () => withoutPremier) }

    await expect(fetchAndSaveSeason({ root, client })).rejects.toThrow(/found: none/)
    for (const path of OUTPUT_PATHS) {
      await expect(readFile(join(root, path))).rejects.toThrow(/ENOENT/)
    }
  })
})
