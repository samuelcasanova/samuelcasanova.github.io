# premierportal

## Tests must not call fcf.cat
fcf.cat is behind an AWS WAF rate-based rule. A burst of requests blocks every call for hours (`202`, empty
body, `x-amzn-waf-action`), and test runs count towards that limit. Tests read local fixture files only
(`src/testFixtures/`, `scripts/lib/fixtures/`) and stub `fetch`; the only code that calls the FCF API is
`npm run fetch-season`.
