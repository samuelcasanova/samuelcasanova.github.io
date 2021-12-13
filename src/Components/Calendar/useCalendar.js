import { useState, useEffect } from 'react'
import CalendarReaderService from '../../Services/CalendarReaderService/CalendarReaderService'

function useCalendar (calendarName) {
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

  return calendar
}

export default useCalendar
