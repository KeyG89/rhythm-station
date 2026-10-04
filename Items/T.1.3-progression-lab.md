# T.1.3 — Song progression, expanded grooves and practice laboratory
Status: Done

## Goal / authorization
The user explicitly requests this implementation on feat/codex_v2. Progress song-specific Complexity from a simplified skeleton to the referenced section, then clearly labeled optional genre developments. Expand to 15 genres (5/4, single-pedal metal with Sepultura, tom-led grooves with optional second rack tom), retain five songs each, add Spotify, and improve drag anticipation. Add three useful training functions behind a default-off laboratory button. No database.

## Concept and acceptance
- Written song-specific learning milestones, stage descriptions and reference groove provenance. Closer-to-recording stages distinguish verse/chorus and any kit/meter adaptation; no claim of a complete transcription.
- Complexity has more authored levels in both presets and base grooves; original-oriented stages never silently add unrelated genre texture.
- Drag uses two distinct straight 32nds before its principal onset, locked to musical tempo; scheduler anticipates them safely at starts, loops and changes.
- 15 grooves and 75 song references; rock bank has one Royal Blood entry. Spotify recording links (or clearly labeled search fallback if unavailable), artist/title, tempo/source and YouTube.
- Second rack tom selectable and tuned in personal-kit/editor, automatic use reserved for Tom Groove. All automatic combinations maintain two-hand constraints and metal does not introduce double-pedal sequences.
- Laboratory flag exposes gap practice, automatic Complexity ladder and A/B snapshots with short descriptions, shared domain behavior, CLI/MCP parity, meaningful timing/persistence tests.
- Update docs, tutorial, parity and full diagnostics; verify desktop/mobile interactions and commit [T.1.3].

## Validation
- Full `./Diagnostics/check.sh` passed: 54 tests in 11 files, 12 feature-parity entries, 41 real WAV hashes/format/non-silence/attribution, real SDK MCP stdio parity for 15 grooves and 75 song presets, both laboratory tools, optional Tom 2 and cell transitions. TypeScript/Vite and standalone validation passed.
- Every exposed base Complexity stage and all 600 song-learning stages changes the map; reference foot subsets, Nirvana's Drumeo chorus bar, single-pedal metal and optional Tom 2 are checked. 1,920 automatic base configurations and 600 preset combinations maintain the tested hand/voice constraints.
- Controlled-clock tests cover two distinct 32nds before starts/loops, slow-tempo ladder introductions, full silent phrases without anticipatory return cues, full two-bar ladder boundaries, manual disabling of queued ladder changes, 5/4 grouped count-in and old draft compatibility.
- All 75 entries have direct Spotify track URLs and YouTube links, BPM provenance and reference section/recording notes. Rock has one Royal Blood track; Sepultura Roots Bloody Roots and Refuse/Resist are included. Nirvana was checked against the middle chorus bar of Drumeo Level 5. Other loops disclose adaptations and do not claim complete exact transcriptions.
- Browser QA at desktop and 390×844: Nirvana 0→4, LAB discovery/default off, actual playback with prepared acoustic samples, gap status and ladder reaching 4, A/B capture across sound/map tabs, stopped recall with disabled gap/ladder, Tom 2 enabled/disabled mapping, Sepultura load at 123, Take Five at 176 and mobile cards/YouTube/Spotify layout. Fresh-load console had no warnings/errors; viewport restored and preview retained.
- Final visual QA caught and fixed an existing omission of Crash from the automatic score's display ordering. The Nirvana crash on step 1 is now visibly present. Rebuilt/validated standalone after the display fix.
- `dist/standalone_yamaha.html` contains 41 recordings and full credits/licenses (9.2 MiB), with no external code/CSS/fonts. Direct file:// browser execution remains unverified because the browser URL policy blocks that scheme; artifact syntax, embedded WAV hashes and license contents are validated.
- Updated MasterPlan, README, musical contract, 75-song source catalog, laboratory guide, developer cockpit and parity evidence. Local main/feature/gemini_v1 remain at 4909e5f; work is on feat/codex_v2.

## Result
Version 2.3.0: 15 grooves, song-specific progression through reference level 4 and exercises 5–7, tempo-based drag anticipation, direct recording links, optional tuned second tom and default-off gap/ladder/A-B practice tools. No database or external publishing.
