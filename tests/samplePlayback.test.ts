import { afterEach, describe, expect, it, vi } from 'vitest';
import { SampleKit } from '../src/audio/SampleKit';
import { normalizeMix, sampleTuning } from '../src/domain/session';
function audioFixture() {
  const sources: any[] = [], gains: any[] = [], filters: any[] = [];
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn() });
  const ctx = {
    decodeAudioData: async () => ({ duration: 2, getChannelData: () => new Float32Array([0, 0.5, -0.5]) }),
    createBufferSource: () => { const node = { buffer: null, playbackRate: { value: 1 }, connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(() => { node.started = true; }), stop: vi.fn(() => { if (!node.started) throw new Error('Stop before start'); }), started: false, onended: null }; sources.push(node); return node; },
    createGain: () => { const node = { gain: param(), connect: vi.fn(), disconnect: vi.fn() }; gains.push(node); return node; },
    createBiquadFilter: () => { const node = { type: '', frequency: { value: 0 }, Q: { value: 0 }, connect: vi.fn(), disconnect: vi.fn() }; filters.push(node); return node; },
  };
  vi.stubGlobal('window', {});
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) })));
  return { kit: new SampleKit(ctx as unknown as AudioContext), sources, gains, filters };
}
afterEach(() => vi.unstubAllGlobals());
describe('Recorded sound tuning uses the actual audio graph', () => {
  it('plays neutral samples unchanged and applies pitch, lowpass and a shortened envelope to tuned notes', async () => {
    const { kit, sources, gains, filters } = audioFixture(); await kit.load();
    const neutral = sampleTuning(normalizeMix().kick);
    expect(kit.trigger('kick', 1, 0.8, {} as AudioNode, neutral)).toBe(true);
    expect(sources[0].playbackRate.value).toBe(1);
    expect(sources[0].stop).not.toHaveBeenCalled();
    expect(filters[0].frequency.value).toBe(20000);
    const tuning = sampleTuning(normalizeMix({ kick: { pitch: -2, decay: 0.5, brightness: 6000 } }).kick);
    kit.trigger('kick', 2, 0.8, {} as AudioNode, tuning);
    expect(sources[1].playbackRate.value).toBeCloseTo(2 ** (-2 / 12));
    expect(filters[1].frequency.value).toBe(6000);
    expect(gains[1].gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.0001, 2 + 1 / sources[1].playbackRate.value);
    expect(sources[1].start).toHaveBeenCalledWith(2);
    expect(sources[1].stop).toHaveBeenCalledWith(2 + 1 / sources[1].playbackRate.value + 0.015);
  });
  it('retains hi-hat choking and cleans filters/gains when voices finish', async () => {
    const { kit, sources, gains, filters } = audioFixture(); await kit.load();
    const tuning = sampleTuning(normalizeMix().hihat_open);
    kit.trigger('hihat_open', 1, 0.5, {} as AudioNode, tuning);
    kit.trigger('hihat_closed', 1.2, 0.5, {} as AudioNode, tuning);
    expect(gains[0].gain.setTargetAtTime).toHaveBeenCalledWith(0, 1.2, 0.008);
    sources[0].onended();
    expect(filters[0].disconnect).toHaveBeenCalledOnce();
    expect(gains[0].disconnect).toHaveBeenCalledOnce();
    kit.stop(); expect(sources[1].stop).toHaveBeenCalled();
  });
});
