import React from 'react'
import UserInformation from '../UserInformation/UserInformation'
import './UserInformationList.css'
import UserService from './UserService'

class UserInformationList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      users: []
    }
  }

  render () {
    return (
            <div className="list">
              {
                this.state.users.map(
                  (element, index) => {
                    return (<UserInformation user={ element } key={ index }/>)
                  }
                )
              }
            </div>
    )
  }

  componentDidMount () {
    const userService = new UserService()
    userService.getUsers().then(
      users => {
        this.setState({ users: users })
      })
  }
}

export default UserInformationList
