import { arrangeGroove, Capability, ControlKey, defaultControls, getGroove, GrooveControls, normalizeControls } from './grooves';
import { DrumHit, DrumInstrument, RhythmSection, RhythmStyle } from '../types/rhythm';
import { getSongMap, SONG_MAPS } from './songMaps';
import { expandHit } from './rudiments';
import { stepDuration } from './timing';

export const KIT = ['kick', 'snare', 'rimshot', 'hihat_closed', 'hihat_open', 'hihat_pedal', 'crash', 'ride', 'ride_bell', 'tom_high', 'tom_low'] as const;
export type KitInstrument = typeof KIT[number];
export const KIT_NAMES: Record<KitInstrument, string> = { kick: 'Stopa', snare: 'Werbel', rimshot: 'Cross-stick', hihat_closed: 'Hi-hat', hihat_open: 'Otwarty hi-hat', hihat_pedal: 'Hi-hat nogą', crash: 'Crash', ride: 'Ride', ride_bell: 'Bell ride’u', tom_high: 'Tom', tom_low: 'Floor tom' };
export const VOICE_CONTROLS = { snareDensity: 'snare', rimshotDensity: 'rimshot', openHatDensity: 'hihat_open', pedalDensity: 'hihat_pedal', crashDensity: 'crash', rideDensity: 'ride', bellDensity: 'ride_bell', tomDensity: 'tom_high', floorDensity: 'tom_low' } as const;
export type VoiceControlKey = keyof typeof VOICE_CONTROLS;
export type RudimentControlKey = 'flams' | 'drags' | 'triplets';
export type StudioControlKey = ControlKey | VoiceControlKey | RudimentControlKey;
export type StudioControls = GrooveControls & Record<VoiceControlKey | RudimentControlKey, number>;
export type PercussionSource = 'clave' | 'cowbell' | 'conga_high' | 'conga_low' | 'shaker' | 'tambourine';
export const REPLACEMENT_CHOICES: Record<PercussionSource, KitInstrument[]> = { clave: ['rimshot', 'ride_bell', 'tom_high'], cowbell: ['ride_bell', 'ride', 'rimshot'], conga_high: ['tom_high', 'snare', 'rimshot'], conga_low: ['tom_low', 'tom_high'], shaker: ['hihat_closed', 'hihat_pedal', 'ride'], tambourine: ['hihat_closed', 'hihat_pedal', 'ride_bell'] };
export const DEFAULT_REPLACEMENTS: Record<PercussionSource, KitInstrument> = { clave: 'rimshot', cowbell: 'ride_bell', conga_high: 'tom_high', conga_low: 'tom_low', shaker: 'hihat_closed', tambourine: 'hihat_closed' };
export interface CellEdit { section: RhythmSection; step: number; instrument: KitInstrument; velocity: number | null; rudiment?: DrumHit['rudiment']; tripletSpan?: number }
export interface StudioOptions { songPresetId?: string; reggaeVariant?: 'one-drop' | 'two-four'; kitMode?: 'personal' | 'original'; replacements?: Partial<Record<PercussionSource, KitInstrument>>; edits?: CellEdit[] }
// Each row is an authored response: snare, cross-stick, open hat, pedal, crash,
// ride, bell, rack tom, floor tom. Stages expose a progressively longer phrase.
// Positions use each groove's native grid; two-bar phrases stay two bars.
const VOCABULARY: Record<string, number[][]> = {
  '00': [[6, 14], [10], [14], [4, 12], [0], [0, 8, 2, 6, 10, 14], [0, 8], [13, 15], [14]],
  '01': [[6, 14], [10], [14, 6], [4, 12], [0], [0, 8, 2, 6, 10, 14], [0, 6, 10], [13, 15], [14]],
  '02': [[12], [4, 14], [14], [4, 12], [0], [0, 8, 2, 6, 10, 14], [0, 10], [13], [15]],
  '03': [[5, 7], [4], [7], [2, 6], [0], [0, 4, 2, 3, 6, 7], [0, 4], [5, 7], [7]],
  '04': [[3, 5, 1], [5, 7], [7], [0, 4], [0], [1, 5], [0, 4], [5], [7]],
  '05': [[14], [6, 14], [14, 6], [4, 12], [8], [2, 10, 6, 14], [2, 10], [13, 15], [14]],
  '06': [[10, 28], [14, 30], [14, 30], [4, 12, 20, 28], [0], [0, 16, 4, 20, 2, 6, 10, 14, 18, 22, 26, 30], [0, 16], [10, 28], [14, 30]],
  '07': [[5, 9], [14], [14], [4, 12], [0], [0, 8, 2, 6, 10, 14], [2, 6, 10, 14], [7, 15], [4, 12]],
  '08': [[10, 26], [14, 30], [14, 30], [4, 12, 20, 28], [0], [0, 16, 4, 10, 14, 20, 26, 30], [0, 4, 10, 14, 16, 20, 26, 30], [4, 10, 18, 26], [14, 30]],
  '09': [[4, 16], [8, 20], [10, 22], [4, 16], [0], [2, 12, 6, 16, 20], [2, 6, 12, 16, 20], [2, 16], [4, 14]],
  '10': [[6], [10], [10], [4, 8], [0], [0, 4, 8, 2, 6, 10], [0], [9, 11], [10]],
  '11': [[10], [6], [12], [4, 8], [0], [0, 4, 8, 2, 6, 10, 12], [0, 4, 8], [11, 13], [10, 12]],
};
const keys = Object.keys(VOICE_CONTROLS) as VoiceControlKey[];
// Deliberate phrase-end answers; no automatic ornaments on kick, hats or bell timelines.
const ORNAMENTS: Record<string, [number[], number[], number[]]> = {
  '00': [[4,12],[7,15],[13,11]], '01': [[4,12],[7,15],[13,11]],
  '02': [[8],[7,15],[13,11]], '03': [[2,6],[1,5],[7,3]],
  '04': [[5],[3,7],[1]], '05': [[14],[7,15],[13]],
  '06': [[14,30],[11,27],[15,31]], '07': [[14],[7,15],[13]],
  '08': [[30],[15],[31]], '09': [[16],[11],[23]],
  '10': [[6],[7,11],[9]], '11': [[8],[7,13],[11]],
};
const ornamentKeys: RudimentControlKey[] = ['flams','drags','triplets'];
export function studioCapabilities(id: string, options: StudioOptions = {}): Record<StudioControlKey, Capability> {
  const cap = structuredClone(getGroove(id).controls) as Record<StudioControlKey, Capability>;
  const song = options.songPresetId ? getSongMap(options.songPresetId,id) : undefined;
  if (song) cap.swing.default = song.swing;
  if (id === '05') cap.swing.description = 'Swing ósemek hi-hatu: od prostego do lekkiego kołysania (50–62%). Stopa i cross-stick na miarach nie przesuwają się.';
  if (id === '06') cap.swing.description = 'Delikatny swing szesnastkowych odpowiedzi (50–56%). Brazylijska baza pozostaje prosta; to współczesny wariant ćwiczeniowy.';
  keys.forEach((key, i) => {
    const n = VOCABULARY[id][i].length;
    const max = id === '09' && key === 'bellDensity' ? 3 : Math.min(3, n);
    const inst = VOICE_CONTROLS[key];
    cap[key] = { min: 0, max, default: 0, levels: ['Baza', 'Krótki gest', 'Dialog', 'Pełna odpowiedź'], description: inst === 'ride' ? 'Zapisana partia ride’u. Zastępuje hi-hat w tych samych miejscach; nie mnoży rąk.' : inst === 'crash' ? 'Jeden akcent frazy, zamiast crasha na każdej ćwierćnucie.' : inst === 'hihat_open' ? 'Krótkie otwarcia w wybranych miejscach; zastępują zamknięty hi-hat.' : `${KIT_NAMES[inst]}: przygotowana odpowiedź dla ${getGroove(id).style.name}. Przy zagęszczeniu tomy przejmują rękę prowadzącą, a akcenty esencji mają pierwszeństwo.` };
  });
  if (id === '09') cap.bellDensity = { ...cap.bellDensity, levels: ['Fraza 7 nut', 'Akcent 1', 'Dwa filary', 'Kontrast frazy'], description: 'Siedmionutowa fraza jest kompletna. Suwak rozwija jej akcenty; nie wypełnia przerw kolejnymi dzwonkami.' };
  if (id === '09' && song && song.id !== '09-1') cap.bellDensity = { ...cap.bellDensity, levels: ['Baza','Krótki gest','Dialog','Pełna odpowiedź'], description: 'Wybrane ósemki ride’u lub hi-hatu przechodzą na bell. Akcenty odpowiedzi do tej compound frazy, bez dodawania timeline’u bembé.' };
  ornamentKeys.forEach((key, i) => { cap[key] = { min: 0, max: ORNAMENTS[id][i].length, default: 0, levels: ['Bez ozdobników','Jedna odpowiedź','Dwie odpowiedzi'], description: key === 'flams' ? 'Jedna cicha przednutka przed zapisanym akcentem werbla lub tomu. Główna nuta zostaje na swoim miejscu.' : key === 'drags' ? 'Dwie ciche przednutki prowadzą do krótkiej odpowiedzi werbla. Nie zagęszczają stopy ani osi clave.' : 'Trzy równe uderzenia w czasie jednego pola mapy. Krótka odpowiedź werbla/tomu, dobrana do tej frazy; nie zmienia całego groove’u w shuffle.' }; });
  return cap;
}
export function defaultStudioControls(id: string, options: StudioOptions = {}): StudioControls { return { ...defaultControls(id), ...(options.songPresetId ? {swing:getSongMap(options.songPresetId,id).swing} : {}), ...Object.fromEntries([...keys,...ornamentKeys].map(key => [key, 0])) } as StudioControls; }
export function normalizeStudioControls(id: string, input: Partial<StudioControls> = {}): StudioControls {
  const caps = studioCapabilities(id);
  return Object.fromEntries(Object.entries(caps).map(([key, cap]) => [key, Math.max(cap.min, Math.min(cap.max, Number.isFinite(input[key as StudioControlKey]) ? Math.round(input[key as StudioControlKey]!) : cap.default))])) as StudioControls;
}
export function normalizeOptions(input: StudioOptions = {}): Required<StudioOptions> {
  const replacements = { ...DEFAULT_REPLACEMENTS };
  for (const source of Object.keys(replacements) as PercussionSource[]) if (REPLACEMENT_CHOICES[source].includes(input.replacements?.[source] as KitInstrument)) replacements[source] = input.replacements![source]!;
  const sections: RhythmSection[] = ['mainA', 'mainB', 'fillA', 'fillB', 'intro', 'ending'];
  const cells = new Map<string, CellEdit>();
  for (const edit of (Array.isArray(input.edits) ? input.edits.slice(0, 4096) : [])) {
    if (!edit || !sections.includes(edit.section) || !KIT.includes(edit.instrument) || !Number.isInteger(edit.step) || edit.step < 0 || edit.step > 127) continue;
    if (edit.velocity !== null && !Number.isFinite(edit.velocity)) continue;
    const cell: CellEdit = { section: edit.section, step: edit.step, instrument: edit.instrument, velocity: edit.velocity === null ? null : Math.max(0.05, Math.min(1, edit.velocity)) };
    if (['flam','drag','triplet'].includes(edit.rudiment ?? '') && cell.velocity !== null) cell.rudiment = edit.rudiment;
    if (cell.rudiment === 'triplet') cell.tripletSpan = Number.isFinite(edit.tripletSpan) ? Math.max(1,Math.min(4,Math.round(edit.tripletSpan!))) : 1;
    cells.set(`${cell.section}:${cell.step}:${cell.instrument}`, cell);
  }
  return { songPresetId: SONG_MAPS.some(s=>s.id === input.songPresetId) ? input.songPresetId! : '', kitMode: input.kitMode === 'original' ? 'original' : 'personal', reggaeVariant: input.reggaeVariant === 'two-four' ? 'two-four' : 'one-drop', replacements, edits: [...cells.values()] };
}
const foot = (i: DrumInstrument) => i === 'kick' || i === 'hihat_pedal';
const lead = (i: DrumInstrument) => ['hihat_closed', 'hihat_open', 'ride', 'ride_bell', 'cowbell', 'clave'].includes(i);
const priority = (h: DrumHit) => (h.role === 'essential' ? 100 : 0) + (h.instrument === 'crash' ? 30 : h.instrument.startsWith('tom') ? 25 : ['snare', 'rimshot', 'ride_bell'].includes(h.instrument) ? 20 : h.role === 'ghost' ? 15 : 5);
export function orchestrate(hits: DrumHit[]): DrumHit[] {
  const dedup = new Map<DrumInstrument, DrumHit>();
  for (const h of hits) { const old = dedup.get(h.instrument); if (!old || priority(h) > priority(old)) dedup.set(h.instrument, h); }
  let notes = [...dedup.values()].sort((a, b) => priority(b) - priority(a));
  for (const group of [['snare', 'rimshot'], ['hihat_closed', 'hihat_open'], ['ride', 'ride_bell']]) {
    let found = false;
    notes = notes.filter(h => !group.includes(h.instrument) || (!found && (found = true)));
  }
  let hands = 0;
  notes = notes.filter(h => foot(h.instrument) || ++hands <= 2);
  // A pedal closure cannot coexist with a sustained open articulation.
  if (notes.some(h => h.instrument === 'hihat_open')) notes = notes.filter(h => h.instrument !== 'hihat_pedal');
  return notes;
}
export function composeGroove(id: string, requested: Partial<StudioControls> = {}, input: StudioOptions = {}): RhythmStyle {
  const controls = normalizeStudioControls(id, requested);
  const options = normalizeOptions(input);
  if (options.songPresetId && requested.swing === undefined) controls.swing = getSongMap(options.songPresetId,id).swing;
  const style = arrangeGroove(id, normalizeControls(id, controls), options.songPresetId);
  if (id === '05' && options.reggaeVariant === 'two-four') {
    style.name = 'Reggae · 2 i 4';
    style.description = 'Wariant ćwiczeniowy: stopa i cross-stick razem na 2 i 4, z offbeatowym hi-hatem.';
    style.drumPatternDescription = '1 & 2 & 3 & 4 & · stopa + cross-stick na 2 i 4';
    style.practiceFocus = 'Stopa i cross-stick spotykają się na 2 i 4. Hi-hat podkreśla „&”.';
    for (const p of Object.values(style.sections)) {
      p.steps = p.steps.map(hits => hits.filter(h => !(['kick', 'rimshot'].includes(h.instrument) && h.role === 'essential')));
      for (const index of [4, 12]) if (p.steps[index] && (p !== style.sections.ending)) p.steps[index].push({ instrument: 'kick', velocity: 0.85, role: 'essential' }, { instrument: 'rimshot', velocity: 0.9, role: 'essential' });
      if (p === style.sections.ending) p.steps[0] = [{ instrument: 'kick', velocity: 0.75, role: 'variation' }, { instrument: 'rimshot', velocity: 0.75, role: 'variation' }];
    }
  }
  for (const [section, pattern] of Object.entries(style.sections) as [RhythmSection, RhythmStyle['sections']['mainA']][]) {
    if (section !== 'ending') keys.forEach((key, i) => {
      const amount = controls[key];
      if (!amount) return;
      if (id === '09' && key === 'bellDensity' && (!options.songPresetId || options.songPresetId === '09-1')) {
        const accents = [[0], [18], [10, 22]].slice(0, amount).flat();
        for (const step of accents) {
          const hit = pattern.steps[step].find(h => h.instrument === 'cowbell');
          if (hit) hit.velocity = Math.min(0.95, hit.velocity + 0.15);
        }
        return;
      }
      const positions = VOCABULARY[id][i];
      const inst = VOICE_CONTROLS[key];
      const max = studioCapabilities(id)[key].max;
      const chosen = positions.slice(0, Math.ceil(positions.length * amount / max));
      for (const step of chosen) {
        const hits = pattern.steps[step];
        if (inst === 'ride' || inst === 'ride_bell' || inst === 'hihat_open' || inst === 'crash') {
          // Transfer the right hand, preserving anchor velocity/role and timeline.
          const existing = hits.find(h => inst === 'hihat_open' ? h.instrument === 'hihat_closed' : ['hihat_closed', 'hihat_open', 'ride'].includes(h.instrument));
          if (existing) { existing.instrument = inst; continue; }
        }
        hits.push({ instrument: inst, velocity: inst === 'snare' && ['05', '06', '07', '08'].includes(id) ? 0.32 : inst === 'crash' ? ['04', '06', '08', '10'].includes(id) ? 0.38 : 0.65 : inst.includes('tom') ? 0.45 : inst === 'hihat_pedal' ? 0.3 : 0.5, role: 'variation' });
      }
    });
    pattern.steps = pattern.steps.map(hits => {
      const mapped = hits.map(h => ({ ...h, instrument: options.kitMode === 'personal' ? h.instrument === 'tom_mid' ? 'tom_high' : options.replacements[h.instrument as PercussionSource] ?? h.instrument : h.instrument }));
      // Toms are phrase responses: reclaim the right hand rather than stack it.
      const tom = mapped.some(h => h.instrument.startsWith('tom') && h.role !== 'essential');
      const response = mapped.some(h => ['snare', 'rimshot', 'clave'].includes(h.instrument));
      return orchestrate(tom && response ? mapped.filter(h => !lead(h.instrument) || h.role === 'essential' && ['clave', 'cowbell', 'ride_bell'].includes(h.instrument)) : mapped);
    });
    if (section !== 'ending') ornamentKeys.forEach((key, i) => {
      for (const step of ORNAMENTS[id][i].slice(0, controls[key])) {
        const hits = pattern.steps[step]; if (!hits) continue;
        // Reuse an existing snare/tom. An extra response occupies a free hand,
        // or replaces an optional lead; essential timeline strokes stay intact.
        let hit = hits.find(h => ['snare','rimshot','tom_high','tom_low'].includes(h.instrument));
        if (!hit) {
          const candidate: DrumHit = { instrument: key === 'triplets' ? 'tom_high' : 'snare', velocity: ['04','05','06','07','08','09','10'].includes(id) ? 0.38 : 0.62, role: 'variation' };
          const next = orchestrate([...hits, candidate]);
          if (!next.includes(candidate)) continue;
          pattern.steps[step] = next; hit = candidate;
        }
        hit.rudiment = key === 'flams' ? 'flam' : key === 'drags' ? 'drag' : 'triplet';
        if (hit.rudiment === 'triplet') hit.tripletSpan = 1;
      }
    });
    // Explicit editor overrides apply last. Free edits are visible, never silently corrected.
    for (const edit of options.edits.filter(e => e.section === section)) {
      const hits = pattern.steps[edit.step]; if (!hits) continue;
      pattern.steps[edit.step] = hits.filter(h => h.instrument !== edit.instrument);
      if (edit.velocity !== null) pattern.steps[edit.step].push({ instrument: edit.instrument, velocity: edit.velocity, role: edit.velocity < 0.35 ? 'ghost' : 'variation', ...(edit.rudiment ? { rudiment: edit.rudiment } : {}), ...(edit.rudiment === 'triplet' ? { tripletSpan: Math.min(edit.tripletSpan ?? 1, pattern.steps.length - edit.step) } : {}) });
    }
  }
  return style;
}
export function playability(style: RhythmStyle, section: RhythmSection = 'mainA'): { step: number; reason: string }[] {
  const pattern=style.sections[section];
  const warnings = pattern.steps.flatMap((hits, step) => {
    const warnings: string[] = [];
    if (hits.filter(h => !foot(h.instrument)).length > 2) warnings.push('więcej niż dwa uderzenia rękami jednocześnie');
    for (const pair of [['snare', 'rimshot'], ['hihat_closed', 'hihat_open'], ['ride', 'ride_bell'], ['hihat_open', 'hihat_pedal']]) if (pair.every(inst => hits.some(h => h.instrument === inst))) warnings.push('sprzeczne artykulacje jednego instrumentu');
    return warnings.map(reason => ({ step, reason }));
  });
  // Wider manual triplets may land on later grid cells. Check actual onsets,
  // including grace strokes, instead of treating the glyph as one note.
  if (pattern.steps.flat().some(h=>h.rudiment === 'triplet' && (h.tripletSpan ?? 1)>1)) {
    let time=0;
    const batches=new Map<number,{step:number;instrument:DrumInstrument}[]>();
    pattern.steps.forEach((hits,step)=>{
      hits.forEach(hit=>expandHit(hit,style,pattern,120,step).forEach(stroke=>{
        const at=Math.round((time+stroke.offset)*1e6);
        batches.set(at,[...(batches.get(at) ?? []),{step,instrument:hit.instrument}]);
      }));
      time+=stepDuration(style,pattern,120,step);
    });
    for(const notes of batches.values()) {
      if (notes.filter(n=>!foot(n.instrument)).length>2 && !warnings.some(w=>w.step===notes[0].step)) warnings.push({step:notes[0].step,reason:'triola nakłada więcej niż dwa uderzenia rękami'});
      if (new Set(notes.map(n=>n.instrument)).size<notes.length) warnings.push({step:notes[0].step,reason:'triola nakłada się na inną nutę tego samego instrumentu'});
    }
  }
  return warnings;
}
export function setCell(edits: CellEdit[], edit: CellEdit): CellEdit[] { return normalizeOptions({ edits: [...edits, edit] }).edits; }
/** Shared editor state transition, also available to CLI/MCP consumers. */
export function cycleCell(cell: Omit<CellEdit, 'velocity' | 'rudiment' | 'tripletSpan'>, hit?: DrumHit, velocity = 0.65, clickCount?: number): CellEdit {
  if (clickCount !== undefined && Number.isFinite(clickCount)) {
    const state = (Math.max(1,Math.floor(clickCount))-1)%5;
    return state === 4 ? {...cell,velocity:null} : state === 1 ? {...cell,velocity:.22} : {...cell,velocity:Math.max(.35,velocity), ...(state === 2 ? {rudiment:'drag' as const} : state === 3 ? {rudiment:'flam' as const} : {})};
  }
  if (!hit) return { ...cell, velocity: Math.max(0.35,velocity) };
  if (hit.rudiment === 'flam' || hit.rudiment === 'triplet') return { ...cell, velocity: null };
  if (hit.rudiment === 'drag') return { ...cell, velocity: Math.max(0.35,velocity), rudiment: 'flam' };
  if (hit.role === 'ghost') return { ...cell, velocity: Math.max(0.35,velocity), rudiment: 'drag' };
  return { ...cell, velocity: 0.22 };
}

