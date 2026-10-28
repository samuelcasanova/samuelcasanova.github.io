const API_BASE_URL = 'https://api.github.com'

export function createGithubContents ({ token, repository, branch = 'master', fetchFn = fetch }) {
  async function request (method, path, body) {
    const query = method === 'GET' ? `?ref=${branch}` : ''
    const response = await fetchFn(`${API_BASE_URL}/repos/${repository}/contents/${path}${query}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: body && JSON.stringify(body)
    })
    if (!response.ok) {
      throw new Error(`GitHub ${method} ${path}: status ${response.status}, ${await response.text()}`)
    }
    return response.json()
  }

  // Above 1 MB the API leaves content empty and sets encoding to "none".
  async function get (path) {
    const { content, encoding, sha } = await request('GET', path)
    if (encoding !== 'base64') {
      throw new Error(`GitHub GET ${path}: content encoded as ${encoding}, the file is too big for the contents API`)
    }
    return { content: Buffer.from(content, 'base64').toString('utf8'), sha }
  }

  // GitHub rejects the update with 409 when sha is no longer the file's current version.
  async function put (path, content, sha, message) {
    await request('PUT', path, { message, content: Buffer.from(content).toString('base64'), sha, branch })
  }

  return { get, put }
}
