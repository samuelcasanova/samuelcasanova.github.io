import React, { useState } from 'react'
import './Menu.css'

const Menu = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button className={ open ? 'burger burger-open' : 'burger burger-close'} onClick={() => { setOpen(!open) }}>
        <span className='materialicons'>{ open ? 'close' : 'menu' }</span>
      </button>
      <div className={ open ? 'menu menu-open' : 'menu menu-close'}>
        <a href="/#/">Calendario</a>
        <a href="/#/Categorias">Categorías</a>
        <a href="https://www.fcf.cat/classificacio/2022/futbol-7/benjami-7-tercera-divisio/grup-6">Clasificación Alex</a>
        <a href="https://www.fcf.cat/classificacio/2022/futbol-7/prebenjami-7/grup-18">Clasificación Victor</a>
      </div>
    </div>
  )
}
export default Menu
