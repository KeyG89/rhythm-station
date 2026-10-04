import metadata from './songMetadata.json';
import { DrumHit, DrumInstrument, RhythmStyle } from '../types/rhythm';

type Lane = [instrument: DrumInstrument, positions: number[], velocity?: number, rudiment?: DrumHit['rudiment']];
const E8 = [0,2,4,6,8,10,12,14];
const E16 = Array.from({length:16},(_,i)=>i);
const JAZZ = [0,2,3,4,6,7];
const CLAVE = [0,6,12,20,24];
const BELL = [0,4,8,10,14,18,22];
const bossaHat = [...E8,...E8.map(i=>i+16)];
const bossaKick = [0,6,8,14,16,22,24,30];
const sambaKick = [0,3,4,7,8,11,12,15];
const sambaHat = E8;
// Every entry is a written practice phrase. No random placements or hash-derived
// recipes. Shared ostinatos are intentional; song-specific feet/answers differ.
const PHRASES: Record<string,Lane[]> = {
  '00-1': [['hihat_closed',E8,.55],['kick',[0,3,8,10],.82],['snare',[4,12],.9]],
  '00-2': [['hihat_closed',E8,.5],['kick',[0,6,8,11],.85],['snare',[4,12],.88],['hihat_open',[14],.55]],
  '00-3': [['hihat_closed',E8,.62],['kick',[0,2,8,11,14],.9],['snare',[4,12],.92]],
  '00-4': [['hihat_closed',E8,.52],['kick',[0,8],.8],['snare',[4,12],.82]],
  '00-5': [['hihat_closed',E8,.58],['kick',[0,6,8,10,14],.82],['snare',[4,12],.88]],
  '01-1': [['hihat_closed',E16,.46],['kick',[0,3,6,10],.8],['snare',[4,12],.86],['snare',[7,11,15],.2]],
  '01-2': [['hihat_closed',E8,.58],['kick',[0,3,6,8,10],.82],['snare',[4,12],.84],['snare',[7,15],.2],['hihat_open',[14],.5]],
  '01-3': [['hihat_closed',E16,.42],['kick',[0,6,10,14],.75],['snare',[4,12],.8],['snare',[3,7,9,15],.22]],
  '01-4': [['hihat_closed',E16,.5],['kick',[0,6,8,11],.78],['snare',[4,12],.88],['snare',[2,7,10,15],.22]],
  '01-5': [['hihat_closed',E8,.6],['kick',[0,6,9],.8],['snare',[4,12,14],.78],['snare',[3,7,11],.19]],
  '02-1': [['hihat_closed',E8,.55],['kick',[0,3,10,14],.86],['snare',[8],.9]],
  '02-2': [['hihat_closed',E8,.44],['kick',[0,6,11],.8],['snare',[8],.82]],
  '02-3': [['hihat_closed',E8,.4],['kick',[0,7,10,15],.78],['snare',[8],.8],['hihat_closed',[13],.28,'triplet']],
  '02-4': [['hihat_closed',E8,.5],['kick',[0,3,6,14],.9],['snare',[8],.88],['hihat_closed',[15],.38,'triplet']],
  '02-5': [['hihat_closed',E8,.38],['kick',[0,5,10],.75],['snare',[8],.8],['hihat_closed',[11,15],.32]],
  '03-1': [['hihat_closed',[0,1,2,3,4,5,6,7],.5],['kick',[0,2,4,6],.8],['snare',[2,6],.8]],
  '03-2': [['ride',[0,1,2,3,4,5,6,7],.5],['kick',[0,3,4,7],.78],['snare',[2,6],.85]],
  '03-3': [['hihat_closed',[0,1,2,3,4,5,6,7],.55],['kick',[0,4,5],.8],['snare',[2,6],.82]],
  '03-4': [['hihat_closed',[0,1,2,3,4,5,6,7],.5],['kick',[0,3,5],.85],['snare',[4],.9],['snare',[1,5,7],.2],['hihat_open',[7],.4]],
  '03-5': [['hihat_closed',[0,1,2,3,4,5,6,7],.52],['kick',[0,2,5,7],.8],['snare',[4],.88],['snare',[1,3,5],.22]],
  '04-1': [['ride',JAZZ,.55],['hihat_pedal',[2,6],.35],['kick',[0,4],.18],['snare',[3,7],.35]],
  '04-2': [['ride',JAZZ,.58],['hihat_pedal',[2,6],.38],['kick',[0,2,4,6],.18],['snare',[1,5],.35]],
  '04-3': [['ride',JAZZ,.45],['hihat_pedal',[2,6],.3],['kick',[0],.16],['snare',[5],.32]],
  '04-4': [['ride',JAZZ,.5],['hihat_pedal',[2,6],.3],['snare',[1,6],.36],['snare',[5],.2]],
  '04-5': [['ride',JAZZ,.6],['hihat_pedal',[2,6],.4],['kick',[0,4],.2],['snare',[3,6],.45],['snare',[5],.3,'drag']],
  '05-1': [['hihat_closed',E8,.42],['kick',[8],.68],['rimshot',[8],.7]],
  '05-2': [['hihat_closed',E8,.43],['kick',[8],.7],['rimshot',[8,14],.62]],
  '05-3': [['hihat_closed',E8,.4],['kick',[8,14],.67],['rimshot',[8],.68]],
  '05-4': [['hihat_closed',E8,.38],['kick',[8],.6],['rimshot',[8,6],.6],['hihat_open',[14],.38],['snare',[15],.2]],
  '05-5': [['hihat_closed',E8,.4],['kick',[8,6],.65],['rimshot',[8],.65],['snare',[7,15],.18]],
  '06-1': [['hihat_closed',bossaHat,.36],['kick',bossaKick,.4],['rimshot',[0,6,12,20,26],.5]],
  '06-2': [['hihat_closed',bossaHat,.32],['kick',bossaKick,.38],['rimshot',[0,6,14,20,26],.45]],
  '06-3': [['hihat_closed',bossaHat,.35],['kick',bossaKick,.42],['rimshot',[0,6,12,18,24,30],.5]],
  '06-4': [['ride',bossaHat,.36],['kick',bossaKick,.4],['rimshot',[0,6,12,20,26],.47],['snare',[15,31],.18]],
  '06-5': [['hihat_closed',bossaHat,.4],['kick',bossaKick,.42],['rimshot',[0,6,12,20,28],.5],['hihat_open',[14,30],.32]],
  '07-1': [['hihat_closed',sambaHat,.42],['kick',sambaKick,.55],['rimshot',[2,6,10,14],.5],['tom_high',[5,13],.35],['tom_low',[4,12],.4]],
  '07-2': [['hihat_closed',sambaHat,.46],['kick',sambaKick,.52],['rimshot',[2,8,14],.5],['tom_high',[5,11],.38],['tom_low',[4,12],.4]],
  '07-3': [['ride',sambaHat,.4],['kick',sambaKick,.45],['rimshot',[2,6,10,14],.42],['tom_high',[7,15],.32]],
  '07-4': [['hihat_closed',sambaHat,.45],['kick',sambaKick,.6],['rimshot',[2,10,14],.6],['tom_high',[5,13],.4],['tom_low',[4,12],.42]],
  '07-5': [['ride',sambaHat,.5],['kick',sambaKick,.62],['snare',[4,12],.7],['tom_high',[6,14],.42],['tom_low',[7,15],.48]],
  '08-1': [['clave',CLAVE,.5],['cowbell',[0,4,8,12,16,20,24,28],.48],['kick',[0,10,16,26],.56],['conga_high',[2,14,18,30],.42],['conga_low',[8,24],.4]],
  '08-2': [['clave',CLAVE,.54],['cowbell',[0,2,4,8,10,12,16,18,20,24,26,28],.5],['kick',[14,30],.5],['conga_high',[2,10,18,26],.4],['conga_low',[8,24],.45]],
  '08-3': [['clave',CLAVE,.52],['cowbell',[0,4,8,12,16,20,24,28],.5],['kick',[6,14,22,30],.55],['conga_high',[2,10,18,26],.42],['conga_low',[8,24],.45]],
  '08-4': [['clave',CLAVE,.42],['hihat_closed',[0,4,8,12,16,20,24,28],.32],['kick',[14,30],.4],['conga_high',[2,10,18,26],.35],['conga_low',[8,24],.4]],
  '08-5': [['clave',CLAVE,.48],['hihat_closed',bossaHat,.42],['kick',[0,8,16,24],.62],['conga_high',[2,10,18,26],.4],['conga_low',[14,30],.42]],
  '09-1': [['cowbell',BELL,.5],['kick',[0,12],.62],['conga_low',[0,8,16],.45],['conga_high',[4,10,14,22],.45],['hihat_pedal',[6,18],.32]],
  '09-2': [['ride',[0,2,4,6,8,10,12,14,16,18,20,22],.42],['kick',[0,12],.22],['snare',[6,18],.38],['snare',[10,22],.2]],
  '09-3': [['ride',[0,2,4,6,8,10,12,14,16,18,20,22],.45],['kick',[0,12],.2],['hihat_pedal',[6,18],.32],['snare',[8,20],.28]],
  '09-4': [['hihat_closed',[0,2,4,6,8,10,12,14,16,18,20,22],.36],['kick',[0,12],.48],['snare',[6,18],.55]],
  '09-5': [['ride',[0,2,4,6,8,10,12,14,16,18,20,22],.42],['kick',[0,10,12,22],.48],['snare',[6,18],.55]],
  '10-1': [['hihat_closed',[0,2,4,6,8,10],.36],['kick',[0],.5],['snare',[8],.5]],
  '10-2': [['hihat_closed',[0,2,4,6,8,10],.4],['kick',[0,6],.6],['snare',[8],.64]],
  '10-3': [['ride',[0,2,4,6,8,10],.6],['kick',[0,6],.78],['snare',[4,8],.85],['tom_high',[11],.5,'triplet']],
  '10-4': [['hihat_closed',[0,2,4,6,8,10],.34],['kick',[0],.52],['snare',[8],.5],['tom_low',[6],.38]],
  '10-5': [['hihat_closed',[0,4,8],.35],['kick',[0],.48],['rimshot',[4,8],.4]],
  '11-1': [['hihat_closed',[0,2,4,6,8,10,12],.6],['kick',[0,2,8,12],.85],['snare',[4,10],.85]],
  '11-2': [['hihat_closed',[0,2,4,6,8,10,12],.4],['kick',[0,6,10],.62],['snare',[4,8,12],.62]],
  '11-3': [['ride',[0,2,4,6,8,10,12],.55],['kick',[0,8,12],.7],['snare',[4,10],.8]],
  '11-4': [['hihat_closed',[0,2,4,6,8,10,12],.6],['kick',[0,6,8,12],.86],['snare',[4,10],.88],['tom_low',[13],.5]],
  '11-5': [['ride',[0,2,4,6,8,10,12],.55],['kick',[0,4,8],.75],['snare',[6,12],.8],['tom_high',[11],.4]],
};

