import React from 'react'
import './MatchCard.css'
import PropTypes from 'prop-types'
import FootballerCard from '../FootballerCard/FootballerCard'
import FieldCard from '../FieldCard/FieldCard'

function MatchCard ({ match, footballer }) {
  let matchDetails = ''
  if (match.isResting) {
    matchDetails = <div className='datetime'>(Descansa)</div>
  } else if (match.isRivalRetired) {
    matchDetails = <div className='datetime'>(Retirado)</div>
  } else {
    matchDetails = (<div className='datetime'>
                      <span> { match.dateLabel } </span>
                      <span> { match.timeLabel } </span>
                    </div>)
  }
  return (
      <div className='container'>
          {matchDetails}
          <span className='footballer'><FootballerCard footballer={ footballer }/></span>
          <a className='homeTeamName' href={ match.homeTeam?.url } target="_blank" rel="noreferrer">
            { match.homeTeam?.displayName }
          </a>
          <a className='homeTeamLogo' href={ match.homeTeam?.url } target="_blank" rel="noreferrer">
            <img src={ match.homeTeam?.logoUrl }/>
          </a>
          <span className='vs'>vs</span>
          <a className='awayTeamLogo' href={ match.awayTeam?.url } target="_blank" rel="noreferrer">
            <img src={ match.awayTeam?.logoUrl }/>
          </a>
          <a className='awayTeamName' href={ match.awayTeam?.url } target="_blank" rel="noreferrer">
            { match.awayTeam?.displayName }
          </a>
          <span className='isAway'> <FieldCard match={ match }/></span>
      </div>
  )
}

const teamShape = PropTypes.shape({
  displayName: PropTypes.string.isRequired,
  url: PropTypes.string,
  logoUrl: PropTypes.string
})

MatchCard.propTypes = {
  match: PropTypes.shape({
    dateLabel: PropTypes.string.isRequired,
    timeLabel: PropTypes.string.isRequired,
    homeTeam: teamShape,
    awayTeam: teamShape,
    isAway: PropTypes.bool.isRequired,
    isRivalRetired: PropTypes.bool.isRequired,
    isResting: PropTypes.bool.isRequired
  }).isRequired,
  footballer: PropTypes.object.isRequired
}

export default MatchCard
