import Week from './Week'
import Match from '../../Models/Match/Match'

/* eslint-disable no-undef */
describe('Testing week model', () => {
  let week = null
  let match1 = null
  let match2 = null
  let match3 = null

  beforeAll(() => {
    week = new Week(20)
    match1 = new Match('Premier F', 'Barcino D')
    match1.setDatetime(new Date(2021, 9, 16, 10, 0))
    match2 = new Match('Sarrià B', 'Premier D')
    match2.setDatetime(new Date(2021, 9, 16, 11, 0))
    match3 = new Match('Sarrià A', 'Premier A')
    match3.setDatetime(new Date(2021, 9, 17, 10, 0))
  })

  test('Matches array is correctly initialized', () => {
    expect(week.matches).toHaveLength(0)
  })

  describe('Inserting a first match', () => {
    beforeAll(() => {
      week.addMatch(match1)
    })

    test('Match is correctly inserted in the collection', () => {
      expect(week.matches).toHaveLength(1)
    })

    test('Short description is updated correctly', () => {
      expect(week.shortDescription).toBe('SÁB')
    })

    test('With one match the week is not problematic', () => {
      expect(week.isProblematic).toBeFalsy()
    })
  })

  describe('Inserting a second match', () => {
    beforeAll(() => {
      week.addMatch(match2)
    })

    test('Match is correctly inserted in the collection', () => {
      expect(week.matches).toHaveLength(2)
    })

    test('Short description is updated correctly', () => {
      expect(week.shortDescription).toBe('SÁB')
    })

    test('With the second match the week is problematic', () => {
      expect(week.isProblematic).toBeTruthy()
    })
  })

  describe('Inserting a third match', () => {
    beforeAll(() => {
      week.addMatch(match3)
    })

    test('Match is correctly inserted in the collection', () => {
      expect(week.matches).toHaveLength(3)
    })

    test('Short description is updated correctly', () => {
      expect(week.shortDescription).toBe('SÁB+DOM')
    })

    test('With the second match the week is still problematic', () => {
      expect(week.isProblematic).toBeTruthy()
    })
  })
})
