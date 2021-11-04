class HtmlCodeFromUrlService {
  async getHtmlCodeFromURL (url) {
    try {
      return fetch(url).then((response) => response.text()).then(htmlCode =>
        new Promise(resolve => {
          return resolve(htmlCode)
        }))
    } catch (message) {
      console.error(message)
    }
  }
}

export default HtmlCodeFromUrlService
