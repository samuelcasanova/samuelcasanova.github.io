import React from 'react'
import './UserInformation.css'
import PropTypes from 'prop-types'

class UserInformation extends React.Component {
  render () {
    return (
            <div className="card">
                <img src={ this.props.user.image } alt={ this.props.user.name } />
                <h3> { this.props.user.name } </h3>
                <p className="title"> { this.props.user.gender } </p>
                <p> { this.props.user.status } </p>
                <p><button disabled>Coming soon...</button></p>
            </div>
    )
  }
}

UserInformation.propTypes = {
  user: PropTypes.objectOf(PropTypes.string)
}

export default UserInformation
