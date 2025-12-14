import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { Switch, Route, HashRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import Calendar from './Components/Calendar/Calendar'
import Categories from './Components/Categories/Categories'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <HashRouter>
      <Header/>
      <Switch>
        <Route key='home' exact path='/'><Calendar calendarName='home'/></Route>
        <Route key='loupes' path='/loupes'><Calendar calendarName='loupes'/></Route>
        <Route key='categories' path='/categorias' component={Categories}/>
      </Switch>
      <Footer />
    </HashRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
