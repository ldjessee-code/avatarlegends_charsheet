/**
 * version.js — Single display version for the app (hub, sheets, docs).
 *
 * Scheme (high level):
 *   0.5  — first local digital sheets
 *   1.0  — published on GitHub Pages
 *   1.x  — feature expansion (playbooks, JSON, offline pack, etc.)
 *   2.0  — accessibility overhaul (landmarks, ARIA, alt, focus, live status)
 *   2.x  — smaller updates after 2.0
 *
 * This is NOT the same as JSON exportFormat (file layout 2, 3, …).
 *
 * Bump this string when you ship a user-visible change; add a line to
 * docs/revision-history.md (past changes only — no future roadmap).
 */
window.AL = window.AL || {};
AL.VERSION = "2.3";
