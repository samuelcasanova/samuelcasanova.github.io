import teamsConfigJson from './teams.json'

class Team {
  name
  category
  displayName
  fieldName
  calendarUrl
  isRetired

  constructor (name, category) {
    if (!name) {
      throw new Error('Team name should have value')
    }
    this.name = name
    this.category = (category || 'NOCATEGORY')
    const categoryJson = teamsConfigJson.categories.find(categoryJson => categoryJson.name === category)
    if (categoryJson) {
      const teamConfig = categoryJson.teams.find(team => this.normalizeName(team.name) === this.normalizeName(name))
      this.displayName = (teamConfig ? teamConfig.displayName : this.formatDisplayName(name))
      this.fieldName = (teamConfig ? teamConfig.fieldName : name)
      this.calendarUrl = (teamConfig ? teamConfig.calendarUrl : '')
      this.isRetired = (teamConfig ? teamConfig.isRetired : false)
    } else {
      console.info('Category not found: %s, ', category)
      this.displayName = this.formatDisplayName(name)
      this.fieldName = name
      this.calendarUrl = ''
      this.isRetired = false
    }
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
