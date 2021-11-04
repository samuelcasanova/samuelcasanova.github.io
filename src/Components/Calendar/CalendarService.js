import CalendarReaderService from '../../Services/CalendarReaderService/CalendarReaderService'

class CalendarService {
  async getLiveCalendar () {
    const calendarReaderService = new CalendarReaderService()
    const calendar = await calendarReaderService.getCalendar()
    return calendar
  }

  getCachedCalendar () {
    const calendarJson = localStorage.getItem('calendar')
    const calendar = JSON.parse(calendarJson)
    return calendar
  }

  setCachedCalendar (calendar) {
    localStorage.setItem('calendar', JSON.stringify(calendar))
  }
}

export default CalendarService
