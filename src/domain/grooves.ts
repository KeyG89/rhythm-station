import { DrumHit, DrumInstrument, RhythmCategory, RhythmPattern, RhythmSection, RhythmStyle } from '../types/rhythm';

export type ControlKey = 'complexity' | 'ghostNotes' | 'kickDensity' | 'hihatDensity' | 'swing' | 'humanize';
export type GrooveControls = Record<ControlKey, number>;
type Addition = [DrumInstrument, number[], number?];
export interface Capability {
  min: number; max: number; default: number; description: string; levels?: string[];
}
export interface GrooveDefinition {
  style: RhythmStyle;
  tag: string;
  count: string;
  lesson: string[];
  tempo: [number, number];
  controls: Record<ControlKey, Capability>;
  additions: Record<'complexity' | 'ghostNotes' | 'kickDensity' | 'hihatDensity', Addition[][]>;
}
const stage = (description: string, levels: string[], max = 3): Capability => ({ min: 0, max, default: 0, description, levels });
const locked = (description: string): Capability => stage(description, ['Stałe'], 0);
const range = (min: number, max: number, value: number, description: string): Capability => ({ min, max, default: value, description });
const seq = (n: number, by = 1, offset = 0) => Array.from({ length: Math.ceil((n - offset) / by) }, (_, i) => offset + i * by);
function pattern(meter: [number, number], spb: number, bars: number, notes: Addition[]): RhythmPattern {
  const steps: DrumHit[][] = Array.from({ length: meter[0] * spb * bars }, () => []);
  for (const [instrument, indices, velocity = 0.8] of notes) {
    for (const index of indices) steps[index].push({ instrument, velocity, role: 'essential' });
  }
  return { steps, stepsPerBeat: spb, timeSignature: meter, bars };
}
interface Spec {
  id: string; name: string; category: RhythmCategory; bpm: number; meter?: [number, number]; spb?: number; bars?: number;
  tag: string; count: string; description: string; focus: string; lesson: string[]; tempo: [number, number];
  notes: Addition[]; complexity: Addition[][]; ghost: number[][]; kick: number[][]; hat: Addition[][];
  explanations: [string, string, string, string]; swing?: [number, number, number]; groups?: number[];
}
function define(s: Spec): GrooveDefinition {
  const meter = s.meter ?? [4, 4];
  const essential = pattern(meter, s.spb ?? 4, s.bars ?? 1, s.notes);
  // Authored dynamic phrasing: light offbeats, except reggae which leans on the &.
  essential.steps.forEach((hits, i) => hits.forEach(hit => {
    if (hit.instrument === 'hihat_closed') hit.velocity *= s.id === '05' ? (i % 4 === 2 ? 1.3 : 0.7) : (i % essential.stepsPerBeat === 0 ? 1.1 : 0.8);
  }));
  // A fill is a brief, style-aware response. Preserve the timeline ostinato and all anchors.
  const makeResponse = (rich: boolean) => {
    const p = structuredClone(essential);
    const last = p.steps.length - 1;
    const instrument: DrumInstrument = s.id === '05' || s.id === '06' ? 'rimshot' : s.id === '08' || s.id === '09' ? 'conga_high' : 'snare';
    for (const index of rich ? [last - 2, last] : [last]) {
      if (!p.steps[index].some(h => h.instrument === instrument)) p.steps[index].push({ instrument, velocity: 0.45, role: 'variation' });
    }
    return p;
  };
  const ending = structuredClone(essential);
  ending.steps = ending.steps.map((hits, i) => i < essential.stepsPerBeat ? hits : []);
  const controls: GrooveDefinition['controls'] = {
    complexity: stage(s.explanations[0], ['Esencja', 'Odpowiedź', 'Rozwinięcie', 'Pełna fraza'], s.complexity.length),
    ghostNotes: s.ghost.length ? stage(s.explanations[1], ['Bez duszków', 'Jeden gest', 'Dialog', 'Pełny dialog'], s.ghost.length) : locked(s.explanations[1]),
    kickDensity: s.kick.length ? stage(s.explanations[2], ['Szkielet', 'Antycypacja', 'Synkopa', 'Pełna fraza'], s.kick.length) : locked(s.explanations[2]),
    hihatDensity: stage(s.explanations[3], ['Ostinato', 'Jedna odpowiedź', 'Dwie odpowiedzi', 'Pełna faktura'], s.hat.length),
    swing: s.swing ? range(...s.swing, 'Proporcja długiej i krótkiej nuty. 67% ≈ podział triolowy.') : range(50, 50, 50, 'Ten wariant uczy prostego podziału; swing zmieniłby jego charakter.'),
    humanize: range(0, 12, 0, 'Kontrolowane mikroprzesunięcia do 12 ms i delikatna dynamika. Puls pozostaje stabilny.'),
  };
  const style: RhythmStyle = {
    id: s.id, name: s.name, category: s.category, defaultBpm: s.bpm, timeSignature: meter,
    bpmUnit: s.id === '09' ? 'dotted-quarter' : 'quarter', pulseGroups: s.groups,
    description: s.description, drumPatternDescription: s.count, practiceFocus: s.focus,
    sections: { mainA: essential, mainB: makeResponse(true), fillA: makeResponse(false), fillB: makeResponse(true), intro: structuredClone(essential), ending },
  };
  return { style, tag: s.tag, count: s.count, tempo: s.tempo, lesson: s.lesson, controls, additions: {
    complexity: s.complexity, ghostNotes: s.ghost.map(indices => [['snare', indices, 0.24]]),
    kickDensity: s.kick.map(indices => [['kick', indices, s.id === '04' ? 0.24 : s.id === '06' ? 0.38 : 0.65]]), hihatDensity: s.hat,
  } };
}

