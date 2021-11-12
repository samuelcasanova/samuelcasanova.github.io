import React from 'react'
import Menu from '../Menu/Menu'
import './Header.css'

class Header extends React.Component {
  render () {
    return (
            <header className="header">
                <img src='/iconPremier.webp' alt='icon' />
                <p>
                    Partidos de la Premier de Alex y Victor
                </p>
                <Menu/>
            </header>
    )
  }
}

export default Header
