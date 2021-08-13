class CharacterService {
  async getCharacters () {
    try {
      return fetch('/characters').then(response => response.json()).then(response =>
        new Promise(resolve => {
          console.log('Fetched data from /characters')
          const characters = response
          return resolve(characters)
        }))
    } catch (message) {
      console.log(message)
    }
  }
}

export default CharacterService
