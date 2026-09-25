import React, { useState } from 'react'
import './Menu.css'
import config from '../../config.json'
import footballersJson from '../../Models/Footballer/footballers.json'

function Menu () {
  const [open, setOpen] = useState(false)

  function setMenuState () {
    setOpen(!open)
    setMenuHeightAndTop()
  }

  return (
    <div>
      <button className={ open ? 'burger burger-open' : 'burger burger-close'} onClick={ setMenuState }>
        <span className='materialicons'>{ open ? 'close' : 'menu' }</span>
      </button>
      <div className={ open ? 'menu menu-open' : 'menu menu-close'} onClick={() => { setOpen(false) }}>
        {config.calendars.map(calendar => (
          <a key={calendar.name} href={`/#${calendar.path}`}>{calendar.label}</a>
        ))}
        <a href="/#/categorias">Categorías</a>
        {footballersJson.footballers.flatMap(footballer => footballer.teams).map(team => (
          <a key={team.category} href={team.standingsUrl}>Clasificación {team.category}</a>
        ))}
      </div>
    </div>
  )
}

function setMenuHeightAndTop () {
  const headerHeight = document.getElementsByTagName('header')[0].clientHeight
  const viewportHeight = window.innerHeight
  const menuHeight = viewportHeight - headerHeight

  const menuElement = document.getElementsByClassName('menu')[0]
  menuElement.style.height = menuHeight + 'px'
  menuElement.style.top = headerHeight + 'px'
}

export default Menu
