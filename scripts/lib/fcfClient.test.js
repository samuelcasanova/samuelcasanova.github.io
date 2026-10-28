// @vitest-environment node
import { createFcfClient, FcfChallengedError } from './fcfClient.js'

const COMPETICIO_URL = 'https://www.fcf.cat/ca/competicio?temporadaId=22&grupId=123'

const ok = body => new Response(JSON.stringify(body), { status: 200 })
const partidosResponse = partidos => ok({ partidos, jornada: { codjornada: '5', fecha: '2026-11-01T00:00:00.000Z', total: 26 } })
const challenge = () => new Response('', { status: 202, headers: { 'x-amzn-waf-action': 'challenge' } })

function stubClient (responses) {
  const fetchFn = vi.fn(async () => responses.shift())
  const sleep = vi.fn(async () => {})
  return { client: createFcfClient({ fetchFn, sleep }), fetchFn, sleep }
}

describe('fcfClient', () => {
  test('gets partidos and equipos of the group with browser headers, pausing between calls', async () => {
    const { client, fetchFn, sleep } = stubClient([partidosResponse({ 1: [] }), ok([])])

    expect(await client.getGroup(COMPETICIO_URL)).toEqual({ partidos: { 1: [] }, equipos: [] })

    expect(fetchFn.mock.calls.map(([url]) => url)).toEqual([
      'https://www.fcf.cat/api/competition/partidos?grupId=123',
      'https://www.fcf.cat/api/competition/equipos?grupId=123'
    ])
    expect(fetchFn.mock.calls[0][1].headers).toMatchObject({ Accept: 'application/json', Referer: COMPETICIO_URL })
    expect(sleep.mock.calls).toEqual([[5_000]])
  })

  test('a challenge is retried once after 60 s', async () => {
    const { client, sleep } = stubClient([challenge(), partidosResponse({ 1: [] }), ok([])])

    await client.getGroup(COMPETICIO_URL)

    expect(sleep.mock.calls).toEqual([[60_000], [5_000], [5_000]])
  })

  test('a second challenge fails the fetch', async () => {
    const { client, fetchFn } = stubClient([challenge(), challenge()])

    await expect(client.getGroup(COMPETICIO_URL)).rejects.toThrow(FcfChallengedError)
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })

  test('a non-JSON body counts as a challenge', async () => {
    const { client } = stubClient([new Response('<html>', { status: 200 }), new Response('<html>', { status: 200 })])

    await expect(client.getGroup(COMPETICIO_URL)).rejects.toThrow(/not JSON/)
  })

  test('partidos without the matchdays wrapped in a partidos object is an unexpected shape', async () => {
    const { client } = stubClient([ok({ 1: [] }), ok([])])

    await expect(client.getGroup(COMPETICIO_URL)).rejects.toThrow('Group 123: unexpected response shape')
  })

  test('a matchday that is not a list of matches is an unexpected shape', async () => {
    const { client } = stubClient([partidosResponse({ 1: { 0: {} } }), ok([])])

    await expect(client.getGroup(COMPETICIO_URL)).rejects.toThrow('Group 123: unexpected response shape')
  })

  test('a competicio URL without grupId is rejected before any call', async () => {
    const { client, fetchFn } = stubClient([])

    await expect(client.getGroup('https://www.fcf.cat/ca/competicio')).rejects.toThrow(/No grupId/)
    expect(fetchFn).not.toHaveBeenCalled()
  })
})
