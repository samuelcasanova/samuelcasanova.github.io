import React from 'react'
import PropTypes from 'prop-types'
import './FieldCard.css'

function FieldCard ({ match }) {
  const fieldIcon = (match.isAway ? 'place' : 'home')
  console.log('TEMP match=', match)
  const fieldLinkUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURI(match.homeTeam?.fieldName)

  return (
            <a className='fieldcard' href={ fieldLinkUrl } target='_blank' rel='noreferrer' >
              <span className='materialicons'>
                { fieldIcon }
              </span>
            </a>
  )
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
