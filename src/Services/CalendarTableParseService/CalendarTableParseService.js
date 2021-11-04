import Match from '../../Models/Match/Match'
import config from '../../config.json'

class CalendarTableParseService {
  parseMatchesFromHtmlCode (htmlCode, playerName) {
    const trRows = this.readMatchesRows(htmlCode)

    const matches = []

    for (let i = 0; i < trRows.length; i++) {
      const tdFields = trRows.item(i).getElementsByTagName('td')
      const matchdayString = this.readMatchDayFromRow(tdFields)
      const datetime = this.getDatetimeFromRow(tdFields)
      const homeTeam = this.getHomeTeamFromRow(tdFields)
      const awayTeam = this.getAwayTeamFromRow(tdFields)
      const resultString = this.getResultFromRow(tdFields)

      const match = new Match(homeTeam, awayTeam)
      match.matchday = matchdayString
      match.setDatetime(datetime)
      match.playerName = playerName
      match.result = resultString
      matches.push(match)
    }

    return matches
  }

  parseMatchesFromData (matchesData) {
    const matches = []
    matchesData.forEach((matchData) => {
      const homeTeamName = this.parseTeamName(matchData.homeTeamName)
      const awayTeamName = this.parseTeamName(matchData.awayTeamName)
      const datetime = this.parseDateAndTime(matchData.date, matchData.time)
      const match = new Match(homeTeamName, awayTeamName)
      match.setDatetime(datetime)
      match.playerName = matchData.playerName
      match.result = matchData.result
      matches.push(match)
    })
    return matches
  }

  getResultFromRow (tdFields) {
    return tdFields.item(5).textContent.trim()
  }

  getAwayTeamFromRow (tdFields) {
    const awayTeamString = tdFields.item(4).textContent.trim()
    const parsedAwayTeam = this.parseTeamName(awayTeamString)
    return parsedAwayTeam
  }

  getHomeTeamFromRow (tdFields) {
    const homeTeamString = tdFields.item(3).textContent.trim()
    const parsedHomeTeam = this.parseTeamName(homeTeamString)
    return parsedHomeTeam
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
    const datetime = new Date(year, month - 1, day, hour, minute)
    return datetime
  }

  dateTimeToString (datetime) {
    return datetime.toDateString()
  }

  parseTeamName (teamName) {
    let transformedTeamName = teamName
    config.teamNameReplacements.forEach((item) => {
      transformedTeamName = transformedTeamName.replace(item.teamNameToReplace, item.newTeamName)
    })
    transformedTeamName = this.toTitleCase(transformedTeamName)
    transformedTeamName = transformedTeamName.replace(/[\\]/g, '')
    return transformedTeamName
  }

  toTitleCase (text) {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

export default CalendarTableParseService
