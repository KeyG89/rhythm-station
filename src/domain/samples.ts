import { DrumInstrument } from '../types/rhythm';
export const SAMPLE_COUNTS: Partial<Record<DrumInstrument, number>> = {
  kick: 3, snare: 6, rimshot: 1, hihat_closed: 3, hihat_open: 2, hihat_pedal: 2,
  tom_high: 2, tom_mid: 2, tom_low: 2, crash: 2, ride: 2, ride_bell: 2,
  clave: 2, cowbell: 2, conga_high: 2, conga_low: 2, tambourine: 2, shaker: 2,
};
export const SAMPLE_FILES = Object.entries(SAMPLE_COUNTS).flatMap(([instrument, count]) =>
  Array.from({ length: count }, (_, layer) => ({ instrument: instrument as DrumInstrument, layer, file: `${instrument}-${layer}.wav` })));

export function selectSample(instrument: DrumInstrument, velocity: number, take: number) {
  const count = SAMPLE_COUNTS[instrument];
  if (!count) return null;
  let layer = Math.min(count - 1, Math.floor(Math.max(0, Math.min(1, velocity)) * count));
  if (instrument === 'snare') layer = (velocity < 0.4 ? 0 : velocity < 0.78 ? 2 : 4) + take % 2;
  if (['clave', 'cowbell', 'tambourine', 'shaker'].includes(instrument)) layer = take % count;
  return { layer, file: `${instrument}-${layer}.wav`, rate: instrument === 'conga_low' ? 0.82 : instrument === 'tom_mid' ? 2 ** (-3/12) : 1 };
}
