import Match from '../../Models/Match'

class CalendarTableParseService {
  parseMatches (htmlCode) {
    const domParser = new DOMParser()
    const htmlDocument = domParser.parseFromString(htmlCode, 'text/html')
    const tableDocument = htmlDocument.getElementsByClassName('fcftable').item(0)
    const tableBodyDocument = tableDocument.getElementsByTagName('tbody').item(0)
    const trRows = tableBodyDocument.getElementsByTagName('tr')

    const matches = []

    for (let i = 0; i < trRows.length; i++) {
      const match = new Match()
      const tdFields = trRows.item(i).getElementsByTagName('td')
      match.matchday = tdFields.item(0).textContent.trim()
      match.date = tdFields.item(1).textContent.trim()
      match.time = tdFields.item(2).textContent.trim()
      match.datetime = this.parseDateAndTime(tdFields.item(1).textContent.trim(), tdFields.item(2).textContent.trim())
      match.home = this.transformTeamName(tdFields.item(3).textContent.trim())
      match.away = this.transformTeamName(tdFields.item(4).textContent.trim())
      match.result = tdFields.item(5).textContent.trim()
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
    const datetime = new Date(year, month - 1, day, hour, minute)
    return datetime
  }

  dateTimeToString (datetime) {
    return datetime.toDateString()
  }

  transformTeamName (teamNameString) {
    return teamNameString.replace('ESCOLA DE FUTBOL PREMIER BARCELONA', 'PREMIER')
  }
}

export default CalendarTableParseService
