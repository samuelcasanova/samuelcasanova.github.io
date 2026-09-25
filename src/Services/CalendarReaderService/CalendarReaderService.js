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
    const matchesData = await this.applicationDataService.getMatchesData()

    for (const footballerName of calendarConfig.footballerNames) {
      const footballer = new Footballer(footballerName)
      for (const team of footballer.teams) {
        const footballerMatches = this.getTeamMatches(matchesData, footballer, team.category)
        allFootballerMatches = this.calendarMergerService.getMergedAndSortedMatches(allFootballerMatches,
          footballerMatches)
        console.info('CalendarReaderService.getCalendar: Got and merged matches for team %s', team.displayName)
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

  getTeamMatches (matchesData, footballer, category) {
    const entries = matchesData.footballers
      .find(footballerData => footballerData.name === footballer.name)?.teams
      .find(teamData => teamData.category === category)?.matches ?? []
    if (entries.length === 0) {
      throw new Error(`CalendarReaderService.getTeamMatches: 0 matches for ${footballer.name} in category ${category}`)
    }
    return this.calendarTableParseService.parseMatchesFromJson(entries, footballer, category)
  }

  async getMatchesFromApplicationData () {
    const applicationData = await this.applicationDataService.getApplicationData()
    const matches = this.calendarTableParseService.parseMatchesFromData(applicationData.additionalMatches)
    return matches
  }
}

export default CalendarReaderService
