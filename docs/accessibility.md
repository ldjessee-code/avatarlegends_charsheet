# Accessibility statement

**Unofficial fan project** for *Avatar Legends* character sheets (static HTML/CSS/JS).  
Not affiliated with Magpie Games or Viacom/Paramount.

## Goals

We aim to make the sheets usable for as many people as possible, including:

- Screen reader users (VoiceOver, TalkBack, NVDA, JAWS)
- Keyboard-only and limited-mobility users
- People who prefer reduced motion or clearer structure
- People who use large text / zoom / mobile browsers

**Look and feel:** Accessibility work should improve structure, names, and keyboard behavior **without** redesigning the visual theme (unless a contrast or size issue fails basic readability).

## Current status (honest)

| Area | Status |
|------|--------|
| Works offline / on GitHub Pages | Supported |
| Mobile Safari / Chrome | Supported (use Pages URL, not multi-file zip when possible) |
| Keyboard use of buttons and fields | Partially supported; not fully audited |
| Screen reader labeling of tracks, pips, collapse controls | **Planned (Phase 1)** — not yet fully implemented |
| `alt` text on portraits / banners / session art | **Planned (Phase 1)** — partial / inconsistent |
| Live announcements (e.g. “saved”) | **Planned (Phase 1)** |
| Full WCAG 2.2 AA certification | **Not claimed** |
| Multi-language UI | Infrastructure planned later; English only for now |
| Native iOS App Intents / system AI | **Out of scope** for the web app; possible future native app if demand exists |

This document will be updated as Phase 1+ work lands.

## Recommended ways to play with assistive tech

1. Prefer the **live site** (GitHub Pages), not a downloaded multi-file folder, on iOS.
2. Use **collapsed sections** during play to reduce noise.
3. Use **Download JSON** (or future Share/Copy) for backup; character data is structured and portable.
4. Zoom the page freely; layout is fluid on phone and tablet.

## Reporting issues

Please open a GitHub issue on  
[ldjessee-code/avatarlegends_charsheet](https://github.com/ldjessee-code/avatarlegends_charsheet)  
with:

- Device + browser (e.g. iPhone 15, Safari 18)
- Assistive tech if any (VoiceOver, NVDA, …)
- Playbook page URL
- What you tried and what happened

## Roadmap (high level)

- **Phase 0 (this folder):** Policy and machine-readable contracts  
- **Phase 1:** Screen reader / keyboard / alt / live regions (shared engine)  
- **Phase 2:** Motor/cognitive helpers (e.g. Share/Copy JSON, optional comfort options)  
- **Phase 3:** i18n plumbing (English only until native speakers review)  
- **Phase 4 (optional):** Command palette / documented tools for assistants  
- **Native iOS:** Only if there is clear demand  

See also [AI & automation](ai-automation.md) and [Character JSON](character-json.md).
