import { describe, it, expect } from 'vitest';
import { FACTORY_PRESETS } from '../src/components/DrumKitStudio';
import { DEFAULT_SOUND_PARAMS } from '../src/audio/DrumSynthesizer';

describe('Drum Kit Presets & Sound Profiles', () => {
  it('provides all standard factory kit presets', () => {
    const presetIds = FACTORY_PRESETS.map(p => p.id);
    expect(presetIds).toContain('yamaha_psr');
    expect(presetIds).toContain('vintage_warmth');
    expect(presetIds).toContain('rock_heavy');
    expect(presetIds).toContain('gated_80s');
    expect(presetIds).toContain('electronic_808');
    expect(presetIds).toContain('jazz_maple');
  });

  it('has default sound parameters for all instruments', () => {
    expect(DEFAULT_SOUND_PARAMS.kick).toBeDefined();
    expect(DEFAULT_SOUND_PARAMS.snare).toBeDefined();
    expect(DEFAULT_SOUND_PARAMS.hihat_closed).toBeDefined();
    expect(DEFAULT_SOUND_PARAMS.kick.pitchMultiplier).toBe(1.0);
    expect(DEFAULT_SOUND_PARAMS.snare.snappy).toBeGreaterThan(0);
  });
});
