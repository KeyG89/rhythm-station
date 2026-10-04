import { describe, expect, it } from 'vitest';
import { GROOVES } from '../src/domain/grooves';
import { SONG_MAPS, getSongMap, listSongMaps } from '../src/domain/songMaps';
import { composeGroove, KIT, playability, studioCapabilities } from '../src/domain/studio';
import { inspectSongMap } from '../src/adapters/grooveApi';
import { normalizeDraft, serializeDraft } from '../src/domain/session';

describe('Seventy-five song practice maps',()=>{
  it('has five distinct authored maps per groove, valid positions, sourced tempos and recording URLs',()=>{
    expect(SONG_MAPS).toHaveLength(75); expect(new Set(SONG_MAPS.map(s=>s.id)).size).toBe(75);
    for(const g of GROOVES) {
      const songs=listSongMaps(g.style.id); expect(songs).toHaveLength(5);
      const signatures=new Set<string>();
      for(const song of songs) {
        expect(song.youtube).toMatch(/^https:\/\/www.youtube.com\/watch\?v=[\w-]{11}$/);
        expect(song.spotify).toMatch(/^https:\/\/open.spotify.com\/track\/[A-Za-z0-9]{22}$/);
        expect(song.referenceSource).toMatch(/^https:\/\//);
        expect(song.tempoSource).toMatch(/^https:\/\//); expect(song.note.length).toBeGreaterThan(50);
        expect(song.bpm).toBeGreaterThanOrEqual(g.tempo[0]); expect(song.bpm).toBeLessThanOrEqual(g.tempo[1]);
        for(const [,indices] of song.lanes) expect(indices.every(i=>Number.isInteger(i) && i>=0 && i<g.style.sections.mainA.steps.length)).toBe(true);
        const s=composeGroove(g.style.id,{complexity:4}, {songPresetId:song.id});
        expect(s.defaultBpm).toBe(song.bpm); expect(s.name).toContain(song.title);
        expect(playability(s),song.id).toEqual([]);
        expect(s.sections.mainA.steps.flat().every(h=>KIT.includes(h.instrument as typeof KIT[number]))).toBe(true);
        signatures.add(JSON.stringify(s.sections.mainA.steps));
        for(const key of ['flams','drags','triplets'] as const) {
          let previous=s.sections.mainA.steps;
          for(let n=1;n<=studioCapabilities(g.style.id)[key].max;n++) {
            const next=composeGroove(g.style.id,{complexity:4,[key]:n},{songPresetId:song.id}).sections.mainA.steps;
            expect(next,`${song.id} ${key} ${n}`).not.toEqual(previous); previous=next;
          }
        }
      }
      expect(signatures.size,g.style.name).toBe(5);
    }
  });
  it('song vocabulary has bounded hands and immutable templates across all presets and staged settings',()=>{
    const before=JSON.stringify(SONG_MAPS);
    for(const song of SONG_MAPS) for(let config=0;config<8;config++) {
      const caps=studioCapabilities(song.grooveId,{songPresetId:song.id});
      const controls=Object.fromEntries(Object.entries(caps).map(([key,cap],i)=>[key,config === 7 ? cap.max : (config*(i+2))%(cap.max+1)]));
      const s=composeGroove(song.grooveId,controls,{songPresetId:song.id});
      for(const section of Object.keys(s.sections) as (keyof typeof s.sections)[]) expect(playability(s,section), `${song.id} ${config} ${section}`).toEqual([]);
    }
    expect(JSON.stringify(SONG_MAPS)).toBe(before);
  });
  it('preserves pulse conversions, honest compound interpretations and half-time backbeats',()=>{
    expect(getSongMap('11-2').bpm).toBe(51); expect(getSongMap('11-3').bpm).toBe(63); expect(getSongMap('11-4').bpm).toBe(45.5);
    expect(getSongMap('09-4').bpm).toBe(62.7);
    for(const id of ['09-2','09-3','09-4','09-5']) expect(inspectSongMap(id).events.some(h=>h.instrument==='ride_bell')).toBe(false);
    for(const id of ['09-2','09-3','09-4','09-5']) {
      let previous=inspectSongMap(id).style.sections.mainA.steps;
      for(let stage=1;stage<=3;stage++) {
        const next=inspectSongMap(id,{bellDensity:stage});
        expect(next.style.sections.mainA.steps).not.toEqual(previous);
        expect(next.events.some(h=>h.instrument==='ride_bell')).toBe(true);
        expect(next.capabilities.bellDensity.description).toContain('bez dodawania timeline');
        previous=next.style.sections.mainA.steps;
      }
    }
    expect(inspectSongMap('01-4').defaultControls.swing).toBe(60);
    expect(inspectSongMap('01-4').capabilities.swing.default).toBe(60);
    for(const song of listSongMaps('02')) expect(inspectSongMap(song.id).style.sections.mainA.steps.flatMap((s,i)=>s.some(h=>h.instrument==='snare' && h.role==='essential')?[i]:[])).toEqual([8]);
  });
  it('roundtrips chosen preset, fractional BPM, custom rudiments and tuning; rejects another groove’s preset',()=>{
    const draft=normalizeDraft({version:1,id:'11',options:{songPresetId:'11-4',edits:[{section:'mainA',step:1,instrument:'crash',velocity:.6,rudiment:'flam'}]},mix:{snare:{pitch:2}}});
    expect(draft.bpm).toBe(45.5); expect(normalizeDraft(JSON.parse(serializeDraft(draft)))).toEqual(draft);
    expect(()=>normalizeDraft({version:1,id:'00',options:{songPresetId:'11-4'}})).toThrow();
    expect(()=>inspectSongMap('unknown')).toThrow();
    const clone=listSongMaps('00'); clone[0].lanes[0][1].push(99); expect(getSongMap('00-1').lanes[0][1]).not.toContain(99);
  });
});
