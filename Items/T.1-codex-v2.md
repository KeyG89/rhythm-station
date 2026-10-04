# T.1 — Codex v2: twelve essential grooves
Status: Done

## Goal
Preserve main as feature/gemini_v1; implement feat/codex_v2 as a percussion learning station.

## Acceptance criteria
- Exactly the twelve requested grooves, each with an essential pattern and learning guidance.
- Tempo, Complexity, Ghost notes, Kick density, Hi-hat density, Swing, Humanize use groove-specific capabilities and authored additions.
- Essential anchors survive every variation; reggae cannot acquire double kick or a downbeat kick.
- Correct quarter/dotted-quarter timing, swing ratios, 2-bar clave, 6/8 and 7/8 grouping.
- Recorded acoustic drums and auxiliary percussion, local assets, attribution and visible loading/failure state.
- Retain count-in, metronome, mute/solo practice, speed trainer, fills and recording.
- Shared domain exposed through GUI, CLI and MCP; parity diagnostic, meaningful tests, build and browser validation.

## Implementation concept
The user's detailed request authorizes this implementation. Use the existing React/TypeScript/Web Audio stack. Create an immutable essential library with explicitly authored three-stage note additions per groove/control. Render the generated pattern in the UI and send exactly that pattern to the scheduler. Load a small velocity-layer selection of Sam Greene's Sonor recordings and VSCO auxiliary percussion; convert to onset-trimmed PCM WAV for browser compatibility. Keep the legacy synth as an explicitly selected fallback.

## Development notes
Main was clean at 4909e5f. The preservation branch points to that exact commit.

## Validation
- `./Diagnostics/check.sh`: passed; 22 tests, 4 feature-parity entries, 41 actual sample format/non-silence/hash checks, CLI/real MCP stdio equality across all twelve grooves, TypeScript/Vite build and standalone artifact validation.
- Density invariants cover 256 combinations per groove (3,072 arrangements).
- Browser verified recorded playback, variation/ghost-note rendering, reset, mute practice, two-bar change queue, two-pulse 6/8 count-in and recording download/inline audio.
- Mobile viewport 390×844: no page overflow; long scores scroll inside their own panel. Desktop inspected visually. Temporary viewport override reset.
- Single HTML build: ~8.8 MiB, all 41 WAVs plus full licenses embedded, valid JS and no external code/styles/fonts. Direct file:// opening is blocked by the browser URL policy, so direct-file playback needs a manual check.
- `main` and `feature/gemini_v1` both retain exact commit 4909e5f92c1023ffb02d09360e851c9b2c63c26f. Branches created locally; no deployment or remote push requested.

## User test instructions
Select Reggae, inspect locked kick density, play with the other controls; reset to essence. Compare Shuffle and Jazz; count 6/8 in two groups and 7/8 as 2+2+3. Mute a limb and play it yourself.

## Feedback and fixes
See T.1.1 for the personal-kit editor and additional reggae/bossa controls. Its explicit variants supersede this item’s initial kick/ghost lockouts.

## Closure
Implemented and verified. Playback uses real recordings by default; sample load failure is visible and never silently changes to synthesis. No application secrets or global client configuration. Runtime browser devices remain browser adapters; domain automation is exposed locally through CLI/MCP.

Known sample adaptations are disclosed in credits: middle tom is Sonor TomClicks; low conga is pitch-shifted. Full sample-source license text is included. These are original teaching arrangements inspired by the PSR practice concept, not reproduced Yamaha ROM programs.
