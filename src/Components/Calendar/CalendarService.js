import CalendarReaderService from '../../Services/CalendarReaderService/CalendarReaderService'

class CalendarService {
  async getLiveCalendar (calendarName) {
    const calendarReaderService = new CalendarReaderService()
    const calendar = await calendarReaderService.getCalendar(calendarName)
    console.info('CalendarService.getLiveCalendar: Got live calendar: %s', calendarName)
    return calendar
  }

  getCachedCalendar (calendarName) {
    const calendarJson = localStorage.getItem(calendarName)
    const calendar = JSON.parse(calendarJson)
    console.info('CalendarService.getCachedCalendar: Got cached calendar: %s', calendarName)
    return calendar
  }

  setCachedCalendar (calendarName, calendar) {
    localStorage.setItem(calendarName, JSON.stringify(calendar))
    console.info('CalendarService.setCachedCalendar: Set cached calendar: %s', calendarName)
  }
}

export default CalendarService
