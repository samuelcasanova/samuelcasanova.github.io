import Calendar from './Calendar'

/* eslint-disable no-undef */
describe('Calendar constructor tests', () => {
  let calendar = null

  beforeAll(() => {
    calendar = new Calendar()
  })

  describe('Building a simple calendar', () => {
    test('The weeks array is initialized', () => {
      expect(calendar.weeks.length).toBe(0)
    })
    test('Current Week index is -1', () => {
      expect(calendar.currentWeekIndex).toBe(-1)
    })
  })
})
