import React, { useState } from 'react'
import './Menu.css'

const Menu = () => {
  const [open, setOpen] = useState(false)

  const setMenuState = () => {
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
        <a href="https://www.fcf.cat/classificacio/2022/futbol-7/benjami-7-tercera-divisio/grup-6">Clasificación Alex</a>
        <a href="https://www.fcf.cat/classificacio/2022/futbol-7/prebenjami-7/grup-18">Clasificación Victor</a>
        <a href="https://www.fcf.cat/classificacio/2022/futbol-7/alevi-tercera-divisio/grup-3">Clasificación Míster Alevines</a>
        <a href="https://www.fcf.cat/classificacio/2022/futbol-11/cadet-segona-divisio/grup-17">Clasificación Míster Cadetes</a>
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
