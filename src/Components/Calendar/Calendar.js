import React from 'react'
import WeekCard from '../WeekCard/WeekCard'
import CalendarService from './CalendarService'

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      weeks: []
    }
  }

  render () {
    return (
            <div className="list">
              {
                this.state.weeks.map(
                  (element, index) => {
                    return (<WeekCard week={ element } key={ index }/>)
                  }
                )
              }
            </div>
    )
  }

  componentDidMount () {
    const calendarService = new CalendarService()
    calendarService.getCalendar().then(
      weeks => {
        this.setState({ weeks: weeks })
      })
  }
}

export default Calendar
