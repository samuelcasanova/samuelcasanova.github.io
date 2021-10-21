import CalendarReaderService from '../../Services/CalendarReaderService/CalendarReaderService'

class CalendarService {
  async getCalendar () {
    const calendarReaderService = new CalendarReaderService()
    const calendar = await calendarReaderService.getCalendar()
    return calendar
  }
}

export default CalendarService
