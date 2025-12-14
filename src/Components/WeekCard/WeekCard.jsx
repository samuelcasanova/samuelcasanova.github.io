import React from 'react'
import PropTypes from 'prop-types'
import MatchCard from '../MatchCard/MatchCard'
import './WeekCard.css'

function WeekCard ({ isCurrentWeek, week }) {
  const matchdaytext = isCurrentWeek || week.matches.length === 0
    ? 'Próxima Jornada'
    : 'Jornada ' + week.matches[0].matchday + ' ' + week.shortDescription

  const initialCollapsedState = !isCurrentWeek
  const [collapsedState, setCollapsedState] = React.useState(initialCollapsedState)
  const toggleCollapsedState = () => {
    setCollapsedState(!collapsedState)
  }

  return (
    <div className='weekcard'>
      <header className={week.isProblematic ? 'problematic' : ''} onClick={toggleCollapsedState}>
        {matchdaytext}
      </header>
      <div style={{ display: collapsedState ? 'none' : 'block' }}>
        {
          week.matches.map((match, index) => <MatchCard key={index} match={match} />)
        }
      </div>
    </div>
  )
}

WeekCard.propTypes = {
  isCurrentWeek: PropTypes.bool.isRequired,
  week: PropTypes.shape({
    weekofyear: PropTypes.number.isRequired,
    shortDescription: PropTypes.string.isRequired,
    isProblematic: PropTypes.bool.isRequired,
    matches: PropTypes.array.isRequired
  })
}

export default WeekCard
