import { describe, expect, it } from 'vitest';
import { composeGroove, cycleCell, KIT, normalizeOptions, playability, studioCapabilities } from '../src/domain/studio';
import { GROOVES } from '../src/domain/grooves';
import { expandHit } from '../src/domain/rudiments';
import { DrumHit } from '../src/types/rhythm';
import { inspectGroove } from '../src/adapters/grooveApi';
import { normalizeDraft, serializeDraft } from '../src/domain/session';
import { stepDuration } from '../src/domain/timing';

describe('Playable ornament notation and playback',()=>{
  it('cycles exactly single → ghost → drag → flam → rest, for every personal-kit field',()=>{
    for (const instrument of KIT) {
      const cell = {section:'mainA' as const,step:1,instrument};
      let hit: DrumHit | undefined;
      const states: string[] = [];
      for(let i=0;i<5;i++) {
        const edit = cycleCell(cell,hit);
        const style = composeGroove('00',{}, {secondTom:true,edits:[edit]});
        hit = style.sections.mainA.steps[1].find(h=>h.instrument === instrument);
        states.push(!hit ? 'rest' : hit.rudiment ?? hit.role!);
      }
      expect(states).toEqual(['variation','ghost','drag','flam','rest']);
    }
    const cell={section:'mainA' as const,step:4,instrument:'snare' as const};
    const filled={instrument:'snare' as const,velocity:.9,role:'essential' as const};
    expect(cycleCell(cell,filled,.65,1)).toMatchObject({velocity:.65});
    expect(cycleCell(cell,filled,.65,2)).toMatchObject({velocity:.22});
    expect(cycleCell(cell,filled,.65,3)).toMatchObject({rudiment:'drag'});
    expect(cycleCell(cell,filled,.65,4)).toMatchObject({rudiment:'flam'});
    expect(cycleCell(cell,filled,.65,5)).toMatchObject({velocity:null});
  });
  it('schedules one/two quiet grace strokes before an unchanged principal, even at fastest BPM',()=>{
    const style=composeGroove('00'),pattern=style.sections.mainA;
    const hit={instrument:'snare' as const,velocity:.9,role:'essential' as const};
    const flam=expandHit({...hit,rudiment:'flam'},style,pattern,200,4);
    const drag=expandHit({...hit,rudiment:'drag'},style,pattern,200,4);
    expect(flam).toHaveLength(2); expect(drag).toHaveLength(3);
    expect(flam[0].offset).toBeLessThan(0);
    expect(drag[0].offset).toBeLessThan(drag[1].offset); expect(drag[1].offset).toBeLessThan(0);
    expect(drag[2]).toMatchObject({offset:0,velocity:.9,kind:'principal'});
    expect(flam[1]).toEqual(drag[2]);
    expect(drag.slice(0,2).every(h=>h.velocity < hit.velocity*.5)).toBe(true);
  });
  it('plays three equal subdivisions of the chosen span, including swing and phrase-edge clamping',()=>{
    const s=composeGroove('03'),p=s.sections.mainA;
    const notes=expandHit({instrument:'tom_high',velocity:.7,rudiment:'triplet',tripletSpan:2},s,p,120,0);
    expect(notes.map(h=>h.offset)).toEqual([0, .5/3, .5*2/3]);
    const end=expandHit({instrument:'kick',velocity:.7,rudiment:'triplet',tripletSpan:4},s,p,120,7);
    expect(end[2].offset).toBeCloseTo(stepDuration(s,p,120,7)*2/3);
  });
  it('each ornament slider stage changes a written phrase; simultaneous controls keep every essential onset',()=>{
    for(const g of GROOVES) {
      const id=g.style.id,base=composeGroove(id);
      for(const key of ['flams','drags','triplets'] as const) {
        let previous=base.sections.mainA.steps;
        for(let value=1;value<=studioCapabilities(id)[key].max;value++) {
          const next=composeGroove(id,{[key]:value});
          expect(next.sections.mainA.steps, `${id} ${key}=${value}`).not.toEqual(previous);
          previous=next.sections.mainA.steps;
        }
      }
      const next=composeGroove(id,{flams:9,drags:9,triplets:9});
      base.sections.mainA.steps.forEach((hits,step)=>hits.filter(h=>h.role === 'essential').forEach(hit=>{
        expect(next.sections.mainA.steps[step].some(h=>h.instrument === hit.instrument), `${id} anchor ${step}`).toBe(true);
      }));
    }
  });
  it('preserves articulation in local drafts, clamps malformed spans and reports real stroke events through the adapter',()=>{
    const options={edits:[{section:'mainA' as const,step:0,instrument:'snare' as const,velocity:.7,rudiment:'drag' as const},{section:'mainA' as const,step:14,instrument:'tom_low' as const,velocity:.8,rudiment:'triplet' as const,tripletSpan:9}]};
    const draft=normalizeDraft({version:1,id:'00',options});
    expect(normalizeDraft(JSON.parse(serializeDraft(draft)))).toEqual(draft);
    expect(draft.options.edits[1].tripletSpan).toBe(4);
    const result=inspectGroove('00',{},120,options);
    expect(result.events.filter(h=>h.instrument === 'snare' && h.step === 0)).toHaveLength(3);
    expect(result.events.filter(h=>h.kind === 'grace').every(h=>h.time<0)).toBe(true);
    expect(result.style.sections.mainA.steps[14].find(h=>h.instrument==='tom_low')?.tripletSpan).toBe(2);
    expect(normalizeOptions({edits:[{...options.edits[0],rudiment:'random' as never}]}).edits[0].rudiment).toBeUndefined();
    const overlap=composeGroove('00',{}, {edits:[{section:'mainA',step:0,instrument:'snare',velocity:.7,rudiment:'triplet',tripletSpan:3},{section:'mainA',step:2,instrument:'snare',velocity:.7}]});
    expect(playability(overlap).some(w=>w.reason.includes('triola nakłada się'))).toBe(true);
  });
});
