# Avatar Legends — Digital Character Sheets

Unofficial **HTML / CSS / JS** character sheets for *Avatar Legends: The Roleplaying Game* (Powered by the Apocalypse).  
Works **offline** — open the files in a browser. No install, no web server.

> **Fan tool only.** Not affiliated with Magpie Games or Viacom.  
> See [NOTICE.md](NOTICE.md) for trademarks and use.

## Documentation (`docs/`)

Open-source style: longer docs live in **[docs/](docs/)**.

| Doc | Contents |
|-----|----------|
| [docs/index.html](docs/index.html) | Browse on the live site / offline |
| [Accessibility](docs/accessibility.md) | What’s done for a11y; how to report issues |
| [Character JSON](docs/character-json.md) | Export format, versions, images block |
| [AI & automation](docs/ai-automation.md) | Prefer JSON + documented actions |
| [Revision history](docs/revision-history.md) | Past releases only (no roadmap) |

GitHub renders the `.md` files in the repo; GitHub Pages serves `docs/index.html`.

---

## For players (quick start)

### Option A — Online (easiest)

Open: **https://ldjessee-code.github.io/avatarlegends_charsheet/**

Works on phone, tablet, and computer.  
**After every session:** tap **Download JSON** and **email the file to your GM** — shared backup and you’re both on the same page about the character.

### Option B — Offline on a computer (Windows / Mac / Linux)

Same steps on every platform — no special installer:

1. Get **`AvatarLegends-charsheet-offline.zip`** from your GM (email / shared drive).
2. **Unzip** it (Windows: right-click → Extract All; Mac: double-click the zip).
3. Open the folder and double-click **`index.html`** (Chrome, Firefox, Edge, or Safari).
4. Keep the whole folder together (`css/`, `js/`, `data/`, `playbooks/`, …).

Full walkthrough: [docs/install-offline.md](docs/install-offline.md) · [HTML](docs/install-offline.html)

### Phone / tablet home screen icon

- **iPhone / iPad:** Safari → Share → **Add to Home Screen**  
- **Android:** Chrome → ⋮ → **Add to Home screen** / **Install app**  

Details: [docs/home-screen.md](docs/home-screen.md) · [HTML](docs/home-screen.html)  
(Prefer the **live site** for home screen icons; offline zip is best on a PC.)

### Make your character

1. Pick your playbook from the hub (or open its HTML file).
2. Fill name, player, training, history, moves, techniques, etc.
3. Changes **autosave in this browser** (local storage).
4. **After every session:** click **Download JSON** and **email that file to your GM**.  
   That keeps a backup in email and keeps you both aligned on the character.
5. Later (new phone, cleared browser, etc.): **Load JSON** on the same playbook page to restore.

### Tips

| Topic | What to know |
|--------|----------------|
| Autosave | Stays in *this* browser on *this* computer only |
| Download JSON | **After each session:** save the file and email your GM (backup + shared truth) |
| Images | Portrait + session art embed in the JSON — keep under ~2.5 MB each |
| Campaign banner | Session notes: **Package default**, **My image**, or **No banner** |
| Training | Changes the sheet color theme (Fire, Water, Earth, Air, Weapons, Tech) |
| Collapse | Section headers collapse for play; click ▾/▸ to expand |
| Print | Use the Print button (toolbar hides on paper) |

### Phones, tablets, and “can I use my Switch?”

| Device | Expectation |
|--------|-------------|
| **iPhone / iPad (Safari)** | **Yes** — use the GitHub Pages link (not a zip on Files, if you can help it). Add to Home Screen optional. Prefer collapsed sections at the table. **Download JSON** works; AirDrop/Files the backup to the GM. |
| **Android phone/tablet** | Same as above in Chrome. |
| **Laptop / desktop** | Best for character creation and long typing. |
| **Nintendo Switch / Switch 2** | **Not supported** (joke OK, reality no). Console browsers are limited, awkward for file save/load, and a poor fit for this kind of web app. Use a phone or tablet instead. |

