import { useState, useEffect, useRef, useCallback } from 'react';
import { DrumInstrument, RhythmSection, RhythmStyle, DrumHit } from '../types/rhythm';
import { DrumMixerState, SpeedTrainerConfig } from '../types/audio';
import { DrumSynthesizer } from '../audio/DrumSynthesizer';
import { AudioScheduler } from '../audio/AudioScheduler';
import { AudioRecorder } from '../audio/AudioRecorder';
import { ALL_STYLES, getStyleById } from '../data';

const DEFAULT_MIXER_STATE: DrumMixerState = {
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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStyle, setCurrentStyle] = useState<RhythmStyle>(ALL_STYLES[0]);
  const [currentSection, setCurrentSection] = useState<RhythmSection>('mainA');
  const [nextSection, setNextSection] = useState<RhythmSection | null>(null);
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
  const [mixerState, setMixerState] = useState<DrumMixerState>(DEFAULT_MIXER_STATE);
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

  // Recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Audio Instances Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<DrumSynthesizer | null>(null);
  const schedulerRef = useRef<AudioScheduler | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

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

      const scheduler = new AudioScheduler(synth, currentStyle);
      schedulerRef.current = scheduler;

      const recorder = new AudioRecorder(ctx, synth.getMasterNode());
      recorderRef.current = recorder;

      scheduler.setCallbacks({
        onStepChange: (step, bar, section, hits) => {
          setCurrentStep(step);
          setCurrentBar(bar);
          setCurrentSection(section);
          setActiveHits(hits);
        },
        onSectionChange: (section) => {
          setCurrentSection(section);
          setNextSection(null);
        },
        onBarComplete: (barCount) => {
          setTotalBars(barCount);
        },
        onPlaybackEnd: () => {
          setIsPlaying(false);
          setCountInActive(false);
          setCountInBeat(null);
          setActiveHits([]);
          setNextSection(null);
        },
        onCountInBeat: (current, total) => {
          setCountInActive(true);
          setCountInBeat({ current, total });
        }
      });
    }
  }, [currentStyle]);

  // Handle Speed Trainer logic when bar completes
  useEffect(() => {
    if (speedTrainer.enabled && isPlaying && totalBars > 0 && totalBars % speedTrainer.barsPerStep === 0) {
      setBpmState((prevBpm) => {
        if (prevBpm < speedTrainer.targetBpm) {
          const newBpm = Math.min(speedTrainer.targetBpm, prevBpm + speedTrainer.bpmStep);
          if (schedulerRef.current) {
            schedulerRef.current.setBpm(newBpm);
          }
          return newBpm;
        }
        return prevBpm;
      });
    }
  }, [totalBars, isPlaying, speedTrainer]);

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
    const clamped = Math.max(30, Math.min(300, Math.round(newBpm)));
    setBpmState(clamped);
    if (schedulerRef.current) {
      schedulerRef.current.setBpm(clamped);
    }
  }, []);

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
  const start = useCallback((countInBars = 0) => {
    initEngine();
    if (schedulerRef.current) {
      schedulerRef.current.setBpm(bpm);
      schedulerRef.current.setMetronome(metronomeEnabled, metronomeVolume);
      schedulerRef.current.start(countInBars);
      setIsPlaying(true);
      if (countInBars > 0) {
        setCountInActive(true);
      }
    }
  }, [initEngine, bpm, metronomeEnabled, metronomeVolume]);

  const stop = useCallback(() => {
    if (schedulerRef.current) {
      schedulerRef.current.stop();
    }
    setIsPlaying(false);
    setCountInActive(false);
    setCountInBeat(null);
    setActiveHits([]);
    setNextSection(null);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start(0);
    }
  }, [isPlaying, start, stop]);

  // Style change
  const selectStyle = useCallback((styleOrId: string | RhythmStyle) => {
    const style = typeof styleOrId === 'string' ? getStyleById(styleOrId) : styleOrId;
    setCurrentStyle(style);
    setBpmState(style.defaultBpm);
    if (schedulerRef.current) {
      schedulerRef.current.setStyle(style, true);
    }
  }, []);

  // Section change (Intro, Main A/B, Fill-in, Ending)
  const triggerSection = useCallback((section: RhythmSection, immediate = false) => {
    initEngine();
    if (!isPlaying) {
      setCurrentSection(section);
      if (schedulerRef.current) {
        schedulerRef.current.triggerSection(section, true);
      }
      start(0);
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
  }, [initEngine, isPlaying, start]);

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
  const triggerInstrument = useCallback((instrument: DrumInstrument, velocity = 0.85) => {
    initEngine();
    if (synthRef.current && audioCtxRef.current) {
      synthRef.current.trigger(instrument, audioCtxRef.current.currentTime, velocity);
    }
  }, [initEngine]);

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
      recorderRef.current.startRecording();
      setIsRecording(true);
    }
  }, [initEngine]);

  const stopRecording = useCallback(async () => {
    if (recorderRef.current) {
      const blob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      }
    }
  }, []);

  return {
    // Sequencer / Playback state
    isPlaying,
    currentStyle,
    currentSection,
    nextSection,
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

    // Recording
    isRecording,
    recordedAudioUrl,

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
    setSpeedTrainer,
    startRecording,
    stopRecording
  };
}
