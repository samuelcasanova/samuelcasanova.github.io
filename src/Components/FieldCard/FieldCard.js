import React from 'react'
import PropTypes from 'prop-types'
import './FieldCard.css'

class FieldCard extends React.Component {
  render () {
    let fieldIcon = null
    let fieldLinkUrl = null
    if (this.props.match.isAway) {
      fieldIcon = 'place'
      fieldLinkUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURI(this.props.match.homeTeam.fieldName)
    } else {
      fieldIcon = 'home'
      fieldLinkUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURI('Escola Premier Barcelona')
    }

    return (
              <a className='fieldcard' href={ fieldLinkUrl } target='_blank' rel='noreferrer' >
                <span className='materialicons'>
                  { fieldIcon }
                </span>
              </a>
    )
  }
}

FieldCard.propTypes = {
  match: PropTypes.shape({
    homeTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
      fieldName: PropTypes.string.isRequired
    }),
    awayTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
      fieldName: PropTypes.string.isRequired
    }),
    isAway: PropTypes.bool.isRequired
  })
}

export default FieldCard
