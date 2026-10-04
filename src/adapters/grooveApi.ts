import { getGroove, GROOVES } from '../domain/grooves';
import { composeGroove, defaultStudioControls, normalizeStudioControls, normalizeOptions, playability, studioLesson, studioCapabilities, StudioControls, StudioOptions, KIT } from '../domain/studio';
import { normalizeDraft, normalizeMix, sampleTuning } from '../domain/session';
import { pulses, stepDuration } from '../domain/timing';
import { expandHit } from '../domain/rudiments';
import { getSongMap, listSongMaps } from '../domain/songMaps';
import { RhythmSection } from '../types/rhythm';
import { SAMPLE_FILES, selectSample } from '../domain/samples';

export { listSongMaps };
export function inspectSongMap(id: string, settings: Partial<StudioControls> = {}, bpm?: number, options: StudioOptions = {}) { const song = getSongMap(id); return inspectGroove(song.grooveId, {swing:song.swing,...settings}, bpm ?? song.bpm, {...options,songPresetId:id}); }
export { cycleCell } from '../domain/studio';
export function listGrooves() {
  return GROOVES.map(g => ({ id: g.style.id, name: g.style.name, meter: g.style.timeSignature, bpm: g.style.defaultBpm, bpmUnit: g.style.bpmUnit, tag: g.tag }));
}
export function inspectGroove(id: string, settings: Partial<StudioControls> = {}, bpm?: number, options: StudioOptions = {}, mix: Parameters<typeof normalizeMix>[0] = {}) {
  const groove = getGroove(id);
  const song = options.songPresetId ? getSongMap(options.songPresetId,id) : undefined;
  const controls = normalizeStudioControls(id, { ...(song ? {swing:song.swing} : {}), ...settings });
  const style = composeGroove(id, controls, options);
  const tempo = Math.max(groove.tempo[0], Math.min(groove.tempo[1], Number.isFinite(bpm) ? bpm! : style.defaultBpm));
  let time = 0;
  const takes: Record<string, number> = {};
  const events = style.sections.mainA.steps.flatMap((hits, step) => {
    const result = hits.flatMap(hit => expandHit(hit, style, style.sections.mainA, tempo, step, Math.floor(step / (style.timeSignature[0] * style.sections.mainA.stepsPerBeat)), controls.humanize).map(played => {
      return { ...hit, velocity: played.velocity, step, time: time + played.offset, kind: played.kind };
    }));
    time += stepDuration(style, style.sections.mainA, tempo, step);
    return result;
  });
  const playedEvents = events.sort((a,b) => a.time-b.time).map(event => {
    const take = takes[event.instrument] ?? 0;
    takes[event.instrument] = take + 1;
    return { ...event, sample: selectSample(event.instrument, event.velocity, take) };
  });
  return { style, song: song ?? null, eventOrigin: 'principal onset; negative times are grace strokes', playbackLeadInSeconds: 0.05, controls, defaultControls: defaultStudioControls(id,options), capabilities: studioCapabilities(id,options), options: normalizeOptions(options), kit: KIT, mix: normalizeMix(mix), tuning: Object.fromEntries(KIT.map(i => [i, sampleTuning(normalizeMix(mix)[i])])), playability: playability(style), tempoRange: groove.tempo, bpm: tempo, count: style.drumPatternDescription, lesson: studioLesson(id, options), pulses: pulses(style), durationSeconds: time, events: playedEvents, samples: SAMPLE_FILES };
}
export const SECTION_NAMES: RhythmSection[] = ['intro', 'mainA', 'mainB', 'fillA', 'fillB', 'ending'];

export function inspectDraft(value: unknown) { const draft = normalizeDraft(value); return { draft, arrangement: inspectGroove(draft.id, draft.controls, draft.bpm, draft.options, draft.mix) }; }
