import React from 'react'
import './MatchCard.css'
import PropTypes from 'prop-types'

class MatchCard extends React.Component {
  render () {
    return (
            <div className="card">
                <span> { this.props.match.date } </span>
                <span> { this.props.match.time } </span>
                <span> { this.props.match.homeTeam } </span>
                <span> vs </span>
                <span> { this.props.match.awayTeam } </span>
            </div>
    )
  }
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    matchday: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    homeTeam: PropTypes.string.isRequired,
    awayTeam: PropTypes.string.isRequired
  })
}

export default MatchCard
