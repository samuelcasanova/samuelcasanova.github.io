/* eslint-disable no-undef */
import HtmlCodeFromUrlService from './HtmlCodeFromUrlService'

describe('INTEGRATION: Retrieving source code for Premier football website', () => {
  let htmlCode = null

  beforeAll(async () => {
    const htmlCodeFromURLService = new HtmlCodeFromUrlService()
    htmlCode = await htmlCodeFromURLService.getHtmlCodeFromURL('https://www.fcf.cat/calendari-equip/2425/futbol-femen%C3%AD/segona-divisio-femeni-alevi/grup-9/escola-de-futbol-premier-barcelona-a')
  }, 300000)

  test('htmlCode has content', () => {
    expect(htmlCode).toBeDefined()
  })

  test('Includes the title FCF | Calendari Equip', () => {
    expect(htmlCode).toContain('<title>FCF | Calendari Equip</title>')
  })
})
