import { normalizeDraft } from './session';
import { composeGroove, KIT, KIT_NAMES } from './studio';
import { expandHit } from './rudiments';
/** Read-only comparison of validated local snapshots; no storage or audio adapter. */
export function compareDrafts(a:unknown,b:unknown) {
  const left=normalizeDraft(a),right=normalizeDraft(b);
  const scoreA=composeGroove(left.id,left.controls,left.options),scoreB=composeGroove(right.id,right.controls,right.options);
  const shape=(s:typeof scoreA)=>[s.timeSignature,s.sections.mainA.stepsPerBeat,s.sections.mainA.bars];
  const sameGrid=JSON.stringify(shape(scoreA))===JSON.stringify(shape(scoreB));
  const count=(s:typeof scoreA,tempo:number,inst:string)=>s.sections.mainA.steps.flatMap((hs,i)=>hs.filter(h=>h.instrument===inst).flatMap(h=>expandHit(h,s,s.sections.mainA,tempo,i))).length;
  return {a:{title:scoreA.name,bpm:left.bpm,meter:scoreA.timeSignature,complexity:left.controls.complexity},b:{title:scoreB.name,bpm:right.bpm,meter:scoreB.timeSignature,complexity:right.controls.complexity},sameGrid,changedCells:sameGrid ? scoreA.sections.mainA.steps.reduce((n,hits,i)=>n+KIT.filter(inst=>JSON.stringify(hits.find(h=>h.instrument===inst))!==JSON.stringify(scoreB.sections.mainA.steps[i].find(h=>h.instrument===inst))).length,0):null,voices:KIT.map(inst=>({instrument:inst,name:KIT_NAMES[inst],a:count(scoreA,left.bpm,inst),b:count(scoreB,right.bpm,inst)})).filter(v=>v.a||v.b)};
}
