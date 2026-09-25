import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { buildGroupMatches, grupIdOf } from './lib/fcfGroup.js'
import { buildCalendars } from './lib/calendarBuilder.js'

export const ROOT = join(import.meta.dirname, '..')
export const GROUPS_DIR = 'data/fcf'
const CONFIG_PATH = 'season.config.json'
const ADDITIONAL_MATCHES_PATH = 'data/additionalMatches.json'
const CALENDARS_PATH = 'src/data/calendars.json'

export const readJson = async path => JSON.parse(await readFile(path, 'utf8'))

export async function writeJson (path, data) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(data, null, 2) + '\n')
}

export const readConfig = root => readJson(join(root, CONFIG_PATH))

export function competicioUrlsByGroup (config) {
  const teams = config.footballers.flatMap(footballer => footballer.teams)
  return new Map(teams.map(team => [grupIdOf(team.competicioUrl), team.competicioUrl]))
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

export async function buildCalendarsFile ({ root = ROOT, config, groups } = {}) {
  config ??= await readConfig(root)
  if (!groups) {
    groups = new Map()
    for (const grupId of competicioUrlsByGroup(config).keys()) {
      groups.set(grupId, await readJson(join(root, GROUPS_DIR, `${grupId}.json`)))
    }
  }
  const { matches: additionalMatches } = await readJson(join(root, ADDITIONAL_MATCHES_PATH))
  const site = buildSite({ config, groups, additionalMatches })
  await writeJson(join(root, CALENDARS_PATH), site.calendars)
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
  const { teams } = await buildCalendarsFile()
  printTeams(teams)
}
