import React from 'react'
import PropTypes from 'prop-types'
import './FootballerCard.css'

class FootballerCard extends React.Component {
  render () {
    const name = this.props.footballer.name
    const imageUrl = this.props.footballer.imageUrl
    const statsUrl = this.props.footballer.statsUrl

    return (
            <div className='footballercard'>
              <a href= { statsUrl } target="_blank" rel="noreferrer" >
                <img src={ imageUrl } alt={ name } />
              </a>
            </div>
    )
  }
}

FootballerCard.propTypes = {
  footballer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    statsUrl: PropTypes.string
  })
}

export default FootballerCard
