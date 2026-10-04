# Recorded instrument credits

## Acoustic kit
Sam Greene — Sonor Force 3001, SFZ mapping/FLAC conversion by kinwie.
Source: https://github.com/sfzinstruments/SamsSonor
Pinned revision: ef3e32058924ed1c3335e86d03094d3f310a9104
License: Creative Commons Attribution-ShareAlike 4.0 International.
https://creativecommons.org/licenses/by-sa/4.0/
Full license: LICENSE-SamsSonor.txt.

The distributed subset is modified: leading silence trimmed at -55 dB, downmixed to mono, resampled to 44.1 kHz, converted to 16-bit PCM WAV, limited to five seconds. This modified acoustic sample subset remains CC-BY-SA-4.0. Velocity layers are selected rather than synthesized. Alternating snare takes are recorded left/right hands. Tom mid uses the source's pitched rack tom articulation; it is not a separate third tom recording.

## Auxiliary percussion
Versilian Studios / Sam Gossner and VSCO contributors — VSCO 2 Community Edition.
Source: https://github.com/sgossner/VSCO-2-CE
Pinned revision: 440300901dfe9275fd84e0b7763af1f8443ae62e
License: CC0 1.0 Universal (LICENSE-VSCO.txt).
Selected recordings: claves, cowbell, conga, tambourine and Camo's shaker.
The same format/onset conversion is applied. Conga low plays a conga recording at 0.82x pitch; it is not a separately recorded low conga. Snare/claves/cymbals are real recordings. The optional PSR synth mode uses the project's existing Web Audio synthesizer, not Yamaha ROM samples.

manifest.json records each local file, exact original URL, license and SHA-256.
Rebuild: python3 scripts/prepare-samples.py (curl and ffmpeg required).
No network access is required for playback when the app is served locally. The standalone HTML embeds the WAV files.

Optional Tom 2: `tom_mid` reuses the TomHigh recordings at runtime rate `2 ** (-3/12)`, a three-semitone reduction. It is a tonal adaptation of an acoustic recording, not a separate recorded tom. The manifest identifies this adaptation and the real source paths.
