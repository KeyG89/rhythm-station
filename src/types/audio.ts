import { DrumInstrument, RhythmSection, RhythmStyle } from './rhythm';

export interface DrumChannelState {
  volume: number; // 0.0 - 1.0
  pan: number; // -1.0 to 1.0
  isMuted: boolean;
  isSolo: boolean;
}

export type DrumMixerState = Record<DrumInstrument, DrumChannelState>;

export interface SpeedTrainerConfig {
  enabled: boolean;
  startBpm: number;
  targetBpm: number;
  bpmStep: number; // e.g. +2 or +5 BPM
  barsPerStep: number; // e.g. every 4 or 8 bars
  currentCycleBars: number;
}

export interface SequencerState {
  isPlaying: boolean;
  currentStyle: RhythmStyle;
  currentSection: RhythmSection;
  nextSection: RhythmSection | null; // For queuing fill-ins or section transitions
  bpm: number;
  currentStep: number; // Step index within current section
  currentBar: number;
  totalBarsPlayed: number;
  countInBarsLeft: number; // 0 when playing, 1 or 2 during count-in
  metronomeEnabled: boolean;
  metronomeVolume: number;
  masterVolume: number;
}
