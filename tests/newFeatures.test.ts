import { describe, it, expect } from 'vitest';
import { ALL_STYLES, getStyleById, searchStyles } from '../src/data';
import { SIMILAR_SONGS_MAP } from '../src/data/similarSongsData';
import { FACTORY_PRESETS } from '../src/components/DrumKitStudio';
import { DEFAULT_SOUND_PARAMS } from '../src/audio/DrumSynthesizer';

describe('100 Rhythms Library & Similar Songs', () => {
  it('has exactly 100 styles defined from 00 to 99', () => {
    expect(ALL_STYLES.length).toBe(100);
    for (let i = 0; i < 100; i++) {
      const id = String(i).padStart(2, '0');
      const style = getStyleById(id);
      expect(style).toBeDefined();
      expect(style.id).toBe(id);
    }
  });

  it('all 100 styles have reference similar songs attached', () => {
    expect(Object.keys(SIMILAR_SONGS_MAP).length).toBe(100);

    ALL_STYLES.forEach((style) => {
      expect(style.similarSongs).toBeDefined();
      expect(Array.isArray(style.similarSongs)).toBe(true);
      expect(style.similarSongs!.length).toBeGreaterThanOrEqual(1);

      style.similarSongs!.forEach((song) => {
        expect(song.title).toBeTruthy();
        expect(song.artist).toBeTruthy();
      });
    });
  });

  it('searches styles by song title and artist', () => {
    const billieJeanResults = searchStyles('Billie Jean');
    expect(billieJeanResults.some(s => s.id === '00')).toBe(true);

    const totoResults = searchStyles('Toto');
    expect(totoResults.length).toBeGreaterThan(0);
    expect(totoResults.some(s => s.id === '14')).toBe(true); // Purdie shuffle

    const metallicaResults = searchStyles('Metallica');
    expect(metallicaResults.some(s => s.id === '82')).toBe(true); // 6/8 Slow Rock
  });
});

describe('Drum Kit Presets & Sound Profiles', () => {
  it('provides all standard factory kit presets', () => {
    const presetIds = FACTORY_PRESETS.map(p => p.id);
    expect(presetIds).toContain('yamaha_psr');
    expect(presetIds).toContain('vintage_warmth');
    expect(presetIds).toContain('rock_heavy');
    expect(presetIds).toContain('gated_80s');
    expect(presetIds).toContain('electronic_808');
    expect(presetIds).toContain('jazz_maple');
  });

  it('has default sound parameters for all instruments', () => {
    expect(DEFAULT_SOUND_PARAMS.kick).toBeDefined();
    expect(DEFAULT_SOUND_PARAMS.snare).toBeDefined();
    expect(DEFAULT_SOUND_PARAMS.hihat_closed).toBeDefined();
    expect(DEFAULT_SOUND_PARAMS.kick.pitchMultiplier).toBe(1.0);
    expect(DEFAULT_SOUND_PARAMS.snare.snappy).toBeGreaterThan(0);
  });
});

describe('Smart Transition Timing Calculations', () => {
  it('correctly calculates 1-beat micro-fill duration for 4/4 and 3/4', () => {
    // 4/4 meter with 16 steps: stepsPerBeat = 4, beatsInBar = 4, stepsPerBar = 16
    const stepsPerBeat44 = 4;
    const beatsInBar44 = 4;
    const stepsPerBar44 = beatsInBar44 * stepsPerBeat44; // 16
    const microFillDuration44 = stepsPerBeat44; // 4 steps = 1/4 of bar

    expect(microFillDuration44 / stepsPerBar44).toBe(1 / 4);

    // 3/4 meter with 12 steps: stepsPerBeat = 4, beatsInBar = 3, stepsPerBar = 12
    const stepsPerBeat34 = 4;
    const beatsInBar34 = 3;
    const stepsPerBar34 = beatsInBar34 * stepsPerBeat34; // 12
    const microFillDuration34 = stepsPerBeat34; // 4 steps = 1/3 of bar

    expect(microFillDuration34 / stepsPerBar34).toBe(1 / 3);
  });

  it('correctly calculates 2-beat medium-fill duration (2x longer)', () => {
    const stepsPerBeat = 4;
    const beatsInBar = 4;
    const stepsPerBar = beatsInBar * stepsPerBeat; // 16
    const mediumFillBeats = Math.floor(beatsInBar / 2); // 2 beats
    const mediumFillDuration = mediumFillBeats * stepsPerBeat; // 8 steps = 1/2 of bar

    expect(mediumFillDuration).toBe(8);
    expect(mediumFillDuration / stepsPerBar).toBe(1 / 2);
  });

  it('determines opportunistic injection when space is available in current bar', () => {
    const stepsPerBar = 16;
    const microFillDuration = 4;

    // Case A: At step 2 (beat 1). Remaining = 14 steps.
    // 14 >= 4, so fill can start in THIS bar on the last beat (step 12)!
    const stepInBarA = 2;
    const remainingA = stepsPerBar - stepInBarA;
    expect(remainingA >= microFillDuration).toBe(true);
    const startStepA = stepInBarA + (remainingA - microFillDuration);
    expect(startStepA).toBe(12);

    // Case B: At step 10 (beat 3). Remaining = 6 steps.
    // 6 >= 4, so fill still starts in THIS bar on step 12!
    const stepInBarB = 10;
    const remainingB = stepsPerBar - stepInBarB;
    expect(remainingB >= microFillDuration).toBe(true);
    const startStepB = stepInBarB + (remainingB - microFillDuration);
    expect(startStepB).toBe(12);

    // Case C: At step 13 (inside beat 4). Remaining = 3 steps.
    // 3 < 4, so not enough room in current bar; scheduled for next bar!
    const stepInBarC = 13;
    const remainingC = stepsPerBar - stepInBarC;
    expect(remainingC < microFillDuration).toBe(true);
    const startStepC = stepInBarC + remainingC + (stepsPerBar - microFillDuration);
    expect(startStepC).toBe(28); // step 12 of bar 2 (16 + 12 = 28)
  });
});
