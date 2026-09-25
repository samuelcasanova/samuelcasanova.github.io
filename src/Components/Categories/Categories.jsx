import React from 'react'
import './Categories.css'
import FootballerCard from '../FootballerCard/FootballerCard'
import { footballers } from '../../data/calendars.json'

const AGE_GROUPS = [
  { name: 'Pre-benjamines', age: '6 y 7 años', modality: 'Fútbol 7' },
  { name: 'Benjamines', age: '8 y 9 años', modality: 'Fútbol 7' },
  { name: 'Alevines', age: '10 y 11 años', modality: 'Fútbol 7' },
  { name: 'Infantiles', age: '12 y 13 años', modality: 'Fútbol 11' },
  { name: 'Cadetes', age: '14 y 15 años', modality: 'Fútbol 11' },
  { name: 'Juveniles', age: '16 a 19 años', modality: 'Fútbol 11' },
  { name: 'Sénior', age: '20 años o más', modality: 'Fútbol 11' }
]

function Categories () {
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
          {AGE_GROUPS.map(ageGroup => (
            <tr key={ageGroup.name}>
              <td>{ageGroup.name}</td>
              <td>{ageGroup.age}</td>
              <td>{ageGroup.modality}</td>
              <td>
                {Object.values(footballers)
                  .filter(footballer => footballer.ageGroup === ageGroup.name)
                  .map(footballer => <FootballerCard key={footballer.name} footballer={footballer}/>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Categories
