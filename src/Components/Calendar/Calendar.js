import React, { useState, useEffect } from 'react'
import WeekCard from '../WeekCard/WeekCard'
import CalendarReaderService from '../../Services/CalendarReaderService/CalendarReaderService'
import PropTypes from 'prop-types'
import './Calendar.css'

function Calendar ({ calendarName }) {
  const [calendar, setCalendar] = useState({
    currentWeekIndex: -1,
    weeks: []
  })

  useEffect(async () => {
    const calendarReaderService = new CalendarReaderService()

    const cachedCalendar = calendarReaderService.getCachedCalendar(calendarName)
    if (cachedCalendar) {
      setCalendar(cachedCalendar)
    }

    try {
      const liveCalendar = await calendarReaderService.getLiveCalendar(calendarName)
      if (liveCalendar && liveCalendar.weeks) {
        setCalendar(liveCalendar)
        calendarReaderService.setCachedCalendar(calendarName, liveCalendar)
      }
    } catch (error) {
      console.error(error.message)
    }
  }, [])

  let nextweek = null
  if (calendar.currentWeekIndex !== -1) {
    nextweek = <WeekCard week={ calendar.weeks[calendar.currentWeekIndex] } isCurrentWeek= { true }/>
  }
  return (
          <div>
            <div>
              <div className='nextweek'>{nextweek}</div>
            </div>
            <div className='list'>
              {
                calendar.weeks.slice(calendar.currentWeekIndex + 1).map(
                  (element, index) => {
                    return (<WeekCard week={ element } key={ index } isCurrentWeek={ false }/>)
                  }
                )
              }
            </div>
          </div>
  )
}

Calendar.propTypes = {
  calendarName: PropTypes.string.isRequired
}

export default Calendar
