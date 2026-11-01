#!/usr/bin/env node
/* Accessibility tests for the Avatar Legends sheets (WCAG 2.2 AA target).
 * No dependencies: Node built-ins + a locally installed Chrome/Edge/Chromium.
 *   node tests/a11y/run-a11y.mjs [--json out.json] [--only substring]
 * Env: A11Y_BROWSER=<path to chrome/edge>, AXE_CORE_PATH=<path to axe.min.js> (optional; the axe test is
 * reported as SKIPPED, never as passed, when axe-core is absent). */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const args = process.argv.slice(2);
const argVal = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const only = argVal("--only");
const jsonOut = argVal("--json");
const probe = argVal("--probe");

function findBrowser() {
  const cands = [
    process.env.A11Y_BROWSER,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
}
function findAxe() {
  const cands = [process.env.AXE_CORE_PATH, path.join(here, "vendor", "axe.min.js")].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
}

const browser = findBrowser();
if (!browser) { console.error("No Chrome/Edge/Chromium found. Set A11Y_BROWSER."); process.exit(2); }
const axePath = findAxe();

function pages() {
  const list = ["index.html", "generate.html"];
  for (const f of fs.readdirSync(path.join(root, "playbooks")).sort()) if (f.endsWith(".html")) list.push("playbooks/" + f);
  for (const f of fs.readdirSync(path.join(root, "docs")).sort()) if (f.endsWith(".html")) list.push("docs/" + f);
  return list.filter((p) => !only || p.includes(only));
}

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json", ".md": "text/markdown" };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const send = (buf, type) => { res.writeHead(200, { "Content-Type": type, "Content-Length": buf.length }); res.end(buf); };
  if (u === "/__a11y/harness.js") return send(fs.readFileSync(path.join(here, "harness.js")), "text/javascript");
  if (u === "/__a11y/axe.min.js" && axePath) return send(fs.readFileSync(axePath), "text/javascript");
  const fp = path.normalize(path.join(root, u));
  if (!fp.startsWith(root) || fp.includes(path.sep + ".git" + path.sep) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); return res.end(); }
  let buf = fs.readFileSync(fp);
  const ext = path.extname(fp);
  if (ext === ".html") {
    let h = buf.toString("utf8");
    const inj = (axePath ? '<script src="/__a11y/axe.min.js"></script>' : "") + '<script src="/__a11y/harness.js"></script>';
    h = h.includes("</body>") ? h.replace("</body>", inj + "</body>") : h + inj;
    buf = Buffer.from(h);
  }
  send(buf, MIME[ext] || "application/octet-stream");
});

function scan(port, page, width) {
  const url = `http://127.0.0.1:${port}/${page}` + (probe ? "?probe=" + encodeURIComponent(probe) : "");
  // A throwaway profile keeps the run away from a browser the user already has open (needed on Windows/macOS).
  // Some Linux Chrome builds stall with --dump-dom plus a fresh profile, so there it is opt-in (A11Y_PROFILE=1).
  const useProfile = process.platform !== "linux" || process.env.A11Y_PROFILE;
  const profile = useProfile ? fs.mkdtempSync(path.join(process.env.TEMP || process.env.TMPDIR || "/tmp", "a11y-")) : null;
  const flags = ["--headless=new", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars", "--no-first-run", `--window-size=${width},1000`,
    "--virtual-time-budget=25000", "--dump-dom"];
  if (profile) flags.push(`--user-data-dir=${profile}`);
  if (process.platform === "linux") flags.push("--no-sandbox");
  // Async spawn: the static server lives in this process and must keep answering while the browser loads the page.
  return new Promise((resolve) => {
    const p = spawn(browser, [...flags, url], { stdio: ["ignore", "pipe", process.env.A11Y_DEBUG ? "inherit" : "ignore"] });
    let out = "";
    p.stdout.on("data", (d) => { out += d; });
    const timer = setTimeout(() => { p.kill(); }, process.env.A11Y_DEBUG ? 15000 : 120000);
    p.on("close", (code) => {
      clearTimeout(timer);
      if (profile) try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
      const m = /<script id="__a11y_out" type="application\/json">([\s\S]*?)<\/script>/.exec(out);
      resolve(m ? JSON.parse(m[1]) : { error: "no result from page (browser exit " + code + ")" });
    });
  });
}

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const rows = [];
let axeVersion = null;
for (const page of pages()) {
  const res = await scan(port, page, 1100);
  if (res.axeVersion) axeVersion = res.axeVersion;
  if (probe) { console.log(JSON.stringify(res.probe, null, 1)); continue; }
  if (res.error) { rows.push({ page, check: "page-load", status: "FAIL", problems: [res.error] }); continue; }
  for (const [check, v] of Object.entries(res.checks)) {
    if (v.skipped) rows.push({ page, check, status: "SKIP", problems: [v.skipped] });
    else if (v.error) rows.push({ page, check, status: "FAIL", problems: ["harness error: " + v.error.split("\n")[0]] });
    else rows.push({ page, check, status: v.problems.length ? "FAIL" : "PASS", problems: v.problems });
  }
}
server.close();

const count = (s) => rows.filter((r) => r.status === s).length;
for (const r of rows) {
  if (r.status === "FAIL") { console.log(`FAIL ${r.page} :: ${r.check}`); r.problems.slice(0, 6).forEach((p) => console.log("     - " + p)); if (r.problems.length > 6) console.log(`     ... +${r.problems.length - 6} more`); }
}
const byCheck = {};
for (const r of rows) { byCheck[r.check] = byCheck[r.check] || { PASS: 0, FAIL: 0, SKIP: 0 }; byCheck[r.check][r.status]++; }
console.log("\nPer check:");
for (const [k, v] of Object.entries(byCheck)) console.log(`  ${k.padEnd(18)} pass ${v.PASS}  fail ${v.FAIL}  skip ${v.SKIP}`);
console.log(`\nBrowser: ${browser}\naxe-core: ${axePath ? axeVersion || "found" : "NOT FOUND (axe tests skipped)"}`);
console.log(`TOTAL ${rows.length} tests: ${count("PASS")} passed, ${count("FAIL")} failed, ${count("SKIP")} skipped (${pages().length} pages)`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ axeVersion, rows }, null, 1));
process.exit(count("FAIL") ? 1 : 0);
