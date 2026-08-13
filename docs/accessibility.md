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

## What has been done so far

| Area | Status |
|------|--------|
| Works offline / on GitHub Pages | Supported |
| Mobile Safari / Chrome | Supported (prefer Pages URL on iOS when possible) |
| Keyboard use of buttons and fields | Improved; not a full third-party audit |
| Screen reader labeling of tracks, pips, collapse controls | Section toggles, fatigue/growth/balance, conditions labeled |
| `alt` text on portraits / banners / session art | Present with meaningful text where content exists |
| Live announcements (e.g. autosave) | Status region uses `aria-live="polite"` |
| Landmarks / skip link | Banner, main, footer; “Skip to character sheet” |
| Focus after re-render | Restored via `data-focus-key` where controls re-render |
| `prefers-reduced-motion` | Toolbar/portrait transitions reduced when requested |
| Full WCAG 2.2 AA certification | **Not claimed** |
| Languages | English UI only for now |
| Native App Intents / Siri | Not part of this web project |

We do **not** publish a public roadmap of accessibility features. Improvements land when they ship; see [revision history](revision-history.md) for past releases.

## Recommended ways to play with assistive tech

1. Prefer the **live site** (GitHub Pages), not a downloaded multi-file folder, on iOS.
2. Use **collapsed sections** during play to reduce noise.
3. Use **Download JSON** and email the file to your GM after sessions.
4. Zoom the page freely; layout is fluid on phone and tablet.

## Reporting issues

Please open a GitHub issue on  
[ldjessee-code/avatarlegends_charsheet](https://github.com/ldjessee-code/avatarlegends_charsheet)  
with:

- Device + browser (e.g. iPhone 15, Safari 18)
- Assistive tech if any (VoiceOver, NVDA, …)
- Playbook page URL
- What you tried and what happened

## Related

- [Revision history](revision-history.md)  
- [Character JSON](character-json.md)  
- [AI & automation](ai-automation.md)  
