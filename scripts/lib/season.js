import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { grupIdOf, trimGroup } from './fcfResponse.js'

const CONFIG_PATH = 'season.config.json'
export const SEASON_PATH = 'data/fcf/season.json'

export const readJson = async path => JSON.parse(await readFile(path, 'utf8'))

export const formatJson = data => JSON.stringify(data, null, 2) + '\n'

export const readConfig = root => readJson(join(root, CONFIG_PATH))

export function competicioUrlsByGroup (config) {
  const teams = config.footballers.flatMap(footballer => footballer.teams)
  return new Map(teams.map(team => [grupIdOf(team.competicioUrl), team.competicioUrl]))
}

export async function fetchSeason (config, client, now = () => new Date()) {
  const groups = {}
  for (const [grupId, competicioUrl] of competicioUrlsByGroup(config)) {
    groups[grupId] = trimGroup(await client.getGroup(competicioUrl))
  }
  return { fetchedAt: now().toISOString(), groups }
}
