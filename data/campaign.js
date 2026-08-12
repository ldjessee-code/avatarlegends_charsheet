/**
 * campaign.js — Default table / campaign branding (not playbook rules)
 *
 * This is the *package default* for this zip/repo (Iron and Ash).
 * Players can hide the banner or upload their own from Session notes
 * on the sheet; those choices save in the character JSON / browser storage.
 *
 * Edit this file only if you are redistributing a different default campaign.
 * Banner path is relative to pages under playbooks/ (so "../assets/...").
 * Keep default banners reasonably small so email zips stay light.
 */
window.AL = window.AL || {};

AL.CAMPAIGN = {
  /** Default display name (overridable on the sheet) */
  name: "Iron and Ash",
  /**
   * Default banner image. Empty string = no default art (players can still upload).
   * Path relative to playbooks/*.html
   */
  bannerSrc: "../assets/iron-and-ash-banner.png",
  /** Default caption under the banner */
  tagline: "Campaign session log"
};
