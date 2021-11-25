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

  getCachedCalendar (calendarName) {
    const calendarJson = localStorage.getItem(calendarName)
    const calendar = JSON.parse(calendarJson)
    console.info('CalendarReaderService.getCachedCalendar: Got cached calendar: %s', calendarName)
    return calendar
  }

  setCachedCalendar (calendarName, calendar) {
    localStorage.setItem(calendarName, JSON.stringify(calendar))
    console.info('CalendarService.setCachedCalendar: Set cached calendar: %s', calendarName)
  }

  async getLiveCalendar (calendarName) {
    let allFootballerMatches = []
    const calendarConfig = config.calendars.find(calendar => calendar.name === calendarName)

    for (const footballerName of calendarConfig.footballerNames) {
      const footballer = new Footballer(footballerName)
      for (const team of footballer.teams) {
        const footballerMatches = await this.getMatchesFromURL(team.calendarUrl, footballer, team.category)
        allFootballerMatches = this.calendarMergerService.getMergedAndSortedMatches(allFootballerMatches,
          footballerMatches)
        console.info('CalendarReaderService.getCalendar: Got and merged matches for team %s from the url:',
          team.displayName, team.calendarUrl)
      }
      console.info('CalendarReaderService.getCalendar: Got calendar for footballer %s', footballerName)
    }

    const additionalMatches = await this.getMatchesFromApplicationData()
    const footballerAdditionalMatches = additionalMatches.filter(
      match => calendarConfig.footballerNames.includes(match.footballer.name))
    console.info(`CalendarReaderService.getCalendar: Found ${footballerAdditionalMatches.length} 
      additional matches for calendar ${calendarName}`)

    const allMatches = this.calendarMergerService.getMergedAndSortedMatches(allFootballerMatches,
      footballerAdditionalMatches)
    const calendar = this.calendarMergerService.createCalendarFromSortedMatches(allMatches)
    return calendar
  }

  async getMatchesFromURL (url, footballer, category) {
    const htmlCodeFromURLService = new HtmlCodeFromURLService()
    const calendarSourceCode = await htmlCodeFromURLService.getHtmlCodeFromURL(url)
    const matches = this.calendarTableParseService.parseMatchesFromHtmlCode(calendarSourceCode, footballer, category)
    if (!matches || matches.length === 0) {
      throw new Error(`CalendarReaderService.getMatchesFromURL: 0 matches read from calendar: ${url}`)
    }
    return matches
  }

  async getMatchesFromApplicationData () {
    const applicationData = await this.applicationDataService.getApplicationData()
    const matches = this.calendarTableParseService.parseMatchesFromData(applicationData.additionalMatches)
    return matches
  }
}

export default CalendarReaderService
