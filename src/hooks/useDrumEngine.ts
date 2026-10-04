// @refresh reset
import { normalizeTrainer, trainerTempo, normalizeLaboratory, LaboratoryConfig } from '../domain/practice';
import { getGroove } from '../domain/grooves';
import { getSongMap } from '../domain/songMaps';
import { composeGroove, defaultStudioControls, normalizeStudioControls, normalizeOptions, setCell, studioCapabilities, StudioControls, StudioControlKey, StudioOptions, CellEdit, KIT } from '../domain/studio';
import { KitMix, normalizeDraft, normalizeMix, PracticeDraft, sampleTuning, serializeDraft, VoiceMix } from '../domain/session';
import { useState, useEffect, useRef, useCallback } from 'react';
import { DrumInstrument, RhythmSection, RhythmStyle, DrumHit } from '../types/rhythm';
import { DrumMixerState, SpeedTrainerConfig, DrumSoundParams, DrumKitPreset, FillType } from '../types/audio';
import { DrumSynthesizer, DEFAULT_SOUND_PARAMS } from '../audio/DrumSynthesizer';
import { AudioScheduler } from '../audio/AudioScheduler';
import { AudioRecorder } from '../audio/AudioRecorder';
import { ALL_STYLES, getStyleById } from '../data';

const DEFAULT_MIXER_STATE: DrumMixerState = {
  clave: { volume: 0.7, pan: 0.15, isMuted: false, isSolo: false },
  kick: { volume: 0.9, pan: 0, isMuted: false, isSolo: false },
  snare: { volume: 0.85, pan: 0, isMuted: false, isSolo: false },
  rimshot: { volume: 0.8, pan: -0.1, isMuted: false, isSolo: false },
  clap: { volume: 0.75, pan: 0.1, isMuted: false, isSolo: false },
  hihat_closed: { volume: 0.7, pan: -0.25, isMuted: false, isSolo: false },
  hihat_open: { volume: 0.75, pan: -0.25, isMuted: false, isSolo: false },
  hihat_pedal: { volume: 0.6, pan: -0.25, isMuted: false, isSolo: false },
  tom_high: { volume: 0.8, pan: -0.3, isMuted: false, isSolo: false },
  tom_mid: { volume: 0.8, pan: 0.1, isMuted: false, isSolo: false },
  tom_low: { volume: 0.85, pan: 0.35, isMuted: false, isSolo: false },
  crash: { volume: 0.75, pan: -0.4, isMuted: false, isSolo: false },
  ride: { volume: 0.75, pan: 0.3, isMuted: false, isSolo: false },
  ride_bell: { volume: 0.8, pan: 0.3, isMuted: false, isSolo: false },
  tambourine: { volume: 0.65, pan: 0.2, isMuted: false, isSolo: false },
  cowbell: { volume: 0.7, pan: 0.15, isMuted: false, isSolo: false },
  conga_high: { volume: 0.75, pan: -0.2, isMuted: false, isSolo: false },
  conga_low: { volume: 0.75, pan: 0.2, isMuted: false, isSolo: false },
  shaker: { volume: 0.6, pan: 0.1, isMuted: false, isSolo: false }
};

