import { useDrumEngine } from '../hooks/useDrumEngine';
import { DEFAULT_REPLACEMENTS, KIT, KIT_NAMES, PercussionSource, REPLACEMENT_CHOICES } from '../domain/studio';
import { VoiceMix } from '../domain/session';
type Engine = ReturnType<typeof useDrumEngine>;
const SOURCES: Record<PercussionSource, string> = { clave: 'Clave', cowbell: 'Cowbell', conga_high: 'Conga wysoka', conga_low: 'Conga niska', shaker: 'Shaker', tambourine: 'Tamburyn' };
export function PersonalKit({ engine }: { engine: Engine }) {
  return <section className="kit-panel panel-light"><h3>Twój zestaw</h3><p className="muted">Jeden tom + floor tom. Bell oznacza kopułkę ride’u. Zamiennik zachowuje miejsca uderzeń oryginalnej partii.</p><label className="field-label">Instrumentarium<select aria-label="Instrumentarium" value={engine.studioOptions.kitMode} onChange={e => engine.updateStudioOptions({ kitMode: e.target.value as 'personal' | 'original', edits: [] })}><option value="personal">Mój zestaw · bez dodatkowej perkusji</option><option value="original">Oryginalne instrumenty · odsłuch porównawczy</option></select></label><div className="replacement-grid">{(Object.keys(DEFAULT_REPLACEMENTS) as PercussionSource[]).map(source => <label className="field-label" key={source}>{SOURCES[source]} →<select aria-label={`Zamiennik: ${SOURCES[source]}`} disabled={engine.studioOptions.kitMode === 'original'} value={engine.studioOptions.replacements[source]} onChange={e => engine.updateStudioOptions({ replacements: { ...engine.studioOptions.replacements, [source]: e.target.value as typeof KIT[number] } })}>{REPLACEMENT_CHOICES[source].map(inst => <option value={inst} key={inst}>{KIT_NAMES[inst]}</option>)}</select></label>)}</div><p className="muted">Clave domyślnie gra cross-stick, cowbell — bell, congi — tomy. To adaptacja orkiestracji na zestaw, nie kopia brzmienia oryginału.</p>
  </section>;
}
const PARAMETERS: { key: keyof VoiceMix; label: string; min: number; max: number; step: number; format: (n: number) => string }[] = [
  { key: 'volume', label: 'Głośność', min: 0, max: 1, step: 0.01, format: n => `${Math.round(n * 100)}%` },
  { key: 'pitch', label: 'Pitch', min: -4, max: 4, step: 0.25, format: n => `${n > 0 ? '+' : ''}${n} półtonów` },
  { key: 'decay', label: 'Wybrzmienie', min: 0.35, max: 1, step: 0.01, format: n => `${Math.round(n * 100)}%` },
  { key: 'brightness', label: 'Jasność', min: 500, max: 20000, step: 100, format: n => `${(n / 1000).toFixed(1)} kHz` },
  { key: 'pan', label: 'Panorama', min: -1, max: 1, step: 0.05, format: n => n === 0 ? 'Środek' : `${n < 0 ? 'L' : 'R'} ${Math.round(Math.abs(n) * 100)}%` },
];
export function KitSound({ engine }: { engine: Engine }) {
  return <section className="kit-panel panel-light"><h3>Brzmienie instrumentów</h3><p className="muted">Zmiany dotyczą nagranych próbek. Pitch zmienia wysokość i naturalną długość próbki; wybrzmienie skraca ogon. Kliknij instrument, żeby porównać ustawienia.</p><div className="sound-grid">{KIT.map(inst => <details className="voice-card" key={inst} open={inst === 'kick' || inst === 'snare'}><summary>{KIT_NAMES[inst]}</summary><button className="small-action" onClick={() => void engine.triggerInstrument(inst)}>Odsłuch</button>{PARAMETERS.map(p => <div className="mini-control" key={p.key}><label htmlFor={`sound-${inst}-${p.key}`}>{p.label}<output>{p.format(engine.kitMix[inst][p.key])}</output></label><input id={`sound-${inst}-${p.key}`} aria-label={`${KIT_NAMES[inst]}: ${p.label}`} type="range" min={p.min} max={p.max} step={p.step} value={engine.kitMix[inst][p.key]} onChange={e => engine.updateVoiceMix(inst, p.key, Number(e.target.value))} /></div>)}<button className="small-action" onClick={() => engine.resetVoiceMix(inst)}>Reset brzmienia</button></details>)}</div></section>;
}
