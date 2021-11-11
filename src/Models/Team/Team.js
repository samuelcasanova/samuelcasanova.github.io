import teamsConfigJson from './teams.json'

class Team {
  name
  displayName
  fieldName
  calendarUrl
  isRetired

  constructor (name) {
    if (!name) {
      throw new Error('Team name should have value')
    }
    this.name = name
    const teamConfig = teamsConfigJson.teams.find(team => this.normalizeName(team.name) === this.normalizeName(name))
    this.displayName = (teamConfig ? teamConfig.displayName : this.formatDisplayName(name))
    this.fieldName = (teamConfig ? teamConfig.fieldName : name)
    this.calendarUrl = (teamConfig ? teamConfig.calendarUrl : '')
    this.isRetired = (teamConfig ? teamConfig.isRetired : false)
  }

  normalizeName (name) {
    return name.toUpperCase().replace(/[ .,ªº\\]/g, '')
  }

  formatDisplayName (name) {
    const titleCasedDisplayName = this.toTitleCase(name)
    const formattedDisplayName = titleCasedDisplayName.replace(/[\\]/g, '')
    return formattedDisplayName
  }

  toTitleCase (text) {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

export default Team
