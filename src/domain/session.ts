import { defaultStudioControls, KitInstrument, KIT, normalizeOptions, normalizeStudioControls, StudioControls, StudioOptions } from './studio';
import { getGroove } from './grooves';
import { LaboratoryConfig, normalizeLaboratory } from './practice';
import { getSongMap } from './songMaps';
export interface VoiceMix { volume: number; pan: number; pitch: number; decay: number; brightness: number }
export type KitMix = Record<KitInstrument, VoiceMix>;
const bound = (v: unknown, min: number, max: number, fallback: number) => typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;
export function normalizeMix(input: Partial<Record<KitInstrument, Partial<VoiceMix>>> = {}): KitMix {
  return Object.fromEntries(KIT.map(inst => { const v = input[inst] ?? {}; return [inst, { volume: bound(v.volume, 0, 1, 0.8), pan: bound(v.pan, -1, 1, inst === 'tom_low' || inst.includes('ride') ? 0.25 : inst.startsWith('hihat') || inst === 'tom_high' ? -0.2 : 0), pitch: bound(v.pitch, -4, 4, 0), decay: bound(v.decay, 0.35, 1, 1), brightness: bound(v.brightness, 500, 20000, 20000) }]; })) as KitMix;
}
export function sampleTuning(mix: VoiceMix) { return { pitchMultiplier: 2 ** (mix.pitch / 12), decayMultiplier: mix.decay, toneFrequency: mix.brightness, snappy: 0.5, drive: 0 }; }
export interface PracticeDraft { laboratory?: LaboratoryConfig; version: 1; id: string; bpm: number; controls: StudioControls; options: Required<StudioOptions>; mix: KitMix }
export function normalizeDraft(value: unknown): PracticeDraft {
  if (!value || typeof value !== 'object') throw new Error('Nieprawidłowy plik groove’u.');
  const v = value as Partial<PracticeDraft>;
  if (v.version !== 1 || typeof v.id !== 'string') throw new Error('Nieobsługiwana wersja pliku groove’u.');
  const g = getGroove(v.id);
  const options = normalizeOptions(v.options ?? {},v.id);
  const song = options.songPresetId ? getSongMap(options.songPresetId,v.id) : undefined;
  options.edits = options.edits.filter(e => e.step < g.style.sections[e.section].steps.length);
  return { laboratory:normalizeLaboratory(v.laboratory), version: 1, id: v.id, bpm: Math.round(bound(v.bpm, ...g.tempo, song?.bpm ?? g.style.defaultBpm)*10)/10, controls: normalizeStudioControls(v.id, { ...defaultStudioControls(v.id), ...(song ? {swing:song.swing} : {}), ...v.controls },options), options, mix: normalizeMix(v.mix ?? {}) };
}
export function serializeDraft(draft: PracticeDraft): string { return JSON.stringify(normalizeDraft(draft), null, 2); }
