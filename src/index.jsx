import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { Switch, Route, HashRouter } from 'react-router-dom'
import Calendar from './Components/Calendar/Calendar'
import Categories from './Components/Categories/Categories'
import { calendars, footballers } from './data/calendars.json'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <HashRouter>
      <Header/>
      <Switch>
        <Route key='categories' path='/categorias' component={Categories}/>
        {calendars.map(calendar => (
          <Route key={calendar.name} exact path={calendar.path}><Calendar calendar={calendar} footballers={footballers}/></Route>
        ))}
      </Switch>
      <Footer />
    </HashRouter>
  </React.StrictMode>
)
