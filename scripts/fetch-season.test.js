// @vitest-environment node
import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import group from './lib/fixtures/group-59724598.json' with { type: 'json' }
import { createTestRoot } from './lib/fixtures/testRoot.js'
import { fetchSeason, runFetchSeason } from './fetch-season.js'
import { createFcfClient } from './lib/fcfClient.js'
import { createFailureTracker } from './lib/failureTracker.js'

const OUTPUT_PATHS = ['data/fcf/59724598.json', 'src/data/calendars.json']

describe('fetchSeason', () => {
  let root

  beforeEach(async () => {
    root = await createTestRoot()
  })

  afterEach(async () => {
    await rm(root, { recursive: true })
  })

  const readOutputs = () => Promise.all(OUTPUT_PATHS.map(path => readFile(join(root, path), 'utf8')))

  test('saves the trimmed group and builds the calendars, and a second run leaves them unchanged', async () => {
    const client = { getGroup: vi.fn(async () => group) }

    await fetchSeason({ root, client })
    const firstRun = await readOutputs()
    await fetchSeason({ root, client })

    expect(await readOutputs()).toEqual(firstRun)
    expect(JSON.parse(firstRun[0]).partidos['1'][0]).not.toHaveProperty('CERRADA')
    expect(JSON.parse(firstRun[1]).calendars[0].weeks).toHaveLength(4)
  })

  test('writes nothing when a group fails', async () => {
    const client = { getGroup: vi.fn(async () => { throw new Error('challenged') }) }

    await expect(fetchSeason({ root, client })).rejects.toThrow('challenged')
    for (const path of OUTPUT_PATHS) {
      await expect(readFile(join(root, path))).rejects.toThrow(/ENOENT/)
    }
  })

  test('writes nothing when the fetched data does not build', async () => {
    const withoutPremier = { ...group, equipos: group.equipos.filter(team => !team.label.includes('PREMIER')) }
    const client = { getGroup: vi.fn(async () => withoutPremier) }

    await expect(fetchSeason({ root, client })).rejects.toThrow(/found: none/)
    for (const path of OUTPUT_PATHS) {
      await expect(readFile(join(root, path))).rejects.toThrow(/ENOENT/)
    }
  })

  test('removes the saved groups that are no longer in the config', async () => {
    await writeFile(join(root, 'data', 'fcf', '11111111.json'), '{}')

    await fetchSeason({ root, client: { getGroup: async () => group } })

    expect(await readdir(join(root, 'data', 'fcf'))).toEqual(['59724598.json'])
  })

  describe('scheduled runs, with a failure counter', () => {
    const challengedClient = createFcfClient({
      fetchFn: async () => new Response('', { status: 202 }),
      sleep: async () => {}
    })
    const workingClient = { getGroup: async () => group }

    function stubIssues () {
      return { findOpen: vi.fn(async () => null), create: vi.fn(async () => 42), close: vi.fn(async () => {}) }
    }

    const run = (client, issues) => runFetchSeason({
      root,
      client,
      tracker: createFailureTracker({ stateFile: join(root, 'state', 'fetch-state.json'), threshold: 4, issues })
    })

    test('failures are skipped until the fourth in a row, which opens an issue and fails', async () => {
      const issues = stubIssues()

      for (let attempt = 1; attempt <= 3; attempt++) {
        expect(await run(challengedClient, issues)).toEqual({ exitCode: 0, skipped: true })
      }
      expect(issues.create).not.toHaveBeenCalled()

      expect(await run(challengedClient, issues)).toEqual({ exitCode: 1, skipped: true })
      expect(issues.create).toHaveBeenCalledOnce()
      expect(issues.create.mock.calls[0][0]).toMatch(/^FCF fetch failing since \d{4}-\d{2}-\d{2}$/)

      expect(await run(challengedClient, issues)).toEqual({ exitCode: 1, skipped: true })
      expect(issues.create).toHaveBeenCalledOnce()
    })

    test('an already open issue is reused', async () => {
      const issues = stubIssues()
      issues.findOpen.mockResolvedValue(7)

      for (let attempt = 1; attempt <= 4; attempt++) await run(challengedClient, issues)
      await run(workingClient, issues)

      expect(issues.create).not.toHaveBeenCalled()
      expect(issues.close).toHaveBeenCalledWith(7, expect.any(String))
    })

    test('a success closes the issue and resets the counter', async () => {
      const issues = stubIssues()
      for (let attempt = 1; attempt <= 4; attempt++) await run(challengedClient, issues)

      expect(await run(workingClient, issues)).toEqual({ exitCode: 0, skipped: false })
      expect(issues.close).toHaveBeenCalledWith(42, expect.any(String))

      for (let attempt = 1; attempt <= 3; attempt++) {
        expect(await run(challengedClient, issues)).toEqual({ exitCode: 0, skipped: true })
      }
      expect(issues.close).toHaveBeenCalledOnce()
    })

    test('without a state file a failure is thrown right away', async () => {
      await expect(runFetchSeason({ root, client: challengedClient, env: {} })).rejects.toThrow(/status 202/)
    })
  })
})
