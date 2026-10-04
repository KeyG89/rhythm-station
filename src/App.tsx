import { useState } from 'react';
import { ArrowUpRight, Check, ChevronRight, Drum, Headphones, Layers, Minus, Music2, Play, RotateCcw, Settings2, Square, Volume2 } from 'lucide-react';
import { useDrumEngine } from './hooks/useDrumEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { GROOVES, getGroove, ControlKey } from './domain/grooves';
import { DRUM_INSTRUMENTS_META, DrumInstrument } from './types/rhythm';
import { pulses } from './domain/timing';
import { SpeedTrainer } from './components/SpeedTrainer';
import { AudioExporter } from './components/AudioExporter';

const CONTROL_LABELS: Record<ControlKey, string> = {
  complexity: 'Complexity', ghostNotes: 'Ghost notes', kickDensity: 'Kick density',
  hihatDensity: 'Hi-hat density', swing: 'Swing', humanize: 'Humanize',
};
const ORDER: DrumInstrument[] = ['clave', 'cowbell', 'ride', 'ride_bell', 'hihat_open', 'hihat_closed', 'hihat_pedal', 'snare', 'rimshot', 'kick', 'tom_high', 'tom_mid', 'tom_low', 'conga_high', 'conga_low', 'tambourine', 'shaker'];
const NAMES: Partial<Record<DrumInstrument, string>> = { kick: 'Stopa', snare: 'Werbel', rimshot: 'Cross-stick', hihat_closed: 'Hi-hat', hihat_open: 'Otwarty hi-hat', hihat_pedal: 'Hi-hat nogą', tom_high: 'Tom wysoki', tom_mid: 'Tom środkowy', tom_low: 'Floor tom', conga_high: 'Conga · otwarta', conga_low: 'Conga · niski ton' };

