import { getCurrentWeekIndex } from './currentWeek'

const weeks = [
  { endsAt: '2021-10-09T10:30:00.000Z' },
  { endsAt: '2021-10-17T10:00:00.000Z' },
  { endsAt: '2021-10-23T12:00:00.000Z' },
  { endsAt: '2021-10-31T11:00:00.000Z' }
]

describe('Current week', () => {
  test('before every match it is the first week', () => {
    expect(getCurrentWeekIndex(weeks, new Date('2021-10-08T00:00:00Z'))).toBe(0)
  })

  test('until its last match ends it is still that week', () => {
    expect(getCurrentWeekIndex(weeks, new Date('2021-10-09T10:30:00.000Z'))).toBe(0)
  })

  test('right after the last match of a week it is the next week', () => {
    expect(getCurrentWeekIndex(weeks, new Date('2021-10-09T10:30:00.001Z'))).toBe(1)
  })

  test('after the last match of the season it stays on the last week', () => {
    expect(getCurrentWeekIndex(weeks, new Date('2021-11-30T00:00:00Z'))).toBe(3)
  })

  test('without weeks there is no current week', () => {
    expect(getCurrentWeekIndex([], new Date())).toBe(-1)
  })
})
