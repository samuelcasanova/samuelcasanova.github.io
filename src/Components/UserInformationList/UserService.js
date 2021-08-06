class UserService {
  async getUsers () {
    try {
      return fetch('/characters').then(response => response.json()).then(response =>
        new Promise(resolve => {
          console.log('Fetched data:' + response)
          const users = response
          return resolve(users)
        }))
    } catch (message) {
      console.log(message)
    }
  }
}

export default UserService