export const GROOVES: GrooveDefinition[] = [
  define({ id: '00', name: 'Straight Rock 8th', category: '8BEAT', bpm: 100, tag: 'Prosty puls', count: '1 & 2 & 3 & 4 &', tempo: [40, 200],
    description: 'Równe ósemki, stopa na 1 i 3, werbel na 2 i 4. Punkt odniesienia dla całej kolekcji.', focus: 'Równa prawa ręka i stabilny backbeat.',
    lesson: ['Zagraj ósemki jedną ręką, akcentując cyfry.', 'Dodaj stopę na 1 i 3; werbel na 2 i 4.', 'Wycisz stopę i odtwórz ją samodzielnie przez 8 taktów.'],
    notes: [['hihat_closed', seq(16, 2), 0.55], ['kick', [0, 8], 0.9], ['snare', [4, 12], 0.9]],
    complexity: [[['hihat_open', [14], 0.45]], [['hihat_pedal', [4, 12], 0.3]], [['tom_low', [15], 0.4]]],
    ghost: [[7], [11], [15]], kick: [[6], [14], [10]], hat: [[['hihat_closed', [3], 0.32]], [['hihat_closed', [7, 11], 0.32]], [['hihat_closed', [15], 0.32]]],
    explanations: ['Otwarcie hi-hatu i krótka odpowiedź tomu na końcu taktu.', 'Ciche nuty przed backbeatem, bez zmiany akcentów 2 i 4.', 'Ósemkowe antycypacje stopy; bez ciągłych szesnastek.', 'Krótkie szesnastkowe odpowiedzi przy stałych ósemkach.'] }),
  define({ id: '01', name: 'Funk 16th', category: 'FUNK_SOUL', bpm: 95, tag: 'Synkopa', count: '1 e & a 2 e & a 3 e & a 4 e & a', tempo: [40, 160], swing: [50, 60, 50],
    description: 'Szesnastkowa siatka z synkopowaną stopą i wyraźnym werblem na 2 i 4.', focus: 'Rozdziel dynamikę hi-hatu, duszków i backbeatu.',
    lesson: ['Policz głośno wszystkie szesnastki.', 'Stopa: 1, a pierwszej ćwierćnuty i & trzeciej.', 'Duszek ma być wyraźnie cichszy niż backbeat.'],
    notes: [['hihat_closed', seq(16), 0.48], ['kick', [0, 3, 10], 0.85], ['snare', [4, 12], 0.92]],
    complexity: [[['hihat_open', [14], 0.5]], [['rimshot', [6], 0.45]], [['cowbell', [0, 6, 10], 0.4]]],
    ghost: [[7], [9], [15]], kick: [[6], [14], [11]], hat: [[['hihat_pedal', [4], 0.3]], [['hihat_pedal', [12], 0.3]], [['shaker', [2, 6, 10, 14], 0.25]]],
    explanations: ['Otwarcie hi-hatu, cross-stick i funkowe akcenty dzwonka.', 'Zapisany dialog duszków pomiędzy mocnymi 2 i 4.', 'Pojedyncze synkopy szesnastkowe, bez podwójnej stopy.', 'Hi-hat już gra szesnastki: suwak dodaje lewą stopę i shaker.'] }),
  define({ id: '02', name: 'Half-Time Hip-Hop', category: 'DISCO_DANCE', bpm: 80, tag: 'Half-time', count: '1 & 2 & 3 & 4 & · werbel na 3', tempo: [40, 130], swing: [50, 62, 50],
    description: 'Dużo przestrzeni. Jeden mocny backbeat na 3, zamiast rockowego 2 i 4.', focus: 'Utrzymuj podział, gdy werbel pojawia się dwa razy rzadziej.',
    lesson: ['Prawa ręka gra ósemki, a werbel tylko na 3.', 'Nie przyspieszaj w pustej przestrzeni przed werblem.', 'Wycisz werbel i pilnuj jego miejsca samodzielnie.'],
    notes: [['hihat_closed', seq(16, 2), 0.48], ['kick', [0, 6], 0.85], ['snare', [8], 0.95]],
    complexity: [[['hihat_open', [14], 0.4]], [['rimshot', [12], 0.3]], [['shaker', [2, 10], 0.3]]],
    ghost: [[7], [11], [15]], kick: [[14], [3]], hat: [[['hihat_closed', [3], 0.3]], [['hihat_closed', [7], 0.3]], [['hihat_closed', [13, 15], 0.3]]],
    explanations: ['Drobne odpowiedzi w przestrzeni; werbel nadal wyłącznie na 3.', 'Ciche wejście w backbeat i odpowiedzi po nim.', 'Nieliczne synkopy; maksymalnie dwie dodatkowe stopy.', 'Krótkie zakończenia szesnastkowe, zamiast losowych rolli.'] }),
  define({ id: '03', name: 'Shuffle', category: 'ROCK_BLUES', bpm: 110, spb: 2, tag: 'Długa–krótka', count: '1 a 2 a 3 a 4 a', tempo: [40, 190], swing: [60, 72, 67],
    description: 'Ósemki o triolowym oddechu: długa, krótka. Werbel na 2 i 4.', focus: 'Zachowaj tę samą proporcję długiej i krótkiej nuty.',
    lesson: ['Powiedz „tri-o-la”, pomijając środkową sylabę.', 'Hi-hat gra pierwszą i trzecią nutę trioli.', 'Porównaj z Straight Rock przy tym samym tempie.'],
    notes: [['hihat_closed', seq(8), 0.55], ['kick', [0, 4], 0.85], ['snare', [2, 6], 0.9]],
    complexity: [[['hihat_open', [7], 0.4]], [['hihat_pedal', [2, 6], 0.3]], [['tom_low', [7], 0.4]]],
    ghost: [[3], [5], [7]], kick: [[5], [1]], hat: [[['hihat_pedal', [0], 0.3]], [['hihat_pedal', [4], 0.3]]],
    explanations: ['Krótka odpowiedź na końcu triolowej frazy.', 'Duszki wyłącznie w zapisanych krótkich częściach par.', 'Antycypacje w triolowej siatce, bez zmiany backbeatu.', 'Prawa ręka jest pełna; dodawaj niezależność lewej stopy.'] }),
  define({ id: '04', name: 'Jazz Swing', category: 'JAZZ_SWING', bpm: 140, spb: 2, tag: 'Ride & comping', count: 'ding · ding-da · ding · ding-da', tempo: [50, 240], swing: [58, 72, 67],
    description: 'Ride prowadzi swing, hi-hat lewą stopą na 2 i 4. Werbel odpowiada, zamiast grać rockowy backbeat.', focus: 'Niezależność ride’u i hi-hatu nogą; lekki comping.',
    lesson: ['Zagraj sam ride i hi-hat nogą na 2 i 4.', 'Stopa jest bardzo cicha: feathering, nie rockowy akcent.', 'Dodawaj pojedyncze odpowiedzi werbla, nie zagłuszając ride’u.'],
    notes: [['ride', [0, 2, 3, 4, 6, 7], 0.62], ['hihat_pedal', [2, 6], 0.7], ['kick', [0, 2, 4, 6], 0.23]],
    complexity: [[['snare', [3], 0.5]], [['snare', [5], 0.42]], [['snare', [1], 0.45]]], ghost: [[7], [4]], kick: [[7]], hat: [[['ride', [1], 0.35]], [['ride', [5], 0.35]]],
    explanations: ['Trzy zapisane odpowiedzi compingu zamiast backbeatu.', 'Ciche odpowiedzi werbla w swingowej frazie.', 'Jedna lekka antycypacja, feathering pozostaje cichy.', 'W tym groovie suwak rozwija ride; hi-hat nogą zachowuje 2 i 4.'] }),
  define({ id: '05', name: 'Reggae One Drop', category: 'LATIN', bpm: 75, swing: [50, 62, 50], tag: 'Pusta jedynka', count: '1 & 2 & 3 & 4 & · stopa + obręcz na 3', tempo: [40, 130],
    description: 'Stopa i cross-stick spotykają się na 3. Pierwsza miara pozostaje wolna od stopy.', focus: 'Poczuj ciężar na 3 i oddech przed nim.',
    lesson: ['Zostaw jedynkę pustą dla stopy i werbla.', 'Na 3 zagraj stopę i cross-stick razem.', 'Słuchaj akcentów hi-hatu na „&”.'],
    notes: [['hihat_closed', seq(16, 2), 0.45], ['kick', [8], 0.85], ['rimshot', [8], 0.9]],
    complexity: [[['hihat_open', [14], 0.4]], [['rimshot', [6], 0.35]], [['shaker', [2, 6, 10, 14], 0.3]]],
    ghost: [[7], [11], [15]], kick: [[14], [6]], hat: [[['hihat_closed', [7], 0.28]], [['hihat_closed', [15], 0.28]]],
    explanations: ['Otwarcie hi-hatu, lekka antycypacja obręczy i shaker na offbeatach.', 'Ciche podprowadzenie werbla do akcentu i krótkie odpowiedzi; obręcz pozostaje głosem głównym.', 'Dwie oszczędne antycypacje na &4 i &2. Bez stopy na 1 i bez podwójnego pedału.', 'Dwa krótkie podprowadzenia hi-hatu do kolejnych akcentów.'] }),
  define({ id: '06', name: 'Bossa Nova', category: 'LATIN', bpm: 115, bars: 2, swing: [50, 56, 50], tag: 'Brazylijska fraza', count: 'Dwa takty · obręcz 3+2 · cicha stopa', tempo: [50, 180],
    description: 'Cicha stopa samba, równe ósemki i dwutaktowa brazylijska fraza cross-stick.', focus: 'Nie akcentuj jak w rocku. Utrzymaj łagodną stopę.',
    lesson: ['Stopa gra 1, &2, 3, &4 w każdym takcie.', 'Obręcz: 1, &2, 4 | 2, &3 — pełne dwa takty.', 'Nie myl tej frazy z kubańską son clave.'],
    notes: [['hihat_closed', seq(32, 2), 0.4], ['kick', [0, 6, 8, 14, 16, 22, 24, 30], 0.5], ['rimshot', [0, 6, 12, 20, 26], 0.7]],
    complexity: [[['hihat_pedal', [4, 12, 20, 28], 0.3]], [['conga_high', [10, 28], 0.4]], [['shaker', seq(32, 4, 2), 0.25]]],
    ghost: [[11, 27], [15, 31]], kick: [[12], [28]], hat: [[['hihat_closed', [7, 23], 0.25]], [['hihat_closed', [15, 31], 0.25]]],
    explanations: ['Lewa stopa na 2 i 4, odpowiedzi congi i dyskretny shaker.', 'Bardzo ciche dotknięcia werbla po akcentach obręczy, bez rockowego backbeatu.', 'Dwie ciche odpowiedzi na 4 w dwutaktowej frazie. Stałe ostinato pozostaje lekkie.', 'Delikatne szesnastkowe podprowadzenia na końcach półtaktów.'] }),
  define({ id: '07', name: 'Samba', category: 'LATIN', bpm: 105, tag: 'Ostinato stopy', count: '1 e & a 2 e & a 3 e & a 4 e & a', tempo: [50, 180],
    description: 'Stała stopa na ćwierćnutach i ich szesnastkowych przednutach; szesnastkowy puls ręki.', focus: 'Rozdziel stałe ostinato nóg od synkopowanych rąk.',
    lesson: ['Stopa: 1, a1, 2, a2, 3, a3, 4, a4.', 'Ćwicz powoli, bez podwójnego pedału.', 'Dodaj obręcz, utrzymując ostinato stopy bez zmian.'],
    notes: [['kick', [0, 3, 4, 7, 8, 11, 12, 15], 0.6], ['hihat_closed', seq(16), 0.42], ['rimshot', [0, 6, 10, 12], 0.65]],
    complexity: [[['tambourine', [2, 6, 10, 14], 0.38]], [['conga_low', [4, 12], 0.42]], [['conga_high', [7, 15], 0.4]]],
    ghost: [[5], [9]], kick: [], hat: [[['hihat_pedal', [4, 12], 0.35]], [['shaker', [2, 6, 10, 14], 0.3]]],
    explanations: ['Tamburyn i dialog congi nad ostinatem samba.', 'Dwa lekkie dotknięcia werbla między akcentami obręczy.', 'Samba ma już gęste, określone ostinato stopy. Zachowujemy je.', 'Hi-hat gra szesnastki; dodawaj lewą stopę i dyskretną fakturę shakera.'] }),
  define({ id: '08', name: 'Afro-Cuban Clave', category: 'LATIN', bpm: 105, bars: 2, tag: 'Son clave 3–2', count: '1, &2, 4 | 2, 3 · dwa takty', tempo: [40, 180],
    description: 'Pięć uderzeń son clave 3–2 organizuje pełną dwutaktową frazę. Tumbao antycypuje mocne miary.', focus: 'Usłysz asymetrię 3–2 bez odwracania stron frazy.',
    lesson: ['Najpierw zagraj tylko clave: 1, &2, 4 | 2, 3.', 'Stopa na &2 i 4 w każdym takcie, bez rockowej jedynki.', 'Dodaj dialog congi, nie przesuwając pięciu nut clave.'],
    notes: [['clave', [0, 6, 12, 20, 24], 0.78], ['hihat_closed', seq(32, 4), 0.35], ['kick', [6, 12, 22, 28], 0.6]],
    complexity: [[['conga_low', [14, 30], 0.65]], [['conga_high', [4, 10, 18, 26], 0.5]], [['cowbell', [0, 4, 10, 14, 16, 20, 26, 30], 0.4]]],
    ghost: [], kick: [], hat: [[['hihat_closed', [2, 18], 0.3]], [['hihat_closed', [10, 26], 0.3]], [['hihat_closed', [6, 14, 22, 30], 0.3]]],
    explanations: ['Tumbao congi i zapisane odpowiedzi dzwonka nad stałą clave.', 'Odpowiedzi gra conga, nie funkowe duszki werbla.', 'Stopa zachowuje tumbao; dodatkowe downbeaty zmieniałyby lekcję.', 'Rozwiń ćwierćnuty hi-hatu do ósemek przez zapisane odpowiedzi.'] }),
  define({ id: '09', name: 'Afro 6/8', category: 'LATIN', bpm: 70, meter: [6, 8], spb: 2, bars: 2, groups: [3, 3], tag: 'Dwa pulsy, sześć ósemek', count: '1 la li 2 la li | 1 la li 2 la li · dzwonek 7 nut', tempo: [30, 150],
    description: 'Siedem uderzeń dzwonka w dwóch taktach 6/8. Każdy takt ma dwa pulsy, po trzy ósemki.', focus: 'Utrzymaj puls 3+3 pod asymetryczną frazą dzwonka.',
    lesson: ['Tempo liczymy w ćwierćnutach z kropką: dwa pulsy na takt.', 'Dzwonek: ósemki 1, 3, 5, 6 | 2, 4, 6 — powtarzaj oba takty.', 'Najpierw graj sam dzwonek, potem dodaj stopę na obu pulsach.'],
    notes: [['cowbell', [0, 4, 8, 10, 14, 18, 22], 0.65], ['kick', [0, 6, 12, 18], 0.75], ['snare', [6, 18], 0.65], ['hihat_pedal', [0, 6, 12, 18], 0.4]],
    complexity: [[['conga_low', [2, 16], 0.45]], [['conga_high', [10, 22], 0.5]], [['tom_low', [4, 14], 0.4]]],
    ghost: [[2, 14], [10, 22]], kick: [[10, 22]], hat: [[['hihat_closed', [2, 8, 14, 20], 0.3]], [['hihat_closed', [4, 10, 16, 22], 0.3]]],
    explanations: ['Dialog bębnów nad stałą siedmionutową frazą dzwonka.', 'Ciche nuty na wewnętrznych ósemkach grup.', 'Jedna antycypacja w każdym takcie przed kolejnym pulsem głównym.', 'Dopełnianie grup po trzy, bez prostowania metrum.'] }),
  define({ id: '10', name: 'Waltz 3/4', category: 'TRADITIONAL', bpm: 100, meter: [3, 4], tag: 'Trzy miary', count: '1 & 2 & 3 &', tempo: [40, 180],
    description: 'Trzy ćwierćnuty: ciężar na 1, lekkie odpowiedzi na 2 i 3.', focus: 'Poczuj powrót po trzeciej mierze, bez dodawania czwartej.',
    lesson: ['Policz 1–2–3 i zaakcentuj tylko 1.', 'Stopa na 1; lekki cross-stick na 2 i 3.', 'Dodaj ósemki, nie zmieniając trzyczęściowego oddechu.'],
    notes: [['kick', [0], 0.8], ['rimshot', [4, 8], 0.6], ['hihat_closed', seq(12, 2), 0.45]],
    complexity: [[['hihat_open', [10], 0.35]], [['tom_low', [11], 0.4]]], ghost: [[7], [11]], kick: [[10]], hat: [[['hihat_closed', [3], 0.28]], [['hihat_closed', [7], 0.28]], [['hihat_closed', [11], 0.28]]],
    explanations: ['Odpowiedź na końcu trzeciej miary, bez czwartej ćwierćnuty.', 'Dwa delikatne podprowadzenia do kolejnych miar.', 'Jedna lekka antycypacja powrotu na 1.', 'Szesnastkowe odpowiedzi w każdym z trzech odcinków.'] }),
  define({ id: '11', name: 'Balkan 7/8', category: 'TRADITIONAL', bpm: 100, meter: [7, 8], spb: 2, groups: [2, 2, 3], tag: 'Krótka–krótka–długa', count: '1 2 · 1 2 · 1 2 3', tempo: [40, 180],
    description: 'Siedem ósemek w grupach 2+2+3. Dwa krótkie kroki i jeden długi.', focus: 'Przestań liczyć do siedmiu: usłysz trzy nierówne grupy.',
    lesson: ['Powiedz „krótka, krótka, długa”: 2+2+3.', 'Stopa rozpoczyna pierwszą i trzecią grupę, werbel drugą.', 'BPM oznacza ćwierćnutę; pojedyncza ósemka trwa połowę jej czasu.'],
    notes: [['hihat_closed', seq(14, 2), 0.5], ['kick', [0, 8], 0.85], ['snare', [4], 0.8], ['rimshot', [12], 0.6]],
    complexity: [[['tom_low', [10], 0.45]], [['tambourine', [0, 4, 8], 0.38]], [['tom_high', [13], 0.38]]],
    ghost: [[3], [7], [11]], kick: [[12], [6]], hat: [[['hihat_closed', [3], 0.3]], [['hihat_closed', [7], 0.3]], [['hihat_closed', [13], 0.3]]],
    explanations: ['Odpowiedź w długiej grupie i akcenty 2+2+3.', 'Duszki podprowadzają do początku kolejnych grup.', 'Dwie zapisane ósemkowe odpowiedzi bez zmiany 2+2+3.', 'Szesnastkowe zakończenia każdej nierównej grupy.'] }),
];

