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
      const datetime = this.parseDateAndTime(tdFields.item(1).textContent.trim(), tdFields.item(2).textContent.trim())
      match.datetime = datetime
      match.date = this.datetimeToDateString(datetime)
      match.time = this.datetimeToTimeString(datetime)
      match.homeTeam = this.transformTeamName(tdFields.item(3).textContent.trim())
      match.awayTeam = this.transformTeamName(tdFields.item(4).textContent.trim())
      match.result = tdFields.item(5).textContent.trim()
      match.isAway = this.isAway(match.homeTeam, match.awayTeam)
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
    const replacedToPremierShortName = teamNameString.replace('ESCOLA DE FUTBOL PREMIER BARCELONA', 'PREMIER')
    return this.toTitleCase(replacedToPremierShortName)
  }

  datetimeToDateString (datetime) {
    const formattedDateString = datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: 'short', weekday: 'short' })
    const uppercaseAndRemovedCommas = formattedDateString.toUpperCase().replace(',', '')
    return uppercaseAndRemovedCommas
  }

  datetimeToTimeString (datetime) {
    const formattedTimeString = datetime.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit' })
    const addedH = formattedTimeString + 'h'
    return addedH
  }

  toTitleCase (text) {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  isAway (homeTeam, awayTeam) {
    const isAway = awayTeam.toLowerCase().includes('premier')
    return isAway
  }
}

export default CalendarTableParseService
