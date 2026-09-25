# premierportal

## Tests must not call fcf.cat
fcf.cat is behind an AWS WAF rate-based rule. A burst of requests blocks every call for hours (`202`, empty
body, `x-amzn-waf-action`), and test runs count towards that limit. Tests read local fixture files only.

Until the network tests are replaced with fixture-based integration tests, exclude them:

```sh
npm test -- --run --exclude 'src/Services/HtmlCodeFromUrlService/**' --exclude 'src/Services/CalendarReaderService/**' --exclude 'node_modules/**'
```