export function getGroove(id: string): GrooveDefinition {
  const groove = GROOVES.find(g => g.style.id === id);
  if (!groove) throw new Error(`Unknown groove: ${id}`);
  return groove;
}
export function defaultControls(id: string): GrooveControls {
  return Object.fromEntries(Object.entries(getGroove(id).controls).map(([key, cap]) => [key, cap.default])) as GrooveControls;
}
export function normalizeControls(id: string, controls: Partial<GrooveControls>): GrooveControls {
  const groove = getGroove(id);
  return Object.fromEntries(Object.entries(groove.controls).map(([key, cap]) => {
    const value = controls[key as ControlKey];
    const safe = typeof value === 'number' && Number.isFinite(value) ? value : cap.default;
    return [key, Math.max(cap.min, Math.min(cap.max, Math.round(safe)))];
  })) as GrooveControls;
}
export function arrangeGroove(id: string, requested: Partial<GrooveControls> = {}): RhythmStyle {
  const groove = getGroove(id);
  const controls = normalizeControls(id, requested);
  const style = structuredClone(groove.style);
  for (const section of Object.keys(style.sections) as RhythmSection[]) {
    const p = style.sections[section];
    p.swingRatio = controls.swing;
    p.swingStepGroup = id === '05' ? 2 : 1;
    if (section === 'ending') continue;
    for (const key of ['complexity', 'ghostNotes', 'kickDensity', 'hihatDensity'] as const) {
      const amount = section === 'mainB' && key === 'complexity' ? Math.max(1, controls[key]) : controls[key];
      for (const additions of groove.additions[key].slice(0, amount)) {
        for (const [instrument, indices, velocity = 0.55] of additions) {
          for (const index of indices) {
            const step = p.steps[index];
            if (!step || step.some(h => h.instrument === instrument)) continue;
            step.push({ instrument, velocity, role: key === 'ghostNotes' ? 'ghost' : 'variation' });
          }
        }
      }
    }
    // Two simultaneous articulations of one hi-hat are not a playable hand part.
    p.steps = p.steps.map(hits => hits.some(h => h.instrument === 'hihat_open')
      ? hits.map(h => h.instrument === 'hihat_closed' ? { ...h, instrument: 'hihat_open' as const } : h).filter((h, i, a) => a.findIndex(other => other.instrument === h.instrument) === i)
      : hits);
  }
  return style;
}
