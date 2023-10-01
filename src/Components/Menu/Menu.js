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
        <a href="https://www.fcf.cat/classificacio/2324/futbol-7/tercera-divisio-alevi-s12/grup-5">Clasificación Alex</a>
        <a href="https://www.fcf.cat/classificacio/2324/futbol-7/primera-divisio-benjami-s9/grup-3">Clasificación Victor</a>
        <a href="https://www.fcf.cat/classificacio/2324/futbol-femen%C3%AD/primera-divisio-femeni-alevi/grup-1">Clasificación Alevín Femenino</a>
        <a href="https://www.fcf.cat/classificacio/2324/futbol-femeni/segona-divisio-femeni-infantil/grup-16">Clasificación Infantil Femenino</a>
        <a href="https://www.fcf.cat/classificacio/2324/futbol-11/quarta-catalana/grup-18">Clasificación Míster Senior</a>
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
