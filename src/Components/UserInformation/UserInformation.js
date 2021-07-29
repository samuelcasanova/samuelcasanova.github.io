import React from 'react'
import './UserInformation.css'
import PropTypes from 'prop-types'

class UserInformation extends React.Component {
  render () {
    return (
            <div className="card">
                <img src={ this.props.user.imgSrc } alt={ this.props.user.firstName } />
                <h3> { this.props.user.firstName + ' ' + this.props.user.lastName } </h3>
                <p className="title"> { this.props.user.email } </p>
                <p> { this.props.user.city } </p>
                <p><button disabled>Coming soon...</button></p>
            </div>
    )
  }
}

UserInformation.propTypes = {
  user: PropTypes.objectOf(PropTypes.string)
}

export default UserInformation
