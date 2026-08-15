/**
 * generate.js — Constrained character randomizer (locks + weights, no AI).
 *
 * Depends on: common.js, all playbooks, generator.js, sheet.js (defaultState).
 * Storage: localStorage list of unresolved generated characters.
 */
(function () {
  "use strict";

  const STORE_KEY = "avatar-legends-generated";
  const STAGING_KEY = "avatar-legends-generated-staging";
  const DEFER_KEY = "avatar-legends-generated-defer";

  const PLAYBOOK_ORDER = [
    "adamant",
    "bold",
    "guardian",
    "hammer",
    "icon",
    "idealist",
    "pillar",
    "prodigy",
    "rogue",
    "successor",
    "destined",
    "elder",
    "foundling",
    "razor",
    "architect",
    "authority",
    "bound",
    "broken"
  ];

  const locks = {
    role: "pc",
    era: "",
    culture: "",
    training: "",
    playbook: "",
    fatigueMax: 5,
    fillOthers: false
  };

  let workingId = null;
  let currentItem = null;
  let leftoverOpen = false;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function G() {
    return AL.GENERATOR;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pickOne(list) {
    if (!list || !list.length) return "";
    return list[Math.floor(Math.random() * list.length)];
  }

  function pickN(list, n) {
    const copy = (list || []).slice();
    const out = [];
    while (out.length < n && copy.length) {
      const i = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(i, 1)[0]);
    }
    return out;
  }

  function pickWeighted(entries) {
    const usable = (entries || []).filter((e) => e && e.weight > 0);
    if (!usable.length) return "";
    const total = usable.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * total;
    for (let i = 0; i < usable.length; i++) {
      r -= usable[i].weight;
      if (r <= 0) return usable[i].value;
    }
    return usable[usable.length - 1].value;
  }

  function eraById(id) {
    return G().eras.find((e) => e.id === id) || null;
  }

  function cultureById(id) {
    return G().cultures.find((c) => c.id === id) || null;
  }

  function playbookById(id) {
    return (AL.PLAYBOOKS && AL.PLAYBOOKS[id]) || null;
  }

  function namesForCulture(cultureId) {
    const names = G().names;
    if (cultureId === "united-republic" || cultureId === "fire-colonies") {
      return []
        .concat(names["earth-kingdom"] || [])
        .concat(names["fire-nation"] || [])
        .concat(names["northern-water"] || [])
        .concat(names["air-nomads"] || []);
    }
    if (cultureId === "foggy-swamp") {
      return [].concat(names["foggy-swamp"] || []).concat(names["earth-kingdom"] || []);
    }
    return (names[cultureId] || names["earth-kingdom"] || []).slice();
  }

  function threeNames(cultureId) {
    let pool = namesForCulture(cultureId);
    if (pool.length < 3) {
      pool = pool.concat(namesForCulture("earth-kingdom"));
    }
    const uniq = [];
    const seen = {};
    pool.forEach((n) => {
      if (!seen[n]) {
        seen[n] = true;
        uniq.push(n);
      }
    });
    return pickN(uniq, 3);
  }

  function culturesForEra(eraId) {
    const map = (G().eraCultures[eraId] || {});
    return G().cultures.filter((c) => map[c.id] != null);
  }

  function pickCulture(eraId, trainingLock) {
    const weights = Object.assign({}, G().eraCultures[eraId] || {});
    if (trainingLock && G().trainingCultureBoost[trainingLock]) {
      const boost = G().trainingCultureBoost[trainingLock];
      Object.keys(boost).forEach((cid) => {
        if (weights[cid] != null) weights[cid] *= boost[cid];
      });
    }
    if (trainingLock === "Technology" && G().earlyTechCultureBoost[eraId]) {
      const extra = G().earlyTechCultureBoost[eraId];
      Object.keys(extra).forEach((cid) => {
        if (weights[cid] != null) weights[cid] *= extra[cid];
      });
    }
    const entries = Object.keys(weights).map((id) => ({ value: id, weight: weights[id] }));
    return pickWeighted(entries) || "earth-kingdom";
  }

  function pickTraining(eraId, cultureId) {
    const base = Object.assign({}, G().cultureTrainings[cultureId] || {});
    const allowed = AL.COMMON.trainings.filter((t) => t !== "Other / Custom");
    allowed.forEach((t) => {
      if (base[t] == null) base[t] = 0.08;
    });
    const mult = G().eraTrainingMult[eraId] || {};
    const entries = allowed.map((t) => ({
      value: t,
      weight: (base[t] || 0.08) * (mult[t] != null ? mult[t] : 1)
    }));
    return pickWeighted(entries) || "Weapons";
  }

  function pickPlaybook(training) {
    const boost = (G().trainingPlaybooks[training] || {});
    const entries = PLAYBOOK_ORDER.filter((id) => playbookById(id)).map((id) => ({
      value: id,
      weight: boost[id] || 1
    }));
    return pickWeighted(entries) || "adamant";
  }

  function pickBackground(playbookId) {
    const all = AL.COMMON.backgrounds.slice();
    const weights = {
      guardian: { Military: 1.6, Wilderness: 1.2, Urban: 1 },
      pillar: { Military: 2, Privileged: 1.2 },
      bound: { Military: 1.6, Monastic: 1.4, Privileged: 1.1 },
      icon: { Monastic: 1.8, Privileged: 1.3 },
      rogue: { Outlaw: 2, Urban: 1.4, Wilderness: 1.1 },
      successor: { Privileged: 2.2, Urban: 1.2 },
      authority: { Privileged: 1.6, Urban: 1.5 },
      architect: { Urban: 1.5, Privileged: 1.2 },
      elder: { Monastic: 1.4, Privileged: 1.2, Wilderness: 1.1 },
      razor: { Military: 1.5, Outlaw: 1.3 },
      hammer: { Military: 1.3, Outlaw: 1.2, Urban: 1.1 },
      prodigy: { Monastic: 1.4, Privileged: 1.3 },
      foundling: { Urban: 1.2, Wilderness: 1.2, Privileged: 1.1 }
    };
    const w = weights[playbookId] || {};
    return pickWeighted(all.map((b) => ({ value: b, weight: w[b] || 1 }))) || pickOne(all);
  }

  function secondHeritage(eraId, cultureId, training) {
    let culture = pickCulture(eraId, "");
    let guard = 0;
    while (culture === cultureId && guard < 8) {
      culture = pickCulture(eraId, "");
      guard++;
    }
    if (culture === cultureId) {
      const others = culturesForEra(eraId).map((c) => c.id).filter((id) => id !== cultureId);
      culture = pickOne(others) || cultureId;
    }
    let train = pickTraining(eraId, culture);
    guard = 0;
    while (train === training && guard < 8) {
      train = pickTraining(eraId, culture);
      guard++;
    }
    if (train === training) {
      train = pickOne(AL.COMMON.trainings.filter((t) => t !== training && t !== "Other / Custom")) || training;
    }
    return { culture, training: train, background: pickBackground("foundling") };
  }

  function rareHook(eraId, training, cultureId) {
    if (eraId === "hundred-year-war" && training === "Airbending") {
      return "Airbending is nearly gone in this era — you survived in secret.";
    }
    if (eraId === "hundred-year-war" && cultureId === "air-nomads") {
      return "Air Nomad communities are scattered or hidden in this era.";
    }
    if ((eraId === "kyoshi" || eraId === "roku") && training === "Technology") {
      return "Machines are rare tools here, not a nation’s everyday craft.";
    }
    return "";
  }

  function statHook(playbookId, stat) {
    const table = G().statHooks;
    const specific = table[playbookId] && table[playbookId][stat];
    if (specific) return specific;
    return (table._default && table._default[stat]) || "";
  }

  function personName(cultureId) {
    return pickOne(namesForCulture(cultureId)) || "—";
  }

  function fillClosedFields(pb, state, cultureId, fillOthers) {
    const L = G().closedLists;
    const ff = state.featureFields;
    const id = pb.id;

    if (id === "bold" && pb.feature.drives) {
      ff.drives = {};
      pickN(pb.feature.drives, 4).forEach((d) => {
        ff.drives[d] = "marked";
      });
    }
    if (id === "hammer") {
      ff.adversary_goal = pickOne(L.hammerGoals);
    }
    if (id === "rogue") {
      ff.bad_habits = pickN(L.rogueHabits, 4).join("; ");
    }
    if (id === "idealist") {
      ff.ideals = pickN(L.idealistIdeals, 3).join("; ");
    }
    if (id === "icon") {
      ff.tradition = L.iconTraditions[cultureId] || "a local tradition";
      ff.responsibilities = pickN(L.iconResponsibilities, 3).join("; ");
      ff.prohibitions = pickN(L.iconProhibitions, 3).join("; ");
    }
    if (id === "prodigy") {
      ff.mastery_areas = pickN(L.prodigyAreas, 2).join(", ");
    }
    if (id === "destined") {
      ff.my_destiny = pickOne(L.destined);
      ff.destiny_details = pickOne(L.destinedDetails);
      ff.destiny_track = "0";
    }
    if (id === "bound") {
      ff.institution = pickOne(L.boundInstitutions);
      ff.role_title = pickOne(L.boundTitles);
      const extra = pickN(L.boundExtraTenets, 2);
      ff.tenets =
        "Do good in the world; Defend the institution; Obey its leaders; " + extra.join("; ");
      ff.justice_hold = "0";
    }
    if (id === "pillar") {
      ff.squad_home = pickOne(G().hometowns[cultureId] || G().hometowns["earth-kingdom"]);
      ff.squad_traits = pickN(L.pillarTraits, 3).join(", ");
      ff.squad_values = pickN(L.pillarValues, 2).join(", ");
      ff.leadership_styles = pickN(L.pillarLeadership, 2).join("\n");
      ff.support_styles = pickN(L.pillarSupport, 2).join("\n");
      ff.team = "0";
    }
    if (id === "successor") {
      ff.lineage_name = L.successorLineages[cultureId] || "a known house";
      const domains = pickN(L.successorDomains, 2);
      ff.domain_power = domains[0] || "";
      ff.domain_reach = domains[1] || "";
      ff.resources = pickN(L.successorResources, 2).join("; ");
      ff.resource_hold = "0";
    }
    if (id === "authority") {
      ff.faction_name = L.authorityFactions[cultureId] || "a local faction";
      ff.faction_kind = pickOne(L.authorityKinds);
      ff.faction_principle = pickOne(L.authorityPrinciples);
      ff.faction_assets = "people; a meeting hall; a store of supplies";
      ff.faction_weaknesses = "slow to agree; a rival voice";
      ff.faction_dissent = "0";
    }
    if (id === "architect") {
      ff.marvel_nature = pickOne(L.architectMarvels);
      ff.steward_principles = "Growth vs Restraint";
      ff.steward_intention = pickOne(["−1", "+1"]);
      ff.steward_balance = ff.steward_intention === "+1" ? "−1 Growth" : "+1 Restraint";
    }
    if (id === "razor") {
      ff.mistakes = pickN(L.razorMistakes, 4).join("; ");
      ff.connection_unlocked = "0 (starts locked above +0)";
      state.balance = 2;
    }
    if (id === "broken") {
      const wounds = pickN(L.brokenWounds, 3);
      ff.wound1 = wounds[0] || "";
      ff.wound2 = wounds[1] || "";
      ff.wound3 = wounds[2] || "";
    }

    G().personFieldIds.forEach((fid) => {
      if (ff[fid] == null) return;
      if (fillOthers) {
        if (fid === "animal_companion") ff[fid] = pickOne(L.animalCompanions);
        else if (fid === "proteges") ff[fid] = personName(cultureId) + " — (principle unset)";
        else ff[fid] = personName(cultureId);
      } else {
        ff[fid] = "";
      }
    });
  }

  function fillFoundling(state, eraId, cultureId, training) {
    const other = secondHeritage(eraId, cultureId, training);
    const otherBg = other.background;
    const thisBg = pickBackground("foundling");
    state.featureFields.heritage_a_training = training;
    state.featureFields.heritage_a_background = thisBg;
    state.featureFields.heritage_b_training = other.training;
    state.featureFields.heritage_b_background = otherBg;
    state.background = thisBg + " / " + otherBg;
    state.training = training;
    return other;
  }

  function pickMoves(pb) {
    const n = pb.movesChoose || 2;
    return pickN(
      (pb.moves || []).map((m) => m.id),
      n
    );
  }

  function buildCharacter(resolved) {
    const pb = playbookById(resolved.playbookId);
    if (!pb || !AL.Sheet || !AL.Sheet.defaultState) {
      throw new Error("Playbook data or sheet engine is not loaded.");
    }
    const state = AL.Sheet.defaultState(pb);
    const names = threeNames(resolved.cultureId);
    state.name = names[0] || "";
    state.training = resolved.training;
    state.background = pickBackground(pb.id);
    state.demeanor = pickOne(pb.demeanors || []) || "";
    state.hometown = pickOne(G().hometowns[resolved.cultureId] || G().hometowns["earth-kingdom"]);
    state.look = pickOne(G().looks);
    state.fightingStyle = pickOne(G().fightingStyles[resolved.training] || G().fightingStyles["Other / Custom"]);
    state.creationBonusStat = pickOne(AL.COMMON.stats);
    const hook = statHook(pb.id, state.creationBonusStat);
    const rare = rareHook(resolved.eraId, resolved.training, resolved.cultureId);
    state.backstory = [hook, rare].filter(Boolean).join(" ");
    state.selectedMoves = pickMoves(pb);
    while (state.selectedMoves.length < (pb.movesChoose || 2)) state.selectedMoves.push("");

    if (pb.id === "foundling") {
      fillFoundling(state, resolved.eraId, resolved.cultureId, resolved.training);
    }

    fillClosedFields(pb, state, resolved.cultureId, resolved.fillOthers);

    state.role = resolved.role;
    if (resolved.role === "npc") {
      state.fatigueMax = resolved.fatigueMax;
      state.fatigue = 0;
      state.ui.growthExpanded = false;
      state.ui.sessionsExpanded = false;
      state.ui.historyExpanded = false;
    }

    return { state, names, hook, rare };
  }

  function resolveLocks() {
    const role = locks.role === "npc" ? "npc" : "pc";
    const eraId = locks.era || pickOne(G().eras).id;
    const training = locks.training || "";
    const cultureId = locks.culture || pickCulture(eraId, training);
    const resolvedTraining = training || pickTraining(eraId, cultureId);
    const playbookId = locks.playbook || pickPlaybook(resolvedTraining);
    return {
      role,
      eraId,
      cultureId,
      training: resolvedTraining,
      playbookId,
      fatigueMax: role === "npc" ? Number(locks.fatigueMax) || 5 : 5,
      fillOthers: !!locks.fillOthers
    };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { items: [] };
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.items)) return { items: [] };
      return data;
    } catch {
      return { items: [] };
    }
  }

  function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  function unresolvedItems() {
    return loadStore().items.filter((i) => i && !i.exportedAt && !i.openedOnSheet);
  }

  function upsertWorking(item) {
    const store = loadStore();
    if (workingId) {
      const idx = store.items.findIndex((i) => i.id === workingId);
      item.id = workingId;
      if (idx >= 0) store.items[idx] = item;
      else store.items.push(item);
    } else {
      store.items.push(item);
      workingId = item.id;
    }
    saveStore(store);
  }

  function removeItem(id) {
    const store = loadStore();
    store.items = store.items.filter((i) => i.id !== id);
    saveStore(store);
    if (workingId === id) {
      workingId = null;
      currentItem = null;
    }
  }

  function patchItem(id, patch) {
    const store = loadStore();
    const item = store.items.find((i) => i.id === id);
    if (!item) return;
    Object.keys(patch).forEach((k) => {
      item[k] = patch[k];
    });
    saveStore(store);
    if (currentItem && currentItem.id === id) {
      Object.keys(patch).forEach((k) => {
        currentItem[k] = patch[k];
      });
    }
  }

  function newId() {
    return "g-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function displayName(item) {
    if (item.customName && item.customName.trim()) return item.customName.trim();
    const names = item.nameChoices || [];
    const i = item.chosenNameIndex || 0;
    return names[i] || item.name || "(unnamed)";
  }

  function applyChosenName(item) {
    const name = displayName(item);
    item.name = name;
    if (item.character) item.character.name = name;
    return name;
  }

  function exportPayload(item) {
    applyChosenName(item);
    const pagesBase = "https://ldjessee-code.github.io/avatarlegends_charsheet";
    return {
      _meta: {
        app: "avatar-legends-charsheet",
        appVersion: (window.AL && AL.VERSION) || "",
        exportFormat: 3,
        playbookId: item.playbookId,
        playbookName: item.playbookName,
        role: item.role,
        generated: true,
        exportedAt: new Date().toISOString(),
        repoUrl: "https://github.com/ldjessee-code/avatarlegends_charsheet",
        pagesUrl: pagesBase + "/",
        playbookUrl: pagesBase + "/playbooks/" + item.playbookId + ".html",
        note: item.role === "npc" ? "Generated NPC. fatigueMax may differ from PC sheets." : "Generated PC. Load on the matching playbook page."
      },
      character: item.character
    };
  }

  function downloadJson(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadItem(item) {
    applyChosenName(item);
    const base = (item.name || item.playbookId || "character").replace(/[^\w\-]+/g, "_");
    downloadJson(exportPayload(item), base + (item.role === "npc" ? "_npc.json" : "_sheet.json"));
    patchItem(item.id, { exportedAt: new Date().toISOString() });
  }

  function openPcSheet(item) {
    applyChosenName(item);
    localStorage.setItem(
      STAGING_KEY,
      JSON.stringify({
        leftoverId: item.id,
        playbookId: item.playbookId,
        character: item.character
      })
    );
    window.location.href = "playbooks/" + item.playbookId + ".html?generated=1";
  }

  function runGenerate() {
    const resolved = resolveLocks();
    const pb = playbookById(resolved.playbookId);
    if (!pb) {
      alert("Unknown playbook.");
      return;
    }
    const built = buildCharacter(resolved);
    const era = eraById(resolved.eraId);
    const culture = cultureById(resolved.cultureId);
    const item = {
      id: newId(),
      role: resolved.role,
      playbookId: pb.id,
      playbookName: pb.name,
      name: built.names[0] || "",
      nameChoices: built.names,
      chosenNameIndex: 0,
      customName: "",
      eraId: resolved.eraId,
      eraName: era ? era.name : resolved.eraId,
      cultureId: resolved.cultureId,
      cultureName: culture ? culture.name : resolved.cultureId,
      training: resolved.training,
      fatigueMax: resolved.fatigueMax,
      statBonus: built.state.creationBonusStat,
      statHook: built.hook,
      rareHook: built.rare,
      fillOthers: resolved.fillOthers,
      character: built.state,
      createdAt: new Date().toISOString(),
      exportedAt: null,
      openedOnSheet: false
    };
    upsertWorking(item);
    currentItem = item;
    renderPreview();
  }

  function chipGroup(label, name, options, selected, onPick) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "gen-step";
    const legend = document.createElement("legend");
    legend.textContent = label;
    fieldset.appendChild(legend);
    const row = document.createElement("div");
    row.className = "gen-chips";
    row.setAttribute("role", "radiogroup");
    row.setAttribute("aria-label", label);
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gen-chip" + (selected === opt.value ? " is-on" : "");
      btn.setAttribute("aria-pressed", selected === opt.value ? "true" : "false");
      btn.textContent = opt.label;
      btn.addEventListener("click", () => onPick(opt.value));
      row.appendChild(btn);
    });
    fieldset.appendChild(row);
    return fieldset;
  }

  function renderWizard() {
    const root = $("#gen-wizard");
    if (!root) return;
    root.innerHTML = "";

    root.appendChild(
      chipGroup(
        "Who is this?",
        "role",
        [
          { value: "pc", label: "Player character" },
          { value: "npc", label: "Someone else (NPC)" }
        ],
        locks.role,
        (v) => {
          locks.role = v;
          renderWizard();
          if (currentItem) renderPreview();
        }
      )
    );

    const eraOpts = [{ value: "", label: "Surprise me" }].concat(
      G().eras.map((e) => ({ value: e.id, label: e.name }))
    );
    root.appendChild(
      chipGroup("1. Era", "era", eraOpts, locks.era, (v) => {
        locks.era = v;
        if (locks.culture && v && !culturesForEra(v).some((c) => c.id === locks.culture)) {
          locks.culture = "";
        }
        renderWizard();
      })
    );

    const eraForCultures = locks.era || null;
    const culturePool = eraForCultures ? culturesForEra(eraForCultures) : G().cultures;
    const cultureOpts = [{ value: "", label: "Any" }].concat(
      culturePool.map((c) => ({ value: c.id, label: c.name }))
    );
    root.appendChild(
      chipGroup("2. Culture", "culture", cultureOpts, locks.culture, (v) => {
        locks.culture = v;
        renderWizard();
      })
    );

    const trainOpts = [{ value: "", label: "Any" }].concat(
      AL.COMMON.trainings
        .filter((t) => t !== "Other / Custom")
        .map((t) => ({ value: t, label: t }))
    );
    root.appendChild(
      chipGroup("3. Training", "training", trainOpts, locks.training, (v) => {
        locks.training = v;
        renderWizard();
      })
    );

    const pbOpts = [{ value: "", label: "Any" }].concat(
      PLAYBOOK_ORDER.filter((id) => playbookById(id)).map((id) => ({
        value: id,
        label: playbookById(id).name
      }))
    );
    root.appendChild(
      chipGroup("4. Playbook", "playbook", pbOpts, locks.playbook, (v) => {
        locks.playbook = v;
        renderWizard();
      })
    );

    if (locks.role === "npc") {
      root.appendChild(
        chipGroup(
          "5. NPC fatigue",
          "fatigue",
          [3, 5, 8, 10].map((n) => ({ value: String(n), label: String(n) })),
          String(locks.fatigueMax),
          (v) => {
            locks.fatigueMax = Number(v);
            renderWizard();
          }
        )
      );
    }

    const fill = document.createElement("label");
    fill.className = "gen-switch";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = locks.fillOthers;
    cb.addEventListener("change", () => {
      locks.fillOthers = cb.checked;
    });
    fill.appendChild(cb);
    fill.appendChild(
      document.createTextNode(" Invent names for other people (ward, lodestar, adversary, …)")
    );
    root.appendChild(fill);

    const actions = document.createElement("div");
    actions.className = "gen-actions";
    const go = document.createElement("button");
    go.type = "button";
    go.className = "primary-file";
    go.textContent = currentItem ? "Again (same locks)" : "Surprise the rest";
    go.addEventListener("click", runGenerate);
    actions.appendChild(go);
    root.appendChild(actions);
  }

  function moveNames(item) {
    const pb = playbookById(item.playbookId);
    if (!pb) return [];
    return (item.character.selectedMoves || [])
      .map((id) => {
        const m = pb.moves.find((x) => x.id === id);
        return m ? m.name : "";
      })
      .filter(Boolean);
  }

  function renderPreview() {
    const root = $("#gen-preview");
    if (!root) return;
    root.innerHTML = "";
    if (!currentItem) {
      root.hidden = true;
      return;
    }
    root.hidden = false;
    const item = currentItem;
    const pb = playbookById(item.playbookId);
    const card = document.createElement("article");
    card.className = "gen-card";
    card.setAttribute("aria-live", "polite");

    const kicker = document.createElement("div");
    kicker.className = "gen-kicker";
    kicker.textContent =
      (item.role === "npc" ? "NPC" : "PC") +
      " · " +
      item.eraName +
      " · " +
      item.cultureName +
      " · " +
      item.training;
    card.appendChild(kicker);

    const h = document.createElement("h2");
    h.textContent = displayName(item) + (pb ? " — " + pb.name : "");
    card.appendChild(h);

    const meta = document.createElement("p");
    meta.className = "gen-meta";
    const bits = [
      item.character.demeanor,
      item.character.background,
      item.character.hometown
    ].filter(Boolean);
    meta.textContent = bits.join(" · ");
    card.appendChild(meta);

    const stat = document.createElement("p");
    stat.innerHTML =
      "<strong>+1 " +
      escapeHtml(item.statBonus || "") +
      "</strong>" +
      (item.statHook ? " — " + escapeHtml(item.statHook) : "");
    card.appendChild(stat);

    if (item.rareHook) {
      const rare = document.createElement("p");
      rare.className = "gen-rare";
      rare.textContent = item.rareHook;
      card.appendChild(rare);
    }

    const moves = moveNames(item);
    if (moves.length) {
      const mp = document.createElement("p");
      mp.textContent = "Moves: " + moves.join(", ");
      card.appendChild(mp);
    }

    if (item.role === "npc") {
      const fat = document.createElement("p");
      fat.textContent = "Fatigue track: " + item.fatigueMax + " boxes (empty)";
      card.appendChild(fat);
    }

    const nameLab = document.createElement("p");
    nameLab.className = "gen-namelabel";
    nameLab.textContent = "Name (pick one, or type your own)";
    card.appendChild(nameLab);

    const nameRow = document.createElement("div");
    nameRow.className = "gen-chips";
    (item.nameChoices || []).forEach((n, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "gen-chip" + (!item.customName && item.chosenNameIndex === idx ? " is-on" : "");
      btn.textContent = n;
      btn.addEventListener("click", () => {
        item.chosenNameIndex = idx;
        item.customName = "";
        applyChosenName(item);
        upsertWorking(item);
        renderPreview();
      });
      nameRow.appendChild(btn);
    });
    card.appendChild(nameRow);

    const custom = document.createElement("input");
    custom.type = "text";
    custom.className = "gen-custom-name";
    custom.placeholder = "Type your own name";
    custom.value = item.customName || "";
    custom.setAttribute("aria-label", "Type your own name");
    custom.addEventListener("input", () => {
      item.customName = custom.value;
      applyChosenName(item);
      upsertWorking(item);
      const title = card.querySelector("h2");
      if (title && pb) title.textContent = displayName(item) + " — " + pb.name;
    });
    card.appendChild(custom);

    const btns = document.createElement("div");
    btns.className = "gen-actions";

    if (item.role === "pc") {
      const open = document.createElement("button");
      open.type = "button";
      open.className = "primary-file";
      open.textContent = "Open " + (pb ? pb.name : "playbook") + " sheet";
      open.addEventListener("click", () => openPcSheet(item));
      btns.appendChild(open);
    } else {
      const keep = document.createElement("button");
      keep.type = "button";
      keep.className = "primary-file";
      keep.textContent = "Keep NPC in this browser";
      keep.addEventListener("click", () => {
        applyChosenName(item);
        upsertWorking(item);
        setStatus("Kept in this browser until you download JSON or discard.");
      });
      btns.appendChild(keep);
    }

    const dl = document.createElement("button");
    dl.type = "button";
    dl.className = "secondary";
    dl.textContent = "Download JSON";
    dl.addEventListener("click", () => {
      downloadItem(item);
      setStatus("Downloaded JSON");
      renderLeftoverBanner();
    });
    btns.appendChild(dl);

    const discard = document.createElement("button");
    discard.type = "button";
    discard.className = "secondary";
    discard.textContent = "Discard";
    discard.addEventListener("click", () => {
      if (!confirm("Discard this generated character from this browser?")) return;
      removeItem(item.id);
      currentItem = null;
      renderPreview();
      renderLeftoverBanner();
      renderWizard();
    });
    btns.appendChild(discard);

    card.appendChild(btns);

    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent =
      item.role === "pc"
        ? "Opens the real playbook sheet so you can tweak moves, look, and the rest. If that sheet already has a character, you can download it first."
        : "NPCs stay here. Download JSON if you want a file. This is not written onto a playbook sheet.";
    card.appendChild(hint);

    root.appendChild(card);
  }

  function setStatus(msg) {
    const el = $("#gen-status");
    if (el) el.textContent = msg || "";
  }

  function renderLeftoverBanner() {
    const host = $("#gen-leftover-slot");
    if (!host) return;
    host.innerHTML = "";
    if (sessionStorage.getItem(DEFER_KEY) === "1") return;
    const leftover = unresolvedItems();
    if (!leftover.length) return;

    const bar = document.createElement("div");
    bar.className = "gen-leftover";
    bar.innerHTML =
      "<strong>You have " +
      leftover.length +
      " generated character" +
      (leftover.length === 1 ? "" : "s") +
      " that were never saved as JSON.</strong>";
    const row = document.createElement("div");
    row.className = "gen-actions";

    const review = document.createElement("button");
    review.type = "button";
    review.className = "secondary";
    review.textContent = leftoverOpen ? "Hide list" : "Review";
    review.addEventListener("click", () => {
      leftoverOpen = !leftoverOpen;
      renderLeftoverBanner();
    });
    row.appendChild(review);

    const dlAll = document.createElement("button");
    dlAll.type = "button";
    dlAll.className = "secondary";
    dlAll.textContent = "Download all as JSON";
    dlAll.addEventListener("click", () => {
      leftover.forEach((item) => applyChosenName(item));
      downloadJson(
        leftover.map(exportPayload),
        "generated-characters.json"
      );
      leftover.forEach((item) => patchItem(item.id, { exportedAt: new Date().toISOString() }));
      leftoverOpen = false;
      renderLeftoverBanner();
      setStatus("Downloaded all as JSON");
    });
    row.appendChild(dlAll);

    const discardAll = document.createElement("button");
    discardAll.type = "button";
    discardAll.className = "secondary";
    discardAll.textContent = "Discard all";
    discardAll.addEventListener("click", () => {
      if (!confirm("Remove all unsaved generated characters from this browser?")) return;
      leftover.forEach((item) => removeItem(item.id));
      leftoverOpen = false;
      renderLeftoverBanner();
      if (currentItem && leftover.some((i) => i.id === currentItem.id)) {
        currentItem = null;
        renderPreview();
        renderWizard();
      }
    });
    row.appendChild(discardAll);

    const later = document.createElement("button");
    later.type = "button";
    later.className = "secondary";
    later.textContent = "Keep for now";
    later.addEventListener("click", () => {
      sessionStorage.setItem(DEFER_KEY, "1");
      leftoverOpen = false;
      renderLeftoverBanner();
    });
    row.appendChild(later);

    bar.appendChild(row);

    if (leftoverOpen) {
      const list = document.createElement("ul");
      list.className = "gen-leftover-list";
      leftover.forEach((item) => {
        const li = document.createElement("li");
        const label =
          displayName(item) +
          " · " +
          (item.role === "npc" ? "NPC" : "PC") +
          " · " +
          (item.playbookName || item.playbookId) +
          " · " +
          (item.eraName || "");
        const span = document.createElement("span");
        span.textContent = label;
        li.appendChild(span);
        const acts = document.createElement("div");
        acts.className = "gen-mini-actions";
        if (item.role === "pc") {
          const open = document.createElement("button");
          open.type = "button";
          open.className = "secondary";
          open.textContent = "Open sheet";
          open.addEventListener("click", () => openPcSheet(item));
          acts.appendChild(open);
        }
        const dl = document.createElement("button");
        dl.type = "button";
        dl.className = "secondary";
        dl.textContent = "Download JSON";
        dl.addEventListener("click", () => {
          downloadItem(item);
          renderLeftoverBanner();
        });
        acts.appendChild(dl);
        const rm = document.createElement("button");
        rm.type = "button";
        rm.className = "secondary";
        rm.textContent = "Discard";
        rm.addEventListener("click", () => {
          removeItem(item.id);
          if (currentItem && currentItem.id === item.id) {
            currentItem = null;
            renderPreview();
            renderWizard();
          }
          renderLeftoverBanner();
        });
        acts.appendChild(rm);
        li.appendChild(acts);
        list.appendChild(li);
      });
      bar.appendChild(list);
    }

    host.appendChild(bar);
  }

  function boot() {
    if (!AL.GENERATOR || !AL.PLAYBOOKS || !AL.Sheet) {
      const main = $("#gen-main");
      if (main) {
        main.innerHTML =
          "<p class='callout'>Generator data failed to load. Keep the folder together (data/, js/, playbooks/) and open from the hub.</p>";
      }
      return;
    }
    renderLeftoverBanner();
    renderWizard();
    renderPreview();
    const v = (window.AL && AL.VERSION) || "";
    const f = $("#footer-version");
    if (f && v) f.textContent = " · v" + v;
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
