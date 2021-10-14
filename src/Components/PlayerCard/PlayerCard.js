import React from 'react'
import PropTypes from 'prop-types'
import './PlayerCard.css'

class PlayerCard extends React.Component {
  render () {
    const playerPictureUrl = '/players/' + this.props.playerName + '.png'
    return (
            <div className='playercard'>
                <img src={ playerPictureUrl } alt={ this.props.playerName } />
            </div>
    )
  }
}

PlayerCard.propTypes = {
  playerName: PropTypes.string.isRequired
}

export default PlayerCard
