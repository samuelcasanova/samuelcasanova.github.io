import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { buildGroupMatches } from './lib/fcfGroup.js'
import { grupIdOf } from './lib/fcfResponse.js'
import { buildCalendars } from './lib/calendarBuilder.js'
import { readStaleSince } from './lib/failureTracker.js'
import { competicioUrlsByGroup, readConfig, readJson } from './lib/season.js'

export const ROOT = join(import.meta.dirname, '..')
export const GROUPS_DIR = 'data/fcf'
// Same path as FETCH_STATE_FILE_PATH in .github/workflows/node.js.yml, restored from the Actions cache.
const FETCH_STATE_PATH = '.fetch-state/fetch-state.json'
const ADDITIONAL_MATCHES_PATH = 'data/additionalMatches.json'
const CALENDARS_PATH = 'src/data/calendars.json'

export async function writeJson (path, data) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(data, null, 2) + '\n')
}

export function buildSite ({ config, groups, additionalMatches }) {
  const teams = []
  const matches = []
  const statsUrls = {}
  for (const footballer of config.footballers) {
    for (const team of footballer.teams) {
      const group = groups.get(grupIdOf(team.competicioUrl))
      const built = buildGroupMatches({ group, footballerName: footballer.name, team, clubName: config.clubName })
      teams.push(...built.teams.map(groupTeam => ({ category: team.category, ...groupTeam })))
      matches.push(...built.matches)
      statsUrls[footballer.name] ??= built.clubTeamUrl
    }
  }
  return { calendars: buildCalendars(config, [...matches, ...additionalMatches], statsUrls), teams }
}

export async function buildCalendarsFile ({ root = ROOT, config, groups, staleSince = null } = {}) {
  config ??= await readConfig(root)
  if (!groups) {
    groups = new Map()
    for (const grupId of competicioUrlsByGroup(config).keys()) {
      groups.set(grupId, await readJson(join(root, GROUPS_DIR, `${grupId}.json`)))
    }
  }
  const { matches: additionalMatches } = await readJson(join(root, ADDITIONAL_MATCHES_PATH))
  const site = buildSite({ config, groups, additionalMatches })
  await writeJson(join(root, CALENDARS_PATH), { ...site.calendars, staleSince })
  return site
}

export function printTeams (teams) {
  console.table(teams.map(team => ({
    category: team.category,
    'raw name': team.name,
    displayName: team.displayName,
    retired: team.isRetired ? 'yes' : ''
  })))
}

if (import.meta.main) {
  const { teams } = await buildCalendarsFile({ staleSince: await readStaleSince(join(ROOT, FETCH_STATE_PATH)) })
  printTeams(teams)
}
