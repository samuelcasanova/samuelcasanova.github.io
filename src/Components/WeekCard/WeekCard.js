import React from 'react'
import PropTypes from 'prop-types'
import MatchCard from '../MatchCard/MatchCard'
import './WeekCard.css'
import Collapsible from 'react-collapsible'

class WeekCard extends React.Component {
  render () {
    let matchdaytext = null
    let isCollapsibleOpen = false
    let collapsibleTriggerClass = 'collapsible'
    if (this.props.isCurrentWeek || this.props.week.matches.length === 0) {
      matchdaytext = 'Próxima Jornada'
      isCollapsibleOpen = true
    } else {
      matchdaytext = 'Jornada ' + this.props.week.matches[0].matchday + ' ' + this.props.week.shortDescription
    }
    if (this.props.week.isProblematic) {
      collapsibleTriggerClass += ' problematic'
    }
    return (
            <div className='weekcard'>
              {/* <div className='matchdaytext'>{matchdaytext}</div> */}
              <Collapsible trigger={matchdaytext} triggerTagName='div' open={isCollapsibleOpen} triggerClassName={collapsibleTriggerClass}
                triggerOpenedClassName={collapsibleTriggerClass}>
                <div>
                  {
                    this.props.week.matches.map(
                      (element, index) => {
                        return (<MatchCard match={ element } key={ index }/>)
                      }
                    )
                  }
                </div>
              </Collapsible>
            </div>
    )
  }
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
