import config from '../../config.json'

class Match {
  matchday
  date
  time
  datetime
  homeTeam
  awayTeam
  result
  playerName

  isAway
  isRivalRetired
  isResting

  constructor (homeTeam, awayTeam) {
    this.homeTeam = homeTeam
    this.awayTeam = awayTeam
    this.setIsAway()
    this.setIsResting()
    this.setIsRivalRetired()
  }

  setDatetime (datetime) {
    this.datetime = datetime
    this.date = this.datetimeToDateString(datetime)
    this.time = this.datetimeToTimeString(datetime)
  }

  datetimeToDateString (datetime) {
    const formattedDateString = datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', day: '2-digit', month: 'short', weekday: 'short' })
    const uppercaseAndRemovedCommasAndDots = formattedDateString.toUpperCase().replace(/[.,]/g, '')
    return uppercaseAndRemovedCommasAndDots
  }

  datetimeToTimeString (datetime) {
    const formattedTimeString = datetime.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit' })
    const addedH = formattedTimeString + 'h'
    return addedH
  }

  setIsAway () {
    this.isAway = this.awayTeam.toLowerCase().includes(config.teamNameToIdentifyAwayMatches)
  }

  setIsRivalRetired () {
    this.isRivalRetired = config.retiredTeams.some((retiredTeam) => {
      return this.awayTeam === retiredTeam.teamName || this.homeTeam === retiredTeam.teamName
    })
  }

  setIsResting () {
    this.isResting = !this.homeTeam || !this.awayTeam
  }

  getShortDescription () {
    return this.datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', weekday: 'short' }).toUpperCase().substring(0, 3)
  }
}

export default Match
