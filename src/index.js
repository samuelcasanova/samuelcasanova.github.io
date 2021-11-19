import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { Switch, Route, HashRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import Calendar from './Components/Calendar/Calendar'
import Categories from './Components/Categories/Categories'

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Header/>
      <Switch>
        <Route exact path='/'><Calendar calendarName='home'/></Route>
        <Route path='/Loupes'><Calendar calendarName='loupes'/></Route>
        <Route path='/Categorias' component={Categories}/>
      </Switch>
      <Footer />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
