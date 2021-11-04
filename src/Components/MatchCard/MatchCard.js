import React from 'react'
import './MatchCard.css'
import PropTypes from 'prop-types'
import PlayerCard from '../PlayerCard/PlayerCard'
import FieldCard from '../FieldCard/FieldCard'
import TeamsCard from '../TeamsCard/TeamsCard'

class MatchCard extends React.Component {
  render () {
    if (this.props.match.isResting) {
      return (
        <div className='container'>
            <span className='playerName'><PlayerCard playerName={ this.props.match.playerName }/></span>
            <span className='teams'> (Descansa) </span>
        </div>
      )
    } else if (this.props.match.isRivalRetired) {
      const retiredTeam = this.props.match.isAway ? this.props.match.homeTeam.name : this.props.match.awayTeam.name
      return (
        <div className='container'>
            <span className='playerName'><PlayerCard playerName={ this.props.match.playerName }/></span>
            <span className='teams'> { retiredTeam } (Retirado) </span>
        </div>
      )
    } else {
      return (
        <div className='container'>
            <span className='date'> { this.props.match.date } </span>
            <span className='time'> { this.props.match.time } </span>
            <span className='playerName'><PlayerCard playerName={ this.props.match.playerName }/></span>
            <span className='teams'>  <TeamsCard match={ (this.props.match) }/></span>
            <span className='isAway'> <FieldCard match={ (this.props.match) }/></span>
        </div>
      )
    }
  }
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    matchday: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    playerName: PropTypes.string.isRequired,
    homeTeam: PropTypes.object.isRequired,
    awayTeam: PropTypes.object.isRequired,
    isAway: PropTypes.bool.isRequired,
    isRivalRetired: PropTypes.bool.isRequired,
    isResting: PropTypes.bool.isRequired
  })
}

export default MatchCard
