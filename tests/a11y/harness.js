/* In-page accessibility checks. Injected by run-a11y.mjs (never shipped to the site).
 * Writes a JSON result into <script id="__a11y_out" type="application/json">.
 * Colour maths follows WCAG 2.x relative luminance. */
(function () {
  "use strict";
  var THEMES = ["", "theme-fire", "theme-water", "theme-earth", "theme-air", "theme-weapons", "theme-technology"];
  var out = { path: location.pathname, checks: {} };

  /* ---------- colour helpers ---------- */
  var cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  var cx = cv.getContext("2d", { willReadFrequently: true });
  function parse(css) {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#000";
    cx.fillStyle = css;
    cx.fillRect(0, 0, 1, 1);
    var d = cx.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
  }
  function over(fg, bg) {
    var a = fg.a;
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
  }
  function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }
  function ratio(a, b) { var x = lum(a), y = lum(b); if (x < y) { var t = x; x = y; y = t; } return (x + 0.05) / (y + 0.05); }
  function hex(c) { return "#" + [c.r, c.g, c.b].map(function (v) { return Math.round(v).toString(16).padStart(2, "0"); }).join(""); }

  /* Colours of a linear-gradient() at a viewport point, from the computed value. Returns null if not parseable. */
  function gradientAt(cs, box, px, py) {
    var m = /^linear-gradient\((.*)\)$/.exec(cs.backgroundImage.trim());
    if (!m) return null;
    var body = m[1];
    var ang = 180;
    var am = /^\s*(-?[\d.]+)deg\s*,/.exec(body);
    if (am) ang = parseFloat(am[1]);
    var tm = /^\s*to ([a-z ]+),/.exec(body);
    if (tm) ang = { "top": 0, "right": 90, "bottom": 180, "left": 270, "top right": 45, "bottom right": 135, "bottom left": 225, "top left": 315 }[tm[1].trim()] || 180;
    var re = /(rgba?\([^)]*\)|color\([^)]*\)|#[0-9a-f]{3,8})(?:\s+(-?[\d.]+)%)?/gi, stops = [], x;
    while ((x = re.exec(body))) stops.push({ c: parse(x[1]), p: x[2] === undefined ? null : parseFloat(x[2]) / 100 });
    if (stops.length < 2) return null;
    stops[0].p = stops[0].p === null ? 0 : stops[0].p;
    stops[stops.length - 1].p = stops[stops.length - 1].p === null ? 1 : stops[stops.length - 1].p;
    for (var i = 1; i < stops.length - 1; i++) if (stops[i].p === null) {
      var j = i; while (stops[j].p === null) j++;
      var k = i - 1;
      for (var q = i; q < j; q++) stops[q].p = stops[k].p + (stops[j].p - stops[k].p) * (q - k) / (j - k);
    }
    var th = ang * Math.PI / 180, sx = Math.sin(th), sy = -Math.cos(th);
    var len = Math.abs(box.width * sx) + Math.abs(box.height * sy);
    var t = ((px - (box.left + box.width / 2)) * sx + (py - (box.top + box.height / 2)) * sy) / len + 0.5;
    t = Math.max(0, Math.min(1, t));
    for (var n = 1; n < stops.length; n++) {
      if (t <= stops[n].p || n === stops.length - 1) {
        var a = stops[n - 1], b = stops[n], u = b.p === a.p ? 1 : Math.max(0, Math.min(1, (t - a.p) / (b.p - a.p)));
        return { r: a.c.r + (b.c.r - a.c.r) * u, g: a.c.g + (b.c.g - a.c.g) * u, b: a.c.b + (b.c.b - a.c.b) * u, a: a.c.a + (b.c.a - a.c.a) * u };
      }
    }
    return null;
  }

  /* Effective opaque background behind an element at one viewport point; null when it sits on an image or an
   * unparseable gradient. pt defaults to the element centre. */
  function bgOf(el, pt) {
    var er = el.getBoundingClientRect();
    pt = pt || { x: er.left + er.width / 2, y: er.top + er.height / 2 };
    var layers = [];
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") {
        var g = /^linear-gradient/.test(cs.backgroundImage) ? gradientAt(cs, n.getBoundingClientRect(), pt.x, pt.y) : null;
        if (!g) return null;
        layers.push(g);
        if (g.a >= 1) break;
        continue;
      }
      var c = parse(cs.backgroundColor);
      if (c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    var base = { r: 255, g: 255, b: 255, a: 1 };
    for (var i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  }
  /* Worst contrast over several sample points of the element (gradients vary across the box). */
  function worstPoints(el) {
    var r = el.getBoundingClientRect();
    return [[0.1, 0.5], [0.5, 0.5], [0.9, 0.5], [0.5, 0.1], [0.5, 0.9]].map(function (f) { return { x: r.left + r.width * f[0], y: r.top + r.height * f[1] }; });
  }
  function visible(el) {
    if (!el.getClientRects().length) return false;
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.visibility === "hidden" || cs.display === "none" || n.hasAttribute("hidden")) return false;
    }
    return true;
  }
  function sel(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) return s + "#" + el.id;
    if (el.className && typeof el.className === "string") s += "." + el.className.trim().split(/\s+/).slice(0, 2).join(".");
    return s;
  }

  /* ---------- accessible name (simplified accname) ---------- */
  function textOf(el, seen) {
    seen = seen || new Set();
    if (seen.has(el)) return "";
    seen.add(el);
    var t = "";
    el.childNodes.forEach(function (ch) {
      if (ch.nodeType === 3) t += ch.nodeValue;
      else if (ch.nodeType === 1 && visible(ch) && ch.getAttribute("aria-hidden") !== "true") {
        t += ch.tagName === "IMG" ? ch.getAttribute("alt") || "" : textOf(ch, seen);
      }
    });
    return t;
  }
  function accName(el) {
    var v = (el.getAttribute("aria-label") || "").trim();
    if (v) return v;
    var by = el.getAttribute("aria-labelledby");
    if (by) {
      v = by.split(/\s+/).map(function (id) { var e = document.getElementById(id); return e ? textOf(e) : ""; }).join(" ").trim();
      if (v) return v;
    }
    if (el.labels && el.labels.length) {
      v = Array.prototype.map.call(el.labels, function (l) { return textOf(l); }).join(" ").trim();
      if (v) return v;
    }
    var tag = el.tagName;
    if (tag === "BUTTON" || tag === "SUMMARY" || tag === "A" || el.getAttribute("role") === "button") {
      v = textOf(el).trim();
      if (v) return v;
    }
    if (tag === "INPUT" && /^(button|submit|reset)$/.test(el.type) && el.value) return el.value;
    return (el.getAttribute("title") || "").trim();
  }

  var CONTROLS = "button, select, textarea, input:not([type=hidden]), summary, [role=button], [role=checkbox], [role=switch], [role=tab]";

  /* ---------- checks: each returns an array of problem strings ---------- */
  function checkNames() {
    var bad = [];
    document.querySelectorAll(CONTROLS).forEach(function (el) {
      if (!visible(el) || el.disabled && false) return;
      if (el.type === "file" && el.hasAttribute("hidden")) return;
      if (!accName(el)) bad.push(sel(el) + " has no accessible name :: " + (el.parentElement ? el.parentElement.className + " > " : "") + el.outerHTML.slice(0, 110).replace(/\s+/g, " "));
    });
    return bad;
  }

  function checkContrast() {
    var bad = [], skipped = 0;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var seenEls = new Set();
    while (walker.nextNode()) {
      var tn = walker.currentNode;
      if (!tn.nodeValue.trim()) continue;
      var el = tn.parentElement;
      if (!el || seenEls.has(el)) continue;
      seenEls.add(el);
      if (/^(SCRIPT|STYLE|NOSCRIPT|OPTION)$/.test(el.tagName)) continue;
      if (!visible(el)) continue;
      if (el.closest("[disabled], [aria-disabled=true]")) continue;
      var cs = getComputedStyle(el);
      var op = 1;
      for (var n = el; n && n.nodeType === 1; n = n.parentElement) op *= parseFloat(getComputedStyle(n).opacity);
      var px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
      var need = px >= 24 || (px >= 18.66 && bold) ? 3 : 4.5;
      var worst = null;
      worstPoints(el).forEach(function (pt) {
        var bg = bgOf(el, pt);
        if (!bg) return;
        var fg = over(parse(cs.color), bg);
        if (op < 1) fg = over({ r: fg.r, g: fg.g, b: fg.b, a: op }, bg);
        var r = ratio(fg, bg);
        if (!worst || r < worst.r) worst = { r: r, fg: fg, bg: bg };
      });
      if (!worst) { skipped++; continue; }
      if (worst.r + 0.005 < need) bad.push(sel(el) + " " + worst.r.toFixed(2) + ":1 (need " + need + ") " + hex(worst.fg) + " on " + hex(worst.bg));
    }
    return bad;
  }

  function expandAll() {
    document.querySelectorAll("details:not([open])").forEach(function (d) { d.open = true; });
    document.querySelectorAll(".section-toggle-btn[aria-expanded=false]").forEach(function (b) { b.click(); });
  }

  function checkContrastThemes() {
    var bad = [];
    var was = document.body.className;
    var hasTheme = THEMES.slice(1).some(function (t) { return /theme-/.test(was) || t; });
    var isSheet = !!document.querySelector("[data-playbook]");
    (isSheet ? THEMES : [""]).forEach(function (t) {
      THEMES.slice(1).forEach(function (x) { document.body.classList.remove(x); });
      if (t) document.body.classList.add(t);
      checkContrast().forEach(function (m) { bad.push("[" + (t || "default") + "] " + m); });
    });
    document.body.className = was;
    return bad;
  }

  function checkFocus() {
    var bad = [];
    var probes = [
      ".char-name-input", "textarea", "select", "input[type=text]", "input[type=number]", "input:not([type]):not([hidden])",
      "button", "summary", "a[href]", ".skip-link", ".section-toggle-btn"
    ];
    var done = new Set();
    probes.forEach(function (q) {
      var el = Array.prototype.slice.call(document.querySelectorAll(q)).filter(function (e) { return visible(e) || /skip-link/.test(q); })[0];
      if (!el || done.has(el)) return;
      done.add(el);
      el.focus({ focusVisible: true });
      if (document.activeElement !== el) return;
      var cs = getComputedStyle(el);
      var w = parseFloat(cs.outlineWidth) || 0;
      var ringCss = null, kind = "";
      if (cs.outlineStyle === "auto") { kind = "ua-auto"; }
      else if (cs.outlineStyle !== "none" && w > 0) { ringCss = cs.outlineColor; kind = "outline " + w + "px"; if (w < 2) bad.push(sel(el) + " outline is only " + w + "px"); }
      else {
        var m = /(rgba?\([^)]*\)|color\([^)]*\)|#[0-9a-f]{3,8})\s+0px\s+0px\s+0px\s+(\d+(?:\.\d+)?)px/i.exec(cs.boxShadow) ||
                /(rgba?\([^)]*\))\s+0px\s+0px\s+\d+px\s+(\d+(?:\.\d+)?)px/i.exec(cs.boxShadow);
        if (m && parseFloat(m[2]) >= 2) { ringCss = m[1]; kind = "box-shadow " + m[2] + "px"; }
      }
      if (kind === "ua-auto") return;
      if (!ringCss) { bad.push(sel(el) + " shows no focus indicator (outline: " + cs.outlineStyle + ")"); return; }
      var ring = parse(ringCss);
      var around = bgOf(el.parentElement || el);
      if (!around) return;
      var r = ratio(over(ring, around), around);
      if (r < 3) bad.push(sel(el) + " focus ring (" + kind + ") is " + r.toFixed(2) + ":1 against " + hex(around) + " (need 3)");
      if (kind.indexOf("outline") === 0 && cs.outlineOffset !== undefined) {
        var inner = bgOf(el);
        if (inner && parseFloat(cs.outlineOffset) < 0) {
          var r2 = ratio(over(ring, inner), inner);
          if (r2 < 3) bad.push(sel(el) + " inset focus ring is " + r2.toFixed(2) + ":1 against its own background");
        }
      }
      el.blur();
    });
    return bad;
  }

  function checkTargets() {
    var bad = [];
    var q = "button, select, textarea, summary, input:not([type=hidden]), [role=button], a[href]";
    document.querySelectorAll(q).forEach(function (el) {
      if (!visible(el)) return;
      var cs = getComputedStyle(el);
      if (el.tagName === "A") {
        if (cs.display === "inline" && el.closest("p, li, td, dd, span, footer, div") && !el.classList.contains("btn")) {
          var par = el.parentElement;
          if (par && /^(P|LI|TD|DD|FOOTER|SPAN|STRONG|EM|DIV)$/.test(par.tagName) && par.textContent.trim().length > el.textContent.trim().length + 3) return; /* inline link in a sentence */
        }
      }
      if (el.classList.contains("skip-link")) return;
      var r = el.getBoundingClientRect();
      if (r.width + 0.5 < 24 || r.height + 0.5 < 24) {
        bad.push(sel(el) + " is " + Math.round(r.width) + "x" + Math.round(r.height) + "px" + (accName(el) ? " (" + accName(el).slice(0, 24) + ")" : ""));
      }
    });
    return bad;
  }

  function checkStructure() {
    var bad = [];
    if (!document.documentElement.lang) bad.push("html has no lang");
    if (!document.title.trim()) bad.push("empty <title>");
    var mains = document.querySelectorAll("main, [role=main]").length;
    if (mains !== 1) bad.push("expected 1 main landmark, found " + mains);
    var h1 = document.querySelectorAll("h1").length;
    if (h1 !== 1) bad.push("expected 1 <h1>, found " + h1);
    document.querySelectorAll("img").forEach(function (i) { if (!i.hasAttribute("alt")) bad.push("img without alt: " + (i.getAttribute("src") || "").slice(-30)); });
    var ids = {};
    document.querySelectorAll("[id]").forEach(function (e) { ids[e.id] = (ids[e.id] || 0) + 1; });
    Object.keys(ids).forEach(function (k) { if (ids[k] > 1) bad.push("duplicate id " + k); });
    var skip = document.querySelector(".skip-link");
    if (skip) {
      var tgt = document.querySelector(skip.getAttribute("href"));
      if (!tgt) bad.push("skip link target missing");
    }
    return bad;
  }

  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function checkLabelInName() {
    var bad = [];
    document.querySelectorAll("[aria-label]").forEach(function (el) {
      if (!visible(el)) return;
      var vis = norm(textOf(el));
      if (vis && norm(el.getAttribute("aria-label")).indexOf(vis) < 0 && /^(BUTTON|A|SUMMARY)$/.test(el.tagName) || vis && el.getAttribute("role") === "button" && norm(el.getAttribute("aria-label")).indexOf(vis) < 0) {
        bad.push(sel(el) + ' accessible name "' + el.getAttribute("aria-label") + '" does not contain visible text "' + textOf(el).trim() + '"');
      }
    });
    return bad;
  }

  function checkScrollPadding() {
    var bad = [];
    var bar = document.getElementById("toolbar");
    if (!bar) return bad;
    var pos = getComputedStyle(bar).position;
    if (pos !== "sticky" && pos !== "fixed") return bad;
    var sp = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    var h = bar.getBoundingClientRect().height;
    if (sp + 0.5 < h) bad.push("sticky toolbar is " + Math.round(h) + "px tall but html scroll-padding-top is " + sp + "px (focused fields can hide under it)");
    return bad;
  }

  function checkNoNativeDialogs() {
    /* Informational only: native alert/confirm are announced by browsers; not an AA failure. */
    return [];
  }

  function run(name, fn) {
    try { out.checks[name] = { problems: fn() }; }
    catch (e) { out.checks[name] = { error: String(e && e.stack || e) }; }
  }

  function finish() {
    var s = document.createElement("script");
    s.id = "__a11y_out";
    s.type = "application/json";
    s.textContent = JSON.stringify(out).replace(/</g, "\\u003c");
    document.body.appendChild(s);
  }

  /* Switch on checkable/toggle controls so "selected" styles are measured too (chips, pips, track boxes). */
  function activateStates() {
    ["input.chip-input, .chip input[type=checkbox]", ".balance-pip", ".track-box", ".mini-box", ".session-toggle"].forEach(function (q) {
      var n = document.querySelectorAll(q).length;
      for (var i = 0; i < n; i++) {
        var e = document.querySelectorAll(q)[i];
        if (e && !e.disabled) e.click();
      }
    });
    expandAll();
  }

  function probe() {
    var q = new URLSearchParams(location.search).get("probe");
    if (!q) return;
    out.probe = Array.prototype.slice.call(document.querySelectorAll(q)).slice(0, 8).map(function (e) {
      var cs = getComputedStyle(e);
      return { sel: sel(e), text: (e.textContent || "").trim().slice(0, 40), color: cs.color, bg: cs.backgroundColor, bgi: cs.backgroundImage.slice(0, 80), op: cs.opacity, parent: e.parentElement && sel(e.parentElement), cls: e.className, outer: e.outerHTML.slice(0, 160) };
    });
  }
  function main() {
    expandAll();
    probe();
    run("accessible-names", checkNames);
    run("text-contrast", function () { return checkContrastThemes(); });
    run("focus-indicator", checkFocus);
    run("target-size", checkTargets);
    run("structure", checkStructure);
    run("label-in-name", checkLabelInName);
    run("scroll-padding", checkScrollPadding);
    activateStates();
    run("text-contrast-selected", function () { return checkContrastThemes(); });
    if (window.axe) {
      var opts = { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }, resultTypes: ["violations"] };
      window.axe.run(document, opts).then(function (res) {
        out.axeVersion = window.axe.version;
        out.checks["axe"] = { problems: res.violations.map(function (v) { return v.id + " (" + v.impact + ", x" + v.nodes.length + "): " + v.nodes.slice(0, 2).map(function (n) { return n.target.join(" "); }).join(" | "); }) };
        finish();
      }, function (e) { out.checks["axe"] = { error: String(e) }; finish(); });
    } else {
      out.checks["axe"] = { skipped: "axe-core not found (set AXE_CORE_PATH or put axe.min.js in tests/a11y/vendor/)" };
      finish();
    }
  }
  setTimeout(main, 600);
})();
