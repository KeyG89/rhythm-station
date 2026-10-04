import { useDrumEngine } from '../hooks/useDrumEngine';
import { LABORATORY_FEATURES } from '../domain/practice';
import { compareDrafts } from '../domain/comparison';
import { PracticeDraft, serializeDraft } from '../domain/session';
import { studioCapabilities } from '../domain/studio';

type Engine=ReturnType<typeof useDrumEngine>;
export function PracticeLaboratory({engine}:{engine:Engine}) {
  const slots=engine.comparisonSlots;
  const lab=engine.laboratory;
  const report=slots.a && slots.b ? compareDrafts(slots.a,slots.b) : null;
  const max=studioCapabilities(engine.currentStyle.id,engine.studioOptions).complexity.max;
  const recall=(draft:PracticeDraft)=>engine.loadDraft(serializeDraft({...draft,laboratory:{...lab,ladder:false,gap:false}}));
  return <section className="laboratory-panel" aria-label="Laboratorium ćwiczeń">
    <button className="lab-toggle small-action" aria-expanded={lab.enabled} onClick={()=>engine.updateLaboratory({enabled:!lab.enabled})}>{lab.enabled?'Ukryj i wyłącz dodatki':'Odkryj dodatki treningowe'}<span>LAB · 3 funkcje</span></button>
    {lab.enabled && <div className="laboratory-content">
      <p className="muted">Dodatki są opcjonalne. Ukrycie wyłącza znikający groove i drabinkę; mapy oraz zapis A/B pozostają do Twojej dyspozycji.</p>
      <div className="laboratory-grid">
        <article className="lab-card"><b>{LABORATORY_FEATURES[0].title}</b><p>{LABORATORY_FEATURES[0].description}</p>
          <label><input type="checkbox" checked={lab.gap} onChange={e=>engine.updateLaboratory({gap:e.target.checked})}/> Włącz znikanie</label>
          <div className="lab-fields"><label>Frazy z dźwiękiem<select aria-label="Frazy z dźwiękiem" value={lab.audiblePhrases} onChange={e=>engine.updateLaboratory({audiblePhrases:Number(e.target.value)})}>{[1,2,4,8].map(n=><option key={n}>{n}</option>)}</select></label><label>Frazy bez dźwięku<select aria-label="Frazy bez dźwięku" value={lab.silentPhrases} onChange={e=>engine.updateLaboratory({silentPhrases:Number(e.target.value)})}>{[1,2,4,8].map(n=><option key={n}>{n}</option>)}</select></label></div>
          <small>Pełna fraza = {engine.currentStyle.sections.mainA.bars} takt(y). Cisza obejmuje groove i metronom; wybrzmienia mogą naturalnie wygasnąć. Powrót bez podpowiadających przednutek.</small>
        </article>
        <article className="lab-card"><b>{LABORATORY_FEATURES[1].title}</b><p>{LABORATORY_FEATURES[1].description}</p>
          <label><input type="checkbox" checked={lab.ladder} onChange={e=>engine.updateLaboratory({ladder:e.target.checked})}/> Włącz drabinkę</label>
          <div className="lab-fields"><label>Frazy na poziom<select aria-label="Frazy na poziom" value={lab.phrasesPerLevel} onChange={e=>engine.updateLaboratory({phrasesPerLevel:Number(e.target.value)})}>{[1,2,4,8,16].map(n=><option key={n}>{n}</option>)}</select></label><label>Poziom docelowy<select aria-label="Poziom docelowy Complexity" value={Math.min(max,lab.targetLevel)} onChange={e=>engine.updateLaboratory({targetLevel:Number(e.target.value)})}>{Array.from({length:max+1},(_,n)=><option value={n} key={n}>{n}{n===4 && engine.studioOptions.songPresetId?' · partia utworu':''}</option>)}</select></label></div>
          <small>Start: aktualne Complexity. Ruch ręczny tego suwaka zatrzymuje drabinkę. Własne nuty nadal mają pierwszeństwo.</small>
        </article>
        <article className="lab-card"><b>{LABORATORY_FEATURES[2].title}</b><p>{LABORATORY_FEATURES[2].description}</p>
          <div className="comparison-slots">{(['a','b'] as const).map(key=><div key={key}><button className="small-action" onClick={()=>engine.captureComparisonSlot(key)}>Zapamiętaj {key.toUpperCase()}</button><button className="small-action" disabled={!slots[key]} onClick={()=>recall(slots[key]!)}>Wczytaj {key.toUpperCase()}</button>{slots[key] && <small>{slots[key]!.bpm} BPM · Complexity {slots[key]!.controls.complexity}</small>}</div>)}</div>
          <small>Snapshoty w pamięci aplikacji. Wczytanie zatrzymuje odtwarzanie i przywraca nuty, tempo oraz brzmienie; eksportuj JSON, aby zachować je po zamknięciu.</small>
        </article>
      </div>
      {report && <div className="comparison-report" role="status"><b>A: {report.a.title} / B: {report.b.title}</b><p>{report.sameGrid?`Różnice w ${report.changedCells} polach mapy.`:'Różne metra/siatki — porównanie liczby uderzeń w pełnej frazie.'}</p><div>{report.voices.map(v=><span key={v.instrument}>{v.name}: <b>{v.a} → {v.b}</b></span>)}</div></div>}
    </div>}
  </section>;
}
