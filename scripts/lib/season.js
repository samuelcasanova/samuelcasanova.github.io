import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { grupIdOf, trimGroup } from './fcfResponse.js'

const CONFIG_PATH = 'season.config.json'

export const readJson = async path => JSON.parse(await readFile(path, 'utf8'))

export const readConfig = root => readJson(join(root, CONFIG_PATH))

export function competicioUrlsByGroup (config) {
  const teams = config.footballers.flatMap(footballer => footballer.teams)
  return new Map(teams.map(team => [grupIdOf(team.competicioUrl), team.competicioUrl]))
}

export async function fetchGroups (config, client) {
  const groups = new Map()
  for (const [grupId, competicioUrl] of competicioUrlsByGroup(config)) {
    groups.set(grupId, trimGroup(await client.getGroup(competicioUrl)))
  }
  return groups
}
