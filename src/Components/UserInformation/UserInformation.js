import React from 'react'
import './UserInformation.css'
import UserService from './UserService'

class UserInformation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imgSrc: 'imgSrc',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      city: 'city'
    }
  }

  render () {
    return (
            <div className="card">
                <img src={ this.state.imgSrc } alt={ this.state.firstName } />
                <h3> { this.state.firstName + ' ' + this.state.lastName } </h3>
                <p className="title"> { this.state.email } </p>
                <p> { this.state.city } </p>
                <p><button disabled>Coming soon...</button></p>
            </div>
    )
  }

  componentDidMount () {
    const userService = new UserService()
    userService.getUser().then(
      user => {
        const imgSrc = user.picture.medium
        const firstName = user.name.first
        const lastName = user.name.last
        const email = user.email
        const city = user.location.city
        this.setState({
          imgSrc: imgSrc,
          firstName: firstName,
          lastName: lastName,
          email: email,
          city: city
        })
      })
  }
}

export default UserInformation
