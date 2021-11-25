import React from 'react'
import WeekCard from '../WeekCard/WeekCard'
import CalendarReaderService from '../../Services/CalendarReaderService/CalendarReaderService'
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

  async componentDidMount () {
    const calendarReaderService = new CalendarReaderService()

    const cachedCalendar = calendarReaderService.getCachedCalendar(this.props.calendarName)
    if (cachedCalendar) {
      this.setState({ calendar: cachedCalendar })
    }

    try {
      const liveCalendar = await calendarReaderService.getLiveCalendar(this.props.calendarName)
      if (liveCalendar && liveCalendar.weeks) {
        this.setState({ calendar: liveCalendar })
        calendarReaderService.setCachedCalendar(this.props.calendarName, liveCalendar)
      }
    } catch (error) {
      console.error(error.message)
    }
  }
}

Calendar.propTypes = {
  calendarName: PropTypes.string.isRequired
}

export default Calendar
