import { SAMPLE_FILES, selectSample } from '../domain/samples';
import { DrumInstrument } from '../types/rhythm';

declare global { interface Window { __GROOVE_SAMPLES__?: Record<string, string>; __GROOVE_CREDITS__?: string } }
export class SampleKit {
  private buffers = new Map<DrumInstrument, AudioBuffer[]>();
  private peaks = new Map<AudioBuffer, number>();
  private loading: Promise<void> | null = null;
  private takes = new Map<DrumInstrument, number>();
  private openHats = new Set<{ source: AudioBufferSourceNode; gain: GainNode; start: number }>();
  private voices = new Set<AudioBufferSourceNode>();
  constructor(private ctx: AudioContext) {}
  load(): Promise<void> {
    if (this.loading) return this.loading;
    this.loading = Promise.all(SAMPLE_FILES.map(async ({ instrument, layer, file }) => {
      const url = window.__GROOVE_SAMPLES__?.[file] ?? `./samples/${file}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      let response: Response;
      try { response = await fetch(url, { signal: controller.signal }); } finally { clearTimeout(timeout); }
      if (!response.ok) throw new Error(`Sample ${file}: HTTP ${response.status}`);
      const buffer = await this.ctx.decodeAudioData(await response.arrayBuffer());
      const samples = buffer.getChannelData(0);
      let peak = 0.01;
      for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
      this.peaks.set(buffer, peak);
      const layers = this.buffers.get(instrument) ?? [];
      layers[layer] = buffer;
      this.buffers.set(instrument, layers);
    })).then(() => undefined).catch(error => { this.loading = null; throw error; });
    return this.loading;
  }
  trigger(instrument: DrumInstrument, time: number, velocity: number, destination: AudioNode): boolean {
    const layers = this.buffers.get(instrument);
    if (!layers?.length) return false;
    // Three recorded dynamic layers, alternating left/right snare takes within each layer.
    const take = this.takes.get(instrument) ?? 0;
    this.takes.set(instrument, take + 1);
    const selection = selectSample(instrument, velocity, take)!;
    const source = this.ctx.createBufferSource();
    source.buffer = layers[selection.layer];
    const gain = this.ctx.createGain();
    // Level-match takes without flattening the requested musical dynamics.
    const peak = this.peaks.get(source.buffer) ?? 1;
    gain.gain.setValueAtTime(velocity * 0.7 / peak, time);
    source.playbackRate.value = selection.rate;
    source.connect(gain); gain.connect(destination);
    if (instrument === 'hihat_closed' || instrument === 'hihat_pedal') {
      for (const voice of this.openHats) {
        if (voice.start > time) continue;
        voice.gain.gain.setTargetAtTime(0, time, 0.008);
        voice.source.stop(time + 0.04);
        this.openHats.delete(voice);
      }
    }
    const hat = { source, gain, start: time };
    if (instrument === 'hihat_open') this.openHats.add(hat);
    this.voices.add(source);
    source.onended = () => { this.openHats.delete(hat); this.voices.delete(source); source.disconnect(); gain.disconnect(); };
    source.start(time);
    return true;
  }
  stop() {
    for (const source of this.voices) { try { source.stop(); } catch { /* already ended */ } }
    this.voices.clear(); this.openHats.clear();
  }
}