export default function App() {
  const engine = useDrumEngine();
  const groove = getGroove(engine.currentStyle.id);
  const [tab, setTab] = useState<'groove' | 'trainer' | 'record'>('groove');
  const [help, setHelp] = useState(false);
  useKeyboardShortcuts({ ...engine, startWithCountIn: bars => { engine.stop(); void engine.start(bars); } });
  const pattern = engine.currentStyle.sections[engine.currentSection];
  const unitsPerBar = groove.style.timeSignature[0];
  const stepsPerBar = unitsPerBar * pattern.stepsPerBeat;
  const activeInstruments = ORDER.filter(inst => pattern.steps.some(step => step.some(h => h.instrument === inst)));
  const pulseSteps = pulses(groove.style).map(p => p.unit * pattern.stepsPerBeat);
  const changed = Object.entries(engine.grooveControls).filter(([key, value]) => groove.controls[key as ControlKey].default !== value).length;
  const phase = engine.countInActive ? `Odliczanie ${engine.countInBeat?.current ?? 1}/${engine.countInBeat?.total ?? 1}` : engine.isPlaying ? `Takt ${engine.totalBars + 1}` : 'Gotowy do ćwiczenia';

  return <div className="lab-shell">
    <header className="lab-header">
      <a className="brand" href="#"><span className="brand-icon"><Drum size={23} /></span><span>groove<span className="brand-light">lab</span><small>DRUM PRACTICE STATION</small></span></a>
      <div className="heritage">INSPIRED BY YAMAHA PSR-220 / 230 <span>CODEX V2</span></div>
      <button className="icon-button" aria-label="Pokaż skróty klawiszowe" onClick={() => setHelp(!help)}><span>?</span></button>
    </header>
    {help && <div className="shortcut-note" role="status">Spacja: start/stop · C: odliczanie · M: metronom · F: odpowiedź · V: A/B · T: tap tempo · ↑↓: tempo · Esc: stop <button onClick={() => setHelp(false)}>Zamknij</button></div>}
    <main className="lab-main">
      <div className="intro-row"><div><div className="eyebrow"><span className="orange-dot" /> MNIEJ RYTMÓW. WIĘCEJ GROOVE’U.</div><h1>Najpierw poczuj <em>esencję.</em></h1><p>Dwanaście różnych języków rytmu. Naucz się ich charakteru, potem dodaj własną swobodę.</p></div><div className="collection-mark"><b>12</b><span>GROOVE’ÓW<br />DO OPANOWANIA</span></div></div>
      <div className="workspace">
        <aside className="library panel-light">
          <div className="panel-heading"><span className="eyebrow">01 / KOLEKCJA</span><Music2 size={17} /></div>
          <h2>Wybierz swój puls</h2><p className="muted">Każdy rytm uczy czegoś innego.</p>
          <nav aria-label="Kolekcja 12 groove’ów" className="groove-list">{GROOVES.map((g, i) => <button key={g.style.id} className={`groove-choice ${g.style.id === engine.currentStyle.id ? 'selected' : ''}`} aria-pressed={g.style.id === engine.currentStyle.id} onClick={() => engine.selectStyle(g.style.id)}><span className="groove-number">{String(i + 1).padStart(2, '0')}</span><span className="groove-name">{g.style.name}<small>{g.tag}</small></span><span className="meter">{g.style.timeSignature.join('/')}</span>{g.style.id === engine.currentStyle.id && <ChevronRight size={15} />}</button>)}</nav>
          <div className="library-foot"><Headphones size={17} /><span>Posłuchaj. Policz. Zagraj.<br /><b>Jedna partia naraz.</b></span></div>
        </aside>
        <section className="work-area">
          <div className="player panel-dark">
            <div className="player-top"><span className="eyebrow">02 / TWÓJ GROOVE</span><span className={`state-pill ${engine.isPlaying ? 'live' : ''}`}><span />{phase}</span></div>
            <div className="player-title"><div><h2>{groove.style.name}</h2><p>{groove.style.description}</p></div><span className="time-badge">{groove.style.timeSignature.join('/')}<small>{groove.style.pulseGroups?.join('+') ?? 'PULS'}</small></span></div>
            <div className="transport">
              <button className="play-button" disabled={engine.sampleStatus === 'loading' && !engine.isPlaying} onClick={engine.togglePlay}>{engine.isPlaying ? <Square size={17} fill="currentColor" /> : <Play size={19} fill="currentColor" />}{engine.isPlaying ? 'Zatrzymaj' : engine.sampleStatus === 'loading' ? 'Ładowanie…' : 'Graj groove'}</button>
              <button className="transport-button" onClick={() => { engine.stop(); void engine.start(1); }}>Odlicz 1 takt</button>
              <button className={`transport-button ${engine.metronomeEnabled ? 'on' : ''}`} aria-pressed={engine.metronomeEnabled} onClick={engine.toggleMetronome}>Metronom</button>
              <button className="transport-button" onClick={engine.tapTempo}>Tap tempo</button>
              <button className="stop-small" aria-label="Zatrzymaj odtwarzanie" onClick={engine.stop}><Square size={16} /></button>
              <div className="bpm-readout"><b>{engine.bpm}</b><span>BPM<small>{groove.style.bpmUnit === 'dotted-quarter' ? '♩. = puls' : '♩ = puls'}</small></span></div>
            </div>
            <div className="player-bottom"><span><span className={`audio-dot ${engine.sampleStatus === 'error' ? 'error' : ''}`} />{engine.soundMode === 'synth' ? 'Syntezator · brzmienie alternatywne' : engine.sampleStatus === 'ready' ? 'Acoustic Sonor + VSCO · próbki gotowe' : engine.sampleStatus === 'error' ? 'Nie udało się wczytać próbek. Spróbuj ponownie.' : 'Acoustic Sonor + VSCO · nagrane instrumenty'}</span><select aria-label="Źródło brzmienia" value={engine.soundMode} onChange={e => engine.changeSoundMode(e.target.value as 'samples' | 'synth')}><option value="samples">Nagrane instrumenty</option><option value="synth">Syntezator PSR</option></select></div>
          </div>
          <div className="content-tabs" role="tablist" aria-label="Tryb ćwiczenia"><button role="tab" aria-selected={tab === 'groove'} onClick={() => setTab('groove')}><Layers size={16} />Mapa groove’u</button><button role="tab" aria-selected={tab === 'trainer'} onClick={() => setTab('trainer')}><ArrowUpRight size={16} />Trening tempa</button><button role="tab" aria-selected={tab === 'record'} onClick={() => setTab('record')}><Volume2 size={16} />Nagraj sesję</button></div>
          {tab === 'groove' && <>
            <section className="score panel-light">
              <div className="score-heading"><div><span className="eyebrow">SŁUCHAJ TEGO, CO WIDZISZ</span><h3>Mapa groove’u <span>{pattern.bars > 1 ? `${pattern.bars} takty · pełna fraza` : '1 takt'}</span></h3></div><div className="pattern-mode"><button className={engine.currentSection === 'mainA' ? 'active' : ''} onClick={() => engine.triggerSection('mainA')}>A</button><button className={engine.currentSection === 'mainB' ? 'active' : ''} onClick={() => engine.triggerSection('mainB')}>B</button><button onClick={() => engine.triggerSection('fillA')}>Fill</button></div></div>
              <p className="count-line">{engine.nextSection ? `Zaplanowana zmiana po pełnej frazie: ${engine.nextSection === 'mainB' ? 'B' : engine.nextSection === 'mainA' ? 'A' : 'Fill'}` : groove.count}</p>
              <div className="score-scroll"><table className="groove-grid"><thead><tr><th>INSTRUMENT / PARTIA</th>{pattern.steps.map((_, step) => { const unit = Math.floor(step / pattern.stepsPerBeat) % unitsPerBar; const sub = step % pattern.stepsPerBeat; const label = sub === 0 ? unit + 1 : pattern.stepsPerBeat === 4 ? ['','e','&','a'][sub] : engine.grooveControls.swing > 50 ? 'a' : '&'; return <th key={step} className={`${pulseSteps.includes(step % stepsPerBar) ? 'pulse-start' : ''} ${step % stepsPerBar === 0 ? 'bar-start' : ''} ${engine.isPlaying && engine.currentStep === step ? 'playing-step' : ''}`}>{label}</th>; })}</tr></thead><tbody>{activeInstruments.map(inst => <tr key={inst}><th><button className="instrument-pad" onClick={() => void engine.triggerInstrument(inst)} title="Posłuchaj instrumentu">{NAMES[inst] ?? DRUM_INSTRUMENTS_META[inst].name}</button><button className={`mute-button ${engine.mixerState[inst].isMuted ? 'muted-active' : ''}`} aria-label={`Wycisz: ${NAMES[inst] ?? inst}`} aria-pressed={engine.mixerState[inst].isMuted} onClick={() => engine.toggleChannelMute(inst)}>M</button><button className={`mute-button ${engine.mixerState[inst].isSolo ? 'solo-active' : ''}`} aria-label={`Solo: ${NAMES[inst] ?? inst}`} aria-pressed={engine.mixerState[inst].isSolo} onClick={() => engine.toggleChannelSolo(inst)}>S</button></th>{pattern.steps.map((hits, step) => { const hit = hits.find(h => h.instrument === inst); return <td key={step} className={`${step % stepsPerBar === 0 ? 'bar-start' : ''} ${pulseSteps.includes(step % stepsPerBar) ? 'pulse-start' : ''} ${engine.isPlaying && engine.currentStep === step ? 'playing-step' : ''} ${engine.mixerState[inst].isMuted ? 'muted-cell' : ''}`}><span aria-label={hit ? `${NAMES[inst] ?? inst}, krok ${step + 1}, ${hit.role}, dynamika ${Math.round(hit.velocity * 100)}%` : 'pauza'} className={hit ? `note ${hit.role ?? 'essential'} ${hit.velocity < 0.4 ? 'soft' : ''}` : 'rest'}>{hit ? hit.role === 'ghost' ? 'g' : inst.includes('hihat') || inst === 'ride' ? '×' : '●' : '·'}</span></td>; })}</tr>)}</tbody></table></div>
              <div className="grid-legend"><span><i className="legend-essential" />Esencja</span><span><i className="legend-variation" />Urozmaicenie</span><span><i className="legend-ghost" />Ghost note</span><span className="legend-hint">M = wycisz · S = solo · kliknij nazwę, aby posłuchać</span></div>
              <div className="practice-actions"><span>Teraz Twoja kolej:</span><button onClick={() => engine.applyMixerPreset('mute_kick')}>Gram stopę</button><button onClick={() => engine.applyMixerPreset('mute_snare')}>Gram werbel</button><button onClick={() => engine.applyMixerPreset('mute_hihat')}>Gram hi-hat</button><button onClick={() => engine.applyMixerPreset('all')}>Cały zestaw</button></div>
            </section>
            <section className="lesson panel-light"><div className="lesson-title"><div className="lesson-icon"><Headphones size={21} /></div><div><span className="eyebrow">ZROZUM, ZANIM PRZYSPIESZYSZ</span><h3>{groove.style.practiceFocus}</h3></div></div><ol>{groove.lesson.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}</ol><div className="lesson-footer"><Check size={15} />Wycisz jedną partię i graj ją sam. Pozostałe instrumenty utrzymają groove.</div></section>
          </>}
          {tab === 'trainer' && <div className="legacy-panel"><SpeedTrainer config={engine.speedTrainer} currentBpm={engine.bpm} totalBars={engine.totalBars} isPlaying={engine.isPlaying} onUpdateConfig={config => { engine.setSpeedTrainer(config); if (config.enabled) engine.setBpm(config.startBpm); }} /></div>}
          {tab === 'record' && <div className="legacy-panel"><AudioExporter isRecording={engine.isRecording} recordedAudioUrl={engine.recordedAudioUrl} recordedAudioType={engine.recordedAudioType} currentStyleName={engine.currentStyle.name} onStartRecording={engine.startRecording} onStopRecording={engine.stopRecording} /><p>{engine.recordingError ? 'Ta przeglądarka nie obsługuje rejestratora audio.' : 'Włącz nagrywanie, a następnie odtwórz groove. Nagranie zawiera słyszalny mikser i metronom.'}</p></div>}
        </section>
        <aside className="controls panel-light">
          <div className="panel-heading"><span className="eyebrow">03 / TWOJA INTERPRETACJA</span><Settings2 size={17} /></div><h2>Rozwijaj muzycznie</h2><p className="muted">Przygotowane warianty. Każdy gest ma sens w tym groovie.</p>
          <div className="essence-state"><span className={changed ? 'variation-state' : ''}>{changed ? `${changed} zmienionych ustawień` : engine.currentSection === 'mainB' ? 'Wariacja B · rozwinięcie' : engine.currentSection.startsWith('fill') ? 'Odpowiedź · Fill' : 'Grasz esencję groove’u'}</span><button aria-label="Przywróć esencję" onClick={engine.resetEssence}><RotateCcw size={14} />Reset</button></div>
          <div className="control-block"><label htmlFor="tempo">Tempo <output>{engine.bpm}<small> BPM</small></output></label><input id="tempo" type="range" min={groove.tempo[0]} max={groove.tempo[1]} value={engine.bpm} onChange={e => engine.setBpm(Number(e.target.value))} /><div className="range-endpoints"><span>{groove.tempo[0]}</span><span>{groove.tempo[1]}</span></div><p>{groove.style.bpmUnit === 'dotted-quarter' ? 'Jeden klik = ćwierćnuta z kropką, czyli trzy ósemki.' : 'BPM liczymy w ćwierćnutach. Zacznij w tempie, w którym grasz swobodnie.'}</p></div>
          {(Object.keys(CONTROL_LABELS) as ControlKey[]).map(key => { const cap = groove.controls[key]; const disabled = cap.min === cap.max; const value = engine.grooveControls[key]; const unit = key === 'swing' ? '%' : key === 'humanize' ? ' ms' : ''; return <div className={`control-block ${disabled ? 'locked-control' : ''}`} key={key}><label htmlFor={key}>{CONTROL_LABELS[key]}<output>{disabled ? <Minus size={15} /> : `${value}${unit}`}</output></label><input id={key} type="range" min={cap.min} max={disabled ? cap.max + 1 : cap.max} value={value} disabled={disabled} onChange={e => engine.setGrooveControl(key, Number(e.target.value))} aria-describedby={`${key}-description`} />{cap.levels && !disabled && <div className="level-caption">{cap.levels[value]}</div>}<p id={`${key}-description`}>{cap.description}</p></div>; })}
          <div className="master-control"><label htmlFor="volume"><Volume2 size={15} />Głośność <output>{Math.round(engine.masterVolume * 100)}%</output></label><input id="volume" type="range" min="0" max="1" step="0.01" value={engine.masterVolume} onChange={e => engine.setMasterVolume(Number(e.target.value))} /></div>
        </aside>
      </div>
      <footer className="lab-footer"><span>GROOVE LAB <b>/</b> ESENCJA → ZROZUMIENIE → SWOBODA</span><span>Próbki: <a href="https://github.com/sfzinstruments/SamsSonor" target="_blank" rel="noreferrer">Sam Greene · Sonor</a> + <a href="https://github.com/sgossner/VSCO-2-CE" target="_blank" rel="noreferrer">VSCO</a><span className="footer-separator">·</span><a href={window.__GROOVE_CREDITS__ ?? './samples/CREDITS.md'} download={window.__GROOVE_CREDITS__ ? 'groove-lab-credits.txt' : undefined} target="_blank" rel="noreferrer">Licencje</a></span></footer>
    </main>
  </div>;
}
