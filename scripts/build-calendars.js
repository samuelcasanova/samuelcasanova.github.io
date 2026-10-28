import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { buildGroupMatches } from './lib/fcfGroup.js'
import { grupIdOf } from './lib/fcfResponse.js'
import { buildCalendars } from './lib/calendarBuilder.js'
import { SEASON_PATH, formatJson, readConfig, readJson } from './lib/season.js'

export const ROOT = join(import.meta.dirname, '..')
const ADDITIONAL_MATCHES_PATH = 'data/additionalMatches.json'
const CALENDARS_PATH = 'src/data/calendars.json'

export async function writeJson (path, data) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, formatJson(data))
}

export function buildSite ({ config, groups, additionalMatches }) {
  const teams = []
  const matches = []
  const statsUrls = {}
  for (const footballer of config.footballers) {
    for (const team of footballer.teams) {
      const grupId = grupIdOf(team.competicioUrl)
      const group = groups[grupId]
      if (!group) {
        throw new Error(`Group ${grupId} of ${footballer.name} is not in ${SEASON_PATH}, run npm run fetch-season`)
      }
      const built = buildGroupMatches({ group, footballerName: footballer.name, team, clubName: config.clubName })
      teams.push(...built.teams.map(groupTeam => ({ category: team.category, ...groupTeam })))
      matches.push(...built.matches)
      statsUrls[footballer.name] ??= built.clubTeamUrl
    }
  }
  return { calendars: buildCalendars(config, [...matches, ...additionalMatches], statsUrls), teams }
}

export async function buildCalendarsFile ({ root = ROOT, config, season } = {}) {
  config ??= await readConfig(root)
  season ??= await readJson(join(root, SEASON_PATH))
  const { matches: additionalMatches } = await readJson(join(root, ADDITIONAL_MATCHES_PATH))
  const site = buildSite({ config, groups: season.groups, additionalMatches })
  await writeJson(join(root, CALENDARS_PATH), { ...site.calendars, fetchedAt: season.fetchedAt })
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
  printTeams((await buildCalendarsFile()).teams)
}
