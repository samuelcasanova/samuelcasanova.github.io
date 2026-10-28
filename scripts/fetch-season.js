import { appendFile, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { createFcfClient } from './lib/fcfClient.js'
import { createFailureTracker } from './lib/failureTracker.js'
import { fetchGroups, readConfig } from './lib/season.js'
import { GROUPS_DIR, ROOT, buildCalendarsFile, printTeams, writeJson } from './build-calendars.js'

export async function fetchSeason ({ root = ROOT, client = createFcfClient() } = {}) {
  const config = await readConfig(root)
  const groups = await fetchGroups(config, client)

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
    const { staleChanged = false } = await tracker?.recordSuccess() ?? {}
    return { exitCode: 0, skipped: false, staleChanged }
  } catch (error) {
    if (!tracker) throw error
    const { alerted, consecutiveFailures, staleChanged } = await tracker.recordFailure(error)
    console.error(`Fetch failed (${consecutiveFailures} in a row): ${error.message}`)
    return { exitCode: alerted ? 1 : 0, skipped: true, staleChanged }
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
  const { exitCode, skipped, staleChanged } = await runFetchSeason()
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `skipped=${skipped}\nstaleChanged=${staleChanged}\n`)
  }
  process.exitCode = exitCode
}
