import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const ISSUE_TITLE_PREFIX = 'FCF fetch failing since'

async function readState (stateFile) {
  try {
    return JSON.parse(await readFile(stateFile, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return { consecutiveFailures: 0 }
    throw error
  }
}

export async function readStaleSince (stateFile) {
  const { consecutiveFailures, lastSuccessAt } = await readState(stateFile)
  return consecutiveFailures > 0 ? lastSuccessAt ?? null : null
}

export function createFailureTracker ({ stateFile, threshold = 4, issues = githubIssues, now = () => new Date() }) {
  async function writeState (state) {
    await mkdir(dirname(stateFile), { recursive: true })
    await writeFile(stateFile, JSON.stringify(state, null, 2) + '\n')
  }

  async function recordFailure (error) {
    const previous = await readState(stateFile)
    const state = {
      ...previous,
      consecutiveFailures: previous.consecutiveFailures + 1,
      firstFailureAt: previous.firstFailureAt ?? now().toISOString(),
      lastError: error.message
    }
    const alerted = state.consecutiveFailures >= threshold
    if (alerted && !state.issueNumber) {
      state.issueNumber = await issues.findOpen(ISSUE_TITLE_PREFIX) ??
        await issues.create(`${ISSUE_TITLE_PREFIX} ${state.firstFailureAt.substring(0, 10)}`,
          `The last ${state.consecutiveFailures} scheduled runs of \`npm run fetch-season\` failed, so the portal ` +
          `still shows the data of the last good run.\n\nLast error: \`${error.message}\``)
    }
    await writeState(state)
    return { alerted, consecutiveFailures: state.consecutiveFailures, staleChanged: state.consecutiveFailures === 1 }
  }

  async function recordSuccess () {
    const previous = await readState(stateFile)
    if (previous.issueNumber) {
      await issues.close(previous.issueNumber, `Fetch succeeded again after ${previous.consecutiveFailures} failed runs.`)
    }
    await writeState({ consecutiveFailures: 0, lastSuccessAt: now().toISOString() })
    return { staleChanged: previous.consecutiveFailures > 0 }
  }

  return { recordFailure, recordSuccess }
}

const runGh = async (...args) => (await promisify(execFile)('gh', args)).stdout.trim()

export const githubIssues = {
  async findOpen (titlePrefix) {
    const number = await runGh('issue', 'list', '--state', 'open', '--search', `in:title "${titlePrefix}"`,
      '--json', 'number', '--jq', '.[0].number')
    return number ? Number(number) : null
  },
  async create (title, body) {
    const url = await runGh('issue', 'create', '--title', title, '--body', body)
    return Number(url.split('/').pop())
  },
  async close (number, comment) {
    await runGh('issue', 'close', String(number), '--comment', comment)
  }
}
