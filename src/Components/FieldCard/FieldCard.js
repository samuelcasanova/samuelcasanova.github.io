import React from 'react'
import PropTypes from 'prop-types'
import './FieldCard.css'

class FieldCard extends React.Component {
  render () {
    const fieldIcon = (this.props.match.isAway ? 'place' : 'home')
    const fieldLinkUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURI(this.props.match.homeTeam.fieldName)

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
      fieldName: PropTypes.string.isRequired
    }),
    isAway: PropTypes.bool.isRequired
  })
}

export default FieldCard
