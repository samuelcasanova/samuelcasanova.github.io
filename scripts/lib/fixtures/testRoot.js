import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const COMPETICIO_URL = 'https://www.fcf.cat/ca/competicio?temporadaId=22&disciplinaId=19308233&competicioId=58780268&grupId=59724598'

export async function createTestRoot ({ additionalMatches = [] } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'premierportal-'))
  await mkdir(join(root, 'data', 'fcf'), { recursive: true })
  await writeFile(join(root, 'season.config.json'), JSON.stringify({
    clubName: 'PREMIER BARCELONA',
    calendars: [{ name: 'home', label: 'Calendario Peques', path: '/', footballerNames: ['Alex'] }],
    footballers: [{ name: 'Alex', imageUrl: '/footballers/Alex.png', teams: [{ category: 'Alex', competicioUrl: COMPETICIO_URL }] }]
  }))
  await writeFile(join(root, 'data', 'additionalMatches.json'), JSON.stringify({ matches: additionalMatches }))
  return root
}
