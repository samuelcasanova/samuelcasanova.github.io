import { join } from 'node:path'
import { createFcfClient } from './lib/fcfClient.js'
import { SEASON_PATH, fetchSeason, readConfig } from './lib/season.js'
import { ROOT, buildCalendarsFile, printTeams, writeJson } from './build-calendars.js'

export async function fetchAndSaveSeason ({ root = ROOT, client = createFcfClient(), now } = {}) {
  const config = await readConfig(root)
  const season = await fetchSeason(config, client, now)
  const site = await buildCalendarsFile({ root, config, season })
  await writeJson(join(root, SEASON_PATH), season)
  return site
}

if (import.meta.main) {
  printTeams((await fetchAndSaveSeason()).teams)
}
