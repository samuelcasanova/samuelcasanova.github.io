import React from 'react'
import PropTypes from 'prop-types'
import MatchCard from '../MatchCard/MatchCard'
import './WeekCard.css'
import Collapse from 'rc-collapse'

function WeekCard ({ isCurrentWeek, week }) {
  let matchdaytext = null
  // let collapsibleTriggerClass = 'collapsible'
  let defaultActiveKey = []
  if (isCurrentWeek || week.matches.length === 0) {
    matchdaytext = 'Próxima Jornada'
    defaultActiveKey = ['1']
  } else {
    matchdaytext = 'Jornada ' + week.matches[0].matchday + ' ' + week.shortDescription
  }
  if (week.isProblematic) {
    // collapsibleTriggerClass += ' problematic'
  }

  const collapsibleItem = [
    {
      key: '1',
      label: matchdaytext,
      children: week.matches.map((match, index) => <MatchCard key={index} match={match} />)
    }
  ]

  return (
    <div className='weekcard'>
      <Collapse collapsible='header' accordion defaultActiveKey={defaultActiveKey} items={collapsibleItem} />
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
