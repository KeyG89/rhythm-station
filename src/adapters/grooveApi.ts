import { arrangeGroove, defaultControls, getGroove, GROOVES, GrooveControls, normalizeControls } from '../domain/grooves';
import { humanizedHit, pulses, stepDuration } from '../domain/timing';
import { RhythmSection } from '../types/rhythm';
import { SAMPLE_FILES, selectSample } from '../domain/samples';

export function listGrooves() {
  return GROOVES.map(g => ({ id: g.style.id, name: g.style.name, meter: g.style.timeSignature, bpm: g.style.defaultBpm, bpmUnit: g.style.bpmUnit, tag: g.tag }));
}
export function inspectGroove(id: string, settings: Partial<GrooveControls> = {}, bpm?: number) {
  const groove = getGroove(id);
  const controls = normalizeControls(id, settings);
  const style = arrangeGroove(id, controls);
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
  return { style, controls, defaultControls: defaultControls(id), capabilities: groove.controls, tempoRange: groove.tempo, bpm: tempo, count: groove.count, lesson: groove.lesson, pulses: pulses(style), durationSeconds: time, events, samples: SAMPLE_FILES };
}
export const SECTION_NAMES: RhythmSection[] = ['intro', 'mainA', 'mainB', 'fillA', 'fillB', 'ending'];
