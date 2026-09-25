// @vitest-environment node
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import group from './lib/fixtures/group-59724598.json' with { type: 'json' }
import { fetchSeason } from './fetch-season.js'

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
})