export const SONG_MAPS = metadata.map(song => ({ ...song, lanes: PHRASES[song.id], swing: song.id === '01-4' ? 60 : song.grooveId === '03' ? 67 : song.grooveId === '04' ? 67 : 50 }));
export type SongMap = typeof SONG_MAPS[number];
export function listSongMaps(grooveId?: string) { return SONG_MAPS.filter(s => !grooveId || s.grooveId === grooveId).map(s => structuredClone(s)); }
export function getSongMap(id: string, grooveId?: string): SongMap {
  const song = SONG_MAPS.find(s=>s.id === id && (!grooveId || s.grooveId === grooveId));
  if (!song) throw new Error('Nieznana mapa utworu lub niezgodny groove.');
  return song;
}
/** Applied before groove vocabulary, kit remapping and manual edits. */
export function applySongMap(style: RhythmStyle, id: string): void {
  const song = getSongMap(id,style.id);
  style.defaultBpm = song.bpm;
  style.name = `${song.title} · ${style.name}`;
  style.description = `${song.artist} · mapa inspirowana utworem do ćwiczeń na zestawie.`;
  style.practiceFocus = `Opanuj puls i akcenty: ${song.title}.`;
  if (['03-4','03-5'].includes(id)) style.drumPatternDescription = '1 a 2 a 3 a 4 a · half-time: główny werbel na 3';
  else if (song.grooveId === '09' && id !== '09-1') style.drumPatternDescription = '1 la li 2 la li · dwie grupy po trzy ósemki, bez timeline’u bembé';
  else if (song.grooveId === '06') style.drumPatternDescription = '1 & 2 & 3 & 4 & · dwutaktowa odpowiedź cross-stick';
  else if (song.grooveId === '10') style.drumPatternDescription = '1 & 2 & 3 & · trzy ćwierćnuty w takcie';
  style.drumPatternDescription += ` · ${song.title}`;
  for (const [section, pattern] of Object.entries(style.sections)) {
    pattern.steps = pattern.steps.map(()=>[]);
    for (const [instrument,positions,velocity=0.6,rudiment] of song.lanes) for (const step of positions) {
      if (!pattern.steps[step] || section === 'ending' && step >= pattern.stepsPerBeat) continue;
      const hit: DrumHit = { instrument,velocity,role: velocity < .35 ? 'ghost' : 'essential', ...(rudiment ? {rudiment} : {}), ...(rudiment === 'triplet' ? {tripletSpan:1} : {}) };
      const existing = pattern.steps[step].find(h=>h.instrument === instrument);
      if (!existing) pattern.steps[step].push(hit);
    }
    if (['mainB','fillA','fillB'].includes(section)) {
      const last = pattern.steps.length - 1;
      const response: DrumHit = { instrument: ['05','06','08'].includes(style.id) ? 'tom_high' : 'snare', velocity:.4,role:'variation' };
      if (!pattern.steps[last].some(h=>h.instrument === response.instrument)) pattern.steps[last].push(response);
    }
  }
}
