import React from 'react'
import PropTypes from 'prop-types'
import MatchCard from '../MatchCard/MatchCard'

class WeekCard extends React.Component {
  render () {
    return (
            <div>
              <div><span>Week { this.props.week.weekofyear }</span></div>
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
  week: PropTypes.shape({
    weekofyear: PropTypes.number.isRequired,
    matches: PropTypes.array.isRequired
  })
}

export default WeekCard