export function useDrumEngine() {
  const [grooveControls, setGrooveControls] = useState<StudioControls>(defaultStudioControls('00'));
  const [studioOptions, setStudioOptions] = useState<Required<StudioOptions>>(() => normalizeOptions());
  const [kitMix, setKitMix] = useState<KitMix>(() => normalizeMix());
  const [draftMessage, setDraftMessage] = useState('');
  const [sampleStatus, setSampleStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [soundMode, setSoundMode] = useState<'samples' | 'synth'>('samples');
  const playRequest = useRef(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStyle, setCurrentStyle] = useState<RhythmStyle>(() => composeGroove('00'));
  const [currentSection, setCurrentSection] = useState<RhythmSection>('mainA');
  const [nextSection, setNextSection] = useState<RhythmSection | null>(null);
  const [activeFillType, setActiveFillType] = useState<FillType | null>(null);
  const [bpm, setBpmState] = useState<number>(ALL_STYLES[0].defaultBpm);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentBar, setCurrentBar] = useState<number>(1);
  const [totalBars, setTotalBars] = useState<number>(0);
  const [activeHits, setActiveHits] = useState<DrumHit[]>([]);

  // Count-In state
  const [countInActive, setCountInActive] = useState<boolean>(false);
  const [countInBeat, setCountInBeat] = useState<{ current: number; total: number } | null>(null);

  // Metronome state
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(false);
  const [metronomeVolume, setMetronomeVolume] = useState<number>(0.6);

  // Mixer state
  const [mixerState, setMixerState] = useState<DrumMixerState>(() => ({ ...DEFAULT_MIXER_STATE, ...Object.fromEntries(KIT.map(i => [i, { ...DEFAULT_MIXER_STATE[i], volume: normalizeMix()[i].volume, pan: normalizeMix()[i].pan }])) }));
  const [masterVolume, setMasterVolumeState] = useState<number>(0.85);

  // Speed Trainer state
  const [speedTrainer, setSpeedTrainer] = useState<SpeedTrainerConfig>({
    enabled: false,
    startBpm: 100,
    targetBpm: 160,
    bpmStep: 2,
    barsPerStep: 4,
    currentCycleBars: 0
  });

  // Drum Kit Studio / Sound Params state
  const [soundParams, setSoundParamsState] = useState<Record<DrumInstrument, DrumSoundParams>>(() => ({ ...Object.fromEntries(Object.entries(DEFAULT_SOUND_PARAMS).map(([i, params]) => [i, { ...params, toneFrequency: 20000 }])), ...Object.fromEntries(KIT.map(i => [i, sampleTuning(normalizeMix()[i])])) }) as Record<DrumInstrument, DrumSoundParams>);
  const [currentKitPreset, setCurrentKitPreset] = useState<DrumKitPreset | null>(null);
  const [customKitPresets, setCustomKitPresets] = useState<DrumKitPreset[]>(() => {
    try {
      const saved = localStorage.getItem('yamaha_kit_presets');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Recording
  const [recordedAudioType, setRecordedAudioType] = useState('audio/webm');
  const [recordingError, setRecordingError] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Audio Instances Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<DrumSynthesizer | null>(null);
  const schedulerRef = useRef<AudioScheduler | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const [comparisonSlots,setComparisonSlots]=useState<{a:PracticeDraft|null;b:PracticeDraft|null}>({a:null,b:null});
  const [practiceSilent,setPracticeSilent]=useState(false);
  const [laboratory,setLaboratoryState]=useState(()=>normalizeLaboratory());
  const liveArrangement=useRef({id:currentStyle.id,controls:grooveControls,options:studioOptions});
  liveArrangement.current={id:currentStyle.id,controls:grooveControls,options:studioOptions};
  const resolveComplexity=(level:number)=>{ const live=liveArrangement.current; return composeGroove(live.id,{...live.controls,complexity:level},live.options); };
  const updateLaboratory=(update:Partial<LaboratoryConfig>)=>setLaboratoryState(prev=>normalizeLaboratory({...prev,...update}));
  useEffect(()=>{
    schedulerRef.current?.setLaboratory(laboratory,grooveControls.complexity,studioCapabilities(currentStyle.id,studioOptions).complexity.max,resolveComplexity);
  },[laboratory,currentStyle.id]);

  // Tap Tempo state
  const tapTimesRef = useRef<number[]>([]);

  // Initialize Web Audio Engine once
  const initEngine = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const synth = new DrumSynthesizer(ctx);
      synthRef.current = synth;
      synth.updateMixer(mixerState);
      synth.setMasterVolume(masterVolume);
      synth.setAllSoundParams(soundParams);
      synth.setSampleMode(soundMode === 'samples');

      const scheduler = new AudioScheduler(synth, currentStyle);
      schedulerRef.current = scheduler;
      scheduler.setHumanize(grooveControls.humanize);
      scheduler.setLaboratory(laboratory,grooveControls.complexity,studioCapabilities(currentStyle.id,studioOptions).complexity.max,resolveComplexity);

      const recorder = new AudioRecorder(ctx, synth.getMasterNode());
      recorderRef.current = recorder;

      scheduler.setCallbacks({
        onPracticePhase:setPracticeSilent,
        onComplexityChange:(level,style)=>{setGrooveControls(prev=>({...prev,complexity:level}));setCurrentStyle(style);},
        onStepChange: (step, bar, section, hits) => {
          setCountInActive(false); setCountInBeat(null);
          setCurrentStep(step);
          setCurrentBar(bar);
          setCurrentSection(section);
          setActiveHits(hits);
        },
        onSectionChange: (section) => {
          setCurrentSection(section);
          setNextSection(null);
        },
        onFillTriggered: (fillType, targetSection) => {
          setActiveFillType(fillType);
          if (fillType === null) {
            setCurrentSection(targetSection);
            setNextSection(null);
          }
        },
        onBarComplete: (barCount) => {
          setTotalBars(barCount);
        },
        onPlaybackEnd: () => {
          setPracticeSilent(false); setIsPlaying(false);
          setCountInActive(false);
          setCountInBeat(null);
          setActiveHits([]);
          setNextSection(null);
          setActiveFillType(null);
        },
        onCountInBeat: (current, total) => {
          setCountInActive(true);
          setCountInBeat({ current, total });
        }
      });
    }
  }, [currentStyle, mixerState, masterVolume, soundParams, soundMode, grooveControls.humanize, laboratory]);

  const trainerBarRef = useRef(0);
  // Handle Speed Trainer logic when bar completes
  useEffect(() => {
    const previousBars = trainerBarRef.current;
    trainerBarRef.current = totalBars;
    if (!isPlaying) return;
    const next = trainerTempo(bpm, totalBars, previousBars, speedTrainer, getGroove(currentStyle.id).tempo[1]);
    if (next !== bpm) { setBpmState(next); schedulerRef.current?.setBpm(next); }
  }, [totalBars, isPlaying, speedTrainer, currentStyle.id, bpm]);

  // Sync mixer updates to synth
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.updateMixer(mixerState);
    }
  }, [mixerState]);

  // Sync master volume
  const setMasterVolume = useCallback((vol: number) => {
    setMasterVolumeState(vol);
    if (synthRef.current) {
      synthRef.current.setMasterVolume(vol);
    }
  }, []);

  // Sync BPM changes to scheduler
  const setBpm = useCallback((newBpm: number) => {
    const [min, max] = getGroove(currentStyle.id).tempo;
    const clamped = Math.max(min, Math.min(max, Math.round(newBpm * 10) / 10));
    setBpmState(clamped);
    if (schedulerRef.current) {
      schedulerRef.current.setBpm(clamped);
    }
  }, [currentStyle.id]);

  // Metronome controls
  const toggleMetronome = useCallback(() => {
    setMetronomeEnabled((prev) => {
      const next = !prev;
      if (schedulerRef.current) {
        schedulerRef.current.setMetronome(next, metronomeVolume);
      }
      return next;
    });
  }, [metronomeVolume]);

  const updateMetronomeVolume = useCallback((vol: number) => {
    setMetronomeVolume(vol);
    if (schedulerRef.current) {
      schedulerRef.current.setMetronome(metronomeEnabled, vol);
    }
  }, [metronomeEnabled]);

  // Play / Stop Controls
  const prepareAudio = useCallback(async () => {
    initEngine();
    const synth = synthRef.current!;
    await synth.initAudio();
    synth.setSampleMode(soundMode === 'samples');
    if (soundMode === 'samples') {
      if (sampleStatus !== 'ready') setSampleStatus('loading');
      try { await synth.loadSamples(); setSampleStatus('ready'); }
      catch (error) { console.error('Recorded kit failed:', error); setSampleStatus('error'); return false; }
    }
    return true;
  }, [initEngine, soundMode, sampleStatus]);

  const start = useCallback(async (countInBars = 0) => {
    const request = ++playRequest.current;
    initEngine();
    const scheduler = schedulerRef.current!;
    scheduler.setBpm(bpm);
    scheduler.setMetronome(metronomeEnabled, metronomeVolume);
    if (!await prepareAudio() || request !== playRequest.current) return;
    scheduler.start(countInBars);
    trainerBarRef.current = 0;
    setTotalBars(0);
    setIsPlaying(true);
    setCountInActive(countInBars > 0);
  }, [initEngine, prepareAudio, bpm, metronomeEnabled, metronomeVolume]);

  const stop = useCallback(() => {
    ++playRequest.current;
    if (schedulerRef.current) {
      schedulerRef.current.stop();
    }
    setIsPlaying(false);
    setCountInActive(false);
    setCountInBeat(null);
    setActiveHits([]);
    setNextSection(null); setActiveFillType(null);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start(0);
    }
  }, [isPlaying, start, stop]);

  // Style change
  const selectStyle = useCallback((styleOrId: string | RhythmStyle, songPresetId = '') => {
    setLaboratoryState(prev=>normalizeLaboratory({...prev,gap:false,ladder:false}));
    const id = typeof styleOrId === 'string' ? getStyleById(styleOrId).id : styleOrId.id;
    setSpeedTrainer(prev => normalizeTrainer({ ...prev, enabled: false, startBpm: songPresetId ? getSongMap(songPresetId,id).bpm : getGroove(id).style.defaultBpm, targetBpm: (songPresetId ? getSongMap(songPresetId,id).bpm : getGroove(id).style.defaultBpm) + 30 }, getGroove(id).tempo));
    setMixerState(prev => Object.fromEntries(Object.entries(prev).map(([inst, channel]) => [inst, { ...channel, isSolo: false }])));
    const controls = defaultStudioControls(id,{songPresetId});
    const options = normalizeOptions({ ...studioOptions, secondTom: id === '14', songPresetId, reggaeVariant: 'one-drop', edits: [] });
    setStudioOptions(options);
    const style = composeGroove(id, controls, options);
    setGrooveControls(controls);
    setCurrentStyle(style);
    setCurrentSection('mainA'); setNextSection(null); setActiveFillType(null);
    setCurrentStep(0); setCurrentBar(1); setCountInActive(false); setCountInBeat(null);
    setBpmState(style.defaultBpm);
    ++playRequest.current;
    const scheduler = schedulerRef.current;
    const wasPlaying = scheduler?.getIsRunning() ?? false;
    if (wasPlaying) scheduler?.stop();
    scheduler?.setStyle(style, true);
    scheduler?.triggerSection('mainA', true);
    scheduler?.setHumanize(controls.humanize);
    if (wasPlaying) { scheduler?.start(); setIsPlaying(true); trainerBarRef.current = 0; setTotalBars(0); }
  }, [studioOptions]);

  const setGrooveControl = useCallback((key: StudioControlKey, value: number) => {
    if(key==='complexity') setLaboratoryState(prev=>normalizeLaboratory({...prev,ladder:false}));
    const next = normalizeStudioControls(currentStyle.id, { ...grooveControls, [key]: value }, studioOptions);
    setGrooveControls(next);
    const style = composeGroove(currentStyle.id, next, studioOptions);
    setCurrentStyle(style);
    schedulerRef.current?.setStyle(style, false);
    schedulerRef.current?.setHumanize(next.humanize);
  }, [currentStyle.id, grooveControls, studioOptions]);


  const updateStudioOptions = useCallback((update: StudioOptions) => {
    const options = normalizeOptions({ ...studioOptions, ...update },currentStyle.id);
    const controls=normalizeStudioControls(currentStyle.id,grooveControls,options);
    setStudioOptions(options); setGrooveControls(controls);
    const style = composeGroove(currentStyle.id, controls, options);
    setCurrentStyle(style); schedulerRef.current?.setStyle(style, false);
  }, [studioOptions, currentStyle.id, grooveControls]);
  const editCell = useCallback((edit: CellEdit) => updateStudioOptions({ edits: setCell(studioOptions.edits, edit) }), [studioOptions.edits, updateStudioOptions]);
  const updateVoiceMix = useCallback((inst: typeof KIT[number], key: keyof VoiceMix, value: number) => {
    const mix = normalizeMix({ ...kitMix, [inst]: { ...kitMix[inst], [key]: value } });
    setKitMix(mix);
    const params = { ...soundParams, [inst]: sampleTuning(mix[inst]) };
    setSoundParamsState(params); synthRef.current?.setAllSoundParams(params);
    setMixerState(prev => ({ ...prev, [inst]: { ...prev[inst], volume: mix[inst].volume, pan: mix[inst].pan } }));
  }, [kitMix, soundParams]);
  const resetVoiceMix = (inst: typeof KIT[number]) => {
    const mix = normalizeMix()[inst];
    setKitMix(prev => ({ ...prev, [inst]: mix }));
    const params = { ...soundParams, [inst]: sampleTuning(mix) };
    setSoundParamsState(params); synthRef.current?.setAllSoundParams(params);
    setMixerState(prev => ({ ...prev, [inst]: { ...prev[inst], volume: mix.volume, pan: mix.pan } }));
  };
  const draft: PracticeDraft = { laboratory, version: 1, id: currentStyle.id, bpm, controls: grooveControls, options: studioOptions, mix: kitMix };
  const saveDraft = () => { try { localStorage.setItem('groovelab_practice_v1', serializeDraft(draft)); setDraftMessage('Zapisano w tej przeglądarce.'); } catch { setDraftMessage('Zapis lokalny niedostępny. Użyj eksportu JSON.'); } };
  const loadDraft = (json?: string) => {
    try {
      const value = normalizeDraft(JSON.parse(json ?? localStorage.getItem('groovelab_practice_v1') ?? 'null'));
      stop(); setLaboratoryState(normalizeLaboratory(value.laboratory)); setGrooveControls(value.controls); setStudioOptions(value.options); setKitMix(value.mix); setBpmState(value.bpm);
      const style = composeGroove(value.id, value.controls, value.options);
      setCurrentStyle(style); setCurrentSection('mainA'); setNextSection(null); setCurrentStep(0); setTotalBars(0);
      setSpeedTrainer(prev => normalizeTrainer({ ...prev, enabled: false, startBpm: value.bpm, targetBpm: value.bpm + 30 }, getGroove(value.id).tempo));
      schedulerRef.current?.setStyle(style, true); schedulerRef.current?.triggerSection('mainA', true); schedulerRef.current?.setBpm(value.bpm); schedulerRef.current?.setHumanize(value.controls.humanize);
      const params = { ...soundParams, ...Object.fromEntries(KIT.map(i => [i, sampleTuning(value.mix[i])])) };
      setSoundParamsState(params); synthRef.current?.setAllSoundParams(params);
      setMixerState(prev => ({ ...prev, ...Object.fromEntries(KIT.map(i => [i, { ...prev[i], volume: value.mix[i].volume, pan: value.mix[i].pan, isMuted: false, isSolo: false }])) }));
      setDraftMessage('Wczytano groove i brzmienie zestawu.');
    } catch (e) { setDraftMessage(e instanceof Error ? e.message : 'Nie udało się wczytać groove’u.'); }
  };

  const updateSpeedTrainer = useCallback((config: SpeedTrainerConfig) => {
    setSpeedTrainer(normalizeTrainer(config, getGroove(currentStyle.id).tempo));
  }, [currentStyle.id]);

  const resetEssence = useCallback(() => selectStyle(currentStyle.id), [selectStyle, currentStyle.id]);
  const changeSoundMode = useCallback((mode: 'samples' | 'synth') => {
    stop(); setSoundMode(mode); synthRef.current?.setSampleMode(mode === 'samples');
  }, [stop]);

  // Section change (Intro, Main A/B, Fill-in, Ending)
  const triggerSection = useCallback((section: RhythmSection, immediate = false) => {
    initEngine();
    if (!isPlaying) {
      setCurrentSection(section);
      if (schedulerRef.current) {
        schedulerRef.current.triggerSection(section, true);
      }
      return;
    }

    if (schedulerRef.current) {
      schedulerRef.current.triggerSection(section, immediate);
      if (!immediate) {
        setNextSection(section);
      } else {
        setCurrentSection(section);
        setNextSection(null);
      }
    }
  }, [initEngine, isPlaying]);

  // Tap Tempo
  const tapTempo = useCallback(() => {
    const now = Date.now();
    const taps = tapTimesRef.current.filter((t) => now - t < 3000);
    taps.push(now);
    tapTimesRef.current = taps;

    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);
    }
  }, [setBpm]);

  // Manual Trigger instrument pad (e.g. clicking on drum grid row)
  const triggerInstrument = useCallback(async (instrument: DrumInstrument, velocity = 0.85) => {
    if (await prepareAudio() && synthRef.current && audioCtxRef.current) {
      synthRef.current.trigger(instrument, audioCtxRef.current.currentTime, velocity);
    }
  }, [prepareAudio]);

  // Channel mixer handlers
  const setChannelVolume = useCallback((instrument: DrumInstrument, volume: number) => {
    setMixerState((prev) => ({
      ...prev,
      [instrument]: { ...prev[instrument], volume }
    }));
  }, []);

  const setChannelPan = useCallback((instrument: DrumInstrument, pan: number) => {
    setMixerState((prev) => ({
      ...prev,
      [instrument]: { ...prev[instrument], pan }
    }));
  }, []);

  const toggleChannelMute = useCallback((instrument: DrumInstrument) => {
    setMixerState((prev) => ({
      ...prev,
      [instrument]: { ...prev[instrument], isMuted: !prev[instrument].isMuted }
    }));
  }, []);

  const toggleChannelSolo = useCallback((instrument: DrumInstrument) => {
    setMixerState((prev) => ({
      ...prev,
      [instrument]: { ...prev[instrument], isSolo: !prev[instrument].isSolo }
    }));
  }, []);

  const applyMixerPreset = useCallback((preset: 'all' | 'mute_kick' | 'mute_snare' | 'mute_hihat' | 'cymbals_only' | 'kick_snare_only') => {
    setMixerState((prev) => {
      const next = { ...prev };
      (Object.keys(next) as DrumInstrument[]).forEach((inst) => {
        next[inst] = { ...next[inst], isMuted: false, isSolo: false };
      });

      if (preset === 'mute_kick') {
        next.kick = { ...next.kick, isMuted: true };
      } else if (preset === 'mute_snare') {
        next.snare = { ...next.snare, isMuted: true };
        next.rimshot = { ...next.rimshot, isMuted: true };
      } else if (preset === 'mute_hihat') {
        next.hihat_closed = { ...next.hihat_closed, isMuted: true };
        next.hihat_open = { ...next.hihat_open, isMuted: true };
        next.hihat_pedal = { ...next.hihat_pedal, isMuted: true };
      } else if (preset === 'kick_snare_only') {
        next.kick = { ...next.kick, isSolo: true };
        next.snare = { ...next.snare, isSolo: true };
      } else if (preset === 'cymbals_only') {
        next.hihat_closed = { ...next.hihat_closed, isSolo: true };
        next.hihat_open = { ...next.hihat_open, isSolo: true };
        next.ride = { ...next.ride, isSolo: true };
        next.crash = { ...next.crash, isSolo: true };
      }
      return next;
    });
  }, []);

  // Audio Recording
  const startRecording = useCallback(() => {
    initEngine();
    if (recorderRef.current) {
      void audioCtxRef.current?.resume();
      recorderRef.current.startRecording();
      setIsRecording(recorderRef.current.getIsRecording());
      setRecordingError(!recorderRef.current.getIsRecording());
    }
  }, [initEngine]);

  const stopRecording = useCallback(async () => {
    if (recorderRef.current) {
      const blob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        setRecordedAudioType(blob.type);
      }
    }
  }, []);

  // ── Kit Studio: Sound Parameter Controls ─────────────────────────────────

  const setSoundParam = useCallback((inst: DrumInstrument, key: keyof DrumSoundParams, val: number) => {
    setSoundParamsState((prev) => {
      const next = { ...prev, [inst]: { ...prev[inst], [key]: val } };
      if (synthRef.current) {
        synthRef.current.setAllSoundParams(next);
      }
      return next;
    });
  }, []);

  const applyKitPreset = useCallback((preset: DrumKitPreset) => {
    setCurrentKitPreset(preset);
    if (synthRef.current) {
      synthRef.current.applyKitPreset(preset);
      setSoundParamsState({ ...synthRef.current.getSoundParams() });
    }
  }, []);

  const saveCustomPreset = useCallback((name: string, description: string) => {
    const id = `custom_${Date.now()}`;
    const newPreset: DrumKitPreset = {
      id,
      name,
      description,
      model: 'acoustic_custom',
      params: Object.fromEntries(
        Object.entries(soundParams).map(([k, v]) => [k, { ...v }])
      ) as DrumKitPreset['params'],
      isCustom: true
    };
    setCustomKitPresets((prev) => {
      const updated = [...prev, newPreset];
      try { localStorage.setItem('yamaha_kit_presets', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setCurrentKitPreset(newPreset);
  }, [soundParams]);

  const deleteCustomPreset = useCallback((id: string) => {
    setCustomKitPresets((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try { localStorage.setItem('yamaha_kit_presets', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setCurrentKitPreset((prev) => prev?.id === id ? null : prev);
  }, []);

  useEffect(() => () => {
    ++playRequest.current;
    schedulerRef.current?.stop();
    void recorderRef.current?.stopRecording();
    const ctx = audioCtxRef.current;
    audioCtxRef.current = null; schedulerRef.current = null; synthRef.current = null; recorderRef.current = null;
    if (ctx && ctx.state !== 'closed') void ctx.close().catch(() => {});
  }, []);
  useEffect(() => () => { if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl); }, [recordedAudioUrl]);

  return {
    comparisonSlots, captureComparisonSlot:(key:'a'|'b')=>setComparisonSlots(prev=>({...prev,[key]:normalizeDraft(draft)})), practiceSilent, laboratory,updateLaboratory, studioOptions, updateStudioOptions, editCell, loadSongMap: (id: string) => selectStyle(getSongMap(id).grooveId,id), kitMix, updateVoiceMix, resetVoiceMix, draft, saveDraft, loadDraft, draftMessage, reportDraftError: setDraftMessage,
    grooveControls, setGrooveControl, resetEssence, sampleStatus, soundMode, changeSoundMode,
    // Sequencer / Playback state
    isPlaying,
    currentStyle,
    currentSection,
    nextSection,
    activeFillType,
    bpm,
    currentStep,
    currentBar,
    totalBars,
    activeHits,

    // Count In & Metronome
    countInActive,
    countInBeat,
    metronomeEnabled,
    metronomeVolume,

    // Mixer state
    mixerState,
    masterVolume,

    // Speed Trainer
    speedTrainer,

    // Kit Studio
    soundParams,
    currentKitPreset,
    customKitPresets,

    // Recording
    isRecording,
    recordedAudioUrl, recordedAudioType, recordingError,

    // Actions
    start,
    stop,
    togglePlay,
    selectStyle,
    triggerSection,
    setBpm,
    tapTempo,
    toggleMetronome,
    updateMetronomeVolume,
    triggerInstrument,
    setChannelVolume,
    setChannelPan,
    toggleChannelMute,
    toggleChannelSolo,
    applyMixerPreset,
    setMasterVolume,
    setSpeedTrainer: updateSpeedTrainer,
    startRecording,
    stopRecording,
    setSoundParam,
    applyKitPreset,
    saveCustomPreset,
    deleteCustomPreset
  };
}
