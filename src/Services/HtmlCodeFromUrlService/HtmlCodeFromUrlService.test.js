/* eslint-disable no-undef */
import HtmlCodeFromUrlService from './HtmlCodeFromUrlService'

describe('INTEGRATION: Retrieving source code for Premier football website', () => {
  let htmlCode = null

  beforeAll(async () => {
    const htmlCodeFromURLService = new HtmlCodeFromUrlService()
    htmlCode = await htmlCodeFromURLService.getHtmlCodeFromURL('https://www.fcf.cat/calendari-equip/2022/futbol-7/benjami-7-tercera-divisio/grup-6/escola-de-futbol-premier-barcelona-f')
  })

  test('htmlCode has content', () => {
    expect(htmlCode).toBeDefined()
  })

  test('Includes the title FCF | Calendari Equip', () => {
    expect(htmlCode).toContain('<title>FCF | Calendari Equip</title>')
  })
})
