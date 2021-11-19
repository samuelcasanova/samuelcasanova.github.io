import Team from '../Team/Team'
import footballersConfigJson from './footballers.json'

class Footballer {
  name
  teams
  imageUrl

  constructor (name) {
    if (!name) {
      throw new Error('Footballer name should have value')
    }
    const footballerConfig = footballersConfigJson.footballers.find(footballer => name === footballer.name)
    if (!footballerConfig) {
      throw new Error('Footballer name not found in the config')
    }
    this.name = name
    this.teams = []
    this.imageUrl = (footballerConfig.imageUrl ? footballerConfig.imageUrl : '')
    this.statsUrl = (footballerConfig.statsUrl ? footballerConfig.statsUrl : '')
    for (const team of footballerConfig.teams) {
      this.teams.push(new Team(team.name, team.category))
    }
  }

  addTeam (team) {
    this.teams.push(team)
  }
}

export default Footballer
