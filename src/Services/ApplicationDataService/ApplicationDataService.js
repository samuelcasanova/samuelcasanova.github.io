import config from '../../config.json'

class ApplicationDataService {
  async getApplicationData () {
    try {
      const applicationDataUrl = config.applicationDataUrl
      return fetch(applicationDataUrl).then((response) => response.json()).then(jsonData =>
        new Promise(resolve => {
          return resolve(jsonData)
        }))
    } catch (message) {
      console.error(message)
    }
  }
}

export default ApplicationDataService
