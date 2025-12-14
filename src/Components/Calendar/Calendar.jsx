import React from 'react'
import WeekCard from '../WeekCard/WeekCard'
import useCalendar from './useCalendar'
import PropTypes from 'prop-types'
import './Calendar.css'

function Calendar ({ calendarName }) {
  const calendar = useCalendar(calendarName)

  let nextweek = null
  if (calendar.currentWeekIndex !== -1) {
    nextweek = <WeekCard week={ calendar.weeks[calendar.currentWeekIndex] } isCurrentWeek= { true }/>
  }
  const upcomingWeeks = calendar.weeks.slice(calendar.currentWeekIndex + 1)
  return (
          <div>
            <div>
              <div className='nextweek'>{nextweek}</div>
            </div>
            <div className='list'>
              {
                upcomingWeeks.map((week, index) => (
                  // <Panel
                  //   key={index}
                  //   header={'Jornada ' + week.matches[0].matchday + ' ' + week.shortDescription}
                  // >
                  <WeekCard week={ week } key={ index } isCurrentWeek={ false }/>
                ))
              }
            </div>
          </div>
  )
}

Calendar.propTypes = {
  calendarName: PropTypes.string.isRequired
}

export default Calendar
