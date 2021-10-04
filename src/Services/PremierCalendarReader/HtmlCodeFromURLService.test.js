/* eslint-disable no-undef */
import HtmlCodeFromURLService from './HtmlCodeFromURLService'

describe('Retrieving source code for Premier football website', () => {
  let htmlCode = null

  beforeAll(async () => {
    const htmlCodeFromURLService = new HtmlCodeFromURLService()
    htmlCode = await htmlCodeFromURLService.getHtmlCodeFromURL('https://www.fcf.cat/calendari-equip/2022/futbol-7/prebenjami-7/grup-18/escola-de-futbol-premier-barcelona-d')
  })

  test('htmlCode has content', () => {
    expect(htmlCode.length).toBeGreaterThan(0)
  })

  test('Includes the title FCF | Calendari Equip', () => {
    expect(htmlCode).toContain('<title>FCF | Calendari Equip</title>')
  })
})
