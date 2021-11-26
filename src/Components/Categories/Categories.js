import React from 'react'
import './Categories.css'
import FootballerCard from '../FootballerCard/FootballerCard'
import Footballer from '../../Models/Footballer/Footballer'

class Categories extends React.Component {
  render () {
    const alexFootballer = new Footballer('Alex')
    const victorFootballer = new Footballer('Victor')
    const loupesFootballer = new Footballer('Loupes')

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Edad</th>
              <th>Modalidad</th>
              <th>Quién</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pre-benjamines</td>
              <td>6 y 7 años</td>
              <td>Fútbol 7</td>
              <td><FootballerCard footballer={victorFootballer}/></td>
            </tr>
            <tr>
              <td>Benjamines</td>
              <td>8 y 9 años</td>
              <td>Fútbol 7</td>
              <td><FootballerCard footballer={alexFootballer}/></td>
            </tr>
            <tr>
              <td>Alevines</td>
              <td>10 y 11 años</td>
              <td>Fútbol 7</td>
              <td><FootballerCard footballer={loupesFootballer}/></td>
            </tr>
            <tr>
              <td>Infantiles</td>
              <td>12 y 13 años</td>
              <td>Fútbol 11</td>
              <td></td>
            </tr>
            <tr>
              <td>Cadetes</td>
              <td>14 y 15 años</td>
              <td>Fútbol 11</td>
              <td><FootballerCard footballer={loupesFootballer}/></td>
            </tr>
            <tr>
              <td>Juveniles</td>
              <td>16 a 19 años</td>
              <td>Fútbol 11</td>
              <td></td>
            </tr>
            <tr>
              <td>Sénior</td>
              <td>20 años o más</td>
              <td>Fútbol 11</td>
              <td><FootballerCard footballer={loupesFootballer}/></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Categories
