import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioScheduler } from '../src/audio/AudioScheduler';
import { DrumSynthesizer } from '../src/audio/DrumSynthesizer';
import { arrangeGroove } from '../src/domain/grooves';
import { composeGroove } from '../src/domain/studio';
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
  it('plays anticipatory graces before first/loop anchors and dispatches overlapping triplet hats in time order',()=>{
    const h=harness('00');
    const style=composeGroove('00',{}, {edits:[{section:'mainA',step:0,instrument:'snare',velocity:.8,rudiment:'drag'},{section:'mainA',step:0,instrument:'hihat_closed',velocity:.5,rudiment:'triplet',tripletSpan:4}]});
    h.scheduler.setStyle(style); h.scheduler.setBpm(120); h.scheduler.start(); h.advance(2.2);
    const snare=h.hits.filter(hit=>hit.instrument==='snare' && hit.time<.2);
    [.03,.0925,.155].forEach((time,i)=>expect(snare[i].time).toBeCloseTo(time,6));
    const repeated=h.hits.filter(hit=>hit.instrument==='snare' && hit.time>2 && hit.time<2.2);
    [2.03,2.0925,2.155].forEach((time,i)=>expect(repeated[i].time).toBeCloseTo(time,6));
    const hats=h.hits.filter(hit=>hit.instrument==='hihat_closed');
    expect(hats.map(hit=>hit.time)).toEqual([...hats.map(hit=>hit.time)].sort((a,b)=>a-b));
    expect(hats.slice(0,4).map(hit=>Number(hit.time.toFixed(3)))).toEqual([.155,.322,.405,.488]);
    h.scheduler.stop(); const n=h.hits.length; h.advance(1); expect(h.hits).toHaveLength(n);
  });
  it('mutes whole gap phrases including the metronome and prevents return graces from cueing the silent phrase',()=>{
    const h=harness('00',40);
    h.scheduler.setStyle(composeGroove('00',{}, {edits:[{section:'mainA',step:0,instrument:'snare',velocity:.8,rudiment:'drag'}]}));
    h.scheduler.setBpm(40); h.scheduler.setMetronome(true);
    h.scheduler.setLaboratory({enabled:true,gap:true,audiblePhrases:1,silentPhrases:1});
    h.scheduler.start(); h.advance(12.6);
    expect(h.hits.filter(n=>n.time>=6.405-1e-6 && n.time<12.405-1e-6)).toEqual([]);
    expect(h.clicks.filter(n=>n.time>=6.405-1e-6 && n.time<12.405-1e-6)).toEqual([]);
    expect(h.hits.filter(n=>n.instrument==='snare' && n.time>=12 && n.time<12.6).map(n=>n.time)).toHaveLength(1);
    expect(h.hits.filter(n=>n.instrument==='snare' && n.time>=12)[0].time).toBeCloseTo(12.405);
  });
  it('advances Complexity only at complete two-bar boundaries, with unchanged tempo',()=>{
    const h=harness('08'),levels:number[]=[];
    h.scheduler.setCallbacks({onComplexityChange:n=>levels.push(n)});
    h.scheduler.setLaboratory({enabled:true,ladder:true,phrasesPerLevel:1,targetLevel:2},0,7,n=>composeGroove('08',{complexity:n}));
    h.scheduler.start(); h.advance(3.9); expect(levels).toEqual([]);
    h.advance(.3); expect(levels).toEqual([1]);
    h.advance(3.9); expect(levels).toEqual([1,2]);
    h.advance(4); expect(levels).toEqual([1,2]); expect(h.scheduler.getBpm()).toBe(120);
  });
  it('anticipates a newly introduced drag on a ladder boundary even at slow BPM',()=>{
    const h=harness('00',40);
    h.scheduler.setLaboratory({enabled:true,ladder:true,phrasesPerLevel:1,targetLevel:1},0,7,()=>composeGroove('00',{}, {edits:[{section:'mainA',step:0,instrument:'snare',velocity:.8,rudiment:'drag'}]}));
    h.scheduler.start(); h.advance(6.3);
    const notes=h.hits.filter(n=>n.instrument==='snare' && n.time>5.5 && n.time<6.3);
    expect(notes).toHaveLength(3);
    [5.675,5.8625,6.05].forEach((time,i)=>expect(notes[i].time).toBeCloseTo(time,6));
  });
  it('does not revive a queued ladder change after manual disabling',()=>{
    const h=harness('00'),levels:number[]=[];
    h.scheduler.setCallbacks({onComplexityChange:n=>levels.push(n)});
    h.scheduler.setLaboratory({enabled:true,ladder:true,phrasesPerLevel:1,targetLevel:4},0,7,n=>composeGroove('00',{complexity:n}));
    h.scheduler.start(); h.advance(1.9);
    h.scheduler.setLaboratory({enabled:true,ladder:false},0,7); h.scheduler.setStyle(composeGroove('00'),false);
    h.advance(2.2); expect(levels).toEqual([]);
  });
  it('counts 5/4 in complete 3+2 groups and starts after all five quarters',()=>{
    const h=harness('12'); h.scheduler.start(1); h.advance(2.6);
    expect(h.clicks.map(c=>c.time)).toEqual([.05,1.55]); expect(h.hits[0].time).toBeCloseTo(2.55);
  });
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
