import React from 'react'
import './Categories.css'
import PlayerCard from '../PlayerCard/PlayerCard'

class Categories extends React.Component {
  render () {
    return (
      <div>
        <table>
          <tr>
            <th>Categoría</th>
            <th>Edad</th>
            <th>Modalidad</th>
            <th>Quién</th>
          </tr>
          <tr>
            <td>Pre-benjamines</td>
            <td>6 y 7 años</td>
            <td>Fútbol 7</td>
            <td><PlayerCard playerName='Victor'/></td>
          </tr>
          <tr>
            <td>Benjamines</td>
            <td>8 y 9 años</td>
            <td>Fútbol 7</td>
            <td><PlayerCard playerName='Alex'/></td>
          </tr>
          <tr>
            <td>Alevines</td>
            <td>10 y 11 años</td>
            <td>Fútbol 7</td>
            <td><PlayerCard playerName='Loupes'/></td>
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
            <td><PlayerCard playerName='Loupes'/></td>
          </tr>
          <tr>
            <td>Juveniles</td>
            <td>16 a 19 años</td>
            <td>Fútbol 11</td>
            <td></td>
          </tr>
        </table>
      </div>
    )
  }
}

export default Categories
