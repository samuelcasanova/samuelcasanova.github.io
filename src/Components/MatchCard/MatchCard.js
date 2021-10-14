import React from 'react'
import './MatchCard.css'
import PropTypes from 'prop-types'
import PlayerCard from '../PlayerCard/PlayerCard'

class MatchCard extends React.Component {
  render () {
    return (
            <div className='container'>
                <span className='date'> { this.props.match.date } </span>
                <span className='time'> { this.props.match.time } </span>
                <span className='playerName'><PlayerCard playerName={ this.props.match.playerName }/></span>
                <span className='teams'> { this.props.match.homeTeam } vs { this.props.match.awayTeam } </span>
                <span className='isAway'> { (this.props.match.isAway) ? 'Fuera' : 'Casa' } </span>
            </div>
    )
  }
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    matchday: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    playerName: PropTypes.string.isRequired,
    homeTeam: PropTypes.string.isRequired,
    awayTeam: PropTypes.string.isRequired,
    isAway: PropTypes.bool.isRequired
  })
}

export default MatchCard
