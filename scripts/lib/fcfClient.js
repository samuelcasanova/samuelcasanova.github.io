import { grupIdOf } from './fcfGroup.js'

const API_BASE_URL = 'https://www.fcf.cat/api/competition'
const PAUSE_BETWEEN_CALLS_MS = 5_000
const RETRY_AFTER_CHALLENGE_MS = 60_000
const BROWSER_USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

export class FcfChallengedError extends Error {}

const defaultSleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export function createFcfClient ({ fetchFn = fetch, sleep = defaultSleep, baseUrl = API_BASE_URL } = {}) {
  let callCount = 0

  async function request (endpoint, grupId, referer) {
    if (callCount > 0) {
      await sleep(PAUSE_BETWEEN_CALLS_MS)
    }
    callCount++
    const url = `${baseUrl}/${endpoint}?grupId=${grupId}`
    const response = await fetchFn(url, {
      headers: {
        'User-Agent': BROWSER_USER_AGENT,
        Accept: 'application/json',
        'Accept-Language': 'ca',
        Referer: referer
      }
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
    const partidos = await requestWithOneRetry('partidos', grupId, competicioUrl)
    const equipos = await requestWithOneRetry('equipos', grupId, competicioUrl)
    if (typeof partidos !== 'object' || partidos === null || Array.isArray(partidos) || !Array.isArray(equipos)) {
      throw new FcfChallengedError(`Group ${grupId}: unexpected response shape`)
    }
    return { partidos, equipos }
  }

  return { getGroup }
}
