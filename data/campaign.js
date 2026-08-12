/**
 * campaign.js — Table / campaign branding (not playbook rules)
 *
 * Edit this file to rename the campaign or swap the banner image.
 * Banner path is relative to pages under playbooks/ (so "../assets/...").
 *
 * Keep banners reasonably small (this one is ~400KB) so email zips stay light.
 */
window.AL = window.AL || {};

AL.CAMPAIGN = {
  /** Display name on the Session notes section */
  name: "Iron and Ash",
  /**
   * Optional banner shown at the top of Session notes (when expanded).
   * Use a path relative to playbooks/*.html
   */
  bannerSrc: "../assets/iron-and-ash-banner.png",
  /** Short line under the banner */
  tagline: "Campaign session log"
};
