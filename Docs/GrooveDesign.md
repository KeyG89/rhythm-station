# Musical contract and implementation

## Identity before vocabulary

`src/domain/grooves.ts` is the source of truth for the twelve grooves. Each definition has an essential pattern, counting, three practice steps, tempo range, capabilities and authored additions for four density controls. There are no random note generators. Each enabled stage selects recorded, prearranged positions. `normalizeControls` clamps unsupported/out-of-range values, including non-finite values. Essential events retain positions and velocity. An open hi-hat substitutes the closed articulation at the same position; it never doubles the right-hand note.

| Groove | Protected identity | Permitted development |
|---|---|---|
| Straight Rock 8th | eighth hats, snare 2/4, kick 1/3 | eighth kick anticipations, isolated ghost notes, short hat answers |
| Funk 16th | sixteenth hand grid, syncopated kick, snare 2/4 | snare dialogue, single kick syncopations, pedal/shaker texture |
| Half-Time Hip-Hop | one snare accent on 3 | sparse anticipations, quiet answers, short hat endings |
| Shuffle | long-short eighth pairs, snare 2/4 | short-pair anticipations and foot independence |
| Jazz Swing | ride pattern, foot hat 2/4, quiet feathered kick | authored comping, light snare dialogue, ride answers |
| Reggae One Drop | kick/cross-stick on 3; no kick on 1 | offbeat hats, cross-stick anticipation, shaker; kick/ghost sliders locked |
| Bossa Nova | quiet kick ostinato; Brazilian two-bar cross-stick 3+2 | pedal hat, quiet conga/shaker, restrained hand pickups; kick/ghost locked |
| Samba | fixed sixteenth samba kick ostinato | tambourine, conga, quiet snare touches; kick locked |
| Afro-Cuban Clave | son clave 3–2 across two bars, kick tumbao | conga/bell dialogue; kick/ghost locked |
| Afro 6/8 | groups 3+3; two-bar seven-stroke bell timeline | conga dialogue, sparse kick anticipation, internal eighths |
| Waltz 3/4 | downbeat kick, light 2/3 cross-stick | end-of-phrase response; never a fourth quarter |
| Balkan 7/8 | groups 2+2+3 | answers at group endings; asymmetric pulse stays fixed |

These are concrete drum-set teaching arrangements, not exhaustive definitions of entire musical cultures or Yamaha factory styles. A locked slider means it is incompatible with this lesson's chosen identity, not that musicians never use it in that genre.

## Timing

`src/domain/timing.ts` defines denominator units, pulse groups, long-short pair durations and repeatable humanization. In simple meters BPM is quarter notes. In Afro 6/8 BPM is dotted quarters: one bar lasts two clicks, each click contains three eighths. Balkan 7/8 uses quarter BPM; its three grouped clicks last two, two and three eighths. Swing is the fraction of a pair spent on its first note (50% straight, 67% near triplets). Pair and bar durations stay constant. Humanization never changes the transport clock; only hand onsets and velocities, bounded by 12 ms.

The audio scheduler looks ahead 120 ms every 25 ms. Visual events and count-in labels follow actual audio time. A/B and Fill changes occur at complete phrase boundaries, preserving the correct side of clave. Background-tab clock stalls skip missed wall time without emitting a burst of missed bars. A fill retains the groove anchors and adds a small response; two-bar grooves retain two-bar fills.

## Sound

`src/domain/samples.ts` owns sample inventory and velocity/take selection. `SampleKit` decodes local WAVs, caches peak measurements, level-matches layers while retaining requested musical velocity, alternates snare hands and applies open-hat choke. Sam Greene/kinwie's Sonor subset has three kick layers, three left/right snare layer pairs and multiple cymbal/tom layers. VSCO supplies auxiliary instrument recordings. The master limiter also feeds recording.

Preparation uses pinned upstream revisions, curl and ffmpeg. Leading silence is trimmed at -55 dB; WAVs are mono 44.1 kHz/16-bit, at most five seconds. Empty conversion is rejected. `manifest.json` records source URL, license and output hash. `Diagnostics/check_samples.py` verifies actual non-silent audio, format, hashes and attribution. Credits disclose adapted middle tom and pitched low conga. The optional synthesizer is visibly identified, rather than silently substituted after sample errors.

## Domain parity

`grooveApi` returns the same arrangement/timing/sample decisions to CLI and two read-only SDK MCP tools. `scripts/check-adapters.mjs` launches the real stdio MCP server, calls both tools, and compares all twelve arrangements to CLI and the shared core, including unsupported reggae controls. `feature-parity.json` lists the evidence. Real-time AudioContext and MediaRecorder devices are browser adapters, not headless automation endpoints.

## Verification

- Unit tests run the real scheduler against a controlled audio clock and validate grouped count-in, swing, half-time backbeats, end handling and two-bar transitions.
- Library tests exercise all 256 combinations of four density controls per groove and protect essential anchors; validate Cuban vs Brazilian timelines, bar lengths, velocities and unique articulations.
- Sample tests verify instrument coverage and recorded ghost-note/snare-hand selection.
- Speed Trainer tests call the production function, including duplicate-bar events and target/groove caps.
- Browser checks cover real loading/playback, reggae slider lockouts, variations/reset, grouped meters, mute/solo, recording and desktop/mobile layout; standalone artifact checks verify that all recordings and licenses are embedded and match the source hashes. Direct file:// browser validation is blocked by the browser URL policy; open the produced file manually for that final check.

## Teaching references

The exact variations are original authored exercises. References for established technique:
- Drumeo, [5 Styles Any Beginner Drummer Can Play](https://www.drumeo.com/beat/5-styles-beginner-drummers/) — straight/swing and Brazilian foot ostinato.
- Drumeo, [Introduction to Brazilian Grooves — Bossa Nova](https://www.drumeo.com/beat/the-bossa-nova/).
- Drumeo, [10 Fun Intermediate Drum Beats](https://www.drumeo.com/beat/intermediate-drum-beats/) — two-bar son clave and odd meters.
- Soundbrenner, [One drop](https://www.soundbrenner.com/blogs/articles/one-drop) — simultaneous beat-three accent and open beat one.

- Godfried Toussaint, [Classification and Phylogenetic Analysis of African Ternary Rhythm Timelines](https://cgm.cs.mcgill.ca/~godfried/teaching/mir-reading-assignments/Classification-and-Phylogenetic-Analysis-of-African-Ternary-Rhythm-Timelines.pdf) — seven-stroke bembé timeline.

## Maintenance

Change definitions and stages in the shared domain. Re-run tests, audio/hash diagnostics, adapter transport checks and standalone build. Check Docs/TutorialUX.md before significant tutorial changes. Use an item commit; never overwrite main or the preserved v1 branch.
