import { DrumHit, RhythmPattern, RhythmStyle } from '../types/rhythm';

/** Seconds per denominator unit: quarter in 4/4, eighth in 6/8 or 7/8. */
export function unitDuration(style: RhythmStyle, bpm: number): number {
  if (style.bpmUnit === 'dotted-quarter') return 60 / bpm / 3;
  return (60 / bpm) * 4 / style.timeSignature[1];
}
export function stepDuration(style: RhythmStyle, pattern: RhythmPattern, bpm: number, index: number): number {
  const base = unitDuration(style, bpm) / pattern.stepsPerBeat;
  const ratio = Math.max(50, Math.min(75, pattern.swingRatio ?? 50)) / 100;
  return base * 2 * (index % 2 === 0 ? ratio : 1 - ratio);
}
export function pulses(style: RhythmStyle): { unit: number; durationUnits: number }[] {
  const groups = style.pulseGroups ?? Array.from({ length: style.timeSignature[0] }, () => 1);
  let unit = 0;
  return groups.map(durationUnits => { const pulse = { unit, durationUnits }; unit += durationUnits; return pulse; });
}
/** Repeatable, bounded phrasing. Main anchors keep their timing and relative dynamics. */
export function humanizedHit(hit: DrumHit, step: number, bar: number, amount: number) {
  if (!amount) return { offset: 0, velocity: hit.velocity };
  const anchor = hit.role === 'essential' && !['hihat_closed', 'hihat_open', 'ride', 'shaker'].includes(hit.instrument);
  const phase = Math.sin((step + 1) * 17.13 + bar * 3.71 + hit.instrument.length * 1.93);
  return { offset: anchor ? 0 : phase * Math.min(12, amount) / 1000, velocity: Math.max(0.05, Math.min(1, hit.velocity * (1 + phase * amount / 240))) };
}
