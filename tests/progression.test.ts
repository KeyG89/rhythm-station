import { describe, expect, it } from 'vitest';
import { GROOVES } from '../src/domain/grooves';
import { SONG_MAPS } from '../src/domain/songMaps';
import { composeGroove, playability, studioCapabilities } from '../src/domain/studio';
import { inspectSongMap } from '../src/adapters/grooveApi';
import { dragLeadCells, expandHit, playbackLeadIn } from '../src/domain/rudiments';
import { normalizeDraft } from '../src/domain/session';

const positions=(id:string,level:number,instrument:string)=>inspectSongMap(id,{complexity:level}).style.sections.mainA.steps.flatMap((hits,i)=>hits.some(h=>h.instrument===instrument)?[i]:[]);
describe('Song learning progression and expanded collection',()=>{
  it('each exposed Complexity level audibly changes the map, with playable written responses after the reference',()=>{
    for(const song of SONG_MAPS) {
      expect(song.curriculum).toHaveLength(8);
      let previous;
      for(let level=0;level<=7;level++) {
        const style=composeGroove(song.grooveId,{complexity:level},{songPresetId:song.id});
        expect(style.sections.mainA.steps,`${song.id} Complexity ${level}`).not.toEqual(previous);
        expect(playability(style),`${song.id} Complexity ${level}`).toEqual([]);
        previous=style.sections.mainA.steps;
      }
      const reference=positions(song.id,4,'kick');
      for(let level=0;level<4;level++) expect(positions(song.id,level,'kick').every(i=>reference.includes(i)),song.id).toBe(true);
    }
    for(const g of GROOVES) {
      let previous;
      for(let level=0;level<=studioCapabilities(g.style.id).complexity.max;level++) {
        const style=composeGroove(g.style.id,{complexity:level});
        expect(style.sections.mainA.steps,`${g.style.id} Complexity ${level}`).not.toEqual(previous);
        expect(playability(style)).toEqual([]); previous=style.sections.mainA.steps;
      }
    }
  });
  it('Nirvana develops its actual chorus feet and hands; stage 4 follows the referenced Drumeo Level 5 bar',()=>{
    expect(positions('00-5',0,'kick')).toEqual([0,8]);
    expect(positions('00-5',2,'kick')).toEqual([0,3,8,10]);
    expect(positions('00-5',4,'kick')).toEqual([0,3,8,10,11,14]);
    expect(positions('00-5',4,'snare')).toEqual([4,7,9,12]);
    expect(positions('00-5',1,'hihat_closed')).toEqual([0,2,4,6,8,10,12,14]);
    expect(positions('00-5',4,'hihat_open')).toEqual([4,8,12]);
    expect(positions('00-5',4,'crash')).toEqual([0]);
    expect(inspectSongMap('00-5',{complexity:4}).capabilities.complexity.levels?.[4]).toContain('Riff Grohla');
    expect(SONG_MAPS.filter(s=>s.grooveId==='00'&&s.artist==='Royal Blood').map(s=>s.title)).toEqual(['Figure It Out']);
  });
  it('metal stages keep isolated single-pedal feet, while optional Tom 2 is used only in automatic tom melodies',()=>{
    for(const song of SONG_MAPS.filter(s=>s.grooveId==='13')) for(let n=0;n<=7;n++) {
      const score=inspectSongMap(song.id,{complexity:n,kickDensity:3}).style.sections.mainA.steps;
      expect(score.filter(h=>h.some(n=>n.instrument==='kick')).length).toBeLessThan(8);
      expect(score.every((hits,i)=>!hits.some(h=>h.instrument==='kick')||!score[(i+1)%16].some(h=>h.instrument==='kick')||!score[(i+2)%16].some(h=>h.instrument==='kick'))).toBe(true);
    }
    for(const g of GROOVES) expect(studioCapabilities(g.style.id,{secondTom:true}).midTomDensity.max>0).toBe(g.style.id==='14');
    const withTom=composeGroove('14'),without=composeGroove('14',{}, {secondTom:false});
    expect(withTom.sections.mainA.steps.flat().some(h=>h.instrument==='tom_mid')).toBe(true);
    expect(without.sections.mainA.steps.flat().some(h=>h.instrument==='tom_mid')).toBe(false);
    expect(normalizeDraft({version:1,id:'14'}).options.secondTom).toBe(true);
    const manual=composeGroove('14',{}, {secondTom:false,edits:[{section:'mainA',step:6,instrument:'tom_mid',velocity:null}]});
    expect(manual.sections.mainA.steps[6].some(h=>h.instrument==='tom_high')).toBe(false);
  });
  it('drag has two exact straight 32nds at multiple tempos/meters, with accurate preceding-cell notation',()=>{
    for(const id of ['00','09','12']) for(const bpm of [40,120,240]) {
      const style=composeGroove(id),pattern=style.sections.mainA;
      const hit={instrument:'snare' as const,velocity:.8,rudiment:'drag' as const};
      const notes=expandHit(hit,style,pattern,bpm,4);
      const interval=60/bpm/8*(id==='09'?2/3:1);
      expect(notes.map(n=>n.offset)).toEqual([-interval*2,-interval,0]);
      const edited=composeGroove(id,{}, {edits:[{section:'mainA',step:0,...hit}]});
      expect(playbackLeadIn(edited,bpm)+notes[0].offset).toBeGreaterThanOrEqual(.0299);
    }
    const straight=composeGroove('00',{}, {edits:[{section:'mainA',step:4,instrument:'snare',velocity:.8,rudiment:'drag'}]});
    expect([...dragLeadCells(straight,straight.sections.mainA,120).get('snare')!]).toEqual([3]);
    const swung=composeGroove('05',{swing:62},{edits:[{section:'mainA',step:4,instrument:'snare',velocity:.8,rudiment:'drag'}]});
    expect([...dragLeadCells(swung,swung.sections.mainA,120).get('snare')!]).toEqual([2,3]);
  });
});
