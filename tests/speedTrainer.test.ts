import { describe, it, expect } from 'vitest';
import { normalizeTrainer, trainerTempo } from '../src/domain/practice';
import { SpeedTrainerConfig } from '../src/types/audio';
const config: SpeedTrainerConfig = { enabled: true, startBpm: 100, targetBpm: 120, bpmStep: 5, barsPerStep: 4, currentCycleBars: 0 };
describe('Production speed trainer', () => {
  it('increments only once at a new completed training interval', () => {
    expect(trainerTempo(100, 3, 2, config, 200)).toBe(100);
    expect(trainerTempo(100, 4, 3, config, 200)).toBe(105);
    expect(trainerTempo(105, 4, 4, config, 200)).toBe(105);
    expect(trainerTempo(105, 0, 4, config, 200)).toBe(105);
  });
  it('normalizes training goals to the selected groove', () => {
    expect(normalizeTrainer({ ...config, startBpm: 200, targetBpm: 240, barsPerStep: 0 }, [40, 130])).toMatchObject({ startBpm: 130, targetBpm: 130, barsPerStep: 1 });
  });
  it('caps at target and groove limits, and never lowers the current tempo', () => {
    expect(trainerTempo(118, 4, 3, config, 200)).toBe(120);
    expect(trainerTempo(108, 4, 3, config, 110)).toBe(110);
    expect(trainerTempo(130, 4, 3, config, 200)).toBe(130);
    expect(trainerTempo(100, 4, 3, { ...config, enabled: false }, 200)).toBe(100);
  });
});
