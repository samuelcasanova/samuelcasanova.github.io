import React from 'react'
import CharacterCard from '../CharacterCard/CharacterCard'
import './CharactersList.css'
import CharacterService from './CharacterService'

class CharactersList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      characters: []
    }
  }

  render () {
    return (
            <div className="list">
              {
                this.state.characters.map(
                  (element, index) => {
                    return (<CharacterCard character={ element } key={ index }/>)
                  }
                )
              }
            </div>
    )
  }

  componentDidMount () {
    const characterService = new CharacterService()
    characterService.getCharacters().then(
      characters => {
        this.setState({ characters: characters })
      })
  }
}

export default CharactersList
