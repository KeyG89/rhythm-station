# Musical contract and implementation

## Identity before vocabulary

`src/domain/grooves.ts` is the source of truth for the twelve grooves. Each definition has an essential pattern, counting, three practice steps, tempo range, capabilities and authored additions for four density controls. There are no random note generators. Each enabled stage selects recorded, prearranged positions. `normalizeControls` clamps unsupported/out-of-range values, including non-finite values. The base library retains essential positions and velocity. The studio layer can explicitly transfer right-hand orchestration to ride, bell, crash or a tom response, while protecting the structural timeline and kick/snare accents. An open hi-hat substitutes the closed articulation at the same position; it never doubles the right-hand note.

| Groove | Protected identity | Permitted development |
|---|---|---|
| Straight Rock 8th | eighth hats, snare 2/4, kick 1/3 | eighth kick anticipations, isolated ghost notes, short hat answers |
| Funk 16th | sixteenth hand grid, syncopated kick, snare 2/4 | snare dialogue, single kick syncopations, pedal/shaker texture |
| Half-Time Hip-Hop | one snare accent on 3 | sparse anticipations, quiet answers, short hat endings |
| Shuffle | long-short eighth pairs, snare 2/4 | short-pair anticipations and foot independence |
| Jazz Swing | ride pattern, foot hat 2/4, quiet feathered kick | authored comping, light snare dialogue, ride answers |
| Reggae One Drop | kick/cross-stick on 3; no kick on 1 | offbeat hats, ghost responses, &4/&2 kick anticipations, eighth swing; explicit 2/4 variant |
| Bossa Nova | quiet kick ostinato; Brazilian two-bar cross-stick 3+2 | pedal hat, quiet tom/shaker adaptation, restrained ghost pickups, two extra kicks on 4; subtle sixteenth swing |
| Samba | fixed sixteenth samba kick ostinato | tambourine, conga, quiet snare touches; kick locked |
| Afro-Cuban Clave | son clave 3–2 across two bars, kick tumbao | conga/bell dialogue; kick/ghost locked |
| Afro 6/8 | groups 3+3; two-bar seven-stroke bell timeline | conga dialogue, sparse kick anticipation, internal eighths |
| Waltz 3/4 | downbeat kick, light 2/3 cross-stick | end-of-phrase response; never a fourth quarter |
| Balkan 7/8 | groups 2+2+3 | answers at group endings; asymmetric pulse stays fixed |

These are concrete drum-set teaching arrangements, not exhaustive definitions of entire musical cultures or Yamaha factory styles. A locked slider means it is incompatible with this lesson's chosen identity, not that musicians never use it in that genre.

## Personal-kit arrangement pipeline (T.1.1)

`src/domain/studio.ts` composes: base library → authored control stages → explicit reggae variant → articulation vocabulary → auxiliary voice remapping → two-stick orchestration → manual cell overrides. UI and adapters consume exactly this result. All positions are fixed in `VOCABULARY`; no probability adds notes. Ending remains sparse.

Available voices: kick, snare/cross-stick, closed/open/pedal hi-hat, crash, ride/bell, rack tom and floor tom. Middle tom is always mapped to rack tom in personal-kit mode. Clave defaults to cross-stick, cowbell to ride bell, high/low congas to rack/floor, shaker and tambourine to hi-hat. Supported alternatives are explicit and validated. Clave's five hits and the seven bell anchors retain their timeline; duplicate mapped articulations merge, not flam.

| Family | Final musical result of added voices |
|---|---|
| Rock / Funk | Sparse syncopated snare/cross-stick responses, one phrase crash, late rack/floor answer; ride/bell takes selected hat notes. Backbeats survive. |
| Half-time | Main snare remains on 3; a light response on 4, sparse kick pickup, no automatic hat rolls. |
| Shuffle / Jazz | All responses use the swung native grid. Jazz comping is light; ride/foot pulse and feathered kick remain recognizable. |
| Reggae | Ghosts at a2/a3/a4, kick answers on &4 then &2; strongest kick/cross-stick is 3 or explicitly 2/4. Hats lean on offbeats. Crash takes the lead hand on the main accent, not a third hand. |
| Bossa | Keep cross-stick `[0,6,12,20,26]`, kick ostinato and two bars. Quiet ghosts at a3/a4; optional kick on 4 in either bar. Extra hands are soft; swing affects sixteenth pickups, not base eighths. |
| Samba | Keep the full samba foot ostinato. Tom responses adapt conga texture; bell/hat accents are optional voices above the fixed feet. |
| Son clave | Keep the asymmetric 3–2 timeline; transfer clave to cross-stick and conga to toms. Hand conflicts favour the timeline, not arbitrary extra hits. |
| Afro 6/8 | Retain seven bell notes across two bars. Bell control accents 1, the second bar's main pulse and selected phrase tails; it never turns the timeline into continuous eighths. Other instruments answer within 3+3. |
| Waltz / Balkan | Phrase responses end within three quarters or 2+2+3 respectively. No extra beat or straightening of the long group. |

Right-hand ride, open-hat and crash gestures transfer an existing hand note at that position. Bell takes ride articulation there. Tom answers with snare/cross-stick can reclaim the lead hand. A stable priority resolves simultaneous conflicts: essential voices, then phrase crash/tom/snare/bell gestures and light texture. At most two hand hits plus independent feet remain. Snare/cross-stick, open/closed hat and ride/bell cannot coexist on the same step; open hat removes simultaneous pedal closure. At crowded settings a lower-priority optional contribution may yield to another voice; the score shows exactly what survives. Two simultaneous hand hits is a structural check, not a claim that every hand movement at every BPM is easy.

