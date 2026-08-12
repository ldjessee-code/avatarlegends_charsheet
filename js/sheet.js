/**
 * sheet.js — Avatar Legends interactive character sheet engine
 *
 * Depends on (load order):
 *   1. data/common.js      → AL.COMMON
 *   2. data/campaign.js    → AL.CAMPAIGN (optional branding)
 *   3. data/playbooks/*.js → AL.PLAYBOOKS[id]
 *   4. this file           → AL.Sheet.init(playbookId)
 *
 * Persistence:
 *   - Autosaves to localStorage key: avatar-legends-sheet:<playbookId>
 *   - Download JSON / Load JSON for backup and sharing with the GM
 *
 * One IIFE keeps globals limited to window.AL
 */
(function () {
  "use strict";

  // --- Constants -----------------------------------------------------------
  const SESSION_TITLE_MAX = 48; // short in-world label
  const BACKSTORY_PREVIEW = 180; // chars in collapsed history
  const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024; // portraits / session art

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function titleCase(s) {
    return String(s || "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function trainingThemeClass(training) {
    const t = (training || "").toLowerCase();
    if (t.includes("fire")) return "theme-fire";
    if (t.includes("water")) return "theme-water";
    if (t.includes("earth")) return "theme-earth";
    if (t.includes("air")) return "theme-air";
    if (t.includes("weapon")) return "theme-weapons";
    if (t.includes("tech")) return "theme-technology";
    return "";
  }

  function techniqueCatalog(pb) {
    const list = [];
    AL.COMMON.basicTechniques.forEach((t) => list.push({ ...t, group: "Basic" }));
    if (pb.startingTechnique) list.push({ ...pb.startingTechnique, group: "Playbook" });
    list.push({
      id: "__custom__",
      name: "Custom technique…",
      approach: "defend",
      text: "",
      group: "Custom"
    });
    return list;
  }

  function emptyTech() {
    return {
      sourceId: "",
      name: "",
      approach: "defend",
      text: "",
      mastery: "" // "" | "learned" | "practiced" | "mastered"
    };
  }

  /** Migrate old three-checkbox mastery → single hierarchy level */
  function normalizeMastery(tech) {
    if (!tech) return "";
    if (tech.mastery) return tech.mastery;
    if (tech.mastered) return "mastered";
    if (tech.practiced) return "practiced";
    if (tech.learned) return "learned";
    return "";
  }

  /**
   * New session note row.
   * imageDataUrl: optional cutscene / mood art (stored in character JSON).
   */
  function emptySession() {
    return {
      id: "s-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      playDate: new Date().toISOString().slice(0, 10),
      title: "",
      notes: "",
      imageDataUrl: "",
      collapsed: false
    };
  }

  function defaultUi() {
    return {
      historyExpanded: true,
      identityExpanded: true,
      combatStatsExpanded: true,
      playbookExpanded: true,
      techniquesExpanded: true,
      growthExpanded: false,
      sessionsExpanded: true,
      portraitExpanded: false
    };
  }

  /**
   * Campaign banner branding stored per character (so each table can differ).
   * mode: "default" uses AL.CAMPAIGN from data/campaign.js
   *       "custom"  uses bannerDataUrl (+ optional name/tagline overrides)
   *       "hidden"  no banner image (name still optional in summary)
   */
  function defaultCampaignBrand() {
    return {
      mode: "default",
      name: "",
      tagline: "",
      bannerDataUrl: ""
    };
  }

  function packageCampaign() {
    return AL.CAMPAIGN || { name: "", tagline: "", bannerSrc: "" };
  }

  /** Resolved name/tagline/image for UI (respects mode) */
  function resolveCampaignBrand(state) {
    const pkg = packageCampaign();
    const brand = state.campaign || defaultCampaignBrand();
    const mode = brand.mode || "default";
    const name = (brand.name && brand.name.trim()) || pkg.name || "Campaign";
    const tagline = (brand.tagline && brand.tagline.trim()) || pkg.tagline || "";
    let imageSrc = "";
    let visible = false;
    if (mode === "hidden") {
      visible = false;
    } else if (mode === "custom") {
      imageSrc = brand.bannerDataUrl || "";
      visible = !!imageSrc;
    } else {
      // default
      imageSrc = pkg.bannerSrc || "";
      visible = !!imageSrc;
    }
    return { mode, name, tagline, imageSrc, visible };
  }

  function defaultState(pb) {
    return {
      name: "",
      playerName: "",
      look: "",
      hometown: "",
      training: "",
      fightingStyle: "",
      background: "",
      demeanor: "",
      portraitDataUrl: "",
      backstory: "",
      campaign: defaultCampaignBrand(),
      stats: { ...pb.baseStats },
      creationBonusStat: "",
      balance: 0,
      center: 0,
      conditions: Object.fromEntries(AL.COMMON.conditions.map((c) => [c.id, false])),
      statuses: Object.fromEntries(
        [...AL.COMMON.statuses.positive, ...AL.COMMON.statuses.negative].map((s) => [s, false])
      ),
      fatigue: 0,
      featureFields: Object.fromEntries((pb.feature.fields || []).map((f) => [f.id, ""])),
      selectedMoves: Array(pb.movesChoose || 2).fill(""),
      customMoves: [],
      otherPlaybookMoves: [],
      techniques: startingTechniques(pb),
      historyAnswers: pb.history.map(() => ""),
      connections: Object.fromEntries((pb.connections || []).map((c) => [c.id, ""])),
      growth: 0,
      advancements: Object.fromEntries(
        AL.COMMON.growthAdvancements.map((a) => [a.id, Array(a.slots).fill(false)])
      ),
      momentUnlocked: false,
      sessions: [emptySession()],
      ui: defaultUi(),
      /* legacy field kept so old imports don't break */
      notes: ""
    };
  }

  function storageKey(pbId) {
    return `avatar-legends-sheet:${pbId}`;
  }

  function migrateState(pb, raw) {
    const base = defaultState(pb);
    const merged = { ...base, ...raw };
    if (!merged.ui) merged.ui = defaultUi();
    else merged.ui = { ...defaultUi(), ...raw.ui };
    if (!Array.isArray(merged.sessions) || !merged.sessions.length) {
      const s = emptySession();
      if (raw.notes) s.notes = raw.notes;
      merged.sessions = [s];
    } else {
      merged.sessions = merged.sessions.map((s) => ({
        ...emptySession(),
        ...s,
        imageDataUrl: s.imageDataUrl || ""
      }));
    }
    if (!merged.historyAnswers || merged.historyAnswers.length !== pb.history.length) {
      const answers = pb.history.map((_, i) => (raw.historyAnswers && raw.historyAnswers[i]) || "");
      merged.historyAnswers = answers;
    }
    if (!merged.connections) merged.connections = base.connections;
    if (merged.playerName == null) merged.playerName = "";
    if (merged.backstory == null) merged.backstory = "";
    if (merged.portraitDataUrl == null) merged.portraitDataUrl = "";
    merged.campaign = { ...defaultCampaignBrand(), ...(raw.campaign || {}) };
    if (Array.isArray(merged.techniques)) {
      merged.techniques = compactTechniques(pb, merged.techniques);
    } else {
      merged.techniques = startingTechniques(pb);
    }
    return merged;
  }

  function loadState(pb) {
    try {
      const raw = localStorage.getItem(storageKey(pb.id));
      if (!raw) return defaultState(pb);
      return migrateState(pb, JSON.parse(raw));
    } catch {
      return defaultState(pb);
    }
  }

  function saveState(pb, state) {
    localStorage.setItem(storageKey(pb.id), JSON.stringify(state));
  }

  function effectiveStat(state, statName) {
    let v = state.stats[statName] ?? 0;
    if (state.creationBonusStat === statName) v += 1;
    if (statName === "Passion" && state.selectedMoves.includes("driven-by-justice")) {
      v = Math.min(3, v + 1);
    }
    return v;
  }

  function historyAnsweredCount(state) {
    return (state.historyAnswers || []).filter((a) => String(a || "").trim()).length;
  }

  function formatStat(n) {
    return n > 0 ? `+${n}` : String(n);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function applyTheme(state) {
    document.body.classList.remove(
      "theme-fire",
      "theme-water",
      "theme-earth",
      "theme-air",
      "theme-weapons",
      "theme-technology"
    );
    const cls = trainingThemeClass(state.training);
    if (cls) document.body.classList.add(cls);
  }

  // ---------- App state ----------
  let currentPb = null;
  let currentState = null;
  let catalog = null;
  let saveTimer = null;
  let rootEl = null;
  let suppressScrollCompact = false;

  function scheduleSave() {
    if (!currentPb) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveState(currentPb, currentState);
      setStatus("Autosaved in browser");
    }, 280);
  }

  function setStatus(msg) {
    const el = $("#save-status");
    if (el) el.textContent = msg;
  }

  function updateToolbarName(state) {
    const el = $("#toolbar-title");
    if (!el || !currentPb) return;
    el.textContent = state.name
      ? `${state.name} — ${currentPb.name}`
      : currentPb.name;
  }

  function refresh() {
    if (!rootEl || !currentPb) return;
    applyTheme(currentState);
    render(rootEl, currentPb, currentState, catalog);
    updateToolbarName(currentState);
  }

  // ---------- DOM helpers ----------

  function field(label, control) {
    const lab = document.createElement("label");
    lab.className = "field";
    lab.appendChild(document.createTextNode(label));
    lab.appendChild(control);
    return lab;
  }

  function textInput(value, onInput, placeholder, opts) {
    const i = document.createElement("input");
    i.type = (opts && opts.type) || "text";
    i.value = value || "";
    if (placeholder) i.placeholder = placeholder;
    if (opts && opts.maxLength) i.maxLength = opts.maxLength;
    if (opts && opts.className) i.className = opts.className;
    i.addEventListener("input", () => onInput(i.value));
    return i;
  }

  function selectInput(value, options, onChange, placeholder) {
    const s = document.createElement("select");
    if (placeholder !== false) {
      const o0 = document.createElement("option");
      o0.value = "";
      o0.textContent = placeholder || "— select —";
      s.appendChild(o0);
    }
    options.forEach((opt) => {
      const o = document.createElement("option");
      if (typeof opt === "string") {
        o.value = opt;
        o.textContent = opt;
      } else {
        o.value = opt.value;
        o.textContent = opt.label;
        if (opt.disabled) o.disabled = true;
      }
      s.appendChild(o);
    });
    s.value = value || "";
    s.addEventListener("change", () => onChange(s.value));
    return s;
  }

  /** Compact visual balance track for collapsed summary */
  function formatBalanceTrack(pb, state) {
    const parts = [];
    for (let v = AL.COMMON.balanceMin; v <= AL.COMMON.balanceMax; v++) {
      if (v === state.balance) parts.push("X");
      else if (v === state.center) parts.push("0");
      else parts.push("·");
    }
    return `${pb.principles.left}  ${parts.join(" ")}  ${pb.principles.right}`;
  }

  function startingTechniques(pb) {
    const list = [];
    if (pb.startingTechnique) {
      list.push({
        sourceId: pb.startingTechnique.id,
        name: pb.startingTechnique.name,
        approach: pb.startingTechnique.approach,
        text: pb.startingTechnique.text,
        // Most playbooks start with this technique mastered; allow override
        mastery: pb.startingTechnique.mastery || "mastered"
      });
    }
    // e.g. Foundling starts with an extra mastered technique of their choice
    const extra = pb.extraStartingTechniqueSlots || 0;
    for (let i = 0; i < extra; i++) {
      list.push({
        ...emptyTech(),
        mastery: "mastered",
        learned: true
      });
    }
    return list;
  }

  function isTechEmpty(t) {
    return !t || (!t.sourceId && !t.name && !t.text);
  }

  /** Drop trailing empty technique slots; keep at least starting set if all empty */
  function compactTechniques(pb, techniques) {
    if (!Array.isArray(techniques) || !techniques.length) return startingTechniques(pb);
    let end = techniques.length;
    while (end > 0 && isTechEmpty(techniques[end - 1])) end--;
    const kept = techniques.slice(0, end).map((t) => {
      const next = { ...emptyTech(), ...t };
      next.mastery = normalizeMastery(t);
      delete next.learned;
      delete next.practiced;
      delete next.mastered;
      return next;
    });
    if (!kept.length) return startingTechniques(pb);
    return kept;
  }

  function moveIsInUse(pb, state, move) {
    if (!move) return false;
    if ((state.selectedMoves || []).includes(move.id)) return true;
    const name = (move.name || "").trim().toLowerCase();
    return (state.otherPlaybookMoves || []).some(
      (slot) => (slot.name || "").trim().toLowerCase() === name && (slot.text || "").trim()
    );
  }

  function makeSection(id, title, expanded, summaryNode, bodyBuilder, options) {
    const sec = document.createElement("section");
    sec.className = "section" + (expanded ? "" : " is-collapsed");
    sec.dataset.section = id;

    const head = document.createElement("div");
    head.className = "section-head";
    head.setAttribute("role", "button");
    head.setAttribute("aria-expanded", expanded ? "true" : "false");
    head.tabIndex = 0;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "section-toggle-btn";
    btn.setAttribute("aria-label", expanded ? "Collapse section" : "Expand section");
    btn.textContent = expanded ? "▾" : "▸";

    const h2 = document.createElement("h2");
    h2.textContent = title;

    const summary = document.createElement("div");
    summary.className = "section-summary";
    if (summaryNode) {
      if (typeof summaryNode === "string") summary.textContent = summaryNode;
      else summary.appendChild(summaryNode);
    }

    head.appendChild(btn);
    head.appendChild(h2);
    head.appendChild(summary);

    if (options && options.headExtra) {
      head.appendChild(options.headExtra);
    }

    const body = document.createElement("div");
    body.className = "section-body";
    bodyBuilder(body);

    function toggle() {
      if (options && options.onToggle) options.onToggle(!sec.classList.contains("is-collapsed") === false ? true : !expanded);
      // Use actual state flag via callback
      if (options && options.setExpanded) {
        const next = sec.classList.contains("is-collapsed");
        options.setExpanded(next);
        scheduleSave();
        refresh();
      }
    }

    head.addEventListener("click", (e) => {
      if (e.target.closest("button.track-box, input, select, textarea, a, .growth-inline-track")) return;
      if (e.target === btn || e.target === head || e.target === h2 || e.target.closest(".section-summary") || e.target === summary) {
        if (options && options.setExpanded) {
          options.setExpanded(sec.classList.contains("is-collapsed"));
          scheduleSave();
          refresh();
        }
      }
    });
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (options && options.setExpanded) {
        options.setExpanded(sec.classList.contains("is-collapsed"));
        scheduleSave();
        refresh();
      }
    });
    head.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });

    sec.appendChild(head);
    sec.appendChild(body);
    return sec;
  }

  // ---------- Render ----------

  function render(root, pb, state, cat) {
    root.innerHTML = "";
    root.appendChild(renderHeader(pb, state));
    root.appendChild(renderHistorySection(pb, state));
    root.appendChild(renderIdentitySection(pb, state));
    root.appendChild(renderCombatStatsSection(pb, state));
    root.appendChild(renderPlaybookSection(pb, state));
    root.appendChild(renderTechniquesSection(pb, state, cat));
    root.appendChild(renderGrowthSection(pb, state));
    root.appendChild(renderSessionsSection(state));
  }

  function renderHeader(pb, state) {
    const wrap = document.createElement("header");
    wrap.className = "sheet-header";

    // Left: character name (primary) + player
    const left = document.createElement("div");
    left.className = "identity-left";
    const nameIn = textInput(
      state.name,
      (v) => {
        state.name = v;
        updateToolbarName(state);
        scheduleSave();
      },
      "Character name",
      { className: "char-name-input" }
    );
    nameIn.setAttribute("aria-label", "Character name");
    left.appendChild(nameIn);

    const playerRow = document.createElement("div");
    playerRow.className = "player-row";
    const plab = document.createElement("label");
    plab.textContent = "Player";
    plab.htmlFor = "player-name";
    const pin = textInput(
      state.playerName,
      (v) => {
        state.playerName = v;
        scheduleSave();
      },
      "Your name at the table"
    );
    pin.id = "player-name";
    playerRow.appendChild(plab);
    playerRow.appendChild(pin);
    left.appendChild(playerRow);

    // Middle-right: playbook info
    const right = document.createElement("div");
    right.className = "identity-right";
    right.innerHTML = `
      <p class="playbook-name">${escapeHtml(pb.name)}</p>
      <p class="tagline">${escapeHtml(pb.tagline || "")}</p>
      <span class="source-badge">${escapeHtml(pb.source || "")}</span>
    `;

    // Far right: portrait + buttons
    const portraitWrap = document.createElement("div");
    portraitWrap.className = "portrait-wrap";
    const expanded = !!(state.ui && state.ui.portraitExpanded);

    if (state.portraitDataUrl) {
      const img = document.createElement("img");
      img.className = "portrait" + (expanded ? " is-expanded" : "");
      img.src = state.portraitDataUrl;
      img.alt = state.name ? `${state.name} portrait` : "Character portrait";
      img.title = expanded ? "Click to shrink" : "Click to enlarge";
      img.addEventListener("click", () => {
        state.ui.portraitExpanded = !state.ui.portraitExpanded;
        scheduleSave();
        refresh();
      });
      portraitWrap.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "portrait-placeholder" + (expanded ? " is-expanded" : "");
      ph.textContent = "No image";
      ph.addEventListener("click", () => $("#portrait-file") && $("#portrait-file").click());
      portraitWrap.appendChild(ph);
    }

    const actions = document.createElement("div");
    actions.className = "portrait-actions";
    const file = document.createElement("input");
    file.type = "file";
    file.id = "portrait-file";
    file.accept = "image/*";
    file.hidden = true;
    file.addEventListener("change", () => {
      readImageFile(file.files && file.files[0], (dataUrl) => {
        state.portraitDataUrl = dataUrl;
        state.ui.portraitExpanded = false;
        scheduleSave();
        refresh();
      });
    });

    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.textContent = state.portraitDataUrl ? "Change" : "Add image";
    uploadBtn.addEventListener("click", () => file.click());

    const sizeBtn = document.createElement("button");
    sizeBtn.type = "button";
    sizeBtn.textContent = expanded ? "Shrink" : "Enlarge";
    sizeBtn.disabled = !state.portraitDataUrl;
    sizeBtn.addEventListener("click", () => {
      state.ui.portraitExpanded = !state.ui.portraitExpanded;
      scheduleSave();
      refresh();
    });

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.textContent = "Remove";
    clearBtn.disabled = !state.portraitDataUrl;
    clearBtn.addEventListener("click", () => {
      if (!confirm("Remove character image?")) return;
      state.portraitDataUrl = "";
      state.ui.portraitExpanded = false;
      scheduleSave();
      refresh();
    });

    actions.appendChild(uploadBtn);
    actions.appendChild(sizeBtn);
    actions.appendChild(clearBtn);
    actions.appendChild(file);
    portraitWrap.appendChild(actions);

    wrap.appendChild(left);
    wrap.appendChild(right);
    wrap.appendChild(portraitWrap);
    return wrap;
  }

  function renderHistorySection(pb, state) {
    const expanded = state.ui.historyExpanded !== false;
    const answered = historyAnsweredCount(state);
    const total = pb.history.length;

    const summary = document.createElement("div");
    const qs = document.createElement("span");
    qs.className = "qs-meta";
    qs.textContent = `Qs: ${answered}/${total}`;
    summary.appendChild(qs);

    if (!expanded) {
      if (state.backstory && state.backstory.trim()) {
        const prev = document.createElement("div");
        prev.className = "backstory-preview";
        prev.style.marginTop = "0.25rem";
        const t = state.backstory.trim();
        prev.textContent =
          t.length > BACKSTORY_PREVIEW ? t.slice(0, BACKSTORY_PREVIEW) + "…" : t;
        summary.appendChild(prev);
      }
      (pb.connections || []).forEach((c) => {
        const name = (state.connections[c.id] || "").trim() || "________";
        const line = document.createElement("span");
        line.className = "conn-line";
        line.textContent = `${name} ${c.prompt}`;
        summary.appendChild(line);
      });
    }

    return makeSection(
      "history",
      "History & connections",
      expanded,
      summary,
      (body) => {
        body.appendChild(
          field(
            "Backstory",
            (() => {
              const ta = document.createElement("textarea");
              ta.placeholder = "Origin, bonds, scars, what brought you to this group…";
              ta.style.minHeight = "6rem";
              ta.value = state.backstory || "";
              ta.addEventListener("input", () => {
                state.backstory = ta.value;
                scheduleSave();
              });
              return ta;
            })()
          )
        );

        const connTitle = document.createElement("h3");
        connTitle.style.cssText =
          "margin:0.85rem 0 0.45rem;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--sec-history)";
        connTitle.textContent = "Connections";
        body.appendChild(connTitle);

        (pb.connections || []).forEach((c) => {
          const row = document.createElement("div");
          row.className = "connection-row";
          row.appendChild(
            textInput(
              state.connections[c.id] || "",
              (v) => {
                state.connections[c.id] = v;
                scheduleSave();
              },
              "PC name"
            )
          );
          const prompt = document.createElement("div");
          prompt.style.paddingTop = "0.45rem";
          prompt.style.fontSize = "0.9rem";
          prompt.textContent = c.prompt;
          row.appendChild(prompt);
          body.appendChild(row);
        });

        const histTitle = document.createElement("h3");
        histTitle.style.cssText =
          "margin:0.85rem 0 0.25rem;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--sec-history)";
        histTitle.textContent = "History questions";
        body.appendChild(histTitle);
        body.appendChild(
          Object.assign(document.createElement("p"), {
            className: "hint",
            textContent: `Answered ${answered}/${total}. Expand here for longer answers.`
          })
        );

        pb.history.forEach((q, i) => {
          const item = document.createElement("div");
          item.className = "history-item";
          const qq = document.createElement("div");
          qq.className = "q";
          qq.textContent = q;
          item.appendChild(qq);
          const ta = document.createElement("textarea");
          ta.value = state.historyAnswers[i] || "";
          ta.addEventListener("input", () => {
            state.historyAnswers[i] = ta.value;
            scheduleSave();
          });
          item.appendChild(ta);
          body.appendChild(item);
        });
      },
      {
        setExpanded: (v) => {
          state.ui.historyExpanded = v;
        }
      }
    );
  }

  function renderIdentitySection(pb, state) {
    const expanded = state.ui.identityExpanded !== false;
    let summary = "";
    if (!expanded) {
      const summaryEl = document.createElement("div");
      const line1 = document.createElement("span");
      line1.className = "sum-line";
      const trainBits = [state.training, state.fightingStyle].filter((x) => String(x || "").trim());
      line1.textContent = trainBits.length ? trainBits.join(" — ") : "No training set";
      if (!trainBits.length) line1.classList.add("sum-muted");
      summaryEl.appendChild(line1);
      const line2 = document.createElement("span");
      line2.className = "sum-line";
      const bd = [state.background, state.demeanor].filter((x) => String(x || "").trim());
      line2.textContent = bd.length ? bd.join(" · ") : "No background / demeanor";
      if (!bd.length) line2.classList.add("sum-muted");
      summaryEl.appendChild(line2);
      summary = summaryEl;
    }

    return makeSection(
      "identity",
      "Character details",
      expanded,
      summary,
      (body) => {
        const row1 = document.createElement("div");
        row1.className = "row-fields";
        row1.appendChild(
          field(
            "Look",
            textInput(state.look, (v) => {
              state.look = v;
              scheduleSave();
            }, "Appearance, clothing, notable features")
          )
        );
        row1.appendChild(
          field(
            "Home Town",
            textInput(state.hometown, (v) => {
              state.hometown = v;
              scheduleSave();
            })
          )
        );
        body.appendChild(row1);

        const row2 = document.createElement("div");
        row2.className = "row-fields";
        row2.appendChild(
          field(
            "Training",
            selectInput(state.training, AL.COMMON.trainings, (v) => {
              state.training = v;
              applyTheme(state);
              scheduleSave();
              refresh();
            })
          )
        );
        row2.appendChild(
          field(
            "Fighting style / qualifier",
            textInput(state.fightingStyle, (v) => {
              state.fightingStyle = v;
              scheduleSave();
            }, "e.g. Southern Water Tribe healer")
          )
        );
        body.appendChild(row2);

        const row3 = document.createElement("div");
        row3.className = "row-fields";
        row3.appendChild(
          field(
            "Background",
            selectInput(state.background, AL.COMMON.backgrounds, (v) => {
              state.background = v;
              scheduleSave();
            })
          )
        );
        row3.appendChild(
          field(
            "Demeanor",
            selectInput(state.demeanor, pb.demeanors, (v) => {
              state.demeanor = v;
              scheduleSave();
            })
          )
        );
        body.appendChild(row3);
      },
      {
        setExpanded: (v) => {
          state.ui.identityExpanded = v;
        }
      }
    );
  }

  function renderCombatStatsSection(pb, state) {
    const expanded = state.ui.combatStatsExpanded !== false;
    let summary = "";
    if (!expanded) {
      const summaryEl = document.createElement("div");
      summaryEl.className = "combat-collapsed";

      const leftCol = document.createElement("div");
      leftCol.className = "combat-collapsed-left";

      const statsLine = document.createElement("span");
      statsLine.className = "sum-line";
      statsLine.textContent = AL.COMMON.stats
        .map((s) => `${s.slice(0, 3)} ${formatStat(effectiveStat(state, s))}`)
        .join("  ·  ");
      leftCol.appendChild(statsLine);

      const balLine = document.createElement("span");
      balLine.className = "sum-line balance-track-sum";
      balLine.textContent = formatBalanceTrack(pb, state);
      balLine.title =
        "X = current balance · 0 = your center (if different from current). Click section to expand.";
      leftCol.appendChild(balLine);

      const rightCol = document.createElement("div");
      rightCol.className = "combat-collapsed-right";

      const fatRow = document.createElement("div");
      fatRow.className = "collapsed-fatigue";
      const fatLabel = document.createElement("span");
      fatLabel.className = "collapsed-fatigue-label";
      fatLabel.textContent = "Fatigue";
      fatRow.appendChild(fatLabel);
      const fatTrack = document.createElement("div");
      fatTrack.className = "track collapsed-fatigue-track";
      for (let i = 1; i <= AL.COMMON.fatigueMax; i++) {
        const box = document.createElement("button");
        box.type = "button";
        box.className = "track-box growth-inline" + (i <= state.fatigue ? " filled" : "");
        box.title = `Fatigue ${i <= state.fatigue ? i : i - 1} — click to set`;
        box.addEventListener("click", (e) => {
          e.stopPropagation();
          state.fatigue = state.fatigue === i ? i - 1 : i;
          scheduleSave();
          refresh();
        });
        fatTrack.appendChild(box);
      }
      fatRow.appendChild(fatTrack);
      rightCol.appendChild(fatRow);

      // Labels help players keep CONDITIONS (character harm) vs STATUSES (exchange fiction) distinct
      const markedCond = AL.COMMON.conditions
        .filter((c) => state.conditions[c.id])
        .map((c) => c.name);
      if (markedCond.length) {
        const condLine = document.createElement("span");
        condLine.className = "sum-line";
        condLine.innerHTML =
          `<span class="sum-label">Conditions:</span> ${escapeHtml(markedCond.join(", "))}`;
        condLine.title =
          "Conditions: longer-term emotional/physical states with move penalties until cleared.";
        rightCol.appendChild(condLine);
      }

      const markedStat = [...AL.COMMON.statuses.positive, ...AL.COMMON.statuses.negative].filter(
        (s) => state.statuses[s]
      );
      if (markedStat.length) {
        const stLine = document.createElement("span");
        stLine.className = "sum-line";
        stLine.innerHTML =
          `<span class="sum-label">Statuses:</span> ${escapeHtml(markedStat.join(", "))}`;
        stLine.title =
          "Statuses: temporary combat/fiction tags (Empowered, Trapped, etc.) from techniques and the fiction.";
        rightCol.appendChild(stLine);
      }

      summaryEl.appendChild(leftCol);
      summaryEl.appendChild(rightCol);
      summary = summaryEl;
    }

    return makeSection(
      "combat-stats",
      "Stats, balance & conditions",
      expanded,
      summary,
      (body) => {
        const grid = document.createElement("div");
        grid.className = "inner-grid-2";

        // Stats
        const statsCard = document.createElement("div");
        statsCard.className = "subcard";
        statsCard.innerHTML = "<h3>Stats</h3>";
        const sg = document.createElement("div");
        sg.className = "stat-grid";
        AL.COMMON.stats.forEach((stat) => {
          const box = document.createElement("div");
          box.className = "stat-box";
          const val = effectiveStat(state, stat);
          box.innerHTML = `
            <div class="stat-name">${stat}</div>
            <div class="stat-value">${formatStat(val)}</div>
            <div class="stat-controls">
              <button type="button" data-act="dec" data-stat="${stat}">−</button>
              <button type="button" data-act="inc" data-stat="${stat}">+</button>
            </div>
          `;
          sg.appendChild(box);
        });
        statsCard.appendChild(sg);
        const bonus = document.createElement("div");
        bonus.className = "creation-bonus";
        bonus.appendChild(document.createTextNode("Creation +1: "));
        bonus.appendChild(
          selectInput(
            state.creationBonusStat,
            AL.COMMON.stats,
            (v) => {
              state.creationBonusStat = v;
              scheduleSave();
              refresh();
            },
            "— none —"
          )
        );
        statsCard.appendChild(bonus);
        statsCard.addEventListener("click", (e) => {
          const btn = e.target.closest("button[data-act]");
          if (!btn) return;
          const stat = btn.dataset.stat;
          const cur = state.stats[stat] ?? 0;
          if (btn.dataset.act === "inc") state.stats[stat] = Math.min(3, cur + 1);
          if (btn.dataset.act === "dec") state.stats[stat] = Math.max(-2, cur - 1);
          scheduleSave();
          refresh();
        });

        // Balance
        const balCard = document.createElement("div");
        balCard.className = "subcard";
        balCard.innerHTML = "<h3>Balance</h3>";
        const track = document.createElement("div");
        track.className = "balance-track";
        track.innerHTML = `
          <div class="balance-labels">
            <span class="left">${escapeHtml(pb.principles.left)}</span>
            <span class="right">${escapeHtml(pb.principles.right)}</span>
          </div>
        `;
        const pips = document.createElement("div");
        pips.className = "balance-pips";
        for (let v = AL.COMMON.balanceMin; v <= AL.COMMON.balanceMax; v++) {
          const pip = document.createElement("button");
          pip.type = "button";
          pip.className = "balance-pip";
          if (v === state.balance) pip.classList.add("current");
          if (v === state.center) pip.classList.add("center-mark");
          pip.textContent = v === 0 ? "0" : v > 0 ? `+${v}` : String(v);
          pip.addEventListener("click", () => {
            state.balance = v;
            scheduleSave();
            refresh();
          });
          pips.appendChild(pip);
        }
        track.appendChild(pips);
        balCard.appendChild(track);
        const centerRow = document.createElement("div");
        centerRow.className = "center-controls";
        centerRow.appendChild(document.createTextNode("Center: "));
        centerRow.appendChild(
          selectInput(
            String(state.center),
            Array.from({ length: 7 }, (_, i) => {
              const v = i - 3;
              return { value: String(v), label: v === 0 ? "0" : v > 0 ? `+${v}` : String(v) };
            }),
            (v) => {
              state.center = Number(v);
              scheduleSave();
              refresh();
            },
            false
          )
        );
        balCard.appendChild(centerRow);

        grid.appendChild(statsCard);
        grid.appendChild(balCard);
        body.appendChild(grid);

        const lower = document.createElement("div");
        lower.className = "inner-grid-2";
        lower.style.marginTop = "1rem";

        // Conditions
        const cond = document.createElement("div");
        cond.className = "subcard";
        cond.innerHTML = "<h3>Conditions</h3>";
        AL.COMMON.conditions.forEach((c) => {
          const lab = document.createElement("label");
          lab.className = "chip condition";
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.checked = !!state.conditions[c.id];
          cb.addEventListener("change", () => {
            state.conditions[c.id] = cb.checked;
            scheduleSave();
          });
          lab.appendChild(cb);
          lab.appendChild(document.createTextNode(c.name));
          cond.appendChild(lab);
          const detail = document.createElement("div");
          detail.className = "condition-detail";
          detail.textContent = `${c.penalty} · Clear: ${c.clear}`;
          cond.appendChild(detail);
        });

        const right = document.createElement("div");
        right.style.display = "grid";
        right.style.gap = "0.75rem";

        const fat = document.createElement("div");
        fat.className = "subcard";
        fat.innerHTML = "<h3>Fatigue</h3>";
        const ftrack = document.createElement("div");
        ftrack.className = "track";
        for (let i = 1; i <= AL.COMMON.fatigueMax; i++) {
          const box = document.createElement("button");
          box.type = "button";
          box.className = "track-box" + (i <= state.fatigue ? " filled" : "");
          box.textContent = i <= state.fatigue ? "●" : "";
          box.addEventListener("click", () => {
            state.fatigue = state.fatigue === i ? i - 1 : i;
            scheduleSave();
            refresh();
          });
          ftrack.appendChild(box);
        }
        fat.appendChild(ftrack);

        const st = document.createElement("div");
        st.className = "subcard";
        st.innerHTML = "<h3>Statuses</h3>";
        const posH = document.createElement("div");
        posH.className = "hint";
        posH.textContent = "Positive";
        st.appendChild(posH);
        const posG = document.createElement("div");
        posG.className = "chip-group";
        AL.COMMON.statuses.positive.forEach((name) => posG.appendChild(statusChip(state, name, "status-pos")));
        st.appendChild(posG);
        const negH = document.createElement("div");
        negH.className = "hint";
        negH.style.marginTop = "0.5rem";
        negH.textContent = "Negative";
        st.appendChild(negH);
        const negG = document.createElement("div");
        negG.className = "chip-group";
        AL.COMMON.statuses.negative.forEach((name) => negG.appendChild(statusChip(state, name, "status-neg")));
        st.appendChild(negG);

        right.appendChild(fat);
        right.appendChild(st);
        lower.appendChild(cond);
        lower.appendChild(right);
        body.appendChild(lower);
      },
      {
        setExpanded: (v) => {
          state.ui.combatStatsExpanded = v;
        }
      }
    );
  }

  function statusChip(state, name, cls) {
    const lab = document.createElement("label");
    lab.className = "chip " + cls;
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!state.statuses[name];
    cb.addEventListener("change", () => {
      state.statuses[name] = cb.checked;
      scheduleSave();
    });
    lab.appendChild(cb);
    lab.appendChild(document.createTextNode(name));
    return lab;
  }

  /**
   * Drive tracker for playbooks like The Bold.
   * State: featureFields.drives = { [driveText]: "" | "marked" | "struck" }
   * At start, mark four; when fulfilled, set to struck.
   */
  function renderDrives(pb, state) {
    if (!state.featureFields.drives || typeof state.featureFields.drives !== "object") {
      state.featureFields.drives = {};
    }
    const box = document.createElement("div");
    box.className = "drives-box";
    const h = document.createElement("h3");
    h.style.cssText = "margin:0.5rem 0 0.35rem;font-size:0.82rem;color:var(--gold)";
    h.textContent = "Drives (mark 4 at start; strike when fulfilled)";
    box.appendChild(h);
    const markedCount = Object.values(state.featureFields.drives).filter((v) => v === "marked").length;
    const struckCount = Object.values(state.featureFields.drives).filter((v) => v === "struck").length;
    const meta = document.createElement("p");
    meta.className = "hint";
    meta.textContent = `Marked: ${markedCount} · Struck: ${struckCount}. Fulfilling a marked drive: strike it out and mark growth or clear a condition.`;
    box.appendChild(meta);
    pb.feature.drives.forEach((drive) => {
      const row = document.createElement("label");
      row.className = "drive-row";
      const sel = document.createElement("select");
      sel.className = "drive-status";
      [
        { v: "", l: "—" },
        { v: "marked", l: "Marked" },
        { v: "struck", l: "Struck" }
      ].forEach((o) => {
        const opt = document.createElement("option");
        opt.value = o.v;
        opt.textContent = o.l;
        sel.appendChild(opt);
      });
      sel.value = state.featureFields.drives[drive] || "";
      if (sel.value === "struck") row.classList.add("is-struck");
      if (sel.value === "marked") row.classList.add("is-marked");
      sel.addEventListener("change", () => {
        // Cap marked at 4 unless already marked (allow unmark)
        if (sel.value === "marked") {
          const current = Object.entries(state.featureFields.drives).filter(
            ([k, v]) => v === "marked" && k !== drive
          ).length;
          if (current >= 4) {
            alert("You already have four marked drives. Strike one out or unmark one first.");
            sel.value = state.featureFields.drives[drive] || "";
            return;
          }
        }
        state.featureFields.drives[drive] = sel.value;
        scheduleSave();
        refresh();
      });
      const span = document.createElement("span");
      span.textContent = drive;
      row.appendChild(sel);
      row.appendChild(span);
      box.appendChild(row);
    });
    return box;
  }

  function renderPlaybookSection(pb, state) {
    const expanded = state.ui.playbookExpanded !== false;
    const chosen = (state.selectedMoves || [])
      .map((id) => {
        if (!id) return null;
        if (String(id).startsWith("custom:")) {
          const idx = Number(String(id).split(":")[1]);
          return (state.customMoves[idx] && state.customMoves[idx].name) || "Custom";
        }
        const m = pb.moves.find((x) => x.id === id);
        return m ? m.name : null;
      })
      .filter(Boolean);
    const summary = chosen.length ? chosen.join(" · ") : `Choose ${pb.movesChoose || 2} moves`;

    return makeSection(
      "playbook",
      "Playbook feature & moves",
      expanded,
      summary,
      (body) => {
        const feat = document.createElement("div");
        feat.className = "feature-box";
        const fh = document.createElement("h3");
        fh.style.cssText = "margin:0 0 0.5rem;color:var(--gold)";
        fh.textContent = pb.feature.name || "Feature";
        feat.appendChild(fh);
        (pb.feature.fields || []).forEach((f) => {
          if (f.type === "textarea") {
            const ta = document.createElement("textarea");
            ta.value = state.featureFields[f.id] || "";
            ta.placeholder = f.placeholder || "";
            ta.style.minHeight = f.minHeight || "4.5rem";
            ta.addEventListener("input", () => {
              state.featureFields[f.id] = ta.value;
              scheduleSave();
            });
            feat.appendChild(field(f.label, ta));
          } else {
            feat.appendChild(
              field(
                f.label,
                textInput(state.featureFields[f.id] || "", (v) => {
                  state.featureFields[f.id] = v;
                  scheduleSave();
                }, f.placeholder)
              )
            );
          }
        });
        // Optional drive checklist (The Bold, etc.)
        if (pb.feature.drives && pb.feature.drives.length) {
          feat.appendChild(renderDrives(pb, state));
        }
        const ft = document.createElement("div");
        ft.className = "feature-text";
        (pb.feature.text || []).forEach((para) => {
          const p = document.createElement("p");
          p.textContent = para;
          ft.appendChild(p);
        });
        feat.appendChild(ft);
        body.appendChild(feat);

        body.appendChild(
          Object.assign(document.createElement("p"), {
            className: "hint",
            textContent: `Choose ${pb.movesChoose || 2} playbook moves. Use extra slots for growth or custom moves.`
          })
        );

        const picker = document.createElement("div");
        picker.className = "move-picker";
        const choose = pb.movesChoose || 2;
        for (let i = 0; i < choose; i++) picker.appendChild(moveSlot(pb, state, i));

        const extraTitle = document.createElement("h3");
        extraTitle.style.cssText =
          "margin:0.5rem 0;font-size:0.82rem;text-transform:uppercase;color:var(--sec-playbook)";
        extraTitle.textContent = "Additional / other-playbook moves";
        picker.appendChild(extraTitle);

        while (state.otherPlaybookMoves.length < 2) {
          state.otherPlaybookMoves.push({ name: "", text: "" });
        }
        state.otherPlaybookMoves.forEach((m, idx) => {
          const slot = document.createElement("div");
          slot.className = "move-slot";
          slot.appendChild(
            field(
              "Move name",
              textInput(m.name, (v) => {
                state.otherPlaybookMoves[idx].name = v;
                scheduleSave();
              })
            )
          );
          const ta = document.createElement("textarea");
          ta.placeholder = "Move text…";
          ta.value = m.text || "";
          ta.addEventListener("input", () => {
            state.otherPlaybookMoves[idx].text = ta.value;
            scheduleSave();
          });
          slot.appendChild(ta);
          picker.appendChild(slot);
        });

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "btn";
        addBtn.textContent = "+ Add move slot";
        addBtn.addEventListener("click", () => {
          state.otherPlaybookMoves.push({ name: "", text: "" });
          scheduleSave();
          refresh();
        });
        picker.appendChild(addBtn);
        body.appendChild(picker);

        const lib = document.createElement("div");
        lib.className = "move-library";
        const det = document.createElement("details");
        const sum = document.createElement("summary");
        sum.textContent = `Browse all ${pb.name} moves`;
        det.appendChild(sum);
        const libHint = document.createElement("p");
        libHint.className = "hint";
        libHint.style.margin = "0.4rem 0 0.25rem";
        libHint.textContent =
          "Use + Add to copy a move into Additional moves (full text, no retyping). Primary slots still use the dropdowns above.";
        det.appendChild(libHint);
        pb.moves.forEach((m) => {
          const item = document.createElement("div");
          item.className = "lib-item";
          const inUse = moveIsInUse(pb, state, m);
          if (inUse) item.classList.add("is-in-use");
          const head = document.createElement("div");
          head.className = "lib-item-head";
          const strong = document.createElement("strong");
          strong.textContent = m.name;
          const add = document.createElement("button");
          add.type = "button";
          add.className = "btn-add-move";
          if (inUse) {
            add.textContent = "In use";
            add.disabled = true;
            add.title = "Already selected or added";
          } else {
            add.textContent = "+ Add";
            add.title = "Add this move to your additional moves list";
            add.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (moveIsInUse(pb, state, m)) {
                setStatus(`“${m.name}” already in use`);
                return;
              }
              let placed = false;
              for (let i = 0; i < state.otherPlaybookMoves.length; i++) {
                const slot = state.otherPlaybookMoves[i];
                if (!slot.name && !slot.text) {
                  state.otherPlaybookMoves[i] = { name: m.name, text: m.text };
                  placed = true;
                  break;
                }
              }
              if (!placed) state.otherPlaybookMoves.push({ name: m.name, text: m.text });
              scheduleSave();
              refresh();
              setStatus(`Added “${m.name}” to additional moves`);
            });
          }
          head.appendChild(strong);
          head.appendChild(add);
          item.appendChild(head);
          const txt = document.createElement("div");
          txt.textContent = m.text;
          item.appendChild(txt);
          det.appendChild(item);
        });
        lib.appendChild(det);
        body.appendChild(lib);
      },
      {
        setExpanded: (v) => {
          state.ui.playbookExpanded = v;
        }
      }
    );
  }

  function moveSlot(pb, state, index) {
    const slot = document.createElement("div");
    slot.className = "move-slot";
    const selected = state.selectedMoves[index] || "";
    const isCustom = typeof selected === "string" && selected.startsWith("custom:");
    const takenElsewhere = new Set(
      (state.selectedMoves || []).filter((id, i) => i !== index && id && !String(id).startsWith("custom:"))
    );
    const options = [
      ...pb.moves.map((m) => ({
        value: m.id,
        label: takenElsewhere.has(m.id) ? `${m.name} (already chosen)` : m.name,
        disabled: takenElsewhere.has(m.id)
      })),
      { value: "__custom__", label: "Custom move…" }
    ];
    const selVal = isCustom ? "__custom__" : selected;
    const sel = selectInput(
      selVal,
      options,
      (v) => {
        if (v === "__custom__") {
          state.selectedMoves[index] = "custom:" + index;
          if (!state.customMoves[index]) state.customMoves[index] = { name: "", text: "" };
        } else {
          state.selectedMoves[index] = v;
        }
        scheduleSave();
        refresh();
      },
      `Move slot ${index + 1}`
    );
    slot.appendChild(sel);

    if (isCustom) {
      if (!state.customMoves[index]) state.customMoves[index] = { name: "", text: "" };
      const cm = state.customMoves[index];
      slot.appendChild(
        textInput(
          cm.name,
          (v) => {
            state.customMoves[index].name = v;
            scheduleSave();
          },
          "Custom move name"
        )
      );
      const ta = document.createElement("textarea");
      ta.value = cm.text || "";
      ta.placeholder = "Custom move text…";
      ta.addEventListener("input", () => {
        state.customMoves[index].text = ta.value;
        scheduleSave();
      });
      slot.appendChild(ta);
    } else if (selected) {
      const move = pb.moves.find((m) => m.id === selected);
      if (move) {
        const txt = document.createElement("div");
        txt.className = "move-text";
        txt.textContent = move.text;
        slot.appendChild(txt);
      }
    }
    return slot;
  }

  function renderTechniquesSection(pb, state, cat) {
    const expanded = state.ui.techniquesExpanded !== false;
    const named = state.techniques.filter((t) => t.name || t.sourceId).map((t) => t.name || "Technique");
    const summary = named.length ? named.slice(0, 4).join(" · ") + (named.length > 4 ? "…" : "") : "No techniques selected";

    return makeSection(
      "techniques",
      "Fighting techniques",
      expanded,
      summary,
      (body) => {
        body.appendChild(
          Object.assign(document.createElement("p"), {
            className: "hint",
            textContent:
              "Starts with your playbook technique only — use + Add technique slot as you learn more. Pick basics, your starter, or custom advanced techniques from the core book."
          })
        );
        state.techniques.forEach((tech, idx) => {
          body.appendChild(techniqueSlot(state, cat, tech, idx));
        });
        const add = document.createElement("button");
        add.type = "button";
        add.className = "btn";
        add.textContent = "+ Add technique slot";
        add.addEventListener("click", () => {
          state.techniques.push(emptyTech());
          scheduleSave();
          refresh();
        });
        body.appendChild(add);
      },
      {
        setExpanded: (v) => {
          state.ui.techniquesExpanded = v;
        }
      }
    );
  }

  function techniqueSlot(state, cat, tech, idx) {
    const slot = document.createElement("div");
    slot.className = "tech-slot";
    const top = document.createElement("div");
    top.className = "tech-top";

    const sel = document.createElement("select");
    const groups = {};
    cat.forEach((t) => {
      groups[t.group] = groups[t.group] || [];
      groups[t.group].push(t);
    });
    const o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = "— empty slot —";
    sel.appendChild(o0);
    Object.keys(groups).forEach((g) => {
      const og = document.createElement("optgroup");
      og.label = g;
      groups[g].forEach((t) => {
        const o = document.createElement("option");
        o.value = t.id;
        o.textContent = t.name;
        og.appendChild(o);
      });
      sel.appendChild(og);
    });

    let selVal = tech.sourceId || "";
    if (tech.custom || tech.sourceId === "__custom__") selVal = "__custom__";
    if (!cat.some((c) => c.id === selVal) && selVal && selVal !== "__custom__") {
      /* keep empty if unknown */
    }
    sel.value = cat.some((c) => c.id === selVal) ? selVal : tech.sourceId === "__custom__" || tech.custom ? "__custom__" : "";

    sel.addEventListener("change", () => {
      const id = sel.value;
      if (!id) state.techniques[idx] = emptyTech();
      else if (id === "__custom__") {
        state.techniques[idx] = {
          sourceId: "__custom__",
          name: tech.name || "",
          approach: tech.approach || "defend",
          text: tech.text || "",
          mastery: normalizeMastery(tech) || "learned",
          custom: true
        };
      } else {
        const src = cat.find((c) => c.id === id);
        state.techniques[idx] = {
          sourceId: src.id,
          name: src.name,
          approach: src.approach,
          text: src.text,
          mastery: "learned",
          custom: false
        };
      }
      scheduleSave();
      refresh();
    });

    const approachSel = selectInput(
      tech.approach || "defend",
      AL.COMMON.approaches.map((a) => ({ value: a.id, label: a.name })),
      (v) => {
        state.techniques[idx].approach = v;
        scheduleSave();
      },
      false
    );

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "btn";
    clear.style.background = "var(--danger)";
    clear.textContent = "Clear";
    clear.addEventListener("click", () => {
      state.techniques[idx] = emptyTech();
      scheduleSave();
      refresh();
    });

    top.appendChild(field("Technique", sel));
    top.appendChild(field("Approach", approachSel));
    top.appendChild(clear);
    slot.appendChild(top);

    if (tech.sourceId === "__custom__" || tech.custom) {
      slot.appendChild(
        field(
          "Custom name",
          textInput(tech.name, (v) => {
            state.techniques[idx].name = v;
            scheduleSave();
          })
        )
      );
      const ta = document.createElement("textarea");
      ta.placeholder = "Describe the technique…";
      ta.value = tech.text || "";
      ta.addEventListener("input", () => {
        state.techniques[idx].text = ta.value;
        scheduleSave();
      });
      slot.appendChild(ta);
    } else if (tech.text) {
      const txt = document.createElement("div");
      txt.className = "tech-text";
      txt.textContent = tech.text;
      slot.appendChild(txt);
    }

    if (tech.sourceId || tech.name) {
      const row = document.createElement("div");
      row.className = "mastery-row";
      const lab = document.createElement("label");
      lab.textContent = "Progress";
      lab.htmlFor = `mastery-${idx}`;
      const sel = selectInput(
        normalizeMastery(tech) || "",
        [
          { value: "", label: "None" },
          { value: "learned", label: "Learned" },
          { value: "practiced", label: "Practiced" },
          { value: "mastered", label: "Mastered" }
        ],
        (v) => {
          state.techniques[idx].mastery = v;
          scheduleSave();
        },
        false
      );
      sel.id = `mastery-${idx}`;
      row.appendChild(lab);
      row.appendChild(sel);
      slot.appendChild(row);
    }
    return slot;
  }

  function renderGrowthSection(pb, state) {
    const expanded = !!state.ui.growthExpanded;
    const headExtra = document.createElement("div");
    headExtra.className = "growth-inline-track";
    headExtra.title = "Growth track — click boxes even when collapsed";
    for (let i = 1; i <= AL.COMMON.growthMax; i++) {
      const box = document.createElement("button");
      box.type = "button";
      box.className = "track-box growth growth-inline" + (i <= state.growth ? " filled" : "");
      box.addEventListener("click", (e) => {
        e.stopPropagation();
        state.growth = state.growth === i ? i - 1 : i;
        scheduleSave();
        refresh();
      });
      headExtra.appendChild(box);
    }

    return makeSection(
      "growth",
      "Growth & moment of balance",
      expanded,
      expanded ? "" : "Expand for questions & advancements",
      (body) => {
        const gq = document.createElement("p");
        gq.innerHTML = `<strong>Playbook growth question:</strong> ${escapeHtml(pb.growthQuestion)}`;
        body.appendChild(gq);
        const shared = document.createElement("div");
        shared.className = "hint";
        shared.innerHTML =
          "<strong>Shared questions:</strong><br>" +
          AL.COMMON.growthQuestionsShared.map((q) => "• " + escapeHtml(q)).join("<br>");
        body.appendChild(shared);

        const trackLabel = document.createElement("h3");
        trackLabel.style.cssText =
          "margin:0.75rem 0 0.4rem;font-size:0.82rem;text-transform:uppercase;color:var(--sec-growth)";
        trackLabel.textContent = "Growth track";
        body.appendChild(trackLabel);
        const track = document.createElement("div");
        track.className = "track";
        for (let i = 1; i <= AL.COMMON.growthMax; i++) {
          const box = document.createElement("button");
          box.type = "button";
          box.className = "track-box growth" + (i <= state.growth ? " filled" : "");
          box.addEventListener("click", () => {
            state.growth = state.growth === i ? i - 1 : i;
            scheduleSave();
            refresh();
          });
          track.appendChild(box);
        }
        body.appendChild(track);

        const advTitle = document.createElement("h3");
        advTitle.style.cssText =
          "margin:0.85rem 0 0.4rem;font-size:0.82rem;text-transform:uppercase;color:var(--sec-growth)";
        advTitle.textContent = "Growth advancements";
        body.appendChild(advTitle);

        AL.COMMON.growthAdvancements.forEach((a) => {
          const row = document.createElement("div");
          row.className = "advancement";
          row.appendChild(document.createTextNode(a.name + " "));
          const mini = document.createElement("div");
          mini.className = "mini-track";
          const slots = state.advancements[a.id] || Array(a.slots).fill(false);
          for (let i = 0; i < a.slots; i++) {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "mini-box" + (slots[i] ? " filled" : "");
            b.addEventListener("click", () => {
              if (!state.advancements[a.id]) state.advancements[a.id] = Array(a.slots).fill(false);
              state.advancements[a.id][i] = !state.advancements[a.id][i];
              if (a.id === "moment") {
                state.momentUnlocked = state.advancements.moment.some(Boolean);
              }
              scheduleSave();
              refresh();
            });
            mini.appendChild(b);
          }
          row.appendChild(mini);
          body.appendChild(row);
        });

        const unlocked =
          state.momentUnlocked ||
          (state.advancements.moment && state.advancements.moment.some(Boolean));
        const moment = document.createElement("div");
        moment.className = "moment" + (unlocked ? "" : " locked");
        if (!unlocked) {
          moment.appendChild(
            Object.assign(document.createElement("div"), {
              className: "lock-note",
              textContent: "Locked — unlock via growth advancement"
            })
          );
        }
        const mh = document.createElement("strong");
        mh.textContent = "Moment of Balance";
        moment.appendChild(mh);
        const mp = document.createElement("p");
        mp.textContent = pb.momentOfBalance;
        moment.appendChild(mp);
        body.appendChild(moment);
      },
      {
        setExpanded: (v) => {
          state.ui.growthExpanded = v;
        },
        headExtra
      }
    );
  }

  /**
   * Session notes section: optional campaign banner + per-session log entries.
   * Default banner: data/campaign.js. Players may hide it or upload their own
   * (stored on the character as state.campaign).
   */
  function renderSessionsSection(state) {
    if (!state.campaign) state.campaign = defaultCampaignBrand();
    const expanded = state.ui.sessionsExpanded !== false;
    const n = (state.sessions || []).length;
    const resolved = resolveCampaignBrand(state);
    const summaryEl = document.createElement("div");
    const sumLine = document.createElement("span");
    sumLine.className = "sum-line";
    const modeNote =
      resolved.mode === "hidden" ? " · no banner" : resolved.mode === "custom" ? " · custom banner" : "";
    sumLine.textContent = `${resolved.name} · ${n === 1 ? "1 session" : n + " sessions"}${modeNote}`;
    summaryEl.appendChild(sumLine);

    return makeSection(
      "sessions",
      "Session notes",
      expanded,
      summaryEl,
      (body) => {
        body.appendChild(renderCampaignBannerControls(state, resolved));

        body.appendChild(
          Object.assign(document.createElement("p"), {
            className: "hint",
            textContent:
              "Play date + short label (in-world time/place). Optional image per session (cutscene / mood). Collapse hides the body; date and label stay visible. Saved in the same character JSON."
          })
        );

        (state.sessions || []).forEach((session, idx) => {
          body.appendChild(renderSessionNote(state, session, idx));
        });

        const add = document.createElement("button");
        add.type = "button";
        add.className = "btn";
        add.textContent = "+ Add session note";
        add.addEventListener("click", () => {
          state.sessions.push(emptySession());
          scheduleSave();
          refresh();
        });
        body.appendChild(add);
      },
      {
        setExpanded: (v) => {
          state.ui.sessionsExpanded = v;
        }
      }
    );
  }

  /** Banner preview + mode/name controls (default package art, custom upload, or hidden) */
  function renderCampaignBannerControls(state, resolved) {
    const wrap = document.createElement("div");
    wrap.className = "campaign-brand-block";

    // Preview
    if (resolved.visible && resolved.imageSrc) {
      const banner = document.createElement("div");
      banner.className = "campaign-banner";
      const img = document.createElement("img");
      img.src = resolved.imageSrc;
      img.alt = resolved.name || "Campaign banner";
      img.loading = "lazy";
      banner.appendChild(img);
      if (resolved.tagline) {
        const cap = document.createElement("div");
        cap.className = "campaign-banner-caption";
        cap.textContent = resolved.tagline;
        banner.appendChild(cap);
      }
      wrap.appendChild(banner);
    } else if (resolved.mode === "hidden") {
      const empty = document.createElement("div");
      empty.className = "campaign-banner-empty";
      empty.textContent = "Campaign banner hidden";
      wrap.appendChild(empty);
    } else if (resolved.mode === "custom" && !resolved.imageSrc) {
      const empty = document.createElement("div");
      empty.className = "campaign-banner-empty";
      empty.textContent = "Custom banner: upload an image below";
      wrap.appendChild(empty);
    }

    // Mode radios
    const modeRow = document.createElement("div");
    modeRow.className = "campaign-mode-row";
    const modes = [
      { id: "default", label: "Package default" },
      { id: "custom", label: "My image" },
      { id: "hidden", label: "No banner" }
    ];
    modes.forEach((m) => {
      const lab = document.createElement("label");
      lab.className = "campaign-mode-chip" + (resolved.mode === m.id ? " is-active" : "");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "campaign-banner-mode";
      radio.value = m.id;
      radio.checked = resolved.mode === m.id;
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        state.campaign.mode = m.id;
        scheduleSave();
        refresh();
      });
      lab.appendChild(radio);
      lab.appendChild(document.createTextNode(m.label));
      modeRow.appendChild(lab);
    });
    wrap.appendChild(modeRow);

    // Name / tagline (always editable; empty = fall back to package defaults when mode is default)
    const fields = document.createElement("div");
    fields.className = "row-fields campaign-brand-fields";
    fields.appendChild(
      field(
        "Campaign name",
        textInput(
          state.campaign.name || "",
          (v) => {
            state.campaign.name = v;
            scheduleSave();
          },
          packageCampaign().name || "Campaign name"
        )
      )
    );
    fields.appendChild(
      field(
        "Banner caption",
        textInput(
          state.campaign.tagline || "",
          (v) => {
            state.campaign.tagline = v;
            scheduleSave();
          },
          packageCampaign().tagline || "Optional caption"
        )
      )
    );
    wrap.appendChild(fields);

    // Custom image actions
    if (resolved.mode === "custom") {
      const actions = document.createElement("div");
      actions.className = "campaign-banner-actions";
      const file = document.createElement("input");
      file.type = "file";
      file.accept = "image/*";
      file.hidden = true;
      file.addEventListener("change", () => {
        readImageFile(file.files && file.files[0], (dataUrl) => {
          state.campaign.bannerDataUrl = dataUrl;
          state.campaign.mode = "custom";
          scheduleSave();
          refresh();
        });
      });
      const upload = document.createElement("button");
      upload.type = "button";
      upload.className = "btn";
      upload.textContent = state.campaign.bannerDataUrl ? "Change banner image" : "Upload banner image";
      upload.addEventListener("click", () => file.click());
      actions.appendChild(upload);
      if (state.campaign.bannerDataUrl) {
        const clear = document.createElement("button");
        clear.type = "button";
        clear.className = "btn";
        clear.style.background = "var(--danger)";
        clear.textContent = "Clear custom image";
        clear.addEventListener("click", () => {
          if (!confirm("Remove your custom campaign banner image?")) return;
          state.campaign.bannerDataUrl = "";
          scheduleSave();
          refresh();
        });
        actions.appendChild(clear);
      }
      actions.appendChild(file);
      wrap.appendChild(actions);
      wrap.appendChild(
        Object.assign(document.createElement("p"), {
          className: "hint",
          textContent:
            "Custom banners are stored in this character’s JSON (keep under ~2.5 MB). Other tables can hide the Iron and Ash default with “No banner”."
        })
      );
    } else if (resolved.mode === "default") {
      wrap.appendChild(
        Object.assign(document.createElement("p"), {
          className: "hint",
          textContent:
            "Using the package default banner (editable in data/campaign.js for redistributors). Choose “My image” or “No banner” to customize for your table."
        })
      );
    }

    return wrap;
  }

  /** One session card: collapsible head + optional left image + fields */
  function renderSessionNote(state, session, idx) {
    const wrap = document.createElement("div");
    wrap.className = "session-note" + (session.collapsed ? " is-collapsed" : "");

    const head = document.createElement("div");
    head.className = "session-note-head";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "session-toggle";
    toggle.textContent = session.collapsed ? "▸" : "▾";
    toggle.title = session.collapsed ? "Expand notes" : "Collapse notes";
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      state.sessions[idx].collapsed = !state.sessions[idx].collapsed;
      scheduleSave();
      refresh();
    });

    // Tiny thumbnail in the head when an image exists (collapsed or expanded)
    if (session.imageDataUrl) {
      const thumb = document.createElement("img");
      thumb.className = "session-head-thumb";
      thumb.src = session.imageDataUrl;
      thumb.alt = "";
      thumb.title = "Session image";
      head.appendChild(thumb);
    }

    const meta = document.createElement("div");
    meta.className = "session-note-meta";
    const dateSpan = document.createElement("span");
    dateSpan.className = "play-date";
    dateSpan.textContent = session.playDate || "—";
    const titleSpan = document.createElement("span");
    titleSpan.className = "session-title";
    titleSpan.textContent = session.title || "(no label)";
    meta.appendChild(dateSpan);
    meta.appendChild(titleSpan);

    head.addEventListener("click", (e) => {
      if (e.target.closest(".remove-btn, input, textarea, button, label")) return;
      if (e.target === toggle) return;
      state.sessions[idx].collapsed = !state.sessions[idx].collapsed;
      scheduleSave();
      refresh();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.textContent = "Remove";
    remove.addEventListener("click", (e) => {
      e.stopPropagation();
      const label = [session.playDate, session.title].filter(Boolean).join(" — ") || "this session";
      if (
        !confirm(
          `Remove session note “${label}”? This cannot be undone (unless you have a JSON backup).`
        )
      ) {
        return;
      }
      state.sessions.splice(idx, 1);
      if (!state.sessions.length) state.sessions.push(emptySession());
      scheduleSave();
      refresh();
    });

    head.appendChild(toggle);
    head.appendChild(meta);
    head.appendChild(remove);
    wrap.appendChild(head);

    // --- Expanded body -----------------------------------------------------
    const body = document.createElement("div");
    body.className = "session-note-body";

    const main = document.createElement("div");
    main.className = "session-body-main";

    // Left: session image (or add control when empty — only while expanded)
    const media = document.createElement("div");
    media.className = "session-media";
    if (session.imageDataUrl) {
      const img = document.createElement("img");
      img.className = "session-image";
      img.src = session.imageDataUrl;
      img.alt = "Session art";
      media.appendChild(img);
      const mediaActions = document.createElement("div");
      mediaActions.className = "session-media-actions";
      const change = document.createElement("button");
      change.type = "button";
      change.className = "btn-session-img";
      change.textContent = "Change image";
      const file = document.createElement("input");
      file.type = "file";
      file.accept = "image/*";
      file.hidden = true;
      file.addEventListener("change", () => {
        readImageFile(file.files && file.files[0], (dataUrl) => {
          state.sessions[idx].imageDataUrl = dataUrl;
          scheduleSave();
          refresh();
        });
      });
      change.addEventListener("click", () => file.click());
      const clear = document.createElement("button");
      clear.type = "button";
      clear.className = "btn-session-img danger";
      clear.textContent = "Remove image";
      clear.addEventListener("click", () => {
        if (!confirm("Remove this session image?")) return;
        state.sessions[idx].imageDataUrl = "";
        scheduleSave();
        refresh();
      });
      mediaActions.appendChild(change);
      mediaActions.appendChild(clear);
      mediaActions.appendChild(file);
      media.appendChild(mediaActions);
    } else {
      // No image: only show add when expanded (this body is hidden when collapsed)
      const file = document.createElement("input");
      file.type = "file";
      file.accept = "image/*";
      file.hidden = true;
      file.addEventListener("change", () => {
        readImageFile(file.files && file.files[0], (dataUrl) => {
          state.sessions[idx].imageDataUrl = dataUrl;
          scheduleSave();
          refresh();
        });
      });
      const addImg = document.createElement("button");
      addImg.type = "button";
      addImg.className = "btn-session-img add";
      addImg.textContent = "+ Add image";
      addImg.title = "Cutscene, map, or mood art for this session";
      addImg.addEventListener("click", () => file.click());
      media.appendChild(addImg);
      media.appendChild(file);
    }
    main.appendChild(media);

    // Right: date, label, notes
    const fields = document.createElement("div");
    fields.className = "session-fields";

    const row = document.createElement("div");
    row.className = "row-fields";
    const dateIn = document.createElement("input");
    dateIn.type = "date";
    dateIn.value = session.playDate || "";
    dateIn.addEventListener("change", () => {
      state.sessions[idx].playDate = dateIn.value;
      scheduleSave();
      refresh();
    });
    row.appendChild(field("Play date", dateIn));

    const titleWrap = document.createElement("div");
    const titleIn = textInput(
      session.title,
      (v) => {
        const clipped = v.slice(0, SESSION_TITLE_MAX);
        state.sessions[idx].title = clipped;
        scheduleSave();
        const t = wrap.querySelector(".session-title");
        if (t) t.textContent = clipped || "(no label)";
        const ccel = titleWrap.querySelector(".char-count");
        if (ccel) ccel.textContent = `${clipped.length}/${SESSION_TITLE_MAX}`;
      },
      "In-world time / place (e.g. Spring of 96 — Pohuai)",
      { maxLength: SESSION_TITLE_MAX }
    );
    titleWrap.appendChild(field("Label / in-world date", titleIn));
    const cc = document.createElement("div");
    cc.className = "char-count";
    cc.textContent = `${(session.title || "").length}/${SESSION_TITLE_MAX}`;
    titleWrap.appendChild(cc);
    row.appendChild(titleWrap);
    fields.appendChild(row);

    const ta = document.createElement("textarea");
    ta.placeholder = "What happened this session…";
    ta.style.minHeight = "5.5rem";
    ta.value = session.notes || "";
    ta.addEventListener("input", () => {
      state.sessions[idx].notes = ta.value;
      scheduleSave();
    });
    fields.appendChild(field("Notes", ta));
    main.appendChild(fields);

    body.appendChild(main);
    wrap.appendChild(body);
    return wrap;
  }

  /** Read a small image into a data URL for embedding in character JSON */
  function readImageFile(file, onDone) {
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      alert("Please use an image under ~2.5 MB so the character JSON stays shareable by email.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onDone(reader.result);
    reader.readAsDataURL(file);
  }

  // ---------- File I/O ----------

  function exportJson() {
    const payload = {
      _meta: {
        app: "avatar-legends-charsheet",
        version: 2,
        playbookId: currentPb.id,
        playbookName: currentPb.name,
        exportedAt: new Date().toISOString()
      },
      character: currentState
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const base = (currentState.name || currentPb.id).replace(/[^\w\-]+/g, "_") || "character";
    a.download = `${base}_sheet.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus("Downloaded JSON");
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        let charData = data;
        if (data && data.character) charData = data.character;
        if (data && data._meta && data._meta.playbookId && data._meta.playbookId !== currentPb.id) {
          const ok = confirm(
            `This file is for playbook “${data._meta.playbookName || data._meta.playbookId}”, but this page is ${currentPb.name}. Load anyway?`
          );
          if (!ok) return;
        }
        currentState = migrateState(currentPb, charData);
        saveState(currentPb, currentState);
        refresh();
        setStatus("Loaded JSON");
      } catch (e) {
        setStatus("Load failed");
        alert("Could not load that file: " + e.message);
      }
    };
    reader.readAsText(file);
  }

  function resetSheet() {
    if (!confirm("Reset this character sheet? Clears the browser copy for this playbook.")) return;
    currentState = defaultState(currentPb);
    saveState(currentPb, currentState);
    refresh();
    setStatus("Reset");
  }

  function setupToolbarScroll() {
    const bar = $("#toolbar");
    if (!bar) return;
    const onScroll = () => {
      if (suppressScrollCompact) return;
      if (window.scrollY > 12) bar.classList.add("is-compact");
      else bar.classList.remove("is-compact");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function init(playbookId) {
    currentPb = AL.PLAYBOOKS[playbookId];
    if (!currentPb) {
      document.body.innerHTML = `<p style="padding:2rem">Unknown playbook: ${escapeHtml(playbookId)}</p>`;
      return;
    }
    catalog = techniqueCatalog(currentPb);
    currentState = loadState(currentPb);
    rootEl = $("#sheet-root");
    if (!rootEl) {
      rootEl = document.createElement("div");
      rootEl.id = "sheet-root";
      rootEl.className = "sheet";
      document.body.appendChild(rootEl);
    }

    const btnExport = $("#btn-export");
    const btnImport = $("#btn-import");
    const btnPrint = $("#btn-print");
    const btnReset = $("#btn-reset");
    const fileImport = $("#file-import");

    if (btnExport) btnExport.addEventListener("click", exportJson);
    if (btnImport && fileImport) {
      btnImport.addEventListener("click", () => fileImport.click());
      fileImport.addEventListener("change", () => {
        if (fileImport.files[0]) importJson(fileImport.files[0]);
        fileImport.value = "";
      });
    }
    if (btnPrint) btnPrint.addEventListener("click", () => window.print());
    if (btnReset) btnReset.addEventListener("click", resetSheet);

    setupToolbarScroll();
    refresh();
    setStatus("Ready");
  }

  AL.Sheet = { init, loadState, saveState, defaultState };

  document.addEventListener("DOMContentLoaded", () => {
    const id =
      document.body.dataset.playbook ||
      new URLSearchParams(location.search).get("playbook") ||
      "adamant";
    init(id);
  });
})();
