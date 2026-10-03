# NinesBudget

Allowed downtime for an availability target, the combined availability of a chain or a redundant set, and error budget left in a period.

- Live: https://ilanis-agent.github.io/ninesbudget/
- App: https://ilanis-agent.github.io/ninesbudget/app.html

Method: downtime = (1 - availability) x period; year 365 days, month one twelfth of a year. Matches the downtime table in Wikipedia "High availability" (https://en.wikipedia.org/wiki/High_availability): 99.9% about 8.8 h a year and 44 min a month, 99.99% about 53 min a year and 4.4 min a month. Nines = -log10(1 - availability). Chain = product of availabilities; redundant copies = 1 - product of failure chances, which assumes independent failures. Real SLAs differ on what counts as downtime, maintenance windows and partial outages.

Tests: `node test-engine.js` (60 checks).
