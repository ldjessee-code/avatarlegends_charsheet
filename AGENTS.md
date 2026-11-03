# Avatar Legends character sheets

Unofficial offline HTML/CSS/JS character sheets for Avatar Legends. Fan tool only. See README.md and NOTICE.md.

## Git

Bots and Grok Build commit and push only to `review`. Before committing, check `git branch --show-current` is `review`. Make small commits, one per section or change, with a conventional message. Never commit or push to `main` or `master`. Never merge, rebase, force-push, or delete branches. Doug merges and may cherry-pick. Read-only git (`status`, `diff`, `log`, `show`) is fine. Do not write under `.git\`.

## Proof table (how to build, test, lint, and what "done" means)

| Step | Command (run from the repo root) | Done means |
|------|----------------------------------|------------|
| Build | none (static HTML/CSS/JS) | n/a |
| Test | `pwsh -File tests\run-tests.ps1` (Node 18+, Chrome or Edge, no npm install) | `0 failed`; skipped is not passed |
| Test with axe-core | same, with `AXE_CORE_PATH` set to a local `axe.min.js` (or the file in `tests\a11y\vendor\`, git-ignored) | the `axe` test runs and passes on every page |
| Lint | none configured | n/a |
| Done | test run is green on every page, and the visual look is unchanged apart from what the change intended | a human has still done the checks listed in `docs/accessibility.md` before anyone claims WCAG 2.2 AA |

When you change CSS colours, markup or controls, run the tests before committing. New controls need an accessible name, a 24 px target, and a 3:1 focus ring.
