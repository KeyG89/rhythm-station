import { describe, expect, it } from 'vitest';
import { inspectPracticePlan, normalizeLaboratory } from '../src/domain/practice';
import { compareDrafts } from '../src/domain/comparison';
import { normalizeDraft, serializeDraft } from '../src/domain/session';

describe('Optional practice laboratory',()=>{
  it('defaults off, disables running features when hidden, bounds settings and retains old draft compatibility',()=>{
    const off=inspectPracticePlan({gap:true,ladder:true},2);
    expect(off.config.enabled).toBe(false); expect(off.phrases.every(p=>p.audible&&p.complexity===2)).toBe(true);
    expect(normalizeLaboratory({enabled:false,gap:true,ladder:true})).toMatchObject({gap:false,ladder:false});
    const draft=normalizeDraft({version:1,id:'00'});
    expect(draft.laboratory?.enabled).toBe(false);
    expect(normalizeDraft({version:1,id:'00',laboratory:null}).laboratory?.enabled).toBe(false);
    const lab=normalizeLaboratory({enabled:true,gap:true,ladder:true,audiblePhrases:0,silentPhrases:999,phrasesPerLevel:NaN,targetLevel:Infinity});
    expect(lab).toMatchObject({audiblePhrases:1,silentPhrases:16,phrasesPerLevel:4,targetLevel:4});
    const saved={...draft,laboratory:lab}; expect(normalizeDraft(JSON.parse(serializeDraft(saved)))).toEqual(saved);
  });
  it('plans whole phrases and stops ladder at target or genre cap without lowering the current complexity',()=>{
    const plan=inspectPracticePlan({enabled:true,gap:true,ladder:true,audiblePhrases:2,silentPhrases:1,phrasesPerLevel:2,targetLevel:4},1,7,10);
    expect(plan.phrases.map(p=>p.audible)).toEqual([true,true,false,true,true,false,true,true,false,true]);
    expect(plan.phrases.map(p=>p.complexity)).toEqual([1,1,2,2,3,3,4,4,4,4]);
    expect(inspectPracticePlan({enabled:true,ladder:true,targetLevel:2},5,6).phrases.every(p=>p.complexity===5)).toBe(true);
    expect(inspectPracticePlan({enabled:true,ladder:true,targetLevel:7,phrasesPerLevel:1},0,3).phrases[15].complexity).toBe(3);
  });
  it('compares actual strokes, validates snapshots and identifies incompatible meters without matching their cell indices',()=>{
    const a={version:1,id:'00',bpm:100,options:{edits:[{section:'mainA',step:0,instrument:'snare',velocity:.8,rudiment:'drag'}]},mix:{snare:{pitch:-2}}};
    const b={version:1,id:'00',bpm:120};
    const report=compareDrafts(a,b);
    expect(report.sameGrid).toBe(true); expect(report.changedCells).toBe(1);
    expect(report.voices.find(v=>v.instrument==='snare')).toMatchObject({a:5,b:2});
    expect(report.a.bpm).toBe(100); expect(report.b.bpm).toBe(120);
    expect(compareDrafts(a,{version:1,id:'12'})).toMatchObject({sameGrid:false,changedCells:null});
    expect(()=>compareDrafts({version:99,id:'00'},b)).toThrow();
    expect(normalizeDraft(a).mix.snare.pitch).toBe(-2);
  });
});
