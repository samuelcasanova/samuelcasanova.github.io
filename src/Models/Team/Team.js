import teamsConfig from './teams.json'

class Team {
  name
  fieldName
  calendarUrl
  isRetired

  constructor (name) {
    if (!name) {
      throw new Error('Team name should have value')
    }
    this.name = name
    const teamConfig = teamsConfig.teams.find(team => this.normalizeName(team.name) === this.normalizeName(name))
    this.fieldName = (teamConfig ? teamConfig.fieldName : name)
    this.calendarUrl = (teamConfig ? teamConfig.calendarUrl : '')
    this.isRetired = (teamConfig ? teamConfig.isRetired : false)
  }

  normalizeName (name) {
    return name.toUpperCase().replace(/[ .,ªº\\]/g, '')
  }
}

export default Team
