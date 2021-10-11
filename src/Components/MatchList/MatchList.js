import React from 'react'
import MatchCard from '../MatchCard/MatchCard'
import './MatchList.css'
import MatchService from '../Calendar/CalendarService'

class MatchList extends React.Component {
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
