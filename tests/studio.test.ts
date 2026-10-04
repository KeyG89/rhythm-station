import { describe, expect, it } from 'vitest';
import { stepDuration } from '../src/domain/timing';
import { GROOVES } from '../src/domain/grooves';
import { composeGroove, defaultStudioControls, KIT, normalizeOptions, playability, REPLACEMENT_CHOICES, setCell, studioCapabilities, VOICE_CONTROLS } from '../src/domain/studio';
import { normalizeDraft, normalizeMix, sampleTuning, serializeDraft } from '../src/domain/session';
const notes = (id: string, inst: string, controls = {}, options = {}) => composeGroove(id, controls, options).sections.mainA.steps.flatMap((s, i) => s.some(h => h.instrument === inst) ? [i] : []);
describe('Personal-kit musical studio', () => {
  it('only uses the personal kit with all vocabulary and respects two sticks across 1,536 control configurations', () => {
    for (const g of GROOVES) {
      const caps = studioCapabilities(g.style.id);
      for (let config = 0; config < 128; config++) {
        const controls = Object.fromEntries(Object.entries(caps).map(([key, cap], i) => [key, config === 0 ? cap.max : (config * (i + 3) + i) % (cap.max + 1)]));
        const s = composeGroove(g.style.id, controls, { reggaeVariant: config % 2 ? 'two-four' : 'one-drop' });
        for (const section of Object.keys(s.sections) as (keyof typeof s.sections)[]) {
          expect(playability(s, section), `${g.style.name}, ${config}, ${section}`).toEqual([]);
          for (const step of s.sections[section].steps) {
            expect(new Set(step.map(h => h.instrument)).size).toBe(step.length);
            expect(step.every(h => KIT.includes(h.instrument as typeof KIT[number]))).toBe(true);
          }
        }
      }
    }
  });
  it('each individual instrument stage makes an audible change, rather than a decorative slider', () => {
    for (const g of GROOVES) for (const key of Object.keys(VOICE_CONTROLS) as (keyof typeof VOICE_CONTROLS)[]) {
      let previous = composeGroove(g.style.id).sections.mainA.steps;
      for (let stage = 1; stage <= studioCapabilities(g.style.id)[key].max; stage++) {
        const next = composeGroove(g.style.id, { [key]: stage }).sections.mainA.steps;
        expect(next, `${g.style.name}: ${key} ${stage}`).not.toEqual(previous);
        previous = next;
      }
    }
  });
  it('keeps the requested reggae 2/4 anchors distinct from one drop, with ghost, kick and swing enabled', () => {
    expect(notes('05', 'kick')).toEqual([8]);
    expect(notes('05', 'kick', {}, { reggaeVariant: 'two-four' })).toEqual([4, 12]);
    expect(notes('05', 'rimshot', {}, { reggaeVariant: 'two-four' })).toEqual([4, 12]);
    const s = composeGroove('05', { ghostNotes: 3, kickDensity: 2, swing: 61 }, { reggaeVariant: 'two-four' });
    expect(s.sections.mainA.swingRatio).toBe(61);
    expect(stepDuration(s, s.sections.mainA, 60, 0) + stepDuration(s, s.sections.mainA, 60, 1)).toBeCloseTo(0.61);
    expect(Array.from({ length: 4 }, (_, i) => stepDuration(s, s.sections.mainA, 60, i)).reduce((a,b) => a+b, 0)).toBeCloseTo(1);
    expect(s.sections.mainA.steps[0].some(h => h.instrument === 'kick')).toBe(false);
    expect(s.sections.mainA.steps.flat().filter(h => h.role === 'ghost').length).toBeGreaterThan(0);
    expect(notes('05', 'kick', { kickDensity: 2 }, { reggaeVariant: 'two-four' })).toEqual([4, 6, 12, 14]);
  });
  it('retains the Brazilian phrase while bossa gains quiet ghosts, two kick answers and subtle swing', () => {
    const s = composeGroove('06', { ghostNotes: 2, kickDensity: 2, swing: 99 });
    expect(notes('06', 'rimshot', { ghostNotes: 2, kickDensity: 2 })).toEqual([0, 6, 12, 20, 26]);
    expect(s.sections.mainA.steps.flat().filter(h => h.role === 'ghost').every(h => h.velocity < 0.35)).toBe(true);
    expect(s.sections.mainA.swingRatio).toBe(56);
    expect(s.sections.mainA.steps[12].find(h => h.instrument === 'kick')?.velocity).toBeLessThan(0.5);
    expect(composeGroove('04', { kickDensity: 1 }).sections.mainA.steps[7].find(h => h.instrument === 'kick')?.velocity).toBeLessThan(0.3);
    expect(notes('06', 'kick', { kickDensity: 2 })).toEqual([0, 6, 8, 12, 14, 16, 22, 24, 28, 30]);
  });
  it('maps every clave/bell anchor and exposes only supported alternatives', () => {
    expect(notes('08', 'rimshot')).toEqual([0, 6, 12, 20, 24]);
    expect(notes('09', 'ride_bell')).toEqual([0, 4, 8, 10, 14, 18, 22]);
    expect(notes('09', 'ride_bell', { bellDensity: 3 })).toEqual([0, 4, 8, 10, 14, 18, 22]);
    expect(notes('08', 'ride_bell', {}, { replacements: { clave: 'ride_bell' } })).toEqual([0, 6, 12, 20, 24]);
    for (const [source, choices] of Object.entries(REPLACEMENT_CHOICES)) for (const choice of choices) {
      const s = composeGroove('08', { complexity: 3 }, { replacements: { [source]: choice } });
      expect(playability(s)).toEqual([]);
      expect(s.sections.mainA.steps.flat().some(h => h.instrument === source)).toBe(false);
    }
    expect(normalizeOptions({ replacements: { cowbell: 'tom_mid' as never } }).replacements.cowbell).toBe('ride_bell');
  });
  it('applies section-specific cell removals and velocity edits after sliders, without mutating presets', () => {
    const before = JSON.stringify(GROOVES);
    let edits = setCell([], { section: 'mainA', step: 0, instrument: 'kick', velocity: null });
    edits = setCell(edits, { section: 'mainA', step: 1, instrument: 'tom_high', velocity: 0.9 });
    edits = setCell(edits, { section: 'mainA', step: 1, instrument: 'tom_high', velocity: 0.22 });
    expect(edits).toHaveLength(2);
    const s = composeGroove('00', { complexity: 3 }, { edits });
    expect(s.sections.mainA.steps[0].some(h => h.instrument === 'kick')).toBe(false);
    expect(s.sections.mainA.steps[1]).toContainEqual({ instrument: 'tom_high', velocity: 0.22, role: 'ghost' });
    expect(s.sections.mainB.steps[0].some(h => h.instrument === 'kick')).toBe(true);
    expect(JSON.stringify(GROOVES)).toBe(before);
    expect(composeGroove('00').sections.mainA.steps[0].some(h => h.instrument === 'kick')).toBe(true);
  });
  it('flags impossible free edits instead of silently discarding user notes', () => {
    const edits = ['tom_high', 'tom_low', 'crash'].map(instrument => ({ section: 'mainA' as const, step: 0, instrument: instrument as typeof KIT[number], velocity: 0.6 }));
    const s = composeGroove('00', {}, { edits });
    expect(playability(s).some(w => w.step === 0)).toBe(true);
    expect(s.sections.mainA.steps[0]).toHaveLength(5);
  });
  it('roundtrips validated local drafts including edits, mapping and real sample tuning', () => {
    const draft = normalizeDraft({ version: 1, id: '05', bpm: 90, controls: { ghostNotes: 2, bellDensity: 2 }, options: { reggaeVariant: 'two-four', replacements: { clave: 'ride_bell' }, edits: [{ section: 'mainB', step: 2, instrument: 'crash', velocity: 0.65 }] }, mix: { kick: { pitch: -2, volume: 0.7, decay: 0.6, brightness: 9000, pan: -0.1 } } });
    expect(normalizeDraft(JSON.parse(serializeDraft(draft)))).toEqual(draft);
    expect(sampleTuning(draft.mix.kick)).toMatchObject({ pitchMultiplier: 2 ** (-2 / 12), decayMultiplier: 0.6, toneFrequency: 9000 });
    expect(() => normalizeDraft({ version: 1, id: '99' })).toThrow();
    expect(() => normalizeDraft({ version: 99, id: '00' })).toThrow();
    expect(normalizeMix({ kick: { pitch: Infinity, volume: 9, pan: -9, decay: -2 } }).kick).toMatchObject({ pitch: 0, volume: 1, pan: -1, decay: 0.35 });
    expect(normalizeOptions({ edits: [{ section: 'mainA', instrument: 'kick', step: 2, velocity: NaN }] }).edits).toEqual([]);
    expect(defaultStudioControls('05')).toMatchObject({ swing: 50, kickDensity: 0, ghostNotes: 0, bellDensity: 0 });
  });
});
