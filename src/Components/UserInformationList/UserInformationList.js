import React from 'react'
import UserInformation from '../UserInformation/UserInformation'
import './UserInformationList.css'

class UserInformationList extends React.Component {
  render () {
    return (
            <div className="list">
                <UserInformation/>
                <UserInformation/>
                <UserInformation/>
                <UserInformation/>
                <UserInformation/>
            </div>
    )
  }
}

export default UserInformationList
