import HtmlCodeFromURLService from './HtmlCodeFromURLService'
import CalendarTableParseService from './CalendarTableParseService'

// const preBenjaminUrl = 'https://www.fcf.cat/calendari-equip/2022/futbol-7/prebenjami-7/grup-18/escola-de-futbol-premier-barcelona-d'
const benjaminUrl = 'https://www.fcf.cat/calendari-equip/2022/futbol-7/benjami-7-tercera-divisio/grup-6/escola-de-futbol-premier-barcelona-f'

class PremierCalendarReaderService {
  async getBenjaminMatches (url) {
    const htmlCodeFromURLService = new HtmlCodeFromURLService()
    const benjaminCalendarSourceCode = await htmlCodeFromURLService.getHtmlCodeFromURL(benjaminUrl)
    const calendarTableParseService = new CalendarTableParseService()
    const benjaminMatches = calendarTableParseService.parseMatches(benjaminCalendarSourceCode)
    return benjaminMatches
  }
}

export default PremierCalendarReaderService
