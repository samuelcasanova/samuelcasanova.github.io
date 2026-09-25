import React from 'react'
import PropTypes from 'prop-types'
import MatchCard from '../MatchCard/MatchCard'
import './WeekCard.css'

function WeekCard ({ isCurrentWeek, week, footballers }) {
  const [collapsedState, setCollapsedState] = React.useState(!isCurrentWeek)
  const toggleCollapsedState = () => {
    setCollapsedState(!collapsedState)
  }

  return (
    <div className='weekcard'>
      <header className={week.isProblematic ? 'problematic' : ''} onClick={toggleCollapsedState}>
        {isCurrentWeek ? 'Próxima Jornada' : week.title}
      </header>
      <div style={{ display: collapsedState ? 'none' : 'block' }}>
        {
          week.matches.map(match => (
            <MatchCard key={`${match.footballer} ${match.startsAt}`} match={match} footballer={footballers[match.footballer]} />
          ))
        }
      </div>
    </div>
  )
}

WeekCard.propTypes = {
  isCurrentWeek: PropTypes.bool.isRequired,
  week: PropTypes.shape({
    title: PropTypes.string.isRequired,
    isProblematic: PropTypes.bool.isRequired,
    matches: PropTypes.array.isRequired
  }).isRequired,
  footballers: PropTypes.object.isRequired
}

export default WeekCard
