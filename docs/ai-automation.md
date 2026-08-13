# AI and automation guidance

This project is a **static web character sheet**. There is no required server and no official native app.

## Principle

**Prefer structured character JSON and documented actions** over:

- Screenshot / vision “click the red button”
- Fragile CSS selectors that change with layout
- Auto-translating Magpie Games rules text without human review

That makes assistants more reliable and keeps **accessibility** and **automation** aligned: both work best on **named data and clear operations**.

## What to use today (Layer B)

1. **Download JSON** / **Load JSON** — full character portability  
2. **Format contract** — [character-json.md](character-json.md)  
3. **Playbook pages** — stable URLs under `/playbooks/<id>.html`  
4. **Human UI** — [accessibility.md](accessibility.md) for AT expectations  

### Suggested “verbs” (conceptual — not a remote API)

These are operations a helper (human script, future command palette, or local tool) should think in:

| Verb | Intent |
|------|--------|
| `open_playbook` | Open `playbookUrl` for a given `playbookId` |
| `load_character` | Parse JSON; merge `images`; apply to sheet |
| `export_character` | Produce versioned JSON (images at end) |
| `set_field` | Set a known character field (name, fatigue, …) |
| `toggle_condition` | Mark/clear a condition by id |
| `set_balance` | Set balance position (−3…+3) |
| `add_session_note` | Append session with local `playDate` |
| `list_moves` | Read selected + available playbook moves from data |

There is **no public HTTP API** on GitHub Pages. Automation is:

- User-driven (export/import files), or  
- Local (browser extension / desktop tool / future MCP server **outside** this repo), or  
- Future optional features in the page itself (Phase 4).

## What not to do

- Do not scrape Magpie’s commercial PDFs via this project.  
- Do not ship unreviewed machine translations of playbook moves.  
- Do not assume App Intents / Siri / system AI can drive this web page without a native wrapper.  
- Do not put large base64 images in the middle of hand-edited JSON (exports already place them under `images` at the end).

## Layer C (out of scope for now)

Native **iOS App Intents**, Android App Actions, etc. are **not** planned unless there is clear demand. A Swift/iOS app could wrap the same JSON contract later.

## Assistive use of AI

AI can help people with different abilities **if** it operates on:

1. Exported **JSON**, and/or  
2. Future **named commands** in the page, and/or  
3. The **accessibility tree** once Phase 1 labeling is solid  

Vision-only control of the painted UI is a last resort.

## Related

- [Character JSON](character-json.md)  
- [Accessibility](accessibility.md)  
- Repository: https://github.com/ldjessee-code/avatarlegends_charsheet  