**Why Pages beats a zip on iOS:** opening multi-file HTML from the Files app often breaks relative CSS/JS paths.  
**https://ldjessee-code.github.io/avatarlegends_charsheet/** loads everything correctly.

### After each session (required habit)

1. **Download JSON** (right after play, while everything is fresh).
2. Name the file clearly, e.g. `Sokka_Adamant_2026-08-12.json`.
3. **Email it to your GM.**  
   That gives you both a backup in email and the same picture of the character.
4. Optional: attach a screenshot if something is easier to show visually.

---

## For the GM

### Offline zip for players (local distribution — not required on GitHub)

Rebuild after sheet updates, then email the zip:

```bash
cd /path/to/Avatar_RPG/charsheet
zip -r ../AvatarLegends-charsheet-offline.zip . \
  -x "*.git*" -x "**/.DS_Store" -x "**/.DS_Store*"
```

Creates **`AvatarLegends-charsheet-offline.zip`** next to the `charsheet` folder.  
Players only need a browser — see [docs/install-offline.md](docs/install-offline.md).

### Campaign branding

Edit **`data/campaign.js`**:

- `name` — e.g. `"Iron and Ash"`
- `bannerSrc` — path to banner image under `assets/`
- `tagline` — optional caption

Banner appears at the top of **Session notes** (when that section is expanded).

### Per-session images

Each session note can hold optional art (cutscene, map, mood).  
Shown on the left when expanded; tiny thumb in the collapsed header if present.  
**Add image** only appears when expanded and no image is set.

### Current playbooks

| Set | Count | Status |
|-----|-------|--------|
| Core Book | 10 | Ready |
| Wan Shi Tong’s Adventure Guide | 4 | Ready |
| Uncle Iroh’s Adventure Guide | 4 | Ready |

**Live hub:** https://ldjessee-code.github.io/avatarlegends_charsheet/

---

## Project layout (keep compact for zips)

```
charsheet/
  index.html              Hub — pick a playbook
  NOTICE.md               Legal / IP notice
  README.md               This file
  assets/                 Campaign banner (and similar static art)
  css/sheet.css           All styles + training themes
  js/sheet.js             Sheet engine (render, save, UI)
  data/
    common.js             Shared rules data
    campaign.js           Your campaign name + banner
    playbooks/
      adamant.js          Playbook definition
  playbooks/
    adamant.html          Thin page: loads data + engine
```

**Do not** ship PDF rulebooks inside this zip unless you have rights to redistribute them.

---

## Technical notes

- **No build step.** Plain static files.
- **Load order** on a playbook page: `common.js` → `campaign.js` → `playbooks/<id>.js` → `sheet.js`
- **Storage key:** `avatar-legends-sheet:<playbookId>`
- **JSON export** wraps character state with `_meta` (playbook id, export time)
- **Comments** in HTML/CSS/JS mark major sections for review

---

## GitHub (public repo)

If you publish this:

1. Keep **NOTICE.md** and the README legal blurb.
2. Add a clear **Issues** note: fan project, no official support.
3. Prefer **not** committing huge binary dumps or full commercial PDFs.
4. Campaign-specific art: only what you may redistribute.

### Create the repo (you or your tool)

```bash
cd charsheet
git init
git add .
git commit -m "Initial Avatar Legends digital character sheets"
# Create empty public repo on GitHub, then:
git remote add origin git@github.com:YOUR_USER/avatar-legends-charsheet.git
git branch -M main
git push -u origin main
```

Or create the GitHub repo first and send the URL to finish the push.

---

## Status & roadmap

- [x] Adamant, Bold, Guardian, Foundling sheets
- [x] Collapsible sections, training themes, session notes, campaign banner
- [x] Save/load JSON + browser autosave
- [ ] Remaining Core + Wan Shi Tong’s playbooks (same engine + data files)
- [ ] Optional: shared technique catalog by training

---

## Legal (short)

Unofficial fan project for **personal table use**.  
Avatar Legends and related marks © Viacom International Inc.  
RPG by [Magpie Games](https://magpiegames.com/).  
See [NOTICE.md](NOTICE.md).
