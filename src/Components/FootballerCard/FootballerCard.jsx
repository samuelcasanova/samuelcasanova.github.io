import React from 'react'
import PropTypes from 'prop-types'
import './FootballerCard.css'

function FootballerCard ({ footballer }) {
  const name = footballer.name
  const imageUrl = footballer.imageUrl
  const statsUrl = footballer.statsUrl

  return (
          <div className='footballercard'>
            <a href= { statsUrl } target="_blank" rel="noreferrer">
              <img src={ imageUrl } alt={ name } />
            </a>
          </div>
  )
}

FootballerCard.propTypes = {
  footballer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    statsUrl: PropTypes.string
  })
}

export default FootballerCard
