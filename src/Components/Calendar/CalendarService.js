import PremierCalendarReaderService from '../../Services/PremierCalendarReader/PremierCalendarReaderService'

class CalendarService {
  async getCalendar () {
    const premierCalendarReaderService = new PremierCalendarReaderService()
    const premierCalendar = await premierCalendarReaderService.getPremierCalendar()
    return premierCalendar
  }
}

export default CalendarService
