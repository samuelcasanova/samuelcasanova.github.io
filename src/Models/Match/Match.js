import config from '../../config.json'
import Team from '../Team/Team'

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

  constructor (homeTeamName, awayTeamName) {
    this.setDatetime(new Date(1970, 0, 1, 0, 0))
    try {
      this.homeTeam = new Team(homeTeamName)
      this.awayTeam = new Team(awayTeamName)
    } catch (error) {
      if (error.message === 'Team name should have value') {
        this.isResting = true
        this.isAway = false
        this.isRivalRetired = false
        return
      }
    }
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
    this.isRivalRetired = this.awayTeam && this.homeTeam && (this.homeTeam.isRetired || this.awayTeam.isRetired)
  }

  setIsResting () {
    this.isResting = !this.homeTeam || !this.awayTeam
  }

  getShortDescription () {
    return this.datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', weekday: 'short' }).toUpperCase().substring(0, 3)
  }
}

export default Match
