# Character JSON format

When you use **Download JSON**, the browser saves a single file that is the portable form of a character.  
**Load JSON** restores it. The same shape is what automation and assistive workflows should prefer over scraping the page.

## Two different “versions” (do not mix them up)

| Name | Where | Example | Meaning |
|------|--------|---------|---------|
| **App version** | Footer of the site; `_meta.appVersion` | `2.2` | UI / feature release of the character sheets |
| **Export format** | `_meta.exportFormat` | `3` | How this JSON file is laid out |

App version numbers (**2.2**, etc.) are listed in [revision history](revision-history.md).  
Export format numbers (**1**, **2**, **3**) only describe the **file shape** and rarely change.

Older exports may still have `_meta.version` (a number). Treat that as **export format** if `exportFormat` is missing.

## Top-level shape (export format 3+)

Property order is intentional for human reading:

```json
{
  "_meta": { },
  "character": { },
  "images": { }
}
```

| Key | Required | Description |
|-----|----------|-------------|
| `_meta` | Yes | App id, appVersion, exportFormat, playbook, export time, links |
| `character` | Yes | All playable fields; image fields empty of bulky data in format 3 |
| `images` | No | Base64 data-URLs only; omitted if none |

Older exports may put `data:image/...` **inline** inside `character`. Load still accepts those.

## `_meta` fields

| Field | Meaning |
|-------|---------|
| `app` | Always `avatar-legends-charsheet` |
| `appVersion` | UI release string (e.g. `2.2`) — same as footer |
| `exportFormat` | Integer **file layout** (currently `3`) |
| `playbookId` | e.g. `adamant`, `bold`, `foundling` |
| `playbookName` | Display name |
| `exportedAt` | ISO-8601 UTC timestamp |
| `repoUrl` | Source repository |
| `pagesUrl` | Live hub on GitHub Pages |
| `playbookUrl` | Direct link to that playbook’s HTML sheet |
| `note` | Optional human hint |

Legacy: `_meta.version` (number) = older name for export format.

## Export format history

| `exportFormat` | Changes |
|----------------|---------|
| **2** | `_meta` with repo/pages/playbook URLs; images often still inline |
| **3** | Images peeled into top-level `images`; character body stays readable |

Always check `exportFormat` (or legacy `version`) before assuming field layout.  
Do **not** compare these numbers to app version **2.2**.

## `images` block (export format 3+)

```json
"images": {
  "portraitDataUrl": "data:image/png;base64,...",
  "campaignBannerDataUrl": "data:image/...",
  "sessions": {
    "<sessionId>": "data:image/..."
  }
}
```

On load, the app reattaches these onto `character.portraitDataUrl`, `character.campaign.bannerDataUrl`, and matching `character.sessions[].id`.

Keep images small (guide: under ~2.5 MB each) so email and mobile stay usable.

## `character` (conceptual)

Not every field is required. Typical groups:

- **Identity:** `name`, `playerName`, `look`, `hometown`, `training`, `fightingStyle`, `background`, `demeanor`, `backstory`
- **Campaign brand:** `campaign` (`mode`, `name`, `tagline`, `bannerDataUrl` empty in format-3 body)
- **Stats / balance:** `stats`, `creationBonusStat`, `balance`, `center`
- **Tracks:** `conditions`, `statuses`, `fatigue`
- **Playbook:** `featureFields`, `selectedMoves`, `customMoves`, `otherPlaybookMoves`
- **Techniques:** `techniques[]` (`sourceId`, `name`, `approach`, `text`, `mastery`)
- **History / connections:** `historyAnswers[]`, `connections`
- **Growth:** `growth`, `advancements`, `momentUnlocked`
- **Sessions:** `sessions[]` (`id`, `playDate`, `title`, `notes`, `collapsed`, `imageDataUrl` empty in format-3 body)
- **UI:** `ui` (which sections are expanded)
- **Generated (optional):** `role` (`pc` or `npc`), `fatigueMax` (NPCs), plus leftover generator metadata in `_meta` when exported from Generate

Playbook-specific feature fields live under `featureFields` (and optional nested objects such as drives).

## Compatibility rules for tools

1. Prefer reading **`character`** after merging **`images`** (if present).  
2. If `playbookId` ≠ current page, warn the user (the site already does).  
3. Unknown fields: **preserve** them when round-tripping if possible.  
4. Do not require `images` to be present.  
5. Session `playDate` is **local calendar** `YYYY-MM-DD`, not necessarily UTC.  
6. Use **`appVersion`** for “which UI built this”; use **`exportFormat`** for “how to parse the file.”

## Related

- [AI & automation](ai-automation.md)  
- [Revision history](revision-history.md) (app versions)  
- Live sheet: use **Load JSON** on the matching `playbookUrl`
