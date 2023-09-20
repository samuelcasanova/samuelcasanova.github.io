import React from 'react'
import Menu from '../Menu/Menu'
import './Header.css'

function Header () {
  return (
          <header className="header">
              <div>
                <img src='https://files.fcf.cat/escudos/clubes/escudos/00100_0000754057_premierbcn_200x200.png' alt='icon' />
                <img src='https://files.fcf.cat/escudos/clubes/escudos/00100_0000741560_canyelles_200x200.png' alt='icon' />
              </div>
              <p>
                  Partidos de Alex, Victor y Míster
              </p>
              <Menu/>
          </header>
  )
}

export default Header
