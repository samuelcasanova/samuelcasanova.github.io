class Week {
    weekofyear
    matches
    shortDescription
    isProblematic

    constructor (weekofyear) {
      this.weekofyear = weekofyear
      this.matches = []
      this.shortDescription = ''
      this.isProblematic = false
    }

    addMatch (match) {
      this.matches.push(match)
      this.updateShortDescription()
      this.updateIsProblematic()
    }

    updateShortDescription () {
      if (!this.shortDescription) {
        this.shortDescription = this.matches[0].getShortDescription()
        return
      }
      const recentlyAddedMatch = this.matches[this.matches.length - 1]
      const previousLastMatch = this.matches[this.matches.length - 2]
      if (previousLastMatch.datetime.getDate() !== recentlyAddedMatch.datetime.getDate()) {
        this.shortDescription += '+' + recentlyAddedMatch.getShortDescription()
      }
    }

    updateIsProblematic () {
      if (this.isProblematic || this.matches.length < 2) {
        return
      }
      const recentlyAddedMatch = this.matches[this.matches.length - 1]
      const previousLastMatch = this.matches[this.matches.length - 2]
      if (this.areMatchesProblematics(previousLastMatch, recentlyAddedMatch)) {
        this.isProblematic = true
      }
    }

    areMatchesProblematics (match1, match2) {
      const neitherMatchesAreResting = !match1.isResting && !match2.isResting
      const neitherMatchesAreAgainstaRetiredRival = !match1.isRivalRetired && !match2.isRivalRetired
      const areTheSameDay = match1.datetime.getDate() === match2.datetime.getDate()
      const timeBetweenMatchesInHours = (match2.datetime - match1.datetime) / (1000 * 60 * 60)
      const atLeastOneIsAway = match1.isAway || match2.isAway
      return (neitherMatchesAreResting && neitherMatchesAreAgainstaRetiredRival && areTheSameDay &&
        timeBetweenMatchesInHours < 3 && atLeastOneIsAway)
    }
}

export default Week
