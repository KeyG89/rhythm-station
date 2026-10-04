import { SampleKit } from './SampleKit';
import { DrumInstrument } from '../types/rhythm';
import { DrumMixerState, DrumSoundParams, DrumKitPreset, DrumSoundModel } from '../types/audio';

export const DEFAULT_SOUND_PARAMS: Record<DrumInstrument, DrumSoundParams> = {
  clave: { pitchMultiplier: 1, decayMultiplier: 1, toneFrequency: 2500, snappy: 0.5, drive: 0 },
  kick: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 100, snappy: 0.5, drive: 0.4 },
  snare: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 1000, snappy: 0.8, drive: 0.3 },
  rimshot: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 2200, snappy: 0.5, drive: 0.2 },
  clap: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 1200, snappy: 0.7, drive: 0.3 },
  hihat_closed: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 7500, snappy: 0.6, drive: 0.1 },
  hihat_open: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 6500, snappy: 0.7, drive: 0.2 },
  hihat_pedal: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 5000, snappy: 0.5, drive: 0.1 },
  tom_high: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 300, snappy: 0.4, drive: 0.2 },
  tom_mid: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 220, snappy: 0.4, drive: 0.2 },
  tom_low: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 150, snappy: 0.4, drive: 0.3 },
  crash: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 4500, snappy: 0.7, drive: 0.3 },
  ride: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 7000, snappy: 0.6, drive: 0.2 },
  ride_bell: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 840, snappy: 0.8, drive: 0.2 },
  tambourine: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 8500, snappy: 0.7, drive: 0.2 },
  cowbell: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 800, snappy: 0.5, drive: 0.3 },
  conga_high: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 500, snappy: 0.5, drive: 0.2 },
  conga_low: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 350, snappy: 0.5, drive: 0.2 },
  shaker: { pitchMultiplier: 1.0, decayMultiplier: 1.0, toneFrequency: 6000, snappy: 0.5, drive: 0.1 }
};

export class DrumSynthesizer {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private limiter: DynamicsCompressorNode;
  private channelGains: Map<DrumInstrument, GainNode> = new Map();
  private channelPanners: Map<DrumInstrument, StereoPannerNode> = new Map();
  private isInitialized = false;
  private soundParams: Record<DrumInstrument, DrumSoundParams> = { ...DEFAULT_SOUND_PARAMS };
  private sampleKit: SampleKit;
  private useSamples = true;
  public loadSamples() { return this.sampleKit.load(); }
  public setSampleMode(enabled: boolean) { this.useSamples = enabled; }
  public stopVoices() { this.sampleKit.stop(); }
  private currentModel: DrumSoundModel = 'acoustic_custom';

  constructor(audioContext: AudioContext) {
    this.ctx = audioContext;
    this.sampleKit = new SampleKit(audioContext);
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.limiter = this.ctx.createDynamicsCompressor();
    this.limiter.threshold.value = -4;
    this.limiter.knee.value = 4;
    this.limiter.ratio.value = 12;
    this.limiter.attack.value = 0.003;
    this.limiter.release.value = 0.12;
    this.masterGain.connect(this.limiter);
    this.limiter.connect(this.ctx.destination);
    this.setupChannels();
  }

  public setSoundParam<K extends keyof DrumSoundParams>(instrument: DrumInstrument, key: K, value: DrumSoundParams[K]) {
    if (this.soundParams[instrument]) {
      this.soundParams[instrument] = {
        ...this.soundParams[instrument],
        [key]: value
      };
    }
  }

  public getSoundParams(): Record<DrumInstrument, DrumSoundParams> {
    return this.soundParams;
  }

  public setAllSoundParams(params: Record<DrumInstrument, DrumSoundParams>) {
    this.soundParams = { ...params };
  }

  public applyKitPreset(preset: DrumKitPreset) {
    this.currentModel = preset.model;
    const baseParams: Record<DrumInstrument, DrumSoundParams> = { ...DEFAULT_SOUND_PARAMS };

    // Apply preset overrides
    (Object.keys(preset.params) as DrumInstrument[]).forEach((inst) => {
      if (preset.params[inst]) {
        baseParams[inst] = {
          ...baseParams[inst],
          ...preset.params[inst]
        };
      }
    });

    this.soundParams = baseParams;
  }

  public getContext(): AudioContext {
    return this.ctx;
  }

  public getMasterNode(): AudioNode {
    return this.limiter;
  }

  public async initAudio(): Promise<void> {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.isInitialized = true;
  }

