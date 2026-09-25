import React from 'react'
import WeekCard from '../WeekCard/WeekCard'
import PropTypes from 'prop-types'
import { getCurrentWeekIndex } from './currentWeek'
import './Calendar.css'

function Calendar ({ calendar, footballers, now = new Date() }) {
  const currentWeekIndex = getCurrentWeekIndex(calendar.weeks, now)
  const currentWeek = calendar.weeks[currentWeekIndex]
  const upcomingWeeks = calendar.weeks.slice(currentWeekIndex + 1)
  return (
          <div>
            <div>
              <div className='nextweek'>
                {currentWeek && <WeekCard week={ currentWeek } footballers={ footballers } isCurrentWeek={ true }/>}
              </div>
            </div>
            <div className='list'>
              {
                upcomingWeeks.map(week => (
                  <WeekCard week={ week } footballers={ footballers } key={ week.endsAt } isCurrentWeek={ false }/>
                ))
              }
            </div>
          </div>
  )
}

Calendar.propTypes = {
  calendar: PropTypes.shape({
    weeks: PropTypes.array.isRequired
  }).isRequired,
  footballers: PropTypes.object.isRequired,
  now: PropTypes.instanceOf(Date)
}

export default Calendar
