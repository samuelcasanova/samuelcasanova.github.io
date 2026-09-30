import React from 'react'
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

export default FootballerCard
