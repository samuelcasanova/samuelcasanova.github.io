import HtmlCodeFromURLService from '../HtmlCodeFromUrlService/HtmlCodeFromUrlService'
import CalendarTableParseService from '../CalendarTableParseService/CalendarTableParseService'
import CalendarMergerService from '../CalendarMergerService/CalendarMergerService'

class CalendarReaderService {
  preBenjaminUrl = 'https://www.fcf.cat/calendari-equip/2022/futbol-7/prebenjami-7/grup-18/escola-de-futbol-premier-barcelona-d'
  benjaminUrl = 'https://www.fcf.cat/calendari-equip/2022/futbol-7/benjami-7-tercera-divisio/grup-6/escola-de-futbol-premier-barcelona-f'
  preBenjaminPlayerName = 'Victor'
  benjaminPlayerName = 'Alex'

  async getCalendar () {
    const benjaminMatches = await this.getMatchesFromURL(this.benjaminUrl, this.benjaminPlayerName)
    const preBenjaminMatches = await this.getMatchesFromURL(this.preBenjaminUrl, this.preBenjaminPlayerName)
    const calendarMergerService = new CalendarMergerService()
    const calendar = calendarMergerService.mergeMatchesIntoCalendar(benjaminMatches, preBenjaminMatches)
    return calendar
  }

  async getMatchesFromURL (url, playerName) {
    const htmlCodeFromURLService = new HtmlCodeFromURLService()
    const calendarSourceCode = await htmlCodeFromURLService.getHtmlCodeFromURL(url)
    const calendarTableParseService = new CalendarTableParseService()
    const matches = calendarTableParseService.parseMatches(calendarSourceCode, playerName)
    return matches
  }
}

export default CalendarReaderService
