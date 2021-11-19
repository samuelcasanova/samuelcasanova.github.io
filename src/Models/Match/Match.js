import config from '../../config.json'

class Match {
  matchday
  date
  time
  datetime
  homeTeam
  awayTeam
  result
  footballer

  isAway
  isRivalRetired
  isResting

  constructor (homeTeam, awayTeam) {
    this.setDatetime(new Date(1970, 0, 1, 0, 0))
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
    const formattedTimeString = datetime.toLocaleTimeString('es-ES', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit' })
    const addedH = formattedTimeString + 'h'
    return addedH
  }

  setIsAway () {
    this.isAway = this.awayTeam && this.awayTeam.name.toLowerCase().includes(config.teamNameToIdentifyAwayMatches)
  }

  setIsRivalRetired () {
    this.isRivalRetired = (this.homeTeam?.isRetired || this.awayTeam?.isRetired) ?? false
  }

  setIsResting () {
    this.isResting = !this.homeTeam || !this.awayTeam
  }

  getShortDescription () {
    return this.datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', weekday: 'short' }).toUpperCase().substring(0, 3)
  }
}

export default Match
