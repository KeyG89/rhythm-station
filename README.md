# Groove Lab — Codex v2

A Yamaha PSR-220/230-inspired percussion practice station with **twelve distinct essential grooves**. Start with the musical skeleton, then develop it through explicitly authored vocabulary. The interface and learning prompts are in Polish.

The previous 100-style application is preserved at local branch `feature/gemini_v1` (main commit `4909e5f`). This version lives on `feat/codex_v2`; main is unchanged.

## Run

Node.js 18+ and npm. Dependencies are local to the project.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To access it from a phone/tablet on the same network, use `npm run dev -- --host 0.0.0.0` and the computer's LAN IP. Audio begins after a click. First playback loads the bundled recordings; a failed load is visible and can be retried. The optional PSR synthesizer is explicitly selectable.

```sh
npm test
npm run diagnostics
npm run test:adapters
npm run build:standalone
```

`dist/` is the production site. `dist/standalone_yamaha.html` is a single file with **all recordings and license text embedded**; open it directly for offline use. No CDN or remote fonts are needed for playback. Source/credit links are optional external links.

## Collection

1. Straight Rock 8th
2. Funk 16th
3. Half-Time Hip-Hop
4. Shuffle
5. Jazz Swing
6. Reggae One Drop
7. Bossa Nova
8. Samba
9. Afro-Cuban Clave (son 3–2)
10. Afro 6/8
11. Waltz 3/4
12. Balkan 7/8 (2+2+3)

## Practice

Choose a groove, press **Graj groove**, and follow its counting and three lesson steps. Blue notes are the essential identity; green notes are optional vocabulary; `g` means a quiet ghost note. Mute a part with M and play it yourself; S solos a part. Clicking the instrument name auditions it. Practice buttons mute kick, snare/cross-stick or hi-hat together.

Tempo has groove-specific bounds. Complexity, Ghost notes, Kick density and Hi-hat density choose cumulative authored stages; their descriptions explain the musical action. Swing changes the long-short ratio; 67% approximates triplet eighths. Humanize adds bounded, repeatable hand timing and small velocity changes while drum anchors remain on the pulse. Unsupported controls are disabled with a reason. Reggae allows eighth-note swing (50–62%); bossa permits subtle sixteenth-note swing (50–56%) and restrained ghost/kick answers. Reset restores the original pattern, its default tempo and A variation.

While stopped, A/B/Fill selects a phrase for inspection/editing without starting audio. During playback, A/B and Fill changes wait for a complete phrase, including both bars of clave/bossa. Fills are restrained style-specific responses. Speed Trainer gradually increases BPM and respects the selected groove's maximum. Changing/resetting the groove disables Speed Trainer. Recording saves only the application's audible output, including its mixer and metronome; it does not record a microphone. Output format follows the browser (usually WebM, or M4A on Safari), with an inline playback control.

Shortcuts: Space play/stop; C count-in; M metronome; F fill; V A/B; T tap tempo; Up/Down ±1 BPM, Shift ±5; Esc stop. Inputs retain their normal keyboard controls.

## Personal kit and own grooves

The default kit contains kick, snare, cross-stick, closed/open/pedal hi-hat, crash, ride, ride bell, **one rack tom and floor tom**. Every articulation has a musical vocabulary slider. Sliders select written phrases, with one crash accent, short tom responses and right-hand transfers to ride/bell; combinations are orchestrated for at most two simultaneous hand hits. Base accents win conflicts. In Afro 6/8 the bell slider changes the accents of the complete seven-stroke timeline instead of filling its gaps. Zero restores that control's contribution to the base, rather than muting an essential part (use M to mute).

Reggae has an explicit **One Drop / kick + cross-stick on 2 and 4** selector. Additional kicks are sparse &4/&2 answers, never continuous doubles. Bossa retains its Brazilian two-bar cross-stick while allowing quiet snare touches and two extra kick responses. Samba's already dense foot ostinato stays fixed.

**Mój zestaw** maps clave to cross-stick, cowbell to ride bell, congas to tom/floor, shaker/tambourine to hi-hat. Choose supported alternate mappings there, or audition the original percussion for comparison. Mapping changes the voice, not the written timeline. Entering the editor switches to the personal kit.

**Edytuj pełną mapę** exposes all eleven articulation rows across the entire phrase. Click a cell to add/remove a hit; Shift+click sets its velocity to the selected ghost/light/medium/accent value. **Pusta fraza** clears the selected phrase so you can build it yourself. A/B/Fill edits are independent. Edits override automatic sliders, including explicit removals; **Cofnij własne nuty** restores automatic arrangements. Free editing retains your notes and reports simultaneous hand/articulation conflicts; it does not silently change them. It does not guarantee a user-written phrase is idiomatic at every tempo.

**Zapisz lokalnie** stores one practice draft in this browser; **Wczytaj zapis** restores it after reload. JSON export/import transfers named files containing the groove ID, tempo, controls, mapping, section-specific cells and sound settings. Import validates version, meter bounds and allowed instruments. No database, account or server storage. Changing a groove/reset returns to its base; save/export edits before changing it.

**Brzmienia** offers volume, pitch ±4 semitones, decay 35–100%, brightness and pan for each articulation, plus audition/reset. These affect actual recorded WAV playback. Pitch also changes natural sample duration; decay shortens the tail, not time-stretching it. Changes apply to subsequent hits. Mute/solo continues to affect audition/playback. Local drafts include tuning.

## Recorded instruments

41 local PCM WAV recordings (~6.4 MiB): acoustic Sonor drums/cymbals by Sam Greene, with dynamic layers and alternating snare hands; VSCO claves, congas, cowbell, tambourine and shaker. Hi-hat closure chokes the open recording. Master limiting protects the mix.

The acoustic sample subset is CC-BY-SA-4.0; VSCO is CC0. The modified recordings, exact upstream paths, conversion process and SHA-256 hashes are documented in [sample credits](public/samples/CREDITS.md) and `public/samples/manifest.json`. The low conga is a pitched articulation of the same conga recordings; the middle tom uses Sonor's TomClicks articulation. These are documented adaptations, not separate instrument recordings. This is not a dump of Yamaha ROM sounds.

## Shared domain and automation

The browser, CLI and MCP share authored groove/control, kit orchestration, cell editing, draft validation, sound tuning, timing and sample-selection functions. CLI/MCP return arrangements, timed note events, instrument sample choices, control capabilities and lessons; real-time browser audio, recording, file pickers and localStorage remain browser adapters. CLI `draft <draft JSON>` and MCP `inspect_draft` validate and inspect exported drafts without mutating storage.

```sh
npm run cli -- list
npm run cli -- inspect 05 '{"ghostNotes":2,"kickDensity":2,"tomDensity":1}' 75 '{"reggaeVariant":"two-four"}' '{"kick":{"pitch":-2,"decay":0.6}}'
npm run build:adapters
node scripts/groove-mcp.mjs
```

For an MCP client use command `node` and the absolute path to `scripts/groove-mcp.mjs`, after `npm run build:adapters`. Do not launch through `npm run mcp` in a client: npm's command banners can interfere with stdio. Tools: `list_grooves`, `inspect_groove`, `inspect_draft`. No credentials or network services are required. Nothing is installed into global client configuration.

Design and validation: [GrooveDesign](Docs/GrooveDesign.md), [MasterPlan](MasterPlan.md), [developer cockpit](Tutorial/index.html).
