import { grupIdOf } from './fcfResponse.js'

const API_BASE_URL = 'https://www.fcf.cat/api/competition'
const PAUSE_BETWEEN_CALLS_MS = 5_000
const RETRY_AFTER_CHALLENGE_MS = 60_000
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',
  Accept: '*/*',
  'Accept-Language': 'es;q=0.6',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Priority: 'u=1, i',
  Cookie: 'NEXT_LOCALE=ca',
  'Sec-CH-UA': '"Not:A-Brand";v="8", "Chromium";v="156", "Brave";v="156"',
  'Sec-CH-UA-Mobile': '?1',
  'Sec-CH-UA-Platform': '"Android"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-GPC': '1'
}

export class FcfChallengedError extends Error {}

const defaultSleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const isMatchdays = partidos => typeof partidos === 'object' && partidos !== null && !Array.isArray(partidos) &&
  Object.values(partidos).every(Array.isArray)

export function createFcfClient ({ fetchFn = fetch, sleep = defaultSleep, baseUrl = API_BASE_URL } = {}) {
  let callCount = 0

  async function request (endpoint, grupId, referer) {
    if (callCount > 0) {
      await sleep(PAUSE_BETWEEN_CALLS_MS)
    }
    callCount++
    const url = `${baseUrl}/${endpoint}?grupId=${grupId}`
    const response = await fetchFn(url, {
      headers: { ...BROWSER_HEADERS, Referer: referer }
    })
    const body = await response.text()
    if (response.status !== 200 || body.length === 0) {
      throw new FcfChallengedError(`${url}: status ${response.status}, ${body.length} bytes, ` +
        `waf action ${response.headers.get('x-amzn-waf-action') ?? 'none'}`)
    }
    try {
      return JSON.parse(body)
    } catch {
      throw new FcfChallengedError(`${url}: body is not JSON`)
    }
  }

  async function requestWithOneRetry (endpoint, grupId, referer) {
    try {
      return await request(endpoint, grupId, referer)
    } catch (error) {
      if (!(error instanceof FcfChallengedError)) throw error
      console.warn(`${error.message}; retrying in ${RETRY_AFTER_CHALLENGE_MS / 1000} s`)
      await sleep(RETRY_AFTER_CHALLENGE_MS)
      return request(endpoint, grupId, referer)
    }
  }

  async function getGroup (competicioUrl) {
    const grupId = grupIdOf(competicioUrl)
    const { partidos } = await requestWithOneRetry('partidos', grupId, competicioUrl) ?? {}
    const equipos = await requestWithOneRetry('equipos', grupId, competicioUrl)
    if (!isMatchdays(partidos) || !Array.isArray(equipos)) {
      throw new FcfChallengedError(`Group ${grupId}: unexpected response shape`)
    }
    return { partidos, equipos }
  }

  return { getGroup }
}
