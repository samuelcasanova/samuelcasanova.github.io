import React from 'react'
import PropTypes from 'prop-types'
import MatchCard from '../MatchCard/MatchCard'
import './WeekCard.css'

class WeekCard extends React.Component {
  render () {
    let matchdaytext = null
    if (this.props.isCurrentWeek || this.props.week.matches.length === 0) {
      matchdaytext = <div><span>Próxima Jornada</span></div>
    } else {
      matchdaytext = <div><span>Jornada { this.props.week.matches[0].matchday }</span></div>
    }
    return (
            <div>
              <div className='matchdaytext'>{matchdaytext}</div>
              <div>
                {
                  this.props.week.matches.map(
                    (element, index) => {
                      return (<MatchCard match={ element } key={ index }/>)
                    }
                  )
                }
              </div>
            </div>
    )
  }
}

WeekCard.propTypes = {
  isCurrentWeek: PropTypes.bool.isRequired,
  week: PropTypes.shape({
    weekofyear: PropTypes.number.isRequired,
    matches: PropTypes.array.isRequired
  })
}

export default WeekCard
