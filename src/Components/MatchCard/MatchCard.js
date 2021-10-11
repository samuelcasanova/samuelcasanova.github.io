import React from 'react'
import './MatchCard.css'
import PropTypes from 'prop-types'

class MatchCard extends React.Component {
  render () {
    return (
            <div className="card">
                <span> { this.props.match.matchday } </span>
                <span> { this.props.match.date } </span>
                <span> { this.props.match.time } </span>
                <span> { this.props.match.home } </span>
                <span> { this.props.match.away } </span>
            </div>
    )
  }
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    matchday: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    home: PropTypes.string.isRequired,
    away: PropTypes.string.isRequired
  })
}

export default MatchCard
