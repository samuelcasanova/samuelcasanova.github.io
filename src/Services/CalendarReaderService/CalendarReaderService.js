import HtmlCodeFromURLService from '../HtmlCodeFromUrlService/HtmlCodeFromUrlService'
import CalendarTableParseService from '../CalendarTableParseService/CalendarTableParseService'
import CalendarMergerService from '../CalendarMergerService/CalendarMergerService'
import config from '../../config.json'
import ApplicationDataService from '../ApplicationDataService/ApplicationDataService'

class CalendarReaderService {
  calendarMergerService
  calendarTableParseService
  applicationDataService

  constructor () {
    this.calendarMergerService = new CalendarMergerService()
    this.calendarTableParseService = new CalendarTableParseService()
    this.applicationDataService = new ApplicationDataService()
  }

  async getCalendar () {
    const player1Name = config.players[0].playerName
    const player1CalendarUrl = config.players[0].calendarUrl
    const player2Name = config.players[1].playerName
    const player2CalendarUrl = config.players[1].calendarUrl
    const player1Matches = await this.getMatchesFromURL(player1CalendarUrl, player1Name)
    const player2Matches = await this.getMatchesFromURL(player2CalendarUrl, player2Name)
    const additionalMatches = await this.getMatchesFromApplicationData()
    const fcfMatches = this.calendarMergerService.getMergedAndSortedMatches(player1Matches, player2Matches)
    const allMatches = this.calendarMergerService.getMergedAndSortedMatches(fcfMatches, additionalMatches)
    const calendar = this.calendarMergerService.createCalendarFromSortedMatches(allMatches)
    return calendar
  }

  async getMatchesFromURL (url, playerName) {
    const htmlCodeFromURLService = new HtmlCodeFromURLService()
    const calendarSourceCode = await htmlCodeFromURLService.getHtmlCodeFromURL(url)
    const matches = this.calendarTableParseService.parseMatchesFromHtmlCode(calendarSourceCode, playerName)
    return matches
  }

  async getMatchesFromApplicationData () {
    const applicationData = await this.applicationDataService.getApplicationData()
    const matches = this.calendarTableParseService.parseMatchesFromData(applicationData.additionalMatches)
    return matches
  }
}

export default CalendarReaderService
