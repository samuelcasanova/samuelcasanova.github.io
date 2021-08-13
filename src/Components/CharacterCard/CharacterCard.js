import React from 'react'
import './CharacterCard.css'
import PropTypes from 'prop-types'

class CharacterCard extends React.Component {
  render () {
    return (
            <div className="card">
                <img src={ this.props.character.image } alt={ this.props.character.name } />
                <h3> { this.props.character.name } </h3>
                <p className="title"> { this.props.character.gender } </p>
                <p> { this.props.character.status } </p>
                <p><button disabled>Coming soon...</button></p>
            </div>
    )
  }
}

CharacterCard.propTypes = {
  character: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  })
}

export default CharacterCard
