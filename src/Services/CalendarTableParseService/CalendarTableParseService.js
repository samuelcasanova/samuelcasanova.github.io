import Match from '../../Models/Match/Match'
import Footballer from '../../Models/Footballer/Footballer'
import Team from '../../Models/Team/Team'

class CalendarTableParseService {
  parseMatchesFromHtmlCode (htmlCode, footballer) {
    const trRows = this.readMatchesRows(htmlCode)

    const matches = []

    for (let i = 0; i < trRows.length; i++) {
      const tdFields = trRows.item(i).getElementsByTagName('td')
      const matchdayString = this.readMatchDayFromRow(tdFields)
      const datetime = this.getDatetimeFromRow(tdFields)
      const homeTeamName = this.getHomeTeamFromRow(tdFields)
      const awayTeamName = this.getAwayTeamFromRow(tdFields)
      const resultString = this.getResultFromRow(tdFields)
      const homeTeam = (homeTeamName ? new Team(homeTeamName) : null)
      const awayTeam = (awayTeamName ? new Team(awayTeamName) : null)

      const match = new Match(homeTeam, awayTeam)
      match.matchday = matchdayString
      match.setDatetime(datetime)
      match.footballer = footballer
      match.result = resultString
      matches.push(match)
    }

    return matches
  }

  parseMatchesFromData (matchesData) {
    const matches = []
    for (const matchData of matchesData) {
      const homeTeamName = matchData.homeTeamName
      const awayTeamName = matchData.awayTeamName
      const datetime = this.parseDateAndTime(matchData.date, matchData.time)
      const match = new Match(new Team(homeTeamName), new Team(awayTeamName))
      match.setDatetime(datetime)
      match.footballer = new Footballer(matchData.footballerName)
      match.result = matchData.result
      matches.push(match)
    }
    return matches
  }

  getResultFromRow (tdFields) {
    return tdFields.item(5).textContent.trim()
  }

  getAwayTeamFromRow (tdFields) {
    const awayTeamString = tdFields.item(4).textContent.trim()
    return awayTeamString
  }

  getHomeTeamFromRow (tdFields) {
    const homeTeamString = tdFields.item(3).textContent.trim()
    return homeTeamString
  }

  getDatetimeFromRow (tdFields) {
    const dateString = tdFields.item(1).textContent.trim()
    const timeString = tdFields.item(2).textContent.trim()
    const datetime = this.parseDateAndTime(dateString, timeString)
    return datetime
  }

  readMatchDayFromRow (tdFields) {
    return tdFields.item(0).textContent.trim()
  }

  readMatchesRows (htmlCode) {
    const domParser = new DOMParser()
    const htmlDocument = domParser.parseFromString(htmlCode, 'text/html')
    const tableDocument = htmlDocument.getElementsByClassName('fcftable').item(0)
    const tableBodyDocument = tableDocument.getElementsByTagName('tbody').item(0)
    const trRows = tableBodyDocument.getElementsByTagName('tr')
    return trRows
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
