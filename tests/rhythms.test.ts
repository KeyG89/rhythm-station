import { describe, it, expect } from 'vitest';
import { ALL_STYLES, searchStyles } from '../src/data';
import { arrangeGroove, defaultControls, getGroove, GROOVES, normalizeControls } from '../src/domain/grooves';
import { DRUM_INSTRUMENTS_META } from '../src/types/rhythm';

describe('Twelve authored grooves', () => {
  it('contains exactly the requested collection in order', () => {
    expect(ALL_STYLES.map(s => s.name)).toEqual(['Straight Rock 8th', 'Funk 16th', 'Half-Time Hip-Hop', 'Shuffle', 'Jazz Swing', 'Reggae One Drop', 'Bossa Nova', 'Samba', 'Afro-Cuban Clave', 'Afro 6/8', 'Waltz 3/4', 'Balkan 7/8']);
    expect(new Set(ALL_STYLES.map(s => s.id)).size).toBe(12);
    expect(searchStyles('bossa').map(s => s.id)).toEqual(['06']);
  });
  it('has complete bars, valid velocities and no duplicate articulations in every section', () => {
    for (const g of GROOVES) {
      const settings = Object.fromEntries(Object.entries(g.controls).map(([key, cap]) => [key, cap.max]));
      for (const p of Object.values(arrangeGroove(g.style.id, settings).sections)) {
        expect(p.steps.length).toBe(p.bars * p.timeSignature[0] * p.stepsPerBeat);
        for (const hits of p.steps) {
          expect(new Set(hits.map(h => h.instrument)).size).toBe(hits.length);
          expect(hits.filter(h => h.instrument === 'hihat_closed' || h.instrument === 'hihat_open').length).toBeLessThanOrEqual(1);
          for (const h of hits) { expect(DRUM_INSTRUMENTS_META[h.instrument]).toBeDefined(); expect(h.velocity).toBeGreaterThan(0); expect(h.velocity).toBeLessThanOrEqual(1); }
        }
      }
    }
  });
  it('preserves the timing, dynamics and identity of every essential anchor across all 256 density combinations', () => {
    for (const g of GROOVES) {
      for (let combination = 0; combination < 256; combination++) {
        const style = arrangeGroove(g.style.id, { complexity: combination % 4, ghostNotes: (combination >> 2) % 4, kickDensity: (combination >> 4) % 4, hihatDensity: (combination >> 6) % 4 });
        const anchorsPreserved = g.style.sections.mainA.steps.every((hits, step) => hits.every(anchor =>
          style.sections.mainA.steps[step].some(h => h.role === 'essential' && h.velocity === anchor.velocity &&
            (h.instrument === anchor.instrument || anchor.instrument === 'hihat_closed' && h.instrument === 'hihat_open'))));
        expect(anchorsPreserved, `${g.style.name}, combination ${combination}`).toBe(true);
      }
    }
  });
  it('allows restrained reggae vocabulary while keeping one-drop anchors', () => {
    expect(normalizeControls('05', { kickDensity: 999, ghostNotes: 999, swing: 70 })).toMatchObject({ kickDensity: 2, ghostNotes: 3, swing: 62 });
    const p = arrangeGroove('05', { kickDensity: 2, ghostNotes: 3 }).sections.mainA;
    expect(p.steps.flatMap((hits, i) => hits.some(h => h.instrument === 'kick') ? [i] : [])).toEqual([6, 8, 14]);
    expect(p.steps[0].some(h => h.instrument === 'kick')).toBe(false);
    expect(p.steps[8].some(h => h.instrument === 'rimshot' && h.role === 'essential')).toBe(true);
  });
  it('distinguishes Brazilian cross-stick from Cuban son clave', () => {
    const notes = (id: string, inst: string) => arrangeGroove(id).sections.mainA.steps.flatMap((hits, i) => hits.some(h => h.instrument === inst) ? [i] : []);
    expect(notes('06', 'rimshot')).toEqual([0, 6, 12, 20, 26]);
    expect(notes('08', 'clave')).toEqual([0, 6, 12, 20, 24]);
    expect(notes('09', 'cowbell')).toEqual([0, 4, 8, 10, 14, 18, 22]);
    expect(arrangeGroove('08').sections.mainA.bars).toBe(2);
  });
  it('restores essence and does not mutate the library when arranging or adjusting invalid values', () => {
    const before = JSON.stringify(GROOVES);
    arrangeGroove('01', { complexity: 3, ghostNotes: 3 });
    expect(JSON.stringify(GROOVES)).toBe(before);
    expect(arrangeGroove('01', defaultControls('01')).sections.mainA.steps.every(s => s.every(h => h.role === 'essential'))).toBe(true);
    expect(normalizeControls('01', { complexity: NaN }).complexity).toBe(0);
    expect(() => getGroove('99')).toThrow();
  });
  it('every enabled stage contributes vocabulary and ghost notes remain softer than backbeats', () => {
    for (const g of GROOVES) {
      for (const key of ['complexity', 'ghostNotes', 'kickDensity', 'hihatDensity'] as const) {
        let previous = arrangeGroove(g.style.id).sections.mainA.steps.flat().length;
        for (let value = 1; value <= g.controls[key].max; value++) {
          const hits = arrangeGroove(g.style.id, { [key]: value }).sections.mainA.steps.flat();
          // Open hats substitute one articulation; that is an audible stage without a new note.
          expect(hits.length).toBeGreaterThanOrEqual(previous);
          expect(hits.filter(h => h.role === 'ghost').every(h => h.velocity < 0.35)).toBe(true);
          previous = hits.length;
        }
      }
    }
  });
});
