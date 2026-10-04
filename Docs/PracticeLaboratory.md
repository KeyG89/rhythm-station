# Optional practice laboratory

The button **Odkryj dodatki treningowe** under the score exposes three tools and a short explanation of each. `LaboratoryConfig.enabled` is false by default. Hiding the panel disables gap and ladder; snapshots remain in application memory until reload/close. Version-1 drafts without laboratory settings stay compatible and load with the tools off.

## Znikający groove

Choose audible and silent phrase counts (1–16 in shared configuration; common choices in the UI). A phrase is the entire current section: two-bar clave/bossa stays two bars. Drum attacks and the metronome disappear together. Keep playing and listen for the next one. Recorded tails can decay into silence; the first returned principal is on the boundary, with no preceding grace cue inside the silent phrase. The highlighted map continues to count. Count-in is still audible.

## Drabinka Complexity

Start at current Complexity. Every configured number of complete phrases (1–16), add one level, bounded by the selected genre and target. Song presets have levels 0–7: four learning stages, the reference at 4 and three further exercises. Tempo remains set; the separate Speed Trainer can change it if explicitly enabled. Set that trainer off for a fixed-tempo ladder. Manual Complexity changes, reset/song loading, or hiding the laboratory disables the ladder. Other controls, tuning and manual edits are retained and can deliberately modify a reference map.

Transitions use the audio clock, with anticipation for two 32nds even if the next score introduces its first drag. The ladder includes full intro/fill phrases in its phrase counter. Stopping/restarting begins from the current level and resets phrase counting.

## Porównanie A/B

**Zapamiętaj A/B** captures the validated draft: groove/song, tempo, controls, orchestration, notes/rudiments and mix/tuning. Snapshots survive switches between Map, Mój zestaw and Brzmienia. **Wczytaj A/B** stops playback, restores that draft and disables gap/ladder. The comparison shows changed cells on compatible grids and expanded stroke counts for each part; graces/triplets count as actual hits. Different meters are compared by whole-phrase counts, not matching cell numbers. This is a score comparison, not a microphone performance assessment. Export JSON if a version should survive reload/close. No database or new server storage.

## Shared inspection

```sh
npm run cli -- lab '{"config":{"enabled":true,"gap":true,"ladder":true,"audiblePhrases":2,"silentPhrases":1,"phrasesPerLevel":2,"targetLevel":4},"start":0,"max":7,"phrases":12}'
npm run cli -- compare '{"version":1,"id":"00","controls":{"complexity":0}}' '{"version":1,"id":"00","controls":{"complexity":4}}'
npm run cli -- song 00-5 '{"complexity":4}'
npm run cli -- inspect 14 '{"midTomDensity":2}' 100 '{"secondTom":true}'
```

MCP `inspect_practice_plan` takes the same `config`, `start`, `max` and `phrases`; `compare_practice_drafts` takes validated draft objects `a` and `b`. They are read-only, using the same functions as browser planning/comparison. Audio scheduling, browser memory capture and local JSON/file access are browser adapters. Headless plans show at most 64 phrases.
