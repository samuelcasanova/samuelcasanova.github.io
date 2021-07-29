class UserService {
  async getUsers () {
    try {
      return fetch('https://randomuser.me/api/?results=5').then(response => response.json()).then(response =>
        new Promise(resolve => {
          const users = response.results.map((element, index) => {
            const imgSrc = element.picture.medium
            const firstName = element.name.first
            const lastName = element.name.last
            const email = element.email
            const city = element.location.city
            return {
              imgSrc: imgSrc,
              firstName: firstName,
              lastName: lastName,
              email: email,
              city: city
            }
          })
          return resolve(users)
        }))
    } catch (message) {
      console.log(message)
    }
  }
}

export default UserService
