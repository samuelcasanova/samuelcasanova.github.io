import config from '../../config.json'

class ApplicationDataService {
  async getApplicationData () {
    try {
      const headers = new Headers()
      headers.append('pragma', 'no-cache')
      headers.append('cache-control', 'no-cache')
      const init = {
        method: 'GET',
        headers: headers
      }
      const request = new Request(config.applicationDataUrl)
      return fetch(request, init).then((response) => response.json()).then(jsonData =>
        new Promise(resolve => {
          return resolve(jsonData)
        }))
    } catch (message) {
      console.error(message)
    }
  }
}

export default ApplicationDataService
