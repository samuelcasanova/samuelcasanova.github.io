import PremierCalendarReaderService from '../../Services/PremierCalendarReader/PremierCalendarReaderService'

class CalendarService {
  async getCalendar () {
    const premierCalendarReaderService = new PremierCalendarReaderService()
    return premierCalendarReaderService.getPremierCalendar()
  }
}

export default CalendarService
