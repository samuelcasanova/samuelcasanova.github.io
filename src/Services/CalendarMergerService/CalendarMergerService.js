import Calendar from '../../Models/Calendar'
import Week from '../../Models/Week'

class CalendarMergerService {
  mergeMatchesIntoCalendar (matches1, matches2, originalToday) {
    const firstMatchWeekOfYear = Math.min(this.getWeekOfYear(matches1[0].datetime), this.getWeekOfYear(matches2[0].datetime))
    const calendar = new Calendar()
    const today = (originalToday || new Date())
    let index1 = 0
    let index2 = 0
    let currentMatchProcessing = null
    let currentWeekProcessing = new Week(firstMatchWeekOfYear)
    calendar.weeks.push(currentWeekProcessing)

    while (index1 < matches1.length || index2 < matches2.length) {
      const noMoreMatchesInMatches2OrMatch1IsBeforeMatch2 = this.noMoreMatchesInMatches2OrMatch1IsBeforeMatch2(index1, matches1, index2, matches2)
      if (noMoreMatchesInMatches2OrMatch1IsBeforeMatch2) {
        currentMatchProcessing = matches1[index1++]
      } else {
        currentMatchProcessing = matches2[index2++]
      }

      const currentMatchProcessingWeekOfYear = this.getWeekOfYear(currentMatchProcessing.datetime)

      const isCurrentMatchInTheNextWeekOfYear = currentMatchProcessingWeekOfYear !== currentWeekProcessing.weekofyear
      if (isCurrentMatchInTheNextWeekOfYear) {
        const isTodayAfterTheLastMatchOfTheCurrentWeek = this.isTodayAfterTheLastMatchOfTheWeek(currentWeekProcessing, today)
        if (isTodayAfterTheLastMatchOfTheCurrentWeek) {
          calendar.currentWeekIndex++
        }
        currentWeekProcessing.shortDescription = this.getWeekShortDescription(currentWeekProcessing.matches)
        currentWeekProcessing.isProblematic = this.isProblematic(currentWeekProcessing.matches)
        currentWeekProcessing = new Week(currentMatchProcessingWeekOfYear)
        calendar.weeks.push(currentWeekProcessing)
      }

      currentWeekProcessing.matches.push(currentMatchProcessing)
    }
    currentWeekProcessing.shortDescription = this.getWeekShortDescription(currentWeekProcessing.matches)
    currentWeekProcessing.isProblematic = this.isProblematic(currentWeekProcessing.matches)
    return calendar
  }

  noMoreMatchesInMatches2OrMatch1IsBeforeMatch2 (index1, matches1, index2, matches2) {
    const thereAre2MatchesAndMatch1IsBeforeMatch2 = index1 < matches1.length && index2 < matches2.length && matches1[index1].datetime <= matches2[index2].datetime
    const noMoreMatchesInMatches2 = index2 === matches2.length
    const noMoreMatchesInMatches2OrthereAre2MatchesAndMatch1IsBeforeMatch2 = noMoreMatchesInMatches2 || thereAre2MatchesAndMatch1IsBeforeMatch2
    return noMoreMatchesInMatches2OrthereAre2MatchesAndMatch1IsBeforeMatch2
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
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].datetime.getDate() !== currentDay) {
        currentDay = matches[i].datetime.getDate()
        weekShortDescription += '+' + matches[i].datetime.toLocaleDateString('es-ES', { timeZone: 'UTC', weekday: 'short' }).toUpperCase().substring(0, 3)
      }
    }
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
