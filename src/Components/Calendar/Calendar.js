import React from 'react'
import WeekCard from '../WeekCard/WeekCard'
import CalendarService from './CalendarService'
import PropTypes from 'prop-types'
import './Calendar.css'

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

    if (this.state.calendar && this.state.calendar.weeks && this.state.calendar.weeks.length === 0) {
      const cachedCalendar = calendarService.getCachedCalendar(this.props.calendarName)
      if (cachedCalendar) {
        this.setState({ calendar: cachedCalendar })
      }
    }

    calendarService.getLiveCalendar(this.props.calendarName).then(
      liveCalendar => {
        if (liveCalendar && liveCalendar.weeks && liveCalendar.weeks.length > 0) {
          this.setState({ calendar: liveCalendar })
          calendarService.setCachedCalendar(this.props.calendarName, liveCalendar)
        }
      })
  }
}

Calendar.propTypes = {
  calendarName: PropTypes.string.isRequired
}

export default Calendar
