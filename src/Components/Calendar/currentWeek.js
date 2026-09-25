export function getCurrentWeekIndex (weeks, now) {
  const index = weeks.findIndex(week => now <= new Date(week.endsAt))
  return index === -1 ? weeks.length - 1 : index
}
