import { DrumHit, RhythmPattern, RhythmStyle } from '../types/rhythm';
import { humanizedHit, stepDuration } from './timing';

export const RUDIMENT_LABELS = { single: 'Nuta', ghost: 'Ghost', drag: 'Drag · dwie przednutki', flam: 'Flam · jedna przednutka', triplet: 'Triola' };
export function hitLabel(hit?: DrumHit): string {
  return !hit ? 'Pauza' : hit.rudiment === 'triplet' ? `Triola · 3 nuty w czasie ${hit.tripletSpan ?? 1} pól` : hit.rudiment ? RUDIMENT_LABELS[hit.rudiment] : hit.role === 'ghost' ? RUDIMENT_LABELS.ghost : RUDIMENT_LABELS.single;
}
/** Relative to the principal onset. Negative offsets are real grace strokes,
 * not grid notes or swing. One humanization offset moves the entire gesture. */
export function expandHit(hit: DrumHit, style: RhythmStyle, pattern: RhythmPattern, bpm: number, step: number, bar = 0, humanize = 0) {
  const human = humanizedHit(hit, step, bar, humanize);
  const stroke = (offset: number, velocity: number, kind: 'principal' | 'grace' | 'subdivision') => ({ instrument: hit.instrument, offset: offset + human.offset, velocity, kind });
  const principal = stroke(0, human.velocity, 'principal');
  const cell = stepDuration(style, pattern, bpm, step);
  if (hit.rudiment === 'flam') return [stroke(-Math.min(0.026, cell * 0.2), Math.max(0.05, human.velocity * 0.3), 'grace'), principal];
  if (hit.rudiment === 'drag') {
    const gap = Math.min(0.014, cell * 0.1);
    return [stroke(-gap * 2, Math.max(0.05, human.velocity * 0.25), 'grace'), stroke(-gap, Math.max(0.05, human.velocity * 0.3), 'grace'), principal];
  }
  if (hit.rudiment === 'triplet') {
    const span = Math.min(pattern.steps.length - step, Math.max(1, Math.min(4, Math.round(hit.tripletSpan ?? 1))));
    const duration = Array.from({ length: span }, (_, i) => stepDuration(style, pattern, bpm, step + i)).reduce((a, b) => a + b, 0);
    return [principal, stroke(duration / 3, human.velocity * 0.7, 'subdivision'), stroke(duration * 2 / 3, human.velocity * 0.82, 'subdivision')];
  }
  return [principal];
}
