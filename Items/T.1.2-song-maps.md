# T.1.2 — Rudiments, song practice maps and groovebox colors
Status: Done

## Authorization and concept
The user's detailed feedback authorizes implementation on feat/codex_v2. Extend shared notation with flam, drag and timed triplet strokes, a five-state cell cycle, and genre-specific authored ornament sliders. Add five researched, distinct song-inspired practice maps per groove with reference recording links, approximate tempo provenance and explicit adaptations. Keep the eleven-articulation personal kit, local drafts and no database. Color-code sections and instrument lanes in a clean dark groovebox UI.

## Acceptance criteria
- Cell cycle: single → ghost → drag → flam → rest; explicit triplet tool and erase/velocity controls.
- Drag has two quiet grace strokes before the main stroke; flam has one. Shared scheduling and adapter event expansion use the same timing, with principal accents retained.
- Ornament controls develop written phrase responses, preserve essential groove anchors, and avoid unrealistic simultaneous stick demands in automatic patterns.
- Exactly 60 selectable song maps, five per groove, with title, artist, sourced approximate BPM, YouTube recording and transparent meter/pulse/kit adaptations.
- Loading restores the map and its tempo together; later sliders and edits remain usable; local drafts preserve the preset and articulation.
- Distinct accessible section/lane colors, visible ornament notation and responsive score scrolling.
- CLI/MCP parity, tests, documentation, tutorial and full diagnostics; commit [T.1.2].

## Validation
- `./Diagnostics/check.sh`: passed — 42 tests in 9 files; nine feature-parity entries; 41 non-silent WAV/hash/license checks; real CLI/MCP transport parity for all 12 grooves, all 60 song maps and five click states; TypeScript/Vite production build; 8.9 MiB standalone with all recordings/licenses embedded; clean diff whitespace.
- Shared tests cover 480 automatic song configurations and 1,536 personal-kit base configurations. Each authored ornament stage changes every applicable base/song map; essential principal accents survive. Clock tests validate initial/loop grace anticipation and chronological dispatch when a long triplet overlaps later hats.
- Direct Chrome UI checks: real double-click on an existing snare → ghost; third click drag; fourth flam; fifth rest; four-cell triplet notation and playback; Figure It Out loads 108 BPM; Footprints loads 90.7 dotted-quarter BPM with its conversion/count; Superstition treats its 60% swing as the map baseline; compound ballad bell stages transfer actual hat/ride notes. No captured console errors.
- Local save → reload → restore retains Footprints, 90.7 BPM and a four-cell custom triplet. Desktop colored rows/sections inspected; 390×844 mobile score and song bank inspected. Page width stays within viewport while the two-bar score scrolls internally; temporary viewport restored.
- Research and limitations: 60 linked references and tempo provenance in Docs/SongMaps.md. Maps are simplified, authored teaching exercises, not full transcriptions; jazz/compound and 7/4→7/8 adaptations are explicit, as are approximate/live tempo differences. No song audio is bundled. The standalone's hashes/script/license embedding pass; direct file:// browser playback remains unavailable under the browser URL policy and needs manual opening.
- GUI, CLI, six read-only MCP tools, v1-compatible local drafts, README, developer cockpit and parity evidence updated. App version 2.2.0. All work stays on feat/codex_v2; main and feature/gemini_v1 retain 4909e5f.
