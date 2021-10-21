import Calendar from '../../Models/Calendar'
import Week from '../../Models/Week'

class CalendarMergerService {
  mergeMatchesIntoCalendar (matches1, matches2, originalToday) {
    const calendar = new Calendar()
    const today = (originalToday || new Date())

    const allSortedMatches = matches1.concat(matches2)
    allSortedMatches.sort((matchA, matchB) => {
      return matchA.datetime - matchB.datetime
    })

    const firstMatchWeekOfYear = this.getWeekOfYear(allSortedMatches[0].datetime)
    let currentWeekProcessing = new Week(firstMatchWeekOfYear)
    calendar.weeks.push(currentWeekProcessing)

    allSortedMatches.forEach((currentMatchProcessing) => {
      const currentMatchProcessingWeekOfYear = this.getWeekOfYear(currentMatchProcessing.datetime)

      const isCurrentMatchInTheNextWeekOfYear = currentMatchProcessingWeekOfYear !== currentWeekProcessing.weekofyear
      if (isCurrentMatchInTheNextWeekOfYear) {
        const isTodayAfterTheLastMatchOfTheCurrentWeek = this.isTodayAfterTheLastMatchOfTheWeek(currentWeekProcessing, today)
        if (isTodayAfterTheLastMatchOfTheCurrentWeek) {
          calendar.currentWeekIndex++
        }
        currentWeekProcessing = new Week(currentMatchProcessingWeekOfYear)
        calendar.weeks.push(currentWeekProcessing)
      }

      currentWeekProcessing.matches.push(currentMatchProcessing)
    })
    calendar.weeks.forEach((week) => {
      week.shortDescription = this.getWeekShortDescription(week.matches)
      week.isProblematic = this.isProblematic(week.matches)
    })
    return calendar
  }

  getWeekOfYear (datetime) {
    const d = new Date(Date.UTC(datetime.getFullYear(), datetime.getMonth(), datetime.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    return weekNo
  }

  isTodayAfterTheLastMatchOfTheWeek (week, today) {
    const lastMatchOfCurrentWeek = week.matches[week.matches.length - 1]
    const lastMatchEndOfMatchTime = new Date(lastMatchOfCurrentWeek.datetime.getTime())
    lastMatchEndOfMatchTime.setHours(lastMatchOfCurrentWeek.datetime.getHours() + 1)
    const isTodayAfterTheLastMatchOfTheCurrentWeek = today > lastMatchEndOfMatchTime
    return isTodayAfterTheLastMatchOfTheCurrentWeek
  }

  getWeekShortDescription (matches) {
    let currentDay = matches[0].datetime.getDate()
    let weekShortDescription = matches[0].datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', weekday: 'short' }).toUpperCase().substring(0, 3)
    matches.forEach((match) => {
      if (match.datetime.getDate() !== currentDay) {
        currentDay = match.datetime.getDate()
        weekShortDescription += '+' + match.datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', weekday: 'short' }).toUpperCase().substring(0, 3)
      }
    })
    return weekShortDescription
  }

  isProblematic (matches) {
    if (matches.length < 2) {
      return false
    }
    let match1 = matches[0]
    for (let i = 1; i < matches.length; i++) {
      if (this.areMatchesProblematics(match1, matches[i])) {
        return true
      }
      match1 = matches[i]
    }
    return false
  }

  areMatchesProblematics (match1, match2) {
    const areTheSameDay = match1.datetime.getDate() === match2.datetime.getDate()
    const timeBetweenMatchesInHours = (match2.datetime - match1.datetime) / (1000 * 60 * 60)
    const atLeastOneIsAway = match1.isAway || match2.isAway
    return (areTheSameDay && timeBetweenMatchesInHours < 3 && atLeastOneIsAway)
  }
}

export default CalendarMergerService
