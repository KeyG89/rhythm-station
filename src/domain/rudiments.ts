import { DrumHit, RhythmPattern, RhythmStyle } from '../types/rhythm';
import { humanizedHit, stepDuration } from './timing';

export const RUDIMENT_LABELS = { single: 'Nuta', ghost: 'Ghost', drag: 'Drag · 2×32 przed nutą', flam: 'Flam · jedna przednutka', triplet: 'Triola' };
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
    const gap = quarterDuration(style,bpm) / 8; // A straight 32nd, independent of display subdivision/swing.
    return [stroke(-gap * 2, Math.max(0.05, human.velocity * 0.38), 'grace'), stroke(-gap, Math.max(0.05, human.velocity * 0.46), 'grace'), principal];
  }
  if (hit.rudiment === 'triplet') {
    const span = Math.min(pattern.steps.length - step, Math.max(1, Math.min(4, Math.round(hit.tripletSpan ?? 1))));
    const duration = Array.from({ length: span }, (_, i) => stepDuration(style, pattern, bpm, step + i)).reduce((a, b) => a + b, 0);
    return [principal, stroke(duration / 3, human.velocity * 0.7, 'subdivision'), stroke(duration * 2 / 3, human.velocity * 0.82, 'subdivision')];
  }
  return [principal];
}

export function quarterDuration(style: RhythmStyle, bpm: number) { return 60 / bpm * (style.bpmUnit === 'dotted-quarter' ? 2/3 : 1); }
export function graceAnticipation(style: RhythmStyle, bpm: number, humanize=0): number {
  const ornaments=Object.values(style.sections).flatMap(p=>p.steps.flat());
  const drag=ornaments.some(h=>h.rudiment==='drag') ? quarterDuration(style,bpm)/4 : 0;
  const flam=ornaments.some(h=>h.rudiment==='flam') ? .026 : 0;
  return Math.max(drag,flam) + Math.min(12,Math.max(0,humanize))/1000;
}
export function playbackLeadIn(style: RhythmStyle, bpm: number, humanize=0) { return Math.max(.05,graceAnticipation(style,bpm,humanize)+.03); }

/** Display the actual cells occupied by tempo-based drag preparation, also over a loop edge. */
export function dragLeadCells(style:RhythmStyle,pattern:RhythmPattern,bpm:number) {
  let total=0;
  const starts=pattern.steps.map((_,i)=>{const start=total;total+=stepDuration(style,pattern,bpm,i);return start;});
  const cells=new Map<string,Set<number>>();
  pattern.steps.forEach((notes,i)=>notes.filter(h=>h.rudiment==='drag').forEach(hit=>{
    const occupied=cells.get(hit.instrument) ?? new Set<number>();
    for(const stroke of expandHit(hit,style,pattern,bpm,i).filter(s=>s.kind==='grace')) {
      const at=((starts[i]+stroke.offset)%total+total)%total;
      let cell=0; for(let n=0;n<starts.length;n++) if(starts[n]<=at+1e-9) cell=n;
      occupied.add(cell);
    }
    cells.set(hit.instrument,occupied);
  }));
  return cells;
}
