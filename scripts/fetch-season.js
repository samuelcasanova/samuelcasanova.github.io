import { appendFile, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { createFcfClient } from './lib/fcfClient.js'
import { createFailureTracker } from './lib/failureTracker.js'
import { trimGroup } from './lib/fcfGroup.js'
import { GROUPS_DIR, ROOT, buildCalendarsFile, competicioUrlsByGroup, printTeams, readConfig, writeJson } from './build-calendars.js'

export async function fetchSeason ({ root = ROOT, client = createFcfClient() } = {}) {
  const config = await readConfig(root)

  const groups = new Map()
  for (const [grupId, competicioUrl] of competicioUrlsByGroup(config)) {
    groups.set(grupId, trimGroup(await client.getGroup(competicioUrl)))
  }

  const site = await buildCalendarsFile({ root, config, groups })
  for (const [grupId, group] of groups) {
    await writeJson(join(root, GROUPS_DIR, `${grupId}.json`), group)
  }
  for (const file of await readdir(join(root, GROUPS_DIR))) {
    if (!groups.has(file.replace(/\.json$/, ''))) {
      await rm(join(root, GROUPS_DIR, file))
    }
  }
  return site
}

export async function runFetchSeason ({ env = process.env, tracker = createTrackerFromEnv(env), ...options } = {}) {
  try {
    const site = await fetchSeason(options)
    printTeams(site.teams)
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
