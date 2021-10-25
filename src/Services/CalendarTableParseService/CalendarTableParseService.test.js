/* eslint-disable no-undef */
import CalendarTableParseService from './CalendarTableParseService'
import Match from '../../Models/Match/Match'

describe('Parsing simple calendar table', () => {
  const tableHtmlCode = `<html><head></head><body><table class="fcftable w-100 fs-12_ml">
                      <thead>
                        <tr>
                          <th class="w-8"><span class="d-n_ml">Jornada</span><span class="d-n d-b_ml">J</span></th>
                          <th class="w-16"><span class="d-n_ml">Data</span><span class="d-n d-b_ml">D</span></th>
                          <th class="w-8"><span class="d-n_ml">Hora</span><span class="d-n d-b_ml">H</span></th>
                          <th class="w-30"><span class="d-n_ml">Equip Casa</span><span class="d-n d-b_ml">E C</span></th>
                          <th class="w-30"><span class="d-n_ml">Equip Fora</span><span class="d-n d-b_ml">E F</span></th>
                          <th class="w-8"><span class="d-n_ml">Resultat</span><span class="d-n d-b_ml">R</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="tc p-0_tp">1</td>
                          <td class="tc">10-10-2021</td>
                          <td class="tc"> 11:00</td>
                          <td class="tl"><a href="https://www.fcf.cat/equip/2022/7pb/escola-de-futbol-premier-barcelona-d">ESCOLA DE FUTBOL PREMIER BARCELONA D</a></td>
                          <td class="tl p-0_tp"><a href="https://www.fcf.cat/equip/2022/7pb/pa-barc-barcino-ce-c">Pª BARC. BARCINO, CE C</a></td>
                          <td class="tc"> - </td>
                        </tr>
                        <tr>
                          <td class="tc p-0_tp">23</td>
                          <td class="tc">10-04-2022</td>
                          <td class="tc"> 10:00</td>
                          <td class="tl"><a href="https://www.fcf.cat/equip/2022/7pb/lloreda-cf-c">LLOREDA, C.F. C</a></td>
                          <td class="tl p-0_tp"><a href="https://www.fcf.cat/equip/2022/7pb/escola-de-futbol-premier-barcelona-d">ESCOLA DE FUTBOL PREMIER BARCELONA D</a></td>
                          <td class="tc"> - </td>
                        </tr>
                      </tbody>
                  </table></body></html>`

  let matches = null
  let singleMatch = null
  let calendarTableParseService = null

  beforeAll(() => {
    calendarTableParseService = new CalendarTableParseService()
    matches = calendarTableParseService.parseMatches(tableHtmlCode, 'Victor')
    singleMatch = matches[0]
  })

  describe('Parsing a single match', () => {
    test('match is instance of Match', () => {
      expect(singleMatch).toBeInstanceOf(Match)
    })

    test('matchday is 1', () => {
      expect(singleMatch.matchday).toBe('1')
    })

    test('match time is 11:00h', () => {
      expect(singleMatch.time).toBe('11:00h')
    })

    test('match date is DOM. 10 OCT.', () => {
      expect(singleMatch.date).toBe('DOM 10 OCT')
    })

    test('match datetime day is correctly merged and printed', () => {
      expect(calendarTableParseService.dateTimeToString(singleMatch.datetime)).toBe('Sun Oct 10 2021')
    })

    test('player name is Victor', () => {
      expect(singleMatch.playerName).toBe('Victor')
    })

    test('match home team is PREMIER D', () => {
      expect(singleMatch.homeTeam).toBe('Premier D')
    })

    test('isAway is false when the match is home for Premier', () => {
      expect(singleMatch.isAway).toBeFalsy()
    })
  })

  describe('Parsing two matches', () => {
    test('matches is an array', () => {
      expect(matches).toBeInstanceOf(Array)
    })

    test('matches contains exactly 2 matches', () => {
      expect(matches).toHaveLength(2)
    })

    test('First match has home and away', () => {
      expect(matches[0].homeTeam).toBeDefined()
      expect(matches[0].awayTeam).toBeDefined()
    })
  })

  describe('Testing CalendarTableParseService internal functions', () => {
    test('Parsing team name: BARCINO D', () => {
      const parsedName = calendarTableParseService.parseTeamName('BARCINO D')
      expect(parsedName).toBe('Barcino D')
    })

    test('Parsing Premier name: ESCOLA DE FUTBOL PREMIER BARCELONA F', () => {
      const parsedName = calendarTableParseService.parseTeamName('ESCOLA DE FUTBOL PREMIER BARCELONA F')
      expect(parsedName).toBe('Premier F')
    })
  })
})
