import React, { useState } from 'react'
import './Menu.css'

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
        <a href="/#/">Calendario Peques</a>
        <a href="/#/loupes">Calendario Míster</a>
        <a href="/#/categorias">Categorías</a>
        <a href="https://www.fcf.cat/classificacio/2526/futbol-11/infantil-segona-divisio-s14/grup-8">Clasificación Alex</a>
        <a href="https://www.fcf.cat/classificacio/2526/futbol-7/segona-divisio-alevi-s11/grup-13">Clasificación Victor</a>
        <a href="https://www.fcf.cat/classificacio/2526/futbol-femeni/primera-divisio-femeni-infantil/grup-2">Clasificación Infantil Femenino</a>
        <a href="https://www.fcf.cat/classificacio/2526/futbol-11/tercera-catalana/grup-10">Clasificación Dani</a>
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
