import { getGroove, GROOVES } from '../domain/grooves';
import { composeGroove, defaultStudioControls, normalizeStudioControls, normalizeOptions, playability, studioLesson, studioCapabilities, StudioControls, StudioOptions, KIT } from '../domain/studio';
import { normalizeDraft, normalizeMix, sampleTuning } from '../domain/session';
import { humanizedHit, pulses, stepDuration } from '../domain/timing';
import { RhythmSection } from '../types/rhythm';
import { SAMPLE_FILES, selectSample } from '../domain/samples';

export function listGrooves() {
  return GROOVES.map(g => ({ id: g.style.id, name: g.style.name, meter: g.style.timeSignature, bpm: g.style.defaultBpm, bpmUnit: g.style.bpmUnit, tag: g.tag }));
}
export function inspectGroove(id: string, settings: Partial<StudioControls> = {}, bpm?: number, options: StudioOptions = {}, mix: Parameters<typeof normalizeMix>[0] = {}) {
  const groove = getGroove(id);
  const controls = normalizeStudioControls(id, settings);
  const style = composeGroove(id, controls, options);
  const tempo = Math.max(groove.tempo[0], Math.min(groove.tempo[1], Number.isFinite(bpm) ? bpm! : style.defaultBpm));
  let time = 0;
  const takes: Record<string, number> = {};
  const events = style.sections.mainA.steps.flatMap((hits, step) => {
    const result = hits.map(hit => {
      const human = humanizedHit(hit, step, Math.floor(step / (style.timeSignature[0] * style.sections.mainA.stepsPerBeat)), controls.humanize);
      const take = takes[hit.instrument] ?? 0;
      takes[hit.instrument] = take + 1;
      return { ...hit, velocity: human.velocity, step, time: Math.max(0, time + human.offset), sample: selectSample(hit.instrument, human.velocity, take) };
    });
    time += stepDuration(style, style.sections.mainA, tempo, step);
    return result;
  });
  return { style, controls, defaultControls: defaultStudioControls(id), capabilities: studioCapabilities(id), options: normalizeOptions(options), kit: KIT, mix: normalizeMix(mix), tuning: Object.fromEntries(KIT.map(i => [i, sampleTuning(normalizeMix(mix)[i])])), playability: playability(style), tempoRange: groove.tempo, bpm: tempo, count: style.drumPatternDescription, lesson: studioLesson(id, options), pulses: pulses(style), durationSeconds: time, events, samples: SAMPLE_FILES };
}
export const SECTION_NAMES: RhythmSection[] = ['intro', 'mainA', 'mainB', 'fillA', 'fillB', 'ending'];

export function inspectDraft(value: unknown) { const draft = normalizeDraft(value); return { draft, arrangement: inspectGroove(draft.id, draft.controls, draft.bpm, draft.options, draft.mix) }; }
