import { join } from 'node:path'
import { createFcfClient } from './lib/fcfClient.js'
import { createGithubContents } from './lib/githubContents.js'
import { SEASON_PATH, fetchSeason, formatJson, readConfig } from './lib/season.js'

// Not imported from build-calendars.js: the home server downloads only the files in publish-season.files.json.
const ROOT = join(import.meta.dirname, '..')
const HEARTBEAT_MS = 12 * 60 * 60 * 1000

export async function publishSeason ({ root = ROOT, client = createFcfClient(), github, now } = {}) {
  const season = await fetchSeason(await readConfig(root), client, now)
  const published = await github.get(SEASON_PATH)
  const previous = JSON.parse(published.content)

  const changed = JSON.stringify(season.groups) !== JSON.stringify(previous.groups)
  if (!changed && new Date(season.fetchedAt) - new Date(previous.fetchedAt) < HEARTBEAT_MS) {
    return 'unchanged'
  }
  await github.put(SEASON_PATH, formatJson(season), published.sha, changed ? 'data: refresh season' : 'data: refresh fetchedAt')
  return changed ? 'refreshed' : 'heartbeat'
}

if (import.meta.main) {
  const github = createGithubContents({ token: process.env.GITHUB_TOKEN, repository: process.env.GITHUB_REPOSITORY })
  console.log(`Season ${await publishSeason({ github })}`)
}
