import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioScheduler } from '../src/audio/AudioScheduler';
import { DrumSynthesizer } from '../src/audio/DrumSynthesizer';
import { arrangeGroove } from '../src/domain/grooves';
import { humanizedHit, pulses, stepDuration } from '../src/domain/timing';
import { DrumInstrument } from '../src/types/rhythm';

function harness(id: string, bpm = 120) {
  let now = 0;
  let tick = () => {};
  let visual = () => {};
  const hits: { instrument: DrumInstrument; time: number; velocity: number }[] = [];
  const clicks: { time: number; accent: boolean }[] = [];
  vi.stubGlobal('window', { setInterval: (fn: () => void) => { tick = fn; return 1; } });
  vi.stubGlobal('clearInterval', vi.fn());
  vi.stubGlobal('requestAnimationFrame', (fn: () => void) => { visual = fn; return 1; });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  const synth = { initAudio: vi.fn(), stopVoices: vi.fn(), getContext: () => ({ currentTime: now }), trigger: (instrument: DrumInstrument, time: number, velocity: number) => hits.push({ instrument, time, velocity }), triggerMetronome: (time: number, accent: boolean) => clicks.push({ time, accent }) };
  const scheduler = new AudioScheduler(synth as unknown as DrumSynthesizer, arrangeGroove(id));
  scheduler.setBpm(bpm);
  return { scheduler, hits, clicks, synth, advance: (seconds: number) => { const end = now + seconds; while (now < end) { now = Math.min(end, now + 0.01); tick(); visual(); } } };
}
afterEach(() => vi.unstubAllGlobals());

describe('Production lookahead scheduler', () => {
  it('plays half-time backbeats every four quarters, and stops scheduling after stop', () => {
    const h = harness('02'); h.scheduler.start(); h.advance(4.1);
    const snares = h.hits.filter(h => h.instrument === 'snare');
    expect(snares[0].time).toBeCloseTo(1.05);
    expect(snares[1].time - snares[0].time).toBeCloseTo(2);
    h.scheduler.stop(); const count = h.hits.length; h.advance(1); expect(h.hits.length).toBe(count); expect(h.synth.stopVoices).toHaveBeenCalled();
  });
  it('uses real long-short eighth pairs for shuffle without changing the bar length', () => {
    const h = harness('03'); h.scheduler.start(); h.advance(2.1);
    const hats = h.hits.filter(h => h.instrument === 'hihat_closed');
    expect(hats[1].time - hats[0].time).toBeCloseTo(0.335);
    expect(hats[2].time - hats[1].time).toBeCloseTo(0.165);
    expect(hats[8].time - hats[0].time).toBeCloseTo(2);
  });
  it('counts in Afro 6/8 as two dotted-quarter pulses then starts the drums', () => {
    const h = harness('09', 60); const counts: number[] = [];
    h.scheduler.setCallbacks({ onCountInBeat: n => counts.push(n) }); h.scheduler.start(1); h.advance(2.1);
    expect(h.clicks.map(c => c.time)).toEqual([0.05, 1.05]);
    expect(counts).toEqual([1, 2]); expect(h.hits[0].time).toBeCloseTo(2.05);
    expect(pulses(arrangeGroove('09')).map(p => p.unit)).toEqual([0, 3]);
  });
  it('counts in 7/8 as 2+2+3 and uses the same accents in the metronome', () => {
    const h = harness('11'); h.scheduler.setMetronome(true); h.scheduler.start(1); h.advance(2);
    expect(h.clicks.slice(0, 3).map(c => c.time)).toEqual([0.05, 0.55, 1.05]);
    expect(h.hits[0].time).toBeCloseTo(1.8);
    expect(h.clicks[3].time).toBeCloseTo(1.8);
  });
  it('queues fills after the entire two-bar clave and returns to the previous variation', () => {
    const h = harness('08'); h.scheduler.triggerSection('mainB'); h.scheduler.start(); h.advance(0.5); h.scheduler.triggerSection('fillA');
    expect(h.scheduler.getNextSection()).toBe('fillA'); h.advance(3.5); expect(h.scheduler.getCurrentSection()).toBe('fillA'); h.advance(4); expect(h.scheduler.getCurrentSection()).toBe('mainB');
    const clave = h.hits.filter(hit => hit.instrument === 'clave').slice(0, 15).map(hit => Number(hit.time.toFixed(2)));
    expect(clave).toEqual([0.05, 0.8, 1.55, 2.55, 3.05, 4.05, 4.8, 5.55, 6.55, 7.05, 8.05, 8.8, 9.55, 10.55, 11.05].slice(0, clave.length));
  });
  it('finishes an ending without looping or scheduling beyond its end', () => {
    const h = harness('00'); h.scheduler.triggerSection('ending'); h.scheduler.start(); h.advance(3);
    expect(h.scheduler.getIsRunning()).toBe(false); expect(h.hits.every(hit => hit.time < 2.05)).toBe(true);
  });
  it('bounds humanize, preserves drum anchors, and changes hand phrasing repeatably', () => {
    const anchor = { instrument: 'kick' as const, velocity: 0.8, role: 'essential' as const };
    const hand = { instrument: 'hihat_closed' as const, velocity: 0.5, role: 'essential' as const };
    expect(humanizedHit(anchor, 4, 1, 12).offset).toBe(0);
    expect(humanizedHit(hand, 4, 1, 12)).toEqual(humanizedHit(hand, 4, 1, 12));
    expect(Math.abs(humanizedHit(hand, 4, 1, 12).offset)).toBeLessThanOrEqual(0.012);
    expect(humanizedHit(hand, 4, 1, 0)).toEqual({ offset: 0, velocity: 0.5 });
  });
  it('keeps 3/4 and 7/8 physically different lengths at identical quarter-note BPM', () => {
    const duration = (id: string) => { const s = arrangeGroove(id); const p = s.sections.mainA; return p.steps.reduce((sum, _, i) => sum + stepDuration(s, p, 120, i), 0); };
    expect(duration('10')).toBeCloseTo(1.5); expect(duration('11')).toBeCloseTo(1.75);
  });
});
