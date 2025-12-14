import React from 'react'
import './MatchCard.css'
import PropTypes from 'prop-types'
import FootballerCard from '../FootballerCard/FootballerCard'
import FieldCard from '../FieldCard/FieldCard'

function MatchCard ({ match }) {
  let matchDetails = ''
  if (match.isResting) {
    matchDetails = <div className='datetime'>(Descansa)</div>
  } else if (match.isRivalRetired) {
    matchDetails = <div className='datetime'>(Retirado)</div>
  } else {
    matchDetails = (<div className='datetime'>
                      <span> { match.date } </span>
                      <span> { match.time } </span>
                    </div>)
  }
  return (
      <div className='container'>
          {matchDetails}
          <span className='footballer'><FootballerCard footballer={ match.footballer }/></span>
          <a className='homeTeamName' href={ match.homeTeam?.calendarUrl } target="_blank" rel="noreferrer">
            { match.homeTeam?.displayName }
          </a>
          <a className='homeTeamLogo' href={ match.homeTeam?.calendarUrl } target="_blank" rel="noreferrer">
            <img src={ match.homeTeam?.logoUrl }/>
          </a>
          <span className='vs'>vs</span>
          <a className='awayTeamLogo' href={ match.awayTeam?.calendarUrl } target="_blank" rel="noreferrer">
            <img src={ match.awayTeam?.logoUrl }/>
          </a>
          <a className='awayTeamName' href={ match.awayTeam?.calendarUrl } target="_blank" rel="noreferrer">
            { match.awayTeam?.displayName }
          </a>
          <span className='isAway'> <FieldCard match={ (match) }/></span>
      </div>
  )
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
