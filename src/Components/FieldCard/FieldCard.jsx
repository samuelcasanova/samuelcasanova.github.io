import React from 'react'
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

export default FieldCard
