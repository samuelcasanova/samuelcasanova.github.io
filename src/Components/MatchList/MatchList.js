import React from 'react'
import MatchCard from '../MatchCard/MatchCard'
import './MatchList.css'
import MatchService from './MatchService'

class MatchList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      matches: []
    }
  }

  render () {
    return (
            <div className="list">
              {
                this.state.matches.map(
                  (element, index) => {
                    return (<MatchCard match={ element } key={ index }/>)
                  }
                )
              }
            </div>
    )
  }

  componentDidMount () {
    const matchService = new MatchService()
    matchService.getMatches().then(
      matches => {
        this.setState({ matches: matches })
      })
  }
}

export default MatchList
