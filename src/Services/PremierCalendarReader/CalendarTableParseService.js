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
      match.round = tdFields.item(0).textContent.trim()
      match.date = tdFields.item(1).textContent.trim()
      match.time = tdFields.item(2).textContent.trim()
      match.home = tdFields.item(3).textContent.trim()
      match.away = tdFields.item(4).textContent.trim()
      match.result = tdFields.item(5).textContent.trim()
      matches.push(match)
    }

    return matches
  }
}

export default CalendarTableParseService
