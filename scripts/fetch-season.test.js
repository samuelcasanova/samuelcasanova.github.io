// @vitest-environment node
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import group from './lib/fixtures/group-59724598.json' with { type: 'json' }
import { fetchSeason, runFetchSeason } from './fetch-season.js'
import { createFcfClient } from './lib/fcfClient.js'
import { createFailureTracker } from './lib/failureTracker.js'

const COMPETICIO_URL = 'https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308233&competicioId=58780268&grupId=59724598'
const OUTPUT_PATHS = ['src/Models/Team/teams.json', 'src/Models/Footballer/footballers.json', 'public/matches.json']

describe('fetchSeason', () => {
  let root

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'fetch-season-'))
    for (const dir of ['src/Models/Team', 'src/Models/Footballer', 'public']) {
      await mkdir(join(root, dir), { recursive: true })
    }
    await writeFile(join(root, 'season.config.json'), JSON.stringify({
      clubName: 'PREMIER BARCELONA',
      footballers: [{ name: 'Alex', imageUrl: '/footballers/Alex.png', teams: [{ category: 'Alex', competicioUrl: COMPETICIO_URL }] }]
    }))
  })

  afterEach(async () => {
    await rm(root, { recursive: true })
  })

  const readOutputs = () => Promise.all(OUTPUT_PATHS.map(path => readFile(join(root, path), 'utf8')))

  test('writes the portal data files, and a second run leaves them unchanged', async () => {
    const client = { getGroup: vi.fn(async () => group) }

    await fetchSeason({ root, client })
    const firstRun = await readOutputs()
    await fetchSeason({ root, client })

    expect(await readOutputs()).toEqual(firstRun)
    expect(JSON.parse(firstRun[2]).footballers[0].teams[0].matches).toHaveLength(4)
  })

  test('writes nothing when a group fails', async () => {
    const client = { getGroup: vi.fn(async () => { throw new Error('challenged') }) }

    await expect(fetchSeason({ root, client })).rejects.toThrow('challenged')
    await expect(readFile(join(root, OUTPUT_PATHS[0]))).rejects.toThrow(/ENOENT/)
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
