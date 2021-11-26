import React from 'react'
import './MatchCard.css'
import PropTypes from 'prop-types'
import FootballerCard from '../FootballerCard/FootballerCard'
import FieldCard from '../FieldCard/FieldCard'

class MatchCard extends React.Component {
  render () {
    let matchDetails = ''
    if (this.props.match.isResting) {
      matchDetails = <div className='datetime'>(Descansa)</div>
    } else if (this.props.match.isRivalRetired) {
      matchDetails = <div className='datetime'>(Retirado)</div>
    } else {
      matchDetails = (<div className='datetime'>
                        <span> { this.props.match.date } </span>
                        <span> { this.props.match.time } </span>
                      </div>)
    }
    return (
        <div className='container'>
            {matchDetails}
            <span className='footballer'><FootballerCard footballer={ this.props.match.footballer }/></span>
            <a className='homeTeamName' href={ this.props.match.homeTeam?.calendarUrl } target="_blank" rel="noreferrer">
              { this.props.match.homeTeam?.displayName }
            </a>
            <a className='homeTeamLogo' href={ this.props.match.homeTeam?.calendarUrl } target="_blank" rel="noreferrer">
              <img src={ this.props.match.homeTeam?.logoUrl }/>
            </a>
            <span className='vs'>vs</span>
            <a className='awayTeamLogo' href={ this.props.match.awayTeam?.calendarUrl } target="_blank" rel="noreferrer">
              <img src={ this.props.match.awayTeam?.logoUrl }/>
            </a>
            <a className='awayTeamName' href={ this.props.match.awayTeam?.calendarUrl } target="_blank" rel="noreferrer">
              { this.props.match.awayTeam?.displayName }
            </a>
            <span className='isAway'> <FieldCard match={ (this.props.match) }/></span>
        </div>
    )
  }
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    matchday: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    footballer: PropTypes.object.isRequired,
    homeTeam: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      calendarUrl: PropTypes.string,
      logoUrl: PropTypes.string
    }),
    awayTeam: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      calendarUrl: PropTypes.string,
      logoUrl: PropTypes.string
    }),
    isAway: PropTypes.bool.isRequired,
    isRivalRetired: PropTypes.bool,
    isResting: PropTypes.bool
  })
}

export default MatchCard
