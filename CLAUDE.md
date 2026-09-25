# premierportal

## Data flow
`season.config.json` → `npm run fetch-season` (calls the FCF API, saves trimmed responses in `data/fcf/`) →
`npm run build-calendars` (offline; merges `data/fcf/` and `data/additionalMatches.json` into the gitignored
`src/data/calendars.json`, runs before `start` and `build`) → the portal imports it and only picks the current week.
Display-name fixes (`scripts/displayNameReplacements.json`) and additional matches need only `build-calendars`.

## Tests must not call fcf.cat
fcf.cat is behind an AWS WAF rate-based rule. A burst of requests blocks every call for hours (`202`, empty
body, `x-amzn-waf-action`), and test runs count towards that limit. Tests read local fixture files only
(`scripts/lib/fixtures/`) and stub `fetch`; the only code that calls the FCF API is `npm run fetch-season`.
