import React from 'react'
import PropTypes from 'prop-types'
import './PlayerCard.css'

class PlayerCard extends React.Component {
  render () {
    const playerPictureUrl = '/players/' + this.props.playerName + '.png'
    const playerStatsUrl = this.props.playerName === 'Alex'
      ? 'https://www.fcf.cat/jugador/2022/futbol-7/benjami-7-tercera-divisio/grup-6/42202112/41820009'
      : 'https://www.fcf.cat/jugador/2022/futbol-7/prebenjami-7/grup-18/42489296/41994731'
    return (
            <div className='playercard'>
              <a href= { playerStatsUrl } target="_blank" rel="noreferrer" >
                <img src={ playerPictureUrl } alt={ this.props.playerName } />
              </a>
            </div>
    )
  }
}

PlayerCard.propTypes = {
  playerName: PropTypes.string.isRequired
}

export default PlayerCard
