# T.1.1 — Personal kit, musical vocabulary and groove editor
Status: Done

## Goal
Apply the user's feedback on feat/codex_v2: a plain modern dark practice station for kick, snare/cross-stick, hi-hat, crash, ride/bell, one rack tom and floor tom.

## Acceptance criteria
- Enable authored reggae ghost/kick/swing variations, with an explicit kick + cross-stick on beats 2/4 option.
- Enable restrained bossa ghost/kick/swing variation; retain genre-specific limits elsewhere.
- Per-articulation musical vocabulary sliders and selectable replacements for unavailable auxiliary percussion; never output middle tom in personal-kit mode.
- Two-stick orchestration for automatic variants, distinct from freely editable user overrides with visible playability feedback.
- Full phrase grid editor, note dynamics, clear/reset, local save/restore and JSON import/export; no database.
- Recorded instruments respond to per-articulation pitch, decay, brightness, volume and pan.
- Update shared-domain GUI/CLI/MCP parity, meaningful tests, docs and tutorial; verify dark desktop/mobile UI and audio.

## Implementation concept
This detailed user request authorizes the work. Extend the shared arrangement pipeline with authored vocabulary tables, kit remapping, bounded orchestration and section-specific manual cell overrides. Keep the base library intact and use explicit variant metadata. Share local draft validation, mix/tuning normalization and composition through adapters. Keep only one rack tom plus floor tom in the personal kit. Tune actual WAV playback using rate/filter/envelope, retaining the original sound at neutral settings.

## Development notes
Started from a29dfef; main and feature/gemini_v1 remain unchanged.

## Validation
- `./Diagnostics/check.sh` passed: 32 tests, 7 parity features, 41 sample checks, real CLI/MCP stdio equality, TypeScript/Vite build and standalone asset/license validation (8.8 MiB).
- 1,536 automatic configurations across all grooves/sections check personal-kit membership, unique articulations and at most two simultaneous stick hits. Each individual voice-control stage must change the audible arrangement.
- Reggae tests protect explicit 2/4 anchors and eighth-swing timing; bossa tests protect its two-bar cross-stick while allowing restrained ghost/kick/sixteenth-swing responses. Afro bell density changes accents without adding timeline strokes.
- Real SampleKit graph tests verify pitched rates, shortened envelopes, lowpass cutoff, start-before-stop, hat choke and node cleanup.
- Browser verified reggae 2/4 playback with active ghost/kick/swing, bossa control ranges, full-kit cell editing, blank phrase/recovery, supported replacement selection, local save + reload preserving cells and pitch/decay, and tuned sample audition. Final fresh browser playback + recording of reggae 2/4 produced a WebM download and inline player with no console errors.
- Responsive 390×844: page width 384 equals viewport content width; 864 px two-bar score scrolls in a 334 px panel. Temporary viewport override reset.
- JSON parsing/roundtrip/normalization verified through domain, CLI and actual MCP transport. Browser filechooser was reached, but `setFiles` was denied by the Chrome extension's file access permission; direct GUI file selection requires a manual check. No permission setting was changed or bypassed.
- Standalone direct file:// playback retains the previously documented browser-policy testing limitation; artifact checks passed. No remote push/deployment requested.

## User test instructions
1. Select Reggae, choose “Stopa + cross-stick na 2 i 4”, add quiet ghosts/kick answers and swing, then play.
2. Use Mój zestaw to choose cowbell/conga replacements; Brzmienia to audition pitch/decay/volume/pan.
3. Open Edytuj pełną mapę, click cells, Shift+click for selected dynamics, or choose Pusta fraza. A/B/Fill select editable phrases while stopped.
4. Save locally, reload and load the draft. Export JSON and manually import it to verify the native file selection path. Save/export before changing groove/reset.

## Feedback and fixes
The previous v2 locked too many reggae/bossa controls and required percussion the user does not own. Supersedes the T.1 rule prohibiting all reggae kick additions; one-drop anchors remain until an explicit variant is selected.

## Closure
Implemented locally on feat/codex_v2, with a plain dark UI and no database/account/backend. Original main and feature/gemini_v1 remain untouched. Automatic composition is written vocabulary with constrained orchestration; unrestricted manual patterns retain user choices and display conflicts. Sound tuning changes the real recordings rather than only the legacy synthesizer.
