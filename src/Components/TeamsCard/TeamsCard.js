import React from 'react'
import PropTypes from 'prop-types'

class TeamsCard extends React.Component {
  render () {
    return (
      <span>
        <a href={ this.props.match.homeTeam.calendarUrl }>{ this.props.match.homeTeam.name }</a> vs <a href={ this.props.match.awayTeam.calendarUrl }>{ this.props.match.awayTeam.name }</a>
      </span>
    )
  }
}

TeamsCard.propTypes = {
  match: PropTypes.shape({
    homeTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
      calendarUrl: PropTypes.string.isRequired
    }),
    awayTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
      calendarUrl: PropTypes.string.isRequired
    })
  })
}

export default TeamsCard
