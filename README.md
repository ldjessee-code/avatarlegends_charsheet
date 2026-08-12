# Avatar Legends — Digital Character Sheets

Unofficial **HTML / CSS / JS** character sheets for *Avatar Legends: The Roleplaying Game* (Powered by the Apocalypse).  
Works **offline** — open the files in a browser. No install, no web server.

> **Fan tool only.** Not affiliated with Magpie Games or Viacom.  
> See [NOTICE.md](NOTICE.md) for trademarks and use.

---

## For players (quick start)

### Install (from your GM’s zip)

1. Unzip the folder anywhere (Desktop, USB drive, Dropbox, etc.).
2. Keep the folder structure intact (`css/`, `js/`, `data/`, `playbooks/`, `assets/`).
3. Open **`index.html`** in Chrome, Firefox, Safari, or Edge  
   **or** open your playbook directly, e.g. `playbooks/adamant.html`.

### Make your character

1. Pick your playbook from the hub (or open its HTML file).
2. Fill name, player, training, history, moves, techniques, etc.
3. Changes **autosave in this browser** (local storage).
4. When you want a real backup or to email the GM: click **Download JSON**.
5. Later: **Load JSON** on the same playbook page to restore.

### Tips

| Topic | What to know |
|--------|----------------|
| Autosave | Stays in *this* browser on *this* computer only |
| Download JSON | Portable file — backup, email GM, switch machines |
| Images | Portrait + session art embed in the JSON — keep under ~2.5 MB each |
| Training | Changes the sheet color theme (Fire, Water, Earth, Air, Weapons, Tech) |
| Collapse | Section headers collapse for play; click ▾/▸ to expand |
| Print | Use the Print button (toolbar hides on paper) |

### Emailing the GM

1. **Download JSON** after the session (or after major changes).
2. Name the file clearly, e.g. `Sokka_Adamant_2026-08-12.json`.
3. Attach to email. Optional: attach a screenshot if useful.

---

## For the GM

### Zip for players

From the parent folder:

```bash
cd /path/to/Avatar_RPG
zip -r AvatarLegends-charsheet.zip charsheet \
  -x "charsheet/.git/*" -x "charsheet/**/.DS_Store" -x "charsheet/data/playbooks_raw.json"
```

Ship **`AvatarLegends-charsheet.zip`**. Players only need a browser.

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

| Playbook | Status |
|----------|--------|
| The Adamant (Core) | Ready |
| Other Core + WSTAG | Planned (same engine) |

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

- [x] Adamant example sheet (full interactive)
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