export function studioLesson(id: string, input: StudioOptions = {}): string[] {
  const options = normalizeOptions(input);
  if (options.songPresetId) { const song = getSongMap(options.songPresetId,id); return [song.note, 'Mapa to krótka aranżacja do ćwiczeń, nie pełna transkrypcja. Rozwijaj ją suwakami i własną edycją.', 'Tempo jest przybliżone; różne wydania i wykonania różnią się. Przy graniu z YouTube dopasuj puls funkcją Tap tempo.']; }
  if (id === '05' && options.reggaeVariant === 'two-four') return ['Hi-hat podkreśla offbeaty: & po każdej ćwierćnucie.', 'Stopa i cross-stick razem na 2 i 4. Jedynka nadal lekka.', 'Dodawaj ciche odpowiedzi, zachowując akcenty 2 i 4.'];
  const lesson = getGroove(id).lesson;
  return options.kitMode === 'personal' ? lesson.map(text => text.replace(/congi/g, 'tomów').replace(/conga/g, 'tom').replace(/dzwonek/g, KIT_NAMES[options.replacements.cowbell ?? DEFAULT_REPLACEMENTS.cowbell].toLowerCase()).replace(/Dzwonek/g, KIT_NAMES[options.replacements.cowbell ?? DEFAULT_REPLACEMENTS.cowbell])) : [...lesson];
}
