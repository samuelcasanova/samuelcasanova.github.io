// @vitest-environment node
import { createGithubContents } from './githubContents.js'

const CONTENTS_URL = 'https://api.github.com/repos/owner/repo/contents/data/fcf/season.json'

function stubGithub (response) {
  const fetchFn = vi.fn(async () => response)
  return { github: createGithubContents({ token: 'secret', repository: 'owner/repo', fetchFn }), fetchFn }
}

describe('githubContents', () => {
  test('gets the decoded file and its sha from master, authenticated', async () => {
    const content = Buffer.from('{"fetchedAt":"2026-10-10T08:17:00.000Z"}\n').toString('base64')
    const { github, fetchFn } = stubGithub(Response.json({ content: `${content.slice(0, 10)}\n${content.slice(10)}`, encoding: 'base64', sha: 'abc' }))

    expect(await github.get('data/fcf/season.json')).toEqual({ content: '{"fetchedAt":"2026-10-10T08:17:00.000Z"}\n', sha: 'abc' })

    const [url, { method, headers }] = fetchFn.mock.calls[0]
    expect(url).toBe(`${CONTENTS_URL}?ref=master`)
    expect(method).toBe('GET')
    expect(headers.Authorization).toBe('Bearer secret')
  })

  test('a file too big for the contents API is an error', async () => {
    const { github } = stubGithub(Response.json({ content: '', encoding: 'none', sha: 'abc' }))

    await expect(github.get('data/fcf/season.json')).rejects.toThrow(/too big/)
  })

  test('puts the encoded content over the given sha on master', async () => {
    const { github, fetchFn } = stubGithub(Response.json({}))

    await github.put('data/fcf/season.json', 'día\n', 'abc', 'data: refresh season')

    const [url, { method, body }] = fetchFn.mock.calls[0]
    expect(url).toBe(CONTENTS_URL)
    expect(method).toBe('PUT')
    expect(JSON.parse(body)).toEqual({ message: 'data: refresh season', content: Buffer.from('día\n').toString('base64'), sha: 'abc', branch: 'master' })
  })

  test('an error response fails with its status and body', async () => {
    const { github } = stubGithub(new Response('{"message":"is at def but expected abc"}', { status: 409 }))

    await expect(github.put('data/fcf/season.json', '{}', 'abc', 'data: refresh season')).rejects.toThrow(/status 409.*expected abc/)
  })
})
