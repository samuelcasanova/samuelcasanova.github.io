import React from 'react'
import PropTypes from 'prop-types'
import './FieldCard.css'

function FieldCard ({ match }) {
  if (!match.fieldMapUrl) {
    return null
  }
  return (
            <a className='fieldcard' href={ match.fieldMapUrl } target='_blank' rel='noreferrer' >
              <span className='materialicons'>
                { match.isAway ? 'place' : 'home' }
              </span>
            </a>
  )
}

FieldCard.propTypes = {
  match: PropTypes.shape({
    fieldMapUrl: PropTypes.string,
    isAway: PropTypes.bool.isRequired
  })
}

export default FieldCard
