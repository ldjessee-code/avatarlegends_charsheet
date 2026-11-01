# Accessibility tests (WCAG 2.2 AA target)

Dependency-free. A Node script serves the repo on localhost and loads each page in headless Chrome/Edge;
`harness.js` runs inside the page (never shipped to the site) and writes JSON back.

Run: `pwsh -File tests\run-tests.ps1` (or `node tests/a11y/run-a11y.mjs`). Options: `--only <substring>`, `--json <file>`.
Env: `A11Y_BROWSER` (browser path), `AXE_CORE_PATH` (path to `axe.min.js`), `A11Y_DEBUG=1`.

| Check | What it asserts | WCAG |
|-------|-----------------|------|
| accessible-names | every control has a non-empty accessible name | 4.1.2, 1.3.1 |
| text-contrast | text is at least 4.5:1 (3:1 large) in the default look and all six themes, sections expanded, gradients sampled | 1.4.3 |
| text-contrast-selected | same, after switching on chips, pips, track boxes (selected states) | 1.4.3 |
| focus-indicator | focused controls show an indicator of at least 3:1 and 2px | 2.4.7, 1.4.11 |
| target-size | controls are at least 24 x 24 CSS px (inline text links excepted) | 2.5.8 |
| structure | lang, title, one main, one h1, img alt, unique ids | 1.3.1, 2.4.2 |
| label-in-name | accessible name contains the visible label | 2.5.3 |
| scroll-padding | sticky toolbar does not hide focused fields | 2.4.11 |
| axe | axe-core wcag2a/2aa/21a/21aa/22aa violations (SKIPPED when axe-core is not present, never counted as passed) | various |

A green run is not a conformance claim. Screen readers, zoom/reflow, keyboard order and content review still need a person.
