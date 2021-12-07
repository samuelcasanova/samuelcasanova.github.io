import React from 'react'
import PropTypes from 'prop-types'
import MatchCard from '../MatchCard/MatchCard'
import './WeekCard.css'
import Collapsible from 'react-collapsible'

function WeekCard ({ isCurrentWeek, week }) {
  let matchdaytext = null
  let isCollapsibleOpen = false
  let collapsibleTriggerClass = 'collapsible'
  if (isCurrentWeek || week.matches.length === 0) {
    matchdaytext = 'Próxima Jornada'
    isCollapsibleOpen = true
  } else {
    matchdaytext = 'Jornada ' + week.matches[0].matchday + ' ' + week.shortDescription
  }
  if (week.isProblematic) {
    collapsibleTriggerClass += ' problematic'
  }
  return (
          <div className='weekcard'>
            {/* <div className='matchdaytext'>{matchdaytext}</div> */}
            <Collapsible trigger={matchdaytext} triggerTagName='div' open={isCollapsibleOpen} triggerClassName={collapsibleTriggerClass}
              triggerOpenedClassName={collapsibleTriggerClass}>
              <div>
                {
                  week.matches.map(
                    (match, index) => {
                      return (<MatchCard match={ match } key={ index }/>)
                    }
                  )
                }
              </div>
            </Collapsible>
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
