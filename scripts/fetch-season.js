import { appendFile, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createFcfClient } from './lib/fcfClient.js'
import { createFailureTracker } from './lib/failureTracker.js'
import { buildSeason } from './lib/seasonBuilder.js'

const ROOT = join(import.meta.dirname, '..')
const OUTPUT_FILES = {
  teams: 'src/Models/Team/teams.json',
  footballers: 'src/Models/Footballer/footballers.json',
  matches: 'public/matches.json'
}

export async function fetchSeason ({ root = ROOT, client = createFcfClient() } = {}) {
  const config = JSON.parse(await readFile(join(root, 'season.config.json'), 'utf8'))

  const groupsByUrl = new Map()
  for (const footballer of config.footballers) {
    for (const team of footballer.teams) {
      if (!groupsByUrl.has(team.competicioUrl)) {
        groupsByUrl.set(team.competicioUrl, await client.getGroup(team.competicioUrl))
      }
    }
  }

  const season = buildSeason(config, groupsByUrl)
  for (const [key, path] of Object.entries(OUTPUT_FILES)) {
    await writeFile(join(root, path), JSON.stringify(season[key], null, 2) + '\n')
  }
  return season
}

function printDisplayNames (season) {
  const rows = season.teams.categories.flatMap(category =>
    category.teams.map(team => ({
      category: category.name,
      'raw name': team.name,
      displayName: team.displayName,
      retired: team.isRetired ? 'yes' : ''
    })))
  console.table(rows)
}

export async function runFetchSeason ({ env = process.env, tracker = createTrackerFromEnv(env), ...options } = {}) {
  try {
    const season = await fetchSeason(options)
    printDisplayNames(season)
    await tracker?.recordSuccess()
    return { exitCode: 0, skipped: false }
  } catch (error) {
    if (!tracker) throw error
    const { alerted, consecutiveFailures } = await tracker.recordFailure(error)
    console.error(`Fetch failed (${consecutiveFailures} in a row): ${error.message}`)
    return { exitCode: alerted ? 1 : 0, skipped: true }
  }
}

function createTrackerFromEnv (env) {
  if (!env.FETCH_STATE_FILE) return null
  return createFailureTracker({
    stateFile: env.FETCH_STATE_FILE,
    threshold: Number(env.FETCH_FAILURE_ALERT_THRESHOLD ?? 4)
  })
}

if (import.meta.main) {
  const { exitCode, skipped } = await runFetchSeason()
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `skipped=${skipped}\n`)
  }
  process.exitCode = exitCode
}
