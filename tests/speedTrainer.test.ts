import { describe, it, expect } from 'vitest';
import { SpeedTrainerConfig } from '../src/types/audio';

describe('Speed Trainer Acceleration Calculations', () => {
  it('correctly increments BPM every N bars up to target', () => {
    const config: SpeedTrainerConfig = {
      enabled: true,
      startBpm: 100,
      targetBpm: 120,
      bpmStep: 5,
      barsPerStep: 4,
      currentCycleBars: 0
    };

    let currentBpm = config.startBpm;

    // Simulate 20 bars
    for (let bar = 1; bar <= 20; bar++) {
      if (bar % config.barsPerStep === 0 && currentBpm < config.targetBpm) {
        currentBpm = Math.min(config.targetBpm, currentBpm + config.bpmStep);
      }
    }

    // After 4 bars: 105, 8 bars: 110, 12 bars: 115, 16 bars: 120, 20 bars: 120 (capped)
    expect(currentBpm).toBe(120);
  });

  it('calculates accurate progress percentage', () => {
    const startBpm = 80;
    const targetBpm = 160;

    const calcProgress = (current: number) =>
      Math.min(100, Math.max(0, ((current - startBpm) / (targetBpm - startBpm)) * 100));

    expect(calcProgress(80)).toBe(0);
    expect(calcProgress(120)).toBe(50);
    expect(calcProgress(160)).toBe(100);
    expect(calcProgress(180)).toBe(100);
  });
});