  private setupChannels() {
    const instruments: DrumInstrument[] = [
      'clave', 'kick', 'snare', 'rimshot', 'clap',
      'hihat_closed', 'hihat_open', 'hihat_pedal',
      'tom_high', 'tom_mid', 'tom_low',
      'crash', 'ride', 'ride_bell',
      'tambourine', 'cowbell',
      'conga_high', 'conga_low', 'shaker'
    ];

    instruments.forEach((inst) => {
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.9, this.ctx.currentTime);

      let panner: StereoPannerNode | null = null;
      if (typeof this.ctx.createStereoPanner === 'function') {
        panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(0, this.ctx.currentTime);
        gain.connect(panner);
        panner.connect(this.masterGain);
        this.channelPanners.set(inst, panner);
      } else {
        gain.connect(this.masterGain);
      }

      this.channelGains.set(inst, gain);
    });
  }

  public updateMixer(mixerState: DrumMixerState) {
    const now = this.ctx.currentTime;
    const anySolo = Object.values(mixerState).some(ch => ch.isSolo);

    (Object.keys(mixerState) as DrumInstrument[]).forEach((inst) => {
      const state = mixerState[inst];
      const gainNode = this.channelGains.get(inst);
      const pannerNode = this.channelPanners.get(inst);

      if (!gainNode || !state) return;

      let targetGain = 0;
      if (anySolo) {
        targetGain = state.isSolo && !state.isMuted ? state.volume : 0;
      } else {
        targetGain = state.isMuted ? 0 : state.volume;
      }

      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setTargetAtTime(targetGain, now, 0.01);

      if (pannerNode && typeof state.pan === 'number') {
        pannerNode.pan.cancelScheduledValues(now);
        pannerNode.pan.setTargetAtTime(state.pan, now, 0.01);
      }
    });
  }

  public setMasterVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.01);
  }

  /**
   * Trigger a drum instrument sound at exact AudioContext time
   */
  public trigger(instrument: DrumInstrument, time: number, velocity: number = 0.8): void {
    if (!this.isInitialized && this.ctx.state === 'running') {
      this.isInitialized = true;
    }

    const channelNode = this.channelGains.get(instrument) || this.masterGain;
    const vel = Math.max(0.01, Math.min(1.0, velocity));

    if (this.useSamples && this.sampleKit.trigger(instrument, time, vel, channelNode, this.soundParams[instrument])) return;

    switch (instrument) {
      case 'clave':
        this.playRimshot(time, vel, channelNode);
        break;
      case 'kick':
        this.playKick(time, vel, channelNode);
        break;
      case 'snare':
        this.playSnare(time, vel, channelNode);
        break;
      case 'rimshot':
        this.playRimshot(time, vel, channelNode);
        break;
      case 'clap':
        this.playClap(time, vel, channelNode);
        break;
      case 'hihat_closed':
        this.playHiHatClosed(time, vel, channelNode);
        break;
      case 'hihat_open':
        this.playHiHatOpen(time, vel, channelNode);
        break;
      case 'hihat_pedal':
        this.playHiHatPedal(time, vel, channelNode);
        break;
      case 'tom_high':
        this.playTom(time, vel, 210, 120, channelNode);
        break;
      case 'tom_mid':
        this.playTom(time, vel, 150, 85, channelNode);
        break;
      case 'tom_low':
        this.playTom(time, vel, 105, 55, channelNode);
        break;
      case 'crash':
        this.playCrash(time, vel, channelNode);
        break;
      case 'ride':
        this.playRide(time, vel, channelNode);
        break;
      case 'ride_bell':
        this.playRideBell(time, vel, channelNode);
        break;
      case 'tambourine':
        this.playTambourine(time, vel, channelNode);
        break;
      case 'cowbell':
        this.playCowbell(time, vel, channelNode);
        break;
      case 'conga_high':
        this.playConga(time, vel, 380, 240, channelNode);
        break;
      case 'conga_low':
        this.playConga(time, vel, 240, 150, channelNode);
        break;
      case 'shaker':
        this.playShaker(time, vel, channelNode);
        break;
    }
  }

  /**
   * Metronome Click Trigger (High beep for 1, lower beep for other beats)
   */
  public triggerMetronome(time: number, isAccent: boolean, volume: number = 0.5): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1600 : 950, time);

    const gainVal = (isAccent ? 0.9 : 0.6) * volume;
    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  // --- Individual Synth Implementations ---

  private playKick(time: number, vel: number, dest: AudioNode) {
    const params = this.soundParams.kick;
    const pitch = params.pitchMultiplier || 1.0;
    const decay = params.decayMultiplier || 1.0;
    const drive = params.drive || 0.4;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = this.currentModel === 'electronic_808' ? 'sine' : 'sine';
    // Punchy pitch drop envelope
    osc.frequency.setValueAtTime(140 * pitch, time);
    osc.frequency.exponentialRampToValueAtTime(52 * pitch, time + 0.045 * decay);
    osc.frequency.exponentialRampToValueAtTime(32 * pitch, time + 0.28 * decay);

    // Amplitude envelope
    gain.gain.setValueAtTime(vel * (1.0 + drive * 0.4), time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32 * decay);

    // Click transient for punch
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(320 * pitch, time);
    clickOsc.frequency.exponentialRampToValueAtTime(60 * pitch, time + 0.015);
    clickGain.gain.setValueAtTime(vel * (0.4 + drive * 0.3), time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(gain);
    clickOsc.connect(clickGain);
    gain.connect(dest);
    clickGain.connect(dest);

    osc.start(time);
    clickOsc.start(time);
    osc.stop(time + 0.35 * decay);
    clickOsc.stop(time + 0.03);
  }

  private playSnare(time: number, vel: number, dest: AudioNode) {
    const params = this.soundParams.snare;
    const pitch = params.pitchMultiplier || 1.0;
    const decay = params.decayMultiplier || 1.0;
    const snappy = params.snappy !== undefined ? params.snappy : 0.8;
    const toneFreq = params.toneFrequency || 1000;

    // Body oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240 * pitch, time);
    osc.frequency.exponentialRampToValueAtTime(160 * pitch, time + 0.06 * decay);

    oscGain.gain.setValueAtTime(vel * (0.7 * (1.2 - snappy * 0.4)), time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12 * decay);

    // Snare wires noise
    const noiseBuffer = this.createNoiseBuffer(0.25 * decay);
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(toneFreq, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(vel * (0.85 * snappy), time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22 * decay);

    osc.connect(oscGain);
    oscGain.connect(dest);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);

    osc.start(time);
    noise.start(time);
    osc.stop(time + 0.16 * decay);
    noise.stop(time + 0.25 * decay);
  }

  private playRimshot(time: number, vel: number, dest: AudioNode) {
    const params = this.soundParams.rimshot;
    const pitch = params.pitchMultiplier || 1.0;
    const decay = params.decayMultiplier || 1.0;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650 * pitch, time);
    osc.frequency.exponentialRampToValueAtTime(420 * pitch, time + 0.02 * decay);

    gain.gain.setValueAtTime(vel * 0.75, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05 * decay);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.04 * decay);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(params.toneFrequency || 2200, time);
    filter.Q.setValueAtTime(4.0, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(vel * 0.6, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.035 * decay);

    osc.connect(gain);
    gain.connect(dest);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);

    osc.start(time);
    noise.start(time);
    osc.stop(time + 0.06 * decay);
    noise.stop(time + 0.04 * decay);
  }

  private playClap(time: number, vel: number, dest: AudioNode) {
    const burstCount = 3;
    const burstInterval = 0.011;
    const totalDuration = 0.22;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(totalDuration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time);
    filter.Q.setValueAtTime(1.8, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, time);

    // Initial claps flutter
    for (let i = 0; i < burstCount; i++) {
      const t = time + i * burstInterval;
      gain.gain.setValueAtTime(vel * 0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.05, t + burstInterval * 0.85);
    }
    // Main tail
    const mainTime = time + burstCount * burstInterval;
    gain.gain.setValueAtTime(vel * 0.8, mainTime);
    gain.gain.exponentialRampToValueAtTime(0.001, mainTime + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + totalDuration);
  }

  private playHiHatClosed(time: number, vel: number, dest: AudioNode) {
    this.playMetallicNoise(time, 0.045, 7500, vel * 0.65, dest);
  }

  private playHiHatOpen(time: number, vel: number, dest: AudioNode) {
    this.playMetallicNoise(time, 0.38, 6500, vel * 0.75, dest);
  }

  private playHiHatPedal(time: number, vel: number, dest: AudioNode) {
    this.playMetallicNoise(time, 0.06, 5000, vel * 0.45, dest);
  }

  private playCrash(time: number, vel: number, dest: AudioNode) {
    const duration = 1.3;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, time);
    filter.frequency.exponentialRampToValueAtTime(2500, time + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vel * 0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + duration);
  }

  private playRide(time: number, vel: number, dest: AudioNode) {
    const duration = 0.85;
    // Metal tone ring
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, time);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(vel * 0.35, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.7);

    // High sizzle
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(7000, time);
    filter.Q.setValueAtTime(3.0, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(vel * 0.5, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(oscGain);
    oscGain.connect(dest);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);

    osc.start(time);
    noise.start(time);
    osc.stop(time + duration);
    noise.stop(time + duration);
  }

  private playRideBell(time: number, vel: number, dest: AudioNode) {
    const duration = 0.9;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(840, time);
    osc2.frequency.setValueAtTime(1380, time);

    gain.gain.setValueAtTime(vel * 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  private playTom(time: number, vel: number, startFreq: number, endFreq: number, dest: AudioNode) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.22);

    gain.gain.setValueAtTime(vel * 0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.26);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.28);
  }

  private playTambourine(time: number, vel: number, dest: AudioNode) {
    this.playMetallicNoise(time, 0.12, 8500, vel * 0.55, dest);
  }

  private playCowbell(time: number, vel: number, dest: AudioNode) {
    const duration = 0.25;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(587, time); // D5
    osc2.frequency.setValueAtTime(845, time); // ~G#5

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, time);
    filter.Q.setValueAtTime(2.5, time);

    gain.gain.setValueAtTime(vel * 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  private playConga(time: number, vel: number, startFreq: number, endFreq: number, dest: AudioNode) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.09);

    gain.gain.setValueAtTime(vel * 0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(time);
    osc.stop(time + 0.18);
  }

  private playShaker(time: number, vel: number, dest: AudioNode) {
    const duration = 0.07;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vel * 0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + duration);
  }

  private playMetallicNoise(time: number, duration: number, cutoff: number, vel: number, dest: AudioNode) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(cutoff, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + duration);
  }

  private createNoiseBuffer(duration: number): AudioBuffer {
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}
