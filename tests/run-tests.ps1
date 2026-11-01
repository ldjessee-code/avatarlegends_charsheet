<#
 Runs the accessibility test suite (WCAG 2.2 AA target) against every page.
 Run from the repo root, e.g. in C:\Users\DougJ\Documents\GitHub\avatarlegends_charsheet:
   pwsh -File tests\run-tests.ps1
 Needs Node 18+ and Chrome or Edge. No npm install. Optional: put axe-core's axe.min.js in
 tests\a11y\vendor\ (git-ignored) or set AXE_CORE_PATH to enable the axe test; without it that test shows SKIPPED.
 Exit code is 0 only when no test failed.
#>
param([string]$Only = "", [string]$Json = "")
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Error "Node.js is required (18 or newer)."; exit 2 }
$argv = @("tests/a11y/run-a11y.mjs")
if ($Only) { $argv += @("--only", $Only) }
if ($Json) { $argv += @("--json", $Json) }
& node @argv
exit $LASTEXITCODE
