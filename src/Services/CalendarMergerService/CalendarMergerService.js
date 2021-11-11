import Calendar from '../../Models/Calendar/Calendar'
import Week from '../../Models/Week/Week'

class CalendarMergerService {
  createCalendarFromSortedMatches (matches, originalToday) {
    const calendar = new Calendar()
    const today = (originalToday || new Date())

    const firstMatchWeekOfYear = this.getWeekOfYear(matches[0].datetime)
    let currentWeekProcessing = new Week(firstMatchWeekOfYear)
    calendar.weeks.push(currentWeekProcessing)
    calendar.currentWeekIndex = 0

    for (const currentMatchProcessing of matches) {
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

      currentWeekProcessing.addMatch(currentMatchProcessing)
    }
    return calendar
  }

  getMergedAndSortedMatches (matches1, matches2) {
    const allSortedMatches = matches1.concat(matches2)
    allSortedMatches.sort((matchA, matchB) => {
      return matchA.datetime - matchB.datetime
    })
    return allSortedMatches
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
}

export default CalendarMergerService
