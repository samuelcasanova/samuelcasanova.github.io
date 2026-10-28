// @vitest-environment node
import { cp, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import group from './lib/fixtures/group-59724598.json' with { type: 'json' }
import { createTestRoot } from './lib/fixtures/testRoot.js'
import { trimGroup } from './lib/fcfResponse.js'
import { publishSeason } from './publish-season.js'
import publishedFiles from './publish-season.files.json' with { type: 'json' }

const REPO_ROOT = join(import.meta.dirname, '..')

describe('publishSeason', () => {
  let root

  beforeEach(async () => {
    root = await createTestRoot()
  })

  afterEach(async () => {
    await rm(root, { recursive: true })
  })

  const client = { getGroup: async () => group }

  function stubGithub (published) {
    return {
      get: vi.fn(async () => ({ content: JSON.stringify(published), sha: 'abc' })),
      put: vi.fn(async () => {})
    }
  }

  const publishAt = (at, github, fcfClient = client) => publishSeason({ root, client: fcfClient, github, now: () => new Date(at) })

  test('changed groups are published over the current version with the fetch time', async () => {
    const github = stubGithub({ fetchedAt: '2026-10-10T08:17:00.000Z', groups: {} })

    expect(await publishAt('2026-10-10T10:17:00Z', github)).toBe('refreshed')

    const [path, content, sha, message] = github.put.mock.calls[0]
    expect([path, sha, message]).toEqual(['data/fcf/season.json', 'abc', 'data: refresh season'])
    expect(JSON.parse(content)).toEqual({ fetchedAt: '2026-10-10T10:17:00.000Z', groups: { 59724598: trimGroup(group) } })
  })

  test('unchanged groups are not published while the published fetch time is less than 12 h old', async () => {
    const github = stubGithub({ fetchedAt: '2026-10-10T08:17:00.000Z', groups: { 59724598: trimGroup(group) } })

    expect(await publishAt('2026-10-10T20:16:00Z', github)).toBe('unchanged')
    expect(github.put).not.toHaveBeenCalled()
  })

  test('unchanged groups are published again once the published fetch time is 12 h old, to refresh it', async () => {
    const github = stubGithub({ fetchedAt: '2026-10-10T08:17:00.000Z', groups: { 59724598: trimGroup(group) } })

    expect(await publishAt('2026-10-10T20:17:00Z', github)).toBe('heartbeat')
    expect(github.put.mock.calls[0][3]).toBe('data: refresh fetchedAt')
    expect(JSON.parse(github.put.mock.calls[0][1]).fetchedAt).toBe('2026-10-10T20:17:00.000Z')
  })

  test('a failed FCF fetch fails before calling GitHub', async () => {
    const github = stubGithub({})

    await expect(publishAt('2026-10-10T10:17:00Z', github, { getGroup: async () => { throw new Error('status 403') } }))
      .rejects.toThrow('status 403')
    expect(github.get).not.toHaveBeenCalled()
  })

  test('the listed files are all the home server needs to publish', async () => {
    const serverRoot = await mkdtemp(join(tmpdir(), 'premierportal-server-'))
    try {
      for (const path of publishedFiles) {
        await cp(join(REPO_ROOT, path), join(serverRoot, path))
      }
      const { publishSeason: publishFromServer } = await import(join(serverRoot, 'scripts', 'publish-season.js'))
      const github = stubGithub({ fetchedAt: '2026-10-10T08:17:00.000Z', groups: {} })

      expect(await publishFromServer({ client, github })).toBe('refreshed')
      expect(Object.keys(JSON.parse(github.put.mock.calls[0][1]).groups)).toEqual(['58162016', '58162362', '59724598'])
    } finally {
      await rm(serverRoot, { recursive: true })
    }
  })
})
