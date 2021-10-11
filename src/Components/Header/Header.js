import React from 'react'
import './Header.css'

class Header extends React.Component {
  render () {
    return (
            <header className="App-header">
                <img src='/iconPremier.webp' alt='icon' />
                <p>
                    Partidos de la Premier de Alex y Victor
                </p>
            </header>
    )
  }
}

export default Header
