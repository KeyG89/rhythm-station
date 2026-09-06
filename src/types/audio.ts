import { DrumInstrument, RhythmSection, RhythmStyle } from './rhythm';

export interface DrumChannelState {
  volume: number; // 0.0 - 1.0
  pan: number; // -1.0 to 1.0
  isMuted: boolean;
  isSolo: boolean;
}

export interface DrumMixerState {
  [key: string]: DrumChannelState;
}

export type DrumSoundModel = 'acoustic_custom' | 'vintage_warmth' | 'rock_heavy' | 'gated_80s' | 'electronic_808' | 'jazz_maple';

export interface DrumSoundParams {
  pitchMultiplier: number; // 0.5 to 2.0 (default 1.0)
  decayMultiplier: number; // 0.2 to 3.0 (default 1.0)
  toneFrequency: number; // filter cutoff / tone in Hz (e.g. 500 to 12000)
  snappy: number; // 0.0 to 1.0 (snare / metallic presence)
  drive: number; // 0.0 to 1.0 (saturation / punch)
}

export interface DrumKitPreset {
  id: string;
  name: string;
  description: string;
  model: DrumSoundModel;
  params: Partial<Record<DrumInstrument, DrumSoundParams>>;
  isCustom?: boolean;
}

export type FillType = 'micro' | 'medium' | 'full';

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
  activeFillType?: FillType | null;
  bpm: number;
  currentStep: number; // Step index within current section
  currentBar: number;
  totalBarsPlayed: number;
  countInBarsLeft: number; // 0 when playing, 1 or 2 during count-in
  metronomeEnabled: boolean;
  metronomeVolume: number;
  masterVolume: number;
}