Individual slider stages are tested for an audible change. Free edits run after orchestration and intentionally retain the user's full choices, with visible playability feedback. Import strips out-of-phrase cells and invalid voices/values; last edit per cell wins. Local persistence is one validated draft plus JSON files, not a database.

## Recorded tuning

`src/domain/session.ts` owns mix/tuning bounds and versioned draft validation. Pitch ±4 semitones becomes playback rate `2 ** (semitones/12)`; it changes pitch and natural duration. A lowpass controls brightness. A gain envelope can shorten the sample to 35–100% of its natural pitched duration; neutral settings retain the recorded tail. Volume and pan use the actual channel nodes. Sample voices schedule start before stop, keep hi-hat choking and disconnect source/filter/gain on completion. Mix resets are atomic. Browser effects close AudioContext once on cleanup, including development refresh.

## Timing

`src/domain/timing.ts` defines denominator units, pulse groups, long-short pair durations and repeatable humanization. In simple meters BPM is quarter notes. In Afro 6/8 BPM is dotted quarters: one bar lasts two clicks, each click contains three eighths. Balkan 7/8 uses quarter BPM; its three grouped clicks last two, two and three eighths. Swing is the fraction of a pair spent on its first note (50% straight, 67% near triplets). Pair and bar durations stay constant. Reggae groups two sixteenth grid steps per eighth so the hat offbeat actually swings; other enabled sixteenth grids use one step per pair side. Humanization never changes the transport clock; only hand onsets and velocities, bounded by 12 ms.

The audio scheduler looks ahead 120 ms every 25 ms. Visual events and count-in labels follow actual audio time. A/B and Fill changes occur at complete phrase boundaries, preserving the correct side of clave. Background-tab clock stalls skip missed wall time without emitting a burst of missed bars. A fill retains the groove anchors and adds a small response; two-bar grooves retain two-bar fills.

## Sound

`src/domain/samples.ts` owns sample inventory and velocity/take selection. `SampleKit` decodes local WAVs, caches peak measurements, level-matches layers while retaining requested musical velocity, alternates snare hands and applies open-hat choke. Sam Greene/kinwie's Sonor subset has three kick layers, three left/right snare layer pairs and multiple cymbal/tom layers. VSCO supplies auxiliary instrument recordings. The master limiter also feeds recording.

Preparation uses pinned upstream revisions, curl and ffmpeg. Leading silence is trimmed at -55 dB; WAVs are mono 44.1 kHz/16-bit, at most five seconds. Empty conversion is rejected. `manifest.json` records source URL, license and output hash. `Diagnostics/check_samples.py` verifies actual non-silent audio, format, hashes and attribution. Credits disclose adapted middle tom and pitched low conga. The optional synthesizer is visibly identified, rather than silently substituted after sample errors.

## Domain parity

`grooveApi` returns the same arrangement/timing/sample decisions to CLI and three read-only SDK MCP tools. `scripts/check-adapters.mjs` launches the real stdio MCP server, calls the inspection tools, and compares all twelve arrangements to CLI and the shared core, including reggae variants, remapping, cell overrides, sound tuning and local draft normalization. `feature-parity.json` lists the evidence. Real-time AudioContext and MediaRecorder devices are browser adapters, not headless automation endpoints.

## Verification

- Unit tests run the real scheduler against a controlled audio clock and validate grouped count-in, swing, half-time backbeats, end handling and two-bar transitions.
- Library tests exercise all 256 combinations of four density controls per groove and protect essential anchors; validate Cuban vs Brazilian timelines, bar lengths, velocities and unique articulations.
- Studio tests check 1,536 automatic configurations for two-stick/mapped-voice constraints, each articulation stage for audible changes, reggae/bossa anchors, seven-stroke accents, editable sections and validated draft roundtrips. Audio graph tests exercise real SampleKit pitch/filter/envelope logic, start/stop ordering and hi-hat cleanup.
- Sample tests verify instrument coverage and recorded ghost-note/snare-hand selection.
- Speed Trainer tests call the production function, including duplicate-bar events and target/groove caps.
- Browser checks cover real loading/playback, enabled reggae/bossa sliders, the 2/4 reggae variant, cell edits, local save/reload and sample pitch/decay, variations/reset, grouped meters, mute/solo, recording and desktop/mobile layout; standalone artifact checks verify that all recordings and licenses are embedded and match the source hashes. Direct file:// browser validation is blocked by the browser URL policy; open the produced file manually for that final check.

## Teaching references

The exact variations are original authored exercises. References for established technique:
- Drumeo, [5 Styles Any Beginner Drummer Can Play](https://www.drumeo.com/beat/5-styles-beginner-drummers/) — straight/swing and Brazilian foot ostinato.
- Drumeo, [Introduction to Brazilian Grooves — Bossa Nova](https://www.drumeo.com/beat/the-bossa-nova/).
- Drumeo, [10 Fun Intermediate Drum Beats](https://www.drumeo.com/beat/intermediate-drum-beats/) — two-bar son clave and odd meters.
- Soundbrenner, [One drop](https://www.soundbrenner.com/blogs/articles/one-drop) — simultaneous beat-three accent and open beat one.

- Godfried Toussaint, [Classification and Phylogenetic Analysis of African Ternary Rhythm Timelines](https://cgm.cs.mcgill.ca/~godfried/teaching/mir-reading-assignments/Classification-and-Phylogenetic-Analysis-of-African-Ternary-Rhythm-Timelines.pdf) — seven-stroke bembé timeline.

## Maintenance

Change definitions and stages in the shared domain. Re-run tests, audio/hash diagnostics, adapter transport checks and standalone build. Check Docs/TutorialUX.md before significant tutorial changes. Use an item commit; never overwrite main or the preserved v1 branch.
