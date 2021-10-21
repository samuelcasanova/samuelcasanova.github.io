import HtmlCodeFromURLService from '../HtmlCodeFromUrlService/HtmlCodeFromUrlService'
import CalendarTableParseService from '../CalendarTableParseService/CalendarTableParseService'
import CalendarMergerService from '../CalendarMergerService/CalendarMergerService'
import config from '../../config.json'

class CalendarReaderService {
  async getCalendar () {
    const player1Name = config.players[0].playerName
    const player1CalendarUrl = config.players[0].calendarUrl
    const player2Name = config.players[1].playerName
    const player2CalendarUrl = config.players[1].calendarUrl
    const player1Matches = await this.getMatchesFromURL(player1CalendarUrl, player1Name)
    const player2Matches = await this.getMatchesFromURL(player2CalendarUrl, player2Name)
    const calendarMergerService = new CalendarMergerService()
    const calendar = calendarMergerService.mergeMatchesIntoCalendar(player1Matches, player2Matches)
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
