import config from '../../config.json'

class ApplicationDataService {
  async getApplicationData () {
    return this.getJson(config.applicationDataUrl)
  }

  async getMatchesData () {
    return this.getJson(config.matchesDataUrl)
  }

  async getJson (url) {
    const response = await fetch(url, { headers: { pragma: 'no-cache', 'cache-control': 'no-cache' } })
    return response.json()
  }
}

export default ApplicationDataService
