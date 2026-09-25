import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createFcfClient } from './lib/fcfClient.js'
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

if (import.meta.main) {
  const season = await fetchSeason()
  printDisplayNames(season)
}
