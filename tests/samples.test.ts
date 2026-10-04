import { describe, expect, it } from 'vitest';
import { GROOVES, arrangeGroove } from '../src/domain/grooves';
import { SAMPLE_FILES, selectSample } from '../src/domain/samples';
describe('Recorded instrument selection', () => {
  it('covers every instrument used by every maximum arrangement, including fills', () => {
    expect(SAMPLE_FILES.length).toBe(41);
    for (const g of GROOVES) {
      const settings = Object.fromEntries(Object.entries(g.controls).map(([key, cap]) => [key, cap.max]));
      for (const p of Object.values(arrangeGroove(g.style.id, settings).sections)) {
        for (const hit of p.steps.flat()) expect(SAMPLE_FILES.some(s => s.instrument === hit.instrument)).toBe(true);
      }
    }
  });
  it('uses softer recorded layers for ghost notes and alternates snare hands', () => {
    expect(selectSample('snare', 0.24, 0)?.layer).toBe(0);
    expect(selectSample('snare', 0.24, 1)?.layer).toBe(1);
    expect(selectSample('snare', 0.9, 0)?.layer).toBe(4);
    expect(selectSample('snare', 0.9, 1)?.layer).toBe(5);
    expect(selectSample('kick', 1, 0)?.layer).toBe(2);
    expect(selectSample('conga_low', 0.5, 0)?.rate).toBe(0.82);
  });
});
