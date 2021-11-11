import HtmlCodeFromURLService from '../HtmlCodeFromUrlService/HtmlCodeFromUrlService'
import CalendarTableParseService from '../CalendarTableParseService/CalendarTableParseService'
import CalendarMergerService from '../CalendarMergerService/CalendarMergerService'
import config from '../../config.json'
import ApplicationDataService from '../ApplicationDataService/ApplicationDataService'
import Footballer from '../../Models/Footballer/Footballer'

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
    let homePageFootballerMatches = []
    for (const footballerName of config.homePageFootballerNames) {
      const footballer = new Footballer(footballerName)
      const footballerCalendarUrl = footballer.teams[0].calendarUrl
      const footballerMatches = await this.getMatchesFromURL(footballerCalendarUrl, footballer)
      homePageFootballerMatches = this.calendarMergerService.getMergedAndSortedMatches(homePageFootballerMatches,
        footballerMatches)
    }

    const additionalMatches = await this.getMatchesFromApplicationData()

    const allMatches = this.calendarMergerService.getMergedAndSortedMatches(homePageFootballerMatches, additionalMatches)
    const calendar = this.calendarMergerService.createCalendarFromSortedMatches(allMatches)
    return calendar
  }

  async getMatchesFromURL (url, footballer) {
    const htmlCodeFromURLService = new HtmlCodeFromURLService()
    const calendarSourceCode = await htmlCodeFromURLService.getHtmlCodeFromURL(url)
    const matches = this.calendarTableParseService.parseMatchesFromHtmlCode(calendarSourceCode, footballer)
    return matches
  }

  async getMatchesFromApplicationData () {
    const applicationData = await this.applicationDataService.getApplicationData()
    const matches = this.calendarTableParseService.parseMatchesFromData(applicationData.additionalMatches)
    return matches
  }
}

export default CalendarReaderService
