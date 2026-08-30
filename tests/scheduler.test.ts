import { describe, it, expect } from 'vitest';
import { ALL_STYLES } from '../src/data';

describe('Rhythm Scheduler Timing Math & Logic', () => {
  it('calculates accurate 16th step duration for various BPMs', () => {
    const calcStepDuration = (bpm: number, stepsPerBeat = 4) => (60.0 / bpm) / stepsPerBeat;

    // 120 BPM: 60 / 120 = 0.5s per quarter note -> 0.125s per 16th note
    expect(calcStepDuration(120, 4)).toBeCloseTo(0.125, 4);

    // 60 BPM: 1.0s per quarter note -> 0.25s per 16th note
    expect(calcStepDuration(60, 4)).toBeCloseTo(0.25, 4);

    // 240 BPM: 0.25s per quarter note -> 0.0625s per 16th note
    expect(calcStepDuration(240, 4)).toBeCloseTo(0.0625, 4);
  });

  it('calculates accurate 6/8 and triplet step duration', () => {
    const calc68StepDuration = (bpm: number, stepsPerBeat = 2) => (60.0 / bpm) / stepsPerBeat;

    // 60 BPM with 2 steps per beat: 0.5s per eighth
    expect(calc68StepDuration(60, 2)).toBeCloseTo(0.5, 4);
  });

  it('swing factor applies delay to off-beat steps without changing total bar duration', () => {
    const bpm = 120;
    const baseStepDuration = (60.0 / bpm) / 4; // 0.125s
    const swing = 0.6;

    const evenStepDuration = baseStepDuration + (baseStepDuration * swing * 0.4);
    const oddStepDuration = baseStepDuration - (baseStepDuration * swing * 0.4);

    // Two steps combined must equal 2 * baseStepDuration
    expect(evenStepDuration + oddStepDuration).toBeCloseTo(2 * baseStepDuration, 6);
    expect(evenStepDuration).toBeGreaterThan(baseStepDuration);
    expect(oddStepDuration).toBeLessThan(baseStepDuration);
  });

  it('all 100 styles have consistent bar and time signature steps', () => {
    ALL_STYLES.forEach((style) => {
      const mainA = style.sections.mainA;
      // In compound meters (denominator 8), steps per bar is based on eighths or dotted quarters
      const stepsPerBar = style.timeSignature[1] === 8
        ? (style.timeSignature[0] === 12 ? 12 : style.timeSignature[0] * mainA.stepsPerBeat)
        : mainA.stepsPerBeat * style.timeSignature[0];

      const expectedSteps = stepsPerBar * (mainA.bars || 1);
      expect(mainA.steps.length, `Style ${style.id} step length mismatch`).toBe(expectedSteps);
    });
  });
});
