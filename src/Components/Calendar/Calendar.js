import React from 'react'
import WeekCard from '../WeekCard/WeekCard'
import CalendarService from './CalendarService'

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      calendar: {
        currentWeekIndex: -1,
        weeks: []
      }
    }
  }

  render () {
    let nextweek = null
    if (this.state.calendar.currentWeekIndex !== -1) {
      nextweek = <WeekCard week={ this.state.calendar.weeks[this.state.calendar.currentWeekIndex] } isCurrentWeek= { true }/>
    }
    return (
            <div>
              <div>
                <div className='nextweek'>{nextweek}</div>
              </div>
              <div className='list'>
                {
                  this.state.calendar.weeks.slice(this.state.calendar.currentWeekIndex + 1).map(
                    (element, index) => {
                      return (<WeekCard week={ element } key={ index } isCurrentWeek={ false }/>)
                    }
                  )
                }
              </div>
            </div>
    )
  }

  componentDidMount () {
    const calendarService = new CalendarService()
    calendarService.getCalendar().then(
      calendar => {
        this.setState({ calendar: calendar })
      })
  }
}

export default Calendar
