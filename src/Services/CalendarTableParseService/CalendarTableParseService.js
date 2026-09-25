import Match from '../../Models/Match/Match'
import Footballer from '../../Models/Footballer/Footballer'
import Team from '../../Models/Team/Team'

class CalendarTableParseService {
  parseMatchesFromJson (entries, footballer, category) {
    const footballerTeamName = footballer.teams.find(team => team.category === category)?.name
    return entries.map(entry => {
      const homeTeam = (entry.homeTeamName ? new Team(entry.homeTeamName, category) : null)
      const awayTeam = (entry.awayTeamName ? new Team(entry.awayTeamName, category) : null)

      const match = new Match(homeTeam, awayTeam)
      match.matchday = entry.matchday
      match.setDatetime(new Date(`${entry.date}T${entry.time}:00Z`))
      match.footballer = footballer
      match.result = entry.result
      match.fieldName = entry.fieldName
      match.isAway = entry.awayTeamName === footballerTeamName
      return match
    })
  }

  parseMatchesFromData (matchesData) {
    const matches = []
    for (const matchData of matchesData) {
      const datetime = this.parseDateAndTime(matchData.date, matchData.time)

      const homeTeam = new Team(matchData.homeTeamName)
      homeTeam.calendarUrl = matchData.homeTeamCalendarUrl
      homeTeam.logoUrl = matchData.homeTeamLogoUrl
      homeTeam.fieldName = matchData.fieldName

      const awayTeam = new Team(matchData.awayTeamName)
      awayTeam.calendarUrl = matchData.awayTeamCalendarUrl
      awayTeam.logoUrl = matchData.awayTeamLogoUrl

      const match = new Match(homeTeam, awayTeam)
      match.setDatetime(datetime)
      match.footballer = new Footballer(matchData.footballerName)
      match.isAway = matchData.isAway
      matches.push(match)
    }
    return matches
  }

  parseDateAndTime (dateString, timeString) {
    const day = dateString.substring(0, 2)
    const month = dateString.substring(3, 5)
    const year = dateString.substring(6)
    const hour = timeString.substring(0, 2)
    const minute = timeString.substring(3)
    const datetime = new Date(Date.UTC(year, month - 1, day, hour, minute))
    return datetime
  }

  dateTimeToString (datetime) {
    return datetime.toDateString()
  }
}

export default CalendarTableParseService
